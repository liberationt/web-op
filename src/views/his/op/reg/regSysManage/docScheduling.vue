<template>
  <div class="content">
		<el-row class="ht" :gutter="10">
      <el-col class="ht" :span="4">
        <week @changeDate="changeDate" @getAmpm="getAmpm" @getCurWeek="getCurWeek"/>
      </el-col>
      <el-col class="ht" :span="13">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <h1 class="title">医生排班</h1>
              <el-divider direction="vertical"></el-divider>
              <div class="searchTitle">搜索</div>
              <el-input
                v-model="searchData.keyword"
                :placeholder="$t('hospitalDataDict.formValidPyCode')"
                style="width:200px"
              >
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input>
              <el-divider direction="vertical"></el-divider>
              <el-radio-group
                v-model="searchData.zblb"
                class="small-radio-group"
                @change="pbChange"
              >
                <el-radio v-for="item in zblbList" :key="item.sddm" :label="item.sddm">{{item.sdmc}}</el-radio>
              </el-radio-group>
              <el-divider direction="vertical"></el-divider>
              <div class="btn">
                <!-- 保存 -->
                <el-button type="text" size="mini" @click="save" :disabled="isTrue">
                  <i class="icon his-btn-save green"></i>
                  <span>保存</span>
                </el-button>

                <!-- 复制 -->
                <!-- <el-button type="text" size="mini" @click="handleCopy">
                  <i class="icon his-btn-copy blue"></i>
                  <span>复制</span>
                </el-button> -->

                <!-- 一周数据复制 -->
                <el-button type="text" size="mini" @click="handleCopyWeek" :disabled="nextTrue">
                  <i class="icon his-btn-copy blue"></i>
                  <span>一周数据复制</span>
                </el-button>
              </div>
            </div>
            <!-- <span>{{curDept}}</span> -->
          </div>
          <div class="row">
            <div class="label">
              <div class="am-pm">
                <!-- 值班类别：{{this.searchData.ampm==1?'上午':'下午'}} -->
                值班类别：
                <span v-if="zblbList.find(item => item.dv==searchData.zblb)">
                  {{zblbList.find(item => item.dv==searchData.zblb).dn}}
                </span>
                <span v-else>{{searchData.zblb}}</span>
                <span>({{tableData1.length}}条记录)</span>
              </div>
            </div>
          </div>
          <div class="">
            <el-table
              stripe
              ref="table"
              :highlight-current-row="true"
              :data="tableData1"
              @row-click="getDetail"
              border
              v-loading="loading1"
              :height="listSlotHeight"
              class="scroll-bar input-table table1"
              tooltip-effect="light"
            >
							<!-- 序号 -->
              <el-table-column
								type="index"
								width="32"
                align="center"
							></el-table-column>

							<!-- 挂号科室 -->
							<el-table-column
								:label="'挂号科室'"
								prop="ksmc"
							></el-table-column>

              <!-- 医生姓名 -->
							<el-table-column
								:label="'医生姓名'"
								prop="personName"
							></el-table-column>

              <!-- 挂号限额 -->
							<el-table-column
								:label="'挂号限额'"
							>
                <template slot-scope="scope">
                  <el-input
                    v-model.number="scope.row.ghxe"
                    maxlength="10"
                    class="text-blue"
                  ></el-input>
                </template>
              </el-table-column>

              <!-- 预约限额 -->
							<el-table-column
								:label="'预约限额'"
								prop="yyxe"
							>
                <template slot-scope="scope">
                  <el-input
                    v-model.number="scope.row.yyxe"
                    maxlength="10"
                    class="text-blue"
                  ></el-input>
                </template>
              </el-table-column>

              <!-- 服务类型 -->
							<el-table-column
								:label="'服务类型'"
							>
                <template slot-scope="scope">
                  <el-select v-model="scope.row.fwlx">
                    <el-option
                      v-for="item in fwlxList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.name"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              
              <el-table-column
                :label="$t('common.action')"
                width="80"
                align="center"
                fixed="right"
                class-name="action-btns"
              >
                <template slot-scope="scope">
                  <el-tooltip
                    :content="$t('common.copy')"
                    effect="light"
                  >
                    <span>
                      <el-button class="green" @click="handleCopyDoc(scope.row)">
                        <i class="icon his-right_caozuo_fuzhi"></i>
                      </el-button>
                    </span>
                  </el-tooltip>
                  <el-tooltip
                    :content="$t('common.delete')"
                    effect="light"
                  >
                    <el-popconfirm
											:title="'确认删除？'"
											:confirmButtonText="$t('common.confirm')"
											:cancelButtonText="$t('common.cancel')"
                      @confirm="del(scope.row,scope.$index)"
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
            <!-- <pre>{{tableData1}}</pre> -->
            <!-- <pre>{{tableData2}}</pre> -->
            <!-- <pre>{{arrDocId}}</pre> -->
          </div>
        </div>
      </el-col>
      <el-col class="ht" :span="7">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <h1 class="title">科室医生</h1>
            </div>
          </div>
          <div class="row">
            <div class="label">
              <span class="tag dept-label">挂号科室</span>
              <el-select
                v-model="curDept.ghks"
                class="dept-select"
                @change="getDeptDocList"
              >
                <el-option
                  v-for="item in deptList"
                  :key="item.ghks"
                  :value="item.ghks"
                  :label="item.ksmc"
                ></el-option>
              </el-select>
              <el-input
                v-model="pyCode"
                :placeholder="'拼音码查询'"
                @input="pyFilter"
                class="pym-search"
              ></el-input>
            </div>
          </div>
          <div>
            <el-table
              stripe
              ref="table"
              :highlight-current-row="true"
              :data="tableData2"
              @row-dblclick="checkYspb"
              border
              v-loading="loading2"
              :height="listSlotHeight"
              class="scroll-bar"
              tooltip-effect="light"
            >
							<!-- 序号 -->
              <el-table-column
                type="index"
								width="32"
                align="center"
							></el-table-column>

							<!-- 所属科室 -->
							<el-table-column
								:label="'所属科室'"
								prop="officeCode"
							>
                <template slot-scope="scope">
                  <div v-if="mzksList.find(item => item.dv==scope.row.officeCode)" class="text-ellipsis">
                    {{mzksList.find(item => item.dv==scope.row.officeCode).dn}}
                  </div>
                  <div v-else>{{scope.row.officeCode}}</div>
                </template>
              </el-table-column>

              <!-- 医生姓名 -->
							<el-table-column
								:label="'医生姓名'"
								prop="personName"
							></el-table-column>

              <!-- 性别 -->
							<el-table-column
								:label="'性别'"
								prop="gender"
                width="60"
							>
                <template slot-scope="scope">
                  <div v-if="genderList.find(item => item.dv==scope.row.gender)" class="text-ellipsis">
                    {{genderList.find(item => item.dv==scope.row.gender).dn}}
                  </div>
                  <div v-else>{{scope.row.gender}}</div>
                </template>
              </el-table-column>
              
              
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      title="医生排班复制"
      :visible.sync="dialogVisible1"
      class="narrow-dialog"
    >
      <div class="his-module his-small">
        <el-form
          :model="formCopy"
          label-width="80px"
        >
          <el-form-item
            :label="'选择时间段'"
          >
            <el-date-picker
              type="daterange"
              v-model="formCopy.daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              class="date-wrapper"
              :picker-options="pickerOptions1"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogVisible1">取消</el-button>
        <el-button type="primary" @click="copyDoc">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="一周排班复制"
      :visible.sync="dialogVisible2"
      class="narrow-dialog"
    >
      <div v-if="curWeek.length>0">确认将本周({{curWeek[0].date}} - {{curWeek[6].date}})医生排班数据复制到后续4周吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="copyWeek">确定</el-button>
      </span>
    </el-dialog>
    <!-- <pre>当前科室<br>{{curDept}}</pre> -->
	</div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  aDocSchList, aDeptList, aDeptDocList, aSaveDocSch, aDelDocSch, aCopyDoc, aCopyWeek, aVaildYspbByZblb
} from '@/api/his/op/reg/docSchedule.ts'
import week from './components/week.vue'
import { parseTime } from '@/utils'
import { getTableData } from '@/websql/functions'
import { id2Name, rightScroll } from '@/utils'
import { regInt } from '@/utils/validate.ts'
import { aValidRoomId } from '@/api/his/op/reg/consultingRoomInfo'
// import { getTimerInfor } from '@/api/his/op/reg/deptSchedule.ts'
import moment from 'moment';

//声明接口
declare interface pageList {
  id: number
}

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: '',
  filters: {},
  components:{
    week
  }
})
export default class extends Vue {
  //声明变量，方法
  private tableData1: any[] = [] // 表格数据
  private tableData1Copy: any[] = [] // 表格数据
  private arrDocId: any[] = [] // tableData1医生id
  private tableData2: any[] = [] // 表格数据
  private tableData2Copy: any[] = [] // 表格数据
  private searchData: any = {
    date: '',
    zblb: '',
    keyword:''
  }
  private curDept: any = { // 当前科室
    ghks: '',
    ksmc: '',
    officeCode: ''
  } 
	private listSlotHeight: number = 0
  private loading1: boolean = true
  private loading2: boolean = false
  private deptList: any = [] // 当日排班科室
  private dialogVisible1: boolean = false
  private dialogVisible2: boolean = false
  private formCopy: any = {
    // beginDay: '',
    // endDay: '',
    daterange: []
  }
  private defaultSlelct:any[]= []
  private curWeek: any[] = []
  private row: any = {} // 当前行数据
  private fwlxList: any = [
    {value: 1, name: '坐诊'},
    {value: 2, name: '上门'},
  ]
  private pickerOptions1:any = {
    disabledDate(time:any) {
        return time.getTime() < Date.now() ;
    }
  }
  private pyCode: any = '' // 查询的拼音码
  private officeList: any[] = [] // 门诊科室列表
  private genderList: any[] = Vue.prototype.$qiankun?Vue.prototype.$store.webSqlDict.SEX_DICT:this.$store.state.webSqlDict.SEX_DICT // 性别
  private mzksList = Vue.prototype.$qiankun?Vue.prototype.$store.webSqlDict.OUTPATIENT_DEPARTMENT:this.$store.state.webSqlDict.OUTPATIENT_DEPARTMENT // 门诊科室列表
  // private zblbList: any[] = Vue.prototype.$qiankun?Vue.prototype.$store.webSqlDict.SCHEDULE_TIME:this.$store.state.webSqlDict.SCHEDULE_TIME // 班次
  private zblbList: any[] = [
    {
      sddm:'',
      sdmc:''
    }
  ] 
  private dqdjrq:any = "" //当前点击的日期
  private xbsj:any = "" //下班时间
  private isTrue:boolean = false 
  private nextTrue:boolean = false //复制下一天
  get searchDataClone(){
    return JSON.parse(JSON.stringify(this.searchData))
  }
	

  //监听方法
  @Watch('tableData1', {deep: true})
	private onValueChange(value: string) {
    this.loading1 = false
    this.arrDocId = []
    for(let i of this.tableData1){
      this.arrDocId.push(i.ysdm)
    }
  }
  @Watch('searchDataClone', {deep: true})
	private searchDataChange(newValue:any, oldValue:any) {
    if(JSON.stringify(this.tableData1) != JSON.stringify(this.tableData1Copy)){
      this.$confirm(`是否保存当前更改？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.save()
        this.getDeptList()
      }).catch(() => {
        this.defaultSlelct = []
        this.getDocSchList()
        this.getDeptList()
      });
    }else{
      this.getDocSchList()
      this.getDeptList()
    }
    
  }
   // 子组件切换日期
  private changeDate(date: string){
      this.searchData.date = date
      this.dqdjrq = date
      this.handelSave(date,this.searchData.zblb)
      this.handelDate(date)
  }
  //保存 全是 全否
  private handelSave(date:any,num:any){
    let oDate = date + " " + this.xbsj
    var oDate1 = new Date(oDate);
    var newDate = null
    var oDate2 = new Date(moment().format("YYYY-MM-DD HH:mm:ss"));
    if(num == '1000009'){
      newDate = oDate2.getTime()-24*60*60*1000
    }else{
      newDate = oDate2.getTime()
    }
    if(oDate1.getTime() < newDate){
      this.isTrue = true
    }else{
      this.isTrue = false
    }
  }
  //上下午排版改变
  private pbChange(val:any){
    let ssdm:any = this.zblbList.filter((item:any)=>item.sddm==val)[0]
    this.xbsj = ssdm.xbsj
    this.handelDate(this.dqdjrq)
    this.handelSave(this.dqdjrq,val)
  }
  private handelDate(date:any){
    //当前点击时间下班时间
    let timer1 = date +' ' +this.xbsj
    //当前点击时间下班时间+7时间戳
    let newtimer = new Date(timer1).getTime()+24*7*60*60*1000
    //当前时间
    let today = moment().format("YYYY-MM-DD HH:mm:ss")
    // 当前时间时间戳
    let newtoday = new Date(today).getTime()
    if(newtimer<newtoday){
      this.nextTrue = true
    }else{
      this.nextTrue = false
    }
  }
  // 子组件获取上下午
  private getAmpm(ampm: number,zblbList:any){
    // this.searchData.zblb = ampm
    // this.searchData.zblb = this.zblbList[0].sddm
    this.xbsj = zblbList[0].xbsj
    this.handelSave(moment().format("YYYY-MM-DD"),this.xbsj)
    this.searchData.zblb = '1000006'
    this.zblbList = zblbList
  }
  // 子组件获取一周
  private getCurWeek(curWeek: any){
    this.curWeek = curWeek
  }


  // 获取当日所有医生列表
  private getDocSchList(){
    this.loading1 = true
    let params = {
      gzrq: this.searchData.date,
      zblb: this.searchData.zblb,
      keyword:this.searchData.keyword
    }
    aDocSchList(params).then((res: any) => {
      if(res){
        this.tableData1 = res.data
        this.tableData1Copy = JSON.parse(JSON.stringify(this.tableData1))
        this.tableData1=this.tableData1.concat(this.defaultSlelct)
        this.loading1 = false
        // 拆出医生代码组成数组
        // this.arrDocId = []
        // for(let i of this.tableData1){
        //   this.arrDocId.push(i.ysdm)
        // }
      }
    })
  }

  // 切换日期获取当日排班科室
  private getDeptList(){
    let params = {
      ghrq: this.searchData.date,
      zblb: this.searchData.zblb
    }
    aDeptList(params).then((res: any) => {
      if(res){
        this.deptList = res.data
        if(this.deptList.length){ // 默认选中第一个科室
          this.curDept.ghks = this.deptList[0].ghks
          this.curDept.ksmc = this.deptList[0].ksmc
          this.curDept.officeCode = this.deptList[0].officeCode
          this.getDeptDocList(this.curDept.ghks)
        }else{
          this.curDept.ghks = ''
          this.curDept.ksmc = ''
          this.curDept.officeCode = ''
          this.tableData2 = []
        }
      }
    })
  }

  // 获取某科室科室里所有医生
  private getDeptDocList(value: any){
    for(let i of this.deptList){
      if(i.ghks == value){
        this.curDept = {
          ghks: i.ghks,
          ksmc: i.ksmc,
          officeCode: i.officeCode
        }
        break
      }
    }

    this.loading2 = true
    let params = {
      // gzrq: this.searchData.date,
      zblb: this.searchData.zblb,
      // officeCode: this.curDept.officeCode,
      ksdm: value
    }
    aDeptDocList(params).then((res: any) => {
      if(res){
        this.tableData2 = res.data
        this.loading2 = false
        // 过滤左侧已有的
        this.tableData2 = this.tableData2.filter((item)=>{
          return !this.arrDocId.includes(item.personId)
        })
        this.tableData2Copy = [...this.tableData2]
      }
    })
  }

  // 拼音码过滤
  private pyFilter(value: any){
    this.tableData2 = [...this.tableData2Copy]
    this.tableData2 = this.tableData2.filter((item)=>{
      return item.pyCode.indexOf(value.toUpperCase())>-1
    })
  }


  

  private getDetail(row: any){
    // let index = this.tableData1.findIndex((item: any) => {
    //   return item.ysdm == row.ysdm
    // })
    // this.tableData1.splice(index, 1)

    // this.tableData2.push(row)
  }

  // 校验医生的值班类别
  private checkYspb(row: any){
    let params = {
      gzrq: this.searchData.date,
      zblb: this.searchData.zblb,
      ksdm: this.curDept.ghks,
      ysdm: row.personId,
    }
    aVaildYspbByZblb(params).then((res: any) => {
      if(res){
        this.toLeft(row)
      }
    })
  }


  // 双击转移
  private toLeft(row: any){
    if(this.isTrue) return
    let index = this.tableData2.findIndex((item: any) => {
      return item.personId == row.personId
    })
    this.tableData2.splice(index, 1)
    let docSch = {
      ksdm: this.curDept.ghks,
      ksmc: this.curDept.ksmc,
      ysdm: row.personId,
      personName: row.personName,
      ghxe: 1000,
      yyxe: 1000,
      fwlx: 1,
      gzrq: this.searchData.date,
      zblb: this.searchData.zblb,
      //新增
      gender:row.gender,
      pyCode:row.pyCode
    }
    this.tableData1.push(docSch)
    this.defaultSlelct.push(docSch)
  }

  // 删除转移

  // 保存排班
  private save(){
    for(let i of this.tableData1){
      if(i.ghxe==='' || i.yyxe==='' || i.ghxe===null || i.yyxe===null){
        console.log(i.yyxe);
        this.$notify({
          title: '限额不能为空',
          message: '',
          type: 'warning'
        })
        return false
      }
      if(!regInt.test(i.ghxe) || !regInt.test(i.yyxe)){
        this.$notify({
          title: '请输入正确的限额',
          message: '',
          type: 'warning'
        })
        return false
      }
    }
    aSaveDocSch(this.tableData1).then((res: any) => {
      if(res){
        this.$notify({
          title: '保存成功',
          message: '',
          type: 'success'
        })
        this.defaultSlelct = []
        this.getDocSchList()
      }
    })
  }

  // 删除排班
  private del(row: any,index:number){
    //jzxh 判断是否存在数据库  由右边到左边 没有保存的话 是没有请求接口的 所以删除的时候 是不走接口的
    if(row.jzxh>=0){
      row.gzrq = row.gzrq.substr(0,10)
      aDelDocSch(row).then((res: any) => {
        if(res){
          this.$notify({
            title: '删除成功',
            message: '',
            type: 'success'
          })
          // this.defaultSlelct = this.tableData2.filter((item:any)=>item.ysdm!=row.ysdm)
          this.getDocSchList()
          this.getDeptDocList(this.curDept.ghks)
        }
      })
    }else{
      this.tableData1.splice(index,1)
      let docSch = {
        ksdm: null,
        personId: row.ysdm,
        personName: row.personName,
        gzrq: null,
        zblb: null,
        //新增
        gender:row.gender,
        pyCode:row.pyCode,
        ghrq: null,
        jgid:null
      }
      this.tableData2.push(docSch)
      // this.defaultSlelct.map((item:any)=>{
      //   if(item.ysdm==row.ysdm){

      //   }
      // })
      this.defaultSlelct = this.tableData2.filter((item:any)=>item.ysdm!=row.ysdm)
      console.log('this.defaultSlelct没有请求接口',this.defaultSlelct)
    }

  }

  // 打开复制
  private handleCopyDoc(row: any){
    this.dialogVisible1 = true
    this.formCopy.daterange = []
    this.row = row
  }
  private closeDialogVisible1(){
    this.dialogVisible1 = false
    this.formCopy.daterange = []
  }
  // 复制一条
  private copyDoc(){
    let params = {
      beginDay: this.formCopy.daterange[0],
      endDay: this.formCopy.daterange[1],
      ysdm: this.row.ysdm,
      ksdm: this.row.ksdm,
      ghxe: this.row.ghxe,
      yyxe: this.row.yyxe,
      fwlx: this.row.fwlx,
      zblb:this.searchData.zblb
    }
    aCopyDoc(params).then((res: any) => {
      if(res){
        this.$notify({
          title: '复制成功',
          message: '',
          type: 'success'
        })
        this.closeDialogVisible1()
      }
    })
  }

  // 打开复制
  private handleCopyWeek(){
    this.dialogVisible2 = true
  }

  // 复制一周
  private copyWeek(){
    if(JSON.stringify(this.tableData1) != JSON.stringify(this.tableData1Copy)){
      this.$notify({
        title: '请先保存当前更改',
        message: '',
        type: 'warning'
      })
      this.dialogVisible2 = false
      return false
    }
    let params = {
      beginDay: this.curWeek[0].date,
      endDay: this.curWeek[6].date
    }
    aCopyWeek(params).then((res: any) => {
      if(res){
        this.$notify({
          title: '复制成功',
          message: '',
          type: 'success'
        })
        this.dialogVisible2 = false
      }
    })
  }

  // 条件查询
  private searchLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }



  // 获取字典数据
  private getDicData(){
    const _that = this
    getTableData( // 所属科室
      'SYS_DICT_CONFIG',
      '4',
      "select dv,dn from SYS_DICT_CONFIG_VALUE where dk='4'",
      function (data: any) {
        _that.officeList = data
      }
    )
  }



  //初始化的周期函数
	created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 120
  }
  mounted() {
    // this.getDicData()
    // console.log(this.zblbList)
    // getTimerInfor().then((res:any)=>{
    //   this.zblbList = res.data
    // })
	}
}
</script>

<style lang="scss" scoped>
@import '@/styles/inputTable.scss';
// 单选框
.small-radio-group {
  .el-radio {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
    ::v-deep .el-radio__label {
      padding-left: 4px;
      font-size: 13px;
    }
  }
}

.am-pm{
  font-size: 14px;
  color: $blue;
  span{
    font-size: 13px;
    color: $second;
  }
}

.tag.dept-label{
  padding: 0 8px 0 0!important;
  font-size: 13px;
}

.dept-select{
  width: 50%;
  margin-right: 8px;
  ::v-deep .el-input__inner{
    width: 100%!important;
  }
}
.pym-search{
  width: 50%;
  ::v-deep .el-input__inner{
    width: 100%!important;
  }
}

// 重置
.el-dialog__wrapper{
	::v-deep .el-dialog__body{
		padding: 20px 0 10px;
	}
}



// 调试
// .table1{
//   float: left;
//   width: 60%;
// }
// pre{
//   float: left;
//   width: 20%;
//   height: 700px;
//   font-size: 12px;
//   border: 1px solid #ccc;
//   overflow: auto;
// }
pre{
  position: absolute;
  z-index: 9999;
  right: 0;
  bottom: 0;
  font-size: 12px;
}
</style>
