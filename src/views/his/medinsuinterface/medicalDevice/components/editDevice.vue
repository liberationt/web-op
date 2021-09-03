<template>
  <div class="table-list">
    <el-form ref="formValidate" :model="form" :rules="addRules">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('medicalDevice.medicareCode')" prop="ybCode" label-width="100px">
            <el-input v-model="form.ybCode" :placeholder="$t('common.placeholder')" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('medicalDevice.paymentMethod')"
            prop="payType"
            label-width="100px"
          >
            <el-input v-model="form.payType" :placeholder="$t('common.placeholder')" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('medicalDevice.informationStatus')"
            prop="status"
            label-width="100px"
          >
            <el-input v-model="form.status" :placeholder="$t('common.placeholder')" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item
            :label="$t('medicalDevice.registerNumer')"
            prop="registerNo"
            label-width="100px"
          >
            <el-input v-model="form.registerNo" :placeholder="$t('common.placeholder')" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('medicalDevice.effectiveDate')"
            prop="beginDate"
            label-width="100px"
          >
            <el-date-picker
              type="date"
              v-model="form.beginDate"
              :placeholder="$t('common.placeholder')"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('medicalDevice.expirationDate')"
            prop="endDate"
            label-width="100px"
          >
            <el-date-picker
              type="date"
              v-model="form.endDate"
              :placeholder="$t('common.placeholder')"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item
            :label="$t('medicalDevice.startDate')"
            prop="registerBeginDate"
            label-width="100px"
          >
            <el-date-picker
              type="date"
              v-model="form.registerBeginDate"
              :placeholder="$t('common.placeholder')"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('medicalDevice.endDate')"
            prop="registerEndDate"
            label-width="100px"
          >
            <el-date-picker
              type="date"
              v-model="form.registerEndDate"
              :placeholder="$t('common.placeholder')"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('medicalDevice.projectName')"
            prop="materialName"
            label-width="100px"
          >
            <el-input v-model="form.materialName" :placeholder="$t('common.placeholder')" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item
            :label="$t('medicalDevice.standard')"
            prop="materialSpec"
            label-width="100px"
          >
            <el-input v-model="form.materialSpec" :placeholder="$t('common.placeholder')" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('medicalDevice.brand')" prop="brand" label-width="100px">
            <el-input v-model="form.brand" :placeholder="$t('common.placeholder')" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('medicalDevice.salesUnit')" prop="autName" label-width="100px">
            <el-input v-model="form.autName" :placeholder="$t('common.placeholder')" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item
            :label="$t('medicalDevice.manufacturer')"
            prop="factory"
            label-width="100px"
          >
            <el-input v-model="form.factory" :placeholder="$t('common.placeholder')" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('medicalDevice.material')" prop="texture" label-width="100px">
            <el-input v-model="form.texture" :placeholder="$t('common.placeholder')" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('medicalDevice.remarks')" prop="remark" label-width="100px">
            <el-input v-model="form.remark" :placeholder="$t('common.placeholder')" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item
            :label="$t('medicalDevice.firstLevelDirectory')"
            prop="firstLevel"
            label-width="100px"
          >
            <el-input v-model="form.firstLevel" :placeholder="$t('common.placeholder')" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('medicalDevice.secondLevelDirectory')"
            prop="secondLevel"
            label-width="100px"
          >
            <el-input v-model="form.secondLevel" :placeholder="$t('common.placeholder')" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="$t('medicalDevice.thirdLevelDirectory')"
            prop="thirdLevel"
            label-width="100px"
          >
            <el-input v-model="form.thirdLevel" :placeholder="$t('common.placeholder')" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item
            :label="$t('medicalDevice.fourthLevelDirectory')"
            prop="fourLevel"
            label-width="100px"
          >
            <el-input v-model="form.fourLevel" :placeholder="$t('common.placeholder')" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="footer">
        <el-button size="large" @click="handleClose('formValidate')">{{$t('common.close')}}</el-button>
        <el-button
          size="large"
          class="blue-gra"
          type="primary"
          @click="handleSubmit('formValidate')"
        >{{$t('common.confirm')}}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
@Component({
  name: 'editDevice',
  filters: {},
})
export default class extends Vue {
  //声明变量，方法11
  private list: any = []

  @Prop({ required: true }) private value!: any
  get form() {
    return this.value
  }
  set form(val: any) {
    this.$emit('input', val)
  }

  private addRules: object = {
    ybCode: [
      {
        required: true,
        message: window.ele.$i18n.t('medicalDevice.dilogValidMedicareCode'),
        trigger: 'blur',
      },
    ],
    materialName: [
      {
        required: true,
        message: window.ele.$i18n.t('medicalDevice.dilogValidprojectName'),
        trigger: 'blur',
      },
    ],
  } //表单校验
  mounted() {}

  private handleClose(val: any) {
    this.$emit('cancle', 'cancle')
  }
  private handleSubmit() {
    ;(this.$refs.formValidate as Form).validate((valid) => {
      if (valid) {
        this.$emit('submit', this.form)
      }
    })
  }
}
</script>

<style lang='scss' scoped>
.footer {
  position: relative;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 0 0 !important;
  height: 60px;
  text-align: center;
  background: #fff;
  .el-button {
    margin: 0 18px;
    padding: 0;
    width: 128px;
    height: 36px;
    line-height: 36px;
    display: inline-block;
  }
}
</style>
