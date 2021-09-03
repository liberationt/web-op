<!--
 * @Author: wangyao
 * @LastEditTime: 2020-05-08 16:33:39
 * @LastEditors: 曹俊
 -->
<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="10">
        <div class="his-module">
          <div slot="header" class="row">
            <div class="label">
              <h1 class="title">{{$t('uAutSet.leftTitle')}}</h1>
              <el-input
                v-model="searchData.groupName"
                @keydown.enter.native="queryJobList"
                :placeholder="$t('uAutSet.leftPlh')"
              >
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input>
            </div>
          </div>
          <pagenation-list
            ref="pageTable"
            data-url="/system-service/sys/sysgroup/queryPage"
            v-model="tabledata"
            :searchData="searchData"
            :list-height="listSlotHeight"
            http-method="post"
          >
            <el-table
              slot="list"
              :data="tabledata"
              stripe
              border
              highlight-current-row
              style="width: 100%"
              @row-click="rowClick"
              highlight-row
              ref="currentRowTable"
              :height="listSlotHeight"
              class="scroll-bar"
            >
              <el-table-column prop="webSortNumber" :label="$t('uAutSet.groupId')" width="60"></el-table-column>
              <el-table-column prop="groupCode" :label="$t('uAutSet.groupCode')" width="120"></el-table-column>
              <el-table-column prop="groupName" :label="$t('uAutSet.groupName')"></el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col class="ht" :span="7">
        <div class="his-module">
          <div slot="header" class="row" style="height:41px">
            <div class="label">
              <el-checkbox v-model="checkedLeft"></el-checkbox>
              <h1 style="margin-left:8px" class="title">{{$t('uAutSet.centerTitle')}}</h1>
            </div>
          </div>
          <el-input
            v-model="searchLeft.queryName"
            class="queryInput"
            @keydown.enter.native="queryUserLeft"
            :placeholder="$t('uAutSet.rightPlh')"
          >
            <i slot="prefix" class="el-input__icon icon his-search"></i>
          </el-input>

          <pagenation-list
            ref="pageLeft"
            data-url="/system-service/sysuser/haveListByGroupIdPage"
            v-model="leftArr"
            :searchData="searchLeft"
            :pageProps="pageProps"
            prec="30"
            :list-height="listSlotHeightR"
            http-method="post"
          >
            <div
              slot="list"
              class="scroll-bar"
              style="margin-top:8px"
              :style="{height: listSlotHeightR+'px'}"
            >
              <el-checkbox-group v-model="checkedCitiesLeft">
                <el-checkbox
                  class="checkboxItem"
                  v-for="(item,index) in leftArr"
                  :label="item.userId"
                  :key="item.userId"
                >{{item.userName + ' ' + item.deptName }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </pagenation-list>
          <!-- 穿梭按钮 -->
          <div class="left-right">
            <div style="margin-bottom:26px">
              <el-button
                :type="checkedCitiesRight.length!=0 ? 'primary': 'info'"
                :disabled="checkedCitiesRight.length==0"
                circle
                @click="toLeft"
              >
                <i class="icon his-lt-arrow"></i>
              </el-button>
            </div>
            <div>
              <el-button
                :type="checkedCitiesLeft.length!=0 ? 'primary': 'info'"
                :disabled="checkedCitiesLeft.length==0"
                circle
                @click="toRight"
              >
                <i class="icon his-rt-arrow"></i>
              </el-button>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="ht" :span="7">
        <div class="his-module">
          <div slot="header" class="row" style="height:41px">
            <div class="label">
              <el-checkbox v-model="checkedRight"></el-checkbox>
              <h1 style="margin-left:8px" class="title">{{$t('uAutSet.rightTitle')}}</h1>
            </div>
          </div>
          <el-input
            v-model="searchRight.queryName"
            class="queryInput"
            @keydown.enter.native="queryUserRight"
            :placeholder="$t('uAutSet.rightPlh')"
          >
            <i slot="prefix" class="el-input__icon icon his-search"></i>
          </el-input>

          <pagenation-list
            ref="pageRight"
            data-url="/system-service/sysuser/noListByGroupIdPage"
            v-model="rightArr"
            :searchData="searchRight"
            :pageProps="pageProps"
            prec="30"
            :list-height="listSlotHeightR"
            http-method="post"
          >
            <div
              slot="list"
              class="scroll-bar"
              style="margin-top:8px"
              :style="{height:listSlotHeightR+'px'}"
            >
              <el-checkbox-group v-model="checkedCitiesRight">
                <el-checkbox
                  class="checkboxItem"
                  v-for="(item,index) in rightArr"
                  :label="item.userId"
                  :key="item.userId"
                >{{item.userName + ' ' + item.deptName }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </pagenation-list>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import {
  findUserPage,
  findUnUserPage,
  deleteAuthority,
  addAuthority,
} from '@/api/his/user/sysUser'
import { AxiosResponse } from 'axios'
import { getTableData } from '@/websql/functions'
import { id2Name } from '@/utils'
import { Form } from 'element-ui'
@Component({
    name: '',
    filters: {},
    components: {},
})
export default class extends Vue {
  private searchData: object = {
    groupName: '',
    stopFlag: '0',
  }
  private listSlotHeight: number = 0
  private listSlotHeightR: number = 0
  private pageProps: object = { layout: 'total, sizes, prev, next' }
  private searchLeft: any = {
    groupId: '',
    queryName: '',
  }
  private searchRight: any = {
    groupId: '',
    queryName: '',
  }
  private currRow: any = {}
  private tabledata: Array<any> = []
  private checkedLeft: boolean = false
  private checkedCitiesLeft: Array<any> = []
  private leftArr: Array<any> = []
  private checkedRight: boolean = false
  private checkedCitiesRight: Array<any> = []
  private rightArr: Array<any> = []
  private deptList: Array<any> = []

  // 获取用户信息
  get userInfo() {
    return JSON.parse(localStorage.userInfo)
  }
  //数据监控
  @Watch('leftArr', { immediate: true })
  private onleftArrChange(val: any) {
    id2Name(this.leftArr, 'deptId', 'deptName', this.deptList, 'dv', 'dn')
  }
  @Watch('rightArr', { immediate: true })
  private onrightArrChange(val: any) {
    id2Name(this.rightArr, 'deptId', 'deptName', this.deptList, 'dv', 'dn')
  }

  @Watch('checkedLeft', { immediate: true })
  private oncheckedLeftChange(val: any) {
    this.checkedCitiesLeft = []
    if (val) {
      this.checkedRight = false
      this.leftArr.forEach((item: any) => {
        this.checkedCitiesLeft.push(item.userId)
      })
    }
  }
  @Watch('checkedRight', { immediate: true })
  private oncheckedRightChange(val: any) {
    this.checkedCitiesRight = []
    if (val) {
      this.checkedLeft = false
      this.rightArr.forEach((item: any) => {
        this.checkedCitiesRight.push(item.userId)
      })
    }
  }
  //钩子函数
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 114
    this.listSlotHeightR = Vue.prototype.PageHeight - 144
  }

  mounted() {
    this.getList()
    const _that = this
    getTableData(
      'SYS_DICT_CONFIG',
      '4',
      "select dv,dn from SYS_DICT_CONFIG_VALUE where dk='4'",
      function (data: any) {
        _that.deptList = data
        console.log(_that.deptList)
      }
    )
  }

  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private queryJobList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

  // 左勾选搜索
  private queryUserLeft() {
    if (this.currRow.groupId != undefined) {
      const pageLeft: any = this.$refs.pageLeft
      pageLeft.getList()
    }
  }
  // 右勾选搜索
  private queryUserRight() {
    if (this.currRow.groupId != undefined) {
      const pageRight: any = this.$refs.pageRight
      pageRight.getList()
    }
  }
  // 右传左
  private toLeft() {
    addAuthority({
      groupId: this.currRow.groupId,
      userIdList: this.checkedCitiesRight,
    }).then((res: any) => {
      this.rowClick(this.currRow)
      this.$notify({
        title: this.$t('uAutSet.succtip') + '',
        message: '',
        type: 'success',
      })
    })
  }
  // 左传右
  private toRight() {
    deleteAuthority({
      groupId: this.currRow.groupId,
      userIdList: this.checkedCitiesLeft,
    }).then((res: any) => {
      this.rowClick(this.currRow)
      this.$notify({
        title: this.$t('uAutSet.succtip') + '',
        message: '',
        type: 'success',
      })
    })
  }

  private rowClick(row: any) {
    this.currRow = row
    this.checkedCitiesLeft = []
    this.checkedCitiesRight = []
    this.checkedLeft = false
    this.checkedRight = false
    this.searchLeft.groupId = row.groupId
    this.searchRight.groupId = row.groupId
    const pageLeft: any = this.$refs.pageLeft
    pageLeft.getList()
    const pageRight: any = this.$refs.pageRight
    pageRight.getList()
  }
}
</script>
<style lang="scss" scoped>
.checkboxItem {
  display: block;
  margin: 12px;
}
.queryInput {
  background: #f5f6f8 !important;
  border: 0 !important;
}
.left-right {
  // float: right;
  position: absolute;
  top: 30%;
  right: -24px;
  z-index: 9999;
  button {
    border: 1px solid $white;
  }
  .el-button--info.is-disabled, .el-button--info.is-disabled:hover, .el-button--info.is-disabled:focus, .el-button--info.is-disabled:active{
    background: $disabled;
  }
  .el-button--primary{
    background: $blue
  }
  .el-button--medium.is-circle{
    position: relative;
    padding: 0;
    width: 36px;
    height: 36px;
    line-height: 36px;
    display: flex;
    justify-content: center;
    .icon{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      margin: 0;
      font-size: 12px;
    }
  }
}
.form-body::-webkit-scrollbar {
  width: 6px;
  height: 4px;
  background: #fff;
}
.form-body::-webkit-scrollbar-button {
  display: none;
}
.form-body::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #d3d5e5;
}
.form-body::-webkit-scrollbar-track {
  border-radius: 10px;
  background: #fff;
}
.form-body {
  height: 600px;
  overflow-y: scroll;
  margin-top: 8px;
}
</style>
