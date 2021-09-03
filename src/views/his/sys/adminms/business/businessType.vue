<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="16">
        <div class="his-module">
          <pagenation-list
            ref="pageTable"
            v-model="tableDatas"
            data-url="/system-service/dicywlb/queryPage"
            http-method="post"
            :list-height="listSlotHeight"
            :searchData="searchData"
          >
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">业务类型管理</h1>
                <el-input
                  v-model="searchData.btName"
                  :placeholder="'查询'"
                  @keyup.enter.native="searchList"
                  style="display:none"
                >
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
              :data="tableDatas"
              border
              stripe
              :highlight-current-row="true"
              slot="list"
              @row-click="handleRowClick"
              :height="listSlotHeight"
              class="scroll-bar"
            >
              <el-table-column prop="webSortNumber" :label="$t('common.serialNum')" width="60"></el-table-column>

              <el-table-column prop="btCode" :label="'业务编码'" width="120"></el-table-column>
              <el-table-column prop="btName" :label="'业务名称'"></el-table-column>

              <!-- 操作 -->
              <el-table-column :label="$t('table.actions')" width="100" align="center">
                <template slot-scope="scope">
                  <!-- 删除 -->
                  <el-tooltip :content="$t('common.delete')" effect="light">
                    <el-popconfirm
                      hideIcon
                      :confirmButtonText="$t('common.confirm')"
                      :cancelButtonText="$t('common.cancel')"
                      :title="$t('common.delTip')"
                      @confirm="handleDelete(scope.row)"
                    >
                      <el-button slot="reference" class="red">
                        <i class="icon his-del his-cancellationicon" />
                      </el-button>
                    </el-popconfirm>
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
              <h1 class="title">
                {{isAdd ? $t('common.add') : $t('common.edit')}}
              </h1>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                class="green-gra"
                icon="icon his-save"
                @click="handleSubmit"
              >{{$t('common.save')}}</el-button>
            </div>
          </div>
          <el-form :model="formData" ref="formData" :rules="formRule" label-width="90px">
            <!-- 业务编码 -->
            <el-form-item :label="'业务编码'" prop="btCode">
              <el-input
                v-model.trim="formData.btCode"
                type="number"
                :placeholder="$t('common.placeholder')"
                :disabled="!isAdd"
              ></el-input>
            </el-form-item>

            <!-- 业务名称 -->
            <el-form-item :label="'业务名称'" prop="btName">
              <el-input
                v-model.trim="formData.btName"
                :placeholder="$t('common.placeholder')"
              ></el-input>
            </el-form-item>
            <!-- 业务表 -->
            <el-form-item :label="'业务表'" prop="btTableName">
              <el-select
                v-model="formData.btTableName"
                :placeholder="$t('common.placeholder')"
                @change="getTableinfo2"
              >
                <el-option
                  v-for="item in options1"
                  :key="item.btTableName"
                  :label="item.btTableNameCn"
                  :value="item.btTableName"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- 筛选条件 -->
            <el-form-item
              :label="'筛选条件'"
              prop="btWhere"
              ref="btWhere"
              :class="isHidden?'is-hidden':''"
            >
              <el-select
                v-model="formData.btWhere"
                :placeholder="$t('common.placeholder')"
                @change="update"
              >
                <el-option
                  v-for="item in options2"
                  :key="item.btWhere"
                  :label="item.btWhereCn"
                  :value="item.btWhere"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 主键 -->
            <el-form-item :label="'主键'" prop="btId" hidden>
              <el-input
                v-model.trim="formData.btId"
                :placeholder="$t('common.placeholder')"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  aTableinfo, aBusinessTypeAdd, aBusinessTypeEdit, aBusinessTypeDel
} from '@/api/his/sys/adminms/business/business.ts'

@Component({
  name: 'businessType',
})
export default class extends Vue {
  private searchData = {
    btName: '',
  }
  private isAdd: boolean = true //新增还是修改

  private listSlotHeight: number = 0 //列表高度
  //列表数组
  private tableDatas: any[] = []
  private list: any = []
  private PageHeight = Vue.prototype.PageHeight
  private formData: any = {
    btCode: '',
    btName: '',
    btTableName: '',
    btWhere: '',
    btId: ''
  }
  private formRule = {
    btCode: [{required: true, message: '业务编码不能为空', trigger: 'blur'}],
    btName: [{required: true, message: '业务名称不能为空', trigger: 'blur'}],
    btTableName: [{required: true, message: '业务表不能为空', trigger: 'blur'}],
    btWhere: [{required: true, message: '筛选条件不能为空', trigger: 'blur'}]
  }
  private options1: any =[
    {btTableName:'',btTableNameCn:''}
  ]
  private options2: any =[
    {btWhere:'',btWhereCn:''}
  ]
  private isHidden: boolean = false

  created() {
    this.listSlotHeight =this.PageHeight - 51 - 40 - 30
  }
  mounted() {
    this.getLists()
    this.getTableinfo()
  }

  // 获取一级下拉框
  private getTableinfo(){
    aTableinfo().then((res: any) => {
      if(res){
        this.options1 = res.data
      }
    })
  }

  // 获取二级下拉框
  private getTableinfo2(value: any){
    this.formData.btWhere = ''
    var index= this.options1.findIndex((item: any) => item.btTableName == value)
    this.options2 = this.options1[index].btWhereList
    if(this.options2){
      this.isHidden = false
    }else{
      this.isHidden = true
      this.formData.btWhere = 0
    }
  }

  private update(){
    // this.$forceUpdate();
  }

  //获取表格数据
  private getLists() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 获取详情
  private handleRowClick(row: any) {
    this.getTableinfo2(row.btTableName)
    this.isAdd = false
    for(let i in this.formData){
      this.formData[i] = row[i]
    }
    // 清空校验结果
    const formData: any = this.$refs.formData
    formData.clearValidate()
  }

  private searchList() {
    const pageTable: any = this.$refs.pageTable
    if (this.searchData.btName == '') {
      pageTable.getList()
    } else {
      pageTable.searchList()
    }
  }

  //新增按钮
  private handleAdd() {
    this.isAdd = true
    // 清空校验结果
    const formData: any = this.$refs.formData
    formData.resetFields()
    formData.clearValidate()
  }

  //保存按钮
  private handleSubmit() {
    const formData: any = this.$refs.formData
    formData.validate((valid: any) => {
      if (valid) {
        if (this.isAdd) {
          this.addBusinessType()
        } else {
          this.editBusinessType()
        }
      }
    })
  }

  //新增
  private addBusinessType() {
    aBusinessTypeAdd(this.formData).then(() => {
      this.$notify({
        title: this.$t('common.addSuc').toString(),
        message: '',
        type: 'success',
      })
      this.getLists()
    })
  }

  //编辑
  private editBusinessType() {
    aBusinessTypeEdit(this.formData).then(() => {
      this.$notify({
        title: this.$t('common.editSuc').toString(),
        message: '',
        type: 'success',
      })
      this.getLists()
    })
  }

  //删除
  private handleDelete(item: any) {
    aBusinessTypeDel({btId: item.btId}).then((res) => {
      this.$notify({
        title: this.$t('common.delSuc').toString(),
        message: '',
        type: 'success',
      })
      this.getLists()
    })
  }

}
</script>

<style lang='scss' scoped>
.el-form {
  padding: 0 40px !important;
}
.el-form-item.is-hidden{
  display: none;
}
</style>
