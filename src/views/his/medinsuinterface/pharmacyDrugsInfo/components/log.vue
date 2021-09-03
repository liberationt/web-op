<!--
 * @Author: 曹俊
 * @LastEditTime: 2020-04-22 16:50:29
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\views\his\medinsuinterface\pharmacyDrugsInfo\components\log.vue
 -->
<template>
  <div>
    <pagenation-list
        ref="pageTable"
        data-url="/op-service/shybybblgz/queryPage"
        v-model="list"
        :searchData="searchData"
        http-method="post">
        <!-- 需分页的内容可以是表格列表等元素，配置slot="list"，并绑定数据与pagenation-table一致 -->
        <el-table
            slot="list"
            stripe
            row-key="menuId"
            :indent="16"
            :highlight-current-row="true"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            :data="list"
            border
            lazy>
            <el-table-column prop="tbdm" label="导入时间"></el-table-column>
            <el-table-column prop="fbrq" label="导入文件名"></el-table-column>
            <el-table-column prop="jjdw" label="数据类别"></el-table-column>
            <el-table-column prop="jhjggzsm" label="导入人"></el-table-column>
            <el-table-column prop="jhgzjgje" label="数据导入结果"></el-table-column>
            <el-table-column prop="xsjggzsm" label="更新数据行数" ></el-table-column>
        </el-table>
    </pagenation-list>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { enableStatus, addProportion, editProportion } from '@/api/his/medinsuinterface/pharmacyDrugsInfo.ts'
import { Form } from 'element-ui'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: "proportion",
  filters: {}
})
export default class extends Vue {
  @Prop({ required: true }) private value!: any;
  set list(val: any) {
    this.$emit("input", val);
  }
  get list() {
    return this.value;
  }
  private searchData: any = {};
  private pageProps: any = {
    // iview分页组件自带props
    "show-elevator": true,
    "show-sizer": true,
    "show-total": true
  };
  private isMask: boolean = false
  private isVisiable: boolean = false
  private title = '新增药品品规基础信息'
  private isCreateAndEdit = true
  private form: any = {}
  mounted() {
    this.getList();
  }
  private getList() {
    const pageTable: any = this.$refs.pageTable;
    pageTable.getList();
  }
  private handleRow(val: any) {
    this.$emit("setRow", val);
  }
}
</script>

<style lang='less' scoped>
</style>

