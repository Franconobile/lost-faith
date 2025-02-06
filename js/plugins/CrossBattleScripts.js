//=============================================================================
// CrossBattleScripts.js
//=============================================================================


/*:
 * @plugindesc Cross Battle Scripts
 * @author Restart
 *
  + 
 * @help  
 * =============================================================================
 * +++ This file contains scripts for enemies and bullets, to make it easier
 * to make more complex ABS battles.
 *
 * Current contents:
 *
 * Repeat Move Route Logic:
 * (put each of these into a max frequency move route on repeat)
 * 
 * reflectOffWalls(initialX,initialY,faceTarg,seStart,seBounce)	
 * The event will move forward in the initial direction until it hits a wall, 
   and then reflects off of it, making the seBounce sound each time.
   Does not bounce off other events, so you should probably put this on an 'above' move route
   If faceTarg is true, it will rotate every time it bounces to face its new direction.
   seStart plays the first frame this unit is spawned.
 *
   Defaults: (TowardsPlayer,TowardsPlayer,false, no sound, no sound)
 *
 ***
 * followWalls(clockwise,initialX,initialY)
   The event will move in an (initialX,initialY) direction until it hits a wall.
   It will then follow walls clockwise or counterclockwise (depending on setting).
   Only works on walls of at least 1 block thickness, doesn't pay attention to events.
   So again, probably on an 'above' layer, unless you want it to stop whenever it hits events.
 *
   Defaults: ( false, 0 , 1)
 ***
 * horizDashAttacker(dashLength,leashX,leashY,battleCry,shieldDash,wallImpactAction)
 * This enemy will wander around its origin point in a rectangle, getting as far as 
   leashX horizontally and leashY vertically.
 
   Every three steps it check for the player - if it sees the player is lined up horizontally,
   it charges up, and then dashes rapidly at the player! 
   
   If battleCry is set to a sound name, it'll play that sound when charging up, otherwise
   it'll make the run sound.
   If shieldDash is true, the enemy is immune to being attacked while dashing.
   If wallImpactAction is true, if it hits the wall at the end of a dash, it will screenshake, lose its temporary invulnerability, and be stunned for a second
      
   Defaults: (5,5,3,'Run',false,false)
   
 */
 
 //USEFUL NOTES 
 // .isWallDir(direction) draws a rectangle around all your creature's altimit 
 // colliders, then checks to see if the edges or corners of the rectangle 
 // are touching a wall.
 //
 // Directions are keypad as usual, so '4' means 'center of the left side',
 // 9 means 'upper right corner', et cetera
 
 
 
// REFLECT OFF WALLS:

//this guy reflects off of walls (duh), but doesn't reflect off of events
// useful for making a bouncing laser shot, or one of those diagonal
// bouncing enemies from Zelda.  You know the ones.

//initialX and initialY are our starting vectors
//they get normalized automatically so don't worry about it.
//
//if not provided, this defaults to targeting the player, because why not?
//
//if faceTarg is true, then will rotate to face its new target whenever it bounces
//
//seStart plays when it's spawned
//seBounce plays when it reflects off a wall

Game_CharacterBase.prototype.reflectOffWalls = function(initialX,initialY,faceTarg,seStart,seBounce)
{
	
	if (!this.hasStartedReflecting)
	{
		if (!initialX && !initialY)
		{
			var initialX = $gamePlayer.x-this.x;
			var initialY = $gamePlayer.y-this.y;
			var veclength = initialX*initialX+initialY*initialY;
			if (veclength ==0){
				if ($gameTemp.isPlaytest()) 
				{
					console.log('event ' + this._eventId + ' is trying to hit the player while being AT the player, wtf')
				}
				initialY=1;
			}
				else
				{
				initialX /=veclength
				initialY /=veclength
				}
			
		}
		var veclength=Math.sqrt(initialX*initialX + initialY*initialY);
		
		this.currentVector= [initialX/veclength,initialY/veclength];
		
		this.rLoc(0.3*this.currentVector[0],0.3*this.currentVector[1]);
		this._moveTargetSkippable=true;
		if (faceTarg)
		{
			this.rotFaceTarg()
		}
		this.hasStartedReflecting=true;
		if (seStart)
		{
			AudioManager.playSe({name: seStart, pan: 0, pitch: 100, volume: 100});
		}
	}else{
		var oldVec=this.currentVector.slice() //.slice() copies the array
		//it will only fire the move route if it stops moving. in that case, we've either hit a wall horizontally or vertically
		
		//check horizontal
		var hitHoriz=false;
		var hitVert=false;
		if ((this.currentVector[0]>0 && this.isWallDir(6) ) || (this.currentVector[0]<0 && this.isWallDir(4) ) )
		{
			hitHoriz=true;
		}
		
		//check vertical
		if ((this.currentVector[1]>0 && this.isWallDir(2) ) || (this.currentVector[1]<0 && this.isWallDir(8) ) )
		{
			hitVert=true;
		}
		
		if (hitHoriz &&hitVert)
		{
			//if we hit both, check for clearance, and move whichever direction
			//is valid
			if(!this.isWallVec(-this.currentVector[0],this.currentVector[1]))
			{
				this.currentVector[0]=-this.currentVector[0];
			}else if(!this.isWallVec(this.currentVector[0],-this.currentVector[1]))
			{
				this.currentVector[1]=-this.currentVector[1];
			}else{
				//if we don't have a valid reflection across one axis, throw
				//up our hands and return whence we came
				this.currentVector[0]=-this.currentVector[0];
				this.currentVector[1]=-this.currentVector[1];
			}
		}else if (hitHoriz){
			this.currentVector[0]=-this.currentVector[0];
		}else if (hitVert)
		{
			this.currentVector[1]=-this.currentVector[1];
		}
		
		
		this.rLoc(0.3*this.currentVector[0],0.3*this.currentVector[1]);
		this._moveTargetSkippable=true;		

		
		if((this.currentVector[1] !== oldVec[1])||(this.currentVector[0] !== oldVec[0]))
		{
			if (seBounce)
			{
				AudioManager.playSe({name: seBounce, pan: 0, pitch: 100, volume: 100});
			}
			if (faceTarg)
			{
				this.rotFaceTarg()
			}
		}
	}

}



//this moves <initialX,initialY> until it hits a wall.  When it does, it starts moving along
//the wall - either clockwise or counterclockwise.
Game_CharacterBase.prototype.followWalls = function(clockwise,initialX,initialY)
{
	
	if (!this.hasStartedCrawling)
	{
		if (!initialX && !initialY)
		{
			initialX=0;
			initialY=1;
		}
		
		var dirVec=[2,4,6,8];
		this.wallDir=0;
		for (var index = 0; index<dirVec.length;index++)
		{
			if (this.isWallDir(dirVec[index]))
			{
				this.wallDir = dirVec[index];
				break;
				
			}
		}
		
		if (this.wallDir)
		{
			this.hasStartedCrawling=true;
		}else{
			this.rLoc(initialX,initialY)
		}
		
	}else{
		//we have started crawling.  
		var newx=0;
		var newy=0;
		if (clockwise)
		{
			var dirsInOrder=[8,9,6,3,2,1,4,7]
		}else{
			var dirsInOrder=[8,7,4,1,2,3,6,9]
		}

		var dirIndex=dirsInOrder.indexOf(this.wallDir)
		
		//if we just turned, lock our direction in place
		

		
		//First, check to see if the wall is still currently next to us.
		if (this.isWallDir(this.wallDir))
		{
			this.setDirectionFix(false);
			this._direction=dirsInOrder[(dirIndex+2+8)%8];
			this.setDirectionFix(true);
				
			//check ahead to see if we hit a wall.  If we didn't, scootch forward
			if(!this.isWallDir(dirsInOrder[(dirIndex+2 +8)%8]))
			{
				//check our front corner
				if(this.isWallDir(dirsInOrder[(dirIndex+1+8)%8]))
				{
					//scootch forward horizontally
					[newx,newy]=dir2vec(dirsInOrder[(dirIndex+2 +8)%8])
					
				}else{
					//okay we lost contact with our front sensor
					//scootch forward diagonally a LITTLE (prevents quivering at corners)
					[newx,newy]=dir2vec(dirsInOrder[(dirIndex+1 +8)%8]);
					newx /=2;
					newy /=2;
				}

			}else{
				//if we did, then change our wall direction 
				this.wallDir=dirsInOrder[(dirIndex+2 +8)%8];
/* 				this.setDirectionFix(false);
				this._direction=dirsInOrder[(dirIndex+4+8)%8];
				this.setDirectionFix(true); */
				//and scootch diagonally in our new direction
				[newx,newy]=dir2vec(dirsInOrder[(dirIndex+3 +8)%8]);
			}
			
		}else{
			//okay our halfway point is no longer touching 
			if (this.isWallDir(dirsInOrder[(dirIndex-1 +8)%8]))
			{
				//okay we can see the wall back behind us
				//scootch forward mostly in the direction the wall is located
				[newx,newy]=dir2vec(dirsInOrder[(dirIndex +8)%8]);
				var a =dir2vec(dirsInOrder[(dirIndex+1 +8)%8]);
				newx+=a[0]
				newy+=a[1]
				
				newx /=2;
				newy /=2;
			}else{
				//we can't see the wall!  Scootch backwards diagonally
				[newx,newy]=dir2vec(dirsInOrder[(dirIndex-1 +8)%8]);
				//update our facing
				this.wallDir=dirsInOrder[(dirIndex-2 +8)%8];
/* 				this.setDirectionFix(false);
				this._direction=dirsInOrder[dirIndex];
				this.setDirectionFix(true); */
			}
				
		}
		
		this.rLoc(newx*.3,newy*.3);
	
	}

}




// this enemy will wander around a set area and try to dash at the player horizontally when
// the player gets into range.
// it uses a simple finite state machine for the logic, which should be pretty easy to mod.
Game_CharacterBase.prototype.horizDashAttacker=function(dashLength,leashX,leashY,battleCry,shieldDash,wallImpactAction)
{
	
	if (!this.logicCycle) //runs first time, determines the area this enemy is allowed to move in
	{
		this.originX=this.x
		this.originY=this.y
		this.logicCycle=1;
	}
	this.touchDamage(true);

	var leashX=leashX||5;
	var leashY=leashY||3;
	var dashLength = dashLength || 5;
	var battleCry = battleCry || 'Run'

	if (this.distanceToPoint($gamePlayer.x,$gamePlayer.y)>(leashX+leashY)*1.5)
		{
				//if the player is really far away, return to wait mode
				
			this.setSelf('A',false)
			this._moveSpeed=4.3;//return quickly
			this.tLoc(this.originX,this.originY)
			this.logicCycle=1;
		}else{

			
			switch ( this.logicCycle ) {
				//move randomly three times
				case 1:
				if (shieldDash)
					{
						this.shield(false);
					}
					this.setDirectionFix(false)
				case 2:
				case 3:
					this._moveSpeed=3.5;
					var newX=Math.max(this.originX-leashX-this.x, Math.min(this.originX+leashX-this.x  ,3*(Math.random()-.5)))
					var newY=Math.max(this.originY-leashY-this.y, Math.min(this.originY+leashY-this.y  ,3*(Math.random()-.5)))
					this.rLoc(newX,newY);
				
				break;
				case 4:
					//step towards player
					this.rLoc(3*(Math.random()) * (.5 - (this.x>$gamePlayer.x)), 3*(Math.random()*(.5 - (this.y>$gamePlayer.y))));
					
				break;
				case 5:
					if ((Math.abs(this.y-$gamePlayer.y)<1) && (Math.abs(this.x-$gamePlayer.x)<dashLength*1.5)) //if we're kinda lined up prepare to charge.  Be willing to whiff a charge as well.
					{
						this.turnTowardPlayer();
						this._shakeData[0] = 40; //charge up with a little shake
						this._waitCount+=40;
						AudioManager.playSe({name: battleCry, pan: 0, pitch: 100, volume: 70});

					}else{
						this.rLoc(3*(Math.random()) * (.5 - (this.x>$gamePlayer.x)),3*(Math.random()-.5));
						this.logicCycle=0;
						// wander and reset to beginning of cycle
					}
					
					
				break;
				case 6:
					if (shieldDash)
					{
						this.shield(true);
					}
						
					this._moveSpeed=5; //not high enough to cause clipping
					
					
					// because creatures with a diagonal target will slide when hitting walls
					// you don't get a good wall impact if it hits, then slides for half a second
					// and then screenshakes
					// so wall impact action only moves exactly horizontally.
					if (wallImpactAction)
					{
						
						//shoot horizontally even if we're facing diagonally.
						this.rLoc(dashLength *(1- 2*[1,4,7].includes(this._direction )),0)
					}else{
						
						if (Math.abs(this.y-$gamePlayer.y)*2< Math.abs(this.x-$gamePlayer.x))
						{
							//if we're still in a valid dash location aim for the player
							this.shootPastPlayer(dashLength,0,0) 
						}else{
							//otherwise just run forward
							this.shootForward(dashLength)
						}
					}

					this.setDirectionFix(true)
					
					if (wallImpactAction)
					{
						this.logicCycle= 10 // jump ahead to special logic
					}else{
						this.logicCycle=0;  //otherwise reset
						this._waitCount+=30; //little delay before it returns to wandering
					}
				
				break;				
				case 11:
					//special impact action
					//check to see if we stopped our moveroute hitting a wall
					if (this.isWallDir(this._direction))
					{
						// if so, shake the screen
						$gameScreen.startShake(4, 8, 30);
						AudioManager.playSe({name: 'Thunder9', pan: 0, pitch: 150, volume: 100});
						//delay the next step
						this._waitCount=50
						//make it vulnerable
						this.shield(false)
						//make it knockback for a second
						this.battler()._ras.knockback[1] =60;
					}
				 
				default: 
				this.logicCycle=0;
			}
			this.logicCycle++
		}
}




//fires a machinegun for as long as the player holds down the fire key 
//or until they run out of ammo or hit the maximum number of bullets.
//handler for multihit player weapons
//put this into a weapon tool
//this is intended only for player use (obviously)
ToolEvent.prototype.autoFireWeapon = function(bulletType,fireRate,fireMax,chargeup,walkingpose,wiggle)
{
	var bulletType = bulletType || 51; // you really SHOULD define an attack for this, 
	//but defaulting to the sword slash in the test project so it fails gracefully.
	var fireRate = fireRate || 4; // an okay default
	var fireMax = fireMax || 100; // default to shooting one hundred times!
	var chargeup = chargeup || 0; //duration before it starts shooting
	var walkingpose = walkingpose || false;
	var wiggle = wiggle || 0;
	this.fireCount = this.fireCount ||0 // count how many shots we've made
	
	
	if (this.chargeup){this.fireMax+=1}
	
	//since this is a player-only bullet anyway,
	//it's easiest to store the wiggle information in the player character
	//probably a #gameDevCrime but whatever
	if (wiggle)
	{
		//full wiggle once (so left->right=>left)
		// or 1 -> -1 -> 1
		$gamePlayer.wiggleStep = 2*Math.abs(1-2*(this.fireCount/(fireMax)))-1;
	}else{
		$gamePlayer.wiggleStep=undefined
	}

	
	if ((this.fireCount==0) &&(this.chargeup))
	{
		//play chargeup sound effect
		SoundManager.playSoundMX(Moghunter.ras_ChargingSE);
		
		this._waitCount+=this.chargeup;//delay the fire handler for the chargeup duration
		//add chargeup duration 
		$gamePlayer.battler()._ras.cooldownDuration+=this.chargeup+this.extraCooldown;
		$gamePlayer.battler()._ras.poseDuration+=this.chargeup;
		
	}else{
		//if we have bullets left, shoot.
		//otherwise erase this event.
		
		if(Input.isPressed(Moghunter.ras_buttonWeapon) && (this.fireCount<fireMax) )
		{
			$gamePlayer.act(bulletType)//our generic multibullet
		}else{
			this.erase();
		}

		this._waitCount+=fireRate;
	}
	this.fireCount++;
	
	//if this is set to walking pose pose for this tool then we extend the pose 
	//set by this handler with each shot
	// if not I assume you know what you're doing.
	if(walkingpose)
	{
		if($gamePlayer.battler()._ras.poseDuration>0)
		{
			$gamePlayer.battler()._ras.poseDuration+=fireRate+1;
		}
		
		if($gamePlayer.battler()._ras.cooldownDuration>0)
		{
			$gamePlayer.battler()._ras.cooldownDuration+=fireRate+1;
		}
	}

}

