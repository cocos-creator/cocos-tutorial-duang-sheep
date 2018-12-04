const Sheep = require('./Sheep');

var State = cc.Enum({
    Menu: 1,
    Playing: 1 << 1,
    Over: 1 << 2
});

cc.Class({
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
        }
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
        // this.sheep.init();
    },

    start () {
        this.state = State.Playing;
        this.score = 0;
        // play bgMusic
        cc.audioEngine.playMusic(this.gameBgAudio);
        // init managers
    },

    gameOver () {
        // stop the running
        this.state = State.Over;
        this.gameOverMenu.active = true;
    }
});
