//  收费项目维护
<template>
  <el-dialog
    :visible.sync="isVisible"
    title="药品项目-明细"
    width="820px"
    :append-to-body="true"
    class="narrow-dialog"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <div class="content his-sys-content">
      <div class="his-module his-small" style="padding: 8px 10px">
        <div class="row" style="padding: 8px 0">
          <div class="label">
            <div style="font-size: 13px; margin-right: 8px;">搜索</div>
            <el-input
              v-model="searchData.pydm"
              placeholder="请输入拼音码"
              @keyup.native.enter="getList"
              clearable
              @clear="getList"
            >
              <i slot="prefix" class="el-input__icon icon his-search"></i>
            </el-input>
            <el-checkbox
              v-model="searchData.zfpb"
              style="margin-left: 8px"
              true-label="0"
              false-label
              @change="searchList"
            >是否有效</el-checkbox>
            <div class="btn">
              <el-button type="text" size="mini" @click="handleAdd">
                <i class="icon his-btn-add green"></i>新增
              </el-button>
              <el-button type="text" size="mini" @click="handleEdit">
                <i class="icon his-btn-edit"></i>修改
              </el-button>
              <el-button type="text" size="mini">
                <i class="icon his-btn-print"></i>打印
              </el-button>
              <el-button type="text" size="mini" @click="handleClose">
                <i class="icon his-btn-close-copy red"></i>关闭
              </el-button>
            </div>
          </div>
        </div>
        <pagenation-list
          ref="pageTable"
          data-url="/op-service/dicsfxmlb/queryFeeYlsfxmDetail"
          http-method="post"
          v-model="tableData"
          :searchData="searchData"
          :list-height="listSlotHeight"
        >
          <el-table
            slot="list"
            stripe
            :data="tableData"
            border
            :height="listSlotHeight/2"
            highlight-current-row
            class="scroll-bar"
            tooltip-effect="light"
            @row-click="getRowData"
            @row-dblclick="handleEdit"
          >
            <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
            <el-table-column label="状态" width="60">
              <template slot-scope="scope">
                <span
                  :class="[scope.row.zfpb == 1 ? 'reds' : 'blues']"
                >{{scope.row.zfpb == 1 ? '已作废' : '未作废'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="医保编码" prop="ybbm" width="140" show-overflow-tooltip></el-table-column>
            <el-table-column label="费用名称" prop="fymc" width="140" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="fydw" width="60px" show-overflow-tooltip></el-table-column>
            <el-table-column label="拼音码" prop="pydm" width="90" show-overflow-tooltip></el-table-column>
            <el-table-column label="门诊使用" prop="mzsy" width="70px">
              <template slot-scope="scope">
                <span
                  :class="[scope.row.mzsy == '1' ? 'blues' : 'reds']"
                >{{scope.row.mzsy == '1' ? '是' : '否'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="住院使用" prop="zysy" width="70px">
              <template slot-scope="scope">
                <span
                  :class="[scope.row.zysy == '1' ? 'blues' : 'reds']"
                >{{scope.row.zysy == '1' ? '是' : '否'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="费用归并" prop="fygb" width="70px">
              <template slot-scope="scope">
                <div>
                  {{$store.state.webSqlDict.COST_CONSOLIDATION.find(item => item.dv == scope.row.fygb) &&
                  $store.state.webSqlDict.COST_CONSOLIDATION.find(item => item.dv == scope.row.fygb).dn}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="材料对应" prop="cldym" width="100px"></el-table-column>
            <el-table-column label="是否作废" prop="zfpb" width="70px">
              <template slot-scope="scope">
                <span
                  :class="[scope.row.zysy == '1' ? 'blues' : 'reds']"
                >{{scope.row.zysy == '1' ? '是' : '否'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="标准价格" prop="bzjg" width="70" show-overflow-tooltip></el-table-column>
            <el-table-column label="病案首页归并" prop="basygb" width="95px"></el-table-column>
            <el-table-column label="所属医技类型" prop="yjlx" width="100px"></el-table-column>
            <el-table-column label="明细标志" prop="mxbz" width="70px"></el-table-column>
            <el-table-column label="材料标志" prop="clbz" width="70px"></el-table-column>
            <el-table-column
              label="操作"
              width="52"
              class-name="action-btns"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <!-- 作废/取消作废 -->
                <el-tooltip :content="scope.row.zfpb == '0'?'作废':'取消作废'" effect="light">
                  <el-popconfirm
                    class="ml10"
                    hideIcon
                    :confirmButtonText="
                    scope.row.zfpb == '0' ? '作废':'取消作废'"
                    :cancelButtonText="$t('common.cancel')"
                    :title="
                    scope.row.zfpb == '0'
                      ? '确认作废?'
                      : '确认取消作废?'
                  "
                    @confirm="handleCancel(scope.row)"
                  >
                    <el-button slot="reference" :class="[scope.row.zfpb == '0' ? 'red' : 'green']">
                      <i
                        class="icon"
                        :class="[
                        scope.row.zfpb == '0'
                          ? 'his-youcaozuo_zuofei'
                          : 'his-youcaozuo_huifu',
                      ]"
                      ></i>
                    </el-button>
                  </el-popconfirm>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </pagenation-list>
        <addDetail
          ref="addDetail"
          v-bind:FYXH="FYXH"
          v-bind:editFormData="editFormData"
          v-bind:addFlag="addFlag"
          v-bind="$attrs"
          @saveSuc="saveSuc"
        ></addDetail>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { log } from 'util'
import { cancelDetail } from '@/api/his/sys/centerMaintenance/medicareInfoManage/payService.ts'
import { rightScroll, id2Name } from '@/utils/index.ts'
import addDetail from './addDetail.vue'

// 命名文件名称，过滤器什么的都在这里写
@Component({
  name: 'detailDialog',
  components: {
    addDetail
  }
})
export default class extends Vue {
  @Prop({ required: false, default: null }) private addFormData!: any
  private isVisible: boolean = false // 明细弹框默认隐藏
  private isCancel: boolean = false
  private listSlotHeight: number = 0
  private value: any = ''
  private tableData: Array<any> = []
  private editFormData: any = {} // 修改时的表单数据
  private searchData: any = {
    fygb: '',
    pydm: '',
    zfpb: ''
  }
  private addFlag: boolean = true // true为新增false为修改
  private FYXH: number = 0 // 子组件所需要的参数
  private handleDelete() {}

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {}

  @Watch('tableData')
  private onValueChange(value: string) {
    rightScroll()
  }

  private handleAdd() {
    ;(this.$refs.addDetail as any).showAddDialog()
  }

  private handleEdit() {
    if (!this.addFlag) {
      ;(this.$refs.addDetail as any).showEditDialog()
    }
  }

  // 渲染表格数据
  private getList() {
    this.searchData.fygb = this.addFormData.fylb
    console.log(this.searchData)
    this.$nextTick(() => {
      const pageTable: any = this.$refs.pageTable
      pageTable.searchList()
    })
  }

  // 条件查询
  private searchList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

  // 获取表格单行数据
  private getRowData(row: any) {
    this.FYXH = row.fyxh
    this.addFlag = false
    console.log(row)
    this.editFormData = row
  }

  // 注销药品项目
  private handleCancel(row: any) {
    const params: any = {
      fyxh: row.fyxh,
      zfpb: row.zfpb == 1 ? 0 : 1
    }
    cancelDetail(params).then((res: any) => {
      console.log(res)
      this.getList()
    })
  }

  // 子组件返回切换修改状态
  private closeDialog() {
    this.addFlag = true
    console.log(this.addFlag)
  }

  // 子组件保存成功后刷新页面
  private saveSuc() {
    this.getList()
  }

  // 显示该弹框并获取数据列表
  private showDialog() {
    this.$nextTick(() => {
      this.getList()
    })
    this.isVisible = true
  }

  // 关闭弹窗
  private handleClose() {
    this.isVisible = false
  }
}
</script>
<style lang="scss" scoped>
.content {
  background: #fff;
  height: auto;
  border-radius: 8px;
}

.his-module.his-small {
  padding: 0 0 8px !important;
}
.row .label .el-input {
  width: 190px;
}

.el-dialog__wrapper.narrow-dialog .el-dialog__body .row {
  padding-bottom: 0;
}
// 右侧状态框悬浮
::v-deep .el-table__fixed-right {
  height: 100% !important;
}
</style>
