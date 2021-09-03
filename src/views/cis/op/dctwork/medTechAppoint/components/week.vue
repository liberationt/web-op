<template>
  <div class="his-module his-small week-wrap">
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
            <span>{{'星期'+item.week}}</span>
          </div>
          <div class="week">{{ item.date | changeDate}}</div>
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
import { getNow } from '@/api/his/basic'
import { parseTime, getCurWeek } from '@/utils'
import { queryYysjView } from '@/api/cis/op/dctwork/medTechAppoint.ts'

//声明接口
declare interface pageList {
  id: number
}

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: '',
  filters: {
    changeDate: function (value: any) {
      let list = value.split("-")
      list.splice(0, 1)
      let str = list.join(".")
      return "(" + str + ")"
    }
  }
})
export default class extends Vue {
  @Prop({ required: true }) private currentDate!: any
  @Prop({ required: true }) private jclx!: any
  //声明变量，方法
  private curWeek: any[] = [
  ]
  private curDay: string | null = ''
  private timestamp: number = 0

  public setValue(value: string) {
    this.setValue(value)
  }
  public getValue() {
    return null
  }
  //监听方法
  @Watch('tableData')
  private onValueChange(value: string) {
    // this.loading = false
  }

  // 选择日期
  private selectDay(date: string) {
    console.log(date)
    this.curDay = date
    queryYysjView({ jclx: this.jclx, hyrq: date }).then((res: any) => {
      this.$emit('getList', res.data)
    })
  }

  // 获取列表
  private getLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.getList()
  }

  // 条件查询
  private searchLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }

  // 获取上一周
  private getPreWeek() {
    this.timestamp -= 24 * 60 * 60 * 1000 * 7
    this.curWeek = getCurWeek(this.timestamp)
  }

  // 获取下一周
  private getNextWeek() {
    this.timestamp += 24 * 60 * 60 * 1000 * 7
    this.curWeek = getCurWeek(this.timestamp)
  }



  //初始化的周期函数
  created() {
    this.curDay = this.currentDate
    this.timestamp = Date.parse(this.currentDate)
    this.curWeek = getCurWeek(Date.parse(this.currentDate))
  }
  mounted() {
    // this.getTimestamp()
  }
}
</script>

<style lang="scss" scoped>
.week-wrap {
  padding: 8px 0;
  .row {
    margin: 0 16px 0;
  }
}
.cur-week {
  // border: 1px solid #f00;
  ul {
    li {
      position: relative;
      display: flex;
      align-items: center;
      height: 40px;
      padding: 0 14px 0 16px;
      border-right: 2px solid transparent;
      cursor: pointer;
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        width: calc(100% - 32px);
        height: 1px;
        border-bottom: 1px solid $lightGray;
      }
      .date {
        display: flex;
        align-items: center;
        .icon {
          font-size: 12px;
          color: $third;
        }
        span {
          margin-left: 6px;
          color: $first;
        }
      }
      .week {
        font-size: 13px;
        color: #6a6d78;
      }
      &.cur {
        border-right-color: $blue;
        background: rgba($color: $blue, $alpha: 0.15);
      }
    }
  }
}
.next-pre {
  margin: 10px 16px;
  > div {
    float: left;
    font-size: 14px;
    color: $second;
    cursor: pointer;
    .icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      font-size: 12px;
      color: #fff;
      text-align: center;
      line-height: 16px;
      border-radius: 2px;
      background: $blue;
    }
  }
  .pre {
  }
  .next {
    margin-left: 24px;
  }
}
.pic {
  position: absolute;
  bottom: 10px;
  left: 28px;
  width: calc(100% - 56px);
  height: 130px;
  text-align: center;
  img {
    height: 100%;
  }
}
</style>
