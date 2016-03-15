cc.Class({
    extends: cc.Component,

    properties: {
        anim: cc.Animation
    },

    // use this for initialization
    playAnim (animName) {
        this.anim.play(animName);
    },

    finish () {
        this.node.removeFromParent();
        cc.pool.putInPool(this);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
