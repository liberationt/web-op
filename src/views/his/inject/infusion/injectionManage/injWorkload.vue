<!--
 * @Date:
 * @LastEditTime:
 * @Description: 注射工作量统计
 * @FilePath:
-->

<template>
  <div class="content opertionIncome">
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="his-module his-small" :style="{ marginBottom: '10px' }">
          <div class="row" style="border:none;padding-bottom:0px;margin-bottom:0px">
            <div class="label">
              <!-- <div class="searchTitle">科室</div>
              <el-select v-model="searchData.ks">
                <el-option label="科室" :value="1"></el-option>
                <el-option label="注射科室" :value="2"></el-option>
              </el-select> -->
              <div class="searchTitle">注射日期</div>
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
                <el-button @click="getList1">
                  <i class="icon his-caozuo_search"></i>查询
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="ht">
        <div class="his-module his-small ht" :style="{ height: listSlotHeight  - 65  + 'px' }">
          <div class="row">
            <div class="label">
              <div class="title">注射工作量统计</div>
            </div>
          </div>
          <el-table
            :data="tableData1"
            border
            stripe
            slot="list"
            :height="listSlotHeight - 160"
            :highlight-current-row="true"
            @row-click="getDetail"
            class="scroll-bar"
          >
            <el-table-column prop="syrq" :label="$t('注射日期')"></el-table-column>
            <el-table-column prop="count" :label="$t('人次')" min-width="60"></el-table-column>
          </el-table>
          <div class="residue bottom-bar">
            <p>
              {{$t('合计')}}：
              <em style="color:#1485FF">{{count}}</em>
            </p>
          </div>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="his-module his-small" :style="{ height: listSlotHeight - 65  + 'px'}">
          <div class="row">
            <div class="label">
              <div class="title">工作量统计明细</div>
            </div>
          </div>
          <pagenation-list
            ref="pageTable2"
            v-model="tableData2"
            data-url="/op-service/syjydjzb/doQueryDjCfList"
            http-method="post"
            :searchData="searchData2"
            :list-height="listSlotHeight"
            :highlight-current-row="true"
            @reqComplete="groupColor2"
          >
            <el-table
              :data="tableData2"
              border
              stripe
              slot="list"
              :height="listSlotHeight-160"
              class="scroll-bar"
            >

              <!-- 注射序号 -->
              <el-table-column prop="xh" :label="$t('序号')" width="44"></el-table-column>

              <el-table-column label width="14" align="center">
                <template slot-scope="scope">
                  <div class="w100" :class="scope.row.colorFlag ? 'greenBack' : 'orangeBack'"></div>
                </template>
              </el-table-column>

              <!-- 注射登记时间 -->
              <el-table-column
                prop="djsj"
                :label="$t('注射登记时间')"
                min-width="140"
              ></el-table-column>

              <!-- 药品名称 -->
              <el-table-column prop="ypmc" :label="$t('药品名称')" min-width="160" show-overflow-tooltip></el-table-column>

              <!-- 规格 -->
              <el-table-column prop="ypgg" :label="$t('规格')" min-width="80" show-overflow-tooltip></el-table-column>

              <!-- 产地 -->
              <el-table-column prop="ypcd" :label="$t('产地')" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="ypcdList.find(item => item.dv==scope.row.ypcd)" class="text-ellipsis">
                    {{ypcdList.find(item => item.dv==scope.row.ypcd).dn}}
                  </div>
                  <div v-else>{{scope.row.ypcd}}</div>
                </template>
              </el-table-column>

              <!-- 剂量 -->
              <el-table-column prop="ypjl" :label="$t('剂量')" min-width="60">
                <template slot-scope="scope">
                  {{scope.row.ypjl}}{{scope.row.jldw}}
                </template>
              </el-table-column>

              <!-- 频次 -->
              <el-table-column prop="sypc" :label="$t('频次')" min-width="60" class-name="text-blue-td"></el-table-column>

              <!-- 途径 -->
              <el-table-column prop="gytj" :label="$t('途径')" min-width="60" class-name="text-blue-td">
                <template slot-scope="scope">
                  <div v-if="infusionWalyList.find(item => item.dv==scope.row.gytj)" class="text-ellipsis">
                    {{infusionWalyList.find(item => item.dv==scope.row.gytj).dn}}
                  </div>
                  <div v-else>{{scope.row.gytj}}</div>
                </template>
              </el-table-column>

              <!-- 天数 -->
              <el-table-column prop="yyts" :label="$t('天数')" min-width="60" class-name="text-blue-td"></el-table-column>

              <!-- 总量 -->
              <el-table-column prop="ypsl" :label="$t('总量')" min-width="60" class-name="text-blue-td"></el-table-column>

              <!-- 医生 -->
              <el-table-column prop="ysdm" :label="$t('医生')" min-width="80">
                <template slot-scope="scope">
                  <div v-if="docList.find(item => item.dv==scope.row.ysdm)" class="text-ellipsis">
                    {{docList.find(item => item.dv==scope.row.ysdm).dn}}
                  </div>
                  <div v-else>{{scope.row.ysdm}}</div>
                </template>
              </el-table-column>

              <!-- 说明 -->
              <el-table-column prop="bzmc" :label="$t('说明')" min-width="80"></el-table-column>

              <!-- 注射完成时间 -->
              <el-table-column
                prop="wcsj"
                :label="$t('注射完成时间')"
                min-width="140"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang='ts' >
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  aQueryAllDjCount
} from '@/api/his/inject/infusion/infusionWorkload.ts'
import { getNow } from '@/api/his/basic'
import { parseTime } from '@/utils'
import { groupColor2 } from '@/views/his/inject/untils.ts'

@Component({
  name: 'drugLable',
  components: {},
})
export default class extends Vue {
  private listSlotHeight: number = 0 //列表高度
  private daterange: any[] = []
  private data: object = {}
  private value1: any = ''
  private tableData1: Array<any> = []
  private tableData2: Array<any> = []
  private searchData2: any = {
    ksdm: '',
    kslb: 2,
    syrq: ''
  }
  private ksdm: any = Vue.prototype.AUTHORITY.bussinessRole
  private ypcdList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_DRUGMADEIN_DICT : this.$store.state.webSqlDict.DRUG_DRUGMADEIN_DICT // 药品产地
  private docList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT // 医生列表
  private infusionWalyList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_METHOD_DICT : this.$store.state.webSqlDict.DRUG_METHOD_DICT // 发药方式（给药途径）

  get count(){
    let count = 0
    this.tableData1.forEach((item: any)=>{
      count += item.count
    })
    return count
  }

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

  // 获取人次
  private getList1(){
    if(this.daterange.length==0){
      this.$notify({
        title: '请选择日期',
        message: '',
        type: 'warning'
      })
      return false
    }
    let params = {
      beginDay: this.daterange[0],
      endDay: this.daterange[1],
      ksdm: this.ksdm,
      kslb: 2
    }
    aQueryAllDjCount(params).then((res: any) => {
      if(res){
        this.tableData1 = res.data
        this.tableData2 = []
      }
    })
  }

  // 获取处方详情
  private getDetail(row: any){
    this.searchData2.syrq = row.syrq
    const table2: any = this.$refs.pageTable2
    table2.getList()
  }

  // 分组处理
  private groupColor2(){
    this.tableData2 = groupColor2(this.tableData2)
  }

  //左侧表格数据
  private handleDelete() {}
  //点击当前行
  private rowData() {}
  //新增
  private AddCatalogue() {}




  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
    this.getTime()
    this.searchData2.ksdm = this.ksdm
  }
}
</script>

<style scoped lang='scss'>
.date-wrapper{
  width: 240px;
}


.residue {
  padding: 0 0 8px;
  height: 32px;
}
// 底部合计
.row.bottom-bar {
  padding: 0;
  margin-top: 8px;
  margin-bottom: 0;
}
</style>
