<template>
  <div class="content">
		<el-row class="ht" :gutter="10">
      <el-col class="ht" :span="24">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <div class="title">患者档案</div>
              <el-divider direction="vertical"></el-divider>
              <div class="searchTitle">搜索</div>
              <el-input
                v-model="searchData.jzkh"
                :placeholder="'卡号、姓名、身份证'"
                @keyup.enter.native="searchLists"
                class="search"
              >
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input>
              <el-divider direction="vertical"></el-divider>
              <!-- {{curRow}} -->
              <div class="btn">
                <el-button
                  type="text"
                  size="mini"
                >
                  <i class="icon his-reading-card blue"></i>
                  <span>读卡</span>
                </el-button>
              </div>
              <!-- <div class="action" @click="handleAdd">
                <i class="icon his-caozuo-jiandang blue"></i>
                <span>新建</span>
              </div> -->
              <!-- <div class="action" @click="handleEdit">
                <i class="icon his-btn-edit green"></i>
                <span>修改</span>
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
            ref="pageTable"
            v-model="tableData"
            data-url="/op-service/opghksManage/doQueryList"
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

							<!-- 门诊号码 -->
							<el-table-column
								:label="'档案号码'"
								prop="mzhm"
                min-width="100"
							></el-table-column>

							<!-- 病人姓名 -->
							<el-table-column
								:label="'姓名'"
								prop="brxm"
							></el-table-column>

							<!-- 病人性质 -->
							<el-table-column
								:label="'患者性质'"
                min-width="80"
                show-overflow-tooltip
							>
                <template slot-scope="scope">
                  <span v-if="brxzList.find(item => item.dv==scope.row.brxz)">
                    {{brxzList.find(item => item.dv==scope.row.brxz).dn}}
                  </span>
                  <span v-else>{{scope.row.brxz}}</span>
                </template>
              </el-table-column>

							<!-- 病人性别 -->
							<el-table-column
								:label="'性别'"
                min-width="60"
							>
                <template slot-scope="scope">
                  <span v-if="genderList.find(item => item.dv==scope.row.brxb)">
                    {{genderList.find(item => item.dv==scope.row.brxb).dn}}
                  </span>
                </template>
              </el-table-column>

							<!-- 出生年月 -->
							<el-table-column
								:label="'出生年月'"
								prop="csny"
                min-width="100"
							>
                <template slot-scope="scope">
                  <span v-if="scope.row.csny">
                    {{scope.row.csny.substr(0,10)}}
                  </span>
                </template>
              </el-table-column>

							<!-- 身份证号 -->
							<el-table-column
								:label="'身份证号'"
								prop="sfzh"
                min-width="150"
							></el-table-column>

							<!-- 联系地址 -->
							<el-table-column
								:label="'联系地址'"
								prop="xzzQtdz"
                min-width="180"
                show-overflow-tooltip
							></el-table-column>

							<!-- 建档机构 -->
							<el-table-column
								:label="'建档机构'"
								prop="jdjg"
                min-width="110"
                show-overflow-tooltip
							>
                <template slot-scope="scope">
                  <span v-if="institutionList.find(item => item.dv==scope.row.jdjg)">
                    {{institutionList.find(item => item.dv==scope.row.jdjg).dn}}
                  </span>
                </template>
              </el-table-column>

							<!-- 建档时间 -->
							<el-table-column
								:label="'建档时间'"
								prop="jdsj"
                min-width="140"
							></el-table-column>

							<!-- 建档人 -->
							<el-table-column
								:label="'建档人'"
							>
                <template slot-scope="scope">
                  <span v-if="usersList.find(item => item.dv==scope.row.jdr)">
                    {{usersList.find(item => item.dv==scope.row.jdr).dn}}
                  </span>
                  <span v-else>{{scope.row.jdr}}</span>
                </template>
              </el-table-column>

							<!-- 修改时间 -->
							<el-table-column
								:label="'修改时间'"
								prop="xgsj"
                min-width="140"
							></el-table-column>

              <el-table-column :label="$t('common.action')" width="56" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-tooltip
                    :content="$t('common.modify')"
                    effect="light"
                  >
                    <el-button class="blue" @click="handleEdit(scope.row.cardno)">
                      <i class="icon his-edit"></i>
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col class="ht" :span="0">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <h1 class="title">{{rightTitle}}</h1>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                class="green-gra"
                icon="icon his-save"
              >{{$t('common.save')}}</el-button>
            </div>
          </div>
          <div class="form-wrap scroll-bar">
            <el-form
							ref="formData"
              :model="formData"
              :rules="formRule"
              label-width="70px"
              class="clearfix"
						>
							<!-- 科室名称 -->
							<el-form-item :label="'科室名称'">
                <el-input
                  :placeholder="'请输入'"
                  v-model="formData.ksmc"
                ></el-input>
              </el-form-item>

							<!-- 门诊科室 -->
							<el-form-item :label="'门诊科室'">
                <el-select v-model="formData.mzks">
									<el-option value="1">门诊科室1</el-option>
									<el-option value="2">门诊科室2</el-option>
								</el-select>
              </el-form-item>

							<!-- 普通门诊 -->
							<el-form-item :label="'普通门诊'">
                <el-select v-model="formData.ptmz">
									<el-option value="1">是</el-option>
									<el-option value="2">否</el-option>
								</el-select>
              </el-form-item>

							<!-- 专家门诊 -->
							<el-form-item :label="'专家门诊'">
                <el-select v-model="formData.zjmz">
									<el-option value="1">是</el-option>
									<el-option value="2">否</el-option>
								</el-select>
              </el-form-item>

							<!-- 专科门诊 -->
							<el-form-item :label="'专科门诊'">
                <el-select v-model="formData.zkmz">
									<el-option value="1">是</el-option>
									<el-option value="2">否</el-option>
								</el-select>
              </el-form-item>

							<!-- 特需门诊 -->
							<el-form-item :label="'特需门诊'">
                <el-select v-model="formData.txmz">
									<el-option value="1">是</el-option>
									<el-option value="2">否</el-option>
								</el-select>
              </el-form-item>

							<!-- 拼音码 -->
							<el-form-item :label="'拼音码'">
                <el-input
                  :placeholder="'请输入'"
                  v-model="formData.pydm"
                ></el-input>
              </el-form-item>

							<!-- 五笔码 -->
							<el-form-item :label="'五笔码'">
                <el-input
                  :placeholder="'请输入'"
                  v-model="formData.wbdm"
                ></el-input>
              </el-form-item>

							<!-- 数字码 -->
							<el-form-item :label="'数字码'">
                <el-input
                  :placeholder="'请输入'"
                  v-model="formData.szdm"
                ></el-input>
              </el-form-item>

							<!-- 角形码 -->
							<el-form-item :label="'角形码'">
                <el-input
                  :placeholder="'请输入'"
                  v-model="formData.jxdm"
                ></el-input>
              </el-form-item>

							<!-- 挂号费 -->
							<el-form-item :label="'挂号费'">
                <el-input
                  :placeholder="'请输入'"
                  v-model="formData.ghf"
                ></el-input>
              </el-form-item>

							<!-- 诊疗费 -->
							<el-form-item :label="'诊疗费'">
                <el-input
                  :placeholder="'请输入'"
                  v-model="formData.zlf"
                ></el-input>
              </el-form-item>

							<!-- 门诊类别 -->
							<el-form-item :label="'门诊类别'">
                <el-select v-model="formData.mzlb">
									<el-option value="1">是</el-option>
									<el-option value="2">否</el-option>
								</el-select>
              </el-form-item>

							<!-- 地点信息 -->
							<el-form-item :label="'地点信息'">
                <el-input
                  :placeholder="'请输入'"
                  v-model="formData.ddxx"
                ></el-input>
              </el-form-item>

							<!-- 科室分机号 -->
							<el-form-item :label="'科室分机号'">
                <el-input
                  :placeholder="'请输入'"
                  v-model="formData.ksfjh"
                ></el-input>
              </el-form-item>

							<!-- 启用叫号 -->
							<el-form-item :label="'启用叫号'">
                <el-select v-model="formData.sfqy">
									<el-option value="1">是</el-option>
									<el-option value="2">否</el-option>
								</el-select>
              </el-form-item>

							<!-- 录入疾控报卡 -->
							<el-form-item :label="'录入疾控报卡'">
                <el-select v-model="formData.lrjkbk">
									<el-option value="1">是</el-option>
									<el-option value="2">否</el-option>
								</el-select>
              </el-form-item>
						</el-form>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 新建病人档案 -->
		<add-patient :patientInfo="curRow" ref="add-patient"/>
	</div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import addPatient from '@/components/addPatient/index.vue'
import { rightScroll } from '@/utils/index.ts'

//声明接口
declare interface pageList {
  id: number
}

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: '',
  filters: {},
  components: {
    addPatient
  }
})
export default class extends Vue {
  //声明变量，方法
	private tableData: any[] = [] // 表格数据
	private searchData: any = { // 搜索参数
    jzkh: ''
  }
	private listSlotHeight: number = 0
	private loading: boolean = false
	private rightTitle: string = window.ele.$i18n.t('common.add')
	private formData: any = {} // 表单数据
  private formRule: any = {} // 表单验证
  private curRow: any = {} // 当前行数据
  private brxzList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_PATIENT_DICT : this.$store.state.webSqlDict.TABLE_PATIENT_DICT
  private genderList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT
  private institutionList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SUPER_ORGAN_DICT : this.$store.state.webSqlDict.SUPER_ORGAN_DICT // 医疗机构（可能不对）
  private usersList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.USERS_DICT : this.$store.state.webSqlDict.USERS_DICT // 用户列表

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
    rightScroll()
	}

	// 获取列表
  private getLists() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

	// 获取详情
	private getDetail(row: any){
    console.log(row)
    this.curRow = row
  }



  // 条件查询
  searchLists() {
    if(this.searchData.jzkh != ''){
      const pageTable: any = this.$refs['pageTable']
      pageTable.searchList()
    }
  }

  // 打开新增弹窗
	private handleAdd(){
    // this.curRow = {}
    var a: any = this.$refs['add-patient']
    a.addDialog()
  }

  // 打开修改弹窗
  private handleEdit(cardno: string){
    setTimeout(() => {
      var a: any = this.$refs['add-patient']
		  a.addDialog(cardno)
    }, 0)
  }




  //初始化的周期函数
	created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 106
  }
  mounted() {
    // this.getLists()
  }
}
</script>

<style lang="scss" scoped>
.label .search{
  margin-right: 2px!important;
  ::v-deep .el-input__inner{
    width: 200px!important;
  }
}
.card-search{
  width: auto;
  margin-right: 10px;
}

</style>
