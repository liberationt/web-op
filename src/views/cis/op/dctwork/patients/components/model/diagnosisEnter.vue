<template>
	<div>
		<div class="header-row" slot="header">
			<div class="label">搜索</div>
			<div class="row-input">
				<el-input
						v-model="searchData.pydm"
						:placeholder="$t('请输入拼首查询')"
						@keydown.native.enter="getList"
						clearable
				>
					<i slot="prefix" class="el-input__icon icon his-search"></i>
				</el-input>
			</div>
		</div>
		<!-- <dict-list
			:listSlotHeight="listSlotHeight"
			:resultTableHeader="headerArray"
			:queryData="searchData.pydm"
			@setObjInput="setObjInput"
			class="scroll-bar"
			ref="dictList"
		></dict-list> -->
		<pagenation-list
			ref="pageTable"
			data-url="/system-service/dicjbbm/westQueryPage"
			http-method="post"
            v-model="tableData"
            :searchData="searchData"
            :list-height="listSlotHeight"
			:pageProps="{ layout: 'total, prev, next' }"
		>
			<el-table
				slot="list"
				stripe
				:data="tableData"
				border
				:height="listSlotHeight"
				class="scroll-bar"
				tooltip-effect="light"
				highlight-current-row
				@row-dblclick="setObjInput"
			>
			  <el-table-column label="诊断名称" prop="jbmc" show-overflow-tooltip></el-table-column>
			  <el-table-column label="诊断编码" prop="icdCode" show-overflow-tooltip></el-table-column>
			  <el-table-column label="疾病判别" prop="jbpb" show-overflow-tooltip>
				<template slot-scope="scope">
				  <div>{{ transer(scope.row.jbpb) }}</div>
				</template>
			  </el-table-column>
			</el-table>
		</pagenation-list>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { dictExecuteSql } from '@/websql/functions'

@Component({
  name: 'DiagnoseEnter',
  filters: {
    filterNull(value:any) {
      if (value == null || value == 'null') {
        return ''
      }
    }
  }
})
export default class extends Vue {
  @Prop({ required: true }) private isHalf!: boolean
  private data: Array<any> = []

  private listSlotHeight:number = 0
  private tableData:Array<any> = []
  private searchData: object = {
    JBMC: <string>'疾病名称',
    ICD10: <string>'ICD10'
  }
  private jbpbList: Array<any> = [] // 疾病判别数组
  private headerArray: Array<any> = [
    {prop:'JBMC',label: '诊断名称',width:130},
    {prop:'ICD_CODE',label: '诊断编码',width: 70},
    {prop:'JBPB',label: '疾病判别'},
  ]
  created() {

    if (this.isHalf){
      this.listSlotHeight = (Vue.prototype.PageHeight - 280) / 2
    }else {
      this.listSlotHeight = Vue.prototype.PageHeight - 240
    }
  }
  mounted() {
	this.jbpbList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DISEASE_DISCRIMIN_DICT : this.$store.state.webSqlDict.DISEASE_DISCRIMIN_DICT
	this.getList()
  }

  private getList() {
	const pageElement:any = this.$refs.pageTable;
    pageElement.getList()
  }


  private setObjInput(row:any) {
	console.log(107,row)
	this.$emit('setObjInput',row)
  }

  // 疾病判别字典转换
  private transer(jbpb: string | null) {
    if (jbpb != null) {
      let jbpbName: Array<any> = []
      jbpb.split(',').forEach((el: any) => {
        let name = this.jbpbList.find((item: any) => item.dv == el) && this.jbpbList.find((item: any) => item.dv == el).dn
        jbpbName.push(name)
      })
      return jbpbName.join(',')
    }
  }
}
</script>

<style lang="scss" scoped>
.header-row {
	display: flex;
	flex-flow: row nowrap;
	padding-bottom: 8px;

	.label {
		width: 40px;
		font-size: 13px;
		align-self: center;
		margin-right: 8px;
	}

	.row-input {
		height: 28px;
		width: 100%;
		background: rgba(245, 246, 248, 1);
		border-radius: 4px;
		margin-right: 6px;

		::v-deep .el-input__inner {
			width: 108px;
			height: 28px;
			background: rgba(245, 246, 248, 1);
			border-radius: 4px;
			margin-right: 6px;
			border: none;
		}
	}

	.el-button--primary {
		padding: 0px;
		width: 48px;
		height: 24px;
		border-radius: 4px;
		justify-content: center;
		margin-top: 3px;
	}
}
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
