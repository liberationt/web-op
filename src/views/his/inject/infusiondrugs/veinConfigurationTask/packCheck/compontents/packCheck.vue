<template>
  <el-dialog
    title="打包"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
    :append-to-body="true"
    class="narrow-dialog"
  >
    <el-form :model="ruleForm" ref="ruleForm" style="padding:0px 16px" label-width="80px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="病区:">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="批次:">
            <el-input></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="总袋数:">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="打包人:">
            <el-input></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="打包时间:">
            <el-input></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false" size="mini">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Script } from 'vm'
@Component({
  name: 'packCheck',
  components: {},
})
export default class extends Vue {
  private dialogVisible: boolean = false
  //打开弹框
  private open() {
    this.dialogVisible = true
  }
  private handleClose() {
    this.dialogVisible = false
  }
  private ruleForm: any = {}
}
</script>

<style lang='scss' scoped>
::v-deep .el-dialog .el-dialog__header {
  border-bottom: none !important;
  padding: 0px 16px !important;
}
</style> 