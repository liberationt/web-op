<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="16">
        <div class="his-module his-small">
          <pagenation-list ref="pageTable" v-model="tableDatas" data-url="/op-service/mpblacklist/queryPage" http-method="post" :list-height="listSlotHeight" :searchData="searchData">
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">黑名单</h1>
                <el-divider direction="vertical"></el-divider>
                <span class="tag pl0">姓名</span>
                <el-input class="form-input" placeholder="姓名" v-model="searchData.name" @keyup.enter.native="getList">
                  <i slot="prefix" class="el-input__icon icon his-search"></i>
                </el-input>
                <el-divider direction="vertical"></el-divider>
                <span class="tag pl0">身份证号</span>
                <el-input class="form-input" placeholder="身份证号" v-model="searchData.sfzh" @keyup.enter.native="getList">
                  <i slot="prefix" class="el-input__icon icon his-search"></i>
                </el-input>
                <el-divider direction="vertical"></el-divider>
                <el-checkbox v-model="searchData.state" @change="changeGetList" true-label="0" false-label="1">已解封</el-checkbox>
                <el-divider direction="vertical"></el-divider> 
                <div class="btn">
                  <el-button size="mini" type="text" @click="handleSearch"><i class="icon his-search"></i>查询</el-button>
                </div>
              </div>
              <div class="operate">
                <el-button type="primary" class="blue-gra" icon="icon his-add" @click="handleAdd">{{ $t('common.add') }}</el-button>
              </div>
            </div>
            <el-table :data="tableDatas" border stripe :highlight-current-row="true" slot="list" :height="listSlotHeight + 12" class="scroll-bar" @row-click="getEdit">
              <el-table-column type="index" width="32" align="center"></el-table-column>
              <!-- 床位号码 -->
              <el-table-column prop="name" :label="$t('姓名')"></el-table-column>
              <!-- 房间号码 -->
              <el-table-column prop="sfzh" :label="$t('身份证号')"></el-table-column>
              <!-- 房间号码 -->
              <el-table-column prop="remake" :label="$t('备注')"></el-table-column>
              <!-- 房间号码 -->
              <el-table-column prop="state" :label="$t('解封状态')">
                <template slot-scope="scope">
                  {{scope.row.state|xb2zh}}
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
              <h1 class="title">{{ isCreateNewJob ? $t('common.add') : $t('common.edit') }}</h1>
            </div>
            <div class="operate">
              <el-button type="primary" class="green-gra" icon="icon his-save" @click="save">{{ $t('common.save') }}</el-button>
            </div>
          </div>
          <!-- getLists -->
          <el-form :model="form" ref="form" :rules="rules" label-width="80px">
            <!-- -->
            <el-form-item :label="$t('姓名')" prop="name">
              <el-input ref="brch" v-model.trim="form.name" :placeholder="$t('请输入名字')"></el-input>
            </el-form-item>

            <!--  -->
            <el-form-item :label="$t('身份证号')" prop="sfzh">
              <el-input ref="fjhm" v-model.trim="form.sfzh" :placeholder="$t('请输入身份证号')"></el-input>
            </el-form-item>
            <!-- 备注 -->
            <el-form-item :label="$t('备注')" prop="remake">
              <el-input ref="fjhm" v-model.trim="form.remake" :placeholder="$t('请输入备注')"></el-input>
            </el-form-item>
            <!-- 状态 -->
            <el-form-item :label="$t('解封状态')" prop="state">
              <el-radio-group v-model="form.state">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
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
@Component({
  name: 'blacklist',
  filters: {
    xb2zh(val: number) {
      switch (val) {
        case 1:
          return '否'
          break
        case 0:
          return '是'
          break
      }
    },
  },
})
export default class extends Vue {
  private form: any = {
    state: 1,
    name:'',
    remake:'',
    sfzh:'',
    id:null
  }
  private listSlotHeight: number = 0
  private tableDatas: any = []
  private rules: any = {
    name: [{ required: true, message: '请输入名字', trigger: 'blur' }],
    sfzh: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
    remake: [{ required: true, message: '请输入备注', trigger: 'blur' }],
    state: [{ required: true, message: '请选择状态', trigger: 'blur' }],
  }
  private isCreateNewJob: boolean = true //新增还是保存
  private PageHeight = Vue.prototype.PageHeight
  created() {
    this.listSlotHeight = this.PageHeight - 60 - 40 - 30
  }
  mounted() {
    this.getLists()
  }
  private getList(){
    this.getLists()
  }
  private searchData: any = {
    name: '',
    pageNum: 1,
    pageSize: 20,
    sfzh: '',
    state: 1,
  }
  private getLists() {
    ;(this.$refs.pageTable as any).getList()
  }
  private handleAdd() {
    this.isCreateNewJob = true
   ;(this.$refs.form as any).resetFields()
  }
  private changeGetList(){
    this.getLists()
  }
  //保存
  private save() {
    if ((this.isCreateNewJob == true)) {
      ;(this.$refs.form as any).validate((valid: boolean) => {
        if (valid) {
          this.form.id=null
          add(this.form).then((res: any) => {
            console.log(res, 'res')
            if (res.errorCode == 'SUCCESS') {
              this.getLists()
            }
          })
        }
      })
    } else {
      backEdit(this.form).then((res: any) => {
        console.log(res, 'res')
        if (res.errorCode == 'SUCCESS') {
          this.getLists()
          ;(this.$refs.form as any).resetFields()
          
        }
      })
    }
  }
  //编辑
  private getEdit(item: any) {
    console.log(item, item)
    this.form.id=item.id
    this.form.name=item.name
    this.form.remake=item.remake
    this.form.sfzh=item.sfzh
    this.form.state=item.state
    this.isCreateNewJob = false
  }
  private handleSearch(){
    this.getLists()
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
