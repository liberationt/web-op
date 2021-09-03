<!--
 * @Author: dmj
 * @LastEditTime:
 * @LastEditors:dl
 * @Description:系统参数配置
 * @FilePath:
-->
<template>
  <div class="content" style="padding: 0">
    <div>
      <div class="right-side">
        <div class="main-bottom">
          <div
            class="his-module ht his-patient-tree"
            style="flex-shrink: 0;"
            :style="{
              width: treeWidth + 'px',
              height: listSlotHeight - 10 + 'px',
            }"
          >
            <div slot="header" class="row" v-show="!folderSide">
              <div class="label">
                <div class="title">系统参数配置</div>
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
              :data="leftTreeData"
              :props="defaultProps"
              @node-click="getNodeData"
              :expand-on-click-node="false"
              v-show="!folderSide && !isDisabled"
              default-expand-all
              class="scroll-bar"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <i class="icon" :class="data.children ? getClass(node) : 'his-tree-submen'"></i>
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </div>

          <div
            class="main-middle"
            :style="{ height: listSlotHeight - 10 + 'px',marginLeft: 10+ 'px'}"
            :class="folderSide ? 'main-width1' : 'main-width2'"
          >
            <el-row class="ht" :gutter="10">
              <el-col class="ht" :span="17">
                <div class="his-module his-small">
                  <div class="row" style="padding-bottom: 8px">
                    <div class="label">
                      <div style="font-size: 13px; margin-right: 8px;">搜索</div>
                      <el-input
                        v-model="searchData.csmc"
                        placeholder="请输入参数名称搜索"
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
                    data-url="/system-service/systemParameter/queryPage"
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
                      :height="listSlotHeight-105"
                      class="scroll-bar"
                      tooltip-effect="light"
                      @row-click="handleRowData"
                      highlight-current-row
                    >
                      <el-table-column prop="webSortNumber" width="32"></el-table-column>
                      <el-table-column label="机构名称" prop="jgid" width="100">
                        <template slot-scope="scope">
                          <div>
                            {{$store.state.webSqlDict.SUPER_ORGAN_DICT.find(item => item.dv == scope.row.jgid) &&
                            $store.state.webSqlDict.SUPER_ORGAN_DICT.find(item => item.dv == scope.row.jgid).dn}}
                          </div>
                        </template>
                      </el-table-column>
                      <!-- $store.state.webSqlDict.CATEGORY_DICT.find(item => item.dv == scope.row.sslb) && 
                      $store.state.webSqlDict.CATEGORY_DICT.find(item => item.dv == scope.row.sslb).dn-->
                      <el-table-column label="参数名称" prop="csmc" width="90" show-overflow-tooltip></el-table-column>
                      <el-table-column label="所属类别" width="130" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <div>{{transer(scope.row.sslb)}}</div>
                        </template>
                      </el-table-column>
                      <el-table-column label="参数值" prop="csz" width="58" show-overflow-tooltip></el-table-column>
                      <el-table-column label="业务类别" prop="mrz" width="70"></el-table-column>
                      <el-table-column label="备注" prop="bz" show-overflow-tooltip></el-table-column>
                      <el-table-column
                        label="操作"
                        width="52"
                        class-name="action-btns"
                        align="center"
                        fixed="right"
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
              <el-col class="ht" :span="7">
                <div
                  class="his-module his-small his-sys-module"
                  :style="{ height: listSlotHeight - 10 + 'px'}"
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
                        size="mini"
                        @click="handleSave"
                      >{{$t('common.save')}}</el-button>
                    </div>
                  </div>
                  <el-form label-width="67px" :model="ruleForm" ref="ruleForm" :rules="rule">
                    <el-form-item label="参数名称" prop="csmc" :class="[isUpd ? '' : 'is-disabled']">
                      <el-input v-model="ruleForm.csmc" placeholder="请输入参数名称" :disabled="!isUpd" />
                    </el-form-item>
                    <el-form-item label="所属类别" prop="sslb">
                      <el-select
                        placeholder="请选择"
                        v-model="ruleForm.sslb"
                        multiple
                        collapse-tags
                      >
                        <el-option
                          v-for="item in this.sslbList"
                          :key="item.dv"
                          :label="item.dn"
                          :value="item.dv"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="参数值" prop="csz">
                      <el-input v-model="ruleForm.csz" placeholder="请输入..."></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                      <el-input v-model="ruleForm.bz" placeholder="请输入..."></el-input>
                    </el-form-item>
                    <el-form-item label="详细说明">
                      <el-input v-model="ruleForm.xxsm" placeholder="请输入..."></el-input>
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
import { flatten } from 'lodash'
import { getTableData, dictExecuteSql } from '@/websql/functions'
import { id2Name } from '../../../../../../utils'
import { forEach } from 'jszip'
import { log } from 'util'
import { saveSystem, delSystem, searchSingle } from '@/api/his/sys/centerMaintenance/medicareInfoManage/systemParameter.ts'

@Component({
  name: 'departRegist',
  filters: {},
  components: {}
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private tableData: Array<any> = []
  private isCreateNewJob: boolean = false
  private leftCol: number = 192 // 左侧布局
  private rrCol: number = 400 // 右侧右侧布局
  private treeWidth: number = 164
  private folderSide: boolean = false
  private isDisabled: boolean = false
  private searchData: any = {
    csmc: '',
    bz: '',
    sslb: []
  } //搜索参数
  private isUpd: boolean = true //新增或编辑
  private sslbList: Array<any> = [] // 所属类别字典表
  private value2: any = ''
  private ruleForm: any = {
    sslb: [],
    bz: '',
    xxsm: '',
    csz: '',
    csmc: ''
  } //表单数据
  private valueData1: any = ''
  //表单验证
  private rule: object = {
    csmc: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
  }
  private leftTreeData: Array<any> = [
    {
      dn: '全部',
      children: []
    }
  ]
  private defaultProps: object = {
    children: 'children',
    label: 'dn'
  }

  // 条件查询
  searchLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }

  // 获取点击行表格数据
  private handleRowData(row: any) {
    this.isUpd = false
    console.log(row)

    searchSingle({ csmc: row.csmc }).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.ruleForm = res.data
        if (!this.ruleForm.sslb) {
          this.ruleForm.sslb = []
        } else {
          this.ruleForm.sslb = this.ruleForm.sslb.split(',')
        }

        console.log(this.ruleForm)
      }
    })
  }
  //点击新增
  private handleAdd() {
    this.isUpd = true
    this.$nextTick(() => {
      const el: any = this.$refs.ruleForm
      el.resetFields()
    })
    this.ruleForm.bz = ''
    this.ruleForm.xxsm = ''
  }

  // 保存按钮
  private handleSave() {
    console.log(this.ruleForm)
    ;(this.$refs.ruleForm as Form).validate((valid: boolean) => {
      if (valid) {
        let sslbArr = ''
        sslbArr = this.ruleForm.sslb.join(',')
        this.ruleForm.sslb = sslbArr
        saveSystem(this.ruleForm).then((res: any) => {
          if (res.errorCode === 'SUCCESS') {
            if (this.isUpd) {
              this.$notify({
                title: this.$t('common.addSuc').toString(),
                message: '',
                type: 'success'
              })
            } else {
              this.$notify({
                title: this.$t('common.editSuc').toString(),
                message: '',
                type: 'success'
              })
            }
            this.getList()
            this.handleAdd()
          }
        })
      }
    })
  }
  // 获取表格数据
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private getClass(node: any) {
    if (node.expanded) {
      return 'his-tree-Folder'
    } else {
      return 'his-tree-Folder_unfold'
    }
  }

  private labelPosition: string = 'right'
  private formLabelAlign: object = {
    name: '',
    region: '',
    type: ''
  }

  // 左侧伸缩框宽度切换
  private isHideFolder() {
    if (this.folderSide) {
      this.treeWidth = 164
      this.folderSide = !this.folderSide
    } else {
      this.treeWidth = 24
      this.folderSide = !this.folderSide
    }
  }

  // 获取树的某个节点数据
  private getNodeData(data: any) {
    console.log(data)
    this.searchData.sslb = data.dv
    this.getList()
  }

  // 删除
  private handleDelete(row: any) {
    delSystem({ csmc: row.csmc }).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        this.handleAdd()
        this.getList()
        this.$notify({
          title: this.$t('common.delSuc').toString(),
          message: '',
          type: 'success'
        })
      }
    })
  }

  // 转换
  private transer(sslb: string | null) {
    if (sslb != null) {
      let sslbName: Array<any> = []
      sslb.split(',').forEach((el: any) => {
        let name = this.$store.state.webSqlDict.CATEGORY_DICT.find((item: any) => item.dv == el) && this.$store.state.webSqlDict.CATEGORY_DICT.find((item: any) => item.dv == el).dn
        sslbName.push(name)
      })
      return sslbName.join(',')
    }
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    this.sslbList = this.$store.state.webSqlDict.CATEGORY_DICT
    this.leftTreeData[0].children = this.sslbList
    this.getList()
  }
}
</script>



<style lang="scss" scoped>
.his-module.his-small {
  padding: 8px 10px;
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
  }
  .content .his-small .el-form .el-form-item .el-form-item__label {
    line-height: 12px !important;
  }
}

.icon his-tree-Folder {
  margin-right: 8px;
}
.icon .his-tree-Folder_unfold {
  margin-right: 8px;
}
span {
  font-size: 13px;
  color: #222b31;
}

// 右侧表单样式
.content .his-module .el-form {
  margin: 16px auto;
}
</style>
