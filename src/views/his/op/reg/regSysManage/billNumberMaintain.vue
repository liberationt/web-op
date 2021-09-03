<template>
  <div class="content">
    <el-tabs v-model="activeName" @tab-click="changeTab" class="tab-small">
      <el-tab-pane
        v-for="item in tabList"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
        <el-row class="ht" :gutter="10">
          <el-col class="ht" :span="16">
            <div class="his-module his-small">
              <div class="row">
                <div class="label">
                  <div class="title">{{item.label}}</div>
                  <!-- <el-divider direction="vertical"></el-divider>
                  <div class="btn">
                    <el-button
                      type="text"
                      size="mini"
                    >
                      <i class="icon his-btn-save blue"></i>
                      <span>在用发票</span>
                    </el-button>
                  </div> -->
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
                :ref="'table'+item.name"
                v-model="item.tableData"
                data-url="/op-service/opygpj/queryPage"
                :search-data="searchData"
                http-method="post"
                :list-height="listSlotHeight"
              >
                <el-table
                  slot="list"
                  stripe
                  ref="table"
                  :highlight-current-row="true"
                  :data="item.tableData"
                  @row-click="getDetail"
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

                  <!-- 起始号码 -->
                  <el-table-column
                    :label="'起始号码'"
                    prop="qshm"
                  ></el-table-column>

                  <!-- 终止号码 -->
                  <el-table-column
                    :label="'终止号码'"
                    prop="zzhm"
                  ></el-table-column>

                  <!-- 使用号码 -->
                  <el-table-column
                    :label="'使用号码'"
                    prop="syhm"
                  ></el-table-column>
                  <!-- 使用判别 -->
                  <el-table-column
                    :label="'使用判别'"
                    prop="sypb"
                  >
                    <template slot-scope="scope">
                      <div>
                        {{scope.row.sypb===1?'否':'是'}}
                      </div>
                    </template>
                  </el-table-column>
                  <!-- 领用人 -->
                  <el-table-column
                    :label="'领用人'"
                    prop="userName"
                  ></el-table-column>

                  <!-- 领用日期 -->
                  <el-table-column
                    :label="'领用日期'"
                    prop="lyrq"
                    width="140"
                  ></el-table-column>

                  <el-table-column :label="$t('common.action')" align="center" width="120" class-name="action-btns">
                    <template slot-scope="scope">
                      <el-tooltip
                        :content="$t('common.update')"
                        effect="light"
                      >
                        <el-popconfirm
                          :title="'确认更新？'"
                          :confirmButtonText="$t('common.confirm')"
                          :cancelButtonText="$t('common.cancel')"
                          @confirm="updateNumber(scope.row)"
                          hideIcon
                        >
                          <el-button
                            slot="reference"
                            class="red"
                            :disabled="scope.row.jqpb===1"
                          >
                            <i class="icon his-refresh"></i>
                          </el-button>
                        </el-popconfirm>
                      </el-tooltip>
                      <el-tooltip
                        :content="$t('common.intercept')"
                        effect="light"
                      >
                        <el-popconfirm
                          :title="'确认截取？'"
                          :confirmButtonText="$t('common.confirm')"
                          :cancelButtonText="$t('common.cancel')"
                          @confirm="interceptNumber(scope.row)"
                          hideIcon
                        >
                          <el-button
                            slot="reference"
                            class="red"
                            :disabled="scope.row.jqpb===1"
                          >
                            <i class="icon el-icon-scissors"></i>
                          </el-button>
                        </el-popconfirm>
                      </el-tooltip>
                      <el-tooltip
                        :content="$t('common.delete')"
                        effect="light"
                      >
                        <el-popconfirm
                          :title="'确认删除？'"
                          :confirmButtonText="$t('common.confirm')"
                          :cancelButtonText="$t('common.cancel')"
                          @confirm="delNumber(scope.row)"
                          hideIcon
                        >
                          <el-button
                            slot="reference"
                            class="red"
                            :disabled="scope.row.jqpb===1"
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
          <el-col class="ht" :span="8">
            <div class="his-module his-small">
              <div class="row">
                <div class="label">
                  <h1 class="title">{{item.rightTitle}}</h1>
                </div>
                <div class="operate">
                  <el-button
                    type="primary"
                    size="mini"
                    class="green-gra"
                    icon="icon his-save"
                    @click="handleSave(item.name)"
                    :loading="showLoading"
                  >{{$t('common.save')}}</el-button>
                </div>
              </div>
              <div class="form-wrap scroll-bar">
                <el-form
                  :ref="'form'+item.name"
                  :model="item.formData"
                  :rules="formRule"
                  label-width="68px"
                  class="clearfix"
                >

                  <!-- 起始号码 -->
                  <el-form-item :label="'起始号码'" prop="qshm">
                    <el-input
                      v-model="item.formData.qshm"
                      :placeholder="'请输入起始号码'"
                      @blur="assignSyhm"
                      @input="changeNum('qshm')"
                      :disabled="!item.isAdd"
                    ></el-input>
                  </el-form-item>

                  <!-- 终止号码 -->
                  <el-form-item :label="'终止号码'" prop="zzhm">
                    <el-input
                      v-model="item.formData.zzhm"
                      :placeholder="'请输入终止号码'"
                      @input="changeNum('zzhm')"
                      :disabled="!item.isAdd"
                    ></el-input>
                  </el-form-item>

                  <!-- 使用号码 -->
                  <el-form-item :label="'使用号码'" prop="syhm">
                    <el-input
                      v-model="item.formData.syhm"
                      :placeholder="'请输入使用号码'"
                      @input="changeNum('syhm')"
                    ></el-input>
                  </el-form-item>

                  <!-- 领用人 -->
                  <el-form-item :label="'领用人'" prop="ygdm">
                    <el-select v-model="item.formData.ygdm" :disabled="!item.isAdd">
                      <el-option
                        v-for="item in personList"
                        :key="item.dicId"
                        :value="Number(item.dicId)"
                        :label="item.dicName"
                      ></el-option>
                    </el-select>
                  </el-form-item>

                  <!-- 领用日期 -->
                  <el-form-item :label="'领用日期'" prop="lyrq">
                    <el-date-picker
                      type="datetime"
                      v-model="item.formData.lyrq"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                      class="date-wrapper"
                      :disabled="!item.isAdd"
                    ></el-date-picker>
                  </el-form-item>

                </el-form>
                <!-- <pre>{{item.formData}}</pre> -->
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
	</div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aAddNumber, aEditNumber, aDelNumber,toUpDateNumber,toInterceptNumber } from '@/api/his/op/reg/billNumberMaintain.ts'
import { findGroupUserDic } from '@/api/his/im/ims/billManage.ts'
import { getNow } from '@/api/his/basic'
import { parseTime } from '@/utils'
import { regInt } from '@/utils/validate.ts'

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
  private ab_1 = 123
  private showLoading:boolean = false
  private tabList: any[] = [
    {
      name: '1',
      label: '就诊号码维护',
      tableData: [],
      formData: {
        qshm:'',
        zzhm:'',
        syhm:'',
        ygdm:'',
        lyrq:'',
        pjlx: 1
      },
      isAdd: true,
      rightTitle: window.ele.$i18n.t('common.add')
    },
    {
      name: '2',
      label: '发票号码维护',
      tableData: [],
      formData: {
        qshm:'',
        zzhm:'',
        syhm:'',
        ygdm:'',
        lyrq:'',
        pjlx: 2
      },
      isAdd: true,
      rightTitle: window.ele.$i18n.t('common.add')
    },
    {
      name: '3',
      label: '档案号码维护',
      tableData: [],
      formData: {
        qshm:'',
        zzhm:'',
        syhm:'',
        ygdm:'',
        lyrq:'',
        pjlx: 3
      },
      isAdd: true,
      rightTitle: window.ele.$i18n.t('common.add')
    },
    {
      name: '4',
      label: '充值收据号码维护',
      tableData: [],
      formData: {
        qshm:'',
        zzhm:'',
        syhm:'',
        ygdm:'',
        lyrq:'',
        pjlx: 4
      },
      isAdd: true,
      rightTitle: window.ele.$i18n.t('common.add')
    },
  ]
  private activeName: string = '1'
  private curTabIndex: number = 0 // 当前tab索引
	private tableData: any[] = [] // 表格数据
	private searchData: any = {
    pjlx: 1
  } // 搜索参数
	private listSlotHeight: number = 0
	private loading: boolean = false
	// private rightTitle: string = window.ele.$i18n.t('common.add')
	private formDataBase: any = {
    qshm: '',
    zzhm: '',
    syhm: '',
    ygdm: '', // 员工代码（领用人）
    lyrq: '',
    jlxh: '', // 记录序号，修改、删除时必传
  }
	private formRule: any = {
    qshm: [
      {required: true, message:'起始号码不能为空', trigger: 'blur'},
      {pattern: regInt, message:'请输入正整数', trigger: 'blur'}
    ],
    zzhm: [
      {required: true, message:'终止号码不能为空', trigger: 'blur'},
      {pattern: regInt, message:'请输入正整数', trigger: 'blur'}
    ],
    syhm: [
      {required: true, message:'使用号码不能为空', trigger: 'blur'},
      {pattern: regInt, message:'请输入正整数', trigger: 'blur'}
    ],
    ygdm: [
      {required: true, message:'领用人不能为空', trigger: 'blur'}
    ],
    lyrq: [
      {required: true, message:'领用日期不能为空', trigger: 'blur'}
    ]
  }
  private personList: any[] = [] // 领用人列表

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

  // 复制表单
  private formCopy(){
    this.tabList[0].formData = {
      ...this.formDataBase,
      pjlx: 1 // 就诊号码
    }
    this.tabList[1].formData = {
      ...this.formDataBase,
      pjlx: 2 // 发票号码
    }
    this.tabList[2].formData = {
      ...this.formDataBase,
      pjlx: 3 // 门诊号码/档案号码
    }
    this.tabList[3].formData = {
      ...this.formDataBase,
      pjlx: 4 // 充值收据
    }
  }

  // 切换tab
  private changeTab(tab: any){
    this.curTabIndex = tab.index
    this.searchData.pjlx = tab.name
    this.searchLists()
    this.getTime()
  }

	// 获取列表
  private getLists() {
    const pageTable: any = this.$refs['pageTable1']
    console.log(pageTable);
    pageTable.getList()
  }

	// 获取详情
	private getDetail(row: any){
    this.tabList[this.curTabIndex].rightTitle = window.ele.$i18n.t('common.edit')
    this.tabList[this.curTabIndex].isAdd = false
    // 清空校验结果
    const formData: any = this.$refs['form'+this.activeName]
    formData[0].clearValidate()
    console.log(this.tabList[this.curTabIndex].formData);
    for (let i in this.tabList[this.curTabIndex].formData) {
      if(i!='pjlx'){
        this.tabList[this.curTabIndex].formData[i] = row[i]
      }
    }
  }

  // 条件查询
  private searchLists() {
    const pageTable: any = this.$refs['table'+this.activeName]
    pageTable[0].searchList()
  }

  // 新增按钮
  private handleAdd(){
    this.tabList[this.curTabIndex].rightTitle = window.ele.$i18n.t('common.add')
    this.tabList[this.curTabIndex].isAdd = true
    const formData: any = this.$refs['form'+this.activeName]
    formData[0].resetFields()
    this.getPersonList()
  }

  // 保存按钮
  private handleSave(tabName: string){
    const formData: any = this.$refs['form'+this.activeName]
    formData[0].validate((valid: any)=>{
      if(valid){
        this.showLoading = true
        if(this.tabList[this.curTabIndex].isAdd){
          this.addNumber()
        }else{
          this.editNumber()
        }
      }
    })
  }

  // 新增票据号码
  private addNumber(){
    aAddNumber(this.tabList[this.curTabIndex].formData).then((res:any)=>{
      this.showLoading = false
      if(res){
        this.$notify({
          title: this.$t('common.addSuc').toString(),
          message: '',
          type: 'success',
        })
        this.searchLists()
        this.handleAdd()
      }
    }).catch((err:any)=>{
      this.showLoading = false
    })
  }

  // 修改票据号码
  private editNumber(){
    aEditNumber(this.tabList[this.curTabIndex].formData).then((res:any)=>{
      this.showLoading = false
      if(res){
        this.$notify({
          title: this.$t('common.editSuc').toString(),
          message: '',
          type: 'success',
        })
        this.searchLists()
        this.handleAdd()
      }
    }).catch((err:any)=>{
      this.showLoading = false
    })
  }

  // 删除
  private delNumber(row: any){
    aDelNumber({jlxh: row.jlxh}).then((res: any) => {
      if(res){
        this.$notify({
          title: this.$t('common.delSuc').toString(),
          message: '',
          type: 'success',
        })
        this.searchLists()
        this.handleAdd()
      }
    })
  }
  //更新
   private updateNumber(row: any){
     let params = {
       pjlx:this.searchData.pjlx,
       jlxh:row.jlxh,
       sypb:row.sypb===1?0:1
     }
    toUpDateNumber(params).then((res: any) => {
      if(res){
        this.$notify({
          title: this.$t('common.upDataSuc').toString(),
          message: '',
          type: 'success',
        })
        this.searchLists()
        this.handleAdd()
      }
    })
  }
  //截取
  private interceptNumber(row: any){
    if(row.jqpb===1){
      this.$notify({
        title: '票据已截取',
        message: '',
        type: 'warning',
      })
      return
    }
    toInterceptNumber({jlxh: row.jlxh}).then((res: any) => {
      if(res){
        this.$notify({
          title: this.$t('common.interceptSuc').toString(),
          message: '',
          type: 'success',
        })
        this.searchLists()
        this.handleAdd()
      }
    })
  }
  // 赋值给使用号码
  private assignSyhm(){
    this.tabList[this.curTabIndex].formData.syhm = this.tabList[this.curTabIndex].formData.qshm
  }

  // 获取当前时间
  private getTime(){
    getNow().then((res: any) => {
      if(res){
        this.tabList[this.curTabIndex].formData.lyrq = parseTime(res.data, '{y}-{m}-{d} {h}:{i}:{s}')
      }
    })
  }

  // 领用人
  private getPersonList(){
    let params = {
      groupId: JSON.parse(localStorage.userInfo).groupId,
    }
    console.log(params);
    findGroupUserDic(params).then((res: any) => {
      if(res){
        this.personList = res.data
        // 默认当前用户
        for(let i of this.personList){
          if(i.dicId == JSON.parse(localStorage.getItem('userInfo') as any).userId){
            this.formDataBase.ygdm = Number(i.dicId)
            this.formCopy()
            this.getTime()
            break
          }
        }
      }
    })
  }

  // 截取长度
  private changeNum(s: string){
    if(this.tabList[this.curTabIndex].formData[s].length>50){
      this.tabList[this.curTabIndex].formData[s] = this.tabList[this.curTabIndex].formData[s].slice(0,50)
    }
  }




  //初始化的周期函数
	created() {
    let router:any = this.$route.query
    let activeName:string = router.activeName?router.activeName:''
    this.activeName = activeName ? activeName : this.activeName
    this.searchData.pjlx = activeName ? activeName : this.searchData.pjlx
    this.curTabIndex = activeName?Number(activeName)-1:this.curTabIndex
    this.listSlotHeight = Vue.prototype.PageHeight - 164
    // this.formCopy()
    this.getPersonList()
    this.getTime()
  }
  mounted() {
    //ts语法
		this.searchLists()
	}
}
</script>

<style lang="scss" scoped>
// el-tabs样式
.el-tabs{
  height: 100%;
  ::v-deep .el-tabs__header{
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 8px;
    background: #fff;
  }
  ::v-deep .el-tabs__content{
    height: calc(100% - 60px); // 40content+20padding+10margin
    .el-tab-pane{
      height: 100%;
    }
  }
}

.form-wrap{
  height: calc(100% - 52px);
}
.el-form {
	margin: 16px auto 0!important;
  // padding: 0 60px!important;
	.el-form-item {
    width: 288px;
    margin: 0 auto;
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
    .el-select ::v-deep{
      .el-input__inner{
        height: 28px!important;
      }
    }
    ::v-deep .el-form-item__content{
      width: 220px;
    }
  }
}
</style>
