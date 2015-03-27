var Sheep = require('Sheep');
var ScrollPicture = require('ScrollPicture');
var PipeGroupManager = require('PipeGroupManager');

var GameState = Fire.defineEnum({
    Run : -1,
    Over: -1
});

var GameManager = Fire.Class({
    //-- 继承
    extends: Fire.Component,
    //-- 构造函数
    constructor: function () {
        //-- 游戏状态
        this.gameState = GameState.Run
        //-- 分数
        this.score = 0;
    },
    //-- 属性
    properties: {
        //-- 获取绵羊
        sheep: {
            default: null,
            type: Sheep
        },
        //-- 获取背景
        background: {
            default: null,
            type: ScrollPicture
        },
        //-- 获取地面
        ground: {
            default: null,
            type: ScrollPicture
        },
        //-- 获取障碍物管理
        pipeGroupMgr: {
            default: null,
            type: PipeGroupManager
        },
        //-- 获取gameOverMenu对象
        gameOverMenu: {
            default: null,
            type: Fire.Entity
        },
        //-- 获取分数对象
        scoreText: {
            default: null,
            type: Fire.BitmapText
        }
    },
    //-- 开始
    onStart: function () {
        this.gameState = GameState.Run;
        this.score = 0;
        this.scoreText.text = this.score;
    },
    //-- 更新
    update: function () {
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
    },
    //-- 更新分数
    updateSorce: function () {
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
    }
});
