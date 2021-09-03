// 西医疾病编码维护
<template>
  <div>
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="18">
        <div class="his-module his-small" style="padding: 8px 10px">
          <div class="row">
            <div class="label">
              <div style="font-size: 13px; margin-right: 8px;">搜索</div>
              <el-input
                v-model="searchData.pydm"
                placeholder="请输入拼音码"
                @keyup.native.enter="searchLists"
                clearable
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
            data-url="/op-service/dicjbbm/westQueryPage"
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
              <el-table-column prop="webSortNumber" width="32" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="ICD编码" prop="icd10" width="80"></el-table-column>
              <el-table-column label="疾病名称" prop="jbmc" min-width="150" show-overflow-tooltip></el-table-column>
              <el-table-column label="拼音码" prop="pydm" width="140" show-overflow-tooltip></el-table-column>
              <el-table-column label="疾病判别" prop="jbpb" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>{{transer(scope.row.jbpb)}}</div>
                </template>
              </el-table-column>
              <el-table-column label="疾病报告卡" prop="jbbgk" width="90">
                <template slot-scope="scope">
                  <div>{{$store.state.webSqlDict.DISEASE_CARD_DICT.find(item => item.dv == scope.row.jbbgk) && $store.state.webSqlDict.DISEASE_CARD_DICT.find(item => item.dv == scope.row.jbbgk).dn}}</div>
                </template>
              </el-table-column>
              <el-table-column label="肠道门诊诊断" prop="cdmzzd" width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div
                    :class="[scope.row.cdmzzd == '1' ? 'blues' : 'reds']"
                  >{{scope.row.cdmzzd == '1' ? '是' : '否'}}</div>
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
            :model="addRuleForm"
            ref="addFormRef"
            class="retrieval"
            label-width="90px"
            :rules="addFormRule"
          >
            <el-form-item label="ICD编码" prop="icd10">
              <el-input v-model="addRuleForm.icd10" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="疾病名称" prop="jbmc">
              <el-input v-model="addRuleForm.jbmc" @blur="getPycode" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="拼音码" prop="pydm">
              <el-input v-model="addRuleForm.pydm" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="疾病判别" prop="jbpb">
              <el-select placeholder="请选择" v-model="addRuleForm.jbpb" multiple collapse-tags>
                <el-option
                  v-for="item in this.jbpbList"
                  :key="item.dv"
                  :label="item.dn"
                  :value="item.dv"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="疾病报告卡" prop="jbbgk">
              <search-select
                table-name="SYS_FLAG_DATA"
                kid="JB000002"
                v-model="addRuleForm.jbbgk"
                style="width: 100%"
                :backfillValue="addRuleForm.jbbgk"
              ></search-select>
            </el-form-item>
            <el-form-item label="肠道门诊诊断" prop="cdmzzd">
              <search-select
                v-model="addRuleForm.cdmzzd"
                table-name="SYS_FLAG_DATA"
                kid="FD000005"
                style="width: 100%"
                :backfillValue="addRuleForm.cdmzzd"
              ></search-select>
            </el-form-item>
            <el-form-item label="备注信息" prop="bzxx">
              <el-input type="textarea" placeholder="请输入内容" :rows="4" v-model="addRuleForm.bzxx"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { getMnemonic, addWestDisease, delWestDisease, editWestDisease } from '@/api/his/sys/centerMaintenance/medicareInfoManage/diseaseCode.ts'
import { Form } from 'element-ui'
// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'xyDiseases',
  components: {}
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private textarea: string = ''
  private isUpd: boolean = true // 新增与编辑切换
  private value: any = ''
  private jbpbList: Array<any> = [] // 疾病判别
  private addRuleForm: any = {
    icd10: '',
    jbmc: '',
    pydm: '',
    jbpb: [],
    jbbgk: '',
    cdmzzd: '',
    bzxx: '',
    dmlb: 10
  }
  private searchData: any = {
    pydm: '',
    icd10: ''
  }
  private tableData: Array<any> = []
  private addFormRule: any = {
    icd10: [{ required: true, message: 'ICD编码不能为空', trigger: 'blur' }],
    jbmc: [{ required: true, message: '疾病名称不能为空', trigger: 'blur' }]
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

  // 获取表格行数据
  private getRowData(row: any) {
    const el: any = this.$refs.addFormRef
    el.resetFields()
    this.isUpd = false
    this.addRuleForm = Object.assign(this.addRuleForm, row)
    if (!this.addRuleForm.jbpb) {
      this.addRuleForm.jbpb = []
    } else {
      this.addRuleForm.jbpb = this.addRuleForm.jbpb.split(',')
    }
    console.log(this.addRuleForm)
  }

  // 新增按钮
  private handleAdd() {
    this.isUpd = true
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
          this.addRuleForm.jbpb = this.addRuleForm.jbpb.join(',')
          console.log(this.addRuleForm.jbpb)
          addWestDisease(this.addRuleForm).then((res: any) => {
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
          editWestDisease(this.addRuleForm).then((res: any) => {
            if (res.errorCode === 'SUCCESS') {
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

  // 获取拼音码
  private getPycode() {
    if (this.addRuleForm.jbmc) {
      getMnemonic({ typeList: ['py'], value: this.addRuleForm.jbmc }).then((res: any) => {
        if (res) {
          this.addRuleForm.pydm = res.data.py
        }
      })
    } else {
      this.addRuleForm.pydm = null
    }
  }

  // 删除
  private handleDelete() {
    delWestDisease({ jbxh: this.addRuleForm.jbxh }).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
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

  // 获取疾病判别数据
  private getDiseaseData() {
    this.jbpbList = this.$store.state.webSqlDict.DISEASE_DISCRIMIN_DICT
    console.log(this.jbpbList)
  }

  // 疾病判别字典转换
  private transer(jbpb: string | null) {
    if (jbpb != null) {
      let jbpbName: Array<any> = []
      jbpb.split(',').forEach((el: any) => {
        let name = this.$store.state.webSqlDict.DISEASE_DISCRIMIN_DICT.find((item: any) => item.dv == el) && this.$store.state.webSqlDict.DISEASE_DISCRIMIN_DICT.find((item: any) => item.dv == el).dn
        jbpbName.push(name)
      })
      return jbpbName.join(',')
    }
  }

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    this.getList()
    this.getDiseaseData()
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
</style>
