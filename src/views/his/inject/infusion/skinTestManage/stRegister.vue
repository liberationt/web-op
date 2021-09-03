// 皮试登记
<template>
  <div class="content">
    <el-row :gutter="10" class="ht">
      <el-col :span="24">
        <div
          class="his-module his-small"
          :style="{ height: listSlotHeight1 + 'px', marginBottom: '10px' }"
        >
          <pagenation-list
            ref="table1"
            v-model="tableData1"
            data-url="/op-service/skindjzb/doQueryPsDjList"
            http-method="post"
            :list-height="listSlotHeight1 - 94"
            :searchData="searchData1"
            @reqComplete="calcTimeDiff"
          >
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">皮试登记</h1>
                <el-divider direction="vertical" class="mr4"></el-divider>
                <el-checkbox-group v-model="searchData1.zt" @change="changQueryZt">
                  <el-checkbox :label="0">未开始</el-checkbox>
                  <el-checkbox :label="1">皮试中</el-checkbox>
                  <el-checkbox :label="2">皮试完成</el-checkbox>
                </el-checkbox-group>
                <el-divider direction="vertical" class="mr4"></el-divider>
                <el-date-picker
                  type="daterange"
                  v-model="date"
                  value-format="yyyy-MM-dd"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  class="date-wrapper"
                ></el-date-picker>
                <el-divider direction="vertical" class="mr4"></el-divider>
                <div class="btn">
                  <el-button size="mini" type="text" @click="seachDataList"><i class="icon his-search"></i>查询</el-button>
                </div>
                <el-divider direction="vertical" class="mr4"></el-divider>
                <div class="btn">
                  <el-button @click="openDiolag">
                    <i class="icon his-patient-info" />登记
                  </el-button>
                </div>
                <!-- {{now}} -->
              </div>
            </div>
            <el-table
              :data="tableData1"
              border
              :fit="true"
              stripe
              :highlight-current-row="true"
              slot="list"
              @row-click="handleRowClick1"
              :height="listSlotHeight1 - 94"
              class="scroll-bar"
            >
              <el-table-column prop="webSortNumber" lable="序号" width="32"></el-table-column>

              <!-- 状态 -->
              <el-table-column prop="zt" label="状态" min-width="60">
                <template scope="scope">
                  <div v-if="scope.row.zt==0" class="yellow">未开始</div>
                  <div v-if="scope.row.zt==1" class="blues">皮试中</div>
                  <div v-if="scope.row.zt==2" class="reds">皮试完</div>
                </template>
              </el-table-column>

              <!-- 登记时间 -->
              <el-table-column prop="djsj" label="登记时间" min-width="140"></el-table-column>

              <!-- 姓名 -->
              <el-table-column prop="brxm" label="患者姓名" min-width="80"></el-table-column>

              <!-- 性别 -->
              <el-table-column prop="brxb" label="性别" min-width="60">
                <template slot-scope="scope">
                  <div v-if="genderList.find(item => item.dv==scope.row.brxb)" class="text-ellipsis">
                    {{genderList.find(item => item.dv==scope.row.brxb).dn}}
                  </div>
                  <div v-else>{{scope.row.brxb}}</div>
                </template>
              </el-table-column>

              <!-- 年龄 -->
              <el-table-column prop="ages" label="年龄" min-width="60"></el-table-column>
              <!-- <el-table-column label="发票号" width="100"></el-table-column> -->

              <!-- 皮试项目 -->
              <el-table-column prop="psmc" label="皮试项目"></el-table-column>

              <!-- 开始时间 -->
              <el-table-column prop="kssj" label="皮试开始时间" min-width="140"></el-table-column>

              <!-- 结束时间 -->
              <el-table-column prop="jssj" label="皮试结束时间" min-width="140"></el-table-column>

              <!-- 建议时长 -->
              <el-table-column prop="pssc" label="建议时长(分)" min-width="92"></el-table-column>

              <!-- 后端实际时长 -->
              <!-- <el-table-column prop="sjpssc" label="后端实际时长"></el-table-column> -->

              <!-- 实时时间差 -->
              <!-- <el-table-column prop="timeDiff" label="实时"></el-table-column> -->

              <!-- 页面实际时长 -->
              <el-table-column label="实际时长">
                <template slot-scope="scope">
                  <div v-if="scope.row.zt!=0" :class="scope.row.timeDiff<scope.row.pssc*60*1000?'reds':''">
                    {{useMsecToHms(scope.row.timeDiff)}}
                  </div>
                </template>
              </el-table-column>

              <!-- 皮试结果 -->
              <el-table-column prop="psjg" label="皮试结果" min-width="66" align="center">
                <template slot-scope="scope">
                  <div v-if="skintestResults.find(item => item.value==scope.row.psjg)">
                    <div :class="scope.row.psjg==2?'blues':'reds'">
                      {{skintestResults.find(item => item.value==scope.row.psjg).name}}
                    </div>
                  </div>
                  <div v-else>{{scope.row.psjg}}</div>
                </template>
              </el-table-column>

              <!-- 操作 -->
              <el-table-column label="操作" width="100" align="center" class-name="action-btns">
                <template slot-scope="scope">

                  <el-tooltip :content="'开始皮试'" effect="light">
                    <el-popconfirm
											:title="'确认开始皮试？'"
											:confirmButtonText="$t('common.confirm')"
											:cancelButtonText="$t('common.cancel')"
                      @confirm="startPs(scope.row)"
											hideIcon
                    >
                      <el-button
                        slot="reference"
                        class="green"
                        :disabled="scope.row.zt!=0"
                      >
                        <i class="icon his-tree-tuck-up" style="left:60%"></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>

                  <el-tooltip :content="'填写结果'" effect="light">
                    <span class="mr10">
                      <el-button
                        class="blue"
                        @click="dialogVisible=true"
                        :disabled="scope.row.zt!=1"
                      >
                        <i class="icon his-mokuai_yishenqianming"></i>
                      </el-button>
                    </span>
                  </el-tooltip>

                  <el-tooltip :content="'取消登记'" effect="light">
                    <el-popconfirm
											:title="'确认取消登记？'"
											:confirmButtonText="$t('common.confirm')"
											:cancelButtonText="$t('common.cancel')"
                      @confirm="cancelPs(scope.row)"
											hideIcon
                    >
                      <el-button
                        slot="reference"
                        class="red"
                        :disabled="scope.row.zt!=0"
                      >
                        <i class="icon his-youcaozuo-quxiao"></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>


                </template>
              </el-table-column>
            </el-table>
          </pagenation-list>
        </div>

        <div
          class="his-module his-small"
          :style="{ height: listSlotHeight2 + 'px' }"
        >
          <div class="row">
            <div class="label">
              <h1 class="title">皮试药名详情</h1>
            </div>
          </div>
          <el-table
            :data="tableData2"
            border
            :fit="true"
            stripe
            :highlight-current-row="true"
            slot="list"
            @row-click="handleRowClick2"
            :height="listSlotHeight2 - 62"
            class="scroll-bar"
          >
            <el-table-column type="index" width="32"></el-table-column>
            <el-table-column prop="kfrq" label="开方日期" min-width="140"></el-table-column>
            <el-table-column prop="ypmc" label="药品名称" min-width="160"></el-table-column>
            <el-table-column prop="ypgg" label="规格" min-width="80"></el-table-column>

            <!-- 产地 -->
            <el-table-column prop="ypcd" label="产地" min-width="80">
              <template slot-scope="scope">
                <div v-if="ypcdList.find(item => item.dv==scope.row.ypcd)" class="text-ellipsis">
                  {{ypcdList.find(item => item.dv==scope.row.ypcd).dn}}
                </div>
                <div v-else>{{scope.row.ypcd}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="ypjl" label="剂量" min-width="80"></el-table-column>
            <el-table-column prop="sypc" label="频次" min-width="80"></el-table-column>

            <!-- 途径 -->
            <el-table-column prop="gytj" label="途径" min-width="80">
              <template slot-scope="scope">
                <div v-if="infusionWalyList.find(item => item.dv==scope.row.gytj)" class="text-ellipsis">
                  {{infusionWalyList.find(item => item.dv==scope.row.gytj).dn}}
                </div>
                <div v-else>{{scope.row.gytj}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="yyts" label="天数" min-width="60"></el-table-column>

            <!-- 医生 -->
            <el-table-column prop="ysdm" label="医生" min-width="80">
              <template slot-scope="scope">
                <div v-if="docList.find(item => item.dv==scope.row.ysdm)" class="text-ellipsis">
                  {{docList.find(item => item.dv==scope.row.ysdm).dn}}
                </div>
                <div v-else>{{scope.row.ysdm}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="bzmc" label="说明" min-width="80"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-- 填写结果 -->
    <el-dialog
      :title="'皮试结果'"
      :visible.sync="dialogVisible"
      width="300px"
      :close-on-click-modal="false"
      class="his-small"
      @close="closeDialog"
    >
      <el-radio-group v-model="psjg">
        <el-radio
          v-for="item in skintestResults"
          :key="item.value"
          :label="item.value"
        >{{item.name}}</el-radio>
      </el-radio-group>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="endPs"
          :disabled="psjg==''?true:false"
          :loading="loading3"
        >确定</el-button>
      </span>
    </el-dialog>

    <stRegDialog
      ref="diolagForm"
      :ypcdList="ypcdList"
      :docList="docList"
      :deptList="deptList"
      :infusionWalyList="infusionWalyList"
      @registered="getList1"
    />
    <!-- <pre>{{tableData1}}</pre> -->
    <!-- <pre>{{timers}}</pre> -->
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  aDoPsProcess, aPsFinish, aPsCancel, aQueryDjmx
} from '@/api/his/inject/infusion/skinTest.ts'
import { getNow } from '@/api/his/basic'
import { parseTime, msecToHms } from '@/utils'
import { groupColor } from '@/views/his/inject/untils.ts'
import dayjs from 'dayjs'
import stRegDialog from './components/stRegDialog.vue'

@Component({
  name: 'purchaseInputStore',
  components: { stRegDialog },
})
export default class extends Vue {
  private listSlotHeight1: number = 0
  private listSlotHeight2: number = 0
  private tableData1: any[] = []
  private tableData2: any[] = []
  private curRow1: any = {}
  private searchData1: any = {
    ksdm: '',
    zt: [0, 1], // 0:未开始 1:皮试中 2:皮试完成
    djsj_ks:'',
    djsj_js:''
  }
  private date: any[] = []
  private checkList: any = []
  private diolag: boolean = false
  private ksdm: any = Vue.prototype.AUTHORITY.bussinessRole // 当前输液科室
  private genderList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT // 性别
  private ypcdList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_DRUGMADEIN_DICT : this.$store.state.webSqlDict.DRUG_DRUGMADEIN_DICT // 药品产地
  private docList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT // 医生列表
  private deptList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.OUTPATIENT_DEPARTMENT : this.$store.state.webSqlDict.OUTPATIENT_DEPARTMENT // 门诊科室
  private infusionWalyList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_METHOD_DICT : this.$store.state.webSqlDict.DRUG_METHOD_DICT // 发药方式（给药途径）
  private skintestResults: any[] = [
    {value: 2, name: '(-)'},
    {value: 3, name: '(+)'},
  ]
  private now: number = 0 // 当前时间戳
  private timers: any = {} // 列表内所有计时器

  private dialogVisible: boolean = false
  private psjg: any = '' // 填写皮试结果
  private loading3: boolean = false

  // dayjs
	private useDayjs(){
		return dayjs()
  }

  // 时间差（毫秒数）转时分秒
	private useMsecToHms(msec: number){
    return msecToHms(msec)
    // return msec+10
  }

  // 获取当前时间
  // 每次刷新列表前都先修正当前时间
  private getNow() {
    getNow().then((res: any) => {
      if (res) {
        this.now = res.data
        let date = parseTime(res.data, '{y}-{m}-{d}')
        this.date = [date, date]
        // this.getList1()
      }
    })
  }
  //通过查询搜索
  private seachDataList(){
    this.searchData1.djsj_ks = this.date&&this.date.length?this.date[0]:''
    this.searchData1.djsj_js = this.date&&this.date.length?this.date[1]:''
    this.getList1()
  }
  // 获取table1
  private getList1(){
    const table1: any = this.$refs.table1
    table1.getList()
    this.tableData2 = []
  }

  // 计算实际时长
  private calcTimeDiff(){
    console.log('开始计算时长');
    this.tableData1.forEach((item: any)=>{
      if(item.zt == 1){ // 皮试中
        this.$set(item, 'timeDiff', this.now - new Date(item.kssj).getTime())
        this.$set(this.timers, item.djdh, setInterval(()=>{
          item.timeDiff+=1000
        }, 1000))
      }
      if(item.zt == 2){ // 皮试完
        this.$set(item, 'timeDiff', new Date(item.jssj).getTime() - new Date(item.kssj).getTime())
      }
    })
  }

  // 改变搜索状态
  private changQueryZt(value: any){
    // this.getNow()
    this.getList1()
  }

  private openDiolag() {
    ;(this.$refs.diolagForm as any).open()
  }

  private handleRowClick1(row: any){
    this.curRow1 = row
    let params = {
      djdh: row.djdh,
      ksdm: this.ksdm
    }
    aQueryDjmx(params).then((res: any) => {
      if(res){
        this.tableData2 = res.data
      }
    })
  }

  private handleRowClick2(row: any){}

  // 开始皮试
  startPs(row: any){
    let params = {
      djdh: row.djdh,
      ksdm: this.ksdm,
      txrdm: JSON.parse(localStorage.userInfo).userId,
    }
    aDoPsProcess(params).then((res: any) => {
      if(res){
        // this.getNow()
        this.getList1()
        // getNow().then((res: any) => {
        //   if(res){
        //     row.kssj = parseTime(res.data)
        //     let now = dayjs(row.kssj)
        //     row.sjpssc = now.diff(row.kssj, 'second')
        //     row.zt = 1

        //     this.$set(this.timers, row.djdh, setInterval(()=>{
        //       row.sjpssc+=1000
        //     }, 1000))

        //     // let timer = setInterval(()=>{
        //     //   row.sjpssc+=1000
        //     // }, 1000)
        //   }
        // })


      }
    })
  }

  endPs(){
    console.log('结束计时');
    this.loading3 = true
    let params = {
      djdh: this.curRow1.djdh,
      ksdm: this.ksdm,
      psjg: this.psjg,
      txrdm: JSON.parse(localStorage.userInfo).userId,
    }
    aPsFinish(params).then((res: any) => {
      if(res){
        this.$notify({
          title: '皮试已结束',
          message: '',
          type: 'success'
        })
        this.dialogVisible = false
        this.loading3 = false
        // this.getNow()
        this.getList1()
        clearInterval(this.timers[this.curRow1.djdh])
      }
    })
  }

  cancelPs(row: any){
    let params = {
      djdh: row.djdh,
      ksdm: this.ksdm,
      txrdm: JSON.parse(localStorage.userInfo).userId,
    }
    aPsCancel(params).then((res: any) => {
      if(res){
        this.$notify({
          title: '登记已取消',
          message: '',
          type: 'success'
        })
        // this.getNow()
        this.getList1()
      }
    })
  }

  private closeDialog(){
    this.psjg = ''
  }

  created() {
    this.listSlotHeight1 = Vue.prototype.PageHeight * .6
    this.listSlotHeight2 = Vue.prototype.PageHeight * .4 - 20
  }
  async mounted() {
    this.searchData1.ksdm = this.ksdm
    await this.getNow()
    await this.getList1()

  }
}
</script>
<style lang="scss" scoped>
.el-checkbox-group {
  display: flex;
  margin-left: 5px;
}
.el-checkbox {
  margin-right: 10px;
}
.el-checkbox__label {
  font-size: 13px !important;
  color: #222b31 !important;
}

.el-dialog__wrapper{
  ::v-deep .el-dialog__body{
    padding-bottom: 30px;
    text-align: center;
  }
  .el-radio{
    margin-right: 30px;
    &:nth-last-child(1){
      margin-right: 0;
    }
  }
  .dialog-footer{
    .el-button.is-disabled{
      opacity: .6;
    }
  }
}

pre{
  position: absolute;
  left: 0;
  bottom: 0;
  font-size: 12px;
  background: rgba($color: #fff, $alpha: .5);
}
</style>
