<!--
 * @Date: 2020-04-14 15:46:10
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-03 14:23:20
 * @description:
 -->
<template>
  <el-form
    ref="refForm"
    :model="formValidate"
    :rules="ruleValidate"
    label-width="82px"
  >
    <!-- 类型选择 -->
    <el-form-item :label="$t('sysManage.modelTypeFlag')" prop="modelTypeFlag">
      <el-radio-group v-model="formValidate.modelTypeFlag" @change="typeChange">
        <el-radio label="1">{{ $t('sysManage.menu') }}</el-radio>
        <el-radio label="2">{{ $t('sysManage.reportId') }}</el-radio>
        <el-radio label="3" :disabled="notAllowBtn">{{
          $t('sysManage.btn')
        }}</el-radio>
        <el-radio label="4">{{ $t('sysManage.page') }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 名称 -->
    <el-form-item :label="labelName" prop="menuName">
      <el-input
        v-model="formValidate.menuName"
        :placeholder="$t('sysManage.phName')"
        class="name-wrap"
      />
      <el-tooltip effect="light" content="添加语言" placement="bottom">
        <el-popover
          placement="bottom-end"
          :visible-arrow="false"
          width="412"
          popper-class="name-lang"
        >
          <el-form-item
            v-for="item in langList"
            :key="item.value"
            :label="item.language"
            label-width="68px"
          >
            <el-input v-model="formValidate[item.menuName]"></el-input>
          </el-form-item>
          <el-button
            slot="reference"
            circle
            icon="icon his-add"
            class="lang-add"
            :disabled="!isMultilingual"
          ></el-button>
        </el-popover>
      </el-tooltip>
      <!-- <i class="icon his-add lang-add"></i> -->
    </el-form-item>
    <el-form-item :label="$t('sysManage.menuIcon')" prop="menuIcon">
      <gallery v-model="formValidate.menuIcon"></gallery>
    </el-form-item>

    <!-- 按钮 -->
    <el-form-item
      :label="$t('sysManage.btnKey')"
      prop="routeName"
      v-if="formValidate.modelTypeFlag == 3"
    >
      <el-input
        ref="buttonKey"
        v-model="formValidate.routeName"
        :placeholder="$t('sysManage.phBtnKey')"
      />
    </el-form-item>

    <!-- 路由 -->
    <el-form-item
      :label="$t('sysManage.routeName')"
      prop="routeName"
      v-if="formValidate.modelTypeFlag != 3"
    >
      <el-input
        ref="routeName"
        v-model="formValidate.routeName"
        :placeholder="$t('sysManage.phRoute')"
      />
    </el-form-item>

    <!-- url -->
    <el-form-item
      :label="$t('sysManage.menuUrl')"
      v-if="formValidate.modelTypeFlag != '3'"
    >
      <el-input
        ref="menuUrl"
        v-model="formValidate.menuUrl"
        :placeholder="$t('sysManage.phUrl')"
      />
    </el-form-item>

    <!-- 报表 -->
    <!-- <el-form-item :label="$t('sysManage.reportIds')" v-if="formValidate.modelTypeFlag == 2">
      <el-input
        ref="reportId"
        v-model="formValidate.reportId"
        :placeholder="$t('sysManage.phReport')"
      />
    </el-form-item> -->

    <!-- 排序号 -->
    <el-form-item :label="$t('sysManage.menuSort')" prop="menuSort">
      <el-input
        ref="menuSort"
        type="number"
        v-model.number="formValidate.menuSort"
        :placeholder="$t('sysManage.phSort')"
      />
    </el-form-item>
    <el-form-item>
      <div class="form-btn">
        <el-button @click="handleCancle">{{ $t('common.close') }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{
          $t('common.confirm')
        }}</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Gallery from '@/components/Gallery/index.vue'
import { langList } from '@/utils/dic.ts'
import { log } from 'util'

@Component({
  name: 'detail',
  components: { Gallery },
  filters: {},
})
export default class extends Vue {
  @Prop({ required: true }) private value!: any
  @Prop({ required: true }) private notAllowBtn!: boolean
  get formValidate() {
    return this.value
  }

  set formValidate(val: any) {
    this.$emit('input', val)
  }

  private list: any = []
  private imageUrl: string[] = []
  private defaultList: any = []
  private visible = false
  private labelName: string = ''

  private ruleValidate: any = {
    menuName: [
      {
        required: true,
        message: window.ele.$i18n.t('sysManage.vdMenu1'),
        trigger: 'blur',
      },
      {
        max: 50,
        message: window.ele.$i18n.t('sysManage.vdMenu2'),
        trigger: 'blur',
      },
    ],
    modelTypeFlag: [
      {
        required: true,
        message: window.ele.$i18n.t('sysManage.vdtype'),
        trigger: 'blur',
      },
    ],
    routeName: [
      {
        required: true,
        message: window.ele.$i18n.t('sysManage.vdRoute'),
        trigger: 'blur',
      },
    ],
    buttonKey: [
      {
        required: true,
        message: window.ele.$i18n.t('sysManage.vdBtnKey'),
        trigger: 'blur',
      },
    ],
  }
  private langList: any[] = langList
  private isMultilingual: boolean = true // 是否录入多语种

  private handleSuccess(response: any, file: any, fileList: any) {
    this.formValidate.UploadList[0] = response.data[0]
  }
  created() {
    this.labelName = this.$t('sysManage.menuName').toString()

    // 排除默认的中文
    this.langList = this.langList.filter((item)=>{
      return item.value != 'zh_CN'
    })
  }
  private handleSubmit() {
    if (this.formValidate.modelTypeFlag == 1) {
      this.formValidate.reportId = null
    }
    // else if (this.formValidate.modelTypeFlag == 2) {
    //   this.formValidate.menuUrl = null
    // }
    ;(this.$refs.refForm as any).validate((valid: any) => {
      if (valid) {
        this.$emit('submit', this.formValidate)
      }
    })
  }
  private handleCancle() {
    this.$emit('closeDialog', true)
  }

  // 除空格
  private trim() {
    this.formValidate.menuName = this.formValidate.menuName.replace(/\s*/g, '')
  }

  // 切换名称
  private typeChange(value: number | string) {
    switch (value) {
      case '1': // 菜单
        this.labelName = this.$t('sysManage.menuName').toString()
        this.isMultilingual = true
        break
      case '2': // 报表
        this.labelName = this.$t('sysManage.reportName').toString()
        this.isMultilingual = true
        break
      case '3': // 按钮
        this.labelName = this.$t('sysManage.btnName').toString()
        this.isMultilingual = false
        break
      case '4': // 页面
        this.labelName = this.$t('sysManage.pageName').toString()
        this.isMultilingual = false
        break
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .icon-style {
  width: 34px;
  height: 34px;
  background: rgba(245, 246, 248, 1);
  border-radius: 17px;
  display: flex;

  align-items: center;
  justify-content: center;
}
::v-deep .ivu-el-upload {
  display: flex;
}
::v-deep .text {
  width: 80px;
  height: 34px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(20, 133, 255, 1);
  margin-left: 10px;
}
.form-btn {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
}
.name-wrap{
  display: inline-block;
  width: calc(100% - 28px);
}
.lang-add{
  width: 22px;
  height: 22px;
  margin-left: 6px;
  padding: 0px;
  justify-content: center;
  border-color: #d3d5e2;
  ::v-deep .icon{
    margin-right: 0;
    color: #9ca0ab;
  }
  &:hover, &:focus{
    background: initial;
  }
  &:active{
    border-color: #d3d5e2;
  }
  &.is-disabled{
    background: $lightGray;
  }
}
</style>
<style lang="scss">
.name-lang{
  .el-form-item{
    margin-bottom: 12px;
  }
  label{
    font-weight: normal;
  }
  .el-input__inner{
    padding: 0 10px;
    height: 34px;
    line-height: 34px;
    background: $lightGray;
    border: 0;
    border-radius: 4px;
  }
}
</style>
