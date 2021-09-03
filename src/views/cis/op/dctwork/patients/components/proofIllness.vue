<!--
 * @Author: 袁明阳
 * @Date: 2021-03-29 10:31:12
 * @LastEditTime: 2021-04-24 20:06:34
 * @LastEditors: Please set LastEditors
 * @Description: 病情证明单打印功能
 * @FilePath: \web-op\src\views\cis\op\dctwork\patients\components\proofIllness.vue
-->
<template>
  <div class="content ht scroll-bar his-proof">
    <el-row class="ht" :gutter="10" style="width: calc(100% + 5px)">
      <el-col class="ht" :span="12">
        <div class="his-module his-small ht">
          <pagenation-list ref="pageTable" v-model="mockDatas" data-url="/op-service/opbqzm/getDiseaseProofList" http-method="post" :list-height="listSlotHeight" class="ht" :searchData="searchData">
            <div slot="header">
              <div class="row">
                <div class="label">
                  <div class="querySearch">
                    <div class="searchTitle no-warp" style="padding-right: 2px">病情证明单</div>
                  </div>
                  <div class="btn">
                    <el-divider direction="vertical"></el-divider>
                    <el-button size="mini" type="text" @click="handleAdd">
                      <i class="icon his-btn-add green"></i>
                      {{ $t('common.add') }}
                    </el-button>
                    <!-- 刷新 -->
                    <el-button size="mini" type="text" @click="getLists">
                      <i class="icon his-btn-refresh"></i>
                      {{ $t('common.refresh') }}
                    </el-button>

                    <!-- 打印 -->
                    <el-button type="text" @click="printProof">
                      <i class="his-btn-print icon"></i>
                      {{ $t('common.print') }}
                    </el-button>

                    <!-- 测试打印 -->
                    <!-- <el-button type="text" @click="printData111">
                      <i class="his-btn-print icon"></i>
                      {{ $t('common.print') }}
                    </el-button> -->
                  </div>
                </div>
              </div>
            </div>
            <el-table 
              :data="getTable" 
              border 
              :fit="true" 
              stripe 
              :highlight-current-row="true" 
              slot="list" 
              @row-click="handleRowClick" 
              :row-class-name="tableRowClassName" 
              class="scroll-bar" 
              :height="listSlotHeight"
              style="width: 100%"
            >
              <el-table-column prop="webSortNumber" width="32"></el-table-column>
              <el-table-column prop="cardno" :label="'卡号'" :show-overflow-tooltip="true" width="80"></el-table-column>
              <el-table-column prop="sfzh" width="140" :label="'身份证号'" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column width="50px" prop="brxm" :label="'姓名'"></el-table-column>
              <el-table-column width="50px" prop="brxbName" :label="'性别'" />
              <el-table-column width="140" v-if="patientFile.zyhm" prop="ryrq" :label="'入院日期'" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column v-else prop="jzrq" :label="'就诊日期'" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column width="80px" prop="jzysName" :label="'接诊医生'" />
              <el-table-column width="80px" prop="jzksName" :label="'接诊科室'" />
              <el-table-column width="150" prop="brzd" :label="'诊断'" />
              <el-table-column width="80px" prop="xxts" :label="'休息天数'" class-name="text-blue-td" />
              <el-table-column width="90px" prop="kssj" :label="'开始时间'">
                <template slot-scope="scope">
                  <span>{{ scope.row.kssj ? scope.row.kssj.substr(0, 10) : '' }}</span>
                </template>
              </el-table-column>
              <el-table-column width="90px" prop="kssxw" :label="'开始上下午'">
                <template slot-scope="scope">
                  <span>{{ sxwFlag[scope.row.kssxw] || '未知' }}</span>
                </template>
              </el-table-column>
              <el-table-column width="90px" prop="jssj" :label="'结束时间'">
                <template slot-scope="scope">
                  <span>{{ scope.row.jssj ? scope.row.jssj.substr(0, 10) : '' }}</span>
                </template>
              </el-table-column>
              <el-table-column width="90px" prop="jssxw" :label="'结束上下午'">
                <template slot-scope="scope">
                  <span>{{ sxwFlag[scope.row.jssxw] || '未知' }}</span>
                </template>
              </el-table-column>
              <el-table-column width="50px" prop="bz" :label="'备注'" :show-overflow-tooltip="true" />
              <el-table-column :label="$t('common.action')" width="52" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-tooltip :content="$t('common.delete')" effect="light">
                    <el-popconfirm :title="'确认删除？'" :confirmButtonText="$t('common.confirm')" :cancelButtonText="$t('common.cancel')" @confirm="handleDelete(scope.row)" hideIcon class="ml10">
                      <el-button slot="reference" class="red">
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
      <el-col class="ht" :span="12" style="padding-right: 0px">
        <div class="his-module his-small ht">
          <div slot="header" class="row">
            <div class="label">
              <h1 class="title">{{ isCreateNew ? $t('common.add') : $t('common.edit') }}</h1>
            </div>
            <div class="operate">
              <el-button type="primary" size="mini" class="green-gra" icon="icon his-save" v-preventReClick @click="handleSave">{{ $t('common.save') }}</el-button>
            </div>
          </div>
          <el-form ref="formData" :model="formData" label-width="68px" class="form-wrapper scroll-bar" :rules="rules">
            <div class="area-title">
              <i class="icon his-basic-info"></i>
              <span>基本信息</span>
            </div>
            <div class="form-area1 clearfix">
              <el-form-item prop="brzd" :label="'诊断'">
                <el-input v-model="formData.brzd" placeholder=" " disabled></el-input>
              </el-form-item>
            </div>
            <div class="area-title">
              <i class="icon his-basic-info"></i>
              <span>病情时间</span>
            </div>
            <div class="form-area2 clearfix">
              <div class="area-item">
                <!-- 休息天数 -->
                <el-form-item prop="xxts" :label="'休息天数'">
                  <el-input-number @change="xxtsChange" size="mini" controls-position="right" :min="0.5" :max="10" v-model="formData.xxts" :step="0.5"></el-input-number>
                  <!-- <el-input v-model="formData.xxts" ></el-input> -->
                </el-form-item>
              </div>

              <div class="area-item">
                <!-- 开始时间 -->
                <el-form-item prop="kssj" :label="'开始时间'" class="item-date">
                  <el-date-picker @change="xxtsChange" v-model="formData.kssj" :clearable="false" type="date" :placeholder="'请选择时间'" value-format="yyyy-MM-dd HH:mm:ss" class="date-wrapper"></el-date-picker>
                </el-form-item>

                <!-- 开始上下午 -->
                <el-form-item prop="kssxw" :label="''" label-width="0" class="item-ampm">
                  <el-select v-model="formData.kssxw" @change="kssxwChange">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div class="area-item">
                <!-- 结束时间 -->
                <el-form-item prop="jssj" :label="'结束时间'" class="item-date">
                  <el-date-picker v-model="formData.jssj" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" class="date-wrapper" disabled></el-date-picker>
                </el-form-item>

                <!-- 结束上下午 -->
                <el-form-item prop="jssxw" :label="''" label-width="0" class="item-ampm">
                  <el-select v-model="formData.jssxw" disabled>
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="area-title">
              <i class="icon his-basic-info"></i>
              <span>备注</span>
            </div>
            <!-- <div class="form-area clearfix"> -->
            <el-form-item prop="bz" :label="'备注'" class="item-remark">
              <el-input type="textarea" v-model="formData.bz" :placeholder="'请填写备注'"></el-input>
            </el-form-item>
            <!-- </div> -->
          </el-form>
        </div>
      </el-col>
    </el-row>
    <!--	关于打印	-->
    <div class="statement-box" v-show="false">
      <statement
        ref="statement"
        :html-api="'/op-service/opbqzm/bqzmdPrint'"
        :html-search-data="htmlSearchData"
        :height="listSlotHeight + 26"
        :print-arg="{
          top: '8%',
          left: '10%',
          width: '90%',
          height: '87%',
        }"
        @hadUrl="getPrintUrl"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { deleteById, saveDiseaseProof, getBqzmPrintData, queryLogo, testReport } from '@/api/cis/op/dctwork/proofillness'
import { Form } from 'element-ui'
import dayjs from 'dayjs'
import { deepCopy, id2Name } from '@/utils'
import { getNow } from '@/api/his/basic' //获取当前时间（时间戳）
import { getLodop } from '@/plugins/lodop/index.js'
//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'ProofIllness',
  filters: {},
})
export default class extends Vue {
  @Prop({ required: true }) private patientFile!: any
  @Prop({ required: false }) private zdmc!: string
  private pnParam: any = {}
  private tableDatas: any[] = []
  private mockDatas: any = []
  private isCreateNew: boolean = true //新增还是保存
  private listSlotHeight: number = 0
  private forms: any = {}
  private valueRq: any = ''
  private rowIndex: number = -1
  private sexChoice: Array<any> = [] //性别
  private doctorList: Array<any> = [] //接诊医生
  private departMent: Array<any> = [] //接诊科室
  private sxwFlag: any = { 1: '上午', 2: '下午' }
  private htmlSearchData: any = {}
  private bqId: any = '' // 储存当前行的病情id
  private printData: any = '' // 打印时所需字段
  private logo: any = '' // 动态logo
  private rules: any = {
    xxts: [{ required: true, message: '请输入天数', trigger: 'blur' }],
    kssj: [{ required: true, message: '请选择天数', trigger: 'blur' }],
  }
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 214
  }
  mounted() {
    this.pnParam = this.$store.state.pnParam.PN_PARAM
    this.sexChoice = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT
    this.doctorList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.departMent = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.OUTPATIENT_DEPARTMENT : this.$store.state.webSqlDict.OUTPATIENT_DEPARTMENT
    this.fromInit() // 表单初始化
    this.getLists()
  }

  //数据交互
  private tableRowClassName({ row, rowIndex }: any) {
    row.index = rowIndex
  }

  private fromInit() {
    this.formData.bqid = ''
    this.formData.mzhm = this.patientFile.mzhm
    this.formData.brxm = this.patientFile.brxm
    this.formData.brxb = this.patientFile.brxb
    this.formData.sfzh = this.patientFile.sfzh
    this.formData.cardno = this.patientFile.jzkh
    this.formData.jzlsh = this.pnParam.jzlsh
    this.formData.jzks = Vue.prototype.AUTHORITY.outpatientCode
    if (this.patientFile.mzhm) {
      this.searchData.lx = 1
      this.formData.lx = 1
      this.searchData.jzlsh = this.pnParam.jzlsh
      this.formData.brzd = this.patientFile.fymc
    }
    if (this.patientFile.zyhm) {
      // 住院赋值
      this.searchData.lx = 2
      this.searchData.zyhm = this.patientFile.zyhm
      this.formData.lx = 2
      this.formData.cardno = this.patientFile.ybkh
      this.formData.zyhm = this.patientFile.zyhm
      this.formData.brzd = this.patientFile.mqzd
      this.formData.ryrq = this.patientFile.ryrq
      this.formData.jzks = this.patientFile.brks
      this.formData.jzlsh = 0
    }
    this.bqsjInit() // 初始化病情时间
  }
  //转换字典
  get getTable() {
    const tabledata = this.mockDatas
    id2Name(tabledata, 'brxb', 'brxbName', this.sexChoice, 'dv', 'dn')
    id2Name(tabledata, 'jzys', 'jzysName', this.doctorList, 'dv', 'dn')
    if (this.patientFile.zyhm) {
      id2Name(tabledata, 'jzks', 'jzksName', this.$store.state.webSqlDict.DEP_CODE_DICT, 'dv', 'dn')
    } else {
      id2Name(tabledata, 'jzks', 'jzksName', this.departMent, 'dv', 'dn')
    }
    return tabledata
  }
  // 病情时间初始化
  private async bqsjInit() {
    this.formData.kssj = dayjs(((await getNow()) as any).data).format('YYYY-MM-DD HH:mm:ss')
    this.formData.kssxw = dayjs(this.formData.kssj).hour() > 12 ? '2' : '1'
    this.xxtsChange()
  }
  // 休息天数改变
  private xxtsChange() {
    this.formData.jssj = dayjs(this.formData.kssj)
      .add((Number(this.formData.xxts) / 0.5) * 12, 'hour')
      .format('YYYY-MM-DD HH:mm:ss')
    this.formData.jssxw = dayjs(this.formData.jssj).hour() > 12 ? '2' : '1'
    // console.log(this.formData.jssj)
  }
  private kssjChange(data: any) {
    this.xxtsChange()
  }
  // 开始上下午改变
  private kssxwChange(data: any) {
    this.formData.kssj = data == '1' ? dayjs(this.formData.kssj).subtract(12, 'hour').format('YYYY-MM-DD HH:mm:ss') : dayjs(this.formData.kssj).add(12, 'hour').format('YYYY-MM-DD HH:mm:ss')
    console.log('2222222222222222', this.formData.kssj)
    this.xxtsChange()
  }
  private searchData: any = {
    lx: null, //门诊住院
    jzlsh: '', //门诊号码
    zyhm: '', //住院号码
    pageNum: 1,
    pageSize: 10,
  }
  private options: any = [
    {
      value: '1',
      label: '上午',
    },
    {
      value: '2',
      label: '下午',
    },
  ]
  private handleAdd() {
    ;(this.$refs.formData as Form).resetFields()
    this.fromInit() // 表单初始化
    this.isCreateNew = true
  }
  private formData: any = {
    bqid: null,
    brxb: this.patientFile.brxb,
    brxm: this.patientFile.brxm,
    brzd: this.patientFile.zdmc,
    bz: null,
    cardno: this.patientFile.jzkh,
    jssj: null,
    jssxw: null,
    jzks: Vue.prototype.AUTHORITY.outpatientCode,
    jzrq: this.patientFile.jzrq,
    jzys: this.patientFile.jzys,
    kssj: null,
    kssxw: null,
    lx: 1,
    mzhm: this.patientFile.mzhm,
    sfzh: this.patientFile.sfzh,
    xxts: null,
    zyhm: null,
    jzlsh: this.pnParam.jzlsh,
  }
  //重置表单
  private reset() {
    this.$nextTick(() => {
      ;(this.$refs.formData as Form).resetFields()
    })
  }
  //获取数据
  private getLists() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }
  // 点击行
  private handleRowClick(item: any) {
    this.bqId = item.bqid
    this.rowIndex = item.index
    this.forms = Object.assign(this.formData, item)
    this.formData.jssxw = this.formData.jssxw + ''
    this.formData.kssxw = this.formData.kssxw + ''
    this.isCreateNew = false
  }

  private handleDelete(val: any) {
    deleteById({ bqid: val.bqid }).then(() => {
      this.$notify.success('删除成功')
      this.getLists()
    })
  }
  //保存
  private handleSave() {
    ;(this.$refs.formData as Form).validate((valid: boolean) => {
      if (valid) {
        saveDiseaseProof(this.formData).then((res: any) => {
          if (res.errorCode == 'SUCCESS') {
            this.$notify({ title: this.isCreateNew ? '新增成功' : '修改成功', message: '', type: 'success' })
            this.getLists()
            this.handleAdd()
          }
        })
      }
    })
  }
  // 打印头部logo
  get titleContent() {
    return `<div style=" display: flex; width: 200mm; height:19mm; margin: 0 auto; justify-content: space-between; padding-left: 1mm; padding-right: 1mm">
              <img src=${this.logo} style="height:60%; margin-top:3mm;padding-left:3mm;"/>
              <span style="margin-top: 11mm">HL-BD-0010-003</span>
            </div>`
  }
  // 打印内容部分
  get tableContent() {
    return `
           <div style="width: 680px; margin: 0 auto; " >
            <div style="display: flex; width: 90%; justify-content: space-between">
              <div style="display: flex">
                <p>姓名:</p>
                <p style="border-bottom: 1px solid #000; width: 120px; text-align: center; padding-bottom: 2px">${this.printData.xm || ''}</p>
              </div>
              <div style="display: flex">
                <p>性别:</p>
                <p style="border-bottom: 1px solid #000; width: 60px; text-align: center">${this.printData.xb || ''}</p>
              </div>
              <div style="display: flex">
                <p>出生日期:</p>
                <p style="border-bottom: 1px solid #000; width: 130px; text-align: center">${this.printData.csrq || ''}</p>
              </div>
            </div>
            <div style="display: flex; width: 90%; justify-content: space-between; margin-top: 12px">
              <div style="display: flex">
                <p>年龄:</p>
                <p style="border-bottom: 1px solid #000; width: 120px; text-align: center; padding-bottom: 2px">${this.printData.nl || ''}</p>
              </div>
              <div style="display: flex; padding-right: 40px">
                <p>门急诊号:</p>
                <p style="border-bottom: 1px solid #000; width: 180px; text-align: center">${this.printData.mz_jyh || ''}</p>
              </div>
            </div>
            <div style="display: flex; margin-top: 12px">
              <p>于</p>
              <p style="width: 160px; text-align: center; font-size: 15px">${this.printData.jzsj || ''}</p>
              <p>来我院</p>
              <p style="width: 150px; text-align: center">${this.printData.ksmc || ''}</p>
              <p>就诊</p>
            </div>
            <div style="display: flex; margin-top: 25px">
              <p>诊断为：</p>
              <p>${this.printData.zd || ''}</p>
            </div>
            <div style="display: flex; margin-top: 25px">
              <p>建议休息：</p>
              <p style="width: 80px; text-align: center">${this.printData.xxts || ''}</p>
              <p>天</p>
            </div>
            <div style="display: flex; margin-top: 18px">
              <p>自</p>
              <p style="width: 170px; text-align: center; font-size: 15px">${this.printData.xxkssj || ''}</p>
              <p>至</p>
              <p style="width: 170px; text-align: center; font-size: 15px">${this.printData.xxjssj || ''}</p>
            </div>
            <div style="display: flex; margin-top: 18px">
              <div>备注：</div>
              <div>${this.printData.bz || ''}</div>
            </div>
            <div style="display: flex; margin-top: 100px; margin-left: 390px">
              <p>治疗医师：</p>
              <p style="width: 130px; border-bottom: 1px solid #000; padding-bottom: 2px; text-align: center">${this.printData.zzys || ''}</p>
            </div>
            <div style="margin-left: 435px; margin-top: 10px">${this.printData.zmsj || ''}</div>
            <div style="font-size: 14px; margin-left: 100px; margin-top: 10px">（加盖病假章处）</div>
            <div style="display: flex; margin-top: 60px; margin-left:15px;">
              <p>说明：</p>
              <p style="width: 400px">本证明供工作单位参考，本证明须盖章及医师签名有效：本证明只限病假使用，涂改无效，不作他用。</p>
            </div>
          </div>
         `
  }
  // 打印尾部部分
  get tableFooter() {
    return `
            <div style=" display: flex; width: 200mm;  margin: 0 auto; border-top: 1px solid #000; justify-content: space-between">
              <div style="padding-top: 12px">
                <div style="display: flex">
                  <p style="margin:0; padding:0;">院址：</p>
                  <p  style="margin:0; padding:0;">上海市普陀区真南路528号（同济大学沪西校区）</p>
                </div>
                <div style="display: flex">
                  <div style="display: flex">
                    <p style="margin:0; padding:0;">电话：</p>
                    <p style="font-size: 15px; margin:0; padding:0;">021-66699900</p>
                  </div>
                  <div style="display: flex; margin-left: 30px">
                    <p  style="margin:0; padding:0;">网址：</p>
                    <p style="font-size: 15px;margin:0; padding:0;">www.tyhosp.com</p>
                  </div>
                </div>
              </div>
            </div>
    `
    //     <div style="padding-top: 5px">
    //   <img
    //     src="https://www.chitus.com/ewm/create?config=%7B%22size%22%3A400%2C%22content%22%3A%22%E4%B8%8A%E6%B5%B7%E5%B8%82%E5%A4%A9%E4%BD%91%E5%8C%BB%E9%99%A2%22%2C%22font_color%22%3A%7B%22r%22%3A0%2C%22g%22%3A0%2C%22b%22%3A0%2C%22a%22%3A1%7D%2C%22font_size%22%3A20%2C%22line_space%22%3A12%2C%22logo_size%22%3A0.21%2C%22font_name%22%3A%22%E5%AE%8B%E4%BD%93%22%2C%22font_url%22%3A%22%2Ffonts%2Fsongti.woff%22%2C%22title_content%22%3A%22%22%2C%22title_content_two%22%3A%22%22%2C%22error%22%3A%22LOW%22%2C%22logo_border%22%3A%22no%22%2C%22eye_type%22%3A1%2C%22qr_extension%22%3A%22png%22%2C%22point_type%22%3A1%2C%22background_image%22%3A%22%2Fblack%2F6.png%22%2C%22qr_margin%22%3A%5B0.16%2C0.16%5D%7D"
    //     width="60"
    //     height="60"
    //   />
    // </div>
  }
  // 测试打印logo
  // private printData111() {
  //   testReport({}).then((res: any) => {
  //     console.log(res.data)
  //   })
  // }
  // 打印方法
  private async printProof() {
    if (this.rowIndex == -1) {
      this.$notify.error('请选择病情证明单打印')
      return
    }
    let hospitalId = JSON.parse(localStorage.userInfo).hospitalId
    // console.log(hospitalId)
    // return
    await queryLogo({ hospitalId }).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        if (res.data) {
          this.logo = res.data
        }
      }
    })
    await getBqzmPrintData({ bqid: this.bqId }).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        if (res.data) {
          this.$nextTick(() => {
            this.printData = deepCopy(res.data)
          })
        }
      }
    })
    const __qiankun__ = window.__POWERED_BY_QIANKUN__
    var LODOP: any = null
    if (__qiankun__) {
      LODOP = Vue.prototype.$getLodop()
    } else {
      LODOP = getLodop()
    }
    if (LODOP) {
      LODOP.PRINT_INIT('病情证明单')
      LODOP.SET_PRINT_PAGESIZE(1, '210mm', '297mm', 'A4') // 2-打印方向及纸张类型,

      LODOP.ADD_PRINT_HTM('8mm', 0, '210mm', '20mm', this.titleContent) // 头部logo

      LODOP.ADD_PRINT_LINE('26mm', '3mm', '26mm', '207mm', 0, 1)

      LODOP.ADD_PRINT_TEXT('31mm', 0, '210mm', '8mm', '病情证明单') // 标题名
      LODOP.SET_PRINT_STYLEA(0, 'FontName', '宋体')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 20)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.SET_PRINT_STYLEA(0, 'Horient', 2)
      LODOP.ADD_PRINT_HTML(
        '45mm',
        '0mm',
        'RightMargin:0mm',
        '248mm',
        `<html><style>
        *{
          margin: 0;
          padding: 0;
        }
      </style><body>${this.tableContent}</body></html>`
      )
      // LODOP.ADD_PRINT_HTM('260mm', 0, '210mm', '20mm', this.tableFooter) // 尾部

      LODOP.SET_PRINT_MODE('POS_BASEON_PAPER', true) // 以纸张边缘为基点
      LODOP.PREVIEW() // 预览
      // LODOP.PRINT() // 打印
      // LODOP.PRINT_DESIGN() // 设计
    }
    // const cc: any = this.$refs.statement
    // this.htmlSearchData.pkey = this.mockDatas[this.rowIndex].bqid
    // this.htmlSearchData.lx = 1

    // cc.getTableUrl()
  }

  private getPrintUrl() {
    const cc: any = this.$refs.statement
    cc.printTable()
  }
}
</script>

<style lang="scss" scoped>
.his-proof {
  padding: 0 !important;
  .his-small {
    padding-top: 4px;
    .row {
      padding-bottom: 4px;
      .no-warp {
        margin-top: 2px;
        font-family: siyuanMedium;
      }
      .btn .el-button {
        padding: 4px 5px;
      }
    }
  }
}
.content .his-module .el-form {
  margin: 0px 0px;
}

.form-wrapper {
  height: calc(100% - 45px);
}

.area-title {
  margin-bottom: 10px;
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
.form-area1 {
  // border: 1px solid #ccc;
  .el-form-item {
    margin-left: 16px;
    &:nth-child(odd) {
      margin-left: 0;
    }
  }
}
.form-area2 {
  .area-item {
    float: left;
    width: calc((100% - 16px) / 2);
    margin-left: 8px;
    &:nth-child(odd) {
      margin-left: 0;
    }
    .item-date {
      float: left;
      width: 70%;
    }
    .item-ampm {
      float: left;
      width: calc(30% - 8px);
      margin-left: 4px;
    }
  }
}
.search-select {
  width: 100%;
  margin-right: 0;
}

.item-remark {
  margin-bottom: 0 !important;
  ::v-deep .el-textarea__inner {
    padding: 5px 10px;
  }
}
.statement-box {
  width: 700px;
  // padding: 0 4rem;
}
</style>
