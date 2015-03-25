var Sheep = Fire.extend(Fire.Component, function () {
    //-- 当前播放动画组件
    this.anim = null;
    //-- 当前速度
    this.currentSpeed = 0;
    //-- 绵羊宽度
    this.width = 0;
    //-- 跳跃事件
    this.jumpEvent = null;
});

//-- 绵羊状态
Sheep.State = Fire.defineEnum({
    None   : -1,
    Run    : -1,
    Jump   : -1,
    Drop   : -1,
    DropEnd: -1,
    Dead   : -1
});

//-- Y轴最大高度
Sheep.prop('maxY', 250);

//-- 地面高度
Sheep.prop('groundY', -170);

//-- 重力
Sheep.prop('gravity', 9.8);

//-- 起跳速度
Sheep.prop('initSpeed', 500);

//-- 起跳速度
Sheep.prop('_state', Sheep.State.Run, Fire.Enum(Sheep.State), Fire.HideInInspector);
Sheep.getset('state',
    function () {
        return this._state;
    },
    function (value) {
        if (value !== this._state) {
            this._state = value;
            if (this._state !== Sheep.State.None) {
                var animName = Sheep.State[this._state];
                this.anim.play(animName);
            }
        }
    },
    Fire.Enum(Sheep.State)
);

Sheep.prototype.onLoad = function () {
    this.anim = this.getComponent(Fire.SpriteAnimation);
    var renderer = this.getComponent(Fire.SpriteRenderer);
    this.width = renderer.sprite.width;

    //-- 添加绵羊控制事件(为了注销事件缓存事件)
    this.jumpEvent = function (event) {
        this.jump();
    }.bind(this);
    Fire.Input.on('mousedown', this.jumpEvent);
};

Sheep.prototype.onDestroy = function () {
    //-- 注销绵羊控制事件
    Fire.Input.off('mousedown', this.jumpEvent);
}

//-- 开始跳跃设置状态数据，播放动画
Sheep.prototype.jump = function () {
    this.state = Sheep.State.Jump;
    this.currentSpeed = this.initSpeed;
};

//-- 更新绵羊状态
Sheep.prototype.updateState = function () {
    switch (this.state) {
        case Sheep.State.Jump:
            if (this.currentSpeed < 0) {
                this.state = Sheep.State.Drop;
            }
            break;
        case Sheep.State.Drop:
            if (this.transform.y <= this.groundY) {
                this.transform.y = this.groundY;
                this.state = Sheep.State.DropEnd;
            }
            break;
        case Sheep.State.DropEnd:
            if (!this.anim.isPlaying('dropEnd')) {
                this.state = Sheep.State.Run;
            }
            break
        default:
            break;
    }
};

//-- 更新绵羊坐标
Sheep.prototype.updateTransform = function () {
    var flying = this.state === Sheep.State.Jump || this.transform.y > this.groundY;
    if (flying) {
        this.currentSpeed -= (Fire.Time.deltaTime * 100) * this.gravity;
        this.transform.y += Fire.Time.deltaTime * this.currentSpeed;
    }
};

//-- 更新
Sheep.prototype.update = function () {
    this.updateState();
    this.updateTransform();
};
