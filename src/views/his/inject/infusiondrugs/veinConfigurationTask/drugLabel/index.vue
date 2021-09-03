<!--
 * @Date: 
 * @LastEditTime: 
 * @Description: 药品标签重打
 * @FilePath: 
-->

<template>
  <div class="content opertionIncome">
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="his-module his-small" :style="{ marginBottom: '10px' }">
          <div slot="header" class="row" style="border:none;padding-bottom:0;margin-bottom:0">
            <div class="label">
              <span class="searchTitle">{{$t('治疗日期')}}</span>
              <el-date-picker 
                class="date-wrapper" 
                v-model="date" 
                type="date" 
                placeholder="选择日期" 
                format='yyyy-MM-dd'
                value-format='yyyy-MM-dd'
                :clearable="false" 
                @change="handleChangeDate"
              >
              </el-date-picker>
              <span class="searchTitle ml8">{{$t('批次')}}</span>
              <el-select v-model="pcid" placeholder="请选择批次" @change="handleChangeBatch">
                <el-option v-for="item in batchList" :key="item.id" :label="item.pcmc" :value="item.id"></el-option>
              </el-select>
              <el-divider class="mr4" direction="vertical"></el-divider>
              <div class="btn">
                <el-button @click="handlePrint">
                  <i class="icon his-btn-print"></i>打印标签
                </el-button>
              </div>
              <el-divider class="mr4" direction="vertical"></el-divider> 
               <div class="btn">
                <el-button @click="handleAgainPrint">
                  <i class="icon his-btn-print"></i>重打序号
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="3" class="ht">
        <div class="his-module his-small ht" :style="{ height: listSlotHeight  - 65  + 'px' }">
          <div slot="header" class="row">
            <div class="label">
              <span class="title">{{$t('病区')}}</span>
            </div>
          </div>
          <el-table
            :data="wardList"
            ref="ward"
            border
            stripe
            :highlight-current-row="true"
            :height="listSlotHeight - 160"
            class="no-underline scroll-bar"
            @row-click="handleSelRow"
          >
            <el-table-column prop="name" :label="$t('病区')"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="his-module his-small" :style="{ height: listSlotHeight - 65  + 'px' }">
          <div class="row">
            <div class="label">
              <span class="title">{{$t('患者列表')}}</span>
            </div>
          </div>
          <el-table
            :data="patientData"
            ref="patient"
            border
            stripe
            :height="listSlotHeight-125"
            class="no-underline scroll-bar"
            @select-all='handleAllSelPatient' 
            @selection-change='handleSelPatient'
          >
            <el-table-column type="selection" width="32" align="center"></el-table-column>
            <el-table-column prop="brch" :label="$t('床号')" min-width="80"></el-table-column>
            <el-table-column prop="brxm" :label="$t('姓名')"  min-width="80"></el-table-column>
            <el-table-column prop="sex" :label="$t('性别')" min-width="60"></el-table-column>
            <el-table-column prop="nl" :label="$t('年龄')" min-width="60"></el-table-column>
          </el-table>
        </div>
      </el-col>

      <el-col :span="13">
        <div class="his-module his-small headTop" :style="{ height: listSlotHeight  - 65  + 'px'}">
          <div class="row">
            <div class="label">
              <span class="title">{{$t('医嘱药品详情')}}</span>
            </div>
          </div>
          <el-table
            slot="list"
            :data="yzData"
            ref="yz"
            stripe
            border
            class="scroll-bar border no-underline"
            highlight-row
            :height="listSlotHeight - 125"
            @select-all='handleAllSelYz' 
            @selection-change='handleSelYz'
          >
            <el-table-column label width="16" align="center">
              <template slot-scope="scope">
                <div class="w100" :class="scope.row.yzzh % 3 === 1 ? 'greenBack' : 'orangeBack'"></div>
              </template>
            </el-table-column>
            <el-table-column prop="fs" :label="$t('方式')" show-overflow-tooltip width="60"></el-table-column>
            <el-table-column prop="lx" :label="$t('类型')" show-overflow-tooltip width="80"></el-table-column>
            <el-table-column prop="yzzh" :label="$t('组号')" show-overflow-tooltip width="60"></el-table-column>
            <!-- <el-table-column prop="index" :label="$t('')" width="32"></el-table-column> -->
            <el-table-column prop="ypmc" :label="$t('药品名称')" show-overflow-tooltip width="200"></el-table-column>
            <el-table-column prop="ypgg" :label="$t('规格')" show-overflow-tooltip width="100"></el-table-column>
            <el-table-column prop="cdmc" :label="$t('产地')" show-overflow-tooltip width="150"></el-table-column>
            <el-table-column prop="ycsl" :label="$t('数量')" width="50"></el-table-column>
            <el-table-column prop="pcmc" :label="$t('批次')" width="50"></el-table-column>
            <el-table-column prop="zlsj" :label="$t('治疗时间')" width="120"></el-table-column>
            <el-table-column prop="txm" :label="$t('条形码')" width="100"></el-table-column>
            <el-table-column prop="dyxh" :label="$t('打印序号')" width="70"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <!-- <drugLabel ref="drugLabel"></drugLabel> -->
    <!-- <sortNumber ref="sortNumber"></sortNumber> -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="24%"
      :before-close="handleClose"
    >
      <el-form 
        ref="againPrint"
        :model="forms"
        :rules="ruleForm" 
        style="margin:0px 16px" 
        label-width="82px"
      >
        <el-form-item label="起始序号" prop="min">
          <el-input v-model="forms.min"></el-input>
        </el-form-item>
        <el-form-item label="终止序号" prop="max">
          <el-input v-model="forms.max"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfim">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang='ts' >
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { 
  queryBatch,
  queryWard,
  queryPatient, 
  queryYzList,
  repeatPrintLabel
} from '@/api/his/inject/infusiondrugs/drugLabel.ts'
import { formatDate, id2Name } from '@/utils/index.ts'
import { Script } from 'vm'
// import drugLabel from './compontents/drugLabel.vue'
// import sortNumber from './compontents/sortNumber.vue'

@Component({
  name: 'drugLable',
  // components: { drugLabel, sortNumber },
})

export default class extends Vue {
  private listSlotHeight: number = 0 //列表高度
  private yfsb: number | null = null // 药房识别
  private sexList: Array<any> = [] // 性别列表
  private jpfsList: Array<any> = [] // 静配方式列表
  private yzlxList: Array<any> = [] // 医嘱类别列表
  private date: string | null = null // 治疗日期
  private pcid: string | null = null // 批次id
  private batchList: Array<any> = [] // 批次列表
  private wardList: Array<any> = [] // 病区列表
  private patientList: Array<any> = [] // 患者列表
  private selPatientList: Array<any> = [] // 选择患者列表
  private yzList: Array<any> = [] // 医嘱列表
  private selYzList: Array<any> = [] // 选择医嘱列表
  private dialogVisible: boolean = false
  private forms: any = {
    min: null, // 最小序号
    max: null // 最大序号
  }
  private ruleForm: any = {
    min: { required: true, message: '起始序号不能为空', trigger: 'blur' },
		max: { required: true, message: '终止序号不能为空', trigger: 'blur'}
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
    // 获取性别列表
    this.sexList = this.$store.state.webSqlDict.SEX_DICT
    // 获取静配方式列表
    this.jpfsList = this.$store.state.webSqlDict.STATIC_STYLE_DICT
    // 获取医嘱类别列表
    this.yzlxList = this.$store.state.webSqlDict.DOCTOR_ADVICE_DICT
    // 获取yfsb
    this.yfsb = Vue.prototype.AUTHORITY.bussinessRole
  }

  mounted() {
    this.date = formatDate(1) // 获取当前日期
    this.queryBatch()
  }

  get patientData(){
    id2Name(this.patientList, 'brxb', 'xb', this.sexList, 'dv', 'dn')
    return this.patientList
  }

  get yzData(){
    id2Name(this.yzList, 'jpfs', 'fs', this.jpfsList, 'dv', 'dn')
    if(this.yzList.length>0) {
      this.yzList.map((v: any) => {
        if(v.children.length>0){
          v.children.map((x: any) => {
            id2Name(v.children, 'yzlx', 'lx', this.yzlxList, 'dv', 'dn')
          })
        }
      })
    }
    return this.yzList
  }

  /*@methods: handleChangeDate
   *@description: 选择日期
   */
  private handleChangeDate(){
    console.log(this.date);
    this.queryWard()
  }

  /*@methods: queryBatch
   *@description: 查询发药批次列表
   */
  private queryBatch() {
    queryBatch({yfsb: this.yfsb}).then((res: any) => {
      if(res.errorCode=="SUCCESS"){
        this.batchList = res.data
        if(this.batchList.length>0){
          this.pcid = this.batchList[0].id
          this.queryWard()
        }
      }
    })
  }

  /*@methods: handleChangeBatch
   *@description: 选择批次
   */
  private handleChangeBatch() {
    this.queryWard()
  }

  /*@methods: queryWard
   *@description: 查询病区列表
   */
  private queryWard() {
    queryWard({yfsb: this.yfsb}).then((res: any) => {
      if(res.errorCode=="SUCCESS"){
        this.wardList = res.data
        if(this.wardList.length>0){
          let data: any = this.wardList[0];
          this.$nextTick(() => {
            (this.$refs.ward as any).setCurrentRow(data)
          })
          this.queryPatient(data)
        }
      }
    })
  }

  /*@methods: handleSelRow
   *@description: 是否选择病区
   */
  private handleSelRow(val: any){
    this.queryPatient(val)
  }

  /*@methods: queryPatient
   *@description: 查询病人列表
   */
  private queryPatient(data: any){
    let param: any = {
      yfsb: this.yfsb,
      pcid: this.pcid,
      min: this.forms.min,
      max: this.forms.max,
      date: this.date,
      bqdmList: data.id
    }
    queryPatient(param).then((res: any) => {
      if(res.errorCode=="SUCCESS"){
        this.patientList = res.data
        if(this.patientList.length>0){
          this.patientList.map((val: any) => {
            this.$nextTick(() => {
              // patientList全部选中
              (this.$refs.patient as any).toggleRowSelection(val, true) 
            })
          })
        }
      }
    })
  }

  /*@methods: handleAllSelPatient
   *@description: 是否全选患者列表
   */
  private handleAllSelPatient(val: any){
    this.selPatientList = val
  }  

  /*@methods: handleSelPatient
   *@description: 是否选择患者列表
   */
  private handleSelPatient(val: any){
    this.selPatientList = val
    let list: Array<any> = []
    if(this.selPatientList.length>0){
      this.selPatientList.map((val: any) => {
        list.push(val.zyh)
      })
      let param: any = {
        yfsb: this.yfsb,
        pcid: this.pcid,
        date: this.date,
        zyhList: list.join(',')
      }
      this.queryYzList(param)
    }else{
      this.yzList = []
    }
  }

  /*@methods: queryYzList
   *@description: 
   */
  private queryYzList(data: any){
    queryYzList(data).then((res: any) => {
      if(res.errorCode=="SUCCESS"){
        this.yzList = res.data
        if(this.yzList != null && this.yzList.length>0){
          this.yzList.map((v: any,idx: number) => {
            // yzList 全部选中
            (this.$refs.yz as any).toggleRowSelection(v, true) 
          })
        }
      }
    })
  }

  /*@methods: handleAgainPrint
   *@description: 打印标签
   */
  private handleAllSelYz(data: any){
    this.selYzList = data
  }

  /*@methods: handleAgainPrint
   *@description: 打印标签
   */
  private handleSelYz(data: any){
    // console.log(data);
    this.selYzList = data
  }

  /*@methods: handleAgainPrint
   *@description: 重打序号
   */
  private handleAgainPrint(){
    this.dialogVisible = true
    if(this.yzList.length>0){
      // 获取医嘱列表第一个对象
      this.forms.min = this.yzList[0].dyxh
      // 获取医嘱列表最后一个对象
      this.forms.max = this.yzList[this.yzList.length-1].dyxh
      this.queryWard()
    }
  }

  /*@methods: handleClose
   *@description: 关闭重打序号弹框
   */
  private handleClose(){
    this.dialogVisible = false
  }

  /*@methods: handleConfim
   *@description: 确定重打序号
   */
  private handleConfim(){
    (this.$refs.againPrint as any).validate((valid: any) => {
      if (valid) {
        if(this.selYzList.length>0){
          let list: Array<any> = []
          this.selYzList.map((val: any) => {
            list.push(val.id)
          })
          repeatPrintLabel(list).then((res: any) => {
            if(res.errorCode=="SUCCESS"){
              this.$notify({
                title: '打印标签成功！',
                message: '',
                type: 'success',
              })
            }
          })
        }
      }
    })
  }

  /*@methods: handlePrint
   *@description: 打印标签
   */
  private handlePrint() {
    if(this.selYzList.length>0){
      let list: Array<any> = []
      this.selYzList.map((val: any) => {
        list.push(val.id)
      })
      repeatPrintLabel(list).then((res: any) => {
        if(res.errorCode=="SUCCESS"){
          this.$notify({
            title: '打印标签成功！',
            message: '',
            type: 'success',
          })
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.date-wrapper{
  width: 100%;
}
.title {
  font-size: 14px !important;
  margin-right: 10px !important;
}
.content .his-small .el-form .el-form-item .el-input--medium {
  margin-bottom: 16px;
}
.content .his-small ::v-deep .el-form .el-form-item .el-form-item__label {
  line-height: 12px !important;
}
.headTop {
  padding-top: 10px;
  ::v-deep.el-table__header-wrapper {
    .el-checkbox{
      display: none !important
    }
  }
}
</style>