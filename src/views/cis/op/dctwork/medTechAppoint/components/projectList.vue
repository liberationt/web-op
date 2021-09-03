<!--
 * @Date: 2020-05-31 11:13:19
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-14 15:13:14
 * @description: 患者预约医技的项目列表
-->
<template>
  <div class="module">
    <el-table :data="tableDatas" :height="listSlotHeight" class="no-underline" stripe fit border @row-click="handleRowClick">
      <!-- 序号 -->
      <el-table-column prop="webSortNumber" width="32"></el-table-column>
      <!-- 申请日期 -->
      <el-table-column prop="cflb" :label="'申请日期'" min-width="80" />
      <!-- 病区 -->
      <el-table-column prop="cflb" :label="'病区'" min-width="80" />
      <!-- 姓名 -->
      <el-table-column prop="cflb" :label="'姓名'" min-width="80" />
      <!-- 检查项目 -->
      <el-table-column prop="cflb" :label="'检查项目'" min-width="80" />
      <!-- 检查费用 -->
      <el-table-column prop="cflb" :label="'检查费用'" min-width="80" />
     
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
  private tableDatas: any[] = []
  private listSlotHeight:number = 0

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 464
  }

  private handleRowClick() {}
}
</script>

<style lang="scss" scoped></style>
