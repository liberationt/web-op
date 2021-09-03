<!--
 * @Date: 2020-04-23 09:24:13
 * @LastEditTime: 2020-04-27 13:20:31
 * @Description: 
 * @FilePath: \web-op\src\views\his\medinsuinterface\medicareData\components\detail.vue
 -->
<template>
  <div>
    <el-form :model="form" :rules="addRules" ref="formValid" :label-width="100">
      <el-form-item :label="$t('medicareData.dataNum')" prop="dataNum" v-if="tabNames == 'area'">
        <el-input v-model="form.dataNum"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('medicareData.superDepartmentName')"
        prop="dataNum"
        v-if="tabNames == 'department'"
      >
        <el-input v-model="form.dataNum"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('medicareData.dataName')"
        prop="dataName"
        v-if="
          tabNames == 'area' ||
          tabNames == 'diagnosticsFee' ||
          tabNames == 'hostpitalization'
        "
      >
        <el-input v-model="form.dataName"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('medicareData.dataCode')"
        prop="dataCode"
        v-if="tabNames != 'department' || tabNames == 'department'"
      >
        <el-input v-model="form.dataCode"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('medicareData.departmentName')"
        prop="dataName"
        v-if="tabNames == 'department'"
      >
        <el-input v-model="form.dataName"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('medicareData.explain')"
        prop="dataName"
        v-if="tabNames == 'serious' || tabNames == 'diagnostics'"
      >
        <el-input v-model="form.dataName"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('medicareData.diseaseClass')"
        prop="dataType"
        v-if="tabNames == 'diagnostics'"
      >
        <el-input v-model="form.dataType"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'detail',
  filters: {},
})
export default class extends Vue {
  @Prop({ required: true }) private value!: any
  @Prop({ required: true }) private tabNames!: string

  set form(val: any) {
    this.$emit('input', val)
  }
  get form() {
    return this.value
  }
  private addRules: object = {
    dataNum: [{ required: true, message: '请输入编码', trigger: 'blur' }],
    dataName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    dataCode: [{ required: true, message: '请输入代码', trigger: 'blur' }],
    dataType: [{ required: true, message: '请输入疾病分类', trigger: 'blur' }],
    ybdataId: [{ required: true, message: '请输入科室', trigger: 'blur' }],
  } //表单校验
  mounted() {
    // 同级组件接受事件，需要在mounted 中
    // bus.$on('setForm',(val:any)=>{
    //   if (val) {
    //     this.areaForm = {}
    //   }
    // })
  }
}
</script>

<style lang="scss" scoped>
::deep-v .ivu-input {
  width: 75%;
}
</style>
