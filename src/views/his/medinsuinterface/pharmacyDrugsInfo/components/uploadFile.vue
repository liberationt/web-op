<template>
  <div>
    <div class="el-modal-mask" v-show="showUpload"></div>
    <div class="s-modal" v-show="showUpload">
      <div class="s-modal-header">
        <div class="s-modal-header-inner">{{$t('uploadFile.title')}}</div>
        <div class="s-modal-close" @click="handleClose" style="font-size: 50px;">
          <i class="icon his-close"></i>
        </div>
      </div>
      <div class="s-modal-title">{{$t('uploadFile.desc')}}</div>

      <div class="s-modal-wrap">
        <div class="s-modal-body">
          <div class="s-modal-body-img">
            <i class="icon his-excel" style="font-size:50px" />
          </div>
          <div class="s-modal-body-text" v-if="!showImg">
            <el-upload
              ref="upload"
              :limit="limitNum"
              :auto-upload="false"
              :action="headUrl"
              :headers="headers"
              :on-exceed="exceedFile"
              :on-success="handleSuccess"
              :on-error="handleError"
              :before-upload="beforeUploadFile"
              accept=".txt"
              :file-list="fileList"
            >
              <div>
                <span style="color: rgba(20, 133, 255, 1);">{{$t('uploadFile.tipsUpload')}}</span>
                <span>{{$t('uploadFile.tipsSupport')}}</span>
              </div>
            </el-upload>
          </div>
        </div>
      </div>
      <div class="footer">
        <el-button size="large" @click="handleClose('formValidate')">{{$t('common.close')}}</el-button>
        <el-button size="large" type="primary" @click="handleSubmit">{{$t('common.confirm')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { getToken } from '@/utils/cookies'
//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'uploadModal',
  filters: {},
})
export default class extends Vue {
  @Prop({ required: true }) private showUpload!: boolean
  @Prop({ required: true }) private headUrl!: string
  private showImg: boolean = false
  private limitNum = 1 // 上传excell时，同时允许上传的最大数
  private fileList = [] // excel文件列表
  // private headUrl: string = process.env.VUE_APP_BASE_API + '/shybypjcxx/impExcel'
  private headers = {
    token: getToken() || '',
  }
  //生命周期
  mounted() {}
  private handleClose() {
    this.$emit('close', true)
  }
  private handleSubmit() {
    ;(this.$refs.upload as any).submit()
    this.$emit('save')
  }
  private beforeUploadFile(file: any) {
    //文件格式判断参数
    let isTrue: boolean = true
    let extension = file.name.substring(file.name.lastIndexOf('.') + 1)
    const extension2 = extension === 'xls'
    const extension3 = extension === 'xlsx'
    const extension4 = extension === 'txt'
    if (!extension4) {
      this.$notify({
        title: this.$t('common.warning').toString(),
        message: this.$t('uploadFile.notifyWarning').toString(),
        type: 'warning',
      })
      isTrue = false
    }
    return isTrue
  }
  // 文件超出个数限制时的钩子
  private exceedFile(files: any, fileList: any) {
    this.$message.warning(this.$t('uploadFile.exceedFileMessage').toString())
  }
  // 文件上传成功时的钩子
  private handleSuccess(res: any, file: any, fileList: any) {
    this.$notify({
      title: this.$t('common.addSuc').toString(),
      message: '',
      type: 'success',
    })
    this.$emit('close', true)
  }
  // 文件上传失败时的钩子
  private handleError(err: any, file: any, fileList: any) {
    this.$notify.error({
      title: this.$t('common.addError').toString(),
      message: '',
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
