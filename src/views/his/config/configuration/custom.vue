<!--
 * @Author: 曹俊
 * @LastEditTime: 2020-07-14 19:40:52
 * @LastEditors: 曹俊
 * @Description: 
 * @FilePath: \web-op\src\views\his\config\configuration\custom.vue
 * @data-name：页面配置设置得英文名称，子组件需此参数调用接口获取数据 - 必传
 * @data-action：是否显示操作单元格 显示 - true 不显示 - false  - 必传
 * @data-width: 操作单元格宽度 - 必传
 * @data-fixed: 操作单元格是否居右显示 - right - undefined  - 必传
 * @list-height: table列表页的高度 - 必传
 * @searchData：搜索条件数据 
 chis.application.tr.schemas.MDC_TumourInspectionItemCommonQuery
--> 
<template>
  <div class="content ht">
      <div class="his-module his-small">
          <setting-list
            ref="pageTable"
            data-name="GY_JBBM_MS"
            data-type="1"
            :data-action="true"
            data-fixed="undefined"
            :data-width='80'
            v-model="list"
            :list-height="listSlotHeight"
            :searchData="searchData"
            http-method="post"
          >
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">自定义</h1>
              </div>
            </div>
            <!-- 操作单元格插槽 父组件通过slot-scope接受插槽传值 -->
            <!-- {{data.scope}} 查看当前行数据 -->
            <div slot="action" slot-scope="data">
              <!-- {{data.scope.MDC_TumourInspectionItem_bigItemId}} -->
              <el-button @click="handleDelete(data.scope)"> 
                  <i class="icon his-del"></i>
              </el-button> 
            </div>
          </setting-list>
      </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { 
  Iitem, 
  Iobject, 
  deleteSql, 
  publishSql
} from '@/api/his/config/index.ts'
import { log } from 'util'

@Component({
  name: 'custom',
  components: {},
})
export default class extends Vue {
  private tableList: Array<any>  = []
  private tableDatas = []
  private tabsName: string = 'from'
  private tableData: Array<any> = []
 
  private list: Array<any> = []
  private searchData: Iobject = {
   
  }
  private listSlotHeight: number = 0
  
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 16 - 43 - 32 - 10
  }
  mounted() {
    this.getList()
  }

  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  //删除
  private handleDelete(item: any) {
    // deleteSql(item.queryId).then((res) => {
    //   this.$notify({
    //     title: this.$t('common.delSuc').toString(),
    //     message: '',
    //     type: 'success',
    //   })
    //   this.getList()
    // })
    this.getList()
  }

}
</script>
  
<style lang="scss" scoped>
@import 'config.scss';
</style>