var GameOverMenu = Fire.extend(Fire.Component, function () {
    //-- 重新开始事件
    this.resetGameEvent = null;
});

GameOverMenu.prop('btn_play', null, Fire.ObjectType(Fire.Entity))

GameOverMenu.prototype.onStart = function () {
    //-- 注册重新开始事件
    this.resetGameEvent = function (event) {
        Fire.Engine.loadScene('Game');
    }.bind(this);
    this.btn_play.on('mousedown', this.resetGameEvent);
};

GameOverMenu.prototype.onDestroy = function () {
    //-- 注销重新开始事件
    this.btn_play.off('mousedown', this.resetGameEvent);
}
