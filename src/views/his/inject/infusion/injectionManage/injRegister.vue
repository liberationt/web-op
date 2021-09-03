// 注射接药登记
<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="11">
        <div class="his-module his-small">
          <pagenation-list
            ref="pageTable"
            data-url="/op-service/syjydjzb/doQuerySyJydjList"
            v-model="tableData1"
            :list-height="listSlotHeight"
            :searchData="searchData"
            http-method="post"
          >
            <div slot="header" class="row">
              <div class="label">
                <!-- 科室 -->
                <h1 class="title">注射接药登记</h1>
                <el-divider direction="vertical" class="mr4"></el-divider>
                <el-checkbox-group v-model="searchData.zt" @change="changQueryZt">
                  <el-checkbox label="0" style="display:none">未开始</el-checkbox>
                  <el-checkbox label="1" @change="change1">注射中</el-checkbox>
                  <el-checkbox label="2">注射完成</el-checkbox>
                </el-checkbox-group>
                <el-divider direction="vertical" class="mr4"></el-divider>
                <div class="btn">
                  <el-button @click="openDiolag">
                    <i class="icon his-patient-info" />登记
                  </el-button>
                </div>
              </div>
            </div>
            <el-table
              slot="list"
              stripe
              :highlight-current-row="true"
              :data="tableData1"
              :height="listSlotHeight"
              class="scroll-bar"
              border
              @row-click="getDetail"
              @select="tableSelect"
            >
              <!-- 复选框 -->
              <!-- <el-table-column type="selection" width="32"></el-table-column> -->

              <el-table-column type="index" width="32"></el-table-column>

              <!-- 状态，0未开始，1注射中，2注射完成 -->
              <el-table-column label="状态" min-width="60" prop="status">
                <template scope="scope">
                  <div v-if="scope.row.zt==1||scope.row.zt==0" style="color: #1485FF">注射中</div>
                  <div v-else style="color:#F95776">注射完</div>
                </template>
              </el-table-column>

              <!-- 登记时间 -->
              <el-table-column prop="djsj" label="登记时间" min-width="140"></el-table-column>

              <!-- 病人姓名 -->
              <el-table-column prop="brxm" label="患者姓名" min-width="80"></el-table-column>

              <!-- 性别-->
              <el-table-column prop="brxb" label="性别" min-width="60">
                <template slot-scope="scope">
                  <div v-if="genderList.find(item => item.dv==scope.row.brxb)">
                    {{genderList.find(item => item.dv==scope.row.brxb).dn}}
                  </div>
                </template>
              </el-table-column>

              <!-- 年龄 -->
              <el-table-column prop="age" label="年龄" min-width="60"></el-table-column>

              <!-- 发票号 -->
              <!-- <el-table-column prop="fphm" label="发票号" min-width="80"></el-table-column> -->

              <!-- 注射日期 -->
              <el-table-column prop="syrq" label="注射日期" min-width="90"></el-table-column>

              <!-- 操作 -->
              <el-table-column label="操作" width="70" fixed="right" align="center" class-name="action-btns">
                <template slot-scope="scope">
                  <!-- 注射完成 -->
                  <el-tooltip :content="'注射完成'" effect="light">
                    <el-popconfirm
                      hideIcon
                      :cancelButtonText="$t('common.cancel')"
                      :confirmButtonText="$t('common.confirm')"
                      :title="'注射完成？'"
                      @confirm="confirm(scope.row)"
                    >
                      <el-button
                        slot="reference"
                        class="green"
                        :disabled="scope.row.zt==0?false:true"
                      >
                        <i class="icon his-automated"></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>

                  <!-- 补打瓶签 -->
                  <el-tooltip :content="'补打注射单'" effect="light">
                    <el-button class="blue" @click="printInfSheet(scope.row.djdh)">
                      <i class="icon his-caozuo_shixin" />
                    </el-button>
                  </el-tooltip>

                  <!-- 补打巡回单 -->
                  <!-- <el-tooltip :content="'补打巡回单'" effect="light">
                    <el-button class="blue" @click="printInfXhd(scope.row.djdh)">
                      <i class="icon his-caozuo_shixin" />
                    </el-button>
                  </el-tooltip> -->
                </template>
              </el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>


      <el-col class="ht" :span="13">
        <div class="his-module his-small">
          <div slot="header" class="row">
            <div class="label">
              <!-- 注射药品详情 -->
              <h1 class="title">注射药品详情</h1>
              <!-- <el-divider direction="vertical" class="mr4"></el-divider>
              <div class="btn">
                <el-button @click="printInfSheet(curRow.djdh)">
                  <i class="icon his-btn-print" />打印注射单
                </el-button>
                <el-button @click="printInfXhd(curRow.djdh)">
                  <i class="icon his-btn-print" />打印巡回单
                </el-button>
              </div> -->
            </div>
          </div>
          <el-table
            slot="list"
            stripe
            :highlight-current-row="true"
            :data="tableData2"
            :height="listSlotHeight"
            class="scroll-bar no-underline"
            border
            @row-click="handleChange"
            row-key="id"
            empty-text
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column label width="14" align="center">
              <template slot-scope="scope">
                <div class="w100" :class="scope.row.colorFlag ? 'greenBack' : 'orangeBack'"></div>
              </template>
            </el-table-column>

            <!-- 注射序号 -->
            <el-table-column prop="xh" label="序号" width="44"></el-table-column>

            <!-- 开方日期 -->
            <el-table-column prop="kfrq" label="开方日期" width="140"></el-table-column>

            <!-- 药品名称 -->
            <el-table-column prop="ypmc" label="药品名称" width="160" show-overflow-tooltip></el-table-column>

            <!-- 规格 -->
            <el-table-column prop="ypgg" label="规格" width="80" show-overflow-tooltip></el-table-column>

            <!-- 产地 -->
            <el-table-column prop="ypcd" label="产地" width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="ypcdList.find(item => item.dv==scope.row.ypcd)" class="text-ellipsis">
                  {{ypcdList.find(item => item.dv==scope.row.ypcd).dn}}
                </div>
                <div v-else>{{scope.row.ypcd}}</div>
              </template>
            </el-table-column>

            <!-- 剂量 -->
            <el-table-column prop="ypjl" label="剂量" width="60">
              <template slot-scope="scope">
                {{scope.row.ypjl}}{{scope.row.jldw}}
              </template>
            </el-table-column>

            <!-- 频次 -->
            <el-table-column prop="sypc" label="频次" class-name="text-blue-td" width="60"></el-table-column>

            <!-- 途径 -->
            <el-table-column prop="gytj" label="途径" class-name="text-blue-td" width="60">
              <template slot-scope="scope">
                <div v-if="infusionWalyList.find(item => item.dv==scope.row.gytj)" class="text-ellipsis">
                  {{infusionWalyList.find(item => item.dv==scope.row.gytj).dn}}
                </div>
                <div v-else>{{scope.row.gytj}}</div>
              </template>
            </el-table-column>

            <!-- 天数 -->
            <el-table-column prop="yyts" label="天数" class-name="text-blue-td" width="60"></el-table-column>

            <!-- 医生 -->
            <el-table-column prop="ysdm" label="医生" width="80">
              <template slot-scope="scope">
                <div v-if="docList.find(item => item.dv==scope.row.ysdm)" class="text-ellipsis">
                  {{docList.find(item => item.dv==scope.row.ysdm).dn}}
                </div>
                <div v-else>{{scope.row.ysdm}}</div>
              </template>
            </el-table-column>

            <!-- 说明 -->
            <el-table-column prop="bzmc" label="说明"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <injRegDialog
      ref="injRegDialog"
      :ypcdList="ypcdList"
      :docList="docList"
      :deptList="deptList"
      :infusionWalyList="infusionWalyList"
      @registered="registered"
    ></injRegDialog>
    <!-- <InfusionSheet ref="InfusionSheet"></InfusionSheet> -->

    <!-- 注射单 -->
    <div
      v-for="(value,key,index1) in infPqInfo.maps"
      :key="key"
      :id="'infPq'+key"
      style="width:400px;height:450px;border:1px solid #f00;"
      :style="'right:' + 300*index1 + 'px'"
    >
      <div style="font-size:18px;text-align:center;">{{jgName}}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;">
        <div style="font-size:16px;">{{infPqInfo.brxm}}</div>
        <div style="font-size:14px;">{{infPqInfo.brxb==1?'男':'女'}} {{infPqInfo.ages}}</div>
        <div style="font-size:14px;">出生日期<br>{{infPqInfo.csnyStr}}</div>
        <div style="width:80px;"></div>
        <!-- <div>||||||||||||||||||||<br><span style="font-size:12px;">65160</span></div> -->
      </div>
      <table style="width:100%;margin-top:2px;border-top:3px double;border-bottom:1px solid;" cellspacing="0">
        <tr>
          <th style="font-size:13px;border-bottom:1px solid">药品名称</th>
          <th style="font-size:13px;border-bottom:1px solid">剂量</th>
        </tr>
        <tr v-for="(item, index2) in value" :key="index2">
          <td style="padding-bottom:4px;font-size:13px;" :style="index2==0?'padding-top:4px;':''">
            <div>{{item.ypmc}}</div>
            <div style="font-size:13px;">规格：{{item.ypgg}}</div>
          </td>
          <td style="font-size:13px;font-weight:bold;">{{item.ypjl}}{{item.jldw}}</td>
        </tr>
      </table>
      <div style="position:absolute;bottom:0;width:100%;">
        <div style="display:flex;justify-content:space-between;">
          <span style="font-size:12px;">审方：<span style="display:inline-block;vertical-align:bottom;width:50px;font-size:12px;border-bottom:1px solid #000;"></span></span>
          <span style="font-size:12px;">摆药：<span style="display:inline-block;vertical-align:bottom;width:50px;font-size:12px;border-bottom:1px solid #000;"></span></span>
          <span style="font-size:12px;">核对：<span style="display:inline-block;vertical-align:bottom;width:50px;font-size:12px;border-bottom:1px solid #000;"></span></span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:6px;">
          <span style="font-size:12px;">配置：<span style="display:inline-block;vertical-align:bottom;width:50px;font-size:12px;border-bottom:1px solid #000;"></span></span>
          <span style="font-size:12px;">复核：<span style="display:inline-block;vertical-align:bottom;width:50px;font-size:12px;border-bottom:1px solid #000;"></span></span>
          <span style="font-size:12px;">注射：<span style="display:inline-block;vertical-align:bottom;width:50px;font-size:12px;border-bottom:1px solid #000;"></span></span>
        </div>
        <div style="display:flex;justify-content:space-around;margin-top:6px;">
          <div style="font-size:14px;">座位号：<span style="font-size:18px;">24</span></div>
          <div style="font-size:14px;">
            共<span style="font-size:18px;">{{Object.keys(infPqInfo.maps).length}}</span>袋，
            第<span style="font-size:18px;">{{index1+1}}</span>袋
          </div>
        </div>
        <div style="display:flex;justify-content:space-around;margin-top:6px;">
          <div style="font-size:14px;">卡号：<span style="">{{infPqInfo.jzkh}}</span></div>
          <div style="font-size:14px;">{{infPqInfo.djsj}}</div>
        </div>
      </div>
    </div>
    <!-- 巡回单 -->
    <div id="infXhd" style="display:none;width:700px;height:700px;padding:10px;border:1px solid #ccc;">
      <table id="infXhd1" border="1" width="100%" style="border-collapse:collapse;">
        <thead style="font-size:12px;">
          <tr>
            <th rowspan="2">时间</th>
            <th rowspan="2" style="width:40%">补液名称</th>
            <th rowspan="2">毫升/小时</th>
            <th colspan="5">滴速(滴/分)</th>
            <th colspan="2">通畅</th>
            <th rowspan="2" style="width:10%">签名</th>
          </tr>
          <tr>
            <th style="font-weight:normal;">&lt;50</th>
            <th style="font-weight:normal;">50-60</th>
            <th style="font-weight:normal;">61-70</th>
            <th style="font-weight:normal;">70-80</th>
            <th style="font-weight:normal;">&gt;80</th>
            <th style="font-weight:normal;">是</th>
            <th style="font-weight:normal;">否</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value,key,index1) in infPqInfo.maps" :key="key">
            <td></td> <!-- 时间 -->
            <td>
              <table width="100%" cellpadding="4">
                <tr v-for="(item, index2) in value" :key="index2">
                  <td style="width:80%;font-size:12px;">{{item.ypmc}}</td>
                  <td style="font-size:12px;text-align:right;">{{item.ypjl}}{{item.jldw}}</td>
                </tr>
              </table>
            </td>
            <td></td> <!-- 毫升每小时 -->
            <td v-for="(item, index) in 5" :key="index"></td> <!-- 滴速 -->
            <td v-for="(item, index) in 2" :key="index+5"></td> <!-- 通畅 -->
            <td></td> <!-- 签名 -->
          </tr>
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
    
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import {
  aQueryUnregistList, aQueryRegistList, aUpdateSyZt, aPrintSyptdy
} from '@/api/his/inject/infusion/infusionReg.ts'
import injRegDialog from './components/injRegDialog.vue'
// import InfusionSheet from './compontents/InfusionSheet.vue'
import { groupColor } from '@/views/his/inject/untils.ts'
import { getLodop } from '@/plugins/lodop/index.js'
import { rightScroll } from '@/utils/index.ts'


@Component({
  name: 'InfusionMedication',
  filters: {},
  components: {
    injRegDialog,
    // InfusionSheet
  },
})
export default class extends Vue {
  private searchData: any = {
    ksdm: '',
    kslb: 2,
    zt: ['0', '1'] // 0注射中，1注射中，2注射完成
  }
  //   登记
  private diolag: boolean = false
  private tableData1: Array<any> = []
  private tableData2: any[] = []
  private curRow: any = {}
  private listSlotHeight: number = 0 //列表高度
  private forms: any = {
    roomName: '',
    roomAddr: '',
    orderNo: '',
    hospitalId: 0,
    roomId: 0,
    enable: 1,
  }
  private listQuery: any = {
    pageNum: 1,
    pageSize: 10,
    parentMenuId: 0,
  }
  private title: string = ''
  private ksdm: any = Vue.prototype.AUTHORITY.bussinessRole // 当前注射科室
  private genderList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT // 性别
  private ypcdList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_DRUGMADEIN_DICT : this.$store.state.webSqlDict.DRUG_DRUGMADEIN_DICT // 药品产地
  private docList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT // 医生列表
  private deptList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.OUTPATIENT_DEPARTMENT : this.$store.state.webSqlDict.OUTPATIENT_DEPARTMENT // 门诊科室
  private infusionWalyList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_METHOD_DICT : this.$store.state.webSqlDict.DRUG_METHOD_DICT // 发药方式（给药途径）
  private infPqInfo: any = {} // 注射单内容
  private jgName: any = JSON.parse(localStorage.userInfo).hospitalName

  @Watch('tableData1')
  private onValueChange(value: string) {
    rightScroll()
  }

  // 获取表格1
  private getLists(){
    const table1: any = this.$refs.pageTable
    table1.getList()
    this.curRow = {}
    // 清空右侧表格
    this.tableData2 = []
  }

  // 改变搜索状态
  private changQueryZt(value: any){
    this.getLists()
  }

  // 勾选/取消“注射中”
  // 页面不显示“未开始”，与“注射中”联动
  private change1(value: any){
    if(value){
      // 一定不存在“0”
      this.searchData.zt.push('0')
    }else{
      // 一定存在“0”
      let index = this.searchData.zt.findIndex((item: any)=>{
        return item == 0
      })
      this.searchData.zt.splice(index, 1)
    }
  }

  // 查看详情
  private getDetail(row: any){
    this.curRow = row
    aQueryRegistList({djdh: row.djdh, ksdm: this.ksdm}).then((res: any) => {
      if(res){
        this.tableData2 = res.data
        this.tableData2 = groupColor(this.tableData2)
      }
    })
  }

  // 点击勾选框时触发
  private tableSelect(selection: any, row: any){
    this.getDetail(row)
  }

  // 注射完成
  private confirm(row: any){
    aUpdateSyZt({djdhs: row.djdh}).then((res: any) => {
      if(res){
        this.$notify({
          title: '注射完成',
          message: '',
          type: 'success'
        })
        this.getLists()
      }
    })
  }

  //   登记打开弹窗
  private openDiolag() {
    const rd: any = this.$refs.injRegDialog
    rd.open()
  }

  private openInfusionSheet() {
    ;(this.$refs.InfusionSheet as any).open()
  }


  private handleChange(val: any) {
    console.log(val)
  }
  private handleClose() {}

  // 登记完成后
  private registered(djdh: any){
    console.log('登记单号', djdh);
    this.getLists()
    this.printInfSheet(djdh)
    // this.printInfXhd(djdh)
  }

  // 打印注射单
  private printInfSheet(djdh: any) {
    let params = {
      djdh: djdh,
      ksdm: this.ksdm,
      kslb: 2
    }
    aPrintSyptdy(params).then((res: any) => {
      if(res){
        this.infPqInfo = res.data
        this.$nextTick(()=>{

          const __qiankun__ = window.__POWERED_BY_QIANKUN__
          let LODOP: any = null
          if (__qiankun__) {
            console.log('主项目')
            LODOP = Vue.prototype.$getLodop()
          } else {
            console.log('子项目')
            LODOP = getLodop()
          }

          let a = LODOP.PRINT_INIT('打印注射单')
          console.log('开始打印注射单',a);
          LODOP.SET_PRINT_PAGESIZE(1, "80mm", "90mm", "")
          // LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true)
          // LODOP.SET_PRINT_MODE('FULL_HEIGHT_FOR_OVERFLOW', true)
          for(let i in this.infPqInfo.maps){
            const infPq: any = document.getElementById('infPq'+i)
            LODOP.ADD_PRINT_HTM("4mm", "4mm", "RightMargin:4mm", "BottomMargin:4mm", infPq.innerHTML)
            LODOP.ADD_PRINT_BARCODE("11mm","54mm","26mm","7mm","128Auto",this.infPqInfo.maps[i][0].sytm)
            LODOP.SET_PRINT_STYLEA(0,"FontSize",6)
            LODOP.NEWPAGE()
          }
          // LODOP.PRINT_SETUP()
          LODOP.PREVIEW() //预览
          // LODOP.PRINT()
        })
        
      }
    })
    
  }

  // 打印巡回单
  private printInfXhd(djdh: any){
    let params = {
      djdh: djdh,
      ksdm: this.ksdm,
      kslb: 2
    }
    aPrintSyptdy(params).then((res: any) => {
      if(res){
        this.infPqInfo = res.data
        this.$nextTick(()=>{
          
          const __qiankun__ = window.__POWERED_BY_QIANKUN__
          let LODOP: any = null
          if (__qiankun__) {
            console.log('主项目')
            LODOP = Vue.prototype.$getLodop()
          } else {
            console.log('子项目')
            LODOP = getLodop()
          }

          let a = LODOP.PRINT_INIT('打印输液巡回单')
          console.log('开始打印输液巡回单',a)
          LODOP.SET_PRINT_PAGESIZE(1,0,0,"B5 (JIS)")
          // LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true)
          // LODOP.SET_PRINT_MODE('FULL_HEIGHT_FOR_OVERFLOW', true)
          LODOP.ADD_PRINT_TEXT("12mm","16mm","70mm","8mm",this.jgName)
          LODOP.SET_PRINT_STYLEA(0,'FontSize',12)
          LODOP.ADD_PRINT_TEXT("22mm","100mm","34mm","6mm","HL-BD-0023-001")
          LODOP. ADD_PRINT_LINE('28mm','10mm','28mm','166mm',0,1)
          LODOP.ADD_PRINT_TEXT("34mm","13mm","20mm","6mm","姓名：")
          LODOP.ADD_PRINT_TEXT("34mm","40mm","20mm","6mm","性别：")
          LODOP.ADD_PRINT_TEXT("34mm","66mm","20mm","6mm","出生日期：")
          LODOP.ADD_PRINT_TEXT("34mm","104mm","20mm","6mm","年龄：")
          LODOP.ADD_PRINT_TEXT("34mm","130mm","20mm","6mm","日期：")
          LODOP.SET_PRINT_STYLE("Bold",1) // 加粗
          LODOP.ADD_PRINT_TEXT("34mm","22mm","20mm","6mm",this.infPqInfo.brxm)
          LODOP.ADD_PRINT_TEXT("34mm","50mm","20mm","6mm",this.infPqInfo.brxb==1?'男':'女')
          LODOP.ADD_PRINT_TEXT("34mm","82mm","22mm","6mm",this.infPqInfo.csnyStr)
          LODOP.ADD_PRINT_TEXT("34mm","114mm","20mm","6mm",this.infPqInfo.ages)
          LODOP.ADD_PRINT_TEXT("34mm","140mm","22mm","6mm",this.infPqInfo.djsj.substr(0,10))
          // 表格
          let xhd: any = document.getElementById("infXhd")
          let xhdTable: any = xhd.getElementsByTagName("table")[0]
          LODOP.ADD_PRINT_TABLE("42mm","6mm", "RightMargin:6mm","100%",xhdTable.outerHTML)
          // 页脚
          LODOP.ADD_PRINT_TEXT("230mm","13mm","20mm","6mm","穿刺次数：")
          LODOP.ADD_PRINT_TEXT("230mm","40mm","20mm","6mm","输液结束：")
          LODOP.ADD_PRINT_TEXT("230mm","66mm","50mm","6mm","年   月   日   时   分")
          LODOP.ADD_PRINT_TEXT("230mm","110mm","20mm","6mm","签名：")


          LODOP.PREVIEW()
          // LODOP.PRINT()
          // LODOP.PRINT_DESIGN()
        })
        
      }
    })
  }

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight - 51 - 40 - 5
  }

  mounted() {
    // this.judge()
    this.searchData.ksdm = this.ksdm
    this.getLists()
  }
}
</script>

<style lang="scss" scoped>
.row {
  margin-bottom: 0px;
}
.el-checkbox-group {
  display: flex;
  margin-left: 5px;
}
.el-checkbox__label {
  font-size: 13px !important;
  color: #222b31 !important;
}
.orangeBack,
.greenBack {
  height: 32px;
  opacity: 30%;
}

.greenBack {
  background: #0fcaad;
}
.orangeBack {
  background: #ffbf00;
}
::v-deep .el-table .el-table__expand-icon {
  display: none !important;
}
::v-deep .el-table__indent {
  padding-left: 0px !important;
}
::v-deep .el-table__placeholder {
  display: inline !important;
}

::v-deep .el-checkbox {
  margin-right: 10px;
}

// 打印
[id^=infPq]{
  position: absolute;
  z-index: -1;
  right: 20px;
  bottom: 20px;
  border: 1px solid;
  background: #fff;
}
#infXhd{
  position: absolute;
  z-index: -1;
  right: 20px;
  bottom: 20px;
  border: 1px solid;
  background: #fff;
  th,td{
    border: 1px solid #000;
  }
}

.label{
    ::v-deep.el-checkbox__label{
        padding-left: 4px;
    }
}
</style>
