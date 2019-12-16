const Driller = require('Driller');

cc.Class({
    extends: cc.Component,
    properties: {
        prefab: cc.Prefab,
        spawnInterval: 1
    },
    onLoad () {
        D.drillerManager = this;
    },
    start () {
        this.schedule(this.spawn, this.spawnInterval);
    },
    //-- 创建管道组
    spawn () {
        D.sceneManager.spawn(this.prefab, Driller);
    },
    reset () {
        this.unschedule(this.spawn);
    }
});
