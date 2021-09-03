<!--
 * @Author: 曹俊
 * @LastEditTime: 2020-07-03 10:15:42
 * @LastEditors: 曹俊
 * @Description: 
 * @FilePath: \web-op\src\views\his\config\configuration\components\select.vue
--> 
<!-- 第一行 未选择表名 -->
<template>
    <div class="scroll-bar" :style="{height: listHeight +'px'}">
        <div class="his-row" v-show="isSelect"> 
            <el-popover placement="bottom-start" width="300" trigger="click" v-model="visible">
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
                                        <div class="field-name" v-for="(column,cIdx) in table.columnlist" :key="cIdx" @click="handleFirstSelField(table,column)">{{column.alias != undefined ?`${column.columnName}(${column.alias})` : `${column.columnName}`}}</div>
                                    </el-collapse-item>
                                </el-collapse>
                            </template>
                        </el-tab-pane>
                        <!-- 自定义 -->
                        <el-tab-pane label="自定义" name="custom">
                            <el-input class="expression" v-model="customValue"></el-input>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <el-button class="add mr10" slot="reference" @click="handleAddValue">+</el-button>  
            </el-popover>
            <span>点击"+"以添加字段</span>
        </div>
        <!-- 字段列表 start -->
        <div class="select-list" v-show="isField"> 
            <div class="select-item" v-for="(item,index) in selectList" :key="index">
                <div class="row-item">
                    <div class="item">
                        <!-- 表名、字段名 start -->
                        <el-popover placement="bottom-start" width="300" v-model="item.columnShow" trigger="click">
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
                                                    <div class="field-name" v-for="(column,cIdx) in table.columnlist" :key="cIdx" @click="handleAgainSelField(item,index,table,column)">{{column.alias != undefined ?`${column.columnName}(${column.alias})` : `${column.columnName}`}}</div>
                                                </el-collapse-item>
                                            </el-collapse>
                                        </template>
                                    </el-tab-pane>
                                    <!-- 自定义 -->
                                    <el-tab-pane label="自定义" name="custom">
                                        <el-input class="expression" v-model="customValue"></el-input>
                                    </el-tab-pane>
                                </el-tabs>
                            </div>
                            <em slot="reference" @click="handleEditField(item,index)">{{item.tableName == '' ? item.columnName : item.tableName+ "." +item.columnName}}</em>
                        </el-popover>
                        <!-- 表名、字段名 end --> 
                        <!-- 别名 -->
                        <el-popover placement="bottom-start" width="300" v-model="item.visible" trigger="click">
                            <el-input class="alias" v-model="alias" @keydown.enter.native="handleEnterAlias(item,index)" clearable></el-input>
                            <span :class="item.webName == '' || item.webName == undefined ? 'gray' : ''" slot="reference" @click="handleAddAlias(item)">{{item.columnName == '*'? '' : item.webName == '' || item.webName == undefined ? "&lt;别名&gt;" : '('+item.webName+')'}}</span>
                        </el-popover>
                        <!-- 新增字段列表 start -->
                        <el-popover placement="bottom-start" width="300" trigger="click" v-model="item.show">
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
                                                    <div class="field-name" v-for="(column,cIdx) in table.columnlist" :key="cIdx" @click="handleSelField(item,index,table,column)">{{column.alias != undefined || column.alias != null || column.alias != '' ?`${column.columnName}(${column.alias})` : `${column.columnName}`}}</div>
                                                </el-collapse-item>
                                            </el-collapse>
                                        </template>
                                    </el-tab-pane>
                                    <!-- 自定义 -->
                                    <el-tab-pane label="自定义" name="custom">
                                        <el-input class="expression" v-model="customValue"></el-input>
                                    </el-tab-pane>
                                </el-tabs>
                            </div>
                            <el-button class="add ml10" slot="reference" @click="handleSelectValue" v-show="curIndex == index">+</el-button>
                        </el-popover>
                        <!-- 新增字段列表 end -->
                    </div>
                    <div class="form">
                        <span class="tag">列宽</span>
                        <el-input type="number" v-model="item.width" style="width: 80px"></el-input>
                        <span class="tag">显示方式</span>
                        <el-select v-model="item.display" placeholder="请选择" style="width: 100px">
                            <el-option label="是" :value="1"></el-option>
                            <el-option label="否" :value="0"></el-option>
                        </el-select>
                        <span class="tag">自定义函数</span>
                        <el-input type="text" v-model="item.renderer" style="width: 120px"></el-input>
                        <span class="tag">字典</span>
                        <el-select v-model="item.dicType" placeholder="请选择" @change="handleSelTable(item,index)" clearable style="width: 160px">
                            <el-option label="SYS_DICT_CONFIG" value="SYS_DICT_CONFIG"></el-option>
                            <el-option label="SYS_FLAG_DATA" value="SYS_FLAG_DATA"></el-option>
                            <el-option label="SYS_PRIMARY_DATA" value="SYS_PRIMARY_DATA"></el-option>
                        </el-select>
                        <el-select class="ml10" v-model="item.dicFid" placeholder="请选择" clearable style="width: 160px">
                            <el-option v-for="f in fieldList" :key="f.dk" :label="f.dname" :value="f.dk"></el-option>
                        </el-select>
                    </div>
                </div>
                <!-- 删除 start -->
                <i class="icon his-close" @click="handleRemove(item,index)"></i>
                <!-- 删除 end -->
            </div>
        </div>
        <!-- 字段列表 end -->
    </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { Iitem, getAlltabel, getAllColumn, getTablesColumn} from '@/api/his/config/index.ts'
import { log} from 'util'
import { unique } from '@/utils/index.ts'
import { type } from 'os'
// import func from '../../../../../../vue-temp/vue-editor-bridge'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'selects',
  filters: {},
})
export default class extends Vue {
    @Prop({ required: true }) private fromList!: any
    @Prop({ required: true }) private dataList!: any
    
    // SELECT - 模块 
    private tableData: Array<any>  = []
    private selectList: Array<any>  = []
    private isSelect: boolean =  true
    private isField: boolean =  false
    private curIndex: number = 0 // 
    private currentIndex: number = 0 // 当前索引
    private selectName: string = 'identifier' // select模块 tab名称
    private customValue: string = '' // 自定义值
    private activeName: number = 0
    private tableColumn: Array<any> = []
    private alias: string = '' // 别名
    private fieldList: Array<any> = []
    private listHeight: number = 0
    private visible: boolean = false

    created() {
        this.listHeight = Vue.prototype.PageHeight - 10 - 43 - 45
    }
    mounted() {
        
    }

    @Watch("dataList", { immediate: true })
    private onDataListChange(val: any) {
        if(val.length > 0){
            val.map((item: any) =>{
                item.show = false
                item.columnShow = false
            })
            this.selectList = val
            this.isSelect = false 
            this.isField = true    
            this.curIndex = val.length - 1
        }
    }
    
    // 监听ordertList变化，向setting.vue父组件传值
    @Watch("selectList", { immediate: true, deep: true })
    private onSelectListChange(val: any) {
        this.$emit("getSelectList",this.selectList)
    }
    
    // 添加字段
    private handleAddValue(){
        this.curIndex = 0
        this.fromList.map((val:any,index: number) => {
            this.tableData.push(val.tableName)
        })
        // 通过unique方法查重，多表获取表-字段

        this.getTableColumn(unique(this.tableData)) 
    }
    // 第一次选择字段
    private handleFirstSelField(table: any, column: any){
        this.isSelect = false
        this.isField = true
        this.curIndex = 0
        this.selectList.push({
            webName: column.alias,
            display: 0,
            dicFid: '',
            tableName: table.tableName,
            columnName: column.columnName,
            index: 0,
            visible: false,
            showOrder: 1,
            dicType: '',
        });
    }

    // 选择字段
    private handleSelField(data: any, index: number, table: any, column: any){
        this.isSelect = false
        this.isField = true
        // this.selectIndex++;
        this.curIndex = index+1
        this.selectList.push({
            webName: column.alias,
            display: 0,
            dicFid: '',
            tableName: table.tableName,
            columnName: column.columnName,
            index: index+1,
            visible: false,
            showOrder: data.showOrder+1,
            dicType: '',
            
        });
        // if(this.selectList[this.selectIndex].dicType){
        //     this.distpicker(this.selectList[this.selectIndex].dicType,this.selectIndex)
        // }
        // this.$emit("getSelectList",this.selectList)
    }

    // 重新选择字段
    private handleAgainSelField(data: any, index: number, table: any, column: any){
        this.selectList[index].columnShow = !data.columnShow
        this.selectList[index].tableName = table.tableName
        this.selectList[index].columnName = column.columnName
        this.selectList[index].webName = column.alias
        // this.$emit("getSelectList",this.selectList)
    }

    // 设置别名
    private handleAddAlias(data: any){
        this.alias = data.webName != null ||  data.webName != '' || data.webName != undefined ? data.webName : ''
        this.currentIndex = data.index
    }

    // 按下enter键设置别名
    private handleEnterAlias(data: any,index: number){ 
        this.selectList[index].webName = this.alias
        this.selectList[index].visible = !data.visible
        // this.$emit("getSelectList",this.selectList)
    }

    // 选择值
    private handleSelectValue(){
        this.activeName =  0
        this.fromList.map((val:any,index: number) => {
            this.tableData.push(val.tableName)
        })
        this.getTableColumn(unique(this.tableData)) // 多表获取表-字段
    }

    // 点击表-字段重新选择字段
    private handleEditField(data: any, index: number){
        this.handleSelectValue()
    }
    
    // 获取表-字段
    private getTableColumn(data: any){
        getTablesColumn(data).then((res: any) => {  
            this.tableColumn = res.data
            this.tableColumn.map(val =>{
                let obj:any = {
                    webName: '',
                    checkRule: null,
                    colspan: 0,
                    columnId: null,
                    columnName: "*",
                    columnType: "INT",
                    defaultValue: null,
                    dicFid: null,
                    dicType: null,
                    display: 1,
                    editable: null,
                    eventList: null,
                    fixed: 1,
                    height: null,
                    hidden: 0,
                    insertEnable: 1,
                    insertString: null,
                    isAutoincrement: 0,
                    keyGenerator: "redis",
                    maxLength: 10,
                    maxValuec: null,
                    minValuec: 0,
                    notNull: 0,
                    numPrecision: 0,
                    pkey: 1,
                    ref: null,
                    renderer: null,
                    rowspan: 0,
                    showOrder: null,
                    tableId: null,
                    updateEnable: 0,
                    updateString: null,
                    width: null,
                    xtype: null
                }
                val.columnlist.unshift(obj)
            })
        })
    }

    // 选择字典下拉框
    private handleSelTable(data: any,index: number){
        this.distpicker(data.dicType,index)
    }

    // 字典联动列表
    private distpicker(dicType: string, index: number){
        let that = this
        that.fieldList = []
        Vue.prototype.$db.transaction(function(tx:any){
            tx.executeSql(`select * from ${dicType}`,[],function(tx:any, res: any){
                for(let i=0;i<res.rows.length;i++){
                    that.fieldList.push(res.rows.item(i));
                }
            })
        })
        // console.log(typeof(that.fieldList));
        // console.log(that.fieldList);
        that.selectList[index].dicFid = ''
        // that.$emit("getSelectList",this.selectList)
    }

    // 删除数组元素
    private handleRemove(data: any,index: number){
        this.curIndex = this.curIndex - 1
        this.selectList.splice(index,1); 
        if(this.curIndex ==  -1){
            this.isSelect = true
            this.isField = false
        }
        // this.$emit("getSelectList",this.selectList)
    }

    private handleRow(val: any) {
        this.$emit('setRow', val)
    }
}
</script>


<style lang='scss' scoped>
</style>