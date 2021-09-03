<!--
 * @Date: 2020-05-27 13:56:39
 * @LastEditTime: 2020-06-12 14:05:58
 * @Description: 病人列表
 * @FilePath: \web-op\src\views\cis\op\dctwork\outpatinetClinic\patientList\index.vue
-->
<template>
  <div class="content">
    <div class="his-module his-small">
      <pagenation-list
        ref="pageTable"
        data-url="/op-service/shybyszcxx/queryPage"
        v-model="tableData"
        :searchData="searchData"
        http-method="post"
        :list-height="listSlotHeight"
      >
        <div slot="header" class="row">
          <div class="label">
            <h1 class="title">{{$t('病人列表')}}</h1>
            <el-divider direction="vertical" class="mr4"></el-divider>
            <el-radio-group v-model="radio">
              <el-radio :label="3">待诊</el-radio>
              <el-radio :label="6">暂挂</el-radio>
              <el-radio :label="9">已诊</el-radio>
            </el-radio-group>
          </div>
          <div class="label">
            <span>{{"就诊卡号"}}</span>
            <el-input
              v-model="searchData.doctorName"
              placeholder="请输入..."
              @keydown.native.enter="getList"
              clearable
              style="margin-left:10px"
            >
              <i slot="prefix" class="el-input__icon icon his-search"></i>
            </el-input>
            <el-divider direction="vertical"></el-divider>
            <div class="btn">
              <el-button size="mini" type="text">
                <i class="his-btn-copy icon"></i>
                {{"开诊(F1)"}}
              </el-button>
              <el-button size="mini" type="text">
                <i class="his-print icon"></i>
                {{"医保读卡(F2)"}}
              </el-button>
              <el-button size="mini" type="text">
                <i class="icon his-btn-add"></i>
                {{"就诊(F3)"}}
              </el-button>
              <el-button size="mini" type="text">
                <i class="icon his-btn-add"></i>
                {{"刷新(F4)"}}
              </el-button>
              <el-button size="mini" type="text">
                <i class="icon his-btn-add"></i>
                {{"下一个病人(F5)"}}
              </el-button>
            </div>
          </div>
        </div>
        <el-table
          slot="list"
          stripe
          :data="tableData"
          border
          lazy
          :height="listSlotHeight"
          class="scroll-bar"
        >
          <el-table-column label prop="webSortNumber" width="32" align="center"></el-table-column>
          <el-table-column :label="'排队序号'" prop="drugCode" width="70"></el-table-column>
          <el-table-column :label="'就诊卡号'" prop="medicalCode" width="70"></el-table-column>
          <el-table-column :label="'门诊号码'" prop="drugName" min-width="70"></el-table-column>
          <el-table-column :label="'姓名'" prop="commonName" min-width="130"></el-table-column>
          <el-table-column :label="'性别'" prop="specifications" width="45"></el-table-column>
          <el-table-column :label="'性质'" prop="unit" width="70"></el-table-column>
          <el-table-column :label="'年龄'" prop="forms" width="60"></el-table-column>
          <el-table-column :label="'挂号时间'" prop="drugGrade" width="150"></el-table-column>
          <el-table-column :label="'挂号类型'" prop="drugType" width="70"></el-table-column>
          <el-table-column
            :label="'就诊医生'"
            prop="buyPirce"
            width="100"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </el-table>
      </pagenation-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  IForm,
  addData,
  editData,
  statusLock,
  statusUnlock,
} from '@/api/his/medinsuinterface/physicianRegister.ts'
import { Form } from 'element-ui'

// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'patientList',
  filters: {},
  components: {},
})
export default class extends Vue {
  // 表格数据
  private tableData: any[] = [
    {
      index: 12,
      drugCode: '10101003',
      medicalCode: 'XN00000',
      drugName: '10013',
      commonName: '测试用户',
      specifications: '女',
      unit: '普通自费',
      forms: '84岁',
      drugGrade: '2020-05-28 23:23:23',
      drugType: '窗口挂号',
      buyPirce: '门诊住院',
      retailPirce: '24.3200',
      drugHome: '湖南尔康湘药',
      drugStorge: '常温',
      medicalCategory: '乙类',
      medicalPreCate: '非医保药',
      englishName: 'Sulbenicillin Sodium for Injection',
      designatedDrugs: '抗菌药物',
      shelfNumber: 'NG001',
    },
  ]
  // 搜索内容
  private searchData: any = {
    doctorName: '',
  }
  private radio: number = 1
  //模态框状态
  private isMask = false
  private isVisiable = false
  private showUpload = false
  //表单数据
  private form: any = {}

  //初始表单数据
  private originForm: IForm = {
    beginDate: '',
    birthday: '',
    caption: '',
    cerDate: '',
    deptName1: '',
    deptName2: '',
    deptName3: '',
    doctorLevel: '',
    doctorName: '',
    doctorSex: '',
    doctorType: '',
    doctorYbCode: '',
    documentNo: '',
    documentType: '',
    empNo: '',
    endDate: '',
    highEdu: '',
    hspCode: '',
    hspName: '',
    ifDrugDoctor: '',
    ifGyzDoctor: '',
    ifSyzDoctor: '',
    ifTxDoctor: '',
    isHsp: '',
    quaNo: '',
    undeter: '',
    workNo: '',
    workPlace: '',
    workRange1: '',
    workRange2: '',
    workRange3: '',
  }
  private listSlotHeight: number = 0 // 列表高度
  //   获取数据
  private getList() {
    // const pageTable: any = this.$refs.pageTable
    // pageTable.getList()
  }
  // 清除搜索框
  private clear() {
    this.getList()
  }
  //   禁用停用状态切换
  private handleEnable(ybdoctordataId: number, lockFlag: string) {
    const chooseIndex = this.tableData.findIndex(
      (v) => v.ybdoctordataId === ybdoctordataId
    )
    if (lockFlag === '0') {
      statusLock({ ybdoctordataId }).then((res: any) => {
        this.tableData[chooseIndex].lockFlag = '1'
        this.$notify({
          title: this.$t('physicianRegister.disabledSuccess') + '',
          message: '',
          type: 'success',
        })
      })
    } else {
      statusUnlock({ ybdoctordataId }).then((res) => {
        this.tableData[chooseIndex].lockFlag = '0'
        this.$notify({
          title: this.$t('physicianRegister.automatedSuccess') + '',
          message: '',
          type: 'success',
        })
      })
    }
  }
  //编辑
  private handleEdit(val: any) {}
  //新增
  private handleAdd() {
    ;(this.$refs.drugBaseInfo as any).showDialog()
  }
  //提交表单
  private handleSubmit(form: IForm) {}

  private handleImport() {
    ;(this.$refs.publicImportInfo as any).showDialog()
  }

  // 关闭文件导入模态框
  private closeModal(flag: boolean) {
    if (flag) {
      this.showUpload = false
      this.getList()
    }
  }
  //重置表单数据
  private resetForm() {
    this.form = Object.assign({}, this.originForm)
  }

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight - 103
  }

  mounted() {
    // this.resetForm()
    // this.getList()
  }
  private showDialog() {
    ;(this.$refs.publicImportInfo as any).showDialog()
  }
}
</script>

<style lang='scss' scoped>
.row .label .el-input {
  width: 190px;
}

::v-deep .el-radio__label {
  font-size: 13px;
  padding-left: 4px;
}
.el-radio {
  margin-right: 10px;
}
::v-deep .el-input {
  height: 28px !important;
  .el-input__prefix {
    margin: 0px 8px 0 10px !important;
  }
}
</style>
