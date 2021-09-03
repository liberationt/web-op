<!--
 * @Author: 曹俊
 * @LastEditTime: 2020-07-15 15:47:42
 * @LastEditors: 曹俊
 * @Description: 
 * @FilePath: \web-op\src\views\his\config\configuration\components\where.vue
--> 
<!-- 第一行 未选择表名 -->
<template>
  <div>
    <div class="his-row" v-show="isWhere">
      <el-button class="add mr10" @click="handleAddValue">+</el-button> 
      <el-button class="add ml0 mr10" @click="handleAddLtMultiple"><sup>&#40;</sup><sub>+</sub></el-button>
      <span>点击"+"以添加条件</span>
    </div>
    <div class="condition-list" v-for="(item,index) in whereList" :key="index" v-show="isField">
      <!-- 括号 start -->
      <ul v-if="item.joinBrackets != null">
        <li>
          <div>
            <em v-show="item.joinAndOr != null" @click="handleChange(item,index)">{{item.joinAndOr == null ? '' : item.joinAndOr == 'and' ? '和' : '或'}}</em>
            {{item.joinBrackets}}
            <el-button class="add ml10" @click="handleAddCondition(item,index)" v-show="curIndex==index">+</el-button>
            <el-button class="add ml10" @click="handleInAddLtMultiple(item,index)"  v-show="curIndex==index"><sup>&#40;</sup><sub>+</sub></el-button>
            <el-button class="add ml10 mr10" @click="handleInAddRtMultiple(item,index)" v-show="curIndex==index"><sup>&#41;</sup><sub>+</sub></el-button>
            <el-button class="add ml10" @click="handleAddAndOr(item,index)">R<sub>+</sub></el-button>
            <el-button class="add ml10 mr10" @click="handleDelAndOr(item,index)">R<sub>-</sub></el-button>
          </div>
          <!-- 删除 start -->
          <i class="icon his-close" @click="handleRemove(item,index)"></i>
          <!-- 删除 end -->
        </li>
      </ul>
      <!-- 括号 end -->
      <ul v-else>
        <li>
          <div>
            <em v-show="item.joinAndOr != null" @click="handleChange(item,index)">{{item.joinAndOr == null ? '' : item.joinAndOr == 'and' ? '和' : '或'}}</em>
            <!-- 值1 start -->
            <el-popover trigger="click" placement="bottom-start" width="300" v-model="item.value1">
              <!-- 表-字段 start -->
              <div>
                <el-tabs class="tab-small" v-model="selectName" >
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
                            <div class="field-name" v-for="(column,cIdx) in table.columnlist" :key="cIdx" @click="handleSelField(item,index,table,tIdx,column,cIdx)">{{`${column.columnName}(${column.alias})`}}</div>
                          </el-collapse-item>
                        </el-collapse>
                      </template>
                  </el-tab-pane>
                  <!-- 自定义 -->
                  <!-- <el-tab-pane label="自定义" name="custom">
                      <el-input type="text" class="expression" v-model="customValue"></el-input>
                  </el-tab-pane> -->
                </el-tabs>
              </div>
              <!-- 表-字段 end -->
              <span slot="reference" @click="handleSelectValue(item,index,1)">{{item.whereTable1 == null && item.whereColumn1 == null ? '&lt;值&gt;': item.queyName == null ? item.whereTable1+'.'+item.whereColumn1 : `${item.whereTable1}.${item.whereColumn1}(${item.queyName})` }}</span>
            </el-popover>
            <!-- 值1 end -->
            <!-- 比较运算符 start -->
            <el-popover trigger="click" placement="bottom-start" width="300" v-model="item.visible">
              <div class="operator">
                  <div class="symbol" v-for="(symbol,sIdx) in operatorList" :key="sIdx" @click="handleSelSymbol(item,index,symbol,sIdx)"><i class="icon his-active" v-show="operatorIndex == sIdx"></i>{{symbol.label}}</div>
              </div>
              <em class="blue" slot="reference" @click="handleSymbol(item)">{{item.whereExpression}}</em>
            </el-popover>
            <!-- 比较运算符 end -->
            <!-- 值2 start -->
            <el-popover trigger="click" placement="bottom-start" width="300" v-model="item.value2">
              <!-- 表-字段 start -->
              <div class="">
                <el-tabs class="tab-small" v-model="selectName" >
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
                            <div class="field-name" v-for="(column,cIdx) in table.columnlist" :key="cIdx" @click="handleSelField(item,index,table,tIdx,column,cIdx)">{{`${column.columnName}(${column.alias})`}}</div>
                          </el-collapse-item>
                        </el-collapse>
                      </template>
                  </el-tab-pane>
                  <!-- 自定义 -->
                  <el-tab-pane label="自定义" name="custom">
                      <el-input type="text" class="expression" v-model="customValue" @change="handleEnter(item,index)"></el-input>
                  </el-tab-pane>
                  <!-- 请求参数 -->
                  <el-tab-pane label="请求参数" name="queryParameter">
                      <el-input type="text" class="expression" v-model="queryParameter" @change="handleEnterParams(item,index)"></el-input>
                  </el-tab-pane> 
                </el-tabs> 
              </div>
              <!-- 表-字段 end -->
              <span slot="reference" @click="handleSelectValue(item,index,2)">{{item.whereTable2 == null && item.whereColumn2 == null  && item.fixedValue == null ? '&lt;值&gt;': item.whereTable2 != null &&  item.whereColumn2 != null ? item.queyName2 == null ? item.whereTable2+'.'+item.whereColumn2 : `${item.whereTable2}.${item.whereColumn2}(${item.queyName2})` : item.fixedValue}}</span>
            </el-popover>
            <!-- 值2 end -->
            <el-button class="add ml10" @click="handleAddCondition(item,index)" v-show="curIndex==index">+</el-button>
            <el-button class="add ml10" @click="handleInAddLtMultiple(item,index)"  v-show="curIndex==index"><sup>&#40;</sup><sub>+</sub></el-button>
            <el-button class="add ml10" @click="handleInAddRtMultiple(item,index)" v-show="curIndex==index"><sup>&#41;</sup><sub>+</sub></el-button>
            <el-button class="add ml10" @click="handleAddAndOr(item,index)" v-show="index != 0">R<sub>+</sub></el-button>
            <el-button class="add ml10 mr10" @click="handleDelAndOr(item,index)" >R<sub>-</sub></el-button>
          </div>
          <!-- 删除 start -->
          <i class="icon his-close" @click="handleRemove(item,index)"></i>
          <!-- 删除 end -->
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
import { watch } from 'fs'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'where',
  filters: {},
})
export default class extends Vue {
  @Prop({ required: true }) private fromList!: any
  @Prop({ required: true }) private dataList!: any

  // where - 模块 
  private whereList: Array<any>  = []
  private operatorList: Array<any>  = [
    {
      index: 0,
      label: '='
    },
    {
      index: 2,
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
    {
      index: 7,
      label: 'not like'
    },
    {
      index: 8,
      label: 'exists'
    },
    {
      index: 9,
      label: 'not exists'
    },
    {
      index: 10,
      label: 'is'
    },
    {
      index: 11,
      label: 'is not'
    },
    {
      index: 12,
      label: 'in'
    },
    {
      index: 13,
      label: 'not in'
    },
  ] // 比较运算符列表 
  private operatorIndex: number = 0
  private isWhere: boolean = true
  private isField: boolean =  false
  private tableData: Array<any>  = []
  private selectName: string = 'identifier' // select模块 tab名称
  private curIndex: number = -1
  private number: number = 0
  private tableColumn : Array<any> = [] 
  private activeName: number = 0
  private customValue: string = ""
  private queryParameter: string = ""

  created() {}
  mounted() {
  }
  // 监听获取whereList列表
  @Watch("dataList", { immediate: true })
  private onDataListChange(val: any) {
    if(val.length > 0){
      val.map((item: any) =>{
        if(item.whereTable1 =='' || item.whereTable1 == null){
          item.whereTable1 = null
        }
        if(item.whereTable2 =='' || item.whereTable2 == null){
          item.whereTable2 = null
        }
        if(item.whereColumn1 =='' || item.whereColumn1 == null){
          item.whereColumn1 = null
        }
        if(item.whereColumn2 =='' || item.whereColumn2 == null){
          item.whereColumn2 = null
        }
        if(item.fixedValue == '' || item.fixedValue == null){
          item.fixedValue = null
        }
        item.value1 = false
        item.value2 = false
      })
      this.whereList = val
      this.isWhere = false 
      this.isField = true     
      this.curIndex = val.length - 1
    }
  }

  // 监听ordertList变化，向setting.vue父组件传值
    @Watch("whereList", { immediate: true, deep: true })
    private onWhereListChange(val: any) {
      this.$emit("getWhereList",this.whereList)
    }

  // 第一次添加where条件
  private handleAddValue(){
    this.isWhere = false
    this.isField = true
    this.curIndex = 0
    this.whereList.push({
        fixedValue: null,
        queryName: null,
        queyName2: null,
        whereTable1: null,
        whereColumn1: null,
        whereTable2: null,
        whereColumn2: null,
        whereExpression: '=',
        joinAndOr: null,
        index: 0,
        showOrder: 1,
        visible: false,
        value1: false,
        value2: false,
        joinBrackets: null,
        queryParameter: null

    });
  }

  // 第一次添加多重where条件
  private handleAddLtMultiple(){
    this.isWhere = false
    this.isField = true
    this.curIndex = 0
    this.whereList.push({
      fixedValue: null,
      queryName: null,
      queyName2: null,
      whereTable1: null,
      whereColumn1: null,
      whereTable2: null,
      whereColumn2: null,
      whereExpression: null,
      joinAndOr: null,
      index: 0,
      showOrder: 1,
      visible: false,
      value1: false,
      value2: false,
      joinBrackets: '(',
      queryParameter: null,
    });
  }

  // 添加关系
  private handleAddAndOr(data: any, index: number){
    this.whereList[index].joinAndOr = 'and'
  }

  // 添加关系
  private handleDelAndOr(data: any, index: number){
    this.whereList[index].joinAndOr = null
  }

  // 括号包含添加where条件
  private handleAddInValue(data:any, index: number){
    this.whereList[index].joinAndOr = null
    this.whereList[index].whereExpression = '='
  }

  /*选择值
   *data whereList当前行对象数据
   *index whereList当前行索引
   *num 1-代表值1 2-代表值2
   */
  private handleSelectValue(data: any, index: number, num: number){
    this.number = num
    this.customValue = ''
    this.queryParameter = ''
    this.fromList.map((val: any) => {
      this.tableData.push(val.tableName)
    })
    this.getTableColumn(unique(this.tableData)) // 多表获取表-字段
    if(data.fixedValue != null){
      this.customValue = data.fixedValue
    }
    if(data.queryParameter != null){
      this.queryParameter = data.queryParameter
    }
  }
  
  /*获取表-字段
   *data whereList当前行对象数据
   */
  private getTableColumn(data: any){
    getTablesColumn(data).then((res: any) => {  
      this.tableColumn = res.data
    })
  }
  /*新增排序条件
   *data whereList当前行对象数据
   *index whereList当前行索引
   */
  private handleAddCondition(data: any,index: number){
    this.isWhere = false
    this.isField = true
    this.curIndex = index+1 // 获取当前索引来判断是否显示条件加号
    this.whereList.push({
        fixedValue: null,
        whereTable1: null,
        whereColumn1: null,
        whereTable2: null,
        whereColumn2: null,
        whereExpression: '=',
        joinAndOr: null,
        index: index+1,
        showOrder: data.showOrder+1,
        visible: false,
        value1: false,
        value2: false,
        queryParameter: null,
        joinBrackets: null,
    });
  }

  // 多次配置条件
  private handleInAddLtMultiple(data: any, index: number){
    this.whereList.push({
        fixedValue: null,
        whereTable1: null,
        whereColumn1: null,
        whereTable2: null,
        whereColumn2: null,
        whereExpression: null,
        joinAndOr: null,
        index: index+1,
        showOrder: data.showOrder+1,
        visible: false,
        value1: false,
        value2: false,
        queryParameter: null,
        joinBrackets: '(',
    });
  }

  private handleInAddRtMultiple(data: any, index: number){
    this.whereList.push({
        fixedValue: null,
        whereTable1: null,
        whereColumn1: null,
        whereTable2: null,
        whereColumn2: null,
        whereExpression: null,
        joinAndOr: null,
        index: index+1,
        showOrder: data.showOrder+1,
        visible: false,
        value1: false,
        value2: false,
        queryParameter: null,
        joinBrackets: ')',
    });
  }

  /*点击运算符
   *data whereList当前行对象数据
   */
  private handleSymbol(data: any){
    // 获取whereList当前行运算符，遍历运算符列表获取当前的索引
    this.operatorList.map((val: any, idx: number) => {
      if(val.label  ==  data.whereExpression){
        this.operatorIndex = idx
      }
    })
  }

  /*选择比较运算符
   *data whereList当前行对象数据
   *index whereList当前行索引
   *symbol  operatorList当前行对象数据
   *idx operatorList当前行索引
   */
  private handleSelSymbol(data: any,index: number, symbol: any, idx: number){
    this.operatorIndex = idx
    this.whereList[index].whereExpression = symbol.label
    this.whereList[index].visible = !data.visible
  }

  // 选择字段
  private handleSelField(item: any,index: number, table: any, tIdx: number, column: any, cIdx: number){
    let number: number = this.number
    if(number == 1){
      this.whereList[index].whereTable1 = table.tableName
      this.whereList[index].whereColumn1 = column.columnName
      this.whereList[index].queyName = column.alias
      this.whereList[index].value1 = !item.value1
    }else{
      this.whereList[index].whereTable2 = table.tableName
      this.whereList[index].whereColumn2 = column.columnName
      this.whereList[index].fixedValue = null 
      this.whereList[index].queyName2 = column.alias
      this.whereList[index].value2 = !item.value2
    }
  }

  // 自定义
  private handleEnter(item: any, index: number){
    this.whereList[index].value2 = !item.value2
    this.whereList[index].fixedValue = this.customValue == '' ? null : this.customValue
    this.whereList[index].whereTable2 = null
    this.whereList[index].whereColumn2 = null
  }

  // 参数
  private handleEnterParams(item: any, index: number){
    this.whereList[index].value2 = !item.value2
    this.whereList[index].queryParameter = this.queryParameter == '' ? null : this.queryParameter
  }

  // 改变运算符
  private handleChange(data: any, index: number){
    this.whereList[index].joinAndOr = data.joinAndOr == 'and' ? 'or' : 'and'
  }

  // 删除数组元素
  private handleRemove(data: any,index: number){
    this.curIndex = this.curIndex - 1
    this.whereList.splice(index,1); 
    if(this.curIndex ==  -1){
      this.isWhere = true
      this.isField = false
    }
  }
  // 删除数组元素
  private handleInRemove(data: any,index: number){
    this.curIndex = this.curIndex - 3
    this.whereList.splice(index-2,3); 
    if(this.curIndex ==  -1){
      this.isWhere = true
      this.isField = false
    }
  }

  // 
  private handleAddInCondition(data: any,index: number){
    console.log(index);
    this.curIndex = index+1 // 获取当前索引来判断是否显示条件加号
    this.whereList.splice(index + 1, 0, {
      fixedValue: null, 
      whereTable1: null, 
      whereColumn1: null, 
      whereTable2: null, 
      whereColumn2: null, 
      whereExpression: '=',
      joinAndOr: 'and', 
      showOrder: data.showOrder+1, 
      visible: false, 
      value1: false, 
      value2: false, 
      queryParameter: null, 
    })
  }
  
}
</script>


<style lang='scss' scoped>
</style>