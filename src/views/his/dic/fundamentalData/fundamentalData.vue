<!--
 * @Author: 董亮
 * @LastEditTime: 2020-04-30 15:00:26
 * @LastEditors: Please set LastEditors
 * @Description: 字典系统标识设置
 * @FilePath: \web-op\src\views\his\dic\fundamentalData\fundamentalData.vue
 -->

<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="12">
        <div class="his-module">
          <pagenation-list
            ref="pageTable"
            v-model="tableDatas"
            data-url="/system-service/sys/sysflagdata/queryPage"
            http-method="post"
            :searchData="searchData"
            :list-height="listSlotHeight"
          >
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">{{$t('medicareData.dataName')}}</h1>
                <el-input
                  v-model="searchData.flagDataName"
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
                  @click="handleAddZ"
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
              <el-table-column prop="flagDataCode" :label="$t('common.code1')"></el-table-column>
              <el-table-column prop="flagDataName" :label="$t('medicareData.dataName')" sortable></el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col class="ht" :span="12">
        <div class="his-module">
          <pagenation-list
            ref="pageTableRef"
            v-model="tableData"
            data-url="/system-service/sys/sysflagdatavalue/queryPage"
            http-method="post"
            :searchData="searchDataF"
            :list-height="listSlotHeight"
          >
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">{{$t('medicareData.dataName')}}</h1>
                <el-input
                  v-model="searchDataF.condition"
                  :placeholder="$t('postSetting.inputHolder')"
                  @keyup.enter.native="getListsF"
                  clearable
                  @clear="getListsF"
                >
                  <i slot="prefix" class="el-input__icon icon his-search"></i>
                </el-input>
              </div>
              <div class="operate">
                <el-button
                  type="primary"
                  class="blue-gra"
                  icon="icon his-add"
                  :disabled="this.flags == false ? true : false"
                  @click="handleAddF"
                >{{$t('common.add')}}</el-button>
              </div>
            </div>

            <el-table
              :data="tableData"
              border
              stripe
              :highlight-current-row="true"
              slot="list"
              :height="listSlotHeight - 10 -73 -32"
              @row-click="handlefRowClick"
              class="scroll-bar"
            >
              <el-table-column prop="serialNumber" :label="$t('sysManage.menuSort')" width="120"></el-table-column>
              <el-table-column prop="flagDataValue" :label="$t('common.code1')"></el-table-column>
              <el-table-column
                prop="flagDataValueRemark"
                :label="$t('medicareData.dataName')"
                sortable
              ></el-table-column>
              <el-table-column :label="$t('table.status')" width="120">
                <template slot-scope="scope">
                  <span
                    :class="[scope.row.stopFlag == '0' ? 'blues':'reds']"
                  >{{scope.row.stopFlag == '0' ? $t('common.enable') : $t('common.disable')}}</span>
                </template>
              </el-table-column>
              <el-table-column width="70" :label="$t('common.action')">
                <template slot-scope="scope">
                  <!-- 修改 -->
                  <el-tooltip :content="$t('common.edit')" effect="light">
                    <el-button
                      class="red"
                      :disabled="scope.row.stopFlag == '0'"
                      @click="editDialog(scope.row)"
                    >
                      <i class="icon his-edit"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip
                    :content="scope.row.stopFlag == '0' ? $t('common.disable') : $t('common.enable')"
                    effect="light"
                    class="ml10"
                  >
                    <!-- 启用/停用 -->
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
    <!-- 新增主字典数据的弹框 -->
    <el-dialog
      :title="$t('common.add')"
      :visible.sync="showDetail"
      width="410"
      @close="addDialogClose"
      :close-on-click-modal="false"
    >
      <el-form label-width="70px" :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item :label="$t('common.code1')" prop="flagDataCode">
          <el-input v-model="addForm.flagDataCode" prop="flagDataCode"></el-input>
        </el-form-item>
        <el-form-item :label="$t('medicareData.dataName')" prop="flagDataName">
          <el-input v-model="addForm.flagDataName" prop="flagDataName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDetail = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="handleAdd">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>
    <!-- 新增从字典数据的弹框 -->
    <el-dialog
      :title="$t('common.add')"
      :visible.sync="addShowDialog"
      width="410"
      @close="addDialogFClose"
      :close-on-click-modal="false"
    >
      <el-form label-width="120px" :model="addFormF" :rules="addFormFRules" ref="addFormFRef">
        <el-form-item :label="$t('common.code1')" prop="flagDataCode">
          <el-input v-model="addFormF.flagDataCode" prop="flagDataCode" @change="enterFocus1" ref="inputFocus1"></el-input>
        </el-form-item>
        <el-form-item :label="$t('medicareData.dataName')" prop="flagDataName">
          <el-input v-model="addFormF.flagDataName" prop="flagDataName" @change="enterFocus2" ref="inputFocus2"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.SortNumber')" prop="serialNumber">
          <el-input v-model="addFormF.serialNumber" prop="serialNumber" @change="handleSubmit" ref="inputFocus3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addShowDialog = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="handleSubmit">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>
    <!-- 修改从字典数据的弹框 -->
    <el-dialog
      :title="$t('common.modify')"
      :visible.sync="editShowDialog"
      width="410"
      :close-on-click-modal="false"
      @close="editDialogFClose"
    >
      <el-form label-width="120px" :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item prop="flagDataValueId" style="display: none">
          <el-input v-model="editForm.flagDataValueId" prop="flagDataValueId"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.code1')" prop="flagDataCode">
          <el-input v-model="editForm.flagDataCode" prop="flagDataCode"></el-input>
        </el-form-item>
        <el-form-item :label="$t('medicareData.dataName')" prop="flagDataName">
          <el-input v-model="editForm.flagDataName" prop="flagDataName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.SortNumber')" prop="serialNumber">
          <el-input v-model="editForm.serialNumber" prop="serialNumber"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editShowDialog = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="editSubmit">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import Form from 'element-ui'
import { addzNewDic, getzNewDic, getzAllDicNewDic, queryzNewDic, addfNewDic, editfNewDic, enableMenu, Iitem, Iitems } from '@/api/his/dic/fundamentalDate.ts'
// import { format } from 'url'
// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: '',
  filters: {}
})
export default class extends Vue {
  private searchData = {
    flagDataName: '',
    pageNum: '',
    pageSize: ''
  }
  private flagId: number = 0 // 主字典单行ID值
  private flagIds: number = 0 // 从字典单行ID值
  private searchDataF = {
    flagDataId: 0,
    condition: '',
    pageNum: 0,
    pageSize: 0
  }
  private showDetail: boolean = false // 新增主字典弹框默认隐藏
  private addShowDialog: boolean = false // 新增从字典弹框默认隐藏
  private editShowDialog: boolean = false // 修改从字典弹框默认隐藏
  private isCreateNewJob: boolean = true //新增还是保存
  private listSlotHeight: number = 0 //列表高度
  private tableDatas: string[] = [] // 列表主字典数组
  private tableData: string[] = [] // 列表副字典数组
  private flag: number = 0 // 从字典新增默认禁用
  private flags: boolean = false // 子级新增按钮默认禁用
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    this.getLists()
  }
  // 从字典数据对象
  private addFormF = {
    flagDataCode: '',
    flagDataId: 0,
    flagDataName: '',
    serialNumber: null
  }
  private editForm = {
    flagDataCode: '',
    flagDataValueId: 0,
    flagDataName: '',
    serialNumber: 0
  }
  // 主字典数据对象
  private addForm = {
    flagDataCode: '',
    flagDataName: ''
  }
  private addFormRules = {
    flagDataCode: [
      {
        required: true,
        message: window.ele.$i18n.t('hospitalDict.vdCode1'),
        trigger: 'blur'
      }
    ],
    flagDataName: [
      {
        required: true,
        message: window.ele.$i18n.t('hospitalDict.vdDataName'),
        trigger: 'blur'
      }
    ]
  }

  private addFormFRules = {
    flagDataCode: [
      {
        required: true,
        message: window.ele.$i18n.t('hospitalDict.vdDictCode'),
        trigger: 'blur'
      }
    ],
    flagDataName: [
      {
        required: true,
        message: window.ele.$i18n.t('hospitalDict.vdDictName'),
        trigger: 'blur'
      }
    ],
    serialNumber: [
      {
        required: true,
        message: window.ele.$i18n.t('hospitalDict.vdSortNumber'),
        trigger: 'blur'
      }
    ]
  }

  private editFormRules = {
    flagDataCode: [
      {
        required: true,
        message: window.ele.$i18n.t('hospitalDict.vdCode1'),
        trigger: 'blur'
      }
    ],
    flagDataName: [
      {
        required: true,
        message: window.ele.$i18n.t('hospitalDict.vdDataName'),
        trigger: 'blur'
      }
    ],
    serialNumber: [
      {
        required: true,
        message: window.ele.$i18n.t('hospitalDict.vdSortNumber'),
        trigger: 'blur'
      }
    ]
  }

  // 点击按钮弹出修改弹框
  private editDialog(row: any) {
    this.editShowDialog = true
    this.editForm = {
      flagDataCode: row.flagDataValue,
      flagDataValueId: row.flagDataValueId,
      flagDataName: row.flagDataValueRemark,
      serialNumber: row.serialNumber
    }
    console.log(row, this.editForm)
  }

  /**
   * @LastEditors: zhml
   * @Description: 菜单状态更改,更改成功，状态赋值不刷新列表
   * @param {type} params
   * @return:
   */
  private handleEnable(item: any) {
    if (item.stopFlag == 1) {
      enableMenu({ flagDataValueId: item.flagDataValueId, stopFlag: '0' }).then((res: any) => {
        item.stopFlag = '0'
        this.$notify({
          title: this.$t('common.enabled').toString(),
          message: '',
          type: 'success'
        })
      })
    } else {
      enableMenu({ flagDataValueId: item.flagDataValueId, stopFlag: '1' }).then((res: any) => {
        item.stopFlag = '1'
        this.$notify({
          title: this.$t('common.disabled').toString(),
          message: '',
          type: 'success'
        })
      })
    }
  }
  // 获取主字典数据
  private getLists() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }
  // 获取从字典数据
  private getListsF() {
    const pageTableRef: any = this.$refs.pageTableRef
    pageTableRef.searchList()
  }
  private searchList() {
    const pageTable: any = this.$refs.pageTable
    if (this.searchData.flagDataName == '') {
      pageTable.getList()
    } else {
      pageTable.searchList()
    }
  }
  // 点击新增按钮主字典显示
  private handleAddZ() {
    this.showDetail = true
  }
  // 点击新增从字典按钮显示
  private handleAddF() {
    this.addShowDialog = true
  }
  // 点击按钮新增主字典数据
  private handleAdd() {
    const addFormRef: any = this.$refs.addFormRef
    addFormRef.validate((valid: any) => {
      if (!valid) {
        return
      }
      addzNewDic(this.addForm).then(res => {
        this.getLists()
        this.$notify({
          title: this.$t('common.addSuc').toString(),
          message: '',
          type: 'success'
        })
        this.showDetail = false
      })
    })
  }
  // 新增主字典弹框关闭事件
  addDialogClose() {
    this.$nextTick(() => {
      const el: any = this.$refs.addFormRef
      el.resetFields()
    })
  }
  // 新增从字典弹框关闭事件
  addDialogFClose() {
    this.$nextTick(() => {
      const el: any = this.$refs.addFormFRef
      el.resetFields()
    })
  }
  // 修改从字典弹框关闭事件
  editDialogFClose() {
    this.$nextTick(() => {
      const el: any = this.$refs.editFormRef
      el.resetFields()
    })
  }
  // 点击按钮新增从字典数据
  handleSubmit() {
    const addFormFRef: any = this.$refs.addFormFRef
    addFormFRef.validate((valid: any) => {
      if (!valid) {
        return
      }
      console.log(typeof this.addFormF.flagDataName)
      if (this.addFormF.flagDataId !== null) {
        this.addFormF.flagDataId = this.flagId
        addfNewDic(this.addFormF).then(res => {
          this.getListsF()
          this.$notify({
            title: this.$t('common.addSuc').toString(),
            message: '',
            type: 'success'
          })
          this.$nextTick(() => {
            const el: any = this.$refs.addFormFRef
            el.resetFields()
          })
          // this.addShowDialog = false
          this.$nextTick(() => {
            const el: any = this.$refs.inputFocus1
            el.focus()
          })
        })
      }
    })
  }
  // 点击按钮提交从字典修改数据
  private editSubmit() {
    const editFormRef: any = this.$refs.editFormRef
    editFormRef.validate((valid: any) => {
      if (!valid) {
        return
      }
      // this.editForm.flagDataValueId = this.flagIds
      editfNewDic(this.editForm).then(res => {
        this.getListsF()
        this.$notify({
          title: this.$t('common.editSuc').toString(),
          message: '',
          type: 'success'
        })
        this.editShowDialog = false
      })
    })
  }

  // 点击主字典表单行获取表单行数据
  private handleRowClick(row: Iitem) {
    this.flagId = row.flagDataId
    this.flags = true
    this.searchDataF.flagDataId = row.flagDataId
    this.getListsF()
    // console.log(this.flagId)
    console.log(row)
  }
  // 点击从字典表单行获取表单行数据
  private handlefRowClick(row: Iitems) {
    this.flagIds = row.flagDataValueId
  }

  // 回车换行
  private enterFocus1() {
    const el:any = this.$refs.inputFocus2
    el.focus()
  }
  private enterFocus2() {
    const el:any = this.$refs.inputFocus3
    el.focus()
  }
}
</script>

<style lang="scss" scoped>
.layout-bot {
  // height: calc(40% - 10px);
  margin-top: 10px;
}
</style>
