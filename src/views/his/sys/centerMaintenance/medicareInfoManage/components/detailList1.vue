<!--
 * @Date: 2020-05-15 10:16:45
 * @LastEditors: dl
 * @LastEditTime: 2020-06-19 15:03:37
 * @description:
 -->
<template>
	<div class="his-module his-small his-suite">
		<div slot="header" class="row">
			<div class="label">
				<span class="title">{{$t('组套详细')}}</span>
				<el-divider direction="vertical" ></el-divider>
				<div class="btn">
					<el-button size="mini" type="text" @click="handleInsert" :disabled="searchDataDetail.ztlb =='' ">
						<i class="icon his-inserting blue"></i>
						<span>{{$t('examineSuite.insert')}}</span>
					</el-button>
					<el-button
							size="mini"
							type="text"
							@click="handleNewGroup"
							:disabled="searchDataDetail.ztlb =='' "
					>
						<i class="icon his-group blue"></i>
						<span>{{$t('examineSuite.newGroup')}}</span>
					</el-button>
					<el-button size="mini" type="text" @click="handleSaveAll">
						<i class="icon his-btn-save green"></i>
						<span>{{$t('common.save')}}</span>
					</el-button>
				</div>
			</div>
		</div>
		<div v-if="searchDataDetail.ztlb != 4">
			<!-- 西药  成药  草药-->
			<!--			<edit-table-->
			<!--					v-model="tableDatas"-->
			<!--					slot="list"-->
			<!--					:height="listSlotHeight"-->
			<!--					:headerArray="searchDataDetail.ztlb < 3 ? headerArray1 : headerArray2"-->
			<!--					:showFooter="false"-->
			<!--					ref="editTable"-->
			<!--			>-->
			<!--				&lt;!&ndash; 用插槽的方式写操作按钮列 &ndash;&gt;-->
			<!--				<div slot="button" slot-scope="data">-->
			<!--					<el-button @click="handleDelete(data)">-->
			<!--						<i class="icon his-del his-cancellationicon"/>-->
			<!--					</el-button>-->
			<!--				</div>-->
			<!--			</edit-table>-->


			<el-table
					:data="tableDatas"
					border
					stripe
					:highlight-current-row="true"
					:height="listSlotHeight"
					class="scroll-bar"
					:row-class-name="tableRowClassName"
					@row-click="handleGetIndex"
			>
				<el-table-column width="16" class-name="color-group">
					<template slot-scope="scope">
						<div class="w100" :class="scope.row.ypzh % 2 === 1 ? 'greenBack' : 'orangeBack'"></div>
					</template>
				</el-table-column>
				<el-table-column type="index" width="32"></el-table-column>

				<el-table-column label="药品名称" min-width="180" label-class-name="first-red">
					<template slot-scope="scope">
						<remoteSearchBox
								v-model="scope.row.ypmc"
								name="ypzt"
								:ref="`${scope.$index}-1`"
								style="height: 32px"
								@getData="setData"
								:resultTableHeader="resultTableHeader"
								:searchData="searchDataDetail"
								:searchField="{
                                            yp:'pydm',
                                        }"
								:showLabel="{
                                            yp:'fymc'
                                        }"
						/>
					</template>
				</el-table-column>
				<el-table-column label="剂量" prop="ycjl" v-if="searchDataDetail.ztlb != 4" width="80">
					<template slot-scope="scope">
						<input-box
								v-model="scope.row.ycjl"
								:ref="`${scope.$index}-1`"
								style="height: 32px"
						/>
					</template>
				</el-table-column>
				<el-table-column label="数量" prop="xmsl" v-if="searchDataDetail.ztlb == 4" width="80">
					<template slot-scope="scope">
						<input-box
								v-model="scope.row.xmsl"
								:ref="`${scope.$index}-1`"
								style="height: 32px"
						/>
					</template>
				</el-table-column>
				<el-table-column prop="jldw" v-if="searchDataDetail.ztlb != 4" width="40">
					<template slot-scope="scope">
						<span>{{scope.row.jldw}}</span>
					</template>
				</el-table-column>
				<el-table-column label="天数" prop="yyts" v-if="searchDataDetail.ztlb != 4">
					<template slot-scope="scope">
						<input-box
								v-model="scope.row.yyts"
								:ref="`${scope.$index}-2`"
								style="height: 32px"
								@change="changeYytsByZh"
						/>
					</template>
				</el-table-column>
				<el-table-column label="途径" prop="gytj" v-if="searchDataDetail.ztlb != 4" min-width="80">
					<template slot-scope="scope">
						<select-box
								v-model="scope.row.gytj"
								:ref="`${scope.$index}-3`"
								style="height: 32px"
								@change="changeGytjByZh"
								:options="yfList"
								option_label_filed="dn"
								option_value_filed="dv"
								@keyup.enter.native="nextFocus(scope.$index, 3)"
						></select-box>
					</template>
				</el-table-column>
				<el-table-column label="频次" prop="sypc" min-width="80">
					<template slot-scope="scope">
						<select-box
								v-model="scope.row.sypc"
								:ref="`${scope.$index}-4`"
								style="height: 32px"
								:options="gytjList"
								option_label_filed="dn"
								option_value_filed="dv"
								@change="changeYpyfByZh"
								@keyup.enter.native="nextFocus(scope.$index, 4)"
						></select-box>
					</template>
				</el-table-column>
				<el-table-column label="总量" prop="ypsl" v-if="searchDataDetail.ztlb < 3" width="80">
					<template slot-scope="scope">
						<input-box
								v-model="scope.row.ypsl"
								:ref="`${scope.$index}-5`"
								style="height: 32px"
						/>
					</template>
				</el-table-column>
				<el-table-column label="每贴数量" prop="ypsl" v-if="searchDataDetail.ztlb == 3" width="80">
					<template slot-scope="scope">
						<input-box
								v-model="scope.row.ypsl"
								:ref="`${scope.$index}-6`"
								style="height: 32px"
						/>
					</template>
				</el-table-column>
				<el-table-column label="煎法" prop="jz" v-if="searchDataDetail.ztlb == 3" width="80">
					<template slot-scope="scope">
						<select-box
								v-model="scope.row.jz"
								:ref="`${scope.$index}-7`"
								style="height: 32px"
								@change="change(scope, 7)"
								:options="jzList"
								option_label_filed="dn"
								option_value_filed="dv"
								@keyup.enter.native="nextFocus(scope.$index, 7)"
						></select-box>
					</template>
				</el-table-column>
				<el-table-column prop="fydj" label="单价" v-if="searchDataDetail.ztlb == 4" width="80"></el-table-column>
				<el-table-column prop="sbjg" label="商保价格" v-if="searchDataDetail.ztlb == 4" min-width="80"></el-table-column>
				<el-table-column prop="xmsl" label="总量" v-if="searchDataDetail.ztlb == 4" width="80">
					<template slot-scope="scope">
						<input-box
								v-model="scope.row.xmsl"
								:ref="`${scope.$index}-8`"
								style="height: 32px"
						/>
					</template>
				</el-table-column>


				<el-table-column :label="$t('table.actions')" width="80" align="center">
					<template slot-scope="scope">
						<div class="w100">
							<el-button @click="handleDelete(scope.row)">
								<i class="icon his-del his-cancellationicon"/>
							</el-button>
						</div>
					</template>
				</el-table-column>

			</el-table>
			<div class="action" style="margin-top:3px">
		        <span class="bottom-label">
		          明细条数:
		          <em style="color: #1485ff; font-family: siyuanMedium">{{ tableDatas.length }}</em>
		        </span>
			</div>

		</div>
		<div v-if="searchDataDetail.ztlb == 4">
			<el-table
					:data="tableDatas"
					border
					stripe
					:highlight-current-row="true"
					:height="listSlotHeight"
					class="scroll-bar"
					:row-class-name="tableRowClassName"
					@row-click="handleGetIndex"
			>
				<el-table-column width="16">
					<template slot-scope="scope">
						<div class="w100" :class="scope.row.ypzh % 2 === 1 ? 'greenBack' : 'orangeBack'"></div>
					</template>
				</el-table-column>
				<el-table-column type="index" width="32"></el-table-column>

				<el-table-column label="项目名称"  min-width="180" label-class-name="first-red">
					<template slot-scope="scope">
						<remoteSearchBox
								v-model="scope.row.xmmc"
								name="jyxm"
								:ref="`${scope.$index}-1`"
								style="height: 32px"
								@getData="setData4"
								:resultTableHeader="resultTableHeader4"
								:searchData="searchSelectData4"
								:searchField="{
                                            yp:'pydm'
                                        }"
								:showLabel="{
                                            yp:'fymc'
                                        }"
						/>
					</template>
				</el-table-column>
				<el-table-column label="数量" prop="ycjl" width="80">
					<template slot-scope="scope">
						<input-box
								v-model="scope.row.ycjl"
								:ref="`${scope.$index}-1`"
								style="height: 32px"
						/>
					</template>
				</el-table-column>
				<el-table-column label="频次" prop="sypc" min-width="80">
					<template slot-scope="scope">
						<select-box
								v-model="scope.row.sypc"
								:ref="`${scope.$index}-4`"
								style="height: 32px"
								:options="gytjList"
								option_label_filed="dn"
								option_value_filed="dv"
								@change="changeYpyfByZh"
								@keyup.enter.native="nextFocus(scope.$index, 4)"
						></select-box>
					</template>
				</el-table-column>
				<el-table-column label="单价"   prop="fydj" width="80">
          <template slot-scope="scope">{{useGetFloat(scope.row.fydj,2)}}</template>
        </el-table-column>
				<el-table-column label="商保价格"  prop="sbjg" min-width="80">
          <template slot-scope="scope">{{useGetFloat(scope.row.sbjg,2)}}</template>
        </el-table-column>
				<el-table-column prop="xmsl" label="总量" v-if="searchDataDetail.ztlb == 4" width="80">
					<template slot-scope="scope">
						<input-box
								v-model="scope.row.xmsl"
								:ref="`${scope.$index}-8`"
								style="height: 32px"
						/>
					</template>
				</el-table-column>
				<el-table-column :label="$t('table.actions')" width="52" align="center">
					<template slot-scope="scope">
						<div class="w100">
							<el-button @click="handleDelete(scope.row)">
								<i class="icon his-del his-cancellationicon"/>
							</el-button>
						</div>
					</template>
				</el-table-column>

			</el-table>
			<div class="action" style="margin-top:3px">
		        <span class="bottom-label">
		          明细条数:
		          <em style="color: #1485ff;font-family: siyuanMedium">{{ tableDatas.length }}</em>
		        </span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { ISuiteDetail, saveList, getPubpc, deleteByJlxh } from '@/api/cis/op/dctwork/examineSuite'
import { getPayProp } from '@/api/cis/op/dctwork/recipe'
import { getData } from '@/api/his/im/ims/admissionRegistration'
import { parseTime, getFloat } from '@/utils'

const Nparam: ISuiteDetail = {
  webSortNumber: null,
  jlbh: null,
  gytj: '1', //	给药途径
  jldw: '', //	剂量单位
  sypc: 'qd', // 使用频次
  mrcs: 2,
  xmmc: '', //  药品名称
  ycjl: 0, // 一次剂量
  ypzh: 0, // 药品组号 判断颜色
  yyts: 0, // 	用药天数
  ztbh: 0, // 组套编号
  xmsl: 1, // 数量
  jz: 1, //脚注
  ypsl: 0, // 总量
  fydj: 0, // 单价
  sbjg: 0, // 商保价格
  yfbz: 0,
  xmbh: 0,
  isEdit: true,
  jb: 0
}
@Component({
  name: 'DetailList1',
  filters: {
    switchColor: (value: number) => {
      if (value % 2 == 1) {
        return 'greenBack'
      } else {
        return 'orangeBack'
      }
    }
  }
})
export default class extends Vue {
  @Prop({ required: true }) private dataUrl!: string
  @Prop({ required: true }) private value!: any
  @Prop({ required: true }) private searchDataDetail!: any
  @Prop({ required: true }) private isSelect!: boolean
  @Prop({ required: true }) private KSDM!: string


  private listSlotHeight: number = 0
  private colLabel: string | null = null
  private rowIndex: number = -1
  private yfList: Array<any> = [] //药品用法字典
  private jzList: Array<any> = [] // 脚注字典
  private pcList: Array<any> = [] //频次字典
  private gytjList: Array<any> = [] //给药途径字典

  mounted() {
    this.yfList = this.$store.state.webSqlDict.DRUG_METHOD_DICT
    this.pcList = this.$store.state.webSqlDict.FREQUENCY_DICT
    this.jzList = this.$store.state.webSqlDict.JZ_DICT
    this.gytjList = this.$store.state.webSqlDict.FREQUENCY_DICT
  }

  private headerArray3: Array<any> = [
    {
      prop: 'ypzh',
      type: 'backColor',
      width: 14
    },
    {
      prop: 'xmmc',
      label: '项目名称',
      type: 'select-search', //点击后单元格变成远程搜索下拉框
      url: '/op-service/ypsrf/queryFeeYlsfxmdj', //远程搜索的api
      queryData: 'pydm', //远程搜索的搜索字段
      showLabel: 'fymc',
      searchData: this.searchDataDetail,
      resultHeader: [
        {
          prop: 'fymc',
          label: '费用名称'
        },
        {
          prop: 'fydw',
          label: '规格'
        },
        {
          prop: 'fydj',
          label: '价格'
        }
      ],
      selectResult: {
        xmmc: 'fymc',
        xmbh: 'ypxh',
        sbjg: 'bzjg',
        fydj: 'fydj'
      }
    },
    {
      prop: 'xmsl',
      label: '数量',
      type: 'input',
      width: 60
    },
    {
      prop: 'sypc',
      type: 'select',
      label: '频次',
      width: 60,
      option: this.$store.state.webSqlDict.FREQUENCY_DICT,
      label_filed: 'dn', //在传入option中作为label的字段
      value_filed: 'dv'  //在传入option中作为value的字段
    },
    {
      prop: 'fydj',
      label: '单价',
      type: 'text',
      width: 60
    },
    {
      prop: 'sbjg',
      label: '商保价格',
      type: 'text',
      width: 60
    },
    {
      prop: 'xmsl',
      label: '总量',
      type: 'input',
      width: 60
    }

  ]


  private resultTableHeader: any = {
    yp: [
      {
        prop: 'ypmc',
        label: '药品名称'
      },
      {
        prop: 'ypgg',
        label: '规格'
      },
      {
        prop: 'yfdw',
        label: '药房单位'
      }
    ]
  }

  private resultTableHeader4: any = {
    yp: [
      {
        prop: 'fymc',
        label: '药品名称'
      },
      {
        prop: 'fydw',
        label: '次'
      },
      {
        prop: 'fydj',
        label: '费用单价'
      },
      {
        prop: 'bzjg',
        label: '标准价格'
      }
    ]
  }
  private searchSelectData4:any = {
    yp: {
      pydm: '',
      xmlx: 5
    }
  }


  //数据交互
  private tableRowClassName({ row, rowIndex }: any) {
    row.index = rowIndex
  }

  private handleGetIndex(val: any) {
    this.rowIndex = val.index
  }

  private setData(obj: any) {
    this.tableDatas[this.rowIndex].ypmc = obj.ypmc
    this.tableDatas[this.rowIndex].ycjl = obj.ycjl
    this.tableDatas[this.rowIndex].jldw = obj.jldw
    this.tableDatas[this.rowIndex].xmbh = obj.ypxh
    this.tableDatas[this.rowIndex].sbjg = obj.bzjg
    this.tableDatas[this.rowIndex].fydj = obj.fydj
    // this.tableDatas[this.rowIndex].yfbz = obj.yfbz
  }
  private setData4(obj:any) {
    this.tableDatas[this.rowIndex].xmmc = obj.fymc
    this.tableDatas[this.rowIndex].fydj = obj.fydj
    this.tableDatas[this.rowIndex].sbjg = obj.bzjg
    this.tableDatas[this.rowIndex].xmbh = obj.fyxh
    this.tableDatas[this.rowIndex].xmsl = 1
  }

  get tableDatas() {
    return this.value
  }

  set tableDatas(val: any[]) {
    this.$emit('input', val)
  }

  // 保留n位小数
  private useGetFloat(num: any, n: number) {
    return getFloat(num, n)
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 155
  }


  /**
   * @LastEditors: zhml
   * @Description: 保存全部数据
   * @param {type} list
   * @return: sucess
   */
  private handleSaveAll() {
    if (this.tableDatas.length == 0 || this.tableDatas[0].xmbh == null || this.tableDatas[0].xmbh == 0) {
      this.$notify({
        type: 'warning',
        title: '无数据，不可保存',
        message: ''
      })
      return
    }
    this.tableDatas.forEach(item => {
      item.mrcs = this.$store.state.webSqlDict.FREQUENCY_DAY_DICT.find((obj: any) => obj.dv == item.sypc).dn
    })
    saveList(this.tableDatas).then((res) => {
      this.$notify({
        type: 'success',
        title: '保存成功',
        message: ''
      })
    })
  }


  /**
   * @LastEditors: zhml
   * @Description: 新增的数据是否已有药品名称,判断是否可以再次新增组或新增药品
   * @param {type} params
   * @return:
   */
  private isClick(value: ISuiteDetail[]) {

    if (value.length == 0) {
      return true
    } else if (
      value[value.length - 1].xmmc == '' ||
      value[value.length - 1].xmmc === null ||
      value[value.length - 1].xmmc === undefined
    ) {
      return false
    } else {
      return true
    }
  }


  /**
   * @Description: 更改同组的频次数据
   * @author: zhml
   * @param {type}:
   * @return: obj
   * @date 2020/8/26
   */
  private changeYpyfByZh(val: any) {
    let cc = this.tableDatas[this.rowIndex]
    this.tableDatas.forEach((item: any) => {
      if (item.ypzh == cc.ypzh) {
        item.sypc = val
        // this.countYpsl(3)
      }
    })
  }

  /**
   * @Description: 更改同组的用药天数数据
   * @author: zhml
   * @param {type}:
   * @return: obj
   * @date 2020/8/26
   */
  private changeYytsByZh(val: any) {
    console.log('val', val)
    let cc = this.tableDatas[this.rowIndex]
    this.tableDatas.forEach((item: any) => {
      if (item.ypzh == cc.ypzh) {
        item.yyts = val
      }
    })
  }



  /**
   * @Description: 更改同组的给药途径数据
   * @author: zhml
   * @param {type}:
   * @return: obj
   * @date 2020/8/26
   */
  private changeGytjByZh(val: any) {
    let cc = this.tableDatas[this.rowIndex]
    this.tableDatas.forEach((item: any) => {
      if (item.ypzh == cc.ypzh) {
        item.gytj = val
      }
    })
  }


  /**
   * @Description: 计算总量
   * @author: zhml
   * @return:
   * @date 2020/7/26
   */
  private countYpsl(num: number) {

  }



  private handleNewGroup() {
    if(this.isSelect == false){
      return
    }
    if (this.isClick(this.tableDatas)) {
      const param = Object.assign({}, Nparam)
      param.ztbh = this.searchDataDetail.ztbh
      param.webSortNumber = this.tableDatas.length + 1
      if (this.tableDatas.length == 0) {
        param.ypzh = 1
      } else {
        param.ypzh = this.tableDatas[this.tableDatas.length - 1].ypzh + 1
      }
      this.tableDatas.push(param)
    } else {
      return null
    }
  }

  private handleInsert() {
    if(this.isSelect == false){
      return
    }
    if (this.isClick(this.tableDatas)) {
      const param = Object.assign({}, Nparam)
      param.ztbh = this.searchDataDetail.ztbh
      param.webSortNumber = this.tableDatas.length + 1
      if (this.tableDatas.length == 0) {
        param.ypzh = 1
      } else {
        param.ypzh = this.tableDatas[this.tableDatas.length - 1].ypzh
      }
      this.tableDatas.push(param)
    } else {
      return null
    }
  }

  private handleDelete(val: any) {
    if (!val.jlbh) {
      this.tableDatas.splice(val.webSortNumber - 1, 1)
    } else {
      deleteByJlxh({ jlbh: val.jlbh }).then(() => {
        this.$notify({
          type: 'success',
          title: '已删除',
          message: ''
        })
        this.$emit('delete', val.ztbh)
      })
    }

  }


  private getPcData(value: any) {

    getPubpc({ pcbm: value.row.sypc }).then((res) => {
      value.row.mrcs = res.data
    })
    this.colLabel = null
    this.rowIndex = -1
  }


}
</script>

<style lang="scss" scoped>
.his-suite {
	height: initial !important;
	.row {
		.label {
			display: flex;
			flex-direction: row;
			align-items: center;
			height: 24px;
			.title {
				font-family: siyuanMedium;
			}
			.el-divider--vertical {
				margin: 0 10px;
			}
		}
	}
}

::v-deep .el-table--medium td .cell {
	padding: 0px !important;
}

::v-deep .color-group .cell {
	padding: 0 !important;
	.orangeBack,
	.greenBack {
		height: 32px;
		opacity: 0.3 !important;
	}

	.greenBack {
		background: #0fcaad;
	}

	.orangeBack {
		background: #ffbf00;
	}
}



.action {
	height: 28px;
}

.bottom-label {
	margin-left: 0px;
	margin-top: 5px;
	font-size: 13px;
	color: #222b31;
}

::v-deep .w100 {
	height: 30px;
	width: 100%;
}

::v-deep .el-input__inner {
	height: 28px;
}
</style>
