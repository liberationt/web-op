<!--
 * @Author: your name
 * @Date: 2020-03-24 14:47:29
 * @LastEditTime: 2020-04-16 13:28:09
 * @LastEditors: zhml
 * @Description: 用户设置，用户权限设置都要用到这个组件
 * @FilePath: \his-admin\src\view\sysManage\userSetting\components\jobAuthority.vue
 -->
<template>
  <div class="ht">
    <div class="table-list">
      <pagenation-list
        ref="pageTable"
        data-url="/system-service/sys/sysgroup/queryPage"
        v-model="tabledata"
        :pageProps="pageProps"
        http-method="post"
        style="margin-top:10px"
      >
        <div slot="header" class="row">
          <div class="label">
            <h1 class="title" style="flex:1">岗位权限</h1>
            <el-input
              v-model="groupName"
              placeholder="请输入岗位名称查询..."
              @on-enter="queryJob"
              @on-blur="queryJob"
            >
              <i :size="16" custom="icon his-search" slot="prefix" />
            </el-input>
          </div>
        </div>
        <el-table
          border
          ref="selection"
          :columns="columns"
          :data="tabledata"
          slot="list"
          highlight-row
          @on-current-change="handleCurrentRow"
        ></el-table>
      </pagenation-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'jobAuthority'
})
export default class extends Vue {
  @Prop({}) private value!: any
  get tabledata() {
    return this.value
  }
  set tabledata(value: any) {
    this.$emit('input', value)
  }
  private groupName: string = ''
  private pageProps: any = {
    // iview分页组件自带props
    'show-elevator': true,
    'show-sizer': true,
    'show-total': true
  }
  //声明变量，方法
  private columns: any = [
    {
      title: '序号',
      key: 'groupId'
    },
    {
      title: '岗位代码',
      key: 'groupCode'
    },
    {
      title: '岗位名称',
      key: 'groupName'
    }
  ]

  //初始化的周期函数
  mounted() {
    // this.list = [
    //   {
    //     id: 1,
    //     groupId: "0001",
    //     groupCode: "鹿丸",
    //     groupName: "D0001"
    //   }
    // ];
  }

  private queryJob() {
    this.$emit('query', this.groupName)
  }
  private handleCurrentRow(item: any) {
    this.$emit('handle', item)
  }
}
</script>

<style lang="less" scoped></style>
