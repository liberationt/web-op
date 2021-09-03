<!--
 * @Date: 
 * @LastEditTime: 
 * @Description: 打包核对
 * @FilePath: 
-->

<template>
  <div class="content opertionIncome">
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="his-module his-small" :style="{ marginBottom: '10px' }">
          <div slot="header" class="row" style="border:none ;padding-bottom:0 ;margin-bottom:0">
            <div class="label">
              <span class="searchTitle ml8">{{$t('批次')}}</span>
              <el-select v-model="pcid" class="outbound" placeholder="请选择批次" @change="handleChangeBatch">
                <el-option v-for='item in batchList' :key='item.id' :label="item.pcmc" :value="item.id"></el-option>
              </el-select>
              <span class="searchTitle ml8">{{$t('病区')}}</span>
              <el-select v-model="bqdm" placeholder="请选择病区" @change="handleChangeWard">
                <el-option v-for='item in wardList' :key='item.id' :label="item.name" :value="item.id"></el-option>
              </el-select>
              <el-divider direction="vertical" class="mr4"></el-divider>
              <div class="btn">
                <el-button @click="openStamp" :disabled='patientList.length == 0 || !(selPatientList.length == patientList.length) '>
                  <i class="icon his-btn-print" />打包
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="ht">
        <div
          class="his-module his-small headTop ht"
          :style="{ height: listSlotHeight  - 65  + 'px', marginBottom: '10px' }"
        >
            <div slot="header" class="row">
              <div class="label">
                <span class="title">{{$t('患者列表')}}</span>
              </div>
            </div>
            <el-table
              :data="patientList"
              border
              stripe
              slot="list"
              :height="listSlotHeight - 128"
              class="no-underline scroll-bar"
              @selection-change="handleSelPatient"
            >
              <el-table-column type="selection" disabled="true" :selectable='idDisabled' width="32"></el-table-column>
              <el-table-column prop="brch" :label="$t('床号')" width="60"></el-table-column>
              <el-table-column prop="brxm" :label="$t('姓名')" width="60"></el-table-column>
              <el-table-column prop="zyh" :label="$t('住院号')"></el-table-column>
            </el-table>
        </div>
      </el-col>
      <el-col :span="18">
        <div
          class="his-module his-small headTop"
          :style="{ height: listSlotHeight - 65  + 'px', marginBottom: '10px' }"
        >
          <div slot="header" class="row">
            <div class="label">
              <span class="title">{{$t('条码')}}</span>
              <el-input v-model="txm" placeholder="请输入条码" @change="handleSearch" clearable @clear="handleClear"></el-input>
            </div>
          </div>
          <el-table
            :data="yzData"
            ref="yz"
            border
            stripe
            slot="list"
            :height="listSlotHeight - 128"
            class="no-underline scroll-bar"
            @selection-change="handleSel"
          >
            <el-table-column label width="16" align="center">
              <template slot-scope="scope">
                <div class="w100" :class="scope.row.id % 2 === 1 ? 'greenBack' : 'orangeBack'"></div>
              </template>
            </el-table-column>
            <el-table-column type="selection" disabled="true" :selectable='idDisabled' width="32">
            </el-table-column>
            <el-table-column prop="fs" :label="$t('方式')" width="50"></el-table-column>
            <el-table-column prop="lx" :label="$t('类型')" width="70" class-name="text-reds-td"></el-table-column>
            <el-table-column prop="yzzh" :label="$t('组号')" width="60"></el-table-column>
            <el-table-column type="index" :label="$t('')" width="32"></el-table-column>
            <el-table-column prop="ypmc" :label="$t('药品名称')" show-overflow-tooltip width="200"></el-table-column>
            <el-table-column prop="ypgg" :label="$t('规格')" show-overflow-tooltip width="100"></el-table-column>
            <el-table-column prop="cdmc" :label="$t('产地')" show-overflow-tooltip width="100"></el-table-column>
            <el-table-column prop="ypsl" :label="$t('数量')" width="48"></el-table-column>
            <el-table-column prop="pcmc" :label="$t('批次')" width="48"></el-table-column>
            <el-table-column prop="zlsj" :label="$t('治疗时间')" show-overflow-tooltip width="120"></el-table-column>
            <el-table-column prop="txm" :label="$t('条形码')" width="120"></el-table-column>
            <el-table-column prop="dyxh" :label="$t('打印序号')" width="70"></el-table-column>
            <el-table-column prop="brch" :label="$t('床号')" width="70"></el-table-column>
            <el-table-column prop="brxm" :label="$t('病人姓名')" width="70"></el-table-column>
            <el-table-column prop="sex" :label="$t('性别')" width="48"></el-table-column>
            <el-table-column prop="nl" :label="$t('年龄')" width="48"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <packCheck ref="packCheck"></packCheck>
  </div>
</template>

<script lang='ts' >
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { 
  queryBatch,
  queryWard,
  queryPatient, 
  queryYzList,
  packing
} from '@/api/his/inject/infusiondrugs/packCheck.ts'
import { formatInt, id2Name } from '@/utils'
import { Script } from 'vm'
import packCheck from './compontents/packCheck.vue'
@Component({
  name: 'drugLable',
  components: { packCheck },
})
export default class extends Vue {
  private listSlotHeight: number = 0 //列表高度
  private sexList: Array<any> = [] // 性别列表
  private jpfsList: Array<any> = [] // 静配方式列表
  private yzlxList: Array<any> = [] // 医嘱类别列表
  private yfsb: number | null = null // 药房识别
  private pcid: number | null = null // 批次ID
  private batchList: Array<any> = [] // 批次列表
  private bqdm: number | null = null // 病区代码
  private wardList: Array<any> = [] // 病区列表
  private bqdmList: Array<any> = [] // 病区代码列表
  private patientList: Array<any> = [] // 患者列表
  private selPatientList: Array<any> = [] // 选择患者列表
  private txm: number | null = null // 条形码
  private yzList: Array<any> = [] // 医嘱列表
 
  private openStamp() {
    ;(this.$refs.packCheck as any).open()
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
    // 获取静配方式列表
    this.jpfsList = this.$store.state.webSqlDict.STATIC_STYLE_DICT
    // 获取医嘱类别列表
    this.yzlxList = this.$store.state.webSqlDict.DOCTOR_ADVICE_DICT
    // 获取性别列表
    this.sexList = this.$store.state.webSqlDict.SEX_DICT
    // 获取yfsb
    this.yfsb = Vue.prototype.AUTHORITY.bussinessRole
  }

  mounted() {
    this.queryBatch()
    this.queryWard()
  }

  get yzData() {
    id2Name(this.yzList, 'jpfs', 'fs', this.jpfsList, 'dv', 'dn')
    id2Name(this.yzList, 'yzlx', 'lx', this.yzlxList, 'dv', 'dn')
    id2Name(this.yzList, 'brxb', 'sex', this.sexList, 'dv', 'dn')
    return this.yzList
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
          this.queryPatient()
          this.queryYzList()
        }else{
          this.patientList = []
          this.yzList = []
        }
      }
    })
  }

  /*@methods: handleChangeBatch
   *@description: 选择批次
   */
  private handleChangeBatch() {
    this.queryPatient()
    this.queryYzList()
  }

  /*@methods: queryWard
   *@description: 查询药房发药病区
   */
  private queryWard() {
    queryWard({yfsb: this.yfsb}).then((res: any) => {
      if(res.errorCode=="SUCCESS"){
        this.bqdmList = []
        this.wardList = res.data
        let list: Array<any> = []
        if(this.wardList.length>0){
          this.bqdm = this.wardList[0].id
          this.wardList.map((v: any) => {
            this.bqdmList.push(v.id)
          })
          this.queryPatient()
        }
      }
    })
  }

  /*@methods: handleChangeWard
   *@description: 选择病区
   */
  private handleChangeWard() {
    this.queryPatient()
    this.queryYzList()
  }

  /*@methods: queryPatient
   *@description: 查询病人列表
   */
  private queryPatient(){
    if(this.pcid != null && this.bqdmList.length>0){
      let param: any = {
        yfsb: this.yfsb,
        pcid: this.pcid,
        date: '',
        bqdm: this.bqdm
      }
      queryPatient(param).then((res: any) => {
        if(res.errorCode=="SUCCESS"){
          this.patientList = res.data
        }
      })
    }else{
      this.patientList = []
      this.yzList = []
    }
  }

  private handleSelPatient(data: any){
    this.selPatientList = data
  }

  /*@methods: queryYzList
   *@description: 查询医嘱列表
   */
  private queryYzList(){
    let params: any = {
      yfsb: this.yfsb,
      date: '',
      pcid: this.pcid,
      txm: this.txm,
    }
    queryYzList(params).then((res: any) => {
      if(res.errorCode=="SUCCESS"){
        this.yzList = res.data
        if(this.yzList.length>0){
          this.yzList.map((v: any) => {
            v.check = false
          })
        }
      }
    })
  }

  /*@methods: packing
   *@description: 查询病人列表
   */
  private idDisabled(data: any){
    // console.log(data);
    if(data.check){
      return 1
    }else{
      return 0
    }
  }

  /*@methods: handleSearch
   *@description: 根据条码查询医嘱
   */
  private handleSearch() {
    if(this.yzList.length>0){
      this.yzList.map((v: any) => {
        console.log(v);
        if(v.txm == this.txm){
          let length: number = 0
          length = length + 1
          console.log(length);
          this.$nextTick(() => {
            (this.$refs.yz as any).toggleRowSelection(v,true)
          })
        }
      })
    }
  }

  private handleSel(data: any) {
    console.log(data);
  }

  /*@methods: handleClear
   *@description: 清除条码
   */
  private handleClear(){
    this.txm = null
  }
}
</script>

<style scoped lang='scss'>
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
.headTop {
  padding-top: 10px;
  ::v-deep.el-table__header-wrapper {
    .el-checkbox{
      display: none !important
    }
  }
}
</style>