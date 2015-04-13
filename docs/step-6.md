# 添加分数计算

## 需要完成的任务:
- 当绵羊通过障碍物时增加分数

--

## 详细步骤:

   1. 拖放`Asset视图`中的`fonts/number1`文件到`Hierarchy视图`中创建一个包含BitmapText组件的对象来显示分数,该对象命名为:`Score`;

   **示例图:**

   ![000](https://cloud.githubusercontent.com/assets/7564028/6865000/0eff3c74-d4a4-11e4-8aaf-c5a4fb4f8f35.png)

   **PS:如果在Game视图中无法看到字体的话可以尝试把`number1纹理`拖到`number1`BitmapFont属性中Texture中重新添加一次**

   ![001](https://cloud.githubusercontent.com/assets/7564028/6865002/11d508c0-d4a4-11e4-83c4-b7b3429e978f.png)

   ----

   2. 更新PipeGrop,添加标记,为了记录障碍物是否被越过,以及缓存下方障碍物的renderer做判断绵羊是否越过障碍物

   **NOTE:`.....`为之前的脚本不变,无需变动**
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
   
   ----
   
   3. 更新PipeGroupManger,添加获取离绵羊最近未通过的障碍物函数,以及标记障碍物为已越过.

   **NOTE:`.....`为之前的脚本不变,无需变动**
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
   
   ----
   
   4. 更新GameManager脚本, 获取Score对象,然后根据绵羊是否越过障碍物进行添加分数

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
                    this.scoreText.text = this.score;
                    this.pipeGroupMgr.setAsPassed(nextPipeGroup);
                }
            }
        }
   });
   ```
    
    ----
    
   **最终效果示例图:**

     ![002](https://cloud.githubusercontent.com/assets/7564028/6865247/cf548e28-d4a6-11e4-97b3-bb50a43c37b7.png)
    
   ----
   
  **NOTE:** [ step - 6 添加分数计算 git commit 传送门](https://github.com/fireball-x/tutorial/commits/step-6)
