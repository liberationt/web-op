<!--
 * @Date: 2020-05-27 13:56:33
 * @LastEditTime: 2020-06-19 14:53:18
 * @Description: 病人档案
 * @FilePath: \web-op\src\views\cis\op\dctwork\outpatinetClinic\patientFile\index.vue
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
            <h1 class="title">{{$t('病人档案')}}</h1>
            <el-divider direction="vertical"></el-divider>
            <div class="searchTitle">搜索</div>
            <el-input
              v-model="searchData.doctorName"
              placeholder="请输入..."
              @keydown.native.enter="getList"
              clearable
            >
              <i slot="prefix" class="el-input__icon icon his-search"></i>
            </el-input>
            <div class="searchTitle" style="margin-left:10px">卡号</div>
            <el-input
              v-model="searchData.doctorName"
              placeholder="请输入..."
              @keydown.native.enter="getList"
              clearable
            >
              <i slot="prefix" class="el-input__icon icon his-search"></i>
            </el-input>
            <el-divider direction="vertical" class="mr4"></el-divider>
            <div class="btn">
              <el-button size="mini" type="text">
                <i class="his-reading-card icon"></i>
                <span>{{"读卡"}}</span>
              </el-button>
              <el-button size="mini" type="text" @click="turnDetail">
                <i class="icon his-btn-add green"></i>
                <span>{{$t('common.add')}}</span>
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
          <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
          <el-table-column :label="'门诊号码'" prop="drugCode" width="70"></el-table-column>
          <el-table-column :label="'病人姓名'" prop="medicalCode" width="80"></el-table-column>
          <el-table-column :label="'病人性质'" prop="drugName" min-width="70"></el-table-column>
          <el-table-column :label="'病人性别'" prop="commonName" min-width="70"></el-table-column>
          <el-table-column :label="'出生年月'" prop="specifications" width="100"></el-table-column>
          <el-table-column :label="'身份证号'" prop="unit" min-width="130"></el-table-column>
          <el-table-column
            :label="'联系地址'"
            prop="forms"
            :show-overflow-tooltip="true"
            min-width="280"
          ></el-table-column>
          <el-table-column
            :label="'建档机构'"
            prop="drugGrade"
            :show-overflow-tooltip="true"
            width="100"
          ></el-table-column>
          <el-table-column :label="'建档时间'" prop="drugType" width="130"></el-table-column>
          <el-table-column :label="'建档人'" prop="buyPirce" width="75"></el-table-column>
          <el-table-column :label="'修改时间'" prop="retailPirce" width="130"></el-table-column>
          <el-table-column
            :label="$t('common.action')"
            align="center"
            width="48"
            class-name="fixed-width"
            fixed="right"
          >
            <template slot-scope="scope">
              <!-- 编辑 -->
              <el-tooltip :content="$t('common.edit')" effect="light">
                <el-button
                  class="blue"
                  @click="handleEdit(scope.row)"
                  :disabled="scope.row.displayFlag == '0'"
                >
                  <i class="his-edit icon" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </pagenation-list>
    </div>
    <!-- 新建病人档案 -->
    <add-patient :patientInfo="curRow" ref="add-patient" />
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
import addPatient from '@/components/addPatient/index.vue'
import { Form } from 'element-ui'

// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'patientFile',
  filters: {},
  components: {
    addPatient,
  },
})
export default class extends Vue {
  // 表格数据
  private tableData: any[] = [
    {
      index: 12,
      webSortNumber: 1,
      drugCode: '10101003',
      medicalCode: '测试者',
      drugName: '普通自费',
      commonName: '男',
      specifications: '2020年5月28日',
      unit: '34122519980301x',
      forms: '上海市闵行区真南路500号同济大学附属校区',
      drugGrade: '上海天佑医院',
      drugType: '2020-5-28 14:36:29',
      buyPirce: '管理人测试',
      retailPirce: '2020-5-28 14:36:29',
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
  //模态框状态
  private isMask = false
  private isVisiable = false
  private showUpload = false
  //表单数据
  private form: any = {}
  // 当前行数据
  private curRow: any = {}
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

  // 跳转个人信息详情
  private turnDetail() {
    var a: any = this.$refs['add-patient']
    a.editDialog(123)
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
::v-deep .el-input {
  height: 28px !important;
  .el-input__prefix {
    margin: 0px 8px 0 10px !important;
  }
}
.mr4 {
  margin-right: 4px;
}
::v-deep .el-table__fixed-right {
  height: 100% !important;
}
</style>
