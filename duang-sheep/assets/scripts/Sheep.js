//-- 绵羊状态
var State = Fire.defineEnum({
    None   : -1,
    Run    : -1,
    Jump   : -1,
    Drop   : -1,
    DropEnd: -1,
    Dead   : -1
});

var Sheep = Fire.Class({
    //-- 继承
    extends: Fire.Component,
    //-- 构造函数
    constructor: function () {
        //-- 当前播放动画组件
        this.anim = null;
        //-- 当前速度
        this.currentSpeed = 0;
        //-- 绵羊图片渲染
        this.renderer = null;
        //-- 跳跃事件
        this.jumpEvent = null;
    },
    //-- 属性
    properties: {
        //-- Y轴最大高度
        maxY: 250,
        //-- 地面高度
        groundY: -170,
        //-- 重力
        gravity: 9.8,
        //-- 起跳速度
        initSpeed: 500,
        //-- 绵羊状态
        _state: {
            default: State.Run,
            type: State,
            hideInInspector: true
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
                        this.anim.play(animName);
                    }
                }
            },
            type: State
        },
        //-- 获取Jump音效
        jumpAudio: {
            default: null,
            type: Fire.AudioSource
        }
    },
    //-- 初始化
    onLoad: function () {
        this.anim = this.getComponent(Fire.SpriteAnimation);
        this.renderer = this.getComponent(Fire.SpriteRenderer);

        //-- 添加绵羊控制事件(为了注销事件缓存事件)
        this.jumpEvent = function (event) {
            if (this.state !== State.Dead) {
                this._jump();
            }
        }.bind(this);
        Fire.Input.on('mousedown', this.jumpEvent);
    },
    //-- 删除
    onDestroy: function () {
        //-- 注销绵羊控制事件
        Fire.Input.off('mousedown', this.jumpEvent);
    },
    //-- 更新
    update: function () {
        this._updateState();
        this._updateTransform();
    },
    //-- 更新绵羊状态
    _updateState: function () {
        switch (this.state) {
            case Sheep.State.Jump:
                if (this.currentSpeed < 0) {
                    this.state = State.Drop;
                }
                break;
            case Sheep.State.Drop:
                if (this.transform.y <= this.groundY) {
                    this.transform.y = this.groundY;
                    this.state = State.DropEnd;
                }
                break;
            case Sheep.State.DropEnd:
                if (!this.anim.isPlaying('dropEnd')) {
                    this.state = State.Run;
                }
                break
            default:
                break;
        }
    },
    //-- 更新绵羊坐标
    _updateTransform: function () {
        var flying = this.state === Sheep.State.Jump || this.transform.y > this.groundY;
        if (flying) {
            this.currentSpeed -= (Fire.Time.deltaTime * 100) * this.gravity;
            this.transform.y += Fire.Time.deltaTime * this.currentSpeed;
        }
    },
    //-- 开始跳跃设置状态数据，播放动画
    _jump: function () {
        this.state = State.Jump;
        this.currentSpeed = this.initSpeed;

        //-- 播放跳音效
        this.jumpAudio.stop();
        this.jumpAudio.play();
    }
});

Sheep.State = State;
