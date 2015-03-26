var Sheep = require('Sheep');
var ScrollPicture = require('ScrollPicture');
var PipeGroupManager = require('PipeGroupManager');

var GameState = Fire.defineEnum({
    Run : -1,
    Over: -1
});

var GameManager = Fire.extend(Fire.Component, function () {
    this.gameState = GameState.Run;
    this.score = 0;
});

GameManager.prop('sheep', null, Fire.ObjectType(Sheep));

GameManager.prop('background', null, Fire.ObjectType(ScrollPicture));

GameManager.prop('ground', null, Fire.ObjectType(ScrollPicture));

GameManager.prop('pipeGroupMgr', null, Fire.ObjectType(PipeGroupManager));

GameManager.prop('gameOverMenu', null, Fire.ObjectType(Fire.Entity));

GameManager.prop('scoreText', null, Fire.ObjectType(Fire.BitmapText));

GameManager.prototype.onStart = function () {
    this.gameState = GameState.Run;
    this.score = 0;
    this.scoreText.text = this.score;
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
            //-- 计算分数
            this.updateSorce();
            break;
        default :
            break;
    }
};

GameManager.prototype.updateSorce = function () {
    var nextPipeGroup = this.pipeGroupMgr.getNext();
    if (nextPipeGroup) {
        var sheepRect = this.sheep.renderer.getWorldBounds();
        var pipeGroupRect = nextPipeGroup.bottomRenderer.getWorldBounds();

        //-- 当绵羊的右边坐标越过水管右侧坐标
        var crossed = sheepRect.xMin > pipeGroupRect.xMax;
        if (crossed) {
            //-- 分数+1
            this.score++;
            this.scoreText.text = this.score;
            this.pipeGroupMgr.setAsPassed(nextPipeGroup);
        }
    }
};
