 <!--线上工作量统计-->
<template>
  <div class="content">
    <div class="his-module his-small">
      <div slot="header" class="row">
        <div class="label">
          <span class="his-title">工作量记录</span>
          <el-divider direction="vertical"></el-divider>
          <span class="tag">搜索</span>
          <el-input placeholder="请输入工号/姓名" v-model="searchData.keyword" style="width: 170px;" @keyup.enter.native="searchList"></el-input>
          <el-divider direction="vertical"></el-divider>
          <span class="tag">科室</span>
          <search-select class="w100" table-name="SYS_DICT_CONFIG" kid="13" v-model="searchData.ksdm" :placeholder="$t('请选择科室')"  @clear="onClear" :backfillValue="searchData.ksdm" style="width: 190px;" />
          <el-divider direction="vertical"></el-divider>
          <span class="tag">时间</span>
          <el-date-picker v-model="dateRange" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始时间" end-placeholder="结束时间" clearable class="date-wrapper" style="width: 220px;"></el-date-picker>
          <el-divider direction="vertical"></el-divider>
          <div class="btn">
            <el-button size="mini" type="text" @click="handleSearch"><i class="icon his-search"></i>查询</el-button>
          </div>
        </div>
      </div>
      <pagenation-list ref="pageTable" data-url="/op-service/mpuserconsult/workloadAccountForYS" http-method="post" v-model="tableDatas" :searchData="searchData" :list-height="listSlotHeight">
        <el-table :data="tableFormat" border stripe :highlight-current-row="true" slot="list" :height="listSlotHeight - 10" class="scroll-bar no-underline" tooltip-effect="light">
          <!-- 序号 -->
          <el-table-column type="index" align="center" width="32"></el-table-column>
          <!-- 就诊状态 -->
          <el-table-column prop="ysdm" :label="$t('工号')" min-width="70"></el-table-column>
          <!-- 就诊卡号 -->
          <el-table-column prop="ysxm" :label="$t('医生姓名')" min-width="100"> </el-table-column>
          <!-- 档案号码 -->
          <el-table-column prop="ksmc" :label="$t('科室')" min-width="100" />
          <!-- 就诊流水号 -->
          <el-table-column prop="zlrs" :label="$t('诊疗人数')" min-width="100" />
        </el-table>
      </pagenation-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { id2Name } from '@/utils'
import { getNow } from '@/api/his/basic'
import { parseTime } from '@/utils'

@Component({
  name: 'workloadAccount',
  filters: {},
})
export default class extends Vue {
  private tableDatas: any[] = []
  private listSlotHeight: number = 0
  private sexList: Array<any> = [] //性别
  private patientTypeList: Array<any> = [] //患者性质
  private doctorList: Array<any> = [] //医生
  private deptList: Array<any> = [] //科室
  private dateRange: Array<any> = [] // 就诊日期
  private value: any = []
  private searchData: any = {
    ksdm: null,
    keyword: '',
    kssj: '',
    jssj: '',
  }
  get tableFormat() {
    const tabledata = this.tableDatas
    return tabledata
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 100
    this.getDate()
  }
  mounted() {
    this.$nextTick(()=>{
      ;(this.$refs.pageTable as any).getList()
    })
    this.sexList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT
    this.patientTypeList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_PATIENT_DICT : this.$store.state.webSqlDict.TABLE_PATIENT_DICT
    this.doctorList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.deptList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DEPT_DICT : this.$store.state.webSqlDict.DEPT_DICT
  }

  // 查询
  private handleSearch() {
    ;(this.$refs.pageTable as any).getList()
  }

  private getDate() {
    let year = new Date().getFullYear()
    let month = new Date().getMonth()
    let time = new Date(year, month, 1)
    this.dateRange = [parseTime(time, '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')]
  
  }
  @Watch('dateRange')
  private onDateChange(val: any[] | null) {
    if (val) {
      this.searchData.kssj = parseTime(val[0], '{y}-{m}-{d}')
      this.searchData.jssj = parseTime(val[1], '{y}-{m}-{d}')
    } else {
      this.searchData.kssj = ''
      this.searchData.jssj = ''
    }
  }
  //清空输入框
  private onClear(){
    this.searchData.ksdm=null
  }
}
</script>

<style lang="scss" scoped>
.his-title {
  font-size: 16px;
  font-family: 'siyuanMedium';
  font-weight: 500;
}

.his-small .row .label .tag {
  padding-left: 0;
}

.his-small .row .label .el-input::v-deep .el-input__inner {
  width: 170px !important;
}
</style>
