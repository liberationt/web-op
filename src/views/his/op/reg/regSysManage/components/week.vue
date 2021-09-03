<template>
  <div class="his-module his-small week-wrap">
    <div class="row">
      <div class="label">
        <h1 class="title">排班日期</h1>
      </div>
      <div class="label">
        <div class="title">星期</div>
      </div>
    </div>
    <div class="cur-week">
      <ul>
        <li
          v-for="item in curWeek"
          :key="item.date"
          @click="selectDay(item.date)"
          :class="[item.date==curDay?'cur':'']"
        >
          <div class="date">
            <i class="icon his-calendar"></i>
            <span>{{item.date}}</span>
          </div>
          <div class="week">{{item.week}}</div>
        </li>
      </ul>
      <div class="next-pre clearfix">
        <div class="pre" @click="getPreWeek">
          <i class="icon his-card-put"></i>
          上周
        </div>
        <div class="next" @click="getNextWeek">
          <i class="icon his-card-open"></i>
          下周
        </div>
      </div>
    </div>
    <div class="pic">
      <!-- <img src="@/assets/401-images/401.gif"> -->
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { IRegDept, aDeptAdd, aDeptEdit, aDeptDel } from '@/api/his/op/reg/regDept.ts'
import { getNow } from '@/api/his/basic'
import { parseTime, getCurWeek } from '@/utils'
import { getTimerInfor } from '@/api/his/op/reg/deptSchedule.ts'


//声明接口
declare interface pageList {
  id: number
}

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: '',
  filters: {}
})
export default class extends Vue {
  //声明变量，方法
  @Prop({ required: false }) private today: any // key

	private curWeek: any[]=[
  ]
  private curDay: string|null = ''
  private curAmpm: number|null = null
  private timestamp: number = 0
  private zblbList:any = []

  // 获取当前时间
  private getTimestamp(){
    getNow().then((res: any) => {
      this.timestamp = res.data
      this.curWeek = getCurWeek(this.timestamp)
      this.curDay = parseTime(this.timestamp, '{y}-{m}-{d}')
      var curHour = parseTime(this.timestamp, '{h}')
      if(Number(curHour) < 12){
        this.curAmpm = 1
      }else{
        this.curAmpm = 2
      }
      this.$emit('changeDate', this.curDay)
      this.$emit('getAmpm', this.curAmpm,this.zblbList)
      this.$emit('getCurWeek', this.curWeek)
    })
  }

  // 选择日期
  private selectDay(date: string){
    console.log(date)
    this.curDay = date
    this.$emit('changeDate', this.curDay)
  }

  // 获取上一周
  private getPreWeek(){
    this.timestamp -= 24 * 60 * 60 * 1000 * 7
    this.curWeek = getCurWeek(this.timestamp)
  }

  // 获取下一周
  private getNextWeek(){
    this.timestamp += 24 * 60 * 60 * 1000 * 7
    this.curWeek = getCurWeek(this.timestamp)
  }



  //初始化的周期函数
	created() {
    
  }
  async mounted() {
    await getTimerInfor().then((res:any)=>{
      this.zblbList = res.data
    })
    await this.getTimestamp()
    // alert(this.today)
	}
}
</script>

<style lang="scss" scoped>
.week-wrap{
  padding: 8px 0;
  .row{
    margin: 0 10px 0;
    h1.title{
      font-size: 16px;
      font-family: "siyuanMedium";
    }
    div.title{
      font-size: 14px;
      color: $second;
      font-family: "siyuanRegular";
    }
  }
}
.cur-week{
  // border: 1px solid #f00;
  ul{
    li{
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      padding: 0 10px;
      border-right: 2px solid transparent;
      cursor: pointer;
      &::after{
        content: "";
        position: absolute;
        bottom: 0;
        width: calc(100% - 32px);
        height: 1px;
        border-bottom: 1px solid $lightGray;
      }
      .date{
        display: flex;
        align-items: center;
        .icon{
          font-size: 12px;
          color: $third;
        }
        span{
          margin-left: 6px;
          color: $first;
        }
      }
      .week{
        font-size: 14px;
        color: $first;
      }
      &.cur{
        border-right-color: $blue;
        background: rgba($color: $blue, $alpha: .15);
      }
    }
  }
}
.next-pre{
  margin: 10px 10px;
  >div{
    float: left;
    font-size: 14px;
    color: $second;
    cursor: pointer;
    .icon{
      display: inline-block;
      width: 20px;
      height: 20px;
      font-size: 12px;
      color: #fff;
      text-align: center;
      line-height: 20px;
      border-radius: 2px;
      background: $blue;
      transform: scale(.7);
    }
  }
  .pre{}
  .next{
    margin-left: 24px;
  }
}
.pic{
  position: absolute;
  bottom: 10px;
  left: 28px;
  width: calc(100% - 56px);
  height: 130px;
  text-align: center;
  img{
    height: 100%;
  }
}
</style>