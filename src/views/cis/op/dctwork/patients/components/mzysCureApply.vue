<template>
  <div class="content p0" style="width: 100%;">
    <div class="his-small his-module" style="width: 100%;">
      <pagenation-list ref="sqlbList" v-model="tableDatas" data-url="/mtdms-service/zlsqdzb/queryPage" http-method="post" :list-height="listSlotHeight" :searchData="searchData" style="width: 100%;">
        <div slot="header" class="row">
          <div class="label">
            <div class="title">治疗申请列表</div>
            <el-divider direction="vertical"></el-divider>
            <div class="querySearch mr8">
              <div class="searchTitle">申请日期</div>
              <div class="w220">
                <el-date-picker class="date-wrapper" type="daterange" v-model="date" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable></el-date-picker>
              </div>
            </div>
            <div class="querySearch mr8">
              <el-checkbox v-model="checked" @change="getData">显示作废</el-checkbox>
            </div>
            <div class="btn">
              <el-divider direction="vertical" class="mr4"></el-divider>
              <el-button size="mini" type="text" @click="getData">
                <i class="icon his-caozuo_search"></i>
                <span>搜索</span>
              </el-button>
              <el-button size="mini" type="text" @click="open()">
                <i class="icon his-btn-add green"></i>
                {{ $t('common.add') }}
              </el-button>
            </div>
          </div>
        </div>
        <el-table :data="tableDatas" border stripe style="width: 100%;" :highlight-current-row="true" slot="list" :height="listSlotHeight - 228" class="scroll-bar">
          <el-table-column prop="webSortNumber" align="center" width="32"></el-table-column>
          <el-table-column prop="sqsj" :label="'申请日期'" :show-overflow-tooltip="true" min-width="80">
            <template slot-scope="scope">{{ scope.row.sqsj.split(' ')[0] }}</template>
          </el-table-column>
          <!-- <el-table-column prop="sqrq" :label="'就诊类型'" min-width="80"></el-table-column> -->
          <!-- <el-table-column prop="sqrq" :label="'门诊号'" min-width="80"></el-table-column>
          <el-table-column prop="sqrq" :label="'住院号'" min-width="80"></el-table-column>
          <el-table-column prop="sqrq" :label="'姓名'" min-width="60"></el-table-column>
          <el-table-column prop="sqrq" :label="'性别'" min-width="40"></el-table-column>
          <el-table-column prop="sqrq" :label="'年龄'" min-width="40"></el-table-column>-->
          <el-table-column prop="zlxmmc" :show-overflow-tooltip="true" :label="'申请项目'" min-width="80"></el-table-column>
          <el-table-column prop="zlksdm" :show-overflow-tooltip="true" :label="'治疗科室'" min-width="80">
            <template slot-scope="scope">
              <div>
                {{zlksList.find(item => item.dv == scope.row.zlksdm) && zlksList.find(item => item.dv == scope.row.zlksdm).dn}}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="'状态'" width="80">
            <template slot-scope="scope">
              <span :class="scope.row.zt | ztColor">{{ scope.row.zt | zt2zh }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ksdm" :label="'申请科室'" min-width="80">
            <template slot-scope="scope">{{ mzksList.find((item) => item.dv == scope.row.ksdm) && mzksList.find((item) => item.dv == scope.row.ksdm).dn }}</template>
          </el-table-column>
          <el-table-column prop="sqysgh" :label="'申请医生'" min-width="80">
            <template slot-scope="scope">
              {{ allDoctor.find((item) => item.dv == scope.row.sqysgh) && allDoctor.find((item) => item.dv == scope.row.sqysgh).dn }}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="fphm" :label="'发票号码'" min-width="80"></el-table-column> -->
          <el-table-column prop="jssj" :label="'接收日期'" min-width="80"></el-table-column>
          <el-table-column prop="jsgh" :label="'接收医生'" min-width="80">
            <template slot-scope="scope">
              {{ allDoctor.find((item) => item.dv == scope.row.jsgh) && allDoctor.find((item) => item.dv == scope.row.jsgh).dn }}
            </template>
          </el-table-column>
          <el-table-column :label="'收费状态'" width="80">
            <template slot-scope="scope">
              <span :class="[scope.row.sfzt == '已收费' ? 'greens' : scope.row.sfzt == '未收费' ?  'blue' : 'reds']">{{ scope.row.sfzt}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.actions')" width="45" align="center" class-name="action-btns">
            <template slot-scope="scope">
              <!-- <el-tooltip effect="light" content="修改">
                <el-button
                  class="blue"
                  :disabled="scope.row.zf == '1'"
                  @click="editCureApply(scope.row)"
                >
                  <i class="icon his-edit"></i>
                </el-button>
              </el-tooltip>-->
              <el-tooltip content="删除" effect="light">
                <el-popconfirm hideIcon :cancelButtonText="$t('common.cancel')" :confirmButtonText="$t('common.confirm')" :title="'确定删除吗?'" :disabled="scope.row.zt != '0'" @confirm="zfZlSQ(scope.row.jlxh)">
                  <el-button slot="reference" class="red" :disabled="scope.row.zf != '0'">
                    <i class="icon his-del his-cancellationicon"></i>
                  </el-button>
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </pagenation-list>
    </div>

    <!-- 新增弹窗 -->
    <el-dialog top="8vh" :title="'患者治疗申请'" :visible.sync="dialogVisible" v-if="dialogVisible" width="80%" :close-on-click-modal="false" :destroy-on-close="true" @close="dialogClosed">
      <div class="dialog-form" v-if="dialogVisible">
        <el-row :gutter="10">
          <el-col :span="4">
            <div class="his-module his-small">
              <div class="xmxz-title">项目选择</div>
              <el-divider></el-divider>
              <div class="flex-row">
                <span>治疗科室</span>
                <el-select class="w100" v-model="zlks" placeholder="请选择科室" @change="getType" :clearable="false">
                  <el-option v-for="item in zlksList" :key="item.dv" :label="item.dn" :value="item.dv"></el-option>
                </el-select>
              </div>
              <div class="flex-row">
                <span>项目类别</span>
                <el-select v-model="zllb" placeholder="请选择类别" @change="getProject" :disabled="this.zlks ? false : true">
                  <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.lbmc" :value="item.jlxh"></el-option>
                </el-select>
              </div>
              <el-divider class="mb0"></el-divider>
              <div :style="{ height: listSlotHeight - 351 + 'px' }" class="scroll-bar">
                <div v-for="item in projectOptions" class="border-b zlxm-option" @dblclick="selectZLXM(item)" :key="item.jlxh">
                  {{ item.zlxmmc }}
                  <!-- :class="{'isActive': !!selectData.find(data => data.lbmc == item.lbmc && data.zlxmmc == item.zlxmmc)}" -->
                  <el-divider class="mb0"></el-divider>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="20">
            <div class="his-module his-small no-pb no-pt">
              <el-form :key="formIndex" :model="ruleForm" ref="ruleForm" label-width="65px" style="margin: 10px auto;">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item label="诊断名称">
                      <el-input v-model="ruleForm.zdmc" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="申请时间">
                      <el-input v-model="ruleForm.sqsj" disabled placeholder="请输入申请时间"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="申请医生">
                      <el-input v-model="ruleForm.sqys" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :span="22">
                    <el-form-item label="主要病史">
                      <el-input v-model="ruleForm.zybs" placeholder="请输入主要病史" type="textarea"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-button class="blue-gra text-white">引入</el-button>
                  </el-col>
                  <el-col :span="22">
                    <el-form-item label="体检判定">
                      <el-input v-model="ruleForm.tjpd" placeholder="请输入体检判定" type="textarea"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-button class="blue-gra text-white">引入</el-button>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item label="备注">
                      <el-input v-model="ruleForm.bz" placeholder="请输入备注"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class="his-module his-small">
              <div slot="header" class="row">
                <div class="label">
                  <h1 class="title">治疗项目列表</h1>
                </div>
                <div class="opreate">
                  <el-button type="primary" class="blue-gra" size="mini" @click="addCureProject">新增</el-button>
                </div>
              </div>
              <el-table :data="list" border :fit="true" stripe :highlight-current-row="true" slot="list" :height="listSlotHeight - 519" class="scroll-bar input-table" :key="keyIndex">
                <el-table-column type="index" width="32" align="center"></el-table-column>
                <el-table-column label="治疗项目" prop="zlxmmc" min-width="100">
                  <template slot-scope="scope">
                    <remoteSearchBox
                      v-model="scope.row.zlxmmc"
                      name="zlsq"
                      :ref="`${scope.$index}-1`"
                      style="height: 32px;"
                      @getData="(data) => setData(scope, data)"
                      :resultTableHeader="resultTableHeader"
                      :searchData="searchDataDetail"
                      :popoverWidth="450"
                      :searchField="{ yp: 'pydm' }"
                      :showLabel="{ yp: 'zlxmmc' }"
                      @clear="clearZlxm(scope)"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="执行科室" prop="zlksdm" min-width="80">
                  <template slot-scope="scope">
                    {{ zlksList.find((item) => item.dv == scope.row.zlksdm) && zlksList.find((item) => item.dv == scope.row.zlksdm).dn }}
                  </template>
                </el-table-column>
                <el-table-column label="单位" prop="dw" min-width="40"></el-table-column>
                <el-table-column label="执行疗程" min-width="60">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.zxlc" 
                      @blur="getNumber(scope,2)" 
                      style="height: 32px;" 
                      type="number"
                      :ref="`${scope.$index}-2`"
                      @keydown.enter.native="nextFocus(scope.$index,2)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="疗程次数" min-width="60">
                  <template slot-scope="scope">
                    <el-input 
                      v-model="scope.row.lccs"
                      @change="getNumber(scope,3)" 
                      style="height: 32px;" 
                      type="number"
                      :ref="`${scope.$index}-3`"
                      @keydown.enter.native="nextFocus(scope.$index,3)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="执行间隔天数" min-width="80">
                  <template slot-scope="scope">
                    <el-input 
                      v-model="scope.row.zxjg" 
                      style="height: 32px;" 
                      type="number"
                      :ref="`${scope.$index}-4`"
                      @keydown.enter.native="nextFocus(scope.$index,4)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="数量" prop="sl" min-width="40"></el-table-column>
                <el-table-column label="单价" prop="xmdj" min-width="50"></el-table-column>
                <el-table-column label="金额" prop="hjje" min-width="50"></el-table-column>
                <el-table-column label="治疗目标" min-width="80">
                  <template slot-scope="scope">
                    <el-input 
                      v-model="scope.row.ckmb" 
                      style="height: 32px;"
                      :ref="`${scope.$index}-5`"
                      @keydown.enter.native="nextFocus(scope.$index,5)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="注意事项" min-width="80">
                  <template slot-scope="scope">
                    <el-input 
                      v-model="scope.row.zysx" 
                      style="height: 32px;"
                      :ref="`${scope.$index}-6`"
                      @keydown.enter.native="addCureProject"
                    ></el-input>
                  </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作" width="45" align="center">
                  <template slot-scope="scope">
                    <el-tooltip :content="$t('common.delete')" placement="bottom" effect="light">
                      <el-popconfirm hideIcon :confirmButtonText="$t('common.confirm')" :cancelButtonText="$t('common.cancel')" :title="$t('common.delTip')" @confirm="handleDeleteZLXM(scope)">
                        <el-button slot="reference" class="red">
                          <i class="icon his-del"></i>
                        </el-button>
                      </el-popconfirm>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" v-preventReClick @click="submit" :loading="isSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Style } from 'util'
import { getTreatmentType, getProject, findSFXMList, addZLSQ, zfZLSQ, queryZLSQ, editZLSQ } from '@/api/mqm/treatment/treatment'
import { getNow } from '@/api/his/basic'
import { parseTime } from '@/utils'
import { regPosInt } from '@/utils/validate'
@Component({
  name: 'addCureApply',
  components: {},
  filters: {
    zt2zh(val: number) {
      switch (val) {
        case 0:
          return '新开'
        case 1:
          return '部分预约'
        case 2:
          return '全部预约'
        case 3:
          return '部分执行'
        case 4:
          return '完成'
      }
    },
    ztColor(val: number) {
      switch (val) {
        case 0:
          return 'blue'
        case 1:
          return 'orange'
        case 2:
          return 'green'
        case 3:
          return 'orange'
        case 4:
          return 'green'
      }
    },
  },
})
export default class extends Vue {
  @Prop({ required: true }) private type!: number //1门诊 2住院
  // @Prop({ required: false, default: () => {} }) private prrData!: any
  @Prop({ required: false, default: () => {} }) private checkData!: any
  private pnParam: any = {}
  private listSlotHeight: number = 0
  private selectData: any[] = []
  private allDoctor: any[] = [] // 所有医生数组
  private list: any = [] //弹窗中治疗项目表格数据
  private tableDatas: any = [] //治疗康复申请的数据
  private ruleForm: any = {} //弹窗中的form表单
  private dialogVisible: boolean = false //控制弹框的标识
  private zlks: any = '' //弹窗右侧小助手的治疗科室
  private zllb: any = '' //弹窗右侧小助手的项目类别
  private typeOptions: any[] = [] //项目类别的选项
  private projectOptions: any[] = [] //治疗项目的选项
  private keyIndex: number = 1 //控制弹窗中治疗项目表格刷新的索引
  private isSave: boolean = false // 防止重复点击
  private searchData: any = {
    startDate: '',
    endDate: '',
    mzhm: '',
    zf: '',
  } //治疗康复申请接口的参数
  private date: any[] = [] //申请日期的数据
  private checked: boolean = false //是否勾选查看作废
  private formIndex: number = 1 //控制弹窗的form表单刷新的索引
  private editData: any = {} //修改时保存治疗申请的jlxh和zlsqdh，可以作为新增可编辑的区分
  private zlksList: Array<any> = [] //治疗科室数组
  private resultTableHeader: any = {
    //治疗项目输入法返回数据的表头
    yp: [
      {
        label: '项目名称',
        prop: 'zlxmmc',
      },
      {
        label: '执行科室',
        prop: 'zlksmc',
        width: '80',
      },
      {
        label: '类别',
        prop: 'zllbmc',
        width: '110',
      },
      {
        label: '单位',
        prop: 'dw',
        width: '60',
      },
    ],
  }
  private searchDataDetail: any = {
    //治疗项目输入法搜索的参数
    yp: {
      lbmc: '',
      zlksdm: '',
    },
  }
  private mzksList: Array<any> = [] // 门诊科室字典
  private szryList: Array<any> = [] // 操作人员（用户）

  @Watch('date') //日期选择改变时对search的改变
  private onDateChange(val: any) {
    if (val) {
      this.searchData.startDate = val[0]
      this.searchData.endDate = val[1]
    } else {
      this.searchData.startDate = ''
      this.searchData.endDate = ''
    }
  }
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }

  //钩子函数，获取时间和申请数据
  mounted() {
    this.pnParam = this.$store.state.pnParam.PN_PARAM
    this.allDoctor = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.zlksList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.CRUE_DICT : this.$store.state.webSqlDict.CRUE_DICT
    this.mzksList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.OUTPATIENT_DEPARTMENT : this.$store.state.webSqlDict.OUTPATIENT_DEPARTMENT
    this.szryList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.USERS_DICT : this.$store.state.webSqlDict.USERS_DICT
    // console.log(this.prrData)
    console.log(this.checkData)
    getNow().then((res: any) => {
      const date: string = parseTime(res.data, '{y}-{m}-{d}') as string
      this.date = [date, date]
      this.searchData.startDate = date
      this.searchData.endDate = date
      this.getData()
    })
  }

  //获取治疗康复申请列表
  getData() {
    if (!this.date) {
      this.$notify({
        title: '请先选择时间',
        message: '',
        type: 'warning',
      })
      return
    }
    if (this.checked) {
      this.searchData.zf = ''
    } else {
      this.searchData.zf = 0
    }
    this.searchData.mzhm = this.checkData.mzhm
    ;(this.$refs.sqlbList as any).getList()
  }

  //打开新增治疗康复申请的弹框
  private open(type: string = 'create', data: any = {}) {
    this.ruleForm.zdmc = this.checkData.fymc
    this.ruleForm.sqys = JSON.parse(localStorage.getItem('userInfo') as string).name
    this.ruleForm.sqysgh = JSON.parse(localStorage.getItem('userInfo') as string).userId
    this.dialogVisible = true
    getNow().then((res: any) => {
      this.ruleForm.sqsj = parseTime(res.data, '{y}-{m}-{d} {h}:{i}:{s}')
      this.formIndex++
    })
  }

  //根据治疗科室获取治疗类别
  private getType(data: any) {
    getTreatmentType({ pageSize: 9999, pageNum: 1, zlksdm: data }).then((res: any) => {
      this.typeOptions = res.data.list
      console.log(this.typeOptions)
      this.projectOptions = []
      this.zllb = ''
    })
  }

  //根据治疗科室和类别名称获取治疗项目
  private getProject(data: any) {
    console.log(data, 'data')
    getProject({ pageSize: 9999, pageNum: 1, zlksdm: this.zlks, zllb: data }).then((res: any) => {
      this.projectOptions = res.data.list
    })
  }

  //在治疗项目列表中新增一条空的记录
  private addCureProject() {
    this.list = [...this.list, { zxlc: 1, lccs: 1, zxjg: 1 }]
    // 新增一行，治疗项目获取焦点
    this.$nextTick(()=> {
      ;(this.$refs[`${this.list.length-1}-1`] as any).focus()
    })
  }

  // 回车切换位置
  private nextFocus(scope: any,num: number) {
    ;(this.$refs[`${scope}-${num + 1}`] as any).focus()
    ;(this.$refs[`${scope}-${num + 1}`] as any).select()
  }

  //编辑治疗申请，获取治疗申请的详情，将jlxh和zlsqdh保存到this.editData中
  private editCureApply(data: any) {
    queryZLSQ({ jlxh: data.jlxh }).then((res: any) => {
      this.editData = {
        jlxh: res.data.jlxh,
        zlsqdh: res.data.zlsqdh,
      }
      this.ruleForm.zd_jlxh = res.data.zlSqdzdRespList[0] && res.data.zlSqdzdRespList[0].jlxh
      this.ruleForm.zdmc = res.data.zlSqdzdRespList[0] && res.data.zlSqdzdRespList[0].zdmc
      this.ruleForm.sqsj = res.data.sqsj
      this.ruleForm.sqys = this.szryList.find((item: any) => item.dv == res.data.sqysgh) && this.szryList.find((item: any) => item.dv == res.data.sqysgh).dn
      this.ruleForm.zybs = res.data.zybs
      this.ruleForm.tjpd = res.data.tjpd
      this.ruleForm.bz = res.data.bz
      this.ruleForm = JSON.parse(JSON.stringify(this.ruleForm))
      this.selectData = res.data.zlSqdmxRespList.map((item: any) => {
        return {
          lbmc: item.lbmc,
          zlxmmc: item.zlxmmc,
        }
      })
      this.list = res.data.zlSqdmxRespList.map((item: any) => {
        return {
          xmdj: item.dj,
          hjje: item.je,
          lccs: item.lccs,
          dw: item.dw,
          sl: item.sl,
          zlxmmc: item.zlxmmc,
          zxlc: item.zxlc,
          zysx: item.zysx,
          zxjg: item.zxjg,
          zlmb: item.zlmb,
          lbmc: item.lbmc,
          jlxh: item.jlxh,
        }
      })
      this.dialogVisible = true
    })
  }

  //提交治疗申请，根据this.editData来判断是新增还是修改
  private submit() {
    this.isSave = true // 未保存成功前置灰保存按钮
    console.log(this.checkData)

    let data: any = {
      brid: this.checkData.brid,
      brxm: this.checkData.brxm,
      brxz: this.checkData.brxz,
      jzxh: this.pnParam.jzxh,
      bqdm: '',
      brch: '',
      brlx: this.type,
      bz: this.ruleForm.bz,
      fphm: '',
      jsgh: '',
      jssj: '',
      kh: this.checkData.jzkh,
      ksdm: Vue.prototype.AUTHORITY.outpatientCode,
      mzhm: this.checkData.mzhm,
      sqsj: this.ruleForm.sqsj,
      sqysgh: this.ruleForm.sqysgh,
      tjpd: this.ruleForm.tjpd,
      zf: '',
      zfgh: '',
      zfsj: '',
      zlksdm: this.zlks,
      zt: '',
      zybs: this.ruleForm.zybs,
      zyh: '',
      zlsqdh: this.pnParam.jzlsh,
      jzlsh: this.pnParam.jzlsh,
    }
    let zlSqdmxReqList: any[] = []
    this.list = this.list.filter((el: any)=> {
      return el.zlxmmc
    })
    if (this.list.length == 0) {
      this.isSave = false
      return this.$message.warning('不能出现空的治疗项目!')
    }
    
    
    for (let i = 0; i < this.list.length; i++) {
      let data = {
        dj: this.list[i].xmdj,
        je: this.list[i].hjje,
        lccs: this.list[i].lccs,
        sl: this.list[i].sl,
        xh: i + 1,
        zlmb: this.list[i].zlmb,
        zlxmmc: this.list[i].zlxmmc,
        zxjg: this.list[i].zxjg,
        zxlc: this.list[i].zxlc,
        zysx: this.list[i].zysx,
        zlxmJlxh: this.list[i].jlxh,
        zxks: this.list[i].zlksdm,
        zllb: this.list[i].zllb,
      }
      zlSqdmxReqList.push(data)
    }
    let zlSqdzdReqList = [
      {
        icd: this.checkData.icd10,
        xh: 1,
        zdmc: this.checkData.fymc,
        jlxh: this.ruleForm.zd_jlxh,
      },
    ]
    console.log(data)
    if (Object.keys(this.editData).length > 0) {
      data.zlSqdmxUpdateReqList = zlSqdmxReqList
      data.zlSqdzdUpdateReqList = zlSqdzdReqList
      editZLSQ(Object.assign(data, this.editData)).then((res: any) => {
        if (res.errorCode == 'SUCCESS') {
          this.$notify({
            title: `修改成功`,
            message: '',
            type: 'success',
          })
          this.dialogVisible = false
          this.getData()
          this.editData = {}
          this.dialogClosed()
          this.isSave = false
        }
      })
    } else {
      data.zlSqdmxReqList = zlSqdmxReqList
      data.zlSqdzdReqList = zlSqdzdReqList
      
      addZLSQ(data).then((res: any) => {
        if (res.errorCode == 'SUCCESS') {
          this.$notify({
            title: `新增成功`,
            message: '',
            type: 'success',
          })
          this.dialogVisible = false
          this.getData()
          this.dialogClosed()
          this.isSave = false
        }
      }).catch(()=>{
        this.isSave = false
      })
    }
  }

  //双击右侧小助手，将治疗项目带入治疗项目列表中（有重复判断）
  private selectZLXM(item: any) {
    console.log(item, 'item')
    // 校验重复数据
    let flag: boolean = false
    this.list.map((zlxm: any) => {
      if (zlxm.zlxmmc == item.zlxmmc && zlxm.lbmc == item.lbmc) {
        flag = true
      }
    })

    if (flag) {
      this.$notify({
        title: `请勿重复添加【${item.zlxmmc}】项目`,
        message: '',
        type: 'warning',
      })
      return
    } else {
      findSFXMList({ zlxmJlxh: item.jlxh }).then((res: any) => {
        if (res.data.length == 0) return this.$message.warning('请先维护治疗计划与收费项目！')
         
        let dj = 0 // 总金额
        res.data.map((sfxm: any) => {
          dj += sfxm.je
        })
        // console.log(zje)
        const hjje = dj * item.zxlc * item.mlcmrcs
        console.log(618, hjje)
        this.list = [...this.list, { jlxh: item.jlxh, zxlc: item.zxlc, lccs: item.mlcmrcs, zxjg: item.jgts, dw: item.dw, zllb: item.zllb, zlxmmc: item.zlxmmc, sl: item.zxlc * item.mlcmrcs, xmdj: dj, hjje: hjje,ckmb:item.ckmb,zysx:item.zysx,zlksdm: item.zlksdm }]
        console.log(620, this.list)
        this.selectData = [...this.selectData, { lbmc: item.lbmc, zlxmmc: item.zlxmmc }]
        this.keyIndex++
      })
    }
  }
  //在治疗项目列表中新增一条数据，计算数量和价格
  private getNumber(data: any,num:number) {
    console.log(data)
    // if (!regPosInt.test(data.row.zxlc)) {
    //   data.row.zxlc = 1
    //   this.$notify({
    //     title: '执行疗程必须为数字',
    //     type: 'warning',
    //     message: '',
    //   })
    // }
    // if (!regPosInt.test(data.row.lccs)) {
    //   data.row.lccs = 1
    //   this.$notify({
    //     title: '执行次数必须为数字',
    //     type: 'warning',
    //     message: '',
    //   })
    // }
    if (data.row.zxlc && data.row.lccs) {
      console.log('686')
      data.row.sl = parseInt(data.row.zxlc) * parseInt(data.row.lccs)
      data.row.hjje = data.row.sl * data.row.xmdj
    }
    this.keyIndex++
    this.$nextTick(()=> {
      this.nextFocus(data.$index,num)
    })
  }

  //选择治疗项目输入法的结果，将数据填充至该行（有重复判断）
  private setData(data: any, item: any) {
    console.log(651,data,item)
    let flag: boolean = false
    this.list.map((zlxm: any, index: number) => {
      if (zlxm.zlxmmc == item.zlxmmc && zlxm.lbmc == item.lbmc && index != data.$index) {
        flag = true
      }
    })
    if (flag) {
      this.$notify({
        title: `请勿重复添加【${item.zlxmmc}】项目`,
        message: '',
        type: 'warning',
      })
      this.list[data.$index] = { zxlc: 1, lccs: 1, zxjg: 1 }
      this.keyIndex++
      return
    } else {
      findSFXMList({ zlxmJlxh: item.jlxh}).then((res: any) => {
        if(res.data.length == 0) return this.$message.warning('请先维护治疗计划与收费项目！')
        let dj = 0
        res.data.map((sfxm: any) => {
          dj += sfxm.je
        })
        const hjje = dj * item.zxlc * item.mlcmrcs
        data.row.zxlc = item.zxlc
        data.row.lccs = item.mlcmrcs
        data.row.zxjg = item.jgts
        data.row.dw = item.dw
        data.row.lbmc = item.lbmc
        data.row.zlxmmc = item.zlxmmc
        data.row.sl = item.zxlc * item.mlcmrcs
        data.row.xmdj = dj
        data.row.hjje = hjje
        data.row.jlxh = item.jlxh
        this.$set(data.row, 'zlksdm',item.zlksdm)
        this.selectData = [...this.selectData, { lbmc: item.lbmc, zlxmmc: item.zlxmmc }]
        this.keyIndex++
        this.$nextTick(()=> {
          this.nextFocus(data.$index,1)
        })
      })
      
    }
  }

  // 输入法远程搜索框的清空按钮
  private clearZlxm(data: any) {
    this.list[data.$index] = { zxlc: 1, lccs: 1, zxjg: 1 }
    this.keyIndex++
  }

  //删除治疗项目列表中的某条数据
  private handleDeleteZLXM(data: any) {
    this.list.splice(data.$index, 1)
    this.keyIndex++
  }

  //作废治疗申请单
  zfZlSQ(jlxh: number) {
    zfZLSQ({ jlxh: jlxh }).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.$notify({
          title: '删除成功',
          message: '',
          type: 'success',
        })
        this.getData()
      }
    })
  }

  // 关闭弹窗时的钩子函数，清空弹框的数据
  dialogClosed() {
    this.ruleForm = {}
    this.list = []
    this.editData = {}
    this.projectOptions = []
    this.zlks = ''
    this.zllb = ''
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/inputTable.scss';
.w220 {
  width: 220px !important;
}
.el-col-20 {
  padding-left: 0px !important;
}
.el-col-4 {
  padding-left: 0px !important;
}
.his-small.his-module {
  height: calc(100% - 126px);
}
.no-pb {
  padding-bottom: 0;
}
::v-deep .el-dialog {
  .el-divider {
    margin: 8px 0;
    &.mb0 {
      margin-bottom: 0;
    }
  }
  .el-dialog__body {
    padding: 10px;
    padding-bottom: 0;
  }
  margin-bottom: 0;
  .content {
    height: auto;
    padding: 0;
  }
}
::v-deep .flex-row {
  display: flex;
  span {
    white-space: nowrap;
    margin-right: 4px;
  }
  align-items: center;
  margin-bottom: 8px;
  .el-input--medium .el-input__inner {
    height: 28px;
    line-height: 28px;
  }
  .el-select__caret {
    line-height: 28px;
  }
  .el-input__inner {
    -webkit-appearance: none;
    background-image: none;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #1f2d3d;
    display: inline-block;
    font-size: inherit;
    outline: none;
    padding: 0 15px 0 0;
    -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    background: #f5f6f8;
    border: 1px solid transparent;
    padding: 10px;
  }
}
.border-b {
  padding: 8px 0 0;
}
.xmxz-title {
  color: #222b31;
  font-size: 16px;
  white-space: nowrap;
  font-family: siyuanMedium;
  font-weight: 500;
}
.no-pt {
  padding-top: 0;
}

.p10 {
  padding: 7px 10px;
}
.mr4 {
  margin-right: 4px;
}
.p0 {
  padding: 0;
}
.content .his-small .el-form .el-form-item {
  margin-bottom: 8px;
}

.zlxm-option {
  cursor: pointer;
  &:hover {
    background: rgba(15, 202, 173, 0.2) !important;
  }
}

.isActive {
  background: rgba(15, 202, 173, 0.2) !important;
}

.dialog-form {
  .el-form-item {
    display: block;
    ::v-deep .el-form-item__content {
      width: auto;
      margin-left: 65px !important;
    }
  }
}
.text-white {
  color: #fff;
}
</style>
