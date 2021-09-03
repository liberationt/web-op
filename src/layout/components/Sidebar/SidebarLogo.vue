<template>
  <div
    class="sidebar-logo-container"
    :class="{'collapse': collapse}"
  >
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img
          src="../../../assets/main-img/menu_logo@2x.png"
          class="sidebar-logo"
        >
      </router-link>
      <router-link
        v-else
        key="expand"
        class="sidebar-logo-link"
        to="/"
      >
        <img
          src="../../../assets/main-img/menu_logo@2x.png"
          class="sidebar-logo"
        >
        <h1 class="sidebar-title">
          {{ title }}
        </h1>
      </router-link>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import settings from '@/settings'

@Component({
  name: 'SidebarLogo'
})
export default class extends Vue {
  @Prop({ required: true }) private collapse!: boolean

  private title = settings.title
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 44px;
  background: #333740;
  text-align: center;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight:500;

  & .sidebar-logo-link {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-left: 16px;

    & .sidebar-logo {
      width: 24px;
      height: 24px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #D3D5E3;
      font-weight: 600;
      // line-height: 50px;
      font-size: 14px;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
