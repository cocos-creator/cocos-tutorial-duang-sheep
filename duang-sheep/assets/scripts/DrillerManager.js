const Driller = require('Driller');

var DirllerManager = cc.Class({
    extends: cc.Component,

    properties: {
        prefab: cc.Prefab,
        spawnInterval: 1,
        
        // temp prop
        sheep: cc.Node
    },

    start () {
        this.schedule(this.spawn, this.spawnInterval);
    },

    spawn () {
        let node = cc.instantiate(this.prefab);
        node.parent = this.node;

        // temp method
        node.x = 700;
        let comp = node.getComponent('Driller');
        comp.sheep = this.sheep;
    },

    reset () {
        this.unschedule(this.spawn);
    }
});
