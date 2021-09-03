<!--
 * @Date: 2020-05-26 16:11:41
 * @LastEditTime: 2020-06-12 16:20:29
 * @Description: 转诊申请单
 * @FilePath: \web-op\src\views\cis\op\dctwork\patients\components\referralForm.vue
-->
<template>
  <div class="module">
    <div class="his-module layout-top his-small his-refer">
      <div slot="header">
        <div class="row">
          <div class="label">
            <h1 class="title">院内转诊申请单</h1>
            <div class="btn">
              <el-divider direction="vertical"></el-divider>
              <!-- 提交 -->
              <el-button size="mini" type="text" @click="submit"> <i class="icon his-btn-confirm green"></i>提交 </el-button>
              <!-- 打印 -->
              <el-button> <i class="his-btn-print icon"></i>打印 </el-button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="80px" label-position="left">
          <!-- <div class="form-wrap1"> -->
          <el-row :gutter="16">
            <!-- </div> -->
            <!-- <div class="form-wrap2"> -->
            <el-col :span="12">
              <el-form-item :label="'转诊科室'" prop="zzks">
                <el-select style="width: 100%;" filterable v-model="ruleForm.zzks" remote :remote-method="queryZzks">
                  <el-option v-for="item in options" :key="item.dv" :value="item.dv" :label="item.dn"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'诊断'" prop="sqzd">
                <el-input v-model="ruleForm.sqzd" :placeholder="'请输入诊断'" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- </div> -->
          <el-row>
            <el-form-item class="address" :label="'转诊目的'" prop="zzmd">
              <el-input type="textarea" v-model="ruleForm.zzmd" :placeholder="'请输入转诊目的'"></el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { handleSave } from '@/api/cis/op/dctwork/referralForm.ts'
import { findKeys, deepCopy } from '@/utils'
@Component({
  name: 'referralForm',
  filters: {},
})
export default class extends Vue {
  @Prop({ required: true }) private queryInfo!: any
  @Prop({ required: true }) private zdmc!: string
  private pnParam: any = {}
  private options: Array<any> = []
  private zzksList:Array<any> = [] // 转诊科室列表
  private ruleForm: any = {
    brid: 0, //病人id
    brnl: '', //病人年龄
    brxb: '', //病人性别
    brxm: '', //病人姓名
    sqzd: '', //诊断
    zzks: null, //转诊科室
    zzmd: '', //转诊目的
    jzkh: '0', //jzkh
    jzks: null, //就诊科室
    jgid: 0, //机构id
    jzys: '0', //转诊医生
    // zfbz: 0, //作废
    // sqrq: '0' //转诊日期
  }
  private rules: any = {
    zzks: { required: true, message: '请输入转诊科室', trigger: 'blur' },
  }
  private submit() {
    this.ruleForm.jzlsh = this.pnParam.jzlsh
    if (this.ruleForm.zzks == null) {
      this.$notify({
        type: 'warning',
        title: '请输入转诊科室',
        message: '',
      })
      return
    } else {
      if (this.ruleForm.zzks == this.ruleForm.jzks) {
        this.$notify({
          type: 'warning',
          title: '转诊科室不能为当前科室',
          message: '',
        })
        return
      }
      handleSave(this.ruleForm).then((data: any) => {
        // console.log(data)
        this.$notify({
          type: 'success',
          title: '保存成功',
          message: '',
        })
      })
    }
  }
  mounted() {
    this.pnParam = this.$store.state.pnParam.PN_PARAM
    this.ruleForm.brxm = this.queryInfo.brxm
    this.ruleForm.brxb = this.queryInfo.brxb
    this.ruleForm.brnl = this.queryInfo.nl
    this.ruleForm.brid = this.queryInfo.brid
    this.ruleForm.jzkh = this.queryInfo.jzkh
    this.ruleForm.jgid = this.queryInfo.jgid
    this.ruleForm.jzys = this.queryInfo.jzys
    this.ruleForm.jzks = this.queryInfo.ksdm
    this.ruleForm.sqzd = this.zdmc
    this.zzksList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.OUTPATIENT_DEPARTMENT : this.$store.state.webSqlDict.OUTPATIENT_DEPARTMENT
    this.zzksList = this.zzksList.filter((item: any) => {
      let ksdm = Vue.prototype.AUTHORITY.outpatientCode
      return item.dv != ksdm
    })
    this.options = this.zzksList
    
  }

  // 转诊科室拼音码搜索
  private queryZzks(query: string) {
    if(query != '') {
      let res:Array<any> = []
      let arr:Array<any> = deepCopy(this.zzksList)
      this.options = []
      setTimeout(() => {
        this.options = findKeys(query.toUpperCase(),arr,['dn','py'])
      },200)
    } else {
      this.options = deepCopy([...this.zzksList])
    }
  }
}
</script>

<style lang="scss" scoped>
.his-refer {
  padding-top: 4px;
  .row {
    padding-bottom: 4px;
  }
  .el-divider--vertical {
    margin: 0 10px;
  }
  .el-form {
    margin: 0 !important;
  }

  ::v-deep .el-input__inner {
    padding: 0 8px !important;
  }
  ::v-deep .el-textarea__inner {
    padding: 5px 10px;
  }
}
</style>
