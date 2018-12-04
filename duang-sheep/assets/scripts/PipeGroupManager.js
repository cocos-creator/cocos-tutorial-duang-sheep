const PipeGroup = require("PipeGroup");

var PipeGroupManager = cc.Class({
    extends: cc.Component,

    properties: {
        pipePrefab: cc.Prefab,
        //-- 创建PipeGroup需要的时间
        spawnInterval: 0,
        //-- pipe 移动速度
        objectSpeed: 0,
    },
    onLoad () {
        D.pipeManager = this;
    },
    
    startSpawn () {
        this.spawnPipe();
        this.schedule(this.spawnPipe, this.spawnInterval);
    },

    spawnPipe () {
        D.spawnManager.spawn(this.pipePrefab, PipeGroup);
    },

    /*     
    reset () {
        this.unschedule(this.spawnPipe);
    } */
});