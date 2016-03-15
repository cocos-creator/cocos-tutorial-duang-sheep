# 新手教程：添加音效

## 本章任务

- 添加游戏背景音乐
- 添加绵羊音效
- 添加失败与绵羊死亡音效


## 详细步骤

### 添加音源物体

在`Hierarchy`中创建一个名为`Audios`的物体，然后选中`Assets`视图中`musics`文件夹下所有音效资源文件，拖拽到`Audio`物体上，每个资源都会生成一个含有`AudioSource`组件的子物体。

`AudioSource` 是 Fireball 中用来播放声音的音源组件。每个音源组件会默认播放`Clip`属性中对应的音效资源。

**示例图:**

 ![000](https://cloud.githubusercontent.com/assets/7564028/6865382/268578a0-d4a8-11e4-9490-d550232862ca.png)


### 设置背景音乐

我们希望在游戏一运行就会自动播放背景音乐，并且循环。选中`Hierarchy`视图中`Audios/gameBg`物体，并勾选`Fire.AudioSource`组件中的`Loop`和`Play On Load`属性复选框。

**gameBg 属性示例图:**

 ![001](https://cloud.githubusercontent.com/assets/7564028/6865439/bf79ae1e-d4a8-11e4-98ff-d7d6e2f9d7c5.png)

### 在脚本中添加跳跃音效

编辑`Sheep`脚本，添加一个`jumpAuido`的属性，并在跳跃事件中执行`play()`来播放这个音效。

**NOTE:`.....` 为之前脚本,无需变动**

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

更新脚本后，要把`Audios/jump`物体拖拽到`Sheep`组件中的`Jump Audio`属性上。

### 添加其他音效

更新GameManager脚本,添加下列属性：

- `gameBgAudio` 游戏背景音乐
- `dieAudio` 绵羊撞到障碍物的音效
- `gameOverAudio` 游戏结束时的音效
- `scoreAudio` 得分时播放的音效

这些属性中的音效剪辑都通过`play()`方法来播放。

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

更新脚本后，把`Audios`物体下的`gameBg`、`die`、`gameOver`、`score`分别拖拽到`GameManager`组件的`Game Bg Audio`、`Die Audio`、`Game Over Audio`、`Score Audio`属性上。如图所示：

![audios](https://cloud.githubusercontent.com/assets/344547/7317355/a2ef24fc-eab2-11e4-90ee-7210900905f5.png)


## 总结

这时候点击`Game`视图上的运行按钮，就可以查看最终完成的效果了！尽管现在还是一个很简单的游戏，但你可以在这个基础上添加更多种类的障碍物，加入更多效果，发挥想象力和创造力！

接下来你可以继续阅读 Fireball 用户手册的其他内容，我们会持续添加更多的新手教程和功能演示教程，敬请关注！

如果有任何问题，欢迎通过以下方式和我们联系反映：

- QQ群：246239860
- [开发者社区](http://forum.fireball-x.com)
- [Github Issue](https://github.com/fireball-x/fireball/issues)
- Support邮箱：support@fireball-x.com

----

**NOTE:** [ Step - 7 添加音效项目快照传送门](https://github.com/fireball-x/tutorial/commits/step-7)
