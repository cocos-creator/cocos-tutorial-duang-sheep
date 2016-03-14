var GameOverMenu = cc.Class({
    //-- 继承
    extends: cc.Component,
    //-- 构造函数
    init: function () {
        //-- 重新开始事件
        this.resetGameEvent;
    },
    //-- 属性
    properties: {
        //-- 获取绵羊
        btn_play: {
            default: null,
            type: cc.Button
        }
    },
    // 加载Game场景(重新开始游戏)
    resetGameEvent: function () {
        cc.director.loadScene('Game');
    },
    // 开始
    start: function () {
        // 注册重新开始事件
        this.btn_play.on('mousedown', this.resetGameEvent);
    },
    //-- 删除
    onDestroy: function () {
        //-- 注销重新开始事件
        this.btn_play.off('mousedown', this.resetGameEvent);
    }
});
