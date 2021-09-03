<!--
 * @Date: 2020-05-27 13:56:21
 * @LastEditTime: 2020-06-19 14:55:00
 * @Description: 医生药品查询
 * @FilePath: \web-op\src\views\cis\op\dctwork\outpatinetClinic\doctorDrugInquire\index.vue
-->
<template>
    <div class="content">
        <div class="his-module his-small">
            <pagenation-list ref="pageTable"
                             data-url="/drug-service/drugsypcd/doQueryYsypList"
                             v-model="tableData"
                             :searchData="searchData"
                             http-method="post"
                             :list-height="listSlotHeight">
                <div slot="header"
                     class="row">
                    <div class="label">
                        <h1 class="title">{{$t('医生药品查询')}}</h1>
                        <el-divider direction="vertical"></el-divider>
                        <div class="searchTitle">搜索</div>
                        <el-input v-model="searchData.pydm"
                                  placeholder="请输入拼音码查询"
                                  @keydown.native.enter="searchList"
                                  clearable>
                            <i slot="prefix"
                               class="el-input__icon icon his-search"></i>
                        </el-input>
                        <search-select @change="queryList"
                                       table-name="SYS_DICT_CONFIG"
                                       kid="5"
                                       v-model="searchData.yfsb"
                                       placeholder="请选择"
                                       :backfillValue="searchData.yfsb"
                                       style="margin-left: 10px" />
                    </div>
                </div>
                <el-table slot="list"
                          stripe
                          :data="tableData"
                          border
                          lazy
                          :height="listSlotHeight"
                          :highlight-current-row="true"
                          tooltip-effect="light"
                          class="scroll-bar">
                    <el-table-column label
                                     prop="webSortNumber"
                                     width="32"
                                     align="center"></el-table-column>
                    <el-table-column :label="$t('publicInfo.drugName')"
                                     prop="ypmc"
                                     min-width="180"
                                     :show-overflow-tooltip="true"></el-table-column>

                    <!-- 药库规格 -->
                    <el-table-column :label="'药库'+$t('publicInfo.specifications')"
                                     prop="ypgg"
                                     min-width="120"
                                     :show-overflow-tooltip="true"></el-table-column>

                    <!-- 药库单位 -->
                    <el-table-column :label="'药库'+$t('publicInfo.unit')"
                                     prop="ypdw"
                                     width="70"></el-table-column>

                    <!-- 药房规格 -->
                    <el-table-column :label="'药房'+$t('publicInfo.specifications')"
                                     prop="yfgg"
                                     min-width="120"
                                     :show-overflow-tooltip="true"></el-table-column>

                    <!-- 药房单位 -->
                    <el-table-column :label="'药房'+$t('publicInfo.unit')"
                                     prop="yfdw"
                                     width="70"></el-table-column>

                    <!-- 药品费别 -->
                    <el-table-column :label="$t('publicInfo.medicalPreCate')"
                                     prop="ypfb"
                                     min-width="75">
                        <template slot-scope="scope">
                            <span v-if="scope.row.ypfb">
                                {{costTypeList.find(item => item.dv == scope.row.ypfb).dn}}
                            </span>
                        </template>
                    </el-table-column>

                    <!-- 零售价 -->
                    <el-table-column class-name="text-blue-td"
                                     :label="$t('publicInfo.retailPirce')"
                                     prop="lsjg"
                                     min-width="75"></el-table-column>
                    <!--          库存数量-->
                    <el-table-column class-name="text-blue-td"
                                     :label="$t('库存数量')"
                                     prop="kcsl"
                                     min-width="75"></el-table-column>

                    <!-- 药品产地 -->
                    <el-table-column :label="$t('publicInfo.drugHome')"
                                     prop="cdmc"
                                     min-width="120"
                                     :show-overflow-tooltip="true"></el-table-column>
                </el-table>
            </pagenation-list>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'doctorDrugInquire',
  filters: {},
  components: {},
})

export default class extends Vue {
  private tableData: any[] = []
  // 搜索内容
  private searchData: any = {
    pydm: '',
  }

  private listSlotHeight: number = 0 // 列表高度
  private costTypeList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_COSTTYPE_DICT : this.$store.state.webSqlDict.DRUG_COSTTYPE_DICT


  // 获取数据
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 条件查询
  private searchList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }




  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight - 104
  }

  mounted() {
    this.getList()
  }

  private queryList() {
    this.searchList()
  }

}
</script>

<style lang='scss' scoped>
.content {
  padding: 0 ;
}
.row .label .el-input {
  width: 190px;
}
::v-deep .el-input {
  height: 28px !important;
  .el-input__prefix {
    margin: 0px 8px 0 10px !important;
  }
}
.el-divider--vertical {
  margin: 0 10px;
}
</style>
