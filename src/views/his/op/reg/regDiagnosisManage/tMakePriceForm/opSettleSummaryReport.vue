// 门诊收费汇总日报
<template>
  <div class="content">
    <div class="his-module his-small ht">
      <el-tabs v-model="activeName" class="tab-small underline">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        >
          <div class="row">
            <div class="label">
              <div class="searchTitle">时间</div>
              <el-date-picker
                type="daterange"
                v-model="date[item.name]"
                value-format="yyyy-MM-dd"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                class="date-wrapper"
                @change="changeDate"
              ></el-date-picker>
              <div class="searchTitle ml10">医保线路</div>
              <el-select
                v-model="ybxl[item.name]"
                :placeholder="'请选择医保线路'"
                @change="changeYbxl"
                multiple
              >
                <el-option
                  v-for="item in ybxlList"
                  :key="item.dv"
                  :label="item.dn"
                  :value="item.dv">
                </el-option>
              </el-select>

              <el-divider direction="vertical"></el-divider>
              <div class="btn">
                <el-button type="text" size="mini" @click="query(item.name)">
                  <i class="icon his-caozuo-statistics blue"></i>
                  <span>统计</span>
                </el-button>
                <el-button type="text" size="mini" @click="print(item.name)">
                  <i class="icon his-btn-print blue"></i>
                  <span>打印</span>
                </el-button>
                <el-button type="text" size="mini">
                  <i class="icon his-caozuo-export blue"></i>
                  <span>导出</span>
                </el-button>
              </div>
            </div>
          </div>

          <div class="statement-box">
            <statement
              :ref="'statement_'+item.name"
              :html-api="htmlApi[item.name]"
              :html-search-data="htmlSearchData"
              :height="listSlotHeight"
              :print-arg="{
                top: '8%',
                left: '10%',
                width: '90%',
                height: '87%'
              }"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { getNow } from '@/api/his/basic'
import { parseTime } from '@/utils'

declare interface IObj {
  [key: string]: string
}

@Component({
  name: ''
})

export default class extends Vue {
  private tabList: any[] = [
    {label: '门诊挂号收费汇总报表', name: 'first'},
    {label: '项目分类明细表', name: 'second'},
    {label: '项目分类明细表(现金)', name: 'third'},
    {label: '门诊挂号收费汇总报表(未结账)', name: 'fouth'},
    {label: '其他应收明细表(B)', name: 'fifth'},
  ]
  private activeName: string = 'first'
  private date: any = {
    first: [],
    second: [],
    third: [],
    fouth: [],
    fifth: []
  }
  private ybxl: any = {
    first: [],
    second: [],
    third: [],
    fouth: [],
    fifth: []
  }
  private htmlApi: any = {
    first: '/op-service/ghrbReport/mzghsfjchz',
    second: '/op-service/ghrbReport/xmflmxb',
    third: '/op-service/ghrbReport/xmflmxxjb',
    fouth: '/op-service/ghrbReport/mzghsfhzbwjz',
    fifth: '/op-service/ghrbReport/qtysmx'
  }
  private htmlSearchData: any = {
    beginDay: '',
    endDay: '',
    jgName: JSON.parse(localStorage.userInfo).hospitalName,
    ybxl: ''
  }
  private ybxlList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.MED_INS_ROUTE : this.$store.state.webSqlDict.MED_INS_ROUTE // 医保线路

  get listSlotHeight(){
    return Vue.prototype.PageHeight - 80
  }

  // 获取当前时间
  private getTime(){
    getNow().then((res: any) => {
      if(res){
        let date = parseTime(res.data, '{y}-{m}-{d}')
        for(let i in this.date){
          this.date[i] = [date, date]
          this.changeDate(this.date[i])
        }
      }
    })
  }

  // 切换日期
  private changeDate(value: any){
    // this.htmlSearchData.beginDay = value[0]
    // this.htmlSearchData.endDay = value[1]
  }

  private changeYbxl(value: any){
    this.htmlSearchData.ybxl = value.join(',')
  }

  // 统计
  private query(name: string){
    if(this.ybxl[name].length == 0){
      this.$notify({
        title: '请选择医保线路',
        message: '',
        type: 'warning'
      })
      return false
    }
    this.htmlSearchData.beginDay = this.date[name][0]
    this.htmlSearchData.endDay = this.date[name][1]
    this.htmlSearchData.ybxl = this.ybxl[name]
    const statement: any = this.$refs['statement_'+name]
    statement[0].getTableUrl()
  }

  // 打印
  private print(name: string){
    const statement: any = this.$refs.statement
    statement.printTable()
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
.row{
  .label{
    .el-input{
      width: auto;
    }
  }
}

.statement-box {
  width: 700px;
  // padding: 0 4rem;
}
</style>
