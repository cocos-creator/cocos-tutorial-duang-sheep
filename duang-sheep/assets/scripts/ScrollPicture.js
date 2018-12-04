const GameManager = require('./GameManager')

var ScrollPicture = cc.Class({
    //-- 继承
    extends: cc.Component,
    //-- 属性
    properties: {
        //-- 滚动的速度
        speed:200,
        //-- X轴边缘
        resetX: 0,

        // temp prop
        gameManager: cc.Node
    },
    //-- 更新
    update: function (dt) {
        if (this.gameManager.getComponent('GameManager').state !== GameManager.State.Run) {
            return;
        }
        this.node.x += dt * this.speed;
        if (this.node.x < this.resetX) {
            this.node.x -= this.resetX;
        }
    }
});
