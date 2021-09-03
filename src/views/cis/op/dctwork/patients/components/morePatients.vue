<!--
 * @Date: 2020-05-22 09:33:32
 * @LastEditors: zhml
 * @LastEditTime: 2020-09-11 11:09:59
 * @description: 更多患者列表
-->
<template>
  <div class="content">
    <div class="his-module his-small">
      <pagenation-list ref="pageTable" v-model="tableDatas" data-url="/op-service/opghmx/queryPatientList" http-method="post" :searchData="searchData" :list-height="listSlotHeight">
        <div slot="header" class="row">
          <div class="label">
            <el-radio-group v-model="searchData.patientType" @change="searchList" style="width: 225px">
              <el-radio label="1">待诊</el-radio>
              <el-radio label="2">{{ $t('patients.zz') }}</el-radio>
              <el-radio label="3">{{ $t('patients.sz') }}</el-radio>
              <el-radio label="0">全部</el-radio>
            </el-radio-group>
            <el-divider direction="vertical"></el-divider>
            <el-checkbox 
              true-label='1' 
              false-label='0' 
              v-model="searchData.myPat"  
              @change="searchList" 
              :disabled="searchData.patientType== 1 || searchData.patientType== 2" 
              :checked='true'
            >我的病人</el-checkbox>
            <el-divider direction="vertical"></el-divider>
            <el-input placeholder="请输入卡号" v-model="searchData.jzkh" style="width: 170px" @keyup.enter.native="searchList"></el-input>
            <div>
              <el-button type="primary" class="his-patient-btn" style="height: 30px; width: 58px; padding: 10px 14px">{{ $t('patients.dk') }}</el-button>
            </div>
            <el-divider direction="vertical"></el-divider>
            <span class="tag">就诊日期</span>
            <el-date-picker
              v-model="jzrq"
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :clearable="false"
              class="date-wrapper"
              style="width: 220px"
            ></el-date-picker>
            <span class="tag" style="margin-left: 10px">患者姓名</span>
            <el-input placeholder="请输入姓名搜索" v-model="searchData.hzxm" style="width: 170px" @keyup.enter.native="searchList"></el-input>
            <div class="btn">
              <el-button size="mini" type="text" @click="handleSearch">
                <i class="icon his-search"></i>搜索
              </el-button>
            </div>
          </div>
        </div>

        <el-table 
          :data="tableFormat" 
          border 
          stripe 
          :highlight-current-row="true" 
          slot="list" 
          @row-dblclick="handleLeftDblclick" 
          :height="listSlotHeight - 10" 
          @row-click="handleRowClick" 
          class="scroll-bar no-underline"
          tooltip-effect="light"
        >
          <!-- 序号 -->
          <el-table-column prop="pdxh" :label="$t('排队号')" align="center" width="52"></el-table-column>
          <!-- 就诊状态 -->
          <el-table-column prop="jzzt" :label="$t('状态')" width="60">
            <template slot-scope="scope">
              <div :class="scope.row.jzzt | filterColor">{{ scope.row.jzzt | filterStatus }}</div>
            </template>
          </el-table-column>
          <!-- 就诊卡号 -->
          <el-table-column prop="jzkh" :label="$t('patients.jzkh')" width="100"> </el-table-column>
          <!-- 档案号码 -->
          <el-table-column show-overflow-tooltip prop="mzhm" :label="$t('档案号码')" min-width="70" />
          <!-- 就诊流水号 -->
          <el-table-column show-overflow-tooltip prop="jzlsh" :label="$t('就诊流水号')" min-width="100" />
          <!-- 姓名 -->
          <el-table-column prop="brxm" :label="$t('patients.hzxm')" width="80" show-overflow-tooltip/>
          <!-- 性别 -->
          <el-table-column prop="brxbName" label="性别" width="70"> </el-table-column>
          <!-- 年龄 -->
          <el-table-column prop="nl" label="年龄" width="70" />
          <!-- 性质 -->
          <el-table-column show-overflow-tooltip prop="brxzName" :label="$t('patients.hzxz')" min-width="100"> </el-table-column>
          <!-- 挂号时间 -->
          <el-table-column show-overflow-tooltip prop="ghsj" :label="$t('patients.ghsj')" min-width="120" />
          <!-- 挂号类型 -->
          <el-table-column show-overflow-tooltip prop="ghlx" label="挂号类型" min-width="90">
            <template slot-scope="scope">
              <span>{{ scope.row.ghlx | filterYw }}</span>
            </template>
          </el-table-column>
          <!-- 业务类型 -->
          <el-table-column show-overflow-tooltip prop="ywlx" label="业务类型" min-width="90">
            <template slot-scope="scope">
              <span>{{ scope.row.ywlx | filterGh }}</span>
            </template>
          </el-table-column>
          <!-- 就诊医生 -->
          <el-table-column prop="jzysName" label="接诊医生" min-width="80" align="left" />
          <!-- 接诊时间 -->
          <el-table-column show-overflow-tooltip prop="jzsj" label="接诊时间" min-width="120"/>
          <!-- 束诊时间 -->
          <el-table-column show-overflow-tooltip prop="szsj" label="束诊时间" min-width="120"/>
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
  name: 'MorePatients',
  filters: {
    filterColor(value: number) {
      switch (value) {
        case 0:
          return 'blues'
        case 1:
          return 'greens'
        case 2:
          return 'yellow'
        case 9:
          return 'reds'
      }
    },
    filterStatus(value: number) {
      switch (value) {
        case 0:
          return '待诊'
        case 1:
          return '诊中'
        case 2:
          return '暂诊'
        case 9:
          return '束诊'
      }
    }
  }
})
export default class extends Vue {
  private tableDatas: any[] = []
  private listSlotHeight: number = 0
  private sexList: Array<any> = [] //性别
  private patientTypeList: Array<any> = [] //患者性质
  private doctorList: Array<any> = [] //医生
  private deptList: Array<any> = [] //科室
  private jzrq: Array<any> = [] // 就诊日期
  private searchData: any = {
    patientType: '1',
    jzkh: '',
    ksdm: Vue.prototype.AUTHORITY.outpatientCode,
    ghks: Vue.prototype.AUTHORITY.bussinessRole,
    nowDate: this.jzrq[0],
    nowDateEnd: this.jzrq[1],
    hzxm: '',
    myPat: 1
  }
  get tableFormat() {
    const tabledata = this.tableDatas
    id2Name(tabledata, 'brxb', 'brxbName', this.sexList, 'dv', 'dn')
    id2Name(tabledata, 'brxz', 'brxzName', this.patientTypeList, 'dv', 'dn')
    id2Name(tabledata, 'jzys', 'jzysName', this.doctorList, 'dv', 'dn')
    id2Name(tabledata, 'zsid', 'zsidName', this.doctorList, 'dv', 'dn')
    return tabledata
  }

  // @Watch('tableDatas', { immediate: true, deep: true })
  // private tableDatasChange(val: any) {
  //   val.forEach((element: any) => {
  //     const patientList: any = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_PATIENT_DICT : this.$store.state.webSqlDict.TABLE_PATIENT_DICT
  //     // console.log('element', element, 'sssss', patientList)
  //     patientList.forEach((item: any) => {
  //       if (item.dv == element.brxz) {
  //         return item.dn + ''
  //       } else {
  //         return element.brxz
  //       }
  //     })
  //   })
  // }
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 100
  }
  mounted() {
    if (this.$route.query) {
      this.searchData = Object.assign(this.searchData,this.$route.query)
      console.log(this.searchData)
      this.getNow()
    }
    this.sexList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT
    this.patientTypeList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_PATIENT_DICT : this.$store.state.webSqlDict.TABLE_PATIENT_DICT
    this.doctorList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.deptList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DEPT_DICT : this.$store.state.webSqlDict.DEPT_DICT
  }
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private searchList() {
    this.searchData.nowDate = this.jzrq[0]
    this.searchData.nowDateEnd = this.jzrq[1]
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }
  /**
   * @LastEditors: zhml
   * @Description: 双击，切换病人
   * @param: {type} params
   * @return:
   */
  private handleLeftDblclick(val: any) {
    let ysid = JSON.parse(localStorage.getItem('userInfo') as string).userId
    if(val.jzzt == 9 && val.jzys != ysid) return this.$message.warning('非本医生的患者不可操作！')
    console.log(val)
    let obj: any = localStorage.getItem('userAuthority')
    let param: any = Object.assign({}, val)
    param.ghxh = val.sbxh
    this.$set(param,"morePatient",1) // 用于区分是从左侧带入的患者还是更多患者列表中带出
    this.$router.push({ path: '/patients', query: param })
  }

  private handleRowClick(val: any) {
    console.log(val)
  }

  // 查询
  private handleSearch() {
    this.searchList()
  }

  // 获取当前时间
  private getNow(){
    getNow().then((res: any) => {
      if(res){
        var date = parseTime(res.data, '{y}-{m}-{d}')
        // var date1 = parseTime(res.data, '{y}-{m}-01')
        this.jzrq = [date,date]
        this.searchData.nowDate = this.jzrq[0]
        this.searchData.nowDateEnd = this.jzrq[1]
        this.getList()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-radio {
  margin-right: 10px;
  .el-radio__label {
    padding-left: 4px;
  }
}

.his-small .row .label .tag{
  padding-left: 0;
}

.his-small .row .label .el-input::v-deep .el-input__inner{
  width: 160px;
}
</style>
