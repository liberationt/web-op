<!--
 * @Author: dmj
 * @LastEditTime: 
 * @LastEditors:
 * @Description:诊疗项目维护
 * @FilePath: 
-->
<template>
  <div class="content" style="padding: 0">
    <div>
      <div class="right-side">
        <div class="main-bottom">
          <div
            class="his-module ht his-patient-tree"
            style="flex-shrink: 0; padding:8px 10px"
            :style="{
              width: treeWidth + 'px',
              height: listSlotHeight - 10 + 'px',
            }"
          >
            <div slot="header" class="row" v-show="!folderSide">
              <div class="label">
                <div class="title">医技类型树</div>
              </div>
              <div class="action" @click="isHideFolder">
                <i class="icon his-card-put gray" />
              </div>
            </div>
            <div class="open action" @click="isHideFolder" v-if="folderSide">
              <i class="icon his-card-open gray" />
            </div>
            <el-tree
              ref="tree"
              :data="leftTreeData"
              :props="defaultProps"
              @node-click="handleNodeClick"
              :expand-on-click-node="false"
              highlight-current
              class="scroll-bar"
              :style="{
                height: listSlotHeight - 100 + 'px',
              }"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <i class="icon" :class="data.childrenList ? getClass(node) : 'his-tree-submen'"></i>
                <span>{{ node.label }}</span>
                <span style="position: absolute;right:0">
                  <el-dropdown trigger="click">
                    <span class="is_icon">
                      <i class="icon his-caidanliebiao-more1"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="handleAppend(node,data)">新增</el-dropdown-item>
                      <el-dropdown-item @click.native="handleEdit(node,data)">修改</el-dropdown-item>
                      <el-dropdown-item @click.native="handleDeleteCode(node,data)">删除</el-dropdown-item>
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
              <el-col class="ht" :span="10">
                <div class="his-module his-small">
                  <div class="row" style="padding-bottom: 8px">
                    <div class="lable">
                      <h1 class="title" style="color:#222B31">放射申请</h1>
                    </div>
                    <div class="operate">
                      <el-button
                        size="mini"
                        type="primary"
                        class="blue-gra"
                        icon="icon his-add"
                        @click="addItems"
                      >{{$t('common.add')}}</el-button>
                    </div>
                  </div>
                    <el-table
                      slot="list"
                      ref="tableDataA"
                      stripe
                      :data="tableDataA"
                      border
                      :height="listSlotHeight-105"
                      highlight-current-row
                      class="scroll-bar"
                      tooltip-effect="light"
                      @row-click="changes"
                    >
                      <el-table-column label="项目名称" prop="xmmc" show-overflow-tooltip></el-table-column>
                      <el-table-column width="80" label="执行科室" prop="zxks" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <div>{{options.find(item => item.id == scope.row.zxks)&&options.find(item=>item.id == scope.row.zxks).officename}}</div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="操作"
                        width="52"
                        class-name="action-btns"
                        align="center"
                        fixed="right"
                      >
                        <template slot-scope="scope">
                          <el-tooltip
                            :content="$t('common.invalid')"
                            effect="light"
                            :enterable="false"
                          >
                            <el-popconfirm
                              hideIcon
                              :confirmButtonText="$t('common.confirm')"
                              :cancelButtonText="$t('common.cancel')"
                              :title="$t('sysManage.confirmDeleted')"
                              @confirm="handleDelete(scope.row)"
                            >
                              <el-button @click.stop slot="reference" class="red">
                                <i class="icon his-del" />
                              </el-button>
                            </el-popconfirm>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                    </el-table>
                </div>
              </el-col>
              <el-col class="ht" :span="14">
                <div
                  class="his-module his-small his-sys-module"
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
                    label-width="80px"
                    :model="ruleForm"
                    ref="ruleForm"
                    :rules="rule"
                    style="margin:0px auto"
                  >
                    <div class="row" style="justify-content: left;height:30px;margin-bottom:10px">
                      <i class="blue icon his-mokuai_jianchajibenxinxi"></i>
                      <span style="margin-left:8px;font-family: 'siyuanMedium'; font-size:14px">基本信息</span>
                    </div>
                    <el-row :gutter="10" style="margin-top:10px">
                      <el-col :span="12">
                        <el-form-item label="项目名称" prop="xmmc">
                          <el-input
                            placeholder="请输入..."
                            v-model="ruleForm.xmmc"
                            :disabled="disabled"
                            @blur="getPinyin"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="拼音码" prop="pydm">
                          <el-input
                            placeholder="请输入..."
                            v-model="ruleForm.pydm"
                            :disabled="disabled"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item label="五笔码" prop="wbdm">
                          <el-input
                            placeholder="请输入..."
                            v-model="ruleForm.wbdm"
                            :disabled="disabled"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="执行科室" prop="zxks">
                          <!-- <el-input placeholder="请输入..." v-model="ruleForm.zxks"></el-input> -->

                          <el-select v-model="ruleForm.zxks" :disabled="disabled">
                            <el-option
                              v-for="item in options"
                              :key="item.id"
                              :label="item.officename"
                              :value="item.id"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <div class="row" style="justify-content: left;height:30px;margin-bottom:10px">
                    <i class="blue icon his-basic-info"></i>
                    <span style="margin-left:8px;font-family: 'siyuanMedium'; font-size:14px">使用情况</span>
                  </div>
                  <el-form>
                    <el-row :gutter="10" style="margin-bottom:10px">
                      <el-col :span="8">
                        <el-form-item label="长期医嘱使用" style="margin-bottom:10px">
                          <el-checkbox v-model="ruleForm.czsy" true-label="1"></el-checkbox>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="临时医嘱使用" style="margin-bottom:10px">
                          <el-checkbox v-model="ruleForm.lzsy" true-label="1"></el-checkbox>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="门诊处方" style="margin-bottom:10px">
                          <el-checkbox v-model="ruleForm.mzsy" true-label="1"></el-checkbox>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10">
                      <el-col :span="8">
                        <el-form-item label="住院使用" style="margin-bottom:10px">
                          <el-checkbox v-model="ruleForm.zysy" true-label="1"></el-checkbox>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="体检使用" style="margin-bottom:10px">
                          <el-checkbox v-model="ruleForm.tjsy" true-label="1"></el-checkbox>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <div class="row" style="justify-content: left;height:30px">
                    <i class="blue icon his-basic-info"></i>
                    <span style="margin-left:8px;font-family: 'siyuanMedium';font-size:14px">注意事项</span>
                  </div>
                  <el-form label-width="100px" style="margin:0px auto" :model="ruleForm">
                    <el-row :gutter="10">
                      <el-col :span="24">
                        <el-form-item label="检查知情同意书" prop="jczqtys">
                          <el-input
                            placeholder
                            v-model="ruleForm.jczqtys"
                            type="textarea"
                            style="height:56px"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10">
                      <el-col :span="24">
                        <el-form-item label="注意事项" prop="zysx">
                          <el-input v-model="ruleForm.zysx" type="textarea" style="height:56px"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <div
                    class="row"
                    style="justify-content: left;height:30px;margin-top:16px; border-top:1px solid rgba(240,240,240,1);border-bottom:none"
                  >
                    <div class="btn">
                      <!-- 新增 -->
                      <el-button size="mini" type="text" @click="handRightAddData" :disabled="isadd">
                        <i class="icon his-btn-add"></i>新增
                      </el-button>
                    </div>
                  </div>
                  <el-table
                    slot="list"
                    stripe
                    :highlight-current-row="true"
                    :data="tableDataB"
                    :height="listSlotHeight - 555"
                    class="no-underline action-btns scroll-bar"
                    tooltip-effect="light"
                    @row-click="tableClick"
                    border
                    :fit="true"

                  >
                    <el-table-column type="index" width="32" align="center"></el-table-column>
                    <el-table-column prop="fymc" label="费用名称">
                      <template slot-scope="scope">
                        <remoteSearchBox
                          :required="true"
                          v-model="scope.row.fymc"
                          :ref="`${scope.$index}-3`"
                          style="height: 32px"
                          :searchData="{
                            yp:{
                              pydm:''
                            }
                            }"
                                  :resultTableHeader="{
                            yp:[
                            {
                              width:300,
                              prop:'fymc',
                              label: '费用名称'
                            },
                            {
                              width:110,
                              prop:'fydj',
                              label: '费用单价'
                            },
                            {
                              width:150,
                              prop:'sbjg',
                              label: '商保价格'
                            },
                          
                            ]
                          }"
                                  :searchField="{
                            yp:'pydm',
                          }"
                                  :showLabel="{
                            yp:'fymc',

                          }"
                          :name="'sf'"
                          @getData="data => getDrugTableData(data,scope.$index)"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column prop="fydj" :label="'费用单价'"></el-table-column>
                    <el-table-column prop="sbjg" :label="'商保价格'"></el-table-column>
                    <el-table-column prop="fysl" :label="'费用数量'">
                      <template slot-scope="scope">
                        <input-box
                          v-model="scope.row.fysl"
                          :ref="`${scope.$index}-1`"
                          style="height: 32px"
                          type="number"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="67" align="center" fixed="right">
                      <template slot-scope="scope">
                        <el-tooltip :content="$t('common.delete')" effect="light">
                          <el-popconfirm
                            hideIcon
                            :confirmButtonText="$t('common.confirm')"
                            :cancelButtonText="$t('common.cancel')"
                            :title="$t('common.delTip')"
                            @confirm="confirmDelete(scope.row)"
                          >
                            <el-button slot="reference" class="red">
                              <i class="icon his-del his-cancellationicon" />
                            </el-button>
                          </el-popconfirm>
                        </el-tooltip>
                        <el-tooltip
                          slot="reference"
                          :content="$t('common.save')"
                          effect="light"
                          :enterable="false"
                        >
                          <el-button class="green" @click="handRightSave(scope.row)">
                            <i class="icon his-right_caozuo_baochun" />
                          </el-button>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="新增"
      :visible.sync="isAdd"
      width="40%"
      :append-to-body="true"
      class="narrow-dialog"
    >
      <el-form
        label-width="100px"
        :model="mergerForm"
        class="his-sys-merger retrieval"
        style="padding-top:10px"
        ref="mergerForm"
        :rules="rules"
      >
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="上级类型">
              <el-select v-model=" mergerForm.formTreeData">
                <el-option label="1" value="1" style="height:auto">
                  <el-tree
                    ref="tree"
                    :data="leftTreeData"
                    :props="defaultProps"
                    @node-click="handForm"
                    highlight-current
                    class="scroll-bar"
                  >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <i
                        class="icon"
                        :class="data.childrenList ? getClass(node) : 'his-tree-submen'"
                      ></i>
                      <span>{{ node.label }}</span>
                    </span>
                  </el-tree>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型名称" prop="type">
              <el-input v-model="mergerForm.type"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="检查类型" prop="checkType">
              <el-select v-model="mergerForm.checkType">
                <el-option
                  v-for="item in checkData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sortType">
              <el-input v-model="mergerForm.sortType"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAdd=false">取 消</el-button>
        <el-button type="primary" @click="handleSure ">确 定</el-button>
      </span>
    </el-dialog>
    <!-- //提示 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>是否删除此节点</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="tipSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import Form from 'element-ui'
import { flatten } from 'lodash'
import { getTreeData, queryData, deleteItem, diagnosisAdd, depTList, diagnosisEdit, diagnosisFeeDelete, diagnosisPayAdd, diagnosisList, diagnosisTreeAdd, diagnosisTreeEdit, diagnosisTreeLogut, getMnemonic } from '@/api/his/sys/centerMaintenance/medicareInfoManage/diagnosisItems.ts'
import { forEach } from 'jszip'
import { id2Name } from '@/utils'
import { type } from 'os'
import { log } from 'util'
@Component({
  name: 'departRegist',
  filters: {},
  components: {}
})
export default class extends Vue {
  private dialogVisible: boolean = false
  private listSlotHeight: number = 0
  private physical: string = '' //体检使用
  private hospitalization: string = '' //住院使用
  private outpatient: string = '' //门诊使用
  private shortAdvice: string = '' //临时医嘱
  private longAdvice: string = '' //长期医嘱
  private isAdd: boolean = false
  private departList: Array<any> = [] //执行科室
  private searchData: object = {}
  private isUpd: boolean = true //新增或编辑
  private tableDataA: Array<any> = [] //中间数据
  private tableDataB: Array<any> = [] //右下侧数据
  private options: Array<any> = [] //执行科室
  private yjlx: number = 0 //医技类型
  private sign: boolean = false //判断用户新增时是否点击医技类型
  private zlxmid: any = '' //诊疗项目id
  private disabled: boolean = true
  private jlxh: any = '' //记录序号
  private selectRightRow: number | null = null
  private rule: object = {
    xmmc: [{ required: true, message: '请输入项目名称', trigger: 'blur' }]
  }
  private typeSign: boolean = true //新增还是编辑
  //医技树表单验证
  private rules: any = {
    type: [{ required: true, message: '请输入类型', trigger: 'blur' }],
    sortType: [{ required: true, message: '请输入排序', trigger: 'blur' }],
    checkType: [{ required: true, message: '请输入检查类型', trigger: 'blur' }]
  }

  //检查类型
  private checkData: Array<any> = [
    {
      value: '1',
      label: 'CT'
    },
    {
      value: '2',
      label: 'MRI'
    },
    {
      value: '3',
      label: 'X线检查'
    },
    {
      value: '4',
      label: '钼靶'
    },
    {
      value: '5',
      label: '动态心电'
    },
    {
      value: '6',
      label: 'DSA'
    },
    {
      value: '7',
      label: '病理'
    },
    {
      value: '8',
      label: '超声'
    },
    {
      value: '9',
      label: '内镜'
    },
    {
      value: '10',
      label: '胶片'
    }
  ]
  //获取执行科室列表
  private depTList() {
    depTList({}).then((res: any) => {
      console.log(res)
      this.options = res.data
      this.options.splice(0, 0, { id: 0, officename: '全院科室', py: 'QYKS', showOrder: 0, stop: '' })
    })
  }
  //表单
  private handForm(val: any) {
    console.log(val)
    this.mergerForm.formTreeData = val.name
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    this.getTreeData()
    this.depTList()
    this.departList = this.$store.state.webSqlDict.DEPT_DICT
  }
  //获取医技分类树集合
  private leftTreeData: Array<any> = []
  private isadd: boolean = true
  private defaultProps: any = {
    children: 'childrenList',
    label: 'name'
  }
  private getTreeData() {
    getTreeData({}).then((res: any) => {
      this.leftTreeData = res.data
      this.formData = this.leftTreeData
    })
  }
  //点击树形节点
  private treeParams: any = {
    pid: ''
  }
  private parentDatas: any = '' //获取父节点
  private parentId: any = '' //获取父id
  private handleNodeClick(val: any, e: any) {
    console.log(val);
    this.parentDatas = e.parent.data.name
    this.parentId = e.parent.data.id
    this.yjlx = val.id
    this.$nextTick(()=> {
      this.getList()
    })
    this.sign = true
    this.disabled = false
    this.treeParams.pid = val.id
  }
  //树形结构弹框表单值
  private mergerForm: any = {
    type: '',
    checkType: '',
    sortType: '',
    formTreeData: ''
  }
  //医技树节点新增
  private handleAppend(node: any, val: any) {
    this.isAdd = true
    this.typeSign = true
    console.log(val, node)
    this.mergerForm.formTreeData = val.name
  }

  //树形结构编辑
  private editDatas: any = {
    id: '',
    jclx: '',
    name: '',
    pid: '',
    sort: '',
    zxbz: ''
  }
  //树形结构编辑按钮
  private handleEdit(node: any, val: any) {
    console.log(val, node)
    this.isAdd = true //弹框
    this.typeSign = false //新增或者修改
    this.mergerForm.formTreeData = this.parentDatas
    this.mergerForm.checkType = val.jclx
    this.mergerForm.type = val.name
    this.mergerForm.sortType = val.sort
    //编辑接口参数
    this.editDatas.id = val.id
    this.editDatas.pid = this.parentId
    this.editDatas.zxbz = val.zxbz
  }

  //树形结构删除
  private handleDeleteCode(node: any, val: any) {
    console.log(node, val)
    this.dialogVisible = true //提示弹出框
  }
  // 提示确定按钮
  private tipSure() {
    diagnosisTreeLogut({ id: this.treeParams.pid }).then((res: any) => {
      console.log(res)
      if (res) {
        this.$notify({
          title: '注销成功',
          message: '',
          type: 'success'
        })
        this.getTreeData()
        // console.log(this.id)
        this.dialogVisible = false
      }
    })
  }

  //确定按钮
  private handleSure() {
    //新增
    const data = {
      jclx: this.mergerForm.checkType,
      name: this.mergerForm.type,
      pid: this.treeParams.pid,
      sort: this.mergerForm.sortType
    }
    if (this.typeSign) {
      ;(this.$refs.mergerForm as any).validate((valid: any) => {
        if (valid) {
          diagnosisTreeAdd(data).then((res: any) => {
            console.log(res)
            if (res) {
              this.$notify({
                title: '新增成功',
                message: '',
                type: 'success'
              })
              this.getTreeData()
              this.isAdd = false
              this.mergerForm.checkType = null
              this.mergerForm.type = null
              this.mergerForm.sortType = null
              this.mergerForm.formTreeData = null
            }
          })
        }
      })
    } else {
      //编辑
      console.log(this.typeSign)
      this.editDatas.sort = this.mergerForm.sortType
      this.editDatas.jclx = this.mergerForm.checkType
      this.editDatas.name = this.mergerForm.type
      diagnosisTreeEdit(this.editDatas).then((res: any) => {
        console.log(res)
        if (res) {
          this.$notify({
            title: '修改成功',
            message: '',
            type: 'success'
          })
          this.getTreeData()
          console.log(this.mergerForm.type)
          this.isAdd = false
          this.mergerForm.checkType = null
          this.mergerForm.type = null
          this.mergerForm.sortType = null
          this.mergerForm.formTreeData = null
        }
      })
    }
  }
  //关闭提示框
  private handleClose() {
    this.dialogVisible = false
  }

  //获取放射申请数据列表
  private getList() {
    queryData({ yjlx: this.yjlx }).then((res: any)=> {
      this.tableDataA = res.data
    })
  }

  //中间表格行点击
  private formData: object = {} //编辑传的参数
  private forms: any = {}
  private changes(val: any) {
    this.zlxmid = val.zlxmid
    this.getRightData()
    this.isUpd = false
    this.isadd = false
    console.log(val, 'val')
    this.forms = Object.assign(this.ruleForm, val)
  }
  //右下侧列表
  private getRightData() {
    diagnosisList({ zlxmId: this.zlxmid }).then((res: any) => {
      console.log(res)
      this.tableDataB = res.data
      this.jlxh = res.data.jlxh
    })
  }
  //编辑
  private edit() {
    diagnosisEdit(this.forms).then((res: any) => {
      console.log(res)
      if (res) {
        this.$notify({
          title: '修改成功',
          message: '',
          type: 'success'
        })
        this.getList()
        this.clearForm()
        this.ruleForm.zysx = null
        this.ruleForm.jczqtys = null
        this.ruleForm.zysy = null
        this.ruleForm.czsy = null
        this.ruleForm.tjsy = null
        this.ruleForm.lzsy = null
        this.ruleForm.mzsy = null
      }
    })
  }
  //作废
  private handleDelete(val: any) {
    this.zlxmid = val.zlxmid
    deleteItem({ zlxmId: val.zlxmid }).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.$notify({
          title: '删除成功',
          message: '',
          type: 'success'
        })
      }
      this.getList()
    })
  }
  //清空
  private clearForm() {
    ;(this.$refs.ruleForm as any).resetFields()
  }
  //新增参数
  private ruleForm: any = {
    czsy: '', //长期医嘱
    diccZlsfdzAddReqList: [
      {
        fysl:<number> 0, //费用数量
        fyxh: 0, //费用序号
        zlxmid: 0 //诊疗项目id
      }
    ],
    jczqtys: '', //检查知情同意书
    lzsy: '', //临时医嘱
    memo: '', //备注
    mzsy: '', //门诊使用
    pydm: '', //拼音代码
    tjsy: '', //体检使用
    wbdm: '', //五笔代码
    xmmc: '', //项目名称
    yjlx: 0, //医技类型
    zfbz: '', //作废标志
    zxks: 0, //执行科室
    zysx: '', //注意事项
    zysy: '' //住院使用
  }
  //点击新增
  private addItems() {
    this.isUpd = true
    this.isadd = false
    this.disabled = false
    if (this.sign === false) {
      this.$notify({
        title: '请选择左侧的医技类型',
        message: '',
        type: 'warning'
      })
    }
    this.clearForm()
    this.tableDataB = []
    this.ruleForm.zysx = null
    this.ruleForm.jczqtys = null
  }
  //新增函数
  private data: any = ''
  private addTableItem() {
    // this.ruleForm.emrZlsfdzAddReqList.forEach((item: any) => {
    //   this.data = item
    // })
    // this.tableDataB.forEach((res: any) => {
    //   this.data.fysl = res.fysl
    //   this.data.fyxh = res.fyxh
    //   console.log(this.data.fyxh)
    // })
    this.ruleForm.yjlx = this.yjlx
    this.ruleForm.diccZlsfdzAddReqList = this.tableDataB
    diagnosisAdd(this.ruleForm).then((res: any) => {
      if (res) {
        this.$notify({
          title: '新增成功',
          message: '',
          type: 'success'
        })
        this.getList()
        this.clearForm()
        this.ruleForm.zysx = null
        this.ruleForm.jczqtys = null
        this.ruleForm.zysy = null
        this.ruleForm.czsy = null
        this.ruleForm.tjsy = null
        this.ruleForm.lzsy = null
        this.ruleForm.mzsy = null
      }
    })
  }
  //上部保存
  private handleSave() {
    if (this.isUpd) {
      this.addTableItem()
      this.tableDataB = []
    } else {
      this.edit()
      this.tableDataB = []
    }
  }

  //右边新增行搜索回显数据
  private resultHeader = {
    yp: [
      {
        prop: 'fymc', //搜索结果列表的的表头prop
        label: '费用名称' //搜索结果列表的的表头label
      },
      {
        prop: 'fydj',
        label: '费用单价'
      },
      {
        prop: 'sbjg',
        label: '商保价格'
      }
    ]
  }

  //获取到的回显行数据
  private getData(value: any, data: any) {
    data.fydj = value.fydj
    data.sbjg = value.sbjg
    data.fyxh = value.fyxh
    console.log(this.tableDataB)
  }
  // //右下侧表格点击事件
  private tableClick(val: any) {
    console.log(val)
  }
  //右下侧删除
  private confirmDelete(row: any) {
    console.log(row)
    if (row.jlxh) {
      diagnosisFeeDelete({ jlxh: row.jlxh }).then((res: any) => {
        console.log(res)
        if (res) {
          this.$notify({
            title: '删除成功',
            message: '',
            type: 'success'
          })
        }
        this.getRightData()
      })
    } else {
      this.tableDataB.splice(0, 1)
    }
  }

  private getDrugTableData(val: any, index: number) {
    this.$set(this.tableDataB, index, { ...val, fydj: val.fydj, sbjg: val.sbjg})
  }

  //新增一行
  private handRightAddData() {
    if (this.tableDataB.length > 0) {
      let oldRowData = this.tableDataB[this.tableDataB.length - 1]
      if (oldRowData.fymc) {
        this.tableDataB = [{ fysl: 1 }, ...this.tableDataB]
      }
    } else {
      this.tableDataB = [{ fysl: 1 }, ...this.tableDataB]
    }
    this.$nextTick(() => {
      ;(this.$refs[`0-1`] as any).focus()
    })
    this.selectRightRow = this.tableDataB.length - 1
  }
  //右下侧保存
  private params: any = {
    fysl:<number> 0,
    fyxh: '',
    zlxmid: ''
  }

  // 右下角保存
  private handRightSave(row: any) {
    this.params.zlxmid = this.zlxmid
    this.params.fysl = row.fysl
    this.params.fyxh = row.fyxh
    diagnosisPayAdd(this.params).then((res: any) => {
      console.log(res)
      if (res) {
        this.$notify({
          title: '新增成功',
          message: '',
          type: 'success'
        })
        this.getRightData()
        console.log(this.params)
        this.params.fysl = 0
        this.params.fyxh = null
        this.params.zlxmid = null
      }
    })

    
  }
  private getClass(node: any) {
    if (node.expanded) {
      return 'his-tree-Folder'
    } else {
      return 'his-tree-Folder_unfold'
    }
  }

  private treeWidth: number = 240
  private folderSide: boolean = false
  private isDisabled: boolean = false
  private isHideFolder() {
    if (this.folderSide) {
      this.treeWidth = 240
      this.folderSide = !this.folderSide
    } else {
      this.treeWidth = 24
      this.folderSide = !this.folderSide
    }
  }

  // 获取拼音码
  private getPinyin() {
    if(this.ruleForm.xmmc){
      getMnemonic({typeList: ["py","wb"], value: this.ruleForm.xmmc}).then((res: any)=>{
      if(this.ruleForm.xmmc) {
        this.ruleForm.pydm = res.data.py
        this.ruleForm.wbdm = res.data.wb
        }
      })
    } else {
      this.ruleForm.pydm = null
      this.ruleForm.wbdm = null
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
  .content .his-small .el-form {
    .el-form-item .el-form-item__label {
      line-height: 12px !important;
    }
  }
}
.content .his-module .el-form {
  margin: 0 auto !important;
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
// .content .his-small ::v-deep .el-form .el-form-item .el-input--medium .el-input__inner:nth-of-type(5) {
//   height: 56px !important;
// }
.el-input__inner {
  height: 56px !important;
}
.el-row {
  margin-bottom: 0px !important;
}

.is_icon {
  color: #1485ff;
  visibility: hidden;
}

::v-deep .el-tree-node__content:hover {
  .is_icon {
    visibility: visible;
    color: #1485ff;
  }
}

.el-dialog .el-dialog__body {
  padding: 16px 24px 16px !important;
}

::v-deep .el-table::before {
  height: 0
}
</style>