// 城镇特殊4#、5#
<template>
  <div class="content">
    <el-tabs class="tab-small" v-model="activeName" @tab-click="chooseName">
      <el-tab-pane label="门诊上报表" name="outpatientReport">
          <outpatientReport></outpatientReport>
      </el-tab-pane>
      <el-tab-pane label="门诊A表" name="stateAccountA"></el-tab-pane>
      <el-tab-pane label="门诊B表" name="stateAccountB"></el-tab-pane>
      <el-tab-pane label="基本支付凭证" name="basicPayVoucher"></el-tab-pane>
      <!-- <el-tab-pane label="住院上报表" name="hospitalizationReport">
        <hospitalizationReport></hospitalizationReport>
      </el-tab-pane>
      <el-tab-pane label="住院A表" name="hospitalAccountA"></el-tab-pane>
      <el-tab-pane label="住院B表" name="hospitalAccountB"></el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import outpatientReport from './components/outpatientReport.vue'
// import hospitalizationReport from './components/hospitalizationReport.vue'

@Component({
  name: 'townSpecial',
  filters: {},
  components: {
    outpatientReport,
    // hospitalizationReport
  }
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private activeName: string = 'outpatientReport'

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