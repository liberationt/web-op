<template>
  <div class="content screen ht">
    <pagenation-list class="his-module" ref="pageTable" data-url="/op-service/opzspdxx/waitQueueResult" v-model="tabledata" :searchData="searchData" :list-height="listSlotHeight" :pageProps="pageProps" http-method="post">
      <div slot="header" class="row headerScreen">
        <div class="label">
          <h1 class="title">{{ $t('sources.title') }}</h1>
          <span class="tag">{{ $t('sources.query1') }}</span>
          <search-select v-model="searchData.deptId" table-name="SYS_DICT_CONFIG" kid="4" placeholder=" " style="margin-right: 10px; display: inline-block;" />
          <span class="tag">{{ $t('sources.query2') }}</span>
          <search-select v-model="searchData.queueConsultCode" table-name="SYS_DICT_CONFIG" kid="2" placeholder=" " style="margin-right: 10px;" />
          <span class="tag">{{ $t('sources.query3') }}</span>
          <el-date-picker type="date" v-model="searchData.regDate" @change="getTreatmentDate" format="yyyy-MM-dd" placeholder=" " style="margin-right: 10px;"></el-date-picker>
        </div>
        <el-button type="primary" class="blue-gra" icon="icon his-search" @click="handleQuery" v-preventReClick>{{ $t('sources.queryBtn') }}</el-button>
      </div>
      <!-- 需分页的内容可以是表格列表等元素，配置slot="list"，并绑定数据与pagenation-table一致 -->
      <el-table

      :height="listSlotHeight"
      :data="tableFormat" border stripe slot="list" row-key="unionKey"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :default-sort="{prop: 'pdNums', order: 'descending'}"
     >
        <el-table-column prop="ksid" :label="$t('sources.deptName')"></el-table-column>
        <el-table-column prop="pdNums" sortable :label="$t('sources.pdNums')"  width="120"></el-table-column>
        <el-table-column prop="jzNums" :label="$t('sources.jzNums')"></el-table-column>
        <el-table-column prop="dzNums" :label="$t('sources.dzNums')"></el-table-column>
        <el-table-column prop="zzNums" :label="$t('sources.zzNums')"></el-table-column>
        <el-table-column prop="zbNums" :label="$t('sources.zbNums')"></el-table-column>
        <el-table-column prop="maxWaitTime" :label="$t('sources.maxWaitTime')" width="160"></el-table-column>
        <el-table-column prop="minWaitTime" :label="$t('sources.minWaitTime')" width="160"></el-table-column>
        <el-table-column prop="avgWaitTime" :label="$t('sources.avgWaitTime')" width="160"></el-table-column>
        <!-- <template slot-scope="{ row, index }" slot="action">
                    <span v-if="row.deptName == null"> {{row.roomName}}</span>
                    <span v-else>{{row.deptName}}</span>
        </template>-->
      </el-table>
      <!-- <div slot="remark">我是简单的备注内容</div> -->
    </pagenation-list>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import { parseTime } from '../../../../../utils'
declare interface StringArr {
  title?: string
  key?: string
  align?: string
  slot?: string
  sortable?: boolean
  width?: number
  tree?: boolean
}
declare interface StringObj {
  deptId?: string
  queueConsultCode?: string
  regDate?: string | null
}
@Component({
  name: 'sourcesQueuingQuery',
  //组件引用
  components: {},
  filters: {},
})
export default class extends Vue {
  //声明变量默认值（原data中数据）
  private msg: string = 'typescript'
  private listSlotHeight: number = 0
  private searchData: StringObj = {
    // 搜索条件
    deptId: '',
    queueConsultCode: '',
    regDate: '',
  }
  private serviceList: object[] = [] //服务台列表
  private medicalDate: string = '' // 就诊日期
  private tabledata: any[] = [] // 表格数据
  private deptList: any[] = [] // 门诊科室列表
  private pageProps: object = {
    'show-elevator': true,
    'show-sizer': true,
    'show-total': true,
  }
  //原computed中的方法
  get ntest() {
    return this.msg
  }

  //数据监控
  @Watch('searchData.deptId', { immediate: true })
  private onDeptChange(val: string) {
    if (val == '') return
    this.handleQuery()
  }
  @Watch('searchData.queueConsultCode', { immediate: true })
  private onZSChange(val: string) {
    if (val == '') return
    this.handleQuery()
  }

  //钩子函数
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 130
  }

  //钩子函数
  mounted() {
    this.deptList = this.$store.state.webSqlDict.OUTPATIENT_DEPARTMENT
    this.handleQuery()
  }

  get tableFormat() {
    const tableData = this.tabledata
    tableData.map((item: any) => {
      let cc: any = this.deptList.find((res: any) => {
        res.dv == item.ksid
      })
      if (cc && cc.dn) {
        item.ksidName = cc.dn
      }
      item.haschild = true
    })
    return tableData
  }

  //原methods中的方法
  private getTreatmentDate(val: any) {
    this.searchData.regDate = parseTime(val,'{y}-{m}-{d} {h}:{i}:{s}')
    this.handleQuery()
  }

  // 点击查询
  private handleQuery() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

}
</script>

<style lang="scss" scoped>
.btnCss {
  margin-left: 8px;
}
.headerScreen {
  display: flex;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f5f6f8;
}

::v-deep .el-input .el-input__inner {
  width: 150px !important;
}
.row .label .tag {
  padding-right: 0px;
}
.search-select {
  width: 150px;
}
</style>
