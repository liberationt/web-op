<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="13">
        <div class="his-module his-small">
          <div class="row row-left">
            <div class="label">
              <h1 class="title">{{$t('emp.title1')}}</h1>
              <el-input
                v-model="searchData.searchPharm"
                :placeholder="$t('emp.phSearch')"
                @change="toSearch1"
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
            data-url="/op-service/ehrservicepersonal/queryPage"
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
                prop="empNo"
                :label="$t('emp.empNo')"
                width="100"
              ></el-table-column>
              <el-table-column prop="personName" :label="$t('common.name')"></el-table-column>
              <el-table-column
                prop="sexName"
                :label="$t('common.sex')"
                width="70"
              ></el-table-column>
              <el-table-column prop="deptName" :label="$t('common.dept')" show-overflow-tooltip></el-table-column>
              <el-table-column
                prop="postName"
                :label="$t('emp.postClass')"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column :label="$t('common.action')" width="70" align="center">
                <template slot-scope="scope">
                  <el-tooltip
                    :content="scope.row.unvalidDate == null ? $t('common.logOff') : $t('common.restore')"
                    effect="light"
                  >
                    <el-popconfirm
											:title="scope.row.unvalidDate == null ? $t('emp.logOffEmp') : $t('emp.restoreEmp')"
											:confirmButtonText="$t('common.confirm')"
											:cancelButtonText="$t('common.cancel')"
                      @confirm="confirm(scope.row)"
											hideIcon
                    >
                      <el-button
                        slot="reference"
                        :class="scope.row.unvalidDate == null ? 'red' : 'green'"
                      >
                        <i
                          class="icon"
                          :class="
                            scope.row.unvalidDate == null ? 'his-cancellation' : 'his-invocation'
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
                class="blue-gra"
                icon="icon his-save"
                @click="handleSubmit"
              >{{$t('common.save')}}</el-button>
            </div>
          </div>
          <div class="form-wrap scroll-bar">
            <el-form
              ref="formInline"
              :model="formInline"
              :rules="ruleInline"
              label-width="70px"
              class="clearfix"
            >
              <!-- 工号 -->
              <el-form-item :label="$t('emp.empNo')" prop="empNo">
                <el-input
                  v-model.trim="formInline.empNo"
                  :placeholder="$t('emp.phEmpNo')"
                ></el-input>
              </el-form-item>

              <!-- 姓名 -->
              <el-form-item :label="$t('common.name')" prop="personName">
                <el-input
                  v-model="formInline.personName"
                  :placeholder="$t('emp.phName')"
                  @change="nameTrim"
                ></el-input>
              </el-form-item>

              <!-- 证件类型 -->
              <el-form-item :label="$t('emp.cerType')" prop="recordType">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000260"
                  v-model="formInline.recordType"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formInline.recordType"
                  :disabled="false"
                  @change="recordTypeChange"
                />
              </el-form-item>

              <!-- 证件号码 -->
              <el-form-item :label="$t('emp.IDNumber')" prop="recordNumber">
                <el-input
                  v-model="formInline.recordNumber"
                  :placeholder="$t('emp.phIDNumber')"
                  @input="calcBirthday"
                ></el-input>
              </el-form-item>

              <!-- 出生日期 -->
              <el-form-item :label="$t('common.birthday')" prop="birthday">
                <el-date-picker
                  v-model="formInline.birthday"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :placeholder="$t('emp.phDate')"
                  :disabled="isCorrectIDCard"
                ></el-date-picker>
              </el-form-item>

              <!-- 性别 -->
              <el-form-item :label="$t('common.sex')" prop="sexId">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000269"
                  v-model="formInline.sexId"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formInline.sexId"
                  :disabled="isCorrectIDCard"
                />
              </el-form-item>

              <!-- 婚姻状况 -->
              <el-form-item :label="$t('emp.marriage')" prop="marriageTypeId">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000137"
                  v-model="formInline.marriageTypeId"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formInline.marriageTypeId"
                />
              </el-form-item>

              <!-- 国籍 -->
              <el-form-item :label="$t('emp.country')" prop="countryId">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000271"
                  v-model="formInline.countryId"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formInline.countryId"
                />
              </el-form-item>

              <!-- 民族 -->
              <el-form-item :label="$t('emp.nation')" prop="nationId">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000215"
                  v-model="formInline.nationId"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formInline.nationId"
                />
              </el-form-item>

              <!-- 最高学位 -->
              <el-form-item :label="$t('emp.academicDegree')" prop="academicDegreeId">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000447"
                  v-model="formInline.academicDegreeId"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formInline.academicDegreeId"
                />
              </el-form-item>

              <!-- 最高学历 -->
              <el-form-item :label="$t('emp.degree')" prop="degreeId">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000346"
                  v-model="formInline.degreeId"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formInline.degreeId"
                />
              </el-form-item>

              <!-- 职务等级 -->
              <el-form-item :label="$t('emp.postClass')" prop="postClassId">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000471"
                  v-model="formInline.postClassId"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formInline.postClassId"
                  @change="postClassChange"
                />
              </el-form-item>

              <!-- 职称等级 -->
              <el-form-item :label="$t('emp.titleClass')" prop="titleClassId">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000427"
                  v-model="formInline.titleClassId"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formInline.titleClassId"
                />
              </el-form-item>

              <!-- 科室 -->
              <el-form-item :label="$t('emp.dept')" prop="deptId">
                <search-select
                  table-name="SYS_DICT_CONFIG"
                  kid="4"
                  v-model="formInline.deptId"
                  placeholder="请选择"
                  :backfillValue="formInline.deptId"
                />
              </el-form-item>

              <!-- 职工分类 -->
              <el-form-item :label="$t('emp.personClass')" prop="personClassId">
                <search-select
                  table-name="SYS_FLAG_DATA"
                  kid="FD000056"
                  v-model="formInline.personClassId"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formInline.personClassId"
                />
              </el-form-item>
              <!-- 手机号码 -->
              <el-form-item :label="$t('common.phone')" prop="mobileNumber">
                <el-input
                  v-model="formInline.mobileNumber"
                  :placeholder="$t('emp.phPhone')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('emp.officeTel')" prop="officeTelephone">
                <el-input
                  v-model="formInline.officeTelephone"
                  :placeholder="$t('emp.phOfficeTel')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('emp.entryDate')" prop="entryDate">
                <el-date-picker
                  v-model="formInline.entryDate"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                :placeholder="$t('emp.phDate')"
                ></el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('common.email')" prop="email">
                <el-input
                  v-model="formInline.email"
                  :placeholder="$t('emp.phEmail')"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('emp.doctorYbCode')" prop="doctorYbCode">
                <el-input
                  v-model="formInline.doctorYbCode"
                  :placeholder="$t('emp.phDoctorYbCode')"
                ></el-input>
              </el-form-item>

              <!-- 省市区 -->
              <el-form-item class="province" :label="$t('emp.province')">
                <cascade-address
                  :backfillObj='backfillObj'
                  v-model="addressValue"
                  :key="cascadeIndex"
                  id="cascade-address"
                />
              </el-form-item>

              <!-- 详细地址 -->
              <el-form-item class="address" :label="$t('common.address')" prop="townshipAddr">
                <el-input v-model="formInline.townshipAddr"></el-input>
              </el-form-item>
              <el-form-item label="id" prop="personId" style="display: none;">
                <el-input v-model="formInline.personId"></el-input>
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
  querySysgroupList,
  addEhrservicepersonal,
  editEhrservicepersonal,
  lock,
  unlock,
  getOneSysgroup,
  findSysgroupList,
  checkEmpNo,
  checkCert
} from '@/api/his/user/workerManager.ts'
import { getTableData, dictExecuteSql } from '@/websql/functions'
import { id2Name } from '@/utils'
import { regInt, regIDCard, regPhone, regTel, regEmail } from '@/utils/validate.ts'

@Component({
  name: 'employeeregistration',
  filters: {},
})
export default class extends Vue {
  // 查询条件
  private searchData: any = {
    queryAllData: 0,
    searchPharm: '',
  }
  private dialogVisible1: boolean = false
  private tableData: any[] = []
  private loading = true
  private rightTitle = window.ele.$i18n.t('common.add')
  private current: number = -1
  private formInline: any = {
    personId: '', // 人员id
    empNo: '',
    personName: '',
    recordType: '1',// 证件类型，默认身份证
    birthday: '',
    recordNumber: '',
    sexId: '',
    marriageTypeId: '10', // 未婚
    countryId: '156', // 中国
    nationId: '1', // 汉族
    townshipAddr: '',
    academicDegreeId: '', // 学位
    degreeId: '', // 学历
    postClassId: '', /// 职务等级
    titleClassId: '', //职称等级
    deptId: '',
    personClassId: '', //职工分类
    mobileNumber: '',
    officeTelephone: '',
    entryDate: '',
    email: '',
    doctorYbCode: '',
    provinceId: '',
    cityId: '',
    countyId: ''
  }
  private addressValue: string = ''//省市区id，字符串
  private backfillObj: any = {// 初始化省市区
    provinceId: 0,
    cityId: 0,
    areaId: 0
  }
  private cascadeIndex: number = 1
  private isCreateNewWorker: boolean = true // true为新增，false为保存
  // 工号查重
  private validateEmpNo = (rule: any, value: any, callback: any) => {
    if (this.isCreateNewWorker) {
      checkEmpNo({ empNo: value }).then((res: any) => {
        if (res.errorCode == 'SUCCESS') {
          if (res.data) {
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
  private validateCert = (rule: any, value: any, callback: any) => {
    this.checkCertDup(callback)
  }

  private ruleInline: any = {
    empNo: [
      { required: true, message: window.ele.$i18n.t('emp.vdEmpNo'), trigger: 'blur' },
      { pattern: regInt, message:'请输入数字', trigger: 'blur' },
      { max: 50, message: window.ele.$i18n.t('emp.vdEmpNo2'), trigger: 'blur' }
    ],
    personName: [
      { required: true, message: window.ele.$i18n.t('emp.vdEmpName'), trigger: 'blur' },
      { max: 300, message: window.ele.$i18n.t('emp.vdEmpName1'), trigger: 'blur' }
    ],
    deptId: [
      { required: true, message: window.ele.$i18n.t('emp.vdEmpDept'), trigger: 'blur' },
      // { pattern: regInt, message: '请输入整数', trigger: 'blur' }// 暂时
    ],
    recordType: [
      { required: true, message: window.ele.$i18n.t('emp.vdCerType'), trigger: 'blur' },
    ],
    // 校验证件号码
    recordNumber: [
      { required: true, message: window.ele.$i18n.t('emp.vdIDNumber'), trigger: 'blur' },
      // { pattern: regIDCard, message: window.ele.$i18n.t('emp.vdIDCard2'), trigger: 'blur' }
      { validator: this.validateCert, trigger: 'blur' }
    ],
    mobileNumber: [
      {pattern: regPhone, message: window.ele.$i18n.t('emp.vdPhone'), trigger: 'blur'}
    ],
    officeTelephone: [
      {pattern: regTel, message: window.ele.$i18n.t('emp.vdTel'), trigger: 'blur'}
    ],
    email: [
      {pattern: regEmail, message: window.ele.$i18n.t('emp.vdEmail'), trigger: 'blur'}
    ],
    doctorYbCode: []
  }
  private ruleEmpNoAdd: any = { validator: this.validateEmpNo, trigger: 'blur' }
  private ruleIDCard: any = { pattern: regIDCard, message: window.ele.$i18n.t('emp.vdIDCard2'), trigger: 'blur' }
  private ruleDoctorYbCode: any = { required: true,message: window.ele.$i18n.t('emp.vdDoc'), trigger: 'blur' }
  private sexList: any[] = [] // 性别列表
  private deptList: any[] = [] // 科室列表
  private postList: any[] = [] // 职务等级列表
  private currentRowId: number = -1 // 当前行的id
  private listSlotHeight: number = 0
  private isCorrectIDCard: boolean = false // 身份证号是否正确

  // 证件类型改变
  private recordTypeChange(value: number){
    // 改变校验规则
    let vIndex = this.ruleInline.recordNumber.findIndex((item: any) => {
      return item.hasOwnProperty('pattern')
    })
    if(value == 1){ // 1是身份证
      if (vIndex == -1) {
        this.ruleInline.recordNumber.push(this.ruleIDCard)
      }
    }else{
      this.isCorrectIDCard = false
      if (vIndex > -1) {
        this.ruleInline.recordNumber.splice(vIndex, 1)
      }
    }
  }

  // 职务等级改变
  private postClassChange(value: number|string){
    let arrDoc: any[] = ['231','232','233','234','235']
    if(arrDoc.includes(value)){
      this.ruleInline.doctorYbCode.push(this.ruleDoctorYbCode)
    }else{
      this.ruleInline.doctorYbCode = []
    }
  }

  // 证件查重方法
  private checkCertDup(callback: any){
    if(this.isCreateNewWorker){
      let cert: any = {
        recordType: this.formInline.recordType,
        recordNumber: this.formInline.recordNumber
      }
      checkCert(cert).then((res:any)=>{
        if(res.data){
          callback()
        }else{
          callback(new Error(this.$t('emp.vdIDNumberDup').toString()))
        }
      })
    }else{
      callback()
    }
  }

  // 自动填充出生日期 和性别
  private calcBirthday(value: any){
    if(this.formInline.recordType != 1 || (value.length!=18 && value.length!=15)){
      return false
    }
    // 只有身份证才往下执行
    const formInline11: any = this.$refs.formInline
    formInline11.validateField('recordNumber',(valid: any) => {
      if(valid==''){
        let y: string
        let m: string
        let d: string
        let sex: number
        if(this.formInline.recordNumber.length == 18){
          y = this.formInline.recordNumber.substr(6,4)
          m = this.formInline.recordNumber.substr(10,2)
          d = this.formInline.recordNumber.substr(12,2)
          sex = this.formInline.recordNumber.substr(16,1)
          this.formInline.birthday = `${y}-${m}-${d}`
          this.formInline.sexId = sex%2==0?2:1
        }
        if(this.formInline.recordNumber.length == 15){
          y = this.formInline.recordNumber.substr(6,2)
          m = this.formInline.recordNumber.substr(8,2)
          d = this.formInline.recordNumber.substr(10,2)
          sex = this.formInline.recordNumber.substr(14,1)
          this.formInline.birthday = `19${y}-${m}-${d}`
          this.formInline.sexId = sex%2==0?2:1
        }
        this.isCorrectIDCard = true
      }else{
        // this.formInline.birthday=''
        this.isCorrectIDCard = false
      }
    })
  }

  // 获取列表
  getLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.getList()
  }

  // 条件查询
  searchLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
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
      this.searchData.queryAllData = 1
    } else {
      // 只查询未注销
      this.searchData.queryAllData = 0
    }
    this.searchLists()
  }


    // 注销/复原
  private confirm(row: any){
		if(row.unvalidDate==null){
			lock({personId: row.personId}).then((res:any)=>{
				if(res.errorCode=="SUCCESS"){
					this.$notify({
						type: 'success',
						title: this.$t('emp.msgLogof').toString(),
						message: ''
					})
					this.getLists()
					// 只查询未注销，则清空表单
					if(this.searchData.queryAllData == 0){
						const formInline11: any = this.$refs.formInline
						formInline11.resetFields()
					}
				}
			});
		}else{
			unlock({personId: row.personId}).then((res:any)=>{
				if(res.errorCode=="SUCCESS"){
					this.$notify({
							type: 'success',
							title: this.$t('emp.msgRestore').toString(),
							message: ''
					})
					this.getLists()
				}
			});
		}
  }



  // 获取详情
  getDetail(row: any) {
    this.rightTitle = window.ele.$i18n.t('common.edit')
    for (let i in this.formInline) {
      this.formInline[i] = row[i]
    }
    // 显示省市区
    this.addressValue = ''
    this.backfillObj.provinceId=this.formInline.provinceId;
    this.backfillObj.cityId=this.formInline.cityId;
    this.backfillObj.areaId=this.formInline.countyId;
    this.cascadeIndex++
    this.isCreateNewWorker = false
    this.currentRowId = row.personId
    // 改变校验规则
    let vIndex = this.ruleInline.empNo.findIndex((item: any) => {
      console.log(item)
      return item.hasOwnProperty('validator')
    })
    if (vIndex > -1) {
      this.ruleInline.empNo.splice(vIndex, 1)
    }
    console.log(this.ruleInline.empNo)
    // 清空校验结果
    const formInline11: any = this.$refs.formInline
    formInline11.clearValidate()
    this.recordTypeChange(row.recordType)
    if(this.formInline.recordType == 1){
      this.isCorrectIDCard = true
    }else{
      this.isCorrectIDCard = false
    }
  }

  // 新增按钮
  private handleAdd() {
    this.rightTitle = window.ele.$i18n.t('common.add')
    const formInline11: any = this.$refs.formInline
    formInline11.resetFields()
    // 清空省市区
    this.addressValue = ''
    this.backfillObj.provinceId=0;
    this.backfillObj.cityId=0;
    this.backfillObj.areaId=0;
    this.cascadeIndex++
    this.isCreateNewWorker = true
    this.currentRowId = -1
    this.isCorrectIDCard = false
    const table: any = this.$refs.table
    table.setCurrentRow() // 取消高亮
    // 改变校验规则
    let vIndex = this.ruleInline.empNo.findIndex((item: any) => {
      return item.hasOwnProperty('validator')
    })
    if (vIndex == -1) {
      this.ruleInline.empNo.push(this.ruleEmpNoAdd)
    }
    console.log(this.ruleInline.empNo)
    this.ruleInline.doctorYbCode = []
  }

  // 保存按钮
  private handleSubmit() {
    const formInline: any = this.$refs.formInline
    formInline.validate((valid: any) => {
      if (valid) {
        if (this.addressValue != "") {
            //有值才能split
            let arr = this.addressValue.split(",");
            this.formInline.provinceId = arr[0];
            this.formInline.cityId = arr[1];
            this.formInline.countyId = arr[2];
        }
        if (this.isCreateNewWorker) {
          this.addNewWorker()
        } else {
          this.editWorker()
        }
      }
    })
  }

  // 发起新增
  private addNewWorker() {
    addEhrservicepersonal(this.formInline).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.getLists()
        this.$notify({
          title: this.$t('emp.msgAdd').toString(),
          message: '',
          type: 'success',
        })
      }
    })
  }

  // 发起修改
  private editWorker() {
    editEhrservicepersonal(this.formInline).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.getLists()
        this.$notify({
          title: this.$t('emp.msgEdit').toString(),
          message: '',
          type: 'success',
        })
      }
    })
  }

  // 姓名除空格
  private nameTrim(value: string){
    this.formInline.personName = value.trim()
  }

  // 新增数据按钮
  clickAddData() {}

  get tableFormat() {
    let newData: any = []
    newData = id2Name(this.tableData, 'sexId', 'sexName', this.sexList, 'dv', 'dn')
    newData = id2Name(this.tableData, 'deptId', 'deptName', this.deptList, 'dv', 'dn')
    newData = id2Name(this.tableData, 'postClassId', 'postName', this.postList, 'dv', 'dn')
    return newData
  }

  // 监听方法
  @Watch('tableData')
  private onValueChange(value: any) {
    this.loading = false
    // 修改保存后当前行维持高亮
    let currentRowIndex = value.findIndex((item: any) => {
      return item.personId == this.currentRowId
    })
    const table: any = this.$refs.table
    table.setCurrentRow(this.tableData[currentRowIndex])
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 120
  }

  mounted() {
    this.ruleInline.empNo.push(this.ruleEmpNoAdd) // 初始就改变校验规则
    this.ruleInline.recordNumber.push(this.ruleIDCard) // 默认添加身份证规则
    const _that = this
    getTableData(
      'SYS_PRIMARY_DATA',
      'PD0000000269',
      "select dv,dn from SYS_PRIMARY_DATA_VALUE where dk='PD0000000269'",
      function (data: any) {
        _that.sexList = data
        getTableData(
          'SYS_DICT_CONFIG',
          '4',
          "select dv,dn from SYS_DICT_CONFIG_VALUE where dk='4'",
          function (data: any) {
            _that.deptList = data
            getTableData(
              'SYS_PRIMARY_DATA',
              'PD0000000471',
              "select dv,dn from SYS_PRIMARY_DATA_VALUE where dk='PD0000000471'",
              function (data: any) {
                _that.postList = data
                _that.getLists()
              }
            )
          }
        )
      }
    )

    // 下拉箭头
    var dom: any = document.getElementById("cascade-address")
    var domArr: any = dom.getElementsByClassName("el-select__caret")
    for(let i of domArr){
      i.classList.add("el-icon-arrow-up")
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox1 {
  margin-left: 20px;
}
// 下拉箭头
#cascade-address{
  ::v-deep .is-focus .el-icon-arrow-up{
    transform: rotate(0);
  }
}
</style>
