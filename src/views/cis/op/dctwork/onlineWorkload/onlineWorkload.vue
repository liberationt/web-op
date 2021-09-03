<!--客服运营-工作量统计-->
<template>
  <div class="content">
    <div class="his-module his-small">
      <div slot="header" class="row">
        <div class="label">
          <span class="his-title">工作量记录</span>
          <el-divider direction="vertical"></el-divider>
          <span class="tag">搜索</span>
          <el-input placeholder="请输入工号/姓名" v-model="searchData.userid" style="width: 170px;" @keyup.enter.native="searchList"></el-input>
          <el-divider direction="vertical"></el-divider>
          <span class="tag">时间</span>
          <el-date-picker v-model="dateRange" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始时间" end-placeholder="结束时间" clearable class="date-wrapper" style="width: 220px;"></el-date-picker>
          <el-divider direction="vertical"></el-divider>
          <div class="btn">
            <el-button size="mini" type="text" @click="handleSearch"><i class="icon his-search"></i>查询</el-button>
          </div>
        </div>
      </div>
      <pagenation-list ref="pageTable" data-url="/op-service/mpuserconsult/workloadAccountForKF" http-method="post" v-model="tableDatas" :searchData="searchData" :list-height="listSlotHeight">
        <el-table :data="tableDatas" border stripe :highlight-current-row="true" slot="list" :height="listSlotHeight - 10" class="scroll-bar no-underline" tooltip-effect="light">
          <!-- 序号 -->
          <el-table-column type="index" align="center" width="32"></el-table-column>
          <!-- 就诊状态 -->
          <el-table-column prop="kfgh" :label="$t('客服工号')" min-width="70"></el-table-column>
          <!-- 就诊卡号 -->
          <el-table-column prop="kfxm" :label="$t('客服姓名')" min-width="100"> </el-table-column>
          <!-- 就诊流水号 -->
          <el-table-column prop="zxsl" :label="$t('咨询数量')" min-width="100" />
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
  name: 'onlineWorkload',
  filters: {},
})
export default class extends Vue {
  private tableDatas: any[] = []
  private listSlotHeight: number = 0
  private sexList: Array<any> = [] //性别
  private patientTypeList: Array<any> = [] //患者性质
  private deptList: Array<any> = [] //科室
  private value: any = []
  private dateRange: any = []
  private searchData: any = {
    userid: null,
    zxsjks: '',
    zxsjjs: '',
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 100
     this.getDate()
  }
  mounted() {
    this.$nextTick(()=>{
 this.getLists()
    })
   
    this.sexList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT
    this.patientTypeList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_PATIENT_DICT : this.$store.state.webSqlDict.TABLE_PATIENT_DICT
    this.deptList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DEPT_DICT : this.$store.state.webSqlDict.DEPT_DICT
  }

  private getLists() {
    ;(this.$refs.pageTable as any).getList()
  }
  // 查询
  private handleSearch() {
    this.getLists()
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
      this.searchData.zxsjks = parseTime(val[0], '{y}-{m}-{d}')
      this.searchData.zxsjjs = parseTime(val[1], '{y}-{m}-{d}')
    } else {
      this.searchData.zxsjks = ''
      this.searchData.zxsjjs = ''
    }
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
