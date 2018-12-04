function getDir (node) {
    var degree_cw = node.rotation;
    var degree_ccw = -degree_cw;
    var down = new cc.Vec2(0, -1);

    return down.rotateSelf(degree_ccw * Math.PI / 180);
}

cc.Class({
    extends: cc.Component,

    properties: {
        velocity: 5,
        angleVelocity:5,
        
        // temp prop
        sheep: cc.Node
    },

    onEnable () {
        this.node.y = 0;
    },

    update (dt) {
        if (!this.sheep) {
            return;
        }
        var targetPos = this.sheep.position;
        var selfPos = this.node.position;
        // unit direction
        var expectedDir = targetPos.sub(selfPos).normalizeSelf();
        var selfDir = getDir(this.node);
        var isLeft = selfDir.cross(expectedDir) > 0;
        if (isLeft) {
            this.node.rotation -= this.angleVelocity * dt;
        }
        else {
            this.node.rotation += this.angleVelocity * dt;
        }

        // move forward
        var speed = getDir(this.node).mul(this.velocity * dt);
        this.node.position = selfPos.add(speed);
        // destroy this node
        if (this.node.x < -700) {
            this.node.removeFromParent();
            this.node.active = false;
            this.node.destroy();
        }
    },

    onCollisionEnter () {
        this.node.removeFromParent();
        this.node.active = false;
    }

});
