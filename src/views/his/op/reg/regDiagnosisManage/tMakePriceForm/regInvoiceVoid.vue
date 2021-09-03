// 发票作废
<template>
  <div class="content">
    <div class="left area">
      <div class="his-module his-small">
        <!-- <div class="row header1">
          <div class="label">
            <div class="searchTitle">收费日期</div>
            <el-date-picker
              type="daterange"
              v-model="date"
              value-format="yyyy-MM-dd"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              class="date-wrapper"
              @change="changeDate"
            ></el-date-picker>
          </div>
        </div> -->
        <div class="row header2">
          <div class="label">
            <div class="searchTitle">发票号码</div>
            <!-- <el-radio-group class="small-radio-group">
              <el-radio label="1">发票</el-radio>
              <el-radio label="2">卡号</el-radio>
            </el-radio-group> -->
            <el-input
              v-model="searchData1.fphm"
              :placeholder="'请输入发票号码'"
              @change="searchTable1"
            ></el-input>
          </div>
        </div>

        <pagenation-list
          v-model="tableData1"
          data-url="/op-service/opmzxx/doQueryMzxxFpxx"
          :search-data="searchData1"
          http-method="post"
          :list-height="listSlotHeight1"
          :pageProps="{ layout: 'total, prev, pager, next' }"
          @reqComplete="addKeyBoard1"
          ref="pageTable1"
        >
          <el-table
            slot="list"
            stripe
            :highlight-current-row="true"
            :data="tableData1"
            @row-dblclick="getDetail1"
            :height="listSlotHeight1"
            class="scroll-bar"
            border
            ref="table1"
          >
            <el-table-column prop="webSortNumber" align="center" width="32"></el-table-column>
            <!-- 患者姓名 -->
            <el-table-column
              prop="brxm"
              :label="'患者姓名'"
            ></el-table-column>

            <!-- 卡号 -->
            <!-- <el-table-column
              prop="jzkh"
              :label="'卡号'"
            ></el-table-column> -->

            <!-- 发票号码 -->
            <el-table-column
              prop="fphm"
              :label="'发票号码'"
            ></el-table-column>

            <!-- 收费日期 -->
            <el-table-column
              :label="'收费日期'"
            >
              <template slot-scope="scope">
                {{scope.row.sfrq.substr(0,10)}}
              </template>
            </el-table-column>

          </el-table>
        </pagenation-list>
      </div>
    </div>
    <div class="right area">
      <div class="his-module his-small">
        <div class="row header3">
          <div class="label">
            <div class="btn">
              <el-button
                type="text"
                size="mini"
                @click="openVoidInputDialog"
              >
                <i class="icon his-caozuo-cancellation red"></i>作废
              </el-button>
              <el-button
                type="text"
                size="mini"
                :disabled="curRow2.fphm?false:true"
                @click="handleVoidCancel"
              >
                <i class="icon his-caozuo-cancellation-cancel green"></i>取消作废
              </el-button>
            </div>
          </div>
        </div>
        <pagenation-list
          ref="table2"
          v-model="tableData2"
          data-url="/op-service/opmzxx/doQueryVoidInvoice"
          :search-data="searchData2"
          http-method="post"
          :list-height="listSlotHeight2"
          @reqComplete="clearCurRow"
        >
          <el-table
            slot="list"
            stripe
            ref="table"
            :highlight-current-row="true"
            :height="listSlotHeight2"
            :data="tableData2"
            @row-click="getCurRow2"
            @row-dblclick="getDetail2"
            border
            v-loading="loading"
            class="scroll-bar"
            tooltip-effect="light"
          >
            <!-- 序号 -->
            <el-table-column
              prop="webSortNumber"
              width="32"
              align="center"
            ></el-table-column>

            <!-- 发票号码 -->
            <el-table-column
              :label="'发票号码'"
              prop="fphm"
            ></el-table-column>

            <!-- 患者姓名 -->
            <el-table-column
              :label="'患者姓名'"
              prop="brxm"
            ></el-table-column>

            <!-- 患者性质 -->
            <el-table-column
              :label="'患者性质'"
              prop="brxz"
            >
              <template slot-scope="scope">
                <div v-if="brxzList.find(item => item.dv==scope.row.brxz)">
                  {{brxzList.find(item => item.dv==scope.row.brxz).dn}}
                </div>
                <div v-else>{{scope.row.brxz}}</div>
              </template>
            </el-table-column>

            <!-- 收费日期 -->
            <el-table-column
              :label="'收费日期'"
              prop="sfrq"
              width="160"
            ></el-table-column>

            <!-- 原收费员 -->
            <el-table-column
              :label="'原收费员'"
              prop="czghText"
            ></el-table-column>

            <!-- 总计金额 -->
            <el-table-column
              :label="'总计金额'"
              prop="zjje"
              class-name="text-blue-td"
            ></el-table-column>

          </el-table>
        </pagenation-list>
      </div>
    </div>

    <invoice-void
      :fphm1="fphm1"
      :fphm2="fphm2"
      :patientInfo="patientInfo"
      :djDetails="djDetails"
      :isVoid="isVoid"
      :isTrue="isTrue"
      :isYb="isYb"
      :key="ivKeyIndex"
      @closed="closeVoidDialog"
      @reload="reload"
      ref="invoice-void"
    />

    <invoiceVoidInput @queriedFphm="queryDjDetails" ref="invoiceVoidInput" />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aQueryFphm } from '@/api/his/op/reg/regInvoiceVoid.ts'
import { aQueryDjDetails } from '@/api/his/op/reg/settlement.ts'
import { getNow } from '@/api/his/basic/index.ts'
import { parseTime } from '@/utils'
import invoiceVoid from './components/invoiceVoid.vue'
import invoiceVoidInput from './components/invoiceVoidInput.vue'

//声明接口
declare interface pageList {
  id: number
}

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: '',
  components: {
    invoiceVoid,
    invoiceVoidInput
  },
  filters: {}
})
export default class extends Vue {
  //声明变量，方法
  private date: any = ''
	private tableData1: any[] = [] // 表格数据
  private tableData2: any[] = []
	private searchData1: any = {
    ms_mzxx_ZFPB: 0, // 自负判别
    isExistBeginDate: '',
    isExistEndDate: '',
    isExistFphm: '',
    fphm: ''
  }
  private searchData2: any = {}
  private listSlotHeight1: number = 0
  private listSlotHeight2: number = 0
  private curRow1: any = {}
  private curRow2: any = {}
  private curRowIndex1: any = {}
  private curRowIndex2: any = {}
  private loading: boolean = false
  private formData: any = {}
  private formRule: any = {}

  // 子组件
  private patientInfo: any = {}
  private djDetails: any = []
  private fphm1: string = ''
  private fphm2: string = ''
  private isVoid: boolean = true // 作废/取消作废
  private ivKeyIndex: number = 1
  private isTrue:boolean = true
  private isYb:boolean = true

  private brxzList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_PATIENT_DICT : this.$store.state.webSqlDict.TABLE_PATIENT_DICT


  public setValue(value: string) {
    this.setValue(value)
  }
  public getValue() {
    return null
  }
  //监听方法
  @Watch('tableData')
	private onValueChange(value: string) {
		this.loading = false
  }

  // 获取当前时间
  private getNow(){
    getNow().then((res: any) => {
      if(res){
        var date = parseTime(res.data, '{y}-{m}-{d}')
        this.date = [date, date]
        this.searchData1.isExistBeginDate = this.date[0]+' 00:00:00'
        this.searchData1.isExistEndDate = this.date[1]+' 23:59:59'
        this.getTable1()
      }
    })
  }

  // 获取左侧列表
  private getTable1(){
    if(this.searchData1.fphm == ''){
      this.tableData1 = []
      return false
    }
    const pageTable1: any = this.$refs.pageTable1
    pageTable1.getList()
  }

  // 条件查询
  private searchTable1() {
    if(this.searchData1.fphm != ''){
      const pageTable1: any = this.$refs.pageTable1
      pageTable1.searchList()
    }
  }

  // 切换日期
  private changeDate(value: any){
    this.searchData1.isExistBeginDate = value[0]+' 00:00:00'
    this.searchData1.isExistEndDate = value[1]+' 23:59:59'
    this.searchTable1()
  }

  // 双击左侧表格
  private getDetail1(row: any){
    this.curRow1 = row
    this.fphm1 = row.fphm
    this.isVoid = 'zfrq' in row?false:true
    this.openVoidDialog()
    this.getDetail(this.fphm1)
  }

  // 获取右侧列表
  private getTable2(){
    const table2: any = this.$refs.table2
    table2.getList()
  }

  // 清空右侧当前行
  private clearCurRow(){
    this.curRow2 = {}
  }

  // 单机右侧表格
  private getCurRow2(row: any){
    this.curRow2 = row
    this.fphm2 = row.fphm
  }

  // 取消作废按钮
  private handleVoidCancel(){
    this.isVoid = false
    this.openVoidDialog()
    this.getDetail(this.fphm2)
  }

  // 双击右侧表格
  private getDetail2(row: any){
    this.curRow2 = row
    this.fphm2 = row.fphm
    this.isVoid = 'zfrq' in row?false:true
    this.openVoidDialog()
    this.getDetail(this.fphm2)
  }

  // 获取未作废/已作废的详情
  private getDetail(fphm: string){
    aQueryFphm({fphm: fphm}).then((res: any) => {
      if(res){
        this.isTrue = res.data.cdpb===0?false:true
        this.isYb = res.data.isYb ===1?false:true
        this.patientInfo = res.data.fpzfBrdaResp // 获取病人信息
        let params = {
          brxz: this.patientInfo.brxz,
          fpcx: 0,
          zfblList: res.data.resultList
        }
        aQueryDjDetails(params).then((res: any) => {
          if(res){
            this.djDetails = res.data
            this.$nextTick(()=>{
              const ivc: any = this.$refs['invoice-void']
              ivc.transform()
            })

          }
        })
      }
    })
  }

  // 打开作废/取消作废弹窗
  private openVoidDialog(){
    const iv: any = this.$refs['invoice-void']
    iv.openDialog()
  }

  // 关闭弹窗时触发
  private closeVoidDialog(){
    this.ivKeyIndex++
  }

  // 重新加载表格
  private reload(){
    this.getTable1()
    this.getTable2()
  }

  // 输入框子组件==============
  // 打开发票号输入框弹窗
  private openVoidInputDialog(){
    const ivi: any = this.$refs.invoiceVoidInput
    ivi.openDialog()
  }

  // 查询明细
  private queryDjDetails(fphm: string, fphmInfo: any){
    this.fphm1 = fphm
    this.isVoid = true
    this.openVoidDialog()

    this.patientInfo = fphmInfo.fpzfBrdaResp // 获取病人信息
    let params = {
      brxz: this.patientInfo.brxz,
      fpcx: 0,
      zfblList: fphmInfo.resultList
    }
    aQueryDjDetails(params).then((res: any) => {
      if(res){
        this.djDetails = res.data
        this.$nextTick(()=>{
          const ivc: any = this.$refs['invoice-void']
          ivc.transform()
        })

      }
    })
  }
  // 输入框子组件==============

  // 增加索引
  private tableRowClassName({ row, rowIndex }: any) {
    this.$set(row, 'index', rowIndex)
	}

  // 获取到数据后
  private addKeyBoard1(){
    // addEventListener('keydown', this.keyBoard1)
    // this.setFirstRow1()
    // const inputSearchFphm: any = this.$refs.inputSearchFphm
    // inputSearchFphm.blur()
  }

  // 默认选中第一行
	private setFirstRow1(){
		const table1: any = this.$refs.table1
		table1.setCurrentRow(this.tableData1[0])
		this.curRowIndex1 = 0
	}
	private setFirstRow2(){
		const table2: any = this.$refs.table2
		table2.setCurrentRow(this.tableData2[0])
		this.curRowIndex2 = 0
  }

  // 输入框获取焦点
  private focus1(){
    console.log('asdasd');
    removeEventListener('keydown', this.keyBoard1)
    removeEventListener('keydown', this.keyBoard2)
  }

  // 键盘选择
	private keyBoard1(e: any){
		console.log('键盘-发票选择');
		const table1: any = this.$refs.table1
		if(e.keyCode == 38){ // 上
			e.preventDefault();
			if(this.curRowIndex1 != 0){
				this.curRowIndex1--
				table1.setCurrentRow(this.tableData1[this.curRowIndex1])
				// this.curRow = this.tableData[this.curRowIndex]
			}
		}
		if(e.keyCode == 40){ // 下
			e.preventDefault();
			if(this.curRowIndex1 != this.tableData1.length - 1){
				this.curRowIndex1++
				table1.setCurrentRow(this.tableData1[this.curRowIndex1])
				// this.curRow = this.tableData[this.curRowIndex]
			}
		}
		if(e.keyCode == 13){
      this.getDetail1(this.tableData1[this.curRowIndex1])
		}
  }

  private keyBoard2(e: any){
		console.log('键盘-处方选择');
		const table2: any = this.$refs.table2
		if(e.keyCode == 38){ // 上
			e.preventDefault();
			if(this.curRowIndex2 != 0){
				this.curRowIndex2--
				table2.setCurrentRow(this.tableData2[this.curRowIndex2])
				// this.curRow = this.tableData[this.curRowIndex]
			}
		}
		if(e.keyCode == 40){ // 下
			e.preventDefault();
			if(this.curRowIndex2 != this.tableData2.length - 1){
				this.curRowIndex2++
				table2.setCurrentRow(this.tableData2[this.curRowIndex2])
				// this.curRow = this.tableData[this.curRowIndex]
			}
		}
		// if(e.keyCode == 13){
    //   this.getDetail2(this.tableData2[this.curRowIndex2])
    // }
    if(e.keyCode == 32){
      console.log('空格键');
      this.getDetail2(this.tableData2[this.curRowIndex2])
      table2.toggleRowSelection(this.tableData2[this.curRowIndex2])
    }
	}

  //初始化的周期函数
	created() {
    this.listSlotHeight1 = Vue.prototype.PageHeight - 108
    this.listSlotHeight2 = Vue.prototype.PageHeight - 98
  }
  mounted() {
    // this.getNow()
    this.getTable2()
    // this.getLists()
    // aCurTime().then((res: any) => {
    //   if(res){
    //     console.log('当前时间');
    //     console.log(res.data);
    //   }
    // })
	}
}
</script>

<style lang="scss" scoped>
// 布局样式
.content{
  display: flex;
}
.area{
  padding: 10px;
  border-radius: 8px;
  background: #fff;
}
.left{
  width: 28%;
}
.right{
  width: calc(72% - 10px);
  margin-left: 10px;
  .upper{}
  .lower{
    flex-grow: 1;
    display: flex;
    margin-top: 10px;
    .lower-left{
      width: 22%;
    }
    .lower-right{
      width: calc(78% - 10px);
      margin-left: 10px;
    }
  }
}

// 重置his-module、his-small
.his-small{
  padding: 0;
}
.row{
  margin-bottom: 8px;
}

.row .label{
  .el-date-editor ::v-deep{
    width: 100%;
    height: 28px;
  }
  .el-input ::v-deep{
    width: auto;
    .el-input__inner{
      width: 100%;
    }
  }
}

// 单选框
.small-radio-group {
  flex-shrink: 0;
  .el-radio {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
    ::v-deep .el-radio__label {
      padding-left: 4px;
      font-size: 13px;
    }
  }
}

// 头部
.header1{
  margin-bottom: 10px;
  padding-bottom: 0;
  border: none;
  .label{
    width: 100%;
    >div{
      white-space: nowrap;
    }
  }
}
.header2{
  margin-bottom: 10px;
  padding-bottom: 10px;
  .label{
    width: 100%;
  }
  .el-input{
    flex-grow: 1;
  }
}
.header3{
  .label{
    height: 20px!important;
  }
}

//四列表单
.form4{
	margin: 0!important;
	.form-area{
		float: left;
		width: calc((100% - 16px*3)/4);
		margin-right: 16px;
		&:nth-child(4n){
			margin-right: 0;
    }
    &:nth-last-child(-n+3){
      .el-form-item{
        margin-bottom: 0!important;
      }
    }
	}
	.el-form-item{
		display: inline-block;
		width: 100%;
		margin-bottom: 8px!important;
		&.item-card{
			width: 65%;
			+.el-button{
				width: calc(35% - 8px);
				height: 28px;
				margin-left: 8px;
				padding: 0;
				justify-content: center;
			}
		}
	}
}

.drug-type{
  margin-left: 8px;
  font-size: 16px;
  font-weight: bold;
  color: $blue;
}
.el-divider{
  margin: 0 16px;
}
.lower-right{
  .row{
    .el-input{
      margin-right: 16px;
    }
  }
}

</style>
