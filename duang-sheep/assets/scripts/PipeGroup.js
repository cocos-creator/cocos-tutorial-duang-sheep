var Game = require('Game');

var PipeGroup = Fire.extend(Fire.Component, function () {
    //-- 管道的宽度
    this.with = 0;
    //-- top Pipe
    this.topEntity = null;
    this.topPipeRenderer = null;
    //-- bottom Pipe
    this.bottomEntity = null;
    this.bottomPipeRenderer = null;
});

//-- 基础移动速度
PipeGroup.prop('speed', 200);

//-- 超出这个范围就会被销毁
PipeGroup.prop('range', -900);

//-- 上方管子坐标范围 Max 与 Min
PipeGroup.prop('topPosRange', new Fire.Vec2(590, 700), Fire.ObjectType(Fire.Vec2));

//-- 上方与下方管道的间距
PipeGroup.prop('spacingRange', new Fire.Vec2(222, 250), Fire.ObjectType(Fire.Vec2));

//-- 初始化
PipeGroup.prototype.onEnable = function () {
    //-- top Pipe
    this.topEntity = this.entity.find('topPipe');
    this.topPipeRenderer = this.topEntity.getComponent(Fire.SpriteRenderer);
    //-- bottom Pipe
    this.bottomEntity = this.entity.find('bottomPipe');
    this.bottomPipeRenderer = this.bottomEntity.getComponent(Fire.SpriteRenderer);

    var topYpos = Math.randomRange(this.topPosRange.x, this.topPosRange.y);
    var randomSpacing = Math.randomRange(this.spacingRange.x, this.spacingRange.y);
    var topHalfHeight = this.topPipeRenderer.sprite.height / 2;
    var bottomHalfHeight = this.bottomPipeRenderer.sprite.height / 2;
    var bottomYpos = (topYpos - (topHalfHeight + randomSpacing + bottomHalfHeight));

    this.topEntity.transform.y = topYpos;
    this.bottomEntity.transform.y = bottomYpos;

    this.with = this.bottomPipeRenderer.sprite.width;
};

//-- 刷新
PipeGroup.prototype.update = function () {
    this.entity.transform.x -= Fire.Time.deltaTime * this.speed;
    if (this.entity.transform.x < this.range) {
        this.entity.destroy();
    }
};

PipeGroup.prototype.onDestroy = function () {
    Game.instance.destroyPipeGroup(this.entity);
};

module.exports = PipeGroup;
