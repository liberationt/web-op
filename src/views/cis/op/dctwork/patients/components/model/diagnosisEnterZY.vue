// 诊断录入
<template>
	<div class="content his-patient-zh">
		<div class="header-row" slot="header">
			<div class="label">搜索</div>
			<div class="row-input">
				<el-input
						v-model="searchData.pydm"
						:placeholder="'请输入拼首查询'"
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
				:table-name="'SYS_DICT_CONFIG_VALUE'"
				:queryData="searchData.pydm"
				:query="35"
				@setObjInput="setObjInput"
				ref="dictList"
		></dict-list> -->
		<pagenation-list 
			ref="pageTable" 
			v-model="tableDatas" 
			data-url="/system-service/diczyjb/zyPage"
			http-method="post"
			:list-height="listSlotHeight"
			:searchData="searchData"
			:pageProps="{ layout: 'total, prev, next' }"
			>
			<el-table 
				:data="tableDatas" 
				border 
				stripe 
				highlight-current-row 
				slot="list" 
				@row-dblclick="setObjInput"
				class="scroll-bar"
				:height="listSlotHeight"
				tooltip-effect="light"
				ref="dictList"
			>
				<el-table-column label="中医分类" prop="flmc" width="" show-overflow-tooltip></el-table-column>
				<el-table-column label="疾病代码" prop="jbdm" show-overflow-tooltip></el-table-column>
				<el-table-column label="疾病名称" prop="jbmc" width show-overflow-tooltip></el-table-column>
			</el-table>
		</pagenation-list>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

@Component({
  name: 'DiagnoseEnterZY',
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
  private tableDatas: Array<any> = []
  private searchData: object = {
	pydm: '',
    pageNum: 1,
    pageSize: 10,
  }

  private headerArray: Array<any> = [
    {prop:'stop',label: '中医分类'},
    {prop:'py',label: '疾病代码'},
    {prop:'dn',label: '疾病名称'},
  ]
  created() {

    if (this.isHalf){
      this.listSlotHeight = (Vue.prototype.PageHeight - 330) / 2
    }else {
      this.listSlotHeight = Vue.prototype.PageHeight - 230
    }
  }
  mounted() {
	this.getList()
  }

  private setObjInput(row:any) {
    this.$emit('setObjInputZY',row)
  }

  private getList() {
    const pageElement:any = this.$refs.pageTable;
    pageElement.getList()
    // pageElement.dataTotal()
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table__body-wrapper {
	overflow: auto;
}
.patient {
	.el-table--border {
		th {
			height: 28px !important;
			line-height: 28px !important;
		}
	}

}

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

.his-patient-zh {
  background: $white;
  border-radius: 8px;
  height: auto;
  padding: 0 !important;
  ::v-deep .el-table__header-wrapper {
    height: 28px;
    line-height: 28px;
  }
  ::v-deep .el-table__body-wrapper {
    overflow: auto;
  }
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
}
</style>
