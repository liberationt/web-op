<!--
 * @Date: 2020-05-31 11:13:19
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-14 14:54:16
 * @description: 预约医技的病人列表
-->
<template>
  <div class="module his-project">
    <el-table
      :data="list"
      stripe
      fit
      border
      :highlight-current-row="true"
      @row-click="handleRowClick"
      class="scroll-bar no-underline"
      :height="listSlotHeight/2 - 330"
    >
      <!-- 序号 -->
      <el-table-column type="index" align="center" width="32"></el-table-column>
      <!-- 病人类别 -->
      <el-table-column prop="sqlx" :label="'病人类别'" min-width="80"></el-table-column>
      <!-- 号码 -->
      <el-table-column prop="hm" :label="'号码'" min-width="80"></el-table-column>
      <!-- 科室 -->
      <el-table-column prop="ksmc" :label="'科室'" min-width="80"></el-table-column>
      <!-- 床号 -->
      <el-table-column prop="brch" :label="'床号'" min-width="80"></el-table-column>
      <!-- 姓名 -->
      <el-table-column prop="brxm" :label="'姓名'" min-width="80"></el-table-column>
      <!-- 性别 -->
      <el-table-column prop="brxb" :label="'性别'" min-width="80">
        <template slot-scope="scope">
          <div>{{scope.row.brxb | brxbStatus}}</div>
        </template>
      </el-table-column>
      <!-- 检查状态 -->
      <el-table-column prop="jczt" :label="'检查状态'" min-width="80">
        <template slot-scope="scope">
          <div>{{scope.row.jczt | jczt2zh}}</div>
        </template>
      </el-table-column>
      <!-- 预约日期 -->
      <el-table-column prop="yyrq" :label="'预约日期'" min-width="100">
      </el-table-column>
      <!-- 预约时间 -->
      <el-table-column prop="yysj" :label="'预约时间'" min-width="80"></el-table-column>
      <!-- 检查部位 -->
      <el-table-column prop="jcbw" :label="'检查部位'" show-overflow-tooltip min-width="80"></el-table-column>
      <!-- 检查项目 -->
      <el-table-column prop="jcxm" :label="'检查项目'" :show-overflow-tooltip="true" min-width="80"></el-table-column>
      <!-- 设备名称 -->
      <el-table-column prop="sbmc" :label="'设备名称'" min-width="80"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'PatinetList',
  components: {},
  filters: {
    jczt2zh(val: number) {
      switch (val) {
        case 1:
          return '完成'
        case 2:
          return '预约'
        case 9:
          return '退回'
      }
    },
    brxbStatus(val: number) {
      switch (val) {
        case 0:
          return '未知的性别'
        case 1:
          return '男'
        case 2:
          return '女'
        case 9:
          return '未说明的性别'
      }
    }
  }
})
export default class extends Vue {
  @Prop({ required: true }) private list!: any[]
  private tableDatas: any[] = []
  private listSlotHeight: number = 0
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 500
  }
  private handleRowClick(row: any) {
    if (row.jczt == 2) {
      this.$emit('getJCXH', row.jcxh)
    } else {
      this.$emit('getJCXH', '')
    }

  }

}
</script>

<style lang="scss" scoped>
.his-project {
  height: 100%;
  .el-table {
    @extend .his-project
  }
}
</style>
