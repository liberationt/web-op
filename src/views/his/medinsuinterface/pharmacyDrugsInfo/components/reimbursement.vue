<!--
 * @Author: 曹俊
 * @LastEditTime: 2020-09-22 16:51:21
 * @LastEditors: Please set LastEditors
 * @Description: 药品医保可报销条件规则
 * @FilePath: \web-op\src\views\his\medinsuinterface\pharmacyDrugsInfo\components\reimbursement.vue
 -->
<template>
  <div>
    <pagenation-list
      ref="pageTable"
      data-url="/op-service/shybybkbxgz/queryPage"
      v-model="list"
      :searchData="searchData"
      :list-height="listSlotHeight"
      http-method="post"
    >
      <!-- 需分页的内容可以是表格列表等元素，配置slot="list"，并绑定数据与pagenation-table一致 -->
      <el-table
        slot="list"
        stripe
        row-key="menuId"
        :indent="16"
        :highlight-current-row="true"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :data="list"
        border
        lazy
        :height="listSlotHeight"
        class="scroll-bar"
      >
        <el-table-column prop="tbdm" :label="$t('pharmacyDrugsInfo.tbdm')" width="140"></el-table-column>
        <el-table-column prop="fbrq" :label="$t('pharmacyDrugsInfo.fbrq')" width="80"></el-table-column>
        <el-table-column prop="fblx" label="发布类型" width="80">
          <template slot-scope="scope">
            <div>{{$store.state.webSqlDict.RELEASE_TYPE_DICT.find(item => item.dv == scope.row.fblx) && $store.state.webSqlDict.RELEASE_TYPE_DICT.find(item => item.dv == scope.row.fblx).dn}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="bxtjdm" label="报销条件代码" width="110"></el-table-column>
        <el-table-column prop="bxtjnr" label="报销条件内容" width="110"></el-table-column>
        <el-table-column prop="gzly" label="规则来源" min-width="125" show-overflow-tooltip></el-table-column>
        <el-table-column prop="qyrq" :label="$t('pharmacyDrugsInfo.qyrq')" width="80"></el-table-column>
        <el-table-column prop="yxrq" :label="$t('pharmacyDrugsInfo.yxrq')" width="80"></el-table-column>
        <el-table-column prop="bgzd" label="变更字段" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('common.action')" width="60" align="center">
          <template slot-scope="scope">
            <el-tooltip :content="$t('common.edit')" effect="light">
              <el-button class="blue" @click="handleEdit(scope.row)">
                <i class="icon his-edit"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </pagenation-list>
    <!-- 弹框 -->
    <div class="el-modal-mask" v-show="isMask"></div>
    <div class="el-modal" v-show="isVisiable">
      <div class="v-modal-header">
        <div
          class="v-modal-header-inner"
        >{{isCreateAndEdit ? $t('pharmacyDrugsInfo.addReimbursement') : $t('pharmacyDrugsInfo.editReimbursement') }}</div>
        <div class="v-modal-close" @click="handleClose">
          <i class="icon his-control-close"></i>
        </div>
      </div>
      <div class="v-modal-wrap">
        <div class="v-modal-body">
          <el-form :model="form" :rules="addRules" ref="formValidate" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.tbdm')" prop="tbdm">
                  <el-input v-model="form.tbdm" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.fbrq')" prop="fbrq">
                  <el-input v-model="form.fbrq" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.fblx')" prop="fblx">
                  <el-select v-model.number="form.fblx">
                    <el-option
                      v-for="item in $store.state.webSqlDict.RELEASE_TYPE_DICT"
                      :key="item.dv"
                      :label="item.dn"
                      :value="Number(item.dv)"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.bxtjdm')" prop="bxtjdm">
                  <el-input v-model="form.bxtjdm" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.bxtjnr')" prop="bxtjnr">
                  <el-input v-model="form.bxtjnr" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.gzly')" prop="gzly">
                  <el-input v-model="form.pszyyq" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.qyrq')" prop="qyrq">
                  <el-input v-model="form.qyrq" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.yxrq')" prop="yxrq">
                  <el-input v-model="form.yxrq" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.bgzd')" prop="bgzd">
                  <el-input v-model="form.bgzd" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="footer">
              <div class="buttonBox">
                <el-button @click="handleClose">{{$t('common.cancel')}}</el-button>
                <el-button type="primary" @click="handleSubmit">{{$t('common.confirm')}}</el-button>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { enableStatus, addReimbursement, editReimbursement } from '@/api/his/medinsuinterface/pharmacyDrugsInfo.ts'
import { Form } from 'element-ui'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'priceRule',
  filters: {},
})
export default class extends Vue {
  @Prop({ required: true }) private value!: any
  set list(val: any) {
    this.$emit('input', val)
  }
  get list() {
    return this.value
  }
  private searchData: any = {}
  private pageProps: any = {
    // iview分页组件自带props
    'show-elevator': true,
    'show-sizer': true,
    'show-total': true,
  }
  private listSlotHeight = 0 // 列表高度
  private isMask: boolean = false
  private isVisiable: boolean = false
  private isCreateAndEdit = true
  private title = '新增医保报销比例规则'
  private form: any = {}
  private addRules = {
    tbdm: [
      {
        required: true,
        message: window.ele.$i18n.t('pharmacyDrugsInfo.tbdmTips'),
        trigger: 'blur',
      },
    ],
    fbrq: [
      {
        required: true,
        message: window.ele.$i18n.t('pharmacyDrugsInfo.fbrqTips'),
        trigger: 'blur',
      },
    ],
    fblx: [
      {
        required: true,
        message: window.ele.$i18n.t('pharmacyDrugsInfo.fblxTips'),
        trigger: 'blur',
      },
    ],
  }
  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight - 73 - 50 - 40 - 50
  }

  mounted() {
    // this.getList();
  }
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }
  private handleRow(val: any) {
    this.$emit('setRow', val)
  }
  // 关闭
  private handleClose() {
    this.isVisiable = false
    this.isMask = false
  }
  // 显示弹框
  private handleShow() {
    this.isMask = true
    this.isVisiable = true
    this.isCreateAndEdit = true
    ;(this.$refs.formValidate as Form).resetFields()
    this.form = {}
  }
  // 编辑
  private handleEdit(data: any) {
    this.isMask = true
    this.isVisiable = true
    this.isCreateAndEdit = false
    this.form = Object.assign({}, data)
    this.form.ypjggzdataId = data.ypjggzdataId
    this.form.fblx = Number(Object.assign({}, data).fblx) ? Number(Object.assign({}, data).fblx) : ''
  }
  // 确定
  private handleSubmit() {
    ;(this.$refs.formValidate as Form).validate((valid: any) => {
      if (valid) {
        if (this.isCreateAndEdit) {
          //  新增
          this.addPharmacyDrug()
        } else {
          //  编辑
          this.editPharmacyDrug()
        }
      }
    })
  }
  // 新增药品医保可报销条件规则
  private addPharmacyDrug() {
    addReimbursement(this.form).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        // 新增成功提示
        this.$notify({
          title: this.$t('common.addSuc').toString(),
          message: '',
          type: 'success',
        })
        this.handleClose()
        this.getList()
      }
    })
  }
  // 编辑药品品规基础信息
  private editPharmacyDrug() {
    editReimbursement(this.form).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        // 编辑成功提示
        this.$notify({
          title: this.$t('common.editSuc').toString(),
          message: '',
          type: 'success',
        })
        this.handleClose()
        this.getList()
      }
    })
  }
}
</script>

<style lang='scss' scoped>
.el-modal {
  height: 360px;
}
</style>

