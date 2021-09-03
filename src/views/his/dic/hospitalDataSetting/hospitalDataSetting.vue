<template>
    <div class="content">
        <el-row :gutter="10">
            <el-col :span="6">
                <div class="layout">
                    <div class="main-head">
                        <div class="left">
                            <div class="main-title">医院数据列表</div>
                        </div>
                        <div class="right">
                            <el-input></el-input>
                        </div>
                    </div>
                    <ul slot="list" class="left-list">
                        <li
                            v-for="(item,index) in list1"
                            :key="item.basicdataId"
                            @click="getList2(item.basicdataId)"
                            :class="current==item.basicdataId?'selected':''"
                        >{{item.basicDataName}}</li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="layout">
                    <pagenation-list
                        ref="pageTable2"
                        v-model="list2"
                        data-url="/op-service/hspbasicdatavalue/queryPage"
                        :search-data="searchData2"
                        http-method="post"
                    >
                        <div slot="header" class="main-head">
                            <div class="left">
                                <div class="main-title">数据</div>
                                <el-input></el-input>
                            </div>
                            <div class="right">
                                <el-button>新增</el-button>
                            </div>
                        </div>
                        <el-table slot="list" :data="list2" stripe>
                            <el-table-column prop="serialNumber" label="序号"></el-table-column>
                            <el-table-column prop="dataValue" label="ICD-10编码"></el-table-column>
                            <el-table-column prop="dataValueRemark" label="疾病诊断"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                <el-button size="mini">{{scope.row.stopFlag}}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </pagenation-list>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
    aDataList,aDataList2,aDataAdd,aDataStop,aDataOpen,aDataEdit
} from '@/api/his/dic/hospitalData.ts'
// 声明接口
declare interface IPageList {
    id: number,
}

// 命名文件名称，过滤器什么的都再这里写
@Component({
    name: 'hospitalDataSetting',
    filters: {
    }
})

export default class extends Vue {
    // 声明变量，方法
    private list1: any = []
    private searchData1: any = {
        basicDataName:'',
    }
    private current: number = -1;
    private pId: number = 0;//新增下级时的父id
    private list2: any = [];
    private searchData2: any = {
        basicDateType:"",
        dataValueRemark:"",
        parentDatavalueId:0
    };

    //获取左侧列表
    getList1(){
        aDataList(this.searchData1).then((res:any)=>{
            if(res.errorCode=="SUCCESS"){
                this.list1=res.data;
            }
        });
    }

    //获取右侧列表
    getList2(id:any){
        this.current=id;
        this.searchData2.basicDateType=id;
        this.searchData2.dataValueRemark="";
        const pageTable2:any=this.$refs["pageTable2"];
        pageTable2.searchList();
    };

    // 监听方法
    @Watch('')
    private onValueChange(value: string) {
        console.log('hello world')
    }

    // 初始化的周期函数
    created() {
        console.log('hello world')
    }

    mounted() {
        this.getList1()
    }
}
</script>

<style lang="scss" scoped>
.content {
    padding: 10px;
    background: #f5f6f8;
}
.layout {
    padding: 0 16px 10px 16px;
    border-radius: 8px;
    background: #fff;
}
.main-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    margin-bottom: 10px;
    border-bottom: 1px solid #f5f6f8;
    .left {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .main-title {
        font-size: 16px;
        color: #222b31;
        font-weight: bold;
        white-space: nowrap;
    }
}
ul.left-list{
    // margin-top: 20px;
    li{
        padding: 12px 8px;
        border-bottom: 1px solid #f5f6f8;
        cursor: default;
        &:hover,&.selected{
            background: #ebf7ff;
        }
    }
}
</style>
