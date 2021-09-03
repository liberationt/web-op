<template>
  <div class="content">
		<el-row class="ht" :gutter="10">
      <el-col class="ht" :span="4">
        <week @changeDate="changeDate" @getAmpm="getAmpm" />
      </el-col>
      <el-col class="ht" :span="20">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <h1 class="title">科室排班</h1>
              <el-divider direction="vertical"></el-divider>
              <div class="searchTitle">搜索</div>
              <el-input
                v-model="searchData.keyword"
                :placeholder="$t('hospitalDataDict.formValidPyCode')"
                @change="searchList"
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
                <el-button
                  type="text"
                  :disabled="isTrue"
                  @click="saveSchInfo(searchData.ghrq, searchData.zblb)"
                >
                  <i class="icon his-btn-save green"></i>
                  <span>保存</span>
                </el-button>
                <el-button
                  type="text"
                  @click="allTrue"
                  :disabled="isTrue"
                >
                  <i class="icon his-btn-confirm blue"></i>
                  <span>全是</span>
                </el-button>
                <el-button
                  type="text"
                  :disabled="isTrue"
                  @click="allFalse"
                >
                  <i class="icon his-btn-close red"></i>
                  <span>全否</span>
                </el-button>
                <!-- <el-popconfirm
                  title="确认复制排班到下一天吗？"
                  @confirm="addDay"
                  :hideIcon="true"
                >
                  <el-button
                    slot="reference"
                    type="text"
                    :disabled='nextTrue'
                  >
                    <i class="icon his-btn-copy blue"></i>
                    <span>复制到下一天</span>
                  </el-button>
                </el-popconfirm> -->
                <el-button
                    slot="reference"
                    type="text"
                    :disabled='nextTrue'
                    @click="coopyNextDay"
                  >
                    <i class="icon his-btn-copy blue"></i>
                    <span>复制到下一天</span>
                  </el-button>
              </div>
            </div>
          </div>
          <div class="clearfix">
            <!-- <pagenation-list
              ref="pageTable"
              v-model="tableData"
              data-url="/op-service/opkspb/doGetModelDataOperation"
              :search-data="searchData"
              http-method="post"
              :list-height="listSlotHeight"
            > -->
              <el-table
                slot="list"
                stripe
                ref="table"
                :highlight-current-row="true"
                :data="tableData"
                border
                v-loading="loading"
                :height="listSlotHeight"
                class="input-table scroll-bar no-underline"
                tooltip-effect="light"
              >
                <!-- 序号 -->
                <el-table-column
                  type="index"
                  width="40"
                  align="center"
                ></el-table-column>

                <!-- 门诊机构名称 -->
                <el-table-column
                  :label="'门诊机构名称'"
                  prop="mzmc"
                ></el-table-column>

                <!-- 科室名称 -->
                <el-table-column
                  :label="'科室名称'"
                  prop="ksmc"
                ></el-table-column>

                <!-- 挂号科室代码 -->
                <el-table-column
                  :label="'挂号科室代码'"
                  prop="ghks"
                ></el-table-column>

                <!-- 排班 -->
                <el-table-column
                  :label="'排班'"
                >
                  <template slot-scope="scope">
                    <el-select :disabled="isTrue" v-model="scope.row.kspb" @change="((value)=>{changePb(value,scope.row)})">
                      <el-option
                        v-for="item in booleanList"
                        :key="item.dv"
                        :value="Number(item.dv)"
                        :label="item.dn"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>

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
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model.number="scope.row.yyxe"
                      maxlength="10"
                      class="text-blue"
                    ></el-input>
                  </template>
                </el-table-column>

              </el-table>
            <!-- </pagenation-list> -->

            <!-- <pre class="scroll-bar">{{this.schInfo}}</pre> -->


          </div>
        </div>
      </el-col>
    </el-row>
	</div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aDeptSchList, aSaveDeptSch, aSaveCopy,getTimerInfor,getIsTrue,getIsNext } from '@/api/his/op/reg/deptSchedule.ts'
import week from './components/week.vue'
import { getTableData } from '@/websql/functions'
import { parseTime, rightScroll } from '@/utils'
import { regInt } from '@/utils/validate.ts'
import moment from 'moment';

//声明接口
declare interface pageList {
  id: number
}

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'deptSchedule1',
  filters: {},
  components:{
    week
  }
})
export default class extends Vue {
  //声明变量，方法
  private tableData: any[] = [] // 表格数据
  private tableDataClone: any[] = [] // 表格数据
	private searchData: any = {
    ghrq: '', // 日期
    zblb: '', // 上午下午
    keyword:''
  } // 搜索参数
	private listSlotHeight: number = 0
  private loading: boolean = true
  private booleanList: any[] = [] // 是否
  private schInfo: any = [
    {
      ghks: '',
      ghrq: '',
      ghxe: 0,
      ksmc: '',
      kspb: 0,
      mzmc: '',
      officeCode: 0,
      tgbz: 0,
      yyxe: 0,
      zblb: 0
    }
  ]
  private zblbList: any[] = [
    {
      sddm:'',
      sdmc:''
    }
  ] // 班次
  private dqdjrq:any = "" //当前点击的日期
  private xbsj:any = "" //下班时间
  private isTrue:boolean = false 
  private nextTrue:boolean = false //复制下一天
  private usersList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.USERS_DICT : this.$store.state.webSqlDict.USERS_DICT // 用户列表

  get searchDataClone(){
    return JSON.parse(JSON.stringify(this.searchData))
  }

  // 监听方法
  @Watch('tableData')
	private onValueChange(value: string) {
    this.loading = false
    rightScroll()
  }
  @Watch('searchDataClone', {deep: true})
	private searchDataChange(newValue:any, oldValue:any) {
    if(JSON.stringify(this.tableData) != JSON.stringify(this.tableDataClone)){
      this.$confirm(`是否保存当前更改？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.saveSchInfo(oldValue.ghrq, oldValue.zblb)
      }).catch(() => {
        this.getLists()
      });
    }else{
      this.getLists()
    }
  }
  private searchList(val:any){
  }
  private coopyNextDay(){
    if(JSON.stringify(this.tableData) != JSON.stringify(this.tableDataClone)){
      this.$notify({
        title: '请先保存当前更改',
        message: '',
        type: 'warning'
      })
      return false
    }
    this.loading = true
    var curDay = new Date(this.searchData.ghrq)
    var nextDay = curDay.setDate(curDay.getDate()+1)
    var nextDayString = parseTime(nextDay,'{y}-{m}-{d}')
    // this.saveSchInfo(nextDayString)
    let params = {
      currDate: this.searchData.ghrq,
      nextDate: nextDayString,
      zblb: this.searchData.zblb
    }
    getIsNext(params).then((res:any)=>{
      this.loading = false
      if(res.errorCode=="SUCCESS"){
        this.$confirm('确认复制排班到下一天吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          aSaveCopy(params).then((res: any) => {
            if(res.errorCode=='SUCCESS'){
              this.$notify({
                title: '复制成功',
                message: '',
                type: 'success'
              })
            }else{
              this.$message.error(res.message)
            }
          })
        })
      }else{
        if(res.errorCode=='ERROR_REG_0092'||res.errorCode=='ERROR_REG_0091'){
          this.$confirm('当前排班与第二天冲突，是否继续复制？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            aSaveCopy(params).then((res: any) => {
              if(res.errorCode=='SUCCESS'){
                this.$notify({
                  title: '复制成功',
                  message: '',
                  type: 'success'
                })
              }else{
                this.$message.error(res.message)
              }
            })
          })
        }else{
          this.$message.error(res.message)
        }
      }
    }).catch((err:any)=>{
      this.loading = false
    })
  }
  // 子组件切换日期
  private changeDate(date: string){
    this.$nextTick(()=>{
      this.searchData.ghrq = date
      this.dqdjrq = date
      this.handelSave(date,this.searchData.zblb)
      this.handelDate(date)
    })

  }
  private changePb(val:any,row:any){
    row.ghrq = this.searchData.ghrq
    row.zblb = this.searchData.zblb
    getIsTrue([row]).then((res:any)=>{
      if(res.errorCode!="SUCCESS"){
        if(row.kspb==1){
          row.kspb = 0
        }else{
          row.kspb = 1
        }
        this.$message.error(res.message)
      }
    })
    // console.log(val,"val",row)
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
    //当前点击时间下班时间+1时间戳
    let newtimer = null
    if(this.searchData.zblb == '1000009'){
      newtimer = new Date(timer1).getTime()+48*60*60*1000
    }else{
      newtimer = new Date(timer1).getTime()+24*60*60*1000
    }
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

  // 获取列表
  private getLists(){
    if(this.searchData.zblb){
      this.loading = true
      // const pageTable: any = this.$refs['pageTable']
      // pageTable.getList()
      aDeptSchList(this.searchData).then((res: any) => {
        if(res){
          this.tableData = res.data
          this.tableDataClone = JSON.parse(JSON.stringify(this.tableData))
          this.loading = false
        }
      })
    }
  }

  // 条件查询
  private searchLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }
  // 保存排班
  private saveSchInfo(date: any, zblb: any){
    // let params = []
    // for(let i of this.tableData){
    //   let param = {
    //     a: i.A,
    //     b: i.B
    //   }
    //   params.push(param)
    // }
    this.schInfo = JSON.parse(JSON.stringify(this.tableData))
    for(let i of this.schInfo){
      if(!regInt.test(i.ghxe) || !regInt.test(i.yyxe)){
        this.$notify({
          title: '请输入正确的限额',
          message: '',
          type: 'warning'
        })
        return false
      }
      i.ghrq = date
      i.zblb = zblb
    }
    // return false
    aSaveDeptSch(this.schInfo).then((res: any) => {
      if(res){
        this.$notify({
          title: '保存成功',
          message: '',
          type: 'success'
        })
        this.getLists()
      }
    })
  }

  // 赋值到下一天
  private addDay(){
    if(JSON.stringify(this.tableData) != JSON.stringify(this.tableDataClone)){
      this.$notify({
        title: '请先保存当前更改',
        message: '',
        type: 'warning'
      })
      return false
    }
    var curDay = new Date(this.searchData.ghrq)
    var nextDay = curDay.setDate(curDay.getDate()+1)
    var nextDayString = parseTime(nextDay,'{y}-{m}-{d}')
    // this.saveSchInfo(nextDayString)
    let params = {
      currDate: this.searchData.ghrq,
      nextDate: nextDayString,
      zblb: this.searchData.zblb
    }
    aSaveCopy(params).then((res: any) => {
      if(res){
        this.$notify({
          title: '复制成功',
          message: '',
          type: 'success'
        })
      }
    })
  }

  // 全是
  private allTrue(){
    let deepCole:any = JSON.parse(JSON.stringify(this.tableData))
    for(let i of this.tableData){
      i.kspb = 1
      i.zblb = this.searchData.zblb
      i.ghrq = this.searchData.ghrq
    }
    //判断是否可以排班
    getIsTrue( this.tableData ).then((res:any)=>{
      if(res.errorCode!="SUCCESS"){
        deepCole.map((item:any,index:any)=>{
          if(item.ghks===this.tableData[index].ghks){
            this.tableData[index].kspb = item.kspb
          }
        })
        this.$message.error(res.message)
      }
    })
  }

  // 全否
  private allFalse(){
    let deepCole:any = JSON.parse(JSON.stringify(this.tableData))
    for(let i of this.tableData){
      i.kspb = 0
      i.zblb = this.searchData.zblb
      i.ghrq = this.searchData.ghrq
    }
    //判断是否可以排班
    getIsTrue( this.tableData ).then((res:any)=>{
      if(res.errorCode!="SUCCESS"){
        deepCole.map((item:any,index:any)=>{
          if(item.ghks===this.tableData[index].ghks){
            this.tableData[index].kspb = item.kspb
          }
        })
        this.$message.error(res.message)
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
      }
    )
  }


  //初始化的周期函数
	created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 72
    
    this.getDicData()
  }
  mounted() {
    // const __qiankun__ = window.__POWERED_BY_QIANKUN__
    // if (__qiankun__) {
    //   this.zblbList = Vue.prototype.$store.webSqlDict.SCHEDULE_TIME
    //   console.log(this.zblbList,77777);
    // } else {
    //   this.zblbList = this.$store.state.webSqlDict.SCHEDULE_TIME
    //   console.log(this.zblbList);
    // }
    
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

// 调试
// .pagenation-list{
//   float: left;
//   width: 80%;
// }
// pre{
//   float: left;
//   width: 20%;
//   height: 800px;
//   overflow: auto;
//   font-size: 14px;
// }
</style>
