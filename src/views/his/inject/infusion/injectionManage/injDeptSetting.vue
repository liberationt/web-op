<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="16">
        <div class="his-module his-small">
          <!-- <pagenation-list
            ref="pageTable"
            v-model="list"
            data-url="/op-service/opfwtxx/queryPage"
            :list-height="listSlotHeight"
            :searchData="searchData"
            http-method="post"
          > -->
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">注射科室设置</h1>
              </div>
              <!-- <div class="operate">
                <el-button
                  type="primary"
                  size="mini"
                  class="blue-gra"
                  icon="icon his-add"
                  @click="handleAdd"
                >新增</el-button>
              </div> -->
            </div>
            <el-table
              slot="list"
              stripe
              :highlight-current-row="true"
              :data="tableData"
              :height="listSlotHeight"
              class="scroll-bar no-underline"
              border
              @row-click="getDetail"
            >
              <!-- 注射科室 -->
              <el-table-column prop="ksdm" label="注射科室" min-width="120">
                <template slot-scope="scope">
                  <div v-if="deptList.find(item => item.dv==scope.row.ksdm)">
                    {{deptList.find(item => item.dv==scope.row.ksdm).dn}}
                  </div>
                  <div v-else>{{scope.row.ksdm}}</div>
                </template>
              </el-table-column>

              <!-- 条码生成规则 -->
              <el-table-column prop="tmscgz" label="条码生成规则" min-width="120">
                <template slot-scope="scope">
                  <div v-if="barcodeRuleList.find(item => item.value==scope.row.tmscgz)">
                    {{barcodeRuleList.find(item => item.value==scope.row.tmscgz).label}}
                  </div>
                  <div v-else>{{scope.row.tmscgz}}</div>
                </template>
              </el-table-column>

              <!-- 前缀 -->
              <el-table-column prop="qz" label="前缀" min-width="80"></el-table-column>

              <!--  顺序号位数-->
              <el-table-column prop="sxhws" label="顺序号位数"></el-table-column>

              <!-- 下一顺序号 -->
              <el-table-column prop="xysxh" label="下一顺序号"></el-table-column>

              <!-- 状态 -->
              <el-table-column prop="zt" label="状态" min-width="60">
                <template slot-scope="scope">
                  <div
                    v-if="statusList.find(item => item.value==scope.row.zt)"
                    :class="scope.row.zt==1?'reds':'blues'"
                  >
                    {{statusList.find(item => item.value==scope.row.zt).label}}
                  </div>
                  <div v-else>{{scope.row.zt}}</div>
                </template>
              </el-table-column>

              <!-- 操作 -->
              <el-table-column label="操作" width="60" class-name="action-btns" align="center">
                <template slot-scope="scope">
                  <el-tooltip
                    :content="scope.row.zt == '0'?$t('common.disable'):$t('common.enable')"
                    effect="light"
                  >
                    <el-popconfirm
                      class="ml10"
                      hideIcon
                      :confirmButtonText="scope.row.zt=='0'?$t('common.disable'):$t('common.enable')"
                      :cancelButtonText="$t('common.cancel')"
                      :title="scope.row.zt=='0'?$t('sysManage.confirmDisabled'):$t('sysManage.confirmAutomated')"
                      @confirm="updateZt(scope.row)"
                    >
                      <el-button
                        slot="reference"
                        :class="[scope.row.zt=='0'?'red':'green']"
                      >
                        <i
                          class="icon"
                          :class="[scope.row.zt=='0'?'his-disabled':'his-automated']"
                        ></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          <!-- </pagenation-list> -->
        </div>
      </el-col>
      <el-col class="ht" :span="8">
        <div class="his-module his-small">
          <div slot="header" class="row">
            <div class="label">
              <!-- <h1 class="title">{{ isAdd ? $t('common.add') : $t('common.edit') }}</h1> -->
            </div>
            <div class="operate">
              <el-button
                type="primary"
                class="green-gra"
                icon="icon his-save"
                @click="validSxhwsDup"
                size="mini"
              >保存</el-button>
            </div>
          </div>
          <el-form :model="forms" ref="formValidate" :rules="rules" label-width="94px">
            <el-row :gutter="10" type="flex" justify="center">
              <el-col :span="18">
                <el-form-item label="注射科室" prop="ksdm">
                  <el-select v-model="forms.ksdm" placeholder="请选择注射科室" :disabled="true">
                    <el-option
                      v-for="item in deptList"
                      :key="item.dv"
                      :label="item.dn"
                      :value="item.dv"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" type="flex" justify="center">
              <el-col :span="18">
                <el-form-item label="条码生成规则" prop="tmscgz">
                  <el-select
                    v-model="forms.tmscgz"
                    placeholder="请选择条码生成规则"
                    @change="changTmgz"
                  >
                    <el-option
                      v-for="item in barcodeRuleList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" type="flex" justify="center">
              <el-col :span="18">
                <el-form-item label="前缀" prop="qz" :class="!requiredQz?'is-disabled':''">
                  <el-input v-model="forms.qz" placeholder="请输入前缀" :disabled="!requiredQz"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" type="flex" justify="center">
              <el-col :span="18">
                <el-form-item label="顺序号位数" prop="sxhws">
                  <el-input v-model="forms.sxhws" placeholder="请输入顺序号位数"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" type="flex" justify="center">
              <el-col :span="18">
                <el-form-item label="下一顺序号" prop="xysxh" :class="!isAdd?'is-disabled':''">
                  <el-input v-model="forms.xysxh" placeholder="请输入下一顺序号" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" type="flex" justify="center">
              <el-col :span="18">
                <el-form-item label="状态" prop="zt">
                  <el-select v-model="forms.zt" placeholder="请选择状态">
                    <el-option
                      v-for="item in statusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="科室类别" prop="kslb" hidden>
              <el-input v-model="forms.kslb" placeholder="请输入科室类别"></el-input>
            </el-form-item>

          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { aQuerySyksList, aSaveSyks, aUpdateZt, aValidDjdh } from '@/api/his/inject/infusion/deptSetting.ts'

@Component({
  name: 'infusionDepartmentSetting',
  filters: {},
  components: {},
})
export default class extends Vue {
  private searchData: any = {
    zsmc: '',
    pageNum: 1,
  }
  private tableData: any[] = []
  private listSlotHeight: number = 0 //列表高度
  private forms: any = {
    ksdm: '', // 科室代码
    tmscgz: '', // 条码生成规则
    qz: '', // 前缀
    sxhws: '', // 顺序号位数
    xysxh: '', // 下一顺序号
    zt: '0', // 状态 0启用，1停用
    kslb: 2 // 科室类别，1输液，2注射 hidden
  }
  // 验证规则
  private validateXysxh = (rule: any, value: any, callback: any) => {
    this.checkXysxh(value, callback)
  }
  private rules: any = {
    ksdm: [
      {required: true, message: '注射科室不能为空', trigger: 'blur'},
    ],
    tmscgz: [
      {required: true, message: '条码生成规则不能为空', trigger: 'blur'},
    ],
    qz:[],
    sxhws: [
      {required: true, message: '顺序号位数不能为空', trigger: 'blur'},
    ],
    xysxh: [
      {required: true, message: '下一顺序号不能为空', trigger: 'blur'},
      {validator: this.validateXysxh, trigger: 'blur'},
    ],
  }
  private title: string = ''
  private isAdd: boolean = true // 新增/修改
  private barcodeRuleList: any[] = [ // 条码生成规则
    {value: '1', label: '年+顺序号'},
    {value: '2', label: '年+月+顺序号'},
    {value: '3', label: '年+月+日+顺序号'},
    {value: '4', label: '前缀+顺序号'},
  ]
  private statusList: any[] = [ // 状态
    {value: '0', label: '启用'},
    {value: '1', label: '停用'},
  ]
  private requiredQz: boolean = false // 是否需要前缀
  private deptList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.INJECTION_DEPT : this.$store.state.webSqlDict.INJECTION_DEPT // 注射科室列表
  private ksdm: any = Vue.prototype.AUTHORITY.bussinessRole // 当前输液科室


  // 获取用户信息
  get userInfo() {
    return JSON.parse(localStorage.userInfo)
  }

  // 获取列表
  private getList(){
    aQuerySyksList({kslb: 2, ksdm: this.ksdm}).then((res: any) => {
      if(res){
        this.tableData = res.data
        if(this.tableData.length){
          this.getDetail(this.tableData[0])
        }
      }
    })
  }

  // 查看详情
  private getDetail(row: any){
    for(let i in this.forms){
      this.forms[i] = row[i]
    }
    this.isAdd = false
    this.changTmgz(row.tmscgz)
  }

  //新增按钮
  private handleAdd() {
    const form: any = this.$refs.formValidate
    form.resetFields()
    this.isAdd = true
    this.rules.qz = []
  }

  //保存
  private handleSave() {
    const form: any = this.$refs.formValidate
    form.validate((valid: any)=>{
      if(valid){
        aSaveSyks(this.forms).then((res: any) => {
          if(res){
            this.$notify({
              title: '保存成功',
              message: '',
              type: 'success'
            })
            this.getList()
            this.handleAdd()
          }
        })
      }
    })
  }

  // 切换条码规则
  private changTmgz(value: any){
    if(value == 4){ // 需要前缀
      this.rules.qz = [
        {required: true, message: '前缀不能为空', trigger: 'blur'},
      ]
      this.requiredQz = true
    }else{
      this.rules.qz = []
      this.requiredQz = false
      this.forms.qz = ''
    }
  }

  // 验证顺序号位数是否可用
  private validSxhwsDup(){
    let params = {
      kslb: 2,
      tmscgz: this.forms.tmscgz,
      sxhws: this.forms.sxhws,
      ksdm: this.isAdd?'':this.ksdm // 新增时不传当前科室代码
    }
    aValidDjdh(params).then((res: any)=>{
      if(res.data == false){
        this.$message({
          message: '已有相同的条码规则和顺序号位数',
          type: 'error'
        })
      }else{
        this.handleSave()
      }
    })
  }

  // 验证顺序号位数
  private checkXysxh(value: any, callback: any){
    if(value.length != this.forms.sxhws){
      callback(new Error('顺序号位数不符'))
    }else{
      callback()
    }
  }

  //停用/启用
  private updateZt(row: any) {
    let params = {
      ksdm: row.ksdm,
      kslb: row.kslb,
      zt: row.zt==0?1:0
    }
    aUpdateZt(params).then((res: any) => {
      if(res){
        this.$notify({
          title: row.zt==0?'停用成功':'启用成功',
          message: '',
          type: 'success'
        })
        this.getList()
        this.handleAdd()
      }
    })
  }

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight - 76
  }

  mounted() {
    // this.searchData.hospitalId = this.userInfo.hospitalId
    // this.title = this.$t('common.add').toString()
    // this.forms.hospitalId = this.userInfo.hospitalId
    this.forms.ksdm = this.ksdm
    this.getList()
  }

}
</script>
<style lang="scss" scoped>
// .content .his-module .el-table--medium td .el-button{
//   width: 60px;
//   height: 32px;
//   border-radius: 8%;
//   &-span{
//     color: #ffffff;
//   }
// }
.el-form{
  margin: 24px auto 0!important;
}
</style>
