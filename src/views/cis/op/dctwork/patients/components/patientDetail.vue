<!--
 * @Date: 2020-06-07 09:22:25
 * @LastEditors: zhml
 * @LastEditTime: 2020-09-09 17:59:31
 * @description:
-->

<template>
    <div>
        <!-- 患者情况 -->
        <div class="brief">
            <div class="block">
                <!-- 头像 -->
                <div class="image" @click="turnDetail">
                  <img style="height: 32px;" src="@/assets/patient-manage-img/menzhen-morentouxiang.png" />
                </div>
                <!-- 名字+logo -->
                <div class="detail" @click="turnDetail">
                    <div class="text">{{patientFile.brxm}}</div>
                    <!-- 是否过敏标志 -->
                    <div style="width: 16px; height: 16px;" v-if="patientFile.sfgm">
                        <img src="@/assets/patient-manage-img/ming@2x.png"
                          style="width: 16px; height: 16px;" />
                    </div>
                </div>
                <el-divider direction="vertical"></el-divider>
                <!-- 性别，出生日期 -->
                <div class="detail">
                    <div class="his-line">
                        <div class="form-item">{{ $t('patients.brxb') }}:</div>
                        <div class="form-label">{{patientFile.brxbName}}</div>
                    </div>
                    <div class="his-line">
                        <div class="form-item">{{ $t('patients.csrq') }}:</div>
                        <div class="form-label">{{patientFile.csny}}</div>
                    </div>
                </div>
                <el-divider direction="vertical"></el-divider>
                <!-- 就诊卡号，记录册号 -->
                <div class="detail">
                    <div class="his-line">
                        <div class="form-item">{{ $t('就诊卡号') }}:</div>
                        <div class="form-label">{{patientFile.jzkh}}</div>
                    </div>
                    <div class="his-line">
                        <div class="form-item">{{ $t('patients.jlch') }}:</div>
                        <div class="form-label">{{patientFile.jlch}}</div>
                    </div>
                </div>
                <el-divider direction="vertical"></el-divider>
                <!-- 科室，就诊时间 -->
                <div class="detail">
                    <div class="his-line">
                        <div class="form-item">{{ $t('patients.ks') }}:</div>
                        <div class="form-label">{{patientFile.zsidName}}</div>
                    </div>
                    <div class="his-line">
                        <div class="form-item">{{ $t('patients.jzsj') }}:</div>
                        <div class="form-label">{{patientFile.jzrq}}</div>
                    </div>
                </div>
                <el-divider direction="vertical"></el-divider>
                <!-- 收费类型，身份证号 -->
                <div class="detail">
                    <div class="his-line">
                        <div class="form-item">{{ $t('patients.sflx') }}:</div>
                        <div class="form-label">{{patientFile.brxzName}}</div>
                    </div>
                    <div class="his-line">
                        <div class="form-item">{{ $t('patients.sfzh') }}:</div>
                        <div class="form-label">{{ patientFile.sfzh?getSfz(patientFile.sfzh):'' }}</div>
                    </div>
                </div>
            </div>
            <div class="block">
                <!-- 待诊，束诊，下一个 -->
                <div class="operate">
                    <div class="btn"
                         @click="handleDz">{{ $t('patients.dz') }}</div>
                    <div class="btn"
                         @click="handleSz">{{ $t('patients.sz') }}</div>
                    <div class="btn green"
                         @click="handleNext"
                         style="margin-right: 0px;">
                        {{ $t('patients.xyg') }}
                    </div>
                </div>
            </div>
        </div>
        <!-- 查看并修改患者信息 -->
        <add-patient :doctorFlag="doctorFlag" :patientInfo="curRow" ref="add-patient" />
        <el-dialog :visible.sync="isVisiable"
                   width="60%"
                   append-to-body
                   class="narrow-dialog"
                   @closed="closed">
            <div slot="title">
                <div>{{ $t('结诊信息') }}</div>
            </div>
            <div class="content his-patient">
                <div class="his-patient-jz his-module his-small">
                    <el-form ref="form"
                             :model="patientFile"
                             label-width="70px"
                             class="main-form">
                        <div class="row">
                            <i class="icon his-template blue"></i>
                            <span>去向</span>
                            <el-radio-group v-model="brqx"
                                            class="his-sz">
                                <el-radio :label="3">住院</el-radio>
                                <el-radio :label="1">离院</el-radio>
                                <el-radio :label="2">留观</el-radio>
                                <el-radio :label="4">死亡</el-radio>
                            </el-radio-group>

                        </div>

                        <div class="row">
                            <i class="icon his-template blue"></i>
                            <span>此次就诊</span>
                        </div>
                        <!--					<el-form ref="form" :model="patientFile" label-width="70px" class="main-form">-->
                        <div class="form-grid">
                            <el-form-item :label="'患者姓名'">
                                <el-input v-model="patientFile.brxm"
                                          disabled></el-input>
                            </el-form-item>
                            <el-form-item :label="'患者性质'">
                                <el-input v-model="patientFile.brxzName"
                                          disabled></el-input>
                            </el-form-item>
                            <el-form-item :label="'处方数量'">
                                <el-input v-model="patientFile.cfsl"
                                          disabled></el-input>
                            </el-form-item>
                        </div>
                        <div class="form-grid">
                            <el-form-item :label="'处方金额'">
                                <el-input v-model="patientFile.cfje"
                                          disabled></el-input>
                            </el-form-item>
                            <el-form-item :label="'处置数量'">
                                <el-input v-model="patientFile.jcsl"
                                          disabled></el-input>
                            </el-form-item>
                            <el-form-item :label="'处置金额'">
                                <el-input v-model="patientFile.jcje"
                                          disabled></el-input>
                            </el-form-item>
                        </div>
                        <div class="form-grid">
                            <el-form-item :label="'未付款'">
                                <el-input v-model="patientFile.wfk"
                                          disabled></el-input>
                            </el-form-item>
                            <el-form-item :label="'已付款'">
                                <el-input v-model="patientFile.yfk"
                                          disabled></el-input>
                            </el-form-item>
                            <el-form-item :label="'合计'">
                                <el-input v-model="patientFile.hj"
                                          disabled></el-input>
                            </el-form-item>
                        </div>
                    </el-form>

                    <!--					<div class="row">-->
                    <!--						<i class="icon his-template blue"></i>-->
                    <!--						<span>复制预约</span>-->
                    <!--					</div>-->
                    <!--					<el-form ref="form" :model="formSj" label-width="70px" class="main-form">-->
                    <!--						<div class="form-grid">-->
                    <!--							<el-form-item :label="'预约日期'">-->
                    <!--								<el-date-picker-->
                    <!--										v-model="formSj.yyrq"-->
                    <!--										type="date"-->
                    <!--										value-format="yyyy-MM-dd"-->
                    <!--										start-placeholder="开始时间"-->
                    <!--										end-placeholder="结束时间"-->
                    <!--										class="date-wrapper"-->
                    <!--								></el-date-picker>-->
                    <!--							</el-form-item>-->
                    <!--							<el-form-item :label="'值班类别'">-->
                    <!--								<el-select v-model="formSj.zblb" placeholder="请选择">-->
                    <!--									<el-option label="上午" :value="1"></el-option>-->
                    <!--									<el-option label="下午" :value="2"></el-option>-->
                    <!--								</el-select>-->
                    <!--							</el-form-item>-->
                    <!--							<el-form-item :label="'预约时间'">-->
                    <!--								<el-time-select-->
                    <!--										v-model="formSj.yysj"-->
                    <!--										class="date-wrapper"-->
                    <!--										:picker-options="{-->
                    <!--										    start: '08:30',-->
                    <!--										    step: '00:15',-->
                    <!--										    end: '18:30'-->
                    <!--										  }"-->
                    <!--										placeholder="选择时间"-->
                    <!--								></el-time-select>-->
                    <!--							</el-form-item>-->
                    <!--						</div>-->
                    <!--					</el-form>-->
                </div>
            </div>
            <span slot="footer"
                  class="dialog-footer">
                <el-button @click="isVisiable = false">取消</el-button>
                <el-button type="primary"
                           @click="handleSubmit">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import addPatient from '@/components/addPatient/index.vue'
import { savePatientFile, handleOn, loadInfo, saveYyxx, deleteMsbrzd, nextPatient } from '@/api/cis/op/dctwork/patients'
import { AxiosResponse } from 'axios'
import { changeSfz, id2Name } from '@/utils'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'PatientDetail',
  components: {
    addPatient
  }
})
export default class extends Vue {
  @Prop({ required: true }) private value!: any
  @Prop({ required: true }) private patientObj!: any
  @Prop({ required: true }) private pnParam!: any

  get patientFile() {
    if(this.value.morePatient && this.value.morePatient == 2) {
      this.$set(this.value,'zsidName',this.value.ksdmName)
    }
    console.log(this.value)
    return this.value
  }

  set patientFile(val: any) {
    this.$emit('input', val)
  }

  private doctorFlag: number = 2
  private isVisiable: boolean = false
  private curRow: any = {}
  private yyrq: string = ''
  private formSj: any = {
    zblb: '',
    yysj: '',
    brqx: 3
  }
  private zblb: string = ''
  private yysj: string = ''
  private brqx: number = 3
  private sexList:Array<any> = []
  private brxzList:Array<any> = []

  mounted() {
    this.brxzList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_PATIENT_DICT : this.$store.state.webSqlDict.TABLE_PATIENT_DICT
  }

  getSfz(value:string) {
    console.log('value',value)
    return changeSfz(value)
  }

  // 跳转个人信息详情
  private turnDetail() {
	  this.curRow = this.patientFile
    var a: any = this.$refs['add-patient']
    a.addDialog(this.curRow.jzkh)
  }

  // 待诊
  private handleDz() {
    if (!this.pnParam.brid) {
      this.$message.info('请选择病人再操作')
      return
    }
    this.$confirm(`确定要进行暂诊操作吗?
                  `, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }).then(() => {
      let msg = '请先保存主诉'
      // if (this.patientObj.zsxx == '' || this.patientObj.zsxx == null) {
      //   this.$message.warning('请先保存主诉')
      //   throw msg
      // }
      // savePatientFile(this.patientObj).then(() => {
      //   let obj = {
      //     brid: this.pnParam.brid,
      //     brqx: 1,
      //     ghks: Vue.prototype.AUTHORITY.bussinessRole,
      //     jzxh: this.pnParam.jzxh,
      //     jzzt: 2,
      //     updatingDoctor: 0
      //   }
      //   handleOn(obj).then((res: AxiosResponse) => {
      //     this.$emit('refreshTab', true)
      //   })
      // })
      let obj = {
            brid: this.pnParam.brid,
            ghks: Vue.prototype.AUTHORITY.bussinessRole,
            jzxh: this.pnParam.jzxh,
            jzzt: 2,
			updatingDoctor: 0,
			jzlsh: this.pnParam.jzlsh
          }
        handleOn(obj).then((res: AxiosResponse) => {
		  this.$emit('refreshTab', true)
        })
    })


  }

  private closed() {
  }

  // 束诊弹窗
  private handleSz() {
    if (!this.pnParam.brid) {
      this.$message.info('请选择病人再操作')
      return
    }
    loadInfo({
      brid: this.pnParam.brid,
      jzxh: this.pnParam.jzxh
    }).then((res: AxiosResponse) => {
      for (let patientFileKey in res.data) {
        this.$set(this.patientFile, patientFileKey, res.data[patientFileKey])
      }

      this.$set(this.patientFile, 'brxzName', this.brxzList.find((item: any) => item.dv == this.pnParam.brxz).dn)
    })
    this.isVisiable = true
  }

  // 束诊按钮
  private handleSubmit() {

    let obj = {
      brid: this.pnParam.brid,
      jzkh: this.pnParam.jzkh,
	    jzxh: this.pnParam.jzxh,
	    brqx: this.brqx,
      ksdm: Vue.prototype.AUTHORITY.outpatientCode,
      sbxh: this.pnParam.jzxh,
	    jzzt: 9,
	    jzlsh: this.pnParam.jzlsh,
      ghks: Vue.prototype.AUTHORITY.bussinessRole
      // yyrq: this.formSj.yyrq.toLocaleString(),
      // yysj: this.formSj.yysj.toLocaleString(),
      // zblb: this.formSj.zblb
    }
    // saveYyxx(obj).then(() => {
    //   this.$notify({
    //     type: 'success',
    //     title: '已束诊',
    //     message: ''
    //   })
    //   this.$emit('refreshTab', true)
    //   this.isVisiable = false
    // })

    handleOn(obj).then((res: AxiosResponse) => {
      this.$notify({
        type: 'success',
        title: '已束诊',
        message: ''
      })
      this.$emit('refreshTab', true)
      this.isVisiable = false
    })
    // savePatientFile(this.patientObj).then(() => {
    //   let obj = {
    //     brid: this.pnParam.brid,
    //     brqx: this.brqx,
    //     ghks: Vue.prototype.AUTHORITY.bussinessRole,
    //     jzxh: this.pnParam.jzxh,
    //     jzzt: 2
    //   }
    //   handleOn(obj).then((res: AxiosResponse) => {
    //     this.$notify({
    //       type: 'success',
    //       title: '已束诊',
    //       message: ''
    //     })
    //     this.$emit('refreshTab', true)
    //     this.isVisiable = false
    //   })
    // })
  }

  // 下一个
  private handleNext() {
	if (this.pnParam.brid && this.pnParam.jzzt != 9) {
      this.$message.info('病人就诊未结束，不可点击下一个！')
      return
	}
	this.$confirm(`确定要进行下一个操作吗？`,'提示',{
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'info'
	}).then(() => {
		const params: any = {
			ghks: Vue.prototype.AUTHORITY.bussinessRole,
			jzkh: '',
			ksdm: Vue.prototype.AUTHORITY.outpatientCode,
			patientType: '1'
		}
		nextPatient(params).then((res: any) => {
			let param: any = { ...res.data }
    		param.ghxh = res.data.sbxh
    		param.ksdm = Vue.prototype.AUTHORITY.outpatientCode
			// this.$emit('refreshTab', true)
			this.$emit('nextPatient', param)
		})
	})
  }
}
</script>

<style lang="scss" scoped>
.brief {
	width: 100%;
	height: 60px;
	background: #fff;
	border-radius: 8px;
	position: relative;
	padding: 8px 10px;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;

	.block {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;

		.image {
			width: 42px;
			height: 50px;
			background: rgba(240, 240, 240, 1);
			border-radius: 4px;
			margin-right: 8px;
			justify-content: center;
			display: flex;
			align-items: center;
		}

		.detail {
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.text {
				font-size: 20px;
				font-weight: 500;
				color: rgba(34, 43, 49, 1);
				line-height: 30px;
			}

			.icon {
				color: rgba(255, 191, 0, 0.1);
				border: 1px solid rgba(255, 191, 0, 1);
				font-size: 16px;
			}

			.his-line {
				display: flex;
				flex: 1;
				align-items: center;

				.form-item {
					width: 60px;
					font-size: 12px;
					font-weight: 400;
					color: rgba(106, 109, 120, 1);
					line-height: 18px;
				}

				.form-label {
					font-size: 12px;
					font-weight: 400;
					color: rgba(34, 43, 49, 1);
					line-height: 18px;
				}
			}
		}

		.operate {
			display: inline-flex;

			.btn {
        cursor: pointer;
				width: 73px;
				height: 34px;
				background: linear-gradient(
								315deg,
								rgba(45, 187, 255, 1) 0%,
								rgba(20, 133, 255, 1) 100%
				);
				border-radius: 5px;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 14px;
				color: #fff;
				margin-right: 8px;

				&.green {
					background: linear-gradient(
									43deg,
									rgba(15, 202, 173, 1) 0%,
									rgba(70, 220, 210, 1) 100%
					);
				}
			}
		}
	}
}


.his-patient {
	height: 100%;
	padding: 0 !important;

	.his-patient-jz {
		.row {
			justify-content: start;
			font-family: siyuanMedium;
			padding: 0 0 9px 0 !important;
			margin-bottom: 9px;
			.his-sz {
				margin-left: 20px;
			}
		}

		// .el-radio-group {
		// 	/*margin-left: 60px;*/
		// }

		.main-form {
			.form-grid {
				display: grid;
				grid-column-gap: 16px;
				grid-template-columns: repeat(3, 30%);
				grid-row-gap: 10px;

				.el-form-item {
					margin-bottom: 10px;
				}
			}

			.form-grid-qx {
				display: grid;
				grid-column-gap: 16px;
				/*grid-template-columns: repeat(3, 30%);*/
				grid-row-gap: 10px;

				.el-form-item {
					margin-bottom: 10px;

					.el-form-item__content {
						margin-top: 4px;
					}
				}
			}
		}

	}
}

</style>
