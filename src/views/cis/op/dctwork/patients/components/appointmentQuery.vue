<template>
  <!-- 患者列表-预约查询 （个人）-->
  <div class="content-1 his-patient-query">
    <div class="his-module his-small his-mini">
      <div class="row" slot="header">
        <div class="label">
          <div class="querySearch">
            <div class="searchTitle no-warp" style="padding-right: 2px">预约查询</div>
          </div>
          <div class="btn">
            <el-divider direction="vertical"></el-divider>
            <el-button @click="queryInfo"> <i class="his-caozuo_yuyuechaxun icon"></i>预约查询 </el-button>
            <el-button @click="checkModify"> <i class="his-caozuo_yuyuegengai icon"></i>预约更改 </el-button>
            <el-button @click="reset"> <i class="his-btn-del red icon"></i>清空 </el-button>
            <el-button>
              <i class="his-btn-print icon"></i>
              {{ $t('common.print') }}
            </el-button>
          </div>
        </div>
      </div>
      <div class="row query-body">
        <!-- <div> -->
        <div class="label grid">
          <div class="querySearch">
            <span class="searchTitle">患者卡号</span>
            <el-input placeholder="请输入患者卡号" v-model="ruleForm.jzkh" disabled></el-input>
          </div>
          <div class="querySearch">
            <span class="searchTitle">患者姓名</span>
            <el-input placeholder="请输入患者姓名" v-model="ruleForm.brxm" disabled></el-input>
          </div>
          <div class="querySearch">
            <span class="searchTitle">身份证号</span>
            <el-input placeholder="请输入身份证号" v-model="ruleForm.sfzh" disabled></el-input>
          </div>
          <div class="querySearch">
            <span class="searchTitle">值班类别</span>
            <!-- <el-select v-model="ruleForm.zblx" placeholder="请选择">
							<el-option v-for="item in options" :key="item.id" :value="item.id" :label="item.name"></el-option>
						</el-select> -->
            <search-select table-name="SYS_DICT_CONFIG" kid="77" v-model="ruleForm.zblx" :placeholder="$t('班次')" :backfillValue="ruleForm.zblx" />
          </div>
        </div>
        <div class="label grid mt8">
          <div class="querySearch">
            <span class="searchTitle">科室名称</span>
            <search-select class="w100" table-name="SYS_DICT_CONFIG" kid="13" v-model="ruleForm.kslb" :placeholder="$t('请选择科室')" :backfillValue="ruleForm.kslb" disabled />
          </div>
          <div class="querySearch">
            <span class="searchTitle">预约医生</span>
            <search-select class="w100" table-name="SYS_DICT_CONFIG" kid="17" v-model="ruleForm.yyys" :placeholder="$t('请选择医生')" :backfillValue="ruleForm.yyys" />
          </div>
          <div class="querySearch">
            <span class="searchTitle">预约时间</span>
            <el-date-picker v-model="dateSelect" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始时间" end-placeholder="结束时间" :clearable="false" class="date-wrapper"></el-date-picker>
          </div>
        </div>
        <!-- </div> -->
      </div>

      <!-- <pagenation-list
			  ref="pageTable"
			  v-model="mockDatas"
			  data-url="/op-service/msyygh/loadAppointedInfo"
			  http-method="post"
			  :list-height="listSlotHeight"
			> -->
      <el-table :data="mockDatas" border fit stripe highlight-current-row slot="list" :height="listSlotHeight" @row-click="getCurRow" class="scroll-bar no-underline" tooltip-effect="light">
        <el-table-column type="index" width="32"></el-table-column>
        <el-table-column prop="cardno" min-width="84" label="卡号"></el-table-column>
        <el-table-column prop="brxm" width="70" label="姓名"></el-table-column>
        <el-table-column prop="brxb" width="45" label="性别">
          <template slot-scope="scope">
            <span v-if="genderList.find((item) => item.dv == scope.row.brxb)">
              {{ genderList.find((item) => item.dv == scope.row.brxb).dn }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="csny" width="84" label="出生年月">
          <template slot-scope="scope">
            <span v-if="scope.row.csny">{{ scope.row.csny.substr(0, 10) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sfzh" min-width="150" label="身份证号"></el-table-column>
        <el-table-column prop="ksdm" min-width="70" label="预约科室">
          <template slot-scope="scope">
            <span v-if="deptList.find((item) => item.dv == scope.row.ksdm)">
              {{ deptList.find((item) => item.dv == scope.row.ksdm).dn }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="ysdm" width="70" label="预约医生" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="docList.find((item) => item.dv == scope.row.ysdm)">
              {{ docList.find((item) => item.dv == scope.row.ysdm).dn }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="ghsj" min-width="84" label="申请日期">
          <template slot-scope="scope">{{ scope.row.ghsj.substr(0, 10) }}</template>
        </el-table-column>
        <el-table-column prop="yyrq" min-width="84" label="预约日期"></el-table-column>
        <el-table-column prop="zblb" width="50" label="类别">
          <template slot-scope="scope">
            <!-- {{scope.row.zblb|filterZblb}} -->
            <span v-if="zblbList.find((item) => item.dv == scope.row.zblb)">
              {{ zblbList.find((item) => item.dv == scope.row.zblb).dn }}
            </span>
            <span v-else>{{ scope.row.zblb }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="jhhm" width="70" label="叫号号码"></el-table-column>
        <el-table-column prop="ghbz" width="60" label="状态">
          <template slot-scope="scope">
            <span v-if="ghbzList.find((item) => item.dv == scope.row.ghbz)">
              {{ ghbzList.find((item) => item.dv == scope.row.ghbz).dn }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="sfqh" width="70" label="是否取号">
          <template slot-scope="scope">
            <span v-if="yOrNList.find((item) => item.dv == scope.row.sfqh)">
              {{ yOrNList.find((item) => item.dv == scope.row.sfqh).dn }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="qhyg" width="70" label="取号员工"></el-table-column>
        <el-table-column prop="qhsj" width="70" label="取号时间"></el-table-column>
        <el-table-column prop="lxdh" width="100" label="联系电话"></el-table-column>
        <el-table-column :label="$t('common.action')" width="100" align="center" fixed="right">
          <template slot-scope="scope">
            <el-tooltip :content="$t('common.delete')" effect="light">
              <el-popconfirm :title="'确认删除？'" :confirmButtonText="$t('common.confirm')" :cancelButtonText="$t('common.cancel')" @confirm="handleDelete(scope.row)" hideIcon class="ml10">
                <el-button slot="reference" class="red">
                  <i class="icon his-del"></i>
                </el-button>
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- </pagenation-list> -->
    </div>

    <!-- 预约更改 -->
    <appointmentModify :deptList="deptList" @succeeded="queryInfo" ref="appointmentModify" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Iitem, queryInfo, deleteById, aCheckModify } from '@/api/cis/op/dctwork/appointmentQuery'
import { format } from 'url'
import { Form } from 'element-ui'
import appointmentModify from '../../orderManager/components/appointmentModify.vue'
import { getNow } from '@/api/his/basic'
import { parseTime } from '@/utils'

@Component({
  name: 'appointmentQuery',
  components: {
    appointmentModify,
  },
  filters: {
    filterZblb(zblb: any) {
      if (zblb == 1) {
        return '上午'
      }
      if (zblb == 2) {
        return '下午'
      }
    },
  },
})
export default class extends Vue {
  @Prop({ required: true }) private appointData!: any
  private value: string = ''
  private mockDatas: Array<any> = []
  private listSlotHeight: number = 0
  private dateSelect: Array<any> = [] //取时间
  private genderList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT
  private deptList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REGISTERATION_DEPARTMENT_DICT : this.$store.state.webSqlDict.REGISTERATION_DEPARTMENT_DICT // 挂号科室
  private docList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT // 医生列表
  private yOrNList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.Y_OR_N_DICT : this.$store.state.webSqlDict.Y_OR_N_DICT // 是/否
  private ghbzList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.APPOINTMENT_STATUS_DICT : this.$store.state.webSqlDict.APPOINTMENT_STATUS_DICT // 挂号标识（预约状态）
  private zblbList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SCHEDULE_TIME : this.$store.state.webSqlDict.SCHEDULE_TIME // 班次
  private ruleForm: Iitem = {
    brxm: null,
    dateFrom: null,
    dateTo: null,
    jzkh: null,
    kslb: this.appointData.zsid,
    sfzh: null,
    yyys: null,
    zblx: null,
  }
  private curRow: any = {}
  private options: Array<any> = [
    {
      id: '1',
      name: '上午',
    },
    {
      id: '2',
      name: '下午',
    },
  ]

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 224
  }

  mounted() {
    this.ruleForm = { ...this.appointData }
    this.ruleForm.kslb = Vue.prototype.AUTHORITY.bussinessRole
    this.ruleForm.yyys = this.appointData.ysdm
    // this.ruleForm.zblx = '1'
    this.getNow()
  }

  // 获取当前时间
  private getNow() {
    getNow().then((res: any) => {
      if (res) {
        res.data += 86400000
        var date = parseTime(res.data, '{y}-{m}-{d}')
        this.dateSelect = [date, date]
      }
    })
  }

  //查询
  private queryInfo() {
    this.ruleForm.dateFrom = this.dateSelect[0]
    this.ruleForm.dateTo = this.dateSelect[1]
    queryInfo(this.ruleForm).then((res: any) => {
      // console.log(res)
      this.mockDatas = res.data
      this.curRow = {}
    })
  }

  // 获取当前行
  private getCurRow(row: any) {
    this.curRow = row
  }

  // 预约更改前校验，子组件处理
  private checkModify() {
    const am: any = this.$refs.appointmentModify
    am.checkModify(this.curRow)
  }

  //清空
  private reset() {
    this.ruleForm.zblx = '1'
    this.getNow()
  }

  private handleDelete(val: any) {
    deleteById({ yyxh: val.yyxh }).then(() => {
      this.$notify.success('删除成功')
      this.queryInfo()
    })
  }
}
</script>

<style lang="scss" scoped>
.his-patient-query {
  padding: 0 !important;

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
        .no-warp {
          font-family: siyuanMedium;
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

  .his-mini {
    width: 100%;
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

.row .label::v-deep .el-range-editor.el-input__inner {
  width: 220px !important;
}

// 右侧表单样式分布
.content-1 .his-small .retrieval .el-row .el-form-item {
  width: calc(20% - 8px);
}

.content-1 .his-small .retrieval {
  margin: 0;
  width: 100%;
}

.search-select {
  margin-right: 0px;
}

.row .label .el-range-editor.el-input__inner {
  width: 100% !important;
}
</style>
