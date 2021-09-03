<!--
 * @Date: 
 * @LastEditTime: 
 * @Description: 柜子标签重打
 * @FilePath: 
-->
<template>
  <div class="content">
    <div class="his-module his-small">
      <div slot="header" class="row">
        <div class="label">
          <span class="searchTitle">{{$t('治疗日期')}}</span>
          <el-date-picker
            v-model="date"
            type="date"
            class="date-wrapper"
            :clearable="false"
            placeholder="选择日期"
          ></el-date-picker>
          <span class="searchTitle ml8">{{$t('批次')}}</span>
          <el-select v-model="pcid" placeholder="请选择批次" @change="handleChangeBatch">
            <el-option v-for="item in batchList" :key="item.id" :label="item.pcmc" :value="item.id"></el-option>
          </el-select>
          <span class="searchTitle ml8">{{$t('病区')}}</span>
          <el-select v-model="bqdm" placeholder="请选择病区" @change="handleChangeWard">
            <el-option v-for="item in wardList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <div class="btn ml8">
            <el-button @click="handleAgainPrint">
              <i class="icon his-btn-print"></i>重打标签
            </el-button>
          </div>
        </div>
      </div>
      <el-table
        :data="patientData"
        border
        stripe
        slot="list"
        :height="listSlotHeight - 105"
        class="scroll-bar"
        @select-all='handleAllSelPatient' 
        @selection-change='handleSelPatient'
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" :label="$t('')" width="32"></el-table-column>
        <el-table-column prop="bq" :label="$t('病区')"></el-table-column>
        <el-table-column prop="zlrq" :label="$t('治疗日期')"></el-table-column>
        <el-table-column prop="pcmc" :label="$t('批次')"></el-table-column>
        <el-table-column prop="dbds" :label="$t('总袋数')"></el-table-column>
        <el-table-column prop="dbsj" :label="$t('打包时间')"></el-table-column>
        <el-table-column prop="dbr" :label="$t('打包人')"></el-table-column>
        <el-table-column prop="dbgztm" :label="$t('柜子条形码')"></el-table-column>
      </el-table>
    </div>
    <!-- <el-dialog :visible.sync="isVisible" title="重打" width="30%" class="narrow-dialog">
      <el-form :model="form" label-width="80px" style="padding:10px 16px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="病区:">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批次:">
              <el-input></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="总袋数:">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="打包人:">
              <el-input></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="打包时间:">
              <el-input></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="width:90%; height:60px">条形码</div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取 消</el-button>
        <el-button type="primary" @click="isVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script lang='ts' >
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { 
  queryBatch,
  queryWard,
  queryPatient, 
  packing
} from '@/api/his/inject/infusiondrugs/cabinetLabel.ts'
import { formatDate, id2Name } from '@/utils'
import { Script } from 'vm'
import { forEach } from 'jszip'
@Component({
  name: 'cabinetLable',
  components: {},
})
export default class extends Vue {
  private listSlotHeight: number = 0 //列表高度
  private doctorList: Array<any> = [] // 批次列表
  private yfsb: number | null = null // 药房识别
  private date: string | null = null // 治疗日期
  private pcid: string | null = null // 批次id
  private batchList: Array<any> = [] // 批次列表
  private bqdm: number | null = null // 病区代码
  private wardList: Array<any> = [] // 病区列表
  private selWardList: Array<any> = [] // 选择病区列表
  private patientList: Array<any> = [] // 患者列表
  private selPatientList: Array<any> = [] // 选择患者列表
  private yzList: Array<any> = [] // 医嘱列表
  private isVisible: boolean = false 

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
    // 获取医生列表
    this.doctorList = this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    // 获取yfsb
    this.yfsb = Vue.prototype.AUTHORITY.bussinessRole
  }

  mounted() {
    this.date = formatDate(1)
    this.queryBatch()
  }

  get patientData(){
    id2Name(this.patientList, 'bqdm', 'bq', this.wardList, 'id', 'name')
    id2Name(this.patientList, 'dbrgh', 'dbr', this.wardList, 'dv', 'dn')
    return this.patientList
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
    this.queryBatch()
  }

  /*@methods: queryWard
   *@description: 查询病区列表
   */
  private queryWard() {
    queryWard({yfsb: this.yfsb}).then((res: any) => {
      if(res.errorCode=="SUCCESS"){
        this.wardList = res.data
        if(this.wardList.length>0){
          this.bqdm = this.wardList[0].id
          let param: any = {
            yfsb: this.yfsb,
            date: this.date,
            pcid:  this.pcid,
            bqdm: this.bqdm
          }
          this.queryPatient(param)
        }
      }
    })
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

  /*@methods: handleChangeWard
   *@description: 选择病区
   */
  private handleChangeWard() {
    this.queryBatch()
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
  }


  /*@methods: handleAgainPrint
   *@description: 重新打印
   */
  private handleAgainPrint() {
    this.isVisible = true
    let list: Array<any> = []
    if(this.selPatientList.length>0){
      this.selPatientList.map((val: any) => {
        list.push(val.id)
      })
      let param: any = {
        ids: list.join(',')
      }
      packing(param).then((res: any) => {
        if(res.errorCode=="SUCCESS"){
          
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
</style>
