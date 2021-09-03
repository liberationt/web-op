// 收费明细项目维护--明细
<template>
  <el-dialog
    :visible.sync="isVisible"
    title="项目明细"
    width="760px"
    :append-to-body="true"
    class="narrow-dialog"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <div class="content his-sys-content">
      <div class="his-module his-small" style="padding: 8px 10px">
        <div class="row" style="padding: 8px 0">
          <div class="label">
            <div style="font-size: 13px; margin-right: 8px;">搜索</div>
            <el-input
              v-model="searchData.pydm"
              placeholder="请输入拼音码"
              @keyup.native.enter="getDataList"
              clearable
              @clear="getDataList"
            >
              <i slot="prefix" class="el-input__icon icon his-search"></i>
            </el-input>
            <el-divider class="ml4" direction="vertical"></el-divider>
            <div class="btn">
              <el-button type="text" size="mini" @click="handleAdd">
                <i class="icon his-caozuo-fold"></i>调入
              </el-button>
              <el-button type="text" size="mini" @click="modify">
                <i class="icon his-btn-edit"></i>修改
              </el-button>
              <el-button type="text" size="mini">
                <i class="icon his-btn-print"></i>打印
              </el-button>
              <el-button type="text" size="mini" @click="handleClose">
                <i class="icon his-btn-close-copy red"></i>关闭
              </el-button>
            </div>
          </div>
        </div>
        <pagenation-list
          ref="pageTable"
          data-url="/op-service/institutionalFeeItems/queryInstitutionalFeeCollection"
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
            :height="listSlotHeight/2"
            highlight-current-row
            class="scroll-bar"
            tooltip-effect="light"
            @row-click="getRowData"
            @row-dblclick="modify"
          >
            <el-table-column type="index" width="32" align="center"></el-table-column>
            <el-table-column label="费用名称" prop="fymc" min-width="140" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="fydw" min-width="60px" show-overflow-tooltip></el-table-column>
            <el-table-column label="拼音码" prop="pydm" min-width="90" show-overflow-tooltip></el-table-column>
            <el-table-column label="单价" prop="fydj" min-width="70px"></el-table-column>
            <el-table-column label="自动插入" prop="zdcr" min-width="70px">
              <template slot-scope="scope">
                <span
                  :class="[scope.row.zdcr == '1' ? 'blues' : 'reds']"
                >{{scope.row.zdcr == '1' ? '是' : '否'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="限制使用" prop="xzsy" width="70px">
              <template slot-scope="scope">
                <span
                  :class="[scope.row.xzsy == '1' ? 'blues' : 'reds']"
                >{{scope.row.xzsy == '1' ? '是' : '否'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="限制周期" prop="xzts" min-width="70px"></el-table-column>
            <el-table-column label="限制次数" prop="xzcs" min-width="70px" show-overflow-tooltip></el-table-column>
            <el-table-column label="商保价格" prop="sbjg" min-width="70" show-overflow-tooltip></el-table-column>
            <el-table-column label="CPT CODE" prop="cptcode" min-width="90"></el-table-column>
            <el-table-column label="英文名称" prop="ywmc" min-width="140px" show-overflow-tooltip></el-table-column>
            <el-table-column label="价格标志" prop="jgbz" min-width="70px">
              <template slot-scope="scope">
                <span
                  :class="[scope.row.xzsy == '1' ? 'blues' : 'reds']"
                >{{scope.row.xzsy == '1' ? '启用' : '未启用'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="是否作废" prop="zfpb" min-width="70px">
              <template slot-scope="scope">
                <span
                  :class="[scope.row.zfpb == '0' ? 'blues':'reds']"
                >{{scope.row.zfpb == '0' ? '未作废' : '已作废'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="52"
              class-name="action-btns"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <!-- 作废/取消作废 -->
                <el-tooltip :content="scope.row.zfpb == '0'?'作废':'取消作废'" effect="light">
                  <el-popconfirm
                    class="ml10"
                    hideIcon
                    :confirmButtonText="
                    scope.row.zfpb == '0' ? '作废':'取消作废'"
                    :cancelButtonText="$t('common.cancel')"
                    :title="
                    scope.row.zfpb == '0'
                      ? '确认作废?'
                      : '确认取消作废?'
                  "
                    @confirm="handleCancel(scope.row)"
                  >
                    <el-button slot="reference" :class="[scope.row.zfpb == '0' ? 'red' : 'green']">
                      <i
                        class="icon"
                        :class="[
                        scope.row.zfpb == '0'
                          ? 'his-youcaozuo_zuofei'
                          : 'his-youcaozuo_huifu',
                      ]"
                      ></i>
                    </el-button>
                  </el-popconfirm>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </pagenation-list>
        <transferIn ref="transferIn" v-bind:fygb="fygb"></transferIn>
        <payServices ref="payServices" v-bind:editDetail="editDetail" @getNewData="getNewData" @switchState="switchState"></payServices>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { log } from 'util'
import { rightScroll, id2Name } from '@/utils/index.ts'
import { cancelDetail } from '@/api/his/sys/centerMaintenance/medicareInfoManage/InstitutionalProjectsFees.ts'
import transferIn from './transferIn.vue'
import payServices from './payServices.vue'
// 命名文件名称，过滤器什么的都在这里写
@Component({
  name: 'medicalDialog',
  components: { transferIn, payServices }
})
export default class extends Vue {
  @Prop({ required: false, default: 0 }) private fygb!: number
  private isVisible: boolean = false // 明细弹框默认隐藏
  private isCancel: boolean = false
  private listSlotHeight: number = 0
  private value: any = ''
  private sfxhList: Array<any> = [] // 收费序号列表
  private tableData: Array<any> = []
  private editFlag: boolean = false // 修改标志
  private searchData: any = {
    fygb: '',
    pydm: ''
  }
  private editDetail: any = {} // 修改参数

  // 获取表格数据
  private getDataList() {
    this.searchData.fygb = this.fygb
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

  // 作废、取消作废
  private handleCancel(row: any) {
    const params: any = {
      fyxh: row.fyxh,
      zfpb: row.zfpb == 1 ? 0 : 1
    }
    console.log(row)

    cancelDetail(params).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.$notify({
          title: row.zfpb == '0' ? '已作废' : '已取消作废',
          message: '',
          type: 'success'
        })
        this.getDataList()
      }
    })
  }

  // 获取表格单行数据
  private getRowData(row: any) {
    this.editFlag = true
    console.log(row)
    this.editDetail = row
  }

  // 修改之后刷新列表
  private getNewData() {
    this.getDataList()
  }

  private open() {
    this.isVisible = true
    this.$nextTick(() => {
      this.getDataList()
    })
  }

  private handleClose() {
    this.isVisible = false
  }
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }

  @Watch('tableData')
  private onValueChange(value: string) {
    rightScroll()
  }

  //调入弹框
  private handleAdd() {
    ;(this.$refs.transferIn as any).open()
  }
  //修改弹框
  private modify() {
    if (this.editFlag) {
      ;(this.$refs.payServices as any).open()
    } else {
      this.$message({
        message: '请先选择费用名称！',
        type: 'warning'
      })
    }
  }

  private switchState() {
    this.editFlag = false
  }

  private closeDialog() {
    this.editFlag = false
  }
}
</script>
<style lang="scss" scoped>
.content {
  background: #fff;
  height: auto;
  border-radius: 8px;
}

.his-module.his-small {
  padding: 0 0 8px !important;
}
.row .label .el-input {
  width: 190px;
}

.el-dialog__wrapper.narrow-dialog .el-dialog__body .row {
  padding-bottom: 0;
}
// 右侧状态框悬浮
::v-deep .el-table__fixed-right {
  height: 100% !important;
}
</style>
