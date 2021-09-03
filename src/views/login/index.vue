<template>
  <div class="login-container">
    <el-row>
      <el-col :span="12">
        <div class="hospital-info">
          <div class="hopspital-txt">
            <img class="logo" :src="hospital.logo" />
            <div class="hopspital-txt">
              <span>{{ hospital.title }}</span>
            </div>
          </div>
          <div class="hopspital-img">
            <img :src="hospital.mainImg" alt />
            <img v-for="(item, index) in hospital.imgList" :key="index" :src="item.imgUrl" />
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="login-box">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
            <!-- 用户名 -->
            <el-form-item prop="username">
              <div class="el-form-item_box">
                <span class="svg-container">
                  <i class="icon his-username"></i>
                </span>
                <el-input ref="username" v-model="loginForm.username" :placeholder="$t('login.username')" name="username" type="text" tabindex="1" autocomplete="on" @keydown.enter.native="handleEnterUsername" @blur="handleEnterUsername" style="width: 100%" />
              </div>
              <el-button class="authentication">CA</el-button>
              <el-button class="fingerprint">
                <i class="icon his-finger-print"></i>
              </el-button>
            </el-form-item>
            <!-- 姓名 -->
            <el-form-item prop="name">
              <div class="el-form-item_box">
                <span class="svg-container">
                  <i class="icon his-name"></i>
                </span>
                <el-input ref="name" v-model="loginForm.name" :placeholder="$t('login.name')" name="name" readonly type="text" tabindex="1" autocomplete="on" @keydown.enter.native="handleEnterName" @blur="handleEnterName" />
              </div>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
              <div class="el-form-item_box">
                <span class="svg-container">
                  <i class="icon his-password"></i>
                </span>
                <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" :placeholder="$t('login.password')" name="password" tabindex="2" autocomplete="on" @keydown.enter.native="handleEnterPassword" @blur="handleEnterPassword" />
              </div>
            </el-form-item>
            <!-- 机构 -->
            <el-form-item prop="org">
              <div class="el-form-item_box">
                <span class="svg-container">
                  <i class="icon his-org"></i>
                </span>
                <el-select ref="hospital" filterable v-model="loginForm.hospitalId" :placeholder="$t('login.org')" @change="handleSelectOrg()">
                  <el-option v-for="item in orgList" :key="item.hospitalId" :label="item.hospitalName" :value="item.hospitalId"></el-option>
                </el-select>
              </div>
            </el-form-item>
            <!-- 身份 -->
            <el-form-item prop="identity">
              <div class="el-form-item_box">
                <span class="svg-container">
                  <i class="icon his-identity"></i>
                </span>
                <el-select ref="group" filterable v-model="loginForm.groupId" :placeholder="$t('login.identity')" @change="handleSelectGroup()">
                  <el-option v-for="item in identityList" :key="item.groupId" :label="item.groupName" :value="item.groupId"></el-option>
                </el-select>
              </div>
            </el-form-item>
            <!-- 记住密码 -->
            <div class="remember-password">
              <el-checkbox ref="pswsel" checked v-model="loginForm.isRemember">记住密码</el-checkbox>
            </div>
            <div class="btn">
              <!-- 登录 -->
              <el-button ref="login" class="blue-gra" :loading="loading" type="primary" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>
              <!-- 重置 -->
              <el-button class="green-gra" :loading="loading" type="primary" @click.native.prevent="handleReset">{{ $t('login.reset') }}</el-button>
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <p class="copyright">版权所有:蓝宙信息科技有限公司</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form as ElForm, Input, Form, Select, Button } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { Iobj, group, user, isResetPassword, checkLogin } from '@/api/users'
import { log } from 'util'
import { getToken, removeToken } from '@/utils/cookies'
import { getNewDict } from '@/websql/functions'
import { routerGo } from '@/utils/utils.ts'
import { getUserIP } from "@/utils/getIp"
@Component({
  name: 'Login',
})
export default class extends Vue {
  private hospital: object = {
    logo: require('@/assets/login-img/logo.png'),
    title: '上海天佑医院智慧医疗信息管理平台',
    mainImg: require('@/assets/login-img/main.png'), // 医院主图
    imgList: [
      {
        imgUrl: require('@/assets/login-img/1.png'),
      },
      {
        imgUrl: require('@/assets/login-img/2.png'),
      },
      {
        imgUrl: require('@/assets/login-img/3.png'),
      },
    ],
  }
  private restaurants: any[] = []
  private loginForm: Iobj = {
    username: '',
    name: '',
    password: '',
    hospitalId: null,
    groupId: null,
    isRemember: false,
    userId: null,
  }
  private orgList: any[] = [] // 机构列表
  private identityList: any[] = [] // 身份列表
  private loginRules = {
    username: [{ required: true, message: window.ele.$i18n.t('login.username'), trigger: 'change' }],
    name: [{ required: true, message: window.ele.$i18n.t('login.name'), trigger: 'blur' }],
    password: [{ required: true, message: window.ele.$i18n.t('login.password'), trigger: 'blur' }],
    hospitalId: [{ required: true, message: window.ele.$i18n.t('login.org'), trigger: 'change' }],
    groupId: [{ required: true, message: window.ele.$i18n.t('login.identity'), trigger: 'change' }],
  }
  private passwordType = 'password'
  private loading = false
  private showDialog = false
  private redirect?: string
  private otherQuery: Dictionary<string> = {}

  // @Watch('$route', { immediate: true })
  // private onRouteChange(route: Route) {
  //   const query = route.query as Dictionary<string>
  //   if (query) {
  //     if (query.redirect == '/LoadingData') query.redirect = '/dashboard' // 避免被动触发加载页的跳转
  //     this.redirect = query.redirect
  //     this.otherQuery = this.getOtherQuery(query)
  //   }
  // }
  private test(ip:any){
    localStorage.setItem('ipInfo',ip)
  }
  created(){
    if(!localStorage.getItem('ipInfo')){
      getUserIP(this.test)
    }
  }
  mounted() {
    // 获取登录信息
    const userInfo = JSON.parse(localStorage.getItem('userInfo') as string)
    // 获取机构列表 身份列表
    this.orgList = JSON.parse(localStorage.getItem('orgList') as string)
    this.identityList = JSON.parse(localStorage.getItem('identityList') as string)
    if (userInfo) {
      // 判断是否记住密码
      if (userInfo.isRemember != null && userInfo.isRemember) {
        this.loginForm = Object.assign({}, userInfo)
        // 通过缓存获取username、password
        let Iobj = {
          username: userInfo.username,
          password: userInfo.password,
        }
        // 重新获取token
        UserModule.Login(Iobj)
      } else {
        this.loginForm.isRemember = false
        localStorage.removeItem('userInfo')
        localStorage.removeItem('orgList')
        localStorage.removeItem('identityList')
        ;(this.$refs.username as Input).focus()
      }
    } else {
      localStorage.removeItem('orgList')
      localStorage.removeItem('identityList')
      ;(this.$refs.username as Input).focus()
      this.loginForm.isRemember = false
    }
  }

  private showPwd() {
    this.passwordType = this.passwordType == 'password' ? '' : 'password'
    this.$nextTick(() => {
      ;(this.$refs.password as Input).focus()
    })
  }

  // 用户名按Enter键回车获取用户姓名
  private handleEnterUsername() {
    let username: string | undefined = this.loginForm.username ? this.loginForm.username.toUpperCase() : this.loginForm.username
    this.loginForm.username = this.loginForm.username ? this.loginForm.username.toUpperCase() : this.loginForm.username
    if (username == '') {
      this.$notify({
        title: '账号不能为空',
        message: '',
        type: 'warning',
      })
      return false
    }
    UserModule.User({ username }).then((res: any) => {
      if (res) {
        this.loginForm.name = res.userName
        this.loginForm.userId = res.userId
      }
    })
    this.$nextTick(() => {
      ;(this.$refs.password as Input).focus()
    })
  }

  // 姓名按Enter键回车
  handleEnterName() {
    this.$nextTick(() => {
      ;(this.$refs.password as Input).focus()
    })
  }

  // 密码按Enter键回车获取机构列表
  private handleEnterPassword() {
    let username = this.loginForm.username
    let name = this.loginForm.name
    let password = this.loginForm.password
    // 判断密码不为空
    if (username == '') {
      // 判断账号为空警告
      this.$notify({
        title: '账号不能为空',
        message: '',
        type: 'warning',
      })
      return false
    }
    if (name == '') {
      // 判断姓名为空警告
      this.$notify({
        title: '姓名不能为空',
        message: '',
        type: 'warning',
      })
      return false
    }
    if (password == '') {
      // 判断账号为空警告
      this.$notify({
        title: '密码不能为空',
        message: '',
        type: 'warning',
      })
      return false
    }
    // 获取机构列表
    UserModule.Login(this.loginForm).then((res: any) => {
      console.log('res: ', res)
      if (res.hospitas) {
        this.orgList = res.hospitas
        if (this.orgList instanceof Array && this.orgList.length == 1) {
          // if (this.orgList.length > 0) {
          this.loginForm.hospitalId = this.orgList[0].hospitalId
          // 获取身份列表
          UserModule.Group({ hospitalId: this.loginForm.hospitalId } as any).then((res: any) => {
            if (res) {
              this.identityList = res
              if (this.identityList instanceof Array && this.identityList.length == 1) {
                // if (this.identityList.length > 0) {
                this.loginForm.groupId = this.identityList[0].groupId
                this.$nextTick(() => {
                  this.handleLogin()
                })
              } else {
                this.$nextTick(() => {
                  // 聚焦身份下拉框
                  ;(this.$refs.group as Select).focus()
                })
              }
            }
          })
        } else {
          // 机构列表大于1条数
          this.$nextTick(() => {
            // 聚焦机构下拉框
            ;(this.$refs.hospital as Select).focus()
          })
        }
      }
    })
  }

  // 选择机构获取身份列表
  private handleSelectOrg(val: any) {
    UserModule.Group({ hospitalId: val }).then((res: any) => {
      if (res) {
        this.identityList = res
        this.$nextTick(() => {
          ;(this.$refs.group as Select).focus()
        })
      }
    })
  }

  private handleSelectGroup() {
    this.$nextTick(() => {
      this.handleLogin()
    })
  }

  // 登录
  private handleLogin() {
    const _that = this
    if (!_that.$refs.loginForm) return false
    ;(_that.$refs.loginForm as ElForm).validate((valid: boolean) => {
      if (valid) {
        _that.loading = true
        UserModule.Submit(_that.loginForm).then((res: any) => {
          let orgList = _that.orgList // 机构列表
          let identityList = _that.identityList // 身份列表
          let hospitalName = '' // 机构名称
          // 遍历机构列表通过hospitalId获取机构名称
          hospitalName = orgList.find((val) => {
            return val.hospitalId == _that.loginForm.hospitalId
          }).hospitalName
          // debugger
          let identityName = '' // 身份名称
          // 遍历身份列表通过groupId获取身份名称
          identityName = identityList.find((val) => {
            return val.groupId == _that.loginForm.groupId
          }).groupName
          let identityCode = '' // 角色代码
          identityCode = identityList.find((val) => {
            return val.groupId == _that.loginForm.groupId
          }).groupCode
          let userInfo: any = Object.assign({}, _that.loginForm)
          userInfo.hospitalName = hospitalName
          userInfo.identityName = identityName
          userInfo.identityCode = identityCode
          userInfo.changPasswd = res.changPasswd
          // 缓存科室
          userInfo.deptId = res.deptId
          localStorage.setItem('userInfo', JSON.stringify(userInfo)) // 缓存登录信息
          localStorage.setItem('loginBizsn', '') // 缓存登录信息
          // 记住密码
          if (_that.loginForm.isRemember) {
            localStorage.setItem('orgList', JSON.stringify(orgList)) // 缓存是否记机构信息
            localStorage.setItem('identityList', JSON.stringify(identityList)) // 缓存是否记住角色信息
          }
          if (res.changPasswd == 1) {
            const token: any = getToken()
            localStorage.setItem('token', token)
            _that.$router.push({ path: 'LoadingData' }).catch((err) => {})
          } else {
            Vue.prototype.$db.transaction(async (tx: any) => {
              await queryTable(tx) // 查询完成
              // _that.$router
              //   .push({
              //     // 正常跳转首页
              //     path: '/dashboard'
              //   })
              //   .catch((err) => {
              //     console.log(err)
              //   })
              // window?.location?.reload?.();
              //判断是否需要修改密码 逻辑不通 先注销
              await checkLogin().then((res: any) => {
                if (res.errorCode == 'SUCCESS') {
                  // data==true  修改密码
                  if (res.data) {
                    // _that.$router.push("/changePassword").catch((err) => {
                    //   console.log(err)
                    // })
                    routerGo('/system/changePassword', '')
                  } else {
                    _that.$router
                      .push({
                        // 正常跳转首页
                        path: '/dashboard',
                      })
                      .catch((err) => {
                        console.log(err)
                      })
                  }
                }
              })
            })
            async function queryTable(tx: any) {
              let webSqlCtrl: boolean = false //websql是否需要重新加载
              let webSqlCount: number = 0 //websql循环完成次数
              for (let i = 0; i < Vue.prototype.tableList.length; i++) {
                await tx.executeSql(
                  'SELECT * FROM ' + Vue.prototype.tableList[i],
                  [],
                  function (tx: any, results: any) {
                    // window?.location?.reload?.()
                    webSqlCount++
                    if (webSqlCount >= Vue.prototype.tableList.length - 1) {
                      _that.loading = false
                      getNewDict()
                      if (webSqlCtrl) {
                        _that.$router.push({ path: 'LoadingData' }).catch((err) => {})
                      } else {
                        window?.location?.reload?.()
                      }
                    }
                  },
                  function (tx: any, err: any) {
                    webSqlCtrl = true
                    webSqlCount++
                    if (webSqlCount >= Vue.prototype.tableList.length - 1) {
                      _that.loading = false
                      getNewDict()
                      if (webSqlCtrl) {
                        _that.$router.push({ path: 'LoadingData' }).catch((err) => {})
                      } else {
                        window?.location?.reload?.()
                      }
                    }
                    // console.log(Vue.prototype.tableList[i] + '查询失败: ' + err.message) // 发现不存在的表 跳转添加表数据
                    // _that.$router.push({ path: 'LoadingData' }).catch((err) => {})
                  }
                )
              }
            }
          }
        })
        // setTimeout(() => {
        //   this.loading = false
        //   getNewDict()
        // }, 0.5 * 1000)
      } else {
        return false
      }
    })
  }
  // 重置
  private handleReset() {
    this.loginForm = {
      username: '',
      name: '',
      password: '',
      hospitalId: null,
      groupId: null,
      isRemember: false,
    }
    localStorage.removeItem('userInfo')
    localStorage.removeItem('orgList')
    localStorage.removeItem('identityList')
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as Dictionary<string>)
  }
  private querySearch(queryString: any, cb: any) {
    var restaurants = this.restaurants
    var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
    // 调用 callback 返回建议列表的数据
    cb(results)
  }
  private createFilter(queryString: any) {
    return (restaurant: any) => {
      return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    }
  }
  private loadAll() {
    return [
      // { "value": "00385" }
    ]
  }
  // 选择
  private handleSelect(item: any) {
    console.log(item)
  }
  private handleIconClick(ev: any) {
    console.log(ev)
  }
}
</script>

<style lang="scss">
@import 'login.scss';
</style>
