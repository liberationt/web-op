<template>
  <div id="screenfull">
    <i class="icon" :class="screenState == 0? 'his-out': 'his-full-screen'" @click="click"></i>
    <!-- <svg-icon
      :name="isFullscreen? 'exit-fullscreen': 'fullscreen'"
      @click="click"
    />-->
  </div>
</template>

<script lang="ts">
import screenfull from 'screenfull'
import { Component, Vue, Inject } from 'vue-property-decorator'

const sf = screenfull

@Component({
  name: 'Screenfull'
})
export default class extends Vue {
  private isFullscreen = false
  private screenState = localStorage.getItem('state') // 0全屏状态

  @Inject('reload')
  reload!: any

  mounted() {
    if (sf.isEnabled) {
      sf.on('change', this.change)
      // debugger
      if (localStorage.getItem('state') == '0') {
        // sf.request() // 进入全屏
      } else if (localStorage.getItem('state') == '2') {
        localStorage.setItem('state', '0')
        sf.request() // 进入全屏
        setTimeout(() => {
          this.reload()
        }, 500)
      }
    }
  }

  beforeDestory() {
    if (sf.isEnabled) {
      sf.off('change', this.change)
    }
  }

  // 全屏状态切换时触发
  private change() {
    if (sf.isEnabled) {
      this.isFullscreen = sf.isFullscreen
    }
  }

  private click() {
    // debugger
    if (!sf.isEnabled) {
      this.$message({
        message: 'you browser can not work',
        type: 'warning'
      })
      return false
    }
    sf.toggle() // 可能异步
    console.log(sf.isFullscreen)
    setTimeout(() => {
      console.log(sf.isFullscreen)
      this.reload()
    }, 100)
    localStorage.setItem('state', sf.isFullscreen ? '1' : '0')
  }
}
</script>
