<template>
    <div class="content">
        <el-row class="ht" :gutter="10">
            <el-col class="ht" :span="6">
                <div class="his-module">
                    <div class="row">
                        <div class="label">
                            <h1 class="title">{{$t('stdDic.dataDic')}}</h1>
                        </div>
                        <div class="operate">
                            <el-button
                                type="primary"
                                class="blue-gra"
                                icon="icon his-add"
                                @click="clickAddDic"
                            >{{$t('stdDic.addDic')}}</el-button>
                        </div>
                    </div>
                    <el-input
                        v-model="searchData1.basicDataName"
                        :placeholder="$t('stdDic.phDic')"
                        class="input1"
                    >
                        <i slot="prefix" class="el-input__icon icon his-search"></i>
                    </el-input>
                    <ul class="left-list">
                        <li
                            v-for="(item,index) in list1"
                            :key="item.basicdataId"
                            @click="getList2(item.basicdataId)"
                            :class="current==item.basicdataId?'selected':''"
                        >{{item.basicDataName}}</li>
                    </ul>
                </div>
            </el-col>
            <el-col class="ht" :span="18">
                <div class="his-module">
                    <div class="row">
                        <div class="label">
                            <h1 class="title">{{$t('stdDic.data')}}</h1>
                        </div>
                        <div class="operate">
                            <el-button
                                type="primary"
                                class="blue-gra"
                                icon="icon his-add"
                                @click="clickAddData"
                            >{{$t('stdDic.addData')}}</el-button>
                        </div>
                    </div>
                    <el-input
                        v-model="searchData1.basicDataName"
                        :placeholder="$t('stdDic.phData')"
                        class="input2"
                    >
                        <i slot="prefix" class="el-input__icon icon his-search"></i>
                    </el-input>
                    <pagenation-list
                        ref="pageTable2"
                        v-model="list2"
                        data-url="/op-service/hspbasicdatavalue/queryPage"
                        :search-data="searchData2"
                        http-method="post"
                        class="table2"
                    >
                        <el-table
                            slot="list"
                            stripe
                            :highlight-current-row="true"
                            :data="list2"
                            border
                        >
                            <el-table-column
                                prop="serialNumber"
                                :label="$t('common.serialNum')"
                            ></el-table-column>
                            <el-table-column
                                prop="dataValue"
                                :label="$t('common.code1')"
                            ></el-table-column>
                            <el-table-column
                                prop="dataValueRemark"
                                :label="$t('stdDic.dataName')"
                                sortable
                            ></el-table-column>
                            <el-table-column
                                :label="$t('common.action')"
                                width="180"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <el-tooltip :content="$t('common.addSub')" effect="light">
                                        <el-button class="green" @click="handleAdd(scope.row)">
                                            <i class="icon his-append"></i>
                                        </el-button>
                                    </el-tooltip>
                                    <el-tooltip :content="$t('common.edit')" effect="light">>
                                        <el-button class="blue" @click="handleAdd(scope.row)">
                                            <i class="icon his-edit"></i>
                                        </el-button>
                                    </el-tooltip>
                                    <el-tooltip :content="$t('common.disable')" class="ml10"  effect="light">>
                                        <el-popconfirm
                                            :title="$t('stdDic.sureDisable')"
                                            :confirmButtonText="$t('common.confirm')"
											:cancelButtonText="$t('common.cancel')"
                                            hideIcon
                                        >
                                            <el-button slot="reference" class="red">
                                                <i class="icon his-disabled"></i>
                                            </el-button>
                                        </el-popconfirm>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </el-table>
                    </pagenation-list>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

@Component({
    name: 'healthInstitution',
    filters: {}
})

export default class extends Vue {
    private searchData1: any = {
        basicDataName: ''
    }
    private searchData2:any = {
        basicDateType:"",
        dataValueRemark:"",
        parentDatavalueId:0
    }
    private dialogVisible1: boolean = false
    private list1: any[]=[
        {basicdataId: 1,basicDataName: 'aaa'},
        {basicdataId: 2,basicDataName: 'bbb'},
    ]
    private current:number=-1
    private list2: any[]=[
        {serialNumber: 1,dataValue: '001',dataValueRemark: '名称1'},
        {serialNumber: 2,dataValue: '002',dataValueRemark: '名称2'},
    ]


    //新增字典按钮
    clickAddDic(){
        this.dialogVisible1 = true
    }

    // 新增数据按钮
    clickAddData(){}

    // 获取右侧列表
    getList2(id:any){
        this.current=id;
        // this.searchData2.basicDateType=id;
        // this.searchData2.dataValueRemark="";
        // const pageTable2:any=this.$refs["pageTable2"];
        // pageTable2.searchList();
    };

    // 监听方法
    @Watch('')
    private onValueChange(value: string) {
        console.log('hello world')
    }

    created() {
        console.log('hello world')
    }

    mounted() {
        // this.init()
    }

}
</script>

<style lang="scss" scoped>
.input1 ::v-deep{
    .el-input__inner{
        @include normal-input;
    }
}
.input2 ::v-deep{
    width: 33%;
    .el-input__inner{
        @include normal-input;
    }
}
.left-list{
    margin-top: 10px;
    li{
        padding: 12px 8px;
        border-bottom: 1px solid #f5f6f8;
        cursor: default;
        &:hover,&.selected{
            background: #ebf7ff;
        }
    }
}
.table2{
    margin-top: 10px;
}
</style>
