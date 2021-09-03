<template>
  <div>
    <div
      class="w100 ellipsis"
      :class="[ (!(gjrValue == value) ? 'red-point' : '')]"
      v-show="showBox"
      @click="show_input()"
    >{{ value }}</div>
    <el-date-picker
      style="width:100%"
      v-model="data"
      :type="type"
      ref="datePicker"
      placeholder="选择日期时间"
      @change="change"
      v-show="!showBox"
      @blur="blur"
      @focus="focus"
      :format="format"
      :value-format="format"
      :picker-options="pickerOptions"
    ></el-date-picker>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
@Component({
  name: 'selectBox',
  components: {},
})
export default class extends Vue {
  @Prop({ required: true, default: '' }) private value!: string
  @Prop({ required: false, default: false }) private disabled!: boolean
  @Prop({ required: false, default: 'datetime' }) private type!: string //时间选择器的type
  @Prop({ required: false, default: false }) private required!: boolean
  @Prop({ required: false, default: () => {} }) private pickerOptions!: any
  @Prop({ required: false, default: 'yyyy-MM-dd HH:mm:ss' }) private format!: string //值的格式化
  private showBox: boolean = true
  private data: string = ''
  private isValidate: boolean = false

  private gjrValue: any = null

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
    this.$emit('blur')
    this.$emit('input', this.data)
    this.showBox = true
    this.$nextTick(() => {
      if (this.required && !this.value) {
        this.isValidate = true
      } else {
        this.isValidate = false
      }
    })
  }

  private change() {
    this.$emit('input', this.data)
    this.$emit('change', this.data)
  }

  private focus() {
    this.showBox = false
    this.$nextTick(() => {
      ;(this.$refs.datePicker as any).focus()
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
