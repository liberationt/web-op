<template>
  <div class="content">
    <div class="his-module his-small">
      <div slot="header" class="row">
        <div class="label">
          <span class="title">输液打印机设置</span>
        </div>
        <div class="operate">
          <el-button
            type="primary"
            size="mini"
            class="green-gra"
            icon="icon his-save"
            @click="handleSave"
          >{{$t('common.save')}}</el-button>
        </div>
      </div>
      
      <el-form ref="form" :model="formData" label-width="120px">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="输液瓶贴打印机" prop="ptdyj" style="font-size:14px">
              <el-select v-model="formData.ptdyj" placehlder="请输入输液瓶贴打印机">
                <el-option
                  v-for="item in list1"
                  :key="item.ptdyj"
                  :label="item.ptdyj"
                  :value="item.ptdyj"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="输液巡回单打印机" prop="xhddyj" style="font-size:14px">
              <el-select v-model="formData.xhddyj" placeholder="请输入输液巡回单打印机">
                <el-option
                  v-for="item in list2"
                  :key="item.xhddyj"
                  :label="item.xhddyj"
                  :value="item.xhddyj"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  aQuerySyptdyj, aQuerySyxhddyj, aSaveSydyj
} from '@/api/his/inject/infusion/infPrinter.ts'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'InfusionPrinterSettings',
  components: {},
})
export default class extends Vue {
  private formData: any = {
    ptdyj: '',
    xhddyj: ''
  }
  private value: any = []
  private options: object = {}
  private list1: any[] = []
  private list2: any[] = []
  private ksdm: any = Vue.prototype.AUTHORITY.bussinessRole // 当前输液科室

  private getPrinterList1(){
    aQuerySyptdyj({ksdm: this.ksdm}).then((res: any) => {
      if(res){
        this.list1 = res.data
      }
    })
  }

  private getPrinterList2(){
    aQuerySyxhddyj({ksdm: this.ksdm}).then((res: any) => {
      if(res){
        this.list2 = res.data
      }
    })
  }

  private handleAdd() {}

  private handleSave(){
    let params = {
      ...this.formData,
      ksdm: this.ksdm
    }
    aSaveSydyj(params).then((res: any) => {
      if(res){
        this.$notify({
          title: '保存成功',
          message: '',
          type: 'success'
        })
      }
    })
  }

  created() {
    this.getPrinterList1()
    this.getPrinterList2()
  }

  mounted() {
    
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-row {
  display: flex;
  justify-content: center;
}
.el-form{
  margin-top: 150px;
}
</style>