<template>
  <div :class="{ 'has-logo': showLogo }">
    <sidebar-logo v-if="showLogo" :collapse="isCollapse" />
    <div class="institutions" v-if="institutionsName && !isCollapse">{{ institutionsName }}</div>
    <div class="tabMenu">
      <div class="is-all-menu">
        <div class="t-menu" @click="btnTab(false)" v-if="!isCollapse">
          <div class="i-box">
            <img :src="!isActive ? kjMenu : kjMenu_h" />
            <span :class="{ coloractive: !isActive }">快捷</span>
          </div>
          <div :class="{ active: !isActive }"></div>
        </div>
        <div class="t-menu" @click="btnTab(true)">
          <div class="i-box">
            <img :src="isActive ? allMenu : allMenu_h" :style="{ 'margin-left': !isCollapse ? '' : '8px' }" />
            <span v-if="!isCollapse" :class="{ coloractive: isActive }">全部</span>
          </div>
          <div :class="{ active: isActive }" v-if="!isCollapse"></div>
        </div>
      </div>
    </div>
    <div class="hei" :class="isCollapse ? 'close' : 'open'"></div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu" :collapse="isCollapse" background-color="#333740" text-color="#bfcbd9" :active-text-color="menuActiveTextColor" :unique-opened="false" :collapse-transition="false" mode="vertical">
        <sidebar-item v-for="route in isActive ? routes : kjRoutes" :key="route.path" :item="route" :base-path="route.path" :is-collapse="isCollapse" :is-active="isActive" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { PermissionModule } from '@/store/modules/permission'
import { SettingsModule } from '@/store/modules/settings'
// import variables from '@/styles/_variables.scss'
import SidebarItem from './SidebarItem.vue'
import SidebarLogo from './SidebarLogo.vue'

@Component({
  name: 'SideBar',
  components: {
    SidebarItem,
    SidebarLogo,
  },
})
export default class extends Vue {
  private isActive: boolean = true

  private allMenu: string = require('@/assets/main-img/all-xz@2x.png')

  private allMenu_h: string = require('@/assets/main-img/all-mr@2x.png')

  private kjMenu: string = require('@/assets/main-img/kuaijie-xz@2x.png')

  private kjMenu_h: string = require('@/assets/main-img/kuaijie-mr@2x.png')

  private firstPath: string = ''

  get sidebar() {
    return AppModule.sidebar
  }

  get routes() {
    return PermissionModule.routes
  }

  get kjRoutes() {
    return PermissionModule.kjRoutes
  }

  get showLogo() {
    return SettingsModule.showSidebarLogo
  }

  get menuActiveTextColor() {
    if (SettingsModule.sidebarTextTheme) {
      return SettingsModule.theme
    } else {
      return '#409EFF' //variables.menuActiveText  //#409EFF
    }
  }

  // get variables() {
  //   return variables
  // }

  get activeMenu() {
    //隐藏药库权限弹窗
    AppModule.SetDialogInfo({ isShow: false, title: '', message: '' })
    const route = this.$route
    const { meta, path } = route
    // if set path, the sidebar will highlight the path you set
    if (meta.activeMenu) {
      return meta.activeMenu
    }
    if (route.path == '/dashboard' || route.path == '/') {
      const pathName = PermissionModule.pageHomeRoutes ? PermissionModule.pageHomeRoutes : PermissionModule.curMenuPath
      if (pathName) {
        return '/' + pathName
      }
    }
    return path
  }

  get isCollapse() {
    return !this.sidebar.opened
  }

  get institutionsName() {
    if (localStorage.getItem('userInfo')) {
      return JSON.parse(localStorage.getItem('userInfo') as string).hospitalName
    }
    return ''
  }

  mounted() {}

  private btnTab(bo: boolean) {
    this.isActive = bo
    if (!bo) {
      this.$store.dispatch('GetKjMenuRoutes')
    }
  }
}
</script>

<style lang="scss">
.sidebar-container {
  background: #333740;
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
  }

  .scrollbar-wrapper {
    background: #333740;
    overflow-x: hidden !important;
  }

  .el-scrollbar__view {
    height: 100%;
  }

  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }

    &.is-horizontal {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
.el-scrollbar {
  height: 100%;
}

// .has-logo {
//   .el-scrollbar {
//     height: calc(100% - 144px);
//   }
// }

// 菜单高度
.hei {
  &.open + .el-scrollbar {
    height: calc(100% - 144px);
  }
  &.close + .el-scrollbar {
    height: calc(100% - 111px);
  }
}

.el-menu {
  border: none;
  height: 100%;
  width: 100% !important;
}
</style>
<style lang="scss" scoped>
.institutions {
  width: 100%;
  height: 33px;
  text-align: left;
  color: #d3d5e3;
  background: #333740;
  font-size: 14px;
  padding-left: 50px;
  border-bottom: 1px solid rgba(106, 109, 120, 0.2);
}
.tabMenu {
  width: 100%;
  height: 46px;
  background: #333740;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-bottom: 1px solid rgba(106, 109, 120, 0.2);
  .is-all-menu {
    width: 78%;
    margin-left: 6px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(156, 160, 171, 1);
    line-height: 21px;
    display: flex;
    justify-content: space-around;
    .t-menu {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      height: 28px;
      cursor: pointer;
      .i-box {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        padding-bottom: 5px;
        height: 20px;
        img {
          width: 20px;
          height: 20px;
          margin-right: 9px;
        }
      }
    }

    .coloractive {
      color: #2dbbff;
    }

    .active {
      width: 58px;
      height: 2px;
      background: linear-gradient(315deg, rgba(45, 187, 255, 1) 0%, rgba(20, 133, 255, 1) 100%);
      border-radius: 1px;
      .menu-collapsed {
        padding-top: 10px;

        .ivu-dropdown {
          width: 100%;
          .ivu-dropdown-rel a {
            width: 100%;
          }
        }

        .ivu-tooltip {
          width: 100%;

          .ivu-tooltip-rel {
            width: 100%;
          }

          .ivu-tooltip-popper .ivu-tooltip-content {
            .ivu-tooltip-arrow {
              border-right-color: #fff;
            }

            .ivu-tooltip-inner {
              background: #fff;
              color: #495060;
            }
          }
        }
      }
    }
  }
}
.hei {
  height: 20px;
  background: #333740;
}
</style>
