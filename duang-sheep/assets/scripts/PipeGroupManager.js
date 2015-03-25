var PipeGroupManager = Fire.extend(Fire.Component, function () {
    //-- 上一次创建PipeGroup的时间
    this.lastTime = 0;
});

//-- 获取PipeGroup模板
PipeGroupManager.prop('srcPipeGroup', null, Fire.ObjectType(Fire.Entity));

//-- PipeGroup初始坐标
PipeGroupManager.prop('initPipeGroupPos', new Fire.Vec2(600, 0));

//-- 创建PipeGroup需要的时间
PipeGroupManager.prop('spawnInterval', 3);

PipeGroupManager.prototype.onLoad = function () {
    this.lastTime = Fire.Time.time + 10;
};

//-- 创建管道组
PipeGroupManager.prototype.createPipeGroupEntity = function () {
    var pipeGroup = Fire.instantiate(this.srcPipeGroup);
    pipeGroup.parent = this.entity;
    pipeGroup.transform.position = this.initPipeGroupPos;
    pipeGroup.active = true;
};

//-- 更新
PipeGroupManager.prototype.update = function () {
    //-- 每过一段时间创建障碍物
    var idleTime = Math.abs(Fire.Time.time - this.lastTime);
    if (idleTime >= this.spawnInterval) {
        this.lastTime = Fire.Time.time;
        this.createPipeGroupEntity();
    }
};
