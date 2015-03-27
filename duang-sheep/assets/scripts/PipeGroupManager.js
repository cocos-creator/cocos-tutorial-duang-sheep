var PipeGroupManager = Fire.Class({
    //-- 继承
    extends: Fire.Component,
    //-- 构造函数
    constructor: function () {
        //-- 上一次创建PipeGroup的时间
        lastTime: 0
    },
    //-- 属性
    properties: {
        //-- 获取PipeGroup模板
        srcPipeGroup: {
            default: null,
            type: Fire.Entity
        },
        //-- PipeGroup初始坐标
        initPipeGroupPos: {
            default: new Fire.Vec2(600, 0)
        },
        //-- 创建PipeGroup需要的时间
        spawnInterval: 3
    },
    //-- 初始化
    onLoad: function () {
        this.lastTime = Fire.Time.time + 10;
    },
    //-- 创建管道组
    createPipeGroupEntity: function () {
        var pipeGroup = Fire.instantiate(this.srcPipeGroup);
        pipeGroup.parent = this.entity;
        pipeGroup.transform.position = this.initPipeGroupPos;
        pipeGroup.active = true;
    },
    //-- 更新
    update: function () {
        //-- 每过一段时间创建障碍物
        var idleTime = Math.abs(Fire.Time.time - this.lastTime);
        if (idleTime >= this.spawnInterval) {
            this.lastTime = Fire.Time.time;
            this.createPipeGroupEntity();
        }
    }
});
