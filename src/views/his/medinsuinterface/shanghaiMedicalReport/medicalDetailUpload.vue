// 医保明细上传
<template>
  <div class="content">
    <el-tabs class="tab-small" v-model="activeName" @tab-click="chooseName">
      <el-tab-pane label="交易记录库" name="jyjlLibrary">
        <jyjlLibrary></jyjlLibrary>
      </el-tab-pane>
      <el-tab-pane label="门急诊大病挂号库" name="mjzdbghLibrary">
        <mjzdbghLibrary></mjzdbghLibrary>
      </el-tab-pane>
      <el-tab-pane label="住院结算记录库" name="zyjsjlLibrary">
        <zyjsjlLibrary></zyjsjlLibrary>
      </el-tab-pane>
      <el-tab-pane label="住院费用明细库" name="zyfymxLibrary">
        <zyfymxLibrary></zyfymxLibrary>
      </el-tab-pane>
      <el-tab-pane label="出院诊断库" name="cyzdLibrary">
        <cyzdLibrary></cyzdLibrary>
      </el-tab-pane>
      <el-tab-pane label="明细项目细分库" name="mxxmxfLibrary">
        <mxxmxfLibrary></mxxmxfLibrary>
      </el-tab-pane>
      <el-tab-pane label="死亡医学证明(推断)书库" name="swyxzmtdsLibrary">
        <swyxzmtdsLibrary></swyxzmtdsLibrary>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import jyjlLibrary from './components/jyjlLibrary.vue'
import mjzdbghLibrary from './components/mjzdbghLibrary.vue'
import zyjsjlLibrary from './components/zyjsjlLibrary.vue'
import zyfymxLibrary from './components/zyfymxLibrary.vue'
import cyzdLibrary from './components/cyzdLibrary.vue'
import mxxmxfLibrary from './components/mxxmxfLibrary.vue'
import swyxzmtdsLibrary from './components/swyxzmtdsLibrary.vue'
@Component({
  name: 'medicalDetailUpload',
  filters: {},
  components: {
    jyjlLibrary,
    mjzdbghLibrary,
    zyjsjlLibrary,
    zyfymxLibrary,
    cyzdLibrary,
    mxxmxfLibrary,
    swyxzmtdsLibrary
  }
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private activeName: string = 'jyjlLibrary'

  private chooseName(tab: any, event: any) {}
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {}
}
</script>
<style scoped lang="scss">
::v-deep .el-tabs__nav-scroll{
  background: $white;
  border-radius: 8px;
  padding: 8px 10px;
}
</style>