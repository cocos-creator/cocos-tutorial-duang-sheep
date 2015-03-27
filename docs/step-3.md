# 创建场景元素（障碍物）

## 需要完成的任务: 
- 在Game场景中动态创建障碍物

--

## 详细步骤:

   1. 在Hierarchy视图中创建2个对象分别是Template对象与障碍物(PipeGroup)对象,其中PipeGroup对象中包含了2个对象,分别是从Asset视
   图下的`sprites/backgroup`文件夹下的pipe图片拖放Hierarchy视图中创建的topPipe,bottomPipe, 创建完后把该对象拖放到(Template)
   对象中.
   
   **Template 示例图:**
   
     ![000](https://cloud.githubusercontent.com/assets/7564028/6843785/03c63d12-d3e1-11e4-88b8-789dd2f0ae3f.png)
   
   **PipeGroup 示例图:** (NOTE:为了让PipeGroup对象不显示在Game屏幕中设置它的X轴)
   
     ![001](https://cloud.githubusercontent.com/assets/7564028/6843962/af1fed88-d3e2-11e4-9c73-3212640a011b.png)
   
   **topPipe 示例图:** (NOTE调整Y轴是为了设置2个水管的距离)
   
      ![002](https://cloud.githubusercontent.com/assets/7564028/6843963/b2d67b4a-d3e2-11e4-95a4-2b8b1e217bf8.png)
    
   **bottomPipe 示例图:** (NOTE:调整Y轴是为了设置2个水管的距离 调整Scale的Y是为了做镜像翻转)
   
     ![003](https://cloud.githubusercontent.com/assets/7564028/6843964/b54cb254-d3e2-11e4-80ad-99f900f52c36.png)
   
   **最终示例图:**
   
     ![004](https://cloud.githubusercontent.com/assets/7564028/6843936/59b380f8-d3e2-11e4-9d73-0c3f654a6efd.png)
   
    ----
   
   2. 创建PipeGroup脚本,该脚本控制了初始化topPipe与bottomPipe之间的距离,和移动自身的X轴进行移动，当超出界线值就销毁自身.
   创建后拖拽该脚本到Hierarchy视图中的PipeGroup对象上.
   
   ````js
   var PipeGroup = Fire.Class({
      // 继承
      extends: Fire.Component,
      // 构造函数
      constructor: function () {
          // 管道的宽度
          this.width = 0;
      },
      // 属性
      properties: {
          // 基础移动速度
          speed: 200,
          // 超出这个范围就会被销毁
          minX: -900,
          // 上方管子坐标范围 Min 与 Max
          topPosRange: {
              default: new Fire.Vec2(100, 160)
          },
          // 上方与下方管道的间距 Min 与 Max
          spacingRange: {
            default: new Fire.Vec2(210, 230)
          }
      },
      // 初始化
      onEnable: function () {
          var topYpos = Math.randomRange(this.topPosRange.x, this.topPosRange.y);
          var randomSpacing = Math.randomRange(this.spacingRange.x, this.spacingRange.y);
          var bottomYpos = topYpos - randomSpacing;

          var topEntity = this.entity.find('topPipe');
          topEntity.transform.y = topYpos;

          var bottomEntity = this.entity.find('bottomPipe');
          bottomEntity.transform.y = bottomYpos;

          var bottomPipeRenderer = bottomEntity.getComponent(Fire.SpriteRenderer);
          this.width = bottomPipeRenderer.sprite.width;
      },
      // 更新
      update: function () {
          this.transform.x -= Fire.Time.deltaTime * this.speed;
          if (this.transform.x < this.minX) {
              this.entity.destroy();
          }
      }
    });

  ````
    **PipeGroup 示例图:**
    
     ![005](https://cloud.githubusercontent.com/assets/7564028/6844160/7ad5aa5c-d3e4-11e4-8208-c88ed5ca337a.png)
   
   ----
   
   3. 最后我们需要创建一个控制PipeGroup动态生成的脚本,名为:PipeGroupManager.该脚本是根据时间来生成PipeGroup对象,
   创建完该脚本后, 在`Hierarchy视图`中创建一个名为:PipeGroupManager对象，然后绑定该脚本.
   
   **下方是脚本实现:**
   ```js
   var PipeGroupManager = Fire.Class({
      // 继承
      extends: Fire.Component,
      // 构造函数
      constructor: function () {
          // 上一次创建PipeGroup的时间
          this.lastTime = 0;
      },
      // 属性
      properties: {
          // 获取PipeGroup模板
          srcPipeGroup: {
              default: null,
              type: Fire.Entity
          },
          // PipeGroup初始坐标
          initPipeGroupPos: {
              default: new Fire.Vec2(600, 0)
          },
          // 创建PipeGroup需要的时间
          spawnInterval: 3
      },
      // 初始化
      onLoad: function () {
          this.lastTime = Fire.Time.time + 10;
      },
      // 创建管道组
      createPipeGroupEntity: function () {
          var pipeGroup = Fire.instantiate(this.srcPipeGroup);
          pipeGroup.parent = this.entity;
          pipeGroup.transform.position = this.initPipeGroupPos;
          pipeGroup.active = true;
      },
      // 更新
      update: function () {
          // 每过一段时间创建障碍物
          var idleTime = Math.abs(Fire.Time.time - this.lastTime);
          if (idleTime >= this.spawnInterval) {
              this.lastTime = Fire.Time.time;
              this.createPipeGroupEntity();
          }
      }
    });
  ```
    **PipeGroupManager 示例图:**
    
     ![006](https://cloud.githubusercontent.com/assets/7564028/6844364/0ef1b4a0-d3e6-11e4-93e6-58d060b9a6b5.png)
   
   ----
   
   4. 最后可以点击运行按钮在Game视图看到结果
   
   **最终效果示例图:**
   
     ![007](https://cloud.githubusercontent.com/assets/7564028/6844397/4fac07f2-d3e6-11e4-85bf-5b66604a3204.png)
   
  ----
  
  **NOTE:** [ step - 3 创建障碍物 git commit 传送门](https://github.com/fireball-x/tutorial/commits/step-3)
