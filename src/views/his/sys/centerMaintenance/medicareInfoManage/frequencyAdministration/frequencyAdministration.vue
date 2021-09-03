<!--
 * @Date: 2020-07-23 20:30:55
 * @LastEditTime:
 * @Description:给药频次维护
 * @FilePath: \web-op\src\views\his\sys\centerMaintenance\medicareInfoManage\frequencyAdministration\frequencyAdministration.vue
-->
<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="18">
        <div class="his-module his-small" style="padding: 8px 10px">
          <div class="row">
            <div class="label">
              <div class="btn">
                <el-button type="text" size="mini" @click="handleTime">
                  <i class="icon his-naozhong"></i>执行时间
                </el-button>
                <el-button type="text" size="mini" @click="handleFrequency">
                  <i class="icon his-naozhong"></i>频次周率
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
            data-url="/op-service/dicsypc/queryPage"
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
              :height="listSlotHeight-104"
              class="scroll-bar"
              tooltip-effect="light"
              highlight-current-row
              @row-click="getRowData"
            >
              <el-table-column type="index" width="32" align="center"></el-table-column>
              <el-table-column label="频次名称" prop="pcmc" width="70"></el-table-column>
              <el-table-column label="每日次数" prop="mrcs" width="70" show-overflow-tooltip></el-table-column>
              <el-table-column label="执行时间" prop="zxsj" show-overflow-tooltip></el-table-column>
              <el-table-column label="日历周" prop="rlz" width="60">
                <template slot-scope="scope">
                  <div
                    :class="[scope.row.rlz == '1' ? 'blues' : 'reds']"
                  >{{scope.row.rlz == '1' ? '是' : '否'}}</div>
                </template>
              </el-table-column>
              <el-table-column label="最小周期" prop="zxzq" width="70"></el-table-column>
              <el-table-column label="备注" prop="bzxx" width="120"></el-table-column>
              <el-table-column label="操作" width="52" class-name="action-btns" align="center">
                <template slot-scope="scope">
                  <el-tooltip :content="$t('common.delete')" effect="light" :enterable="false">
                    <el-popconfirm
                      hideIcon
                      :confirmButtonText="$t('common.confirm')"
                      :cancelButtonText="$t('common.cancel')"
                      :title="$t('sysManage.confirmDeleted')"
                      @confirm="handleDelete(scope.row)"
                    >
                      <el-button slot="reference" class="red">
                        <i class="icon his-del his-cancellationicon" />
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col class="ht" :span="6">
        <div
          class="his-module his-small his-sys-module"
          :style="{ height: listSlotHeight - 10 + 'px'}"
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
          <el-form
            ref="addFormRef"
            :model="addFormData"
            class="retrieval"
            label-width="67px"
            :rules="addFormRule"
          >
            <el-form-item label="频次名称" prop="pcmc">
              <el-input v-model="addFormData.pcmc" placeholder="请输入..." :disabled="!isEnable"></el-input>
            </el-form-item>
            <el-form-item label="每日次数" prop="mrcs">
              <el-input
                v-model="addFormData.mrcs"
                type="number"
                placeholder="请输入..."
                :disabled="!isEnable"
              ></el-input>
            </el-form-item>
            <el-form-item label="执行时间" prop="zxsj" disabled>
              <el-input
                type="textarea"
                rows="4"
                v-model="addFormData.zxsj"
                disabled
                placeholder="请输入..."
              ></el-input>
            </el-form-item>
            <el-form-item label="日历周" prop="rlz">
              <search-select
                v-model="addFormData.rlz"
                table-name="SYS_FLAG_DATA"
                kid="FD000005"
                :backfillValue="addFormData.rlz"
                style="width: 100%"
                :disabled="!isEnable"
                @change="handleCycle"
              ></search-select>
            </el-form-item>
            <el-form-item label="最小周期" prop="zxzq">
              <el-input
                v-model="addFormData.zxzq"
                placeholder="请输入..."
                type="number"
                :disabled="!isEnable"
                @change="handleDefaultval"
              ></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="bzxx">
              <el-input v-model="addFormData.bzxx" placeholder="请输入..." :disabled="!isEnable"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <!-- 执行时间弹窗 -->
    <el-dialog
      title="执行时间维护"
      class="narrow-dialog"
      :visible.sync="timeDialogVisible"
      :close-on-click-modal="false"
      width="680px"
    >
      <div class="row" style="border: none; margin-bottom: 0">
        <el-row>
          <el-checkbox-group v-model="executeTimeList">
            <el-checkbox
              class="his-sys-checkBox"
              v-for="item in timeList"
              :key="item.dv"
              :label="item.dn"
              border
            >{{item.dn}}</el-checkbox>
          </el-checkbox-group>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="timeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getExeTime">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 频次周率维护弹窗（周） -->
    <el-dialog
      class="narrow-dialog"
      :visible.sync="frequencyWeekVisible"
      :close-on-click-modal="false"
      title="频次周率维护"
      width="464px"
    >
      <div class="row" style="border: none; margin-bottom: 0">
        <el-row>
          <el-checkbox
            class="his-sys-checkBox"
            v-for="item in frequencyList"
            :key="item.dv"
            :label="item.dv"
            :value="item.dv"
            border
            v-model="weekArr[item.showOrder-1]"
          >{{item.dn}}</el-checkbox>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="frequencyWeekVisible = false">取 消</el-button>
        <el-button type="primary" @click="getFrequencyWeek">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 频次周率维护弹窗（天） -->
    <el-dialog
      class="narrow-dialog"
      :visible.sync="frequencyDayVisible"
      :close-on-click-modal="false"
      title="频次周率维护"
      width="464px"
    >
      <div class="row" style="border: none; margin-bottom: 0">
        <el-row>
          <el-checkbox
            class="his-sys-checkBox"
            v-for="item in dayList"
            :key="item.dv"
            :label="item.dn"
            v-model="dayArr[item.showOrder-1]"
            border
          >{{item.dn}}</el-checkbox>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="frequencyDayVisible = false">取 消</el-button>
        <el-button type="primary" @click="getDayArr">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { addFrequency, editFrequency, delFrequency } from '@/api/his/sys/centerMaintenance/medicareInfoManage/frequencyAdministration.ts'
import { log } from 'util'
// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'frequencyAdministration',
  components: {}
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private isUpd: boolean = true // 新增与编辑切换
  private isEdit: boolean = false // 判断频次周率是否保存
  private value: any = ''
  private isEnable: boolean = false // 频次周率按钮默认不可点击
  private timeDialogVisible: boolean = false // 执行时间弹框默认隐藏
  private frequencyWeekVisible: boolean = false // 频次周率（周）弹框默认隐藏
  private frequencyDayVisible: boolean = false // 频次周率（天）弹框默认隐藏
  private frequencyList: Array<any> = [] // 频次周率数组(周)
  private ckeckWeekList: Array<any> = [] // 已选择的频次周率（周）
  private dayList: Array<any> = [] // 频次周率数组（天）
  private checkDayList: Array<any> = [] // 频次周率数组（天）
  private timeList: Array<any> = [] // 执行时间组
  private executeTimeList: Array<any> = [] // 已勾选的执行时间
  private weekArr: Array<any> = [] // 频次周率（周）
  private dayArr: Array<any> = [] // 频次周率（天）
  private PCZL = '' // 频次周率
  private pczlLength: number = 0 // 频次周率打印出多选框的数量
  private searchData: any = {
    pydm: ''
  }
  private tableData: Array<any> = []
  private addFormData: any = {
    mrcs: '',
    pcmc: '',
    rlz: '',
    rzxzq: '',
    zxsj: '',
    zxzq: 1,
    bzxx: ''
  }
  private addFormRule: any = {
    mrcs: [{ required: true, message: '每日次数不能为空', trigger: 'blur' }],
    pcmc: [{ required: true, message: '频次名称不能为空', trigger: 'blur' }],
    rlz: [{ required: true, message: '日历周不能为空', trigger: 'blur' }],
    zxsj: [{ required: true, message: '执行时间不能为空', trigger: 'blur' }],
    zxzq: [{ required: true, message: '最小周期不能为空', trigger: 'blur' }]
  }

  // 获取表格数据
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }
  // 条件查询
  private searchLists() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

  // 新增按钮
  private handleAdd() {
    this.isUpd = true
    this.isEnable = true
    this.isEdit = false
    this.executeTimeList = []
    this.$nextTick(() => {
      const el: any = this.$refs.addFormRef
      el.resetFields()
    })
  }

  // 保存新增与修改
  private handleSave() {
    ;(this.$refs.addFormRef as Form).validate((valid: boolean) => {
      if (valid) {
        if (this.isUpd) {
          this.addFormData.rzxzq = this.PCZL
          if (this.addFormData.zxsj) {
            if (this.addFormData.rzxzq) {
              addFrequency(this.addFormData).then((res: any) => {
                if (res.errorCode === 'SUCCESS') {
                  this.$notify({
                    title: '新增成功',
                    message: '',
                    type: 'success'
                  })
                  this.isEnable = false
                  this.isUpd = true
                  this.getList()
                  this.$nextTick(() => {
                    const el: any = this.$refs.addFormRef
                    el.resetFields()
                  })
                }
              })
            } else {
              this.$message({
                message: '请先选择频次周率！',
                type: 'warning'
              })
            }
          } else {
            this.$message({
              message: '请先选择执行时间！',
              type: 'warning'
            })
          }
        } else {
          if (this.isEdit) {
            this.addFormData.rzxzq = this.PCZL
          }
          if (this.addFormData.zxsj) {
            if (this.addFormData.rzxzq) {
              if (this.addFormData.zxzq == this.pczlLength) {
                editFrequency(this.addFormData).then((res: any) => {
                  if (res.errorCode === 'SUCCESS') {
                    this.$notify({
                      title: '修改成功',
                      message: '',
                      type: 'success'
                    })
                    this.getList()
                    this.isEnable = false
                    this.isUpd = true
                    this.$nextTick(() => {
                      const el: any = this.$refs.addFormRef
                      el.resetFields()
                    })
                  }
                })
              } else {
                this.$message({
                  message: '请重新设置频次周率！',
                  type: 'warning'
                })
              }
            } else {
              this.$message({
                message: '请先选择频次周率！',
                type: 'warning'
              })
            }
          } else {
            this.$message({
              message: '请先选择执行时间！',
              type: 'warning'
            })
          }
        }
      }
    })
  }

  // 删除
  private handleDelete(row: any) {
    delFrequency({ pcbm: row.pcbm }).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        this.$notify({
          title: '已删除',
          message: '',
          type: 'success'
        })
        this.getList()
        this.$nextTick(() => {
          const el: any = this.$refs.addFormRef
          el.resetFields()
        })
        this.isEnable = false
      }
    })
  }

  // 获取单行数据
  private getRowData(row: any) {
    console.log(row)
    this.isUpd = false
    this.isEnable = true
    this.isEdit = false
    this.pczlLength = row.zxzq
    this.addFormData = JSON.parse(JSON.stringify(row))
    row.rlz = this.addFormData.rlz
    this.executeTimeList = row.zxsj.split('-')
    this.handleRzxzq(row.rzxzq, row.rlz)
  }

  // 获取执行时间字典数据
  private getExecutTime() {
    this.timeList = this.$store.state.webSqlDict.EXECUTION_TIME_DICT
    // console.log(this.timeList)
  }

  // 获取频次周率的字典数据（周）
  private getFrequency() {
    this.frequencyList = this.$store.state.webSqlDict.DOSE_CYCLE_DICT
    // console.log(this.frequencyList)
  }

  // 获取频次周率的字典数据（天）
  private getDayFrequency() {
    let dayArr: Array<any> = []
    dayArr = this.$store.state.webSqlDict.DOSE_FREQUENCY_DICT
    // console.log(dayArr)
    this.dayList = dayArr.slice(0, this.addFormData.zxzq)
    // console.log(this.dayList)
  }

  // 执行时间弹框
  private handleTime() {
    if (this.addFormData.pcmc) {
      this.timeDialogVisible = true
      this.getExecutTime()
    } else {
      this.$message({
        message: '请先选择行！',
        type: 'warning'
      })
    }
  }
  // 频次周率弹框
  private handleFrequency() {
    if (this.isEnable) {
      if (this.addFormData.rlz == 1) {
        this.frequencyWeekVisible = true
        this.getFrequency()
      } else {
        this.frequencyDayVisible = true
        this.getDayFrequency()
      }
    } else {
      this.$message({
        message: '请先选择行！',
        type: 'warning'
      })
    }
  }

  // 获取执行时间数据
  private getExeTime() {
    if (this.executeTimeList.length != this.addFormData.mrcs) {
      this.$message({
        message: '每日次数和所选时间不一致！',
        type: 'warning'
      })
    } else {
      this.addFormData.zxsj = this.executeTimeList.join('-')
      this.timeDialogVisible = false
    }
  }

  // 新增时的频次周率数据
  private getFrequencyWeek() {
    let pczl = [0, 0, 0, 0, 0, 0, 0]
    for (let i = 0; i < this.weekArr.length; i++) {
      if (this.weekArr[i] == true) {
        pczl[i] = 1
      }
    }
    this.PCZL = pczl.join('')
    console.log(this.PCZL)
    this.pczlLength = this.PCZL.length
    this.isEdit = true
    this.frequencyWeekVisible = false
  }

  private getDayArr() {
    let dayarr = []
    for (let i = 0; i < this.dayList.length; i++) {
      dayarr.push(0)
    }
    for (let j = 0; j < this.dayList.length; j++) {
      if (this.dayArr[j] == true) {
        dayarr[j] = 1
      }
    }
    this.PCZL = dayarr.join('')
    console.log(this.PCZL)
    this.frequencyDayVisible = false
    this.isEdit = true
    this.pczlLength = this.PCZL.length
  }

  // 点击频次周率，回显rzxzq数据
  private handleRzxzq(val1: any, val2: any) {
    let arr: Array<any> = []
    let pczl = JSON.parse(JSON.stringify(val1))
    arr = pczl.split('')
    console.log(val1)

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == 1) {
        arr[i] = true
      }
    }
    if (val2 == 1) {
      this.weekArr = Object.assign(this.weekArr, arr)
    } else {
      this.dayArr = Object.assign(this.dayArr, arr)
    }
    console.log(val1)
  }

  // 日历周为是时，最小周期为7
  private handleCycle() {
    if (this.addFormData.rlz == 1) {
      this.addFormData.zxzq = 7
    }
  }

  // 日历周为是时，最小周期默认为7且不可变
  private handleDefaultval() {
    if (this.addFormData.rlz == 1) {
      this.addFormData.zxzq = 7
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
.his-sys-checkBox {
  width: 100px !important;
  height: 40px !important;
  line-height: 25px !important;
  margin: 0 4px 10px !important;
}

.row .label .el-input {
  width: 190px;
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
.content .his-module .el-form .el-form-item::v-deep .el-select--medium .el-input__inner {
  width: 100% !important;
}

.el-dialog__wrapper.narrow-dialog .el-dialog__body .row {
  padding-bottom: 0;
}
</style>
