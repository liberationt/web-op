<template>
    <div class="content">
        <el-row class="ht" :gutter="10">
            <!-- 字典 -->
            <el-col class="ht" :span="5">
                <div class="his-module">
                    <div class="row">
                        <div class="label">
                            <h1 class="title">{{$t('hospitalDataDict.titleC')}}</h1>
                        </div>
                        <div class="operate">
                            <span class="plus-ico">
                            </span>
                        </div>
                    </div>
                    <el-input v-model="dictSearch.keywords" @keydown.enter.native="getDictListRef" :placeholder="$t('hospitalDataDict.phleft')" class="queryInput mb10" >
                        <i slot="prefix" class="el-input__icon icon his-search"></i>
                    </el-input>
                    <pagenation-list
                        ref="dictPage"
                        data-url="/op-service/dict/config/type/list"
                        v-model="dictList"
                        :searchData="dictSearch"
                        :pageProps='pageProps'
                        prec='30'
					    :list-height='listSlotHeight'
                        http-method="post">
                        <div slot="list" class="scroll-bar" style="margin-top:8px" :style="{height:listSlotHeight+'px'}">
                            <ul>
                                <li class="li_item" v-for="(dict,index) in  dictList" :key="dict.id" :value="dict.id"  :class="{'backColor':currIndexL == index}" @click="handleDictItem(dict,index)">
                                    <span class="more_ico" style="margin-right:8px">
                                        <i v-if="dict.enable" class="el-input__icon icon his-qiyong"></i>
                                        <i v-else class="el-input__icon icon his-tingyong"></i>
                                    </span>
                                    {{dict.cname}}
                                </li>
                            </ul>
                        </div>
                    </pagenation-list>
                </div>
            </el-col>
            <!-- 数据 -->
            <el-col class="ht" :span="19">
                <list v-if="currItemL.id&&!isEdit"
                    :currItemL='currItemL'
                    @handleAddOrEdit="handleAddOrEdit"
                />
                <edit v-if="isEdit"
                    :currItemL='currItemL'
                    :columnData='columnData'
                    :editFlag='editFlag'
                    :rowData='rowData'
                    @editOk='editOk'
                />
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { deepCopy } from '@/utils'
import { useType_condition } from '@/api/his/dic/hospitalDataDict'
import list from './list.vue'
import edit from './edit.vue'

@Component({
    name: 'publicPage',
    filters: {},
    components: {
        list,edit
    },
})
export default class extends Vue {
    private listSlotHeight:number = 0
    private currIndexL:number = 0
    private currItemL:any={}
    private isEdit:boolean=false
    private editFlag:string=''
    private rowData:any = {}
    private dictSearch: any = {
        groupId: '',
        keywords:''
    }
    private dictList:Array<any> = []
    private useTypeList:Array<any> = []
    private columnData:Array<any> = []
    private pageProps: object = {"layout":"prev, pager, next"}

    created() {
        const groupId = this.$route.path.substr(this.$route.path.lastIndexOf('/')+1)
        this.dictSearch.groupId = this.$route.query.groupId || 2 // 调试暂定 2
        this.listSlotHeight = Vue.prototype.PageHeight-164
    }
    mounted() {
        this.init()
    }

    //数据监控
    @Watch("dictList", { immediate: true })
    private onDictListChange(val: string) {
        if(this.dictList.length!=0) this.handleDictItem(this.dictList[0],0)
        // else this.tableData = []
    }
    private init(){
        this.getDictListRef()
    }
    // 字典类型搜索
    private getDictListRef(){
        const dictPage : any = this.$refs.dictPage
        dictPage.getList()
    }

    // 点击字典项目
    private handleDictItem(dict:any,index:number){
        this.currIndexL = index
        this.currItemL = dict
        this.isEdit = false
    }
    // list组件点击新增编辑
    private handleAddOrEdit(flag:any,data:any,columnData:Array<any>){
        this.editFlag = flag
        this.rowData = data
        this.columnData = columnData
        // switch(flag){
        //     case 'add': // 点击新增
        //     break;
        //     case 'edit': // 点击编辑
        //     break;
        //     case 'detil': // 点击详情
        //     break;
        // }
        this.isEdit = true
    }

    // 编辑完成
    private editOk(flag:boolean){
        this.isEdit = false
        if (flag) { // 编辑确定操作
            this.$notify({
                title: this.$t('hospitalDataDict.succtipL') +"",
                message: '',
                type: 'success'
            });
        } else { // 编辑取消操作
            console.log('取消')
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
        width:12px;
        height:12px;
        background:rgba(20,133,255,0.1);
        border:1px solid rgba(20,133,255,1);
        border-radius: 50%;
        padding: 2px 3px;
        font-size: 12px;
    }
    .his-tingyong{
        color:rgba(249,87,118,1);
        width:12px;
        height:12px;
        background:rgba(249,87,118,0.1);
        border:1px solid rgba(249,87,118,1);
        border-radius: 50%;
        padding: 2px 3px;
        font-size: 12px;
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
