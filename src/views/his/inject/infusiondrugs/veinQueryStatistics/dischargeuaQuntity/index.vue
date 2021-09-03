<!--
 * @Date: 
 * @LastEditTime: 
 * @Description: 排药数量统计
 * @FilePath: 
-->

<template>
  <div class="content opertionIncome">
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="his-module his-small" :style="{  marginBottom: '10px' }">
          <div class="row" style="border:none;padding-bottom:0;margin-bottom:0">
            <div class="label">
              <span class="title ml10">{{$t('排药日期')}}</span>
              <el-date-picker
                class="date-wrapper"
                v-model="currentDate"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="handleChangeDate"
              ></el-date-picker>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="his-module his-small">
          <el-table
            :data="statisticsList"
            ref="statistics"
            :fit="true"
            :highlight-current-row="true"
            border
            stripe
            :height="listSlotHeight - 83"
            class="no-underline scroll-bar"
            @row-click="handleSelRow"
          >
            <el-table-column prop="czrxm" :label="$t('审核人')"></el-table-column>
            <el-table-column prop="yfmc" :label="$t('科室')"></el-table-column>
            <el-table-column prop="count" :label="$t('审核数量')"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="his-module his-small">
          <el-table
            slot="list"
            :data="yzList"
            stripe
            border
            class="scroll-bar border no-underline"
            highlight-row
            row-key="key"
            default-expand-all
            :height="listSlotHeight - 83"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            :span-method="arraySpanMethod"
          >
            <el-table-column width="1">
              <template slot-scope="scope" v-if="scope.row.yzzh">
                <div class="data-head">
                  <span>开嘱时间：{{scope.row.kzsj}}</span>
                  <el-divider direction="vertical"></el-divider>
                  <span>组号：{{scope.row.yzzh}}</span>
                  <el-divider direction="vertical"></el-divider>
                  <span>开嘱医生:{{scope.row.kzys}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label width="16" align="center">
              <template slot-scope="scope">
                <div class="w100" :class="scope.row.yzzh % 3 === 1 ? 'greenBack' : 'orangeBack'"></div>
              </template>
            </el-table-column>
            <el-table-column prop="index" :label="$t('')" width="32"></el-table-column>
            <el-table-column prop="ypmc" :label="$t('药品名称')" show-overflow-tooltip width="200"></el-table-column>
            <el-table-column prop="ypgg" :label="$t('规格')" show-overflow-tooltip width="100"></el-table-column>
            <el-table-column prop="cdmc" :label="$t('产地名称')" show-overflow-tooltip width="150"></el-table-column>
            <el-table-column prop="ycjl" :label="$t('剂量')" width="50"></el-table-column>
            <el-table-column prop="ycsl" :label="$t('数量')" width="50"></el-table-column>
            <el-table-column prop="sypc" :label="$t('频次')" width="50"></el-table-column>
            <el-table-column prop="zxsj" :label="$t('执行时间')" width="150"></el-table-column>
            <el-table-column prop="yytj" :label="$t('途径')" width="50"></el-table-column>
            <el-table-column prop="yysm" :label="$t('说明')" width="100"></el-table-column>
            <el-table-column prop="czsj" :label="$t('审核时间')" width="150"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang='ts' >
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { 
  Isearch,
  queryCount,
  queryDetail
} from '@/api/his/inject/infusiondrugs/statistics.ts'
import { formatDate } from '@/utils/index.ts'
import { Script } from 'vm'
@Component({
  name: 'reviewMedicalOrders',
  components: {},
})
export default class extends Vue {
  private listSlotHeight: number = 0 //列表高度
  private currentDate: Array<any> = [] // 当前日期
  private statisticsList: Array<any> = [{}] //统计列表
  private searchData: Isearch = {
    start: null,
    end: null,
    type: null,
    czrghList: []
  }
  private yzList: Array<any> = [] //医嘱列表
  
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }

  mounted(){
    this.searchData.start = formatDate(1)
    this.searchData.end = formatDate(1)
    this.currentDate = [this.searchData.start, this.searchData.end]
    this.queryCount()
  }

  /*@methods: queryCount
   *@description: 查询静脉配置环境详情
   */
  private queryCount(){
    this.searchData.type = 'print'
    queryCount(this.searchData).then((res: any) => {
      if(res.errorCode=="SUCCESS"){
        this.statisticsList = res.data.list
        if (this.statisticsList.length>0) {
          let data: any = this.statisticsList[0];
          (this.$refs.statistics as any).setCurrentRow(data)
          this.searchData.czrghList.push(data.czrgh)
          this.queryDetail()
        }
      }
    })
  }

  /*@methods:handleChangeDate
   *@description: 改变日期
   */
  private handleChangeDate() {
    this.searchData.start = this.currentDate[0]
    this.searchData.end = this.currentDate[1]
    this.queryCount()
  }

  /*@methods: handleSelRow
   *@description: 选择统计
   */
  private handleSelRow(data: any) {
    this.searchData.czrghList.push(data.czrgh)
    this.queryDetail()
  }

  /*@methods: queryYzDetail
   *@description: 查询审核医嘱明细
   */
  private queryDetail(){
    queryDetail(this.searchData).then((res: any) => {
      if(res.errorCode=="SUCCESS"){
        this.yzList = [] // 清空已审方医嘱列表
        if(res.data.list != null && res.data.list.length>0){
          res.data.list.map((v: any,idx: number) => {
            let obj: any = {}
            obj.kzsj = v.kzsj
            obj.key = v.id
            obj.yzzh = v.yzzh
            obj.kzys = v.kzys
            if(v.ypxxList.length > 0){
              v.ypxxList.map((x: any, index: number) => {
                x.idx = idx
                x.key = x.id +'_'+ index
                x.index = index + 1;
                x.sypc = v.sypc
                x.zxsj = v.zxsj
                x.yysm = v.yysm
                x.yytj = v.yytj
                x.czsj = v.czsj
              })
              obj.children = v.ypxxList
            }else{
              obj.children = []
            }
            this.yzList.push(obj)
          })
        }
      }
    })
  }

  /*@methods:arraySpanMethod
   *@description: 合并行
   */
  private arraySpanMethod({ row, column, rowIndex, columnIndex }: any) {
    if (row.yzzh) {
      if (columnIndex === 0) {
        return [1, 10]
      } else if (columnIndex === 1) {
        return [0, 0]
      }
    }
  }
}
</script>
<style scoped lang='scss'>
.title {
  font-size: 14px !important;
  margin-right: 10px !important;
}
.content .his-small .el-form .el-form-item .el-input--medium {
  margin-bottom: 16px;
}
.content .his-small ::v-deep .el-form .el-form-item .el-form-item__label {
  line-height: 12px !important;
}
</style>