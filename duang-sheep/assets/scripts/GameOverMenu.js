var GameOverMenu = cc.Class({
    extends: cc.Component,

    properties: {
        replay: cc.Button,
        score: cc.Label
    },

    restart: function () {
        cc.director.loadScene('Game');
    }
});
