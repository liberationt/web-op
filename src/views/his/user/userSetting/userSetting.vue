<!--
 * @Date: 2020-04-16 11:12:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-27 20:56:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-20 19:03:15
 * @description: 用户设置
 -->

<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col :span="16" class="ht">
        <div class="his-module">
          <user-list v-model="userForm" @add="clickAdd" ref="userList"></user-list>
        </div>
      </el-col>
      <el-col :span="8" class="ht">
        <div class="his-module">
          <div slot="header" class="row">
            <div class="label">
              <h1 class="title">{{$t('common.add')}}</h1>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                class="green-gra"
                icon="icon his-save"
                @click="handleSave"
              >{{$t('common.save')}}</el-button>
            </div>
          </div>
          <el-form :model="userForm" ref="formData" :rules="formValid" label-width="90px">
            <!-- 姓名 -->
            <el-form-item :label="$t('userSet.empName')" prop="personId">
              <el-select
                v-model="userForm.personId"
                :placeholder="$t('userSet.phEmpName')"
                filterable
                remote
                :remote-method="remoteMethod"
                :loading="loading"
                class="empName"
              >
                <el-option
                  v-for="item in options"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }} ({{item.empNo}})</el-option>
              </el-select>
            </el-form-item>

            <!-- 工号 -->
            <el-form-item :label="$t('userSet.empNo')" prop="empNo">
              <el-input
                v-model="userForm.empNo"
                disabled
                :placeholder="$t('userSet.phEmpNo')"
              />
            </el-form-item>
            
            <el-form-item :label="$t('userSet.empDept')">
              <search-select
                table-name="SYS_DICT_CONFIG"
                kid="4"
                v-model="userForm.deptId"
                :placeholder="$t('userSet.phEmpDept')"
                :backfillValue="userForm.deptId"
                disabled
              />
            </el-form-item>
            <el-form-item :label="$t('userSet.signInAcc')" prop="loginName">
              <el-input
                ref="userName"
                v-model="userForm.loginName"
                :placeholder="$t('userSet.phSignInAcc')"
                @keydown.enter.native="handleEnterUserName"
                disabled
              />
            </el-form-item>
            <el-form-item :label="$t('userSet.signInPwd')" prop="userPwd">
              <el-input
                ref="userPwd"
                v-model="userForm.userPwd"
                :placeholder="$t('userSet.phSignInPwd')"
                @keydown.enter.native="handleEnterPassWord"
                disabled
              />
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import userList from './components/userList.vue'
import jobAuthority from './components/jobAuthority.vue'
import { findKeys, deepCopy } from '@/utils'
import {
  queryUserList,
  querySysgroupList,
  addUser,
  unSetUserList,
} from '@/api/his/user/sysUser.ts'
import { log } from 'util'

@Component({
  name: 'userSetting',
  filters: {},
  components: {
    userList,
    jobAuthority,
  },
})
export default class extends Vue {
  //声明变量，方法
  private list: any = []
  private userLists: any = [] //未设置登录员工的列表

  private title: string = ''
  private loading: boolean = false
  private formValid: any = {
    personId: [
      { required: true, message: window.ele.$i18n.t('userSet.vdEmpName') },
    ],
  }
  private unUserList: any = []
  private options: any = []
  private userForm: any = {
    deptId: '',
    personId: '',
    loginName: '',
    password: '',
    personName: '',
    userName: '',
  }
  private isAdded: boolean = false // 是否点击了新增按钮
  //初始化的周期函数
  mounted() {
    unSetUserList({}).then((res: any) => {
      res.data.forEach((element: any) => {
        element.label = element.personname
      })
      this.unUserList = res.data
    })
  }

  @Watch('userForm', { immediate: true, deep: true })
  private userFormChange(val: any) {
    console.log('监听了111');
    console.log(val);
    if (val.personId!=null) {
      console.log('watched');
      this.unUserList.forEach((element: any) => {
        if (element.personid == val.personId) {
          // val = element
          if (!element.personCode || true) {
            val.loginName = element.pycode + element.rybh
            val.userPwd = element.pycode + element.rybh
          } else {
            val.loginName = element.pyCode + element.personCode
            val.userPwd = element.pyCode + element.personCode
          }
          val.userName = element.personname
          val.empNo = element.rybh
          val.deptId = element.officecode
        }
      })
    }
  }

  /**
   * @LastEditors: zhml
   * @Description: 五笔拼音搜索用户姓名
   * @param {type} params
   * @return:
   */
  private async remoteMethod(query: string) {
    if (!query) {
      query = ''
    }
    const { data } = await unSetUserList({ quertStr: query })
    this.options = []
    data.map((item: any) => {
      this.options.push({
        value: item.personid,
        label: item.personname,
        empNo: item.rybh
      })
      return this.options.filter((element: any) => {
        if (element.label.toLowerCase().indexOf(query.toLowerCase()) > -1) {
          return element.label
        }
      })
    })
    console.log('unuserlist');
    console.log(this.options);
  }

  // 获取已勾选的岗位菜单
  private queryUsedJobList() {}
  private handleSave() {
    // this.userForm
    const formData: any = this.$refs.formData
    formData.validate((valid: any) => {
      if (valid) {
        addUser(this.userForm).then((res: any) => {
          this.$notify({
            title: this.$t('userSet.addSuc').toString(),
            type: 'success',
            message: '',
          })
          // this.getJobList()
          // this.isAdded = false
          formData.resetFields()
          const userList: any = this.$refs.userList
          userList.getList()
        })
      }
    })
  }

  private handleEnterLoginName() {
    this.$nextTick(() => {
      console.log('下一步')
      ;(this.$refs['userName'] as any).focus()
    })
  }
  private handleEnterUserName() {
    this.$nextTick(() => {
      console.log('下一步')
      ;(this.$refs['deptId'] as any).focus()
    })
  }
  private handleEnterDeptId() {
    this.$nextTick(() => {
      console.log('下一步')
      ;(this.$refs['personId'] as any).focus()
    })
  }
  private handleEnterPassWord() {
    this.$nextTick(() => {
      console.log('下一步')
      ;(this.$refs['password'] as any).focus()
    })
  }

  private clickAdd() {
    this.isAdded = true
  }
}
</script>

<style lang="scss" scoped>
.ht {
  height: 100%;
}
.main {
  .query-list {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    .title {
      width: 80px;
      margin-right: 16px;
      color: $first;
    }
  }
}
.el-select {
  width: 100%;
}
.el-select {
  width: 100%;
}

.search-select {
  width: 100%;
  ::v-deep .el-select {
    width: 100%;
    .el-input__inner {
      width: 100% !important;
    }
  }
}
.empName {
  ::v-deep .el-input__inner {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.el-form{
  padding: 0 30px!important;
}
</style>
