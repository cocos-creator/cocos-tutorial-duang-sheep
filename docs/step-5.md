# 添加实现碰撞机制-失败界面-重新游戏

## 需要完成的任务: 
- 添加绵羊与障碍物的碰撞
- 当绵羊碰撞到障碍物时弹出是失败窗口
- 让游戏能够循环一体.

--

## 详细步骤:

   1. 需要更新PipeGroupManager脚本,新添加了一个函数为collisionDetection,用来进行碰撞检测,以及pipeGroupList属性用来获取
   已经生产出来PipeGroup对象.
   
   下方为更新后PipeGroupManager脚本:
   
   **NOTE: `.....`表示脚本还是原来的样子无需变动.**
   ```js
   var PipeGroupManager = Fire.Class({
      // 继承
      extends: Fire.Component,
      // 构造函数
      constructor: function () {
         .....
      },
      // 属性
      properties: {
          .....
          // 管道列表
          pipeGroupList: {
             get: function () {
                 return this.entity.getChildren();
             },
             hideInInspector: true
            }
        },
        .....
        // 创建管道组
        createPipeGroupEntity: function () {
            var pipeGroup = Fire.instantiate(this.srcPipeGroup);
            pipeGroup.parent = this.entity;
            pipeGroup.transform.position = this.initPipeGroupPos;
            pipeGroup.active = true;
        },
        // 碰撞检测
        collisionDetection: function (sheepRect) {
            for (var i = 0; i < this.pipeGroupList.length; ++i) {
                // 上方障碍物
                var pipeGroupEntity = this.pipeGroupList[i];
                var pipe = pipeGroupEntity.find('topPipe');
                var pipeRender = pipe.getComponent(Fire.SpriteRenderer)
                var pipeRect = pipeRender.getWorldBounds();
    
                if (Fire.Intersection.rectRect(sheepRect, pipeRect)) {
                    return true;
                }
    
                // 下方障碍物
                pipe = pipeGroupEntity.find('bottomPipe');
                pipeRender = pipe.getComponent(Fire.SpriteRenderer);
                pipeRect = pipeRender.getWorldBounds();
    
                if (Fire.Intersection.rectRect(sheepRect, pipeRect)) {
                    return true;
                }
            }
            return false;
        },
      .....
    });
  ```
  
   ----
  
   2. 需要在Sheep脚本中储存一个renderer变量,用于碰撞机制.
    
   **下方为Sheep更新后的脚本:**
  **NOTE: `.....`表示脚本还是原来的样子无需变动**
   ```js
   // 绵羊状态
   var State = Fire.defineEnum({...});
    
   var Sheep = Fire.Class({
        // 继承
        extends: Fire.Component,
        // 构造函数
        constructor: function () {
            .....
            // 绵羊图片渲染
            this.renderer = null;
            .....
        },
        // 属性
        properties: {....},
        // 初始化
        onLoad: function () {
            .....
            this.renderer = this.getComponent(Fire.SpriteRenderer);
            .....
          },
        .....
   });
    
   Sheep.State = State;
   ```
   
   ----
   
   3. 创建游戏失败窗口,我们利用Asset视图中的`sprites\ui`文件夹下的资源,在Hrearchy视图中拼出一个叫GameOver对象.
   作为游戏失败窗口,该对象包含了一个按钮, 失败图标.最后点击打钩![001](https://cloud.githubusercontent.com/assets/7564028/6864833/80d6e0ca-d4a1-11e4-88e3-05d0de382a9e.png)
   隐藏窗口
   

   **下方是GameOver对象效果示例图:**
   
     ![000](https://cloud.githubusercontent.com/assets/7564028/6864748/8a9e57ec-d4a0-11e4-970a-21bcb3b182c1.png)
   
   ----
   
   4. 创建GameOverMenu脚本,该脚本让游戏失败窗口里面的按钮绑定事件,点击按钮即可重新开始游戏,
   
   **下方是GameOverMenu脚本:**
   ```js
   var GameOverMenu = Fire.Class({
      // 继承
      extends: Fire.Component,
      // 构造函数
      constructor: function () {
          // 重新开始事件
          this.resetGameEvent = null;
      },
      // 属性
      properties: {
          // 获取绵羊
          btn_play: {
              default: null,
              type: Fire.Entity
          }
      },
      // 开始
      onStart: function () {
          // 注册重新开始事件
          this.resetGameEvent = function (event) {
              Fire.Engine.loadScene('Game');
          }.bind(this);
          this.btn_play.on('mousedown', this.resetGameEvent);
      },
      // 删除
      onDestroy: function () {
          // 注销重新开始事件
          this.btn_play.off('mousedown', this.resetGameEvent);
      }
    });
   ```
   
   ----
   
   5. 当我们做完以上工作以后，我们需要在建立一个GameManager脚本,把这些都串联起来.
   
   **以下GameManager脚本:**
   
   ```js
   var Sheep = require('Sheep');
   var ScrollPicture = require('ScrollPicture');
   var PipeGroupManager = require('PipeGroupManager');
    
    var GameState = Fire.defineEnum({
       Run : -1,
       Over: -1
   });
    
   var GameManager = Fire.Class({
       // 继承
       extends: Fire.Component,
       // 构造函数
       constructor: function () {
           // 游戏状态
           this.gameState = GameState.Run
       },
       // 属性
       properties: {
           // 获取绵羊
           sheep: {
               default: null,
               type: Sheep
           },
           // 获取背景
           background: {
               default: null,
               type: ScrollPicture
           },
           // 获取地面
           ground: {
               default: null,
               type: ScrollPicture
           },
           // 获取障碍物管理
           pipeGroupMgr: {
               default: null,
               type: PipeGroupManager
           },
           // 获取gameOverMenu对象
           gameOverMenu: {
               default: null,
               type: Fire.Entity
           }
       },
       // 开始
       onStart: function () {
           this.gameState = GameState.Run;
       },
       // 更新
       update: function () {
           switch (this.gameState) {
               case GameState.Run:
                   // 获取绵羊的边界,然后传入进行做碰撞检测
                   var sheepRect = this.sheep.renderer.getWorldBounds();
                   var gameOver = this.pipeGroupMgr.collisionDetection(sheepRect);
                   // 如果碰撞即为GameOver
                   if (gameOver) {
                       // 切换游戏与绵羊状态并且通过enabled来关闭场景元素的update
                       this.gameState = GameState.Over;
                       this.sheep.state = Sheep.State.Dead;
                       this.ground.enabled = false;
                       this.background.enabled = false;
                       for (var i = 0; i < this.pipeGroupMgr.pipeGroupList.length; ++i) {
                           var pipeGroup = this.pipeGroupMgr.pipeGroupList[i].getComponent('PipeGroup');
                           pipeGroup.enabled = false;
                       }
                       this.pipeGroupMgr.enabled = false;
                       // 通过avtive打开gameover窗口
                       this.gameOverMenu.active = true;
                   }
                   break;
               default :
                   break;
           }
       }
   });
   ```
    ----
    
   **最终效果示例图:**
   
     ![002](https://cloud.githubusercontent.com/assets/7564028/6864920/df1f73da-d4a2-11e4-9c02-e12597cfa1dc.png)
   
   ----
   
  **NOTE:** [ step - 5 添加碰撞机制-失败界面-重新游戏 git commit 传送门](https://github.com/fireball-x/tutorial/commits/step-5)
