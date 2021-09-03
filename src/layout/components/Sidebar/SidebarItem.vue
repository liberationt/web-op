<template>
  <div
    v-if="!item.meta || !item.meta.hidden"
    :class="[
      isCollapse ? 'simple-mode' : 'full-mode',
      { 'first-level': isFirstLevel },
    ]"
  >
    <!-- 修改只有一个子菜单，只显示子菜单，不显示父菜单，若要只显示，放开下面的注释代码 -->
    <template
      v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children"
    >
      <sidebar-item-link
        v-if="theOnlyOneChild.meta"
        :name="theOnlyOneChild.name"
        :to="resolvePath(theOnlyOneChild.path)"
      >
        <div @mouseenter="calcWidth">
          <el-tooltip
            effect="light"
            :content="theOnlyOneChild.meta.title"
            placement="bottom"
            :enterable="false"
            :manual="!isOverFlow"
          >
            <el-menu-item
              :index="resolvePath(theOnlyOneChild.path)"
              :class="{ 'submenu-title-noDropdown': isFirstLevel }"
              @contextmenu.prevent.native="openMenu($event)"
            >
              
                <!-- <svg-icon v-if="theOnlyOneChild.meta.icon" :name="theOnlyOneChild.meta.icon" /> -->
                <i
                  v-if="theOnlyOneChild.meta.icon"
                  class="icon"
                  :class="[theOnlyOneChild.meta.icon,'menu-icon']"
                ></i>
                <span v-if="theOnlyOneChild.meta.title" slot="title" ref="menuText" class="menu-text">
                  {{ theOnlyOneChild.meta.title }}
                </span>
                <!-- 叶子菜单 -->
              <ul
                v-show="visible"
                :style="{ left: left + 'px', top: top + 'px' }"
                class="contextmenu"
                @click="
                  isActive
                    ? addMenu(theOnlyOneChild.menuId)
                    : deleteMenu(item.menuId)
                "
              >
                <li>{{ isActive ? '设置为快捷菜单' : '取消快捷菜单' }}</li>
              </ul>
            </el-menu-item>
          </el-tooltip>
        </div>
      </sidebar-item-link>
    </template>
    <el-submenu v-else :index="resolvePath(item.path)" popper-append-to-body>
      <!-- <el-submenu :index="resolvePath(item.path)" popper-append-to-body> -->
      <template slot="title">
        <!-- <svg-icon v-if="item.meta && item.meta.icon" :name="item.meta.icon" /> -->
        <el-tooltip
          effect="light"
          :content="item.meta.title"
          placement="bottom"
          :enterable="false"
          :manual="!isOverFlow"
        >
          <div @mouseenter="calcWidth">
            <i
              v-if="item.meta && item.meta.icon"
              class="icon"
              :class="[item.meta.icon,'menu-icon']"
            ></i>
            <span v-if="item.meta && item.meta.title" slot="title" ref="menuText" class="menu-text">
              {{ item.meta.title }}
            </span>
            <!-- 有子菜单 -->
          </div>
        </el-tooltip>
      </template>
      <template v-if="item.children"> // key值不明确
        <sidebar-item
          v-for="(child,index) in item.children"
          :key="index"
          :item="child"
          :is-collapse="isCollapse"
          :is-first-level="false"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
      </template>
    </el-submenu>
    <div id="empty"></div>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import { isExternal } from '@/utils/validate'
import SidebarItemLink from './SidebarItemLink.vue'
import { addKjMenu, deleteKjMenu } from '@/api/his/user/setMenu'
import { log } from 'util'

@Component({
  // Set 'name' here to prevent uglifyjs from causing recursive component not work
  // See https://medium.com/haiiro-io/element-component-name-with-vue-class-component-f3b435656561 for detail
  name: 'SidebarItem',
  components: {
    SidebarItemLink,
  },
})
export default class extends Vue {
  @Prop({ required: true }) private item!: RouteConfig
  @Prop({ default: false }) private isCollapse!: boolean
  @Prop({ default: true }) private isFirstLevel!: boolean
  @Prop({ default: '' }) private basePath!: string
  @Prop({ default: true }) private isActive!: boolean

  private visible: boolean = false
  private visibled: boolean = false
  private initPath: string = ''
  private top: number = 0

  private left: number = 0
  private isOverFlow: boolean = false

  get alwaysShowRootMenu() {
    if (this.item.meta && this.item.meta.alwaysShow) {
      return true
    }
    return false
  }

  get showingChildNumber() {
    if (this.item.children) {
      const showingChildren = this.item.children.filter((item) => {
        if (item.meta && item.meta.hidden) {
          return false
        } else {
          return true
        }
      })
      return showingChildren.length
    }
    return 0
  }

  get theOnlyOneChild() {
    if (this.showingChildNumber > 1) {
      return null
    }
    if (!this.isActive) {
      if (this.item.children) {
        for (const child of this.item.children) {
          if (!child.meta || !child.meta.hidden) {
            return child
          }
        }
      }
    }
    // If there is no children, return itself with path removed,
    // because this.basePath already conatins item's path information
    return { ...this.item, path: '' }
  }

  @Watch('visible')
  onChangeValue(newVal: boolean, oldVal: boolean) {
    console.log('-----------', newVal, oldVal)

    if (newVal) {
      document.body.addEventListener('click', this.closeMenu)
    } else {
      document.body.removeEventListener('click', this.closeMenu)
    }
  }

  private resolvePath(routePath: string) {
    if (isExternal(routePath)) {
      return routePath
    }
    if (isExternal(this.basePath)) {
      return this.basePath
    }
    return path.resolve(this.basePath, routePath)
  }

  private openMenu(e: any) {
    ;(document.getElementById('empty') as HTMLElement).click()
    this.top = e.offsetY
    this.left = e.layerX
    this.visible = true
  }

  private closeMenu() {
    this.visible = false
  }
  /**
   * @LastEditors: zhml
   * @Description: 取消快捷菜单
   * @param {type} params
   * @return:
   */
  private addMenu(menuId: number) {
    addKjMenu({ menuId }).then((res: any) => {
      this.$notify({
        title: '',
        message: '设置成功',
        type: 'success',
      })
    })
  }

  private deleteMenu(menuId: any) {
    deleteKjMenu({ menuId }).then((res: any) => {
      this.$notify({
        title: '',
        message: '取消快捷菜单成功',
        type: 'success',
      })
      this.$store.dispatch('GetKjMenuRoutes')
    })
  }

  calcWidth(){
    const menuText: any = this.$refs.menuText
    if(menuText){
      if(menuText.scrollWidth > menuText.clientWidth){
        this.isOverFlow = true
      }else{
        this.isOverFlow = false
      }
    }
  }

  mounted() {
    // setTimeout(()=>{
    //   var menuItems: any = document.getElementsByClassName("menu-text")
    //   console.log('菜单数组',menuItems.length);
    //   // console.log(menuItems);
    //   for(let i of menuItems){
    //     console.log('文字宽度');
    //     console.log(i.scrollWidth);
    //   }
    // },0)
    
  }
}
</script>

<style lang="scss">
.el-submenu.is-active > .el-submenu__title {
  color: #fff !important;
  font-weight: bold;
  .el-submenu__icon-arrow, .icon{
    color: #fff;
    font-weight: bold;
  }
}
.full-mode {
  .el-menu{ // 逐级缩进
    margin-left: 14px;
    .menu-icon{ // 所有子菜单
      font-size: 3px;
    }
  }
  .nest-menu .el-submenu > .el-submenu__title,
  // .el-submenu .el-menu-item,
  .el-menu-item {
    // min-width: $sideBarWidth !important;
    min-width: initial;
    background-color: $subMenuBg !important;
    height: 36px !important;
    line-height: 36px !important;
    margin: 0 10px 0 16px;
    padding: 0 0 0 8px!important;
    &:hover {
      // background-color: $subMenuHover !important;
      color: #fff!important;
      .icon{
        color: #fff;
      }
    }
  }
  .icon{
    transition: all .3s;
  }
}
.el-submenu__title {
  height: 36px;
  line-height: 34px;
  &:hover{
    color: #fff!important;
    background: $subMenuBg !important;
    .el-submenu__icon-arrow, .icon{
      color: #fff;
    }
  }
}

.menu-text{ // 所有菜单
  display: inline-block;
  width: calc(100% - 40px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.menu-icon{ // 所有菜单icon
  font-size: 14px;
}

.el-submenu__title{
  .menu-text{ // 子菜单
    width: calc(100% - 50px);
  }
}

.el-menu-item {
  height: 36px;
  line-height: 34px;
  .menu-text{ // 叶子菜单
    width: calc(100% - 20px);
  }
}

.el-menu-item.is-active {
  height: 36px;
  line-height: 34px;
  // background: linear-gradient(315deg, rgba(45, 187, 255, 1) 0%, rgba(20, 133, 255, 1) 100%);
  background: url("../../../../src/assets/main-img/bgi-menu.png");
  background-size: 100% 100%;
  border-radius: 4px;
  color: #ffffff !important;
  font-weight: bold;
  .el-menu-item__icon-arrow, .icon {
    font-weight: bold;
  }
}

.simple-mode {
  &.first-level {
    .submenu-title-noDropdown {
      padding: 0 !important;
      position: relative;

      .el-tooltip {
        padding: 0 !important;
      }
    }

    .el-submenu {
      overflow: hidden;

      & > .el-submenu__title {
        padding: 0px !important;

        .el-submenu__icon-arrow {
          display: none;
          font-weight: bold !important;
        }

        // & > span {
        //   visibility: hidden;
        // }
        .menu-text{
          visibility: hidden;
        }
      }
    }
  }
}
.contextmenu {
  position: absolute;
  z-index: 1000;
  width: 120px;
  height: 40px;
  background: #ffffff;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  cursor: pointer;
  li {
    width: 100%;
    height: 100%;
    line-height: 40px;
    text-align: center;
    color: #222b31;
    font-size: 12px;
  }
}
</style>

<style lang="scss" scoped>
// .svg-icon {
//   margin-right: 16px;
// }

// .simple-mode {
//   .svg-icon {
//     margin-left: 20px;
//   }
// }
i {
  margin-right: 8px;
}

.simple-mode {
  i {
    margin-left: 20px;
  }
}
</style>
