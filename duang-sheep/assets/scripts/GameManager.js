var Sheep = require('Sheep');
var ScrollPicture = require('ScrollPicture');
var PipeGroupManager = require('PipeGroupManager');

var GameState = Fire.defineEnum({
    Run : -1,
    Over: -1
});

var GameManager = Fire.extend(Fire.Component, function () {
    this.gameState = GameState.Run;
});

GameManager.prop('sheep', null, Fire.ObjectType(Sheep));

GameManager.prop('background', null, Fire.ObjectType(ScrollPicture));

GameManager.prop('ground', null, Fire.ObjectType(ScrollPicture));

GameManager.prop('pipeGroupMgr', null, Fire.ObjectType(PipeGroupManager));

GameManager.prop('gameOverMenu', null, Fire.ObjectType(Fire.Entity));

GameManager.prototype.onStart = function () {
    this.gameState = GameState.Run;
};

GameManager.prototype.update = function () {
    switch (this.gameState) {
        case GameState.Run:
            var sheepRect = this.sheep.renderer.getWorldBounds();
            var gameOver = this.pipeGroupMgr.collisionDetection(sheepRect);
            if (gameOver) {
                this.gameState = GameState.Over;
                this.sheep.state = Sheep.State.Dead;
                this.ground.enabled = false;
                this.background.enabled = false;
                for (var i = 0; i < this.pipeGroupMgr.pipeGroupList.length; ++i) {
                    var pipeGroup = this.pipeGroupMgr.pipeGroupList[i].getComponent('PipeGroup');
                    pipeGroup.enabled = false;
                }
                this.pipeGroupMgr.enabled = false;
                this.gameOverMenu.active = true;
            }
            break;
        default :
            break;
    }
};
