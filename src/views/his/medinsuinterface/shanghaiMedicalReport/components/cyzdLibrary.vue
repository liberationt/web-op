// 出院诊断库
<template>
  <div>
    <div class="his-module his-small">
      <div class="row">
        <div class="label">
          <el-date-picker
            type="dates"
            style="margin-right: 8px"
            placeholder="请选择日期"
            v-model="timeDate"
            value-format="yyyyMMdd"
            clearable
          ></el-date-picker>
          <el-select v-model="value" placeholder="请选择">
            <el-option label="医保线路" value="1"></el-option>
          </el-select>
          <el-divider direction="vertical"></el-divider>
          <div class="btn">
            <el-button type="text" size="mini">
              <i class="icon his-caozuo_canshenshuju"></i>产生
            </el-button>
            <el-button type="text" size="mini">
              <i class="icon his-save"></i>上传
            </el-button>
          </div>
        </div>
      </div>
      <el-table
        stripe
        :data="tableData"
        border
        highlight-current-row
        show-summary
        :height="listSlotHeight-161"
        class="scroll-bar"
        tooltip-effect="light"
      >
        <el-table-column type="index" width="32" align="center"></el-table-column>
        <el-table-column label="流水号"></el-table-column>
        <el-table-column label="卡号"></el-table-column>
        <el-table-column label="住院号"></el-table-column>
        <el-table-column label="结束日期"></el-table-column>
        <el-table-column label="出院诊断说明"></el-table-column>
        <el-table-column label="住院标志"></el-table-column>
        <el-table-column label="治疗结果"></el-table-column>
        <el-table-column label="主要手术操作代码"></el-table-column>
        <el-table-column label="交易时间"></el-table-column>
      </el-table>
      <div class="row" style="padding-top: 8px;border-bottom: none;padding-bottom: 0;margin-bottom: 0">
        <div class="label">
          <div class="tag">流水号</div>
          <el-input v-model="value"></el-input>
          <el-divider direction="vertical"></el-divider>
          <div class="tag">过滤</div>
        </div>
        <el-checkbox v-model="checked">完成后提示完成信息|你上传数据后目录为:（c:\上传数据\）</el-checkbox>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
@Component({
  name: 'cyzdLibrary',
  filters: {},
  components: {}
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private timeDate: string = ''
  private value: string = ''
  private checked: boolean = false
  private tableData: Array<any> = [{}, {}, {}]

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {}
}
</script>
<style scoped lang="scss">
::v-deep.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 190px;
}

.his-small .row .label .tag {
  padding-left: 0;
  color: #6a6d78;
  font-size: 13px;
}
::v-deep .el-checkbox__label{
    font-size: 13px!important;
}
</style>