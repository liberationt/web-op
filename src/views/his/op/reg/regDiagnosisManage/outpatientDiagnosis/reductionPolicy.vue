<template>
  <div class="content">
		<el-row class="ht" :gutter="10">
      <el-col class="ht" :span="14">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <div class="title">政策管理</div>
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
            data-url="/op-service/pubjmlx/queryPage"
            :search-data="searchData"
            http-method="post"
            :list-height="listSlotHeight"
          >
            <el-table
              slot="list"
              stripe
              ref="table"
              :highlight-current-row="true"
              :data="tableData"
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

							<!-- 性质 -->
							<el-table-column
								:label="'性质'"
								prop="gsxz"
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
                min-width="140"
                show-overflow-tooltip
							></el-table-column>

              <!-- 政策编号 -->
							<!-- <el-table-column
								:label="'政策编号'"
								prop="dwbh"
							></el-table-column> -->

							<!-- 地址 -->
							<!-- <el-table-column
								:label="'地址'"
								prop="dwdz"
                min-width="140"
                show-overflow-tooltip
							></el-table-column> -->

              <!-- 电话 -->
							<!-- <el-table-column
								:label="'电话'"
								prop="dwdh"
							></el-table-column> -->

							<!-- 邮编 -->
							<!-- <el-table-column
								:label="'邮编'"
								prop="dwyb"
							></el-table-column> -->

							<!-- 开户银行 -->
							<!-- <el-table-column
								:label="'开户银行'"
								prop="khyh"
							></el-table-column> -->

              <!-- 账号 -->
							<!-- <el-table-column
								:label="'账号'"
								prop="yhzh"
                min-width="160"
							></el-table-column> -->

              <!-- 负责人 -->
							<!-- <el-table-column
								:label="'负责人'"
								prop="fzr"
							></el-table-column> -->

              <!-- 拼音码 -->
							<!-- <el-table-column
								:label="'拼音码'"
								prop="pydm"
							></el-table-column> -->

              <!-- 五笔码 -->
							<!-- <el-table-column
								:label="'五笔码'"
								prop="wbdm"
							></el-table-column> -->

              <!-- 角形码 -->
							<!-- <el-table-column
								:label="'角形码'"
								prop="jxdm"
							></el-table-column> -->

              <!-- 其他码 -->
							<!-- <el-table-column
								:label="'其他码'"
								prop="qtbm"
							></el-table-column> -->

              <!-- 备注 -->
							<el-table-column
								:label="'备注'"
								prop="bzxx"
							></el-table-column>

              <!-- 作废判别 -->
							<el-table-column
								:label="'是否作废'"
                min-width="80"
							>
                <template slot-scope="scope">
                  <div v-if="booleanList.find(item => item.dv==scope.row.zfpb)">
                    {{booleanList.find(item => item.dv==scope.row.zfpb).dn}}
                  </div>
                </template>
              </el-table-column>

              <el-table-column :label="$t('common.action')" width="60" align="center" fixed="right">
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
      <el-col class="ht" :span="10">
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
              label-width="74px"
						>
              <div class="area-title">
                <i class="icon his-detail icon1"></i>
                <span>基本信息</span>
              </div>

              <div class="item-area clearfix">
                <!-- 性质 -->
                <el-form-item :label="'性质'" prop="gsxz">
                  <search-select
                    table-name="SYS_DICT_CONFIG"
                    kid="14"
                    v-model="formData.gsxz"
                    :backfillValue="formData.gsxz"
                    :placeholder="'性质'"
                  />
                </el-form-item>

                <!-- 政策名称 -->
                <el-form-item :label="'政策名称'" prop="dwmc">
                  <el-input
                    :placeholder="'请输入政策名称'"
                    v-model="formData.dwmc"
                    @change="getPywb"
                  ></el-input>
                </el-form-item>

                <!-- 政策编号 -->
                <!-- <el-form-item :label="'政策编号'" prop="dwbh">
                  <el-input
                    :placeholder="'请输入政策编号'"
                    v-model="formData.dwbh"
                  ></el-input>
                </el-form-item> -->

                <!-- 地址 -->
                <!-- <el-form-item :label="'地址'" prop="dwdz">
                  <el-input
                    :placeholder="'请输入地址'"
                    v-model="formData.dwdz"
                  ></el-input>
                </el-form-item> -->

                <!-- 电话 -->
                <!-- <el-form-item :label="'电话'" prop="dwdh">
                  <el-input
                    :placeholder="'请输入电话'"
                    v-model="formData.dwdh"
                  ></el-input>
                </el-form-item> -->

                <!-- 邮编 -->
                <!-- <el-form-item :label="'邮编'" prop="dwyb">
                  <el-input
                    :placeholder="'请输入邮编'"
                    v-model="formData.dwyb"
                  ></el-input>
                </el-form-item> -->

                <!-- 开户银行 -->
                <!-- <el-form-item :label="'开户银行'" prop="khyh">
                  <el-input
                    :placeholder="'请输入开户银行'"
                    v-model="formData.khyh"
                  ></el-input>
                </el-form-item> -->

                <!-- 账号 -->
                <!-- <el-form-item :label="'账号'" prop="yhzh">
                  <el-input
                    :placeholder="'请输入账号'"
                    v-model="formData.yhzh"
                  ></el-input>
                </el-form-item> -->

                <!-- 负责人 -->
                <!-- <el-form-item :label="'负责人'" prop="fzr">
                  <el-input
                    :placeholder="'请输入负责人'"
                    v-model="formData.fzr"
                  ></el-input>
                </el-form-item> -->

                <!-- 拼音码 -->
                <!-- <el-form-item :label="'拼音码'" prop="pydm">
                  <el-input
                    :placeholder="'请输入拼音码'"
                    v-model="formData.pydm"
                  ></el-input>
                </el-form-item> -->

                <!-- 五笔码 -->
                <!-- <el-form-item :label="'五笔码'" prop="wbdm">
                  <el-input
                    :placeholder="'请输入五笔码'"
                    v-model="formData.wbdm"
                  ></el-input>
                </el-form-item> -->

                <!-- 角形码 -->
                <!-- <el-form-item :label="'角形码'" prop="jxdm">
                  <el-input
                    :placeholder="'请输入角形码'"
                    v-model="formData.jxdm"
                  ></el-input>
                </el-form-item> -->

                <!-- 其他码 -->
                <!-- <el-form-item :label="'其他码'" prop="qtbm">
                  <el-input
                    :placeholder="'请输入其他码'"
                    v-model="formData.qtbm"
                  ></el-input>
                </el-form-item> -->

                <!-- 作废判别 -->
                <el-form-item :label="'是否作废'" prop="zfpb">
                  <el-select
                    v-model="formData.zfpb"
                    :placeholder="'请输入作废判别'"
                  >
                    <el-option
                      v-for="item in booleanList"
                      :key="item.dv"
                      :value="Number(item.dv)"
                      :label="item.dn"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <!-- 备注 -->
                <el-form-item :label="'备注'" prop="bzxx">
                  <el-input
                    :placeholder="'请输入备注'"
                    v-model="formData.bzxx"
                  ></el-input>
                </el-form-item>

                <!-- 主键 -->
                <el-form-item :label="'主键'" prop="fydw" hidden>
                  <el-input
                    :placeholder="'主键'"
                    v-model="formData.fydw"
                  ></el-input>
                </el-form-item>
              </div>

              <div class="area-title">
                <i class="icon his-advance-payment icon2"></i>
                <span>减免政策</span>
              </div>

              <div class="item-area clearfix">
                <!-- 挂号费是否减免 -->
                <el-form-item :label="'挂号费减免'" prop="ghjm">
                  <el-select
                    v-model="formData.ghjm"
                    :placeholder="'挂号费减免'"
                    @change="changeGhjm"
                  >
                    <el-option
                      v-for="item in booleanList"
                      :key="item.dv"
                      :value="item.dv"
                      :label="item.dn"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <!-- 挂号费折扣 -->
                <el-form-item :label="'折扣比例'" prop="ghjmrate" :class="formData.ghjm==true?'':'is-disabled'" :error="ghjmError">
                  <el-input
                    v-model="formData.ghjmrate"
                    type="number"
                    :placeholder="'0~1'"
                    @change="ghjmChange"
                    :disabled="formData.ghjm==true?false:true"
                  ></el-input>
                </el-form-item>

                <!-- 门诊费是否减免 -->
                <el-form-item :label="'门诊费减免'" prop="isSfjm">
                  <el-select
                    v-model="formData.isSfjm"
                    :placeholder="'门诊费减免'"
                    @change="changeSfjm"
                  >
                    <el-option
                      v-for="item in booleanList"
                      :key="item.dv"
                      :value="item.dv"
                      :label="item.dn"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <!-- 门诊费折扣 -->
                <el-form-item :label="'折扣比例'" prop="jsjmrate" :class="formData.isSfjm==true?'':'is-disabled'" :error="jsjmError">
                  <el-input
                    v-model="formData.jsjmrate"
                    type="number"
                    :placeholder="'0~1'"
                    @change="jsjmChange"
                    :disabled="formData.isSfjm==true?false:true"
                  ></el-input>
                </el-form-item>

                <el-checkbox-group v-model="chargeType">
                  <el-checkbox
                    v-for="item in chargeTypeList"
                    :key="item.dv"
                    :label="item.dv.toString()"
                    :disabled="formData.isSfjm==true?false:true"
                  >{{item.dn}}</el-checkbox>
                </el-checkbox-group>
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
import { aSaveFydw, aDeleteFydw } from '@/api/his/op/reg/reduction.ts'
import { rightScroll } from '@/utils/index.ts'
import { regInt, regTel, zipCode } from '@/utils/validate.ts'
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
	private tableData: any[] = [] // 表格数据
	private searchData: any = {
    pydm: ''
  } // 搜索参数
  private showLoading = false
	private listSlotHeight: number = 0
	private loading: boolean = false
	private rightTitle: string = window.ele.$i18n.t('common.add')
	private formData: any = {
    gsxz: '', // 性质 *
    dwmc: '', // 单位名称 *
    dwbh: '', // 单位编号
    dwdz: '', // 单位地址
    dwdh: '', // 单位电话
    dwyb: '', // 单位邮编
    khyh: '', // 开户银行
    yhzh: '', // 账号
    fzr: '', // 负责人
    pydm: '', // 拼音码
    wbdm: '', // 五笔码
    jxdm: '', // 角形码
    qtbm: '', // 其他码
    bzxx: '', // 备注
    zfpb: 0, // 作废判别 *
    fydw: '', // 主键 *
    ghjm: '0', // 挂号是否减免
    ghjmrate: '', // 挂号减免比例
    isSfjm: '0', // 收费是否减免
    sfjm: '', // 收费减免项
    jsjmrate: '', // 收费减免比例
  } // 表单数据
	private formRule: any = {
    gsxz: [
      {required: true, message: '性质不能为空', trigger: 'blur'}
    ],
    dwmc: [
      {required: true, message: '单位名称不能为空', trigger: 'blur'}
    ],
    dwdh: [
      {pattern: regTel, message: '请输入正确的电话号码', trigger: 'blur'}
    ],
    dwyb: [
      {pattern: zipCode, message: '请输入正确的邮编', trigger: 'blur'}
    ],
    ghjmrate:[],
    jsjmrate:[],
  } // 表单验证
  private ghjmError: string = ''
  private jsjmError: string = ''
  private isAdd: boolean = true
  private booleanList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.Y_OR_N_DICT : this.$store.state.webSqlDict.Y_OR_N_DICT
  private chargeTypeList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.CHARGE_TYPE : this.$store.state.webSqlDict.CHARGE_TYPE
  private brxzList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_PATIENT_DICT : this.$store.state.webSqlDict.TABLE_PATIENT_DICT
  private chargeType: any[] = [] // 选中的收费减免项

  public setValue(value: string) {
    this.setValue(value)
  }
  public getValue() {
    return null
  }
  //监听方法
  @Watch('tableData')
	private onValueChange(value: string) {
    // this.loading = false
    rightScroll()
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

    // 是否有收费减免项
    this.chargeType = []
    if(this.formData.sfjm){ // 不为空字符空或不为null
      this.formData.isSfjm = '1'
      this.chargeType = this.formData.sfjm.split(',')
    }else{
      this.formData.isSfjm = '0'
    }
    this.changeGhjm(this.formData.ghjm)
    this.changeSfjm(this.formData.isSfjm)
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
    this.chargeType = []
    this.formRule.ghjmrate = []
    this.formRule.jsjmrate = []
  }

  // 保存按钮
  private handleSave(){
    this.ghjmError = ''
    this.jsjmError = ''
    this.$nextTick(()=>{

      const formData: any = this.$refs.formData
      formData.validate((valid: any)=>{
        if(valid){
          this.showLoading = true
          this.formData.sfjm = this.chargeType.join(',')
          let params = {
            ...this.formData,
          }
          aSaveFydw(params).then((res: any) => {
            this.showLoading = false
            if(res){
              this.$notify({
                title: '保存成功',
                message: '',
                type: 'success'
              })
              this.getLists()
              this.handleAdd()
            }
          }).catch((err:any)=>{
            this.showLoading = false
          })
        }
      })

    })

  }

  // 删除
  private del(){
    aDeleteFydw({fydw: this.formData.fydw}).then((res: any) => {
      if(res){
        this.$notify({
          title: '删除成功',
          message: '',
          type: 'success'
        })
        this.getLists()
        this.handleAdd()
      }
    })
  }

  // 生成拼音五笔
  private getPywb(value: any){
    pywb(value).then((res: any) => {
      if(res){
        this.formData.pydm = res.data.pinyin
        this.formData.wbdm = res.data.wubi
      }
    })
  }

  // 改变挂号是否减免
  private changeGhjm(value: any){
    if(value==true){
      this.formRule.ghjmrate = [
        {required: true, message: '折扣比例不能为空', trigger: 'blur'}
      ]
    }else{
      this.formRule.ghjmrate = []
    }
  }

  // 改变门诊是否减免
  private changeSfjm(value: boolean){
    if(value==true){
      this.formRule.jsjmrate = [
        {required: true, message: '折扣比例不能为空', trigger: 'blur'}
      ]
    }else{  
      this.formRule.jsjmrate = []
      this.chargeType = []
    }
  }

  // 改变折扣比例
  private ghjmChange(value: any){
    if(value>1){
      this.ghjmError = '折扣比例不能大于1'
      this.formData.ghjmrate = ''
    }else if(value<0){
      this.ghjmError = '折扣比例不能小于0'
      this.formData.ghjmrate = ''
    }else{
      this.ghjmError = ''
    }
  }

  private jsjmChange(value: any){
    if(value>1){
      this.jsjmError = '折扣比例不能大于1'
      this.formData.jsjmrate = ''
    }else if(value<0){
      this.jsjmError = '折扣比例不能小于0'
      this.formData.jsjmrate = ''
    }else{
      this.jsjmError = ''
    }
  }




  //初始化的周期函数
	created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 104
  }
  mounted() {
    this.getLists()
	}
}
</script>

<style lang="scss" scoped>
.form-wrap{
  height: calc(100% - 52px);
}
.el-form {
	// margin: 16px auto 0!important;
	.el-form-item {
    width: 48%;
    &:nth-child(odd) {
      float: left;
    }
    &:nth-child(even) {
      float: right;
    }
    &.province{
      width: 100%;
      .cascade-address{
        width: 100%;
      }
    }
    &.address{
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
    &[hidden]{
      // display: block;
      // visibility: hidden;
    }
  }

  .area-title {
    margin: 0px 0 10px;
    padding: 4px 0 8px;
    border-bottom: 1px solid $border;
    .icon {
      color: $blue;
      vertical-align: middle;
      &.icon1{
        font-size: 12px;
      }
    }
    span {
      margin-left: 4px;
      color: $first;
    }
  }

  .el-checkbox-group{
    // display: flex;
    // flex-wrap: wrap;
    // justify-content: space-between;
    width: 100%;
    .el-checkbox{

      width: 110px;
      margin-right: 0;
    }
  }
}
</style>
