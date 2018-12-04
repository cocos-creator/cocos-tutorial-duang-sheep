const Star = require('Star');

cc.Class({
    extends: cc.Component,
    properties: {
        starPrefab: cc.Prefab,
        spawnInterval: 2,
        probableValue: {
            default: 0.1,
            tooltip: '生成星星的概率'
        },
    },
    onLoad () {
        D.starManager = this;
    },
    start () {
        this.schedule(this.spawn, this.spawnInterval, cc.macro.REPEAT_FOREVER, this.spawnInterval / 2);
    },
    spawn () {
        if (Math.random() > this.probableValue) {
            return;
        }
        var star = D.sceneManager.spawn(this.starPrefab, Star);
        star.node.y = -270 + Math.random() * (325 + 270);
    },
    reset () {
        this.unschedule(this.spawn);
    }
});
