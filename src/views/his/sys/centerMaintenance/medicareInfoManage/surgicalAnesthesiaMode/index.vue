<!--
 * @Date:
 * @LastEditors:
 * @LastEditTime:
 * @description: 手术麻醉方式维护
 -->

<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="16">
        <div class="his-module his-small">
          <pagenation-list
            ref="pageTable"
            v-model="tableDatas"
            data-url="/op-service/optmzfs/queryPage"
            http-method="post"
            :list-height="listSlotHeight"
            :searchData="searchData"
          >
            <div slot="header" class="row" style="padding-bottom: 8px">
              <div class="label">
                <div style="font-size: 13px; margin-right: 8px;white-space: nowrap">搜索</div>
                <el-input
                  v-model="searchData.pydm"
                  placeholder="请输入拼音代码搜索"
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
            <el-table
              :data="tableDatas"
              border
              stripe
              :highlight-current-row="true"
              slot="list"
              :height="listSlotHeight"
              class="scroll-bar"
              @row-click="getRowData"
            >
              <!-- 序号 -->
              <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
              <!-- 麻醉名称 -->
              <el-table-column :label="$t('麻醉名称')" prop="mzmc"></el-table-column>
              <!--麻醉代码 -->
              <el-table-column prop="mzdm" :label="$t('麻醉代码')"></el-table-column>
              <!-- 拼音代码 -->
              <el-table-column prop="pydm" :label="$t('拼音代码')" width="120"></el-table-column>
              <!-- 操作 -->
              <el-table-column :label="$t('操作')" width="52" align="center">
                <template slot-scope="scope">
                  <!-- 删除 -->
                  <el-tooltip :content="$t('common.delete')" effect="light">
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
      <el-col class="ht" :span="8">
        <div class="his-module his-small">
          <div slot="header" class="row">
            <div class="label">
              <!-- 新增/编辑 -->
              <h1 class="title">{{ isUpd ? $t('common.add') : $t('common.edit') }}</h1>
            </div>
            <div class="operate">
              <el-button
                size="mini"
                type="primary"
                class="green-gra"
                icon="icon his-save"
                @click="handleSave"
              >{{ $t('common.save') }}</el-button>
            </div>
          </div>
          <el-form
            label-width="67px"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            class="retrieval"
          >
            <el-form-item label="麻醉名称" prop="mzmc">
              <el-input v-model="ruleForm.mzmc" placeholder="请输入麻醉名称" @blur="getPinyin"></el-input>
            </el-form-item>
            <el-form-item label="麻醉代码" prop="mzdm">
              <el-input v-model="ruleForm.mzdm" placeholder="请输入麻醉代码" type="number"></el-input>
            </el-form-item>
            <el-form-item label="拼音代码" prop="pydm">
              <el-input v-model="ruleForm.pydm" placeholder="请输入拼音代码"></el-input>
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
import { surgicalAnesthesia, getMnemonic,delSurgicalAnesthesia } from '@/api/his/sys/centerMaintenance/medicareInfoManage/surgicalAnesthesiaMode.ts'
//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'surgicalAnesthesiaMode'
})
export default class extends Vue {
  //声明变量，方法
  private tableDatas: Array<any> = [
    {
      pydm: 'JGBH',
      mzdm: '1',
      mzmc: '局部麻醉'
    }
  ] //表格数据
  private tipTitle: string = ''
  private isUpd: boolean = true //新增还是保存
  private listSlotHeight: number = 0 //高度
  private mzId: number | null = null // 门诊id
  private searchData: any = {
    pydm: ''
  } //搜索参数
  private ruleForm: any = {
    mzmc: '',
    mzdm: '',
    pydm: '',
    mzid: '',
  }
  private rules: object = {
    pydm: [{ required: true, message: '请输入拼音代码', trigger: 'blur' }],
    mzdm: [{ required: true, message: '请输入麻醉代码', trigger: 'blur' }],
    mzmc: [{ required: true, message: '请输入麻醉名称', trigger: 'blur' }]
  }

  // 条件查询
  searchLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }

  // 手术麻醉表格数据获取
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  //行点击切换新增/编辑
  private getRowData(row: any) {
    console.log(row);
    this.isUpd = false
    this.mzId = row.mzid
    this.ruleForm = Object.assign(this.ruleForm,row)
  }
  //新增
  private handleAdd() {
    this.isUpd = true
    this.$nextTick(()=> {
      const el: any = this.$refs.ruleForm
      el.resetFields()
    })
  }



  // 保存新增或修改
  private handleSave() {
    ;(this.$refs.ruleForm as Form).validate((valid: boolean)=> {
      if(valid) {
        if(this.isUpd){
          surgicalAnesthesia(this.ruleForm).then((res: any)=>{
            this.$notify({
              title: this.$t('common.addSuc').toString(),
              message: '',
              type: 'success'
            })
            this.getList()
            this.handleAdd()
          })
        } else {
          this.ruleForm.mzid = this.mzId
          surgicalAnesthesia(this.ruleForm).then((res: any)=>{
            this.$notify({
              title: this.$t('common.editSuc').toString(),
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

  // 删除
  private handleDelete() {
    delSurgicalAnesthesia({mzId: this.mzId}).then((res: any)=> {
      if(res.errorCode === "SUCCESS") {
        this.$notify({
          title: this.$t('common.delSuc').toString(),
          message: '',
          type: 'success'
        })
        this.getList()
        ;(this.$refs.ruleForm as Form).resetFields()
      }
    })
  }
  // 获取拼音码
  private getPinyin() {
    if (this.ruleForm.mzmc) {
      getMnemonic({ typeList: ['py'], value: this.ruleForm.mzmc }).then((res: any) => {
        console.log(res)
        if (res.errorCode == 'SUCCESS') {
          this.ruleForm.pydm = res.data.py
        }
      })
    } else {
      this.ruleForm.pydm = null
    }
  }
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 105
  }
  mounted() {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.title {
  height: 28px;
  display: flex;
  align-content: center;
  flex-direction: row;
  align-items: center;
}

.retrieval {
  margin: 24px auto !important;
  padding: 0 50px !important;
}
</style>
