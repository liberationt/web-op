<template>
  <div class="content">
    <div class="his-module his-small upper">
      <div class="row">
        <div class="label">
          <div class="title">发票查询</div>
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

            <el-button size="mini" type="text" @click="queryMzqd">
              <i class="icon his-btn-print blue"></i>
              <span>门诊清单</span>
            </el-button>

            <el-button size="mini" type="text" @click="queryDetails">
              <i class="icon his-caozuo-Details blue"></i>
              <span>单据查询</span>
            </el-button>

            <el-button size="mini" type="text" @click="rePrint(1)" :loading="isShowLoad">
              <i class="icon his-btn-print blue"></i>
              <span>发票补打</span>
            </el-button>

            <el-button size="mini" type="text" @click="rePrint(2)" :loading="isShowLoads" >
              <i class="icon his-btn-print blue"></i>
              <!-- <span>打印真实发票</span> -->
              <span>发票重打</span>
            </el-button>

          </div>
        </div>
      </div>
      <div class="">
        <el-form :model="formData" label-width="60px" class="form3 clearfix" ref="form">

          <!-- 发票号码 -->
          <div class="form-area item-fphm">
            <el-form-item :label="'发票号码'" prop="beginFphm">
              <el-input
                v-model="formData.beginFphm"
                :placeholder="'请输入起始号码'"
                 @keyup.enter.native="searchLists"
              ></el-input>
            </el-form-item>
            <span>-</span>
            <el-form-item :label="''" label-width="0" prop="endFphm">
              <el-input
                v-model="formData.endFphm"
                :placeholder="'请输入终止号码'"
                 @keyup.enter.native="searchLists"
              ></el-input>
            </el-form-item>
          </div>

          <!-- 收费日期 -->
          <div class="form-area">
            <el-form-item :label="'收费日期'" prop="date">
              <el-date-picker
                type="daterange"
                v-model="date"
                value-format="yyyy-MM-dd"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                class="date-wrapper"
              ></el-date-picker>
            </el-form-item>
          </div>

          <!-- 患者性质 -->
          <div class="form-area">
            <el-form-item :label="'患者性质'" prop="brxz">
              <search-select
                table-name="SYS_DICT_CONFIG"
                kid="14"
                v-model="formData.brxz"
                :backfillValue="formData.brxz"
                :placeholder="'请选择患者性质'"
              />
            </el-form-item>
          </div>

          <!-- 病人姓名 -->
          <div class="form-area">
            <el-form-item :label="'病人姓名'" prop="brxm">
              <el-input
                v-model="formData.brxm"
                :placeholder="'请输入病人姓名'"
                 @keyup.enter.native="searchLists"
              ></el-input>
            </el-form-item>
          </div>


          <!-- 卡号 -->
          <div class="form-area">
            <el-form-item :label="'卡号'" prop="jzkh">
              <el-input
                v-model="formData.jzkh"
                :placeholder="'请输入卡号'"
                 @keyup.enter.native="searchLists"
              ></el-input>
            </el-form-item>
          </div>

          <!-- 收款员 -->
          <div class="form-area">
            <el-form-item :label="'收款员'" prop="czgh">
              <search-select
                table-name="SYS_DICT_CONFIG"
                kid="12"
                v-model="formData.czgh"
                :backfillValue="formData.czgh"
                :placeholder="'请选择收款员'"
              />
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
      <pagenation-list
        ref="pageTable"
        v-model="tableData"
        data-url="/op-service/opmzxx/doQueryReceivablesInvoice"
        :search-data="formData"
        http-method="post"
        :list-height="listSlotHeight"
      >
        <el-table
          slot="list"
          stripe
          ref="table"
          :highlight-current-row="true"
          :data="tableData"
          @row-click="getDetail"
          @row-dblclick="dblclick"
          border
          :height="listSlotHeight"
          class="scroll-bar"
          tooltip-effect="light"
        >
          <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>

          <!-- 门诊号码 -->
          <el-table-column prop="mzhm" :label="'档案号码'"></el-table-column>

          <!-- 发票号码 -->
          <el-table-column prop="fphm" :label="'发票号码'"></el-table-column>

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
          <el-table-column prop="ysfy" :label="'收费员'">
            <template slot-scope="scope">
              <div v-if="usersList.find(item => item.dv==scope.row.ysfy)">
                {{usersList.find(item => item.dv==scope.row.ysfy).dn}}
              </div>
              <div v-else>{{scope.row.ysfy}}</div>
            </template>
          </el-table-column>

          <!-- 收费日期 -->
          <el-table-column prop="sfrq" :label="'收费日期'" min-width="140"></el-table-column>

          <!-- 总金额 -->
          <el-table-column prop="zjje" :label="'总金额'" class-name="text-blue-td"></el-table-column>

          <!-- 金额 -->
          <el-table-column prop="zfje" :label="'金额'" class-name="text-blue-td"></el-table-column>

          <!-- 标识 -->
          <el-table-column prop="zfpb" :label="'标识'">
            <template slot-scope="scope">
              <span v-if="scope.row.zfpb==1">作废</span>
              <span v-if="scope.row.zfpb==2">重打</span>
              <span v-if="scope.row.zfpb==3">重打作废</span>
            </template>
          </el-table-column>

          <!-- 作废日期 -->
          <el-table-column prop="zfrq" :label="'作废日期'" min-width="140"></el-table-column>

          <!-- 结账日期 -->
          <el-table-column prop="jzrq" :label="'结账日期'" min-width="140"></el-table-column>

          <!-- 汇总日期 -->
          <el-table-column prop="hzrq" :label="'汇总日期'" min-width="140"></el-table-column>

          <!-- 现金支付 -->
          <el-table-column prop="xjje" :label="'现金支付'" class-name="text-blue-td"></el-table-column>

          <!-- 支票支付 -->
          <el-table-column prop="zpje" :label="'支票支付'" class-name="text-blue-td"></el-table-column>
          <el-table-column prop="zfbje" :label="'支付宝支付'" min-width="100" class-name="text-blue-td"></el-table-column>
          <el-table-column prop="wxje" :label="'微信支付'" class-name="text-blue-td"></el-table-column>
          <el-table-column prop="posje" :label="'POS支付'" class-name="text-blue-td"></el-table-column>
          <!-- 医保支付 --> 
          <el-table-column prop="qtys" :label="'医保支付'" class-name="text-blue-td"></el-table-column>

          <!-- 中心号码 -->
          <el-table-column prop="hjje" :label="'中心号码'"></el-table-column>

          <!-- 收费项目 -->
          <el-table-column prop="hjje" :label="'收费项目'"></el-table-column>

          <!-- 收费方式 -->
          <!-- <el-table-column prop="sffs" :label="'收费方式'"></el-table-column> -->


          <!-- 门诊类别 -->
          <el-table-column prop="mzlb" :label="'门诊类别'">
            <template slot-scope="scope">
              <div v-if="opTypeList.find(item => item.dv==scope.row.mzlb)">
                {{opTypeList.find(item => item.dv==scope.row.mzlb).dn}}
              </div>
              <div v-else>{{scope.row.mzlb}}</div>
            </template>
          </el-table-column>

          <!-- 合并标识 -->
          <el-table-column prop="hbbz" :label="'合并标识'"></el-table-column>

        </el-table>
      </pagenation-list>
      <div style="display: flex; justify-content:start;margin-top: -22px" class="totalMoney" >
        <p>合计金额：<em>&yen;{{botHjje}}</em></p>
        <p>现金：<em>&yen;{{botXj}}</em></p>
        <p>账户：<em>&yen;{{botZh}}</em></p>
        <p>其他：<em>&yen;{{botQt}}</em></p>
      </div>
    </div>

    <!-- 门诊清单 -->
    <div class="statement-box">
      <statement
        ref="statement"
        html-api="/op-service/ghrbReport/outpatientList"
        :html-search-data="htmlSearchData"
        :height="listSlotHeight"
        :print-arg="{
          top: '8%',
          left: '10%',
          width: '90%',
          height: '87%'
        }"
        @hadUrl="printMzqd"
      />
    </div>

    <invoice-void
      :fphm1="fphm1"
      :fphm2="fphm2"
      :patientInfo="patientInfo"
      :djDetails="djDetails"
      :isVoid="isVoid"
      :onlyQuery="true"
      :key="ivKeyIndex"
      @closed="closeVoidDialog"
      @reload="reload"
      ref="invoice-void"
    />
	</div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { getNow } from '@/api/his/basic'
import { parseTime } from '@/utils'
import { aQueryFphm } from '@/api/his/op/reg/regInvoiceVoid.ts'
import { aQueryDjDetails, aPrintMoth,aPrintMothNext } from '@/api/his/op/reg/settlement.ts'
import invoiceVoid from './components/invoiceVoid.vue'
import { getFloat, mul, numtochinese } from '@/utils'
import { getLodop } from '@/plugins/lodop/index.js'

declare interface IObj {
  [key: string]: string
}

@Component({
  name: '',
  components: {
    invoiceVoid,
  },
})

export default class extends Vue {
	private obj: IObj = {
    name: '',
    value: '',
  }
  private formData: any = {
    beginFphm: '',
    endFphm: '',
    beginSfrq: '',
    endSfrq: '',
    brxz: '',
    brxm: '',
    jzkh: '',
    czgh: '', // 收款员
  }
  private date: any[] = []
  private tableData: any[] = []
  private isShowLoad:boolean=false
  private isShowLoads:boolean=false
  private searchData: any = {}
  private deptList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REGISTERATION_DEPARTMENT_DICT : this.$store.state.webSqlDict.REGISTERATION_DEPARTMENT_DICT // 挂号科室
  private docList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT // 医生
  private usersList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.USERS_DICT : this.$store.state.webSqlDict.USERS_DICT // 用户列表
  private opTypeList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.OUTPATIENT_TYPE : this.$store.state.webSqlDict.OUTPATIENT_TYPE // 门诊类别
  private brxzList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_PATIENT_DICT : this.$store.state.webSqlDict.TABLE_PATIENT_DICT // 病人性质
  private statusList: any[] = [
    {dv: 0, dn: '正常挂号'},
    {dv: 1, dn: '退号'},
    {dv: 2, dn: '废号'},
  ]
  private curRow: any = {}

  private botHjje: any = '0.00'
  private botXj: any = '0.00'
  private botZh: any = '0.00'
  private botQt: any = '0.00'

  // 子组件
  private patientInfo: any = {}
  private djDetails: any = []
  private fphm1: string = ''
  private fphm2: string = ''
  private isVoid: boolean = true // 作废/取消作废
  private ivKeyIndex: number = 1

  //判断是否可以补打重打等
  private isTrue:number=0
  // 打印相关
  private htmlSearchData: any = {
    fphm: '',
    jgName: JSON.parse(localStorage.userInfo).hospitalName,
  }

  get listSlotHeight(){
    return Vue.prototype.PageHeight - 198
  }

  // 监听方法
  @Watch('tableData')
  private onValueChange(value: any) {
    this.botHjje = '0.00'
    this.botXj = '0.00'
    this.botZh = '0.00'
    this.botQt = '0.00'

    this.tableData.forEach((item)=>{
      this.botHjje = (mul(this.botHjje, 100) + mul(item.zjje, 100)) / 100
      this.botHjje = getFloat(this.botHjje, 2)
      this.botXj = (mul(this.botXj, 100) + mul(item.xjje, 100)) / 100
      this.botXj = getFloat(this.botXj, 2)
      this.botZh = (mul(this.botZh, 100) + mul(item.zhje, 100)) / 100
      this.botZh = getFloat(this.botZh, 2)
      this.botQt = (mul(this.botQt, 100) + mul(item.qtys, 100)) / 100
      this.botQt = getFloat(this.botQt, 2)
    })
  }

  // 获取当前时间
  private getTime(){
    getNow().then((res: any) => {
      if(res){
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
    this.formData.beginSfrq = this.date[0]
    this.formData.endSfrq = this.date[1]
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }

  // 重置
  private reset(){
    const form: any = this.$refs.form
    form.resetFields()
    this.getTime()
  }

  // 门诊清单
  // 查询
  private queryMzqd(){
    if(this.fphm1){
      // const statement: any = this.$refs.statement
      // statement.getTableUrl()
      let str = `${location.origin}/op-service/ghrbReport/outpatientList?token=${localStorage.getItem('token')}&fphm=${this.htmlSearchData.fphm}&jgName=${encodeURIComponent(this.htmlSearchData.jgName)}`
      if (str) {
        const __qiankun__ = window.__POWERED_BY_QIANKUN__
        var LODOP: any = null
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
    }else{
      this.$notify({
        title: '请选择发票信息',
        message: '',
        type: 'warning'
      })
    }
  }

  // 打印
  private printMzqd(){
    const statement: any = this.$refs.statement
    statement.printTable()
  }

  // 查询详情按钮
  private queryDetails(){
    if(this.fphm1){
      this.openVoidDialog()
      this.getFpDetail(this.fphm1)
    }else{
      this.$notify({
        title: '请选择发票信息',
        message: '',
        type: 'warning'
      })
    }
  }

  // 发票补打
  private async rePrint(num:number){
    if(this.fphm1){
      //判断是否可以补打或者重打 
      let params = {
        fphm: this.fphm1,
        jgName: JSON.parse(localStorage.getItem('userInfo') as any).hospitalName,
        yb: false,
        zsfphm: '',
      }
      if(num===1&&(this.isTrue!=0&&this.isTrue!=2)){
        this.$notify({
          title: '该发票不能补打',
          message: '',
          type: 'warning'
        })
        return 
      }
      if(num===2&&this.isTrue!=0){
        this.$notify({
          title: '该发票不能重打',
          message: '',
          type: 'warning'
        })
        return
      }
      let res = null
      if(num==1){
        this.isShowLoad = true
        res = await aPrintMoth(params)
      }else{
        this.isShowLoads = true
        res = await aPrintMothNext(params)
      }
      if(res){
        if(0){
          // this.print1(res)
        }else{
          // this.print2(mzxxReq, jsxx, res, sjbrxz, ybsjbrxz)
          this.printChargeBill(res,num)
        }
      }else{
        this.isShowLoad = false
        this.isShowLoads = false
      }
    }else{
      this.$notify({
        title: '请选择发票信息',
        message: '',
        type: 'warning'
      })
    }
  }
  private printChargeBill(res: any,num:number){
    this.isShowLoad = false
    this.isShowLoads = false
    const __qiankun__ = window.__POWERED_BY_QIANKUN__
    let LODOP: any = null
    if (__qiankun__) {
      LODOP = Vue.prototype.$getLodop()
    } else {
      LODOP = getLodop()
    }
    if(!LODOP){
      console.log('没有安装打印控件');
      // this.$emit('resetForm')
      // 是否继续结算
      // let prevRecord = JSON.parse(localStorage.getItem('opSettlePrevRecord') as any)
      // this.$emit('checkMultiple', prevRecord.jzkh, prevRecord.cardtype)
      return false
    }
    let mzxx = res.data.mzfpBaseResp[0]
    let sfxmList = res.data.sfxmList
    let ypList = res.data.ypList
    if(res.data.dyfs==1){
      //获取打印机名称LODOP.GET_PRINTER_NAME()
      LODOP.PRINT_INIT('门（急）诊收费票据')
      LODOP.SET_PRINT_PAGESIZE(1, '241mm', '140mm', '')
      LODOP.SET_PRINT_STYLE('FontSize', 8)
      LODOP.ADD_PRINT_TEXT('16mm', '24mm', '64mm', '4mm', mzxx.jgmc)
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 13)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.ADD_PRINT_TEXT('22mm','24mm','64mm','4mm', '医 疗 门（急）诊 收 费 票 据')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.ADD_PRINT_TEXT('29mm','24mm','64mm','4mm', mzxx.yyyy)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.ADD_PRINT_TEXT('33mm','28mm','30mm','4mm', '姓名：' + mzxx.xm)
      LODOP.ADD_PRINT_TEXT('33mm','63mm','30mm','4mm', '性别：' + (mzxx.brxb == '1' ? '男' : '女'))

      let printHeader1: any = (()=>{
        LODOP.ADD_PRINT_TEXT('38mm','36mm','10mm','4mm', '项目')
        LODOP.ADD_PRINT_TEXT('38mm','70mm','18mm','4mm', '金额（元）')
      })
      printHeader1()
      let initTop1 = 42
      let pages = 1 // 第几页
      let itemIndex1 = 0 // 单页内第几项
      for(let i = 0; i < sfxmList.length; i++){
        let top = initTop1 + itemIndex1 * 5
        LODOP.ADD_PRINT_TEXT(top + 'mm', '36mm', '24mm', '4mm', sfxmList[i].sfxm)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '70mm', '24mm', '4mm', sfxmList[i].xmje)
        itemIndex1++
        if((i+1)%8==0 && i<sfxmList.length-1){
          LODOP.NEWPAGEA()
          itemIndex1 = 0
          pages++
          LODOP.SET_PRINT_STYLE('PageIndex', pages)
          printHeader1()
        }
      }
      LODOP.SET_PRINT_STYLE('PageIndex', 'first')
      LODOP.ADD_PRINT_TEXT('75mm', '28mm', '50mm', '4mm', '合计（大写）：' + numtochinese(mzxx.hjje.toString()))
      LODOP.ADD_PRINT_TEXT('82mm', '28mm', '50mm', '4mm', '总额：' + mzxx.hjje)
      LODOP.ADD_PRINT_TEXT('82mm', '56mm', '50mm', '4mm', '优惠：' + mzxx.jmje)
      LODOP.ADD_PRINT_TEXT('82mm', '78mm', '50mm', '4mm', '实际金额：' + (mzxx.grjf))
      LODOP.ADD_PRINT_TEXT('87mm', '28mm', '50mm', '4mm', '个人支付：' +(mzxx.grzf==null?0:mzxx.grzf) )
      LODOP.ADD_PRINT_TEXT('87mm', '66mm', '50mm', '4mm', '个人账户支付：' + mzxx.grzhzf)
      LODOP.ADD_PRINT_TEXT('92mm', '28mm', '50mm', '4mm', '医保统筹支付：' + mzxx.ybtczf)
      LODOP.ADD_PRINT_TEXT('92mm', '72mm', '50mm', '4mm', '附加支付：' + mzxx.fjzf)
      LODOP.ADD_PRINT_TEXT('97mm', '28mm', '50mm', '4mm', '现金支付中：分类自负' + (mzxx.flzf==null?0:mzxx.flzf) + '元')
      LODOP.ADD_PRINT_TEXT('97mm', '86mm', '50mm', '4mm', '自负' + (mzxx.zf==null?0:mzxx.zf)+ '元')
      LODOP.ADD_PRINT_TEXT('102mm', '28mm', '50mm', '4mm', '自费' + (mzxx.zifei==null?0:mzxx.zifei) + '元（不属于医保报销范围）')
      LODOP.ADD_PRINT_TEXT('107mm', '28mm', '50mm', '4mm', '当年账户余额：' + mzxx.dnzhye)
      LODOP.ADD_PRINT_TEXT('107mm', '66mm', '50mm', '4mm', '历年账户余额：' + mzxx.lnzhye)
      LODOP.ADD_PRINT_TEXT('122mm', '72mm', '50mm', '4mm', '现金支付：' + (mzxx.grjf))
      LODOP.ADD_PRINT_TEXT('29mm', '108mm', '50mm', '4mm', '服务业')
      LODOP.ADD_PRINT_TEXT('29mm', '126mm', '50mm', '4mm', '卡号：' + mzxx.shbzk)
      LODOP.ADD_PRINT_TEXT('29mm', '162mm', '50mm', '4mm', '医保类型：' + mzxx.jsfs)
      let printHeader2 = (()=>{
        LODOP.ADD_PRINT_TEXT('36mm', '110mm', '50mm', '4mm', '项目编码')
        LODOP.ADD_PRINT_TEXT('36mm', '136mm', '50mm', '4mm', '名称')
        LODOP.ADD_PRINT_TEXT('36mm', '159mm', '50mm', '4mm', '规格')
        LODOP.ADD_PRINT_TEXT('36mm', '170mm', '50mm', '4mm', '数量')
        LODOP.ADD_PRINT_TEXT('36mm', '179mm', '50mm', '4mm', '单位')
        LODOP.ADD_PRINT_TEXT('36mm', '187mm', '50mm', '4mm', '单价')
        LODOP.ADD_PRINT_TEXT('36mm', '197mm', '50mm', '4mm', '金额（元）')
      })
      printHeader2()
      let initTop2 = 42
      let itemIndex2 = 0 // 单页内第几项
      let page = 1 // 第几页
      for(let i = 0; i < ypList.length; i++){
        let top = initTop2 + itemIndex2 * 4
        LODOP.ADD_PRINT_TEXT(top + 'mm', '112mm', '24mm', '4mm', ypList[i].mxbm)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '130mm', '24mm', '4mm', ypList[i].mxmc)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '159mm', '24mm', '4mm', ypList[i].mxgg)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '172mm', '24mm', '4mm', ypList[i].mxsl)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '180mm', '24mm', '4mm', ypList[i].yfdw)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '187mm', '24mm', '4mm', ypList[i].mxdj)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '198mm', '24mm', '4mm', ypList[i].mxje)
        itemIndex2++
        if((i+1)% res.data.mzfpmxsl==0 && i<ypList.length-1){
          LODOP.NEWPAGEA()
          itemIndex2 = 0
          page++
          LODOP.SET_PRINT_STYLE('PageIndex', page)
          printHeader2()
        }
      }

      LODOP.SET_PRINT_STYLE('PageIndex', 'first') // 以下只打印在第一页
      LODOP.ADD_PRINT_TEXT('131mm', '28mm', '60mm', '4mm', '单据号：' + mzxx.fphm)
      LODOP.ADD_PRINT_TEXT('131mm', '80mm', '60mm', '4mm', '中心流水号：' + mzxx.zxlsh==null?'':mzxx.zxlsh)
      LODOP.ADD_PRINT_TEXT('131mm', '140mm', '60mm', '4mm', '收款员：' + mzxx.sfygh)
      LODOP.ADD_PRINT_TEXT('131mm', '182mm', '50mm', '4mm', '收款单位（章）：')
      if(res.data.fpyl==='0'){
        LODOP.SET_PRINTER_INDEXA(res.data.mzhjsfdyjmc)
        LODOP.PRINT()
      }else{
        LODOP.PREVIEW();
      }
      if(num===2){
        this.searchLists()
      }
    }else if(res.data.dyfs==3){
        LODOP.SET_PRINT_PAGESIZE(1, '241mm', '140mm', '')
        LODOP.SET_PRINT_STYLE('FontSize', 10)
        
        LODOP.ADD_PRINT_TEXT('23mm', '33mm', '60mm', '4mm', mzxx.yyyy)
        LODOP.ADD_PRINT_TEXT('23mm', '90mm', '95mm', '4mm', '医疗服务')

        LODOP.ADD_PRINT_TEXT('30mm', '22mm', '30mm', '4mm', '姓名:'+ mzxx.xm)
        LODOP.ADD_PRINT_TEXT('30mm', '70mm', '30mm', '4mm', '卡号:'+ mzxx.shbzk)
        LODOP.ADD_PRINT_TEXT('30mm', '115mm', '100mm', '4mm', '中心流水号:'+ mzxx.zxlsh)

        LODOP.ADD_PRINT_TEXT('35mm', '22mm', '90mm', '4mm', '收款人单位名称:'+ mzxx.jgmc)
        LODOP.ADD_PRINT_TEXT('35mm', '85mm', '90mm', '4mm', '纳税人识别码:'+ res.data.nsrsbh)
        LODOP.ADD_PRINT_TEXT('35mm', '140mm', '40mm', '4mm', '类型:'+ mzxx.jsfs)
        LODOP.ADD_PRINT_LINE('40mm', '22mm', '40mm', '196mm', 0, 1)
        LODOP.ADD_PRINT_LINE('41mm', '82mm', '130mm', '82mm', 0, 1)

      
        let printHeader1: any = (()=>{
          LODOP.ADD_PRINT_TEXT('42mm','33mm','30mm','4mm', '项目')
          LODOP.ADD_PRINT_TEXT('42mm','60mm','30mm','4mm', '金额（元）')
        })
        printHeader1()
        let initTop1 = 48
        let itemIndex1 = 0
        for(let i = 0; i<sfxmList.length; i++){
          let top = initTop1 + itemIndex1 * 4
          LODOP.ADD_PRINT_TEXT(top + 'mm', '30mm', '30mm', '4mm', sfxmList[i].sfxm)
          LODOP.ADD_PRINT_TEXT(top + 'mm', '58mm', '30mm', '4mm', sfxmList[i].xmje)
          itemIndex1++
          printHeader1()
        }

        LODOP.SET_PRINT_STYLE('PageIndex', 'first')
        LODOP.ADD_PRINT_LINE('81mm', '22mm', '81mm', '81mm', 0, 1)
        
        LODOP.SET_PRINT_STYLE('FontSize', '9')

        LODOP.ADD_PRINT_TEXT('83mm', '22mm', '100mm', '4mm', '合计(小写):'+ mzxx.hjje)
        LODOP.ADD_PRINT_TEXT('88mm', '22mm', '100mm', '4mm', '合计(大写):'+ numtochinese(mzxx.hjje.toString()))

        LODOP.ADD_PRINT_TEXT('93mm', '22mm', '40mm', '4mm', '现金支付:'+ mzxx.xjzf)
        LODOP.ADD_PRINT_TEXT('93mm', '54mm', '40mm', '4mm', '账户支付:'+ mzxx.grzhzf)

        LODOP.ADD_PRINT_TEXT('98mm', '22mm', '40mm', '4mm', '统筹支付:'+mzxx.ybtczf)
        LODOP.ADD_PRINT_TEXT('98mm', '54mm', '40mm', '4mm', '附加支付:'+mzxx.fjzf)

        LODOP.ADD_PRINT_TEXT('103mm', '22mm', '120mm', '4mm', '现金支付中分类自负:'+ (mzxx.flzf==null?0:mzxx.flzf) +'自负'+ (mzxx.zf==null?0:mzxx.zf))

        LODOP.ADD_PRINT_TEXT('108mm', '22mm', '100mm', '4mm', '自费:'+ (mzxx.zifei==null?0:mzxx.zifei) + '(不属于医保报销范围)')

        LODOP.ADD_PRINT_TEXT('113mm', '22mm', '100mm', '4mm', '当年账户余额:'+ + mzxx.dnzhye)
        LODOP.ADD_PRINT_TEXT('118mm', '22mm', '100mm', '4mm', '历年账户余额:'+ + mzxx.lnzhye)
        LODOP.ADD_PRINT_TEXT('118mm', '90mm', '120mm', '4mm', '药品请当面点清！按卫生部规定，药品一经发出不得退换！')
        LODOP.ADD_PRINT_TEXT('123mm', '22mm', '50mm', '4mm', '收款员:'+ mzxx.sfygh)

        LODOP.SET_PRINT_STYLE('FontSize', '10')
        let printHeader2 = (()=>{
          LODOP.ADD_PRINT_TEXT('42mm', '90mm', '40mm', '4mm', '项目编码')
          LODOP.ADD_PRINT_TEXT('42mm', '118mm', '30mm', '4mm', '规格')
          LODOP.ADD_PRINT_TEXT('42mm', '133mm', '20mm', '4mm', '数量')
          LODOP.ADD_PRINT_TEXT('42mm', '148mm', '20mm', '4mm', '单位')
          LODOP.ADD_PRINT_TEXT('42mm', '163mm', '25mm', '4mm', '单价')
          LODOP.ADD_PRINT_TEXT('42mm', '178mm', '30mm', '4mm', '金额')
        })
        printHeader2()
        let initTop2 = 48
        let itemIndex2 = 0 // 单页内第几项
        let page = 1 // 第几页
        for(let i = 0; i < ypList.length; i++){
          let top = initTop2 + itemIndex2 * 5
          LODOP.ADD_PRINT_TEXT(top + 'mm', '87mm', '32mm', '4mm', ypList[i].mxmc)
          LODOP.ADD_PRINT_TEXT(top + 'mm', '117mm', '22mm', '4mm', ypList[i].mxgg)
          LODOP.ADD_PRINT_TEXT(top + 'mm', '135mm', '20mm', '4mm', ypList[i].mxsl)
          LODOP.ADD_PRINT_TEXT(top + 'mm', '148mm', '20mm', '4mm', ypList[i].yfdw)
          LODOP.ADD_PRINT_TEXT(top + 'mm', '163mm', '24mm', '4mm', ypList[i].mxdj)
          LODOP.ADD_PRINT_TEXT(top + 'mm', '178mm', '30mm', '4mm', ypList[i].mxje)
          itemIndex2++
          if((i+1)% res.data.mzfpmxsl==0 && i<ypList.length-1){
            LODOP.NEWPAGEA()
            itemIndex2 = 0
            page++
            LODOP.SET_PRINT_STYLE('PageIndex', page)
            printHeader2()
          }
        }   
        if(res.data.fpyl==='0'){
          LODOP.SET_PRINTER_INDEXA(res.data.mzhjsfdyjmc)
          LODOP.PRINT()
        }else{
          LODOP.PREVIEW();
        }
        if(num===2){
          this.searchLists()
        }
    }
  }
  // 单击行
  private getDetail(row: any) {
    this.curRow = row
    this.fphm1 = row.fphm
    this.isVoid = row.zfrq==null?true:false
    this.htmlSearchData.fphm = row.fphm
    this.isTrue = row.zfpb
  }

  // 双击行
  private dblclick(row: any) {
    this.queryDetails()
  }


  // 打开作废/取消作废弹窗
  private openVoidDialog(){
    const iv: any = this.$refs['invoice-void']
    iv.openDialog()
  }

  // 获取发票详情
  private getFpDetail(fphm: string){
    aQueryFphm({fphm: fphm}).then((res: any) => {
      if(res){
        this.patientInfo = res.data.fpzfBrdaResp // 获取病人信息
        let params = {
          brxz: this.patientInfo.brxz,
          fpcx: 0,
          zfblList: res.data.resultList
        }
        aQueryDjDetails(params).then((res: any) => {
          if(res){
            this.djDetails = res.data
            this.$nextTick(()=>{
              const ivc: any = this.$refs['invoice-void']
              ivc.transform()
            })

          }
        })
      }
    })
  }

  // 关闭弹窗时触发
  private closeVoidDialog(){
    this.ivKeyIndex++
  }

  // 重新加载表格
  private reload(){
    // this.getTable1()
    // this.getTable2()
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
.content{
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.upper{
  height: auto;
}
.lower{
  flex-grow: 1;
  margin-top: 10px;
}
.table-wrap{
  table{
    td{
      &:nth-child(odd){
        width: 18%;
      }
      &:nth-child(even){
        // width: calc(100%/3*60%);
      }
    }
  }
}
.normal-form-wrap{
  .el-form{
    width: 30%;
    margin: 40px auto 0;
  }
}

//三列表单
.form3{
	margin: 0!important;
	.el-form-item{

    .search-select{
      width: 100%;
    }
  }
  .form-area{
    float: left;
    width: calc((100% - 16px*2)/3);
    margin-right: 16px;
    margin-bottom: 8px!important;
    // border: 1px solid #f00;
    &:nth-child(3n){
			margin-right: 0;
    }
    &:nth-last-child(-n+3){
      margin-bottom: 0!important;
    }
    &.item-fphm{
      .el-form-item{
        display: inline-block;
        &:nth-child(1){
          width: calc((100% - 60px - 10px)/2 + 60px);
        }
        &:nth-child(3){
          width: calc((100% - 60px - 10px)/2);
        }
      }
      span{
        display: inline-block;
        width: 10px;
        text-align: center;
      }
    }
    .el-form-item{
      margin-bottom: 0;
    }
  }
}

.btns{
  margin-top: 30px;
  text-align: center;
  .el-button{
    display: inline-block;
    width: calc((100% - 20px)/3);
    text-align: center;
  }
  .el-button--default{
    color: $second;
  }
}

.totalMoney{
  font-size: 13px;
  width: auto;
  p{
    margin-right: 20px;
  }
  em{
    font-family: "siyuanMedium";
    color: #1485ff;
  }
}
</style>
