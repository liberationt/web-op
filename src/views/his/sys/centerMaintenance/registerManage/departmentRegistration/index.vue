<!--
 * @Author: dmj
 * @LastEditTime: 
 * @LastEditors:
 * @Description:科室维护
 * @FilePath: 
-->
<template>
  <div class="content">
    <div>
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
            <div slot="header" class="row" v-show="!folderSide">
              <div class="label">
                <div class="title">科室维护</div>
              </div>
              <!-- <div class="action" @click="isHideFolder">
                <i class="icon his-card-put gray" />
              </div>-->
            </div>
            <div class="open action" @click="isHideFolder" v-if="folderSide">
              <i class="icon his-card-open gray" />
            </div>
            <el-tree
              ref="tree"
              :data="departmentData"
              :props="defaultProps"
              @node-click="handleNodeClick"
              node-key="id"
              highlight-current
              :default-expanded-keys="idArr"
              :expand-on-click-node="false"
              class="scroll-bar"
              :style="{
              height: listSlotHeight - 80 + 'px',
            }"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <i class="icon" :class="data.childrenList.length ? getClass(node) : 'his-tree-submen'"></i>
                <span>{{ node.label }}</span>
                <span style="position: absolute;right:5px">
                  <el-dropdown :trigger="data.logoff == '1' ? '' : 'click'">
                    <span class="is_icon">
                      <i
                        class="icon"
                        :class="data.logoff == '1' ? 'his-shuxing_yizhuxiao' : 'his-caidanliebiao-more1'"
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
            :style="{ height: listSlotHeight - 10 + 'px',marginLeft: 10+ 'px'}"
            :class="folderSide ? 'main-width1' : 'main-width2'"
          >
            <el-row class="ht" :gutter="10">
              <el-col class="ht" :span="24">
                <div
                  class="his-module his-small his-sys-module scroll-bar"
                  style="margin-right:16px"
                  :style="{ height: listSlotHeight - 10 + 'px'}"
                >
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
                    label-width="67px"
                    :model="ruleForm"
                    ref="ruleForm"
                    :rules="rule"
                    style="margin:8px auto;overflow: hidden"
                    class="retrieval scroll-bar"
                  >
                    <el-row type="flex">
                      <el-form-item label="科室代码" prop="officecode">
                        <el-input placeholder="请输入科室代码" v-model="ruleForm.officecode" />
                      </el-form-item>
                      <el-form-item label="科室名称" prop="officename">
                        <el-input placeholder="请输入" v-model="ruleForm.officename" @blur="getCode"></el-input>
                      </el-form-item>
                      <el-form-item label="上级科室 " prop="parentid" disabled>
                        <!-- <search-select
                          table-name="SYS_DICT_CONFIG"
                          kid="4"
                          v-model="ruleForm.parentid"
                          placeholder="请选择"
                          :backfillValue="ruleForm.parentid"
                          disabled
                        />-->
                        <el-select v-model="ruleForm.parentid">
                          <el-option
                            v-for="item in sjksData1"
                            :key="item.dv"
                            :label="item.dn"
                            :value="item.dv.toString()"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-row>
                    <el-row type="flex">
                      <el-form-item label="住院病区" prop="hospitalarea">
                        <search-select
                          v-model="ruleForm.hospitalarea"
                          table-name="SYS_FLAG_DATA"
                          kid="FD000005"
                          placeholder="请选择"
                          :backfillValue="ruleForm.hospitalarea"
                          :clearable="false"
                          @change="judgeInpatient"
                        ></search-select>
                      </el-form-item>
                      <el-form-item label="输液科室" prop="fluid">
                        <search-select
                          v-model="ruleForm.fluid"
                          table-name="SYS_FLAG_DATA"
                          kid="FD000005"
                          placeholder="请选择"
                          :backfillValue="ruleForm.fluid"
                          :clearable="false"
                        ></search-select>
                      </el-form-item>
                      <el-form-item label="医技科室" prop="medicallab">
                        <search-select
                          v-model="ruleForm.medicallab"
                          table-name="SYS_FLAG_DATA"
                          kid="FD000005"
                          placeholder="请选择"
                          :backfillValue="ruleForm.medicallab"
                          :clearable="false"
                        ></search-select>
                      </el-form-item>
                    </el-row>
                    <el-row type="flex">
                      <el-form-item label="住院科室" prop="hospitaldept">
                        <search-select
                          v-model="ruleForm.hospitaldept"
                          table-name="SYS_FLAG_DATA"
                          kid="FD000005"
                          placeholder="请选择"
                          :backfillValue="ruleForm.hospitaldept"
                          :clearable="false"
                        ></search-select>
                      </el-form-item>
                      <el-form-item label="门诊科室" prop="outpatientclinic">
                        <search-select
                          v-model="ruleForm.outpatientclinic"
                          table-name="SYS_FLAG_DATA"
                          kid="FD000005"
                          placeholder="请选择"
                          :backfillValue="ruleForm.outpatientclinic"
                          :clearable="false"
                        ></search-select>
                      </el-form-item>
                      <el-form-item label="中医科室" prop="tcm">
                        <search-select
                          v-model="ruleForm.tcm"
                          table-name="SYS_FLAG_DATA"
                          kid="FD000005"
                          placeholder="请选择"
                          :backfillValue="ruleForm.tcm"
                          :clearable="false"
                        ></search-select>
                      </el-form-item>
                    </el-row>
                    <el-row type="flex">
                      <el-form-item label="手术科室" prop="surgical">
                        <search-select
                          v-model="ruleForm.surgical"
                          table-name="SYS_FLAG_DATA"
                          kid="FD000005"
                          placeholder="请选择"
                          :backfillValue="ruleForm.surgical"
                          :clearable="false"
                        ></search-select>
                      </el-form-item>
                      <el-form-item label="急诊科室" prop="emergency">
                        <search-select
                          v-model="ruleForm.emergency"
                          table-name="SYS_FLAG_DATA"
                          kid="FD000005"
                          placeholder="请选择"
                          :backfillValue="ruleForm.emergency"
                          :clearable="false"
                        ></search-select>
                      </el-form-item>
                      <el-form-item label="核算科室" prop="accountoffice">
                        <search-select
                          v-model="ruleForm.accountoffice"
                          table-name="SYS_FLAG_DATA"
                          kid="FD000005"
                          placeholder="请选择"
                          :backfillValue="ruleForm.accountoffice"
                          :clearable="false"
                        ></search-select>
                      </el-form-item>
                    </el-row>
                    <el-row type="flex">
                      <el-form-item label="互联网科室" prop="internet">
                        <search-select
                          v-model="ruleForm.internet"
                          table-name="SYS_FLAG_DATA"
                          kid="FD000005"
                          placeholder="请选择"
                          :backfillValue="ruleForm.internet"
                          :clearable="false"
                        ></search-select>
                      </el-form-item>
                      <el-form-item label="核算分类 " prop="hsfl">
                        <search-select
                          v-model="ruleForm.hsfl"
                          table-name="SYS_FLAG_DATA"
                          kid="KS000002"
                          style="width: 100%"
                          :backfillValue="ruleForm.hsfl"
                        ></search-select>
                      </el-form-item>
                      <el-form-item label="科室分类" prop="ksfl">
                        <search-select
                          v-model="ruleForm.ksfl"
                          table-name="SYS_FLAG_DATA"
                          kid="KS000001"
                          style="width: 100%"
                          :backfillValue="ruleForm.ksfl"
                        ></search-select>
                      </el-form-item>
                    </el-row>
                    <el-row type="flex">
                      <el-form-item label="所属机构" prop="organizcode">
                        <search-select
                          v-model="ruleForm.organizcode"
                          table-name="SYS_DICT_CONFIG"
                          kid="6"
                          style="width: 100%"
                          :backfillValue="ruleForm.organizcode"
                        ></search-select>
                      </el-form-item>
                      <el-form-item label="电子邮箱" prop="email">
                        <el-input placeholder="请输入" v-model="ruleForm.email"></el-input>
                      </el-form-item>
                      <el-form-item label="医保机构代码" prop="yljgid">
                        <el-input placeholder="请输入" v-model="ruleForm.yljgid"></el-input>
                      </el-form-item>
                    </el-row>
                    <el-row type="flex">
                      <el-form-item label="线下医保科室" prop="ybks">
                        <el-cascader
                          ref="cascader"
                          :options="options"
                          v-model="ruleForm.ybks"
                          clearable
                          checkStrictly="true"
                          :show-all-levels="false"
                          style="width:100%"
                          :props="{multiple: false,emitPath: false,checkStrictly: true,children: 'childrenList',label: 'dataName',value: 'dataCode'}"
                        ></el-cascader>
                      </el-form-item>
                      <el-form-item label="线上医保科室" prop="xsybks">
                        <el-cascader
                          ref="cascader"
                          :options="options"
                          v-model="ruleForm.xsybks"
                          clearable
                          checkStrictly="true"
                          :show-all-levels="false"
                          style="width: 100%"
                          :props="{multiple: false,emitPath: false,checkStrictly: true,children: 'childrenList',label: 'dataName',value: 'dataCode'}"
                        ></el-cascader>
                      </el-form-item>
                      <el-form-item label="额定床位" prop="ratedbed">
                        <el-input placeholder="请输入" v-model="ruleForm.ratedbed"></el-input>
                      </el-form-item>
                    </el-row>
                    <el-row type="flex">
                      <el-form-item label="排列顺序" prop="plsx">
                        <el-input placeholder="请输入" v-model="ruleForm.plsx"></el-input>
                      </el-form-item>
                      <el-form-item label="联系电话" prop="telphone">
                        <el-input placeholder="请输入" v-model="ruleForm.telphone"></el-input>
                      </el-form-item>
                      <el-form-item label="报表归并" prop="bbgb">
                        <el-input placeholder="请输入" v-model="ruleForm.bbgb"></el-input>
                      </el-form-item>
                    </el-row>
                    <el-row type="flex">
                      <el-form-item label="地址" prop="address">
                        <el-input placeholder="请输入" v-model="ruleForm.address"></el-input>
                      </el-form-item>
                      <el-form-item placeholder="请输入" label="拼音码" prop="pycode">
                        <el-input placeholder="请输入" v-model="ruleForm.pycode"></el-input>
                      </el-form-item>
                      <el-form-item></el-form-item>
                    </el-row>
                  </el-form>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { rightScroll } from '@/utils/index.ts'
import { Form } from 'element-ui'
import { flatten } from 'lodash'
import { regPhone, regEmail } from '@/utils/validate.ts'
import { getDepartMentData, departMentEdit, departMentAdd, departMentStop, queryYbks, getMnemonic } from '@/api/his/sys/centerMaintenance/registerManage/departResigter.ts'
import { log } from 'util'
@Component({
  name: 'departRegist',
  filters: {},
  components: {}
})
export default class extends Vue {
  private listSlotHeight: number = 0 //高度
  private disabled: boolean = true
  private tableData: Array<any> = []
  private searchData: object = {} //搜索参数
  private isUpd: boolean = true //新增或编辑
  private SJKS: string = '' // 上级科室
  private isCancel: boolean = false // 判断注销状态
  private logOff: string | number = 0 // 禁用状态值
  private idArr: Array<any> = [] // 存储树的二级节点id
  private departmentData: Array<any> = [] // 科室数组
  private sjksData: Array<any> = this.$store.state.webSqlDict.DEPT_DICT // 上级科室数组
  private sjksData1: Array<any> = []
  private options: Array<any> = []
  private ruleForm: any = {
    emergency: '0',
    fluid: '0',
    hospitalarea: '0',
    hospitaldept: '0',
    medicallab: '0',
    officecode: '',
    officename: '',
    organizcode: '',
    outpatientclinic: '0',
    parentid: '',
    surgical: '0',
    accountoffice: '',
    address: '',
    bbgb: '',
    email: '',
    hsfl: '',
    ksdz: '',
    ksfl: '',
    logoff: '',
    organiztype: '',
    plsx: '',
    pycode: '',
    ratedbed: '',
    sfscpt: '',
    syks: '',
    telphone: '',
    xsybks: '',
    ybks: '',
    yljgid: '',
    internet: '0',
    tcm: '0'
  } //表单数据

  @Watch('tableData')
  private onValueChange(value: string) {
    rightScroll()
  }

  // 获取医保科室
  private queryYbks() {
    queryYbks({}).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        console.log(res)
        this.options = res.data
      }
    })
  }

  //点击新增
  private handleAdd() {
    this.isUpd = true
    this.$nextTick(() => {
      const el: any = this.$refs.ruleForm
      el.resetFields()
      this.ruleForm.parentid = this.SJKS
    })
  }
  // 树修改
  private handleEdit(node: any, data: any) {
    this.isUpd = false
    // this.isCancel = true
    console.log(node, data)
    this.ruleForm = JSON.parse(JSON.stringify(data))
  }
  private addDepartment() {
    console.log(this.ruleForm)
    this.ruleForm.childrenList = []
    departMentAdd(this.ruleForm).then((res: any) => {
      console.log(res)
      if (res.errorCode == 'SUCCESS') {
        this.$notify({
          title: '新增成功',
          message: '',
          type: 'success'
        })
        this.getDepartMentData()
        this.clearForm()
      }
    })
  }

  //表单验证
  private rule: any = {
    officecode: [{ required: true, message: '请输入科室代码', trigger: 'blur' }],
    officename: [{ required: true, message: '请输入科室名称', trigger: 'blur' }],
    organizcode: [{ required: true, message: '请输入所属机构', trigger: 'blur' }],
    parentid: [{ required: true, message: '请输入上级科室', trigger: 'blur' }],
    email: [{ pattern: regEmail, message: window.ele.$i18n.t('emp.vdEmail'), trigger: 'blur' }],
    telphone: [{ pattern: regPhone, message: window.ele.$i18n.t('emp.vdPhone'), trigger: 'blur' }],
    ratedbed: []
  }

  private leftTreeData: Array<any> = []
  //获取科室树
  private getDepartMentData() {
    getDepartMentData({}).then((res: any) => {
      console.log(res)
      
      // this.tableData.push(res.data)+

      this.departmentData = [{
        id: this.userInfo.userId.toString(),
        officename: this.userInfo.hospitalName,
        childrenList: res.data
      }]
      this.idArr = []
      this.departmentData.forEach((m: any) => {
        this.idArr.push(m.id)
      })
    })
  }
  private defaultProps: object = {
    children: 'childrenList',
    label: 'officename'
  }

  // 树点击
  private handleNodeClick(val: any) {
    console.log(val.childrenList)
    this.logOff = val.logoff
    if (val.childrenList.length) {
      val.childrenList.forEach((item: any) => {
        if (item.logoff == 0) {
          this.isCancel = false
          return
        } else {
          this.isCancel = true
        }
      })
    } else{
      this.isCancel = true
    }

    this.isUpd = false
    this.tableData = []
    this.tableData.push(val)
    this.tableData = JSON.parse(JSON.stringify(val.childrenList))
    this.ruleForm = JSON.parse(JSON.stringify(val))
    // this.ruleForm.parentid = JSON.parse(JSON.stringify(Number(val.parentid)))
    this.disabled = false
    this.SJKS = val.id
  }
  //保存
  private handleSave() {
    ;(this.$refs.ruleForm as Form).validate((valid: boolean) => {
      if (valid) {
        if (this.isUpd) {
          this.addDepartment()
        } else {
          this.edit()
        }
      }
    })
  }

  //编辑
  private edit() {
    // if (this.isCancel) {
    console.log(this.ruleForm)
    this.ruleForm.childrenList = []
    departMentEdit(this.ruleForm).then((res: any) => {
      console.log(res)
      if (res) {
        this.$notify({
          title: '修改成功',
          message: '',
          type: 'success'
        })
        this.getDepartMentData()
        this.clearForm()
      }
    })
    //   } else {
    //     this.$message({
    //       message: '该科室已注销，不可保存修改！',
    //       type: 'warning'
    //     })
    //   }
  }

  // 注销
  private handleDelete(node: any, data: any) {
    this.$confirm('注销操作将无法恢复，是否继续？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        if (this.isCancel) {
          departMentStop({ id: data.id, logoff: '1' }).then((res: any) => {
            if (res.errorCode == 'SUCCESS') {
              this.$notify({
                title: this.$t('common.disabled').toString(),
                message: '',
                type: 'success'
              })
              this.getDepartMentData()
            }
          })
          console.log('已注销')
        } else {
          this.$message({
            message: '子级科室未全部注销，该科室不可注销！',
            type: 'warning'
          })
        }
      })
      .catch(() => {})
  }

  // 判断病区状态并为床位添加校验
  private judgeInpatient(val: any) {
    if (val == 1) {
      this.rule.ratedbed = [{ required: true, message: '额定床位不能为空', trigger: 'blur' }]
    }
  }

  get userInfo() {
    return JSON.parse(localStorage.userInfo)
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    this.getDepartMentData()
    this.queryYbks()
    this.sjksData1 = JSON.parse(JSON.stringify(this.sjksData))
    this.sjksData1.splice(0, 0, { dv: '0', dn: '无', py: 'W', showOrder: 0, stop: '' })
    console.log(this.sjksData)
  }

  private getClass(node: any) {
    if (node.expanded) {
      return 'his-tree-Folder'
    } else {
      return 'his-tree-Folder_unfold'
    }
  }
  //清空
  private clearForm() {
    this.$nextTick(() => {
      const el: any = this.$refs.ruleForm
      el.resetFields()
    })
  }
  private labelPosition: string = 'right'
  private formLabelAlign: object = {
    name: '',
    region: '',
    type: ''
  }
  private treeWidth: number = 200
  private folderSide: boolean = false
  private isDisabled: boolean = false
  private isHideFolder() {
    if (this.folderSide) {
      this.treeWidth = 200
      this.folderSide = !this.folderSide
    } else {
      this.treeWidth = 24
      this.folderSide = !this.folderSide
    }
  }

  // 获取拼音码与五笔码
  private getCode() {
    if (this.ruleForm.officename) {
      getMnemonic({ typeList: ['py', 'wb'], value: this.ruleForm.officename }).then((res: any) => {
        if (res) {
          this.ruleForm.pycode = res.data.py
        }
      })
    } else {
      this.ruleForm.pycode = ''
    }
  }
}
</script>



<style lang="scss" scoped>
.row .label .el-input {
  width: 190px;
}
.his-sys-module {
  padding: 8px 10px !important;
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
  line-height: 12px;
}

//右侧状态框悬浮
::v-deep .el-table__fixed-right {
  height: 100% !important;
}
.content .his-small .retrieval .el-row .el-form-item {
  width: calc(33.33% - 8px);
}

.content .his-small .retrieval::v-deep .el-row .el-form-item {
  margin: 0px 0 16px 0;
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