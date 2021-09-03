<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="18">
        <div class="his-module his-small">
          <pagenation-list ref="pageTable" v-model="tableDatas" data-url="/op-service/mpeasemobuser/queryPage" http-method="post" :list-height="listSlotHeight" :searchData="searchData">
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">环信账号管理</h1>
                <el-divider direction="vertical"></el-divider>
                <span class="tag pl0">用户类型</span>
                <el-select v-model="searchData.usertype" placeholder="请选择">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
                <el-divider direction="vertical"></el-divider>
                <div class="btn">
                  <el-button size="mini" type="text" @click="handleSearch"><i class="icon his-search"></i>查询</el-button>
                </div>
              </div>
            </div>
            <el-table :data="tableDatas" border stripe :highlight-current-row="true" slot="list" :height="listSlotHeight + 12" class="scroll-bar">
              <el-table-column type="index" width="32" align="center"></el-table-column>
              <el-table-column prop="activated" :label="$t('账户状态')" show-overflow-tooltip width="80">
                <template slot-scope="scope">
                  <div style="color: #1485ff;" v-if="scope.row.activated == 'true'">
                    {{ scope.row.activated | activated }}
                  </div>
                  <div style="color: #f56c6c;" v-if="scope.row.activated == 'false'">
                    {{ scope.row.activated | activated }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="yhxm" :label="$t('用户姓名')" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="usertype" :label="$t('用户类型')" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.usertype | xb2zh }}
                </template>
              </el-table-column>
              <el-table-column prop="username" :label="$t('用户名')" show-overflow-tooltip></el-table-column>
              <el-table-column prop="nickname" :label="$t('昵称')" show-overflow-tooltip></el-table-column>
              <el-table-column prop="createUserId" :label="$t('创建人 ')" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ docList.find((item) => item.dv == scope.row.createUserId) && docList.find((item) => item.dv == scope.row.createUserId).dn }}
                </template>
              </el-table-column>
              <el-table-column prop="createTime" :label="$t('创建时间')" show-overflow-tooltip width="140"></el-table-column>
              <el-table-column :label="$t('common.action')" align="center" width="72" class-name="action-btns">
                <template slot-scope="scope">
                  <el-tooltip :content="scope.row.activated == 'false' ? $t('common.enable') : $t('common.disable')" effect="light">
                    <el-popconfirm hideIcon :confirmButtonText="scope.row.activated == 'true' ? $t('common.disable') : $t('common.enable')" :cancelButtonText="$t('common.cancel')" :title="scope.row.activated == 'true' ? $t('sysManage.confirmDisabled') : $t('sysManage.confirmAutomated')" @confirm="stopOrStarOK(scope.row)">
                      <el-button slot="reference" :class="scope.row.activated == 'false' ? 'green' : 'red'">
                        <i :class="scope.row.activated == 'false' ? 'icon his-automated' : 'icon his-disabled'"></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                  <el-tooltip content="删除" effect="light">
                    <el-popconfirm hideIcon confirmButtonText="删除" :cancelButtonText="$t('common.cancel')" title="删除" @confirm="handleDelete(scope.row)">
                      <el-button slot="reference" :disabled="scope.row.activated == 'false' ? false : true">
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
        <div class="his-module his-small">
          <div slot="header" class="row">
            <div class="label">
              <!-- 新增/编辑 -->
              <!-- <h1 class="title">{{ isCreateNewJob ? $t('common.add') : $t('common.edit') }}</h1> -->
              <h1>新增</h1>
            </div>
            <div class="operate">
              <el-button type="primary" class="green-gra" icon="icon his-save" @click="save">{{ $t('common.save') }}</el-button>
            </div>
          </div>
          <el-form :model="form" ref="form" :rules="rules" label-width="80px">
            <el-form-item :label="$t('用户姓名')" prop="zgxm">
              <!-- <search-select class="w100" table-name="SYS_DICT_CONFIG" kid="17" v-model="form.userid" :placeholder="$t('请选择')" :backfillValue="form.userid" /> -->
              <remote-search-select
                searchUrl="/system-service/hrpersonnel/queryByCondition"
                :resultTableHeader="resultHeader"
                :popover-width="235"
                :searchData="{
                  condition: ''
                }"
                ref="selectRef"
                searchField="condition"
                showLabel="personname"
                data-type="0"
                v-model="form.zgxm"
                @getData="getDoctorList"
              >
                <el-select 
                  v-model="form.zgxm"
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
                  <!-- <> -->
                </el-select> 
              </remote-search-select>
            </el-form-item>
            <!-- <el-form-item :label="$t('用户名')" prop="username">
              <el-input v-model.trim="form.username" :placeholder="$t('用户名')"></el-input>
            </el-form-item>
            
            <el-form-item :label="$t('密码')" prop="password">
              <el-input ref="fjhm" v-model.trim="form.password" :placeholder="$t('密码')"></el-input>
            </el-form-item> -->
            <el-form-item :label="$t('用户昵称')" prop="nickname" style="padding-left: 2px">
              <el-input v-model.trim="form.nickname" :placeholder="$t('昵称')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('用户类型')" prop="usertype">
              <el-select v-model="form.usertype" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { add, backEdit } from '@/api/cis/op/dctwork/orderDeliveryQuery'
import { log } from 'util'
import { disableOrLift, addHX, deleteHX } from '@/api/cis/op/dctwork/orderDeliveryQuery'
@Component({
  name: 'bedSetting',
  filters: {
    xb2zh(val: string) {
      switch (val) {
        case '1':
          return '客服'
          break
        case '2':
          return '医生'
          break
      }
    },
    activated(val: string) {
      switch (val) {
        case 'true':
          return '有效'
          break
        case 'false':
          return '禁用'
          break
      }
    },
  },
})
export default class extends Vue {
  private form: any = {
    username: '',
    nickname: '',
    userid: '',
    password: '',
    id: null,
    usertype: '1',
    zgxm: ''
  }
  private options: any = [
    {
      value: '1',
      label: '客服',
    },
    {
      value: '2',
      label: '医生',
    },
  ]
  private listSlotHeight: number = 0
  private tableDatas: any = []
  private rules: any = {
    // nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    // password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    userid: [{ required: true, message: '用户ID', trigger: 'blur' }],
    // username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    usertype: [{ required: true, message: '用户类型', trigger: 'blur' }],
  }
  private isCreateNewJob: boolean = true //新增还是保存
  private PageHeight = Vue.prototype.PageHeight
  private resultHeader = [
    {
      prop: 'personname',
      label: '职工姓名'
    },
    {
      prop: 'rybh',
      label: '人员编号'
    }
  ]
  private docList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT // 医生列表
  created() {
    this.listSlotHeight = this.PageHeight - 60 - 40 - 30
  }
  mounted() {
    this.getLists()
  }
  private handleSearch() {
    this.getLists()
  }
  private getList() {
    this.getLists()
  }
  private searchGet() {
    this.getLists()
  }
  private searchData: any = {
    pageNum: 1,
    pageSize: 20,
    usertype: '',
    nickname: '',
    createUserId: null,
  }
  private getLists() {
    ;(this.$refs.pageTable as any).getList()
  }
  //保存
  private save() {
    addHX(this.form).then((item: any) => {
      if (item.errorCode == 'SUCCESS') {
        this.$notify({
          title: '新增成功',
          message: '',
          type: 'success',
        })
        ;(this.$refs.form as any).resetFields()
        this.getLists()
      }
    })
  }
  //启用/禁用
  private stopOrStarOK(row: any) {
    console.log(row, 'row')
    let obj = {
      activated: row.activated == 'true' ? '1' : '2',
      id: row.id,
    }
    disableOrLift(obj).then((item: any) => {
      console.log(item, 'item')
      if (item.errorCode == 'SUCCESS') {
        this.$notify({
          title: row.activated == 'true' ? '停用成功' : '启用成功',
          message: '',
          type: 'success',
        })
        this.getLists()
      }
    })
  }
  //删除
  private handleDelete(item: any) {
    deleteHX({ id: item.id }).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.$notify({
          title: '删除成功',
          message: '',
          type: 'success',
        })
        this.getLists()
      }
    })
  }
  // 全部职工列表
  private getDoctorList(data: any) {
    this.form.userid = data.personid
  }

  // 远程搜索的方法
  private remoteMethod(query: string) {
    if (query.length > 1) {
      this.$nextTick(() => {
        ;(this.$refs.selectRef as any).remoteMethod(query)
      })
    } else {
      ;(this.$refs.selectRef as any).closePopover()
    }
  }
}
</script>

<style lang="scss" scoped>
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
::v-deep .page-footer {
  margin-top: 13px !important;
}
.el-select-dropdown__item.selected {
  color: #333333;
  font-weight: normal;
}
.content .his-module .el-form {
  margin: 24px 0 0;
  .el-form-item {
    margin-bottom: 16px;
    .el-select {
      height: 28px;
      .el-input__inner {
        line-height: 28px;
      }
    }
  }
}
.row .label {
  height: 32px;
}
.content .his-module ::v-deep .el-form .el-form-item .el-input {
  height: 28px;
}
.el-input--medium .el-input__inner {
  height: 28px;
  line-height: 28px;
}
::v-deep .el-form-item--medium .el-form-item__content {
  line-height: 28px;
}
.w100 {
  width: 100%;
}
.search-select {
  margin: 0px;
}
::v-deep .remote-select-select-box {
  width: 100% !important;
}
</style>
