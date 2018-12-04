cc.Class({
    extends: cc.Component,

    properties: {
        anim: cc.Animation
    },

    playAnim (animName) {
        this.anim.play(animName);
    },

    finish () {
        this.node.removeFromParent();
        // temp 
        this.node.destroy();
    }
});
