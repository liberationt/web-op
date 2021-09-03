<template>
  <!-- 调入 -->
  <el-dialog
    :title="'预约病人调入'"
    :visible.sync="dialogJoin"
    :close-on-click-modal="false"
    width="650px"
    class="narrow-dialog"
    @closed="reset"
  >
    <div class="his-module his-small">
      <el-table
        stripe
        :highlight-current-row="true"
        :data="tableData"
        :row-class-name="tableRowClassName"
        @row-click="getCurRow"
        @row-dblclick="handleConfirm"
        border
        height="200"
        ref="table"
      >
        <el-table-column type="index" width="32"></el-table-column>
        <el-table-column :label="'科室名称'">
          <template slot-scope="scope">
            {{allDeptList.find(item => item.dv == scope.row.ksdm) &&
            allDeptList.find(item => item.dv == scope.row.ksdm).dn}}
          </template>
        </el-table-column>
        <el-table-column prop="ysdm" :label="'医生姓名'">
          <template slot-scope="scope">
            {{allDocList.find(item => item.dv == scope.row.ysdm) &&
            allDocList.find(item => item.dv == scope.row.ysdm).dn}}
          </template>
        </el-table-column>
        <el-table-column prop="jzkh" :label="'就诊卡号'"></el-table-column>
        <el-table-column prop="jhhm" :label="'就诊序号'"></el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogJoin = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script lang='ts'>
import { Component, Vue,  Prop } from 'vue-property-decorator'
import { aQuerySjBrxz} from '@/api/his/op/reg/registerManage.ts'

@Component({
  name: ''
})

export default class extends Vue {
  @Prop({ required: true, default: () => ({}) }) private appointForm: any // 病人性质
  @Prop({ required: true, default: () => ({}) }) private tableData: any // 值班类别

  private dialogJoin: boolean = false
  private formData: any = {
    jzkh: '',
    brxm: '',
    brxb: '',
    ages: '',
    brxz: '',
    brid: '', // 病人id hidden
  }
//   private tableData: any[] = []
  private listSlotHeight: number = 0
  private curRow: any = {}
  private curRowIndex: number = 0 // 当前索引
  private ampm: string|null = ''
  private allDeptList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REGISTERATION_DEPARTMENT_DICT : this.$store.state.webSqlDict.REGISTERATION_DEPARTMENT_DICT
  private allDocList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT

  // 打开弹窗
  private openDialog(){
    this.dialogJoin = true
    if(this.tableData.length){
        // 选中第一行
        this.curRow = this.tableData[0]
        this.$nextTick(()=>{
            const table: any = this.$refs.table
            table.setCurrentRow(this.tableData[0])
            this.curRowIndex = 0
        })
        addEventListener('keyup', this.keyBoard)
    }
    for(let i in this.formData){
        this.formData[i] = this.appointForm[i]
    }
    console.log(this.appointForm,888)
    console.log(this.formData,987987)
  }

  // 关闭时
  private reset(){
    removeEventListener('keyup', this.keyBoard)
  }
  // 选择科室
  private getCurRow(row: any){
    this.curRow = row
  }

  // 确认按钮
  private handleConfirm(){
    if(!this.curRow.hasOwnProperty('ksdm')){
      this.$notify({
        title: '请选择挂号科室',
        message: '',
        type: 'warning'
      })
      return false
    }

    // let ksdmList: any = []
    // this.deptList.forEach((item: any)=>{
    //   ksdmList.push(item.ksdm)
    // })

    // if(ksdmList.includes(this.curRow.ksdm)){
    //   this.dialogJoin = false
    //   this.$emit('queried', this.formData, this.curRow)
    // }else{
    //   this.$notify({
    //     title: '该预约科室未排班',
    //     message: '',
    //     type: 'error'
    //   })
    // }
    if(!this.curRow.existKspb){
      this.$notify({
        title: '该预约科室未排班',
        message: '',
        type: 'error'
      })
      return false
    }
    if(!this.curRow.existYspb){
      this.$notify({
        title: '该预约医生未排班',
        message: '',
        type: 'error'
      })
      return false
    }

    this.dialogJoin = false
    this.$emit('queried', this.formData, this.curRow)
  }

  // 增加索引
  private tableRowClassName({ row, rowIndex }: any) {
    this.$set(row, 'index', rowIndex)
  }
  
  // 键盘选择
	private keyBoard(e: any){
		console.log('键盘-预约单选择');
		const table: any = this.$refs.table
		if(e.keyCode == 38){ // 上
			e.preventDefault();
			if(this.curRowIndex != 0){
				this.curRowIndex--
				table.setCurrentRow(this.tableData[this.curRowIndex])
				this.curRow = this.tableData[this.curRowIndex]
			}
		}
		if(e.keyCode == 40){ // 下
			e.preventDefault();
			if(this.curRowIndex != this.tableData.length - 1){
				this.curRowIndex++
				table.setCurrentRow(this.tableData[this.curRowIndex])
				this.curRow = this.tableData[this.curRowIndex]
			}
		}
		if(e.keyCode == 13){
			this.handleConfirm()
		}
  }
  
  // 输入框获取焦点时移除监听
  private inputFocus(){
    removeEventListener('keyup', this.keyBoard)
  }

  //初始化的周期函数
	created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 230
  }
  mounted() {
    // this.getLists()
	}
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper{
	::v-deep .el-dialog__body{
		padding-top: 8px;
	}
}

.el-form{
  .form-item-wrapper{
    float: left;
    width: calc((100% - 20px*1)/2);
    margin-left: 20px;
    &:nth-child(2n+1){
      margin-left: 0;
    }
    .item-gender, .item-card{
      float: left;
      width: 70%;
    }
    .item-age{
      float: left;
      width: 30%;
      ::v-deep .el-form-item__content{
        margin-left: 8px!important;
      }
    }
    .read-card{
      float: left;
      width: calc(30% - 8px);
      height: 28px;
      margin-left: 8px;
      padding: 0;
      justify-content: center;
      ::v-deep .icon{
        font-size: 16px;
      }
    }
  }
	.el-form-item{
		display: block;
		// float: left;
		// margin-left: 20px;
		margin-bottom: 8px!important;
		::v-deep .el-form-item__content{
			width: auto;
			margin-left: 60px!important;
		}
    &[hidden]{
      display: none;
    }
  }
  .form-area1{
    .el-form-item{
      width: calc((100% - 20px*1)/2);
      &:nth-child(2n+1){
        margin-left: 0;
      }
    }
  }
  .form-area2{
    .el-form-item{
      width: calc((100% - 20px*2)/3);
      &:nth-child(3n+1){
        margin-left: 0;
      }
    }
  }
}
.el-divider{
  margin: 2px 0 10px 0;
  background-color: $border;
}
.el-table{
  &::before{
    background: none!important;
  }
}
</style>
