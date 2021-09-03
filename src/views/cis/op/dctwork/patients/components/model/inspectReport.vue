<!--
 * @Date: 2020-05-26 14:58:28
 * @LastEditors: zhml
 * @LastEditTime: 2020-05-28 11:08:39
 * @description: 检验报告
-->

<template>
  <div class="ht module">
    <el-row :gutter="10" class="ht">
      <el-col :span="10" class="ht">
        <div class="right-list his-module his-small ht">
          <el-table :data="tableFormat" border stripe :highlight-current-row="true" slot="list" fit @row-click="handleRowClick" :height="listSlotHeight + 30" class="scroll-bar no-underline">
            <el-table-column type="index" width="32" align="center"></el-table-column>
            <el-table-column prop="kdrq" min-width="80" align="center" label="申请日期">
              <template slot-scope="scope">
                <span>{{ getDate(scope.row.kdrq) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fymc" min-width="180" align="center" class="text-ellipsis" label="检验名称">
              <template slot-scope="scope" class="text-ellipsis">
                <el-tooltip effect="light" :open-delay="0" placement="right-start">
                  <div slot="content" class="content check" style="height: auto;width: 270px; background: white; padding: 0">
                    <p v-for="(ele,index) in scope.row.jymcArr" :key="index">{{ele}}</p>
                  </div>
                <div class="text-ellipsis">{{ scope.row.fymc }}</div>
                </el-tooltip>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="djztName" width="52" align="center" label="状态"></el-table-column> -->
            <el-table-column prop="ysdmName" min-width="80" align="center" label="开单医生"></el-table-column>
            <!-- <el-table-column prop="hjje" width="70" align="center" label="金额"></el-table-column> -->
          </el-table>
        </div>
      </el-col>
      <!-- <el-col :span="4">
        <div class="right-list his-module his-small ht">
          <el-table :data="tableDatasB" border stripe :highlight-current-row="true" slot="list" fit :height="listSlotHeight + 30" class="scroll-bar no-underline">
            <el-table-column prop="fymc" min-width="140" show-overflow-tooltip label="申请项目"></el-table-column>
            <el-table-column prop="ztmc" min-width="60" align="center" show-overflow-tooltip label="组套名称"></el-table-column>
          </el-table>
        </div>
      </el-col> -->
      <el-col :span="14" class="ht">
        <div class="right-list his-module his-small his-mini ht his-detail1">
          <div>
            <!-- <div class="top-header">
              <div class="title">{{ reportName}}检验报告单</div>
              <div class="inspectCode">样本编号：{{formDetail[0].sampleNo}}</div>
            </div> -->

            <div class="hz-list">
              <el-table 
                :data="formDetail" 
                border 
                stripe 
                highlight-current-row 
                fit 
                :height="listSlotHeight - 15" 
                class="scroll-bar"
                :row-class-name="tableRowClassName"
              >
                <el-table-column prop="itemName" label="项目名称" min-width="180"></el-table-column>
                <el-table-column prop="itemReompt" label="结果提示" width="130">
                  <template slot-scope="scope">
                    {{scope.row.itemReompt == 'H' ? '↑' : scope.row.itemReompt == 'L' ? '↓' : ''}}
                  </template>
                </el-table-column>
                <el-table-column prop="result" label="结果" min-width="80">
                  <template slot-scope="scope">
                    <div style="display: inline" :class="getResult(scope.$index) == 'up' ? 'backRed' : getResult(scope.$index) == 'down' ? 'backBlue' : ''">
                      {{ scope.row.result }}
                      <i></i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="units" label="结果单位" width="90"></el-table-column>
                <el-table-column prop="textRange" label="正常参考值范围" min-width="120"></el-table-column>
              </el-table>
            </div>

            <!-- <div class="hz-message clearfix">
              <div class="message-block">
                <div>采样时间：</div>
                <div>{{ formDetail[0].brxm }}</div>
              </div>
              <div class="message-block">
                <div>接收时间：</div>
                <div>{{ formDetail[0].type }}</div>
              </div>
              <div class="message-block">
                <div>检验者：</div>
                <div>{{ formDetail[0].labDoctor }}</div>
              </div>
            </div> -->
            <div class="hz-message clearFix">
              <div class="message-block">
                <span>审核者：</span>
                <span>{{ formDetail.length>0 ? formDetail[0].auditor : '' }}</span>
              </div>
              <div class="message-block">
                <span>检验者：</span>
                <span>{{ formDetail.length>0 ? formDetail[0].testDoctor : '' }}</span>
              </div>
              <div class="message-block">
                <span>检验时间：</span>
                <span>{{ formDetail.length>0 ? formDetail[0].testDate : '' }}</span>
              </div>
              <div class="message-block">
                <span>审核时间：</span>
                <span>{{ formDetail.length>0 ? formDetail[0].audittime : '' }}</span>
              </div>
            </div>
            <!--            <div class="message-bz"> 注：本报告仅对此样本负责！如有疑问请于24小时内联系。</div>-->
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { id2Name, isEmpty } from '@/utils'
import { queryInspectListDetail, queryInspectList, queryInspectReport, deleteInspectReport } from '@/api/cis/op/dctwork/reportList'
import { AxiosResponse } from 'axios'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'InspectReport',
})
export default class extends Vue {
  @Prop({ required: false }) private pnParam!: any

  private tableDatas: any[] = []
  private tableDatasB: any[] = []
  private listSlotHeight: number = 0
  private searchData: any = {
    brid: this.pnParam.brid,
    jzxh: this.pnParam.jzxh,
    fjlb: 2,
  }
  private formDetail: Array<any> = [] // 报告单表格数据
  private statusDict: Array<any> = [] // 检查状态
  private stateDict: Array<any> = [] // 检验检查状态
  private doctorList: Array<any> = [] // 检验检查状态
  private reportName: string = '' // 右侧报告单名称
  getDate(value: any) {
    return value.slice(0, 10)
  }
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 225
  }

  mounted() {
    this.statusDict = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.STATUS_DICT : this.$store.state.webSqlDict.STATUS_DICT
    this.stateDict = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.STATE_DICT : this.$store.state.webSqlDict.STATE_DICT
    this.doctorList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT

    this.getList()
  }

  get tableFormat() {
    const tabledata = this.tableDatas
    id2Name(tabledata, 'djzt', 'djztName', this.stateDict, 'dv', 'dn')
    id2Name(tabledata, 'ysdm', 'ysdmName', this.doctorList, 'dv', 'dn')

    return tabledata
  }

  // 获取项目表格数据
  private getList() {
    queryInspectList(this.searchData).then((res: AxiosResponse) => {
      res.data.forEach((item: any) => {
        this.$set(item,'jymcArr',item.fymc.split(',')) 
      })
      this.tableDatas = res.data
    })
  }

  // 点击项目查看项目明细与报告
  private handleRowClick(val: any) {
    console.log(val)
    this.reportName = val.fymc // 获取右侧报告单费用名称
    queryInspectListDetail({ yjxh: val.yjxh }).then((res: AxiosResponse) => {
      this.tableDatasB = res.data
    })
    // 获取右侧报告单信息
    this.handleGetDetail(val)
  }
  // 获取右侧报告单信息
  private handleGetDetail(val: any) {
    queryInspectReport({ reqNo: val.yjxh, patType: 0 }).then((res: AxiosResponse) => {
      this.formDetail = res.data
      if (res.data.length == 0) {
        this.$message({
          message: '无数据',
          type: 'warning',
        })
      }
    })
  }

  private getResult(num: number) {
    let cc = this.formDetail[num]
    let list = cc.textRange.split('-')
    if (parseInt(cc.result) < parseInt(list[0])) {
      return 'down'
    } else if (parseInt(cc.result) > parseInt(list[1])) {
      return 'up'
    }
  }

  private handleDelete(val: any) {
    // deleteById({ bqid:val.bqid }).then(()=>{
    //   this.$notify.success('删除成功')
    //   this.getList()
    // })
    deleteInspectReport({ yjxh: val.yjxh }).then(() => {
      this.$notify.success('已删除')
      this.getList()
      this.tableDatasB = []
      this.formDetail = []
    })
  }

    //根据医嘱状态修饰行样式
  tableRowClassName({ row, rowIndex }: any) {
    // 把每一行的索引放进row
    if (!isEmpty(row.itemReompt) && row.itemReompt == 'H') {
      //高
      return 'backRed'
    }
    if (!isEmpty(row.itemReompt) && row.itemReompt == 'L') {
      //低
      return 'backRed'
    }
    if (!isEmpty(row.result) && row.result == '阳性') {
      //阳性
      return 'backRed'
    }
  }
}
</script>

<style lang="scss" scoped>
.label {
  background: #ffffff;
  border-radius: 8px;
}
.his-detail1 {
  width: 100%;
  .top-header {
    // display: grid;
    // grid-template-columns: repeat(2,50%);
    padding-bottom: 10px;
    .title {
      // display: grid;
      // justify-content: end;
      text-align: center;
      font-family: siyuanMedium;
      font-size: 16px;
    }
    .inspectCode {
      // display: grid;
      // justify-content: center;
      margin-top: 10px;
      text-align: right;
      font-size: 13px;
      // align-self: flex-end;
    }
  }
  .hz-message {
    // display: grid;
    // grid-template-columns: repeat(4, 25%);
    padding-top: 20px; 
    width: 100%;
    .message-block {
      float: left;
      color: #6a6d78;
      font-size: 13px;
      margin-right: 20px;
    }
  }

  .message-bz {
    padding: 0 10px;
    color: #6a6d78;
  }
  .hz-list {
    // margin-top: 30px;
    // padding:0 20px ;
    // border-top: 1px solid #f0f0f0;
    .backRed {
      color: red;
    }
    .backBlue {
      color: blue;
    }
  }
  ::v-deep .el-table .backRed .cell {
    color: red !important;
  }
}
</style>
