<!--
 * @Author: 曹俊
 * @LastEditTime: 2020-09-22 16:10:49
 * @LastEditors: Please set LastEditors
 * @Description: 药品采购规则
 * @FilePath: \web-op\src\views\his\medinsuinterface\pharmacyDrugsInfo\components\purchase.vue
 -->
<template>
  <div>
    <pagenation-list
      ref="pageTable"
      data-url="/op-service/shybypcggz/queryPage"
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
        <el-table-column prop="tbdm" :label="$t('pharmacyDrugsInfo.tbdm')"></el-table-column>
        <el-table-column prop="fbrq" :label="$t('pharmacyDrugsInfo.fbrq')"></el-table-column>
        <el-table-column prop="cgzt" :label="$t('pharmacyDrugsInfo.cgzt')"></el-table-column>
        <el-table-column prop="cgyxfw" :label="$t('pharmacyDrugsInfo.cgyxfw')"></el-table-column>
        <el-table-column prop="cgpssx" :label="$t('pharmacyDrugsInfo.cgpssx')"></el-table-column>
        <el-table-column prop="qyrq" :label="$t('pharmacyDrugsInfo.qyrq')"></el-table-column>
        <el-table-column prop="yxrq" :label="$t('pharmacyDrugsInfo.yxrq')"></el-table-column>
        <el-table-column :label="$t('common.action')" width="45" align="center">
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
        >{{isCreateAndEdit ? $t('pharmacyDrugsInfo.addPurchase') : $t('pharmacyDrugsInfo.editPurchase') }}</div>
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
                <el-form-item :label="$t('pharmacyDrugsInfo.cgfs')" prop="cgfs">
                  <el-select v-model.number="form.cgfs">
                    <el-option
                      v-for="item in $store.state.webSqlDict.PURCHASE_METHOD_DICT"
                      :key="item.dv"
                      :label="item.dn"
                      :value="Number(item.dv)"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.cgzt')" prop="cgzt">
                  <el-input v-model="form.cgzt" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.cgyxfw')" prop="cgyxfw">
                  <el-input v-model="form.cgyxfw" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.cgpssx')" prop="cgpssx">
                  <el-input v-model="form.cgpssx" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.jzzq')" prop="jzzq">
                  <el-input v-model="form.jzzq" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.zfyq')" prop="zfyq">
                  <el-input v-model="form.zfyq" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.gzyj')" prop="gzyj">
                  <el-input v-model="form.gzyj" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.qyrq')" prop="qyrq">
                  <el-input v-model="form.qyrq" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.yxqx')" prop="yxqx">
                  <el-input v-model="form.yxqx" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
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
import { enableStatus, addPurchase, editPurchase } from '@/api/his/medinsuinterface/pharmacyDrugsInfo.ts'
import { Form } from 'element-ui'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'purchase',
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
  private title = '新增药品品规基础信息'
  private isCreateAndEdit = true
  private form: any = {}
  private addRules = {
    tbdm: [{ required: true, message: window.ele.$i18n.t('pharmacyDrugsInfo.tbdmTips'), trigger: 'blur' }],
    fbrq: [{ required: true, message: window.ele.$i18n.t('pharmacyDrugsInfo.fbrqTips'), trigger: 'blur' }],
    fblx: [{ required: true, message: window.ele.$i18n.t('pharmacyDrugsInfo.fblxTips'), trigger: 'blur' }],
  }

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight - 73 - 50 - 40 - 50
  }

  mounted() {
    // this.getList()
  }
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }
  private handleRow(val: any) {
    this.$emit('setRow', val)
  }
  // 显示弹框
  private handleShow() {
    this.isMask = true
    this.isVisiable = true
    this.isCreateAndEdit = true
    ;(this.$refs.formValidate as Form).resetFields()
    this.form = {}
  }
  // 关闭弹框
  private handleClose() {
    this.isMask = false
    this.isVisiable = false
  }
  // 编辑
  private handleEdit(data: any) {
    this.isMask = true
    this.isVisiable = true
    this.isCreateAndEdit = false
    this.form = Object.assign({}, data)
    this.form.ypjcxxdataId = data.ypjcxxdataId
    this.form.fblx = Number(Object.assign({}, data).fblx)
    this.form.cgfs = Number(Object.assign({}, data).cgfs)
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
  // 新增药品采购规则
  private addPharmacyDrug() {
    addPurchase(this.form).then((res: any) => {
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
  // 编辑药品采购规则
  private editPharmacyDrug() {
    editPurchase(this.form).then((res: any) => {
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
  height: 420px;
}
</style>
