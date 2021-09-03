<!--
 * @Date: 2020-05-26 13:29:04
 * @LastEditors: dl
 * @LastEditTime: 2021-08-09 16:19:16
 * @description:
-->
<template>
  <div class="ht module">
    <div class="ht">
      <el-row :gutter="10" :style="{ height: listSlotHeight - 129 + 'px'}" v-show="true">
        <el-col class="ht" :span="17">
          <div class="his-module his-small ht">
            <pagenation-list ref="pageTable" v-model="operationData" data-url="/op-service/cisjbzm/queryJbzm" http-method="post" :list-height="listSlotHeight" class="ht" :searchData="searchData" :dataNum="1">
              <div slot="header">
                <div class="row">
                  <div class="label">
                    <div class="querySearch">
                      <div class="title no-warp" style="padding-right: 2px">手术申请单</div>
                    </div>
                    <div class="btn">
                      <el-divider direction="vertical"></el-divider>
                      <!-- 新增 -->
                      <el-button size="mini" type="text">
                        <i class="icon his-btn-add green"></i>
                        {{ $t('common.add') }}
                      </el-button>
                      <!-- 刷新 -->
                      <el-button size="mini" type="text">
                        <i class="icon his-btn-refresh"></i>
                        {{ $t('common.refresh') }}
                      </el-button>

                      <!-- 打印 -->
                      <el-button type="text">
                        <i class="his-btn-print icon"></i>
                        {{ $t('common.print') }}
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
              <el-table :data="operationData" border :fit="true" stripe :highlight-current-row="true" slot="list" @row-click="handleRowClick" :row-class-name="tableRowClassName" class="scroll-bar" :height="listSlotHeight-223" style="width: 100%">
                <el-table-column prop="webSortNumber" width="32"></el-table-column>
                <el-table-column prop="cardno" label="门诊号" :show-overflow-tooltip="true" width="80"></el-table-column>
                <el-table-column width="50px" prop="brxm" label="姓名"></el-table-column>
                <el-table-column width="50px" prop="brxbName" label="性别"></el-table-column>
                <el-table-column width="50px" prop="nl" label="年龄"></el-table-column>
                <el-table-column width="140px" prop="ssrq" label="手术日期"></el-table-column>
                <el-table-column min-width="90" prop="mz" label="麻醉"></el-table-column>
                <el-table-column width="80px" prop="ssmc" label="手术名称"></el-table-column>
                <el-table-column width="150" prop="brzd" :label="'诊断'" ></el-table-column>
                <el-table-column width="80px" prop="jyz" label="手术医师"></el-table-column>
                <el-table-column min-width="100px" prop="clyj" label="处理意见"></el-table-column>
                <el-table-column min-width="100px" prop="bz" label="备注"></el-table-column>
                <el-table-column min-width="80px" prop="ysqm" label="医师签名"></el-table-column>
                <el-table-column min-width="120px" prop="qmsj" label="签名日期"></el-table-column>
                <el-table-column :label="$t('common.action')" width="52" align="center" fixed="right">
                  <template slot-scope="scope">
                    <el-tooltip :content="$t('common.delete')" effect="light">
                      <el-popconfirm :title="'确认删除？'" :confirmButtonText="$t('common.confirm')" :cancelButtonText="$t('common.cancel')" @confirm="handleDelete(scope.row)" hideIcon class="ml10">
                        <el-button slot="reference" class="red">
                          <i class="icon his-del"></i>
                        </el-button>
                      </el-popconfirm>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </pagenation-list>
          </div>
        </el-col>
        <el-col class="ht" :span="7">
          <div class="his-module his-small ht">
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">{{ isCreateNew ? $t('common.add') : $t('common.edit') }}</h1>
              </div>
              <div class="operate">
                <el-button type="primary" size="mini" class="green-gra" icon="icon his-save" v-preventReClick @click="handleSave">{{ $t('common.save') }}</el-button>
              </div>
            </div>
            <el-form ref="formData" :model="formData" label-width="70px" class="form-wrapper scroll-bar">
              <div>
                <el-form-item prop="brzd" label="诊断">
                  <el-input v-model="formData.brzd" placeholder=" " disabled></el-input>
                </el-form-item>
                <el-form-item prop="brzd" label="手术日期">
                  <el-input v-model="formData.brzd" placeholder=" " disabled></el-input>
                </el-form-item>
                <el-form-item prop="brzd" label="麻醉">
                  <el-input v-model="formData.brzd" placeholder=" " disabled></el-input>
                </el-form-item>
                <el-form-item prop="brzd" label="手术名称">
                  <el-input v-model="formData.brzd" placeholder=" " disabled></el-input>
                </el-form-item>
                <el-form-item prop="brzd" label="手术医师">
                  <el-input v-model="formData.brzd" placeholder=" " disabled></el-input>
                </el-form-item>
                <el-form-item prop="brzd" label="处理意见">
                  <el-input v-model="formData.brzd" placeholder=" " disabled></el-input>
                </el-form-item>
                <el-form-item prop="brzd" label="备注">
                  <el-input v-model="formData.brzd" placeholder=" " disabled></el-input>
                </el-form-item>
                <el-form-item prop="brzd" label="医师签名">
                  <el-input v-model="formData.brzd" placeholder=" " disabled></el-input>
                </el-form-item>
                <el-form-item prop="brzd" label="签名日期">
                  <el-input v-model="formData.brzd" placeholder=" " disabled></el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </el-col>
      </el-row>

      <!-- 门诊手术通知单 -->
      <div id="sstzd" style="width: 148mm; font-size: 14px;" v-show="false">
        <div style="width: 100%;position: relative;height: 50px;padding-top: 10px;border-bottom: 1px solid #000; padding-bottom: 10px"> 
          <img id="imgInit1" src="" style="width: 200px; height: 30px; padding-left: 0px;margin-bottom: 15px;" />
          <span style="padding: 0 2px;text-align: center; height: 23px;line-height: 23px;position: absolute;top: 27px; right: 0;">{{"YW-BD-0170-001"}}</span>
        </div>
        <div style="font-size: 24px; text-align: center;margin: 10px 0 20px">{{"门诊手术通知单"}}</div>
        <div style="border: 1px solid #000">
          <div style="display: flex;font-size: 14px; justify-content: center;margin: 15px 0;height: 20px;line-height: 20px">
            <p style="margin: 0">姓名：</p><p style="border-bottom: 1px solid #000; width: 135px;margin: 0;text-align: center"></p>
            <p style="margin: 0 0 0 20px">出生日期：</p><p style="border-bottom: 1px solid #000; width: 145px;margin: 0;text-align: center"></p>
            <p style="margin: 0 0 0 20px">性别：</p><p style="margin: 4px 0 0 0;border-bottom: 1px solid #000;width: 25px; height: 12px;line-height: 12px"></p>
          </div>
          <div style="display:flex; font-size: 14px; justify-content: center;height: 20px;line-height: 20px; margin-bottom: 15px">
            <p style="margin: 0">年龄：</p><p style="border-bottom: 1px solid #000; width: 134px;margin: 0 20px 0 0;text-align: center"></p>
            <p style="margin: 0">门诊号：</p><p style="border-bottom: 1px solid #000; width: 160px;margin: 0 86px 0 0;text-align: center"></p>
          </div>
          <div style="display: flex; font-size: 14px; justify-content: center;height: 20px;line-height: 20px;margin-bottom: 15px">
            <p style="margin: 0">手术日期：</p><p style="margin: 4px 0 0 0;border-bottom: 1px solid #000;width: 151px; height: 12px;line-height: 12px"></p>
            <p style="margin:0 0 0 35px">麻醉：</p><p style="border-bottom: 1px solid #000;width:200px;margin: 0;text-align: center"></p>
          </div>
          <div style="display: flex; font-size: 14px; justify-content: center;margin-bottom: 15px;height: 20px;line-height: 20px;">
            <p style="margin: 0">手术名称：</p><p style="border-bottom: 1px solid #000; width: 429px;margin:0; text-align: center"></p>
          </div>
          <div style="display: flex;font-size: 14px; justify-content: center;margin-bottom: 15px;height: 20px;line-height: 20px;">
            <p style="margin: 0">诊断：</p><p style="border-bottom: 1px solid #000; width: 458px;margin: 0;text-align: center"></p>
          </div>
          <div style="display: flex;font-size: 14px;justify-content: left;margin-bottom: 15px;height: 20px;line-height: 20px;padding-left: 28px">
            <p style="margin: 0">手术医师：</p><p style="border-bottom: 1px solid #000; width: 173px;margin: 0 0 0 28px;text-align: center; margin:0 20px 0 0;"></p>
          </div>
          <div style="display: flex;font-size: 14px;justify-content: left;margin-bottom: 15px;height: 20px;line-height: 20px;padding-left: 28px">
            <p style="margin: 0">处理意见：</p><p style="border-bottom: 1px solid #000; width: 173px;margin: 0;text-align: center; margin:0 28px 0 0;"></p>
          </div>
          <div style="display: flex;font-size: 14px;justify-content: left;margin-bottom: 15px;height: 20px;line-height: 20px;padding-left: 28px">
            <p style="margin: 0">备注：</p><p style="border-bottom: 1px solid #000; width: 201px;margin: 0;text-align: center; margin:0 20px 0 0;"></p>
          </div>
          <div style="display: flex;font-size: 14px;justify-content: left;margin-bottom: 15px;height: 20px;line-height: 20px;padding-left: 28px">
            <p style="margin: 0">医师签名：</p><p style="border-bottom: 1px solid #000; width: 173px;margin: 0;text-align: center; margin:0 20px 0 0;"></p>
          </div>
          <div style="display: flex;font-size: 14px;justify-content: left;margin-bottom: 65px;height: 20px;line-height: 20px;padding-left: 28px;">
            <p style="margin: 0">签名日期：</p><p style="border-bottom: 1px solid #000; width: 35px;margin: 0;text-align: center; margin:0 5px 0 0;">{{'2021'}}</p><p>年</p><p style="border-bottom: 1px solid #000; width: 35px;margin: 0;text-align: center; margin:0 5px 0 0;">08</p><p>月</p><p style="border-bottom: 1px solid #000; width: 35px;margin: 0;text-align: center; margin:0 5px 0 0;">06</p><p>日</p><p style="border-bottom: 1px solid #000; width: 35px;margin: 0;text-align: center; margin:0 5px 0 0;">15</p><p>时</p><p style="border-bottom: 1px solid #000; width: 35px;margin: 0;text-align: center; margin:0 5px 0 0;">58</p><p>分</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { handleSave } from '@/api/cis/op/dctwork/operation'
import { saveCheck, queryDetails, saveApproval, queryHaveDoctor, queryCheckDoctor,queryProfessional,queryLogo} from '@/api/cis/op/dctwork/operationApplication'
import { getNow } from '@/api/his/basic'
import { parseTime, formatDate} from '@/utils'
import { Form } from 'element-ui'
import { log } from 'util'

@Component({
  name: 'Operation',
  filters: {},
})
export default class extends Vue {
  @Prop({ required: true }) private patientData!: any
  // @Prop({ required: true }) private patientFile!: any
  @Prop({ required: true }) private zdmc!: string
  private pnParam: any = {}
  created() {
  console.log(this.patientData,'?????数据');

    this.listSlotHeight = Vue.prototype.PageHeight
    this.ruleForm.brxm = this.patientData.brxm
    this.ruleForm.brxb = this.patientData.brxb
    this.ruleForm.mzhm = this.patientData.mzhm
    this.ruleForm.brnl = this.patientData.nl
    this.ruleForm.sqzd = this.zdmc
    this.ruleForm.sszt = "申请"
    // this.ruleForm.nxssks = Vue.prototype.AUTHORITY.kslb
    this.ruleForm.nxssks = this.patientData.mzks
    this.ruleForm.ywbz = 1
    this.yyksList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.OPERATION_KSDICT :this.$store.state.webSqlDict.OPERATION_KSDICT
  }
  private formData: any = {}
  private isCreateNew: boolean = false
  private leftCol: number = 23
  private rightCol: number = 1
  private activeName: string = 'gr'
  private operationData: any[] = []
  private searchData: any = {}
  private closeRight: boolean = true
  private ssxx: any = {}
  private rightDataList: any[] = []
  private rightUrl: string = '/op-service/optssfl/userInfo'
  private key: number = 0
  private listSlotHeight: number = 0
  private dialogVisible: boolean = false
  private currentData: any = {}
  private majorVisible: boolean = false
  private majorForm: any = {}
  private ssysList: Array<[]> = [] //手术医师列表
  private sjysList: Array<[]> = [] //上级医师列表
  private yyksList: Array<[]> = []
  private sqysList: Array<[]> = [] //解决申请医生手术保存不显示问题(查询所有医生数据)
  private ssyzList: Array<any> = [] //手术助手医生列表
  private ysgh: number | string = ''
  private loGo: any = {} // 医院logo
  private resultHeaderUser = [
    {
      prop: 'personId',
      label: '医生编号',
    },
    {
      prop: 'personName',
      label: '姓名',
    },
  ]
  private majorSurgery: any = {
    sqlx: '',
    sqks: Vue.prototype.AUTHORITY.outpatientCode,
    sqrq: '',
    sqzd: '',
    ssrq: '',
    ssjb: '',
    mzdm: '',
    ssmc: '',
    bszy: '',
    hgjcs: '',
    hzzq: '',
    ssys: '',
    szzc: '',
    ssyz: '',
    ssez: '',
    ezzc: '',
    yzzc: '',
    sssz: '',
    szzcz: '',
    sszs: '',
    zszc: '',
    sjyj: '',
    sjys: '',
  }
  mounted() {
    this.pnParam = this.$store.state.pnParam.PN_PARAM
    this.sqysList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT :this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    getNow().then((res: any) => {
			this.ruleForm.sqrq = parseTime(res.data, '{y}-{m}-{d} {h}:{i}:{s}')
		})
    this.$set(this.ruleForm,'sqys',this.userInfo.userId.toString())
    this.queryPrintLogo()
  }

  

  get userInfo () {
    return JSON.parse(localStorage.userInfo)
  }

  // 表格行点击事件
  private handleRowClick() {

  }

  private ruleForm: any = {
    ywbz: '',
    sqys: '',
    sqrq: '',
  }

  private rules: any = {
    ssmc: { required: true, message: '请输入手术名称', trigger: ['change','blur']},
    ssys: { required: true, message: '请选择手术医师', trigger: 'change'},
    mzmc: { required: true, message: '请输入麻醉方法', trigger: 'change'},
    ssrq: { required: true, message: '请输入手术时间', trigger: 'blur'},
    ssks: { required: true, message: '请选择手术室', trigger: 'change'},
    nxssks: { required: true, message: '拟行手术科室', trigger: 'change'},
    sjys: { required: true, message: '请选择审批医生', trigger: 'change'},
    ywbz: { required: true, message: '请选择', trigger: 'blur'},
    // primaryDiagnosis: { required: true, message: '请输入手术医师', trigger: 'blur' },
  }

  private pickerOptions: any = {
    disabledDate(time: any) {
      return time.getTime() < Date.now() - 3600 * 24 * 1000
    },
  }
  private value: string = ''
  private value1: string = ''
  private options: any[] = []

  // 为表格添加index序号
  private tableRowClassName({ row, rowIndex }: any) {
    row.index = rowIndex
  }

  // 获取医院打印的logo
  private queryPrintLogo() {
    queryLogo(this.userInfo.hospitalId).then((res: any) => {
      this.loGo = res.data
      let a: any = document.getElementById("imgInit1")
      a.src = this.loGo
    })
  }

  //保存手术申请单
  private async handleSave() {
    let nowTime: string | null = ''
    await getNow().then((res: any) => {
      nowTime = parseTime(res.data, '{y}-{m}-{d} {h}:{i}:{s}')
    })
    ;(this.$refs.ruleForm as Form).validate((valid: boolean) => {
      if (valid) {
        saveCheck({ssnm: this.ruleForm.ssnm}).then((res: any) => {
          // 特殊手术
          if (this.ruleForm.tsss !== '' && this.ruleForm.tsss !== undefined && this.ruleForm.tsss !== null) {
            this.currentData = Object.assign({}, this.ruleForm)
            this.currentData.sqks = Vue.prototype.AUTHORITY.outpatientCode.toString()
            this.currentData.brbq = this.patientData.brbq
            this.currentData.brch = this.patientData.brch
            this.currentData.brks = this.patientData.ksdm
            this.currentData.csny = this.patientData.csny
            this.currentData.ryrq = this.patientData.ryrq
            this.currentData.zyh = this.patientData.zyh
            this.currentData.zyhm = this.patientData.zyhm
            this.currentData.brid = this.patientData.brid,
            this.currentData.jgid = this.patientData.jgid,
            this.currentData.ylxh = this.ssxx.ssnm || this.ssxx.fyxh,
            this.currentData.sqlx = 1
            this.currentData.czgh = JSON.parse(localStorage.userInfo).userId,
            this.currentData.zdssbz = 1
            this.currentData.mzdm = this.ruleForm.mzmc
            this.currentData.jzkh = this.patientData.jzkh,//新加
            // this.currentData.jzxh = this.patientData.jzxh,//新加
            this.currentData.ssyz = this.majorForm.ssyz
            this.currentData.ssez = this.majorForm.ssez
            this.currentData.sssz = this.majorForm.sssz
            this.currentData.sszs = this.majorForm.sszs
            this.currentData.mzys = this.majorForm.mzys
            this.currentData.ssys = this.ruleForm.ssys.toString()
            this.currentData.jzlsh = this.pnParam.jzlsh
            queryProfessional({ysgh: this.ruleForm.ssys}).then((res: any) => {
              this.$set(this.currentData,'szzc',res.data)
            })
            this.dialogVisible = true
          } else if (res.data == 1) { // 重大手术
            this.majorSurgery = Object.assign(this.majorSurgery, this.ruleForm)
            console.log(1254,this.ruleForm)
            console.log(1255,this.majorForm)
            this.majorSurgery.sqks = Vue.prototype.AUTHORITY.outpatientCode,
            this.majorSurgery.brbq = this.patientData.brbq ? this.patientData.brbq : ''
            this.majorSurgery.brch = this.patientData.brch ? this.patientData.brch : ''
            this.majorSurgery.brks = Vue.prototype.AUTHORITY.outpatientCode,
            this.majorSurgery.csny = this.patientData.csny ? this.patientData.csny : ''
            this.majorSurgery.ryrq = this.patientData.ryrq ? this.patientData.ryrq : ''
            this.majorSurgery.zyh = this.patientData.zyh ? this.patientData.zyh : ''
            this.majorSurgery.zyhm = this.patientData.zyhm ? this.patientData.zyhm : ''
            this.majorSurgery.brid = this.patientData.brid ? this.patientData.brid : ''
            this.majorSurgery.jgid = this.patientData.jgid ? this.patientData.jgid : ''
            this.majorSurgery.ylxh = this.ssxx.ssnm || this.ssxx.fyxh
            this.majorSurgery.sqlx = 1
            this.majorSurgery.czgh = JSON.parse(localStorage.userInfo).userId
            this.majorSurgery.zdssbz = 1
            this.majorSurgery.mzdm = this.ruleForm.mzmc
            this.majorSurgery.jzkh = this.patientData.jzkh ? this.patientData.jzkh : '' //新加
            this.majorSurgery.mzys = this.majorForm.mzys
            this.majorSurgery.ssyz = this.majorForm.ssyz
            this.majorSurgery.ssez = this.majorForm.ssez
            this.majorSurgery.sssz = this.majorForm.sssz
            this.majorSurgery.sszs = this.majorForm.sszs
            this.majorSurgery.ssys = this.majorSurgery.ssys.toString()
            this.majorSurgery.jzlsh = this.pnParam.jzlsh
            queryProfessional({ysgh: this.ruleForm.ssys}).then((res: any) => {
              this.$set(this.majorSurgery,'szzc',res.data)
            })
            this.majorVisible = true
          }
          else {
          this.ruleForm.sqks = Vue.prototype.AUTHORITY.bussinessRole
          this.ruleForm.brbq = this.patientData.brbq
          this.ruleForm.brch = this.patientData.brch
          this.ruleForm.brks = this.patientData.ksdm
          this.ruleForm.csny = this.patientData.csny
          this.ruleForm.ryrq = this.patientData.ryrq
          this.ruleForm.zyh = this.patientData.zyh
          this.ruleForm.zyhm = this.patientData.zyhm
          this.ruleForm.brid = this.patientData.brid,
          this.ruleForm.jgid = this.patientData.jgid,
          this.ruleForm.ylxh = this.ssxx.ssnm || this.ssxx.fyxh,
          this.ruleForm.sqlx = 1
          this.ruleForm.czgh = JSON.parse(localStorage.userInfo).userId,
          this.ruleForm.zdssbz = res.data
          this.ruleForm.mzdm = this.ruleForm.mzmc,
          this.ruleForm.jzkh = this.patientData.jzkh,//新加
          this.ruleForm.jzxh = this.patientData.jzxh,//新加
          this.ruleForm.jzlsh = this.pnParam.jzlsh
          console.log(this.ruleForm, "最终的表单",this.ruleForm.zdssbz,this.ruleForm.mzdm,this.ruleForm.sqks);

          saveApproval(this.ruleForm).then((res: any) => {
              this.$notify({
                title: "普通手术保存成功",
                message: '',
                type: 'success'
              })
              this.clearForm()
            })
          }
        })
      }
    })
  }


  private getData(data: any) {
    this.ssxx = data
    this.ruleForm.fymc = data.ssmc
    this.ruleForm.fyxh = data.fyxh
    this.ruleForm.ssnm = data.ssnm //新加
    this.ruleForm.ssmc = data.fymc //新加
    this.ruleForm.ssjb = data.ssdj //新加
    this.key++
    this.queryHave()
    this.queryCheck()
  }

    // 查询拥有手术等级权限的医生
  private queryHave () {
    console.log(this.ssxx.ssdj,"查询拥有手术等级");
    queryHaveDoctor({ssdj: this.ssxx.ssdj}).then((res: any) => {
      this.ssysList = res.data
    })
  }

  // 查询拥有手术审核权限的医生
  private queryCheck () {
    console.log(this.ssxx.ssdj,"查询拥有审核手术等级");
    queryCheckDoctor({ssdj: this.ssxx.ssdj}).then((res: any) => {
      this.sjysList = res.data
    })
  }

  private tableGetData(data: any) {
    this.ssxx = data
    console.log(data, 'data')
    if (this.activeName != 'qy') {
      if(data.zfpb == '1') {
        this.$message({
          message:  '此手术已作废',
          type: 'warning'
        })
      } else {
        this.ruleForm.ssmc = data.ssmc
        this.ruleForm.fyxh = data.ssnm
        this.ruleForm.ssjb = data.ssdj
        this.ruleForm.ssnm = data.ssnm
        this.ruleForm.fymc = data.ssmc
      }

    } else {
      if(data.zfpb == '1') {
        this.$message({
          message:  '此手术已作废',
          type: 'warning'
        })
      } else{
        this.ruleForm.ssmc = data.ssmc
        this.ruleForm.fyxh = data.ssnm
        this.ruleForm.ssjb = data.ssdj
        this.ruleForm.ssnm = data.ssnm
        this.ruleForm.fymc = data.ssmc
      }

    }


    this.key++
  }
  // 解决值变不刷新问题
  private ssjbUpdate () {
    this.$forceUpdate()
  }
    // 清除
  private clearForm () {
    this.$nextTick(() => {
      if(this.$refs.ruleForm !== undefined){
        (this.$refs.ruleForm as Form).resetFields()
      }
    })
    this.ruleForm.fyxh = ''
    this.ruleForm.ssnm = ''
    this.ruleForm.ywbz = 1
    this.currentData.sqjg = ''
    this.currentData.hzzq = ''
    this.majorForm.bszy = ''
    this.majorForm.hgjcs = ''
    this.majorForm.hzzq = ''
    this.ruleForm.mzdm = ''
    this.ruleForm.ylxh = ''
    getNow().then((res: any) => {
			let currentTime = parseTime(res.data, '{y}-{m}-{d} {h}:{i}:{s}')
      this.$set(this.ruleForm,'sqrq',currentTime)
      // this.ruleForm.sqrq = parseTime(res.data, '{y}-{m}-{d} {h}:{i}:{s}')
    })
    this.ruleForm.brxm = this.patientData.brxm
    this.ruleForm.brxb = this.patientData.brxb
    this.ruleForm.mzhm = this.patientData.mzhm
    this.ruleForm.brnl = this.patientData.nl
    this.ruleForm.sqzd = this.zdmc
    this.ruleForm.sszt = "申请"
    this.ruleForm.nxssks = this.patientData.mzks
    this.ruleForm.ywbz = 1
    // this.ruleForm.sqys = JSON.parse(localStorage.getItem('userInfo') as string).userId
    this.$set(this.ruleForm, 'sqys', this.userInfo.userId.toString())
  }

  // 失焦关闭下拉
  private selectBlurUser(ref: string) {
    ;(this.$refs[ref] as any).selectBlur()
  }

  // 组件的查询方法（远程搜索）
  private remoteMethodUser(query: string, ref: string) {
    if (query.length > 1) {
      this.$nextTick(() => {
        ;(this.$refs[ref] as any).remoteMethod(query)
      })
    } else {
      ;(this.$refs[ref] as any).closePopover()
    }
  }

  // 清空手术名称的联动
  private clearSsmc() {
    this.ruleForm.ssys = ''
    this.ruleForm.ssjb = ''
  }

}
</script>
<style lang="scss" scoped>
.his-proof {
  padding: 0 !important;
  .his-small {
    padding-top: 4px;
    .row {
      padding-bottom: 4px;
      .no-warp {
        margin-top: 2px;
        font-family: siyuanMedium;
      }
      .btn .el-button {
        padding: 4px 5px;
      }
    }
  }
}
.content .his-module .el-form {
  margin: 0px 0px;
  padding: 0 30px;
}

.form-wrapper {
  height: calc(100% - 45px);
}

.area-title {
  margin-bottom: 10px;
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
.form-area1 {
  // border: 1px solid #ccc;
  .el-form-item {
    margin-left: 16px;
    &:nth-child(odd) {
      margin-left: 0;
    }
  }
}
.form-area2 {
  .area-item {
    float: left;
    width: calc((100% - 16px) / 2);
    margin-left: 8px;
    &:nth-child(odd) {
      margin-left: 0;
    }
    .item-date {
      float: left;
      width: 70%;
    }
    .item-ampm {
      float: left;
      width: calc(30% - 8px);
      margin-left: 4px;
    }
  }
}
.search-select {
  width: 100%;
  margin-right: 0;
}

.item-remark {
  margin-bottom: 0 !important;
  ::v-deep .el-textarea__inner {
    padding: 5px 10px;
  }
}
.statement-box {
  width: 700px;
  // padding: 0 4rem;
}
.radioOther {
  width: 85%;
}
.el-textarea {
  position: absolute;
  top: 40px;
  right: -40;
}
::v-deep .el-textarea__inner {
  width: 87%;
  border: none;
}
.his-advice {
  position: relative;
}
</style>
