<!--
 * @Author: 袁明阳
 * @Date: 2021-03-30 15:00:33
 * @LastEditTime: 2021-04-07 18:33:20
 * @LastEditors: Please set LastEditors
 * @Description: 转诊处理
 * @FilePath: \web-op\src\views\his\op\reg\regDiagnosisManage\regManage\referral.vue
-->
<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="16">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <div class="title">转诊处理</div>
              <el-divider direction="vertical"></el-divider>
              <div class="btn">
                <el-button size="mini" type="text" @click="readCard"> <i class="icon his-caozuo-Details blue"></i>登记查询 </el-button>
                <el-button size="mini" type="text" @click="update"> <i class="icon his-btn-reset blue"></i>更新转诊医院 </el-button>
              </div>
              <el-divider direction="vertical"></el-divider>
              <div class="btn">
                <el-button size="mini" type="text" @click="referral"> <i class="icon his-discharge green"></i>转出 </el-button>
                <el-button size="mini" type="text" @click="cancel"> <i class="icon his-caozuo_cexiaozhuanyuan blue"></i>撤销转院 </el-button>
              </div>
            </div>
          </div>
          <div class="table-wrap">
            <table class="original-table">
              <tr>
                <th>名称</th>
                <th>值</th>
                <th>名称</th>
                <th>值</th>
                <th>名称</th>
                <th>值</th>
              </tr>
              <tr>
                <td>卡号</td>
                <td>{{ referralData.cardid }}</td>
                <td>姓名</td>
                <td>{{ referralData.personname }}</td>
                <td>登记类别</td>
                <td>{{ `门诊转院登记` }}</td>
              </tr>
              <tr>
                <td>第一家转出医院编码</td>
                <td>{{ referralData.zzxxs.length >= 1 ? referralData.zzxxs[0].zcjgdm : '' }}</td>
                <td>第二家转出医院编码</td>
                <td>{{ referralData.zzxxs.length >= 2 ? referralData.zzxxs[1].zcjgdm : '' }}</td>
                <td>第三家转出医院编码</td>
                <td>{{ referralData.zzxxs.length >= 3 ? referralData.zzxxs[2].zcjgdm : '' }}</td>
              </tr>
              <tr>
                <td>第一家转出医院名称</td>
                <td>{{ referralData.zzxxs.length >= 1 ? referralData.zzxxs[0].zcjgmc : '' }}</td>
                <td>第二家转出医院名称</td>
                <td>{{ referralData.zzxxs.length >= 2 ? referralData.zzxxs[1].zcjgmc : '' }}</td>
                <td>第三家转出医院名称</td>
                <td>{{ referralData.zzxxs.length >= 3 ? referralData.zzxxs[2].zcjgmc : '' }}</td>
              </tr>
              <tr>
                <td>第一家转入医院编码</td>
                <td>{{ referralData.zzxxs.length >= 1 ? referralData.zzxxs[0].zrjgdm : '' }}</td>
                <td>第二家转入医院编码</td>
                <td>{{ referralData.zzxxs.length >= 2 ? referralData.zzxxs[1].zrjgdm : '' }}</td>
                <td>第三家转入医院编码</td>
                <td>{{ referralData.zzxxs.length >= 3 ? referralData.zzxxs[2].zrjgdm : '' }}</td>
              </tr>
              <tr>
                <td>第一家转出医院名称</td>
                <td>{{ referralData.zzxxs.length >= 1 ? referralData.zzxxs[0].zrjgmc : '' }}</td>
                <td>第二家转出医院名称</td>
                <td>{{ referralData.zzxxs.length >= 2 ? referralData.zzxxs[1].zrjgmc : '' }}</td>
                <td>第三家转出医院名称</td>
                <td>{{ referralData.zzxxs.length >= 3 ? referralData.zzxxs[2].zrjgmc : '' }}</td>
              </tr>
              <tr>
                <td>第一家门诊转院日期</td>
                <td>{{ referralData.zzxxs.length >= 1 ? referralData.zzxxs[0].startdate : '' }}</td>
                <td>第二家门诊转院日期</td>
                <td>{{ referralData.zzxxs.length >= 2 ? referralData.zzxxs[1].startdate : '' }}</td>
                <td>第三家门诊转院日期</td>
                <td>{{ referralData.zzxxs.length >= 3 ? referralData.zzxxs[2].startdate : '' }}</td>
              </tr>
            </table>
          </div>
        </div>
      </el-col>
      <el-col class="ht" :span="8">
        <div class="his-module his-small">
          <div class="row">
            <div class="label labels">
              <span class="title">{{ projects }}</span>
              <div class="operate">
                <el-button type="primary" class="green-gra" icon="icon his-save" @click="preservationData" :loading="showLoading">保存</el-button>
              </div>
            </div>
          </div>
          <div class="">
            <el-form :model="formData" ref="formData" :rules="formRule" label-width="120px" class="clearfix">
              <!-- 卡号 -->
              <el-form-item :label="'卡号'" prop="carddata">
                <el-input v-model="formData.carddata" :placeholder="'请输入卡号'" @keyup.enter.native="swipeCard"> </el-input>
              </el-form-item>

              <!-- 证明单号 -->
              <el-form-item :label="'证明单号'" prop="djno" :hidden="isProjects" :rules="[{ required: !isProjects, message: '请选择单位', trigger: 'blur' }]">
                <el-input v-model="formData.djno" :placeholder="'请输入证明单号'"></el-input>
              </el-form-item>

              <!-- 转入医院编码 -->
              <el-form-item :label="'转入医院编码'" prop="zrjgbh">
                <!-- <search-select table-name="SYS_DICT_CONFIG" kid="75" v-model="formData.zrjgbh" :backfillValue="formData.zrjgbh" :placeholder="'请选择转入医院'" /> -->
                <el-select v-model="formData.zrjgbh" :placeholder="'请选择转入医院'" clearable @focus="changeData">
                  <el-option v-for="item in selectList" :key="item.dv" :label="item.dn" :value="item.dv"></el-option>
                </el-select>
              </el-form-item>

              <!-- 转出医院编码 -->
              <el-form-item :label="'转出医院编码'" prop="zcyybm" :hidden="!isProjects" :rules="[{ required: isProjects, message: '请选择单位', trigger: 'blur' }]">
                <!-- <search-select table-name="SYS_DICT_CONFIG" kid="75" v-model="formData.zcyybm" :backfillValue="formData.zcyybm" :placeholder="'请选择转出医院'" /> -->
                <el-select :disabled="!isProjects" v-model="formData.zcyybm" :placeholder="'请选择转入医院'" clearable @focus="changeData">
                  <el-option v-for="item in selectList" :key="item.dv" :label="item.dn" :value="item.dv"></el-option>
                </el-select>
              </el-form-item>

              <!-- 转入转出撤销日期 -->
              <el-form-item :label="'转入转出撤销日期'" prop="startdate">
                <el-date-picker type="date" v-model="formData.startdate" value-format="yyyyMMdd" :placeholder="'请选择日期'" class="date-wrapper"></el-date-picker>
              </el-form-item>

              <el-form-item :label="'卡类型'" prop="cardtype" hidden>
                <el-input v-model="formData.cardtype"></el-input>
              </el-form-item>
              <el-form-item :label="'姓名'" prop="personname" hidden>
                <el-input v-model="formData.personname"></el-input>
              </el-form-item>

              <div class="btns" style="display: none">
                <el-button type="primary" class="blue">转出</el-button>
                <el-button>撤销转院</el-button>
                <el-button>登记查询</el-button>
              </div>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aUpdate, aSwipeCard, aReadCard, aReferral, aCancel } from '@/api/his/op/reg/referral'
import { Form, Message } from 'element-ui'

declare interface IObj {
  [key: string]: string
}

@Component({
  name: '',
})
export default class extends Vue {
  private obj: IObj = {
    name: '',
    value: '',
  }
  private projects: any = '转出' // 显示想要执行的项目名称
  private isProjects: any = false // 是否是转出操作
  private selectList: any = [] // 转诊医院编码
  private showLoading:boolean = false
  private referralData: any = {
    zzxxs: [],
  } // 登记查询
  private formData: any = {
    djno: '', //证明单号
    zrjgbh: '', // 转入
    zcyybm: '', // 转出
    startdate: '',
    cardtype: '',
    carddata: '',
    personname: '',
  }
  // 必传项
  private formRule: any = {
    djno: [{ required: true, message: '证明单号不能为空', trigger: 'blur' }],
    zrjgbh: [{ required: true, message: '转入医院编码不能为空', trigger: 'blur' }],
    zcyybm: [{ required: true, message: '转出医院编码不能为空', trigger: 'blur' }],
    startdate: [{ required: true, message: '转入转出撤销日期不能为空', trigger: 'blur' }],
  }
  // 更新及转院
  private update() {
    this.projects = '转出'
    ;(this.$refs.formData as any).resetFields()
    // return
    aUpdate().then((res: any) => {
      if (res) {
        this.$notify({
          title: '更新成功',
          message: '',
          type: 'success',
        })
      }
    })
  }

  // 登记查询(读卡)
  private readCard() {
    this.projects = '转出'
    ;(this.$refs.formData as any).resetFields()
    aReadCard().then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        if (res.data) {
          this.referralData = res.data
          console.log(this.referralData)
        }
        // this.formData.cardtype = res.data.cardtype
        // this.formData.personname = res.data.personname
        // this.formData.carddata = res.data.cardid
      }
    })
  }

  // 登记查询(刷卡)
  private swipeCard() {
    aSwipeCard({ carddata: this.formData.carddata }).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
      }
    })
  }

  // 转院
  private referral() {
    this.projects = '转出'
    this.isProjects = false
    ;(this.$refs.formData as any).resetFields()
  }

  // 撤销转院
  private cancel() {
    this.projects = '撤销转院'
    this.isProjects = true
    ;(this.$refs.formData as any).resetFields()
  }

  // 保存
  private preservationData() {
    ;(this.$refs.formData as Form).validate((valid: boolean) => {
      if (valid) {
        this.showLoading = true
        // 转院操作
        if (this.projects == '转出') {
          let params = this.formData
          if (params.djno) {
            // return
            aReferral(params).then((res: any) => {
              this.showLoading = false
              if (res.errorCode == 'SUCCESS') {
                this.$notify({
                  title: '转出成功',
                  message: '',
                  type: 'success',
                })
              }
            }).catch((err:any)=>{
              this.showLoading = false
            })
          }
          // 撤销转院
        } else {
          let params: any = this.formData
          // console.log(params)
          // return
          aCancel(params).then((res: any) => {
            this.showLoading = false
            if (res.errorCode == 'SUCCESS') {
              this.$notify({
                title: '撤销成功',
                message: '',
                type: 'success',
              })
            }
          }).catch((err:any)=>{
            this.showLoading = false
          })
        }
      }
    })
  }
  private changeData() {
    if (this.selectList.length == 0) {
      this.selectList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REFERRAL_DICT : this.$store.state.webSqlDict.REFERRAL_DICT
    }
  }
  //初始化的周期函数
  created() {}
  mounted() {
    this.selectList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REFERRAL_DICT : this.$store.state.webSqlDict.REFERRAL_DICT
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  margin-top: 20px !important;
  padding: 0 30px !important;
}
.el-input {
  // width: 260px;
}
.search-select {
  display: block;
  // width: 260px;
}
.el-date-editor {
  // width: 260px !important;
}
.upper {
  height: auto;
}
.lower {
  flex-grow: 1;
  margin-top: 10px;
}
.table-wrap {
  table {
    td {
      &:nth-child(odd) {
        width: 18%;
      }
      &:nth-child(even) {
        // width: calc(100%/3*60%);
      }
    }
  }
}
.normal-form-wrap {
  .el-form {
    width: 30%;
    margin: 40px auto 0;
  }
}

.btns {
  margin-top: 30px;
  text-align: center;
  .el-button {
    display: inline-block;
    width: calc((100% - 20px) / 3);
    text-align: center;
  }
  .el-button--default {
    color: $second;
  }
}

.row .search ::v-deep .el-input__inner {
  width: 190px !important;
}
.row .labels {
  width: 100%;
  display: flex !important;
  justify-content: space-between !important;
}
</style>
