<template>
  <div class="content ht">
    <!-- <pagenation-list
      class="his-module"
      ref="pageTable"
      data-url="/op-service/opgd/registrecord/queryPage"
      v-model="tabledata"
      :searchData="searchData"
      :list-height="listSlotHeight"
      http-method="post"
    >
      <div slot="header" class="row headerScreen">
        <div class="label">
          <h1 class="title">{{$t('patient.title')}}</h1>
          <span class="tag">{{$t('patient.query1')}}</span>
          <search-select
            v-model="searchData.service"
            table-name="SYS_DICT_CONFIG"
            kid="3"
            placeholder=" "
            style="margin-right:10px;"
          />
          <span class="tag">{{$t('patient.query2')}}</span>
          <el-date-picker
            type="date"
            v-model="searchData.treatmentDate"
            @change="getTreatmentDate"
            placeholder=" "
            style="margin-right:10px"
          ></el-date-picker>
          <span class="tag">{{$t('patient.query3')}}</span>
          <el-input
            v-model="searchData.condition"
            value-format="yyyy-MM-dd"
            :placeholder="$t('queueNumber.inputHolder')"
            @keydown.enter.native="getList"
            style="margin-right:10px"
          />
          <el-checkbox
            v-model="screenDZ"
            style="margin-right:10px"
            :disabled="callbackFlag"
            @change="onScreenDZChange"
          >{{$t('patient.chebox1')}}</el-checkbox>
          <el-checkbox
            v-model="screenZZ"
            style="margin-right:10px"
            :disabled="callbackFlag"
            @change="onScreenZZChange"
          >{{$t('patient.chebox2')}}</el-checkbox>
          <el-checkbox
            v-model="screenZB"
            :disabled="callbackFlag"
            @change="onScreenZBChange"
            style="margin-right:10px"
          >{{$t('patient.chebox3')}}</el-checkbox>
        </div>
        <el-button
          type="primary"
          class="blue-gra"
          icon="icon his-search"
          @click="handleQuery"
          v-preventReClick
        >{{$t('sources.queryBtn')}}</el-button>
      </div>
      <el-table :height="listSlotHeight" :data="tableFormat" border stripe slot="list">
        <el-table-column type="expand">
          <template slot-scope="props">
            <span>{{props.index}}</span>
            <expand-row :row="props.row" />
          </template>
        </el-table-column>
        <el-table-column prop="deptName" :label="$t('patient.deptName')"></el-table-column>
        <el-table-column prop="shiftName" :label="$t('patient.shiftName')" width="80"></el-table-column>
        <el-table-column prop="serailNo" :label="$t('patient.serailNo')" width="90"></el-table-column>
        <el-table-column prop="patName" :label="$t('patient.patName')" width="100"></el-table-column>
        <el-table-column prop="ageYear" :label="$t('patient.ageYear')" width="80"></el-table-column>
        <el-table-column prop="sexName" :label="$t('patient.sexName')" width="80"></el-table-column>
        <el-table-column prop="chargeName" :label="$t('patient.chargeName')" width="100"></el-table-column>
        <el-table-column prop="doctorName" :label="$t('patient.doctorName')" width="100"></el-table-column>
        <el-table-column prop="patFlag" :label="$t('patient.patFlag')" width="120">
          <template slot-scope="props">
            <div v-if="props.row.patFlag.indexOf('过') > -1" class="guo">
              {{ props.row.patFlag }}&nbsp;&nbsp;
              <i :size="14" class="icon his-ignore"></i>
            </div>
            <div v-if="props.row.patFlag.indexOf('预') > -1" class="yu">
              {{ props.row.patFlag }}&nbsp;&nbsp;
              <i :size="14" class="icon his-reserve"></i>
            </div>
            <div v-if="props.row.patFlag == ''">/</div>
          </template>
        </el-table-column>
        <el-table-column prop="roomName" :label="$t('patient.roomName')" width="120"></el-table-column>
        <el-table-column prop="treatmentDate" :label="$t('patient.treatmentDate')" width="110"></el-table-column>
      </el-table>
    </pagenation-list> -->
    <queue-number :is-show='true'></queue-number>
  </div>
</template>

<script lang='ts'>
import { Component, Watch, Vue } from 'vue-property-decorator'
import {
  // queryReceptService,
  // queryReceptByUser,
} from '@/api/his/op/guidance/queueNumber'
import queueNumber from '../queueNumber/index.vue'
import { dictExecuteSql, getTableData } from '@/websql/functions'
import { id2Name } from '@/utils'
import expandRow from '../components/table-expand.vue'
declare interface StringArr {
  title?: string
  key?: string
  align?: string
  sortable?: boolean
  slot?: string
  width?: number
  type?: string
  render?: any
}
@Component({
  name: 'patientQueuingQuery',
  //组件引用
  components: {
    expandRow,queueNumber
  },
  filters: {},
})
export default class extends Vue {
  //声明变量默认值（原data中数据）
  private msg: string = 'typescript'
  private listSlotHeight: number = 0
  private searchData: any = {
    // 搜索条件
    condition: '',
    treatmentDate: '',
    dz: 0,
    zz: 0,
    zb: 0,
    service: '',
  }
  private deptList: Array<any> = [] // 科室列表
  private sexList: Array<any> = [] // 性别列表
  private countryList: Array<any> = [] // 国籍列表
  private idTypeList: Array<any> = [] // 身份类别列表
  private marriageList: Array<any> = [] // 婚礼状况列表
  private nationList: Array<any> = [] // 民族列表
  private occupationTypeList: Array<any> = [] // 职业类别列表
  private regionList: Array<any> = [] // 省市区
  private regTypeList: Array<any> = [] // 挂号类别列表
  private relationshipList: Array<any> = [] // 与患者关系列表

  private serviceList: Array<any> = [] // 服务台列表
  private screenDZ: boolean = false // 筛选待诊
  private screenZZ: boolean = false // 筛选诊中
  private screenZB: boolean = false // 筛选诊毕
  private callbackFlag: boolean = false // 是否返回数据标记
  private medicalDate: string = '' // 就诊日期
  private tabledata: object[] = [] // 表格数据
  //原computed中的方法
  get ntest() {
    return this.msg
  }

  get tableFormat() {
    const tableData = this.tabledata
    id2Name(tableData, 'deptId', 'deptName', this.deptList, 'dv', 'dn') // 科室
    id2Name(tableData, 'sexId', 'sexName', this.sexList, 'dv', 'dn') // 性别
    id2Name(tableData, 'idTypeId', 'idTypeName', this.idTypeList, 'dv', 'dn') // 证据类别
    id2Name(tableData, 'nationId', 'nationName', this.nationList, 'dv', 'dn') // 民族
    id2Name(
      tableData,
      'marriageId',
      'marriageName',
      this.marriageList,
      'dv',
      'dn'
    ) // 婚姻状况
    id2Name(
      tableData,
      'occupationTypeId',
      'occupationTypeName',
      this.occupationTypeList,
      'dv',
      'dn'
    ) // 职业类别
    id2Name(
      tableData,
      'relationshipId',
      'relationshipName',
      this.relationshipList,
      'dv',
      'dn'
    ) // 与患者关系
    id2Name(tableData, 'countryId', 'countryName', this.countryList, 'dv', 'dn') // 国籍
    id2Name(
      tableData,
      'regTypeCode',
      'regTypeName',
      this.regTypeList,
      'dv',
      'dn'
    ) // 挂号类别
    // 现住址
    id2Name(
      tableData,
      'addressProvinceId',
      'addressProvinceName',
      this.regionList,
      'kid',
      'kname'
    )
    id2Name(
      tableData,
      'addressCityId',
      'addressCityName',
      this.regionList,
      'kid',
      'kname'
    )
    id2Name(
      tableData,
      'addressCountyId',
      'addressCountyName',
      this.regionList,
      'kid',
      'kname'
    )
    // 籍贯
    id2Name(
      tableData,
      'originProvinceId',
      'originProvinceName',
      this.regionList,
      'kid',
      'kname'
    )
    id2Name(
      tableData,
      'originCityId',
      'originCityName',
      this.regionList,
      'kid',
      'kname'
    )
    id2Name(
      tableData,
      'originCountyId',
      'originCountyName',
      this.regionList,
      'kid',
      'kname'
    )
    // console.log(tableData)
    // console.log(this.idTypeList)
    // console.log(this.marriageList)
    // console.log(this.regionList)
    return tableData
  }

  //数据监控
  @Watch('tabledata', { immediate: true })
  private onTabledataChange(val: string) {
    this.callbackFlag = false
  }

  //钩子函数
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 130
    console.log(this.listSlotHeight)
  }

  //钩子函数
  mounted() {
    this.init()
    // this.getList()
  }
  // 取转换字段
  private init() {
    const _that = this
    // dictExecuteSql(
    //   "'select * from  SYS_PRIMARY_DATA where dk='PD0000000271'",
    //   function (tx: any, result: any) {
    //     for (var i = 0; i < result.rows.length; i++) {
    //       _that.countryList.push(result.rows.item(i)) // 国籍
    //     }
    //   },

    //   function (tx: any, error: any) {
    //     console.log('国籍查询失败' + error.message)
    //   }
    // )
    // dictExecuteSql(
    //   "'select * from  SYS_PRIMARY_DATA where dk='PD0000000260'",
    //   function (tx: any, result: any) {
    //     for (var i = 0; i < result.rows.length; i++) {
    //       _that.idTypeList.push(result.rows.item(i)) // 身份类别
    //     }
    //   },
    //   function (tx: any, error: any) {
    //     console.log('身份类别查询失败' + error.message)
    //   }
    // )
    // dictExecuteSql(
    //   "'select * from  SYS_PRIMARY_DATA where dk='PD0000000137'",
    //   function (tx: any, result: any) {
    //     for (var i = 0; i < result.rows.length; i++) {
    //       _that.marriageList.push(result.rows.item(i)) // 婚姻状况
    //     }
    //   },
    //   function (tx: any, error: any) {
    //     console.log('婚姻状况查询失败' + error.message)
    //   }
    // )
    // dictExecuteSql(
    //   "'select * from  SYS_PRIMARY_DATA where dk='PD0000000215'",
    //   function (tx: any, result: any) {
    //     for (var i = 0; i < result.rows.length; i++) {
    //       _that.nationList.push(result.rows.item(i)) // 民族
    //     }
    //   },
    //   function (tx: any, error: any) {
    //     console.log('民族查询失败' + error.message)
    //   }
    // )
    // dictExecuteSql(
    //   "'select * from  SYS_PRIMARY_DATA where dk='PD0000000338'",
    //   function (tx: any, result: any) {
    //     for (var i = 0; i < result.rows.length; i++) {
    //       _that.occupationTypeList.push(result.rows.item(i)) // 职业类别
    //     }
    //   },
    //   function (tx: any, error: any) {
    //     console.log('职业类别查询失败' + error.message)
    //   }
    // )
    // dictExecuteSql(
    //   'select * from  TB_REGION',
    //   function (tx: any, result: any) {
    //     for (var i = 0; i < result.rows.length; i++) {
    //       _that.regionList.push(result.rows.item(i)) // 地区表
    //     }
    //   },
    //   function (tx: any, error: any) {
    //     console.log('地区表查询失败' + error.message)
    //   }
    // )
    // getTableData(
    //   'HSP_DATA_MAIN',
    //   165,
    //   'select * from  HSP_DATA_SON where pid=165',
    //   function (data: any) {
    //     _that.regTypeList = data // 挂号类别
    //   }
    // )
    // dictExecuteSql(
    //   "'select * from  SYS_PRIMARY_DATA where dk='PD0000000420'",
    //   function (tx: any, result: any) {
    //     for (var i = 0; i < result.rows.length; i++) {
    //       _that.relationshipList.push(result.rows.item(i)) // 与患者关系列表
    //     }
    //   },
    //   function (tx: any, error: any) {
    //     console.log('与患者关系列表查询失败' + error.message)
    //   }
    // )

    // queryReceptByUser(null).then((res: any) => {
    //   if (res.data.list) {
    //     _that.serviceList = res.data.list
    //     if (_that.serviceList.length != 0)
    //       _that.searchData.service = _that.serviceList[0].roomId
    //   }
    //   getTableData(
    //     'SYS_DICT_CONFIG',
    //     2,
    //     'select * from  SYS_DICT_CONFIG where pid=2',
    //     function (data: any) {
    //       _that.deptList = data
    //       dictExecuteSql(
    //         'select * from  SYS_PRIMARY_DATA where pid=175',
    //         function (tx: any, result: any) {
    //           for (var i = 0; i < result.rows.length; i++) {
    //             _that.sexList.push(result.rows.item(i))
    //           }
    //           const pageTable: any = _that.$refs.pageTable
    //           pageTable.getList()
    //         },
    //         function (tx: any, error: any) {
    //           console.log('查询失败' + error.message)
    //         }
    //       )
    //     }
    //   )
    // })
  }

  private onScreenDZChange(val: boolean) {
    this.callbackFlag = true
    if (val) this.searchData.dz = 1
    else this.searchData.dz = 0
    this.getList()
  }

  private onScreenZZChange(val: boolean) {
    this.callbackFlag = true
    if (val) this.searchData.zz = 1
    else this.searchData.zz = 0
    this.getList()
  }

  private onScreenZBChange(val: boolean) {
    this.callbackFlag = true
    if (val) this.searchData.zb = 1
    else this.searchData.zb = 0
    this.getList()
  }

  //原methods中的方法
  private getTreatmentDate(val: any) {
    console.log(val)
    this.searchData.treatmentDate = val
    this.getList()
  }

  // 从头获取
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 点击查询
  private handleQuery() {
    console.log('查询', this.searchData)
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }
}
</script>
