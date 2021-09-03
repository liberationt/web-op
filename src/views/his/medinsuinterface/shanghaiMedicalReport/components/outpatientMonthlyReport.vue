// 流动人口上报月报-门诊月报
<template>
  <div>
    <div class="his-module his-small">
      <div class="row">
        <div class="label">
          <div class="tag">上报月份</div>
          <el-date-picker
            type="month"
            style="margin-right: 8px; width: 148px"
            placeholder="请选择日期"
            v-model="timeDate"
            value-format="yyyy-MM"
            clearable
          ></el-date-picker>
          <div class="tag">起止时间</div>
          <el-date-picker
            type="daterange"
            v-model="currentDate"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            class="date-wrapper"
            style="width: 220px"
          ></el-date-picker>
          <el-select v-model="value" placeholder="请选择" style="margin-left: 8px">
            <el-option label="医保线路" value="1"></el-option>
          </el-select>
          <el-divider direction="vertical"></el-divider>
          <div class="btn">
            <el-button type="text" size="mini">
              <i class="icon his-report"></i>统计
            </el-button>
            <el-button type="text" size="mini">
              <i class="icon his-btn-print"></i>打印
            </el-button>
            <el-button type="text" size="mini">
              <i class="icon his-btn-close red"></i>退出
            </el-button>
          </div>
        </div>
      </div>
      <el-table
        show-summary
        stripe
        :data="tableData"
        border
        highlight-current-row
        :height="listSlotHeight-127"
        class="scroll-bar"
        tooltip-effect="light"
      >
        <el-table-column type="index" width="32" align="center"></el-table-column>
        <el-table-column width="70" label="姓名"></el-table-column>
        <el-table-column label="卡号"></el-table-column>
        <el-table-column label="暂住证号"></el-table-column>
        <el-table-column label="就诊日期"></el-table-column>
        <el-table-column label="就诊次数"></el-table-column>
        <el-table-column label="在退标识"></el-table-column>
        <el-table-column label="总费用"></el-table-column>
        <el-table-column width="100" label="总折扣费用"></el-table-column>
        <el-table-column width="100" label="总个人支付"></el-table-column>
        <el-table-column width="100" label="诊疗费折扣"></el-table-column>
        <el-table-column width="100" label="治疗费折扣"></el-table-column>
        <el-table-column width="100" label="手材费折扣"></el-table-column>
        <el-table-column width="100" label="检查费折扣"></el-table-column>
        <el-table-column width="100" label="化验费折扣"></el-table-column>
        <el-table-column width="100" label="摄片费折扣"></el-table-column>
        <el-table-column width="100" label="透视费折扣"></el-table-column>
        <el-table-column width="100" label="西药费折扣"></el-table-column>
        <el-table-column width="120" label="中成药费折扣"></el-table-column>
        <el-table-column width="120" label="中草药费折扣"></el-table-column>
        <el-table-column label="其他折扣"></el-table-column>
        <el-table-column width="100" label="诊疗费个人"></el-table-column>
        <el-table-column width="110" label="治疗费个人"></el-table-column>
        <el-table-column width="110" label="手材费个人"></el-table-column>
        <el-table-column width="110" label="检查费个人"></el-table-column>
        <el-table-column width="110" label="化验费个人"></el-table-column>
        <el-table-column width="110" label="摄片费个人"></el-table-column>
        <el-table-column width="110" label="透视费个人"></el-table-column>
        <el-table-column width="110" label="西药费个人"></el-table-column>
        <el-table-column width="110" label="中成药费个人"></el-table-column>
        <el-table-column width="110" label="中草药费个人"></el-table-column>
        <el-table-column label="其他个人"></el-table-column>
        <el-table-column label="上报年月"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
@Component({
  name: 'outpatientMonthlyReport',
  filters: {},
  components: {}
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private timeDate: string = ''
  private value: string = ''
  private checked: boolean = false
  private currentDate: string = ''
  private searchData: any = {}
  private tableData: Array<any> = [{}, {}, {}]

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {}
}
</script>
<style scoped lang="scss">
.his-small .row .label .el-input::v-deep .el-input__inner {
  width: 150px;
}

.his-small .row .label .tag {
  padding-left: 0;
  color: #6a6d78;
  font-size: 13px;
}
::v-deep .el-checkbox__label {
  font-size: 13px !important;
}
</style>