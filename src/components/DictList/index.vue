<template>
	<div class="content dict-list-cc ht">
		<div class="his-module his-small his-mini ht">
			<el-table
					:data="data"
					border
					:fit="true"
					:highlight-current-row="true"
					@row-dblclick="handleDbClick"
					ref="singleTable"
					class="no-underline scroll-bar"
					:show-header="true"
					:height="listSlotHeight"
			>
<!--				<el-table-column prop="sortNum" width="32"></el-table-column>-->
				<el-table-column
						v-for="result in resultTableHeader"
						:key="result.prop"
						:prop="result.prop"
						:label="result.label"
						:show-overflow-tooltip="true"
						:width="result.width"
				>
					<template slot-scope="scope">
						<span>{{scope.row[result.prop] | filterNull}}</span>
					</template>
				</el-table-column>
			</el-table>
			<div class="page-footer">
				<el-pagination
						@current-change="handleCurrentChange"
						:current-page="pager"
						layout="total, prev, next,jumper"
						:total="total"
				></el-pagination>
			</div>
		</div>


	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { getTableData, dictExecuteSql } from '@/websql/functions'

@Component({
  name: 'DictList',
  components: {},
  filters: {
    filterNull(value: any) {

      if (value == null || value == 'null' ) {
        return ''
      }else {
        return  value
      }
    }
  }
})
export default class extends Vue {
  @Prop({ required: true, default: [] }) private resultTableHeader!: Array<any> //结果表头
  @Prop({ required: false, default: 'GY_JBBM' }) private tableName!: String //表名
  @Prop({ required: false }) private listSlotHeight!: number
  @Prop({ required: false, default: '' }) private placeholder!: string //占位符
  @Prop({ required: false, default: '' }) private query!: string //占位符
  @Prop({ required: false, default: '' }) private queryData!: string //占位符
  private total: number = 0 //数据总数
  private pager: number = 1 //页码
  private data: any[] = [] //搜索结果的数据
  // private queryData: string = '' //用来匹配的数据

  mounted() {
    this.dataAllTotal()
    this.getAllData()
  }

  // 查询表中匹配的数据的总数
  private dataTotal() {

    const that = this
    if (this.tableName == 'GY_JBBM'){

      dictExecuteSql(
        `select count(*) from ${this.tableName}  WHERE   PYDM LIKE '%${this.queryData}%'`,
        function (tx: any, result: any) {
          that.total = result.rows[0]['count(*)']
        },
        function (tx: any, error: any) {
          console.log('查询失败:' + error.message)
        }
      )
    }else{
      dictExecuteSql(
        `select count(*) from ${this.tableName}  WHERE  dk = ${this.query} AND py LIKE '%${this.queryData}%'`,
        function (tx: any, result: any) {
          that.total = result.rows[0]['count(*)']
        },
        function (tx: any, error: any) {
          console.log('查询失败:' + error.message)
        }
      )
    }

  }
  //查询表中匹配的数据
  private getData() {
    const that = this
    if (this.tableName == 'GY_JBBM'){
      dictExecuteSql(
        `select * from ${this.tableName} WHERE  PYDM LIKE '%${this.queryData}%'  limit 10 offset ${(this.pager - 1) * 10}`,
        function (tx: any, result: any) {
          that.data = []
          for (let i = 0; i < result.rows.length; i++) {
            let data: any = { ...result.rows[i], sortNum: (that.pager - 1) * 10 + i + 1 }
            that.data = [...that.data, data]
          }
        },
        function (tx: any, error: any) {
          console.log('查询失败:' + error.message)
        }
      )
    }else {
      dictExecuteSql(
        `select * from ${this.tableName} WHERE dk = ${this.query} AND py LIKE '%${this.queryData}%'  limit 10 offset ${(this.pager - 1) * 10}`,
        function (tx: any, result: any) {
          that.data = []
          for (let i = 0; i < result.rows.length; i++) {
            let data: any = { ...result.rows[i], sortNum: (that.pager - 1) * 10 + i + 1 }
            that.data = [...that.data, data]
          }
        },
        function (tx: any, error: any) {
          console.log('查询失败:' + error.message)
        }
      )
    }

  }

  // 查询表的总数
  private dataAllTotal() {
    const that = this
    if (this.tableName == 'GY_JBBM'){
      dictExecuteSql(
        `select count(*) from ${this.tableName}`,
        function(tx: any, result: any) {
          that.total = result.rows[0]['count(*)']
        },
        function(tx: any, error: any) {
          console.log('查询失败:' + error.message)
        }
      )
    }else {
      dictExecuteSql(
        `select count(*) from ${this.tableName} where dk = ${this.query}`,
        function(tx: any, result: any) {
          that.total = result.rows[0]['count(*)']
        },
        function(tx: any, error: any) {
          console.log('查询失败:' + error.message)
        }
      )
    }

  }

  //获取全部的疾病
  private getAllData() {

    const that = this
    if (this.tableName == 'GY_JBBM'){
      dictExecuteSql(
        `select * from ${this.tableName}  limit 16 offset ${(this.pager - 1) * 10}`,
        function(tx: any, result: any) {
          that.data = []
          for (let i = 0; i < result.rows.length; i++) {
            let data: any = { ...result.rows[i], sortNum: (that.pager - 1) * 10 + i + 1 }
            that.data = [...that.data, data]
          }
        },
        function(tx: any, error: any) {
          console.log('查询失败:' + error.message)
        }
      )
    }else {
      dictExecuteSql(
        `select * from ${this.tableName} where dk = ${this.query} limit 10 offset ${(this.pager - 1) * 10}`,
        function(tx: any, result: any) {
          that.data = []
          for (let i = 0; i < result.rows.length; i++) {
            let data: any = { ...result.rows[i], sortNum: (that.pager - 1) * 10 + i + 1 }
            that.data = [...that.data, data]
          }
        },
        function(tx: any, error: any) {
          console.log('查询失败:' + error.message)
        }
      )
    }

  }

  //改变页码
  private handleCurrentChange(val: number) {
    this.pager = val
    this.getAllData()

  }


  private handleDbClick(row: any) {
    console.log('value aannyy',row)
    this.$emit('setObjInput', row)
  }

}
</script>

<style lang="scss" scoped>
.dict-list-cc {
	padding: 0 !important;
	height: auto;
	width: auto;
	.his-module {
		height: auto;
	}
	.his-small {
		padding: 0 !important;
	}
}
::v-deep .el-select-dropdown {
	display: none;
}

.page-footer {
	text-align: right;
	margin-top: 8px;
}
::v-deep .el-table__body-wrapper {
	overflow: auto;
}
</style>

