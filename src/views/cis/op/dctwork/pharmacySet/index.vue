<!--
 * @Date: 2020-05-14 09:27:00
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-22 16:50:40
 * @description: 发药药房设置
 -->
<template>
  <div class="content">
    <div class="his-module his-small">
      <div slot="header" class="row">
        <div class="label">
          <h1 class="title" style="flex: 1;">
            <!-- 发药药房设置 -->
            {{ $t('outpatientDoc.title') }}
          </h1>
        </div>
        <div class="operate">
          <el-button type="primary" size="mini" class="green-gra" icon="icon his-save" @click="handleSave">{{ $t('common.save') }}</el-button>
        </div>
      </div>
      <el-form :model="formInline" ref="formInline" :rules="ruleInline" label-width="60px" class="centerForm">
        <!-- 西药 -->
        <el-form-item :label="$t('outpatientDoc.xy')" prop="xy">
          <div class="w200">
            <search-select table-name="SYS_DICT_CONFIG" kid="5" v-model="formInline.xy" placeholder=" 请选择" :backfillValue="formInline.xy" />
          </div>
        </el-form-item>
        <!-- 中成药 -->
        <el-form-item :label="$t('outpatientDoc.zy')" prop="zy">
          <div class="w200">
            <search-select table-name="SYS_DICT_CONFIG" kid="5" v-model="formInline.zy" placeholder=" 请选择" :backfillValue="formInline.zy" />
          </div>
        </el-form-item>
        <!-- 中草药 -->
        <el-form-item :label="$t('outpatientDoc.cy')" prop="cy">
          <div class="w200">
            <search-select table-name="SYS_DICT_CONFIG" kid="5" v-model="formInline.cy" placeholder=" 请选择" :backfillValue="formInline.cy" />
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { IformInline, save,queryYfsb } from '@/api/cis/op/dctwork/pharmacySet.ts'
import { ElForm } from 'element-ui/types/form'

const NformInline: IformInline = {
  xy: '',
  zy: '',
  cy: '',
  pkey:Vue.prototype.AUTHORITY.bussinessRole ,
}
//命名文件名称，过滤器，组件
@Component({
  name: 'PharmacySet',
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private formInline: IformInline = Object.assign({}, NformInline)
  //获取药房数据列表接口
  private pkey: string = ''
  private ruleInline: any = {
    xy: {
      required: true,
      message: ' ',
      trigger: 'change',
    },
    zy: {
      required: true,
      message: ' ',
      trigger: 'change',
    },
    cy: {
      required: true,
      message: ' ',
      trigger: 'change',
    },
  }
  //初始化的周期函数
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 61 - 40 - 30
  }
  mounted() {
    this.getList()
  }
  private getList() {
    this.pkey = Vue.prototype.AUTHORITY.bussinessRole
    queryYfsb({ pkey: this.pkey }).then((res:any) => {
      this.formInline = Object.assign({}, res.data)
    })
  }

  /**
   * @LastEditors: zhml
   * @Description: 保存或新增的接口
   * @param {type} params
   * @return:
   */
  private handleSave() {
    ;(this.$refs.formInline as ElForm).validate((valid) => {
      if (valid) {
        this.formInline.pkey = Vue.prototype.AUTHORITY.bussinessRole
        if (this.formInline.pkey) {
          save(this.formInline).then(() => {
            this.$notify({
              title: '成功',
              message: '',
              type: 'success',
            })
          })
        } else {
          this.$notify({
            title: '科室id不能为空',
            message: '',
            type: 'warning',
          })
        }
      }
    })
  }
}
</script>
<style lang="scss" scoped>
::v-deep .search-select {
  width: 260px;
  ::v-deep .el-select {
    width: 100%;
    .el-input__inner {
      width: 100% !important;
    }
  }
}
.content .his-module .el-form {
  margin: 36px 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
//form框
::v-deep .el-form-item {
  margin-bottom: 16px;
}
.content .his-module .el-form .el-input {
  width: 260px;
}
.el-form {
  padding: 0px !important;
  &.centerForm {
    width: 460px;
    margin: 100px auto !important;
  }
}
.w200 {
  width: 260px;
}
</style>
