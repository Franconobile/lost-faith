/*:
*
*
*
* @author Pixeldrama
* @plugindesc Lockpick
* @help
*
*
*
*
*
* PluginCommand:  lockpick 100 Metal D  
*
*
* Description  : lockpick   = the command name to call the scene
*                100        = the lock strength 1-100
*                Metal      = the name for the background sprite
*                D          = the selfswitch to call when the lock is open
*
*
* Setup        : the script needs a variable-value in the range 1-100.
*                the variable is defined under Player Skill in the
*                parameters. choose a variable and set ingame a value
*                between 1-100 before the first plugin call.
*
*
* Player Skill : the variable in the parameters. the value is between 1-100.  
*                a higher skilled player is a better lockpicker.
*
*
* Lockpick     : any item you choose in the parameters. if the party has no  
*                item, the scene opens without the lockpick-image and the
*                mechanic is fixed.
*
*
* Item Load    : the item-load starts with 100 and is decreased while you
*                try to open the lock. more higher strength will decrease 
*                more load. it changes with the player skill. higher skill
*                means lower decrease. when the load is 0, the item break.
*                if you need to set the item load to 100, when the player
*                has sold or bought the lockpick, write this as 
*                a script-command: $gameSystem.setLockpickLoad(100);
*                or for 27       : $gameSystem.setLockpickLoad(27);
*
* Game System  : $gameSystem.gainLockpickLoad(10); can be negative
*
*
* Copyright    : script and images by Pixeldrama.
*                sounds from random free soundbanks.
*                free to use for commercial and non-commercial.
*                upload this where ever you want.
*
*
*
*
*
*
* @param ====== Global
*
* @param Plugin Command
* @parent ====== Global
* @desc The command to call the lockpick scene.
* @default lockpick
*
* @param Images: Background
* @parent ====== Global
* @desc The data folder for the background sprites.
* @default img/pictures/lockpick/
*
* @param Images: Basic
* @parent ====== Global
* @desc The data folder for the basic sprites.
* @default img/pictures/lockpick/basic/
*
* @param Images: Lockpick XL
* @parent ====== Global
* @type Boolean
* @desc If true the lockpick image is longer.
* @default false
*
* @param Position: Lock X
* @parent ====== Global
* @desc The x-position for the lock mechanic.
* Default: 0 (center)
* @default 0
*
* @param Position: Lock Y
* @parent ====== Global
* @desc The y-position for the lock mechanic.
* Default: -30 (0 = center)
* @default -30
*
* @param Speed: Fade In
* @parent ====== Global
* @desc The fade in time in frames.
* @default 30
*
* @param Speed: Fade Out
* @parent ====== Global
* @desc The fade out time in frames.
* @default 30
*
* @param Gametest: Show Range
* @parent ====== Global
* @type Boolean
* @desc If true the open range and position is shown by
* press pageUp/pageDown.
* @default false
*
*
*
* @param ====== Ingame
*
* @param Player Skill
* @parent ====== Ingame
* @type variable
* @desc The variable for the player skill.
* Skillrange: 1-100  (min.1!)
* @default
*
* @param Lockpicker
* @parent ====== Ingame
* @type item
* @desc The item to consume.
* @default
*
*
*
* @param ====== Control
*
* @param Upper Stick: Left
* @parent ====== Control
* @desc The button for the up-stick left direction.
* @default up
*
* @param Upper Stick: Right
* @parent ====== Control
* @desc The button for the up-stick right direction.
* @default down
*
* @param Lower Stick: Left
* @parent ====== Control
* @desc The button for the low-stick left direction.
* @default left
*
* @param Lower Stick: Right
* @parent ====== Control
* @desc The button for the low-stick right direction.
* @default right
*
* @param Delete Scene: 1 
* @parent ====== Control
* @desc The first button to cancel the scene.
* @default ok
*
* @param Delete Scene: 2 
* @parent ====== Control
* @desc The second button to cancel the scene.
* @default escape
*
*
*
* @param ====== Text Param
*
* @param Show: Item Name
* @parent ====== Text Param
* @type boolean
* @desc
* @default true
*
* @param Show: Lock Strength
* @parent ====== Text Param
* @type boolean
* @desc
* @default true
*
* @param Show: Load Gauge
* @parent ====== Text Param
* @desc The needed skill level for the player
* to see the load gauge. [111 = off]
* @default 1
*
* @param Name: Strength
* @parent ====== Text Param
* @desc The drawn name for the lock strength.
* @default Strength
*
* @param Name: Item
* @parent ====== Text Param
* @desc The drawn name for the lockpick item.
* @default Lockpick
*
* @param Name: X
* @parent ====== Text Param
* @desc The x-position for the name.
* Default: 238
* @default 238
*
* @param Name: Y
* @parent ====== Text Param
* @desc The y-position for the name.
* Default: 490	
* @default 490
*
* @param Value: X
* @parent ====== Text Param
* @desc The x-position for the value.
* Default: -240
* @default -240
*
* @param Value: Y
* @parent ====== Text Param
* @desc The y-position for the value.
* Default: 490
* @default 490
*
* @param Space
* @parent ====== Text Param
* @desc The space between the rows.
* Default: 35
* @default 35
*
* @param Gauge: X
* @parent ====== Text Param
* @desc The x-position for the gauge.
* Default: 238
* @default 238
*
* @param Gauge: Y
* @parent ====== Text Param
* @desc The y-position for the gauge.
* Deafult: 570
* @default 570
*
* @param Gauge: Width
* @parent ====== Text Param
* @desc The width for the gauge.
* Default: 300
* @default 300
*
* @param Gauge: Height
* @parent ====== Text Param
* @desc The height for the gauge.
* Default: 10
* @default 10
*
*
*
* @param ====== Font Param
*
* @param Name: Fontface
* @parent ====== Font Param
* @desc The fontface for the name.
* Default: Gamefont
* @default GameFont
*
* @param Name: Font Size
* @parent ====== Font Param
* @desc The fontsize for the name.
* Default: 22
* @default 22
*
* @param Name: Outline Size
* @parent ====== Font Param
* @desc The outlinesize for the name.
* Default: 4
* @default 4
*
* @param Name: Text Color
* @parent ====== Font Param
* @desc The textcolor for the name.
* Default: #ffffff
* @default #ffffff
*
* @param Name: Outline Color
* @parent ====== Font Param
* @desc The outlinecolor for the name.
* Default: rgba(0,0,0,0.5)
* @default rgba(0,0,0,0.5)
*
* @param Value: Fontface
* @parent ====== Font Param
* @desc The fontface for the value.
* Default: Gamefont
* @default GameFont
*
* @param Value: Font Size
* @parent ====== Font Param
* @desc The fontsize for the value.
* Default: 22
* @default 22
*
* @param Value: Outline Size
* @parent ====== Font Param
* @desc The outlinesize for the value.
* Default: 4
* @default 4
*
* @param Value: Text Color
* @parent ====== Font Param
* @desc The textcolor for the value.
* Default: #ffffff
* @default #ffffff
*
* @param Value: Outline Color
* @parent ====== Font Param
* @desc The outlinecolor for the value.
* Default: rgba(0,0,0,0.5)
* @default rgba(0,0,0,0.5)
*
* @param Gauge: Color 1
* @parent ====== Font Param
* @desc The gauge color 1.
* Default: #1d9900
* @default #1d9900
*
* @param Gauge: Color 2
* @parent ====== Font Param
* @desc The gauge color 2.
* Default: #1d9900
* @default #1d9900
*
* @param Gauge: Color BG
* @parent ====== Font Param
* @desc The gauge background color.
* Default: #000000
* @default #000000
*
*
*
* @param ====== Sound
*
* @param Open: Sound
* @parent ====== Sound
* @desc The open sound.
* @default Open5
*
* @param Open: Volume
* @parent ====== Sound
* @desc The open sound volume.
* @default 100
*
* @param Open: Pitch
* @parent ====== Sound
* @desc The open sound pitch.
* @default 100
*
* @param Success: Sound
* @parent ====== Sound
* @desc The success sound.
* @default Lockpick_Success
*
* @param Success: Volume
* @parent ====== Sound
* @desc The success sound volume.
* @default 100
*
* @param Success: Pitch
* @parent ====== Sound
* @desc The success sound pitch.
* @default 100
*
* @param Fail: Sound
* @parent ====== Sound
* @desc The fail sound.
* @default Lockpick_Fail
*
* @param Fail: Volume
* @parent ====== Sound
* @desc The fail sound volume.
* @default 40
*
* @param Fail: Pitch
* @parent ====== Sound
* @desc The fail sound pitch.
* @default 100
*
* @param Break: Sound
* @parent ====== Sound
* @desc The break sound.
* @default Lockpick_Break
*
* @param Break: Volume
* @parent ====== Sound
* @desc The break sound volume.
* @default 150
*
* @param Break: Pitch
* @parent ====== Sound
* @desc The break sound volume.
* @default 150
*
* @param Position: Sound
* @parent ====== Sound
* @desc The upper stick position sound.
* Plus the sound count like 1,2,3...  
* @default Lockpick_Position_0
*
* @param Position: Sound Count
* @parent ====== Sound
* @desc The number of position sounds.
* @default 1
*
* @param Position: Repeat Time
* @parent ====== Sound
* @desc The upper stick sound repeat time when
* the button is pressed straight.
* @default 30
*
* @param Position: Volume Basic
* @parent ====== Sound
* @desc The upper stick basic volume.
* @default 20
*
* @param Position: Volume Random
* @parent ====== Sound
* @desc The upper stick random volume,
* is added to the basic volume.
* @default 30
*
* @param Turn: Sound
* @parent ====== Sound
* @desc The lower stick turn sound.
* Plus the sound count like 1,2,3...
* @default Lockpick_Turn_0
*
* @param Turn: Sound Count
* @parent ====== Sound
* @desc The number of turn sounds.
* @default 4
*
* @param Turn: Repeat Time
* @parent ====== Sound
* @desc The lower stick sound repeat time when
* the button is pressed straight.
* @default 30
*
* @param Turn: Volume Basic
* @parent ====== Sound
* @desc The lower stick basic volume.
* @default 10
*
* @param Turn: Volume Random
* @parent ====== Sound
* @desc The lower stick random volume,
* is added to the basic volume.
* @default 10
*
*
*
*
*/

var parameters = PluginManager.parameters('PXD_Lockpick');

var pxd_lp_command       = String(parameters['Plugin Command']) || 'lockpick';
var pxd_lp_root          = String(parameters['Images: Background']) || 'img/pictures/lockpick/';
var pxd_lp_root_basic    = String(parameters['Images: Basic']) || 'img/pictures/lockpick/basic/';
var pxd_lp_lockpick_xl   = Boolean(parameters['Images: Lockpick XL'] === 'true' || false);
var pxd_lp_lock_x        = Number(parameters['Position: Lock X']) || 0;
var pxd_lp_lock_y        = Number(parameters['Position: Lock Y']) || 0;
var pxd_lp_fadein        = Number(parameters['Speed: Fade In']) || 1;
var pxd_lp_fadeout       = Number(parameters['Speed: Fade Out']) || 1;
var pxd_lp_testing       = Boolean(parameters['Gametest: Show Range'] === 'true' || false);
var pxd_lp_skill         = Number(parameters['Player Skill']) || 0;
var pxd_lp_item          = String(parameters['Lockpicker']) || 0;
var pxd_lp_up_left       = String(parameters['Upper Stick: Left']) || 'up';
var pxd_lp_up_right      = String(parameters['Upper Stick: Right']) || 'down';
var pxd_lp_lo_left       = String(parameters['Lower Stick: Left']) || 'left';
var pxd_lp_lo_right      = String(parameters['Lower Stick: Right']) || 'right';
var pxd_lp_delete_1      = String(parameters['Delete Scene: 1']) || 'ok';
var pxd_lp_delete_2      = String(parameters['Delete Scene: 2']) || 'escape';
var pxd_lp_show_name     = Boolean(parameters['Show: Item Name'] === 'true' || false);
var pxd_lp_show_lock     = Boolean(parameters['Show: Lock Strength'] === 'true' || false);
var pxd_lp_show_load     = Number(parameters['Show: Load Gauge']) || 1;
var pxd_lp_name_str      = String(parameters['Name: Strength']) || 'noname';
var pxd_lp_name_item     = String(parameters['Name: Item']) || 'noname';
var pxd_lp_name_x        = Number(parameters['Name: X']) || 0;
var pxd_lp_name_y        = Number(parameters['Name: Y']) || 0;
var pxd_lp_value_x       = Number(parameters['Value: X']) || 0;
var pxd_lp_value_y       = Number(parameters['Value: Y']) || 0;
var pxd_lp_space         = Number(parameters['Space']) || 0;
var pxd_lp_gauge_x       = Number(parameters['Gauge: X']) || 0;
var pxd_lp_gauge_y       = Number(parameters['Gauge: Y']) || 0;
var pxd_lp_gauge_w       = Number(parameters['Gauge: Width']) || 0;
var pxd_lp_gauge_h       = Number(parameters['Gauge: Height']) || 0;
var pxd_lp_name_face     = String(parameters['Name: Fontface']) || 'GameFont';
var pxd_lp_name_size     = Number(parameters['Name: Font Size']) || 22;
var pxd_lp_name_out_size = Number(parameters['Name: Outline Size']) || 4;
var pxd_lp_name_text_col = String(parameters['Name: Text Color']) || '#ffffff';
var pxd_lp_name_out_col  = String(parameters['Name: Outline Color']) || 'rgba(0,0,0,0.5)';
var pxd_lp_val_face      = String(parameters['Value: Fontface']) || 'GameFont';
var pxd_lp_val_size      = Number(parameters['Value: Font Size']) || 22;
var pxd_lp_val_out_size  = Number(parameters['Value: Outline Size']) || 4;
var pxd_lp_val_text_col  = String(parameters['Value: Text Color']) || '#ffffff';
var pxd_lp_val_out_col   = String(parameters['Value: Outline Color']) || 'rgba(0,0,0,0.5)';
var pxd_lp_gauge_col_1   = String(parameters['Gauge: Color 1']) || '#1d9900';
var pxd_lp_gauge_col_2   = String(parameters['Gauge: Color 2']) || '#1d9900';
var pxd_lp_gauge_col_3   = String(parameters['Gauge: Color BG']) || '#000000';
var pxd_lp_sound_open    = String(parameters['Open: Sound']);
var pxd_lp_sound_success = String(parameters['Success: Sound']);
var pxd_lp_sound_fail    = String(parameters['Fail: Sound']);
var pxd_lp_sound_break   = String(parameters['Break: Sound']);
var pxd_lp_volume_open   = Number(parameters['Open: Volume']) || 100;
var pxd_lp_volume_suck   = Number(parameters['Success: Volume']) || 100;
var pxd_lp_volume_fail   = Number(parameters['Fail: Volume']) || 100;
var pxd_lp_volume_break  = Number(parameters['Break: Volume']) || 100;
var pxd_lp_pitch_open    = Number(parameters['Open: Pitch']) || 100;
var pxd_lp_pitch_success = Number(parameters['Success: Pitch']) || 100;
var pxd_lp_pitch_fail    = Number(parameters['Fail: Pitch']) || 100;
var pxd_lp_pitch_break   = Number(parameters['Break: Pitch']) || 100;
var pxd_lp_posit_sound   = String(parameters['Position: Sound']);
var pxd_lp_posit_count   = Number(parameters['Position: Sound Count']) || 1;
var pxd_lp_posit_repeat  = Number(parameters['Position: Repeat Time']) || 30;
var pxd_lp_posit_basic   = Number(parameters['Position: Volume Basic']) || 20;
var pxd_lp_posit_random  = Number(parameters['Position: Volume Random']) || 30;
var pxd_lp_turn_sound    = String(parameters['Turn: Sound']);
var pxd_lp_turn_count    = Number(parameters['Turn: Sound Count']) || 4;
var pxd_lp_turn_repeat   = Number(parameters['Turn: Repeat Time']) || 30;
var pxd_lp_turn_basic    = Number(parameters['Turn: Volume Basic']) || 10;
var pxd_lp_turn_random   = Number(parameters['Turn: Volume Random']) || 10;

// ------------------------------------------------------------------------------------ Game Interpreter & Game System
var _lockpick_game_interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_lockpick_game_interpreter_pluginCommand.call(this,command,args);
    if(command === pxd_lp_command) $gameSystem.setLockpick(this._eventId,this._mapId,args[0],args[1],args[2]);
};

Game_System.prototype.setLockpick = function(eventid,mapid,strength,image,selfswitch) {
	this._lockpick = [];
	this._lockpick.push(eventid,mapid,strength,image,selfswitch);
	SceneManager.push(Scene_Lockpick);
};

Game_System.prototype.lockpickLoad = function() {
	return this._lockpickLoad;
};

Game_System.prototype.setLockpickLoad = function(value) {
	this._lockpickLoad = value.clamp(0,100);
};

Game_System.prototype.gainLockpickLoad = function(value) {
	var newValue = this._lockpickLoad +value;
	this._lockpickLoad = newValue.clamp(0,100);
};

// ------------------------------------------------------------------------------------ Scene Lockpick
function Scene_Lockpick() {
    this.initialize.apply(this, arguments);
}

Scene_Lockpick.prototype = Object.create(Scene_Base.prototype);
Scene_Lockpick.prototype.constructor = Scene_Lockpick;

Scene_Lockpick.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
    if(!$gameSystem._lockpickLoad) $gameSystem.setLockpickLoad(100);
};

Scene_Lockpick.prototype.start = function() {
    this.startFadeIn(pxd_lp_fadein, false);
};

Scene_Lockpick.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createWindowLayer();
    this.createLockpickWindow();
};

Scene_Lockpick.prototype.createBackground = function() {
    var image                     = $gameSystem._lockpick[3];
    this._backgroundSprite        = new Sprite();
    this._backgroundSprite.bitmap = ImageManager.loadBitmap(pxd_lp_root, image);
    this.addChild(this._backgroundSprite);
};

Scene_Lockpick.prototype.createLockpickWindow = function() {
    this._lockpickWindow = new Window_Lockpick();
    this.addWindow(this._lockpickWindow);
};

// ------------------------------------------------------------------------------------ Window Lockpick
function Window_Lockpick() {
    this.initialize.apply(this, arguments);
}

Window_Lockpick.prototype = Object.create(Window_Command.prototype);
Window_Lockpick.prototype.constructor = Window_Lockpick;

Window_Lockpick.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.opacity       = 0;
    this.backOpacity   = 0;
    this._timer        = 0;
    this._turnTimer    = 0;
    this._posTimer     = 0;
    this._turnPosition = 49;
    this._turnRange    = 0;
    this._openRange    = [];
    this._broke        = false;
    this._isBlocked    = false; 
    this._isBlockedPik = false; 
    this._gametesting  = false;
    this._item         = $dataItems[pxd_lp_item];
    this._strength     = $gameSystem._lockpick[2];
    this._skill        = $gameVariables.value(pxd_lp_skill);
    this.createScene();
    this.deselect()
    this.refresh();
}

Window_Lockpick.prototype.createScene = function() {
	this._hasItem = $gameParty.numItems(this._item) > 0;
    this.setOpenPosition();
    this.createRightStick();
    this.createLock();
    this.createLockBasic();
    this.createSheet();
    if(this._hasItem) {
    	this.createLeftStick();
	}
};

Window_Lockpick.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};

Window_Lockpick.prototype.windowHeight = function() {
    return Graphics.boxHeight;
};

Window_Lockpick.prototype.createRightStick = function() { 
    this._rightStick          = new Sprite();
    this._rightStick.bitmap   = ImageManager.loadBitmap(pxd_lp_root_basic, 'lp_right');
    this._rightStick.x        = Graphics.boxWidth /2 -40  +pxd_lp_lock_x;
    this._rightStick.y        = Graphics.boxHeight /2 +50  +pxd_lp_lock_y;
    this._rightStick.anchor.x = 1;
    this._rightStick.anchor.y = 0.2;
    this._rightStick.rotation = -1.1;
    this.addChildToBack(this._rightStick);
};

Window_Lockpick.prototype.createLock = function() {
    this._lockSprite          = new Sprite();
    this._lockSprite.bitmap   = ImageManager.loadBitmap(pxd_lp_root_basic, 'lp_lock');
    this._lockSprite.x        = Graphics.boxWidth /2  +pxd_lp_lock_x;
    this._lockSprite.y        = Graphics.boxHeight /2 +pxd_lp_lock_y;
    this._lockSprite.anchor.x = 0.5;
    this._lockSprite.anchor.y = 0.5;
    this.addChildToBack(this._lockSprite);
};

Window_Lockpick.prototype.createLockBasic = function() {
    this._lockBasicSprite          = new Sprite();
    this._lockBasicSprite.bitmap   = ImageManager.loadBitmap(pxd_lp_root_basic, 'lp_basic');
    this._lockBasicSprite.x        = Graphics.boxWidth /2 +pxd_lp_lock_x;
    this._lockBasicSprite.y        = Graphics.boxHeight /2 +pxd_lp_lock_y;
    this._lockBasicSprite.anchor.x = 0.5
    this._lockBasicSprite.anchor.y = 0.5;
    this.addChildToBack(this._lockBasicSprite);
};

Window_Lockpick.prototype.createSheet = function() { 
    this._sheetSprite          = new Sprite();
    this._sheetSprite.bitmap   = ImageManager.loadBitmap(pxd_lp_root_basic, 'lp_sheet');
    this._sheetSprite.x        = Graphics.boxWidth /2  +pxd_lp_lock_x;
    this._sheetSprite.y        = Graphics.boxHeight /2 +pxd_lp_lock_y;
    this._sheetSprite.anchor.x = 0.5;
    this._sheetSprite.anchor.y = 0.5;
    this.addChild(this._sheetSprite);
};

Window_Lockpick.prototype.createLeftStick = function() {
	var image = pxd_lp_lockpick_xl ? 'lp_left' : 'lp_left_xs';	    
	var preload = pxd_lp_lockpick_xl ? 'lp_left_broke' : 'lp_left_broke_xs';
    this._leftStick          = new Sprite();
    this._leftStick.bitmap   = ImageManager.loadBitmap(pxd_lp_root_basic, image);
    this._leftStick.x        = Graphics.boxWidth /2 +10  +pxd_lp_lock_x;
    this._leftStick.y        = Graphics.boxHeight /2 -15 +pxd_lp_lock_y;
    this._leftStick.anchor.x = 0.5;
    this._leftStick.rotation = 3.1;
    this.addChild(this._leftStick);
    ImageManager.loadBitmap(pxd_lp_root_basic, preload);
};

Window_Lockpick.prototype.processHandling = function() {
    if(this._hasItem) {
    	if(Input.isPressed(pxd_lp_up_left) && !this._broke && !this._isBlockedPik) {
    	    if(this._leftStick.rotation > 1.5699999999999938) {
    	        this._leftStick.rotation -= 0.015;
    	        this.setLockPosition();
    	        this.positSound();
    	    }
    	} else if(Input.isPressed(pxd_lp_up_right) && !this._broke && !this._isBlockedPik) {
    	    if(this._leftStick.rotation < 4.704999999999992) {
    	        this._leftStick.rotation += 0.015;
    	        this.setLockPosition();
    	        this.positSound();
    	    }
    	} else {
    		this._posTimer = 0
    	}
    	if(Input.isPressed(pxd_lp_lo_left) && !this._broke || Input.isPressed(pxd_lp_lo_right) && !this._broke) {
    	    	if(this._rightStick.rotation < 0.4500000000000000064) {
    	    		this._rightStick.y         -= 0.5;
    	    	    this._rightStick.rotation  += 0.015; 
    	    	    this._lockSprite.rotation  += 0.015;
    	    	    this._sheetSprite.rotation += 0.015;
    	    	    this.getTurnPosition();
    	    		this.pickLock();
    	    	    this.turnSound();
    	    	}
    	} else if(!Input.isPressed(pxd_lp_lo_left) && !Input.isPressed(pxd_lp_lo_right) || this._broke || this._isBlocked) {
    	    if(this._rightStick.rotation > -1.1) {
    	    	this._rightStick.y         += 0.5;
    	        this._rightStick.rotation  -= 0.015;
    	        this._lockSprite.rotation  -= 0.015;
    	        this._sheetSprite.rotation -= 0.015;
    	        if(this._rightStick.rotation < -1.1) {
    	        	this._rightStick.rotation  = -1.1;
    	        	this._lockSprite.rotation  = 0.0;
    	        	this._sheetSprite.rotation = 0.0;
    	        }
    	        this.turnSound();
    	    } else {
    	    	this._turnTimer = 0;
    	    }
    	}
	}
    if(Input.isTriggered(pxd_lp_delete_1) && this.active || Input.isTriggered(pxd_lp_delete_2) && this.active) {
        this.active = false;
        this._timer = 0 -pxd_lp_fadeout;
        this._broke = true;
        SceneManager._scene.startFadeOut(pxd_lp_fadeout, false);
        SceneManager.pop();
    }
    if(this._broke && this._timer == 60){
        if(!this._isBlocked) {
        	SceneManager._scene.startFadeOut(pxd_lp_fadeout, false);
        	SceneManager.pop();
    	} else {
    		this._broke = false;
    		this._timer = 0;
    		this._isBlocked = false;
    	}
    }
    if(this._isBlockedPik && !this._isBlocked) {
    	if(this._timer > 10) this._isBlockedPik = false;
    }
    if(pxd_lp_testing == true) {
        if(Input.isTriggered('pageup')) {
            this._gametesting = true;
            this.refresh();
        } else if(Input.isTriggered('pagedown')) {
            this._gametesting = false;
            this.refresh();
        }
    }
    this._timer++;
};

Window_Lockpick.prototype.setOpenPosition = function() {
	var skill    = this._skill;	
	var strength = this._strength;

	strength = strength /100;
	skill = skill /strength;

	var range = 0;

	if(skill >= 100) {
		range = 23;
	} else if(skill >= 90) {
		range = 21;
	} else if(skill >= 80) {
		range = 19;
	} else if(skill >= 70) {
		range = 17;
	} else if(skill >= 60) {
		range = 15;
	} else if(skill >= 50) {
		range = 13;
	} else if(skill >= 40) {
		range = 11;
	} else if(skill >= 30) {
		range = 9;
	} else if(skill >= 20) {
		range = 7;
	} else if(skill >= 10) {
		range = 5;
	} else if(skill >= 1) {
		range = 3;
	}

		range    = range.clamp(3,99);
    var max_pos  = 101;
    var position = Math.randomInt(max_pos) -(range/2-0.5);

    var mid = [];
    for(var i = position; i < position+range; i++) {
    	mid.push(i);
    }

    var down = [];
    for(var i = position; i < position+(range/2-0.5); i++) {
    	down.push(i);
    }
    
    var up = [];
    for(var i = position+range-1; i > position+(range/2-0.5); i--) {
    	up.push(i);
    }

    var newlist = [];
    for(var i = 0; i < (range/2-0.5); i++) {
    	var d = down[i];
    	var u = up[i];
    	newlist.push([d,u]);
    }

    mid = mid[range/2-0.5];
    this._openRange = newlist;
    this._openRange.push(mid);
};

Window_Lockpick.prototype.setLockPosition = function() {
    var position = Math.round(this._leftStick.rotation*1000) -1570;
    var max_pos = 3135;
    var range = max_pos/100;
    this._turnPosition = Math.round(position/range);
    this.refresh();
};

Window_Lockpick.prototype.getTurnPosition = function() {
	var position = Math.round(this._rightStick.rotation*1000) +1085;
	var max_pos = 1645;
	var range = max_pos/100;
	this._turnRange = Math.round(position/range);
	this.refresh();
};

Window_Lockpick.prototype.pickLock = function() {
    var open = false;
    var fail = 0;

	var skill    = this._skill;	
	var strength = this._strength;

	strength = strength /100;
	skill = (skill) /strength;


	var	bonus = this._strength -this._skill;
		bonus = bonus > 0 ? bonus : 0; 

	var value = skill < 100 ? (101-skill) /10 : 1;
		value = value+bonus;

	var openRange = this._openRange;
	var mid = openRange[openRange.length-1];
	var rate = openRange.length/100;
	var x = Math.round(this._turnRange*rate);
		x = x.clamp(0,openRange.length-1);

	if(this._turnRange > 70) {
        return this.openLock();
	}

	if(openRange[x][0] == this._turnPosition || openRange[x][1] == this._turnPosition) {
		return this.blockLock(value);
	}

	for(var i = 0; i < openRange.length; i++) {
		if(openRange[i][0] == this._turnPosition || openRange[i][1] == this._turnPosition || mid == this._turnPosition) {
			return;
		}

	}
	this.blockLock(value);
};

Window_Lockpick.prototype.checkLock = function() {
    if($gameSystem.lockpickLoad() <= 0) {
        return this.breakLockpick();  
    }
};

Window_Lockpick.prototype.blockLock = function(value) {
	this._broke        = true;
	this._isBlocked    = true;
	this._isBlockedPik = true;
	this._timer        = 56;
	$gameSystem.gainLockpickLoad(-value);
    this.failSound();
    this.refresh();
    this.checkLock();
};

Window_Lockpick.prototype.openLock = function() {
    this.deactivate();
    this._broke = true;
    this._timer = -60;
    var key     = [$gameSystem._lockpick[1], $gameSystem._lockpick[0], $gameSystem._lockpick[4]];
    $gameSelfSwitches.setValue(key, true);
    this.openSound();
    this.refresh();
};

Window_Lockpick.prototype.breakLockpick = function() {
    this.deactivate();
    this._broke     = true;
   	this._isBlocked = false;
    this._timer     = 0;
	var image = pxd_lp_lockpick_xl ? 'lp_left_broke' : 'lp_left_broke_xs';
    this._leftStick.bitmap = ImageManager.loadBitmap(pxd_lp_root_basic, image);
    $gameParty.gainItem(this._item, -1, true);
    $gameSystem.setLockpickLoad(0);
    this.refresh(); 
    this.breakSound();
    $gameSystem.setLockpickLoad(100);
};

Window_Lockpick.prototype.refresh = function() {
	var pad        = this.standardPadding();
    var item       = $gameParty.numItems(this._item);
    var str_name   = pxd_lp_name_str + ': ';
    var str_value  = this._strength;
    var loc_name   = pxd_lp_name_item + ': ';
    var loc_value  = item;
    var x1         = pxd_lp_name_x;
    var y1         = pxd_lp_name_y;
    var y2         = pxd_lp_value_y;
    var space      = pxd_lp_space;

    this.contents.clear();
    
    if(pxd_lp_show_lock == true) {
    	this.nameParam();
    	this.drawText(str_name, x1, y1, this.windowWidth(), 'left');
		this.valueParam();
		var x2 = Graphics.boxWidth -pad*2 -this.textWidth(str_value) +pxd_lp_value_x;
		this.drawText(str_value, x2, y2, this.windowWidth(), 'left');
	}

	if(pxd_lp_show_name == true) {
    	this.nameParam();
    	this.drawText(loc_name, x1, y1 +space, this.windowWidth(), 'left');
    	this.valueParam();
    	var x3 = Graphics.boxWidth -pad*2 -this.textWidth(loc_value) +pxd_lp_value_x;
		this.drawText(loc_value, x3, y2 +space, this.windowWidth(), 'left');
	}

    if($gameVariables.value(pxd_lp_skill) >= pxd_lp_show_load) this.drawGauge();

    if(this._gametesting == true) {   
        var o = this._openRange;
        var p = this._turnPosition;
        this.contents.fontSize = 16;
        this.drawFlowtext('Open Range:  ' + o, 0, 20, this.windowWidth(), 0);
        this.drawText('Position  :  ' + p, 0, -10, this.windowWidth(), 'left');
    }
};

Window_Lockpick.prototype.nameParam = function() {
    this.contents.fontFace     = pxd_lp_name_face;
    this.contents.fontSize     = pxd_lp_name_size;
    this.contents.outlineWidth = pxd_lp_name_out_size;
    this.contents.textColor    = pxd_lp_name_text_col;
    this.contents.outlineColor = pxd_lp_name_out_col;
    this.contents.fontItalic   = false;
};

Window_Lockpick.prototype.valueParam = function() {
    this.contents.fontFace     = pxd_lp_val_face;
    this.contents.fontSize     = pxd_lp_val_size;
    this.contents.outlineWidth = pxd_lp_val_out_size;
    this.contents.textColor    = pxd_lp_val_text_col;
    this.contents.outlineColor = pxd_lp_val_out_col;
    this.contents.fontItalic   = false;
};

Window_Lockpick.prototype.drawGauge = function() {
    var x        = 2 +pxd_lp_gauge_x;
    var y        = 2 +pxd_lp_gauge_y;
    var width    = 1 +pxd_lp_gauge_w;
    var height   = 1 +pxd_lp_gauge_h;
    var rate     = width /100;
    var LP       = this._hasItem ? $gameSystem.lockpickLoad() : 0;
    var LP       = rate *LP;
    var pad      = this.standardPadding();
    var color1   = pxd_lp_gauge_col_1; 
    var color2   = pxd_lp_gauge_col_2;
    var bgcolor  = pxd_lp_gauge_col_3;
    this.contents.fillRect(x -2, y -2, width +4, height +4, bgcolor);
    this.contents.gradientFillRect(x, y, LP, height, color1, color2);
};

Window_Lockpick.prototype.openSound = function() {
    AudioManager.playSe({name:pxd_lp_sound_open, volume:pxd_lp_volume_open, pitch:pxd_lp_pitch_open});
};

Window_Lockpick.prototype.successSound = function() {
	AudioManager.playSe({name:pxd_lp_sound_success, volume:pxd_lp_volume_suck, pitch:pxd_lp_pitch_success});
};

Window_Lockpick.prototype.failSound = function() {
    AudioManager.playSe({name:pxd_lp_sound_fail, volume:pxd_lp_volume_fail, pitch:pxd_lp_pitch_fail});
};

Window_Lockpick.prototype.breakSound = function() {
    AudioManager.playSe({name:pxd_lp_sound_break, volume:pxd_lp_volume_break, pitch:pxd_lp_pitch_break});
};

Window_Lockpick.prototype.positSound = function() {
    if(this._posTimer == 0) {
        var volume = Math.randomInt(pxd_lp_posit_random) +pxd_lp_posit_basic;
        var count  = Math.randomInt(pxd_lp_posit_count)+1;
        var sound  = String(pxd_lp_posit_sound +count);
        AudioManager.playSe({name:sound, volume:volume, pitch:100});
        this._posTimer++; 
    } else {
        this._posTimer++;
    }
    if(this._posTimer >= pxd_lp_posit_repeat) {
        this._posTimer = 0;
    }
};

Window_Lockpick.prototype.turnSound = function() {
    if(this._turnTimer == 0) {
        var volume = Math.randomInt(pxd_lp_turn_random) +pxd_lp_turn_basic;
        var count  = Math.randomInt(pxd_lp_turn_count)+1;
        var sound  = String(pxd_lp_turn_sound +count);
        AudioManager.playSe({name:sound, volume:volume, pitch:100});
        this._turnTimer++; 
    } else {
        this._turnTimer++;
    }
    if(this._turnTimer >= pxd_lp_turn_repeat) {
        this._turnTimer = 0;
    }
};

// ------------------------------------------------------------------------ gametesting
Window_Base.prototype.drawFlowtext = function(text,x,y,maxWidth,space) {
    var xx       = x;
    var align    = 'left';
    var pad      = this.standardPadding()*3;
    var wordlist = text.split(',');
    var block    = '';    
    var height   = 0 +space; 

    // ------ flowtext
    for(var i = 0; i < wordlist.length; i++) {
        if(this.textWidth(block) +pad < maxWidth) {
            block += wordlist[i] + ',';
            
            // ------ check maxWidth
            if(this.textWidth(block) +pad > maxWidth) {
                block = block.slice(0,-(wordlist[i].length+1));
                this.drawText(block, x, y +height, maxWidth, align);
                block   = '';
                block  += wordlist[i] + ',';
                height += 30 +space;
                align   = 'left';
                x       = xx;
            }
            
        } else {
            this.drawText(block, x, y +height, maxWidth, align);
            block   = '';
            block  += wordlist[i] + ',';
            height += 30 +space;
            align   = 'left';
            x       = xx;
        }
    }
    this.drawText(block, x, y +height, maxWidth, align);
};