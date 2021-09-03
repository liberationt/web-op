
<!--
 * @Date:
 * @LastEditTime:
 * @Description: 机构收费项目维护-其他项目
 * @FilePath:
-->
<template>
  <div>
    <div class="his-module his-small" style="padding: 8px 10px">
      <div class="row">
        <div class="label">
          <div style="font-size: 13px; margin-right: 8px;">搜索</div>
          <el-input v-model="searchData.pydm" placeholder="请输入拼音码" @keyup.native.enter="getList">
            <i slot="prefix" class="el-input__icon icon his-search"></i>
          </el-input>
          <div class="btn">
            <el-button type="text" size="mini" @click="handleDetail">
              <i class="icon his-caozuo_binglishuxie"></i>明细
            </el-button>
            <el-button type="text" size="mini" @click="handleTransfer">
              <i class="icon his-caozuo-fold"></i>全部调入
            </el-button>
          </div>
        </div>
      </div>
      <pagenation-list
        ref="pageTable"
        data-url="/op-service/dicsfxmlb/queryMedicalProject"
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
          @row-click="getRowData"
          tooltip-effect="light"
          :highlight-current-row="true"
          @row-dblclick="handleDetail"
        >
          <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
          <el-table-column label="名称" prop="sfmc" min-width="90" show-overflow-tooltip></el-table-column>
          <el-table-column label="缩写" prop="mcsx" min-width="90" show-overflow-tooltip></el-table-column>
          <el-table-column label="拼音码" prop="pydm" min-width="70px"></el-table-column>
          <el-table-column label="项目归并" prop="fylb" min-width="70px">
            <template slot-scope="scope">
              <div>
                {{$store.state.webSqlDict.COST_CONSOLIDATION.find(item => item.dv == scope.row.fylb) &&
                $store.state.webSqlDict.COST_CONSOLIDATION.find(item => item.dv == scope.row.fylb).dn}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="门诊归并" prop="mzgb" min-width="70px">
            <template slot-scope="scope">
              <div>
                {{$store.state.webSqlDict.COST_CONSOLIDATION.find(item => item.dv == scope.row.mzgb) &&
                $store.state.webSqlDict.COST_CONSOLIDATION.find(item => item.dv == scope.row.mzgb).dn}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="住院归并" prop="zygb" min-width="70px">
            <template slot-scope="scope">
              <div>
                {{$store.state.webSqlDict.COST_CONSOLIDATION.find(item => item.dv == scope.row.zygb) &&
                $store.state.webSqlDict.COST_CONSOLIDATION.find(item => item.dv == scope.row.zygb).dn}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="门诊使用" prop="mzsy" min-width="70px">
            <template slot-scope="scope">
              <span
                :class="[scope.row.mzsy == '1' ? 'blues' : 'reds']"
              >{{scope.row.mzsy == '1' ? '是' : '否'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="住院使用" prop="zysy" min-width="70px">
            <template slot-scope="scope">
              <span
                :class="[scope.row.zysy == '1' ? 'blues' : 'reds']"
              >{{scope.row.zysy == '1' ? '是' : '否'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="顺序号" prop="plsx" min-width="60" show-overflow-tooltip></el-table-column>
          <el-table-column label="住院顺序号" prop="zypl" min-width="85px"></el-table-column>
          <el-table-column label="门诊顺序号" prop="mzpl" min-width="85px"></el-table-column>
          <el-table-column label="英文名称" prop="ywmc" min-width="70px"></el-table-column>
          <el-table-column label="费用分类" prop="fyfl" min-width="70px">
            <template slot-scope="scope">
              <div>
                {{$store.state.webSqlDict.COST_TYPE_DICT.find(item => item.dv == scope.row.fyfl) &&
                $store.state.webSqlDict.COST_TYPE_DICT.find(item => item.dv == scope.row.fyfl).dn}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="病案首页归并" prop="basygb" min-width="90" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                {{$store.state.webSqlDict.COST_CATEGORY_DICT.find(item => item.dv == scope.row.basygb) &&
                $store.state.webSqlDict.COST_CATEGORY_DICT.find(item => item.dv == scope.row.basygb).dn}}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </pagenation-list>
    </div>

    <medicalDialog ref="medicalDialog" v-bind:fygb="fygb"></medicalDialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { transferAll, cancelDetail, transferDetailList, transfer, editDetailProject } from '@/api/his/sys/centerMaintenance/medicareInfoManage/InstitutionalProjectsFees.ts'
import { rightScroll } from '@/utils/index.ts'
import medicalDialog from './medicalDialog.vue'
// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'othersProject',
  components: {
    medicalDialog
  }
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private textarea: string = ''
  private isMerger: boolean = false // 项目归并弹框默认隐藏
  private isUpd: boolean = true // 新增与编辑切换
  private fygb: number | null = null // 费用归并
  private value: any = ''
  private searchData: any = {
    pydm: '',
    fyfl: 3
  }
  private tableData: Array<any> = []

  @Watch('tableData')
  private onValueChange(value: string) {
    rightScroll()
  }

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

  // 获取收费项目列表数据（全部调入的参数）
  get getSfxmList() {
    let sfxmList: Array<any> = []
    this.tableData.forEach((item: any) => {
      sfxmList.push(item.sfxm)
    })
    return sfxmList
  }

  // 新增按钮
  private handleAdd() {
    console.log(123)

    this.$nextTick(() => {
      const el: any = this.$refs.addFormDataRef
      el.resetFields()
    })
  }

  // 为子组件获取收费项目
  private getRowData(row: any) {
    this.fygb = row.sfxm
  }

  // 明细弹框
  private handleDetail() {
    if (this.fygb) {
      ;(this.$refs.medicalDialog as any).open()
    } else {
      this.$message({
        message: '请先选择医疗项目！',
        type: 'warning'
      })
    }
  }

  // 全部调入
  private handleTransfer() {
    transferAll({ fygbList: this.getSfxmList }).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        this.$notify({
          title: '调入成功！',
          message: '',
          type: 'success'
        })
      }
    })
  }

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    this.getList()
  }

  private handleSave() {}
  private handleTotal() {}
}
</script>
<style lang="scss" scoped>
.row .label .el-input {
  width: 190px;
}

.line {
  height: 16px;
  line-height: 16px;
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

// 基本信息底部边距
.content .his-small .retrieval::v-deep .el-row .el-form-item {
  margin-bottom: 16px;
}

// 右侧表单样式分布
.content .his-small .retrieval .el-row .el-form-item {
  width: calc(50% - 8px);
}
.content .his-small .retrieval {
  margin: 0;
  width: 100%;
}

//右侧状态框悬浮
::v-deep .el-table__fixed-right {
  height: 100% !important;
}
</style>
