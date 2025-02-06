//=============================================================================
// Cross Engine Graphicsfix (alpha0.20.6.09E)
// CrossGraphicsFix.js
//=============================================================================

//-----------------------------------------------------------------------------
/*:
 * @plugindesc Cross Engine Graphics Fix.  Put below Cross Engine, GALV_CamControl, UltraMode7 & YEP_GridFreeDoodads
 * @author Restart
 + 
 * @help  
 * =============================================================================
 *  Cross Engine Graphics Fix
 * Gets rid of graphic glitches and jitter.
 * 
 * 
 * - Fixes 1 pixel jitter of events, doodads, and parallaxes.
 * Works pretty well, though not 100% of the time.  
 * 
 * Works way better with Galv's cam control enabled, though it's not strictly needed.
 * Get it at https://galvs-scripts.com/2015/11/27/mv-cam-control/
 * If you're using Ultra Mode 7, then you don't need Galv's camera control.
 *
 * This plugin does NOT fix the jitter on altimit's debug hitboxes; 
 * they're debug only and I didn't think it was worth the effort, since
 * any needed changes are embedded in collider drawing code.
 *
 * Note: doodad PREVIEWS will be off by one pixel diagonally if you have 
 * GALV_CamControl on while editing them.  They display in the same place
 * with galv camera on and off, the preview is just screwy.
 * so turn off galv camera while adding doodads (not that you want to have
 * it on anyway because galv camera overrides the jump-to-doodad function
 * in yanfly's doodads anyway)
 * +++
*/

var Imported = Imported || {}
Imported.CrossJitterFix=true;


if (!Imported.Blizzard_UltraMode7)
{

	if (!Imported.YEP_CoreEngine)
	{//yanfly has something which handles this, if we aren't using his core engine, solve it ourselves

		// take this from RPG_objects.  Since we altered the displayX() function we gotta
		// use the function 

		// make our display nonrounded like this
		Game_Map.prototype.displayX = function() {
			return Math.ceil(this._displayX * this.tileWidth()) / this.tileWidth();
		};

		Game_Map.prototype.displayY = function() {
			return Math.ceil(this._displayY * this.tileHeight()) / this.tileHeight();
		};
		//update our adjustX and adjustY to call our revised functions instead of having fixed vals
		Game_Map.prototype.adjustX = function(x) {
			if (this.isLoopHorizontal() && x < this.displayX() -
					(this.width() - this.screenTileX()) / 2) {
				return x - this.displayX() + $dataMap.width;
			} else {
				return x - this.displayX();
			}
		};

		Game_Map.prototype.adjustY = function(y) {
			if (this.isLoopVertical() && y < this.displayY() -
					(this.height() - this.screenTileY()) / 2) {
				return y - this.displayY() + $dataMap.height;
			} else {
				return y - this.displayY();
			}
		};

	}
		
	if (Imported.Galv_CamControl)
	{

		// we  want to replace the existing galv code  
		
		//Game_Map.prototype.displayX = function() {return Math.round(this._displayX * Galv.CC.size) / Galv.CC.size};
		//Game_Map.prototype.displayY = function() {return Math.round(this._displayY * Galv.CC.size) / Galv.CC.size};
		
		// with 
		
		 Game_Map.prototype.displayX = function() {return Math.ceil(this._displayX * Galv.CC.size) / Galv.CC.size};
		Game_Map.prototype.displayY = function() {return Math.ceil(this._displayY * Galv.CC.size) / Galv.CC.size};
		
			Game_Map.prototype.parallaxOx = function() {
			if (this._parallaxZero) {
				return Math.ceil(this._parallaxX * this.tileWidth()); //added floor
			} else if (this._parallaxLoopX) {
				return this._parallaxX * this.tileWidth() / 2;
			} else {
				return 0;
			}
		};


		Game_Map.prototype.parallaxOy = function() {
			if (this._parallaxZero) {
				return Math.ceil(this._parallaxY * this.tileHeight()); // added floor
			} else if (this._parallaxLoopY) {
				return this._parallaxY * this.tileHeight() / 2;
			} else {
				return 0;
			}
		};
		
			
		if (Imported.YEP_GridFreeDoodads)
		{
			Sprite_Doodad.prototype.screenX = function() 
			{
				var value = this._data.x;
				var display = $gameMap._displayX;
				value -= display * this._tileWidth;
				if (value + this.width < 0 && $gameMap.isLoopHorizontal()) 
				{
					value += this._mapWidth;
				}
				return Math.floor(value);
			};

			Sprite_Doodad.prototype.screenY = function() 
			{
				var value = this._data.y;
				var display = $gameMap._displayY;
				value -= display * this._tileHeight;
				if (value + this.height < 0 && $gameMap.isLoopVertical()) 
				{
					value += this._mapHeight;
				}
				return Math.floor(value);
			};
			
		}

	}else{
		
		Game_Map.prototype.parallaxOx = function() {
			if (this._parallaxZero) {
				return Math.floor(this._parallaxX * this.tileWidth()); //added floor
			} else if (this._parallaxLoopX) {
				return this._parallaxX * this.tileWidth() / 2;
			} else {
				return 0;
			}
		};


		Game_Map.prototype.parallaxOy = function() {
			if (this._parallaxZero) {
				return Math.floor(this._parallaxY * this.tileHeight()); // added floor
			} else if (this._parallaxLoopY) {
				return this._parallaxY * this.tileHeight() / 2;
			} else {
				return 0;
			}
		};
		
			
		if (Imported&&Imported.YEP_GridFreeDoodads)
		{
			Sprite_Doodad.prototype.screenX = function() 
			{
				var value = this._data.x;
				var display = $gameMap._displayX;
				value -= display * this._tileWidth;
				if (value + this.width < 0 && $gameMap.isLoopHorizontal()) 
				{
					value += this._mapWidth;
				}
				return Math.ceil(value);
			};

			Sprite_Doodad.prototype.screenY = function() 
			{
				var value = this._data.y;
				var display = $gameMap._displayY;
				value -= display * this._tileHeight;
				if (value + this.height < 0 && $gameMap.isLoopVertical()) 
				{
					value += this._mapHeight;
				}
				return Math.ceil(value);
			};
			
		}

	}
		
			
		//parallax jitterfix
	/* 	Game_Map.prototype.parallaxOx = function() {
			if (this._parallaxZero) {
				return Math.floor(this._parallaxX * this.tileWidth()); //added floor
			} else if (this._parallaxLoopX) {
				return this._parallaxX * this.tileWidth() / 2;
			} else {
				return 0;
			}
		};


		Game_Map.prototype.parallaxOy = function() {
			if (this._parallaxZero) {
				return Math.floor(this._parallaxY * this.tileHeight()); // added floor
			} else if (this._parallaxLoopY) {
				return this._parallaxY * this.tileHeight() / 2;
			} else {
				return 0;
			}
		}; */




		// honestly I am not sure why this magic formula works, I brute forced seeing what the 
		// jitter offset was, found a pattern, and got this through trial and error
		// doubtless there's a better and simpler way of doing this, but having gotten to a 
		// zero jitter solution, I'll take the win.

		Game_CharacterBase.prototype.scrolledX = function()
		{
			var tw = $gameMap.tileWidth();
			return Math.ceil($gameMap.adjustX(this._realX)*tw*2)/(tw*2); 
		};

		Game_CharacterBase.prototype.scrolledY = function() 
		{
			var th = $gameMap.tileHeight();
			return Math.ceil( $gameMap.adjustY(this._realY)*th*2)/(th*2);
		}; 
		

}else{
	//if we are using ultra mode 7, then handle rotations differently
	Sprite_Character.prototype.characterPatternY = function()
	{
		//use our former patterny if it's disabled
		
		return (UltraMode7.rotateDirectionCross(this, true) )
	}
	
	
	UltraMode7.rotateDirectionCross = function(charSprite, clockwise)
	{
		const angle = $gameMap.ultraMode7Yaw.mod(360);
		
		//if we only have standard 4 directional sprites, don't bother with figuring out diagonals
		if(!charSprite._character._frames.custDirs)
		 {
		 	var myDir=charSprite._character.direction();
		 }else{
			 //if we do, try diagonals, fall back to standard directions
		 	var myDir=charSprite._character._direction8 || charSprite._character.direction();
		 }
		var newAngle=(dir2angle(myDir) + (clockwise - !clockwise) * (angle))
		
		//there's apparently some jitter when things are moving diagonally.
		//my best bet is that	 they're wandering over the +-45 degree marker
		//so I'm going to make it so we only change sprite sif our angle is different enough
		charSprite.oldAngle=charSprite.oldAngle || 0
		
		
		// if we're more than three degrees away from the last angle we changed at
		// then check if we need a change
		if (Math.abs(charSprite.oldAngle-newAngle)>3)
		{
			charSprite.oldAngle=newAngle;

			myDir = angle2dir(newAngle)
		}else{
			//otherwise use the old angle as before
			myDir=angle2dir(charSprite.oldAngle)
		}
		
		if(!charSprite._character._frames.custDirs)
		 {
					 //NUMPAD [0,1,2,3,4,5,6,7,8,9]
			myDir=angle2dir4(newAngle)
			var yPatternArray=[0,1,0,0,1,0,2,3,3,2];
			return(yPatternArray[myDir]);
		//I am assigning everything one step counterclockwise.
		//5 and 0 are facing forward, they're not real directions per se but no reason to tempt fate.
		
		 }else{
			 //we DO have a custom number of directions!  Now we have to switch based on it
			 var yPatternArray=[0,0,0,0,0,0,0,0,0,0];  //one image, one pattern
			 
			 switch(charSprite._character._frames.dirNum)
			 {
					  //NUMPAD [0,1,2,3,4,5,6,7,8,9]
				 case 1:
				 yPatternArray=[0,0,0,0,0,0,0,0,0,0];  //one image, one pattern
				 break;
				 case 2:
				 yPatternArray=[0,1,0,0,1,0,0,1,1,0]; //d2 : two-pose fake isometric where down=right and up=left
													  // (really just a down-diagonal sprite horizontally flipped
													  // with right in the first slot, left in the second slot)
													  //downright is 0, leftup is 1
				 break;
				 case -2:
				 yPatternArray=[1,1,1,0,1,1,0,1,0,0]; //d-2 : two-pose fake isometric where down=left and up=right
													  //downleft is 0, rightup is 1
				 break;
				 case 8:
				 
				 
				 if(charSprite._character._frames.dirMatrix)
				 {
					yPatternArray=charSprite._character._frames.dirMatrix;
				 }else{
					 //yPatternArray=[2,0,1,2,3,2,4,5,6,7];  // put invalid 0/5 directions as facing forward
				 }
				 break;
				 case 9:
				 yPatternArray=[2,0,1,2,3,4,5,6,7,8];  // put invalid 0 direction as facing forward
				 break;
			 }
			 return(yPatternArray[myDir]);
		 
		 }
		
	}
	
	//this handles things other than character facing (like key inputs), so redefine it here too
	UltraMode7.rotateDirection = function(direction, clockwise)
	{
		const angle = $gameMap.ultraMode7Yaw.mod(360);
		var newAngle=((dir2angle(direction) + (clockwise - !clockwise) * (angle))+3600)%360
		
		return angle2dir(newAngle);
	};
		
	//end our ultra mode seven special cases
}