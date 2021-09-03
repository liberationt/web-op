<template>
  <!-- 退号 -->
	<div>
		<el-dialog
			:title="'转科处理'"
			:visible.sync="dialogTransfer"
			:close-on-click-modal="false"
			width="680px"
			class="narrow-dialog"
			@closed="reset"
		>
			<div class="row">
				<div class="label">
					<div class="searchTitle">卡号</div>
					<el-input
						v-model="searchData.jzkh"
						:placeholder="'请输入卡号查询'"
						class="search"
						@keyup.enter.native="queryTurnDept"
					>
						<i slot="prefix" class="el-input__icon icon his-search"></i>
					</el-input>
					<el-button
						type="primary"
						icon="icon his-reading-card"
						class="read-card"
					>读卡</el-button>
					<!-- <el-button
						type="primary"
					>读医保卡</el-button> -->
					<el-divider direction="vertical"></el-divider>
					<div class="btn">
						<el-button
							type="text"
							size="mini"
							@click="queryTurnDept"
							:disabled="formData.jzkh==''?true:false"
						>
							<i class="icon his-caozuo_search blue"></i>
							<span>查询</span>
						</el-button>
					</div>
				</div>
			</div>
			<div class="his-small">
				<el-form :model="formData" label-width="60px" ref="formData" class="clearfix">
					<!-- 就诊号码 -->
					<el-form-item :label="'就诊号码'" prop="jzhm" disabled>
						<el-input
							v-model="formData.jzhm"
							:placeholder="'就诊号码'"
							:disabled="true"
						></el-input>
					</el-form-item>

					<!-- 病人姓名 -->
					<el-form-item :label="'患者姓名'" prop="brxm" disabled>
						<el-input
							v-model="formData.brxm"
							:placeholder="'患者姓名'"
							:disabled="true"
						></el-input>
					</el-form-item>

					<!-- 挂号时间 -->
					<el-form-item :label="'挂号时间'" prop="ghsj" disabled>
						<el-input
							v-model="formData.ghsj"
							:placeholder="'挂号时间'"
							:disabled="true"
						></el-input>
					</el-form-item>

					<!-- 现挂科室 -->
					<el-form-item :label="'现挂科室'" prop="ghks" disabled>
						<el-input
							v-model="formData.ghks"
							:placeholder="'现挂科室'"
							:disabled="true"
						></el-input>
					</el-form-item>

					<!-- 就诊状态 -->
					<el-form-item :label="'就诊状态'" prop="jzztText" disabled>
						<el-input
							v-model="formData.jzztText"
							:placeholder="'就诊状态'"
							:disabled="true"
						></el-input>
					</el-form-item>

					<!-- 挂号医生 -->
					<el-form-item :label="'挂号医生'" prop="ygxm" disabled>
						<el-input
							v-model="formData.ygxm"
							:placeholder="'挂号医生'"
							:disabled="true"
						></el-input>
					</el-form-item>

					<!-- 转入科室 -->
					<el-form-item :label="'转入科室'" prop="zrks">
						<el-select
							v-model="formData.zrks"
							:placeholder="'请选择转入科室'"
							@change="changeGhks"
							filterable
							:filter-method="filterDept"
						>
							<el-option
								v-for="item in deptListClone"
								:key="item.ksdm"
								:value="item.ksdm"
								:label="item.ksmc"
								:disabled="item.ksdm==formData.ksdm"
							></el-option>
						</el-select>
					</el-form-item>

					<!-- 转入医生 -->
					<el-form-item :label="'转入医生'" prop="zrys">
						<el-select
							v-model="formData.zrys"
							:placeholder="'请选择转入医生'"
							filterable
							:filter-method="filterDoc"
							clearable
						>
							<el-option
								v-for="item in docListClone"
								:key="item.ysdm"
								:value="item.ysdm"
								:label="item.personname"
							></el-option>
						</el-select>
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

					<!-- 专家费用 -->
					<el-form-item :label="'专家费用'" prop="zjfy" hidden>
						<el-input
							v-model="formData.zjfy"
							:placeholder="'专家费用'"
						></el-input>
					</el-form-item>

					<!-- 挂号费 -->
					<el-form-item :label="'挂号费'" prop="ghf" hidden>
						<el-input
							v-model="formData.ghf"
							:placeholder="'挂号费'"
						></el-input>
					</el-form-item>

					<!-- 诊疗费 -->
					<el-form-item :label="'诊疗费'" prop="zlf" hidden>
						<el-input
							v-model="formData.zlf"
							:placeholder="'诊疗费'"
						></el-input>
					</el-form-item>

					<!-- 性别 -->
					<el-form-item :label="'性别'" prop="brxb" hidden>
						<el-input
							v-model="formData.brxb"
							:placeholder="'性别'"
						></el-input>
					</el-form-item>

					<!-- 年龄 -->
					<el-form-item :label="'年龄'" prop="age" hidden>
						<el-input
							v-model="formData.age"
							:placeholder="'年龄'"
						></el-input>
					</el-form-item>

					<!-- 病人id -->
					<el-form-item :label="'病人id'" prop="brid" hidden>
						<el-input
							v-model="formData.brid"
							:placeholder="'病人id'"
						></el-input>
					</el-form-item>

				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogTransfer = false">取消</el-button>
				<el-button type="primary" @click="commitTurnDept" :loading="showLoading">确定</el-button>
				<!-- <pre>{{docListClone}}</pre> -->
			</span>
			<!-- <pre>{{deptListClone}}</pre> -->
		</el-dialog>

		<!-- 挂号单选择 -->
		<el-dialog
			:title="'挂号单选择'"
			:visible.sync="dialogGhdjSelect"
			width="600px"
			:close-on-click-modal="false"
			v-elDraggableDialog
			class="narrow-dialog dialog-ghdjselect"
		>
			<div class="his-module his-small">
				<el-table 
					stripe 
					:highlight-current-row="true"
					:data="tableData" 
					:height="200"
					border
					class="mt10 scroll-bar"
					@row-click="getCurRow"
					@row-dblclick="dblSelectGhdj"
				>
					<el-table-column type="index" width="32" align="center"></el-table-column>
					<el-table-column prop="jzhm" :label="'就诊号码'"></el-table-column>
					<el-table-column prop="brxm" :label="'病人姓名'"></el-table-column>
					<el-table-column prop="ghks" :label="'现挂科室'"></el-table-column>
					<el-table-column prop="ghsj" :label="'挂号时间'" width="160"></el-table-column>
					<el-table-column prop="jzztText" :label="'就诊状态'"></el-table-column>
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
	aQueryTurnDept, aCheckKSFY, aCommitTurnDept, aQueryDeptSchDoc, aCheckSameGhks
} from '@/api/his/op/reg/registerManage.ts'
import {
  aDeptDocList
} from '@/api/his/op/reg/docSchedule.ts'

@Component({
  name: ''
})

export default class extends Vue {
	@Prop({ required: true, default: () => ({}) }) private deptList: any // 科室列表
	@Prop({ required: true, default: () => ({}) }) private zblb: any // 值班类别

	private deptListClone: any[] = [] // 复制科室列表
	private dialogTransfer: boolean = false
	private searchData: any = {
		jzkh: ''
	}
	private showLoading:boolean = false
  private formData: any = {
		// jzkh: '', // 卡号
		jzhm: '', // 就诊号码
		brxm: '',
		brxb: '',
		age: '',
		ghsj: '',
		ghks: '', // 现挂科室名称
		jzztText: '',
		ygxm: '',
		zrks: '', // 转入科室
		zrys: '', // 转入医生
		ksdm: '', // 现挂科室代码
		sbxh: '', //识别序号 hidden
		jzlsh: '', // 就诊流水号 hidden
		jzzt: '', // 就诊状态 hidden
		zjfy: '', // 专家费用 hidden
		ghf: '', // 挂号费 hidden
		zlf: '', // 诊疗费 hidden
		brid: '', // 病人id hidden
	}
	private isDisabled: boolean = true
	private docList: any[] = []
	private docListClone: any[] = []
	private nextDept: any = { // 转入的科室
		ghf: '',
		zlf: '',
		xbxz: '', // 性别限制
		nlxz: '', // 年龄限制
	}

	// 挂号单选择
	private dialogGhdjSelect: boolean = false
	private tableData: any[] = []
	private curRow: any = {}
  
  // 打开弹窗
  private openDialog(){
		this.dialogTransfer = true
		//原有的 不合理 注销
		// this.deptListClone = [...this.deptList]
	}

	// 关闭弹窗时
	private reset(){
		const formData: any = this.$refs.formData
		formData.resetFields()
		this.searchData.jzkh = ''
		this.nextDept.ghf = ''
		this.nextDept.zlf = ''
		this.deptListClone=[]
	}

	// 转科查询
	private queryTurnDept(){
		aQueryTurnDept({jzkh: this.searchData.jzkh}).then((res: any) => {
			if(res){
				if(res.data.length){
					if(res.data.length == 1){
						this.getFormData(res.data[0])
					}else{
						this.dialogGhdjSelect = true
						this.tableData = res.data
						this.curRow = {}
					}
				}else{
					this.$notify({
						title: '未找到挂号记录，可能已经退号！',
						message: '',
						type: 'warning'
					})
				}
			}
		})
	}

	// 表单赋值
	private getFormData(data: any){
		for(let i in this.formData){
			this.formData[i] = data[i]
		}
		// console.log(data,33)
		// this.deptListClone = this.deptListClone.filter(item.xbxz)
		this.deptListClone = [...this.deptList]
		let array:any = []
		this.deptListClone.map(item=>{
			if(data.ksdm != item.ksdm){
			if(item.xbxz == null&&item.nlxz==null){
				array.push(item)
			}else if(item.xbxz == null&&(item.nlxz != null && item.nlxz<data.age)){
				array.push(item)
			}else if(item.nlxz==null&&(item.xbxz != null && (data.brxb == 1 && item.xbxz != 2) || (data.brxb == 2 && item.xbxz != 1))){
				array.push(item)
			}else if(item.xbxz!=null && (data.brxb == 1 && item.xbxz != 2) || (data.brxb == 2 && item.xbxz != 1)&&item.nlxz!=null&&(item.nlxz<data.age)){
				array.push(item)
			}
		}
		})
		this.deptListClone = array
	}

	// 选中表格
	private getCurRow(row: any){
		this.curRow = row
	}

	// 确定选择挂号单据
	private selectGhdj(){
		if(this.curRow.ksdm){
			this.getFormData(this.curRow)
			this.dialogGhdjSelect = false
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

	// 确认转科
	private async commitTurnDept(){
		if(this.formData.jzzt != 0){
			this.$notify({
				title: '已经就诊不能转科',
				message: '',
				type: 'error'
			})
			return false
		}
		if(this.formData.zjfy > 0){
			this.$notify({
				title: '专家号不能转科',
				message: '',
				type: 'error'
			})
			return false
		}
		if(!this.formData.zrks){
			this.$notify({
				title: '请选择转入科室',
				message: '',
				type: 'warning'
			})
			return false
		}
		if(this.formData.ghf + this.formData.zlf != this.nextDept.ghf + this.nextDept.zlf){
			this.$notify({
				title: '科室费用不一致，不能转科!',
				message: '',
				type: 'error'
			})
			return false
		}
		if(this.nextDept.xbxz != null){
			if(this.nextDept.xbxz != this.formData.brxb){
				this.$message({
					message: '该科室与患者性别不符',
					type: 'error'
				})
				return false
			}
		}
		if(this.nextDept.nlxz != null){
			if(this.nextDept.nlxz < this.formData.age){
				this.$message({
					message: '患者年龄超过该科室年龄限制',
					type: 'error'
				})
				return false
			}
		}

		// 判断有没有挂过转入的科室
		let params1 = {
      brid: this.formData.brid,
      ghsj: this.formData.ghsj.substr(0, 10),
      jzkh: this.searchData.jzkh,
      ksdm: this.formData.zrks,
      zblb: this.zblb,
    }
    const res1: any = await aCheckSameGhks(params1)
		if (res1) {
			if (res1.errorCode != 'SUCCESS') {
				return false
			}
		}
		this.showLoading = true
		let params = {
			ghsj: this.formData.ghsj,
			ksdm: this.formData.zrks,
			sbxh: this.formData.sbxh,
			jzlsh: this.formData.jzlsh,
			xgks: this.formData.ksdm,
			zrys: this.formData.zrys,
			zrzs: '' // 转入诊室
		}
		aCommitTurnDept(params).then((res: any) => {
			this.showLoading = false
			if(res){
				this.$notify({
					title: '转科成功',
					message: '',
					type: 'success'
				})
				this.dialogTransfer = false
			}
		}).catch((err:any)=>{
			this.showLoading = false
		})
	}

	// 切换科室
  private changeGhks(ksdm: number){
		this.formData.zrys = ''
		// 挂号科室限制条件
		let nextDept = this.deptListClone.find((item: any)=>{
			return item.ksdm == ksdm
		})
		this.nextDept.xbxz = nextDept.xbxz
		this.nextDept.nlxz = nextDept.nlxz


		aCheckKSFY({ksdm: ksdm}).then((res: any) => {
			if(res){
				this.nextDept.ghf = res.data.ghf
				this.nextDept.zlf = res.data.zlf
			}
		})
    this.getDocList()
    // this.matchOfficeCode()
	}
	
	// 获取科室医生列表
  private getDocList(){
    let params = {
			// zblb: this.curAmpm,
			// zblb: this.zblb,
      ksdm: this.formData.zrks
    }
    aQueryDeptSchDoc(params).then((res: any) => {
      if(res){
				this.docList = res.data

				this.docList.forEach((item: any)=>{
					if(item.pycode == null){
						item.pycode = ''
					}
				})
				this.docListClone = this.docList
      }
    })
	}
	
	// 过滤科室
	private filterDept(value: string){
		// 总是从原数组过滤
		this.deptListClone = this.deptList.filter((item: any)=>{
			return item.pydm.indexOf(value.toUpperCase())>-1
		})
	}

	// 过滤医生
	private filterDoc(value: string){
		// 总是从原数组过滤
		this.docListClone = this.docList.filter((item: any)=>{
			return item.pycode.indexOf(value.toUpperCase())>-1
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
		// padding-top: 8px;
	}
}
.row{
	.el-input{
		margin-right: 0!important;
		::v-deep .el-input__inner{
			width: 160px!important;
		}
	}
	.el-button{
		// height: 28px;
		// margin-left: 4px;
		// padding: 0 10px;
	}
	.read-card{
		height: 28px;
		margin: 0 0 0 4px;
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
		width: calc((100% - 12px*2)/3);
		margin-left: 12px;
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
</style>
