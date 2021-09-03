<template>
  <el-dialog
    :visible.sync="isVisible"
    title="调入页面"
    width="50%"
    :append-to-body="true"
    class="narrow-dialog"
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
            <el-divider class="ml4" direction="vertical"></el-divider>
            <div class="btn">
              <el-button type="text" size="mini" @click="handleTransfer">
                <i class="icon his-caozuo-fold"></i>调入
              </el-button>
              <el-button type="text" size="mini" @click="handleClose">
                <i class="icon his-btn-close-copy red"></i>关闭
              </el-button>
            </div>
          </div>
        </div>
        <pagenation-list
          ref="pageTable"
          data-url="/op-service/institutionalFeeItems/queryInstitutionalDetails"
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
            class="scroll-bar"
            @selection-change="handleSelectionChange"
            tooltip-effect="light"
          >
            <el-table-column width="32" prop="webSortNumber" align="center"></el-table-column>
            <el-table-column type="selection" width="32" align="center"></el-table-column>
            <el-table-column label="费用名称" prop="fymc" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="fydw" width="60px" show-overflow-tooltip></el-table-column>
            <el-table-column label="拼音码" prop="pydm" width="90" show-overflow-tooltip></el-table-column>
          </el-table>
        </pagenation-list>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { log } from 'util'
import { transfer } from '@/api/his/sys/centerMaintenance/medicareInfoManage/InstitutionalProjectsFees.ts'
import { rightScroll, id2Name } from '@/utils/index.ts'
// 命名文件名称，过滤器什么的都在这里写
@Component({
  name: 'medicalDialog',
  components: {}
})
export default class extends Vue {
  @Prop({ required: false, default: 0 }) private fygb!: number
  private isVisible: boolean = false // 明细弹框默认隐藏
  private isCancel: boolean = false
  private listSlotHeight: number = 0
  private value: any = ''
  private tableData: Array<any> = []
  private fyxhList: Array<any> = []
  private searchData: any = {
    fygb: null,
    pydm: ''
  }

  // 列表查询
  private getList() {
    this.searchData.fygb = this.fygb
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

  // 勾选的费用名称集合
  private handleSelectionChange(val: any) {
    val.forEach((item: any) => {
      this.fyxhList.push(item.fyxh)
    })
  }

  // 调入功能
  private handleTransfer() {
    if (this.fyxhList.length !== 0) {
      transfer({ fyxhList: this.fyxhList }).then((res: any) => {
        if (res.errorCode === 'SUCCESS') {
          this.$notify({
            title: '费用调入成功！',
            message: '',
            type: 'success'
          })
          this.getList()
        }
      })
    } else {
      this.$message({
        message: '请先勾选费用名称！',
        type: 'warning'
      })
    }
  }

  // 关闭按钮
  private handleClose() {
    this.isVisible = false
  }

  private handleDelete() {}

  // 自身组件调入弹框
  private open() {
    this.isVisible = true
    this.$nextTick(() => {
      this.getList()
    })
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  @Watch('tableData')
  private onValueChange(value: string) {
    rightScroll()
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
