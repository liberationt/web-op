<template>
  <!-- 发票作废/取消作废弹窗 -->
  <div>
    <el-dialog
      :title="!onlyQuery?'发票作废':'单据查询'"
      :visible.sync="dialogVisible"
      width="700px"
      :close-on-click-modal="false"
      class="narrow-dialog"
      v-elDraggableDialog
      @close="closeDialog"
    >
      <div class="dialog-body-content" v-loading="isLoading">
        <div class="row narrow-padding" >
          <div class="btn" v-if="!onlyQuery">
            <el-button
              type="text"
              size="mini"
              @click="beforeInvoiceVoid"
              :disabled="!isVoid"
            >
              <i class="icon his-caozuo-cancellation red"></i>作废
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="cancelInvoiceVoid"
              :disabled="isVoid||isTrue"
            >
              <i class="icon his-caozuo-cancellation-cancel green"></i>取消作废
            </el-button>
            <!-- <el-button
              type="text"
              size="mini"
              :disabled="isTrue"
            >
              <i class="icon his-caozuo-cancellation-cancel blue"></i>改退现金作废
            </el-button> -->
            <el-button
              type="text"
              size="mini"
              :disabled="isTrue||isYb"
              @click="ybZf"
            >
              <i class="icon his-caozuo-cancellation-cancel blue"></i>医保失败作废
            </el-button>
          </div>
          <div class="btn" v-else>
            <el-button
              type="text"
              size="mini"
              @click="dialogVisible=false"
            >
              <i class="icon his-caozuo-cancellation red"></i>关闭
            </el-button>
          </div>
        </div>

        <div class="his-module his-small">
          <el-form :model="patientInfo" label-width="60px" class="clearfix">
            <!-- 卡号 -->
            <el-form-item :label="'卡号'" disabled>
              <el-input
                v-model="patientInfo.jzkh"
                :placeholder="'就诊卡号'"
                :disabled="true"
              ></el-input>
            </el-form-item>
            
            <!-- 患者姓名 -->
            <el-form-item :label="'患者姓名'" disabled>
              <el-input
                v-model="patientInfo.brxm"
                :placeholder="'患者姓名'"
                :disabled="true"
              ></el-input>
            </el-form-item>

            <!-- 患者性质 -->
            <el-form-item :label="'收费性质'" disabled>
              <search-select
                table-name="SYS_DICT_CONFIG"
                kid="14"
                v-model="patientInfo.brxz"
                :backfillValue="patientInfo.brxz"
                :disabled="true"
                :placeholder="'收费性质'"
                class="no-arrow"
              />
            </el-form-item>

            <!-- 发票号码 -->
            <el-form-item :label="'发票号码'" disabled>
              <el-input
                v-if="isVoid"
                v-model="fphm1"
                :placeholder="'发票号码'"
                :disabled="true"
              ></el-input>
              <el-input
                v-else
                v-model="fphm2"
                :placeholder="'发票号码'"
                :disabled="true"
              ></el-input>
            </el-form-item>

            <!-- 患者性别 -->
            <el-form-item :label="'患者性别'" disabled>
              <search-select
                table-name="SYS_PRIMARY_DATA"
                kid="PD0000000269"
                v-model="patientInfo.brxb"
                :backfillValue="patientInfo.brxb"
                :disabled="true"
                :placeholder="'性别'"
                class="no-arrow"
              />
            </el-form-item>

            <!-- 年龄 -->
            <el-form-item :label="'年龄'" disabled>
              <el-input
                v-model="patientInfo.age"
                :placeholder="'年龄'"
                :disabled="true"
              ></el-input>
            </el-form-item>

            <!-- 就诊流水号 -->
            <el-form-item :label="'就诊流水号'" disabled hidden>
              <el-input
                v-model="patientInfo.jzlsh"
                :placeholder="'就诊流水号'"
                :disabled="true"
              ></el-input>
            </el-form-item>

            <!-- 是否医保 -->
            <el-form-item :label="'是否医保'" disabled hidden>
              <el-input
                v-model="patientInfo.isYb"
                :placeholder="'是否医保'"
                :disabled="true"
              ></el-input>
            </el-form-item>

          </el-form>

          <el-table
            stripe 
            :highlight-current-row="true"
            :data="tableData"
            border
            height="300"
            row-key="rowKey"
            :span-method="arraySpanMethod"
            default-expand-all
            tooltip-effect="light"
            class="no-underline"
          >
            <el-table-column width="1">
              <template slot-scope="scope" v-if="scope.row.count">
                <div class="data-head">
                  <span>{{scope.row.djlxText}}{{scope.row.cfsb}}</span>

                  <el-divider direction="vertical"></el-divider>

                  <!-- 门诊科室 -->
                  <span v-if="deptList.find(item => item.dv==scope.row.ksdm)">{{deptList.find(item => item.dv==scope.row.ksdm).dn}}</span>
                  <span v-else>{{scope.row.ksdm}}</span>

                  <el-divider direction="vertical"></el-divider>

                  <!-- 医生姓名 -->
                  <span v-if="docList.find(item => item.dv==scope.row.ysdm)">{{docList.find(item => item.dv==scope.row.ysdm).dn}}</span>
                  <span v-else>{{scope.row.ysdm}}</span>

                  <el-divider direction="vertical"></el-divider>

                  <span>({{scope.row.count}} 条记录)</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="SerialNumber" width="32" align="center"></el-table-column>

            <!-- 药品名称 -->
            <el-table-column
              prop="ypmc"
              :label="'药品名称'"
              width="160"
              show-overflow-tooltip
            ></el-table-column>
            
            <el-table-column prop="ypcd" :label="'药品产地'">
              <template slot-scope="scope">
                <div v-if="ypcdList.find(item => item.dv==scope.row.ypcd)" class="text-ellipsis">
                  {{ypcdList.find(item => item.dv==scope.row.ypcd).dn}}
                </div>
                <div v-else>{{scope.row.ypcd}}</div>
              </template>
            </el-table-column>

            <el-table-column prop="yfdw" :label="'单位'" width="50"></el-table-column>
            <el-table-column prop="yfgg" :label="'规格'"></el-table-column>

            <el-table-column prop="ypdj" :label="'单价'" width="60" align="right" class-name="text-blue-td">
              <template slot-scope="scope">
                {{useGetFloat(scope.row.ypdj, 4)}}
              </template>
            </el-table-column>

            <el-table-column prop="ypsl" :label="'数量'" width="50" align="right"></el-table-column>

            <el-table-column prop="hjje" :label="'金额'" width="60" align="right" class-name="text-blue-td">
              <template slot-scope="scope">
                {{useGetFloat(scope.row.hjje, 2)}}
              </template>
            </el-table-column>

            <el-table-column prop="zfbl" :label="'自负比例'" align="right">
              <template slot-scope="scope">
                <div v-if="scope.row.zfbl!=null">{{useMul(scope.row.zfbl, 100)+"%"}}</div>
                <div v-else>{{scope.row.zfbl}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="row bottom-bar">
          <p>
            西药费:
            <em>{{this.price.cflx1}}</em>
          </p>
          <el-divider direction="vertical"></el-divider>
          <p>
            中药费:
            <em>{{this.price.cflx2}}</em>
          </p>
          <el-divider direction="vertical"></el-divider>
          <p>
            草药费:
            <em>{{this.price.cflx3}}</em>
          </p>
          <el-divider direction="vertical"></el-divider>
          <p>
            检查费:
            <em>{{this.price.cflx0}}</em>
          </p>
          <el-divider direction="vertical"></el-divider>
          <p>
            合计金额:
            <em>{{this.price.amount}}</em>
          </p>
          <el-divider direction="vertical"></el-divider>
          <p>
            自负金额:
            <em>{{this.price.zfamount}}</em>
          </p>
        </div>

        <div class="stamp" v-if="!isVoid">
          <i class="icon his-yizuofei-tuzhang-19 blue"></i>
        </div>
        <!-- <pre>{{tableData}}</pre> -->
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </span> -->
    </el-dialog>

    <el-dialog
      :title="'医保患者请读卡'"
      :visible.sync="dialogVisible2"
      width="400px"
      top="30vh"
      :close-on-click-modal="false"
      class="narrow-dialog read-card"
      v-elDraggableDialog
      @close="closeDialog2"
    >
      <div>
        <div style="margin-bottom:12px"><el-checkbox v-model="isEcQrcode" class="ec-qrcode">电子凭证</el-checkbox></div>
        <el-input
          v-model="ybCarddata"
          @keyup.enter.native="jzkhEnter"
          class="queryInput"
        ></el-input>
        <el-button
          type="primary"
          class="blue-btn"
          icon="icon his-reading-card"
          @click="readCard('1')"
        >读卡</el-button>
      </div>
    </el-dialog>
  </div>
  
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aUpdateVoidInvoice, aUpdateCanceledVoidInvoice } from '@/api/his/op/reg/regInvoiceVoid.ts'
import { aQuerySjBrxz } from '@/api/his/op/reg/registerManage.ts'
import { aReadMedAcc } from '@/api/his/basic'
import { getFloat, mul } from '@/utils'

@Component({
  name: ''
})

export default class extends Vue {
  @Prop({ required: false, default: () => ({}) }) private patientInfo: any // 病人信息
  @Prop({ required: false, default: () => ({}) }) private djDetails: any // 单据明细
  @Prop({ required: false, default: '' }) private fphm1!: string // 待作废发票号码
  @Prop({ required: false, default: '' }) private fphm2!: string // 已作废发票号码
  @Prop({ required: false, default: '' }) private isVoid!: boolean // 当前是作废还是取消作废
  @Prop({ required: false, default: '' }) private onlyQuery!: boolean // 是否只是查看
  @Prop({ required: false, default: '' }) private isTrue!: boolean // 是否只是查看
  @Prop({ required: false, default: '' }) private isYb!: boolean // 是否只是查看



  private dialogVisible: boolean = false
  private isLoading: boolean = true
  private fphm: string = ''
  private tableData: any[] = [
    {
      rowKey: '1',
      prescript: '西药方1',
      dept: '口腔科',
      patientName: '江继强',
      drugCount: 2,
      children:[
        {rowKey: '1-1',name:'阿奇霉素',place:'辉瑞制药',unit:'盒',spec:'250mg*6片',price:'59.5300',count:'1',money:'59.53',zfbl:'1.150'},
        {rowKey: '1-2',name:'维A酸乳膏',place:'重庆华邦',unit:'支',spec:'30g:7.5mg',price:'15.9700',count:'1',money:'15.97',zfbl:'1.150'}
      ]
    },
    {
      rowKey: '2',
      prescript: '西药方2',
      dept: '口腔科',
      patientName: '江继强',
      drugCount: 3,
      children:[
        {rowKey: '2-1',name:'阿奇霉素',place:'辉瑞制药',unit:'盒',spec:'250mg*6片',price:'59.5300',count:'1',money:'59.53',zfbl:'1.150'},
        {rowKey: '2-2',name:'维A酸乳膏',place:'重庆华邦',unit:'支',spec:'30g:7.5mg',price:'15.9700',count:'1',money:'15.97',zfbl:'1.150'},
        {rowKey: '2-3',name:'维A酸乳膏',place:'重庆华邦',unit:'支',spec:'30g:7.5mg',price:'15.9700',count:'1',money:'15.97',zfbl:'1.150'}
      ]
    }
  ]
  private price: any = {
    cflx1: 0,
    cflx2: 0,
    cflx3: 0,
    cflx0: 0,
    amount: 0,
    zfamount:0
  }
  private docList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT // 医生列表
  private deptList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.OUTPATIENT_DEPARTMENT : this.$store.state.webSqlDict.OUTPATIENT_DEPARTMENT // 门诊科室
  private ypcdList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_DRUGMADEIN_DICT : this.$store.state.webSqlDict.DRUG_DRUGMADEIN_DICT // 药品产地

  private dialogVisible2: boolean = false
  private ybCarddata: any = ''
  private isEcQrcode: boolean = false

  // 保留n位小数
	private useGetFloat(num: any, n: number){
		return getFloat(num, n)
  }
  
  // 乘法
	private useMul(a: number, b: number){
		return mul(a, b)
	}

	// 打开弹窗
	private openDialog(){
    this.dialogVisible = true
    this.isLoading = true
  }
  private ybZf(){
    this.invoiceVoidYb()
  }
  // 处理数组
  private transform(){
    var arrDjDetails: any = [
      {
        "sortType":null,"ztbh":null,"brid":2012123045,"yjxh":null,"ypzh":null,"djlxText":"西药方:","sbxh":56,"ypxh":348,"ypmc":"(乙甲)过氧化氢溶液1",cfhm:"51","kfrq":"2020-07-08 20:11:10","cflx":1,"ksdm":null,"ysdm":null,"djly":6,"yfdw":"瓶",cfsb:51,"yfgg":"3%×100ml","ypdj":14.5000,"ypdjY":14.5000,"ypsl":3.00,"hjje":43.50,"zfbl":1.150,"ypyf":"","fygb":2,"gbmc":"西药费","cfts":1,"ycsl":0,"zfpb":0,"zxks":0,"zkbl":null,"zhje":0.00,"ypcd":696,"djybz":0,"yfsb":1,"sfjg":null
      },
      {
        "sortType":null,"ztbh":null,"brid":2012123045,"yjxh":null,"ypzh":null,"djlxText":"中药方:","sbxh":57,"ypxh":1045,"ypmc":"(乙10)迈之灵片",cfhm:"52","kfrq":"2020-07-08 20:11:33","cflx":2,"ksdm":null,"ysdm":null,"djly":6,"yfdw":"盒",cfsb:52,"yfgg":"260mg*20s","ypdj":2.1215,"ypdjY":2.1215,"ypsl":2.00,"hjje":4.24,"zfbl":1.150,"ypyf":"","fygb":3,"gbmc":"中成药","cfts":1,"ycsl":0,"zfpb":0,"zxks":0,"zkbl":null,"zhje":0.00,"ypcd":643,"djybz":0,"yfsb":1,"sfjg":null
      },
      {
        "sortType":null,"ztbh":null,"brid":2012123045,"yjxh":null,"ypzh":null,"djlxText":"西药方:","sbxh":58,"ypxh":348,"ypmc":"(乙甲)过氧化氢溶液2",cfhm:"51","kfrq":"2020-07-08 20:11:10","cflx":1,"ksdm":null,"ysdm":null,"djly":6,"yfdw":"瓶",cfsb:51,"yfgg":"3%×100ml","ypdj":14.5000,"ypdjY":14.5000,"ypsl":3.00,"hjje":43.50,"zfbl":1.150,"ypyf":"","fygb":2,"gbmc":"西药费","cfts":1,"ycsl":0,"zfpb":0,"zxks":0,"zkbl":null,"zhje":0.00,"ypcd":696,"djybz":0,"yfsb":1,"sfjg":null
      },
      {
        "sortType":null,"ztbh":null,"brid":2012123045,"yjxh":null,"ypzh":null,"djlxText":"西药方:","sbxh":59,"ypxh":348,"ypmc":"ddddd-1",cfhm:"53","kfrq":"2020-07-08 20:11:10","cflx":1,"ksdm":null,"ysdm":null,"djly":6,"yfdw":"瓶",cfsb:53,"yfgg":"3%×100ml","ypdj":14.5000,"ypdjY":14.5000,"ypsl":3.00,"hjje":43.50,"zfbl":1.150,"ypyf":"","fygb":2,"gbmc":"西药费","cfts":1,"ycsl":0,"zfpb":0,"zxks":0,"zkbl":null,"zhje":0.00,"ypcd":696,"djybz":0,"yfsb":1,"sfjg":null
      },
      {
        "sortType":null,"ztbh":null,"brid":2012123045,"yjxh":null,"ypzh":null,"djlxText":"西药方:","sbxh":60,"ypxh":348,"ypmc":"ddddd-2",cfhm:"53","kfrq":"2020-07-08 20:11:10","cflx":1,"ksdm":null,"ysdm":null,"djly":6,"yfdw":"瓶",cfsb:53,"yfgg":"3%×100ml","ypdj":14.5000,"ypdjY":14.5000,"ypsl":3.00,"hjje":43.50,"zfbl":1.150,"ypyf":"","fygb":2,"gbmc":"西药费","cfts":1,"ycsl":0,"zfpb":0,"zxks":0,"zkbl":null,"zhje":0.00,"ypcd":696,"djybz":0,"yfsb":1,"sfjg":null
      },
    ]

    // 归类相同的处方识别
    var arrCfsb: any = []
    var newDetails: any = []
    this.djDetails.forEach((i: any)=>{
      this.$set(i, 'rowKey', i.cfsb + '_' + i.sbxh) // 设置key值
      if(!arrCfsb.includes(i.cfsb)){
        arrCfsb.push(i.cfsb)
        let obj = {
          rowKey: i.cfsb,
          djlxText: i.djlxText,
          cfsb: i.cfsb,
          ksdm: i.ksdm,
          ysdm: i.ysdm,
          count: 1,
          children: [i]
        }
        newDetails.push(obj)
      }else{
        let index = newDetails.findIndex((j: any, index: number)=>{
          return j.cfsb == i.cfsb
        })
        newDetails[index].count++
        newDetails[index].children.push(i)
      }
      // console.log(arrCfsb);
    })

    // 设置编号
    let SerialNumber: number = 1
    newDetails.forEach((i: any)=>{
      i.children.forEach((j: any)=>{
        this.$set(j, 'SerialNumber', SerialNumber++)
      })
    })

    this.tableData = newDetails
    this.isLoading = false

    this.calcPrice(this.djDetails)
  }

  // 计算价格
  private calcPrice(data: any){
    console.log('计算价格');
    // 归类相同的处方类型
    var arrCflx: any = []
    data.forEach((item: any)=>{
      switch (item.cflx){
        case 1:
          // this.price.cflx1 += item.hjje
          this.price.cflx1 = (mul(this.price.cflx1, 100) + mul(item.hjje, 100)) / 100
          this.price.cflx1 = getFloat(this.price.cflx1, 2)
          break
        case 2:
          // this.price.cflx2 += item.hjje
          this.price.cflx2 = (mul(this.price.cflx2, 100) + mul(item.hjje, 100)) / 100
          this.price.cflx2 = getFloat(this.price.cflx2, 2)
          break
        case 3:
          // this.price.cflx3 += item.hjje
          this.price.cflx3 = (mul(this.price.cflx3, 100) + mul(item.hjje, 100)) / 100
          this.price.cflx3 = getFloat(this.price.cflx3, 2)
          break
        case 0:
          // this.price.cflx0 += item.hjje
          this.price.cflx0 = (mul(this.price.cflx0, 100) + mul(item.hjje, 100)) / 100
          this.price.cflx0 = getFloat(this.price.cflx0, 2)
          break
      }
      // this.price.amount += item.hjje
      this.price.amount = (mul(this.price.amount, 100) + mul(item.hjje, 100)) / 100
      this.price.amount = getFloat(this.price.amount, 2)
      this.price.zfamount+=item.ypdj*item.ypsl*(item.zkbl ? item.zkbl : 1)*(item.zfbl?item.zfbl:1)
    })
    this.price.zfamount = getFloat(this.price.zfamount, 2)
  }
  
  // 合并行
  private arraySpanMethod({ row, column, rowIndex, columnIndex }: any){
    if(row.count){
      return [1,10]
    }
  }

  // 作废前判断
  private async beforeInvoiceVoid(){
    const res: any = await aQuerySjBrxz({brxz: this.patientInfo.brxz})
    if(res){
      this.patientInfo.isYb = res.data=='6021'?1:0
      if(res.data == '6021'){
        this.dialogVisible2 = true
      }else{
        this.invoiceVoid()
      }
    }
    
    
  }
  // //医保作废
  private invoiceVoidYb(carddata?: any, cardtype?: any){
    let params = {
      fphm: this.fphm1,
      jzlsh: this.patientInfo.jzlsh,
      isYb: 0,
      carddata: carddata,
      cardtype: cardtype
    }
    aUpdateVoidInvoice(params).then((res: any) => {
      if(res.errorCode=='SUCCESS'){
        this.$notify({
          title: '作废成功',
          message: '',
          type: 'success'
        })
        this.dialogVisible = false
        this.$emit('reload')
      }else{
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    })
  }
  // 作废
  private invoiceVoid(carddata?: any, cardtype?: any){
    let params = {
      fphm: this.fphm1,
      jzlsh: this.patientInfo.jzlsh,
      isYb: this.patientInfo.isYb,
      carddata: carddata,
      cardtype: cardtype
    }
    aUpdateVoidInvoice(params).then((res: any) => {
      if(res.errorCode=='SUCCESS'){
        this.$notify({
          title: '作废成功'+`${res.data}`,
          message: '',
          type: 'success'
        })
        this.dialogVisible = false
        this.$emit('reload')
        this.closeDialog2()
      }else{
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    })
  }

  // 取消作废
  private async cancelInvoiceVoid(){
    const res: any = await aQuerySjBrxz({brxz: this.patientInfo.brxz})
    if(res){
      if(res.data == '6021'){
        this.$notify({
          title: '医保患者不能取消作废',
          message: '',
          type: 'warning'
        })
        return false
      }else{
      }
    }

    aUpdateCanceledVoidInvoice({fphm: this.fphm2}).then((res: any) => {
      if(res){
        this.$notify({
          title: '取消作废成功',
          message: '',
          type: 'success'
        })
        this.dialogVisible = false
        this.$emit('reload')
      }
    })
  }

  // 关闭弹窗
  private closeDialog(){
    this.$emit('closed')
  }

  // 读卡
	private readCard(cardtype: any){
    let params = {
      cardtype: cardtype,
      carddata: this.ybCarddata||' '
    }
		aReadMedAcc(params).then((res: any) => {
			if(res){
				this.ybCarddata = res.data.cardid
				// this.isRead = 1
				// this.formData.cardid = res.data.cardid
				// this.formData.cardtype = res.data.cardtype
				// this.formData.accountattr = res.data.accountattr
        // this.getPatientInfo()
        if(this.ybCarddata == this.patientInfo.jzkh){
          this.invoiceVoid(res.data.ecToken, cardtype)
          this.dialogVisible2 = false
        }else{
          this.$notify({
            title: '卡号错误',
            message: '',
            type: 'error'
          })
        }
			}
		})
  }

  // 卡号回车
  private jzkhEnter(){
    if(this.isEcQrcode){
      this.readCard('3')
    }else if(this.ybCarddata.length == 28){
      this.readCard('0')
    }else{
      
    }
  }
  
  // 关闭弹窗
  private closeDialog2(){
    this.isEcQrcode = false
    this.ybCarddata = false
  }
	



  //初始化的周期函数
	created() {
  }
  mounted() {
	}
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper{
	::v-deep .el-dialog__body{
    // padding-bottom: 8px;
    .dialog-body-content{
      padding: 0;
      >*{
        padding: 0 16px;
      }
    }
	}
}
.el-form{
	.el-form-item{
		display: block;
		float: left;
		width: calc((100% - 20px*2)/3);
		margin-left: 20px;
		margin-bottom: 8px!important;
		&:nth-child(3n+1){
			margin-left: 0;
		}
		::v-deep .el-form-item__content{
			width: auto;
			margin-left: 60px!important;
		}
    &[hidden]{
			display: none;
		}
	}
}
.el-divider--horizontal{
  margin: 2px 0 10px 0;
  background-color: $border;
}

.data-head {
  display: inline-block;
  margin: 0 2px;
  span {
    margin: 0 8px;
    font-weight: bold;
    color: $blue!important;
  }
  span:nth-of-type(1) {
    margin-left: 0;
  }
}

.bottom-bar{
  height: 44px;
  margin-bottom: 0;
  border-top: 1px solid $lightGray;
}

.el-table ::v-deep td{
  // border: 1px solid!important;
}

.stamp{
  position: absolute;
  right: 0;
  bottom: 40px;
  .icon{
    font-size: 100px;
    color: #ff7643;
  }
}

.narrow-dialog.read-card{
  ::v-deep .el-dialog__body{
    padding: 20px 0;
  }
  .el-input{
    width: calc(100% - 90px);
  }
  .el-button{
    width: 80px;
    height: 30px;
    margin-left: 10px;
  }
}
</style>
