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
            <el-input v-model="value" placeholder="请输入拼音码" @keyup.native.enter="getList">
              <i slot="prefix" class="el-input__icon icon his-search"></i>
            </el-input>
            <el-divider class="ml4" direction="vertical"></el-divider>
            <div class="btn">
              <el-button type="text" size="mini" @click="handleAdd">
                <i class="icon his-caozuo-fold"></i>调入
              </el-button>
              <el-button type="text" size="mini">
                <i class="icon his-btn-close-copy red"></i>关闭
              </el-button>
            </div>
          </div>
        </div>
        <pagenation-list
          ref="pageTable"
          data-url
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
            tooltip-effect="light"
          >
            <el-table-column type="selection" width="32" align="center"></el-table-column>
            <el-table-column width="32"></el-table-column>
            <el-table-column label="费用名称" prop="fymc" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="dw" width="60px" show-overflow-tooltip></el-table-column>
            <el-table-column label="拼音码" prop="pym" width="90" show-overflow-tooltip></el-table-column>
          </el-table>
        </pagenation-list>
        <addDetail ref="addDetail"></addDetail>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { log } from 'util'
import { rightScroll, id2Name } from '@/utils/index.ts'
// 命名文件名称，过滤器什么的都在这里写
@Component({
  name: 'drugTransferIn',
  components: {},
})
export default class extends Vue {
  private isVisible: boolean = false // 明细弹框默认隐藏
  private isCancel: boolean = false
  private listSlotHeight: number = 0
  private value: any = ''
  private tableData: Array<any> = [
    {
      fymc: '测试',
      dw: '笔',
      pym: 'CS01',
      
    },
    {
      fymc: '测试',
      dw: '笔',
      pym: 'CS01',
     
    },
    {
      fymc: '测试',
      dw: '笔',
      pym: 'CS01',
     
    },
  ]
  private searchData: any = {}
  private getList() {}
  private handleDelete() {}
  private open() {
    this.isVisible = true
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