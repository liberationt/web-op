<!--
 * @Date: 2020-04-20 19:22:54
 * @LastEditTime: 2020-07-01 19:29:00
 * @Description: 
 * @FilePath: \web-op\src\views\login\changePassword.vue
 -->
<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <div class="his-module">
        <el-form :model="userForm" ref="formValid" :rules="formValid" label-width="150px">
          <el-form-item :label="$t('changePassword.username')">
            <span>{{ userForm.username }}</span>
          </el-form-item>
          <el-form-item :label="$t('changePassword.name')">
            <span>{{ userForm.name }}</span>
          </el-form-item>
          <el-form-item :label="$t('changePassword.oldpw')" prop="oldpw">
            <el-input
              type="password"
              v-model="userForm.oldpw"
              :placeholder="$t('common.placeholder')"
              @keydown.enter.native="handleEnterPassWord"
            />
          </el-form-item>
          <el-form-item :label="$t('changePassword.newpw')" prop="pass">
            <el-input
              type="password"
              v-model="userForm.newpw"
              :placeholder="$t('common.placeholder')"
              @keydown.enter.native="handleEnterPassWord"
            />
          </el-form-item>

          <el-form-item :label="$t('changePassword.checkPass')" prop="checkPass">
            <el-input
              type="password"
              v-model="userForm.checkPass"
              :placeholder="$t('common.placeholder')"
              @keydown.enter.native="handleEnterPassWord"
            />
          </el-form-item>
          <div class="footer">
            <el-button size="large" @click="handleClose">{{ $t('common.close') }}</el-button>
            <el-button
              size="large"
              class="blue-gra"
              type="primary"
              @click="handleSave"
            >{{ $t('common.confirm') }}</el-button>
          </div>
        </el-form>
      </div>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { updataPassWord } from '@/api/his/user/changePassword'
import { Function } from 'lodash'
import { Form } from 'element-ui'
// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'changePassword',
  filters: {},
})
export default class extends Vue {
  // 声明变量，方法
  private btnAuth: string = 'router2-router1-key02'
  private userForm = {
    username: '',
    name: '',
    newpw: '',
    oldpw: '',
    checkPass: '',
  }

  // 监听方法
  @Watch('')
  // 生命周期
  mounted() {
    //原有逻辑
    // let userInfo = JSON.parse(localStorage.getItem('userInfo') as string)
    // this.userForm.username = userInfo.username
    // this.userForm.name = userInfo.name
    let userInfo = JSON.parse(localStorage.getItem('userInfo') as string) || JSON.parse(localStorage.getItem('userInfos') as string) || {username:'',name:''}
    this.userForm.username = userInfo.username || ""
    this.userForm.name = userInfo.name || ""
  }

  //关闭界面
  private handleClose() {
    //原有的返回 不能生效 因为加了是否需要登录的验证 所以只能走重定向
    // this.$router.go(-1)
    this.$router.push("/")
  }
  //更新密码
  private handleSave() {
    ;(this.$refs.formValid as Form).validate((valid: any) => {
      if (valid) {
        updataPassWord(this.userForm).then((res: any) => {
          this.$notify({
            title: this.$t('common.editSuc').toString(),
            message: '',
            type: 'success',
          })
        })
      } else {
      }
    })
  }
  private validateoldpw = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请输入旧密码'))
    } else {
      if (this.userForm.oldpw !== '') {
        ;(this.$refs.formValid as Form).validateField('pass')
      }
      callback()
    }
  }

  private validatePass = (rule: any, value: any, callback: any) => {
    if (this.userForm.newpw === '') {
      callback(new Error('请输入新密码'))
    }
    if (this.userForm.oldpw === this.userForm.newpw) {
      callback(new Error('新密码与旧密码重复，请设置新密码！'))
    }
    var regLetter = /[A-Za-z]/
    var regNum = /[0-9]/
    var regTeShu = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？+-]")
    debugger
    var complex = 0
    if (regLetter.test(this.userForm.newpw)) {
      ++complex
    }
    if (regNum.test(this.userForm.newpw)) {
      ++complex
    }
    if (regTeShu.test(this.userForm.newpw)) {
      ++complex
    }
    if (this.userForm.newpw.length < 8 || complex < 3) {
      callback('密码最少8位，且必须包含字母、数字、字符!')
    }
    if (this.userForm.checkPass !== '') {
      ;(this.$refs.formValid as Form).validateField('checkPass')
    }
    callback()
  }

  private validatePass2 = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请再次输入新密码'))
    } else if (value !== this.userForm.newpw) {
      callback(new Error('两次输入密码不一致!'))
    } else {
      callback()
    }
  }
  private formValid = {
    oldpw: [{ validator: this.validateoldpw, trigger: 'blur' }],
    pass: [{ validator: this.validatePass, trigger: 'blur' }],
    checkPass: [{ validator: this.validatePass2, trigger: 'blur' }],
  }
}
</script>

<style lang="scss" scoped>
.content .his-module .el-form {
  margin: 60px auto;
  padding: 0 62px;
  width: 50%;
}

.footer {
  position: relative;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 0 0 !important;
  height: 60px;
  text-align: center;
  background: #fff;
  .el-button {
    margin: 30px 18px;
    padding: 0;
    width: 128px;
    height: 36px;
    line-height: 36px;
    display: inline-block;
  }
}
</style>
