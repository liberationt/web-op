<!--
 * @Date: 2020-05-26 14:48:46
 * @LastEditors: zhml
 * @LastEditTime: 2020-05-28 11:06:09
 * @description: 心电检查报告
-->

<template>
    <div class="ht module">
        <el-row :gutter="10"
                class="ht">
            <el-col :span="10"
                    class="ht">
                <div class="right-list his-module ht">
                    <pagenation-list ref="pageTable"
                                     v-model="tableDatas"
                                     data-url="/op-service/interfaceecgreport/queryPage"
                                     http-method="post"
                                     :list-height="listSlotHeight"
                                     :searchData="searchData">
                        <el-table :data="tableFormat"
                                  border
                                  stripe
                                  :highlight-current-row="true"
                                  slot="list"
                                  fit
                                  @row-click="handleRowClick"
                                  :height="listSlotHeight"
                                  class="scroll-bar">
                            <!-- 序号 -->
                            <el-table-column prop="webSortNumber"
                                             width="32"
                                             align="center"></el-table-column>
                            <!--              <el-table-column prop="reqData" width="80" align="center" label="申请日期"></el-table-column>-->
                            <el-table-column prop="examname"
                                             min-width="130"
                                             show-overflow-tooltip
                                             align="center"
                                             label="检查项目"></el-table-column>
                            <el-table-column prop="bodypart"
                                             width="80"
                                             show-overflow-tooltip
                                             align="center"
                                             label="检查部位"></el-table-column>
                            <el-table-column prop="diagname"
                                             width="80"
                                             show-overflow-tooltip
                                             align="center"
                                             label="诊断结论"></el-table-column>
                            <el-table-column prop="examineTypeName"
                                             width="60"
                                             align="center"
                                             label="检验状态"></el-table-column>
                            <el-table-column prop="writedate"
                                             width="80"
                                             align="center"
                                             label="报告日期"></el-table-column>
                        </el-table>
                    </pagenation-list>

                </div>
            </el-col>
            <el-col :span="14"
                    class="ht">
                <div class="right-list his-module ht">
                    <div class="detail-time">
                        {{ formDetail.writedate }} {{ formDetail.writetime }}

                    </div>
                    <div class="detail-title">影像所见：</div>
                    <div class="detail-content">
                        {{ formDetail.diagdesc }}
                    </div>
                    <div class="detail-title">报告内容：</div>
                    <div class="detail-content">
                        {{ formDetail.diagname }}
                    </div>
                    <div class="detail-title">影像地址：</div>
                    <div class="detail-content">
                        {{ formDetail.imgUrl }}
                    </div>
                </div>
            </el-col>

        </el-row>

    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { id2Name } from '@/utils'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'EcgReport',
})
export default class extends Vue {
  private tableDatas: any[] = []
  private listSlotHeight: number = 0
  private searchData: any = {}
  private statusDict: Array<any> = [] // 检查状态
  private formDetail:any = {}

  created() {
    this.listSlotHeight =  Vue.prototype.PageHeight - 225
  }

  mounted() {
    this.statusDict = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.STATUS_DICT : this.$store.state.webSqlDict.STATUS_DICT

    this.getList()

  }

  get tableFormat() {
    const tabledata = this.tableDatas
    id2Name(tabledata, 'examineType', 'examineTypeName', this.statusDict, 'dv', 'dn')
    // id2Name(tabledata, 'brxz', 'brxzName', this.patientTypeList, 'dv', 'dn')
    // id2Name(tabledata, 'ysdm', 'ysdmName', this.doctorList, 'dv', 'dn')
    // id2Name(tabledata, 'zsid', 'zsidName', this.doctorList, 'dv', 'dn')
    return tabledata
  }

  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private handleRowClick(val:any) {
    this.formDetail = {...val}
  }
}
</script>

<style lang="scss" scoped>

.label {
  background: #ffffff;
  border-radius: 8px;
}
.detail-time{
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
  font-size: 14px;
  font-family:siyuanMedium;
  color: #222b31;

}
.detail-title{
  margin: 24px 0 14px 0;
  font-size: 14px;
  color:  #222B31;
}
.detail-content{
  color: #6A6D78;
  font-size: 14px;
}

</style>
