<template>
  <div class="content ht">
    <div class="his-module his-small">
      <div slot="header" class="row headerScreen queue">
        <div class="label">
          <h1 class="title">{{ $t('queueNumber.title') }}</h1>
          <el-divider direction="vertical"></el-divider>
          <div class="searchTitle">患者卡号</div>
          <div>
            <el-input prefix="ios-search" v-model="searchData.brxm" class="form-input" @keydown.enter.native="getList" :placeholder="$t('queueNumber.inputHolder')">
              <i slot="prefix" class="el-input__icon icon his-search"></i>
            </el-input>
          </div>
          <div class="searchTitle ml10">就诊日期</div>
          <div>
            <el-date-picker v-model="searchData.ghsj" type="date" placeholder="选择日期" class="form-input date-wrapper"></el-date-picker>
          </div>
          <el-divider direction="vertical" v-if="isShow"></el-divider>
          <el-checkbox v-if="isShow" v-model="isRefresh">{{ $t('queueNumber.chebox4') }}</el-checkbox>
        </div>
        <el-button v-if="isShow" type="primary" class="blue-gra his-small" @click="handleQuery" icon="icon his-refresh" v-preventReClick>{{ $t('common.refresh') }}</el-button>
        <el-button v-if="!isShow" type="primary" class="blue-gra his-small" @click="handleQuery" icon="icon his-refresh" v-preventReClick>{{ $t('common.search') }}</el-button>
      </div>
      <el-table :height="listSlotHeight" ref="dragTable" :data="tableFormat" :row-class-name="tableRowClassName" @row-click="handleClick" stripe border>
        <el-table-column prop="jzzt" :label="$t('queueNumber.statusName')" width="100">
          <template slot-scope="props">
            <div v-if="props.row.jzzt == '0'" style="color: #ffbf00;">{{ props.row.jzztName }}</div>
            <div v-if="props.row.jzzt == '1'" style="color: #0fcaad;">{{ props.row.jzztName }}</div>
            <div v-if="props.row.jzzt == '2'" style="color: #f95776;">{{ props.row.jzztName }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="ghksName" min-width="90" :label="$t('queueNumber.deptName')"></el-table-column>
        <el-table-column prop="ghysName" min-width="90" :label="$t('挂号医生')"></el-table-column>
        <el-table-column prop="ghsj" min-width="150" :label="$t('挂号时间')">
          <template slot-scope="props">
            <span> {{ props.row.ghsj.substr(0, 19) }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="sddm" :label="$t('queueNumber.shiftName')" width="80">
          <template slot-scope="props">
            <span> {{ props.row.sddm | filterSddm }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" :label="$t('病人分级')" width="80"> </el-table-column>
        <el-table-column prop="pdxh" :label="$t('queueNumber.serailNo')" width="56"></el-table-column>
        <el-table-column prop="brxm" :label="$t('queueNumber.patName')" width="90"></el-table-column>
        <el-table-column prop="csrq" :label="$t('出生日期')" width="90"></el-table-column>
        <el-table-column prop="nl" :label="$t('queueNumber.ageYear')" width="56"></el-table-column>
        <el-table-column prop="xbName" :label="$t('queueNumber.sexName')" width="56"></el-table-column>
        <el-table-column prop="sfxzName" :label="$t('queueNumber.chargeName')" width="100"></el-table-column>
        <el-table-column prop="zdysName" :label="$t('queueNumber.doctorName')" min-width="100"></el-table-column>
        <el-table-column prop="dhsj" :label="$t('queueNumber.waitMin')" width="180"></el-table-column>
        <el-table-column prop="brlx" :label="$t('queueNumber.patFlag')" width="120">
          <template slot-scope="props">
            <div v-if="props.row.brlx == -1" class="guo">
              <i :size="14" class="icon his-ignore"></i>
            </div>
            <div v-if="props.row.brlx == 1" class="yu">
              <i :size="14" class="icon his-reserve"></i>
            </div>
            <div v-if="props.row.brlx == ''">/</div>
          </template>
        </el-table-column>
        <el-table-column prop="action" :label="$t('queueNumber.action')" width="120" v-if="!isShow" fixed="right">
          <template slot-scope="props">
            <div class="aciton-button">
              <!-- <el-tooltip class="ml10" hideIcon content="上移" v-if="props.row.jzzt == 0">
                <el-button class="green" @click="upper(props.row, props.$index)">
                  <i :size="14" class="icon blue his-jiantou_shang-28"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="ml10" hideIcon content="下移" v-if="props.row.jzzt == 0">
                <el-button class="green" @click="lower(props.row, props.$index)">
                  <i :size="14" class="icon blue his-jiantou_xia"></i>
                </el-button>
              </el-tooltip> -->
              <el-tooltip class="ml10" hideIcon content="个人档案">
                <el-button class="green" @click="trunDetail(props.row)">
                  <i :size="14" class="icon blue his-basic-info"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip v-if="props.row.jzzt == '0'" class="ml10" hideIcon content="叫号">
                <el-button class="green" @click="modQueueStatusOk(props.row, 1)">
                  <i :size="14" class="icon his-turn"></i>
                </el-button>
              </el-tooltip>

              <el-tooltip v-if="props.row.jzzt == '0'" class="ml10" hideIcon content="指定医生">
                <el-button class="blue" @click="findDoctorFun(props.row)">
                  <i :size="14" class="icon his-specified"></i>
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="docVisiable" title="指定医生" class="screenMod" v-if="docVisiable" :before-close="handleClose" :close-on-press-escape="false" destroy-on-close >
      <div slot="footer">
        <el-button class="ml10" @click="handleClose">取消</el-button>
        <el-button class="ml10" v-if="isCalled" @click="docVisiableOk('call')">确定</el-button>
        <el-button class="ml10" v-if="!isCalled" @click="docVisiableOk('choose')">确定</el-button>
      </div>
      <div>
        <el-form ref="docValidate" :model="docForm" :rules="docRules" label-width="180px">
          <el-form-item label="指定医生" prop="ysdm">
            <el-select v-model="docForm.ysdm" style="width: 200px;">
              <el-option v-for="item in workedList" :value="item.personid" :label="item.personname" :key="item.personid"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 病人档案 -->
    <add-patient :patientInfo="curRow" ref="add-patient" />
  </div>
</template>
<script lang="ts">
import { Component, Watch, Vue, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import addPatient from '@/components/addPatient/index.vue'
import { queryList, queryDoctorList, chooseDoctor, queryPatient, callDoctor } from '@/api/his/op/guidance/queueNumber'
import { queryBcList } from '@/api/his/op/guidance/shift/shift'
import { id2Name } from '@/utils'
import { dictExecuteSql } from '@/websql/functions'
import expandRow from '../components/table-expand.vue'
import { getNow } from '@/api/his/basic'
import { parseTime } from '@/utils'

@Component({
  name: 'queueNumber',
  //组件引用
  components: {
    expandRow,
    addPatient,
  },
  filters: {
    filterSddm(val: any) {
      if (val == 1) {
        return '上午'
      } else if (val == 2) {
        return '下午'
      }
    },
  },
})
export default class extends Vue {
  @Prop({ required: false, default: false }) private isShow!: boolean
  private listSlotHeight: number = 0
  private searchData: any = {
    jhtdm: Vue.prototype.AUTHORITY.bussinessRole,
    ghsj: '',
    brxm: '',
  }
  private deptList: Array<any> = [] // 科室列表
  private sexList: Array<any> = [] // 性别列表
  private statusList: Array<any> = [] // 待诊状态
  private doctorList: Array<any> = [] // 指定医生列表
  private serviceList: Array<any> = [] // 服务台列表
  private callbackFlag: boolean = false // 是否返回数据标记
  private isRefresh: boolean = false // 是否自动刷新
  private docVisiable: boolean = false // 医生列表弹窗
  private tabledata: object[] = [] // 表格数据
  private clearTimeSet: any = '' // 定时器
  private bcList: any[] = [] //班次列表
  private sfxzList: any[] = [] //班次列表
  private workedList: any[] = [] //在线医生列表
  private obj: any = {} //在线医生列表
  private isCalled: boolean = false
  private hjList: any[] = []
  private sfzList: any[] = [] //身份证类别
  private list: any[] = []
  private curRow: any = {}
  private rowIndex: number = -1

  private docForm: any = {
    ysdm: '',
  } // 医生列表
  private pageProps: object = {
    'show-elevator': true,
    'show-sizer': true,
    // 'show-total':true
  }
  private currRowData: any = {}
  private validateDoc = (rule: any, value: any, callback: any) => {
    if (this.docForm.ysdm === '') {
      callback(new Error('请选择指定医生'))
    } else {
      callback()
    }
  }
  private docRules: any = {
    // 表单校验
    // ysdm: [{ required: true, validator: this.validateDoc, trigger: 'blur' }],
    ysdm: [{ required: true, message: '请选择指定医生', trigger: 'change' }],
  }

  get tableFormat() {
    const tableData = this.tabledata
    id2Name(tableData, 'ghks', 'ghksName', this.deptList, 'dv', 'dn') // 科室
    id2Name(tableData, 'ghys', 'ghysName', this.doctorList, 'dv', 'dn') // 挂号医生
    // id2Name(tableData, 'sddm', 'sddmName', this.bcList, 'sddm', 'sdmc') // 班次
    id2Name(tableData, 'xb', 'xbName', this.sexList, 'dv', 'dn') // 性别
    id2Name(tableData, 'jzzt', 'jzztName', this.statusList, 'dv', 'dn') // 待诊状态
    id2Name(tableData, 'sfxz', 'sfxzName', this.sfxzList, 'dv', 'dn') // 收费性质
    id2Name(tableData, 'zdys', 'zdysName', this.doctorList, 'dv', 'dn') // 指定医生
    return tableData
  }

  getSddm(val: any) {
    let cc = this.bcList.find((item: any) => item.sddm == val)
    return cc ? cc.sdmc : ''
  }

  private tableRowClassName({ row, rowIndex }: any) {
    row.index = rowIndex
  }

  private handleClick(row: any) {
    this.rowIndex = row.index
  }

  private handleClose() {
    this.docVisiable = false
    this.docForm = {}
  }
  //数据监控
  @Watch('tabledata', { immediate: true })
  private onTabledataChange(val: string) {
    this.callbackFlag = false
  }
  @Watch('isRefresh', { immediate: true })
  private onIsRefreshChange(val: boolean) {
    if (val) {
      this.setTime()
      console.log('启动自动刷新')
    }
    if (!val) {
      this.clearTime()
      console.log('关闭自动刷新')
    }
  }
  //钩子函数
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 130
  }
  //钩子函数
  mounted() {
    getNow().then((res: any) => {
      let date = parseTime(res.data)
      this.searchData.ghsj = date
    })
    this.statusList = this.$store.state.webSqlDict.JZZT_DICT
    this.deptList = this.$store.state.webSqlDict.REGISTERATION_DEPARTMENT_DICT
    this.doctorList = this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.sexList = this.$store.state.webSqlDict.SEX_DICT
    this.sfxzList = this.$store.state.webSqlDict.COST_CONSOLIDATION
    this.sfzList = this.$store.state.webSqlDict.IDCARD_DICT
    this.hjList = this.$store.state.webSqlDict.HJTYPE_DICT
    this.getList()
  }

  private upper(val: any, index: number) {
    const cc: any = this.tabledata[index]
    let list: any[] = this.tabledata.filter((item: any) => {
      if (item.jzzt == 0 && item.ghks == cc.ghks && item.sddm == cc.sddm) {
        return item
      }
    })
    console.log('list', list, val, index)
    if (val.oid == list[0].oid) {
      this.$notify.warning('待诊状态，同科室，同班次的移动不符合规则')
    } else {
      // FIXME:
    }
  }

  private lower(val: any, index: number) {}

  private trunDetail(value: any) {
    this.curRow = value
    var a: any = this.$refs['add-patient']
    a.addDialog(value.brkh)
  }

  // 设置定时器 定时刷新
  private setTime() {
    this.clearTimeSet = setInterval(() => {
      this.getList()
    }, 1000 * 60 * 1)
  }
  // 关闭定时器
  private clearTime() {
    clearInterval(this.clearTimeSet)
  }

  // 指定医生
  private findDoctorFun(data: any) {
    this.docVisiable = true
    this.isCalled = false
    this.getDoctorWorked(data)
    // findDoctorList({ outpQueueId: data.outpQueueId }).then((res: any) => {
    //   this.doctorList = res.data
    //   this.docForm.doctorId = ''
    //   this.docVisiable = true
    // })
  }
  // 指定医生确定
  private docVisiableOk(val: string) {
    ;(this.$refs.docValidate as Form).validate((valid: any) => {
      if (valid) {
        if (val == 'call') {
          callDoctor(this.docForm).then((res: any) => {
            this.$notify.success('已指定医生')
            this.docVisiable = false
            this.$nextTick(() => {
              this.handleQuery()
            })
          })
        } else if (val == 'choose') {
          chooseDoctor(this.docForm).then((res: any) => {
            this.$notify.success('已指定医生')
            this.docVisiable = false
          })
        }
      }
    })
  }

  // 叫号
  private modQueueStatusOk(data: any, status: number) {
    this.docVisiable = true
    this.isCalled = true
    this.getDoctorWorked(data)
  }

  private getDoctorWorked(value: any) {
    this.docForm.oid = value.oid
    this.docForm.lsh = value.jzlsh
    queryDoctorList({ ksid: value.ghks }).then((res: any) => {
      this.workedList = res.data
    })
  }

  // 按钮取消
  private cancel() {}

  // 从头获取
  private getList() {
    queryBcList({}).then((res: any) => {
      this.bcList = res.data
      queryList(this.searchData).then((response: any) => {
        this.tabledata = response.data
      })
    })
  }

  // 点击查询
  private handleQuery() {
    if (this.searchData.ghsj) {
      this.searchData.ghsj = parseTime(this.searchData.ghsj, '{y}-{m}-{d} {h}:{i}:{s}')
    }

    queryList(this.searchData).then((response: any) => {
      this.tabledata = response.data
    })
  }
}
</script>
<style lang="scss" scoped>
.btnCss {
  margin-left: 8px;
}

.headerScreen {
  display: flex;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f5f6f8;
}

.screenMod {
  .ivu-modal-header {
    padding: 10px 60px !important;
    border: 0 !important;
  }
}

.his-ignore {
  color: rgba(255, 191, 0, 1);
  border: 1px solid rgba(255, 191, 0, 1);
  background: rgba(255, 191, 0, 0.1);
  border-radius: 50%;
  padding: 2px;
}

.his-reserve {
  color: rgba(15, 202, 173, 1);
  border: 1px solid rgba(15, 202, 173, 1);
  background: rgba(15, 202, 173, 0.1);
  border-radius: 50%;
  padding: 2px;
}

.el-checkbox:nth-of-type(1) .el-checkbox__input.is-checked .el-checkbox__inner {
  border-color: #ffbf00;
  background: #ffbf00;
}

.el-checkbox:nth-of-type(2) .el-checkbox__input.is-checked .el-checkbox__inner {
  border-color: $green;
  background: $green;
}

.el-checkbox:nth-of-type(3) .el-checkbox__input.is-checked .el-checkbox__inner {
  border-color: $red;
  background: $red;
}

.row .label .tag {
  padding-right: 0px;
}

.search-select {
  width: 150px;
}
.aciton-button {
  display: flex;
}
::v-deep .queue {
  .label {
    // display: flex;
    // flex-flow: row nowrap;
    // justify-content: start;
    // align-items: center;
    .el-input {
      // height: 30px;
      // line-height: 30px;
      // background: #f5f6f8;
      width: 200px !important;
      .el-input__inner {
        @extend .el-input;
        width: 200px !important;
      }
      // .el-input--medium {
      //   @extend .el-input;
      //   .el-input__inner {
      //     @extend .el-input;
      //     width: 200px !important;
      //   }
      // }
    }
  }
}
</style>
