<!--
 * @Author: 董亮
 * @LastEditTime:
 * @LastEditors: 董亮
 * @Description: 给药途径维护
 * @FilePath: \web-op\src\views\his\sys\centerMaintenance\routeAdministration\routeAdministration.vue
 -->
<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="18">
        <div class="his-module his-small" style="padding: 8px 10px">
          <div class="row">
            <div class="label">
              <div style="font-size: 13px; margin-right: 8px;">搜索</div>
              <el-input
                v-model="searchData.pydm"
                placeholder="请输入拼音码"
                clearable
                @keyup.native.enter="searchLists"
                @clear="searchLists"
              >
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input>
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
            data-url="/op-service/imdicypyf/queryPage"
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
              highlight-current-row
            >
              <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
              <el-table-column label="名称" prop="xmmc" width="80"></el-table-column>
              <el-table-column label="拼音代码" prop="pydm" width="110px" show-overflow-tooltip></el-table-column>
              <el-table-column label="归并类别" prop="xmlb" width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>{{$store.state.webSqlDict.MERGE_CATEGORY_DICT.find(item => item.dv == scope.row.xmlb) && $store.state.webSqlDict.MERGE_CATEGORY_DICT.find(item => item.dv == scope.row.xmlb).dn}}</div>
                </template>
              </el-table-column>
              <el-table-column label="卡片打印" prop="kpdy" width="85px">
                <template slot-scope="scope">
                  <div
                    :class="[scope.row.kpdy == '1' ? 'blues' : 'reds']"
                  >{{scope.row.kpdy == '1' ? '是' : '否'}}</div>
                </template>
              </el-table-column>
              <el-table-column label="附加项目" prop="fyxh">
                <template slot-scope="scope">
                  <div>{{fyxhList.find(item => item.fyxh == scope.row.fyxh) && fyxhList.find(item => item.fyxh == scope.row.fyxh).fymc}}</div>
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
                      <el-button @click.stop slot="reference" class="red">
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
            class="retrieval"
            label-width="65px"
            :model="addRuleForm"
            ref="addFormRef"
            :rules="ruleForm"
          >
            <el-form-item label="名称" prop="xmmc">
              <el-input v-model="addRuleForm.xmmc" @blur="getPycode" placeholder="请输入..."></el-input>
            </el-form-item>
            <el-form-item label="归并类别">
              <search-select
                table-name="SYS_FLAG_DATA"
                kid="GY000001"
                style="width:100%"
                v-model="addRuleForm.xmlb"
                :backfillValue="addRuleForm.xmlb"
              ></search-select>
            </el-form-item>
            <el-form-item label="卡片打印">
              <search-select
                table-name="SYS_FLAG_DATA"
                kid="FD000005"
                v-model="addRuleForm.kpdy"
                :backfillValue="addRuleForm.kpdy"
                style="width: 100%"
              ></search-select>
            </el-form-item>
            <el-form-item label="拼音代码">
              <el-input v-model="addRuleForm.pydm" placeholder="请输入..."></el-input>
            </el-form-item>
            <el-form-item label="附加项目">
              <!-- <el-input v-model="addRuleForm.fyxh" placeholder="请输入..."></el-input> -->
              <remote-search-select
                searchUrl="/addItems/queryChargeList"
                :resultTableHeader="resultHeader"
                :popover-width="400"
                :searchData="{
                    pydm:  ''
                  }"
                searchField="query"
                showLabel="fymc"
                data-type="1"
                ref="remoteSearchSelect"
                v-model="addRuleForm.fymc"
                @getData="getData"
              >
                <el-select
                  v-model="addRuleForm.fymc"
                  ref="select"
                  class="search-select"
                  remote
                  filterable
                  :popper-append-to-body="false"
                  @blur="selectBlur"
                  :remote-method="
                          query => {
                            remoteMethod(query)
                          }
                      "
                  :clearable="true"
                >
                  <div slot="empty">
                    <template>
                      <div>{{fyxhList.find(item => item.fyxh == addRuleForm.fyxh) && fyxhList.find(item => item.fyxh == addRuleForm.fyxh).fymc}}</div>
                    </template>
                  </div>
                </el-select>
              </remote-search-select>
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
import { addChannel, delChannel, editChannel, getMnemonic, getfyxhData } from '@/api/his/sys/centerMaintenance/medicareInfoManage/routeAdministration.ts'
import { log } from 'util'
// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'routeAdministration',
  components: {}
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private textarea: string = ''
  private isUpd: boolean = true // 新增与编辑切换
  private value: any = ''
  private fyxhList: Array<any> = [] // 存储附加项目数据
  private searchData: any = {
    pydm: ''
  }
  private tableData: Array<any> = []
  private addRuleForm: any = {
    xmmc: '',
    bzbm: '',
    fyxh: '',
    kpdy: 0,
    xmlb: 0,
    yzpx: 0,
    pydm: '',
    ypyf: '',
    fymc: ''
  }
  private resultHeader = [
    {
      prop: 'fymc',
      label: '项目名称'
    },
    {
      prop: 'fyxh',
      label: '项目序号',
      width: 80
    }
  ]
  private ruleForm: any = {
    xmmc: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
  }

  // 表格查询
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 条件查询
  private searchLists() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

  // 获取附加项目数据
  private getfyxhData() {
    getfyxhData({ pageSize: 10000 }).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        console.log(res)
        this.fyxhList = res.data.list
        console.log(this.fyxhList)
        if (this.fyxhList.length > 0) {
          this.getList()
        }
      }
    })
    // this.$nextTick(() => {})
  }

  // 获取表格单行数据
  private getRowData(row: any) {
    this.isUpd = false
    console.log(row)
    this.addRuleForm = Object.assign(this.addRuleForm, row)
    this.addRuleForm.fymc = row.fyxh
  }

  private getData(data: any) {
    this.addRuleForm.fyxh = data.fyxh
  }

  // 新增按钮
  private handleAdd() {
    this.isUpd = true
    this.addRuleForm = {
      xmmc: '',
      bzbm: '',
      fyxh: '',
      kpdy: '',
      xmlb: '',
      yzpx: '',
      ypyf: ''
    }
  }

  // 新增修改的保存
  private handleSave() {
    if (this.isUpd) {
      ;(this.$refs.addFormRef as Form).validate((valid: boolean) => {
        if (valid) {
          addChannel(this.addRuleForm).then((res: any) => {
            if (res.errorCode === 'SUCCESS') {
              console.log(res)
              this.$notify({
                title: '新增成功',
                message: '',
                type: 'success'
              })
              this.isUpd = true
              this.getList()
              this.addRuleForm = {
                xmmc: '',
                bzbm: '',
                fyxh: '',
                kpdy: '',
                xmlb: '',
                yzpx: ''
              }
            }
          })
        }
      })
    } else {
      ;(this.$refs.addFormRef as Form).validate((valid: boolean) => {
        if (valid) {
          editChannel(this.addRuleForm).then((res: any) => {
            if (res.errorCode === 'SUCCESS') {
              console.log(res)
              this.$notify({
                title: '修改成功',
                message: '',
                type: 'success'
              })
              this.isUpd = true
              this.getList()
              this.addRuleForm = {
                xmmc: '',
                bzbm: '',
                fyxh: '',
                kpdy: '',
                xmlb: '',
                yzpx: ''
              }
            }
          })
        }
      })
    }
  }

  // 删除
  private handleDelete() {
    delChannel({ ypyf: this.addRuleForm.ypyf }).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        this.$notify({
          title: '已删除',
          message: '',
          type: 'success'
        })
        this.isUpd = true
        this.getList()
        this.addRuleForm = {
          xmmc: '',
          bzbm: '',
          fyxh: '',
          kpdy: '',
          xmlb: '',
          yzpx: '',
          ypyf: ''
        }
      }
    })
  }

  private remoteMethod(query: string) {
    if (query.length > 1) {
      this.$nextTick(() => {
        ;(this.$refs.remoteSearchSelect as any).remoteMethod(query)
      })
    } else {
      ;(this.$refs.remoteSearchSelect as any).closePopover()
    }
  }

  private selectBlur() {
    ;(this.$refs.remoteSearchSelect as any).selectBlur()
  }

  // 获取拼音码
  private getPycode() {
    if (this.addRuleForm.xmmc) {
      getMnemonic({ typeList: ['py'], value: this.addRuleForm.xmmc }).then((res: any) => {
        if (res) {
          this.addRuleForm.pydm = res.data.py
        }
      })
    } else {
      this.addRuleForm.pydm = null
    }
  }

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    this.getfyxhData()
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
.content .his-module .el-form .el-form-item::v-deep .el-select--medium .el-input__inner {
  width: 100%;
}
</style>
