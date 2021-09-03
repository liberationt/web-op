<!--
 * @Date: 2020-05-20 09:31:03
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-21 16:50:32
 * @description: 与设计确认过后改的第二版   门诊医生站
-->
<template>
  <div class="content">
    <div class="ht">
      <!-- 左侧菜单 悬浮 -->
      <div class="ht his-module" @mouseenter="enter">
        <div class="open action">
          <i class="icon his-card-open gray" />
        </div>
      </div>
      <div class="ht his-module actives scroll-bar" v-show="!leftSide" @mouseleave="leave">
        <div slot="header" class="row">
          <div class="label">
            <div class="title" style="flex: 1">{{ $t('patients.hzlb') }}</div>
            <div class="title-more" @click="morePatients" style="cursor: pointer">
              <span>More >></span>
            </div>
          </div>
          <div class="action" @click="leave">
            <i class="icon his-card-put gray" />
          </div>
        </div>
        <div slot="header" class="header-row">
          <div class="row-input">
            <el-input v-model="searchData.jzkh" placeholder="请输入卡号"></el-input>
          </div>
          <div @click="getPatientList">
            <el-button type="primary" class="his-patient-btn" size="mini" style="width: 58px; height: 30px; padding: 10px 14px">{{ $t('patients.dk') }}</el-button>
          </div>
        </div>
        <div class="tab-btn" style="padding: 6px, 0px">
          <div class="tab-row">
            <el-tabs v-model="searchData.patientType" class="tab-mini his-patient-tab" @tab-remove="removeTab" @tab-click="getPatientList">
              <el-tab-pane v-for="item in tabBlocks" :key="item.name" :label="item.title" :name="item.name" :style="{ height: listSlotHeight - 76 - 54 + 'px' }">
                <patient-list v-if="item.name == searchData.patientType" ref="patientList" v-model="patientsData" @transfer="getPatientFiles" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧大模块 -->
    <div class="right-side">
      <!-- 顶部病人信息 -->
      <patient-detail v-model="patientFile" :patientObj="patientObj" :pnParam="pnParam" @refreshTab="initTemporary" @nextPatient="getPatientFiles"></patient-detail>
      <!-- 门诊病历，tab页，诊断 -->
      <div class="main-bottom">
        <!-- 门诊病历 -->
        <div class="his-module ht his-patient-tree" style="flex-shrink: 0" :style="{ width: treeWidth + 'px', height: listSlotHeight - 80 + 'px' }">
          <div slot="header" class="row" v-show="!folderSide">
            <div class="label">
              <div class="title">{{ $t('patients.blj') }}</div>
            </div>
            <div class="action" @click="isHideFolder">
              <i class="icon his-card-put gray" />
            </div>
          </div>
          <div class="open action" @click="isHideFolder" v-if="folderSide">
            <i class="icon his-card-open gray" />
          </div>
          <el-tree ref="tree" v-loading="isLoading" :data="folderData" :props="defaultProps" @node-click="handleNodeClick" v-show="!folderSide && !isDisabled" class="scroll-bar" highlight-current default-expand-all @node-collapse="nodecollapseData" :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <i class="icon" :class="data.children ? getClass(node) : 'his-tree-submen'"></i>
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
        <!-- 首页，切换tab -->
        <div class="main-middle" :style="{ height: listSlotHeight - 76 - 10 + 'px' }" :class="folderSide ? 'main-width1' : 'main-width2'">
          <!--suppress CssInvalidPropertyValue -->
          <div class="tab-btn" style="padding: 6px, 0">
            <div class="tab-row">
              <el-tabs v-model="btnValue" ref="middleTab" class="tab-mini his-expand" :lazy="true" @tab-click="changeTab" @tab-remove="removeTab" :before-leave="destoryEle">
                <!-- 病历首页不能参与遍历，v-show不能阻止在v-for内部的遍历，v-if虽然可以阻止，但是每次进入都要重新加载页面 -->
                <el-tab-pane label="病历首页" name="病历首页" :disabled="isDisabled" :style="{ height: listSlotHeight - 130 + 'px' }">
                  <div v-show="btnValue == '病历首页' || showIframe" class="ht">
                    <iframe v-show="btnValue == '病历首页' && showIframe" id="myframe" :src="webUrl" marginheight="0" marginwidth="0" scrolling="no" frameborder="0" :height="iframeH" class="frame"></iframe>
                  </div>
                </el-tab-pane>
                <el-tab-pane v-for="(item, index) in blocks" :key="index" :label="item.title" :name="item.title" :style="{ height: listSlotHeight - 130 + 'px' }" :closable="index > tabLength" :disabled="isDisabled" ref="tabTitle">
                  <!-- 根据btnIndex|name 选择显示哪个 -->
                  
                  <!-- 诊断 -->
                  <keep-alive>
                    <diagnosis v-if="btnValue == item.title && btnValue == '诊断'" @setStatus="getStatus" @click="handleNewList" @changeStyle="changeStyle" :isHistory="isHistory"></diagnosis>
                  </keep-alive>

                  <!-- 处方 -->
                  <!--                                    <keep-alive>-->
                  <div v-if="btnValue == '处方'" class="ht hide-scroll">
                    <recipe v-if="btnValue == item.title && btnValue == '处方'" :patientFile="patientFile" @setStatus="getStatus" :isHistory="isHistory"></recipe>
                  </div>
                  <!--                                    </keep-alive>-->
                  <!-- 处置 -->
                  <keep-alive>
                    <auxiliary v-if="btnValue == item.title && btnValue == '处置'" :isHistory="isHistory"></auxiliary>
                  </keep-alive>
                  <!-- 辅助报告 -->
                  <div v-if="btnValue == '辅助报告' && item.title == '辅助报告'" class="ht hide-scroll">
                    <report-list :pn-param="pnParam" :jump-to="jumpTo" @getSymbol="getSymbol" />
                  </div>
                  <!-- 在线诊疗 -->
                  <div v-if="btnValue == '在线诊疗' && item.title == '在线诊疗'" class="ht hide-scroll">
                    <webTherapy :data="zxwzData"></webTherapy>
                  </div>
                  <!-- 检查申请 -->
                  <div v-if="btnValue == '检查申请'" class="ht">
                    <inspect v-if="btnValue == item.title" :patient-file="patientFile" :patientObj="patientObj" :editStatus="inspectEditStatus" :reqObj="inspectReqObj" />
                  </div>
                  <!-- 检验申请 -->
                  <div v-if="btnValue == '检验申请'" class="ht hide-scroll">
                    <checkout-apply v-if="btnValue == item.title" :checkData="patientFile" />
                  </div>
                  <!-- 手术申请单 -->
                  <div v-if="btnValue == '手术申请'" class="ht hide-scroll">
                    <operation :patientData="patientFile" :zdmc="patientObj.fymc" v-if="btnValue == item.title" />
                  </div>
                  <!-- 康复治疗申请 -->
                  <div v-if="btnValue == '康复治疗申请'" style="width: 100%" class="ht hide-scroll">
                    <cureApply style="width: 100%" v-if="btnValue == item.title" :checkData="patientFile" :prrData="pnParam" :type="1" />
                  </div>
                  <!-- 病情证明单 -->
                  <div v-if="btnValue == '病情证明单'" class="ht">
                    <proof-illness :patientFile="patientFile" :zdmc="patientObj.fymc" v-if="btnValue == item.title" />
                  </div>
                  <!-- 疾病证明单 -->
                  <div v-if="btnValue == '疾病证明单'" class="ht">
                    <diseaseCertificate :patientFile="patientFile" :zdmc="patientObj.fymc" v-if="btnValue == item.title" />
                  </div>
                  <!-- 入院申请单 -->
                  <div v-if="btnValue == '入院申请单'" class="ht">
                    <registeration-form v-if="btnValue == item.title" :patient-file="patientFile" />
                  </div>
                  <!-- 留观登记单 -->
                  <div v-if="btnValue == '留观登记单'" class="ht">
                    <stay-observation v-if="btnValue == item.title" :patient-file="patientFile" />
                  </div>
                  <!-- 转诊申请单 -->
                  <div v-if="btnValue == '转诊申请单'" class="ht">
                    <referral-form v-if="btnValue == item.title" :zdmc="patientObj.fymc" :queryInfo="patientFile" />
                  </div>
                  <!-- 病历模板 -->
                  <div v-if="btnValue == '病历模板'" class="ht special hide-scroll">
                    <!-- 加v-if條件   避免关闭的时候，循环列表，请求多次数据-->
                    <medical-temp ref="medicalTemp" :is-quote="true" v-if="btnValue == item.title" @openTab="openTab" @showMsg="childMsg" />
                  </div>
                  <!-- 诊疗方案列表 -->
                  <div v-if="btnValue == '诊疗方案'" class="ht hide-scroll">
                    <treament-plan :patientData="patientFile" @loaded="loadTreamentPlan" />
                  </div>
                  <!--  抗菌药物申请-->
                  <div v-if="btnValue == '抗菌药物申请'" class="ht hide-scroll">
                    <apply-kj-medical :patientFile="patientFile" v-if="btnValue == item.title" />
                  </div>

                  <!-- 就诊历史 -->
                  <div v-if="btnValue == '就诊历史'" class="ht">
                    <visit-history v-if="btnValue == item.title" :historyData="patientFile" :pnParam="pnParam" @openTab="openTab" @formMsg="getPatientFiles" />
                  </div>

                  <!-- 诊间预约 -->
                  <div v-if="btnValue == '诊间预约'" class="ht hide-scroll">
                    <!--                    <appointment-set/>-->
                    <orderManager :patientData="patientFile" />
                  </div>
                  <!-- 预约查询 -->
                  <div v-if="btnValue == '预约查询'" class="ht hide-scroll">
                    <appointment-query v-if="btnValue == item.title" :appointData="patientFile" />
                  </div>
                  <!-- 手术申请单查询 -->
                  <div v-if="btnValue == '手术申请单查询'" class="ht hide-scroll">
                    <operationApplyQuery :pn-param="patientFile" v-if="btnValue == item.title" />
                  </div>

                  <!-- 检查申请单查询 -->
                  <div v-if="btnValue == '检查申请单查询'" class="ht hide-scroll">
                    <check-apply-query v-if="btnValue == item.title" :pn-param="pnParam" @queryCheckApply="queryCheckApply" />
                  </div>

                  <!-- 检验申请单查询 -->
                  <div v-if="btnValue == '检验申请单查询'" class="ht hide-scroll">
                    <check-test-query v-if="btnValue == item.title" :pn-param="pnParam" />
                  </div>

                  <!-- 诊间结费记录 -->
                  <div v-if="btnValue == '诊间结费记录'" class="ht">
                    <feeRecord />
                  </div>

                  <!-- 诊间结算 -->
                  <div v-if="btnValue == '诊间结算'" class="ht">
                    <fee-set />
                  </div>

                  <!-- 宫腔镜手术知情同意书 -->
                  <!--                  <div v-if="btnValue == '宫腔镜手术知情同意书'" class="ht">-->
                  <!--                    <hysteroscopic-consent />-->
                  <!--                  </div>-->

                  <!-- 门诊手术知情同意书 -->
                  <!--                  <div v-if="btnValue == '门诊手术知情同意书'" class="ht">-->
                  <!--                    <outpatient-consent />-->
                  <!--                  </div>-->
                  <!--  宫内节育器取出手术知情同意书 -->
                  <!--                  <div v-if="btnValue == '宫内节育器取出手术知情同意书'" class="ht">-->
                  <!--                    <IUDRemovalConsent />-->
                  <!--                  </div>-->
                  <!-- 宫内节育器放置手术知情同意书 -->
                  <!--                  <div v-if="btnValue == '宫内节育器放置手术知情同意书'" class="ht">-->
                  <!--                    <IUDPlacementConsent />-->
                  <!--                  </div>-->
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog 
      title="提示"
      :visible.sync="ybSmartVisible"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"  
    >
      <el-form :model="macValue" label-width="80px" ref="macRef" :rules="macRule">
        <el-form-item label="MAC地址" prop="mac">
          <el-input v-model="macValue.mac" placeholder="请输入MAC地址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveMac">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import patientList from './components/patientList.vue'
import home from './components/home1.vue'
import diagnosis from './components/diagnosis.vue'
import fastDiagnose from './components/model/fastDiagnose.vue'
import reportList from './components/reportList.vue'
import auxiliary from './components/auxiliary.vue'
import recipe from './components/recipe.vue'
import medicalTemp from '../medicalTemp/index.vue'
import treamentPlan from './components/treamentPlan.vue'
import visitHistory from './components/visitHistory.vue'
import registerationForm from './components/registerationForm.vue'
import orderManager from './components/orderManager.vue'
import inspect from './components/inspect.vue'
import operation from './components/operation.vue'
import feeRecord from './components/feeRecord.vue'
import proofIllness from './components/proofIllness.vue'
import diseaseCertificate from './components/diseaseCertificate.vue'
import checkApplyQuery from './components/checkApplyQuery.vue'
import checkTestQuery from './components/checkTestQuery.vue'
import operationApplyQuery from './components/operationApplyQuery.vue'
import appointmentQuery from './components/appointmentQuery.vue'
import feeSet from './components/feeSet.vue'
import referralForm from './components/referralForm.vue'
import checkoutApply from './components/checkoutApply.vue'
import hysteroscopicConsent from './components/hysteroscopicConsent.vue'
import outpatientConsent from './components/outpatientConsent.vue'
import IUDRemovalConsent from './components/IUDRemovalConsent.vue'
import IUDPlacementConsent from './components/IUDPlacementConsent.vue'
import patientDetail from './components/patientDetail.vue'
import applyKjMedical from '@/views/cis/op/dctwork/patients/components/applyKjMedical.vue'
import webTherapy from './components/webTherapy.vue'
import { IPatientForm, IBlxxForm, queryPatientList, queryPatientFile, initPatientFile, checkZsIsExit, aGetYfsb,queryMac,SaveMac,getZlTreeOn,} from '@/api/cis/op/dctwork/patients'
import { AxiosResponse } from 'axios'
import { getNow, getEmrTree } from '@/api/his/basic'
import { folderList, tabStatusList } from '@/api/cis/op/dctwork/patientDict'
import { parseTime, deepCopy } from '@/utils'
import cureApply from './components/mzysCureApply.vue'
import stayObservation from '@/views/cis/op/dctwork/patients/components/stayObservation.vue'
import { filter } from 'node_modules/jszip'
import dayjs from 'dayjs'

export const NForm: IBlxxForm = {
  bmi: 0,
  bqgz: '',
  brid: 0,
  dpy: '',
  ft: false,
  fx: false,
  fzjc: '',
  h: 0,
  hxkn: false,
  jkcfs: [
    {
      diagnoseid: '',
      diagnosename: '',
      empiid: '',
      examineunit: '',
      guideUserText: '',
      guideWayText: '',
      guidedate: '',
      guideuser: '',
      guideway: '',
      healthteach: '',
      icd10: '',
      id: '',
      inputUnitText: '',
      inputUserText: '',
      inputdate: '',
      inputunit: '',
      inputuser: '',
      lastModifyUnitText: '',
      lastModifyUserText: '',
      lastmodifydate: '',
      lastmodifyunit: '',
      lastmodifyuser: '',
      phrid: '',
      recipename: '',
      recordid: '',
      wayid: '',
    },
  ],
  jws: '',
  jzxh: 0,
  ks: false,
  leftcorrectedvision: 0,
  leftvision: 0,
  mxb: '',
  ot: false,
  p: 0,
  pageNum: 0,
  pageSize: 0,
  pz: false,
  qtlcbx: '',
  r: 0,
  rightcorrectedvision: 0,
  rightvision: 0,
  rsbz: 0,
  ssy: 0,
  szy: 0,
  t: 0,
  tgjc: '',
  w: 0,
  xbs: '',
  yt: false,
  zsxx: '',
}

@Component({
  name: 'Patients',
  filters: {},
  components: {
    patientList,
    home,
    diagnosis,
    fastDiagnose,
    reportList,
    recipe,
    auxiliary,
    medicalTemp,
    treamentPlan,
    visitHistory,
    registerationForm,
    cureApply,
    // appointmentSet,
    stayObservation,
    orderManager,
    inspect,
    operation,
    feeRecord,
    proofIllness,
    diseaseCertificate,
    checkApplyQuery,
    checkTestQuery,
    operationApplyQuery,
    appointmentQuery,
    feeSet,
    referralForm,
    checkoutApply,
    hysteroscopicConsent,
    outpatientConsent,
    IUDRemovalConsent,
    IUDPlacementConsent,
    patientDetail,
    applyKjMedical,
    webTherapy,
  },
})
export default class extends Vue {
  private zxwzData: any = {}
  private ybSmartVisible: boolean = false // 录入MAC地址默认隐藏
  private macValue: any = {
    mac: ''
  } // 录入本机物理地址
  // 控制页面的ui数据
  // private folderSide: boolean = true
  private folderSide: boolean = false
  // private treeWidth: number = 24
  private tabLength: number = 5 // 不可关闭的tab页的长度
  private treeWidth: number = 164
  private leftSide: boolean = true
  private defaultProps: any = {
    children: 'childrenList',
    label: 'tName',
  }
  private isActived: number = 1
  private btnIndex: string = '0'
  private btnValue: string = '病历首页'
  private comHeight: number = 0
  private listSlotHeight: number = 0
  private isDisabled: boolean = true
  // 业务数据
  private patientFile: any = {} //患者档案数据  brid---brbh
  private patientsData: IPatientForm[] = [] //患者列表数据
  private patientObj: IBlxxForm = NForm //患者病历首页要传的数据
  private inspectEditStatus: boolean = true
  private inspectReqObj: any = {}
  private isDiagnosis: boolean = false // 是否有诊断
  private pnParam: any = {
    brid: '',
    jzxh: '',
    brxz: '', //病人性质，处方模块获取自付比例用的到
    jzlsh: '',
    mzks: Vue.prototype.AUTHORITY.outpatientCode,
  } //传递其他组件需要的变量
  private folderLists: any[] = [] // 功能树节点
  private folderData: any[] = this.folderLists //门诊病历的列表
  private blocks: any[] = []
  private searchData: any = {
    pageNum: 1,
    pageSize: 1000,
    jzkh: '',
    patientType: '1',
    ksdm: Vue.prototype.AUTHORITY.outpatientCode,
    ghks: Vue.prototype.AUTHORITY.bussinessRole,
  }
  // private searchDataHistory: any = {
  //   pageNum: 1,
  //   pageSize: 10,
  //   brbh: '',
  // }
  private showIframe: boolean = true // 隐藏、显示病历首页
  private tabBlocks: object[] = tabStatusList //待诊，诊中，束诊列表
  private isHistory: boolean = false // 判断是否为历史数据
  private jumpTo: number = 0 //引用按钮切换辅助报告时跳到子tab页的索引
  private tabWidth: string = '23'

  private menuItem: any = {} //设置电子电子病历菜单的数据
  // private repeatClick: boolean = false // 阻止树节点被重复点击
  private ksList: Array<any> = [] // 科室字典
  private nodeData: any = {} // 当前点击树节点
  private isLoading: boolean = false // 树节加载标识
  private sexList: Array<any> = [] // 性别数组
  private patientTypeList: Array<any> = [] // 病人性质数组
  private editList: Array<any> = [
    {
        id: 12,
        tName: '检查申请',
    },
    {
        id: 13,
        tName: '检验申请',
    },
    {
        id: 14,
        tName: '手术申请',
    },
    {
        id: 31,
        tName: '康复治疗申请',
    },
    {
        id: 32,
        tName: '抗菌药物申请',
    },
    {
        id: 17,
        tName: '诊间预约',
    },
    {
        id: 27,
        tName: '病情证明单',
    },
    {
        id: 36,
        tName: '疾病证明单',
    },
    {
        id: 28,
        tName: '入院申请单',
    },
    {
        id: 31,
        tName: '留观申请单',
    },
  ] // 不可编辑的数组
  private macRule: any ={
    mac: [{ required: true, message: '请填写MAC地址', trigger: 'blur'}]
  }

  private async queryEmrTree(val: any = '') {
    if(val){
      this.folderData = deepCopy(val)
      return
    }
    let that = this
    const param: any = {}
    param.hm = that.pnParam.jzlsh
    param.mode = 1
    await getEmrTree(param).then((res) => {
      that.folderData = res.data.outpatDoctor.concat(this.folderLists)
    })
  }

  // 载入病历模板
  private childMsg(data: any) {
    this.patientObj = Object.assign(this.patientObj, data)
  }

  private receive(data: any) {
    this.patientObj = Object.assign(this.patientObj, data)
  }

  get iframeH() {
    return Vue.prototype.PageHeight - 51 - 40 - 12 - 30 + 6
  }

  get webUrl() {
    let domainName = window.location.protocol + '//' + window.location.host
    // if (process.env.NODE_ENV === 'development') {
    //     return 'http://192.168.55.211/emreditor/edit.html?token=' + UserModule.token + '&pageHeight=' + this.iframeH
    // // return 'http://localhost/emr-editor/edit.html?token=' + UserModule.token + '&pageHeight=' + this.iframeH
    // } else {
    //     return domainName + '/emreditor/edit.html?token=' + UserModule.token + '&pageHeight=' + this.iframeH
    // }

    return Vue.prototype.AUTHORITY.qjym + '/emreditor/edit.html?token=' + UserModule.token + '&pageHeight=' + this.iframeH
    // return "http://220.196.249.90:81" + '/emreditor/edit.html?token=' + UserModule.token + '&pageHeight=' + this.iframeH
//    return  'http://localhost/edit.html?token=' + UserModule.token + '&pageHeight=' + this.iframeH
  }

  //

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
    this.comHeight = Vue.prototype.PageHeight - 76 - 10 - 44 - 10
    // 固定的tab行
    this.blocks = [
      // {
      //   name: '0',
      //   title: '病历首页',
      // },
      {
        name: '1',
        title: '诊断',
      },
      {
        name: '2',
        title: '处方',
      },
      {
        name: '3',
        title: '处置',
      },
      {
        name: '4',
        title: '辅助报告',
      },
      {
        name: '5',
        title: '在线诊疗',
      },
    ]
    this.patientTypeList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_PATIENT_DICT : this.$store.state.webSqlDict.TABLE_PATIENT_DICT
    this.sexList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT
  }

  private async getStatus() {
    this.patientObj = { ...NForm } // 清空
    this.pnParam.types = 2
    return await this.initPatientObj(this.pnParam)
  }

  // 获取功能树节点
  private getZlTreeOn() {
    getZlTreeOn({}).then((res: any) => {
      this.folderLists = res.data ? res.data : ''
    })
  }

  mounted() {
    this.getMac() // 添加计算机MAC地址
    this.getZlTreeOn() // 获取树功能节点信息
    if (Vue.prototype.AUTHORITY.hlwks == 0) this.tabLength = 3 // 根据是否为互联网科室，判断固定tab的长度
    else {
      this.tabLength = 4
    }
    console.log(1111111111111111, Vue.prototype.AUTHORITY.hlwks)
    // 判断是否为互联网科室
    if(Vue.prototype.AUTHORITY.hlwks == 0) {
      console.log(499,Vue.prototype.AUTHORITY.hlwks)
      this.blocks.splice(this.blocks.length-1,1)
      console.log(this.blocks)
    }
    console.log('Vue.prototype.AUTHORITY.loginBizsn', Vue.prototype.AUTHORITY.loginBizsn)//互联网科室传递的二维码
    this.ksList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DEPT_DICT : this.$store.state.webSqlDict.DEPT_DICT
    // 每次载入这个页面，加载一遍患者列表这个数据
    this.getPatientList()
    // 存在路由跳转过来的数据，重新载入病人首页信息
    // console.log(525,this.$route)
    // console.log(526,this.$route.query)
    if (this.$route.query.hasOwnProperty('brid') && this.$route.query.hasOwnProperty('jzhm')) {
      // let val = this.$route.query
      // val.types = '2'
      // val.mzks = Vue.prototype.AUTHORITY.outpatientCode //取门诊科室
      // val.ghks = Vue.prototype.AUTHORITY.bussinessRole //挂号科室
      // getNow().then((res: any) => {
      //     this.patientFile = val
      //     this.patientFile.jzrq = parseTime(res.data)
      //     this.patientFile.zsid = Vue.prototype.AUTHORITY.outpatientCode
      //     this.patientFile.zsidName = this.$store.state.webSqlDict.DEPT_DICT.find((item: any) => item.dv == this.patientFile.zsid).dn
      // })
      // this.isDisabled = false
      this.getPatientFiles(this.$route.query)
    } else {
      this.patientObj = { ...NForm }
    }
    this.createEMR()
    //监控电子病历回调
  }
  private createEMR() {
    let that = this
    window.addEventListener(
      'message',
      function (e) {
        if (typeof e.data == 'object') {
          const param = e.data
          if (param.type == 'delete' || param.type == 'save') {
            that.pnParam.jzlsh = param.hm
            if(that.folderData && that.folderData.length != 0){
              that.folderData.map((item: any)=>{
                // 定位点击的是哪一个树节点
                if(item.ctlId == that.nodeData.ctlId){
                  // 非病程记录树节点
                  if(item.emrType == 1) {
                    // 是否是新增或修改
                    if(param.type == 'save') {
                      if(item.ctlId && !item.tplClassId && !item.emrFileId && !item.isCourseNy) {
                        let params1: any = {
                          mode: '1',
                          hm: that.pnParam.jzlsh,
                          ctlId: item.ctlId,
                          emrType: item.emrType
                        }
                        that.dzbltreeFun(item, params1).then((res: any)=>{
                          item.childrenList && item.childrenList.map((val: any)=>{
                            if(val.tplClassId == param.tplClassId){
                              that.dzbltreeFuns(val, item)
                            }
                          })
                        })
                      }
                    // 是否是删除
                    }else if(param.type == 'delete') {
                      item.childrenList && item.childrenList.map( async (val: any)=>{
                        if(val.tplClassId == that.nodeData.tplClassId){
                          if(val.childrenList && val.childrenList.length > 1){
                            let params: any = {
                              mode: '1',
                              hm: that.pnParam.jzlsh,
                              ctlId: val.ctlId,
                              emrType: val.emrType,
                              tplClassId: val.tplClassId
                            }
                            that.dzbltreeFun(val, params)
                          }else {
                            let dzblTree: any = that.folderData.find((v: any) => v.ctlId == val.ctlId)
                            let params: any = {
                              mode: '1',
                              hm: that.pnParam.jzlsh,
                              ctlId: dzblTree.ctlId,
                              emrType: dzblTree.emrType
                            }
                            await that.dzbltreeFun(dzblTree, params).then(()=>{
                              that.queryDzblModel(dzblTree)
                            })
                          }
                        }
                      })
                    }
                  // 病程记录树节点
                  }else if (item.emrType == 2){
                    if(param.type == 'save'){
                      if(item.ctlId && !item.tplClassId && !item.emrFileId && !item.isCourseNy) {
                        let params1: any = {
                          mode: '1',
                          hm: that.pnParam.jzlsh,
                          ctlId: item.ctlId,
                          emrType: item.emrType
                        }
                        that.dzbltreeFun(item, params1).then((res: any)=>{
                          item.childrenList && item.childrenList.map((val: any)=>{
                            if(val.tName == param.courseNy){
                              that.dzbltreeFuns(val, item)
                            }
                          })
                        })
                      // 第二级树节点
                      }else if(item.isCourseNy == '1') {
                      // 第三级树节点
                      }else {
                      }
                    }else if(param.type == 'delete') {
                      item.childrenList && item.childrenList.map( async (val: any)=>{
                        if(that.nodeData.tName.includes(val.tName)){
                          if(val.childrenList && val.childrenList.length > 1){
                            let params: any = {
                              mode: '1',
                              hm: that.pnParam.jzlsh,
                              ctlId: val.ctlId,
                              emrType: val.emrType,
                              tName: val.tName
                            }
                            that.dzbltreeFun(val, params)
                          }else {
                            let dzblTree: any = that.folderData.find((v: any) => v.ctlId == val.ctlId)
                            let params: any = {
                              mode: '1',
                              hm: that.pnParam.jzlsh,
                              ctlId: dzblTree.ctlId,
                              emrType: dzblTree.emrType
                            }
                            that.dzbltreeFun(dzblTree, params)
                          }
                        }
                      })
                    }
                  }
                }
              })
            }
            // that.queryEmrTree()
          } else if (param.type == 'noToken') {
            UserModule.ResetToken()
            location.reload()
          }
        }
      },
      false
    )
  }
  // 操作完成时电子病历根据第一级节点获取第三级树节点
  private dzbltreeFuns(val: any, item: any) {
    if(val.isCourseNy == '1') {
      let params2: any = {
        mode: '1',
        hm: this.pnParam.jzlsh,
        ctlId: val.ctlId,
        emrType: val.emrType,
        tName: val.tName
      }
      getEmrTree(params2).then( async (res: any)=>{
        if(res.errorCode == 'SUCCESS'){
          if(res.data){
            let childrenList1: any = this.folderData
            let childrenList2: any = childrenList1.find((v: any) => v.ctlId == item.ctlId).childrenList
            let childrenList3: any = childrenList2.find((v: any) => v.tName == val.tName)
            childrenList3.childrenList = deepCopy(res.data.outpatDoctor)
            await this.queryEmrTree(this.folderData)
          }
        }
      })
    }else {
      let params2: any = {
        mode: '1',
        hm: this.pnParam.jzlsh,
        ctlId: val.ctlId,
        emrType: val.emrType,
        tplClassId: val.tplClassId
      }
      getEmrTree(params2).then( async (res: any)=>{
        if(res.errorCode == 'SUCCESS'){
          if(res.data){
            let childrenList1: any = this.folderData
            let childrenList2: any = childrenList1.find((v: any) => v.ctlId == item.ctlId).childrenList
            let childrenList3: any = childrenList2.find((v: any) => v.tplClassId == val.tplClassId)
            childrenList3.childrenList = deepCopy(res.data.outpatDoctor)
            await this.queryEmrTree(this.folderData)
          }
        }
      })
    }
  }

  // 查询Mac地址，判断是否保存过
  private getMac() {
    queryMac({}).then((res: any)=> {
      if(res.errorCode == "SUCCESS") {
        if(res.data != 1){
          this.ybSmartVisible = true
        }
      }
    })
  }

  // 保存MAC地址
  private handleSaveMac() {
    const mac:any = this.$refs.macRef
    mac.validate((valid: any) => {
      if(valid) {
        SaveMac(this.macValue).then((res: any)=> {
          if(res.errorCode == "SUCCESS") {
            this.$notify.success('添加成功')
            this.ybSmartVisible = false
          }
        })
      }
    })
  }

  private handleNewList() {
    console.log(1222222)
  }

  // private

  /**
   * @Description:  加载患者病历首页信息
   * @author: zhml
   * @param {type}:
   * @return:
   * @date 2020/7/13
   */
  private initPatientObj(val: any) {
    val.types = 2
    // 获取病历首页数据
    queryPatientFile(val).then((res: AxiosResponse) => {
      console.log(602, res)
      this.patientObj = Object.assign(this.patientObj, res.data.bcjl)
      if (res.data.brzdList && res.data.brzdList.length > 0) {
        this.isDiagnosis = true
        res.data.brzdList.forEach((item: any, index: number) => {
          if (index == 0) {
            ;(this.patientObj as any).fymc = item.zdmc
            ;(this.patientFile as any).icd10 = item.icd10
            ;(this.patientFile as any).fymc = item.zdmc
          }
        })
      } else {
        this.isDiagnosis = false
      }
    })
    return this.isDiagnosis
  }

  /**
   * @LastEditors: zhml
   * @Description: 隐藏门诊病历
   * @param: {type} params
   * @return:
   */
  private isHideFolder() {
    // this.folderSide = !this.folderSide
    if (this.folderSide) {
      // this.treeWidth = 24
      this.treeWidth = 164
      this.folderSide = !this.folderSide
    } else {
      // this.treeWidth = 164
      this.treeWidth = 24
      this.folderSide = !this.folderSide
    }
  }

  // 切换el-tree 样式
  private getClass(node: any) {
    if (node.expanded) {
      return 'his-tree-Folder'
    } else {
      return 'his-tree-Folder_unfold'
    }
  }

  //  点击病历夹触发事件
  private async handleNodeClick(data: any) {
    this.$set(data,'mzjzsj',this.patientFile.jzrq)
    this.nodeData = deepCopy(data)
    // if(this.repeatClick) return // 防止树节点被重复点击
    // this.repeatClick = true
    console.log(679,data)
    let isEdit: boolean = false // 是否可编辑标志
    this.editList.forEach((element: any)=>{
      if(this.isHistory && element.id == data.id) {
        this.$message.warning('非当日就诊不可开申请！')
        isEdit = true
        // this.repeatClick = false
      }
    })
    if(isEdit) return false
    //监控iframe传值
    let isExit = this.blocks.some((item) => item.title == data.tName)
    let dd = await this.initPatientObj(this.pnParam)
    let bb = await this.hadZs(this.pnParam.jzlsh) // 判断主诉是否存在，通过async返回的数据，必须用await来接收
    if (data.children) {
      return false
    } else {
      if (!this.pnParam.brid) {
        this.$message.warning('请先选择病人')
        return
      }
      if (isExit) {
        // 切换页面的操作
        this.btnValue = data.tName
      } else {
        if (data.id) {
          if ([12, 13, 14, 31, 32, 41, 17, 21, 27, 28, 29, 30, 36].includes(data.id) && !this.patientFile.fymc) {
            console.log(625,bb)
            if (!bb) {
              this.$message.warning('请先录入主诉')
              this.$nextTick(() => {
                this.btnValue = '病历首页'
              })
              return
            }
            this.$notify.warning('请先录入诊断')
            this.btnValue = '诊断'
            return
          } else if (data.id == 12 && data.$treeNodeId != '') {
            this.inspectEditStatus = false
            this.inspectReqObj = null
          }
          if(data.id == 2) return
          this.blocks.push({
            name: this.blocks.length,
            title: data.tName,
          })
          // 增加按钮，再进入点击的tab页
          this.btnValue = data.tName
          // this.repeatClick = false  //防止树节点被重复点击
        } else {
          this.btnValue = '病历首页'
          let that = this
          that.menuItem = data
          // 获取书写病历树节点(获取第二级树节点)
          if(data.ctlId && !data.tplClassId && !data.emrFileId && !data.isCourseNy) {
            // 电子病历除病程记录其他树节点
            if(data.emrType == '1'){
              if(data.childrenList && data.childrenList.length == 0 || !data.childrenList){
                let params: any = {
                  mode: '1',
                  hm: this.pnParam.jzlsh,
                  ctlId: data.ctlId,
                  emrType: data.emrType
                }
                this.isLoading = true
                await this.dzbltreeFun(data, params)
              }
              await this.queryDzblModel(data)
            // 电子病历病程记录树节点
            }else if(data.emrType == '2' && !data.isCourseNy){
              if(data.childrenList && data.childrenList.length == 0 || !data.childrenList){
                let params: any = {
                  mode: '1',
                  hm: this.pnParam.jzlsh,
                  ctlId: data.ctlId,
                  emrType: data.emrType
                }
                this.isLoading = true
                await this.dzbltreeFun(data, params)
              }
              await this.queryDzblModel(data)
            }
          // 获取电子病历第三级树节点
          }else if((data.tplClassId && !data.emrFileId) || (data.emrType == '2' && data.isCourseNy == '1')) {
            // 除病程记录其他树节点
            if(data.emrType == '1'){
              if(data.childrenList && data.childrenList.length == 0 || !data.childrenList){
                let params: any = {
                  mode: '1',
                  hm: this.pnParam.jzlsh,
                  ctlId: data.ctlId,
                  emrType: data.emrType,
                  tplClassId: data.tplClassId
                }
                this.isLoading = true
                await this.dzbltreeFun(data, params)
              }
              await this.queryDzblModel(data)
            // 病程记录树节点
            }else if(data.emrType == '2' && data.isCourseNy == '1'){
              if(data.childrenList && data.childrenList.length == 0 || !data.childrenList){
                let params: any = {
                  mode: '1',
                  hm: this.pnParam.jzlsh,
                  ctlId: data.ctlId,
                  emrType: data.emrType,
                  tName: data.tName
                }
                this.isLoading = true
                await this.dzbltreeFun(data, params)
              }
              await this.queryDzblModel(data)
            }
          }else if(data.emrFileId) {
            this.queryDzblModel(data)
          }
        }
      }
    }
  }
  // 获取电子病历树节点
  private async dzbltreeFun(data: any, params: any) {
    await getEmrTree(params).then( async (res: any)=>{
      if(res.errorCode == 'SUCCESS'){
        if(res.data){
          data.childrenList = res.data.outpatDoctor
          await this.queryEmrTree(this.folderData)
        }
      }
    })
  }
  // 获取电子病历模板
  private queryDzblModel(data: any){
    let that = this
    setTimeout(function () {
      // if (data.tplClassId || data.emrType == '2') {
      data.mode = 1
      data.hm = that.pnParam.jzlsh
      let iframe = document.getElementById('myframe') && (document.getElementById('myframe') as any).contentWindow
      iframe && iframe.postMessage(data, '*') //通信 * 可以指定域名
      that.isLoading = false
      // }
    }, 500)
  }

  /**
   * @LastEditors: zhml
   * @Description: 关闭标签页,关闭不了前5个标签页
   * @param {type} params
   * @return:
   */
  private removeTab(value: any) {
    let tabs = this.blocks
    let activeName = value
    let index = this.blocks.findIndex((item) => item.title == value)
    console.log(680,this.tabLength)
    if (activeName == value && index > this.tabLength) {
      this.blocks.forEach((tab, index) => {
        if (tab.name === value) {
          let nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeName = nextTab.name
          }
        }
      })
    } else {
      return null
    }
    this.btnValue = activeName
    this.blocks = tabs.filter((tab) => tab.title !== value)
  }

  // 跳转病人列表页面
  private morePatients() {
    this.$router.push({ path: '/MorePatients', query: this.searchData })
  }

  // 跳转页面事件
  private openTab(val: string) {
    var data = {
      label: '',
    }
    if (val == 'jzls') data.label = '就诊历史'
    if (val == 'blmb') data.label = '病历模板'
    if (val == 'zd') data.label = '诊断'
    if (val == 'cf') data.label = '处方'
    if (val == 'fj') data.label = '处置'
    if (val == 'home') data.label = '病历首页'
    if (val == 'fzjc') {
      data.label = '辅助报告'
      this.jumpTo = 5
    }
    this.handleNodeClick(data)
  }

  private queryCheckApply(value: any) {
    value.sqid = value.jcxh
    let data = {
      id: 12,
      tName: '检查申请',
      $treeNodeId: '',
    }
    this.inspectEditStatus = true
    this.inspectReqObj = value
    this.handleNodeClick(data)
  }

  /**
   * @LastEditors: zhml
   * @Description:  切换患者列表 || 读卡
   * @param {type} params
   * @return:
   */
  private getPatientList() {
    this.searchData.ksdm = Vue.prototype.AUTHORITY.outpatientCode
    queryPatientList(this.searchData).then((res: any) => {
      this.patientsData = res.data.list
    })
  }

  /**
   * @LastEditors: zhml
   * @Description: 根据传入的病人id 获取病人档案（双击病人列表）
   * @param {type} params
   * @return:
   */
  private async getPatientFiles(val: any) {
    let nowDate: any = new Date()
    let ghDate: string = ''
    // 就诊历史中无挂号时间用开始时间
    if(val.ghsj) { 
      ghDate = val.ghsj.slice(0,10)
    } else {
      ghDate = val.kssj.slice(0,10)
    }
    let hisDate: number = new Date(ghDate).getTime()
    nowDate = dayjs(((await getNow()) as any).data).format('YYYY-MM-DD') 
    nowDate = new Date(nowDate).getTime()
    if(nowDate > hisDate) {
      this.isHistory = true
    } else {
      this.isHistory = false
    }
    this.zxwzData.jzlsh = val.jzlsh
    this.zxwzData.jzzt = val.jzzt == 0 ? 1 : val.jzzt
    // 先清空
    this.patientObj = { ...NForm }
    val.mzks = Vue.prototype.AUTHORITY.outpatientCode //取门诊科室
    val.ghks = Vue.prototype.AUTHORITY.bussinessRole //挂号科室
    if(Vue.prototype.AUTHORITY.hlwks == '1') {
      val.bizsn = localStorage.getItem('loginBizsn')
    }
    let response: any = {}
    if (val.jzzt == 0) {
      response = await initPatientFile(val)
      val.jzxh = response.data.jzxh
    }
    val.types = 5
    // this.pnParam.jzxh = response.data.jzxh // 真 就诊序号
    // this.pnParam.clinicId = response.data.jzxh
    if (val.morePatient && val.morePatient == 2) {
      this.pnParam = {
        brid: val.brbh,
        jzlsh: val.jzlsh,
        brxz: val.brxz,
        brxm: val.brxm,
        jzhm: val.jzhm,
        jzkh: val.jzkh,
        ghgl: val.ghxh, // 挂号关联
        clinicId: val.jzxh,
        jzxh: val.jzxh,
        jzzt: val.jzzt
      }
    } else {
      this.pnParam = {
        brid: val.brid,
        jzlsh: val.jzlsh,
        brxz: val.brxz,
        brxm: val.brxm,
        jzhm: val.jzhm,
        jzkh: val.jzkh,
        ghgl: val.sbxh, // 挂号关联
        clinicId: val.jzxh,
        jzxh: val.jzxh,
        jzzt: val.jzzt
      }
    }
    this.queryEmrTree()
    // 判断是从更多患者里或者就诊历史里带过来的患者还是从左侧边栏带过来的患者
    getNow().then((res: any) => {
      this.patientFile = { ...val }
      if (val.morePatient) {
        if (val.morePatient == 1) {
          this.patientFile.jzrq = val.ghsj
        } else {
          this.patientFile.jzrq = val.kssj
        }
      } else if (val.jzzt != 0) {
        this.patientFile.jzrq = val.ghsj
      } else {
        this.patientFile.jzrq = parseTime(res.data)
      }
      this.patientFile.zsid = Vue.prototype.AUTHORITY.outpatientCode
      this.patientFile.zsidName = this.ksList.find((item: any) => item.dv == this.patientFile.zsid).dn
      let brxbStr: string = this.sexList.find((item: any) => item.dv == this.patientFile.brxb).dn
      let brxzStr: string = this.patientTypeList.find((item: any) => item.dv == this.patientFile.brxz).dn
      this.$set(this.patientFile,'brxbName',brxbStr)
      this.$set(this.patientFile,'brxzName',brxzStr)
    })
    // 查询病程记录
    this.initPatientObj(this.pnParam)
    this.isDisabled = false
    // 切换病人，光标回到病历首页，blocks 只有5个
    this.initData(1)
    this.$store.commit('SET_PN_PARAM', this.pnParam)
    //同步编辑器
    let iframe = document.getElementById('myframe') && (document.getElementById('myframe') as any).contentWindow
    iframe && iframe.postMessage({ type: 'selPerson' }, '*') //通信 * 可以指定域名
  }

  /**
   * @Description:  切换病人或者别的操作   需要重新加载病人数据
   * @author: zhml
   * @param {type}:
   * @return:
   * @date 2020/7/28
   */
  private initData(val: any) {
    this.btnValue = '病历首页'
    if (this.blocks.length > 6) this.blocks.splice(6, this.blocks.length - 6)
    // this.patientZDList = ''
    // this.patientYJList = ''
    // this.patientCFList = ''
    // this.patientZTList = ''
    this.patientFile = {}
    this.patientObj = { ...NForm }
    this.showIframe = true
    if (typeof val == 'boolean') {
      this.pnParam = {}
    }

    this.$nextTick(() => {
      this.getPatientList()
    })
  }

  private initTemporary(val: any) {
    this.btnValue = '病历首页'
    if (this.blocks.length > 6) this.blocks.splice(6, this.blocks.length - 6)
    // this.patientZDList = ''
    // this.patientYJList = ''
    // this.patientCFList = ''
    // this.patientZTList = ''
    this.patientFile = {}
    this.patientObj = { ...NForm }

    if (typeof val == 'boolean') {
      this.pnParam = {}
    }
    this.folderData = []
    console.log(111111111111111111111)
    this.btnValue = '病历首页'
    this.showIframe = false
    this.$nextTick(() => {
      this.getPatientList()
    })
  }

  private destoryEle(active: any, oldActive: any) {
    let list: any = this.$refs.tabTitle
    let cc = list.find((item: any) => item.label == oldActive)
    console.log('active', active, 'oldActive', oldActive, cc)
    // this.$refs
  }

  /*
   *@Description: 判断是否有主诉
   *@param:
   *@response: 主诉信息有   retrun true
   *@Author: zhml
   *@Date: 2020-09-25 10:50:25
   */
  private async hadZs(value: string) {
    let res  = await checkZsIsExit({ jzlsh: value })
    console.log('res',res);

    if (res.data && res.data.sxzs == 1) return true
    else return false
    // let cc: boolean = false
    // await checkZsIsExit({ jzlsh: value }).then((res: AxiosResponse) => {
    //   if (res.data && res.data.sxzs == 1) {
    //     cc = true
    //   } else {
    //     cc = false
    //   }
    // })
    // return cc
  }

  // 切换列表事件  中间部分
  private async changeTab(value: any) {
    await this.initPatientObj(this.pnParam)
    let cc = await this.hadZs(this.pnParam.jzlsh) // 判断是否有主诉
    console.log(905,cc)
    let dd = await this.getStatus()
    if (value.index > 0 && !cc && this.btnValue != '在线诊疗' && this.btnValue != '就诊历史' && this.btnValue != '预约查询') {
      this.$notify.warning('请先录入主诉')
      this.$nextTick(() => {
        this.btnValue = '病历首页'
      })
      return
    } else if (this.isDiagnosis == false && value.index < 6 && this.btnValue != '诊断' && this.btnValue != '病历首页' && this.btnValue != '在线诊疗' && this.btnValue != '预约查询') {
      this.$notify({
        type: 'warning',
        title: '请先录入诊断',
        message: '',
      })
      this.$nextTick(() => {
        this.btnValue = '诊断'
      })
      return
    }
    console.log('921',value)

    // 判断发药药房是否维护
    if (this.btnValue == '处方') {
      // 通过挂号科室查询药房
      aGetYfsb({pkey: Vue.prototype.AUTHORITY.bussinessRole}).then((res: any)=> {
        if(!res.data || !res.data.cy || !res.data.xy || !res.data.zy) {
          this.$alert('发药药房未维护，请先维护发药药房','提示',{
          confirmButtonText: '确定',
          type: 'warning',
          callback: (action)=> {
            this.$router.push({
              path: '/pharmacySet'
            })
          }
          })
        }
      })
    }

    // if (value.index < 5 && value.index > 0) this.$destroy()
    // 诊断序号是1    长度变短
    if ((value as any).index == 1) {
      if (this.tabWidth == '23') {
        ;(document.getElementsByClassName('his-expand')[0].firstChild as any).style.width = 'calc(97.8333333333% - 10px)'
      } else if (this.tabWidth == '16') {
        ;(document.getElementsByClassName('his-expand')[0].firstChild as any).style.width = 'calc(75% - 10px)'
      }
    } else {
      ;(document.getElementsByClassName('his-expand')[0].firstChild as any).style.width = '100%'
    }
  }

  private changeStyle(value: string) {
    this.tabWidth = value
    if (this.tabWidth == '23') {
      ;(document.getElementsByClassName('his-expand')[0].firstChild as any).style.width = 'calc(97.8333333333% - 10px)'
    } else if (this.tabWidth == '16') {
      ;(document.getElementsByClassName('his-expand')[0].firstChild as any).style.width = 'calc(75% - 10px)'
    }
  }

  // 载入诊疗方案
  private loadTreamentPlan(data: any) {
    // 病历模板
    // this.childMsg(data.gyBlmb)
    // 诊断
    // this.pnParam.types = 2
    // this.initPatientObj(this.pnParam)
    // 处方
    // setTimeout(() => {
    //   this.pnParam.types = 3
    //   this.initPatientObj(this.pnParam)
    // }, 0)
    // this.openTab('home')
  }

  // 鼠标移入事件
  private enter() {
    this.leftSide = false
  }

  private leave() {
    this.leftSide = true
  }

  private getSymbol(symbol: string) {
    this.btnValue = '病历首页'
    this.$nextTick(() => {
      ;(this.$refs.home as any)[0].addSymbol(symbol)
    })
  }
  // 树节点收起事件 
  private nodecollapseData(val: any , res: any) {
    this.$nextTick(()=>{
      if(val.ctlId && val.emrType && val.childrenList.length != 0 && res.expanded == false ) {
        val.childrenList = []
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.content {
  display: flex;
}

.frame {
  width: 100%;
  overflow: hidden;
}

.hide-scroll {
  overflow: hidden !important;
}

.actives {
  position: absolute;
  top: 0;
  width: 232px;
  z-index: 200;
  padding: 8px 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 20px 20px 20px 0px rgba(0, 0, 0, 0.1);
}

.title {
  padding-right: 10px !important;
}

.special {
  .content {
    padding: 0 !important;
  }
}

::v-deep .el-input__inner {
  width: 100% !important;
}

.big-width {
  width: calc(100% - 172px);
}

.small-width {
  width: calc(100% - 34px);
}

::v-deep .el-tabs {
  width: 100%;

  .el-tabs__content {
    overflow: visible;
  }
}

.actives {
  .row {
    height: 34px;
    padding: 6px 0 8px 0;
  }
}

.his-module {
  margin-right: 10px;
  padding: 8px;
  overflow-y: auto;

  .open {
    display: flex !important;
    justify-content: center;
    padding-top: 8px;
  }

  .title-more {
    color: rgba(20, 133, 255, 1);
    font-size: 13px;

    span {
      font-size: 13px !important;
    }
  }

  .home-row {
    display: flex;
    flex-flow: row nowrap;
    padding: 10px 0 10px 10px;
  }

  .header-row {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    padding-bottom: 8px;

    .label {
      font-size: 13px;
      align-self: center;
      margin-right: 8px;
    }

    .row-input {
      height: 28px;
      background: rgba(245, 246, 248, 1);
      border-radius: 4px;
      margin-right: 6px;

      ::v-deep .el-input__inner {
        width: 108px;
        height: 28px;
        background: rgba(245, 246, 248, 1);
        border-radius: 4px;
        margin-right: 6px;
        border: none;
      }
    }

    .el-button--primary {
      padding: 0px;
      width: 48px;
      height: 24px;
      border-radius: 4px;
      justify-content: center;
      margin-top: 3px;
    }
  }
}

.right-side {
  width: calc(100% - 34px);
  border-radius: 8px;
  //   上方模块

  .main-bottom {
    display: flex;
    flex-flow: row nowrap;
    margin-top: 10px;
    width: 100%;

    .his-module {
      /*padding: 6px 10px !important;*/

      .row {
        height: 34px;
        padding-bottom: 0;

        .label {
          height: 34px !important;
          padding-bottom: 3px;
        }
      }
    }
  }

  // 中间
  .main-width1 {
    width: calc(100% - 34px);
  }

  .main-width2 {
    width: calc(100% - 174px);
  }

  .main-middle {
    display: flex;
    flex-direction: column;

    ::v-deep .el-tabs__header {
      margin-bottom: 8px;
      background: #fff;
      border-radius: 8px;
      padding: 6px 0 6px 10px;
    }

    .btn-child {
      display: flex;
      flex-flow: row nowrap;
      border-bottom: 1px solid #f0f0f0;
      padding: 0 0 0 16px;

      .middle-btn {
        display: flex;
        flex-flow: row nowrap;

        span {
          margin-right: 24px;
          margin-top: 16px;

          &.actived-btn {
            color: #1485ff;
            border-bottom: 2px solid #1485ff;
            padding-bottom: 8px;
          }
        }
      }
    }

    .choose-style {
      display: flex;
      flex-flow: row nowrap;
      padding-left: 16px;

      .middle-btn {
        display: flex;
        flex-flow: row nowrap;
        padding: 10px 0;

        span {
          margin-right: 10px;

          &.actived-btn {
            color: #1485ff;
            border-bottom: 2px solid #1485ff;
            padding-bottom: 10px;
          }
        }
      }
    }
  }
}

.tab-row {
  display: flex;
  flex-flow: row nowrap;
  /*border-bottom: 1px solid #f0f0f0;*/
  .btn {
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 6px;

    .el-divider {
      margin: 0 5px !important;
    }
  }
}

.box-mar {
  margin-right: 10px;

  ::v-deep .el-checkbox__label {
    padding-left: 4px;
  }

  ::v-deep .el-radio__label {
    padding-left: 4px;
  }
}

.el-tab {
  display: flex;
  flex-flow: row nowrap;
  margin-bottom: 8px;
  width: 100%;

  .btn {
    width: 33.333%;
    height: 28px;
    background: linear-gradient(149deg, rgba(255, 255, 255, 1) 0%, rgba(244, 244, 244, 1) 100%);
    border-radius: 4px 4px 0px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    margin-right: 2px;

    &.actived {
      color: #fff;
      background: linear-gradient(315deg, rgba(45, 187, 255, 1) 0%, rgba(20, 133, 255, 1) 100%);
    }
  }
}

::v-deep .his-patient-btn {
  height: 28px !important;
  margin-top: 0 !important;
}

::v-deep .his-patient-tab {
  .el-tabs__header {
    width: 100%;
    margin-bottom: 8px !important;

    .el-tabs__nav-wrap is-top {
      height: 28px;
    }
  }
}

// 树形结构
.his-patient-tree {
  overflow: hidden;
}

::v-deep .el-tree-node__expand-icon {
  padding: 0 2px 0 0 !important;
  color: #6a6d78;
}

::v-deep .el-tree {
  margin-top: 6px !important;
  overflow: auto;
  height: 100%;

  span {
    font-size: 13px;
  }

  .icon {
    margin: 0 2px 0 2px;
    font-size: 14px;
    color: #6a6d78;
  }

  .el-tree-node__content {
    margin-bottom: 0;
    height: 22px;
  }

  .el-tree-node__content:hover {
    background-color: rgba($color: $blue, $alpha: 0.1);
    border-radius: 4px;
  }

  .el-tree-node:focus > .el-tree-node__content {
    background-color: rgba($color: $blue, $alpha: 0.1);
  }

  .custom-tree-node {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
      text-overflow: inherit;
      white-space: normal;
    }
  }
}

// 上面一行，下面两列的布局样式
.module {
  width: 100%;
  height: 100%;

  .line {
    background: #fff;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    align-content: center;

    span {
      width: 80px;
    }
  }

  .two-list {
    display: flex;
    flex-flow: row nowrap;
    margin-top: 10px;
    width: 100%;

    .left-list,
    .right-list {
      background: #fff;
      border-radius: 8px;
      width: calc(50% - 5px);
    }
  }
}
</style>
