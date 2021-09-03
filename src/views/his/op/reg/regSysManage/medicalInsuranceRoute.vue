<template>
  <div class="content">
		<el-row class="ht" :gutter="10">
      <el-col class="ht" :span="17">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <div class="title">医保线路维护</div>
              <!-- <el-divider direction="vertical"></el-divider>
              <el-input
                :placeholder="'请输入'"
                v-model="searchData.pydm"
                @change="searchLists"
                class="search"
              >
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input> -->
            </div>
            <div class="operate">
              <el-button
                type="primary"
                size="mini"
                class="blue-gra"
                icon="icon his-add"
                @click="handleAdd"
              >{{$t('common.add')}}</el-button>
            </div>
          </div>
          <pagenation-list
            ref="pageTable"
            v-model="tableData"
            data-url="/op-service/opmzlb/queryPage"
            :search-data="searchData"
            http-method="post"
            :list-height="listSlotHeight"
          >
            <el-table
              slot="list"
              stripe
              ref="table"
              :highlight-current-row="true"
              :data="tableFormat"
              @row-click="getDetail"
              @row-dblclick="getMedInsIP"
              border
              v-loading="loading"
              :height="listSlotHeight"
              class="scroll-bar"
              tooltip-effect="light"
            >
							<!-- 序号 -->
              <el-table-column
								prop="webSortNumber"
								width="32"
                align="center"
							></el-table-column>

							<!-- 门诊类别 -->
							<el-table-column
								:label="'门诊类别'"
								prop="mzlb"
							></el-table-column>

              <!-- 机构ID -->
							<el-table-column
								:label="'机构ID'"
								prop="jgid"
							></el-table-column>

							<!-- 门诊名称 -->
							<el-table-column
								:label="'门诊名称'"
                :show-overflow-tooltip="true"
							>
                <template slot-scope="scope">
                  <span>{{scope.row.mzmc}}</span>
                </template>
              </el-table-column>

							<!-- 医保机构ID -->
							<el-table-column
								:label="'医保机构ID'"
								prop="ybjgid"
                :show-overflow-tooltip="true"
							></el-table-column>

              <!-- 医保线路ID -->
							<el-table-column
								:label="'医保线路ID'"
								prop="ybxlid"
                :show-overflow-tooltip="true"
							></el-table-column>

							<!-- 月报名称 -->
							<el-table-column
								:label="'月报名称'"
								prop="ybmc"
							></el-table-column>

							<!-- 是否启用 -->
							<el-table-column
								:label="'是否启用'"
								prop="sfqyBoolean"
							></el-table-column>

              <el-table-column :label="$t('common.action')" align="center" width="60">
                <template slot-scope="scope">
                  <el-tooltip
                    :content="$t('common.delete')"
                    effect="light"
                  >
                    <el-popconfirm
											:title="'确认删除？'"
											:confirmButtonText="$t('common.confirm')"
											:cancelButtonText="$t('common.cancel')"
                      @confirm="delMedInsRou(scope.row)"
											hideIcon
                    >
                      <el-button
                        slot="reference"
                        class="red"
                      >
                        <i class="icon his-del"></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col class="ht" :span="7">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <h1 class="title">{{rightTitle}}</h1>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                size="mini"
                class="green-gra"
                icon="icon his-save"
                @click="handleSave"
                :loading="showLoading"
              >{{$t('common.save')}}</el-button>
            </div>
          </div>
          <div class="form-wrap scroll-bar">
            <el-form
							ref="formData"
              :model="formData"
              :rules="formRule"
              label-width="80px"
              class="clearfix"
						>

              <!-- 机构ID -->
							<el-form-item :label="'机构ID'" prop="jgid">
                <el-input
                  :placeholder="'请输入机构id'"
                  v-model="formData.jgid"
                  :disabled="true"
                ></el-input>
              </el-form-item>

              <!-- 门诊名称 -->
							<el-form-item :label="'门诊名称'" prop="mzmc">
                <el-input
                  :placeholder="'请输入门诊名称'"
                  v-model="formData.mzmc"
                  maxlength="30"
                ></el-input>
              </el-form-item>

              <!-- 医保机构ID -->
							<el-form-item :label="'医保机构ID'" prop="ybjgid">
                <el-input
                  :placeholder="'请输入医保机构ID'"
                  v-model="formData.ybjgid"
                  maxlength="20"
                ></el-input>
              </el-form-item>

              <!-- 医保线路ID -->
							<el-form-item :label="'医保线路ID'" prop="ybxlid">
                <el-input
                  :placeholder="'请输入医保线路ID'"
                  v-model="formData.ybxlid"
                  maxlength="20"
                ></el-input>
              </el-form-item>

              <!-- 月报名称 -->
							<el-form-item :label="'月报名称'" prop="ybmc">
                <el-input
                  :placeholder="'请输入月报名称'"
                  v-model="formData.ybmc"
                  maxlength="5"
                ></el-input>
              </el-form-item>

							<!-- 是否启用 -->
							<el-form-item :label="'是否启用'" prop="sfqy">
                <el-select v-model="formData.sfqy">
									<el-option
                    v-for="item in booleanList"
                    :key="item.dv"
                    :value="item.dv"
                    :label="item.dn"
                  ></el-option>
								</el-select>
              </el-form-item>

              <!-- 门诊类别 -->
							<el-form-item :label="'门诊类别'" prop="mzlb" hidden>
                <el-input
                  :placeholder="'请输入门诊类别'"
                  v-model="formData.mzlb"
                ></el-input>
              </el-form-item>
						</el-form>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      title="医保IP"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      class="narrow-dialog"
    >
      <div class="row no-underline">
        <div class="label">
          <div class="btn">
            <el-button type="text" size="mini" @click="handleAddIP">
              <i class="icon his-btn-add"></i>
              <span>新增</span>
            </el-button>
            <el-button type="text" size="mini" @click="saveMedInsIP">
              <i class="icon his-btn-save green"></i>
              <span>保存</span>
            </el-button>
          </div>
        </div>
      </div>
      <div class="his-module his-small">

        <el-table
          stripe
          ref="dialogTable"
          :highlight-current-row="true"
          :data="tableData2"
          border
          v-loading="loading2"
          :height="400"
          class="scroll-bar input-table"
          tooltip-effect="light"
        >
          <!-- 序号 -->
          <el-table-column
            type="index"
            width="32"
            align="center"
          ></el-table-column>

          <!-- 机构ID -->
          <el-table-column
            :label="'机构ID'"
            prop="jgid"
          ></el-table-column>

          <!-- 绑定IP -->
          <el-table-column
            :label="'绑定IP'"
            prop="ip"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.ip"
                :placeholder="'请输入IP'"
                :ref="'input'+scope.$index"
              ></el-input>
            </template>
          </el-table-column>

          <el-table-column :label="$t('common.action')" align="center" width="60">
            <template slot-scope="scope">
              <el-tooltip
                :content="$t('common.delete')"
                effect="light"
              >
                <el-popconfirm
                  :title="'确认删除？'"
                  :confirmButtonText="$t('common.confirm')"
                  :cancelButtonText="$t('common.cancel')"
                  @confirm="delMedInsIP(scope.row)"
                  hideIcon
                >
                  <el-button
                    slot="reference"
                    class="red"
                    :disabled="scope.row.sbxh?false:true"
                  >
                    <i class="icon his-del"></i>
                  </el-button>
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
	</div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  aAddMedInsRou, aEditMedInsRou, aDelMedInsRou, aQueryMedInsIP, aSaveMedInsIP, aDelMedInsIP
} from '@/api/his/op/reg/medicalInsuranceRoute.ts'
import { getTableData } from '@/websql/functions'
import { id2Name, rightScroll } from '@/utils'

//声明接口
declare interface pageList {
  id: number
}

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: '',
  filters: {}
})
export default class extends Vue {
  //声明变量，方法
	private tableData: any[] = [] // 表格数据
	private searchData: any = {
    pydm: ''
  } // 搜索参数
	private listSlotHeight: number = 0
  private showLoading:boolean = false
	private loading: boolean = false
	private rightTitle: string = window.ele.$i18n.t('common.add')
	private formData: any = {
    jgid: JSON.parse(localStorage.getItem('userInfo')as any).hospitalId,
    mzmc: '',
    ybjgid: '',
    ybxlid: '',
    ybmc: '',
    sfqy: '1',
    mzlb: ''
  } // 表单数据
	private formRule: any = {
    ybjgid: [
      {required: true, message: '医保机构id不能为空', trigger: 'blur'}
    ],
    ybxlid: [
      {required: true, message: '医保线路id不能为空', trigger: 'blur'}
    ],
    ybmc: [
      {required: true, message: '月报名称不能为空', trigger: 'blur'}
    ]
  } // 表单验证
  private isAdd: boolean = true
  private booleanList: any[] = [] // 是否
  private curRow: any = {} // 表格当前行
  private dialogVisible: boolean = false
  private tableData2: any[] = [] // 弹窗表格
  private loading2: boolean = false

  public setValue(value: string) {
    this.setValue(value)
  }
  public getValue() {
    return null
  }
  //监听方法
  @Watch('tableData')
	private onValueChange(value: string) {
		this.loading = false
	}

	// 获取列表
  private getLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.getList()
  }

	// 获取详情
	private getDetail(row: any){
    this.rightTitle = window.ele.$i18n.t('common.edit')
    this.isAdd = false
    // 清空校验结果
    const formData: any = this.$refs.formData
    formData.clearValidate()
    for (let i in this.formData) {
      this.formData[i] = row[i]
    }
  }

  // 条件查询
  private searchLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }

  // 新增按钮
  private handleAdd(){
    this.rightTitle = window.ele.$i18n.t('common.add')
    this.isAdd = true
    const formData: any = this.$refs.formData
    formData.resetFields()
  }

  // 保存按钮
  private handleSave(){
    const formData: any = this.$refs.formData
    formData.validate((valid: any)=>{
      if(valid){
        this.showLoading = true
        if(this.isAdd){
          this.addMedInsRou()
        }else{
          this.editMedInsRou()
        }
      }
    })
  }

  // 新增医保线路
  private addMedInsRou(){
    aAddMedInsRou(this.formData).then((res:any)=>{
      this.showLoading = false
      if(res){
        this.$notify({
          title: this.$t('common.addSuc').toString(),
          message: '',
          type: 'success',
        })
        this.getLists()
        this.handleAdd()
      }
    }).catch((err:any)=>{
      this.showLoading = false
    })
  }

  // 编辑医保线路
  private editMedInsRou(){
    this.showLoading = false
    aEditMedInsRou(this.formData).then((res:any)=>{
      if(res){
        this.$notify({
          title: this.$t('common.editSuc').toString(),
          message: '',
          type: 'success',
        })
        const formData: any = this.$refs.formData
        formData.resetFields()
        this.getLists()
      }
    }).catch((err:any)=>{
      this.showLoading = false
    })
  }

  // 删除医保线路
  private delMedInsRou(row: any){
    aDelMedInsRou({mzlb: row.mzlb}).then((res: any) => {
      if(res){
        this.$notify({
          title: this.$t('common.delSuc').toString(),
          message: '',
          type: 'success',
        })
        this.getLists()
        this.handleAdd()
      }
    })
  }

  // 获取字典数据
  private getDicData(){
    const _that = this
    getTableData( // 是否
      'SYS_FLAG_DATA',
      'FD000005',
      "select dv,dn from SYS_FLAG_DATA_VALUE where dk='FD000005'",
      function (data: any) {
        _that.booleanList = data
        _that.getLists()
      }
    )
  }

  // 表格转字典数据
  get tableFormat() {
    let newData: any = []
    newData = id2Name(this.tableData, 'sfqy', 'sfqyBoolean', this.booleanList, 'dv', 'dn')
    return newData
  }

  // 双击表格
  private getMedInsIP(row: any){
    this.loading2 = true
    this.dialogVisible = true
    this.curRow = row
    this.queryMedInsIP()
  }

  // 查询医保IP
  private queryMedInsIP(){
    aQueryMedInsIP({mzlb: this.curRow.mzlb}).then((res: any) => {
      if(res){
        this.tableData2 = res.data
        this.loading2 = false
      }
    })
  }

  // 保存医保IP
  private saveMedInsIP(){
    aSaveMedInsIP({ybIpList: this.tableData2}).then((res: any) => {
      if(res){
        this.$notify({
          title: '保存成功',
          message: '',
          type: 'success',
        })
      }
    })
  }

  // 医保IP新增按钮
  private handleAddIP(){
    let newRow = {
      mzlb: this.curRow.mzlb,
      jgid: this.curRow.jgid,
      opStatus: 'create'
    }
    this.tableData2.push(newRow)
    var tableLen = this.tableData2.length
    this.$nextTick(()=>{
      const inputIndex: any = this.$refs['input'+(tableLen-1)]
      inputIndex.focus()
    })
  }

  // 删除医保IP
  private delMedInsIP(row: any){
    aDelMedInsIP({sbxh: row.sbxh}).then((res: any) => {
      if(res){
        this.$notify({
          title: this.$t('common.delSuc').toString(),
          message: '',
          type: 'success',
        })
        this.queryMedInsIP()
      }
    })
  }




  //初始化的周期函数
	created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 108
  }
  mounted() {
    this.getDicData()
	}
}
</script>

<style lang="scss" scoped>
.form-wrap{
  height: calc(100% - 52px);
}
.el-form {
  width: 288px;
	margin: 16px auto 0!important;
  // padding: 0 60px!important;
	.el-form-item {
    width: 100%;
    &:nth-child(odd) {
      float: none;
    }
    &:nth-child(even) {
      float: none;
    }
    &.item-yyxx{
      width: 100%;
    }
    .search-select {
      width: 100%;
      ::v-deep .el-select {
        width: 100%;
        .el-input__inner {
          width: 100% !important;
        }
      }
    }
  }
}

// .el-dialog__wrapper ::v-deep{
//   .el-dialog__body{
//     padding: 0 10px 10px;
//     .row{
//       padding-bottom: 0;
//       border: none;
//     }
//   }
// }
@import '@/styles/inputTable.scss';
</style>
