# 新手教程：添加分数文字

## 本章任务
- 当绵羊通过障碍物时增加分数
- 位图字体的使用

---

## 详细步骤

### 创建位图字体

拖放`Assets`中的`fonts/number1`资源文件到`Hierarchy`视图中，创建一个包含`BitmapText`位图字体组件的物体来显示分数，将该物体改名为`Score`。并把`BitmapText`组件中的`Text`属性值改为`0`。

**示例图:**

![000](https://cloud.githubusercontent.com/assets/7564028/6865000/0eff3c74-d4a4-11e4-8aaf-c5a4fb4f8f35.png)

**PS:如果在Game视图中无法看到字体的话可以尝试把`number1`图片资源拖到`number1`BitmapFont属性中Texture中重新添加一次**

![001](https://cloud.githubusercontent.com/assets/7564028/6865002/11d508c0-d4a4-11e4-83c4-b7b3429e978f.png)


### 标记通过的障碍物

编辑`PipeGroup`脚本，添加记录障碍物是否已被通过的标记`passed`，并将绵羊即将跳过的下方障碍物保存在`bottomRenderer`属性中。

**NOTE:`.....`表示的脚本内容不变，无需改动**

```js
var PipeGroup = Fire.Class({
  // 继承
  extends: Fire.Component,
  // 构造函数
  constructor: function () {
      // 保存下方管道的Renderer,方便获得水平边界
      this.bottomRenderer = null;
      // 是否已经被通过
      this.passed = false;
  },
  // 属性
  properties: {.....},
  // 初始化
  onEnable: function () {
      .....

      this.bottomRenderer = bottomEntity.getComponent(Fire.SpriteRenderer);
      this.passed = false;
  },
  // 更新
  update: function () {.....}
});
```


编辑`PipeGroupManger`脚本，添加获取距离绵羊最近的未通过障碍物函数，并在绵羊成功跳过时更改障碍物的`passed`属性。

**NOTE:`.....`表示的脚本内容不变，无需更改**

```js
var PipeGroupManager = Fire.Class({
  // 继承
  extends: Fire.Component,
  // 构造函数
  constructor: function () {.....},
  // 属性
  properties: {.....},
  // 初始化
  onLoad: function () {.....},
  // 创建管道组
  createPipeGroupEntity: function () {.....},
  // 获取下个未通过的水管
  getNext: function () {
      for (var i = 0; i < this.pipeGroupList.length; ++i) {
          var pipeGroupEntity = this.pipeGroupList[i];
          var pipeGroup = pipeGroupEntity.getComponent('PipeGroup');
          if (!pipeGroup.passed) {
              return pipeGroup;
          }
      }
      return null;
  },
  // 标记已通过的水管
  setAsPassed: function (pipeGroup) {
      pipeGroup.passed = true;
  },
  // 碰撞检测
  collisionDetection: function (sheepRect) {.....},
  // 更新
  update: function () {.....}
});
```

### 添加得分和分数更新

编辑`GameManager`脚本，为`GameManager`添加一个`scoreText`属性，并把刚才创建的`Score`物体拖拽到这个属性上。然后添加绵羊越过障碍物时为玩家增加分数的逻辑。

**NOTE:`.....`为之前的脚本不变,无需变动**
```js
var Sheep = require('Sheep');
var ScrollPicture = require('ScrollPicture');
var PipeGroupManager = require('PipeGroupManager');

var GameState = Fire.defineEnum({.....});

var GameManager = Fire.Class({
    // 继承
    extends: Fire.Component,
    // 构造函数
    constructor: function () {.....},
    // 属性
    properties: {
        .....
        // 获取分数对象
        scoreText: {
            default: null,
            type: Fire.BitmapText
        }
    },
    // 开始
    start: function () {
        .....
        this.score = 0;
        this.scoreText.text = this.score;
    },
    // 更新
    update: function () {
        switch (this.gameState) {
            case GameState.Run:
                .....
                // 计算分数
                this.updateSorce();
                break;
            default :
                break;
        }
    },
    // 更新分数
    updateSorce: function () {
        var nextPipeGroup = this.pipeGroupMgr.getNext();
        if (nextPipeGroup) {
            var sheepRect = this.sheep.renderer.getWorldBounds();
            var pipeGroupRect = nextPipeGroup.bottomRenderer.getWorldBounds();
            // 当绵羊的右边坐标越过水管右侧坐标
            var crossed = sheepRect.xMin > pipeGroupRect.xMax;
            if (crossed) {
                // 分数+1
                this.score++;
                // 更新位图字体组件的 text 属性
                this.scoreText.text = this.score;
                this.pipeGroupMgr.setAsPassed(nextPipeGroup);
            }
        }
    }
});
```

**最终效果示例图:**

![002](https://cloud.githubusercontent.com/assets/7564028/6865247/cf548e28-d4a6-11e4-97b3-bb50a43c37b7.png)

----

**NOTE:** [ Step - 6 添加分数文字快照传送门](https://github.com/fireball-x/tutorial/commits/step-6)
