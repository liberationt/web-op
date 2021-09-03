<template>
  <div>
    <el-form :model="form" :rules="addRules" ref="formValidate" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.doctorYbCode')" prop="doctorYbCode">
            <el-input v-model="form.doctorYbCode" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.doctorName')" prop="doctorName">
            <el-input v-model="form.doctorName" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.doctorSex')" prop="doctorSex">
            <el-input v-model="form.doctorSex" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.documentType')" prop="documentType"> 
            <el-input v-model="form.documentType" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.quaNo')" prop="quaNo"> 
            <el-input v-model="form.quaNo" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.documentNo')" prop="documentNo">
            <el-input v-model="form.documentNo" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.workNo')" prop="workNo"> 
            <el-input v-model="form.workNo" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.empNo')" prop="empNo">
            <el-input v-model="form.empNo" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.hspCode')" prop="hspCode">
            <el-input v-model="form.hspCode" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.hspName')" prop="hspName">
            <el-input v-model="form.hspName" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.isHsp')" prop="isHsp">
            <el-input v-model="form.isHsp" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.deptName1')" prop="deptName1">
            <el-input v-model="form.deptName1" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.deptName2')" prop="deptName2">
            <el-input v-model="form.deptName2" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.deptName3')" prop="deptName3">
            <el-input v-model="form.deptName3" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.ifTxDoctor')" prop="ifTxDoctor">
            <el-input v-model="form.ifTxDoctor" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.ifSyzDoctor')" prop="ifSyzDoctor">
            <el-input v-model="form.ifSyzDoctor" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.ifGyzDoctor')" prop="ifGyzDoctor">
            <el-input v-model="form.ifGyzDoctor" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.ifTxDoctor')" prop="ifTxDoctor">
            <el-input v-model="form.ifTxDoctor" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.doctorLevel')" prop="doctorLevel">
            <el-input v-model="form.doctorLevel" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.workPlace')" prop="workPlace">
            <el-input v-model="form.workPlace" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.birthday')" prop="birthday">
            <el-input v-model="form.birthday" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.doctorType')" prop="doctorType">
            <el-input v-model="form.doctorType" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.workRange1')" prop="workRange1">
            <el-input v-model="form.workRange1" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.workRange2')" prop="workRange2">
            <el-input v-model="form.workRange2" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.workRange3')" prop="workRange3">
            <el-input v-model="form.workRange3" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.highEdu')" prop="highEdu">
            <el-input v-model="form.highEdu" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.caption')" prop="caption">
            <el-input v-model="form.caption" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.cerDate')" prop="cerDate">
            <el-input v-model="form.cerDate" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.beginDate')" prop="beginDate">
            <el-input v-model="form.beginDate" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.endDate')" prop="endDate">
            <el-input v-model="form.endDate" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('physicianRegister.undeter')" prop="undeter">
            <el-input v-model="form.undeter" :placeholder="$t('common.placeholder')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="footer">
          <el-button @click="handleClose">{{$t('common.cancel')}}</el-button>
          <el-button type="primary" @click="handleSubmit">{{$t('common.confirm')}}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  IForm
} from '@/api/his/medinsuinterface/physicianRegister.ts'
import { Form } from 'element-ui'
@Component({
  name: 'addPhysician',
  filters: {}
})
export default class extends Vue {
  // 表单项1
  private formListPart1: string[] = ['doctorYbCode', 'doctorName']
  // 表单项2
  private formListPart2: string[] = [
    'documentType',
    'documentNo',
    'quaNo',
    'workNo',
    'empNo',
    'hspCode',
    'hspName',
    'isHsp',
    'deptName1',
    'deptName2',
    'deptName3',
    'ifTxDoctor',
    'ifSyzDoctor',
    'ifGyzDoctor',
    'ifDrugDoctor',
    'doctorLevel',
    'workPlace',
    'birthday',
    'doctorType',
    'workRange1',
    'workRange2'
  ]

  private form: IForm = {
    beginDate: '',
    birthday: '',
    caption: '',
    cerDate: '',
    deptName1: '',
    deptName2: '',
    deptName3: '',
    doctorLevel: '',
    doctorName: '',
    doctorSex: '',
    doctorType: '',
    doctorYbCode: '',
    documentNo: '',
    documentType: '',
    empNo: '',
    endDate: '',
    highEdu: '',
    hspCode: '',
    hspName: '',
    ifDrugDoctor: '',
    ifGyzDoctor: '',
    ifSyzDoctor: '',
    ifTxDoctor: '',
    isHsp: '',
    quaNo: '',
    undeter: '',
    workNo: '',
    workPlace: '',
    workRange1: '',
    workRange2: '',
    workRange3: '',
    ybdoctordataId: null

  }

  @Prop({ required: true }) private value!: IForm
  //表单校验
  private addRules: object = {
    doctorYbCode: [{ required: true, message: window.ele.$i18n.t('physicianRegister.ybCodeTips'), trigger: 'blur' }],
    doctorName: [{ required: true, message: window.ele.$i18n.t('physicianRegister.doctorNameTips'), trigger: 'blur' }]
  } 
  mounted() {}

  @Watch('value', { immediate: true })
  private onvalueChange(val: any) {
    this.form = val
  }

  private handleClose(val: any) {
    this.$emit('cancle', false)
  }
  private handleSubmit() {
    (this.$refs.formValidate as Form).validate(valid => {
      if (valid) {
        this.$emit('submit', this.form)
      }
    })
  }
}
</script>

<style lang='scss' scoped>
.el-modal{
  height: 600px
}
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
