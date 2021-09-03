<template>
    <div class="content">
        <el-row class="ht" :gutter="10">
            <el-col class="ht" :span="6">
                <div class="his-module">
                    <div class="row">
                        <div class="label">
                            <h1 class="title">医院数据列表</h1>
                        </div>
                    </div>
                    <el-input
                        v-model="searchData1.basicDataName"
                        :placeholder="$t('stdDic.phDic')"
                        class="input1 queryInput"
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
                                icon="icon his-pull-in"
                                @click="dialogVisible=false"
                            >引用</el-button>
                        </div>
                    </div>
                    <el-input
                        v-model="searchData1.basicDataName"
                        :placeholder="$t('stdDic.phData')"
                        class="input2 queryInput"
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
                                    <el-tooltip :content="$t('common.addSub')">
                                        <el-button class="green" @click="handleAdd(scope.row)">
                                            <i class="icon his-append"></i>
                                        </el-button>
                                    </el-tooltip>
                                    <el-tooltip :content="$t('common.edit')">
                                        <el-button class="blue" @click="handleAdd(scope.row)">
                                            <i class="icon his-edit"></i>
                                        </el-button>
                                    </el-tooltip>
                                    <el-tooltip :content="$t('common.disable')" class="ml10">
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

        <el-dialog
            :title="'标题'"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
        >
            <transfer/>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import transfer from './transfer.vue'

@Component({
    name: 'healthInstitution',
    components: {
        transfer
    },
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
    private dialogVisible: boolean = false // 穿梭框
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
        this.dialogVisible = true
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
.row{
    height: 40px;
}
// .input1 ::v-deep{
//     .el-input__inner{
//         @include normal-input;
//     }
// }
.input2 ::v-deep{
    width: 33%;
    // .el-input__inner{
    //     @include normal-input;
    // }
}
.left-list{
    margin-top: 10px;
    li{
        margin-bottom: 4px;
        padding: 12px 8px;
        border-radius: 4px;
        cursor: default;
        &:hover{
            background: rgba($color: $blue, $alpha: .1);
        }
        &.selected{
            color: #fff;
            background: $blue;
        }
    }
}
.table2{
    margin-top: 10px;
}
.el-dialog__wrapper{
    ::v-deep .el-dialog__body{
        padding: 16px 24px;
    }
}
</style>
