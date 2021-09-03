<!--
 * @Author: 曹俊
 * @LastEditTime: 2020-08-21 14:30:35
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \web-op\src\layout\components\AppMain.vue
 -->
<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view v-if="!is" :key="key" />
        <div v-else class="iframe-container">
          <iframe :src="webUrl" scrolling="auto" frameborder="0" class="frame"></iframe>
        </div>
      </keep-alive>
    </transition>
  </section>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import { TagsViewModule } from '@/store/modules/tags-view'
import { isExternal } from '@/utils/validate'
import { PermissionModule } from '@/store/modules/permission'

@Component({
  name: 'AppMain'
})
export default class extends Vue {
  private is:boolean = false
  private webUrl:string =''

  //TagsViewModule
  get cachedViews() {
    return TagsViewModule.cachedViews
  }

  get key() {
    return this.$route.path
  }

  @Watch('$route', { immediate: true })
  private onRouteChange(route: any) {
    // console.log("****ww***:",isExternal(route.name))
     if(route.name&&route.name.indexOf('@')!=-1){
        this.is=true
        this.webUrl = route.name.split('@')[1]
        console.log("****ww***:",this.webUrl)
     }else{
        this.is=false
     }
     
  }
  mounted() {
    // console.log("执行渲染!")
    const route = this.$route
    if (route.path == '/dashboard') {
      const pathName = PermissionModule.pageHomeRoutes ? PermissionModule.pageHomeRoutes : PermissionModule.curMenuPath
      if (pathName) {
        this.$router.push({
          name: pathName,
        }).catch(err => { console.log(err) })
      } else {
        this.$router.push({
          name: 'Dashboard',
        }).catch(err => { console.log(err) })
      }
    }
  }
}
</script>

<style lang="scss">
.iframe-container {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  .frame {
    position: relative;
    top: 0px;
    width: 100%;
    height: 100%;
  }
}
</style>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 72px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
  height: 100vh;
  overflow: auto;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 72px);
    height: calc(100vh - 72px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>
