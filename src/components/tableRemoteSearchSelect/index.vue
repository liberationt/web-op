<template>
  <div class="tableRemoteSearchSelect">
    <el-select
      :disabled="disabled"
      ref="select"
      v-popover:popover
      v-model="data"
      filterable
      remote
      @blur="selectBlur"
      reserve-keyword
      :placeholder="placeholder"
      :remote-method="
        query => {
          remoteMethod(query)
        }
      "
      :popper-append-to-body="false"
      :clearable="true"
      @clear="clear"
      class="w100"
    >
      <div slot="empty"></div>
    </el-select>
    <el-popover
      :visible-arrow="false"
      placement="bottom-start"
      :width="popoverWidth"
      trigger="manual"
      v-model="visible"
      ref="popover"
      popper-class="table-remote-search-popper-zdm"
    >
      <div class="popover-box" @click="clickPopover" @mouse="clickPopover">
        <pagenation-list
          ref="pageTable"
          v-model="resultOptions"
          :data-url="Url"
          :data-num="dataType"
          http-method="post"
          :list-height="400"
          :searchData="SearchData"
          :key="listKey"
          :pageProps="{ layout: 'total, prev, pager, next' }"
          @reqComplete="reqComplete"
        >
          <div slot="list" class="scroll-bar table-remote-search-select-zdm">
            <div @click="clickPopover">
              <el-table
                popper-class="option"
                :data="resultOptions"
                :fit="true"
                :highlight-current-row="true"
                @row-click="
                  row => {
                    selectResult(row)
                  }
                "
                ref="singleTable"
                class="no-underline popover-table"
                v-if="visible"
                height="309"
              >
                <el-table-column type="index" width="40" align="center"></el-table-column>
                <el-table-column
                  v-for="result in ResultTableHeader"
                  :key="result.prop"
                  :prop="result.prop"
                  :label="result.label"
                  :width="result.width"
                  :show-overflow-tooltip="true"
                ></el-table-column>
              </el-table>
            </div>
          </div>
        </pagenation-list>
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { log } from 'util'
@Component({
  name: 'remoteSearchSelect',
})
export default class extends Vue {
  @Prop({ required: true, default: '' }) private value!: any //v-model的数据
  @Prop({ required: false, default: 600 }) private popoverWidth!: number //弹出框的宽度
  @Prop({ required: false, default: false }) private disabled!: boolean //是否禁用
  @Prop({ required: false, default: '' }) private placeholder!: string //占位符
  @Prop({ required: false, default: 0 }) private dataType!: number // 判断类型
  @Prop({ required: true, default: () => {} }) private searchData!: any // 查询的固定字段
  @Prop({ required: true, default: () => {} }) private resultTableHeader!: any // 搜索返回的结果列表表头
  @Prop({ required: true, default: () => {} }) private searchField!: any //搜索用到的编辑的字段
  @Prop({ required: true, default: () => {} }) private showLabel!: any //显示哪个字段
  @Prop({ required: true, default: '' }) private name!: string //页面名称

  private resultOptions: Array<any> = []
  private visible: boolean = false
  private listKey: number = 0
  private isClickPopover: boolean = false
  private Url: string = ''
  private SearchData: any = {}
  private SearchField: string = ''
  private ResultTableHeader: any[] = []
  private ShowLabel: string = ''
  private data: any = ''
  private queryFlag: string = 'yp'
  private yp: any = {
    // 直接查询的接口,
    fj: '/op-service/ypsrf/queryXmDic', //中心维护附加项目字典
    sf: '/op-service/ypsrf/queryZlsfdzDic', //诊疗收费对照字典
    jky: '/op-service/opypxz/drug/queryPages', //进口药
    bqyz: '/im-service/doctorTypeWrite/queryBqyzYp', //病区医嘱
    mzys_fj: '/op-service/ypsrf/queryMzYsFj', //门诊医生-辅检
    mzys_cf: '/drug-service/ypsrf/queryDrugsTypk', //门诊医生-开药
    gmy: '/op-service/ypsrf/queryAllergicDrugsInfo', //过敏药物
    ypcd: '/op-service/drugscddz/queryPage', //药品产地
    zby: '/op-service/ypsrf/queryBqyzYpSelfMedicine', // 转自备药
    yzyp: '/im-service/doctorTypeWrite/queryBqyzYp', // 医嘱药品
    ybyp: '/op-service/ybdzypxx/queryPage', //医保药品
    jyxm: '/op-service/ypsrf/queryFeeYlsfxmdj', // 检验项目
    // jyxm: '/op-service/ypsrf/queryMzYsFj', // 检验检查项目
    gh_jc: '/op-service/opmzxx/doQueryJsjc', // 检查（挂号）
    ypzt: '/drug-service/ypsrf/queryYpzt', //  常用组套
    ykyp: '/op-service/ypsrf/queryTagrk', //药库-药品入库
    qtrk: '/op-service/ypsrf/queryTagcszc', //药库-其他入库
    yptj: '/op-service/ypsrf/queryTagtj', //药库-药品调价
    ckcl: '/op-service/ypsrf/queryTagykck', //药库-出库处理非0
    ckclUN: '/op-service/ypsrf/queryTagykckNoyf', //药库-出库处理0
    ckyp: '/op-service/selector/query/data?type=outStoreProcess', //药库-出库药品输入法
    cy_fm_jf: '/op-service/ypsrf/cyFmJc', // 草药 方名/煎法
    // sssq: '/op-service/optssfl/hospitalInfo', //手术申请
    sssq: '/op-service/optssfl/allInfo', //手术申请
    sssqNew: '/mms-service/operation/apply/selector', //新的手术申请
    jhdw: '/op-service/selector/query/data?type=purchasingUnit', //药库-进货单位
    ypsl: '/op-service/selector/query/data?type=drugApply', // 药品申领
    yprk: '/op-service/selector/query/data?type=drugInStore', // 药品入库
    ypck: '/op-service/selector/query/data?type=drugOutStore', // 药品出库
    dbsq: '/op-service/selector/query/data?type=allocationInStore', // 调拨申请
    dbty: '/op-service/selector/query/data?type=allocationRefund', // 调拨出药
    fytj: '/op-service/ypsrf/queryModifyPricecFeeYlsfxm', // 费用调价
    tycl: '/op-service/selector/query/data?type=refundDrug', // 退药处理
    ypyh: '/op-service/selector/query/data?type=drugMaintenance', // 药品养护
    ykybyp: '/op-service/selector/query/data?type=medicalInsurance', // 药库-医保药品
    ykypcd: '/op-service/selector/query/data?type=drugOrigin', // 药库-药品价格-药品产地
    ypxz: '/op-service/pubbrxz/ypDic', // 药品限制
    fymc: '/op-service/pubbrxz/fyDic', // 费用限制
    zlgl_sfxm: '/op-service/ypsrf/queryZlXmDic', //治疗项目-收费项目输入法
    fyjz: '/op-service/ypsrf/queryDrugAccounting', // 费用记帐
    zlsq: '/mtdms-service/zlxm/queryZlxmSrf', //治疗申请查询治疗项目输入法
    zycyf: '/op-service/ypsrf/queryCisyzHerbal', // 住院草药方
    hzzj: '/op-service/ypsrf/queryAmqcRyKsInfo', // 会诊专家
    zyjz: '/op-service/selector/query/data?type=bookkeeping', // 住院记账
    fjxmyz:'/op-service/ypsrf/queryBqyzXm', // 附加项目
    xyzd: '/system-service/dicjbbm/westQueryPage', // 西医诊断
    zyzd: '/system-service/diczyjb/zyPage', // 中医诊断
    zyzh: '/system-service/dicjbbm/zhQueryAll', // 中医证侯
    zgxm: '/system-service/hrpersonnel/queryByCondition', // 全部职工姓名
  }
  private zt: any = {
    // 前面要输入/的查询
    bqyz: '/op-service/ypsrf/queryNisQtyz', //病区医嘱
    mzys_fj: '/op-service/ypsrf/queryMzYsFjZt', //门诊医生-辅检（组套）
    mzys_cf: '/op-service/ypsrf/ztsrf', //门诊医生-开药（组套）
    gmy: '/op-service/ypsrf/queryAllergicDrugsInfo', //过敏药物
    yzyp: '/op-service/ypsrf/queryNisQtyz', // 其他医嘱
    gh_jc: '/op-service/opmzxx/doQueryJcZtInfo', // 检查组套（挂号）
    fyjz: '/op-service/ypsrf/queryProjectStackAccounting', // 费用记帐
    zycyf: '/op-service/ypsrf/queryCisyzHerbal', // 住院草药方
    hzzj: '/op-service/ypsrf/queryAmqcRyKsInfo', // 会诊专家
    fjxmyz:'/op-service/ypsrf/queryBqyzXm', // 附加项目
  }
  private xm: any = {
    // 前面要输入.的查询
    bqyz: '/op-service/ypsrf/queryBqyzXm', //病区医嘱
    gmy: '/op-service/ypsrf/queryAllergicDrugsInfo', //过敏药物
    zby: '/op-service/ypsrf/queryBqyzXm', // 转自备药
    yzyp: '/im-service/doctorTypeWrite/queryBqyzXm', // 医嘱药品
    fyjz: '/op-service/ypsrf/queryExpenseAccounting', // 费用记帐
    zycyf: '/op-service/ypsrf/queryCisyzHerbal', // 住院草药方
    hzzj: '/op-service/ypsrf/queryAmqcRyKsInfo', // 会诊专家
    fjxmyz:'/op-service/ypsrf/queryBqyzXm', // 附加项目
  }

  created() {
    this.data = this.value
  }
  @Watch('value')
  private onValueChange(val: any) {
    this.data = val
  }

  private remoteMethod(query: string) {
    const pageTable: any = this.$refs.pageTable
    let queryFiled = ''
    switch (query[0]) {
      case '/':
        if (this.zt[this.name]) {
          this.queryFlag = 'zt'
          this.Url = this.zt[this.name]
          this.ShowLabel = this.showLabel.zt
          queryFiled = query.slice(1)
          this.SearchData = this.searchData.zt
          this.SearchField = this.searchField.zt
          this.ResultTableHeader = this.resultTableHeader.zt
        } else {
          return
        }
        break
      case '.':
        if (this.xm[this.name]) {
          this.queryFlag = 'xm'
          this.Url = this.xm[this.name]
          this.ShowLabel = this.showLabel.xm
          queryFiled = query.slice(1)
          this.SearchData = this.searchData.xm
          this.SearchField = this.searchField.xm
          this.ResultTableHeader = this.resultTableHeader.xm
        } else {
          return
        }
        break
      default:
        if (this.yp[this.name]) {
          this.queryFlag = 'yp'
          this.Url = this.yp[this.name]
          this.ShowLabel = this.showLabel.yp
          queryFiled = query
          this.SearchData = this.searchData.yp
          this.SearchField = this.searchField.yp
          this.ResultTableHeader = this.resultTableHeader.yp
        } else {
          return
        }
        break
    }
    if (queryFiled.length > 1) {
      // console.log(' this.SearchData', this.SearchData, 'this.SearchField', this.SearchField)
      this.SearchData[`${this.SearchField}`] = String(queryFiled)
      this.$nextTick(() => {
        pageTable.searchList()
      })
      this.showPopover()
    } else {
      this.closePopover()
    }
  }

  private reqComplete() {
    if (this.resultOptions) {
      let table: any = this.$refs.singleTable
      this.currentRowIndex = 0
      table.setCurrentRow(this.resultOptions[this.currentRowIndex])
    }
  }

  private selectResult(row: any) {
    //点击选择搜索的结果，将这一行数据返回给父组件
    // this.value = row[`${this.showLabel}`]
    this.data = row[this.ShowLabel]
    this.$emit('input', this.data)
    this.$emit('change', row)
    this.$emit('getData', row, this.queryFlag)
    this.isClickPopover = false
    setTimeout(() => {
      this.closePopover()
    }, 100)
  }
  private showPopover() {
    this.visible = true
    addEventListener('keyup', this.keyUp)
  }
  private closePopover() {
    this.visible = false
    this.resultOptions = []
    this.currentRowIndex = -1
    removeEventListener('keyup', this.keyUp)
  }
  private clickPopover() {
    //点击弹出框，弹出框不消失
    this.isClickPopover = true
    this.visible = true
    try {
      const select: any = this.$refs.select
      if (select) {
        select.focus()
      }
    } catch {}

    setTimeout(() => {
      this.isClickPopover = false
    }, 300)
  }
  private focus() {
    ;(this.$refs.select as any).focus()
  }
  private selectBlur() {
    //选择框失去焦点时弹出框消失
    setTimeout(() => {
      if (!this.isClickPopover) {
        this.closePopover()
        this.$emit('visibleChange')
      }
    }, 300)
  }

  private blur() {
    setTimeout(() => {
      ;(this.$refs.select as any).blur()
      this.closePopover()
      this.$emit('visibleChange')
    }, 50)
  }

  private currentRowIndex: number = 0
  private currentRowValue: any = {}

  private keyUp(e: any) {
    if (this.resultOptions.length == 0) return
    let table: any = this.$refs.singleTable
    if (e.keyCode == 40) {
      //下键
      // if (this.currentRowIndex == -1) {
      //   //当前没有选中行默认选中第一行
      //   this.currentRowIndex = 0
      // } else {
      if (this.currentRowIndex < this.resultOptions.length - 1) {
        //当前不是最后一行，选中下一行
        this.currentRowIndex++
      } else {
        this.currentRowIndex = 0 //当前是最后一行，选中第一行
      }
      // }
      if (table) {
        table.setCurrentRow(this.resultOptions[this.currentRowIndex])
      }
    }

    if (e.keyCode == 38) {
      //上键
      // if (this.currentRowIndex == -1) {
      //   //当前没有选中行默认选中最后一行
      //   this.currentRowIndex = this.resultOptions.length - 1
      // } else {
      if (this.currentRowIndex > 0) {
        //当前不是第一行，选中上一行
        this.currentRowIndex--
      } else {
        this.currentRowIndex = this.resultOptions.length - 1 //当前是第一行，选中最后一行
      }
      // }
      if (table) {
        table.setCurrentRow(this.resultOptions[this.currentRowIndex])
      }
    }

    if (e.keyCode == 37) {
      //左键
      if ((this.$refs.pageTable as any).page > 1) {
        ;(this.$refs.pageTable as any).page--
        this.$nextTick(() => {
          ;(this.$refs.pageTable as any).getList()
          // this.currentRowIndex = -1
          // table.setCurrentRow({})
        })
      }
    }
    if (e.keyCode == 39) {
      //右键
      if ((this.$refs.pageTable as any).page < (this.$refs.pageTable as any).total / (this.$refs.pageTable as any).pageSize) {
        ;(this.$refs.pageTable as any).page++
        this.$nextTick(() => {
          ;(this.$refs.pageTable as any).getList()
          // this.currentRowIndex = -1
          // table.setCurrentRow({})
        })
      }
    }
    if (e.keyCode == 13) {
      //回车
      if (this.currentRowIndex == -1) {
        console.log('还没选中值')
        return
      }
      this.selectResult(this.resultOptions[this.currentRowIndex])
    }
  }

  private clear() {
    this.$emit('input', '')
    this.$emit('clear')
  }

  private clearData() {
    this.data = ''
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-select-dropdown {
  display: none;
}
.w100 {
  width: 100%;
}
::v-deep .el-table td .cell {
  padding: 0 0 0 4px;
}
::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: rgba(15, 202, 173, 0.2) !important;
}
::v-deep .el-table__body tr.current-row > td {
  background: rgba(15, 202, 173, 0.2) !important;
}
::v-deep .el-input__inner {
  padding: 0 10px;
}
::v-deep .table-remote-search-select-zdm {
  td,
  tr {
    padding: 2px 0 !important;
    height: 28px !important;
  }
  th {
    .cell {
      padding: 0 0 0 4px;
    }
    padding: 0;
    height: 28px;
    line-height: 28px;
    color: #222b31 !important;
    border: 0;
    border-right: 1px solid #fff;
    background: rgba(240, 240, 238, 0.8);
    font-weight: 500;
    font-family: 'siyuanMedium';
    border-bottom: 1px solid #f0f0f0;
  }
}

.popover-table {
  height: 308px;
  overflow: hidden;
}
</style>

<style lang="scss">
// .table-remote-search-select-zdm td {
//   padding: 2px 0 !important;
//   height: 28px;
// }
.table-remote-search-popper-zdm {
  padding: 0 0 8px !important;
  margin: 0 !important;
}
</style>
