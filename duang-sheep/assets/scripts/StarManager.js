const GameManager = require('GameManager');

cc.Class({
    extends: cc.Component,

    properties: {
        starPrefab: cc.Prefab,
        spawnInterval:2,
        probableValue: {
            default: 0.1,
            tooltip: '生成星星的概率'
        },

        // temp prop, star 的移动速度
        objectSpeed: 0,
        gameManager: cc.Node
    },

    start () {
        this.schedule(this.spawn, this.spawnInterval / 2);
    },
    // temp method
    update (dt) {
        if (this.gameManager.getComponent('GameManager').state !== GameManager.State.Run) {
            return;
        }
        var children = this.node.children;
        let distance = dt * this.objectSpeed;
        for (var i = 0; i < children.length; i++) {
            var node = children[i];
            node.x += distance;
            var bounds = node.getBoundingBoxToWorld();
            var disappear = bounds.xMax < 0;
            if (disappear) {
                node.destroy();
            }
        }
    },

    spawn () {
        if (Math.random() > this.probableValue) {
            return;
        }

        let star = cc.instantiate(this.starPrefab);
        star.parent = this.node;
        star.x = 700;
        star.y = -270 + Math.random() * (325 + 270);
    },

    reset () {
        this.unschedule(this.spawn);
    }
});
