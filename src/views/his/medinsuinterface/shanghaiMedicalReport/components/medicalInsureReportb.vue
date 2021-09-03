// 小城镇大病-医保上报表
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
              <i class="icon his-caozuo-update-information"></i>检索
            </el-button>
            <el-button type="text" size="mini">
              <i class="icon his-caozuo-update-information"></i>分拆
            </el-button>
            <el-button type="text" size="mini">
              <i class="icon his-caozuo-update-information"></i>上报
            </el-button>
            <el-button type="text" size="mini">
              <i class="icon his-caozuo-update-information"></i>校对
            </el-button>
            <el-button type="text" size="mini">
              <i class="icon his-btn-close red"></i>退出
            </el-button>
          </div>
        </div>
      </div>
      <el-table
        stripe
        :data="tableData"
        border
        highlight-current-row
        :height="listSlotHeight-129"
        class="scroll-bar"
        tooltip-effect="light"
      >
        <el-table-column type="index" width="32" align="center"></el-table-column>
        <el-table-column width="70" label="姓名"></el-table-column>
        <el-table-column width="120" label="保险编码(身份证)"></el-table-column>
        <el-table-column label="凭证号码"></el-table-column>
        <el-table-column width="100" label="就诊科别编码"></el-table-column>
        <el-table-column width="100" label="就诊科别名称"></el-table-column>
        <el-table-column label="就诊日期"></el-table-column>
        <el-table-column label="就诊次数"></el-table-column>
        <el-table-column label="大病项目"></el-table-column>
        <el-table-column label="在退标识"></el-table-column>
        <el-table-column width="100" label="交易费用总额"></el-table-column>
        <el-table-column width="135" label="自负(个人现金支付)"></el-table-column>
        <el-table-column width="100" label="统筹基金支付"></el-table-column>
        <el-table-column width="150" label="医保结算范围费用总额"></el-table-column>
        <el-table-column label="诊疗费"></el-table-column>
        <el-table-column label="治疗费"></el-table-column>
        <el-table-column width="85" label="手术材料费"></el-table-column>
        <el-table-column label="检查费"></el-table-column>
        <el-table-column label="化验费"></el-table-column>
        <el-table-column label="摄片费"></el-table-column>
        <el-table-column label="透视费"></el-table-column>
        <el-table-column label="西药费"></el-table-column>
        <el-table-column label="中成药费"></el-table-column>
        <el-table-column label="中草药费"></el-table-column>
        <el-table-column label="其他"></el-table-column>
        <el-table-column label="自负合计"></el-table-column>
        <el-table-column width="85" label="自负诊疗费"></el-table-column>
        <el-table-column width="85" label="自负治疗费"></el-table-column>
        <el-table-column width="110" label="自负手术材料费"></el-table-column>
        <el-table-column width="85" label="自负检查费"></el-table-column>
        <el-table-column width="85" label="自负化验费"></el-table-column>
        <el-table-column width="85" label="自负摄片费"></el-table-column>
        <el-table-column width="85" label="自负透视费"></el-table-column>
        <el-table-column width="85" label="自负西药费"></el-table-column>
        <el-table-column width="100" label="自负中成药费"></el-table-column>
        <el-table-column width="100" label="自负中草药费"></el-table-column>
        <el-table-column label="自负其他"></el-table-column>
        <el-table-column width="160" label="非医保结算范围个人自费"></el-table-column>
        <el-table-column label="诊断编码"></el-table-column>
        <el-table-column label="诊断说明"></el-table-column>
        <el-table-column label="保健情况"></el-table-column>
        <el-table-column label="上报年月"></el-table-column>
        <el-table-column width="90" label="医院法人码"></el-table-column>
        <el-table-column label="流水号"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
@Component({
  name: 'medicalInsureReports',
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