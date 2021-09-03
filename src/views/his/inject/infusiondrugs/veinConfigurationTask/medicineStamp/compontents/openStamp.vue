<template>
  <el-dialog
    :visible.sync="isVisible"
    title="打印瓶签"
    width="40%"
    :append-to-body="true"
    class="narrow-dialog"
  >
    <div class="content his-sys-content">
      <el-row :gutter="10">
        <el-col :span="15" style="padding-right:24px">
          <div class="his-module his-small">
            <div style="width:90%;height:80px"></div>
            <el-table slot="list" :data="tableData" class="scroll-bar" tooltip-effect="light">
              <el-table-column label="药品名称" prop="ypmc"></el-table-column>
              <el-table-column label="规格" prop="gg" show-overflow-tooltip></el-table-column>
              <el-table-column label="剂量" prop="jl" width="60px" show-overflow-tooltip></el-table-column>
            </el-table>
            <div slot="header" class="row" style="border:none">
              <div class="label">
                <h1 class="title" style="font-weight:normal; margin-right:30px">{{$t('静滴')}}</h1>
                <h1 class="title" style="font-weight:normal">{{$t('餐后')}}</h1>
              </div>
            </div>
            <el-form label-width="80px">
              <el-row :gutter="10">
                <el-col :span="6">
                  <el-form-item label="审方:">
                    <el-input></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="排药:">
                    <el-input></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="贴签:">
                    <el-input></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="打包:">
                    <el-input></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="6">
                  <el-form-item label="加药:">
                    <el-input></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="执行:">
                    <el-input></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="时间:">
                    <el-input></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="滴速:">
                    <el-input></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8" style="border-left:1px solid #F0F0F0">
          <div class="row" style="justify-content:flex-end;border-bottom:none">
            <div>0/100</div>
          </div>
          <div class="row" style="border-bottom:none;margin-bottom:30px;padding-left:24px">
            <div class="label">
              <h1 class="title">上海天佑医院</h1>
            </div>
          </div>
          <div class="row" style="border-bottom:none;margin-bottom:24px;padding-left:24px">
            <div class="label">
              <span class="searchTitle">一病区</span>
              <el-divider direction="vertical" class="ml4"></el-divider>
              <span class="searchTitle">13床</span>
            </div>
          </div>
          <div class="row" style="border-bottom:none;margin-bottom:24px;padding-left:24px">
            <div class="label">
              <span class="searchTitle">2020005001</span>
            </div>
          </div>
          <div class="row" style="border-bottom:none;margin-bottom:16px ;padding-left:24px">
            <div class="label">
              <span class="searchTitle">王小二</span>
              <el-divider direction="vertical" class="ml4"></el-divider>
              <span class="searchTitle">男</span>
              <el-divider direction="vertical" class="ml4"></el-divider>
              <span class="searchTitle">69岁</span>
            </div>
          </div>
          <div class="row" style="border-bottom:none;padding-left:24px">
            <div class="label">
              <h1 class="title">配置</h1>
            </div>
            <div>(0)</div>
          </div>
          <div
            class="row"
            style="border-bottom:none;margin-bottom:24px;margin-top:10px;padding-left:24px"
          >
            <div class="label">
              <span class="searchTitle">2020-07-23 10:00</span>
            </div>
          </div>
          <div class="row" style="border-bottom:none;margin-bottom:16px;padding-left:24px">
            <div class="label">
              <span class="searchTitle">普内科</span>
              <el-divider direction="vertical" class="ml4"></el-divider>
              <span class="searchTitle">王医生</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isVisible = false">取 消</el-button>
      <el-button type="primary" @click="isVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { log } from 'util'
import { rightScroll, id2Name } from '@/utils/index.ts'
// 命名文件名称，过滤器什么的都在这里写
@Component({
  name: 'medicalDialog',
  components: {},
})
export default class extends Vue {
  private isVisible: boolean = false // 明细弹框默认隐藏
  private isCancel: boolean = false
  private listSlotHeight: number = 0
  private value: any = ''
  private tableData: Array<any> = [
    {
      ypmc: '葡萄糖注射液',
      gg: '500ml:25g',
      jl: '500ml',
    },
    {
      ypmc: '氨甲苯算注射液',
      gg: '500ml:25g',
      jl: '500ml',
    },
    {
      ypmc: '分黄奕胺注射液',
      gg: '500ml:25g',
      jl: '500ml',
    },
  ]
  private searchData: any = {}
  private getList() {}
  private handleDelete() {}
  private open() {
    this.isVisible = true
  }
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  @Watch('tableData')
  private onValueChange(value: string) {
    rightScroll()
  }
  //调入弹框
  private handleAdd() {
    ;(this.$refs.othersTransferIn as any).open()
  }
  //修改弹框
  private modify() {
    ;(this.$refs.othersPayService as any).open()
  }
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
.el-dialog__wrapper.narrow-dialog .el-dialog__header {
  border: none;
}
::v-deep .el-table th.is-leaf {
  border: none !important;
}
.content .his-small ::v-deep .el-table--medium td {
  border-bottom: none;
}
</style>