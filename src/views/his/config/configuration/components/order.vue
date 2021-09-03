<!--
 * @Author: 曹俊
 * @LastEditTime: 2020-07-03 10:15:27
 * @LastEditors: 曹俊
 * @Description: 
 * @FilePath: \web-op\src\views\his\config\configuration\components\order.vue
--> 
<template>
    <div>
        <div class="his-row" v-show="isOrder"> 
            <el-popover trigger="click" placement="bottom-start" width="300" v-model="visible">
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
                                    <div class="field-name" v-for="(column,cIdx) in table.columnlist" :key="cIdx" @click="handleFirstSelSort(table,column,visible)">{{column.columnName}}{{`(${column.alias})`}}</div>
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
                <el-button class="add mr10" slot="reference" @click="handleSelectValue">+</el-button>
            </el-popover>
            <span>点击"+"以添加字段</span>
        </div>
        <div class="his-row wrap" v-show="isSort"> 
            <div class="sort-condition" v-for="(item,index) in orderList" :key="index">
                <!-- 表字段 start -->
                <el-popover trigger="click" placement="bottom-start" width="300" v-model="item.column">
                    <div>
                        <el-tabs class="tab-small" v-model="orderName" >
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
                                        <div class="field-name" v-for="(column,cIdx) in table.columnlist" :key="cIdx" @click="handleChangeColumn(item,index,table,column)">{{column.columnName}}{{`(${column.alias})`}}</div>
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
                    <span class="tb-column" slot="reference" @click="handleAddSort(item)">{{item.orderName == null ? `${item.orderTable}.${item.orderColumn}` : `${item.orderTable}.${item.orderColumn}(${item.orderName})`}}</span>
                </el-popover>
                <!-- 表字段 end -->
                <!-- 排序 start -->
                <span class="sort ml10" :class="{'blue' : item.ascDesc == 'asc' ||  item.ascDesc == 'desc' }" @click="handleSelSortType(item,index)">{{item.ascDesc == null ? "&lt;排序&gt;" : item.ascDesc == 'asc' ? "&lt;升序&gt;" : "&lt;降序&gt;" }}</span>
                <!-- 排序 end -->
                <!-- 新增排序 start -->
                <el-popover trigger="click" placement="bottom-start" width="300" v-model="item.visible">
                    <div>
                        <el-tabs class="tab-small" v-model="orderName" >
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
                                        <div class="field-name" v-for="(column,cIdx) in table.columnlist" :key="cIdx" @click="handleSelSort(item,index,table,column)">{{column.columnName}}{{`(${column.alias})`}}</div>
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
                    <el-button class="add ml10" slot="reference" @click="handleAddSort(item)" v-show="curIndex == index">+</el-button>
                </el-popover>
                <!-- 新增排序 end -->
                <!-- 删除 start -->
                <i class="icon his-close" @click="handleRemove(item,index)"></i>
                <!-- 删除 end -->
            </div>
        </div>    
        <!-- <el-popover
            placement="bottom"
            title="标题"
            width="200" v-model="visible"
            trigger="click">
            
            <div @click="hide(visible)">1</div>
            <el-button slot="reference">click 激活{{visible}}</el-button>
        </el-popover>    -->
    </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { getAlltabel, getAllColumn, getTablesColumn} from '@/api/his/config/index.ts'
import { unique } from '@/utils/index.ts'
//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'order',
  filters: {},
})
export default class extends Vue {
    @Prop({ required: true }) private fromList!: any
    @Prop({ required: true }) private dataList!: any

    // order by - 模块 
    private tableData: Array<any>  = []
    private orderList: Array<any>  = []
    private curIndex: number = 0
    private isOrder: boolean = true
    private isSort: boolean = false
    private orderName: string = "identifier" // 标识符
    private selectName: string = 'identifier' // select模块 tab名称
    private activeName: number = 0
    private tableColumn : Array<any> = []
    private customValue: string = '' // 自定义值
    private visible: boolean = false
    // popover demo
    private hide(visible: boolean){
        this.visible = ! visible
    }
    
    created() {
    }
    mounted() {
    }

    @Watch("fromList", { immediate: true })
    private onFromListChange(val: any) {
        console.log('order=');
        this.fromList = val
    }

    @Watch("dataList", { immediate: true, deep: true })
    private onDataListChange(val: any) {
        if(val.length > 0){
            val.map((item: any) =>{
                item.column = false
            })
            this.orderList = val
            this.isOrder = false   
            this.isSort = true     
            this.curIndex = val.length - 1
        }
    }

    // 监听ordertList变化，向setting.vue父组件传值
    @Watch("orderList", { immediate: true })
    private onOrderListChange(val: any) {
        this.$emit("getOrderList",this.orderList)
    }
    

    // 选择值
    private handleSelectValue(visible: boolean){
        this.curIndex = 0
        this.activeName = 0
        this.fromList.map((val: any,index: number) => {
            this.tableData.push(val.tableName)
        })
        this.getTableColumn(unique(this.tableData)) // 多表获取表-字段
    }

    // 数组查重
    private unique(arr: any){
        let result: Array<any> = [];
        for (var i = 0;i<arr.length;i++){
        //如果当前数组的第i项已经保存进了临时数组，忽略掉
        //否则的话把当前项push到临时数组里面
        if(result.indexOf(arr[i]) < 0)  result.push(arr[i]);
        //indexOf 返回元素在result中的位置，如果没有返回-1；
        }
        return result
    }

    // 获取表-字段
    private getTableColumn(data: any){
        getTablesColumn(data).then((res: any) => {  
            this.tableColumn = res.data
        })
        
    }

    // 选择排序种类
    private handleSelSortType(data: any, index: number){        
        if(data.ascDesc == null){
            this.orderList[index].ascDesc ='asc'
        }else if(data.ascDesc == 'asc'){
            this.orderList[index].ascDesc = 'desc'
        }else{
            this.orderList[index].ascDesc = null
        }
        // this.$emit("getOrderList",this.orderList)
    }

    // 第一次选择排序条件
    private handleFirstSelSort(data:any,val:any,visible: boolean){
        this.curIndex = 0
        this.isOrder = false
        this.isSort = true
        this.visible = !visible // 隐藏popover弹框
        this.orderList.push({
            ascDesc: null,
            orderTable: data.tableName,
            orderColumn: val.columnName,
            index: 0,
            showOrder: 1
        });
        // this.$emit("getOrderList",this.orderList)
    }

    // 选择排序条件
    private handleSelSort(data: any,index: number,table: any, column: any){
        // index++
        this.curIndex = index + 1
        this.orderList[index].visible = !data.visible // 隐藏popover弹框
        this.orderList.push({
            ascDesc: null,
            orderTable: table.tableName,
            orderColumn: column.columnName,
            index: index+1,
            showOrder: data.showOrder+1,
            orderName: column.alias
        });
        // this.$emit("getOrderList",this.orderList)
    }

    // 修改排序字段
    private handleChangeColumn(data: any,index: number,table: any, column: any){
        this.orderList[index].column = !data.column // 隐藏popover弹框
        this.orderList[index].orderName =  table.tableName  
        this.orderList[index].orderColumn = column.columnName
        this.orderList[index].orderName = column.alias
        // this.$emit("getOrderList",this.orderList)
    }

    // 新增排序条件
    private handleAddSort(data: any){
        this.fromList.map((val: any,index: number) => {
            this.tableData.push(val.tableName)
        })
        this.activeName = 0
        this.getTableColumn(unique(this.tableData)) // 多表获取表-字段
    }

    // 删除数组元素
    private handleRemove(data: any,index: number){
        // debugger
        this.curIndex = this.curIndex - 1
        this.orderList.splice(index,1); 
        if(this.curIndex ==  -1){
            this.isOrder = true
            this.isSort = false
        }
        // this.$emit("getOrderList",this.orderList)
    }
    
}
</script>


<style lang='scss' scoped>
</style>