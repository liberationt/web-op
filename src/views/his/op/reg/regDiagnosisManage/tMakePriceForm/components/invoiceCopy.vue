<template>
  <!-- 退号 -->
  <el-dialog
    :title="'发票复制'"
    :visible.sync="dialogVisible"
    width="400px"
		:close-on-click-modal="false"
		@closed="reset"
		class="his-small"
  >
		<el-form :model="formData" @submit.native.prevent label-width="60px" class="clearfix">
			<!-- 发票号码 -->
			<el-form-item :label="'发票号码'">
				<el-input
					v-model="formData.fphm"
					:placeholder="'请输入复制的发票号码'"
					@keyup.enter.native="copyInvoice"
				></el-input>
			</el-form-item>
		</el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="copyInvoice" :loading="loading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aSaveCopyFphm, aChangeZfbl, aQueryDjDetails} from '@/api/his/op/reg/settlement.ts'

@Component({
  name: ''
})

export default class extends Vue {
	@Prop({ required: true, default: () => ({}) }) private patientInfo: any // 门诊信息

	private dialogVisible: boolean = false
	private formData: any = {
		fphm: ''
	}
	private copiedDj: any[] = [] // 复制得到的单据
	private loading: boolean = false

	// 打开弹窗
	private openDialog(){
		this.dialogVisible = true
	}

	// 发票信息复制
	private copyInvoice(){
		if(this.formData.fphm==''){
			this.$notify({
				title: '请输入发票号码',
				message: '',
				type: 'warning'
			})
			return false
		}
		let params = {
			fphm: this.formData.fphm,
			mzxx: this.patientInfo
		}
		this.loading = true
		aSaveCopyFphm(params).then((res: any) => {
			if(res){
				this.copiedDj = res.data
				this.changeZfbl()
			}
		})
	}

	// 根据病人性质改变自负比例
  private changeZfbl(){
    this.copiedDj.forEach((item: any)=>{
			this.$set(item, 'bllx', 0) // 病历类型，0病历，1病程
    })
    let params = {
      brxz: this.patientInfo.brxz,
      zfblList: this.copiedDj
    }
    console.log(params);
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
				this.$emit('copied', res.data)
				this.dialogVisible = false
				this.loading = false
      }
    })
	}
	
	// 关闭
	private reset(){
		this.loading = false
	}
	



  //初始化的周期函数
	created() {
  }
  mounted() {
		// this.getLists()
	}
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper{
	::v-deep .el-dialog__body{
		padding-bottom: 30px;
	}
}
.el-form{
	.el-form-item{
		display: block;
		// float: left;
		// width: calc((100% - 20px*2)/3);
		// margin-left: 20px;
		margin-bottom: 0!important;
		// &:nth-child(3n+1){
		// 	margin-left: 0;
		// }
		::v-deep .el-form-item__content{
			width: auto;
			margin-left: 60px!important;
		}
	}
}
</style>
