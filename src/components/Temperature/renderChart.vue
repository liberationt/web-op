<template>
	<div>
		<div id="main">
		</div>
		<div class="tips"></div>
	</div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import zrender from 'zrender'
import {
	createLine,
	createCircle,
	addHover,
	createPolygon,
	hoverLine,
	zrenderLine,
	zrenderInit,
	zrenderGroup,
	zrenderRect,
	zrenderText,
} from '@/components/Temperature/util.js'
import { log } from 'util'
@Component({
    name: 'renderChart',
})
export default class extends Vue{
    // @Prop({ required: true }) private TimeArr!: any
    @Prop({ required: true }) private days!: any
    @Prop({ required: true }) private chartData!: any
    private TimeArr:Array<any> = ["2", "6", "10", "14", "18", "22"] //每日时间
	private xLineLen:any = { //多少个y轴坐标
		//天数 7天
		day:0,
		//一天多少分段
		time:6
	}
	private lineStartX:number = 0 //线段开始横坐标
	private lineStartY:number = 0 //线段开始纵坐标
	private lineEndX:number = 0 // 线段结束横坐标
	private LineEndY:number = 0 // 线段结束纵坐标
	private canavsWidth:number = 0 // 画板宽度
	private canavsHeight:number = 0 // 画板高度
	private zr:any = '' // 画板属性
	private	yLineLen:any = {
		XRegion:13, //X轴坐标分几个大块
		XShare:5, //每块份几个小块
		XLineArr:[3], //需要特殊处理的横线 冲上往下算
	}
	private YLineReset:Array<any> = []//Y轴每一小格份几份
	private	width:number = 0
	private	YCellHeight:number = 0 //y轴大格子高度
	private	lastData:number = 0  //上一个数据
	private	CircleSize:number = 8 //画板上圆点的直径
	private	hoverCircleSize:number = 10//画板上圆点移入变化的直径
	private	fontSize:number = 15 //画板上圆圈里的字体大小
	mounted(){
		this.init()
	}
	@Watch('day',{})
	daysChange(old:any,newVal:any){
		if (old != newVal) {
			this.xLineLen.day = old
			this.init()
		}
    }

    init(){
		this.zr = zrenderInit(document.getElementById("main"))
		// var div = (document as any).createElement("div")
		// div.classList.add("tips")
		// (document as any).getElementById("main").append(div)

		this.canavsWidth = this.zr.getWidth()
		this.canavsHeight = this.zr.getHeight()

        this.xLineLen.time = this.TimeArr.length
        this.xLineLen.day = 7
        this.YLineReset = this.resetY(this.TimeArr)
        this.filterData(this.chartData)
        this.yLine() //生成Y轴坐标
        this.xLine() //生成X轴坐标
        this.getCellHeight()
      	// this.hoverLine()
    }
    yLine() {
      //横坐标 最底部横坐标
      let Xline = zrenderLine({
        shape:{
          x1:0,
          y1:this.canavsHeight,
          x2:this.canavsWidth,
          y2:this.canavsHeight
        }
      })
      this.zr.add(Xline)
      const yWidth = this.canavsWidth/this.xLineLen.day

      //循环显示竖线格子 红色竖线
      for (let i = 0; i < this.xLineLen.day; i++) {
         //纵坐标
        let Yline = zrenderLine({
          shape:{
            x1:yWidth*i,
            y1:0,
            x2:yWidth*i,
            y2:this.canavsHeight
          },
          style:{
            opacity:1,
            lineWidth:1,
            stroke:"#ff0000"
          }
        })
        this.zr.add(Yline)
      }

      let yLinAll = this.xLineLen.day*this.xLineLen.time
      for (let i = 0; i < yLinAll; i++) {
		let Yline = zrenderLine({
			shape:{
				x1:yWidth/this.xLineLen.time*i,
				y1:0,
				x2:yWidth/this.xLineLen.time*i,
				y2:this.canavsHeight
			},
			style:{
				opacity:1,
				lineWidth:0.5,
				stroke:"#000"
			}
		})
		this.zr.add(Yline)
      }
    }
    xLine(){
		let xHeight = this.canavsHeight/this.yLineLen.XRegion
		let XShareAll = this.yLineLen.XRegion*this.yLineLen.XShare
		for (let i = 0; i < this.yLineLen.XRegion; i++) {
			let color = "#000"
			this.yLineLen.XLineArr.forEach((el:any) => {
				if (el == i) {
					color = "#ff0000"
				}
			});
			//横坐标 加粗
			let Xline = zrenderLine({
				shape:{
					x1:0,
					y1:xHeight*i,
					x2:this.canavsWidth,
					y2:xHeight*i
				},
				style:{
					opacity:1,
					lineWidth:2,
					stroke:color
				}
			})
			this.zr.add(Xline)

			for (let a = 0; a < XShareAll; a++) {
				//横坐标
				let Xline = zrenderLine({
					shape:{
						x1:0,
						y1:xHeight/this.yLineLen.XShare*a,
						x2:this.canavsWidth,
						y2:xHeight/this.yLineLen.XShare*a
					},
					style:{
						opacity:1,
						lineWidth:0.4,
						stroke:"#000"
					}
				})
				this.zr.add(Xline)
			}
		}
    }
    filterData(data:any){
		//重置信息 避免重复出现的bug
		this.lastData = 0
		data.forEach((el:any,i:any) => {
			switch (el.type) {
			case "text":
				this.zrText(el)
				break;
			case "line":
				this.zrLine(el)
				break;
			case "area":
				this.zrPolyline(el)
				break;
			case "tag":
				this.zrTag(el)
				break;

			default:
				break;
			}
        });
    }
    //绘制文本内容
    zrText(data:any){
		if (this.xLineLen.day*24 >= data.time) {
			//最小值
			const cellMin = data.cellMin
			//坐标轴每格代表值
			const cellSplit = data.cellSplit
			var textWidthHeight = 15 //一个字的原始宽度高度
			var textHeight = 0 //字体总高度
			var textWidth = textWidthHeight //字体总宽度
			var moveRange = textWidthHeight/2 //需要移动的距离 用于移动字体下面的矩形背景框
			//计算文本高度
			if (data.text) {
				let dataLen = data.text.split("\n").length - 1
				//需要换行的字体 移动距离是字体的一半 每个字宽度，高度为12
				if (dataLen > 1) {
					textHeight = dataLen * 21
					textWidth = textWidthHeight
				} else {
					let textLen = data.text.length
					textHeight = 21
					textWidth = textWidthHeight * textLen
					moveRange = textWidthHeight
				}
			}
			let xWidth = this.XShareOne(data.time)

			//如果和上一个时间相同就往后移动
			if ( this.lastData != 0 || data.time <= 1 ) {
				if (this.lastData == data.time) {
					xWidth = xWidth + textWidth + 5
				}
			}
			this.lastData = data.time  //存入当前时间 用于重合区分
			let YHeight = this.YShareOne().height
			let y = this.transformY(data.position,cellSplit,cellMin)
			let state = zrenderGroup();
			state.add(
				zrenderRect({
					shape:{
						x:xWidth-(textWidth/2),
						y:y,
						width:textWidth,
						height:textHeight
					},
					style:{
						fill:"#FFF"
					},
					zlevel:4
				})
			)
			state.add(
				zrenderText({
					style:{
						text:data.text,
						textShadowColor:"#fff",
						textStroke:"#fff",
						textFill:data.color,
						textAlign:"center",
						fontSize:13
					},
					position:[xWidth,y],
					zlevel:4
				})
			);
			this.zr.add(state)
		}
    }
    //每个x轴小格子宽度是多少
    XShareOne(data:any){
      let widthArr = [] //每格宽度 全部存入数组
      var width = 0
      let YLineResetAll = []  //7天所有份数

      for (let i = 0; i < 7; i++) {
        YLineResetAll.push(...this.YLineReset)
      }

      for (let i = 0; i < parseInt(data); i++) {
          width = YLineResetAll[i].width + width
      }

      return width
    }
    //每个Y轴小格子宽度是多少
    YShareOne(){
      //计算大格子里的每格小格子高度
      let childerHeight = this.canavsHeight/this.yLineLen.XRegion/this.yLineLen.XShare
      //计算大格高度
      let height = this.canavsHeight/this.yLineLen.XRegion
      return {height:height,childerHeight:childerHeight}
    }
    //转换y轴坐标点为正确坐标点 因为y轴坐标是顶点为0递增的 所有用总高度减去原来坐标的高度剩下的高度就是正确坐标点
    //i代表一个格子代表几个高度
    transformY(data:any,i:any,cellMin:any){
		let YHeight = this.YShareOne().height
		let YHeightChilder = this.YShareOne().childerHeight
		let xAll = this.yLineLen.XRegion  //一共多少个横坐标 大的
		let surplusHeight:any
		var cellAll = this.yLineLen.XRegion*this.yLineLen.XShare //一共多少个横坐标
		let index = cellMin
		var aIndex = 0
		let lastNumber = 0
		//总共占几格
		for (let a = 0; a < cellAll; a++) {
			//每格代表的值小于0的时候 需要特殊处理
			if (parseInt(i) == 0) {
			let floatNumber = this.getFloat(index,1)
			if (floatNumber <= this.getFloat(data,1)) {
				lastNumber = floatNumber
				aIndex = a
				surplusHeight = this.canavsHeight -this.getFloat(YHeightChilder,1)*a
			}
			}else{
			if (index <= data) {
				lastNumber = index
				aIndex = a
				surplusHeight = this.canavsHeight - YHeightChilder*a
			}
			}
			index = index+i
		}

		if (lastNumber-data < 0) {
			surplusHeight = surplusHeight -YHeightChilder/2
		}

		return surplusHeight
    }
    zrLine(data:any){
		var style = {}
		//最小值
		const cellMin = data.cellMin
		//坐标轴每格代表值
		const cellSplit = data.cellSplit

		data.array.forEach((el:any,i:any) =>{
			//过滤shape 个别需特殊处理 后期需优化
			switch (el.shape) {
				case "x-circle":
					style = {
						stroke:data.color,
						fill:"#fff",
						text:"x",
						fontSize:this.fontSize
					}
				break;
				case "empty-circle":
					style = {
						stroke:data.color,
						fill:"#fff",
						text:"",
					}
				break;
				case 'x':
					switch(el.xmxb){
						case '腋温':
							style = {
								stroke:data.color,
								fill:"#fff",
								text:"x",
								fontSize:this.fontSize
							}
						break;
						case '肛温':
							style = {
								stroke:data.color,
								fill:"#fff",
								text:"",
								fontSize:this.fontSize
							}
						break;
						case '口温':
							style = {
								stroke:data.color,
								fill:"#fff",
								text:"",
								fontSize:this.fontSize
							}
						break;
						case '耳温':
							style = {
								stroke:data.color,
								fill:"#fff",
								text:"▲",
								fontSize:this.fontSize
							}
						break;
						case '额温':
							style = {
								stroke:data.color,
								fill:"#fff",
								text:"◆",
								fontSize:this.fontSize
							}
						break;
						default:
							style = {
								stroke:data.color,
								fill:"#fff",
								text:"x",
								fontSize:this.fontSize
							}
						break;
					}
				break;
				case 'o-circle':
					style = {
						stroke:data.color,
						fill:"#fff",
						text:"●",
						fontSize:this.fontSize
					}
				break;
				case '':
					style = {
						stroke:data.color,
						fill:data.color,
						text:"",
					}
				break;
				default:
				break;
			}
			//疼痛单独处理
			if (el.type == "pain") {
				style = {
					stroke:data.color,
					fill:"#fff",
					text:"",
					}
				}

				if (i > 0) {
				let firstX = this.getX(data.array[i-1].time)
				let firstY = this.transformY(data.array[i-1].value,cellSplit,cellMin)

				let x = this.getX(data.array[i].time)
				let y = this.transformY(data.array[i].value,cellSplit,cellMin)

				if (data.array[i-1].Break == "false") {
					let line = createLine(firstX,firstY,x,y,{
						stroke:data.color,
						lineWidth:2,
					})
					this.zr.add(line)
				}
			}

			if (el.extraArr && el.extraArr.length > 0) {
				el.extraArr.forEach((item:any,a:any) => {
					let x = this.getX(el.time)
					let y = this.transformY(el.value,cellSplit,cellMin)

					let lastY =  this.transformY(item.extra,cellSplit,cellMin)
					let dottedLine = createLine(x,y,x,lastY,{
						stroke:data.color,
						lineWidth:3,
						lineDash:[2,2]
					})
					this.zr.add(dottedLine)

					el.extraArr.forEach((item:any,a:any) => {
						let getY = this.transformY(item.extra,cellSplit,cellMin)

						let Circle = createCircle(x,getY,this.CircleSize,{
						stroke:item.extraColor,
						fill:"#fff",
						})
						this.zr.add(Circle)
						addHover(Circle,{
							tips:item.extraTips,
						},x,getY,{
							r:this.hoverCircleSize,
						},{
							r:this.CircleSize,
						})
					})
				})
			}
			let getX = this.getX(el.time)
			let getY = this.transformY(el.value,cellSplit,cellMin)

			let Circle = createCircle(getX,getY,this.CircleSize,style)
			this.zr.add(Circle)
			addHover(Circle,el,getX,getY,{
				r:this.hoverCircleSize,
			},{
				r:this.CircleSize,
			})
		})
    }
    //多边形
    zrPolyline(data:any){
		//最小值
		const cellMin = data.cellMin
		//坐标轴每格代表值
		const cellSplit = data.cellSplit
		var points = []
		data.array.forEach((el:any,i:any) => {
			//生成圆点
			let cx = this.getX(el.time)
			let cy1 = this.transformY(el.v1,cellSplit,cellMin)
			let Circle1 = createCircle(cx,cy1,this.CircleSize,{
				stroke:data.color,
				fill:"#fff",
				text:"",
			})
			this.zr.add(Circle1)
			addHover(Circle1,{tips:el.v1Tips},cx,cy1,{
			r:this.hoverCircleSize,
			},{
				r:this.CircleSize,
			})

			let cy2 = this.transformY(el.v2,cellSplit,cellMin)
			let Circle2 = createCircle(cx,cy2,this.CircleSize,{
				stroke:data.color,
				fill:data.color,
				text:"",
			})
			this.zr.add(Circle2)

			addHover(Circle2,{tips:el.v2Tips},cx,cy2,{
					r:this.hoverCircleSize,
				},{
					r:this.CircleSize,
				}
			)

			if (i > 0) {
				if (data.array[i-1].Break == "false") {
					points = []
					let pox1 = this.getX(data.array[i-1].time)
					let poy1 = this.transformY(data.array[i-1].v1,cellSplit,cellMin)
					let poy2 = this.transformY(data.array[i-1].v2,cellSplit,cellMin)

					let pox3 = this.getX(el.time)
					let poy3 = this.transformY(el.v1,cellSplit,cellMin)
					let poy4 = this.transformY(el.v2,cellSplit,cellMin)

					points.push([pox1,poy1],[pox1,poy2],[pox3,poy4],[pox3,poy3],[pox1,poy1])

					let area = createPolygon(points,{
					fill:data.bgColor,
					opacity:0.8,
					stroke:data.color
					})

					this.zr.add(area)
				}
			}
		})

    }
    zrTag(data:any){
      //最小值
      const cellMin = data.cellMin
      //坐标轴每格代表值
      const cellSplit = data.cellSplit
      if (data.text == "R") {
        data.array.forEach((el:any,i:any) => {
          let x = this.getX(el.time)
          let y = this.transformY(el.value,cellSplit,cellMin)

          let Circle = createCircle(x,y,this.CircleSize,{
            text:data.text,
            fill:"#fff",
            stroke:data.color,
            textVerticalAlign:"middle",
            textAlign:"center",
          })
          this.zr.add(Circle)
          addHover(Circle,{tips:""},0,0,{
            r:this.hoverCircleSize,
          },{
            r:this.CircleSize,
          })
        })
      }
      if(data.text == "H"){
        data.array.forEach((el:any,i:any) => {
          let x = this.getX(el.time)
          let y = this.transformY(el.y,cellSplit,cellMin)

          let Circle = createCircle(x,y,this.CircleSize,{
            text:data.text,
            fill:"#fff",
            stroke:data.color,
            textVerticalAlign:"middle",
            textAlign:"center"
          })
          this.zr.add(Circle)
          addHover(Circle,{tips:""},0,0,{
            r:this.hoverCircleSize,
          },{
            r:this.CircleSize,
          })
        })
      }
    }
    //获取X坐标 data当前时间点
    getX(data:any){
      let XShareOne = this.XShareOne(data)
      return XShareOne
    }
    //重置y轴坐标间隔条数 传入日期数组 格式["1","3","4","5","6","18","21","24"]
    resetY(data:any){
      let oneYLinWidth = this.canavsWidth/this.xLineLen.day/this.xLineLen.time //每个时间点格子宽度
      let resetArr:any = [] //得到的新数组

      data.forEach((item:any,i:any) => {
        if (i == 0) {
          for (let index = 0; index < item; index++) {
            resetArr.push({
              width:oneYLinWidth/2/item
            })
          }
        }else{
            let indexItem = item - data[i-1]
            for (let index = 0; index < indexItem; index++) {
              resetArr.push({
                width:oneYLinWidth/indexItem
              })
            }
           if (i+1 == data.length) {
             let indexItem = 24 - item
             for (let index = 0; index < indexItem; index++) {
                resetArr.push({
                width:oneYLinWidth/2/indexItem
              })
             }
           }
        }
      })
      return resetArr
    }
    getFloat(num:any,n:any){
      n = n ? parseInt(n) : 0;
      if(n <= 0) {
          return Math.round(num);
      }
      num = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
      num = Number(num).toFixed(n); //补足位数
      return num;
    }
    getCellHeight(){
      //yHeight Y轴每个小格子高度 xHeight X轴每个小格子宽度
      let xWidth = this.canavsWidth / this.xLineLen.day / this.xLineLen.time
      this.$emit('yHeight',this.YShareOne().height)
      this.$emit('xHeight',xWidth)
    }
    hoverLine(){
		var timer = null;
		let line = zrenderLine({
			shape:{
				x1:0,
				y1:0,
				x2:0,
				y2:this.canavsHeight
			},
		})
      	this.zr.add(line)

      	hoverLine(this.zr,line,this.canavsHeight)
    }
}
</script>

<style scoped>
  #main{
    height: 1250px;
    width: 100%;
    position: relative;
  }
  html,body{
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  canvas{
    width: 100%;
    height: 700px;
  }
</style>
