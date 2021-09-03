<!--
 * @Date: 
 * @LastEditTime: 
 * @Description: 病人静脉配置药品追溯
 * @FilePath: 
-->

<template>
  <div class="content opertionIncome">
    <el-row :gutter="10">
      <el-col :span="24">
        <div
          class="his-module his-small"
          :style="{ height: listSlotHeight / 2 - 10  + 'px', marginBottom: '10px' }"
        >
          <div class="row">
            <div class="label">
              <span class="title ml10">{{$t('药品条形码')}}</span>
              <el-input v-model.trim="txm" class="outbound" placeholder="请扫描药品条形码" @change="handleSearch" clearable @click="handleClear"></el-input>
            </div>
          </div>
          <el-table
            :data="yzList"
            border
            stripe
            slot="list"
            :height="listSlotHeight /2 - 73"
            class="no-underline scroll-bar"
          >
            <el-table-column tyoe="index" :label="$t('')" width="32"></el-table-column>
            <el-table-column prop="kzsj" :label="$t('开嘱日期')" width="120"></el-table-column>
            <el-table-column prop="ypmc" :label="$t('药品名称')" show-overflow-tooltip width="200"></el-table-column>
            <el-table-column prop="ypgg" :label="$t('规格')" show-overflow-tooltip width="100"></el-table-column>
            <el-table-column prop="cdmc" :label="$t('产地')" show-overflow-tooltip min-width="180"></el-table-column>
            <el-table-column prop="ycjl" :label="$t('剂量')" width="50"></el-table-column>
            <el-table-column prop="ycsl" :label="$t('数量')" width="50"></el-table-column>
            <el-table-column prop="sypc" :label="$t('频次')" width="60"></el-table-column>
            <el-table-column prop="zxsj" :label="$t('执行时间')" width="150"></el-table-column>
            <el-table-column prop="yytj" :label="$t('途径')" width="60"></el-table-column>
            <el-table-column prop="kzys" :label="$t('开嘱医生')" width="80"></el-table-column>
            <el-table-column prop="yysm" :label="$t('说明')" width="60"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col class="ht" :span="24">
        <div
          class="his-module his-small"
          :style="{ height: listSlotHeight / 2 - 10  + 'px', marginBottom: '10px' }"
        >
          <div class="row">
            <div class="label">
              <h1 class="title ml10">{{$t('静脉配置环节详情')}}</h1>
            </div>
          </div>
          <el-table
            :data="logList"
            border
            stripe
            slot="list"
            :height="listSlotHeight /2- 73"
            class="no-underline scroll-bar"
          >
            <el-table-column type="index" :label="$t('')" width="32"></el-table-column>
            <el-table-column prop="cz" :label="$t('操作')"></el-table-column>
            <el-table-column prop="type" :label="$t('操作时间')">
              <template slot-scope="scope">
                <em v-show="scope.row.type == 'check'">审方核对</em>
                <em v-show="scope.row.type == 'print'">排药印签</em>
                <em v-show="scope.row.type == 'packing'">打包核对</em>
              </template>
            </el-table-column>
            <el-table-column prop="czr" :label="$t('操作人')"></el-table-column>
            <el-table-column prop="zlsj" :label="$t('治疗时间')"></el-table-column>
            <el-table-column prop="pcmc" :label="$t('批次')"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang='ts' >
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { 
  queryYzDetail,
  queryLog
} from '@/api/his/inject/infusiondrugs/drugTraceability.ts'
import { Script } from 'vm'
@Component({
  name: 'drugTraceability',
  components: {},
})
export default class extends Vue {
  private listSlotHeight: number = 0 //列表高度
  private txm: string | null = null // 条形码
  private yzList: Array<any> = [] // 医嘱详情
  private logList: Array<any> = [] // 静脉配置环节详情
  
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }

  /*@methods: queryBatch
   *@description: 查询发药批次列表
   */
  private handleSearch(){
    this.queryYzDetail()
    this.queryLog()
  }

  /*@methods: handleClear
   *@description: 清除条形码
   */
  private handleClear(){
    this.yzList = []
    this.logList = []
   
  }

  /*@methods: queryBatch
   *@description: 查询发药批次列表
   */
  private queryYzDetail(){
    if(this.txm != ''){
      queryYzDetail({txm: this.txm}).then((res: any) => {
        if(res.errorCode=="SUCCESS"){
          this.yzList = res.data
        }
      })
    }
  }

  /*@methods: queryBatch
   *@description: 查询发药批次列表
   */
  private queryLog(){
    if(this.txm != ''){
      queryLog({txm: this.txm}).then((res: any) => {
        if(res.errorCode=="SUCCESS"){
          this.yzList = res.data
        }
      })
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