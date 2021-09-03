<template>
    <div class="his-module">
        <div class="row">
            <div class="label">
                <h1 class="title">{{$t('hospitalDataDict.titleR1')}}</h1>
            </div>
            <div class="operate">
                <el-button type="primary" class="blue-gra" icon="icon his-add" @click="handleEditData('add',null)">{{$t('common.add')}}</el-button>
            </div>
        </div>
        <query-table
            ref="queryTable"
            :listSlotHeight='listSlotHeight'
            :currItemL='currItemL'
            actionFlag='list'
            @handleEditData='handleEditData'
        />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { deepCopy } from '@/utils'
import { useType_condition,getDictDataList } from '@/api/his/dic/hospitalDataDict'
import queryTable from './queryTtable.vue'

@Component({
    name: 'list',
    filters: {},
    components: {
        queryTable,
    },
})
export default class extends Vue {
	@Prop({ required: true }) private currItemL!: any // 当前左侧li
    private listSlotHeight:number = 0
    created() {
        this.listSlotHeight = Vue.prototype.PageHeight-164
    }
    mounted() {
        this.init()
    }

    //数据监控
    @Watch("currItemL", { immediate: true })
    private oncurrItemLChange(val: string) {
        this.init()
    }

    private init(){
        // const queryTable : any = this.$refs.queryTable
        // queryTable.getTableListRef()
    }


    private handleEditData(flag:string,rowData:any,tableData:any){
        const queryTable : any = this.$refs.queryTable
        const data = flag == "add" || flag == "addChild" ? queryTable.addData : tableData
        //  抛给edit组件的内容 依次 => 当前行数据(若是修改)   新增/修改/详情 标记 add/edit/detil  当前字典的属性定义数据
        this.$emit('handleAddOrEdit',flag,rowData,data)
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