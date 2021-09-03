<template>
  <div class="module his-patient-diagnosis">
    <el-row class="ht">
      <el-col :span="leftCol" class="ht pr10">
        <div class="his-module layout-top his-small his-mini">
          <div class="btn">
            <!-- 新组诊断	-->
            <el-button size="mini" type="text" @click="newDiagnose" :disabled="isHistory">
              <i class="icon his-caozuo-fuzhibingli green"></i>
              <span>{{ $t('patients.xzzd') }}</span>
            </el-button>
            <!--						<el-button size="mini" type="text" @click="fzDiagnose">-->
            <!--							<i class="icon his-diagnose blue"></i>-->
            <!--							<span>{{ $t('patients.fzzd') }}</span>-->
            <!--						</el-button>-->
            <el-divider direction="vertical"></el-divider>
            <el-button size="mini" type="text" @click="saveDiagno" :disabled="isHistory" :loading="saveFlag">
              <i class="icon his-btn-save green"></i>
              <span>{{ $t('common.save') }}</span>
            </el-button>
            <el-button size="mini" type="text" @click="handleDelete" :disabled="isHistory">
              <i class="icon his-btn-del red"></i>
              <span>{{ $t('common.delete') }}</span>
            </el-button>
            <el-button size="mini" type="text" @click="handleClick('up')" :disabled="isHistory">
              <i class="icon his-move-up blue"></i>
              <span>{{ $t('hospitalDataDict.up') }}</span>
            </el-button>
            <el-button size="mini" type="text" @click="handleClick('down')" :disabled="isHistory">
              <i class="icon his-move-down blue"></i>
              <span>{{ $t('hospitalDataDict.down') }}</span>
            </el-button>
          </div>

          <el-table :data="tableDatas" stripe fit border :row-class-name="tableRowClassName" highlight-current-row @row-click="handleRowClick" class="input-table" :height="comHeight" tooltip-effect="light">
            <!-- 序号 -->
            <el-table-column type="index" width="32"></el-table-column>
            <!-- 中西类别 -->
            <el-table-column prop="cflx" :label="$t('diagnosis.cflb')" min-width="72">
              <template slot-scope="scope">
                <el-select 
                  v-model="scope.row.cflx"
                  :ref="`${scope.$index}-1`" 
                  style="height: 32px;"
                  @change="changeCflx(scope)" 
                  @keydown.enter.native="nextFocus(scope.$index, 1)"
                  >
                  <el-option v-for="(item,index) in zxTypes" :key="index" :label="item.dn" :value="Number(item.dv)"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <!-- 诊断前缀 -->
            <el-table-column label="诊断前缀" min-width="80">
              <template slot-scope="scope">
                <el-input style="height: 32px" v-model="scope.row.prefix" clearable></el-input>
              </template>
            </el-table-column>
            <!-- 诊断名称 -->
            <el-table-column :label="$t('diagnosis.zdmc')" min-width="140" class-name="color-group">
              <template slot-scope="scope">
                <!-- <dictSearchBox
                  v-if="scope.row.cflx == 1"
                  :required="true"
                  v-model="scope.row.zdmc"
                  :ref="`${scope.$index}-2`"
                  style="height: 32px;"
                  tableName="GY_JBBM"
                  :resultHeader="[
                    { prop: 'JBXH', label: '院内编码', width: '100' },
                    { prop: 'ICD_CODE', label: 'ICD10', width: '80' },
                    { prop: 'JBMC', label: '疾病名称', width: '200' },
                  ]"
                  labelFiled="JBMC"
                  valueFiled="JBMC"
                  searchField="PYDM"
                  :popoverWidth="400"
                  @getData="setData"
                />
                <select-box v-if="scope.row.cflx == 2" v-model="scope.row.zdxh" :required="true" :isSearch="true" :ref="`${scope.$index}-2`" style="height: 32px;" @getData="setDataZY" :options="zyzdList" option_label_filed="dn" option_value_filed="dv"></select-box> -->
                <remoteSearchBox
                  v-if="scope.row.cflx == 1"
                  :required="true"
                  v-model="scope.row.zdmc"
                  :ref="`${scope.$index}-2`"
                  style="height: 32px"
                  :searchData="{
                    yp: {
                      pydm: '',
                    }
                  }"
                  :resultTableHeader="{
                    yp:[
                      {
                        prop: 'jbmc',
                        label: '诊断名称'
                      },
                      {
                        prop: 'icd10',
                        label: 'ICD编码'
                      }
                    ]
                  }"
                  :searchField="{
                    yp: 'pydm'
                  }"
                  :showLabel="{
                    yp: 'jbmc'
                  }"
                  name="xyzd"
                  @getData="data => setData(data,scope.$index)"
                ></remoteSearchBox>
                <remoteSearchBox
                  v-if="scope.row.cflx == 2"
                  :required="true"
                  v-model="scope.row.zdmc"
                  :ref="`${scope.$index}-2`"
                  style="height: 32px"
                  :searchData="{
                    yp: {
                      pydm: '',
                    }
                  }"
                  :resultTableHeader="{
                    yp:[
                      {
                        prop: 'jbmc',
                        label: '诊断名称'
                      },
                      {
                        prop: 'jbdm',
                        label: '疾病编码'
                      }
                    ]
                  }"
                  :searchField="{
                    yp: 'pydm'
                  }"
                  :showLabel="{
                    yp: 'jbmc'
                  }"
                  name="zyzd"
                  @getData="data => setDataZ(data)"
                ></remoteSearchBox>
              </template>
            </el-table-column>
            <!-- 诊断后缀 -->
            <el-table-column label="诊断后缀" min-width="80">
              <template slot-scope="scope">
                <el-input style="height: 32px" v-model="scope.row.suffix" clearable></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="zzbz" min-width="32">
              <template slot-scope="scope">
                <span style="color: red;">{{ scope.row.zzbz == 1 ? '主' : '' }}</span>
              </template>
            </el-table-column>
            <!-- 诊断编码 -->
            <el-table-column prop="icd10" :label="$t('diagnosis.zdbm')" min-width="80" show-overflow-tooltip>
            </el-table-column>
            <!-- 部位/证候 -->
            <el-table-column :label="$t('diagnosis.zhmc')" min-width="80">
              <template slot-scope="scope">
                <!-- <selectDown
                  v-if="scope.row.cflx == 1" 
                  v-model="scope.row.zdbw" 
                  :options="bodyList" 
                  :required="true" 
                  :isSearch="true" 
                  :ref="`${scope.$index}-3`" 
                  @getData="setDataZdbw" 
                  class="select" 
                  style="height: 32px;" 
                  clearable 
                  option_label_filed="dn" 
                  option_value_filed="dv"
                ></selectDown> -->
                <el-select 
                  v-if="scope.row.cflx == 1"
                  :ref="`${scope.$index}-3`" 
                  v-model="scope.row.zdbw"
                  style="height: 32px"
                  filterable
                  remote
                  placeholder=" "
                  :remote-method="remoteMethod"
                  :default-first-option="true"
                  clearable
                >
                  <el-option v-for="(item,index) in options" :key="index" :label="item.dn" :value="Number(item.dv)"></el-option>
                </el-select>

                <remoteSearchBox
                  v-if="scope.row.cflx == 2"
                  :required="true"
                  @clear="clearZh(scope.row)"
                  v-model="scope.row.zhmc"
                  :ref="`${scope.$index}-3`"
                  style="height: 32px"
                  :searchData="{
                    yp: {
                      condition: '',
                    }
                  }"
                  :resultTableHeader="{
                    yp:[
                      {
                        prop: 'zhmc',
                        label: '证侯名称'
                      }
                    ]
                  }"
                  :searchField="{
                    yp: 'condition'
                  }"
                  :showLabel="{
                    yp: 'zhmc'
                  }"
                  name='zyzh'
                  @getData="setDataZbw" 
                  popoverWidth="280"
                >
                </remoteSearchBox>
              </template>
            </el-table-column>
            <!-- 诊断时间 -->
            <el-table-column :label="$t('diagnosis.zdsj')" min-width="146">
              <template slot-scope="scope">
                <datePickerBox :required="true" v-model="scope.row.zdsj" :ref="`${scope.$index}-4`" style="height: 32px;" @blur="nextFocus(scope.$index, 4)" />
              </template>
            </el-table-column>
            <!-- 发病日期 -->
            <el-table-column :label="$t('diagnosis.fbrq')" min-width="146">
              <template slot-scope="scope">
                <datePickerBox :required="true" v-model="scope.row.fbrq" :ref="`${scope.$index}-5`" style="height: 32px;" @change="nextFocus(scope.$index, 5)" />
                <!--        format="yyyy-MM-dd"         -->
              </template>
            </el-table-column>
            <!-- 状态 -->
            <el-table-column :label="$t('diagnosis.zdzt')" min-width="50">
              <template slot-scope="scope">
                <select-box
                  v-model="scope.row.fzbz"
                  :required="false"
                  :ref="`${scope.$index}-6`"
                  style="height: 32px;"
                  :options="[
                    { dv: '1', dn: '待查' },
                    { dv: '2', dn: '复查' },
                  ]"
                  option_label_filed="dn"
                  option_value_filed="dv"
                  @blur="nextFocus(scope.$index, 6)"
                ></select-box>
              </template>
            </el-table-column>

            <!-- 疾病判别  -->
            <el-table-column :label="$t('diagnosis.zgqk')" min-width="90" prop="jbpb" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{ transer(scope.row.jbpb) }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="24 - leftCol" class="ht his-change-top">
        <!-- setObjOld  西医诊断部位传入的数据
				setObjInputOld  中医诊断证候传入的数据-->
        <fast-diagnose ref="fastDiagnose" @showRight="showRight" v-model="usualList" @setData="setObj" @setObjOld="setObjOld" @setObjInput="setObjInput" @setObjInputOld="setObjInputOld" @setObjInputZY="setObjInputZY" />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import fastDiagnose from './model/fastDiagnose.vue'
import { IBrzdObj, queryMsbrzd, saveMsbrzd, deleteMsbrzd } from '@/api/cis/op/dctwork/patients'
import { id2Name, formatDate, deepCopy, findKeys } from '@/utils'

export const NBrzdObj: IBrzdObj = {
  webSortNumber: 1,
  webSortStatus: false,
  brid: null,
  cflx: 1,
  deep: 0,
  fbrq: '2020-10-10 00:00:00',
  fzbz: 1,
  icd10: '',
  jbpb: '',
  jgid: null,
  jlbh: null,
  jzxh: null,
  plxh: null,
  sjzd: null,
  zdbw: '',
  zdlb: 1,
  zdmc: '',
  zdsj: '2020-10-10 00:00:00',
  zdxh: '', // 诊断序号
  zdys: '',
  zgqk: null,
  zgsj: '',
  zzbz: 1,
  ffbz: 0,
  blzd: 0,
}

@Component({
  name: 'Diagnosis',
  components: { fastDiagnose },
  filters: {
    filterStatus(value: string | number) {
      switch (value) {
        case 1:
          return '待查'
        case 2:
          return '复查'
      }
    },
  },
})
export default class extends Vue {
  @Prop({ required: true }) private isHistory!: boolean // 历史标志
  // @Prop({ required: true }) private pnParam!: any
  private tableDatas: IBrzdObj[] = [] //诊断信息
  private index: number = -1 //获取当前索引
  private rowData: any //当前行的数据
  private usualList: any[] = [] //常用诊断
  private comHeight: number = 0
  private leftCol: number = 23
  private zxTypes: Array<any> = [] //中西类别
  private bodyList: Array<any> = [] //诊断部位
  private zhList: Array<any> = [] // 证候部位
  private zyzdList: Array<any> = [] // 中医诊断字典
  private kslb: number = Vue.prototype.AUTHORITY.kslb
  private pnParam: any = {}
  private jbpbList: Array<any> = [] // 疾病判别数组
  private options: Array<any> = [] // 部位列表数据
  private saveFlag: boolean = false // 保存防重复点击
  get tableFormat() {
    const tabledata = this.tableDatas
    // id2Name(tabledata, 'zdbw', 'zdbwName', this.bodyList, 'dv', 'dn')
    // id2Name(tabledata, 'zdmc', 'zdmcName', this.zyzdList, 'dv', 'dn')
    return tabledata
  }

  created() {
    this.comHeight = Vue.prototype.PageHeight - 76 - 16 - 32 - 31 - 10 - 10
  }

  activated() {
    //默认加载西医的个人诊断列表
    this.tableDatas = []
    this.jbpbList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DISEASE_DISCRIMIN_DICT : this.$store.state.webSqlDict.DISEASE_DISCRIMIN_DICT
    this.bodyList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DIAGNOSE_BODY_PART : this.$store.state.webSqlDict.DIAGNOSE_BODY_PART
    this.zhList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.ZY_ZH_DICT : this.$store.state.webSqlDict.ZY_ZH_DICT
    this.zxTypes = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.ZX_TYPE_DICT : this.$store.state.webSqlDict.ZX_TYPE_DICT
    this.zyzdList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.ZY_ZD_DICT : this.$store.state.webSqlDict.ZY_ZD_DICT
    
    this.pnParam = this.$store.state.pnParam.PN_PARAM
    this.options = this.bodyList
    if (this.pnParam) {
      // 加载诊断信息表单
      this.getList()
    }
  }

  // 诊断名称是否唯一
  private isUnique(value: number | string, list: Array<any>) {
    let cc = list.findIndex((item: any) => item.zdxh == value)
    return cc
  }

  private sumList(value: number | string, list: Array<any>) {
    let cc = list.filter((item: any) => item.zdxh == value)
    return cc
  }

  private getList() {
    queryMsbrzd(this.pnParam).then((res: any) => {
      if(res.errorCode == "SUCCESS") {
        this.tableDatas = res.data
        this.tableDatas.forEach((item: any) => {
          if(item.zdbw == 0) {
            item.zdbw = ''
          }
        })
        // 第一次进入诊断页面默认新增一行
        this.$nextTick(()=> {
          if(this.tableDatas.length == 0) {
            this.newDiagnose()
          }
        })
      }
      // let num = 0
      // res.data.forEach((item: any, index: number) => {
      //   if (item.deep == 0) {
      //     item.webSortNumber = num + 1
      //     num++
      //   } else {
      //     item.webSortNumber = null
      //   }
      //   item.webRowStatus = false
      // })
      // this.tableDatas = res.data.map((item: any) => {
      //   if (item.zdbw == null || item.zdbw == 'null') item.zdbw = null
      //   return item
      // })
    })
  }

  /**
   * @LastEditors: zhml
   * @Description: 新增的数据是否已有药品名称,判断是否可以再次新增组或新增药品
   * @return:
   */
  private isClick(value: Array<any>) {
    if (value.length == 0) {
      return true
    } else return !(value[value.length - 1].zdmc == '' || value[value.length - 1].zdmc === null || value[value.length - 1].zdmc === undefined)
  }

  /**
   * @Description: 新增诊断
   * @author: zhml
   * @param {type}: obj
   * @return:
   * @date 2020/6/23
   */
  private newDiagnose() {
    if (this.isClick(this.tableDatas)) {
      // 诊断数<=5
      if (this.tableDatas.length > 4) {
        this.$message.warning('一个诊断最多5条')
        return
      }
      let param = { ...NBrzdObj }
      let num = this.tableDatas.filter((item) => item.deep == 0).length
      param.webSortNumber = num + 1
      param.fbrq = formatDate(2)
      param.zdsj = formatDate(2)
      param.deep = 0
      if (this.tableDatas.length > 0) {
        param.zzbz = 0
      }
      if (this.kslb == 1) param.cflx = 2
      this.tableDatas.splice(this.tableDatas.length, 0, param)
      this.index = this.tableDatas.length - 1
      this.$nextTick(() => {
        ;(this.$refs[`${this.index}-2`] as any).focus()
      })
    }
  }

  /**
   * @Description: 辅助诊断
   * @author: zhml
   * @param {type}:  void
   * @return: list
   * @date 2020/7/10
   */
  private fzDiagnose() {
    // 诊断数<=5
    if (this.tableDatas.length > 5) return
    if (this.index == -1) {
      this.$notify({
        type: 'warning',
        title: '请选中父诊断数据',
        message: '',
      })
    } else {
      let param = { ...NBrzdObj }
      param.webSortNumber = null
      param.zzbz = 0
      param.deep = 1
      // param.sjzd = this.rowData.zdxh
      // param.sjzd = this.tableDatas[this.index].zdxh
      this.tableDatas.splice(this.index + 1, 0, param)
    }
  }

  //常用诊断 中医/西医
  private setObj(val: any) {
    if (this.isUnique(val.zdxh, this.tableDatas) == -1) {
      let param = { ...NBrzdObj, ...val }
      let num = this.tableDatas.filter((item) => item.deep == 0).length
      param.webSortNumber = num + 1
      param.fbrq = formatDate(2)
      param.zdsj = formatDate(2)
      param.deep = 0
      if (this.tableDatas.length > 0) {
        param.zzbz = 0
      }
      this.tableDatas.splice(this.tableDatas.length, 0, param)
      this.index += 1
    } else {
      this.$notify({
        type: 'warning',
        title: '已有诊断',
        message: '',
      })
    }
  }

  private setObjOld(val: any) {
    if (this.index == -1 && this.tableDatas.length == 0) {
      this.newDiagnose()
      this.index = 0
      this.tableDatas[this.index].zdbw = Number(val.dv) 
    } else if (this.index == -1 && this.tableDatas.length != 0) {
      this.index = 0
      this.tableDatas[this.index].zdbw = Number(val.dv)
    } else {
      this.tableDatas[this.index].zdbw = Number(val.dv)
    }
  }

  // 西医 诊断录入
  private setObjInput(val: any) {
    if (this.isUnique(val.jbxh, this.tableDatas) == -1) {
      let param = { ...NBrzdObj }
      let num = this.tableDatas.filter((item) => item.deep == 0).length
      param.icd10 = val.icdCode
      param.zdmc = val.jbmc
      param.zdxh = val.jbxh
      param.jbpb = val.jbpb
      param.webSortNumber = num + 1
      param.fbrq = formatDate(2)
      param.zdsj = formatDate(2)
      param.deep = 0
      if (this.tableDatas.length > 0) {
        param.zzbz = 0
      }
      this.tableDatas.splice(this.tableDatas.length, 0, param)
      this.index += 1
    } else {
      this.$notify({
        type: 'warning',
        title: '已有诊断',
        message: '',
      })
    }
  }

  // 中医 诊断录入
  private setObjInputZY(val: any) {
    if (this.isUnique(val.jbbs, this.tableDatas) == -1) {
      let param = { ...NBrzdObj }
      // let num = this.tableDatas.filter((item) => item.deep == 0).length
      param.cflx = 2
      param.icd10 = val.jbdm
      param.zdmc = val.jbmc
      param.zdxh = val.jbbs
      // param.webSortNumber = num + 1
      param.fbrq = formatDate(2)
      param.zdsj = formatDate(2)
      param.deep = 0
      if (this.tableDatas.length > 0) param.zzbz = 0
      this.tableDatas.splice(this.tableDatas.length, 0, param)
      this.index += 1
    } else {
      this.$notify({
        type: 'warning',
        title: '已有诊断',
        message: '',
      })
    }
  }

  private setObjInputOld(val: any) {
    this.tableDatas[this.index].cflx = 2
    if (this.index == -1 && this.tableDatas.length == 0) {
      this.newDiagnose()
      this.index = 0
      this.tableDatas[this.index].zdbw = Number(val.zhbs)
    } else if (this.index == -1 && this.tableDatas.length != 0) {
      this.index = 0
      this.tableDatas[this.index].zdbw = Number(val.zhbs)
    } else {
      this.tableDatas[this.index].zdbw = Number(val.zhbs)
    }
  }

  private confirmFbrq(val: any) {
    if (val.row.fzbz == 2) {
      if (val.row.zdsj.substr(0, 10) === val.row.fbrq.substr(0, 10)) {
        this.$confirm(`发病日期与当前日期相同，是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
        })
          .then(() => {})
          .catch((_) => {})
      }
    } else {
      this.$nextTick(() => {
        this.nextFocus(val.$index, 6)
      })
    }
  }

  private saveDiagno() {
    this.saveFlag = true
    let patientObj = {
      brid: this.pnParam.brid,
      jzxh: this.pnParam.jzxh,
      brzdList: this.tableDatas,
      // jzlsh: this.pnParam.jzlsh
      jzlsh: this.$store.state.pnParam.PN_PARAM.jzlsh
    }

    if (this.tableDatas.length == 0) {
      this.$notify({
        type: 'warning',
        title: '当前没有需要保存的数据!',
        message: '',
      })
      this.saveFlag = false
      return
    }

    if (this.tableDatas.some((item) => item.zdxh == null || item.zdmc == '')) {
      this.$notify({
        type: 'warning',
        title: '诊断名称不能为空!',
        message: '',
      })
      this.saveFlag = false
      return
    }

    patientObj.brzdList[0].zzbz = 1
    patientObj.brzdList.forEach((item: any) => {
      item.zdbw = Number(item.zdbw)
    })
    saveMsbrzd(patientObj).then(() => [
      this.$notify({
        type: 'success',
        title: '保存成功',
        message: '',
      }),
      this.$emit('setStatus', true),
      this.getList(),
      this.saveFlag = false
      // this.$store.commit('SET_PN_PARAM',1)
    ]).catch(()=> {
      this.saveFlag = false
    })
  }

  // 清空证侯
  private clearZh(val: any) {
    val.zdbw = ''
  }

  // 切换中西医
  private changeCflx(value: any) {
    if (value.row.cflx == 1) {
      this.tableDatas[value.$index].cflx = 1
    } 
    if (value.row.cflx == 2) {
      if (this.kslb != 1) {
        this.$notify.warning('非中医科室不能输入中医诊断')
        this.tableDatas[value.$index].cflx = 1
        return
      } else {
        this.tableDatas[value.$index].jbpb = ''
        this.tableDatas[value.$index].cflx = 2
      }
    }
    this.tableDatas[value.$index].zdmc = ''
    this.tableDatas[value.$index].icd10 = ''
    this.tableDatas[value.$index].zdbw = ''
    
  }

  private nextFocusZy(scope: number, num: number) {
    if (num == 2) {
      // this.tableDatas[this.rowIndex].cflx = 2
      this.$nextTick(() => {
        ;(this.$refs[`${scope}-${num + 1}`] as any).focus()
      })
    }
  }

  private nextFocusXy(scope: number, num: number) {
    ;(this.$refs[`${scope}-${num + 1}`] as any).focus()
    if (num == 2) {
      ;(this.$refs[`${scope}-${num}`] as any).blur()
      this.$nextTick(() => {
        ;(this.$refs[`${scope}-${num + 1}`] as any).focus()
      })
    }
  }

  private nextFocus(scope: number, num: number) {
    switch (num) {
      case 1:
        this.$nextTick(() => {
          ;(this.$refs[`${scope}-${num + 1}`] as any).focus()
        })
        return
      case 2:
        // (this.$refs[`${scope}-${num}`] as any).blur()
        this.$nextTick(() => {
          // ;((this.$refs[`${scope}-${num + 2}`] as any).$refs.select as any).focus()
        })
        return
      case 3:
        ;(this.$refs[`${scope}-${num}`] as any).blur()
        this.$nextTick(() => {
          ;(this.$refs[`${scope}-${num + 1}`] as any).focus()
        })
        return
      case 4:
        // (this.$refs[`${scope}-${num}`] as any).blur()
        this.$nextTick(() => {
          // (this.$refs[`${scope}-${num + 1}`] as any).focus()
        })
        return
      case 5:
        // (this.$refs[`${scope}-${num}`] as any).blur()
        this.$nextTick(() => {
          // (this.$refs[`${scope}-${num + 1}`] as any).focus()
        })
        return
      case 6:
        if (this.tableDatas.length > 5) {
          this.$message.warning('一个诊断最多5条')
          return
        } else {
          if (this.tableDatas[scope].fzbz == 1) {
            if (this.tableDatas[scope].zdsj.substr(0, 10) === this.tableDatas[scope].fbrq.substr(0, 10)) {
              this.$confirm(`发病日期与当前日期相同，是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info',
              })
                .then(() => {
                  this.tableDatas[scope].fzbz = 2
                  // this.newDiagnose()
                })
                .catch((_) => {})
            }
          }
        }
    }
  }

  private showRight(data: number) {
    this.leftCol = data
    this.$emit('changeStyle', this.leftCol)
  }

  //行点击事件
  private tableRowClassName({ row, rowIndex }: any) {
    row.index = rowIndex
  }

  private handleRowClick(row: any) {
    this.index = row.index
  }

  //点击上下移动
  // private handleClick(direction: string) {
  //   debugger
  //   //选中数据的坐标
  //   const _index = this.index
  //   let _newIndex = -1
  //
  //
  // }

  private handleClick(sort: any) {
    const _index = this.index
    let _newIndex = -1
    if (sort === 'up') {
      if (_index > 0) {
        _newIndex = _index - 1
        let cc = this.tableDatas[_index]
        if (_index == 1) {
          cc.zzbz = 1
          this.tableDatas[_newIndex].zzbz = 0
        }
        this.tableDatas.splice(this.index, 1)
        this.tableDatas.splice(_newIndex, 0, cc)
        this.index = this.index - 1
      } else {
        this.$notify({
          title: '触到顶线了',
          message: '',
          type: 'warning',
        })
      }
    } else if (sort == 'down') {
      if (_index < this.tableDatas.length - 1) {
        _newIndex = _index + 1

        let cc = this.tableDatas[_newIndex]
        if (_index == 0) {
          cc.zzbz = 1
          this.tableDatas[_index].zzbz = 0
        }

        this.tableDatas.splice(_newIndex, 1)
        this.tableDatas.splice(_index, 0, cc)
        this.index = this.index + 1
      } else {
        this.$notify({
          title: '触到底线了',
          message: '',
          type: 'warning',
        })
      }
    }
  }

  /**
   * @Description: 诊断名称获取诊断编码
   * @author: zhml
   * @param {type}:
   * @return:
   * @date 2020/7/10
   */
  private setData(value: any) {
    if (this.sumList(value.jbxh, this.tableDatas) && this.sumList(value.jbxh, this.tableDatas).length < 1) {
      if (value.icdCode == null || value.icdCode == '' || value.icdCode == 0) return
      this.tableDatas[this.index].zdxh = value.jbxh
      this.tableDatas[this.index].icd10 = value.icdCode
      this.tableDatas[this.index].jbpb = value.jbpb
      ;(this.$refs[`${this.index}-2`] as any).blur()
      this.$nextTick(() => {
        ;(this.$refs[`${this.index}-3`] as any).focus()
      })
    } else {
      this.tableDatas.splice(this.index, 1)
      this.$notify({
        type: 'warning',
        title: '已有诊断',
        message: '',
      })
    }
  }

  private setDataZ(value: any) {
    if (this.sumList(value.jbbs, this.tableDatas) && this.sumList(value.jbbs, this.tableDatas).length < 1) {
      if (value.jbdm == null || value.jbdm == '' || value.jbdm == 0) return
      this.tableDatas[this.index].zdxh = value.jbbs
      this.tableDatas[this.index].icd10 = value.jbdm
      ;(this.$refs[`${this.index}-2`] as any).blur()
      this.$nextTick(() => {
        ;(this.$refs[`${this.index}-3`] as any).focus()
      })
    } else {
      this.tableDatas.splice(this.index, 1)
      this.$notify({
        type: 'warning',
        title: '已有诊断',
        message: '',
      })
    }
  }

  // 部位
  private setDataZdbw(value: any) {
    
    let cc = this.zyzdList.find((item: any) => item.dv == value.dv)
    // setTimeout(() => {}, 500)
    this.tableDatas[this.index].zdbw = Number(cc.dn) 
  }

  // 证侯
  private setDataZbw(value: any) {
    this.tableDatas[this.index].zdbw = value.zhbs
  }


  private setDataZY(value: any) {
    let cc = this.zyzdList.find((item: any) => item.dv == value.dv)
    // setTimeout(() => {}, 500)
    if (this.sumList(value.dv, this.tableDatas) && this.sumList(value.dv, this.tableDatas).length == 1) {
      // if (value.wb == null || value.wb == '' || value.wb == 0) return
      this.tableDatas[this.index].zdxh = cc.dv
      this.tableDatas[this.index].icd10 = cc.jbdm
      this.tableDatas[this.index].zdmc = cc.dn
      this.tableDatas[this.index].cflx = 2
    } else {
      this.tableDatas.splice(this.index, 1)
      this.$notify.warning('已有诊断')
    }
    // let cc = this.zyzdList.find((item: any) => item.dv == value)
    // setTimeout(()=>{},500)
    // if (this.sumList(value, this.tableDatas) && this.sumList(value, this.tableDatas).length == 1) {
    //
    //   // if (value.wb == null || value.wb == '' || value.wb == 0) return
    //   this.tableDatas[this.index].zdxh = cc.dv
    //   this.tableDatas[this.index].icd10 = cc.wb
    //   this.tableDatas[this.index].zdmc = cc.dn
    //   this.tableDatas[this.index].cflx = '2'
    // } else {
    //   this.tableDatas.splice(this.index, 1)
    //   this.$notify.warning('已有诊断')
    // }
  }

  /**
   * @Description: 删除
   * @author: zhml
   * @param {type}:
   * @return:
   * @date 2020/7/14
   */
  private handleDelete() {
    if (this.index == -1) {
      this.$notify({
        type: 'warning',
        title: '请先选中一条诊断删除',
        message: '',
      })
    } else if (this.index > -1 && !this.tableDatas[this.index].jzxh) {
      this.tableDatas.splice(this.index, 1)
      this.index = this.index - 1
    } else {
      this.$confirm(
        `确定删除记录[${this.tableDatas[this.index].zdmc}]?
                  `,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
        }
      ).then(() => {
        deleteMsbrzd({ jlbh: this.tableDatas[this.index].jlbh }).then(() => {
          this.$notify({
            type: 'success',
            title: '已删除',
            message: '',
          })
          this.tableDatas.splice(this.index, 1)
          this.getList()
        })
      })
    }
  }

  // 部位拼音码搜索
  private remoteMethod(query: string) {
    if(query != '') {
      let res:Array<any> = []
      let arr:Array<any> = deepCopy(this.bodyList)
      this.options = []
      setTimeout(() => {
        this.options = findKeys(query.toUpperCase(),arr,['dn','py'])
      },200)
    } else {
      this.options = deepCopy([...this.bodyList])
    }
  }

  // 疾病判别字典转换
  private transer(jbpb: string | null) {
    if (jbpb != null) {
      let jbpbName: Array<any> = []
      jbpb.split(',').forEach((el: any) => {
        let name = this.jbpbList.find((item: any) => item.dv == el) && this.jbpbList.find((item: any) => item.dv == el).dn
        jbpbName.push(name)
      })
      return jbpbName.join(',')
    }
  }
}
</script>

<style lang="scss" scoped>
.his-patient-diagnosis {
  .his-small {
    padding: 0 10px;

    .btn {
      justify-content: start !important;
      height: 36px;
      display: flex;
      align-items: center;
    }
  }
}

.w100 {
  width: 100%;
  height: 24px;
}

::v-deep .search-select {
  width: 100%;
  margin-right: 0;
  line-height: 28px;
}

.el-tabs__header {
  border-bottom: none !important;
}

.his-module {
  margin-right: 0 !important;
}

.pr10 {
  padding-right: 10px;
}

.el-table {
  position: none !important;

  .cell {
    padding: 0 !important;
  }
}

.el-col-1 {
  width: 2.1666666667%;
}

.el-col-23 {
  width: 97.8333333333%;
}

.el-col-8 {
  width: 25%;
}

.el-col-16 {
  width: 75%;
}

.his-change-top {
  position: relative;
  top: -50px;
  z-index: 1;
  height: calc(100% + 50px);
}

.content .his-module .el-table::before,
.content .his-module .el-table--group::after,
.content .his-module .el-table--border::after {
  display: none !important;
}

@import '@/styles/inputTable.scss';

::v-deep .color-group {
  div.cell {
    padding: 0 !important;

    .search-select {
      width: 100%;
      height: 28px !important;
      line-height: 28px;

      .el-select {
        .el-input {
          position: relative;
          top: -1px;
          .el-input__inner {
            height: 28px !important;
          }
        }
      }
    }
  }
}
</style>
