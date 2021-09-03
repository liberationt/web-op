<!--
 * @Date: 2020-05-24 16:18:41
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-21 11:18:54
 * @description:  病历首页 -就诊历史
-->
<template>
    <div class="his-module his-small"
         style="width: 100%; overflow-y: hidden;">
        <pagenation-list ref="pageTable"
                         v-model="tableDatas"
                         data-url="/op-service/opysjzls/findList"
                         http-method="post"
                         :searchData="searchData"
                         :list-height="listSlotHeight">
            <div slot="header"
                 class="row">
                <div class="label">
                    <div class="searchTitle no-warp">就诊流水号</div>
                    <el-input v-model="searchData.jzlsh"
                              placeholder="请输入就诊流水号查询"
                              @keydown.enter.native="getList" />
                </div>
            </div>

            <el-table :data="tableFormat"
                      border
                      stripe
                      :highlight-current-row="true"
                      slot="list"
                      @row-dblclick="turnToIndex"
                      class="scroll-bar"
                      :height="listSlotHeight"
                      tooltip-effect="light"
                      @row-click="getRowData">
                <!-- TODO: 双击弹窗电子病历
        展开行   2020-8-20需求 双击弹窗电子病历
        				<el-table-column type="expand" width="32">
        					<template slot-scope="scope">
        						<div class="formStyle">
        							<el-form
        									:model="formData"
        									ref="formData"
        									label-position="left"
        									inline
        									class="demo-table-expand"
        									label-width="80"
        									style=" width: 100%; padding:8px; border:1px solid rgba(240,240,240,1);"
        							>
        								<el-form-item label="主诉:">
        									<span>{{ formData.zsxx}}</span>
        								</el-form-item>
        								<div class="fixed"></div>
        								<el-form-item label="现病史:">
        									<span>{{ formData.xbs }}</span>
        								</el-form-item>
        								<div class="fixed"></div>
        								<el-form-item label="既往史:">
        									<span>{{ formData.jws }}</span>
        								</el-form-item>
        								<div class="fixed"></div>
        								<el-form-item label=" ">
        									<div class="form-row">
        										<span class="special-text">T：</span>
        										{{formData.t!=0?formData.t: null}} ℃
        										<span class="special-text">P：</span>
        										{{formData.p!=0?formData.p: null}}次/分

        										<span class="special-text">R：</span>
        										{{formData.r!=0?formData.r: null}}次/分

        										<span class="special-text">BP：</span>
        										{{formData.ssy!=0?formData.ssy: null}}
        									</div>
        								</el-form-item>
        								<div class="fixed"></div>
        								<el-form-item label="临床表现:">
                         <span>
                             <el-checkbox label="咳嗽" disabled v-model="formData.ks"></el-checkbox>
                             <el-checkbox label="咽痛" disabled v-model="formData.yt"></el-checkbox>
                             <el-checkbox label="呼吸困难" disabled v-model="formData.hxkn"></el-checkbox>
                             <el-checkbox label="呕吐" disabled v-model="formData.ot"></el-checkbox>
                             <el-checkbox label="腹痛" disabled v-model="formData.ft"></el-checkbox>
                             <el-checkbox label="腹泻" disabled v-model="formData.fx"></el-checkbox>
                             <el-checkbox label="皮疹" disabled v-model="formData.pz"></el-checkbox>
                             <el-checkbox label="其他" disabled v-model="formData.qtlcbx"></el-checkbox>
                         </span>
        								</el-form-item>
        								<div class="fixed"></div>
        								<el-form-item label="体格检查:">
        									<span>{{ formData.tgjc }}</span>
        								</el-form-item>
        								<div class="fixed"></div>
        								<el-form-item label="实验室和器材检查:">
        									<span>{{ formData.zsxx }}</span>
        								</el-form-item>
        								<div class="fixed"></div>
        								<el-form-item label="初步诊断:">
        									<span>{{ formData.cbzd }}</span>
        								</el-form-item>
        								<div class="fixed"></div>
        								<el-form-item label="处理措施:">
        									<span>{{ formData.clcs }}</span>
        								</el-form-item>
        							</el-form>
        						</div>
        					</template>
        				</el-table-column> -->
                <!-- 序号 -->
                <el-table-column prop="webSortNumber"
                                 width="32"></el-table-column>
                <!-- 就诊机构 -->
                <el-table-column prop="jgidName"
                                 :label="$t('patients.jzjg')"
                                 min-width="118"
                                 show-overflow-tooltip></el-table-column>
                <!-- 门诊号码 -->
                <el-table-column prop="jzlsh"
                                 :label="$t('就诊流水号')"
                                 min-width="120" />
                <!-- 就诊科室 -->
                <el-table-column prop="ksdmName"
                                 :label="$t('patients.jzks')"
                                 min-width="90"
                                 show-overflow-tooltip />
                <!-- 就诊医生 -->
                <el-table-column prop="ysdmName"
                                 :label="$t('patients.jzys')"
                                 min-width="90" />
                <!-- 主诊断 -->
                <el-table-column prop="zyzd"
                                 :label="$t('patients.zzd')"
                                 min-width="160"
                                 show-overflow-tooltip />
                <!-- 开始时间 -->
                <el-table-column prop="kssj"
                                 label="开始时间"
                                 min-width="146" />
                <!-- 结束时间 -->
                <el-table-column prop="jssj"
                                 label="结束时间"
                                 min-width="146" />
                <!-- 操作 2020-8-20需求 双击弹窗电子病历  不需要复制病历的操作 -->
                <!--				<el-table-column prop="mzhm" :label="$t('common.action')" align="center" min-width="48">-->
                <!--					<template slot-scope="scope">-->
                <!--						<el-button slot="reference" @click="turnToIndex(scope.row)">-->
                <!--							<i class="icon his-caozuo-fuzhibingli"></i>-->
                <!--							&lt;!&ndash; 病历复制 &ndash;&gt;-->
                <!--						</el-button>-->
                <!--					</template>-->
                <!--				</el-table-column>-->
            </el-table>
        </pagenation-list>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { queryPatientFile } from '@/api/cis/op/dctwork/patients.ts'
import { id2Name } from '@/utils'
import { IBlxxForm } from '@/api/cis/op/dctwork/patients'
//命名文件名称，过滤器什么的都再这里写

export const NForm: IBlxxForm = {
  bmi: 0,
  bqgz: '',
  brid: 2012123060,
  dpy: '',
  ft: false,
  fx: false,
  fzjc: '',
  h: 0,
  hxkn: false,
  jkcfs: [
    {
      diagnoseid: '',
      diagnosename: '',
      empiid: '',
      examineunit: '',
      guideUserText: '',
      guideWayText: '',
      guidedate: '',
      guideuser: '',
      guideway: '',
      healthteach: '',
      icd10: '',
      id: '',
      inputUnitText: '',
      inputUserText: '',
      inputdate: '',
      inputunit: '',
      inputuser: '',
      lastModifyUnitText: '',
      lastModifyUserText: '',
      lastmodifydate: '',
      lastmodifyunit: '',
      lastmodifyuser: '',
      phrid: '',
      recipename: '',
      recordid: '',
      wayid: '',
    },
  ],
  jws: '',
  jzxh: 0,
  ks: false,
  leftcorrectedvision: 0,
  leftvision: 0,
  mxb: '',
  ot: false,
  p: 0,
  pageNum: 0,
  pageSize: 0,
  pz: false,
  qtlcbx: '',
  r: 0,
  rightcorrectedvision: 0,
  rightvision: 0,
  rsbz: 0,
  ssy: 0,
  szy: 0,
  t: 0,
  tgjc: '',
  w: 0,
  xbs: '',
  yt: false,
  zsxx: '',
}
@Component({
  name: 'MorePatients',
})
export default class extends Vue {
  // @Prop({ required: true }) private value!: any
  @Prop({ required: true }) private historyData!: any
  @Prop({ required: true }) private pnParam!: any

  // set searchData(value: any) {
  //   this.$emit('input', value)
  // }

  // get searchData() {
  //   return this.value
  // }
  private searchData: any = {
    jzlsh: '',
    pageNum: 1,
    pageSize: 10,
    brbh: this.pnParam.brid,
  }
  private checkList: Array<any> = []
  private tableDatas: any[] = []
  private institutions: Array<any> = [] //就诊机构
  private department: Array<any> = [] //科室
  private doctorList: Array<any> = [] //医生
  private formData: object = {} //表单数据
  private sexList:Array<any> = [] // 性别
  private brxzList:Array<any> = [] // 收费类型
  get tableFormat() {
    console.log('this.pnParam',this.pnParam);

    const tabledata = this.tableDatas

    id2Name(tabledata, 'brxz', 'brxzName', this.brxzList, 'dv', 'dn') // 病人性质
    id2Name(tabledata, 'brxb', 'brxbName', this.sexList, 'dv', 'dn') // 病人性别
    id2Name(tabledata, 'ysdm', 'ysdmName', this.doctorList, 'dv', 'dn') //医生
    id2Name(tabledata, 'ksdm', 'ksdmName', this.department, 'dv', 'dn') //科室
    id2Name(tabledata, 'jgid', 'jgidName', this.institutions, 'dv', 'dn') //机构
    return tabledata
  }

  // private expands: any[] = []
  private listSlotHeight: number = 0

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 221
  }

  mounted() {
    // this.value.brbh = this.historyData.brid
    this.getList()
    this.brxzList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_PATIENT_DICT : this.$store.state.webSqlDict.TABLE_PATIENT_DICT
	  this.sexList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT
    this.doctorList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT //医生
    this.institutions = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.HOSPITAL_DICT : this.$store.state.webSqlDict.HOSPITAL_DICT //机构
    this.department = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.OUTPATIENT_DEPARTMENT : this.$store.state.webSqlDict.OUTPATIENT_DEPARTMENT //科室
  }

  private getList() {
    // if (this.searchData.ghxh.length > 5) {
    //   this.$notify.warning('请输入正确的门诊号码')
    //   return
    // }
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // private getRowKeys(row: any) {
  //   return row.jzxh
  //   // console.log(row.jzxh)
  // }

  // private getRow(row: any, column: any, event: any) {
  //   // console.log(row, column, event)
  //   if (this.expands.includes(row.id)) {
  //     this.expands = this.expands.filter((val) => val !== row.id)
  //   } else {
  //     this.expands.push(row.id)
  //   }
  // }

  private getRowData(val: any) {
    console.log(val)
  }

  //病历复制  TODO： 双击弹窗电子病历
  private turnToIndex(value: any) {
    value.csny = value.csny.substring(0,10)
    this.$set(value,"morePatient",2) // 用于区分是从左侧带入的患者还是更多患者列表中带出
    this.$set(value,'brid',value.brbh)
    this.$emit('openTab', 'home')
    this.$emit('formMsg', value)
    console.log(value)
  }



  //搜索参数
  private openSoreData: any = {
    brid: 0,
    clinicId: 0,
    ghxh: 0,
    jzhm: 0,
    types: '5',
  }

  //展开行
  // private openSore(row: any, expandedRows: any) {
  //   console.log('row', row, 'expandedRows', expandedRows)
  //   this.openSoreData = {
  //     brid: row.brbh,
  //     ghxh: row.ghxh,
  //     clinicId: row.jzxh,
  //     jzhm: row.jzxh,
  //     types: 1,
  //   }
  //   queryPatientFile(this.openSoreData).then((res: any) => {
  //     if (res.data.bcjl == null) {
  //       this.formData = NForm
  //     } else {
  //       this.formData = res.data.bcjl
  //     }
  //   })
  // }
}
</script>
<style lang="scss" scoped>
/* .content .his-small ::v-deep .el-table--border th {
  text-align: center;
} */
.content .his-module ::v-deep .pagenation-list .page-footer {
  margin-bottom: 8px;
}

.content .his-small {
  padding: 8px 10px 0px 10px;
}

.content .his-module ::v-deep .el-form {
  margin: 0px auto;

  .el-form-item {
    height: 30px;
    line-height: 30px;
    width: 100%;
    display: flex;
    margin-bottom: 0px;

    .el-form-item__label {
      width: 120px;
    }
  }
}
::v-deep .el-checkbox__label {
  padding-left: 4px !important;
}

::v-deep .el-checkbox {
  margin-right: 10px !important;
}
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.formStyle {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.fixed {
  width: 100%;
  height: 2px;
  border: 1px solid rgba(240, 240, 240, 1);
}

.form-row {
  display: flex;
  flex-flow: row nowrap;
  margin-bottom: 6px;
  margin-top: 6px;

  .special-text {
    width: 18px;
    margin: 0 10px;
    color: blue;
  }

  .special {
    width: 80px;
    line-height: 30px !important;
    height: 30px !important;
    margin-right: 20px;
  }
}
</style>
