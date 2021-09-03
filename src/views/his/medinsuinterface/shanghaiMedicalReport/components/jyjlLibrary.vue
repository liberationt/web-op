// 交易记录库
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
            <el-button type="text" size="mini">
              <i class="icon his-caozuo_huizong"></i>汇总产生
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
        <el-table-column label="机构代码"></el-table-column>
        <el-table-column label="卡号"></el-table-column>
        <el-table-column label="账户标志"></el-table-column>
        <el-table-column label="病人类型"></el-table-column>
        <el-table-column label="就诊次数"></el-table-column>
        <el-table-column label="交易时间"></el-table-column>
        <el-table-column label="结算类型"></el-table-column>
        <el-table-column width="85" label="交易总费用"></el-table-column>
        <el-table-column width="100" label="当年账户支付"></el-table-column>
        <el-table-column width="100" label="历年账户支付"></el-table-column>
        <el-table-column width="100" label="自负段现金"></el-table-column>
        <el-table-column width="100" label="起付段现金"></el-table-column>
        <el-table-column width="100" label="起付段账户"></el-table-column>
        <el-table-column width="100" label="统筹段现金"></el-table-column>
        <el-table-column width="110" label="统筹段账户支付"></el-table-column>
        <el-table-column label="统筹支付"></el-table-column>
        <el-table-column width="85" label="附加段现金"></el-table-column>
        <el-table-column width="85" label="附加段账户"></el-table-column>
        <el-table-column label="附加支付"></el-table-column>
        <el-table-column width="120" label="医保范围内总额"></el-table-column>
        <el-table-column width="120" label="非医保范围自费"></el-table-column>
        <el-table-column label="医保类型"></el-table-column>
        <el-table-column label="发票号码"></el-table-column>
        <el-table-column label="退费标志"></el-table-column>
        <el-table-column label="开始日期"></el-table-column>
        <el-table-column label="减负标志"></el-table-column>
        <el-table-column label="减负金额"></el-table-column>
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
  name: 'jyjlLibrary',
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