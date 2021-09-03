<!--
 * @Date: 2020-05-19 10:24:44
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-22 15:04:10
 * @description: 病历首页
-->
<template>
  <div class="his-module ht scroll-bar his-patient-home">
    <div class="btn">
      <!-- 病历模板 -->
      <el-button size="mini" type="text" @click="turnTo('blmb')">
        <i class="icon his-template blue"></i>
        <span>{{ $t('patients.blmb') }}</span>
      </el-button>

      <!-- 病历复制 -->
      <el-button size="mini" type="text" @click="copyBcjl">
        <i class="icon his-caozuo-fuzhibingli blue"></i>
        <span>{{ $t('patients.blfz') }}</span>
      </el-button>
      <el-divider direction="vertical"></el-divider>

      <!-- 保存 -->
      <el-button size="mini" type="text" @click="save">
        <i class="icon his-btn-save green"></i>
        <span>{{ $t('common.save') }}</span>
      </el-button>

      <!-- 清空 -->
      <el-button size="mini" type="text" @click="clearPatientObj">
        <i class="icon his-btn-del red"></i>
        <span>{{ $t('common.clear') }}</span>
      </el-button>

      <!-- 打印 -->
      <el-button size="mini" type="text">
        <i class="icon his-btn-print blue"></i>
        <span>{{ $t('common.print') }}</span>
      </el-button>
    </div>

    <el-form
      ref="form"
      :model="patientObj"
      :rules="patientRules"
      label-width="70px"
      class="main-form"
    >
      <el-form-item :label="$t('patients.zs') + '：'" prop="zsxx">
        <el-input type="textarea" autosize v-model="patientObj.zsxx"></el-input>
      </el-form-item>
      <el-form-item :label="$t('patients.xbs') + '：'">
        <el-input type="textarea" autosize v-model="patientObj.xbs"></el-input>
      </el-form-item>
      <el-form-item :label="$t('patients.jws') + '：'" style="margin-bottom: 10px;">
        <el-input type="textarea" autosize v-model="patientObj.jws"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="form-row">
          <span class="special-text">T：</span>
          <el-input class="special" v-model.trim="patientObj.t">
            <template slot="append">℃</template>
          </el-input>
          <span class="special-text">P：</span>
          <el-input class="special" v-model.trim="patientObj.p">
            <template slot="append">次/分</template>
          </el-input>
          <span class="special-text">R：</span>
          <el-input class="special" v-model.trim="patientObj.r">
            <template slot="append">次/分</template>
          </el-input>
          <span class="special-text">BP：</span>
          <el-input style="width: 60px; margin-right: 8px;" v-model.trim="patientObj.ssy" />
          <span style="margin-right: 8px;">/</span>
          <el-input class="special" style="width: 100px;" v-model.trim="patientObj.szy">
            <template slot="append">mmHg</template>
          </el-input>
        </div>

        <div class="form-row" style="margin-bottom: 0px; border-bottom: 1px solid #f0f0f0;">
          <span class="special-text">H：</span>
          <el-input class="special" v-model.trim="patientObj.h">
            <template slot="append">CM</template>
          </el-input>
          <span class="special-text">W：</span>
          <el-input class="special" v-model.trim="patientObj.w">
            <template slot="append">Kg</template>
          </el-input>
          <span class="special-text">BMI：</span>
          <el-input class="special" v-model="bmi" disabled></el-input>
          <el-checkbox :label="$t('patients.mxb')" v-model="patientObj.mxb"></el-checkbox>
          <el-checkbox :label="$t('patients.dpy')" v-model="patientObj.dpy"></el-checkbox>
        </div>
      </el-form-item>
      <!-- 临床表现 -->
      <el-form-item :label="$t('patients.lcbx') + ':'" class="item-card">
        <el-checkbox :label="$t('patients.kso')" class="box-mar" v-model="patientObj.ks"></el-checkbox>
        <el-checkbox :label="$t('patients.yt')" class="box-mar" v-model="patientObj.yt"></el-checkbox>
        <el-checkbox :label="$t('patients.hxkn')" class="box-mar" v-model="patientObj.hxkn"></el-checkbox>
        <el-checkbox :label="$t('patients.hxkn')" class="box-mar" v-model="patientObj.ot"></el-checkbox>
        <el-checkbox :label="$t('patients.ft')" class="box-mar" v-model="patientObj.ft"></el-checkbox>
        <el-checkbox :label="$t('patients.fx')" class="box-mar" v-model="patientObj.fx"></el-checkbox>
        <el-checkbox
          :label="$t('patients.pz')"
          class="box-mar"
          style="margin-right: 10px;"
          v-model="patientObj.pz"
        ></el-checkbox>
        <span class="special-text">{{ $t('patients.qt') + '：' }}</span>
        <el-input v-model.trim="patientObj.qtlcbx" style="width: 80px; margin-right: 10px;"></el-input>
        <span class="special-text">{{ $t('patients.rsbz') + '：' }}</span>
        <el-radio-group v-model="patientObj.rsbz">
          <el-radio :label="0" class="box-mar">{{ $t('patients.wu') }}</el-radio>
          <el-radio :label="1" class="box-mar">{{ $t('patients.rsq') }}</el-radio>
          <el-radio :label="2" class="box-mar">{{ $t('patients.brq') }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 体格检查 -->
      <el-form-item :label="$t('patients.tgjc') + ':'" class="item-card">
        <div class="two-line">
          <el-input type="textarea" autosize v-model="patientObj.tgjc"></el-input>
          <div class="tow-btn">
            <el-button type="text" @click="turnTo('Tgjc')">{{ $t('patients.yy') }}</el-button>
          </div>
        </div>
      </el-form-item>

      <!-- 辅助检查 -->
      <el-form-item :label="$t('patients.fzjc') + ':'" class="item-card">
        <div class="two-line">
          <el-input type="textarea" ref="fzjcInput" autosize v-model="patientObj.fzjc"></el-input>
          <div class="tow-btn">
            <el-button type="text" @click="turnTo('fzjc')">{{ $t('patients.yy') }}</el-button>
          </div>
        </div>
      </el-form-item>
      <!-- 初步诊断 -->
      <el-form-item :label="$t('patients.cbzd') + ':'" class="item-card">
        <div class="two-line">
          <el-input type="textarea" autosize v-model="patientZDList" disabled></el-input>
          <div class="tow-btn">
            <el-button type="text" @click="turnTo('zd')">{{ $t('patients.zd') }}</el-button>
          </div>
        </div>
      </el-form-item>
      <!-- 处理措施 -->
      <el-form-item :label="$t('patients.clcs') + ':'" class="item-card">
        <div class="two-line">
          <el-input type="textarea" :autosize="{ minRows: 2 }" v-model="patientLists" disabled></el-input>
          <div class="tow-btn">
            <div class="btn-sty">
              <el-button type="text" @click="turnTo('cf')">{{ $t('patients.cf') }}</el-button>
              <el-button type="text" @click="turnTo('fj')">{{ $t('patients.fj') }}</el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <!-- 处理意见 -->
      <el-form-item :label="$t('patients.clyj') + ':'" class="item-card">
        <div class="two-line">
          <el-input type="textarea" autosize v-model="patientObj.clyj"></el-input>
          <div class="tow-btn">
            <el-button type="text" @click="turnTo('Tgjc')">{{ $t('patients.yy') }}</el-button>
          </div>
        </div>
      </el-form-item>
      <!-- 健康教育 -->
      <el-form-item
        :label="$t('patients.jkjy') + ':'"
        class="item-card"
        style="border-bottom: none;"
      >
        <div class="two-line">
          <el-input type="textarea" autosize v-model="patientObj.jkjy"></el-input>
          <div class="tow-btn">
            <el-button type="text" @click="turnTo('Tgjc')">{{ $t('patients.yy') }}</el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { IBlxxForm, savePatientFile, aRemoveBcjl } from '@/api/cis/op/dctwork/patients'
import { Form } from 'element-ui'
import { AxiosResponse } from 'axios'
import { checkStrIsNull } from '@/utils'

export const NForm: IBlxxForm = {
  bmi: 0,
  bqgz: '',
  brid: 2012123060,
  dpy: '',
  ft: false,
  fx: false,
  fzjc: '',
  h: 0,
  hxkn: false,
  jkcfs: [
    {
      diagnoseid: '',
      diagnosename: '',
      empiid: '',
      examineunit: '',
      guideUserText: '',
      guideWayText: '',
      guidedate: '',
      guideuser: '',
      guideway: '',
      healthteach: '',
      icd10: '',
      id: '',
      inputUnitText: '',
      inputUserText: '',
      inputdate: '',
      inputunit: '',
      inputuser: '',
      lastModifyUnitText: '',
      lastModifyUserText: '',
      lastmodifydate: '',
      lastmodifyunit: '',
      lastmodifyuser: '',
      phrid: '',
      recipename: '',
      recordid: '',
      wayid: '',
    },
  ],
  jws: '',
  jzxh: 0,
  ks: false,
  leftcorrectedvision: 0,
  leftvision: 0,
  mxb: '',
  ot: false,
  p: 0,
  pageNum: 0,
  pageSize: 0,
  pz: false,
  qtlcbx: '',
  r: 0,
  rightcorrectedvision: 0,
  rightvision: 0,
  rsbz: 0,
  ssy: 0,
  szy: 0,
  t: 0,
  tgjc: '',
  w: 0,
  xbs: '',
  yt: false,
  zsxx: '',
}

@Component({
  name: 'Home',
})
export default class extends Vue {
  @Prop({ required: true }) private value!: any
  @Prop({ required: true }) private pnParam!: any
  @Prop({ required: true }) private patientZDList!: any
  @Prop({ required: true }) private patientYJList!: string
  @Prop({ required: true }) private patientCFList!: string
  @Prop({ required: true }) private patientZTList!: any
  get patientObj() {
    return this.value
  }

  set patientObj(val: any) {
    this.$emit('input', val)
  }
  // private patientLists: string = this.patientCFList  +  this.patientYJList

  get patientLists() {

    return this.patientCFList + this.patientYJList
  }

  private patientRules = {
    zsxx: [
      { required: true, message: '   ', trigger: 'blur' }
    ],
  }

  get bmi() {
    this.patientObj.bmi = this.patientObj.w / this.patientObj.h / this.patientObj.h * 100 * 100
    return !this.patientObj.bmi.toFixed(2).isNaN ? this.patientObj.bmi.toFixed(2) : null
  }


  // tab页跳转
  private turnTo(value: string) {
    if (this.pnParam.clinicId) {
      if (value == 'cf' || value == 'fj') {
        if (this.patientZDList == '' || !this.patientZDList) {
          this.$notify({
            type: 'warning',
            title: '请先录入诊断',
            message: ''
          })
          return;
        } else {
          this.$emit('openTab', value)
        }
      } else {
        this.$emit('openTab', value)
      }
    } else {
      this.$notify({
        type: 'warning',
        title: '请选择病人',
        message: ''
      })
      return;
    }
  }

  /**
   * @LastEditors: zhml
   * @Description: 保存病历信息
   * @param {type} params
   * @return: message
   */
  private save() {
    ; (this.$refs.form as Form).validate((valid) => {
      if (valid) {
        if (checkStrIsNull(this.patientObj.zsxx)) {
          this.$message.error('请先输入主诉信息')
          return;
        } else {
          this.patientObj.jzxh = this.pnParam.jzxh
          this.patientObj.brid = this.pnParam.brid
          // this.patientObj.jzlsh = this.pnParam.jzlsh
          savePatientFile(this.patientObj).then(() => {
            this.$notify({
              type: 'success',
              title: '保存成功',
              message: '',
            })
          })
        }

      }
    })
  }

  private copyBcjl() {
    let obj = {
      brid: this.pnParam.brid,
      jzxh: this.pnParam.jzxh,
      // jzlsh: this.pnParam.jzlsh
    }
    // copyBl(obj).then((res: AxiosResponse) => {
    //   this.patientObj = { ...res.data }
    // })
  }

  // 清空病历首页
  private clearPatientObj() {
    this.$confirm(`确定要清空病历信息吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      closeOnClickModal: false
    }).then(() => {
      aRemoveBcjl({ clinicId: this.pnParam.clinicId }).then((res: any) => {
        if (res) {
          this.$notify({
            title: '已清空',
            message: '',
            type: 'success'
          })
          this.$emit('setStatus')
        }
      })
    }).catch(() => {

    });
  }

  private print() { }
  private turnToGm() { }
  private turnToTgjc() { }

  mounted() {
  }

  private addSymbol(symbol: string) {
    if (this.patientObj.fzjc) {
      this.patientObj.fzjc = this.patientObj.fzjc + symbol;
    } else {
      this.patientObj.fzjc = symbol
    };
    (this.$refs.fzjcInput as any).focus()
  }
}
</script>

<style lang="scss" scoped>
.his-patient-home {
  padding-right: 0 !important;
  margin-right: 0 !important;
}
.btn {
  justify-content: start !important;
  el-button {
    padding: 4px 5px 4px 5px !important;
    span {
      .icon {
        font-size: 16px;
      }
    }
  }
}

.main-form {
  overflow-x: hidden;
}
// 原生表单
::v-deep .el-form {
  margin: 0px 8px 0 0 !important;
  padding: 4px 0 0 0 !important;

  .el-input__inner {
    line-height: 30px !important;
    height: 30px !important;
  }

  .el-form-item {
    display: inline-block;
    width: 100%;
    padding-bottom: 4px;
    margin-bottom: 0px !important;
    .el-form-item__label {
      font-size: 13px !important;
    }

    .el-input {
      height: 30px !important;
      line-height: 30px !important;
    }
    &.item-card {
      .el-input {
        width: calc(96% + 4px);
      }
      .el-textarea {
        width: calc(96% + 4px);
        padding-bottom: 4px;
      }
      .el-button {
        width: calc(5% - 8px);
        height: 28px;
        margin-left: 8px;
        padding: 0;
        justify-content: center;
      }
      .two-line {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        width: 100%;
        .tow-btn {
          // width: calc(5% - 8px);
          display: flex;
          flex-flow: column;
          justify-content: center;
          margin-right: -16px !important;
          .btn-sty {
            display: flex;
            flex-direction: column;
          }
        }
      }
    }

    .form-row {
      display: flex;
      flex-flow: row nowrap;
      margin-bottom: 6px;
      margin-top: 6px;
      .special-text {
        width: 36px;
      }
      .special {
        width: 80px;
        line-height: 30px !important;
        height: 30px !important;
        margin-right: 20px;
      }
    }
  }
}

::v-deep .el-textarea__inner {
  background: #f5f6f8;
}

::v-deep .el-input-group__append {
  line-height: 28px !important;
  height: 28px !important;
  width: 34px !important;
  border: 1px solid !important;
  border-radius: 0px 4px 4px 0px;
  padding: 0px !important;
  border-image: linear-gradient(135deg, rgba(236, 236, 236, 1), rgba(248, 248, 248, 1)) 1 1 !important;
  background: linear-gradient(149deg, rgba(255, 255, 255, 1) 0%, rgba(244, 244, 244, 1) 100%) !important;
  text-align: center !important;
}

::v-deep .el-input--medium {
  font-size: 12px;
}
</style>
