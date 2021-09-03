<template>
  <!-- 结算 -->
  <el-dialog
    :title="'门诊结算'"
    :visible.sync="dialogSettlement"
    width="500px"
    :close-on-click-modal="false"
    @closed="resetSettlement"
		class="narrow-dialog"
    v-elDraggableDialog
  >
    <div class="his-module his-small">
      <el-form :model="formData" label-width="66px" ref="formData" class="clearfix">

        <div class="area-title">
          <i class="icon his-module_division_fapiao"></i>
          <span>发票情况</span>
        </div>

        <div class="form-item-wrapper clearfix">
          <!-- 总计金额 -->
          <el-form-item :label="'总计金额'" prop="zjje" disabled>
            <el-input
              v-model="formData.zjje"
              :placeholder="'总计金额'"
              :disabled="true"
              class="text-blue"
            ></el-input>
          </el-form-item>

          <!-- 其他应收 -->
          <el-form-item :label="'其他应收'" prop="qtys" disabled>
            <el-input
              v-model="formData.qtys"
              :placeholder="'其他应收'"
              :disabled="true"
              class="text-blue"
            ></el-input>
          </el-form-item>

          <!-- 自负金额 -->
          <el-form-item :label="'自负金额'" prop="zfje" disabled>
            <el-input
              v-model="formData.zfje"
              :placeholder="'自负金额'"
              :disabled="true"
              class="text-blue"
            ></el-input>
          </el-form-item>
        </div>
        

        <div class="area-title">
          <i class="icon his-module_division_shoukuan"></i>
          <span>收款金额</span>
        </div>

        <div class="form-item-wrapper clearfix">
          <!-- 减免金额 -->
          <el-form-item :label="'减免金额'" prop="jmje" disabled>
            <el-input
              v-model="formData.jmje"
              :placeholder="'减免金额'"
              :disabled="true"
              class="text-blue"
            ></el-input>
          </el-form-item>

          <!-- 免赔金额 -->
          <el-form-item :label="'免赔金额'" prop="mpje" disabled>
            <el-input
              v-model="formData.mpje"
              :placeholder="'免赔金额'"
              :disabled="true"
              class="text-blue"
            ></el-input>
          </el-form-item>

          <!-- 商保支付 -->
          <el-form-item :label="'商保支付'" prop="sbzf" disabled>
            <el-input
              v-model="formData.sbzf"
              :placeholder="'商保支付'"
              class="text-blue"
              :disabled="true"
            ></el-input>
          </el-form-item>

          <!-- 理赔金额 -->
          <el-form-item :label="'理赔金额'" prop="sbzf" disabled>
            <el-input
              v-model="formData.lpje"
              :placeholder="'理赔金额'"
              :disabled="true"
              class="text-blue"
            ></el-input>
          </el-form-item>

          <!-- 应收款 -->
          <el-form-item :label="'应收款'" prop="ysk" disabled>
            <el-input
              v-model="formData.ysk"
              :placeholder="'应收款'"
              :disabled="true"
              class="text-red"
            ></el-input>
          </el-form-item>

          <!-- 发票号码 -->
          <el-form-item :label="'发票号码'" prop="fphm" disabled>
            <el-input
              v-model="formData.fphm"
              :placeholder="'发票号码'"
              :disabled="true"
            ></el-input>
          </el-form-item>

          <!-- 交款金额 -->
          <el-form-item :label="'交款金额'" prop="jkje">
            <el-input
              :disabled="jkdisabled"
              v-model="formData.jkje"
              type="number"
              :placeholder="'交款金额'"
              @focus="setJkje"
              @blur="jkjeBlur"
              @keyup.enter.native="jkjeEnter"
              class="text-red item-jkje"
              ref="inputJkje"
            ></el-input>
          </el-form-item>

          
          <!-- 退找金额 -->
          <el-form-item :label="'退找金额'" prop="tzje" disabled>
            <el-input
              v-model="formData.tzje"
              :placeholder="'退找金额'"
              :disabled="true"
              class="text-red"
            ></el-input>
          </el-form-item>

          <!-- 货币误差 -->
          <el-form-item :label="'货币误差'" prop="hbwc" disabled>
            <el-input
              v-model="hbwc"
              :placeholder="'货币误差'"
              :disabled="true"
              class="text-red"
            ></el-input>
          </el-form-item>
          <!-- 付款方式 -->
          <!-- <el-form-item :label="'付款方式'" prop="fkfs">
            <search-select
              table-name="SYS_DICT_CONFIG"
              kid="21"
              v-model="formData.fkfs"
              :backfillValue="formData.fkfs"
              :placeholder="'付款方式'"
              :clearable="false"
              @change="changeFkfs"
            />
          </el-form-item> -->
          <el-form-item label="付款方式" style="width:100%;margin-left: 0;" v-for="(item,i) in payDataList" :key="i">
            <div style="display:flex">
              <div style="width:160px;">
                <!-- <search-select
                  table-name="SYS_DICT_CONFIG"
                  kid="21"
                  v-model="item.fkfs"
                  :backfillValue="item.fkfs"
                  :placeholder="'付款方式'"
                  :clearable="false"
                  @change="changeFkfs"
                /> -->
                <el-select v-model="item.fkfs" placeholder="请选择"  @change="((value)=>{changeFkfs(value, i)})">
                  <el-option
                    v-for="items in item.options"
                    :key="items.dv"
                    :label="items.dn"
                    :value="items.dv"
                    :disabled="item.disabled">
                  </el-option>
                </el-select>
              </div>
              <div class="addInfor" v-if="payDataList.length==1" @click="addPayDataList">
                <span>+</span>
              </div>
              <div style="width:225px;margin-left: 15px;" v-else>
                <el-form-item :label="'输入金额'" prop="jkje">
                  <!-- @focus="setJkje" -->
                  <el-input
                    style="width:160px"
                    v-model="item.jkje"
                    type="number"
                    :placeholder="'输入金额'"
                    @blur="jkBlur(i)"
                    @keyup.enter.native="jkjeEnter"
                    class="text-red item-jkje"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="removeInfo" v-if="i==1" @click="remPayDataList(i)">
                <span>-</span>
              </div>
            </div>
          </el-form-item>

          <!-- 发票张数 -->
          <el-form-item :label="'发票张数'" prop="fpzs" hidden>
            <el-input
              v-model="formData.fpzs"
              :placeholder="'发票张数'"
              :disabled="true"
            ></el-input>
          </el-form-item>

          <!-- 结算申请序号 -->
          <el-form-item :label="'结算申请序号'" prop="jssqxh" hidden>
            <el-input
              v-model="formData.jssqxh"
              :placeholder="'结算申请序号'"
              :disabled="true"
            ></el-input>
          </el-form-item>

          <!-- 就诊单元号 -->
          <el-form-item :label="'就诊单元号'" prop="jzdyh" hidden>
            <el-input
              v-model="formData.jzdyh"
              :placeholder="'就诊单元号'"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </div>

      </el-form>
    </div>
    
    <span slot="footer" class="dialog-footer">
      <!-- <el-checkbox v-model="checkedJm" class="jm" @change="changeJm">减免</el-checkbox> -->
      <el-button @click="closeDialogSettlement">取消</el-button>
      <el-button type="primary" @click="saveDiscountInfo" ref="btnConfirm" :loading="loading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
	aQueryPayment, aSaveDiscountInfo, aSaveOutpatientSettlement, aPrintMoth
} from '@/api/his/op/reg/settlement.ts'
import { aQuerySjBrxz } from '@/api/his/op/reg/registerManage.ts'
import { getFloat, mul, numtochinese } from '@/utils'
import { getLodop } from '@/plugins/lodop/index.js'
import { getNow, getParams } from '@/api/his/basic'
import { getTableData } from '@/websql/functions'

@Component({
  name: ''
})

export default class extends Vue {
  @Prop({ required: true, default: () => ({}) }) private settleInfo: any // 表单数据
  @Prop({ required: true, default: () => ({}) }) private djInfo: any // 单据明细
  @Prop({ required: true, default: () => ({}) }) private mxsave: any // 保存标识
  @Prop({ required: false, default: () => ({}) }) private defaultDay: any // 时间
  @Prop({ required: false, default: () => ({}) }) private opBrzd: any // 时间
  @Prop({ required: false, default: false }) private isEcQrcode!: boolean // 是否电子凭证


	private dialogSettlement: boolean = false
  private formData: any = {
    zjje: '', // 总计金额
    qtys: '0.00', // 其他应收
    zfje: '', // 自负金额
    jmje: '0.00', // 减免金额
    mpje: '0.00', // 免赔金额
    sbzf: '0.00', // 商保支付
    lpje: '0.00', // 理赔金额
    ysk: '', // 应收款
    fphm: '', // 发票号码
    fpzs: '', // 发票张数 hidden
    jkje: '', // 交款金额
    fkfs: 1, // 付款方式
    tzje: '', // 退找金额
    hbwc: '0.00', // 货币误差
    jssqxh: '', // 结算申请序号（医保）
    jzdyh: '', // 就诊单元号（医保）

    //新增
    posje:'0.00', //pos
    zpje:'0.00',  //支票金额
    fkje:'0.00',  //现金支付金额
    czkje:'0.00'  //充值卡
  }
  private ysk: any = '' // 应收款，用于重新赋值
  private loading: boolean = false

  get hbwc(){
    // 第一次进来的时候
    if(this.payDataList&&this.payDataList.length==1&&this.payDataList[0].fkfs=='1'){
      this.formData.ysk = getFloat(this.formData.ysk, 1)
    }
    let hbwc = (mul(this.formData.ysk, 100) - mul(this.ysk, 100)) / 100
    return getFloat(hbwc, 2)
  }
  private closeDialogSettlement(){
    this.dialogSettlement = false
    this.formData.ysk = 0 
    this.ysk = 0
  }
  //交款金额
  private jkdisabled:Boolean = false
  //数组 多选支付模式
  private payDataList:any[]=[
    {
      fkfs:'',
      jkje:'',
      options:[]
    }
  ]
  private addPayDataList(){
    let options:any = []
    if(this.payDataList[0].options&&this.payDataList[0].options.length){
      options = this.payDataList[0].options.filter((item:any)=>item.dv!==this.payDataList[0].fkfs&&item.dv!=1)
    }
    this.formData.ysk = this.ysk
    this.formData.jkje = '0.00'
    this.formData.tzje = '0.00'
    this.payDataList.push({
      fkfs:'',
      jkje:'',
      options:options
    })
  }
  private remPayDataList(i:any){
    if(this.payDataList[0].fkfs===1){
      this.jkdisabled = false
      this.formData.ysk = getFloat(this.formData.ysk, 1)
      this.formData.jkje = this.formData.ysk
      this.formData.tzje = '0.00'
    }
    this.payDataList[0].jkje = ''
    this.payDataList.splice(i,1)
  }
  // 打开弹窗
  private openDialog(){
    this.init()
    this.dialogSettlement = true
    this.queryPayment()
  }
  
  // 结算信息查询
  private queryPayment(){
    for(let i of this.djInfo){
      if(i.zkbl){
        if(i.zfbl > 1){ // 折扣 = 划价*自负-折后
          this.$set(i, 'zkje', (  mul(  mul(i.hjje, i.zfbl)  , 10000) - mul(i.zhje, 10000)  ) / 10000) // 折扣金额
        }else{ // 折扣 = 划价-折后
          this.$set(i, 'zkje', (   mul(i.hjje, 10000) - mul(i.zhje, 10000)  ) / 10000     ) // 折扣金额
        }
      }else{
        this.$set(i, 'zkje', 0)
      }
    }
    let params = {
      queryPayReqList: this.djInfo,
      jzkh: this.settleInfo.jzkh,
      isYb: this.settleInfo.isYb,
      brid: this.settleInfo.brid,
      brxz: this.settleInfo.brxz,
      ghks: this.settleInfo.ghks,
      cardid: this.settleInfo.cardid,
      cardtype: this.settleInfo.cardtype,
      accountattr: this.settleInfo.accountattr
    }
    if(this.isEcQrcode){
      params.cardtype='3'
    }
    aQueryPayment(params).then((res: any) => {
      if(res){
        this.formData.zjje = getFloat(res.data.zjje, 2)
        this.formData.qtys = getFloat(res.data.qtys, 2)
        this.formData.zfje = getFloat(res.data.zfje, 2)
        this.formData.jmje = getFloat(res.data.jmje, 2)
        // this.formData.ysk = (mul(res.data.ysk, 10000) - mul(res.data.jmje, 10000)) / 10000 // 8-24减免修改
        this.formData.ysk = getFloat(res.data.ysk, 2) // 8-24减免修改
        this.ysk = this.formData.ysk
        this.formData.fphm = res.data.fphm
        this.formData.fpzs = res.data.fpzs
        this.formData.jkje = this.formData.ysk
        this.formData.fkfs = res.data.fkfs
        //付款方式
        this.payDataList[0].fkfs = res.data.fkfs
        if(res.data.fkfs!=1){
          this.jkdisabled = true
          this.formData.jkje="0.00"
        }else{
          this.formData.jkje = getFloat(res.data.ysk, 1)
        }
        this.formData.jssqxh = res.data.jssqxh
        this.formData.jzdyh = res.data.jzdyh

        // this.changeFkfs(1)
        // 选中文字
        this.$nextTick(()=>{
          const inputJkje: any = this.$refs.inputJkje
          inputJkje.select()
        })
      }
    })
  }

  // 保存折扣信息
  private saveDiscountInfo(){
    let result = this.judgeJkje()
    if(result == 'y'){
      this.loading = true
      let params = {
        list: this.djInfo
      }
      aSaveDiscountInfo(params).then((res: any) => {
        if(res){
          this.saveOutpatientSettlement()
        }
      })
    }
  }

  // 门诊结算
  private saveOutpatientSettlement(){
    let params:any = {
      cardno: this.settleInfo.jzkh, // 卡号
      fkhm: '', // 付款号码
      fffs: this.formData.fkfs, //付费方式
      // issmk: '', // 结算类型，0窗口结算，1医生站结算，2自助机结算
      list: this.djInfo,
      opBrzd:this.opBrzd,
      mzxxReq: { // 门诊信息
        ...this.settleInfo,
        fkfs: this.formData.fkfs,
        fpzs: 0,
        jjzf: 0, // 统筹支出（赋给“其他应收”）
        ...this.formData,
        mxsave: this.mxsave, // 是否录入手工方
        removeCfsb: [ // 删除处方识别
          {}
        ],
        removeData: [ // 删除数据
          // {}
        ]
      },
      pos: {},
      zzjQtysFlag: '', // 自助机其他应收标识
      zzjQtys: '', // 自助机其他应收
      zzjZfje: '', // 自助机自负金额
      zzjHbwc: '', //自助机货币误差

      ckbh: '', // 出库编号
      jsData: null,
      isYb: this.settleInfo.isYb, // 是否为医保
    }
    if(this.isEcQrcode){
      params.mzxxReq.cardtype = '3'
    }
    //新增单一付款
    if(this.payDataList.length==1){
        params.fkxxList = [{
          fkfs:this.payDataList[0].fkfs,
          fkje:this.formData.ysk
        }]
    }else{
      let fkxx:any = []
      this.payDataList.map((item:any)=>{
        fkxx.push({
          fkfs:item.fkfs,
          fkje:item.jkje
        })
      })
      params.fkxxList = fkxx
    }
    let flag:Boolean = true
    if(this.payDataList.length==2){
      if(Number(this.payDataList[0].jkje)+Number(this.payDataList[1].jkje)!=Number(this.formData.ysk)){
        flag = false
        this.loading = false
        this.$notify({
          title: '交款金额不匹配,请重新输入金额!',
          message: '',
          type: 'error'
        })
      }
      if(this.payDataList[0].fkfs==''||this.payDataList[1].fkfs==''){
        flag = false
        this.loading = false
        this.$notify({
          title: '付款方式不能为空,请选择付款方式!',
          message: '',
          type: 'error'
        })
      }
    }
    if(flag){
      aSaveOutpatientSettlement(params).then((res: any) => {
        if(res.errorCode=='SUCCESS'){
          this.$notify({
            title: '结算成功',
            message: '',
            type: 'success'
          })
          this.dialogSettlement = false
          // this.$emit('resetForm')

          // 存为上一条记录
          let opSettlePrevRecord = {
            jzkh: params.mzxxReq.jzkh,
            cardtype: params.mzxxReq.cardtype,
            zjje: params.mzxxReq.zjje,
            zfje: params.mzxxReq.zfje,
            ysk: params.mzxxReq.ysk,
            jkje: params.mzxxReq.jkje,
            tzje: params.mzxxReq.tzje,
          }
          localStorage.setItem('opSettlePrevRecord',JSON.stringify(opSettlePrevRecord))
          this.$emit('settled')
          this.print(params.mzxxReq, res.data)
          const parent :any = this.$parent
          parent.queryDj(this.defaultDay,1)
      
        }else{
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
        this.loading = false
      }).catch((err:any)=>{
        this.loading = false
      })
    }
  }

  // 计算应收款
  private calcQtys(value: any){
    if(value > this.formData.zfje){
      this.formData.jmje = null
      this.formData.qtys = this.formData.zfje
      this.$notify({
        title: '减免金额不能大于自负金额',
        message: '',
        type: 'error'
      })
    }else{
      this.formData.qtys = this.formData.zfje - value
      this.formData.jkje = this.formData.qtys
    }
  }

  // 聚焦填入交款金额
  private setJkje(){
    if(this.formData.jkje == ''){
      this.formData.jkje = this.formData.ysk
      this.formData.tzje = 0
    }
  }
  private checkoutMoney(num:any){
    let flag = true
    if(Number(this.payDataList[num].jkje)>=Number(this.formData.ysk)){
      this.$notify({
        title: '交款不得超过应收款金额,请重新输入!',
        message: '',
        type: 'error'
      })
      this.payDataList[num].jkje=''
      flag = false
    }
    return flag
  }
  //数组交款
  private jkBlur(i:Number){
    if(i===0){
      if(this.checkoutMoney(i)){
        this.payDataList[0].jkje = getFloat(this.payDataList[0].jkje, 2)
        this.payDataList[1].jkje = getFloat(this.formData.ysk-this.payDataList[0].jkje,2)
      }
    }else{
      if(this.checkoutMoney(i)){
        this.payDataList[1].jkje = getFloat(this.payDataList[1].jkje, 2)
        this.payDataList[0].jkje = getFloat(this.formData.ysk-this.payDataList[1].jkje,2)
      }
    }
    //判断付款方式是否有现金
    let params:any[] = [this.payDataList[0].fkfs,this.payDataList[1].fkfs]
    if(params.includes(1)){
      this.formData.jkje = this.payDataList[params.indexOf(1)].jkje
    }
  }
  // 交款金额回车，改变交款金额，计算退找金额 @keyup
  private jkjeEnter(){
    let result = this.judgeJkje()
    if(result == 'y'){
      // 使确认按钮获取焦点
      const btnConfirm: any = this.$refs.btnConfirm
      btnConfirm.$el.focus()
    }
  }

  // 交款金额失焦，改变交款金额，计算退找金额 @blur
  private jkjeBlur(){
    let result = this.judgeJkje()
  }

  // 判断交款金额，计算退找金额
  private judgeJkje(){
    if(this.formData.jkje == ""){
      this.formData.jkje = '0.00'
    }
    let flag:String = ''
    //单一支付
    if(this.payDataList.length==1){
      let params = this.payDataList[0].fkfs
      if(params==1){
        if(parseFloat(this.formData.jkje) < parseFloat(this.formData.ysk)){
          this.formData.tzje = null
          this.$notify({
            title: '交款金额不足,请重新输入金额!',
            message: '',
            type: 'error'
          })
          // return 'n'
          flag = 'n'
        }else{
          this.formData.tzje = (mul(this.formData.jkje, 100) - mul(this.formData.ysk, 100))/100
          this.formData.jkje = getFloat(this.formData.jkje, 2)
          this.formData.tzje = getFloat(this.formData.tzje, 2)
          flag='y'
        }
      }else{
        flag='y'
      }
    //组合支付
    }else{
      //现金支付
      let params = [this.payDataList[0].fkfs,this.payDataList[1].fkfs]
      if(params.includes(1)){
        if(parseFloat(this.formData.jkje) < parseFloat(this.payDataList[0].jkje)){
          this.formData.tzje = null
          this.$notify({
            title: '交款金额不足,请重新输入金额!',
            message: '',
            type: 'error'
          })
          flag = 'n'
        }else{
          this.formData.tzje = (mul(this.formData.jkje, 100) - mul(this.payDataList[params.indexOf(1)].jkje, 100))/100
          this.formData.jkje = getFloat(this.formData.jkje, 2)
          this.formData.tzje = getFloat(this.formData.tzje, 2)
          flag='y'
        }
      }else{
        //没有现金
        flag = 'y'
      }
    }
    return flag
  }

  // 改变付款方式
  private changeFkfs(val:any,num:number){
    //改过后  -- 单一支付
    if(this.payDataList.length==1){
      if(val==1){
        this.jkdisabled = false
        this.formData.ysk = getFloat(this.formData.ysk, 1)
        this.formData.jkje = this.formData.ysk
        this.formData.tzje = '0.00'
      }else{
        this.jkdisabled = true
        this.formData.ysk = this.ysk
        this.formData.jkje = '0.00'
        this.formData.tzje = '0.00'
      }
      this.$forceUpdate()
    }else{
      if(num===0){
        let options:any = []
        options = this.payDataList[0].options.filter((item:any)=>item.dv!==this.payDataList[0].fkfs&&item.dv!=1)
        this.payDataList[1].options = options
        if(this.payDataList[1].fkfs === this.payDataList[0].fkfs )
        this.payDataList[1].fkfs = ''
      }
      let params:any[] =[this.payDataList[0].fkfs]
      if(params.includes(1)){
        this.jkdisabled = false
        // this.formData.ysk = getFloat(this.formData.ysk, 1)
        this.formData.ysk = this.ysk
        this.formData.jkje = this.payDataList[0].jkje
        this.formData.tzje = "0.00"
      }else{
        this.jkdisabled = true
        this.formData.jkje="0.00"
        this.formData.tzje = '0.00'
        this.formData.ysk = this.ysk
      }
    }

  }
  private async print(mzxxReq: any, jsxx: any){
    let sjbrxz, ybsjbrxz, sqjhbhzks

    let res1 = await aQuerySjBrxz({brxz: mzxxReq.brxz})
    if(res1){
      sjbrxz = res1.data
    }

    let res2 = await getParams({commons: ['YBXZ']})
    if(res2){
      ybsjbrxz = res2.data.YBXZ
    }
    let params = {
      fphm: mzxxReq.fphm,
      jgName: JSON.parse(localStorage.getItem('userInfo') as any).hospitalName,
      yb: false,
      zsfphm: '',
    }
    let res = await aPrintMoth(params)
    if(res){
      if(0){
        this.print1(res)
      }else{
        this.printChargeBill(res)
      }
    }
  }

  private print1(res: any){}
  private printChargeBill(res: any){
    const __qiankun__ = window.__POWERED_BY_QIANKUN__
    let LODOP: any = null
    if (__qiankun__) {
      LODOP = Vue.prototype.$getLodop()
    } else {
      LODOP = getLodop()
    }
    if(!LODOP){
      console.log('没有安装打印控件');
      this.$emit('resetForm')
      // 是否继续结算
      let prevRecord = JSON.parse(localStorage.getItem('opSettlePrevRecord') as any)
      this.$emit('checkMultiple', prevRecord.jzkh, prevRecord.cardtype)
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
    }
  }
  // private printChargeBill(res: any){
  //   const __qiankun__ = window.__POWERED_BY_QIANKUN__
  //   let LODOP: any = null
  //   if (__qiankun__) {
  //     LODOP = Vue.prototype.$getLodop()
  //   } else {
  //     LODOP = getLodop()
  //   }
  //   if(!LODOP){
  //     console.log('没有安装打印控件');
  //     this.$emit('resetForm')
  //     // 是否继续结算
  //     let prevRecord = JSON.parse(localStorage.getItem('opSettlePrevRecord') as any)
  //     this.$emit('checkMultiple', prevRecord.jzkh, prevRecord.cardtype)
  //     return false
  //   }
  //   let mzxx = res.data.mzfpBaseResp[0]
  //   let sfxmList = res.data.sfxmList
  //   let ypList = res.data.ypList
  //   //获取打印机名称LODOP.GET_PRINTER_NAME()
  //   LODOP.PRINT_INIT('门（急）诊收费票据')
  //   LODOP.SET_PRINT_PAGESIZE(1, '241mm', '140mm', '')
  //   LODOP.SET_PRINT_STYLE('FontSize', 8)
  //   LODOP.ADD_PRINT_TEXT('16mm', '24mm', '64mm', '4mm', mzxx.jgmc)
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 13)
  //   LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
  //   LODOP.ADD_PRINT_TEXT('22mm','24mm','64mm','4mm', '医 疗 门（急）诊 收 费 票 据')
  //   LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
  //   LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
  //   LODOP.ADD_PRINT_TEXT('29mm','24mm','64mm','4mm', mzxx.yyyy)
  //   LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
  //   LODOP.ADD_PRINT_TEXT('33mm','28mm','30mm','4mm', '姓名：' + mzxx.xm)
  //   LODOP.ADD_PRINT_TEXT('33mm','63mm','30mm','4mm', '性别：' + (mzxx.brxb == '1' ? '男' : '女'))

  //   let printHeader1: any = (()=>{
  //     LODOP.ADD_PRINT_TEXT('38mm','36mm','10mm','4mm', '项目')
  //     LODOP.ADD_PRINT_TEXT('38mm','70mm','18mm','4mm', '金额（元）')
  //   })
  //   printHeader1()
  //   let initTop1 = 42
  //   let pages = 1 // 第几页
  //   let itemIndex1 = 0 // 单页内第几项
  //   for(let i = 0; i < sfxmList.length; i++){
  //     let top = initTop1 + itemIndex1 * 4
  //     LODOP.ADD_PRINT_TEXT(top + 'mm', '36mm', '24mm', '4mm', sfxmList[i].sfxm)
  //     LODOP.ADD_PRINT_TEXT(top + 'mm', '70mm', '24mm', '4mm', sfxmList[i].xmje)
  //     itemIndex1++
  //     if((i+1)%8==0 && i<sfxmList.length-1){
  //       LODOP.NEWPAGEA()
  //       itemIndex1 = 0
  //       pages++
  //       LODOP.SET_PRINT_STYLE('PageIndex', pages)
  //       printHeader1()
  //     }
  //   }
  //   LODOP.SET_PRINT_STYLE('PageIndex', 'first')
  //   LODOP.ADD_PRINT_TEXT('75mm', '28mm', '50mm', '4mm', '合计（大写）：' + numtochinese(mzxx.hjje.toString()))
  //   LODOP.ADD_PRINT_TEXT('82mm', '28mm', '50mm', '4mm', '总额：' + mzxx.hjje)
  //   LODOP.ADD_PRINT_TEXT('82mm', '56mm', '50mm', '4mm', '优惠：' + mzxx.jmje)
  //   LODOP.ADD_PRINT_TEXT('82mm', '78mm', '50mm', '4mm', '实际金额：' + (mzxx.grjf))
  //   LODOP.ADD_PRINT_TEXT('87mm', '28mm', '50mm', '4mm', '个人支付：' +(mzxx.grzf==null?0:mzxx.grzf) )
  //   LODOP.ADD_PRINT_TEXT('87mm', '66mm', '50mm', '4mm', '个人账户支付：' + mzxx.grzhzf)
  //   LODOP.ADD_PRINT_TEXT('92mm', '28mm', '50mm', '4mm', '医保统筹支付：' + mzxx.ybtczf)
  //   LODOP.ADD_PRINT_TEXT('92mm', '72mm', '50mm', '4mm', '附加支付：' + mzxx.fjzf)
  //   LODOP.ADD_PRINT_TEXT('97mm', '28mm', '50mm', '4mm', '现金支付中：分类自负' + (mzxx.flzf==null?0:mzxx.flzf) + '元')
  //   LODOP.ADD_PRINT_TEXT('97mm', '86mm', '50mm', '4mm', '自负' + (mzxx.zf==null?0:mzxx.zf)+ '元')
  //   LODOP.ADD_PRINT_TEXT('102mm', '28mm', '50mm', '4mm', '自费' + (mzxx.zifei==null?0:mzxx.zifei) + '元（不属于医保报销范围）')
  //   LODOP.ADD_PRINT_TEXT('107mm', '28mm', '50mm', '4mm', '当年账户余额：' + mzxx.dnzhye)
  //   LODOP.ADD_PRINT_TEXT('107mm', '66mm', '50mm', '4mm', '历年账户余额：' + mzxx.lnzhye)
  //   LODOP.ADD_PRINT_TEXT('122mm', '72mm', '50mm', '4mm', '现金支付：' + (mzxx.grjf))
  //   LODOP.ADD_PRINT_TEXT('29mm', '108mm', '50mm', '4mm', '服务业')
  //   LODOP.ADD_PRINT_TEXT('29mm', '126mm', '50mm', '4mm', '卡号：' + mzxx.shbzk)
  //   LODOP.ADD_PRINT_TEXT('29mm', '162mm', '50mm', '4mm', '医保类型：' + mzxx.jsfs)
  //   let printHeader2 = (()=>{
  //     LODOP.ADD_PRINT_TEXT('36mm', '110mm', '50mm', '4mm', '项目编码')
  //     LODOP.ADD_PRINT_TEXT('36mm', '136mm', '50mm', '4mm', '名称')
  //     LODOP.ADD_PRINT_TEXT('36mm', '159mm', '50mm', '4mm', '规格')
  //     LODOP.ADD_PRINT_TEXT('36mm', '170mm', '50mm', '4mm', '数量')
  //     LODOP.ADD_PRINT_TEXT('36mm', '179mm', '50mm', '4mm', '单位')
  //     LODOP.ADD_PRINT_TEXT('36mm', '187mm', '50mm', '4mm', '单价')
  //     LODOP.ADD_PRINT_TEXT('36mm', '197mm', '50mm', '4mm', '金额（元）')
  //   })
  //   printHeader2()
  //   let initTop2 = 42
  //   let itemIndex2 = 0 // 单页内第几项
  //   let page = 1 // 第几页
  //   console.log(ypList,11)
  //   for(let i = 0; i < ypList.length; i++){
  //     let top = initTop2 + itemIndex2 * 10
  //     LODOP.ADD_PRINT_TEXT(top + 'mm', '112mm', '24mm', '4mm', ypList[i].mxbm)
  //     LODOP.ADD_PRINT_TEXT(top + 'mm', '130mm', '24mm', '4mm', ypList[i].mxmc)
  //     LODOP.ADD_PRINT_TEXT(top + 'mm', '159mm', '24mm', '4mm', ypList[i].mxgg)
  //     LODOP.ADD_PRINT_TEXT(top + 'mm', '172mm', '24mm', '4mm', ypList[i].mxsl)
  //     LODOP.ADD_PRINT_TEXT(top + 'mm', '180mm', '24mm', '4mm', ypList[i].dw)
  //     LODOP.ADD_PRINT_TEXT(top + 'mm', '187mm', '24mm', '4mm', ypList[i].mxdj)
  //     LODOP.ADD_PRINT_TEXT(top + 'mm', '198mm', '24mm', '4mm', ypList[i].mxje)
  //     itemIndex2++
  //     if((i+1)% res.data.mzfpmxsl==0 && i<ypList.length-1){
  //       LODOP.NEWPAGEA()
  //       itemIndex2 = 0
  //       page++
  //       LODOP.SET_PRINT_STYLE('PageIndex', page)
  //       printHeader2()
  //     }
  //   }
  //   LODOP.SET_PRINT_STYLE('PageIndex', 'first') // 以下只打印在第一页
  //   LODOP.ADD_PRINT_TEXT('131mm', '28mm', '60mm', '4mm', '单据号：' + mzxx.fphm)
  //   LODOP.ADD_PRINT_TEXT('131mm', '80mm', '60mm', '4mm', '中心流水号：' + mzxx.zxlsh==null?'':mzxx.zxlsh)
  //   LODOP.ADD_PRINT_TEXT('131mm', '140mm', '60mm', '4mm', '收款员：' + mzxx.sfy)
  //   LODOP.ADD_PRINT_TEXT('131mm', '182mm', '50mm', '4mm', '收款单位（章）：')
  //   if(res.data.fpyl==='0'){
  //     LODOP.SET_PRINTER_INDEXA(res.data.mzhjsfdyjmc)
  //     LODOP.PRINT()
  //   }else{
  //     LODOP.PREVIEW();
  //   }
  // }
  // 关闭弹窗
  private resetSettlement(){
    const formData: any = this.$refs.formData
    formData.resetFields()
    this.loading = false
    this.payDataList = [{
      fkje:'',
      zfje:''
    }]
    this.jkdisabled = false
  }



  // 初始化参数
  private init() {
    let sqlStr = 'select * from ' + 'SYS_DICT_CONFIG_VALUE' + " where dk='" + 21 + "' and stop != 1"
    const _that = this // 切换this指向
    getTableData('SYS_DICT_CONFIG', 21, sqlStr, function (data: any) {
      _that.payDataList[0].options = data
    })
  }
  //初始化的周期函数
	created() {
    this.init()
  }
  mounted() {
    // this.getLists()
	}
}
</script>

<style lang="scss" scoped>
.area-title {
  margin: 10px 0 6px;
  padding: 4px 0 8px;
  border-bottom: 1px solid $border;
  .icon {
    color: $blue;
    vertical-align: middle;
  }
  span {
    margin-left: 4px;
    color: $first;
  }
}

.el-form{
  // padding: 0 24px!important;
	.el-form-item{
    float: left;
    display: block;
    width: calc((100% - 16px)/2);
    margin-bottom: 8px!important;
    &:nth-child(even){
      margin-left: 16px;
    }
    ::v-deep .el-form-item__content{
      margin-left: 66px!important;
      width: auto;
    }
    &[hidden]{
			display: none;
		}
  }
  .item-jkje ::v-deep .el-input__inner{
    font-size: 14px;
  }
}
.jm{
  float: left;
  margin-top: 8px;
  ::v-deep .el-checkbox__label{
    padding-left: 4px;
    font-size: 13px;
    color: $second;
  }
}
.addInfor{
  font-size: 23px;
  cursor: pointer;
  margin-left: 10px;
  width:25px;
}
.removeInfo{
  font-size: 23px;
  margin-left: 5px;
  cursor: pointer;
}
</style>
