/*
  @Author: liuhua
  @Time  : 2021-1-27
  @Desc  : 门急诊日志
 */
<template>
  <div class="content">
    <div class="his-module his-small his-triage">
      <div slot="header" class="row">
        <div class="label">
          <div class="querySearch">
            <span class="searchTitle">就诊日期</span>
            <el-date-picker
              v-model="searchData.dateValue"
              value-format="yyyy-MM-dd"
              type="daterange"
              placeholder="选择日期"
              class="form-input date-wrapper"
              :style="{width: '240px !important'}"
              ></el-date-picker>
          </div>
          <div class="querySearch">
            <span class="searchTitle">科室</span>
            <search-select
            table-name="SYS_DICT_CONFIG"
            kid="15"
            v-model="searchData.sqks"
            :placeholder="$t('请选择')"
            :backfillValue="searchData.sqks"
            filterable
            clearable
            style="margin-left:10px"
          />
          </div>
          <div class="querySearch">
            <span class="searchTitle">医生</span>
            <search-select
            table-name="SYS_DICT_CONFIG"
            kid="15"
            v-model="searchData.sqys"
            :placeholder="$t('请选择')"
            :backfillValue="searchData.sqys"
            filterable
            clearable
            style="margin-left:10px"
          />
          </div>
          <div class="querySearch">
            <el-radio-group v-model="searchData.zt">
            <el-radio  label="1">全部</el-radio>
            <el-radio  label="2">门诊</el-radio>
            <el-radio  label="3">急诊</el-radio>
          </el-radio-group>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div class="btn">
            <el-button size="mini" type="text" @click="getList">
              <i class="icon his-caozuo_search blue"></i>
              <span>查询</span>
            </el-button>
            <el-button size="mini" type="text" @click="getList">
              <i class="icon his-btn-print green"></i>
              <span>打印</span>
            </el-button>
          </div>
        </div>
      </div>
        <el-table :data="tableFormat" stripe border class="scroll-bar" :height="listSlotHeight + 32" slot="list" :highlight-current-row="true">
          <el-table-column prop="lzsj" width="130" align="center" label="日期"></el-table-column>
          <el-table-column prop="xm" width="72" align="center" label="姓名"></el-table-column>
          <el-table-column prop="csny" width="100" align="center" label="出生日期">
            <template slot-scope="scope">
              {{ scope.row.csny | filterTime }}
            </template>
          </el-table-column>
          <el-table-column prop="xbName" width="56" align="center" label="性别"></el-table-column>
          <el-table-column prop="nl"     width="72" align="center" label="年龄"></el-table-column>
          <el-table-column prop="mzh"    width="100" align="center" label="门急诊号"></el-table-column>
          <el-table-column prop="brzy"   width="100" align="center" label="职业"></el-table-column>
          <el-table-column prop="jtdz" width="100" align="center" label="家庭地址"></el-table-column>
          <el-table-column prop="lxdh" width="100" align="center" label="联系电话"></el-table-column>
          <el-table-column prop="zytz" width="150" align="center" label="主要症状和体征"></el-table-column>
          <el-table-column prop="zd" min-width="200" align="center" label="初步诊断" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="yqbg" width="60" align="center" label="疫情报告"></el-table-column>
          <el-table-column prop="cfz" width="60" align="center" label="初诊/复诊"></el-table-column>
          <el-table-column prop="ys" width="60" align="center" label="医生"></el-table-column>
        </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { id2Name,formatDate, formatBeginDay } from '@/utils'
import { Form } from 'element-ui'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'Triage',
  components: {},
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private list: any[] = [
    {lzsj: '2016-05-02',xm: '刘华',csny: '2020-05-02',xb: '男',nl: '21',mzh: '010203',brzy: '工人',jtdz: '上海南京东路',lxdh: '1336668888',zytz: '感冒发烧',yqbg: '',cfz: '初诊',ys: '方医生'}
  ]
  private searchData: any = {
    dateValue: [],
  }
  private sexList: any[] = [] //性别字典
  private ksList: any[] = [] // 分诊科室
  private ysList: any = [] //医生字典
  private daterange: any[] = []
  get tableFormat() {
    const tabledata = this.list
    id2Name(tabledata, 'xb', 'xbName', this.sexList, 'dv', 'dn')
    id2Name(tabledata, 'fzksdm', 'fzksdmName', this.ksList, 'dv', 'dn')
    id2Name(tabledata, 'ysdm', 'ysdmName', this.ysList, 'dv', 'dn')
    return tabledata
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 62 - 43
  }

  mounted() {
    this.sexList =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT :this.$store.state.webSqlDict.SEX_DICT
    this.ksList =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REGISTERATION_DEPARTMENT_DICT :this.$store.state.webSqlDict.REGISTERATION_DEPARTMENT_DICT
    this.ysList =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT :this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.searchData.lzsjStart = formatBeginDay(formatDate(1).substring(0,7))
    this.searchData.lzsjEnd = formatDate(1)
    this.searchData.dateValue = [this.searchData.lzsjStart, this.searchData.lzsjEnd]
    // this.getList()
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

  private goNurseHome () {

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

