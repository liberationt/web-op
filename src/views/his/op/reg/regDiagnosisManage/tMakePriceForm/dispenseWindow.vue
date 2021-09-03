<template>
  <div class="content">
    <div class="his-module his-small ht">
      <div class="row">
        <div class="label">
          <div class="title">选择发药窗口</div>
        </div>
      </div>
      <el-table
        slot="list"
        stripe
        ref="table"
        :highlight-current-row="true"
        :data="tableData"
        @row-click="getDetail"
        border
        v-loading="loading"
        :height="'calc(100% - 60px)'"
        class="scroll-bar no-underline"
        tooltip-effect="light"
      >
        <el-table-column
          prop="webSortNumber"
          width="40"
        ></el-table-column>

        <!-- 窗口名称 -->
        <el-table-column prop="name" :label="'窗口名称'"></el-table-column>

        <!-- 窗口编号 -->
        <el-table-column
          prop="code"
          :label="'窗口编号'"
          min-width="100px"
        ></el-table-column>

        <el-table-column :label="$t('common.action')" align="center">
          <template slot-scope="scope">
            <el-tooltip
              :content="'确定'"
              effect="light"
            >
              <el-popconfirm
                :title="'确定选择此发药窗口？'"
                :confirmButtonText="$t('common.confirm')"
                :cancelButtonText="$t('common.cancel')"
                @confirm="confirm(scope.row)"
                hideIcon
              >
                <el-button
                  slot="reference"
                  :class="'red'"
                >
                  <i
                    class="icon his-confirm"
                  ></i>
                </el-button>
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

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
  private date: any = ''
  private formData: any = {}
  private tableData: any = [
    {webSortNumber: 1, name: '窗口1', code: '001'},
    {webSortNumber: 2, name: '窗口2', code: '002'},
    {webSortNumber: 3, name: '窗口3', code: '003'},
  ]
  private loading: boolean = false



	// 获取列表
  private getLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.getList()
  }

  private getDetail(){}
  
  private confirm(){}

  // 条件查询
  searchLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }
  
  // 打开新增弹窗
	private handleAdd(){
    // this.curRow = {}
    var a: any = this.$refs['add-patient']
    a.addDialog()
  }
  
  // 打开修改弹窗
  private handleEdit(){
    var a: any = this.$refs['add-patient']
		a.editDialog(123)
  }


  //初始化的周期函数
	created() {
  }
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.el-date-editor ::v-deep{
  width: 240px;
  height: 28px;
  margin-left: 10px;
  padding: 0 10px;
  border: none;
  background: $lightGray;
  .el-input__icon {
    display: none;
  }
  .el-range-input{
    background: none;
  }
  .el-range-separator{
    width: auto;
  }
}
</style>