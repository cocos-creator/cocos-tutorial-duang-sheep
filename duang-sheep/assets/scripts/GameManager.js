const Sheep = require('Sheep');

var State = cc.Enum({
    Menu: 1,
    Run: 1 << 1,
    Over: 1 << 2
});

var GameManager = cc.Class({
    extends: cc.Component,

    properties: {
        sheep: Sheep,
        //-- 获取gameOverMenu对象
        gameOverMenu: cc.Node,
        //-- 获取分数对象
        scoreText: cc.Label,    
        //-- 获取背景音效
        gameBgAudio: {
           default: null,
           type: cc.AudioClip
        },
        //-- 获取死亡音效
        dieAudio: {
            default: null,
            type: cc.AudioClip
        },
        //-- 获取失败音效
        gameOverAudio: {
            default: null,
            type: cc.AudioClip
        },
        //-- 获取得分音效
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },

        //-- 游戏结束算分
        gameOverScoreLabel: cc.Label,

        supermanMode: {
            default: false,
            tooltip: '无敌模式, 方便测试地图'
        }
    },

    statics: {
        State
    },

    onLoad () {
        D.GameManager = GameManager;
        D.game = this;

        this.sheep.init();
        // activate colliders
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //-- 游戏状态
        this.state = State.Menu;
        //-- 分数
        this.score = 0;
        this.scoreText.string = this.score;
        this.gameOverMenu.active = false;
        // resume the game loop
        cc.director.resume();
    },
    
    //-- 开始
    start () {
        this.state = State.Run;
        this.score = 0;
        cc.audioEngine.playMusic(this.gameBgAudio);
        // start running
        D.sheep.startRun();
        // start spawn obstacle
        D.spawnManager.startSpawn();
    },

    //-- 背景音效停止，死亡音效播放
    gameOver () {
        this.state = State.Over;
        cc.director.pause();
    /*      
        // stop spwan
        D.pipeManager.reset();
        D.starManager.reset();
        D.drillerManager.reset();
        // stop audio
        cc.audioEngine.stopMusic();
        cc.audioEngine.stopEffect(this.dieAudio);
        cc.audioEngine.stopEffect(this.gameOverAudio); 
    */
        this.gameOverMenu.active = true;
        this.gameOverScoreLabel.string = this.score;
    },

    //-- 更新分数
    gainScore () {
        //-- 分数+1
        this.score++;
        this.scoreText.string = this.score;
        //-- 分数增加音效
        cc.audioEngine.playEffect(this.scoreAudio);
    },

    //-- 重新开始游戏
    restart: function () {
        cc.director.loadScene('Game');
    }
});

module.export = GameManager;