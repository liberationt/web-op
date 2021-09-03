<template>
  <div>
    <div
      class="w100 ellipsis"
      v-show="showBox"
      :class="[ (!(gjrValue == value) ? 'red-point' : '')]"
      @click="show_input()"
    >{{ options.find(option => option[option_value_filed] == value) && options.find(option => option[option_value_filed] == value)[option_label_filed]}}</div>
    <el-select
      v-model="data"
      @blur="blur"
      @focus="focus"
      ref="select"
      class="select"
      v-show="!showBox"
      @visible-change="visible => visibleChange(visible)"
      @change="data => change(data)"
      :automatic-dropdown="true"
      remote
      filterable
      :remote-method="isSearch?remoteMethod:remoteMethodNull"
      :clearable="clearable"
      :default-first-option="true"
    >
      <!--    :key = index    不然会重复-->
      <el-option
        v-for="(item,index) in localOptions"
        :key="index"
        :disabled="item.disabled"
        :value="item[option_value_filed]"
        :label="item[option_label_filed]"
      >
        <span style="float: left" v-if="item[label1]">{{item[label1]}} |</span>
        <span style="float: right" v-if="item[label2]">{{item[label2]}}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { findKeys, deepCopy } from '@/utils'
@Component({
  name: 'selectDown',
  components: {}
})
export default class extends Vue {
  @Prop({ required: true, default: '' }) private value!: any
  @Prop({ required: false, default: false }) private disabled!: boolean
  @Prop({ required: true, default: () => [] }) private options!: any[]  //select的选项
  @Prop({ required: true, default: '' }) private option_label_filed!: string //option的label
  @Prop({ required: true, default: '' }) private option_value_filed!: string //option的value
  @Prop({ required: false, default: '' }) private label1!: string //option的value
  @Prop({ required: false, default: '' }) private label2!: string //option的value
  @Prop({ required: false, default: false }) private required!: boolean
  @Prop({ required: false, default: true }) private clearable!: boolean
  @Prop({ required: false, default: false }) private isSearch!: boolean
  private showBox: boolean = true
  private data: any = ''
  private isValidate: boolean = false
  private gjrValue: any = null
  private loading: boolean = false
  private localOptions: any[] = []

  created() {
    this.data = this.value + ''
    this.gjrValue = this.value
    this.options.forEach((item: any)=> {
      item.dv = item.dv.toString()
    })
    this.localOptions = deepCopy(this.options)
  }

  @Watch('value')
  private onValueChange(val: any) {
    this.data = val ? val.toString() : ''
  }

  // 获取下拉框的el-option的索引  
  get getIndex() {
    let num:number = 0 // 0表示下拉的第一项
    this.localOptions.forEach((res:any ,index: number) => {
        if(res.dv == this.data) {
            num = index
        }
    })
    return num
  }

  private show_input() {
    if (!this.disabled) {
      this.focus()
    }
  }

  // 失焦事件
  private blur() {
    // this.$nextTick(() => {
    //   ; (this.$refs.select as any).blur()
    // })
    // if (this.required && !this.value) {
    //   this.isValidate = true
    // } else {
    //   this.isValidate = false
    // }
    // this.remoteMethod('')
    this.$emit('blur')
    this.$emit('input', this.data)
  }
  // 重置数组
  private change(data: any) {
    this.$emit('input', this.data)
    this.$emit('change', this.data)
    const params: any = this.options.find((option: any) => option[this.option_value_filed] == this.data)
    this.$emit('getData', params)
    // 重置下拉数据
    this.$nextTick(()=> {
      this.remoteMethod('')
    })
  }

  private hideDown() {
    this.showBox = true
    console.log('109',this.showBox)
  }
  
  // 获取焦点
  private focus() {
    var index =  this.getIndex 
    this.showBox = false
    this.$nextTick(() => {
      ; (this.$refs.select as any).focus()
      ; (this.$refs.select as any).hoverIndex = index // 影响已有值光标所处位置
    })
    this.$emit('focus')
  }

    
  // 选中后的样式 
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

  private remoteMethodNull() {

  }

  // 远程搜索
  private remoteMethod(query: string) {
    if (query != '') {
      this.loading = true
      let arr: any[] = deepCopy(this.options)
      this.localOptions = []
      setTimeout(() => {
        // ['wb', 'dn', 'py'].map((item: string) => {
        //   arr.filter((item1: any) => {
        //     try {
        //       if ((item1[item] as string).toUpperCase().includes(query.toUpperCase())) {
        //         this.localOptions = [...this.localOptions, item1]
        //       } else {
        //           throw item[item1]
        //       }
        //     } catch(err){
        //         console.log(err)
        //     }
        //   })
        //   arr = arr.filter((item2: any) => !(item2[item] as string).toUpperCase().includes(query.toUpperCase()))
        // })
        this.localOptions = findKeys(query.toUpperCase(), arr, ['dn', 'py'])
        ;(this.$refs.select as any).hoverIndex = 1 // 搜索后默认第一行数据点亮
        this.loading = false
      }, 200)
    } else {
      this.localOptions = deepCopy([...this.options])
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
.el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
  background: #c1ecff;
}
</style>
