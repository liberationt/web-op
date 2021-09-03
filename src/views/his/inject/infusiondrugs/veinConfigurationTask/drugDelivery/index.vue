<!--
 * @Date: 
 * @LastEditTime: 
 * @Description: 药品出库
 * @FilePath: 
-->

<template>
  <div class="content opertionIncome">
    <div class="his-module his-small" style="height:40px; display:flex; align-items: center;margin-bottom: 10px;">
        <div class="row" style="border:none;margin-bottom:0;padding-bottom: 0">
          <div class="label">
            <!-- <span class="searchTitle">{{$t('药房')}}</span>
            <el-input placeholder="请输入药房" style="margin-right:8px"></el-input> -->
            <span class="searchTitle">{{$t('批次')}}</span>
            <el-select v-model="searchData.btName" class="outbound" placeholder="请选择批次">
              <el-option label="1" :value="'1'"></el-option>
              <el-option label=" 2 " :value="'2'"></el-option>
              <el-option label=" 3" :value="'3'"></el-option>
              <el-option label="4" :value="'4'"></el-option>
              <el-option label="5" :value="'5'"></el-option>
            </el-select>
          </div>
        </div>
    </div>
    <el-row :gutter="10">
      <el-col :span="4" class="ht">
        <div class="his-module his-small ht" :style="{ height: listSlotHeight  - 65  + 'px' }">
          <div slot="header" class="row">
            <div class="label">
              <span class="title ml10">{{$t('病区')}}</span>
            </div>
          </div>
          <el-table
            :data="tableDataA"
            border
            stripe
            slot="list"
            :height="listSlotHeight - 160"
            class="scroll-bar no-underline"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="bq" :label="$t('病区')"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="his-module his-small" :style="{ height: listSlotHeight  - 65  + 'px' }">
          <pagenation-list
            ref="pageTable"
            v-model="tableDataB"
            data-url
            http-method="post"
            :searchData="searchData"
            :list-height="listSlotHeight"
          >
            <div slot="header" class="row">
              <div class="label">
                <span class="title">{{$t('患者列表')}}</span>
              </div>
            </div>
            <el-table
              :data="tableDataB"
              border
              stripe
              slot="list"
              :height="listSlotHeight -160"
              class="scroll-bar"
            >
              <el-table-column width="32"></el-table-column>
              <el-table-column label="姓名" width="60" prop="xm"></el-table-column>
              <el-table-column :label="$t('床号')" width="60" prop="ch"></el-table-column>
              <el-table-column :label="$t('性别')" width="60" prop="xb"></el-table-column>
              <el-table-column :label="$t('年龄')" width="80" prop="nl"></el-table-column>
              <el-table-column :label="$t('病区')" width="80" prop="bq"></el-table-column>
            </el-table>6
          </pagenation-list>
        </div>
      </el-col>

      <el-col :span="13">
        <div class="his-module his-small" :style="{ height: listSlotHeight  - 65  + 'px' }">
          <pagenation-list
            ref="pageTable"
            v-model="tableDataC"
            data-url
            http-method="post"
            :searchData="searchData"
            :list-height="listSlotHeight"
          >
            <div slot="header" class="row">
              <div class="label">
                <span class="title ml10">{{$t('医嘱药品详情')}}</span>
              </div>
            </div>
            <el-table
              :data="tableDataC"
              border
              stripe
              slot="list"
              :height="listSlotHeight - 160"
              class="scroll-bar"
            >
              <el-table-column label width="16" align="center">
                <template slot-scope="scope">
                  <div class="w100" :class="scope.row.id % 2 === 1 ? 'greenBack' : 'orangeBack'"></div>
                </template>
              </el-table-column>
              <el-table-column prop="fs" :label="$t('方式')" width="60"></el-table-column>
              <el-table-column prop="lx" :label="$t('类型')" width="60"></el-table-column>
              <el-table-column prop="zh" :label="$t('组号')" width="60"></el-table-column>
              <el-table-column :label="$t('')" width="32" prop="webSortNumber"></el-table-column>
              <el-table-column prop="ypmc" :label="$t('药品名称')" show-overflow-tooltip></el-table-column>
              <el-table-column prop="gg" :label="$t('规格')" width="60"></el-table-column>
              <el-table-column prop="cd" :label="$t('产地')" width="80" show-overflow-tooltip></el-table-column>
              <el-table-column prop="sl" :label="$t('数量')" width="60"></el-table-column>
              <el-table-column prop="pc" :label="$t('批次')" width="60"></el-table-column>
              <el-table-column prop="zlsj" :label="$t('治疗时间')" width="100" show-overflow-tooltip></el-table-column>
              <el-table-column prop="txm" :label="$t('条形码')" show-overflow-tooltip></el-table-column>
              <el-table-column prop="kcsl" :label="$t('库存数量')" width="80"></el-table-column>
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
  queryWard,
  queryDsList, 
  checkList,
  approvedYz,
  queryYsList 
} from '@/api/his/inject/infusiondrugs/drugDelivery.ts'
import { Script } from 'vm'
@Component({
  name: 'judgeCheck',
  components: {},
})
export default class extends Vue {
  private listSlotHeight: number = 0 //列表高度
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  private searchData: any = {}
  private data: object = {}
  private checkList: any = ''
  private tableDataA: Array<any> = [
    {
      bq: '一病区',
    },
    {
      bq: '二病区',
    },
    {
      bq: '三病区',
    },
    {
      bq: '四病区',
    },
    {
      bq: '五病区',
    },
  ] //表格数据
  private tableDataB: Array<any> = [
    {
      ch: '10',
      xm: '王小虎',
      xb: '女',
      nl: '30岁',
      bq: '一病区',
    },
    {
      ch: '11',
      xm: '王小虎',
      xb: '男',
      nl: '30岁',
      bq: '二病区',
    },
    {
      ch: '12',
      xm: '欧华',
      xb: '男',
      nl: '30岁',
      bq: '三病区',
    },
    {
      ch: '13',
      xm: '王小虎',
      xb: '女',
      nl: '30岁',
      bq: '四病区',
    },
  ] //右侧表格数据
  private tableDataC: Array<any> = [
    {
      fs: '配置',
      lx: '长',
      zh: '9',
      xh: '1',
      ypmc: '0.9%氯化钠注射液',
      gg: '250ml',
      cd: '四川科伦药业',
      sl: '1袋',
      pc: '1',
      zlsj: '2020-08-05 09:00',
      txm: '202008050900',
      kcsl: '100袋',
    },
    {
      fs: '配置',
      lx: '长',
      zh: '9',
      xh: '1',
      ypmc: '0.9%氯化钠注射液',
      gg: '250ml',
      cd: '四川科伦药业',
      sl: '1袋',
      pc: '1',
      zlsj: '2020-08-05 09:00',
      txm: '202008050900',
      kcsl: '100袋',
    },
    {
      fs: '配置',
      lx: '长',
      zh: '9',
      xh: '1',
      ypmc: '0.9%氯化钠注射液',
      gg: '250ml',
      cd: '四川科伦药业',
      sl: '1袋',
      pc: '1',
      zlsj: '2020-08-05 09:00',
      txm: '202008050900',
      kcsl: '100袋',
    },
    {
      fs: '配置',
      lx: '长',
      zh: '9',
      xh: '1',
      ypmc: '0.9%氯化钠注射液',
      gg: '250ml',
      cd: '四川科伦药业',
      sl: '1袋',
      pc: '1',
      zlsj: '2020-08-05 09:00',
      txm: '202008050900',
      kcsl: '100袋',
    },
  ] //最右侧表格数据
  private handleDelete() {}
  //点击当前行
  private rowData() {}
  //新增
  private AddCatalogue() {}
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
.orangeBack,
.greenBack {
  height: 32px;
  opacity: 30%;
}

.greenBack {
  background: #0fcaad;
}
.orangeBack {
  background: #ffbf00;
}
</style>