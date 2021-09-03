<template>
  <!-- 结算 -->
  <el-dialog
    :title="'挂号结算'"
    :visible.sync="dialogSettlement"
    width="500px"
    :close-on-click-modal="false"
    @closed="resetSettlement"
		class="narrow-dialog"
  >
    <div class="dept-name">{{settleInfo.ksmc}}</div>
    <div class="his-module his-small">
      <el-form :model="formData" label-width="66px" ref="formData" class="clearfix">
        <!-- 发票号码 -->
        <el-form-item :label="'发票号码'" prop="fphm" disabled>
          <el-input
            v-model="formData.fphm"
            :placeholder="'发票号码'"
            :disabled="true"
          ></el-input>
        </el-form-item>

        <!-- 总计金额 -->
        <el-form-item :label="'总计金额'" prop="zjje" disabled>
          <el-input
            v-model="formData.zjje"
            :placeholder="'总计金额'"
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

        <!-- 现金金额 -->
        <!-- <el-form-item :label="'现金金额'" prop="xjje" disabled>
          <el-input
            v-model="formData.xjje"
            :placeholder="'现金金额'"
            :disabled="true"
            class="text-blue"
          ></el-input>
        </el-form-item> -->

        <!-- 账户金额 -->
        <el-form-item :label="'账户金额'" prop="zhje" disabled>
          <el-input
            v-model="formData.zhje"
            :placeholder="'账户金额'"
            :disabled="true"
            class="text-blue"
          ></el-input>
        </el-form-item>

        <!-- 减免金额 -->
        <el-form-item :label="'减免金额'" prop="jmje" disabled> <!-- 暂时不可改 -->
          <el-input
            v-model="formData.jmje"
            type="number"
            :placeholder="'减免金额'"
            @change="calcQtys"
            class="text-blue"
            :disabled="true"
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
        <!-- 应收款 -->
        <el-form-item :label="'应收款'" prop="ysk" disabled>
          <el-input
            v-model.number="formData.ysk"
            :placeholder="'应收款'"
            :disabled="true"
            class="text-red"
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
        <!-- 货币误差 -->
        <el-form-item :label="'货币误差'" prop="hbwc" disabled>
          <el-input
            v-model="hbwc"
            :placeholder="'货币误差'"
            :disabled="true"
            class="text-red"
          ></el-input>
        </el-form-item>
        
        <!-- <div class="div1"></div><div class="div2"></div> -->
        <!-- 付款方式 -->
        <!-- <el-form-item :label="'付款方式'" prop="fkfs">
          <search-select
            table-name="SYS_DICT_CONFIG"
            kid="21"
            v-model="formData.fkfs"
            :backfillValue="formData.fkfs"
            :placeholder="'付款方式'"
            :clearable="false"
          />
        </el-form-item> -->
        <!-- <el-form-item :label="'付款方式'" prop="fkfs">
          <search-select
            table-name="SYS_DICT_CONFIG"
            kid="21"
            v-model="formData.fkfs"
            :backfillValue="formData.fkfs"
            :placeholder="'付款方式'"
            :clearable="false"
          />
        </el-form-item> -->

        <!-- 暂时注销 -->
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
                  ref="inputJkje"
                ></el-input>
              </el-form-item>
            </div>
            <div class="removeInfo" v-if="i==1" @click="remPayDataList(i)">
              <span>-</span>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <!-- 费用发票（dyfs==3） -->
      <div id="fyfp" v-show="false">
        <div style="display: flex;justify-content: flex-start;margin-bottom:2mm">
          <p style="margin: 0 0 0 15mm;font-size: 12px;width:41mm">{{printData.now}}</p>
          <p style="margin: 0 0 0 15mm;font-size: 12px">医疗服务</p>
        </div>
        <div style="display: flex;justify-content: flex-start;margin-bottom: 2mm">
          <div style="display: flex;justify-content: center">
            <p style="margin: 0 0 0 10mm;font-size: 12px;width: 28mm">付款人单位姓名：</p>
            <p style="margin: 0;font-size: 12px;width: 34mm">{{printData.brxm}}</p>
          </div>
          <div style="display: flex;justify-content: center">
            <p style="margin: 0;font-size: 12px;width: 23mm">社会保障号码：</p>
            <p style="margin: 0;font-size: 12px;width: 23mm">{{printData.shbzk}}</p>
          </div>
          <div style="display: flex;justify-content: center">
            <p style="margin: 0;font-size: 12px">交易流水号：</p>
            <p style="margin: 0;font-size: 12px">{{printData.jzlsh}}</p>
          </div>
        </div>
        <div style="display: flex;justify-content: flex-start;border-bottom: 1px solid #000;padding-bottom: 1mm">
          <div style="display: flex;justify-content: center">
            <p style="margin: 0 0 0 10mm;font-size: 12px;width: 28mm">收款人单位名称：</p>
            <p style="margin: 0;font-size: 12px;width: 34mm">{{userInfo.hospitalName}}</p>
          </div>
          <div style="display: flex;justify-content: center">
            <p style="margin: 0;font-size: 12px;width:23mm">纳税人识别码：</p>
            <p style="margin: 0;font-size: 12px;width: 39mm">{{printData.nsrsbh}}</p>
          </div>
          <div style="display: flex;justify-content: center">
            <p style="margin: 0;font-size: 12px">类型：</p>
            <p style="margin: 0;font-size: 12px">{{printData.yblx}}</p>
          </div>
        </div>
        <div style="width: 100%;display: flex;">
          <!-- 左 -->
          <div style="width:33%;border-right: 1px solid #000;">
            <!-- 上 -->
            <div style="border-bottom: 1px solid #000;padding-bottom: 1mm">
              <div style="display: flex;justify-content: flex-start;margin-top:4mm">
                <p style="margin: 0 13mm 0 5mm;font-size: 13px;">挂号费：</p>
                <p style="margin: 0;font-size: 13px;">{{printData.jcf}}</p>
              </div>
              <div style="display: flex;justify-content: flex-start;margin-top:4mm">
                <p style="margin: 0 13mm 0 5mm;font-size: 13px">诊疗费：</p>
                <p style="margin: 0;font-size: 13px">{{printData.zlf}}</p>
              </div>
              <div style="display: flex;justify-content: flex-start;margin-top:4mm">
                <p style="margin: 0 13mm 0 5mm;font-size: 13px">其他费：</p>
                <p style="margin: 0;font-size: 13px">{{printData.qtf}}</p>
              </div>
              <p style="margin:3mm 0 0 15mm;font-size: 12px">{{printData.zjfy ? '专家号' : '普通号'}}</p>
              <p style="margin: 2mm 0 0 14mm;font-size: 13px">{{printData.ksmc}}</p>
            </div>
            <!-- 下 -->
            <div style="padding-top: 1mm">
              <div style="display: flex;justify-content:flex-start;margin: 0.5mm 2mm 0 4mm">
                <p style="font-size: 14px;margin: 0">合计(小写)：</p>
                <p style="font-size: 14px;margin: 0">{{printData.hjje}}</p>
              </div>
              <div style="display: flex;justify-content:flex-start;margin: 0.5mm 2mm 0 4mm">
                <p style="font-size: 14px;margin: 0">合计(大写)：</p>
                <p style="font-size: 14px;margin: 0">{{printData.hjjedx}}</p>
              </div>
              <div style="display: flex;justify-content:flex-start;margin-top: 1.5mm">
                <p style="font-size:14px;margin: 0 1mm 0 4mm">现金支付</p>
                <p style="font-size:14px;margin: 0 10mm 0 0">{{printData.xjzf}}</p>
                <p style="font-size:14px;margin: 0">账户支付</p>
                <p style="font-size: 14px;margin: 0 0 0 1mm">{{printData.grzhzf}}</p>
              </div>
              <div style="display: flex;justify-content:flex-start;margin-top: 0.5mm">
                <p style="font-size:14px;margin: 0 1mm 0 4mm">统筹支付</p>
                <p style="font-size:14px;margin: 0 10mm 0 0">{{printData.ybtczf}}</p>
                <p style="font-size:14px;margin: 0">附加支付</p>
                <p style="font-size: 14px;margin: 0 0 0 1mm">{{printData.fjzf}}</p>
              </div>
              <div style="display: flex;justify-content:flex-start;margin-top: 1mm">
                <p style="font-size: 14px;margin: 0 0 0 4mm">现金支付中分类自负</p>
                <p style="font-size: 14px;margin: 0">{{printData.flzf}}</p>
                <p style="font-size: 14px;margin: 0">自负</p>
                <p style="font-size: 14px;margin: 0">{{printData.zf}}</p>
              </div>
              <div style="display: flex;justify-content:flex-start;margin-top: 0.5mm">
                <p style="font-size: 14px;margin: 0 0 0 4mm">自费</p>
                <p style="font-size: 14px;margin: 0">{{printData.zfei}}</p>
                <p style="font-size: 14px;margin: 0">元</p>
                <p style="font-size: 14px;margin: 0">(不属于医保报销范围)</p>
              </div>
              <div style="display: flex;justify-content:flex-start;margin-top: 1mm">
                <p style="font-size: 14px;margin: 0 0 0 4mm">当年账户余额</p>
                <p style="font-size: 14px;margin: 0">{{printData.dnzhye}}</p>
              </div>
              <div style="display: flex;justify-content:flex-start;margin-top: 0.5mm">
                <p style="font-size: 14px;margin: 0 0 0 4mm">历年账户余额</p>
                <p style="font-size: 14px;margin: 0">{{printData.lnzhye}}</p>
              </div>
              <div style="display: flex;justify-content:flex-start;margin-top: 1mm">
                <p style="font-size: 14px;margin: 0 0 0 4mm">收款员：</p>
                <p style="font-size: 14px;margin: 0">{{printData.skygh}}</p>
              </div>
            </div>
          </div>
          <!-- 右 -->
          <div>
            <div style="display: flex;justify-content:flex-start;margin: 12mm 0 0 27mm">
              <p style="font-size: 14px;margin: 0">挂号科室：</p>
              <p style="font-size: 14px;margin: 0">{{printData.ksmc}}</p>
            </div>
            <div style="display: flex;justify-content:flex-start;margin: 7mm 0 0 26mm">
              <p style="font-size: 14px;margin: 0">就诊序号：</p>
              <p style="font-size: 14px;margin: 0">{{printData.jzxh}}</p>
            </div>
            <div style="margin: 8mm 0 0 24mm">
              <p style="font-size: 14px;margin: 0">{{printData.now}}</p>
            </div>
            <div style="display: flex;justify-content: flex-start;margin: 10mm 0 0 30mm">
              <p style="font-size: 14px;">注：</p>
              <p style="font-size: 14px;">挂号当天有效</p>
            </div>
            <div>
              <p style="font-size: 14px;margin: 15mm 0 0 22mm">医院禁止吸烟，谢谢配合!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
      

    
    <span slot="footer" class="dialog-footer">
      <!-- <el-checkbox v-model="checkedJm" class="jm" @change="changeJm">减免</el-checkbox> -->
      <el-button @click="dialogSettlement = false">取消</el-button>
      <el-button type="primary" @click="reg" ref="btnConfirm" :disabled="btnDisabled" :loading="loading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
	aQueryRegSettlement, aSaveReg, aCheckJmbr, aQuerySjBrxz, aPrintghxx
} from '@/api/his/op/reg/registerManage'
import { getNow, getParams } from '@/api/his/basic'
import { getFloat, mul, numtochinese } from '@/utils'
import { getLodop } from '@/plugins/lodop/index.js'
import { getTableData } from '@/websql/functions'
@Component({
  name: ''
})

export default class extends Vue {
  @Prop({ required: true, default: () => ({}) }) private settleInfo: any // 表单数据
  @Prop({ required: false, default: false }) private isAppointed!: boolean // 是否预约
  @Prop({ required: false, default: false }) private isEcQrcode!: boolean // 是否电子凭证
  @Prop({ required: false, default: false }) private isFree!: boolean // 是否预约
  @Prop({ required: false, default: false }) private isClinic!: boolean // 是否预约

	private dialogSettlement: boolean = false
  private formData: any = {
    fphm: '',
    zjje: '', // 总计金额
    zfje: '', // 自负金额
    xjje: '0.00', // 现金金额
    zhje: '0.00', // 账户金额
    jmje: '0.00', // 减免金额
    ysk: '', // 应收款
    qtys: '', // 其他应收
    jkje: '', // 交款金额
    fkfs: 1, // 付款方式
    tzje: '', // 退找金额

    //支票金额---付款方式==2
    zpje: '0.00'
  }
  private printData: any = {
    now: '',
    brxm: '',
    shbzk: '',
    jzlsh: '',
    nsrsbh: '',
    yblx: '',
    jcf: '',
    zlf: '',
    qtf: '',
    zjfy: '',
    ksmc: '',
    hjje: '',
    xjzf: '',
    grzhzf: '',
    ybtczf: '',
    fjzf: '',
    flzf: '',
    zf: '',
    zfei: '',
    dnzhye: '',
    lnzhye: '',
    skygh: '',
    jzxh: '',
    hjjedx: ''
  }
  get hbwc(){
    // 第一次进来的时候
    if(this.payDataList&&this.payDataList.length==1&&this.payDataList[0].fkfs==1){
      this.formData.ysk = getFloat(this.formData.ysk, 1)
    }
    let hbwc = (mul(this.formData.ysk, 100) - mul(this.ysk, 100)) / 100
    return getFloat(hbwc, 2)
  }
  private tableData1: any[] = []
  private listSlotHeight: number = 0
  private checkedJm: boolean = false // 是否勾选减免
  private jmbrInfo: any = false // 该病人的减免信息
  private btnDisabled: boolean = true
  private loading: boolean = false
  private ybxx: any = {} // 结算查询返回的医保信息
  private ysk:any =""
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

  get userInfo() {
    return JSON.parse(localStorage.userInfo)
  }

  // 打印
  private printFn(num:any,name:string) {
    const __qiankun__ = window.__POWERED_BY_QIANKUN__
    var LODOP: any = null
    if (__qiankun__) {
      LODOP = Vue.prototype.$getLodop()
    } else {
      LODOP = getLodop()
    }
    if (LODOP) {
      LODOP.PRINT_INIT()
      LODOP.SET_PRINT_PAGESIZE(1, '208mm', '139mm', 'A5') // 2-打印方向及纸张类型,
      var a: any = document.getElementById('fyfp')
      var op: any = '<body>' + a.innerHTML + '</body>'
      LODOP.ADD_PRINT_HTM('25mm', '20mm', '208mm', '139mm', op) // 
      if(num==='0'){
        LODOP.SET_PRINTER_INDEXA(name)
        LODOP.PRINT()
      }else{
        LODOP.PREVIEW();
      }
      // LODOP.PRINT() // 打印
    }
  }

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
    // this.payDataList.push({
    //   fkfs:'',
    //   fkje:''
    // })
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
    this.querySettlement()
    this.checkJmbr()
  }
  
  // 挂号结算查询
  private querySettlement(){
    let ghje
    if(this.settleInfo.zjmz){
      console.log('专家门诊');
      ghje = (mul(this.settleInfo.ghje, 100) + mul(this.settleInfo.zjfy, 100)) / 100
    }else if(this.settleInfo.txmz){
      console.log('特需门诊');
      ghje = (mul(this.settleInfo.ghje, 100) + mul(this.settleInfo.txfy, 100)) / 100
    }else{
      console.log('普通门诊');
      ghje = this.settleInfo.ghje
    }
    let params = {
      blje: this.settleInfo.blje, // 病历金额
      brxz: this.settleInfo.brxz, // 病人性质
      fkfs: this.formData.fkfs, // 付款方式
      ghje: this.settleInfo.ghje, // 挂号金额
      zjje: this.settleInfo.zjfy,
      zlje: this.settleInfo.zlje, // 诊疗金额
      jzkh: this.settleInfo.jzkh,
      ckje: this.settleInfo.ckje, // 磁卡费
      isYb: this.settleInfo.isYb, // 是否为医保
      ksdm: this.settleInfo.ksdm,
      ghlx: this.settleInfo.ghlx,// 1急诊
      isDb: this.settleInfo.isDb, // 是否大病
      dbtype: this.settleInfo.dbtype, // 大病项目
      isGs: this.settleInfo.isGs, // 是否工伤
      gsrdh: this.settleInfo.gsrdh, // 凭证号
      cardid: this.settleInfo.cardid, // 卡id
      cardtype: this.settleInfo.cardtype, // 卡类型
      accountattr: this.settleInfo.accountattr,
      ybsqjmbz: this.settleInfo.ybsqjmbz, // 医保社区减免标识
      sfmf:0,
      ghflb:this.settleInfo.ghflb||'',
      zlflb:this.settleInfo.zlflb ||'',
      zjflb:this.settleInfo.zjflb || ''
      // grxjzf: 0, // 个人需支付金额
    }
     //义诊的情况 不能走医保
    if(this.isClinic){
      params.sfmf = 1
      params.isYb=0
    }
    //免费的情况 不能走医保
    if(this.isFree){
      params.sfmf = 2
      params.isYb=0
    }
    if(this.isEcQrcode){
      params.cardtype='3'
    }
    aQueryRegSettlement(params).then((res: any) => {
      if(res.errorCode=="SUCCESS"){
        this.formData.fphm = this.settleInfo.fphm
        // 总计金额赋给总计金额，自负金额赋给自负金额和应收款，其他应收（qtys）没用到
        this.formData.zjje = getFloat(res.data.zjje, 2)
        this.formData.zfje = getFloat(res.data.zfje, 2)
        // this.formData.ysk = getFloat(res.data.zfje, 2) // 减免修改
        this.formData.ysk = getFloat(res.data.ysk, 2) // 减免修改
        this.formData.jmje = getFloat(res.data.jmje?res.data.jmje:0, 2) // 减免修改
        this.formData.jkje = this.formData.ysk
        // this.formData.tzje = 0.00
        this.formData.fkfs = res.data.fkfs
        this.ysk = getFloat(res.data.ysk, 2)
        //付款方式
        this.payDataList[0].fkfs = res.data.fkfs
        //方式不是现金的时候 禁止
        if(res.data.fkfs!=1){
          this.jkdisabled = true
          this.formData.jkje="0.00"
        }else{
          this.formData.jkje = getFloat(res.data.ysk, 1)
          console.log(this.formData.jkje,"this.formData.jkje")
        }
        // 取医保信息
        this.ybxx = res.data
        // 选中文字
        this.$nextTick(()=>{
          const inputJkje: any = this.$refs.inputJkje
          inputJkje.select()
        })
        this.btnDisabled = false
      }else{
        this.$message({
          message: res.message,
          type: 'error',
        })
        this.btnDisabled = true
      }
    })
  }

  // 根据减免金额计算应收款@change
  private calcQtys(value: any){
    if(this.jmbrInfo){ // 获取到减免信息
      if(this.jmbrInfo.data){ // 可以减免
      }else{
        this.$notify({
          title: this.jmbrInfo.message,
          message: '',
          type: 'error'
        })
        this.formData.jmje = '0.00'
        return false
      }
    }else{ // 接口异常，未获取到
      this.$notify({
        title: '未获取到减免信息',
        message: '',
        type: 'error'
      })
      this.formData.jmje = '0.00'
      return false
    }


    if(parseFloat(value) > parseFloat(this.formData.zfje)){
      this.formData.jmje = '0.00'
      this.formData.ysk = this.formData.zfje
      this.$notify({
        title: '减免金额不能大于自负金额',
        message: '',
        type: 'error'
      })
    }else{
      this.formData.ysk = (mul(this.formData.zfje, 100) - mul(value, 100))/100
      this.formData.jmje = getFloat(value, 2)
      this.formData.ysk = getFloat(this.formData.ysk, 2)
      this.formData.jkje = this.formData.ysk
      this.formData.tzje = 0
    }
  }

  // 聚焦填入交款金额
  private setJkje(){
    if(this.formData.jkje == ''){
      this.formData.jkje = this.formData.ysk
      this.formData.tzje = 0
    }
  }

  // 交款金额回车键 @keyup
  private jkjeEnter(){
    let result = this.judgeJkje()
    if(result == 'y'){
      // 使确认按钮获取焦点
      const btnConfirm: any = this.$refs.btnConfirm
      btnConfirm.$el.focus()
    }
  }

  // 交款金额失焦 @blur
  private jkjeBlur(){
    let result = this.judgeJkje()
    if(result == 'y'){
      // 使确认按钮获取焦点
      // const btnConfirm: any = this.$refs.btnConfirm
      // btnConfirm.$el.focus()
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
  //付款方式改变
  private changeFkfs(val:any,num:number){
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
        // this.jkdisabled = false
        // this.formData.jkje = this.payDataList[params.indexOf('1')].jkje
      }else{
        // this.jkdisabled = true
        // this.formData.jkje="0.00"
        // this.formData.tzje = '0.00'
        this.jkdisabled = true
        this.formData.jkje="0.00"
        this.formData.tzje = '0.00'
        this.formData.ysk = this.ysk
      }
    }
    
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
  // 全部减免
  private changeJm(value: boolean){
    if(value){
      if(this.jmbrInfo){ // 获取到及减免信息
        if(this.jmbrInfo.data){ // 可以减免
          this.formData.jmje = this.formData.zfje
          this.formData.tzje = 0
        }else{ // 不可以减免
          this.$notify({
            title: this.jmbrInfo.message,
            message: '',
            type: 'error'
          })
          this.$nextTick(()=>{
            this.checkedJm = false
          })
        }
      }else{ // 接口异常，未获取到
        this.$notify({
          title: '未获取到减免信息',
          message: '',
          type: 'error'
        })
        this.$nextTick(()=>{
          this.checkedJm = false
        })
      }
      
    }else{
      this.formData.jmje = '0.00'
    }
    this.calcQtys(this.formData.jmje)
  }

  // 判断能否减免
  private checkJmbr(){
    let params = {
      brxz: this.settleInfo.brxz,
      cardno: this.settleInfo.jzkh
    }
    aCheckJmbr(params).then((res: any) => {
      if(res){
        this.jmbrInfo = res
      }
    })
  }

  // 确认挂号
  private reg(){
    // this.print()
    // return false
    let result = this.judgeJkje()
    console.log(this.formData,666,this.settleInfo,"settleInfo")
    if(result == 'y'){
      this.loading = true
      let params = {
        ghxx: {
          ...this.settleInfo,
          ...this.formData,
          ghrq: this.settleInfo.ghrq+' 00:00:00',
          ghsj: this.settleInfo.ghrq+'T00:00:00',
          zblb: this.settleInfo.ghlb,
          xjje: this.formData.ysk,
          yybz: this.isAppointed?1:0, // 预约标志
          // yyxh: 1, // 预约序号
          zsid: 0, // 诊室id
          gzdwmc: '', // 挂账单位名称
          sfmf:0  //是否免费  0默认 1义诊 2 免费
        },
        yytag: 1,
        ghyj: false, // 挂号预检
        isYb: this.settleInfo.isYb,
        ybxx: this.ybxx
      }
      
     //义诊的情况 不能走医保
      if(this.isClinic){
        params.ghxx.sfmf = 1
        params.isYb=0
      }
      //免费的情况 不能走医保
      if(this.isFree){
        params.ghxx.sfmf = 2
        params.isYb=0
      }
      if(this.isEcQrcode){
        params.ghxx.cardtype='3'
      }
      //单一付款
      if(this.payDataList.length===1){
        params.ghxx.fkxxList = [{
          fkfs:this.payDataList[0].fkfs,
          fkje:this.formData.ysk
        }]
      }else{
        let fkxx:any = []
        this.payDataList.map((item:any)=>{
          // params.ghxx.fkfs = [{
          //   fkfs:this.payDataList[0].fkfs,
          //   fkje:this.formData.ysk
          // }]
          fkxx.push({
            fkfs:item.fkfs,
            fkje:item.jkje
          })
        })
        params.ghxx.fkxxList = fkxx
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
      // return false
        aSaveReg(params).then((res: any) => {
          if(res.errorCode=='SUCCESS'){
            this.$notify({
              title: '挂号成功',
              message: '',
              type: 'success'
            })
            this.dialogSettlement = false
            this.$emit('resetForm')
            if(!this.isFree&&!this.isClinic){
              this.print(params.ghxx, res.data)
            }
          }else{
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
          setTimeout(() => {
            this.loading = false
          }, 1000);
        })
      }
    }
    
  }

  // 关闭弹窗
  private resetSettlement(){
    const formData: any = this.$refs.formData
    formData.resetFields()
    this.checkedJm = false
    this.loading = false
    this.payDataList = [{
      fkje:'',
      zfje:''
    }]
    this.jkdisabled = false
  }

  // 打印发票
  private async print(ghxx1: any, ghxx2: any){ // (挂号前的参数，挂号成功后的返回)
    let sjbrxz, ybsjbrxz, sqjhbhzks

    let res1 = await aQuerySjBrxz({brxz: ghxx1.brxz})
    if(res1){
      sjbrxz = res1.data
    }

    let res2 = await getParams({commons: ['YBXZ']})
    if(res2){
      ybsjbrxz = res2.data.YBXZ
    }

    let res3 = await getParams({privates: ['SQJHBHZKS']})
    if(res3){
      sqjhbhzks = res3.data.YBXZ
    }

    let params = {
      brxz: sjbrxz,
      ybsjbrxz: ybsjbrxz,
      jzhm: ghxx2.jzhm,
      sbxh: ghxx2.sbxh,
      ksdm: ghxx1.ksdm
    }
    let res = await aPrintghxx(params)
    this.printData = res.data
    this.printData.hjjedx = res.data.hjje ? numtochinese(res.data.hjje.toString()) : '0.00'
    this.printData.jcf = getFloat(res.data.jcf,2)
    this.printData.zlf = getFloat(res.data.zlf,2)
    this.printData.qtf = getFloat(res.data.qtf,2)
    this.printData.hjje = getFloat(res.data.hjje,2)
    this.printData.xjzf = getFloat(res.data.xjzf,2)
    this.printData.grzhzf = getFloat(res.data.grzhzf,2)
    this.printData.ybtczf = getFloat(res.data.ybtczf,2)
    this.printData.fjzf = getFloat(res.data.fjzf,2)
    this.printData.flzf = getFloat(res.data.flzf,2)
    this.printData.zf = getFloat(res.data.zf,2)
    this.printData.zfei = getFloat(res.data.zfei,2)
    this.printData.dnzhye = getFloat(res.data.dnzhye,2)
    this.printData.lnzhye = getFloat(res.data.lnzhye,2)
    console.log(958,this.printData)
    if(res){
      // if(0){
      // }else{
        this.print2(ghxx1, ghxx2, res, sjbrxz, ybsjbrxz)
      // }
    }

  }
  
  // 打印发票
  private print2(ghxx1: any, ghxx2: any,res: any, sjbrxz: any, ybsjbrxz: any){
    if(res.data.dyfs==1){
      // const LODOP = getLodop()
      const __qiankun__ = window.__POWERED_BY_QIANKUN__
      let LODOP: any = null
      if (__qiankun__) {
        console.log('主项目');
        LODOP = Vue.prototype.$getLodop()
      } else {
        console.log('子项目');
        LODOP = getLodop()
      }
      if(!LODOP){
        console.log('没有安装打印控件');
        this.$emit('resetForm')
        return false
      }
      LODOP.PRINT_INITA("0mm", "0mm", "235mm", "140mm", "挂号收费发票");
      LODOP.SET_PRINT_STYLE("FontColor", "#0000FF");
      LODOP.SET_PRINT_STYLE("FontSize", 10.5);
      LODOP.SET_PRINT_PAGESIZE(1, "235mm", "139.140mm", "");
      LODOP.SET_PRINT_STYLE("FontSize", 9);

      LODOP.ADD_PRINT_TEXT("12mm", "180mm", "40mm", "6mm", res.data.jzhm);
      LODOP.SET_PRINT_STYLEA(0,"FontSize", 14);

      LODOP.ADD_PRINT_TEXT("26mm", "176mm", "35mm", "5.29mm", res.data.now.substr(0, 10));
      let fb // 费别
      if(ghxx2.dbbz=='1'){
        fb = '城镇大病' //大病医保
      }else{
        fb = res.data.yblx //医保类型
      }
      LODOP.ADD_PRINT_TEXT("33mm", "43mm", "83mm", "5.29mm", `${ghxx1.brxm} ${ghxx2.csny} ${ghxx1.brxb == 1 ? '男' : '女'} ${fb}`);//病人信息
      LODOP.ADD_PRINT_TEXT("41mm", "43mm", "83mm", "5.29mm", `${res.data.ksmc} ${res.data.jzxh}号 ${res.data.kswz||''}`); // 科室信息
      LODOP.ADD_PRINT_TEXT("46mm", "43mm", "83mm", "5.29mm", `卡号：${res.data.shbzk}`);//业务流水号

      LODOP.ADD_PRINT_TEXT("59mm", "11mm", "51mm", "4mm", `*诊查费(自费)：`);//收费项目
      LODOP.ADD_PRINT_TEXT("59mm", "87mm", "12mm", "4mm", '次'); //单位
      LODOP.ADD_PRINT_TEXT("59mm", "100mm", "20mm", "4mm", 1);  //数量
      LODOP.SET_PRINT_STYLE('Alignment',3)
      LODOP.ADD_PRINT_TEXT("59mm", "120mm", "20mm", "4mm", getFloat(res.data.jcf, 2)); // 挂号费
      LODOP.ADD_PRINT_TEXT("59mm", "135mm", "30mm", "4mm", getFloat(res.data.jcf, 2));//金额
      LODOP.SET_PRINT_STYLE('Alignment',1)
      LODOP.ADD_PRINT_TEXT("59mm", "170mm", "10mm", "4mm", '免税');
      LODOP.ADD_PRINT_TEXT("59mm", "200mm", "30mm", "4mm", '***');

      LODOP.ADD_PRINT_TEXT("63mm", "11mm", "51mm", "4mm", `*诊查费：`);//收费项目
      LODOP.ADD_PRINT_TEXT("63mm", "87mm", "12mm", "4mm", '次'); //单位
      LODOP.ADD_PRINT_TEXT("63mm", "100mm", "20mm", "4mm", 1);  //数量
      LODOP.SET_PRINT_STYLE('Alignment',3)
      LODOP.ADD_PRINT_TEXT("63mm", "120mm", "20mm", "4mm", getFloat(res.data.zlf, 2)); // 挂号费
      LODOP.ADD_PRINT_TEXT("63mm", "135mm", "30mm", "4mm", getFloat(res.data.zlf, 2));//金额
      LODOP.SET_PRINT_STYLE('Alignment',1)
      LODOP.ADD_PRINT_TEXT("63mm", "170mm", "10mm", "4mm", '免税');
      LODOP.ADD_PRINT_TEXT("63mm", "200mm", "30mm", "4mm", '***');

      LODOP.SET_PRINT_STYLE('Alignment',3)
      LODOP.ADD_PRINT_TEXT("95mm", "135mm", "30mm", "6mm", ghxx1.zjje); //合计
      LODOP.SET_PRINT_STYLE('Alignment',1)
      LODOP.ADD_PRINT_TEXT("95mm", "200mm", "30mm", "4mm", '***');

      LODOP.ADD_PRINT_TEXT("103mm", "73mm", "90mm", "5.29mm", numtochinese(ghxx1.zjje));//合计大写
      LODOP.ADD_PRINT_TEXT("103mm", "179mm", "41mm", "5.29mm", `￥${ghxx1.zjje}`);//合计大写

      // 左下===========================================
      LODOP.ADD_PRINT_TEXT("108mm", "62mm", "82mm", "4mm", `${JSON.parse(localStorage.getItem('userInfo') as any).hospitalName}`); //收款单位

      // 右下===========================================
      let zf
      if(res.data.zf){
        zf = res.data.zf //自负
      }else{
        if (sjbrxz == ybsjbrxz) {
          zf = ''
        }else{//自费病人：自付金额 取诊疗费 ??
          zf = res.data.zlf //自负
        }
        //LODOP.ADD_PRINT_TEXT("98mm","42.5mm","26mm","6.61mm","自负    "+"元");//自负
      }

      //如果是预付款支付
      let fkxx // 付款信息
      if (res.data.fkfs == 36) {  //充值卡
        fkxx = `预付卡支付：${res.data.czkzf}元 预付卡余额：${res.data.czkye}元`
      }
      else {
        fkxx = `收款：${ghxx1.jkje}元 找回：${ghxx1.tzje}元`
      }

      // LODOP.ADD_PRINT_TEXT("108mm", "130mm", "80mm", "20mm",`个人账户支付：${res.data.grzhzf} 医保统筹支付：${res.data.ybtczf} 附加支付：${res.data.fjzf} 现金支付中：分类自负0.00元 自负 ${zf}元 自费 ${res.data.jcf}元(不属于医保报销范围) 当年账户余额：${res.data.dnzhye} 历年账户余额：${res.data.lnzhye} 医院减免金额：${res.data.jmje}元 ${fkxx} 中心流水号:${res.data.zxlsh||''}`)
      LODOP.ADD_PRINT_TEXT("108mm", "130mm", "80mm", "20mm",`医院减免金额：${res.data.jmje}元 ${fkxx}`)
      
      // 右下====================================================

      if(res.data.fpyl==='0'){
        LODOP.SET_PRINTER_INDEXA(res.data.ghdyjmc)
        LODOP.PRINT()
      }else{
        LODOP.PREVIEW();
      }
      // if (LODOP.SET_PRINTER_INDEXA("ghdyjmc")) {
      //   LODOP.PRINT();
      // } else {
      //   LODOP.PREVIEW();
      // }
      this.$emit('resetForm')
    }else if(res.data.dyfs == 3){
      this.$nextTick(()=>{
        this.printFn(res.data.fpyl,res.data.ghdyjmc)
      })
    }else{
      this.$emit('resetForm')
    }
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
    this.listSlotHeight = Vue.prototype.PageHeight - 230

  }
  mounted() {
    // this.getLists()
	}
}
</script>

<style lang="scss" scoped>
.dept-name{
  margin-bottom: 10px;
  padding: 10px 16px!important;
  font-size: 16px;
  color: $blue;
  font-family: "siyuanMedium";
  border-bottom: 1px solid #f0f0f0;
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
.div1{
  width: 100px;
  height: 100px;
  background: rgba($color: $red, $alpha: .5);
}
.div2{
  width: 100px;
  height: 100px;
  background: #f38787;
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
