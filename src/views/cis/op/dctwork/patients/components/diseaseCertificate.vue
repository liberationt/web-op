<!--
 * @Author: dl
 * @Date: 2021-03-30 15:00:33
 * @LastEditTime: 2021-04-21 14:20:13
 * @LastEditors: dl
 * @Description: 打印功能接口联调
 * @FilePath: \web-op\src\views\cis\op\dctwork\patients\components\diseaseCertificate.vue
-->
<template>
  <div class="content ht scroll-bar his-proof">
    <el-row class="ht" :gutter="10" style="width: calc(100% + 5px)">
      <el-col class="ht" :span="14">
        <div class="his-module his-small ht">
          <pagenation-list ref="pageTable" v-model="mockDatas" data-url="/op-service/cisjbzm/queryJbzm" http-method="post" :list-height="listSlotHeight" class="ht" :searchData="searchData" :dataNum="1">
            <div slot="header">
              <div class="row">
                <div class="label">
                  <div class="querySearch">
                    <div class="searchTitle no-warp" style="padding-right: 2px">疾病证明单</div>
                  </div>
                  <div class="btn">
                    <el-divider direction="vertical"></el-divider>
                    <el-button size="mini" type="text" @click="reset">
                      <i class="icon his-btn-add green"></i>
                      {{ $t('common.add') }}
                    </el-button>
                    <!-- 刷新 -->
                    <el-button size="mini" type="text" @click="getLists">
                      <i class="icon his-btn-refresh"></i>
                      {{ $t('common.refresh') }}
                    </el-button>

                    <!-- 打印 -->
                    <el-button type="text" @click="printFn">
                      <i class="his-btn-print icon"></i>
                      {{ $t('common.print') }}
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
            <el-table :data="getTable" border :fit="true" stripe :highlight-current-row="true" slot="list" @row-click="handleRowClick" :row-class-name="tableRowClassName" class="scroll-bar" :height="listSlotHeight" style="width: 100%">
              <el-table-column prop="webSortNumber" width="32"></el-table-column>
              <el-table-column prop="cardno" :label="'卡号'" :show-overflow-tooltip="true" width="80"></el-table-column>
              <el-table-column prop="sfzh" width="140" :label="'身份证号'" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column width="50px" prop="brxm" :label="'姓名'"></el-table-column>
              <el-table-column width="50px" prop="brxbName" :label="'性别'" />
              <el-table-column width="140" v-if="patientFile.zyhm" prop="ryrq" :label="'入院日期'" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column v-else prop="jzrq" :label="'就诊日期'" :show-overflow-tooltip="true" min-width="90"></el-table-column>
              <el-table-column width="80px" prop="jzysName" :label="'接诊医生'" />
              <el-table-column width="80px" prop="jzksName" :label="'接诊科室'" />
              <el-table-column width="150" prop="brzd" :label="'诊断'" />
              <el-table-column width="80px" prop="jyz" :label="'医生建议'">
                <template slot-scope="scope">
                  {{ scope.row.jylx == 2 ? '休假' + scope.row.jyz + '天' : scope.row.jylx == 3 ? '休学' + scope.row.jyz + '学期' : scope.row.jylx == 4 ? scope.row.jyz : '免修体育课' }}
                </template>
              </el-table-column>
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
      <el-col class="ht" :span="10" style="padding-right: 0px">
        <div class="his-module his-small ht">
          <div slot="header" class="row">
            <div class="label">
              <h1 class="title">{{ isCreateNew ? $t('common.add') : $t('common.edit') }}</h1>
            </div>
            <div class="operate">
              <el-button type="primary" size="mini" class="green-gra" icon="icon his-save" v-preventReClick @click="handleSave">{{ $t('common.save') }}</el-button>
            </div>
          </div>
          <el-form ref="formData" :model="formData" label-width="68px" class="form-wrapper scroll-bar">
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
              <i class="icon his-jianyi"></i>
              <span>医生建议</span>
            </div>
            <div class="his-advice" style="width: 100%">
              <div class="row" style="border-bottom: none">
                <div class="label">
                  <el-radio v-model="formData.jylx" label="1" @change="getYsjy" class="radioAdvice">免修体育课</el-radio>
                  <!-- <div> -->
                  <el-radio v-model="formData.jylx" label="2" @change="getYsjy">休假天数</el-radio>
                  <el-input v-model="xjts" style="width: 100%; margin-right: 10px" :disabled="this.formData.jylx != 2" type="number"></el-input>
                  <!-- </div> -->
                  <!-- <div> -->
                  <el-radio v-model="formData.jylx" label="3" @change="getYsjy">休学学期数</el-radio>
                  <el-input v-model="xxxqs" style="width: 100%" :disabled="this.formData.jylx != 3" type="number"></el-input>
                  <!-- </div> -->
                </div>
              </div>
              <div class="radioOther">
                <el-radio class="other" v-model="formData.jylx" label="4" @change="getYsjy">其他</el-radio>
                <el-input class="other" v-model="qtz" type="textarea" :rows="3" :disabled="this.formData.jylx != 4" placeholder="请填写其他内容"></el-input>
              </div>
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { saveDisease, deleteDisease, getJbzmPrintData, queryLogo } from '@/api/cis/op/dctwork/proofillness'
import { Form } from 'element-ui'
import dayjs from 'dayjs'
import { id2Name, deepCopy } from '@/utils'
import { getNow } from '@/api/his/basic' //获取当前时间（时间戳）
import { getLodop } from '@/plugins/lodop/index.js'
//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'diseaseCertificate',
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
  private rowIndex: number = -1
  private sexChoice: Array<any> = [] //性别
  private doctorList: Array<any> = [] //接诊医生
  private departMent: Array<any> = [] //接诊科室
  private htmlSearchData: any = {}
  private bqId: any = '' // 储存当前行的病情id
  private printData: any = '' // 打印时所需字段
  private xjts: any = '' // 休假天数
  private xxxqs: any = '' // 休学学期数
  private qtz: any = '' // 其他（备注）
  private logo: any = '' // 动态logo
  private formData: any = {
    bqid: '',
    brxb: '',
    brxm: '',
    brzd: '',
    cardno: '',
    jylx: '',
    jyz: '',
    jzks: Vue.prototype.AUTHORITY.outpatientCode,
    jzlsh: '',
    jzrq: '',
    lx: 1,
    mzhm: '',
    sfzh: '',
  }
  private searchData: any = {
    lx: 1, //门诊,住院
    jzlsh: '', //门诊号码
    zyhm: '', //住院号码
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 214
  }
  mounted() {
    console.log(174, this.patientFile)
    this.pnParam = this.$store.state.pnParam.PN_PARAM
    this.formData.brzd = this.patientFile.fymc
    this.searchData.jzlsh = this.pnParam.jzlsh
    this.searchData.zyhm = this.patientFile.zyhm
    this.sexChoice = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT
    this.doctorList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.departMent = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.OUTPATIENT_DEPARTMENT : this.$store.state.webSqlDict.OUTPATIENT_DEPARTMENT
    this.getLists()
  }

  //数据交互
  private tableRowClassName({ row, rowIndex }: any) {
    row.index = rowIndex
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

  // 新增
  private handleAdd() {
    this.isCreateNew = true
  }

  //重置表单
  private reset() {
    this.formData = {
      bqid: '',
      brxb: '',
      brxm: '',
      brzd: this.patientFile.fymc,
      cardno: '',
      jylx: '',
      jyz: '',
      jzks: Vue.prototype.AUTHORITY.outpatientCode,
      jzlsh: '',
      jzrq: '',
      lx: 1,
      mzhm: '',
      sfzh: '',
    }
    this.qtz = ''
    this.xxxqs = ''
    this.xjts = ''
  }
  //获取数据
  private getLists() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }
  //点击行
  private handleRowClick(item: any) {
    this.bqId = item.bqid
    this.rowIndex = item.index
    this.isCreateNew = false
    console.log(item)
    this.formData = JSON.parse(JSON.stringify(item))
    if (this.formData.jylx == 2) {
      this.xjts = this.formData.jyz
    } else if (this.formData.jylx == 3) {
      this.xxxqs = this.formData.jyz
    } else if (this.formData.jylx == 4) {
      this.qtz = this.formData.jyz
    }
  }

  // 删除操作
  private handleDelete(val: any) {
    deleteDisease({ bqid: val.bqid }).then(() => {
      this.$notify.success('删除成功')
      this.getLists()
      this.reset()
    })
  }

  // 切换医生建议清空建议值
  private getYsjy(val: any) {
    if (val == 1) {
      this.xjts = ''
      this.xxxqs = ''
      this.qtz = ''
    } else if (val == 2) {
      this.xxxqs = ''
      this.qtz = ''
    } else if (val == 3) {
      this.xjts = ''
      this.qtz = ''
    } else {
      this.xjts = ''
      this.xxxqs = ''
    }
  }

  //保存
  private handleSave() {
    this.formData.brxb = this.patientFile.brxb
    this.formData.brxm = this.patientFile.brxm
    this.formData.cardno = this.patientFile.jzkh
    this.formData.jzks = Vue.prototype.AUTHORITY.outpatientCode
    this.formData.jzlsh = this.pnParam.jzlsh
    this.formData.jzrq = this.patientFile.jzrq
    this.formData.sfzh = this.patientFile.sfzh
    this.formData.mzhm = this.patientFile.mzhm
    console.log(this.formData.jylx)
    if (!this.formData.jylx) return this.$message.warning('请先选择医生建议后再保存！')
    if (this.formData.jylx == 2) {
      this.formData.jyz = this.xjts
    } else if (this.formData.jylx == 3) {
      this.formData.jyz = this.xxxqs
    } else if (this.formData.jylx == 4) {
      this.formData.jyz = this.qtz
    }
    saveDisease(this.formData).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.$notify({ title: this.isCreateNew ? '新增成功' : '修改成功', message: '', type: 'success' })
        this.getLists()
        this.reset()
      }
    })
  }
  get titleContent() {
    return `<div style="display: flex; width: 204mm; height:19mm; margin: 0 auto; justify-content: space-between; padding-left: 1mm; padding-right: 1mm">
              <img src=${this.logo} style="height:60%; margin-top:3mm;padding-left:3mm;"/>
              <span style="margin-top: 11mm">HL-BD-0010-003</span>
            </div>`
  }
  // 打印表格
  get tableContent() {
    return `<div style="width: 720px; margin: 0 auto; height: 460px; border: 1px solid #000; position: relative">
            <div style="display: flex; position: absolute; right: 18px; top: 80px">
              <p>No：</p>
              <p style="border-bottom: 1px solid #000; width: 180px; text-align: center;">${this.printData.bh || ''}</p>
            </div>
            <div style="display: flex; justify-content: space-between; width: 80%; padding-left: 15px; position: absolute; top: 130px">
              <div style="display: flex">
                <p>姓名：</p>
                <p style="border-bottom: 1px solid #000; width: 100px; text-align: center;">${this.printData.xm || ''}</p>
              </div>
              <div style="display: flex">
                <p>性别：</p>
                <p style="border-bottom: 1px solid #000; width: 100px; text-align: center;">${this.printData.xb || ''}</p>
              </div>
              <div style="display: flex">
                <p>年龄：</p>
                <p style="border-bottom: 1px solid #000; width: 100px; text-align: center;">${this.printData.nl || ''}</p>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; width: 95%; padding-left: 15px; position: absolute; top: 170px">
              <div style="display: flex">
                <p>科别：</p>
                <p style="border-bottom: 1px solid #000; width: 100px; text-align: center;">${this.printData.ksmc || ''}</p>
              </div>
              <div style="display: flex">
                <p>门诊号：</p>
                <p style="border-bottom: 1px solid #000; width: 120px; text-align: center;">${this.printData.mzh || ''}</p>
              </div>
              <div style="display: flex">
                <p>就诊日期：</p>
                <p style="border-bottom: 1px solid #000; width: 180px; text-align: center;">${this.printData.jzrq || ''}</p>
              </div>
            </div>
            <div style="display: flex; padding-left: 15px; position: absolute; top: 210px">
              <p>疾病诊断</p>
              <p style="padding-left: 10px; font-size: 15px">${this.printData.zd || ''}</p>
            </div>
            <div style="display: flex; width: 95%; padding-left: 30px; position: absolute; top: 240px">
              <p>建议：</p>
              <div style="display: flex; justify-content: space-between; width: 60%; margin-left: 20px">
                <div style="display: flex">
                  <p style="width: 16px; height: 16px; border: 1px solid #000; margin-right: 5px; margin-top: 2px; text-align: center;">${this.printData.jylx == 1 ? `√` : ''}</p>
                  <p>免修体育课</p>
                </div>
                <div style="display: flex">
                  <p style="width: 16px; height: 16px; border: 1px solid #000; margin-right: 5px; margin-top: 2px; text-align: center;">${this.printData.jylx == 2 ? `√` : ''}</p>
                  <p>
                    休假<span style="border-bottom: 1px solid #000; padding: 0 5px">${this.printData.jylx == 2 ? this.printData.jyz : ''}</span>
                    天
                  </p>
                </div>
                <div style="display: flex">
                  <p style="width: 16px; height: 16px; border: 1px solid #000; margin-right: 5px; margin-top: 2px; text-align: center;">${this.printData.jylx == 3 ? '√' : ''}</p>
                  <p>
                    休学<span style="border-bottom: 1px solid #000; padding: 0 5px">${this.printData.jylx == 3 ? this.printData.jyz : ''}</span>
                    学期
                  </p>
                </div>
              </div>
            </div>
            <div style="display: flex; padding-left: 110px; position: absolute; top: 270px">
              <p>其他：</p>
              <p>${this.printData.jylx == 4 ? this.printData.jyz : ''}</p>
            </div>
            <div style="display: flex; position: absolute; right: 18px; top: 360px">
              <p>主治医生：</p>
              <p style="border-bottom: 1px solid #000; width: 110px; text-align: center;">${this.printData.zzys}</p>
            </div>
            <div style="display: flex; position: absolute; right: 18px; top: 390px">
              <p style="width: 45px; text-align: center">${this.printData.zmsj_n}</p>
              <p>年</p>
              <p style="width: 35px; text-align: center">${this.printData.zmsj_y}</p>
              <p>月</p>
              <p style="width: 35px; text-align: center">${this.printData.zmsj_r}</p>
              <p>日</p>
            </div>
            <div style="position: absolute; bottom: 10px; padding-left: 15px; font-size: 13px">
              <p>注：本证明必须加盖本院公章有效：</p>
              <p style="padding-left: 20px">本证明只限疾病，涂改无效，不作他用</p>
            </div>
          </div>`
  }
  // 打印方法
  private async printFn() {
    if (this.rowIndex == -1) {
      this.$notify.error('请选择病情证明单打印')
      return
    }
    let hospitalId = JSON.parse(localStorage.userInfo).hospitalId
    await queryLogo({ hospitalId }).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        if (res.data) {
          this.logo = res.data
        }
      }
    })
    await getJbzmPrintData({ bqid: this.bqId }).then((res: any) => {
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
      LODOP.PRINT_INIT('疾病证明单')
      LODOP.SET_PRINT_PAGESIZE(1, '210mm', '297mm', 'A4') // 2-打印方向及纸张类型,

      // 测试只有表格
      // LODOP.ADD_PRINT_URL('0','0', '297mm', '210mm', tableDataUrl)
      // LODOP.PREVIEW() // 预览
      // return

      // LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true) //宽度超出自动缩放
      LODOP.ADD_PRINT_HTM('8mm', 0, '210', '20mm', this.titleContent) // 头部logo

      LODOP.ADD_PRINT_LINE('26mm', '3mm', '26mm', '207mm', 0, 1)

      LODOP.ADD_PRINT_TEXT('31mm', 0, '210mm', '8mm', '疾病证明单') // 标题名
      LODOP.SET_PRINT_STYLEA(0, 'FontName', '宋体')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 20)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.SET_PRINT_STYLEA(0, 'Horient', 2)
      LODOP.ADD_PRINT_HTML(
        '45mm',
        '8mm',
        'RightMargin:0mm',
        '248mm',
        `<html><style>
        *{
          margin: 0;
          padding: 0;
        }
      </style><body>${this.tableContent}</body></html>`
      )

      LODOP.SET_PRINT_MODE('POS_BASEON_PAPER', true) // 以纸张边缘为基点
      LODOP.PREVIEW() // 预览
      // LODOP.PRINT() // 打印
      // LODOP.PRINT_DESIGN() // 设计
    }
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
.radioOther {
  width: 85%;
}
.el-textarea {
  position: absolute;
  top: 40px;
  right: -40;
}
::v-deep .el-textarea__inner {
  width: 87%;
  border: none;
}
.his-advice {
  position: relative;
}
</style>
