<template>
  <div class="content">
    <div class="his-module his-small ht">
      <el-tabs v-model="activeName" class="tab-small underline">
        <el-tab-pane label="收费汇总" name="first">
          <div class="row">
            <div class="label">
              <div class="searchTitle">时间</div>
              <el-date-picker
              style="width:300px"
                type="datetimerange"
                v-model="date1"
                value-format="yyyy-MM-dd hh:mm:ss"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :picker-options="pickerOptionEnd"
              ></el-date-picker>
              <div class="searchTitle ml10">医保线路</div>
              <el-select
                v-model="ybxl1"
                :placeholder="'请选择医保线路'"
                @change="changeYbxl"
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
                <el-button type="text" size="mini" @click="create">
                  <i class="icon his-tree-submen blue"></i>
                  <span>产生</span>
                </el-button>
                <el-button type="text" size="mini" @click="summary" :disabled="!isCreated">
                  <i class="icon his-template green"></i>
                  <span>汇总</span>
                </el-button>
                <el-button type="text" size="mini" @click="cancelSummary">
                  <i class="icon his-caozuo-cancellation-cancel red"></i>
                  <span>取消汇总</span>
                </el-button>
                <el-button type="text" size="mini" @click="query">
                  <i class="icon his-caozuo-Details blue"></i>
                  <span>查询</span>
                </el-button>
                <el-button type="text" size="mini" @click="print1" :disabled="!isPrint">
                  <i class="icon his-btn-print blue"></i>
                  <span>打印</span>
                </el-button>
              </div>
            </div>
          </div>

          <div class="statement-box">
            <!-- /op-service/ghrbReport/chargesFsbSummaryCs -->
            <!-- <statement
              ref="statement1"
              :html-api="htmlApi1"
              :html-search-data="htmlSearchData1"
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
                :src="urlData"
                allowtransparency="yes"
                frameborder="0"
                class="iframe"
              ></iframe>
            </div>
          </div>
        </el-tab-pane>

        <!-- <el-tab-pane label="收费汇总查询" name="second">
          <div class="row">
            <div class="label">
              <div class="searchTitle">时间</div>
              <el-date-picker
                type="daterange"
                v-model="date2"
                value-format="yyyy-MM-dd"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                class="date-wrapper"
              ></el-date-picker>
              <div class="searchTitle ml10">医保线路</div>
              <el-select
                v-model="ybxl2"
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
                <el-button type="text" size="mini" @click="chargeSummaryQuery">
                  <i class="icon his-caozuo-Details blue"></i>
                  <span>查询</span>
                </el-button>
                <el-button type="text" size="mini" @click="chargeSummaryPrint">
                  <i class="icon his-btn-print blue"></i>
                  <span>打印</span>
                </el-button>
              </div>
            </div>
          </div>

          <div class="statement-box">
            <statement
              ref="statement2"
              html-api="/op-service/ghrbReport/chargesSummarySearch"
              :html-search-data="htmlSearchData2"
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

        <el-tab-pane label="项目分类汇总" name="third">
          <div class="row">
            <div class="label">
              <div class="searchTitle">时间</div>
              <el-date-picker
                type="daterange"
                v-model="date3"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                class="date-wrapper"
              ></el-date-picker>
              <div class="searchTitle ml10">医保线路</div>
              <el-select
                v-model="ybxl3"
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
                <el-button type="text" size="mini" @click="itemizeSummaryQuery">
                  <i class="icon his-caozuo-Details blue"></i>
                  <span>查询</span>
                </el-button>
                <el-button type="text" size="mini" @click="itemizeSummaryPrint">
                  <i class="icon his-btn-print blue"></i>
                  <span>打印</span>
                </el-button>
              </div>
            </div>
          </div>
          <div class="statement-box">
            <statement
              ref="statement3"
              html-api="/op-service/ghrbReport/itemizeSummary"
              :html-search-data="htmlSearchData3"
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

        <el-tab-pane label="未结账收费汇总" name="fourth">
          <div class="row">
            <div class="label">
              <div class="searchTitle ml10">医保线路</div>
              <el-select
                v-model="ybxl4"
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
                <el-button type="text" size="mini" @click="unChargeSummaryQuery">
                  <i class="icon his-caozuo-Details blue"></i>
                  <span>查询</span>
                </el-button>
                <el-button type="text" size="mini" @click="unChargeSummaryPrint">
                  <i class="icon his-btn-print blue"></i>
                  <span>打印</span>
                </el-button>
              </div>
            </div>
          </div>
          <div class="statement-box">
            <statement
              ref="statement4"
              html-api="/op-service/ghrbReport/outstandingChargesSummary"
              :html-search-data="htmlSearchData4"
              :height="listSlotHeight"
              :print-arg="{
                top: '8%',
                left: '10%',
                width: '90%',
                height: '87%'
              }"
            />
          </div>
        </el-tab-pane> -->
      </el-tabs>
    </div>

    <!-- 取消汇总弹窗 -->
    <el-dialog
      :title="'取消汇总'"
      :visible.sync="dialogVisible1"
      width="400px"
      :close-on-click-modal="false"
      class="narrow-dialog"
      v-elDraggableDialog
    >
      <div>
        <div class="explain">
          <div>取消收费汇总说明</div>
          <p>1、取消汇总日报请慎重</p>
          <p>2、每次取消只能取消最近的一次日终汇总</p>
          <p>3、汇总日报取消后不能恢复，只能重新汇总</p>
        </div>
        <div class="last-date">上一次汇总日期：{{lastDate}}</div>
      </div>
      <div class="his-module his-small">
        <el-table stripe ref="table" :highlight-current-row="true" :data="tableData1" @row-click="rowClick1" border height="350" class="scroll-bar" tooltip-effect="light" v-loading="loading1">
          <el-table-column type="index" width="32" align="center"></el-table-column>

          <!-- 结账日期 -->
          <el-table-column prop="hzjsrq" :label="'汇总日期'"></el-table-column>

          <!-- 操作工号 -->
          <!-- <el-table-column prop="czgh" :label="'操作工号'"></el-table-column> -->
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="confirmCancelSummary" :loading="showLoading">确定</el-button>
      </span>
    </el-dialog>

    <!-- 收费汇总-查询弹窗 -->
    <el-dialog
      :title="'汇总选择'"
      :visible.sync="dialogVisible2"
      width="400px"
      :close-on-click-modal="false"
      class="narrow-dialog"
      v-elDraggableDialog
    >
      <div class="his-module his-small">
        <el-table
          stripe
          ref="table"
          :highlight-current-row="true"
          :data="tableData2"
          @row-click="rowClick2"
          border
          height="350"
          class="scroll-bar"
          tooltip-effect="light"
          v-loading="loading2"
        >
          <el-table-column type="index" width="32" align="center"></el-table-column>

          <!-- 结账日期 -->
          <el-table-column prop="hzjsrq" :label="'汇总日期'"></el-table-column>
          <!-- <el-table-column prop="czgh" :label="'操作工号'"></el-table-column> -->

        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="confirmQuery" :loading="showLoading">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  aChargesSummaryBefVerification,
  aChargesFsbSummaryCs,
  aChargesSummaryCheckOutBefVerification,
  aQueryCancelHzCommit,
  aCancelCommit,
  // aQuerySQLList,
  getNow,
  getCreatSummary,
  doSaveSfrbhz,
  doCancelSfhzrb,
  doQueSfhzrbList
} from '@/api/his/op/reg/chargeSummary'
// import { getNow } from '@/api/his/basic'
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
  private activeName: any = 'first'
  private date1: any[] = []
  private endDate:any = ""
  private curRow1:any = {}
  private isPrint:boolean = false
  private isCreated:boolean = false
  private isQuery:boolean = false
  private date2: any[] = []
  private date3: any[] = []
  private date4: any[] = []
  private ybxl1: any[] = []
  private ybxl2: any[] = []
  private ybxl3: any[] = []
  private ybxl4: any[] = []
  private jgName: any = JSON.parse(localStorage.userInfo).hospitalName
  private htmlApi1: string = ''
  private htmlSearchData1: any = {}
  private showLoading:boolean = false
  private htmlSearchData2: any = {
    ksrqstr: '',
    jsrqstr: '',
    jgName: this.jgName,
    ybxl: ''
  }
  private urlData:any = ""
  private htmlSearchData3: any = {
    beginDay: '',
    endDay: '',
    jgName: this.jgName,
    ybxl: ''
  }
  private htmlSearchData4: any = {
    jgName: this.jgName,
    ybxl: ''
  }
  private tableData1:any[] = []
  private ybxlList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.MED_INS_ROUTE : this.$store.state.webSqlDict.MED_INS_ROUTE // 医保线路
  private dialogVisible1: boolean = false
  private dialogVisible2: boolean = false
  private lastDate: string = '' // 收费汇总-取消汇总-上一次汇总日期
  private tableData2: any[] = [] // 收费汇总-查询列表
  private loading1: boolean = false
  private loading2: boolean = false
  private curRow2: any = {}

  get listSlotHeight(){
    return Vue.prototype.PageHeight - 80
  }
  get pickerOptionEnd(){
    let _this:any = this
    return{
      disabledDate(time: any) {
        return time.getTime() < Date.parse(_this.endDate) - 8.64e7 || time.getTime() > Date.now()
      }
    }
  }
  // 获取当前时间
  private getTime(){
    getNow({mzlb:this.ybxl1}).then((res: any) => {
      if(res){
        let date = parseTime(res.data, '{y}-{m}-{d} {h}:{i}:{s}')
        this.date1 = [date, date]
        this.endDate = date
      }
    })
  }
  private changeYbxl(value: any){
    this.htmlSearchData1.ybxl = value.join(',')
  }
   // 取消汇总选择行
  private rowClick1(row: any) {
    this.curRow1 = row
  }
  // 收费汇总-产生
  private create(){
    if(this.ybxl1.length == 0){
      this.$notify({
        title: '请选择医保线路',
        message: '',
        type: 'warning'
      })
      return false
    }
    this.$confirm(`最近一次汇总日期为${this.endDate}，请确认对${this.date1[0]}至${this.date1[1]}产生汇总`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      closeOnClickModal: false,
    }).then(()=>{
      let params1 = {
          mzlb: this.ybxl1,
          hzksrq:this.date1[0],
          hzjsrq:this.date1[1],
          save:0
      }
      getCreatSummary(params1).then((res: any) => {
        if (res.errorCode == 'SUCCESS') {
          let url = `${location.origin}/op-service/ghrbReport/doCreSfhzrb?token=${localStorage.getItem('token')}&reqStr=${encodeURIComponent(JSON.stringify(params1))}`
          this.urlData = url
          this.isCreated = true // 产生之后可以结账
          this.isPrint = false
        }
      }).catch((err: any) => {
        this.urlData = ''
        this.isCreated = false
        this.getTime()
      })
    }).catch(()=>{

    })
  }
  // 收费汇总-汇总
  private summary(){
    if(this.ybxl1.length == 0){
      this.$notify({
        title: '请选择医保线路',
        message: '',
        type: 'warning'
      })
      return false
    }
    this.$confirm(`最近一次汇总日期为${this.endDate}，请确认对${this.date1[0]}至${this.date1[1]}产生汇总`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      closeOnClickModal: false,
    }).then(()=>{
      let params1 = {
          mzlb: this.ybxl1,
          hzksrq:this.date1[0],
          hzjsrq:this.date1[1],
          save:0
      }
      getCreatSummary(params1).then((res: any) => {
        this.isCreated = false
        if (res.errorCode == 'SUCCESS') {
          doSaveSfrbhz(params1).then((res:any)=>{
            this.isPrint = true
            this.isQuery = false
            this.print()
            this.getTime()
          })
        }
      }).catch((err: any) => {
        this.urlData = ''
        this.isCreated = false
        this.getTime()
      })
    }).catch(()=>{

    })
  }
  // 打印
  private async print() {
    let params: any = {}
    if (this.isQuery) {
      params = {
        hzksrq: this.date1[0],
        hzjsrq: this.date1[1],
        save: 2,
        mzlb:this.ybxl1
      }
    } else {
      params = {
        hzksrq: this.date1[0],
        hzjsrq: this.date1[1],
        save: 2,
        mzlb:this.ybxl1
      }
    }
    let url = await `${location.origin}/op-service/ghrbReport/doCreSfhzrb?token=${localStorage.getItem('token')}&reqStr=${encodeURIComponent(JSON.stringify(params))}`
    const __qiankun__ = window.__POWERED_BY_QIANKUN__
    var LODOP: any = null
    if (__qiankun__) {
      LODOP = Vue.prototype.$getLodop()
    } else {
      LODOP = getLodop()
    }
    LODOP.PRINT_INIT('打印任务名')
    LODOP.SET_PRINT_PAGESIZE(1, '', '', 'A4') //A4 正向打印
    LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true) //宽度超出自动缩放
    LODOP.ADD_PRINT_URL(`0%`, `0%`, `100%`, `100%`, `URL:${url}`)
    // LODOP.LODOP.SET_PRINT_STYLEA(0, 'Offset2Top', -37)
    LODOP.PREVIEW() //预览
  }
  // 收费汇总-取消汇总查询
  private cancelSummary(){
    if(this.ybxl1.length == 0){
      this.$notify({
        title: '请选择医保线路',
        message: '',
        type: 'warning'
      })
      return false
    }
    this.dialogVisible1 = true
    this.loading1 = true
    this.curRow1 = {}
    doQueSfhzrbList({mzlb: this.ybxl1}).then((res: any) => {
      if(res){
        this.tableData1 = res.data
        // this.lastDate = res.data
        this.loading1 = false
      }
    })
  }

  // 收费汇总-确认取消汇总
  private confirmCancelSummary(){
    if (!this.curRow1.hzjsrq) {
      this.$notify({
        title: '请选择结账记录',
        message: '',
        type: 'warning',
      })
      return false
    }
    this.showLoading = true
    let params = {
      hzrq: this.curRow1.hzjsrq,
      mzlb: this.ybxl1
    }
    doCancelSfhzrb(params).then((res: any) => {
    this.showLoading = false
      if(res){
        this.$notify({
          title: '取消汇总成功',
          message: '',
          type: 'success'
        })
        this.dialogVisible1 = false
        this.getTime()
      }
    }).catch((err:any)=>{
      this.showLoading = false
    })
  }

  // 收费汇总-查询列表
  private query(){
    if(this.ybxl1.length == 0){
      this.$notify({
        title: '请选择医保线路',
        message: '',
        type: 'warning'
      })
      return false
    }
    this.dialogVisible2 = true
    this.loading2 = true
    this.curRow2 = {}
    doQueSfhzrbList({mzlb: this.ybxl1}).then((res: any) => {
      if(res){
        this.tableData2 = res.data
        this.urlData = ""
        this.loading2 = false
      }
    })
  }

  // 选择行
  private rowClick2(row: any){
    this.curRow2 = row
  }

  // 收费汇总-查询-确认
  private confirmQuery(){
    if(!this.curRow2.hzjsrq){
      this.$notify({
        title: '请选择汇总记录',
        message: '',
        type: 'warning'
      })
      return false
    }
    this.dialogVisible2 = false
    let params1 = {
      mzlb: this.ybxl1,
      hzksrq:this.date1[0],
      hzjsrq:this.date1[1],
      save:2
    }
    let url = `${location.origin}/op-service/ghrbReport/doCreSfhzrb?token=${localStorage.getItem('token')}&reqStr=${encodeURIComponent(JSON.stringify(params1))}`
    this.urlData = url
    this.isPrint = true
  }

  // 收费汇总-打印
  private print1(){
    this.isQuery = true
    this.print()
  }

  // 收费汇总查询
  private chargeSummaryQuery(){
    if(this.ybxl2.length == 0){
      this.$notify({
        title: '请选择医保线路',
        message: '',
        type: 'warning'
      })
      return false
    }
  }
  //初始化的周期函数
	created() {
    // console.log(this.ybxlList)
    this.ybxl1 = this.ybxlList[0].dv || ""
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
    width:50%
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

.explain{
  margin: 10px 0;
  div{
    font-size: 14px;
  }
  p{
    margin: 4px 0 0 8px;
    font-size: 13px;
  }
}
.last-date{
  margin-bottom: 20px;
  font-size: 15px;
  text-align: center;
}

.statement-box {
  width: 950px;
  // padding: 0 4rem;
}
#iframe {
  width: calc(100% + 24px);
  height: auto;
  // visibility: collapse;
}
.iframe-body {
  width: 100%;
  overflow: hidden;
}
</style>
