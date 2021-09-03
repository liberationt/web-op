// 流动人口上报月报
<template>
  <div class="content">
    <el-tabs class="tab-small" v-model="activeName" @tab-click="chooseName">
      <el-tab-pane label="门诊月报" name="outpatientMonthlyReport">
        <outpatientMonthlyReport></outpatientMonthlyReport>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import outpatientMonthlyReport from './components/outpatientMonthlyReport.vue'
@Component({
  name: 'ldrksbyReport',
  filters: {},
  components: {
    outpatientMonthlyReport
  }
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private activeName: string = 'outpatientMonthlyReport'

  private chooseName(tab: any, event: any) {}
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {}
}
</script>
<style scoped lang="scss">
::v-deep .el-tabs__nav-scroll {
  background: $white;
  border-radius: 8px;
  padding: 8px 10px;
}
</style>