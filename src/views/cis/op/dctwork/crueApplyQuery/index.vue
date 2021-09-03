//治疗预约
<template>
    <div class="content">
        <div class="his-small his-module">
            <pagenation-list ref="pageTable"
                             v-model="tableDatas"
                             data-url="/mtdms-service/zlsqdyyzx/queryZlyyzxPage"
                             http-method="post"
                             :list-height="listSlotHeight"
                             :searchData="searchData">
                <div slot="header"
                     class="row">
                    <div class="label">
                        <!-- <div class="querySearch">
              <span class="tag pl0">病区</span>
              <search-select
                table-name="SYS_DICT_CONFIG"
                kid="18"
                v-model="searchData.brbq"
                :backfillValue="searchData.brbq"
                :placeholder="'请选择病区'"
              />
            </div>-->
                        <div class="querySearch">
                            <span class="tag">卡号</span>
                            <el-input v-model="searchData.kh"
                                      placeholder="请输入卡号"></el-input>
                            <el-button type="primary"
                                       class="blue-gra"
                                       size="mini">读卡</el-button>
                        </div>
                        <div class="querySearch">
                            <span class="tag pl0"
                                  style="margin-left:10px">治疗科室</span>
                            <search-select table-name="SYS_DICT_CONFIG"
                                           kid="51"
                                           v-model="searchData.zlksdm"
                                           :backfillValue="searchData.zlksdm"
                                           :placeholder="'请选择治疗科室'" />
                        </div>
                        <div class="querySearch">
                            <span class="tag">预约日期</span>
                            <el-date-picker style="width:220px"
                                            v-model="daterange"
                                            type="daterange"
                                            range-separator="-"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            class="date-wrapper"></el-date-picker>
                        </div>

                        <div class="btn">
                            <el-divider direction="vertical"
                                        class="mr4"></el-divider>
                            <el-button type="text"
                                       size="mini"
                                       @click="getList">
                                <i class="icon his-caozuo_search blue"></i>
                                <span>查询</span>
                            </el-button>
                        </div>
                    </div>
                </div>
                <el-table :data="tableDatas"
                          border
                          :fit="true"
                          stripe
                          :highlight-current-row="true"
                          slot="list"
                          :height="listSlotHeight-108"
                          class="scroll-bar">
                    <el-table-column label
                                     width="32"></el-table-column>
                    <el-table-column label="预约时间"
                                     prop="yysj"></el-table-column>
                    <el-table-column label="预约序号"
                                     prop="yyxh"></el-table-column>
                    <el-table-column label="门诊号码"
                                     prop="mzhm"></el-table-column>
                    <el-table-column label="患者姓名"
                                     prop="brxm"></el-table-column>
                    <el-table-column label="性别"
                                     prop="brxb">
                        <template slot-scope="scope">{{scope.row.brxb | xb2zh}}</template>
                    </el-table-column>
                    <el-table-column label="年龄"
                                     prop="age"></el-table-column>
                    <el-table-column label="治疗项目"
                                     prop="zlxmmc"></el-table-column>
                    <el-table-column label="治疗类别"
                                     prop="lbmc"></el-table-column>
                    <el-table-column label="治疗科室"
                                     prop="zlksdm">
                        <template slot-scope="scope">{{zlksList.find((item) => scope.row.zlksdm == item.dv) && zlksList.find((item) => scope.row.zlksdm == item.dv).dn}}</template>
                    </el-table-column>
                    <el-table-column label="科室"
                                     prop="ksdm">
                        <template slot-scope="scope">{{ksdmList.find((item) => scope.row.ksdm == item.dv) && ksdmList.find((item) => scope.row.ksdm == item.dv).dn}}</template>
                    </el-table-column>
                    <el-table-column label="医生"
                                     prop="ys">
                        <template slot-scope="scope">{{ysList.find((item) => item.dv == scope.row.sqysgh) && ysList.find((item) => item.dv == scope.row.sqysgh).dn}}</template>
                    </el-table-column>
                    <el-table-column label="状态"
                                     prop="zt">
                        <template slot-scope="scope">{{scope.row.zt | zt2zh}}</template>
                    </el-table-column>
                </el-table>
            </pagenation-list>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Style } from 'util'
import { getNow } from '@/api/his/basic'
import { parseTime } from '@/utils'
@Component({
  name: 'cureApplyQuery',
  components: {},
  filters: {
    xb2zh(val: number) {
      switch (val) {
        case 1:
          return '男'
        case 2:
          return '女'
      }
    },
    zt2zh(val: string) {
      switch (val) {
        case '1':
          return '部分预约'
        case '2':
          return '全部预约'
        case '3':
          return '部分执行'
        case '4':
          return '完成'
      }
    },
  },
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private searchData: any = {
    brlx: '1',
  }
  private list: any = []
  private tableDatas: any = []
  private ruleForm: object = {}
  private daterange: any[] = []

  private zlksList: Array<any> = [] // 治疗科室
  private ksdmList: Array<any> = [] // 科室
  private ysList: Array<any> = [] // 医生

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }

  mounted() {
    this.zlksList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.CRUE_DICT : this.$store.state.webSqlDict.CRUE_DICT
    this.ksdmList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DEP_CODE_DICT : this.$store.state.webSqlDict.DEP_CODE_DICT
    this.ysList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    getNow().then((res: any) => {
      let date = parseTime(res.data, '{y}-{m}-{d}')
      this.searchData.startDate = date
      this.searchData.endDate = date
      this.daterange = [date, date]
      this.$nextTick(() => {
        this.getList()
      })
    })
  }

  @Watch('daterange')
  private onDateRange(val: any[] | null) {
    if (val) {
      this.searchData.startDate = val[0]
      this.searchData.endDate = val[1]
    } else {
      this.searchData.startDate = ''
      this.searchData.endDate = ''
    }
  }

  private handleAdd() {}

  private getList() {
    console.log(Vue.prototype)
    this.searchData.ksdm = Vue.prototype.AUTHORITY.outpatientCode
    if (this.daterange) {
      ;(this.$refs.pageTable as any).getList()
    } else {
      this.$notify({
        title: '请选择时间',
        message: '',
        type: 'warning',
      })
    }
  }
}
</script>
