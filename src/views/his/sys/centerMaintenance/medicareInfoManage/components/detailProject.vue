<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <div class="his-module his-small" style="height:auto; padding: 8px 10px">
        <div class="row">
          <div class="label">
            <div style="font-size: 13px; margin-right: 8px;">搜索</div>
            <el-input
              v-model="searchData.pydm"
              placeholder="请输入拼音码"
              clearable
              @keyup.native.enter="searchList"
              @clear="searchList"
            >
              <i slot="prefix" class="el-input__icon icon his-search"></i>
            </el-input>
          </div>
        </div>
        <pagenation-list
          ref="pageTable"
          data-url="/op-service/dicsfxmlb/queryFeeYlsfxmDetail"
          http-method="post"
          v-model="tableData"
          :searchData="searchData"
          :list-height="listSlotHeight"
        >
          <el-table
            slot="list"
            stripe
            :data="tableData"
            border
            :height="listSlotHeight-158"
            class="scroll-bar"
            tooltip-effect="light"
            @row-click="getRowData"
          >
            <el-table-column type="index" width="32" align="center"></el-table-column>
            <el-table-column label="状态" min-width="55">
              <template slot-scope="scope">
                <div
                  :class="[scope.row.zfpb == 1 ? 'reds' : 'blues']"
                >{{scope.row.zfpb == 1 ? '已作废' : '未作废'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="医保编码" prop="ybbm" min-width="130" show-overflow-tooltip></el-table-column>
            <el-table-column label="费用名称" prop="fymc" min-width="160px" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="fydw" min-width="60" show-overflow-tooltip></el-table-column>
            <el-table-column label="拼音码" prop="pydm" min-width="85px" show-overflow-tooltip></el-table-column>
            <el-table-column label="门诊使用" prop="mzsy" min-width="70px">
              <template slot-scope="scope">
                <div
                  :class="[scope.row.mzsy == '1' ? 'blues' : 'reds']"
                >{{scope.row.mzsy == '1' ? '是' : '否'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="住院使用" prop="zysy" min-width="70px">
              <template slot-scope="scope">
                <div
                  :class="[scope.row.zysy == '1' ? 'blues' : 'reds']"
                >{{scope.row.zysy == '1' ? '是' : '否'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="医技使用" prop="yjsy" min-width="70px">
              <template slot-scope="scope">
                <div
                  :class="[scope.row.yjsy == '1' ? 'blues' : 'reds']"
                >{{scope.row.yjsy == '1' ? '是' : '否'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="费用归并" prop="fygb" min-width="70px">
              <template slot-scope="scope">
                <div>
                  {{$store.state.webSqlDict.COST_CONSOLIDATION.find(item => item.dv == scope.row.fygb) &&
                  $store.state.webSqlDict.COST_CONSOLIDATION.find(item => item.dv == scope.row.fygb).dn}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="材料对应" prop="cldym" min-width="70px"></el-table-column>
            <el-table-column label="是否作废" prop="zfpb" min-width="70px">
              <template slot-scope="scope">
                <div
                  :class="[scope.row.yjsy == '1' ? 'blues' : 'reds']"
                >{{scope.row.yjsy == '1' ? '是' : '否'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="标准价格" min-width="70px" prop="bzjg"></el-table-column>
            <el-table-column label="病案首页归并" prop="basygb" min-width="110px">
            </el-table-column>
            <el-table-column label="所属医技类型" prop="yjlx" min-width="100px"></el-table-column>
            <el-table-column label="明细标志" prop="mxbz" min-width="70px"></el-table-column>
            <el-table-column label="材料标志" prop="clbz" min-width="70px"></el-table-column>
          </el-table>
        </pagenation-list>
      </div>
    </el-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'routeAdministration',
  components: {}
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private textarea: string = ''
  private isUpd: boolean = true // 新增与编辑切换
  private searchData: any = {
    pydm: '',
    fygb: '',
    fymc: '',
    ybbm: '',
    zfpb: ''
  }
  private tableData: Array<any> = []

  // 条件查询
  private searchList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

  // 列表查询
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private getRowData(row: any) {
    console.log();

  }

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    this.getList()
  }

  private handleAdd() {}
  private handleSave() {}
}
</script>
<style lang="scss" scoped>
.row .label .el-input {
  width: 190px;
}

.content .his-small {
  padding: 0 0 8px;
}

.his-sys-module {
  padding: 8px 10px !important;
}

.his-sys-right {
  margin-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}
.content .his-module .el-form .el-form-item::v-deep .el-select--medium .el-input__inner {
  width: 100%;
}
</style>
