<template>
  <div class="iframe-body ht" v-loading="loading" element-loading-text="报表生成中">
    <!-- <el-button @click="show">12313</el-button> -->
    <iframe
      ref="iframe"
      id="iframe"
      :style="{height:height + 'px'}"
      :src="url"
      allowtransparency="yes"
      frameborder="0"
      class="iframe"
    ></iframe>
  </div>
</template>

<script lang='ts'>
import request from '@/utils/request'
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
// import { getLodop } from '@/plugins/lodop/index.js'
import { getLodop } from '@/plugins/lodop/index.js'

@Component({
  name: 'statement',
  filters: {},
})
export default class extends Vue {
  @Prop({ required: false, default: '' }) private tableDownloadUrl!: string //表格下载请求的api
  @Prop({ required: false, default: '' }) private pdfPreviewUrl!: string //pdf预览请求的api
  @Prop({ required: false, default: '' }) private htmlApi!: string //页面表格显示请求的api
  @Prop({ required: true, default: 100 }) private height!: number //iframe的高度
  @Prop({ required: false, default: () => {} }) private pdfSearchData!: Object //pdf预览请求的api所需要的请求参数
  @Prop({ required: false, default: () => {} }) private htmlSearchData!: Object //页面表格显示请求的api所需要的请求参数
  @Prop({ required: false, default: () => {} }) private tableDownloadSearchData!: Object //表格下载请求的api所需要的请求参数
  @Prop({
    required: false,
    default: () => {
      return {
        top: '10%',
        left: '10%',
        width: '90%',
        height: '100%',
      }
    },
  })
  private printArg!: any //打印的参数
  private url: string = ''
  private loading: boolean = false //v-loading
  private iframeHeight: number = 100

  private tableDownload() {
    //请求表格下载api返回一个url用于下载
    if (!this.tableDownloadUrl) return
    let data: object = this.tableDownloadSearchData
    request({
      url: this.tableDownloadUrl,
      method: 'post',
      data,
    }).then((res) => {
      window.location.href = res.data
    })
  }
  private pdfPreview() {
    //请求pdf预览api返回一个url用于预览
    if (!this.pdfPreviewUrl) return
    let data: object = this.pdfSearchData
    request({
      url: this.pdfPreviewUrl,
      method: 'post',
      data,
    }).then((res) => {
      window.open(res.data)
    })
  }

  private printTable() {
    //打印控件
    if (!this.url) {
      this.$notify({
        title: '没有打印的地址',
        message: '',
        type: 'warning',
      })
      return
    }
    const __qiankun__ = window.__POWERED_BY_QIANKUN__;
    var LODOP: any = null
    if (__qiankun__) {
      LODOP = Vue.prototype.$getLodop()
    } else {
      LODOP = getLodop()
    }
    LODOP.PRINT_INIT('打印任务名')
    LODOP.SET_PRINT_PAGESIZE(1, '185.5mm', '265.5mm', 'A4') //A4 正向打印
    LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true) //宽度超出自动缩放
    LODOP.ADD_PRINT_URL(`${this.printArg.top}`, `${this.printArg.left}`, `${this.printArg.width}`, `${this.printArg.height}`, `URL:${this.url}`)
    LODOP.PREVIEW() //预览
  }
  private getTableUrl() {
    //获得页面显示iframe展示的url
    if (!this.htmlApi) return
    const that = this
    let data: object = this.htmlSearchData
    this.loading = true
    request({
      url: this.htmlApi,
      method: 'get',
      data,
      headers: {
        'Res-Type': 'special'
      }
    })
      .then((res) => {
        this.url = res.data
        this.loading = false
        this.$emit('hadUrl', true)
      })
      .catch(() => {
        this.loading = false
      })
  }
}
</script>

<style lang="scss" scoped>
#iframe {
  width: calc(100% + 24px);
  height: auto;
  // visibility: collapse;
}
.iframe-body {
  width: 100%;
  overflow: hidden;
}
</style>
