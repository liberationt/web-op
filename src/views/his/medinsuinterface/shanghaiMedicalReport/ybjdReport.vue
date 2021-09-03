// 医保监督报表
<template>
  <div class="content">
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
              <i class="icon his-report"></i>检索
            </el-button>
            <el-button type="text" size="mini">
              <i class="icon his-save"></i>上报
            </el-button>
          </div>
        </div>
      </div>
      <pagenation-list
        ref="pageTable"
        data-url
        v-model="tableData"
        list-height="listSlotHeight"
        :searchData="searchData"
        http-method="post"
      >
        <el-table
          slot="list"
          stripe
          :data="tableData"
          border
          highlight-current-row
          :height="listSlotHeight-108"
          class="scroll-bar"
          tooltip-effect="light"
        >
          <el-table-column type="index" width="32" align="center"></el-table-column>
          <el-table-column label="流水号"></el-table-column>
          <el-table-column label="患者姓名"></el-table-column>
          <el-table-column label="卡号"></el-table-column>
          <el-table-column label="科室代码"></el-table-column>
          <el-table-column label="科室名称"></el-table-column>
          <el-table-column label="医生代码"></el-table-column>
          <el-table-column label="医生名称"></el-table-column>
          <el-table-column label="费用类别"></el-table-column>
          <el-table-column label="明细代码"></el-table-column>
          <el-table-column label="明细名称"></el-table-column>
          <el-table-column label="明细单位"></el-table-column>
          <el-table-column label="明细单价"></el-table-column>
          <el-table-column label="明细数量"></el-table-column>
          <el-table-column width="100" label="明细项目规格"></el-table-column>
          <el-table-column label="明细金额"></el-table-column>
          <el-table-column width="100" label="结算范围金额"></el-table-column>
          <el-table-column label="交易金额"></el-table-column>
          <el-table-column label="报销标志"></el-table-column>
          <el-table-column label="交易日期"></el-table-column>
          <el-table-column label="作废判别"></el-table-column>
          <el-table-column label="医院名称"></el-table-column>
          <el-table-column label="结算类型"></el-table-column>
          <el-table-column label="机构代码"></el-table-column>
          <el-table-column width="90" label="挂号流水号"></el-table-column>
          <el-table-column label="处方号"></el-table-column>
          <el-table-column label="账户标志"></el-table-column>
          <el-table-column label="身份证号"></el-table-column>
          <el-table-column label="诊断编码1"></el-table-column>
          <el-table-column label="诊断编码2"></el-table-column>
          <el-table-column label="诊断编码3"></el-table-column>
          <el-table-column width="100" label="原收费流水号"></el-table-column>
        </el-table>
      </pagenation-list>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
@Component({
  name: 'ybjdReport',
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