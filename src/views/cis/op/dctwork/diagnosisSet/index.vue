<!--
 * @Date: 2020-05-15 16:01:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-19 10:08:03
 * @description: 常用诊断维护
 -->

<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="14">
        <diagnosisList ref="diagnosisList" :search-data="searchDataLeft" @getValue="getValue" @refresh="refreshRight" />
      </el-col>
      <el-col class="ht" :span="10">
        <personalList ref="personalList" :search-data="searchDataRight" @getLeftList="refreshLeft" />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  IDiagList,
  IPerList,
} from '@/api/cis/op/dctwork/diagnosis'
import diagnosisList from './components/diagnosisList.vue'
import personalList from './components/personalList.vue'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'DiagnosisSet',
  components: { diagnosisList, personalList },
})
export default class extends Vue {
  //声明变量，方法
  private listSlotHeight: number = 0
  private searchDataRight: any = {
    cflx: '1',
    pydm: '',
    sslb: '1',
  }
  private searchDataLeft: any = {
    pageNum: 1,
    pageSize: 10,
    pydm: '',
    notIn: []
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 61 - 40 - 30
  }
  mounted() {}

  private getValue(value: number) {
    this.searchDataRight.cflx = value
    const pageTable: any = this.$refs.personalList as any
    pageTable.getList()
  }

  private refreshRight() {
    ;(this.$refs.personalList as any).getList();
  }

  private refreshLeft(val:any) {
    this.searchDataLeft.notIn = val
    ;(this.$refs.diagnosisList as any).getList()
  }
}
</script>

<style lang="scss" scoped>
.title {
  height: 28px;
  display: flex;
  align-content: center;
  flex-direction: row;
  align-items: center;
}
</style>
