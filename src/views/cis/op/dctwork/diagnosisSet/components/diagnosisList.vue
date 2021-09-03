<!--
 * @Date: 2020-05-15 16:01:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-14 13:48:47
 * @description: 常用诊断维护
 -->

<template>
  <div class="his-module his-small his-dialog">
    <pagenation-list
      ref="pageTable"
      v-model="tableDatas"
      :data-url="chooseType == '1'?'/op-service/pubcyzd/xyPage':'/op-service/pubcyzd/zyPage'"
      http-method="post"
      :list-height="listSlotHeight"
      :searchData="searchData"
    >
      <div slot="header" class="row">
        <div class="label">
          <h1 class="title" style="font-weight:normal">{{$t('常用诊断维护')}}</h1>
          <el-divider direction="vertical"></el-divider>
          <el-radio-group v-model="chooseType" @change="getAnotherList">
            <el-radio :label="1">{{ $t('diagnosis.xyzd') }}</el-radio>
            <el-radio :label="2">{{ $t('diagnosis.zzzd') }}</el-radio>
          </el-radio-group>
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
        :data="tableDatas"
        border
        stripe
        :highlight-current-row="true"
        slot="list"
        @row-dblclick="handleLeftDblclick"
        :height="listSlotHeight"
        class="scroll-bar"
      >
        <!-- 序号 -->
        <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
        <!-- ICD编码 -->
        <el-table-column prop="icdCode" :label="$t('diagnosis.ICD10')" width="70"></el-table-column>
        <!-- 疾病名称 -->
        <el-table-column
          prop="jbmc"
          :label="$t('diagnosis.jbmc')"
          min-width="100"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <!-- 拼音代码 -->
        <el-table-column
          prop="pydm"
          :label="$t('hospitalDataDict.formCItem3')"
          min-width="80"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <!-- 五笔码 -->
        <el-table-column
          prop="wbdm"
          :label="$t('hospitalDataDict.formCItem4')"
          width="100"
          :show-overflow-tooltip="true"
        ></el-table-column>
      </el-table>
    </pagenation-list>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IDiagList, addZd } from '@/api/cis/op/dctwork/diagnosis'

const NperParam: any = {
  cdmzzd: null,
  cflx: 1,
  icdCode: '',
  jgid: '',
  jlbh: '',
  ksdm: '',
  pydm: '',
  sslb: 1,
  wbdm: '',
  ygdm: null,
  zdmc: '',
  zdxh: '',
}
//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'DiagnosisList',
})
export default class extends Vue {
  @Prop({ required: true }) private searchData!: any

  //声明变量，方法
  private tableDatas: IDiagList[] = []
  private chooseType: number = 1
  private listSlotHeight: number = 0
  // private dataUrl: string = '/pubcyzd/xyPage'

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 100
  }
  mounted() {
    this.getList()
  }

  private getList() {
    this.$set(this.searchData,'dmlb',10)
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private searchList() {
    this.$set(this.searchData,'dmlb',10)
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }
  private getAnotherList(value: string) {
    this.searchList()
    this.$emit('getValue', value)
  }
  private handleLeftDblclick(value: IDiagList) {
    let param = { ...NperParam }
    param.cflx = this.chooseType
    param.icd10 = value.icdCode
    param.jlbh = 10001
    param.ksdm = 34
    param.pydm = value.pydm
    param.sslb = 1
    param.wbdm = value.wbdm
    param.zdmc = value.jbmc
    param.zdxh = value.jbxh ? value.jbxh : value.jbbs   
    // console.log('======', param)
    addZd(param).then(() => {
      this.$notify({
        type: 'success',
        title: '新增成功',
        message: '',
      })
      this.$emit('refresh')
    })
  }
}
</script>

<style lang="scss" scoped>
.his-dialog {
  padding-top: 8px;
  .row {
    justify-content: start !important;
  }
}
::v-deep .el-radio__label {
  font-size: 13px;
  padding-left: 4px;
}

.row .label .el-input {
  width: 190px;
}

::v-deep .el-input {
  height: 28px !important;
  .el-input__prefix {
    margin: 0 8px 0 10px !important;
  }
}
.scroll-bar ::v-deep .el-table__body-wrapper{
  overflow-x: hidden;
}
.row .label .title{
  font-weight: normal !important;
}
</style>
