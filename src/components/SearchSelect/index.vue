<template>
  <!--
        可搜索拼音码的标识数据/字典下拉
  -->
  <div class="search-select">
    <el-select
      v-model="currId"
      v-bind="$attrs"
      v-on="$listeners"
      :filterable="filterable"
      :clearable="clearable"
      remote
      :remote-method="remoteMethod"
      @change="valueChange"
      :loading="loading"
      @clear="onClear"
      ref="searchSelect"
      class="w100"
      @visible-change="visibleChange"
      :automatic-dropdown="automaticDropdown"
      @focus="focus"
      popper-class="optionclass"
    >
      <el-option v-for="(item,index) in options" :value="item.dv+''" :label="item.dn" :key="index"></el-option>
    </el-select>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { customPageReq } from '@/api/his/basic/index.ts'
import { findKeys, deepCopy } from '@/utils'
import { getTableData } from '@/websql/functions'

@Component({
  name: 'search-select',
})
export default class extends Vue {
  @Prop({ required: true }) private tableName!: string // 表类型
  @Prop({ required: true }) private kid!: string | number // 主键id
  @Prop({ required: false, default: () => [] }) private extraData!: Array<any> // 非字典内的选项
  @Prop({ required: false, default: () => true }) private clearable!: boolean // 是否可清空
  @Prop({ required: false }) private backfillValue!: string | number // 回填值(有回显需求时传)
  @Prop({ required: false }) private longDataFlag!: boolean // 超多数据标记 (暂未开发)
  @Prop({ required: false, default: false }) private automaticDropdown!: boolean // 是否获取焦点自动出现下拉选择框
  @Prop({ required: false, default: true }) private filterable!: boolean // 是否获取焦点自动出现下拉选择框

  private currId: any = ''
  private sqlStr: any = '' // 组装SQL
  private options: Array<any> = []
  private dataList: Array<any> = []
  private loading: boolean = false
  private tableTypeList: any = {
    //  表类型tableName 的值域
    SYS_PRIMARY_DATA: 'SYS_PRIMARY_DATA_VALUE', // 标识数据 （待完善）
    SYS_FLAG_DATA: 'SYS_FLAG_DATA_VALUE', // 标识字典
    SYS_DICT_CONFIG: 'SYS_DICT_CONFIG_VALUE', // 业务字典
  }

  // @Watch('currId')
  // private onCurrIdChange(value:any){
  //     console.log('onCurrIdChange',value)
  //     this.$emit('input', value == undefined ? '' : value)
  // }
  @Watch('backfillValue')
  private backfillValueChange(value: any) {
    this.options = deepCopy([...this.extraData, ...this.dataList])
    this.handelData()
    if (value == ('' || undefined)) this.currId = '' //  不知道会不会产生影响 。。。
    if (value == undefined) return
    this.$nextTick(() => {
      this.currId = value + ''
    })
  }

  async created() {
    await this.init()
    // this.$emit()
  }

  mounted() {
    this.createArrow()
  }
  // 初始化参数
  private init() {
    this.sqlStr = 'select * from ' + this.tableTypeList[this.tableName] + " where dk='" + this.kid + "' and stop != 1"
    const _that = this // 切换this指向
    _that.options = []
    _that.dataList = []
    getTableData(this.tableName, this.kid, this.sqlStr, function (data: any) {
      _that.options = [..._that.extraData, ...data]
      _that.handelData()
      _that.dataList = data
      if (_that.backfillValue != '') {
        _that.$nextTick(() => {
          if (_that.backfillValue != ('' || undefined || null)) _that.currId = _that.backfillValue + ''
          if (_that.kid == 25) console.log(data)
          if (_that.kid == 25) console.log(_that.currId)
        })
      }
    })
  }
  //设置最大长度的限制50条信息
  private handelData(){
    if(this.options&&this.options.length>100){
      this.options = this.options.slice(0,100)
    }
  }
  // 远程搜索
  private remoteMethod(query: string) {
    if (query !== '') {
      this.loading = true
      this.options = []
      setTimeout(() => {
        this.options = findKeys(query.toUpperCase(), this.dataList, ['dn', 'wb', 'py'])
        this.handelData()
        this.loading = false
      }, 200)
    } else {
      this.options = deepCopy([...this.extraData, ...this.dataList])
      this.handelData()
    }
  }

  // 选项改变
  private valueChange(value: any) {
    // 组件继承机制将v-mod也继承了完全不用抛出
    // console.log('valueChange',value)
    // this.$emit('input', value == undefined ? '' : value)
  }

  // 选项改变
  private onClear(query: any) {
    this.currId = ''
    this.options = deepCopy([...this.extraData, ...this.dataList])
  }

  // 获取焦点
  private onFocus() {
    const searchSelect: any = this.$refs.searchSelect
    searchSelect.focus()
  }

  private focus() {
    this.$nextTick(() => {
      (this.$refs.searchSelect as any).focus()
      this.init()
    })
    // this.$emit('focus')
  }
  private blur() {
    ;(this.$refs.searchSelect as any).blur()
    // this.$emit('blur')
  }

  // 下拉箭头
  private createArrow() {
    var searchSelect: any = this.$refs.searchSelect
    var icon = searchSelect.$el.getElementsByClassName('el-select__caret')[0]
    icon.classList.add('el-icon-arrow-up')
  }

  private visibleChange(isVisible: boolean) {
    this.$emit('visibleChange', isVisible)
  }
}
</script>

<style scoped lang="scss">
.search-select {
  display: inline-block;
  ::v-deep .is-focus {
    .el-icon-arrow-up {
      transform: rotate(0);
    }
  }
}
.w100 {
  width: 100%;
}
::v-deep .el-input__inner {
  padding: 0 10px !important;
}
</style>
