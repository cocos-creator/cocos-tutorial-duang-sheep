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
        _energy: 0,

        // temp prop
        GameManager: cc.Node
    },
    statics: {
        State: State
    },

    //-- 初始化
    init: function () {
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
        this.getManagerCtrl();
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
            this.registeInput()
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
                    if (this.GameManager.getComponent('GameManager').supermanMode) {
                        return;
                    }
                    if (this.invincible) {
                        return;
                    }
                    // 触碰障碍
                    this.GameManager.getComponent('GameManager').gameOver();
                    this.state = State.Dead;
                    this.enableInput(false);
                    break;
                case 'NextPipe': 
                    // 穿过障碍
                    this.GameManager.getComponent('GameManager').gainScore();
                    break;
                case 'Star':
                    // 进入无敌状态
                    this.enterInvincible();
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
                break;
            case Sheep.State.Dead:
                return;
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

    //-- 更新绵羊播放动画
    _updateAnimation: function () {
        let animName = State[this._state];
        if (this.invincible) {
            let invincibleAnimName = 'Run_invincible';
            var hasInvincibleAnim = this.anim.getAnimationState(invincibleAnimName);
            if (!hasInvincibleAnim) {
                cc.error('Lack of invincible animation');
            }
            animName = invincibleAnimName;
        }
        // temp
        this.anim.stop();
        this.anim.play(animName);
    },

    // Invincible 
    enterInvincible () {
        this.invincible = true;
        this._updateAnimation();
        this.unschedule(this._bindedScheduleFunc);
        var timeScale = this.invincibleSpeed / this.normalSpeed;
        // 提高场景内物体的移动速度
        this.increaseSceneSpeed();
        this.scheduleOnce(this._bindedScheduleFunc, this.invincibleTime * timeScale);
        // 无敌后，场景运行速度会加快，所以要把 scheduler 的速度也加快，这样才能保证水管的间距不变
        cc.director.getScheduler().setTimeScale(timeScale);
    },

    exitInvincible () {
        this.invincible = false;
        this._updateAnimation();
        // 还原场景内物体的移动速度
        this.slowDownSceneSpeed();
        // 还原之前的设置，场景运行速度会加快，所以要把 scheduler 的速度也加快，这样才能保证水管的间距不变
        cc.director.getScheduler().setTimeScale(1.0);
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
            cc.audioEngine.playEffect(this.GameManager.getComponent('GameManager').dieAudio);
        }
    },

    spawnDust (animName) {
        let dust = cc.instantiate(this.dustPrefab).getComponent(Dust);
        dust.node.parent = this.node;
        dust.playAnim(animName);
    },


    // temp method to change the stuff speed
    getManagerCtrl () {
        let gameManager = this.GameManager.getComponent('GameManager');
        this.starManager = gameManager.starManager.getComponent('StarManager');
        this.pipeManager = gameManager.pipeManager.getComponent('PipeGroupManager');
    },

    increaseSceneSpeed () {
        this.starManager.objectSpeed = this.invincibleSpeed;
        this.pipeManager.objectSpeed = this.invincibleSpeed;
    },

    slowDownSceneSpeed () {
        this.starManager.objectSpeed = this.normalSpeed;
        this.pipeManager.objectSpeed = this.normalSpeed;
    }
});