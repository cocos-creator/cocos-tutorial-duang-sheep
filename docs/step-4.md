# 新手教程：创建绵羊主角

## 本章任务
- 通过`SpriteAnimation`组件添加绵羊需要的几个动画
- 绵羊点击跳跃操作
- 绵羊状态的切换


## 详细步骤

### 设置绵羊动画剪辑

在`Asset`视图中创建`assets/animations`文件夹，然后鼠标右键点击`animations`文件夹后选择`Create/New Sprite Animation`来创建动画剪辑。我们用这样的方法创建5个动画剪辑资源，并将他们分别命名为：

- `Run`绵羊奔跑时的动画
- `Jump`绵羊起跳时的动画
- `Drop`绵羊下落时的动画
- `DropEnd`绵羊落地时的动画
- `Dead`绵羊撞到障碍物时的动画

然后点击每一个动画剪辑来设置动画帧，动画剪辑资源有以下属性：

- Wrap Mode ----- 动画播放模式
  - Default      只播放一次
  - One          与Default一样播放一次
  - Loop         循环播放
  - PingPong     来回播放
  - ClampForever 播放完毕后停在最后一帧

- Stop Action ---- 动画播放完以后触发的事件
  - DoNothing     什么都不做
  - DefaultSprite 展示默认的Sprite图片
  - Hide          隐藏物体
  - Destroy       销毁物体
- Speed --- 动画播放速度
- Frame Rate -- 动画帧率
- Frame Infos -- 每个动画帧的图片资源数据
  - FrameInfo
    - Sprite  图片
    - Frames  该图片会连续显示几帧

下面我们要做的，就是通过修改`Frame Infos`属性的`size`值，为每个动画剪辑设置正确的动画帧数量，然后将`Asset`视图中`sprites/sheep`里正确的图片资源拖拽到每个对应的`FrmeInfo`属性中。

**Run 动画剪辑Inspector视图示例图:**

![001](https://cloud.githubusercontent.com/assets/7564028/6844693/3462f6e8-d3e8-11e4-81d7-a30afbc005a1.png)

**Jump 动画剪辑Inspector视图示例图:**

![002](https://cloud.githubusercontent.com/assets/7564028/6844691/34523650-d3e8-11e4-8d4f-3e37312fe855.png)

**Drop 动画剪辑Inspector视图示例图:**

![003](https://cloud.githubusercontent.com/assets/7564028/6844690/3452255c-d3e8-11e4-9571-d9a09066df3b.png)

**DropEnd 动画剪辑Inspector视图示例图:**

![004](https://cloud.githubusercontent.com/assets/7564028/6844689/34520c3e-d3e8-11e4-9d7a-5d71d11d5ebe.png)

**Dead 动画剪辑Inspector视图示例图:**

![005](https://cloud.githubusercontent.com/assets/7564028/6844692/34543bda-d3e8-11e4-9e0e-cffae3484836.png)


### 添加 SpriteAnimation 组件

在`Hierarchy`视图中创建一个`Sheep`物体，选中该物体并点击`Inspector`视图右上角的`＋`按钮，分别添加一个`SpriteRenderer`组件和`SpriteAnimation`组件。

然后从`Assets`窗口中将`sprites/sheep/sheep_run_03`拖拽到`SpriteRenderer`组件中的`Sprite`属性上，作为绵羊物体在场景中的表示。

再选中`Sheep`物体，将`SpriteAnimation`组件的`Animations`的`size`设为`5`。然后将刚才创建的各个动画剪辑，拖拽到`Animations`属性列表中的各个成员中。如下图所示。

**下方是具体设置SpriteRender和SpriteAnimation的详细示例图:**

 ![005](https://cloud.githubusercontent.com/assets/7564028/6845001/eb17a59e-d3ea-11e4-9b8c-05bdf19542b9.png)


### 绵羊控制脚本

创建名为`Sheep`的脚本，该脚本将会实现：

- 接受玩家输入并控制绵羊行为
- 绵羊运动坐标的计算
- 动画的播放以及状态之间的切换

脚本建立完成后，添加下面的内容，然后挂到`Hierarchy`中的`Sheep`物体上。

**下方为脚本实现:**
```js
// 绵羊状态
var State = Fire.defineEnum({
    None   : -1,
    Run    : -1,
    Jump   : -1,
    Drop   : -1,
    DropEnd: -1,
    Dead   : -1
});

var Sheep = Fire.Class({
    // 继承
    extends: Fire.Component,
    // 构造函数
    constructor: function () {
        // 当前播放动画组件
        this.anim = null;
        // 当前速度
        this.currentSpeed = 0;
        // 跳跃事件
        this.jumpEvent = null;
    },
    // 属性
    properties: {
        // Y轴最大高度
        maxY: 250,
        // 地面高度
        groundY: -170,
        // 重力
        gravity: 9.8,
        // 起跳速度
        initSpeed: 500,
        // 绵羊状态
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
        }
    },
    // 初始化
    onLoad: function () {
        this.anim = this.getComponent(Fire.SpriteAnimation);

        // 添加绵羊控制事件(为了注销事件缓存事件)
        this.jumpEvent = function (event) {
            if (this.state !== State.Dead) {
                this._jump();
            }
        }.bind(this);
        Fire.Input.on('mousedown', this.jumpEvent);
    },
    // 删除
    onDestroy: function () {
        // 注销绵羊控制事件
        Fire.Input.off('mousedown', this.jumpEvent);
    },
    // 更新
    update: function () {
        this._updateState();
        this._updateTransform();
    },
    // 更新绵羊状态
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
    // 更新绵羊坐标
    _updateTransform: function () {
        var flying = this.state === Sheep.State.Jump || this.transform.y > this.groundY;
        if (flying) {
            this.currentSpeed -= (Fire.Time.deltaTime * 100) * this.gravity;
            this.transform.y += Fire.Time.deltaTime * this.currentSpeed;
        }
    },
    // 开始跳跃设置状态数据，播放动画
    _jump: function () {
        this.state = State.Jump;
        this.currentSpeed = this.initSpeed;
    }
});

Sheep.State = State;
```

### 运行查看效果

最后可以点击运行按钮在`Game`视图看到结果。

**最终效果示例图:**

![006](https://cloud.githubusercontent.com/assets/7564028/6864237/7847f050-d499-11e4-8385-650907a360e3.png)

---

**NOTE:** [ Step - 3 创建绵羊主角快照传送门](https://github.com/fireball-x/tutorial/commits/step-4)
