const Star = require('Star');

cc.Class({
    extends: cc.Component,

    properties: {
        starPrefab: cc.Prefab,
        spawnInterval:2,
        probableValue: {
            default: 0.1,
            tooltip: '生成星星的概率'
        },
        spawnY: 0,
        // temp prop, star 的移动速度
        objectSpeed: 0
    },

    onLoad () {
        D.starManager = this;
    },

    startSpawn () {
        this.schedule(this.spawn, this.spawnInterval / 2);
    },

    spawn () {
        if (Math.random() > this.probableValue) {
            return;
        }

        let star = D.spawnManager.spawn(this.starPrefab, Star);
        star.node.y = Math.random() * (325 + this.spawnY) - this.spawnY;
    },

    /*  
    reset () {
        this.unschedule(this.spawn);
    } 
    */
});
