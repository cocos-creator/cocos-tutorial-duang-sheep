cc.Class({
    extends: require('SceneObject'),

    properties: {
        anim: cc.Animation
    },

    // use this for initialization
    playAnim (animName) {
        this.anim.play(animName);
    },

    finish () {
        this.node.removeFromParent();
        D.sceneManager.putIntoPool(this);
    }
});
