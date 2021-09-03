<!--
 * @Date: 2020-05-27 13:55:55
 * @LastEditTime: 2020-09-11 16:00:40
 * @Description: 预约管理
 * @FilePath: \web-op\src\views\cis\op\dctwork\orderManager\orderManager\index.vue
-->
<template>
	<div class="content his-order-manager">
		<el-row class="upper">
			<el-col class="ht" :span="24">
				<div class="his-module his-small">
					<div class="row" slot="header">
						<div class="label">
							<div class="querySearch">
								<div class="searchTitle no-warp" style="padding-right: 2px">预约管理</div>
							</div>


							<div class="btn">
								<el-divider direction="vertical"></el-divider>
								<el-button @click="handleAdd('')">
									<i class="icon his-caozuo-jiandang"></i>
									<span>新建</span>
								</el-button>
								<el-button @click="cleanForm">
									<i class="icon his-btn-del red"></i>
									<span>清空</span>
								</el-button>
								<el-button @click="queryDept">
									<i class="icon his-search green"></i>
									<span>查询</span>
								</el-button>
							</div>
						</div>


					</div>
					<div
							slot="header"
							class="row"
							style="border-bottom: none;margin-bottom: 0px;padding-bottom: 10px"
					>
						<div class="label grid">

							<div class="querySearch card">
								<span class="searchTitle" style="padding-left: 0px">患者卡号</span>
								<el-input
										v-model="formData.cardno"
										:placeholder="'请输入卡号'"
										size="mini"
										@keyup.enter.native="getPatientInfo"
								></el-input>
								<el-button type="primary" class="read-card" icon="icon his-reading-card">读卡</el-button>
							</div>

							<div class="querySearch">
								<span class="searchTitle">患者性质</span>
								<search-select
										:disabled="disabled"
										style="width:100%"
										table-name="SYS_DICT_CONFIG"
										kid="14"
										v-model="formData.brxz"
										:placeholder="$t('患者性质')"
										:backfillValue="formData.brxz"
								/>
							</div>

							<div class="querySearch">
								<span class="searchTitle">患者姓名</span>
								<el-input
										v-model="formData.brxm"
										:placeholder="'患者姓名'"
										size="mini"
										:disabled="disabled"
								></el-input>
							</div>

							<div class="querySearch gender-age">
								<span class="searchTitle">患者性别</span>
								<search-select
										:disabled="disabled"
										class="w100"
										table-name="SYS_PRIMARY_DATA"
										kid="PD0000000269"
										v-model="formData.brxb"
										:placeholder="'性别'"
										:backfillValue="formData.brxb"
								/>
								<el-input
										v-model="formData.age"
										:placeholder="'年龄'"
										size="mini"
										:disabled="disabled"
										class="age"
								></el-input>
							</div>

						</div>
					</div>
					<div class="row" style="border-bottom: none;margin-bottom: 0px;padding-bottom: 0px">
						<div class="label grid">

							<div class="querySearch date-ampm">
								<span class="searchTitle" style="padding-left: 0px">预约时间</span>
								<el-date-picker
										class="date-wrapper"
										v-model="formData.ghrq"
										size="mini"
										type="date"
										placeholder="选择日期"
										value-format="yyyy-MM-dd"
										:picker-options="pickerOptions"
										@change="queryDept"
								></el-date-picker>
								<!-- <el-select
										v-model="formData.zblb"
										class="ampm"
										placeholder="值班类别"
										ref="select"
										@change="queryDept"
								>
									<el-option label="上午" :value="1"></el-option>
									<el-option label="下午" :value="2"></el-option>
								</el-select> -->
								<search-select
									class="ampm"
									table-name="SYS_DICT_CONFIG"
									kid="77"
									v-model="formData.zblb"
									:placeholder="$t('班次')"
									:backfillValue="formData.zblb"
									@change="queryDept"
								/>

							</div>

							<div class="querySearch dept">
								<span class="searchTitle">预约科室</span>
								<search-select
										class="w100"
										table-name="SYS_DICT_CONFIG"
										kid="13"
										v-model="formData.kslb"
										:placeholder="$t('请选择科室')"
										:backfillValue="formData.kslb"
										@change="queryDept"
								/>
								<!-- <el-button
								  type="primary"
								  class="search-dept"
								  icon="icon his-search"
								  @click="queryDept"
								>查询</el-button> -->
							</div>

							<div class="querySearch">
								<span class="searchTitle">预约类型</span>
								<search-select
										class="w100"
										table-name="SYS_FLAG_DATA"
										kid="YY000001"
										v-model="formData.yylx"
										:placeholder="$t('请选择')"
										:backfillValue="formData.yylx"
								/>
							</div>

							<div class="querySearch">
								<span class="searchTitle">备注</span>
								<el-input
										v-model="formData.yybz"
										:placeholder="'请输入备注'"
										size="mini"
								></el-input>
							</div>


						</div>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row class="lower" :gutter="10">
			<el-col class="ht" :span="14">
				<div class="his-module his-small dept-wrap">
					<pagenation-list
							ref="pageTable1"
							v-model="tableData1"
							data-url="/op-service/yygl/yyglQuery"
							:searchData="searchData1"
							http-method="post"
							:list-height="listSlotHeight"
					>
						<div slot="header" class="row">
							<div class="label">
								<div class="searchTitle">搜索</div>
								<el-input
										placeholder="请输入拼音代码"
										v-model="searchData1.pydm"
										@keydown.native.enter="queryDept"
										clearable
								>
									<i slot="prefix" class="el-input__icon icon his-search"></i>
								</el-input>
							</div>
							<div class="operate"></div>
						</div>
						<el-table
								slot="list"
								stripe
								:highlight-current-row="true"
								:data="tableData1"
								:height="listSlotHeight"
								border
								@row-dblclick="getDatas"
								tooltip-effect="light"
						>
							<el-table-column prop="webSortNumber" width="32px" align="center"></el-table-column>
							<el-table-column prop="ksmc" :label="'科室名称'" show-overflow-tooltip></el-table-column>
							<el-table-column prop="ghf" :label="'挂号费'" class-name="text-blue-td" width="69"></el-table-column>
							<el-table-column prop="zlf" :label="'诊疗费'" class-name="text-blue-td" width="69"></el-table-column>

							<el-table-column prop="zjmz" :label="'专家门诊'" width="69">
								<template slot-scope="scope">
									{{booleanList.find(item => item.dv == scope.row.zjmz) && booleanList.find(item => item.dv == scope.row.zjmz).dn}}
								</template>
							</el-table-column>

							<el-table-column prop="txmz" :label="'特需门诊'" width="69">
								<template slot-scope="scope">
									{{booleanList.find(item => item.dv == scope.row.txmz) && booleanList.find(item => item.dv == scope.row.txmz).dn}}
								</template>
							</el-table-column>
							<el-table-column prop="ghxe" :label="'限额'"></el-table-column>
							<!-- <el-table-column prop="ygrs" :label="'已挂'"></el-table-column> -->
							<el-table-column prop="yyrs" :label="'预约'"></el-table-column>
							<el-table-column prop="pydm" :label="'拼音代码'"></el-table-column>
							<el-table-column prop="wbdm" :label="'五笔代码'"></el-table-column>
							<el-table-column prop="szdm" :label="'数字代码'" width="69"></el-table-column>
						</el-table>
					</pagenation-list>
				</div>
			</el-col>
			<el-col class="ht" :span="10">
				<div class="his-module his-small doc-wrap">
					<!--          <custom-list-->
					<!--            ref="pageTable2"-->
					<!--            data-name="MS_YSPB_MANAGE"-->
					<!--            v-model="tableData2"-->
					<!--            :list-height="listSlotHeight"-->
					<!--            :searchData="searchData2"-->
					<!--            http-method="post"-->
					<!--            :dataSelect="true"-->
					<!--            @reqComplete="renderTable"-->
					<!--          >-->
					<!--            <div slot="header" class="row">-->
					<!--              <div class="label">-->
					<!--                <div class="searchTitle">搜索</div>-->
					<!--                <el-input v-model="searchData1.dataValue" :placeholder="$t('diagnose.phDiag2')">-->
					<!--                  <i slot="prefix" class="el-input__icon icon his-search"></i>-->
					<!--                </el-input>-->
					<!--              </div>-->
					<!--            </div>-->
					<!--            <el-table-->
					<!--              slot="list"-->
					<!--              stripe-->
					<!--              :highlight-current-row="true"-->
					<!--              :data="tableData2"-->
					<!--              @row-dblclick="getDetail"-->
					<!--              :height="listSlotHeight"-->
					<!--              class="scroll-bar"-->
					<!--              border-->
					<!--            >-->
					<!--              <el-table-column prop="webSortNumber" align="center" width="32"></el-table-column>-->
					<!--              &lt;!&ndash; 医生姓名 &ndash;&gt;-->
					<!--              <el-table-column prop="SYS_Personnel_personname" :label="'医生姓名'"></el-table-column>-->

					<!--              &lt;!&ndash; 专家 &ndash;&gt;-->
					<!--              <el-table-column prop="SYS_Personnel_isexpert" :label="'专家'"></el-table-column>-->

					<!--              &lt;!&ndash; 专家费 &ndash;&gt;-->
					<!--              <el-table-column prop :label="'专家费'"></el-table-column>-->

					<!--              &lt;!&ndash; 挂号限额 &ndash;&gt;-->
					<!--              <el-table-column :label="'挂号限额'" prop="MS_YSPB_GHXE"></el-table-column>-->
					<!--              &lt;!&ndash; 已挂人数 &ndash;&gt;-->
					<!--              <el-table-column prop="MS_YSPB_YGRS" :label="'已挂人数'"></el-table-column>-->
					<!--              &lt;!&ndash; 预约人数 &ndash;&gt;-->
					<!--              <el-table-column prop="MS_YSPB_YYRS" :label="'预约人数'"></el-table-column>-->
					<!--            </el-table>-->
					<!--          </custom-list>-->
<!--					<pagenation-list-->
<!--							ref="pageTable2"-->
<!--							v-model="tableData2"-->
<!--							data-url="/op-service/yygl/queryYyksYsInfo"-->
<!--							:searchData="searchData2"-->
<!--							http-method="post"-->
<!--							:list-height="listSlotHeight"-->
<!--					>-->
						<div slot="header" class="row">
							<div class="label">
								<div class="searchTitle">搜索</div>
								<el-input
									placeholder="请输入拼音代码"
									v-model="searchData2.dataValue"
									clearable
									@input="filterDoc"
								>
									<i slot="prefix" class="el-input__icon icon his-search"></i>
								</el-input>
							</div>
							<div class="operate"></div>
						</div>
						<el-table
								slot="list"
								stripe
								:highlight-current-row="true"
								:data="tableData2"
								:height="listSlotHeight"
								border
								@row-dblclick="getDetail"
						>
							<el-table-column prop="webSortNumber" align="center" width="32"></el-table-column>
							-->
							<!-- 医生姓名 -->
							<el-table-column prop="personname" :label="'医生姓名'" min-width=70></el-table-column>
							<!-- 专家 -->
							<el-table-column prop="isexpert" :label="'专家'" min-width=60></el-table-column>
							<!-- 专家费 -->
							<el-table-column prop="expertcost" :label="'专家费'" min-width=66></el-table-column>
							<!-- 挂号限额 -->
							<el-table-column :label="'挂号限额'" min-width=70 prop="ghxe"></el-table-column>
							<!-- 已挂人数 -->
							<el-table-column prop="ygrs" :label="'已挂人数'" min-width=70></el-table-column>
							<!-- 预约人数 -->
							<el-table-column prop="yyrs" :label="'预约人数'" min-width=70></el-table-column>
						</el-table>
<!--					</pagenation-list>-->
				</div>
			</el-col>
		</el-row>

		<el-dialog
				title="预约确认"
				:visible.sync="dialogVisible"
				width="25%"
				top="20vh"
				class="narrow-dialog"
		>
			<div class="dept-name">{{this.title.name}}</div>
			<div class="his-module his-small">
				<el-form label-width="68px">
					<el-row :gutter="10">
						<el-col :span="24">
							<el-form-item label="预约医生id" hidden>
								<el-input placeholder="预约医生id" v-model="formData.ysdm" :disabled="disabled"></el-input>
							</el-form-item>
							<el-form-item label="预约医生">
								<el-input placeholder="预约医生" v-model="formData.ysName" :disabled="disabled"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :span="24">
							<el-form-item label="预约日期">
								<el-input placeholder="预约日期" v-model="formData.ghrq" :disabled="disabled"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :span="24">
							<el-form-item label="值班类别">
								<!-- <el-select
										style="width:100%"
										v-model="formData.zblb"
										placeholder="请选择"
										ref="select"
										:disabled="disabled"
								>
									<el-option label="上午" :value="1"></el-option>
									<el-option label="下午" :value="2"></el-option>
								</el-select> -->
								<search-select
									table-name="SYS_DICT_CONFIG"
									kid="77"
									v-model="formData.zblb"
									:placeholder="$t('班次')"
									:backfillValue="formData.zblb"
									:disabled="disabled"
								/>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>

			<span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="sureBtn" size="mini">确 定</el-button>
      </span>
		</el-dialog>

		<!-- 新建病人档案 -->
		<add-patient ref="add-patient" @getPatientInfo="getPatientInfo"/>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { id2Name, parseTime, deepCopy } from '@/utils'
import addPatient from '@/components/addPatient/index.vue'
import { saveDialo, aCheckAppointedToday, aQueryPatientInfo,getDoctorList } from '@/api/cis/op/dctwork/orderManger.ts'
import { getNow } from '@/api/his/basic/index.ts'
import { time } from 'console'
import { AxiosResponse } from 'axios'

//声明接口
declare interface pageList {
  id: number
}

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: '',
  filters: {},
  components: { addPatient }
})

export default class extends Vue {
  private disabled: boolean = true
  private tableData1: Array<any> = [] // 左侧表格数据
  private tableData2: Array<any> = [] //右侧数据
  private tableData2Clone: Array<any> = []
  private searchData1: any = {
    ghrq: '',
    kslb: null,
    zblb: null
  }
  private searchData2: any = {
    ksdm: '', // 挂号科室代码
    gzrq: '', // 工作日期
    zblb: '' // 值班类别
  }
  private curRow1: any = {} // 左侧当前行
  private listSlotHeight: number = 0
  private loading: boolean = true
  private dialogVisible: boolean = false //确认弹框
  //当天日期以前的日期禁用
  private pickerOptions: any = {
    disabledDate(time: any) {
      return time.getTime() < Date.now()  //如果没有后面的-8.64e6是不可以选择当天的
    }
  }
  //获取当前时间
  private dateTime: any = '' //接收当前时间
  //根据卡号查询病人数据
  private getPeopleData: any = {}
  private formData: any = {
    cardno: '', // 卡号
    brxz: '', // 病人性质
    brxm: '', // 病人姓名
    brxb: null, // 病人性别
    age: '', // 年龄
    ghrq: '', // 挂号日期（查询排班用）
    zblb: '', // 值班类别
    kslb: null, // 科室类别（挂号科室代码）
    yylx: '', // 预约类型
    yybz: '', // 预约备注
    brid: null, // 病人id hidden
    ghbz: null, // 挂号标识 hidden
    ysdm: null, // 医生代码 hidden
    ysName: null, // 医生姓名 hidden
    yyrq: null, // 预约日期
    zsid: null // 诊室id hidden
  }
  //弹框
  private title: any = {} // 弹窗标题
  private dialogData: any = {
    yyrq: '',
    zblb: '',
    ysdm: ''
  }

	// private booleanList: any[] = this.$store.state.webSqlDict.Y_OR_N_DICT
	private booleanList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.Y_OR_N_DICT : this.$store.state.webSqlDict.Y_OR_N_DICT

  //监听方法
  @Watch('tableData')
  private onValueChange(value: string) {
    this.loading = false
  }

  // 获取当前时间
  private getNow() {
    getNow().then((res: any) => {
      this.dateTime = parseTime(res.data + 24 * 60 * 60 * 1000, '{y}-{m}-{d}')
      this.formData.ghrq = this.dateTime
      // this.formData.zblb = Number(parseTime(res.data, '{b}'))
    })
  }

  // 打开新增弹窗
  private handleAdd(cardno: number) {
    var ap: any = this.$refs['add-patient']
    console.log(ap, 'apppp')
    ap.addDialog(cardno)
  }

  // 根据卡号查询病人信息
  private getPatientInfo() {
    console.log('由子组件触发')
    if (this.formData.cardno == '') {
    } else {
      aQueryPatientInfo({ jzkh: this.formData.cardno }).then((res: any) => {
        if (res) {
          if (res.data == null) {
            this.handleAdd(this.formData.cardno)
            this.formData.brxz = null
            this.formData.brxm = null
            this.formData.brxb = null
            this.formData.age = null
          } else {
            // status：1挂失，2注销，3失效
            if (res.data.status == 1) {
              this.$notify({
                title: '此卡已挂失',
                message: '',
                type: 'error'
              })
            } else if (res.data.status == 2) {
              this.$notify({
                title: '此卡已注销',
                message: '',
                type: 'error'
              })
            } else if (res.data.status == 3) {
              this.$notify({
                title: '此卡已注销',
                message: '',
                type: 'error'
              })
            } else {
              this.getPeopleData = res.data
              console.log(this.getPeopleData)
              // 查询病人信息
              this.formData.brxz = res.data.brxz
              this.formData.brxm = res.data.brxm
              this.formData.brxb = res.data.brxb
              this.formData.age = res.data.age
              this.formData.brid = res.data.brid
            }
          }
        }
      })
    }
  }

  //清空
  private cleanForm() {
    this.formData.cardno = null
    this.formData.brxm = null
    this.formData.brxz = null
    this.formData.brxb = null
    this.formData.age = null
    this.formData.ghrq = null
    this.formData.zblb = null
    this.formData.kslb = null
    this.formData.yylx = null
    this.formData.yybz = null
    this.formData.brid = null // hidden
    this.formData.ghbz = null // 挂号标识 hidden
    this.formData.ysdm = null // 医生代码 hidden
    this.formData.ysName = null // 医生姓名 hidden
    this.formData.yyrq = null // 预约日期
    this.formData.zsid = null // 诊室id hidden
    this.getNow()
  }

  // 查询按钮，获取左侧
  private queryDept() {
    if (!this.formData.ghrq) {
      this.$notify({
        title: '请选择预约日期',
        message: '',
        type: 'warning'
      })
      return false
    }
    if (!this.formData.zblb) {
      this.$notify({
        title: '请选择班次',
        message: '',
        type: 'warning'
      })
      return false
    }
    // if(!this.formData.kslb){
    //   // this.$notify({
    //   //   title: '请选择预约科室',
    //   //   message: '',
    //   //   type: 'warning'
    //   // })
    //   return false
    // }
    this.searchData1.ghrq = this.formData.ghrq
    this.searchData1.kslb = this.formData.kslb
    this.searchData1.zblb = this.formData.zblb
    this.getLists()
    this.tableData1 = []
    this.tableData2 = []
    this.curRow1 = {}
  }

  // 获取左侧列表
  private getLists() {
    const pageTable1: any = this.$refs.pageTable1
    pageTable1.getList()
  }

  // 左侧搜索
  private handleSearch() {
    // this.getLists()
  }

  //左侧表格双击事件
  private getDatas(row: any) {
    this.curRow1 = row
    console.log('row===', row)
    this.formData.kslb = row.ksdm
    //弹框科室标题
    this.title.name = row.ksmc
    if (this.formData.brid === null) {
      this.$notify({
        title: '请先调入患者信息',
        message: '',
        type: 'warning'
      })
    } else {

      // 挂号科室限制条件
      if (row.xbxz != null) {
        if (row.xbxz != this.formData.brxb) {
          this.$message({
            message: '该科室与患者性别不符',
            type: 'error'
          })
          return false
        }
      }
      if (row.nlxz != null) {
        if (row.nlxz < this.formData.age) {
          this.$message({
            message: '患者年龄超过该科室年龄限制',
            type: 'error'
          })
          return false
        }
      }

      // 验证当天是否预约过
      let params = {
        brid: this.formData.brid,
        ghsj: this.formData.ghsj,
        ksdm: this.formData.kslb,
        yyrq: this.formData.ghrq
      }
      aCheckAppointedToday(params).then((res: any) => {
        if (res) {
          this.searchData2.ksdm = this.formData.kslb
          this.searchData2.gzrq = this.formData.ghrq
          this.searchData2.zblb = this.formData.zblb
          this.getRight()
        }
      })

    }
  }

  //获取右侧列表数据（未渲染到页面）
  private getRight() {
    getDoctorList(this.searchData2).then((res:AxiosResponse)=>{
      this.tableData2 = res.data
      this.renderTable(this.tableData2)
    })

  }

  // 渲染右侧表格数据
  private renderTable(data: any) {
    console.log(data)
    this.tableData2 = data
	this.tableData2Clone = deepCopy(data)
    // 插入空行
    if (this.curRow1.zjmz == 1 || this.curRow1.txmz == 1) {
      if (this.tableData2.length == 0) {
        this.$message({
          message: '选择的专家或特需门诊未有排班医生',
          type: 'error'
        })
        return false
      }
    } else {
      if (this.tableData2.length == 0) {
        this.openConfirm()
      } else {
        this.tableData2.unshift({})
      }
    }

  }

  //右侧表格双击事件
  private getDetail(val: any) {
    this.formData.ysdm = val.ysdm
    this.formData.ysName = val.personname
    this.openConfirm()
  }

  // 打开确认弹窗
  private openConfirm() {
    if (!this.formData.yylx) {
      this.$notify({
        title: '请选择预约类型',
        message: '',
        type: 'warning'
      })
      return false
    }
    this.dialogVisible = true
  }

  //弹框确定按钮
  private sureBtn() {
    let params = {
      brid: this.formData.brid, //病人id
      cardno: this.formData.cardno, //卡号
      ghbz: 0, //挂号标志
      ghsj: this.dateTime + ' 00:00:00', //挂号时间（当前时间，时分秒，后端会重新赋值）
      ksdm: this.formData.kslb, //科室代码
      ysdm: this.formData.ysdm, //医生代码
      yybz: this.formData.yybz, // 预约备注
      yylx: this.formData.yylx, // 预约类型
      yyrq: this.formData.ghrq, //预约日期
      zblb: this.formData.zblb, //值班类别
      zsid: '' //诊室id
    }
    saveDialo(params).then((res: any) => {
      this.$notify({
        type: 'success',
        title: '预约成功',
        message: ''
      })
      this.tableData1 = []
      this.tableData2 = []
      this.cleanForm()
    })
    this.dialogVisible = false
  }


  private table2Data: any = ''
  // private aaa(data: any) {
  //   this.tableData2 = data
  //   // console.log(data)
  //   // this.table2Data = data
  //   // console.log(this.table2Data)
  //   // if (data.length == 0) {
  //   //   this.dialoData.yyrq = this.formData.ghrq
  //   //   console.log(this.dialoData.ghrq)
  //   //   this.dialoData.zblb = this.formData.zblb
  //   //   this.dialogVisible = true
  //   // } else {
  //   //   this.dialogVisible = false
  //   // }
  // }

  // 过滤医生
  private filterDoc(value: string) {
	this.tableData2 = this.tableData2Clone
    this.tableData2 = this.tableData2.filter((item) => {
      return item.pycode.indexOf(value.toUpperCase()) > -1
    })
  }

  //初始化的周期函数
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 232
  }

  mounted() {
    this.getNow()
    // this.getLists()
  }
}
</script>

<style lang="scss" scoped>
.his-order-manager {
	display: flex;
	flex-direction: column;
	// padding-left: 0 !important;
	.upper {
		margin-bottom: 10px;
		height: 126px;

		.his-small {
			padding-top: 5px;

			.row {
				padding-bottom: 5px;

				.no-warp {
					font-family: siyuanMedium;
					font-size: 16px;
				}

			}
		}
	}

	.small-header {
		// height: 22px;
		padding-bottom: 8px;
		border-bottom: 1px solid $border;
	}

	// element分割线
	.el-divider {
		background-color: $border;
	}

	.small-header {
		// height: 22px;
		padding-bottom: 8px;
		border-bottom: 1px solid $border;
	}

	.input-blue {
		::v-deep .el-input__inner {
			color: $blue;
		}
	}

	.lower {
		height: calc(100% - 136px);

		.row {
			padding-bottom: 0;
			border-bottom: none;

			.el-input {
				width: auto;
				margin-right: 10px;
			}
		}
	}

	// 科室区域
	.dept-wrap {
		.el-checkbox {
			margin-right: 6px;

			::v-deep .el-checkbox__label {
				padding-left: 4px;
			}
		}
	}

	// 医生区域
	.doc-wrap {
		.no-reg-doc {
			cursor: pointer;
		}
	}

	.left-title {
		width: 60px;
		margin-right: 10px;
		margin-left: 10px;
	}

	.label.grid {
		width: 100%;
		display: grid !important;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: 28px;
		line-height: 28px;

		.querySearch {
			width: 100%;
			display: grid !important;
			grid-template-columns: 68px 2fr;
			grid-template-rows: 28px;
			line-height: 28px;

			.searchTitle {
				padding: 0 8px 0;
			}

			&.card {
				display: grid !important;
				grid-template-columns: 68px 2fr 1fr;
				grid-template-rows: 28px;
				line-height: 28px;

				.read-card {
					justify-content: center;
					margin-left: 4px;
					padding: 4px 10px;
					height: 28px;
					line-height: 28px;
					overflow: hidden;
				}
			}

			&.gender-age {
				display: grid !important;
				grid-template-columns: 68px 2fr 1fr;

				.age {
					padding-left: 4px;
				}
			}

			&.date-ampm {
				display: grid !important;
				grid-template-columns: 68px 2fr 1fr;

				.ampm {
					padding-left: 4px;
				}
			}

			&.dept {
				display: grid !important;
				// grid-template-columns: 68px 2fr 1fr;
				.search-dept {
					justify-content: center;
					margin-left: 4px;
					padding: 4px 10px;
					height: 28px;
					line-height: 28px;
					overflow: hidden;
				}
			}
		}
	}

	.his-small .row .label .el-input .el-input__inner {
		width: 100%;
	}

	.el-date-editor.el-input,
	.el-date-editor.el-input__inner {
		width: 100%;
	}

	.bottom-row {
		margin-bottom: 0px;
		margin-top: 0px;
		padding-left: 8px;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		-webkit-box-pack: justify;
		-ms-flex-pack: justify;
		justify-content: space-between;
		text-align: left;
	}

	.content .lower .his-small .row .label .el-input {
		height: 28px !important;

		::v-deep .el-input__prefix {
			margin: 0px 8px 0 10px !important;
		}
	}

	.mr4 {
		margin-right: 4px;
	}

	.row {
		::v-deep .el-input__inner {
			width: 220px !important;
		}
	}

	.dept-name {
		margin-bottom: 10px;
		padding: 10px 16px !important;
		font-size: 16px;
		color: $blue;
		font-family: "siyuanMedium";
		border-bottom: 1px solid #f0f0f0;
	}
}

.narrow-dialog {
	.el-form-item {
		&[hidden] {
			display: none;
		}
	}
}
</style>
