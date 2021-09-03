<!--
 * @Date:
 * @LastEditTime:
 * @Description: 皮试工作量统计
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
                <el-option label="输液科室" :value="2"></el-option>
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
              <div class="title">皮试工作量统计</div>
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
            <el-table-column prop="psrq" :label="$t('皮试日期')"></el-table-column>
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
            data-url="/op-service/skindjzb/doQueryDjList"
            http-method="post"
            :searchData="searchData2"
            :list-height="listSlotHeight"
            :highlight-current-row="true"
            @reqComplete="calcTimeDiff"
          >
            <el-table
              :data="tableData2"
              border
              stripe
              slot="list"
              :height="listSlotHeight-160"
              class="scroll-bar"
            >

              <!-- 序号 -->
              <el-table-column type="index" width="32"></el-table-column>

              <!-- 状态 -->
              <el-table-column prop="zt" label="状态" min-width="60">
                <template scope="scope">
                  <div v-if="scope.row.zt==0" class="yellow">未开始</div>
                  <div v-if="scope.row.zt==1" class="blues">皮试中</div>
                  <div v-if="scope.row.zt==2" class="reds">皮试完</div>
                </template>
              </el-table-column>

              <!-- 姓名 -->
              <el-table-column prop="brxm" :label="'患者姓名'" min-width="80"></el-table-column>

              <!-- 性别 -->
              <el-table-column prop="brxb" :label="'性别'" min-width="60">
                <template slot-scope="scope">
                  <div v-if="genderList.find(item => item.dv==scope.row.brxb)" class="text-ellipsis">
                    {{genderList.find(item => item.dv==scope.row.brxb).dn}}
                  </div>
                  <div v-else>{{scope.row.brxb}}</div>
                </template>
              </el-table-column>

              <!-- 年龄 -->
              <el-table-column prop="age" :label="'年龄'" min-width="60"></el-table-column>

              <!-- 登记时间 -->
              <el-table-column prop="djsj" :label="'登记时间'" min-width="140"></el-table-column>

              <!-- 皮试项目 -->
              <el-table-column prop="psmc" :label="'皮试项目'" show-overflow-tooltip></el-table-column>

              <!-- 皮试开始时间 -->
              <el-table-column prop="kssj" :label="'皮试开始时间'" min-width="140"></el-table-column>

              <!-- 皮试结束时间 -->
              <el-table-column prop="jssj" :label="'皮试结束时间'" min-width="140"></el-table-column>

              <!-- 建议时长 -->
              <el-table-column prop="pssc" :label="'建议时长'"></el-table-column>

              <!-- 后端实际时长 -->
              <!-- <el-table-column prop="sjpssc" :label="'实际时长'"></el-table-column> -->

              <!-- 实时时间差 -->
              <!-- <el-table-column prop="timeDiff" label="实时"></el-table-column> -->

              <!-- 页面实际时长 -->
              <el-table-column :label="'实际时长'">
                <template slot-scope="scope">
                  <div v-if="scope.row.zt!=0" :class="scope.row.timeDiff<scope.row.pssc*60*1000?'reds':''">
                    {{useMsecToHms(scope.row.timeDiff)}}
                  </div>
                </template>
              </el-table-column>

              <!-- 结果 -->
              <el-table-column prop="psjg" :label="'皮试结果'" min-width="66" align="center">
                <template slot-scope="scope">
                  <div v-if="skintestResults.find(item => item.value==scope.row.psjg)">
                    <div :class="scope.row.psjg==2?'blues':'reds'">
                      {{skintestResults.find(item => item.value==scope.row.psjg).name}}
                    </div>
                  </div>
                  <div v-else>{{scope.row.psjg}}</div>
                </template>
              </el-table-column>

              <!-- 皮试人 -->
              <el-table-column prop="txrdm" :label="'皮试人'">
                <template slot-scope="scope">
                  <div v-if="docList.find(item => item.dv==scope.row.txrdm)" class="text-ellipsis">
                    {{docList.find(item => item.dv==scope.row.txrdm).dn}}
                  </div>
                  <div v-else>{{scope.row.txrdm}}</div>
                </template>
              </el-table-column>

            </el-table>
          </pagenation-list>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang='ts' >
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aQueryAllDjCount } from '@/api/his/inject/infusion/skinTest.ts'
import { getNow } from '@/api/his/basic'
import { parseTime, msecToHms } from '@/utils'
import { groupColor } from '@/views/his/inject/untils.ts'

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
    kslb: 1,
    psrq: ''
  }
  private ksdm: any = Vue.prototype.AUTHORITY.bussinessRole
  private genderList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT
  private ypcdList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_DRUGMADEIN_DICT : this.$store.state.webSqlDict.DRUG_DRUGMADEIN_DICT // 药品产地
  private docList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT // 医生列表
  private infusionWalyList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_METHOD_DICT : this.$store.state.webSqlDict.DRUG_METHOD_DICT // 发药方式（给药途径）
  // private skintestResults: any[] = this.$store.state.webSqlDict.PS_RESULT_DICT // 皮试结果
  private skintestResults: any[] = [
    {value: 2, name: '(-)'},
    {value: 3, name: '(+)'},
  ]

  private now: number = 0 // 当前时间戳
  private timers: any = {} //所有定时器

  get count(){
    let count = 0
    this.tableData1.forEach((item: any)=>{
      count += item.count
    })
    return count
  }

  // 时间差（毫秒数）转时分秒
	private useMsecToHms(msec: number){
    return msecToHms(msec)
  }

  // 获取当前时间
  private getTime(){
    getNow().then((res: any) => {
      if(res){
        let date0 = parseTime(res.data, '{y}-{m}-01')
        let date1 = parseTime(res.data, '{y}-{m}-{d}')
        this.daterange = [date0, date1]
        this.now = res.data
      }
    })
  }

  // 获取人次
  private getList1(){
    console.log(this.daterange);
    if(this.daterange==null||this.daterange.length==0){
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
    }
    aQueryAllDjCount(params).then((res: any) => {
      if(res){
        this.tableData1 = res.data
        this.tableData2 = []
      }
    })
  }

  // 获取工作量明细
  private getDetail(row: any){
    // 先修正当前时间
    getNow().then((res: any) => {
      if(res){
        this.now = res.data
        // 再获取列表
        this.searchData2.psrq = row.psrq
        const table2: any = this.$refs.pageTable2
        table2.getList()
      }
    })
  }

  // 计算实际时长
  private calcTimeDiff(){
    console.log('开始计算时长');
    this.tableData2.forEach((item: any)=>{
      if(item.zt == 1){ // 皮试中
        this.$set(item, 'timeDiff', this.now - new Date(item.kssj).getTime())
        this.$set(this.timers, item.djdh, setInterval(()=>{
          item.timeDiff+=1000
        }, 1000))
      }
      else{ // 皮试完
        this.$set(item, 'timeDiff', new Date(item.jssj).getTime() - new Date(item.kssj).getTime())
      }
    })
  }

  // 分组处理
  private groupColor(){
    this.tableData2 = groupColor(this.tableData2)
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
