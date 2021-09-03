<template>
  <div class="content">
    <div class="his-module his-small upper">
      <div class="row">
        <div class="label">
          <div class="title">票据查询</div>
          <el-divider direction="vertical"></el-divider>
          <div class="btn">

            <el-button size="mini" type="text" @click="searchLists">
              <i class="icon his-caozuo-Details blue"></i>
              <span>查询</span>
            </el-button>

            <el-button size="mini" type="text" @click="reset">
              <i class="icon his-btn-reset green"></i>
              <span>重置</span>
            </el-button>

            <el-button size="mini" type="text" @click="rePrint">
              <i class="icon his-btn-print blue"></i>
              <span>票据补打</span>
            </el-button>

          </div>
        </div>
      </div>
      <div class="">
        <el-form :model="formData" label-width="60px" class="form3 clearfix" ref="form">

          <!-- 发票号码 -->
          <div class="form-area item-fphm">
            <el-form-item :label="'发票号码'" prop="beginPjhm">
              <el-input v-model="formData.beginPjhm" :placeholder="'请输入起始号码'"></el-input>
            </el-form-item>
            <span>-</span>
            <el-form-item :label="''" label-width="0" prop="endPjhm">
              <el-input v-model="formData.endPjhm" :placeholder="'请输入终止号码'"></el-input>
            </el-form-item>
          </div>

          <!-- 收费日期 -->
          <div class="form-area">
            <el-form-item :label="'收费日期'" prop="date">
              <el-date-picker type="daterange" v-model="date" value-format="yyyy-MM-dd" start-placeholder="开始时间"
                end-placeholder="结束时间" class="date-wrapper"></el-date-picker>
            </el-form-item>
          </div>

          <!-- 患者性质 -->
          <div class="form-area">
            <el-form-item :label="'患者性质'" prop="brxz">
              <search-select table-name="SYS_DICT_CONFIG" kid="14" v-model="formData.brxz"
                :backfillValue="formData.brxz" :placeholder="'请选择患者性质'" />
            </el-form-item>
          </div>

          <!-- 病人姓名 -->
          <div class="form-area">
            <el-form-item :label="'病人姓名'" prop="brxm">
              <el-input v-model="formData.brxm" :placeholder="'请输入病人姓名'"  @keyup.enter.native="searchLists"></el-input>
            </el-form-item>
          </div>


          <!-- 卡号 -->
          <div class="form-area">
            <el-form-item :label="'卡号'" prop="jzkh">
              <el-input v-model="formData.jzkh" :placeholder="'请输入卡号'" @keyup.enter.native="searchLists"></el-input>
            </el-form-item>
          </div>

          <!-- 收款员 -->
          <div class="form-area">
            <el-form-item :label="'收款员'" prop="czgh">
              <search-select table-name="SYS_DICT_CONFIG" kid="12" v-model="formData.czgh"
                :backfillValue="formData.czgh" :placeholder="'请选择收款员'" />
            </el-form-item>
          </div>

        </el-form>
      </div>
    </div>
    <div class="his-module his-small lower">
      <!-- <div class="row">
        <div class="label">
          <div class="searchTitle">卡内信息</div>
          <el-input
            class="search"
            :placeholder="'请输入拼音码查询'"
          >
            <i slot="prefix" class="el-input__icon icon his-search"></i>
          </el-input>
        </div>
      </div> -->
      <pagenation-list ref="pageTable" v-model="tableData" data-url="/op-service/mpikpxx/doQueryCzFkxxList"
        :search-data="formData" http-method="post" :list-height="listSlotHeight">
        <el-table slot="list" stripe ref="table" :highlight-current-row="true" :data="tableData" @row-click="getDetail"
          @row-dblclick="dblclick" border :height="listSlotHeight" class="scroll-bar" tooltip-effect="light">
          <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>

          <!-- 门诊号码 -->
          <el-table-column prop="mzhm" :label="'档案号码'"></el-table-column>

          <!-- 发票号码 -->
          <el-table-column prop="czpj" :label="'票据号码'"></el-table-column>

          <!-- 真实发票号码 -->
          <!-- <el-table-column prop="zsfphm" :label="'真实发票号码'" min-width="100"></el-table-column> -->

          <!-- 卡号 -->
          <el-table-column prop="jzkh" :label="'卡号'"></el-table-column>

          <!-- 病人id -->
          <!-- <el-table-column prop="brid" :label="'患者ID'" width="90"></el-table-column> -->

          <!-- 病人姓名 -->
          <el-table-column prop="brxm" :label="'患者姓名'"></el-table-column>

          <!-- 患者性质 -->
          <el-table-column prop="brxz" :label="'患者性质'" min-width="100">
            <template slot-scope="scope">
              <div v-if="brxzList.find(item => item.dv==scope.row.brxz)">
                {{brxzList.find(item => item.dv==scope.row.brxz).dn}}
              </div>
              <div v-else>{{scope.row.brxz}}</div>
            </template>
          </el-table-column>

          <!-- 收费员 -->
          <el-table-column prop="czgh" :label="'收费员'">
            <template slot-scope="scope">
              <div v-if="usersList.find(item => item.dv==scope.row.czgh)">
                {{usersList.find(item => item.dv==scope.row.czgh).dn}}
              </div>
              <div v-else>{{scope.row.czgh}}</div>
            </template>
          </el-table-column>

          <!-- 收费日期 -->
          <el-table-column prop="czrq" :label="'充值日期'" min-width="140"></el-table-column>

          <!-- 汇总日期 -->
          <el-table-column prop="hzrq" :label="'汇总日期'" class-name="text-blue-td"></el-table-column>

           <!-- 结账日期 -->
           <el-table-column prop="jzrq" :label="'结账日期'" class-name="text-blue-td"></el-table-column>
           
           <!-- 充值方式 -->
          <el-table-column prop="czfs" :label="'充值方式'" class-name="text-blue-td"></el-table-column>

          <!-- 充值金额 -->
          <el-table-column prop="czje" :label="'充值金额'" class-name="text-blue-td"></el-table-column>

          <!-- 门诊类别 -->
          <el-table-column prop="mzlb" :label="'门诊类别'">
            <template slot-scope="scope">
              <div v-if="opTypeList.find(item => item.dv==scope.row.mzlb)">
                {{opTypeList.find(item => item.dv==scope.row.mzlb).dn}}
              </div>
              <div v-else>{{scope.row.mzlb}}</div>
            </template>
          </el-table-column>

        </el-table>
      </pagenation-list>
    </div>
  </div>
</template>

<script lang='ts'>
  import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
  import { getNow } from '@/api/his/basic'
  import { parseTime } from '@/utils'
  import { aQueryFphm } from '@/api/his/op/reg/regInvoiceVoid.ts'
  import { aQueryDjDetails, aPrintMoth,printBd } from '@/api/his/op/reg/settlement.ts'
  // import invoiceVoid from './components/invoiceVoid.vue'
  import { getFloat, mul, numtochinese } from '@/utils'
  import { getLodop } from '@/plugins/lodop/index.js'

  declare interface IObj {
    [key: string]: string
  }

  @Component({
    name: '',
    // components: {
    //   invoiceVoid,
    // },
  })

  export default class extends Vue {
    private obj: IObj = {
      name: '',
      value: '',
    }
    private formData: any = {
      beginPjhm: '',
      endPjhm: '',
      beginCzrq: '',
      endCzrq: '',
      brxz: '',
      brxm: '',
      jzkh: '',
      czgh: '', // 收款员
    }
    private date: any[] = []
    private tableData: any[] = []
    private searchData: any = {}
    private deptList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REGISTERATION_DEPARTMENT_DICT : this.$store.state.webSqlDict.REGISTERATION_DEPARTMENT_DICT // 挂号科室
    private docList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT // 医生
    private usersList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.USERS_DICT : this.$store.state.webSqlDict.USERS_DICT // 用户列表
    private opTypeList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.OUTPATIENT_TYPE : this.$store.state.webSqlDict.OUTPATIENT_TYPE // 门诊类别
    private brxzList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_PATIENT_DICT : this.$store.state.webSqlDict.TABLE_PATIENT_DICT // 病人性质
    private statusList: any[] = [
      { dv: 0, dn: '正常挂号' },
      { dv: 1, dn: '退号' },
      { dv: 2, dn: '废号' },
    ]
    private curRow: any = {}

    private botHjje: any = '0.00'
    private botXj: any = '0.00'
    private botZh: any = '0.00'
    private botQt: any = '0.00'
    private jlxh:String = ''

    // 子组件
    private patientInfo: any = {}
    private djDetails: any = []
    private fphm1: string = ''
    private fphm2: string = ''
    private isVoid: boolean = true // 作废/取消作废
    private ivKeyIndex: number = 1

    // 打印相关
    private htmlSearchData: any = {
      fphm: '',
      jgName: JSON.parse(localStorage.userInfo).hospitalName,
    }

    get listSlotHeight() {
      return Vue.prototype.PageHeight - 198
    }

    // 监听方法
    @Watch('tableData')
    private onValueChange(value: any) {
      this.botHjje = '0.00'
      this.botXj = '0.00'
      this.botZh = '0.00'
      this.botQt = '0.00'
    }

    // 获取当前时间
    private getTime() {
      getNow().then((res: any) => {
        if (res) {
          let date = parseTime(res.data, '{y}-{m}-{d}')
          this.date = [date, date]
        }
      })
    }

    // 获取列表
    private getLists() {
      const pageTable: any = this.$refs['pageTable']
      pageTable.getList()
    }

    // 条件查询
    private searchLists() {
      this.formData.beginCzrq = this.date[0]
      this.formData.endCzrq = this.date[1]
      const pageTable: any = this.$refs['pageTable']
      pageTable.searchList()
    }

    // 重置
    private reset() {
      const form: any = this.$refs.form
      form.resetFields()
      this.getTime()
    }
    // 查询
    private queryMzqd() {
      if (this.fphm1) {
        const statement: any = this.$refs.statement
        statement.getTableUrl()
      } else {
        this.$notify({
          title: '请选择发票信息',
          message: '',
          type: 'warning'
        })
      }
    }
    // 发票补打
    private async rePrint() {
      if (this.jlxh) {
        let params = {
          // fphm: this.fphm1,
          // jgName: JSON.parse(localStorage.getItem('userInfo') as any).hospitalName,
          // yb: false,
          // zsfphm: '',
          jlxh:this.jlxh
        }
        let res = await printBd(params)
        this.printChargeBill(res.data)
      } else {
        this.$notify({
          title: '请选择发票信息',
          message: '',
          type: 'warning'
        })
      }
    }

    private printChargeBill(res: any) {
      const __qiankun__ = window.__POWERED_BY_QIANKUN__
      let LODOP: any = null
      if (__qiankun__) {
        LODOP = Vue.prototype.$getLodop()
      } else {
        LODOP = getLodop()
      }
      if (!LODOP) {
        console.log('没有安装打印控件');
        this.$emit('resetForm')
        // 是否继续结算
        let prevRecord = JSON.parse(localStorage.getItem('opSettlePrevRecord') as any)
        this.$emit('checkMultiple', prevRecord.jzkh, prevRecord.cardtype)
        return false
      }

      LODOP.PRINT_INIT('储值卡收据')
      LODOP.SET_PRINT_PAGESIZE(1, '241mm', '140mm', '')
      LODOP.SET_PRINT_STYLE('FontSize', 12)
      LODOP.ADD_PRINT_TEXT('16mm', '60mm', '64mm', '4mm', '储值卡收据')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 13)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)

      LODOP.ADD_PRINT_TEXT('35mm', '28mm', '50mm', '4mm', '姓名      '+ res.brxm)
      LODOP.ADD_PRINT_TEXT('35mm', '106mm', '50mm', '4mm', '卡号      '+ res.jzkh)
      LODOP.ADD_PRINT_TEXT('45mm', '28mm', '50mm', '4mm', '性别      '+ (res.brxb== '1' ? '男' : '女'))
      LODOP.ADD_PRINT_TEXT('45mm', '106mm', '50mm', '4mm', '押金余额  ' + res.czje.toFixed(2))
      LODOP.ADD_PRINT_TEXT('55mm', '28mm', '50mm', '4mm', '支付方式  ' + this.handelStyle(res.czfs))
      LODOP.ADD_PRINT_TEXT('55mm', '106mm', '50mm', '4mm', '收据号    '   + res.czpj)
      LODOP.ADD_PRINT_TEXT('65mm', '28mm', '50mm', '4mm', '支付金额  ' + res.czje.toFixed(2))
      LODOP.ADD_PRINT_TEXT('65mm', '106mm', '50mm', '4mm', '支付方式  ' + this.handelStyle(res.czfs))
      LODOP.ADD_PRINT_TEXT('75mm', '28mm', '50mm', '4mm', '交易时间  ' + res.czrq)
      LODOP.ADD_PRINT_TEXT('75mm', '106mm', '50mm', '4mm', '支票号    ' )

      LODOP.ADD_PRINT_TEXT('90mm', '28mm', '60mm', '4mm', '操作员    '  + res.czgh)
      LODOP.ADD_PRINT_TEXT('90mm', '106mm', '60mm', '4mm', '医院签章  ' )
      LODOP.PREVIEW()
    }

    // 单击行
    private getDetail(row: any) {
      this.curRow = row
      this.fphm1 = row.fphm
      this.isVoid = row.zfrq == null ? true : false
      this.htmlSearchData.fphm = row.fphm
      this.jlxh = row.jlxh
    }

    // 双击行
    private dblclick(row: any) {
    }

    private handelStyle(num:any){
      let title
      switch (num) {
        case 1:
          title="现金"
          break;
        case 2:
          title="支票"
          break;
        case 3:
          title="pos"
          break;
        case 36:
          title="充值卡"
          break;
      }
      return title
    }

    // 打开作废/取消作废弹窗
    private openVoidDialog() {
      const iv: any = this.$refs['invoice-void']
      iv.openDialog()
    }

    // 获取发票详情
    private getFpDetail(fphm: string) {
      aQueryFphm({ fphm: fphm }).then((res: any) => {
        if (res) {
          this.patientInfo = res.data.fpzfBrdaResp // 获取病人信息
          let params = {
            brxz: this.patientInfo.brxz,
            fpcx: 0,
            zfblList: res.data.resultList
          }
          aQueryDjDetails(params).then((res: any) => {
            if (res) {
              this.djDetails = res.data
              this.$nextTick(() => {
                const ivc: any = this.$refs['invoice-void']
                ivc.transform()
              })

            }
          })
        }
      })
    }

    // 关闭弹窗时触发
    private closeVoidDialog() {
      this.ivKeyIndex++
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
  .content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .upper {
    height: auto;
  }

  .lower {
    flex-grow: 1;
    margin-top: 10px;
  }

  .table-wrap {
    table {
      td {
        &:nth-child(odd) {
          width: 18%;
        }

        &:nth-child(even) {
          // width: calc(100%/3*60%);
        }
      }
    }
  }

  .normal-form-wrap {
    .el-form {
      width: 30%;
      margin: 40px auto 0;
    }
  }

  //三列表单
  .form3 {
    margin: 0 !important;

    .el-form-item {

      .search-select {
        width: 100%;
      }
    }

    .form-area {
      float: left;
      width: calc((100% - 16px*2)/3);
      margin-right: 16px;
      margin-bottom: 8px !important;

      // border: 1px solid #f00;
      &:nth-child(3n) {
        margin-right: 0;
      }

      &:nth-last-child(-n+3) {
        margin-bottom: 0 !important;
      }

      &.item-fphm {
        .el-form-item {
          display: inline-block;

          &:nth-child(1) {
            width: calc((100% - 60px - 10px)/2 + 60px);
          }

          &:nth-child(3) {
            width: calc((100% - 60px - 10px)/2);
          }
        }

        span {
          display: inline-block;
          width: 10px;
          text-align: center;
        }
      }

      .el-form-item {
        margin-bottom: 0;
      }
    }
  }

  .btns {
    margin-top: 30px;
    text-align: center;

    .el-button {
      display: inline-block;
      width: calc((100% - 20px)/3);
      text-align: center;
    }

    .el-button--default {
      color: $second;
    }
  }

  .totalMoney {
    font-size: 13px;
    width: auto;

    p {
      margin-right: 20px;
    }

    em {
      font-family: "siyuanMedium";
      color: #1485ff;
    }
  }
</style>