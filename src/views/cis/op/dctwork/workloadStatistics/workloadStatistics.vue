 <!--线上工作量统计-->
<template>
  <div class="content">
    <div class="his-module his-small">
      <div slot="header" class="row">
        <div class="label">
          <span class="his-title">工作量统计</span>
          <el-divider direction="vertical"></el-divider>
          <span class="tag">挂号时间</span>
          <el-date-picker v-model="dateRange" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始时间" end-placeholder="结束时间" clearable class="date-wrapper" style="width: 220px;"></el-date-picker>
          <!-- <span class="tag">医生姓名</span>
          <el-input placeholder="请选择" v-model="searchData.keyword" style="width: 170px;" @keyup.enter.native="searchList"></el-input>
          <el-divider direction="vertical"></el-divider> -->
          <div class="btn">
            <el-button size="mini" type="text" @click="getList"><i class="icon his-search"></i>查询</el-button>
          </div>
        </div>
      </div>
      <div>
          <div class="his-work">
              <p class="his_title">{{this.userInfo.hospitalName}}门诊医生工作量</p>
              <table  border="1" cellpadding="0" style="border-collapse: collapse; border: 1px solid #000; width: 100%">
                  <tr style="width: 100%">
                      <td>总人次：{{workloadList.totalPerson ? workloadList.totalPerson : 0}} 人</td>
                      <td>医保人次：{{workloadList.totalYb ? workloadList.totalYb : 0}} 人</td>
                      <td>城保人次：{{workloadList.totalCb ? workloadList.totalCb : 0}} 人</td>
                  </tr>
                  <tr style="width: 100%">
                      <td>总金额：{{workloadList.totalPrice ? workloadList.totalPrice : '0.00'}} 元</td>
                      <td>医保处方总金额：{{workloadList.ybTotalPrice ? workloadList.ybTotalPrice : '0.00'}} 元</td>
                      <td>城保处方总金额：{{workloadList.cbTotalPrice ? workloadList.cbTotalPrice : '0.00'}} 元</td>
                  </tr>
                  <tr style="width: 100%">
                      <td>均次费：{{workloadList.avgPrice ? workloadList.avgPrice : '0.00'}} 元</td>
                      <td>医保均次费：{{workloadList.avgYbTotalPrice ? workloadList.avgYbTotalPrice : '0.00'}} 元</td>
                      <td>城保均次费：{{workloadList.avgCbTotalPrice ? workloadList.avgCbTotalPrice : '0.00'}} 元</td>
                  </tr>
                  <tr style="width: 100%">
                      <td>总药费：{{workloadList.drugPrice ? workloadList.drugPrice : '0.00'}} 元</td>
                      <td>医保总药费：{{workloadList.ybTotalDrugPrice ? workloadList.ybTotalDrugPrice : '0.00'}} 元</td>
                      <td>城保总药费：{{workloadList.cbTotalDrugPrice ? workloadList.cbTotalDrugPrice : '0.00'}} 元</td>
                  </tr>
                  <tr style="width: 100%">
                      <td>均次药费：{{workloadList.avgDrugPrice ? workloadList.avgDrugPrice : '0.00'}} 元</td>
                      <td>医保均次药费：{{workloadList.avgYbTotalDrugPrice ? workloadList.avgYbTotalDrugPrice : '0.00'}} 元</td>
                      <td>城保均次药费：{{workloadList.avgCbTotalDrugPrice ? workloadList.avgCbTotalDrugPrice : '0.00'}} 元</td>
                  </tr>
                  <tr style="width: 100%">
                      <td>总检查费：{{workloadList.jcPrice ? workloadList.jcPrice : '0.00'}} 元</td>
                      <td>城保药占比：{{workloadList.cbDrugPriceProportion ? workloadList.cbDrugPriceProportion : '0.00'}}</td>
                      <td>抗菌处方比：{{workloadList.kjCfProportion ? workloadList.kjCfProportion : '0.00'}}</td>
                  </tr>
                  <tr style="width: 100%">
                      <td>农合处方总金额：{{workloadList.nhTotalPrice ? workloadList.nhTotalPrice : '0.00'}} 元</td>
                      <td>农合人次：{{workloadList.totalNh ? workloadList.totalNh : '0.00'}} 次</td>
                      <td>农合均次费：{{workloadList.avgNhTotalPrice ? workloadList.avgNhTotalPrice : '0.00'}} 元</td>
                  </tr>
                  <tr style="width: 100%">
                      <td>农合总药费：{{workloadList.nhTotalDrugPrice ? workloadList.nhTotalDrugPrice : '0.00'}} 元</td>
                      <td>农合处方均次费：{{workloadList.avgNhTotalDrugPrice ? workloadList.avgNhTotalDrugPrice : '0.00'}} 元</td>
                      <td>药占比：{{workloadList.nhDrugPriceProportion ? workloadList.nhDrugPriceProportion : '0.00'}}</td>
                  </tr>
              </table>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { getNow } from '@/api/his/basic'
import { parseTime,id2Name } from '@/utils'
import Table from '@/components/Temperature/Table.vue'
import { getWorkloadData } from '@/api/cis/op/dctwork/patients'

@Component({
  components: { Table },
  name: 'workloadStatistics',
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
	private workloadList: any = {
		avgCbTotalDrugPrice: '', //城保均次药费	
		avgCbTotalPrice: '', //城保均次费	
		avgDrugPrice: '', //均次药费	
		avgNhTotalDrugPrice: '', //农合均次药费	
		avgNhTotalPrice: '', //农合均次费	
		avgPrice: '', //均次费	
		avgYbTotalDrugPrice: '', //医保均次药费	
		avgYbTotalPrice: '', //医保均次费	
		cbDrugPriceProportion: '', //城保药占比	
		cbTotalDrugPrice: '', //城保总药费	
		cbTotalPrice: '', //城保总金额	
		drugPrice: '', //总药费	
		jcPrice: '', //总检查费	
		kjCfProportion: '', //抗菌处方比	
		nhDrugPriceProportion: '', //农合药占比	
		nhTotalDrugPrice: '', //农合总药费	
		nhTotalPrice: '', //农合总金额	
		totalCb: '', //城保人次	
		totalNh: '', //农合人次	
		totalPerson: '', //总人次	
		totalPrice: '', //总金额	
		totalYb: '', //医保人次	
		ybTotalDrugPrice: '', //医保总药费	
		ybTotalPrice: '', //医保总金额	
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
    this.sexList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT
    this.patientTypeList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_PATIENT_DICT : this.$store.state.webSqlDict.TABLE_PATIENT_DICT
    this.doctorList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.deptList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DEPT_DICT : this.$store.state.webSqlDict.DEPT_DICT

  }

	// 获取工作量统计数据
	private getList() {
		const params: any = {
			ghsjjs: this.dateRange[1],
			ghsjks: this.dateRange[0],
			jzks: Vue.prototype.AUTHORITY.bussinessRole,
			jzys: this.userInfo.userId,
		}
		getWorkloadData(params).then((res: any)=>{
      this.workloadList = JSON.parse(JSON.stringify(res.data)) 
		})
	}

  get userInfo() {
    return JSON.parse(localStorage.userInfo)
  }

  private getDate() {
    getNow().then((res: any)=> {
			let date = parseTime(res.data, '{y}-{m}-{d}')
			this.dateRange = [date,date]
		})
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

td{
    font-size: 13px; border: 1px solid #000; height: 40px; padding-left: 5px
}
.his-work{
    padding: 50px 90px;
}
.his_title {
	text-align: center;
	font-size: 20px;
	padding-bottom: 20px;
}
</style>
