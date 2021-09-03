<!--
 * @Author: 董亮
 * @LastEditTime: 2020-09-04 11:07:02
 * @LastEditors: 曹俊
 * @Description: 
 * @FilePath: \web-op\src\views\his\op\dctwork\drugInfoMaintenance\drugInfoMaintenance.vue
 -->
<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="14">
        <div class="his-module his-small">
          <custom-list
            ref="pageTable"
            data-name="DRUGS_YPXX_PHA"
            :list-height="listSlotHeight"
            :searchData="searchData"
            http-method="post"
            @getTableData="getData"
          >
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">{{$t('drugInfo.title')}}</h1>
                <el-input
                  class="search"
                  v-model="searchData.dm"
                  placeholder="请输入拼音码查询"
                  @change="handleSearch"
                  @clear="searchLists"
                  @keyup.enter.native="searchLists"
                  clearable
                >
                  <i slot="prefix" class="el-input__icon icon his-search"></i>
                </el-input>
              </div>
              <div class="operate">
                <el-button
                  type="primary"
                  class="green-gra"
                  icon="icon his-import"
                  @click="handleCallIn"
                  size="mini"
                  >{{$t('common.callIn')}}</el-button>
              </div>
            </div>
            <el-table
              slot="list"
              stripe
              :highlight-current-row="true"
              :data="drugData"
              @row-click="handleChange"
              :height="listSlotHeight"
              class="scroll-bar"
              border
              :row-class-name="tableRowClassName"
            >
              <!-- 序号 -->
              <el-table-column prop="webSortNumber" align="center" width="32"></el-table-column>
              <!-- 药品名称 -->
              <el-table-column prop="DRUGS_TYPK_YPMC" :label="'药品名称'" show-overflow-tooltip width="200"></el-table-column>
              <!-- 药库规格 -->
              <el-table-column prop="DRUGS_TYPK_ypgg" :label="'药库规格'" show-overflow-tooltip width="100"></el-table-column>
              <!-- 药库单位 -->
              <el-table-column prop='DRUGS_TYPK_ypdw' :label="'药库单位'" width="70"></el-table-column>
              <!-- 挂号限额 -->
              <el-table-column prop="PHAR_YPXX_YFGG" :label="'药房规格'" show-overflow-tooltip width="100"></el-table-column>
              <!-- 药房单位 -->
              <el-table-column prop="PHAR_YPXX_YFDW" :label="'药房单位'"></el-table-column>
              <!-- 导入时间 -->
              <el-table-column prop="PHAR_YPXX_DRSJ" :label="'导入时间'" width="140"></el-table-column>
              <!-- 修改时间 -->
              <el-table-column prop="PHAR_YPXX_XGSJ" :label="'修改时间'" width="140"></el-table-column>
              <!-- 药房高储 -->
              <el-table-column prop="PHAR_YPXX_YFGC" :label="'药房高储'" width="70"></el-table-column>
              <!-- 药房低储 -->
              <el-table-column prop="PHAR_YPXX_YFDC" :label="'药房低储'" width="70"></el-table-column>
              <!-- 货架号 -->
              <el-table-column prop="PHAR_YPXX_CGH" :label="'货架号'" show-overflow-tooltip width="60"></el-table-column>
              <!-- 药品费别 -->
              <el-table-column prop="DRUGS_TYPK_YPFB" :label="'药品费别'" width="70"></el-table-column>
              <!-- 状态 -->
              <el-table-column prop="PHAR_YPXX_YFZF" :label="'状态'" width="60">
                <template slot-scope="scope">
                  {{scope.row.PHAR_YPXX_YFZF == 0 ? '未作废' : '作废'}}
                </template>
              </el-table-column>
              <!-- 操作 -->
              <el-table-column label="操作" width="52" fixed="right" align="center">
                <template slot-scope="scope">
                  <!-- 作废/取消作废 -->
                  <el-tooltip :content="scope.row.PHAR_YPXX_YFZF == 0 ? '作废' : '启用'" placement="bottom" effect="light" :enterable="false">
                    <el-popconfirm
                      hideIcon
                      :confirmButtonText="scope.row.PHAR_YPXX_YFZF == 0 ? '作废' : '取消作废'"
                      :cancelButtonText="$t('common.cancel')"
                      :title="scope.row.PHAR_YPXX_YFZF == 0 ? '确认作废？': '确认取消作废？'"
                      @confirm="handleIsLogoff(scope.row)"
                    >
                      <el-button
                        slot="reference"
                        :class="[scope.row.PHAR_YPXX_YFZF == 0 ? 'red' : 'green']"
                      >
                        <i
                          class="icon"
                          :class="[
                        scope.row.PHAR_YPXX_YFZF == 0
                        ? 'his-cancellation'
                        : 'his-automated'
                        ]"
                        ></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </custom-list>
        </div>
      </el-col>
      <el-col class="ht" :span="10">
        <div class="his-module his-small">
          <div slot="header" class="row status">
            <div class="label">
              <h1 class="title">{{ $t('common.edit') }}</h1>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                class="green-gra"
                icon="icon his-save"
                @click="handleSave"
                size="mini"
                >{{$t('common.save')}}</el-button
              >
            </div>
          </div>
          <!-- 药房药品信息导入药房选择 -->
          <div class="form-wrap">
            <el-form
              :model="forms"
              ref="formValidate"
              :rules="rules"
              label-width="70px"
            >
              <!-- 药品名称 -->
              <el-form-item :label="$t('drugInfo.name')" prop="ypmc" :class="[is_disable ? 'is-disabled' : '']">
                <el-input
                  v-model.trim="forms.ypmc"
                  placeholder="请输入药品名称"
                  disabled
                ></el-input>
              </el-form-item>
              <!-- 药库规格 -->
              <el-form-item :label="$t('drugInfo.pharmacySpec')" prop="ypgg" :class="[is_disable ? 'is-disabled' : '']">
                <el-input
                  v-model="forms.ypgg"
                  placeholder="请输入药库规格"
                  disabled
                ></el-input>
              </el-form-item>
              <!-- 药库单位 -->
              <el-form-item :label="$t('drugInfo.pharmacyUnit')" prop="ypdw" :class="[is_disable ? 'is-disabled' : '']">
                <el-input
                  v-model="forms.ypdw"
                  placeholder="请输入药库单位"
                  disabled
                ></el-input>
              </el-form-item>
              <!-- 药库包装 -->
              <el-form-item :label="$t('drugInfo.pharmacyPackage')" prop="zxbz" :class="[is_disable ? 'is-disabled' : '']">
                <el-input
                  v-model="forms.zxbz"
                  placeholder="请输入药库包装"
                  disabled
                ></el-input>
              </el-form-item>
              <!-- 药房规格 -->
              <el-form-item :label="$t('drugInfo.drugstoreSpec')" prop="yfgg">
                <el-input
                  v-model="forms.yfgg"
                  placeholder="请输入药房规格"
                  :disabled="!is_disable"
                ></el-input>
              </el-form-item>
              <!-- 药房单位 -->
              <el-form-item :label="$t('drugInfo.drugstoreUnit')" prop="yfdw" :class="[is_disable ? 'is-disabled' : '']">
                <el-input
                  v-model="forms.yfdw"
                  placeholder="请输入药房单位"
                  disabled
                  maxlength="4"
                ></el-input>
              </el-form-item>
              <!-- 药房包装 -->
              <el-form-item label="药房包装" prop="yfbz" :class="[is_disable ? 'is-disabled' : '']">
                <el-input
                  v-model.number="forms.yfbz"
                  placeholder="请输入药房包装"
                  disabled
                  maxlength="4"
                ></el-input>
              </el-form-item>
              <!-- 药房高储 -->
              <el-form-item :label="$t('drugInfo.yfgc')" prop="yfgc">
                <el-input
                  v-model.number="forms.yfgc"
                  placeholder="请输入药房高储"
                  :disabled="!is_disable"
                  @blur="checkNum"
                  min="0"
                ></el-input>
              </el-form-item>
              <!-- 药房低储 -->
              <el-form-item :label="$t('drugInfo.yfdc')" prop="yfdc">
                <el-input
                  v-model.number="forms.yfdc"
                  placeholder="请输入药房低储"
                  :disabled="!is_disable"
                  min="0"
                  @blur="checkNum"
                ></el-input>
              </el-form-item>
              <!-- 取整策略 -->
              <el-form-item :label="$t('drugInfo.qzcl')" prop="qzcl">
                <search-select
                  table-name="SYS_FLAG_DATA"
                  kid="FD000018"
                  v-model="forms.qzcl"
                  placeholder="请选择取整策略"
                  :backfillValue = "forms.qzcl"
                  :disabled="!is_disable"
                >
                </search-select>
              </el-form-item>
              <!-- 货架号 -->
              <el-form-item :label="$t('drugInfo.hjh')" prop="cgh">
                <el-input
                  v-model="forms.cgh"
                  placeholder="请输入货架号"
                  :disabled="!is_disable"
                ></el-input>
              </el-form-item>
              <!-- 药品费别 -->
              <el-form-item :label="$t('drugInfo.ypfb')" prop="ypfb" :class="[is_disable ? 'is-disabled' : '']">
                <search-select
                  table-name="SYS_FLAG_DATA"
                  kid="FD000017"
                  v-model="forms.ypfb"
                  placeholder="请选择药品费别"
                  :backfillValue = "forms.ypfb"
                  disabled
                >
                </search-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="药房药品信息导入药库选择"
      :visible.sync="dialogVisible"
      width="544px"
      :close-on-click-modal="false"
      class="narrow-dialog"
    >
      <div class="his-module his-small">
        <no-pagination
          ref="drugCallIn"
          data-name="DRUGS_YKLB_STO"
          http-method="post"
          :searchData="searchDataT"
          @getTableList="getTableData"
          @getTableColumn="getTableColumn"
          @getTotalMoney="getTotalMoney"
          @getRecipeMoney="getRecipeMoney"
        >
        <div class="row" slot="header">
          <div class="label">
            <div class="btn">
              <el-button size="mini" type="text" class="confirm" @click="confirm">
                <i class="icon his-btn-confirm"></i>确认
              </el-button>
              <el-button size="mini" type="text" class="close" @click="close">
                <i class="icon his-btn-close"></i>关闭
              </el-button>
            </div>
          </div>
        </div>
        <!-- 表格 tableFormat start -->
        <el-table 
          slot="list" 
          stripe 
          ref="table"
          :highlight-current-row="true"
          :data="tableFormat" 
          :height="listSlotHeight/2 - 73"
          class="no-underline scroll-bar"
          border
          @row-click="handleDrugInfo"
          :data-select= "true"
        >
          <el-table-column type="index" align="center" width="32"></el-table-column>
          <template>
            <el-table-column label="药库识别" prop="DRUGS_YKLB_YKSB"></el-table-column>
            <el-table-column label="药库名称" prop="DRUGS_YKLB_YKMC"></el-table-column>
            <el-table-column label="药库类别" prop="YKLB"></el-table-column>
            <el-table-column label="使用标志" prop="SYBZ"></el-table-column>
          </template>
        </el-table>
        </no-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import {
  callIn,
  searchDrug,
  editDrugInfo,
  handleStatus,
  Iforms
} from '@/api/his/pha/im_herbpharmacy/drugInfoMaintenance.ts'
import { Form } from 'element-ui'
import { log } from 'util'
import { rightScroll, id2Name } from '@/utils/index.ts'
import { getTableData, dictExecuteSql } from '@/websql/functions'

@Component({
  name: 'drugInfoMaintenance',
  filters: {},
  components: {},
})
export default class extends Vue {
  private searchData: any = {
    dm: '',
    PHAR_YPXX_YFSB: null,
    PHAR_YPXX_JGID: null
  }
   private searchDataT: any = {
     DRUGS_YKLB_JGID: null
   }
  private list: Array<any> = []
  private dialogVisible: boolean = false // 调入弹框默认隐藏
  private listSlotHeight: number = 0 //列表高度
  private drugForm: any = {} // 调入弹框表格数据
  private yklbList: Array<any> = [] // 药库类别列表  
  private sybzList: Array<any> = [] // 使用标志列表
  private totalMoney: number = 0
  private recipeMoney: number = 0
  private tableColumn: Array<any> = [] // 药品表头列表
  private tableDatas: Array<any> = [] // 药品数据列表
  private is_disable: boolean = false // 表单禁用状态
  // 表单参数值
  private forms: any = {
    cgh: null,
    drsj: "",
    jgid: this.userInfo.hospitalId,
    qzcl: null,
    yfbz: null,
    yfdc: null,
    yfdw: "",
    yfgc: null,
    yfgg: "",
    yfsb: Vue.prototype.AUTHORITY.bussinessRole,
    yfzf: null,
    ypdw: "",
    ypfb: null,
    ypgg: "",
    ypmc: "",
    ypxh: null,
    zxbz: null,
  } 
  private drugData : Array<any> = [] // 药品列表
  private title: string = ''
  private isCreateAndEdit: boolean = true
  // 验证规则
  private rules = {
    yfgc: [
      { required: true, message: '药房高储不能为空', trigger: 'blur' }, 
    ],
    yfdc: [
      { required: true, message: '药房低储不能为空', trigger: 'blur' }, 
    ]
  }
  // 获取用户信息
  get userInfo() {
    return JSON.parse(localStorage.userInfo)
  }
  

  @Watch('drugData')
  private onValueChange(value: string) {
    rightScroll()
  }

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight - 51 - 16 - 40
  }

  mounted() {
    // 获取jgid
    this.searchData.PHAR_YPXX_JGID = this.userInfo.hospitalId
    this.searchDataT.DRUGS_YKLB_JGID = this.userInfo.hospitalId
    // 获取yfsb
    this.searchData.PHAR_YPXX_YFSB = Vue.prototype.AUTHORITY.bussinessRole
    this.searchData.dm = this.searchData.dm
    // 获取药库类别列表
    this.yklbList = this.$store.state.webSqlDict.PHA_SORT_DICT
    // 获取使用标志列表
    this.sybzList = this.$store.state.webSqlDict.USE_SIGN_DICT
    this.getList()
  }

  get tableFormat() {
    id2Name(this.tableDatas,'DRUGS_YKLB_YKLB','YKLB',this.yklbList,'dv','dn')
    id2Name(this.tableDatas,'DRUGS_YKLB_SYBZ','SYBZ',this.sybzList,'dv','dn')
    return this.tableDatas
  }
  // 条件查询
  searchLists() {
    const pageTable: any  = this.$refs['pageTable']
    pageTable.searchList()
  }

  // 查询
  private handleSearch() {
    this.searchLists()
  }

  // 获取药品信息维护信息数据
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 获取调入弹框中的数据
  private getLists() {
    const drugCallIn: any = this.$refs.drugCallIn
    drugCallIn.getList()
  }

  // 药品信息调入
  private handleCallIn() {
    this.dialogVisible = true
    this.$nextTick(()=>{
      this.getLists()
    })
    
  }

  // 药品信息调入中关闭事件
  private close() {
    this.dialogVisible = false
  }

  // 药品信息调入中确认事件
  private confirm() {
    console.log(this.drugForm);
    if(this.drugForm.DRUGS_YKLB_YKSB != null){
      callIn({yfsb: Vue.prototype.AUTHORITY.bussinessRole, yksb: this.drugForm.DRUGS_YKLB_YKSB}).then((res: any)=>{
        if(res.errorCode === 'SUCCESS'){
          this.$notify({
            title:  "导入成功！",
            message: '',
            type: 'success',
          })
        }
        this.getList()
        this.dialogVisible = false
      })
    }else{
      this.$message({
        message: '请选择一条数据',
        type: 'warning'
      });
    }
  }

  // 获取调入药房药品当前行数据
  private handleDrugInfo(item: any) {
    console.log(item);
    this.drugForm = item
  }


  // 获取单个药品信息
  private handleChange(data: any) {
    this.is_disable = true
    this.isCreateAndEdit = false
    let param: any = {
      yfsb: data.PHAR_YPXX_YFSB,
      ypxh: data.PHAR_YPXX_YPXH
    }
    searchDrug(param).then((res: any)=>{
      this.forms = Object.assign(this.forms,res.data)
    })
  }

  // 作废 置灰
  private tableRowClassName(data: any){
    if(data.row.PHAR_YPXX_YFZF == 1){
      return 'gray-row';
    }
  }

  // 保存修改
  private handleSave() {
    // 默认取整策略值为零
    this.forms.qzcl = 0;
    (this.$refs.formValidate as Form).validate((valid: boolean) => {
      if (valid) {
        editDrugInfo(this.forms).then((res: any) => {
          this.$notify({
            title: this.$t('common.editSuc').toString(),
            message: '',
            type: 'success'
          })
          this.getList()
        })
      }
    })
  }

  // 作废、取消作废
  private handleIsLogoff(data: any) {
    console.log(data);
    const params = {
      yfzf: data.PHAR_YPXX_YFZF,
      yfsb: data.PHAR_YPXX_YFSB,
      ypxh: data.PHAR_YPXX_YPXH,
      jgid: data.PHAR_YPXX_JGID
    }
    handleStatus(params).then((res: any)=>{
      if(res.errorCode==="SUCCESS"){
        this.$notify({
            title: data.PHAR_YPXX_YFZF == '0' ? '作废成功!' : '成功取消作废！',
            message: '',
            type: 'success'
          })
        this.getList() 
      }
    })
  }

  // 检验药房高低储
  private checkNum() {
    if(this.forms.yfdc > this.forms.yfgc){
      this.$message({
        message: '药房低储不能高于药房高储',
        type: 'warning'
      })
    } 
  }

   /*@methods:getTableData
   *@description: 获取药品列表
   */
  private getTableData(data: any){
    this.tableDatas = data;
  }

  /*@methods:getTotalMoney
   *@description: 获取药品表格列表
   */
  private getTableColumn(data: any){
    this.tableColumn = data
  }
  
  /*@methods:getTotalMoney
   *@description: 获取总金额
   */
  private getTotalMoney(data: any){
    this.totalMoney = data
  }

  /*@methods:getRecipeMoney
   *@description: 获取处方金额
   */
  private getRecipeMoney(data: any){
    this.recipeMoney = data
  }

  /*@methods:getData
   *@description: 获取药品列表
   */
  private getData(data: any){
    this.drugData = data
  }
}
</script>
<style lang="scss" scoped>
.content .his-small .row .label .title{
  margin-right: 8px!important;
}
.row.status{
  margin-bottom: 24px!important;
}

/* 搜索按钮 */
.content .his-small .row .label .search ::v-deep .el-input__prefix{
  padding: 0 10px 0 2px;
}

.content .his-small .row .label .search ::v-deep .el-input__inner{
  width: 190px;
}

/* 清除调入弹框的边距 */
.el-dialog__wrapper ::v-deep .el-dialog__body {
  padding: 0;
}
::v-deep .el-dialog .el-dialog__header{
  padding: 0 16px;
  height: 44px;
}
.content .his-small .row .label{
  height: 16px;
}

::v-deep .el-table__fixed-right {
  height: 100% !important;
}


</style>
