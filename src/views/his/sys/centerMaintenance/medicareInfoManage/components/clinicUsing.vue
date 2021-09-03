// 门诊使用
<template>
  <div>
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="19">
        <div class="his-module his-small" style="padding: 8px 10px">
          <div class="row">
            <div class="label">
              <div class="title">门诊使用</div>
              <el-divider direction="vertical"></el-divider>
              <div class="btn">
                <el-button type="text" size="mini" @click="handleDefault">
                  <i class="icon his-jichushuju"></i>默认
                </el-button>
                <el-button type="text" size="mini" @click="handleError">
                  <i class="icon his-menu_posguanli"></i>货币误差
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
            data-url="/op-service/pubfkfs/queryPage"
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
              :height="listSlotHeight-158"
              class="scroll-bar"
              tooltip-effect="light"
              @row-click="getRowData"
              highlight-current-row
            >
              <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
              <el-table-column label="付款名称" prop="fkmc" width="90"></el-table-column>
              <el-table-column label="付款类别" prop="fklb" width="70">
                <template slot-scope="scope">
                  <div>{{fklbList.find(item => item.fklb == scope.row.fklb) && fklbList.find(item => item.fklb == scope.row.fklb).lbmc}}</div>
                </template>
              </el-table-column>
              <el-table-column label="号码长度" prop="hmcd" width="70"></el-table-column>
              <el-table-column label="付款精度" prop="fkjd" width="70">
                <template slot-scope="scope">
                  <div>{{$store.state.webSqlDict.PAY_ACCURACY_DICT.find(item => item.dv == scope.row.fkjd) && $store.state.webSqlDict.PAY_ACCURACY_DICT.find(item => item.dv == scope.row.fkjd).dn}}</div>
                </template>
              </el-table-column>
              <el-table-column label="货币误差" prop="hbwc" width="70">
                <template slot-scope="scope">
                  <div>{{scope.row.hbwc == 1 ? '货币误差' : '正常使用'}}</div>
                </template>
              </el-table-column>
              <el-table-column label="舍入方式" prop="srfs" width="70">
                <template slot-scope="scope">
                  <div>{{$store.state.webSqlDict.ROUNDING_METHOD_DICT.find(item => item.dv == scope.row.srfs) && $store.state.webSqlDict.ROUNDING_METHOD_DICT.find(item => item.dv == scope.row.srfs).dn}}</div>
                </template>
              </el-table-column>
              <el-table-column label="默认标志" prop="mrbz" width="70">
                <template slot-scope="scope">
                  <div class="blues">{{scope.row.mrbz == 1 ? '默认' : '' }}</div>
                </template>
              </el-table-column>
              <el-table-column label="诊间使用标志" width="95" prop="zjjssy">
                <template slot-scope="scope">
                  <div class="blues">{{scope.row.zjjssy == 1 ? '是' : '' }}</div>
                </template>
              </el-table-column>
              <el-table-column label="作废标志" prop="zfbz" width="70px">
                <template slot-scope="scope">
                  <div class="reds">{{scope.row.zfbz == 1 ? '作废' : '' }}</div>
                </template>
              </el-table-column>
              <el-table-column label="备注信息" prop="bzxx" show-overflow-tooltip></el-table-column>
              <el-table-column
                label="操作"
                width="52"
                class-name="action-btns"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <!-- 作废/取消作废 -->
                  <el-tooltip :content="scope.row.zfbz == '0'?'作废':'取消作废'" effect="light">
                    <el-popconfirm
                      class="ml10"
                      hideIcon
                      :confirmButtonText="scope.row.zfbz == '0' ? '作废':'取消作废'"
                      :cancelButtonText="$t('common.cancel')"
                      :title="
                        scope.row.zfbz == '0'
                        ? '确认作废?'
                        : '确认取消作废?'
                      "
                      @confirm="handleEnable(scope.row)"
                    >
                      <el-button
                        slot="reference"
                        :class="[scope.row.zfbz == '0' ? 'red' : 'green']"
                      >
                        <i
                          class="icon"
                          :class="[
                            scope.row.zfbz == '0'
                            ? 'his-youcaozuo_zuofei'
                            : 'his-youcaozuo_huifu',
                          ]"
                        ></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col class="ht" :span="5">
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
          <el-form
            class="retrieval"
            ref="ruleForm"
            :model="addFormData"
            :rules="addFormRules"
            label-width="67px"
          >
            <el-form-item label="付款名称" prop="fkmc">
              <el-input placeholder="请输入..." v-model="addFormData.fkmc"></el-input>
            </el-form-item>
            <el-form-item label="使用类型" prop="sylx" disabled>
              <search-select
                v-model="addFormData.sylx"
                table-name="SYS_FLAG_DATA"
                kid="FK000002"
                style="width: 100%"
                :backfillValue="addFormData.sylx"
                :clearable="false"
                disabled
              ></search-select>
            </el-form-item>
            <el-form-item label="付款类别" prop="fklb">
              <el-select v-model="addFormData.fklb" :clearable="false">
                <el-option
                  v-for="item in fklbList"
                  :key="item.fklb"
                  :label="item.lbmc"
                  :value="item.fklb"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="号码长度" prop="hmcd">
              <el-input placeholder="请输入..." v-model="addFormData.hmcd"></el-input>
            </el-form-item>
            <el-form-item label="付款精度" prop="fkjd">
              <search-select
                v-model="addFormData.fkjd"
                table-name="SYS_FLAG_DATA"
                kid="FK000001"
                style="width: 100%"
                :backfillValue="addFormData.fkjd"
                :clearable="false"
              ></search-select>
            </el-form-item>
            <el-form-item label="货币误差" prop="hbwc" disabled>
              <search-select
                v-model="addFormData.hbwc"
                table-name="SYS_FLAG_DATA"
                kid="FK000004"
                style="width: 100%"
                :backfillValue="addFormData.hbwc"
                disabled
              ></search-select>
            </el-form-item>
            <el-form-item label="舍入方式" prop="srfs">
              <search-select
                v-model="addFormData.srfs"
                table-name="SYS_FLAG_DATA"
                kid="FK000003"
                style="width: 100%"
                :backfillValue="addFormData.srfs"
                :clearable="false"
              ></search-select>
            </el-form-item>
            <el-form-item label="诊间使用标志" prop="zjjssy">
              <search-select
                placeholder="请输入..."
                v-model="addFormData.zjjssy"
                table-name="SYS_FLAG_DATA"
                kid="FD000005"
                style="width: 100%"
                :backfillValue="addFormData.zjjssy"
              ></search-select>
            </el-form-item>
            <el-form-item label="备注信息" prop="bzxx">
              <el-input placeholder="请输入..." v-model="addFormData.bzxx"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { rightScroll } from '@/utils/index.ts'
import { addFkfs, delFkfs, editFkfs, setHbwc, setMrbz, getFklb } from '@/api/his/sys/centerMaintenance/medicareInfoManage/payStyle.ts'
// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'clinicUsing',
  components: {}
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private isUpd: boolean = true // 新增与编辑切换
  private fklbList: Array<any> = [] // 付款类别数据
  private FKFS: number | null = null // 付款方式
  private SYLX: number | null = null // 使用类型
  private ZFBZ: number | null = null // 作废标志
  private searchData: any = {
    sylx: 1
  }
  private addFormData: any = {
    fkmc: '',
    sylx: '1',
    fklb: 1,
    hmcd: <number | null>null,
    fkjd: '3',
    hbwc: '0',
    srfs: '1',
    zjjssy: '',
    bzxx: ''
  }
  private tableData: Array<any> = []
  private addFormRules: any = {
    fkmc: [{ required: true, message: '付款名称不能为空', trigger: 'blur' }]
  }

  @Watch('tableData')
  private onValueChange(value: string) {
    rightScroll()
  }

  // 获取表格单行数据
  private getRowData(row: any) {
    this.FKFS = row.fkfs
    this.SYLX = row.sylx
    this.ZFBZ = row.zfbz
    this.isUpd = false
    console.log(row)
    this.addFormData = Object.assign(this.addFormData, row)
  }

  // 获取表格数据
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 获取获取付款类别数据
  private getFklbData() {
    const params: any = {
      pageNum: 1,
      pageSize: 100
    }
    getFklb(params).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        console.log(res)

        this.fklbList = res.data.list
      }
    })
  }

  // 新增按钮
  private handleAdd() {
    this.isUpd = true
    this.$nextTick(() => {
      const el: any = this.$refs.ruleForm
      el.resetFields()
    })
  }

  // 保存新增与修改
  private handleSave() {
    ;(this.$refs.ruleForm as Form).validate((valid: boolean) => {
      if (valid) {
        if (this.isUpd) {
          const params: any = {
            fkjd: this.addFormData.fkjd,
            fklb: this.addFormData.fklb,
            fkmc: this.addFormData.fkmc,
            hbwc: this.addFormData.hbwc,
            srfs: this.addFormData.srfs,
            sylx: this.addFormData.sylx,
            bzxx: this.addFormData.bzxx,
            hmcd: this.addFormData.hmcd,
            zjjssy: this.addFormData.zjjssy
          }
          addFkfs(params).then((res: any) => {
            if (res.errorCode === 'SUCCESS') {
              this.$notify({
                title: '新增成功',
                message: '',
                type: 'success'
              })
              this.getList()
              this.handleAdd()
            }
          })
        } else {
          editFkfs(this.addFormData).then((res: any) => {
            this.$notify({
              title: '修改成功',
              message: '',
              type: 'success'
            })
            this.getList()
            this.handleAdd()
          })
        }
      }
    })
  }

  // 注销与取消注销
  private handleEnable(row: any) {
    const params: any = {
      fkfs: row.fkfs,
      zfbz: row.zfbz == 1 ? 0 : 1
    }
    delFkfs(params).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        this.$notify({
          title: row.zfbz == 1 ? '已取消作废' : '已作废',
          message: '',
          type: 'success'
        })
        this.getList()
        this.handleAdd()
      }
    })
  }

  // 默认
  private handleDefault() {
    if (!this.isUpd) {
      if (this.ZFBZ == 0) {
        const params: any = {
          fkfs: this.FKFS,
          sylx: this.SYLX
        }
        setMrbz(params).then((res: any) => {
          if (res.errorCode == 'SUCCESS') {
            this.$notify({
              title: '已设为默认',
              message: '',
              type: 'success'
            })
            this.getList()
            this.handleAdd()
          }
        })
      } else {
        this.$message({
          message: '该付款方式已作废，不能设为默认付款方式！',
          type: 'warning'
        })
      }
    } else {
      this.$message({
        message: '请先选择行！',
        type: 'warning'
      })
    }
  }

  // 货币误差
  private handleError() {
    if (!this.isUpd) {
      if (this.ZFBZ == 0) {
        const params: any = {
          fkfs: this.FKFS,
          sylx: this.SYLX
        }
        setHbwc(params).then((res: any) => {
          if (res.errorCode === 'SUCCESS') {
            this.$notify({
              title: '设置成功',
              message: '',
              type: 'success'
            })
            this.getList()
            this.handleAdd()
          }
        })
      } else {
        this.$message({
          message: '该付款方式已作废，不能设为货币误差付款方式！',
          type: 'warning'
        })
      }
    } else {
      this.$message({
        message: '请先选择行！',
        type: 'warning'
      })
    }
  }

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    this.getList()
    this.getFklbData()
  }
}
</script>
<style lang="scss" scoped>
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

//右侧状态框悬浮
::v-deep .el-table__fixed-right {
  height: 100% !important;
}
</style>
