<!--线上订单配送查询-->
<template>
  <div class="content">
    <div class="his-module his-small">
      <div slot="header" class="row">
        <div class="label">
          <span class="his-title">订单配送查询</span>
          <el-divider direction="vertical"></el-divider>
          <span class="tag">状态</span>
          <el-select placeholder="请选择" v-model="searchData.pszt" class="his-input">
            <el-option label="未发货" value="0"></el-option>
            <el-option label="配送中" value="1"></el-option>
            <el-option label="已完成" value="2"></el-option>
            <el-option label="已取消" value="3"></el-option>
          </el-select>
          <el-divider direction="vertical"></el-divider>
          <div class="querySearch" style="margin-left: 10px;">
            <div class="searchTitle">卡号</div>
            <el-input v-model="searchData.keyword" :placeholder="$t('请输入卡号/姓名/编号/发票号')"></el-input>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div class="tag">时间</div>
          <el-date-picker v-model="dateRange" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始时间" end-placeholder="结束时间" clearable class="date-wrapper" style="width: 220px;"></el-date-picker>
          <div class="btn">
            <el-button size="mini" type="text" @click="handleSearch"><i class="icon his-search"></i>查询</el-button>
          </div>
        </div>
      </div>

      <el-table :data="tableFormat" border stripe :highlight-current-row="true" slot="list" :height="listSlotHeight - 167" class="scroll-bar no-underline" tooltip-effect="light" @row-click="getRow">
        <!-- 序号 -->
        <el-table-column type="index" align="center" width="32"></el-table-column>
        <!-- 患者卡号 -->
        <el-table-column prop="jzkh" :label="$t('患者卡号')" min-width="70"></el-table-column>
        <!-- 患者姓名 -->
        <el-table-column prop="brxm" :label="$t('患者姓名')" min-width="80"></el-table-column>
        <!-- 发票号码 -->
        <el-table-column prop="fphm" :label="$t('发票号码')" min-width="100" />
        <!-- 诊治科室 -->
        <el-table-column prop="ghks" :label="$t('诊治科室')" min-width="100" />
        <!-- 药品名称 -->
        <el-table-column prop="ypmc" :label="$t('药品名称')" min-width="160" show-overflow-tooltip />
        <!-- 药品规格 -->
        <el-table-column prop="yfgg" :label="$t('药品规格')" min-width="80" show-overflow-tooltip></el-table-column>
        <!-- 单位 -->
        <el-table-column prop="yfdw" :label="$t('单位')" min-width="80" show-overflow-tooltip></el-table-column>
        <!-- 数量 -->
        <el-table-column prop="ypsl" :label="$t('数量')" min-width="60" />
        <!-- 金额 -->
        <el-table-column prop="hjje" :label="$t('金额')" min-width="60" />
        <!-- 下单时间 -->
        <el-table-column prop="cjsj" :label="$t('下单时间')" min-width="140"></el-table-column>
        <!-- 订单编号 -->
        <el-table-column prop="ddh" :label="$t('订单编号')" min-width="100"></el-table-column>
        <!-- 预计到达时间 -->
        <el-table-column prop="kssj" :label="$t('配送开始时间')" min-width="140" />
        <el-table-column prop="jssj" :label="$t('配送结束时间')" min-width="140" />
        <!-- 状态 -->
        <!-- :class-name="scope.row.pszt=='0'||scope.row.pszt=='1'?'text-blue-td':'text-red-td'" -->
        <el-table-column prop="pszt" :label="$t('状态')" min-width="70" class-name="text-blue-td">
          <template slot-scope="scope">
            {{ scope.row.pszt | zt }}
          </template>
        </el-table-column>
      </el-table>
      <div class="row" style="margin-top: 5px;">
        <div class="label">
          <i class="icon his-hospitalized-info blue"></i><span class="tag" style="padding-right: 0;">配送信息</span>
          <el-divider direction="vertical"></el-divider>
          <!-- <el-button size="mini" type="text" @click="save"><i class="icon his-btn-save green"></i>保存</el-button> -->
        </div>
      </div>
      <el-form :model="deliveryData" ref="deliveryRef" class="retrieval" label-width="65px">
        <el-row type="flex">
          <el-form-item label="收件人" prop="shr">
            <el-input v-model="deliveryData.shr" placeholder="请输入" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="收件电话" prop="shrdh">
            <el-input v-model="deliveryData.shrdh" placeholder="请输入" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="psdz">
            <el-input v-model="deliveryData.psdz" placeholder="请输入" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="物流状态" prop="pszt">
            <el-select placeholder="请选择" v-model="deliveryData.pszt" class="his-input" :disabled="true">
              <el-option label="未发货" value="0"></el-option>
              <el-option label="配送中" value="1"></el-option>
              <el-option label="已完成" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="配送开始时间" prop="kssj" style="line-height: 12px;">
            <el-input v-model="deliveryData.kssj" placeholder="请输入" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="配送结束时间" prop="jssj" style="line-height: 12px;">
            <el-input v-model="deliveryData.jssj" placeholder="请输入" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="派件员" prop="pjy">
            <el-input v-model="deliveryData.pjy" placeholder="请输入" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="派件电话" prop="pjydh">
            <el-input v-model="deliveryData.pjydh" placeholder="请输入" :disabled="true"></el-input>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="快递公司" prop="kdgs">
            <el-input v-model="deliveryData.kdgs" placeholder="请输入" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="快递单号" prop="kddh">
            <el-input v-model="deliveryData.kddh" placeholder="请输入" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="备注信息" prop="bz">
            <el-input v-model="deliveryData.bz" placeholder="无" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item></el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { id2Name } from '@/utils'
import { getNow } from '@/api/his/basic'
import { parseTime } from '@/utils'
import { orderDeliveryQuery, getByIdDetail, edit } from '@/api/cis/op/dctwork/orderDeliveryQuery'
@Component({
  name: 'orderDeliveryQuery',
  filters: {
    zt(val: string) {
      switch (val) {
        case '0':
          return '未发货'
        case '1':
          return '配送中'
        case '2':
          return '已完成'
        case '3':
          return '已取消'
      }
    },
  },
})
export default class extends Vue {
  private tableDatas: any[] = []
  private listSlotHeight: number = 0
  private sexList: Array<any> = [] //性别
  private patientTypeList: Array<any> = [] //患者性质
  private doctorList: Array<any> = [] //医生
  private deptList: Array<any> = [] //科室
  private dateRange: Array<any> = [] // 就诊日期
  private value: any = []
  private deliveryData: any = {
    beginDay: '',
    bz: '',
    endDay: '',
    id: 0,
    kddh: '',
    kdgs: '',
    kssj: '',
    pjy: null,
    pjydh: '',
    pszt: '',
  }
  private searchData: any = {
    pszt: '0',
    keyword: '',
    startDate: '',
    endDate: '',
  }
  private disabled: boolean = true
  get tableFormat() {
    const tabledata = this.tableDatas
    return tabledata
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 100
    this.getDate()
  }
  mounted() {
    this.$nextTick(() => {
      this.getList()
    })
    this.sexList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT
    this.patientTypeList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_PATIENT_DICT : this.$store.state.webSqlDict.TABLE_PATIENT_DICT
    this.doctorList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.deptList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DEPT_DICT : this.$store.state.webSqlDict.DEPT_DICT
  }

  // 查询
  private handleSearch() {
    this.getList()
    ;(this.$refs.deliveryRef as any).resetFields()
  }

  private getDate() {
    this.dateRange = [parseTime(new Date(), '{y}-{m}-{d}'), parseTime(new Date(), '{y}-{m}-{d}')]
  }
  @Watch('dateRange')
  private onDateChange(val: any[] | null) {
    if (val) {
      this.searchData.startDate = parseTime(val[0], '{y}-{m}-{d}')
      this.searchData.endDate = parseTime(val[1], '{y}-{m}-{d}')
    } else {
      this.searchData.startDate = ''
      this.searchData.endDate = ''
    }
  }
  //分页查询数据
  private getList() {
    orderDeliveryQuery(this.searchData).then((item: any) => {
      console.log(item, 'item')
      this.tableDatas = item.data.list
    })
  }
  //行点击事件
  getRow(item: any) {
    this.disabled = false
    getByIdDetail({ id: item.id }).then((s: any) => {
      console.log(s, 's', this.deliveryData)
      this.deliveryData = s.data
      console.log(this.deliveryData)
    })
  }
  private save() {
    edit(this.deliveryData).then((res: any) => {
      console.log(res, 'any')
      if (res.errorCode == 'SUCCESS') {
        ;(this.$refs.deliveryRef as any).resetFields()
        // this.getList()
        this.disabled = true
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.his-title {
  font-size: 16px;
  font-family: 'siyuanMedium';
  font-weight: 500;
}

.his-small .row .label .tag {
  padding-left: 0;
}

.his-small .row .label .el-input::v-deep .el-input__inner {
  width: 168px !important;
}

// 基本信息底部边距
.content .his-small .retrieval::v-deep .el-row .el-form-item {
  margin-bottom: 16px;
}
// 右侧表单样式分布
.content .his-small .retrieval .el-row .el-form-item {
  width: calc(25% - 8px);
}
.content .his-small .retrieval {
  margin-top: 10px;
  width: 100%;
}
</style>
