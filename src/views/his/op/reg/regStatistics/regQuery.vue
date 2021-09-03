<template>
  <div class="content">
    <div class="his-module his-small upper">
      <div class="row">
        <div class="label">
          <div class="title">挂号查询</div>
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

            <el-button size="mini" type="text" @click="print">
              <i class="icon his-btn-print blue"></i>
              <span>挂号补打</span>
            </el-button>

            <!-- <el-button size="mini" type="text">
              <i class="icon his-btn-print blue"></i>
              <span>打印真实发票</span>
            </el-button> -->

          </div>
        </div>
      </div>
      <div class="">
        <el-form :model="formData" label-width="60px" class="form4 clearfix" ref="form">

          <!-- 就诊号码 -->
          <el-form-item :label="'就诊号码'" prop="jzhm">
            <el-input
              v-model="formData.jzhm"
              :placeholder="'请输入就诊号码'"
              @keyup.enter.native="searchLists"
            ></el-input>
          </el-form-item>

          <!-- 卡号 -->
          <el-form-item :label="'卡号'" prop="jzkh">
            <el-input
              v-model="formData.jzkh"
              :placeholder="'请输入卡号'"
              @keyup.enter.native="searchLists"
            ></el-input>
          </el-form-item>

          <!-- 病人姓名 -->
          <el-form-item :label="'病人姓名'" prop="brxm">
            <el-input
              v-model="formData.brxm"
              :placeholder="'请输入病人姓名'"
              @keyup.enter.native="searchLists"
            ></el-input>
          </el-form-item>

          <!-- 挂号医生 -->
          <el-form-item :label="'挂号医生'" prop="ysdm">
            <search-select
              table-name="SYS_DICT_CONFIG"
              kid="17"
              v-model="formData.ysdm"
              :backfillValue="formData.ysdm"
              :placeholder="'请选择挂号医生'"
            />
          </el-form-item>

          <!-- 挂号员 -->
          <el-form-item :label="'挂号员'" prop="ghczgh">
            <search-select
              table-name="SYS_DICT_CONFIG"
              kid="12"
              v-model="formData.ghczgh"
              :backfillValue="formData.ghczgh"
              :placeholder="'请选择挂号员'"
            />
          </el-form-item>

          <!-- 挂号日期 -->
          <el-form-item :label="'挂号日期'" prop="date">
            <el-date-picker
              type="daterange"
              v-model="date"
              value-format="yyyy-MM-dd"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              class="date-wrapper"
            ></el-date-picker>
          </el-form-item>

          <!-- 退号人 -->
          <el-form-item :label="'退号人'" prop="thczgh">
            <search-select
              table-name="SYS_DICT_CONFIG"
              kid="17"
              v-model="formData.thczgh"
              :backfillValue="formData.thczgh"
              :placeholder="'请选择退号人'"
            />
          </el-form-item>
          <!-- 挂号科室 -->
          <el-form-item :label="'挂号科室'" prop="ksdm">
            <search-select
              table-name="SYS_DICT_CONFIG"
              kid="13"
              v-model="formData.ksdm"
              :backfillValue="formData.ksdm"
              :placeholder="'请选择挂号科室'"
            />
          </el-form-item>
          <!-- 挂号类别 -->
          <el-form-item :label="'挂号类别'" prop="ghlb">
            <el-select v-model="formData.ghlb" filterable clearable  placeholder="请选择挂号类别">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 病人性质 -->
          <el-form-item :label="'收费性质'" prop="brxz">
            <search-select
              table-name="SYS_DICT_CONFIG"
              kid="14"
              v-model="formData.brxz"
              :backfillValue="formData.brxz"
              :placeholder="'请选择收费性质'"
            />
          </el-form-item>
          <!-- 发票范围 -->
          <el-form-item :label="'发票号码'" prop="beginFphm">
            <div style="display: flex;">
              <el-input
                v-model="formData.beginFphm"
                :placeholder="'请输入起始号码'"
                maxlength='10'
              ></el-input>
              <span>-</span>
              <el-input
                v-model="formData.endFphm"
                :placeholder="'请输入终止号码'"
                maxlength='10'
              ></el-input>
            </div>
          </el-form-item>
          <!-- 大病项目 -->
          <!-- <el-form-item :label="'大病项目'" prop="dbbz">
            <search-select
              table-name="SYS_DICT_CONFIG"
              kid="14"
              v-model="formData.dbbz"
              :backfillValue="formData.dbbz"
              :placeholder="'请选择大病项目'"
            />
          </el-form-item> -->
        </el-form>
      </div>
    </div>
    <div class="his-module his-small lower">
      <pagenation-list
        ref="pageTable"
        v-model="tableData"
        data-url="/op-service/opghksManage/doRegisteredQuery"
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

          <!-- 就诊号码 -->
          <el-table-column prop="jzhm" :label="'就诊号码'"></el-table-column>

          <!-- 真实发票号码 -->
          <el-table-column prop="zsfphm" :label="'发票号码'" min-width="100"></el-table-column>

          <!-- 卡号 -->
          <el-table-column prop="jzkh" :label="'卡号'" show-overflow-tooltip></el-table-column>

          <!-- 门诊号码 -->
          <el-table-column prop="mzhm" :label="'档案号码'" show-overflow-tooltip></el-table-column>

          <!-- 患者姓名 -->
          <el-table-column prop="brxm" :label="'患者姓名'"></el-table-column>

          <!-- 挂号科室 -->
          <el-table-column prop="ksdm" :label="'挂号科室'">
            <template slot-scope="scope">
              <div v-if="deptList.find(item => item.dv==scope.row.ksdm)">
                {{deptList.find(item => item.dv==scope.row.ksdm).dn}}
              </div>
              <div v-else>{{scope.row.ksdm}}</div>
            </template>
          </el-table-column>

          <!-- 挂号医生 -->
          <el-table-column prop="ysxm" :label="'挂号医生'">
            <template slot-scope="scope">
              <div v-if="docList.find(item => item.dv==scope.row.ysxm)">
                {{docList.find(item => item.dv==scope.row.ysxm).dn}}
              </div>
              <div v-else>{{scope.row.ysxm}}</div>
            </template>
          </el-table-column>

          <!-- 挂号员 -->
          <el-table-column prop="czgh" :label="'挂号员'">
            <template slot-scope="scope">
              <div v-if="usersList.find(item => item.dv==scope.row.czgh)">
                {{usersList.find(item => item.dv==scope.row.czgh).dn}}
              </div>
              <div v-else>{{scope.row.czgh}}</div>
            </template>
          </el-table-column>

          <!-- 挂号时间 -->
          <el-table-column prop="ghsj" :label="'挂号时间'" min-width="140"></el-table-column>

          <!-- 挂号费 -->
          <el-table-column prop="ghf" :label="'挂号费'" class-name="text-blue-td"></el-table-column>

          <!-- 诊疗费 -->
          <el-table-column prop="zlf" :label="'诊疗费'" class-name="text-blue-td"></el-table-column>

          <!-- 诊疗费 -->
          <el-table-column prop="zjf" :label="'专家费'" class-name="text-blue-td"></el-table-column>

          <!-- 病历费 -->
          <el-table-column prop="blf" :label="'病历费'" class-name="text-blue-td"></el-table-column>
          
          
          <!-- 现金支付 -->
          <el-table-column prop="xjje" :label="'现金支付'" class-name="text-blue-td"></el-table-column>
          <!-- 支票支付 -->
          <el-table-column prop="zpje" :label="'支票支付'" class-name="text-blue-td"></el-table-column>
          <el-table-column prop="zfbje" :label="'支付宝支付'" min-width="100" class-name="text-blue-td"></el-table-column>
          <el-table-column prop="wxje" :label="'微信支付'" class-name="text-blue-td"></el-table-column>
          <el-table-column prop="posje" :label="'POS支付'" class-name="text-blue-td"></el-table-column>
          <!-- 医保支付 -->
          <el-table-column prop="qtys" :label="'医保支付'" class-name="text-blue-td"></el-table-column>

          <!-- 合计 -->
          <el-table-column prop="hjje" :label="'合计'" class-name="text-blue-td"></el-table-column>

          <!-- 状态 -->
          <el-table-column prop="thbz" :label="$t('common.status')" min-width="70">
            <template slot-scope="scope">
              <div v-if="statusList.find(item => item.dv==scope.row.thbz)">
                {{statusList.find(item => item.dv==scope.row.thbz).dn}}
              </div>
              <div v-else>{{scope.row.thbz}}</div>
            </template>
          </el-table-column>

          <!-- 退号人 -->
          <el-table-column prop="thgh" :label="'退号人'">
            <template slot-scope="scope">
              <div v-if="usersList.find(item => item.dv==scope.row.thgh)">
                {{usersList.find(item => item.dv==scope.row.thgh).dn}}
              </div>
              <div v-else>{{scope.row.thgh}}</div>
            </template>
          </el-table-column>

          <!-- 退号日期 -->
          <el-table-column prop="thrq" :label="'退号时间'" min-width="140"></el-table-column>

          <!-- 门诊类别 -->
          <el-table-column prop="mzlb" :label="'门诊类别'">
            <template slot-scope="scope">
              <div v-if="opTypeList.find(item => item.dv==scope.row.mzlb)">
                {{opTypeList.find(item => item.dv==scope.row.mzlb).dn}}
              </div>
              <div v-else>{{scope.row.mzlb}}</div>
            </template>
          </el-table-column>

        </el-table>
      </pagenation-list>
    </div>
      <!-- 费用发票（dyfs==3） -->
      <div id="fyfp" v-show="false">
        <div style="display: flex;justify-content: flex-start;margin-bottom:2mm">
          <p style="margin: 0 0 0 15mm;font-size: 12px;width:41mm">{{printData.now}}</p>
          <p style="margin: 0 0 0 15mm;font-size: 12px">医疗服务</p>
        </div>
        <div style="display: flex;justify-content: flex-start;margin-bottom: 2mm">
          <div style="display: flex;justify-content: center">
            <p style="margin: 0 0 0 10mm;font-size: 12px;width: 28mm">付款人单位姓名：</p>
            <p style="margin: 0;font-size: 12px;width: 34mm">{{printData.brxm}}</p>
          </div>
          <div style="display: flex;justify-content: center">
            <p style="margin: 0;font-size: 12px;width: 23mm">社会保障号码：</p>
            <p style="margin: 0;font-size: 12px;width: 23mm">{{printData.shbzk}}</p>
          </div>
          <div style="display: flex;justify-content: center">
            <p style="margin: 0;font-size: 12px">交易流水号：</p>
            <p style="margin: 0;font-size: 12px">{{printData.jzlsh}}</p>
          </div>
        </div>
        <div style="display: flex;justify-content: flex-start;border-bottom: 1px solid #000;padding-bottom: 1mm">
          <div style="display: flex;justify-content: center">
            <p style="margin: 0 0 0 10mm;font-size: 12px;width: 28mm">收款人单位名称：</p>
            <p style="margin: 0;font-size: 12px;width: 34mm">{{userInfo.hospitalName}}</p>
          </div>
          <div style="display: flex;justify-content: center">
            <p style="margin: 0;font-size: 12px;width:23mm">纳税人识别码：</p>
            <p style="margin: 0;font-size: 12px;width: 39mm">{{printData.nsrsbh}}</p>
          </div>
          <div style="display: flex;justify-content: center">
            <p style="margin: 0;font-size: 12px">类型：</p>
            <p style="margin: 0;font-size: 12px">{{printData.yblx}}</p>
          </div>
        </div>
        <div style="width: 100%;display: flex;">
          <!-- 左 -->
          <div style="width:33%;border-right: 1px solid #000;">
            <!-- 上 -->
            <div style="border-bottom: 1px solid #000;padding-bottom: 1mm">
              <div style="display: flex;justify-content: flex-start;margin-top:4mm">
                <p style="margin: 0 13mm 0 5mm;font-size: 13px;">挂号费：</p>
                <p style="margin: 0;font-size: 13px;">{{printData.jcf}}</p>
              </div>
              <div style="display: flex;justify-content: flex-start;margin-top:4mm">
                <p style="margin: 0 13mm 0 5mm;font-size: 13px">诊疗费：</p>
                <p style="margin: 0;font-size: 13px">{{printData.zlf}}</p>
              </div>
              <div style="display: flex;justify-content: flex-start;margin-top:4mm">
                <p style="margin: 0 13mm 0 5mm;font-size: 13px">其他费：</p>
                <p style="margin: 0;font-size: 13px">{{printData.qtf}}</p>
              </div>
              <p style="margin:3mm 0 0 15mm;font-size: 12px">{{printData.zjfy ? '专家号' : '普通号'}}</p>
              <p style="margin: 2mm 0 0 14mm;font-size: 13px">{{printData.ksmc}}</p>
            </div>
            <!-- 下 -->
            <div style="padding-top: 1mm">
              <div style="display: flex;justify-content:flex-start;margin: 0.5mm 2mm 0 4mm">
                <p style="font-size: 14px;margin: 0">合计(小写)：</p>
                <p style="font-size: 14px;margin: 0">{{printData.hjje}}</p>
              </div>
              <div style="display: flex;justify-content:flex-start;margin: 0.5mm 2mm 0 4mm">
                <p style="font-size: 14px;margin: 0">合计(大写)：</p>
                <p style="font-size: 14px;margin: 0">{{printData.hjjedx}}</p>
              </div>
              <div style="display: flex;justify-content:flex-start;margin-top: 1.5mm">
                <p style="font-size:14px;margin: 0 1mm 0 4mm">现金支付</p>
                <p style="font-size:14px;margin: 0 10mm 0 0">{{printData.xjzf}}</p>
                <p style="font-size:14px;margin: 0">账户支付</p>
                <p style="font-size: 14px;margin: 0 0 0 1mm">{{printData.grzhzf}}</p>
              </div>
              <div style="display: flex;justify-content:flex-start;margin-top: 0.5mm">
                <p style="font-size:14px;margin: 0 1mm 0 4mm">统筹支付</p>
                <p style="font-size:14px;margin: 0 10mm 0 0">{{printData.ybtczf}}</p>
                <p style="font-size:14px;margin: 0">附加支付</p>
                <p style="font-size: 14px;margin: 0 0 0 1mm">{{printData.fjzf}}</p>
              </div>
              <div style="display: flex;justify-content:flex-start;margin-top: 1mm">
                <p style="font-size: 14px;margin: 0 0 0 4mm">现金支付中分类自负</p>
                <p style="font-size: 14px;margin: 0">{{printData.flzf}}</p>
                <p style="font-size: 14px;margin: 0">自负</p>
                <p style="font-size: 14px;margin: 0">{{printData.zf}}</p>
              </div>
              <div style="display: flex;justify-content:flex-start;margin-top: 0.5mm">
                <p style="font-size: 14px;margin: 0 0 0 4mm">自费</p>
                <p style="font-size: 14px;margin: 0">{{printData.zfei}}</p>
                <p style="font-size: 14px;margin: 0">元</p>
                <p style="font-size: 14px;margin: 0">(不属于医保报销范围)</p>
              </div>
              <div style="display: flex;justify-content:flex-start;margin-top: 1mm">
                <p style="font-size: 14px;margin: 0 0 0 4mm">当年账户余额</p>
                <p style="font-size: 14px;margin: 0">{{printData.dnzhye}}</p>
              </div>
              <div style="display: flex;justify-content:flex-start;margin-top: 0.5mm">
                <p style="font-size: 14px;margin: 0 0 0 4mm">历年账户余额</p>
                <p style="font-size: 14px;margin: 0">{{printData.lnzhye}}</p>
              </div>
              <div style="display: flex;justify-content:flex-start;margin-top: 1mm">
                <p style="font-size: 14px;margin: 0 0 0 4mm">收款员：</p>
                <p style="font-size: 14px;margin: 0">{{printData.skygh}}</p>
              </div>
            </div>
          </div>
          <!-- 右 -->
          <div>
            <div style="display: flex;justify-content:flex-start;margin: 12mm 0 0 27mm">
              <p style="font-size: 14px;margin: 0">挂号科室：</p>
              <p style="font-size: 14px;margin: 0">{{printData.ksmc}}</p>
            </div>
            <div style="display: flex;justify-content:flex-start;margin: 7mm 0 0 26mm">
              <p style="font-size: 14px;margin: 0">就诊序号：</p>
              <p style="font-size: 14px;margin: 0">{{printData.jzxh}}</p>
            </div>
            <div style="margin: 8mm 0 0 24mm">
              <p style="font-size: 14px;margin: 0">{{printData.now}}</p>
            </div>
            <div style="display: flex;justify-content: flex-start;margin: 10mm 0 0 30mm">
              <p style="font-size: 14px;">注：</p>
              <p style="font-size: 14px;">挂号当天有效</p>
            </div>
            <div>
              <p style="font-size: 14px;margin: 15mm 0 0 22mm">医院禁止吸烟，谢谢配合!</p>
            </div>
          </div>
        </div>
      </div>
	</div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { parseTime } from '@/utils'
import {
	aQuerySjBrxz, aPrintghxx
} from '@/api/his/op/reg/registerManage'
import { getNow, getParams } from '@/api/his/basic'
import { getFloat, mul, numtochinese } from '@/utils'
import { getLodop } from '@/plugins/lodop/index.js'

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
    jzhm: '',
    jzkh: '',
    brxm: '',
    ysdm: '',
    ghczgh: '', // 挂号操作工号
    beginDay: '',
    endDay: '',
    thczgh: '', // 退号操作工号
    ksdm:'', //挂号科室
    ghlb:'',//挂号类别
    brxz:'',//收费性质
    beginFphm:'', //开始时间
    endFphm:'', //结束时间
    // dbbz:'' //大病项目
  }
  private date: any[] = []
  private options: any[] = [
    {
      label:'上午',
      value:'1000006'
    },
    {
      label:'下午',
      value:'1000008'
    },
    {
      label:'夜间',
      value:'1000009'
    },
    {
      label:'全天',
      value:'1000010'
    },
  ]
  private printData: any = {
    now: '',
    brxm: '',
    shbzk: '',
    jzlsh: '',
    nsrsbh: '',
    yblx: '',
    jcf: '',
    zlf: '',
    qtf: '',
    zjfy: '',
    ksmc: '',
    hjje: '',
    xjzf: '',
    grzhzf: '',
    ybtczf: '',
    fjzf: '',
    flzf: '',
    zf: '',
    zfei: '',
    dnzhye: '',
    lnzhye: '',
    skygh: '',
    jzxh: '',
    hjjedx: ''
  }
  private detaDetails:any ={}
  private tableData: any[] = []
  private searchData: any = {}
  private deptList: any[] =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REGISTERATION_DEPARTMENT_DICT : this.$store.state.webSqlDict.REGISTERATION_DEPARTMENT_DICT // 挂号科室
  private docList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT // 医生
  private usersList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.USERS_DICT : this.$store.state.webSqlDict.USERS_DICT // 用户列表
  private opTypeList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.OUTPATIENT_TYPE : this.$store.state.webSqlDict.OUTPATIENT_TYPE // 门诊类别
  private statusList: any[] = [
    {dv: 0, dn: '正常挂号'},
    {dv: 1, dn: '退号'},
    {dv: 2, dn: '废号'},
  ]

  get listSlotHeight(){
    return Vue.prototype.PageHeight - 240
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
  get userInfo() {
    return JSON.parse(localStorage.userInfo)
  }
  //补打挂号
  private async print(){
    if(!this.detaDetails.zsfphm){
      this.$notify({
      title: '请选择发票',
      message: '',
      type: 'error',
    })
      return
    }
    let sjbrxz, ybsjbrxz

    let res1 = await aQuerySjBrxz({brxz: this.detaDetails.brxz})
    if(res1){
      sjbrxz = res1.data
    }

    let res2 = await getParams({commons: ['YBXZ']})
    if(res2){
      ybsjbrxz = res2.data.YBXZ
    }
    let params = {
      brxz: sjbrxz,
      ybsjbrxz: ybsjbrxz,
      jzhm: this.detaDetails.jzhm,
      sbxh: this.detaDetails.sbxh,
      ksdm: this.detaDetails.ksdm
    }
    let res = await aPrintghxx(params)
    this.printData = res.data
    this.printData.hjjedx = res.data.hjje ? numtochinese(res.data.hjje.toString()) : '0.00'
    this.printData.jcf = getFloat(res.data.jcf,2)
    this.printData.zlf = getFloat(res.data.zlf,2)
    this.printData.qtf = getFloat(res.data.qtf,2)
    this.printData.hjje = getFloat(res.data.hjje,2)
    this.printData.xjzf = getFloat(res.data.xjzf,2)
    this.printData.grzhzf = getFloat(res.data.grzhzf,2)
    this.printData.ybtczf = getFloat(res.data.ybtczf,2)
    this.printData.fjzf = getFloat(res.data.fjzf,2)
    this.printData.flzf = getFloat(res.data.flzf,2)
    this.printData.zf = getFloat(res.data.zf,2)
    this.printData.zfei = getFloat(res.data.zfei,2)
    this.printData.dnzhye = getFloat(res.data.dnzhye,2)
    this.printData.lnzhye = getFloat(res.data.lnzhye,2)
    if(res){
      this.print2(res)
    }
  }
  private print2(res: any){
    if(res.data.dyfs == 3){
      this.$nextTick(()=>{
        this.printFn(res.data.fpyl,res.data.ghdyjmc)
      })
    }
  }
  // 打印
  private printFn(num:any,name:string) {
    const __qiankun__ = window.__POWERED_BY_QIANKUN__
    var LODOP: any = null
    if (__qiankun__) {
      LODOP = Vue.prototype.$getLodop()
    } else {
      LODOP = getLodop()
    }
    if (LODOP) {
      LODOP.PRINT_INIT()
      LODOP.SET_PRINT_PAGESIZE(1, '208mm', '139mm', 'A5') // 2-打印方向及纸张类型,
      var a: any = document.getElementById('fyfp')
      var op: any = '<body>' + a.innerHTML + '</body>'
      LODOP.ADD_PRINT_HTM('25mm', '20mm', '208mm', '139mm', op) // 
      if(num==='0'){
        LODOP.SET_PRINTER_INDEXA(name)
        LODOP.PRINT()
      }else{
        LODOP.PREVIEW();
      }
      // LODOP.PRINT() // 打印
    }
  }
	// 获取列表
  private getLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.getList()
  }

  // 条件查询
  private searchLists() {
    this.formData.beginDay = this.date[0]
    this.formData.endDay = this.date[1]
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }

  // 获取详情
  private getDetail(row:any) {
    this.detaDetails = row
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

//四列表单
.form4{
	margin: 0!important;
	.el-form-item{
		float: left;
		width: calc((100% - 16px*3)/4);
    margin-right: 16px;
    margin-bottom: 8px!important;
		&:nth-child(4n){
			margin-right: 0;
    }
    &:nth-last-child(-n+3){
      margin-bottom: 0!important;
    }
    .search-select{
      width: 100%;
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
