const SceneObject = require('SceneObject');

cc.Class({
    extends: cc.Component,
    properties: {
        spawnX: 0,
        objectSpeed: 0,
    },
    onLoad () {
        D.sceneManager = this;
    },
    spawn (prefab, compType) {
        let comp = null;
        if (cc.pool.hasObject(compType)) {
            comp = cc.pool.getFromPool(compType);
        } else {
            comp = cc.instantiate(prefab).getComponent(compType);
        }
        this.node.addChild(comp.node);
        comp.node.active = true;
        comp.node.x = this.spawnX;
        return comp;
    },
    despawn (comp) {
        comp.node.removeFromParent();
        comp.node.active = false;
        cc.pool.putInPool(comp);
    },
    update (dt) {
        if (D.game.state !== D.GameManager.State.Run) {
            return;
        }
        var distance = this.objectSpeed * dt;

        var children = this.node.children;
        for (var i = 0; i < children.length; i++) {
            var node = children[i];
            node.x += distance;
            var bounds = node.getBoundingBoxToWorld();
            var disappear = bounds.xMax < 0;
            if (disappear) {
                this.despawn(node.getComponent(SceneObject));
            }
        }
    }
});
