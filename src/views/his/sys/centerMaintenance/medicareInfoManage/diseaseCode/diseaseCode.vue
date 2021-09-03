<!--
 * @Date: 2020-07-22 18:30:46
 * @LastEditTime: 
 * @Description:疾病编码维护
 * @FilePath: \web-op\src\views\his\sys\centerMaintenance\medicareInfoManage\diseaseCode\diseaseCode.vue
-->
<template>
  <div class="content">
    <!-- tab 标签页 -->
    <el-tabs class="tab-small" v-model="activeName" @tab-click="chooseName">
      <el-tab-pane label="西医疾病编码维护" name="xyDiseases">
          <xyDiseases v-model="list" ref="xyDiseases" @setRow="getRow"></xyDiseases>
      </el-tab-pane>
      <el-tab-pane label="中医疾病编码维护" name="zyDiseases">
          <zyDiseases v-model="list" ref="zyDiseases" @setRow="getRow"></zyDiseases>
      </el-tab-pane>
      <el-tab-pane label="中医证侯编码维护" name="zySyndrome">
          <zySyndrome v-model="list" ref="zySyndrome" @setRow="getRow"></zySyndrome>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import xyDiseases from '../components/xyDiseases.vue'
import zyDiseases from '../components/zyDiseases.vue'
import zySyndrome from '../components/zySyndrome.vue'

// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'diseaseCode',
  components: {
    xyDiseases,
    zyDiseases,
    zySyndrome
  },
  filters: {},
})

export default class extends Vue {
  private activeName: string = 'xyDiseases' // 默认显示中医疾病
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
    // this.activeName = tab.name
    // this.searchData = {}
    // this.list = []
    // this.isCreateNew = true //修改状态
    // switch (tab.name) {
    //   case 'zyDiseases':
    //     this.searchData.ybdataId = 1
    //     ;(this.$refs.xyDiseases as any).getList()
    //     break
    //   case 'xyDiseases':
    //     ;(this.$refs.zyDiseases as any).getList()
    //     break
    //   case 'zySymptoms':
    //     ;(this.$refs.zySyndrome as any).getList()
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
