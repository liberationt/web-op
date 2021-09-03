<!--
 * @Date: 2020-05-14 11:05:48
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-21 15:32:02
 * @description: 病历模板维护
 -->
<template>
  <div class="content his-patient-medical">
    <el-row class="ht" :gutter="10" style="width: 100%;">
      <div class="top-header his-small">
        <div class="main-header">
          <el-radio-group v-model="searchData.sslb" @change="refreshList">
            <el-radio :label="1" name="个人">个人</el-radio>
            <el-radio :label="2" name="科室">科室</el-radio>
            <el-radio :label="3" name="全院">全院</el-radio>
            <el-radio :label="4" name="B类模板">B类模板</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div style="height: calc(100% - 38px)">
        <el-col class="mt10 ht" :span="8">
          <div class="his-module his-small">
            <pagenation-list
              ref="pageTable"
              v-model="tableDatas"
              data-url="/op-service/gyblmb/queryPage"
              http-method="post"
              :list-height="listSlotHeight"
              :searchData="searchData"
            >
              <div slot="header" class="row" v-if="!isQuote">
                <div class="label">
                  <div class="searchTitle">搜索</div>
                  <el-input
                    v-model="searchData.pydm"
                    :placeholder="$t('hospitalDataDict.formValidPyCode')"
                    @change="searchList"
                  >
                    <i slot="prefix" class="el-input__icon icon his-search searchIcon"></i>
                  </el-input>
                  <el-divider direction="vertical" class="mr4"></el-divider>
                  <div class="btn">
                    <el-button size="mini" type="text" :disabled="!isAdd" @click="handleAdd">
                      <i class="icon his-btn-add"></i>
                      <span>{{ $t('common.add') }}</span>
                    </el-button>
                  </div>
                </div>
              </div>
              <div slot="header" class="row" v-if="isQuote">
                <div class="label">
                  <span class="title">搜索</span>
                  <el-input
                    v-model="searchData.pydm"
                    :placeholder="$t('hospitalDataDict.formValidPyCode')"
                    @change="searchList"
                  >
                    <i slot="prefix" class="el-input__icon icon his-search"></i>
                  </el-input>
                  <el-divider direction="vertical" class="mr4"></el-divider>
                  <div class="btn">
                    <el-button size="mini" type="text" @click="handleTransferIn">
                      <i class="icon his-btn-save green"></i>
                      <span>{{ '调入' }}</span>
                    </el-button>
                  </div>
                </div>
              </div>
              <el-table
                :data="tableDatas"
                border
                stripe
                :highlight-current-row="true"
                slot="list"
                fit
                @row-click="handleRowClick"
                :height="listSlotHeight"
                class="scroll-bar"
              >
                <!-- 序号 -->
                <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
                <!-- 模板名称 -->
                <el-table-column :label="$t('medicalTemp.mbmc')" min-width="120">
                  <template slot-scope="scope">
                    <span v-if="!scope.row.webRowStatus">{{ scope.row.mbmc }}</span>
                    <el-input size="mini" v-else v-model="scope.row.mbmc" @click.stop></el-input>
                  </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column :label="$t('table.actions')" width="80" align="center" v-if="!isQuote">
                  <template slot-scope="scope">
                    <!-- 修改,保存按钮 -->
                    <!-- <el-tooltip :content="$t('common.edit')" effect="light" v-if="!scope.row.webRowStatus">
					  <el-button class="blue" @click.stop="handleEdit(scope.row)">
						<i class="icon his-edit"></i>
					  </el-button>
                    </el-tooltip>-->
                    <el-tooltip
                      :content="$t('common.save')"
                      effect="light"
                      v-if="scope.row.webRowStatus"
                    >
                      <el-button class="blue" @click="handleSave(scope.row)">
                        <i class="icon his-right_caozuo_baochun" />
                      </el-button>
                    </el-tooltip>

                    <!-- 删除 -->
                    <el-tooltip
                      :content="$t('common.delete')"
                      effect="light"
                      v-if="!scope.row.webRowStatus"
                    >
                      <el-popconfirm
                        class="ml8"
                        hideIcon
                        :cancelButtonText="$t('common.cancel')"
                        :confirmButtonText="$t('common.confirm')"
                        :title="$t('sysManage.confirmDeleted')"
                        @confirm="handleDelete(scope.row)"
                      >
                        <el-button slot="reference" class="red" @click.stop>
                          <i class="icon his-del his-cancellationicon"></i>
                        </el-button>
                      </el-popconfirm>
                    </el-tooltip>
                    <!-- 停用/启用-->
                    <el-tooltip
                      v-if="!scope.row.webRowStatus"
                      :content="
                scope.row.qybz == 0 ? $t('common.disable') : $t('common.enable')
              "
                      effect="light"
                    >
                      <el-popconfirm
                        class="ml8"
                        hideIcon
                        :confirmButtonText="
                  scope.row.qybz == 0
                    ? $t('common.enable')
                    : $t('common.disable')
                "
                        :cancelButtonText="$t('common.cancel')"
                        :title="
                  scope.row.qybz == 0
                    ? $t('sysManage.confirmAutomated')
                    : $t('sysManage.confirmDisabled')
                "
                        @confirm="handleEnable(scope.row)"
                      >
                        <el-button
                          slot="reference"
                          :class="[scope.row.qybz == 0 ? 'red' : 'green']"
                          @click.stop
                        >
                          <i
                            class="icon"
                            :class="[
                      scope.row.qybz == 0 ? 'his-disabled' : 'his-automated',
                    ]"
                          ></i>
                        </el-button>
                      </el-popconfirm>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </pagenation-list>
          </div>
        </el-col>
        <el-col class="mt10 ht" :span="16">
          <div class="his-module his-small medical_form">
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">{{ $t('medicalTemp.mbxq') }}</h1>
              </div>
              <div class="operate">
                <el-button
                  type="primary"
                  class="green-gra"
                  icon="icon his-save"
                  size="mini"
                  @click="handleSaveRight"
                  v-if="!isQuote"
                >{{ $t('common.save') }}</el-button>
              </div>
            </div>
            <el-form :model="forms" ref="formValidate" :rules="rules" label-width="68px">
              <el-form-item :label="$t('medicalTemp.zsxx')" prop="zsxx">
                <el-input
                  type="textarea"
                  v-model.trim="forms.zsxx"
                  :placeholder="$t('medicalTemp.zsxx')"
                  :disabled="isQuote"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('medicalTemp.xbs')" prop="xbs">
                <el-input type="textarea" v-model="forms.xbs" :placeholder="$t('medicalTemp.xbs')" :disabled="isQuote"></el-input>
              </el-form-item>
              <el-form-item :label="$t('medicalTemp.jws')" prop="jws">
                <el-input type="textarea" v-model="forms.jws" :placeholder="$t('medicalTemp.jws')" :disabled="isQuote"></el-input>
              </el-form-item>
              <el-form-item :label="$t('medicalTemp.tgjc')" prop="tgjc">
                <el-input
                  type="textarea"
                  v-model="forms.tgjc"
                  :placeholder="$t('medicalTemp.tgjc')"
                  :disabled="isQuote"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('medicalTemp.fzjc')" prop="fzjc">
                <el-input
                  type="textarea"
                  v-model="forms.fzjc"
                  :placeholder="$t('medicalTemp.fzjc')"
                  :disabled="isQuote"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('medicalTemp.mbList')" prop="mbList">
                <el-input
                  type="textarea"
                  v-model="forms.mbList[0].healthTeach"
                  :placeholder="$t('medicalTemp.mbList')"
                  disabled
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { IMedicalForm, IMedicalMBList, addTemp, deleteTemp, enable, disable, queryDetail, saveTemp, tranferIn } from '@/api/cis/op/dctwork/medicalTemp'
import { isNullOrUndefined } from 'util'
import { Form } from 'element-ui'

const mbListParam: any[] = [
  {
    icd10: 'A16.202',
    diagnoseId: '0000000000003640',
    diagnoseName: '感冒',
    diagnoseNamePy: 'gm',
    healthTeach: '多饮水，注意休息，门诊随访。',
    inputDate: '2015-08-26',
    inputUnit: '310112',
    inputUser: 'system',
    lastModifyDate: '2015-09-01',
    lastModifyUnit: '310112',
    lastModifyUser: 'system',
    orderNum: 1,
    recipeName: '自定义',
    recipeNamePy: 'zdy',
    recordId: '0000000000000272',
  },
]
const NMedicalForm: IMedicalForm = {
  fzjc: '',
  jlxh: 1,
  jws: '',
  mbList: mbListParam,
  tgjc: '',
  xbs: '',
  zsxx: '',
  webRowStatus: false,
}
//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'ExaminesSuite',
  components: {},
})
export default class extends Vue {
  @Prop({ required: false }) private isQuote!: boolean
  private tableDatas: IMedicalForm[] = []
  private forms: IMedicalForm = { ...NMedicalForm }
  private listSlotHeight: number = 0
  private isAdd: boolean = true
  private searchData: any = {
    pageNum: 1,
    pageSize: 10,
    pydm: '',
    sslb: 1,
  }
  private rules: any = {
    zsxx: [{ required: true, message: '请输入主诉信息', trigger: 'blur' }],
  }
  created() {
    if (this.isQuote) {
      this.listSlotHeight = Vue.prototype.PageHeight - 270
    } else {
      this.listSlotHeight = Vue.prototype.PageHeight - 150
    }
  }
  mounted() {
    if (!this.isQuote) {
      this.getList()
      setTimeout(() => {
        // this.initDetail(this.tableDatas[0].jlxh)
      }, 500)
    } else {
      this.getList()
    }
  }
  // private handleEdit(value: IMedicalForm) {
  //   var list = this.tableDatas.filter(item => item.webRowStatus)
  //   this.isAdd = !this.isAdd
  //   if (list.length == 0) {
  //     value.webRowStatus = !value.webRowStatus
  //   } else {
  //     this.$notify({
  //       type: 'warning',
  //       message: '请先保存已修改的数据',
  //       title: ''
  //     })
  //   }
  // }

  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }
  private searchList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

  private initDetail(val: number) {
    queryDetail({ jlxh: val }).then((res: any) => {
      this.forms = res.data
    })
  }
  //新增
  private handleAdd() {
    this.forms = { ...NMedicalForm }
    this.isAdd = false
    let param = Object.assign({}, NMedicalForm)
    param.webRowStatus = true
    this.tableDatas.splice(0, 0, param)
  }

  private handleDelete(value: IMedicalForm) {
    // console.log('sfsdf', value)
    deleteTemp({ jlxh: value.jlxh }).then(() => {
      this.$notify({
        type: 'success',
        title: '删除成功',
        message: '',
      })
      this.refreshList(this.searchData.sslb)
    })
  }

  private handleSave(value: any) {
    this.isAdd = !this.isAdd
    let param = {
      mbmc: value.mbmc,
      sslb: this.searchData.sslb,
    }
    if (!isNullOrUndefined(value.mbmc)) {
      addTemp(param).then(() => {
        this.$notify({
          type: 'success',
          title: '新增成功',
          message: '',
        })
        this.refreshList(param.sslb)
      })
    }
  }

  private handleEnable(value: any) {
    if (value.qybz === 0) {
      disable({ jlxh: value.jlxh }).then(() => {
        this.$notify.success({
          type: 'success',
          title: '已启用',
          message: '',
        })
        this.refreshList(this.searchData.sslb)
      })
    } else {
      enable({ jlxh: value.jlxh }).then(() => {
        this.$notify.success({
          type: 'success',
          title: '已停用',
          message: '',
        })
        this.refreshList(this.searchData.sslb)
      })
    }
  }

  private refreshList(value: string) {
    if (value) {
      this.isAdd = true
      this.searchData.sslb = value
      this.searchList()
      setTimeout(() => {
        // this.initDetail(this.tableDatas[0].jlxh)
      }, 500)
    }
  }

  private handleSaveRight() {
    ;(this.$refs.formValidate as Form).validate((valid: any) => {
      if (valid) {
        this.forms.mbList = [...mbListParam]
        saveTemp(this.forms).then(() => {
          this.$notify({
            type: 'success',
            title: '保存成功',
            message: '',
          })
        })
      }
    })
  }

  private handleRowClick(value: IMedicalMBList) {
    this.dataJlxh = value.jlxh
    this.sign = true
    // console.log(this.sign)
    if (!value.jlxh) return null
    queryDetail({ jlxh: value.jlxh }).then((res: any) => {
      this.forms = res.data
      if (res.data.jfckRecords && res.data.jfckRecords.length > 0) {
        this.forms.mbList = res.data.jfckRecords
      } else {
        this.forms.mbList = [...mbListParam]
      }
    })
  }

  //调入
  private sign: boolean = false //判断用户是否点击行
  private dataJlxh: any = ''
  private handleTransferIn() {
    if (this.sign === false) {
      this.$notify({
        title: '请选择表格中一行数据',
        message: '',
        type: 'warning',
      })
    } else {
      tranferIn({ jlxh: this.dataJlxh }).then((res: any) => {
        // console.log(res)
        this.$emit('openTab', 'home')
        this.$emit('showMsg', res.data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.his-patient-medical {
  padding: 8px 10px;
  .medical_form {
    width: 100%;
    .el-form {
      margin: 16px 0 0 0 !important;
    }
  }

  .top-header {
    position: relative;
    padding: 11px 16px;
    background: #fff;
    border-radius: 8px;
  }
  ::v-deep .el-form {
    margin: 16px 30px 45px !important;
    padding: 0px !important;
  }
  .el-form-item {
    .input-card {
      width: 85%;
    }
    .el-button {
      vertical-align: top;
      width: calc(15% - 8px);
      height: 28px;
      margin-left: 8px;
      padding: 0;
      justify-content: center;
    }
  }

  .label {
    height: 28px;
    .title {
      font-size: 13px;
      width: 30px;
      margin-right: 4px !important;
    }
  }
  ::v-deep .el-radio__label {
    font-size: 13px;
    padding-left: 4px;
  }
  .el-radio {
    margin-right: 10px;
  }

  .label {
    ::v-deep .el-input {
      width: 190px;
      height: 28px !important;
      .el-input__prefix {
        margin: 0px 8px 0 10px !important;
      }
    }
  }

  .mr4 {
    margin-right: 4px;
  }
}
</style>
