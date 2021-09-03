<!--
 * @Date: 2020-07-24 13:57:46
 * @LastEditTime: 
 * @Description:病人性质维护
 * @FilePath: \web-op\src\views\his\sys\centerMaintenance\medicareInfoManage\patientNature\patientNature.vue
-->
<template>
  <div class="content">
    <div class="right-side">
      <div class="main-bottom">
        <div
          class="his-module ht his-patient-tree"
          style="flex-shrink: 0"
          :style="{
            width: treeWidth + 'px',
            height: listSlotHeight -10 + 'px',
          }"
        >
          <div slot="header" class="row" v-show="!folderSide">
            <div class="label">
              <div class="title">患者性质</div>
            </div>
            <div class="action" @click="isHideFolder">
              <i class="icon his-card-put gray"></i>
            </div>
          </div>
          <div class="open action" @click="isHideFolder" v-if="folderSide">
            <i class="icon his-card-open gray"></i>
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
            <span class="custom-tree-node" slot-scope="{ node, data}">
              <i class="icon" :class="data.childrenList ? getClass(node) : 'his-tree-submen'"></i>
              <span>{{ node.label }}</span>
              <span style="position: absolute;right:0">
                <el-dropdown trigger="click">
                  <span class="is_icon">
                    <i class="icon his-caidanliebiao-more1"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleAppend(node,data)">新增</el-dropdown-item>
                    <el-dropdown-item @click.native="handleEdit(node,data)">修改</el-dropdown-item>
                    <el-dropdown-item @click.native="handleDelete(node,data)">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </span>
          </el-tree>
        </div>
        <div
          class="main-middle"
          :style="{height: listSlotHeight + 'px',marginLeft: 10 + 'px'}"
          :class="folderSide ? 'main-width1' : 'main-width2'"
        >
          <!-- tab 标签页 -->
          <el-tabs class="tab-small" v-model="activeName" @tab-click="chooseName">
            <el-tab-pane label="自负比例" name="proportion">
              <proportion
                v-model="list"
                ref="proportion"
                @setRow="getRow"
                v-bind:zfblListData="zfblListData"
              ></proportion>
            </el-tab-pane>
            <el-tab-pane label="药品限制" name="drugLimit">
              <drugLimit v-model="list" ref="drugLimit" @setRow="getRow" v-bind:BRXZ="BRXZ"></drugLimit>
            </el-tab-pane>
            <el-tab-pane label="费用限制" name="costLimit">
              <costLimit v-model="list" ref="costLimit" @setRow="getRow" v-bind:BRXZ="BRXZ"></costLimit>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>

    <el-dialog
      title="患者性质维护-新增"
      :visible.sync="isAdd"
      width="40%"
      :append-to-body="true"
      class="narrow-dialog"
    >
      <el-form
        label-width="120px"
        ref="mergerFormRef"
        :model="mergerForm"
        class="his-sys-merger retrieval"
      >
        <el-row type="flex">
          <el-form-item label="顺序号" prop="plsx">
            <el-input v-model="mergerForm.plsx" placeholder="请输入..."></el-input>
          </el-form-item>
          <el-form-item label="性质名称" prop="xzmc">
            <el-input v-model="mergerForm.xzmc" placeholder="请输入..." @blur="getPycode"></el-input>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="拼音代码" prop="pydm">
            <el-input v-model="mergerForm.pydm" placeholder="请输入..."></el-input>
          </el-form-item>
          <el-form-item label="险种" prop="dbpb">
            <search-select
              v-model="mergerForm.dbpb"
              :clearable="false"
              table-name="SYS_FLAG_DATA"
              kid="XZ000003"
              :backfillValue="mergerForm.dbpb"
            ></search-select>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="性质控制大类" prop="xzdl">
            <search-select
              v-model="mergerForm.xzdl"
              :clearable="false"
              table-name="SYS_FLAG_DATA"
              kid="XZ000002"
              :backfillValue="mergerForm.xzdl"
            ></search-select>
          </el-form-item>
          <el-form-item label="证号判别" prop="zhpb">
            <search-select
              v-model="mergerForm.zhpb"
              :clearable="false"
              table-name="SYS_FLAG_DATA"
              kid="XZ000001"
              :backfillValue="mergerForm.zhpb"
            ></search-select>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="门诊使用" prop="mzsy">
            <search-select
              v-model="mergerForm.mzsy"
              :clearable="false"
              table-name="SYS_FLAG_DATA"
              kid="FD000005"
              :backfillValue="mergerForm.mzsy"
            ></search-select>
          </el-form-item>
          <el-form-item label="住院使用" prop="zysy">
            <search-select
              v-model="mergerForm.zysy"
              :clearable="false"
              table-name="SYS_FLAG_DATA"
              kid="FD000005"
              :backfillValue="mergerForm.zysy"
            ></search-select>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="床费限价" prop="cfxj">
            <el-input v-model="mergerForm.cfxj" placeholder="请输入..."></el-input>
          </el-form-item>
          <el-form-item label="处方限额" prop="cfxe">
            <el-input v-model="mergerForm.cfxe" placeholder="请输入..."></el-input>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="退费分布交易" prop="tffbjy">
            <search-select
              v-model="mergerForm.tffbjy"
              :clearable="false"
              table-name="SYS_FLAG_DATA"
              kid="FD000005"
              :backfillValue="mergerForm.tffbjy"
            ></search-select>
          </el-form-item>
          <el-form-item label="VIP床位费" prop="vipcwfy">
            <search-select
              v-model="mergerForm.vipcwfy"
              :clearable="false"
              table-name="SYS_FLAG_DATA"
              kid="FD000005"
              :backfillValue="mergerForm.vipcwfy"
            ></search-select>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAdd = false">取 消</el-button>
        <el-button type="primary" @click="addNewNode">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { patientNatureTree, addPatientNatureTree, editPatientNatureTree, delPatientNatureTree, addCostLimit, editCostLimit, delCostLimit, addDrugLimit, editDrugLimit, delDrugLimit, getMnemonic, getSelfProportion, getPatientDetail, getCostDetail } from '@/api/his/sys/centerMaintenance/medicareInfoManage/patientNature.ts'
import proportion from '../components/proportion.vue'
import drugLimit from '../components/drugLimit.vue'
import costLimit from '../components/costLimit.vue'
import { log } from 'util'

// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'patientNature',
  components: {
    proportion,
    drugLimit,
    costLimit
  },
  filters: {}
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private activeName: string = 'proportion' // 默认显示自负比例
  private isUpd: boolean = true // 新增还是保存
  private isDisabled: boolean = false
  private folderSide: boolean = false
  private BRXZ: number | null = null // 病人性质
  private zfblListData: Array<any> = [] // 自负比例数据
  private mergerForm: any = {
    plsx: null,
    xzmc: '',
    pydm: '',
    dbpb: '0',
    xzdl: '',
    zhpb: '0',
    mzsy: 1,
    zysy: 1,
    cfxj: 0,
    cfxe: 0,
    tffbjy: '0',
    vipcwfy: '0',
    sjxz: null
  }
  private isAdd: boolean = false
  private treeWidth: number = 264
  private list: Array<any> = []
  private searchData: any = {
    ybdataId: 1,
    dataName: ''
  }
  private data: Array<any> = []
  private defaultProps: any = {
    children: 'childrenList',
    label: 'xzmc'
  }

  // 获取病人性质树数据
  private getTreeData() {
    patientNatureTree({}).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        console.log(res)
        this.data = res.data
      }
    })
  }

  // 获取树单个节点的数据并刷新列表
  private handleNodeClick(data: any) {
    this.mergerForm.sjxz = data.brxz
    console.log(this.mergerForm.sjxz)
    this.BRXZ = data.brxz
    switch (this.activeName) {
      case 'proportion':
        getSelfProportion({ brxz: this.BRXZ }).then((res: any) => {
          if (res.errorCode === 'SUCCESS') {
            console.log(res)
            this.zfblListData = res.data
            // 先获取数据，再刷新页面
            this.$nextTick(() => {
              ;(this.$refs.proportion as any).getList()
            })
          }
        })
        break
      case 'drugLimit':
        this.$nextTick(() => {
          ;(this.$refs.drugLimit as any).getList()
        })
        break
      case 'costLimit':
        this.$nextTick(() => {
          ;(this.$refs.costLimit as any).getList()
        })
        break
    }
  }

  // 新增树节点弹窗表单获取拼音码
  private getPycode() {
    if (this.mergerForm.xzmc) {
      getMnemonic({ typeList: ['py'], value: this.mergerForm.xzmc }).then((res: any) => {
        this.mergerForm.pydm = res.data.py
      })
    } else {
      this.mergerForm.pydm = null
    }
  }

  // 弹出新增子节点的弹窗
  private handleAppend(node: any, data: any) {
    this.isUpd = true
    console.log(node, data)
    this.isAdd = true
  }

  // 弹出编辑子节点的弹框
  private handleEdit(node: any, data: any) {
    this.isUpd = false
    this.isAdd = true
    getPatientDetail({ brxz: this.BRXZ }).then((res: any) => {
      console.log(res)
      this.mergerForm = Object.assign(this.mergerForm, res.data)
    })
  }

  // 新增子节点
  private addNewNode() {
    ;(this.$refs.mergerFormRef as Form).validate((valid: boolean) => {
      if (valid) {
        if (this.isUpd) {
          addPatientNatureTree(this.mergerForm).then((res: any) => {
            if (res.errorCode == 'SUCCESS') {
              this.$notify({
                title: '新增成功',
                message: '',
                type: 'success'
              })
              this.getTreeData()
              this.isAdd = false
              this.$nextTick(() => {
                const el: any = this.$refs.mergerFormRef
                el.resetFields()
              })
            }
          })
        } else {
          editPatientNatureTree(this.mergerForm).then((res: any) => {
            if (res.errorCode === 'SUCCESS') {
              this.$notify({
                title: '修改成功',
                message: '',
                type: 'success'
              })
              this.getTreeData()
              this.isAdd = false
              this.$nextTick(() => {
                const el: any = this.$refs.mergerFormRef
                el.resetFields()
              })
            }
          })
        }
      }
    })
  }

  // 弹出删除子节点的弹出
  private handleDelete() {
    this.$confirm('删除操作将无法恢复，是否继续？', '确认删除病人性质', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      delPatientNatureTree({ brxz: this.BRXZ }).then((res: any) => {
        if (res.errorCode === 'SUCCESS') {
          this.$notify({
            title: '已删除!',
            message: '',
            type: 'success'
          })
          this.getTreeData()
        }
      })
    })
  }

  /* 切换tab，并查询对应tab的列表数据 */
  private chooseName(tab: any, event: any) {
    if (this.BRXZ) {
      tab.name = this.activeName
      switch (tab.name) {
        case 'proportion':
          getSelfProportion({ brxz: this.BRXZ }).then((res: any) => {
            if (res.errorCode === 'SUCCESS') {
              console.log(res)
              this.zfblListData = res.data
              // 先获取数据，再刷新页面
              this.$nextTick(() => {
                ;(this.$refs.proportion as any).getList()
              })
            }
          })
          break
        case 'drugLimit':
          ;(this.$refs.drugLimit as any).getList()
          break
        case 'costLimit':
          ;(this.$refs.costLimit as any).getList()
          break
      }
    }
  }
  /**
   * @Description: 隐藏患者性质
   * @param {type} params
   * @return:
   */
  private isHideFolder() {
    // this.folderSide = !this.folderSide
    if (this.folderSide) {
      // this.treeWidth = 24
      this.treeWidth = 264
      this.folderSide = !this.folderSide
    } else {
      // this.treeWidth = 164
      this.treeWidth = 24
      this.folderSide = !this.folderSide
    }
  }

  // 切换el-tree icon样式
  private getClass(node: any) {
    if (node.expanded) {
      return 'his-tree-Folder'
    } else {
      return 'his-tree-Folder_unfold'
    }
  }

  // 选中列表一行数据，从子组件获取右侧表单数据
  private getRow(val: any) {}

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    this.getTreeData()
  }
}
</script>
<style lang="scss" scoped>
.tags-view-item {
  display: inline-block;
  cursor: pointer;
  height: 32px;
  line-height: 32px;
  color: #9ca0ab;
  background: #eceded;
  padding: 0 8px;
  font-size: 12px;
  margin-left: 5px;
  border-radius: 8px;

  &:first-of-type {
    margin-left: 15px;
  }
  &:last-of-type {
    margin-right: 15px;
  }
  &.active {
    background: linear-gradient(315deg, rgba(45, 187, 255, 1) 0%, rgba(20, 133, 255, 1) 100%);
    color: #fff;
  }
}

.tab-small ::v-deep .el-tabs__header {
  border-bottom: 1px solid #f0f0f0 !important;
}

::v-deep .el-tabs__nav-scroll {
  background: $white;
  border-radius: 8px;
  padding: 8px 10px;
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

// 项目归并弹框样式
.his-sys-merger {
  padding-top: 8px !important;
}

::v-deep .el-dialog .el-dialog__body .el-form-item {
  margin-bottom: 8px;
}
::v-deep .el-dialog .el-dialog__body .el-form-item .el-form-item__content .el-input__inner {
  height: 28px;
}
::v-deep .el-dialog .el-dialog__body .el-form-item:nth-of-type(1) {
  margin-right: 8px !important;
}

.is_icon {
  color: #1485ff;
  visibility: hidden;
}

::v-deep .el-tree-node__content:hover {
  .is_icon {
    visibility: visible;
    color: #1485ff;
  }
}
</style>
