// 中医证侯编码维护
<template>
  <div class="content" style="padding: 0">
    <div>
      <div class="right-side">
        <div class="main-bottom">
          <!-- 中医证侯编码 -->
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
                <div class="title">中医证侯编码</div>
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
              highlight-current
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
              <el-col class="ht" :span="17">
                <div class="his-module his-small">
                  <div class="row" style="padding-bottom: 8px">
                    <div class="label">
                      <div style="font-size: 13px; margin-right: 8px;">搜索</div>
                      <el-input
                        v-model="searchData.pydm"
                        placeholder="请输入拼音码"
                        clearable
                        @keyup.native.enter="searchLists"
                        @clear="searchLists"
                      >
                        <i slot="prefix" class="el-input__icon icon his-search"></i>
                      </el-input>
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
                    data-url="/op-service/dicjbbm/zhQueryPage"
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
                        label="证侯分类"
                        prop="zhfl"
                        min-width="80"
                        show-overflow-tooltip
                      >
                        <template slot-scope="scope">
                          <div>{{$store.state.webSqlDict.SYNDROME_TYPE_DICT.find(item => item.dv == scope.row.zhfl) && $store.state.webSqlDict.SYNDROME_TYPE_DICT.find(item => item.dv == scope.row.zhfl).dn}}</div>
                        </template>
                      </el-table-column>
                      <el-table-column label="证侯代码" prop="zhdm" width="110px" show-overflow-tooltip></el-table-column>
                      <el-table-column
                        label="证侯名称"
                        prop="zhmc"
                        min-width="150"
                        show-overflow-tooltip
                      ></el-table-column>
                      <el-table-column label="拼音码" prop="pydm" width="100" show-overflow-tooltip></el-table-column>
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
                              @confirm="handleDelete(scope.row)"
                            >
                              <el-button @click.stop slot="reference" class="red">
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
              <el-col class="ht" :span="7">
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
                    :model="addRuleForm"
                    class="retrieval"
                    label-width="67px"
                    ref="addFormRef"
                    :rules="addFormRules"
                  >
                    <el-form-item label="证侯分类" prop="zhfl">
                      <el-select v-model="addRuleForm.zhfl" filterable>
                        <el-option
                          v-for="item in zhflList"
                          :key="item.zhfl"
                          :label="item.flmc"
                          :value="item.zhfl"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="证侯代码" prop="zhdm">
                      <el-input v-model="addRuleForm.zhdm" placeholder="请输入..."></el-input>
                    </el-form-item>
                    <el-form-item label="证侯名称" prop="zhmc">
                      <el-input v-model="addRuleForm.zhmc" @blur="getPycode" placeholder="请输入..."></el-input>
                    </el-form-item>
                    <el-form-item label="拼音码" prop="pydm">
                      <el-input v-model="addRuleForm.pydm" placeholder="请输入..."></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { syndromTreeData, addSyndrom, delSyndrom, editSyndrom, geSyndromtList, getMnemonic } from '@/api/his/sys/centerMaintenance/medicareInfoManage/diseaseCode.ts'
// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'zySyndrome',
  components: {}
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private folderSide: boolean = false
  private treeWidth: number = 200
  private searchData: any = {
    id: null,
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
  private isUpd: boolean = true //新增与编辑
  private value: any = ''
  private ZHFL: number | null = null // 证侯分类
  private zhflList: Array<any> = [] // 证侯分类数组
  private addRuleForm: any = {
    zhfl: '',
    zhdm: '',
    zhmc: '',
    pydm: ''
  }

  private addFormRules: any = {
    zhfl: [{ required: true, message: '证侯分类不能为空', trigger: 'blur' }],
    zhdm: [{ required: true, message: '证侯代码不能为空', trigger: 'blur' }],
    zhmc: [{ required: true, message: '证侯名称不能为空', trigger: 'blur' }]
  }

  // 获取中医证侯树
  private getZysyndromeTree() {
    syndromTreeData({}).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        this.data = res.data
      }
    })
  }

  // 按条件查询各页数据
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 条件查询
  private searchLists() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

  // 新增按钮
  private handleAdd() {
    this.isUpd = true
    ;(this.addRuleForm.zhfl = this.ZHFL), (this.addRuleForm.zhdm = ''), (this.addRuleForm.zhmc = ''), (this.addRuleForm.pydm = '')
  }

  // 新增与修改的保存
  private handleSave() {
    ;(this.$refs.addFormRef as Form).validate((valid: boolean) => {
      if (valid) {
        if (this.isUpd) {
          this.$nextTick(() => {
            addSyndrom(this.addRuleForm).then((res: any) => {
              if (res.errorCode === 'SUCCESS') {
                this.$notify({
                  title: '新增成功',
                  message: '',
                  type: 'success'
                })
                this.getList()
                this.handleAdd()
              }
            })
          })
        } else {
          this.$nextTick(() => {
            editSyndrom(this.addRuleForm).then((res: any) => {
              if (res.errorCode === 'SUCCESS') {
                this.$notify({
                  title: '修改成功',
                  message: '',
                  type: 'success'
                })
                this.getList()
                this.handleAdd()
              }
            })
          })
        }
      }
    })
  }

  // 获取表格单行数据
  private getRowData(row: any) {
    console.log(row)
    const el: any = this.$refs.addFormRef
    el.resetFields()
    this.addRuleForm = Object.assign(this.addRuleForm, row)
    this.isUpd = false
  }

  // 获取证侯分类下拉列表
  private queryTypeList() {
    geSyndromtList({}).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        console.log(res.data)
        this.zhflList = res.data
        console.log(this.zhflList)
      }
    })
  }

  // 删除证侯
  private handleDelete(row: any) {
    delSyndrom({ zhbs: row.zhbs }).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        this.$notify({
          title: '已删除',
          message: '',
          type: 'success'
        })
        this.getList()
        this.isUpd = true
        this.addRuleForm = {
          zhfl: '',
          zhdm: '',
          zhmc: '',
          pydm: ''
        }
      }
    })
  }

  // 获取拼音码
  private getPycode() {
    if (this.addRuleForm.zhmc) {
      getMnemonic({ typeList: ['py'], value: this.addRuleForm.zhmc }).then((res: any) => {
        if (res) {
          this.addRuleForm.pydm = res.data.py
        }
      })
    } else {
      this.addRuleForm.pydm = null
    }
  }

  /**
   * @Description: 隐藏门诊病历
   * @param {type} params
   * @return:
   */
  private isHideFolder() {
    // this.folderSide = !this.folderSide
    if (this.folderSide) {
      // this.treeWidth = 24
      this.treeWidth = 200
      this.folderSide = !this.folderSide
    } else {
      // this.treeWidth = 164
      this.treeWidth = 24
      this.folderSide = !this.folderSide
    }
  }

  //  点击中医证侯事件
  private handleNodeClick(data: any) {
    console.log(data)
    this.handleAdd()
    this.$nextTick(() => {
      this.addRuleForm.zhfl = JSON.parse(JSON.stringify(data.zhfl))
      this.ZHFL = JSON.parse(JSON.stringify(data.zhfl))
    })
    this.searchData.id = data.id
    this.getList()
  }

  // 切换el-tree 样式
  private getClass(node: any) {
    if (node.expanded) {
      return 'his-tree-Folder'
    } else {
      return 'his-tree-Folder_unfold'
    }
  }

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    this.getZysyndromeTree()
    this.queryTypeList()
  }
}
</script>
<style lang="scss" scoped>
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
