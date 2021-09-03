<template>
  <div class="content" style="padding: 10px; background: #f5f6f8">
    <div class="his-module his-small" style="background: #f5f6f8">
      <!-- 对话框版块 -->
      <div style="height: 100%">
        <iframe frameborder="no" border="0" :src="'https://mp.tyhosp.com/dev/easemob/consult?' + webTime" allow="microphone;camera;midi;encrypted-media;" style="width: 100%; height: 100%" ref="iframe"></iframe>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { user } from '@/api/users'
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: '',
  filters: {},
})
export default class extends Vue {
  // 声明变量，方法
  @Prop({ required: true, default: () => [] }) private data!: any // 就诊数据

  // export default {
  //   data() {
  //     return {
  //       inputValue: '',
  //       consultType: 'IMAGE', //问诊类型
  //       message: {},
  //       t: new Date().getTime(),
  //       // src: 'https://mp.tyhosp.com/ssh_pc?t=1',
  //       src: 'https://mp.tyhosp.com/easemob?t=1',
  //       isFinished: false,
  //       finished: false,
  //       username: '1354035421104967680', //医生的环信账号
  //       toUsername: '1353525802049867776', //对方患者的环信账号
  //       border: false,
  //       iframeWin: {},
  //     }
  //   },
  private listSlotHeight: number = 0
  private iframeWin: any = {}
  private webTime: number = 0
  private printUrl: string = ''
  private userId: string = ''

  // 监听方法
  @Watch('')
  // 生命周期
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
    this.webTime = new Date().getTime()
  }

  mounted() {
    this.printUrl = Vue.prototype.AUTHORITY.printUrl
    const mapFrame = this.$refs.iframe
    const iframeWin = (mapFrame as any).contentWindow
    console.log((mapFrame as any).attachEvent, 'mapFrame.attachEvent')
    const userInfo = JSON.parse(localStorage.getItem('userInfo') as string)
    const userId = userInfo && userInfo.userId ? userInfo.userId : ''
    console.log('客服的ID', userId)
    if ((mapFrame as any).attachEvent) {
      // eslint-disable-next-line
      ;(mapFrame as any).attachEvent('onload', function () {
        iframeWin.postMessage(
          {
            //定义接收方法，方便精准接收
            iframeClick: 'getParams',
            params: {
              //传递的值
              userId: userId,
            },
          },
          '*'
        )
      })
    } else {
      // eslint-disable-next-line
      ;(mapFrame as any).onload = function () {
        iframeWin.postMessage(
          {
            iframeClick: 'getParams',
            params: {
              //传递的值
              userId: userId,
            },
          },
          '*'
        )
      }
    }
    //     console.log(this.iframeWin, 'iframe')
    //  window.addEventListener('message', this.handleMessage)
    //     this.sendMessage()
  }
  destroyed() {
    // 注意移除监听！注意移除监听！注意移除监听！
    window.removeEventListener('message', this.handleMessage)
  }

  click() {
    this.webTime = new Date().getTime()
    const mapFrame = this.$refs.iframe
    const userInfo = JSON.parse(localStorage.getItem('userInfo') as string)
    const userId = userInfo && userInfo.userId ? userInfo.userId : ''
    const iframeWin = ((mapFrame as any).contentWindow(mapFrame as any).onload = function () {
      ;(iframeWin as any).postMessage(
        {
          iframeClick: 'getParams',
          params: {
            //传递的值
            userId: userId,
          },
        },
        '*'
      )
    })
  }
  sendMessage() {
    // 外部vue向iframe内部传数据
    ;(this.iframeWin as any).postMessage(
      {
        cmd: 'doSomething',
        params: {},
      },
      '*'
    )
  }
  handleMessage(event: any) {
    // 根据上面制定的结构来解析 iframe 内部发回来的数据
    console.log(event, 'evnet')
    const data = event.data
    switch (data.cmd) {
      case 'ready-for-receiving':
        // 业务逻辑
        break
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  padding: 0 0 10px 5px;
  width: 100%;
  .uhis-remedy {
    font-size: 16px;
    font-weight: 500;
    color: #222b31;
    line-height: 24px;
  }
}
</style>