var PipeGroup = Fire.extend(Fire.Component, function () {
    //-- 管道的宽度
    this.width = 0;
});

//-- 基础移动速度
PipeGroup.prop('speed', 200);

//-- 超出这个范围就会被销毁
PipeGroup.prop('minX', -900);

//-- 上方管子坐标范围 Min 与 Max
PipeGroup.prop('topPosRange', new Fire.Vec2(100, 160));

//-- 上方与下方管道的间距 Min 与 Max
PipeGroup.prop('spacingRange', new Fire.Vec2(210, 230));

//-- 初始化
PipeGroup.prototype.onEnable = function () {
    var topYpos = Math.randomRange(this.topPosRange.x, this.topPosRange.y);
    var randomSpacing = Math.randomRange(this.spacingRange.x, this.spacingRange.y);
    var bottomYpos = topYpos - randomSpacing;

    var topEntity = this.entity.find('topPipe');
    topEntity.transform.y = topYpos;

    var bottomEntity = this.entity.find('bottomPipe');
    bottomEntity.transform.y = bottomYpos;

    var bottomPipeRenderer = bottomEntity.getComponent(Fire.SpriteRenderer);
    this.width = bottomPipeRenderer.sprite.width;
};

//-- 刷新
PipeGroup.prototype.update = function () {
    this.transform.x -= Fire.Time.deltaTime * this.speed;
    if (this.transform.x < this.minX) {
        this.entity.destroy();
    }
};
