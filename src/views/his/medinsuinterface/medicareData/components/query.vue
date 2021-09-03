<!--
 * @Date: 2020-04-23 09:59:05
 * @LastEditTime: 2020-04-29 15:08:23
 * @Description: 
 * @FilePath: \web-op\src\views\his\medinsuinterface\medicareData\components\query.vue
 -->
<template>
  <div class="query-search">
    <div>
      <el-input
        v-model="listQuery.dataName"
        :placeholder="$t('medicareData.search')"
        @change="queryUser"
      >
        <i slot="prefix" class="el-input__icon icon his-search"></i>
      </el-input>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { queryPage } from '@/api/his/medinsuinterface/medicareData.ts'

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
  private queryUser() {
    queryPage(this.listQuery).then((res: any) => {
      this.$emit('setList', res.data.list)
    })
  }
  private handleAdd() {
    this.$emit('setForm', true)
  }
}
</script>
