<!--
 * @Date: 2020-05-17 15:15:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-19 14:59:25
 * @description: 诊疗方案维护
-->
<template>
	<div class="content">
		<el-row class="ht" :gutter="10">
			<el-col class="ht" :span="12">
				<div class="his-module his-small">
					<pagenation-list
							ref="pageTable"
							v-model="tableDatas"
							data-url="/op-service/gyzlfa/queryPage"
							http-method="post"
							:list-height="listSlotHeight-2"
							:searchData="searchData"
					>
						<div slot="header" class="row">
							<div class="label">
								<h1 class="title">{{ $t('诊疗方案维护') }}</h1>
								<el-divider direction="vertical" class="mr4"></el-divider>
								<div class="searchTitle">搜索</div>
								<el-input
										v-model="searchData.pydm"
										:placeholder="$t('hospitalDataDict.formValidPyCode')"
										@change="searchList"
								>
									<i slot="prefix" class="el-input__icon icon his-search"></i>
								</el-input>
							</div>
							<div class="operate">
								<el-button
										type="primary"
										class="blue-gra"
										icon="icon his-add"
										size="mini"
										:disabled="!isAdd"
										@click="handleAdd"
								>{{ $t('common.add') }}
								</el-button>
							</div>
						</div>
						<el-table
								:data="tableDatas"
								border
								stripe
								:highlight-current-row="true"
								slot="list"
								fit
								@row-click="handleRowClick"
								:height="listSlotHeight"
								class="scroll-bar"
						>
							<!-- 序号 -->
							<el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
							<!-- 模板名称 -->
							<el-table-column prop="zlmc" :label="$t('treatment.zlmc')" min-width="120">
								<template slot-scope="scope">
									<span v-if="scope.row.zlxh">{{ scope.row.zlmc }}</span>
									<el-input v-else v-model="scope.row.zlmc"></el-input>
								</template>
							</el-table-column>

							<!-- 当前状态 -->
							<el-table-column prop="qybz" :label="$t('common.status')" width="60">
								<template slot-scope="scope">
                  <span :class="scope.row.qybz == 1 ? 'blues' : 'reds'">
                    {{scope.row.qybz == 1 ? $t('common.enable') : $t('common.disable')}}
                  </span>
								</template>
							</el-table-column>

							<!-- 操作 -->
							<el-table-column :label="$t('table.actions')" width="75" align="center">
								<template slot-scope="scope">
									<div>
										<el-tooltip :content="$t('common.delete')" effect="light" v-if="scope.row.zlxh">
											<el-popconfirm
													hideIcon
													:cancelButtonText="$t('common.cancel')"
													:confirmButtonText="$t('common.confirm')"
													:title="$t('sysManage.confirmDeleted')"
													@confirm="handleDelete(scope.row.zlxh)"
											>
												<el-button slot="reference" class="red" :disabled="scope.row.qybz == '1'">
													<i class="icon his-del his-cancellationicon"></i>
												</el-button>
											</el-popconfirm>
										</el-tooltip>
										<el-tooltip :content="$t('common.save')" effect="light" v-if="!scope.row.zlxh">
											<el-button class="blue" @click.stop="handleSaveTemp(scope.row.zlmc)">
												<i class="icon his-save"/>
											</el-button>
										</el-tooltip>
										<!-- 启动停用 -->
										<el-tooltip
												:content="
                        scope.row.qybz == 1
                          ? $t('common.disable')
                          : $t('common.enable')
                      "
												effect="light"
										>
											<el-popconfirm
													class="ml8"
													hideIcon
													:confirmButtonText="
                          scope.row.qybz == '1'
                            ? $t('common.disable')
                            : $t('common.enable')
                        "
													:cancelButtonText="$t('common.cancel')"
													:title="
                          scope.row.qybz == '1'
                            ? $t('sysManage.confirmDisabled')
                            : $t('sysManage.confirmAutomated')
                        "
													@confirm="handleEnable(scope.row)"
											>
												<el-button
														slot="reference"
														:class="[scope.row.qybz == '1' ? 'red' : 'green']"
												>
													<i
															class="icon"
															:class="[
                              scope.row.qybz == '1'
                                ? 'his-disabled'
                                : 'his-automated',
                            ]"
													></i>
												</el-button>
											</el-popconfirm>
										</el-tooltip>
									</div>
								</template>
							</el-table-column>
						</el-table>
					</pagenation-list>
				</div>
			</el-col>
			<el-col class="ht" :span="12">
				<div class="his-module his-small">
					<div slot="header" class="row">
						<div class="label">
							<h1 class="title">{{ $t('treatment.zlfaxq') }}</h1>
						</div>
						<div class="operate">
							<el-button
									type="primary"
									class="green-gra"
									icon="icon his-save"
									size="mini"
									@click="handleSave"
							>{{ $t('common.save') }}
							</el-button>
						</div>
					</div>

					<el-form :model="forms" ref="formValidate" :rules="rules" label-width="60px" class="his-form">
						<el-form-item :label="$t('treatment.zlxh')" prop="zlxh" class="is-disabled his-xuhao">
							<el-input disabled v-model.trim="forms.zlxh" :placeholder="$t('treatment.zlxh')"></el-input>
						</el-form-item>
						<!-- 常用诊断 -->
						<el-form-item :label="$t('treatment.cyzd')" prop="jbxh" :class="forms.qybz?'is-disabled':''">
							<el-select v-model="forms.jbxh" placeholder="请选择" style="width: 260px;" :disabled="forms.qybz">
								<el-option
										v-for="item in ob.cyzt"
										:key="item.jlbh"
										:label="item.zdmc"
										:value="item.jlbh"
								></el-option>
							</el-select>
						</el-form-item>
						<!-- 处方组套编号 -->
						<el-form-item :label="$t('treatment.cfzt')" prop="cfztbh" :class="forms.qybz?'is-disabled':''">
							<el-select v-model="forms.cfztbh" placeholder="请选择" style="width: 260px;" :disabled="forms.qybz">
								<el-option
										v-for="item in ob.cfzt"
										:key="item.ztbh"
										:label="item.ztmc"
										:value="item.ztbh"
								></el-option>
							</el-select>
						</el-form-item>
						<!-- 项目组套编号 -->
						<el-form-item :label="$t('treatment.xmzt')" prop="xmztbh" :class="forms.qybz?'is-disabled':''">
							<el-select v-model="forms.xmztbh" placeholder="请选择" style="width: 260px;" :disabled="forms.qybz">
								<el-option
										v-for="item in ob.xmzt"
										:key="item.ztbh"
										:label="item.ztmc"
										:value="item.ztbh"
								></el-option>
							</el-select>
						</el-form-item>
						<!-- 病历模板序号 -->
						<el-form-item :label="$t('treatment.blmb')" prop="blmbbh" :class="forms.qybz?'is-disabled':''">
							<el-select v-model="forms.blmbbh" placeholder="请选择" style="width: 260px;" :disabled="forms.qybz">
								<el-option
										v-for="item in ob.blmb"
										:key="item.jlxh"
										:label="item.mbmc"
										:value="item.jlxh"
								></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  IformTreat,
  addTreatment,
  deleteTreatment,
  enableTreatment,
  disableTreatment,
  queryLists,
  saveDetail
} from '@/api/cis/op/dctwork/treamentSet'
import { isNullOrUndefined } from 'util'
import { Form } from 'element-ui'
import { checkStrIsNull } from '@/utils'

const NformTreat: IformTreat = {
  blmbbh: null,
  cfztbh: null,
  jbxh: null,
  jgid: null,
  ksdm: null,
  pydm: '',
  qybz: null,
  sslb: null,
  xmztbh: null,
  ygdm: null,
  zlmc: '',
  zlxh: null
}
//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'TreatmentSet',
  components: {}
})
export default class extends Vue {
  private tableDatas: IformTreat[] = []
  private forms: IformTreat = { ...NformTreat }
  private listSlotHeight: number = 0
  private isAdd: boolean = true
  private searchData: any = {
    pageNum: 1,
    pageSize: 10,
    pydm: ''
  }
  private ob: any = {
    cyzt: [],
    cfzt: [],
    xmzt: [],
    blmb: []
  }
  private rules: any = {}

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 60 - 45
  }

  mounted() {
    this.getList()
  }

  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private searchList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

  private handleAdd() {
    this.isAdd = false
    let param = Object.assign({}, NformTreat)
    this.tableDatas.splice(0, 0, param)
  }

  private handleEdit(value: IformTreat) {
    // value.isEdit = !value.isEdit
  }

  private handleSave() {
    ;(this.$refs.formValidate as Form).validate((valid) => {
      if (valid) {
        // console.log("this.forms",this.forms)
        if (this.forms != null && this.forms.zlxh == null) {
          this.$notify({
            type: 'warning',
            title: '选择方案无法保存！',
            message: ''
          })
          return
        }
        saveDetail(this.forms).then(() => {
          this.$notify({
            type: 'success',
            title: '保存成功',
            message: ''
          })
          this.getList()
          this.isAdd = true
        })
      }
    })
  }

  /**
   * @LastEditors: zhml
   * @Description: file content
   * @param {type} params
   * @return:
   */
  private handleEnable(value: any) {
    // console.log('llllll', value)
    if (value.qybz == 1) { // 启用状态
      disableTreatment({ zlxh: value.zlxh }).then(() => {
        this.$notify({
          type: 'success',
          title: '已停用',
          message: ''
        })
      })
    } else if (value.qybz == 0) { // 停用状态
      enableTreatment({ zlxh: value.zlxh }).then(() => {
        this.$notify({
          type: 'success',
          title: '已启用',
          message: ''
        })
      })
    }
    this.getList()
  }

  private refreshList(value: number) {
    if (value) {
      this.searchData.sslb = value
      const pageTable: any = this.$refs.pageTable
      pageTable.searchList()
    }
  }

  private handleRowClick(val: any) {
    console.log(val)
    // console.log(',,,sss', val)
    this.forms = { ...val }
    queryLists({}).then((res) => {
      this.ob.cyzt = res.data.cyzt
      this.ob.cfzt = res.data.cfzt
      this.ob.xmzt = res.data.xmzt
      this.ob.blmb = res.data.blmb
    })
  }

  private handleSaveTemp(value: string) {
    if (checkStrIsNull(value)) {
      this.$notify({
        type: 'warning',
        title: '请输入诊疗方案名称',
        message: ''
      })
    } else {
      addTreatment({ zlmc: value }).then(() => {
        this.$notify({
          type: 'success',
          title: '新增成功',
          message: ''
        })
        this.isAdd = true
        this.getList()
      })
    }
  }

  /**
   * @LastEditors: zhml
   * @Description: 删除接口
   * @param {type} params
   * @return:
   */
  private handleDelete(val: number) {
    deleteTreatment({ zlxh: val }).then(() => {
      this.$notify({
        type: 'success',
        title: '删除成功',
        message: ''
      })
      this.getList()
    })
  }
}
</script>

<style lang="scss" scoped>

.el-divider--vertical {
	/* ui 明确要求 8.17 确认过  */
	margin: 0 10px !important;
}

.top-header {
	position: relative;
	padding: 8px 16px;
	background: #fff;
	border-radius: 8px;

	.main-header {
		padding-bottom: 10px;
		border-bottom: 1px solid #f5f6f8;
	}
}

::v-deep .search-select {
	width: 260px;

	::v-deep .el-select {
		width: 100%;

		.el-input__inner {
			width: 100% !important;
		}
	}
}

::v-deep .el-input {
	height: 28px !important;

	.el-input__prefix {
		margin: 0px 8px 0 10px !important;
	}

	.el-input__inner {
		@extend .el-input
	}
}

/*.content .his-module .el-form {*/
/*	margin: 24px 90px;*/
/*	display: flex;*/
/*	flex-direction: column;*/
/*}*/

//form框
.his-form {
	margin: 24px 90px;
	display: flex;
	flex-direction: column;
	width: auto;
	align-items: center;
	.el-form .el-input {
		width: 260px;
	}
	.el-form-item {
		margin-bottom: 16px;
	}
	.his-xuhao {
		.el-input--medium {
			width: 260px;
			.el-input__inner {
				font-family: siyuanMedium;
				color: #1485ff;
			}
		}
	}

}


.el-select {
	.el-input {
		width: 260px;
	}
}


</style>
