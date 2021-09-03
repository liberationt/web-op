<template>
  <div>
    <div v-popover:popover class="remote-select-select-box">
      <slot></slot>
    </div>
    <el-popover
      :visible-arrow="false"
      placement="bottom-start"
      :width="popoverWidth"
      trigger="manual"
      v-model="visible"
      ref="popover"
      popper-class="remote-search-popper-zdm"
    >
      <div class="popover-box" @click="clickPopover">
        <pagenation-list
          ref="pageTable"
          v-model="resultOptions"
          :data-url="searchUrl"
          :data-num="dataType"
          http-method="post"
          :list-height="400"
          :searchData="searchData"
          :key="listKey"
          :pageProps="{ layout: 'total, prev, pager, next',pagerCount:5 }"
        >
          <div slot="list" class="scroll-bar remote-search-select-zdm">
            <div @click.stop>
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
                v-if="visible"
                height="308"
                class="popover-table"
              >
                <el-table-column type="index" v-if="this.isIndex" width="32" align="center"></el-table-column>
                <el-table-column
                  v-for="result in resultTableHeader"
                  :key="result.prop"
                  :prop="result.prop"
                  :label="result.label"
                  :show-overflow-tooltip="true"
                  :width="result.width"
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
  @Prop({ required: true, default: '' }) private value!: any //回显的数据
  // @Prop({ required: false, default: '' }) private backfillValue!: string //回显的数据
  @Prop({ required: true, default: '' }) private searchUrl!: string //远程搜索的api
  //搜索返回的结果列表表头 exp:[{label:xxx,value: xxx}]
  @Prop({ required: true, default: () => [] }) private resultTableHeader!: Array<any>
  @Prop({ required: true, default: '' }) private searchField!: string //搜索用到的编辑的字段
  @Prop({ required: true, default: () => {} }) private searchData!: any //搜索用到的固定的字段
  @Prop({ required: false, default: 600 }) private popoverWidth!: number //弹出框的宽度
  @Prop({ required: false, default: false }) private disabled!: boolean //是否禁用
  @Prop({ required: false, default: '' }) private placeholder!: string //占位符
  @Prop({ required: true, default: '' }) private showLabel!: string //显示哪个字段
  @Prop({ required: false, default: 0 }) private dataType!: number // 判断类型
  @Prop({ required: false, default: true }) private isIndex!: boolean // 是否需要序号
  // private searchData: any = {} //搜索传入分页组件的搜索
  private resultOptions: Array<any> = []
  // private value: string = ''
  private visible: boolean = false
  private listKey: number = 0
  private isClickPopover: boolean = false

  created() {
    // this.value = this.backfillValue
  }

  mounted() {}

  private selectFocus() {
    // this.$emit('focus')
  }

  private remoteMethod(query: string) {
    //远程搜索方法
    this.$nextTick(() => {
      this.searchData[`${this.searchField}`] = query
      ;(this.$refs.pageTable as any).searchList()
      this.showPopover()
    })
  }
  private selectResult(row: any) {
    //点击选择搜索的结果，将这一行数据返回给父组件
    // this.value = row[`${this.showLabel}`]
    this.$emit('input', row[`${this.showLabel}`])
    this.$emit('change', row)
    this.$emit('getData', row)
    this.visible = false
    // console.log(row)
  }
  private showPopover() {
    this.visible = true
    addEventListener('keyup', this.keyUp)
  }
  private closePopover() {
    this.visible = false
    this.currentRowIndex = -1
    removeEventListener('keyup', this.keyUp)
  }
  private clickPopover() {
    //点击弹出框，弹出框不消失
    this.isClickPopover = true
    this.visible = true
    const select: any = this.$refs.select
    select.focus()
    setTimeout(() => {
      this.isClickPopover = false
    }, 100)
  }
  private selectBlur() {
    //选择框失去焦点时弹出框消失
    setTimeout(() => {
      if (!this.isClickPopover) {
        this.closePopover()
        this.$emit('visibleChange')
      }
    }, 100)
  }
  private isFocus() {
    // setTimeout(() => {
    //   ; (this.$refs.select as any).focus()
    // }, 50)
  }

  private blur() {
    setTimeout(() => {
      ;(this.$refs.select as any).blur()
      this.visible = false
      this.currentRowIndex = -1
      this.$emit('visibleChange')
      removeEventListener('keyup', this.keyUp)
    }, 50)
  }

  private currentRowIndex: number = -1
  private currentRowValue: any = {}

  private keyUp(e: any) {
    if (this.resultOptions.length == 0) return
    let table: any = this.$refs.singleTable

    if (e.keyCode == 40) {
      //下键
      if (this.currentRowIndex == -1) {
        //当前没有选中行默认选中第一行
        this.currentRowIndex = 0
      } else {
        if (this.currentRowIndex < this.resultOptions.length - 1) {
          //当前不是最后一行，选中下一行
          this.currentRowIndex++
        } else {
          this.currentRowIndex = 0 //当前是最后一行，选中第一行
        }
      }
      if (table) {
        table.setCurrentRow(this.resultOptions[this.currentRowIndex])
      }
    }

    if (e.keyCode == 38) {
      //上键
      if (this.currentRowIndex == -1) {
        //当前没有选中行默认选中最后一行
        this.currentRowIndex = this.resultOptions.length - 1
      } else {
        if (this.currentRowIndex > 0) {
          //当前不是第一行，选中上一行
          this.currentRowIndex--
        } else {
          this.currentRowIndex = this.resultOptions.length - 1 //当前是第一行，选中最后一行
        }
      }
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
          this.currentRowIndex = -1
          table.setCurrentRow({})
        })
      }
    }
    if (e.keyCode == 39) {
      //右键
      if ((this.$refs.pageTable as any).page < (this.$refs.pageTable as any).total / (this.$refs.pageTable as any).pageSize) {
        ;(this.$refs.pageTable as any).page++
        this.$nextTick(() => {
          ;(this.$refs.pageTable as any).getList()
          this.currentRowIndex = -1
          table.setCurrentRow({})
        })
      }
    }

    if (e.keyCode == 13) {
      //回车
      if (this.currentRowIndex == -1) {
        console.log('还没选中值')
        return
      }
      // console.log(this.resultOptions[this.currentRowIndex])
      this.selectResult(this.resultOptions[this.currentRowIndex])
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-select-dropdown {
  display: none;
}
::v-deep .el-select .el-input__inner {
  width: 100%;
  height: 32px;
}

.remote-select-select-box {
  width: auto;
  display: inline-block;
}

::v-deep .el-table td .cell {
  padding: 0 0 0 4px;
  color: #424242;
}
::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: rgba(15, 202, 173, 0.2) !important;
}
::v-deep .el-table__body tr.current-row > td {
  background: rgba(15, 202, 173, 0.2) !important;
}
::v-deep .remote-search-select-zdm {
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
.remote-search-popper-zdm {
  margin: 0 !important;
  padding: 0 0 8px !important;
}
</style>
