<!--
 * @Author: 曹俊
 * @LastEditTime: 2020-09-08 11:25:26
 * @LastEditors: 曹俊
 * @Description: 
 * @FilePath: \web-op\src\views\his\config\configuration\setting.vue
--> 
<template>
  <div class="content ht">
    <el-row class="el-row ht">
      <el-col class="ht" :span="20">
        <div class="his-module his-small his-setting">
          <div class="row">
            <div class="label">
              <div class="querySearch">
                <span class="tag">自定义中文名称</span>
                <el-input v-model.trim="forms.zhName"></el-input>
              </div>
              <div class="querySearch">
                <span class="tag">自定义英文名称</span>
                <el-input v-model.trim="forms.enName"></el-input>
              </div>
            </div> 
            <div class="operate">
              <el-button
                size="mini"
                type="primary"
                class="green-gra"
                icon="icon his-save"
                @click="handleSubmit"
                >提交</el-button>
            </div>
          </div>
          <el-tabs class="tab-small" v-model="tabsName">
            <!-- SELECT start -->
            <el-tab-pane label="SELECT" name="select">
              <selects :from-list="fromList" :data-list="selectList" ref="selects" @getSelectList="getSelectList"></selects>
            </el-tab-pane>
            <!-- SELECT end -->
            <!-- FROM start -->
            <el-tab-pane label="FROM" name="from">
              <froms :table-list="tableList" :data-list="fromList" ref="froms" @getFormList="getFormList"></froms>
            </el-tab-pane>
            <!-- FROM end -->
            <!-- WHERE start -->
            <el-tab-pane label="WHERE" name="where">
              <where :from-list="fromList" :data-list="whereList" ref="where" @getWhereList="getWhereList"></where>
            </el-tab-pane>
            <!-- WHERE end -->
            <!-- ORDER BY start -->
            <el-tab-pane label="ORDER" name="order">
              <order :from-list="fromList" :data-list="orderList"  ref="order" @getOrderList="getOrderList"></order>
            </el-tab-pane>
            <!-- ORDER BY end -->
          </el-tabs>
        </div>
      </el-col>
      <el-col class="ht pl10" :span="4">
        <div class="his-module his-small">
          <div class="sql scroll-bar" :style="{height: listSlotHeight * 2 + 'px' }">{{sqlData}}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import selects from './components/select.vue'
import froms from './components/from.vue'
import where from './components/where.vue'
import order from './components/order.vue'
import { 
  Iitem, 
  getAlltabel, 
  getAllColumn, 
  getTablesColumn,
  addDesignQuery, 
  editDesignQuery, 
  getSql,
  getOneById
} from '@/api/his/config/index.ts'
import { log } from 'util'

@Component({
  name: 'configuration',
  components: {
    selects,
    froms,
    where,
    order,
  },
})
export default class extends Vue {
  private tableList: Array<any>  = []
  private tableDatas = []
  private tabsName: string = 'select'
  private tableData: Array<any> = []
  private showTag: boolean = true
  private queryId: number = -1
  private forms: Iitem = {
    zhName: '',
    enName:''
  }
  private selectList: Array<any>  = [] // select模块数据
  private fromList: Array<any>  = [] // from模块数据
  private whereList: Array<any>  = [] // where模块数据
  private orderList: Array<any>  = [] // order by模块数据
  private dataList: Array<any>  = []
  private creatOrEdit: boolean = true // 新增或编辑状态 新增 - true  编辑 - false
  private form = {
      businessName: '',
      tableName: '' 
  }
  private listSlotHeight: number = 0
  private sqlData: string = ''
  
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight / 2
  }
  mounted() {
    this.getAlltabel()
    // 获取列表跳转参数data
    let id = this.$route.query.id
    console.log(id)
    if(id != undefined){
      
    // 获取详情
    getOneById(id).then((res) => {
      console.log("list=")
      console.log(res.data)
      let result: any = res.data
      if( result != undefined ){
        this.queryId = result.queryId
        this.forms.enName = result.enName
        this.forms.zhName = result.zhName
        this.selectList = result.selectList
        this.fromList = result.fromList
        this.whereList = result.whereList
        this.orderList = result.orderList
        this.creatOrEdit = false
        console.log("selectList=");
        console.log(this.selectList)
        console.log("fromList=");
        console.log(this.fromList)
        console.log("whereList=");
        console.log(this.whereList)
        console.log("orderList=");
        console.log(this.orderList)
      }else{
        this.forms.enName = ''
        this.forms.zhName = ''
        this.selectList = []
        this.fromList = []
        this.whereList = []
        this.orderList = []
        this.creatOrEdit = true
      }
    })

    }
  }
  // 获取所有表
  private getAlltabel() {
    getAlltabel({}).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
       this.tableList = res.data
      //  console.log(this.tableList);
       //  获取表字段信息
       //  this.getAllColumn()
      }
    })
  }
  
  // 获取Select模块数据
  private getSelectList(val: any){
    this.selectList = val
    console.log("selectList=")
    console.log(this.selectList);
  }
  
  // 获取From模块数据
  private getFormList(val: any){
    this.fromList = val
    console.log("fromList=")
    console.log(this.fromList);
  }

  // 获取From模块数据
  private getWhereList(val: any){
    this.whereList = val
    console.log("whereList=")
    console.log(this.whereList);
  }

  // 获取Order By模块数据
  private getOrderList(val: any){
    this.orderList = val
    console.log("orderList=")
    console.log(this.orderList);
  }
  
  // 删除条件记录表
  private handleRemove(index: number){
    this.fromList[index].status = 0;
  }  
  // 显示弹框改变联接方式
  // private handleChange(data: any){
  //   this.dialogWidth ='300px' 
  //   this.isVisible = true
  //   this.isJoin = false
  //   this.isAlias = false
  //   this.isStyle = true
  //   this.isCondition = false
  //   this.fromIndex = data.index
  //   this.activeIndex = data.activeIndex
  // }
  
  // 展开、收起表-子段
  // private handleToggle(item: any, index: number){
  //   this.tableColumn[index].showTag = item.showTag ? false : true
  // }
    
  
  // 提交
  private handleSubmit(){
    let creatOrEdit = this.creatOrEdit;
    let dataObj: any = {}
    let zhName: string = this.forms.zhName
    let enName: string = this.forms.enName
    dataObj.zhName = this.forms.zhName
    dataObj.enName = this.forms.enName
    dataObj.selectList = this.selectList
    dataObj.fromList = this.fromList
    dataObj.whereList = this.whereList
    dataObj.orderList = this.orderList
    if(creatOrEdit){ // 新增
      if(zhName==''){
        this.$notify({
            title: '自定义中文名称',
            message: '',
            type: 'warning'
          });
      } else if(enName==''){
        this.$notify({
            title: '自定义英文名称',
            message: '',
            type: 'warning'
          });
      } else {
        addDesignQuery(dataObj).then((res: any) => {  
          this.$notify({
            title: '新增成功',
            message: '',
            type: 'success'
          });
          // 获取sql语句
          getSql(dataObj).then((data: any) => {  
            this.sqlData =  ''
            this.sqlData = data.data
          })
        })
      }
    }else{
      if(zhName==''){
        this.$notify({
            title: '自定义中文名称不能为空',
            message: '',
            type: 'warning'
          });
      } else if(enName==''){
        this.$notify({
            title: '自定义英文名称不能为空',
            message: '',
            type: 'warning'
          });
      } else {
        dataObj.queryId = this.queryId
        editDesignQuery(dataObj).then((res: any) => {  
          this.$notify({
            title: '修改成功',
            message: '',
            type: 'success'
          });
          // 获取sql语句
          getSql(dataObj).then((data: any) => {  
            this.sqlData =  ''
            this.sqlData = data.data
          })
        })
      }
    }
    
  }
}
</script>

<style lang="scss">
@import 'config.scss';
</style>

<style lang="scss" scoped>
.el-row {
    display: flex;
}
</style>
