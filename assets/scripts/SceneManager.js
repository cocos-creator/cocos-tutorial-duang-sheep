const SceneObject = require('SceneObject');

cc.Class({
    extends: cc.Component,
    properties: {
        spawnX: 0,
        objectSpeed: 0,
        _pool: null,
    },
    onLoad () {
        D.sceneManager = this;
        this._pool = new cc.js.Pool((obj) => {
            // default will push into the pool array again.
            console.log('clear obj success');
        }, 10);

        this._pool.get = this.getCompObj;
    },

    spawn (prefab, compType, parent) {
        let comp = this._pool.get.bind(this)(compType);
        if (!comp) {
            comp = cc.instantiate(prefab).getComponent(compType);
            console.log('generate new targer');
        }

        if (parent) {
            comp.node.parent = parent;
        }
        else {
            this.node.addChild(comp.node);
            comp.node.x = this.spawnX;
        }
        comp.node.active = true;
        return comp;
    },

    despawn (comp) {
        comp.node.removeFromParent();
        comp.node.active = false;
        this.putIntoPool(comp);
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
    },

    getCompObj (comp) {
        let array = [];
        let obj = null;
        for(let i = 0; i < this._pool.count; i++) {
            obj = this._pool._get();
            if (obj instanceof comp) {
                break;
            }
			else  {
                array.push(obj);
                obj = null;
			}
        }

        array.forEach(o => {
            this._pool.put(o);
        });

        return obj;
    },

    // add to open the pool comp to other module
    putIntoPool (value) {
        let oldCount = this._pool.count;
        this._pool.put(value);
        if (oldCount < this._pool.count) {
            console.log("return back");
            return true;
        }

        console.warn('pool has been filled, please resize the array length.')
        return false;
    }
});
