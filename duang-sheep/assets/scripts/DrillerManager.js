const Driller = require('Driller');

var DrillerManager = cc.Class({
    extends: cc.Component,

    properties: {
        drillerPrefab: cc.Prefab,
        spawnInterval: 1
    },

    onLoad () {
        D.drillerManager = this;
    },

    startSpawn () {
        this.schedule(this.spawn, this.spawnInterval);
    },
    //-- 创建飞弹
    spawn () {
        let driller = D.spawnManager.spawn(this.drillerPrefab, Driller);
        driller.sheep = D.sheep.node;
    },

    /*     
    reset () {
        this.unschedule(this.spawn);
    } */
});
