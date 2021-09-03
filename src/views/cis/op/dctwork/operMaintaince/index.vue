<!--
 * @Date: 2020-05-15 16:01:27
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-22 19:02:35
 * @description: 手术信息维护
 -->

<template>
    <div class="content">
        <el-row class="ht"
                :gutter="10">
            <el-col class="ht"
                    :span="14">
                <div class="his-module his-small his-check-suite">
                    <pagenation-list ref="pageTable"
                                     v-model="tableDatas"
                                     data-url="/op-service/optssfl/allInfoNoUser"
                                     http-method="post"
                                     :list-height="listSlotHeight"
                                     :searchData="searchData">
                        <div slot="header"
                             class="row">
                            <div class="label">
                                <h1 class="title">{{ $t('个人常用手术项目维护') }}</h1>
                                <el-divider direction="vertical"></el-divider>
                                <div class="searchTitle">搜索</div>
                                <div>
                                    <el-input v-model="searchData.pydm"
                                              :placeholder="$t('hospitalDataDict.formValidPyCode')"
                                              @change="searchList">
                                        <i slot="prefix"
                                           class="el-input__icon icon his-search"></i>
                                    </el-input>
                                </div>
                            </div>
                        </div>
                        <el-table :data="tableDatas"
                                  border
                                  stripe
                                  :highlight-current-row="true"
                                  slot="list"
                                  @row-dblclick="handleLeftDblclick"
                                  :height="listSlotHeight"
                                  class="scroll-bar">
                            <!-- 序号 -->
                            <el-table-column prop="webSortNumber"
                                             width="32"
                                             align="center"></el-table-column>
                            <!-- 费用序号 -->
                            <!--              <el-table-column prop="fyxh" :label="$t('operMaintaince.fyxh')" width="70"></el-table-column>-->
                            <!-- 手术名称 -->
                            <el-table-column prop="fymc"
                                             :label="$t('operMaintaince.fymc')"
                                             min-width="150"
                                             :show-overflow-tooltip="true"></el-table-column>
                            <!-- 费用单价 -->
                            <el-table-column class-name="text-blue-td"
                                             :label="$t('operMaintaince.fydj')"
                                             min-width="70">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.fydj | makeTwoPoints }}</span>
                                </template>
                            </el-table-column>
                            <!-- 拼音代码 -->
                            <el-table-column prop="pydm"
                                             :label="$t('operMaintaince.pydm')"
                                             min-width="70"
                                             align="left"
                                             :show-overflow-tooltip="true"></el-table-column>
                        </el-table>
                    </pagenation-list>
                </div>
            </el-col>
            <el-col class="ht"
                    :span="10">
                <div class="his-module his-small">
                    <pagenation-list ref="pageTableRigth"
                                     v-model="tableList"
                                     data-url="/op-service/optssfl/userInfo"
                                     http-method="post"
                                     :list-height="listSlotHeight"
                                     :searchData="searchDataRight">
                        <div slot="header"
                             class="row">
                            <div class="label">
                                <h1 class="title">{{ $t('operMaintaince.titleRight') }}</h1>
                            </div>
                        </div>
                        <el-table :data="tableFormat"
                                  border
                                  stripe
                                  :highlight-current-row="true"
                                  slot="list"
                                  @row-dblclick="handleRightDblclick"
                                  :height="listSlotHeight"
                                  class="scroll-bar">
                            <!-- 序号 -->
                            <el-table-column prop="webSortNumber"
                                             width="32"></el-table-column>

                            <!-- 手术名称 -->
                            <el-table-column prop="ssmc"
                                             :label="$t('operMaintaince.ssmc')"
                                             min-width="140"
                                             :show-overflow-tooltip="true"></el-table-column>
                            <!-- 医生 -->
                            <el-table-column prop="ysdmName"
                                             :label="$t('operMaintaince.ysdm')"
                                             min-width="60"> </el-table-column>
                            <!-- 操作 -->
                            <el-table-column :label="$t('common.action')"
                                             align="center"
                                             min-width="60"
                                             class-name="fixed-width">
                                <template slot-scope="scope">
                                    <!-- 删除 -->
                                    <el-popconfirm hideIcon
                                                   :cancelButtonText="$t('common.cancel')"
                                                   :confirmButtonText="$t('common.confirm')"
                                                   :title="$t('sysManage.confirmDeleted') + '[' + scope.row.ssmc + ']'"
                                                   @confirm="handleDelete(scope.row)">
                                        <el-button slot="reference"
                                                   class="red">
                                            <i class="icon his-del his-cancellationicon"></i>
                                        </el-button>
                                    </el-popconfirm>
                                </template>
                            </el-table-column>
                        </el-table>
                    </pagenation-list>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { IOperMainObj, IOperDocObj, deleteOperObj, addOperObj } from '@/api/cis/op/dctwork/maintenanceSet'
import { id2Name, rightScroll } from '@/utils'
//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'OperMaintaince',
})
export default class extends Vue {
  //声明变量，方法

  private tableDatas: IOperMainObj[] = [] //全部手术
  private tableList: IOperDocObj[] = [] //科室手术
  private listSlotHeight: number = 0
  private doctorList: Array<any> = [] //医生
  private searchData: any = {
    pageNum: 1,
    pageSize: 10,
    fymc: '',
    pydm: '',
  }
  private searchDataRight: any = {
    pageNum: 2,
    pageSize: 10,
  }

  get tableFormat() {
    const tabledata = this.tableList
    id2Name(tabledata, 'ysdm', 'ysdmName', this.doctorList, 'dv', 'dn')
    return tabledata
  }

  @Watch('tableDatas')
  private onValueChange(value: string) {
    rightScroll()
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 62 - 43
  }
  mounted() {
    this.getList()
    this.doctorList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
  }

  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
    const pageTableRigth: any = this.$refs.pageTableRigth
    pageTableRigth.getList()
  }

  private searchList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
    const pageTableRigth: any = this.$refs.pageTableRigth
    pageTableRigth.searchList()
  }

  private handleLeftDblclick(value: IOperMainObj) {
    let param = {
      ssmc: '',
      ssnm: 0,
    }
    param.ssmc = value.fymc
    param.ssnm = value.fyxh

    addOperObj(param).then(() => {
      this.getList()
    })
  }

  private handleRightDblclick(value: IOperDocObj) {}
  private handleDelete(value: any) {
    deleteOperObj({ id: value.id }).then(() => {
      this.$notify({
        type: 'success',
        title: '已删除',
        message: '',
      })
      this.getList()
     })

  }
}
</script>

<style lang="scss" scoped>
.his-check-suite {
  padding-top: 8px;

  .row {
    padding-bottom: 0;

    .label {
      .el-divider--vertical {
        margin: 0 10px;
      }

      .btn {
        .el-button {
          padding: 4px 0;
        }
      }
    }
  }
}
.title {
  height: 28px;
  display: flex;
  align-content: center;
  flex-direction: row;
  align-items: center;
}
.search-title {
  white-space: nowrap;
  color: $first;
  font-size: 13px;
}
::v-deep .el-input {
  height: 28px !important;
  .el-input__prefix {
    margin: 0px 8px 0 10px !important;
  }
}
</style>
