<!--
 * @Date: 2020-05-24 14:13:09
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-14 17:16:20
 * @description:  诊疗方案列表
-->
<template>
    <div class="content his-patient-treat">
        <div class="his-module his-small"
             style="width: 100%;">
            <pagenation-list ref="pageTable"
                             v-model="tableDatas"
                             data-url="/op-service/gyzlfa/queryPage"
                             http-method="post"
                             :searchData="searchData"
                             :list-height="listSlotHeight">
                <div slot="header"
                     class="row">
                    <div class="label">
                        <div class="querySearch">
                            <div class="searchTitle no-warp"
                                 style="padding-right: 8px">搜索</div>
                        </div>
                        <el-input placeholder="请输入诊疗方案名称"
                                  v-model="searchData.pydm"
                                  @change="handleSearch"
                                  @blur="clearSearch"
                                  clearable
                                  @keyup.enter.native="searchList" />
                        <el-divider direction="vertical"></el-divider>
                        <div class="btn">
                            <el-button size="mini"
                                       type="text"
                                       @click="joinIn">
                                <i class="icon his-caozuo-fold"></i>
                                {{ $t('patients.dr') }}
                            </el-button>
                        </div>
                    </div>
                </div>

                <el-table :data="tableDatas"
                          border
                          stripe
                          :highlight-current-row="true"
                          slot="list"
                          @row-click="rowClick"
                          @row-dblclick="handleLeftDblclick"
                          class="scroll-bar"
                          :height="listSlotHeight">
                    <!-- :height="listSlotHeight" -->
                    <!-- 序号 -->
                    <el-table-column prop="webSortNumber"
                                     width="32"></el-table-column>
                    <!-- 诊疗方案名称 -->
                    <el-table-column prop="zlmc"
                                     :label="$t('诊疗方案名称')"
                                     width="248"></el-table-column>
                    <!-- 启用 -->
                    <el-table-column prop="qybz"
                                     :label="$t('状态')">
                        <template slot-scope="scope">
                            <span :class="scope.row.qybz == 1 ? 'blues' : 'reds'">
                                {{scope.row.qybz == 1 ? $t('common.enable') : $t('common.disable')}}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </pagenation-list>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { id2Name } from '@/utils'
import { aJoinInTreatment } from '@/api/cis/op/dctwork/treamentSet.ts'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'MorePatients'
})
export default class extends Vue {
  @Prop({ required: true }) private patientData!: any

  private tableDatas: any[] = []
  private searchData: any = {
    pageNum: 1,
    pageSize: 10,
    zlmc: ''
  }
  private listSlotHeight: number = 0
  private sign: Array<any> = [] //启用/停用
  private curRow: any = {} // 当前行

  //左侧搜索
  private handleSearch() {
    this.getLists()
  }

  //搜索列表
  private searchList() {
    const pageTable: any = this.$refs.pageTable
    if (this.searchData) {
      pageTable.getList()
    } else {
      pageTable.searchList()
    }
  }

  private clearSearch() {
  }


  //获取表格数据
  private getLists() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 单击
  private rowClick(row: any) {
    this.curRow = row
  }

  // 双击
  private handleLeftDblclick(row: any) {
    this.joinIn()
  }

  // 调入
  private joinIn() {
    if (this.curRow.qybz == 0) {
      this.$notify({
        title: '已停用，无法调入',
        message: '',
        type: 'error'
      })
      return false
    }

    this.$confirm(`载入模版将覆盖当前病历内容，确认要载入当前模版吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      closeOnClickModal: false
    }).then(() => {
      let params = {
        brid: this.patientData.brid,
        brxm: this.patientData.brxm,
        brxz: this.patientData.brxz,
        ghks: this.patientData.ghks,
        jzxh: this.patientData.jzxh,
        mzks: this.patientData.mzks,
        zlxh: this.curRow.zlxh
      }
      aJoinInTreatment(params).then((res: any) => {
        if (res) {
          this.$emit('loaded', res.data)
        }
      })
    }).catch(() => {

    })

  }


  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 220
  }

  mounted() {
    this.getLists()
    this.sign = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.STOP_FLAG_DICT : this.$store.state.webSqlDict.STOP_FLAG_DICT
  }
}
</script>

<style lang="scss" scoped>
.his-patient-treat {
	padding: 0 !important;

	.his-small {
		padding-top: 4px;
		.row {
			padding-bottom: 4px;

				.el-divider--vertical {
					margin: 0 10px;
				}

			.no-warp {
				margin-top: 2px;
				font-family: siyuanMedium;
			}
			.btn .el-button {
				padding: 4px 0;
			}
		}
	}

}
</style>
