<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="16">
        <div class="his-module">
          <pagenation-list
            ref="pageTable"
            v-model="tableDatas"
            data-url="/system-service/sys/sysgroup/queryPage"
            http-method="post"
            :list-height="listSlotHeight"
            :searchData="searchData"
          >
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">{{$t('postSetting.postList')}}</h1>
                <el-input
                  v-model="searchData.groupName"
                  :placeholder="$t('postSetting.inputHolder')"
                  @keyup.enter.native="searchList"
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
              </div>
            </div>
            <el-table
              :data="tableDatas"
              border
              stripe
              :highlight-current-row="true"
              slot="list"
              @row-click="handleRowClick"
              :height="listSlotHeight"
              class="scroll-bar"
            >
              <el-table-column prop="webSortNumber" :label="$t('common.serialNum')" width="60"></el-table-column>

              <el-table-column prop="groupCode" :label="$t('uAutSet.groupCode')" width="120"></el-table-column>
              <el-table-column prop="groupName" :label="$t('uAutSet.groupName')"></el-table-column>
              <el-table-column prop="groupSeq" :label="$t('sysManage.menuSort')" width="120"></el-table-column>
              <!-- 当前状态，0启用，1停用-->
              <el-table-column :label="$t('table.status')" width="60">
                <template slot-scope="scope">
                  <span
                    :class="[scope.row.stopFlag == '1' ? 'reds':'blues']"
                  >{{scope.row.stopFlag == '1' ? $t('common.disable') : $t('common.enable')}}</span>
                </template>
              </el-table-column>

              <!-- 操作 -->
              <el-table-column :label="$t('table.actions')" width="100" align="center">
                <template slot-scope="scope">
                  <el-tooltip
                    :content="scope.row.stopFlag == '0' ? $t('common.disable') : $t('common.enable')"
                    effect="light"
                  >
                    <el-popconfirm
                      hideIcon
                      :confirmButtonText="scope.row.stopFlag == '0' ? $t('common.disable') : $t('common.enable')"
                      :cancelButtonText="$t('common.cancel')"
                      :title="scope.row.stopFlag == '0' ? $t('sysManage.confirmDisabled')
                    : $t('sysManage.confirmAutomated')"
                      @confirm="handleEnable(scope.row)"
                    >
                      <el-button
                        slot="reference"
                        :class="scope.row.stopFlag == '0' ? 'red' : 'green'"
                      >
                        <i
                          :class="scope.row.stopFlag == '0' ? 'icon his-disabled' : 'icon his-automated'"
                        ></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                  <!-- 删除 -->
                  <el-tooltip class="ml10" :content="$t('common.delete')" effect="light">
                    <el-popconfirm
                      class="ml10"
                      hideIcon
                      :confirmButtonText="$t('common.confirm')"
                      :cancelButtonText="$t('common.cancel')"
                      :title="tipTitle"
                      @confirm="handleDelete(scope.row)"
                    >
                      <el-button slot="reference" class="red" @click="getPostPersonNum(scope.row)">
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
        <div class="his-module">
          <div slot="header" class="row">
            <div class="label">
              <h1 class="title">
                {{isCreateNewJob
                ? $t('common.add')
                : $t('common.edit')}}
              </h1>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                class="green-gra"
                icon="icon his-save"
                @click="handleSubmit"
              >{{$t('common.save')}}</el-button>
            </div>
          </div>
          <el-form :model="formInline" ref="formInline" :rules="ruleInline" label-width="90px">
            <!-- 岗位代码 -->
            <el-form-item :label="$t('uAutSet.groupCode')" prop="groupCode">
              <el-input
                ref="groupCode"
                v-model.trim="formInline.groupCode"
                :placeholder="$t('common.placeholder')"
                @keyup.enter.native="handleEnterGroupCode"
                @input="formInline.groupCode=formInline.groupCode.replace(/[^\w_]/g,'')"
                :disabled="formInline.stopFlag == '0'"
              ></el-input>
            </el-form-item>

            <el-form-item :label="$t('uAutSet.groupName')" prop="groupName">
              <el-input
                ref="groupName"
                v-model.trim="formInline.groupName"
                :placeholder="$t('common.placeholder')"
                @keyup.enter.native="handleEnterGroupName"
                :disabled="formInline.stopFlag == '0'"
              ></el-input>
            </el-form-item>

            <!-- 业务类型 -->
            <el-form-item :label="'业务类型'" prop="btId">
              <el-select
                v-model="formInline.btId"
                :placeholder="$t('common.placeholder')"
                :disabled="formInline.stopFlag == '0'"
                clearable
              >
                <el-option
                  v-for="item in btList"
                  :key="item.btId"
                  :label="item.btName"
                  :value="item.btId"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- icon -->
            <el-form-item :label="$t('uAutSet.icon')" prop="menuIcon">
              <gallery v-model="formInline.icon"></gallery>
            </el-form-item>
            <el-form-item :label="$t('postSetting.homepageUrl')" prop="homepageUrl">
              <el-input
                ref="homepageUrl"
                v-model.trim="formInline.homepageUrl"
                :placeholder="$t('common.placeholder')"
                @keyup.enter.native="handleEnterPageUrl"
                :disabled="formInline.stopFlag == '0'"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('sysManage.menuSort')" prop="groupSeq">
              <el-input
                ref="groupSeq"
                type="number"
                v-model="formInline.groupSeq"
                :placeholder="$t('common.placeholder')"
                @keyup.enter.native="handleEnterSeq"
                :disabled="formInline.stopFlag == 0"
              ></el-input>
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
// import Gallery from '@/components/Gallery/index.vue'
import { querySysgroupList, addSysgroup, editSysgroup, editEnable, getOneSysgroup, findCountSysgroupList, deleteSysgroupList, getMaxSort, Iitem, checkGroupCode } from '@/api/his/user/postSetting.ts'
import { aBusinessTypeAll } from '@/api/his/sys/adminms/business/business.ts'
import { format } from 'url'

@Component({
  name: 'postSetting',
  // components: { Gallery },
})
export default class extends Vue {
  private searchData = {
    groupName: '',
  }
  private tipTitle: string = ''
  private isCreateNewJob: boolean = true //新增还是保存
  private pageProps = {
    // iview分页组件自带props
    'show-elevator': true,
    'show-sizer': true,
    'show-total': true,
  }

  private listSlotHeight: number = 0 //列表高度
  private userNum: number = 0 //岗位对应用户数量
  //列表数组
  private tableDatas: Iitem[] = []
  private list: any = []
  private PageHeight = Vue.prototype.PageHeight
  private btList: any[] = [] // 业务类型列表
  created() {
    this.listSlotHeight = this.PageHeight - 114
  }
  mounted() {
    this.getLists()
    this.handleAdd()
    this.getBtList()
  }

  //获取按钮状态值
  private getTipsText(status: string) {
    let name = Object.assign({}, status)
    return status == '0' ? this.$t('sysManage.confirmAutomated').toString() : this.$t('sysManage.confirmDisabled').toString()
  }
  //获取数据
  private getLists() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private searchList() {
    const pageTable: any = this.$refs.pageTable
    if (this.searchData.groupName == '') {
      pageTable.getList()
    } else {
      pageTable.searchList()
    }
  }

  //新增
  private addNewJob() {
    this.formInline.stopFlag = '0'
    addSysgroup(this.formInline).then(() => {
      this.getLists()
      this.$notify({
        title: this.$t('common.addSuc').toString(),
        message: '',
        type: 'success',
      })
      this.handleAdd()
    })
  }

  //编辑
  private editJob(item: Iitem) {
    editSysgroup(item).then(() => {
      this.getLists()
      this.$notify({
        title: this.$t('common.editSuc').toString(),
        message: '',
        type: 'success',
      })
    })
  }

  //停用/启用
  private editEnable(item: Iitem) {
    console.log(item)
    editEnable(item).then(() => {
      this.getLists()
      this.$notify({
        title: item.stopFlag == '1' ? this.$t('common.disabled').toString() : this.$t('common.enabled').toString(),
        message: '',
        type: 'success',
      })
    })
  }

  //改变停用/启用状态
  private handleEnable(item: Iitem) {
    if (item.stopFlag == '1') {
      item.stopFlag = '0'
    } else {
      item.stopFlag = '1'
    }
    this.editEnable(item)
  }

  //新增按钮
  private handleAdd() {
    this.isCreateNewJob = true
    getMaxSort({}).then((res) => {
      this.formInline.groupSeq = res.data.toString() // 解决验证异常
    })
    this.removeRightFormData()
    // 清空校验结果
    const formInline: any = this.$refs.formInline
    formInline.clearValidate()
    console.log(formInline.stopFlag)
  }

  //保存
  private handleSubmit() {
    ;(this.$refs.formInline as Form).validate((valid: any) => {
      if (valid) {
        if (this.isCreateNewJob) {
          this.addNewJob()
        } else {
          this.editJob(this.formInline)
        }
      } else {
      }
    })
  }
  //删除
  private handleDelete(item: Iitem) {
    let groupId = item.groupId
    deleteSysgroupList({ groupId }).then((res) => {
      this.getLists()
      this.$notify({
        title: this.$t('common.delSuc').toString(),
        message: '',
        type: 'success',
      })
    })
    this.removeRightFormData()
  }

  private getPostPersonNum(item: Iitem) {
    let groupId = item.groupId
    let countNum = 0
    findCountSysgroupList({ groupId }).then((res) => {
      countNum = res.data
      this.tipTitle = this.$t('postSetting.deleteBtnMessageTextOne').toString() + countNum + this.$t('postSetting.deleteBtnMessageTextTwo').toString()
    })
  }

  //表单数据
  private formInline: Iitem = {
    groupCode: '',
    groupName: '',
    btId: '',
    homepageUrl: '',
    groupSeq: '',
    groupId: '',
    uploadList: [],
    stopFlag: '0',
    icon: 'his-add',
  }

  // 岗位代码查重
  private validateGroupCode = (rule: any, value: any, callback: any) => {
    this.checkGroupCodeDup(value, callback)
  }

  //表单验证
  private ruleInline = {
    groupCode: [
      {
        required: true,
        trigger: 'blur',
        message: window.ele.$i18n.t('postSetting.groupCodePlaceholder'),
        type: 'string',
      },
      {
        max: 50,
        message: window.ele.$i18n.t('postSetting.textLengthLimit'),
        trigger: 'blur',
      },
      {
        validator: this.validateGroupCode,
        trigger: 'blur',
      },
    ],
    groupName: [
      {
        required: true,
        trigger: 'blur',
        message: window.ele.$i18n.t('postSetting.groupNamePlaceholder'),
        type: 'string',
      },
      {
        max: 50,
        message: window.ele.$i18n.t('postSetting.textLengthLimit'),
        trigger: 'blur',
      },
    ],
    homepageUrl: [{ required: false, trigger: 'blur' }],
    groupSeq: [
      {
        max: 50,
        message: window.ele.$i18n.t('postSetting.textLengthLimit'),
        trigger: 'blur',
      },
    ],
  }

  // 岗位代码查重方法
  checkGroupCodeDup(value: any, callback: any) {
    if (this.isCreateNewJob) {
      checkGroupCode({ groupCode: value }).then((res: any) => {
        if (res.data) {
          callback()
        } else {
          callback(new Error(this.$t('postSetting.vdGroupCodeDup').toString()))
        }
      })
    } else {
      callback()
    }
  }

  // 表单数据处理
  private handleRowClick(row: Iitem) {
    this.getRightFormData(row)
    // 清空校验结果
    const formInline: any = this.$refs.formInline
    formInline.clearValidate()
  }

  private getRightFormData(item: Iitem) {
    if (!item) {
      return
    } else if (item.icon == null || item.icon == undefined) {
      item.icon = 'his-add'
    }
    this.isCreateNewJob = false
    //浅拷贝
    this.formInline = Object.assign({}, item)
    this.formInline.groupSeq = this.formInline.groupSeq.toString() // 解决验证异常
  }
  private removeRightFormData() {
    this.formInline.groupName = ''
    this.formInline.groupCode = ''
    this.formInline.btId = ''
    this.formInline.homepageUrl = ''
    this.formInline.groupSeq = ''
    this.formInline.groupId = ''
    this.formInline.stopFlag = '1'
  }

  // 获取所有业务类型
  private getBtList() {
    aBusinessTypeAll().then((res: any) => {
      if (res) {
        this.btList = res.data
      }
    })
  }

  //enter键切换
  private handleEnterGroupCode() {
    this.$nextTick(() => {
      ;(this.$refs['groupName'] as any).focus()
    })
  }
  private handleEnterGroupName() {
    this.$nextTick(() => {
      ;(this.$refs['homepageUrl'] as any).focus()
    })
  }
  private handleEnterPageUrl() {
    this.$nextTick(() => {
      ;(this.$refs['groupSeq'] as any).focus()
    })
  }
  private handleEnterSeq() {
    this.$nextTick(() => {
      ;(this.$refs['groupCode'] as any).focus()
    })
  }
}
</script>

<style lang='scss' scoped>
::v-deep .icon-style {
  width: 34px;
  height: 34px;
  background: rgba(245, 246, 248, 1);
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-form {
  padding: 0 40px !important;
}
</style>
