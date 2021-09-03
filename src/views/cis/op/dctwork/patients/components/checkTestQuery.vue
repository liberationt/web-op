<template>
  <div class="his-module his-small check hide-scroll his-query">
    <div class="row" slot="header">
      <div class="label">
        <div class="querySearch">
          <div class="searchTitle no-warp">申请日期</div>
          <el-date-picker v-model="value" type="daterange" class="date-wrapper" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" @keydown.enter.native="changeDate" @change="changeDate"></el-date-picker>
        </div>
        <div class="btn">
          <el-divider direction="vertical"></el-divider>
          <!-- 查询 -->
          <el-button @click="getList">
            <i class="his-caozuo_search icon"></i>
            {{ $t('查询') }}
          </el-button>
          <!-- 打印 -->
          <!-- <el-button>
            <i class="his-btn-print icon"></i>
            {{ $t('common.print') }}
          </el-button> -->
        </div>
      </div>
    </div>
    <pagenation-list 
      ref="pageTable" 
      v-model="mockDatas" 
      data-url="/op-service/opyjcf01/queryJysqdMessage" 
      http-method="post" 
      :searchData="searchData" 
      :list-height="listSlotHeight - 200" 
      :dataNum="1"
    >
      <el-table 
        :data="mockDatas" 
        border 
        :fit="true" 
        stripe 
        :highlight-current-row="true" 
        slot="list" 
        :height="listSlotHeight - 220" 
        class="scroll-bar" 
        tooltip-effect="light" 
        @row-dblclick="queryCheckApply"
      >
        <el-table-column prop="webSortNumber" width="32"></el-table-column>
        <el-table-column prop="brxm" label="病人姓名" width="70" show-overflow-tooltip></el-table-column>
        <el-table-column prop="xmlbs" label="检查项目" min-width="150">
          <template slot-scope="scope">
            <el-tooltip effect="light" placement="right-start" class="text-ellipsis">
              <div slot="content" style="width: 200px">
                <div v-if="scope.row.ztmc">
                  {{scope.row.ztmc + '[' + scope.row.xmlbs + ']'}}
                </div>
                <div v-else>
                  {{scope.row.xmlbs}}
                </div>
              </div>
              <div v-if="scope.row.ztmc">
                {{scope.row.ztmc + '[' + scope.row.xmlbs + ']'}}
              </div>
              <div v-else>
                {{scope.row.xmlbs}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="hjje" label="检验费用" class-name="text-blue-td" width="80">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.jcfy">{{ scope.row.jcfy.toFixed(2) }}</span>
          </template> --> 
        </el-table-column>
        <el-table-column prop="kdrq" label="申请时间" width="140" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="ysdm" label="申请医生">
          <template slot-scope="scope">
            <span>{{mzysList.find(item => item.dv == scope.row.ysdm)&&mzysList.find(item => item.dv == scope.row.ysdm).dn}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="zxks" label="执行科室">
          <template slot-scope="scope">
            <div>{{zxksList.find(item => item.dv == scope.row.zxks)&&zxksList.find(item => item.dv == scope.row.zxks).dn}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="djzt" label="检验状态">
          <template slot-scope="scope">
            <div :class="scope.row.djzt | filterColor">{{scope.row.djzt | filterStatus}}</div>
          </template>
        </el-table-column>
      </el-table>
    </pagenation-list>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { queryMsbrzd } from '@/api/cis/op/dctwork/patients'
import { id2Name, parseTime } from '@/utils'
import { getNow } from '@/api/his/basic'

@Component({
  name: 'checkTestQuery',
  filters: {
    filterStatus(value: number) {
      switch (value) {
        case 0:
          return '暂存'
        case 1:
          return '提交'
        case 2:
          return '预约'
        case 3:
          return '已检查'
        case 4:
          return '已报告'
        case 5:
          return '已审核'
        case 6:
          return '再审'
        case 7:
          return '打印'
        case 9:
          return '退回'
        case 20:
          return '收费'
        case 21:
          return '退费'
      }
    },
    filterColor(value: number) {
      switch (value) {
        case 0: 
          return 'yellow'
        case 1:
          return 'greens'
        case 4: 
          return 'greens'
        case 9: 
          return 'reds'
        case 20:
          return 'blues'
        case 21:
          return 'reds'
      }
    }
  }
})
export default class extends Vue {
  @Prop({ required: true }) private pnParam!: any
  private value: Array<any> = []
  private mockDatas: Array<any> = []
  private searchData: any = {
    ysdm: '',
    jzxh: '',
    kdrq_begin: '',
    kdrq_end: '',
  }
  private zxksList:Array<any> = [] // 执行科室列表
  private listSlotHeight: number = 0
  private checkList: Array<any> = [] //检查状态
  private mzysList: Array<any> = [] //门诊医生列表

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }

  mounted() {
    this.mzysList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT :this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.zxksList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.MZ_ZXKS_DICT : this.$store.state.webSqlDict.MZ_ZXKS_DICT
    this.checkList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.CHECK_STATUS : this.$store.state.webSqlDict.CHECK_STATUS
    if (this.pnParam) {
      this.searchData.jzxh = this.pnParam.jzxh
    }
    this.getNow()
  }

  // 获取当前时间
  private getNow() {
    getNow().then((res: any) => {
      if (res) {
        var date = parseTime(res.data, '{y}-{m}-{d}')
        this.value = [date, date]
        this.searchData.kdrq_begin = this.value[0]
        this.searchData.kdrq_end = this.value[1]
        this.getList()
      }
      
    })
  }

  // 获取查询列表
  private getList() {
    console.log('this.searchData', this.searchData)
    this.searchData.jzxh = this.pnParam.jzxh
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private changeDate() {
    console.log('this.value', this.value)
    this.searchData.beginDate = parseTime(this.value[0], '{y}-{m}-{d}')
    this.searchData.endDate = parseTime(this.value[1], '{y}-{m}-{d}')
    this.getList()
  }

  /**
   * @Description: 跳转检查申请单页面
   * @author: zhml
   * @param {type}: id
   * @return: $emit
   * @date 2020/9/2
   */
  private queryCheckApply(val: any) {
    this.$emit('queryCheckApply', val)
  }
}
</script>

<style lang="scss" scoped>
.no-warp {
  white-space: nowrap;
}

.his-query.his-small {
  .row {
    padding-bottom: 8px;

    .no-warp {
      margin-top: 2px;
      font-family: siyuanMedium;
    }

    .btn .el-button {
      padding: 4px 5px;
    }
    .el-divider--vertical {
      margin: 0 10px;
    }
  }
  .row.label.searchTitle {
    padding-right: 10px !important;
  }
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
</style>
