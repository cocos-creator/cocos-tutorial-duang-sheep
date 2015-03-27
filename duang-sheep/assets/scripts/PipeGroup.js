var PipeGroup = Fire.Class({
    //-- 继承
    extends: Fire.Component,
    //-- 构造函数
    constructor: function () {
        //-- 保存下方管道的Renderer,方便获得水平边界
        this.bottomRenderer = null;
        //-- 是否已经被通过
        this.passed = false;
    },
    //-- 属性
    properties: {
        //-- 基础移动速度
        speed: 200,
        //-- 超出这个范围就会被销毁
        minX: -900,
        //-- 上方管子坐标范围 Min 与 Max
        topPosRange: {
            default: new Fire.Vec2(100, 160)
        },
        //-- 上方与下方管道的间距 Min 与 Max
        spacingRange: {
            default: new Fire.Vec2(210, 230)
        }
    },
    //-- 初始化
    onEnable: function () {
        var topYpos = Math.randomRange(this.topPosRange.x, this.topPosRange.y);
        var randomSpacing = Math.randomRange(this.spacingRange.x, this.spacingRange.y);
        var bottomYpos = topYpos - randomSpacing;

        var topEntity = this.entity.find('topPipe');
        topEntity.transform.y = topYpos;

        var bottomEntity = this.entity.find('bottomPipe');
        bottomEntity.transform.y = bottomYpos;

        this.bottomRenderer = bottomEntity.getComponent(Fire.SpriteRenderer);
        this.passed = false;
    },
    //-- 更新
    update: function () {
        this.transform.x -= Fire.Time.deltaTime * this.speed;
        if (this.transform.x < this.minX) {
            this.entity.destroy();
        }
    }
});
