<!--
 * @Author: 张文奇
 * @Date: 2020-04-16 11:20:29
 * @LastEditTime: 2020-09-08 20:37:22
 * @Description: 医疗器械
 * @FilePath: \web-op\src\views\his\medinsuinterface\treatmentItems\treatmentItems.vue
 -->

<template>
  <div class="content">
    <div class="his-module">
      <pagenation-list
        ref="pageTable"
        data-url="/op-service/shybzlxmxx/queryPage"
        v-model="tableData"
        :searchData="searchData"
        http-method="post"
        :list-height="listSlotHeight"
      >
        <div slot="header" class="row">
          <div class="label">
            <h1 class="title" style="flex:1">{{$t('treatmentItems.title')}}</h1>
            <el-input
              v-model="searchData.itemName"
              :placeholder="$t('medicalDevice.inputHolder')"
              @keyup.enter.native="getList"
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
            >{{$t('common.add')}}</el-button>
            <el-button
              type="primary"
              class="green-gra"
              icon="icon his-import"
              shadow
              iconSize="10"
              @click="handleImport"
            >{{$t('common.importFile')}}</el-button>
          </div>
        </div>
        <el-table
          slot="list"
          stripe
          :data="tableData"
          border
          lazy
          :height="listSlotHeight"
          class="scroll-bar"
        >
          <el-table-column prop="ybCode" :label="$t('medicalDevice.medicareCode')" width="140"></el-table-column>
          <el-table-column prop="priceNo" :label="$t('treatmentItems.priceCoding')" width="100"></el-table-column>
          <el-table-column prop="payType" :label="$t('medicalDevice.paymentMethod')" min-width="50"></el-table-column>
          <el-table-column prop="itemName" :label="$t('medicalDevice.projectName')" min-width="200"></el-table-column>
          <el-table-column prop="autName" :label="$t('medicalDevice.salesUnit')" width="65"></el-table-column>
          <el-table-column prop="price" :label="$t('treatmentItems.charges')" width="80"></el-table-column>
          <el-table-column prop="costType" :label="$t('treatmentItems.costCategory')" width="100"></el-table-column>
          <el-table-column :label="$t('common.action')" width="60" align="center">
            <template slot-scope="{ row }">
              <el-tooltip :content="$t('common.modify')" effect="light">
                <el-button class="blue" @click="handleEdit(row)">
                  <i class="icon his-edit" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </pagenation-list>
      <div class="el-modal-mask" v-show="isMask"></div>
      <div class="el-modal" v-show="isVisiable">
        <div class="v-modal-header">
          <div class="v-modal-header-inner">{{title}}</div>
          <div class="v-modal-close" @click="handleClose">
            <i class="icon his-control-close"></i>
          </div>
        </div>
        <div class="v-modal-wrap">
          <div class="v-modal-body">
            <editDevice v-model="form" @cancle="handleClose" @submit="handleSubmit"></editDevice>
          </div>
        </div>
      </div>
      <div>
        <upload-Modal
          :showUpload="showUpload"
          :url="pagetype == 1 ? '/op-service/shybylqcxx/impExcel' : '/op-service/shybzlxmxx/impExcel'"
          @close="closeModal"
          :fileTypes="fileTypes"
        ></upload-Modal>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import editDevice from './components/editItem.vue'
import uploadModal from '../medicalDevice/components/uploadFile.vue'
import { itemTreament, addTreament, editTreament } from '@/api/his/medinsuinterface/treatmentItems.ts'
// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'treatmentItems',
  filters: {},
  components: {
    editDevice,
    uploadModal,
  },
})
export default class extends Vue {
  // 声明变量，方法
  private tableData: any[] = []
  private searchData: any[] = []
  private list: any[] = []
  private title = window.ele.$i18n.t('treatmentItems.dilogTitleAdd')
  private fileTypes = ['xls', 'xlsx']
  //模态框状态
  private isMask = false
  private isVisiable = false

  private form = {}
  private showUpload: boolean = false
  private listSlotHeight: number = 0
  private pagetype: number = 2 //上传文件接口
  // 监听方法
  @Watch('')
  // 生命周期
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 51 - 40 - 30
  }
  mounted() {
    this.getList()
  }

  // 获取数据
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }
  // 新增
  private handleAdd() {
    // 显示模态框
    this.isMask = true
    this.isVisiable = true
    this.title = window.ele.$i18n.t('treatmentItems.dilogTitleAdd')
    this.form = {}
  }

  // 关闭弹框
  private handleClose(val: any) {
    // 关闭模态框
    this.isMask = false
    this.isVisiable = false
  }
  // 提交
  private handleSubmit(val: any) {
    if (!val.ybitemdataId) {
      addTreament(val).then((res: any) => {
        this.$notify({
          title: this.$t('common.addSuc').toString(),
          message: '',
          type: 'success',
        })
      })
    } else {
      editTreament(val).then((res: any) => {
        this.$notify({
          title: this.$t('common.editSuc').toString(),
          message: '',
          type: 'success',
        })
      })
    }
    // 关闭模态框
    this.isMask = false
    this.isVisiable = false
    this.getList()
  }

  // 编辑
  private handleEdit(val: any) {
    // 显示模态框
    this.isMask = true
    this.isVisiable = true
    this.title = window.ele.$i18n.t('treatmentItems.dilogTitleEdit')
    console.log('val', val)
    this.form = Object.assign({}, val)
  }

  // TODO: 文件上传
  private handleImport() {
    this.showUpload = true
  }

  //关闭弹窗
  private closeModal(val: boolean) {
    if (val) {
      this.showUpload = false
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-modal {
  height: 450px;
}
.his-module {
  ::v-deep .el-dialog .el-dialog__body {
    padding: 37px 0px 0px;
  }
  ::v-deep .el-form {
    margin: 10px auto;
  }
}
.title {
  width: fit-content;
}
</style>
