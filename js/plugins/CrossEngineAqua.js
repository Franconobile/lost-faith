//Cross Engine by Restart. Edit to collision logic by AquaEcho

//Edit hitboxes to go by Altimit colliders unless it's a battler that uses the "body size" note
// edited to make enemy collision boxes into circles centered on them.
ToolEvent.prototype.collidedXY = function(target) {
    var bodySize=0.5;
        if ($gameMap.isOverlappingAB(this,target)){
            return true;
        }
        if (target.battler() && target.battler()._ras.bodySize) {
            bodySize = target.battler()._ras.bodySize;
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