# 创建场景元素（背景、地面）

## 需要完成的任务:
- Game场景中创建无限循环滚动的背景与地面

--

## 详细步骤:

   1. 利用在`Hierarchy视图`中右键鼠标弹出选项中的 `Create Empty` 功能来进行创建 New Entity ,并且选中 New Entity
   右键选项中 `Rename` 功能来对物体重新命名为:Background, 最后在 `Inspector视图` 下设置 Position坐标.
   
   **示例图 Background属性:**
   
     ![000](https://cloud.githubusercontent.com/assets/7564028/6842952/d0a8d9ba-d3d8-11e4-979f-3f842f95f987.png)
   
   ----
   
   2. `Assets视图`中的`sprites/backgroup文件夹`下找到 bg 的资源图片拖动到 `Hierarchy视图` 中Background 对象(Entity)
   下进行创建出一个含有Fire.SpriteRender组件的新对象(Entity), 并且选中bg对象(Entity)通过右键选项中的`Duplicate`功能拷贝出
   另一个bg对象分别命名为bg_1,bg_2, 并且 `Inspector视图` 中设置它们的Position坐标.
   
   **示例图 bg_1属性:**
   
     ![001](https://cloud.githubusercontent.com/assets/7564028/6843004/5b8c7334-d3d9-11e4-93c8-c32f8d4d8322.png)
   
   **示例图 bg_2属性:**
   
     ![002](https://cloud.githubusercontent.com/assets/7564028/6843007/65eadbc2-d3d9-11e4-85ab-ed773b7d0fbd.png)
   
   ----
   
   3. 地面与Background的做法一样(对象取名为:Ground, 资源名:ground)
   
   **示例图 Ground属性:**
   
     ![003](https://cloud.githubusercontent.com/assets/7564028/6843009/68a489a8-d3d9-11e4-9f35-2d9df96ac0bc.png)
   
   **示例图 ground_1属性:**
   
     ![004](https://cloud.githubusercontent.com/assets/7564028/6843014/7d8be7d0-d3d9-11e4-98e0-323303486f3d.png)
   
   **示例图 ground_2属性:**
   
     ![005](https://cloud.githubusercontent.com/assets/7564028/6843016/7ffe8900-d3d9-11e4-96a7-8dab6d3ca6e3.png)
   
   ----
   
   4. 通过学习[**创建和使用脚本**](http://docs.fireball-x.com/zh/scripting/component/)与[**类型定义**](http://docs.fireball-x.com/zh/scripting/class/)
   在`Asset目录`下的script文件夹下创建一个叫`ScrollPicture`脚本.
   该脚本实现了根据速度与时间让对象X轴向左偏移,只要超过边缘值对象减去边缘值返回原始位置,从而实现无限循环
   ```js
   var ScrollPicture = Fire.Class({

      // 继承
      extends: Fire.Component,
      
      // 属性
      properties: {
          // 滚动的速度
          speed:200,
          // X轴边缘
          offsetX: 0
      },

      // 更新
      update: function () {
          this.transform.x -= Fire.Time.deltaTime * this.speed;
          if (this.transform.x < -this.offsetX) {
            this.transform.x += this.offsetX;
          }
      }
  });
   ```
   完成脚本后,拖放到BackGround与Ground对象上
   
   **BackGround 挂脚本后示例图:**
   
     ![006](https://cloud.githubusercontent.com/assets/7564028/6843018/835bc748-d3d9-11e4-849e-3aee381b85bc.png)
   
   **Ground 挂脚本后示例图:**
   
     ![007](https://cloud.githubusercontent.com/assets/7564028/6843079/309b75f2-d3da-11e4-89b5-7fd2e93c3fb8.png)
   
   ----
   
   5. 设置完毕后就可以点击![008](https://cloud.githubusercontent.com/assets/7564028/6843101/7917f008-d3da-11e4-8577-6e68a10c36c5.png) 运行按钮进行运行游戏,查看最终效果
   
      **最终效果图:**
      
     ![009](https://cloud.githubusercontent.com/assets/7564028/6843104/7ad32c78-d3da-11e4-98ac-a769575ea9a5.png)
    
    
   ----
   
  **NOTE:** [ step - 2 创建背景与地面 git commit 传送门](https://github.com/fireball-x/tutorial/commits/step-2)
