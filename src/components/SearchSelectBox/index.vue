<template>
  <div>
    <div
      class="w100 ellipsis"
      v-show="showBox"
      :class="[ (!disabled ? 'red-point' : ''),{'isValidate' : isValidate,className: true}]"
      @click="show_input()"
    >{{label}}</div>
    <search-select
      v-model="data"
      @focus="focus"
      @blur="blur"
      :tableName="tableName"
      :kid="kid"
      :backfillValue="value"
      ref="searchselect"
      class="searchselect"
      v-show="!showBox"
      @visible-change="visible => visibleChange(visible)"
      @change="data => change(data)"
      :automatic-dropdown="true"
      :clearable="clearable"
      :disabled="disabled"
    ></search-select>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
@Component({
  name: 'selectBox',
  components: {}
})
export default class extends Vue {
  @Prop({ required: true, default: '' }) private value!: any
  @Prop({ required: false, default: false }) private disabled!: boolean
  @Prop({ required: true, default: '' }) private tableName!: string  //select的选项
  @Prop({ required: true, default: '' }) private kid!: string  //select的选项
  @Prop({ required: false, default: () => [] }) private extraData!: Array<any> //option的label
  @Prop({ required: false, default: true }) private clearable!: boolean //option的value
  // @Prop({ required: false }) private backfillValue!: string | number // 回填值(有回显需求时传)
  @Prop({ required: false, default: false }) private required!: boolean
  private showBox: boolean = true
  private data: any = ''
  private isValidate: boolean = false
  private label: string = ''

  created() {
    this.data = this.value
  }
  mounted() {
    // console.log((this.$refs.searchselect as any).options)
    this.label = (this.$refs.searchselect as any).options.find((item: any) => item.dv == this.data) && (this.$refs.searchselect as any).options.find((item: any) => item.dv == this.data).dn
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
    // this.$nextTick(() => {
    //   ; (this.$refs.select as any).blur()
    // })
    // if (this.required && !this.value) {
    //   this.isValidate = true
    // } else {
    //   this.isValidate = false
    // }
    this.$emit('blur')
    this.$emit('input', this.data)
  }

  private async change(data: any) {
    this.$emit('input', this.data)
    this.$emit('change', this.data)
    const allData: any = await (this.$refs.searchselect as any).options.find((item: any) => {
      return item.dv == this.data
    })
    if (allData) {
      this.$emit('getAllData', allData)
      this.label = allData.dn
    }
  }

  private focus() {
    this.showBox = false;
    this.$nextTick(() => {
      (this.$refs.searchselect as any).onFocus()
    })

    this.$emit('focus')

  }

  private visibleChange(visible: boolean) {
    if (!visible) {
      this.showBox = true
      if (this.required && !this.value) {
        this.isValidate = true
      } else {
        this.isValidate = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.w100 {
  line-height: 32px;
  width: 100%;
  height: 100%;
}
.searchselect {
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
    background: #f00;
    transform: rotateZ(45deg);
  }
}
.isValidate {
  border: #f00 1px solid;
  border-radius: 4px;
}
</style>
