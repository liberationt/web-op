// 急诊预检分诊

<template>
  <div class="content">
    <div class="his-module his-small his-triage">
      <div slot="header" class="row">
        <div class="title">预检分诊登记表</div>
        <el-divider direction="vertical"></el-divider>
        <div class="label">
          <div class="heading">日期</div>
          <el-date-picker
          v-model="searchData.dateValue"
          value-format="yyyy-MM-dd"
          type="daterange"
          placeholder="选择日期"
          class="form-input date-wrapper"
          :style="{width: '240px !important'}"
          ></el-date-picker>
        </div>
        <div class="label">
          <div class="heading">分诊级别</div>
          <el-select v-model="searchData.brpj" :placeholder="'请选择'" @change="handleSelLevel" clearable>
            <el-option v-for="item in patientLevel" :key="item.dv" :value="item.dv" :label="item.dn"></el-option>
          </el-select>
        </div>
        <el-divider direction="vertical"></el-divider>
        <div class="btn">
          <el-button size="mini" type="text" @click="getList">
            <i class="icon his-btn-save blue"></i>
            <span>查询</span>
          </el-button>
        </div>
      </div>
      <pagenation-list ref="pageTable" v-model="list" data-url="/op-service/erpreyjfz/queryPage" http-method="post" :list-height="listSlotHeight" :searchData="searchData">
        <el-table :data="tableFormat" stripe border class="scroll-bar" :height="listSlotHeight" slot="list" :highlight-current-row="true">
          <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
          <el-table-column prop="lzsj" width="130" align="center" label="来诊日期"></el-table-column>
          <el-table-column prop="xm" width="72" align="center" label="姓名"></el-table-column>
          <el-table-column prop="csny" width="100" align="center" label="出生日期">
            <template slot-scope="scope">
              {{ scope.row.csny | filterTime }}
            </template>
          </el-table-column>
          <el-table-column prop="xbName" width="56" align="center" label="性别"></el-table-column>
          <el-table-column prop="nl" width="72" align="center" label="年龄"></el-table-column>
          <el-table-column prop="xxzz" width="100" align="center" label="现住址">
            <!-- <template slot-scope="props">
              <span>{{ props.row.xzzsfName + props.row.xzzsName + props.row.xzzxName }}</span>
            </template> -->
          </el-table-column>
          <el-table-column prop="lxfs" width="100" align="center" label="联系方式"></el-table-column>
          <el-table-column prop="lyfsName" width="80" align="center" label="来院方式"></el-table-column>
          <el-table-column prop="zs" min-width="200" align="center" label="主诉" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="tw" width="60" align="center" label="体温"></el-table-column>
          <el-table-column prop="mb" width="60" align="center" label="脉搏"></el-table-column>
          <el-table-column prop="hx" width="60" align="center" label="呼吸"></el-table-column>
          <el-table-column prop="xy" width="80" align="center" label="血压">
            <template slot-scope="props">
              <span>{{ props.row.xyszy + ' / ' + props.row.xyssy }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="xybhd" width="72" align="center" label="血氧饱和度"></el-table-column>
          <el-table-column prop="ysztName" width="82" align="center" label="意识状态"></el-table-column>
          <el-table-column prop="sewspf" width="72" align="center" label="MEWS评分"></el-table-column>
          <el-table-column prop="ttpf" width="72" align="center" label="疼痛评分"></el-table-column>
          <el-table-column prop="brpjName" width="110" align="center" label="分诊级别"></el-table-column>
          <el-table-column prop="fzksdmName" width="72" align="center" label="分诊科室"></el-table-column>
          <el-table-column prop="ysdmName" width="72" align="center" label="医生"></el-table-column>
          <el-table-column prop="fzhsdmName" width="72" align="center" label="护士"></el-table-column>
          <el-table-column prop="lksj" width="140" align="center" label="离开时间"></el-table-column>
          <el-table-column prop="qxName" width="72" align="center" label="去向"></el-table-column>
          <el-table-column prop="tlsj" width="72" align="center" label="停留时间">
            <template slot-scope="props">
              <span v-if="props.row.tlsj">{{ props.row.tlsj + '分'}}</span>
            </template>
          </el-table-column>
        </el-table>
      </pagenation-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { getFloat, mul, parseTime, id2Name,formatDate, formatBeginDay } from '@/utils'
import { aQueryCard } from '@/api/his/op/reg/addPatient.ts'
import { aQueryDeptSchDoc } from '@/api/his/op/reg/registerManage.ts'
import { queryList, addTriage } from '@/api/ecis/pretriage/basic.ts'
import { getNow } from '@/api/his/basic'
import { AxiosResponse } from 'axios'
import { Form } from 'element-ui'
import dayjs from 'dayjs'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'Triage',
  components: {},
})
export default class extends Vue {
  private listSlotHeight: number = 0

  private list: any[] = []
  private searchData: any = {
    dateValue: [],
  }
  private sexList: any[] = [] //性别字典
  private patientLevel: any[] = [] // 病人级别
  private addressList: any[] = [] // 地址字典
  private tohospital: any[] = [] // 来院方式
  private realizeList: any[] = [] // 意识状态
  private ksList: any[] = [] // 分诊科室
  private toWhereList: any = [] // 病人去向
  private ysList: any = [] //医生字典
  private fzhsList: any = [] //护士字典
  private daterange: any[] = []
  get tableFormat() {
    const tabledata = this.list
    id2Name(tabledata, 'xb', 'xbName', this.sexList, 'dv', 'dn')
    id2Name(tabledata, 'lyfs', 'lyfsName', this.tohospital, 'dv', 'dn')
    id2Name(tabledata, 'yszt', 'ysztName', this.realizeList, 'dv', 'dn')
    id2Name(tabledata, 'fzksdm', 'fzksdmName', this.ksList, 'dv', 'dn')
    id2Name(tabledata, 'brpj', 'brpjName', this.patientLevel, 'dv', 'dn')
    id2Name(tabledata, 'qx', 'qxName', this.toWhereList, 'dv', 'dn')
    id2Name(tabledata, 'ysdm', 'ysdmName', this.ysList, 'dv', 'dn')
    id2Name(tabledata, 'fzhsdm', 'fzhsdmName', this.fzhsList, 'dv', 'dn')
    return tabledata
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 62 - 43
  }

  mounted() {
    this.sexList =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT :this.$store.state.webSqlDict.SEX_DICT
    this.tohospital =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TO_HOS_TYPE_DICT :this.$store.state.webSqlDict.TO_HOS_TYPE_DICT
    this.realizeList =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REALIZE_TYPE_DICT :this.$store.state.webSqlDict.REALIZE_TYPE_DICT
    this.patientLevel =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.PATIENT_TYPE_DICT :this.$store.state.webSqlDict.PATIENT_TYPE_DICT
    this.ksList =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REGISTERATION_DEPARTMENT_DICT :this.$store.state.webSqlDict.REGISTERATION_DEPARTMENT_DICT
    this.toWhereList =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TOWHERE_TYPE_DICT :this.$store.state.webSqlDict.TOWHERE_TYPE_DICT
    this.ysList =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT :this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.fzhsList =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT :this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.searchData.lzsjStart = formatBeginDay(formatDate(1).substring(0,7))
    this.searchData.lzsjEnd = formatDate(1)
    this.searchData.dateValue = [this.searchData.lzsjStart, this.searchData.lzsjEnd]
    this.getList()
  }
  @Watch('searchData.dateValue')
      private onDateChange(val: any) {
        if (val) {
          this.searchData.lzsjStart = val[0]
          this.searchData.lzsjEnd = val[1]
        } else {
          this.searchData.lzsjStart = ''
          this.searchData.lzsjEnd = ''
        }
      }
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 选择分诊级别
  private handleSelLevel(){
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.his-triage {
  ::v-deep .row {
      justify-content: start;
  }
  .label {
    display: inline-flex;
    align-items: center;
    .heading {
        margin: 0 10px;
    }
  }
  .el-divider--horizontal {
    margin: 10px 0;
  }
}
</style>
