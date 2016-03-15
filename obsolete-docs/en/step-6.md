title: Tutorial - Score Text
categories: tutorial
permalinks: tutorial/duang-sheep/step6
---


## Goal

- Gain score when sheep jump over a pipe
- Create a BitmapText component to display text in game

---

## Steps

### Create BitmapText

To display text in game, we need to to create a `BitmapText` component. Drag `fonts/number1` asset from `Assets` view to `Hierarchy` view. This will create an entity with `BitmapText` component. Rename the entity to `Score`, and change the `Text` property in `BitmapText` component to `0`.

**Score Entity Setup**

![000](https://cloud.githubusercontent.com/assets/7564028/6865000/0eff3c74-d4a4-11e4-8aaf-c5a4fb4f8f35.png)

![001](https://cloud.githubusercontent.com/assets/7564028/6865002/11d508c0-d4a4-11e4-83c4-b7b3429e978f.png)


### Mark Passed Pipes

Open `PipeGroup` script for editing. Add a variable `passed` to mark if the PipeGroup is passed. Also get the reference of the bottom pipe that sheep is about to jump over and store it in `bottomRenderer` property.

**PipeGroup.js: `.....` are parts stay unchanged**

```js
var PipeGroup = Fire.Class({
  extends: Fire.Component,
  constructor: function () {
      // store the reference of current bottom pipe's renderer
      this.bottomRenderer = null;
      // if the pipe group is passed
      this.passed = false;
  },
  // properties
  properties: {.....},
  // initialization
  onEnable: function () {
      .....

      this.bottomRenderer = bottomEntity.getComponent(Fire.SpriteRenderer);
      this.passed = false;
  },
  // update
  update: function () {.....}
});
```


Open `PipeGroupManger` script for editing. Add a function to get the next PipeGroup that is not passed already. Update its `passed` property value when sheep jump over it successfully.

**PipeGroupManager.js: `.....` are parts stay unchanged**

```js
var PipeGroupManager = Fire.Class({
  extends: Fire.Component,
  constructor: function () {.....},
  // properties
  properties: {.....},
  // initialization
  onLoad: function () {.....},
  // create PipeGroup entity
  createPipeGroupEntity: function () {.....},
  // get the next PipeGroup in the list that is not passed
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
  // mark the PipeGroup as passed
  setAsPassed: function (pipeGroup) {
      pipeGroup.passed = true;
  },
  // collision detection
  collisionDetection: function (sheepRect) {.....},
  // update
  update: function () {.....}
});
```

### Add Score Logic and Display Update

Open `GameManager` script for editing, add a `scoreText` property to hold the `Score` entity we just created. Then we will add logic to handle score increase when sheep jump over a pipe.

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
        // reference to Score entity
        scoreText: {
            default: null,
            type: Fire.BitmapText
        }
    },
    // when game starts, initialize score value and text display
    start: function () {
        .....
        this.score = 0;
        this.scoreText.text = this.score;
    },
    // updates
    update: function () {
        switch (this.gameState) {
            case GameState.Run:
                .....
                // update score value and display
                this.updateSorce();
                break;
            default :
                break;
        }
    },
    // update score value and display
    updateSorce: function () {
        var nextPipeGroup = this.pipeGroupMgr.getNext();
        if (nextPipeGroup) {
            var sheepRect = this.sheep.renderer.getWorldBounds();
            var pipeGroupRect = nextPipeGroup.bottomRenderer.getWorldBounds();
            // when sheep's left edge passed PipeGroup's right edge
            var crossed = sheepRect.xMin > pipeGroupRect.xMax;
            if (crossed) {
                // score + 1
                this.score++;
                // Update BitmapText's text property
                this.scoreText.text = this.score;
                this.pipeGroupMgr.setAsPassed(nextPipeGroup);
            }
        }
    }
});
```

**Final Setup**

![002](https://cloud.githubusercontent.com/assets/7564028/6865247/cf548e28-d4a6-11e4-97b3-bb50a43c37b7.png)

----

**NOTE:** [ Step - 6 Project Snapshot for Score Text](https://github.com/fireball-x/tutorial/commits/step-6)
