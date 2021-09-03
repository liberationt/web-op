<!--
 * @Author: 
 * @LastEditTime: 
 * @LastEditors: dmj
 * @Description:审方核对
 * @FilePath: 
-->
<template>
  <div class="payManage content ht">
    <div class="el-ward">
      <el-divider class="mr4" direction="vertical"></el-divider>
      <span class="mr10">病区</span>
      <el-select class="his-el-select" v-model="bqdm" placeholder="请选择病区" @change="handleSelWard">
        <el-option v-for='item in wardList' :key='item.id' :label="item.name" :value="item.id"></el-option> 
      </el-select>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleChangeTabs" class="tab-small">
      <!-- 待审方医嘱 -->
      <el-tab-pane :label="$t('待审方医嘱')" name="dsfyz">
        <el-row :gutter="10">
          <el-col :span="leftCol">
            <div class="his-module his-small">
              <div class="row" slot="header" style="justify-content:flex-start">
                <div class="label headInput">
                  <span class="title">患者列表</span>
                </div>
              </div>
              <el-table
                :data="patientList"
                ref="patient"
                stripe
                border
                highlight-current-row
                class="scroll-bar no-underline"
                highlight-row
                :height="listSlotHeight + 60"
                @row-click="handleSelPatient"
                @select-all='handleAllSel'
                @selection-change="handleSel"
              >
                <el-table-column prop="webSortNumber" width="32" align="center" type="selection"></el-table-column>
                <el-table-column prop="brch" :label="$t('床号')" width="60"></el-table-column>
                <el-table-column prop="brxm" :label="$t('姓名')" width="60"></el-table-column>
                <el-table-column prop="zyhm" :label="$t('住院号码')"></el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :span="rightCol" v-if="activeName == 'dsfyz'">
            <div
              class="his-module his-small tableTop headTop"
              :style="{height:listSlotHeight + 120 + 'px'}"
            >
              <div class="row">
                <div class="label">
                  <span class="title">待审方医嘱</span>
                  <el-divider class="mr4" direction="vertical"></el-divider>
                  <div class="btn">
                    <el-button size="mini" type="text" :disabled='pendingPrescriptionSelList.length == 0' @click="handleAdopt">
                      <i class="green icon his-btn-confirm"></i>
                      {{$t('审方通过')}}
                    </el-button>
                  </div>
                </div>
              </div>
              <el-table
                :data="pendingPrescriptionData"
                ref="pendingPrescription"
                stripe
                border
                class="scroll-bar border no-underline"
                highlight-row
                row-key="key"
                default-expand-all
                :height="listSlotHeight+60"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                :span-method="arraySpanMethod"
                @selection-change='handleSelect'
                @select="handleSelectRow"
              >
                <el-table-column width="1">
                  <template slot-scope="scope" v-if="scope.row.brch">
                    <div class="data-head">
                      <span>床号：{{scope.row.brch}}</span>
                      <el-divider direction="vertical"></el-divider>
                      <span>姓名：{{scope.row.brxm}}</span>
                      <el-divider direction="vertical"></el-divider>
                      <span>性别：{{scope.row.sex}} </span>
                      <el-divider direction="vertical"></el-divider>
                      <span>年龄:{{scope.row.nl}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label width="16" align="center">
                  <template slot-scope="scope">
                    <div class="w100" :class="scope.row.yzzh % 3 === 1 ? 'greenBack' : 'orangeBack'"></div>
                  </template>
                </el-table-column>
                <el-table-column type="selection" width="32"></el-table-column>
                <el-table-column prop="lx" :label="$t('类型')" width="80"></el-table-column>
                <el-table-column prop="ypmc" :label="$t('药品名称')" show-overflow-tooltip width="220"></el-table-column>
                <el-table-column prop="yfgg" :label="$t('规格')" width="100"></el-table-column>
                <el-table-column prop="cdmc" :label="$t('产地')" width="120"></el-table-column>
                <el-table-column prop="ycjl" :label="$t('剂量')" width="60"></el-table-column>
                <el-table-column prop="sypc" :label="$t('频次')" width="50"></el-table-column>
                <el-table-column prop="gytj" :label="$t('途径')" width="50"></el-table-column>
                <el-table-column prop="yzzxsj" :label="$t('执行时间')" width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="bzxx" :label="$t('说明')" show-overflow-tooltip width="100"></el-table-column>
                <el-table-column prop="kssj" :label="$t('开嘱时间')" width="140" show-overflow-tooltip></el-table-column>
                <el-table-column prop="ysgh" :label="$t('开嘱医生')" width="80"></el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <!-- 已审方医嘱 -->
      <el-tab-pane :label="$t('已审方医嘱')" name="ysfyz">
        <div class="his-module his-small">
          <el-table
            slot="list"
            :data="approvedPrescriptionData"
            ref="approvedPrescription"
            stripe
            border
            class="scroll-bar border no-underline"
            highlight-row
            row-key="key"
            default-expand-all
            :height="listSlotHeight+105"
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
            <el-table-column prop="lx" :label="$t('类型')" width="80"></el-table-column>
            <el-table-column prop="ypmc" :label="$t('药品名称')" width="200" show-overflow-tooltip ></el-table-column>
            <el-table-column prop="yfgg" :label="$t('规格')" width="100"></el-table-column>
            <el-table-column prop="cdmc" :label="$t('产地')" width="120"></el-table-column>
            <el-table-column prop="ycjl" :label="$t('剂量')" width="60"></el-table-column>
            <el-table-column prop="sypc" :label="$t('频次')" width="50" class-name="text-blue-td"></el-table-column>
            <el-table-column prop="gytj" :label="$t('途径')" width="50"></el-table-column>
            <el-table-column prop="yzzxsj" :label="$t('执行时间')" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column prop="bzxx" :label="$t('说明')" width="60"></el-table-column>
            <el-table-column prop="kssj" :label="$t('开嘱时间')" width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ysgh" :label="$t('开嘱医生')" width="80"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- <tip-dialog :tipData="dialogItem"></tip-dialog> -->
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { 
  queryWard,
  queryDsList, 
  checkList,
  approvedYz,
  queryYsList 
} from '@/api/his/inject/infusiondrugs/judgeCheck.ts'
import { AppModule } from '@/store/modules/app'
import { listeners } from 'process'
import { id2Name } from '@/utils'

@Component({
  name: 'JudgeCheck',
  filters: {},
  components: {},
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private leftCol: number = 6
  private rightCol: number = 18
  private activeName: string = 'dsfyz' // 默认tab名称- 待审方医嘱
  private yfsb: number | null = null // 药房识别
  private bqdm: number | null = null // 病区代码
  private sexList: Array<any> = [] // 性别列表
  private yzlxList: Array<any> = [] // 医嘱类别列表
  private wardList: Array<any> = [] // 病区列表
  private patientList: Array<any> = [] // 患者列表
  private selPatientList: Array<any> = [] // 选择患者列表
  private pendingPrescriptionList: Array<any> = [] // 待审方医嘱列表
  private pendingPrescriptionSelList: Array<any> = [] // 选择待审方医嘱列表
  private approvedPrescriptionList: Array<any> = [] // 已审方医嘱列表
  //钩子函数
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 51 - 40 - 49 - 30 - 10
    // 获取性别列表
    this.sexList = this.$store.state.webSqlDict.SEX_DICT
    // 获取医嘱类别列表
    this.yzlxList = this.$store.state.webSqlDict.DOCTOR_ADVICE_DICT
    // 获取yfsb
    this.yfsb = Vue.prototype.AUTHORITY.bussinessRole
  }

  mounted() {
    this.queryWard()
  }

  destroyed() {
    AppModule.SetDialogInfo({ isShow: false, title: '', message: '' })
  }

  get pendingPrescriptionData() {
    id2Name(this.pendingPrescriptionList, 'brxb', 'sex', this.sexList, 'dv', 'dn')
    if(this.pendingPrescriptionList.length>0) {
      this.pendingPrescriptionList.map((v: any) => {
        if(v.children.length>0){
          v.children.map((x: any) => {
            id2Name(v.children, 'yzlx', 'lx', this.yzlxList, 'dv', 'dn')
          })
        }
      })
    }
    return this.pendingPrescriptionList
  }

  get approvedPrescriptionData() {
    id2Name(this.approvedPrescriptionList, 'brxb', 'sex', this.sexList, 'dv', 'dn')
    if(this.approvedPrescriptionList.length>0) {
      this.approvedPrescriptionList.map((v: any) => {
        if(v.children.length>0){
          v.children.map((x: any) => {
            id2Name(v.children, 'yzlx', 'lx', this.yzlxList, 'dv', 'dn')
          })
        }
      })
    }
    return this.approvedPrescriptionList
  }

  /*@methods: queryWard
   *@description: 查询药房发药病区
   */
  private queryWard(){  
    let param = {
      yfsb: this.yfsb
    }
    queryWard(param).then((res: any) => {
      if(res.errorCode == 'SUCCESS'){
        this.wardList = []
        if(res.data != null || res.data != '' || res.data != undefined){
          for(let key in res.data){
            let obj: any = {}
            obj.id = key
            obj.name = res.data[key]
            this.wardList.push(obj)
          }
          this.bqdm = this.wardList[0].id
          this.queryDsList()
        }
      }
    })
  }

  /*@methods: handleSelWard
   *@description: 选择病区
   */
  private handleSelWard(){
    this.queryDsList()
  }

  //  处理特殊tab需求
  private handleChangeTabs(tab: any, event: any) {
    if (tab.name == 'ysfyz') {
      this.leftCol = 24
      this.rightCol = 0
      this.queryYsList()
    } else {
      this.leftCol = 6
      this.rightCol = 18
      this.queryDsList()
    }
  }

  /*@methods: queryDsList
   *@description: 查询待审方病人列表
   */
  private queryDsList(){  
    let param = {
      yfsb: this.yfsb,
      bqdm: this.bqdm
    }
    queryDsList(param).then((res: any) => {
      if(res.errorCode == 'SUCCESS'){
        this.patientList = res.data.list
      }else{
        AppModule.SetDialogInfo({ isShow: true, title: '提示', message: `${res.message},请跳转静脉配置给药途径设置`,isHas: true, button: '跳转静脉配置给药途径设置'  })
      }
    })
  }

  /*@methods: handleSelPatient
   *@description: 选择待审方医嘱
   */
  private handleSelPatient(data: any){
    // if(data){
    //   (this.$refs.pendingPrescription as any).toggleRowSelection(data)
    //   this.queryDsList()
    // }
  }

  /*@methods: handleAllSel
   *@description: 是否全选待审方医嘱
   */
  private handleAllSel(val: any){
    this.selPatientList = val
  }

  private handleSel(val: any){
    this.selPatientList = val
    if(this.selPatientList.length > 0){
      let list: Array<any> = []
      if(this.selPatientList.length>0){
        this.selPatientList.map((val: any) =>{
          list.push(val.zyh)
        })
        let param: any = {
          yfsb: this.yfsb,
          zyh: list.join(',')
        }
        this.getPendingPrescription(param)
      }
    }else{
      this.pendingPrescriptionList = []
    }
  }

  /*@methods: getPendingPrescription
   *@description: 获取待审方医嘱列表
   */
  private getPendingPrescription(data: any){
    checkList(data).then((res: any) => {
      if(res.errorCode=="SUCCESS"){
        this.pendingPrescriptionList = [] // 清空待审方医嘱列表
        let list: Array<any> = []
        list = res.data
        if(list.length>0){
          list.map((v: any,idx: number) => {
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
                x.index = index + 1
                this.$nextTick(() => {
                  (this.$refs.pendingPrescription as any).toggleRowSelection(x,true);
                })
              })
              obj.children = v.advices
            }else{
              obj.children = []
            }
            this.pendingPrescriptionList.push(obj)
          })
        }
      }
    })
  }
  
  /*@methods: handleSelect
   *@description: 是否选择待审方医嘱
   */
  private handleSelect(data: any){
    this.pendingPrescriptionSelList = data 
  }
  
  /*@methods: handleSelectRow
   *@description: 是否选择待审方医嘱
   */
  private handleSelectRow(data:any, row:any){
    // console.log(data);
    // console.log(row);
    let selected = data.length && data.indexOf(row) !== -1
    const pendingPrescription: any = this.$refs.pendingPrescription
    // console.log(this.pendingPrescriptionList);
    this.pendingPrescriptionList.map((val:any) => {
      if(val.children.length>0){
        val.children.map((v: any) => {
          // console.log(v.yzzh == row.yzzh);
          // console.log(val.zyh != row.zyh);
          if(v.yzzh == row.yzzh) {
            pendingPrescription.toggleRowSelection(v,selected);
            if(!selected) {
                let nowIndex = data.indexOf(v)
                if (nowIndex  !== -1 ) data.splice(nowIndex, 1)
            }else {
                let nowIndex = data.indexOf(row)
                if (nowIndex  !== -1 ) data.splice(nowIndex, 0, v)
            }
            this.pendingPrescriptionSelList = data
          }
        })
      }
    })
  }

  /*@methods: handleAdopt
   *@description:审方通过
   */
  private handleAdopt(){
    let list: Array<any> = []
    if(this.pendingPrescriptionSelList.length>0){
      this.pendingPrescriptionSelList.map((v: any) => {
        list.push(v.yzxh)
      })
      let param: any = {
        yfsb: this.yfsb,
        yzxh: list.join(',')
      }
      approvedYz(param).then((res: any) => {
        if(res.errorCode=="SUCCESS"){
           this.$notify({ 
            title: '审方通过成功！',
            message: '',
            type: 'success'
          })
          this.queryDsList()
          this.pendingPrescriptionList = []
        }
      })
    }
  }

  /*@methods: queryYsList
   *@description:查询已审医嘱列表
   */
  private queryYsList(){
    let param: any = {
      yfsb: this.yfsb,
      bqid: this.bqdm
    }
    queryYsList(param).then((res: any) => {
      if(res.errorCode=="SUCCESS"){
        this.approvedPrescriptionList = [] // 清空已审方医嘱列表
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
            this.approvedPrescriptionList.push(obj)
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
        return [1, 14]
      } else if (columnIndex === 1) {
        return [0, 0]
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.jkcx {
  .el-divider--vertical {
    margin: 0 4px 0 0;
  }
}
.payManage {
  position: relative;
  .el-ward{
    position: absolute;
    top: 5px;
    left: 212px;
    height: 30px;
    line-height: 30px;
    z-index: 100;
  }
  .his-module {
    .el-form {
      margin: 0 auto;
      padding: 0 8px;
    }
  }
}

.payManage {
  height: 100%;
  .tab-small {
    ::v-deep .el-tabs__header {
      padding: 5px 10px;
      border-radius: 8px;
      background: #fff;
      margin-bottom: 10px;
    }
  }
  ::v-deep .el-tabs__content {
    height: calc(100% - 50px);
    .el-tab-pane {
      height: 100%;
    }
  }
}
::v-deep .row .search .el-input__inner {
  width: 100% !important;
}

.no-padding {
  padding: 0;
  height: auto;
}
::v-deep .el-dialog {
  .el-dialog__body {
    padding: 0 0 10px;
  }
  .content {
    .his-module {
      height: auto;
    }
    .his-small {
      padding: 10px 10px 0;
    }
  }
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
.sex{
  font-size: 14px !important;
  font-weight: bold;
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