var ScrollPicture = Fire.extend(Fire.Component);

//-- 滚动的速度
ScrollPicture.prop('speed', 200);

//-- X轴边缘
ScrollPicture.prop('offsetX', 0);

//-- 更新
ScrollPicture.prototype.update = function () {
    this.entity.transform.x -= Fire.Time.deltaTime * this.speed;
    if (this.entity.transform.x < -this.offsetX) {
        this.entity.transform.x += this.offsetX;
    }
};
