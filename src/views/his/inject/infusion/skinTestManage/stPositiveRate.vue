<!--
 * @Author: dmj
 * @LastEditTime: 2020-05-26 14:22:40
 * @LastEditors: dmj
 * @Description:皮试阳性率
 * @FilePath:
-->
<template>
  <div class="content">
    <div class="his-module his-small upper" style="display:none">
      <div class="row">
        <div class="label">
          <!-- <div class="searchTitle">科室</div>
          <el-select v-model="searchData.ks">
            <el-option :value="1">注射室</el-option>
          </el-select> -->
          <div class="searchTitle">皮试日期</div>
          <el-date-picker
            type="daterange"
            v-model="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="date-wrapper"
          ></el-date-picker>
          <el-divider direction="vertical" class="mr4"></el-divider>
          <div class="btn">
            <el-button @click="getList">
              <i class="icon his-caozuo_search"></i>查询
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="his-module his-small lower">
      <div class="row">
        <div class="label">
          <div class="title">皮试阳性率统计</div>
          <el-divider direction="vertical" class="mr4"></el-divider>
          <div class="searchTitle">皮试日期</div>
          <el-date-picker
            type="daterange"
            v-model="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="date-wrapper"
          ></el-date-picker>
          <el-divider direction="vertical" class="mr4"></el-divider>
          <div class="btn">
            <el-button @click="getList">
              <i class="icon his-caozuo_search"></i>查询
            </el-button>
          </div>
        </div>
      </div>
      <pagenation-list
        ref="pageTable"
        v-model="tableData"
        data-url="/op-service/skindjzb/doQueryPsAllergy"
        http-method="post"
        :list-height="listSlotHeight"
        :searchData="searchData"
      >
        <el-table
          :data="tableData"
          border
          stripe
          highlight-current-row
          fit
          slot="list"
          :height="listSlotHeight"
          class="scroll-bar"
        >
          <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
          <el-table-column label="皮试项目" prop="psmc" />
          <el-table-column label="总人数" prop="count" />
          <el-table-column label="阳性人数" prop="yxCount" class-name="text-red-td" />
          <el-table-column label="阴性人数" prop="yyxCount" class-name="text-blue-td" />
          <el-table-column label="阳性率" prop="yxRate" />
        </el-table>
      </pagenation-list>
    </div>
    <!-- </el-col> -->
    <!-- </el-row> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aQueryPsAllergy } from '@/api/his/inject/infusion/skinTest.ts'
import { getNow } from '@/api/his/basic'
import { parseTime } from '@/utils'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'SummaryInfusion',
  components: {},
})
export default class extends Vue {
  private daterange: any[] = []
  private tableData: any[] = [
    // {psmc: '青霉素皮试', count: 100, yxCount: 10, yyxCount: 90, yxRate: '10%'}
  ]
  private listSlotHeight: number = 0
  private searchData: any = {
    beginDay: '',
    endDay: '',
    ksdm: ''
  }
  private ksdm: any = Vue.prototype.AUTHORITY.bussinessRole

  // 获取当前时间
  private getTime(){
    getNow().then((res: any) => {
      if(res){
        let date0 = parseTime(res.data, '{y}-{m}-01')
        let date1 = parseTime(res.data, '{y}-{m}-{d}')
        this.daterange = [date0, date1]
      }
    })
  }

  // 获取表格
  private getList(){
    this.searchData.beginDay = this.daterange[0]
    this.searchData.endDay = this.daterange[1]
    const table: any = this.$refs.pageTable
    table.getList()
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 106
    this.getTime()
    this.searchData.ksdm = this.ksdm
  }
  mounted() {}
}
</script>

<style lang="scss" scoped>
.upper{
  height: auto;
  margin-bottom: 10px;
  .row{
    margin-bottom: 0;
    padding-bottom: 0;
    border: none;
  }
}
.lower{
  // height: auto;
  height: 100%;
}
.date-wrapper{
  width: 240px;
}
::v-deep .action span {
  color: #ffffff;
}
</style>
