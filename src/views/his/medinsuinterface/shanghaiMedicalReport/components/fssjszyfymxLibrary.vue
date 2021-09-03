// 非实时结算上传-非实时结算住院费用明细库
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
              <i class="icon his-report"></i>产生
            </el-button>
            <el-button type="text" size="mini">
              <i class="icon his-save"></i>上传
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
          :height="listSlotHeight-159"
          class="scroll-bar"
          tooltip-effect="light"
        >
          <el-table-column type="index" width="32" align="center"></el-table-column>
          <el-table-column width="100" label="就医凭证号"></el-table-column>
          <el-table-column label="住院号"></el-table-column>
          <el-table-column label="身份证号"></el-table-column>
          <el-table-column label="科室编码"></el-table-column>
          <el-table-column label="科室名称"></el-table-column>
          <el-table-column label="医生工号"></el-table-column>
          <el-table-column label="医生姓名"></el-table-column>
          <el-table-column label="费用类别"></el-table-column>
          <el-table-column width="110" label="明细项目编码"></el-table-column>
          <el-table-column width="110" label="明细项目名称"></el-table-column>
          <el-table-column width="110" label="明细项目单位"></el-table-column>
          <el-table-column width="110" label="明细项目单价"></el-table-column>
          <el-table-column width="150" label="药品通用名/性材料品牌"></el-table-column>
          <el-table-column label="注册证号"></el-table-column>
          <el-table-column width="120" label="明细项目规格"></el-table-column>
          <el-table-column width="120" label="明细项目数量"></el-table-column>
          <el-table-column width="120" label="明细项目金额"></el-table-column>
          <el-table-column width="155" label="明细项目交易费用金额"></el-table-column>
          <el-table-column width="175" label="明细项目医保结算范围金额"></el-table-column>
          <el-table-column label="可报标志"></el-table-column>
          <el-table-column label="人员类型"></el-table-column>
          <el-table-column width="100" label="项目使用日期"></el-table-column>
          <el-table-column width="100" label="收费退费标志"></el-table-column>
        </el-table>
      </pagenation-list>
      <div
        class="row his-yb-row"
        style="padding-top: 8px;border-bottom: none;padding-bottom: 0;margin-bottom: 0"
      >
        <div class="label">
          <el-checkbox v-model="checked">完成后提示完成信息|你上传数据后目录为:（c:\上传数据\）</el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
@Component({
  name: 'fssjszyfymxLibrary',
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

.his-yb-row {
    position: absolute;
    bottom: 6px;
}
</style>