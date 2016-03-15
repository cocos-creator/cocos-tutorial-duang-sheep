# 新手教程：创建背景

## 本章任务
- 在`Game`场景中创建无限循环滚动的与地面背景

---

## 详细步骤

### 创建天空背景

在`Hierarchy`视图中点击鼠标右键，并选择弹出选项中的`Create Empty`功能来创建`New Entity`。然后右键点击`New Entity`，并选择弹出菜单中的`Rename`来将物体重新命名为`Background`，最后在该物体的`Inspector`视图中的`Fire.Transform`组件下设置`Position`属性为 (0, 0)。

**示例图 Background属性:**
![000](https://cloud.githubusercontent.com/assets/7564028/6842952/d0a8d9ba-d3d8-11e4-979f-3f842f95f987.png)

`Assets`视图中的`sprites/background`文件夹下找到名字为`bg`的资源图片，拖动到`Hierarchy`视图中`Background` 物体上(Entity)。可以看到物体上添加了一个叫做`Fire.SpriteRender`的新组件（Component）。接下来选中`bg`物体(Entity)，通过右键选项中的`Duplicate`功能复制生成另一个对象。将两个物体分别命名为`bg_1` `bg_2`， 并在`Inspector`视图中如图设置它们的Position坐标为`(0, 0)`，`(900,0)`。

**示例图 bg_1属性:**
![001](https://cloud.githubusercontent.com/assets/7564028/6843004/5b8c7334-d3d9-11e4-93c8-c32f8d4d8322.png)

**示例图 bg_2属性:**
![002](https://cloud.githubusercontent.com/assets/7564028/6843007/65eadbc2-d3d9-11e4-85ab-ed773b7d0fbd.png)

### 创建地面背景

按照同样的方法新建一个地面物体，命名为`Ground`，将`Assets`视图中的`sprites/background/ground`资源图片拖到`Ground`物体上。并复制成两个物体`ground_1` `ground_2`，将他们的位置如下图设为`(0, -15)` `(864, -15)`。

**示例图 Ground属性:**
![003](https://cloud.githubusercontent.com/assets/7564028/6843009/68a489a8-d3d9-11e4-9f35-2d9df96ac0bc.png)

**示例图 ground_1属性:**
![004](https://cloud.githubusercontent.com/assets/7564028/6843014/7d8be7d0-d3d9-11e4-98e0-323303486f3d.png)

**示例图 ground_2属性:**
![005](https://cloud.githubusercontent.com/assets/7564028/6843016/7ffe8900-d3d9-11e4-96a7-8dab6d3ca6e3.png)

### 创建卷屏脚本

参考手册中[**创建和使用脚本**](http://docs.fireball-x.com/zh/scripting/component/)与[**类型定义**](http://docs.fireball-x.com/zh/scripting/class/)的方法，在`Assets`视图中的`assets/script`文件夹下创建一个叫`ScrollPicture`的脚本。

该脚本实现了根据主角运动速度让背景物体沿X轴向左偏移，只要超过我们设置的偏移极限值，就会让背景物体返回原始位置，从而实现无限卷屏循环。

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

完成脚本后，分别拖放到`Background`与`Ground`物体上

**BackGround 挂脚本后示例图:**
![006](https://cloud.githubusercontent.com/assets/7564028/6843018/835bc748-d3d9-11e4-849e-3aee381b85bc.png)

**Ground 挂脚本后示例图:**
![007](https://cloud.githubusercontent.com/assets/7564028/6843079/309b75f2-d3da-11e4-89b5-7fd2e93c3fb8.png)

### 运行查看效果

设置完毕后就可以点击编辑器最上方的![008](https://cloud.githubusercontent.com/assets/7564028/6843101/7917f008-d3da-11e4-8577-6e68a10c36c5.png) 运行按钮运行游戏，查看最终效果

**最终效果图:**
![009](https://cloud.githubusercontent.com/assets/7564028/6843104/7ad32c78-d3da-11e4-98ac-a769575ea9a5.png)

---

**NOTE:** [ Step - 2 创建背景与地面项目快照传送门](https://github.com/fireball-x/tutorial/commits/step-2)
