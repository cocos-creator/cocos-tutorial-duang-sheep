var PipeGroup = cc.Class({
    extends: cc.Component,
    properties: {
        speed: 0,
        resetX: 0,
        botYRange: cc.p(0, 0),
        spacingRange: cc.p(0, 0),
        topPipe: cc.Node,
        botPipe: cc.Node
    },
    init (pipeMng) {
        this.pipeMng = pipeMng;
        let botYPos = this.botYRange.x + Math.random() * (this.botYRange.y - this.botYRange.x);
        let space = this.spacingRange.x + Math.random() * (this.spacingRange.y - this.spacingRange.x);
        let topYPos = botYPos + space;
        this.topPipe.y = topYPos;
        this.botPipe.y = botYPos;
    },
    update: function (dt) {
        if (this.pipeMng.isRunning === false) {
            return;
        }
        this.node.x += this.speed * dt;
        if (this.node.x < this.resetX) {
            this.pipeMng.despawnPipe(this);
        }
    }
});
