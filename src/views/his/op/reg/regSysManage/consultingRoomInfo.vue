<template>
  <div class="content">
		<el-row class="ht" :gutter="10">
      <el-col class="ht" :span="17">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <div class="title">诊室信息维护</div>
              <el-divider direction="vertical"></el-divider>
              <el-radio-group v-model="searchType" @change="changeSearchType">
                <el-radio :label="1">诊室ID</el-radio>
                <el-radio :label="2">诊室名称</el-radio>
              </el-radio-group>
              <el-input
                v-if="searchType == 1"
                type="number"
                :placeholder="'请输入诊室ID'"
                v-model.number="searchData.zsid"
                @keyup.enter.native="searchLists"
                class="search ml10"
              >
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input>
              <el-input
                v-if="searchType == 2"
                :placeholder="'请输入诊室名称'"
                v-model="searchData.zsmc"
                @keyup.enter.native="searchLists"
                class="search ml10"
              >
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input>
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
            data-url="/op-service/opmzzs/queryPage"
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

							<!-- 挂号科室 -->
							<el-table-column
								:label="'挂号科室'"
								prop="ghksName"
                show-overflow-tooltip
							></el-table-column>

							<!-- 诊室ID -->
							<el-table-column
								:label="'诊室ID'"
								prop="zsid"
                width="68px"
							></el-table-column>

              <!-- 诊室名称 -->
							<el-table-column
								:label="'诊室名称'"
								prop="zsmc"
                show-overflow-tooltip
							></el-table-column>

              <!-- 屏幕ID -->
							<el-table-column
								:label="'屏幕ID'"
								prop="pmid"
                width="68px"
							></el-table-column>

							<!-- 是否启用 -->
							<el-table-column
								:label="'是否启用'"
                width="72px"
							>
                <template slot-scope="scope">
                  <span>{{scope.row.sfqyBoolean}}</span>
                </template>
              </el-table-column>

							<!-- 是否叫号 -->
							<el-table-column
								:label="'是否叫号'"
								prop="sfjhBoolean"
                width="72px"
							></el-table-column>

							<!-- 语音信息 -->
							<el-table-column
								:label="'语音信息'"
								prop="yyxx"
                show-overflow-tooltip
							></el-table-column>

              <el-table-column :label="$t('common.action')" align="center" width="76" class-name="action-btns">
                <template slot-scope="scope">
                  <el-tooltip
                    :content="$t('common.delete')"
                    effect="light"
                  >
                    <el-popconfirm
											:title="'确认删除？'"
											:confirmButtonText="$t('common.confirm')"
											:cancelButtonText="$t('common.cancel')"
                      @confirm="delRoom(scope.row)"
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
              <!-- {{curOldZsId}} -->
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
              label-width="68px"
              class="clearfix"
						>

							<!-- 挂号科室 -->
							<el-form-item :label="'挂号科室'" prop="ghks">
                <search-select
                  table-name="SYS_DICT_CONFIG"
                  kid="13"
                  v-model="formData.ghks"
                  :placeholder="'请选择挂号科室'"
                  :backfillValue="formData.ghks"
                />
              </el-form-item>

              <!-- 诊室ID -->
							<el-form-item :label="'诊室ID'" prop="zsid">
                <el-input
                  :placeholder="'请输入诊室ID'"
                  v-model.number="formData.zsid"
                  type="number"
                ></el-input>
              </el-form-item>

              <!-- 诊室名称 -->
							<el-form-item :label="'诊室名称'" prop="zsmc">
                <el-input
                  :placeholder="'请输入诊室名称'"
                  v-model.trim="formData.zsmc"
                  maxlength="12"
                ></el-input>
              </el-form-item>

              <!-- 屏幕ID -->
							<el-form-item :label="'屏幕ID'" prop="pmid">
                <el-input
                  :placeholder="'请输入屏幕ID'"
                  v-model="formData.pmid"
                  type="number"
                ></el-input>
              </el-form-item>

              <!-- 服务台 -->
							<el-form-item :label="'服务台'" prop="fwtid">
                <el-select v-model="formData.fwtid">
                  <el-option
                    v-for="item in fwtList"
                    :key="item.rid"
                    :value="item.rid"
                    :label="item.zsmc"
                  ></el-option>
								</el-select>
              </el-form-item>

              <!-- ip -->
							<el-form-item
                v-for="(item, index) in formData.ipArr"
                :key="index"
                :label="index==0?'ip':''"
                :prop="'ipArr['+index+'].ip'"
                :class="index==0?'':'item-ip'"
              >
                <el-input
                  :placeholder="'请输入ip'"
                  v-model="item.ip"
                ></el-input>
                <i v-if="index!=0" @click="delIp(index)" class="icon btn-del his-caozuo_zhuxiao"></i>
              </el-form-item>

							<el-form-item class="item-ip">
                <div class="btn-add" @click="addIp">
                  <i class="icon his-btn-add"></i>
                  <span>增加ip</span>
                </div>
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

							<!-- 是否叫号 -->
							<el-form-item :label="'是否叫号'" prop="sfjh">
                <el-select v-model="formData.sfjh">
                  <el-option
                    v-for="item in booleanList"
                    :key="item.dv"
                    :value="item.dv"
                    :label="item.dn"
                  ></el-option>
								</el-select>
              </el-form-item>

							<!-- 语音信息 -->
							<el-form-item :label="'语音信息'" prop="yyxx" class="item-yyxx">
                <el-input
                  :placeholder="'请输入语音信息'"
                  v-model="formData.yyxx"
                ></el-input>
              </el-form-item>

              <!-- 诊室识别序号 -->
							<el-form-item :label="'诊室识别序号'" prop="sbxh" hidden>
                <el-input
                  :placeholder="'请输入'"
                  v-model="formData.sbxh"
                ></el-input>
              </el-form-item>
						</el-form>
          </div>
        </div>
      </el-col>
    </el-row>
	</div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aAddRoom, aEditRoom, aDelRoom, aValidRoomId, aqueryFwtList } from '@/api/his/op/reg/consultingRoomInfo'
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
  private searchType: number = 1 // 查询条件
  private searchData: any = {
    zsid: '',
    zsmc: ''
  } // 查询值
	private listSlotHeight: number = 0
	private loading: boolean = false
	private rightTitle: string = window.ele.$i18n.t('common.add')
  private showLoading:boolean = false
	private formData: any = {
    ghks: '',
    zsid: '',
    zsmc: '',
    pmid: '',
    fwtid: '', // 服务台
    ipArr: [{ip: ''}],
    sfqy: '1', // 是否启用
    sfjh: '1', // 是否叫号
    yyxx: '',
    sbxh: ''
  } // 表单数据
  private validRoomId: any = (rule: any, value: any, callback: any) => {
    this.validRoomIdDup(value, 1, callback)
  }
  private validRoomId1: any = (rule: any, value: any, callback: any) => {
    this.validRoomIdDup(value, 2, callback)
  }
	private formRule: any = {
    ghks: [
      {required: true, trigger: 'blur', message: '挂号科室不能为空'},
    ],
    zsid: [
      {required: true, trigger: 'blur', message: '诊室id不能为空'},
      {validator: this.validRoomId, trigger: 'blur'}
    ],
    zsmc: [
      {required: true, trigger: 'blur', message: '诊室名称不能为空'},
      {validator: this.validRoomId1, trigger: 'blur'}
    ]
  } // 表单验证
  private isAdd: boolean = true
  private booleanList: any[] = [] // 是否
  private regDeptList: any[] = [] // 挂号科室
  private fwtList: any[] = [] // 服务台列表
  private curOldZsId: number|null = null


  //监听方法
  @Watch('tableData')
	private onValueChange(value: string) {
		this.loading = false
  }

  // 获取所有服务台
  private getFwtList(){
    aqueryFwtList({}).then((res: any) => {
      if(res){
        this.fwtList = res.data
      }
    })
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
      if(i!='ipArr'){
        this.formData[i] = row[i]
      }
    }
    // 显示ip
    if(row.ip){
      this.formData.ipArr = []
      let ips = row.ip.split(',')
      ips.forEach((item: any)=>{
        this.formData.ipArr.push({ip: item})
      })
    }else{
      this.formData.ipArr = [{ip: ''}]
    }

    this.curOldZsId = this.formData.zsid
  }

  // 切换查询条件
  private changeSearchType(value: any){
    if(value == 1){
      this.searchData.zsmc = ''
    }else{
      this.searchData.zsid = ''
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
    this.formData.ipArr = [{ip:''}]
    this.curOldZsId = null
  }

  // 保存按钮
  private handleSave(){
    const formData: any = this.$refs.formData
    formData.validate((valid: any)=>{
      if(valid){
        this.showLoading = true
        // 保存ip
        let ips: any = []
        this.formData.ipArr.forEach((item: any)=>{
          ips.push(item.ip)
        })
        this.$set(this.formData, 'ip', ips.join(','))

        if(this.isAdd){
          this.addRoom()
        }else{
          this.editRoom()
        }
      }
    })
  }

  // 新增诊室
  private addRoom(){
    let params = JSON.parse(JSON.stringify(this.formData))
    aAddRoom(params).then((res:any)=>{
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

  // 编辑诊室
  private editRoom(){
    let params = JSON.parse(JSON.stringify(this.formData))
    aEditRoom(params).then((res:any)=>{
      this.showLoading = false
      if(res){
        this.$notify({
          title: this.$t('common.editSuc').toString(),
          message: '',
          type: 'success',
        })
        this.getLists()
        this.handleAdd()
        this.curOldZsId = this.formData.zsid
      }
    }).catch((err:any)=>{
      this.showLoading = false
    })
  }

  // 保存ip
  private saveIp(){}

  // 删除科室
  private delRoom(row: any){
    aDelRoom({sbxh: row.sbxh}).then((res: any) => {
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

  // 诊室id查重
  private validRoomIdDup(value: any,num:number, callback: any){
    if(this.formData.ghks){
      let params:any = {
        ghks: this.formData.ghks,
        oldZsId: this.curOldZsId,
        // zsId: this.formData.zsid,
        // zsmc:this.formData.zsmc
      }
      if(num===1){
        params.zsId=this.formData.zsid
      }else{
        params.zsmc=this.formData.zsmc
      }
      aValidRoomId(params).then((res: any) => {
        if(res){
          if(res.message==null){
            callback()
          }else{
            callback(new Error(res.message))
          }
        }
      })
    }else{
      // callback()
    }
  }

  // 增加ip
  private addIp(){
    this.formData.ipArr.push({ip:''})
  }

  // 删除ip
  private delIp(index: number){
    this.formData.ipArr.splice(index, 1)
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
        getTableData( // 挂号科室
          'SYS_DICT_CONFIG',
          '13',
          "select dv,dn from SYS_DICT_CONFIG_VALUE where dk='13'",
          function (data: any) {
            _that.regDeptList = data
            _that.getLists()
          }
        )
      }
    )
  }

  // 表格转字典数据
  get tableFormat() {
    let newData: any = []
    newData = id2Name(this.tableData, 'ghks', 'ghksName', this.regDeptList, 'dv', 'dn')
    newData = id2Name(this.tableData, 'sfqy', 'sfqyBoolean', this.booleanList, 'dv', 'dn')
    newData = id2Name(this.tableData, 'sfjh', 'sfjhBoolean', this.booleanList, 'dv', 'dn')
    return newData
  }




  //初始化的周期函数
	created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 106
  }
  mounted() {
    this.getDicData()
    this.getFwtList()
	}
}
</script>

<style lang="scss" scoped>
// 单选框
.el-radio-group {
  .el-radio {
    ::v-deep .el-radio__label {
      font-size: 13px;
    }
  }
}

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

  .item-ip{
    ::v-deep .el-input{
      width: calc(100% - 20px);
    }
    .btn-add{
      color: $blue;
      cursor: pointer;
    }
    .btn-del{
      margin-left: 4px;
      color: $third;
      cursor: pointer;
    }
  }
}
</style>
