<template>
  <div class="dict-search-select-zdm dictSearchSelect">
    <el-select
      ref="select"
      v-popover:popover
      v-model="label"
      filterable
      remote
      @blur="selectBlur"
      reserve-keyword
      :remote-method="
        query => {
          remoteMethod(query)
        }
      "
      :popper-append-to-body="false"
      :clearable="true"
      :disabled="disabled"
      :placeholder="placeholder"
      @clear="clear"
    >
      <div slot="empty"></div>
    </el-select>
    <el-popover
      placement="bottom-start"
      :visible-arrow="false"
      :width="popoverWidth"
      trigger="manual"
      v-model="visible"
      ref="popover"
      popper-class="dict-search-popper-zdm"
      @after-leave="popoverHide"
    >
      <div @click="clickPopover" class="popover-box">
        <div @click.stop class="dict-search-popper-zdm">
          <el-table
            :data="data"
            :fit="true"
            :highlight-current-row="true"
            @row-click="
              row => {
                selectResult(row)
              }
            "
            ref="singleTable"
            height="280"
            class="no-underline scroll-bar"
            style="height: 309px;"
            v-if="visible"
            :key="pager"
          >
            <el-table-column type="index" width="40" align="center"></el-table-column>
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

        <div class="page-footer">
          <el-pagination
            small
            @current-change="handleCurrentChange"
            :current-page="pager"
            layout="total, prev,pager, next"
            :total="total"
            :pager-count="5"
            background
          ></el-pagination>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { getTableData, dictExecuteSql } from '@/websql/functions'
@Component({
  name: 'dictSearchSelect',
  components: {},
})
export default class extends Vue {
  @Prop({ required: true, default: '' }) private value!: string //结果表头
  @Prop({ required: true, default: [] }) private resultTableHeader!: Array<any> //结果表头
  @Prop({ required: false, default: 'GY_JBBM' }) private tableName!: String //表名
  @Prop({ required: false, default: 'PYDM' }) private queryFiled!: String //匹配的字段
  @Prop({ required: false, default: 600 }) private popoverWidth!: number //弹出框的宽度
  @Prop({ required: false, default: false }) private disabled!: boolean //是否禁用
  @Prop({ required: false, default: '' }) private placeholder!: string //占位符
  @Prop({ required: true, default: '' }) private labelFiled!: string //显示的字段
  @Prop({ required: false, default: '' }) private backFillValue!: string //回显的字符串
  @Prop({ required: true, default: '' }) private valueFiled!: string //数据的字段

  private total: number = 0 //数据总数
  private pager: number = 1 //页码

  // private value: string = ''
  // private label:string = ''
  private gjrString: string = ''
  private visible: boolean = false //是否显示弹出框
  private listKey: number = 0
  private isClickPopover: boolean = false //判断是否隐藏弹出框的变量
  private data: any[] = [] //搜索结果的数据
  private queryData: string = '' //用来匹配的数据

  mounted() {
    this.createArrow()
  }

  get label() {
    const that = this
    try {
      dictExecuteSql(
        `select ${this.labelFiled} from ${this.tableName}  WHERE ${this.valueFiled} = '${this.value}'`,
        function (tx: any, result: any) {
          if (result.rows.length > 0) {
            that.gjrString = result.rows[0][`${that.labelFiled}`]
          } else {
            that.gjrString = ''
          }
        },
        function (tx: any, error: any) {
          console.log('查询失败:' + error.message)
        }
      )
      let label = this.gjrString
      if (!!label) {
        return label
      } else {
        return ''
      }
    } catch {
      return ''
    }
  }

  // 查询表中匹配的数据的总数
  private async dataTotal() {
    const that = this
    await dictExecuteSql(
      `select count(*) from ${this.tableName} WHERE ${this.queryFiled} LIKE '%${this.queryData}%' OR PYDM LIKE '%${this.queryData}%'`,
      function (tx: any, result: any) {
        that.total = result.rows[0]['count(*)']
      },
      function (tx: any, error: any) {
        console.log('查询失败:' + error.message)
      }
    )
  }
  //查询表中匹配的数据
  private async getData() {
    const that = this
    await dictExecuteSql(
      `select * from ${this.tableName} WHERE ${this.queryFiled} LIKE '%${this.queryData}%' OR PYDM LIKE '%${this.queryData}%'  order by LENGTH(PYDM)  limit 10 offset ${(this.pager - 1) * 10}`,
      function (tx: any, result: any) {
        that.data = []
        for (let i = 0; i < result.rows.length; i++) {
          let data: any = { ...result.rows[i], sortNum: (that.pager - 1) * 10 + i + 1 }
          that.data = [...that.data, data]
        }
        that.visible = true
        addEventListener('keyup', that.keyUp)
        that.$nextTick(() => {
          that.currentRowIndex = 0
          let table: any = that.$refs.singleTable
          if (that.data) {
            table.setCurrentRow(that.data[that.currentRowIndex])
          }
        })
      },
      function (tx: any, error: any) {
        console.log('查询失败:' + error.message)
      }
    )
  }

  // 查询表的总数
  private async dataAllTotal() {
    const that = this
    await dictExecuteSql(
      `select count(*) from ${this.tableName}`,
      function (tx: any, result: any) {
        that.total = result.rows[0]['count(*)']
      },
      function (tx: any, error: any) {
        console.log('查询失败:' + error.message)
      }
    )
  }
  //获取全部的疾病
  private getAllData() {
    const that = this
    dictExecuteSql(
      `select * from ${this.tableName}  order by LENGTH(PYDM) limit 10 offset ${(this.pager - 1) * 10}`,
      function (tx: any, result: any) {
        that.data = []
        for (let i = 0; i < result.rows.length; i++) {
          let data: any = { ...result.rows[i], sortNum: (that.pager - 1) * 10 + i + 1 }
          that.data = [...that.data, data]
        }
        that.visible = true
        addEventListener('keyup', that.keyUp)
        that.$nextTick(() => {
          that.currentRowIndex = 0
          let table: any = that.$refs.singleTable
          if (that.data) {
            table.setCurrentRow(that.data[that.currentRowIndex])
          }
        })
      },
      function (tx: any, error: any) {
        console.log('查询失败:' + error.message)
      }
    )
  }
  //改变页码
  private handleCurrentChange(val: number) {
    this.pager = val
    if (this.queryData == '__' || this.queryData == '**') {
      this.getAllData()
    } else {
      this.getData()
    }
  }
  //搜索方法
  private async remoteMethod(query: string) {
    if (query.length == 2 && query == '__') {
      this.queryData = query
      await this.dataAllTotal()
      this.getAllData()
    } else if (query.length > 0 && query != '_') {
      this.queryData = query
      this.getData()
      this.dataTotal()
      // this.visible = true
      // addEventListener('keyup', this.keyUp)
      // this.$nextTick(() => {
      //   this.currentRowIndex = 0
      //   let table: any = this.$refs.singleTable
      //   table.setCurrentRow(this.data[this.currentRowIndex])
      // })
    } else {
      this.visible = false
      removeEventListener('keyup', this.keyUp)
    }
  }

  private selectBlur() {
    //选择框失去焦点时弹出框消失
    setTimeout(() => {
      if (!this.isClickPopover) {
        this.visible = false
        this.currentRowIndex = 0
        removeEventListener('keyup', this.keyUp)
        this.$emit('visibleChange')
        this.$emit('blur')
      }
    }, 100)
  }

  private clickPopover() {
    //点击弹出框，弹出框不消失
    this.isClickPopover = true
    this.visible = true
    addEventListener('keyup', this.keyUp)
    this.$nextTick(() => {
      this.currentRowIndex = 0
      let table: any = this.$refs.singleTable
      table.setCurrentRow(this.data[this.currentRowIndex])
    })
    const select: any = this.$refs.select
    select.focus()
    setTimeout(() => {
      this.isClickPopover = false
    }, 100)
  }

  private isFocus() {
    setTimeout(() => {
      ;(this.$refs.select as any).focus()
    }, 50)
  }

  private blur() {
    setTimeout(() => {
      ;(this.$refs.select as any).blur()
      this.visible = false
      this.currentRowIndex = 0
      removeEventListener('keyup', this.keyUp)
      this.$emit('visibleChange')
    }, 50)
  }

  private selectResult(row: any) {
    // this.value = row[`${this.showValue}`]
    this.$emit('input', row[`${this.valueFiled}`])
    this.$emit('change', row)
    this.$emit('getData', row)
    this.visible = false
  }

  private popoverHide() {
    this.pager = 1
    this.queryData = ''
    this.total = 0
  }

  private currentRowIndex: number = 0
  private currentRowValue: any = {}

  private keyUp(e: any) {
    if (this.data.length == 0) return
    let table: any = this.$refs.singleTable
    // table.setCurrentRow(this.data[this.currentRowIndex])

    if (e.keyCode == 40) {
      //下键
      // if (this.currentRowIndex == -1) {
      //   //当前没有选中行默认选中第一行
      //   this.currentRowIndex = 0
      // } else {
      if (this.currentRowIndex < this.data.length - 1) {
        //当前不是最后一行，选中下一行
        this.currentRowIndex++
      } else {
        this.currentRowIndex = 0 //当前是最后一行，选中第一行
      }
      // }
      if (table) {
        table.setCurrentRow(this.data[this.currentRowIndex])
      }
    }

    if (e.keyCode == 38) {
      //上键
      // if (this.currentRowIndex == -1) {
      //   //当前没有选中行默认选中最后一行
      //   this.currentRowIndex = this.data.length - 1
      // } else {
      if (this.currentRowIndex > 0) {
        //当前不是第一行，选中上一行
        this.currentRowIndex--
      } else {
        this.currentRowIndex = this.data.length - 1 //当前是第一行，选中最后一行
      }
      // }
      if (table) {
        table.setCurrentRow(this.data[this.currentRowIndex])
      }
    }

    if (e.keyCode == 37) {
      //左键
      if (this.pager > 1) {
        this.pager--
        this.$nextTick(() => {
          this.handleCurrentChange(this.pager)
          this.currentRowIndex = 0
          table.setCurrentRow(this.data[this.currentRowIndex])
        })
      }
    }
    if (e.keyCode == 39) {
      //右键
      if (this.pager < this.total / 10) {
        this.pager++
        this.$nextTick(() => {
          this.handleCurrentChange(this.pager)
          this.currentRowIndex = 0
          table.setCurrentRow(this.data[this.currentRowIndex])
        })
      }
    }

    if (e.keyCode == 13) {
      //回车
      if (this.currentRowIndex == -1) {
        console.log('还没选中值')
        return
      }
      this.selectResult(this.data[this.currentRowIndex])
    }
  }
  //添加箭头
  private createArrow() {
    var select: any = this.$refs.select
    var icon = select.$el.getElementsByClassName('el-select__caret')[0]
    icon.classList.add('el-icon-arrow-up')
  }

  private clear() {
    this.$emit('input', '')
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-select-dropdown {
  display: none;
}

.page-footer {
  text-align: right;
  padding: 4px 0;
}
::v-deep .el-table .td .cell {
  padding: 0 0 0 4px;
}

::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: rgba(15, 202, 173, 0.2) !important;
}
::v-deep .el-table__body tr.current-row > td {
  background: rgba(15, 202, 173, 0.2) !important;
}
::v-deep .dict-search-popper-zdm {
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
</style>

<style lang="scss">
.dict-search-popper-zdm {
  margin: 0 !important;
  padding: 0px !important;
}
.dict-search-popper-zdm {
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .el-pager li {
    background: none !important;
    margin: 0;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #1890ff !important;
  }
}
</style>
