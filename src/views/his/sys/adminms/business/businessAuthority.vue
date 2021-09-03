<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="14">
        <div class="his-module">
          <pagenation-list
            ref="pageTable"
            v-model="tableDatas"
            data-url="/system-service/dicywlb/queryPersonalPage"
            http-method="post"
            :list-height="listSlotHeight"
            :searchData="searchData"
          >
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">用户列表</h1>
                <el-select
                  v-model="searchData.groupId"
                  :placeholder="'选择岗位角色查询'"
                  class="select"
                  @change="searchList"
                >
                  <el-option
                    v-for="item in groupList"
                    :key="item.groupId"
                    :label="item.groupName"
                    :value="item.groupId"
                  ></el-option>
                </el-select>
                <el-input
                  v-model="searchData.searchPharm"
                  :placeholder="'输入工号或姓名查询'"
                  @change="searchList"
                  class="input ml10"
                >
                  <i slot="prefix" class="el-input__icon icon his-search"></i>
                </el-input>
              </div>
              <div class="operate">
              </div>
            </div>
            <el-table
              :data="tableFormat"
              border
              stripe
              :highlight-current-row="true"
              slot="list"
              @row-click="handleRowClick"
              :height="listSlotHeight"
              class="scroll-bar"
            >
              <!-- <el-table-column type="selection" width="34" align="center"></el-table-column> -->

              <!-- 员工工号 -->
              <el-table-column prop="rybh" :label="'员工工号'" width="90"></el-table-column>

              <!-- 员工姓名 -->
              <el-table-column prop="personname" :label="'员工姓名'"></el-table-column>

              <!-- 行政职务 -->
              <el-table-column prop="jobpostName" :label="'行政职务'"></el-table-column>

              <!-- 科室名称 -->
              <el-table-column prop="officecodeName" :label="'科室名称'"></el-table-column>

              <!-- 医疗角色 -->
              <el-table-column prop="medicalrolesName" :label="'医疗角色'"></el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col class="ht" :span="4">
        <div class="his-module">
          <div class="row">
            <div class="label">
              <h1 class="title">业务类型</h1>
            </div>
          </div>
          <ul class="list1 scroll-bar">
            <li
              v-for="(item,index) in checked1"
              :key="index"
              :class="curBtId==item.btId?'is-focused':''"
              @click="checkedClick(item)"
            >{{item.btName}}</li>
          </ul>
          <!-- <el-checkbox-group v-model="checked1" class="check-list scroll-bar">
            <div
              v-for="(item,index) in list1"
              :key="index"
            >
              <el-checkbox :label="item.btId">{{''}}</el-checkbox>
              <span
                :class="curBtId==item.btId?'is-focused':''"
                @click="checkedClick(item)"
              >{{item.btId}}-{{item.btName}}</span>
            </div>
          </el-checkbox-group> -->
        </div>
      </el-col>
      <el-col class="ht" :span="6">
        <div class="his-module">
          <div class="row">
            <div class="label">
              <h1 class="title">业务权限</h1>
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
          <el-checkbox-group v-model="checked2" class="check-list scroll-bar">
            <div
              v-for="(item,index) in list2"
              :key="index"
            >
              <el-checkbox :label="item.queryid">{{item.showname}}</el-checkbox>
              <!-- <span
                :class="curQueryid==item.queryid?'is-focused':''"
                @click="curQueryid=item.queryid"
              >{{item.queryid}}-{{item.showname}}</span> -->
            </div>
          </el-checkbox-group>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  aBusinessTypeAll, aUserBusinessType, aAuthList, aFindqx, aAuthEdit
} from '@/api/his/sys/adminms/business/business.ts'
import { findSysgroupList } from '@/api/his/user/workerManager.ts'
import { getTableData } from '@/websql/functions'
import { id2Name } from '@/utils'

@Component({
  name: '',
})
export default class extends Vue {
  private tableDatas: any[] = []
  private searchData: any = {
    groupId: '',
    searchPharm: ''
  }
  private groupList: any[] = [] // 岗位列表
  private listSlotHeight: number = 0 //列表高度
  private list1: any[] = []
  private list2: any[] = []
  private checked1: any = []
  private checked2: any = []
  private curPersonId: number|string = '' // 当前选中左
  private curBtId: number|string = '' // 当前选中中
  private curQueryid: number|string = '' // 当前选中右
  private jobpostList: any[] = [] // 行政职务
  private officecodeList: any[] = [] // 科室名称
  private medicalrolesList: any[] = [] // 医疗角色

  private PageHeight = Vue.prototype.PageHeight

  get tableFormat() {
    let newData: any = []
    newData = id2Name(this.tableDatas, 'jobpost', 'jobpostName', this.jobpostList, 'dv', 'dn')
    newData = id2Name(this.tableDatas, 'officecode', 'officecodeName', this.officecodeList, 'dv', 'dn')
    newData = id2Name(this.tableDatas, 'medicalroles', 'medicalrolesName', this.medicalrolesList, 'dv', 'dn')
    return newData
  }

  created() {
    this.listSlotHeight =this.PageHeight - 51 - 40 - 30
  }
  mounted() {
    // this.getLists()
    this.getBtList()
    this.getGroupList()
    this.getDicData()
  }

  //获取表格数据
  private getLists() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 条件查询
  private searchList() {
    const pageTable: any = this.$refs.pageTable
    // if (this.searchData.groupName == '') {
    //   pageTable.getList()
    // } else {
      pageTable.searchList()
    // }
  }

  // 获取有效岗位角色列表
  private getGroupList(){
    findSysgroupList({}).then((res: any) => {
      if(res){
        this.groupList = res.data
      }
    })
  }

  // 点击表格，根据人员ID取权限
  private handleRowClick(row: any){
    this.curPersonId = row.personid
    this.curBtId = ''
    aUserBusinessType({personid: this.curPersonId}).then((res: any) => {
      if(res){
        console.log('所选用户业务类型');
        console.log(res.data);
        // this.checked1 = res.data
        this.checked1 = this.list1.filter((item)=>{
          return res.data.indexOf(item.btId) > -1
        })
        console.log('勾选的业务类型');
        console.log(this.checked1);
        this.list2 = []
        // 默认选中第一条
        if(this.checked1.length>0){
          this.checkedClick(this.checked1[0])
        }
      }
    })
  }

  // 获取所有业务类型
  private getBtList(){
    aBusinessTypeAll().then((res: any) => {
      if(res){
        this.list1 = res.data
      }
    })
  }

  // 点击第一层单选框
  private checkedClick(item: any){
    this.curBtId = item.btId
    aAuthList({btId: this.curBtId}).then((res: any) => {
      if(res){
        console.log(`${item.btName}的所有权限:`);
        console.log(res.data);
        this.list2 = res.data
      }
    })
    if(this.curPersonId!=null){
      aFindqx({btId: this.curBtId, personid: this.curPersonId}).then((res: any) => {
        if(res){
          console.log('已有权限');
          console.log(res.data);
          this.checked2 = res.data
        }
      })
    }
  }

  // 保存按钮
  private handleSubmit(){
    // if(this.checked2.length==0){
    //   this.$notify({
    //     title: '请选择业务权限',
    //     message: '',
    //     type: 'warning',
    //   })
    //   return false
    // }

    // 权限可能被删除，已有权限可能不存在于所有权限中
    // list2、checked2取交集
    var intersection: any = []
    this.list2.forEach((item: any)=>{
      if(this.checked2.includes(item.queryid)){
        intersection.push(item.queryid)
      }
    })
    var params = {
      ygdm: this.curPersonId,
      ywlb: this.curBtId,
      queryids: intersection
    }
    aAuthEdit(params).then((res: any) => {
      if(res){
        this.$notify({
          title: this.$t('common.editSuc').toString(),
          message: '',
          type: 'success',
        })
      }
    })
  }

  // 查询字典数据
  private getDicData(){
    const _that = this
    getTableData(
      'SYS_PRIMARY_DATA',
      'PD0000000001',
      "select dv,dn from SYS_PRIMARY_DATA_VALUE where dk='PD0000000001'",
      function (data: any) {
        _that.jobpostList = data
        getTableData(
          'SYS_DICT_CONFIG',
          '4',
          "select dv,dn from SYS_DICT_CONFIG_VALUE where dk='4'",
          function (data: any) {
            _that.officecodeList = data
            getTableData(
              'SYS_DICT_CONFIG',
              '8',
              "select dv,dn from SYS_DICT_CONFIG_VALUE where dk='8'",
              function (data: any) {
                _that.medicalrolesList = data
                _that.getLists()
              }
            )
          }
        )
      }
    )
  }

}
</script>

<style lang='scss' scoped>
.row .label ::v-deep{
  .select{
    max-width: 160px;
  }
  .input{
    max-width: 160px;
  }
  .el-input{
    width: auto;
  }
  .el-input__inner{
    width: 100%!important;
  }
  .el-input__icon{
    line-height: 30px;
  }
}
.list1{
  height: calc(100% - 64px);
  overflow: auto;
  li{
    padding: 8px 0;
    font-size: 13px;
    cursor: pointer;
    &.is-focused{
      background: rgba($color: $blue, $alpha: .1);
    }
  }
}
.check-list{
  height: calc(100% - 64px);
  overflow: auto;
  >div{
    padding: 8px 0;
    // border: 1px solid #f00;
    >span{
      cursor: pointer;
      &.is-focused{
        background: rgba($color: $blue, $alpha: .1);
      }
    }
  }
}
</style>
