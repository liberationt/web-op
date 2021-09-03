<template>
  <div class="content">
    <div class="his-module his-small ht">
      <div class="row">
        <div class="label">
          <div class="title">收费日报</div>
          <el-divider direction="vertical"></el-divider>
          <!-- <el-date-picker type="daterange" v-model="date" value-format="yyyy-MM-dd" start-placeholder="开始时间" end-placeholder="结束时间" class="date-wrapper"></el-date-picker> -->
          <el-date-picker class="date-wrapper" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="date" type="datetime" placeholder="选择日期" :picker-options="pickerOptionEnd" @focus="changeData"> </el-date-picker>
          <el-divider direction="vertical"></el-divider>
          <div class="btn">
            <el-button type="text" size="mini" @click="create">
              <i class="icon his-tree-submen blue"></i>
              <span>产生</span>
            </el-button>
            <el-button type="text" size="mini" @click="checkOut" :disabled="!isCreated">
              <i class="icon his-caozuo-mon-statement green"></i>
              <span>结账</span>
            </el-button>
            <el-button type="text" size="mini" @click="cancelCheckOutQuery">
              <i class="icon his-caozuo-mon-statement-cancel red"></i>
              <span>取消结账</span>
            </el-button>
            <el-button type="text" size="mini" @click="query">
              <i class="icon his-caozuo-Details blue"></i>
              <span>查询</span>
            </el-button>
            <el-button type="text" size="mini" :disabled="!isPrint" @click="print">
              <i class="icon his-btn-print blue"></i>
              <span>打印</span>
            </el-button>
          </div>
        </div>
      </div>

      <div class="statement-box">
        <!-- <statement
          ref="statement"
          html-api="/op-service/ghrbReport/doCreateSfrb"
          :html-search-data="htmlSearchData"
          :height="listSlotHeight"
          :print-arg="{
            top: '8%',
            left: '10%',
            width: '90%',
            height: '87%',
          }"
          @hadUrl="isCreated = true"
        /> -->
        <!-- <iframe class="scroll-bar" :src="urlData" border="0" frameborder="0" width="100%" :height="listSlotHeight + 100"></iframe> -->
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
    </div>

    <el-dialog :title="'取消结账'" :visible.sync="dialogVisible1" width="400px" :close-on-click-modal="false" class="narrow-dialog" v-elDraggableDialog>
      <div class="explain">
        <div>取消日结说明</div>
        <p>1、取消结账日报请慎重</p>
        <p>2、每次取消结账只能取消最近的一次日终结账</p>
        <p>3、结账日报取消后不能恢复，只能重新结账</p>
      </div>
      <div class="his-module his-small">
        <pagenation-list
          ref="pageTable"
          v-model="tableData1"
          data-url="/op-service/ghrbReport/doQueSfrbList"
          http-method="post"
          :list-height="listSlotHeight"
          :searchData="searchData"
        >
          <div slot="list">
            <el-table stripe ref="table" :highlight-current-row="true" :data="tableData1" @row-click="rowClick1" @row-dblclick="dblClick1" border height="350" class="scroll-bar" tooltip-effect="light" v-loading="loading1">
              <el-table-column type="index" width="32" align="center"></el-table-column>

              <!-- 结账日期 -->
              <el-table-column prop="jzrq" :label="'结账日期'"></el-table-column>

              <!-- 操作工号 -->
              <el-table-column prop="czgh" :label="'操作工号'"></el-table-column>
            </el-table>
          </div>
        </pagenation-list>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="cancelCheckOut" :loading="showLoading">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="'日报选择'" :visible.sync="dialogVisible2" width="400px" :close-on-click-modal="false" class="narrow-dialog" v-elDraggableDialog>
      <div class="his-module his-small">
        <pagenation-list
			  ref="pageTable"
			  v-model="tableData2"
			  data-url="/op-service/ghrbReport/doQueSfrbList"
			  http-method="post"
			  :list-height="listSlotHeight"
        :searchData="searchData"
      >
      <div slot="list">
        <el-table stripe ref="table" :highlight-current-row="true" :data="tableData2" @row-click="rowClick2" @row-dblclick="dblClick2" border height="350" class="scroll-bar" tooltip-effect="light" v-loading="loading2">
          <el-table-column type="index" width="32" align="center"></el-table-column>
          <!-- 结账日期 -->
          <el-table-column prop="jzrq" :label="'结账日期'"></el-table-column>
        </el-table>
      </div>
      </pagenation-list>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="queryCommit" :loading="showLoading">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aGetLastHzrq, doSaveSfrb, doGetLastJzrq, aCreateSfrb, aQueryVerification, aQueryCancelCommit, aCancelCommit, doCancelSfrb, aQuerySQL, doQueSfrbList } from '@/api/his/op/reg/chargeReport'
import { getNow } from '@/api/his/basic'
import { parseTime } from '@/utils'
import { btnDisabled } from '@/directives'
import { util } from 'node_modules/@types/prettier'
import { getLodop } from '@/plugins/lodop/index.js'
import { error } from 'console'

declare interface IObj {
  [key: string]: string
}

@Component({
  name: '',
})
export default class extends Vue {
  private obj: IObj = {
    name: '',
    value: '',
  }
  private date: any = '' // 当前时间
  private endDate: any = '' // 最后一次结账时间
  private urlData: any = '' // 页面展示地址
  private isCreated: boolean = false // 是否可以结账
  private isPrint: boolean = false // 是否可以打印
  private isQuery: boolean = false // 是否是查询打印
  private formData: any = {}
  private showLoading:boolean = false
  private htmlSearchData: any = {
    beginDay: '',
    endDay: '',
    jzrq: '',
    save: '',
  }

  private dialogVisible1: boolean = false
  private tableData1: any[] = []
  private loading1: boolean = false
  private curRow1: any = {}
  private dialogVisible2: boolean = false
  private tableData2: any[] = []
  private loading2: boolean = false
  private curRow2: any = {}
  private searchData: any = {} // 结算弹框列表查询条件
  get listSlotHeight() {
    return Vue.prototype.PageHeight - 198
  }

  // 获取当前时间
  private getTime() {
    getNow().then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        if (res.data) {
          this.date = parseTime(res.data, '{y}-{m}-{d} {h}:{i}:{s}')
        }
      }
    })
  }
  get pickerOptionEnd(){
    let _this:any = this
    return{
      disabledDate(time: any) {
        return time.getTime() < Date.parse(_this.endDate) || time.getTime() > Date.now()
      }
    }
  }
  // 获取最后一次结账时间
  private queryDate() {
    doGetLastJzrq({}).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        if (res.data) {
          this.endDate = res.data
          // this.$forceUpdate()
        }
      }
    })
  }

  // 产生(新逻辑)
  private create() {
    let params: any = {
      jzksrq: this.endDate,
      jzjsrq: this.date,
      save: 0,
    }
    this.$confirm(`最近一次结账日期为${this.endDate}，请确认对${this.date}产生日报`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      closeOnClickModal: false,
    }).then(() => {
        aQueryVerification({ jzjsrq: this.date })
          .then((res: any) => {
            if (res.errorCode == 'SUCCESS') {
              let url = `${location.origin}/op-service/ghrbReport/doCreSfrb?token=${localStorage.getItem('token')}&REQUEST-IP=${localStorage.getItem('ipInfo')}&reqStr=${encodeURIComponent(JSON.stringify(params))}`
              this.urlData = url
              this.isCreated = true // 产生之后可以结账
              this.isPrint = false
            }
          })
          .catch((err: any) => {
            this.urlData = ''
            this.isCreated = false
            this.getTime()
          })
      })
      .catch(() => {})
  }
  // 结账(旧逻辑)
  // private checkOut() {
  //   let params = {
  //     beginDay: this.date[0],
  //     endDay: this.date[1],
  //   }
  //   aGetLastHzrq(params).then((res: any) => {
  //     if (res) {
  //       if (res.data != '') {
  //         if (this.date[0] != res.data) {
  //           // this.date[0] = res.data
  //         }
  //         let msgDate
  //         if (this.date[0] == this.date[1]) {
  //           msgDate = this.date[1]
  //         } else {
  //           msgDate = `${res.data}至${this.date[1]}`
  //         }
  //         this.$confirm(`最近一次结账日期为${res.data}，请确认对${msgDate}进行结账`, '提示', {
  //           confirmButtonText: '确定',
  //           cancelButtonText: '取消',
  //           type: 'warning',
  //           closeOnClickModal: false,
  //         })
  //           .then(() => {
  //             aQueryVerification().then((res: any) => {
  //               if (res) {
  //                 getNow().then((res: any) => {
  //                   if (res) {
  //                     let jzrq = parseTime(res.data, '{y}-{m}-{d} {h}:{i}:{s}')
  //                     this.htmlSearchData.beginDay = this.date[0]
  //                     this.htmlSearchData.endDay = this.date[1]
  //                     this.htmlSearchData.jzrq = jzrq
  //                     this.htmlSearchData.save = 1
  //                     const statement: any = this.$refs.statement
  //                     statement.getTableUrl()
  //                   }
  //                 })
  //               }
  //             })
  //           })
  //           .catch(() => {})
  //       } else {
  //         this.$confirm(`当前是第一次结账，请确认至${this.date[1]}进行结账`, '提示', {
  //           confirmButtonText: '确定',
  //           cancelButtonText: '取消',
  //           type: 'warning',
  //           closeOnClickModal: false,
  //         })
  //           .then(() => {
  //             aQueryVerification().then((res: any) => {
  //               if (res) {
  //                 getNow().then((res: any) => {
  //                   if (res) {
  //                     let jzrq = parseTime(res.data, '{y}-{m}-{d} {h}:{i}:{s}')
  //                     this.htmlSearchData.beginDay = this.date[0]
  //                     this.htmlSearchData.endDay = this.date[1]
  //                     this.htmlSearchData.jzrq = jzrq
  //                     this.htmlSearchData.save = 1
  //                     const statement: any = this.$refs.statement
  //                     statement.getTableUrl()
  //                   }
  //                 })
  //               }
  //             })
  //           })
  //           .catch(() => {})
  //       }
  //     }
  //   })
  // }

  // 结账(新逻辑)
  private checkOut() {
    let params: any = {
      jzksrq: this.endDate,
      jzjsrq: this.date,
      save: 0,
    }
    aQueryVerification({ jzjsrq: this.date }).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.$confirm(`最近一次结账日期为${this.endDate}，请确认对${this.date}进行结账`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
        })
          .then(() => {
            this.isCreated = false
            doSaveSfrb(params).then((res: any) => {
              if (res.errorCode == 'SUCCESS') {
                this.isPrint = true
                this.isQuery = false
                this.print()
                this.getTime()
                this.queryDate()
              }
            })
          })
          .catch(() => {})
      }
    })
  }

  // 取消结账查询
  private cancelCheckOutQuery() {
    this.dialogVisible1 = true
    // this.loading1 = true
    this.curRow1 = {}
    this.$nextTick(()=>{
      this.getLists()
    })
    // doQueSfrbList({}).then((res: any) => {
    //   if (res.errorCode == 'SUCCESS') {
    //     this.tableData1 = res.data
    //     this.loading1 = false
    //     this.isPrint = false
    //     this.getTime()
    //     this.$nextTick(() => {
    //       this.queryDate()
    //     })
    //   }
    // }).catch((err:any)=>{
    // })
  }

  // 选择行
  private rowClick1(row: any) {
    this.curRow1 = row
  }

  // 选择行
  private dblClick1(row: any) {}

  // 取消结账
  private cancelCheckOut() {
    if (!this.curRow1.jzrq) {
      this.$notify({
        title: '请选择结账记录',
        message: '',
        type: 'warning',
      })
      return false
    }
    this.showLoading = true
    doCancelSfrb({ jzrq: this.curRow1.jzrq }).then((res: any) => {
      this.showLoading = false
      if (res.errorCode == 'SUCCESS') {
        this.$notify({
          title: '取消结账成功',
          message: '',
          type: 'success',
        })
        this.dialogVisible1 = false
        this.urlData=""
        this.getTime()
        this.queryDate()
      }
    }).catch((err:any)=>{
      this.showLoading = false
    })
  }

  // 查询(旧逻辑)
  // private query() {
  //   this.dialogVisible2 = true
  //   this.loading2 = true
  //   this.curRow2 = {}
  //   let params = {
  //     beginDay: this.date[0],
  //     endDay: this.date[1],
  //   }
  //   aQuerySQL(params).then((res: any) => {
  //     if (res) {
  //       this.tableData2 = res.data
  //       this.loading2 = false
  //     }
  //   })
  // }

  // 查询(新逻辑)
  private query() {
    this.dialogVisible2 = true
    // this.loading2 = true
    this.curRow2 = {}
    this.$nextTick(()=>{
      this.getLists()
    })
    // return
    // doQueSfrbList({pageSize:10,pageNum:1,}).then((res: any) => {
    //   if (res.errorCode == 'SUCCESS') {
    //     this.tableData2 = res.data
    //     this.loading2 = false
    //   }
    // })
  }
  // 查询结账记录
  private getLists(){
    ;(this.$refs.pageTable as any).getList()
  }

  // 选择行
  private rowClick2(row: any) {
    this.curRow2 = row
  }

  // 选择行
  private dblClick2(row: any) {}

  // 查询确认
  private queryCommit() {
    if (!this.curRow2.jzrq) {
      this.$notify({
        title: '请选择结账记录',
        message: '',
        type: 'warning',
      })
      return false
    } else {
      let params: any = {
        jzjsrq: this.curRow2.jzrq,
        save: 2,
        jzksrq:this.curRow2.jzksrq
      }
      // let url = `http://192.168.55.211:81/op-service/ghrbReport/doCreSfrb?reqStr=${encodeURIComponent(JSON.stringify(params))}`
      let url = `${location.origin}/op-service/ghrbReport/doCreSfrb?token=${localStorage.getItem('token')}&REQUEST-IP=${localStorage.getItem('ipInfo')}&reqStr=${encodeURIComponent(JSON.stringify(params))}`
      this.urlData = url
      this.isPrint = true
      this.isQuery = true
      this.isCreated = false
    }
    this.dialogVisible2 = false
  }

  // 打印
  private async print() {
    let params: any = {}
    if (this.isQuery) {
      params = {
        jzksrq: this.endDate,
        jzjsrq: this.curRow2.jzrq,
        save: 2,
      }
    } else {
      params = {
        jzksrq: this.endDate,
        jzjsrq: this.date,
        save: 2,
      }
    }
    // let url = `http://192.168.55.211:81/op-service/ghrbReport/doCreSfrb?reqStr=${encodeURIComponent(JSON.stringify(params))}`
    let url = await `${location.origin}/op-service/ghrbReport/doCreSfrb?token=${localStorage.getItem('token')}&REQUEST-IP=${localStorage.getItem('ipInfo')}&reqStr=${encodeURIComponent(JSON.stringify(params))}`
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

  // 时间框获焦执行的方法
  private changeData() {
    // this.queryDate()
  }

  //初始化的周期函数
  created() {
    this.getTime()
  }
  mounted() {
    this.queryDate()

}
}
</script>

<style lang="scss" scoped>
.el-date-editor {
  width: 240px;
}

.explain {
  margin: 10px 0;
  div {
    font-size: 14px;
  }
  p {
    margin: 4px 0 0 8px;
    font-size: 13px;
  }
}

.statement-box {
  width: 900px;
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
