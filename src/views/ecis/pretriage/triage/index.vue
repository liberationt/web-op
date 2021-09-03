// 急诊预检分诊
<template>
	<div class="content">
		<div class="his-module his-small his-triage">
			<el-form :model="forms" ref="formValidate" :rules="rules" label-width="80px" :style="{width: '98% !important',padding: '0'}">
				<div class="label">
					<div style="font-size: 16px;">病人基本信息</div>
					<el-divider direction="vertical"></el-divider>
					<div class="btn">
						<el-button size="mini" type="text" @click="saveTriage">
							<i class="icon his-btn-save blue"></i>
							<span>{{ $t('common.save') }}</span>
						</el-button>
					</div>
				</div>
				<el-divider direction="horizontal"></el-divider>
				<div class="form-all">
					<div class="form-area">
						<el-form-item :label="'就诊卡号'" class="item-card" prop="kh">
							<el-input v-model="forms.kh" :placeholder="'请输入卡号'" @keyup.enter.native="getPatientInfo(forms.kh)" ref="inputJzkh"></el-input>
						</el-form-item>
						<el-button type="primary" class="his-patient-btn ml10" icon="icon his-reading-card">读卡</el-button>
					</div>
					<div class="form-area">
						<el-form-item :label="'姓名'" class="item-card" prop="xm">
							<el-input v-model="forms.xm" :placeholder="'请输入内容'" ref="inputJzkh"></el-input>
						</el-form-item>
					</div>
					<div class="form-area">
						<el-form-item :label="'证件类型'" class="item-card" prop="zjlx">
							<el-select v-model="forms.zjlx" placeholder="请选择">
								<el-option v-for="(item,index) in idList" :key="index" :value="item.dv" :label="item.dn"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="form-area">
						<el-form-item :label="'证件号码'" class="item-card" prop="zjhm">
							<el-input v-model="forms.zjhm" :placeholder="'请输入内容'" ref="inputJzkh"></el-input>
						</el-form-item>
					</div>
				</div>
				<div class="form-all">
					<div class="form-area">
						<el-form-item :label="'性别'" class="item-card" prop="xb">
							<el-select v-model="forms.xb" placeholder="请选择">
								<el-option v-for="(item,index) in xbList" :key="index" :value="item.dv" :label="item.dn"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="form-area">
						<el-form-item :label="'年龄'" class="item-card" prop="nl">
							<el-input v-model="forms.nl" :placeholder="'请输入'" ref="inputJzkh">
								<i slot="suffix">岁</i>
							</el-input>
						</el-form-item>
					</div>
					<div class="form-area">
						<el-form-item :label="'联系电话'" class="item-card" prop="lxfs">
							<el-input v-model="forms.lxfs" :placeholder="'请输入内容'" ref="inputJzkh"></el-input>
						</el-form-item>
					</div>
          <div class="form-area">
						<el-form-item :label="'出生日期'" class="item-card" prop="csny">
              <el-date-picker
              v-model="forms.csny"
              type="date"
              placeholder="请选择日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"></el-date-picker>
						</el-form-item>
					</div>
				</div>
				<div class="form-all">
					<div class="form-area">
						<el-form-item :label="'现住址'" class="item-card" prop="jzkh">
							<cascade-address :backfillObj="backfillObj" v-model="addressValue" :key="cascadeIndex"/>
						</el-form-item>
					</div>
					<div class="form-area"></div>
					<div class="form-area">
						<el-form-item :label="'详细地址'" prop="xxzz" class="item-address">
							<el-input v-model="forms.xxzz" :placeholder="'请输入详细地址'"></el-input>
						</el-form-item>
					</div>
				</div>
				<div class="label">
          <span style="font-size: 16px">病人体征信息</span>
          <el-divider direction="vertical"></el-divider>
          <el-checkbox v-model="dpybz" @change="checkDpy">代配药</el-checkbox>
        </div>
				<el-divider direction="horizontal"></el-divider>
				<div class="form-all">
					<div class="form-area">
						<el-form-item :label="'来院方式'" prop="lyfs" class="item-address">
							<el-select v-model="forms.lyfs" :placeholder="'请选择'">
								<el-option v-for="(item,index) in tohospital" :key="index" :value="item.dv" :label="item.dn"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="form-area">
						<el-form-item :label="'来诊时间'" prop="lzsj" class="item-address">
							<el-date-picker v-model="forms.lzsj" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期" class="form-input" @change="getTlsj"></el-date-picker>
						</el-form-item>
					</div>
					<div class="form-area logMgCls">
						<el-form-item :label="'主诉'" prop="zsList" class="item-address">
							<el-select
              v-model="forms.zsList"
              :placeholder="'请选择'"
              filterable multiple clearable collapse-tags
              :loading="loading" @change="zsChange"
              class="demo-select'"
              >
								<el-option v-for="(item,index) in zsmsList" :key="index" :value="item.zsmsid" :label="item.zsms"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="form-area">
						<el-form-item :label="'体温'" prop="tw" class="item-address">
							<el-input v-model="forms.tw" :placeholder="'请输入内容'"></el-input>
              <!-- <el-input-number v-model="forms.tw" :precision="1" :controls='false' :placeholder="'请输入内容'" ref="inputJzkh"></el-input-number> -->
						</el-form-item>
					</div>
				</div>
				<div class="form-all">
					<div class="form-area">
						<el-form-item :label="'脉搏'" prop="xl" class="item-address">
              <el-input v-model="forms.xl" :placeholder="'请输入内容'"></el-input>
							<!-- <el-input-number v-model="forms.xl" :precision="1" :controls='false' :placeholder="'请输入内容'" ref="inputJzkh"></el-input-number> -->
						</el-form-item>
					</div>
					<div class="form-area">
						<el-form-item :label="'呼吸'" prop="hx" class="item-address">
              <el-input v-model="forms.hx" :placeholder="'请输入内容'"></el-input>
							<!-- <el-input-number v-model="forms.hx" :precision="1" :controls='false' :placeholder="'请输入内容'" ref="inputJzkh"></el-input-number> -->
						</el-form-item>
					</div>
					<div class="form-area">
						<el-form-item :label="'血压'" prop="xyszy">
							<div class="area-inline">
								<el-input v-model.number="forms.xyszy" :placeholder="'请输入内容'" ref="inputJzkh"></el-input>
								/
								<el-input v-model.number="forms.xyssy" :placeholder="'请输入内容'" ref="inputJzkh"></el-input>
							</div>
						</el-form-item>
					</div>
					<div class="form-area form-special">
						<el-form-item :label="'血氧饱和度'" prop="xybhd" class="item-card item-special">
							<el-input class="item-input" v-model="forms.xybhd" :placeholder="'请输入内容'" ref="inputJzkh"></el-input>
						</el-form-item>
						<el-button type="primary" class="his-patient-btn his-special-btn">从设备读取</el-button>
					</div>
				</div>
				<div class="form-all">
					<div class="form-area">
						<el-form-item :label="'意识状态'" prop="yszt" class="item-address">
							<el-select v-model="forms.yszt" :placeholder="'请选择'">
								<el-option v-for="(item,index) in realizeList" :key="index" :value="item.dv" :label="item.dn"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="form-area">
						<el-form-item :label="'MEWS评分'" class="item-card" prop="sewspf">
							<el-input v-model="forms.sewspf" disabled :placeholder="'请输入'" ref="inputJzkh"></el-input>
						</el-form-item>
						<el-button type="primary" class="his-patient-btn ml10" icon="icon" @click="openSews">评分</el-button>
					</div>
					<div class="form-area">
						<el-form-item :label="'疼痛评分'" class="item-card" prop="ttpf">
							<el-input v-model="forms.ttpf" disabled :placeholder="'请输入'" ref="inputJzkh"></el-input>
						</el-form-item>
						<el-button type="primary" class="his-patient-btn ml10" icon="icon" @click="openHurts">评分</el-button>
					</div>
					<div class="form-area">
						<el-form-item :label="'系统评级'" prop="xtpj" class="item-address">
							<!-- <el-input v-model="forms.xtpj" :placeholder="'请输入内容'" disabled ref="inputJzkh" @change="setBrpj"></el-input> -->
              <search-select table-name="SYS_PRIMARY_DATA" kid="PD0000000742" disabled v-model="forms.xtpj" :backfillValue="forms.xtpj" :placeholder="'请选择'" />
						</el-form-item>
					</div>
				</div>
				<div class="label">病人就诊信息</div>
				<el-divider direction="horizontal"></el-divider>
				<div class="form-all">
					<div class="form-area">
						<el-form-item :label="'病人分级'" prop="brpj" class="item-address">
              <search-select table-name="SYS_PRIMARY_DATA" kid="PD0000000742" v-model="forms.brpj" :backfillValue="forms.brpj" :placeholder="'请选择'" />
						</el-form-item>
					</div>
					<div class="form-area">
						<el-form-item :label="'分诊科室'" prop="fzksdm" class="item-address">
							<!-- <search-select table-name="SYS_DICT_CONFIG" kid="13" v-model="forms.fzksdm" :backfillValue="forms.fzksdm" :placeholder="'请选择'" @change="getYsList"/> -->
						<el-select v-model="forms.fzksdm" @change="getYsList">
							<el-option v-for="(item,index) in fzksdmList" :key="index" :value="item.ksdm" :label="item.ksmc"></el-option>
						</el-select>
            </el-form-item>
					</div>
					<div class="form-area">
						<el-form-item :label="'医生'" prop="ysdm" class="item-address">
							<el-select v-model="forms.ysdm">
								<el-option v-for="(item,index) in ysList" :key="index" :value="item.ysdm" :label="item.personname"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="form-area">
						<el-form-item :label="'分诊护士'" prop="fzhs" class="item-address">
							<el-input v-model="forms.fzhs" disabled :placeholder="'请输入内容'" ref="inputJzkh"></el-input>
						</el-form-item>
					</div>
				</div>
				<div class="form-all">
					<div class="form-area">
						<el-form-item :label="'去向'" prop="qx" class="item-address">
							<el-select v-model="forms.qx" :placeholder="'请选择'">
								<el-option v-for="(item,index) in toWhereList" :key="index" :value="item.dv" :label="item.dn"></el-option>
							</el-select>
						</el-form-item>
					</div>
          <div class="form-area">
						<el-form-item :label="'离开时间'" prop="lksj" class="item-address">
							<el-date-picker v-model="forms.lksj" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" class="form-input " @change="getTlsj"></el-date-picker>
						</el-form-item>
					</div>
					<div class="form-area">
						<el-form-item :label="'停留时间(分)'" prop="tlsj" class="item-address">
							<el-input v-model="forms.tlsj" :placeholder="'请输入内容'" ref="inputJzkh" disabled></el-input>
						</el-form-item>
					</div>
					<div class="form-area">
						<el-form-item :label="'分诊时间'" prop="fzsj" class="item-address">
							<!-- <el-input v-model="forms.fzsj" :placeholder="'请输入内容'" ref="inputJzkh"></el-input> -->
              <el-date-picker v-model="forms.fzsj" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期" class="form-input"></el-date-picker>
						</el-form-item>
					</div>
				</div>
			</el-form>
		</div>

		<el-dialog title="早期预警MEWS评分表" :visible.sync="dialogVisible" width="50%" :before-close="handleClose" destroy-on-close>
			<sewsLevel :forms="forms" v-if="dialogVisible" @getSummary="getSummary" @getMewsClass="getMewsClass" />
		</el-dialog>
		<hurtLevel ref="hurtLevel"  v-model="forms.ttpf" @refreshTtpf="refreshTtpf" />

	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { getFloat, mul, parseTime } from '@/utils'
import { aQueryCard } from '@/api/his/op/reg/addPatient'
import { aQueryDeptSchDoc } from '@/api/his/op/reg/registerManage'
import { aDeptDocListjz, DepartmentList } from '@/api/his/op/reg/docSchedule'
import { queryList, addTriage } from '@/api/ecis/pretriage/basic'
import { getNow } from '@/api/his/basic'
import sewsLevel from './components/sewsLevel.vue'
import hurtLevel from './components/hurtLevel.vue'
import { AxiosResponse } from 'axios'
import { Form } from 'element-ui'
import { regPosInt} from '@/utils/validate'
//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'Triage',
  components: { sewsLevel, hurtLevel },
  filters: {}
})
export default class extends Vue {
  private forms: any = {
    csny: '',
      xm: '',
      zjlx: '',
      zjhm: '',
      xb: '',
      nl: '',
      lxfs: '',
      xxzz: '',
      lyfs: '',
      ysdm: '',
    }
  private rules: any = {
    xm: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    xb: [{ required: true, message: '请选择性别', trigger: 'change' }],
    lyfs: [{ required: true, message: '请选择来院方式', trigger: 'change' }],
    lzsj: [{ required: true, message: '请选择来诊时间', trigger: 'change' }],
    zsList: [{ required: true, message: '请选择主诉', trigger: 'blur' }],
    tw: [
      { required: true, message: '请输入体温', trigger: 'blur' },
      { pattern: regPosInt, message: '请输入整数', trigger: 'blur'}
    ],
    xl: [
      { required: true, message: '请输入脉搏', trigger: 'blur' },
      { pattern: regPosInt, message: '请输入整数', trigger: 'blur'}
    ],
    hx: [
      { required: true, message: '请输入呼吸', trigger: 'blur' },
      { pattern: regPosInt, message: '请输入整数', trigger: 'blur'}
    ],
    xyszy: [
      { required: true, message: '请输入血压', trigger: 'blur' },
      { pattern: regPosInt, message: '请输入整数', trigger: 'blur'}
    ],
    xybhd: [
      { required: true, message: '请输入血样饱和度', trigger: 'blur' },
      { pattern: regPosInt, message: '请输入整数', trigger: 'blur'}
    ],
    yszt: [{ required: true, message: '请输入意识状态', trigger: 'blur' }],
    sewspf: [{ required: true, message: '请输入mews评分', trigger: 'change' }],
    ttpf: [{ required: true, message: '请输入疼痛评分', trigger: 'change' }],
    brpj: [{ required: true, message: '请选择病人分级', trigger: 'blur' }],
    fzksdm: [{ required: true, message: '请选择分诊科室', trigger: 'blur' }]


  }
  private dpybz: boolean = false // 代配药标志
  private idList: any = [] //证件类别
  private xbList: any = [] //性别
  private tohospital: any = [] //来院方式
  private realizeList: any = [] //意识状态
  private patientLevel: any = [] // 病人分级
  private toWhereList: any = [] // 病人去向
  private zsmsList: any = [] // 主诉描述列表
  private ysList: any[] = [] // 医生列表
  private date: any = ''
  private dialogVisible: boolean = false
  private dialogVisibleN: boolean = false
  private loading: boolean = false
  private mewsClass: any = '' //sews评分
  private ttpfClass: any = '' // 疼痛评分
  // private zsClassOne: Array<[]> = []
  private zsClassOne: any = ''
  private zsClass: any = '' // 主诉
  // private xtpjList: Array<[]> = []
  private xtpjList: any = ''
  private zsmsOne: Array<[]> = []
  private fzksdmList: Array<[]> = []
  private getPatientInfo(value: any) {
    if (value == '' || value == null) {
      return false
    }
    aQueryCard({ jzkh: value }).then((res: any) => {
      // console.log(res.data);

      if (res) {
        if (res.data != null) {
          for (let i in this.forms) {
            let cc:any = {}
            if (i == 'kh')
              cc = {
                kh: res.data['jzkh'],
                xm: res.data['brxm'],
                zjlx: res.data['zjlx'],
                zjhm: res.data['sfzh'],
                xb: res.data['brxb'].toString(),
                nl: res.data['age'],
                lxfs: res.data['brdh'],
                csny: res.data['csny'],
                xzzsf: res.data['xzzSqs'],
                xzzs: res.data['xzzS'],
                xzzx: res.data['xzzX'],
                xxzz: res.data['xzzQtdz'],
                lzsj: this.date,
                fzhsdm: JSON.parse(localStorage.getItem('userInfo') as any).userId,
                fzhs: JSON.parse(localStorage.getItem('userInfo') as any).username
              }

            this.forms = Object.assign(this.forms,cc)

          }
          this.showAddressValue()
        } else {
          this.forms = {
            lzsj: this.date
          }
          this.$set(this.forms, 'kh', value)
        }
      }
    })
  }
  @Watch ('forms.csny')
    private onDateChange(val: any) {
        if (val) {
          this.forms.csny = val.split(' ')[0]
        } else {
          this.forms.csny = ''
        }
      }

  private showAddressValue() {
    // this.addressValue = ''
    this.backfillObj.provinceId = this.forms.xzzsf
    this.backfillObj.cityId = this.forms.xzzs
    this.backfillObj.areaId = this.forms.xzzx
    this.cascadeIndex++
  }

  private backfillObj: any = {
    // 初始化省市区
    provinceId: 310000,
    cityId: 310100,
    areaId: 0
  }
  private cascadeIndex: number = 1
  private addressValue: string = '' // 省市区id，字符串

  mounted() {
    this.idList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.IDCARD_DICT :this.$store.state.webSqlDict.IDCARD_DICT
    this.xbList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT :this.$store.state.webSqlDict.SEX_DICT
    this.tohospital = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TO_HOS_TYPE_DICT :this.$store.state.webSqlDict.TO_HOS_TYPE_DICT
    this.realizeList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REALIZE_TYPE_DICT :this.$store.state.webSqlDict.REALIZE_TYPE_DICT
    this.patientLevel = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.PATIENT_TYPE_DICT :this.$store.state.webSqlDict.PATIENT_TYPE_DICT
    this.toWhereList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TOWHERE_TYPE_DICT :this.$store.state.webSqlDict.TOWHERE_TYPE_DICT
    this.fzksdmList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REGISTERATION_DEPARTMENT_DICT :this.$store.state.webSqlDict.REGISTERATION_DEPARTMENT_DICT
    this.forms.fzhs = JSON.parse(localStorage.getItem('userInfo') as any).name
    this.forms.fzhsdm = JSON.parse(localStorage.getItem('userInfo') as any).userId
    getNow().then((res: any) => {
      if (res.data) {
        this.date = parseTime(res.data)
        this.$set(this.forms, 'lzsj', this.date)
      }
    })
    this.getFzsj()
    this.getZsmsList()
    this.getDepartmentList()
  }

  // 代配药
  private checkDpy(result: any) {
    console.log(411,result)
    if(!result) {
      this.rules.lyfs.push({ required: true, message: '请选择来院方式', trigger: 'change' }) 
      this.rules.lzsj.push({ required: true, message: '请选择来诊时间', trigger: 'change' })
      this.rules.zsList.push({ required: true, message: '请选择主诉', trigger: 'blur' })
      this.rules.tw.push({ required: true, message: '请输入体温', trigger: 'blur' }) 
      this.rules.xl.push({ required: true, message: '请输入脉搏', trigger: 'blur' })
      this.rules.hx.push({ required: true, message: '请输入呼吸', trigger: 'blur' })
      this.rules.xyszy.push({ required: true, message: '请输入血压', trigger: 'blur' })
      this.rules.xybhd.push({ required: true, message: '请输入血样饱和度', trigger: 'blur' })
      this.rules.yszt.push({ required: true, message: '请输入意识状态', trigger: 'blur' })
      this.rules.sewspf.push({ required: true, message: '请输入mews评分', trigger: 'change' })
      this.rules.ttpf.push({ required: true, message: '请输入疼痛评分', trigger: 'change' })
    } else {
      this.rules.lyfs = []
      this.rules.lzsj = []
      this.rules.zsList = []
      this.rules.tw = [{ pattern: regPosInt, message: '请输入整数', trigger: 'blur'}]
      this.rules.xl = [{ pattern: regPosInt, message: '请输入整数', trigger: 'blur'}]
      this.rules.hx = [{ pattern: regPosInt, message: '请输入整数', trigger: 'blur'}]
      this.rules.xyszy = [{ pattern: regPosInt, message: '请输入整数', trigger: 'blur'}]
      this.rules.xybhd = [{ pattern: regPosInt, message: '请输入整数', trigger: 'blur'}]
      this.rules.yszt = []
      this.rules.sewspf = []
      this.rules.ttpf = []
    }
  }

  private getTlsj() {
    if (this.forms.lzsj && this.forms.lksj) {
      this.$set(this.forms, 'tlsj', Math.ceil(this.getDataDiff(this.forms.lksj, this.forms.lzsj, 'minute')))
    }
  }

  private getZsmsList(val?: string) {
    queryList({ zsms: val }).then((res: AxiosResponse) => {
      this.zsmsList = res.data
    })
  }

  // 获取科室列表
  private getDepartmentList() {
    DepartmentList({ghlx: 1, yytag: 1}).then((res: any) => {
      this.fzksdmList = res.data
    })
  }

  // 获取医生列表
  private async getYsList(val: any) {
    aDeptDocListjz({ ksdm: this.forms.fzksdm }).then((res: AxiosResponse) => {
      this.ysList = res.data
    })
    this.forms.ysdm = ''
  }

  private openSews() {
    this.dialogVisible = true
  }

  private openHurts() {
    ;(this.$refs.hurtLevel as any).open()
    // this.dialogVisibleN = true
  }

  private handleClose() {
    this.dialogVisible = false
  }

  // private handleCloseN() {
  //   this.dialogVisibleN = false
  // }

  private getDataDiff(startTime: any, endTime: any, diffType: any) {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
    startTime = startTime.replace(/\-/g, '/')
    endTime = endTime.replace(/\-/g, '/')

    //将计算间隔类性字符转换为小写
    diffType = diffType.toLowerCase()
    let sTime = new Date(startTime) //开始时间
    let eTime = new Date(endTime) //结束时间

    //作为除数的数字
    let divNum: number = 1
    switch (diffType) {
      case 'second':
        divNum = 1000
        break
      case 'minute':
        divNum = 1000 * 60
        break
      case 'hour':
        divNum = 1000 * 3600
        break
      case 'day':
        divNum = 1000 * 3600 * 24
        break
      default:
        break
    }
    console.log('(eTime.getTime() - sTime.getTime()) / divNum', (eTime.getTime() - sTime.getTime()) / divNum)

    return (sTime.getTime() - eTime.getTime()) / divNum
  }

  private saveTriage() {
    ;(this.$refs.formValidate as Form).validate((valid) => {
      if (valid) {
        this.forms.mb = this.forms.xl
        if (this.forms.jzlsh) delete this.forms.jzlsh
        addTriage(this.forms).then((res: AxiosResponse) => {
          this.$notify.success('添加成功')
          this.clearform()
        })
      }
    })
  }

  private getSummary(val: any) {
    if (val) this.forms.sewspf = val
  }

  private setBrpj(val: any) {
    if (val) {
      // this.forms.brpj = val
    }
  }

  private getFzsj () {
    getNow().then((res: any) => {
      if (res.data) {
        this.date = parseTime(res.data)
        this.$set(this.forms, 'fzsj', this.date)
      }
    })
  }

  private getMewsClass (val: any) {
    this.mewsClass = val
    this.getXtpj()
  }

  private refreshTtpf (val: any) {
    if (val) {
      this.$set(this.forms, 'ttpf', val[0])
      this.ttpfClass = val[1]
    }
    this.getXtpj()
  }

  private zsChange (val: any) {
    console.log('22221111221',val)
    debugger
    this.zsClassOne = []
    this.zsmsOne = []
    val.forEach((value: any)=>{
      this.zsmsList.forEach ( (ele: any) => {
        if(value == ele.zsmsid){
          let a = Number(ele.bqfj)
          ele.bqfj = Number(ele.bqfj)
          this.zsClassOne.push(ele.bqfj)
          this.zsmsOne.push(ele.zsms)
          // this.zsClassOne.push(a)
          }
      });
    });
    this.forms.zs = this.zsmsOne.join(";")
    this.zsClass = Math.min(...this.zsClassOne) // 获取最小的病情分级
    this.getXtpj()
  }

  //计算系统评级
  private getXtpj () {
    if (this.zsClass !== '' && this.mewsClass !== ''&& this.ttpfClass !== '') {
      this.xtpjList = []
      this.xtpjList.push(this.zsClass) // 主诉
      this.xtpjList.push(this.mewsClass) // mews评分
      this.xtpjList.push(this.ttpfClass) // 疼痛评分
      this.forms.xtpj = Math.min(...this.xtpjList)
      this.forms.brpj = this.forms.xtpj
    }
  }
  private clearform () {
    this.$nextTick(() => {
      if(this.$refs.formValidate !== undefined){
        (this.$refs.formValidate as Form).resetFields()
      }
    })
    this.forms.xyssy = ''
  }
}
</script>

<style lang="scss" scoped>
.his-triage {
	.label {
		display: inline-flex;
		align-items: center;
	}

	.el-form {
		margin: 10px;

		.form-all {
			display: grid;
			grid-template-columns: repeat(4, 25%);
			grid-column-gap: 10px;

			.form-area {
				display: flex;
				flex-flow: row nowrap;

				.his-patient-btn {
					height: 28px !important;
					margin-top: 0 !important;
				}
        .his-special-btn {
          margin-left: -30px;
          padding: 10px 0;
        }
				::v-deep .area-inline {
					display: flex;

					.el-form-item__content {
						display: flex;
					}
				}
			}
		}

		.form-all3 {
			display: grid;
			grid-template-columns: repeat(3, 33%);
			grid-column-gap: 10px;

			.form-area {
				display: flex;
				flex-flow: row nowrap;

				.his-patient-btn {
					height: 28px !important;
					margin-top: 0 !important;
				}
			}
		}

		.form-all5 {
			display: grid;
			grid-template-columns: repeat(5, 19%);
			grid-column-gap: 10px;

			.form-area {
				display: flex;
				flex-flow: row nowrap;

				.his-patient-btn {
					height: 28px !important;
					margin-top: 0 !important;
				}
			}
		}
	}
  .el-form {
    .form-special {
      .item-special {
      width: 70%;
      .item-input {
      width: 70%;
       }
      }
    }

  }
	.el-divider--horizontal {
		margin: 10px 0;
	}
  ::v-deep .el-select .el-select__input{
      margin-left: 10px !important;
    }
  ::v-deep .el-form-item .el-form-item__label{
    line-height: 0;
  }
  // .content {
  //   .his-small {
  //     ::v-deep .el-form {
  //       width: 98% !important;
  //     }
  //   }
  // }
}
</style>
<style>
  .logMgCls .el-select__tags-text {
        display: inline-block;
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
  }
  .logMgCls .el-select .el-tag__close.el-icon-close {
  top: -7px;
}
</style>
