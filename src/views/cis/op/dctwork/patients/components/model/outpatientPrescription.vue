<!--
 * @Date:
 * @LastEditTime:
 * @Description: 门诊处方拷贝
 * @FilePath:
-->

<template>
  <div class="content his-cf-copy ht">
    <el-row :gutter="10" class="ht">
      <el-col :span="8" class="ht">
        <div class="his-module his-small his-history ht">
          <pagenation-list ref="pageTable" v-model="tableData" data-url="/op-service/opysjzls/findList" http-method="post" :searchData="searchData" :list-height="listSlotHeight">
            <div slot="header" class="row">
              <div class="label">
                <span class="title ml10">{{ $t('就诊记录') }}</span>
                <el-date-picker v-model="value1" class="date-wrapper" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
                <el-divider direction="vertical" class="mr10"></el-divider>
                <el-button size="mini" type="text" @click="filterList">
                  <i class="icon his-search"></i>
                  <span>查询</span>
                </el-button>
              </div>
            </div>
            <el-table :data="tableFormat" border stripe slot="list" :height="listSlotHeight - 95" class="scroll-bar" @row-click="handleGetCf" highlight-current-row>
              <el-table-column prop="webSortNumber" align="center" width="32"></el-table-column>
              <el-table-column prop="kssj" label="就诊时间" min-width="120" show-overflow-tooltip></el-table-column>
              <el-table-column prop="ksdmName" :label="$t('就诊科室')" width="70" show-overflow-tooltip></el-table-column>
              <el-table-column prop="ysdmName" :label="$t('就诊医生')" width="70" show-overflow-tooltip></el-table-column>
              <el-table-column prop="zyzd" :label="$t('诊断名称')" show-overflow-tooltip></el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>

      <el-col :span="16" class="ht">
        <div class="his-module his-small ht" :style="{ height: listSlotHeight / 3 + 'px', marginBottom: '10px' }">
          <div slot="header" class="row">
            <div class="label">
              <span class="title ml10">{{ $t('门诊处方') }}</span>
              <el-button size="mini" type="text" @click="handleConfirm"> <i class="icon his-btn-confirm"></i>确认 </el-button>
              <el-button size="mini" type="text" @click="handleRefresh"> <i class="icon his-btn-refresh blue"></i>刷新 </el-button>
            </div>
          </div>
          <el-table :data="tableFormatList" border stripe slot="list" :height="listSlotHeight / 3 - 50" highlight-current-row class="scroll-bar" @row-click="handleGetDetail">
            <el-table-column :label="$t('')" type="index" width="32"></el-table-column>
            <el-table-column width="46">
              <template slot-scope="scope">
                <div class="w100">
                  <span class="dc">{{ scope.row.ypdc | filterDc }} </span>
                  <span class="type">{{ scope.row.type | filterType }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="cfsb" :label="$t('处方识别')"></el-table-column>
            <el-table-column prop="cfhm" :label="$t('处方号码')"></el-table-column>
            <el-table-column prop="kfrq" :label="$t('开方日期')"></el-table-column>
            <el-table-column prop="cflx" :label="$t('处方类型')">
              <template slot-scope="scope">
                <span>{{ scope.row.cflx | filterLx }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ksdmName" :label="$t('就诊科室')"></el-table-column>
            <el-table-column prop="ysdmName" :label="$t('开方医生')"></el-table-column>
            <el-table-column prop="cfts" :label="$t('处方贴数')"></el-table-column>
            <el-table-column prop="jtdz" :label="$t('送药地址')"></el-table-column>
            <el-table-column prop="jtdh" :label="$t('联系电话')"></el-table-column>
          </el-table>
        </div>
        <div class="his-module his-small" :style="{ height: (listSlotHeight / 3) * 2 + 'px', marginBottom: '10px' }">
          <div slot="header" class="row">
            <div class="label">
              <span class="title ml10">{{ $t('处方明细') }}</span>
            </div>
          </div>
          <el-table :data="tableFormatCfDe" border stripe :height="(listSlotHeight / 3) * 2 - 60" class="scroll-bar">
            <el-table-column :label="$t('')" width="16" type="index"></el-table-column>
            <el-table-column prop="ypzh" width="16" class-name="color-group">
              <template slot-scope="scope">
                <div class="w100" :class="scope.row.ypzh % 2 == 1 ? 'greenBack' : 'orangeBack'"></div>
              </template>
            </el-table-column>
            <el-table-column width="46">
              <template slot-scope="scope">
                <div class="w100">
                  <span class="dc">{{ scope.row.ypdc | filterDc }} </span>
                  <span class="type">{{ scope.row.type | filterType }}</span>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="zfyp" :label="$t('转')" width="32">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.zfyp" :true-label="1" disabled :false-label="0"></el-checkbox>
              </template>
            </el-table-column> -->
            <el-table-column prop="fymc" label="药品名称" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="yfgg" :label="$t('规格')" width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="jb" :label="$t('几倍')" width="50"></el-table-column>
            <el-table-column prop="ycjl" :label="$t('单次剂量')"></el-table-column>
            <el-table-column prop="jldw" :label="$t('')" width="32"></el-table-column>
            <el-table-column prop="ypyfName" :label="$t('频次')" width="50"></el-table-column>
            <el-table-column prop="yyts" :label="$t('天数')" width="50"></el-table-column>
            <el-table-column prop="ypsl" :label="$t('总量')" width="50"></el-table-column>
            <el-table-column prop="yfdw" :label="$t('单位')" width="50"></el-table-column>
            <el-table-column prop="gytjName" :label="$t('药品用法')"></el-table-column>
            <el-table-column prop="jfName" :label="$t('煎法')" width="50" v-if="isCflx == 3"></el-table-column>
            <el-table-column prop="ypcdName" :label="$t('药品产地')" min-width="120" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column prop="ypdj" :label="$t('单价')" class-name="text-blue-td" width="60"></el-table-column>
            <el-table-column prop="zfbl" :label="$t('自付')" class-name="text-blue-td">
              <template slot-scope="scope">
                <span v-if="scope.row.zfbl">{{ useMul(scope.row.zfbl, 100) + '%' }}</span>
              </template>
            </el-table-column> -->
            <el-table-column prop="bzxx" :label="$t('备注')" width="60"></el-table-column>
            <el-table-column prop="syyy" :label="$t('限用适用症、人群及其他')" width="160"></el-table-column>
            <el-table-column prop="psjg" :label="$t('皮试结果')">
              <template slot-scope="scope">
                <div :class="scope.row.psjg | filterColor">{{ scope.row.psjg | filterPsjg }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { findDetails, findList, checkCopyInfo, checkDetailInfo, findListNoJzlsh, getPubParams } from '@/api/cis/op/dctwork/recipe'
import { id2Name, parseTime, mul } from '@/utils'
import { AxiosResponse } from 'axios'
import { table } from 'console'

@Component({
  name: 'OutpatientPrescription',
  components: {},
  filters: {
    filterDc(value: number) {
      switch (value) {
        case 1:
          return '国'
        case 2:
          return '合'
        case 3:
          return '进'
        default:
          return '非'
          break
      }
    },
    filterType(value: number) {
      switch (value) {
        case 1:
          return '西'
        case 2:
          return '中'
        case 3:
          return '草'
      }
    },
    filterLx(value: number) {
      switch (value) {
        case 1:
          return '西药'
        case 2:
          return '成药'
        case 3:
          return '草药'
      }
    },
    filterPsjg(value: string) {
      switch (value) {
        case '0':
          return ''
        case '1':
          return '无需皮试'
        case '2':
          return '阴性'
        case '3':
          return '阳性'
      }
    },
    filterColor(value: string) {
      switch (value) {
        case '2':
          return 'blues'
        case '3':
          return 'reds'
      }
    },
  },
})
export default class extends Vue {
  @Prop({ required: true }) private pnParam!: any
  @Prop({ required: true }) private yfsb!: any
  @Prop({ required: true }) private cfLength!: any
  private listSlotHeight: number = 530 //列表高度
  private tableDataCfList: Array<any> = []
  private tableDataCfDetail: Array<any> = []
  private value1: Array<any> = []
  private chooseRow: any = {}
  private tableData: Array<any> = [] //表格数据
  private doctorList: Array<any> = [] //科室
  private department: Array<any> = [] //医生
  private institutions: Array<any> = [] //机构
  private cdList: Array<any> = [] //产地字典
  private pcList: Array<any> = [] //频次字典
  private yfList: Array<any> = [] //药品用法字典
  private jzList: Array<any> = [] //煎法数组
  private tjList: Array<any> = []
  private jzxh: string = ''
  private ksdm: string = ''
  private ysdm: string = ''
  private mzxydzcfzdyps: number = 0
  private mzcydzcfzdyps: number = 0
  private CFLX: any = ''
  private isCflx: any = ''

  private searchData: any = {
    brbh: '',
    kssj: '',
    jssj: '',
    pageNum: 1,
    pageSize: 20,
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 50
  }

  mounted() {
    this.searchData.brbh = this.pnParam.brid
    this.getList()
    this.doctorList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT //医生
    this.institutions = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.HOSPITAL_DICT : this.$store.state.webSqlDict.HOSPITAL_DICT //机构
    this.department = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.OUTPATIENT_DEPARTMENT : this.$store.state.webSqlDict.OUTPATIENT_DEPARTMENT //科室
    this.cdList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_DRUGMADEIN_DICT : this.$store.state.webSqlDict.DRUG_DRUGMADEIN_DICT
    this.pcList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.FREQUENCY_DICT : this.$store.state.webSqlDict.FREQUENCY_DICT
    this.tjList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_METHOD_DICT : this.$store.state.webSqlDict.DRUG_METHOD_DICT
    this.jzList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.JZ_DICT : this.$store.state.webSqlDict.JZ_DICT

    getPubParams({ commons: ['MZXYDZCFZDYPS','MZCYDZCFZDYPS'] }).then((res: any) => {
      if(res.errorCode == "SUCCESS") {
        this.mzxydzcfzdyps = res.data.MZXYDZCFZDYPS // 门诊西药方单张处方最大药品数
        this.mzcydzcfzdyps = res.data.MZCYDZCFZDYPS // 门诊草药方单张处方最大药品数
      }
    })
  }

  get tableFormat() {
    const tabledata = this.tableData
    id2Name(tabledata, 'ysdm', 'ysdmName', this.doctorList, 'dv', 'dn')
    id2Name(tabledata, 'ksdm', 'ksdmName', this.department, 'dv', 'dn')
    id2Name(tabledata, 'jgid', 'jgidName', this.institutions, 'dv', 'dn')

    return tabledata
  }

  get tableFormatList() {
    const tabledataList = this.tableDataCfList
    id2Name(tabledataList, 'ysdm', 'ysdmName', this.doctorList, 'dv', 'dn')
    id2Name(tabledataList, 'ksdm', 'ksdmName', this.department, 'dv', 'dn')
    return tabledataList
  }

  get tableFormatCfDe() {
    console.log('this.tableDataCfDetail', this.tableDataCfDetail)
    console.log('this.tjList', this.tjList)
    const tabledata = this.tableDataCfDetail
    id2Name(tabledata, 'ypyf', 'ypyfName', this.pcList, 'dv', 'dn')
    id2Name(tabledata, 'ypcd', 'ypcdName', this.cdList, 'dv', 'dn')
    id2Name(tabledata, 'gytj', 'gytjName', this.tjList, 'dv', 'dn')
    id2Name(tabledata, 'jf', 'jfName', this.jzList, 'dv', 'dn')
    return tabledata
  }

  //加载数据
  private getList() {
    this.$nextTick(() => {
      console.log(231)
      const pageTable: any = this.$refs.pageTable
      pageTable.getList()
    })
  }

  private filterList() {
    if (this.value1 && this.value1.length>0) {
      console.log(2888,this.value1[0])
      this.searchData.kssj = this.value1[0] + ' 00:00:00'
      this.searchData.jssj = this.value1[1] + ' 23:59:59'
      console.log(2888,this.searchData.jssj)
    } else {
      this.searchData.kssj = ''
      this.searchData.jssj = ''
    }
    this.$nextTick(()=> {
      const pageTable: any = this.$refs.pageTable
      pageTable.searchList()
    })
  }

  /**
   * @Description: 根据就诊序号查询处方明细和列表
   * @author: zhml
   * @param {type}: val
   * @return:
   * @date 2020/7/21
   */
  private handleGetCf(val: any) {
    this.jzxh = val.jzxh
    this.ksdm = val.ksdm
    this.ysdm = val.ysdm
    this.tableDataCfList = []
    this.tableDataCfDetail = []
    findListNoJzlsh({ jzxh: val.jzxh }).then((res: AxiosResponse) => {
      res.data.forEach((item: any) => {
        item.ksdm = val.ksdm
        item.ysdm = val.ysdm
        item.kfrq = item.kfrq.slice(0, 10)
        if (item.cfts == 0) {
          item.cfts = 1
        }
      })
      this.tableDataCfList = res.data
      // if(res.data.length>0 && res.data[0].cfsb) {
      //   findDetails({ cfsb: res.data[0].cfsb }).then((response: any) => {
      //     this.tableDataCfDetail = response.data.map((item: any) => {
      //       item.ypyfName = this.pcList.find((obj: any) => obj.dv == item.ypyf)['dn']
      //       item.ypcdName = this.cdList.find((obj: any) => obj.dv == item.ypcd)['dn']
      //       item.gytjName = this.tjList.find((obj: any) => obj.dv == item.gytj)['dn']
      //       if(res.data.cflx != 3) this.$delete(item,'jf')
      //       return item
      //     })
      //   })
      // }
    })
  }
  // 刷新
  private handleRefresh() {
    if (this.jzxh == '') return
    findList({ jzxh: this.jzxh }).then((res: AxiosResponse) => {
      res.data.forEach((item: any) => {
        item.ksdm = this.ksdm
        item.ysdm = this.ysdm
        item.kfrq = item.kfrq.slice(0, 10)
        if (item.cfts == 0) {
          item.cfts = 1
        }
      })
      this.tableDataCfList = res.data
      findDetails({ cfsb: res.data[0].cfsb }).then((response: any) => {
        res.data.forEach((item: any) => {
          if(res.data.cflx != 3) this.$delete(item,'jf')
        })
        this.tableDataCfDetail = response.data
      })
    })
  }

  /**
   * @Description: 调入处方数据
   * @author: zhml
   * @param {type}:
   * @return:
   * @date 2020/7/21
   */
  private handleConfirm() {
    var cf01List: Array<any> = []
    cf01List.push(this.chooseRow)
    var cf02List: Array<any> = this.tableDataCfDetail
    let param = {
      brxz: this.pnParam.brxz,
      cf01List: cf01List,
      cf02List: cf02List,
    }
    console.log('this.chooseRow', this.chooseRow)
    if (JSON.stringify(this.chooseRow) == '{}') return this.$message.warning('请选择一条处方并复制')
    // let totalNum:number = this.tableDataCfDetail.length + this.cfLength.length
    // if (this.CFLX == 1 && totalNum > this.mzxydzcfzdyps) return this.$message.warning("复制处方后药品数量多于西药方最大限额")
    // if (this.CFLX == 3 && totalNum > this.mzcydzcfzdyps) return this.$message.warning("复制处方后药品数量多于草药方最大限额")
    // 当组套有任一条药品无库存，则不能复制该组套
    checkCopyInfo(param).then((res: any) => {
      if(res.errorCode == "SUCCESS") {
        // let list: any = []
        // let that = this
        this.$emit('setList', res.data)
      }
    })
  }
  /**
   * @Description: 根据cfsb查询detail
   * @author: zhml
   * @param {type}:
   * @return:
   * @date 2020/7/21
   */
  private handleGetDetail(val: any) {
    console.log(val)
    this.isCflx = val.cflx
    this.CFLX = val.cflx
    this.chooseRow = val
    findDetails({ cfsb: val.cfsb }).then((response: any) => {
      this.tableDataCfDetail = response.data
    })
  }

  // 百分制
  private useMul(a: any, b: number) {
    return mul(a, b)
  }
}
</script>
<style scoped lang="scss">
.his-cf-copy {
  padding: 0 !important;
  .his-history {
    padding-bottom: 20px;
  }
  .row .label {
    width: 100%;
    justify-content: start;
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

  ::v-deep .color-group .cell {
    padding: 0 !important;

    .greenBack {
      height: 32px;
      opacity: 0.3 !important;
      background: #0fcaad;
    }
    .orangeBack {
      height: 32px;
      opacity: 0.3 !important;
      background: #ffbf00;
    }
  }
}
</style>
