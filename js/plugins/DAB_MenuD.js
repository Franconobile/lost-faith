//=============================================================================
// DAB_MenuD.js
//=============================================================================
 /*:
 * 
 * @default 
 * @param bgBitmapMenu
 * @desc background di menu scene. taruh di img/pictures.
 * @default 
 * 
 * @param bgBitmapItem
 * @desc background di item scene. taruh di img/pictures.
 * @default 
 * 
 * @param bgBitmapSkill
 * @desc background di skill scene. taruh di img/pictures.
 * @default 
 * 
 * @param bgBitmapEquip
 * @desc background di equip scene. taruh di img/pictures.
 * @default 
 * 
 * @param bgBitmapStatus
 * @desc background di status scene. taruh di img/pictures.
 * @default 
 * 
 * @param bgBitmapOptions
 * @desc background di option scene. taruh di img/pictures.
 * @default 
 * 
 * @param bgBitmapFile
 * @desc background di save/load scene. taruh di img/pictures.
 * @default 
 * 
 * @param bgBitmapGameEnd
 * @desc background di gameEnd scene. taruh di img/pictures.
 * @default 
 * 
 * @param maxColsMenu
 * @desc jumlah kolom
 * @default
 * 
 * @param commandRows
 * @desc jumlah barus
 * @default
 *
 * @param isDisplayStatus
 * @desc tampilkan status. (1 = ya, 0 = tidak)
 * @default 1
 * 
 * @help 
 *
 * Actor' note:
 * <stand_picture:filename> set gambar aktof di menu.
 *   taruh di img/pictures.
 *
 * ukuran normal actor:
 * width: 174px(maxColsMenu=4), 240px(maxColsMenu=3)
 * height: 408px(commandRows=2), 444px(commandRows=1)
 */
 
 (function() {
 
    // deklarasi parameters
    var parameters = PluginManager.parameters('DAB_MenuD');
    var bgBitmapMenu = parameters['bgBitmapMenu'] || '';
    var bgBitmapItem = parameters['bgBitmapItem'] || '';
    var bgBitmapSkill = parameters['bgBitmapSkill'] || '';
    var bgBitmapEquip = parameters['bgBitmapEquip'] || '';
    var bgBitmapStatus = parameters['bgBitmapStatus'] || '';
    var bgBitmapOptions = parameters['bgBitmapOptions'] || '';
    var bgBitmapFile = parameters['bgBitmapFile'] || '';
    var bgBitmapGameEnd = parameters['bgBitmapGameEnd'] || '';
    var maxColsMenuWnd = Number(parameters['maxColsMenu'] || 4);
    var rowsCommandWnd = Number(parameters['commandRows'] || 2);
    var isDisplayStatus = !!Number(parameters['isDisplayStatus']);

    Galv.BM.offsets = function() {
        var array = PluginManager.parameters('Galv_BustMenu')["Bust Offsets"].split("|");
        var obj = {};
        for (i = 0; i < array.length; i++) {
            if (array[i]) {
                var data = array[i].split(",");
                obj[data[0]] = [Number(data[1]),Number(data[2])];
            };
        };
        return obj;
    }();
    
	
   //
   // tampilan window di setiap menu
   //
    var _Scene_Menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.call(this);
        this._statusWindow.x = 0;
        this._statusWindow.y = this._commandWindow.height+50;
		this._statusWindow.height = 430;
        this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
		this.windowLoc = new Window_Location();
        this.windowLoc.x = 0;
        this.windowLoc.y = this._goldWindow.y;
        this.addChild(this.windowLoc);
        // opaacity window
        this._statusWindow.opacity = 255;
        this._goldWindow.opacity = 255;
        this._commandWindow.opacity = 255;
		this.windowLoc.opacity = 255;
		
		
    };
 
    var _Scene_Item_create = Scene_Item.prototype.create;
    Scene_Item.prototype.create = function() {
        _Scene_Item_create.call(this);
        this._helpWindow.opacity = 255;
        this._categoryWindow.opacity = 255;
        this._itemWindow.opacity = 255;
        this._actorWindow.opacity = 255;
    };
 
    var _Scene_Skill_create = Scene_Skill.prototype.create;
    Scene_Skill.prototype.create = function() {
        _Scene_Skill_create.call(this);
        this._helpWindow.opacity = 255;
        this._skillTypeWindow.opacity = 255;
        this._statusWindow.opacity = 255;
        this._itemWindow.opacity = 255;
        this._actorWindow.opacity = 255;
    };
 
    var _Scene_Equip_create = Scene_Equip.prototype.create;
    Scene_Equip.prototype.create = function() {
        _Scene_Equip_create.call(this);
        this._helpWindow.opacity = 255;
        this._statusWindow.opacity = 255;
        this._commandWindow.opacity = 255;
        this._slotWindow.opacity = 255;
        this._itemWindow.opacity = 255;
    };
 
    var _Scene_Status_create = Scene_Status.prototype.create;
    Scene_Status.prototype.create = function() {
        _Scene_Status_create.call(this);
        this._statusWindow.opacity = 255;
    };
 
    var _Scene_Options_create = Scene_Options.prototype.create;
    Scene_Options.prototype.create = function() {
        _Scene_Options_create.call(this);
        this._optionsWindow.opacity = 255;
    };
 
    var _Scene_File_create = Scene_File.prototype.create;
    Scene_File.prototype.create = function() {
        _Scene_File_create.call(this);
        this._helpWindow.opacity = 255;
        this._listWindow.opacity = 255;
    };
 
    var _Scene_GameEnd_create = Scene_GameEnd.prototype.create;
    Scene_GameEnd.prototype.create = function() {
        _Scene_GameEnd_create.call(this);
        this._commandWindow.opacity = 255;
    };
 
    //
    // load bitmap yang diset di plugin parameter
    //
    var _Scene_Menu_createBackground = Scene_Menu.prototype.createBackground;
    Scene_Menu.prototype.createBackground = function(){
        if(bgBitmapMenu){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapMenu);
            this.addChild(this._backgroundSprite);
            return;
        }
        // kalau background error, pake default
        _Scene_Menu_createBackground.call(this);
    };
 
    var _Scene_Item_createBackground = Scene_Item.prototype.createBackground;
    Scene_Item.prototype.createBackground = function(){
        if(bgBitmapItem){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapItem);
            this.addChild(this._backgroundSprite);
            return;
        }
        // kalau background error, pake default
        _Scene_Item_createBackground.call(this);
    };
 
    var _Scene_Skill_createBackground = Scene_Skill.prototype.createBackground;
    Scene_Skill.prototype.createBackground = function(){
        if(bgBitmapSkill){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapSkill);
            this.addChild(this._backgroundSprite);
            return;
        }
        // kalau background error, pake default
        _Scene_Skill_createBackground.call(this);
    };
 
    var _Scene_Equip_createBackground = Scene_Equip.prototype.createBackground;
    Scene_Equip.prototype.createBackground = function(){
        if(bgBitmapEquip){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapEquip);
            this.addChild(this._backgroundSprite);
            return;
        }
        // kalau background error, pake default
        _Scene_Equip_createBackground.call(this);
    };
 
    var _Scene_Status_createBackground =
     Scene_Status.prototype.createBackground;
    Scene_Status.prototype.createBackground = function(){
        if(bgBitmapStatus){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapStatus);
            this.addChild(this._backgroundSprite);
            return;
        }
        // kalau background error, pake default
        _Scene_Status_createBackground.call(this);
    };
 
    var _Scene_Options_createBackground =
     Scene_Options.prototype.createBackground;
    Scene_Options.prototype.createBackground = function(){
        if(bgBitmapOptions){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapOptions);
            this.addChild(this._backgroundSprite);
            return;
        }
        // kalau background error, pake default
        _Scene_Options_createBackground.call(this);
    };
 
    var _Scene_File_createBackground = Scene_File.prototype.createBackground;
    Scene_File.prototype.createBackground = function(){
        if(bgBitmapFile){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapFile);
            this.addChild(this._backgroundSprite);
            return;
        }
        // kalau background error, pake default
        _Scene_File_createBackground.call(this);
    };
 
    var _Scene_GameEnd_createBackground =
     Scene_GameEnd.prototype.createBackground;
    Scene_GameEnd.prototype.createBackground = function(){
        if(bgBitmapGameEnd){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapGameEnd);
            this.addChild(this._backgroundSprite);
            return;
        }
        // kalau background error, pake default
        _Scene_GameEnd_createBackground.call(this);
    };
 
    //
    // alt menu screen proses
    //
    Window_MenuCommand.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };
 
    Window_MenuCommand.prototype.maxCols = function() {
        return 4;
    };
 
    Window_MenuCommand.prototype.numVisibleRows = function() {
        return rowsCommandWnd;
    };
 
    Window_MenuStatus.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };
 
    Window_MenuStatus.prototype.windowHeight = function() {
        var h1 = this.fittingHeight(1);
        var h2 = this.fittingHeight(rowsCommandWnd);
        return Graphics.boxHeight - h1 - h2;
    };
 
    Window_MenuStatus.prototype.maxCols = function() {
        return maxColsMenuWnd;
    };
 
    Window_MenuStatus.prototype.numVisibleRows = function() {
        return 1;
    };
 
    Window_MenuStatus.prototype.drawItemImage = function(index, faceName, faceIndex) {
        var bustName = faceName + "_" + (faceIndex + 1)

        var ox = 0;
        var oy = 0;
        if (Galv.BM.offsets[bustName]) {
            ox = Galv.BM.offsets[bustName][0] || 0;
            oy = Galv.BM.offsets[bustName][1] || 0;
        };


        var actor = $gameParty.members()[index];
        var rect = this.itemRectForText(index);
        // load stand_picture
        var bitmapName = $dataActors[actor.actorId()].meta.stand_picture;
        var bitmap = ImageManager.loadPicture(bustName);
        var w = Math.min(rect.width, (bitmapName ? bitmap.width : 144));
        var h = Math.min(rect.height, (bitmapName ? bitmap.height : 144));
        var lineHeight = this.lineHeight();
        this.changePaintOpacity(actor.isBattleMember());
        if(bitmap){
            var sx = (bitmap.width > w) ? (bitmap.width - w) / 2 : 0;
            var sy = (bitmap.height > h) ? (bitmap.height - h) / 2 : 0;
            var dx = (bitmap.width > rect.width) ? rect.x :
                rect.x + (rect.width - bitmap.width) / 2;
            var dy = (bitmap.height > rect.height) ? rect.y :
                rect.y + (rect.height - bitmap.height) / 2;
            this.contents.blt(bitmap, sx, sy, w, h, dx, dy);
        } else { // kalau bitmap error, pake bitmap default.
            this.loadPicture(bustName);
        }
        this.changePaintOpacity(true);
    };
 
    Window_MenuStatus.prototype.drawItemStatus = function(index) {
        if(!isDisplayStatus){
            return;
        }
        var actor = $gameParty.members()[index];
        var rect = this.itemRectForText(index);
        var x = rect.x;
        var y = rect.y;
        var width = rect.width;
        var bottom = y + rect.height;
        var lineHeight = this.lineHeight();
        this.drawActorName(actor, x, y + lineHeight * 0, width);
        this.drawActorLevel(actor, x, y + lineHeight * 1, width);
        this.drawActorClass(actor, x, bottom - lineHeight * 3, width);
        this.drawActorHp(actor, x, bottom - lineHeight * 2, width);
        this.drawActorMp(actor, x, bottom - lineHeight * 1, width);
        this.drawActorIcons(actor, x, bottom - lineHeight * 1, width);
    };
 
    var _Window_MenuActor_initialize = Window_MenuActor.prototype.initialize;
    Window_MenuActor.prototype.initialize = function() {
        _Window_MenuActor_initialize.call(this);
        this.y = this.fittingHeight(2);
    };
	
	
	// membuat info lokasi
	function Window_Location() {
        this.initialize.apply(this, arguments);
    }

    Window_Location.prototype = Object.create(Window_Base.prototype);
    Window_Location.prototype.constructor = Window_Location;

    Window_Location.prototype.initialize = function(x, y) {
        var width = this.windowWidth();
        var height = this.windowHeight();
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
    };

    Window_Location.prototype.windowWidth = function() {
        return 500;
    };

    Window_Location.prototype.windowHeight = function() {
        return this.fittingHeight(1);
    };

    Window_Location.prototype.refresh = function() {
        var x = this.textPadding();
        var width = this.contents.width - this.textPadding() * 2;
        this.contents.clear();
        this.drawTextEx('Current Location : '+String($dataMap.displayName), 0, 0);
    };


    Window_Location.prototype.open = function() {
        this.refresh();
        Window_Base.prototype.open.call(this);
    };
	 
})();