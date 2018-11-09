const PipeGroup = require("PipeGroup");

cc.Class({
    extends: cc.Component,

    properties: {
        pipePrefab: cc.Prefab,
        //-- 创建PipeGroup需要的时间
        spawnInterval: 0,
        //-- 记录 pipe 生成位置
        spawnX: 0,
        //-- pipe 移动速度
        objectSpeed: 0

    },
    // this is a temp script content to test the PipeGroup spwan
    start () {
        this.schedule(this.spawnPipe, this.spawnInterval);
    },

    spawnPipe () {
        let pipe = cc.instantiate(this.pipePrefab);
        let comp = pipe.getComponent(PipeGroup);

        this.node.addChild(pipe);
        pipe.x = this.spawnX;

        return comp;
    },

    update (dt) {
        var children = this.node.children;
        let distance = dt * this.objectSpeed;
        for (var i = 0; i < children.length; i++) {
            var node = children[i];
            node.x += distance;
            var bounds = node.getBoundingBoxToWorld();
            var disappear = bounds.xMax < 0;
            if (disappear) {
                node.destroy();
            }
        }
    }
});