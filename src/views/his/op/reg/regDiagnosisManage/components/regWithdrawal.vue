<template>
  <!-- 退号 -->
	<div>
		<el-dialog
			:title="'退号处理'"
			:visible.sync="dialogWithdrawal"
			width="650px"
			:close-on-click-modal="false"
			@close="closeDialog"
			class="narrow-dialog"
		>
			<div class="row narrow-padding" >
				<div class="label">
					<div class="btn">
						<el-checkbox v-model="isEcQrcode" class="ec-qrcode">电子凭证</el-checkbox>
						<el-divider direction="vertical"></el-divider>
						<el-button type="text" size="mini" @click="searchRegInfo" :disabled="isDisabled">
							<i class="icon his-caozuo_search blue"></i>
							<span>查询</span>
						</el-button>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="label">
					<div class="searchTitle">卡号</div>
					<el-input
						v-model="searchData.jzkh"
						:placeholder="'请输入卡号查询'"
						@keyup.enter.native="isRead=0;ybCardtype='';jzkhEnter()"
						class="search"
						ref="inputSearchJzkh"
					>
						<i slot="prefix" class="el-input__icon icon his-search"></i>
					</el-input>
					<el-button
						type="primary"
						icon="icon his-reading-card"
						class="read-card"
						@click="readCard('1')"
					>读卡</el-button>
					<div class="searchTitle">发票号码</div>
					<el-input
						v-model="searchData.fphm"
						:placeholder="'请输入发票号查询'"
						@keyup.enter.native="isRead=0;ybCardtype='';searchRegInfo()"
						class="search"
					>
						<i slot="prefix" class="el-input__icon icon his-search"></i>
					</el-input>
					<el-input v-model="searchData.carddata" v-show="0"></el-input>
					<!-- <el-divider direction="vertical"></el-divider>
					<div class="btn">
						<el-button type="text" size="mini" @click="searchRegInfo" :disabled="isDisabled">
							<i class="icon his-caozuo_search blue"></i>
							<span>查询</span>
						</el-button>
					</div> -->
				</div>
			</div>
			<div class="his-small">
				<el-form :model="formData" label-width="60px" ref="formData" class="clearfix">
					<!-- 患者姓名 -->
					<el-form-item :label="'患者姓名'" prop="brxm" disabled>
						<el-input
							v-model="formData.brxm"
							:placeholder="'患者姓名'"
							:disabled="true"
						></el-input>
					</el-form-item>

					<!-- 患者性质 -->
					<el-form-item :label="'患者性质'" prop="xzmc" disabled>
						<el-input
							v-model="formData.xzmc"
							:placeholder="'患者性质'"
							:disabled="true"
						></el-input>
					</el-form-item>

					<!-- 挂号科室 -->
					<el-form-item :label="'挂号科室'" prop="ksmc" disabled>
						<el-input
							v-model="formData.ksmc"
							:placeholder="'挂号科室'"
							:disabled="true"
						></el-input>
					</el-form-item>

					<!-- 挂号医生 -->
					<el-form-item :label="'挂号医生'" prop="ghys" disabled>
						<el-input
							v-model="formData.ghys"
							:placeholder="'挂号医生'"
							:disabled="true"
						></el-input>
					</el-form-item>

					<!-- 挂号费 -->
					<el-form-item :label="'挂号费'" prop="ghje" disabled>
						<el-input
							v-model="formData.ghje"
							:placeholder="'挂号费'"
							class="text-blue"
							:disabled="true"
						></el-input>
					</el-form-item>

					<!-- 诊疗费 -->
					<el-form-item :label="'诊疗费'" prop="zlje" disabled>
						<el-input
							v-model="formData.zlje"
							:placeholder="'诊疗费'"
							class="text-blue"
							:disabled="true"
						></el-input>
					</el-form-item>

					<!-- 专家费 -->
					<el-form-item :label="'专家费'" prop="zjfy" disabled>
						<el-input
							v-model="formData.zjfy"
							:placeholder="'专家费'"
							class="text-blue"
							:disabled="true"
						></el-input>
					</el-form-item>

					<!-- 病历费 -->
					<el-form-item :label="'病历费'" prop="blje" disabled>
						<el-input
							v-model="formData.blje"
							:placeholder="'病历费'"
							class="text-blue"
							:disabled="true"
						></el-input>
					</el-form-item>

					<!-- 合计 -->
					<el-form-item :label="'合计'" prop="amount" disabled>
						<el-input
							v-model="formData.amount"
							:placeholder="'合计'"
							class="text-blue"
							:disabled="true"
						></el-input>
					</el-form-item>

					<!-- 其他 -->
					<el-form-item :label="'减免'" prop="jmje" disabled>
						<el-input
							v-model="formData.jmje"
							:placeholder="'减免'"
							class="text-blue"
							:disabled="true"
						></el-input>
					</el-form-item>

					<!-- 现金 -->
					<el-form-item :label="'退款金额'" prop="xjje" disabled>
						<el-input
							v-model="formData.xjje"
							:placeholder="'退款金额'"
							:disabled="true"
							class="text-blue"
						></el-input>
					</el-form-item>

					<!-- 退款方式 -->
					<el-form-item :label="'退款方式'" prop="tkfs" disabled>
						<!-- <search-select
							table-name="SYS_DICT_CONFIG"
							kid="21"
							v-model="formData.tkfs"
							:backfillValue="formData.tkfs"
							:placeholder="'退款方式'"
							:clearable="false"
						/> -->
						<el-input
							value="现金"
							:placeholder="'退款方式'"
							:disabled="true"
							class="text-blue"
						></el-input>
					</el-form-item>
					
					<!-- 病人性质 -->
					<el-form-item :label="'病人性质'" prop="brxz" hidden>
						<el-input
							v-model="formData.brxz"
							:placeholder="'病人性质'"
						></el-input>
					</el-form-item>

					<!-- 就诊号码 -->
					<el-form-item :label="'就诊号码'" prop="jzhm" hidden>
						<el-input
							v-model="formData.jzhm"
							:placeholder="'就诊号码'"
						></el-input>
					</el-form-item>

					<!-- 识别序号 -->
					<el-form-item :label="'识别序号'" prop="sbxh" hidden>
						<el-input
							v-model="formData.sbxh"
							:placeholder="'识别序号'"
						></el-input>
					</el-form-item>

					<!-- 就诊流水号 -->
					<el-form-item :label="'就诊流水号'" prop="jzlsh" hidden>
						<el-input
							v-model="formData.jzlsh"
							:placeholder="'就诊流水号'"
						></el-input>
					</el-form-item>

					<!-- 就诊状态 -->
					<el-form-item :label="'就诊状态'" prop="jzzt" hidden>
						<el-input
							v-model="formData.jzzt"
							:placeholder="'就诊状态'"
						></el-input>
					</el-form-item>

				</el-form>
			</div>
			
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogWithdrawal = false">取消</el-button>
				<el-button type="primary" @click="saveRetireRegistered" ref="btnConfirmRetire" :loading="showLoading">确定</el-button>
			</span>
		</el-dialog>

		<!-- 挂号单选择 -->
		<el-dialog
			:title="'挂号单选择'"
			:visible.sync="dialogGhdjSelect"
			width="600px"
			:close-on-click-modal="false"
			v-elDraggableDialog
			@close="closeDialog2"
			class="narrow-dialog dialog-ghdjselect"
		>
			<div class="his-module his-small">
				<el-table 
					stripe 
					:highlight-current-row="true"
					:data="tableData" 
					:height="200"
					:row-class-name="tableRowClassName"
					border
					class="mt10 scroll-bar"
					@row-click="getCurRow"
					@row-dblclick="dblSelectGhdj"
					ref="table"
				>
					<el-table-column type="index" width="32" align="center"></el-table-column>
					<el-table-column prop="sbxh" :label="'识别序号'"></el-table-column>
					<el-table-column prop="ghsj" :label="'挂号时间'" width="140"></el-table-column>
					<el-table-column prop="ksmc" :label="'挂号科室'"></el-table-column>
					<el-table-column prop="ghys" :label="'医生名称'"></el-table-column>
					<el-table-column prop="jzhm" :label="'发票号码'"></el-table-column>
				</el-table>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogGhdjSelect = false">取消</el-button>
				<el-button type="primary" @click="selectGhdj">确定</el-button>
			</span>
		</el-dialog>

		<!-- <pre>{{formData}}</pre> -->
	</div>
  
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
	aQueryGhdj, aSaveRetireRegistered, aQuerySjBrxz, aQueryBcjlByEmr
} from '@/api/his/op/reg/registerManage.ts'
import { aReadMedAcc } from '@/api/his/basic'
import { getFloat, mul } from '@/utils'

@Component({
  name: ''
})

export default class extends Vue {
	// 弹窗1
	private dialogWithdrawal: boolean = false
	private searchData: any = {
		jzkh: '',
		fphm: '',
		carddata: '', // 28位 hidden
	}
	private isDisabled: boolean = true
	private formData: any = {
		brxm: '', // 病人姓名
		brxz: '', // 病人性质 hidden
		xzmc: '', // 病人性质名称
		ksmc: '', // 挂号科室名称
		ghys: '', // 挂号医生
		ghje: '', // 挂号金额
		zlje: '', // 诊疗金额
		zjfy: '', // 专家费用
		blje: '', // 病历金额
		amount: '', // 合计金额
		jmje: '', // 其他
		xjje: '', // 现金金额
		tkfs: '1', // 退款方式
		jzhm: '', // 就诊（发票）号码 hidden
		sbxh: '', // 识别序号 hidden
		jzlsh: '', // 就诊流水号
		jzzt: '', // 就诊状态
	}
	private isYb: number = 0 // 是否为医保
	private isRead: number = 0 // 是否已读卡
	private ybCardtype: string = '' // 医保卡类型

	// 弹窗2
	private dialogGhdjSelect: boolean = false
	private tableData: any[] = []
	private curRow: any = {}
	private curRowIndex: number = 0 // 当前索引
	private isEcQrcode: boolean = false // 是否为电子凭证
	private showLoading:boolean = false
	@Watch('searchData', {deep: true})
  private searchDataChange(value: any) {
    if(value.jzkh == '' && value.fphm == ''){
			this.isDisabled = true
		}else{
			this.isDisabled = false
		}
	}

	// 打开弹窗
	private openDialog(){
		this.dialogWithdrawal = true
		this.$nextTick(()=>{
			const inputSearchJzkh: any = this.$refs.inputSearchJzkh
			inputSearchJzkh.focus()
		})
	}

	a(){
		const btnConfirmRetire: any = this.$refs.btnConfirmRetire
		btnConfirmRetire.$el.focus()
	}

	// 关闭弹窗
	private closeDialog(){
		const formData: any = this.$refs.formData
		formData.resetFields()
		this.searchData.jzkh = ''
		this.searchData.fphm = ''
		this.searchData.carddata = ''
		this.isEcQrcode = false
	}

	// 卡号回车
	jzkhEnter(){
		if(!this.searchData.jzkh) return
		if(this.isEcQrcode){
			this.readCard('3')
		}else if(this.searchData.jzkh.length == 28){
			this.readCard('0')
		}else{
			this.isRead = 0
			this.searchRegInfo()
		}
	}

	// 读卡
	private readCard(cardtype: any){
		let params = {
			cardtype: cardtype,
			carddata: this.searchData.jzkh||' '
		}
		aReadMedAcc(params).then((res: any) => {
			if(res){
				this.searchData.jzkh = res.data.jzkh
				this.searchData.carddata = res.data.ecToken
				this.ybCardtype = res.data.cardtype
				this.isRead = 1
				this.searchRegInfo()
			}
		})
	}

	// 搜索
	private async searchRegInfo(){
		if(!this.searchData.jzkh&&!this.searchData.fphm) return
		const res: any = await aQueryGhdj(this.searchData)
		if(res){
			if(res.data != null){
				const res1: any = await aQuerySjBrxz({brxz: res.data[0].brxz})
				this.isYb = res1.data==6021?1:0
				// 医保卡
				if(res1.data == '6021' && this.isRead == 0){
					this.$notify({
						title: '病人卡片是医保卡,不能查询!',
						message: '',
						type: 'warning'
					})
				}else{
					// 正常流程↓↓↓↓↓
					if(res.data.length == 1){
						this.getFormData(res.data[0])
						// 使确定按钮获取焦点
						this.$nextTick(()=>{
							const btnConfirmRetire: any = this.$refs.btnConfirmRetire
							btnConfirmRetire.$el.focus()
						})
					}else{ // 多条记录，弹窗显示
						this.dialogGhdjSelect = true
						this.tableData = res.data
						// 选中第一行
						this.curRow = this.tableData[0]
						this.$nextTick(()=>{
							const table: any = this.$refs.table
							table.setCurrentRow(this.tableData[0])
							this.curRowIndex = 0
						})
						const inputSearchJzkh: any = this.$refs.inputSearchJzkh
						inputSearchJzkh.blur()
						addEventListener('keyup', this.keyBoard)
					}
					// 正常流程↑↑↑↑↑
				}

			}else{
				this.$notify({
					title: '未查询到挂号信息',
					message: '',
					type: 'warning'
				})
			}


		}


	}

	// 表单赋值
	private getFormData(data: any){
		for(let i in this.formData){
			this.formData[i] = data[i]
		}
		this.formData.ghje = getFloat(this.formData.ghje, 2)
		this.formData.zlje = getFloat(this.formData.zlje, 2)
		this.formData.zjfy = getFloat(this.formData.zjfy, 2)
		this.formData.blje = getFloat(this.formData.blje, 2)
		this.formData.amount = (mul(data.ghje, 100) + mul(data.zlje, 100) + mul(data.zjfy, 100) + mul(data.blje, 100)+ mul(data.ckje, 100))/100
		this.formData.amount = getFloat(this.formData.amount, 2)
		this.formData.xjje = (mul(data.xjje, 100)  - mul(data.blje, 100) - mul(data.ckje, 100) + mul(data.zpje, 100)) / 100 // 退款金额
		this.formData.xjje = getFloat(this.formData.xjje, 2)
		// this.formData.qtys = (mul(this.formData.amount, 100) - mul(this.formData.xjje, 100) - mul(data.ckje, 100))/100
		this.formData.jmje = getFloat(this.formData.jmje, 2)
		this.formData.tkfs = data.fkfs
		this.formData.isYb = this.isYb // 是否医保
	}

	// 单击选取表格
	private getCurRow(row: any){
		this.curRow = row
		this.curRowIndex = row.index
	}

	// 确定选择挂号单据
	private selectGhdj(){
		if(this.curRow.sbxh){
			this.getFormData(this.curRow)
			this.dialogGhdjSelect = false
			// 使退号确定按钮获取焦点
			const btnConfirmRetire: any = this.$refs.btnConfirmRetire
			btnConfirmRetire.$el.focus()
		}else{
			this.$notify({
				title: '请选择挂号单据',
				message: '',
				type: 'warning'
			})
		}
	}

	// 双击选择
	private dblSelectGhdj(row: any){
		this.curRow = row
		this.selectGhdj()
	}

	// 退号
	private async saveRetireRegistered(){
		// console.log('开始退号');
		// if(this.formData.jzzt != 0){
		// 	this.$notify({
		// 		title: '已就诊不能退号',
		// 		message: '',
		// 		type: 'error'
		// 	})
		// 	return false
		// }
		if(this.formData.sbxh){
			let res: any = await aQueryBcjlByEmr({jzlsh: this.formData.jzlsh})
			if(res.data){
				this.$notify({
					title: '已录入主诉，不能退号',
					message: '',
					type: 'error'
				})
				return false
			}
			this.showLoading = true
			let params = {
				jzkh: this.formData.isYb?this.searchData.carddata:this.searchData.jzkh,
				cardtype: this.ybCardtype,
				fphm: this.formData.jzhm,
				xzdm: this.formData.brxz,
				sbxh: this.formData.sbxh,
				jzlsh: this.formData.jzlsh,
				isYb: this.formData.isYb,
			}
			if(this.isEcQrcode){
				params.cardtype = '3'
			}
			aSaveRetireRegistered(params).then((res: any) => {
				this.showLoading = false
				if(res){
					this.$notify({
						title: '退号成功',
						message: '',
						type: 'success'
					})
					this.dialogWithdrawal = false
				}
			}).catch((err:any)=>{
				this.showLoading = false
			})
		}else{
			this.$notify({
				title: '请先调入挂号信息',
				message: '',
				type: 'warning'
			})
		}
		
	}

	// 增加索引
  private tableRowClassName({ row, rowIndex }: any) {
    this.$set(row, 'index', rowIndex)
	}

	// 键盘选择
	private keyBoard(e: any){
		console.log('键盘-挂号单选择');
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
			this.selectGhdj()
		}
	}

	// 关闭弹窗2后
	private closeDialog2(){
		removeEventListener('keyup', this.keyBoard)
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
		// padding-top: 8px;
	}
}
.row{
	.el-input{
		flex-grow: 1;
		margin-right: 0!important;
		::v-deep .el-input__inner{
			width: 100%!important;
		}
	}
	.read-card{
		height: 28px;
		margin: 0 20px 0 4px;
		padding: 0 10px;
		::v-deep span{
			font-size: 13px;
		}
	}
}
.el-form{
	.el-form-item{
		display: block;
		float: left;
		width: calc((100% - 20px*2)/3);
		margin-left: 20px;
		margin-bottom: 8px!important;
		&:nth-child(3n+1){
			margin-left: 0;
		}
		::v-deep .el-form-item__content{
			width: auto;
			margin-left: 60px!important;
		}
		&[hidden]{
			display: none;
		}
	}
}

.dialog-ghdjselect{
	::v-deep .el-dialog{
		margin-top: 20vh!important;
	}
}
.narrow-padding{
	margin-bottom: 0;
}

pre{
	position: absolute;
	bottom: 100px;
	right: 100px;
}
</style>
