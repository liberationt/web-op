<!--
 * @Date: 
 * @LastEditTime: 
 * @Description: 常用组套项目维护
 * @FilePath: 
-->

<template>
  <div class="content his-suite">
    <el-row class="ht" :gutter="10">
      <!-- 第一列的组套类型名称列表 -->
      <div class="top-header his-module his-small">
        <div class="row">
          <div class="label">
            <span class="title">{{$t('常用组套维护')}}</span>
            <el-divider direction="vertical"></el-divider>
            <span style="margin-right: 8px">科室选择</span>
            <el-select
              v-model="searchData.ksdm"
              @change="pushKsList"
              filterable
              :filter-method="searchKsdm"
            >
              <el-option v-for="item in ksdmList1" :key="item.dv" :value="item.dv" :label="item.dn"></el-option>
            </el-select>
            <el-divider direction="vertical"></el-divider>
            <el-radio-group v-model="searchData.ztlb" @change="pushTowList">
              <el-radio :label="1">西药</el-radio>
              <el-radio :label="2">成药</el-radio>
              <el-radio :label="3">草药</el-radio>
              <el-radio :label="4">健康项目</el-radio>
            </el-radio-group>
            <el-divider direction="vertical" class="mr10"></el-divider>
            <el-radio-group v-model="searchData.sslb" @change="pushTowListOther">
              <el-radio :label="searchData.ksdm == 0 ? 6 : 5 ">常用</el-radio>
              <el-radio :label="searchData.ksdm == 0 ? 3 : 2 ">组套</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <el-col class="ht mt10" :span="8">
        <suiteList1
          ref="suiteList"
          v-model="tableDatas"
          :isShow="true"
          :is-select="isSelect"
          :search-data="searchData"
          @refresh="refreshList"
          @get="getRow"
          :KSDM="KSDM"
        />
        <!--										:is-select="true"-->
      </el-col>
      <el-col class="ht mt10" :span="16">
        <detailList1
          ref="detail"
          v-model="tableList"
          :data-url="dataUrl"
          :search-data-detail="searchDataDetail"
          @delete="deleteRow"
          :is-select="isSelect"
          :KSDM="KSDM"
        ></detailList1>
        <!--										:is-select="isSelect"-->
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { ISuiteTypeList, ISuiteDetail, enable, disEnable, searchDetailList, queryPage, queryDetail, queryDetailXm } from '@/api/cis/op/dctwork/examineSuite'
import detailList1 from '../components/detailList1.vue'
import suiteList1 from '../components/suiteList1.vue'
import { getData } from '@/api/his/im/ims/admissionRegistration'
import { getNow } from '@/api/his/basic'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'ExaminesSuite',
  components: { detailList1, suiteList1 }
})
export default class extends Vue {
  private tableDatas: ISuiteTypeList[] = []
  private tableList: Array<any> = []
  private ksdmList: Array<any> = []
  private ksdmList1: Array<any> = []
  private dataUrl: string = ''
  private KSDM: number | string = 0
  private isSelect: boolean = false
  private searchData: any = {
    ztlb: 1,
    sslb: 3,
    ztbh: null,
    ksdm: 0
  }
  private searchDataDetail: any = {
    yp: {
      ztbh: '',
      ztlb: '',
      drugType: '',
      pydm: '',
      xmlx: null
    }
  }

  created() {}

  mounted() {
    this.ksdmList = JSON.parse(JSON.stringify(this.$store.state.webSqlDict.REGISTERATION_DEPARTMENT_DICT))
    this.ksdmList.splice(0, 0, { dv: 0, dn: '全院', py: 'QY', showOrder: 0, stop: '' })
    this.ksdmList1 = [...this.ksdmList]
    console.log(this.ksdmList)
  }

  private initTableList() {
    if (this.tableDatas[0].ztbh) {
      if (this.tableDatas[0].ztbh === null || this.tableDatas[0].ztbh === undefined) {
        return null
      } else {
        queryDetail({ ztbh: this.tableDatas[0].ztbh }).then(res => {
          this.tableList = res.data.map((item: any, index: number) => {
            item.webSortNumber = index + 1
            return item
          })
        })
      }
    }
  }

  private pushTowList(value: any) {
    if (value) {
      this.searchData.ztlb = value
      this.searchDataDetail.ztlb = value
      this.searchDataDetail.yp.drugType = value
    }
    if(value == 4) {
      this.searchDataDetail.yp.xmlx = 5
    }
    const pageTable: any = (this.$refs.suiteList as any).$refs.pageTable
    pageTable.searchList()
    ;(this.$refs.suiteList as any).isAdd = true
    // this.initTableList()
    this.tableList = []
  }

  private pushTowListOther(value: any) {
    console.log('value', value)
    this.searchData.sslb = value
    const pageTable: any = (this.$refs.suiteList as any).$refs.pageTable
    pageTable.searchList()
    ;(this.$refs.suiteList as any).isAdd = true
    // this.initTableList()
    this.tableList = []
  }

  /**
   * @LastEditors: zhml
   * @Description: 刷新列表,右侧列表数据置为[]
   * @param {type} params
   * @return:
   */
  private refreshList(value: any) {
    if (value.ztlb) {
      this.searchData.ztlb = value.ztlb
      this.searchData.sslb = 3
    }
    const pageTable: any = (this.$refs.suiteList as any).$refs.pageTable
    pageTable.searchList()

    this.tableList = []
    if (this.searchData.ksdm == 0) {
      this.searchData.sslb = 3
    } else {
      this.searchData.sslb = 2
    }
  }

  private initRightList() {
    queryDetail({ ztbh: this.tableDatas[0].ztbh }).then(res => {
      this.tableList = res.data
    })
  }

  private deleteRow(val: any) {
    queryDetail({ ztbh: val }).then(res => {
      this.tableList = res.data.map((item: any, index: number) => {
        item.webSortNumber = index + 1
        return item
      })
    })
  }

  private pushKsList(val: any) {
    console.log(val)
    this.KSDM = val
    if (this.searchData.ksdm == 0) {
      this.searchData.sslb = 3
    } else {
      this.searchData.sslb = 2
    }
    const el: any = this.$refs.suiteList
    el.getList()
  }

  // 点击一行数据，把该行数据的ztbh 传给旁边的list，保存的时候需要用
  private getRow(value: ISuiteTypeList) {
    if (value == null) {
      this.tableList = []
      return
    }
    this.searchDataDetail.ztbh = value.ztbh
    this.searchDataDetail.ztlb = value.ztlb
    this.searchDataDetail.yp.drugType = value.ztlb
    if (value.ztbh === null || value.ztbh === undefined) {
      return null
    } else if (value.ztlb == 4) {
      this.isSelect = true
      queryDetailXm({ ztbh: value.ztbh }).then(res => {
        this.tableList = res.data.map((item: any, index: number) => {
          item.webSortNumber = index + 1
          return item
        })
      })
    } else if (value.ztlb != 4) {
      this.isSelect = true
      queryDetail({ ztbh: value.ztbh }).then(res => {
        this.tableList = res.data
        //   .map((item: any, index: number) => {
        //   item.webSortNumber = index + 1
        //   item.gytj = item.gytj + ''
        //   return item
        // })
      })
    }
  }

  // 过滤科室
  private searchKsdm(value: any) {
    // 总是从原数组中过滤
    this.ksdmList1 = this.ksdmList.filter((item: any) => {
      console.log(item.py)

      return item.py.indexOf(value.toUpperCase()) > -1
    })
  }
}
</script>

<style lang="scss" scoped>
.his-suite {
  .top-header {
    position: relative;
    padding: 8px 10px;
    background: #fff;
    border-radius: 8px;
    height: 40px;

    .main-header {
      padding-bottom: 10px;
      border-bottom: 1px solid #f5f6f8;
      display: flex;
      align-content: center;
      align-items: baseline;
    }
  }

  ::v-deep .el-radio__label {
    font-size: 13px;
    padding-left: 4px;
  }

  .el-radio {
    margin-right: 10px;
  }

  .label {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 24px;
    .title {
      font-family: siyuanMedium;
    }
    .el-divider--vertical {
      margin: 0 10px;
    }
  }
}
</style>
