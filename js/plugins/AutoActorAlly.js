/*:
 * @plugindesc Makes party members autonomously fight nearby enemies
 * @author Your Name
 * 
 * @param Detection Range
 * @desc How far followers can detect enemies
 * @default 6
 *
 * @param Attack Range
 * @desc How close followers need to be to attack
 * @default 1
 *
 * @param Attack Skill ID
 * @desc Skill ID to use for attacks
 * @default 69
 */

(function() {
    var parameters = PluginManager.parameters('AutoPartyMembers');
    var detectionRange = Number(parameters['Detection Range'] || 6);
    var attackRange = Number(parameters['Attack Range'] || 1);
    var attackSkillId = Number(parameters['Attack Skill ID'] || 69);

    var _Game_Follower_initMembers = Game_Follower.prototype.initMembers;
    Game_Follower.prototype.initMembers = function() {
        _Game_Follower_initMembers.call(this);
        this._target = null;
        this._targetType = 'none';
        this._state = 'follow';
        this._attackCooldown = 0;
        this._searchTimer = 0;
        this._moveTargetX = 0;
        this._moveTargetY = 0;
    };

    var _Game_Follower_update = Game_Follower.prototype.update;
    Game_Follower.prototype.update = function() {
        _Game_Follower_update.call(this);
        if (this.isVisible() && !this._moveRoute) {
            this.updateAutonomous();
        }
    };

    Game_Follower.prototype.updateAutonomous = function() {
        // Update search timer
        this._searchTimer++;
        if (this._searchTimer >= 30) {
            this._searchTimer = 0;
            this.updateTarget();
        }

        // Update attack cooldown
        if (this._attackCooldown > 0) {
            this._attackCooldown--;
        }

        // Execute behavior based on current state
        switch(this._state) {
            case 'follow':
                this.followPlayer();
                break;
            case 'chase':
                this.chaseTarget();
                break;
            case 'attack':
                this.attackTarget();
                break;
        }
    };

    Game_Follower.prototype.updateTarget = function() {
        // Clear target if invalid
        if (this._target && this._target._erased) {
            this._target = null;
        }

        // Find new target if needed
        if (!this._target) {
            var nearestEnemy = this.findNearestEnemy();
            if (nearestEnemy) {
                this._target = nearestEnemy;
                this._targetType = 'enemy';
                this._state = 'chase';
            } else {
                this._target = $gamePlayer;
                this._targetType = 'player';
                this._state = 'follow';
            }
        }
    };

    Game_Follower.prototype.findNearestEnemy = function() {
        var nearestDist = detectionRange;
        var nearestEnemy = null;
        
        $gameMap.events().forEach(function(event) {
            if (event && !event._erased && event.event().note.match(/<enemy_id\s*:\s*(\d+)>/i)) {
                var distance = $gameMap.distance(this.x, this.y, event.x, event.y);
                if (distance < nearestDist) {
                    nearestDist = distance;
                    nearestEnemy = event;
                }
            }
        }, this);
        
        return nearestEnemy;
    };

    Game_Follower.prototype.followPlayer = function() {
        var distance = $gameMap.distance(this.x, this.y, $gamePlayer.x, $gamePlayer.y);
        if (distance > 2) {
            this.moveTowardCharacter($gamePlayer);
        }
    };

    Game_Follower.prototype.chaseTarget = function() {
        if (!this._target) return;
        
        var distance = $gameMap.distance(this.x, this.y, this._target.x, this._target.y);
        if (distance > attackRange) {
            // Use AltimitMovement's movement system
            var dx = this._target.x - this.x;
            var dy = this._target.y - this.y;
            var length = Math.sqrt(dx * dx + dy * dy);
            if (length > 0) {
                dx /= length;
                dy /= length;
                this.moveVector(dx * this.stepDistance, dy * this.stepDistance);
            }
        } else {
            this._state = 'attack';
        }
    };

    Game_Follower.prototype.attackTarget = function() {
        if (!this._target || this._attackCooldown > 0) return;

        var distance = $gameMap.distance(this.x, this.y, this._target.x, this._target.y);
        if (distance > attackRange) {
            this._state = 'chase';
            return;
        }

        // Perform attack
        this.turnTowardCharacter(this._target);
        var actor = this.actor();
        if (actor) {
            // Create action with specified skill
            var action = new Game_Action(actor);
            action.setSkill(attackSkillId);
            
            // Apply skill effect
            if (this._target.event().note.match(/<enemy_id\s*:\s*(\d+)>/i)) {
                var enemyId = Number(RegExp.$1);
                var enemy = new Game_Enemy(enemyId, 0, 0);
                
                if (enemy) {
                    // Show animation
                    $gameTemp.requestAnimation([this._target], action.item().animationId);
                    
                    // Apply damage
                    var damage = action.makeDamageValue(enemy);
                    enemy.gainHp(-damage);
                    
                    // If enemy dies
                    if (enemy.hp <= 0) {
                        this._target._erased = true;
                        this._target = null;
                        this._state = 'follow';
                    }
                }
            }
        }

        // Set attack cooldown
        this._attackCooldown = 60;
    };

    // Helper function to calculate distance using AltimitMovement's system
    Game_Map.prototype.distance = function(x1, y1, x2, y2) {
        var dx = Math.abs(this.deltaX(x1, x2));
        var dy = Math.abs(this.deltaY(y1, y2));
        return Math.sqrt(dx * dx + dy * dy);
    };

})();