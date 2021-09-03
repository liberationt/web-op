<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="19">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <el-form ref="searchData" :model="searchData" label-width="60px" class="form4 clearfix display">
                <div class="form-area mr10">
                  <el-form-item :label="'类别'" prop="zdlb">
                    <el-select v-model="searchData.zblb" clearable>
                      <el-option v-for="item in zblbList" :key="item.sddm" :value="item.sddm" :label="item.sdmc"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-area mr10">
                  <!-- 病人可能挂过相同的科室，formData.ghks由patientGhks转换 -->
                  <el-form-item :label="'科室'" prop="ghks">
                    <el-select v-model="searchData.ghks" ref="ghks" clearable :filter-method="searchKsdm1" filterable popper-class="hidden-option">
                      <el-option v-for="item in ksdmList1" :key="item.ksdm" :value="item.ksdm" :label="item.ksmc">
                        <span>{{ item.ksmc }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-area mr10">
                  <!-- 医生姓名 -->
                  <el-form-item :label="'医生'" prop="ysdm">
                    <el-select v-model="searchData.ysdm" ref="ysxm" clearable :filter-method="searchDoc1" filterable>
                      <el-option v-for="item in docList1" :key="item.ysdm" :value="Number(item.ysdm)" :label="item.ysmc"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-area">
                  <el-button type="primary" size="mini" @click="searchLists">查询</el-button>
                </div>
              </el-form>
            </div>
          </div>
          <div class="clearfix">
            <pagenation-list ref="pageTable" v-model="tableData" data-url="/op-service/oppbmb/queryPage" :search-data="searchData" http-method="post" :list-height="listSlotHeight">
              <el-table slot="list" stripe ref="table" :highlight-current-row="true" :data="tableData" border v-loading="loading" :height="listSlotHeight" class="input-table scroll-bar no-underline" tooltip-effect="light" @row-dblclick="editDate">
                <!-- 门诊机构名称 -->
                <el-table-column :label="'科室/医生'" prop="mzmc" align="center">
                  <template slot-scope="{ row }">
                    <div class="ksmcInfo">
                      <span class="jz">{{ row.type == 1 ? '普' : '专' }}</span>
                      <span>{{ row.ksmc }}</span>
                      <span>{{ row.ysmc }}</span>
                      <div class="displayFlex">
                        <span class="copy" @click="copyKs(row)">复制</span>
                        <span class="copy" @click="deleteKs(row)">删除</span>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <!-- 科室名称 -->
                <el-table-column :label="'值班类别'" prop="zbmc" align="center"></el-table-column>
                <!-- 挂号科室代码 -->
                <el-table-column :label="'周一'" prop="ghks" align="center">
                  <template slot-scope="{ row }">
                    <week-date :showWeekDate="getInfo(row.opPbmbRespList, 1) > -1" @showDataDialog="showDataDialog" @deleteDataCopy="deleteDataCopy" @getFormData="getFormData" :dataInfo="row.opPbmbRespList[getInfo(row.opPbmbRespList, 1)]" :rowData="row"></week-date>
                  </template>
                </el-table-column>
                <el-table-column :label="'周二'" prop="ghks" align="center">
                  <template slot-scope="{ row }">
                    <week-date :showWeekDate="getInfo(row.opPbmbRespList, 2) > -1" @showDataDialog="showDataDialog" @deleteDataCopy="deleteDataCopy" @getFormData="getFormData" :dataInfo="row.opPbmbRespList[getInfo(row.opPbmbRespList, 2)]" :rowData="row"></week-date>
                  </template>
                </el-table-column>
                <el-table-column :label="'周三'" prop="ghks" align="center">
                  <template slot-scope="{ row }">
                    <week-date :showWeekDate="getInfo(row.opPbmbRespList, 3) > -1" @showDataDialog="showDataDialog" @deleteDataCopy="deleteDataCopy" @getFormData="getFormData" :dataInfo="row.opPbmbRespList[getInfo(row.opPbmbRespList, 3)]" :rowData="row"></week-date>
                  </template>
                </el-table-column>
                <el-table-column :label="'周四'" prop="ghks" align="center">
                  <template slot-scope="{ row }">
                    <week-date :showWeekDate="getInfo(row.opPbmbRespList, 4) > -1" @showDataDialog="showDataDialog" @deleteDataCopy="deleteDataCopy" @getFormData="getFormData" :dataInfo="row.opPbmbRespList[getInfo(row.opPbmbRespList, 4)]" :rowData="row"></week-date>
                  </template>
                </el-table-column>
                <el-table-column :label="'周五'" prop="ghks" align="center">
                  <template slot-scope="{ row }">
                    <week-date :showWeekDate="getInfo(row.opPbmbRespList, 5) > -1" @showDataDialog="showDataDialog" @deleteDataCopy="deleteDataCopy" @getFormData="getFormData" :dataInfo="row.opPbmbRespList[getInfo(row.opPbmbRespList, 5)]" :rowData="row"></week-date>
                  </template>
                </el-table-column>
                <el-table-column :label="'周刘'" prop="ghks" align="center">
                  <template slot-scope="{ row }">
                    <week-date :showWeekDate="getInfo(row.opPbmbRespList, 6) > -1" @showDataDialog="showDataDialog" @deleteDataCopy="deleteDataCopy" @getFormData="getFormData" :dataInfo="row.opPbmbRespList[getInfo(row.opPbmbRespList, 6)]" :rowData="row"></week-date>
                  </template>
                </el-table-column>
                <el-table-column :label="'周日'" prop="ghks" align="center">
                  <template slot-scope="{ row }">
                    <week-date :showWeekDate="getInfo(row.opPbmbRespList, 7) > -1" @showDataDialog="showDataDialog" @deleteDataCopy="deleteDataCopy" @getFormData="getFormData" :dataInfo="row.opPbmbRespList[getInfo(row.opPbmbRespList, 7)]" :rowData="row"></week-date>
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
                        trigger: 'blur',
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
                <el-form-item :label="'日期'" prop="rq">
                  <el-select v-model="formData.rq" placeholder="请选择">
                    <el-option v-for="item in dataOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>
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
                  <el-input v-model="formData.zlje" placeholder="诊疗金额" disabled></el-input>
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
                  <el-input v-model="formData.zjje" placeholder="专家金额" disabled></el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="复制" :visible.sync="dataDialogVisible" width="600px" :close-on-click-modal="false" @close="closeDataDialogVisible">
      <div style="padding-bottom: 30px">
        <div v-if="showCopyData">
          <el-form ref="copyData" :model="copyData" label-width="70px" class="form4 clearfix display">
            <div class="form-area mr10">
              <!-- 病人可能挂过相同的科室，formData.ghks由patientGhks转换 -->
              <el-form-item :label="'挂号科室'" prop="ghks">
                <el-select v-model="copyData.ghks" ref="ghks" clearable :filter-method="searchKsdm3" filterable popper-class="hidden-option">
                  <el-option v-for="item in ksdmList3" :key="item.ksdm" :value="item.ksdm" :label="item.ksmc">
                    <span>{{ item.ksmc }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-area mr10">
              <!-- 医生姓名 -->
              <el-form-item :label="'医生姓名'" prop="ysdm">
                <el-select v-model="copyData.ysdm" ref="ysxm" clearable :filter-method="searchDoc3" filterable>
                  <el-option v-for="item in docList3" :key="item.personId" :value="Number(item.personId)" :label="item.personName"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div style="margin-bottom: 10px">
          <el-checkbox :indeterminate="isIndeterminate" v-model="dataCheckAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox v-model="dataIsCove">是否覆盖</el-checkbox>
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
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import weekDate from './components/weekDate.vue'
import { getTableData } from '@/websql/functions'
import { parseTime, rightScroll } from '@/utils'

import { getTimerInfor, aDeptSchList, getProjectList, getDocList,getGhksList, saveTemplate, cloneDataCove, deleteDate, doCheckData ,cloneWithKsYs ,deleteKsInfo} from '@/api/his/op/reg/deptSchedule.ts'
import { aDeptDocList } from '@/api/his/op/reg/docSchedule.ts'

//声明接口
declare interface pageList {
  id: number
}

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'deptSchedule1',
  filters: {},
  components: {
    weekDate,
  },
})
export default class extends Vue {
  //声明变量，方法
  private zblbList: any = [] //值班类别
  private projectList: any = {
    ghfProjectList: [],
    zlfProjectList: [],
    zjfProjectList: [],
  }
  private copyData:any = {
    ghks:'',
    ysdm:''
  }
  private dataDialogVisible: boolean = false
  private dataList: any = []
  private isIndeterminate: boolean = false
  private dataCheckAll: boolean = false
  private dataIsCove: boolean = false
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
  private showLoading: boolean = false
  private ghksList: any = []
  private docList: any = []
  private docListInfo:any= []
  private docList1: any = []
  private docList2: any = []
  private docList3: any = []
  private formData: any = {
    zblb: '',
    ghks: '',
    ysdm: '',
    rq: '',
    ghxe: '',
    yyxe: '',
    ghf: '',
    ghje: '',
    zlf: '',
    zlje: '',
    zjf: '',
    zjje: '',
  }
  private disabledYs: boolean = false
  private ysdm: any = ''
  private tableData: any[] = [] // 表格数据
  private ksdmList1: any = []
  private ksdmList2: any = []
  private ksdmList3: any = []
  private current: any = {}
  private showCopyData:boolean = false
  private searchData: any = {
    zblb: '',
    ghks: '',
    ysdm: '',
  } // 搜索参数
  private listSlotHeight: number = 0
  private loading: boolean = true
  private usersList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.USERS_DICT : this.$store.state.webSqlDict.USERS_DICT // 用户列表
  private rulesForm:any = {
    zblb:[
      { required: true, message: '请选择值班类别', trigger: 'change' },
    ],
    ghks:[
      { required: true, message: '请选择挂号科室', trigger: 'change' },
    ],
    rq:[
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
    // this.formData.zjje=this.projectList.zjfProjectList.find((item:any)=>item.fyxh ===val).fydj
  }
  @Watch('searchData.ghks')
  private YsdmChange(val: any) {
    this.ksdmList1 = this.ghksList
    // this.getDoc1()
    // this.formData.zjje=this.projectList.zjfProjectList.find((item:any)=>item.fyxh ===val).fydj
  }
  @Watch('copyData.ghks')
  private oncopyksChange(val: any) {
    this.ksdmList3 = this.ghksList
    this.getDoc2()
    // this.formData.zjje=this.projectList.zjfProjectList.find((item:any)=>item.fyxh ===val).fydj
  }
  @Watch('copyData.ysdm')
  private oncopyYsChange(val: any) {
    this.docList3 = this.docList
    // this.formData.zjje=this.projectList.zjfProjectList.find((item:any)=>item.fyxh ===val).fydj
  }
  @Watch('searchData.ysdm')
  private onYsChange(val: any) {
    this.docList1 = this.docListInfo
    // this.formData.zjje=this.projectList.zjfProjectList.find((item:any)=>item.fyxh ===val).fydj
  }
  
  // 新增
  private handelAdd() {
    this.disabledYs = false
    this.resetForm()
  }
  private validateYs(rule:any, value:any, callback:any){
    if(this.formData.ghks&&this.formData.zblb){
      if (this.ghksList.find((item: any) => item.ksdm === this.formData.ghks).kslb === 0 && this.formData.ysdm==="") {
        callback(new Error("请选择科室医生"))
      }else{
        callback()
      }
    }
  }
  //保存
  private handelSave(formName:any) {
    (this.$refs[formName] as any).validate((valid:any) => {
      if (valid) {
        let dataInfo = {
          ghks: this.formData.ghks,
          zblb: this.formData.zblb,
          ysdm: this.formData.ysdm,
          rqList: [this.formData.rq],
          type: 1,
        }
        if (!this.formData.jlxh) {
          doCheckData(dataInfo).then((res: any) => {
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
  private saveDate() {
    let params = {
      ...this.formData,
    }
    saveTemplate(params).then((res: any) => {
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
  //复制
  private showDataDialog(row: any) {
    this.showLoading = false
    this.current = row
    this.dataList = []
    this.dataIsCove = false
    this.isIndeterminate = false
    this.dataCheckAll = false
    this.dataDialogVisible = true
  }
  private copyKs(row:any){
    this.copyData= {}
    this.showCopyData = true
    this.showDataDialog(row)
  }
  private deleteKs(row:any){
    this.$confirm('确定删除整条模板?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      let params = {
        ghks:row.ghks,
        zblb:row.zblb,
        ysdm:row.ysdm
      }
      deleteKsInfo(params).then((res:any)=>{
        this.$notify.success("删除成功")
        this.searchLists()
      })
    })
  }
  // 关闭
  private closeDataDialogVisible(){
    this.dataIsCove = false
    this.isIndeterminate = false
    this.dataCheckAll = false
    this.dataDialogVisible = false
    this.showCopyData = false

  }
  // 条件查询
  private searchLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
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
      this.ksdmList3 = res.data.list
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
  private searchKsdm3(value: any) {
    // 总是从原数组中过滤
    this.ksdmList3 = this.ghksList.filter((item: any) => {
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
  //获取科室下面的医生
  private getDoc2() {
    this.$set(this.copyData,'ysdm',"")
    if(!this.copyData.ghks){
      return 
    }
    let params = {
      zblb: this.current.zblb,
      ksdm: this.copyData.ghks,
    }
    aDeptDocList(params).then((res: any) => {
      if (res) {
        this.docList = res.data
        this.docList3 = res.data
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
  //复制记录
  private saveDataClone() {
    if(this.showCopyData&&!this.copyData.ghks){
      return this.$notify.warning('请选择挂号科室')
    }
    if (this.showCopyData&&this.ghksList.find((item: any) => item.ksdm === this.copyData.ghks).kslb === 0 && !this.copyData.ysdm) {
      return this.$notify.warning('请选择医生')
    }
    if (!this.dataList.length) {
      return this.$notify.warning('请选择日期')
    }
    let dataInfo:any = {
      ghks: this.current.ghks,
      zblb: this.current.zblb,
      ysdm: this.current.ysdm,
      rqList: this.dataList,
      type: 2,
    }
    if(this.showCopyData){
      dataInfo.ysdm = this.copyData.ysdm
    }
    doCheckData(dataInfo).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.showLoading = true
        if(this.showCopyData){
          // 按科室复制
          let params ={
            cover: this.dataIsCove ? 1 : 0,
            ghks: this.current.ghks,
            rqList: this.dataList,
            ysdm:this.current.ysdm,
            zblb:this.current.zblb,
            targetGhks:this.copyData.ghks,
            targetYsdm:this.copyData.ysdm
          }
          cloneWithKsYs(params).then((res:any)=>{
            if(res.errorCode=='SUCCESS'){
              this.$notify.success('复制成功')
              this.dataDialogVisible = false
              this.showLoading = false
              this.formData.jlxh = ''
              this.searchLists()
            }else{
              this.showLoading = false
            }
          })
        }else{
          //按天复制
          let params = {
            cover: this.dataIsCove ? 1 : 0,
            jlxh: this.current.jlxh,
            rqList: this.dataList,
          }
          cloneDataCove(params).then((res: any) => {
            if(res.errorCode=='SUCCESS'){
              this.$notify.success('复制成功')
              this.dataDialogVisible = false
              this.showLoading = false
              this.formData.jlxh = ''
              this.searchLists()
            }else{
              this.showLoading = false
            }
          })
        }
      }
    })
  }
  //删除
  private deleteDataCopy(row: any) {
    let params = {
      jlxh: row.jlxh,
    }
    this.$confirm('确定删除模板?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      // this.$message({
      //   type: 'success',
      //   message: '删除成功!'
      // });
      deleteDate(params).then((res: any) => {
        if (res.errorCode == 'SUCCESS') {
          this.$notify.success('删除成功')
          this.searchLists()
        }
      })
    })
  }
  //获取医生代码 防止出错 细节修改
  private getYsdm() {
    if (this.formData.ghks) {
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
      rq: row.rq,
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
  //初始化的周期函数
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 110
  }
  mounted() {
    this.getZblb()
    this.getProject()
    this.getGhks()
    this.getDocInof()
    this.searchLists()
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/inputTable.scss';
.mr10 {
  margin-right: 20px;
}
.display {
  display: flex;
  padding-top: 15px !important;
}
.displayFlex{
  display: flex;
  justify-content: space-around;
  width:100%;
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
    margin:5px 0 10px;
  }
}
</style>
