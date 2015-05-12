title: Tutorial - Game Loop
categories: tutorial
permalinks: tutorial/duang-sheep/step5
---


## Goal

- Adding collision detect between sheep and pipes
- When sheep hit a pipe, pop up a game over menu
- Click the restart button in game over menu to restart game

## Steps

### Add Collision Detection for Pipes

Open`PipeGroupManager` script for editing. Add a function called `collisionDetection`. Also add a property `pipeGroupList` to manage all existing `PipeGroup` entities.

Add the following code to `PipeGroupManager` script:

**PipeGroupManager.js: `.....` are the parts stay unchanged.**
```js
var PipeGroupManager = Fire.Class({
  extends: Fire.Component,
  constructor: function () {
     .....
  },
  // Properties
  properties: {
      .....
      // a list to manage all existing pipes
      pipeGroupList: {
         get: function () {
             return this.entity.getChildren();
         },
         hideInInspector: true
        }
    },

    .....

    // create pipe group entity
    createPipeGroupEntity: function () {
        var pipeGroup = Fire.instantiate(this.srcPipeGroup);
        pipeGroup.parent = this.entity;
        pipeGroup.transform.position = this.initPipeGroupPos;
        pipeGroup.active = true;
    },
    // collision detection iterating each pipe group in the list
    collisionDetection: function (sheepRect) {
        for (var i = 0; i < this.pipeGroupList.length; ++i) {
            // top pipe
            var pipeGroupEntity = this.pipeGroupList[i];
            var pipe = pipeGroupEntity.find('topPipe');
            var pipeRender = pipe.getComponent(Fire.SpriteRenderer)
            var pipeRect = pipeRender.getWorldBounds();

            if (Fire.Intersection.rectRect(sheepRect, pipeRect)) {
                return true;
            }

            // bottom pipe
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

### Add Collision Detection for Sheep

Now let's update`Sheep` script. We will add a `renderer` variable to fetch sheep's collider information.

We will update `Sheep` script like this:

**Sheep.js: `.....` are parts stay unchanged**

```js
// sheep states
var State = Fire.defineEnum({...});

var Sheep = Fire.Class({
    extends: Fire.Component,
    constructor: function () {
        .....
        // this variable will store the reference for sheep's SpriteRenderer
        this.renderer = null;
        .....
    },
    // properties
    properties: {....},
    // initialization
    onLoad: function () {
        .....
        // sheep's Sprite Renderer will be used as collider
        this.renderer = this.getComponent(Fire.SpriteRenderer);
        .....
      },
    .....
});

Sheep.State = State;
```

### Create Game Over Menu

We will mock up a very simple menu using assets in `sprite/ui` folder.

First create a `GameOver` entity in `Hierarchy` view. Then drag the following image assets from `sprite/ui` folder in `Assets` onto `GameOver`, to create its children automatically:

- `gameoverbg`
- `text_game_over`
- `button_play`

We will use their names as they are. The complete menu should look like this:


**GameOver Setup**

![000](https://cloud.githubusercontent.com/assets/7564028/6864748/8a9e57ec-d4a0-11e4-970a-21bcb3b182c1.png)

Select `GameOver` entity, find the show/hide checkbox at top left of `Inspector` view:![001](https://cloud.githubusercontent.com/assets/7564028/6864833/80d6e0ca-d4a1-11e4-88e3-05d0de382a9e.png)

Uncheck it to hide `GameOver` entity in `Game` view.


### GameOver Restart Button

Create a `GameOverMenu` script. It will add click event for restart button(`button_play` entity). Once clicked game will be restarted.

**GameOverMenu.js**
```js
var GameOverMenu = Fire.Class({
  extends: Fire.Component,
  constructor: function () {
      // restart game event
      this.resetGameEvent;
  },
  // properties
  properties: {
      // reference to restart button
      btn_play: {
          default: null,
          type: Fire.Entity
      }
  },
  // restart game by reloading scene
  resetGameEvent: function () {
      Fire.Engine.loadScene('Game');
  },
  // when game starts, do button event registering
  start: function () {
      //  register click event for restart button
      this.btn_play.on('mousedown', this.resetGameEvent);
  },
  // menu destroyed
  onDestroy: function () {
      // unregister click event
      this.btn_play.off('mousedown', this.resetGameEvent);
  }
});
```

Drag `GameOverMenu` script onto `GameOver` entity in `Hierarchy` view. Then drag  `GameOver/button_play` entity onto `GameOverMenu` component's `Btn Play` property.

### Finish the Game Loop

Now we are all set with collisions and menus. Let's create a script named `GameManager` and connect all the assets and script to finish the game loop.

**GameManager.js**

```js
var Sheep = require('Sheep');
var ScrollPicture = require('ScrollPicture');
var PipeGroupManager = require('PipeGroupManager');

var GameState = Fire.defineEnum({
   Run : -1,
   Over: -1
});

var GameManager = Fire.Class({
   extends: Fire.Component,
   constructor: function () {
       // current game state
       this.gameState = GameState.Run
   },
   // property
   properties: {
       // Sheep component reference
       sheep: {
           default: null,
           type: Sheep
       },
       // background reference
       background: {
           default: null,
           type: ScrollPicture
       },
       // ground reference
       ground: {
           default: null,
           type: ScrollPicture
       },
       // PipeGroupManager component reference
       pipeGroupMgr: {
           default: null,
           type: PipeGroupManager
       },
       // GameOverMenu component reference
       gameOverMenu: {
           default: null,
           type: Fire.Entity
       }
   },
   // when game starts, set state to Run
   start: function () {
       this.gameState = GameState.Run;
   },
   // update game state
   update: function () {
       switch (this.gameState) {
           case GameState.Run:
               // Get bounding box from sheep's renderer, for collision detection
               var sheepRect = this.sheep.renderer.getWorldBounds();
               var gameOver = this.pipeGroupMgr.collisionDetection(sheepRect);
               // If collisionDetection returns true, we know sheep hits pipe
               if (gameOver) {
                   // set new state for game and sheep, use enabled property to switch off scrolling of backgrounds
                   this.gameState = GameState.Over;
                   this.sheep.state = Sheep.State.Dead;
                   this.ground.enabled = false;
                   this.background.enabled = false;
                   for (var i = 0; i < this.pipeGroupMgr.pipeGroupList.length; ++i) {
                       var pipeGroup = this.pipeGroupMgr.pipeGroupList[i].getComponent('PipeGroup');
                       pipeGroup.enabled = false;
                   }
                   this.pipeGroupMgr.enabled = false;
                   // turn on the active property of GameOverMenu to show it
                   this.gameOverMenu.active = true;
               }
               break;
           default :
               break;
       }
   }
});
```


**Final Setup**

![002](https://cloud.githubusercontent.com/assets/7564028/6864920/df1f73da-d4a2-11e4-9c02-e12597cfa1dc.png)

----

**NOTE:** [ Step - 5 Project Snapshot for Complete Game Loop](https://github.com/fireball-x/tutorial/commits/step-5)
                                                                            
