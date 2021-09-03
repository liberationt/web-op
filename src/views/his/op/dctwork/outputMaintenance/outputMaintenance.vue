<!--
 * @Author: 董亮
 * @LastEditTime: 2020-09-03 19:05:24
 * @LastEditors: 曹俊
 * @Description: 
 * @FilePath: \web-op\src\views\his\op\dctwork\outputMaintenance\outputMaintenance.vue
 -->
<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="16">
        <div class="his-module his-small">
          <setting-list
            ref="pageTable"
            data-name="PHAR_RKFS"
            data-type="1"
            :data-action="true"
            data-fixed="undefined"
            :data-width="52"
            v-model="list"
            :list-height="listSlotHeight + 13"
            :searchData="searchData"
            http-method="post"
            @selectCurrentRow="handleChange"
            :dataSelect="true"
          >
            <div slot="header">
              <div class="row">
                <div class="label">
                  <h1 class="title">{{$t('output.title')}}</h1>
                  <el-input
                    v-model="searchData.PHAR_RKFS_PYDM"
                    placeholder="请输入拼音代码查询"
                    @change="handleSearch"
                    @clear="getList"
                    @keyup.enter.native="getList"
                    clearable
                  >
                    <i slot="prefix" class="el-input__icon icon his-search"></i>
                  </el-input>
                </div>
                <div class="operate">
                  <el-button
                    type="primary"
                    class="blue-gra"
                    icon="icon his-add"
                    @click="handleAdd"
                    size="mini"
                  >{{$t('common.add')}}</el-button>
                </div>
              </div>
            </div>
            <div slot="action" slot-scope="data">
              <el-tooltip :content="$t('common.delete')" placement="bottom" effect="light">
                <el-popconfirm
                  hideIcon
                  :confirmButtonText="$t('common.confirm')"
                  :cancelButtonText="$t('common.cancel')"
                  :title="$t('common.delTip')"
                  @confirm="handleDelete(data.scope)"
                >
                  <el-button slot="reference" class="red">
                    <i class="icon his-del"></i>
                  </el-button>
                </el-popconfirm>
              </el-tooltip>
            </div>
          </setting-list>
        </div>
      </el-col>
      <el-col class="ht" :span="8">
        <div class="his-module">
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
            :model="forms"
            ref="formValidate"
            :rules="rules"
            label-width="74px"
            class="retrieval"
          >
            <!-- 方式名称 -->
            <el-form-item label="方式名称" prop="PHAR_RKFS_FSMC">
              <el-input v-model.trim="forms.PHAR_RKFS_FSMC" :placeholder="$t('common.placeholder')" @blur="getPinyin"></el-input>
            </el-form-item>
            <!-- 入库单号 -->
            <el-form-item :label="$t('output.num')" prop="PHAR_RKFS_RKDH">
              <el-input v-model="forms.PHAR_RKFS_RKDH" :placeholder="$t('common.placeholder')" min=1 type="number"></el-input>
            </el-form-item>
            <!-- 拼音代码 -->
            <el-form-item :label="$t('output.pym')" prop="PHAR_RKFS_PYDM">
              <el-input v-model="forms.PHAR_RKFS_PYDM" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <!-- 排序号 -->
            <el-form-item :label="$t('common.SortNumber')" prop="PHAR_RKFS_PXH">
              <el-input v-model="forms.PHAR_RKFS_PXH" :placeholder="$t('common.placeholder')" type="number"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { 
  saveInPha,
  deleteInStyle, 
  isRepet, 
  getPxh,
  isUsing, 
  getMnemonic
} from '@/api/his/pha/im_herbpharmacy/inoutMainance.ts'
import { Form } from 'element-ui'
import { log } from 'util'

@Component({
  name: 'outputMaintenance',
  filters: {},
  components: {}
})
export default class extends Vue {
  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight - 51 - 40 - 30
  }
  mounted() {
    this.searchData.PHAR_RKFS_JGID = this.userInfo.hospitalId
    this.searchData.PHAR_RKFS_YFSB = Vue.prototype.AUTHORITY.bussinessRole
    this.title = this.$t('common.add').toString()
    this.getList()
  }

  private searchData: any = {
    PHAR_RKFS_PYDM: null,
    PHAR_RKFS_JGID: null,
    PHAR_RKFS_YFSB: null,
    PHAR_RKFS_RKFS: null
  }
  private list: any = []
  private listSlotHeight: number = 0 //列表高度
  private isEdit: boolean = true
  private forms: any = {
    PHAR_RKFS_FSMC: '',
    PHAR_RKFS_JGID: 310112041,
    PHAR_RKFS_PYDM: '',
    PHAR_RKFS_RKDH: '',
    PHAR_RKFS_RKFS: '',
    PHAR_RKFS_YFSB: 1,
    webRowStatus: false,
    PHAR_RKFS_PXH: null
  }

  private formData = {
    fsmc:<string> '',
    jgid:<number> 0,
    pydm:<string> '',
    rkdh:<number> 0,
    rkfs:<any> null,
    yfsb:<number> 0,
    pxh:<number> 0
  }

  private listQuery: any = {
    pageNum: 1,
    pageSize: 10,
    parentMenuId: 0
  }
  private title: string = ''
  private isUpd: boolean = true // 新增、修改

  private validRkmc: any = (rule: any, value: any, callback: any) => {
    this.checkRkmc(value, callback)
  }

  private validRkdh: any = (rule: any, value: any, callback: any) => {
    if(!(/(^[1-9]\d*$)/.test(value))){
      callback(new Error('入库单号应为正整数'))
    }else{
      callback()
    }
  }
  // 验证规则
  private rules = {
    PHAR_RKFS_FSMC: [
      {
        required: true,
        message: '入库名称不能为空',
        trigger: 'blur'
      },
      {validator: this.validRkmc, trigger: 'blur'}
    ],
    PHAR_RKFS_RKDH: [
      {
        required: true,
        message: '入库单号不能为空',
        trigger: 'blur'
      },
      {validator: this.validRkdh, trigger: 'blur'}
    ],
    PHAR_RKFS_PYDM: [
      {
        required: true,
        message: '拼音代码不能为空',
        trigger: 'blur'
      }
    ]
  }

  // 查重入库方式名称
  private checkRkmc(value: any, callback: any){
    if(this.forms.PHAR_RKFS_FSMC){
      let param: any = {  
        mc: this.forms.PHAR_RKFS_FSMC,
        pb: 'rk', 
        pkey: this.isUpd ? null : this.forms.PHAR_RKFS_RKFS,
        yfsb: this.searchData.PHAR_RKFS_YFSB
      }
      isRepet(param).then((res: any) => {
        if(res){
          if(res.message==null){
            callback()
          }else{
            callback(new Error(res.message))
          }
        }
      })
    }else{
      callback()
    }
  }

  // 获取用户信息
  get userInfo() {
    return JSON.parse(localStorage.userInfo)
  }

  // 查询搜索
  private handleSearch() {}

  // 清除输入框
  private clearSearch() {}
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 获取表格行数据并切换编辑与新增的状态
  private handleChange(row: any) {
    console.log(row);
    (this.$refs.formValidate as Form).resetFields()
    this.isUpd = false
    // 克隆数据 （目标，源）
    this.forms = Object.assign(this.forms, row.data)
  }

  // 点击新增按钮并清空表单数据
  private handleAdd() {
    (this.$refs.formValidate as any).resetFields();
    this.isUpd = true
    this.formData.rkfs = null
    let param: any = {
      type: 'rk',
      yfsb: this.searchData.PHAR_RKFS_YFSB
    }
    getPxh(param).then((res: any) => {
      if(res.errorCode=='SUCCESS'){
        this.forms.PHAR_RKFS_PXH = res.data
      }
    })
  }

  // 保存
  private handleSave() {
    this.formData.fsmc = this.forms.PHAR_RKFS_FSMC
    this.formData.jgid = this.userInfo.hospitalId
    this.formData.pydm = this.forms.PHAR_RKFS_PYDM
    this.formData.rkdh = this.forms.PHAR_RKFS_RKDH
    this.formData.rkfs = this.isUpd ? null : this.forms.PHAR_RKFS_RKFS
    this.formData.yfsb = Vue.prototype.AUTHORITY.bussinessRole
    this.formData.pxh = this.forms.PHAR_RKFS_PXH;
     const formData: any = this.$refs['formValidate']
    formData.validate((valid: any) => {   
      if (valid) {
        saveInPha(this.formData).then((res: any) => {
          if (this.isUpd) {
            this.$notify({
              title: this.$t('common.addSuc').toString(),
              message: '',
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: this.$t('common.editSuc').toString(),
              message: '',
              type: 'success'
            })
            this.getList()
          }
          ;(this.$refs.formValidate as any).resetFields()
          this.formData.rkfs = null
        })
      }
    })
  }

  // 删除
  private handleDelete(row: any) {
    console.log(row)
    isUsing({ fspb: 'rk', yfsb: row.PHAR_RKFS_YFSB, keyValue: row.PHAR_RKFS_RKFS }).then((res: any) => {
      deleteInStyle({ rkfs: row.PHAR_RKFS_RKFS, yfsb: row.PHAR_RKFS_YFSB }).then((res: any) => {
        this.getList()
        this.$notify({
          title: this.$t('common.delSuc').toString(),
          message: '',
          type: 'success'
        });
        (this.$refs.formValidate as any).resetFields()
      })
    })
  }
  // 获取拼音码
  private getPinyin() {
    if(this.forms.PHAR_RKFS_FSMC){
        getMnemonic({typeList: ["py"], value: this.forms.PHAR_RKFS_FSMC}).then((res: any)=>{
        if(res) {
          this.forms.PHAR_RKFS_PYDM = res.data.py
        }
      })
    } else {
      this.forms.PHAR_RKFS_PYDM = null
    }
    
  }
}
</script>
<style lang="scss" scoped>
.content .his-small .row .label .title {
  margin-right: 8px !important;
}

.retrieval {
  margin: 0 atuo !important;
}

.content .his-module .el-form::v-deep {
  padding: 0 23px;
  margin: 16px auto;
  .el-form-item {
    margin-bottom: 12px;
    .el-input--medium {
      .el-input__inner {
        height: 28px;
        line-height: 28px;
      }
    }
  }
}
.row {
  height: 41px;
}
</style>
