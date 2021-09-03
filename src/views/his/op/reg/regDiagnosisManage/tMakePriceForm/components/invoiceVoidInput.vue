<template>
  <!-- 退号 -->
  <el-dialog
    :title="'发票作废'"
    :visible.sync="dialogVisible"
    width="400px"
		:close-on-click-modal="false"
		class="his-small"
		@close="closeDialog"
  >
		<el-form :model="formData" label-width="60px" @submit.native.prevent class="clearfix">
			<!-- 发票号码 -->
			<el-form-item :label="'发票号码'">
				<el-input
					v-model="fphm"
					:placeholder="'请输入需要作废的发票号码'"
					@keyup.enter.native="queryFphm"
				></el-input>
			</el-form-item>
		</el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="queryFphm" :loading="showLoading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aQueryFphm } from '@/api/his/op/reg/regInvoiceVoid.ts'

@Component({
  name: ''
})

export default class extends Vue {
	private dialogVisible: boolean = false
	private formData: any = {}
	private fphm: string = ''
	private showLoading:boolean =false

	// 打开弹窗
	private openDialog(){
		this.dialogVisible = true
	}

	// 关闭时
	private closeDialog(){
		this.fphm = ''
	}

	// 查询发票信息
	private queryFphm(){
		this.showLoading = true
		if(this.fphm == ''){
			this.showLoading = false
			this.$notify({
				title: '请输入发票号码',
				message: '',
				type: 'warning'
			})
			return false
		}
		
		
		aQueryFphm({fphm: this.fphm}).then((res: any) => {
			this.showLoading = false
      		if(res){
				if(res.data.fpzfBrdaResp.zfpb == null){
					this.$notify({
						title: '该发票不存在',
						message: '',
						type: 'error'
					})
				}else if(res.data.fpzfBrdaResp.zfpb == 1){
					this.$notify({
						title: '该发票已作废',
						message: '',
						type: 'error'
					})
				}else{
					this.$emit('queriedFphm', this.fphm, res.data)
					this.dialogVisible = false
				}
				
				// this.patientInfo = res.data.fpzfBrdaResp // 获取病人信息
				// let params = {
				//   brxz: this.patientInfo.brxz,
				//   fpcx: 0,
				//   zfblList: res.data.resultList
				// }
				// aQueryDjDetails(params).then((res: any) => {
				//   if(res){
				//     this.djDetails = res.data
				//     this.$nextTick(()=>{
				//       const ivc: any = this.$refs['invoice-void']
				//       ivc.transform()
				//     })
					
				//   }
				// })
			}
		}).catch((err:any)=>{
			this.showLoading = false
		})
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
