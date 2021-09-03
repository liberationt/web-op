<!--
 * @Date: 2020-05-31 11:24:44
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-14 16:40:31
 * @description: 医技项目预约
-->
<template>
  <div class="module his-project">
    <div>
      <div slot="header">
        <div class="row">
          <div class="label">
            <div class="btn" style="margin-right: 6px">
              <el-button size="mini" type="primary" @click="handleAppoint"> <i class="icon his-caozuo_yuyue white"></i><span class="white">预约</span></el-button>
            </div>
            <el-select v-model="inspectType" placeholder="请选择住院/门诊/检验号码">
              <el-option v-for="item in options" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="form-wrap scroll-bar" style="overflow: auto">
        <el-form :key="key" :model="ruleForm" ref="ruleFormRef" :rules="rules" label-width="60px">
          <!-- 住院号码 -->
          <el-form-item :label="'住院号码'" prop="zyhm" v-if="inspectType == 1" style="width: 100%">
            <el-input type="number" v-model="ruleForm.zyhm" @keyup.enter.native="queryPatientInfo(2, ruleForm.zyhm)" placeholder="请输入..."></el-input>
          </el-form-item>
          <!-- 门诊号码 -->
          <el-form-item :label="'就诊卡号'" prop="ghgl" v-if="inspectType == 2" style="width: 100%">
            <div class="jzkh-card">
              <el-input v-model="ruleForm.ghgl" placeholder="请输入..." @keyup.enter.native="queryPatientInfo(1, ruleForm.ghgl)"></el-input>
              <el-button type="primary" class="read-card" size="mini" icon="icon his-reading-card">读卡</el-button>
            </div>
          </el-form-item>
          <el-form-item :label="'体检号码'" prop="tjhm" v-if="inspectType == 3" style="width: 100%">
            <el-input type="number" v-model="ruleForm.tjhm" placeholder="请输入..."></el-input>
          </el-form-item>
          <el-form-item :label="'患者姓名'" prop="brxm" style="width: 100%">
            <el-input v-model="ruleForm.brxm" placeholder="请输入..."></el-input>
          </el-form-item>
          <el-form-item :label="'检查项目'" prop="jcxm" style="width: 100%">
            <el-input v-model="ruleForm.jcxm" placeholder="请输入..." disabled></el-input>
          </el-form-item>
          <el-form-item style="display: none"></el-form-item>
          <el-form-item :label="'检查部位'" prop="jcbw">
            <el-input v-model="ruleForm.jcbw" placeholder="请输入..." disabled></el-input>
          </el-form-item>
          <el-form-item :label="'患者设备'" prop="hzsb">
            <el-select v-model="ruleForm.hzsb" @change="selectSBMC">
              <el-option v-for="item in hzsbList" :key="item.dv" :label="item.dn" :value="item.dv"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="'预约日期'" prop="yyrq">
            <el-date-picker type="date" placeholder="选择日期" :picker-options="pickerOptions" v-model="ruleForm.date1" style="width: 100%" class="date-wrapper" clearable @change="(val) => checkoutDate(val,ruleForm.hzsb)" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item :label="'预约时间'" prop="yysj">
            <el-input v-model="ruleForm.yysj" :key="key" clearable @focus="openYysjDialog"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-divider></el-divider>
    <el-table ref="table" :data="tableDatas" :height="listSlotHeight * 0.7 - 260" class="no-underline scroll-bar" stripe fit border @row-click="handleRowClick" :highlight-current-row="true">
      <!-- 序号 -->
      <el-table-column type="index" width="32"></el-table-column>
      <!-- 申请日期 -->
      <el-table-column prop="sqrq" :show-overflow-tooltip="true" :label="'申请日期'" min-width="80" />
      <!-- 来源 -->
      <el-table-column prop="bq" :label="'来源'" min-width="80" />
      <!-- 姓名 -->
      <el-table-column prop="brxm" :label="'姓名'" min-width="80" />
      <!-- 检查项目 -->
      <el-table-column prop="jcxm" :show-overflow-tooltip="true" :label="'检查项目'" min-width="80" />
      <!-- 检查费用 -->
      <el-table-column prop="jcfy" :label="'检查费用'" min-width="80" class-name="text-blue-td"/>
    </el-table>
    <el-dialog top="5vh" :visible.sync="showDetail" :cancel-text="$t('common.close')" width="1000px" :before-close="handleCancle" v-elDraggableDialog :close-on-click-modal="false" :destroy-on-close="true">
      <div slot="title" class="dialog__body">
        <div class="top1">
          <div class="label">
            <div class="title">预约时间</div>
            <div class="note">(双击选择)</div>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div class="btn">
            <el-button size="mini" type="text">
              <i class="icon his-btn-refresh green"></i>
              {{ $t('common.refresh') }}
            </el-button>
          </div>
        </div>
      </div>
      <appoint-data ref="refForm" :time-list="timeList" :currentDate="ruleForm.date1" :jclx="this.ruleForm.jclx" @getTime="getTime" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import appointData from './appointData.vue'
import { saveSqdFromMZorZY, loadPatientInfo, loadSqdDetailInfo, queryRecentTimeByHyrq, queryYysjView, freezeSBHH, checkHyid, unfreezeSBHH } from '@/api/cis/op/dctwork/medTechAppoint.ts'
//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'ProjectAppoint',
  components: { appointData },
})
export default class extends Vue {
  private ruleForm: any = {
    brxm: '',
    brid: '',
    jcbw: '',
    jcfy: '',
    jclx: '',
    jcxh: '',
    jcxm: '',
    sqrq: '',
    hzsb: '',
    yyrq: '',
    yysj: '',
    date1: '',
  }
  private rules: any = {}
  private showDetail: boolean = false
  private dataList: any[] = []
  private tableDatas: any[] = []
  private listSlotHeight: number = 0
  private jklx: number = 0
  private timeList: any[] = []
  private key: number = 0
  private hyid: number | null = null
  private inspectType: number = 2
  private options: Array<any> = [
    {
      id: 2,
      value: '门诊',
    },
    {
      id: 1,
      value: '住院',
    },
    {
      id: 3,
      value: '体检',
    },
  ]
  private hzsbList: Array<any> = [] // 患者设备
  private pickerOptions: any = {
    disabledDate(time: any) {
      return time.getTime() < Date.now() //如果没有后面的-8.64e6是不可以选择当天的
    }
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }

  mounted() {
    this.hzsbList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.JCSB_DICT : this.$store.state.webSqlDict.JCSB_DICT
  }
  private formData: any = {
    brxm: '',
    hyid: <number>0,
    jcbw: '',
    jcxh: '',
    jcxm: '',
    mzhm: <number>0,
    sbmc: '',
    tjhm: '',
    yyrq: '',
    yysj: '',
    zyhm: <number>0,
  }

  // 预约弹窗
   private async handleAppoint() {
    if (!this.ruleForm.date1 || !this.ruleForm.yysj) {
      this.$notify({
        title: '请先选择预约日期和时间',
        message: '',
        type: 'warning',
      })
      return
    }
    console.log(this.ruleForm)
    const data = {
      brxm: this.ruleForm.brxm,
      hyid: this.hyid,
      jcbw: this.ruleForm.jcbw,
      jcxh: this.ruleForm.jcxh,
      jcxm: this.ruleForm.jcxm,
      mzhm: this.ruleForm.ghgl,
      sbmc: this.ruleForm.hzsb,
      yyrq: this.ruleForm.date1,
      yysj: this.ruleForm.yysj,
      zyhm: this.ruleForm.zyhm,
    }
    await saveSqdFromMZorZY(data).then((res1: any) => {
      this.$notify({
        type: 'success',
        title: '预约成功',
        message: '',
      })
      this.$emit('getAppointList')
    })
    //原有逻辑
    // if (!this.ruleForm.ghgl && this.ruleForm.ghgl != 0) return
    if (!this.ruleForm.ghgl && this.ruleForm.ghgl != 0){
      this.queryPatientInfo(2,this.ruleForm.zyhm)
      return
    }
    // 先判断申请检查项目的数量，若大于零则执行
    await loadPatientInfo({ searchType: 1, searchValue: this.ruleForm.ghgl}).then((res2: any) => {
      this.tableDatas.splice(0,this.tableDatas.length)
      if(res2.data && res2.data.length > 0) {
        res2.data.forEach((el: any) => {
          this.tableDatas.push(el)
        })
        ;(this.$refs.table as any).setCurrentRow(res2.data[0])
        this.ruleForm.brxm = res2.data[0].brxm
        this.ruleForm.brid = res2.data[0].brid
        this.ruleForm.jcbw = res2.data[0].jcbw
        this.ruleForm.jcfy = res2.data[0].jcfy
        this.ruleForm.jclx = res2.data[0].jclx
        this.ruleForm.jcxh = res2.data[0].jcxh
        this.ruleForm.jcxm = res2.data[0].jcxm
        this.ruleForm.sqrq = res2.data[0].sqrq
        this.ruleForm.hzsb = res2.data[0].jclx
        this.ruleForm.date1 = res2.data[0].yyrq
        this.ruleForm.yysj = res2.data[0].yysj
        this.jklx = res2.data[0].jclx
      } else {
        // this.$nextTick(()=> {
        //   const el: any = this.$refs.ruleFormRef
        //   el.resetFields()
        // })
        this.ruleForm.ghgl = null
        this.ruleForm.brxm = null
        this.ruleForm.jcxm = null
        this.ruleForm.jcbw = null
        this.ruleForm.hzsb = null
        this.ruleForm.date1 = null
        this.ruleForm.yysj = null
        this.$emit('getDetailInfo', [])
      }
    })
    console.log('209',this.tableDatas,this.tableDatas.length)
    // 若列表不存在数据时，则不调用查询项目详情接口
    if(this.tableDatas.length == 0) return

    const params: any = {
      type: this.tableDatas[0].jclx,
      jcxh: this.tableDatas[0].jcxh
    }
    // 获取第一条项目详情数据
    await loadSqdDetailInfo(params).then((res3: any) => {
      this.$emit('getDetailInfo', res3.data)
    })
  }

  private handleCancle() {
    this.showDetail = false
  }

  private openYysjDialog() {
    if (!this.ruleForm.date1) {
      this.$notify({
        title: '请先选择预约日期',
        message: '',
        type: 'warning',
      })
      return
    }
    queryYysjView({ hyrq: this.ruleForm.date1, jclx: this.ruleForm.jclx }).then((res: any) => {
      this.timeList = res.data
      this.showDetail = true
    })
  }
  private checkoutDate(val: any, jklx: string) {
    console.log(val,jklx)
    if (!this.ruleForm.brid) {
      this.$notify({
        title: '请先选择医技项目',
        message: '',
        type: 'warning',
      })
      this.ruleForm.date1 = ''
      this.ruleForm.yysj = ''
      return
    }
    this.unfreeeSBBHCheck()
    queryRecentTimeByHyrq({ hyrq: val, jklx: jklx })
      .then((res: any) => {
        if (res.data && res.data.length != 0) {
          this.ruleForm.yysj = res.data[0].hysj
          this.hyid = res.data[0].hyid
          freezeSBHH({ hyid: res.data[0].hyid }).then(() => {})
          this.key++
        } else {
          this.$notify({
            title: `${val}没有预约号源`,
            message: '',
            type: 'info',
          })
          this.ruleForm.date1 = ''
          this.ruleForm.yysj = ''
          this.key++
        }
      })
      .catch((res: any) => {
        this.ruleForm.date1 = ''
      })
  }

  private handleRowClick(row: any) {
    this.ruleForm.brxm = row.brxm
    this.ruleForm.brid = row.brid
    this.ruleForm.jcbw = row.jcbw
    this.ruleForm.jcfy = row.jcfy
    this.ruleForm.jclx = row.jclx
    this.ruleForm.jcxh = row.jcxh
    this.ruleForm.jcxm = row.jcxm
    this.ruleForm.sqrq = row.sqrq
    this.ruleForm.hzsb = row.jclx
    this.ruleForm.date1 = row.yyrq
    this.ruleForm.yysj = row.yysj
    this.jklx = row.jclx
    loadSqdDetailInfo({ type: row.jclx, jcxh: row.jcxh }).then((res: any) => {
      this.$emit('getDetailInfo', res.data)
    })
    this.key++
  }

  // 查询预约表单数据与第一条预约数据的详情数据
  private queryPatientInfo(type: number, value: number) {
    if (!value && value != 0) return
    loadPatientInfo({ searchType: type, searchValue: value }).then((res: any) => {
      this.tableDatas = res.data
      if (res.data.length > 0 && res.data[0].jcxh) {
        ;(this.$refs.table as any).setCurrentRow(res.data[0])
        this.ruleForm.brxm = res.data[0].brxm
        this.ruleForm.brid = res.data[0].brid
        this.ruleForm.jcbw = res.data[0].jcbw
        this.ruleForm.jcfy = res.data[0].jcfy
        this.ruleForm.jclx = res.data[0].jclx
        this.ruleForm.jcxh = res.data[0].jcxh
        this.ruleForm.jcxm = res.data[0].jcxm
        this.ruleForm.sqrq = res.data[0].sqrq
        this.ruleForm.hzsb = res.data[0].jclx
        this.ruleForm.date1 = res.data[0].yyrq
        this.ruleForm.yysj = res.data[0].yysj
        this.jklx = res.data[0].jclx
        loadSqdDetailInfo({ type: res.data[0].jclx, jcxh: res.data[0].jcxh }).then((res1: any) => {
          this.$emit('getDetailInfo', res1.data)
        })
      } else {
        this.$emit('getDetailInfo', [])
        this.ruleForm = {}
        if (type == 1) {
          this.$notify({
            title: `门诊号码${value}未缴费或未预约`,
            message: '',
            type: 'info',
          })
        } else if (type == 2) {
          this.$notify({
            title: `住院号码${value}未预约`,
            message: '',
            type: 'info',
          })
        } else if (type == 3) {
          this.$notify({
            title: `体检号码${value}未缴费或未预约`,
            message: '',
            type: 'info',
          })
        }
      }
    })
  }

  private getTime(item: any) {
    this.unfreeeSBBHCheck()
    this.ruleForm.yysj = item.hysj
    this.hyid = item.hyid
    freezeSBHH({ hyid: item.hyid }).then(() => {})
    this.key++
    this.showDetail = false
  }

  private selectSBMC(val: string) {
    console.log(val)
    if (!this.ruleForm.date1) {
      this.$notify({
        title: '请先选择预约日期',
        message: '',
        type: 'warning',
      })
      return
    }
    if (!this.ruleForm.brid) {
      this.ruleForm.hzsb = ''
      this.$notify({
        title: '请先选择项目',
        message: '',
        type: 'warning',
      })
      return
    }
    this.checkoutDate(this.ruleForm.date1, val)
  }

  private unfreeeSBBHCheck() {
    if (this.hyid) {
      checkHyid({ hyid: this.hyid }).then((res: any) => {
        if (res.data) {
          unfreezeSBHH({ hyid: this.hyid })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.his-project {
  height: 100%;
  .el-form-item {
    margin-bottom: 8px !important;
  }
  ::v-deep .el-form-item__label {
    padding: 0 4px 0 0;
  }
  .form-wrap {
    padding: 0 !important;
  }
  ::v-deep .el-input--medium {
    height: 28px;
    line-height: 28px;
    background: #f5f6f8;
    .el-input__inner {
      @extend .el-input--medium;
    }
  }
  .btn .white{
    color:#fff;
  }
  .top1 {
    display: flex;
    align-items: center;
    .label {
      display: flex;
      flex-flow: nowrap;
      .title {
        color: $first;
        font-size: 16px;
        white-space: nowrap;
        font-family: siyuanMedium;
        font-weight: 500;
      }
      .note {
        font-size: 13px;
        color: #6a6d78;
      }
    }
  }
  ::v-deep .el-dialog .el-dialog__header {
    padding: 0 16px;
    border-bottom: none;
  }
  ::v-deep .el-dialog .el-dialog__body {
    padding: 0 0 10px 0;
  }
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  .el-divider--horizontal {
    margin: 0 0 8px 0 !important;
  }
  .el-divider {
    background-color: #f0f0f0;
  }

  .el-table__header {
    th {
      height: 28px !important;
    }
  }
}
.jzkh-card {
  display: flex;
  justify-content: left;
  .read-card {
    height: 28px;
    width: 70px;
    margin-left:10px;
  }
}
</style>
