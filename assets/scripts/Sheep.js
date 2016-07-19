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
                        this._updateAnimation();
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
        dustPrefab: cc.Prefab,

        addEnergyOnGround: {
            default: 0.5,
            tooltip: '每秒在地上恢复的能量值'
        },
        jumpEnergyCost: {
            default: 0.3,
            tooltip: '每次跳跃消耗的能量值'
        },
        energyBar: cc.ProgressBar,

        invincible: false,
        invincibleTime: 3,
        invincibleSpeed: -600,
        normalSpeed: -300
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
        this.energy = 1;
    },
    startRun () {
        this.energy = 1;
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
        else {
            this.energy += this.addEnergyOnGround * dt;
        }

        // update energy
        this.energy = cc.clamp01(this.energy);
        this.energyBar.progress = this.energy;
    },

    _updateAnimation () {
        var animName = State[this._state];
        if (this.invincible) {
            var invincibleAnimName = animName + '_invincible';
            var hasInvincibleAnim = this.anim.getAnimationState(invincibleAnimName);
            if (hasInvincibleAnim) {
                animName = invincibleAnimName;
            }
        }
        this.anim.stop();
        this.anim.play(animName);
    },

    // invoked by animation
    onDropFinished () {
        this.state = State.Run;
    },

    onCollisionEnter: function (other) {
        if (this.state !== State.Dead) {
            var group = cc.game.groupList[other.node.groupIndex];
            switch (group) {
                case 'Obstacle':
                    if (D.game.supermanMode) {
                        return;
                    }
                    if (this.invincible) {
                        return;
                    }
                    // bump
                    this.state = Sheep.State.Dead;
                    D.game.gameOver();
                    this.enableInput(false);
                    break;
                case 'NextPipe':
                    // jump over
                    D.game.gainScore();
                    break;
                case 'Prop':
                    // 无敌了也
                    this.enterInvincible();
                    break;
            }
       }
    },

    enterInvincible () {
        this.invincible = true;
        this._updateAnimation();
        this.scheduleOnce(() => {
            this.exitInvincible();
        }, this.invincibleTime);
        D.sceneManager.objectSpeed = this.invincibleSpeed;
    },

    exitInvincible () {
        D.sceneManager.objectSpeed = this.normalSpeed;
        this.invincible = false;
        this._updateAnimation();
    },

    //-- 开始跳跃设置状态数据，播放动画
    jump: function () {
        if (this.energy >= this.jumpEnergyCost) {
            this.energy -= this.jumpEnergyCost;

            this.state = State.Jump;
            this.currentSpeed = this.initJumpSpeed;
            this.spawnDust('DustUp');
            //-- 播放跳音效
            cc.audioEngine.playEffect(this.jumpAudio);
        }
        else {
            cc.audioEngine.playEffect(D.game.dieAudio);
        }
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
