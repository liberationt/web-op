<template>
  <el-dialog
    :visible.sync="isVisible"
    title="收费项目明细-修改"
    width="50%"
    :append-to-body="true"
    class="narrow-dialog"
  >
    <div class="content his-sys-content">
      <div class="his-module his-small" style="padding: 8px 10px">
        <div class="row" style="padding: 8px 0">
          <div class="label">
            <div class="btn">
              <el-button type="text" size="mini" @click="handleAdd">
                <i class="icon his-btn-save"></i>保存
              </el-button>
              <el-button type="text" size="mini">
                <i class="icon his-btn-close-copy red"></i>关闭
              </el-button>
            </div>
          </div>
        </div>

        <el-form
          :model="outpatForm"
          :rules="outpatRules"
          ref="ruleForm"
          label-width="75px"
          class="demo-ruleForm"
          style="line-height:12px"
        >
          <div class="row" style="justify-content: left;height:30px">
            <i class="blue icon his-basic-info"></i>
            <span style="margin-left:8px;font-family: 'siyuanMedium'">基本信息</span>
          </div>

          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="费用名称" prop="fymc">
                <el-input placeholder="请输入费用名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="单位" prop="dw">
                <el-input placeholder="请输入单位"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="标准价格" prop="bzjg">
                <el-input placeholder="请输入标准价格"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="价格标志" prop="jgbz">
                <el-select placeholder="请输入价格标志" v-model="value1">
                  <el-option label="启用" :value="1"></el-option>
                  <el-option label="未启用" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="row" style="justify-content: left;height:30px">
            <i class="blue icon his-basic-info"></i>
            <span style="margin-left:8px;font-family: 'siyuanMedium'">代码属性</span>
          </div>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="拼音码" prop="pym">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="五笔代码" prop="wbdm">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="角形代码" prop="brks">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="笔画代码" prop="bhdm">
                <el-input></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="row" style="justify-content: left;height:30px">
            <i class="blue icon his-basic-info"></i>
            <span style="margin-left:8px;font-family: 'siyuanMedium'">其他属性</span>
          </div>

          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="项目类型" prop="xmlx">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="项目编码" prop="xmbm">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="黄码编码" prop="hmbm">
                <el-input></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="row" style="justify-content: left;height:30px">
            <i class="blue icon his-mokuai_chuyuanshezhi"></i>
            <span style="margin-left:8px;font-family: 'siyuanMedium'">机构属性</span>
          </div>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="单价" prop="xcyrq">
                <el-input placeholder="请输入dj" :disabled="isdisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="费用科室" prop="fyks">
                <el-select placeholder="请输入自动插入" v-model="value2">
                  <el-option label="超声科" :value="1"></el-option>
                  <el-option label="住院手术室" :value="2"></el-option>
                  <el-option label="医学影像科" :value="3"></el-option>
                  <el-option label="医学检验科" :value="4"></el-option>
                  <el-option label="内镜中心" :value="5"></el-option>
                  <el-option label="心功能科" :value="6"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="自动插入" prop="zdcr">
                <el-select placeholder="请输入自动插入" v-model="value2">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="限制使用" prop="xzsy">
                <el-select placeholder="请输入限制使用" v-model="value3">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="限制周期" prop="xzzq">
                <el-input placeholder="请输入限制周期" :disabled="isdisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="限制次数" prop="xzcs">
                <el-input placeholder="请输入限制次数" :disabled="isdisabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="商保价格" prop="sbjg">
                <el-input placeholder="请输入商保价格" :disabled="isdisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="CPT CODE" prop="CODE">
                <el-input placeholder="请输入..." :disabled="isdisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="英文名称" prop="ywmc">
                <el-input placeholder="请输入英文为名称" :disabled="isdisabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { log } from 'util'
import { rightScroll, id2Name } from '@/utils/index.ts'
// 命名文件名称，过滤器什么的都在这里写
@Component({
  name: 'payServices',
  components: {},
})
export default class extends Vue {
  private isVisible: boolean = false // 明细弹框默认隐藏
  private value1: any = ''
  private value2: any = ''
  private value3: any = ''
  private handleDelete() {}
  private open() {
    this.isVisible = true
  }
  created() {}
}
</script>
<style lang="scss" scoped>
.content {
  background: #fff;
  height: auto;
  border-radius: 8px;
}

.his-module.his-small {
  padding: 0 0 8px !important;
}
.row .label .el-input {
  width: 190px;
}

.el-dialog__wrapper.narrow-dialog .el-dialog__body .row {
  padding-bottom: 0;
}
// 右侧状态框悬浮
::v-deep .el-table__fixed-right {
  height: 100% !important;
}
</style>