<template>
  <div class="content">
		<el-row class="ht" :gutter="10">
      <el-col class="ht" :span="14">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <div class="title">挂号科室维护</div>
              <el-divider direction="vertical"></el-divider>
              <el-input
                :placeholder="'请输入拼音码查询'"
                v-model="searchData.pydm"
                @change="searchLists"
                class="search"
              >
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input>
              <div class="btn" style="display:none">
                <el-button type="text" @click="print">
                  <i class="icon his-reading-card blue"></i>
                  <span>打印表格</span>
                </el-button>
              </div>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                size="mini"
                class="blue-gra"
                icon="icon his-add"
                @click="handleAdd"
              >{{$t('common.add')}}</el-button>
            </div>
          </div>
          <pagenation-list
            ref="pageTable"
            v-model="tableData"
            data-url="/op-service/opghks/queryPage"
            :search-data="searchData"
            http-method="post"
            :list-height="listSlotHeight"
          >
            <el-table
              slot="list"
              stripe
              ref="table"
              :highlight-current-row="true"
              :data="tableFormat"
              @row-click="getDetail"
              border
              v-loading="loading"
              :height="listSlotHeight"
              class="scroll-bar"
              tooltip-effect="light"
            >
							<!-- 序号 -->
              <el-table-column
								prop="webSortNumber"
								width="32"
                align="center"
							></el-table-column>

							<!-- 科室名称 -->
							<el-table-column
								:label="'科室名称'"
								prop="ksmc"
                width="120"
							></el-table-column>

							<!-- 门诊科室 -->
							<el-table-column
								:label="'门诊科室'"
								prop="mzksName"
							></el-table-column>

							<!-- 普通门诊 -->
							<!-- <el-table-column
								:label="'普通'"
                width="50"
							>
                <template slot-scope="scope">
                  <span>{{scope.row.ptmzBoolean}}</span>
                </template>
              </el-table-column> -->

              <!-- 是否急诊 -->
							<el-table-column
								:label="'急诊'"
                width="50"
							>
                <template slot-scope="scope">
                  <span :class="scope.row.jzmzBoolean=='否'?'isTrue':'isFalse'">{{scope.row.jzmzBoolean}}</span>
                </template>
              </el-table-column>

							<!-- 专家 -->
							<el-table-column
								:label="'专家'"
								prop="zjmzBoolean"
                width="50"
							></el-table-column>

							<!-- 专科 -->
							<el-table-column
								:label="'专科'"
								prop="zkmzBoolean"
                width="50"
							></el-table-column>

							<!-- 特需 -->
							<el-table-column
								:label="'特需'"
								prop="txmzBoolean"
                width="50"
							></el-table-column>

              <!-- 挂号费 -->
							<el-table-column
								:label="'挂号费'"
								prop="ghf"
                min-width="60"
                class-name="text-blue-td"
							></el-table-column>
							<!-- 诊疗费 -->
							<el-table-column
								:label="'诊疗费'"
								prop="zlf"
                min-width="60"
                class-name="text-blue-td"
							></el-table-column>
							<!-- 拼音码 -->
							<el-table-column
								:label="'拼音码'"
								prop="pydm"
							></el-table-column>

							<!-- 五笔码 -->
							<el-table-column
								:label="'五笔码'"
								prop="wbdm"
							></el-table-column>

							<!-- 数字码 -->
							<el-table-column
								:label="'数字码'"
								prop="szdm"
							></el-table-column>

              <!-- 角形码 -->
							<el-table-column
								:label="'角形码'"
								prop="jxdm"
                min-width="90"
							></el-table-column>

							<!-- 门诊类别 -->
							<el-table-column
								:label="'门诊类别'"
								prop="mzlbName"
							></el-table-column>

							<!-- 地点信息 -->
							<el-table-column
								:label="'地点信息'"
								prop="ddxx"
                show-overflow-tooltip
							></el-table-column>

							<!-- 科室分机号 -->
							<el-table-column
								:label="'科室分机号'"
								prop="ksfjh"
                width="110"
							></el-table-column>

							<!-- 启用叫号 -->
							<el-table-column
								:label="'启用叫号'"
								prop="sfqyBoolean"
							></el-table-column>

							<!-- 录入疾控报卡 -->
							<el-table-column
								:label="'录入疾控报卡'"
								prop="lrjkbkBoolean"
                width="100"
							></el-table-column>

              <!-- 科室类别 -->
							<el-table-column
								:label="'科室类别'"
							>
                <template slot-scope="scope">
                  {{scope.row.kslb|filterKslb}}
                </template>
              </el-table-column>

              <!-- 性别限制 -->
							<el-table-column
								:label="'性别限制'"
								prop="xbxzName"
							></el-table-column>

              <!-- 最大年龄限制 -->
							<el-table-column
								:label="'最大年龄限制'"
								prop="nlxz"
                width="100"
							></el-table-column>

              <el-table-column :label="$t('common.action')" width="50" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-tooltip
                    :content="$t('common.delete')"
                    effect="light"
                  >
                    <el-popconfirm
											:title="'确认删除？'"
											:confirmButtonText="$t('common.confirm')"
											:cancelButtonText="$t('common.cancel')"
                      @confirm="delDept(scope.row)"
											hideIcon
                    >
                      <el-button
                        slot="reference"
                        class="red"
                      >
                        <i class="icon his-del"></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col class="ht" :span="10">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <h1 class="title">{{rightTitle}}</h1>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                size="mini"
                class="green-gra"
                icon="icon his-save"
                @click="handleSave"
                :loading="showLoading"
              >{{$t('common.save')}}</el-button>
            </div>
          </div>
          <div class="form-wrap scroll-bar">
            <el-form
							ref="formData"
              :model="formData"
              :rules="formRule"
              label-width="86px"
              class="clearfix"
						>
							<!-- 科室名称 -->
							<el-form-item :label="'科室名称'" prop="ksmc">
                <el-input
                  :placeholder="'请输入科室名称'"
                  v-model="formData.ksmc"
                  @change="getPywb"
                ></el-input>
              </el-form-item>

							<!-- 门诊科室 -->
							<el-form-item :label="'门诊科室'" prop="mzks">
                <search-select
                  table-name="SYS_DICT_CONFIG"
                  kid="10"
                  v-model="formData.mzks"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.mzks"
                  @change="getMzksdm"
                />
              </el-form-item>

							<!-- 普通门诊 -->
							<el-form-item :label="'普通门诊'" prop="ptmz" hidden>
                <el-select v-model.number="formData.ptmz">
                  <el-option
                    v-for="item in booleanList"
                    :key="item.dv"
                    :value="Number(item.dv)"
                    :label="item.dn"
                  ></el-option>
								</el-select>
              </el-form-item>
              <div></div>

              <!-- 是否急诊 -->
							<el-form-item :label="'是否急诊'" prop="jzmz">
                <el-select v-model="formData.jzmz">
									<el-option
                    v-for="item in booleanList"
                    :key="item.dv"
                    :value="Number(item.dv)"
                    :label="item.dn"
                  ></el-option>
								</el-select>
              </el-form-item>

							<!-- 专家门诊 -->
							<el-form-item :label="'专家门诊'" prop="zjmz">
                <el-select v-model="formData.zjmz">
									<el-option
                    v-for="item in booleanList"
                    :key="item.dv"
                    :value="Number(item.dv)"
                    :label="item.dn"
                  ></el-option>
								</el-select>
              </el-form-item>

							<!-- 专科门诊 -->
							<el-form-item :label="'专科门诊'" prop="zkmz">
                <el-select v-model="formData.zkmz">
									<el-option
                    v-for="item in booleanList"
                    :key="item.dv"
                    :value="Number(item.dv)"
                    :label="item.dn"
                  ></el-option>
								</el-select>
              </el-form-item>

							<!-- 特需门诊 -->
							<el-form-item :label="'特需门诊'" prop="txmz">
                <el-select v-model="formData.txmz">
									<el-option
                    v-for="item in booleanList"
                    :key="item.dv"
                    :value="Number(item.dv)"
                    :label="item.dn"
                  ></el-option>
								</el-select>
              </el-form-item>

							<!-- 拼音码 -->
							<el-form-item :label="'拼音码'" prop="pydm">
                <el-input
                  :placeholder="'请输入拼音码'"
                  v-model="formData.pydm"
                ></el-input>
              </el-form-item>

							<!-- 五笔码 -->
							<el-form-item :label="'五笔码'" prop="wbdm">
                <el-input
                  :placeholder="'请输入五笔码'"
                  v-model="formData.wbdm"
                ></el-input>
              </el-form-item>

							<!-- 数字码 -->
							<el-form-item :label="'数字码'" prop="szdm">
                <el-input
                  :placeholder="'请输入数字码'"
                  v-model="formData.szdm"
                ></el-input>
              </el-form-item>

							<!-- 角形码 -->
							<el-form-item :label="'角形码'" prop="jxdm">
                <el-input
                  :placeholder="'请输入角形码'"
                  v-model="formData.jxdm"
                ></el-input>
              </el-form-item>

							<!-- 挂号费 -->
							<el-form-item :label="'挂号费'" prop="ghflb">
                <el-select v-model="formData.ghflb">
									<el-option
                    v-for="item in optionList.ghfProjectList"
                    :key="item.fyxh"
                    :value="Number(item.fyxh)"
                    :label="item.fymc"
                  ></el-option>
								</el-select>
              </el-form-item>
              <!-- 挂号金额 -->
							<el-form-item :label="'挂号金额'" prop="ghf">
                <el-input
                  :placeholder="'请输入挂号金额'"
                  v-model="formData.ghf"
                  class="text-blue"
                  disabled
                ></el-input>
                
              </el-form-item>
							<!-- 诊疗费 -->
							<el-form-item :label="'诊疗费'" prop="zlflb">
                <el-select v-model="formData.zlflb">
									<el-option
                    v-for="item in optionList.zlfProjectList"
                    :key="item.fyxh"
                    :value="Number(item.fyxh)"
                    :label="item.fymc"
                  ></el-option>
								</el-select>
              </el-form-item>
              <!-- 诊疗金额 -->
							<el-form-item :label="'诊疗金额'" prop="zlf">
                <el-input
                  :placeholder="'请输入诊疗金额'"
                  v-model="formData.zlf"
                  class="text-blue"
                  disabled
                ></el-input>
              </el-form-item>
							<!-- 门诊类别 -->
							<el-form-item :label="'门诊类别'" prop="mzlb">
                <search-select
                  table-name="SYS_DICT_CONFIG"
                  kid="11"
                  v-model="formData.mzlb"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.mzlb"
                />
              </el-form-item>

							<!-- 地点信息 -->
							<el-form-item :label="'地点信息'" prop="ddxx">
                <el-input
                  :placeholder="'请输入地点信息'"
                  v-model="formData.ddxx"
                ></el-input>
              </el-form-item>

							<!-- 科室分机号 -->
							<el-form-item :label="'科室分机号'" prop="ksfjh">
                <el-input
                  :placeholder="'请输入科室分机号'"
                  v-model="formData.ksfjh"
                ></el-input>
              </el-form-item>

							<!-- 启用叫号 -->
							<el-form-item :label="'启用叫号'" prop="sfqy">
                <el-select v-model="formData.sfqy">
									<el-option
                    v-for="item in booleanList"
                    :key="item.dv"
                    :value="Number(item.dv)"
                    :label="item.dn"
                  ></el-option>
								</el-select>
              </el-form-item>

							<!-- 录入疾控报卡 -->
							<el-form-item :label="'录入疾控报卡'" prop="lrjkbk">
                <el-select v-model="formData.lrjkbk">
									<el-option
                    v-for="item in booleanList"
                    :key="item.dv"
                    :value="Number(item.dv)"
                    :label="item.dn"
                  ></el-option>
								</el-select>
              </el-form-item>

              <!-- 科室类别 -->
							<el-form-item :label="'科室类别'" prop="kslb">
                <el-select v-model.number="formData.kslb">
                  <el-option :value="0" :label="'西医'"></el-option>
                  <el-option :value="1" :label="'中医'"></el-option>
								</el-select>
              </el-form-item>

              <!-- 性别限制 -->
							<el-form-item :label="'性别限制'" prop="xbxz">
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000269"
                  v-model="formData.xbxz"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.xbxz"
                />
              </el-form-item>

              <!-- 最大年龄限制 -->
							<el-form-item :label="'最大年龄限制'" prop="nlxz">
                <el-input
                  :placeholder="'请输入最大年龄限制'"
                  v-model.number="formData.nlxz"
                  type="number"
                ></el-input>
              </el-form-item>

               <!-- 互联网科室 -->
							<el-form-item :label="'互联网科室'" prop="sfqy" >
                <el-select v-model="formData.internet" @change="choice">
									<el-option
                    v-for="item in booleanList"
                    :key="item.dv"
                    :value="item.dv"
                    :label="item.dn"
                  ></el-option>
								</el-select>
              </el-form-item>
              <!-- 大病项目 -->
							<el-form-item :label="'大病项目'" prop="dbtype">
                <search-select
                  table-name="SYS_DICT_CONFIG"
                  kid="69"
                  v-model="formData.dbtype"
                  :placeholder="$t('emp.phSelect')"
                  :backfillValue="formData.dbtype"
                />
              </el-form-item>

              <!-- 儿科科室 -->
							<el-form-item :label="'儿科科室'" prop="pediatrics">
                <el-select v-model="formData.pediatrics">
									<el-option
                    v-for="item in booleanList"
                    :key="item.dv"
                    :value="item.dv"
                    :label="item.dn"
                  ></el-option>
								</el-select>
              </el-form-item>


              <!-- 大病项目 -->
							<el-form-item :label="'大病项目'" prop="dbtypeArr" class="dbtype" v-if="0">
                <el-checkbox-group v-model="formData.dbtypeArr">
                  <el-checkbox
                    v-for="item in dbtypeList"
                    :key="item.dv"
                    :label="item.dv"
                  >{{item.dn}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item :label="'大病项目'" prop="dbtype" v-if="0">
                <el-input v-model="formData.dbtype"></el-input>
              </el-form-item>

              <!-- 科室代码 -->
							<el-form-item :label="'科室代码'" prop="ksdm" hidden>
                <el-input
                  :placeholder="'请输入'"
                  v-model="formData.ksdm"
                ></el-input>
              </el-form-item>
						</el-form>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 打印表格 -->
    <div style="position:absolute;overflow:hidden;">
      <table id="printTable" ref="printTable" style="width:100%;border-collapse: collapse;">
        <thead>
          <tr>
            <th colspan="3" style="border:none;">挂号科室表</th>
          </tr>
          <tr>
            <th style="border:1px solid;"></th>
            <th style="border:1px solid;">科室名称</th>
            <th style="border:1px solid;">挂号费</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in this.printData" :key="index">
            <td style="border:1px solid;">{{index+1}}</td>
            <td style="border:1px solid;">{{item.ksmc}}</td>
            <td style="border:1px solid;">{{item.ghf}}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="font-size:12px;">
              总数：<span tdata="AllCount">###</span>
              挂号费合计：<span tdata="AllSum" tindex="3">####</span>
            </td>
            <td align="right">
              <span tdata="PageNO">#</span>/
              <span tdata="PageCount">#</span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

	</div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { IRegDept, aDeptAdd, aDeptEdit, aDeptDel,interMzks,getMzProject } from '@/api/his/op/reg/regDept.ts'
import { pywb } from '@/api/his/basic/index.ts'
import { getTableData } from '@/websql/functions'
import { id2Name, rightScroll } from '@/utils'
import { regInt, regTel, regPos } from '@/utils/validate.ts'
import { getLodop } from '@/plugins/lodop/index.js'

//声明接口
declare interface pageList {
  id: number
}

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'regDeptMaintain1',
  filters: {
    filterKslb(value: any){
      switch (value){
        case 0:
          return '西医'
          break
        case 1:
          return '中医'
          break
        case null:
          return ''
          break
      }
    }
  }
})
export default class extends Vue {
  //声明变量，方法
	private tableData: any[] = [] // 表格数据
	private searchData: any = {
    pydm: ''
  } // 搜索参数
	private listSlotHeight: number = 0
  private optionList:any = []
  private showLoading:boolean = false
	private loading: boolean = false
	private rightTitle: string = window.ele.$i18n.t('common.add')
	private formData: any = {
    ksdm: null,
    ksmc: '',
    mzks: null,
    kslb: 0,
    ptmz: 0, // hidden
    zjmz: 0,
    zkmz: 0,
    txmz: 0,
    jzmz: 0, // 是否急诊
    pydm: '',
    wbdm: '',
    szdm: '',
    jxdm: '', // 角形码
    ghf: '',
    zlf: '',
    ghflb:'',
    zlflb:'',
    mzlb: null,
    ddxx: '',
    ksfjh: '',
    sfqy: 0,
    lrjkbk: 0,
    xbxz: '', // 性别限制
    nlxz: '', // 年龄限制
    dbtypeArr: [], // 大病项目
    dbtype: '', // 大病项目 hidden
    internet:'0',//互联网科室
    pediatrics: '0', // 儿科科室
  } // 表单数据
  private mzks:any=''//门诊科室代码
  private validateMzType = (rule: any, value: any, callback: any) => {
    this.checkMzType(callback)
  }
	private formRule: any = {
    ksmc: [
      {required: true, message: '科室名称不能为空', trigger: 'blur'}
    ],
    mzks: [
      {required: true, message: '门诊科室不能为空', trigger: 'change'}
    ],
    ghflb: [
      // {required: true, message: '挂号费不能为空', trigger: 'blur'},
      // {pattern: regPos, message: '请输入正确的挂号费',trigger: 'blur'}
      {required: true, message: '挂号费不能为空', trigger: 'change'},
    ],
    zlflb: [
      {required: true, message: '诊疗费不能为空', trigger: 'change'},
      // {pattern: regPos, message: '请输入正确的诊疗费',trigger: 'blur'}
    ],
    mzlb: [
      {required: true, message: '门诊类别不能为空', trigger: 'change'}
    ],
    ksfjh: [
      {required: true, message: '科室分机号不能为空', trigger: 'blur'},
      {pattern: regTel, message: '请输入正确的电话号码',trigger: 'blur'}
    ],
    // ptmz: [
    //   {validator: this.validateMzType, trigger: 'change'}
    // ],
    // zjmz: [
    //   {validator: this.validateMzType, trigger: 'change'}
    // ]
  } // 表单验证
  private isAdd: boolean = true
  private booleanList: any[] = [] // 是否
  private deptList: any[] = [] // 门诊科室
  private opCategoryList: any[] = [] // 门诊科室
  private genderList: any[] = [] // 性别
  private printData: any[] = []
  private dbtypeList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SERIOUSILLNESS_ZLXM : this.$store.state.webSqlDict.SERIOUSILLNESS_ZLXM // 大病项目

  //监听方法
  @Watch('tableData')
	private onValueChange(value: string) {
    // this.loading = false
    rightScroll()
	}
  @Watch('formData.ghflb')
  private onGhfChange(){
    if(this.formData.ghflb){
      this.formData.ghf =this.optionList.ghfProjectList.find((item:any)=>item.fyxh==this.formData.ghflb).fydj
    }
  }
  @Watch('formData.zlflb')
  private onZlfChange(){
    if(this.formData.zlflb){
      this.formData.zlf =this.optionList.zlfProjectList.find((item:any)=>item.fyxh==this.formData.zlflb).fydj
    }
  }
	// 获取列表
  private getLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.getList()
  }

	// 获取详情
	private getDetail(row: any){
    this.mzks=row.mzks
    this.rightTitle = window.ele.$i18n.t('common.edit')
    this.isAdd = false
    // 清空校验结果
    const formData: any = this.$refs.formData
    formData.clearValidate()
    for (let i in this.formData) {
      if(i != 'dbtypeArr'){
        this.formData[i] = row[i]
      }
    }
    this.formData.dbtypeArr = this.formData.dbtype.split(',')
  }

  // 条件查询
  private searchLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }

  // 新增按钮
  private handleAdd(){
    this.rightTitle = window.ele.$i18n.t('common.add')
    this.isAdd = true
    const formData: any = this.$refs.formData
    formData.resetFields()
  }


//获取门诊科室代码
    private getMzksdm(value:any){
     this.mzks = value
     this.formData.internet='0'
   }

   //点击是否的时候判断
   private choice(value:any){
   if(value=='1'){
     interMzks({mzks:this.mzks}).then((item:any)=>{
       if(item.data!='1'){
         this.$notify({
           title:'门诊科室非互联网科室',
           message:'',
           type:'warning',
         })
         this.formData.internet='0'
       }else{
         this.formData.internet='1'
       }
     })
   }
   }
  // 保存按钮
  private handleSave(){
    const formData: any = this.$refs.formData
    formData.validate((valid: any)=>{
      if(valid){
        // 门诊类型验证
        let arr = [this.formData.zjmz, this.formData.zkmz, this.formData.txmz]
        let count = 0
        for(let i of arr){
          if(i == 1){
            count++
          }
        }
        if(count > 1){
          this.$notify({
            title: '',
            message: '专家门诊、转科门诊、特需门诊只能有一个选“是”',
            type: 'error',
          })
          return false
        }
        this.showLoading = true
        if(this.isAdd){
          this.addDept()
        }else{
          this.editDept()
        }
      }
    })
  }

  // 新增科室
  private addDept(){
    // this.formData.dbtype = this.formData.dbtypeArr.toString()
    let params = JSON.parse(JSON.stringify(this.formData))
    aDeptAdd(params).then((res:any)=>{
      this.showLoading = false
      if(res){
        this.$notify({
          title: this.$t('common.addSuc').toString(),
          message: '',
          type: 'success',
        })
        this.getLists()
        this.handleAdd()
      }
    }).catch((err:any)=>{
      this.showLoading = false
    })
  }

  // 编辑科室
  private editDept(){
    if(this.formData.nlxz==''){
      this.formData.nlxz=null
    }
    // this.formData.dbtype = this.formData.dbtypeArr.toString()
    let params = JSON.parse(JSON.stringify(this.formData))
    aDeptEdit(params).then((res:any)=>{
      this.showLoading = false
      if(res){
        this.$notify({
          title: this.$t('common.editSuc').toString(),
          message: '',
          type: 'success',
        })
        this.getLists()
        this.handleAdd()
      }
    }).catch((err:any)=>{
      this.showLoading = false
    })
  }

  // 删除科室
  private delDept(row: any){
    aDeptDel({ksdm: row.ksdm}).then((res: any) => {
      if(res){
        this.$notify({
          title: this.$t('common.delSuc').toString(),
          message: '',
          type: 'success',
        })
        this.getLists()
        this.handleAdd()
      }
    })
  }

  // 门诊类型验证，最多只有一个选“是”
  private checkMzType(callback: any){
    let arr = [this.formData.ptmz, this.formData.zjmz, this.formData.zkmz, this.formData.txmz]
    let count = 0
    for(let i of arr){
      if(i == 1){
        count++
      }
    }
    if(count > 1){
      callback(new Error('普通、专家、转科、特需只能有一个选“是”'))
    }else{
      callback()
    }
  }

  // 生成拼音五笔
  private getPywb(value: any){
    pywb(value).then((res: any) => {
      if(res){
        this.formData.pydm = res.data.pinyin
        this.formData.wbdm = res.data.wubi
      }
    })
  }

  // 获取字典数据
  private getDicData(){
    const _that = this
    getTableData( // 是否
      'SYS_FLAG_DATA',
      'FD000005',
      "select dv,dn from SYS_FLAG_DATA_VALUE where dk='FD000005'",
      function (data: any) {
        _that.booleanList = data
        getTableData( // 门诊科室
          'SYS_DICT_CONFIG',
          '10',
          "select dv,dn from SYS_DICT_CONFIG_VALUE where dk='10'",
          function (data: any) {
            _that.deptList = data
            getTableData( // 门诊类别
              'SYS_DICT_CONFIG',
              '11',
              "select dv,dn from SYS_DICT_CONFIG_VALUE where dk='11'",
              function (data: any) {
                _that.opCategoryList = data
                getTableData( // 性别
                  'SYS_PRIMARY_DATA',
                  'PD0000000269',
                  "select dv,dn from SYS_PRIMARY_DATA_VALUE where dk='PD0000000269'",
                  function (data: any) {
                    _that.genderList = data
                    _that.getLists()
                  }
                )
              }
            )
          }
        )
      }
    )
  }

  // 表格转字典数据
  get tableFormat() {
    let newData: any = []
    newData = id2Name(this.tableData, 'mzks', 'mzksName', this.deptList, 'dv', 'dn')
    newData = id2Name(this.tableData, 'mzlb', 'mzlbName', this.opCategoryList, 'dv', 'dn')
    newData = id2Name(this.tableData, 'ptmz', 'ptmzBoolean', this.booleanList, 'dv', 'dn')
    newData = id2Name(this.tableData, 'jzmz', 'jzmzBoolean', this.booleanList, 'dv', 'dn')
    newData = id2Name(this.tableData, 'zjmz', 'zjmzBoolean', this.booleanList, 'dv', 'dn')
    newData = id2Name(this.tableData, 'zkmz', 'zkmzBoolean', this.booleanList, 'dv', 'dn')
    newData = id2Name(this.tableData, 'txmz', 'txmzBoolean', this.booleanList, 'dv', 'dn')
    newData = id2Name(this.tableData, 'sfqy', 'sfqyBoolean', this.booleanList, 'dv', 'dn')
    newData = id2Name(this.tableData, 'lrjkbk', 'lrjkbkBoolean', this.booleanList, 'dv', 'dn')
    newData = id2Name(this.tableData, 'xbxz', 'xbxzName', this.genderList, 'dv', 'dn')
    return newData
  }
  //获取项目名称
  private getMzProjectList(){
    getMzProject().then((res:any)=>{
      this.optionList = res.data
    })
  }
  // 打印分页表格
  private print(){
    const __qiankun__ = window.__POWERED_BY_QIANKUN__
    let LODOP: any = null
    if (__qiankun__) {
      LODOP = Vue.prototype.$getLodop()
    } else {
      LODOP = getLodop()
    }
    const pageTable: any = this.$refs['pageTable']
    pageTable.getAllData().then((res: any) => {
      this.printData = res

      LODOP.PRINT_INIT()
      LODOP.SET_PRINT_PAGESIZE(1, "100mm", "140mm", "")
      let table: any = document.getElementById("printTable")
      this.$nextTick(()=>{
        LODOP.ADD_PRINT_TABLE("10mm","6mm", "RightMargin:6mm","BottomMargin:10mm",table.outerHTML)
        LODOP.PREVIEW()
      })
      
    })
  }

  //初始化的周期函数
	created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 104
  }
  mounted() {
    this.getDicData()
    this.getMzProjectList()
    // this.getLists()
	}
}

</script>

<style lang="scss" scoped>
.search ::v-deep .el-input__inner{
  width: 190px!important;
}
.form-wrap{
  height: calc(100% - 52px);
}
.el-form {
	margin: 0 auto!important;
	.el-form-item {
    width: 48%;
    &:nth-child(odd) {
      float: left;
    }
    &:nth-child(even) {
      float: right;
    }
    &.province{
      width: 100%;
      .cascade-address{
        width: 100%;
      }
    }
    &.dbtype{
      width: 100%;
      .el-checkbox{
        margin-right: 20px;
      }
    }
    .search-select {
      width: 100%;
      ::v-deep .el-select {
        width: 100%;
        .el-input__inner {
          width: 100% !important;
        }
      }
    }
  }
}

 #printTable{
  position: absolute;
  z-index: -1;
  left: 0;
  top: 100px;
}
</style>
