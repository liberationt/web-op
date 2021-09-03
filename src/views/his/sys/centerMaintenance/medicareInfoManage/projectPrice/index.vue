<!--
 * @Author: dmj
 * @LastEditTime:
 * @LastEditors:
 * @Description:机构收费项目调价
 * @FilePath:
-->
<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="12">
        <div
          class="his-module layout-top his-small"
          :style="{ height: listSlotHeight / 2 - 10  + 'px', marginBottom: '10px' }"
        >
          <pagenation-list
            ref="pageTable"
            v-model="tableData"
            data-url="/op-service/feexmfytj01/queryPage"
            http-method="post"
            :list-height="listSlotHeight"
            :searchData="searchData1"
          >
            <div slot="header">
              <div class="row">
                <div class="label">
                  <h1 class="title">未执行调价单</h1>
                  <div class="querySearch">
                    <el-divider direction="vertical"></el-divider>
                    <div class="searchTitle">调价方式</div>
                    <search-select
                      v-model="searchData1.tjfs"
                      placeholder="请选择"
                      table-name="SYS_FLAG_DATA"
                      kid="FD000044"
                      :backfillValue="searchData1.tjfs"
                      @change="changeModifyPriceType"
                      :clearable="false"
                    ></search-select>
                  </div>
                  <div class="btn">
                    <el-divider direction="vertical"></el-divider>
                    <!-- 刷新 -->
                    <el-button size="mini" type="text" @click="handleRefresh">
                      <i class="icon his-btn-refresh"></i>刷新
                    </el-button>
                    <!-- 执行 -->
                    <el-button size="mini" type="text" @click="handleImplement">
                      <i class="icon his-btn-confirm green"></i>执行
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
            </div>
            <el-table
              :data="tableData"
              border
              :fit="true"
              stripe
              :highlight-current-row="true"
              slot="list"
              :height="listSlotHeight / 2 - 14 - 43 - 16 - 32"
              class="scroll-bar"
              tooltip-effect="light"
              @row-click="getRowData1"
            >
              <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
              <el-table-column prop="tjdh" :label="$t('调价单号')" width="90"></el-table-column>
              <el-table-column prop="tjwh" :label="$t('调价文号')" width="90"></el-table-column>
              <el-table-column prop="rrrq" :label="$t('录入日期')" show-overflow-tooltip></el-table-column>
              <el-table-column prop="dsrq" :label="$t('定时日期')" width="90"></el-table-column>
              <!-- 操作 -->
              <el-table-column :label="$t('common.action')" width="52" fixed="right" align="center">
                <template slot-scope="scope">
                  <el-tooltip :content="$t('common.delete')" placement="bottom" effect="light">
                    <el-popconfirm
                      hideIcon
                      :confirmButtonText="$t('common.confirm')"
                      :cancelButtonText="$t('common.cancel')"
                      :title="$t('common.delTip')"
                      @confirm="handleRemove(scope.row)"
                    >
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
        <div
          class="his-module his-small layout-bot"
          :style="{ height: listSlotHeight / 2 - 10 + 'px' }"
        >
          <pagenation-list
            ref="pageTableRef"
            v-model="tableDatas"
            data-url="/op-service/feexmfytj01/queryPage"
            http-method="post"
            :list-height="listSlotHeight"
            :searchData="searchData2"
          >
            <div slot="header">
              <div class="row">
                <div class="label">
                  <h1 class="title">已执行调价单</h1>
                  <el-divider direction="vertical"></el-divider>
                  <div class="searchTitle">财务月份</div>
                  <el-date-picker
                    v-model="searchData2.zxrq"
                    type="month"
                    placeholder="请选择日期"
                    class="date-drapper his-sys-date"
                    value-format="yyyy-MM"
                    @change="changeMonth"
                  ></el-date-picker>
                  <el-divider direction="vertical"></el-divider>
                  <div class="btn">
                    <!-- 生效 -->
                    <el-button type="text" size="mini" @click="handleEffect">
                      <i class="icon his-btn-confirm green"></i>生效
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
            <el-table
              :data="tableDatas"
              border
              :fit="true"
              stripe
              :highlight-current-row="true"
              slot="list"
              :height="listSlotHeight / 2 - 14 - 43 - 16 - 32"
              class="scroll-bar"
              tooltip-effect="light"
              @row-click="getRowData2"
            >
              <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
              <el-table-column prop="tjdh" :label="$t('调价单号')" width="70"></el-table-column>
              <el-table-column prop="tjwh" :label="$t('调价文号')" width="70" show-overflow-tooltip></el-table-column>
              <el-table-column prop="zxrq" :label="$t('执行日期')" show-overflow-tooltip></el-table-column>
              <el-table-column prop="dsrq" :label="$t('定时日期')" width="90"></el-table-column>
              <el-table-column prop="sxrq" :label="$t('生效日期')" show-overflow-tooltip></el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>

      <el-col class="ht" :span="12">
        <div class="his-module his-small">
          <div slot="header" class="row">
            <div class="label">
              <h1 class="title">{{ isEdit ? $t('common.add') : $t('common.edit')}}</h1>
            </div>
            <div class="operate">
              <el-button
                size="mini"
                type="primary"
                class="green-gra"
                icon="icon his-save"
                @click="handleSave"
              >{{$t('common.save')}}</el-button>
            </div>
          </div>
          <div class="rightTop">
            <el-form
              class="retrieval"
              ref="inputForm"
              :model="inputForm"
              label-width="67px"
              :rules="inputFormRule"
            >
              <el-row type="flex" justify="space-around">
                <!-- 调价方式 -->
                <el-form-item prop="tjfs" label="调价方式">
                  <search-select
                    v-model="inputForm.tjfs"
                    placeholder="请选择"
                    table-name="SYS_FLAG_DATA"
                    kid="FD000044"
                    :backfillValue="inputForm.tjfs"
                    :clearable="false"
                  ></search-select>
                </el-form-item>
                <!-- 定时日期 -->
                <el-form-item prop="dsrq" label="定时日期" :inline-message="false">
                  <el-date-picker
                    v-model="inputForm.dsrq"
                    type="date"
                    placeholder="请选择日期"
                    value-format="yyyy-MM-dd"
                    class="date-wrapper"
                  ></el-date-picker>
                </el-form-item>
              </el-row>
              <el-row type="flex" justify="space-around">
                <!-- 调价文号 -->
                <el-form-item prop="tjwh" label="调价文号">
                  <el-input v-model="inputForm.tjwh" placeholder="请输入..."></el-input>
                </el-form-item>
              </el-row>
            </el-form>
          </div>
          <div>
            <div class="feature">
              <h1 class="title">费用调价单详情</h1>
              <el-divider direction="vertical"></el-divider>
              <div class="btn">
                <el-button type="text" @click="handleAddNews" :disabled="isUpd">
                  <i class="icon his-btn-add green"></i>新增
                </el-button>
                <el-button type="text" @click="handleRightDelete" :disabled="isUpd">
                  <i class="icon his-btn-del red"></i>删除
                </el-button>
              </div>
            </div>
          </div>
          <el-table
            :data="costData"
            border
            :fit="true"
            stripe
            :highlight-current-row="true"
            tooltip-effect="light"
            slot="list"
            data-url
            :height="listSlotHeight - 16 - 45 - 108 - 11 -8"
            class="scroll-bar no-underline"
            :row-class-name="rowClassName"
          >
            <el-table-column type="index" width="32" align="center"></el-table-column>
            <el-table-column prop="fymc" label="费用名称">
              <template slot-scope="scope">
                <remoteSearchBox
                  :required="true"
                  v-model="scope.row.fymc"
                  :ref="`${scope.$index}-2`"
                  style="height: 32px"
                  :searchData="{
                    yp:{
                      pydm: '',
                    }
                  }"
                  :resultTableHeader="{
                    yp:[
                    {
                      width: 70,
                      prop: 'fyxh',
                      label: '费用序号'
                    },
                    {
                      prop: 'fymc',
                      label: '费用名称'
                    },
                    {
                      prop: 'fydw',
                      label: '费用单位',
                      width: 80
                    },
                    {
                      prop: 'fygb',
                      label: '费用归并',
                      width: 80
                    },
                    {
                      prop: 'bzjg',
                      label: '标准价格',
                      width: 80
                    }
                    ]
                  }"
                  :searchField="{
                    yp: 'pydm'
                  }"
                  :showLabel="{
                    yp: 'ypmc'
                  }"
                  :name="'fytj'"
                  @keyup.enter.native="change(scope.$index,2)"
                  @getData="data => getDrugTableData(data,scope.$index)"
                ></remoteSearchBox>
              </template>
            </el-table-column>
            <el-table-column prop="fydw" label="单位" width="70" show-overflow-tooltip></el-table-column>
            <el-table-column prop="fygb" label="费用归并" width="70">
              <template slot-scope="scope">
                <div>{{$store.state.webSqlDict.COST_CONSOLIDATION.find(item => item.dv == scope.row.fygb) && $store.state.webSqlDict.COST_CONSOLIDATION.find(item => item.dv == scope.row.fygb).dn}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="bzjg" label="标准价格" width="70">
              <template slot-scope="scope">{{useGetFloat(scope.row.bzjg,2)}}</template>
            </el-table-column>
            <el-table-column prop="yjg" label="原价格" width="70">
              <template slot-scope="scope">{{useGetFloat(scope.row.yjg,2)}}</template>
            </el-table-column>
            <el-table-column prop="xjg" label="新价格" width="70">
              <template slot-scope="scope">
                <input-box
                  :required="true"
                  v-model="scope.row.xjg"
                  :ref="`${scope.$index}-3`"
                  type="number"
                  style="height: 32px"
                  @keyup.enter.native="change(scope.$index, 3)"
                  @blur="getAccurate(scope.row)"
                ></input-box>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { effectAdjustment, saveAdjustment, updateExcuteStatus, removeAdjustment, checkDetail } from '@/api/his/sys/centerMaintenance/medicareInfoManage/projectPrice.ts'
import { getNow } from '@/api/his/basic/index.ts'
import { parseTime, getFloat } from '@/utils'
@Component({
  name: 'projectPrice'
})
export default class extends Vue {
  private isUpd: boolean = true // 新增、编辑切换
  private isEdit: boolean = true // 新增、编辑切换,默认新增
  private nowTime: any = '' // 当前服务器时间
  private nowDate: any = '' // 当前月份
  private currentDate: string = '' // 当前日期
  private TJDH: number | null = null //提交单号
  private searchData1: any = {
    tjfs: '1',
    zxpb: '0',
    zxrq: ''
  }
  private searchData2: any = {
    zxpb: '1',
    zxrq: '',
    tjfs: this.searchData1.tjfs
  }
  private value: any = ''
  // 新增表单数据参数
  private inputForm: any = {
    tjfs: '1',
    tjwh: '',
    dsrq: ''
  } // 右侧表单数据
  private id: number | null = null
  private tableDatas = []
  private tableData = []
  private costData: Array<any> = []
  private data: any = {}
  private listSlotHeight: number = 0
  private style: string | null = 'add'
  private flag: boolean = true
  private selectRightRow: number | null = null

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }

  mounted() {
    this.getList1()

    this.getNowTime()
  }
  private remoteMethod(query: string) {}

  private clear(data: any) {
    console.log(data)
  }
  private handleConfirm() {}

  // 新增
  private handleAdd() {
    this.isEdit = true
    this.isUpd = false
    this.$nextTick(() => {
      const el: any = this.$refs.inputForm
      el.resetFields()
    })
    this.costData = []
  }

  // 定时日期表单验证
  private inputFormRule: any = {
    dsrq: [{ required: true, message: '定时日期不能为空', trigger: 'blur' }]
  }

  // 切换调价方式刷新页面
  private changeModifyPriceType() {
    this.getList1()
    this.getList2()
  }

  // 刷新页面
  private handleRefresh() {
    this.getList1()
    this.getList2()
  }

  // 获取未执行调价单数据
  private getList1() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 获取已执行调价单数据
  private getList2() {
    const pageTable: any = this.$refs.pageTableRef
    pageTable.getList()
  }

  // 新增新的费用调价单
  private handleAddNews() {
    if (this.costData.length > 0) {
      let oldRowData = this.costData[this.costData.length - 1]
      if (oldRowData.fymc) {
        this.costData = [...this.costData, { bzjg: 0, yjg: 0 }]
      }
    } else {
      this.costData = [...this.costData, { bzjg: 0, yjg: 0 }]
    }
    this.$nextTick(() => {
      console.log('~~~~~', this.$refs[`${this.costData.length - 1}-${2}`])
      ;(this.$refs[`${this.costData.length - 1}-${2}`] as any).focus()
    })
    this.selectRightRow = this.costData.length - 1
  }

  private getDrugTableData(val: any, index: number) {
    console.log(val)
    this.$set(this.costData, index, { ...val, fydw: val.fydw, fygb: val.fygb, bzjg: val.bzjg, yjg: val.fydj })
  }

  // 输入enter切换焦点
  private change(index: any, labelIndex: number) {
    console.log('改变forcs', index, labelIndex)
    if (this.$refs[`${index}-${labelIndex + 1}`]) {
      if ((this.$refs[`${index}-${labelIndex + 1}`] as any).disabled) {
        this.change(index, labelIndex + 1)
      } else {
        console.log('~~~~', (this.$refs[`${index}-${labelIndex + 1}`] as any).focus)
        ;(this.$refs[`${index}-${labelIndex}`] as any).blur()
        ;(this.$refs[`${index}-${labelIndex + 1}`] as any).focus()
      }
    } else {
      if (this.$refs[`${index + 1}-1`]) {
        if ((this.$refs[`${index + 1}-1`] as any).disabled) {
          this.change(index + 1, 1)
        } else {
          ;(this.$refs[`${index}-${labelIndex}`] as any).blur()
          ;(this.$refs[`${index + 1}-1`] as any).focus()
        }
      } else {
        this.costData = [...this.costData, {}]
        this.$nextTick(() => {
          if ((this.$refs[`${index + 1}-1`] as any).disabled) {
            this.change(index + 1, 1)
          } else {
            ;(this.$refs[`${index}-${labelIndex}`] as any).blur()
            ;(this.$refs[`${index + 1}-1`] as any).focus()
          }
        })
      }
    }
  }

  // 更改财务月份刷新表格
  private changeMonth() {
    console.log(this.searchData2.zxrq)
    this.getList2()
  }

  // 费用调价单详情删除
  private handleRightDelete() {
    if (this.selectRightRow != null && this.selectRightRow >= 0) {
      this.costData.splice(this.selectRightRow, 1)
      this.selectRightRow = this.costData.length - 1
    }

  }

  // 保存新增的信息
  private handleSave() {
    ;(this.$refs.inputForm as Form).validate((valid: boolean) => {
      if (valid) {
        if (this.costData.length > 0) {
          const params: any = {
            tjfs: this.inputForm.tjfs,
            tjwh: this.inputForm.tjwh,
            dsrq: this.inputForm.dsrq,
            tjdh: this.inputForm.tjdh,
            opStatus: this.isEdit ? 'create' : 'update',
            fytj02List: this.costData
          }
          // 这里需要加一个新价格的校验
          if (this.isUpd == false) {
            console.log(123)
            if (this.newPrice !== false) {
              saveAdjustment(params).then((res: any) => {
                if (res.errorCode === 'SUCCESS') {
                  if (this.isEdit) {
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
                  this.getList1()
                  this.handleAdd()
                  this.isUpd = true
                }
              })
            } else {
              this.$message({
                message: '新价格不能为空！',
                type: 'warning'
              })
            }
          }
        }
      }
    })
  }

  // 删除未执行调价单
  private handleRemove(row: any) {
    removeAdjustment({ tjdh: row.tjdh }).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.$notify({
          title: this.$t('common.delSuc').toString(),
          message: '',
          type: 'success'
        })
        this.$nextTick(() => {
          const el: any = this.$refs.inputForm
          el.resetFields()
        })
        this.costData = []
        this.getList1()
      }
    })
  }

  // 获取未执行调价单单行数据
  private getRowData1(row: any) {
    this.isEdit = false
    this.isUpd = false
    this.TJDH = row.tjdh
    checkDetail({ tjdh: row.tjdh }).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        console.log(res)
        this.inputForm = Object.assign(this.inputForm, res.data.feeXmfytj01)
        this.costData = res.data.feeXmfytj02RespList
        this.costData.forEach((item: any) => {
          item.xjg = getFloat(item.xjg, 2)
        })
        this.selectRightRow = this.costData.length - 1
      }
    })
  }

  //获取已执行调价单单行数据
  private getRowData2(row: any) {
    this.isEdit = false
    this.isUpd = true
    this.TJDH = row.tjdh
    checkDetail({ tjdh: row.tjdh }).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        console.log(res)
        this.inputForm = Object.assign(this.inputForm, res.data.feeXmfytj01)
        this.costData = res.data.feeXmfytj02RespList
        this.costData.forEach((item: any) => {
          item.xjg = getFloat(item.xjg, 2)
        })
        this.selectRightRow = this.costData.length - 1
      }
    })
  }

  // 执行
  private handleImplement() {
    updateExcuteStatus({ tjdh: this.TJDH }).then((res: any) => {
      console.log(res)
      if (res.errorCode === 'SUCCESS') {
        this.$notify({
          title: '已执行',
          message: '',
          type: 'success'
        })
        this.getList1()
        this.getList2()
      }
    })
  }

  // 生效
  private handleEffect() {
    effectAdjustment({ tjdh: this.TJDH }).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        console.log(res)
        this.$notify({
          title: '已生效',
          message: '',
          type: 'success'
        })
        this.getList2()
      }
    })
  }

  // 判断新价格是否存在
  get newPrice() {
    for (let i = 0; i < this.costData.length; i++) {
      if (this.costData[i].xjg == null) {
        return false
      }
    }
  }

  // 保留n位小数
  private useGetFloat(num: any, n: number) {
    return getFloat(num, n)
  }

  // 获取精确新价格
  private getAccurate(row: any) {
    console.log(row)

    row.xjg = getFloat(row.xjg, 2)
  }

  // 获取当前服务器时间
  private getNowTime() {
    getNow().then((res: any) => {
      this.nowTime = parseTime(res.data, '{y}-{m}-{d} {h}:{i}:{s}')
      this.nowDate = parseTime(res.data, '{y}-{m}')
      this.searchData2.zxrq = this.nowDate
      this.getList2()
    })
  }

  private rowClassName({ row, rowIndex }: any) {
    //把每一行的索引放进row
    row.drugRowIndex = rowIndex
  }
}
</script>

<style lang="scss" scoped>
// .title {
//   display: inline-block;
//   margin-right: 10px;
// }
.content .his-module .el-form {
  margin: 0px auto;
}

// 调价方式input框
.his-small .row .label ::v-deep .el-input .el-input__inner {
  width: 168px !important;
}
// 财务月份input框
::v-deep .el-date-editor.el-input.his-sys-date,
.el-date-editor.el-input__inner {
  width: 168px !important;
}
// 右上角form表单底部分隔线
.rightTop {
  border-bottom: 1px solid #f0f0f0;
}

.bottom-bar {
  margin-top: 15px;
}

// 右侧状态框悬浮
::v-deep .el-table__fixed-right {
  height: 100% !important;
}

.bottom-bar {
  margin: 8px 0;
  padding: 0;
}

// 去除新增按钮下的横线
.row.rowline {
  border-bottom: none;
  padding: 0;
}

// 图标icon居中
::v-deep .el-input--medium .el-input__icon {
  line-height: 28px;
}

// //右侧表格上的新增按钮
// span .icon.his-btn-add {
//   color: #0fcadd;
// }

// .is-disabled {
//   background: #0fcaad;
//   border-color: #0fcaad
// }
</style>
