<template>
  <div class="his-module his-small">
    <el-form :model="formData" ref="applyFormData" :rules="rules" label-width="90px" class="complexForm">
      <!-- <el-row type="flex" justify="start" :gutter="10" v-if="!patientFile && activeOrPassive == 'active'">
       <el-col :span="12" v-if="inpaOrOutpa == 'inpa'">
         <el-form-item :label="'门诊号'" prop="sqys" style="width: 100%;" label-width="100px">
           <el-input v-model="formData.zyhm" :disabled="reqOrExamine != 'req'" placeholder=" "></el-input>
         </el-form-item>
       </el-col>
        <el-col :span="12" >
          <el-form-item :label="'门诊号/卡号'" prop="sqzd" style="width: 100%;" label-width="100px">
            <el-input v-model="formData.mzhm"  placeholder=" "></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'姓名'" prop="sqzd" style="width: 100%;">
            <el-input disabled v-model="formData.brxm" placeholder=" "></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- <el-row type="flex" justify="start" :gutter="10" v-if="!patientFile && activeOrPassive == 'active'">
        <el-col :span="6">
          <el-form-item :label="'性别'" prop="brxb" style="width: 100%;" label-width="130px">
            <el-input disabled v-model="formData.brxb" placeholder=" "></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="'出生日期'" prop="csrq" style="width: 100%;">
            <el-input disabled v-model="formData.csrq" placeholder=" "></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="'年龄'" prop="sqzd" style="width: 100%;">
            <el-input disabled v-model="formData.rynl" placeholder=" "></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="'科室'" prop="brks" style="width: 100%;">
            <el-input disabled v-model="formData.brks" placeholder=" "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="start" :gutter="10">
        <el-col :span="24">
          <el-form-item :label="'诊断'" prop="mqzd" style="width: 100%;">
            <el-input disabled v-model="formData.mqzd" placeholder=" "></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row type="flex" justify="start" :gutter="10">
        <el-col :span="12">
          <el-form-item :label="'用药目的'" prop="yymd" style="width: 100%;" label-width="90px">
            <el-radio v-model="formData.yymd" :disabled="reqOrExamine != 'req'" :label="1">治疗</el-radio>
            <el-radio v-model="formData.yymd" :disabled="reqOrExamine != 'req'" :label="2">预防</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'过敏史'" prop="gms" style="width: 100%;" label-width="50px">
            <el-input v-model="formData.gms" placeholder=" "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="start" :gutter="10">
        <el-col :span="24">
          <el-form-item :label="'症状'" prop="zz" style="width: 100%;">
            <el-input type="textarea" :disabled="reqOrExamine != 'req'" :rows="3" v-model="formData.zz" placeholder=" "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="start" :gutter="10">
        <el-col :span="24">
          <el-form-item :label="'体征'" prop="tz" style="width: 100%;">
            <el-input type="textarea" :disabled="reqOrExamine != 'req'" :rows="3" v-model="formData.tz" placeholder=" "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="start" :gutter="10">
        <el-col :span="13">
          <el-form-item :label="'感染情况'" prop="tw" label-width="90px">
            <el-input v-model="formData.tw" :disabled="reqOrExamine != 'req'" type="number"><template slot="prepend">T:</template><template slot="append">℃</template></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="'WBC'" prop="wbc" style="width: 100%;" label-width="40px">
            <el-input v-model="formData.wbc" :disabled="reqOrExamine != 'req'" type="number"><template slot="append">×10^9/L</template></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="start" :gutter="10">
        <el-col :span="12">
          <el-form-item :label="'病原学检查'" prop="byxjc" style="width: 100%;" label-width="90px">
            <el-radio v-model="formData.byxjc" :disabled="reqOrExamine != 'req'" label="1">未做</el-radio>
            <el-radio v-model="formData.byxjc" :disabled="reqOrExamine != 'req'" label="2">已做</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'结果'" prop="jg" style="width: 100%;padding-right: 0" label-width="40px">
            <el-input v-model="formData.jg" placeholder=" " :disabled="formData.byxjc == '2' && reqOrExamine == 'req' ? false : true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row type="flex" justify="start" :gutter="10">
        <el-col :span="8">
          <el-form-item :label="'要使用的抗菌药物'" prop="lhsy" style="width: 100%;" label-width="200px">
            <el-checkbox v-model="formData.lhsy" :disabled="reqOrExamine != 'req'">联合使用</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item :label="' '" style="width: 100%; text-align: right;">
            <el-button v-if="activeOrPassive == 'active' && reqOrExamine == 'req'" type="primary" class="blue-gra" size="mini" icon="icon his-add" @click="handleAdd">{{ $t('common.add') }}</el-button>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- 抗菌药表格表格 -->
     <!-- <el-table stripe highlight-current-row border :data="formData.ypList" height="135" class="scroll-bar" style="margin-bottom: 10px;">
       <el-table-column type="index" width="32"></el-table-column>
       <el-table-column prop="ypmc" label="抗菌药物名称" min-width="180"></el-table-column>
       <el-table-column prop="ypgg" label="规格" width="100"></el-table-column>
       <el-table-column prop="ycsl" label="单日用量" width="80">
         &lt;!&ndash; <template slot-scope="scope">
						{{ scope.row.dj ? scope.row.dj.toFixed(4) : 0 }}
					</template> &ndash;&gt;
       </el-table-column>
       <el-table-column prop="yfdw" label="" width="80"></el-table-column>
       <el-table-column prop="ypyf_text" label="途径" width="80"></el-table-column>
       <el-table-column prop="sysj" label="使用时间" width="80">
         <template slot-scope="scope">
           <inputBoxOther :disabled="reqOrExamine != 'req'" type="number" min="0" :max="scope.row.kjywzdts" style="height: 32px;" v-model="scope.row.sysj" :ref="`${scope.$index}-3`" :value="scope.row.sysj" />
           &lt;!&ndash; @keyup.enter.native="editChange(scope, 3)"
						@input='(val)=> {numberCount(scope.row)}'
						@blur='(val)=> {numberCount(scope.row)}' &ndash;&gt;
         </template>
       </el-table-column>
       <el-table-column prop="action" label="操作" width="60" align="center" v-if="reqOrExamine == 'req'">
         <template slot-scope="scope">
           &lt;!&ndash; 删除 &ndash;&gt;
           <el-tooltip content="删除" effect="light">
             <el-button @click="handleDelDrug(scope)">
               <i class="red icon his-btn-del-copy" />
             </el-button>
           </el-tooltip>
         </template>
       </el-table-column>
     </el-table> -->
      <el-row type="flex" justify="start" :gutter="10">
        <el-col :span="24">
          <el-form-item :label="'药物品种选择理由'" prop="syly" style="width: 100%;">
            <div style="display: flex;">
              <el-input style="margin-right: 10px;" type="textarea" :rows="3" :disabled="reqOrExamine != 'req'" v-model="formData.syly" placeholder=" "></el-input>
              <el-button type="text" @click="sylyVisible = true" :disabled="reqOrExamine != 'req'">引入</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="start" :gutter="10">
        <el-col :span="14">
          <el-form-item :label="'申请时间'" style="width: 100%;" label-width="90px">
            <el-input v-model="formData.sqsj" disabled placeholder=" "></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="'申请医生'" style="width: 100%;" label-width="60px">
            <!-- <search-select disabled class="w100" table-name="SYS_DICT_CONFIG" kid="12" v-model="formData.sqysdm" :placeholder="$t('请选择医生')" :backfillValue="formData.sqysdm" /> -->
            <el-select disabled v-model="formData.sqysdm" placeholder="请选择">
              <el-option v-for="(item,index) in sqysList" :key="index" :label="item.dn" :value="item.dv"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="start" :gutter="10" v-if="checkOrquery == 'req'">
        <el-col :span="24">
          <el-form-item :label="'审核意见'" prop="shyj" style="width: 100%;">
            <el-input :disabled="checkOrquery != 'check'" type="textarea" :rows="3" v-model="formData.shyj" placeholder=" "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="start" :gutter="10" v-if="checkOrquery == 'check'">
        <el-col :span="8">
          <el-form-item :label="'审核结果'" prop="shjg" style="width: 100%;" label-width="120px">
            <el-radio :disabled="checkOrquery != 'check'" v-model="formData.shjg" label="1">同意</el-radio>
            <el-radio :disabled="checkOrquery != 'check'" v-model="formData.shjg" label="0">不同意</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="'审核人签名'" prop="shrdm" style="width: 100%;">
            <search-select class="w100" table-name="SYS_DICT_CONFIG" kid="17" v-model="formData.shrdm" :placeholder="$t('请选择医生')" :backfillValue="formData.shrdm" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="'审核人时间'" prop="shsj" style="width: 100%;">
            <el-input disabled v-model="formData.shsj" placeholder=" "></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog append-to-body class="scroll-bar narrow-dialog" :close-on-click-modal="false" :close-on-press-escape="false" title="抗菌药物使用理由引用" :visible.sync="sylyVisible" top="10vh" width="600px">
      <useReason ref="userReason" :key="sylyKey" @resetSyly="resetSyly"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sylyVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSylyConfirm">{{ $t('common.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { deepCopy, isEmpty } from '@/utils'
  import dayjs from 'dayjs'
  import { getNow } from '@/api/his/basic'
  import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
  import useReason from './useReason.vue'
  import {addMedical} from '@/api/his/im/residentDoctor/orderEntry'


  @Component({
    name: 'formData',
    components: {
      useReason,
    },
  })
  export default class extends Vue {
    @Prop({ required: false }) private patientFile!: any
    // @Prop({ required: false }) private formData!: any
    @Prop({ required: true }) private value!: any
    @Prop({ required: false, default: 'req' }) private reqOrExamine!: string // 申请 或 审核
    @Prop({ required: false, default: 'inpa' }) private inpaOrOutpa!: string // 住院 或 门诊
    @Prop({ required: false, default: 'active' }) private activeOrPassive!: string // 主动 或 被动
    @Prop({ required: false, default: 'query' }) private checkOrquery!: string // 审核 或 查看


    get formData() {
      return this.value
    }

    set formData(value: any) {
      this.$emit('input', value)
    }


    private sylyVisible: boolean = false
    private sylyKey: number = 0
    private patientData: object = {}
    private sqysList: Array<any> = []
    private rules: any = {
      syly: [{ required: true, message: '请输入药物品种选择理由！', trigger: 'blur' }],
      shyj: [{ required: true, message: '请输入审核意见！', trigger: 'blur' }],
    }
    get userInfo() {
      return JSON.parse(localStorage.userInfo)
    }
    created() {}
    mounted() {
      this.sqysList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT :this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
      this.init()
    }
    async init() {
      console.log('普通会诊申请单内容展示！', this.formData)
      // if (!isEmpty(this.formData)) {
      //   this.formData = deepCopy(this.formData)
      // }
      const nowDoc = this.userInfo.userId.toString()
      const nowDate = dayjs(((await getNow()) as any).data).format('YYYY-MM-DD HH:mm:ss')
      this.formData.shjg = String(this.formData.shjg)
      if (this.reqOrExamine == 'req') {
        this.$set(this.formData, 'sqysdm', nowDoc)
        this.$set(this.formData, 'sqsj', nowDate)
      } else {
        this.$set(this.formData, 'shrdm', nowDoc)
        this.$set(this.formData, 'shsj', nowDate)
      }
      if (!isEmpty(this.formData.ypList)) {
        this.formData.ypList.forEach((item: any, index: number) => {
          if (this.formData.ypList[index].yzmc) {
            this.$set(this.formData.ypList[index], 'ypmc', item.yzmc)
            this.$set(this.formData.ypList[index], 'ypgg', item.yfgg)
          }
        })
      }
    }
    // handleAdd() {
    //   let nowArr = this.formData.ypList ? this.formData.ypList : []
    //   nowArr.push({
    //     kjywmc: '洛美沙星',
    //     gg: '10ml/支',
    //     ycjl: '10ml',
    //     tj: 'Gtt',
    //     sysj: '48h',
    //   })
    //   this.$set(this.formData, 'ypList', nowArr)
    // }
    // handleDelDrug(scope: any) {
    //   this.formData.ypList.splice(scope.$index, 1)
    // }
    handleConfirm() {
      let a: boolean = true
      ;(this.$refs.applyFormData as any).validate((valid: boolean) => {
        if(!valid) {
          a = false
        }

      })
      return a
    }

    private handleSylyConfirm() {
      ;(this.$refs.userReason as any).confirmSelectSyly()
    }

    private resetSyly(valueArr: any) {
      let newStr = this.formData.syly
      valueArr.forEach((item: any) => {
        if (isEmpty(newStr)) {
          newStr = item.syly + ';'
        } else {
          newStr = newStr + item.syly + ';'
        }
      })
      this.formData.syly = newStr
      this.sylyVisible = false
    }

    // 清空表单
    private clearForm() {
      this.$nextTick(()=> {
        const el: any = this.$refs.applyFormData
        el.resetFields()
      })
    }
  }
</script>
<style lang="scss">
</style>
<style lang='scss' scoped>
  .content .his-small ::v-deep .el-form .el-form-item .el-form-item__label {
    line-height: 15px;
  }
  .el-form {
    margin: 0 !important;
  }
</style>
