var PipeGroupManager = Fire.Class({
    //-- 继承
    extends: Fire.Component,
    //-- 构造函数
    constructor: function () {
        //-- 上一次创建PipeGroup的时间
        this.lastTime = 0;
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
        spawnInterval: 3,
        //-- 管道列表
        pipeGroupList: {
            get: function () {
                return this.entity.getChildren();
            },
            visible: false
        }
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
    //-- 获取下个未通过的水管
    getNext: function () {
        for (var i = 0; i < this.pipeGroupList.length; ++i) {
            var pipeGroupEntity = this.pipeGroupList[i];
            var pipeGroup = pipeGroupEntity.getComponent('PipeGroup');
            if (!pipeGroup.passed) {
                return pipeGroup;
            }
        }
        return null;
    },
    //-- 标记已通过的水管
    setAsPassed: function (pipeGroup) {
        pipeGroup.passed = true;
    },
    //-- 碰撞检测
    collisionDetection: function (sheepRect) {
        for (var i = 0; i < this.pipeGroupList.length; ++i) {
            //-- 上方障碍物
            var pipeGroupEntity = this.pipeGroupList[i];
            var pipe = pipeGroupEntity.find('topPipe');
            var pipeRender = pipe.getComponent(Fire.SpriteRenderer)
            var pipeRect = pipeRender.getWorldBounds();

            if (Fire.Intersection.rectRect(sheepRect, pipeRect)) {
                return true;
            }

            //-- 下方障碍物
            pipe = pipeGroupEntity.find('bottomPipe');
            pipeRender = pipe.getComponent(Fire.SpriteRenderer);
            pipeRect = pipeRender.getWorldBounds();

            if (Fire.Intersection.rectRect(sheepRect, pipeRect)) {
                return true;
            }
        }
        return false;
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
