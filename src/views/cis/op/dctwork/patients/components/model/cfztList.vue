<template>
<!-- 常用组套 -->
  <div>
    <pagenation-list class="ht" ref="pageTable" data-url="/op-service/opzt01/queryPage" v-model="tableDatas" :searchData="searchDataCfzt" :pageProps="{ layout: 'prev, pager, next' }" :list-height="listSlotHeight" http-method="post">
      <div slot="header" class="row">
        <el-radio-group v-model="searchDataCfzt.sslb" @change="getSearchList">
          <el-radio :label="1">本人</el-radio>
          <el-radio :label="2">本科室</el-radio>
          <el-radio :label="3">全院</el-radio>
        </el-radio-group>
      </div>
      <el-table slot="list" :data="tableDatas" @row-dblclick="handleChange" border highlight-current-row stripe :height="listSlotHeight" class="scroll-bar">
        <el-table-column prop="ztmc" label="组套名称"></el-table-column>
        <el-table-column prop="ztlb" label="组套类别">
          <template slot-scope="scope">
            <span>{{ scope.row.ztlb | filterLb }}</span>
          </template>
        </el-table-column>
      </el-table>
    </pagenation-list>

    <el-dialog :visible.sync="isVisiable" width="60%" :append-to-body="true" class="narrow-dialog" @closed="closed">
      <div slot="title">
        <div>{{ $t('处方组套') }}</div>
      </div>
      <div class="content his-dialog">
        <div class="his-module his-small his-mini">
          <el-table
            ref="selectTableData" 
            @selection-change="handleSelectionChange" 
            :data="tableformat" 
            border 
            fit 
            stripe 
            tooltip-effect="light" 
            :height="listSlotHeight" 
            :highlight-current-row="true" 
            slot="list" 
            class="scroll-bar"
          >
            <el-table-column type="selection" width="26"></el-table-column>
            <el-table-column type="index" width="40"></el-table-column>
            <el-table-column prop="ypzh" width="16" class="table-ypzh" class-name="color-group">
              <template slot-scope="scope">
                <div class="w100" :class="scope.row.ypzh % 2 == 1 ? 'greenBack' : 'orangeBack'"></div>
              </template>
            </el-table-column>
            <el-table-column prop="ypmc" label="药品名称" min-width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="yfgg" label="规格" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="jb" label="几倍" width="50"></el-table-column>
            <el-table-column prop="ycjl" label="单次剂量" width="70"></el-table-column>
            <el-table-column prop="jldw" width="32"></el-table-column>
            <el-table-column prop="sypc" label="频次" width="60"></el-table-column>
            <el-table-column prop="yyts" label="天数" width="50" v-if="this.searchData.cflx != 3"></el-table-column>
            <el-table-column prop="xmsl" label="总量" width="50"></el-table-column>
            <el-table-column prop="yfdw" width="50"></el-table-column>
            <el-table-column prop="gytjName" label="用法" width="60"></el-table-column>
            <el-table-column prop="jfName" label="煎法" width="60" v-if="this.searchData.cflx == 3"></el-table-column>
            <el-table-column prop="cdmc" label="药品产地" min-width="120">
              <template slot-scope="scope">
                <div>
                  <select-box
                    v-model="scope.row.cdmc" 
                    :required="true" 
                    :ref="`${scope.$index}-6`" 
                    style="height: 32px;" 
                    :options="scope.row.cdList" 
                    option_label_filed="cdmc"
                    option_value_filed="cdmc" 
                    label1="lsjg" 
                    label2="cdmc" 
                    @getData="getLsjg"
                  ></select-box>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="fydj" label="单价" width="60"></el-table-column> -->
          </el-table>
        </div>
      </div>

      <div slot="footer" class="dialog-footer foot">
        <el-button @click="isVisiable = false">{{ $t('common.close') }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { queryDetail } from '@/api/cis/op/dctwork/examineSuite'
import { id2Name } from '@/utils'
import eventSon from '@/utils/bus'

@Component({
  name: 'CfztList',
  filters: {
    filterLb(value: any) {
      switch (value) {
        case 1:
          return '西药'
        case 2:
          return '中药'
        case 3:
          return '草药'
      }
    },
  },
})
export default class extends Vue {
  @Prop({ required: true }) private searchData!: any
  private searchDataCfzt: any = {
    sslb: 1,
    ztlb: this.searchData.ztlb,
    ksdm: Vue.prototype.AUTHORITY.bussinessRole,
    sfqy: 1
  }
  private tableDatas: Array<any> = []
  private tableList: Array<any> = []
  private isVisiable: boolean = false
  private listSlotHeight: number = 0
  private multipleSelection: Array<any> = []
  private tjList: Array<any> = []
  private jzList: Array<any> = []

  // @Watch('searchData',{immediate:true,deep:true})
  // private searchDataChange(val:any) {
  //   if (val.ztlb) {
  //     this.getList()
  //   }
  // }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 270
  }

  mounted() {
    console.log('this.searchData', this.searchData)
    this.searchDataCfzt.sslb = 1
    this.jzList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.JZ_DICT : this.$store.state.webSqlDict.JZ_DICT
    this.tjList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_METHOD_DICT : this.$store.state.webSqlDict.DRUG_METHOD_DICT
  }

  private getList() {
    this.searchDataCfzt.ztlb = this.searchData.ztlb
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private searchList() {
    // delete this.searchData.yfsb
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

  private getLsjg(val: any) {
    let cc = this.tableList.find((item: any) => item.ypxh == val.ypxh)
    cc.fydj = val.lsjg
    this.$set(cc,'cddm',val.ypcd)
  }

  private handleChange(row: any) {
    console.log(row)
    const params:any = {
      ztbh: row.ztbh,
      ztlb: row.ztlb,
      ksid: Vue.prototype.AUTHORITY.bussinessRole
    }
    queryDetail(params).then((res: any) => {
      if (res.data.length == 0) {
        this.$notify({
          type: 'warning',
          title: '该组套下没有药品',
          message: '',
        })
        return
      } else {
        // res.data.map((item: any, index: number) => {
        //   item.webSortNumber = index + 1
        // })
        this.isVisiable = true
        this.tableList = res.data.map((obj: any) => {
          if (obj.cdList[0] && obj.cdList[0].cdmc) {
            obj.cdmc = obj.cdList[0].cdmc
            obj.fydj = obj.cdList[0].lsjg
          }
          return obj
        })
        
        this.$nextTick(()=> {
          const selectDataAll :any = this.$refs.selectTableData
          // selectDataAll.toggleAllSelection()
          this.tableList.forEach((item: any)=> {
            this.$set(item,'cddm',item.cdList[0].ypcd)
            selectDataAll.toggleRowSelection(item,true) // 默认选中全部
          })
        })
      }
    })
  }


  get tableformat() {
    const tablelist = this.tableList
    id2Name(tablelist, 'gytj', 'gytjName', this.tjList, 'dv', 'dn')
    id2Name(tablelist, 'jz', 'jfName', this.jzList, 'dv', 'dn')
    return tablelist
  }

  private getSearchList(val:any) {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private handleSelectionChange(row: any) {
    this.multipleSelection = row
  }

  private handleConfirm() {
    if (this.multipleSelection.length == 0) {
      this.$notify.warning('请选择药品')
      return
    } else if (this.multipleSelection.length == this.tableList.length) {
      this.$emit('setDataList', this.multipleSelection)
    } else {
      this.$emit('setDataList', this.multipleSelection)
    }
    this.isVisiable = false
  }

  private closed() {
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
  .el-dialog__footer .el-button {
    width: auto !important;
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
::v-deep .el-dialog__wrapper.narrow-dialog .el-dialog__footer{
  border-top: none
}
::v-deep.el-dialog__wrapper.narrow-dialog .el-dialog__footer {
  border-top: none
}
</style>
