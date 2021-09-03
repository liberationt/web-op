<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <div class="icons-wrap">
          <!-- 全屏 -->
          <el-tooltip :content="$t('common.fullScreen')" placement="bottom" effect="light">
            <div class="screen-full-wrap">
              <screenfull class="screen-full"></screenfull>
              <!-- <i class="icon his-full-screen"></i> -->
            </div>
          </el-tooltip>

          <!-- 字典初始化 -->
          <el-tooltip :content="$t('common.resetDict')" placement="bottom" effect="light">
            <i class="icon his-init" @click="webSqlReset"></i>
          </el-tooltip>

          <!-- 切换语言 -->
          <el-tooltip :content="$t('common.language')" placement="bottom" effect="light">
            <el-dropdown trigger="click" hide-on-click placement="bottom" @command="handleSetLanguage">
              <div>
                <i class="icon" :class="'his-' + language"></i>
                <!-- <span>{{ language }}</span> -->
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in langList" :key="item.value" :disabled="language === item.value" :command="item">{{ item.language }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tooltip>
        </div>
      </template>
      <!-- 业务切换 -->

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" hide-on-click ref="bussinessDropDown" v-if="!isEmptyAuthList">
        <div class="avatar-wrapper">
          <img src="@/assets/main-img/keshiqiehuan@2x.png" class="user-avatar" />
          <span>{{ userAuthority.showname }}</span>
          <i class="el-icon-caret-bottom" />
        </div>

        <el-dropdown-menu slot="dropdown" class="api layout-navbar-dropdown scroll-bar hischangerole">
          <!-- 循环读取 -->
          <div class="item-main">
            <template v-for="item in businessList">
              <div :class="item.queryid == userAuthority.queryid ? 'item-block-select' : 'item-block'" :key="item.showname" @click="handleSelectBusiness(item)">
                <div class="item-img">
                  <!-- <i class="icon his-qutpatient-infusion"></i> -->
                  <i class="icon his-menu_guahao" style="font-size: 26px"></i>
                </div>
                <div class="item-text">
                  <span>{{ item.showname }}</span>
                </div>
              </div>
            </template>
          </div>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 角色切换 -->
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" hide-on-click>
        <div class="avatar-wrapper">
          <img src="@/assets/main-img/jueseqiehuan@2x.png" class="user-avatar" />
          <span>{{ userInfo.identityName }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="api layout-navbar-dropdown scroll-bar">
          <!-- 循环读取 -->
          <div class="item-main">
            <template v-for="item in stationList">
              <div :class="item.groupId == selectUserData.groupId ? 'item-block-select' : 'item-block'" :key="item.groupName" @click="handleChange(item)">
                <div class="item-img">
                  <!-- <i class="icon his-qutpatient-infusion"></i> -->
                  <i :class="'icon' + ' ' + `${item.icon}`" style="font-size: 26px"></i>
                </div>
                <div class="item-text">
                  <span>{{ item.groupName }}</span>
                </div>
              </div>
            </template>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img src="@/assets/main-img/morentouxiang.png" class="user-avatar" />
          <span>{{ userInfo.name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>{{ $t('navbar.dashboard') }}</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="changePassword">
            <span style="display: block">{{ $t('navbar.changePassword') }}</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- <el-dialog
      title="二维码展示"
      :visible.sync="certificateVisible"
      width="300px"
      :modal-append-to-body = true
      :before-close="handleClose">
      <div class="certificateClass">
        <img :src="imgURL" width="280px" height="280px" alt="">
        <span style="text-align: center;display:block;">{{bizsntext}}</span>
      </div>
    </el-dialog> -->
    <!-- <div class="outDoor" v-if="certificateVisible"  :height='listSlotHeight'>
      <div class="certificateClass">
        <span style="display:block;" class="outdoorText">二维码展示</span>
        <img :src="imgURL" width="280px" height="280px" alt="">
        <span style="text-align: center;display:block;" class="outdoorTextTwo">{{bizsntext==""?'请扫码':bizsntext}}</span>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject, Prop ,Watch} from 'vue-property-decorator'
import { clearDBtable } from '@/websql/functions'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
// import ErrorLog from '@/components/ErrorLog/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
// import HeaderSearch from '@/components/HeaderSearch/index.vue'
import LangSelect from '@/components/LangSelect/index.vue'
import Screenfull from '@/components/Screenfull/index.vue'
// import SizeSelect from '@/components/SizeSelect/index.vue'
import { TagsViewModule } from '@/store/modules/tags-view'
import { getEasemobUser , getTwoCode, watchCode} from '@/api/users'
import './index.scss'
import { langList } from '@/utils/dic.ts'
import { user, group } from '../../../api/users'
import { log } from 'util'
import { watch } from 'fs'

@Component({
  name: 'Navbar',
  components: {
    Breadcrumb,
    // ErrorLog,
    Hamburger,
    // HeaderSearch,
    LangSelect,
    Screenfull,
    // SizeSelect
  },
})
export default class extends Vue {
  private userInfo = {
    name: '',
    hospitalId: 0,
    identityName: '',
    groupId: 0,
  }

  //业务权限
  private userAuthority = {
    queryid: 0,
    showname: '',
    groupId: 0,
  }
  //选中的角色数据
  private selectUserData = {
    groupId: 0,
    groupName: '',
    icon: '',
  }

  private language: string = AppModule.language
  private language_name: string = ''
  private stationList = []
  private businessList = [] //业务列表
  private isEmptyAuthList: boolean = true //true隐藏/false显示业务权限
  private langList: any[] = langList // 语言列表
  /* private certificateVisible: boolean = false
  private bizsn: any = ''
  private imgURL: any = ''
  private bizsnList: any = []
  private bizsntext: any = ''
  private listSlotHeight: number = 0 */
  @Inject('reload')
  reload!: any

  get sidebar() {
    return AppModule.sidebar
  }

  get device() {
    return AppModule.device.toString()
  }

  get avatar() {
    return UserModule.avatar
  }

  created() {
    /* this.listSlotHeight = Vue.prototype.PageHeight
    console.log('this.listSlotHeight: ', this.listSlotHeight); */
    this.handleSelectOrg()
    // console.log('this.language', this.language)
    this.initLanguage()
    this.initBusinessData()
    console.log('切换科室时是否重新调用此事件');

  }
  /* private timeId: any = ''
  private timeNumber:number = 0 */
  // @Watch('certificateVisible')
  // private onValue(val: any) {
  //   if(this.certificateVisible){
  //     // window.setInterval(() => {
  //     //   this.bizsnCallBack()
  //     // },1000)
  //     this.timeId = window.setInterval(() => {
  //       this.timeNumber++
  //       this.bizsnCallBack()
  //     },1000)
  //   } else {
  //     console.log("打印其他");
  //   }
  // }
  /* @Watch('timeNumber')
   private onTimeNumber(val: any) {
     if (val > 120) {
       clearInterval(this.timeId)
       this.timeNumber = 0
       console.log('this.timeNumber: ', this.timeNumber);
     }
   } */
  private webSqlReset() {
    const TableArr = ['TB_REGION', 'SYS_PRIMARY_DATA', 'SYS_FLAG_DATA', 'SYS_DICT_CONFIG', 'SYS_PRIMARY_DATA_VALUE', 'SYS_FLAG_DATA_VALUE', 'SYS_DICT_CONFIG_VALUE', 'GY_JBBM_VERSION', 'GY_JBBM']
    TableArr.forEach((element: any) => {
      clearDBtable(element)
    })
    this.$router.push({ path: 'LoadingData' }).catch((err) => {})
  }

  private toggleSideBar() {
    AppModule.ToggleSideBar(false)
  }

  private async logout() {
    await UserModule.LogOut()
    // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    this.$router.push('/login').catch((err) => {
      console.log(err)
    })
  }

  private changePassword() {
    this.$router.push('/changePassword')
  }

  /**
   * @LastEditors: zhml
   * @Description: 国际化切换语言
   * @param {type} params
   * @return:
   */

  private handleSetLanguage(command: any) {
    this.language = command.value
    this.language_name = command.language
    this.$i18n.locale = command.value
    const { fullPath } = this.$route
    this.reload()
    AppModule.SetLanguage(command.value)
    this.$store.dispatch('GenerateRoutes')
    this.$notify({
      title: this.$t('common.changeLanage').toString(),
      message: '',
      type: 'success',
    })
  }
  /**
   * @LastEditors: zhml
   * @Description: 通过 hospitalId 获取身份列表
   * @param {type} params
   * @return: stationList
   */
  private handleSelectOrg() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo') as string)
    if (this.userInfo) {
      UserModule.Group({ hospitalId: this.userInfo.hospitalId }).then((res: any) => {
        this.stationList = res
        this.stationList.forEach((item) => {
          if ((item as any).groupId == this.userInfo.groupId) {
            this.selectUserData.groupId = (item as any).groupId
            this.selectUserData.groupName = (item as any).groupName
            this.selectUserData.icon = (item as any).icon
          }
        })
      })
    }
  }
  /**
   * @LastEditors: zhml
   * @Description: 点击机构，切换机构并刷新页面
   * @param {type} params
   * @return:
   */
  private async handleChange(item: any) {
    let userInfo = JSON.parse(localStorage.getItem('userInfo') as string)
    let org = userInfo.hospitalId
    let identity = item.groupId
    const res = await UserModule.Submit({ hospitalId: org, groupId: identity })
    if (res) {
      let user = res
      ;(userInfo.groupId = res.groupId), (userInfo.identityName = item.groupName), localStorage.setItem('userInfo', JSON.stringify(userInfo))
      PermissionModule.GetRoutesName(res.groupId)
      this.$router.push({
        name: 'Dashboard',
      })
      TagsViewModule.delAllViews()
    }
    setTimeout(() => {
      location.reload()
    }, 300)
  }

  /**
   * @description:获取业务列表
   * @param {type}
   * @return:
   */
  private async initBusinessData() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo') as string)
    if (this.userInfo) {
      try {
        //获取业务权限列表
        const res = await UserModule.getAuthority({ groupId: this.userInfo.groupId })
        if (res) {
          this.businessList = res
          this.isEmptyAuthList = false //显示
          //获取选中的业务
          const res1 = await UserModule.getSelectJobRole({ groupId: this.userInfo.groupId })
          if (res1) {
            this.businessList.forEach(async (item) => {
              if ((item as any).queryid == res1) {
                this.userAuthority.queryid = (item as any).queryid
                this.userAuthority.showname = (item as any).showname
                Vue.prototype.AUTHORITY.jobRole = this.userInfo.groupId
                Vue.prototype.AUTHORITY.bussinessRole = (item as any).queryid
                Vue.prototype.AUTHORITY.qxmc = (item as any).showname

                // console.log("通知父组件去渲染下一个子组件")
                this.$emit('changeAuth')
                const res2 = await UserModule.getOneByEntity({ queryid: this.userAuthority.queryid })
                if (res2) {
                  Vue.prototype.AUTHORITY.outpatientCode = res2.mzks
                  Vue.prototype.AUTHORITY.kslb = res2.kslb
                  Vue.prototype.AUTHORITY.hlwks = res2.internet
                  if (res2.internet == '1') {
                    /* this.certificateVisible = true
                    getTwoCode({}).then((res: any) => {
                      this.imgURL = 'data:image/png;base64,'+res.data.qrcode
                      this.bizsn = res.data.bizSn
                    })
                    if(this.certificateVisible){
                        // window.setInterval(() => {
                        //   this.bizsnCallBack()
                        // },1000)
                        clearInterval(this.timeId)
                        this.timeId = window.setInterval(() => {
                          this.timeNumber++
                          this.bizsnCallBack()
                        },1000)
                      } else {
                        console.log("打印其他");
                        this.certificateVisible = false
                        clearInterval(this.timeId)
                        this.timeId = null
                        this.timeNumber = 0
                      } */
                    // getEasemobUser({}).then((res: any) => {})

                  }
                  // console.log(312, Vue.prototype.AUTHORITY.hlwks)
                }
              }
            })
          } else {
            // console.log("通知父组件去渲染下一个子组件")
            this.$emit('changeAuth')
          }
        } else {
          // console.log("通知父组件去渲染下一个子组件")
          this.$emit('changeAuth')
          this.isEmptyAuthList = true //隐藏
        }
      } catch (error) {
        // console.log("通知父组件去渲染下一个子组件")
        this.$emit('changeAuth')
      }
    }
    // 获取全局路径
    if (window.location.href) {
      Vue.prototype.AUTHORITY.qjym = window.location.protocol + '//' + window.location.host
      console.log('Vue.prototype.AUTHORITY.printUrl', Vue.prototype.AUTHORITY.printUrl)
    }
  }

  /**
   * @description: 切换业务
   * @param {type}
   * @return:
   */
  private async handleSelectBusiness(item: any) {
    let that = this
    let groupId = this.userInfo.groupId
    let queryid = item.queryid
    let showname = item.showname
    // that.bizsn = ''
    // that.imgURL = ''
    // clearInterval(that.timeId)
    // that.timeId = null
    const res = await UserModule.changeBid({
      queryid: queryid,
      showname: showname,
      groupId: groupId,
    })
    if (res) {
      if (that.businessList.length > 0) {
        if (JSON.stringify(that.businessList).indexOf(JSON.stringify(that.userInfo.groupId))) {
          that.userAuthority.groupId = that.userInfo.groupId
          that.userAuthority.queryid = item.queryid
          that.userAuthority.showname = item.showname
          Vue.prototype.AUTHORITY.jobRole = that.userInfo.groupId
          Vue.prototype.AUTHORITY.bussinessRole = item.queryid
          Vue.prototype.AUTHORITY.qxmc = item.showname
          UserModule.getOneByEntity({ queryid: that.userAuthority.queryid }).then((res: any) => {
            if (res) {
              Vue.prototype.AUTHORITY.outpatientCode = res.mzks
              Vue.prototype.AUTHORITY.kslb = res.kslb
              Vue.prototype.AUTHORITY.hlwks = res.internet
              console.log('res.internet: ', res.internet, "133456789");
              if (res.internet == '1') {
                /* console.log('res.internet: ', res.internet);
                that.certificateVisible = true
                that.bizsn = ''
                that.imgURL = ''
                clearInterval(that.timeId)
                that.timeId = null
                // getEasemobUser({}).then((res: any) => {})
                console.log('发送请求前');

                getTwoCode({}).then((res: any) => {
                  console.log('发送请求后');
                      that.imgURL = 'data:image/png;base64,'+res.data.qrcode
                      that.bizsn = res.data.bizSn
                    })
                if(that.certificateVisible){
                    // window.setInterval(() => {
                    //   this.bizsnCallBack()
                    // },1000)
                    that.timeId = window.setInterval(() => {
                      that.timeNumber++
                      console.log('this.timeNumber: ', this.timeNumber);
                      that.bizsnCallBack()
                    },1000)
                  } else {
                    console.log("打印其他");
                  } */
              } else {
                /* that.certificateVisible = false
                clearInterval(that.timeId)
                that.timeId = null
                that.timeNumber = 0 */
              }
              // console.log('切换科室的outpatientCode', Vue.prototype.AUTHORITY.outpatientCode)
            } else {
              Vue.prototype.AUTHORITY.outpatientCode = null
              Vue.prototype.AUTHORITY.kslb = null
              // console.log('未切换科室的outpatientCode', Vue.prototype.AUTHORITY.outpatientCode)
            }
            //隐藏药库权限弹窗
            AppModule.SetDialogInfo({ isShow: false, title: '', message: '' })
            that.$router.push({ name: 'Dashboard' }).catch((err) => {
              console.log(err)
            })
            //隐藏弹窗
            ;(that.$refs.bussinessDropDown as any).hide()
            TagsViewModule.delAllViews()
          })
        }
      }
    }
  }

  // 初始获取当前语言
  private initLanguage() {
    for (let i of this.langList) {
      if (this.language == i.value) {
        this.language_name = i.language
      }
    }
  }
  // 关闭弹框
  /* private handleClose () {
    this.certificateVisible = false
  } */
  /* private bizsnCallBack() {
    if(!this.bizsn){
      return
    }
    watchCode({bizSn: this.bizsn}).then((res: any) => {
      if(res.data.mkeyCode ==200) {
        setTimeout(() => {
          this.certificateVisible = false
          this.bizsnList = []
          this.bizsntext = '请扫码'
        },1000)
        clearInterval(this.timeId)
        this.timeNumber = 0
        }
      if(this.bizsnList.indexOf(res.data.mkeyMsg) == -1){
        this.bizsntext = res.data.mkeyMsg
        }
        console.log('this.timeNumber: ', this.timeNumber);
      this.bizsnList.push(res.data.mkeyMsg)
    })

  } */
}
</script>

<style lang="scss" scoped>
.el-dropdown-menu {
  padding: 0 !important;
}
.navbar {
  height: 34px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container {
    line-height: 34px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }
  .pic-guojihua {
    widows: 30px;
    height: 30px;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    margin-right: 16px;
    float: right;
    height: 100%;
    line-height: 34px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-left: 16px;

      .avatar-wrapper {
        height: 34px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        span {
          padding: 0 4px 0 6px;
        }

        .user-avatar {
          cursor: pointer;
          width: 24px;
          height: 24px;
          border-radius: 4px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          font-size: 12px;
        }
        span {
          padding: 0 6px;
        }
      }
    }
  }
}

.icons-wrap {
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding-right: 4px;
  vertical-align: top;
  border-right: 1px solid $border;
  > * {
    position: relative;
    margin: 0 12px 0;
    cursor: pointer;
  }
  ::v-deep .icon {
    display: inline-block;
    width: 24px;
    height: 24px;
    color: $blue;
    text-align: center;
    line-height: 24px;
    border-radius: 6px;
    background: rgba($color: $blue, $alpha: 0.1);
  }
  .screen-full-wrap {
    position: relative;
    line-height: 24px;
  }
  .el-dropdown {
    line-height: 24px;
  }
  .dot {
    position: absolute;
    top: 2px;
    right: -2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $light-red;
  }
}

.layout-navbar-dropdown {
  margin-top: 0px !important;
  ::v-deep .popper__arrow {
    display: none !important;
  }
}

.navbar-icon-blue {
  color: #1485ff;
}
::v-deep .el-dialog .el-dialog__body{
    padding: 10px !important;
}
/* .certificateClass {
  height: 340px;
}
.outDoor {
  position: fixed;
  margin-top: 34px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #323232;
  opacity: 0.8;
  z-index: 99;
  .certificateClass {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 100;
    transform: translate(-50%,-80%);
    background-color: #fff;
    .outdoorText {
      line-height: 25px;
      text-indent:10px;
      color: #000;
    }
    .outdoorTextTwo {
      line-height: 40px;
      height: 40px;
    }
  }
} */
</style>
<style lang="scss">
// 消息
.msg-tooltip.el-tooltip__popper {
  margin-top: 7px;
}

.msg-wrapper.el-popover {
  // max-height: 300px;
  margin-top: 6px;
  padding: 0;
}

.msg-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  margin: 0 10px;
  border-bottom: 1px solid $border;
  div {
    font-size: 16px;
    color: $first;
    span {
      margin-left: 6px;
      font-size: 14px;
      color: $second;
    }
  }
  .icon {
    font-size: 20px;
    color: $third;
  }
}
.msg-wrapper ul {
  max-height: 260px;
  li {
    position: relative;
    padding: 10px 10px 10px 30px;
    border-top: 1px solid $border;
    &:nth-child(1) {
      border: none;
    }
  }
  .msg-upper {
    margin-left: -8px;
    .module-title {
      font-size: 14px;
      font-family: 'siyuanMedium';
      color: $first;
    }
    .time {
      margin-left: 10px;
      font-size: 12px;
      color: $second;
      .icon {
        margin-right: 4px;
        font-size: 14px;
      }
    }
  }
  .msg-middle {
    margin: 4px 0;
    span {
      color: $first;
      &:nth-child(1) {
        color: $second;
      }
    }
  }
  .msg-lower {
    span {
      color: $first;
      &:nth-child(1) {
        color: $second;
      }
    }
  }
  .dot {
    position: absolute;
    top: 38px;
    left: 12px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #000;
    &.blue {
      background: $blue;
    }
    &.red {
      background: $red;
    }
  }
  .operation {
    position: absolute;
    top: 10px;
    right: 8px;
    padding: 2px 10px;
    font-size: 14px;
    color: $blue;
    border-radius: 4px;
    background: rgba($color: $blue, $alpha: 0.2);
  }
}
</style>
