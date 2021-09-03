<template>
  <div class="table-list">
    <pagenation-list
      ref="pageTable"
      data-url="/system-service/sysuser/queryPage"
      v-model="list"
      stripe
      :searchData="searchData"
      :list-height="listSlotHeight"
      http-method="post"
    >
      <div slot="header" class="row">
        <div class="label">
          <h1 class="title" style="flex: 1;">{{$t('userSet.title1')}}</h1>
          <el-input
            v-model="searchData.userName"
            :placeholder="$t('userSet.phSearch')"
            @change="queryUser"
          >
            <i class="el-input__icon icon his-search" slot="prefix" />
          </el-input>
        </div>
        <div class="operate">
          <!-- <el-button
            type="primary"
            class="blue-gra"
            icon="icon his-add"
            @click="handleAdd"
          >{{$t('common.add')}}</el-button> -->
        </div>
      </div>
      <el-table
        stripe
        :data="tableFormat"
        slot="list"
        :height="listSlotHeight"
        class="scroll-bar"
        border
        highlight-current-row
      >
        <!-- 序号 -->
        <el-table-column prop="webSortNumber" :label="$t('common.serialNum')" width="60"></el-table-column>
        <!-- 登录账号 -->
        <el-table-column prop="loginName" :label="$t('userSet.signInAcc')"></el-table-column>
        <!-- 职工工号 -->
        <el-table-column prop="empNo" :label="$t('userSet.empNo')"></el-table-column>
        <!-- 用户姓名 -->
        <el-table-column prop="userName" :label="$t('userSet.userName')"></el-table-column>
        <!-- 所属科室 -->
        <el-table-column prop="deptName" :label="$t('userSet.empDept')"></el-table-column>
        <!-- 状态，0正常，1锁定 -->
        <el-table-column :label="$t('common.status')" width="80">
          <template slot-scope="scope">
            <span
              :class="scope.row.lockFlag=='0'?'blues':'reds'"
            >{{ scope.row.lockFlag=='0'?$t('userSet.unlock'):$t('userSet.lock') }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('common.action')" align="center"  width="100">
          <template slot-scope="scope">
            <!-- 锁定 -->
            <el-tooltip :content="$t('userSet.lock')" v-if="scope.row.lockFlag == '0'" effect="light">
              <el-button class="red" @click="handleLock(scope.row)">
                <i class="icon his-lock single" />
              </el-button>
            </el-tooltip>
            <!-- 解锁 -->
            <el-tooltip :content="$t('userSet.unlock')" v-if="scope.row.lockFlag == '1'" effect="light">
              <el-button class="blue" @click="handleUnLock(scope.row)">
                <i class="icon his-unlock" />
              </el-button>
            </el-tooltip>
            <!-- 重置密码 -->
            <el-tooltip :content="$t('userSet.reset')" effect="light">
              <el-button class="blue" @click="handleReset(scope.row)">
                <i class="icon his-reset" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </pagenation-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  queryUserList,
  querySysgroupList,
  addUser,
  unSetUserList,
  resetPassword,
  lockUserAccount,
  unLockUserAccount,
} from '@/api/his/user/sysUser.ts'
import { log } from 'util'
import { getTableData, dictExecuteSql } from '@/websql/functions'
import { id2Name } from '@/utils'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'userList',
  filters: {},
})
export default class extends Vue {
  @Prop({ required: false }) private value!: any
  get userForm() {
    return this.value
  }
  set userForm(val: any) {
    this.$emit('input', val)
  }
  private list: any = []
  private queryParam: any = {
    userName: '',
  }
  private searchData: object = {
    pageNum: 1,
    pageSize: 10,
    userName: '',
  }
  private listSlotHeight: number = 0
  private deptList: any[] = [] // 科室列表

  //计算表格数据
  get tableFormat() {
    return id2Name(this.list, 'deptId', 'deptName', this.deptList, 'dv', 'dn')
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 114
  }
  //初始化的周期函数
  mounted() {
    const _that = this
    getTableData(
      'SYS_DICT_CONFIG',
      '4',
      "select dv,dn from SYS_DICT_CONFIG_VALUE where dk='4'",
      function (data: any) {
        _that.deptList = data
        _that.getList()
      }
    )
  }

  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private queryUser() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

  // 重置密码
  private handleReset(val: any) {
    resetPassword({ loginName: val.loginName, userId: val.userId }).then(() => {
      this.$notify({
        title: this.$t('userSet.resetSuc').toString(),
        type: 'success',
        message: '',
      })
    })
  }
  private handleAdd() {
    // this.userForm = {}
    this.$emit('add')
  }

  // 锁定
  private handleLock(val: any) {
    lockUserAccount({ userId: val.userId }).then(() => {
      this.$notify({
        title: this.$t('userSet.lockSuc').toString(),
        type: 'success',
        message: '',
      })
      this.getList()
    })
    /**
     * @LastEditors: zhml
     * @Description: 解锁用户账户
     * @param {type} params
     * @return:
     */
  }

  // 解锁
  private handleUnLock(val: any) {
    unLockUserAccount({ userId: val.userId }).then(() => {
      this.$notify({
        title: this.$t('userSet.unlockSuc').toString(),
        type: 'success',
        message: '',
      })
      this.getList()
    })
  }
  private handleForget(index: number) {}
}
</script>

<style lang="scss" scoped>
.single {
  font-size: 15px;
}
</style>
