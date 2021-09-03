<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="14">
        <div class="his-module his-small">
          <pagenation-list
            ref="pageTable"
            v-model="tableDatas"
            data-url="/system-service/sysdictconfig/queryPage"
            http-method="post"
            :list-height="listSlotHeight - 51 - 40 - 30"
            :searchData="searchData"
          >
            <!-- table上面的label栏 -->
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">{{ $t('sqlDict.sqlStatementList') }}</h1>
                <el-input
                  v-model="searchData.dictCode"
                  :placeholder="$t('sqlDict.searchForCode')"
                  @keyup.enter.native="searchList"
                  clearable
                  @clear="searchList"
                >
                  <i slot="prefix" class="el-input__icon icon his-search"></i>
                </el-input>
              </div>
              <div class="operate">
                <el-button
                  type="primary"
                  class="blue-gra"
                  icon="icon his-add"
                  @click="addDialog"
                >{{ $t('common.add') }}</el-button>
              </div>
            </div>
            <!-- table -->
            <el-table
              :data="tableDatas"
              border
              :fit="true"
              stripe
              :highlight-current-row="true"
              slot="list"
              @row-click="handleRowClick"
              :height="listSlotHeight - 51 - 40 - 24"
              class="scroll-bar"
            >
              <el-table-column prop="webSortNumber" width="32"></el-table-column>
              <el-table-column prop="dictCode" :label="$t('common.code1')" width="100"></el-table-column>
              <el-table-column prop="querySql" :label="$t('sqlDict.sqlStatement')" sortable></el-table-column>
              <!-- 状态：启用/停用 -->
              <el-table-column
                :label="$t('table.status')"
                width="50"
                align="center"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <span :class="[scope.row.stopFlag == '1' ? 'reds' : 'blues']">
                    {{
                    scope.row.stopFlag == '1'
                    ? $t('common.disable')
                    : $t('common.enable')
                    }}
                  </span>
                </template>
              </el-table-column>
              <!-- 操作：编辑/修改状态 -->
              <el-table-column
                :label="$t('table.actions')"
                width="90"
                align="center"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <el-tooltip :content="$t('common.edit')" effect="light">
                    <span @click.stop>
                      <el-button
                        class="red"
                        @click="editDialog(scope.row)"
                        :disabled="scope.row.stopFlag == '0'"
                      >
                        <i class="icon his-edit"></i>
                      </el-button>
                    </span>
                  </el-tooltip>
                  <el-tooltip
                    :content="
                  scope.row.stopFlag == '0'
                    ? $t('common.disable')
                    : $t('common.enable')
                "
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
                        @click.stop
                        :class="[scope.row.stopFlag == '0' ? 'red' : 'green']"
                      >
                        <i
                          class="icon"
                          :class="
                        scope.row.stopFlag == '0'
                          ? 'his-disabled'
                          : 'his-automated'
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
      <el-col class="ht" :span="10">
        <div class="his-module his-small">
          <pagenation-list
            ref="pageTableRef"
            v-model="tableData"
            :data-url="`/system-service/sysdictconfig/detail/queryPage/${flagId}`"
            http-method="post"
            :list-height="listSlotHeight - 51 - 40 - 30"
          >
            <!-- table上面的label栏 -->
            <div slot="header" class="row h41">
              <div class="label">
                <h1 class="title">{{ $t('sqlDict.resultDetail') }}</h1>
              </div>
            </div>
            <!-- tabel -->
            <el-table
              :data="tableData"
              border
              stripe
              :highlight-current-row="true"
              slot="list"
              :height="listSlotHeight - 51 - 40 - 24"
              class="scroll-bar"
            >
              <el-table-column prop="dv" :label="$t('common.code1')" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column
                prop="dn"
                :label="$t('medicareData.dataName')"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="py"
                :label="$t('hospitalDataDict.formCItem3')"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="stop"
                :label="$t('table.status')"
                align="center"
                :show-overflow-tooltip="true"
                width="50px"
              >
                <template slot-scope="scope">
                  <span :class="[scope.row.stop == '1' ? 'reds' : 'blues']">
                    {{
                    scope.row.stop == '1'
                    ? $t('common.disable')
                    : $t('common.enable')
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="showOrder"
                :label="$t('common.SortNumber')"
                align="center"
                :show-overflow-tooltip="true"
                width="60px"
              ></el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <!-- 新增修改的dialog -->
      <el-dialog
        :close-on-click-modal="false"
        :title="
        sqlDictForm.dictId !== null ? $t('common.modify') : $t('common.add')
      "
        :visible.sync="dialogVisible"
        width="800px"
        @closed="handleClose"
      >
        <el-form
          label-width="70px"
          :model="sqlDictForm"
          :rules="dictFormRules"
          ref="addSqlDictFormRef"
          class="demo-ruleForm"
        >
          <el-form-item :label="$t('common.code1')" prop="dictCode">
            <el-input v-model="sqlDictForm.dictCode" prop="dictCode"></el-input>
          </el-form-item>
          <el-form-item :label="$t('sqlDict.sqlStatement')" prop="querySql">
            <el-input v-model="sqlDictForm.querySql" prop="querySql" type="textarea" :rows="5"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">{{$t('common.cancel')}}</el-button>
          <el-button type="primary" @click="handleAdd">{{$t('common.confirm')}}</el-button>
        </span>
      </el-dialog>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  addSqlDict,
  editSqlDict,
  enableSqlDict,
  stopSqlDict
} from '@/api/his/dic/fundamentalDate.ts'
@Component({
  name: 'sqlDict'
})
export default class extends Vue {
  private tableDatas: any[] = [] //列表数组
  private tableData: string[] = [] // 查询结果数组
  //搜索时传入的参数
  private searchData = {
    dictCode: <string>''
  }
  private flagId: number | null = null //选中的sql语句的id，未选择时为null
  private listSlotHeight: number = 0 //列表高度
  private dialogVisible: boolean = false //是否显示dialog
  private data: any = {}
  //dialog里面的数据
  private sqlDictForm = <any>{
    dictCode: <string>'',
    querySql: <string>'',
    dictId: <number | null>null
  }
  //校验规则
  private dictFormRules = {
    dictCode: [
      {
        required: true,
        message: window.ele.$i18n.t('sqlDict.codeNotNull'),
        trigger: 'blur'
      }
    ],
    querySql: [
      {
        required: true,
        message: window.ele.$i18n.t('sqlDict.sqlStatementNotNull'),
        trigger: 'blur'
      }
    ]
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }

  mounted() {
    this.getLists()
  }
  private getLists() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }
  // 获取从字典数据
  private getListsF() {
    const pageTableRef: any = this.$refs.pageTableRef
    pageTableRef.searchList()
  }
  // 搜索方法
  private searchList() {
    const pageTable: any = this.$refs.pageTable
    if (this.searchData.dictCode == '') {
      pageTable.getList()
    } else {
      pageTable.searchList()
    }
  }
  //关闭dialog，初始化dialog里面元素的数据
  private handleClose() {
    this.data = {}
    this.sqlDictForm = {
      dictCode: '',
      querySql: '',
      dictId: null
    }
    const addSqlDictFormRef: any = this.$refs.addSqlDictFormRef
    addSqlDictFormRef.resetFields()
  }
  //启用或者停用
  private handleEnable(item: any) {
    if (item.stopFlag == 0) {
      //如果已启用，则调用停用接口
      stopSqlDict({ dictId: item.dictId }).then((res: any) => {
        this.getLists()
        this.$notify({
          title: this.$t('common.disable').toString(),
          message: '',
          type: 'success'
        })
      })
    } else {
      //如果已停用，则调用启用接口
      enableSqlDict({ dictId: item.dictId }).then((res: any) => {
        this.getLists()
        this.$notify({
          title: this.$t('common.enabled').toString(),
          message: '',
          type: 'success'
        })
      })
    }
  }
  //点击某一行的编辑按钮，填充数据并且打开编辑dialog
  private editDialog(row: any) {
    this.sqlDictForm = { ...row }
    this.dialogVisible = true
  }
  //点击上面的table的某一行进行查询
  private handleRowClick(row: any) {
    if (row.stopFlag == '0') {
      //当前sql语句为启用状态
      this.flagId = row.dictId
      this.$nextTick(() => {
        this.getListsF()
      })
    } else {
      //当前sql语句为停用状态
      this.$notify({
        title: row.dictCode + this.$t('common.disabled'),
        message: '',
        type: 'warning'
      })
    }
  }
  //打开新增的dialog
  private addDialog() {
    this.dialogVisible = true
  }
  // 点击按钮新增主字典数据
  private handleAdd() {
    const addSqlDictFormRef: any = this.$refs.addSqlDictFormRef
    addSqlDictFormRef.validate((valid: any) => {
      if (valid) {
        if (this.sqlDictForm.dictId !== null) {
          //如果dictId不为null,调用修改接口
          this.data = { ...this.sqlDictForm }
          editSqlDict(this.data).then(res => {
            this.getLists()
            this.$notify({
              title: this.$t('common.editSuc').toString(),
              message: '',
              type: 'success'
            })
          })
        } else {
          //dictId为null，调用新增接口
          this.data = {
            dictCode: this.sqlDictForm.dictCode,
            querySql: this.sqlDictForm.querySql
          }
          addSqlDict(this.data).then(res => {
            this.getLists()
            this.$notify({
              title: this.$t('common.addSuc').toString(),
              message: '',
              type: 'success'
            })
          })
        }
        //请求完成后关闭dialog
        this.dialogVisible = false
      } else {
        return
      }
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
