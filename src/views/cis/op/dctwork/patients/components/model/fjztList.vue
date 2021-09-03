<template>
    <div>
        <pagenation-list class="ht"
                         ref="pageTable"
                         data-url="/op-service/opzt01/queryPage"
                         v-model="tableDatas"
                         :searchData="searchData"
                         :pageProps="{ layout: 'prev, pager, next' }"
                         :list-height="listSlotHeight"
                         http-method="post">
            <div slot="header"
                 class="row">
                <el-radio-group v-model="searchData.sslb"
                                @change="getSearchList">
                    <el-radio :label="1">本人</el-radio>
                    <el-radio :label="2">本科室</el-radio>
                    <el-radio :label="3">全院</el-radio>
                </el-radio-group>
            </div>
            <el-table slot="list"
                      :data="tableDatas"
                      @row-dblclick="handleChange"
                      border
                      highlight-current-row
                      stripe
                      :height="listSlotHeight - 10"
                      class="scroll-bar">
                <el-table-column prop="ztmc"
                                 label="组套名称"></el-table-column>
            </el-table>
        </pagenation-list>

        <el-dialog :visible.sync="isVisiable"
                   width="420px"
                   :append-to-body="true"
                   class="narrow-dialog"
                   @closed="closed">
            <div slot="title">
                <div>{{ $t('项目名称') }}</div>
            </div>
            <div class="content his-dialog">
                <div class="his-module his-small his-mini">
                    <el-table ref="tableList"
                              @selection-change="handleSelectionChange"
                              :data="tableformat"
                              border
                              :fit="true"
                              stripe
                              tooltip-effect="light"
                              :highlight-current-row="true"
                              slot="list"
                              class="scroll-bar"
                              @row-click="abc">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="webSortNumber"
                                         width="32"></el-table-column>
                        <el-table-column prop="ypzh"
                                         width="17"
                                         class="table-ypzh"
                                         class-name="color-group">
                            <template slot-scope="scope">
                                <div class="w100"
                                     :class="scope.row.ypzh % 2 == 1 ? 'greenBack' : 'orangeBack'"></div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="xmmc"
                                         label="项目名称"
                                         show-overflow-tooltip></el-table-column>
                        <el-table-column prop="fydj"
                                         label="单价"
                                         width="80"></el-table-column>
                        <el-table-column prop="xmsl"
                                         label="数量"
                                         width="60"></el-table-column>
                    </el-table>
                </div>
            </div>

            <div slot="footer"
                 class="dialog-footer foot">
                <el-button @click="isVisiable = false">{{ $t('common.close') }}</el-button>
                <el-button type="primary"
                           @click="handleConfirm">{{ $t('common.confirm') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { queryDetail, queryDetailXm } from '@/api/cis/op/dctwork/examineSuite'
import { id2Name } from '@/utils'
import Bus from '@/utils/bus'

@Component({
  name: 'CfztList',
})
export default class extends Vue {
  @Prop({ required: true }) private searchData!: any
  private tableDatas: Array<any> = []
  private tableList: Array<any> = []
  private isVisiable: boolean = false
  private listSlotHeight: number = 0
  private multipleSelection: Array<any> = []
  private tjList: Array<any> = []
  private info: any = {}
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 270
  }

  get tableformat() {
    const tablelist = this.tableList
    id2Name(tablelist, 'gytj', 'gytjName', this.tjList, 'dv', 'dn')
    return tablelist
  }

  mounted() {
    // debugger
    // Bus.$on('open',(data:any)=>{
    //   this.handleChange(data)
    // })
    this.tjList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_METHOD_DICT : this.$store.state.webSqlDict.DRUG_METHOD_DICT
    this.getList()
  }

  private abc(row:any) {
    console.log('86',row.ypzh)
  }

  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 双击行事件
  private handleChange(row: any) {
    queryDetailXm({ ztbh: row.ztbh }).then((res: any) => {
      if (res.data.length == 0) {
        this.$notify({
          type: 'warning',
          title: '该组套下没有项目',
          message: '',
        })
        return
      } else {
        res.data.map((item: any, index: number) => {
          item.webSortNumber = index + 1
        })
        this.tableList = res.data
        this.info = {
          ztmc: row.ztmc,
          ztlb: this.searchData.ztlb,
          ztbh: row.ztbh,
        }
        this.isVisiable = true
        this.$nextTick(()=> {
          const selAll: any = this.$refs.tableList
          this.tableList.forEach((rel: any)=>{
            selAll.toggleRowSelection(rel,true) // 默认选中全部
          })
        })
      }
    })
  }



  private getSearchList(val: any) {
    // debugger
    if (this.searchData.sslb == 3 || this.searchData.sslb == 1) {
      delete this.searchData.ksdm
      const pageTable: any = this.$refs.pageTable
      pageTable.searchList()
    }
    if (this.searchData.sslb == 2) {
      this.searchData.ksdm = Vue.prototype.AUTHORITY.outpatientCode
      const pageTable: any = this.$refs.pageTable
      pageTable.searchList()
    }
  }

  private handleSelectionChange(row: any) {
    this.multipleSelection = row
  }

  private closed() {
    this.isVisiable = false
  }

  private handleConfirm() {
    if (this.multipleSelection.length == 0) {
      this.$message.warning('请选择要调入的组套明细')
      return
    // } else if (this.tableList.length == this.multipleSelection.length && this.searchData.ztlb > 1) {
    //   this.$emit('setDataList', this.info)
    } else {
      this.$emit('setDataList', this.multipleSelection)
    }
    // this.$emit('checkAllData',this.tableList)
    this.isVisiable = false
  }
}
</script>

<style lang="scss" scoped>
.patient {
  .el-table--border {
    th {
      height: 28px !important;
      line-height: 28px !important;
    }
  }
}

.content {
  .pagenation-list {
    width: 100%;
  }
}

.his-dialog {
  padding: 0 !important;
  height: auto;
  /*::v-deep .el-table--medium td .cell {*/
  /*	padding: 0 !important;*/
  /*}*/
  .w100 {
    height: 28px;
    width: 100%;
  }

  ::v-deep .color-group .cell {
    padding: 0 !important;

    .orangeBack,
    .greenBack {
      height: 32px;
      opacity: 0.3 !important;
    }

    .greenBack {
      background: #0fcaad;
    }

    .orangeBack {
      background: #ffbf00;
    }
  }
}
</style>
