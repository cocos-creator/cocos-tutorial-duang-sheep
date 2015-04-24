# 新手教程：创建障碍物

## 本章任务
- 在`Game`场景中动态创建障碍物

---

## 详细步骤

### 创建障碍物模板

在`Hierarchy`视图中创建2个物体`Template`和`PipeGroup`，然后将`PipeGroup`拖拽到`Template`上，成为它的子物体。

在`Asset`视图里找到`sprites/background/pipe`图片资源，拖拽到`Hierarchy`视图中的`Template/PipeGroup`物体上，展开`PipeGroup`，可以看到我们新添加了一个子物体`pipe`。

右键点击`pipe`，选择`Duplicate`复出一个新的子物体，将两个子物体命名为`topPipe`和`bottomPipe`，并分别按照下图设置所有新建物体的`Transform`组件属性。


**Template 示例图:**

![000](https://cloud.githubusercontent.com/assets/7564028/6843785/03c63d12-d3e1-11e4-88b8-789dd2f0ae3f.png)

**PipeGroup 示例图:** (NOTE:为了让PipeGroup对象不显示在Game屏幕中设置它的X轴)

![001](https://cloud.githubusercontent.com/assets/7564028/6843962/af1fed88-d3e2-11e4-9c73-3212640a011b.png)

**topPipe 示例图:** (NOTE调整Y轴是为了设置2个水管的距离)

![002](https://cloud.githubusercontent.com/assets/7564028/6843963/b2d67b4a-d3e2-11e4-95a4-2b8b1e217bf8.png)

**bottomPipe 示例图:** (NOTE:调整Y轴是为了设置2个水管的距离 调整Scale的Y是为了做镜像翻转)

![003](https://cloud.githubusercontent.com/assets/7564028/6843964/b54cb254-d3e2-11e4-80ad-99f900f52c36.png)

**最终示例图:**

![004](https://cloud.githubusercontent.com/assets/7564028/6843936/59b380f8-d3e2-11e4-9d73-0c3f654a6efd.png)



### 障碍物行为脚本

在`assets/script`文件夹下，新建一个名叫`PipeGroup`的脚本，我们会在该脚本添加初始化`topPipe`与`bottomPipe`之间的距离、根据屏幕卷动控制障碍物沿X轴移动、以及移动超出屏幕边界时销毁自身的功能。

为脚本添加下面的代码，然后拖拽该脚本到`Hierarchy`视图中的`PipeGroup`物体上。

```js
var PipeGroup = Fire.Class({
// 继承
extends: Fire.Component,
// 构造函数
constructor: function () {
    // 管道的宽度
    this.width = 0;
},
// 属性
properties: {
    // 基础移动速度
    speed: 200,
    // 超出这个范围就会被销毁
    minX: -900,
    // 上方管子坐标范围 Min 与 Max
    topPosRange: {
        default: new Fire.Vec2(100, 160)
    },
    // 上方与下方管道的间距 Min 与 Max
    spacingRange: {
      default: new Fire.Vec2(210, 230)
    }
},
// 初始化
onEnable: function () {
    var topYpos = Math.randomRange(this.topPosRange.x, this.topPosRange.y);
    var randomSpacing = Math.randomRange(this.spacingRange.x, this.spacingRange.y);
    var bottomYpos = topYpos - randomSpacing;

    var topEntity = this.entity.find('topPipe');
    topEntity.transform.y = topYpos;

    var bottomEntity = this.entity.find('bottomPipe');
    bottomEntity.transform.y = bottomYpos;

    var bottomPipeRenderer = bottomEntity.getComponent(Fire.SpriteRenderer);
    this.width = bottomPipeRenderer.sprite.width;
},
// 更新
update: function () {
    this.transform.x -= Fire.Time.deltaTime * this.speed;
    if (this.transform.x < this.minX) {
        this.entity.destroy();
    }
}
});

```

**PipeGroup 示例图:**

![005](https://cloud.githubusercontent.com/assets/7564028/6844160/7ad5aa5c-d3e4-11e4-8208-c88ed5ca337a.png)


### 障碍物生成器

最后我们需要在同样位置创建一个控制`PipeGroup`在游戏运行时动态生成的脚本，命名为`PipeGroupManager`。该脚本会根据游戏开始后经过的时间来生成`PipeGroup`的克隆物体。

为该脚本添加下面的内容，并在`Hierarchy`中创建一个名叫`PipeGroupManager`的物体，并拖拽该脚本到这个物体上。

**下方是脚本实现:**
```js
var PipeGroupManager = Fire.Class({
// 继承
extends: Fire.Component,
// 构造函数
constructor: function () {
    // 上一次创建PipeGroup的时间
    this.lastTime = 0;
},
// 属性
properties: {
    // 获取PipeGroup模板
    srcPipeGroup: {
        default: null,
        type: Fire.Entity
    },
    // PipeGroup初始坐标
    initPipeGroupPos: {
        default: new Fire.Vec2(600, 0)
    },
    // 创建PipeGroup需要的时间
    spawnInterval: 3
},
// 初始化
onLoad: function () {
    this.lastTime = Fire.Time.time + 10;
},
// 创建管道组
createPipeGroupEntity: function () {
    var pipeGroup = Fire.instantiate(this.srcPipeGroup);
    pipeGroup.parent = this.entity;
    pipeGroup.transform.position = this.initPipeGroupPos;
    pipeGroup.active = true;
},
// 更新
update: function () {
    // 每过一段时间创建障碍物
    var idleTime = Math.abs(Fire.Time.time - this.lastTime);
    if (idleTime >= this.spawnInterval) {
        this.lastTime = Fire.Time.time;
        this.createPipeGroupEntity();
    }
}
});
```

参考[通过 Inspector 访问其他对象](/manual/scripting/component/access/#访问其它对象)的文档，将`PipeGroup`物体拖拽到`PipeGroupManager`组件中的`Src Pipe Group`属性上，完成属性引用。


**PipeGroupManager 示例图:**

![006](https://cloud.githubusercontent.com/assets/7564028/6844364/0ef1b4a0-d3e6-11e4-93e6-58d060b9a6b5.png)

### 运行查看效果

最后可以点击运行按钮在`Game`视图看到结果

**最终效果示例图:**

![007](https://cloud.githubusercontent.com/assets/7564028/6844397/4fac07f2-d3e6-11e4-85bf-5b66604a3204.png)

---

**NOTE:** [ Step - 3 创建障碍物快照传送门](https://github.com/fireball-x/tutorial/commits/step-3)
