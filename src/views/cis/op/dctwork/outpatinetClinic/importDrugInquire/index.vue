<!--
 * @Date: 2020-05-27 13:56:27
 * @LastEditTime: 2020-05-28 14:57:50
 * @Description: 进口药查询
 * @FilePath: \web-op\src\views\cis\op\dctwork\outpatinetClinic\importDrugInquire\index.vue
-->
<template>
  <div class="content">
    <div class="his-module his-small">
      <span>报表</span>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'importDrugInquire',
  filters: {},
})
export default class extends Vue {
  // 声明变量，方法
  // 监听方法
  @Watch('')
  // 生命周期
  mounted() {
    // console.log('hello world')
  }
}
</script>

<style lang='scss' scoped>
</style>
