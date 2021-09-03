<!--传参模板在src\views\his\drugs\westdrugs\purchaseInputStore\index.vue可以看到-->
<template>
  <div>
    <div class="his-module his-small">
      <el-table
        :data="value"
        border
        :fit="true"
        stripe
        tooltip-effect="light"
        :highlight-current-row="true"
        slot="list"
        :height="height + 10"
        class="scroll-bar"
      >
        <el-table-column type="index" width="32" align="center"></el-table-column>
        <el-table-column
          v-for="(item, index) in headerArray"
          :key="index"
          :label="item.label"
          :width="item.width && item.width"
          :label-class-name="item.isMust ? 'first-red' : ''"
        >
          <template slot-scope="scope">
            <div v-if="item.type== 'selection'">
              <el-checkbox v-model="scope.row[item.prop]"></el-checkbox>
            </div>
            <div v-if="item.type== 'backColor'">
              <div :class="scope.row[item.prop] % 2 == 1 ? 'greenBack' : 'orangeBack'"></div>
            </div>
            <div v-if="item.type == 'text'" @click="cellClick(scope, item.type)">
              <div class="ellipsis">{{ scope.row[item.prop] }}</div>
            </div>
            <div v-else>
              <div v-if="item.type == 'input'">
                <div
                  class="w100 ellipsis"
                  v-show="scope.column.label !== colLabel || scope.$index !== rowIndex"
                  @click="cellClick(scope, item.type)"
                >{{ scope.row[item.prop] }}</div>
                <el-input
                  class="w100"
                  v-show="scope.column.label === colLabel && scope.$index === rowIndex"
                  v-model="scope.row[item.prop]"
                  @change="blurEvent()"
                  :ref="`${item.type}-${scope.$index}-${scope.column.label}`"
                  @keyup.enter.native="nextFocus"
                ></el-input>
              </div>
              <div v-if="item.type == 'select'">
                <div
                  class="w100 ellipsis"
                  v-show="scope.column.label !== colLabel || scope.$index !== rowIndex"
                  @click="cellClick(scope, item.type)"
                >{{ scope.row[item.prop] ? item.option.find((option) => option[item.value_filed || 'value'] == scope.row[item.prop]) && item.option.find((option) => option[item.value_filed || 'value'] == scope.row[item.prop])[item.label_filed || 'label'] : ''}}</div>
                <el-select
                  class="w100"
                  v-show="scope.column.label === colLabel && scope.$index === rowIndex"
                  v-model="scope.row[item.prop]"
                  :ref="`${item.type}-${scope.$index}-${scope.column.label}`"
                  @keyup.enter.native="nextFocus"
                  @change="selec_focus(`${item.type}-${scope.$index}-${scope.column.label}`)"
                >
                  <el-option
                    v-for="option in item.option"
                    :key="option[item.value_filed || 'value']"
                    :label="option[item.label_filed || 'label']"
                    :value="option[item.value_filed|| 'value']"
                  ></el-option>
                </el-select>
              </div>
              <div v-if="item.type == 'timePicker'">
                <div
                  class="w100 ellipsis"
                  v-show="scope.column.label !== colLabel || scope.$index !== rowIndex"
                  @click="cellClick(scope, item.type)"
                >{{ scope.row[item.prop] }}</div>
                <el-date-picker
                  class="w100"
                  v-show="scope.column.label === colLabel && scope.$index === rowIndex"
                  v-model="scope.row[item.prop]"
                  :type="item.dateType"
                  @blur="dateBlurEvent()"
                  :ref="`${item.type}-${scope.$index}-${scope.column.label}`"
                  placeholder="选择日期时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @keyup.enter.native="nextFocus"
                  @change="selec_focus(`${item.type}-${scope.$index}-${scope.column.label}`)"
                ></el-date-picker>
              </div>
              <div v-if="item.type == 'select-search'">
                <div
                  class="w100 ellipsis"
                  v-show="scope.column.label !== colLabel || scope.$index !== rowIndex"
                  @click="cellClick(scope, item.type)"
                >{{ scope.row[item.prop] }}</div>
                <old-remote-search-select
                  v-show="scope.column.label === colLabel && scope.$index === rowIndex"
                  :ref="`${item.type}-${scope.$index}-${scope.column.label}`"
                  :search-url="item.url"
                  :resultTableHeader="item.resultHeader"
                  :searchData="item.searchData"
                  :popover-width="item.popoverWidth ? item.popoverWidth : 600"
                  v-model="scope.row[item.prop]"
                  :showLabel="item.prop"
                  :searchField="item.queryData"
                  @getData="data => fillData(data, item.selectResult)"
                  @keyup.enter.native="nextFocus"
                  @change="blurEvent()"
                />
              </div>
              <div v-if="item.type == 'dict-select'">
                <div
                  :key="`${item.type}-${scope.$index}-${scope.column.label}`"
                  class="w100 ellipsis"
                  v-show="scope.column.label !== colLabel || scope.$index !== rowIndex"
                  @click="cellClick(scope, item.type)"
                >{{ scope.row[item.prop] }}</div>
                <dict-search-select
                  v-show="scope.column.label === colLabel && scope.$index === rowIndex"
                  :result-table-header="item.resultTableHeader"
                  :ref="`${item.type}-${scope.$index}-${scope.column.label}`"
                  :table-name="item.tableName"
                  :query-filed="item.queryFiled"
                  v-model="scope.row[item.prop]"
                  showLabel="JBMC"
                  :popover-width="item.popoverWidth"
                  @getData="data => fillData(data, item.selectResult)"
                  @keyup.enter.native="nextFocus"
                  @change="blurEvent()"
                />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.actions')"
          :width="btnWidth"
          align="center"
          fixed="right"
          v-if="showBtn && fixed"
        >
          <template slot-scope="scope">
            <slot name="button" :scope="scope.row"></slot>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.actions')"
          :width="btnWidth"
          align="center"
          v-if="showBtn && !fixed"
        >
          <template slot-scope="scope">
            <slot name="button" :scope="scope.row"></slot>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { rightScroll } from '@/utils/index.ts'

@Component({
  name: 'editTable',
  components: {}
})
export default class extends Vue {
  @Prop({ required: true, default: [] }) private value!: any
  @Prop({ required: true, default: [] }) private headerArray!: Array<any>
  @Prop({ required: false, default: true }) private showFooter!: boolean
  @Prop({ required: true, default: 0 }) private height!: number // 表的高度
  @Prop({ required: false, default: true }) private showBtn!: boolean // 是否显示删除按钮
  @Prop({ required: false, default: 60 }) private btnWidth!: number // 操作按钮列的宽
  @Prop({ required: false, default: true }) private fixed!: boolean // 是否固定操作列

  // private data: Array<any> = [] //table的数据
  private colLabel: string | null = null //选中单元格所在的列，未选择时为null
  private rowIndex: number = -1 //选中单元格所在的行，未选中时为-1
  private listKey: number = 0
  private label: string = ''

  //点击单元格，变为编辑状态，获取焦点
  private cellClick(scope: any, type: string) {
    this.colLabel = scope.column.label
    this.rowIndex = scope.$index
    if (type != 'text') {
      if ((this.$refs[`${type}-${scope.$index}-${scope.column.label}`] as any)[0].focus) {
        this.$nextTick(() => {
          ; (this.$refs[`${type}-${scope.$index}-${scope.column.label}`] as any)[0].focus()
        })
      } else {
        if ((this.$refs[`${type}-${scope.$index}-${scope.column.label}`] as any)[0].isFocus) {
          this.$nextTick(() => {
            ; (this.$refs[`${type}-${scope.$index}-${scope.column.label}`] as any)[0].isFocus()
          })
        } else {
          if ((this.$refs[`${type}-${scope.$index}-${scope.column.label}`] as any)[0].onFocus) {
            this.$nextTick(() => {
              ; (this.$refs[`${type}-${scope.$index}-${scope.column.label}`] as any)[0].onFocus()
            })
          }
        }
      }
    } else {
      this.colLabel = null
      this.rowIndex = -1
    }
  }

  @Watch('value')
  private onValueChange(value: string) {
    rightScroll()
  }

  // 当input框失去焦点时隐藏输入框
  private blurEvent() {
    this.$emit('input', this.value)
  }

  private dateBlurEvent() {
    const datePick: any = document.getElementsByClassName('el-picker-panel')
    datePick[0].style.display = 'none'
    this.$emit('input', this.value)
  }

  // 为data新增一个对象，对象的属性名为headerArray的所有prop
  private addData() {
    const data = <any>{}
    this.listKey++
    for (let i = 0; i < this.headerArray.length; i++) {
      data[this.headerArray[i].prop] = <any>''
    }
    this.value.push(data)
    let firstItem: any = this.headerArray.find(item => item.type != null)
    this.colLabel = firstItem.label
    this.rowIndex = this.value.length - 1
    this.$nextTick(() => {

      if ((this.$refs[`${firstItem.type}-${this.value.length - 1}-${firstItem.label}`] as any)[0].focus) {
        ; (this.$refs[`${firstItem.type}-${this.value.length - 1}-${firstItem.label}`] as any)[0].focus()
      }
      if ((this.$refs[`${firstItem.type}-${this.value.length - 1}-${firstItem.label}`] as any)[0].onFocus) {
        ; (this.$refs[`${firstItem.type}-${this.value.length - 1}-${firstItem.label}`] as any)[0].onFocus()
      }
      if ((this.$refs[`${firstItem.type}-${this.value.length - 1}-${firstItem.label}`] as any)[0].isFocus) {
        ; (this.$refs[`${firstItem.type}-${this.value.length - 1}-${firstItem.label}`] as any)[0].isFocus()
      }
    })
  }

  // 删除一行数据
  private delectRow(index: number) {
    this.value.splice(index, 1)
  }

  // 选择远程搜索的结果，将数据填充到表格上
  private fillData(data: any, selectResult: any) {
    // console.log(selectResult)
    // console.log(data)

    // 整个方法给父组件用
    this.$emit('setData',data)
    for (let index in Object.keys(selectResult)) {
      this.value[this.rowIndex][Object.keys(selectResult)[index]] = data[(Object.values(selectResult) as any)[index]]
      // console.log(data[(Object.values(selectResult) as any)[index]])
      // console.log((Object.values(selectResult) as any)[index])
    }



    // console.log(this.value)
    // for (let (key,value) in selectResult) {
    //   this.value[this.rowIndex][selectResult[key]] = data[key]
    // }


  }

  private nextFocus() {

    const datePick: any = document.getElementsByClassName('el-picker-panel')
    // if (datePick[0]) {
    //   datePick[0].style.display = 'none'
    // }
    if (datePick.length > 0) {
      // datePick.map((item: any) => {
      //   item.style.display = 'none'
      // })
      for (let i = 0; i < datePick.length; i++) {
        datePick[i].style.display = 'none'
      }
    }
    let array: Array<any> = []
    this.headerArray.map(item => {
      if (item.type != 'text') {
        array = [...array, { label: item.label, type: item.type }]
      }
    })
    let index = array.findIndex(item => {
      return this.colLabel == item.label
    })
    if (index < array.length - 1) {
      const inputType = array[index + 1].type
      this.colLabel = array[index + 1].label
        ; (this.$refs[`${array[index].type}-${this.rowIndex}-${array[index].label}`] as any)[0].blur()
      this.$nextTick(() => {
        if ((this.$refs[`${inputType}-${this.rowIndex}-${this.colLabel}`] as any)[0].isFocus) {
          ; (this.$refs[`${array[index].type}-${this.rowIndex}-${array[index].label}`] as any)[0].blur()
            ; (this.$refs[`${inputType}-${this.rowIndex}-${this.colLabel}`] as any)[0].isFocus()
        } else {
          if ((this.$refs[`${inputType}-${this.rowIndex}-${this.colLabel}`] as any)[0].onFocus) {
            ; (this.$refs[`${array[index].type}-${this.rowIndex}-${array[index].label}`] as any)[0].blur()
              ; (this.$refs[`${inputType}-${this.rowIndex}-${this.colLabel}`] as any)[0].onFocus()
          } else {
            if ((this.$refs[`${inputType}-${this.rowIndex}-${this.colLabel}`] as any)[0].focus) {
              ; (this.$refs[`${array[index].type}-${this.rowIndex}-${array[index].label}`] as any)[0].blur()
                ; (this.$refs[`${inputType}-${this.rowIndex}-${this.colLabel}`] as any)[0].focus()
            }
          }
        }
      })
    } else {
      this.addData()
    }
  }

  private selec_focus(ref: string) {
    (this.$refs[`${ref}`] as any)[0].focus()
    console.log(ref)
    console.log(this.$refs[`${ref}`])
    this.$emit('input', this.value)
  }
}
</script>

<style lang="scss" scoped>
::v-deep .w100 {
  height: 30px;
  width: 100%;
}

.bottom-bar {
  height: 24px;
}

.bottom-bar.row {
  margin-bottom: 0px;
  padding-bottom: 0px;
}

::v-deep .el-input--medium .el-input__inner {
  height: 30px;
}

::v-deep .el-input__inner {
  padding-right: 0px;
  padding-left: 10px;
}

::v-deep .cell {
  padding: 0 !important;
}

::v-deep .el-select-dropdown {
  display: none;
}

::v-deep .ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content .his-small {
  padding: 0px;
}

::v-deep .el-select {
  height: 32px;
  line-height: 32px;

  .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
}

::v-deep .el-input--medium .el-input__icon {
  line-height: 30px !important;
}

::v-deep .el-date-editor .el-input__inner {
  padding-left: 28px;
}

::v-deep div.first-red::before {
  content: '*';
  color: red;
}

.orangeBack,
.greenBack {
  height: 32px;
  opacity: 0.3 !important;
}

.greenBack {
  background: #0fcaad;
}

.orangeBack {
  background: #ffbf00;
}
</style>
