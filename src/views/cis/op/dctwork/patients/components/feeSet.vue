<!--
 * @Date: 2020-05-27 09:24:20
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-01 16:42:59
 * @description: 诊间结算
-->

<template>
	<div class="module ht">
		<div class="his-module his-small ht">
			<div class="block action">
				<i class="icon his-basic-info blue"/>
				<span>基本信息</span>
				<el-divider direction="vertical" class="mr4"></el-divider>
				<el-button size="mini" type="text" style="padding: 0">
					<i class="icon his-btn-confirm green"></i>{{ $t('common.confirm') }}
				</el-button>
			</div>
			<el-form
					:model="ruleForm"
					ref="ruleFormRef"
					label-position="left"
					label-width="68px"
			>
				<div class="grid-4">
					<el-form-item :label="'卡号'" class="inline">
						<el-input
								v-model="ruleForm.patientName"
								placeholder="请输入"
						></el-input>
						<el-button
								type="primary"
								size="mini"
								style="margin-left: 4px;height: 28px"
						>{{ $t('patients.dk') }}
						</el-button
						>
					</el-form-item>
					<el-form-item :label="'姓名'">
						<el-input
								v-model="ruleForm.patientName"
								placeholder="请输入"
						></el-input>
					</el-form-item>
					<el-form-item :label="'证件类型'">
						<el-input
								v-model="ruleForm.patientName"
								placeholder="请输入"
						></el-input>
					</el-form-item>
					<el-form-item :label="'卡内余额'">
						<el-input
								v-model="ruleForm.patientName"
								placeholder="请输入"
						></el-input>
					</el-form-item>
				</div>
				<div class="block action">
					<i class="icon his-module_division_fapiao blue"/>
					<span>发票情况</span>
				</div>
				<div class="grid-4 mt10">
					<el-form-item :label="'总计金额'">
						<el-input
								v-model="ruleForm.patientName"
								class="text-blue"
								placeholder="请输入"
						></el-input>
					</el-form-item>
					<el-form-item :label="'其他应收'">
						<el-input
								v-model="ruleForm.patientName"
								class="text-blue"
								placeholder="请输入"
						></el-input>
					</el-form-item>
					<el-form-item :label="'自付金额'">
						<el-input
								v-model="ruleForm.patientName"
								class="text-blue"
								placeholder="请输入"
						></el-input>
					</el-form-item>
				</div>
				<div class="block action">
					<i class="icon his-module_division_shoukuan blue"/>
					<span>收款金额</span>
				</div>
				<div class="grid-4">
					<el-form-item :label="'应收款'">
						<el-input
								v-model="ruleForm.patientName"
								class="text-red"
								placeholder="请输入"
						></el-input>
					</el-form-item>
					<el-form-item :label="'其他应收'">
						<!-- <el-input v-model="ruleForm.patientName"></el-input> -->
						<el-select v-model="value" placeholder="请选择">
							<el-option
									v-for="item in options"
									:key="item.value"
									:label="item.label"
									:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="'缴款'">
						<el-input
								v-model="ruleForm.patientName"
								class="text-red"
								placeholder="请输入"
						></el-input>
					</el-form-item>
					<el-form-item :label="'退找'">
						<el-input
								v-model="ruleForm.patientName"
								class="text-red"
								placeholder="请输入"
						></el-input>
					</el-form-item>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'FeeRecord',
  filters: {}
})
export default class extends Vue {
  private ruleForm: any = {}

  mounted() {
  }

  private submitForm() {
  }

  private resetForm() {
  }

  private value: string = ''
  private options: any[] = []
}
</script>

<style lang="scss" scoped>
.block {
	border-bottom: 1px solid #f0f0f0;
	padding: 6px 0px;
	margin-bottom: 10px;
	font-size: 14px;
	font-weight: 500;
	width: 100%;
}

.action {
	.icon {
		margin-right: 4px;
		font-size: 16px !important;
	}
}

.content .his-module .el-form {
	margin: 0 !important;
}

::v-deep .el-form-item {
	& + .el-form-item {
		padding-left: 20px;
	}

	.el-form-item__content {
		display: flex;
	}
}

.mr4 {
	margin-right: 4px;
}

.grid-4 {
	width: 100%;
	display: grid !important;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-template-rows: 46px;
	line-height: 28px;
}

.content .his-small .el-form .el-form-item {
	margin-bottom: 18px;
}
</style>
