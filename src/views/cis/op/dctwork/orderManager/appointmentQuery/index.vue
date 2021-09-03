<template>
<!-- 患者列表-预约查询 -->
  <div class="content his-patient-query">
    <div class="his-module his-small">
      <div class="row">
        <div class="label">
          <span>预约状态</span>
          <!-- 0预约，1履约，2失约，3收费，4退约 -->
          <el-checkbox-group v-model="ruleForm.ghbzs">
            <el-checkbox :label="0">预约</el-checkbox>
            <el-checkbox :label="1">履约</el-checkbox>
            <el-checkbox :label="2">失约</el-checkbox>
            <el-checkbox :label="3">收费</el-checkbox>
            <el-checkbox :label="4">退约</el-checkbox>
          </el-checkbox-group>
          <el-divider direction="vertical"></el-divider>
          <div class="btn">
            <el-button @click="getList">
              <i class="his-caozuo_yuyuechaxun icon"></i>预约查询
            </el-button>
            <el-button @click="checkModify">
              <i class="his-caozuo_yuyuegengai icon"></i>预约更改
            </el-button>
            <el-button @click="reset">
              <i class="his-btn-del red icon"></i>清空
            </el-button>
            <el-button>
              <i class="his-btn-print icon"></i>
              {{ $t('common.print') }}
            </el-button>
          </div>
        </div>
      </div>
      <div class="row query-body">
        <!-- <div> -->
          <div class="label grid" >
            <div class="querySearch">
                <span class="searchTitle" >患者卡号</span>
                <el-input placeholder="请输入患者卡号" @keyup.enter.native="getList" v-model="ruleForm.jzkh"></el-input>
            </div>
            <div class="querySearch">
              <span class="searchTitle" >患者姓名</span>
              <el-input placeholder="请输入患者姓名" @keyup.enter.native="getList" v-model="ruleForm.brxm"></el-input>
            </div>
            <div class="querySearch">
              <span class="searchTitle" >身份证号</span>
              <el-input placeholder="请输入身份证号" @keyup.enter.native="getList" v-model="ruleForm.sfzh"></el-input>
            </div>

            <div class="querySearch">
              <span class="searchTitle">科室名称</span>
              <search-select
                class="w100"
                table-name="SYS_DICT_CONFIG"
                kid="13"
                v-model="ruleForm.kslb"
                :placeholder="$t('请选择科室')"
                :backfillValue="ruleForm.kslb"
              />
            </div>
            
          </div>
          <div class="label grid mt8">
            
            <div class="querySearch">
              <span class="searchTitle" >预约医生</span>
              <search-select
                class="w100"
                table-name="SYS_DICT_CONFIG"
                kid="17"
                v-model="ruleForm.yyys"
                :placeholder="$t('请选择医生')"
                :backfillValue="ruleForm.yyys"
              />
            </div>
            <div class="querySearch">
              <span class="searchTitle" >预约时间</span>
              <el-date-picker
                v-model="date"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :clearable="false"
                class="date-wrapper"
                style="width: 100%"
              ></el-date-picker>
            </div>

            <div class="querySearch">
              <span class="searchTitle" >值班类别</span>
              <!-- <el-select v-model="ruleForm.zblx" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select> -->
              <search-select
                class="w100"
                table-name="SYS_DICT_CONFIG"
                kid="77"
                v-model="ruleForm.zblx"
                :placeholder="$t('请选择班次')"
                :backfillValue="ruleForm.zblx"
              />
            </div>
            <div class="querySearch">
              
            </div>
          </div>
        <!-- </div> -->
      </div>
<!--      <div class="row">-->
<!--        <div class="label">-->
<!--          <div class="querySearch">-->
<!--            <div class="tag" style="font-size: 13px;">预约医生</div>-->
<!--            <search-select-->
<!--              class="w100"-->
<!--              style="width:149px"-->
<!--              table-name="SYS_DICT_CONFIG"-->
<!--              kid="17"-->
<!--              v-model="ruleForm.yyys"-->
<!--              :placeholder="$t('请选择医师')"-->
<!--              :backfillValue="ruleForm.yyys"-->
<!--            />-->
<!--            <div class="tag" style="white-space: nowrap; font-size: 13px; ">预约时间</div>-->
<!--            &lt;!&ndash; <el-date-picker v-model="ruleForm.dateFrom" type="date" placeholder="选择日期" style="width:149px"></el-date-picker>&nbsp;&nbsp;&nbsp;&nbsp;- -->
<!--            <el-date-picker v-model="ruleForm.dateTo" type="date" placeholder="选择日期" style="width:149px"></el-date-picker>&ndash;&gt;-->
<!--            &lt;!&ndash; <el-date-picker-->
<!--              v-model="value1"-->
<!--              type="daterang-->
<!--              range-separator="-"-->
<!--              start-placeholder="开始日期"-->
<!--              end-placeholder="结束日期"-->
<!--            ></el-date-picker> &ndash;&gt;-->
<!--            <div class="btn">-->
<!--              <el-divider direction="vertical"></el-divider>-->
<!--              <el-button @click="queryInfo">-->
<!--                <i class="his-caozuo_yuyuechaxun icon"></i>预约查询-->
<!--              </el-button>-->
<!--              <el-button>-->
<!--                <i class="his-caozuo_yuyuegengai icon"></i>预约更改-->
<!--              </el-button>-->
<!--              <el-button @click="reset">-->
<!--                <i class="his-btn-del red icon"></i>清空-->
<!--              </el-button>-->
<!--              <el-button>-->
<!--                <i class="his-btn-print icon"></i>-->
<!--                {{ $t('common.print') }}-->
<!--              </el-button>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

      <el-table
        :data="mockDatas"
        border
        :fit="true"
        stripe
        :highlight-current-row="true"
        @row-click="getCurRow"
        class="scroll-bar no-underline"
        :height="listSlotHeight"
        v-loading="loading"
      >
        <el-table-column type="index" width="32"></el-table-column>
        <el-table-column prop="cardno" label="卡号" min-width="100"></el-table-column>
        <el-table-column prop="brxm" width="70" label="姓名"></el-table-column>
        <el-table-column prop="brxb" width="45" label="性别">
          <template slot-scope="scope">
            <span v-if="genderList.find((item)=>item.dv==scope.row.brxb)">
              {{genderList.find((item)=>item.dv==scope.row.brxb).dn}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="csny" label="出生年月" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.csny">{{ scope.row.csny.substr(0,10) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sfzh" min-width="150" label="身份证号"></el-table-column>
        <el-table-column prop="ksdm" label="预约科室">
          <template slot-scope="scope">
            <span v-if="deptList.find((item)=>item.dv==scope.row.ksdm)">
              {{deptList.find((item)=>item.dv==scope.row.ksdm).dn}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="ysdm" label="预约医生">
          <template slot-scope="scope">
            <span v-if="docList.find((item)=>item.dv==scope.row.ysdm)">
              {{docList.find((item)=>item.dv==scope.row.ysdm).dn}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="ghsj" label="申请日期" width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.ghsj">{{ scope.row.ghsj.substr(0,10) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="yyrq" label="预约日期"></el-table-column>
        <el-table-column prop="zblb" label="类别" width="50">
          <template slot-scope="scope">
            <!-- {{scope.row.zblb|filterZblb}} -->
            <span v-if="zblbList.find((item)=>item.dv==scope.row.zblb)">
              {{zblbList.find((item)=>item.dv==scope.row.zblb).dn}}
            </span>
            <span v-else>{{scope.row.zblb}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="jhhm" label="叫号号码"></el-table-column>
        <el-table-column prop="ghbz" width="50" label="状态">
          <template slot-scope="scope">
            <span :class="scope.row.ghbz | filterColor">
              {{ghbzList.find((item)=>item.dv==scope.row.ghbz).dn}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="sfqh" width="70" label="是否取号">
          <template slot-scope="scope">
            <span v-if="yOrNList.find((item)=>item.dv==scope.row.sfqh)">
              {{yOrNList.find((item)=>item.dv==scope.row.sfqh).dn}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="qhyg" label="取号员工"></el-table-column>
        <el-table-column prop="qhsj" label="取号时间"></el-table-column>
        <el-table-column prop="lxdh" width="90" label="联系电话"></el-table-column>
      </el-table>
    </div>

    <!-- 预约更改 -->
    <appointmentModify
      :deptList="deptList"
      @succeeded="getList"
      ref="appointmentModify"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { queryInfo, Iitem } from '@/api/cis/op/dctwork/appointmentQuery.ts'
import { log } from 'util'
import { Form } from 'element-ui'
import { format } from 'url'
import appointmentModify from '../components/appointmentModify.vue'
import { getNow } from '@/api/his/basic'
import { parseTime } from '@/utils'

@Component({
  name: 'AppointmentQuery',
  components: {
    appointmentModify
  },
  filters: {
    filterZblb(zblb: any){
      if(zblb==1){
        return '上午'
      }
      if(zblb==2){
        return '下午'
      }
    },
    filterColor(value: number) {
      switch (value) {
        case 0: // 预约
          return 'greens'
        case 1: // 履约
          return 'blues'
        case 2: // 失约
          return 'reds'
        case 3: // 收费
          return 'reds'
        case 4: // 退约
          return 'yellow'
      }
    }
  }
})
export default class extends Vue {
  private value: string = ''
  private value1:any=''
  private mockDatas: Array<any> = []
  private listSlotHeight: number = 0
  private searchData: any = {}
  private ruleForm: any = {
    brxm: null,
    dateFrom: null,
    dateTo: null,
    jzkh: null,
    kslb: null,
    sfzh: null,
    yyys: null,
    zblx: null,
    ghbzs: [0]
  }

  private curRow: any = {} // 当前行
  private date: any[] = []
  private genderList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT
  private deptList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REGISTERATION_DEPARTMENT_DICT : this.$store.state.webSqlDict.REGISTERATION_DEPARTMENT_DICT // 挂号科室
  private docList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT // 医生列表
  private yOrNList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.Y_OR_N_DICT : this.$store.state.webSqlDict.Y_OR_N_DICT // 是/否
  private ghbzList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.APPOINTMENT_STATUS_DICT : this.$store.state.webSqlDict.APPOINTMENT_STATUS_DICT // 挂号标识（预约状态）
  private zblbList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REG_YYZBLB : this.$store.state.webSqlDict.REG_YYZBLB // 预约值班类别
  private loading: boolean = false

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 154
  }
  mounted() {
    this.getNow()
    console.log('班次',this.zblbList);
  }

  // 获取当前时间
  private getNow(){
    getNow().then((res: any) => {
      if(res){
        var date = parseTime(res.data, '{y}-{m}-{d}')
        var date1 = parseTime(res.data + 24*60*60*1000*7, '{y}-{m}-{d}')
        this.date = [date , date1]
        this.getList()
      }
    })
  }

  // 获取列表
  private getList() {
    this.loading = true
    this.ruleForm.dateFrom = this.date[0]
    this.ruleForm.dateTo = this.date[1]
    queryInfo(this.ruleForm).then((res: any) => {
      this.mockDatas = res.data
      this.curRow = {}
      this.loading = false
    })
  }

  // 获取当前行
  private getCurRow(row: any){
    this.curRow = row
  }

  // 预约更改前校验，子组件处理
  private checkModify(){
    const am: any = this.$refs.appointmentModify
    am.checkModify(this.curRow)
  }

  //清空
  private reset() {
    this.ruleForm.brxm = null
    this.ruleForm.jzkh = null
    this.ruleForm.kslb = null
    this.ruleForm.sfzh = null
    this.ruleForm.yyys = null
    this.ruleForm.zblx = null
    // this.ruleForm.dateFrom = this.date[0]
    // this.ruleForm.dateTo = this.date[1]
    this.ruleForm.ghbzs = [0]
  }
}
</script>
<style lang="scss" scoped>
.his-patient-query {
  .query-body {
    display: flex;
    flex-direction: column;

    .label.grid {
      width: 100%;
      display: grid !important;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-template-rows: 28px;
      line-height: 28px;
      .querySearch {
        width: 100%;
        display: grid !important;
        grid-template-columns: 68px 2fr;
        grid-template-rows: 28px;
        line-height: 28px;
        .searchTitle {
          padding: 0 8px 0;
        }
        &.card {
          display: grid !important;
          grid-template-columns: 68px 3fr 1fr;
          grid-template-rows: 28px;
          line-height: 28px;
          & .btn {
            padding: 4px 10px;
            height: 28px;
            line-height: 28px;
          }
        }
        .btn {
          display: flex;
          flex-flow: row nowrap;
        }
      }
    }
  }


  .searchLabel {
    color: #222b31;
    font-size: 13px;
  }

  // 日期选择器
  .row .label {
    .el-date-editor ::v-deep {
      width: 220px;
      height: 28px;
      border: none;
      background: $lightGray;
      .el-input__icon {
        line-height: 23px;
      }
      .el-range-input {
        background: none;
        width: 74px;
      }
      .el-range-separator {
        width: auto;
        line-height: 20px;
      }
    }
    .el-range-editor.el-input__inner ::v-deep {
      padding: 3px 0 3px 10px !important;
    }
  }

  .his-small .row .label .tag {
    padding-left: 0;
  }


  .content .his-small .retrieval {

    border-bottom: none;
    margin-bottom: 0px;
    padding-bottom: 0px
    //   width: 100%;
  }
  .content .his-small .retrieval .el-row .el-form-item {
    margin-bottom: 10px;
  }
  .search-select {
    margin-right: 9px;
  }
  .row .label ::v-deep .el-date-editor{
    margin-left: 0px !important;
  }
}

.el-checkbox-group{
  margin-left: 10px;
  .el-checkbox{
    margin-right: 10px;
    &:last-of-type{
      margin-right: 0;
    }
    ::v-deep .el-checkbox__label{
      padding-left: 4px;
    }
  }
}

</style>
