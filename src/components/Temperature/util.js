/*
 * @Author: wangyao
 * @LastEditTime: 2020-08-05 16:07:52
 * @LastEditors: wangyao
 * @Description:
 * @FilePath: \web-op\src\components\Temperature\util.js
 */
import zrender from "zrender"
import moment from 'moment';

// zrenderText
export const zrenderText = (zrenders)=>{
    return new zrender.Text(zrenders);
};
// zrenderRect
export const zrenderRect = (zrenders)=>{
    return new zrender.Rect(zrenders);
};
// zrenderGroup
export const zrenderGroup = ()=>{
    return new zrender.Group();
};
// 画线
export const zrenderLine = (zrenders)=>{
    return new zrender.Line(zrenders);
};
// init
export const zrenderInit = (dom)=>{
    return zrender.init(dom);
};
//线段
export const createLine = (x1,y1,x2,y2,style)=>{
    return new zrender.Line({
        shape:{
            x1:x1,
            y1:y1,
            x2:x2,
            y2:y2
        },
        style:style,
    });
};
// cx 横坐标 cy纵坐标 r半径 空心圆
export const createCircle = (cx,cy,r,style)=>{
    return new zrender.Circle({
        shape:{
            cx:cx,
            cy:cy,
            r:r
        },
        style:style,
        zlevel:4
    })
}
//添加horver事件 el 元素对象 config 一些配置项 x x轴坐标 y y轴坐标 shapeOn鼠标移入一些属性配置 shapeOn鼠标移出一些属性配置 shape配置项看官网
export const addHover = (el,config,x,y,shapeOn,shapeOut) => {
    const domTips = document.getElementsByClassName("tips")
    el.on('mouseover',function(){
        domTips[0].innerHTML = config.tips
        let textWidth = config.tips.length*15
        let webWidth = document.body.offsetWidth
        let leftSize = x - textWidth / 2 + 85
        let topSize = y + 75
        switch (webWidth){
            case 1366:
                leftSize = x - textWidth / 2 + 85
                topSize = y + 75
            break;
            case 1920:
                leftSize = x - textWidth / 2 + 130
                topSize = y + 75
            break;
        }

        domTips[0].setAttribute("style", `position:absolute;top:${topSize}px;left:${leftSize}px;display:block;font-size:13px;background-color:rgba(0,0,0,.7);padding:3px 2px;border-radius:2px;color:#fff;width:${textWidth}px;text-align:center`)
        el.animateTo({
            shape:shapeOn
        },100,0)
    }).on('mouseout',function () {
        domTips[0].setAttribute("style",`display:none`)
        el.animateTo({
            shape:shapeOut
          },100,0)
    })
}
//多边形
export const createPolygon = (points,style) => {
    return new zrender.Polyline({
        shape:{
            points:points,
        },
        style:style
    })
}

export const hoverLine = (el,line,y2) => {
    window.onmousemove = function (e) {
        line.animateTo({
            shape:{
                x1:e.offsetX,
                y1:0,
                x2:e.offsetX,
                y2:y2
            }
        },50,0)
    }
}
//时间格式化
export const getFullTime = (i) => {
    return moment(i).format("YYYY-MM-DD HH:mm:ss");
}
//贝塞尔曲线
export const BezierCurve = (x1,y1,x2,y2,cpx1,cpy1,style) => {
    return new zrender.BezierCurve({
        shape:{
            x1:x1,
            y1:y1,
            x2:x2,
            y2:y2,
            cpx1:cpx1,
            cpy1:cpy1
        },
        style:style,
    });
}