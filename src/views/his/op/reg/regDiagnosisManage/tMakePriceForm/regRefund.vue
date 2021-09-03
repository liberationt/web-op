// 退费处理
<template>
  <div class="content">
    <div class="left area">
      <div class="his-module his-small">
        <!-- <div class="row header1">
          <div class="label">
            <div class="searchTitle">收费日期</div>
            <el-date-picker
              type="daterange"
              v-model="date"
              value-format="yyyy-MM-dd"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              class="date-wrapper"
              @change="changeDate"
            ></el-date-picker>
          </div>
        </div> -->
        <div class="row header2">
          <div class="label">
            <div class="searchTitle">发票号码</div>
            <!-- <el-radio-group class="small-radio-group">
              <el-radio label="1">发票</el-radio>
              <el-radio label="2">卡号</el-radio>
            </el-radio-group> -->
            <el-input v-model="searchData1.fphm" :placeholder="'请输入发票号码'" @change="searchTable1" @focus="focus1" ref="inputSearchFphm"></el-input>
          </div>
        </div>

        <pagenation-list v-model="tableData1" data-url="/op-service/opmzxx/doQueryMzxxFpxx" :search-data="searchData1" http-method="post" :list-height="listSlotHeight1" :pageProps="{ layout: 'total, prev, pager, next' }" @reqComplete="addKeyBoard1" ref="pageTable1">
          <el-table slot="list" stripe :highlight-current-row="true" :data="tableData1" @row-click="getDetail1" :row-class-name="tableRowClassName" :height="listSlotHeight1" class="scroll-bar" border ref="table1">
            <el-table-column prop="webSortNumber" align="center" width="32"></el-table-column>

            <!-- 患者姓名 -->
            <el-table-column prop="brxm" :label="'患者姓名'"></el-table-column>

            <!-- 卡号 -->
            <!-- <el-table-column
              prop="jzkh"
              :label="'卡号'"
            ></el-table-column> -->

            <!-- 发票号码 -->
            <el-table-column prop="fphm" :label="'发票号码'"></el-table-column>

            <!-- 收费日期 -->
            <el-table-column :label="'收费日期'">
              <template slot-scope="scope">
                {{ scope.row.sfrq.substr(0, 10) }}
              </template>
            </el-table-column>
          </el-table>
        </pagenation-list>
      </div>
    </div>
    <div class="right">
      <div class="upper area">
        <div class="his-module his-small">
          <div class="row header3">
            <div class="label">
              <div class="btn">
                <el-button type="text" size="mini" @click="openTf" :disabled="selectionData.length ? false : true">
                  <i class="icon his-caozuo-return-premium red"></i>
                  <span>退费</span>
                </el-button>
                <el-button type="text" size="mini" @click="openTh">
                  <i class="icon his-return red"></i>
                  <span>退号</span>
                </el-button>
              </div>
            </div>
          </div>
          <el-form ref="formData" :model="formData" :rules="formRule" label-width="60px" class="form4 clearfix">
            <div class="form-area">
              <!-- 退费发票 -->
              <el-form-item :label="'退费发票'">
                <el-input v-model="formData.tffp" :placeholder="'退费发票'"></el-input>
              </el-form-item>
            </div>

            <div class="form-area">
              <!-- 患者姓名 -->
              <el-form-item :label="'患者姓名'">
                <el-input v-model="formData.brxm" :placeholder="'患者姓名'"></el-input>
              </el-form-item>
            </div>

            <div class="form-area">
              <!-- 退费金额 -->
              <el-form-item :label="'退费金额'">
                <el-input v-model="formData.tfje" :placeholder="'退费金额'" class="text-blue"></el-input>
              </el-form-item>
            </div>

            <div class="form-area">
              <!-- 发票号码 -->
              <el-form-item :label="'发票号码'">
                <el-input v-model="formData.fphm" :placeholder="'发票号码'"></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div class="lower">
        <div class="lower-left area">
          <div class="his-module his-small">
            <el-table slot="list" stripe ref="table2" :highlight-current-row="true" :data="tableData2" :row-class-name="tableRowClassName" @row-click="getDetail2" @select="tableSelect" @selection-change="getSelectionData" border v-loading="loading" class="scroll-bar" tooltip-effect="light" :height="listSlotHeight2">
              <el-table-column type="selection" width="32"></el-table-column>
              <!-- 序号 -->
              <el-table-column type="index" width="32" align="center"></el-table-column>

              <!-- 类型 -->
              <el-table-column :label="'类型'" prop="djlxText" min-width="56"></el-table-column>

              <!-- 备注 -->
              <!-- <el-table-column
                :label="'备注'"
                prop="tag"
                min-width="56"
              ></el-table-column> -->
            </el-table>
          </div>
        </div>
        <div class="lower-right area">
          <div class="his-module his-small">
            <div class="row" style="display: none">
              <div class="label">
                <span class="drug-type">{{ curCflx | filterCflx }}</span>
                <el-divider direction="vertical"></el-divider>
                <span class="searchTitle">医生姓名</span>
                <el-input v-model="formData.ysmc" :placeholder="'医生姓名'" style="width: 140px"></el-input>
                <span class="searchTitle">挂号科室</span>
                <el-input v-model="formData.ksmc" :placeholder="'挂号科室'" style="width: 140px"></el-input>
              </div>
            </div>
            <el-table slot="list" stripe ref="table3" :highlight-current-row="true" :data="tableData3" border v-loading="loading" class="scroll-bar" tooltip-effect="light" :height="listSlotHeight3">
              <!-- 序号 -->
              <el-table-column type="index" width="32" align="center"></el-table-column>

              <!-- 药品名称 -->
              <el-table-column :label="'药品名称'" prop="ypmc" min-width="140" show-overflow-tooltip></el-table-column>

              <!-- 规格 -->
              <el-table-column :label="'规格'" prop="yfgg"></el-table-column>

              <!-- 单位 -->
              <el-table-column :label="'单位'" prop="yfdw"></el-table-column>

              <!-- 单价 -->
              <el-table-column :label="'单价'" class-name="text-blue-td">
                <template slot-scope="scope">{{ useGetFloat(scope.row.ypdj, 4) }}</template>
              </el-table-column>

              <!-- 数量 -->
              <el-table-column :label="'数量'" prop="ypsl" class-name="text-blue-td">
                <!-- @keydown.enter.native="focusNext(scope.$index, 4)" -->
                <template slot-scope="scope">
                  <inputBox v-model="scope.row.ypsl" :required="true" @change="calcZhje(scope.row, scope.$index)" :ref="`${scope.$index}-4`" style="height: 32px" max="10" :disabled="(scope.row.cflx !== 0 && scope.row.fybz === 1) || scope.row.cflx === 0 || handel(scope.row.cfsb)" />
                </template>
              </el-table-column>

              <!-- 金额 -->
              <el-table-column :label="'金额'" class-name="text-blue-td">
                <template slot-scope="scope">{{ useGetFloat(scope.row.hjje, 2) }}</template>
              </el-table-column>

              <!-- 自负比例 -->
              <el-table-column :label="'自负比例'" prop="zfbl" class-name="text-blue-td">
                <template slot-scope="scope">
                  <div>{{ useMul(scope.row.zfbl, 100) + '%' }}</div>
                </template>
              </el-table-column>
              <!-- 折扣比例 -->
              <el-table-column :label="'折扣比例'" prop="zkbl" class-name="text-blue-td"></el-table-column>
              <!-- 折扣金额 -->
              <el-table-column :label="'折扣金额'" prop="zkje" class-name="text-blue-td"></el-table-column>
              <!-- 频次 -->
              <el-table-column :label="'频次'" prop="ypyf"></el-table-column>
              <!-- 发药状态 -->
              <el-table-column :label="'状态'" prop="fyzt">
                <template slot-scope="scope">
                  <!-- <div v-if="scope.row.fyzt==1">已发药</div>
                  <div v-else>未发药</div> -->
                  <div v-if="scope.row.cflx !== 0 && scope.row.fybz === 1">已发药</div>
                  <div v-if="scope.row.cflx !== 0 && scope.row.fybz !== 1">未发药</div>
                  <div v-if="scope.row.cflx === 0 && scope.row.zxcs === 1">已执行</div>
                  <div v-if="scope.row.cflx === 0 && scope.row.zxcs !== 1">未执行</div>
                </template>
              </el-table-column>

              <!-- 挂号科室 -->
              <el-table-column :label="'科室名称'">
                <template slot-scope="scope">
                  <span v-if="deptList.find((item) => item.dv == scope.row.ksdm)">
                    {{ deptList.find((item) => item.dv == scope.row.ksdm).dn }}
                  </span>
                </template>
              </el-table-column>

              <!-- 医生姓名 -->
              <el-table-column :label="'医生姓名'">
                <template slot-scope="scope">
                  <span v-if="docList.find((item) => item.dv == scope.row.ysdm)">
                    {{ docList.find((item) => item.dv == scope.row.ysdm).dn }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <!-- 退费 -->
    <el-dialog :title="'退费结算'" :visible.sync="dialogTf" width="500px" :close-on-click-modal="false" v-elDraggableDialog class="narrow-dialog" @closed="closeDialogTf">
      <div class="his-module his-small">
        <div class="clearfix">
          <el-form :model="formDataTf" label-width="64px" class="form-tf">
            <div class="area-title">
              <i class="icon his-advance-payment"></i>
              <span>退款情况</span>
            </div>

            <div class="item-area">
              <el-form-item :label="'退现金'" disabled>
                <el-input v-model="formDataTf.tfje" class="text-blue" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item :label="'退账户'" disabled>
                <el-input v-model="formDataTf.tzh" class="text-blue" :disabled="true"></el-input>
              </el-form-item>
            </div>

            <div class="area-title">
              <i class="icon his-advance-payment"></i>
              <span>收款情况</span>
            </div>

            <div class="item-area">
              <el-form-item :label="'应收款'" disabled>
                <el-input v-model="formDataTf.ysk" class="text-blue" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item :label="'付款方式'" disabled>
                <el-input v-model="formDataTf.fkmc" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item :label="'货币误差'" disabled>
                <el-input v-model="getHbwc" class="text-blue" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item :label="'退找'" disabled>
                <el-input v-model="formDataTf.tzje" class="text-blue" :disabled="true"></el-input>
              </el-form-item>
            </div>

            <div class="area-title">
              <i class="icon his-advance-payment"></i>
              <span>原发票付款情况</span>
            </div>

            <div class="item-area-1">
              <div>
                {{ formDataTf.fkmc }}：<span>{{ getYsMoney }}</span>
              </div>
              <el-divider direction="vertical"></el-divider>
              <div>
                货币误差：<span>{{ mzxx.hbwc }}</span>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogTf">取消</el-button>
        <el-button type="primary" @click="saveRefund" :loading="loadingBtn">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'医保患者请读卡'"
      :visible.sync="dialogVisible2"
      width="400px"
      top="30vh"
      :close-on-click-modal="false"
      class="narrow-dialog read-card"
      v-elDraggableDialog
      @close="closeDialog2"
    >
      <div>
        <div style="margin:30px 0"><el-checkbox v-model="isEcQrcode" class="ec-qrcode">电子凭证</el-checkbox></div>
        <div class="display" style="height:100px;">
          <el-input
            v-model="ybCarddata"
            @keyup.enter.native="jzkhEnter"
            class="queryInput"
            style="width:280px;"
          ></el-input>
          <el-button
            type="primary"
            class="blue-btn"
            icon="icon his-reading-card"
            @click="readCard('1')"
          >读卡</el-button>
        </div>
      </div>
    </el-dialog>

    <reg-withdrawal ref="reg-withdrawal" />

    <!-- <pre class="p1">{{unSelectionData}}</pre> -->
    <!-- <pre class="p2">{{unSelectionDataDetails}}</pre> -->
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import _ from 'lodash'
import { aQueryMzxxFpxx, aQueryTF01, aQueryTFFphm, aQueryTFPayment, aSaveRefundSettle } from '@/api/his/op/reg/regRefund.ts'
import { getNow, getParams, aReadMedAcc } from '@/api/his/basic/index.ts'
import { parseTime, getFloat, mul, numtochinese } from '@/utils'
import { aQuerySjBrxz } from '@/api/his/op/reg/registerManage.ts'
import { aPrintMoth } from '@/api/his/op/reg/settlement.ts'
import regWithdrawal from '../components/regWithdrawal.vue'
import { getLodop } from '@/plugins/lodop/index.js'

//声明接口
declare interface pageList {
  id: number
}

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: '',
  filters: {
    filterCflx(cflx: number) {
      var cflxText: string = ''
      switch (cflx) {
        case 1: // 西
          cflxText = '西'
          break
        case 2: // 成
          cflxText = '成'
          break
        case 3: // 草
          cflxText = '草'
          break
        case 0: // 检
          cflxText = '检'
          break
      }
      return cflxText
    },
  },
  components: {
    regWithdrawal,
  },
})
export default class extends Vue {
  //声明变量，方法
  private isExpand: boolean = true
  private date: any[] = []
  private tableData1: any[] = [] // 表格数据
  private tableData2: any[] = []
  private tableData3: any[] = []
  private tableData2Details: any[] = [] // table3从中取值
  private searchData1: any = {
    ms_mzxx_ZFPB: 0, // 自负判别
    // isExistBeginDate: '',
    // isExistEndDate: '',
    isExistFphm: '',
    fphm: '',
  }
  private defaultTable: any = []
  private listSlotHeight1: number = 0
  private listSlotHeight2: number = 0
  private listSlotHeight3: number = 0
  private curRowIndex1: number = 0
  private curRowIndex2: number = 0
  private loading: boolean = false
  private formData: any = {
    tffp: '',
    brxm: '',
    tfje: 0,
    fphm: '',
    ysmc: '',
    ksmc: '',
  }
  private formRule: any = {}
  private activeName: string = 'first'
  private curCflx: number | null = null
  private selectionData: any[] = [] // 选中的单据
  private unSelectionData: any[] = [] // 未选中的单据
  private unSelectionDataDetails: any[] = [] // 未选中的单据明细

  private mzxx: any = {
    xjje: '',
    zpje: '',
  } // 病人的门诊信息
  private dialogTf: boolean = false
  private dialogTh: boolean = false
  private formDataTf: any = {
    tfje: '', // 退费金额
    tzh: '', // 退账户
    ysk: '', // 应收款
    fkmc: '', // 付款方式
    jkje: 0, // 交款金额
    tzje: '', // 退找金额
    yskNew: '', // 现应收款
    yskOld: '', // 原应收款
  }
  private tfBody: any = {
    ysk: '',
    zfje: '',
  }
  private tfShowjs: any = {}
  private ysInfor: any = {}
  private isYbFlag: number = 1

  private deptList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.OUTPATIENT_DEPARTMENT : this.$store.state.webSqlDict.OUTPATIENT_DEPARTMENT // 门诊科室
  private docList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
  private loadingBtn: boolean = false

  private isEcQrcode: boolean = false
  private dialogVisible2: boolean = false
  private ybCarddata:any = ''

  public setValue(value: string) {
    this.setValue(value)
  }
  public getValue() {
    return null
  }

  // 货币误差
  get getHbwc() {
    return getFloat((mul(this.formDataTf.tfje, 100) - mul(this.formDataTf.tzje, 100)) / 100, 2)
  }
  get getYsMoney() {
    return getFloat((mul(this.mzxx.xjje, 100) + mul(this.mzxx.zpje, 100)) / 100, 2)
  }
  //监听方法
  @Watch('tableData')
  private onValueChange(value: string) {
    this.loading = false
  }

  //判断是否可以选着
  private handel(row: any) {
    let flag = true
    this.selectionData.map((item: any) => {
      if (item.cfsb == row) {
        flag = false
      }
    })
    return flag
  }
  
  // 保留n位小数
  private useGetFloat(num: any, n: number) {
    return getFloat(num, n)
  }

  // 乘法
  private useMul(a: number, b: number) {
    return mul(a, b)
  }

  // 展开/收起
  private toggle() {
    this.isExpand = !this.isExpand
  }
   // 关闭弹窗
  private closeDialog2(){
    this.isEcQrcode = false
    this.ybCarddata = ''
  }
  private closeDialogTf(){
    this.dialogTf = false
    this.isYbFlag = 1
    this.loadingBtn = false
  }
  // 获取当前时间
  private getNow() {
    getNow().then((res: any) => {
      if (res) {
        var date = parseTime(res.data, '{y}-{m}-{d}')
        this.date = [date, date]
        this.searchData1.isExistBeginDate = this.date[0] + ' 00:00:00'
        this.searchData1.isExistEndDate = this.date[1] + ' 23:59:59'
        this.getTable1()
      }
    })
  }

  // 获取左侧列表
  private getTable1() {
    const pageTable1: any = this.$refs.pageTable1
    pageTable1.getList()
  }

  // 从子组件取数据
  private renderTable1(data: any) {
    this.tableData1 = data
  }

  // 条件查询
  private searchTable1() {
    if (this.searchData1.fphm != '') {
      const pageTable1: any = this.$refs.pageTable1
      pageTable1.searchList()
    }
  }

  // 切换日期
  private changeDate(value: any) {
    this.searchData1.isExistBeginDate = value[0] + ' 00:00:00'
    this.searchData1.isExistEndDate = value[1] + ' 23:59:59'
    this.searchTable1()
  }

  // 获取详情
  private getDetail1(row: any) {
    this.curRowIndex1 = row.index
    addEventListener('keydown', this.keyBoard1)
    removeEventListener('keydown', this.keyBoard2)
    this.tableData3 = []

    aQueryTF01({ fphm: row.fphm }).then((res: any) => {
      if (res) {
        this.tableData2 = res.data
        // 添加索引
        // this.tableData2.forEach((item: any, index: number)=>{
        //   this.$set(item, 'index', index)
        // })
        if (this.tableData2.length) {
          addEventListener('keydown', this.keyBoard2)
          removeEventListener('keydown', this.keyBoard1)
          this.setFirstRow2()
        }
      }
    })
    aQueryTFFphm({ fphm: row.fphm }).then((res: any) => {
      if (res) {
        this.formData.tffp = res.data.mzxx.fphm
        this.formData.brxm = res.data.body.brxm
        this.formData.fphm = res.data.body.fphm
        this.tableData2Details = res.data.details
        this.defaultTable = _.cloneDeep(res.data.details)
        this.mzxx = res.data.mzxx
      }
    })
  }

  // 获取详情
  private getDetail2(row: any) {
    this.curRowIndex2 = row.index
    addEventListener('keydown', this.keyBoard2)
    removeEventListener('keydown', this.keyBoard1)
    this.formData.ysmc = row.ysmc
    this.formData.ksmc = row.ksmc
    this.tableData3 = this.tableData2Details.filter((item: any) => {
      return item.cfsb == row.cfsb
    })
    this.curCflx = this.tableData3[0].cflx
    // defaultTable
  }

  // 获取详情
  private getDetail3(row: any) {
    aQueryTF01({ fphm: row.ms_mzxx_FPHM }).then((res: any) => {
      if (res) {
        this.tableData2 = res.data
      }
    })
  }

  // 获取选中的行，选择项改变时触发
  private getSelectionData(selection: any) {
    this.selectionData = selection
    console.log('获取选中的行=>', 'this.selectionData==>', this.selectionData, 'selectionData==>', selection)
    // 计算退费金额
    this.formData.tfje = 0
    this.selectionData.forEach((i: any) => {
      this.tableData2Details.forEach((j: any) => {
        if (j.cfsb == i.cfsb) {
          this.formData.tfje += j.ypdj * j.ypsl * (j.zkbl ? j.zkbl : 1) * (j.zfbl ? j.zfbl : 1)
          // this.formData.tfje += j.hjje * j.zfbl
          // this.formData.tfje = ( mul(this.formData.tfje, 10000) + mul(mul(mul(j.hjje, j.zfbl), j.zkbl ? j.zkbl : 1), 10000)) / 10000
        }
      })
    })
    this.formData.tfje = getFloat(this.formData.tfje, 2)
  }

  // 点击勾选框时触发
  private tableSelect(selection: any, row: any) {
    console.log(11)
    this.getDetail2(row)
    let selected = selection.length && selection.indexOf(row) > -1 // 判断勾选还是取消勾选
    if (selected) {
      if (row.cflx !== 0 && row.fybz == 1) {
        this.$notify({
          title: '已发药不能退费',
          message: '',
          type: 'error',
        })
        this.$nextTick(() => {
          const table2: any = this.$refs.table2
          table2.toggleRowSelection(row)
        })
      }
      if (row.cflx === 0 && row.fybz == 1) {
        this.$notify({
          title: '已执行医技不能退费',
          message: '',
          type: 'error',
        })
        this.$nextTick(() => {
          const table2: any = this.$refs.table2
          table2.toggleRowSelection(row)
        })
      }
    } else {
      console.log('取消勾选')
    }
    // const table2: any = this.$refs.table2
    // table2.setCurrentRow(row)
  }

  selectAll() {
    console.log('全选')
  }
   // 卡号回车
  private jzkhEnter(){
    if(this.isEcQrcode){
      this.readCard('3')
    }else if(this.ybCarddata.length == 28){
      this.readCard('0')
    }
  }
  // 读卡
	private readCard(cardtype: any){
    let params = {
      cardtype: cardtype,
      carddata: this.ybCarddata||' '
    }
		aReadMedAcc(params).then((res: any) => {
			if(res){
				this.ysInfor = res.data
        this.isYbFlag = 2
        this.dialogVisible2 = false
        this.tfOpen()
			}
		})
  }
  // 打开退费窗口
  private async openTf() {
    const res: any = await aQuerySjBrxz({ brxz: this.mzxx.brxz })
    if (res) {
      if (res.data == '6021') {
        // this.$prompt('医保患者请读卡', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        // }).then(({value}: any) => {
        //   aReadMedAcc({

        //   }).then((res:any)=>{
        //     // const { accountattr , cardid, cardtype } = res.data
        //     this.ysInfor = res.data
        //     this.isYbFlag = 2

        //   })
        // }).catch(() => {

        // });
        // return false
        this.dialogVisible2 = true
      }else{
        this.tfOpen()
      }
    }
    
    // this.dialogTf = true
    // // 获取没选中的明细
    // this.unSelectionDataDetails = []
    // // 选中的处方识别
    // var arrSelectedCfsb: any = []
    // this.selectionData.forEach((item: any) => {
    //   arrSelectedCfsb.push(item.cfsb)
    // })
    // //新增
    // // let newSelectChangeData:any = [] //判断是否改变数量
    // //去掉 有问题
    // // this.defaultTable.map((item:any)=>{
    // //   this.tableData2Details.map((key:any)=>{
    // //     if(item.sbxh===key.sbxh){
    // //       if(item.ypsl!=key.ypsl){
    // //         let obj = JSON.parse(JSON.stringify(item))
    // //         obj.ypsl = Number(item.ypsl-key.ypsl)
    // //         obj.hjje = Number(this.useGetFloat(obj.ypsl*obj.ypdj,2))
    // //         obj.zkje = Number(this.useGetFloat(obj.ypsl*obj.ypdj*(obj.zfbl?obj.zfbl:1)*(obj.zkbl?(1-obj.zkbl):0),2))
    // //         this.unSelectionDataDetails.push(obj)
    // //       }
    // //     }
    // //   })
    // // })
    // // newSelectChangeData = Array.from(new Set(newSelectChangeData))
    // // if(newSelectChangeData.length){
    // //   newSelectChangeData.map((item:any)=>{
    // //     arrSelectedCfsb.splice(arrSelectedCfsb.indexOf(item),1)
    // //   })
    // // }
    // //获取没选中的项
    // // this.unSelectionData = []
    // // this.tableData2.forEach((item: any)=>{
    // //   if(!arrSelectedCfsb.includes(item.cfsb)){
    // //     this.unSelectionData.push(item)
    // //   }
    // // })
    // this.tableData2Details.forEach((item: any, i: number) => {
    //   if (!arrSelectedCfsb.includes(item.cfsb)) {
    //     this.unSelectionDataDetails.push(item)
    //   } else {
    //     if (item.sbxh === this.defaultTable[i].sbxh && item.ypsl != this.defaultTable[i].ypsl) {
    //       let obj = JSON.parse(JSON.stringify(this.defaultTable[i]))
    //       obj.ypsl = Number(this.defaultTable[i].ypsl - item.ypsl)
    //       obj.hjje = Number(this.useGetFloat(obj.ypsl * obj.ypdj, 2))
    //       obj.zkje = Number(this.useGetFloat(obj.ypsl * obj.ypdj * (obj.zfbl ? obj.zfbl : 1) * (obj.zkbl ? 1 - obj.zkbl : 0), 2))
    //       this.unSelectionDataDetails.push(obj)
    //     }
    //     // this.defaultTable.map((key:any)=>{
    //     //   if(item.sbxh===key.sbxh){
    //     //     if(item.ypsl!=key.ypsl){
    //     //       let obj = JSON.parse(JSON.stringify(item))
    //     //       obj.ypsl = Number(item.ypsl-key.ypsl)
    //     //       obj.hjje = Number(this.useGetFloat(obj.ypsl*obj.ypdj,2))
    //     //       obj.zkje = Number(this.useGetFloat(obj.ypsl*obj.ypdj*(obj.zfbl?obj.zfbl:1)*(obj.zkbl?(1-obj.zkbl):0),2))
    //     //       this.unSelectionDataDetails.push(obj)
    //     //       // newSelectChangeData.push(item.cfsb)
    //     //     }
    //     //   }
    //     // })
    //   }
    // })
    // let jmje = 0
    // if (this.unSelectionDataDetails && this.unSelectionDataDetails.length) {
    //   this.unSelectionDataDetails.map((item: any) => {
    //     jmje = jmje + (item.jmje ? item.jmje : 0) + (item.zkje ? item.zkje : 0)
    //   })
    // }
    // let params = {
    //   body: this.unSelectionDataDetails,
    //   jsxxReq: {},
    //   mzxx: this.mzxx,
    // }
    // params.mzxx.jmje = jmje
    // aQueryTFPayment(params).then((res: any) => {
    //   if (res) {
    //     this.tfBody = res.data.body
    //     this.tfShowjs = res.data.showjs
    //     this.formDataTf.tfje = getFloat(res.data.showjs.tfje, 2)
    //     this.formDataTf.ysk = getFloat(res.data.showjs.ysk, 2)
    //     this.formDataTf.fkmc = res.data.body.fkmc
    //     this.formDataTf.tzje = getFloat(-res.data.showjs.ysk, 2)
    //     // this.formDataTf.yskNew = res.data.body.ysk
    //     this.formDataTf.yskOld = (mul(res.data.body.ysk, 100) - mul(res.data.showjs.ysk, 100)) / 100
    //     this.formDataTf.yskOld = getFloat(this.formDataTf.yskOld, 2)
    //   }
    // })
  }
  private calcZhje(row: any, i: number) {
    this.defaultTable.map((item: any) => {
      if (row.sbxh === item.sbxh) {
        if (row.ypsl > item.ypsl) {
          row.ypsl = item.ypsl
        }
        if (row.ypsl < 0) {
          row.ypsl = 0
        }
        this.tableData3[i].zkje = Number(this.useGetFloat(row.ypsl * row.ypdj * (row.zfbl ? row.zfbl : 1) * (row.zkbl ? 1 - row.zkbl : 0), 2))
        this.tableData3[i].hjje = Number(this.useGetFloat(row.ypsl * row.ypdj, 2))
      }
    })
    //页面退费金额展示
    let tfje = 0
    this.selectionData.forEach((i: any) => {
      this.tableData2Details.forEach((j: any) => {
        if (j.cfsb == i.cfsb) {
          // this.formData.tfje += j.hjje * j.zfbl
          // this.formData.tfje = ( mul(this.formData.tfje, 10000) + mul(mul(mul(j.hjje, j.zfbl), j.zkbl ? j.zkbl : 1), 10000)) / 10000
          tfje += j.ypdj * j.ypsl * (j.zkbl ? j.zkbl : 1) * (j.zfbl ? j.zfbl : 1)
        }
      })
    })
    this.formData.tfje = getFloat(tfje, 2)
  }
  private tfOpen(){
    this.dialogTf = true
    // 获取没选中的明细
    this.unSelectionDataDetails = []
    // 选中的处方识别
    var arrSelectedCfsb: any = []
    this.selectionData.forEach((item: any) => {
      arrSelectedCfsb.push(item.cfsb)
    })
    //新增
    // let newSelectChangeData:any = [] //判断是否改变数量
    //去掉 有问题
    // this.defaultTable.map((item:any)=>{
    //   this.tableData2Details.map((key:any)=>{
    //     if(item.sbxh===key.sbxh){
    //       if(item.ypsl!=key.ypsl){
    //         let obj = JSON.parse(JSON.stringify(item)) 
    //         obj.ypsl = Number(item.ypsl-key.ypsl)
    //         obj.hjje = Number(this.useGetFloat(obj.ypsl*obj.ypdj,2))
    //         obj.zkje = Number(this.useGetFloat(obj.ypsl*obj.ypdj*(obj.zfbl?obj.zfbl:1)*(obj.zkbl?(1-obj.zkbl):0),2))
    //         this.unSelectionDataDetails.push(obj)
    //       }
    //     }
    //   })
    // })
    // newSelectChangeData = Array.from(new Set(newSelectChangeData))
    // if(newSelectChangeData.length){
    //   newSelectChangeData.map((item:any)=>{
    //     arrSelectedCfsb.splice(arrSelectedCfsb.indexOf(item),1)
    //   })
    // }
    //获取没选中的项
    // this.unSelectionData = []
    // this.tableData2.forEach((item: any)=>{
    //   if(!arrSelectedCfsb.includes(item.cfsb)){
    //     this.unSelectionData.push(item)
    //   }
    // })
    this.tableData2Details.forEach((item: any,i:number)=>{
      if(!arrSelectedCfsb.includes(item.cfsb)&&item.ypsl==this.defaultTable[i].ypsl){
        this.unSelectionDataDetails.push(item)
      } else {
        if (item.sbxh === this.defaultTable[i].sbxh && item.ypsl != this.defaultTable[i].ypsl) {
          let obj = JSON.parse(JSON.stringify(this.defaultTable[i]))
          obj.ypsl = Number(this.defaultTable[i].ypsl - item.ypsl)
          obj.hjje = Number(this.useGetFloat(obj.ypsl * obj.ypdj, 2))
          obj.zkje = Number(this.useGetFloat(obj.ypsl * obj.ypdj * (obj.zfbl ? obj.zfbl : 1) * (obj.zkbl ? 1 - obj.zkbl : 0), 2))
          this.unSelectionDataDetails.push(obj)
        }
      }
    })
    let jmje = 0
    if (this.unSelectionDataDetails && this.unSelectionDataDetails.length) {
      this.unSelectionDataDetails.map((item: any) => {
        jmje = jmje + (item.jmje ? item.jmje : 0) + (item.zkje ? item.zkje : 0)
      })
    }
    let params:any = {
      body: this.unSelectionDataDetails,
      jsxxReq: {},
      mzxx: this.mzxx,
      isYb:0
    }
    if (this.isYbFlag == 2) {
      params.accountattr = this.ysInfor.accountattr || '', 
      params.cardid = this.ysInfor.ecToken || '', 
      params.cardtype = this.ysInfor.cardtype || ''
      params.isYb = 1
    }
    params.mzxx.jmje = jmje
    aQueryTFPayment(params).then((res: any) => {
      if (res) {
        this.tfBody = res.data.body
        this.tfShowjs = res.data.showjs
        this.formDataTf.tfje = getFloat(res.data.showjs.tfje, 2)
        this.formDataTf.ysk = getFloat(res.data.showjs.ysk, 2)
        this.formDataTf.fkmc = res.data.body.fkmc
        this.formDataTf.tzje = getFloat(-res.data.showjs.ysk, 2)
        // this.formDataTf.yskNew = res.data.body.ysk
        this.formDataTf.yskOld = (mul(res.data.body.ysk, 100) - mul(res.data.showjs.ysk, 100)) / 100
        this.formDataTf.yskOld = getFloat(this.formDataTf.yskOld, 2)
      }
    })
  }
  // 开始退费
  private saveRefund() {
    this.loadingBtn = true
    //新增
    let unSelectionDataDetails: any[] = []
    let tfxxList: any[] = []
    let fzxxList: any[] = []
    this.unSelectionDataDetails.map((item: any) => {
      unSelectionDataDetails.push(item.cfsb)
    })
    unSelectionDataDetails = Array.from(new Set(unSelectionDataDetails))
    this.tableData2.map((item: any) => {
      if (unSelectionDataDetails.includes(item.cfsb)) {
        fzxxList.push(item)
      } else {
        tfxxList.push(item)
      }
    })
    let params: any = {
      fffs: this.tfBody.fkfs, // 付费方式
      // fphm: this.tfBody.lastfphm, // 发票号码
      data: this.unSelectionDataDetails,
      jsxxReq: {},
      mzxx: {
        ...this.mzxx,
        jkje: this.getYsMoney, // 交款金额
        zfje: this.tfBody.zfje,
        zjje: this.tfBody.zjje,
        ysk: this.tfBody.ysk,
        // tfxx: this.selectionData, // 退费信息
        // fzxx: this.unSelectionData // 付账信息
        tfxx: tfxxList,
        fzxx: fzxxList,
      },
    }
    if (this.isYbFlag == 2) {
      params.accountattr = this.ysInfor.accountattr || '',
      params.cardid = this.ysInfor.ecToken || '',
      params.cardtype = this.ysInfor.cardtype || ''
    }
    if (this.tfBody.fkfs != 2) {
      params.mzxx.zpje = 0
    } else {
      // params.mzxx.xjje = 0
      params.mzxx.zpje = this.tfBody.zfje
    }
    aSaveRefundSettle(params).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.$notify({
          title: '退费成功',
          message: '',
          type: 'success',
        })
        this.dialogTf = false
        this.searchTable1()
        //新增 //判断是否全部退费
        var arrSelectedCfsb: any = []
        this.selectionData.forEach((item: any) => {
          arrSelectedCfsb.push(item.cfsb)
        })
        let newSelectChangeData: any = [] //选中的是否有部分退药校验
        this.defaultTable.map((item: any) => {
          this.tableData2Details.map((key: any) => {
            if (item.sbxh === key.sbxh) {
              if (item.ypsl != key.ypsl) {
                newSelectChangeData.push(item.cfsb)
              }
            }
          })
        })
        newSelectChangeData = Array.from(new Set(newSelectChangeData))
        if (newSelectChangeData.length) {
          newSelectChangeData.map((item: any) => {
            arrSelectedCfsb.splice(arrSelectedCfsb.indexOf(item), 1)
          })
        }
        let isSelectAll: boolean = this.tableData2.length == arrSelectedCfsb.length ? true : false
        this.tableData2 = []
        this.tableData3 = []
        this.selectionData = []
        if (!isSelectAll) {
          // 部分退费则打印发票
          this.print(params.mzxx, res.data)
        }
      } else {
        this.$message({
          message: res.message,
          type: 'error',
        })
      }
      this.loadingBtn = false
    })
  }

  // 退号弹窗
  private openTh() {
    var rw: any = this.$refs['reg-withdrawal']
    rw.openDialog()
  }

  // 增加索引
  private tableRowClassName({ row, rowIndex }: any) {
    this.$set(row, 'index', rowIndex)
  }

  // 获取到数据后
  private addKeyBoard1() {
    if (this.tableData1.length) {
      addEventListener('keydown', this.keyBoard1)
      this.setFirstRow1()
      const inputSearchFphm: any = this.$refs.inputSearchFphm
      inputSearchFphm.blur()
    }
    this.tableData2 = []
    this.tableData3 = []
    this.selectionData = []
  }

  // 打印发票

  private async print(mzxxReq: any, jsxx: any) {
    let params = {
      fphm: mzxxReq.fphm,
      jgName: JSON.parse(localStorage.getItem('userInfo') as any).hospitalName,
      yb: false,
      zsfphm: '',
    }
    let res = await aPrintMoth(params)
    if (res) {
      this.printChargeBill(res)
    }
  }

  private printChargeBill(res: any) {
    const __qiankun__ = window.__POWERED_BY_QIANKUN__
    let LODOP: any = null
    if (__qiankun__) {
      LODOP = Vue.prototype.$getLodop()
    } else {
      LODOP = getLodop()
    }
    if (!LODOP) {
      console.log('没有安装打印控件')
      this.$emit('resetForm')
      // 是否继续结算
      let prevRecord = JSON.parse(localStorage.getItem('opSettlePrevRecord') as any)
      this.$emit('checkMultiple', prevRecord.jzkh, prevRecord.cardtype)
      return false
    }
    let mzxx = res.data.mzfpBaseResp[0]
    let sfxmList = res.data.sfxmList
    let ypList = res.data.ypList
    if (res.data.dyfs == 1) {
      //获取打印机名称LODOP.GET_PRINTER_NAME()
      LODOP.PRINT_INIT('门（急）诊收费票据')
      LODOP.SET_PRINT_PAGESIZE(1, '241mm', '140mm', '')
      LODOP.SET_PRINT_STYLE('FontSize', 8)
      LODOP.ADD_PRINT_TEXT('16mm', '24mm', '64mm', '4mm', mzxx.jgmc)
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 13)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.ADD_PRINT_TEXT('22mm', '24mm', '64mm', '4mm', '医 疗 门（急）诊 收 费 票 据')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.ADD_PRINT_TEXT('29mm', '24mm', '64mm', '4mm', mzxx.yyyy)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.ADD_PRINT_TEXT('33mm', '28mm', '30mm', '4mm', '姓名：' + mzxx.xm)
      LODOP.ADD_PRINT_TEXT('33mm', '63mm', '30mm', '4mm', '性别：' + (mzxx.brxb == '1' ? '男' : '女'))

      let printHeader1: any = () => {
        LODOP.ADD_PRINT_TEXT('38mm', '36mm', '10mm', '4mm', '项目')
        LODOP.ADD_PRINT_TEXT('38mm', '70mm', '18mm', '4mm', '金额（元）')
      }
      printHeader1()
      let initTop1 = 42
      let pages = 1 // 第几页
      let itemIndex1 = 0 // 单页内第几项
      for (let i = 0; i < sfxmList.length; i++) {
        let top = initTop1 + itemIndex1 * 5
        LODOP.ADD_PRINT_TEXT(top + 'mm', '36mm', '24mm', '4mm', sfxmList[i].sfxm)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '70mm', '24mm', '4mm', sfxmList[i].xmje)
        itemIndex1++
        if ((i + 1) % 8 == 0 && i < sfxmList.length - 1) {
          LODOP.NEWPAGEA()
          itemIndex1 = 0
          pages++
          LODOP.SET_PRINT_STYLE('PageIndex', pages)
          printHeader1()
        }
      }
      LODOP.SET_PRINT_STYLE('PageIndex', 'first')
      LODOP.ADD_PRINT_TEXT('75mm', '28mm', '50mm', '4mm', '合计（大写）：' + numtochinese(mzxx.hjje.toString()))
      LODOP.ADD_PRINT_TEXT('82mm', '28mm', '50mm', '4mm', '总额：' + mzxx.hjje)
      LODOP.ADD_PRINT_TEXT('82mm', '56mm', '50mm', '4mm', '优惠：' + mzxx.jmje)
      LODOP.ADD_PRINT_TEXT('82mm', '78mm', '50mm', '4mm', '实际金额：' + mzxx.grjf)
      LODOP.ADD_PRINT_TEXT('87mm', '28mm', '50mm', '4mm', '个人支付：' + (mzxx.grzf == null ? 0 : mzxx.grzf))
      LODOP.ADD_PRINT_TEXT('87mm', '66mm', '50mm', '4mm', '个人账户支付：' + mzxx.grzhzf)
      LODOP.ADD_PRINT_TEXT('92mm', '28mm', '50mm', '4mm', '医保统筹支付：' + mzxx.ybtczf)
      LODOP.ADD_PRINT_TEXT('92mm', '72mm', '50mm', '4mm', '附加支付：' + mzxx.fjzf)
      LODOP.ADD_PRINT_TEXT('97mm', '28mm', '50mm', '4mm', '现金支付中：分类自负' + (mzxx.flzf == null ? 0 : mzxx.flzf) + '元')
      LODOP.ADD_PRINT_TEXT('97mm', '86mm', '50mm', '4mm', '自负' + (mzxx.zf == null ? 0 : mzxx.zf) + '元')
      LODOP.ADD_PRINT_TEXT('102mm', '28mm', '50mm', '4mm', '自费' + (mzxx.zifei == null ? 0 : mzxx.zifei) + '元（不属于医保报销范围）')
      LODOP.ADD_PRINT_TEXT('107mm', '28mm', '50mm', '4mm', '当年账户余额：' + mzxx.dnzhye)
      LODOP.ADD_PRINT_TEXT('107mm', '66mm', '50mm', '4mm', '历年账户余额：' + mzxx.lnzhye)
      LODOP.ADD_PRINT_TEXT('122mm', '72mm', '50mm', '4mm', '现金支付：' + mzxx.grjf)
      LODOP.ADD_PRINT_TEXT('29mm', '108mm', '50mm', '4mm', '服务业')
      LODOP.ADD_PRINT_TEXT('29mm', '126mm', '50mm', '4mm', '卡号：' + mzxx.shbzk)
      LODOP.ADD_PRINT_TEXT('29mm', '162mm', '50mm', '4mm', '医保类型：' + mzxx.jsfs)
      let printHeader2 = () => {
        LODOP.ADD_PRINT_TEXT('36mm', '110mm', '50mm', '4mm', '项目编码')
        LODOP.ADD_PRINT_TEXT('36mm', '136mm', '50mm', '4mm', '名称')
        LODOP.ADD_PRINT_TEXT('36mm', '159mm', '50mm', '4mm', '规格')
        LODOP.ADD_PRINT_TEXT('36mm', '170mm', '50mm', '4mm', '数量')
        LODOP.ADD_PRINT_TEXT('36mm', '179mm', '50mm', '4mm', '单位')
        LODOP.ADD_PRINT_TEXT('36mm', '187mm', '50mm', '4mm', '单价')
        LODOP.ADD_PRINT_TEXT('36mm', '197mm', '50mm', '4mm', '金额（元）')
      }
      printHeader2()
      let initTop2 = 42
      let itemIndex2 = 0 // 单页内第几项
      let page = 1 // 第几页
      for (let i = 0; i < ypList.length; i++) {
        let top = initTop2 + itemIndex2 * 4
        LODOP.ADD_PRINT_TEXT(top + 'mm', '112mm', '24mm', '4mm', ypList[i].mxbm)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '130mm', '24mm', '4mm', ypList[i].mxmc)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '159mm', '24mm', '4mm', ypList[i].mxgg)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '172mm', '24mm', '4mm', ypList[i].mxsl)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '180mm', '24mm', '4mm', ypList[i].yfdw)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '187mm', '24mm', '4mm', ypList[i].mxdj)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '198mm', '24mm', '4mm', ypList[i].mxje)
        itemIndex2++
        if ((i + 1) % res.data.mzfpmxsl == 0 && i < ypList.length - 1) {
          LODOP.NEWPAGEA()
          itemIndex2 = 0
          page++
          LODOP.SET_PRINT_STYLE('PageIndex', page)
          printHeader2()
        }
      }

      LODOP.SET_PRINT_STYLE('PageIndex', 'first') // 以下只打印在第一页
      LODOP.ADD_PRINT_TEXT('131mm', '28mm', '60mm', '4mm', '单据号：' + mzxx.fphm)
      LODOP.ADD_PRINT_TEXT('131mm', '80mm', '60mm', '4mm', '中心流水号：' + mzxx.zxlsh == null ? '' : mzxx.zxlsh)
      LODOP.ADD_PRINT_TEXT('131mm', '140mm', '60mm', '4mm', '收款员：' + mzxx.sfygh)
      LODOP.ADD_PRINT_TEXT('131mm', '182mm', '50mm', '4mm', '收款单位（章）：')
      if (res.data.fpyl === '0') {
        LODOP.SET_PRINTER_INDEXA(res.data.mzhjsfdyjmc)
        LODOP.PRINT()
      } else {
        LODOP.PREVIEW()
      }
    } else if (res.data.dyfs == 3) {
      LODOP.SET_PRINT_PAGESIZE(1, '241mm', '140mm', '')
      LODOP.SET_PRINT_STYLE('FontSize', 10)

      LODOP.ADD_PRINT_TEXT('23mm', '33mm', '60mm', '4mm', mzxx.yyyy)
      LODOP.ADD_PRINT_TEXT('23mm', '90mm', '95mm', '4mm', '医疗服务')

      LODOP.ADD_PRINT_TEXT('30mm', '22mm', '30mm', '4mm', '姓名:' + mzxx.xm)
      LODOP.ADD_PRINT_TEXT('30mm', '70mm', '30mm', '4mm', '卡号:' + mzxx.shbzk)
      LODOP.ADD_PRINT_TEXT('30mm', '115mm', '100mm', '4mm', '中心流水号:' + mzxx.zxlsh)

      LODOP.ADD_PRINT_TEXT('35mm', '22mm', '90mm', '4mm', '收款人单位名称:' + mzxx.jgmc)
      LODOP.ADD_PRINT_TEXT('35mm', '85mm', '90mm', '4mm', '纳税人识别码:' + res.data.nsrsbh)
      LODOP.ADD_PRINT_TEXT('35mm', '140mm', '40mm', '4mm', '类型:' + mzxx.jsfs)
      LODOP.ADD_PRINT_LINE('40mm', '22mm', '40mm', '196mm', 0, 1)
      LODOP.ADD_PRINT_LINE('41mm', '82mm', '130mm', '82mm', 0, 1)

      let printHeader1: any = () => {
        LODOP.ADD_PRINT_TEXT('42mm', '33mm', '30mm', '4mm', '项目')
        LODOP.ADD_PRINT_TEXT('42mm', '60mm', '30mm', '4mm', '金额（元）')
      }
      printHeader1()
      let initTop1 = 48
      let itemIndex1 = 0
      for (let i = 0; i < sfxmList.length; i++) {
        let top = initTop1 + itemIndex1 * 4
        LODOP.ADD_PRINT_TEXT(top + 'mm', '30mm', '30mm', '4mm', sfxmList[i].sfxm)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '58mm', '30mm', '4mm', sfxmList[i].xmje)
        itemIndex1++
        printHeader1()
      }

      LODOP.SET_PRINT_STYLE('PageIndex', 'first')
      LODOP.ADD_PRINT_LINE('81mm', '22mm', '81mm', '81mm', 0, 1)

      LODOP.SET_PRINT_STYLE('FontSize', '9')

      LODOP.ADD_PRINT_TEXT('83mm', '22mm', '100mm', '4mm', '合计(小写):' + mzxx.hjje)
      LODOP.ADD_PRINT_TEXT('88mm', '22mm', '100mm', '4mm', '合计(大写):' + numtochinese(mzxx.hjje.toString()))

      LODOP.ADD_PRINT_TEXT('93mm', '22mm', '40mm', '4mm', '现金支付:' + mzxx.xjzf)
      LODOP.ADD_PRINT_TEXT('93mm', '54mm', '40mm', '4mm', '账户支付:' + mzxx.grzhzf)

      LODOP.ADD_PRINT_TEXT('98mm', '22mm', '40mm', '4mm', '统筹支付:' + mzxx.ybtczf)
      LODOP.ADD_PRINT_TEXT('98mm', '54mm', '40mm', '4mm', '附加支付:' + mzxx.fjzf)

      LODOP.ADD_PRINT_TEXT('103mm', '22mm', '120mm', '4mm', '现金支付中分类自负:' + (mzxx.flzf == null ? 0 : mzxx.flzf) + '自负' + (mzxx.zf == null ? 0 : mzxx.zf))

      LODOP.ADD_PRINT_TEXT('108mm', '22mm', '100mm', '4mm', '自费:' + (mzxx.zifei == null ? 0 : mzxx.zifei) + '(不属于医保报销范围)')

      LODOP.ADD_PRINT_TEXT('113mm', '22mm', '100mm', '4mm', '当年账户余额:' + +mzxx.dnzhye)
      LODOP.ADD_PRINT_TEXT('118mm', '22mm', '100mm', '4mm', '历年账户余额:' + +mzxx.lnzhye)
      LODOP.ADD_PRINT_TEXT('118mm', '90mm', '120mm', '4mm', '药品请当面点清！按卫生部规定，药品一经发出不得退换！')
      LODOP.ADD_PRINT_TEXT('123mm', '22mm', '50mm', '4mm', '收款员:' + mzxx.sfygh)

      LODOP.SET_PRINT_STYLE('FontSize', '10')
      let printHeader2 = () => {
        LODOP.ADD_PRINT_TEXT('42mm', '90mm', '40mm', '4mm', '项目编码')
        LODOP.ADD_PRINT_TEXT('42mm', '118mm', '30mm', '4mm', '规格')
        LODOP.ADD_PRINT_TEXT('42mm', '133mm', '20mm', '4mm', '数量')
        LODOP.ADD_PRINT_TEXT('42mm', '148mm', '20mm', '4mm', '单位')
        LODOP.ADD_PRINT_TEXT('42mm', '163mm', '25mm', '4mm', '单价')
        LODOP.ADD_PRINT_TEXT('42mm', '178mm', '30mm', '4mm', '金额')
      }
      printHeader2()
      let initTop2 = 48
      let itemIndex2 = 0 // 单页内第几项
      let page = 1 // 第几页
      for (let i = 0; i < ypList.length; i++) {
        let top = initTop2 + itemIndex2 * 5
        LODOP.ADD_PRINT_TEXT(top + 'mm', '87mm', '32mm', '4mm', ypList[i].mxmc)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '117mm', '22mm', '4mm', ypList[i].mxgg)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '135mm', '20mm', '4mm', ypList[i].mxsl)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '148mm', '20mm', '4mm', ypList[i].yfdw)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '163mm', '24mm', '4mm', ypList[i].mxdj)
        LODOP.ADD_PRINT_TEXT(top + 'mm', '178mm', '30mm', '4mm', ypList[i].mxje)
        itemIndex2++
        if ((i + 1) % res.data.mzfpmxsl == 0 && i < ypList.length - 1) {
          LODOP.NEWPAGEA()
          itemIndex2 = 0
          page++
          LODOP.SET_PRINT_STYLE('PageIndex', page)
          printHeader2()
        }
      }
      if (res.data.fpyl === '0') {
        LODOP.SET_PRINTER_INDEXA(res.data.mzhjsfdyjmc)
        LODOP.PRINT()
      } else {
        LODOP.PREVIEW()
      }
    }
  }

  // 默认选中第一行
  private setFirstRow1() {
    const table1: any = this.$refs.table1
    table1.setCurrentRow(this.tableData1[0])
    this.curRowIndex1 = 0
  }
  private setFirstRow2() {
    const table2: any = this.$refs.table2
    table2.setCurrentRow(this.tableData2[0])
    this.curRowIndex2 = 0
  }

  // 输入框获取焦点
  private focus1() {
    removeEventListener('keydown', this.keyBoard1)
    removeEventListener('keydown', this.keyBoard2)
  }

  // 键盘选择
  private keyBoard1(e: any) {
    console.log('键盘-发票选择')
    const table1: any = this.$refs.table1
    if (e.keyCode == 38) {
      // 上
      e.preventDefault()
      if (this.curRowIndex1 != 0) {
        this.curRowIndex1--
        table1.setCurrentRow(this.tableData1[this.curRowIndex1])
        // this.curRow = this.tableData[this.curRowIndex]
      }
    }
    if (e.keyCode == 40) {
      // 下
      e.preventDefault()
      if (this.curRowIndex1 != this.tableData1.length - 1) {
        this.curRowIndex1++
        table1.setCurrentRow(this.tableData1[this.curRowIndex1])
        // this.curRow = this.tableData[this.curRowIndex]
      }
    }
    if (e.keyCode == 13) {
      this.getDetail1(this.tableData1[this.curRowIndex1])
    }
  }

  private keyBoard2(e: any) {
    console.log('键盘-处方选择')
    const table2: any = this.$refs.table2
    if (e.keyCode == 38) {
      // 上
      e.preventDefault()
      if (this.curRowIndex2 != 0) {
        this.curRowIndex2--
        table2.setCurrentRow(this.tableData2[this.curRowIndex2])
        // this.curRow = this.tableData[this.curRowIndex]
      }
    }
    if (e.keyCode == 40) {
      // 下
      e.preventDefault()
      if (this.curRowIndex2 != this.tableData2.length - 1) {
        this.curRowIndex2++
        table2.setCurrentRow(this.tableData2[this.curRowIndex2])
        // this.curRow = this.tableData[this.curRowIndex]
      }
    }
    // if(e.keyCode == 13){
    //   this.getDetail2(this.tableData2[this.curRowIndex2])
    // }
    if (e.keyCode == 32) {
      console.log('空格键')
      this.getDetail2(this.tableData2[this.curRowIndex2])
      table2.toggleRowSelection(this.tableData2[this.curRowIndex2])
    }
  }

  //初始化的周期函数
  created() {
    this.listSlotHeight1 = Vue.prototype.PageHeight - 108
    this.listSlotHeight2 = Vue.prototype.PageHeight - 120
    this.listSlotHeight3 = Vue.prototype.PageHeight - 120
  }
  mounted() {
    // this.getNow()
    // this.getLists()
    // aCurTime().then((res: any) => {
    //   if(res){
    //     console.log('当前时间');
    //     console.log(res.data);
    //   }
    // })
  }
  destroyed() {
    removeEventListener('keydown', this.keyBoard1)
    removeEventListener('keydown', this.keyBoard2)
  }
}
</script>

<style lang="scss" scoped>
// 布局样式
.content {
  display: flex;
  padding:30px 0;
}
.area {
  padding: 10px;
  border-radius: 8px;
  background: #fff;
}
.left {
  width: 28%;
}
.right {
  display: flex;
  flex-direction: column;
  width: calc(72% - 10px);
  margin-left: 10px;
  .upper {
  }
  .lower {
    flex-grow: 1;
    display: flex;
    margin-top: 10px;
    > .area {
      padding-bottom: 0;
    }
    .lower-left {
      width: 22%;
    }
    .lower-right {
      width: calc(78% - 10px);
      margin-left: 10px;
    }
  }
}

// 重置his-module、his-small
.his-small {
  padding: 0;
}
.row {
  margin-bottom: 8px;
}

.row .label {
  .el-date-editor ::v-deep {
    width: 100%;
    height: 28px;
  }
  ::v-deep.el-input {
    width: auto;
    .el-input__inner {
      width: 100%;
    }
  }
}

// 单选框
.small-radio-group {
  flex-shrink: 0;
  .el-radio {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
    ::v-deep .el-radio__label {
      padding-left: 4px;
      font-size: 13px;
    }
  }
}
// .display{
//   display: flex;
// }
// 头部
.header1 {
  margin-bottom: 10px;
  padding-bottom: 0;
  border: none;
  .label {
    width: 100%;
    > div {
      white-space: nowrap;
    }
  }
}
.header2 {
  margin-bottom: 10px;
  padding-bottom: 10px;
  .label {
    width: 100%;
  }
  .el-input {
    flex-grow: 1;
  }
}
.header3 {
  .label {
    height: 20px !important;
  }
}

//四列表单
.form4 {
  margin: 0 !important;
  .form-area {
    float: left;
    width: calc((100% - 16px * 3) / 4);
    margin-right: 16px;
    &:nth-child(4n) {
      margin-right: 0;
    }
    &:nth-last-child(-n + 3) {
      .el-form-item {
        margin-bottom: 0 !important;
      }
    }
  }
  .el-form-item {
    display: inline-block;
    width: 100%;
    margin-bottom: 0 !important;
    &.item-card {
      width: 65%;
      + .el-button {
        width: calc(35% - 8px);
        height: 28px;
        margin-left: 8px;
        padding: 0;
        justify-content: center;
      }
    }
  }
}

.el-table {
  ::v-deep .el-table__header {
    .el-checkbox {
      display: none;
    }
  }
}

.drug-type {
  margin-left: 8px;
  font-size: 16px;
  font-weight: bold;
  color: $blue;
}
.el-divider {
  margin: 0 16px;
}
.lower-right {
  .row {
    .label > span {
      white-space: nowrap;
    }
    .el-input {
      margin-right: 16px;
    }
  }
}

// 退费弹窗
.form-tf {
  .area-title {
    margin: 8px 0 10px;
    padding: 4px 0 8px;
    border-bottom: 1px solid $border;
    .icon {
      color: $blue;
      vertical-align: middle;
    }
    span {
      margin-left: 4px;
      color: $first;
    }
  }
  .item-area {
    @include clearfix;
    .el-form-item {
      float: left;
      display: block;
      width: calc((100% - 16px) / 2);
      margin-bottom: 10px;
      &:nth-child(odd) {
        float: left;
      }
      &:nth-child(even) {
        float: right;
      }
      ::v-deep .el-form-item__content {
        width: auto;
        margin-left: 64px !important;
      }
    }
  }
  .item-area-1 {
    padding: 2px 0 12px 0;
    > div {
      display: inline-block;
      font-size: 13px;
      span {
        font-size: 14px;
        color: $red;
        font-family: 'siyuanMedium';
      }
    }
  }
}

pre {
  position: absolute;
  bottom: 0;
  height: 400px;
  font-size: 12px;
  border: 1px solid #ccc;
  overflow: auto;
  &.p1 {
    right: 0;
  }
  &.p2 {
    right: 300px;
  }
}
</style>
