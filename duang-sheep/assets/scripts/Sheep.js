const Dust = require('./Dust');

//-- 绵羊状态
var State = cc.Enum({
    None   : -1,
    Run    : -1,
    Jump   : -1,
    Drop   : -1,
    DropEnd: -1,
    Dead   : -1
});

var Sheep = cc.Class({
    //-- 继承
    extends: cc.Component,

    //-- 属性
    properties: {
        //-- Y轴最大高度
        maxY: 250,
        //-- 地面高度
        groundY: -170,
        //-- 重力
        gravity: 9.8,
        //-- 起跳速度
        initJumpSpeed: 500,
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
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        },

        dustPrefab: cc.Prefab,

        addEnergyOnGroup: {
            default: 0.5,
            tooltip: '每秒在地上恢复的能量值'
        },

        jumpEnergyCost: {
            default: 0.25,
            tooltip: '每次跳跃消耗能量值'
        },

        energyBar: cc.ProgressBar,
        // 无敌状态
        invincible: false,
        invincibleTime: 3,
        // scene speed
        invincibleSpeed: -600,
        normalSpeed: -300,
        _energy: 0
    },
    //-- 初始化
    onLoad: function () {
        this.anim = this.getComponent(cc.Animation);
        this.currentSpeed = 0;
        // listener to touch start 
        this._canvas = cc.find('Canvas');

        //-- 添加绵羊控制事件(为了注销事件缓存事件)
        this.registeInput();
        this._energy = 1;

        // enter invincible state
        this._bindedScheduleFunc = () => {
            this.exitInvincible();
        };

        this.state = State.Run;
    },

    registeInput () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, () => {
            this.jump();
        });
        
        this._canvas.on(cc.Node.EventType.TOUCH_START, () => {
            this.jump();
        });
    },

    cancelInput () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN);
        this._canvas.off(cc.Node.EventType.TOUCH_START);
    },

    enableInput (enable) {
        if (enable) {
            this.registeInput();
        }
        else {
            this.cancelInput();
        }
    },

    //-- 更新
    update: function (dt) {
        this._updateState(dt);
    },

    onCollisionEnter (other) {
        if (this.state !== State.Dead) {
            let group = cc.game.groupList[other.node.groupIndex];
            switch (group) {
                case 'Obstacle':
                case 'Driller':
                    // gameOver
                    cc.log('Collision');
                    break;
                case 'NextPipe': 
                    // go through the pipe
                    cc.log('NextPipe');
                    break;
                case 'Star':
                    // add score
                    break;
                default: 
                    break;
            }
        }
    },

    //-- 更新绵羊状态
    _updateState: function (dt) {
        switch (this.state) {
            case Sheep.State.Jump:
                if (this.currentSpeed < 0) {
                    this.state = State.Drop;
                }
                break;
            case Sheep.State.Drop:
                if (this.node.y <= this.groundY) {
                    this.node.y = this.groundY;
                    this.state = State.DropEnd;
                    this.spawnDust('DustDown');
                }
                break;
            case Sheep.State.DropEnd:
                if (this.anim.currentClip.name === 'DropEnd' && !this.anim.getAnimationState('DropEnd').isPlaying) {
                    this.state = State.Run;
                }
                break
            case Sheep.State.Dead: 
                break;
            default:
                break;
        }
        let flying = this.state === State.Jump || this.node.y > this.groundY;

        if (flying) {
            this.currentSpeed -= dt * this.gravity;
            this.node.y += dt * this.currentSpeed;
        }
        else {
            this._energy += this.addEnergyOnGroup * dt;
        }

        // update energy
        this._energy = cc.misc.clamp01(this._energy);
        this.energyBar.progress = this._energy;
    },

    //-- 更新绵羊动画
    _updateAnimation: function () {
        let animName = State[this._state];
        // temp
        this.anim.stop();
        this.anim.play(animName);
    },

    // Invincible 
    enterInvincible () {

    },

    exitInvincible () {

    },

    //-- 开始跳跃设置状态数据，播放动画
    jump: function () {
        if (this._energy >= this.jumpEnergyCost) {
            this._energy -= this.jumpEnergyCost;

            this.state = State.Jump;
            this.currentSpeed = this.initJumpSpeed;
            // play the dust animation
            if (this.node.y <= this.groundY)
                this.spawnDust('DustUp');
            // play audio effect
            cc.audioEngine.playEffect(this.jumpAudio);
        }
        else {
            // play the refuse audio effect
            //cc.audioEngine.playEffect(D.game.dieAudio);
        }
    },

    spawnDust (animName) {
        let dust = cc.instantiate(this.dustPrefab).getComponent(Dust);
        dust.node.parent = this.node;
        dust.playAnim(animName);
    }
});

Sheep.State = State;
