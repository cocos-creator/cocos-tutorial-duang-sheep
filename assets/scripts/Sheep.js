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
            type: cc.AudioClip
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
        D.sheep = this;
        //-- 当前播放动画组件
        this.anim = this.getComponent(cc.Animation);
        //-- 当前速度
        this.currentSpeed = 0;
        //-- 绵羊图片渲染
        this.sprite = this.getComponent(cc.Sprite);
        this.registerInput();
        this.energy = 1;

        this._bindedScheduleFunc = () => {
            this.exitInvincible();
        };
    },
    startRun () {
        this.energy = 1;
        this.state = State.Run;
        this.enableInput(true);
    },
    //-- 初始化
    registerInput () {
        //-- 添加绵羊控制事件(为了注销事件缓存事件)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, () => {
            this.jump();
        }, this.node);
        // touch input
        cc.find('Canvas').on(cc.Node.EventType.TOUCH_START, () => {
            this.jump();
        }, this.node);
    },

    cancelListener () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN);
        cc.find('Canvas').off(cc.Node.EventType.TOUCH_START);
    },

    //-- 删除
    enableInput: function (enable) {
        if (enable) {
            this.registerInput();
        } else {
            this.cancelListener();
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
        this.energy = cc.misc.clamp01(this.energy);
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
            else {
                animName = 'Run_invincible';
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
                case 'Driller':
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
        this.unschedule(this._bindedScheduleFunc);
        var timeScale = this.invincibleSpeed / this.normalSpeed;
        this.scheduleOnce(this._bindedScheduleFunc, this.invincibleTime * timeScale);
        D.sceneManager.objectSpeed = this.invincibleSpeed;
        // 无敌后，场景运行速度会加快，所以要把 scheduler 的速度也加快，这样才能保证水管的间距不变
        cc.director.getScheduler().setTimeScale(timeScale);
    },

    exitInvincible () {
        D.sceneManager.objectSpeed = this.normalSpeed;
        this.invincible = false;
        this._updateAnimation();
        // 还原之前的设置，场景运行速度会加快，所以要把 scheduler 的速度也加快，这样才能保证水管的间距不变
        cc.director.getScheduler().setTimeScale(1.0);
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
        let dustType = 'Dust';
        let dust = D.sceneManager.spawn(this.dustPrefab, dustType, this.node);
        dust.node.position = cc.v2(0, 0);
        dust.playAnim(animName);
    }
});
