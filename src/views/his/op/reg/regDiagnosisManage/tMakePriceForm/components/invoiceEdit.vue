<template>
  <!-- 退号 -->
  <el-dialog
    :title="'发票修改'"
    :visible.sync="dialogVisible"
    width="400px"
		:close-on-click-modal="false"
		class="his-small"
  >
		<el-form :model="formData" @submit.native.prevent label-width="60px" class="clearfix">
			<!-- 发票号码 -->
			<el-form-item :label="'发票号码'">
				<el-input
					v-model="formData.fphm"
					:placeholder="'请输入当前发票号码'"
				></el-input>
			</el-form-item>
		</el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="editNotesNumber">确定</el-button>
    </span>
  </el-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aUpdateNotesNumber } from '@/api/his/op/reg/settlement.ts'

@Component({
  name: ''
})

export default class extends Vue {
	@Prop({ required: true, default: '' }) private fphm!: string // 发票号码

	private dialogVisible: boolean = false
	private formData: any = {
		fphm: ''
	}

	// 打开弹窗
	private openDialog(){
		this.dialogVisible = true
		this.formData.fphm = this.fphm
	}

	// 修改发票号
	private editNotesNumber(){
		if(this.formData.fphm.length != this.fphm.length){
			this.$notify({
				title: '修改失败',
				message: '修改后的发票号码与原发票号码长度不相等',
				type: 'error',
			})
			return false
		}
		if(parseInt(this.formData.fphm) < parseInt(this.fphm)){
			this.$notify({
				title: '修改失败',
				message: '修改后的发票号码不能小于原发票号码',
				type: 'error'
			})
			return false
		}
		if(parseInt(this.formData.fphm) == parseInt(this.fphm)){
			this.dialogVisible = false
			return false
		}
		aUpdateNotesNumber({fphm: this.formData.fphm}).then((res: any) => {
			if(res){
				this.$notify({
					title: '修改成功',
					message: '',
					type: 'success',
				})
				this.dialogVisible = false
				this.$emit('edited')
			}
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
