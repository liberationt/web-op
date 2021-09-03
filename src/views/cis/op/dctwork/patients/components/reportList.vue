<!--
 * @Date: 2020-05-21 17:57:16
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-15 10:11:00
 * @description: 患者列表-辅助报告-报告列表不分页
-->

<template>
  <div class="module his-patient-report">
    <div class="label">
      <div class="btn-child">
        <div class="middle-btn">
          <span v-for="(item, index) in btnReports" :key="index" :class="{ 'actived-btn': btnChildIndex == index }" @click="changeBtn(index)">{{ item.name }}</span>
        </div>
      </div>
    </div>

    <div class="content mt10 ht">
      <div v-if="btnChildIndex == 1" class="ht">
        <inspect-report v-if="btnChildIndex == 1" :pnParam="pnParam" />
      </div>
      <div v-if="btnChildIndex == 0" class="ht">
        <image-report v-if="btnChildIndex == 0" :pnParam="pnParam" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import imageReport from './model/imageReport.vue'
import imageWatch from './model/imageWatch.vue'
import ecgReport from './model/ecgReport.vue'
import inspectReport from './model/inspectReport.vue'
import endoscopyReport from './model/endoscopyReport.vue'
import { findList } from '@/api/cis/op/dctwork/reportList.ts'
import { getTableData } from '@/websql/functions'
//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'ReportList',
  components: {
    imageReport,
    imageWatch,
    ecgReport,
    inspectReport,
    endoscopyReport,
  },
})
export default class extends Vue {
  @Prop({ required: false, default: 0 }) private jumpTo!: number
  @Prop({ required: false }) private pnParam!: any
  private comHeight: number = 0
  private btnReports: any[] = [
    // {
    //   id: 1,
    //   name: this.$t('patients.jybg'),
    // },
    // {
    //   id: 2,
    //   name: this.$t('patients.jcbg'),
    // },
  ]
  private btnChildIndex: number = 0
  private specificSymbols: any[] = []
  private activeName: string = 'all'
  private symbolLoading = false

  created() {
    this.comHeight = Vue.prototype.PageHeight - 178

    // this.btnReports = [
    //   {
    //     id: 1,
    //     name: this.$t('patients.jybg')
    //   },
    //   {
    //     id: 2,
    //     name: this.$t('patients.jcbg')
    //   },
    // {
    //   id: 3,
    //   name: this.$t('patients.xdtbg')
    // },
    // {
    //   id: 4,
    //   name: '影像报告'
    // },
    // {
    //   id: 5,
    //   name: '内镜检查报告'
    // },
    // {
    //   id: 3,
    //   name: this.$t('patients.tsfh')
    // }
    // {
    //   id: 7,
    //   name: this.$t('patients.cyzd'),
    // },
    // ]
    this.btnChildIndex = 0
    // this.symbolLoading = true
    // findList({}).then((res: any) => {
    //   this.specificSymbols = res.data
    //   this.symbolLoading = false
    // }).catch(() => {
    //   this.symbolLoading = false
    // })
  }

  mounted() {
    this.btnReports = [
      {
        id: 1,
        name: this.$t('patients.jcbg'),
      },
      {
        id: 0,
        name: this.$t('patients.jybg'),
      },
    ]
    const store: any = this.$store
    this.getDictNewData(store)
  }

  private getDictNewData(store: any) {
    // 检查状态字典
    getTableData('SYS_PRIMARY_DATA', 'PD0000000737', `SELECT * FROM SYS_PRIMARY_DATA_VALUE WHERE dk='PD0000000737'`, function (data: any) {
      store.commit('SET_STATUS_DICT', data)
    })
    //  检验检查状态字典
    getTableData('SYS_PRIMARY_DATA', 'PD0000000738', `SELECT * FROM SYS_PRIMARY_DATA_VALUE WHERE dk='PD0000000738'`, function (data: any) {
      store.commit('SET_STATE_DICT', data)
    })
  }

  private handleRowClick() {}

  // 切换心电图报告
  private changeBtn(value: number) {
    this.btnChildIndex = value
  }

  //双击特殊符号
  // private selectSymbol(symbol: string) {
  //   this.$emit('getSymbol', symbol)
  // }

  // private toSpecificSymbol() {
  //   this.btnChildIndex = 0
  // }

  // private handleClick(item: any) {
  //   switch (item.name) {
  //     case 'all':
  //       this.getSymbolList('')
  //       break
  //     case 'bd':
  //       this.getSymbolList('标点符号')
  //       break
  //     case 'dw':
  //       this.getSymbolList('单位符号')
  //       break
  //     case 'sx':
  //       this.getSymbolList('数学符号')
  //       break
  //     case 'sz':
  //       this.getSymbolList('数字序号')
  //       break
  //     case 'ts':
  //       this.getSymbolList('特殊符号')
  //       break
  //     case 'zdy':
  //       this.getSymbolList('自定义')
  //       break
  //     case 'qt':
  //       this.getSymbolList('其他')
  //       break
  //   }
  // }

  // private getSymbolList(value: string) {
  //   this.symbolLoading = true
  //   findList({ xmmc: value }).then((res: any) => {
  //     this.specificSymbols = res.data
  //     this.symbolLoading = false
  //   }).catch(() => {
  //     this.symbolLoading = false
  //   })
  // }
}
</script>

<style lang="scss" scoped>
.label {
  background: #ffffff;
  border-radius: 8px;
}

.right-list his-module {
  margin-right: 0px;
}

.content .his-module ::v-deep .el-table--border th {
  height: 28px;
  line-height: 28px;
}

.content .his-module .el-table::before,
.content .his-module .el-table--group::after,
.content .his-module .el-table--border::after {
  display: none !important;
}

.content {
  padding: 0px;
}

.his-module,
.his-small {
  height: auto !important;
}

.his-patient-report {
  .btn-child {
    display: flex;
    flex-flow: row nowrap;
    border-bottom: 1px solid #f0f0f0;
    padding: 0 0 0 16px;

    .middle-btn {
      display: flex;
      flex-flow: row nowrap;

      span {
        margin-right: 24px;
        margin-top: 16px;

        &.actived-btn {
          color: #1485ff;
          border-bottom: 2px solid #1485ff;
          padding-bottom: 8px;
        }
      }
    }
  }

  .choose-style {
    display: flex;
    flex-flow: row nowrap;
    padding-left: 16px;

    .middle-btn {
      display: flex;
      flex-flow: row nowrap;
      padding: 10px 0;

      span {
        margin-right: 10px;

        &.actived-btn {
          color: #1485ff;
          border-bottom: 2px solid #1485ff;
          padding-bottom: 10px;
        }
      }
    }
  }

  .two-list {
    display: flex;
    flex-flow: row nowrap;
    margin-top: 10px;
    width: 100%;

    .left-list,
    .right-list {
      background: #fff;
      border-radius: 8px;
      width: calc(50% - 5px);
    }
  }
}

.symbol-flex-box {
  display: grid;
  // justify-content: start;
  // flex-wrap: wrap;
  padding: 2px 8px;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 22px;
  // align-self: start;
  // align-items: start;
  .symbol-box {
    width: 100%;
    height: 22px;
    text-align: center;
    border: 1px #6a6d78 solid;
    padding: 4px 0 0 0;
    margin: -1px;
    font-size: 10px;

    &:hover {
      color: #1485ff;
      cursor: pointer;
    }
  }
}

::v-deep .symbol-tab .el-tabs__header {
  margin-bottom: 0px !important;
}
</style>
