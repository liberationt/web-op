<template>
  <div>
    <div
      class="w100 ellipsis"
      v-show="showBox"
      :class="[ (!(gjrValue == value) ? 'red-point' : '')]"
      @click="show_input()"
    >{{value}}</div>
    <!-- <remote-search-select
      v-show="!showBox"
      ref="remoteSearch"
      :search-url="url"
      :resultTableHeader="resultHeader"
      :searchData="searchData"
      :popover-width="popoverWidth ? popoverWidth : 600"
      v-model="value"
      :showLabel="labelFiled"
      :searchField="searchField"
      @getData="data => fillData(data)"
      @change="change()"
      @visibleChange="visibleChange()"
    >
    </remote-search-select>-->
    <remoteSearchSelectNew
      v-show="!showBox"
      ref="remoteSearch"
      v-model="data"
      v-bind="$attrs"
      @getData="fillData"
      @change="change()"
      @visibleChange="visibleChange()"
      class="w100"
      @clear="clear"
    ></remoteSearchSelectNew>
    <!-- {{$attrs}} -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
@Component({
  name: 'selectBox',
  components: {},
})
export default class extends Vue {
  // @Prop({ required: true, default: '' }) private url!: string //远程搜索的地址
  // @Prop({ required: true, default: () => [] }) private resultHeader!: any[]  //搜索结果的显示字段
  // @Prop({ required: true, default: () => { } }) private searchData!: any //搜索的固定字段
  // @Prop({ required: false, default: 0 }) private popoverWidth!: number  //结果弹框的宽度
  // @Prop({ required: true, default: '' }) private labelFiled!: string //显示的字段
  // @Prop({ required: true, default: '' }) private searchField!: string //查询的字段
  @Prop({ required: true, default: '' }) private value!: any
  @Prop({ required: false, default: false }) private disabled!: boolean
  @Prop({ required: false, default: false }) private required!: boolean
  private isValidate: boolean = false
  private showBox: boolean = true
  private gjrValue: any = null
  private data: string = ''

  @Watch('value')
  private onValueChange(val: any) {
    this.data = val
  }

  @Watch('data')
  private ondataChange(val: any) {
    this.$emit('input', val)
  }
  created() {
    this.gjrValue = this.value
    this.data = this.value
  }

  private show_input() {
    if (!this.disabled) {
      this.focus()
    }
  }

  clear() {
    this.$emit('clear')
  }

  private blur() {
    this.showBox = true
    this.$nextTick(() => {
      ;(this.$refs.remoteSearch as any).blur()
    })
    // if (this.required && !this.value) {
    //   this.isValidate = true
    // } else {
    //   this.isValidate = false
    // }
    this.$emit('blur')
    // this.$emit('input', this.value)
  }

  private change(data: any) {
    // this.$emit('input', this.data)
    this.$emit('change', this.data)
  }

  private fillData(data: any, flag: any) {
    this.$emit('getData', data, flag)
  }

  private focus() {
    this.showBox = false
    this.$nextTick(() => {
      ;(this.$refs.remoteSearch as any).focus()
    })
    this.$emit('focus')
  }

  private visibleChange() {
    setTimeout(() => {
      this.showBox = true
      // if (this.required && !this.value) {
      //   this.isValidate = true
      // } else {
      //   this.isValidate = false
      // }
    }, 100)
  }
  private clearData() {
    this.data = ''
    ;(this.$refs.remoteSearch as any).clearData()
  }
}
</script>

<style lang="scss" scoped>
.w100 {
  line-height: 32px;
  width: 100%;
  height: 100%;
}
.el-select {
  width: calc(100% - 2px);
  height: 32px;
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
