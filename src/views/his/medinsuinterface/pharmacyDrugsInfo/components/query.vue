<!--
* @Author: 曹俊
 * @LastEditTime: 2020-04-29 11:30:38
 * @LastEditors: 曹俊
* @Description: 
 * @FilePath: \web-op\src\views\his\medinsuinterface\pharmacyDrugsInfo\components\query.vue
-->
<template>
  <div class="query-search label">
    <el-input v-model="listQuery.tbdm" :placeholder="$t('pharmacyDrugsInfo.queryTips')" @change="handleQuery"  clearable @clear="clear" >
      <i slot="prefix" class="el-input__icon icon his-search"></i>
    </el-input>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  queryPriceRulePage,
  queryPurchasePage,
  queryDeliveryPage,
  queryDreimbursementPage,
  queryProportionPage,
} from '@/api/his/medinsuinterface/pharmacyDrugsInfo.ts'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: '',
  filters: {},
})
export default class extends Vue {
  @Prop({ required: true }) private value!: any
  set listQuery(val: any) {
    this.$emit('input', val)
  }
  get listQuery() {
    return this.value
  }

  private list: any = []

  mounted() {}
  // 查询
  private handleQuery() {
    let type: number = this.listQuery.type
    if (type == 2) {
      queryPriceRulePage(this.listQuery).then((res: any) => {
        this.$emit('setList', res.data.list)
      })
    } else if (type == 3) {
      queryPurchasePage(this.listQuery).then((res: any) => {
        this.$emit('setList', res.data.list)
      })
    } else if (type == 4) {
      queryDeliveryPage(this.listQuery).then((res: any) => {
        this.$emit('setList', res.data.list)
      })
    } else if (type == 5) {
      queryDreimbursementPage(this.listQuery).then((res: any) => {
        this.$emit('setList', res.data.list)
      })
    } else if (type == 6) {
      queryProportionPage(this.listQuery).then((res: any) => {
        this.$emit('setList', res.data.list)
      })
    }
  }
  // 清空输入框
  private clear(){
    this.handleQuery()
  }
  private handleAdd() {
    this.$emit('setForm', true)
  }
}
</script>

<style lang="scss" >
</style>