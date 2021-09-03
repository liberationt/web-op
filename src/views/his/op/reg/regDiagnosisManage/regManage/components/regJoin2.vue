<template>
  <el-dialog
    :title="'预检分诊病人调入'"
    :visible.sync="dialogVisible"
    v-if="dialogVisible"
    width="980px"
    :close-on-click-modal="false"
    :destroy-on-close="false"
    class="narrow-dialog"
  >
    <div class="row">
      <div class="label">
        <div class="searchTitle">卡号</div>
        <el-input
          v-model="searchData.jzkh"
          :placeholder="'请输入卡号查询'"
          @keyup.enter.native="searchLists"
          class="search"
          ref="inputSearchJzkh"
          style="width: 200px"
        >
          <i slot="prefix" class="el-input__icon icon his-search"></i>
        </el-input>
        <el-button
          type="primary"
          icon="icon his-reading-card"
          class="read-card"
        >读卡</el-button>
        <div class="searchTitle">患者姓名</div>
        <el-input
          v-model="searchData.brxm"
          :placeholder="'请输入姓名查询'"
          @keyup.enter.native="searchLists"
          class="search"
          style="width: 200px"
        >
          <i slot="prefix" class="el-input__icon icon his-search"></i>
        </el-input>
        <div class="searchTitle" style="margin-left:20px;">日期</div>
        <el-date-picker
          v-model="searchData.fzrq"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择日期"
          class="date-wrapper"
          style="width: 200px;"
        ></el-date-picker>
        <el-divider direction="vertical"></el-divider>
        <div class="btn">
          <el-button type="text" size="mini" @click="searchLists" :disabled="isDisabled">
            <i class="icon his-caozuo_search blue"></i>
            <span>查询</span>
          </el-button>
        </div>
      </div>
    </div>
    <div class="his-module his-small">
      <pagenation-list
        ref="pageTable"
        v-model="tableData"
        data-url="/op-service/opghksManage/doQueryYjfzbrInfo"
        :search-data="searchData"
        http-method="post"
        :list-height="listSlotHeight"
      >
        <el-table
          slot="list"
          stripe
          ref="table"
          :highlight-current-row="true"
          :data="tableData"
          @row-click="getDetail"
          border
          v-loading="loading"
          :height="listSlotHeight"
          class="scroll-bar"
          tooltip-effect="light"
        >
          <el-table-column prop="webSortNumber" width="32"></el-table-column>

          <!-- 日期 -->
          <el-table-column prop="fzrq" :label="'日期'"></el-table-column>

          <!-- 来诊时间 -->
          <el-table-column prop="lzsj" :label="'来诊时间'" width="70"></el-table-column>

          <!-- 卡号 -->
          <el-table-column prop="jzkh" :label="'卡号'"></el-table-column>

          <!-- 姓名 -->
          <el-table-column prop="brxm" :label="'姓名'" width="60"></el-table-column>

          <!-- 性别 -->
          <el-table-column prop="brxb" :label="'性别'" width="60">
            <template slot-scope="scope">
              <div v-if="genderList.find(item => item.dv==scope.row.brxb)">
                {{genderList.find(item => item.dv==scope.row.brxb).dn}}
              </div>
              <div v-else>{{scope.row.brxb}}</div>
            </template>
          </el-table-column>

          <!-- 年龄 -->
          <el-table-column prop="brnl" :label="'年龄'" width="60"></el-table-column>

          <!-- 联系方式 -->
          <el-table-column prop="lxfs" :label="'联系方式'" width="100"></el-table-column>

          <!-- 主诉 -->
          <el-table-column prop="zs" :label="'主诉'" show-overflow-tooltip></el-table-column>

          <!-- 分诊级别 -->
          <el-table-column prop="fzjb" :label="'分诊级别'"></el-table-column>

          <!-- 分诊科室 -->
          <el-table-column prop="fzksdm" :label="'分诊科室'">
            <template slot-scope="scope">
              <div v-if="deptList.find(item => item.dv==scope.row.fzksdm)">
                {{deptList.find(item => item.dv==scope.row.fzksdm).dn}}
              </div>
              <div v-else>{{scope.row.fzksdm}}</div>
            </template>
          </el-table-column>

          <!-- 医生 -->
          <el-table-column prop="ysdm" :label="'医生'">
            <template slot-scope="scope">
              <div v-if="usersList.find(item => item.dv==scope.row.ysdm)">
                {{usersList.find(item => item.dv==scope.row.ysdm).dn}}
              </div>
              <div v-else>{{scope.row.ysdm}}</div>
            </template>
          </el-table-column>

          <!-- 护士 -->
          <el-table-column prop="fzhsdm" :label="'护士'">
            <template slot-scope="scope">
              <div v-if="usersList.find(item => item.dv==scope.row.fzhsdm)">
                {{usersList.find(item => item.dv==scope.row.fzhsdm).dn}}
              </div>
              <div v-else>{{scope.row.fzhsdm}}</div>
            </template>
          </el-table-column>

        </el-table>
      </pagenation-list>
    </div>
    <!-- {{curRow}} -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="selectPatient" :loading="btnLoading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
	aGetYjfzLsh
} from '@/api/his/op/reg/registerManage.ts'

declare interface IObj {
  [key: string]: string
}

@Component({
  name: ''
})

export default class extends Vue {
  @Prop({ required: true, default: () => ({}) }) private date: any // 当前日期

	private obj: IObj = {
    name: '',
    value: '',
  }
  private dialogVisible: boolean = false
  private isDisabled: boolean = false
  private tableData: any = []
  private searchData: any = {
    jzkh: '',
    brxm: '',
    fzrq: ''
  }
  private listSlotHeight: number = 400
  private curRow: any = {}
  private loading: boolean = false
  private genderList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT
  private deptList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REGISTERATION_DEPARTMENT_DICT : this.$store.state.webSqlDict.REGISTERATION_DEPARTMENT_DICT // 挂号科室
  private usersList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.USERS_DICT : this.$store.state.webSqlDict.USERS_DICT // 用户列表
  private btnLoading: boolean = false


  // 打开弹窗
	private openDialog(){
    this.curRow = {}
    this.searchData.fzrq = this.date
    this.dialogVisible = true
    this.searchLists()
	}

	// 关闭弹窗后
	private closeDialog(){

	}

	// 获取列表
  private searchLists() {
    this.$nextTick(()=>{
      const pageTable: any = this.$refs['pageTable']
      pageTable.searchList()
    })
  }

  private getDetail(row: any){
    this.curRow = row
  }

  // 确认选择
  private selectPatient(){
    if(!this.curRow.lsh){
      this.$notify({
        title: '请选择病人',
        message: '',
        type: 'warning'
      })
      return false
    }
    this.btnLoading = true
    aGetYjfzLsh({lsh: this.curRow.lsh}).then((res: any)=>{
      if(res){
        // if(this.curRow.jzkh){
          this.$emit('selected', res.data,this.curRow)
        // }else{
          // alert(2)
        // }
        this.dialogVisible = false
        this.btnLoading = false
      }
    })
    
  }


  //初始化的周期函数
	created() {
  }
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper ::v-deep{
  .el-dialog__body{
    padding: 0 0 10px;
  }
}

.row{
	.el-input{
		flex-grow: 1;
		margin-right: 0!important;
		::v-deep .el-input__inner{
			width: 100%!important;
		}
	}
	.read-card{
		height: 28px;
		margin: 0 20px 0 4px;
		padding: 0 10px;
		::v-deep span{
			font-size: 13px;
		}
	}
}

.el-table ::v-deep td.is-right .cell{
  padding-right: 8px!important;
}
</style>
