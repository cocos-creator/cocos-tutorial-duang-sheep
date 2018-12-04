var SpawnManager = cc.Class({
    extends: cc.Component,

    properties: {
        spawnX: 0,
        
        objectSpeed: 0,

        _pool: null
    },

    onLoad () {
        D.spawnManager = this;
        // init pool
        this._pool = new cc.js.Pool((obj) => {
            console.log('clear obj success');
        }, 10);

        this._pool.get = this.getCompObj;
    },

    startSpawn () {
        D.pipeManager.startSpawn();
        D.drillerManager.startSpawn();
        D.starManager.startSpawn();
    },

    spawn (prefab, compType, parent) {
        // pop into pool
        let comp = this._pool.get(compType);
        if (!comp) {
            comp = cc.instantiate(prefab).getComponent(compType);
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

    update (dt) {
        if (D.game.state !== D.GameManager.State.Run) {
            return;
        }
        var children = this.node.children;
        let distance = dt * this.objectSpeed;
        for (var i = 0; i < children.length; i++) {
            var node = children[i];
            node.x += distance;
            var bounds = node.getBoundingBoxToWorld();
            var disappear = bounds.xMax < 0;
            if (disappear) {
                this.despawn(node)
            }
        }
    },

    despawn (node) {
        // push
        node.removeFromParent();
        node.active = false;
        let comps = node.getComponents(cc.Component);
        this.putIntoPool(comps[comps.length - 1]);
    },

    getCompObj () {
        for (let i = 0; i < this._pool.count; i++) {
            let array = [];
            let obj = this._pool._get;
            if (obj instanceof comp) {
                array.forEach((obj) => {
                    this._pool.put(obj);
                });
                return obj;
            }
            array.push(obj);
        }
        return null;
    },

    putIntoPool (value) {
        let oldCount = this._pool.count;
        this._pool.put(value);
        if (oldCount < this._pool.count) {
            return true;
        }

        console.log('pool has been filled, please resize the array length');
        return false;
    }
});
