<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="6">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <div class="title">减免政策</div>
            </div>
            <div class="operate">
            </div>
          </div>
          <pagenation-list
            ref="pageTable1"
            v-model="tableData1"
            data-url="/op-service/pubjmlx/queryPage"
            :search-data="searchData1"
            :pageProps="{ layout: 'total, prev, pager, next' }"
            http-method="post"
            :list-height="listSlotHeight"
          >
            <el-table
              slot="list"
              stripe
              ref="table1"
              :highlight-current-row="true"
              :data="tableData1"
              @row-click="getDetail1"
              border
              v-loading="loading1"
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

							<!-- 性质 -->
							<el-table-column
								:label="'性质'"
								prop="gsxz"
                min-width="90"
							>
                <template slot-scope="scope">
                  <div v-if="brxzList.find(item => item.dv==scope.row.gsxz)">
                    {{brxzList.find(item => item.dv==scope.row.gsxz).dn}}
                  </div>
                  <div v-else>{{scope.row.gsxz}}</div>
                </template>
              </el-table-column>

							<!-- 政策名称 -->
							<el-table-column
								:label="'政策名称'"
								prop="dwmc"
                min-width="120"
                show-overflow-tooltip
							></el-table-column>

              <!-- 单位编号 -->
							<!-- <el-table-column
								:label="'单位编号'"
								prop="dwbh"
							></el-table-column> -->
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col class="ht" :span="13">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <div class="title">患者明细</div>
              <!-- <el-divider direction="vertical"></el-divider>
              <div class="btn">
                <el-button
                  type="text"
                  size="mini"
                >
                  <i class="icon his-caozuo-excle blue"></i>
                  <span>导入</span>
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
            ref="pageTable2"
            v-model="tableData2"
            data-url="/op-service/pubjmbr/queryPage"
            :search-data="searchData2"
            http-method="post"
            :list-height="listSlotHeight"
          >
            <el-table
              slot="list"
              stripe
              ref="table2"
              :highlight-current-row="true"
              :data="tableData2"
              @row-click="getDetail2"
              border
              v-loading="loading2"
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

							<!-- 性质 -->
							<el-table-column
								:label="'性质'"
								prop="brxz"
							>
                <template slot-scope="scope">
                  <div v-if="brxzList.find(item => item.dv==scope.row.brxz)">
                    {{brxzList.find(item => item.dv==scope.row.brxz).dn}}
                  </div>
                  <div v-else>{{scope.row.brxz}}</div>
                </template>
              </el-table-column>

              <!-- 证号 -->
							<el-table-column
								:label="'卡号'"
								prop="fyzh"
                min-width="120"
							></el-table-column>

							<!-- 单位 -->
							<!-- <el-table-column
								:label="'单位'"
								prop="fydw"
							></el-table-column> -->

              <!-- 姓名 -->
							<el-table-column
								:label="'姓名'"
								prop="brxm"
							></el-table-column>

              <!-- 性别 -->
							<el-table-column
								:label="'性别'"
								prop="brxb"
                min-width="60"
							>
                <template slot-scope="scope">
                  <div v-if="genderList.find(item => item.dv==scope.row.brxb)">
                    {{genderList.find(item => item.dv==scope.row.brxb).dn}}
                  </div>
                </template>
              </el-table-column>

              <!-- 出生年月 -->
							<el-table-column
								:label="'出生年月'"
								prop="csny"
                min-width="80"
							></el-table-column>

              <!-- 领证日期 -->
							<el-table-column
								:label="'领证日期'"
								prop="lzrq"
                min-width="80"
							></el-table-column>

              <!-- 家长姓名 -->
							<el-table-column
								:label="'家长姓名'"
								prop="jzxm"
							></el-table-column>

              <!-- 作废标识 -->
							<el-table-column
								:label="'作废标识'"
								prop="zfpb"
							>
                <template slot-scope="scope">
                  <div v-if="booleanList.find(item => item.dv==scope.row.zfpb)">
                    {{booleanList.find(item => item.dv==scope.row.zfpb).dn}}
                  </div>
                  <div v-else>{{scope.row.zfpb}}</div>
                </template>
              </el-table-column>

              <!-- 证号效期 -->
							<el-table-column
								:label="'证号效期'"
								prop="zhxq"
							></el-table-column>

              <!-- 标识 -->
							<!-- <el-table-column
								:label="'标识'"
								prop="scbz"
							></el-table-column> -->

              <el-table-column :label="$t('common.action')" align="center" fixed="right" width="60">
                <template slot-scope="scope">
                  <el-tooltip
                    :content="$t('common.delete')"
                    effect="light"
                  >
                    <el-popconfirm
											:title="'确认删除？'"
											:confirmButtonText="$t('common.confirm')"
											:cancelButtonText="$t('common.cancel')"
                      @confirm="del(scope.row)"
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
      <el-col class="ht" :span="5">
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
            :key="keyIndex"
							ref="formData"
              :model="formData"
              :rules="formRule"
              label-width="60px"
              class="clearfix"
						>

              <!-- 政策 -->
							<el-form-item :label="'减免政策'" prop="fydw">
                <search-select
                  table-name="SYS_DICT_CONFIG"
                  kid="46"
                  v-model="formData.fydw"
                  :backfillValue="formData.fydw"
									:placeholder="'减免政策'"
                />
              </el-form-item>

              <!-- 证号 -->
							<el-form-item :label="'卡号'" prop="fyzh" :class="!isAdd?'is-disabled':''">
                <el-input
                  :placeholder="'请输入卡号'"
                  v-model="formData.fyzh"
                  :disabled="!isAdd"
                  @keyup.enter.native="queryPerson"
                ></el-input>
              </el-form-item>

              <!-- 性质 -->
							<el-form-item :label="'性质'" prop="brxz" class="is-disabled">
                <search-select
                  table-name="SYS_DICT_CONFIG"
                  kid="14"
                  v-model="formData.brxz"
                  :backfillValue="formData.brxz"
                  :placeholder="'性质'"
                  :disabled="true"
                />
              </el-form-item>

              <!-- 姓名 -->
							<el-form-item :label="'姓名'" prop="brxm" class="is-disabled">
                <el-input
                  :placeholder="'请输入姓名'"
                  v-model="formData.brxm"
                  @change="getPywb"
                  :disabled="true"
                ></el-input>
              </el-form-item>

              <!-- 拼音代码 -->
							<!-- <el-form-item :label="'拼音代码'" prop="pydm">
                <el-input
                  :placeholder="'请输入拼音代码'"
                  v-model="formData.pydm"
                ></el-input>
              </el-form-item> -->

							<!-- 性别 -->
							<el-form-item :label="'性别'" prop="brxb" class="is-disabled">
                <el-select v-model="formData.brxb" :disabled="true">
									<el-option
                    v-for="item in genderList"
                    :key="item.dv"
                    :value="Number(item.dv)"
                    :label="item.dn"
                  ></el-option>
								</el-select>
              </el-form-item>

              <!-- 出生年月 -->
							<el-form-item :label="'出生年月'" prop="csny" class="is-disabled">
                <el-date-picker
                  type="date"
                  v-model="formData.csny"
                  value-format="yyyy-MM-dd"
                  :placeholder="'请选择日期'"
                  class="date-wrapper"
                  :disabled="true"
                ></el-date-picker>
              </el-form-item>

              <!-- 领证日期 -->
							<el-form-item :label="'领证日期'" prop="lzrq">
                <el-date-picker
                  type="date"
                  v-model="formData.lzrq"
                  value-format="yyyy-MM-dd"
                  :placeholder="'请选择日期'"
                  class="date-wrapper"
                ></el-date-picker>
              </el-form-item>

              <!-- 家长姓名 -->
							<el-form-item :label="'家长姓名'" prop="jzxm">
                <el-input
                  :placeholder="'请输入家长姓名'"
                  v-model="formData.jzxm"
                ></el-input>
              </el-form-item>

							<!-- 作废标识 -->
							<el-form-item :label="'作废标识'" prop="zfpb">
                <el-select
                  v-model="formData.zfpb"
                  :placeholder="'请选择作废标识'"
                >
                  <el-option
                    v-for="item in booleanList"
                    :key="item.dv"
                    :value="Number(item.dv)"
                    :label="item.dn"
                  ></el-option>
                </el-select>
              </el-form-item>

              <!-- 证号效期 -->
							<el-form-item :label="'证号效期'" prop="zhxq">
                <el-date-picker
                  type="date"
                  v-model="formData.zhxq"
                  value-format="yyyy-MM-dd"
                  :placeholder="'请选择日期'"
                  class="date-wrapper"
                ></el-date-picker>
              </el-form-item>

              <!-- 标识 -->
							<!-- <el-form-item :label="'标识'" prop="scbz">
                <el-input
                  :placeholder="'请输入标识'"
                  v-model="formData.scbz"
                ></el-input>
              </el-form-item> -->

						</el-form>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- <pre>{{formData}}</pre> -->
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aSaveFybr, aDeleteFybr } from '@/api/his/op/reg/reduction.ts'
import { aQueryPatientInfo } from '@/api/his/op/reg/registerManage.ts'
import { regInt, regTel, zipCode } from '@/utils/validate.ts'
import { rightScroll } from '@/utils/index.ts'
import { pywb } from '@/api/his/basic/index.ts'

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
  private tableData1: any[] = [] // 表格数据
  private tableData2: any[] = []
	private searchData1: any = {
    pydm: ''
  } // 搜索参数
  private searchData2: any = {
    fydw: ''
  }
  private showLoading:boolean = false
	private listSlotHeight: number = 0
  private loading1: boolean = false
  private loading2: boolean = false
	private rightTitle: string = window.ele.$i18n.t('common.add')
	private formData: any = {
    brxz: '', // 性质 *
    fyzh: '', // 证号 *
    fydw: '', // 政策
    brxm: '', // 姓名
    pydm: '', // 拼音码
    brxb: '', // 性别
    csny: '', // 出生年月
    lzrq: '', // 领证日期
    jzxm: '', // 家长姓名
    zfpb: 0, // 作废判别 *
    zhxq: '', // 证号效期
    scbz: '0', // 标识 *
  } // 表单数据
  private keyIndex:number = 1
	private formRule: any = {
    brxz: [
      {required: true, message: '性质不能为空', trigger: 'blur'}
    ],
    fyzh: [
      {required: true, message: '证号不能为空', trigger: 'blur'}
    ],
    ghf: [
      {required: true, message: '挂号费不能为空', trigger: 'blur'}
    ],
    zlf: [
      {required: true, message: '诊疗费不能为空', trigger: 'blur'}
    ],
    ksfjh: [
      {required: true, message: '科室分机号不能为空', trigger: 'blur'}
    ]
  } // 表单验证
  private isAdd: boolean = true
  private genderList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT // 性别
  private booleanList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.Y_OR_N_DICT : this.$store.state.webSqlDict.Y_OR_N_DICT // 是/否
  private reductionList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REDUCTION_POLICY : this.$store.state.webSqlDict.REDUCTION_POLICY // 减免政策
  private brxzList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_PATIENT_DICT : this.$store.state.webSqlDict.TABLE_PATIENT_DICT
  private curPolicy: any = '' // 当前政策

  public setValue(value: string) {
    this.setValue(value)
  }
  public getValue() {
    return null
  }
  //监听方法
  @Watch('tableData2')
	private onValueChange(value: string) {
    // this.loading1 = false
    rightScroll()
	}

	// 获取列表
  private getLists1() {
    const pageTable1: any = this.$refs['pageTable1']
    pageTable1.getList()
  }

  private getLists2() {
    const pageTable2: any = this.$refs['pageTable2']
    pageTable2.getList()
  }

  // 条件查询
  private searchLists1() {
    const pageTable1: any = this.$refs['pageTable1']
    pageTable1.searchList()
  }

  private searchLists2() {
    const pageTable2: any = this.$refs['pageTable2']
    pageTable2.searchList()
  }

	// 获取详情
	private getDetail1(row: any){
    this.searchData2.fydw = row.fydw
    this.searchLists2()

    this.curPolicy = row.fydw
    this.handleAdd()
  }

  private getDetail2(row: any){
    this.rightTitle = window.ele.$i18n.t('common.edit')
    this.isAdd = false
    // 清空校验结果
    const formData: any = this.$refs.formData
    formData.resetFields()
    for (let i in this.formData) {
        this.formData[i] = row[i]
    }
  }

  // 新增按钮
  private handleAdd(){
    this.rightTitle = window.ele.$i18n.t('common.add')
    this.isAdd = true
    const formData: any = this.$refs.formData
    formData.resetFields()

    this.formData.fydw = this.curPolicy
  }

  // 卡号查询
  private queryPerson(){
    aQueryPatientInfo({jzkh: this.formData.fyzh}).then((res: any) => {
      if(res){
        this.formData.brxz = res.data.brxz
        this.formData.brxm = res.data.brxm
        this.formData.brxb = res.data.brxb
        this.formData.csny = res.data.csny
      }
    })
  }

  // 保存按钮
  private handleSave(){
    const formData: any = this.$refs.formData
    formData.validate((valid: any)=>{
      if(valid){
        this.showLoading = true
        let params = {
          ...this.formData
        }
        aSaveFybr(params).then((res: any) => {
          this.showLoading = false
          if(res){
            this.$notify({
              title: '保存成功',
              message: '',
              type: 'success'
            })
            this.getLists2()
            this.handleAdd()
          }
        }).catch((err:any)=>{
          this.showLoading = false
        })
      }
    })
  }

  // 删除
  private del(){
    aDeleteFybr({fyzh: this.formData.fyzh}).then((res: any) => {
      if(res){
        this.$notify({
          title: '删除成功',
          message: '',
          type: 'success'
        })
        this.getLists2()
        this.handleAdd()
      }
    })
  }

  // 生成拼音五笔
  private getPywb(value: any){
    pywb(value).then((res: any) => {
      if(res){
        this.formData.pydm = res.data.pinyin
        // this.formData.wbdm = res.data.wubi
      }
    })
  }


  //初始化的周期函数
	created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 104
  }
  mounted() {
    console.log('asdfdsf');
    console.log(this.reductionList);
    this.getLists1()
    // this.getLists2()
	}
}
</script>

<style lang="scss" scoped>
.form-wrap{
  height: calc(100% - 52px);
}
.el-form {
	margin: 16px auto 0!important;
  // padding: 0 10px!important;
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

pre{
  position: absolute;
  bottom: 100px;
  right: 400px;
}
</style>
