<!--
 * @Date: 2020-05-26 14:33:55
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-05 18:20:27
 * @description: 诊间结费记录
-->

<template>
  <div class="module">
    <div class="his-module layout-top his-small">
      <pagenation-list
        ref="pageTable"
        v-model="tableDatas"
        data-url="/op-service/pubcyzd/xyPage"
        http-method="post"
        :searchData="searchData"
        :list-height="listSlotHeight"
      >
        <el-table
          :data="tableDatas"
          border
          stripe
          :highlight-current-row="true"
          slot="list"
          @row-dblclick="handleLeftDblclick"
          class="scroll-bar"
          :height="listSlotHeight"
        >
          <!-- 序号 -->
          <el-table-column prop="webSortNumber" width="32"></el-table-column>
          <!-- 操作类型 -->
          <el-table-column prop="jzkh" :label="'操作类型'" width="120" />
          <el-table-column prop="jzkh" :label="'操作金额'" width="120" />
          <el-table-column prop="jzkh" :label="'充值/退费方式'" width="120" />
          <el-table-column prop="jzkh" :label="'操作时间'" min-width="120" />
          <el-table-column prop="jzkh" :label="'操作IP'" min-width="120" />
          <el-table-column prop="jzkh" :label="'操作工号'" min-width="120" />
        </el-table>
      </pagenation-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'FeeRecord',
  filters: {},
})
export default class extends Vue {
  private tableDatas: any[] = []
  private listSlotHeight: number = 0
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 180
  }
  mounted() {}

}
</script>

<style lang="scss" scoped></style>
