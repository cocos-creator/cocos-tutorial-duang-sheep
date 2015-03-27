# 创建角色 绵羊

## 需要完成的任务: 
- 通过引擎中的SpriteAnimation进行编辑绵羊需要的几个动画
- 绵羊点击跳跃操作
- 绵羊状态的切换

--

## 详细步骤:

   1. 在Asset视图中创建animations文件夹,然后通过右键鼠标点击`create/New Sprite Animation`来创建动画剪辑然后点击动画剪辑设置
   Inspector视图中的数据.图片资源在Asset视图中的`sprites/sheep`文件夹中.
     
     动画剪辑属性介绍：
       - Wrap Mode ----- 动画播放模式
          - Default      只播放一次
          - One          与Default一样播放一次
          - Loop         循环播放
          - PingPong     来回播放
          - ClampForever 播放完毕后停在最后一帧
          
       - Stop Action ---- 动画播放完以后需要做的事件
          - DoNothing     什么都不做
          - DefaultSprite 把Sprite变为默认的Sprite
          - Hide          隐藏对象
          - Destroy       删除对象
          
       - Speed --- 动画播放速度
       
       - Frame Rate -- 动画帧率
       
       - Frame Inofs -- 保存每帧动画数据
          - Sprite  图片
          - Frames  帧率
            
     **Dead 动画剪辑Inspector视图示例图:**
     
       ![000](https://cloud.githubusercontent.com/assets/7564028/6844692/34543bda-d3e8-11e4-9e0e-cffae3484836.png)
     
     **Drop 动画剪辑Inspector视图示例图:**
     
       ![001](https://cloud.githubusercontent.com/assets/7564028/6844690/3452255c-d3e8-11e4-9571-d9a09066df3b.png)
     
     **DropEnd 动画剪辑Inspector视图示例图:**
     
       ![002](https://cloud.githubusercontent.com/assets/7564028/6844689/34520c3e-d3e8-11e4-9d7a-5d71d11d5ebe.png)
     
     **Jump 动画剪辑Inspector视图示例图:**
     
       ![003](https://cloud.githubusercontent.com/assets/7564028/6844691/34523650-d3e8-11e4-8d4f-3e37312fe855.png)
     
     **Run 动画剪辑Inspector视图示例图:**
     
       ![004](https://cloud.githubusercontent.com/assets/7564028/6844693/3462f6e8-d3e8-11e4-81d7-a30afbc005a1.png)
     
   ----
     
   2. 在Hierarchy视图中创建一个Sheep对象后选中该对象,点击该对象的Inspector视图中`＋号`键添加SpriteRenderer和SpriteAnimation.
   并进行设置.
   
   **下方是具体设置SpriteRender和SpriteAnimation的详细示例图:**
    
     ![005](https://cloud.githubusercontent.com/assets/7564028/6845001/eb17a59e-d3ea-11e4-9b8c-05bdf19542b9.png) 
   
   ----
   
   3. 创建名为:Sheep的脚本,该脚本控制的是绵羊的控制,坐标的计算,动画的播放以及状态之间的切换.脚本建立完成后挂到`Hierarchy视图`中
   的Sheep对象上,运行游戏即可在游戏中点击鼠标控制绵羊的跳跃.
   
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
   
   ----
   
   **最终效果示例图:**
   
     ![006](https://cloud.githubusercontent.com/assets/7564028/6864237/7847f050-d499-11e4-8385-650907a360e3.png)
   
   ----
   
  **NOTE:** [ step - 4 创建绵羊 git commit 传送门](https://github.com/fireball-x/tutorial/commits/step-4)
