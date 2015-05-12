title: Tutorial - Create Background
categories: tutorial
permalinks: tutorial/duang-sheep/step2
---


## Goal

- Create scrolling sky and ground background in `Game` scene.

---

## Steps

### Create Sky

Right click in `Hierarchy` view and choose `Create Empty` from context menu. Right click the `New Entity` object, choose `Rename` and name it to `Background`. 

With the same entity selected, find `Fire.Transform` component in `Inspector` view and set `Position` to (0, 0).

**Background Transform:**
![000](https://cloud.githubusercontent.com/assets/7564028/6842952/d0a8d9ba-d3d8-11e4-979f-3f842f95f987.png)

In `Assets` view, find `bg` image in `sprites/background` folder. Drag it to `Background` entity in `Hierarchy` view. You'll find a new entity `bg` created under `Background`, with a `Fire.SpriteRender` Component. 

Next let's duplicate `bg` entity by right click it and choose `Duplicate`. Rename the two entities to `bg_1` and `bg_2`, set their `Position` property in `Inspector` view to `(0, 0)` and `(900,0)`.

**bg_1 setup:**
![001](https://cloud.githubusercontent.com/assets/7564028/6843004/5b8c7334-d3d9-11e4-93c8-c32f8d4d8322.png)

**bg_2 setup:**
![002](https://cloud.githubusercontent.com/assets/7564028/6843007/65eadbc2-d3d9-11e4-85ab-ed773b7d0fbd.png)

### Create Ground

Create a new entity `Ground` the same way. Drag image asset `sprites/background/ground` from `Assets` view to `Ground` entity. Duplicate `ground` entity and rename both to `ground_1` and `ground_2`, set their positions to `(0, -15)` and `(864, -15)`.

**Ground setup:**
![003](https://cloud.githubusercontent.com/assets/7564028/6843009/68a489a8-d3d9-11e4-9f35-2d9df96ac0bc.png)

**ground_1 setup:**
![004](https://cloud.githubusercontent.com/assets/7564028/6843014/7d8be7d0-d3d9-11e4-98e0-323303486f3d.png)

**ground_2 setup:**
![005](https://cloud.githubusercontent.com/assets/7564028/6843016/7ffe8900-d3d9-11e4-96a7-8dab6d3ca6e3.png)

### Create Scrolling Script

Learn how to create a component by reading [**Component Overview**](http://docs.fireball-x.com/zh/scripting/component/) and [**Define a Class**](http://docs.fireball-x.com/zh/scripting/class/). In `Assets` view, create a script file named `ScrollPicture` in `script` folder.

This script will make all background entities moving from right to left according to the sheep's speed. Once a background entity moves out of sight on the left, we will reposition it to the far right and keep scrolling infinitely.

```js
var ScrollPicture = Fire.Class({

  // Custom components must inherit from Fire.Component
  extends: Fire.Component,

  // Properties
  // The values is not relevant here, we will set proper values in Inspector
  properties: {
      // scrolling speed
      speed: 0,
      // reset position when moving past this distance
      offsetX: 0
  },

  // update background entity position
  update: function () {
      this.transform.x -= Fire.Time.deltaTime * this.speed;
      if (this.transform.x < -this.offsetX) {
        this.transform.x += this.offsetX;
      }
  }
});
```

Once you put the above code into the script file, save and drag the script to `Background` and `Ground` entities. This will create `ScrollPicture` components on those entities.

**BackGround Setup:**
![006](https://cloud.githubusercontent.com/assets/7564028/6843018/835bc748-d3d9-11e4-849e-3aee381b85bc.png)

**Ground Setup:**
![007](https://cloud.githubusercontent.com/assets/7564028/6843079/309b75f2-d3da-11e4-89b5-7fd2e93c3fb8.png)

### Run Your Game!

Now you can click the `Play` button ![008](https://cloud.githubusercontent.com/assets/7564028/6843101/7917f008-d3da-11e4-8577-6e68a10c36c5.png) at the top center of the editor to run the game and see the background scrolling already.

**Final Setup:**
![009](https://cloud.githubusercontent.com/assets/7564028/6843104/7ad32c78-d3da-11e4-98ac-a769575ea9a5.png)

---

**NOTE:** [ Step - 2 Project Snapshot for Creating Background](https://github.com/fireball-x/tutorial/commits/step-2)
