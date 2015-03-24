var Game = Fire.extend(Fire.Component, function () {
    //-- 上一次创建PipeGroup的时间
    this.lastTime = 0;
    //-- 保存PipeGroup数组
    this.pipeGroupList = [];

    Game.instance = this;
});

Game.instance = null;

//-- 获取Obstacle障碍物存放处
Game.prop('obstacle', null, Fire.ObjectType(Fire.Entity));

//-- 获取PipeGroup模板
Game.prop('srcPipeGroup', null, Fire.ObjectType(Fire.Entity));

//-- PipeGroup初始坐标
Game.prop('initPipeGroupPos', new Fire.Vec2(600, 0), Fire.ObjectType(Fire.Vec2));

//-- 创建PipeGroup需要的时间
Game.prop('spawnInterval', 3);

Game.prototype.onLoad = function () {
    this.lastTime = 10;
    this.pipeGroupList = [];
};

//-- 创建管道组
Game.prototype.createPipeGroup = function () {
    var pipeGroup = Fire.instantiate(this.srcPipeGroup);
    pipeGroup.parent = this.obstacle;
    pipeGroup.transform.position = this.initPipeGroupPos;
    pipeGroup.active = true;
    this.pipeGroupList.push(pipeGroup);
};

//-- 删除管道
Game.prototype.destroyPipeGroup = function (pipeGroup) {
    if(this.pipeGroupList) {
        var index = this.pipeGroupList.indexOf(pipeGroup);
        this.pipeGroupList.splice(index, 1);
    }
}

//-- 更新
Game.prototype.update = function () {
    //-- 每过一段时间创建障碍物
    var idleTime = Math.abs(Fire.Time.time - this.lastTime);
    if (idleTime >= this.spawnInterval) {
        this.lastTime = Fire.Time.time;
        this.createPipeGroup();
    }
};

module.exports = Game;
