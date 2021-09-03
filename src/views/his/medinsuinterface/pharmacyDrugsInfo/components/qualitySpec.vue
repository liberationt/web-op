<!--
 * @Author: 曹俊
 * @LastEditTime: 2020-09-22 15:35:36
 * @LastEditors: Please set LastEditors
 * @Description: 药品品规基础信息
 * @FilePath: \web-op\src\views\his\medinsuinterface\pharmacyDrugsInfo\components\qualitySpec.vue
 -->
<template>
  <div>
    <pagenation-list
      ref="pageTable"
      data-url="/op-service/shybypjcxx/queryPage"
      v-model="list"
      :searchData="searchData"
      http-method="post"
      :list-height="listSlotHeight"
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
        <!-- 统编代码 -->
        <el-table-column
          prop="tbdm"
          :label="$t('pharmacyDrugsInfo.tbdm')"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <!-- 批准文号 -->
        <el-table-column
          prop="pzwh"
          :label="$t('pharmacyDrugsInfo.pzwh')"
          min-width="140"
          show-overflow-tooltip
        ></el-table-column>
        <!-- 本位码 -->
        <el-table-column
          prop="bwm"
          :label="$t('pharmacyDrugsInfo.bwm')"
          width="130"
          show-overflow-tooltip
        ></el-table-column>
        <!-- 药品通用名 -->
        <el-table-column
          prop="yptym"
          :label="$t('pharmacyDrugsInfo.yptym')"
          min-width="180"
          show-overflow-tooltip
        ></el-table-column>
        <!-- 规格 -->
        <el-table-column
          prop="gg"
          :label="$t('pharmacyDrugsInfo.gg')"
          width="80"
          show-overflow-tooltip
        ></el-table-column>
        <!-- 生产企业 -->
        <el-table-column
          prop="scqy"
          :label="$t('pharmacyDrugsInfo.scqy')"
          min-width="180"
          show-overflow-tooltip
        ></el-table-column>
        <!-- 商品名 -->
        <el-table-column
          prop="spm"
          :label="$t('pharmacyDrugsInfo.spm')"
          min-width="70"
          show-overflow-tooltip
        ></el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('common.action')" width="45" align="center" fixed="right">
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
        >{{isCreateAndEdit ? $t('pharmacyDrugsInfo.addQualitySpec') : $t('pharmacyDrugsInfo.editQualitySpec') }}</div>
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
                <el-form-item :label="$t('pharmacyDrugsInfo.pzwh')" prop="pzwh">
                  <el-input v-model="form.pzwh" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.bwm')" prop="bwm">
                  <el-input v-model="form.bwm" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.yptym')" prop="yptym">
                  <el-input v-model="form.yptym" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.ywm')" prop="ywm">
                  <el-input v-model="form.ywm" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.jx')" prop="jx">
                  <el-input v-model="form.jx" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.gg')" prop="gg">
                  <el-input v-model="form.gg" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.scqy')" prop="scqy">
                  <el-input v-model="form.scqy" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.spm')" prop="spm">
                  <el-input v-model="form.spm" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.bzdw')" prop="bzdw">
                  <el-input v-model="form.bzdw" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.bzsl')" prop="bzsl">
                  <el-input v-model="form.bzsl" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.bzcz')" prop="bzcz">
                  <el-input v-model="form.bzcz" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.bzfs')" prop="bzfs">
                  <el-input v-model="form.bzfs" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.ggbzwzbs')" prop="ggbzwzbs">
                  <el-input v-model="form.ggbzwzbs" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.ypsx')" prop="ypsx">
                  <el-select v-model.number="form.ypsx">
                    <el-option
                      v-for="item in $store.state.webSqlDict.DRUG_ATTRIBUTE_DICT"
                      :key="item.dv"
                      :label="item.dn"
                      :value="Number(item.dv)"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.ckfl')" prop="ckfl">
                  <el-input v-model="form.ckfl" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.bzxx')" prop="bzxx">
                  <el-input v-model="form.bzxx" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.qyrq')" prop="qyrq">
                  <el-input v-model="form.qyrq" :placeholder="$t('common.placeholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('pharmacyDrugsInfo.yxqx')" prop="yxrq">
                  <el-input v-model="form.yxrq" :placeholder="$t('common.placeholder')"></el-input>
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
import { enableStatus, addQualitySpec, editQualitySpec } from '@/api/his/medinsuinterface/pharmacyDrugsInfo.ts'
import { Form } from 'element-ui'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'qualitySpec',
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
  // 获取table列表高度
  private getHeight() {
    return this.listSlotHeight
  }
  private searchData: any = {}
  private pageProps: any = {
    // iview分页组件自带props
    'show-elevator': true,
    'show-sizer': true,
    'show-total': true,
  }
  private isMask: boolean = false
  private isVisiable: boolean = false
  private isCreateAndEdit = true
  private form: any = {}
  private listSlotHeight = 0 // 列表高度

  private addRules = {
    tbdm: [
      {
        required: true,
        message: window.ele.$i18n.t('pharmacyDrugsInfo.tbdmTips'),
        trigger: 'blur',
      },
    ],
    spm: [
      {
        required: true,
        message: window.ele.$i18n.t('pharmacyDrugsInfo.spmTips'),
        trigger: 'blur',
      },
    ],
  }

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight - 73 - 50 - 40 - 50
  }

  mounted() {
    this.getList()
  }
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
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
    this.form.ypsx = Number(Object.assign({}, data).ypsx)
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
  // 新增药品品规基础信息
  private addPharmacyDrug() {
    addQualitySpec(this.form).then((res: any) => {
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
    editQualitySpec(this.form).then((res: any) => {
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
</style>
