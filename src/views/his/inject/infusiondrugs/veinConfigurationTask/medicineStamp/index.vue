<!--
 * @Date: 
 * @LastEditTime: 
 * @Description: 排药印签
 * @FilePath: 
-->

<template>
  <div class="content opertionIncome">
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="his-module his-small" :style="{  marginBottom: '10px' }">
          <div slot="header" class="row" style="border:none;padding-bottom:0;margin-bottom:0">
            <div class="label">
              <span class="title">排药印签</span>
              <el-divider direction="vertical"></el-divider>
              <span class="searchTitle">{{$t('排药日期')}}</span>
              <el-date-picker 
                class="date-wrapper" 
                v-model="date" 
                type="date" 
                placeholder="选择日期" 
                format='yyyy-MM-dd'
                value-format='yyyy-MM-dd'
                @change="handleChangeDate"
                :clearable="false" 
              >
                <!-- :picker-options="pickerOptions" -->
              </el-date-picker>
              <span class="searchTitle ml8">{{$t('批次')}}</span>
              <el-select v-model="pcid" class="outbound" placeholder="请选择批次" @change="handleChangeBatch">
                <el-option v-for='item in batchList' :key='item.id' :label="item.pcmc" :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="ht">
        <div
          class="his-module his-small ht"
          :style="{ height: listSlotHeight  - 65  + 'px', marginBottom: '10px' }"
        >
          <div slot="header" class="row">
            <div class="label">
              <h1 class="title">{{$t('病区')}}</h1>
            </div>
          </div>
          <el-table
            :data="wardList"
            border
            stripe
            slot="list"
            :height="listSlotHeight - 160"
            class="scroll-bar no-underline"
            @select-all='handleAllSel'
            @selection-change='handleSel'
          >
            <el-table-column type="selection" align="center" width="32"></el-table-column>
            <el-table-column prop="name" :label="$t('病区')"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="6">
        <div
          class="his-module his-small"
          :style="{ height: listSlotHeight  - 65  + 'px', marginBottom: '10px' }"
        >
            <div class="row">
              <div class="label">
                <span class="title">{{$t('患者列表')}}</span>
                <el-divider direction="vertical" class="ml4"></el-divider>
                <div class="btn">
                  <el-button @click="handlePrint">
                    <i class="icon his-btn-print" />打印标签
                  </el-button>
                </div>
              </div>
            </div>
            <el-table
              :data="patientData"
              border
              stripe
              slot="list"
              :height="listSlotHeight - 125"
              class="no-underline scroll-bar"
              @select-all='handleAllSelPatient' 
              @selection-change='handleSelPatient'
            >
              <el-table-column type="selection" width="32" align="center"></el-table-column>
              <el-table-column :label="$t('床号')" prop="brch" width="80"></el-table-column>
              <el-table-column :label="$t('姓名')" prop="brxm" width="80"></el-table-column>
              <el-table-column :label="$t('性别')" prop="sex" width="60"></el-table-column>
              <el-table-column :label="$t('年龄')" prop="nl" width="60"></el-table-column>
              <el-table-column :label="$t('病区')" prop="bq" width="80"></el-table-column>
            </el-table>
        </div>
      </el-col>

      <el-col :span="14">
        <div
          class="his-module his-small"
          :style="{ height: listSlotHeight  - 65  + 'px', marginBottom: '10px' }"
        >
          <div slot="header" class="row">
            <div class="label">
              <span class="title">{{$t('医嘱药品详情')}}</span>
            </div>
          </div>
          <el-table
            slot="list"
            :data="yzData"
            ref="approvedPrescription"
            stripe
            border
            class="scroll-bar border no-underline"
            highlight-row
            row-key="key"
            default-expand-all
            :height="listSlotHeight - 125"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            :span-method="arraySpanMethod"
          >
            <el-table-column width="1">
              <template slot-scope="scope" v-if="scope.row.brch">
                <div class="data-head">
                  <span>床号：{{scope.row.brch}}</span>
                  <el-divider direction="vertical"></el-divider>
                  <span>姓名：{{scope.row.brxm}}</span>
                  <el-divider direction="vertical"></el-divider>
                  <span>性别：{{scope.row.sex}}</span>
                  <el-divider direction="vertical"></el-divider>
                  <span>年龄:{{scope.row.nl}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label width="16" align="center">
              <template slot-scope="scope">
                <div class="w100" :class="scope.row.id % 3 === 1 ? 'greenBack' : 'orangeBack'"></div>
              </template>
            </el-table-column>
            <el-table-column prop="lx" :label="$t('类型')" width="70" class-name="text-reds-td"></el-table-column>
            <el-table-column prop="ypmc" :label="$t('药品名称')" show-overflow-tooltip width="220"></el-table-column>
            <el-table-column prop="yfgg" :label="$t('规格')" width="100"></el-table-column>
            <el-table-column prop="cdmc" :label="$t('产地')" width="120"></el-table-column>
            <el-table-column prop="ycjl" :label="$t('剂量')" width="60"></el-table-column>
            <el-table-column prop="sypc" :label="$t('频次')" width="50" class-name="text-blue-td"></el-table-column>
            <el-table-column prop="gytj" :label="$t('途径')" width="50"></el-table-column>
            <el-table-column prop="yzzxsj" :label="$t('执行时间')" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="bzxx" :label="$t('说明')" width="60"></el-table-column>
            <el-table-column prop="kssj" :label="$t('开嘱时间')" width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ysgh" :label="$t('开嘱医生')" width="80"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <openStamp ref="openStamp"></openStamp>
  </div>
</template>
<script lang='ts' >
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { 
  queryBatch,
  queryWard,
  queryPatient, 
  checkList,
  queryYzList,
  printLabel
} from '@/api/his/inject/infusiondrugs/medicineStamp.ts'
import { formatDate, id2Name } from '@/utils/index.ts'
import { Script } from 'vm'
import openStamp from './compontents/openStamp.vue'
@Component({
  name: 'medicineStamp',
  components: { openStamp },
})
export default class extends Vue {
  private listSlotHeight: number = 0 //列表高度
  private sexList: Array<any> = [] // 性别列表
  private yzlxList: Array<any> = [] // 医嘱类别列表
  private yfsb: number | null = null // 药房识别
  private date: string | null = null // 排药日期
  private pickerOptions: any = {
    disabledDate (date: any) {
      return date.getTime() < Date.now() - 24 * 60 * 60 * 1000;
    }
  }
  private pcid: number | null = null // 批次ID
  private batchList: Array<any> = [] // 批次列表
  private wardList: Array<any> = [] // 病区列表
  private selWardList: Array<any> = [] // 选择病区列表
  private patientList: Array<any> = [] // 患者列表
  private selPatientList: Array<any> = [] // 选择患者列表
  private yzList: Array<any> = [] // 医嘱列表
  
  //弹框
  private openStamp() {
    ;(this.$refs.openStamp as any).open()
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
    // 获取性别列表
    this.sexList = this.$store.state.webSqlDict.SEX_DICT
    // 获取医嘱类别列表
    this.yzlxList = this.$store.state.webSqlDict.DOCTOR_ADVICE_DICT
    // 获取yfsb
    this.yfsb = Vue.prototype.AUTHORITY.bussinessRole
  }

  mounted(){
    this.date = formatDate(1) // 获取当前日期
    this.queryBatch()
    this.queryWard()
    
  }
  
  get patientData() {
    id2Name(this.patientList, 'brxb', 'sex', this.sexList, 'dv', 'dn')
    return this.patientList
  }

  get yzData() {
    id2Name(this.yzList, 'brxb', 'sex', this.sexList, 'dv', 'dn')
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
    this.queryWard()
    this.yzList = []
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
        }
      }
    })
  }

  /*@methods: handleChangeBatch
   *@description: 选择批次
   */
  private handleChangeBatch() {
    this.queryWard()
    this.patientList = []
    this.yzList = []
  }

  /*@methods: queryWard
   *@description: 查询药房发药病区
   */
  private queryWard() {
    queryWard({yfsb: this.yfsb}).then((res: any) => {
      if(res.errorCode=="SUCCESS"){
        this.wardList = res.data
      }
    })
  }

  /*@methods: handleAllSel
   *@description: 是否全选病区
   */
  private handleAllSel(val: any){
    this.selWardList = val
  }

  /*@methods: handleSel
   *@description: 是否选择病区
   */
  private handleSel(val: any){
    this.selWardList = val
    let list: Array<any> = []
    if(this.selWardList.length>0){
      this.selWardList.map((val: any) => {
        list.push(val.id)
      })
      let param: any = {
        yfsb: this.yfsb,
        pcid: this.pcid,
        date: this.date,
        bqdmList: list.join(',')
      }
      this.queryPatient(param)
    }else{
      this.patientList = []
    }
  }

  /*@methods: queryPatient
   *@description: 查询病人列表
   */
  private queryPatient(data: any){
    queryPatient(data).then((res: any) => {
      if(res.errorCode=="SUCCESS"){
        this.patientList = res.data
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
        // date: this.date,
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
        if(res.data != null && res.data.length>0){
          res.data.map((v: any,idx: number) => {
            let obj: any = {}
            obj.key = v.zyh
            obj.zyh = v.zyh
            obj.brxm = v.brxm
            obj.brch = v.brch
            obj.brxb = v.brxb
            obj.nl = v.nl
            if(v.advices.length > 0){
              v.advices.map((x: any, index: number) => {
                x.idx = idx
                x.key = x.zyh +'_'+ index
                x.index = index + 1;
              })
              obj.children = v.advices
            }else{
              obj.children = []
            }
            this.yzList.push(obj)
          })
        }
      }
    })
  }

  /*@methods:arraySpanMethod
   *@description: 合并行
   */
  private arraySpanMethod({ row, column, rowIndex, columnIndex }: any) {
    if (row.brch) {
      if (columnIndex === 0) {
        return [1, 11]
      } else if (columnIndex === 1) {
        return [0, 0]
      }
    }
  }

  /*@methods: handlePrint
   *@description: 打印标签
   */
  private handlePrint() {
    if(this.yzList.length>0){
      let list: Array<any> = []
      this.yzList.map((val: any) => {
        if(val.children.length>0){
          val.children.map((v: any) => {
            list.push(v.yzzh)
          })
        }
      })
      let param: any = {
        yfsb: this.yfsb,
        pcid: this.pcid,
        yzzhList: list
      }
      printLabel(param).then((res: any) => {
        if(res.errorCode=="SUCCESS"){
          let list: Array<any> = []
          list = res.data
          // 刷新患者列表、医嘱药品详情
          this.queryWard()
          this.patientList = []
          this.yzList = []
        }
      })
    }else{

    }
  }
}
</script>

<style scoped lang='scss'>
.title {
  font-size: 14px !important;
  margin-right: 10px !important;
}
.date-wrapper{
  width: 100%;
}
.content .his-small .el-form .el-form-item .el-input--medium {
  margin-bottom: 16px;
}
.content .his-small ::v-deep .el-form .el-form-item .el-form-item__label {
  line-height: 12px !important;
}
.content .his-small .el-form .el-form-item {
  margin-bottom: 0px;
}

.orangeBack,
.greenBack {
  height: 32px;
  opacity: 30%;
}

.greenBack {
  background: #0fcaad;
}
.orangeBack {
  background: #ffbf00;
}
</style>

