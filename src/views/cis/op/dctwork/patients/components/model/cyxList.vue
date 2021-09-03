<template>
<!-- 常用项 -->
	<div>
			<el-table
					:data="tableDatas"
					border
					stripe
					:highlight-current-row="true"
					slot="list"
					@row-dblclick="handleChange"
					class="scroll-bar no-underline"
					:height="listSlotHeight"
			>
				<el-table-column
						prop="xmmc"
						:label="$t('项目名称')"
						min-width="120"
						show-overflow-tooltip
				>
				</el-table-column>
				<el-table-column
						prop="xmsl"
						:label="$t('数量')"
						width="50"
						class="text-blue-td"
				>
				</el-table-column>

			</el-table>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { dictExecuteSql } from '@/websql/functions'
import { findListByZtbhXm, queryPage } from '@/api/his/im/residentDoctor/drugItemHelper.ts'

@Component({
  name: 'CyxList'

})
export default class extends Vue {
  @Prop({ required: true }) private searchData!: any
  private tableDatas: Array<any> = []
  private listSlotHeight: number = 0
  private searchDataCyx: any = {
    ztbh: ''
  }


  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 280
  }

  mounted() {
    this.queryPage()
  }

  private queryPage() {
    const params: any = {
      ztlb: 4,
      sslb: 4
    }
    queryPage(params).then((res: any) => {
      if(res.errorCode == "SUCCESS") {
        console.log(res.data)
        this.searchDataCyx.ztbh = res.data.list[0].ztbh
        this.getList()
      }
    })
  }

  private getList() {
    if(!this.searchData.ztbh) {
      return 
    }
    findListByZtbhXm(this.searchDataCyx).then((res: any) => {
      if(res.errorCode == "SUCCESS") {
        this.tableDatas = res.data
      }
    })
  }

  private handleChange(row:any) {
    this.$emit('cyxSet',row)
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
