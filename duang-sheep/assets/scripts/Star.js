var Star = cc.Class({
    extends: cc.Component,

    properties: { },

    onCollisionEnter () {
        this.node.removeFromParent();
        this.node.active = false;
        this.node.destroy();
    }
});
