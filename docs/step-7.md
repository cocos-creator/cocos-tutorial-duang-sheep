# 添加音效

## 需要完成的任务:
- 添加游戏添加背景音效
- 添加绵羊音效
- 添加失败与绵羊死亡音效

--

## 详细步骤:

   1. `Hierarchy视图`创建一个名为:Audio的对象,然后通过拖`Asset视图`中的`musics`文件夹下的所有音效到该对象中来创建
   挂着AudioSource组件的对象.

   **示例图:**

     ![000](https://cloud.githubusercontent.com/assets/7564028/6865382/268578a0-d4a8-11e4-9490-d550232862ca.png)
   
   ----
   
   2. 由于背景音乐一开始就是播放的,并且是循环的,所有可以选中`Hierarchy视图`中 gameBg音效勾选PlayOnAwake与loop来实现该效果

    **gameBg 属性示例图:**

     ![001](https://cloud.githubusercontent.com/assets/7564028/6865439/bf79ae1e-d4a8-11e4-98ff-d7d6e2f9d7c5.png)
   
   ----
    
   3. 更新Sheep脚本,添加一个jumpAuido属性变量,保存跳跃音效,并在跳跃事件中执行`play()`来播放音效

   **NOTE:`.....`为之前脚本,无需变动

   ```js
    // 绵羊状态
    // 绵羊状态
    var State = Fire.defineEnum({.....});

    var Sheep = Fire.Class({
        // 继承
        extends: Fire.Component,
        // 构造函数
        constructor: function () {.....},
        // 属性
        properties: {
            .....
            // 获取Jump音效
            jumpAudio: {
                default: null,
                type: Fire.AudioSource
            }
        },
        // 初始化
        onLoad: function () {.....},
        // 删除
        onDestroy: function () {.....},
        // 更新
        update: function () {.....},
        // 更新绵羊状态
        _updateState: function () {.....},
        // 更新绵羊坐标
        _updateTransform: function () {.....},
        // 开始跳跃设置状态数据，播放动画
        _jump: function () {
            .....

            // 播放跳音效
            this.jumpAudio.stop();
            this.jumpAudio.play();
        }
    });

    Sheep.State = State;
   ```
   
   ----
   
   4. 更新GameManager脚本,添加背景、失败、死亡、得分的音效,通用的进行`play()`播放音效

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
              // 获取背景音效
              gameBgAudio: {
                  default: null,
                  type: Fire.AudioSource
              },
              // 获取死亡音效
              dieAudio: {
                  default: null,
                  type: Fire.AudioSource
              },
              // 获取失败音效
              gameOverAudio: {
                  default: null,
                  type: Fire.AudioSource
              },
              // 获取得分音效
              scoreAudio: {
                  default: null,
                  type: Fire.AudioSource
              }
          },
          // 开始
          start: function () {..... },
          // 更新
          update: function () {
              switch (this.gameState) {
                  case GameState.Run:
                      .....
                      if (gameOver) {
                          // 背景音效停止，死亡音效播放
                          this.gameBgAudio.stop();
                          this.dieAudio.play();
                          this.gameOverAudio.play();

                          .....
                      }
                      .....
                      break;
                  default :
                      break;
              }
          },
          // 更新分数
          updateSorce: function () {
              .....
              if (nextPipeGroup) {
                 .....
                  if (crossed) {
                    .....
                      // 分数增加音效
                      this.scoreAudio.play();
                  }
              }
          }
      });
   ```
   
   ----
   
   5. 运行游戏即可
    
    ----
   
  **NOTE:** [ step - 7 添加音效 git commit 传送门](https://github.com/fireball-x/tutorial/commits/step-7)
