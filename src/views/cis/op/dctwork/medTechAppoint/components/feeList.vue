<!--
 * @Date: 2020-05-31 11:13:19
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-14 15:09:47
 * @description: 患者预约医技的f费用列表
-->
<template>
  <div class="module his-project">
    <el-table
      :data="detailInfo"
      tooltip-effect="light"
      stripe
      fit
      border
      @row-click="handleRowClick"
      class="no-underline"
      :height="listSlotHeight/2 - 830"
    >
      <!-- 序号 -->
      <el-table-column type="index" width="32"></el-table-column>
      <!-- 费用名称 -->
      <el-table-column prop="fymc" :show-overflow-tooltip="true" :label="'费用名称'" min-width="80" />
      <!-- 单位 -->
      <el-table-column prop="fydw" :label="'单位'" min-width="30" />
      <!-- 金额 -->
      <el-table-column prop="fyje" :label="'金额'" class-name="text-blue-td" min-width="30" />
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'PatinetList',
  components: {},
})
export default class extends Vue {
  @Prop({ required: true, default: () => [] }) private detailInfo!: any[]
  private tableDatas: any[] = []
  private listSlotHeight: number = 0

  created() { 
    this.listSlotHeight = Vue.prototype.PageHeight
  }

  private handleRowClick() { }
}
</script>

<style lang="scss" scoped>
.his-project {
  height: 100%;
}
</style>
