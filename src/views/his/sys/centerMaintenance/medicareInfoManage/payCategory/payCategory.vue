<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="18">
        <div class="his-module his-small" style="padding: 8px 10px">
          <div class="row">
            <div class="label title">付款类别维护</div>
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
            data-url="/op-service/pubfklb/queryPage"
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
              @row-click="getRowData"
            >
              <el-table-column type="index" width="32" align="center"></el-table-column>
              <el-table-column label="类别名称" prop="lbmc"></el-table-column>
              <el-table-column label="门诊使用" prop="mzsy">
                <template slot-scope="scope">
                  <div
                    :class="scope.row.mzsy == 1 ? 'blues' : 'reds'"
                  >{{scope.row.mzsy == 1 ? '是' : '否'}}</div>
                </template>
              </el-table-column>
              <el-table-column label="住院使用" prop="zysy">
                <template slot-scope="scope">
                  <div
                    :class="scope.row.zysy == 1 ? 'blues' : 'reds'"
                  >{{scope.row.zysy == 1 ? '是' : '否'}}</div>
                </template>
              </el-table-column>
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
                      <el-button
                        @click.stop
                        slot="reference"
                        class="red"
                      >
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
            ref="ruleForm"
            :model="addFormData"
            class="retrieval"
            :rules="ruleForm"
            label-width="67px"
          >
            <el-form-item label="类别名称" prop="lbmc">
              <el-input placeholder="请输入..." v-model="addFormData.lbmc"></el-input>
            </el-form-item>
            <el-form-item label="门诊使用" prop="mzsy">
              <search-select
                table-name="SYS_FLAG_DATA"
                kid="FD000005"
                v-model="addFormData.mzsy"
                placeholder="请选择"
                style="width: 100%"
                :backfillValue="addFormData.mzsy"
                :clearable="false"
              ></search-select>
            </el-form-item>
            <el-form-item label="住院使用" prop="zysy">
              <search-select
                v-model="addFormData.zysy"
                table-name="SYS_FLAG_DATA"
                kid="FD000005"
                style="width: 100%"
                :backfillValue="addFormData.zysy"
                :clearable="false"
              ></search-select>
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
import { addFklb, delFklb, editFklb } from '@/api/his/sys/centerMaintenance/medicareInfoManage/payCategory.ts'
// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'payCategory',
  components: {}
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private isUpd: boolean = true // 新增与编辑切换
  private value: any = ''
  private addFormData: any = {
    lbmc: '',
    mzsy: 1,
    zysy: 1
  }
  private ruleForm: any = {
    lbmc: [{ required: true, message: '类别名称不能为空', trigger: 'blur' }]
  } // 表单验证
  private searchData: any = {
    pydm: ''
  }
  private tableData: Array<any> = []
  @Watch('tableData')
  private onValueChange(value: string) {
    rightScroll()
  }

  // 获取表格数据
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 获取表格单行数据
  private getRowData(row: any) {
    this.isUpd = false
    console.log(row);
    this.addFormData = Object.assign(this.addFormData, row)
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
        const params1: any = {
          lbmc: this.addFormData.lbmc,
          mzsy: this.addFormData.mzsy,
          zysy: this.addFormData.zysy,
        }
        if (this.isUpd) {
          addFklb(params1).then((res: any) => {
            if (res.errorCode == 'SUCCESS') {
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
          editFklb(this.addFormData).then((res: any) => {
            if (res.errorCode == 'SUCCESS') {
              this.$notify({
                title: '修改成功',
                message: '',
                type: 'success'
              })
              this.getList()
              this.handleAdd()
            }
          })
        }
      }
    })
  }

  // 删除
  private handleDelete(row: any) {
    delFklb({fklb: row.fklb}).then((res: any)=>{
      if(res.errorCode == "SUCCESS") {
        this.$notify({
          title: '已删除',
          message: '',
          type: 'success'
        })
        this.getList()
        this.handleAdd()
      }
    })
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
