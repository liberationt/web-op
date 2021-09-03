<!--
 * @Author: 曹俊
 * @LastEditTime: 2020-07-08 22:25:58
 * @LastEditors: 曹俊
 * @Description: 
 * @FilePath: \web-op\src\views\his\config\configuration\components\from.vue
--> 
<template>
    <div>
        <!-- 默认列表 -->
        <div class="his-row" v-show="!isDefault">
            <el-popover
            placement="bottom-start"
            width="300"
            v-model="visible"
            trigger="click">
                <div class="from-popover">
                <el-tabs class="tab-small" v-model="tabName" >
                    <!-- 标识符 start -->
                    <el-tab-pane label="标识符" name="first">
                    <!-- FROM第一次获取表格数据 -->
                    <template>
                      <div class="tbl" v-for="(table, tIdx) in tableList" :key="tIdx" @click="handleSelect(table)">
                        <i class="icon his-table"></i> {{table.tableName}}
                      </div>
                    </template>
                    </el-tab-pane>
                    <!-- 标识符 end -->
                    <!-- 表达式/子查询 start -->
                    <el-tab-pane label="表达式/子查询" name="second">
                      <el-input class="expression" v-model="expression"></el-input>
                    </el-tab-pane>
                    <!-- 表达式/子查询 end -->
                </el-tabs>
                </div>
                <el-button class="add mr10" slot="reference">+</el-button>
            </el-popover>
            <span>点击"+"以添加字段</span>
        </div>
        <!-- 通过默认列表选择表之后显示 -->
        <div class="from-list" v-show="isFrom">
            <ul>
              <li v-for="(item, index) in fromList" :key="index">
                <div class="condition" v-if="index > 0">
                  <!-- 联接方式 start -->
                  <el-popover placement="bottom-start" width="300" v-model="item.isJoinType" trigger="click">
                    <div class="from-box">
                      <!-- 导航 -->
                      <el-menu
                        :default-active="activeIndex"
                        class="el-menu-vertical-demo"
                        @select="handleAgainSelectMenu($event,item,index)"
                      >
                        <el-menu-item index="1">
                          <i class="el-icon-menu"></i>
                          <div>
                            <span slot="title">INNER JOIN</span>
                            <p>从表L和表R中选择符合联接条件的所有记录。</p>
                          </div>
                        </el-menu-item>
                        <el-menu-item index="2">
                          <i class="el-icon-document"></i>
                          <div>
                            <span slot="title">LEFT JOIN</span>
                            <p>选择表L中的所有记录，以及表R中符合联接条件的记录（如果有的话）。</p>
                          </div>
                        </el-menu-item>
                        <el-menu-item index="3">
                          <i class="el-icon-setting"></i>
                          <div>
                            <span slot="title">RIGHT JOIN</span>
                            <p>选择表R中的所有记录，以及表L中符合联接条件的记录（如果有的话）。</p>
                          </div>
                        </el-menu-item>
                      </el-menu>
                    </div>
                    <em class="blue" slot="reference" @click="handleChange(item)">{{item.joinType}}</em>
                  </el-popover>
                  <!-- 联接方式 end -->
                  <!-- 列表添加条件 start -->
                  <el-popover placement="bottom-start" width="300" v-model="item.isAddCondition" trigger="click">
                    <template>
                        <div class="conditions"> 
                        <div class="his-row" v-show="isAddCondition"> 
                          <el-button class="add mr10" @click="handleSelectCondition(item,index)">+</el-button> 
                          <span>点击"+"以添加条件</span>
                        </div>
                        <div class="condition-list" v-for="(join,jIdx) in item.fromJoinList" :key="jIdx" v-show="isConditionList">
                          <ul>
                            <li>
                              <!-- 选值1 start -->
                              <el-popover trigger="click" placement="bottom-start" width="300" v-model="join.isValue1">
                                <!-- 表-字段选择 start -->
                                <template>
                                  <el-tabs class="tab-small" v-model="selectName">
                                    <!-- 标识符 -->
                                    <el-tab-pane label="标识符" name="identifier">
                                        <!-- 第一次获取表格数据 -->
                                        <template>
                                            <el-collapse v-model="activeName" accordion>
                                            <el-collapse-item :name="tIdx" v-for="(table,tIdx) in tableColumn" :key='tIdx'>
                                                <template slot="title">
                                                <!-- <i class="header-icon el-icon-info"></i> -->
                                                {{`${table.tableName}(${table.alias})`}}
                                                </template>
                                                <div class="field-name" v-for="(column,cIdx) in table.columnlist" :key="cIdx" @click="handleSelSort(item,index,join,jIdx,table,column,1)">{{column.columnName}}{{`(${column.alias})`}}</div>
                                            </el-collapse-item>
                                            </el-collapse>
                                        </template>
                                    </el-tab-pane>
                                    <!-- 自定义 -->
                                    <el-tab-pane label="自定义" name="custom">
                                        <el-input class="expression" v-model="customValue"></el-input>
                                    </el-tab-pane>
                                  </el-tabs>
                                </template>
                                <span slot="reference" @click="handleSelectValue(item,index,join,jIdx,1)">{{join.joinOnTable1 == null && join.joinOnColumn1 == null ? '&lt;值&gt;':join.joinOnTable1 +'.'+ join.joinOnColumn1}}</span>
                              </el-popover>
                              <!-- 选值1 end -->
                              <!-- 比较运算符 start -->
                              <el-popover trigger="click" placement="bottom-start" width="300" v-model="join.isSymbol">
                                <div class="operator">
                                  <div class="symbol" v-for="(symbol,sIdx) in operatorList" :key="sIdx" @click="handleSelSymbol(item,index,join,jIdx,symbol,sIdx)"><i class="icon his-active" v-show="operatorIndex == sIdx"></i>{{symbol.label}}</div>
                                </div>
                                <em class="blue" slot="reference" @click="handleSelExpression(index,jIdx)">{{join.joinExpression}}</em>
                              </el-popover>
                              <!-- 比较运算符 end -->
                              <!-- 选值2 start -->
                              <el-popover trigger="click" placement="bottom-start" width="300" v-model="join.isValue2">
                                <!-- 表-字段选择 start -->
                                <template>
                                  <el-tabs class="tab-small" v-model="selectName">
                                    <!-- 标识符 -->
                                    <el-tab-pane label="标识符" name="identifier">
                                        <!-- 第一次获取表格数据 -->
                                        <template>
                                            <el-collapse v-model="activeName" accordion>
                                            <el-collapse-item :name="tIdx" v-for="(table,tIdx) in tableColumn" :key='tIdx'>
                                                <template slot="title">
                                                <!-- <i class="header-icon el-icon-info"></i> -->
                                                  {{`${table.tableName}(${table.alias})`}}
                                                </template>
                                                <div class="field-name" v-for="(column,cIdx) in table.columnlist" :key="cIdx" @click="handleSelSort(item,index,join,jIdx,table,column,2)">{{column.columnName}}{{`(${column.alias})`}}</div>
                                            </el-collapse-item>
                                            </el-collapse>
                                        </template>
                                    </el-tab-pane>
                                    <!-- 自定义 -->
                                    <el-tab-pane label="自定义" name="custom">
                                        <el-input class="expression" v-model="customValue"></el-input>
                                    </el-tab-pane>
                                  </el-tabs>
                                </template>
                                <!-- 表-字段选择 ene -->
                                <span slot="reference" @click="handleSelectValue(item,index,join,jIdx,2)">{{join.joinOnTable2 == null && join.joinOnColumn2 == null ? '&lt;值&gt;':join.joinOnTable2 +'.'+ join.joinOnColumn2}} </span>
                              </el-popover>
                              <!-- 选值2 end  -->
                              <em v-show="joinIdx != jIdx" @click="handleJoinAndOr(item,index,join,jIdx)">{{join.joinAndOr == null ? '' : join.joinAndOr == 'and' ? '和' : '或'}}</em>
                              <el-button class="add ml10" @click="handleAddJoin(item,index,join,jIdx)" v-show="joinIdx == jIdx">+</el-button>
                              <i class="icon his-close" @click="handleDel(item,index,join,jIdx)"></i>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </template>
                    <span  class="add-conditon gray" slot="reference" @click="handleAddCondition(item)" v-if="item.fromJoinList.length <= 0 ">&lt;添加条件&gt;</span>
                    <span  class="add-conditon gray" slot="reference" @click="handleAddCondition(item)" v-else>
                      <em v-for="(condition, cnIndex) in item.fromJoinList" :key="'condition'+cnIndex"> {{condition.joinAndOr != null ? condition.joinAndOr : ''}} {{`${condition.joinOnTable1}.${condition.joinOnColumn1}${condition.joinExpression}${condition.joinOnTable2}.${condition.joinOnColumn2}`}}</em>
                    </span>
                  </el-popover>
                  <!-- 列表添加条件 end -->
                </div>
                <div class="tableName">
                  <!-- 表名 -->
                  <el-popover placement="bottom-start" width="644" trigger="click" v-model="item.tableVisible">
                     <div>
                      <div class="from-box">
                        <!-- 导航 -->
                        <el-menu
                          :default-active="activeIndex"
                          class="el-menu-vertical-demo"
                          @select="handleSelectMenu"
                        >
                          <el-menu-item index="1">
                            <i class="el-icon-menu"></i>
                            <div>
                              <span slot="title">INNER JOIN</span>
                              <p>从表L和表R中选择符合联接条件的所有记录。</p>
                            </div>
                          </el-menu-item>
                          <el-menu-item index="2">
                            <i class="el-icon-document"></i>
                            <div>
                              <span slot="title">LEFT JOIN</span>
                              <p>选择表L中的所有记录，以及表R中符合联接条件的记录（如果有的话）。</p>
                            </div>
                          </el-menu-item>
                          <el-menu-item index="3">
                            <i class="el-icon-setting"></i>
                            <div>
                              <span slot="title">RIGHT JOIN</span>
                              <p>选择表R中的所有记录，以及表L中符合联接条件的记录（如果有的话）。</p>
                            </div>
                          </el-menu-item>
                        </el-menu>
                        <el-tabs class="tab-small" v-model="tabName" >
                          <!-- 标识符 start -->
                          <el-tab-pane label="标识符" name="first">
                            <!-- FROM第一次获取表格数据 -->
                            <template>
                              <!-- @click="handleSelect(item)" -->
                              <div class="tbl" v-for="(table,tIdx) in tableList" :key="tIdx" @click="handleJoinAgainSelect(item,index,table)">
                                  <i class="icon his-table"></i> {{table.tableName}}
                              </div>
                            </template>
                          </el-tab-pane>
                          <!-- 标识符 end -->
                          <!-- 表达式/子查询 start -->
                          <el-tab-pane label="表达式/子查询" name="second">
                              <el-input class="expression" v-model="expression"></el-input>
                          </el-tab-pane>
                          <!-- 表达式/子查询 end -->
                        </el-tabs>
                      </div>
                    </div>
                    <el-button slot="reference">{{item.tableName}}</el-button>
                  </el-popover>
                  <!-- 别名 start -->
                  <el-popover placement="bottom-start" width="300" v-model="item.isAlias" trigger="click">
                    <el-input class="alias" v-model="alias" @keydown.enter.native="handleEnterAlias(item,index)" clearable></el-input>
                    <span class="gray" slot="reference" @click="handleAddAlias(item)">{{item.aliasName == '' || item.aliasName == undefined  ? "&lt;别名&gt;" : '('+item.aliasName+')'}}</span>
                  </el-popover>
                  <!-- 别名 end -->
                  <!-- 新增表名列表 start -->
                  <el-popover placement="bottom-start" width="644" trigger="click" v-model="item.isAdd">
                    <div>
                      <div class="from-box">
                        <!-- 导航 -->
                        <el-menu
                          :default-active="activeIndex"
                          class="el-menu-vertical-demo"
                          @select="handleSelectMenu"
                        >
                          <el-menu-item index="1">
                            <i class="el-icon-menu"></i>
                            <div>
                              <span slot="title">INNER JOIN</span>
                              <p>从表L和表R中选择符合联接条件的所有记录。</p>
                            </div>
                          </el-menu-item>
                          <el-menu-item index="2">
                            <i class="el-icon-document"></i>
                            <div>
                              <span slot="title">LEFT JOIN</span>
                              <p>选择表L中的所有记录，以及表R中符合联接条件的记录（如果有的话）。</p>
                            </div>
                          </el-menu-item>
                          <el-menu-item index="3">
                            <i class="el-icon-setting"></i>
                            <div>
                              <span slot="title">RIGHT JOIN</span>
                              <p>选择表R中的所有记录，以及表L中符合联接条件的记录（如果有的话）。</p>
                            </div>
                          </el-menu-item>
                        </el-menu>
                        <el-tabs class="tab-small" v-model="tabName" >
                          <!-- 标识符 start -->
                          <el-tab-pane label="标识符" name="first">
                            <!-- FROM第一次获取表格数据 -->
                            <template>
                              <!-- @click="handleSelect(item)" -->
                              <div class="tbl" v-for="(table, tIdx) in tableList" :key="tIdx" @click="handleJoinSelect(item,index,table,tIdx)">
                                  <i class="icon his-table"></i> {{table.tableName}}
                              </div>
                            </template>
                          </el-tab-pane>
                          <!-- 标识符 end -->
                          <!-- 表达式/子查询 start -->
                          <el-tab-pane label="表达式/子查询" name="second">
                              <el-input class="expression" v-model="expression"></el-input>
                          </el-tab-pane>
                          <!-- 表达式/子查询 end -->
                        </el-tabs>
                      </div>
                    </div>
                    <el-button class="add ml10" slot="reference" v-show="curIndex == index">+</el-button>
                  </el-popover>
                  <!-- 新增表名列表 end -->
                </div>
                <i class="icon his-close" @click="handleRemove(item,index)"></i>
              </li>
            </ul>
        </div>
    </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { Iitem, getAlltabel, getAllColumn, getTablesColumn} from '@/api/his/config/index.ts'
import { log } from 'util'
import { unique } from '@/utils/index.ts'
//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'froms',
  filters: {},
})
export default class extends Vue {
  @Prop({ required: true }) private tableList!: any
  @Prop({ required: true }) private dataList!: any
  
  // FROM - 模块
  private tabName: string = 'first'
  private fromList: Array<any>  = []
  private operatorList: Array<any>  = [
    {
      index: 0,
      label: '='
    },
    {
      index: 1,
      label: '<>'
    },
    {
      index: 2,
      label: '<='
    },
    {
      index: 3,
      label: '<'
    },
    {
      index: 4,
      label: '>'
    },
    {
      index: 5,
      label: '>='
    },
    {
      index: 6,
      label: 'like'
    },
  ] // 比较运算符列表 
  private operatorIndex: number = 0
  private tableData: Array<any>  = []
  private tableColumn : Array<any> = [] 
  private dialogWidth: string = "0" // 弹框宽度
  private isFrom: boolean = false
  private visible: boolean = false 
  private activeIndex: string = '1' // 菜单索引 
  private curIndex: number = 0
  private alias: string = '' // 别名
  private isCondition: boolean = false
  private isVisible: boolean  = false
  private isDefault: boolean = false // 是否默认显示
  private tableName: string = '' // 选择的第一张表明
  private expression: string = '' // 表达式
  private isAddCondition: boolean = false // 
  private isConditionList: boolean = false
  private isValue: boolean = false 
  private selectName: string = 'identifier' // select模块 tab名称
  private activeName: number = 0
  private customValue: string = ''
  private number: number = 0 
  private joinIdx: number = 0 // 添加条件列表索引

  created() {
  }

  mounted() {
    console.log(this.dataList)
  }

  // 监听fromList
  @Watch("dataList", { 
    immediate: true,
    deep: true 
  })
  private onDataListChange(val: any) {
    console.log(val);
    if(val.length > 0){
      val.forEach((item:any) => {
        item.isAlias = false
        item.isAdd = false
        // item.tableVisible = false
        item.fromJoinList.forEach((join: any) =>{
          join.isValue1 = false
          join.isValue2 = false
        })
      })
      this.fromList = val
      this.isDefault = true 
      this.isFrom = true
      this.curIndex = val.length - 1
    }
  }

  // 监听fromList
  @Watch("fromList", { 
    immediate: true,
    deep: true 
  })
  private onFromListChange(val: any) {
    // console.log(val);
    this.$emit('getFormList', this.fromList)
  }
  
  // 选择表名
  private handleSelect(data: any){
    this.curIndex = 0
    this.visible = false
    this.isDefault = true
    this.isFrom = true
    this.fromList.push({
      index: 0,
      tableName: data.tableName, // 表名
      joinType: '', // 联接方式
      aliasName: '', // 别名
      showOrder: 1,
      isAlias: false,
      isJoinType: false,
      isAddCondition: false,
      isSymbol: false,
      tableVisible: false,
    })
  }

  // 选择值
  private handleSelectValue(data:any, index: number, join: any, jIdx: number, number: number){
    this.activeName = 0
    console.log(join)
    if(number == 1){
      this.$set(this.fromList[index].fromJoinList[jIdx],'isValue1',!join.isValue1)
      this.$set(this.fromList[index].fromJoinList[jIdx],'isValue2',false)
      this.$set(this.fromList[index].fromJoinList[jIdx],'isSymbol',false)
    }else{
      this.$set(this.fromList[index].fromJoinList[jIdx],'isValue2',!join.isValue1)
      this.$set(this.fromList[index].fromJoinList[jIdx],'isValue1',false)
      this.$set(this.fromList[index].fromJoinList[jIdx],'isSymbol',false)
    }
    this.fromList.map((val: any) => {
      this.tableData.push(val.tableName)
    })
    this.getTableColumn(unique(this.tableData)) // 多表获取表-字段
  }

  // 获取表-字段
  private getTableColumn(data: any){
    getTablesColumn(data).then((res: any) => {  
      this.tableColumn = res.data
    })
  }

  // 选择菜单
  private handleSelectMenu(key: string){
    this.activeIndex = key
  }
  
  // 按下enter键设置别名
  private handleEnterAlias(data: any,index: number){ 
    this.fromList[index].aliasName = this.alias
    this.fromList[index].isAlias = !data.isAlias
  }


  // 关闭dialog弹框
  private handleClose(){
    this.isVisible = false
    this.isValue = false
  }

  // 显示弹框添加别名
  private handleAddAlias(data: any){
    this.alias = data.aliasName != '' || data.aliasName != undefined || data.aliasName != null ? data.aliasName : ''
  }

  // 再次选择改变联接方式
  private handleAgainSelectMenu(key: string,data: any,index: number){
    this.isVisible = false
    this.activeIndex = key
    this.fromList[index].joinType = key == '1' ? 'INNER JOIN' : key == '2' ? 'LEFT JOIN' : 'RIGHT JOIN'
    this.fromList[index].isJoinType = !data.isJoinType
    // this.$emit('getFormList', this.fromList)
  }
  
  // 弹框添加条件
  private handleSelectCondition(item: any, index: number ){
    this.isAddCondition = false
    this.isConditionList = true
    this.isAddCondition = false
    this.joinIdx = 0
    let obj: any = {
      index: 0,
      joinAndOr: null,
      joinExpression: '=',
      joinOnTable1: null,
      joinOnColumn1: null,
      joinOnTable2: null,
      joinOnColumn2: null,
      showOrder: 1,
      isValue1: false,
      isValue2: false,
      isSymbol: false,
    }
    this.fromList[index].fromJoinList.push(obj)
  }

  // 通过联接条件的表记录
  private handleJoinSelect(data: any, index: number,table: any, tIdx: number){
    this.fromList[index].isAdd = !data.isAdd
    index++;
    this.curIndex = index
    let joinType: string = this.activeIndex == '1' ? 'INNER JOIN' : this.activeIndex == '2' ? 'LEFT JOIN' : 'RIGHT JOIN'  // 联接方式
    this.fromList.push({
      aliasName: '',
      joinType: joinType,
      tableName: table.tableName,
      index: index,
      showOrder: index+1,
      fromJoinList: [
        // {
        //   index: 0,
        //   joinExpression: '=',
        //   joinOnTable1: null,
        //   joinOnColumn1: null,
        //   joinOnTable2: null,
        //   joinOnColumn2: null,
        //   showOrder: 1,
        //   isValue1: false,
        //   isValue2: false,
        //   isSymbol: false,
        // }
      ],
      isAlias: false,
      isJoinType: false,
      isAddCondition: false,
      isAdd: false
    });
  }

  // 重新选择条件记录表
  private handleJoinAgainSelect(data: any, index: number, table: any){
    this.fromList[index].tableVisible = !data.tableVisible
    console.log(!data.tableVisible);
    console.log(this.fromList[index].tableVisible);
    if(index == 0){
      this.fromList[index].tableName = table.tableName
    }else{
      this.fromList[index].joinType = this.activeIndex == '1' ? 'INNER JOIN' : this.activeIndex == '2' ? "LEFT JOIN" : 'RIGHT JOIN'
      this.fromList[index].tableName = table.tableName
    }
  }


  // 显示弹框改变联接方式
  private handleChange(data: any){
    this.activeIndex = data.joinType == 'INNER JOIN' ? '1' : data.joinType == "LEFT JOIN" ? '2' : '3'
  }

  // 选择排序条件
  private handleSelSort(data:any,index: number, join:any, jIdx: number, table:any, column: any, number: number){
    if(number == 1){
      // 添加条件第一个值
      this.fromList[index].fromJoinList[jIdx].joinOnTable1 = table.tableName
      this.fromList[index].fromJoinList[jIdx].joinOnColumn1 = column.columnName
      this.fromList[index].fromJoinList[jIdx].isValue1 = !join.isValue1
      this.fromList[index].fromJoinList[jIdx].isValue2 = false
    }else{
      // 添加条件第二个值
      this.fromList[index].fromJoinList[jIdx].joinOnTable2 = table.tableName
      this.fromList[index].fromJoinList[jIdx].joinOnColumn2 = column.columnName
      this.fromList[index].fromJoinList[jIdx].isValue2 = !join.isValue2
      this.fromList[index].fromJoinList[jIdx].isValue1 = false
    }
  }


  // 选择"and"和"or"
  private handleJoinAndOr(item: any, index: number, join: any, jIdx: number){
    this.fromList[index].fromJoinList[jIdx].joinAndOr = join.joinAndOr == 'and' ? 'or' : 'and'
  }

  // 点击运算符
  private handleSelExpression(index: number,jIdx: number){
    this.fromList[index].fromJoinList[jIdx].isValue1 = false
    this.fromList[index].fromJoinList[jIdx].isValue2 = false
  }

  // 选择比较运算符
  private handleSelSymbol(data: any, index: number, join: any, jIdx: number, symbol: any, sIdx: number){
    this.operatorIndex = symbol.index
    this.fromList[index].fromJoinList[jIdx].isSymbol = !join.isSymbol
    this.fromList[index].fromJoinList[jIdx].isValue1 = false
    this.fromList[index].fromJoinList[jIdx].isValue2 = false
    this.fromList[index].fromJoinList[jIdx].joinExpression = symbol.label
  }

  // 点击添加条件按钮
  private handleAddCondition(data: any){
    this.joinIdx = data.fromJoinList.length - 1
    if(data.fromJoinList.length > 0){
      this.isAddCondition = false
      this.isConditionList = true
    }else{
      this.isAddCondition = true
      this.isConditionList = false
    }
  }

  // 点击添加条件列表新增一条
  private handleAddJoin(data: any, index: number, join: any, jIdx: number){
    this.joinIdx = jIdx + 1
    var obj = {
      index: jIdx + 1,
      joinAndOr: 'and',
      joinExpression: '=',
      joinOnTable1: null,
      joinOnColumn1: null,
      joinOnTable2: null,
      joinOnColumn2: null,
      showOrder: join.showOrder + 1,
      isValue1: false,
      isValue2: false,
      isSymol: false
    }
    this.fromList[index].fromJoinList.push(obj)
  }

  // 删除条件元素
  private handleDel(data: any, index: number, join: any, jIdx: number){
    this.joinIdx = this.joinIdx - 1
    console.log(this.fromList);
    this.fromList[index].fromJoinList.splice(jIdx,1); 
    if(this.joinIdx ==  -1){
      this.isAddCondition = true
      this.isConditionList = false
    }
  }

  // 删除数组元素
  private handleRemove(data: any,index: number){
    // debugger
    this.curIndex = this.curIndex - 1
    this.fromList.splice(index,1); 
    if(this.curIndex ==  -1){
      this.isDefault = false
      this.isFrom = true
    }
  }
}
</script>


<style lang='scss' scoped>
</style>