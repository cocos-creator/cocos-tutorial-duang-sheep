const PipeGroup = require('PipeGroup');

cc.Class({
    extends: cc.Component,
    properties: {
        pipePrefab: cc.Prefab,
        //-- 创建PipeGroup需要的时间
        spawnInterval: 0
    },
    onLoad () {
        D.pipeManager = this;
    },
    startSpawn () {
        this.spawnPipe();
        this.schedule(this.spawnPipe, this.spawnInterval);
    },
    //-- 创建管道组
    spawnPipe () {
        D.sceneManager.spawn(this.pipePrefab, PipeGroup);
    },
    reset () {
        this.unschedule(this.spawnPipe);
    }
});
