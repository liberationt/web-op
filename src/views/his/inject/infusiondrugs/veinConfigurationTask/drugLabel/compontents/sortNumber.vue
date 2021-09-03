<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="20%"
    :before-close="handleClose"
  >
    <el-form :model="ruleForm" style="margin:0px 16px" label-width="80px">
      <el-form-item label="起始序号">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="终止序号">
        <el-input></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Script } from 'vm'
@Component({
  name: 'sortNumber',
  components: {},
})
export default class extends Vue {
  private dialogVisible: boolean = false //
  private ruleForm: any = {}
  //打开弹框的方法
  private open() {
    this.dialogVisible = true
  }
  private handleClose() {
    this.dialogVisible = false
  }
}
</script>

<style scoped lang="scss">
.el-dialog .el-dialog__header {
  padding: 0px 16px !important;
}
</style>