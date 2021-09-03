<template>
  <div>
    <div class="ht his-module his-small">
      <div slot="header" class="mb10">
        <span>预约时间</span>
        <el-date-picker v-model="value" size="mini" type="date" placeholder="选择日期"></el-date-picker>
        <span>值班类型</span>
        <el-select v-model="value" size="mini"></el-select>
        <span>预约科室</span>
        <el-select v-model="value" size="mini"></el-select>
        <div class="btn inline-block">
          <el-button>
            <i class="icon his-search"></i>查询
          </el-button>
          <el-button>
            <i class="icon his-account-manage"></i>医保读卡
          </el-button>
          <el-button>
            <i class="icon his-tab-close"></i>清空
          </el-button>
        </div>
      </div>
      <div class="row">
        <div class="grid-2-3">
          <span>病人卡号</span>
          <el-input v-model="value" size="mini"></el-input>
        </div>
        <div class="grid-2-3">
          <span>病人性质</span>
          <el-select v-model="value" size="mini"></el-select>
        </div>
        <div class="grid-2-3">
          <span>病人姓名</span>
          <el-input v-model="value" size="mini"></el-input>
        </div>
        <div class="grid-2-3">
          <span>病人性别</span>
          <el-select v-model="value" size="mini"></el-select>
        </div>
        <div class="grid-2-3">
          <span>年龄</span>
          <el-input v-model="value" size="mini"></el-input>
        </div>
      </div>
    </div>
    <el-row :gutter="10">
      <el-col :span="16">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <div class="w80 searchTitle">搜索码</div>
              <el-divider direction="vertical"></el-divider>
              <el-input></el-input>
            </div>
          </div>
          <el-table
            :data="mockDatas"
            border
            :fit="true"
            stripe
            :highlight-current-row="true"
            slot="list"
            :height="listSlotHeight -300"
            class="scroll-bar"
          >
            <el-table-column width="30" type="index"></el-table-column>
            <el-table-column prop="ksmc" label="科室名称"></el-table-column>
            <el-table-column prop="pydm" label="拼音代码"></el-table-column>
            <el-table-column prop="wbdm" label="五笔代码"></el-table-column>
            <el-table-column prop="szdm" label="数字代码"></el-table-column>
            <el-table-column prop="ghf" label="挂号费"></el-table-column>
            <el-table-column prop="zlf" label="诊疗费"></el-table-column>
            <el-table-column prop="zjmz" label="专家门诊"></el-table-column>
            <el-table-column prop="yyxe" label="预约限额"></el-table-column>
            <el-table-column prop="yy" label="预约"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <div class="w80 searchTitle">拼音代码</div>
              <el-divider direction="vertical"></el-divider>
              <el-input></el-input>
            </div>
          </div>
          <el-table
            :data="mockDatas"
            border
            :fit="true"
            stripe
            :highlight-current-row="true"
            slot="list"
            :height="listSlotHeight -300"
            class="scroll-bar"
          >
            <el-table-column width="30" type="index"></el-table-column>
            <el-table-column prop="ysxm" label="医生姓名"></el-table-column>
            <el-table-column prop="pydm" label="专家"></el-table-column>
            <el-table-column prop="wbdm" label="专家费"></el-table-column>
            <el-table-column prop="szdm" label="挂号限额"></el-table-column>
            <el-table-column prop="ghf" label="已挂人数"></el-table-column>
            <el-table-column prop="zlf" label="预约人数"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
@Component({
  name: 'patients'
})
export default class extends Vue {
  private value: string = ''
  private mockDatas: Array<any> = []
  private listSlotHeight: number = 0
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
}
</script>

<style lang="scss" scoped>
.inline-block {
  display: inline-block;
}
::v-deep .el-input__inner {
  border: none;
  height: 28px;
  background: rgba(245, 246, 248, 1);
  border-radius: 4px;
}
.grid-2-3 {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 30px;
  line-height: 30px;
  margin-right: 10px;
}
.mb10 {
  margin-bottom: 10px;
}
.w80 {
  width: 80px;
}
</style>