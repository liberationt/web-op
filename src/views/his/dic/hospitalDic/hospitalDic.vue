<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="12">
        <!-- 医院字典 -->
        <div class="his-module">
          <pagenation-list
            ref="pageTable"
            v-model="tableDatas"
            data-url="/system-service/sys/dicgbsj01/queryByCondition"
            http-method="post"
            :searchData="searchData"
            :list-height="listSlotHeight"
          >
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">{{$t('medicareData.dataName')}}</h1>
                <el-input
                  v-model="searchData.condition"
                  :placeholder="$t('postSetting.inputHolder')"
                  @keyup.enter.native="getLists"
                  clearable
                  @clear="getLists"
                >
                  <i slot="prefix" class="el-input__icon icon his-search"></i>
                </el-input>
              </div>
              <div class="operate">
                <el-button
                  type="primary"
                  class="blue-gra"
                  icon="icon his-add"
                  @click="addShowDialog"
                >{{$t('common.add')}}</el-button>
              </div>
            </div>
            <el-table
              :data="tableDatas"
              border
              stripe
              :highlight-current-row="true"
              slot="list"
              @row-click="handleRowClick"
              :height="listSlotHeight -10 -73 -32"
              class="scroll-bar"
            >
              <el-table-column prop="primaryDataCode" :label="$t('common.code1')" width="130"></el-table-column>
              <el-table-column prop="primaryDataName" :label="$t('medicareData.dataName')" sortable></el-table-column>
              <el-table-column :label="$t('common.action')" width="70">
                <template slot-scope="scope">
                  <el-tooltip :content="$t('common.edit')" effect="light" :enterable="false">
                    <el-button
                      class="red"
                      :disabled="scope.row.stopFlag == '0'"
                      @click.stop="editShowDialog(scope.row)"
                    >
                      <i class="icon his-edit"></i>
                    </el-button>
                  </el-tooltip>
                  <!-- 删除 -->
                  <el-tooltip
                    class="ml10"
                    :content="$t('common.delete')"
                    effect="light"
                    :enterable="false"
                  >
                    <el-popconfirm
                      class="ml10"
                      hideIcon
                      :confirmButtonText="$t('common.confirm')"
                      :cancelButtonText="$t('common.cancel')"
                      :title="$t('sysManage.confirmDeleted')"
                      @confirm="handleDelete(scope.row)"
                    >
                      <el-button
                        slot="reference"
                        :class="scope.row.stopFlag == '0' ? 'red' : 'green'"
                      >
                        <i class="icon his-del his-cancellationicon" />
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col class="ht" :span="12">
        <!-- 医院字典项 -->
        <div class="his-module">
          <pagenation-list
            ref="pageTableRef"
            v-model="tableDatasPage"
            data-url="/system-service/sys/dicgbsj02/page"
            http-method="post"
            :searchData="searchDatas"
            :list-height="listSlotHeight"
          >
            <div slot="header" class="row">
              <div class="label"></div>
              <div class="operate">
                <el-button
                  type="primary"
                  class="blue-gra"
                  icon="icon his-add"
                  @click="addNextShowDialog"
                  :disabled="this.flag == false ? true : false"
                >{{$t('common.add')}}</el-button>
              </div>
            </div>
            <el-table
              :data="tableDatasPage"
              border
              stripe
              :highlight-current-row="true"
              slot="list"
              :height="listSlotHeight -10 -73 -32"
              class="scroll-bar"
            >
              <el-table-column prop="dataValue" :label="$t('common.code')" width="120"></el-table-column>
              <el-table-column prop="dataValueRemark" :label="$t('medicareData.dataName')"></el-table-column>
              <el-table-column :label="$t('table.status')" width="80">
                <template slot-scope="scope">
                  <span
                    :class="[scope.row.stopFlag == '0' ? 'blues':'reds']"
                  >{{scope.row.stopFlag == '0' ? $t('common.enable') : $t('common.disable')}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('common.action')" width="70">
                <template slot-scope="scope">
                  <el-tooltip :content="$t('common.edit')" effect="light" :enterable="false">
                    <el-button
                      class="red"
                      :disabled="scope.row.stopFlag == '0'"
                      @click="editShowDialogs(scope.row)"
                    >
                      <i class="icon his-edit"></i>
                    </el-button>
                  </el-tooltip>
                  <!-- 启用/停用 -->
                  <el-tooltip
                    :content="scope.row.stopFlag == '0' ? $t('common.disable') : $t('common.enable')"
                    effect="light"
                    class="ml10"
                  >
                    <el-popconfirm
                      class="ml10"
                      hideIcon
                      :confirmButtonText="
                  scope.row.stopFlag == '0'
                    ? $t('common.disable')
                    : $t('common.enable')
                "
                      :cancelButtonText="$t('common.cancel')"
                      :title="
                  scope.row.stopFlag == '0'
                    ? $t('sysManage.confirmDisabled')
                    : $t('sysManage.confirmAutomated')
                "
                      @confirm="handleEnable(scope.row)"
                    >
                      <el-button
                        slot="reference"
                        :class="[scope.row.stopFlag == '0' ? 'red' : 'green']"
                      >
                        <i
                          class="icon"
                          :class="[
                      scope.row.stopFlag == '0'
                        ? 'his-disabled'
                        : 'his-automated',
                    ]"
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
    </el-row>
    <!-- 新增医院字典数据的弹框 -->
    <el-dialog
      :title="$t('common.add')"
      :visible.sync="showDetail"
      width="410"
      @close="addDialogClose"
      :close-on-click-modal="false"
    >
      <el-form label-width="70px" :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item :label="$t('common.code1')" prop="primaryDataCode">
          <el-input v-model="addForm.primaryDataCode" prop="primaryDataCode"></el-input>
        </el-form-item>
        <el-form-item :label="$t('medicareData.dataName')" prop="primaryDataName">
          <el-input v-model="addForm.primaryDataName" prop="primaryDataName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDetail = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="handleAdd">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>
    <!-- 新增医院字典项数据的弹框 -->
    <el-dialog
      :title="$t('common.add')"
      :visible.sync="addShowDetail"
      width="410"
      @close="addDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form
        label-width="130px"
        :model="addFormNext"
        :rules="addFormNextRules"
        ref="addFormNextRef"
      >
        <el-form-item :label="$t('common.code')" prop="dataValue">
          <el-input v-model="addFormNext.dataValue" prop="dataValue"></el-input>
        </el-form-item>
        <el-form-item :label="$t('medicareData.dataName')" prop="dataValueRemark">
          <el-input v-model="addFormNext.dataValueRemark" prop="dataValueRemark"></el-input>
        </el-form-item>
        <el-form-item :label="$t('hospitalDataDict.titleC')+ ' ID'" prop="primarydataId">
          <el-input v-model="addFormNext.primarydataId" prop="primarydataId" type="number" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.SortNumber')" prop="serialNumber">
          <el-input v-model="addFormNext.serialNumber" prop="serialNumber" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addShowDetail = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="addNextDetail">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>
    <!-- 修改医院字典数据的弹框 -->
    <el-dialog
      :title="$t('common.modify')"
      :visible.sync="showEditDialog"
      width="410"
      :close-on-click-modal="false"
      @close="editDialogClose"
    >
      <el-form label-width="120px" :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item :label="$t('common.serialNum')" prop="primarydataId">
          <el-input v-model="editForm.primarydataId" prop="primarydataId" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.code1')" prop="primaryDataCode">
          <el-input v-model="editForm.primaryDataCode" prop="primaryDataCode"></el-input>
        </el-form-item>
        <el-form-item :label="$t('medicareData.dataName')" prop="primaryDataName">
          <el-input v-model="editForm.primaryDataName" prop="primaryDataName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialog = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="editSubmit">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>
    <!-- 修改医院字典项数据的弹框 -->
    <el-dialog
      :title="$t('common.modify')"
      :visible.sync="showEditDialogs"
      width="410"
      :close-on-click-modal="false"
      @close="editDialogClosed"
    >
      <el-form label-width="120px" :model="editForms" :rules="editFormRule" ref="editDialogRef">
        <el-form-item label="ID" prop="datavalueId">
          <el-input v-model="editForms.datavalueId" prop="datavalueId" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.code')" prop="dataValue">
          <el-input v-model="editForms.dataValue" prop="dataValue"></el-input>
        </el-form-item>
        <el-form-item :label="$t('medicareData.dataName')" prop="dataValueRemark">
          <el-input v-model="editForms.dataValueRemark" prop="dataValueRemark"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.SortNumber')" prop="serialNumber">
          <el-input v-model="editForms.serialNumber" prop="serialNumber" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialogs = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="editHospitalDict">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import Form from 'element-ui'
import { addHospitalDic, deleteHospitalDic, editHospitalDic, getHospitalDetail, editHospitalDetail, startHospitalDetail, stopHospitalDetail, IParameter, getHospitalPage, addHospitalChild, searchHospitalById } from '@/api/his/dic/fundamentalDate.ts'
import { type } from 'os'
import { rightScroll } from '@/utils/index.ts'
@Component({
  name: '',
  filters: {},
})
export default class extends Vue {
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    this.getLists()
  }
  private listSlotHeight: number = 0 // 列表高度
  private tableDatas: string[] = [] // 列表字典数组
  private tableDatasPage: any[] = [] // 列表字典项数组
  private showDetail: boolean = false // 新增字典弹框默认隐藏
  private showEditDialog: boolean = false // 修改字典弹框默认隐藏
  private showEditDialogs: boolean = false // 修改字典项弹框默认隐藏
  private addShowDetail: boolean = false // 新增字典项弹框默认隐藏
  private flag: boolean = false // 子级新增按钮默认禁用
  private searchParameter: any = '' // 医院字典项的查询参数
  private currTopRow: any = {}

  @Watch('tableDatas', { deep: true })
  private onDataChange(val: any) {
    rightScroll()
  }

  @Watch('tableDatasPage', { deep: true })
  private onData1Change(val: any) {
    rightScroll()
  }
  // 添加医院字典的数据对象
  private addForm = {
    primaryDataCode: '',
    primaryDataName: '',
  }
  // 添加医院字典项的数据对象
  private addFormNext = {
    dataValue: '',
    dataValueRemark: '',
    primarydataId: '',
    serialNumber: '',
  }
  // 修改医院字典的数据对象
  private editForm = {
    primaryDataCode: '',
    primaryDataName: '',
    primarydataId: '',
  }
  // 修改医院字典项的数据对象
  private editForms: any = {
    dataValue: '',
    dataValueRemark: '',
    datavalueId: '',
    serialNumber: '',
  }
  // 医院字典的查询参数
  private searchData = {
    condition: '',
    pageNum: 0,
    pageSize: 0,
  }
  // 医院字典项的分页参数
  private searchDatas = {
    primarydataId: '',
  }

  // 获取字典数据
  private getLists() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 点击主字典表单行获取表单行数据并获取分页内容
  private handleRowClick(row: any) {
    this.currTopRow = row
    this.flag = true
    this.searchDatas.primarydataId = row.primarydataId
    const pageTableRef: any = this.$refs.pageTableRef
    pageTableRef.searchList()
  }
  // 添加字典弹框的表单验证
  private addFormRules = {
    primaryDataCode: [
      {
        required: true,
        message: window.ele.$i18n.t('hospitalDict.vdCode1'),
        trigger: 'blur',
      },
    ],
    primaryDataName: [
      {
        required: true,
        message: window.ele.$i18n.t('hospitalDict.vdDataName'),
        trigger: 'blur',
      },
    ],
  }
  // 添加字典项弹框表单验证
  private addFormNextRules = {
    dataValue: [
      {
        required: true,
        message: window.ele.$i18n.t('hospitalDict.vdCode'),
        trigger: 'blur',
      },
    ],
    dataValueRemark: [
      {
        required: true,
        message: window.ele.$i18n.t('hospitalDict.vdDataName'),
        trigger: 'blur',
      },
    ],
    primarydataId: [
      {
        required: true,
        message: window.ele.$i18n.t('hospitalDict.vdId'),
        trigger: 'blur',
      },
    ],
    serialNumber: [
      {
        required: true,
        message: window.ele.$i18n.t('hospitalDict.vdSerialNum'),
        trigger: 'blur',
      },
    ],
  }
  private editFormRule = {
    dataValue: [
      {
        required: true,
        message: window.ele.$i18n.t('hospitalDict.vdCode'),
        trigger: 'blur',
      },
    ],
    dataValueRemark: [
      {
        required: true,
        message: window.ele.$i18n.t('hospitalDict.vdDataName'),
        trigger: 'blur',
      },
    ],
    serialNumber: [
      {
        required: true,
        message: window.ele.$i18n.t('hospitalDict.vdSerialNum'),
        trigger: 'blur',
      },
    ],
  }
  // 修改弹框的表单验证
  private editFormRules = {
    primaryDataCode: [
      {
        required: true,
        message: window.ele.$i18n.t('hospitalDict.vdCode1'),
        trigger: 'blur',
      },
    ],
    primaryDataName: [
      {
        required: true,
        message: window.ele.$i18n.t('hospitalDict.vdDataName'),
        trigger: 'blur',
      },
    ],
  }
  // 点击新增按钮主字典显示
  private addShowDialog() {
    this.showDetail = true
  }
  // 点击按钮新增医院字典数据
  private handleAdd() {
    const addFormRef: any = this.$refs.addFormRef
    addFormRef.validate((valid: any) => {
      if (!valid) {
        return
      }
      addHospitalDic(this.addForm).then((res) => {
        this.getLists()
        this.$notify({
          title: this.$t('common.addSuc').toString(),
          message: '',
          type: 'success',
        })
        this.showDetail = false
      })
    })
  }
  // 新增关闭弹框的事件处理
  private addDialogClose() {
    this.$nextTick(() => {
      const el: any = this.$refs.addFormRef
      el.resetFields()
    })
  }
  // 新增子级弹框关闭事件
  private addDialogClosed() {
    this.$nextTick(() => {
      const el: any = this.$refs.addFormNextRef
      el.resetFields()
    })
  }
  // 修改字典项弹框关闭事件
  private editDialogClosed() {
    this.$nextTick(() => {
      const el: any = this.$refs.editDialogRef
      el.resetFields()
    })
  }
  // 修改字典弹框关闭事件
  private editDialogClose() {
    this.$nextTick(() => {
      const el: any = this.$refs.editFormRef
      el.resetFields()
    })
  }
  // 点击按钮弹出医院字典修改框
  private editShowDialog(row: any) {
    this.editForm = {
      ...row,
    }
    this.showEditDialog = true
  }
  // 点击确定提交修改的数据
  private editSubmit() {
    const editFormRef: any = this.$refs.editFormRef
    editFormRef.validate((valid: any) => {
      if (!valid) {
        return
      }
      editHospitalDic(this.editForm).then((res) => {
        this.getLists()
        this.$notify({
          title: this.$t('common.editSuc').toString(),
          message: '',
          type: 'success',
        })
        this.showEditDialog = false
      })
    })
  }

  // 点击删除图标删除医院字典数据
  private handleDelete(row: any) {
    //console.log(row)
    deleteHospitalDic(row.primarydataId).then((res) => {
      this.getLists()
      this.$notify({
        title: this.$t('common.delSuc').toString(),
        message: '',
        type: 'success',
      })
    })
  }

  // 点击编辑按钮弹出编辑框
  private editShowDialogs(row: any) {
    console.log(row)
    this.showEditDialogs = true
    this.editForms = {
      ...row,
    }
  }
  // 编辑医院字典项数据并提交
  editHospitalDict() {
    const editDialogRef: any = this.$refs.editDialogRef
    editDialogRef.validate((valid: any) => {
      if (!valid) {
        return
      }
      editHospitalDetail(this.editForms).then((res) => {
        this.handleRowClick(this.currTopRow)
        this.$notify({
          title: this.$t('common.editSuc').toString(),
          message: '',
          type: 'success',
        })
        this.showEditDialogs = false
      })
    })
  }
  // 启用字典项数据
  private handleEnable(row: any) {
    console.log(row)
    if (row.stopFlag == '1') {
      startHospitalDetail(row.datavalueId).then((res: any) => {
        this.handleRowClick(this.currTopRow)
        this.$notify({
          title: this.$t('common.enabled').toString(),
          message: '',
          type: 'success',
        })
      })
    } else {
      stopHospitalDetail(row.datavalueId).then((res: any) => {
        this.handleRowClick(this.currTopRow)
        this.$notify({
          title: this.$t('common.disabled').toString(),
          message: '',
          type: 'success',
        })
      })
    }
  }

  // 点击新增子级按钮弹框显示
  private addNextShowDialog() {
    this.addFormNext.primarydataId = this.currTopRow.primarydataId
    this.addShowDetail = true
  }

  // 新增字典项下级并提交
  private addNextDetail() {
    const addFormNextRef: any = this.$refs.addFormNextRef
    addFormNextRef.validate((valid: any) => {
      if (!valid) {
        return
      }
      addHospitalChild(this.addFormNext).then((res) => {
        this.handleRowClick(this.currTopRow)
        this.$notify({
          title: this.$t('common.addSuc').toString(),
          message: '',
          type: 'success',
        })
        this.addShowDetail = false
      })
    })
  }
}
</script>
<style  lang="scss" scoped>
.layout-bot {
  // height: calc(40% - 10px);
  margin-top: 10px;
}
</style>
