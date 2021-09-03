<!--
 * @Date: 2020-05-21 15:47:52
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-12 11:12:06
 * @description:  常用诊断列表
-->
<template>
  <div class="content his-patient-diagnose-list">
    <pagenation-list ref="pageTable" v-model="tableDatas" data-url="/op-service/pubcyzd/findPage" http-method="post" :list-height="listSlotHeight" :searchData="searchData" :pageProps="{ layout: 'total, prev, next' }" optTrigger="true">
      <div class="header-row" slot="header">
        <div class="label">搜索</div>
        <div class="row-input">
          <el-input v-model="searchData.pydm" :placeholder="'请输入拼首查询'" @keydown.native.enter="getList" clearable>
            <i slot="prefix" class="el-input__icon icon his-search"></i>
          </el-input>
        </div>
      </div>
      <el-table :data="tableDatas" border stripe :highlight-current-row="true" slot="list" @row-dblclick="handleLeftDblclick" class="scroll-bar" :height="listSlotHeight">
        <!-- ICD编码 -->
        <el-table-column prop="icd10" :label="$t('diagnosis.ICD10')" width="70"></el-table-column>
        <!-- 疾病名称 -->
        <el-table-column prop="zdmc" :label="$t('diagnosis.jbmc')" min-width="180" show-overflow-tooltip></el-table-column>
      </el-table>
    </pagenation-list>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { IOperMainObj, IOperDocObj } from '@/api/cis/op/dctwork/maintenanceSet'

@Component({
  name: 'DiagnoseList'
})
export default class extends Vue {
  @Prop({ required: true }) private isExit!: boolean
  @Prop({ required: true }) private searchData!: any
  @Prop({ required: true }) private isHalf!: boolean

  private tableDatas: IOperMainObj[] = []
  private listSlotHeight: number = 0
  private pageProps: any = { layout: ' total,prev, next,jumper' }


  created() {
    if (this.isHalf) {
      this.listSlotHeight = (Vue.prototype.PageHeight - 310) / 2
    } else {
      this.listSlotHeight = Vue.prototype.PageHeight - 230
    }

  }

  mounted() {
    this.getList()
  }


  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private searchList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

  private handleLeftDblclick(val: any) {
    this.$emit('setData', val)
  }
}

</script>
<style lang="scss" scoped>
.his-patient-diagnose-list {
  background: $white;
  border-radius: 8px;
  padding: 0 !important;
  width: 100%;
  height: auto;


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

  ::v-deep .el-table__header-wrapper {
    height: 28px;
    line-height: 28px;
  }

  .pagenation-list {
    width: 100%;
  }

  .el-table--border {
    th {
      height: 28px !important;
      line-height: 28px !important;
    }
  }
}

</style>
