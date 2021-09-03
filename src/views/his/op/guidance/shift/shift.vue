<!--
 * @Author: 曹俊
 * @LastEditTime: 2020-09-09 13:34:17
 * @LastEditors: zhml
 * @Description:
 * @FilePath: \web-op\src\views\his\op\guidance\shift\shift.vue
 -->
<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="16">
        <div class="his-module">
          <!--    <pagenation-list ref="pageTable" data-url="/op-service/opbcsj/findList" v-model="list" :searchData="searchData" http-method="post" :list-height="listSlotHeight"> -->
          <div slot="header" class="row">
            <div class="label">
              <h1 class="title">{{$t('shift.title')}}</h1>
            </div>
            <div class="operate">
              <!-- 新增 -->
              <!-- <el-button type="primary" class="blue-gra" icon="icon his-add" @click="handleAdd">{{$t('common.add')}}</el-button> -->
            </div>
          </div>
          <el-table slot="list" stripe :highlight-current-row="true" :data="list" border :height="listSlotHeight" class="scroll-bar" @row-click="handleChange">
            <!-- 班次名称 -->
            <el-table-column prop="sdmc" :label="$t('shift.shiftName')" width="120"></el-table-column>
            <!-- 上班时间 -->
            <el-table-column prop="sbsj" :label="$t('shift.beginTime')" width="120"></el-table-column>
            <!-- 下班时间 -->
            <el-table-column prop="xbsj" :label="$t('shift.endTime')" width="120"></el-table-column>
            <!-- 病人平均就诊时长(分钟) -->
            <el-table-column prop="pjsc" :label="$t('shift.visitLength')"></el-table-column>
            <!-- 操作 -->
            <!-- <el-table-column :label="$t('common.action')" width="100" align="center">
  <template slot-scope="scope">
    <el-popconfirm class="ml10" hideIcon :confirmButtonText="$t('common.delete')" :cancelButtonText="$t('common.cancel')" :title="$t('common.delTip')" @cancel="handleCancel" @confirm="handleOk(scope.row)">
      <el-button slot="reference" class="red">
        <i class="icon his-del"></i>
      </el-button>
    </el-popconfirm>
  </template>
</el-table-column>
 -->
          </el-table>
          <!-- </pagenation-list> -->
        </div>
      </el-col>
      <el-col class="ht" :span="8">
        <div class="his-module">
          <div slot="header" class="row">
            <div class="label">
              <!-- 新增、编辑 -->
              <h1 class="title">{{isCreateAndEdit ? $t('common.add') : $t('common.edit') }}</h1>
            </div>
            <div class="operate">
              <!-- 保存 -->
              <el-button type="primary" class="green-gra" icon="icon his-save" @click="handleSave">{{$t('common.save')}}</el-button>
            </div>
          </div>
          <!-- 表单 -->
          <el-form :model="forms" ref="formValidate" :rules="rules" label-width="100px">
            <!-- 班次名称 -->
            <el-form-item :label="$t('shift.shiftName')" prop="sdmc">
              <el-input v-model="forms.sdmc" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <!-- 上班时间 -->
            <el-form-item :label="$t('shift.beginTime')" prop="sbsj">
              <el-time-select :placeholder="$t('shift.beginTip')" v-model="forms.sbsj" :picker-options="{
                  start: '00:00',
                  step: '00:10',
                  end: '23:59'
                }"></el-time-select>
            </el-form-item>
            <!-- 下班时间 -->
            <el-form-item :label="$t('shift.endTime')" prop="xbsj">
              <el-time-select :placeholder="$t('shift.endTip')" v-model="forms.xbsj" :picker-options="{
                  start: '00:00',
                  step: '00:10',
                  end: '23:59'
                }"></el-time-select>
            </el-form-item>
            <!-- 病人平均就诊时长(分钟) -->
            <el-form-item :label="$t('shift.visitLength')" prop="pjsc">
              <el-input v-model.number="forms.pjsc" type="number" min="1" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { queryBcList, editTime } from '@/api/his/op/guidance/shift/shift.ts'
import { Form } from 'element-ui'
import { AxiosResponse } from 'axios'

@Component({
  name: 'shift',
  filters: {},
  components: {},
})
export default class extends Vue {
  private searchData: object = {
    roomName: '',
    hospitalId: 0,
  }
  private list: any = []
  private forms: any = {
    sdmc: '',
    sbsj: '',
    xbsj: '',
    pjsc: null,
  }
  private listQuery: any = {
    pageNum: 1,
    pageSize: 10,
    parentMenuId: 0,
  }
  private listSlotHeight = 0 // 列表高度
  private isCreateAndEdit: boolean = true
  private visitLength = (rule: any, value: number, callback: any) => {
    if (value < 1) {
      return callback(new Error(window.ele.$i18n.t('shift.visitLengthTips')));
    } else {
      return callback() // 一些同学的问题可能就出在这里
    }
  }
  // 验证规则
  private rules = {
    sdmc: [
      { required: true, message: window.ele.$i18n.t('shift.shiftTips'), trigger: 'blur' },
    ],
    sbsj: [{
      required: true,
      message: window.ele.$i18n.t('shift.beginTips'),
      trigger: 'change'
    }, ],
    xbsj: [
      { required: true, message: window.ele.$i18n.t('shift.endTips'), trigger: 'change' },
    ],
    // visitLength: [
    //   { required: true, validator: this.visitLength,  trigger: 'blur' },
    // ],

  }

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight - 51 - 40 - 30
  }

  mounted() {
    this.getList()
  }

  private getList() {
    queryBcList({}).then((res: AxiosResponse) => {
      this.list = res.data
    })
  }
  // 新增
  private handleAdd() {
    (this.$refs.formValidate as Form).resetFields()
    this.isCreateAndEdit = true
  }

  // 选中表格当前行
  private handleChange(val: any) {
    this.isCreateAndEdit = false
    this.forms = Object.assign(this.forms, val)
  }

  // 是否取消
  private handleCancel() {}

  // 是否确定删除该班次时间
  // private handleOk(item: any) {
  //   let id: number = item.timeIntervalId
  //   delTime(id).then((res: any) => {
  //     if (res.errorCode == 'SUCCESS') {
  //       this.$notify({
  //         title: this.$t('common.delSuc').toString(),
  //         message: '',
  //         type: 'success',
  //       })
  //       this.isCreateAndEdit = true
  //       this.getList()
  //       this.reset()
  //     }
  //   })
  // }

  // 保存
  private handleSave() {;
    (this.$refs.formValidate as Form).validate((valid) => {
      if (valid) {
        this.editTime()
      }
    })
  }

  // 编辑
  private editTime() {
    editTime(this.forms).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.$notify({
          title: this.$t('common.editSuc').toString(),
          message: '',
          type: 'success',
        })
        this.getList()
        this.reset()
      }
    })
  }
  // 重置表单
  private reset() {
    this.$nextTick(() => {
      (this.$refs.formValidate as Form).resetFields()
    })
  }
}

</script>
