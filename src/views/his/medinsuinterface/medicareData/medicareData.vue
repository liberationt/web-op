<!--
 * @Author: 张文奇
 * @Date: 2020-04-16 10:08:35
 * @LastEditTime: 2020-05-07 17:05:52
 * @Description: 医保数据代码
 * @FilePath: \web-op\src\views\his\medinsuinterface\medicareData\medicareData.vue
 -->

<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col :span="16" class="ht">
        <div class="his-module">
          <div class="row">
            <div class="label">
              <h1 class="title" style="flex: 1;">{{ $t('medicareData.title') }}</h1>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                class="blue-gra"
                icon="icon his-add"
                @click="handleAdd"
              >{{ $t('common.add') }}</el-button>
            </div>
          </div>
          <keep-alive>
            <!-- tab 标签页 -->
            <el-tabs v-model="activeName" @tab-click="chooseName">
              <el-tab-pane :label="$t('medicareData.districtCodeList')" name="area">
                <area-code v-model="list" ref="areaCode" @setRow="getRow"></area-code>
              </el-tab-pane>
              <el-tab-pane :label="$t('medicareData.departmentCode')" name="department">
                <department-code
                  v-model="tableList"
                  ref="department"
                  :search-data="searchDataDep"
                  @setRow="getRow"
                  @setNextForm="getNextForm"
                ></department-code>
              </el-tab-pane>
              <el-tab-pane :label="$t('medicareData.seriousIllnessCode')" name="serious">
                <serious v-model="list" ref="serious" @setRow="getRow"></serious>
              </el-tab-pane>
              <el-tab-pane :label="$t('medicareData.diagnosticClass')" name="diagnostics">
                <diagnostics v-model="list" ref="diagnostics" @setRow="getRow"></diagnostics>
              </el-tab-pane>
              <el-tab-pane :label="$t('medicareData.outpatientCategory')" name="diagnosticsFee">
                <diagnostics-fee v-model="list" ref="diagnosticsFee" @setRow="getRow"></diagnostics-fee>
              </el-tab-pane>
              <el-tab-pane :label="$t('medicareData.hospitalCategory')" name="hospitalization">
                <hospitalization v-model="list" ref="hospitalization" @setRow="getRow"></hospitalization>
              </el-tab-pane>
            </el-tabs>
          </keep-alive>
        </div>
      </el-col>
      <el-col :span="8" class="ht">
        <div class="his-module">
          <div slot="header" class="row">
            <div class="label">
              <h1 class="title">{{ isCreateNew ? $t('common.add') : $t('common.edit') }}</h1>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                class="green-gra"
                icon="icon his-save"
                @click="handleSave"
              >{{ $t('common.save') }}</el-button>
            </div>
          </div>
          <el-form :model="form" ref="formData" :rules="formValid" label-width="90px">
            <el-form-item
              :label="$t('medicareData.dataNum')"
              prop="dataNum"
              v-if="activeName == 'area'"
            >
              <el-input v-model="form.dataNum" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('medicareData.superDepartmentName')"
              prop="dataNum"
              v-if="activeName == 'department'"
            >
              <el-input v-model="form.dataNum" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('medicareData.dataName')"
              prop="dataName"
              v-if="
                activeName == 'area' ||
                activeName == 'diagnosticsFee' ||
                activeName == 'serious' ||
                activeName == 'hospitalization'
              "
            >
              <el-input v-model="form.dataName" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('medicareData.dataNum')"
              prop="dataCode"
              v-if="activeName == 'department'"
            >
              <el-input v-model="form.dataCode" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('medicareData.dataCode')"
              prop="dataCode"
              v-if="activeName != 'department'"
            >
              <el-input v-model="form.dataCode" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('medicareData.departmentName')"
              prop="dataName"
              v-if="activeName == 'department'"
            >
              <el-input v-model="form.dataName" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('medicareData.explain')"
              prop="dataName"
              v-if="activeName == 'diagnostics'"
            >
              <el-input v-model="form.dataName" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('medicareData.diseaseClass')"
              prop="dataType"
              v-if="activeName == 'diagnostics'"
            >
              <el-input v-model="form.dataType" :placeholder="$t('common.placeholder')"></el-input>
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
import {
  enableStatus,
  IForm,
  addDataCode,
  editDataCode,
} from '@/api/his/medinsuinterface/medicareData.ts'

import areaCode from './components/areaCode.vue'
import departmentCode from './components/departmentCode.vue'

import diagnostics from './components/diagnostics.vue'
import diagnosticsFee from './components/diagnosticsFee.vue'
import hospitalization from './components/hospitalization.vue'

import query from './components/query.vue'
import serious from './components/serious.vue'
import { log } from 'util'

// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'medDataCode',
  components: {
    query,
    areaCode,
    departmentCode,
    serious,
    diagnostics,
    diagnosticsFee,
    hospitalization,
  },
  filters: {},
})
export default class extends Vue {
  //声明变量，方法
  private list: any[] = []
  private tableList: any[] = []
  private searchData: any = {
    ybdataId: 1,
    dataName: '',
  }

  private searchDataDep: any = {
    ybdataId: 2,
    dataName: '',
    parentDatavalueId: 0,
  }
  private isCreateNew: boolean = true //新增还是保存
  private activeName: string = 'area'
  private form: any = {}
  private formValid: any = {}

  /* 切换tab，并查询对应tab的列表数据 */
  private chooseName(tab: any, event: any) {
    this.activeName = tab.name
    this.searchData = {}
    this.searchDataDep = {
      ybdataId: 2,
      dataName: '',
      parentDatavalueId: 0,
    }
    this.list = []
    this.form = {} //置空右边
    this.isCreateNew = true //修改状态
    switch (tab.name) {
      case 'area':
        this.searchData.ybdataId = 1
        ;(this.$refs.areaCode as any).getList()
        break
      case 'department':
        ;(this.$refs.department as any).getList()
        break
      case 'serious':
        this.searchData.ybdataId = 3
        ;(this.$refs.serious as any).getList()
        break
      case 'diagnostics':
        this.searchData.ybdataId = 4
        ;(this.$refs.diagnostics as any).getList()
        break
      case 'diagnosticsFee':
        this.searchData.ybdataId = 5
        ;(this.$refs.diagnosticsFee as any).getList()
        break
      case 'hospitalization':
        this.searchData.ybdataId = 6
        ;(this.$refs.hospitalization as any).getList()
        break
    }
  }
  /* 保存的交互，ybdataId有值修改，否则添加
    根据tabName不同，操作不同的数据
  */
  private handleSave() {
    switch (this.activeName) {
      case 'area':
        this.form.ybdataId = 1
        break
      case 'department':
        this.form.ybdataId = 2
        break
      case 'serious':
        this.form.ybdataId = 3
        break
      case 'diagnostics':
        this.form.ybdataId = 4
        break
      case 'diagnosticsFee':
        this.form.ybdataId = 5
        break
      case 'hospitalization':
        this.form.ybdataId = 6
        break
    }
    if (this.form.ybdatavalueId) {
      // edit
      ;((this.$refs.formData as any) as Form).validate((valid) => {
        if (valid) {
          editDataCode(this.form).then((res: any) => {
            this.$notify({
              title: '',
              message: this.$t('common.editSuc').toString(),
              type: 'success',
            })
          })
        }
      })
    } else {
      // add

      ;((this.$refs.formData as any) as Form).validate((valid) => {
        if (valid) {
          // 判断如果是科室编码，父节点是null   赋值给0
          if (
            (this.form.ybdataId == 2 && this.form.parentDatavalueId == null) ||
            this.form.parentDatavalueId == undefined
          ) {
            this.form.parentDatavalueId = 0
          }
          addDataCode(this.form).then((res: any) => {
            this.$notify({
              title: '',
              message: this.$t('common.addSuc').toString(),
              type: 'success',
            })
            this.form = {}
            this.setList(this.activeName)
          })
        }
      })
    }
    setTimeout(() => {
      return this.setList(this.activeName)
    }, 200)
  }
  // 根据不同的tab页重新渲染数据
  private setList(name: string) {
    this.list = []
    switch (this.activeName) {
      case 'area':
        ;(this.$refs.areaCode as any).getList()
        break
      case 'department':
        console.log('this.tableList', this.tableList)
        ;(this.$refs.department as any).getList()
        break
      case 'serious':
        ;(this.$refs.serious as any).getList()
        break
      case 'diagnostics':
        ;(this.$refs.diagnostics as any).getList()
        break
      case 'diagnosticsFee':
        ;(this.$refs.diagnosticsFee as any).getList()
        break
      case 'hospitalization':
        ;(this.$refs.hospitalization as any).getList()
        break
    }
  }
  // // 查询对应tab页的列表数据
  // private getList(val: any) {
  //   console.log('val', val)
  //   this.list = []
  //   this.tableList = []
  //   val.forEach((element: any) => {
  //     if (element.childNum > 0) {
  //       element.hasChildren = true
  //     }
  //   })
  //   this.tableList = Object.assign([], val)
  //   this.list = Object.assign([], val)
  // }
  // 点击新增，清空右侧表单
  private getForm(val: any) {
    if (val) {
      this.form = {}
    }
  }
  // 选中列表一行数据，从子组件获取右侧表单数据
  private getRow(val: any) {
    this.isCreateNew = false
    if (val) {
      this.form = Object.assign({}, val)
    }
  }
  // 科室编码点击新增，组件传过来的数据
  private getNextForm(val: any) {
    if (val) {
      this.form = {}
      this.form.dataNum = val.dataName
      this.form.parentDatavalueId = val.ybdatavalueId
    }
  }
  private handleAdd() {
    this.isCreateNew = true
    this.form = {}
  }
}
</script>

<style lang="scss" scoped>
.tags-view-item {
  display: inline-block;
  cursor: pointer;
  height: 32px;
  line-height: 32px;
  color: #9ca0ab;
  background: #eceded;
  padding: 0 8px;
  font-size: 12px;
  margin-left: 5px;
  border-radius: 8px;

  &:first-of-type {
    margin-left: 15px;
  }
  &:last-of-type {
    margin-right: 15px;
  }
  &.active {
    background: linear-gradient(
      315deg,
      rgba(45, 187, 255, 1) 0%,
      rgba(20, 133, 255, 1) 100%
    );
    color: #fff;
    // border-color: #42b983;
  }
}
</style>
