<!--
 * @Date: 2020-05-15 16:01:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-14 13:50:22
 * @description: 常用诊断维护
 -->

<template>
  <div class="his-module his-small his-dialog">
    <div slot="header" class="row">
      <div class="label">
        <div class="title">
          <h1 style="font-weight:normal">{{ $t('diagnosis.titleRight') }}</h1>
        </div>
        <el-divider direction="vertical"></el-divider>
        <div class="searchTitle">搜索</div>
        <el-input
          v-model="searchData.pydm"
          :placeholder="$t('hospitalDataDict.formValidPyCode')"
          @change="searchList"
        >
          <i slot="prefix" class="el-input__icon icon his-search"></i>
        </el-input>
      </div>
    </div>
    <el-table
      :data="tableList"
      border
      stripe
      :highlight-current-row="true"
      @row-dblclick="handleRightDblclick"
      :height="listSlotHeight"
      class="scroll-bar no-underline"
    >
      <!-- 序号 -->
      <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
      <!-- 诊断名称 -->
      <el-table-column
        prop="zdmc"
        :label="$t('diagnosis.zdmc')"
        min-width="200"
        :show-overflow-tooltip="true"
      ></el-table-column>

      <el-table-column
        prop="icd10"
        :label="$t('diagnosis.zdbm')"
        width="80"
        :show-overflow-tooltip="true"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { IPerList, deleteZd, queryList } from '@/api/cis/op/dctwork/diagnosis'
//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'PersonalList',
  components: {},
})
export default class extends Vue {
  @Prop({ required: true }) private searchData!: any
  //声明变量，方法
  private tableList: IPerList[] = []
  private chooseType: number = 1
  private listSlotHeight: number = 0

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 60 - 10
  }
  mounted() {
    this.getList()
  }

  @Watch('tableList',{immediate:true,deep:true})
  private tableListChange(val:any) {
    let list:any =  []
    if (val) {
      this.tableList.forEach((item:any) => {
        list.push(item.zdxh)
      })
      this.$emit('getLeftList',list)
    }

  }

  private getList() {
    queryList(this.searchData).then((res) => {
      res.data.map((item: any, index: number) => {
        item.webSortNumber = index + 1
      })
      this.tableList = res.data
      this.tableListChange(this.tableList)
    })
  }

  private searchList() {
    this.getList()
  }

  private handleRightDblclick(value: IPerList) {

    deleteZd({ jlbh: value.jlbh }).then(() => {
      this.$notify({
        type: 'success',
        title: '删除成功',
        message: '',
      })

      this.getList()

    })
  }
}
</script>

<style lang="scss" scoped>
.his-dialog {
  padding-top: 8px;
}
.title {
  height: 28px;
  display: flex;
  align-content: center;
  flex-direction: row;
  align-items: center;
}
::v-deep .el-input {
  height: 28px !important;
  .el-input__prefix {
    margin: 0px 8px 0 10px !important;
  }
}
</style>
