title: Tutorial - Create Pipes
categories: tutorial
permalinks: tutorial/duang-sheep/step3
---

## Goal
- Create a pipe template in `Game` scene, so that we can dynamically create pipes in runtime.

---

## Steps

### Create Pipe Template

Create two entities named `Template` and `PipeGroup` in `Hierarchy` view. Drag `PipeGroup` onto `Template`, make it a child.

Find `sprites/background/pipe` image asset in `Asset` view. Drag it onto `Template/PipeGroup` in `Hierarchy` view. Expand `PipeGroup`, you'll find a new child entity `pipe`.

Right click `pipe` entity, and duplicate a new entity. Name the two as `topPipe` and `bottomPipe`. Set up their `Transform` component as the following picture shows:


**Template setup:**

![000](https://cloud.githubusercontent.com/assets/7564028/6843785/03c63d12-d3e1-11e4-88b8-789dd2f0ae3f.png)

**PipeGroup setup:** (NOTE: We put PipeGroup out of screen since it's only a template.)

![001](https://cloud.githubusercontent.com/assets/7564028/6843962/af1fed88-d3e2-11e4-9c73-3212640a011b.png)

**topPipe setup:**

![002](https://cloud.githubusercontent.com/assets/7564028/6843963/b2d67b4a-d3e2-11e4-95a4-2b8b1e217bf8.png)

**bottomPipe setup:** (NOTE: Set Scale to negative value will flip the sprite)

![003](https://cloud.githubusercontent.com/assets/7564028/6843964/b54cb254-d3e2-11e4-80ad-99f900f52c36.png)

**Final Setup:**

![004](https://cloud.githubusercontent.com/assets/7564028/6843936/59b380f8-d3e2-11e4-9d73-0c3f654a6efd.png)



### Pipe Scripting

In `assets/script` folder, create a new script file named `PipeGroup`. We will use this script to control the initialization of pipe position, the distance between top and bottom pipes, the scrolling of pipes and destroy pipe when it's out of screen.

Add the following code to the script file, and drag it to `PipeGroup` entity in `Hierarchy` view.

**PipeGroup**
```js
var PipeGroup = Fire.Class({
  // Inherit
  extends: Fire.Component,
  // constructor with a width member
  constructor: function () {
    // pipe width
    this.width = 0;
},
// Properties
properties: {
    // scroll speed
    speed: 200,
    // destroy pipe when reach this position
    minX: -900,
    // top pipe y position range
    topPosRange: {
        default: new Fire.Vec2(100, 160)
    },
    // top and bottom pipe distance range
    spacingRange: {
      default: new Fire.Vec2(210, 230)
    }
},
// Initialization
onEnable: function () {
    //randomly set a y position for top pipe
    var topYpos = Math.randomRange(this.topPosRange.x, this.topPosRange.y);
    //randomly set distance between top and bottom pipe
    var randomSpacing = Math.randomRange(this.spacingRange.x, this.spacingRange.y);
    var bottomYpos = topYpos - randomSpacing;

    //set pipe positions
    var topEntity = this.entity.find('topPipe');
    topEntity.transform.y = topYpos;

    var bottomEntity = this.entity.find('bottomPipe');
    bottomEntity.transform.y = bottomYpos;

    //set width
    var bottomPipeRenderer = bottomEntity.getComponent(Fire.SpriteRenderer);
    this.width = bottomPipeRenderer.sprite.width;
},
// update
update: function () {
    this.transform.x -= Fire.Time.deltaTime * this.speed;
    //destroy pipes when it reaches out of screen position
    if (this.transform.x < this.minX) {
        this.entity.destroy();
    }
}
});

```

**PipeGroup setup:**

![005](https://cloud.githubusercontent.com/assets/7564028/6844160/7ad5aa5c-d3e4-11e4-8208-c88ed5ca337a.png)


### Pipe Manager

Let's create another script in `assets/script` folder named `PipeGroupManager`, to control the generation of `PipeGroup` in runtime.

Add the following code to the new script. Create an entity named `PipeGroupManager` and drag the script onto it.

**PipeGroupManager:**
```js
var PipeGroupManager = Fire.Class({
    extends: Fire.Component,
    constructor: function () {
    // Last PipeGroup created time
    this.lastTime = 0;
  },
  // Properties
  properties: {
      // reference to PipeGroup template
      srcPipeGroup: {
          default: null,
          type: Fire.Entity
      },
      // PipeGroup initial position
      initPipeGroupPos: {
          default: new Fire.Vec2(600, 0)
      },
      // interval to next PipeGroup spawn
      spawnInterval: 3
  },
  // Initialization
  onLoad: function () {
      this.lastTime = Fire.Time.time + 10;
  },
  // Instantiate PipeGroup
  createPipeGroupEntity: function () {
      var pipeGroup = Fire.instantiate(this.srcPipeGroup);
      pipeGroup.parent = this.entity;
      pipeGroup.transform.position = this.initPipeGroupPos;
      pipeGroup.active = true;
  },
  // Updates
  update: function () {
      // Spawn PipeGroup in a certain interval
      var idleTime = Math.abs(Fire.Time.time - this.lastTime);
      if (idleTime >= this.spawnInterval) {
          this.lastTime = Fire.Time.time;
          this.createPipeGroupEntity();
      }
  }
});
```

Learn how to access entity and component by reading [Access Other Component in Inspector ](/manual/scripting/component/access/#access-other-component). Drag `PipeGroup` entity to `Src Pipe Group` property of `PipeGroupManager` component. Now we the property `srcPipeGroup` has the reference to our Pipe template.


**PipeGroupManager setup:**

![006](https://cloud.githubusercontent.com/assets/7564028/6844364/0ef1b4a0-d3e6-11e4-93e6-58d060b9a6b5.png)

### Run Your Game!

Click play button, and check your work so far in `Game` view.

**Final Setup:**

![007](https://cloud.githubusercontent.com/assets/7564028/6844397/4fac07f2-d3e6-11e4-85bf-5b66604a3204.png)

---

**NOTE:** [ Step - 3 Project Snapshot for Creating Pipes](https://github.com/fireball-x/tutorial/commits/step-3)
