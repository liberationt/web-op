<template>
  <div>
    <div
      class="w100 ellipsis"
      :class="[ (!(gjrValue == value) ? 'red-point' : '')]"
      v-show="showBox"
      @click="show_input()"
    >{{ value }}</div>
    <el-input
      v-model="data"
      @blur="blur"
      @focus="focus"
      @input="input"
      @change="change"
      :type="type"
      :max="max"
      :min="min"
      ref="input"
      class="input"
      :maxlength="maxlength"
      v-show="!showBox"
    ></el-input>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
@Component({
  name: 'inputBox',
  components: {},
})
export default class extends Vue {
  @Prop({ required: true, default: '' }) private value!: any //绑定值
  @Prop({ required: false, default: 'text' }) private type!: any // 数值类型
  @Prop({ required: false }) private max!: any // 数值类型最大值
  @Prop({ required: false }) private min!: any // 数值类型最小值
  @Prop({ required: false, default: false }) private disabled!: boolean //是否点击变成操作框
  @Prop({ required: false, default: false }) private required!: boolean //是否必须必须输入
  @Prop({ required: false, default: Number.MAX_SAFE_INTEGER }) private maxlength!: number //最大输入长度
  // @Prop({ required: false, default: '' }) private reg!: any
  private showBox: boolean = true //是否显示输入框 false 显示输入框 true显示div
  private data: string = '' //组件内的data
  private isValidate: boolean = false //验证
  private gjrValue: string = ''

  created() {
    this.data = this.value
    this.gjrValue = this.value
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
      ; (this.$refs.input as any).blur()
      if (this.required && !this.value) {
        this.isValidate = true
      } else {
        this.isValidate = false
      }
    })
    this.$emit('input', this.data)
    this.$emit('blur', this.data)
  }
  private input(val: any) {
    this.$emit('input', val)
  }
  private change(val: any) {
    this.$emit('change', val)
  }

  private focus() {
    this.showBox = false
    this.$nextTick(() => {
      const inputJkje: any = this.$refs.input
      inputJkje.select()
      inputJkje.focus()
    })
    this.$emit('focus')
  }
}
</script>

<style lang="scss" scoped>
.w100 {
  line-height: 32px;
  width: 100%;
  height: 100%;
}
.input {
  width: calc(100% - 2px);
  height: calc(100% - 3px);
}
::v-deep .ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
::v-deep .el-input__inner {
  height: 30px;
}
.isValidate {
  border: $light-red 1px solid;
  border-radius: 4px;
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
</style>
