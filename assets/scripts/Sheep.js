//-- 绵羊状态
var State = cc.Enum({
    None   : -1,
    Run    : -1,
    Jump   : -1,
    Drop   : -1,
    DropEnd: -1,
    Dead   : -1
});

var Dust = require('Dust');

var Sheep = cc.Class({
    //-- 继承
    extends: cc.Component,
    //-- 属性
    properties: {
        //-- Y轴最大高度
        maxY: 0,
        //-- 地面高度
        groundY: 0,
        //-- 重力
        gravity: 0,
        //-- 起跳速度
        initJumpSpeed: 0,
        //-- 绵羊状态
        _state: {
            default: State.None,
            type: State,
            visible: false
        },
        state: {
            get: function () {
                return this._state;
            },
            set: function(value){
                if (value !== this._state) {
                    this._state = value;
                    if (this._state !== State.None) {
                        var animName = State[this._state];
                        this.anim.stop();
                        this.anim.play(animName);
                    }
                }
            },
            type: State
        },
        //-- 获取Jump音效
        jumpAudio: {
            default: null,
            url: cc.AudioClip
        },
        dustPrefab: cc.Prefab
    },
    statics: {
        State: State
    },
    init () {
        //-- 当前播放动画组件
        this.anim = this.getComponent(cc.Animation);
        //-- 当前速度
        this.currentSpeed = 0;
        //-- 绵羊图片渲染
        this.sprite = this.getComponent(cc.Sprite);
        this.registerInput();
    },
    startRun () {
        this.state = State.Run;
        this.enableInput(true);
    },
    //-- 初始化
    registerInput () {
        //-- 添加绵羊控制事件(为了注销事件缓存事件)
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                this.jump();
            }.bind(this)
        }, this.node);
        // touch input
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                this.jump();
                return true;
            }.bind(this)
        }, this.node);
    },
    //-- 删除
    enableInput: function (enable) {
        if (enable) {
            cc.eventManager.resumeTarget(this.node);
        } else {
            cc.eventManager.pauseTarget(this.node);
        }
    },

    //-- 更新
    update (dt) {
        switch (this.state) {
            case State.Jump:
                if (this.currentSpeed < 0) {
                    this.state = State.Drop;
                }
                break;
            case State.Drop:
                if (this.node.y < this.groundY) {
                    this.node.y = this.groundY;
                    this.state = State.DropEnd;
                    this.spawnDust('DustDown');
                }
                break;
            case State.None:
            case State.Dead:
                return;
        }
        var flying = this.state === State.Jump || this.node.y > this.groundY;
        if (flying) {
            this.currentSpeed -= dt * this.gravity;
            this.node.y += dt * this.currentSpeed;
        }
    },

    // invoked by animation
    onDropFinished () {
        this.state = State.Run;
    },

    onCollisionEnter: function (other) {
        if (this.state !== State.Dead) {
            var group = cc.game.groupList[other.node.groupIndex];
            if (group === 'Obstacle') {
                // bump
                this.state = Sheep.State.Dead;
                D.game.gameOver();
                this.enableInput(false);
            }
            else if (group === 'NextPipe') {
                // jump over
                D.game.gainScore();
            }
       }
    },

    //-- 开始跳跃设置状态数据，播放动画
    jump: function () {
        this.state = State.Jump;
        this.currentSpeed = this.initJumpSpeed;
        //-- 播放跳音效
        cc.audioEngine.playEffect(this.jumpAudio);
        this.spawnDust('DustUp');
    },
    spawnDust (animName) {
        let dust = null;
        if (cc.pool.hasObject(Dust)) {
            dust = cc.pool.getFromPool(Dust);
        } else {
            dust = cc.instantiate(this.dustPrefab).getComponent(Dust);
        }
        this.node.parent.addChild(dust.node);
        dust.node.position = this.node.position;
        dust.playAnim(animName);
    }
});
