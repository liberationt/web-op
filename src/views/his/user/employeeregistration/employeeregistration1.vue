<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="13">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <h1 class="title">{{$t('emp.title1')}}</h1>
              <el-divider direction="vertical"></el-divider>
              <el-input
                v-model="searchData.searchPharm"
                :placeholder="$t('emp.phSearch')"
                @change="toSearch1"
                class="input"
              >
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input>
              <el-checkbox
								@change="toSearch2"
								class="checkbox1"
              >{{$t('emp.chkLogof')}}</el-checkbox>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                class="blue-gra"
                icon="icon his-add"
                @click="handleAdd"
              >{{$t('common.add')}}</el-button>
            </div>
          </div>
          <pagenation-list
            ref="pageTable"
            v-model="tableData"
            data-url="/system-service/hrpersonnel/queryPage"
            :search-data="searchData"
            http-method="post"
            :list-height="listSlotHeight"
          >
            <el-table
              slot="list"
              stripe
              ref="table"
              :highlight-current-row="true"
              :data="tableFormat"
              @row-click="getDetail"
              border
              v-loading="loading"
              :height="listSlotHeight"
              class="scroll-bar"
              tooltip-effect="light"
            >
              <el-table-column
                prop="rybh"
                :label="$t('emp.empNo')"
                width="80"
              ></el-table-column>
              <el-table-column prop="personname" :label="$t('common.name')"></el-table-column>
              <el-table-column
                prop="genderName"
                :label="$t('common.sex')"
                width="70"
              ></el-table-column>

              <!-- 科室 -->
              <el-table-column
                prop="officeName"
                :label="$t('common.dept')"
                show-overflow-tooltip
              ></el-table-column>

              <!-- 行政职务 -->
              <el-table-column
                prop="jobpostName"
                :label="'行政职务'"
                show-overflow-tooltip
              ></el-table-column>
              <!-- 状态 -->
              <el-table-column :label="$t('common.status')" width="70" align="center">
                <template slot-scope="scope">
                  <span :class="[scope.row.logoff=='0'?'blues':'reds','status']">
                    {{ scope.row.logoff=='0'?'正常':'停用' }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('common.action')"
                width="70" align="center"
                class-name="action-btns"
              >
                <template slot-scope="scope">
                  <el-tooltip
                    :content="scope.row.logoff == 0 ? $t('common.logOff') : $t('common.restore')"
                    effect="light"
                  >
                    <el-popconfirm
											:title="scope.row.logoff == 0 ? $t('emp.logOffEmp') : $t('emp.restoreEmp')"
											:confirmButtonText="$t('common.confirm')"
											:cancelButtonText="$t('common.cancel')"
                      @confirm="confirm(scope.row)"
											hideIcon
                    >
                      <el-button
                        slot="reference"
                        :class="scope.row.logoff == 0 ? 'red' : 'green'"
                      >
                        <i
                          class="icon"
                          :class="
                            scope.row.logoff == 0 ? 'his-cancellation' : 'his-invocation'
                          "
                        ></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col class="ht" :span="11">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <h1 class="title">{{rightTitle}}</h1>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                class="green-gra"
                icon="icon his-save"
                @click="handleSubmit"
              >{{$t('common.save')}}</el-button>
            </div>
          </div>
          <div class="form-wrap scroll-bar">
            <el-form
              :model="formData"
              :rules="formRule"
              ref="formData"
              label-width="90px"
              class="clearfix"
            >
              <!-- 工号 -->
              <el-form-item :label="$t('emp.empNo')" prop="rybh">
                <el-input
                  v-model.trim="formData.rybh"
                  :placeholder="$t('emp.phEmpNo')"
                  maxlength="20"
                  :disabled="!isAdd"
                ></el-input>
              </el-form-item>

              <!-- 姓名 -->
              <el-form-item :label="$t('common.name')" prop="personname">
                <el-input
                  v-model="formData.personname"
                  :placeholder="$t('emp.phName')"
                  maxlength="100"
                  @change="nameTrim"
                ></el-input>
              </el-form-item>

              <!-- 证件类型 -->
              <el-form-item :label="$t('emp.cerType')" prop="cardtype">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000260"
                  v-model="formData.cardtype"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.cardtype"
                  @change="cardTypeChange"
                />
              </el-form-item>

              <!-- 证件号码 -->
              <el-form-item :label="$t('emp.IDNumber')" prop="cardnum">
                <el-input
                  v-model="formData.cardnum"
                  :placeholder="$t('emp.phIDNumber')"
                  maxlength="50"
                  @input="calcBirthday"
                ></el-input>
              </el-form-item>

              <!-- 出生日期 -->
              <el-form-item :label="$t('common.birthday')" prop="birthday">
                <el-date-picker
                  v-model="formData.birthday"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :placeholder="$t('emp.phDate')"
                  :disabled="isCorrectIDCard"
                  class="date-wrapper"
                ></el-date-picker>
              </el-form-item>

              <!-- 性别 -->
              <el-form-item :label="$t('common.sex')" prop="gender">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000269"
                  v-model="formData.gender"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.gender"
                  :disabled="isCorrectIDCard"
                />
              </el-form-item>

              <!-- 民族 -->
              <el-form-item :label="$t('emp.nation')" prop="ethnic">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000215"
                  v-model="formData.ethnic"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.ethnic"
                />
              </el-form-item>

              <!-- 籍贯 -->
              <el-form-item :label="'籍贯'" prop="hometown">
                <el-input
                  v-model="formData.hometown"
                  :placeholder="'请输入籍贯'"
                  maxlength="150"
                ></el-input>
              </el-form-item>

              <!-- 参加工作时间 -->
              <el-form-item :label="'参加工作时间'" prop="joininwork">
                <el-date-picker
                  v-model="formData.joininwork"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :placeholder="$t('emp.phDate')"
                  class="date-wrapper"
                ></el-date-picker>
              </el-form-item>

              <!-- 执业证书编码 -->
              <el-form-item :label="'执业证书编码'" prop="certificatenum">
                <el-input
                  v-model="formData.certificatenum"
                  :placeholder="'请输入执业证书编码'"
                  maxlength="20"
                ></el-input>
              </el-form-item>

              <!-- 行政职务 -->
              <el-form-item :label="'行政职务'" prop="jobpost">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000001"
                  v-model="formData.jobpost"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.jobpost"
                />
              </el-form-item>

              <!-- 最高学历 -->
              <el-form-item :label="$t('emp.degree')" prop="education">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000346"
                  v-model="formData.education"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.education"
                />
              </el-form-item>

              <!-- 学位 -->
              <el-form-item :label="'学位'" prop="educationbackground">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000447"
                  v-model="formData.educationbackground"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.educationbackground"
                />
              </el-form-item>

              <!-- 所学专业 -->
              <el-form-item :label="'所学专业'" prop="majorname">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000106"
                  v-model="formData.majorname"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.majorname"
                />
              </el-form-item>

              <!-- 专业技术资格 -->
              <el-form-item :label="'专业技术资格'" prop="majorqualify">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000471"
                  v-model="formData.majorqualify"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.majorqualify"
                />
              </el-form-item>

              <!-- 专业技术职务 -->
              <el-form-item :label="'专业技术职务'" prop="majorjob">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000472"
                  v-model="formData.majorjob"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.majorjob"
                />
              </el-form-item>

              <!-- 专业类别 -->
              <el-form-item :label="'专业类别'" prop="majortype">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000005"
                  v-model="formData.majortype"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.majortype"
                />
              </el-form-item>

              <!-- 医师执业类别 -->
              <el-form-item :label="'医师执业类别'" prop="operationtype">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000004"
                  v-model="formData.operationtype"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.operationtype"
                />
              </el-form-item>

              <!-- 医师执业范围 -->
              <el-form-item :label="'医师执业范围'" prop="operationscope">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000372"
                  v-model="formData.operationscope"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.operationscope"
                />
              </el-form-item>

              <!-- 医疗角色 -->
              <el-form-item :label="'医疗角色'" prop="medicalroles">
                <search-select
                  table-name="SYS_DICT_CONFIG"
                  kid="8"
                  v-model="formData.medicalroles"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.medicalroles"
                />
              </el-form-item>

              <!-- 专家判别 -->
              <el-form-item :label="'专家判别'" prop="isexpert">
                <search-select
                  table-name="SYS_FLAG_DATA"
                  kid="FD000005"
                  v-model="formData.isexpert"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.isexpert"
                />
              </el-form-item>

              <!-- 专家费用 -->
              <el-form-item :label="'专家费用'" prop="expertcost">
                <el-input
                  v-model="formData.expertcost"
                  :placeholder="'请输入专家费用'"
                ></el-input>
              </el-form-item>

              <!-- 特需判别 -->
              <el-form-item :label="'特需判别'" prop="isspecial">
                <search-select
                  table-name="SYS_FLAG_DATA"
                  kid="FD000005"
                  v-model="formData.isspecial"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.isspecial"
                />
              </el-form-item>

              <!-- 特需费用 -->
              <el-form-item :label="'特需费用'" prop="specialcost">
                <el-input
                  v-model="formData.specialcost"
                  :placeholder="'请输入特需费用'"
                ></el-input>
              </el-form-item>

              <!-- 开处方权 -->
              <el-form-item :label="'开处方权'" prop="prescriberight">
                <search-select
                  table-name="SYS_FLAG_DATA"
                  kid="FD000005"
                  v-model="formData.prescriberight"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.prescriberight"
                />
              </el-form-item>

              <!-- 麻醉药权 -->
              <el-form-item :label="'麻醉药权'" prop="narcoticright">
                <search-select
                  table-name="SYS_FLAG_DATA"
                  kid="FD000005"
                  v-model="formData.narcoticright"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.narcoticright"
                />
              </el-form-item>

              <!-- 精神药权 -->
              <el-form-item :label="'精神药权'" prop="psychotropicright">
                <search-select
                  table-name="SYS_FLAG_DATA"
                  kid="FD000005"
                  v-model="formData.psychotropicright"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.psychotropicright"
                />
              </el-form-item>

              <!-- 抗生素权 -->
              <el-form-item :label="'抗生素权'" prop="antibioticright">
                <search-select
                  table-name="SYS_FLAG_DATA"
                  kid="FD000005"
                  v-model="formData.antibioticright"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.antibioticright"
                />
              </el-form-item>

              <!-- 电子邮箱 -->
              <el-form-item :label="$t('common.email')" prop="email">
                <el-input
                  v-model="formData.email"
                  :placeholder="$t('emp.phEmail')"
                  maxlength="50"
                ></el-input>
              </el-form-item>

              <!-- 手机号码 -->
              <el-form-item :label="$t('common.phone')" prop="mobile">
                <el-input
                  v-model="formData.mobile"
                  :placeholder="$t('emp.phPhone')"
                ></el-input>
              </el-form-item>

              <!-- 抗生素等级 -->
              <el-form-item :label="'抗生素等级'" prop="antibioticlevel" class="kss">
                <el-checkbox-group v-model="antibioticlevelChecked">
                  <el-checkbox
                    v-for="item in antibioticlevelList"
                    :key="item.dv"
                    :label="item.dv"
                  >{{item.dn}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <span></span>

              <!-- 职业编号 -->
              <el-form-item :label="'职业编号'" prop="zybh">
                <el-input
                  v-model="formData.zybh"
                  :placeholder="'请输入职业编号'"
                  maxlength="30"
                ></el-input>
              </el-form-item>

              <!-- 职业医生姓名 -->
              <el-form-item :label="'职业医生姓名'" prop="zyysxm">
                <el-input
                  v-model="formData.zyysxm"
                  :placeholder="'请输入职业医生姓名'"
                  maxlength="50"
                ></el-input>
              </el-form-item>

              <!-- 所在科室 -->
              <el-form-item :label="'所在科室'" prop="officecode">
                <search-select
                  table-name="SYS_DICT_CONFIG"
                  kid="10"
                  v-model="formData.officecode"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.officecode"
                />
              </el-form-item>

              <!-- 拼音助记 -->
              <el-form-item :label="'拼音助记'" prop="pycode">
                <el-input
                  v-model="formData.pycode"
                  :placeholder="'拼音助记'"
                ></el-input>
              </el-form-item>

              <!-- 五笔码 -->
              <el-form-item :label="'五笔码'" prop="wbcode">
                <el-input
                  v-model="formData.wbcode"
                  :placeholder="'五笔码'"
                ></el-input>
              </el-form-item>

              <!-- 注销人员 -->
              <el-form-item :label="'注销人员'" prop="logoffoperaterName">
                <el-input
                  v-model="formData.logoffoperaterName"
                  :placeholder="'注销人员'"
                  disabled
                ></el-input>
              </el-form-item>

              <!-- 注销时间 -->
              <el-form-item :label="'注销时间'" prop="logofftime">
                <el-date-picker
                  v-model="formData.logofftime"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :placeholder="$t('emp.phDate')"
                  disabled
                ></el-date-picker>
              </el-form-item>

              <!-- 医生简介 -->
              <el-form-item :label="'医生简介'" prop="remark" class="ysjj">
                <el-input
                  type="textarea"
                  :rows="3"
                  resize="none"
                  :placeholder="'请输入医生简介'"
                  maxlength="500"
                  show-word-limit
                  v-model="formData.remark"
                ></el-input>
              </el-form-item>

              <!-- id -->
              <el-form-item label="id" prop="personid" style="display: none;">
                <el-input v-model="formData.personid"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  aEmpAdd, aEmpEdit, aEmpNoCheck, aCardCheck, aEmpLock, aEmpUnLock, aPyWb
} from '@/api/his/user/empReg.ts'
import { regInt, regIDCard, regPhone, regTel, regEmail } from '@/utils/validate.ts'
import { getTableData } from '@/websql/functions'
import { id2Name } from '@/utils'

@Component({
  name: '',
})
export default class extends Vue {
  private tableData: any[] = []
  private searchData: any = {
    logoff: '',
    searchPharm: '',
  }
  private listSlotHeight: number = 0 //列表高度
  private loading: boolean = false
  private rightTitle = window.ele.$i18n.t('common.add')
  private isAdd: boolean = true // 新增/修改
  private formData: any = {
    rybh: '', // 工号
    personname: '', // 姓名
    cardtype: '01', // 证件类型
    cardnum: '', // 证件号码
    birthday: '', // 出生日期
    gender: '', // 性别
    ethnic: '', // 民族
    hometown: '', // 籍贯
    joininwork: '', // 参加工作时间
    certificatenum: '', // 执业证书编码
    jobpost: '', // 行政职务
    education: '', // 最高学历
    educationbackground: '', // 学位
    majorname: '', // 所学专业
    majorqualify: '', // 专业技术资格
    majorjob: '', // 专业技术职务
    majortype: '', // 专业类别
    operationtype: '', // 医师执业类别
    operationscope: '', // 医师执业范围
    medicalroles: '', // 医疗角色
    isexpert: '', // 专家判别
    expertcost: '', // 专家费用
    isspecial: '', // 特需判别
    specialcost: '', // 特需费用
    prescriberight: '', // 开处方权
    narcoticright: '', // 麻醉药权
    psychotropicright: '', // 精神药权
    antibioticright: '', // 抗生素权
    email: '', // 电子邮箱
    mobile: '', // 手机号码
    antibioticlevel: '', // 抗生素等级
    zybh: '', // 职业编号
    zyysxm: '', // 职业医生姓名
    officecode: '', // 所在科室
    pycode: '', // 拼音助记
    wbcode: '', // 五笔码
    logoffoperaterName: '', // 注销人员
    logofftime: '', // 注销时间
    remark: '', // 医生简介
    personid: '' // id
  }
  private validateEmpNo = (rule: any, value: any, callback: any) => {
    this.checkEmpNoDup(value, callback)
  }
  private validateCard = (rule: any, value: any, callback: any) => {
    this.checkCardDup(callback)
  }
  private formRule: any = {
    rybh: [
      { required: true, message: window.ele.$i18n.t('emp.vdEmpNo'), trigger: 'blur' },
      { pattern: regInt, message:'请输入数字', trigger: 'blur' },
      { max: 50, message: window.ele.$i18n.t('emp.vdEmpNo2'), trigger: 'blur' },
      { validator: this.validateEmpNo, trigger: 'blur' },
    ],
    personname: [
      { required: true, message: window.ele.$i18n.t('emp.vdEmpName'), trigger: 'blur' },
      { max: 300, message: window.ele.$i18n.t('emp.vdEmpName1'), trigger: 'blur' }
    ],
    cardtype: [
      { required: true, message: window.ele.$i18n.t('emp.vdCerType'), trigger: 'blur' },
    ],
    cardnum: [
      { required: true, message: window.ele.$i18n.t('emp.vdIDNumber'), trigger: 'blur' },
      // { pattern: regIDCard, message: window.ele.$i18n.t('emp.vdIDCard2'), trigger: 'blur' }
      { validator: this.validateCard, trigger: 'blur' }
    ],
    medicalroles: [
      { required: true, message: '医疗角色不能为空', trigger: 'blur' }
    ],
    expertcost: [
      { pattern: regInt, message:'请输入整数', trigger: 'blur' }
    ],
    specialcost: [
      { pattern: regInt, message:'请输入整数', trigger: 'blur' }
    ],
    prescriberight: [ // 开处方权
      {required: true, message: '开处方权不能为空', trigger: 'blur'}
    ],
    narcoticright: [ // 麻醉药权
      {required: true, message: '麻醉药权不能为空', trigger: 'blur'}
    ],
    psychotropicright: [ // 精神药权
      {required: true, message: '精神药权不能为空', trigger: 'blur'}
    ],
    email: [
      { pattern: regEmail, message: window.ele.$i18n.t('emp.vdEmail'), trigger: 'blur' }
    ],
    mobile: [
      { pattern: regPhone, message: window.ele.$i18n.t('emp.vdPhone'), trigger: 'blur' }
    ],
    // officecode: [
    //   { required: true, message: window.ele.$i18n.t('emp.vdEmpDept'), trigger: 'blur' },
    // ],
  }
  private ruleIDCard: any = { pattern: regIDCard, message: window.ele.$i18n.t('emp.vdIDCard2'), trigger: 'blur' }
  private isCorrectIDCard: boolean = false // 身份证号是否正确
  private antibioticlevelList: any[] = [] // 字典数据-抗生素等级
  private antibioticlevelChecked: any[] = [] // 选中的抗生素等级
  private genderList: any[] = [] // 字典数据-性别
  private officeList: any[] = [] // 字典数据-科室
  private jobpostList: any[] = [] // 字典数据-行政职务

  private backfillObj: any = {// 初始化省市区
    provinceId: 0,
    cityId: 0,
    areaId: 0
  }
  private addressValue: string = ''//省市区id，字符串

  // 监听方法
  @Watch('tableData')
  private onValueChange(value: any) {
    // this.loading = false
    // 修改保存后当前行维持高亮
    // let currentRowIndex = value.findIndex((item: any) => {
    //   return item.personId == this.currentRowId
    // })
    // const table: any = this.$refs.table
    // table.setCurrentRow(this.tableData[currentRowIndex])
  }

  // 表格转字典数据
  get tableFormat() {
    let newData: any = []
    newData = id2Name(this.tableData, 'gender', 'genderName', this.genderList, 'dv', 'dn')
    newData = id2Name(this.tableData, 'officecode', 'officeName', this.officeList, 'dv', 'dn')
    newData = id2Name(this.tableData, 'jobpost', 'jobpostName', this.jobpostList, 'dv', 'dn')
    return newData
  }

  //获取表格数据
  private getLists() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 姓名查询
  toSearch1(value: any) {
    this.searchLists()
  }

  // 查询所有/未注销
  toSearch2(value: boolean) {
    //value为复选框改变后的值
    if (value) {
      // 查询所有
      this.searchData.logoff = 1
    } else {
      // 只查询未注销
      this.searchData.logoff = ''
    }
    this.searchLists()
  }

  // 条件查询
  searchLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }

  // 获取详情
  getDetail(row: any) {
    this.rightTitle = window.ele.$i18n.t('common.edit')
    this.isAdd = false
    const formData: any = this.$refs.formData
    formData.resetFields()
    // 取数据
    for (let i in this.formData) {
      this.formData[i] = row[i]
    }
    // 取抗生素等级
    if(this.formData.antibioticlevel){
      this.antibioticlevelChecked = this.formData.antibioticlevel.split(',')
    }else{
      this.antibioticlevelChecked = []
    }
    // 生日、性别不可修改
    if(this.formData.cardtype == '01'){
      this.isCorrectIDCard = true
    }else{
      this.isCorrectIDCard = false
    }
  }

  // 新增按钮
  private handleAdd(){
    this.rightTitle = window.ele.$i18n.t('common.add')
    this.isAdd = true
    const formData: any = this.$refs.formData
    formData.resetFields()
    this.antibioticlevelChecked = []
  }

  // 保存按钮
  private handleSubmit(){
    const formData: any = this.$refs.formData
    formData.validate((valid: any)=>{
      if(valid){
        this.formData.antibioticlevel = this.antibioticlevelChecked.toString()
        console.log(this.antibioticlevelChecked);
        console.log(this.formData.antibioticlevel);
        // return false
        if(this.isAdd){
          this.addEmp()
        }else{
          this.editEmp()
        }
      }
    })
  }

  // 发起新增
  private addEmp(){
    aEmpAdd(this.formData).then((res: any) => {
      if(res){
        this.$notify({
          title: this.$t('emp.msgAdd').toString(),
          message: '',
          type: 'success',
        })
        this.getLists()
      }
    })
  }

  // 发起修改
  private editEmp(){
    aEmpEdit(this.formData).then((res: any) => {
      if(res){
        this.$notify({
          title: this.$t('emp.msgEdit').toString(),
          message: '',
          type: 'success',
        })
        this.getLists()
      }
    })
  }

  // 注销/复原
  private confirm(row: any){
    if(row.logoff == 0){
      aEmpLock({personid: row.personid}).then((res: any) => {
        if(res){
          this.$notify({
						type: 'success',
						title: this.$t('emp.msgLogof').toString(),
						message: ''
					})
					this.getLists()
					// 只查询未注销，则清空表单
					if(this.searchData.queryAllData == 0){
						// const formInline11: any = this.$refs.formInline
						// formInline11.resetFields()
					}
        }
      })
    }else{
      aEmpUnLock({personid: row.personid}).then((res: any) => {
        if(res){
          this.$notify({
							type: 'success',
							title: this.$t('emp.msgRestore').toString(),
							message: ''
					})
					this.getLists()
        }
      })

    }
  }

  // 查询字典数据
  private getDicData(){
    const _that = this
    getTableData(
      'SYS_FLAG_DATA',
      'FD000013',
      "select dv,dn from SYS_FLAG_DATA_VALUE where dk='FD000013'",
      function (data: any) {
        _that.antibioticlevelList = data
        console.log('抗生素等级');
        console.log(_that.antibioticlevelList);
      }
    )
    getTableData(
      'SYS_PRIMARY_DATA',
      'PD0000000269',
      "select dv,dn from SYS_PRIMARY_DATA_VALUE where dk='PD0000000269'",
      function (data: any) {
        _that.genderList = data
        getTableData(
          'SYS_DICT_CONFIG',
          '4',
          "select dv,dn from SYS_DICT_CONFIG_VALUE where dk='4'",
          function (data: any) {
            _that.officeList = data
            getTableData(
              'SYS_PRIMARY_DATA',
              'PD0000000001',
              "select dv,dn from SYS_PRIMARY_DATA_VALUE where dk='PD0000000001'",
              function (data: any) {
                _that.jobpostList = data
                _that.getLists()
              }
            )
          }
        )
      }
    )
  }

  // =======

  // 姓名除空格
  private nameTrim(value: string){
    this.formData.personname = value.trim()
    //生成拼音五笔
    aPyWb({word: this.formData.personname}).then((res: any) => {
      if(res){
        this.formData.pycode = res.data.pinyin
        this.formData.wbcode = res.data.wubi
      }
    })
  }

  // 工号查重
  private checkEmpNoDup(value: any, callback: any){
    console.log('工号验证')
    if (this.isAdd) {
      console.log('工号验证接口')
      aEmpNoCheck({ rybh: value }).then((res: any) => {
        if (res) {
          if (res.data == 0) {
            callback()
          } else {
            callback(new Error(window.ele.$i18n.t('emp.vdEmpNo1')))
          }
        }
      })
    } else {
      callback()
    }
  }

  // 证件查重
  private checkCardDup(callback: any){
    console.log('证件验证接口')
    var params = {
      cardnum: this.formData.cardnum,
      cardtype: this.formData.cardtype,
      personid: this.formData.personid,
    }
    aCardCheck(params).then((res: any) => {
      if (res) {
        if (res.data == 0) {
          callback()
        } else {
          callback(new Error(window.ele.$i18n.t('emp.vdIDNumberDup')))
        }
      }
    })
  }

  // 身份证验证
  private cardTypeChange(value: number|string){
    // 改变校验规则
    let vIndex = this.formRule.cardnum.findIndex((item: any) => {
      return item.hasOwnProperty('pattern')
    })
    if(value == 1){ // 1是身份证
      if (vIndex == -1) {
        this.formRule.cardnum.push(this.ruleIDCard)
      }
    }else{
      this.isCorrectIDCard = false
      if (vIndex > -1) {
        this.formRule.cardnum.splice(vIndex, 1)
      }
    }
  }

  // 自动填充出生日期 和性别
  private calcBirthday(value: any){
    if(this.formData.cardtype != '01' || (value.length!=18 && value.length!=15)){
      return false
    }
    // 只有身份证才往下执行
    const formData: any = this.$refs.formData
    formData.validateField('cardnum',(valid: any) => {
      if(valid==''){
        let y: string
        let m: string
        let d: string
        let sex: number
        if(this.formData.cardnum.length == 18){
          y = this.formData.cardnum.substr(6,4)
          m = this.formData.cardnum.substr(10,2)
          d = this.formData.cardnum.substr(12,2)
          sex = this.formData.cardnum.substr(16,1)
          this.formData.birthday = `${y}-${m}-${d}`
          this.formData.gender = sex%2==0?2:1
        }
        if(this.formData.cardnum.length == 15){
          y = this.formData.cardnum.substr(6,2)
          m = this.formData.cardnum.substr(8,2)
          d = this.formData.cardnum.substr(10,2)
          sex = this.formData.cardnum.substr(14,1)
          this.formData.birthday = `19${y}-${m}-${d}`
          this.formData.gender = sex%2==0?2:1
        }
        this.isCorrectIDCard = true
      }else{
        // this.formInline.birthday=''
        this.isCorrectIDCard = false
      }
    })
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 108
  }
  mounted() {
    // this.getLists()
    this.getDicData()
  }

}
</script>

<style lang="scss" scoped>
.row .input{
  ::v-deep .el-input__prefix{
    margin: 0 8px 0 10px!important;
  }
}
.checkbox1 {
  margin-left: 20px;
}
span.status{
  font-size: 13px;
}
.el-form{
  >span{
    display: none;
  }
  .search-select{
    margin-right: 0;
  }
  .el-form-item{
    &.kss{
      width: 100%;
    }
    &.ysjj{
      width: 100%;
      ::v-deep textarea{
        +span{
          background: $lightGray;
        }
      }
    }
  }
  .el-textarea{
    ::v-deep .el-textarea__inner{
      border: none;
      background: $lightGray;
    }
  }
}
// 下拉箭头
#cascade-address{
  ::v-deep .is-focus .el-icon-arrow-up{
    transform: rotate(0);
  }
}
</style>
