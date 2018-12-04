const Sheep = require('./Sheep');

var State = cc.Enum({
    Menu: 1,
    Run: 1 << 1,
    Over: 1 << 2
});

var GameManager = cc.Class({
    extends: cc.Component,

    properties: {
        //-- 获取绵羊
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

        supermanMode: {
            default: false,
            tooltip: '无敌模式, 方便测试地图'
        },

        // temp prop
        pipeManager: cc.Node,
        drillerManager: cc.Node,
        starManager: cc.Node
    },

    statics: {
        State
    },

    onLoad () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

        // init the game
        this.state = State.Menu;
        this.score = 0;
        this.scoreText.string = this.score;
        this.gameOverMenu.active = false;
        this.sheep.init();
    },

    start () {
        this.state = State.Run;
        this.score = 0;
        // play bgMusic
        cc.audioEngine.playMusic(this.gameBgAudio);

    },

    gameOver () {
        // stop the running
        this.state = State.Over;
        // temp method
        this.pipeManager.getComponent('PipeGroupManager').reset();
        this.drillerManager.getComponent('DrillerManager').reset();
        this.starManager.getComponent('StarManager').reset();
        // stop audio
        cc.audioEngine.stopMusic();
        cc.audioEngine.stopEffect(this.dieAudio);
        cc.audioEngine.stopEffect(this.gameOverAudio);
        this.gameOverMenu.active = true;
        this.gameOverMenu.getComponent('GameOverMenu').score.string = this.score;
    },
    // update the score
    gainScore () {
        this.score++;
        this.scoreText.string = this.score;
        cc.audioEngine.playEffect(this.scoreAudio);
    }
});

module.export = GameManager;