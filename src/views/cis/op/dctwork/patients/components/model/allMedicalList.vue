<template>
	<!-- 全部药品 -->
	<div>
		<pagenation-list
				class="ht"
				ref="pageTable"
				data-url="/drug-service/ypsrf/queryDrugsTypk"
				v-model="tableDatas"
				:searchData="searchData"
				:pageProps="{ layout: 'prev, pager, next' }"
				:list-height="listSlotHeight"
				http-method="post">
			<el-table
					slot="list"
					:data="tableDatas"
					@row-dblclick="handleDbclick"
					border
					highlight-current-row
					stripe
					:height="listSlotHeight"
					class="scroll-bar"
			>
				<el-table-column prop="ypmc" label="药品名称" min-width="140" show-overflow-tooltip></el-table-column>
				<el-table-column prop="yfgg" label="药房规格" show-overflow-tooltip></el-table-column>
				<el-table-column prop="yfdw" label="单位" width="50"></el-table-column>
			</el-table>
		</pagenation-list>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { dictExecuteSql } from '@/websql/functions'

@Component({
  name: 'AllMedicalList'
})
export default class extends Vue {
  @Prop({ required: true }) private searchData!: any
  private tableDatas: Array<any> = []

  private listSlotHeight: number = 0


  // @Watch('searchData',{immediate:true,deep:true})
  // private searchDataChange(val:any) {
  //   if (val) {
  //     this.getList()
  //   }
  // }


  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 270
  }


  mounted() {
	console.log(59,this.searchData.yfsb)
	if(this.searchData && this.searchData.cflx) {
		if (this.searchData.yfsb == 1) {
			this.$set(this.searchData,'cflx',[1,2])
		} else {
			this.$set(this.searchData,'cflx',[3])
		}
	}
    // this.getList()
  }

  private getList() {
	console.log('456')
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private searchList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

  // 双击插入一条药品
  private handleDbclick(row: any) {
    this.$emit('setObjInput', row)
  }

  private getSearchList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
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
