var GameOverMenu = Fire.Class({
    //-- 继承
    extends: Fire.Component,
    //-- 构造函数
    constructor: function () {
        //-- 重新开始事件
        this.resetGameEvent = null;
    },
    //-- 属性
    properties: {
        //-- 获取绵羊
        btn_play: {
            default: null,
            type: Fire.Entity
        }
    },
    //-- 开始
    onStart: function () {
        //-- 注册重新开始事件
        this.resetGameEvent = function (event) {
            Fire.Engine.loadScene('Game');
        }.bind(this);
        this.btn_play.on('mousedown', this.resetGameEvent);
    },
    //-- 删除
    onDestroy: function () {
        //-- 注销重新开始事件
        this.btn_play.off('mousedown', this.resetGameEvent);
    }
});
