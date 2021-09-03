<!--
 * @Date: 2020-10-22 15:18:43
 * @LastEditTime: 2020-10-26 19:32:43
 * @Description:
 * @FilePath: \web-im\src\views\his\im\residentDoctor\clinicalApplication\components\useReason.vue
-->
<template>
  <div class="content" style="height: auto; background: #ffffff;">
    <div class="his-module his-small his-userReason-padding">
      <pagenation-list ref="pageTable" v-model="tableData" data-url="/mms-service/amqcyskjywsyly/queryPage" http-method="post" :list-height="listSlotHeight" :searchData="searchData">
        <div slot="header" class="row">
          <div class="label">
            <!-- <h1 class="title">抗菌药物使用理由设置</h1> -->
            <span class="tag pl0">类型</span>
            <el-radio v-model="searchData.lx" label="1" @change="searchList">个人</el-radio>
            <el-radio v-model="searchData.lx" label="2" @change="searchList">科室</el-radio>
            <el-radio v-model="searchData.lx" label="3" @change="searchList">全院</el-radio>
            <span class="tag pl0 ml10">使用理由</span>
            <el-input v-model="searchData.syly" placeholder="请输入使用理由查询..." @keydown.enter.native="searchList"></el-input>
          </div>
        </div>
        <el-table ref="listTable" :data="tableData" border stripe :highlight-current-row="true" slot="list" :height="listSlotHeight" class="scroll-bar" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="35"> </el-table-column>
          <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
          <el-table-column prop="syly" :label="'使用理由'"></el-table-column>
          <el-table-column prop="lx" :label="'类型'" width="60">
            <template slot-scope="scope">
              {{ scope.row.lx | sylylx }}
            </template>
          </el-table-column>
          <el-table-column prop="officename" :label="'科室'" width="120"></el-table-column>
          <el-table-column prop="personname" :label="'创建医生'" width="100"></el-table-column>
        </el-table>
      </pagenation-list>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { sylyQueryPage } from '@/api/his/im/antibioticsManage/usApplication'
// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'useReason',
  filters: {
    sylylx(value: any) {
      switch (value) {
        case 1:
          return '个人'
        case 2:
          return '科室'
        case 3:
          return '全院'
      }
    },
  },
})
export default class extends Vue {
  // 声明变量，方法
  private searchData = {
    lx: '1',
    syly: '',
  }
  private listSlotHeight: number = 300 //列表高度
  //列表数组
  private tableData: any[] = []
  private leftSelection: any[] = [] //选中个人理由
  private centerSelection: any[] = [] //选中科室理由
  private rightSelection: any[] = [] //选中全院理由
  // 监听方法
  @Watch('')
  // 生命周期
  mounted() {
    this.searchList()
  }
  searchList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
    this.$nextTick(() => {
      if (this.searchData.lx == '1' && this.leftSelection.length > 0) {
        this.leftSelection.forEach((row) => {
          this.tableData.forEach((multItem: any, j: any) => {
            if (row.jlxh == multItem.jlxh) {
              ;(this.$refs.listTable as any).toggleRowSelection(row, true) //这步操作是让  页面显示选中的数据
            }
          })
        })
      } else if (this.searchData.lx == '2' && this.centerSelection.length > 0) {
        this.centerSelection.forEach((row) => {
          ;(this.$refs.listTable as any).toggleRowSelection(row)
        })
      } else if (this.searchData.lx == '3' && this.rightSelection.length > 0) {
        this.rightSelection.forEach((row) => {
          ;(this.$refs.listTable as any).toggleRowSelection(row)
        })
      } else {
        ;(this.$refs.listTable as any).clearSelection()
      }
    })
  }
  handleSelectionChange(val: any) {
    if (this.searchData.lx == '1') {
      console.log('this.leftSelection', this.leftSelection)
      this.leftSelection = val
    } else if (this.searchData.lx == '2') {
      this.centerSelection = val
    } else {
      this.rightSelection = val
    }
  }

  private confirmSelectSyly() {
    if (this.searchData.lx == '1') {
      this.$emit('resetSyly', this.leftSelection)
    } else if (this.searchData.lx == '2') {
      this.$emit('resetSyly', this.centerSelection)
    } else {
      this.$emit('resetSyly', this.rightSelection)
    }
  }
}
</script>

<style lang='scss' scoped>
.his-userReason-padding {
  padding: 10px 0px 8px !important;
}
</style>
