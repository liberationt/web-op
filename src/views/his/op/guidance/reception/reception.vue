<!--
 * @Author: 曹俊
 * @LastEditTime: 2020-09-07 10:50:53
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\views\his\op\guidance\reception\reception.vue
 -->

<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="16">
        <div class="his-module">
          <pagenation-list ref="pageTable" data-url="/op-service/opfwtxx/queryPage" v-model="list" :list-height="listSlotHeight" :searchData="searchData" http-method="post">
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">{{ $t('reception.title') }}</h1>
                <el-input v-model="searchData.zsmc" :placeholder="$t('reception.searchTips')" @change="handleSearch" @blur="clearSearch" clearable>
                  <i slot="prefix" class="el-input__icon icon his-search"></i>
                </el-input>
              </div>
              <div class="operate">
                <el-button type="primary" class="blue-gra" icon="icon his-add" @click="handleAdd">{{ $t('common.add') }}</el-button>
              </div>
            </div>
            <el-table slot="list" stripe :highlight-current-row="true" :data="list" :height="listSlotHeight" class="scroll-bar" border @row-click="handleChange">
              <!-- 序号 -->
              <el-table-column prop="webSortNumber" :label="$t('common.serialNum')" width="80"></el-table-column>
              <!-- 服务台名称 -->
              <el-table-column prop="zsmc" :label="$t('reception.title')"></el-table-column>
              <!-- 位置 -->
              <el-table-column prop="dz" :label="$t('common.location')"></el-table-column>
              <!-- 0 启用、1停用状态 0-->
              <el-table-column prop="sfky" :label="$t('common.status')" width="80">
                <template slot-scope="scope">
                  <span :class="[scope.row.sfky == '1' ? 'reds' : 'blues']">{{ scope.row.sfky == '1' ? '停用' : '启用' }} </span>
                </template>
              </el-table-column>
              <!-- 操作 -->
              <el-table-column :label="$t('common.action')" width="100" align="center">
                <template slot-scope="scope">
                  <el-tooltip :content="scope.row.sfky == '0' ? $t('common.disable') : $t('common.enable')" placement="bottom" effect="light">
                    <el-popconfirm class="ml10" hideIcon :confirmButtonText="scope.row.sfky == '0' ? $t('common.disable') : $t('common.confirm')" :cancelButtonText="$t('common.cancel')" :title="scope.row.sfky == '1' ? $t('common.enableTip') : $t('common.disableTip')" @cancel="handleCancel" @confirm="handleOk(scope.row)">
                      <el-button slot="reference" :class="[scope.row.sfky == '0' ? 'red' : 'green']">
                        <i class="icon" :class="[scope.row.sfky == '0' ? 'his-disabled' : 'his-automated']"></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                  <el-tooltip :content="$t('common.delete')" effect="light">
                    <el-popconfirm class="ml8" hideIcon :cancelButtonText="$t('common.cancel')" :confirmButtonText="$t('common.confirm')" :title="$t('sysManage.confirmDeleted')" @confirm="handleDelete(scope.row)">
                      <el-button slot="reference" class="red" @click.stop>
                        <i class="icon his-del his-cancellationicon"></i>
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
              <h1 class="title">{{ isCreateAndEdit ? $t('common.add') : $t('common.edit') }}</h1>
            </div>
            <div class="operate">
              <el-button type="primary" class="green-gra" icon="icon his-save" @click="handleSave">{{ $t('common.save') }}</el-button>
            </div>
          </div>
          <el-form :model="forms" ref="formValidate" :rules="rules" label-width="90px">
            <el-form-item :label="$t('reception.title')" prop="zsmc">
              <el-input v-model.trim="forms.zsmc" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('common.location')" prop="dz">
              <el-input v-model="forms.dz" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item :label="'科室'" prop="ghksjh">
              <el-select v-model="forms.ghksjh" multiple filterable default-first-option placeholder="请选择科室">
                <el-option v-for="item in options" :key="item.dv" :label="item.dn" :value="item.dv"> </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Iitem, Iobj, Iobject, queryRecept, addRecept, editRecept, receptDetail, deleteById } from '@/api/his/op/guidance/reception/reception.ts'
import { Form } from 'element-ui'
import { AxiosResponse } from 'axios'

@Component({
  name: 'reception',
  filters: {},
  components: {},
})
export default class extends Vue {
  private searchData: any = {
    zsmc: '',
    pageNum: 1,
  }
  private list: any = []
  private listSlotHeight: number = 0 //列表高度
  private forms: any = {
    zsmc: '',
    dz: '',
    orderNo: '',
    jgid: 0,
    roomId: 0,
    sfky: 1,
    ghksjh: []
  }
  private listQuery: any = {
    pageNum: 1,
    pageSize: 10,
    parentMenuId: 0,
  }
  private title: string = ''
  private isCreateAndEdit: boolean = true
  private options: any[] = this.$store.state.webSqlDict.REGISTERATION_DEPARTMENT_DICT

  // 验证规则
  private rules = {
    zsmc: [{ required: true, message: window.ele.$i18n.t('reception.zsmc'), trigger: 'blur' }],
    // ghksjh: [{ required: true, message: window.ele.$i18n.t('reception.orderNo'), trigger: 'blur' }],
  }
  // 获取用户信息
  get userInfo() {
    return JSON.parse(localStorage.userInfo)
  }

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight - 51 - 40 - 30
  }

  mounted() {
    // this.searchData.hospitalId = this.userInfo.hospitalId
    this.title = this.$t('common.add').toString()
    this.forms.hospitalId = this.userInfo.hospitalId
    this.getList()
  }
  // 查询
  private handleSearch() {
    this.getList()
  }
  // 清除输入框
  private clearSearch() {}
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private handleAdd(item: any) {
    // 服务台新增获取最大排序号 flag 标识：1：服务台；2：诊室
    // getMaxOrderNo({flag:1}).then((res: any) => {
    //   this.forms.orderNo = res.data
    // });
    ;(this.$refs.formValidate as Form).resetFields()
    this.isCreateAndEdit = true
  }

  // 编辑
  private handleChange(item: any) {
    this.forms = Object.assign({}, item)
    this.forms.ghksjh = this.forms.ghksjh.split(',').map((item:any)=>{
      return parseInt(item)
    })
    this.isCreateAndEdit = false
  }

  // 是否取消停用、启用
  private handleDelete(value: any) {
    if (value.sfky == 0) {
      // code...
      this.$notify.warning('启用状态不能删除')
      return
    }
    deleteById({ rid: value.rid }).then((res: AxiosResponse) => {
      this.$notify.success('已删除')
      this.getList()
    })
  }
  // 是否确定停用、启用
  private handleOk(item: any) {
    this.forms.sfky = item.sfky == '1' ? '0' : '1'
    this.forms.orderNo = item.orderNo
    this.forms.dz = item.dz
    this.forms.roomId = item.roomId
    this.forms.zsmc = item.zsmc
    editRecept(this.forms).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.$notify({
          title: item.sfky == 1 ? this.$t('common.enabledSuc').toString() : this.$t('common.disabledSuc').toString(),
          message: '',
          type: 'success',
        })
        this.getList() // 重新加载列表
        this.isCreateAndEdit = true
        this.clearForm() // 清除表单
      }
    })
  }

  private handleCancel() {}
  // 保存
  private handleSave() {
    ;(this.$refs.formValidate as Form).validate((valid: boolean) => {
      if (valid) {
        if (this.isCreateAndEdit) {
          this.addRecept()
          this.backFirstPage()
        } else {
          this.editRecept()
          this.backFirstPage()
        }
      }
    })
  }
  // 新增服务台
  private addRecept() {
    addRecept(this.forms).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.$notify({
          title: '新增成功！',
          message: '',
          type: 'success',
        })
        this.clearForm() // 清除表单
        this.getList()
      }
    })
  }
  //
  // 编辑服务台
  private editRecept() {
    receptDetail(this.forms).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.$notify({
          title: '编辑成功！',
          message: '',
          type: 'success',
        })
        this.clearForm() // 清除表单
        this.getList()
      }
    })
  }
  // 清空表单
  private clearForm() {
    this.forms = {}
  }
  // 选择检索
  private handleSelect(item: any) {
    console.log(item)
  }
  // 返回列表第一页
  private backFirstPage() {
    ;(this.$refs.pageTable as any).searchList()
  }
}
</script>
