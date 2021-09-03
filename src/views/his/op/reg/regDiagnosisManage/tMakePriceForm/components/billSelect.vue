<template>
  <!-- 收费项目选择 -->
  <el-dialog
    :title="'收费项目选择'"
    :visible.sync="dialogVisible"
    width="800px"
		:close-on-click-modal="false"
		class="narrow-dialog"
    v-elDraggableDialog
    @closed="reset"
  >
    <div class="row">
      <div class="label">
        <div class="searchTitle">效期(天数)</div>
        <el-input v-model.number="day" ref="inputQuery" oninput ="value=value.replace(/[^0-9]/g,'')" @input="queryDj"></el-input>
      </div>
    </div>
    
    <div class="his-module his-small">
    <!-- {{$store.state.webSqlDict.OUTPATIENT_DEPARTMENt}} -->
      <el-checkbox-group v-model="table3Selection">
        <el-table
          stripe
          ref="table"
          :highlight-current-row="true"
          :data="tableData3Clone"
          border
          v-loading="loading"
          class="scroll-bar"
          tooltip-effect="light"
          height="400"
          row-key="rowKey"
          default-expand-all
          :span-method="arraySpanMethod"
        >

          <!-- 处方信息 -->
          <el-table-column width="32" class-name="parent">
            <template slot-scope="scope" v-if="scope.row.count">
              <el-checkbox
                :indeterminate="scope.row.isIndeterminate"
                :label="scope.row.rowKey"
                @change="(value)=>{parentChange(value, scope.row)}"
              >
                <span></span>
              </el-checkbox>
              <div class="data-head">
                <span>
                  门诊科室 :
                  <template v-if="mzksList.find(item => item.dv==scope.row.mzks)">
                    {{mzksList.find(item => item.dv==scope.row.mzks).dn}}
                  </template>
                  <template v-else>{{scope.row.mzks}}</template>
                </span>
                <el-divider direction="vertical"></el-divider>
                <span>就诊流水号 : {{scope.row[groupParam]}}</span>
                <!-- <span>数量 {{scope.row.count}}</span> -->
              </div>
            </template>
          </el-table-column>

          <!-- 子级复选 -->
          <el-table-column
            width="32"
          >
            <template slot-scope="scope" v-if="!scope.row.count">
              <el-checkbox
                :label="scope.row"
                @change="(value)=>{childChange(value, scope.row)}"
              ></el-checkbox>
            </template>
          </el-table-column>

          <!-- 序号 -->
          <el-table-column
            prop="SerialNumber"
            width="32"
            align="center"
          ></el-table-column>

          <!-- 类型 -->
          <el-table-column
            :label="'类型'"
            prop="djlxText"
          ></el-table-column>

          <!-- rowKey -->
          <!-- <el-table-column
            :label="'rowKey'"
            prop="rowKey"
          ></el-table-column> -->

          <!-- 就诊序号 -->
          <!-- <el-table-column
            :label="'就诊序号'"
            prop="sgjzxh"
          >
            <template slot-scope="scope" v-if="!scope.row.count">
              {{scope.row[groupParam]}}（{{scope.row.siblings}}，{{scope.row.parentIndex}}）
            </template>
          </el-table-column> -->

          <!-- 开单日期 -->
          <el-table-column
            :label="'开单日期'"
            min-width="140"
          >
            <template slot-scope="scope">
              <!-- {{scope.row.kdrq.substr(0,10)}} -->
              {{scope.row.kdrq}}
            </template>
          </el-table-column>

          <!-- 开单科室 -->
          <el-table-column
            :label="'开单科室'"
          >
            <template slot-scope="scope">
              <div v-if="mzksList.find(item => item.dv==scope.row.kdks)">
                {{mzksList.find(item => item.dv==scope.row.kdks).dn}}
              </div>
              <div v-else>{{scope.row.kdks}}</div>
            </template>
          </el-table-column>

          <!-- 开单医生 -->
          <el-table-column
            :label="'开单医生'"
          >
            <template slot-scope="scope">
              <div v-if="docList.find(item => item.dv==scope.row.kdys)">
                {{docList.find(item => item.dv==scope.row.kdys).dn}}
              </div>
              <div v-else>{{scope.row.kdys}}</div>
            </template>
          </el-table-column>

          <!-- 金额 -->
          <el-table-column
            :label="'金额'"
            prop="hjje"
            class-name="text-blue-td"
          >
            <template slot-scope="scope" v-if="!scope.row.count">
              {{useGetFloat(scope.row.hjje, 2)}}
            </template>
          </el-table-column>

          <!-- 单据来源 -->
          <el-table-column
            :label="'单据来源'"
            prop="djlyText"
          ></el-table-column>

        </el-table>
      </el-checkbox-group>

      <!-- <pre>{{table3Selection}}</pre> -->
      <!-- <pre>{{selectionData}}</pre> -->
      <!-- <pre>{{tableData3}}</pre> -->
      <!-- <pre>{{tableData3Clone}}</pre> -->
    </div>
    
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog">取消</el-button>
      <el-button
        type="primary"
        @click="billConfirm"
        @keyup.enter.native="billConfirm"
        :disabled="tableData3.length?false:true"
      >确定</el-button>
    </span>
  </el-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aChangeZfbl, aQueryDjDetails } from '@/api/his/op/reg/settlement.ts'
import { getFloat, mul } from '@/utils'

@Component({
  name: ''
})

export default class extends Vue {
  @Prop({ required: false, default: () => ({}) }) private formData: any // 表单数据
  @Prop({ required: false, default: () => ({}) }) private now: any // 当前时间
  @Prop({ required: false, default: () => ({}) }) private defaultDay: any // 当前时间
  @Prop({ required: false, default: () => ({}) }) private tableData3: any // 表格数据

  private tableData3Clone: any[] = []
	private dialogVisible: boolean = false
  private loading: boolean = false
  private day: number = 1 // 查询天数
  // private selectionData: any[] = [] // 选中的单据
  private table3Selection: any[] = [] // 所有选中的行
  private groupParam: string = 'jzlsh' // 表格的分组依据
  private mzksList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.OUTPATIENT_DEPARTMENT : this.$store.state.webSqlDict.OUTPATIENT_DEPARTMENT // 门诊科室列表
  private docList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT // 医生列表

  // 多选
  private isIndeterminate: boolean = false
  private timeout:any = null

  // 选中的单据（处方01）
  get selectionData(){
    // 单据始终由checkbox-group转换，全程不操作selectionData，务必保证多选框的准确
    // 外层复选框绑定rowKey，内层复选框绑定当前行
    return this.table3Selection.filter((item: any)=>{
      return typeof(item) == 'object'
    })
  }

  // 保留n位小数
	private useGetFloat(num: any, n: number){
		return getFloat(num, n)
	}

	// 打开弹窗
	private openDialog(){
    this.dialogVisible = true
  }
  //关闭弹框
  private cancelDialog(){
    this.dialogVisible = false
    // this.$parent.resetForm()
    const parentForm: any = this.$parent
    // parentForm.resetForm()
  }
  // 单据查询
  private queryDj(){
    this.debounce(this.search, 1000)
    // this.$emit('queryDj', this.day)
    // const inputQuery:any = this.$refs.inputQuery
    // inputQuery.blur()
  }
  private debounce (func:any, wait:any) {
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      func()
    }, wait)
  }
  private search(){
    this.$emit('queryDj', this.day)
    const inputQuery:any = this.$refs.inputQuery
    // inputQuery.blur()
  }
  // 处理数组
  private transformDj(){
    this.tableData3Clone = [...this.tableData3] // 全程只操作clone
    // 归类相同的手工就诊序号
    let arrJzxh: any = []
    let newDj: any = []
    let parentIndex = 0 // 外层索引
    // debugger

    this.tableData3Clone.forEach((i: any)=>{
      this.$set(i, 'rowKey', i.cfsb) // 设置key值
      if(!arrJzxh.includes(i[this.groupParam])){
        arrJzxh.push(i[this.groupParam])
        let obj = {
          rowKey: i[this.groupParam],
          mzks: i.kdks, // 门诊科室
          [this.groupParam]: i[this.groupParam],
          count: 1, // 计数
          parentIndex: parentIndex,
          children: [i],
          isIndeterminate: false, // 是否为半选样式
        }
        newDj.push(obj)
        parentIndex++
      }else{
        let index = newDj.findIndex((j: any, index: number)=>{
          return j[this.groupParam] == i[this.groupParam]
        })
        newDj[index].count++
        newDj[index].children.push(i)
      }
      console.log(arrJzxh);
    })

    // 设置编号、父级索引、同级数量（包括自己）、和选中
    let SerialNumber: number = 1
    newDj.forEach((i: any)=>{
      i.children.forEach((j: any)=>{
        this.$set(j, 'SerialNumber', SerialNumber++)
        this.$set(j, 'parentIndex', i.parentIndex)
        this.$set(j, 'siblings', i.count)
        this.$set(j, 'childChecked', true)
      })
    })

    this.tableData3Clone = newDj
    if(this.tableData3Clone.length > 1){
      this.$emit('updateMultiple', true)
    }else{
      this.$emit('updateMultiple', false)
    }

    // 默认选中第一组
    if(this.tableData3Clone.length){
      this.table3Selection = [this.tableData3Clone[0][this.groupParam], ...this.tableData3Clone[0].children]
    }
  }

  // 合并行
  private arraySpanMethod({ row, column, rowIndex, columnIndex }: any){
    if(row.count && columnIndex == 0){
      return [1,9]
    }
  }

  // 多选逻辑，外层互斥，内层多选
  // 父级选中/取消
  private parentChange(value: boolean, row: any){
    console.log('外层：'+(value?'是':'否'));
    if(value){
      // 如果父级勾选，表格所有的选中行即为外层rowKey加内层所有
      // 因为外层复选框绑定rowKey，内层复选框绑定当前行
      this.table3Selection = [row[this.groupParam], ...this.tableData3Clone[row.parentIndex].children]
    }else{
      this.table3Selection = []
    }

    // 清除半选样式
    this.tableData3Clone.forEach((item: any)=>{
      item.isIndeterminate = false
    })
  }

  // 子级选中/取消
  private childChange(value: boolean, row: any){
    console.log('内层：'+(value?'是':'否'));
    if(value){
      // 如果子级勾选，先判断当前父级是否勾选
      // 如果父级已勾选，不做任何处理，因为内层复选框已绑定当前行
      // 如果父级未勾选，直接以当前行重新赋值
      if(this.table3Selection.includes(row[this.groupParam])){
        // this.table3Selection.push(row)
      }else{
        console.log('重新赋值');
        this.table3Selection = [row[this.groupParam], row]
      }
    }else{
      // 
    }

    // 设置半选样式
    // 先清除半选样式
    this.tableData3Clone.forEach((item: any)=>{
      item.isIndeterminate = false
    })
    if(this.table3Selection.length <= 1){ // 外层有个rowKey
      console.log('全不选');
      this.table3Selection = []
      this.tableData3Clone[row.parentIndex].isIndeterminate = false
    }else if(this.table3Selection.length - 1 == row.siblings){
      console.log('全选');
      this.tableData3Clone[row.parentIndex].isIndeterminate = false
    }else{
      console.log('半选');
      this.tableData3Clone[row.parentIndex].isIndeterminate = true
    }
  }
  private configSub(){
    this.billConfirm()
  }
  // 单据确认
  private billConfirm(){

    this.$emit('selectedGh', this.table3Selection[1], this.selectionData) // （第一个处方(用于父组件科室、医生赋值)，所有选中的处方(用于判断是否存在医生处方)）
    // return false
    let arr: any = [] // 表格索引组成的数组
    this.selectionData.forEach((item: any)=>{
      console.log(item.kdrq);
      if(item.kdrq.substr(0,10) != this.now.substr(0,10)){
        arr.push(item.index+1)
      }
    })
    if(arr.length){
      this.$confirm(`第${arr.join(',')}行单据非当天收费项目,请询问病人是否收费`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.changeZfbl()
        this.dialogVisible = false
      }).catch(() => {
                
      });
    }else{
      this.changeZfbl()
      this.dialogVisible = false
    }
  }

  // 根据病人性质改变自负比例
  private changeZfbl(){
    let zfblList: any = []
    this.selectionData.forEach((item: any)=>{
      zfblList.push({
        cflx: item.cflx,
        cfsb: item.cfsb,
        bllx: 0
      })
    })
    let params = {
      brxz: this.formData.brxz,
      zfblList: zfblList
    }
    aChangeZfbl(params).then((res: any) => {
      if(res){
        this.queryDjDetails(params)
      }
    })
  }
  // 单据明细查询
  private queryDjDetails(params: any){
    this.$set(params, 'fpcx', 0)
    aQueryDjDetails(params).then((res: any) => {
      if(res){
        this.$emit('getTableData1', res.data)
      }
    })
  }

  // 关闭时触发
  private reset(){
    // this.tableData3Clone = []
    this.table3Selection = []
    this.day = this.defaultDay
  }



  //初始化的周期函数
	created() {
    this.day = this.defaultDay
    document.onkeyup = e =>{
      if (e.keyCode === 13 && this.dialogVisible) {
          this.configSub()
      }
    }
  }
  mounted() {
		// this.getLists()
	}
}
</script>

<style lang="scss" scoped>
.parent .el-checkbox{
  float: left;
  ::v-deep .el-checkbox__label{
    padding-left: 4px;
  }
}
.data-head {
  display: inline-block;
  margin: 0 2px;
  span {
    margin: 0 8px;
    font-weight: bold;
    color: $blue!important;
  }
  span:nth-of-type(1) {
    margin-left: 0;
  }
}

.dialog-footer{
  .el-button.is-disabled{
    opacity: .6;
  }
}

// 调试
// .el-table{
//   float: left;
//   width: 60%;
// }
// pre{
//   float: left;
//   width: 20%;
//   font-size: 10px;
//   height: 700px;
//   overflow: auto;
// }
// .el-table ::v-deep td{
//   border: 1px solid #ddd!important;
// }

</style>
