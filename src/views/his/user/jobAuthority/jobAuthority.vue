<!--
 * @Date: 2020-04-16 09:37:35
 * @LastEditors: 曹俊
 * @LastEditTime: 2020-05-15 14:26:01
 * @description: 岗位权限设置页面
 -->
<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col :span="14" class="ht">
        <div class="his-module">
          <pagenation-list
            ref="pageTable"
            data-url="/system-service/sys/sysgroup/queryPage"
            stripe
            v-model="list"
            :searchData="searchData"
            :list-height="listSlotHeight"
            http-method="post"
          >
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">{{$t('jobAut.title1')}}</h1>
                <el-input
                  v-model="searchData.groupName"
                  :placeholder="$t('jobAut.phSearch1')"
                  @change="searchJobList"
                >
                  <i slot="prefix" class="el-input__icon icon his-search"></i>
                </el-input>
              </div>
            </div>

            <el-table
              stripe
              highlight-current-row
              ref="currentRowTable"
              @row-click="handleChooseRow"
              :height="listSlotHeight"
              class="scroll-bar"
              :data="list"
              slot="list"
              border
            >
              <!-- 序号 -->
              <el-table-column prop="webSortNumber" :label="$t('common.serialNum')" width="80"></el-table-column>
              <!-- 岗位代码 -->
              <el-table-column prop="groupCode" :label="$t('jobAut.jobCode')" width="180"></el-table-column>
              <!-- 岗位名称 -->
              <el-table-column prop="groupName" :label="$t('jobAut.jobName')"></el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col :span="10" class="ht">
        <div class="his-module">
          <div slot="header" class="row">
            <div class="label">
              <h1 class="title">{{$t('jobAut.title2')}}</h1>
              <el-input v-model="searchData.menuName" :placeholder="$t('jobAut.phSearch2')">
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                class="green-gra"
                :disabled="choosedGroupId == null"
                icon="icon his-save"
                @click="handleSave"
              >{{$t('common.save')}}</el-button>
            </div>
          </div>

          <div class="mt" :style="{ height: listSlotHeightR + 'px' }">
            <el-tree
              :data="menuAuthorityList"
              show-checkbox
              empty-text="loading......"
              ref="tree"
              node-key="id"
              highlight-current
              :props="defaultProps"
              :default-checked-keys="defaultCheckedKeys"
              :default-expanded-keys="defaultExpandedKeys"
              :filter-node-method="filterNode"
            >
              <!-- <span slot-scope="{ node, data }">{{data.menuName}}-{{data.menuId}}</span> -->
            </el-tree>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import {
  getMenuByGroupId,
  editMenuGroup,
  querySysgroupList,
  getJobList,
} from '@/api/his/user/jobAuthority.ts'
import { log } from 'util'

declare interface jobList {
  id: number
  jobCode: string
  jobName: string
}

@Component({
  name: 'jobAuthority',
  filters: {},
})
export default class extends Vue {
  private list: jobList[] = []
  private menuAuthorityList: any = [] // tree数据
  private menuLeaf: any = [] // tree叶子
  private defaultCheckedKeys: any[] = []
  private defaultExpandedKeys: any[] = []
  private listSlotHeight: number = 0
  private listSlotHeightR: number = 0
  private searchData: any = {
    groupName: '',
    menuName: '',
  }
  private choosedGroupId: number | null = null
  private defaultProps: object = {
    children: 'children',
    label: 'label',
  }
  private choosedList: number[] = []
  private listQuery: any = {
    pageNum: 1,
    pageSize: 10,
    groupName: '',
  }
  private menuIds: any[] = []
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 114
    this.listSlotHeightR = Vue.prototype.PageHeight - 100
    console.log(this.listSlotHeightR)
  }
  mounted() {
    this.getList()
    this.queryJobList()
  }
  /**
   * @LastEditors: zhml
   * @Description: 监听tree筛选函数
   * @param {type} params
   * @return:
   */
  @Watch('searchData', { immediate: true, deep: true })
  private searchDataChange(val: any) {
    console.log('Watch', val)

    if (val.menuName) {
      ;(this.$refs.tree as any).filter(val.menuName)
    } else if (
      val.menuName == '' ||
      val.menuName == undefined ||
      val.menuName == ' '
    ) {
      this.queryJobList()
    }
  }
  // FIXME: 有空优化下，根据岗位id获取菜单权限
  private handleChooseRow(item: any) {
    this.defaultCheckedKeys = []
    this.defaultExpandedKeys = []
    let arr: any[]=[]
    this.choosedGroupId = item.groupId
    this.queryJobList()
    //获取已勾选
    getMenuByGroupId({ groupId: item.groupId }).then((res: any) => {
      // 获取keys
      res.data.forEach((element: any, index: number) => {
        arr.push(element.menuId)
        // this.defaultCheckedKeys.push(element.menuId)
        this.defaultExpandedKeys.push(element.menuId)
      })
      this.defaultCheckedKeys = arr.filter((i)=>{
        return this.menuLeaf.includes(i)
      })
      // const tree: any = this.$refs.tree as any
      // tree.setCheckedKeys(arr)
    })
  }

  private queryJobList() {
    getJobList({}).then((res: any) => {
      this.menuLeaf = [] // 叶子节点
      this.getArray(res.data)
      this.menuAuthorityList = res.data
    })
  }
  /**
   * @LastEditors: zhml
   * @Description: 更改元素的属性
   * @param {type} params
   * @return:
   */
  private getArray(data: any[]) {
    for (var i in data) {
      if (data[i].childMenuList.length == 0) {
        data[i].id = data[i].menuId
        data[i].label = data[i].menuName
        // 顺便获取所有叶子节点
        this.menuLeaf.push(data[i].id)
        // break;
      } else {
        data[i].id = data[i].menuId
        data[i].label = data[i].menuName
        data[i].children = data[i].childMenuList
        this.getArray(data[i].childMenuList)
      }
    }
    return data
  }
  /**
   * @LastEditors: zhml
   * @Description: 选中数据更新权限
   * @param {type} params
   * @return:
   */
  private handleSave() {
    const tree: any = this.$refs.tree as any
    const treeList: any[] = tree.getCheckedKeys().concat(tree.getHalfCheckedKeys())

    if (treeList.length > 0) {
      editMenuGroup({ menuIds: treeList, groupId: this.choosedGroupId }).then(
        (res: any) => {
          this.$notify({
            title: this.$t('jobAut.modifySuc').toString(),
            message: '',
            type: 'success',
          })
        }
      )
    } else {
      this.$notify({
        title: this.$t('jobAut.modifyWarn').toString(),
        message: '',
        type: 'warning',
      })
    }
  }
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private compareList(data: any[], ids: number) {
    for (var i in data) {
      if (data[i].childMenuList.length > 0 && data[i].id != ids) {
        this.compareList(data[i].childMenuList, ids)
      } else if (data[i].id == ids) {
        this.$set(data[i], 'checked', true)
      }
    }
  }

  private searchJobList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }
  /**
   * @LastEditors: zhml
   * @Description: 筛选tree数据
   * @param {type} params
   * @return:
   */
  private filterNode(value: any, data: any) {
    if (!value){
      return true
    }
    if(data.pyCode == null){
      data.pyCode = ''
    }
    if(data.wbCode == null){
      data.wbCode = ''
    }
    return data.label.indexOf(value) !== -1 ||
    data.pyCode.indexOf(value.toUpperCase()) !== -1 ||
    data.wbCode.indexOf(value.toUpperCase()) !== -1
  }
}
</script>

<style lang="scss" scoped>
.ht {
  height: 100%;
}
.ivu-table-overflowX {
  overflow-x: hidden;
}
.ivu-input-wrapper {
  width: auto;
}
.ivu-input {
  width: 220px;
  height: 30px;
  background: rgba(245, 246, 248, 1);
  border-radius: 4px;
}
.main {
  .query-name {
    font-size: 16px;
    font-weight: 500;
    color: rgba(34, 43, 49, 1);
    line-height: 24px;
    margin-right: 16px;
  }
}
.mt {
  overflow: auto;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    // background:#f00;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #d3d5e5;
  }
  &::-webkit-scrollbar-track {
    border-radius: 10px;
    // background: #fff;
  }
}
</style>
