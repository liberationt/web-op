<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="16">
        <div class="his-module his-small">
          <div class="row header1">
            <div class="label">
              <h1 class="title">{{ '本地大病登记' }}</h1>
              <el-divider direction="vertical"></el-divider>
              <el-radio-group v-model="searchData.type" @change="changeType">
                <el-radio :label="1">医(社)保卡号</el-radio>
                <el-radio :label="2">登记时间</el-radio>
              </el-radio-group>
              <el-input v-if="searchData.type == 1" v-model="searchData.ybkh" :placeholder="'请输入卡号'" @keyup.enter.native="toSearch1" class="search ml10">
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input>
              <el-date-picker v-if="searchData.type == 2" type="date" v-model="searchData.djrq" :placeholder="'请选择日期'" value-format="yyyy-MM-dd" @change="toSearch1" class="date-wrapper ml10"></el-date-picker>
            </div>
            <div class="operate">
              <el-button type="primary" size="mini" class="blue-gra" icon="icon his-add" @click="handleAdd">{{ '登记' }}</el-button>
            </div>
          </div>
          <pagenation-list ref="pageTable" v-model="tableData" data-url="/ybapi-service/shybMzdb/queryPage" :search-data="searchData" http-method="post" :list-height="listSlotHeight">
            <el-table slot="list" stripe ref="table" :highlight-current-row="true" :data="tableFormat" @row-click="getDetail" border v-loading="loading" :height="listSlotHeight" class="scroll-bar" tooltip-effect="light">
              <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>

              <!-- 卡内信息 -->
              <el-table-column prop="knsj" :label="'卡内信息'"></el-table-column>

              <!-- 医(社)保卡号 -->
              <el-table-column prop="ybkh" :label="'医(社)保卡号'" min-width="100px"></el-table-column>

              <!-- 姓名 -->
              <el-table-column prop="brxm" :label="'姓名'"></el-table-column>

              <!-- 身份证号 -->
              <el-table-column prop="sfzh" :label="'身份证号'" min-width="150"></el-table-column>

              <!-- 联系地址 -->
              <el-table-column prop="lxdz" :label="'联系地址'" min-width="140" show-overflow-tooltip></el-table-column>

              <!-- 电话 -->
              <el-table-column prop="dhhm" :label="'电话'" min-width="100"></el-table-column>

              <!-- 疾病诊断 -->
              <el-table-column prop="jbzd" :label="'疾病诊断'" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="jbzdList.find((item) => item.dv == scope.row.jbzd)" class="text-ellipsis">
                    {{ jbzdList.find((item) => item.dv == scope.row.jbzd).dn }}
                  </div>
                  <div v-else>{{ scope.row.jbzd }}</div>
                </template>
              </el-table-column>

              <!-- 治疗项目 -->
              <el-table-column prop="zlxm" :label="'治疗项目'">
                <template slot-scope="scope">
                  <div v-if="zlxmList.find((item) => item.dv == scope.row.zlxm)" class="text-ellipsis">
                    {{ zlxmList.find((item) => item.dv == scope.row.zlxm).dn }}
                  </div>
                  <div v-else>{{ scope.row.zlxm }}</div>
                </template>
              </el-table-column>

              <!-- 医疗机构名称 -->
              <el-table-column prop="yymc" :label="'医疗机构名称'" min-width="100px"></el-table-column>

              <!-- 医师签名 -->
              <el-table-column prop="ysgh" :label="'医师签名'">
                <template slot-scope="scope">
                  <div v-if="docList.find((item) => item.dv == scope.row.ysgh)" class="text-ellipsis">
                    {{ docList.find((item) => item.dv == scope.row.ysgh).dn }}
                  </div>
                  <div v-else>{{ scope.row.ysgh }}</div>
                </template>
              </el-table-column>

              <!-- 经办人 -->
              <el-table-column prop="jbr" :label="'经办人'">
                <template slot-scope="scope">
                  <div v-if="usersList.find((item) => item.dv == scope.row.jbr)" class="text-ellipsis">
                    {{ usersList.find((item) => item.dv == scope.row.jbr).dn }}
                  </div>
                  <div v-else>{{ scope.row.jbr }}</div>
                </template>
              </el-table-column>

              <!-- 被委托人签名 -->
              <el-table-column prop="bwtr" :label="'被委托人签名'" min-width="100px"></el-table-column>

              <!-- 身份证 -->
              <el-table-column prop="sfzh2" :label="'身份证'"></el-table-column>

              <!-- 登记时间 -->
              <el-table-column prop="djrq" :label="'登记时间'"></el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col class="ht" :span="8">
        <div class="his-module his-small">
          <div class="row header2">
            <div class="label">
              <h1 class="title">登记</h1>
              <el-divider direction="vertical"></el-divider>
              <div class="btn">
                <el-button type="text" size="mini" @click="readCard('read')"> <i class="icon his-reading-card"></i>医保读卡 </el-button>
              </div>
            </div>
            <div class="operate">
              <el-button type="primary" size="mini" class="green-gra" icon="icon his-save" @click="handleSubmit" :loading="showLoading">{{ $t('common.save') }}</el-button>
            </div>
          </div>
          <div class="form-wrap scroll-bar">
            <el-form :model="formData" :rules="formRule" ref="formData" label-width="90px" class="clearfix">
              <!-- 卡内信息 -->
              <el-form-item :label="'卡内信息'" prop="knsj">
                <el-input v-model.trim="formData.knsj" :placeholder="'请输入卡内信息'" @keyup.enter.native="readCard(formData.knsj)"></el-input>
              </el-form-item>

              <!-- 医(社)保卡号 -->
              <el-form-item :label="'医(社)保卡号'" prop="ybkh">
                <el-input v-model.trim="formData.ybkh" :placeholder="'请输入卡号'"></el-input>
              </el-form-item>

              <!-- 姓名 -->
              <el-form-item :label="$t('common.name')" prop="brxm">
                <el-input v-model="formData.brxm" :placeholder="$t('emp.phName')" maxlength="100"></el-input>
              </el-form-item>

              <!-- 身份证号 -->
              <el-form-item :label="'身份证号'" prop="sfzh">
                <el-input v-model="formData.sfzh" :placeholder="$t('emp.phIDNumber')" maxlength="50"></el-input>
              </el-form-item>

              <!-- 联系地址 -->
              <el-form-item :label="'联系地址'" prop="lxdz">
                <el-input v-model="formData.lxdz" :placeholder="'请输入联系地址'"></el-input>
              </el-form-item>

              <!-- 电话 -->
              <el-form-item :label="'电话'" prop="dhhm">
                <el-input v-model="formData.dhhm" :placeholder="'请输入电话'"></el-input>
              </el-form-item>

              <!-- 疾病诊断 -->
              <el-form-item :label="'疾病诊断'" prop="jbzd">
                <search-select table-name="SYS_DICT_CONFIG" kid="70" v-model="formData.jbzd" :backfillValue="formData.jbzd" :placeholder="'请选择疾病诊断'" />
              </el-form-item>

              <!-- 治疗项目 -->
              <el-form-item :label="'治疗项目'" prop="zlxm">
                <search-select table-name="SYS_DICT_CONFIG" kid="69" v-model="formData.zlxm" :backfillValue="formData.zlxm" :placeholder="'请选择治疗项目'" />
              </el-form-item>

              <!-- 医疗机构名称 -->
              <el-form-item :label="'医疗机构名称'" prop="yymc">
                <el-input v-model="formData.yymc" :placeholder="'请选择'"></el-input>
              </el-form-item>

              <!-- 医师签名 -->
              <el-form-item :label="'医师签名'" prop="ysgh">
                <el-input v-model="formData.ysgh" :placeholder="'请输入医师签名'"></el-input>
              </el-form-item>

              <!-- 经办人 -->
              <el-form-item :label="'经办人'" prop="jbr">
                <el-input v-model="formData.jbr" :placeholder="'请输入经办人'"></el-input>
              </el-form-item>

              <!-- 被委托人签名 -->
              <el-form-item :label="'被委托人签名'" prop="bwtr">
                <el-input v-model="formData.bwtr" :placeholder="'请输入被委托人签名'"></el-input>
              </el-form-item>

              <!-- 身份证 -->
              <el-form-item :label="'身份证'" prop="zfzh2">
                <el-input v-model="formData.sfzh2" :placeholder="'请输入身份证'"></el-input>
              </el-form-item>

              <!-- 登记时间 -->
              <el-form-item :label="'登记时间'" prop="djrq">
                <el-date-picker v-model="formData.djrq" type="date" value-format="yyyy-MM-dd" :placeholder="$t('emp.phDate')" class="date-wrapper"></el-date-picker>
              </el-form-item>

              <!-- id -->
              <el-form-item label="id" prop="personid" style="display: none">
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
import { aAdd } from '@/api/his/op/reg/localSeriousIllness.ts'
import { aReadMedAcc } from '@/api/his/basic'
import { regInt, regIDCard, regPhone, regTel, regEmail } from '@/utils/validate.ts'
import { getTableData } from '@/websql/functions'
import { id2Name } from '@/utils'

@Component({
  name: '',
})
export default class extends Vue {
  private tableData: any[] = []
  private searchData: any = {
    type: 1,
    ybkh: '',
    djrq: '',
  }
  private listSlotHeight: number = 0 //列表高度
  private loading: boolean = false
  private rightTitle = window.ele.$i18n.t('common.add')
  private isAdd: boolean = true // 新增/修改
  private showLoading:boolean = false
  private formData: any = {
    knsj: '', // 卡内信息
    ybkh: '', // 医保卡号
    brxm: '',
    sfzh: '',
    lxdz: '',
    dhhm: '',
    jbzd: '',
    zlxm: '', // 治疗项目
    yymc: '', // 医院名称
    ysgh: '', // 医生工号
    jbr: '',
    bwtr: '',
    sfzh2: '',
    djrq: '', // 登记日期
  }

  private formRule: any = {
    brxm: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
    djrq: [{ required: true, message: '登记时间不能为空', trigger: 'blur' }],
  }
  private ruleIDCard: any = { pattern: regIDCard, message: window.ele.$i18n.t('emp.vdIDCard2'), trigger: 'blur' }
  private isCorrectIDCard: boolean = false // 身份证号是否正确
  private antibioticlevelList: any[] = [] // 字典数据-抗生素等级
  private antibioticlevelChecked: any[] = [] // 选中的抗生素等级
  private genderList: any[] = [] // 字典数据-性别
  private officeList: any[] = [] // 字典数据-科室
  private jobpostList: any[] = [] // 字典数据-行政职务

  private backfillObj: any = {
    // 初始化省市区
    provinceId: 0,
    cityId: 0,
    areaId: 0,
  }
  private addressValue: string = '' //省市区id，字符串
  private zlxmList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SERIOUSILLNESS_ZLXM : this.$store.state.webSqlDict.SERIOUSILLNESS_ZLXM // 治疗项目
  private jbzdList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SERIOUSILLNESS_JBZD : this.$store.state.webSqlDict.SERIOUSILLNESS_JBZD // 疾病诊断
  private docList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT // 医生
  private usersList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.USERS_DICT : this.$store.state.webSqlDict.USERS_DICT // 用户列表

  // 监听方法
  @Watch('tableData')
  private onValueChange(value: any) {
    this.loading = false
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

  private changeType(value: any) {
    if (value == 1) {
      this.searchData.djrq = ''
    } else {
      this.searchData.ybkh = ''
    }
  }

  // 条件查询
  private toSearch1() {
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
    if (this.formData.antibioticlevel) {
      this.antibioticlevelChecked = this.formData.antibioticlevel.split(',')
    } else {
      this.antibioticlevelChecked = []
    }
    // 生日、性别不可修改
    if (this.formData.cardtype == 1) {
      this.isCorrectIDCard = true
    } else {
      this.isCorrectIDCard = false
    }
  }

  // 读卡
  private readCard(carddata: any) {
    aReadMedAcc(carddata).then((res: any) => {
      if (res) {
        if (carddata != 'read') {
          this.formData.knsj = carddata
        }
        this.formData.ybkh = res.data.cardid
        this.formData.brxm = res.data.personname
        this.formData.sfzh = res.data.sfzh
      }
    })
  }

  // 新增按钮
  private handleAdd() {
    this.rightTitle = window.ele.$i18n.t('common.add')
    this.isAdd = true
    const formData: any = this.$refs.formData
    formData.resetFields()
    this.antibioticlevelChecked = []
  }

  // 保存按钮
  private handleSubmit() {
    const formData: any = this.$refs.formData
    formData.validate((valid: any) => {
      if (valid) {
        this.showLoading = true
        this.formData.antibioticlevel = this.antibioticlevelChecked.toString()
        // return false
        if (this.isAdd) {
          this.add()
        } else {
          this.add()
        }
      }
    })
  }

  // 发起新增
  private add() {
    aAdd(this.formData).then((res: any) => {
      this.showLoading = false
      if (res) {
        this.$notify({
          title: this.$t('emp.msgAdd').toString(),
          message: '',
          type: 'success',
        })
        const formData: any = this.$refs.formData
        formData.resetFields()
        this.antibioticlevelChecked = []
        this.getLists()
      }
    }).catch((err:any)=>{
      this.showLoading = false
    })
  }

  // 发起修改
  private editEmp() {
    // aEmpEdit(this.formData).then((res: any) => {
    //   if(res){
    //     this.$notify({
    //       title: this.$t('emp.msgEdit').toString(),
    //       message: '',
    //       type: 'success',
    //     })
    //     this.getLists()
    //   }
    // })
  }

  // 注销/复原
  private confirm(row: any) {
    if (row.logoff == 0) {
      // aEmpLock({personid: row.personid}).then((res: any) => {
      //   if(res){
      //     this.$notify({
      // 			type: 'success',
      // 			title: this.$t('emp.msgLogof').toString(),
      // 			message: ''
      // 		})
      // 		this.getLists()
      // 		// 只查询未注销，则清空表单
      // 		if(this.searchData.queryAllData == 0){
      // 			// const formInline11: any = this.$refs.formInline
      // 			// formInline11.resetFields()
      // 		}
      //   }
      // })
    } else {
      // aEmpUnLock({personid: row.personid}).then((res: any) => {
      //   if(res){
      //     this.$notify({
      // 				type: 'success',
      // 				title: this.$t('emp.msgRestore').toString(),
      // 				message: ''
      // 		})
      // 		this.getLists()
      //   }
      // })
    }
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 104
  }
  mounted() {
    this.getLists()
    console.log(this.jbzdList)
    console.log(this.zlxmList)
  }
}
</script>

<style lang="scss" scoped>
.header1 ::v-deep {
  .search {
    width: 150px !important;
    .el-input__inner {
      width: 100% !important;
      font-size: 13px;
    }
  }
  .date-wrapper {
    width: 150px;
  }
  .el-select {
    .el-input__icon {
      line-height: 28px;
    }
  }
  .el-radio-group {
    .el-radio {
      margin-right: 10px;
      .el-radio__label {
        padding-left: 4px;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
.header2 {
  .card {
    ::v-deep .icon {
      font-size: 16px;
    }
  }
}
span.status {
  font-size: 13px;
}
.el-form {
  padding: 0 30px !important;
  .search-select {
    margin-right: 0;
  }
  .el-form-item {
    float: none;
    width: 100%;
  }
  .el-textarea {
    ::v-deep .el-textarea__inner {
      border: none;
      background: $lightGray;
    }
  }
}
// 下拉箭头
#cascade-address {
  ::v-deep .is-focus .el-icon-arrow-up {
    transform: rotate(0);
  }
}
</style>
