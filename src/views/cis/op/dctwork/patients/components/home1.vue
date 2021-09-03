<template>
  <div class="ht">
    <iframe
      id="myframe"
      :src="webUrl"
      scrolling="no"
      frameborder="0"
      :height="iframeH"
      class="frame"
    ></iframe>
  </div>
</template>
  
  <script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'Home',
})
export default class extends Vue {
  //process.env.VUE_APP_UEDITOR_URL +
  private webUrl = Vue.prototype.AUTHORITY.qjym + '/emreditor/edit.html?token=' + UserModule.token

  get iframeH() {
    return Vue.prototype.PageHeight - 51 - 40 - 12 - 30 + 3
  }

  mounted() {
    let that = this
    window.addEventListener(
      'message',
      function (e) {
        if (typeof e.data == 'string') {
          const param = JSON.parse(e.data)
          console.log('********', param)
          if (param.type == 'delete' || param.type == 'save') {
          } else if (param.type == 'noToken') {
            UserModule.ResetToken()
            location.reload()
          }
        }
      },
      false
    )
  }
}
</script>

<style lang="scss" scoped>
.frame {
  width: 100%;
  overflow: hidden;
}
</style>
