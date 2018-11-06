var ScrollPicture = cc.Class({
    //-- 继承
    extends: cc.Component,
    //-- 属性
    properties: {
        //-- 滚动的速度
        speed:200,
        //-- X轴边缘
        offsetX: 0
    },
    //-- 更新
    update: function () {
        this.transform.x -= Fire.Time.deltaTime * this.speed;
        if (this.transform.x < -this.offsetX) {
            this.transform.x += this.offsetX;
        }
    }
});
