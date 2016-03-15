title: Tutorial - Create Sheep
categories: tutorial
permalinks: tutorial/duang-sheep/step4
---

## Goal
- Use`SpriteAnimation` component to add animations to sheep
- Click or touch input to make sheep jump
- Sheep state control


## Steps

### Create Sheep Animation Clips

Create `assets/animations` folder in `Asset` view. Right click `animations` folder and choose `Create/New Sprite Animation` to create a new sprite animation clip. We will create 5 clips with the following names:

- `Run`: sheep run animation
- `Jump`: sheep jump animation
- `Drop`: sheep falling animation
- `DropEnd`: sheep hit ground animation
- `Dead`: sheep hit pipe animation

然后点击每一个动画剪辑来设置动画帧，动画剪辑资源有以下属性：

- Wrap Mode ---- How animation repeats
  - Default      Reads the default repeat mode on parent
  - One          When time reaches the end of the animation clip, the clip will automatically stop playing and time will be reset to beginning of the clip.
  - Loop         Once finished, start play from beginning
  - PingPong     Back and forth play
  - ClampForever Plays back the animation. When it reaches the end, it will keep playing the last frame and never stop playing.

- Stop Action ---- Action to take when animation finished playing the last frame
  - DoNothing     Do nothing and shows the last frame
  - DefaultSprite Switch to show default sprite
  - Hide          Hide entity
  - Destroy       Destroy entity
- Speed --- Animation play speed, 1 is normal speed
- Frame Rate -- Frame rate at which keyframes are sampled.
- Frame Infos -- Each animation frame's sprite image and duration
  - FrameInfo
    - Sprite  Which image to show at this set of frames
    - Frames  How many frames this image lasts

We will first set a `size` value for `Frame Infos` property. This should match each animation's image count. Then find each image in `sprites/sheep` folder in `Assets` view, and drag it to a `FrameInfo` in the list in correct order.

(This workflow will be improved in the future.)

**Run Animation Setup in Inspector**

![001](https://cloud.githubusercontent.com/assets/7564028/6844693/3462f6e8-d3e8-11e4-81d7-a30afbc005a1.png)

**Jump Animation Setup in Inspector**

![002](https://cloud.githubusercontent.com/assets/7564028/6844691/34523650-d3e8-11e4-8d4f-3e37312fe855.png)

**Drop Animation Setup in Inspector**

![003](https://cloud.githubusercontent.com/assets/7564028/6844690/3452255c-d3e8-11e4-9571-d9a09066df3b.png)

**DropEnd Animation Setup in Inspector**

![004](https://cloud.githubusercontent.com/assets/7564028/6844689/34520c3e-d3e8-11e4-9d7a-5d71d11d5ebe.png)

**Dead Animation Setup in Inspector**

![005](https://cloud.githubusercontent.com/assets/7564028/6844692/34543bda-d3e8-11e4-9e0e-cffae3484836.png)


### Create SpriteAnimation Component

Create an entity named `Sheep` in `Hierarchy` view. Select the entity and click the `+` button on the top right of `Inspector` view. Add a `SpriteRenderer` component and a `SpriteAnimation` component to `Sheep` entity.

Drag the image asset `sprites/sheep/sheep_run_03` from `Assets` view onto `SpriteRenderer` component's `Sprite` property, as the default sprite of sheep.

Make sure`Sheep` entity is selected, set `SpriteAnimation` component's `Animations/size` to `5`. And drag the animation clips we just created to each slot in the list. The order does not matter.

**SpriteRender and SpriteAnimation Setup**

 ![005](https://cloud.githubusercontent.com/assets/7564028/6845001/eb17a59e-d3ea-11e4-9b8c-05bdf19542b9.png)


### Sheep Control Script

Create a script named `Sheep`, at the same place as other scripts. It will do the following tasks：

- Listen to player input and control sheep's action
- Calculate sheep's position each frame during a movement
- Play sprite animation on sheep and control states

Add the following code to the script we just created, and drag the script to `Sheep` entity in `Hierarchy` view.

**Sheep.js**
```js
// Sheep state enum
var State = Fire.defineEnum({
    None   : -1,
    Run    : -1,
    Jump   : -1,
    Drop   : -1,
    DropEnd: -1,
    Dead   : -1
});

var Sheep = Fire.Class({
    extends: Fire.Component,
    constructor: function () {
        // current playing animation
        this.anim = null;
        // sheep speed
        this.currentSpeed = 0;
        // jump event
        this.jumpEvent = null;
    },
    // Properties
    properties: {
        // max Y position sheep can reach
        maxY: 250,
        // ground Y position sheep will land on
        groundY: -170,
        // gravity acceleration
        gravity: 9.8,
        // jump speed
        initSpeed: 500,
        // sheep state
        _state: {
            default: State.Run,
            type: State,
            hideInInspector: true
        },
        state: {
            get: function () {
                return this._state;
            },
            set: function(value){
                if (value !== this._state) {
                    this._state = value;
                    if (this._state !== State.None) {
                        var animName = State[this._state];
                        this.anim.play(animName);
                    }
                }
            },
            type: State
        }
    },
    // initialization
    onLoad: function () {
        this.anim = this.getComponent(Fire.SpriteAnimation);

        // If a jump event fires, let sheep jump
        this.jumpEvent = function (event) {
            if (this.state !== State.Dead) {
                this._jump();
            }
        }.bind(this);
        Fire.Input.on('mousedown', this.jumpEvent);
    },
    // when sheep is destroyed
    onDestroy: function () {
        // unregister mousedown event
        Fire.Input.off('mousedown', this.jumpEvent);
    },
    // Updates
    update: function () {
        this._updateState();
        this._updateTransform();
    },
    // Update sheep state each frame
    _updateState: function () {
        switch (this.state) {
            case Sheep.State.Jump:
                if (this.currentSpeed < 0) {
                    this.state = State.Drop;
                }
                break;
            case Sheep.State.Drop:
                if (this.transform.y <= this.groundY) {
                    this.transform.y = this.groundY;
                    this.state = State.DropEnd;
                }
                break;
            case Sheep.State.DropEnd:
                if (!this.anim.isPlaying('dropEnd')) {
                    this.state = State.Run;
                }
                break
            default:
                break;
        }
    },
    // Update sheep position according to movement
    _updateTransform: function () {
        var flying = this.state === Sheep.State.Jump || this.transform.y > this.groundY;
        if (flying) {
            this.currentSpeed -= (Fire.Time.deltaTime * 100) * this.gravity;
            this.transform.y += Fire.Time.deltaTime * this.currentSpeed;
        }
    },
    // switch to jump state when receive jump event
    _jump: function () {
        this.state = State.Jump;
        this.currentSpeed = this.initSpeed;
    }
});

Sheep.State = State;
```

### Run Your Game!

Click play button, and check your work so far in `Game` view.

**Final Setup:**

![006](https://cloud.githubusercontent.com/assets/7564028/6864237/7847f050-d499-11e4-8385-650907a360e3.png)

---

**NOTE:** [ Step - 4 Project Snapshot for Creating Sheep](https://github.com/fireball-x/tutorial/commits/step-4)
