<template>
  <div class="content ht">
    <el-row class="ht" :gutter="10" style="width: calc(100% + 5px)" v-show="true">
      <el-col class="ht" :span="16">
        <div class="his-module his-small ht">
          <div class="row">
            <div class="label">
              <div class="querySearch">
                <div class="searchTitle no-warp" style="padding-right: 2px">入院申请单</div>
              </div>
              <div class="btn">
                <el-divider direction="vertical"></el-divider>
                <el-button size="mini" type="text" @click="getLists"> <i class="icon his-btn-refresh"></i>刷新 </el-button>
                <el-button size="mini" type="text" @click="handleAdd"> <i class="icon his-btn-add green"></i>新增 </el-button>
                <el-button size="mini" type="text" @click="handlePrint" :disabled="!(this.SQZT==2)"> <i class="icon his-btn-print"></i>打印 </el-button>
                <el-button size="mini" type="text" @click="handleSubmit(DJID)" :disabled="this.SQZT==2 || this.tableData.length==0"> <i class="icon his-btn-print"></i>提交并打印</el-button>
                <el-button size="mini" type="text" @click="handleCancle(DJID,SQZT)" :disabled="!(this.SQZT==2)"> <i class="icon his-btn-print"></i>取消提交 </el-button>
              </div>
            </div>
          </div>
          <pagenation-list ref="pageTable" v-model="tableData" data-url="/op-service/mzzydj/getHospitalizedRegisterList" :search-data="searchData" http-method="post" :list-height="listSlotHeight">
            <el-table slot="list" stripe ref="table" :highlight-current-row="true" :data="tableFormat" @row-click="handleEdit" :row-class-name="tableRowClassName" border v-loading="loading" :height="listSlotHeight+124" class="scroll-bar" tooltip-effect="light">
              <!-- 序号 -->
              <el-table-column prop="webSortNumber" width="32"></el-table-column>

              <!-- 患者姓名 -->
              <el-table-column :label="'患者姓名'" prop="brxm"></el-table-column>

              <!-- 开单日期 -->
              <el-table-column :label="'开单日期'" prop="kdrq" width="90">
                <template slot-scope="scope">
                  <span>{{ scope.row.kdrq | dateYMD }}</span>
                </template>
              </el-table-column>

              <!-- 诊断 -->
              <el-table-column :label="'诊断'" min-width="100" prop="brzd" show-overflow-tooltip></el-table-column>
              <!-- 状态 -->
              <el-table-column :label="'状态'" width="70" prop="sqzt">
                <template slot-scope="scope">
                  <span :class="scope.row.sqzt | filterColor">{{ scope.row.sqzt | filterStatus }}</span>
                </template>
              </el-table-column>

              <!-- 联系人 -->
              <el-table-column :label="'联系人'" min-width="60" prop="lxrm" show-overflow-tooltip></el-table-column>

              <!-- 联系地址 -->
              <el-table-column :label="'联系地址'" min-width="70" :show-overflow-tooltip="true" prop="lxdz"></el-table-column>

              <!-- 联系电话 -->
              <el-table-column :label="'联系电话'" width="90" prop="lxdh"></el-table-column>

              <!-- 登记类型 -->
              <el-table-column :label="'登记类型'" :show-overflow-tooltip="true" prop="djlx" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.djlx | filterDjlx }}</span>
                </template>
              </el-table-column>

              <!-- 拟收治科室 -->
              <el-table-column :label="'住院科室'" width="90" prop="nszks">
                <template slot-scope="scope">
                  <div>{{ wordList.find(item => item.dv == scope.row.nszks) && wordList.find(item => item.dv == scope.row.nszks).dn }}</div>
                </template>
              </el-table-column>
              <!-- 拟收治病区 -->
              <el-table-column :label="'拟住院病区'" width="90" prop="nszbq">
                <template slot-scope="scope">
                  <div>{{ inpatientList.find(item => item.dv == scope.row.nszbq) && inpatientList.find(item => item.dv == scope.row.nszbq).dn }}</div>
                </template>
              </el-table-column>
              <!-- 入院主要目的 -->
              <el-table-column :label="'入院主要目的'" width="100" prop="rymdName"></el-table-column>
              <!-- 预缴费用 -->
              <el-table-column label="预缴费用" width="70" prop="yjfy"></el-table-column>
              <!-- 特需 -->
              <el-table-column :label="'特需'" width="60" prop="txbz">
                <template slot-scope="scope">
                  <span>{{ scope.row.txbz | trueOrFalse }}</span>
                </template>
              </el-table-column>
              <!-- 血透减负标志 -->
              <el-table-column :label="'血透减负标志'" width="100" prop="dbjfbz">
                <template slot-scope="scope">
                  <span>{{ scope.row.dbjfbz | trueOrFalse }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('common.action')" width="52" align="center" fixed="right">
                <template slot-scope="scope">
                  <!-- <el-tooltip :content="$t('loadData.submitPw')" effect="light">
                    提交
                    <el-button class="blue" @click.stop="handleSubmit(scope.row)">
                      <i class="icon his-confirm green" />
                    </el-button>
                  </el-tooltip> -->
                  <!-- <el-tooltip :content="$t('common.cancel')" effect="light">
                    取消
                    <el-button class="blue" @click.stop="handleCancle(scope.row)">
                      <i class="icon his-caozuo-cancel" />
                    </el-button>
                  </el-tooltip> -->
                  <el-tooltip :content="$t('common.delete')" effect="light">
                    <el-popconfirm :title="'确认删除？'" :confirmButtonText="$t('common.confirm')" :cancelButtonText="$t('common.cancel')" @confirm="delDept(scope.row)" hideIcon class="ml10">
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
      <el-col class="ht" :span="8" style="padding-right: 0px">
        <div class="his-module his-small">
          <div slot="header" class="row">
            <div class="label">
              <h1 class="title">{{ rightTitle }}</h1>
            </div>
            <div class="operate">
              <el-button type="primary" size="mini" class="green-gra" icon="icon his-save" @click="handleSave">{{ $t('common.save') }} </el-button>
            </div>
          </div>
          <div class="normal-form-wrap scroll-bar">
            <el-form ref="formData" :model="formData" :rules="formRule" label-width="86px" class="clearfix">
              <!-- 就诊卡号搜索 -->
              <el-form-item label="就诊卡号" prop="cardno">
                <div style="display: flex;justify-content: flex-start">
                  <el-input 
                    placeholder="请输入" 
                    v-model="formData.cardno"
                    ref="jzkhRef"
                    @keyup.enter.native="queryPatientInfo(formData.cardno)"
                  ></el-input>
                  <el-button type="primary" class="his-patient-btn" size="mini" @click="getCardInfo">读卡</el-button>
                </div>
              </el-form-item>
              <el-form-item label="患者姓名" prop="brxm" disabled>
                <el-input placeholder="请输入" v-model="formData.brxm" disabled></el-input>
              </el-form-item>
              <!-- 联系人 -->
              <el-form-item :label="'联系人'" prop="lxrm">
                <el-input :placeholder="'请输入联系人'" v-model="formData.lxrm"></el-input>
              </el-form-item>

              <!-- 与联系人关系 -->
              <el-form-item :label="'与患者关系'" prop="lxrgx">
                <el-select class="w100" v-model="formData.lxrgx" placeholder="请选择">
                  <el-option v-for="(item,index) in relationshipList" :key="index" :label="item.dn" :value="item.dv"></el-option>
                </el-select>
              </el-form-item>

              <!-- 联系地址 -->
              <el-form-item :label="'联系人地址'" prop="lxdz">
                <el-input :placeholder="'请输入联系人地址'" v-model="formData.lxdz"></el-input>
              </el-form-item>

              <!-- 联系电话 -->
              <el-form-item :label="'联系人电话'" prop="lxdh">
                <el-input :placeholder="'请输入联系人电话'" v-model="formData.lxdh"></el-input>
              </el-form-item>

              <!-- 入院诊断 -->
              <el-form-item :label="'入院诊断'" prop="brzd">
                <remote-search-select
                  searchUrl="/system-service/dicjbbm/westQueryPage"
                  :resultTableHeader="resultHeader"
                  :popover-width="400"
                  :searchData="{
                    pydm: '',
                  }"
                  searchField="pydm"
                  showLabel="jbmc"
                  data-type="0"
                  ref="searchXyzd"
                  v-model="formData.brzd"
                  @getData="getData"
                >
                  <el-select
                    v-model="formData.brzd"
                    ref="select"
                    class="search-select"
                    remote
                    filterable
                    :popper-append-to-body="false"
                    :remote-method="
                      (query) => {
                        remoteMethod(query)
                      }
                    "
                    :clearable="true"
                    @blur="closePop('searchXyzd')"
                  >
                  </el-select>
                </remote-search-select>
              </el-form-item>

              <!-- 登记类型 -->
              <el-form-item :label="'登记类型'" prop="djlx">
                <el-select v-model="formData.djlx">
                  <el-option v-for="(item,index) in options" :value="item.id" :label="item.name" :key="index"></el-option>
                </el-select>
              </el-form-item>

              <!-- 住院科室-->
              <el-form-item :label="'住院科室'" prop="nszks">
                <el-select class="w100" v-model="formData.nszks" filterable :placeholder="$t('请选择科室')">
                  <el-option v-for="(item,index) in wordList" :key="index" :label="item.dn" :value="item.dv"></el-option>
                </el-select>
              </el-form-item>

              <!-- 拟住院病区-->
              <el-form-item :label="'拟住院病区'" prop="nszbq">
                <el-select class="w100" v-model="formData.nszbq" filterable :placeholder="$t('请选择病区')">
                  <el-option v-for="(item,index) in inpatientList" :key="index" :label="item.dn" :value="item.dv"></el-option>
                </el-select>
              </el-form-item>

              <!-- 住院主要目的 -->
              <el-form-item :label="'住院目的'" prop="rymd">
                <el-select v-model="formData.rymd">
                  <el-option v-for="(item,index) in aimList" :key="index" :value="item.dv" :label="item.dn"></el-option>
                </el-select>
              </el-form-item>

              <!-- 预缴费用 -->
              <el-form-item label="预缴费用" prop="yjfy">
                <el-input v-model="formData.yjfy" placeholder="请输入" type="number"></el-input>
              </el-form-item>

              <!-- 特需 -->
              <el-form-item :label="'特需'" prop="txbz">
                <el-checkbox v-model="txbz"></el-checkbox>
              </el-form-item>

              <!-- 血透减负标志 -->
              <el-form-item :label="'血透减负标志'" prop="dbjfbz">
                <el-checkbox v-model="dbjfbz"></el-checkbox>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--	关于打印	-->
    <div class="statement-box" v-show="false">
      <statement
        ref="statement"
        :html-api="'/op-service/mzzydj/zydjPrint'"
        :html-search-data="htmlSearchData"
        :height="listSlotHeight + 26"
        :print-arg="{
          top: '8%',
          left: '10%',
          width: '90%',
          height: '87%',
        }"
      />
    </div>

    <!-- 入院申请单打印 -->
    <div id="rysqd" style="width: 210mm;margin: 0 auto" v-show="false">
      <div style="display: flex; width: 100%; height: auto; margin: 0 auto; justify-content: space-between; padding-left: 1mm; padding-right: 1mm; border-bottom: 1px solid #000">
        <img id="imgInit" src="" style="width: 200px; height: 30px; margin-bottom: 4px" />
        <span style="color: #6a6d78; height: 13px; margin-top: 17px; margin-right: 40px">YW-BD-0190-002</span>
      </div>
      <div style="">
        <div style="font-size: 24px;text-align: center;margin:5px 0 15px;">{{ryzPrintData.jgmc}}入院证</div>
        <div style="display: flex;justify-content: space-between;font-size: 14px;margin-bottom: 10px">
          <div style="display: flex; justify-content: flex-start"><p style="margin: 0">科室：</p><p style="margin: 0 0 0 5px">{{ryzPrintData.mzksmc}}</p></div>
          <div style="display: flex; justify-content: flex-start"><p style="margin: 0">卡号：</p><p style="margin: 0 0px 0 5px">{{ryzPrintData.jzkh}}</p></div>
          <div style="display: flex; justify-content: flex-start"><p style="margin: 0">登记日期：</p><p style="margin: 0 0 0 5px">{{ryzPrintData.djrq}}</p></div>
        </div>
        <table border="1" cellpadding="0" style="border-collapse:collapse;border: 1px solid #000;width: 100%;font-size: 14px">
          <tr style="">
            <td style="height: 35px;line-height: 35px;text-align: center;border: 1px solid #000;width: 80px">姓名</td>
            <td style="height: 35px;line-height: 35px;text-align: center;border: 1px solid #000;width: 90px">{{ryzPrintData.hzxm}}</td>
            <td style="height: 35px;line-height: 35px;text-align: center;border: 1px solid #000;width: 70px">性别</td>
            <td style="height: 35px;line-height: 35px;text-align: center;border: 1px solid #000;width: 75px">{{ryzPrintData.xb}}</td>
            <td style="height: 35px;line-height: 35px;text-align: center;border: 1px solid #000;width: 80px">年龄</td>
            <td style="height: 35px;line-height: 35px;text-align: center;border: 1px solid #000;width: 90px">{{ryzPrintData.nl}}</td>
            <td style="height: 35px;line-height: 35px;text-align: center;border: 1px solid #000;width: 80px">门诊号</td>
            <td style="height: 35px;line-height: 35px;text-align: center;border: 1px solid #000;width: 110px">{{ryzPrintData.mzh}}</td>
          </tr>
          <tr style="">
            <td style="height: 35px;line-height: 35px;text-align: center;border: 1px solid #000">出生日期</td>
            <td style="height: 35px;line-height: 35px;text-align: center;border: 1px solid #000">{{ryzPrintData.csrq}}</td>
            <td style="height: 35px;line-height: 35px;text-align: center;border: 1px solid #000">身份证</td>
            <td style="height: 35px;line-height: 35px;text-align: center;border: 1px solid #000" colspan="3">{{ryzPrintData.sfzh}}</td>
            <td style="height: 35px;line-height: 35px;text-align: center;border: 1px solid #000">医保/自费</td>
            <td style="height: 35px;line-height: 35px;text-align: center;border: 1px solid #000">{{ryzPrintData.brxz}}</td>
          </tr>
          <tr>
            <td style="height: 35px;line-height: 35px;border: 1px solid #000;text-align: center">住址</td>
            <td style="height: 35px;line-height: 35px;padding-left: 5px;border: 1px solid #000;" colspan="7">{{ryzPrintData.zz}}</td>
          </tr>
          <tr>
            <td style="height: 35px;border:1px solid #000;line-height: 15px;padding: 0 18px;" rowspan="2">门/急诊诊断</td>
            <td style="height: 35px;border:1px solid #000;line-height: 35px;padding-left: 5px;" colspan="7">{{ryzPrintData.mjzzd}}</td>
          </tr>
          <tr>
            <td style="height: 35px;border: 1px solid #000;line-height: 35px;padding-left: 5px;" colspan="7"></td>
          </tr>
          <tr>
            <td style="height: 35px; border: 1px solid #000;line-height: 35px;text-align: center">拟入院病区</td>
            <td style="height: 35px; border: 1px solid #000;line-height: 35px;text-align: center" colspan="2">{{ryzPrintData.nrybq}}</td>
            <td style="height: 35px; border: 1px solid #000;line-height: 35px;text-align: center">拟入院科别</td>
            <td style="height: 35px; border: 1px solid #000;line-height: 35px;text-align: center" colspan="2">{{ryzPrintData.nrykb}}</td>
            <td style="height: 35px; border: 1px solid #000;line-height: 35px;text-align: center">预缴费用</td>
            <td style="height: 35px; border: 1px solid #000;line-height: 35px;text-align: center">{{ryzPrintData.yjfy}}</td>
          </tr>
          <tr>
            <td style="height: 35px;border: 1px solid #000;line-height: 35px;text-align: center">联系人</td>
            <td style="height: 35px;border: 1px solid #000;line-height: 35px;text-align: center">{{ryzPrintData.lxr}}</td>
            <td style="height: 35px;border: 1px solid #000;line-height: 35px;text-align: center">与患者关系</td>
            <td style="height: 35px;border: 1px solid #000;line-height: 35px;text-align: center">{{ryzPrintData.lxrgx}}</td>
            <td style="height: 35px;border: 1px solid #000;line-height: 35px;text-align: center">电话</td>
            <td style="height: 35px;border: 1px solid #000;line-height: 35px;text-align: center">{{ryzPrintData.lxdh}}</td>
            <td style="height: 35px;border: 1px solid #000;line-height: 35px;text-align: center">医生姓名</td>
            <td style="height: 35px;border: 1px solid #000;line-height: 35px;text-align: center">{{ryzPrintData.ysxm}}</td>
          </tr>
          <tr>
            <td style="height: 35px;border: 1px solid #000;line-height: 35px;text-align: center">备注</td><!-- 加过滤器-->
            <td style="height: 35px;border: 1px solid #000;line-height: 35px;padding-left: 5px;" colspan="7">{{ryzPrintData.bz}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { add, edit, deleteById, updateStatus, printModel, queryLogo, getCardInfo, queryPatientInfo } from '@/api/cis/op/dctwork/registerationForm'
import { id2Name } from '@/utils'
import { getLodop } from '@/plugins/lodop/index.js'
import { regPhone, regPhoneTel } from '@/utils/validate'
export const NFormData = {
  brid: '',
  brxb: '',
  brxm: '',
  brzd: '',
  cardno: '',
  dbjfbz: '',
  djlx: '0',
  kdrq: '',
  lxdh: '',
  lxdz: '',
  lxrm: '',
  mzks: '',
  mzys: '',
  nszbq: '', // 默认病区
  nszks: '',
  lxrgx: '',
  rymd: '',
  sqzt: '1',
  txbz: '',
  zzd: '',
  yjfy: '',
  zzdicd10: '',
}

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'admisCertificate',
  filters: {
    filterDjlx(value: string) {
      switch (value) {
        case '0':
          return '门诊当天入院'
        case '1':
          return '门诊当天登记(入院时间等通知)'
        case '2':
          return '急诊当天入院'
      }
    },
    filterStatus(value: string) {
      switch (value) {
        case '1':
          return '新申请'
        case '2':
          return '已提交'
        case '3':
          return '已入院'
      }
    },
    filterColor(value: string) {
      switch (value) {
        case '1':
          return 'blues'
        case '2':
          return 'greens'
        case '3':
          return 'reds'
      }
    },
    filterBz(value: string) {
      switch (value) {
        case '0':
          return '入院待查'
        case '1':
          return '手术治疗'
        case '2': 
          return '药物治疗'
        case '3': 
          return '化疗'
        case '4':
          return '复查'
        case '5':
          return '体检'
        case '6':
          return '放疗'
        case '7':
          return '睡眠呼吸治疗'
      }
    }
  },
})
export default class extends Vue {
  private pnParam: any = {}
  private tableData: any[] = [] // 表格数据
  private searchData: any = {
    mzhm: '',
    sqlx: '1',
    jzlsh: '1',
    pageNum: 1,
    pageSize: 20,
  } // 搜索参数
  private listSlotHeight: number = 0
  private loading: boolean = true
  private rightTitle: string = window.ele.$i18n.t('common.add')
  private formData: any = Object.assign({}, NFormData) // 表单数据
  private formRule: any = {
    brzd: [{ required: true, message: '请填写入院诊断', trigger: 'change' }],
    lxdh: [
      { required: true, message: '请输入联系电话', trigger: 'blur' },
      { pattern: regPhoneTel, message: window.ele.$i18n.t('emp.vdPhone'), trigger: 'blur' },
    ],
    nszbq: [{ required: true, message: '请选择病区', trigger: 'change' }],
    nszks: [{ required: true, message: '请选择科室', trigger: 'change' }],
    rymd: [{ required: true, message: '请选择住院目的', trigger: 'change' }],
  } // 表单验证
  private isAdd: boolean = true
  private dbjfbz: boolean = false
  private txbz: boolean = false
  private wordList: Array<any> = [] // 住院科室数组
  private inpatientList: Array<any> = [] // 住院病区数组
  private relationshipList: Array<any> = [] // 与患者关系数组
  private SQZT: any = '' // 申请状态
  private htmlSearchData: any = {}
  private rowIndex: number = -1
  private DJID: number | null = null // 登记id
  private loGo: any = '' // 医院logo
  private mjcfData: any = {} // 麻精一身份证明提交
  private aimList: Array<any> = [] // 住院目的
  private resultHeader = [
    {
      prop: 'jbmc',
      label: '诊断名称',
    },
    {
      width: 120,
      prop: 'icdCode',
      label: 'ICD编码',
    },
  ]
  //数据交互
  private tableRowClassName({ row, rowIndex }: any) {
    row.index = rowIndex
  }
  private ryzPrintData: any = {
    jgmc: '',
    mzksmc: '',
    jzkh: '',
    djrq: '',
    hzxm: '',
    xb: '',
    nl: '',
    mzh: '',
    csrq: '',
    sfzh: '',
    brxz: '',
    zz: '',
    mjzzd: '',
    nrybq: '',
    nrykb: '',
    yjfy: '',
    lxr: '',
    lxrgx: '',
    lxdh: '',
    ysxm: '',
    bz: '',
  } // 入院登记证打印数据
  // 登记类型
  private options: Array<any> = [
    {
      id: '0',
      name: '门诊当天入院',
    },
    {
      id: '1',
      name: '门诊当天登记(入院时间等通知)',
    },
    {
      id: '2',
      name: '急诊当天入院',
    },
  ]




  public setValue(value: string) {
    this.setValue(value)
  }

  public getValue() {
    return null
  }

  get tableFormat() {
    const tabledata = this.tableData
    id2Name(tabledata, 'nszbq', 'nszbqName', this.wordList, 'dv', 'dn')
    id2Name(tabledata, 'nszks', 'nszksName', this.inpatientList, 'dv', 'dn')
    id2Name(tabledata, 'rymd', 'rymdName', this.aimList, 'dv', 'dn')
    return tabledata
  }

  // 获取机构数据
  get userInfo() {
    return JSON.parse(localStorage.userInfo)
  }

  //监听方法
  @Watch('tableData')
  private onValueChange(value: string) {
    this.loading = false
    console.log(this.tableData)
    this.SQZT = this.tableData.length>0 ? this.tableData[0].sqzt : ''
  }

  //初始化的周期函数
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 222
  }

  mounted() {
    this.pnParam = this.$store.state.pnParam.PN_PARAM
    this.wordList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DEP_CODE_DICT : this.$store.state.webSqlDict.DEP_CODE_DICT // 住院科室
    this.inpatientList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SYS_HOSPITAL_DICT : this.$store.state.webSqlDict.SYS_HOSPITAL_DICT // 住院病区
    this.relationshipList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.JTGXDMB_DICT : this.$store.state.webSqlDict.JTGXDMB_DICT // 与患者关系
    this.aimList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.PURPOSE_ADMISSION_DICT : this.$store.state.webSqlDict.PURPOSE_ADMISSION_DICT // 入院目的
    console.log(483,this.aimList)
    this.getLists()
    this.$nextTick(()=> {
      ;(this.$refs['jzkhRef'] as any).focus() // 页面打开时，就诊卡号输入框默认获取光标
    })
  }

  // 获取医院logo
  private queryPrintLogo() {
    queryLogo(this.userInfo.hospitalId).then((res: any) => {
      this.loGo = res.data
        let a: any = document.getElementById("imgInit")
        a.src = this.loGo
    })
  }

  // 打印入院申请单
  private handlePrint() {
    if(!this.DJID) return this.$message.warning('请选择一条数据')
    this.queryPrintLogo()
    printModel(this.DJID).then((res: any) => {
      this.ryzPrintData = res.data
      if(this.ryzPrintData.bz) {
        this.ryzPrintData.bz = this.aimList.find(item => item.dv == this.ryzPrintData.bz).dn
      }
      this.$nextTick(()=>{
        this.printFn()
      })
    })
  }


  private printFn() {
    if (this.rowIndex == -1) {
      this.$notify.error('请选择入院申请单打印')
      return
    }
    const __qiankun__ = window.__POWERED_BY_QIANKUN__
    var LODOP: any = null
    if (__qiankun__) {
      LODOP = Vue.prototype.$getLodop()
    } else {
      LODOP = getLodop()
    }
    if (LODOP) {
      LODOP.PRINT_INIT()
      LODOP.SET_PRINT_PAGESIZE(1, '210mm', '297mm', 'A4') // 2-打印方向及纸张类型,
      LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true) //宽度超出自动缩放
      var a: any = document.getElementById('rysqd')
      // a.style.zoom=0.85 // 缩放页面，配合LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true)使用
      var op: any = ''
      op = '<body>' + a.innerHTML + '</body>'
      LODOP.ADD_PRINT_HTM('0mm', '10mm', '190mm', '297mm', op) // 尾部
      // LODOP.SET_PRINT_MODE('POS_BASEON_PAPER', true) // 以纸张边缘为基点
      LODOP.PREVIEW() // 预览
      // LODOP.PRINT() // 打印
      // LODOP.PRINT_DESIGN() // 设计
    }
  }

  // 获取列表
  private getLists() {
    this.searchData.jzlsh = '1'
    const pageTable: any = this.$refs['pageTable']
    pageTable.getList()
    
  }

  // 等接口修改
  private getData(data: any) {
    this.formData.brzd = data.jbmc
    this.formData.zzdicd10 = data.icdCode
  }

  // 搜索诊断
  private remoteMethod(query: string) {
    if (query.length > 1) {
      this.$nextTick(() => {
        ;(this.$refs.searchXyzd as any).remoteMethod(query)
      })
    } else {
      ;(this.$refs.searchXyzd as any).closePopover()
    }
  }

  // 失焦关闭搜索弹窗
  private closePop(data: any) {
    ;(this.$refs[data] as any).closePopover()
  }

  private handleEdit(row: any) {
    this.rowIndex = row.index
    this.DJID = row.djid
    this.SQZT = row.sqzt
    this.htmlSearchData.pkey = row.djid
    // if (row.sqzt != 1) {
    //   this.$notify({
    //     type: 'warning',
    //     title: '此状态不可修改',
    //     message: '',
    //   })
    // }
    this.rightTitle = window.ele.$i18n.t('common.edit')
    this.isAdd = false
    this.formData = NFormData
    this.formData = { ...row }
    this.formData.nszbq = parseInt(row.nszbq)
    if (row.txbz == 1) {
      this.txbz = true
    } else if (row.txbz == 0) {
      this.txbz = false
    }
    if (row.dbjfbz == 1) {
      this.dbjfbz = true
    } else if (row.dbjfbz == 0) {
      this.dbjfbz = false
    }
  }

  // 获取详情
  private getDetail(row: any) {
    // this.rightTitle = window.ele.$i18n.t('common.edit')
    // this.isAdd = false
    // // 清空校验结果
    // const formData: any = this.$refs.formData
    // formData.clearValidate()
    // for (let i in this.formData) {
    //   this.formData[i] = row[i]
    // }
  }

  // 条件查询
  private searchLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }

  // 新增按钮
  private handleAdd() {
    this.rightTitle = window.ele.$i18n.t('common.add')
    this.isAdd = true
    
    this.$nextTick(() => {
      const formData: any = this.$refs.formData
      formData.resetFields()
      this.txbz = false
      this.dbjfbz = false
    })
  }

  // 保存按钮
  private handleSave() {
    const formData: any = this.$refs.formData
    if (this.txbz) {
      this.formData.txbz = 1
    } else {
      this.formData.txbz = 0
    }
    if (this.dbjfbz) {
      this.formData.dbjfbz = 1
    } else {
      this.formData.dbjfbz = 0
    }
    this.formData.jzlsh = 1 // 代表未经过挂号收费，直接开入院申请单
    this.$set(this.formData, 'sqlx', '1')
    this.$set(this.formData, 'zzd', this.formData.brzd)
    formData.validate((valid: any) => {
      if (valid) {
        if (this.isAdd) {
          this.formData.sqzt = 1
          add(this.formData).then(() => {
            this.$notify({
              type: 'success',
              title: '新增成功',
              message: '',
            })
            this.getLists()
            this.handleAdd()
          })
        } else {
          if (this.formData.sqzt == 2) {
            this.$message.warning('该单据已提交，请先取消提交后修改')
            return
          } else if (this.formData.sqzt == 3) {
            this.$message.warning('该单据已到住院状态，不允许修改')
            return
          }
          edit(this.formData).then(() => {
            this.$notify({
              type: 'success',
              title: '修改成功',
              message: '',
            })
            this.getLists()
          })
        }
      }
    })
  }

  private delDept(row: any) {
    if (row.sqzt == 2) {
      this.$message.warning('请先取消提交后删除')
      return
    } else if (row.sqzt == 3) {
      this.$message.warning('已入院不允许删除')
      return
    }
    deleteById({ djid: row.djid }).then(() => {
      this.$notify({
        type: 'success',
        title: '删除成功',
        message: '',
      })
      this.handleAdd()
      this.getLists()
    })
  }

  /**
   * @Description: update 状态
   * @author: zhml
   * @param {type}:
   * @return:
   * @date 2020/7/1
   */
  private handleSubmit(row: any,zt: any) {
    if(!row) return this.$message.warning('请选择一条数据')
    let param = {
      djid: row,
      sqzt: 2,
    }
    if (zt == 2) {
      this.$notify({
        type: 'warning',
        title: '该单据已提交',
        message: '',
      })
    } else {
      updateStatus(param).then(() => {
        this.$notify({
          type: 'success',
          title: '已提交',
          message: '',
        })
        this.getLists()
        this.handlePrint()
      })
    }
  }

  /**
   * @Description:  update 状态
   * @author: zhml
   * @param {type}:
   * @return:
   * @date 2020/7/1
   */
  private handleCancle(row: any,zt: any) {
    console.log('800', row)
    if(!row) return this.$message.warning('请选择需要取消的患者！')
    if (zt == 3) {
      this.$notify.warning('已入院不允许取消')
      return
    }
    let param = {
      djid: row,
      sqzt: 1,
    }
    if (zt == 1) {
      this.$notify({
        type: 'warning',
        title: '该单据未提交，无需取消',
        message: '',
      })
    } else {
      updateStatus(param).then(() => {
        this.$notify({
          type: 'success',
          title: '已取消',
          message: '',
        })
        this.getLists()
      })
    }
  }

  // 读取患者卡片信息
  private getCardInfo() {
    const params: any = {
      carddata: this.formData.cardno || ' ',
      cardtype: '1',
    }
    getCardInfo(params).then((res: any)=> {
      this.formData.cardno = res.data.jzkh
      this.queryPatientInfo(res.data.jzkh)
    })
  }

  // 通过卡号获取患者信息
  private queryPatientInfo(val: any) {
    // 获取患者信息
    queryPatientInfo({jzkh: val}).then((res: any) => {
      this.formData.brid = res.data.brid
      this.formData.brxb = res.data.brxb
      this.formData.brxm = res.data.brxm
      this.formData.cardno = val
      this.formData.mzks = Vue.prototype.AUTHORITY.outpatientCode // 门诊科室
      this.formData.mzys = JSON.parse(localStorage.getItem('userInfo') as string).userId
      this.formData.lxrm = res.data.lxrm
      this.formData.lxdz = res.data.lxdz
      this.formData.lxdh = res.data.lxrdh
      this.formData.lxrgx = res.data.lxgx ? res.data.lxgx.toString() : ''
      this.formData.djlx = '0'
    })
  }

}
</script>

<style lang="scss" scoped>
.content {
  padding: 0 !important;

  .row {
    .no-warp {
      margin-top: 2px;
      font-family: siyuanMedium;
    }
  }
}

.normal-form-wrap {
  padding-top: 16px;
  height: calc(100% - 45px);
}

.el-form {
  width: 80% !important;
  margin: 0 auto !important;

  .el-form-item {
    .el-form-item__content {
      margin-left: 0 !important;
    }
    .el-input--medium {
      width: 200px;
    }
    .el-select--medium {
      width: 200px !important;
    }
    .search-select {
      width: 100%;

      ::v-deep .el-select {
        width: 100%;

        .el-input__inner {
          width: 100% !important;
        }
      }
    }
  }
}

.his-patient-btn {
  width: 58px; 
  height: 30px; 
  padding: 10px 14px;
  margin-left: 10px;
}
</style>
