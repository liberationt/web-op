<!--
 * @Date: 2020-05-27 20:00:32
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-21 13:59:59
 * @description: 药品列表
-->

<template>
	<div class="his-module his-mini his-patient-recipe-medical">
		<pagenation-list
				class="ht"
				ref="pageTable"
				data-url="/op-service/ypsrf/queryMzYsFj"
				v-model="xmzttableData"
				:searchData="searchDataYplb"
				:pageProps="{ layout: 'prev, pager, next' }"
				:list-height="listSlotHeight"
				http-method="post">

			<el-table slot="list" :data="xmzttableData" @row-dblclick="openXMZTDetil" border highlight-current-row stripe :height="listSlotHeight - 8" class="scroll-bar">
				<el-table-column prop="fymc" label="费用名称" min-width="100" show-overflow-tooltip></el-table-column>
				<el-table-column prop="fydw" label="单位" width="50" show-overflow-tooltip></el-table-column>
				<el-table-column prop="fydj" class-name="text-blue-td" label="费用单价" show-overflow-tooltip></el-table-column>
				<el-table-column prop="pydm" label="拼音码"  show-overflow-tooltip></el-table-column>
			</el-table>
		</pagenation-list>
	</div>

</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  ISuiteTypeList,
  ISuiteDetail,
  enable,
  disEnable,
  searchDetailList
} from '@/api/cis/op/dctwork/examineSuite'

@Component({
  name: 'MedicalList'
})
export default class extends Vue {
  @Prop({ required: true }) private searchData!: any
  private tableDatas: Array<any> = []
  private pageProps: any = { layout: ' total,prev, next,jumper' }
  private listSlotHeight: number = 0
  private xmzttableData: Array<any> = []
  private isAddSec: boolean = true
  private pnParam: any = {}
  private searchDataYplb: any = {
    brxz: this.pnParam.brxz,
    query: '__',
    useType: 'MZSY'
  }

  created() {

    this.listSlotHeight = Vue.prototype.PageHeight - 276
  }

  mounted() {
    this.pnParam = this.$store.state.pnParam.PN_PARAM
    this.getList()
  }

  private getList() {
    if(this.searchData.pydm) {
      this.searchDataYplb.query = this.searchData.pydm
    } else {
      this.searchDataYplb.query = '__'
    }
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private searchList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

  private openXMZTDetil(val:any) {
	this.$emit('setAllData',val)
  }

}
</script>

<style lang="scss" scoped>
.his-patient-recipe-medical {
	padding: 0 !important;

	::v-deep .el-input {
		height: 28px !important;
	}
}

</style>
