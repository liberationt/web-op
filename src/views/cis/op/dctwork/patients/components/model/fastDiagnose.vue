<!--
* @Date: 2020-05-21 14:17:06
* @LastEditors: zhml
* @LastEditTime: 2020-06-12 10:50:39
* @description: 右侧诊断
-->

<template>
    <div class="ht his-module his-small his-mini his-patient-fast"
         :class="{ height: heightFast- 76 - 54 + 'px' }">
        <div v-if="!rightOpen"
             @click="openRight()"
             class="action"
             style="padding-top: 10px;">
            <i class="icon his-card-put gray" />
        </div>
        <div v-if="rightOpen"
             class="home-row">
            <el-radio-group v-model="form.rsbz"
                            @change="changeList">
                <el-radio :label="1"
                          class="box-mar">
                    <span>{{ $t('diagnosis.xyzdkssr') }}</span>
                </el-radio>
                <el-radio :label="2"
                          class="box-mar"
                          style="margin-right: 20px;">
                    <span>{{ $t('diagnosis.zyzdkssr') }}</span>
                </el-radio>
                <div v-show="rightOpen"
                     @click="closeRight()"
                     class="action">
                    <i class="icon his-card-open gray"></i>
                </div>
            </el-radio-group>

        </div>
        <!-- 西医诊断 -->
        <div v-if="form.rsbz == 1 && rightOpen"
             class="ht mt8">
            <div class="tab-btn scroll-bar"
                 style="padding: 6px, 0px;">
                <div class="tab-row">
                    <el-tabs v-model="btnValue"
                             class="tab-small underline his-patient-tab-diag">
                        <el-tab-pane v-for="(item, index) in tabBlocks"
                                     :key="index"
                                     :label="item.title"
                                     :name="item.name"
                                     :style="{ height: listSlotHeight - 120 + 'px' }">

                            <div v-if="btnValue == '1'">
                                <!-- 诊断名称和诊断编码的列表 -->
                                <diagnose-list @setData="setData"
                                               :is-exit="false"
                                               :search-data="searchDataList"
                                               v-if="item.name == btnValue"
                                               :is-half="false"
                                               ref="diagnose"></diagnose-list>
                            </div>
                            <div v-if="btnValue == '2'">
                                <!-- 诊断部位	-->
                                <div class="his-module his-mini his-patient-body">
                                    <el-table :data="diagnoseBodyList"
                                              border
                                              stripe
                                              :highlight-current-row="true"
                                              slot="list"
                                              @row-dblclick="handleLeftDblclick"
                                              class="scroll-bar"
                                              style="overflow: auto">
                                        <!-- 部位名称 -->
                                        <el-table-column prop="dn"
                                                         :label="'部位名称'"
                                                         min-width="70"></el-table-column>
                                    </el-table>
                                </div>
                            </div>
                            <div v-if="btnValue == '3'">
                                <diagnosisEnter v-if="item.name === btnValue"
                                                :is-half="false"
                                                @setObjInput="setObjInput"></diagnosisEnter>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
        <!-- 中医诊断 -->
        <div v-if="form.rsbz == 2 && rightOpen"
             class="ht mt8">
            <div class="tab-btn"
                 style="padding: 6px, 0px;">
                <div class="tab-row">
                    <el-tabs v-model="btnValue"
                             class="tab-small underline his-patient-tab-diag">
                        <el-tab-pane v-for="(item,index) in tabBlockz"
                                     :key="index"
                                     :label="item.title"
                                     :name="item.name"
                                     :style="{ height: listSlotHeight - 130 + 'px' }">
                            <!--							<div class="header-row">-->
                            <!--								<div class="label">搜索</div>-->
                            <!--								<div class="row-input">-->
                            <!--									<el-input-->
                            <!--											v-model="searchDataList.pydm"-->
                            <!--											:placeholder="$t('common.placeholder')"-->
                            <!--											@keydown.native.enter="getList"-->
                            <!--											clearable-->
                            <!--									>-->
                            <!--										<i slot="prefix" class="el-input__icon icon his-search"></i>-->
                            <!--									</el-input>-->
                            <!--								</div>-->
                            <!--							</div>-->
                            <div v-if="btnValue == '4'">
                                <!-- 诊断名称和诊断编码的列表 -->
                                <diagnose-list @setData="setData"
                                               :is-exit="false"
                                               :search-data="searchDataList"
                                               v-if="item.name == btnValue"
                                               :is-half="true"
                                               ref="diagnose"></diagnose-list>
                            </div>
                            <div v-if="btnValue == '5'">
                                <diagnosisEnterZY v-if="item.name === btnValue"
                                                  :is-half="true"
                                                  @setObjInputZY="setObjInputZY"></diagnosisEnterZY>
                            </div>

                            <!--							<div class="header-row">-->
                            <!--								<div class="label">搜索</div>-->
                            <!--								<div class="row-input">-->
                            <!--									<el-input-->
                            <!--											v-model="searchDataList.pydm"-->
                            <!--											:placeholder="$t('common.placeholder')"-->
                            <!--											@keydown.native.enter="getList"-->
                            <!--											clearable-->
                            <!--									>-->
                            <!--										<i slot="prefix" class="el-input__icon icon his-search"></i>-->
                            <!--									</el-input>-->
                            <!--								</div>-->
                            <!--							</div>-->
                            <div class="mt10">
                                <symptom @setObjInput="setObjInputOld" />
                            </div>

                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import diagnoseList from './diagnoseList.vue'
import symptom from '../symptom.vue'
import diagnosisEnter from './diagnosisEnter.vue'
import diagnosisEnterZY from '@/views/cis/op/dctwork/patients/components/model/diagnosisEnterZY.vue'

@Component({
  name: 'fastDiagnose',
  components: { diagnoseList, symptom, diagnosisEnter,diagnosisEnterZY }
})
export default class extends Vue {
  @Prop({ required: true }) private value!: any

  private form: any = {
    rsbz: 1
  }
  private tabBlocks: any[] = []
  private tabBlockz: any[] = []
  private btnValue: string = '1'
  private rightOpen: boolean = false
  private listSlotHeight: number = 0
  private heightFast: number = 0
  private usualList: Array<any> = [] //常用诊断列表--中医&西医
  private diagnoseBodyList: Array<any> = [] //诊断部位
  private kslb: number = Vue.prototype.AUTHORITY.kslb
  private searchData: any = {
    jzkh: ''
  }
  private searchDataList: any = {
    pageNum: 1,
    pageSize: 10,
    cflx: '1',
    pydm: '',
    sslb: 1

  }
  private searchObj: any = {
    cflx: '1',
    pydm: '',
    sslb: '1'
  }

  mounted() {
    this.diagnoseBodyList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DIAGNOSE_BODY_PART : this.$store.state.webSqlDict.DIAGNOSE_BODY_PART
    this.tabBlocks = [
      {
        name: '1',
        title: '常用诊断'
      },
      {
        name: '2',
        title: '诊断部位'
      },
      {
        name: '3',
        title: '诊断录入'
      }
    ]
    this.tabBlockz = [
      {
        name: '4',
        title: '常用诊断'
      },
      {
        name: '5',
        title: '诊断录入'
      }
    ]
  }


  private handleLeftDblclick(val: any) {
    this.$emit('setObjOld', val)
  }

  private setObjInput(row: any) {
	console.log(237,row)
    this.$emit('setObjInput', row)
  }

  private setObjInputZY(row:any) {
    this.$emit('setObjInputZY',row)
  }
  private setObjInputOld(row: any) {
    this.$emit('setObjInputOld', row)
  }

  private openRight() {
    this.$emit('showRight', 16)
    this.rightOpen = true
  }

  private closeRight() {
    this.$emit('showRight', 23)
    this.rightOpen = false
  }

  private setData(val: any) {
    this.$emit('setData', val)
  }

  private getList() {
	// (this.$refs.diagnose as any).getList()
  }

  //中西医诊断列表切换
  private changeList(value: string | number) {
	if(this.kslb == 1) {
		if (value == 1) {
		  this.btnValue = '1'
		}else {
		  this.btnValue = '4'
		}
		this.searchObj.cflx = value
		this.searchDataList.cflx = value
	} else{
		this.form.rsbz = 1
		this.$message.warning('非中医科室不能选择中医诊断')
	}



  }
}
</script>
<style lang="scss" scoped>
.his-patient-fast {
	padding: 8px 10px !important;
	overflow: hidden;

	.header-row {
		display: flex;
		flex-flow: row nowrap;
		padding-bottom: 8px;

		.label {
			width: 40px;
			font-size: 13px;
			align-self: center;
			margin-right: 8px;
		}

		.row-input {
			height: 28px;
			width: 100%;
			background: rgba(245, 246, 248, 1);
			border-radius: 4px;
			margin-right: 6px;

			::v-deep .el-input__inner {
				width: 108px;
				height: 28px;
				background: rgba(245, 246, 248, 1);
				border-radius: 4px;
				margin-right: 6px;
				border: none;
			}
		}

		.el-button--primary {
			padding: 0px;
			width: 48px;
			height: 24px;
			border-radius: 4px;
			justify-content: center;
			margin-top: 3px;
		}
	}


	.tab-btn {
		height: 100%;
		.tab-row {
			height: 100%;
			.his-patient-tab-diag {
				height: 100%;
				.el-tabs__content {
					height: 100%;
				}
			}
		}
	}
	::v-deep .his-patient-tab-diag {
		.el-tabs__header {
			padding: 0 0 8px 0 !important;
			margin-bottom: 0 !important;
		}
	}

	.his-patient-body {
		padding: 0 !important;
	}
}

.action {
	display: flex !important;
	justify-content: center;
}

.home-row {
	padding: 4px 0 8px 0 !important;
	border-bottom: 1px solid #f0f0f0;

}



.el-radio-group {
	display: flex !important;
}

.el-radio__label {
	span {
		font-size: 13px;
	}
}

::v-deep .el-tabs__header {
	padding-left: 0px !important;
}

::v-deep .el-table__body-wrapper {
	overflow: hidden;
}

::v-deep .el-input__prefix {
	left: 8px;
	top: -4px;
}
</style>
