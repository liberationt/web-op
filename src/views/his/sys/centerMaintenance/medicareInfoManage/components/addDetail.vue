// 收费项目明细
<template>
  <el-dialog
    :visible.sync="isVisible"
    title="收费项目明细"
    width="810px"
    :append-to-body="true"
    class="narrow-dialog"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="content his-sys-content">
      <div class="his-module his-small" style="padding: 8px 10px">
        <!-- tab 标签页 -->
        <el-tabs class="tab-small" v-model="activeName">
          <!-- 费用属性 -->
          <el-tab-pane label="费用属性" name="attributeCost">
            <el-form
              :model="addDetailForm"
              ref="infoFormRef"
              label-width="119px"
              class="retrieval"
              :rules="ruleForm"
            >
              <div class="row" style="margin-top: 5px">
                <span class="separatedRegion line">
                  <i class="icon his-detail"></i>基本信息
                </span>
              </div>
              <div class="row" style="border-bottom: none; padding-bottom: 0;margin-bottom: 0">
                <el-row type="flex">
                  <el-form-item label="费用名称" prop="fymc">
                    <el-input v-model="addDetailForm.fymc" placeholder="请输入" @blur="getCodeAttrs"></el-input>
                  </el-form-item>
                  <el-form-item label="费用单位">
                    <el-input v-model="addDetailForm.fydw" placeholder="请输入"></el-input>
                  </el-form-item>
                  <el-form-item label="标准价格">
                    <el-input v-model="addDetailForm.bzjg" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-row>
              </div>
              <div class="row">
                <span class="separatedRegion line">
                  <i class="icon his-detail"></i>代码属性
                </span>
              </div>

              <el-row type="flex">
                <el-form-item label="拼音代码">
                  <el-input v-model="addDetailForm.pydm" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="五笔代码">
                  <el-input v-model="addDetailForm.wbdm" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="角形代码">
                  <el-input v-model="addDetailForm.jxdm" placeholder="请输入"></el-input>
                </el-form-item>
              </el-row>
              <el-row type="flex">
                <el-form-item label="笔画代码">
                  <el-input v-model="addDetailForm.bhdm" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="其他代码">
                  <el-input v-model="addDetailForm.qtdm" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="执行科室">
                  <search-select
                    table-name="SYS_DICT_CONFIG"
                    kid="41"
                    :backfillValue="addDetailForm.zxks"
                    v-model="addDetailForm.zxks"
                    placeholder="请选择"
                  ></search-select>
                </el-form-item>
              </el-row>
              <div class="row">
                <span class="separatedRegion line">
                  <i class="icon his-detail"></i>使用情况
                </span>
              </div>
              <el-row type="flex">
                <el-form-item label="门诊使用">
                  <el-checkbox v-model="addDetailForm.mzsy" true-label="1" false-label="0"></el-checkbox>
                </el-form-item>
                <el-form-item label="住院使用">
                  <el-checkbox v-model="addDetailForm.zysy" true-label="1" false-label="0"></el-checkbox>
                </el-form-item>
                <el-form-item label="医技使用">
                  <el-checkbox v-model="addDetailForm.yjsy" true-label="1" false-label="0"></el-checkbox>
                </el-form-item>
              </el-row>
              <div class="row">
                <span class="separatedRegion line">
                  <i class="icon his-detail"></i>其他属性
                </span>
              </div>
              <el-row type="flex">
                <el-form-item label="项目类型">
                  <search-select
                    table-name="SYS_FLAG_DATA"
                    kid="XM000001"
                    :backfillValue="addDetailForm.xmlx"
                    v-model="addDetailForm.xmlx"
                    placeholder="请输入"
                  ></search-select>
                </el-form-item>
                <el-form-item label="报表归并">
                  <search-select
                    table-name="SYS_DICT_CONFIG"
                    kid="42"
                    :backfillValue="addDetailForm.bbgb"
                    v-model="addDetailForm.bbgb"
                    placeholder="请输入"
                  ></search-select>
                </el-form-item>
                <el-form-item label="项目编码">
                  <el-input v-model="addDetailForm.xmbm" placeholder="请输入"></el-input>
                </el-form-item>
              </el-row>
              <el-row type="flex">
                <el-form-item label="病案首页归并">
                  <el-cascader
                    ref="cascader"
                    :options="options"
                    v-model="addDetailForm.basygb"
                    clearable
                    checkStrictly="true"
                    :show-all-levels="false"
                    :props="{multiple: false,emitPath: false,checkStrictly: true,children: 'children',label: 'label'}"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="黄码编码">
                  <el-input v-model="addDetailForm.hmbm" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="材料对应">
                  <search-select
                    table-name="SYS_DICT_CONFIG"
                    kid="43"
                    v-model="addDetailForm.cldy"
                    placeholder="请输入"
                  ></search-select>
                </el-form-item>
              </el-row>
              <div class="row">
                <span class="separatedRegion line">
                  <i class="icon his-detail"></i>医保信息
                </span>
                
              </div>
              <el-row type="flex">
                <el-form-item label="医保编码">
                  <el-input v-model="addDetailForm.ybbm" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="医保名称">
                  <el-input v-model="addDetailForm.ybmc" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="医保单位">
                  <el-input v-model="addDetailForm.ybdw" placeholder="请输入"></el-input>
                </el-form-item>
              </el-row>
              <el-row type="flex">
                <el-form-item label="医用品牌">
                  <el-input v-model="addDetailForm.yypp" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="注册证号">
                  <el-input v-model="addDetailForm.zczh" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="材料规格">
                  <el-input v-model="addDetailForm.clgg" placeholder="请输入"></el-input>
                </el-form-item>
              </el-row>
              <el-row type="flex">
                <el-form-item label="总限额">
                  <el-input v-model="addDetailForm.zjxe" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="明细标志">
                  <el-checkbox v-model="addDetailForm.mxbz" true-label="1" false-label="0"></el-checkbox>
                </el-form-item>
                <el-form-item label="材料标志">
                  <el-checkbox v-model="addDetailForm.clbz" true-label="1" false-label="0"></el-checkbox>
                </el-form-item>
              </el-row>
            </el-form>
          </el-tab-pane>
          <!-- 费用别名 -->
          <el-tab-pane label="费用别名" name="aliasCost">
            <div class="row">
              <div class="label">
                <div class="btn">
                  <el-button type="text" size="mini" @click="handleAddNews">
                    <i class="icon his-btn-add green"></i>新增
                  </el-button>
                  <el-button type="text" size="mini" @click="handleDelete">
                    <i class="icon his-btn-del red"></i>删除
                  </el-button>
                </div>
              </div>
            </div>
            <el-table
              stripe
              :data="costData"
              border
              :fit="true"
              highlight-current-row
              :height="listSlotHeight/2 + 122"
              class="scroll-bar no-underline"
              tooltip-effect="light"
              :row-class-name="rowClassName"
              :key="keyindex"
            >
              <el-table-column type="index" width="32" align="center"></el-table-column>
              <el-table-column label="费用名称" prop="fymc" show-overflow-tooltip>
                <template slot-scope="scope">
                  <input-box
                    :required="true"
                    v-model="scope.row.fymc"
                    :ref="`${scope.$index}-3`"
                    style="height: 32px"
                    @getData="data => getDrugTableData(data,scope.$index)"
                    @blur="getCode(scope.row)"
                  ></input-box>
                </template>
              </el-table-column>
              <el-table-column label="拼音码" prop="pydm" width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                  <input-box
                    :required="true"
                    v-model="scope.row.pydm"
                    :ref="`${scope.$index}-3`"
                    style="height: 32px"
                    @getData="data => getDrugTableData(data,scope.$index)"
                  ></input-box>
                </template>
              </el-table-column>
              <el-table-column label="五笔码" width="100" prop="wbdm">
                <template slot-scope="scope">
                  <input-box
                    :required="true"
                    v-model="scope.row.wbdm"
                    :ref="`${scope.$index}-3`"
                    style="height: 32px"
                    @getData="data => getDrugTableData(data,scope.$index)"
                  ></input-box>
                </template>
              </el-table-column>
              <el-table-column label="角形码" width="100" prop="jxdm">
                <template slot-scope="scope">
                  <input-box
                    :required="true"
                    v-model="scope.row.jxdm"
                    :ref="`${scope.$index}-3`"
                    style="height: 32px"
                    @getData="data => getDrugTableData(data,scope.$index)"
                  ></input-box>
                </template>
              </el-table-column>
              <el-table-column label="笔画码" width="100" prop="bhdm">
                <template slot-scope="scope">
                  <input-box
                    :required="true"
                    v-model="scope.row.bhdm"
                    :ref="`${scope.$index}-3`"
                    style="height: 32px"
                    @getData="data => getDrugTableData(data,scope.$index)"
                  ></input-box>
                </template>
              </el-table-column>
              <el-table-column label="其他码" width="100" prop="qtdm">
                <template slot-scope="scope">
                  <input-box :required="true" v-model="scope.row.qtdm" style="height: 32px"></input-box>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 费用限制 -->
          <el-tab-pane label="费用限制" name="limitCost">
            <el-row class="ht">
              <el-col class="ht" :span="12">
                <el-table
                  stripe
                  :data="limitTableData1"
                  border
                  :height="listSlotHeight/2 + 188"
                  class="scroll-bar his-sys-limit input-table"
                  tooltip-effect="light"
                  highlight-current-row
                >
                  <el-table-column type="index" width="32" align="center"></el-table-column>
                  <el-table-column label="性质名称" prop="xzmc" show-overflow-tooltip></el-table-column>
                  <el-table-column label="自负比例%" prop="zfbl" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.zfbl"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col class="ht" :span="12">
                <el-table
                  stripe
                  :data="limitTableData2"
                  border
                  :height="listSlotHeight/2 + 188"
                  class="scroll-bar his-sys-limit input-table"
                  tooltip-effect="light"
                >
                  <el-table-column type="index" :index="indexSort" width="32" align="center"></el-table-column>
                  <el-table-column label="性质名称" prop="xzmc" show-overflow-tooltip></el-table-column>
                  <el-table-column label="自负比例%" prop="zfbl" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.zfbl"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { log } from 'util'
import { Form } from 'element-ui'
import { costLimit, getMnemonic, saveDetailProject, costAliasList } from '@/api/his/sys/centerMaintenance/medicareInfoManage/payService.ts'
import { rightScroll, id2Name } from '@/utils/index.ts'

// 命名文件名称，过滤器什么的都在这里写
@Component({
  name: 'addDetail',
  components: {}
})
export default class extends Vue {
  @Prop({ required: false, default: 0 }) private FYXH!: number
  @Prop({ required: false, default: null }) private editFormData!: any
  @Prop({ required: false, default: true }) private addFlag!: boolean
  private activeName: string = 'attributeCost' // 默认显示费用属性
  private isVisible: boolean = false // 明细新增弹框默认隐藏
  private searchData: any = {}
  private costData: Array<any> = []
  private listSlotHeight: number = 0
  private value: any = ''
  private checkList: Array<any> = []
  private limitTableData: Array<any> = [] // 费用限制数组
  private limitTableData1: Array<any> = [] // 费用限制数组1
  private limitTableData2: Array<any> = [] // 费用限制数组2
  private selectRightRow: number | null = null
  private keyindex: number = 1
  private addDetailForm: any = {
    fymc: '',
    fydw: '',
    bzjg: null,
    pydm: '',
    wbdm: '',
    jxdm: '',
    bhdm: '',
    qtdm: '',
    zxks: '',
    mzsy: '1',
    zysy: '1',
    yjsy: '',
    xmlx: '',
    bbgb: '',
    xmbm: '',
    basygb: '',
    hmbm: '',
    cldy: '',
    ybbm: '',
    ybmc: '',
    ybdw: '',
    yypp: '',
    zczh: '',
    clgg: '',
    zjxe: '',
    mxbz: '',
    clbz: '',
    yfgb: null,
    zfpb:0,
    tjfy: 0,
    txzl: 0,
  }
  private options: Array<any> = [
    {
      label: '综合医疗服务类',
      value: '1',
      children: [
        { label: '一般医疗服务费', value: '11' },
        { label: '中医辨证论治费', value: '111' },
        { label: '中医辨证论治会诊费', value: '112' },
        { label: '一般治疗操作费', value: '12' },
        { label: '护理费', value: '13' },
        { label: '其他费用', value: '14' }
      ]
    },
    {
      label: '诊断类',
      value: '2',
      children: [
        { label: '病理诊断费', value: '21' },
        { label: '实验室诊断费', value: '22' },
        { label: '影像学诊断费', value: '23' },
        { label: '临床诊断项目费', value: '24' }
      ]
    },
    {
      label: '治疗类',
      value: '3',
      children: [
        { label: '非手术治疗项目费', value: '31' },
        { label: '临床物理治疗费', value: '311' },
        { label: '手术治疗费', value: '32' },
        { label: '麻醉费', value: '321' },
        { label: '手术费', value: '322' }
      ]
    },
    {
      label: '康复费',
      value: '4',
      children: [{ label: '康复费', value: '4' }]
    },
    {
      label: '中医类',
      value: '5',
      children: [
        { label: '中医诊断', value: '51' },
        { label: '中医治疗', value: '52' },
        { label: '中医外治', value: '521' },
        { label: '中医骨伤', value: '522' },
        { label: '针刺与灸法', value: '523' },
        { label: '中医推拿治疗', value: '524' },
        { label: '中医肛肠治疗', value: '525' },
        { label: '中医特殊治疗', value: '526' },
        { label: '中医其他', value: '53' },
        { label: '中药特殊调配加工', value: '531' },
        { label: '辨证施膳', value: '532' }
      ]
    },
    {
      label: '西药类',
      value: '6',
      children: [
        { label: '西药费', value: '61' },
        { label: '抗菌药物费用', value: '62' }
      ]
    },
    {
      label: '中药类',
      value: '7',
      children: [
        { label: '中成药费', value: '71' },
        { label: '医疗机构中药制剂费', value: '711' },
        { label: '中草药费', value: '72' }
      ]
    },
    {
      label: '血液和血液制品类',
      value: '8',
      children: [
        { label: '血费', value: '81' },
        { label: '白蛋白类制品费', value: '82' },
        { label: '球蛋白类制品费', value: '83' },
        { label: '凝血因子类制品费', value: '84' },
        { label: '细胞因子类制品费', value: '85' }
      ]
    },
    {
      label: '耗材类',
      value: '9',
      children: [
        { label: '检查用一次性医用材料费', value: '91' },
        { label: '治疗用一次性医用材料费', value: '92' },
        { label: '手术用一次性医用材料费', value: '93' }
      ]
    },
    {
      label: '其他费',
      value: '99',
      children: [{ label: '其他费', value: '99' }]
    }
  ] // 病案首页归并
  private ruleForm: any = {
    fymc: [{ required: true, message: ' ', trigger: 'blur' }]
  } // 表单验证
  private aliasPageTable: Array<any> = []
  // 显示新增收费项目明细弹框
  private showAddDialog() {
    console.log(this.$attrs)
    this.isVisible = true
    this.$nextTick(() => {
      this.getCostLimitData()
    })
  }

  // 获取代码属性
  private getCodeAttrs() {
    if (this.addDetailForm.fymc) {
      getMnemonic({ typeList: ['py', 'wb'], value: this.addDetailForm.fymc }).then((res: any) => {
        console.log(res)
        if (res) {
          this.addDetailForm.pydm = res.data.py
          this.addDetailForm.wbdm = res.data.wb
        }
      })
    } else {
      this.addDetailForm.pydm = null
      this.addDetailForm.wbdm = null
    }
  }

  // 显示修改收费明细弹框
  private showEditDialog() {
    this.isVisible = true
    this.getCostAlias()
    this.getCostLimitData()
    // this.$nextTick(()=>{
    this.addDetailForm = Object.assign({}, this.editFormData)
    // })

    if (this.addDetailForm.mzsy == 1) {
      this.addDetailForm.mzsy = true
    } else {
      this.addDetailForm.mzsy = false
    }
    if (this.addDetailForm.zysy == 1) {
      this.addDetailForm.zysy = true
    } else {
      this.addDetailForm.zysy = false
    }
    if (this.addDetailForm.yjsy == 1) {
      this.addDetailForm.yjsy = true
    } else {
      this.addDetailForm.yjsy = false
    }
    if (this.addDetailForm.mxbz == 1) {
      this.addDetailForm.mxbz = true
    } else {
      this.addDetailForm.mxbz = false
    }
    if (this.addDetailForm.clbz == 1) {
      this.addDetailForm.clbz = true
    } else {
      this.addDetailForm.clbz = false
    }
  }

  // 获取费用别名数据
  private getCostAlias() {
    const params: any = {
      fyxh: this.FYXH,
      pageNum: 1,
      pageSize: 100
    }
    costAliasList(params).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        console.log(res)
        this.costData = Object.assign(this.costData, res.data.list)
        console.log(this.costData)
        this.keyindex++
      }
    })
  }

  // 获取全部费用限制数据
  private getCostLimitData() {
    costLimit({ fyxh: this.FYXH }).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        console.log(res)
        this.limitTableData = res.data
        this.averageData(this.limitTableData)
      }
    })
  }

  //把每一行的索引放进row
  private rowClassName({ row, rowIndex }: any) {
    row.drugRowIndex = rowIndex
  }

  // 均分数据
  private averageData(data: any) {
    if (data.length % 2 == 1) {
      this.limitTableData1 = []
      this.limitTableData2 = []
      for (let i = 0; i < (data.length + 1) / 2; i++) {
        this.limitTableData1.push(data[i])
      }
      for (let j = (data.length + 1) / 2; j < data.length; j++) {
        this.limitTableData2.push(data[j])
      }
    } else {
      this.limitTableData1 = []
      this.limitTableData2 = []
      for (let i = 0; i < data.length / 2; i++) {
        this.limitTableData1.push(data[i])
      }
      for (let j = data.length / 2; j < data.length; j++) {
        this.limitTableData2.push(data[j])
      }
    }
  }

  // 新增费用别名
  private handleAddNews() {
    if (this.costData.length > 0) {
      let oldRowData = this.costData[this.costData.length - 1]
      if (oldRowData.fymc) {
        this.costData = [...this.costData, { pydm: '', wbdm: '' }]
      }
    } else {
      this.costData = [...this.costData, { pydm: '', wbdm: '' }]
    }
    this.selectRightRow = this.costData.length - 1
  }
  private getDrugTableData(val: any, index: number) {
    console.log(val)
    this.$set(this.costData, index, { ...val, pydm: val.pydm, wbdm: val.wbdm, jxdm: val.jxdm, bhdm: val.bhdm, qtdm: val.qtdm })
  }

  // 费用调价单详情删除
  private handleDelete() {
    if (this.selectRightRow != null && this.selectRightRow >= 0) {
      this.costData.splice(this.selectRightRow, 1)
      this.selectRightRow = this.costData.length - 1
    }
  }

  // 获取拼音码与五笔码
  private getCode(row: any) {
    if (row.fymc) {
      getMnemonic({ typeList: ['py', 'wb'], value: row.fymc }).then((res: any) => {
        console.log(res)
        if (res) {
          row.pydm = res.data.py
          row.wbdm = res.data.wb
          console.log(row)
        }
      })
    } else {
      row.pydm = null
      row.wbdm = null
    }
  }

  // 保存新增收费项目明细
  private handleSave() {
    ;(this.$refs.infoFormRef as Form).validate((valid: boolean) => {
      if (valid) {
        if (this.addDetailForm.mzsy == true) {
          this.addDetailForm.mzsy = 1
        } else {
          this.addDetailForm.mzsy = 0
        }
        if (this.addDetailForm.zysy == true) {
          this.addDetailForm.zysy = 1
        } else {
          this.addDetailForm.zysy = 0
        }
        if (this.addDetailForm.yjsy == true) {
          this.addDetailForm.yjsy = 1
        } else {
          this.addDetailForm.yjsy = 0
        }
        if (this.addDetailForm.mxbz == true) {
          this.addDetailForm.mxbz = 1
        } else {
          this.addDetailForm.mxbz = 0
        }
        if (this.addDetailForm.clbz == true) {
          this.addDetailForm.clbz = 1
        } else {
          this.addDetailForm.clbz = 0
        }
        this.addDetailForm.fygb = this.$attrs.FYGB
        if (this.costData.length == 0) {
          this.costData.push({
            bmfl: 1,
            fymc: this.addDetailForm.fymc,
            pydm: this.addDetailForm.pydm
          })
        }
        const params: any = {
          pubFybmBodyList: this.costData,
          pubFyxzBodyList: this.limitTableData,
          feeYlsfxmBody: this.addDetailForm
        }
        saveDetailProject(params).then((res: any) => {
          if (res.errorCode === 'SUCCESS') {
            console.log(res)
            this.$notify({
              title: '保存成功',
              message: '',
              type: 'success'
            })
            this.$emit('saveSuc')
            this.isVisible = false
            this.addDetailForm = {
              fymc: '',
              fydw: '',
              bzjg: null,
              pydm: '',
              wbdm: '',
              jxdm: '',
              bhdm: '',
              qtdm: '',
              zxks: '',
              mzsy: '1',
              zysy: '1',
              yjsy: '',
              xmlx: '',
              bbgb: '',
              xmbm: '',
              basygb: '',
              hmbm: '',
              cldy: '',
              ybbm: '',
              ybmc: '',
              ybdw: '',
              yypp: '',
              zczh: '',
              clgg: '',
              zjxe: '',
              mxbz: '',
              clbz: '',
              yfgb: null
            }
            this.costData = []
          }
        })
      }
    })
  }

  // 弹框关闭事件
  private handleClose() {
    this.addDetailForm = {
      fymc: '',
      fydw: '',
      bzjg: null,
      pydm: '',
      wbdm: '',
      jxdm: '',
      bhdm: '',
      qtdm: '',
      zxks: '',
      mzsy: '1',
      zysy: '1',
      yjsy: '',
      xmlx: '',
      bbgb: '',
      xmbm: '',
      basygb: '',
      hmbm: '',
      cldy: '',
      ybbm: '',
      ybmc: '',
      ybdw: '',
      yypp: '',
      zczh: '',
      clgg: '',
      zjxe: '',
      mxbz: '',
      clbz: '',
      yfgb: null
    }
    this.costData = []
  }

  // 计算排列顺序
  private indexSort(index: any) {
    return index + this.limitTableData1.length + 1
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    console.log(this.$store.state.webSqlDict.PATIENT_NATURE_DICT)
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/inputTable.scss';
.content {
  background: #fff;
  height: 565px;
  border-radius: 8px;
}

.his-module.his-small {
  padding: 0 0 8px !important;
}
.row .label .el-input {
  width: 190px;
}

.el-dialog__wrapper.narrow-dialog .el-dialog__body .row {
  padding: 0;
}

::v-deep .tab-small .el-tabs__header {
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 5px;
}

.row .line {
  height: 29px;
  line-height: 29px;
  padding-bottom: 9px;
}

// 右侧表单样式分布
.content .his-small .retrieval .el-row .el-form-item {
  width: calc(33.333% - 8px);
}
.content .his-small .retrieval {
  margin: 0;
  width: 100%;
}

::v-deep .his-sys-limit.el-table::before {
  height: 0;
}
</style>