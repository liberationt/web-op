// 非实时结算上传
<template>
  <div class="content">
    <el-tabs class="tab-small" v-model="activeName" @tab-click="chooseName">
      <el-tab-pane label="非实时结算门诊费用明细库" name="fssjsmzfymxLibrary">
        <fssjsmzfymxLibrary></fssjsmzfymxLibrary>
      </el-tab-pane>
      <el-tab-pane label="非实时结算住院费用明细库" name="fssjszyfymxLibrary">
        <fssjszyfymxLibrary></fssjszyfymxLibrary>
      </el-tab-pane>
      <el-tab-pane label="非实时结算住院结算记录库" name="fssjszyjsjlLibrary">
        <fssjszyjsjlLibrary></fssjszyjsjlLibrary>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import fssjsmzfymxLibrary from './components/fssjsmzfymxLibrary.vue'
import fssjszyfymxLibrary from './components/fssjszyfymxLibrary.vue'
import fssjszyjsjlLibrary from './components/fssjszyjsjlLibrary.vue'
@Component({
  name: 'fssjsUpload',
  filters: {},
  components: {
    fssjsmzfymxLibrary,
    fssjszyfymxLibrary,
    fssjszyjsjlLibrary
  }
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private activeName: string = 'fssjsmzfymxLibrary'

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