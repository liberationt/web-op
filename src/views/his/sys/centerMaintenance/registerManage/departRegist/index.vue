<!--
 * @Author: dmj
 * @LastEditTime: 
 * @LastEditors:
 * @Description:机构维护
 * @FilePath: 
-->
<template>
  <div class="content">
    <div class="right-side">
      <div class="main-bottom">
        <div
          class="his-module ht his-patient-tree"
          style="flex-shrink: 0; padding: 10px"
          :style="{
              width: treeWidth + 'px',
              height: listSlotHeight - 10 + 'px',
            }"
        >
          <div slot="header" class="row" v-show="!folderSide" style="padding-bottom: 8px">
            <div class="label">
              <div class="title">机构维护</div>
            </div>
          </div>
          <div class="open action" v-if="folderSide">
            <i class="icon his-card-open gray" />
          </div>
          <el-tree
            ref="tree"
            :data="leftTreeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            default-expand-all
            class="scroll-bar"
            :highlight-current="true"
            @node-click="handleNodeClick"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <i class="icon" :class="data.childrenList.length ? getClass(node) : 'his-tree-submen'"></i>
              <span>{{ node.label }}</span>
              <span style="position: absolute;right:5px">
                <el-dropdown :trigger="data.stopFlag == '1' ? '' : 'click'">
                  <span class="is_icon">
                    <i
                      class="icon"
                      :class="data.stopFlag == '1' ? 'his-shuxing_yizhuxiao' : 'his-caidanliebiao-more1'"
                    ></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleAdd(node,data)">新增</el-dropdown-item>
                    <el-dropdown-item @click.native="handleEdit(node,data)">修改</el-dropdown-item>
                    <el-dropdown-item @click.native="handleDelete(node,data)">注销</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </span>
          </el-tree>
        </div>

        <div
          class="main-middle"
          :style="{ height: listSlotHeight - 10 + 'px',marginLeft: 10 + 'px'}"
          :class="folderSide ? 'main-width1' : 'main-width2'"
        >
          <el-row class="ht">
            <el-col class="ht" :span="24">
              <div class="his-module his-small his-sys-module">
                <div slot="header" class="row his-sys-row">
                  <div class="label">
                    <h1 class="title">{{ isUpd ? $t('common.add') : $t('common.edit')}}</h1>
                  </div>
                  <div class="operate">
                    <el-button
                      type="primary"
                      class="green-gra"
                      icon="icon his-save"
                      size="mini"
                      @click="handleSave"
                    >{{$t('common.save')}}</el-button>
                  </div>
                </div>
                <el-form
                  label-width="86px"
                  :model="ruleForm"
                  ref="ruleFormRef"
                  style="margin:10px auto"
                  class="retrieval"
                  :rules="rule"
                >
                  <el-row type="flex">
                    <el-form-item label="医院医保全称" prop="affiliatedName">
                      <el-input placeholder="请输入" v-model="ruleForm.affiliatedName" />
                    </el-form-item>
                    <el-form-item label="医疗机构代码" prop="hospitalCode">
                      <el-input placeholder="请输入" v-model="ruleForm.hospitalCode"></el-input>
                    </el-form-item>
                    <el-form-item label="医疗机构名称" prop="hospitalName">
                      <el-input placeholder="请输入" v-model="ruleForm.hospitalName" @blur="getCode"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row type="flex">
                    <el-form-item label="上级医疗机构ID" prop="parentHospitalId" disabled>
                      <el-input placeholder="请输入" v-model="ruleForm.parentHospitalId" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="地址-门牌号码" prop="addrNumber">
                      <el-input placeholder="请输入" v-model="ruleForm.addrNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="核定床位" prop="approvedBed">
                      <el-input placeholder="请输入" v-model="ruleForm.approvedBed" type="number"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row type="flex">
                    <el-form-item label="核定编制" prop="approvedPreparation">
                      <el-input placeholder="请输入" v-model="ruleForm.approvedPreparation" />
                    </el-form-item>
                    <el-form-item label="启用时间" prop="beginDate">
                      <el-date-picker
                        type="datetime"
                        placeholder="请选择日期"
                        v-model="ruleForm.beginDate"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        class="date-wrapper"
                        clearable
                      ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="法人代表手机" prop="chargeMobileNumber">
                      <el-input v-model="ruleForm.chargeMobileNumber" placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row type="flex">
                    <el-form-item label="医疗机构负责人" prop="chargeName">
                      <el-input placeholder="请输入" v-model="ruleForm.chargeName" />
                    </el-form-item>
                    <el-form-item label="法人代表身份证" prop="chargeRecordNumber">
                      <el-input v-model="ruleForm.chargeRecordNumber" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="法人代表电话" prop="chargeTelephone">
                      <el-input v-model="ruleForm.chargeTelephone" placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row type="flex">
                    <el-form-item label="行政区划">
                      <cascade-address
                        :backfillObj="backfillObj"
                        v-model="addressValue"
                        :key="cascadeIndex"
                        style="width:416px"
                      />
                    </el-form-item>
                    <el-form-item label="国籍代码" prop="countryId">
                      <el-input placeholder="请输入" v-model="ruleForm.countryId" />
                    </el-form-item>
                  </el-row>
                  <el-row type="flex">
                    <el-form-item label="单位电子邮箱" prop="email">
                      <el-input placeholder="请输入" v-model="ruleForm.email" />
                    </el-form-item>
                    <el-form-item label="停用时间" prop="endDate">
                      <el-date-picker
                        type="datetime"
                        placeholder="请选择日期"
                        v-model="ruleForm.endDate"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        class="date-wrapper"
                        clearable
                      ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="数据创建时间" prop="gmtCreate">
                      <el-date-picker
                        type="datetime"
                        placeholder="请选择日期"
                        v-model="ruleForm.gmtCreate"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        class="date-wrapper"
                        clearable
                      ></el-date-picker>
                    </el-form-item>
                  </el-row>
                  <el-row type="flex">
                    <el-form-item label="数据修改时间" prop="gmtModify">
                      <el-date-picker
                        type="datetime"
                        placeholder="请选择日期"
                        v-model="ruleForm.gmtModify"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        class="date-wrapper"
                        clearable
                      ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="卫生机构类别代码" prop="hospitalClassId">
                      <el-input placeholder="请输入" v-model="ruleForm.hospitalClassId"></el-input>
                    </el-form-item>
                    <el-form-item label="医院等级代码" prop="hospitalGradeId">
                      <el-input placeholder="请输入" v-model="ruleForm.hospitalGradeId"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row type="flex">
                    <el-form-item label="医疗机构组织机构代码" prop="organizationCode">
                      <el-input placeholder="请输入" v-model="ruleForm.organizationCode" />
                    </el-form-item>
                    <el-form-item label="组织结构类型" prop="organizationType">
                      <el-input placeholder="请输入" v-model="ruleForm.organizationType"></el-input>
                    </el-form-item>
                    <el-form-item label="邮政编码" prop="phoneNumber">
                      <el-input placeholder="请输入" v-model="ruleForm.phoneNumber"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row type="flex">
                    <el-form-item label="注册ID关联官网医疗结构" prop="registId">
                      <el-input placeholder="请输入" v-model="ruleForm.registId" />
                    </el-form-item>
                    <el-form-item label="单位撤销日期" prop="revokeDate">
                      <el-date-picker
                        type="date"
                        placeholder="请选择日期"
                        v-model="ruleForm.revokeDate"
                        value-format="yyyy-MM-dd"
                        class="date-wrapper"
                        clearable
                      ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="第二医疗机构名称" prop="secondHospitalName">
                      <el-input placeholder="请输入" v-model="ruleForm.secondHospitalName"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row type="flex">
                    <el-form-item label="医院简称" prop="secondName">
                      <el-input placeholder="请输入" v-model="ruleForm.secondName" />
                    </el-form-item>
                    <el-form-item label="单位成立日期" prop="setupDate">
                      <el-date-picker
                        type="date"
                        placeholder="请选择日期"
                        v-model="ruleForm.setupDate"
                        value-format="yyyy-MM-dd"
                        class="date-wrapper"
                        clearable
                      ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="医疗机构联系电话" prop="telephone">
                      <el-input placeholder="请输入" v-model="ruleForm.telephone"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row type="flex">
                    <el-form-item label="机构网站" prop="website">
                      <el-input placeholder="请输入" v-model="ruleForm.website" />
                    </el-form-item>
                    <el-form-item label="数据版本" prop="dataVersion">
                      <el-input placeholder="请输入" v-model="ruleForm.dataVersion"></el-input>
                    </el-form-item>
                    <el-form-item label="拼音码" prop="pyCode">
                      <el-input placeholder="请输入" v-model="ruleForm.pyCode"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row type="flex">
                    <el-form-item label="五笔码" prop="wbCode">
                      <el-input placeholder="请输入" v-model="ruleForm.wbCode"></el-input>
                    </el-form-item>
                  </el-row>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { flatten } from 'lodash'
import { regIDCard, regPhone, regTel, regEmail } from '@/utils/validate.ts'
import { getTreeData, saveAddData, saveEdit, mechanismMentStop, getMnemonic } from '@/api/his/sys/centerMaintenance/registerManage/departResigter.ts'
@Component({
  name: 'departRegist',
  filters: {},
  components: {}
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private tableData: Array<any> = [] //中间表格
  private isCreateNewJob: boolean = false
  private searchData: object = {} //搜索参数
  private isUpd: boolean = true //新增或编辑
  private addressValue: string = '' // 省市区id，字符串
  private cascadeIndex: number = 1
  private isCancel: boolean = false // 判断注销状态
  private stopFlag: string | number = 0 // 禁用状态值
  private backfillObj: any = {
    // 初始化省市区
    provinceId: 310000,
    cityId: 310100,
    areaId: 0
  }
  private ruleForm: any = {
    hospitalId: '',
    provinceId: '',
    cityId: '',
    countyId: '',
    affiliatedName: '',
    hospitalCode: '',
    hospitalName: '',
    parentHospitalId: 0,
    addrNumber: '',
    approvedBed: '',
    approvedPreparation: '',
    beginDate: '',
    chargeMobileNumber: '',
    chargeName: '',
    chargeRecordNumber: '',
    chargeTelephone: '',
    countryId: '',
    email: '',
    endDate: '',
    gmtCreate: '',
    gmtModify: '',
    hospitalClassId: '',
    hospitalGradeId: '',
    organizationCode: '',
    organizationType: '',
    phoneNumber: '',
    registId: '',
    revokeDate: '',
    secondHospitalName: '',
    secondName: '',
    setupDate: '',
    telephone: '',
    website: '',
    dataVersion: '',
    pyCode: '',
    wbCode: ''
  } //表单数据
  //查机构分类树
  private getTreeDatas() {
    getTreeData({}).then((res: any) => {
      console.log(res)
      this.leftTreeData = res.data
    })
  }
  //树点击事件
  private handleNodeClick(data: any) {
    // this.$nextTick(() => {
    //   const el: any = this.$refs.ruleFormRef
    //   el.resetFields()
    //   this.ruleForm = JSON.parse(JSON.stringify(data))
    //   console.log(this.ruleForm)
    // })
    this.stopFlag = data.stopFlag
    if (data.childrenList.length) {
      data.childrenList.forEach((item: any) => {
        if (item.stopFlag == 0) {
          this.isCancel = false
          return
        } else {
          this.isCancel = true
        }
      })
    } else {
      this.isCancel = true
    }
    this.ruleForm = JSON.parse(JSON.stringify(data))
    this.backfillObj.provinceId = Number(this.ruleForm.provinceId)
    this.backfillObj.cityId = Number(this.ruleForm.cityId)
    this.backfillObj.areaId = Number(this.ruleForm.countyId)
    this.cascadeIndex++
  }

  // 树新增
  private handleAdd(node: any, data: any) {
    this.isUpd = true
    this.ruleForm.hospitalId = null
    this.$nextTick(() => {
      const el: any = this.$refs.ruleFormRef
      el.resetFields()
      this.ruleForm.parentHospitalId = data.hospitalId
    })

    this.addressValue = ''
    this.backfillObj.provinceId = 310000
    this.backfillObj.cityId = 310100
    this.backfillObj.areaId = 0
    this.cascadeIndex++
  }
  // 树修改
  private handleEdit(node: any, data: any) {
    this.isUpd = false
    this.isCancel = true
    console.log(node, data)
    this.ruleForm = JSON.parse(JSON.stringify(data))
    this.backfillObj.provinceId = Number(this.ruleForm.provinceId)
    this.backfillObj.cityId = Number(this.ruleForm.cityId)
    this.backfillObj.areaId = Number(this.ruleForm.countyId)
    this.cascadeIndex++
  }
  //表单验证
  private rule: any = {
    affiliatedName: [{ required: true, message: '请输入医院医保全称', trigger: 'blur' }],
    hospitalCode: [{ required: true, message: '请输入医疗机构代码', trigger: 'blur' }],
    hospitalName: [{ required: true, message: '请输入医疗机构名称', trigger: 'blur' }],
    parentHospitalId: [{ required: true, message: '请输入上级医疗机构ID', trigger: 'blur' }],
    organizationCode: [{ required: true, message: '请输入医疗机构组织机构代码', trigger: 'blur' }],
    chargeMobileNumber: [{ pattern: regPhone, message: window.ele.$i18n.t('emp.vdPhone'), trigger: 'blur' }],
    chargeTelephone: [{ pattern: regTel, message: window.ele.$i18n.t('emp.vdTel'), trigger: 'blur' }],
    telephone: [{ pattern: regTel, message: window.ele.$i18n.t('emp.vdTel'), trigger: 'blur' }],
    email: [{ pattern: regEmail, message: window.ele.$i18n.t('emp.vdEmail'), trigger: 'blur' }],
    chargeRecordNumber: [{ pattern: regIDCard, message: window.ele.$i18n.t('emp.vdIDCard2'), trigger: 'blur' }]
  }
  private leftTreeData: Array<any> = []
  private defaultProps: object = {
    children: 'childrenList',
    label: 'hospitalName'
  }

  // 保存
  private handleSave() {
    ;(this.$refs.ruleFormRef as Form).validate((valid: boolean) => {
      if (valid) {
        if (this.addressValue != '') {
          let arr = this.addressValue.split(',')
          this.ruleForm.provinceId = arr[0]
          this.ruleForm.cityId = arr[1]
          this.ruleForm.countyId = arr[2]
        }
        if (this.ruleForm.hospitalId) {
          if (this.isCancel) {
            // 修改机构
            saveEdit(this.ruleForm).then((res: any) => {
              if (res.errorCode == 'SUCCESS') {
                this.$notify({
                  title: '修改成功',
                  message: '',
                  type: 'success'
                })
                this.getTreeDatas()
                this.isUpd = true
                this.$nextTick(() => {
                  const el: any = this.$refs.ruleFormRef
                  el.resetFields()
                })
              }
            })
          } else {
            this.$message({
              message: '该科室已注销，不可保存修改！',
              type: 'warning'
            })
          }
        } else {
          // 新增机构
          saveAddData(this.ruleForm).then((res: any) => {
            if (res.errorCode == 'SUCCESS') {
              console.log(res)
              this.$notify({
                title: '新增成功',
                message: '',
                type: 'success'
              })
              this.getTreeDatas()
              this.isUpd = true
              this.$nextTick(() => {
                const el: any = this.$refs.ruleFormRef
                el.resetFields()
              })
            }
          })
        }
      }
    })
  }

  // 机构注销
  private handleDelete(node: any, item: any) {
    this.$confirm('注销操作将无法恢复，是否继续？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      if (this.isCancel) {
        let params = Number(item.hospitalId)
        mechanismMentStop({ hospitalId: params }).then((res: any) => {
          if (res.errorCode == 'SUCCESS') {
            this.$notify({
              title: this.$t('common.disabled').toString(),
              message: '',
              type: 'success'
            })
            this.getTreeDatas()
          }
        })
      } else {
        this.$message({
          message: '子级机构未全部注销，该机构不可注销！',
          type: 'warning'
        })
      }
    })

    console.log(item)
  }

  // activated() {}

  private getClass(node: any) {
    if (node.expanded) {
      return 'his-tree-Folder'
    } else {
      return 'his-tree-Folder_unfold'
    }
  }

  private labelPosition: string = 'right'
  private formLabelAlign: object = {
    name: '',
    region: '',
    type: ''
  }
  private treeWidth: number = 220
  private folderSide: boolean = false
  private isDisabled: boolean = false
  // private isHideFolder() {
  //   if (this.folderSide) {
  //     this.treeWidth = 220
  //     this.folderSide = !this.folderSide
  //   } else {
  //     this.treeWidth = 24
  //     this.folderSide = !this.folderSide
  //   }
  // }

  // 获取拼音码与五笔码
  private getCode() {
    if (this.ruleForm.hospitalName) {
      getMnemonic({ typeList: ['py', 'wb'], value: this.ruleForm.hospitalName }).then((res: any) => {
        if (res) {
          this.ruleForm.pyCode = res.data.py
          this.ruleForm.wbCode = res.data.wb
        }
      })
    } else {
      this.ruleForm.pyCode = ''
      this.ruleForm.wbCode = ''
    }
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    this.getTreeDatas()
  }
}
</script>
<style lang="scss" scoped>
// .row .label .el-input {
//   width: 190px;
// }
// .his-sys-module {
//   padding: 8px 10px !important;
// }
::v-deep .action span {
  color: #ffffff;
}

.his-sys-row {
  padding-bottom: 8px !important;
}

.right-side {
  width: calc(100%);
  border-radius: 8px;
  //   上方模块

  .main-bottom {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;

    .his-module {
      /*padding: 6px 10px !important;*/

      .row {
        height: 37px;
        padding-bottom: 0;

        .label {
          height: 37px !important;
        }
      }
    }
  }

  // 中间
  .main-width1 {
    width: calc(100% - 34px);
  }

  .main-width2 {
    width: calc(100% - 174px);
  }

  .main-middle {
    display: flex;
    flex-direction: column;

    ::v-deep .el-tabs__header {
      margin-bottom: 8px;
      background: #fff;
      border-radius: 8px;
      padding: 6px 0 6px 10px;
    }

    .btn-child {
      display: flex;
      flex-flow: row nowrap;
      border-bottom: 1px solid #f0f0f0;
      padding: 0 0 0 16px;

      .middle-btn {
        display: flex;
        flex-flow: row nowrap;

        span {
          margin-right: 24px;
          margin-top: 16px;

          &.actived-btn {
            color: #1485ff;
            border-bottom: 2px solid #1485ff;
            padding-bottom: 8px;
          }
        }
      }
    }
  }
  .content .his-small .el-form .el-form-item .el-form-item__label {
    line-height: 12px !important;
  }
}
.icon his-tree-Folder {
  margin-right: 8px;
}
.icon .his-tree-Folder_unfold {
  margin-right: 8px;
}
span {
  font-size: 13px;
  color: #222b31;
}
.content .his-small ::v-deep .el-form .el-form-item .el-form-item__label {
  line-height: 12px !important;
}

.tags-view-item {
  display: inline-block;
  cursor: pointer;
  height: 32px;
  line-height: 32px;
  color: #9ca0ab;
  background: #eceded;
  padding: 0 8px;
  font-size: 12px;
  margin-left: 5px;
  border-radius: 8px;

  &:first-of-type {
    margin-left: 15px;
  }
  &:last-of-type {
    margin-right: 15px;
  }
  &.active {
    background: linear-gradient(315deg, rgba(45, 187, 255, 1) 0%, rgba(20, 133, 255, 1) 100%);
    color: #fff;
  }
}

// 中间
.main-width1 {
  width: calc(100% - 34px);
}

.main-width2 {
  width: calc(100% - 174px);
}

.main-middle {
  display: flex;
  flex-direction: column;

  ::v-deep .el-tabs__header {
    margin-bottom: 8px;
    background: #fff;
    border-radius: 8px;
    padding: 6px 0 6px 10px;
  }

  .btn-child {
    display: flex;
    flex-flow: row nowrap;
    border-bottom: 1px solid #f0f0f0;
    padding: 0 0 0 16px;

    .middle-btn {
      display: flex;
      flex-flow: row nowrap;

      span {
        margin-right: 24px;
        margin-top: 16px;

        &.actived-btn {
          color: #1485ff;
          border-bottom: 2px solid #1485ff;
          padding-bottom: 8px;
        }
      }
    }
  }

  .choose-style {
    display: flex;
    flex-flow: row nowrap;
    padding-left: 16px;

    .middle-btn {
      display: flex;
      flex-flow: row nowrap;
      padding: 10px 0;

      span {
        margin-right: 10px;

        &.actived-btn {
          color: #1485ff;
          border-bottom: 2px solid #1485ff;
          padding-bottom: 10px;
        }
      }
    }
  }
}

.content .his-small .retrieval .el-row::v-deep .el-form-item {
  margin: 0 0 16px 0;
}

.content .his-small .retrieval .el-row .el-form-item {
  width: calc(33.33% - 8px);
}

.is_icon {
  color: #1485ff;
  visibility: hidden;
}

::v-deep .el-tree-node__content:hover {
  .is_icon {
    visibility: visible;
    color: #1485ff;
    .his-shuxing_yizhuxiao {
      color: #d3d5e2;
      visibility: visible;
    }
  }
}
</style>