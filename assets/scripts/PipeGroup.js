cc.Class({
    extends: cc.Component,
    properties: {
        speed: 0,
        botYRange: cc.p(0, 0),
        spacingRange: cc.p(0, 0),
        topPipe: cc.Node,
        botPipe: cc.Node
    },
    onEnable () {
        let botYPos = this.botYRange.x + Math.random() * (this.botYRange.y - this.botYRange.x);
        let space = this.spacingRange.x + Math.random() * (this.spacingRange.y - this.spacingRange.x);
        let topYPos = botYPos + space;
        this.topPipe.y = topYPos;
        this.botPipe.y = botYPos;
    },
    update (dt) {
        if (D.game.state !== D.GameManager.State.Run) {
            return;
        }

        this.node.x += this.speed * dt;

        var disappear = this.node.getBoundingBoxToWorld().xMax < 0;
        if (disappear) {
            D.pipeManager.despawnPipe(this);
        }
    }
});
