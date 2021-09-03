// 城镇大病2#
<template>
  <div class="content">
    <el-tabs class="tab-small" v-model="activeName" @tab-click="chooseName">
      <el-tab-pane label="医保上报表" name="medicalInsureReport">
        <medicalInsureReport2></medicalInsureReport2>
      </el-tab-pane>
      <el-tab-pane label="结算表A" name="stateAccountA"></el-tab-pane>
      <el-tab-pane label="结算表B" name="stateAccountB"></el-tab-pane>
      <el-tab-pane label="基本支付凭证" name="basicPayVoucher"></el-tab-pane>
      <el-tab-pane label="附加支付凭证" name="additionalPayVoucher"></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import medicalInsureReport2 from './components/medicalInsureReport2.vue'
@Component({
  name: 'townSeriousIllness',
  filters: {},
  components: {
    medicalInsureReport2
  }
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private activeName: string = 'medicalInsureReport'

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