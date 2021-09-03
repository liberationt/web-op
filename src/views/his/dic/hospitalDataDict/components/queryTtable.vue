<template>
    <div>
        <div class='mb10'>
            <el-select v-model="searchData.key" placeholder="请选择可查询属性" clearable style="width:188px" class="querySelect mr10" @change="getTableListRef">
                <el-option v-for="item in useTypeList" :key="item.attrKey" :label="item.cname" :value="item.attrKey"></el-option>
            </el-select>
            <el-input v-model="searchData.value" @keydown.enter.native="getTableListRef" :placeholder="$t('hospitalDataDict.phleft')" class="queryInput" style="width:288px" >
                <i slot="prefix" class="el-input__icon icon his-search"></i>
            </el-input>
        </div>
        <pagenation-list
            v-if="columnData.length!=0"
            ref="tablePage"
            :data-url="'/dict/data/'+typeId+'/list'"
            v-model="tableData"
            :searchData="searchData"
            prec='30'
            :list-height='listSlotHeight'
            http-method="post">
            <!-- @expand-change='expandChange' -->
            <el-table  :data="tableData"  row-key="id"
                ref="multipleTable" slot="list"
                border stripe style="width: 100%" lazy
                :height="listSlotHeight" :load="loadChildren"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                @selection-change="handleSelectionChange">
                <el-table-column v-if="actionFlag!='list'" type="selection" width="55"></el-table-column>
                <el-table-column v-for="(item,index) in columnData"   :key="item.attrKey" :prop="item.attrKey" :label="item.cname" >
                    <template slot-scope="scope">
                        <span v-if="item.attrKey == 'enable'" :style="{color:scope.row[item.attrKey]?'#1485ff':'#f95776'}">{{scope.row[item.attrKey] ? $t('common.enable') : $t('common.disable')}}</span>
                        <span v-else>{{scope.row[item.attrKey]}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="actionFlag=='list'" label="操作" :width="actionWidth + 130">
                    <template slot-scope="scope">
                        <!-- 上下移动 -->
                        <el-tooltip :content="$t('hospitalDataDict.up')">
                            <el-button class="green" @click="dataOffsetFun(scope.row,'up')" :disabled="scope.orderBy == 1">
                                <i class="icon his-caozuo_xiangshang"></i>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip :content="$t('hospitalDataDict.down')">
                            <el-button class="green ml10" @click="dataOffsetFun(scope.row,'down')">
                                <i class="icon his-caozuo_xiangxia"></i>
                            </el-button>
                        </el-tooltip>
                        <!-- 详情 -->
                        <el-tooltip :content="$t('common.detail')">
                            <el-button class="yellow ml10" @click="handleDetil(scope.row)">
                                <i class="icon his-detail"></i>
                            </el-button>
                        </el-tooltip>
                        <!-- 编辑 -->
                        <el-tooltip v-if="currItemL.operationsCode.indexOf('update') != -1" :content="$t('common.edit')">
                            <el-button class="blue ml10" @click="handleEditData(scope.row)">
                                <i class="icon his-edit"></i>
                            </el-button>
                        </el-tooltip>
                        <!-- 新增下级 -->
                        <el-tooltip v-if="currItemL.operationsCode.indexOf('add_child') != -1" :content="$t('common.addSub')">
                            <el-button class="blue ml10" @click="handleAddChild(scope.row)">
                                <i class="icon his-append"></i>
                            </el-button>
                        </el-tooltip>
                        <!-- 删除 -->
                        <el-popconfirm v-if="currItemL.operationsCode.indexOf('delete') != -1" :title="$t('hospitalDataDict.delTipsL')" hideIcon :confirmButtonText="$t('common.delete')" @confirm="handleDelData(scope.row)">
                            <el-button slot="reference" class="red ml10">
                                <i :size='14' class='icon his-del' ></i>
                            </el-button>
                        </el-popconfirm>
                        <!-- 停用/启用 -->
                        <!-- && currItemL.operationsCode.indexOf('enable') != -1 -->
                        <el-popconfirm v-if="scope.row.enable" :title="$t('physicianRegister.confirmAutomated')" hideIcon :confirmButtonText="$t('common.disable')" @confirm="handleStopOrStar(scope.row)">
                            <el-button slot="reference" class="red ml10">
                                <i :size='14' class='icon his-disabled' ></i>
                            </el-button>
                        </el-popconfirm>
                        <el-popconfirm v-if="!scope.row.enable" :title="$t('physicianRegister.confirmDisabled')" hideIcon :confirmButtonText="$t('common.enable')" @confirm="handleStopOrStar(scope.row)">
                            <el-button slot="reference" class="red ml10">
                                <i :size='14' class='icon his-automated' ></i>
                            </el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </pagenation-list>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { deepCopy } from '@/utils'
import { useType_condition,operationsType,dataOffset,statusChange,getDictDataChildList,getDictAttrData } from '@/api/his/dic/hospitalDataDict'

@Component({
    name: 'queryTable',
    filters: {}
})
export default class extends Vue {
	@Prop({ required: true }) private currItemL!: any // 当前左侧li
	@Prop({ required: true }) private listSlotHeight!: any // 页面高度
	@Prop({ required: true }) private actionFlag!: any // 操作列标记
	@Prop({ required: false }) private typeValue!: string | number // 当前的字典类型id
    private useTypeList:Array<any> = []
    private tableData:Array<any> = []
    private columnData:Array<any> = []
    private addData:Array<any> = []
    private updData:Array<any> = []
    private actionWidth:number = 0
    private searchData: any = {
        typeId: '',
        key:'',
        value:'',
    }
    private multipleSelection:Array<any> = []
    private maps:any = new Map()

    get typeId () {
        return this.typeValue || this.currItemL.id
    }
    created() {
    }
    mounted() {
        this.init()
    }


    //数据监控
    @Watch("tableData", { immediate: true })
    private ontableDataChange(val: any) {
        if(this.currItemL.operationsCode.indexOf('add_child') != -1){
            this.tableData.forEach(element => {
                this.$set(element, 'hasChildren', true)
                this.$set(element, 'children', [])
            });
        }
    }
    @Watch("currItemL", { immediate: true })
    private oncurrItemLChange(val: string) {
        const  operationsCode = this.currItemL.operationsCode ? this.currItemL.operationsCode.split(',') : []
        this.actionWidth = operationsCode.length *40
        this.init()
        this.searchData = {
            typeId: '',
            key:'',
            value:'',
        }
    }
    @Watch("multipleSelection", { immediate: true })
    private onmultipleSelectionChange(val: string) {
        if(val.length == 1) this.$emit('selectRow',val[0])
        if(val.length == 0) this.$emit('selectRow',null)

    }

    private init(){
        if(this.currItemL.id) {
            useType_condition({typeId:this.currItemL.id,useType:'select_condition'}).then((res:any) => {
                this.useTypeList = res.data
            })
            useType_condition({typeId:this.typeId,useType:'list_head'}).then((res:any) => {
                this.columnData = res.data
                this.$nextTick(()=> {
                    this.getTableListRef()
                })
            })
            useType_condition({typeId:this.typeId,useType:'add_data'}).then((res:any) => {
                this.addData = res.data
            })
        }
    }

    // 字典数据搜索
    private getTableListRef(){
        this.searchData.typeId = this.currItemL.id
        const tablePage : any = this.$refs.tablePage
        tablePage.getList()
    }
    // 表格勾选
    private handleSelectionChange(val:any) {
        const multipleTable:any  = this.$refs.multipleTable
        if (val.length > 1) {
            multipleTable.clearSelection()
            multipleTable.toggleRowSelection(val.pop())
        } else {
            this.multipleSelection = val
        }
    }
    // 删除数据
    private handleDelData(row:any){
        operationsType({operationsType:'delete',dataId:row.id}).then((res:any) => {
            this.$notify({
                title: this.$t('hospitalDataDict.deltipL') +"",
                message: '',
                type: 'success'
            });
            if(row.parent_id) {
                const  {tree,treeNode,resolve} = this.maps.get(Number(row.parent_id))
                this.loadChildren(tree,treeNode,resolve)
            }else {
                this.getTableListRef()
            }
        })
    }

    private dataOffsetFun(row:any,offsetType:string){
        dataOffset({dataId:row.id,offsetType}).then((res:any) => {
            this.$notify({
                title: this.$t('hospitalDataDict.succtipL') +"",
                message: '',
                type: 'success'
            });
            if(row.parent_id) {
                const  {tree,treeNode,resolve} = this.maps.get(Number(row.parent_id))
                this.loadChildren(tree,treeNode,resolve)
            }else {
                this.getTableListRef()
            }

        })
    }
    private handleStopOrStar(row:any){
        statusChange({id:row.id}).then((res:any) => {
            this.$notify({
                title: this.$t('hospitalDataDict.succtipL') +"",
                message: '',
                type: 'success'
            });
            if(row.parent_id) {
                const  {tree,treeNode,resolve} = this.maps.get(Number(row.parent_id))
                this.loadChildren(tree,treeNode,resolve)
            }else {
                this.getTableListRef()
            }
        })
    }

    // 点击编辑
    private handleEditData(rowData:any){
        useType_condition({typeId:this.currItemL.id,useType:'update_data'}).then((res:any) => {
            this.updData = res.data
            getDictAttrData({dataId:rowData.id}).then((res:any) => {
                this.$emit('handleEditData','edit',res.data,this.updData)
            })
        })
    }

    // 点击详情
    private handleDetil(rowData:any){
        useType_condition({typeId:this.currItemL.id,useType:'update_data'}).then((res:any) => {
            this.updData = res.data
            getDictAttrData({dataId:rowData.id}).then((res:any) => {
                this.$emit('handleEditData','detil',res.data,this.updData)
            })
        })
    }
    // 点击新增下级
    private handleAddChild(rowData:any){
        this.$emit('handleEditData','addChild',rowData)
    }

    // 获取下级
    private loadChildren(tree:any, treeNode:any, resolve:any){
        this.maps.set(tree.id,{tree,treeNode,resolve})
        getDictDataChildList({dataId:tree.id}).then((res:any) => {
            res.data.forEach((element:any) => {
                this.$set(element, 'hasChildren', true)
                this.$set(element, 'children', [])
            });
            resolve(res.data)
        })
    }

    // 暂废弃
    private expandChange(row:any,expanded:any) {
        if(expanded) {
            const $table:any = this.$refs.multipleTable
            this.tableData.map((item) => {
                if(item.id != row.id)
                $table.toggleRowExpansion(item, false)
            })
        }
    }



}
</script>
<style lang="scss" scoped>
    .querySelect {
        border-radius: 4px;
        .el-input__inner {
            height: 30px;
            line-height: 20px;
            border: 0;
            background: $lightGray;
        }
    }
    .form-dialog{
        width: 80%;
        margin: 0 auto;
    }
    .input1 ::v-deep{
        .el-input__inner{
            @include normal-input;
        }
    }
    .form-right{
        width: 60%;
    }
    .plus-ico{
        display:block;
        width:32px;
        height:32px;
        text-align:center;
        font-weight: bold;
        cursor: pointer;
    }
    .more_ico{
        display:inline-block;
        width:32px;
        height:32px;
        text-align:center;
        margin-top: -5px;
        cursor: pointer;
    }
    .his-qiyong{
        color: rgba(20,133,255,1);
        width:16px;
        height:16px;
        background:rgba(20,133,255,0.1);
        border:1px solid rgba(20,133,255,1);
        border-radius: 50%;
        padding: 2px;
    }
    .his-tingyong{
        color:rgba(249,87,118,1);
        width:16px;
        height:16px;
        background:rgba(249,87,118,0.1);
        border:1px solid rgba(249,87,118,1);
        border-radius: 50%;
        padding: 2px;
    }
    .li_item{
        margin: 6px 0;
        display: block;
        width: 100%;
        height: 30px;
        font-size: 14px;
        cursor: pointer;
        line-height: 30px;
        padding:0 10px;
        .his-caidanliebiao-more1{
            color: #1485FF;
        }
    }
    .li_btn{
        text-align: center;
    }
    .li_item:hover{
        background:rgba(20,133,255,0.1);
        border-radius:4px;
    }
    .backColor{
        background:rgba(20,133,255,0.1);
        border-radius:4px;
    }
</style>
<!-- <style>
thead .el-table-column--selection .cell{
    display: none;
}
</style> -->