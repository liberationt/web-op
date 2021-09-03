<template>
    <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="16">
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
                <h1 class="title">{{$t('operation.title')}}</h1>
                <el-input v-model="searchData.dataValue" :placeholder="$t('operation.phSearch')">
                  <i slot="prefix" class="el-input__icon icon his-search"></i>
                </el-input>
              </div>
              <div class="operate">
                <el-button
                  type="primary"
                  class="blue-gra"
                  icon="icon his-add"
                  @click="handleAdd"
                >{{$t('common.add')}}</el-button>
              </div>
            </div>
            <el-table
              slot="list"
              stripe
              :highlight-current-row="true"
              :data="tableData"
              border
            >
              <el-table-column prop="serialNumber" :label="$t('common.serialNum')"></el-table-column>
              <el-table-column prop="dataValue" label="ICD-9-CM3"></el-table-column>
              <el-table-column prop="dataValueRemark" :label="$t('operation.name')"></el-table-column>
              <el-table-column
                :label="$t('common.action')"
                width="100"
                align="center"
              >
                <template slot-scope="scope">
                  <el-tooltip :content="$t('common.disable')">
                    <el-button class="red" @click="handleAdd(scope.row)">
                      <i class="icon his-disabled"></i>
                    </el-button>
                  </el-tooltip>
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
              <h1 class="title">{{$t('common.detail')}}</h1>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                class="green-gra"
                icon="icon his-save"
                @click="handleSave"
              >{{$t('common.save')}}</el-button>
            </div>
          </div>
          <el-form v-model="formData" ref="formData" :rules="formValid" label-width="90px">
            <el-form-item label="诊断id" prop="datavalueId" style="display:none">
              <el-input v-model="formData.datavalueId"></el-input>
            </el-form-item>
            <el-form-item :label="$t('operation.name')" prop="dataValueRemark">
              <el-input v-model="formData.dataValueRemark" :placeholder="$t('operation.phName')"></el-input>
            </el-form-item>
            <el-form-item label="ICD-9-CM3" prop="dataValue">
              <el-input v-model="formData.dataValue" :placeholder="$t('operation.phCode')"></el-input>
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
