<template>
<!-- 常用药 -->
	<div>
		<!-- <pagenation-list
				ref="pageTable"
				v-model="tableDatas"
				data-url="/op-service/opzt02/findListByZtbh"
				http-method="post"
				:list-height="listSlotHeight"
				:pageProps="{ layout: 'prev, pager, next' }"
				:searchData="searchDataCyy"
				optTrigger="true"
		> -->
			<el-table
					:data="tableDatas"
					border
					stripe
					:highlight-current-row="true"
					slot="list"
					@row-dblclick="handleLeftDblclick"
					class="scroll-bar no-underline"
					:height="listSlotHeight + 30"
			>
				<el-table-column
						prop="ypmc"
						:label="$t('药品名称')"
						min-width="80"
						show-overflow-tooltip
				>
				</el-table-column>
				<el-table-column
						prop="ypgg"
						:label="$t('规格')"
						width="50"
						show-overflow-tooltip
				>
				</el-table-column>
				<el-table-column
						prop="jldw"
						:label="$t('单位')"
						width="50"
						show-overflow-tooltip
				>
				</el-table-column>
				<!-- <el-table-column
						prop="ypsl"
						:label="$t('总量')"
						width="50"
						show-overflow-tooltip
				>
				</el-table-column> -->
			</el-table>
		<!-- </pagenation-list> -->
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { dictExecuteSql } from '@/websql/functions'
import { queryPage, queryDetail } from '@/api/cis/op/dctwork/examineSuite'
import { AxiosResponse } from 'axios'

@Component({
  name: 'CyyList'

})
export default class extends Vue {
  @Prop({ required: true }) private searchData!: any
  private tableDatas: Array<any> = []
  private listSlotHeight: number = 0
  private searchDataCyy: any = {
	ksid: Vue.prototype.AUTHORITY.bussinessRole,
	ztbh: '',
	ztlb: this.searchData.ztlb,
  }


  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 270
  }

  mounted() {
	console.log(78,this.searchData)
    
	this.queryPage()
  }
  
  private queryPage() {
	queryPage({ sslb: 4, ztlb: this.searchData.ztlb }).then((res: AxiosResponse) => {
      if (res.data.list.length > 0 && res.data.list[0].ztbh){
		this.searchDataCyy.ztbh = res.data.list[0].ztbh
		this.$nextTick(()=> {
			this.getList()
		})
      }
    })
  }
  
  private getList() {
    queryDetail(this.searchDataCyy).then((res: any) => {
		if(res.errorCode == "SUCCESS") {
			this.tableDatas = res.data
		}	
	})
  }

  private handleLeftDblclick(row: any) {
    this.$emit('cyySet',row)
  }

  private setObjInput(row: any) {
    this.$emit('setObjInput', row)
  }


}
</script>

<style lang="scss" scoped>
.patient {
	.el-table--border {
		th {
			height: 28px !important;
			line-height: 28px !important;
		}
	}
}

.content {
	.pagenation-list {
		width: 100%;
	}
}
</style>
