// 收费操作员工作量查询
<template>
  <div class="content">
    <div class="his-module his-small ht">
      <div class="row">
        <div class="label">
          <div class="title">收费处操作员工作量查询</div>
          <el-divider direction="vertical"></el-divider>
          <el-date-picker
            type="daterange"
            v-model="date"
            value-format="yyyy-MM-dd"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="changeDate"
            class="date-wrapper"
          ></el-date-picker>
          <el-divider direction="vertical"></el-divider>
          <div class="btn">
            <el-button type="text" size="mini" @click="query">
              <i class="icon his-caozuo-statistics blue"></i>
              <span>统计</span>
            </el-button>
            <el-button type="text" size="mini" @click="print">
              <i class="icon his-btn-print blue"></i>
              <span>打印</span>
            </el-button>
            <!-- <el-button type="text" size="mini">
              <i class="icon his-caozuo-export blue"></i>
              <span>导出</span>
            </el-button> -->
          </div>
        </div>
      </div>

      <div class="statement-box">
        <!-- <statement
          ref="statement"
          html-api="/op-service/ghrbReport/sfcrygzltj"
          :html-search-data="htmlSearchData"
          :height="listSlotHeight"
          :print-arg="{
            top: '8%',
            left: '10%',
            width: '90%',
            height: '87%'
          }"
        /> -->
        <div class="iframe-body ht" >
          <iframe
            ref="iframe"
            id="iframe"
            :style="{height:listSlotHeight + 'px'}"
            :src="src"
            allowtransparency="yes"
            frameborder="0"
            class="iframe"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { getNow } from '@/api/his/basic'
import { parseTime } from '@/utils'
import { getLodop } from '@/plugins/lodop/index.js'

declare interface IObj {
  [key: string]: string
}

@Component({
  name: ''
})

export default class extends Vue {
	private obj: IObj = {
    name: '',
    value: '',
  }
  private date: any[] = []
  private formData: any = {}
  private htmlSearchData: any = {
    beginDay: '',
    endDay: '',
    jgName: JSON.parse(localStorage.userInfo).hospitalName
  }

  get listSlotHeight(){
    return Vue.prototype.PageHeight - 80
  }

  // 获取当前时间
  private getTime(){
    getNow().then((res: any) => {
      if(res){
        let date = parseTime(res.data, '{y}-{m}-{d}')
        this.date = [date, date]
        this.changeDate(this.date)
      }
    })
  }
  private src:any = ''
  // 切换日期
  private changeDate(value: any){
    this.htmlSearchData.beginDay = value[0]
    this.htmlSearchData.endDay = value[1]
  }

  // 查询
  private query(){
    // const statement: any = this.$refs.statement
    // statement.getTableUrl()
    this.src  = `${location.origin}/op-service/ghrbReport/sfcrygzltj?token=${localStorage.getItem('token')}&beginDay=${this.htmlSearchData.beginDay}&endDay=${this.htmlSearchData.endDay}&jgName=${encodeURIComponent(this.htmlSearchData.jgName)}`
  }

  // 打印
  private print(){
    // const statement: any = this.$refs.statement
    // statement.printTable()
    let str = `${location.origin}/op-service/ghrbReport/sfcrygzltj?token=${localStorage.getItem('token')}&beginDay=${this.htmlSearchData.beginDay}&endDay=${this.htmlSearchData.endDay}&jgName=${encodeURIComponent(this.htmlSearchData.jgName)}`
    const __qiankun__ = window.__POWERED_BY_QIANKUN__
    var LODOP: any = null
    console.log( window.__POWERED_BY_QIANKUN__,999)
    if (__qiankun__) {
      LODOP = Vue.prototype.$getLodop()
    } else {
      LODOP = getLodop()
    }
    LODOP.PRINT_INIT('打印任务名')
    LODOP.SET_PRINT_PAGESIZE(1, '', '', 'A4') //A4 正向打印
    LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 'Full-Width')
    LODOP.ADD_PRINT_URL(`0%`, `0%`, `100%`, `100%`, `URL:${str}`)          
    LODOP.PREVIEW() //预览
  }





  //初始化的周期函数
	created() {
    this.getTime()
  }
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.el-date-editor ::v-deep{
  width: 240px;
  height: 28px;
  padding: 0 10px;
  border: none;
  background: $lightGray;
  .el-input__icon {
    display: none;
  }
  .el-range-input{
    background: none;
  }
  .el-range-separator{
    width: auto;
  }
}

.statement-box {
  width: 900px;
  // padding: 0 4rem;
}
#iframe {
  width: calc(100% + 24px);
  // height: auto;
  // visibility: collapse;
}
.iframe-body {
  width: 100%;
  overflow: hidden;
}
</style>
