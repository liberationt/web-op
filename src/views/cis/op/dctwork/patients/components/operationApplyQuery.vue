<!--
 * @Date: 2020-12-02 16:18:41
 * @LastEditors: zhml/liuhua
 * @LastEditTime: 2020-05-29 20:46:37
 * @description:  病历首页 -手术申请单查询
-->
<template>
	<div class="his-module his-small hide-scroll his-query">
		<pagenation-list
				ref="pageTable"
				v-model="tableData"
				data-url="/mms-service/operation/apply/list"
				http-method="post"
				:list-height="listSlotHeight+ 180"
				:searchData="searchData"
		>
			<div slot="header" class="row">
				<div class="label">
          <span>申请手术日期</span>
          <el-date-picker
              style="margin-left:8px"
              class="date-wrapper"
              v-model="searchData.dateValue"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
                @change="getLists"
              value-format="yyyy-MM-dd"
              size="mini"
              :style="{width: '200px !important'}"
          ></el-date-picker>
          <span style="margin-left:10px">手术医生</span>
          <search-select
            table-name="SYS_DICT_CONFIG"
            kid="17"
            v-model="searchData.ssys"
            :placeholder="$t('请选择')"
            :backfillValue="searchData.ssys"
            filterable
            @change="getLists"
            clearable
            style="margin-left:10px"
          />
          <el-radio-group v-model="searchData.spbz"  @change="getLists" style="display:flex">
            <el-radio :label="0">未审批</el-radio>
            <el-radio :label="1">已审批</el-radio>
            <el-radio :label="-1">全部</el-radio>
          </el-radio-group>
          <el-divider direction="vertical"></el-divider>
							<div class="btn">
								<el-button size="mini" type="text" @click="getLists" class="his-action">
									<i class="his-caozuo_search icon"></i>
									{{'查询'}}
								</el-button>
								<el-button size="mini" type="text">
									<i class="his-btn-print icon"></i>
									{{'打印'}}
								</el-button>
							</div>
				</div>
			</div>

			<el-table
					:data="tableFormat"
					border
					:fit="true"
					stripe
					:highlight-current-row="true"
					slot="list"
					:height="listSlotHeight - 210"
					class="scroll-bar"
			>
				<el-table-column label prop="webSortNumber" width="32" align="center"></el-table-column>
        <el-table-column prop="sqrq" label="预约手术时间" :show-overflow-tooltip="true" min-width="150"></el-table-column>
        <el-table-column prop="sqdh" label="申请单号"></el-table-column>
        <el-table-column prop="brxm" label="患者姓名"></el-table-column>
        <el-table-column prop="brxbName" :label="'性别'" width="45"></el-table-column>
        <el-table-column prop="brnl" label="年龄" width="45"></el-table-column>
        <el-table-column prop="brksName" label="患者科室"></el-table-column>
        <el-table-column prop="sqzd" label="诊断" :show-overflow-tooltip="true" min-width="100"></el-table-column>
        <el-table-column prop="ssmc" label="手术名称" :show-overflow-tooltip="true" min-width="130"></el-table-column>
        <el-table-column prop="ssrq" label="安排手术时间" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="ssjbName" label="手术等级"></el-table-column>
        <el-table-column prop="ssysName" label="手术医师"></el-table-column>
        <el-table-column prop="ssyzName" label="手术一助"></el-table-column>
        <el-table-column prop="ssezName" label="手术二助"></el-table-column>
        <el-table-column prop="ssszName" label="手术三助"></el-table-column>
        <el-table-column prop="sszsName" label="手术四助"></el-table-column>
        <el-table-column prop="mzysName" label="麻醉医师"></el-table-column>
        <el-table-column prop="mzmcName" label="麻醉方法"></el-table-column>
        <el-table-column prop="sqysName" label="申请医师"></el-table-column>
        <el-table-column prop="sjysName" label="上级医生"></el-table-column>
        <el-table-column label="状态" width="60" prop="spbz">
          <template v-slot="scope">
            <span v-if="scope.row.zdssbz ==1">{{scope.row.spbz== "0"?"未审批":"已审批"}}</span>
          </template>
        </el-table-column>
        <el-table-column label="手术审批时间" prop="spsj" min-width="150"></el-table-column>
        <el-table-column label="审批人" prop="spysName"></el-table-column>
			</el-table>
		</pagenation-list>
	</div>

</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Iobject } from '@/api/cis/op/dctwork/operationApplyQuery.ts'
import { getNow } from '@/api/his/basic'
import { id2Name, parseTime,formatDate, formatBeginDay} from '@/utils'

@Component({
  name: 'operationApplyQuery'
})
export default class extends Vue {
  @Prop({ required: true }) private pnParam!: any
  private tableData: Array<any> = [] //申请单查询
  private listSlotHeight: number = 0
  private sexChoice: Array<any> = [] //性别
  private departMent: Array<any> = [] //科室
  private doctor: Array<any> = [] //医生
  private assistantOne: Array<any> = [] //一助
  private assistantTwo: Array<any> = [] //二助
  private assistantThree: Array<any> = [] //三助
  private Anesthesiologist: Array<any> = [] //麻醉医师
  private ApplyDoctor: Array<any> = [] //申请医师
  private superiorDoctor: Array<any> = []//上级医生
  private mzdmList: Array<[]> = [] //麻醉
  private Surgical: any[] = [] //手术级别
  private dateValue: any = ''
  @Watch('searchData.dateValue')
  private onDateChange(val: any) {
    if (val) {
      this.searchData.startDate = val[0]
      this.searchData.endDate = val[1]
    } else {
      this.searchData.startDate = ''
      this.searchData.endDate = ''
    }
  }
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
    // getNow().then((res: any) => {
    //   if(res){
    //     let date0 = parseTime(res.data, '{y}-{m}-{d}')
    //     let date1 = parseTime(res.data, '{y}-{m}-{d}')
    //     this.dateValue = [date0, date1]
    //   }
    // })
  }
  private searchData: any = {
    dateValue: [],
    brid: this.pnParam.brid,
    sqlx: 1,
    mzhm: this.pnParam.mzhm,
    brks: this.pnParam.brks,
    spbz: 0,
  }

  mounted() {
    this.searchData.startDate = formatDate(1)
    this.searchData.endDate = formatDate(1)
    this.searchData.dateValue = [this.searchData.startDate, this.searchData.endDate]
    this.getLists()
    this.sexChoice = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT :this.$store.state.webSqlDict.SEX_DICT
    this.departMent = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.OUTPATIENT_DEPARTMENT :this.$store.state.webSqlDict.OUTPATIENT_DEPARTMENT
    this.doctor = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT :this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.assistantOne = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT :this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.assistantTwo = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT :this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.assistantThree = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT :this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.Anesthesiologist = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT :this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.ApplyDoctor = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT :this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.superiorDoctor = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT :this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.mzdmList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.MZFF_DICT :this.$store.state.webSqlDict.MZFF_DICT
    this.Surgical = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SSJB_DICT :this.$store.state.webSqlDict.SSJB_DICT
  }

  //转换字典
  get tableFormat() {
    const tabledata = this.tableData
    id2Name(tabledata, 'brxb', 'brxbName', this.sexChoice, 'dv', 'dn')
    id2Name(tabledata, 'brks', 'brksName', this.departMent, 'dv', 'dn')
    id2Name(tabledata, 'ssys', 'ssysName', this.doctor, 'dv', 'dn')
    id2Name(tabledata, 'ssyz', 'ssyzName', this.assistantOne, 'dv', 'dn')
    id2Name(tabledata, 'ssez', 'ssezName', this.assistantTwo, 'dv', 'dn')
    id2Name(tabledata, 'sssz', 'ssszName', this.assistantThree, 'dv', 'dn')
    id2Name(tabledata, 'sszs', 'sszsName', this.assistantThree, 'dv', 'dn')
    id2Name(tabledata, 'mzys', 'mzysName', this.Anesthesiologist, 'dv', 'dn')
    id2Name(tabledata, 'sqys', 'sqysName', this.ApplyDoctor, 'dv', 'dn')
    id2Name(tabledata, 'sjys', 'sjysName', this.superiorDoctor, 'dv', 'dn')
    id2Name(tabledata, 'spys', 'spysName', this.superiorDoctor, 'dv', 'dn')
    id2Name(tabledata, 'mzmc', 'mzmcName', this.mzdmList, 'dv', 'dn') //麻醉方法
    id2Name(tabledata, 'ssjb', 'ssjbName', this.Surgical, 'dv', 'dn')
    return tabledata
  }

  //获取查询数据
  private getLists() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()

  }
}
</script>

<style lang="scss" scoped>
.his-query {
	margin-right: 0;
	padding: 4px 10px 8px 10px;

	.row {
		padding-bottom: 4px;

		.label {
			.searchTitle {
				padding-right: 0;
				font-family: siyuanMedium;
			}

			.el-divider--vertical {
				margin: 0 10px;
			}
		}
	}
}
</style>
