var GameOverMenu = cc.Class({
    //-- 继承
    extends: cc.Component,
    //-- 属性
    properties: {
        btn_play: cc.Button,
        score: cc.Label
    },
    // 加载Game场景(重新开始游戏)
    restart: function () {
        cc.director.loadScene('Game');
    },
});
