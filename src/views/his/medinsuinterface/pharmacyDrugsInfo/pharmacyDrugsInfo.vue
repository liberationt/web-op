<!--
 * @Author: 曹俊
 * @LastEditTime: 2020-09-11 15:41:05
 * @LastEditors: Please set LastEditors
 * @Description:
 * @FilePath: \web-op\src\views\his\medinsuinterface\pharmacyDrugsInfo\pharmacyDrugsInfo.vue
 -->

<template>
  <div class="content">
    <div class="his-module">
      <div class="row">
        <div class="label">
          <!-- 标题 -->
          <h1 class="title" style="flex:1">{{$t('pharmacyDrugsInfo.title')}}</h1>
        </div>
        <div class="operate">
          <!-- 新增 -->
          <el-button
            type="primary"
            class="blue-gra"
            icon="icon his-add"
            @click="handleAdd"
          >{{$t('common.add')}}</el-button>
          <!-- 文件导入 -->
          <el-button
            type="primary"
            class="green-gra"
            icon="icon his-import"
            shadow
            iconSize="10"
            @click="handleImport"
          >{{$t('common.import')}}</el-button>
        </div>
      </div>
      <!-- tab 标签页 -->
      <el-tabs v-model="activeName" @tab-click="chooseName">
        <!-- 药品品规基础信息 -->
        <el-tab-pane :label="$t('pharmacyDrugsInfo.qualitySpec')" name="qualitySpec">
          <search v-model="searchData" @setList="getList"></search>
          <quality-spec v-model="list" ref="qualitySpec"></quality-spec>
        </el-tab-pane>
        <!-- 药品价格规则 -->
        <el-tab-pane :label="$t('pharmacyDrugsInfo.priceRule')" name="priceRule">
          <query v-model="searchData" @setList="getList"></query>
          <price-rule v-model="list" ref="priceRule"></price-rule>
        </el-tab-pane>
        <!-- 药品采购规则 -->
        <el-tab-pane :label="$t('pharmacyDrugsInfo.purchase')" name="purchase">
          <query v-model="searchData" @setList="getList"></query>
          <purchase v-model="list" ref="purchase"></purchase>
        </el-tab-pane>
        <!-- 药品配送企业 -->
        <el-tab-pane :label="$t('pharmacyDrugsInfo.delivery')" name="delivery">
          <query v-model="searchData"></query>
          <delivery v-model="list" ref="delivery"></delivery>
        </el-tab-pane>
        <!-- 药品医保可报销条件规则 -->
        <el-tab-pane :label="$t('pharmacyDrugsInfo.reimbursement')" name="reimbursement">
          <query v-model="searchData" @setList="getList"></query>
          <reimbursement v-model="list" ref="reimbursement"></reimbursement>
        </el-tab-pane>
        <!-- 医保报销比例规则 -->
        <el-tab-pane :label="$t('pharmacyDrugsInfo.proportion')" name="proportion">
          <query v-model="searchData" @setList="getList"></query>
          <proportion v-model="list" ref="proportion"></proportion>
        </el-tab-pane>
        <!-- <el-tab-pane label="药事药品导入日志" name="log">
        <query v-model="searchData"  @setList="getList" @setForm="getForm"></query>
        <log v-model="list" ref="proportion"></log>
        </el-tab-pane>-->
      </el-tabs>
      <upload-Modal :showUpload="showUpload" :headUrl="headUrl" @close="closeModal"></upload-Modal>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import search from './components/search.vue'
import query from './components/query.vue'
import qualitySpec from './components/qualitySpec.vue'
import priceRule from './components/priceRule.vue'
import purchase from './components/purchase.vue'
import delivery from './components/delivery.vue'
import reimbursement from './components/reimbursement.vue'
import proportion from './components/proportion.vue'
import logs from './components/log.vue'
import uploadModal from './components/uploadFile.vue'
import { Iobj, addDataCode, editDataCode } from '@/api/his/medinsuinterface/pharmacyDrugsInfo.ts'
import { Form } from 'element-ui'
import { log } from 'util'
import { formatInt } from '@/utils'

// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'pharmacyDrugsInfo',
  filters: {},
  components: {
    search,
    query,
    qualitySpec,
    priceRule,
    purchase,
    delivery,
    reimbursement,
    proportion,
    logs,
    uploadModal,
  },
})
export default class extends Vue {
  private list: any[] = []
  private searchData: Iobj = {
    type: null,
    yptym: '',
    tbdm: '',
    pageSize: 10,
  }
  private activeName: string = 'qualitySpec'
  private showUpload: boolean = false
  private prec: number = 40 // 表格单行高度
  private headUrl: string = ''
  private form: any = {}

  // 选择标签页
  private chooseName(tab: any, event: any) {
    this.activeName = tab.name
    this.list = []
    switch (tab.name) {
      case 'qualitySpec':
        this.searchData.type = 1
        ;(this.$refs.qualitySpec as any).getList()
        break
      case 'priceRule':
        this.searchData.type = 2
        this.searchData.tbdm = ''
        ;(this.$refs.priceRule as any).getList()
        break
      case 'purchase':
        this.searchData.type = 3
        this.searchData.tbdm = ''
        ;(this.$refs.purchase as any).getList()
        break
      case 'delivery':
        this.searchData.type = 4
        this.searchData.tbdm = ''
        ;(this.$refs.delivery as any).getList()
        break
      case 'reimbursement':
        this.searchData.type = 5
        this.searchData.tbdm = ''
        ;(this.$refs.reimbursement as any).getList()
        break
      case 'proportion':
        this.searchData.type = 6
        this.searchData.tbdm = ''
        ;(this.$refs.proportion as any).getList()
        break
    }
  }
  // 根据不同的tab页重新渲染数据
  private setList(name: string) {
    this.list = []
    switch (this.activeName) {
      case 'qualitySpec':
        ;(this.$refs.qualitySpec as any).getList()
        break
      case 'priceRule':
        ;(this.$refs.priceRule as any).getList()
        break
      case 'purchase':
        ;(this.$refs.purchase as any).getList()
        break
      case 'delivery':
        ;(this.$refs.delivery as any).getList()
        break
      case 'reimbursement':
        ;(this.$refs.reimbursement as any).getList()
        break
      case 'proportion':
        ;(this.$refs.proportion as any).getList()
        break
    }
  }
  // 查询对应tab页的列表数据
  private getList(val: any) {
    this.list = val
  }

  // 新增
  private handleAdd() {
    switch (this.activeName) {
      case 'qualitySpec':
        ;(this.$refs.qualitySpec as any).getList()
        ;(this.$refs.qualitySpec as any).handleShow()
        break
      case 'priceRule':
        ;(this.$refs.priceRule as any).getList()
        ;(this.$refs.priceRule as any).handleShow()
        break
      case 'purchase':
        ;(this.$refs.purchase as any).getList()
        ;(this.$refs.purchase as any).handleShow()
        break
      case 'delivery':
        ;(this.$refs.delivery as any).getList()
        ;(this.$refs.delivery as any).handleShow()
        break
      case 'reimbursement':
        ;(this.$refs.reimbursement as any).getList()
        ;(this.$refs.reimbursement as any).handleShow()
        break
      case 'proportion':
        ;(this.$refs.proportion as any).getList()
        ;(this.$refs.proportion as any).handleShow()
        break
    }
  }
  // 文件导入
  private handleImport() {
    this.showUpload = true
    switch (this.activeName) {
      case 'qualitySpec':
        this.headUrl = process.env.VUE_APP_BASE_API + '/op-service/shybypjcxx/impExcel'
        break
      case 'priceRule':
        this.headUrl = process.env.VUE_APP_BASE_API + '/op-service/shybypjggz/impExcel'
        break
      case 'purchase':
        this.headUrl = process.env.VUE_APP_BASE_API + '/op-service/shybypcggz/impExcel'
        break
      case 'delivery':
        this.headUrl = process.env.VUE_APP_BASE_API + '/op-service/shybyppsqy/impExcel'
        break
      case 'reimbursement':
        this.headUrl = process.env.VUE_APP_BASE_API + '/op-service/shybybkbxgz/impExcel'
        break
      case 'proportion':
        this.headUrl = process.env.VUE_APP_BASE_API + '/op-service/shybybblgz/impExcel'
        break
    }
  }
  mounted() {
    // 获取表格列表高度
    let listHeight = (this.$refs.qualitySpec as any).getHeight()
    // 根 据列表高度计算列表显示条数
    this.searchData.pageSize = formatInt(Number(listHeight) / Number(this.prec))
  }
  // 关闭文件导入模态框
  private closeModal(flag: boolean) {
    if (flag) {
      this.showUpload = false
      switch (this.activeName) {
        case 'qualitySpec':
          ;(this.$refs.qualitySpec as any).getList()
          break
        case 'priceRule':
          ;(this.$refs.priceRule as any).getList()
          break
        case 'purchase':
          ;(this.$refs.purchase as any).getList()
          break
        case 'delivery':
          ;(this.$refs.delivery as any).getList()
          break
        case 'reimbursement':
          ;(this.$refs.reimbursement as any).getList()
          break
        case 'proportion':
          ;(this.$refs.proportion as any).getList()
          break
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
