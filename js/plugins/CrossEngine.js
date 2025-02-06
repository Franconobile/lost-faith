//=============================================================================
// CrossEngine.js
//=============================================================================


/*:
 * @plugindesc Cross Engine (alpha0.20.6.26)
 * @author Restart
 *
 * @param Temp Invulnerability Flashing
 * @desc If set to zero, turned off.  If set to a nonzero number, will invoke the specified animation every 5 frames when a character has temporary invulnerability.  
 * @default 0
 *
 * @param Max Yanfly Events
 * @desc Maximum simultaneous spawned events using YEP_EventSpawner.  You shouldn't have to touch this.
 * @default 1000
 *
 * @param Autoguess Tool Y Offsets
 * @desc If 'on', the game will attempt to guess the y offset for tools which don't have one defined using the 'tool_offset_y' parameter.  If 'off', these will default to 0.
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @param Dedicated Standing Poses
 * @desc If 'on', game characters will have a separate _standing pose used
 when they aren't walking (rather than having a frame from the walk cycle).
 * @type boolean
 * @on Yes
 * @off No
 * @default false
 *
 *
 * @param Allow Idle Poses During Text Boxes
 * @desc If 'on', idle poses can happen during text boxes.  If off, they don't count down while text is onscreen.
 * @type boolean
 * @on Yes
 * @off No
 * @default false
 
 
 + 
 * @help  
 * =============================================================================
 * +++ A horrible fusion of the chrono engine and altimit movement.  
 * Still alpha, expect some jank.
 *  
 * There's a little code split off into CrossGraphicsFix to do misc graphics 
 * patches, because you can't be both above and below the same plugin.  
 * 
 * The demo project also incorporates Galv's camera plugin, which helps eliminate 
 * jitter.  Get it at https://galvs-scripts.com/2015/11/27/mv-cam-control/
 * Galv's a great guy and gave me permission to include it.
 * 
 * Official plugin thread for cross engine is here:
 * https://forums.rpgmakerweb.com/index.php?threads/122622/
 *
 * +++
 
 * Tips and Tricks:
 * 
 * If you want to have the damage hitbox in the actor's body, you can shift the 
 * sprite down, and shift the altimit collider down.  Both of these operations
 * will leave the hitbox in the default location, so your character will
 * get hit in the body, but have their tile-movement based on their feet.
 *
 * Chrono Engine's example project defaults a LOT of ranges to 0, which no longer
 * is appropriate for altimit.  If collision seems finnicky, that's probably the
 * reason, and you'll need to increase them to actually have some AOE 
 * (at least .2 tiles as a minimum).
 *
 * Put Altimit ABOVE Chrono Engine.  Put Cross Engine BELOW it 
 * (specifically, between MOG_ChronoToolHud and MOG_ChronoCT).
 *
 * Set Align Move Routes to Grid to 'false' in altimit parameters to make
 * your bullets move freely.
 *
 * Put CrossGraphicsFix at the end of everything.
 
 *** New Features ***
 
 ** Compatibility Fixes:
 * Altimit compatibility (duh)
 * Yanfly Event Spawner Compatibility (this also improves performance if you keep
 * spawning and destroying large numbers of events)
 * Yanfly Item Core Compatibility (note: you need to ENABLE midgame note parsing)
 * Ultra Mode Seven

 
 ** Minor bugfixes **
 * Minor bugfixes on some chrono engine stuff, reasons are in commments  
 * but nothing major enough to really be worth mentioning individually
 
 **Intelligent Pose Parsing:   It will now check for any files STARTING with the
 * base name and pose suffix, not just the verbatim name.  If you have 
 * $Harold(f5) as your image, and MOG_CharPoses requests a '_idle' pose, it will
 * still find $Harold(f5)_idle(f6), which means you can have different speeds, 
 * yoffsets, and frame counts for different animations.  I also made poses
 * case-insensitive, which means that if you're sloppy with that, your game 
 * will still run on mac and linux.
 ** If it can't find a pose, it will stick with the base pose, and whine about
 * it in the console (whining is playtest only)
 
 ** 8-directional sprites, and MORE!
 * You can now use (d8) to specify that your sprite sheet has 8 directions
 *
 * By default, cross engine parses this in strict number pad order, skipping 5
 * so downleft, down, downright, left, right, upleft, up, upright
 *
 * What if you're using a different diagonal movement plugin and don't want
 * to update your sprite sheets?  Those are supported too, with extra tags
 * Right after the (d8), include one of these: 
 * Use (8galv) for galv's format, 
 * (8vic) for victor's format, 
 * (8quasi) for quasi movement format
 * (8ccw) if you start at the right side and go counterclockwise
 * 
 * There are OTHER direction parameters you can use as well
 *
 * (d1) just means that you have a SINGLE image.  No more copy-pasting
 * a base image for every single direction.  
 * For bullets, make the single (d1) sprite point down and RotFaceTarg() 
 * will have them point in the direction they're moving.
 *
 * (d-1) ALSO has a single image, but this time it will horizontally flip
 * if your character is moving to the left.  
 * You'll need MOG_CharacterMotion for this, but if you have Chrono Engine
 * of course you have it.
 * 
 * (d2) and (d-2) are fake isometric.  
 * You have two images, which are assigned to up and left, and down and right,
 * or vice versa.  
 * 
 * (d9) is like (d8), but including an image for 5 as well.
 
  
 ** Posing and Acting have been split:  No longer are you forced to lock your 
 * character in place, immobile, while he swings his sword!  If you specify 
 * different act duration and pose duration numbers, 'tool_pose_duration' will 
 * determine how long the animation plays, while 'tool_act_duration' will 
 * determine how long the character is frozen.  Finally, there's a 
 * 'tool_cooldown_duration' number to lock out extra attacks without locking 
 * out movement.
 * For backwards compatibility purposes, if you assert either POSE or ACT 
 * individually, it will assume that pose and act durations are the same.
 *


 ** Prettier Rotations:   Rotations now rotate around the default bottom
 * of the character, rather than the bottom of the sprite.  This comes 
 * into play when you change the sprite center using (x53) or (y24) or 
 * whatever.  If you make a wheel, you can center it using the proper 
 * filename offset , and have the wheel spin!
 *  Q: What if you want your wheel to rotate around the center, but also
 * want the sprite displaced up or down?
 *  A: Use YEP_EventSpriteOffset - that one will just move the sprite 
 * without influencing the rotation.

 ** Basic preloader function: If you have a problem where, when changing 
 * event pages or images, a character's whole spritesheet flashes on screen, 
 * that's caused by loading lag.  You can solve this by invoking 
 * ImageManager.preloadPoses('basespritename')
 * So if you're fighting Ralph, putting in ImageManager.preloadPoses('Ralph')
 * will also load 'Ralph_idle', 'Ralph_attack(f4)', etc
 * This also helps prevent lag when it has to load files midbattle.
 
 ** Standing Pose separate from idle pose!
 * If you enable standing sprites in plugin options, characters will idle
 * in the _standing pose!  Great if you're using a more realistic walking
 * sheet, which doesn't incorporate a standing pose as one of the frames.
 * 
 * Note that this requires an idle pose in order to work, and will give way
 * to an idle pose defined with MOG_CharPoses at the appropriate time.
 * 
 * If you don't actually want an 'idle' pose separate from just standing 
 * around, you can just use the default MOG_CharPoses idle pose as your
 * standing pose and ignore this feature
 
 ** Walking and shooting together!  
 * Remember how in megaman games, pressing the fire button puts out his gun,
 * and doesn't interfere in the walk cycle?  Anything tagged as (walking)
 * will do just that (make sure that the walk cycles in both sheets match).
 
 * What if you have a (walking) sprite and the player stops moving?  
 * Make a sheet with the same name with _static appended, which will be used 
 * while the player is stationary!  


 *** NEW PLUGIN COMMANDS:***

 ** Plugin command: disable_idleposes
 *  it disables the idle poses, for cutscenes where they might not be 
 *  appropriate!
 
 

 *** New Event Properties:***
 * ._inMotion : because altimit changes how isMoving() works, it no longer 
 * is an effective method of checking whether a character is acutally moving.
 * Since that's tied into all SORTS of things and messing with it causes issues
 * I'm just creating a new reliable ._inMotion which handles all this itself.
 * I have changed over the dash pose and idle pose code to use this instead
 
 
 
 *** New Event functions:***
 * .setRotationRate(degrees) : sets the rotation rate of an event, so it spins
 * .setTargetAngle (degrees) : sets an angle you want something to rotate TO
		note, this is direction-dependant by default; 
		if you are rotating at 1 degree/second and want 
		to go to 90 degrees, if you are at 91 degrees 
		now it'll go around the long way
 * .setRotationFlexible()	 : ^ if you have a target and a speed, it will go
		in either direction to reach it
		(so it will go from 91->90)
 * .clearRotationRate()     :  clears your rotation speed, target, and 
		flexibility, leaving it at whatever angle 
		it currently is set to.
 * .clearAllRotation()	 : clears ALL rotation stuff and returns it to the
		original angle.
 * .rLoc(x,y)		 : a helper function that sets the move target
		Relative to current Location. Short name to 
		make for easy move route scripting.  Note that 
		this is superior to just spamming a ton of 
		individual movements, as even on highest
		frequency there IS a noticeable pause when 
		it calculates the next step. 
		(Try shooting a bullet and running in the same
		direction to pan the camera - the difference
		is noticeable)
 * .tLoc(x,y) : a helper function.  Like rLoc, but goes directly
		towards the TARGET location (it's not relative)
 * .rotFaceTarg() : Rotate to face the direction it's travelling 
		(based on its move target).
		Good for bullets
 * .rotFaceTargFlip() : Rotate to face the direction it's travelling 
		(based on its move target).
		Also flips it horizontally if it's moving left.
 * .rotFacePlayer() : Rotate to face the player (good for bullets or 
		a pointer or something)
 * .rotFaceEvent(event)	 : Rotate to face an event.
		All of the rotFace functions take into account 
		your current direction when rotating, but don't 
		change it.  So when firing bullets, you still
		need to turn the bullet to face the player, 
		otherwise the direction the bullet is facing
		won't match the way it looks, and guarding
		will be all screwy.
 * .shootPastPlayer(range,xoffset,yoffset) : goes towards the
    player's position, or a position <xoffset,yoffset> away from
    the player, for a distance of range tiles.
 * .shootForward(range,xoffset,yoffset) : goes in the direction
    it's currently facing for a distance of range tiles.
 * .shootForwardInaccurate(badAngle,moveDist,angleFrac) :
    goes in the direction it's currently facing for moveDist tiles,
	with angle deviation randomly selected from +- badAngle.
	If you specify angleFrac, it'll override the random generation,
	if you want a machine gun weapon to have a nice wave-pattern.

 *** Things I Changed Because I Like This Way Better ***
  * Enemies which have touchdamage on are now dangerous from every direction,
    at all times (not just when they are explicitly trying to move into you).  
    If they hit you they will play a _melee animation (if it exists).

  * Knockback duration and temporary invulnerability have been decoupled a bit, 
    so it's harder to get serially hitstunned.
  
  * Characters which are temporarily invincible now flash
  
  * There's a new "stun knockback" that you can add in the enemy notes, which 
    means the enemy with that tag will take the same number of hitstun frames
    as a normal enemy, but it will not move from its original location.

  * Hookshot retracts faster than it flies out, and if it hits an invalid target
    it makes a 'tink' sound and retracts EXTRA fast.
	
  * Pose animations now execute the same number of times regardless of what
    _moveSpeed is set to (normally RMMV has higher movespeed mean that frames
    advance faster).  So if your shooting animation plays fully once at speed 4,
    it'll play exactly once at speed 3 and speed 5.  
    NOTE: using the pose_fixed_time tool tag, or setting the tool_act_duration
    without a specified pose will keep the old behavior (Which plays for a fixed
    period of time, at potentially different speeds)
 */

	var Imported = Imported || {};
	Imported.CrossEngine = true;
	var CrossEngine = CrossEngine || {};

if(!Imported.MOG_ChronoEngine)
{
	console.log('Cross Engine is not detecting base Chrono Engine, everything will break now.')

}

if(!Imported.MOG_CharPoses)
{
		console.log('Cross Engine is not detecting MOG_CharPoses, I recommend that you include it')

}

    CrossEngine.parameters = PluginManager.parameters('CrossEngine');
	
	CrossEngine.MaxEventSpawn = Number(CrossEngine.parameters['Max Yanfly Events'] || 1000);
	CrossEngine.GuessToolY = (String(CrossEngine.parameters['Autoguess Tool Y Offsets']) == 'true') || false;
	CrossEngine.StandingPoses = (String(CrossEngine.parameters['Dedicated Standing Poses']) =='true') || false;
	CrossEngine.damageFlash = Number(CrossEngine.parameters['Temp Invulnerability Flashing'] || 0)
	CrossEngine.idleMessage = (String(CrossEngine.parameters['Allow Idle Poses During Text Boxes']) == 'true') || false;

//number of frames of delay for transitioning from walk to standing once you're no longer moving
if (CrossEngine.StandingPoses)
{
	CrossEngine.StandDelay=5;  
}
/////////////////////////////////////////////////////////////////////////////////////
// helper functions that SHOULD be in JS but aren't
/////////////////////////////////////////////////////////////////////////////////////

Math.degrees = function(radAngle)
 {
 return radAngle*(180/Math.PI);
 }
 
Math.radians = function(degAngle)
 {
 return degAngle * (Math.PI/180);
 }

//this is altimit's method of deciding which angle goes to which direction
//We need to use this for compatibility because it is NOT the same as using a raw angle.
angle2dir = function(angle)
{
	var direction = Math.radians(angle) / Math.PI;


	var direction8 = Math.round( ( direction + 1 ) * 4 ) % 8; // 8 directions
	switch ( direction8 ) {
	case 0:
	  //this._direction8 = Direction.LEFT;
	  return 4;
	  break;
	case 1:
	  //this._direction8 = Direction.UP_LEFT;
	  return 7;
	  break;
	case 2:
	  //this._direction8 = Direction.UP;
	  return 8;
	  break;
	case 3:
	  //this._direction8 = Direction.UP_RIGHT;
	  return 9;
	  break;
	case 4:
	  //this._direction8 = Direction.RIGHT;
	  return 6;
	  break;
	case 5:
	  //this._direction8 = Direction.DOWN_RIGHT;
	  return 3;
	  break;
	case 6:
	  //this._direction8 = Direction.DOWN;
	  return 2;
	  break;
	case 7:
	  //this._direction8 = Direction.DOWN_LEFT;
	  return 1;
	  break;
	}
}

// convert from an angle to a direction8
angle2dirPrecise = function(angle)
{
	angle = (angle %360 + 360)%360; // normalize to 0->360 range
	var conversionArray=[6,3,2,1,4,7,8,9,6]; // start at the right and move clockwise
	var dangle = Math.floor((angle +22.5)/45); // remember we cut at the halfway point between our angles
	return conversionArray[dangle];
}


// convert from an angle to a classic 4-direction
angle2dir4 = function(angle)
{
	angle = (angle %360 + 360)%360; // normalize to 0->360 range
	var conversionArray=[6,2,4,8,6]; // start at the right and move clockwise
	var dangle = Math.floor((angle +45)/90); // remember we cut at the halfway point between our angles
	return conversionArray[dangle];
}

// convert from an angle to a direction
dir2angle = function(direction8)
{
	//if we have a direction of 0 or 5 set our angle output to 0 arbitrarily
	if (direction8==0)
	{
		return 0
	}
	if (direction8==5)
	{
		return 0
	}
	var conversionArray=[6,3,2,1,4,7,8,9]; // start at the right and move clockwise
	var indexval = conversionArray.indexOf(direction8)
	return indexval*45;
}

//go from a direction to a vector.  Not normalized
dir2vec = function(direction8)
{
	var vecx = [0 , -1 , 0 , 1 , -1 , 0 , 1 , -1, 0 , 1];
	var vecy = [0 , 1 , 1 , 1, 0 ,0 ,0 ,-1 ,-1 ,-1];
	return [vecx[direction8],vecy[direction8]]
}

//the same but normalized
dir2vecNorm = function(direction8)
{
	var vecx = [0 , -0.707 , 0 , 0.707 , -1 , 0 , 1 , -0.707, 0 , 0.707];
	var vecy = [0 , 0.707  , 1 , 0.707 , 0  , 0 , 0 , -0.707 ,-1 ,-0.707];
	return [vecx[direction8],vecy[direction8]]
}

 //returns angle in degrees to go from A to B
angleA2B = function(sourceEvent,destinationEvent)
{
	return( 270+(Math.atan2( sourceEvent.y-destinationEvent.y, sourceEvent.x-destinationEvent.x ) -Math.PI/2)*180/Math.PI)
}

//returns angle between two points given as xy coordinates
xy2Angle = function(sourceX,sourceY,destX,destY)
{
	return( 270+(Math.atan2( sourceY-destY, sourceX-destX ) -Math.PI/2)*180/Math.PI)
}

// gives the closest keyboard direction to an event 
dirA2B = function(sourceEvent,destinationEvent)
{
	return angle2dir(angleA2B(sourceEvent,destinationEvent));
}

vec2dir = function(xcoord,ycoord)
{
	if (xcoord==0)
	{
		if (ycoord>0){return 8}
		if (ycoord<0){return 2}
		return 5;
	}
	if (ycoord==0)
	{
		if (xcoord>0){return 6}
		if (xcoord<0){return 4}
		return 5;
	}
	return angle2dir( 270+(Math.atan2( xcoord, ycoord ) -Math.PI/2)*180/Math.PI)
}

//set your own selfswitch on or off, using this.setSelf('A',true), for instance
Game_CharacterBase.prototype.setSelf = function(switchName,switchValue)
{
var key = [$gameMap._mapId, this._eventId, switchName];
$gameSelfSwitches.setValue(key, switchValue);
}

///////////////////////////////////////////////////////////////////////////////////////
// Character Motion Helper Functions
///////////////////////////////////////////////////////////////////////////////////////

//===============================
//sets target location to coordinates (short so can see in movement route window)
Game_CharacterBase.prototype.tLoc = function(xcoord,ycoord,skippable)
{
	this._moveTargetX = xcoord; 
	this._moveTargetY = ycoord; 
	this.setDirectionVector(xcoord-this.x,ycoord-this.y); // turn
	this._moveTarget = true; 
	if (skippable==undefined)
	{
		this._moveTargetSkippable = true; 
	}else{
		this._moveTargetSkippable = skippable; 
	}
}
//the same, but RELATIVE to your location
// note: doesn't work on looping maps, blame altimit
Game_CharacterBase.prototype.rLoc = function(xcoord,ycoord,skippable)
{
	this._moveTargetX = xcoord+this.x; 
	this._moveTargetY = ycoord+this.y; 
	this.setDirectionVector(xcoord,ycoord); // turn
	this._moveTarget = true; 
	if (skippable==undefined)
	{
		this._moveTargetSkippable = true; 
	}else{
		this._moveTargetSkippable = skippable; 
	}
}

//calculates the distance from an event to a given point.
Game_CharacterBase.prototype.distanceToPoint = function(xcoord,ycoord)
{
	var distance = Math.sqrt( (this.x-xcoord)*(this.x-xcoord) + (this.y-ycoord)*(this.y-ycoord) );
	return distance;
}

//requires tool_diagonal_angle to be OFF
//do a turn towards player on this first, so it actually is aimed properly for guarding
Game_CharacterBase.prototype.rotFacePlayer = function (){
	var vx = $gamePlayer.x - this.x;  
	var vy = $gamePlayer.y - this.y;   
	this.setDirectionVector( vx, vy );
	if (this._frames.dirNum == 4)
	{
		var direcArray = [0,-90,0,0,-90,0,90,180,180,90];//number pad directions -> angle.  
	}else{
		
			 
	//I am assigning everything one step counterclockwise.
	//5 and 0 are facing forward, they're not real directions per se but no reason to tempt fate.
    //return (this._character.direction() - 2) / 2; //original code which didn't handle diagonals

		 //we DO have a custom number of directions!  Now we have to switch based on it
		 switch(this._frames.dirNum)
		 {
			      //NUMPAD [0,1,2,3,4,5,6,7,8,9]
			 case 1:
			 var direcArray=[0,0,0,0,0,0,0,0,0,0];  //one image, one pattern
			 //image is facing DOWN
			 break;
			 case 2:
			 var direcArray=[45,-45,45,45,-45,45,45,-45,-45,45]; //d2 : two-pose fake isometric where down=right and up=left
											      // (sprite sheet is a down-diagonal sprite horizontally flipped
												  // with right in the first slot, left in the second slot)
			 break;
			 case -2:
			 var direcArray=[-45,-45,-45,45,-45,-45,45,-45,45,45]; //d-2 : two-pose fake isometric where down=left and up=right
			 break;
			 case 8:
			 case 9:
			 var direcArray=[0,-45,0,45,-90,0,90,-135,180,135]; 
			 break;
		 }
		
	}
	
	if (Imported.Blizzard_UltraMode7)
	{
		//if we're using ultra mode seven then compensation for weird direction stuff
		this.setAngle((3600 + ((Math.atan2( vy, vx ) -Math.PI/2)*180/Math.PI + direcArray[UltraMode7.rotateDirection(this.direction(),true)]))%360);

		
	}else{
			
		this.setAngle((3600 + ((Math.atan2( vy, vx ) -Math.PI/2)*180/Math.PI + direcArray[this.direction()]))%360);
	}
}



//////////////////////////////////////////////////////////////////////////////
// Cross Engine Proper begins here:
///////////////

var _crossengine_game_sys_init = Game_System.prototype.initialize
Game_System.prototype.initialize = function() {
	 _crossengine_game_sys_init.call(this);
	//create a list of image files in our character directory.  
	// This is necessary for the automatic pose recognition
	// so for example you can have $Character(f6).png and $Character(f6)_idle(f3).png
	// and the default pose code to apply _idle will detect the right character name
	//
	this.crossEngine={};
	var fs = require ("fs");
	//yanfly's doodads have a solution for path name changing when deployed
	//which I am using!
	var path = require('path');
	var base = path.dirname(process.mainModule.filename);
	//let dir = fs.readdirSync( './img/characters/' );
	let dir = fs.readdirSync( path.join(base, '/img/characters/'));
    this.crossEngine.characterNameList = dir.filter( elm => elm.match(new RegExp(`.*\.(png)`, 'ig')));
	this.crossEngine.characterNameListLC=['hello world'];//this should never appear in game.
	//slice off the .png extension
	for (var index =0; index<this.crossEngine.characterNameList.length;index++)
	{
		this.crossEngine.characterNameList[index]=this.crossEngine.characterNameList[index].slice(0, -4);
		//create a lower case version of it so that we can do case matching for poses
		this.crossEngine.characterNameListLC[index]=this.crossEngine.characterNameList[index].toLowerCase();
	}
	
	

	
};



// check if a pose exists for a given creature.  Helper function that 
// we can use to sanitize conditional things.
// returns whatever the pose actually is, or an empty string
// if it doesn't exist.
// Also, if it doesn't exist, then whine in the console.
Game_CharacterBase.prototype.doesPoseExist = function(suffix) {
	var poseIndex=$gameSystem.crossEngine.characterNameListLC.indexOf( (this._originalName.name + suffix).toLowerCase());
	var origFile=this._originalName.name + suffix;
    if (poseIndex>-1)
	{
		//console.log(newPose)
		var fullFileName=$gameSystem.crossEngine.characterNameList[poseIndex];
		return fullFileName.slice(this._originalName.name.length, fullFileName.length)
	}else{
		for (var index =0; index<$gameSystem.crossEngine.characterNameList.length;index++)
		{
			if ($gameSystem.crossEngine.characterNameListLC[index].startsWith(origFile.toLowerCase()))
			{
				var fullFileName=$gameSystem.crossEngine.characterNameList[index];
				return fullFileName.slice(this._originalName.name.length, fullFileName.length)
			}
		}
		if ($gameTemp.isPlaytest()) 
		{
			console.log('Could not find '+this._originalName.name + suffix )
		}
		return ""
	}
		
}

//==============================
// * From MOG_CharPoses.js
//==============================
// I have altered this with a fallback that CHECKS to see if a pose exists.
//if it DOES exist, then we proceed as normal.
//if it does NOT exist, then we first check to see if there's a pose with different
//parameters (like _idle(f3) instead of just _idle
//if that exists, then we use that one instead
//if it does not exist, we don't load anything
//and whine in the console about it

//BASICALLY:
// set your frames and speed and y offset and all that jazz
// at the end of your original image name
// AND at the end of any poses
// and everything will be fine and dandy
// if you have multiple versions of a pose file I think it PROBABLY just picks
// whichever is alphabetically first if you don't specify the exact file name
// but honestly that's a weird edge case and if you REALLY want to get that effect
// you're better off manipulating the framerate or y offset or whatever dynamically
// instead of having separate files

// This will cache the most suffix and pose, so it only scans the full file list
// once per pose change

// ALSO: since this scans once when the game initializes
// if your image files change midgame the list will get stale
// but like
// don't do that, alright?  That's weird, and if you have something that complex
// you should just code your own system.
Game_CharacterBase.prototype.setPose = function() {
	 this._poses.idle[3] = false;
	 this._poses.standing[1] = false;
	 //default to keeping the same pose
	 var newPose=this._originalName.name;
	 //if this has turned into a treasure box don't bother changing poses anymore
	 if (this._user.treasure[0] !=null)
	 {
		 //remove all offsets if we're now treasure
		 
		 this._frames.x=0;
		 this._frames.y=0;
		 if( Imported.YEP_EventSpriteOffset)
			 {
				   this._spriteOffsetX = 0;
					this._spriteOffsetY = 0;
			 }
			 return 'treasurebattlertool'
	 }
	 
	 if (this.isFaintPose()) {
		 newPose = this.setFaintPose();
     } else if (this.isKnockbackPose()) { 
	     newPose = this.setKnockbackPose();
     } else if (this.isGuardPose()) { 
	     newPose = this.setGuardingPose();		 
	 } else if (this.isActionPose()) {
		 newPose = this.setActionPose();
	 } else if (this.isVictoryPose()) {
		 newPose = this.setVictoryPose();	
	 } else if (this.isCastingPose()) {
		 newPose = this.setCastingPose();	
	 } else if (this.isAttackingPose()) {
		 newPose = this.setAttackingPose();			 	 	 
     } else if (this.isPickUPPose()) {
         newPose = this.setPickUPPose();
     } else if (this.isPushPullPose()) {
         newPose = this.setPushPullPose();	 
	 } else if (this.isDashingPose()) {
		 newPose = this.setDashPose();
	 } else if (this.isJumpingPose()) {
         newPose = this.setJumpPose();
	 } else if (this.isIdlePose()) {
	     newPose = this.setIdlePose();	 
	 } else if (this.isStandingPose()) {
	     newPose = this.setStandingPose();	 
	 };
	 // this code didn't do anything in stock chrono engine.  Mog was probably
	 // planning to expand this.  Commented out for now
	 /* if (this.isDiagonalDefaultPose()) {
		 newPose = this.setDiagonalDefaultPose();
	 } else {
         newPose = this._originalName.name;
     }; */
	 
	 newPose = this.setFlexibleStandPose(newPose);
	 if (newPose==this._poses.lastPoseAttempt)
	 {
		 return this._poses.lastPoseChoice
	 }
	 
	 //if we are different from our last attempt, update our last attempt
	 //this way we only go through the pose array fetching once per pose change
	 //and having an invalid pose request will only hit your console once per change in testing.
	 this._poses.lastPoseAttempt=newPose; 
	 //don't bother checking if we know the filename didn't change from base.
	if (newPose==this._originalName.name)
	{
		this._poses.lastPoseChoice=newPose;
		return newPose;
	}else{
		//if the pose exists, return with it.  Otherwise we will have to see if the
		//parameters are different
		
		var poseIndex=$gameSystem.crossEngine.characterNameListLC.indexOf( newPose.toLowerCase());
		if (poseIndex>-1)
		{
			//console.log(newPose)
			var fullFileName=$gameSystem.crossEngine.characterNameList[poseIndex];
			this._poses.lastPoseChoice=fullFileName;
			return fullFileName;
		}else{
			for (var index =0; index<$gameSystem.crossEngine.characterNameList.length;index++)
			{
				if ($gameSystem.crossEngine.characterNameListLC[index].startsWith (newPose.toLowerCase()))
				{
					var fullFileName=$gameSystem.crossEngine.characterNameList[index];
					this._poses.lastPoseChoice=fullFileName;
					return fullFileName;
				}
			}
			console.log('Could not find '+newPose +', using base image instead.')
			this._poses.lastPoseAttempt=newPose;
			this._poses.lastPoseChoice=this._originalName.name;
			return this._poses.lastPoseChoice;
		}
	}	
	
};

//if you change poses and loading gets lagged, the image size will update desynced
//from the base image.  This results in a flash of seeing every pose of a spritesheet
//for a single frame.
//you can avoid this by preloading the poses you need
//I don't have this set up to run automatically because this is a somewhat intensive
//operation and it'd be easy to bloat ram
// if you're willing to gamble you can try doing it yourself
//
// Invoke with ImageManager.preloadPosesNoSanityCheck('AFewLeadingCharacters')
// or ImageManager.preloadPoses('ExactNameOfBaseSprite')


//this preloader requires you to exactly match a base sprite - it'll load that sprite
//and every pose for it, and fail if that base sprite doesn't exist.
ImageManager.preloadPoses=function(baseName)
{
	//copied out of my doesposeesxist function
	//basically just loops through and loads everything that has this character name
	//as a prefix.
	//so if you have both 'Actor1' and 'Actor1_dash', putting in 'Actor1' will
	//preload both of those.  But if you put in 'Act', and don't have Act.png, it will
	//fail and complain in the console.
	var nameIndex=$gameSystem.crossEngine.characterNameListLC.indexOf( baseName.toLowerCase());
	var origFile=nameIndex;
    if (nameIndex>-1) // we need the base image to exist to find any poses
	{
		for (var index =0; index<$gameSystem.crossEngine.characterNameList.length;index++)
		{
			if ($gameSystem.crossEngine.characterNameListLC[index].startsWith(baseName.toLowerCase()))
			{
				var fullFileName=$gameSystem.crossEngine.characterNameList[index];
				this.reserveBitmap('img/characters/',fullFileName);
				if ($gameTemp.isPlaytest()) 
				{
					console.log('Preloaded '+fullFileName)
				}
			}
		}
		//in theory we could break once we detect an incorrect name but I'm not seeing
		// a significant performance hit from this file scan,
		// and I don't want to assume a strictly alphabetical file list
		// even if we PROBABLY have one.
		// for instance we can't assume that nameIndex is the first image in the list
		// because Actor.png is below Actor(24)_casting.png alphabetically
		// so I'm not gonna assume there are no other surprises
	}else{
		if ($gameTemp.isPlaytest()) 
		{
			console.log('Tried to preload, but could not find '+baseName )
		}
		return false
	}
	
}

//This will preload based on prefixes, without checking to see if there's an exact match
//for your image.  More flexible but won't warn you if it's trying to preload
//a character that no longer exists.
ImageManager.preloadPosesNoSanityCheck=function(baseName)
{
	//copied out of my doesposeesxist function
	//basically just loops through and loads everything with a given prefix.
	//no sanity checks, original pose doesn't need to exist.

	for (var index =0; index<$gameSystem.crossEngine.characterNameList.length;index++)
	{
		if ($gameSystem.crossEngine.characterNameListLC[index].startsWith(baseName.toLowerCase()))
		{
			var fullFileName=$gameSystem.crossEngine.characterNameList[index];
			this.reserveBitmap('img/characters/',fullFileName);
			if ($gameTemp.isPlaytest()) 
			{
				console.log('Preloaded '+fullFileName)
			}
		}
	}
	
}


//change the cache to respect our new pose flexibliity
Game_Character.prototype.preCachePoses = function() {
	if (!this._originalName) {return};
	if (this._originalName.name == '') {return};
	var _cachePoses = [];
    if (this._poses.dash[0]) {_cachePoses[0] = ImageManager.loadCharacter(this._originalName.name + this.doesPoseExist("_dash"))};
	if (this._poses.jump[0]) {_cachePoses[1] = ImageManager.loadCharacter(this._originalName.name + this.doesPoseExist("_jump"))};
	if (this._poses.idle[0]) {_cachePoses[2] = ImageManager.loadCharacter(this._originalName.name + this.doesPoseExist("_idle"))};
	if (Imported.MOG_PickupThrow && !this._eventId) {
		var pickPose = this.doesPoseExist("_pick");
		if (pickPose == "")
		{
			$gamePlayer._pickup.pose= false; //if we don't have a pick pose,
			//tell the game that!
		}else{
			_cachePoses[3] = ImageManager.loadCharacter(this._originalName.name + pickPose);
		}
		
	};
};
//I have implemented death poses, which only trigger if we define a _death for the character
//otherwise dead characters get the knockback pose as usual.
//a little overhead from checking to see if the posee exists but hopefully not too much
//==============================
// * do we need a faint Pose
//==============================
Game_CharacterBase.prototype.isFaintPose = function() {
	
	 if (!this.hasNoFaintPose && this.battler().isDead() && this.doesPoseExist('_death')) {return true
	 }else{
		 if (this.battler().isDead())
		 {
			 this.hasNoFaintPose=true;
		 }
	 };
};


//==============================
// * set faint Pose
//==============================
Game_CharacterBase.prototype.setFaintPose = function() {
	 if (this.battlerPoses()) {
		 this._poses.idle[1] = this._poses.idle[2];
	     return this._originalName.name + "_death";
	 };
	 return "";
};

//==============================
// * Update Collapse
//==============================
Sprite_Character.prototype.updateCollapse = function() {
     this.faceCharacterCR(-3,true,true);
};



//From MOG_CharPoses
//==============================
// * Set Character Frames
//==============================
// I have edited this so you can have both negative offsets for x and y
// AND it now checks the LAST offset, not the first one.
// this means that if you have a pose with a different number of frames
// than the default, it'll pick up on that!
// for example, if the base character is Bob(f3), you can now have
// Bob(f3)_punch(f12)
Game_Character.prototype.setCharacterFrames = function() {
	this.clearCharacterFrames();
	var frames = this._characterName.match(/(\(F(\d+\.*\d*))/gi)
	//if someone puts in '(f0)', it treats it as a default rpgmaker 3-frame back-and-forth cycle
	//only needed when you're trying to override a custom one, because (f3) goes 1-2-3-1-2-3.
	// while (f0) goes 1-2-3-2-1
	if (frames && !(frames == '(f0')) {
	   this._frames.enabled = true;
	   this._frames.index = 0;
	   this._frames.max = Number(frames[frames.length-1].match(/\d+/i));
	}
		//edited to include support for negative offsets
	var ex = this._characterName.match(/(\(X(-?\d+\.*\d*))/gi)
	if (ex) {this._frames.x = Number(ex[ex.length-1].match(/-?\d+/i))};
	var ey = this._characterName.match(/(\(Y(-?\d+\.*\d*))/gi)
	if (ey) {this._frames.y = Number(ey[ey.length-1].match(/-?\d+/i))};
	var sp = this._characterName.match(/(\(S(\d+\.*\d*))/gi)
	if (sp) {this._frames.speed = Number(sp[sp.length-1].match(/\d+/i))};
	
	//if we're doing a 'walking' type pose, that means we want to just
	//sustain that if a new attack wants that as well
	// (for example if we have a flamethrower and are walking around with it
	// each individual act call shouldn't reset our walking cycle)
	
	//if we were previously in a walking frame, or are moving
	//into a new walking frame, then don't change our pattern.
	if ((!this._actionWalking) && (!(this._inMotion && this._characterName.contains('(walking)'))))
	{
		if (this.enabled) {this._pattern = 0};
		this._pattern = this._frames.enabled ? 0 : 1;
	}
	
	if (this._characterName.contains('(walking)'))
	{
		this._actionWalking=true;
		
	}else{
		this._actionWalking=false;
	}
	
	//I got irritated when I wanted to use a single static image for events
	//but rpg maker forced me to have 4 versions of it in a file
	//in order to load it.  the (d#) tag will specify how many directions
	//there are of a given image.  Currently supported:
	//d1 : same in every direction.  
			// For rotation/ bullet purpose, image defaults to facing DOWN
	//d-1: single image, but horizontally flips when moving to the left
	//
	//d2 : two-pose fake isometric where down=right and up=left
						// (really just a down-diagonal sprite horizontally flipped
						// with right in the first slot, left in the second slot)
	//d-2 : two-pose fake isometric where down=left and up=right
	//d4 (default) : as standard rmmv.  Doesn't enable anything, passes through with no changes
	//d8 8 directional.  Goes like number pad (skipping 5 and 0).  
	//So downleft, down, downright, left, right, upleft, up, upright
	//d9 9 directional.  Goes like number pad (including 5 and skipping 0)
	// I checked to see if there was already a convention for 8dir sprite sheets
	// and it looks like there isn't (victor and galv are different), 
	// so I'm just making them match the number pad
	

	
	var poseDirs = this._characterName.match(/(\(D(-?\d+\.*\d*))/gi)
	if (poseDirs) 
	{
		poseDirs = Number(poseDirs[poseDirs.length-1].match(/-?\d+/i))
		if(poseDirs==-1)
		{
			this._frames.horizFlip=true;
			poseDirs=1;
		}
		
		//note that I am ignoring 4 as an option because it is the default.
		if ([1,2,-2,9].contains(poseDirs))
		{
		   this._frames.custDirs = true;
		   this._frames.dirNum = poseDirs;
		}
		if ([8].contains(poseDirs))
		{
			//there isn't any guiding standard on what order 8-directional poses should go
		   //since this is a compatibility plugin, I'm going to add in flexibility
		   //so you can just specify in filename how it's arranged.
		   
		   
		   //(8ccw)  counterclockwise starting at the right
		   //so [right, upright, up, upleft, left, downleft, down, downright]
		   //or if we are making a translation matrix with our dir8s
		   //	[6,9,8,7,4,1,2,3]
		   if (this._characterName.contains('(8ccw)'))
		   {
			   // problem is, that ^ is a imagefile->direction matrix, and while 
			   //  we could use .indexOf to translate using this, I'm just gonna
			   // reverse the operation instead
			   //note that since we have 0 and 5 as directions but not entries,
			   // they get the 'down' frame here, which is 6
				this._frames.dirMatrix=[6,5,6,7,4,6,0,3,2,1]
		   }
		   //(8galv)  galv's format (https://galvs-scripts.com/2015/12/12/mv-diagonal-movement/)
		   //appends diagonals onto the end
		   //[down, left, right, up, downright, downleft, upright, upleft]
		   //	[2,4,6,8,3,1,9,7]
		   if (this._characterName.contains('(8galv)'))
		   {
			   //note that since we have 0 and 5 as directions but not entries,
			   // they get the 'down' frame here, which is 0
				this._frames.dirMatrix=[0,5,0,4,1,0,2,7,3,6]
		   }
		   
		   //(8vic)  victor's format  ( https://victorenginescripts.wordpress.com/rpg-maker-mv/diagonal-movement/ )
		   //appends diagonals onto the end
		   //[down, left, right, up, downleft, upleft, downright, upright]
		   //	[2,4,6,8,1,7,3,9]
		   if (this._characterName.contains('(8vic)'))
		   {
			   //note that since we have 0 and 5 as directions but not entries,
			   // they get the 'down' frame here, which is 0
				this._frames.dirMatrix=[0,4,0,6,1,0,2,5,3,7]
		   }
		   
		   //(8quas)  quasi sprite format  ( https://forums.rpgmakerweb.com/index.php?threads/quasi-sprite.57648/ )
		   //appends diagonals onto the end
		   //[down, left, right, up, downleft, downright, upleft, upright]
		   //	[2,4,6,8,1,3,7,9]
		   if (this._characterName.contains('(8quasi)'))
		   {
			   //note that since we have 0 and 5 as directions but not entries,
			   // they get the 'down' frame here, which is 0
				this._frames.dirMatrix=[0,4,0,5,1,0,2,6,3,7]
		   }
		   
		   
		   //default is just to go in numpad order because it's a 1:1 correspondence
		   //	[1,2,3,4,6,7,8,9]
		   if (!this._frames.dirMatrix){this._frames.dirMatrix=[1,0,1,2,3,1,4,5,6,7]};
		   this._frames.custDirs = true;
		   this._frames.dirNum = poseDirs;
		}
	}
	
	
};

// add in a routine to clear our new custom direction data
var _cross_clear_character_frames = Game_Character.prototype.clearCharacterFrames;
Game_Character.prototype.clearCharacterFrames = function() {
	_cross_clear_character_frames.call(this)
	this._frames.custDirs=false;
	this._frames.dirNum=4;
}

//==============================
// * Refresh Action Mode
//==============================
//altered so that events which are set to 'step' mode will regain
//that setting after acting.  In base chrono engine step mode
// is always turned off after an event acts.
Game_CharacterBase.prototype.refreshActionMode = function() {
	if (this._poses.actionMode[1] && !this._poses.actionMode[0]) {
		if (this._preActStepAnime)//restore our stepping setting
		{
			this._stepAnime=true;
		}else{
			this._stepAnime = false;
		}
	};
    this._poses.actionMode[1] = this._poses.actionMode[0];
};

//==============================
// * Set Action Pose
//==============================
Game_CharacterBase.prototype.setActionPose = function() {
	 if (this.battlerPoses()) {
		this._poses.idle[1] = this._poses.idle[2];
		if ((this.name == this._originalName) )
		{
			this._preActStepAnime=this._stepAnime; //save our stepping setting if we're in a base sprite
		}
		this._stepAnime = true;
		this._poses.actionMode[0] = true;
	    return this._originalName.name + this.battler()._ras.poseSuffix;
     };
	 return "";
};


//==============================
// * from chrono engine 
//==============================
// touch damage functions
//==============================
// * can Touch Target
//==============================
Game_CharacterBase.prototype.canTouchTarget = function(character) {
	//made temporary invulnerability count as not being able to be
	//touched by touch attacks
	if (character.battler()._ras.collisionD > 0){return false;};
	if (!this.battler()) {return false};	
	if (this.battler().isActor()) {return false};	
	if (this.battler().restriction() >= 4) {return false};
	if (!this._user.touchDamage) {return false};
	if ($gameSystem.isChronoMode()) {return false};
	if (!character._user.isPlayer) {return false};
	if (!character.battler()) {return false};
	if (character.isKnockbacking()) {return false};
    if ($gameTemp._chaPosesEVRunning) {return false};
	//if (this.isMovementSucceeded()) {return false}  //commented out for altimit compatibility
	//return this.hitboxCheck(character); //upgraded to use altimit for calculating touches
	return $gameMap.isTouchingAB(this,character)//uses a function I added into altimit

};

//this is the older collider code before I got smart and just copied the
//existing altimit code and did tiny edits.
//returns TRUE if the first altimit-defined hitboxes touch, or FALSE if they do not.
//only use this if you want to have only part of an enemy be an actual hitbox.
Game_CharacterBase.prototype.hitboxCheck = function(character){
	//remove ones that don't have a location
	if (isNaN(this.x) || isNaN(this.y) || isNaN(this._realX) || isNaN(this._realY))
	{
		return false
	}
	if (isNaN(character.x) || isNaN(character.y) || isNaN(character._realX) || isNaN(character._realY))
	{
		return false
	}
	
	//Try to find out where our hurtbox is.  If there's just one circular collider
	//it's easy.  Otherwise... well, we'll just pick the first collider listed to figure out where to center it.
	//if we don't get anything (which should be impossible?) we just fallback to
	//standard whatever.
	var myColliderX=0;
	var myColliderY=0;
	var myColliderR=0;
	var characterColliderX=0;
	var characterColliderY=0;
	var characterColliderR=0;
	if (this.collider())
	{
		// if type is zero we only have one collider and it's a circle
		if (this.collider().type == 0)
		{
			myColliderX=this.collider().x;
			myColliderY=this.collider().y;
			myColliderR=this.collider().radius;
			
		}else if (this.collider().type == 1){
			//rectangle
			// some rectangles are defined as polygons, some aren't
			// dunno why that is but this'll check
			if (typeof(this.collider().right) == "undefined")
			{
				myColliderX=(this.collider().aabbox.right+this.collider().aabbox.left)/2;
				myColliderY=(this.collider().aabbox.top+this.collider().aabbox.bottom)/2;
				myColliderR=Math.sqrt(((this.collider().aabbox.right-this.collider().aabbox.left)/2)^2 + ((this.collider().aabbox.bottom-this.collider().aabbox.top)/2)^2);
			}else{
				
				myColliderX=(this.collider().right+this.collider().left)/2;
				myColliderY=(this.collider().top+this.collider().bottom)/2;
				myColliderR=Math.sqrt(((this.collider().right-this.collider().left)/2)^2 + ((this.collider().bottom-this.collider().top)/2)^2);
			}
		}else{
			//otherwise we gotta check the list of colliders and gamble
			// that whoever set up the colliders
			// put the first one as a circle, and that the circle was where they WANTED
			// the hurtbox to surround.
			// This is a LITTLE hacky but I think still reasonable
			myColliderX=this.collider().colliders[0].x;
			myColliderY=this.collider().colliders[0].y;
			myColliderR=this.collider().colliders[0].radius;
		}
	}
	//second verse same as the first, do the same for the target 
	//(which is almost certainly the player character)
	if (character.collider())
	{
		// if type is zero we only have one collider and it's a circle
		if (character.collider().type == 0)
		{
			characterColliderX=character.collider().x;
			characterColliderY=character.collider().y;
			characterColliderR=character.collider().radius;
			
		}else if (character.collider().type == 1){
			//rectangle
			if (typeof(character.collider().right) == "undefined")
			{
				characterColliderX=(character.collider().aabbox.right+character.collider().aabbox.left)/2;
				characterColliderY=(character.collider().aabbox.top+character.collider().aabbox.bottom)/2;
				characterColliderR=Math.sqrt(((character.collider().aabbox.right-character.collider().aabbox.left)/2)^2 + ((character.collider().aabbox.bottom-character.collider().aabbox.top)/2)^2);
			}else
			{
				characterColliderX=(character.collider().right+character.collider().left)/2;
				characterColliderY=(character.collider().top+character.collider().bottom)/2;
				characterColliderR=Math.sqrt(((character.collider().right-character.collider().left)/2)^2 + ((character.collider().bottom-character.collider().top)/2)^2);
			}
		}else{

			characterColliderX=character.collider().colliders[0].x;
			characterColliderY=character.collider().colliders[0].y;
			characterColliderR=character.collider().colliders[0].radius;
		}
	}
	

	var dx=0;
	var dy=0;
	if ((characterColliderR>0) && (myColliderR>0))
	{
		dx = this.x+myColliderX - characterColliderX-character.x;
		dy = this.y+myColliderY - characterColliderY-character.y;
		
		// distance is a HAIR under what it should be because if the colliders
		//are working properly, obviously they won't intersect
		var distSq = dx * dx + dy * dy -0.1; 
		var rSq=(characterColliderR+myColliderR)*(characterColliderR+myColliderR);
		// if we are out of range (the distance is bigger than our mutual size)
		// return false.
		if (distSq>rSq)
		{
			return false
		}
		
	}
	else
	{	//if we don't have collider radius for some weird reason we are gonna just
		//use the coordinates to determine distance
		dx = character.x - this.x;
		dy = character.y - this.y;
		var dis = Math.sqrt(dx *dx + dy*dy); // distance is calculated circularly
		//if we are out of range don't hit
		if (dis > this.battler()._ras.bodySize) {return false}; 
	}
	//checking facing ended up with weird nonsensical edge cases
	// I guess it's fine if just touching is enough
	return true;

}


//==============================
// * move Random Battler
//==============================
// patched to make wandering enemies wander a little more intelligently.
// in particular, they'll spend less time wallbonking.
// this only really works with 1 tile creatures, but honestly,
// I'm fine with that - setting random in the move route is more of a placeholder
// than a finalized move route for an enemy.
Game_Character.prototype.moveRandomBattler = function() {
	var dirPick=Math.randomInt(8)
	var dirVec=[1,2,3,4,6,7,8,9];//pick a random direction
	var newDir=0;
	var iterateDirection=2*Math.randomInt(2)-1; //this way it won't always favor clockwise or ccw
	var colliderbox = this.collider().aabbox;
	//offset where we're checking our coordinates based on the collider.
	var xedges=[colliderbox.left, (colliderbox.left+colliderbox.right)/2, colliderbox.right, colliderbox.right,(colliderbox.left+colliderbox.right)/2, colliderbox.right ]
	var yedges=[colliderbox.bottom,colliderbox.bottom,colliderbox.bottom,(colliderbox.bottom+colliderbox.top)/2 ,(colliderbox.bottom+colliderbox.top)/2 , colliderbox.top,colliderbox.top,colliderbox.top]
	for (var i = 0; i < dirVec.length; i++)
	{	
		//check which tiles are valid
		if (this.canPass(Math.floor(this.x+xedges[dirPick]),Math.floor(this.y+yedges[dirPick]),dirVec[dirPick]))
		{
			newDir=dirVec[dirPick]
			break;
		}else{
			dirPick =(dirPick +iterateDirection+8)%8;
		}
	}

	if (newDir ==0)
	{
		//we can't move! no directions are valid!  Pick one at random anyway, in case we have a collider problem
		//and whine about it.
		if ($gameTemp.isPlaytest()) 
		{
			console.log('Event ' + this._eventId + ' is trying to random move from '+this.x+','+this.y+', but is trapped!')
		}
		newDir=dirVec[dirPick];
	}
	var newX;
	var newY;
	[newX,newY] = dir2vecNorm(newDir);
	this.rLoc(newX,newY)
};



// extensions to altimit.
// check to see if two characters are colliding (assumes they're collideable)
 
Game_Map.prototype.isTouchingAB = function( characterA, characterB ) {
	var x=characterA.x;
	var y=characterA.y;
	var colliderA = characterA.collider();
	var bboxTests = this.getAABBoxTests( characterA, 0, 0 );

	// Gather any solid characters within the movement bounding box
	var loopMap = {};
	var characters = [characterB].filter( function( entry ) {
	  if ( characterA.collidableWith( entry ) ) {
		for ( var ii = 0; ii < bboxTests.length; ii++ ) {
		  if ( CrossCollider.aabboxCheck( bboxTests[ii].x, bboxTests[ii].y, bboxTests[ii].aabbox, entry._x, entry._y, entry.collider().aabbox ) ) {
			loopMap[entry] = bboxTests[ii].type;
			return true;
		  }
		}
	  }
	  return false;
	} );

	// Test collision with characters
	for ( var ii = 0; ii < characters.length; ii++ ) {
	  var entryX = characters[ii]._x;
	  var entryY = characters[ii]._y;

	  if ( loopMap[characters[ii]] == 1 ) { entryX += this.width(); }
	  else if ( loopMap[characters[ii]] == 2 ) { entryX -= this.width(); }
	  else if ( loopMap[characters[ii]] == 3 ) { entryY += this.height(); }
	  else if ( loopMap[characters[ii]] == 4 ) { entryY -= this.height(); }
	  else if ( loopMap[characters[ii]] == 5 ) { entryX += this.width(); entryY += this.height(); }
	  else if ( loopMap[characters[ii]] == 6 ) { entryX -= this.width(); entryY += this.height(); }
	  else if ( loopMap[characters[ii]] == 7 ) { entryX += this.width(); entryY -= this.height(); }
	  else if ( loopMap[characters[ii]] == 8 ) { entryX -= this.width(); entryY -= this.height(); }

	  if ( CrossCollider.intersect( x, y, colliderA, entryX, entryY, characters[ii].collider() ) ) {
		return true;
	  }
	}

return false;
}; 

//a check which doesn't care about priority / through / etc, that sort of stuff
Game_Map.prototype.isOverlappingAB = function( characterA, characterB ) {
	var x=characterA.x;
	var y=characterA.y;
	var colliderA = characterA.collider();
	var bboxTests = this.getAABBoxTests( characterA, 0, 0 );

	// Gather any solid characters within the movement bounding box
	var loopMap = {};
	var characters = [characterB].filter( function( entry ) {
		for ( var ii = 0; ii < bboxTests.length; ii++ ) {
		  if ( CrossCollider.aabboxCheck( bboxTests[ii].x, bboxTests[ii].y, bboxTests[ii].aabbox, entry._x, entry._y, entry.collider().aabbox ) ) {
			loopMap[entry] = bboxTests[ii].type;
			return true;
		  }
		}
	  return false;
	} );

	// Test collision with characters
	for ( var ii = 0; ii < characters.length; ii++ ) {
	  var entryX = characters[ii]._x;
	  var entryY = characters[ii]._y;

	  if ( loopMap[characters[ii]] == 1 ) { entryX += this.width(); }
	  else if ( loopMap[characters[ii]] == 2 ) { entryX -= this.width(); }
	  else if ( loopMap[characters[ii]] == 3 ) { entryY += this.height(); }
	  else if ( loopMap[characters[ii]] == 4 ) { entryY -= this.height(); }
	  else if ( loopMap[characters[ii]] == 5 ) { entryX += this.width(); entryY += this.height(); }
	  else if ( loopMap[characters[ii]] == 6 ) { entryX -= this.width(); entryY += this.height(); }
	  else if ( loopMap[characters[ii]] == 7 ) { entryX += this.width(); entryY -= this.height(); }
	  else if ( loopMap[characters[ii]] == 8 ) { entryX -= this.width(); entryY -= this.height(); }

	  if ( CrossCollider.intersect( x, y, colliderA, entryX, entryY, characters[ii].collider() ) ) {
		return true;
	  }
	}

	return false;
};

 
 //==============================
// * turn the character into a treasure ,but with hopefully better sanity checking
//==============================
Sprite_Character.prototype.setCharacterBitmapTreasure = function() {
	if (this._character._user.treasure[0] && this._character._user.treasure[0].iconIndex)
	   {
	   if (!this._imgIcon) {this._imgIcon = ImageManager.loadSystem("IconSet")};
			this.removeChild(this._upperBody);
			this.removeChild(this._lowerBody);
		   this.bitmap = this._imgIcon;
		   var iconIndex = this._character._user.treasure[0].iconIndex;
		   var sx = iconIndex % 16 * 32;
		   var sy = Math.floor(iconIndex / 16) * 32;
		   this.setFrame(sx,sy,32,32);
		   this.scale.x = 0.70;
		   this.scale.y = 0.70;
		   this.scale.rotation = 0;
		   this._character._through = true;
	   }
};
 

 //==============================
// * is Touch On Treasure
//==============================
Game_CharacterBase.prototype.isTouchOnTreasure = function(event) {
	if (!event) {return false};
	if (!event._user.treasure[0]) {return false};
	if (event._erased) {return false};
	
 	if (Math.abs(event._x - this._x)>1) {return false};
	if (Math.abs(event._y - this._y -.25)>1) {return false}; 
	//adjust treasures to be less finnicky 
	//- they should be easy to collect
	// also avoid treasures getting stuck in walls

	return true;
};

//==============================
// * clear Acting
//==============================
// I have removed the clearing collisionD in this function
// because it meant that temporary invulnerability would ALWAYS end
// when you stopped knocking back - ie, you'd never have ANY time
// when you were invulnerable and controllable.
Game_Battler.prototype.clearActing = function(skipCast) {
	this._ras.knockback = [0,0];
	this._ras.poseFixedTime = false;
	//this._ras.collisionD = 0;
	this._ras.superGuard = false;
	//this._ras.invunerable = false;
	this._ras.offsetX = 0;	
	this._ras.offsetY = 0;	
	
	this._ras.actDuration = 0;
	
	//splitting off posing from acting
	//this._ras.poseDuration = 0;
	//this._ras.poseSuffix = "";
	//this._ras.poseLoop = false;
	//this.clearPosing(skipCast);
	this._ras.hookshotUser = [false,false,this._ras.moveSpeed,null];
	this._ras.guard.active = false;
	this._ras.guard.chrono = false;
	if (skipCast) {this.clearRasCast()};
	this._ras.tool = null;
};

Game_Battler.prototype.clearPosing = function(){
	this._ras.poseFixedTime = false;
	this._ras.poseDuration = 0;
	this._ras.poseSuffix = "";
	this._ras.poseLoop = false;
}

//==============================
// * remove Forcing Move Tool
//==============================
// make it wipe posing as well as acting
Game_Character.prototype.removeForcedMoveTool = function() {
	this._tool.duration = 1;
	this._tool.waitD = false;
	$gameSystem._toolHookshotSprite = [null,null,0];
	if (this._tool.user && this._tool.user.battler()._ras.hookshotUser[0]) {
		this._tool.user.battler().clearActing();
		this._tool.user.battler().clearPosing();
		this._tool.user._moveSpeed = this._tool.user.battler()._ras.hookshotUser[2];
		if (this._tool.hookshot.target) {
		    this._tool.hookshot.target._user.hookshotTool = null;
		}
    	this._tool.user.battler()._ras.hookshotUser = [false,0,4,null];		
	};
};

Game_Chrono.prototype.executeTouchDamage = function(user,target) {
	//added these because I think that enemies should do an attack pose when attacking
	//if you don't have the pose it just fails silently no biggie
	if (user.hasMeleePose==undefined)
	{
		if(!Imported.MOG_CharPoses)
		{
			user.hasMeleePose=false;
		}else{
			var meleePose=user.doesPoseExist('_melee')
			user.hasMeleePose=meleePose;
		}
	}else{
		var meleePose=user.hasMeleePose
	}
	
	if (meleePose)
	{
		var fullFileName=user._originalName.name+meleePose
		var frames = fullFileName.match(/(\(F(\d+\.*\d*))/gi)

		//if we have custom frames, count them
		//otherwise default to 3
		
		if(frames)
		{
			frames = Number(frames[frames.length-1].match(/\d+/i)) 
		}else{
			frames=3;
		}
		var sp = fullFileName.match(/(\(S(\d+\.*\d*))/gi) || "(s0)".match(/(\(S(\d+\.*\d*))/gi)
		sp = Number(sp[sp.length-1].match(/\d+/i)) ||0;
		//we have frames and speed, so make the pose last as long as the melee pose does
		//'Cycle' is what I'm calling one 60th of a second here because we also
		//have animation frames.
		var animationCountPerCycle = (sp +1)* (1 + 0.5 * (user._inMotion && user.hasWalkAnime())) 
		
		var cyclesPerFrame = Math.ceil(user.animationWait()/animationCountPerCycle)
		
		
		user.battler()._ras.poseDuration = cyclesPerFrame*frames;
		//console.log(cyclesPerFrame*frames)
		user.battler()._ras.poseSuffix = meleePose;
		
		//stop it for a sec to attack you
		user.jump(0,0)
	}
	
	if (target.battler()._ras.collisionD > 0) {return};
	if (this.isGuardingDirectionTouch(user,target)) {
		this.executeGuardTouch(user,target);
	    return
	};
    var subject = user.battler(); 
    var action = new Game_Action(subject);
	action.setAbsSubject(subject)
	var oldHP = target.battler()._hp;	
	var coop = [];
	var skillId = user.battler().attackSkillId();
	action.setSkill(skillId);
	action.applyCN(target.battler(),coop);
	target.battler().startDamagePopup();	
	target.battler()._ras.collisionD = 60;//temp invulnerability for a full second
	if (oldHP > target.battler()._hp) {
        this.executeTouchTouchAfterHit(user,target,skillId);
	};
};

var Game_CharacterBase_update_for_damage = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
	//.isMoving doesn't really work in altimit
	// this fixes it with the addition of a new property which I can use to tell
	// if the character is actually like, moving
	// the problem seems to be that the isMoving gets cleared midway through
	// this update step (because the .updateMove in rpg_objects sets ._realX to equal .x)
	// but lots of things break if I monkey around with _isMoving
	// so I'm creating my own clone of it here.
	// this is true if the character is in motion and false if they aren't.
	// if you need to adapt any code that references .isMoving(), now you know
	// how to fix it!
	if (this.isMoving())
	{
	  this._inMotion=true;
	}else{
	  this._inMotion=false;
	}
	  
	Game_CharacterBase_update_for_damage.call( this );
	//adding in touch damage for all movement, if applicable.
	//first I'm checking to see if it CAN deal touchdamage
	//note that I ASSUME here that touch damage can only be dealt
	//to the player, and not to monsters.
	//this means i don't have to check every entity.
	if (this._user.touchDamage)
	{
		
		if (this.canTouchTarget($gamePlayer)) 
		{
			$gameChrono.executeTouchDamage(this,$gamePlayer) 
		};
	}
  };
  
//requires us to be facing our our movetarget first, then rotates the sprite
//so that it is perfectly in-line
//also requires tool_diagonal_angle to be OFF
Game_CharacterBase.prototype.rotFaceTarg = function (){
	//only do something if we have a move target!
	if (this._moveTarget)
	{
		this.setDirectionFix( true );
		//lock our direction once we start moving.

		//Ignore the diagonal ones for the moment, but I need them for array indexing.
		//var direcArray = [0,0, 0-90 ,0,-90-90,0,90-90,0,-180-90,0];//number pad directions -> angle.  
		if (!Imported.MOG_CharPoses || this._frames.dirNum == 4)
		{
			var direcArray = [0,-90,0,0,-90,0,90,180,180,90];//number pad directions -> angle.  Technically direction8 shouldn't matter, but if I ever extend to includ sprites for all 8 this should be futureproofed? 
		}else{
			
				 
		//I am assigning everything one step counterclockwise.
		//5 and 0 are facing forward, they're not real directions per se but no reason to tempt fate.
		//return (this._character.direction() - 2) / 2; //original code which didn't handle diagonals

			 //we DO have a custom number of directions!  Now we have to switch based on it
			 switch(this._frames.dirNum)
			 {
					  //NUMPAD [0,1,2,3,4,5,6,7,8,9]
				 case 1:
				 var direcArray=[0,0,0,0,0,0,0,0,0,0];  //one image, one pattern
				 break;
				 case 2:
				 var direcArray=[45,-45,45,45,-45,45,45,-45,-45,45]; //d2 : two-pose fake isometric where down=right and up=left
													  // (really just a down-diagonal sprite horizontally flipped
													  // with right in the first slot, left in the second slot)
				 break;
				 case -2:
				 var direcArray=[-45,-45,-45,45,-45,-45,45,-45,45,45]; //d-2 : two-pose fake isometric where down=left and up=right
				 break;
				 case 8:
				 case 9:
				 var direcArray=[0,-45,0,45,-90,0,90,-135,180,135]; 
				 break;
			 }
			
		}
		//my base direction is already in the correct quadrant
		//so let's just fine tune further
		
		//var newAngle=(xy2Angle(this.x,this.y,this._moveTargetX,this._moveTargetY) +direcArray[this._direction]) %360;
		
		
		
		// use our ultramode7 angle if appropriate
		if (Imported.Blizzard_UltraMode7)
		{
			var newAngle=(3600 + ((Math.atan2( this._moveTargetY-this.y, this._moveTargetX-this.x ) -Math.PI/2)*180/Math.PI + direcArray[UltraMode7.rotateDirection(this.direction(),true)]))%360  + $gameMap.ultraMode7Yaw.mod(360);
		}else{
			
			var newAngle=(3600 + ((Math.atan2( this._moveTargetY-this.y, this._moveTargetX-this.x ) -Math.PI/2)*180/Math.PI + direcArray[this.direction()]))%360;
		}
		
		this.setAngle(newAngle);
	}else{
		if ($gameTemp.isPlaytest()) 
			{
				console.log('Event ' + this._eventId + ' is supposed to rotate to a target, but it does not have one!')
			}		
	}

}

//rot face targ, but flip it so left and right will both have up pointing up
//assumes one-direction sprite that's pointing down originally.
Game_CharacterBase.prototype.rotFaceTargFlip =function(){
	this.rotFaceTarg();
	
	if ([1,4,7].contains(this.direction()) || ((this.direction() ==2 )&& (this._user.rotation[1]<180 )) || ((this.direction() ==8 )&& (this._user.rotation[1]<180 ) )  )
	{
		this._zoomData[0] = - Math.abs(this._zoomData[0])
		this._zoomData[2] = - Math.abs(this._zoomData[2])
	}else{
		this._zoomData[0] = Math.abs(this._zoomData[0])
		this._zoomData[2] = Math.abs(this._zoomData[2])
	}
	
	
}

//rot face event, but flip it so left and right will both have up pointing up
//assumes one-direction sprite that's pointing down originally.
Game_CharacterBase.prototype.rotFaceEventFlip =function(targEvent){
	this.rotFaceEvent();
	
	if ([1,4,7].contains(this.direction()) || ((this.direction() ==2 )&& (this._user.rotation[1]<180 )) || ((this.direction() ==8 )&& (this._user.rotation[1]<180 ) )  )
	{
		this._zoomData[0] = - Math.abs(this._zoomData[0])
		this._zoomData[2] = - Math.abs(this._zoomData[2])
	}else{
		this._zoomData[0] = Math.abs(this._zoomData[0])
		this._zoomData[2] = Math.abs(this._zoomData[2])
	}
	
	
}

//rot face player, but flip it so left and right will both have up pointing up
//assumes one-direction sprite that's pointing down originally.
Game_CharacterBase.prototype.rotFacePlayerFlip =function(){
	this.rotFacePlayer();
	
	if ([1,4,7].contains(this.direction()) || ((this.direction() ==2 )&& (this._user.rotation[1]<180 )) || ((this.direction() ==8 )&& (this._user.rotation[1]<180 ) )  )
	{
		this._zoomData[0] = - Math.abs(this._zoomData[0])
		this._zoomData[2] = - Math.abs(this._zoomData[2])
	}else{
		this._zoomData[0] = Math.abs(this._zoomData[0])
		this._zoomData[2] = Math.abs(this._zoomData[2])
	}
	
}



Game_CharacterBase.prototype.rotFaceEvent = function (targEvent){
	//rotates to face the target event
	var vx = targEvent.x - this.x;  
	var vy = targEvent.y - this.y;   
	if (this._frames.dirNum == 4)
	{
		var direcArray = [0,-90,0,0,-90,0,90,180,180,90];//number pad directions -> angle.  
			//I am assigning everything one step counterclockwise.
	//5 and 0 are facing forward, they're not real directions per se but no reason to tempt fate.
	}else{

		 //we DO have a custom number of directions!  Now we have to switch based on it
		 switch(this._frames.dirNum)
		 {
			      //NUMPAD [0,1,2,3,4,5,6,7,8,9]
			 case 1:
			 var direcArray=[0,0,0,0,0,0,0,0,0,0];  //one image, one pattern
			 break;
			 case 2:
			 var direcArray=[45,-45,45,45,-45,45,45,-45,-45,45]; //d2 : two-pose fake isometric where down=right and up=left
											      // (really just a down-diagonal sprite horizontally flipped
												  // with right in the first slot, left in the second slot)
			 break;
			 case -2:
			 var direcArray=[-45,-45,-45,45,-45,-45,45,-45,45,45]; //d-2 : two-pose fake isometric where down=left and up=right
			 break;
			 case 8:
			 case 9:
			 var direcArray=[0,-45,0,45,-90,0,90,-135,180,135]; 
			 break;
		 }
		
	}

	this.setAngle((3600 + ((Math.atan2( vy, vx ) -Math.PI/2)*180/Math.PI + direcArray[this.direction()]))%360);
}

//==============================
// * update Animation Count
//==============================
//edited from the version in MOG_CharPoses because that one is bugged
//
if (Imported.MOG_CharPoses)
{
	var _restart_charPose_charBase_updateAnimationCount = Game_CharacterBase.prototype.updateAnimationCount;
	Game_CharacterBase.prototype.updateAnimationCount = function() {
		_restart_charPose_charBase_updateAnimationCount.call(this);
		//edited to make it consistent with moving being faster than
		//idling with the step command
		//otherwise you get random resets mid walk cycle
		//
		if (this._inMotion && this.hasWalkAnime())
		{
		//if (this.isMoving() && this.hasWalkAnime()) {
			this._animationCount += 0.5*this._frames.speed;
		}
		
		//if we are acting AND walking at the same time, don't accelerate
		//our pose animation just becuase we're walking
		if (this._frames._actionWalk)
		{
			this._animationCount -= 0.5*(1+this._frames.speed);
		}
	};
}

 
//==============================
// * update Pattern
//==============================
var _restart_toolSys_gcharBase_updatePattern = Game_CharacterBase.prototype.updatePattern;
Game_CharacterBase.prototype.updatePattern = function() {
	//if we are being knocked around, we don't count as 'stationary', unless we're dead.
	if (this.isKnockbacking() && (this.battler()._ras.dead == false))
	{
		//set the timer of how long we've been stationary to zero, so we don't reset
		//the frames to the beginning.
		this._stopCount=0;
	}
    _restart_toolSys_gcharBase_updatePattern.call(this);
};



//==============================
// * set Knockback Duration
//==============================
//splitting out tool knockback parameters
ToolEvent.prototype.setKnockbackDuration = function(target,battler) {
   target.clearActing();
   target.battler().clearPosing();
   if (target.battler().isEnemy()) {
		if ( !(this._tool.knockbackD == undefined))
		{
			//if we specially defined a knockback duration, use it
			target.battler()._ras.knockback[1] = this._tool.knockbackD;
		}else{
			//otherwise default to either 40 frames, or slightly less than the invuln duration (whichever is bigger)
			target.battler()._ras.knockback[1]=Math.max(this._tool.collisionD-20,40)
			//40 to make sure they play all frames of hit animation before they vanish!
		}
	}else{
		if (target == $gamePlayer)
		{
			if ( !(this._tool.knockbackD == undefined))
			{
				//if we specially defined a knockback duration, use it
				target.battler()._ras.knockback[1] = this._tool.knockbackD;
			}else{
				//otherwise default to either 20 frames, or slightly less than the invuln duration (whichever is smaller)
				target.battler()._ras.knockback[1]=Math.max(Math.min(this._tool.collisionD-40,20) , 0)
			}
		}
	}
	
	
   //afaict 'knockbackType' is a dummy variable that's always zero
   //so I'm just commenting out this section from mog's code
   
/*    target.battler()._ras.knockback[0] = this._tool.knockbackType;
   target.battler()._ras.knockback[1] = this._tool.knockbackType === 0 ? this._tool.collisionD : 120; */

};


//this move route just forces 
ToolEvent.prototype.setKnockbackDirection = function (target,battler) {
	
	var preD = target.direction();
	if ((this._tool.hookshot.enabled && battler._ras._stunknockback) || (this._tool.hookshot.enabled && battler._ras._hookshotimmune))
	{
		
		//if "stun knockback" is enabled, enemies will still use _damage
		//to indicate they received damage, but they will not actually
		//move around when taking hits.
		this.hookShotTink();
		//hookshot retracts fast instead of passing through
	}
	//if we don't have a stunknockback, then knock back for real
	if (!battler._ras._stunknockback && !((this._tool.hookshot.enabled && battler._ras._hookshotimmune))){
		
		if (this._tool.hookshot.enabled && $gameSystem.isAbsMode()) {
			this.knockbackHookshot(target,battler)
		} else {
			// I don't like the idea of knockback turning you around willy nilly
			// it also has issues with things with a fixed direction (obviously)
			// so I'm gonna change it to make you get knockedback based on which direction the bullet is relative to you
			// while this isn't a perfect algorithm it'll be a little more reliable.
			
			/* if (this._tool.knockbackFace) {
				this.turnTowardTool(target);
			} else {
				target.turnTowardCharacter(this)
			}; */
			if ($gameSystem.isAbsMode()) {
				
				// change this so we get knockedback based on which way the bullet was
				//var d = target.getReverseDirection()
				var colllen=Math.sqrt( (this.x-target.x)*(this.x-target.x) + (this.y-target.y)*(this.y-target.y))  +0.01;
				
				
				//if we have a move target, AND we are not at it.
				if ((this._moveTargetX)  && !((this._moveTargetX == this.x) && (this._moveTargetY == this.y)))
				{
					// if we can tell where the bullet is travelling to, scale our collision
					// based on the relative position of the two as well as
					// how fast the bullet is moving

					var bulletlen = Math.sqrt( (this.x-this._moveTargetX)*(this.x-this._moveTargetX) + (this.y-this._moveTargetY)*(this.y-this._moveTargetY));
					var xdir = -1*(this.x-this._moveTargetX)/colllen -0.5*this._moveSpeed*(this.x-this._moveTargetX)/bulletlen;
					var ydir = -1*(this.y-this._moveTargetY)/colllen -0.5*this._moveSpeed*(this.y-this._moveTargetY)/bulletlen;
					

					var weightedAngle = Math.degrees(Math.atan2(ydir,xdir))
					var d = angle2dir(weightedAngle);
					var veclength = Math.sqrt(xdir*xdir+ydir*ydir);
					xdir = xdir/veclength;
					ydir= ydir/veclength;
					
				}else{
					
										//otherwise just use the direction that the bullet is relative to me
					
					//you'd think you could use which way it's facing, but
					//consider a bomb explosion!
					
					var xdir=target.x-this.x;
					var ydir=target.y-this.y;
					var veclength = Math.sqrt(xdir*xdir+ydir*ydir);
					xdir = xdir/veclength;
					ydir= ydir/veclength;
					}
				xdir = xdir * this._tool.knockbackPower;
				ydir = ydir  * this._tool.knockbackPower;
				
				if (!target._oldMoveSpeed)
				{
					target._oldMoveSpeed=target._moveSpeed;
				}
				target._oldmoveTargetSkippable=target._moveTargetSkippable;
				target._moveTargetSkippable = true; 
				if (!target._oldmoveFrequency)
				{
					target._oldmoveFrequency=target._moveFrequency
				}
				target._moveFrequency=5;
				target._moveTarget=false;
				if (target._olddirectionFix !== undefined)
				{
					target._olddirectionFix=target._directionFix;
				}
				target._directionFix=true;
				// based on leaving randomly moving npcs in tiny prisons, 5.0 seems like the highest safe speed
				//that doesn't clip through walls occasionally.
				
				var nextcommand ="this.jump(0,0);if(!this.battler().isDead()){this._moveSpeed=5.0;this.rLoc("+xdir.toFixed(2)+","+ydir.toFixed(2)+")};"
				var cleanupcommand ="this.knockbackCleanup()"
				var moveRoute =
					{
					 "list":[
					 {"code": 45, "parameters": [nextcommand], "indent":null},
					 {"code": 45, "parameters": [cleanupcommand], "indent":null},
				     {"code":0}
					 ],
					 "repeat":false,
					 "skippable":false,
					 "wait":false
					};
				target.forceMoveRoute(moveRoute);
				if (target.battler().isEnemy()) {
					if ( !(this._tool.knockbackD == undefined))
					{
						//if we specially defined a knockback duration, use it
						target.battler()._ras.knockback[1] = this._tool.knockbackD;
					}else{
						//otherwise default to either 20 frames, or slightly less than the invuln duration (whichever is bigger)
						target.battler()._ras.knockback[1]=Math.max(this._tool.collisionD-20,20)
					}
				};

			}
		}
	}
	
	
}

Game_CharacterBase.prototype.knockbackCleanup = function()
{
	this._moveTargetSkippable = this._oldmoveTargetSkippable; 
	this._oldMoveTargetSkippable=undefined;
	this._moveSpeed=this._oldMoveSpeed;
	this._oldMoveSpeed=undefined;
	this._moveFrequency=this._oldmoveFrequency;
	this._oldmoveFrequency=undefined;
	this._directionFix=this._olddirectionFix;
	this._olddirectionFix=undefined
					
}

//==============================
// * set Knockback Direction (edited from chrono engine)
// * old version before I got smart and decided to just have altimit handle all
// * the collision and such.
//==============================
ToolEvent.prototype.setKnockbackDirectionOld = function(target,battler) {
	var preD = target.direction();
	if ((this._tool.hookshot.enabled && battler._ras._stunknockback) || (this._tool.hookshot.enabled && battler._ras._hookshotimmune))
	{
		
		//if "stun knockback" is enabled, enemies will still use _damage
		//to indicate they received damage, but they will not actually
		//move around when taking hits.
		this.hookShotTink();
		//hookshot retracts fast instead of passing through
	}
	//if we don't have a stunknockback, then knock back for real
	if (!battler._ras._stunknockback && !((this._tool.hookshot.enabled && battler._ras._hookshotimmune))){
		
		if (this._tool.hookshot.enabled && $gameSystem.isAbsMode()) {
			this.knockbackHookshot(target,battler)
		} else {
			// I don't like the idea of knockback turning you around willy nilly
			// it also has issues with things with a fixed direction (obviously)
			// so I'm gonna change it to make you get knockedback based on which direction the bullet is relative to you
			// while this isn't a perfect algorithm it'll be a little more reliable.
			
			/* if (this._tool.knockbackFace) {
				this.turnTowardTool(target);
			} else {
				target.turnTowardCharacter(this)
			}; */
			if ($gameSystem.isAbsMode()) {
				
				// change this so we get knockedback based on which way the bullet was
				//var d = target.getReverseDirection()
				var colllen=Math.sqrt( (this.x-target.x)*(this.x-target.x) + (this.y-target.y)*(this.y-target.y))  +0.01;
				
				
				//if we have a move target, AND we are not at it.
				if ((this._moveTargetX)  && !((this._moveTargetX == this.x) && (this._moveTargetY == this.y)))
				{
					// if we can tell where the bullet is travelling to, scale our collision
					// based on the relative position of the two as well as
					// how fast the bullet is moving

					var bulletlen = Math.sqrt( (this.x-this._moveTargetX)*(this.x-this._moveTargetX) + (this.y-this._moveTargetY)*(this.y-this._moveTargetY));
					var xdir = -1*(this.x-this._moveTargetX)/colllen -0.5*this._moveSpeed*(this.x-this._moveTargetX)/bulletlen;
					var ydir = -1*(this.y-this._moveTargetY)/colllen -0.5*this._moveSpeed*(this.y-this._moveTargetY)/bulletlen;
					

					var weightedAngle = Math.degrees(Math.atan2(ydir,xdir))
					var d = angle2dir(weightedAngle);
					var veclength = Math.sqrt(xdir*xdir+ydir*ydir);
					xdir = xdir/veclength;
					ydir= ydir/veclength;
					
				}else{
					
					//otherwise just use the direction that the bullet is relative to me
					
					//you'd think you could use which way it's facing, but
					//consider a bomb explosion!
					
					var xdir=this.x-target.x;
					var ydir=this.y-target.y;
					var veclength = Math.sqrt(xdir*xdir+ydir*ydir);
					xdir = xdir/veclength;
					ydir= ydir/veclength;
					}
				
				 // the gameMap.event().x will give you the upper left corner of the tile
				 // rather than the center of the event itself, this code adjusts it
				 // yes this means knockback might clip into walls if you change the event size
				 // I suggest you don't knockback stuff that's nonstandard, or if you want to
				 // extend the code somehow to deal with it.


				
				var leftedge  = target._x + 0.26;// circle with diameter of 0.5, horizontally centered}
				var rightedge = target._x + 0.74;
				
				var upperedge = target._y+.45; // with the vertical center displaced down by .2
				var loweredge = target._y+.95;
				
				
				// for instance, I have displaced my player character's collision into his feet
				// while leaving the 'core' higher up, so that mog's hitbox will be on the body
				// this means I gotta handle this case specifically.
				if (target == $gamePlayer)
				{
					var upperedge = target._y+0.7;
					var loweredge = target._y+1.2;
					
				}
				
				//depending on the direction we're travelling, we need to check different corners of 
				//our event, so we don't clip through a wall.
				var checktiledist = dir2vec(angle2dir(45+dir2angle(d)))
				if (checktiledist[0]==1)
				{
					var xtile=Math.floor(rightedge); 
				}else if(checktiledist[0]==-1){
					var xtile=Math.floor(leftedge); 
				}else{
					var xtile=Math.floor((leftedge+rightedge)/2)
				}
				//then do y
				if (checktiledist[1]==1)
				{
					var ytile=Math.floor(loweredge); 
				}else if(checktiledist[1]==-1){
					var ytile=Math.floor(upperedge); 
				}else{
					var ytile=Math.floor((loweredge+upperedge)/2)
				}
				
				//console.log([xtile,ytile])
				
				// we need to check to see if we can go horizontally THEN vertically or vice versa!
				// only punt diagonally if we have a path, so we don't hit a corner
				if (d%2 ==1)
				{
					var canpassCW = (target.canPass(xtile, ytile, angle2dir(45+dir2angle(d))) );
					var canpassCCW = (target.canPass(xtile, ytile, angle2dir(-45+dir2angle(d))) );


					
					if ( ! (canpassCCW || canpassCW) )
					{
						//if we can't go in either direction, then jump in place
						xdir=0;
						ydir=0;
						
					}else if  ( (!canpassCCW) && canpassCW)
					{
						//if we can only go clockwise go clockwise
						[xdir,ydir]=dir2vec(angle2dir(45+dir2angle(d)))
					}else if  (canpassCCW && (!canpassCW) )
					{
						//if we can only go counterclockwise go counterclockwise
						[xdir,ydir]=dir2vec(angle2dir(-45+dir2angle(d)))
					}else 
					{
						
						//if we can go in both directions, check to see if there is a valid path to our new target
						// so for instance if we're coming from the upper left, going from S to E,
						// we now know we can get from S to A and from S to B.
						//    [ S ]   [  A ]
						//    
						//    [ B ]   [  E ]
						// now we need to check to see if we can get from A or B to E
						// If only one of those is valid, that means we have something like this
						//    [ S ]   [  A ]
						//            -------
						//    [ B ]   [  E ]
						// and I think it's acceptable to move diagonally from S to E in this case, but if not I
						// can change it later so it has to be A AND B that are capable of moving to E.
						
						
						var tempCWtile= dir2vec(angle2dir(-45+dir2angle(d)));
						tempCWtile[0] = tempCWtile[0]+xtile;
						tempCWtile[1] = tempCWtile[1]+ytile;
						var tempCCWtile= dir2vec(angle2dir(-45+dir2angle(d)));
						tempCCWtile[0] = tempCCWtile[0]+xtile;
						tempCCWtile[1] = tempCCWtile[1]+ytile;
						
						// to get CW we turn one notch to the right.  We then move forward one tile, and turn two notches to the left.
						// basically we go UP then LEFT, or LEFT then UP (or whichever)
						// CCW is reversed from that.  In these cases we do nothing with our xdir and ydir, they're fine.
						if (target.canPass(tempCWtile[0], tempCWtile[1], angle2dir(45+dir2angle(d))))
						{
							//move normally
						}else if (target.canPass(tempCCWtile[0], tempCCWtile[1], angle2dir(-45+dir2angle(d))))
						{
							//move normally
							
						}else{
							// in this case we have a corner
							//  
							//    [ S ]   [  A ]
							//          |--------
							//    [ B ] | [  E ]
							//          |        
							// so we shouldn't move at all
							xdir=0;
							ydir=0;
							
						}
						

					}
					
					
				}else{
					//nondiagonal case
					
					// see if we're straddling a border.  If we are, things are more complicated.  IF not things are simpler
					
					var straddleX = (Math.floor(rightedge) == Math.floor(leftedge));
					var straddleY = (Math.floor(upperedge) == Math.floor(loweredge));
					var needToBounce = false; // changes to 
					if (straddleX||straddleY)
					{
						//console.log('straddling')
						//in this case we need to know if we are hitting a corner from the side
						//  
						//  
						//  something like this for instance (event on left, corner on right
						//  __   |
						// |  |  |___
						// |__|
						//  
						// we need to make sure that it doesn't jump and end up awkwardly on the corner
						// so we need to test both tiles in that case
						if (straddleX)
						{
							if (!(target.canPass(Math.floor(rightedge),ytile,d)&&target.canPass(Math.floor(leftedge),ytile,d)))
							{
								needToBounce=true;
							}

						}
						if (straddleY)
						{
							if (!(target.canPass(xtile,Math.floor(upperedge),d)&&target.canPass(xtile,Math.floor(loweredge),d)))
							{
								needToBounce=true;
							}
							
						}
						
					}else{
						
						if (target.canPass(xtile, ytile,d))
						{
							//if we can just go through, great
						}else
						{
							// if not, we can check to see if we get interrupted, and bounce backwards a bit
							//	but not off our current tile
							needToBounce=true;
							
						}
					}
					
				}
				
				if (needToBounce){
					//if we need to bounce, then have it rebound off the wall (which ensures it won't pass through)
					//stay on the same tile it currently is on.
					switch ( d) {
								case 2:
								xdir=0;
								ydir= Math.floor(loweredge)-loweredge+0.01;
									break;
									
								case 4: 
								xdir = Math.ceil(rightedge)-rightedge-0.01;
								ydir = 0;
									break;
									
								case 6: 
								xdir = Math.floor(leftedge)-leftedge+0.01;
								ydir = 0;
									break;
									
								case 8: 
								xdir=0;
								ydir = Math.ceil(upperedge)-upperedge -0.01;
									break;
									//default to no movement
								xdir = 0;
								ydir = 0;
							}
					
					if (Math.abs(xdir)<0.3) {xdir=-xdir}; // make short bounces go forward again.
					if (Math.abs(ydir)<0.3) {ydir=-ydir};
					if (Math.abs(xdir)>0.7) {xdir=xdir/2};  // lower distance on long bounces
					if (Math.abs(ydir)>0.7) {ydir=ydir/2};
				}
				
				//multiply by our knockback power
				xdir = xdir * this._tool.knockbackPower;
				ydir = ydir * this._tool.knockbackPower;
						
				//finally, test with altimit to see if this is a valid location to move from.
				if ($gameMap.canWalk( target, Math.floor(target._x+xdir), Math.floor(target._y +ydir))) {
					// only move if we aren't gonna touch anything.
					// this does mean that we won't glance off of event walls, oh well.
					if (!$gameMap.touchesCharacters(target,target._x+xdir,target._y+ydir))
					{
						target._x+=xdir;
						target._y+=ydir;
						
					}else if (!$gameMap.touchesCharacters(target,target._x+xdir/2,target._y+ydir/2)){
						//test to see if we can go halfway.  If we can, do that.
						target._x+=xdir/2;
						target._y+=ydir/2;
					}else if (!$gameMap.touchesCharacters(target,target._x+xdir/4,target._y+ydir/4)){
						//test to see if we can go a quarter of the way.  If we can, do that.
						target._x+=xdir/4;
						target._y+=ydir/4;
						//a quarter tile seems close enough - that's the displacement of the collider
						// from the edge of ITS tile, so if we get this close it should be fine.
					}
					
					//if we are moving to a new place, then turn off our movetarget!
					target._moveTarget =false;
				}; 
				target.jump(0,0)
				
				if (target.battler().isEnemy()) {
					if ( !(this._tool.knockbackD == undefined))
					{
						//if we specially defined a knockback duration, use it
						target.battler()._ras.knockback[1] = this._tool.knockbackD;
					}else{
						//otherwise default to either 20 frames, or slightly less than the invuln duration (whichever is bigger)
						target.battler()._ras.knockback[1]=Math.max(this._tool.collisionD-20,20)
					}
				};
			};
		};
		if ($gameSystem.isChronoMode() && !target._chrono.dirF) {
			target.turnTowardCharacter(this.user())
		} else {
			target.setDirection(preD);	
		};
	}
};




//==============================
// * tool Sys Init Battler
//==============================
//initializes all the variables for battlers.
//
Game_Battler.prototype.toolSysInitBattler = function() {
	this._ras = {};
	this._ras._knockback = true;
	this._ras.tool = null;
	this._ras.knockback = [0,0];
	this._ras.stunknockback = false;
	this._ras._hookshotimmune=false;
	this._ras.collisionD = 0;
	this._ras.poseDuration = 0;
	//acting duration
	this._ras.actDuration = 0;
	//cooldown between shots
	this._ras.cooldownDuration=0;
	this._ras.poseSuffix = "";
	this._ras.poseLoop = false;
	this._ras.offsetX = 0;	
	this._ras.offsetY = 0;
	this._ras.diagonal = [false,0];
	this._ras.hookshotUser = [false,false,4,null];
	this._ras.invunerable = false;
	this._ras.disableCollision = false;
	this._ras.superGuard = false;
	this._ras.moveSpeed	= 4;
	this._ras.deadSwitchID = [];
	this._ras.deadVariableID = [];
	this._ras.deadSelfSwitchID = [];
	this._ras.invunerableActions = [];
	this._ras.character = null;
	this._ras.autoTarget = null;
	this._ras.dead = false;
	this._ras.guard = {};
	this._ras.guard.enabled = false;
	this._ras.guard.chrono = false;
	this._ras.guard.chronoPer = 50;
    this._ras.guard.active = false;
	this._ras.guard.poseSuffix = ""
	this._ras.bodySize = 0;
	this._ras.iconStateX = 0;
	this._ras.iconStateY = 0;
	this._ras.combo = {};
	this._ras.combo.id = 0;
	this._ras.combo.time = 0;
	this._ras.combo.type = 0;
	this._ras.charge = {};
	this._ras.charge.id = 0;
	this._ras.charge.time = 0;
	this._ras.charge.time2 = 0;
	this._ras.charge.maxtime = 0;
	this._ras.charge.charging = false;
	this._chrono = {};
	this._chrono.targets = [];
    this._chrono.action = null;
	this._chrono.actionTimes = 0;
	this._chrono.actionPhase = 0;
	this._chrono.actionID = 0;
	this._chrono.ScopeIndex = 0;
	this._chrono.statesTurn = [0,Number(Moghunter.ras_statesDuration)];
	this._chrono.inAction = false;
	this._chrono.atb = 0;
	this._chrono.maxAtb = Number(Moghunter.ras_atbMax);
	this._chrono.index = 0;
	this._chrono.defeated = [false,false];
	this._chrono.deadTurn = false;
	this._chrono.ct = 0;
	this._chrono.maxct = 100;
	this._chrono.ctSpeed = 1;
	this._chrono.ctDashLimit = 30;
    this.clearRasCast();
};


////==============================
// * collision Invunerable
//==============================
//edited this to have hookshot retract if it hits a shielding target.
//I am not correcting the invunerable typo for legacy support
ToolEvent.prototype.collisionInvunerable = function(target,knockback) {
	target.battler()._ras.collisionD = this._tool.collisionD;
    var animationID = Moghunter.ras_guardAnimationID;
	if (animationID) {target.requestAnimation(animationID)};
	if (this._tool.hookshot.enabled)
	{
		//if this is a hookshot hitting a shielded target, have it retract at double speed
		this._tool.hookshot.range = 0;
		this._moveSpeed+=1;
		
	}
}; 
//==============================
// * set Invunerable Duration
//==============================
ToolEvent.prototype.setInvunerableDuration = function(target) {
	this._tool.target = target;
	if ($gameSystem.isChronoMode()) {
	    target.battler()._ras.collisionD = this._tool.collisionD;
	} else {
	    //if (target.battler()._ras.knockback[1] > 0) {
		//   target.battler()._ras.collisionD = target.battler()._ras.knockback[1] + 2;
	    //} else {
		   target.battler()._ras.collisionD = this._tool.collisionD;
	    //};
	};
};

//aims at a point 100 units behind the player, and goes for it.  That way bullets keep moving even if they miss!
//you can also specify the maximum distance and 
//relative x and y offsets to fine-tune
Game_CharacterBase.prototype.shootPastPlayer = function (maxRange,xoffset,yoffset){
	var xoffset=xoffset || 0;
	var yoffset=yoffset || 0;
	var vx = $gamePlayer.x - this.x+xoffset;  
	var vy = $gamePlayer.y - this.y+yoffset;  
	var maxRange= maxRange  || 100; //default maximum range to 100
	var length = Math.sqrt( vx * vx + vy * vy );  
	if ( length > this.stepDistance ) {
		this.setDirectionVector( vx, vy );
		vx *= maxRange/length;
		vy *= maxRange/length;
		this._moveTarget = true;
		this._moveTargetSkippable = true;
		this._moveTargetX = Math.round( this.x + vx );
		this._moveTargetY = Math.round( this.y + vy );
		}
}


//aims at a point 100 units straight ahead, and goes for it!
//you can also specify the maximum distance and 
//relative x and y offsets to fine-tune
Game_CharacterBase.prototype.shootForward = function (maxRange,xoffset,yoffset){
	var maxRange= maxRange || 100;
	var xoffset = xoffset || 0;
	var yoffset = yoffset || 0;
	var myDir = this._direction8 || this._direction || 2;
	var dirs = dir2vecNorm(this.direction8()); 
	this.rLoc(maxRange*dirs[0]+xoffset,maxRange*dirs[1]+yoffset)
}



//aims at a point moveDist away from the bullet's current position, and goes for it in the current direction.  Angles a random amount left or right (up to max angle).
//angle supplied must be positive
Game_CharacterBase.prototype.shootForwardInaccurate = function (badAngle,moveDist,angleFrac,shouldRotate){
	//angleFrac lets us override the default random angle calculation
	//and instead go across the entire sweep from -badAngle to +badAngle by setting
	// it from -1 to 1
	if (angleFrac == undefined)
	{
		var pickRandom=true;
		this._moveSpeed+=0.1*(0.5-Math.random()); //add a little wildness to speed
	}else{
		var pickRandom=false;
	}
	//shouldRotate defaults to true
	if (shouldRotate==undefined)
	{
		shouldRotate=true
	}
	
	// if we have an initial direction set, use that (prevents weird spreading)
	
	if (this._initialDirection)
	{
		var startdir=this._initialDirection;
	}else{
		var startdir=this._direction;
	}

	var vx = [3,6,9].contains(startdir) - [1,4,7].contains(startdir) ;  
	var vy = [1,2,3].contains(startdir) - [7,8,9].contains(startdir) ;
	var length = Math.sqrt( vx * vx + vy * vy );  
	if ( length > this.stepDistance ) {
		
		this._moveTarget = true;
		this._moveTargetSkippable = true;
		//favor the center instead of the edges for random fire
		if (pickRandom)
		{
			var angleError= 4*(0.5-Math.random())*(0.5-Math.random())*Math.radians(badAngle);
		}else
		{
			var angleError= (angleFrac)*Math.radians(badAngle);
		}
		//console.log(angleError);
		var currAngle = Math.atan2(vy,vx);
		//console.log(currAngle);
		var newAngle= currAngle+angleError;
		
		vx=moveDist*Math.cos(newAngle);
		vy=moveDist*Math.sin(newAngle);
		this._directionFix=true;
		this._moveTargetX = this.x + vx;
		this._moveTargetY =  this.y + vy;
	}
	
	if (shouldRotate)
	{
		this.rotFaceTarg();//adjust angle sprite once we're moving
	}
}
		



// ==============================================
// from rpg_objects
// ==============================================
// edit the 'turn towards character' so it respects 8-directions and sets our diagonals right
// this way you can aim your shots!
Game_Character.prototype.turnTowardCharacter = function(character) {
	
    var sx = this.deltaXFrom(character.x);
    var sy = this.deltaYFrom(character.y);
    
	this.setDirectionVector(-sx,-sy);
	//console.log(this.direction8())
	this._user.diagonal = [this.isDiagonal(this.direction8()),this.direction8()]
};



//========================================================
// MOG_ChronoEngine
//====================================================





// START TOOL
ToolEvent.prototype.startTool = function() {
	this.payCost();
	if (this._tool.subweapon) {this._tool.user=this.user().user()};//added subweapon functionality - have it inherit the user from its parent
	if (this._tool.unique) {this.setUniqueTools()};
	this.setInitialPosition();
	this.startEffect();
	this._locked = false;
	this._collided = [];
	this.user().battler()._ras.charge.time = 0;
	this.user().battler()._ras.charge.time2 = 0;
	this.user().battler()._ras.charge.warmup = this._tool.charge.warmup;
	this.user().battler()._ras.charge.charging = false;		
	if (this._tool.hookshot.enabled) {
		$gameSystem._toolHookshotSprite[0] = this.user();
		$gameSystem._toolHookshotSprite[1] = this;	
		//rotate the hookshot if it's doing a diagonal.
		if (this._direction8%2==1){
			this.setAngle(-45);
		}
		this.user().battler()._ras.hookshotUser = [true,false,4,null];
		this.user().battler()._ras.poseDuration = 9999;
		// add acting
		this.user().battler()._ras.actDuration = 9999;
		this.user().battler()._ras.superGuard = true;	
		this.user()._moveSpeed = 5;		
	};	
	if (this.user()._user.spcShoot[1] > 0) {
		this.user()._user.spcShoot[1]--;
		this._tool.duration += this.user()._user.spcShoot[1];
	    this._tool.durationBase += this.user()._user.spcShoot[1];	
		if (this.user()._user.spcShoot[3]) {
			this.user()._user.autoTarget = this.user()._user.spcShoot[3];
		};
		if (this.user()._user.spcShoot[1] === 1) {

		   this.user()._user.spcShoot[0] = false;
		} else if (this.user()._user.spcShoot[1] === 0) {
	        this.user()._user.spcShoot = [false,0,0,null];
			this.user()._user.autoTarget = null;
		};
	};
	if (this._tool.projectile && $gameSystem.isChronoMode()) {this.setProjectileEffect()};
	if (this.needSetSkillName()) {
		this.setSkillName()
	} else {
		if (Imported.MOG_ActionName && $gameSystem.isChronoMode()) {
			$gameTemp._skillNameDuration[0] = 0;
		};
	};
	if (this.item()) {
		this._tool.scope = this.item().scope;
	};
	//edited to tell it NOT to change poses if we have a null poses set
	if (Imported.MOG_CharPoses  && !(this.user().battler()._ras.poseSuffix=="")) {
		this.user().updateSetPose()
		};
	
	if (this._tool.zoomAct) {this.user().charZoomAct(true,false)};
};

//==============================
// * Update Set Pose - edited to fix idle altimit compatibility
//==============================
Game_CharacterBase.prototype.updateSetPose = function() {
	if (this._inMotion || this._moveTarget) {this._poses.idle[1] = this._poses.idle[2]};
	this._poses.actionMode[0] = false;
	if (this._poses.dash[1] > 0) {
		if (this.isDashingPose()) {this._poses.dash[1] = 3};		
		this._poses.dash[1]--;
		return  
	};
	if (! (	!CrossEngine.idleMessage && $gameMessage.isBusy()))
	{
		if (this._poses.idle[1] > 0) {this._poses.idle[1]--};
	}
	var charName = this._characterName;
    this._characterName = this.setPose();
	if (this._poses.actionMode[0] != this._poses.actionMode[1]) {this.refreshActionMode()};
	if (charName != this._characterName) {this.refreshNewPose()};
};

//==============================
// * init Members
//==============================
var Cross_charPoses_gevent_initMembers = Game_Event.prototype.initMembers;
Game_Event.prototype.initMembers = function() {
	Cross_charPoses_gevent_initMembers.call(this);
	if (Imported.MOG_CharPoses)
	{
		this._poses.standing = [false,0]
	}
};

//==============================
// * Init Char Poses
//==============================	
var Cross_initcharposes = Game_CharacterBase.prototype.initCharPoses
Game_CharacterBase.prototype.initCharPoses = function() 
{
	Cross_initcharposes.call(this);
	var enable = CrossEngine.StandingPoses;
	if (Imported.MOG_CharPoses)
	{
		this._poses.standing = [enable,0]
	}
}

//==============================
// * Refresh New Pose - edited to check for standing
//==============================
Game_CharacterBase.prototype.refreshNewPose = function() {
	 if ((!this._poses.idle[3]) && (!this._poses.standing[1])) {
		 this._poses.idle[1] = this._poses.idle[2];
		 if (this._poses.idle[4] != null) {
			 this._stepAnime = this._poses.idle[4];
			 this._poses.idle[4] = null;
		 };		 
	 };
	 this._frames.refresh = true; 
};

//==============================
// * Refresh Poses Interpreter - edited to check for standing 
// (so we don't glitch into walk pose for a fraction of a second when standing and interacting)
//==============================
Game_CharacterBase.prototype.refreshPosesInterpreter = function() {
	 this._poses.interpreter = $gameTemp._chaPosesEVRunning;
	 $gameSystem._chaPoses[1] = $gameSystem._chaPoses[0];
	 if (this.needSetOriginalName()) {
	     this._characterName = this._originalName.name;
     };
	 this._poses.dash[1] = 0;
	 this._poses.idle[1] = this._poses.idle[2] - CrossEngine.StandDelay;
	 if (this._poses.idle[4] != null) {
		 this._stepAnime = this._poses.idle[4];
		 this._poses.idle[4] = null;
     };
};

//==============================
// * Check Tool Notes
//==============================
ToolEvent.prototype.checkToolNotes = function() {
	this._tool.hasCustomYOffset=false;//added so I can set a default offset.
	var customAct=false;
	var customPose=false;
	this._tool.mpCost = 0;  //move these here so  mp and tp costs don't reset every loop
	this._tool.tpCost = 0;		  
	if (!this._erased && this.page()) {this.list().forEach(function(l) {		
	       if (l.code === 108) {var comment = l.parameters[0].split(' : ')	
 	        
				
				//this._tool.hasVariableBullets=false;//added so I can change bullets dynamically
				if (comment[0].toLowerCase() == "tool_duration"){
		            this._tool.duration = Math.max(Number(comment[1]),1);
					this._tool.durationBase = this._tool.duration;
				};
				if (comment[0].toLowerCase() == "tool_range"){
		            this._tool.range = Math.max(Number(comment[1]),0);
					
				};
				if (comment[0].toLowerCase() == "tool_area"){
					var area = String(comment[1]);
					if (area === "square") {
					    this._tool.area = 1;
					} else if (area === "line") {
						this._tool.area = 2;
					} else if (area === "front_rhombus") {
						this._tool.area = 3;
					} else if (area === "front_square") {
						this._tool.area = 4;
					} else if (area === "wall") {
						this._tool.area = 5;						
					} else if (area === "cross") {
						this._tool.area = 6;																
					} else if (area === "circle") {
						this._tool.area = 7; //added for altimit compatibility																
					} else {
		               this._tool.area = 0;
					};
    			};
				if (comment[0].toLowerCase() == "tool_position"){					
					var position = String(comment[1]);	
					if (position === "target") {
					    this._tool.position = 1;
						this._tool.autoTarget = true;
				    	this._tool.ignoreGuard = true;
					} else if (position === "user") {	
					    this._tool.position = 2;
					} else {
		                this._tool.position = 0;
					};
				};
		        if (comment[0].toLowerCase() == "tool_collision"){
				
				} else if (comment[0].toLowerCase() == "tool_disable_collision"){
				    this._tool.collision = false;
				};				
				if (comment[0].toLowerCase() == "tool_wait_collision"){
		            this._tool.wait = Math.max(Number(comment[1]),1);
				};
				if (comment[0].toLowerCase() == "tool_item_id"){
					var item = $dataItems[Number(comment[1])];
					if (item) {
						this._tool.item = item;
						if (item.consumable) {
							this._tool.itemCost = item.id;
						};		
						if (this._tool.item.animationId > 0) {
							this._tool.animationID2 = this._tool.item.animationId;
						};
					};
				};
				if (comment[0].toLowerCase() == "tool_skill_id"){
					var skill = $dataSkills[Number(comment[1])];
		            if (skill) {this._tool.skill = skill};
				};								
				if (comment[0].toLowerCase() == "tool_animation_id"){
		            this._tool.animationID1 = Math.max(Number(comment[1]),0);
				};
				if (comment[0].toLowerCase() == "tool_hit_animation_id"){
		            this._tool.animationID2 = Math.max(Number(comment[1]),0);
				};
				if (comment[0].toLowerCase() == "tool_user_animation_id"){
		            this._tool.animationID3 = Math.max(Number(comment[1]),0);
				};	
				if (comment[0].toLowerCase() == "tool_cast_animation_id"){
		            this._tool.castAnimationID = Math.max(Number(comment[1]),0);
				};		
				if (comment[0].toLowerCase() == "tool_item_cost"){
		            this._tool.itemCost = Number(comment[1]);
				};				
				if (comment[0].toLowerCase() == "tool_mp_cost"){
		            this._tool.mpCost = Number(comment[1]);
				};					
				if (comment[0].toLowerCase() == "tool_tp_cost"){
		            this._tool.tpCost = Number(comment[1]);
				};
				if (comment[0].toLowerCase() == "tool_ct_cost"){
		            this._tool.ctCost = Number(comment[1]);
				};								
				if (comment[0].toLowerCase() == "tool_unique"){
		            this._tool.unique = true;
				};
				if (comment[0].toLowerCase() == "tool_offset_x"){
		            this._tool.offsetX = Number(comment[1]);
				};
				if (comment[0].toLowerCase() == "tool_offset_y"){
		            this._tool.offsetY = Number(comment[1]);
					this._tool.hasCustomYOffset=true;//added for default Y offset functionality
				};
				if (this.user().battler()) {
					if (comment[0].toLowerCase() == "tool_pose_duration"){
		     				this.user().battler()._ras.poseDuration = Number(comment[1]);
							customPose = true;
					};
					//this prevents you from moving when using your tool
					//if undefined, default is that it equals your pose duration
					if (comment[0].toLowerCase() == "tool_act_duration"){
						this.user().battler()._ras.actDuration = Number(comment[1]);
						customAct = true;
					};
					//how long you are prevented from using another tool after
					//using this one.  Note your 'act duration' already prevents
					//you from shooting while you're frozen in place, so this is for
					// run and gun stuff
					if (comment[0].toLowerCase() == "tool_cooldown_duration"){
						this.user().battler()._ras.cooldownDuration = Number(comment[1]);
					};
		            if (comment[0].toLowerCase() == "tool_pose_suffix"){
					    this.user().battler()._ras.poseSuffix = String(comment[1])
						customPose = true;
				    };
					if (comment[0].toLowerCase() == "tool_user_offset_x"){
						this.user().battler()._ras.offsetX = Number(comment[1]);
					};							
					if (comment[0].toLowerCase() == "tool_user_offset_y"){
						this.user().battler()._ras.offsetY = Number(comment[1]);
					};				
				};
				if (comment[0].toLowerCase() == "tool_all_directions"){
				    this._tool.spcShootTool = [true,8,1];
					this._tool.diagonal = true;
				} else if (comment[0].toLowerCase() == "tool_four_directions") {
		            this._tool.spcShootTool = [true,4,2];
				} else if (comment[0].toLowerCase() == "tool_flamethrower") {
		            this._tool.spcShootTool = [true,14,4];
					this._tool.diagonal = true;
				} else if (comment[0].toLowerCase() == "tool_shotgun") {
		            this._tool.spcShootTool = [true,8,4];	//first # is # of bullets, second is shot type (4 is inaccurate)
					this._tool.diagonal = true;					
									
				}else if (comment[0].toLowerCase() == "tool_three_directions") {
		            this._tool.spcShootTool = [true,3,3];
					this._tool.diagonal = true;					
				};				
				
				if (comment[0].toLowerCase() == "tool_damage_all"){
		            this._tool.selfDamage = true;
				};
				if (comment[0].toLowerCase() == "tool_diagonal"){
		            this._tool.diagonal = true;
				};
				if (comment[0].toLowerCase() == "tool_diagonal_angle"){
		            this._tool.diagonalAngle = -1;
					this._tool.diagonalAngleEnabled = true;
				};				
				if (comment[0].toLowerCase() == "tool_disable_piercing"){
		            this._tool.piercing = false;
				};
				if (comment[0].toLowerCase() == "tool_chain_action"){
					if (this.user().battler() && this.user()._user.chainAction[0] != this._tool.id) {
					   this.user()._user.chainAction[0] = Number(comment[1]);
					   this.user()._user.chainAction[1] = this._tool.durationBase;
					   if (this.user()._user.autoTarget) {
						   this.user()._user.chainAction[2] = this.user()._user.autoTarget;
					   };
				   };
				} else if (comment[0].toLowerCase() == "tool_chain_action_hit"){
					if (this.user().battler() && this.user()._user.chainActionHit[0] != this._tool.id) {
					   this.user()._user.chainActionHit[0] = Number(comment[1]);
					   this.user()._user.chainActionHit[1] = this._tool.durationBase;
					   if (this.user()._user.autoTarget) {
						   this.user()._user.chainActionHit[2] = this.user()._user.autoTarget;
					   };
					   this.user()._user.chainActionHit[3] = true;
					   if (this.user().battler()._chrono.targets.length > 0) {
					       this.user()._user.chainActionHit[5] = this.user().battler()._chrono.targets[0];
					   };
				   };
                } else if (comment[0].toLowerCase() == "tool_combo"){
						this._tool.combo.id = Number(comment[1]);
						this._tool.combo.type = Number(comment[2]);	
						this._tool.combo.time = comment[3] != null ? Number(comment[3]) : 20;
				};
				if (comment[0].toLowerCase() == "tool_charge_attack"){
					this._tool.charge.id =  Number(comment[1]);
	                this._tool.charge.maxtime = Number(comment[2]);	
					//added the functionality to set how many frames of warmup there are
					//before the game recognizes that you're holding down the button to charge
					//default is 5 (as in chrono engine base).
					if(comment[3])
					{
						this._tool.charge.warmup=Number(comment[3]);
					}else{
						this._tool.charge.warmup=5;
					}
				};
				if (comment[0].toLowerCase() == "tool_invuln_duration"){
					this._tool.collisionD = Number(comment[1]);
				};							
				if (comment[0].toLowerCase() == "tool_knockback_duration"){
					this._tool.knockbackD = Number(comment[1]);
				};							
				if (comment[0].toLowerCase() == "tool_multihit"){
				    this._tool.multihit = true;
					this._tool.collisionD = Number(comment[1]);
				};
				// this doesn't seem to have any use in mog's chrono engine
				// I use it to scale knockback distance - this is a multiplier
				// default value is 1 tile.  Does not increase speed, just distance.
				if (comment[0].toLowerCase() == "tool_knockback_power"){
					this._tool.knockbackPower = Number(comment[1])
				};	
				if (comment[0].toLowerCase() == "tool_ignore_shield"){
					this._tool.ignoreGuard = true;
				};		
				// I kept the name of this for legacy support but 'ignore knockback'
				// means that this attack hits during knockback iframes,
				// NOT that it doesn't knockback at all.
				if (comment[0].toLowerCase() == "tool_ignore_knockback"){
					this._tool.ignoreKnockback = true;
				};							
				
				
				if ($gameSystem.isAbsMode() && comment[0].toLowerCase() == "tool_auto_target"){
					this._tool.position = 1;
				    this._tool.autoTarget = true;
					this._tool.ignoreGuard = true;
				};
				if (comment[0].toLowerCase() == "tool_projectile"){
					this._tool.position = 2;
			     	this._tool.projectile = true;
				};				
				if (comment[0].toLowerCase() == "tool_shield_reflect"){
				     this._tool.guardReflect = true;
				};				
				if (comment[0].toLowerCase() == "throw"){
				    this._tool.eventInt = true;
		        };
				if (comment[0].toLowerCase() == "tool_shake"){
					this._tool.shake = [2,10,20]
		        };								
				if (this.user().battler() && comment[0].toLowerCase() == "tool_action_times") {
					if (!this.user()._user.actionTimes[0] ) {
						this.user()._user.actionTimes[0] = true; 
						this.user()._user.actionTimes[1] = Number(comment[1]);
						this.user()._user.actionTimes[2] = this._tool.id;
						this.user()._user.actionTimes[3] = this._tool.durationBase;
						if (this.user()._user.autoTarget) {
							this.user()._user.actionTimes[4] = this.user()._user.autoTarget;
						};
						this.user()._user.actionTimes[5] = Number(comment[2]) ? Number(comment[2]) : 25; 
						this.user()._user.actionTimes[6] = false;
						this.user()._user.actionTimes[7] = this.user()._user.actionTimes[5];
						//this._tool.collisionD = Number(comment[2]);
					};
		        };
				if (Imported.MOG_CharacterMotion) {
				    if (comment[0].toLowerCase() == "tool_user_zoom_effect"){
						this._tool.zoomAct = true;
					};
				};				
				if (comment[0].toLowerCase() == "tool_angle_animation"){
                    this._chrono.animation.directionMode = true;
				};
				// setting this makes sure the pose executes for exactly 
				// this number of frames, rather than compensating for
				// frames going faster or slower when _moveSpeed is set
				// to values other than 4.
				if (comment[0].toLowerCase() == "pose_fixed_time"){
                    this.user().battler()._ras.poseFixedTime = true;
				};
				if (comment[0].toLowerCase() == "bullet_offset_forward"){
						this._tool.bulletOffsetForward = Number(comment[1]); //how far away (in tiles) the bullet is spawned in the direction the caster is facing
				};
				if (comment[0].toLowerCase() == "bullet_offset_backward"){
						this._tool.bulletOffsetForward = -1*Number(comment[1]); //how far away (in tiles) the bullet is spawned away from the direciton the caster is facing.  Yes this is redundant but whatevs
				};
				if (comment[0].toLowerCase() == "bullet_offset_y"){
						this._tool.bulletOffsetY = Number(comment[1]); // how far away (in tiles) the bullet is spawned in the vertical axis, regardless of facing
				};
				if (comment[0].toLowerCase() == "bullet_isometric"){
						this._tool.isometric = true; //sets up our bullets to only be spawned in the 4 isometric directions
				};
				if(comment[0].toLowerCase() == "tool_variable_bullets"){
					//added to change bullet type to whatever is set by the prefix
					//you'll need to use a plugin to attach that to your item, sorry!
					if(this._user.battler){
						if (this._user.battler._equips[0])
						{ // only try if weapon is equipped.  Shouldn't ever happen, but safety first!
							this.setImage($dataWeapons[this._user.battler._equips[0]._itemId].bulletfile,0);
							
							if($dataWeapons[this._user.battler._equips[0]._itemId].bulletblend){
								this._blendMode = $dataWeapons[this._user.battler._equips[0]._itemId].bulletblend;
							}
							if($dataWeapons[this._user.battler._equips[0]._itemId].bulletopacity){
								this._opacity = $dataWeapons[this._user.battler._equips[0]._itemId].bulletopacity;
							}
						} 
					}
				};
				if (comment[0].toLowerCase() == "tool_boomerang"){
					var range = Number(comment[1]) ? Number(comment[1]) : 4;
		            this._tool.boomerang = [true,range,0];
                    this.setForceMoveEffect();
					this._tool.getTreasure = true;
				} else if (comment[0].toLowerCase() == "tool_hookshot"){
					var range = Number(comment[1]) ? Number(comment[1]) : 4;
		            this._tool.hookshot = {};
					this._tool.hookshot.enabled = true;
					this._tool.hookshot.range = range;
					this._tool.hookshot.x = 0;
					this._tool.hookshot.y = 0;
					this._tool.getTreasure = true;
					//this._tool.range = 0; // commented out so the hookshot can have some aoe
					// setting it low is good though, since the targets it's hitting have a
					// hitbox with a radius of 0.5
					this._tool.diagonal = true;	
					this._tool.multihit = false;
					this.setForceMoveEffect();
				};												
		   };
	}, this);};
	
	//have to move this outside the loop so it only adds once
	if (this._tool.skill) {
		this._tool.mpCost += this._tool.skill.mpCost;
		this._tool.tpCost += this._tool.skill.tpCost;
	};		
	// by default, if we don't define an acting duration then we default to the pose duration.
	// if you define your act and not your pose, then I assume 
	// that you actually want the pose to last exactly as long
	// as your character is locked up
	// so I will no longer adjust pose duration corresponding
	// to how fast a character is moving.
	if(customPose && !customAct)
	{
		this.user().battler()._ras.actDuration = this.user().battler()._ras.poseDuration
		this.user().battler()._ras.poseFixedTime=true;
	}
	
	//and vice versa
	if(!customPose && customAct)
	{
		this.user().battler()._ras.poseDuration = this.user().battler()._ras.actDuration
	}
	
	//Check to see if we have a y offset defined, and if not
	//default to be at the middle
	//which is halfway up the image, minus 12 pixels (a magic number
	//based off of the radius of altimit default hitbox sizes)
	//toggleable in plugin parameters
	if(!this._tool.hasCustomYOffset && CrossEngine.GuessToolY)
	{
		this.setCharacterFrames(); // set our frames early so they're available
		var bitmap = ImageManager.loadCharacter(this.characterName());
		var big = ImageManager.isBigCharacter(this.characterName());
		//bitmaps load asynchronously, so we need to find the height after it loads.
		var thisParticularTool= this;
			
		bitmap.addLoadListener(function ()
		{
			 if (!thisParticularTool._frames.custDirs)
			 {
				var ph = bitmap.height / (big ? 4 : 8); //find out how big our y axis is
			 }else{
				 var ph = bitmap.height /thisParticularTool._frames.dirNum;
			 }
			//console.log(bitmap,bitmap.height,big,ph);
			thisParticularTool._tool.imgWidth=Math.floor(bitmap.width/(thisParticularTool._frames.max || 3))
			thisParticularTool._tool.imgHeight=Math.floor(ph);
			thisParticularTool._tool.offsetY = Math.floor(ph/2); //offset it exactly by half so we end up rotating perfectly around our base.
		})
			
			
	}
	this._tool.knockbackFace = this._tool.wait >= 100 ? false : true;
};


//==============================
// * Update Tool Command
//==============================
//Edited to allow for variable charging warmup durations
Game_Player.prototype.updateToolCommand = function() {
	if (this.isCommandToolMenuUsable()) {
		if ($gameSystem._chronoCom.windowItem && Input.isTriggered(Moghunter.ras_buttonItemW)) {
			this.commandToolMenuItem ();
			return;
		} else if ($gameSystem._chronoCom.windowSkill && Input.isTriggered(Moghunter.ras_buttonSkillW)) {
			this.commandToolMenuSkill();
			return;			
		};
	};
	this.battler()._ras.guard.active = false;
	if (this.commandGuardUsable()) {
	    this.commandRasGuard();	
		this.battler()._ras.charge.time = 0;
		this.battler()._ras.charge.time2 = 0;
		this.battler()._ras.charge.charging = false;		
	} else if (this.commandToolUsable()) {
		if (this.commandAttackUsable()) {
			this.commandRasWeapon();
		} else if (this.commandChargeUsable()) {
			this.battler()._ras.charge.time2++;
			if (this.battler()._ras.charge.time2 > this.battler()._ras.charge.warmup) {
				if (!this.battler()._ras.charge.charging) {
				   SoundManager.playSoundMX(Moghunter.ras_ChargingSE);
				};
			    this.battler()._ras.charge.charging = true;
				this.battler()._ras.charge.time2 = this.battler()._ras.charge.warmup+1;
			};
			return;
		} else if (this.battler().isChargeMax()) {
			this.commandRasCharge();
			return
		} else if (this.commandItemUsable()) {
			this.commandRasItem();
		} else if (this.commandSkillUsable()) {
			this.commandRasSkill();
		};
		this.battler()._ras.charge.time = 0;
		this.battler()._ras.charge.time2 = 0;
		this.battler()._ras.charge.charging = false;		
	};
};

//==============================
// * set Spc Direction
//==============================
ToolEvent.prototype.setSpcDirection = function() {
	if (this.user()._user.spcShoot[2] === 1) {
        this.setAllDirection();
    } else if (this.user()._user.spcShoot[2] === 2) {
        this.setFourDirection();
    } else if (this.user()._user.spcShoot[2] === 3) {
        this.setThreeDirection();		
	} else if (this.user()._user.spcShoot[2] === 4) {
        this.setFlameThrowerDirection();		
	};
};

ToolEvent.prototype.setFlameThrowerDirection = function() {
	//this._user.diagonal = this.user()._user.diagonal;
	this.setDirection(this.user().direction8());
	this._initialDirection=this.user().direction8();
	this._tool.bulletOffsetForward*=(1+Math.random());
};

ToolEvent.prototype.setAllDirection = function() {
	  if (this.user()._user.spcShoot[1] > 4) {
		  if (this.user()._user.spcShoot[1] === 8) {
		     d = 1;
		  } else if (this.user()._user.spcShoot[1] === 7) {
		     d = 3;
		  } else if (this.user()._user.spcShoot[1] === 6) {  
		     d = 7;
		  } else if (this.user()._user.spcShoot[1] === 5) {
		     d = 9;
		  };
		  this._user.diagonal = [true,d];
		  this.setDirection(d);//added for altimit compatibility
	  } else {
	      this.setFourDirection();	
	  };
};

ToolEvent.prototype.setThreeDirection = function() {
	this._user.diagonal = this.user()._user.diagonal;
	this.setDirection(this.user().direction8());	
    if (this.user()._user.spcShoot[1] === 3) {
       this.turnDiagonalLeft();
	} else if (this.user()._user.spcShoot[1] === 2) {
	   this.turnDiagonalRight();
	};
};

//==============================
// * Turn Diagonal Left
//==============================
Game_Character.prototype.turnDiagonalLeft = function() {
	//left as in turn 45 degrees counterclockwise.  
	//edited for altimit compatibility 
	if (this._user.diagonal[0]) {
	    if (this.direction() === 1) {
		    this.setDirection(2);
		} else if (this.direction() === 3) {
		    this.setDirection(6);
		} else if (this.direction() === 7) {	
		    this.setDirection(4);
		} else if (this.direction() === 9) {
			this.setDirection(8);
		};
		this._user.diagonal = [false,0];
    } else {
		if (this.direction() === 2) {
			this._user.diagonal = [true,3];
			this.setDirection(3);
		} else if (this.direction() === 4) {
			this._user.diagonal = [true,1];	
			this.setDirection(1);
		} else if (this.direction() === 6) {
			this._user.diagonal = [true,9];	
			this.setDirection(9);
		} else if (this.direction() === 8) {		
			this._user.diagonal = [true,7];
			this.setDirection(7);
		};
    }; 
};

//==============================
// * Turn Diagonal Right
//==============================
//right as in clockwise.  Edited for altimit compatibility
Game_Character.prototype.turnDiagonalRight = function() {
	if (this._user.diagonal[0]) {
	    if (this.direction() ===  1) {
		    this.setDirection(4);
		} else if (this.direction() ===  3) {
		    this.setDirection(2);
		} else if (this.direction() === 7) {	
		    this.setDirection(8);
		} else if (this.direction() === 9) {
			this.setDirection(6);
		};
		this._user.diagonal = [false,0];
    } else {
		if (this.direction() === 2) {
			this._user.diagonal = [true,1];
			this.setDirection(1);
		} else if (this.direction() === 4) {
			this._user.diagonal = [true,7];	
			this.setDirection(7);
		} else if (this.direction() === 6) {
			this._user.diagonal = [true,3];	
			this.setDirection(3);
		} else if (this.direction() === 8) {		
			this._user.diagonal = [true,9];
			this.setDirection(9);
		};
    }; 
};


//==============================
// * move Toward Character
//==============================
Game_Character.prototype.moveTowardCharacter = function(character) {
	//if (this.needMoveTowardDiagonal(character)) {this.moveTowardCharacterDiagonal(character);return};
	//removed for altimit compatibility
    _mog_toolSys_gchar_moveTowardCharacter.call(this,character);
	if ((this.direction8() % 2)==1)
	{
		this.getDiagonalDirection()
	}
    if (this.canTouchTarget(character)) {
	   $gameChrono.executeTouchDamage(this,character) 
    };
};




//
//==============================
// * set Initial Direction
// * edited to check what the player is pressing, in case we are bumping into a wall
// * and thus the desired attack is diagonal, despite movement being in a different direction
//==============================
ToolEvent.prototype.setInitialDirection = function() {
	
	//if the player is using this tool, check input first
	if (this._tool.user instanceof Game_Player)
	{
		
			if (Input.dir8>0){
				var keyboardDir=Input.dir8;
				
				if (Imported.Blizzard_UltraMode7)
				{
					//if we're using ultra mode seven, then we need to rotate our angle appropriately.
					keyboardDir = UltraMode7.rotateDirection(keyboardDir,false)
				}
						
			   if (this.user()._user.spcShoot[2] != 0) {
				   this.setSpcDirection()
				   
			   } else {
				  this.setDirection(keyboardDir);
				  this._user.diagonal = [ ((keyboardDir%2)==1),keyboardDir];
			   };
			}
		
		else
		{
/* 			//player is NOT moving
		   if (this.user()._user.spcShoot[2] != 0) {
			   this.setSpcDirection()
		   } else {
			  var d = this.user()._user.diagonal[1];
			  this.setDirection(d);
			  this._user.diagonal = [ ((d%2)==1),d];
		   };
		} */
		
		   //normal control configuration (shoot the direcion you're moving)
		   if (this.user()._user.spcShoot[2] != 0) {
			   this.setSpcDirection()
		   } else {
				   
			  var d = this.user()._direction8 || this.user().direction();//_user.diagonal[1];
			  this.setDirection(d);
			  this._direction8=this.user()._direction8;
			  this._user.diagonal = [ ((this.user()._direction8%2)==1),this.user()._direction8];
		   }; 
		   gameOptionsKeyboardAimMouseMove=false
		   //keyboard aim, mouse movement configuration
		   if (!!gameOptionsKeyboardAimMouseMove)
		   {
			   if (!keyboardDir)
			   {
					keyboardDir=$gamePlayer._direction8
			   }
			   if (this.user()._user.spcShoot[2] != 0) {
				   this.setSpcDirection()
			   } else {
				  this.setDirection(keyboardDir);
				  this._user.diagonal = [ ((keyboardDir%2)==1),keyboardDir];
			   };
		   }
		   
		}
	//if it's not the player we don't care about keyboard	
	}else{
	   if (this.user()._user.spcShoot[2] != 0) {
		   this.setSpcDirection()
	   } else {
		  var d = this.user()._direction8;
		  this.setDirection(d);
		  this._user.diagonal = this.user()._user.diagonal;
	   };
	}
};



//override mog's, so we have bullets that appear at the right sprite offset
//requires the custom tags ofc
ToolEvent.prototype.setInitialPosition = function() {
   this.setInitialDirection();
   
   if (this._tool.isometric)
   {
		var bullDist=this._tool.bulletOffsetForward/Math.sqrt(3);
		var direc=this.user().direction8();//._user.diagonal[1];
		this._direction8=this.user().direction8();
		this._direction = this.user().direction();
		//default to these values
		var x = this.user().x;
		var y = this.user().y;
		switch (direc) 
		{
			case 0:
			case 5:
			//do nothing, shouldn't happen
			  break;
			case 1:
			case 2:
			  var x = this.user().x - bullDist*2;
			  var y = this.user().y + bullDist*1;
			  break;
			case 3:
			case 6:
			  var x = this.user().x + bullDist*2;
			  var y = this.user().y + bullDist*1;
			  break;
			case 7:
			case 4:
			  var x = this.user().x - bullDist*2;
			  var y = this.user().y - bullDist*1;
			  break;
			case 9:
			case 8:
			  var x = this.user().x + bullDist*2;
			  var y = this.user().y - bullDist*1;
			  break;
		}
		
	   if (this._tool.bulletOffsetY)
	   {
			y += this._tool.bulletOffsetY;
	   }
	   
	   this.locate(x, y);   
	   //no angle sprites for isometric weapons! 
	   
	   this.user()._user.autoTarget = null;
   }
   else
   {
	   if (this.user()._user.autoTarget && this._tool.position === 1) {
		  var x = this.user()._user.autoTarget.x;
		  var y = this.user()._user.autoTarget.y;
	   } else if (this.user()._user.chainActionHit[4]	) {  
		  var x = this.user()._user.chainActionHit[4].x;	
		  var y = this.user()._user.chainActionHit[4].y;	
	   } else if (this._tool.bulletOffsetForward){
			var bullDist=this._tool.bulletOffsetForward;
			var direc=this.direction();

			//default to these values
			var x = this.user().x;
			var y = this.user().y;
			// the player's collision and sprites are shifted to be different than the hurtbox, so shift weapons to keep guns syncing up appropriately.
			var playerWeapon=false;
			//special case for the player character sprites
			//doesn't apply to hookshot to make it more predictable.
			// These custom bullet locations are for my own game.  They 
			// are disabled but you can change them here.
			if ((this.user() instanceof Game_Player) && !(this._tool.hookshot.enabled) && (CrossEngine.hasCustomBulletLocs))
			{ 
				if(CrossEngine.hasCustomBulletLocs==1)
				{
					playerWeapon=true;
					y=y+0.25;
					//character 2's bullet locations
					// this one is based on the sprite rather than movement (so 8-directions)
					$gamePlayer._direction8 = $gamePlayer._direction8 || $gamePlayer._direction;
					
					switch ($gamePlayer._direction8)
					{
						//make bullets come out of the gun, 8 directional
						case 1:
							x -= 0.45
							y -= 0.15
						break;
						case 5: // make 5 and 0 point downwards as directions
						case 0:
						case 2:
							x -= 0.25
						
						break;
						case 3:
							y -= 0.1;
							x += 0.2;
						break;
						case 4:
							x-=0.55;
							y-=0.5;
						break;
						
						case 6:
							x+=0.55;
							y-=0.4;
						break;
						case 7:
							x -= 0.25;
							y -= .7;
						break;
						case 8:
							x += 0.3;
							y -= 0.6;
						break;
						case 9:
							x += .6;
							y -= .7;
						break;
						default:

					}
				}else if(CrossEngine.hasCustomBulletLocs==2){
					playerWeapon=true;
					y=y+0.5;
					//character 2's bullet locations
					// this one is based on the sprite rather than movement (so 4-directions)
					switch ($gamePlayer._direction)
					{
						//make bullets come out of the gun, 4 directional
						case 2:
						case 3:
							x += 0.2;
						break;
						case 1:
						case 4:
							x-=0.5;
							y-=0.25;
						break;
						case 9:
						case 6:
							x+=0.5;
							y-=0.25;
						break;
						case 7:
						case 8:
							x -= 0.2;
							y -= 0.4;
						break;
						default:

					}
				}
			} 
			
			
			
			//fine tuning based on direction
			switch (direc) 
			{
			  case 0:
			  case 5:
				//do nothing, shouldn't happen
				  break;
			  case 1:
				   x += - bullDist*0.7071; // divide by sqrt(2) to make these circular
				   y += bullDist*0.7071;
				  break;
			  case 2:
				   y += bullDist;
				  break;
			  case 3:
				   x += bullDist*0.7071;
				   y += bullDist*0.7071;
				  break;
			  case 4:
				   x +=  - bullDist;
				  break;
			  case 6:
				   x +=  + bullDist;
				  break;
			  case 7:
				   x +=  - bullDist*0.7071;
				   y +=  - bullDist*0.7071;
				  break;
			  case 8:
				   y +=  - bullDist;
				  break;
			  case 9:
				   x +=  bullDist*0.7071;
				   y += - bullDist*0.7071;
				  break;
				  
			}

	   }else {
		  var x = this.user().x;
		  var y = this.user().y;
	   };   
	   if (this._tool.bulletOffsetY){
			y += this._tool.bulletOffsetY;
	   }
	   
	   this.locate(x, y);   
	   if (this.canSetAngleSprite()) {
		   this.setAngleSprite();
	   } else {
		   this._tool.diagonalAngle = 0;
	   };
	   this.user()._user.autoTarget = null;
   }
};


//==============================
// * tool Tool Sys Notes
//==============================
Game_Battler.prototype.loadToolSysNotes = function() {
	var hasBodySize=false;
	 this.notetags().forEach(function(note) {
		 //no knockback at all (which means no damage frames)
		 if (note.toLowerCase() == "disable knockback"){
			 this._ras._knockback = false;
	     };	
		 //gets damage frames and interruptions from attacks as with knockback,
		 //  but doesn't move
		 if (note.toLowerCase() == "stun knockback"){
			 this._ras._stunknockback = true;
	     };	
		 //if this is true, then the hookshot just tinks off this monsters
		 //rather than grabbing it.
		 if (note.toLowerCase() == "hookshot immune"){
			 this._ras._hookshotimmune = true;
	     };	
         var note_data = note.split(' : ')
		 if (note_data[0].toLowerCase() == "dead switch id"){	
			 this._ras.deadSwitchID.push(Number(note_data[1]));
	     };
		 if (note_data[0].toLowerCase() == "dead variable id"){
			 this._ras.deadVariableID.push(Number(note_data[1]));
	     };		
		 if (note_data[0].toLowerCase() == "dead selfswitch id"){
			 this._ras.deadSelfSwitchID = String(note_data[1]);
	     };
		 if (note_data[0].toLowerCase() == "invulnerable actions"){
			 var par = note_data[1].split(',');	
			 for (var i = 0; i < par.length; i++) {
				 var actionID = par[i];
				 this._ras.invunerableActions.push(actionID) 
			 };
         };	
		 if (note_data[0].toLowerCase() == "body size"){
			 this._ras.bodySize = Number(note_data[1]);
			 hasBodySize=true;
	     };
		 if (note_data[0].toLowerCase() == "state icon y-axis"){
			 this._ras.iconStateY = Number(note_data[1]);
	     };		  	 
	},this); 
	if (!hasBodySize){
		this._ras.bodySize=0.25; //default to a body size with a radius of 0.25 tiles
	}
};

// edited to make enemy collision boxes into circles centered on them.
ToolEvent.prototype.collidedXY = function(target) {
	var bodySize=0.5;
	if (!target.battler())
	{
		//non enemies which are interactable also use altimit to determine collision.
		if ($gameMap.isOverlappingAB(this,target))
		{
			return true
		}
		
		bodysize = 0.5; //default bodysize to 0.5 for events
	}else{
		bodySize = target.battler()._ras.bodySize || 0.5; 
	}
	
	//am using the default mog setup where hitboxes are seperate from colliders
	//event sprites are centered at .x+0.5, and at .y +6 pixels + half the event's height
	// the fixed offsets cancel (since my bullet is also at .x+.5 and .y+6)
	//practically speaking this means that I am placing the base of the circle
	//at the coordinates x, y
	

	
	
	//default enemies to have a radius of 0.5 tiles of size.
    var cxy = [target.x,target.y - bodySize]; //
    var dx = cxy[0] - this.x;
    var dy = cxy[1] - this.y;
    var dx = dx >= 0 ? Math.max(dx - bodySize,0) : Math.min(dx + bodySize,0);
    var dy = dy >= 0 ? Math.max(dy - bodySize,0) : Math.min(dy + bodySize,0);
	return this.inRange(dx,dy);
	
	
		
	
};



//==============================
// * Can Collide
//==============================
ToolEvent.prototype.canCollide = function(target) {
	//if ($gameMap.isEventRunning()) {return false};
//	if ($gameSystem.isAbsMode() && target._user.isFollower) {return false};
    if (!this._tool.collision) {return false};
	if (this._tool.wait > 0) {return false};
	if (this._tool.duration <= 0) {return false};
	if (this.isJumping()) {return false};
	if (this._erased) {return false};
	if (this._tool.removeSprite) {return false};
	if (target === this) {return false};
	if (!target._user.collision) {return false};
	if (target.needStopNonChronoBattlers()) {return false};
	if ($gameTemp._hookshootPreData.user && $gameTemp._hookshootPreData.user === this.user()) {
		return false;
	};
	if (target._characterName == '') {return false};
	if (target.battler()) {
	   if (target.battler()._ras.disableCollision) {return false};
	   if (!this._tool.autoTarget && !this._tool.ignoreKnockback) {
		   
		   if (target.battler()._ras.collisionD > 0) {return false};
	   };
	   if (target.battler()._ras.hookshotUser[1]) {return false};
	};
	if (target._tool.enabled) {return false};
	if (target._erased) {return false};
	if (target._user.treasure[4] > 0) {return false};
	if (target._user.hookshotTool) {
		return false
	};
	if (target._transparent) {return false};
	if (target._opacity === 0) {return false};
    if (!this.collidedXY(target)) {return false};
	if (this._tool.hookshot.enabled && this.x === this._tool.user.x && this.y === this._tool.user.y) {
		if (this._tool.waitD) {
		   this._tool.duration = 4;
		   this._tool.waitD = false;
		};
        this._tool.hookshot.target = null;
        this._tool.user.battler()._ras.hookshotUser = [false,0,4,null];
		$gameSystem._toolHookshotSprite = [null,null,0];
	}	
	if (!this._tool.multihit) {
		if (this.isAlreadyCollided(target)) {return false};
	};
	if (this.isTreasure(target)) {
		this.collisionTreasure(target);
		return false;
	};	
	if (target._user.isPlayer) {
	    if ($gamePlayer.isInVehicle()) {return false};
		if (!target._user.isLeader && !target.isVisible()) {return false};	
	};
    if (this.canCollideBattler(target)) {
		this.collisionBattler(target,target.battler());
		if (this._tool.collisionD == undefined)
		{
			//default iframes are more favorable to the PC, if we didn't bother
			//defining custom ones.
			if (target == $gamePlayer)
			{
				target.battler()._ras.collisionD =40;
			}else{
				target.battler()._ras.collisionD=20;
			}
		}else{
			target.battler()._ras.collisionD = this._tool.collisionD;
		}
		
		this._tool.autoTarget = false;
		return this._tool.hitSuccess;
	};
	if (this.isCollisionEvent(target)) {return true};
	if (this.isHookshotEvent(target)) {return true};
	return false;
};


//==============================
// * In Range
//==============================

ToolEvent.prototype.inRange = function(dx,dy) {
	var range = this._tool.range;
	var mode = this._tool.area;
	// RHOMBUS
	if (mode === 0) {
	    if (Math.abs(dx) + Math.abs(dy) <= range) {return true};
	// SQUARE
	} else if (mode === 1) { 
		if (Math.abs(dx) <= range && Math.abs(dy) <= range) {return true};
	// LINE
	} else if (mode === 2) {
		
		
		//for diagonals we have to check x-y and x+y against high and low values
		


		//	With a direction of 3, weapon located at top left 
		//  width of 0.5
		//	L  /\
		//	  /  \ U
		//    \   \
		//   D \  /
		//      \/ R
		// b = y-x
		//  s = sqrt(2)/2
		//  Y < x+b+s  and Y> x+b-s
		// c = y + x
		// Y +x > c      y+x < c + length
		
		// since we're working with dx and dy values instead
		// dy-dx<0.354 and >-0.354    //0.5 in total width 
		// dy+dx>0 and <0.707*length
		 if (this._direction8 == 3) {
			if ( ( dy-dx<.354)&&(dy-dx>-.354)&&(dy+dx>0)&&(dy+dx<1.414*range)){return true}
		// for a direction of 7, we're at the bottom-right instead of the top left
		 }else if (this._direction8 == 7){
			
			if ( ( dy-dx<.354)&&(dy-dx>-.354)&&(dy+dx<0)&&(dy+dx>-1.414*range)){return true}
		
		// this one is aligned in the other diagonal direction, startin from
		// bottom left
		 }else if (this._direction8 == 1){
			if ( ( dy+dx<.354)&&(dy+dx>-.354)&&(dy-dx<0)&&(dy-dx>-1.414*range)){return true}
			
		}else if (this._direction8 == 9){
			if ( ( dy+dx<.354)&&(dy+dx>-.354)&&(dy-dx>0)&&(dy-dx>1.414*range)){return true}
			
         }else if (this._direction === 2) {
			 //I have edited lines from being 0 thickness to 0.5 thickness.
             if (Math.abs(dx) < 0.5 && dy >= 0 && dy <= range) {return true};    
		 } else if (this._direction === 8) {
			 if (Math.abs(dx) < 0.5 && dy <= 0 && dy >= -range) {return true};
		 } else if (this._direction === 6) {
			 if (Math.abs(dy) < 0.5 && dx >= 0 && dx <= range) {return true};				
		 } else if (this._direction === 4) {
			 if (Math.abs(dy) < 0.5 && dx <= 0 && dx >= -range) {return true};
		 };
	// FRONT RHOMBUS
	} else if (mode === 3) {
         if (this._direction === 2) {
             if (Math.abs(dx) + Math.abs(dy) <= range && dy >= 0) {return true};    
		 } else if (this._direction === 8) {
			 if (Math.abs(dx) + Math.abs(dy) <= range && dy <= 0) {return true};
		 } else if (this._direction === 6) {
			 if (Math.abs(dx) + Math.abs(dy) <= range && dx >= 0) {return true};				
		 } else if (this._direction === 4) {
			 if (Math.abs(dx) + Math.abs(dy) <= range && dx <= 0) {return true};
		 }; 
	// FRONT SQUARE
	} else if (mode === 4) {
         if (this._direction === 2) {
             if (Math.abs(dx) <= range && dy >= 0 && Math.abs(dy) <= range) {return true};    
		 } else if (this._direction === 4) {
			 if (Math.abs(dx) <= range && dx <= 0 && Math.abs(dy) <= range) {return true};
		 } else if (this._direction === 6) {
			 if (Math.abs(dx) <= range && dx >= 0 && Math.abs(dy) <= range) {return true};				
		 } else if (this._direction === 8) {
			 if (Math.abs(dx) <= range && dy <= 0 && Math.abs(dy) <= range) {return true};
		 };
	// WALL
	} else if (mode === 5) {
		//walls are gonna have the origin in the center rather than at the edge
		//I have edited walls from being 0 thickness to 0.5 thickness.
		//
		if ((this._direction8 == 3)||(this._direction8 == 7)) {
			if ( ( dy-dx<.707*range)&&(dy-dx>-.707*range)&&(dy+dx>-.354)&&(dy+dx<.354)){return true}
		// for a direction of 7, we're at the bottom-right instead of the top left
		 }else if ((this._direction8 == 1) || (this._direction8 == 9)){
			if ( ( dy-dx<.354)&&(dy-dx>-.354)&&(dy+dx>-.707*range)&&(dy+dx<.707*range)){return true}
			
         }else if (this._direction === 2) {
             if (Math.abs(dx) <= range && Math.abs(dy) < 0.5) {return true};    
		 } else if (this._direction === 4) {
			 if (Math.abs(dy) <= range && Math.abs(dx) < 0.5) {return true};
		 } else if (this._direction === 6) {
			 if (Math.abs(dy) <= range && Math.abs(dx) < 0.5) {return true};				
		 } else if (this._direction === 8) {
			 if (Math.abs(dx) <= range && Math.abs(dy) < 0.5) {return true};
		 };
	// CROSS
	} else if (mode === 6) {
		//I have edited cross arms from being 0 thickness to 0.5 thickness
         if (Math.abs(dx) <= range && Math.abs(dy) < 0.5) {return true};
         if (Math.abs(dy) <= range && Math.abs(dx) < 0.5) {return true}; 		
    // CIRCLE
	} else if (mode === 7) {
		//added for altimit compatibility
         if ((dx*dx + dy * dy) <= range*range) {return true};
         		
    };
	return false;
};



//==============================
// * set Angle Sprite
//==============================
ToolEvent.prototype.setAngleSprite = function() {
	this._tool.diagonalAngle = 0;

	
	// the player can be facing 2 different directions  when firing on a diagonal
	// figure out which way it SHOULD be pointing.
	var vecA= dir2angle(this.direction());
	var vecB= dir2angle(this._tool.user.direction8()) 
	
	//edited for compatibility
	if (this.direction()%2==1) //((this._tool.user.direction8()%2 ==1 )) 
	{
		if (vecA==vecB)
		{
			var angle =-45
		}else{ 
			var angle = -45 * (1 - 2*((vecA-vecB)<0 && !( (vecA==135) && (vecB==180)) && !( (vecA==225) && (vecB==270)) && !( (vecA==45) && (vecB==90))));
			
		}
	}else{
		var angle = 0;
	}
	
	//haven't actually tested this yet
/* 	if ((Imported.Blizzard_UltraMode7) && !($gameMap.ultraMode7Yaw.mod(90) == 0))
	{
		//if we're at some funky ultra mode 7 view angle, rotate our angle sprites appropriately
		angle = angle +=$gameMap.ultraMode7Yaw.mod(90);
	} */
	
    //if (angle != 0) {this._tool.diagonalAngle = angle + Math.PI / 2.0}; 
	if (angle != 0) 
	{
		this._tool.diagonalAngle = angle * Math.PI / 180;
	} //Edited to fix a typo?  This seems like it should be converting degrees to radians
};

// =============================
// * added this to make it compatible with altimit and stop mangling diagonal sprites
// =============================
  Sprite_Character.prototype.characterPatternY = function() {
	     
	 //if we don't have a custom number of directions for our file
	 //we default to 4 directions and alias diagonals like so:
	 if(!Imported.MOG_CharPoses || !this._character._frames.custDirs)
	 {
			     //NUMPAD [0,1,2,3,4,5,6,7,8,9]
		var yPatternArray=[0,1,0,0,1,0,2,3,3,2];
		return(yPatternArray[this._character.direction()]);
	//I am assigning everything one step counterclockwise.
	//5 and 0 are facing forward, they're not real directions per se but no reason to tempt fate.
    //return (this._character.direction() - 2) / 2; //original code which didn't handle diagonals
	 }else{
		 //we DO have a custom number of directions!  Now we have to switch based on it
		 var yPatternArray=[0,0,0,0,0,0,0,0,0,0];  //one image, one pattern
		 var myDir=this._character._direction8;
		 if (!myDir)
		 {
			 //fallback to the normal direction if direction8 is not yet defined.
			myDir=this._character._direction
		 }
		 switch(this._character._frames.dirNum)
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
			 
			 
			 if(this._character._frames.dirMatrix)
			 {
				yPatternArray=this._character._frames.dirMatrix;
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
	 
};  

Game_CharacterBase.prototype.dirFeedback=function(){
	 console.log(this._direction8,this._frames.dirMatrix[this._direction8],[2,4,6,8,3,1,9,7][this._frames.dirMatrix[this._direction8]]) 
	
}

var _cross_sprite_character_patternHeight = Sprite_Character.prototype.patternHeight;

Sprite_Character.prototype.patternHeight = function() {
	if(this._character._frames && this._character._frames.custDirs)
	{
		//if we have a custom number of directions, divide it by the number of directions we we have
		return Math.floor(this.bitmap.height / Math.abs(this._character._frames.dirNum))
	}else{
		return _cross_sprite_character_patternHeight.call(this)
	}

};

// =============================
// * added this to prevent shots and teleporting creatures from snapping to the grid
// =============================
Game_CharacterBase.prototype.setPosition = function(x, y) {
    this._x = x;
    this._y = y;
    this._realX = x;
    this._realY = y;
};

//==============================
// * Update Tool Hookshot Lock
//==============================
// from chronoEngine
Game_CharacterBase.prototype.updateHookShotLock = function() {
	 var target = this._user.hookshotLock.tool;
	 this._moveSpeed = target._moveSpeed;
	 if (target._x != $gamePlayer._x || target._y  != $gamePlayer._y) {
	     this._x = target._x;
	     this._y = target._y;
	 } else {
		 this._moveSpeed = this._user.hookshotLock.preMoveSpeed;
		 this._user.hookshotLock.preMoveSpeed = this._moveSpeed;
     	 this._user.hookshotLock.tool = null;		 
	 };
	 
	 //erase the target if it's dead - otherwise the game will check your
	 //hookshot indefinitely after you snag an enemy
	 if (target._erased == true)
	 {
		 this._user.hookshotLock.tool = null;
	 }
};


//updated to set our direction for firing as well
//==============================
// * update Guard Direction
//==============================
Game_Player.prototype.updateGuardDirection = function() {
    if (Input.isPressed('down')) {
	    this.setDirection(2);
		this._user.diagonal=[false,this._direction];
	} else if (Input.isPressed('up')) {
		this.setDirection(8);
		this._user.diagonal=[false,this._direction];
	} else if (Input.isPressed('left')) {
		this.setDirection(4);
		this._user.diagonal=[false,this._direction];
	} else if (Input.isPressed('right')) {
		this.setDirection(6);
		this._user.diagonal=[false,this._direction];
	};	 
	//sometimes a tool with id of zero gets spawned.  In this case, player will be locked and unable to do anything but guard.
	//until they get hit anyway.
	//no idea why that happens but for now..
	for (var i = 0; i < $gameSystem._toolsOnMap.length; i++) {
		var toolMapID = $gameSystem._toolsOnMap[i];
		if (toolMapID == 0) {$gamePlayer.jump(0,0)};
	};
};



//==============================
// * process Move Command Tool
//==============================
// altered hookshot so it retracts faster than it flies out.
Game_Character.prototype.processMoveCommandTool = function(command) {
	if (this._tool.boomerang[0]) {
		if (this._tool.boomerang[1] > 0) {
			this._tool.boomerang[1]--;
			this.moveForward();
		} else {
			this.moveTowardCharacter(this._tool.user);
			this._tool.forcingMove = 2;
		};
	} else if (this._tool.hookshot.enabled) {
		if (!this._tool.hookshot.locked) {
			this._directionFix = true;
			if (this._tool.hookshot.range > 0) {
				this._tool.hookshot.range--;
				this.moveForward();
			} else {
				if (this._tool.forcingMove != 2)
				{
					//first time we change to retracting, increase speed
					this._moveSpeed+=1;
				}
				
				this.moveTowardCharacter(this._tool.user);
				this._tool.forcingMove = 2;
			};
		} else {
			this._tool.forcingMove = 2;
		};
	};
};


// when a hookshot hits something that should stop its movement forward, 
// this will play a 'tink' sound, speed up, and reverse.
// note that the speed up stacks with retraction speeding up by itself
// so it reverses at 4x normal hookshot speed.  This feels right.
ToolEvent.prototype.hookShotTink = function(){
	 this._tool.hookshot.range = 0;
	 this._moveSpeed+=1;
	 AudioManager.playSe({name: 'hammer', pan: 0, pitch: 100, volume: 100});
}

//==============================
// * is Hook Shot Event
//==============================
//updated for 8directions, and added some feedback
ToolEvent.prototype.isHookshotEvent = function(target) {   
     if (!target._user.hookshotEvent) {return false};
	 if (!this._tool.hookshot.enabled) {return false};
	 if ($gameSystem.isChronoMode()) {return false};
	 if ($gameMap.isLoopHorizontal() || $gameMap.isLoopVertical()) {return false};
	 var dirvec=dir2vec(this._direction8);
	 var ex = target.x-dirvec[0];
	 var ey = target.y-dirvec[1];
	 //test with whole numbers to get the right tiles
	 if (!$gameMap.isPassable(ex, ey)) {
		 //if we can't move to this point, make a little 'dink' sound and start retracting.
		 this.hookShotTink();
		 return false;
	 }
	 //then once we know they're clear, scootch a little bit closer to the hookshot target.
	 ex = target.x-dirvec[0]*.7;
	 ey = target.y-dirvec[1]*.7;
	 if (this.isCollidedWithCharacters(ex, ey)) {return false}
	 this._tool.hookshot.x = ex;
	 this._tool.hookshot.y = ey;
	 return true
}; 


//==============================
// * Update Chain
//==============================
//updated for 8 directions
Hookshotchain.prototype.updateChain = function(sprite) {
	var user = $gameSystem._toolHookshotSprite[0];
	var hook = $gameSystem._toolHookshotSprite[1];	
	var dirvec=dir2vec(hook._direction8);
	var fx = Moghunter.ras_hookshootX*dirvec[0];
	if (dirvec[1]==0)
	{
		var fy =  -48+  Moghunter.ras_hookshootY;
		var fy2=fy;
	}else{
		var fy = -48 +  Moghunter.ras_hookshootY * dirvec[1];
		var fy2 = fy;
	}
	var fx2=fx;
	
	var dx = ((hook.screenX() - user.screenX()) - fx2) / this._chain.length;
	// we need to add an offset for this because .screenY() is at the bottom of an event
	// .screenX() is in the middle ofc
	var dy = ((hook.screenY() -hook._tool.offsetY - (user.screenY() +32)) - fy2) / this._chain.length;
	sprite.x = user.screenX() + (dx * sprite.index) + fx;
	sprite.y = user.screenY() +32 + (dy * sprite.index) + fy;
	sprite.z = user.screenZ() - 9999;
	this.z = user.screenZ() + 1;
};






//==============================
// * set target Angle and rotation rate functions, for smoother rotation (hopefully)
//==============================
Game_CharacterBase.prototype.setTargetAngle = function(targetAngle) {
	var ag = targetAngle * Math.PI / 180;
    this._user.targetAngle = [ag,targetAngle];
};

Game_CharacterBase.prototype.setRotationRate = function(rotationSpeed) {
	var ag = rotationSpeed * Math.PI / 180;
    this._user.rotationSpeed = [ag,rotationSpeed];
};

Game_CharacterBase.prototype.setRotationFlexible = function(isflex) {
	//flag to say we can go clockwise OR counterclockwise, whichever is closer
	var isflex = isflex || true;
    this._user.rotationFlexible= true;
};

//stop the rotation, leaving the current angle
Game_CharacterBase.prototype.clearRotationRate = function() {
	this._user.targetAngle =null;
    this._user.rotationSpeed = null;
	this._user.rotationFlexible= false;
};
// stop all rotation AND reset angle to default
Game_CharacterBase.prototype.clearAllRotation = function() {
	this._user.targetAngle =null;
    this._user.rotationSpeed = null;
	this._user.rotationFlexible= false;
	this.setAngle(0)
};


//==============================
// * update Tool Offset
//==============================
Sprite_Character.prototype.updateToolOffset = function() {
	if (this._character._user.hookshotTool) {this.updateHookShotLock()};
	
	if (this._character.battler()) {
	    this.x += this._character.battler()._ras.offsetX; 
	    this.y += this._character.battler()._ras.offsetY;
	};
	this.y += this._character._user.treasure[3];
};


//increase number of frames

//this is the alias defined in MOG_chronoengine, so it needs to be 
// commented out.  
//var _mog_toolSys_gchar_updateAnimation = Game_CharacterBase.prototype.updateAnimation;
//==============================
// * update Animation
//==============================
Game_CharacterBase.prototype.updateAnimation = function() {
	if (this.isPosing() && this._pattern >= this.maxPatternABS()) {return}
	_mog_toolSys_gchar_updateAnimation.call(this)
};


//==============================
// * max Pattern ABS
//==============================
Game_CharacterBase.prototype.maxPatternABS = function() {
     if(this.maxPattern()){
        return this.maxPattern();
    }
     return this._user.poseMaxPattern
};


Sprite_Character.prototype.updateCharPosesPosition = function() 
{
	//
	if(this._character._frames.horizFlip)
	{
		if (!Imported.Blizzard_UltraMode7)
		{
			//if we are tagged as horizontally flipping, then check to see if we have a move route target
			//if we do, and it's to the left of current position, flip
			if (!this._character.isJumping())
			{
				//jumping screws with targetx and targety
				if (this._character._moveTargetX<this._character.x)
				{
					this._character._zoomData[0] = - Math.abs(this._character._zoomData[0])
					this._character._zoomData[2] = - Math.abs(this._character._zoomData[2])
				}
				if (this._character._moveTargetX>this._character.x){
					this._character._zoomData[0] = Math.abs(this._character._zoomData[0])
					this._character._zoomData[2] = Math.abs(this._character._zoomData[2])
				}
			}
			
			//if their direction is facing a particular way, override move routes
			if ((this._character._direction==4)||(this._character._direction8==7)||(this._character._direction8==1))
			{
				this._character._zoomData[0] = - Math.abs(this._character._zoomData[0])
				this._character._zoomData[2] = - Math.abs(this._character._zoomData[2])
			}
			
			//if their direction is facing a particular way, override move routes
			if ((this._character._direction==6)||(this._character._direction8==9)||(this._character._direction8==3))
			{
				this._character._zoomData[0] = Math.abs(this._character._zoomData[0])
				this._character._zoomData[2] = Math.abs(this._character._zoomData[2])
			}
			
		}else{
			//special case code for ultramode7, since we can no longer say +-x is horizontal
			if ([1,4,7].contains(UltraMode7.rotateDirection(this._character._direction,true)))
			{
				this._character._zoomData[0] = - Math.abs(this._character._zoomData[0])
				this._character._zoomData[2] = - Math.abs(this._character._zoomData[2])
			}else{
				this._character._zoomData[0] = Math.abs(this._character._zoomData[0])
				this._character._zoomData[2] = Math.abs(this._character._zoomData[2])
			}
					
		}
	}
	
	
	
	//I have removed the feature from mog's code which flipped 
	//the x displacement depending on which way the character was facing
	//too many edge cases once diagonals and rotation get involved
	
	var ex = this._character._frames.x;
	var ey = this._character._frames.y;	
	
	// add on additional rotation specified in tool
	if (this._character._tool.enabled)
	{
		if(this._character._tool.offsetX)
		{
			ex+=this._character._tool.offsetX;
		}
		if(this._character._tool.offsetY)
		{
			ey+=this._character._tool.offsetY;
		}
		if(this._character._tool.diagonalAngle)
		{
			this._character._user.rotation = [this._character._tool.diagonalAngle,Math.degrees(this._character._tool.diagonalAngle)];
		}
	}
	
	ex*=this._character._zoomData[0];
	ey*=this._character._zoomData[1]

	ag=0;
	angle=0;


	thisHasRotationChar=false;
	//technically this isn't the 'correct' way of checking to see
	//if we have this trait, but there shouldn't be any edge cases that matter
	//since if rotation has a value but it resolves as 'false' we don't want to
	//rotate after all
	if (this._character._user.rotation)
	{
		thisHasRotationChar=true;
		[ag,angle] = this._character._user.rotation;
	}
	


	if (thisHasRotationChar)
	{
		var isSpinning=false;
		var hasTargetAngle=false;
		if(thisHasRotationChar)
		{
			if (this._character._user.rotationSpeed)
			{
				[agSpeed,angleSpeed] = this._character._user.rotationSpeed;
				isSpinning=true;
			}
			if (this._character._user.targetAngle || this._character._user.targetAngle ==0	)
			{
				[agTarget,angleTarget] = this._character._user.targetAngle;
				hasTargetAngle=true;
				
			}
			if (isSpinning){
				if(hasTargetAngle){
					//if our target angle is within a single step, snap to it.
					if(Math.abs(((((angleTarget+360) % 360)-((angle+360) % 360))/angleSpeed))<1){
						this._character.setAngle(angleTarget);
					}else{
						//if we are allowed to go in either direction, pick the shorter distance
						if(this._character._user.rotationFlexible)
						{
							if (((((angleTarget+360) % 360)-((angle+360) % 360) +360) % 360)>180)
								this._character.setAngle(angle-Math.abs(angleSpeed));
							else
								this._character.setAngle(angle+Math.abs(angleSpeed));
						}else{
							this._character.setAngle(angle+angleSpeed);
						}
					}
				}else{
					//if we don't have a target angle, but do have a rotation speed, keep spinning without limit!
					this._character.setAngle(angle+angleSpeed);
				}
			}
		}
		

		
		//update ag and angle
		if (this._character._user.rotation || (this._character._user.rotation==0))
		{
			[ag,angle] = this._character._user.rotation;
		}
	}
	if (ag==0)
	{
		this.x += ex;
		this.y += ey;
		
	}else{
		//I have altered this code to
		//rotate events around the displacement point by default, 
		//instead of the base of the sprite	
		//technically this rotation is probably off by a pixel or two, 
		//but w/e, close enough.
		this.x += ex*Math.cos(ag) - ey * Math.sin(ag);
		this.y += ex*Math.sin(ag) + ey * Math.cos(ag);

	}
	
};


//one problem with the above is that animations end up vertically displaced
//from their targets!  And animations are attached to a single point on the 
//sprite, which means if it spins, they spin!
if (Imported.MOG_CharPoses)
{
	_cross_sprite_animation_update_position=Sprite_Animation.prototype.updatePosition;
	Sprite_Animation.prototype.updatePosition = function()
	{
			_cross_sprite_animation_update_position.call(this);
			if (this._target._character)
			{
				//if we're targeting a sprite on a character
				//then
				var ex =0;
				var ey =0;
				
				if (this._target._character._frames.x)
				{
					ex+=this._target._character._frames.x;
				}
				if (this._target._character._frames.y)
				{
					ey+=this._target._character._frames.y;
				}
				if (this._target._character._tool)
				{
					if(this._target._character._tool.offsetX)
					{
						ex+=this._target._character._tool.offsetX;
					}
					if(this._target._character._tool.offsetY)
					{
						ey+=this._target._character._tool.offsetY;
					}
				}
				var ag=0;
				var angle=0;
				if (this._target._character._user.rotation || (this._target._character._user.rotation==0))
				{
					[ag,angle] = this._target._character._user.rotation;
				}
				
				this.x -= ex*Math.cos(ag) - ey * Math.sin(ag) -ex;
				this.y -= ex*Math.sin(ag) + ey * Math.cos(ag) -ey*1.5;
			}
			
	}
	
}

Spriteset_Map.prototype.updateParallax = function() {
    if (this._parallaxName !== $gameMap.parallaxName()) {
        this._parallaxName = $gameMap.parallaxName();

        if (this._parallax.bitmap && Graphics.isWebGL() != true) {
            this._canvasReAddParallax();
        } else {
            this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName);
        }
    }
    if (this._parallax.bitmap) {
        this._parallax.origin.x = $gameMap.parallaxOx();
        this._parallax.origin.y = $gameMap.parallaxOy();
    }
};


	  
	  //from MOG_ActorHud, fixes a visual glitch in how HP and MP meters were
	  // displaying
if (Imported.MOG_ActorHud){

	//==============================
	// * Create HP Meter
	//==============================
	Actor_Hud.prototype.create_hp_meter = function() {
		if (String(Moghunter.ahud_hp_meter_visible) != "true") {return};
		this.removeChild(this._hp_meter_blue);
		this.removeChild(this._hp_meter_red);
		if (!this._battler) {return};
		this._hp_meter_red = new Sprite(this._hp_meter_img);
		this._hp_meter_red.x = this._pos_x + Moghunter.ahud_hp_meter_pos_x;
		this._hp_meter_red.y = this._pos_y + Moghunter.ahud_hp_meter_pos_y;
		this._hp_meter_red.rotation = Moghunter.ahud_hp_meter_rotation * Math.PI / 180;
		this._hp_meter_red.setFrame(0,0,0,0);
		this.addChild(this._hp_meter_red);		
		this._hp_meter_blue = new Sprite(this._hp_meter_img);
		this._hp_meter_blue.x = this._hp_meter_red.x;
		this._hp_meter_blue.y = this._hp_meter_red.y;
		this._hp_meter_blue.rotation = this._hp_meter_red.rotation; //this was incorrectly converting to radians twice
		this._hp_meter_blue.setFrame(0,0,0,0);
		this.addChild(this._hp_meter_blue);
		this._hp_old_ani[0] = this._battler.hp - 1;
		if (String(Moghunter.ahud_hp_meter_flow) === "true") {this._hp_flow[0] = true;
			this._hp_flow[2] = this._hp_meter_img.width / 3;
			this._hp_flow[3] = this._hp_flow[2] * 2;
			this._hp_flow[1] = Math.floor(Math.random() * this._hp_flow[2]);
		};
	};
	//==============================
	// * Create MP Meter
	//==============================
	Actor_Hud.prototype.create_mp_meter = function() {
		if (String(Moghunter.ahud_mp_meter_visible) != "true") {return};
		this.removeChild(this._mp_meter_blue);
		this.removeChild(this._mp_meter_red);
		if (!this._battler) {return};
		this._mp_meter_red = new Sprite(this._mp_meter_img);
		this._mp_meter_red.x = this._pos_x + Moghunter.ahud_mp_meter_pos_x;
		this._mp_meter_red.y = this._pos_y + Moghunter.ahud_mp_meter_pos_y;
		this._mp_meter_red.rotation = Moghunter.ahud_mp_meter_rotation * Math.PI / 180;
		this._mp_meter_red.setFrame(0,0,0,0);
		this.addChild(this._mp_meter_red);		
		this._mp_meter_blue = new Sprite(this._mp_meter_img);
		this._mp_meter_blue.x = this._mp_meter_red.x;
		this._mp_meter_blue.y = this._mp_meter_red.y;
		this._mp_meter_blue.rotation = this._mp_meter_red.rotation; //this was incorrectly converting to radians twice
		this._mp_meter_blue.setFrame(0,0,0,0);
		this.addChild(this._mp_meter_blue);
		this._mp_old_ani[0] = this._battler.mp - 1;
		if (String(Moghunter.ahud_mp_meter_flow) === "true") {this._mp_flow[0] = true;
			this._mp_flow[2] = this._mp_meter_img.width / 3;
			this._mp_flow[3] = this._mp_flow[2] * 2;
			this._mp_flow[1] = Math.floor(Math.random() * this._mp_flow[2]);
		};
	};
		  
}
	  
  /** From Altimit
   * Direction
   * Utility for managing MV's directions
   */
  function Direction() {
    throw new Error( 'This is a static class' );
  }
  ( function() {

    Direction.DOWN_LEFT = 1;
    Direction.DOWN = 2;
    Direction.DOWN_RIGHT = 3;
    Direction.LEFT = 4;
    Direction.RIGHT = 6;
    Direction.UP_LEFT = 7;
    Direction.UP = 8;
    Direction.UP_RIGHT = 9;

    Direction.isUp = function( d ) {
      return d >= 7;
    };

    Direction.isRight = function( d ) {
      return d % 3 == 0;
    };

    Direction.isDown = function( d ) {
      return d <= 3;
    };

    Direction.isLeft = function( d ) {
      return ( d + 2 ) % 3 == 0;
    };

    Direction.fromVector = function( vx, vy ) {
      if ( vx && vy ) {
        if ( vy < 0 ) {
          if ( vx < 0 ) {
            return Direction.UP_LEFT;
          } else {
            return Direction.UP_RIGHT;
          }
        } else {
          if ( vx < 0 ) {
            return Direction.DOWN_LEFT;
          } else {
            return Direction.DOWN_RIGHT;
          }
        }
      } else if ( vx < 0 ) {
        return Direction.LEFT;
      } else if ( vx > 0 ) {
        return Direction.RIGHT;
      } else if ( vy < 0 ) {
        return Direction.UP;
      }
      return Direction.DOWN;
    };

    Direction.normalize = function( vx, vy, length ) {
      length = length || Math.sqrt( vx * vx + vy * vy );
      return { x: vx / length, y: vy / length, l: length };
    };

    Direction.normalizeSquare = function( vx, vy, length ) {
      var angle = Math.atan2( vy, vx );
      var cos = Math.cos( angle );
      var sin = Math.sin( angle );
      if ( !length ) {
        var absCos = Math.abs( cos );
        var absSin = Math.abs( sin );
        if ( absSin <= absCos ) {
          length = 1 / absCos;
        } else {
          length = 1 / absSin;
        }
      }
      return { x: vx * length, y: vy * length, l: length };
    };

  } )();
  
  
  
  
// Move and Fire Mod!
// This makes you capable of moving while acting
// unless you put the appropriate tags in the weapon saying you shouldn't.  


//==============================
// * can Move ABS Base
//==============================
Game_CharacterBase.prototype.canMoveABSBase = function() {
	if (!this.battler()) {return true};
	if (this.battler().isDead()) {return false};
	if (this.isActing()) {return false};
	if (this._erased) {return false};
	if (this.isKnockbacking()) {return false};
	if (this.isCasting()) {return false};
	if ($gameTemp._chrono.moveWait > 0) {return false};
	if ($gameTemp._chaPosesEVRunning) {return false};
	if (SceneManager.isSceneChanging()) {return false};
	if ($gameMessage.isBusy()) {return false};
	if (!this.canMove()) {return false};
	if (this._user.collapse[0]) {return false};
	if (this._user.hookshotTool) {return false};
	if ($gameSystem._chronoMode.waitMode < 2 && !$gameTemp._autoTarget.enabled) {
	    if ($gameTemp._chronoCom.phase != 0) {return false};
	};
	if ($gameTemp._autoTarget.enabled) {
		if (!$gameSystem.isChronoMode()) {	
			if (this._user.isLeader) {
				if (!this._user.autoTarget) {return false};
			} else {
				return false;
			};
		} else {
			if ($gameSystem._chronoMode.waitMode === 0) {return false};
		};
	};
	return true;
};

//==============================
// * can Move ABS
//==============================
Game_CharacterBase.prototype.canMoveABS = function() {
    if (!this.canMoveABSBase()) {return false};
	if (this.isGuarding()) {return false};
    return true;
};



//==============================
// * is Command Tool Usable
//==============================
Game_Player.prototype.commandToolUsable = function() {
	if (!$gameSystem.isAbsMode()) {return false};
	if (this._toolEventStart) {return false};
	if (!this.canMoveABS()) {return false};
	//can't shoot if you're in cooldown!
	if (this.isInCooldown()){return false};
	if (Imported.MOG_PickupThrow) {
		if (this._pickup.enabled) {return false};
		if (this._pickup.wait > 0) {return false};
	};
	return true;
};

//==============================
// * is Command Tool Menu Usable
//==============================
Game_Player.prototype.isCommandToolMenuUsable = function() {
	if (!$gameSystem.isAbsMode()) {return false};
	if (this._toolEventStart) {return false};
	if (!this.canMoveABS()) {return false};	
	return true;
};


//==============================
// * Update Ras Battler
//==============================
Game_CharacterBase.prototype.updateRasBattler = function() {
	this.battler()._ras.diagonal = this._user.diagonal;
	if (this.battler()._ras.poseDuration > 0) {this.updatePoseDuration()};
	// add act duration update
	if (this.battler()._ras.actDuration > 0) {this.updateActDuration()};
	if (this.battler()._ras.cooldownDuration>0){this.updateCooldownDuration()};
	if (this.battler()._ras.collisionD > 0) {this.battler()._ras.collisionD--};
	if (this.needUpdateKnockBack()) {
		this.updateKnockbackDuration();
	};	
	if (this.battler()._ras.combo.time > 0 && !this.isActing()) {
		this.battler()._ras.combo.time--;
	    if (this.battler()._ras.combo.time <= 0) {
			this.battler().clearRasCombo()};	
	};
  	if (this.battler()._ras.hookshotUser[1]) {this.updateHookshot()};
	if (this.battler().isCharging() && !this.isKnockbacking()) {this.updateCharging()};
	if (this.isCasting() && !$gameSystem._chronoMode.inTurn) {this.updateCasting()};
	if ($gameSystem.isChronoMode()) {this.updateChronoModeChar()}
	
	if (CrossEngine.damageFlash)
	{
		var flashFrame = this.battler()._ras.collisionD%10;
		if (flashFrame == 6)
		{
			this.requestAnimation(CrossEngine.damageFlash)//hardcoded animation that pulses for 5 frames
		}
	}
};



//==============================
// * Update Pose Duration
//==============================
Game_CharacterBase.prototype.updatePoseDuration = function() {
	//base our pose duration off of animation wait
	// animation wait formula is 
	//(9 - this.realMoveSpeed())*3
	// with 4 as the default move speed
	// so this cancels it out (roughly), meaning that an animation that plays
	// exactly once at a speed of 4 will play exactly once at a speed of 5
	// at least in principle there are probably hella rounding errors in this
	
	
	// if we have poseFixedTime set, it does the old behavior of playing for
	// a fixed number of frames, regardless of whether that means it plays a
	// different number of times.
     if (this.battler()._ras.poseFixedTime)
	 {
		this.battler()._ras.poseDuration-- 
	 }else{
		 //round to two decimal places on this to avoid floating point shenanigans
		this.battler()._ras.poseDuration = 1*( (this.battler()._ras.poseDuration -(9-this.realMoveSpeed())/(5)).toFixed(2));
	 }
	 
	 
	 // 
};

//==============================
// * Update Acting (IE: unable to move OR shoot because you're posing) Duration
//==============================
Game_CharacterBase.prototype.updateActDuration = function() {
     this.battler()._ras.actDuration--;
	 if (this.battler()._ras.actDuration === 0) {this.clearActing()};
};

//==============================
// * Update Cooldown (IE: unable to shoot because you're posing) Duration
//==============================

Game_CharacterBase.prototype.updateCooldownDuration = function() {
     this.battler()._ras.cooldownDuration--;
	 if ( (this == $gamePlayer ) && (this.battler()._ras.cooldownDuration==0))
		 {
			//If you want an audio cue for being off cooldown, this would be
			//the right place to put it
	 		SceneManager._scene._toolHud[0].refreshHud();
			SceneManager._scene._toolHud[1].refreshHud();
			SceneManager._scene._toolHud[2].refreshHud();
			SceneManager._scene._toolHud[3].refreshHud();
		 }
};

Game_CharacterBase.prototype.isInCooldown = function() {
	if (!this.battler()) {return false};
	if (this.battler()._ras.cooldownDuration > 0) {return true};
    return false 
};


if (Imported.MOG_ChronoToolHud)
{	
	//gray out weapons while in cooldown
	Cross_ToolHud_refreshCostItem = ToolHud.prototype.refreshCostItem;
	ToolHud.prototype.refreshCostItem = function() {
		Cross_ToolHud_refreshCostItem.call(this)
		if ($gamePlayer.isInCooldown())
		{
			this._itemEnabled=false;
		}
	}
}

//==============================
// * can Action Base
//==============================
Game_CharacterBase.prototype.canActionBase = function() {
	//add cooldown preventing you from opening the menus
	if (this.isInCooldown()){return false};
	if (this.isActing()) {return false};
	if ($gameTemp._autoTarget.enabled) {return false};
	if (this.isCasting()) {return false};
	if (this.isKnockbacking()) {return false};
	if (this.isGuarding()) {return false};
	return true;
};

  
//==============================
// * Is Acting
//==============================
Game_CharacterBase.prototype.isActing = function() {
	if (!this.battler()) {return false};
	if (this._tool.enabled) {return false};
	if (this.battler()._ras.hookshotUser[0]) {return true};
	if (this.battler()._ras.actDuration>0){return true};
	//if (this.battler()._ras.poseDuration > 0) {return true};
    return false 
};

//==============================
// * Need Stop Pattern Action
//==============================
 Game_CharacterBase.prototype.needStopPatternAction = function() {
	if (!this.battler()) {return false};
	if (!this.isActing()) {return false};
	if (this.battler()._ras.poseLoop) {return false};
	if (Imported.MOG_CharPoses) {
		if (this._pattern < this._frames.max) {return false};
	} else {
	   if (this._pattern < this._user.poseMaxPattern) {return false};
	};
	return true
};
 

//================================
// * The Most Jojo Function
//================================
Game_CharacterBase.prototype.isPosing = function() {
	if (this._tool.enabled) {return false}; // tools are never posing!
	if (!this.battler()) {return false};
	if (this.battler()._ras.poseDuration > 0) {return true};
    return false 
};
  
  
  // from MOG_CharPoses
//==============================
// * Is Action Pose
//==============================
Game_CharacterBase.prototype.isActionPose  = function() {
	 if (this.battlerPoses()) {return (this.isPosing())};
	 return false;
};
  
//==============================
// * Is Idle Pose
//==============================
Game_CharacterBase.prototype.isIdlePose = function() {
	if (CrossEngine.disableIdlePoses){return false}
	if (Imported.MOG_ChronoEngine && $gamePlayer && $gamePlayer.battler())	 { 
	    if ($gameSystem.isChronoMode()) {return false};
	    if ($gamePlayer.isActing() ||$gamePlayer.isPosing() || $gamePlayer.isKnockbacking()) {
			this._poses.idle[1] = this._poses.idle[2];
		    return false
		};
	};
	if (!this._poses.idle[0]) {return false};
	if (this._poses.idle[1] > 0) {return false};
	if (this.isMoving()) {return false};
	if (this._inMotion){return false}; //my new addition for testing if the character is ACTUALLY moving
	if (this.isJumping()) {return false};
	if (Imported.MOG_PickupThrow  && $gamePlayer._pickup.enabled) {return false};
    return true;
};


//this is after isIdlePose in that big chain of pose assignments
//so I can assume that I'm not idling already.
Game_CharacterBase.prototype.isStandingPose = function(){
	if(!CrossEngine.StandingPoses){return false}
	if(!(this._poses.standing[0])){return false}
	//if we just came out of a static pose, convert to plain standing
	if (this._characterName.contains('_static'))
	{
		this._poses.idle[1]-= CrossEngine.StandDelay
		return true;
	}
	//give it 1 frame less than stand delay to stand from walking
	//overlap with the _static means transition is seamless.
	if (this._poses.idle[1] + CrossEngine.StandDelay -1< this._poses.idle[2]) {return true};
	return false;
}
//==============================
// * Set Standing Pose
//==============================
Game_CharacterBase.prototype.setStandingPose = function() 
{
	this._poses.standing[1]=true;
	return this._originalName.name + "_standing";
}



//FIXING THE BROKEN .isMoving(), replacing it with the ._inMotion
//==============================
// * update Force Movement Ras
//==============================
Game_CharacterBase.prototype.updateForceMovementRas = function() {
	this._through = false;
	this._moveSpeed = 3;
	this._directionFix = false;
	if (this._user.isPlayer) {$gamePlayer._moveSpeed = 3};
    var x = this._chrono.nextX;
    var y = this._chrono.nextY;
    direction = this.findDirectionTo(x, y);
	$gameSystem._chronoMode.phaseDuration = this._moveSpeed < 5 ? 40 : 30;
    if (direction > 0) {this.moveStraight(direction)};
	    if (!this._inMotion) {
			var preX = this._chrono.nextX;
			var preY = this._chrono.nextY;
			this._chrono.nextX = null;	
			this._chrono.nextY = null;	
			this._moveSpeed = this._chrono.premapMoveSpeed;
			if (this._user.isPlayer) {$gamePlayer._moveSpeed = $gamePlayer._chrono.premapMoveSpeed};
			if ($gameChrono.phase() === 1) {
				this._chrono.orgX = this._x;
				this._chrono.orgY = this._y;
				var ftarget = $gameChrono.setFirstTarget(this);
				if (ftarget) {this._chrono.target = ftarget};
				if (this._chrono.dir > 0) {
				   this.setDirection(this._chrono.dir);
			    } else {
					if (this.distanceToPoint(preX , preY)>0.5) {
				        this.turnTowardCharacter(this._chrono.target);
					} else {
						if (this._chrono.target) {
					   	    this.turnTowardCharacter(this._chrono.target);
						} else {
							this.setDirection($gamePlayer._direction);
						};
					};
			    };
			} else {
                $gameSystem._chronoMode.phase = 10;
				this.turnTowardCharacter($gamePlayer);
				this._through = true;
				this._moveSpeed = $gamePlayer._moveSpeed;
                this._direction = this._chrono.premapD;				
			};
		};
};
//FIXING THE BROKEN .isMoving(), replacing it with the ._inMotion
//==============================
// * load Battle Parameters
//==============================
Game_Chrono.prototype.loadCharacterParameters = function(direction) {
	for (var i = 0; i < $gameMap.players().length; i++) {
	     var character = $gameMap.players()[i];
		 var oldX = character._x;
		 var oldY = character._y;
		 character.loadOrgParameters(direction);
		 if (oldX != character._x || oldY != character._y || character._inMotion) {
		    character.jump(0,0)	 
		 };		 
	};
	for (var i = 0; i < $gameMap.enemiesF().length; i++) {
	     var character = $gameMap.enemiesF()[i];
		 var oldX = character._x;
		 var oldY = character._y;	 
		 if (!character.battler().isDead()) {
			 var mov = character._inMotion
			 character.loadOrgParameters(direction);
			 if (character._inMotion && !mov) {
				character.jump(0,0)	 
			 };					 
		 };
	};	
};

//FIXING THE BROKEN .isMoving(), replacing it with the ._inMotion
//==============================
// * update Move ToTarget
//==============================
Game_Chrono.prototype.updateMoveToTargetCN = function(char,battler) {
	if (!char._inMotion && !char.isJumping()) {battler._chrono.actionPhase = 2};
};

//FIXING THE BROKEN .isMoving(), replacing it with the ._inMotion
//==============================
// * update Move Back CN
//==============================
Game_Chrono.prototype.updateMoveBackCN = function(char,battler) {
	if (!char._inMotion && !char.isJumping()) {battler._chrono.actionPhase = 7};
};


//==============================
// * Update Crono
//==============================
Game_CharacterBase.prototype.updateChrono = function() {
    if (this._chrono.nextX != null) {
		if (!this._inMotion) {this.updateForceMovementRas()};
	};
};



//if we want to have separate poses for moving and firing vs just moving
//tag it as (walking) in the filename for the walking version.
//note that htis can end up with filenames like
// $Character(y24)(d8)(8ccw)(f4)_Fire(s1)(walking)_static(f1)
//and we will all have to live with it
Game_CharacterBase.prototype.setFlexibleStandPose = function(myPose)
{
	if (myPose.contains('(walking)'))
	{
		if (!this._inMotion) 
		{
			return myPose+"_static"
			};
	}
	return myPose
	
}


//==============================
// * start Effect
//==============================
ToolEvent.prototype.startEffect = function() {
   this._locked = true
   this.start();
   this._locked = false;
   if (this._tool.animationID3 > 0) {
       this.user().requestAnimation(this._tool.animationID3);
   };
   if(this.user().battler()._ras.poseSuffix.contains('(walking)'))
   {
	   //if our pose is a 'walking' pose, don't reset our pattern.
   }else{
	   this.user().straighten(); 
   }
};

//when you disable character poses with a plugin command
// it should set your pose to standing, rather than freeze you midanimation.
//taken from MOG_CharPoses, obviously.
var Cross_mog_charPose_pluginCommand = Game_Interpreter.prototype.pluginCommand
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	
	if(command === "disable_charposes")  {
		if($gamePlayer._poses.standing[0]=="true")
		{
			$gamePlayer._characterName=$gamePlayer._originalName.name+""+$gamePlayer.doesPoseExist("_standing")
			$gamePlayer.setCharacterFrames();
			$gamePlayer._stepAnime=false;
		}else{
			$gamePlayer._characterName=$gamePlayer._originalName.name;
			$gamePlayer.setCharacterFrames();
			$gamePlayer._stepAnime=false;
			}
	};
	if(command === "disable_idleposes")  {
		CrossEngine.disableIdlePoses=true;
	};
	if(command === "enable_idleposes")  {
		CrossEngine.disableIdlePoses=false;
	};
	Cross_mog_charPose_pluginCommand.call(this,command, args)
};


// I have altered the knockback and death poses so they are now separate!
//==============================
// * Is Knockbacking
//==============================
Game_CharacterBase.prototype.isKnockbacking = function() {
	if (this._tool.enabled) {return false};
	if (!this.battler()) {return false}
	if (this.battler()._ras.knockback[1] > 0) {return true};
	if (this.battler().isDead()) {return true};
    return false 
};
  
  //stop enemies from moving upon death
  Cross_SetDeadEnemy=Game_CharacterBase.prototype.setDeadEnemy;
  Game_CharacterBase.prototype.setDeadEnemy = function(char,battler) {
	  Cross_SetDeadEnemy.call(this,char,battler);
	  char._moveTarget=false; //stop it from moving
  }
  
// A fix for dashing poses from MOG_CharPoses, since isMoving works a differently in altimit.

//==============================
// * Is Dashing Pose
//==============================	
Game_CharacterBase.prototype.isDashingPose = function() {
	if (!this._poses.dash[0]) {return false};
	if (this._memberIndex) {return this.isDashingPoseFollower()};
	if (!this._inMotion) {return false};
	if (this.isPosing()){return false}; //posing takes priority over dashing
    return this.isDashing();
};
  
  ///////////////////////////////////////////////////////////////////////////////// 
  // Compatiblity mod for YEP_Event_Spawner
  /////////////////////////////////////////////////////////////////////////////////
  // essentially the problem is that YEP assumes that events 1000+ are all reserved
  // for its own personal use
  // whereas Mog's code by default just pushes tools onto the event list
  // once a yanfly event is created that means that mog's will push into yanfly's reserved slots
  // which means that the tools get erased, leaving only their sprites behind.
  //  This makes YEP event spawner stop stepping on mog's toes and also makes it more efficient
  
  // Note: I can't distribute YEP_Event_Spawner with this cross-compatibility plugin so if you 
  // don't have it, you can get it from http://yanfly.moe/ .  Not that I think there's anyone
  // reading these note who doesn't know who yanfly is lol.




// the default setting for number of spawned events is 1000.
//look, if you have more than a thousand events spawned onscreen
// at once, and the performance is still good?  You obviously
// know better than me how to optimize this stuff.

if (Imported.YEP_EventSpawner) {

	 Yanfly.SpawnEvent = function(mapId, eventId, x, y, preserved) {
			//there's a huge performance issue with yanfly's event spawner due to how rpgmaker just 'hides' erased events rather than actually removing them.
			// I am going to take a page out of mog's book
			// and actually erase for real any erased spawned event
			
			//first the sprites
		for (var i = 0; i < SceneManager._scene._spriteset._characterSprites.length; i++) {
			var char = SceneManager._scene._spriteset._characterSprites[i];
			if (char && char._character._erased) {
				SceneManager._scene._spriteset._tilemap.removeChild(char);
				char._character.endAnimation();
				char._character.erase();
			};        
		};
			//then the actual events
		for (var i = 0; i < $gameMap._spawnedEventIds.length; i++) 
		{
			
			var ev = $gameMap._events[$gameMap._spawnedEventIds[i]];
			if(ev&&ev._spawned && ev._erased &&!ev._spawnPreserved)
				{
					//wipe the event for reuse
					
					//clear any lingering self switches
					
					var letters = ['A','B','C','D']
					for (var j = 0; j < letters.length; j++) 
					{
						var key = [$gameMap._mapId, $gameMap._spawnedEventIds[i], letters[j]];
						$gameSelfSwitches.setValue(key, false);
					}
					$gameMap._events[$gameMap._spawnedEventIds[i]]=undefined;
					//excise from the list of spawned items
					$gameMap._spawnedEventIds.splice(i,1)
					$gameMap._spawnedEvents.splice(i,1)
					i--;
				}
		} 
		
		if ($gameParty.inBattle()) return;
		if (Yanfly.SpawnEventFailChecks(mapId, eventId, x, y)) return;
		preserved = preserved || false;
		$gameMap.spawnEvent(mapId, eventId, x, y, preserved);
	};

	  
	Game_Map.prototype.spawnEvent = function(mapId, eventId, x, y, preserved) {
		var spawnId=-1;
		if (this._spawnedEvents.length<CrossEngine.MaxEventSpawn)
		{
			//scan through our yanfly reserved event ids to find an open slot
			for (var i = Yanfly.Param.EventSpawnerID; i < Yanfly.Param.EventSpawnerID+CrossEngine.MaxEventSpawn; ++i) {
				if(!$gameMap._events[i])
				{
					spawnId=i;
					break
				}
			}
			if (spawnId==-1)
			{
				if ($gameTemp.isPlaytest()) 
				{
					console.log('all events are full, even though we SHOULD have checked that')
				}
				return;
			}
		}else{
			//if we have our maximum number of spawned events
			// and they ALL exist, then throw an error to the console and abort
			if ($gameTemp.isPlaytest()) 
			{
				console.log('We have reached the maximum of '+CrossEngine.MaxEventSpawn+" spawned events!");
			}
			return;
		}

		$gameTemp._SpawnData = {
		baseMapId: this.mapId(),
		spawnId: spawnId,
		mapId: mapId,
		eventId: eventId, 
		x: x, 
		y: y,
		preserved: preserved
		};
		var spawnedEvent = new Game_Event(mapId, eventId);
		this._events[spawnId]=spawnedEvent;
		this._spawnedEvents.push(spawnedEvent); //
		this._spawnedEventIds.push(spawnId);
		
		this._cumulativeSpawnedEvents+=1;
		//this._spawnedEvents[spawnId - Yanfly.Param.EventSpawnerID] = spawnedEvent;
		$gameTemp._SpawnData = undefined;
	};

	// change the event Id check to use our new list
	Yanfly.DespawnEventID = function(eventId) {
	  if ($gameMap._spawnedEventIds.indexOf(eventId) == -1) {
		if ($gameTemp.isPlaytest()) {
		  console.log('Event ID ' + eventId + ' is not a valid spawned event ID.');
		  return;
		}
	  }
	  $gameMap.despawnEventId(eventId);
	};

	Yanfly.ClearSpawnedEvents = function(mapId) {
	  mapId = mapId || $gameMap.mapId();
	  var data = $gameSystem.getMapSpawnedEventData(mapId);
	  for (var i = 1; i < data.length; i=i+1) {
		var eventData = data[i];
		if (!eventData) continue;
		var eventId = eventData.eventId();
		if (mapId === $gameMap.mapId()) {
		  Yanfly.DespawnEventID(eventId);
		  i=i-1; // if we splice them out we gotta reduce our counter, 
				 // since the entire list of events is getting shorter
		  } else {
		  data.splice(i,1);
		  i=i-1;
		}
	  }
	};


	//=============================================================================
	// Game_System
	//=============================================================================


	Game_System.prototype.removeTemporaryMapSpawnedEvents = function(mapId) {
	  var data = this.getMapSpawnedEventData(mapId);
	  for (var i = 1; i < data.length; ++i) {
		var eventData = data[i];
		if (!eventData) continue;
		if (eventData._spawnPreserved) continue;
		//clear any lingering self switches
		
		var letters = ['A','B','C','D']
		for (var j = 0; j < letters.length; j++) 
		{
			var key = [$gameMap._mapId, eventData._eventId, letters[j]];
			$gameSelfSwitches.setValue(key, false);
		}
		data.splice(i,1); //just delete them instead of nulling them
		i=i-1;
	  }
	};

	//=============================================================================
	// Game_Map
	//=============================================================================

	Game_Map.prototype.setupSpawnedEvents = function(mapId) {
	  if (mapId !== this.mapId() && $gamePlayer) {
		$gameSystem.removeTemporaryMapSpawnedEvents(this.mapId())
	  }
	  this._spawnedEvents = $gameSystem.getMapSpawnedEventData(mapId);
	  this._spawnedEventIds=[];
	  this._cumulativeSpawnedEvents=0;  //tracks how many we've spawned total (including erased ones).
	};

	Game_Map.prototype.restoreSpawnedEvents = function() {
	  var length = this._spawnedEvents.length;
	  for (var i = 0; i < length; ++i) {
		var spawnedEvent = this._spawnedEvents[i];
		this._spawnedEventIds[i]=null;
		if (!spawnedEvent) continue;
		this._events[i + Yanfly.Param.EventSpawnerID] = spawnedEvent;
		this._spawnedEventIds[i]=i + Yanfly.Param.EventSpawnerID;
		this._events[i + Yanfly.Param.EventSpawnerID]._eventId = i + Yanfly.Param.EventSpawnerID;// make sure it knows what its new id is
		spawnedEvent._pageIndex = -2;
		this._needsRefresh = true;
	  }
	};


	Game_Map.prototype.despawnEventId = function(eventId) {
		//change the check to see if it's in our list
	  if (this._spawnedEventIds.indexOf(eventId) == -1) {return;}
	  if (!this._spawnedEvents) return;
	  var ev = this.event(eventId);
	  ev.locate(-1, -1);
	  this.eraseEvent(eventId);
	  this._spawnedEvents.splice(this._spawnedEventIds.indexOf(eventId),1);
	  this._spawnedEventIds.splice(this._spawnedEventIds.indexOf(eventId),1);
	  this._events[eventId]=undefined;
	};

}

//==========================OTHER COMPATIBILITY PATCHES=============================
//compatibilty patch for yanfly itemcore
Game_Map.prototype.setup = function(mapId) {
	_mog_toolSys_gmap_setup.call(this,mapId);  // not defining this because I am leaping over mog's edit of this funciton
	//if we have the event spawner in play, make sure that we bracket both
	//ends of it, so we don't overwrite yan events with mog events
	if (Imported.YEP_EventSpawner)
	{
		this._events[CrossEngine.MaxEventSpawn+Yanfly.Param.EventSpawnerID]=undefined;
	}
	
	this._treasureEvents = [];
	this._battlersOnScreen = [];
	this._enemiesOnScreen = [];
	this._actorsOnScreen = [];
	$gameSystem._toolsOnMap = [];
	$gameTemp.clearToolCursor();
	//console.log($gameSystem._toolsData);// with itemcore, this always returns an empty array [] 
	//without itemcore, it returns 'null', then an the proper item  list, so clearly _toolsdata isn't getting set right
	//I assume the 'null' gets overridden by one of yanfly's blanket definitions, and since I can't find that
	// I'm just testing to see if the list is empty.  If it is, grab the tools again
	// it seems to work!
	//if (!$gameSystem._toolsData) {this.dataMapToolClear()};
	if (!$gameSystem._toolsData) {this.dataMapToolClear()
		}else{ if ($gameSystem._toolsData.length == 0) {this.dataMapToolClear()};
		}
	for (var i = 0; i < $gameParty.members().length; i++) {
		var actor = $gameParty.members()[i];
		actor.clearActing();
		$gameSystem._toolHookshotSprite = [null,null,0];
	};
};













// ===== Copypasted from Altimit =====
// copypasted here because I honestly don't know  how to get at the Collider()
// functions from outside Altimit.
// There's PROBABLY some dumb way I don't know that can force my 
// stuff to execute in the right context but I don't know enough
// about javascript to do it.

// renamed to CrossCollider because I'm doing some little tweaks to these functions
// to test to see if things are touching each other.
  function CrossCollider() {
    throw new Error( 'This is a static class' );
  }
  ( function() {

    CrossCollider.CIRCLE = 0;
    CrossCollider.POLYGON = 1;
    CrossCollider.LIST = 2;
    CrossCollider.PRECISION = Math.pow( 2, 7 );
    CrossCollider.I_PRECISION = 1 / CrossCollider.PRECISION;
    CrossCollider.PRESETS = [];

    CrossCollider.createList = function() {
      return { type: CrossCollider.LIST, colliders: [], aabbox: { left: Number.POSITIVE_INFINITY, top: Number.POSITIVE_INFINITY, right: Number.NEGATIVE_INFINITY, bottom: Number.NEGATIVE_INFINITY } };
    };

    CrossCollider.addToList = function( list, collider ) {
      list.colliders.push( collider );
      list.aabbox.left = collider.aabbox.left < list.aabbox.left ? collider.aabbox.left : list.aabbox.left;
      list.aabbox.top = collider.aabbox.top < list.aabbox.top ? collider.aabbox.top : list.aabbox.top;
      list.aabbox.right = collider.aabbox.right > list.aabbox.right ? collider.aabbox.right : list.aabbox.right;
      list.aabbox.bottom = collider.aabbox.bottom > list.aabbox.bottom ? collider.aabbox.bottom : list.aabbox.bottom;
    };

    CrossCollider.getPreset = function( id ) {
      if ( CrossCollider.PRESETS.length === 0 ) {
        // Index starts at 1 (first item is null collider)
        CrossCollider.PRESETS[0] = CrossCollider.null();
        for ( var ii = 0; ii < PRESETS.length; ii++ ) {
          var xmlDoc = DOM_PARSER.parseFromString( '<collider>' + JSON.parse( PRESETS[ii] ) + '</collider>', 'text/xml' );
          CrossCollider.PRESETS[ii + 1] = CrossCollider.createFromXML( xmlDoc );

          var childNodes = xmlDoc.childNodes[0].childNodes;
          for ( var jj = 0; jj < childNodes.length; jj++ ) {
            if ( childNodes[jj].nodeName === 'name' ) {
              CrossCollider.PRESETS[childNodes[jj].innerHTML.trim()] = CrossCollider.PRESETS[ii + 1];
              break;
            }
          }
        }
      }
      return CrossCollider.PRESETS[id] || null;
    };

    CrossCollider.createFromXML = function( xml ) {
      var xmlDoc = ( typeof xml === 'string' ? DOM_PARSER.parseFromString( xml, 'text/xml' ) : xml );
      var childNodes = xmlDoc.childNodes;
      for ( var ii = 0; ii < xmlDoc.childNodes.length; ii++ ) {
        if ( xmlDoc.childNodes[ii].nodeName === 'collider' ) {
          childNodes = xmlDoc.childNodes[ii].childNodes;
          break;
        }
      }
      var filterNodes = [];
      for ( var ii = 0; ii < childNodes.length; ii++ ) {
        switch ( childNodes[ii].nodeName ) {
        case 'rect':
        case 'circle':
        case 'line':
        case 'polygon':
        case 'regular':
          filterNodes.push( childNodes[ii] );
          break;
        }
      }
      childNodes = filterNodes;
      if ( childNodes.length === 0 ) {
        return CrossCollider.null();
      } else if ( childNodes.length === 1 ) {
        switch ( childNodes[0].nodeName ) {
        case 'rect':
          var x = Number( childNodes[0].getAttribute( 'x' ) );
          var y = Number( childNodes[0].getAttribute( 'y' ) );
          var width = Number( childNodes[0].getAttribute( 'width' ) );
          var height = Number( childNodes[0].getAttribute( 'height' ) );
          return CrossCollider.createRect( x, y, width, height );
        case 'circle':
          var cx = Number( childNodes[0].getAttribute( 'cx' ) );
          var cy = Number( childNodes[0].getAttribute( 'cy' ) );
          var r = Number( childNodes[0].getAttribute( 'r' ) );
          return CrossCollider.createCircle( cx, cy, r );
        case 'line':
          var x1 = Number( childNodes[0].getAttribute( 'x1' ) );
          var y1 = Number( childNodes[0].getAttribute( 'y1' ) );
          var x2 = Number( childNodes[0].getAttribute( 'x2' ) );
          var y2 = Number( childNodes[0].getAttribute( 'y2' ) );
          return CrossCollider.createLine( x1, y1, x2, y2 );
        case 'polygon':
          var points = childNodes[0].getAttribute( 'points' ).split( ' ' );
          for ( var jj = 0; jj < points.length; jj++ ) {
            points[jj] = points[jj].split( ',' );
            for ( var kk = 0; kk < points[jj].length; kk++ ) {
              points[jj][kk] = Number( points[jj][kk] );
            }
          }
          return CrossCollider.createPolygon( points );
        case 'regular':
          var cx = Number( childNodes[0].getAttribute( 'cx' ) );
          var cy = Number( childNodes[0].getAttribute( 'cy' ) );
          var rx = Number( childNodes[0].getAttribute( 'rx' ) );
          var ry = Number( childNodes[0].getAttribute( 'ry' ) );
          var p = Number( childNodes[0].getAttribute( 'p' ) );
          return CrossCollider.createRegularPolygon( cx, cy, rx, ry, p );
        }
      } else {
        var colliderList = CrossCollider.createList();
        for ( var ii = 0; ii < childNodes.length; ii++ ) {
          switch ( childNodes[ii].nodeName ) {
          case 'rect':
            var x = Number( childNodes[ii].getAttribute( 'x' ) );
            var y = Number( childNodes[ii].getAttribute( 'y' ) );
            var width = Number( childNodes[ii].getAttribute( 'width' ) );
            var height = Number( childNodes[ii].getAttribute( 'height' ) );
            CrossCollider.addToList( colliderList, CrossCollider.createRect( x, y, width, height ) );
            break;
          case 'circle':
            var cx = Number( childNodes[ii].getAttribute( 'cx' ) );
            var cy = Number( childNodes[ii].getAttribute( 'cy' ) );
            var r = Number( childNodes[ii].getAttribute( 'r' ) );
            CrossCollider.addToList( colliderList, CrossCollider.createCircle( cx, cy, r ) );
            break;
          case 'line':
            var x1 = Number( childNodes[ii].getAttribute( 'x1' ) );
            var y1 = Number( childNodes[ii].getAttribute( 'y1' ) );
            var x2 = Number( childNodes[ii].getAttribute( 'x2' ) );
            var y2 = Number( childNodes[ii].getAttribute( 'y2' ) );
            CrossCollider.addToList( colliderList, CrossCollider.createLine( x1, y1, x2, y2 ) );
            break;
          case 'polygon':
            var points = childNodes[ii].getAttribute( 'points' ).split( ' ' );
            for ( var jj = 0; jj < points.length; jj++ ) {
              points[jj] = points[jj].split( ',' );
              for ( var kk = 0; kk < points[jj].length; kk++ ) {
                points[jj][kk] = Number( points[jj][kk] );
              }
            }
            CrossCollider.addToList( colliderList, CrossCollider.createPolygon( points ) );
            break;
          case 'regular':
            var cx = Number( childNodes[ii].getAttribute( 'cx' ) );
            var cy = Number( childNodes[ii].getAttribute( 'cy' ) );
            var rx = Number( childNodes[ii].getAttribute( 'rx' ) );
            var ry = Number( childNodes[ii].getAttribute( 'ry' ) );
            var p = Number( childNodes[ii].getAttribute( 'p' ) );
            CrossCollider.addToList( colliderList, CrossCollider.createRegularPolygon( cx, cy, rx, ry, p ) );
            break;
          }
        }
        return colliderList;
      }
    };

    CrossCollider.createRect = function( x, y, width, height ) {
      return CrossCollider.createPolygon( [
        [ x, y ],
        [ x + width, y ],
        [ x + width, y + height ],
        [ x, y + height ]
      ] );
    };

    CrossCollider.createLine = function( x1, y1, x2, y2 ) {
      return CrossCollider.createPolygon( [
        [ x1, y1 ],
        [ x2, y2 ],
      ] );
    };

    CrossCollider.createCircle = function( x, y, radius ) {
      return { type: CrossCollider.CIRCLE, x: x, y: y, radius: radius, aabbox: { left: x - radius, top: y - radius, right: x + radius, bottom: y + radius } };
    };

    CrossCollider.createPolygon = function( vertices ) {
      var aabbox = {
        left: Number.POSITIVE_INFINITY,
        top: Number.POSITIVE_INFINITY,
        right: Number.NEGATIVE_INFINITY,
        bottom: Number.NEGATIVE_INFINITY,
      };
      vertices.forEach( function( vertex ) {
        if ( vertex[0] < aabbox.left ) { aabbox.left = vertex[0]; }
        if ( vertex[1] < aabbox.top ) { aabbox.top = vertex[1]; }
        if ( vertex[0] > aabbox.right ) { aabbox.right = vertex[0]; }
        if ( vertex[1] > aabbox.bottom ) { aabbox.bottom = vertex[1]; }
      } );
      return { type: CrossCollider.POLYGON, vertices: vertices, aabbox: aabbox };
    };

    CrossCollider.createRegularPolygon = function( x, y, sx, sy, points ) {
      if ( !points || points < 3 ) {
        return CrossCollider.createCircle( x, y, Math.sqrt( sx * sx +  sy * sy ) );
      }
      var vertices = [];
      var divisor = points / ( Math.PI * 2 );
      var pi2 = Math.PI / 2;
      for ( var ii = 0; ii < points; ii++ ) {
        vertices.push( [ x + Math.cos( ii / divisor - pi2 ) * sx, y + Math.sin( ii / divisor - pi2 ) * sy ] );
      }
      return CrossCollider.createPolygon( vertices );
    };

    CrossCollider.null = function() {
      if ( !CrossCollider._null ) {
        CrossCollider._null = CrossCollider.createPolygon( [] );
      }
      return CrossCollider._null;
    };

    CrossCollider.sharedTile = function() {
      if ( !CrossCollider._sharedTile ) {
        CrossCollider._sharedTile = CrossCollider.createPolygon( [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
        ] );
      }
      return CrossCollider._sharedTile;
    };

    CrossCollider.sharedCircle = function() {
      if ( !CrossCollider._sharedCircle ) {
        CrossCollider._sharedCircle = CrossCollider.createCircle( 0.5, 0.5, 0.5 );
      }
      return CrossCollider._sharedCircle;
    };

    CrossCollider.sharedCharacter = function() {
      if ( !CrossCollider._sharedCharacter ) {
        CrossCollider._sharedCharacter = CrossCollider.createCircle( 0.5, 0.7, 0.25 );
      }
      return CrossCollider._sharedCharacter;
    };

    CrossCollider.sharedAirship = function() {
      if ( !CrossCollider._sharedAirship ) {
        CrossCollider._sharedAirship = CrossCollider.createCircle( 0.5, 0.5, 0.25 );
      }
      return CrossCollider._sharedAirship;
    };

    CrossCollider.sharedShip = function() {
      if ( !CrossCollider._sharedShip ) {
        CrossCollider._sharedShip = CrossCollider.createCircle( 0.5, 0.5, 0.5 );
      }
      return CrossCollider._sharedShip;
    };

    CrossCollider.sharedBoat = function() {
      if ( !CrossCollider._sharedBoat ) {
        CrossCollider._sharedBoat = CrossCollider.createCircle( 0.5, 0.5, 1 / 3 );
      }
      return CrossCollider._sharedBoat;
    };

    CrossCollider.polygonsWithinColliderList = function( ax, ay, aabbox, bx, by, bc ) {
      var polygons = [];
      for ( var ii = 0; ii < bc.colliders.length; ii++ ) {
        if ( CrossCollider.aabboxCheck( ax, ay, aabbox, bx, by, bc.colliders[ii].aabbox ) ) {
          if ( bc.colliders[ii].type === CrossCollider.LIST ) {
            polygons = polygons.concat( CrossCollider.polygonsWithinColliderList( ax, ay, aabbox, bx, by, bc.colliders[ii] ) );
          } else {
            polygons.push( bc.colliders[ii] );
          }
        }
      }
      return polygons;
    };

    CrossCollider.encaseCircleCircle = function( ax, ay, ac, bx, by, bc ) {
      ax = ax + ac.x;
      ay = ay + ac.y;
      bx = bx + bc.x;
      by = by + bc.y;

      var dx = ax - bx;
      var dy = ay - by;
      var dd = dx * dx + dy * dy;
      dd -= ( bc.radius * bc.radius );
      if ( dd < ac.radius * ac.radius ) {
        return true;
      }

      return false;
    };

    CrossCollider.intersectCircleCircle = function( ax, ay, ac, bx, by, bc ) {
      ax = ax + ac.x;
      ay = ay + ac.y;
      bx = bx + bc.x;
      by = by + bc.y;

      var dx = ax - bx;
      var dy = ay - by;
	  //the 0.033 is edited in restart
	  //this is so testing for things touching succeeds even when altimit forces
	  //things not to collide.
      var dd = dx * dx + dy * dy -0.03;
      var rr = bc.radius + ac.radius;
      if ( dd < rr * rr ) {
        return true;
      }

      return false;
    };

    CrossCollider.moveCircleCircle = function( ax, ay, ac, bx, by, bc, vector ) {
      ax = ax + ac.x;
      ay = ay + ac.y;
      bx = bx + bc.x;
      by = by + bc.y;

      var dx = ax + vector.x - bx;
      var dy = ay + vector.y - by;
      var dd = dx * dx + dy * dy;
      var rr = bc.radius + ac.radius;
      if ( dd < rr * rr ) {
        dd = rr - Math.sqrt( dd );
        var dl = Math.sqrt( dx * dx + dy * dy );
        vector.x += ( dx / dl ) * dd;
        vector.y += ( dy / dl ) * dd;
      }

      return vector;
    };

    CrossCollider.encaseCirclePolygon = function( ax, ay, ac, bx, by, bc ) {
      var aradius = ac.radius + CrossCollider.I_PRECISION;
      ax = ax + ac.x;
      ay = ay + ac.y;

      var closestPoint = {
        distance: Number.POSITIVE_INFINITY,
      };
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
        var dx = ( ax ) - ( bx + bc.vertices[ii][0] );
        var dy = ( ay ) - ( by + bc.vertices[ii][1] );
        var d = dx * dx + dy * dy;
        if ( d < closestPoint.distance ) {
          closestPoint.dx = dx;
          closestPoint.dy = dy;
          closestPoint.distance = d;
          closestPoint.index = ii;
        }
      }

      var planeX = closestPoint.dx;
      var planeY = closestPoint.dy;
      var length = Math.sqrt( planeX * planeX + planeY * planeY );
      planeX /= length;
      planeY /= length;

      // Project circle
      var point = planeX * ( ax ) + planeY * ( ay );
      var maxA = point + aradius;
      var minA = point - aradius;

      // Project polygon
      var minB = Number.POSITIVE_INFINITY;
      var maxB = Number.NEGATIVE_INFINITY;
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
          var projection = planeX * ( bx + bc.vertices[ii][0] ) + planeY * ( by + bc.vertices[ii][1] );
          if ( projection < minB ) minB = projection;
          if ( projection > maxB ) maxB = projection;
      }

      if ( minB < minA || maxB > maxA ) {
        return false;
      }

      var jj;
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
        jj = ii + 1;
        if ( jj == bc.vertices.length ) {
          jj = 0;
        }

        var planeX = bc.vertices[jj][1] - bc.vertices[ii][1];
        var planeY = bc.vertices[ii][0] - bc.vertices[jj][0];
        var length = Math.sqrt( planeX * planeX + planeY * planeY );
        planeX /= length;
        planeY /= length;

        // Project circle
        var point = planeX * ( ax ) + planeY * ( ay );
        var maxA = point + aradius;
        var minA = point - aradius;

        // Project polygon
        var minB = Number.POSITIVE_INFINITY;
        var maxB = Number.NEGATIVE_INFINITY;
        for ( var kk = 0; kk < bc.vertices.length; kk++ ) {
            var projection = planeX * ( bx + bc.vertices[kk][0] ) + planeY * ( by + bc.vertices[kk][1] );
            if ( projection < minB ) minB = projection;
            if ( projection > maxB ) maxB = projection;
        }

        if ( minB < minA || maxB > maxA ) {
          return false;
        }
      }

      return true;
    };

    CrossCollider.intersectCirclePolygon = function( ax, ay, ac, bx, by, bc ) {
      var aradius = ac.radius+0.03; //more restart edits to test for adjacency
      ax = ax + ac.x;
      ay = ay + ac.y;

      var closestPoint = {
        distance: Number.POSITIVE_INFINITY,
      };
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
        var dx = ( ax ) - ( bx + bc.vertices[ii][0] );
        var dy = ( ay ) - ( by + bc.vertices[ii][1] );
        var d = dx * dx + dy * dy;
        if ( d < closestPoint.distance ) {
          closestPoint.dx = dx;
          closestPoint.dy = dy;
          closestPoint.distance = d;
          closestPoint.index = ii;
        }
      }

      var planeX = closestPoint.dx;
      var planeY = closestPoint.dy;
      var length = Math.sqrt( planeX * planeX + planeY * planeY );
      planeX /= length;
      planeY /= length;

      // Project circle
      var point = planeX * ( ax ) + planeY * ( ay );
      var maxA = point + aradius;
      var minA = point - aradius;

      // Project polygon
      var minB = Number.POSITIVE_INFINITY;
      var maxB = Number.NEGATIVE_INFINITY;
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
          var projection = planeX * ( bx + bc.vertices[ii][0] ) + planeY * ( by + bc.vertices[ii][1] );
          if ( projection < minB ) minB = projection;
          if ( projection > maxB ) maxB = projection;
      }

      if ( minA >= maxB || maxA <= minB ) {
        // No collision
        return false;
      }

      var jj;
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
        jj = ii + 1;
        if ( jj == bc.vertices.length ) {
          jj = 0;
        }

        var planeX = bc.vertices[jj][1] - bc.vertices[ii][1];
        var planeY = bc.vertices[ii][0] - bc.vertices[jj][0];
        var length = Math.sqrt( planeX * planeX + planeY * planeY );
        planeX /= length;
        planeY /= length;

        // Project circle
        var point = planeX * ( ax ) + planeY * ( ay );
        var maxA = point + aradius;
        var minA = point - aradius;

        // Project polygon
        var minB = Number.POSITIVE_INFINITY;
        var maxB = Number.NEGATIVE_INFINITY;
        for ( var kk = 0; kk < bc.vertices.length; kk++ ) {
            var projection = planeX * ( bx + bc.vertices[kk][0] ) + planeY * ( by + bc.vertices[kk][1] );
            if ( projection < minB ) minB = projection;
            if ( projection > maxB ) maxB = projection;
        }

        if ( minA > maxB || maxA < minB ) {
          // No collision
          return false;
        }
      }

      return true;
    };

    CrossCollider.moveCirclePolygon = function( ax, ay, ac, bx, by, bc, vector ) {
      var aradius = ac.radius;
      ax = ax + ac.x;
      ay = ay + ac.y;

      var closestPoint = {
        distance: Number.POSITIVE_INFINITY,
      };
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
        var dx = ( ax + vector.x ) - ( bx + bc.vertices[ii][0] );
        var dy = ( ay + vector.y ) - ( by + bc.vertices[ii][1] );
        var d = dx * dx + dy * dy;
        if ( d < closestPoint.distance ) {
          closestPoint.dx = dx;
          closestPoint.dy = dy;
          closestPoint.distance = d;
          closestPoint.index = ii;
        }
      }

      var correctionDistance;
      var correctionX;
      var correctionY;
      var absDistance;

      var planeX = closestPoint.dx;
      var planeY = closestPoint.dy;
      var length = Math.sqrt( planeX * planeX + planeY * planeY );
      planeX /= length;
      planeY /= length;

      // Project circle
      var point = planeX * ( ax + vector.x ) + planeY * ( ay + vector.y );
      var maxA = point + aradius;
      var minA = point - aradius;

      // Project polygon
      var minB = Number.POSITIVE_INFINITY;
      var maxB = Number.NEGATIVE_INFINITY;
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
          var projection = planeX * ( bx + bc.vertices[ii][0] ) + planeY * ( by + bc.vertices[ii][1] );
          if ( projection < minB ) minB = projection;
          if ( projection > maxB ) maxB = projection;
      }

      if ( minA > maxB || maxA < minB ) {
        // No collision
        return vector;
      }

      correctionDistance = maxB - minA;
      correctionX = planeX;
      correctionY = planeY;
      absDistance = Math.abs( correctionDistance );

      var jj;
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
        jj = ii + 1;
        if ( jj == bc.vertices.length ) {
          jj = 0;
        }

        var planeX = bc.vertices[jj][1] - bc.vertices[ii][1];
        var planeY = bc.vertices[ii][0] - bc.vertices[jj][0];
        var length = Math.sqrt( planeX * planeX + planeY * planeY );
        planeX /= length;
        planeY /= length;

        // Project circle
        var point = planeX * ( ax + vector.x ) + planeY * ( ay + vector.y );
        var maxA = point + aradius;
        var minA = point - aradius;

        // Project polygon
        var minB = Number.POSITIVE_INFINITY;
        var maxB = Number.NEGATIVE_INFINITY;
        for ( var kk = 0; kk < bc.vertices.length; kk++ ) {
            var projection = planeX * ( bx + bc.vertices[kk][0] ) + planeY * ( by + bc.vertices[kk][1] );
            if ( projection < minB ) minB = projection;
            if ( projection > maxB ) maxB = projection;
        }

        if ( minA > maxB || maxA < minB ) {
          // No collision
          return vector;
        }

        var distance = maxB - minA;
        var gap = Math.abs( distance );
        if ( gap < absDistance ) {
          correctionDistance = distance;
          correctionX = planeX;
          correctionY = planeY;
          absDistance = gap;
        }
      }

      vector.x += correctionX * correctionDistance;
      vector.y += correctionY * correctionDistance;

      return vector;
    };

    CrossCollider.encasePolygonCircle = function( bx, by, bc, ax, ay, ac ) {
      var aradius = ac.radius - CrossCollider.I_PRECISION;
      ax = ax + ac.x;
      ay = ay + ac.y;

      var closestPoint = {
        distance: Number.POSITIVE_INFINITY,
      };
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
        var dx = ( ax ) - ( bx + bc.vertices[ii][0] );
        var dy = ( ay ) - ( by + bc.vertices[ii][1] );
        var d = dx * dx + dy * dy;
        if ( d < closestPoint.distance ) {
          closestPoint.dx = dx;
          closestPoint.dy = dy;
          closestPoint.distance = d;
          closestPoint.index = ii;
        }
      }

      var planeX = closestPoint.dx;
      var planeY = closestPoint.dy;
      var length = Math.sqrt( planeX * planeX + planeY * planeY );
      planeX /= length;
      planeY /= length;

      // Project circle
      var point = planeX * ( ax ) + planeY * ( ay );
      var maxA = point + aradius;
      var minA = point - aradius;

      // Project polygon
      var minB = Number.POSITIVE_INFINITY;
      var maxB = Number.NEGATIVE_INFINITY;
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
          var projection = planeX * ( bx + bc.vertices[ii][0] ) + planeY * ( by + bc.vertices[ii][1] );
          if ( projection < minB ) minB = projection;
          if ( projection > maxB ) maxB = projection;
      }

      if ( minA < minB || maxA > maxB ) {
        return false;
      }

      var jj;
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
        jj = ii + 1;
        if ( jj == bc.vertices.length ) {
          jj = 0;
        }

        var planeX = bc.vertices[jj][1] - bc.vertices[ii][1];
        var planeY = bc.vertices[ii][0] - bc.vertices[jj][0];
        var length = Math.sqrt( planeX * planeX + planeY * planeY );
        planeX /= length;
        planeY /= length;

        // Project circle
        var point = planeX * ( ax ) + planeY * ( ay );
        var maxA = point + aradius;
        var minA = point - aradius;

        // Project polygon
        var minB = Number.POSITIVE_INFINITY;
        var maxB = Number.NEGATIVE_INFINITY;
        for ( var kk = 0; kk < bc.vertices.length; kk++ ) {
            var projection = planeX * ( bx + bc.vertices[kk][0] ) + planeY * ( by + bc.vertices[kk][1] );
            if ( projection < minB ) minB = projection;
            if ( projection > maxB ) maxB = projection;
        }

        if ( minA < minB || maxA > maxB ) {
          return false;
        }
      }

      return true;
    };

    CrossCollider.intersectPolygonCircle = function( ax, ay, ac, bx, by, bc ) {
      return CrossCollider.intersectCirclePolygon( bx, by, bc, ax, ay, ac );
    };

    CrossCollider.movePolygonCircle = function( ax, ay, ac, bx, by, bc, vector ) {
      var ivector = {
        x: -vector.x,
        y: -vector.y,
      };
      ivector = CrossCollider.moveCirclePolygon( bx, by, bc, ax, ay, ac, ivector );
      vector.x = -ivector.x;
      vector.y = -ivector.y;
      return vector;
    };

    CrossCollider.encasePolygonPolygon = function( ax, ay, ac, bx, by, bc ) {
      var jj;
      var colliders = [ bc, ac ];
      for ( var cc = 0; cc < 2; cc++ ) {
        for ( var ii = 0; ii < colliders[cc].vertices.length; ii++ ) {
          jj = ii + 1;
          if ( jj == colliders[cc].vertices.length ) {
            jj = 0;
          }

          var planeX = colliders[cc].vertices[jj][1] - colliders[cc].vertices[ii][1];
          var planeY = colliders[cc].vertices[ii][0] - colliders[cc].vertices[jj][0];
          var length = Math.sqrt( planeX * planeX + planeY * planeY );
          planeX /= length;
          planeY /= length;

          // Project polygon A
          var minA = Number.POSITIVE_INFINITY;
          var maxA = Number.NEGATIVE_INFINITY;
          for ( var kk = 0; kk < ac.vertices.length; kk++ ) {
              var projection = planeX * ( ax + ac.vertices[kk][0] ) + planeY * ( ay + ac.vertices[kk][1] );
              if ( projection < minA ) minA = projection;
              if ( projection > maxA ) maxA = projection;
          }

          // Project polygon B
          var minB = Number.POSITIVE_INFINITY;
          var maxB = Number.NEGATIVE_INFINITY;
          for ( var kk = 0; kk < bc.vertices.length; kk++ ) {
              var projection = planeX * ( bx + bc.vertices[kk][0] ) + planeY * ( by + bc.vertices[kk][1] );
              if ( projection < minB ) minB = projection;
              if ( projection > maxB ) maxB = projection;
          }

          if ( minB < minA || maxB > maxA ) {
            return false;
          }
        }
      }

      return true;
    };

    CrossCollider.intersectPolygonPolygon = function( ax, ay, ac, bx, by, bc ) {
      var jj;
      var colliders = [ bc, ac ];
      for ( var cc = 0; cc < 2; cc++ ) {
        for ( var ii = 0; ii < colliders[cc].vertices.length; ii++ ) {
          jj = ii + 1;
          if ( jj == colliders[cc].vertices.length ) {
            jj = 0;
          }

          var planeX = colliders[cc].vertices[jj][1] - colliders[cc].vertices[ii][1];
          var planeY = colliders[cc].vertices[ii][0] - colliders[cc].vertices[jj][0];
          var length = Math.sqrt( planeX * planeX + planeY * planeY );
          planeX /= length;
          planeY /= length;

          // Project polygon A
          var minA = Number.POSITIVE_INFINITY;
          var maxA = Number.NEGATIVE_INFINITY;
          for ( var kk = 0; kk < ac.vertices.length; kk++ ) {
              var projection = planeX * ( ax + ac.vertices[kk][0] ) + planeY * ( ay + ac.vertices[kk][1] );
              if ( projection < minA ) minA = projection;
              if ( projection > maxA ) maxA = projection;
          }

          // Project polygon B
          var minB = Number.POSITIVE_INFINITY;
          var maxB = Number.NEGATIVE_INFINITY;
          for ( var kk = 0; kk < bc.vertices.length; kk++ ) {
              var projection = planeX * ( bx + bc.vertices[kk][0] ) + planeY * ( by + bc.vertices[kk][1] );
              if ( projection < minB ) minB = projection;
              if ( projection > maxB ) maxB = projection;
          }
			minA-=0.03;//more restart edits to test for adjacency
			minB-=0.03;
          if ( minA > maxB || maxA < minB ) {
            // No collision
            return false;
          }
        }
      }

      return true;
    };

    CrossCollider.movePolygonPolygon = function( ax, ay, ac, bx, by, bc, vector ) {
      var correctionDistance;
      var correctionX;
      var correctionY;
      var absDistance = Number.POSITIVE_INFINITY;

      var jj;
      var colliders = [ bc, ac ];
      for ( var cc = 0; cc < 2; cc++ ) {
        for ( var ii = 0; ii < colliders[cc].vertices.length; ii++ ) {
          jj = ii + 1;
          if ( jj == colliders[cc].vertices.length ) {
            jj = 0;
          }

          var planeX = colliders[cc].vertices[jj][1] - colliders[cc].vertices[ii][1];
          var planeY = colliders[cc].vertices[ii][0] - colliders[cc].vertices[jj][0];
          var length = Math.sqrt( planeX * planeX + planeY * planeY );
          planeX /= length;
          planeY /= length;

          // Project polygon A
          var minA = Number.POSITIVE_INFINITY;
          var maxA = Number.NEGATIVE_INFINITY;
          for ( var kk = 0; kk < ac.vertices.length; kk++ ) {
              var projection = planeX * ( ax + vector.x + ac.vertices[kk][0] ) + planeY * ( ay + vector.y + ac.vertices[kk][1] );
              if ( projection < minA ) minA = projection;
              if ( projection > maxA ) maxA = projection;
          }

          // Project polygon B
          var minB = Number.POSITIVE_INFINITY;
          var maxB = Number.NEGATIVE_INFINITY;
          for ( var kk = 0; kk < bc.vertices.length; kk++ ) {
              var projection = planeX * ( bx + bc.vertices[kk][0] ) + planeY * ( by + bc.vertices[kk][1] );
              if ( projection < minB ) minB = projection;
              if ( projection > maxB ) maxB = projection;
          }

          if ( minA > maxB || maxA < minB ) {
            // No collision
            return vector;
          }

          var distance = maxB - minA;
          var gap = Math.abs( distance );
          if ( gap < absDistance ) {
            correctionDistance = distance;
            correctionX = planeX;
            correctionY = planeY;
            absDistance = gap;
          }
        }
      }

      vector.x += correctionX * correctionDistance;
      vector.y += correctionY * correctionDistance;

      return vector;
    };

    /**
     * Does collider A encase B
     * @param  {Number}   ax X-position collider A
     * @param  {Number}   ay Y-position collider A
     * @param  {Collider} ac Collider A
     * @param  {Number}   bx X-position collider B
     * @param  {Number}   by Y-position collider B
     * @param  {Collider} bc Collider B
     * @return {Boolean} true if A encases B
     */
    CrossCollider.encase = function( ax, ay, ac, bx, by, bc ) {
      if ( ac.type == CrossCollider.LIST ) {
        for ( var ii = 0; ii < ac.colliders.length; ii++ ) {
          if ( CrossCollider.encase( ax, ay, ac.colliders[ii], bx, by, bc ) ) {
            return true;
          }
        }
        return false;
      }

      if ( bc.type == CrossCollider.LIST ) {
        for ( var ii = 0; ii < bc.colliders.length; ii++ ) {
          if ( CrossCollider.encase( ax, ay, ac, bx, by, bc.colliders[ii] ) ) {
            return true;
          }
        }
        return false;
      }

      if ( ac.type == CrossCollider.CIRCLE && bc.type == CrossCollider.CIRCLE ) {
        // Circle circle test
        return CrossCollider.encaseCircleCircle( ax, ay, ac, bx, by, bc );
      }

      if ( ac.type == CrossCollider.CIRCLE && bc.type == CrossCollider.POLYGON ) {
        // Circle polygon test
        return CrossCollider.encaseCirclePolygon( ax, ay, ac, bx, by, bc );
      }

      if ( ac.type == CrossCollider.POLYGON && bc.type == CrossCollider.CIRCLE ) {
        // Polygon circle test
        return CrossCollider.encasePolygonCircle( ax, ay, ac, bx, by, bc );
      }

      if ( ac.type == CrossCollider.POLYGON && bc.type == CrossCollider.POLYGON ) {
        // Polygon polygon test
        return CrossCollider.encasePolygonPolygon( ax, ay, ac, bx, by, bc );
      }

      return false;
    };

    /**
     * Do colliders A & B touch
     * @param  {Number}   ax X-position collider A
     * @param  {Number}   ay Y-position collider A
     * @param  {Collider} ac Collider A
     * @param  {Number}   bx X-position collider B
     * @param  {Number}   by Y-position collider B
     * @param  {Collider} bc Collider B
     * @return {Boolean} true if touching, false otherwise
     */
    CrossCollider.intersect = function( ax, ay, ac, bx, by, bc ) {
      if ( ac.type == CrossCollider.LIST ) {
        for ( var ii = 0; ii < ac.colliders.length; ii++ ) {
          if ( CrossCollider.intersect( ax, ay, ac.colliders[ii], bx, by, bc ) ) {
            return true;
          }
        }
        return false;
      }

      if ( bc.type == CrossCollider.LIST ) {
        for ( var ii = 0; ii < bc.colliders.length; ii++ ) {
          if ( CrossCollider.intersect( ax, ay, ac, bx, by, bc.colliders[ii] ) ) {
            return true;
          }
        }
        return false;
      }

      if ( ac.type == CrossCollider.CIRCLE && bc.type == CrossCollider.CIRCLE ) {
        // Circle circle test
        return CrossCollider.intersectCircleCircle( ax, ay, ac, bx, by, bc );
      }

      if ( ac.type == CrossCollider.CIRCLE && bc.type == CrossCollider.POLYGON ) {
        // Circle polygon test
        return CrossCollider.intersectCirclePolygon( ax, ay, ac, bx, by, bc );
      }

      if ( ac.type == CrossCollider.POLYGON && bc.type == CrossCollider.CIRCLE ) {
        // Polygon circle test
        return CrossCollider.intersectPolygonCircle( ax, ay, ac, bx, by, bc );
      }

      if ( ac.type == CrossCollider.POLYGON && bc.type == CrossCollider.POLYGON ) {
        // Polygon polygon test
        return CrossCollider.intersectPolygonPolygon( ax, ay, ac, bx, by, bc );
      }

      return false;
    };

    /**
     * Move and collide A towards B
     * @param  {Number}   ax X-position collider A
     * @param  {Number}   ay Y-position collider A
     * @param  {Collider} ac Collider A
     * @param  {Number}   bx X-position collider B
     * @param  {Number}   by Y-position collider B
     * @param  {Collider} bc Collider B
     * @param  {Vector}   vector Input movement vector A to B
     * @return {Vector} New movement vector
     */
    CrossCollider.move = function( ax, ay, ac, bx, by, bc, vector ) {
      if ( ac.type == CrossCollider.LIST ) {
        for ( var ii = 0; ii < ac.colliders.length; ii++ ) {
          vector = CrossCollider.move( ax, ay, ac.colliders[ii], bx, by, bc, vector );
          if ( vector.x === 0 && vector.y === 0 ) {
            break;
          }
        }
        return vector;
      }

      if ( bc.type == CrossCollider.LIST ) {
        for ( var ii = 0; ii < bc.colliders.length; ii++ ) {
          vector = CrossCollider.move( ax, ay, ac, bx, by, bc.colliders[ii], vector );
          if ( vector.x === 0 && vector.y === 0 ) {
            break;
          }
        }
        return vector;
      }

      if ( ac.type == CrossCollider.CIRCLE && bc.type == CrossCollider.CIRCLE ) {
        // Circle circle test
        return CrossCollider.moveCircleCircle( ax, ay, ac, bx, by, bc, vector );
      }

      if ( ac.type == CrossCollider.CIRCLE && bc.type == CrossCollider.POLYGON ) {
        // Circle polygon test
        return CrossCollider.moveCirclePolygon( ax, ay, ac, bx, by, bc, vector );
      }

      if ( ac.type == CrossCollider.POLYGON && bc.type == CrossCollider.CIRCLE ) {
        // Polygon circle test
        return CrossCollider.movePolygonCircle( ax, ay, ac, bx, by, bc, vector );
      }

      if ( ac.type == CrossCollider.POLYGON && bc.type == CrossCollider.POLYGON ) {
        // Polygon polygon test
        return CrossCollider.movePolygonPolygon( ax, ay, ac, bx, by, bc, vector );
      }

      return vector;
    };

    CrossCollider.treeFromArray = function( colliders ) {
      while ( colliders.length > 1 ) {
        var shortestDist = Number.POSITIVE_INFINITY;
        var closestNode = -1;
        for ( var ii = 1; ii < colliders.length; ii++ ) {
          var leftDistance = Math.abs( colliders[ii].aabbox.right - colliders[0].aabbox.left );
          if ( leftDistance < shortestDist ) {
            shortestDist = leftDistance;
            closestNode = ii;
            continue;
          }

          var rightDistance = Math.abs( colliders[ii].aabbox.left - colliders[0].aabbox.right );
          if ( rightDistance < shortestDist ) {
            shortestDist = rightDistance;
            closestNode = ii;
            continue;
          }

          var topDistance = Math.abs( colliders[ii].aabbox.bottom - colliders[0].aabbox.top );
          if ( topDistance < shortestDist ) {
            shortestDist = topDistance;
            closestNode = ii;
            continue;
          }

          var bottomDistance = Math.abs( colliders[ii].aabbox.top - colliders[0].aabbox.bottom );
          if ( bottomDistance < shortestDist ) {
            shortestDist = bottomDistance;
            closestNode = ii;
            continue;
          }
        }

        // Create pairing
        var pair = CrossCollider.createList();
        CrossCollider.addToList( pair, colliders[0] );
        CrossCollider.addToList( pair, colliders[closestNode] );
        colliders.splice( closestNode, 1 );
        colliders[0] = pair;
      }

      return colliders[0];
    };

    /**
     * Check if A and B roughly intersect with AABBoxes
     * @param  {Number}   ax X-position collider A
     * @param  {Number}   ay Y-position collider A
     * @param  {AABBox}   ac AABBox A
     * @param  {Number}   bx X-position collider B
     * @param  {Number}   by Y-position collider B
     * @param  {AABBox}   bc AABBox B
     * @param  {Number}   vx Adjustment vector of A toB
     * @param  {Number}   vy Adjustment vector of A to B
     * @return {Boolean}  True is AABBoxes intersect
     */
    CrossCollider.aabboxCheck = function( ax, ay, ac, bx, by, bc, vx, vy ) {
      vx = vx || 0;
      vy = vy || 0;
	  //once more, I have added slop of 0.03 tiles, so things that are touching
	  //actually count as touching using this.
      var left = ax + ac.left + ( vx < 0 ? vx : 0 );
      if ( left -0.03 > bx + bc.right ) {
        return false;
      }

      var top = ay + ac.top + ( vy < 0 ? vy : 0 );
      if ( top -0.03> by + bc.bottom ) {
        return false;
      }

      var right = ax + ac.right + ( vx > 0 ? vx : 0 );
      if ( right < bx + bc.left -0.03) {
        return false;
      }

      var bottom = ay + ac.bottom + ( vy > 0 ? vy : 0 );
      if ( bottom < by + bc.top -0.03) {
        return false;
      }

      return true;
    };

  } )();




// Battle Logic Helper Functions
// used to tell where creatures are relative to walls and such.



Game_CharacterBase.prototype.isBoxInWall = function(testDirection){
	//checks our AABBox to see if it's in a wall
	// diagonals check corners, nondiagonal directions check centers of
	// corresponding edges
	// 0 and 5 check middle
	var bboxTests = $gameMap.getAABBoxTests( this, 0, 0 );
	
	var testx=0;
	var testy=0;
	
	leftmost=200;
	rightmost=-200;
	topmost=200;
	bottommost=-200;
	//ignore all the fancy collision stuff and just treat this object as
	//a big rectangle
	for (var index = 0; index<bboxTests.length;index++)
	{
		leftmost=Math.min(leftmost,bboxTests[index].x+bboxTests[index].aabbox.left)
		rightmost=Math.max(rightmost,bboxTests[index].x+bboxTests[index].aabbox.right)
		topmost=Math.min(topmost,bboxTests[index].y+bboxTests[index].aabbox.top)
		bottommost=Math.max(bottommost,bboxTests[index].y+bboxTests[index].aabbox.bottom)
		
		
	}
	switch (testDirection)
	{
	case 0:
	case 5:
		// middle of the box
		testx=(leftmost+rightmost)/2
		testy=(bottommost+topmost)/2
		break;
	case 1:
		testx=leftmost
		testy=bottommost
		break;
	case 2:	
		testx=(leftmost+rightmost)/2
		testy=bottommost
		break;
	case 3:
		testx=rightmost
		testy=bottommost
		break;
	case 4:
		testx=leftmost
		testy=(bottommost+topmost)/2
		break;
	case 6:
		testx=rightmost
		testy=(bottommost+topmost)/2
		break;
	case 7:
		testx=leftmost
		testy=topmost
		break;
	case 8:
		testx=(leftmost+rightmost)/2
		testy=topmost
		break;
	case 9:
		testx=rightmost
		testy=topmost
		break;
	default:
		if ($gameTemp.isPlaytest()) 
		{
			console.log('tried to see if the box was in the wall, but no proper direction given')
		}
		testx=(leftmost+rightmost)/2
		testy=(bottommost+topmost)/2
	}
	return !$gameMap.checkPassage(testx,testy, 0x0f)
	
}


Game_CharacterBase.prototype.isWallDir = function(testDirection,auraWidth){
	//checks our AABBox to see if it's touching a wall
	// same code as checking to see if it's IN a wall
	// but we pad it out by auraWidth in each direction
	// auraWidth defaults to 0.02 if undefined 
	// diagonals check corners, nondiagonal directions check centers of
	// corresponding edges
	// 0 and 5 check middle
	var auraWidth = auraWidth || 0.02
	var bboxTests = $gameMap.getAABBoxTests( this, 0, 0 );
	
	var testx=0;
	var testy=0;
	
	leftmost=200;
	rightmost=-200;
	topmost=200;
	bottommost=-200;
	//ignore all the fancy collision stuff and just treat this object as
	//a big rectangle
	for (var index = 0; index<bboxTests.length;index++)
	{
		leftmost=Math.min(leftmost,bboxTests[index].x+bboxTests[index].aabbox.left)
		rightmost=Math.max(rightmost,bboxTests[index].x+bboxTests[index].aabbox.right)
		topmost=Math.min(topmost,bboxTests[index].y+bboxTests[index].aabbox.top)
		bottommost=Math.max(bottommost,bboxTests[index].y+bboxTests[index].aabbox.bottom)
		
		
	}
	
	leftmost -= auraWidth;
	rightmost +=auraWidth;
	topmost -=auraWidth;
	bottommost+=auraWidth;
	switch (testDirection)
	{
	case 0:
	case 5:
		// middle of the box
		testx=(leftmost+rightmost)/2
		testy=(bottommost+topmost)/2
		break;
	case 1:
		testx=leftmost
		testy=bottommost
		break;
	case 2:	
		testx=(leftmost+rightmost)/2
		testy=bottommost
		break;
	case 3:
		testx=rightmost
		testy=bottommost
		break;
	case 4:
		testx=leftmost
		testy=(bottommost+topmost)/2
		break;
	case 6:
		testx=rightmost
		testy=(bottommost+topmost)/2
		break;
	case 7:
		testx=leftmost
		testy=topmost
		break;
	case 8:
		testx=(leftmost+rightmost)/2
		testy=topmost
		break;
	case 9:
		testx=rightmost
		testy=topmost
		break;
	default:
		if ($gameTemp.isPlaytest()) 
		{
			console.log('tried to see if the box was in the wall, but no proper direction given')
		}
		testx=(leftmost+rightmost)/2
		testy=(bottommost+topmost)/2
	}
	return !$gameMap.checkPassage(testx,testy, 0x0f)
	
}




// this occasionally misses walls at certain angles
// but AFAICT doesn't ever return a false positive - if it detects
// a wall, the wall is definitely there.
Game_CharacterBase.prototype.isWallVec = function(vx,vy){
	var owner = this;
	var move = { x: vx, y: vy };
    var collider = owner.collider();
    var bboxTests = $gameMap.getAABBoxTests( this, vx, vy );
	this.moveVectorMap( owner, collider, bboxTests, move, vx, vy );

	if (vx !== 0)
	{
		if (move.x*Math.sign(vx)<0.01)
		{
			return true}
	}
	if (vy !== 0)
	{
		if (move.y*Math.sign(vy)<0.01)
		{
			return true}
	}
	
	return false;
}

Game_CharacterBase.prototype.checkWallEmbed = function()
{
	//checks to see if we are embedded in a wall, 
	//and returns with the vector for how to escape
	var vx=0;
	var vy=0;
	var owner = this;
	var move = { x: vx, y: vy };
    var collider = owner.collider();
    var bboxTests = $gameMap.getAABBoxTests( this, vx, vy );
	this.moveVectorMap( owner, collider, bboxTests, move, vx, vy );
	return [move.x,move.y]
}