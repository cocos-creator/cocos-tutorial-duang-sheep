function getDir (node) {
    var degree_cw = node.rotation;
    var degree_ccw = -degree_cw;
    var down = new cc.Vec2(0, -1);
    return down.rotateSelf(degree_ccw * Math.PI / 180);
}

cc.Class({
    extends: require('SceneObject'),

    properties: {
        velocity: {
            default: 5,
        },
        angleVelocity: 5
    },

    onEnable () {
        this.node.y = 0;
    },

    update (dt) {
        // look at player
        var targetPos = D.sheep.node.position;
        var selfPos = this.node.position;
        var expectedDir = targetPos.sub(selfPos).normalizeSelf();
        var selfDir = getDir(this.node);
        var isLeft = selfDir.cross(expectedDir) > 0;
        if (isLeft) {
            this.node.rotation += this.angleVelocity * dt;
        }
        else {
            this.node.rotation -= this.angleVelocity * dt;
        }

        // move forward
        var speed = getDir(this.node).mul(this.velocity * dt);
        this.node.position = selfPos.add(speed);
    },

    onCollisionEnter () {
        D.sceneManager.despawn(this);
    }
});
