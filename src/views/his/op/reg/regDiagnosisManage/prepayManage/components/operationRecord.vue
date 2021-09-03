<template>
  <el-dialog
    :title="'操作记录'"
    :visible.sync="dialogVisible"
    v-if="dialogVisible"
    width="800px"
    :close-on-click-modal="false"
    :destroy-on-close="false"
    class="narrow-dialog"
  >
    <div class="his-module his-small">
      <pagenation-list
        ref="pageTable"
        v-model="tableData"
        data-url="/op-service/mpikpxx/doQueryCzjlList"
        :search-data="searchData"
        http-method="post"
        :list-height="listSlotHeight"
      >
        <el-table
          slot="list"
          stripe
          ref="table"
          :highlight-current-row="true"
          :data="tableFormat"
          @row-click="getDetail"
          border
          v-loading="loading"
          :height="listSlotHeight"
          class="scroll-bar"
          tooltip-effect="light"
        >
          <el-table-column prop="webSortNumber" width="32"></el-table-column>

          <!-- 操作类型 -->
          <el-table-column
            prop="cztypeName"
            :label="'操作类型'"
          ></el-table-column>

          <!-- 操作金额 -->
          <el-table-column
            prop="amount"
            :label="'操作金额'"
            class-name="text-blue-td"
            align="right"
          >
            <template slot-scope="scope">
              {{useGetFloat(scope.row.amount, 2)}}
            </template>
          </el-table-column>

          <!-- 充值/退费方式 -->
          <el-table-column
            prop="czfsName"
            :label="'充值/退费方式'"
          ></el-table-column>

          <!-- 操作时间 -->
          <el-table-column
            prop="czsj"
            :label="'操作时间'"
            width="140"
          ></el-table-column>

          <!-- 操作IP -->
          <el-table-column
            prop="czip"
            :label="'操作IP'"
          ></el-table-column>

          <!-- 操作工号 -->
          <el-table-column
            :label="'操作人员(工号)'"
          >
            <template slot-scope="scope">
              <div v-if="usersList.find(item => item.dv==scope.row.czgh)">
                {{usersList.find(item => item.dv==scope.row.czgh).dn}}({{scope.row.czgh}})
              </div>
            </template>
          </el-table-column>

        </el-table>
      </pagenation-list>
    </div>
  </el-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { getTableData } from '@/websql/functions'
import { id2Name } from '@/utils'
import { getFloat, mul } from '@/utils'

declare interface IObj {
  [key: string]: string
}

@Component({
  name: ''
})

export default class extends Vue {
	private obj: IObj = {
    name: '',
    value: '',
  }
  private dialogVisible: boolean = false
  private tableData: any = []
  private searchData: any = {
    cardNo: ''
  }
  private listSlotHeight: number = 400
  private loading: boolean = false
  private czTypeList: any = [] // 操作类型
  private fkfsList: any = [] // 付款方式
  private usersList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.USERS_DICT : this.$store.state.webSqlDict.USERS_DICT // 用户列表

  // 保留n位小数
	private useGetFloat(num: any, n: number){
		return getFloat(num, n)
	}

  // 打开弹窗
	private openDialog(cardNo: string){
    this.dialogVisible = true
    this.searchData.cardNo = cardNo
    this.searchLists()
	}

	// 关闭弹窗后
	private closeDialog(){

	}

	// 获取列表
  private searchLists() {
    this.$nextTick(()=>{
      const pageTable: any = this.$refs['pageTable']
      pageTable.searchList()
    })
  }

  // 操作类型字典
  private getCzType(){
    const _that = this
    getTableData(
      'SYS_FLAG_DATA',
      'FD000041',
      "select dv,dn from SYS_FLAG_DATA_VALUE where dk='FD000041'",
      function (data: any) {
        _that.czTypeList = data
      }
    )
  }

  // 付款方式字典
  private getFkfs(){
    const _that = this
    getTableData(
      'SYS_DICT_CONFIG',
      '21',
      "select dv,dn from SYS_DICT_CONFIG_VALUE where dk='21'",
      function (data: any) {
        _that.fkfsList = data
        console.log('付款方式');
        console.log(_that.fkfsList);
      }
    )
  }

  // 表格转字典数据
  get tableFormat() {
    let newData: any = []
    newData = id2Name(this.tableData, 'cztype', 'cztypeName', this.czTypeList, 'dv', 'dn')
    newData = id2Name(this.tableData, 'czfs', 'czfsName', this.fkfsList, 'dv', 'dn')
    return newData
  }

  private getDetail(){}


  //初始化的周期函数
	created() {
  }
  mounted() {
    this.getCzType()
    this.getFkfs()
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper ::v-deep{
  .el-dialog__body{
    padding: 10px 0 10px;
  }
}
.row{
  .search ::v-deep .el-input__inner{
    width: 200px!important;
  }
}

.el-table ::v-deep td.is-right .cell{
  padding-right: 8px!important;
}
</style>
