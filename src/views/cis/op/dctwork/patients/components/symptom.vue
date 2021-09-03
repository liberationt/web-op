<!--
 * @Date: 2020-05-27 15:47:34
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-18 10:49:01
 * @description: 证候列表
-->
<template>
  <div class="content his-patient-zh">
    <div class="header-row" slot="header">
      <div class="label">搜索</div>
      <div class="row-input">
        <el-input
                v-model="searchData.condition"
                :placeholder="'请输入拼首查询'"
                @keydown.native.enter="getList"
                clearable
        >
          <i slot="prefix" class="el-input__icon icon his-search"></i>
        </el-input>
      </div>
    </div>
    <pagenation-list 
      ref="pageTable" 
      v-model="tableDatas" 
      data-url="/system-service/dicjbbm/zhQueryAll"
      http-method="post"
      :list-height="listSlotHeight"
      :searchData="searchData"
      :pageProps="{ layout: 'total, prev, next' }"
    >
      <el-table 
        :data="tableDatas" 
        border 
        stripe 
        highlight-current-row 
        slot="list" 
        @row-dblclick="setObjInput"
        class="scroll-bar no-underline"
        :height="listSlotHeight + 20"
        tooltip-effect="light"
        ref="dictList"
      >
        <el-table-column label="证侯分类" prop="flmc" show-overflow-tooltip></el-table-column>
        <el-table-column label="证侯代码" prop="zhdm" show-overflow-tooltip></el-table-column>
        <el-table-column label="证侯名称" prop="zhmc" show-overflow-tooltip></el-table-column>
      </el-table>
    </pagenation-list>

  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { IOperMainObj, IOperDocObj } from '@/api/cis/op/dctwork/maintenanceSet'

@Component({
  name: 'Sympton',
})
export default class extends Vue {
  private tableDatas: IOperMainObj[] = []
  private searchData: any = {
    condition: '',
    pageNum: 1,
    pageSize: 10,
  }
  private pageProps: any = { layout: ' total,prev, next,jumper' }
  private listSlotHeight: number = 0
  private headerArray: Array<any> = [
    {prop:'stop',label: '证候分类'},
    {prop:'py',label: '证候代码'},
    {prop:'dn',label: '证候名称'},
  ]
  created() {
    this.listSlotHeight = (Vue.prototype.PageHeight - 330) / 2
  }
  mounted() {
    this.getList()
  }
  private setObjInput(row:any) {
    console.log(row)
    this.$emit('setObjInput',row)
  }
  private getList() {
    const pageElement:any = this.$refs.pageTable;
    pageElement.getList()
    // pageElement.dataTotal()
  }
}
</script>

<style lang="scss" scoped>
.his-patient-zh {
  background: $white;
  border-radius: 8px;
  height: auto;
  padding: 0 !important;
  ::v-deep .el-table__header-wrapper {
    height: 28px;
    line-height: 28px;
  }
  ::v-deep .el-table__body-wrapper {
    overflow: auto;
  }
  .header-row {
    display: flex;
    flex-flow: row nowrap;
    padding-bottom: 8px;
    .label {
      width: 40px;
      font-size: 13px;
      align-self: center;
      margin-right: 8px;
    }

    .row-input {
      height: 28px;
      width: 100%;
      background: rgba(245, 246, 248, 1);
      border-radius: 4px;
      margin-right: 6px;

      ::v-deep .el-input__inner {
        width: 108px;
        height: 28px;
        background: rgba(245, 246, 248, 1);
        border-radius: 4px;
        margin-right: 6px;
        border: none;
      }
    }

    .el-button--primary {
      padding: 0px;
      width: 48px;
      height: 24px;
      border-radius: 4px;
      justify-content: center;
      margin-top: 3px;
    }
  }
}

</style>
