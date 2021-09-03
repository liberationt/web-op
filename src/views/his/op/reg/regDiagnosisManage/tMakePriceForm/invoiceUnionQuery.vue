<template>
  <div class="content">
    <div class="his-module his-small upper">
      <div class="row">
        <div class="label">
          <div class="title">发票联合查询</div>
          <el-divider direction="vertical"></el-divider>
          <div class="btn">

            <el-button size="mini" type="text" @click="searchLists">
              <i class="icon his-caozuo-Details blue"></i>
              <span>查询</span>
            </el-button>

            <el-button size="mini" type="text" @click="reset">
              <i class="icon his-btn-reset green"></i>
              <span>重置</span>
            </el-button>

            <el-button size="mini" type="text">
              <i class="icon his-btn-print blue"></i>
              <span>门诊清单</span>
            </el-button>

            <el-button size="mini" type="text">
              <i class="icon his-caozuo-Details blue"></i>
              <span>单据查询</span>
            </el-button>

            <el-button size="mini" type="text">
              <i class="icon his-btn-print blue"></i>
              <span>发票补打</span>
            </el-button>

            <el-button size="mini" type="text">
              <i class="icon his-btn-print blue"></i>
              <span>自助机发票重打</span>
            </el-button>

            <el-button size="mini" type="text">
              <i class="icon his-btn-print blue"></i>
              <span>真实发票重打</span>
            </el-button>

            <el-button size="mini" type="text">
              <i class="icon his-btn-print blue"></i>
              <span>门诊账单打印</span>
            </el-button>

          </div>
        </div>
      </div>
      <div class="">
        <el-form :model="formData" label-width="60px" class="form3 clearfix" ref="form">

          <!-- 发票号码 -->
          <div class="form-area item-fphm">
            <el-form-item :label="'发票号码'" prop="beginFphm">
              <el-input
                v-model="formData.beginFphm"
                :placeholder="'请输入起始号码'"
              ></el-input>
            </el-form-item>
            <span>-</span>
            <el-form-item :label="''" label-width="0" prop="endFphm">
              <el-input
                v-model="formData.endFphm"
                :placeholder="'请输入终止号码'"
              ></el-input>
            </el-form-item>
          </div>

          <!-- 收费日期 -->
          <div class="form-area">
            <el-form-item :label="'收费日期'" prop="date">
              <el-date-picker
                type="daterange"
                v-model="date"
                value-format="yyyy-MM-dd"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                class="date-wrapper"
              ></el-date-picker>
            </el-form-item>
          </div>

          <!-- 中心号码 -->
          <div class="form-area">
            <el-form-item :label="'中心号码'" prop="brxm">
              <el-input
                v-model="formData.brxm"
                :placeholder="'请输入中心号码'"
              ></el-input>
            </el-form-item>
          </div>

          <!-- 患者性质 -->
          <div class="form-area">
            <el-form-item :label="'患者性质'" prop="brxz">
              <search-select
                table-name="SYS_DICT_CONFIG"
                kid="14"
                v-model="formData.brxz"
                :backfillValue="formData.brxz"
                :placeholder="'请选择患者性质'"
              />
            </el-form-item>
          </div>

          <!-- 病人姓名 -->
          <div class="form-area">
            <el-form-item :label="'病人姓名'" prop="brxm">
              <el-input
                v-model="formData.brxm"
                :placeholder="'请输入病人姓名'"
              ></el-input>
            </el-form-item>
          </div>


          <!-- 卡号 -->
          <div class="form-area">
            <el-form-item :label="'卡号'" prop="jzkh">
              <el-input
                v-model="formData.jzkh"
                :placeholder="'请输入卡号'"
              ></el-input>
            </el-form-item>
          </div>

          <!-- 收款员 -->
          <div class="form-area">
            <el-form-item :label="'收款员'" prop="czgh">
              <search-select
                table-name="SYS_DICT_CONFIG"
                kid="12"
                v-model="formData.czgh"
                :backfillValue="formData.czgh"
                :placeholder="'请选择收款员'"
              />
            </el-form-item>
          </div>

          <!-- 收费项目 -->
          <div class="form-area">
            <el-form-item :label="'收费项目'" prop="czgh">
              <search-select
                table-name="SYS_DICT_CONFIG"
                kid="12"
                v-model="formData.czgh"
                :backfillValue="formData.czgh"
                :placeholder="'请选择收费项目'"
              />
            </el-form-item>
          </div>

          <!-- 医保线路 -->
          <div class="form-area">
            <el-form-item :label="'医保线路'" prop="czgh">
              <search-select
                table-name="SYS_DICT_CONFIG"
                kid="12"
                v-model="formData.czgh"
                :backfillValue="formData.czgh"
                :placeholder="'请选择医保线路'"
              />
            </el-form-item>
          </div>

        </el-form>
      </div>
    </div>
    <div class="his-module his-small lower">
      <!-- <div class="row">
        <div class="label">
          <div class="searchTitle">卡内信息</div>
          <el-input
            class="search"
            :placeholder="'请输入拼音码查询'"
          >
            <i slot="prefix" class="el-input__icon icon his-search"></i>
          </el-input>
        </div>
      </div> -->
      <pagenation-list
        ref="pageTable"
        v-model="tableData"
        data-url="/op-service/opmzxx/doQueryReceivablesInvoice"
        :search-data="formData"
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
          :height="listSlotHeight"
          class="scroll-bar"
          tooltip-effect="light"
        >
          <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>

          <!-- 门诊号码 -->
          <el-table-column prop="mzhm" :label="'档案号码'"></el-table-column>

          <!-- 发票号码 -->
          <el-table-column prop="fphm" :label="'发票号码'"></el-table-column>

          <!-- 真实发票号码 -->
          <el-table-column prop="zsfphm" :label="'真实发票号码'" min-width="100"></el-table-column>

          <!-- 卡号 -->
          <el-table-column prop="jzkh" :label="'卡号'"></el-table-column>

          <!-- 病人id -->
          <el-table-column prop="brid" :label="'患者ID'" width="90"></el-table-column>

          <!-- 病人姓名 -->
          <el-table-column prop="brxm" :label="'患者姓名'"></el-table-column>

          <!-- 患者性质 -->
          <el-table-column prop="brxz" :label="'患者性质'">
            <template slot-scope="scope">
              <div v-if="brxzList.find(item => item.dv==scope.row.brxz)">
                {{brxzList.find(item => item.dv==scope.row.brxz).dn}}
              </div>
              <div v-else>{{scope.row.brxz}}</div>
            </template>
          </el-table-column>

          <!-- 收费员 -->
          <el-table-column prop="ysfy" :label="'收费员'">
            <template slot-scope="scope">
              <div v-if="usersList.find(item => item.dv==scope.row.ysfy)">
                {{usersList.find(item => item.dv==scope.row.ysfy).dn}}
              </div>
              <div v-else>{{scope.row.ysfy}}</div>
            </template>
          </el-table-column>

          <!-- 收费日期 -->
          <el-table-column prop="sfrq" :label="'收费日期'" min-width="140"></el-table-column>

          <!-- 总金额 -->
          <el-table-column prop="zjje" :label="'总金额'" class-name="text-blue-td"></el-table-column>

          <!-- 金额 -->
          <el-table-column prop="zfje" :label="'金额'" class-name="text-blue-td"></el-table-column>

          <!-- 标识 -->
          <el-table-column prop="ksdm" :label="'标识'">
            <template slot-scope="scope">
              <div v-if="deptList.find(item => item.dv==scope.row.ksdm)">
                {{deptList.find(item => item.dv==scope.row.ksdm).dn}}
              </div>
              <div v-else>{{scope.row.ksdm}}</div>
            </template>
          </el-table-column>

          <!-- 作废日期 -->
          <el-table-column prop="zfrq" :label="'作废日期'" min-width="140"></el-table-column>

          <!-- 结账日期 -->
          <el-table-column prop="jzrq" :label="'结账日期'" min-width="140"></el-table-column>

          <!-- 汇总日期 -->
          <el-table-column prop="hzrq" :label="'汇总日期'" min-width="140"></el-table-column>

          <!-- 现金支付 -->
          <el-table-column prop="xjje" :label="'现金支付'" class-name="text-blue-td"></el-table-column>

          <!-- 账户支付 -->
          <el-table-column prop="zhje" :label="'账户支付'" class-name="text-blue-td"></el-table-column>

          <!-- 其他支付 -->
          <el-table-column prop="qtys" :label="'其他支付'" class-name="text-blue-td"></el-table-column>

          <!-- 中心号码 -->
          <el-table-column prop="hjje" :label="'中心号码'"></el-table-column>

          <!-- 收费项目 -->
          <el-table-column prop="hjje" :label="'收费项目'"></el-table-column>

          <!-- 收费方式 -->
          <el-table-column prop="sffs" :label="'收费方式'"></el-table-column>


          <!-- 门诊类别 -->
          <el-table-column prop="mzlb" :label="'门诊类别'">
            <template slot-scope="scope">
              <div v-if="opTypeList.find(item => item.dv==scope.row.mzlb)">
                {{opTypeList.find(item => item.dv==scope.row.mzlb).dn}}
              </div>
              <div v-else>{{scope.row.mzlb}}</div>
            </template>
          </el-table-column>

          <!-- 合并标识 -->
          <el-table-column prop="hbbz" :label="'合并标识'"></el-table-column>

        </el-table>
      </pagenation-list>
    </div>
	</div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { getNow } from '@/api/his/basic'
import { parseTime } from '@/utils'

declare interface IObj {
  [key: string]: string
}

@Component({
  name: ''
})

export default class extends Vue {
	private obj: IObj = {
    name: '',
    value: '',
  }
  private formData: any = {
    beginFphm: '',
    endFphm: '',
    beginSfrq: '',
    endSfrq: '',
    brxz: '',
    brxm: '',
    jzkh: '',
    czgh: '', // 收款员
  }
  private date: any[] = []
  private tableData: any[] = []
  private searchData: any = {}
  private deptList: any[] = this.$store.state.webSqlDict.REGISTERATION_DEPARTMENT_DICT // 挂号科室
  private docList: any[] = this.$store.state.webSqlDict.TABLE_DOCTOR_DICT // 医生
  private usersList: any[] = this.$store.state.webSqlDict.USERS_DICT // 用户列表
  private opTypeList: any[] = this.$store.state.webSqlDict.OUTPATIENT_TYPE // 门诊类别
  private brxzList: any[] = this.$store.state.webSqlDict.TABLE_PATIENT_DICT // 病人性质
  private statusList: any[] = [
    {dv: 0, dn: '正常挂号'},
    {dv: 1, dn: '退号'},
    {dv: 2, dn: '废号'},
  ]

  get listSlotHeight(){
    return Vue.prototype.PageHeight - 198
  }

  // 获取当前时间
  private getTime(){
    getNow().then((res: any) => {
      if(res){
        let date = parseTime(res.data, '{y}-{m}-{d}')
        this.date = [date, date]
      }
    })
  }

	// 获取列表
  private getLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.getList()
  }

  // 条件查询
  private searchLists() {
    this.formData.beginSfrq = this.date[0]
    this.formData.endSfrq = this.date[1]
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }

  // 获取详情
  private getDetail() {

  }

  private reset(){
    const form: any = this.$refs.form
    form.resetFields()
    this.getTime()
  }




  //初始化的周期函数
	created() {
    this.getTime()
  }
  mounted() {
	}
}
</script>

<style lang="scss" scoped>
.content{
  display: flex;
  flex-direction: column;
}
.upper{
  height: auto;
}
.lower{
  flex-grow: 1;
  margin-top: 10px;
}
.table-wrap{
  table{
    td{
      &:nth-child(odd){
        width: 18%;
      }
      &:nth-child(even){
        // width: calc(100%/3*60%);
      }
    }
  }
}
.normal-form-wrap{
  .el-form{
    width: 30%;
    margin: 40px auto 0;
  }
}

//三列表单
.form3{
	margin: 0!important;
	.el-form-item{

    .search-select{
      width: 100%;
    }
  }
  .form-area{
    float: left;
    width: calc((100% - 16px*2)/3);
    margin-right: 16px;
    margin-bottom: 8px!important;
    // border: 1px solid #f00;
    &:nth-child(3n){
			margin-right: 0;
    }
    &:nth-last-child(-n+3){
      margin-bottom: 0!important;
    }
    &.item-fphm{
      .el-form-item{
        display: inline-block;
        &:nth-child(1){
          width: calc((100% - 60px - 10px)/2 + 60px);
        }
        &:nth-child(3){
          width: calc((100% - 60px - 10px)/2);
        }
      }
      span{
        display: inline-block;
        width: 10px;
        text-align: center;
      }
    }
    .el-form-item{
      margin-bottom: 0;
    }
  }
}

.btns{
  margin-top: 30px;
  text-align: center;
  .el-button{
    display: inline-block;
    width: calc((100% - 20px)/3);
    text-align: center;
  }
  .el-button--default{
    color: $second;
  }
}
</style>
