// 医疗项目
<template>
  <div>
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="15">
        <div class="his-module his-small" style="padding: 8px 10px">
          <div class="row">
            <div class="label">
              <div style="font-size: 13px; margin-right: 8px;">搜索</div>
              <el-input
                v-model="searchData.pydm"
                placeholder="请输入拼音码"
                clearable
                @keyup.native.enter="searchList"
                @clear="searchList"
              >
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input>
              <div class="btn">
                <el-button type="text" size="mini" @click="handleDetail">
                  <i class="icon his-caozuo_binglishuxie"></i>明细
                </el-button>
                <el-button type="text" size="mini" @click="handleMerger">
                  <i class="icon his-append"></i>项目归并
                </el-button>
              </div>
            </div>
            <div class="operate">
              <el-button
                size="mini"
                type="primary"
                class="blue-gra"
                icon="icon his-add"
                @click="handleAdd"
              >{{$t('common.add')}}</el-button>
            </div>
          </div>
          <pagenation-list
            ref="pageTable"
            data-url="/op-service/dicsfxmlb/queryMedicalProject"
            http-method="post"
            v-model="tableData"
            :searchData="searchData"
            :list-height="listSlotHeight"
          >
            <el-table
              slot="list"
              stripe
              :data="tableData"
              border
              highlight-current-row
              :height="listSlotHeight-158"
              class="scroll-bar"
              tooltip-effect="light"
              @row-click="getRowData"
              @row-dblclick="handleDetail"
            >
              <el-table-column type="index" width="32" align="center"></el-table-column>
              <el-table-column label="名称" prop="sfmc" width="90" show-overflow-tooltip></el-table-column>
              <el-table-column label="缩写" prop="mcsx" width="90" show-overflow-tooltip></el-table-column>
              <el-table-column label="门诊使用" prop="mzsy" width="70px" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div
                    :class="[scope.row.mzsy == '1' ? 'blues' : 'reds']"
                  >{{scope.row.mzsy == '1' ? '是' : '否'}}</div>
                </template>
              </el-table-column>
              <el-table-column label="医保门诊项目" prop="ybmzxm" min-width="95">
                <template slot-scope="scope">
                  <div>
                    {{$store.state.webSqlDict.YBMZ_USING_DICT.find(item => item.dv == scope.row.ybmzxm) &&
                    $store.state.webSqlDict.YBMZ_USING_DICT.find(item => item.dv == scope.row.ybmzxm).dn}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="住院使用" prop="zysy" width="70px">
                <template slot-scope="scope">
                  <div
                    :class="[scope.row.zysy == '1' ? 'blues' : 'reds']"
                  >{{scope.row.zysy == '1' ? '是' : '否'}}</div>
                </template>
              </el-table-column>
              <el-table-column label="医保住院项目" prop="ybzyxm" min-width="95">
                <template slot-scope="scope">
                  <div>
                    {{$store.state.webSqlDict.YBZY_USING_DICT.find(item => item.dv == scope.row.ybzyxm) &&
                    $store.state.webSqlDict.YBZY_USING_DICT.find(item => item.dv == scope.row.ybzyxm).dn}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="归并项目" prop="fylb" width="90" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    {{$store.state.webSqlDict.COST_CONSOLIDATION.find(item => item.dv == scope.row.fylb) &&
                    $store.state.webSqlDict.COST_CONSOLIDATION.find(item => item.dv == scope.row.fylb).dn}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="门诊归并" prop="mzgb" width="90" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    {{$store.state.webSqlDict.COST_CONSOLIDATION.find(item => item.dv == scope.row.mzgb) &&
                    $store.state.webSqlDict.COST_CONSOLIDATION.find(item => item.dv == scope.row.mzgb).dn}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="住院归并" prop="zygb" width="90" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    {{$store.state.webSqlDict.COST_CONSOLIDATION.find(item => item.dv == scope.row.zygb) &&
                    $store.state.webSqlDict.COST_CONSOLIDATION.find(item => item.dv == scope.row.zygb).dn}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="病案首页归并" prop="basygb" width="100px"></el-table-column>
              <el-table-column label="顺序号" prop="plsx" width="60" show-overflow-tooltip></el-table-column>
              <el-table-column label="住院顺序号" prop="zypl" width="85px"></el-table-column>
              <el-table-column label="门诊顺序号" prop="mzpl" width="85px"></el-table-column>
              <el-table-column label="拼音码" prop="pydm" width="70px"></el-table-column>
              <el-table-column label="英文名称" prop="ywmc" width="70px"></el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col class="ht" :span="9">
        <div
          class="his-module his-small his-sys-module"
          :style="{ height: listSlotHeight - 65 + 'px'}"
        >
          <div slot="header" class="row">
            <div class="label">
              <h1 class="title">{{ isUpd ? $t('common.add') : $t('common.edit')}}</h1>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                class="green-gra"
                icon="icon his-save"
                @click="handleSave"
                size="mini"
              >{{$t('common.save')}}</el-button>
            </div>
          </div>
          <div class="row">
            <span class="line">
              <i class="icon his-detail"></i>基本信息
            </span>
          </div>
          <div class="row" style="border-bottom: none; padding-bottom: 0;margin-bottom: 0">
            <el-form
              :model="addFormData"
              ref="addFormDataRef"
              class="retrieval"
              label-width="86px"
              :rules="addFormRule"
            >
              <el-row type="flex">
                <el-form-item label="名称" prop="sfmc">
                  <el-input v-model="addFormData.sfmc" placeholder="请输入" @blur="getPinyin"></el-input>
                </el-form-item>
                <el-form-item label="缩写" prop="mcsx">
                  <el-input v-model="addFormData.mcsx" placeholder="请输入"></el-input>
                </el-form-item>
              </el-row>
              <el-row type="flex">
                <el-form-item label="顺序号" prop="plsx">
                  <el-input v-model="addFormData.plsx" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="门诊使用" prop="mzsy">
                  <search-select
                    v-model="addFormData.mzsy"
                    placeholder="请选择"
                    table-name="SYS_FLAG_DATA"
                    kid="FD000005"
                    :backfillValue="addFormData.mzsy"
                    :clearable="false"
                  ></search-select>
                </el-form-item>
              </el-row>
              <el-row type="flex">
                <el-form-item label="门诊顺序号" prop="mzpl">
                  <el-input v-model="addFormData.mzpl" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="医保门诊项目" prop="ybmzxm">
                  <search-select
                    v-model="addFormData.ybmzxm"
                    placeholder="请选择"
                    table-name="SYS_DICT_CONFIG"
                    kid="65"
                    :backfillValue="addFormData.ybmzxm"
                  ></search-select>
                </el-form-item>
              </el-row>
              <el-row type="flex">
                <el-form-item label="住院使用" prop="zysy">
                  <search-select
                    v-model="addFormData.zysy"
                    placeholder="请选择"
                    table-name="SYS_FLAG_DATA"
                    kid="FD000005"
                    :backfillValue="addFormData.zysy"
                    :clearable="false"
                  ></search-select>
                </el-form-item>
                <el-form-item label="住院顺序号" prop="zypl">
                  <el-input v-model="addFormData.zypl" placeholder="请输入"></el-input>
                </el-form-item>
              </el-row>
              <el-row type="flex">
                <el-form-item label="医保住院项目" prop="ybzyxm">
                  <search-select
                    v-model="addFormData.ybzyxm"
                    placeholder="请选择"
                    table-name="SYS_DICT_CONFIG"
                    kid="66"
                    :backfillValue="addFormData.ybzyxm"
                  ></search-select>
                </el-form-item>
                <el-form-item label="英文名称" prop="ywmc">
                  <el-input v-model="addFormData.ywmc" placeholder="请输入"></el-input>
                </el-form-item>
              </el-row>
              <el-row type="flex">
                <el-form-item label="拼音码" prop="pydm">
                  <el-input v-model="addFormData.pydm" placeholder="请输入"></el-input>
                </el-form-item>
                <!-- <el-form-item>
                  <el-input v-model="value" style="visibility:hidden"></el-input>
                </el-form-item>-->
              </el-row>

              <el-row class="row" style="justify-content: left">
                <span class="line">
                  <i class="icon his-property"></i>其他属性
                </span>
              </el-row>
              <div class="row" style="border-bottom: none; padding-bottom: 0;margin-bottom: 0">
                <el-row type="flex">
                  <el-form-item label="保险项目" prop="bxxm">
                    <el-input v-model="addFormData.bxxm" placeholder="请输入"></el-input>
                  </el-form-item>
                  <el-form-item label="科目编码" prop="kmbm">
                    <el-input v-model="addFormData.kmbm" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-row>
              </div>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="其他项目-项目归并"
      :visible.sync="isMerger"
      width="40%"
      :append-to-body="true"
      class="narrow-dialog"
      :close-on-click-modal="false"
    >
      <el-form label-width="120px" :model="mergerForm" class="his-sys-merger">
        <el-row type="flex">
          <el-form-item label="归并项目">
            <search-select
              v-model="mergerForm.fylb"
              table-name="SYS_DICT_CONFIG"
              kid="40"
              :backfillValue="mergerForm.fylb"
              :clearable="false"
            ></search-select>
          </el-form-item>
          <el-form-item label="门诊归并">
            <search-select
              v-model="mergerForm.mzgb"
              table-name="SYS_DICT_CONFIG"
              kid="40"
              :backfillValue="mergerForm.mzgb"
              :clearable="false"
            ></search-select>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="住院归并">
            <search-select
              v-model="mergerForm.zygb"
              table-name="SYS_DICT_CONFIG"
              kid="40"
              :backfillValue="mergerForm.zygb"
              :clearable="false"
            ></search-select>
          </el-form-item>
          <el-form-item label="病案首页归并">
            <el-cascader
              ref="cascader"
              :options="options"
              v-model="mergerForm.basygb"
              clearable
              checkStrictly="true"
              :show-all-levels="false"
              :props="{multiple: false,emitPath: false,checkStrictly: true,children: 'children',label: 'label'}"
            ></el-cascader>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isMerger = false">取 消</el-button>
        <el-button type="primary" @click="saveMerger">确 定</el-button>
      </span>
    </el-dialog>
    <detailDialog ref="detailDialog" v-bind:addFormData="addFormData" v-bind:FYGB="FYGB"></detailDialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { saveProject, verify, getMnemonic, mergerProject } from '@/api/his/sys/centerMaintenance/medicareInfoManage/payService.ts'
import { rightScroll } from '@/utils/index.ts'
import detailDialog from './detailDialog.vue'
// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'medicalProject',
  components: {
    detailDialog
  }
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private isUpd: boolean = true // 新增与编辑切换
  private isMerger: boolean = false // 项目归并弹框默认隐藏
  private value: any = ''
  private mergerForm: any = {} // 项目归并弹框表单
  private FYGB: number | null = null // 费用归并
  private addFormRule: any = {
    sfmc: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
  }
  private addFormData: any = {
    basygb: 0,
    bxxm: null,
    fyfl: '1',
    fylb: 0,
    kmbm: '',
    lbdm: '',
    mcsx: '',
    mzgb: 0,
    mzpl: '',
    mzsy: 1,
    nhxm: '',
    opStatus: '',
    plsx: '',
    pydm: '',
    sfmc: '',
    sfxm: '',
    ybmzxm: '',
    ybzyxm: '',
    ywmc: '',
    zblb: '',
    zygb: 0,
    zypl: '',
    zysy: 1
  } // 右侧新增表单数据
  private searchData: any = {
    fyfl: 1,
    pydm: ''
  }
  private tableData: Array<any> = []
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
  @Watch('tableData')
  private onValueChange(value: string) {
    rightScroll()
  }

  // 条件查询
  private searchList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

  // 列表查询
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 新增按钮
  private handleAdd() {
    console.log(123)
    this.isUpd = true
    this.$nextTick(() => {
      const el: any = this.$refs.addFormDataRef
      el.resetFields()
    })
  }

  // 新增修改保存
  private handleSave() {
    const params: any = {
      mzpl: this.addFormData.mzpl,
      opStatus: this.isUpd ? 'create' : 'update',
      plsx: this.addFormData.plsx,
      sfmc: this.addFormData.sfmc,
      sfxm: this.addFormData.sfxm,
      zblb: '',
      zypl: this.addFormData.zypl
    }
    console.log(params.opStatus)
    // 表单验证
    ;(this.$refs.addFormDataRef as Form).validate((valid: boolean) => {
      if (valid) {
        // 验证名称是否重复
        verify(params).then((res: any) => {
          if (res.errorCode == 'SUCCESS') {
            // 保存数据
            if (this.addFormData.bxxm == null) {
              this.addFormData.bxxm = 0
            }
            if (this.isUpd) {
              this.addFormData.opStatus = 'create'
            } else {
              this.addFormData.opStatus = 'update'
            }
            saveProject(this.addFormData).then((res: any) => {
              if (res.errorCode === 'SUCCESS') {
                if (this.isUpd) {
                  this.$notify({
                    title: this.$t('common.addSuc').toString(),
                    message: '',
                    type: 'success'
                  })
                } else {
                  this.$notify({
                    title: this.$t('common.editSuc').toString(),
                    message: '',
                    type: 'success'
                  })
                }
                this.getList()
                this.$nextTick(() => {
                  const el: any = this.$refs.addFormDataRef
                  el.resetFields()
                })
                this.isUpd = true
              }
            })
          }
        })
      }
    })
  }

  // 获取表格单行信息
  private getRowData(row: any) {
    this.isUpd = false
    this.FYGB = row.fylb
    console.log(this.FYGB)
    this.addFormData = Object.assign(this.addFormData, row)
    this.mergerForm = Object.assign(this.mergerForm, row)
  }

  // 获取拼音码
  private getPinyin() {
    if (this.addFormData.sfmc) {
      getMnemonic({ typeList: ['py'], value: this.addFormData.sfmc }).then((res: any) => {
        if (res) {
          this.addFormData.pydm = res.data.py
        }
      })
    } else {
      this.addFormData.pydm = null
    }
  }

  // 项目归并
  private handleMerger() {
    if (!this.isUpd) {
      this.isMerger = true
    }
  }
  private saveMerger() {
    const params: any = {
      basygb: this.mergerForm.basygb,
      fylb: this.mergerForm.fylb,
      mzgb: this.mergerForm.mzgb,
      sfxm: this.mergerForm.sfxm,
      zygb: this.mergerForm.zygb
    }
    mergerProject(params).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.$notify({
          title: '保存成功',
          message: '',
          type: 'success'
        })
        this.getList()
        this.isMerger = false
      }
    })
  }

  // 明细弹框
  private handleDetail() {
    if (!this.isUpd) {
      ;(this.$refs.detailDialog as any).showDialog()
    }
  }

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    this.getList()
  }
}
</script>
<style lang="scss" scoped>
.row .label .el-input {
  width: 190px;
}

.line {
  height: 16px;
  line-height: 16px;
}

.content .his-small {
  padding: 0 0 8px;
}

.his-sys-module {
  padding: 8px 10px !important;
}

.his-sys-right {
  margin-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}

// 基本信息底部边距
.content .his-small .retrieval::v-deep .el-row .el-form-item {
  margin-bottom: 16px;
}

//右侧状态框悬浮
::v-deep .el-table__fixed-right {
  height: 100% !important;
}

// 项目归并弹框样式
.his-sys-merger {
  padding-top: 8px !important;
}

::v-deep .el-dialog .el-dialog__body .el-form-item {
  margin-bottom: 8px;
}
::v-deep .el-dialog .el-dialog__body .el-form-item .el-form-item__content .el-input__inner {
  height: 28px;
}
::v-deep .el-dialog .el-dialog__body .el-form-item:nth-of-type(1) {
  margin-right: 8px !important;
}
</style>
