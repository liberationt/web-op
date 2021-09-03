<!--
 * @Date: 2020-07-27 09:30:46
 * @LastEditTime: 
 * @Description:付款方式维护
 * @FilePath: \web-op\src\views\his\sys\centerMaintenance\medicareInfoManage\payStyle\payStyle.vue
-->
<template>
  <div class="content">
    <!-- tab 标签页 -->
    <el-tabs class="tab-small" v-model="activeName" @tab-click="chooseName">
      <el-tab-pane label="门诊使用" name="clinicUsing">
          <clinicUsing v-model="list" ref="clinicUsing" @setRow="getRow"></clinicUsing>
      </el-tab-pane>
      <el-tab-pane label="住院使用" name="hisUsing">
          <hisUsing v-model="list" ref="hisUsing" @setRow="getRow"></hisUsing>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import clinicUsing from '../components/clinicUsing.vue'
import hisUsing from '../components/hisUsing.vue'

// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'payStyle',
  components: {
    clinicUsing,
    hisUsing, 
  },
  filters: {},
})

export default class extends Vue {
  private activeName: string = 'clinicUsing' 
  private isCreateNew: boolean = true // 新增还是保存
  private list: Array<any> = []
  private searchData: any = {
    ybdataId: 1,
    dataName: '',
  }
  created() {
    
  }
  mounted() {
      
  }

  /* 切换tab，并查询对应tab的列表数据 */
  private chooseName(tab: any, event: any) {
    this.activeName = tab.name
    this.searchData = {}
    this.list = []
    this.isCreateNew = true //修改状态
    // switch (tab.name) {
    //   case 'clinicUsing':
    //     this.searchData.ybdataId = 1
    //     ;(this.$refs.clinicUsing as any).getList()
    //     break
    //   case 'hisUsing':
    //     ;(this.$refs.hisUsing as any).getList()
    //     break
      
    // }
  }

  // 选中列表一行数据，从子组件获取右侧表单数据
  private getRow(val: any) {}

}
</script>
<style lang="scss" scoped>
.tags-view-item {
  display: inline-block;
  cursor: pointer;
  height: 32px;
  line-height: 32px;
  color: #9ca0ab;
  background: #eceded;
  padding: 0 8px;
  font-size: 12px;
  margin-left: 5px;
  border-radius: 8px;

  &:first-of-type {
    margin-left: 15px;
  }
  &:last-of-type {
    margin-right: 15px;
  }
  &.active {
    background: linear-gradient(
      315deg,
      rgba(45, 187, 255, 1) 0%,
      rgba(20, 133, 255, 1) 100%
    );
    color: #fff;
  }
}

.tab-small ::v-deep .el-tabs__header{
  border-bottom: 1px solid #f0f0f0!important;
}

::v-deep .el-tabs__nav-scroll{
  background: $white;
  border-radius: 8px;
  padding: 8px 10px;
}
</style>
