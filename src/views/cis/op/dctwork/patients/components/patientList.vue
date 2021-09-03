<!--
 * @Date: 2020-05-17 17:19:23
 * @LastEditors: zhml
 * @LastEditTime: 2020-09-11 16:52:23
 * @description:  首页的病人列表
-->
<template>
    <div class="ht his-module his-mini his-patient scroll-bar">
        <el-table :data="tableFormat"
          border
          stripe
          ref="data"
          @row-dblclick="handleLeftDblclick"
          class="scroll-bar no-underline">
          <!-- 排队号 -->
          <el-table-column prop="jhhm" :label="$t('patients.pdhm')" width="60"></el-table-column>
          <!-- 姓名 -->
          <el-table-column prop="brxm" :label="$t('patients.brxm')" min-width="56">
            <template slot-scope="scope">
              <div>{{scope.row.brxm}}</div>
              <!-- <el-badge :value="12" :max="99" style="margin-left: 6px"></el-badge> -->
              <!-- <div v-if="scope.row.onlineStatus == true && isInternet == 1"  style="margin-left: auto;margin-right: 8px"><i class="icon his-zaixian" style="font-size: 12px"></i></div>
              <div v-if="scope.row.onlineStatus == false && isInternet == 1" style="margin-left: auto;margin-right: 8px"><i class="icon his-lixian" style="font-size: 12px"></i></div> -->
            </template>

          </el-table-column>
          <!-- 性别 -->
          <el-table-column prop="brxbName" :label="$t('patients.brxb')" width="48"> </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { IPatientForm, queryPatientList,onLineStatus } from '@/api/cis/op/dctwork/patients'
import { id2Name } from '@/utils'

@Component({
  name: 'PatientList',
  filters: {},
})
export default class extends Vue {
  @Prop({ required: true }) private value!: any

  get tableData() {
    if (this.value) {
      console.log(46,this.value)
      this.value.forEach((res: any) => {
        this.jzlshList.push(res.jzlsh)
      });
      console.log(49,this.jzlshList)
      
      return this.value
    }
  }

  set tableData(value: any) {
    this.$emit('input', value)
  }

  private sexList: Array<any> = [] //性别
  private patientTypeList: Array<any> = [] //患者性质
  private doctorList: Array<any> = [] //医生
  private deptList: Array<any> = [] //科室
  private timingValue: any = '' //定时器
  private jzlshList: Array<any> = [] //存储就诊流水号数组
  private isInternet: any = ''

  get tableFormat() {
    const tabledatas = this.tableData
    id2Name(tabledatas, 'brxb', 'brxbName', this.sexList, 'dv', 'dn')
    id2Name(tabledatas, 'brxz', 'brxzName', this.patientTypeList, 'dv', 'dn')
    id2Name(tabledatas, 'ysdm', 'ysdmName', this.doctorList, 'dv', 'dn')
    id2Name(tabledatas, 'zsid', 'zsidName', this.doctorList, 'dv', 'dn')
    console.log(tabledatas,12321313)
    return tabledatas
  }

  mounted() {
    console.log(67,Vue.prototype.AUTHORITY.hlwks)
    this.sexList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT
    this.patientTypeList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_PATIENT_DICT : this.$store.state.webSqlDict.TABLE_PATIENT_DICT
    this.doctorList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.deptList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DEPT_DICT : this.$store.state.webSqlDict.DEPT_DICT
    this.isInternet = Vue.prototype.AUTHORITY.hlwks
    console.log(83,this.isInternet)
    // this.timingValue = setInterval(this.getonLineStatus,1000)
    //   // this.getonLineStatus()
    //   this.$once("hook:beforeDestroy",()=> {
    //     clearInterval(this.timingValue)
    //   })
  }

  // 长轮询读取在线状态
  private getonLineStatus() {
    onLineStatus(this.jzlshList).then((res: any) => {
      if(res.errorCode == "SUCCESS") {
        console.log(87,res)
       
        for(let i = 0;i<this.tableData.length;i++) {
          for(let j in res.data) {
            console.log(j,123)
            if(this.tableData[i].jzlsh == j) {
              this.$set(this.tableData[i],'onlineStatus',res.data[j])
            }
          }
        }
         console.log(90,this.tableData)
      }
    })
  }

  // 双击切换病人
  private handleLeftDblclick(val: any) {
    let param: any = { ...val }
    param.ghxh = val.sbxh
    param.ksdm = Vue.prototype.AUTHORITY.outpatientCode
    // console.log('val', val, param.jzlsh)
    // console.log('param',param,Vue.prototype.AUTHORITY.outpatientCode,Vue.prototype.AUTHORITY.bussinessRole)
    this.$emit('transfer', param)
  }
}
</script>
<style lang="scss" scoped>
.his-patient {
  padding: 0 !important;
  margin-right: 0 !important;
  ::v-deep .el-table__row {
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
}
::v-deep sup {
  top:0;
}
::v-deep.el-table .cell {
  display: flex;
}
</style>
