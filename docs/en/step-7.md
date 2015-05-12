title: Tutorial - Add Audio
categories: tutorial
permalinks: tutorial/duang-sheep/step7
---

## Goal

- Add BGM
- Add sfx (sound effect) for sheep jump
- Add sheep hit pipe and game over sfx


## Steps

### Create AudioSource

Create an entity named `Audios` in `Hierarchy`. This entity will hold all audios we are gonna play in game.

Select all audio assets in `musics` folder in `Assets` view, drag them onto `Audios` entity in `Hierarchy` view. Each audio assets will generate a child entity with `AudioSource` component. `AudioSource` is Fireball's audio play component, you can specify which audio asset to play by drag audio asset to its `Clip` property. We don't have to do this since we created entities by dragging assets to `Hierarchy` view, all `Clip` properties will be set automatically.

**Audios Setup**

 ![000](https://cloud.githubusercontent.com/assets/7564028/6865382/268578a0-d4a8-11e4-9490-d550232862ca.png)


### Set Auto Play and Loop BGM

We would like to play background music as game starts and loop forever. Select `Audios/gameBg` from `Hierarchy` view, check `Loop` and `Play on Load` property checkbox in `Fire.AudioSource` component.

**gameBg Setup**

 ![001](https://cloud.githubusercontent.com/assets/7564028/6865439/bf79ae1e-d4a8-11e4-98ff-d7d6e2f9d7c5.png)

### Add Jump SFX

Open `Sheep` script for editing. Add a `jumpAuido` property and use `play()` function to play it in jump event handler

**Sheep.js: `.....` are parts stay unchanged**

```js
// sheep state
var State = Fire.defineEnum({.....});

var Sheep = Fire.Class({
    extends: Fire.Component,
    constructor: function () {.....},
    properties: {
        .....
        // reference to AudioSource that play jump sfx
        jumpAudio: {
            default: null,
            type: Fire.AudioSource
        }
    },
    // initialization
    onLoad: function () {.....},
    // sheep destroy
    onDestroy: function () {.....},
    // update
    update: function () {.....},
    // state update
    _updateState: function () {.....},
    // position update
    _updateTransform: function () {.....},
    // action to take when jump event fires
    _jump: function () {
        .....

        // play jump sfx from AudioSource
        this.jumpAudio.stop();
        this.jumpAudio.play();
    }
});

Sheep.State = State;
```

Once finish editing, drag `Audios/jump` entity onto `Sheep` component's newly added `Jump Audio` property.

### Add Other SFX

Edit `GameManager` script by adding the following properties:

- `gameBgAudio`: background music
- `dieAudio`: sheep hit pipe sound
- `gameOverAudio`: game over music
- `scoreAudio` score sound

**GameManager.js: `.....` are parts stay unchanged**
```js
var Sheep = require('Sheep');
var ScrollPicture = require('ScrollPicture');
var PipeGroupManager = require('PipeGroupManager');

var GameState = Fire.defineEnum({.....});

var GameManager = Fire.Class({
    extends: Fire.Component,
    constructor: function () {.....},
    properties: {
        .....
        // reference to background music AudioSource
        gameBgAudio: {
            default: null,
            type: Fire.AudioSource
        },
        // reference to sheep hit pipe AudioSource
        dieAudio: {
            default: null,
            type: Fire.AudioSource
        },
        // reference to game over AudioSource
        gameOverAudio: {
            default: null,
            type: Fire.AudioSource
        },
        // reference to score AudioSource
        scoreAudio: {
            default: null,
            type: Fire.AudioSource
        }
    },
    start: function () {..... },
    update: function () {
        switch (this.gameState) {
            case GameState.Run:
                .....
                if (gameOver) {
                    // stop background music and play hit sfx and game over sfx
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
    updateSorce: function () {
        .....
        if (nextPipeGroup) {
           .....
            if (crossed) {
              .....
                // play get score sfx
                this.scoreAudio.play();
            }
        }
    }
});
```

Once finish editing on `GameManager.js`, drag `gameBg`, `die`, `gameOver`, `score` entities under `Audios` onto `GameManager` component's `Game Bg Audio`、`Die Audio`、`Game Over Audio`、`Score Audio` properties in the exact order.

![audios](https://cloud.githubusercontent.com/assets/344547/7317355/a2ef24fc-eab2-11e4-90ee-7210900905f5.png)


## Conclusion

Click play button, and here's your first game made with Fireball! Although it's rather simple, you can add more details and gameplay onto it.

Here's a version we created with more details: https://github.com/fireball-x/game-duang-sheep

Next you can keep learning from Fireball User manual in [Fireball Learning Center](http://docs.fireball-x.com). We will be adding more examples and tutorial one by one, stay tuned!

If you have questions regarding tutorial or other documentations, don't hesitate to send us feedback via any of the following channel:

- [Slack Community](https://fireball.slack.com), get invited from [here](https://fireball-slack.herokuapp.com)
- [Github Issue](https://github.com/fireball-x/fireball/issues)
- Support Email：support@fireball-x.com

----

**NOTE:** [ Step - 7 Project Snapshot for Adding Audios](https://github.com/fireball-x/tutorial/commits/step-7)
