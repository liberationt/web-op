<template>
  <div>
    <div
      class="w100 ellipsis"
      :class="[ (!(gjrValue == value) ? 'red-point' : '')]"
      v-show="showBox"
      @click="show_input()"
    >{{ showLabel }}</div>
    <dict-search-select
      v-show="!showBox"
      :result-table-header="resultHeader"
      ref="dictSearch"
      :table-name="tableName"
      :query-filed="searchField"
      v-model="data"
      :popover-width="popoverWidth ? popoverWidth : 600"
      @getData="data => fillData(data)"
      :labelFiled="labelFiled"
      :valueFiled="valueFiled"
      @change="change()"
      @visibleChange="visibleChange()"
      @blur="blur"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { getTableData, dictExecuteSql } from '@/websql/functions'
@Component({
  name: 'selectBox',
  components: {}
})
export default class extends Vue {
  @Prop({ required: true, default: '' }) private tableName!: string //表名
  @Prop({ required: true, default: () => [] }) private resultHeader!: any[] //搜索结果的显示字段
  @Prop({ required: false, default: 0 }) private popoverWidth!: number //结果弹框的宽度
  @Prop({ required: true, default: '' }) private labelFiled!: string //显示的字段
  @Prop({ required: true, default: '' }) private valueFiled!: string //数据的字段
  @Prop({ required: true, default: '' }) private searchField!: string  //搜索的字段
  @Prop({ required: true, default: '' }) private value!: string
  @Prop({ required: false, default: false }) private disabled!: boolean
  @Prop({ required: false, default: false }) private required!: boolean
  private showBox: boolean = true
  private data: string = ''
  private isValidate: boolean = false
  private gjrValue: any = null
  private gjrString: string = ''

  created() {
    this.gjrValue = this.value
    this.data = this.value
  }

  get showLabel() {
    const that = this
    try {
      dictExecuteSql(
        `select ${this.labelFiled} from ${this.tableName}  WHERE ${this.valueFiled} = '${this.data}'`,
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
  @Watch('value')
  private onValueChange(val: any) {
    this.data = val
  }

  private show_input() {
    if (!this.disabled) {
      this.focus()
    }
  }

  private blur() {
    this.showBox = true
    this.$nextTick(() => {
      ; (this.$refs.dictSearch as any).blur()
    })
    this.$emit('blur')
    this.$emit('input', this.data)
  }

  private change(data: any) {
    this.$emit('input', this.data)
    this.$emit('change', this.data)
  }

  private fillData(data: any) {
    this.$emit('blur')
    this.$emit('getData', data)
  }

  private focus() {
    this.showBox = false
    this.$nextTick(() => {
      ; (this.$refs.dictSearch as any).isFocus()
    })
    this.$emit('focus')
  }

  private visibleChange() {
    setTimeout(() => {
      this.showBox = true
      if (this.required && !this.value) {
        this.isValidate = true
      } else {
        this.isValidate = false
      }
    }, 100)
  }
}
</script>

<style lang="scss" scoped>
.w100 {
  line-height: 32px;
  width: 100%;
  height: 100%;
}
.select {
  width: calc(100% - 2px);
  height: calc(100% - 2px);
}
::v-deep .ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
::v-deep .el-input__inner {
  height: 30px;
}
.red-point {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    width: 8px;
    height: 8px;
    background: $light-red;
    transform: rotateZ(45deg);
  }
}
.isValidate {
  border: $light-red 1px solid;
  border-radius: 4px;
}
</style>
