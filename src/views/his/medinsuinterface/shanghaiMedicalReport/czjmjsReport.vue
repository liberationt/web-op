// 城镇居民结算表
<template>
  <div class="content">
    <el-tabs class="tab-small" v-model="activeName" @tab-click="chooseName">
      <el-tab-pane label="门诊上报表" name="outpatientReport1">
        <outpatientReport1></outpatientReport1>
      </el-tab-pane>
      <el-tab-pane label="门诊A表" name="outpatientAccountA"></el-tab-pane>
      <el-tab-pane label="门诊B表" name="outpatientAccountB"></el-tab-pane>
      <el-tab-pane label="基本支付凭证" name="basicPayVoucher"></el-tab-pane>
      <el-tab-pane label="住院上报表" name="hospitalReport1">
          <hospitalReport1></hospitalReport1>
      </el-tab-pane>
      <el-tab-pane label="住院A表" name="hospitalAccountA"></el-tab-pane>
      <el-tab-pane label="住院B表" name="hospitalAccountB"></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import outpatientReport1 from './components/outpatientReport1.vue'
import hospitalReport1 from './components/hospitalReport1.vue'
@Component({
  name: 'czjmjsReport',
  filters: {},
  components: {
    outpatientReport1,
    hospitalReport1
  }
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private activeName: string = 'outpatientReport1'

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