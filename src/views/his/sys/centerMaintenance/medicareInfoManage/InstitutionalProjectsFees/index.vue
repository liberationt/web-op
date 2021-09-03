<!--
 * @Date: 
 * @LastEditTime: 
 * @Description:机构收费项目维护
 * @FilePath: 
-->
<template>
  <div class="content">
    <!-- tab 标签页 -->
    <el-tabs class="tab-small" v-model="activeName" @tab-click="chooseName">
      <el-tab-pane label="医疗项目" name="medicalsProject">
        <medicalsProject v-model="list" ref="medicalsProject"></medicalsProject>
      </el-tab-pane>
      <el-tab-pane label="药品项目" name="drugsProject">
        <drugsProject v-model="list" ref="drugsProject"></drugsProject>
      </el-tab-pane>
      <el-tab-pane label="其他项目" name="othersProject">
        <othersProject v-model="list" ref="othersProject"></othersProject>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import medicalsProject from '../components/medicalsProject.vue'
import drugsProject from '../components/drugsProject.vue'
import othersProject from '../components/othersProject.vue'
// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'InstitutionalProject',
  components: { medicalsProject, drugsProject, othersProject },
  filters: {}
})
export default class extends Vue {
  private activeName: string = 'medicalsProject' // 默认显示中医疾病
  private isCreateNew: boolean = true // 新增还是保存
  private list: Array<any> = []
  private searchData: any = {}
  created() {}
  mounted() {}

  /* 切换tab，并查询对应tab的列表数据 */
  private chooseName(tab: any, event: any) {
    this.activeName = tab.name
  }
  // 选中列表一行数据，从子组件获取右侧表单数据
  private getRow(val: any) {}
}
</script>
<style lang="scss" scoped>
.tab-small ::v-deep .el-tabs__header {
  border-bottom: 1px solid #f0f0f0 !important;
}

::v-deep .el-tabs__nav-scroll {
  background: $white;
  border-radius: 8px;
  padding: 8px 10px;
}
</style>
