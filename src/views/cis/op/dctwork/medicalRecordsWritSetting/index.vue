<template>
  <div class="content">
    <div class="his-module">
      <div slot="header" class="row">
        <div class="label">
          <h1 class="title" style="flex: 1;">
            <!-- 发药药房设置 -->
            病历书写设置
          </h1>
        </div>
        <div class="operate">
          <el-button type="primary" class="blue-gra" v-preventReClick icon="icon his-add">
            <!-- 保存 -->
            {{ $t('common.save') }}
          </el-button>
        </div>
      </div>
      <div>
        <el-form
          v-model="data"
          ref="form"
          label-position="right"
          label-width="225px"
          class="centerForm"
        >
          <el-form-item label="书写病历时自动跳转到下一个元素">
            <div class="w100">
              <el-select v-model="data.value1">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="自动保存病历文档的恢复文件的间隔时间(0表示不需要)(分钟)">
            <div class="w100">
              <el-input-number
                style="text-align: left"
                v-model="data.value2"
                controls-position="right"
                :min="0"
              ></el-input-number>
            </div>
          </el-form-item>
          <el-form-item label="病历文档的显示比例(%)">
            <div class="w100">
              <el-popover popper-class="pt8" placement="bottom" width="235" trigger="click">
                <div class="h36">
                  <el-radio class="mt9" v-model="radio" label="1">200%</el-radio>
                </div>
                <div class="h36">
                  <el-radio class="mt9" v-model="radio" label="2">100%</el-radio>
                </div>
                <div class="h36">
                  <el-radio class="mt9" v-model="radio" label="3">75%</el-radio>
                </div>
                <div class="h36">
                  <el-radio class="mt9" v-model="radio" label="4">页宽</el-radio>
                </div>
                <div class="h36">
                  <el-radio v-model="radio" label="5">
                    百分比
                    <el-input-number
                      style="width: 120px"
                      v-model="rate"
                      controls-position="right"
                      :min="0"
                      :max="100"
                    ></el-input-number>
                  </el-radio>
                </div>
                <el-select :popper-append-to-body="false" v-model="data.value3" slot="reference">
                  <div slot="empty"></div>
                </el-select>
              </el-popover>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
@Component({
  name: 'medicalRecordsWriteSetting'
})
export default class extends Vue {
  private data: any = {
    value1: '0',
    value2: 10,
    value3: 0
  }
  private radio: string = '1'
  private rate: number = 0
}
</script>

<style lang="scss" scoped>
.grid-content {
  display: grid;
  grid-template-columns: 5fr 4fr;
  width: 100%;
  grid-template-rows: 40px;
  line-height: 50px;
}
.select-label {
  text-align: right;
  font-size: 14px;
}
.w200 {
  width: 100%;
}
::v-deep .el-input__inner {
  border: none;
  background: rgba(245, 246, 248, 1);
}
::v-deep .el-select-dropdown {
  display: none;
}
::v-deep .el-input--medium .el-input__inner {
  width: 100%;
  text-align: left;
}
::v-deep .el-input-number--medium {
  width: 100%;
}
.h36 {
  height: 32px;
}
.el-form {
  padding: 0px !important;
  &.centerForm {
    width: 460px;
    margin: 80px auto;
  }
}
.el-select {
  width: 100%;
}
.el-popover {
  .el-input__inner {
    height: 32px;
  }
}
.mt9 {
  margin-top: 9px;
}
</style>

<style lang="scss">
.pt8.el-popover.el-popper {
  padding: 8px 16px 12px !important;
}
</style>
