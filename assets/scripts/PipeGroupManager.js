const PipeGroup = require('PipeGroup');

var PipeGroupManager = cc.Class({
    extends: cc.Component,
    //-- 属性
    properties: {
        pipePrefab: cc.Prefab,
        pipeLayer: cc.Node,
        initPipeX: 0,
        //-- 创建PipeGroup需要的时间
        spawnInterval: 0
    },
    //-- 初始化
    init: function (game) {
        this.game = game;
        this.pipeList = [];
        this.isRunning = false;
    },
    startSpawn () {
        this.spawnPipe();
        this.schedule(this.spawnPipe, this.spawnInterval);
        this.isRunning = true;
    },
    //-- 创建管道组
    spawnPipe () {
        let pipeGroup = null;
        if (cc.pool.hasObject(PipeGroup)) {
            pipeGroup = cc.pool.getFromPool(PipeGroup);
        } else {
            pipeGroup = cc.instantiate(this.pipePrefab).getComponent(PipeGroup);
        }
        this.pipeLayer.addChild(pipeGroup.node);
        pipeGroup.node.active = true;
        pipeGroup.node.x = this.initPipeX;
        pipeGroup.init(this);
        this.pipeList.push(pipeGroup);
    },
    despawnPipe (pipe) {
        pipe.node.removeFromParent();
        pipe.node.active = false;
        cc.pool.putInPool(pipe);
    },
    //-- 获取下个未通过的水管
    getNext: function () {
        return this.pipeList.shift();
    },
    reset () {
        this.unschedule(this.spawnPipe);
        this.pipeList = [];
        this.isRunning = false;
    }
});
