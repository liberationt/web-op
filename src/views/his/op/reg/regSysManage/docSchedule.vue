<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="19">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <el-form ref="searchData" :model="searchData" label-width="40px" class="form4 clearfix display">
                <div class="form-area mr10">
                  <el-form-item :label="'类别'" prop="zdlb">
                    <el-select v-model="searchData.zblb" clearable style="width:150px;">
                      <el-option v-for="item in zblbList" :key="item.sddm" :value="item.sddm" :label="item.sdmc"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-area mr10">
                  <!-- 病人可能挂过相同的科室，formData.ghks由patientGhks转换 -->
                  <el-form-item :label="'科室'" prop="ghks">
                    <el-select v-model="searchData.ghks" ref="ghks" clearable :filter-method="searchKsdm1" filterable popper-class="hidden-option" style="width:150px;">
                      <el-option v-for="item in ksdmList1" :key="item.ksdm" :value="item.ksdm" :label="item.ksmc">
                        <span>{{ item.ksmc }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-area mr10">
                  <!-- 医生姓名 -->
                  <el-form-item :label="'姓名'" prop="ysdm">
                    <el-select v-model="searchData.ysdm" ref="ysxm" clearable :filter-method="searchDoc1" filterable style="width:150px;">
                      <el-option v-for="item in docList1" :key="item.ysdm" :value="Number(item.ysdm)" :label="item.ysmc"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-area">
                  <el-button type="primary" size="mini" @click="searchLists">查询</el-button>
                  <el-button type="primary" size="mini" @click="changeWeek(1)">上一周</el-button>
                  <el-button type="primary" size="mini" @click="changeWeek(2)">下一周</el-button>
                  <el-button type="primary" size="mini" @click="changeWeek(3)">本周</el-button>
                  <el-button type="primary" size="mini" @click="generate(1,2)">生成排班</el-button>
                </div>
              </el-form>
            </div>
          </div>
          <div class="clearfix">
            <pagenation-list ref="pageTable" v-model="tableData" data-url="/op-service/oppbjl/queryPage" :search-data="searchData" http-method="post" :list-height="listSlotHeight">
              <el-table slot="list" stripe ref="table" :highlight-current-row="true" :data="tableData" border v-loading="loading" :height="listSlotHeight" class="input-table scroll-bar no-underline" tooltip-effect="light" @row-dblclick="editDate">
                <!-- 门诊机构名称 -->
                <el-table-column :label="'科室/医生'" prop="mzmc" align="center">
                  <template slot-scope="{ row }">
                    <div class="ksmcInfo">
                      <span class="jz">{{ row.type == 1 ? '普' : '专' }}</span>
                      <span>{{ row.ksmc }}</span>
                      <span>{{ row.ysmc }}</span>
                      <div class="displayFlex">
                        <span class="copy" @click="generate(row,1)">生成</span>
                        <span class="copy" @click="stopDoc(row)">停诊</span>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <!-- 科室名称 -->
                <el-table-column :label="'值班类别'" prop="zbmc" align="center"></el-table-column>
                <!-- 挂号科室代码 -->
                <el-table-column :label="item.label + '(' +(item.value) + ')'" prop="ghks" align="center" v-for="(item,i) in headerList" :key="i">
                  <template slot-scope="{ row }">
                    <doc-Week :showWeekDate="getInfo(row.opPbjlRespList, i+1) > -1" @changeStatus="changeStatus" @getFormData="getFormData" :dataInfo="row.opPbjlRespList[getInfo(row.opPbjlRespList, i+1)]" :rowData="row"></doc-Week>
                  </template>
                </el-table-column>
              </el-table>
            </pagenation-list>
          </div>
        </div>
      </el-col>
      <el-col class="ht" :span="5">
        <div class="his-module his-small week-wrap">
          <div class="row">
             <div class="label">
              <el-button type="primary" size="mini" @click="handelOption">操作日志</el-button></el-button>
            </div>
            <div class="label">
              <el-button type="primary" size="mini" @click="handelAdd">重置</el-button>
            </div>
            <div class="label">
              <el-button type="primary" size="mini" @click="handelSave('formData')">保存</el-button>
            </div>
          </div>
          <div class="cur-week">
            <el-form ref="formData" :rules="rulesForm" :model="formData" label-width="70px">
              <div class="form-area">
                <el-form-item :label="'值班类别'" prop="zblb">
                  <el-select v-model="formData.zblb" @change="getYsdm">
                    <el-option v-for="item in zblbList" :key="item.sddm" :value="Number(item.sddm)" :label="item.sdmc"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="form-area">
                <el-form-item :label="'挂号科室'" prop="ghks">
                  <el-select v-model="formData.ghks" :filter-method="searchKsdm2" filterable popper-class="hidden-option">
                    <el-option v-for="item in ksdmList2" :key="item.ksdm" :value="item.ksdm" :label="item.ksmc">
                      <span>{{ item.ksmc }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="form-area">
                <el-form-item :label="'医生姓名'" prop="ysdm"
                :rules="[
                  { 
                    required: false, 
                    message: '请选择医生姓名~', 
                    trigger: 'change',
                    validator: (rule, value, callback)=>{validateYs(rule, value, callback)}
                  }
                ]"
                >
                  <el-select v-model="formData.ysdm" ref="ysxm" :filter-method="searchDoc2" filterable :disabled="disabledYs">
                    <el-option v-for="item in docList2" :key="item.personId" :value="Number(item.personId)" :label="item.personName"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="form-area">
                <!-- 医生姓名 -->
                <el-form-item :label="'日期'" prop="date">
                  <!-- <el-select v-model="formData.rq" placeholder="请选择">
                    <el-option v-for="item in dataOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select> -->
                  <el-date-picker
                    v-model="formData.date"
                    align="right"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
              <div class="form-area">
                <el-form-item :label="'挂号限额'" prop="ghxe">
                  <el-input v-model="formData.ghxe" placeholder="挂号限额"></el-input>
                </el-form-item>
              </div>
              <div class="form-area">
                <el-form-item :label="'预约限额'" prop="yyxe">
                  <el-input v-model="formData.yyxe" placeholder="预约限额"></el-input>
                </el-form-item>
              </div>
              <div class="form-area">
                <el-form-item :label="'挂号费'" prop="ghf">
                  <el-select v-model="formData.ghf" placeholder="挂号费">
                    <el-option v-for="item in projectList.ghfProjectList" :key="item.fyxh" :label="item.fymc" :value="item.fyxh"> </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="form-area">
                <el-form-item :label="'挂号金额'" prop="ghje">
                  <el-input placeholder="挂号金额" v-model="formData.ghje" disabled></el-input>
                </el-form-item>
              </div>
              <div class="form-area">
                <el-form-item :label="'诊疗费'" prop="zlf">
                  <el-select v-model="formData.zlf" placeholder="挂号费">
                    <el-option v-for="item in projectList.zlfProjectList" :key="item.fyxh" :label="item.fymc" :value="item.fyxh"> </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="form-area">
                <el-form-item :label="'诊疗金额'" prop="zlje">
                  <el-input v-model="formData.zlje" disabled placeholder="诊疗金额"></el-input>
                </el-form-item>
              </div>
              <div class="form-area">
                <el-form-item :label="'专家费'" prop="zjf">
                  <el-select v-model="formData.zjf" placeholder="挂号费">
                    <el-option v-for="item in projectList.zjfProjectList" :key="item.fyxh" :label="item.fymc" :value="item.fyxh"> </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="form-area">
                <el-form-item :label="'专家金额'" prop="zjje">
                  <el-input v-model="formData.zjje" disabled placeholder="专家金额"></el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="停诊" :visible.sync="dataDialogVisible" width="600px" :close-on-click-modal="false" @close="closeDataDialogVisible">
      <div style="padding-bottom: 30px">
        <div>
          <el-form ref="copyData" :model="copyData" label-width="40px" class="form4 clearfix display">
            <div class="dataTimer">
              <el-form-item label="时间">
                <el-row :gutter="8">
                  <el-col :span="11">
                    <el-date-picker type="date" placeholder="开始时间" value-format="yyyy-MM-dd" v-model="copyData.startDate"></el-date-picker>
                  </el-col>
                  <el-col class="line" :span="2">至</el-col>
                  <el-col :span="11">
                    <el-date-picker type="date" placeholder="结束时间" value-format="yyyy-MM-dd" v-model="copyData.endDate" ></el-date-picker>
                  </el-col>
                </el-row>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div style="margin-bottom: 10px">
          <el-checkbox :indeterminate="isIndeterminate" v-model="dataCheckAll" @change="handleCheckAllChange">全选</el-checkbox>
        </div>
        <el-checkbox-group v-model="dataList" @change="handleCheckedCitiesChange">
          <el-checkbox :label="item.value" v-for="item in dataOptions" :key="item.value">{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dataDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDataClone" :loading="showLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="排班" :visible.sync="genDialogVisible" width="600px" :close-on-click-modal="false" @close="resetPbForm('generate')">
      <div style="padding-bottom: 30px">
        <el-form ref="generate" :model="generateForm" label-width="40px" class="form4 ">
          <!-- 病人可能挂过相同的科室，formData.ghks由patientGhks转换 -->
          <div class="display">
            <el-form-item>
              <el-radio v-model="generateForm.isAll" :label="1" v-if="pbShow">全部模板</el-radio>
              <el-radio v-model="generateForm.isAll" :label="0" v-if="pbShow">选择模板</el-radio>
              <el-select v-model="generateForm.index" ref="ysxm" clearable  filterable v-if="pbShow&&generateForm.isAll==0" class="mr10">
                <el-option v-for="item in templateList" :key="item.index" :value="item.index" :label="item.viewText"></el-option>
              </el-select>
              <el-checkbox v-model="generateForm.cover">是否覆盖</el-checkbox>
            </el-form-item>
          </div>
          <div class="dataTimer">
            <el-form-item label="时间">
              <el-row :gutter="8">
                <el-col :span="11">
                  <el-date-picker type="date" placeholder="开始时间" value-format="yyyy-MM-dd" v-model="generateForm.startDate"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">至</el-col>
                <el-col :span="11">
                  <el-date-picker type="date" placeholder="结束时间" value-format="yyyy-MM-dd" v-model="generateForm.endDate" ></el-date-picker>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
        </el-form>
        <!-- <el-checkbox-group v-model="dataList" @change="handleCheckedCitiesChange">
          <el-checkbox :label="item.value" v-for="item in dataOptions" :key="item.value">{{ item.label }}</el-checkbox>
        </el-checkbox-group> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="genDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="configPb" :loading="showLoading">生成</el-button>
      </span>
    </el-dialog>
    <div class="optionData">
    <el-dialog title="操作记录" :visible.sync="optionDialog" width="1000px" height="300px" :close-on-click-modal="false" @close="closeOptionDialog">
      <div>
        <el-date-picker
          v-model="timerList"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-select v-model="optionForm.userId" :filter-method="searchKsdm2" filterable popper-class="hidden-option" style="margin:0 15px;">
          <el-option v-for="item in docOptionList" :key="item.ysdm" :value="item.ysdm" :label="item.ysmc">
            <span>{{ item.ysmc }}</span>
          </el-option>
        </el-select>
        <el-button type="primary" @click="getOption">查询</el-button>
      </div>
      <div class="display">
        <div class="his-module his-small" style="width:50%">
          <div class="clearfix">
            <!-- <pagenation-list ref="pageTable" v-model="optionList" data-url="/op-service/oppbjlerror/findList" :search-data="opterDate1" http-method="post" :list-height="listSlotHeight"> -->
              <el-table slot="list" stripe ref="table" :highlight-current-row="true" :data="optionList" border v-loading="loading" :height="listSlotHeight-190" class="input-table scroll-bar no-underline" tooltip-effect="light" @row-click="handelDetails">
                <!-- 门诊机构名称 -->
                <el-table-column label="操作人" prop="name" align="center"> </el-table-column>
                <!-- 科室名称 -->
                <el-table-column label="操作时间" prop="operationTime" align="center"></el-table-column>
              </el-table>
            <!-- </pagenation-list> -->
          </div>
        </div>
        <div class="his-module his-small" style="width:50%">
          <div class="clearfix">
            <pagenation-list ref="pageTable" v-model="optionList1" data-url="/op-service/oppbjlerror/listByUuid" :search-data="opterDate2" http-method="post" :list-height="listSlotHeight-190">
              <el-table slot="list" stripe ref="table" :highlight-current-row="true" :data="optionList1" border v-loading="loading" :height="listSlotHeight-190" class="input-table scroll-bar no-underline" tooltip-effect="light">
                <!-- 门诊机构名称 -->
                <el-table-column label="科室名称" prop="ksmc" align="center"> </el-table-column>
                <!-- 科室名称 -->
                <el-table-column label="医生姓名" prop="ysmc" align="center"></el-table-column>
                <el-table-column label="值班类别" prop="sdmc" align="center"></el-table-column>
              </el-table>
            </pagenation-list>
          </div>
        </div>
      </div>
      
    </el-dialog>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import docWeek from './components/docWeek.vue'
import { getTableData } from '@/websql/functions'
import { parseTime, rightScroll } from '@/utils'

import { getTimerInfor, aDeptSchList, getProjectList, getDocList, getGhksList, cloneDataCove, deleteDate, doCheckData, cloneWithKsYs, deleteKsInfo } from '@/api/his/op/reg/deptSchedule.ts'
import { aDeptDocList ,handelCheck,saveDoc,changeDocStatus,templateList,saveGenerateRecord,optionList,optionListDetails,getOperatorList} from '@/api/his/op/reg/docSchedule.ts'

//声明接口
declare interface pageList {
  id: number
}

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'deptSchedule1',
  filters: {},
  components: {
    docWeek,
  },
})
export default class extends Vue {
  //声明变量，方法
  private headerList:any = []
  private zblbList: any = [] //值班类别
  private projectList: any = {
    ghfProjectList: [],
    zlfProjectList: [],
    zjfProjectList: [],
  }
  private copyData: any = {
    ghks: '',
    ysdm: '',
  }
  private generateForm:any ={
    cover:false,
    startDate:'',
    endDate:''
  }
  private optionDialog:boolean = false
  private radio:string = "1"
  private dataDialogVisible: boolean = false
  private genDialogVisible:boolean = false
  private dataList: any = []
  private isIndeterminate: boolean = false
  private dataCheckAll: boolean = false
  private dataIsCove: boolean = false
  private pbShow:boolean = false
  private dataOptions: any = [
    {
      label: '周一',
      value: 1,
    },
    {
      label: '周二',
      value: 2,
    },
    {
      label: '周三',
      value: 3,
    },
    {
      label: '周四',
      value: 4,
    },
    {
      label: '周五',
      value: 5,
    },
    {
      label: '周六',
      value: 6,
    },
    {
      label: '周日',
      value: 7,
    },
  ]
  private rulesForm:any = {
    zblb:[
      { required: true, message: '请选择值班类别', trigger: 'change' },
    ],
    ghks:[
      { required: true, message: '请选择挂号科室', trigger: 'change' },
    ],
    date:[
      { required: true, message: '请选择日期', trigger: 'change' },
    ],
    ghxe:[
      { required: true, message: '请输入挂号限额', trigger: 'blur' },
    ],
    yyxe:[
      { required: true, message: '请输入预约限额', trigger: 'blur' },
    ],
    ghf:[
      { required: true, message: '请选择挂号费', trigger: 'change' },
    ],
    zlf:[
      { required: true, message: '请选择诊疗费', trigger: 'change' },
    ],
    zjf:[
      { required: true, message: '请选择专家费', trigger: 'change' },
    ],
  }
  private showLoading: boolean = false
  private optionList:any = []
  private docOptionList :any = []
  private optionList1:any = []
  private opterDate2:any = {
    uuid:''
  }
  private optionForm:any = {
    userId:''
  }
  private timerList:any = []
  private ghksList: any = []
  private docList: any = []
  private docListInfo: any = []
  private docList1: any = []
  private docList2: any = []
  private docList3: any = []
  private formData: any = {}
  private disabledYs: boolean = false
  private ysdm: any = ''
  private tableData: any[] = [] // 表格数据
  private ksdmList1: any = []
  private ksdmList2: any = []
  private current: any = {}
  private showCopyData: boolean = false
  private searchData: any = {
    zblb: '',
    ghks: '',
    ysdm: '',
    startDate:'',
    endDate:''
  } // 搜索参数
  private listSlotHeight: number = 0
  private loading: boolean = true
  private usersList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.USERS_DICT : this.$store.state.webSqlDict.USERS_DICT // 用户列表
  // 监听方法
  @Watch('tableData')
  private onValueChange(value: string) {
    this.loading = false
    rightScroll()
  }
  //挂号费
  @Watch('formData.ghf')
  private onGhfChange(val: any) {
    if (this.formData.ghf) {
      this.getGhje(val)
    }
  }
  //诊疗费
  @Watch('formData.zlf')
  private onZlfChange(val: any) {
    if (this.formData.zlf) {
      this.getZlje(val)
    }
  }
  //专家费
  @Watch('formData.zjf')
  private onZjfChange(val: any) {
    if (this.formData.zjf) {
      this.getZjje(val)
    }
  }
  @Watch('formData.ghks')
  private onYsdmChange(val: any) {
    this.ksdmList2 = this.ghksList
    this.getDoc()
  }
  @Watch('searchData.ghks')
  private YsdmChange(val: any) {
    this.ksdmList1 = this.ghksList
  }
  @Watch('searchData.ysdm')
  private onYsChange(val: any) {
    this.docList1 = this.docListInfo
  }
  // 重置
  private handelAdd() {
    this.disabledYs = false
    this.resetForm()
  }
  //操作日志
  private closeOptionDialog(){
    this.optionList = []
    this.optionList1 = []
  }
  private handelOption(){
    this.optionDialog = true
    this.getOption()
    getOperatorList({pydm:''}).then((res:any)=>{
      this.docOptionList = res.data
    })
  }
  private getOption(){
    let params = {
      endDate:this.timerList.length?this.timerList[1]:'',
      startDate:this.timerList.length?this.timerList[0]:'',
      userId:this.optionForm.userId
    }
    optionList(params).then((res:any)=>{
      if(res.errorCode=="SUCCESS"){
        this.optionList = res.data
      }
    })
  }
  private handelDetails(row:any){
    this.opterDate2 = {
      uuid:row.uuid
    }
    optionListDetails({uuid:row.uuid}).then((res:any)=>{
      if(res.errorCode=='SUCCESS'){
        this.optionList1 = res.data.list
      }
    })
  }
  //保存
  private handelSave(formName:any) {
    (this.$refs[formName] as any).validate((valid:any) => {
      if (valid) {
        // if (this.ghksList.find((item: any) => item.ksdm === this.formData.ghks).kslb === 0 && !this.formData.ysdm) {
        //   return this.$notify.warning('请选择医生')
        // }
        let dataInfo = {
          ghks: this.formData.ghks,
          zblb: this.formData.zblb,
          ysdm: this.formData.ysdm,
          type: 1,
          date:this.formData.date
        }
        if (!this.formData.jlxh) {
          handelCheck(dataInfo).then((res: any) => {
            if (res.errorCode == 'SUCCESS') {
              this.saveDate()
            }
          })
        } else {
          this.saveDate()
        }
      }
    });
  }
  //校验医生
  private validateYs(rule:any, value:any, callback:any){
    if(this.formData.ghks&&this.formData.zblb){
      if (this.ghksList.find((item: any) => item.ksdm === this.formData.ghks).kslb === 0 && this.formData.ysdm==="") {
        callback(new Error("请选择科室医生"))
      }else{
        callback()
      }
    }
  }
  private saveDate() {
    let params = {
      ...this.formData,
    }
    saveDoc(params).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.$notify.success('保存成功')
        this.formData.jlxh = ''
        this.searchLists()
        this.resetForm()
      }
    })
  }
  private resetForm() {
    ;(this.$refs.formData as any).resetFields()
  }
  //生成排班
  private generate(row: any,num:any) {
    if(num ==1 ){
      this.pbShow = false
    }else{
      this.pbShow = true
    }
    this.handelPb(row)
  }
  //排班处理
  private handelPb(row:any){
    this.current = row
    this.$set(this.generateForm,'cover',false);
    this.genDialogVisible = true
  }
  //确定排班
  private configPb(){
    let params:any ={
      cover:this.generateForm.cover?1:0,
      endDate:this.generateForm.endDate,
      startDate:this.generateForm.startDate,
    }
    if(this.pbShow){
      params.isAll = this.generateForm.isAll
      if(this.generateForm.isAll==0&&this.pbShow&&this.generateForm.index){
        let row:any = this.templateList.find((item: any) => item.index === this.generateForm.index)
        params.ysdm= row.ysdm
        params.ghks= row.ghks
        params.zblb= row.zblb
      }
    }else{
       params.zblb = this.current.zblb
       params.ghks = this.current.ghks
       params.ysdm = this.current.ysdm
    }
    saveGenerateRecord(params).then((res:any)=>{
      if(res.errorCode=='SUCCESS'){
        this.$notify.success('生成成功')
        this.searchLists()
        this.resetPbForm()
      }
    })
  }
  private resetPbForm(){
    this.generateForm ={}
    this.pbShow = false
    this.genDialogVisible = false
  }
  //批量停诊
  private stopDoc(row: any) {
    this.current = row
    this.dataDialogVisible = true
  }
  //确定停诊
  private saveDataClone() {
    this.showLoading = true
    let params = {
      tgbz:1,
      endDate:this.copyData.endDate,
      ghks:this.current.ghks,
      rqList:this.dataList,
      startDate:this.copyData.startDate,
      ysdm:this.current.ysdm,
      zblb:this.current.zblb
    }
    changeDocStatus(params).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.showLoading = false
        this.$notify.success('修改成功')
        this.searchLists()
      }else{
        this.showLoading = false
      }
      this.closeDataDialogVisible()
    })
  }
  // 关闭
  private closeDataDialogVisible() {
    this.dataIsCove = false
    this.isIndeterminate = false
    this.dataCheckAll = false
    this.dataDialogVisible = false
    this.showCopyData = false
    this.dataList= []
    this.copyData = {}
  }
  // 条件查询
  private searchLists() {
    this.$nextTick(()=>{
      const pageTable: any = this.$refs['pageTable']
      pageTable.searchList()
    })
  }
  private getInfo(data: any, num: any) {
    // return
    let index = data.findIndex((item: any) => item.rq == num)
    return index
  }
  //获取值班类别
  private getZblb() {
    getTimerInfor().then((res: any) => {
      this.zblbList = res.data
    })
  }
  //获取项目名称
  private getProject() {
    getProjectList().then((res: any) => {
      this.projectList = res.data
    })
  }
  //获取挂号科室
  private getGhks() {
    getGhksList().then((res: any) => {
      this.ghksList = res.data.list
      this.ksdmList1 = res.data.list
      this.ksdmList2 = res.data.list
      // this.projectList = res.data
    })
  }
  // 过滤科室
  private searchKsdm1(value: any) {
    // 总是从原数组中过滤
    this.ksdmList1 = this.ghksList.filter((item: any) => {
      return item.pydm.indexOf(value.toUpperCase()) > -1
    })
  }
  private searchKsdm2(value: any) {
    // 总是从原数组中过滤
    this.ksdmList2 = this.ghksList.filter((item: any) => {
      return item.pydm.indexOf(value.toUpperCase()) > -1
    })
  }
  //过滤医生
  private searchDoc1(value: any) {
    // 总是从原数组中过滤
    this.docList1 = this.docListInfo.filter((item: any) => {
      return item.pydm.indexOf(value.toUpperCase()) > -1
    })
  }
  private searchDoc2(value: any) {
    // 总是从原数组中过滤
    this.docList2 = this.docList.filter((item: any) => {
      return item.pyCode.indexOf(value.toUpperCase()) > -1
    })
  }
  private searchDoc3(value: any) {
    // 总是从原数组中过滤
    this.docList3 = this.docList.filter((item: any) => {
      return item.pyCode.indexOf(value.toUpperCase()) > -1
    })
  }
  //获取科室下面的医生
  private getDoc() {
    if (!this.formData.zblb) {
      return
    }
    this.$set(this.formData, 'ysdm', '')
    let params = {
      zblb: this.formData.zblb,
      ksdm: this.formData.ghks,
    }
    aDeptDocList(params).then((res: any) => {
      if (res) {
        this.docList = res.data
        this.docList2 = res.data
        if (this.ysdm) {
          this.formData.ysdm = this.ysdm
        }
      }
    })
  }
  // 获取医生
  private getDocInof() {
    getDocList().then((res: any) => {
      if (res) {
        this.docListInfo = res.data
        this.docList1 = res.data
      }
    })
  }
  handleCheckAllChange(val: any) {
    this.dataList = val ? [1, 2, 3, 4, 5, 6, 7] : []
    this.isIndeterminate = false
  }
  private handleCheckedCitiesChange(value: any) {
    let checkedCount = value.length
    this.dataCheckAll = checkedCount === this.dataOptions.length
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.dataOptions.length
  }
  //修改状态
  private changeStatus(row: any) {
    let params = {
      jlxh: row.jlxh,
      tgbz: row.tgbz==1?0:1,
    }
    this.$confirm(`确定${row.tgbz==1?'接诊':'停诊'}?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      changeDocStatus(params).then((res: any) => {
        if (res.errorCode == 'SUCCESS') {
          this.$notify.success('修改成功')
          this.searchLists()
        }
      })
    })
  }
  //获取医生代码 防止出错 细节修改
  private getYsdm() {
    if (this.formData.ksdm) {
      this.getDoc()
    }
  }
  private editDate(row: any, column: any, cell: any, event: any) {
    // console.log(row,666,column,cell,event)
  }
  private getFormData(row: any, dataRow: any) {
    this.disabledYs = dataRow.ysdm ? false : true
    this.ysdm = dataRow.ysdm
    this.formData = {
      zblb: dataRow.zblb,
      ghks: dataRow.ghks,
      ysdm: dataRow.ysdm,
      date: row.date,
      ghxe: row.ghxe,
      yyxe: row.yyxe,
      ghf: row.ghf,
      zlf: row.zlf,
      zjf: row.zjf,
      jlxh: row.jlxh,
    }
    if (row.ghf) {
      this.getGhje(row.ghf)
    }
    if (row.zlf) {
      this.getZlje(row.zlf)
    }
    if (row.zjf) {
      this.getZjje(row.zjf)
    }
  }
  private getGhje(val: any) {
    this.formData.ghje = this.projectList.ghfProjectList.find((item: any) => item.fyxh === val).fydj || ''
  }
  private getZlje(val: any) {
    this.formData.zlje = this.projectList.zlfProjectList.find((item: any) => item.fyxh === val).fydj || ''
  }
  private getZjje(val: any) {
    this.formData.zjje = this.projectList.zjfProjectList.find((item: any) => item.fyxh === val).fydj || ''
  }
  private getCurrent(){
    const week = new Date(this.timestamp).getDay() // 今天是星期几（0~6）
    const sunday = this.timestamp - 24 * 60 * 60 * 1000 * week // 第一天的时间戳
    for (let i = 0; i < 7; i++) {
      var day = sunday + 24 * 60 * 60 * 1000 * (i + 1)
      var dateStr = this.parseTime(day, '{m}/{d},{a}')
      this.headerList.push({ value: dateStr.split(',')[0], label: dateStr.split(',')[1] })
      var dateyear = this.getYearData(day, '{y}-{m}-{d},{a}')
      this.yearData.push(dateyear.split(',')[0])
    }
    this.searchData.startDate = this.yearData[0]
    this.searchData.endDate = this.yearData[6]
    this.searchLists()
  }
  private parseTime(time:any, cFormat:any){
    const format = cFormat || '{m}-{d}'
    let date = null
    if (typeof time === 'object') {
      date = time
    } else {
      if (typeof time === 'string') {
        if (/^[0-9]+$/.test(time)) {
          time = parseInt(time)
        } else {
          time = time.replace(new RegExp(/-/gm), '/')
        }
      }
      if (typeof time === 'number' && time.toString().length === 10) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj:any = {
      m: date.getMonth() + 1,
      d: date.getDate(),
      a: date.getDay(),
      b: date.getHours() < 12 ? 1 : 2
    }
    const timeStr = format.replace(/{([ymdhisab])+}/g, (result:any, key:any) => {
      const value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][value]
      }
      if (key === 'b') {
        return value.toString()
      }
      return value.toString().padStart(2, '0')
    })
    return timeStr
  }
  //获取当前时间
  private getYearData(time:any, cFormat:any){
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date = null
    if (typeof time === 'object') {
      date = time
    } else {
      if (typeof time === 'string') {
        if (/^[0-9]+$/.test(time)) {
          time = parseInt(time)
        } else {
          time = time.replace(new RegExp(/-/gm), '/')
        }
      }
      if (typeof time === 'number' && time.toString().length === 10) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj:any = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay(),
      b: date.getHours() < 12 ? 1 : 2
    }
    const timeStr = format.replace(/{([ymdhisab])+}/g, (result:any, key:any) => {
      const value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][value]
      }
      if (key === 'b') {
        return value.toString()
      }
      return value.toString().padStart(2, '0')
    })
    return timeStr
  }
  private arrWeek :any =[]
  private yearData :any =[]
  private timestamp :any = ""
  private templateList:any = []
  private changeWeek(num:number){
    this.headerList =[]
    this.yearData = []
    if(num==1){
      this.timestamp -= 24 * 60 * 60 * 1000 * 7
    }else if(num==2){
      this.timestamp += 24 * 60 * 60 * 1000 * 7
    }else{
      this.timestamp = new Date().getTime()
    }
    this.getCurrent()
  }
  private getTemplateList(){
    templateList().then((res:any)=>{
      this.templateList = res.data
    })
  }
  // private 
  //初始化的周期函数
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 110
    this.timestamp = new Date().getTime()
  }
  mounted() {
    this.timestamp = new Date().getTime()
    this.getZblb()
    this.getProject()
    this.getGhks()
    this.getDocInof()
    this.getTemplateList()
    this.getCurrent()
    // this.$nextTick(()=>{
    //   this.searchLists()
    // })
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/inputTable.scss';
.mr10 {
  margin-right: 10px;
}
.display {
  display: flex;
  padding-top: 15px !important;
}
.displayFlex {
  display: flex;
  justify-content: space-around;
  width: 100%;
}
.content .his-module .el-form {
  margin: 0;
}

.ksmcInfo {
  display: flex;
  flex-direction: column;
  position: relative;
  // justify-content: center;
  align-items: center;
  .jz {
    color: #333 !important;
    font-weight: 900;
    // position: absolute;
    text-align: left;
    width: 100%;
  }
  .copy {
    display: block;
    background: #169bd5;
    color: #fff !important;
    padding: 0px 8px;
    border-radius: 3px;
    font-size: 10px !important;
    cursor: pointer;
    margin: 5px 0 10px;
  }
}
</style>
