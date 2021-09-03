<template>
    <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col  class="ht" :span="16">
        <div class="his-module">
          <pagenation-list
            ref="pageTable"
            v-model="tableData"
            data-url="/system-service/sys/dicgbsj02/page"
            :search-data="searchData"
            http-method="post"
          >
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">标准疾病诊断</h1>
                <el-input v-model="searchData.dataValue"  placeholder="请输入...">
                  <i slot="prefix" class="el-input__icon icon his-search"></i>
                </el-input>
              </div>
              <div class="operate">
                <el-button
                  type="primary"
                  class="blue-gra"
                  icon="icon his-add"
                  @click="handleAdd"
                >
                  新增</el-button
                >
              </div>
            </div>
            <el-table
              slot="list"
              stripe
              :highlight-current-row="true"
              :data="tableData"
              border
            >
              <el-table-column prop="serialNumber" label="序号"></el-table-column>
              <el-table-column prop="dataValue" label="ICD-10编码"></el-table-column>
              <el-table-column prop="dataValueRemark" label="疾病诊断"></el-table-column>
              <el-table-column
                label="操作"
                width="100"
              >
                <template slot-scope="scope">
                  <el-button size="mini">{{scope.row.stopFlag}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col class="ht" :span="8">
        <div class="his-module">
          <div slot="header" class="row">
            <div class="label">
              <h1 class="title">详情</h1>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                class="green-gra"
                icon="icon his-save"
                @click="handleSave"
              >保存</el-button
              >
            </div>
          </div>
          <el-form v-model="formData" ref="formData" :rules="formValid" label-width="90px">
            <el-form-item label="诊断id" prop="datavalueId" style="display:none">
              <el-input v-model="formData.datavalueId"></el-input>
            </el-form-item>
            <el-form-item label="疾病诊断" prop="dataValueRemark">
              <el-input v-model="formData.dataValueRemark" placeholder="请输入内容..."></el-input>
            </el-form-item>
            <el-form-item label="ICD-10编码" prop="dataValue">
              <el-input v-model="formData.dataValue" placeholder="请输入内容..."></el-input>
            </el-form-item>
            <el-form-item label="序号" prop="serialNumber">
              <el-input v-model="formData.serialNumber" placeholder="请输入内容..."></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

// 声明接口
declare interface IPageList {
  id: number
}

// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: '',
  filters: {}
})

export default class extends Vue {
  // 声明变量，方法--
  private list: any = []
  private tableData: Array<any> = []
  private searchData: any = {}
  private formData: any = {
    datavalueId: '',
    dataValueRemark: '',
    dataValue: '',
    serialNumber: ''
  }
  formValid: any = {}
  public setValue(value: string) {
    this.setValue(value)
  }

  public getValue() {
    return null
  }

  private init() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 监听方法
  @Watch('')
  private onValueChange(value: string) {
    console.log('hello world')
  }

  // 初始化的周期函数
  created() {
    console.log('hello world')
  }

  mounted() {
    this.init()
  }
  // 新增
  private handleAdd(){

  }
  // 保存
  private handleSave(){

  }
}
</script>

<style lang="scss" scoped>
</style>
