// 中医疾病编码维护
<template>
  <div class="content" style="padding: 0">
    <div>
      <div class="right-side">
        <div class="main-bottom">
          <div
            class="his-module ht his-patient-tree scroll-bar"
            style="flex-shrink: 0;"
            :style="{
              width: treeWidth + 'px',
              height: listSlotHeight - 66 + 'px',
            }"
          >
            <div slot="header" class="row" v-show="!folderSide">
              <div class="label">
                <div class="title">中医疾病编码</div>
              </div>
              <div class="action" @click="isHideFolder">
                <i class="icon his-card-put gray" />
              </div>
            </div>
            <div class="open action" @click="isHideFolder" v-if="folderSide">
              <i class="icon his-card-open gray" />
            </div>
            <el-tree
              ref="tree"
              :data="data"
              :props="defaultProps"
              @node-click="handleNodeClick"
              :expand-on-click-node="false"
              v-show="!folderSide && !isDisabled"
              default-expand-all
              class="scroll-bar"
              :highlight-current="true"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <i class="icon" :class="data.childrenList ? getClass(node) : 'his-tree-submen'"></i>
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </div>

          <div
            class="main-middle"
            :style="{ height: listSlotHeight - 66 + 'px',marginLeft: 10+ 'px'}"
            :class="folderSide ? 'main-width1' : 'main-width2'"
          >
            <el-row class="ht" :gutter="10">
              <el-col class="ht" :span="18">
                <div class="his-module his-small">
                  <div class="row" style="padding-bottom: 8px">
                    <div class="label">
                      <div style="font-size: 13px; margin-right: 8px;">搜索</div>
                      <el-input
                        v-model="searchData.pydm"
                        placeholder="请输入拼音码"
                        @keyup.native.enter="searchLists"
                        clearable
                        @clear="searchLists"
                        @input="searchList"
                      >
                        <i slot="prefix" class="el-input__icon icon his-search"></i>
                      </el-input>
                      <el-divider direction="vertical"></el-divider>
                      <div class="btn">
                        <el-button type="text" size="mini" @click="addRelation">
                          <i class="icon his-group green"></i>添加关联
                        </el-button>
                      </div>
                    </div>
                    <div class="operate">
                      <el-button
                        size="mini"
                        type="primary"
                        class="blue-gra"
                        icon="icon his-add"
                        @click="handleAdd"
                      >{{$t('common.add')}}</el-button>
                    </div>
                  </div>
                  <pagenation-list
                    ref="pageTable"
                    data-url="/op-service/dicjbbm/tcmQueryPage"
                    http-method="post"
                    v-model="tableData"
                    :searchData="searchData"
                    :list-height="listSlotHeight+10"
                  >
                    <el-table
                      slot="list"
                      stripe
                      :data="tableData"
                      border
                      :height="listSlotHeight-158"
                      class="scroll-bar"
                      tooltip-effect="light"
                      @row-click="getRowData"
                      highlight-current-row
                    >
                      <el-table-column type="index" width="32" align="center"></el-table-column>
                      <el-table-column
                        label="中医分类"
                        prop="zyfl"
                        min-width="80"
                        show-overflow-tooltip
                      >
                        <template slot-scope="scope">
                          <div>{{zyflList.find(item=> item.zyfl == scope.row.zyfl) && zyflList.find(item=> item.zyfl == scope.row.zyfl).flmc}}</div>
                        </template>
                      </el-table-column>
                      <el-table-column label="疾病代码" prop="jbdm" show-overflow-tooltip></el-table-column>
                      <el-table-column label="疾病名称" prop="jbmc" show-overflow-tooltip></el-table-column>
                      <el-table-column label="拼音码" prop="pydm" show-overflow-tooltip></el-table-column>
                      <el-table-column
                        label="操作"
                        width="52"
                        class-name="action-btns"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <el-tooltip
                            :content="$t('common.delete')"
                            effect="light"
                            :enterable="false"
                          >
                            <el-popconfirm
                              hideIcon
                              :confirmButtonText="$t('common.confirm')"
                              :cancelButtonText="$t('common.cancel')"
                              :title="$t('sysManage.confirmDeleted')"
                              @confirm="deleteCode(scope.row)"
                            >
                              <el-button slot="reference" class="red">
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
              <el-col class="ht" :span="6">
                <div
                  class="his-module his-small his-sys-module"
                  :style="{ height: listSlotHeight - 65 + 'px'}"
                >
                  <div slot="header" class="row his-sys-row">
                    <div class="label">
                      <h1 class="title">{{ isUpd ? $t('common.add') : $t('common.edit')}}</h1>
                    </div>
                    <div class="operate">
                      <el-button
                        type="primary"
                        class="green-gra"
                        icon="icon his-save"
                        @click="handleSave"
                        size="mini"
                      >{{$t('common.save')}}</el-button>
                    </div>
                  </div>
                  <el-form
                    class="retrieval"
                    label-width="67px"
                    :model="addRuleForm"
                    ref="addFormRef"
                    :rules="addFormRules"
                  >
                    <el-form-item label="中医分类" prop="zyfl">
                      <el-select v-model="addRuleForm.zyfl" placeholder="请选择">
                        <el-option
                          v-for="item in zyflList"
                          :key="item.zyfl"
                          :label="item.flmc"
                          :value="item.zyfl"
                        >{{item.flmc}}</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="疾病代码" prop="jbdm">
                      <el-input v-model="addRuleForm.jbdm" placeholder="请输入..."></el-input>
                    </el-form-item>
                    <el-form-item label="疾病名称" prop="jbmc">
                      <el-input v-model="addRuleForm.jbmc" placeholder="请输入..."></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="拼音码" prop="pydm">
                      <el-input v-model="addRuleForm.pydm" placeholder="请输入..."></el-input>
                    </el-form-item>-->
                  </el-form>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="relationVisible"
      title="中医疾病编码维护"
      width="600px"
      class="narrow-dialog"
      :close-on-click-modal="false"
    >
      <div class="content his-sys-content">
        <div class="his-module his-small" style="padding: 0 0 8px">
          <div class="row">
            <div class="label">
              <div class="btn">
                <el-button size="mini" type="text" @click="handleAddNews">
                  <i class="icon his-btn-add green"></i>新增
                </el-button>
                <el-button size="mini" type="text" @click="handleDelete">
                  <i class="icon his-btn-del red"></i>删除
                </el-button>
                <el-button size="mini" type="text" @click="handleSaveNews">
                  <i class="icon his-btn-save"></i>保存
                </el-button>
                <el-button size="mini" type="text" @click="handleClose">
                  <i class="icon his-btn-close red"></i>关闭
                </el-button>
              </div>
            </div>
          </div>
          <el-table
            :data="costData"
            border
            stripe
            :fit="true"
            :highlight-current-row="true"
            :height="listSlotHeight/2"
            class="scroll-bar no-underline"
            :row-class-name="rowClassName"
          >
            <el-table-column type="index" width="32"></el-table-column>
            <el-table-column label="证侯名称" prop="zhmc">
              <template slot-scope="scope">
                <remoteSearchBox
                  :required="true"
                  v-model="scope.row.zhmc"
                  :ref="`${scope.$index}-1`"
                  style="height: 32px"
                  :searchData="{
                  yp:{
                    pydm: '',
                  }
                }"
                  :resultTableHeader="{
                  yp:[
                    {
                      prop: 'zhmc',
                      label: '证侯名称'
                    }
                  ]
                }"
                  :searchField="{
                  yp: 'pydm'
                }"
                  :showLabel="{
                  yp: 'zhmc'
                }"
                  :name="zhmc"
                  @keyup.enter.native="change(scope.$index,1)"
                  @getData="data => getDrugTableData(data,scope.$index)"
                ></remoteSearchBox>
              </template>
            </el-table-column>
            <el-table-column label="备注信息" prop>
              <template slot-scope="scope">
                <input-box
                  :required="true"
                  v-model="scope.row.bzxx"
                  :ref="`${scope.$index}-2`"
                  style="height: 32px"
                  @keyup.enter.native="change(scope.$index,2)"
                ></input-box>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { diseaseChiTree, queryRelaList, queryTypeList, addNewCode, deleteNewCode, editNewCode, editRelateNewCode, delRelateNewCode, addRelateNewCode } from '@/api/his/sys/centerMaintenance/medicareInfoManage/diseaseCode.ts'
import { log } from 'util'
// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'zyDiseases',
  components: {}
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private folderSide: boolean = false
  private treeWidth: number = 190
  private searchData: any = {
    zyfl: null,
    pydm: ''
  }
  private tableData: Array<any> = []
  private data: Array<any> = []
  private defaultProps: any = {
    children: 'childrenList',
    label: 'flmc'
  }
  private blocks: any[] = []
  private isDisabled: boolean = false
  private isUpd: boolean = true // 新增与编辑
  private relationVisible: boolean = false // 添加关联弹框默认隐藏
  private value: any = ''
  private addRuleForm: any = {
    zyfl: '',
    jbdm: '',
    jbmc: '',
    pydm: ''
  }
  private zyflList: Array<any> = [] // 中医分类数组
  private costData: Array<any> = [] // 添加关联数组
  private selectRightRow: number | null = null
  private addRuleFormRules: any = {}
  private ZYFL: number | null = null // 中医分类
  private JBBS: number | null = null // 疾病标识
  private addFormRules: any = {
    zyfl: [{ required: true, message: '中医分类不能为空', trigger: 'blur' }],
    jbdm: [{ required: true, message: '疾病代码不能为空', trigger: 'blur' }],
    jbmc: [{ required: true, message: '疾病名称不能为空', trigger: 'blur' }]
  }

  // 获取中医编码树
  private getZydiseaseTree() {
    diseaseChiTree({}).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        console.log(res)
        this.data = res.data
      }
    })
  }

  // 获取中医分类下拉列表
  private queryTypeList() {
    queryTypeList({}).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        this.zyflList = res.data
      }
    })
  }

  // 按条件查询各页面数据
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }
  // 条件查询
  private searchLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }
  private searchList(val: any) {
    this.searchData.pydm = val
    this.searchLists()
  }

  //  获取单条树节点数据
  private handleNodeClick(data: any) {
    console.log(data)
    this.handleAdd()
    this.$nextTick(() => {
      this.addRuleForm.zyfl = JSON.parse(JSON.stringify(data.zyfl))
      this.ZYFL = JSON.parse(JSON.stringify(data.zyfl))
    })
    this.searchData.zyfl = data.zyfl

    this.getList()
  }

  // 新增按钮
  private handleAdd() {
    // this.$nextTick(()=>{
    //   const el: any = this.$refs.addFormRef
    //   el.resetFields()
    // })
    this.isUpd = true
    this.addRuleForm = {
      zyfl: '',
      jbdm: '',
      jbmc: '',
      pydm: ''
    }
    this.addRuleForm.zyfl = this.ZYFL
    this.addRuleForm.jbdm = ''
    this.addRuleForm.jbmc = ''
    this.addRuleForm.pydm = ''
  }

  // 新增与修改保存
  private handleSave() {
    const params1: any = {
      jbdm: this.addRuleForm.jbdm,
      jbmc: this.addRuleForm.jbmc,
      zyfl: this.addRuleForm.zyfl
    }
    const params2: any = {
      jbdm: '',
      jbmc: '',
      pydm: '',
      wbdm: '',
      zyfl: '',
      jbbs: ''
    }
    ;(this.$refs.addFormRef as Form).validate((valid: boolean) => {
      if (valid) {
        if (this.isUpd) {
          addNewCode(params1).then((res: any) => {
            if (res.errorCode === 'SUCCESS') {
              this.$notify({
                title: '新增成功',
                message: '',
                type: 'success'
              })
              this.getList()
              this.$nextTick(() => {
                const el: any = this.$refs.addFormRef
                el.resetFields()
              })
              this.isUpd = true
              this.addRuleForm = {
                zyfl: '',
                jbdm: '',
                jbmc: '',
                pydm: ''
              }
            }
          })
        } else {
          editNewCode(this.addRuleForm).then((res: any) => {
            if (res.errorCode === 'SUCCESS') {
              this.$notify({
                title: '修改成功',
                message: '',
                type: 'success'
              })
              this.getList()
              this.$nextTick(() => {
                const el: any = this.$refs.addFormRef
                el.resetFields()
              })
              this.isUpd = true
              this.addRuleForm = {
                zyfl: '',
                jbdm: '',
                jbmc: '',
                pydm: ''
              }
            }
          })
        }
      }
    })
  }

  // 删除疾病编码
  private deleteCode(row: any) {
    console.log(row);

    deleteNewCode({jbbs: row.jbbs}).then((res: any)=> {
      if(res.errorCode == "SUCCESS") {
        this.$notify({
          title: '删除成功',
          message: '',
          type: 'success'
        })
        this.getList()
        this.handleAdd()
      }
    })
  }


  // 获取表格单行数据
  private getRowData(row: any) {
    console.log(row)
    const el: any = this.$refs.addFormRef
    el.resetFields()
    this.isUpd = false
    this.addRuleForm = Object.assign(this.addRuleForm, row)
    this.JBBS = row.jbbs
  }

  // 点击添加关联弹框显示
  private addRelation() {
    if (this.JBBS) {
      this.relationVisible = true
      queryRelaList({ jbbs: this.JBBS }).then((res: any) => {
        if (res.errorCode == 'SUCCESS') {
          //  this.costData = res.data
        }
      })
    } else {
      this.$message({
        message: '请先选择行！',
        type: 'warning'
      })
    }
  }

  //把每一行的索引放进row
  private rowClassName({ row, rowIndex }: any) {
    row.drugRowIndex = rowIndex
  }

  // 新增一行数据
  private handleAddNews() {
    if (this.costData.length > 0) {
      let oldRowData = this.costData[this.costData.length - 1]
      if (oldRowData.ypmc) {
        this.costData = [{}, ...this.costData]
      }
    } else {
      this.costData = [{}, ...this.costData]
    }
    this.$nextTick(() => {
      // console.log('~~~~~', this.$refs[`${this.costData.length - 1}-${2}`])
      ;(this.$refs[`0-1`] as any).focus()
    })
    this.selectRightRow = this.costData.length - 1
  }

  // 添加关联的删除
  private handleDelete() {
    if (this.selectRightRow != null && this.selectRightRow >= 0) {
      this.costData.splice(0, 1)
      this.selectRightRow = this.costData.length - 1
    }
  }

  // 添加关联的保存
  private handleSaveNews() {
    const params: any = {
      jbbs: '',
      zhbs: '',
      zzbs: '',
      bbxx: ''
    }
    addRelateNewCode(params).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        console.log(res)
      }
    })
  }

  // 输入enter切换焦点
  private change(index: any, labelIndex: number) {}

  /**
   * @Description: 隐藏中医疾病编码维护
   * @param {type} params
   * @return:
   */
  private isHideFolder() {
    // this.folderSide = !this.folderSide
    if (this.folderSide) {
      // this.treeWidth = 24
      this.treeWidth = 190
      this.folderSide = !this.folderSide
    } else {
      // this.treeWidth = 164
      this.treeWidth = 24
      this.folderSide = !this.folderSide
    }
  }

  // 切换el-tree 样式
  private getClass(node: any) {
    if (node.expanded) {
      return 'his-tree-Folder'
    } else {
      return 'his-tree-Folder_unfold'
    }
  }

  // 中医疾病编码关闭事件
  private handleClose() {
    this.relationVisible = false
  }

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    this.getZydiseaseTree()
    this.queryTypeList()
  }
}
</script>
<style lang="scss" scoped>
// 添加关联弹框样式
.his-sys-content {
  height: auto;
  border-radius: 8px;
  background: white;
}
::v-deep .el-table::before {
  height: 0;
}

.row .label .el-input {
  width: 190px;
}
.his-sys-module {
  padding: 8px 10px !important;
}
.his-sys-row {
  padding-bottom: 8px !important;
}

.right-side {
  width: calc(100%);
  border-radius: 8px;
  //   上方模块

  .main-bottom {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;

    .his-module {
      /*padding: 6px 10px !important;*/

      .row {
        height: 37px;
        padding-bottom: 0;

        .label {
          height: 37px !important;
        }
      }
    }
  }

  // 中间
  .main-width1 {
    width: calc(100% - 34px);
  }

  .main-width2 {
    width: calc(100% - 174px);
  }

  .main-middle {
    display: flex;
    flex-direction: column;

    ::v-deep .el-tabs__header {
      margin-bottom: 8px;
      background: #fff;
      border-radius: 8px;
      padding: 6px 0 6px 10px;
    }

    .btn-child {
      display: flex;
      flex-flow: row nowrap;
      border-bottom: 1px solid #f0f0f0;
      padding: 0 0 0 16px;

      .middle-btn {
        display: flex;
        flex-flow: row nowrap;

        span {
          margin-right: 24px;
          margin-top: 16px;

          &.actived-btn {
            color: #1485ff;
            border-bottom: 2px solid #1485ff;
            padding-bottom: 8px;
          }
        }
      }
    }

    .choose-style {
      display: flex;
      flex-flow: row nowrap;
      padding-left: 16px;

      .middle-btn {
        display: flex;
        flex-flow: row nowrap;
        padding: 10px 0;

        span {
          margin-right: 10px;

          &.actived-btn {
            color: #1485ff;
            border-bottom: 2px solid #1485ff;
            padding-bottom: 10px;
          }
        }
      }
    }
  }
}
</style>
