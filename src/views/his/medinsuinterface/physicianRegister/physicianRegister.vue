<template>
  <div class="content">
    <div class="his-module">
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
            <h1 class="title" style="flex:1">{{$t('physicianRegister.title')}}</h1>
            <el-input
              v-model="searchData.doctorName"
              :placeholder="$t('physicianRegister.search')"
              @keydown.native.enter="getList"
              clearable
              @clear="clear"
            >
              <i slot="prefix" class="el-input__icon icon his-search"></i>
            </el-input>
          </div>
          <div class="operate">
            <el-button
              type="primary"
              class="blue-gra"
              icon="icon his-add"
              @click="handleAdd"
            >{{$t('common.add')}}</el-button>
            <el-button
              type="primary"
              class="green-gra"
              icon="icon his-import"
              shadow
              iconSize="10"
              @click="handleImport"
            >{{$t('common.import')}}</el-button>
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
          <el-table-column
            :label="$t('physicianRegister.doctorYbCode')"
            prop="doctorYbCode"
            width="80"
          ></el-table-column>
          <el-table-column
            :label="$t('physicianRegister.doctorName')"
            prop="doctorName"
            min-width="60"
          ></el-table-column>
          <el-table-column :label="$t('physicianRegister.doctorSex')" prop="doctorSex" width="50"></el-table-column>
          <el-table-column
            :label="$t('physicianRegister.documentType')"
            prop="documentType"
            width="90"
          ></el-table-column>
          <el-table-column :label="$t('physicianRegister.quaNo')" prop="quaNo" width="230"></el-table-column>
          <el-table-column :label="$t('physicianRegister.empNo')" prop="empNo" width="70"></el-table-column>
          <el-table-column
            :label="$t('physicianRegister.workRange1')"
            prop="workRange1"
            min-width="130"
          ></el-table-column>
          <el-table-column :label="$t('physicianRegister.caption')" prop="caption" width="60"></el-table-column>
          <el-table-column :label="$t('physicianRegister.undeter')" prop="undeter" width="60"></el-table-column>
          <el-table-column prop="lockFlag" :label="$t('common.status')" width="55">
            <template slot-scope="scope">
              <!-- lockFlag 1 停用  0 启用 -->
              <span
                :class="[scope.row.lockFlag== '1' ? 'reds' : 'blues']"
              >{{ scope.row.lockFlag== '1' ? '停用' : '启用' }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('physicianRegister.operate')" width="90" align="center">
            <template slot-scope="scope">
              <el-tooltip
                :content="scope.row.lockFlag == '0' ? $t('common.disable') : $t('common.enable')"
                effect="light"
              >
                <el-popconfirm
                  hideIcon
                  :confirmButtonText="scope.row.lockFlag == '0' ? $t('common.disable') : $t('common.enable')"
                  :cancelButtonText="$t('common.cancel')"
                  :title="scope.row.lockFlag == '1' ? $t('common.enableTip') : $t('common.disableTip')"
                  @confirm="handleEnable(scope.row.ybdoctordataId,scope.row.lockFlag)"
                >
                  <el-button
                    slot="reference"
                    :class="[scope.row.lockFlag == '0' ? 'red' : 'green']"
                  >
                    <i
                      class="icon"
                      :class="[ scope.row.lockFlag == '0' ? 'his-disabled' : 'his-automated']"
                    ></i>
                  </el-button>
                </el-popconfirm>
              </el-tooltip>
              <el-tooltip :content="$t('common.edit')" effect="light" class="ml10">
                <el-button
                  class="blue"
                  @click="handleEdit(scope.row)"
                  :disabled="scope.row.lockFlag == '0'"
                >
                  <i class="icon his-edit" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </pagenation-list>
      <!-- <el-dialog
        title="新增医师注册信息"
        :visible.sync="isVisiable"
        :scrollable="true"
        width="70%"
        @close="resetForm"
      >

      </el-dialog>-->
      <!-- 弹框 -->
      <div class="el-modal-mask" v-show="isMask"></div>
      <div class="el-modal" v-show="isVisiable">
        <div class="v-modal-header">
          <div
            class="v-modal-header-inner"
          >{{!isEdit ? $t('physicianRegister.addTips') : $t('physicianRegister.editTips') }}</div>
          <div class="v-modal-close" @click="handleClose">
            <i class="icon his-control-close"></i>
          </div>
        </div>
        <div class="v-modal-wrap">
          <div class="v-modal-body">
            <addPhysician :value="form" @cancle="handleClose" @submit="handleSubmit"></addPhysician>
          </div>
        </div>
      </div>
    </div>
    <!-- 文件导入模态框 -->
    <upload-Modal :showUpload="showUpload" @close="closeModal"></upload-Modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import uploadModal from './components/uploadFile.vue'
import addPhysician from './components/addPhysician.vue'
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
  name: 'physicianRegister',
  filters: {},
  components: {
    addPhysician,
    uploadModal,
  },
})
export default class extends Vue {
  // 表格数据
  private tableData: any[] = []
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
  //是否为编辑模式
  private isEdit: boolean = false
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
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
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
  private handleEdit(val: any) {
    this.form = Object.assign({}, val)
    this.isEdit = true
    // 显示模态框
    this.isMask = true
    this.isVisiable = true
  }
  //新增
  private handleAdd() {
    this.isEdit = false
    // 显示模态框
    this.isMask = true
    this.isVisiable = true
    // 清空form表单
    this.resetForm()
  }
  //关闭
  private handleClose(flag: boolean) {
    this.isMask = false
    this.isVisiable = false
  }
  //提交表单
  private handleSubmit(form: IForm) {
    if (this.isEdit) {
      editData(form).then((res) => {
        this.$notify({
          title: this.$t('common.editSuc').toString(),
          message: '',
          type: 'success',
        })
        this.getList()
        this.$nextTick(() => {
          this.isMask = false
          this.isVisiable = false
          // 清空form表单
          this.resetForm()
        })
      })
    } else {
      addData(form).then((res) => {
        this.$notify({
          title: this.$t('common.addSuc').toString(),
          message: '',
          type: 'success',
        })
        this.getList()
        this.$nextTick(() => {
          this.isMask = false
          this.isVisiable = false
          // 清空form表单
          this.resetForm()
        })
      })
    }
  }

  private handleImport() {
    this.showUpload = true
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
    this.listSlotHeight = Vue.prototype.PageHeight - 73 - 50
  }

  mounted() {
    this.resetForm()
    this.getList()
  }
}
</script>

<style lang='scss' scoped>
.his-module {
  ::v-deep .el-dialog .el-dialog__body {
    padding: 37px 0px 0px;
  }
  ::v-deep .el-form {
    margin: 10px auto;
  }
}
</style>
