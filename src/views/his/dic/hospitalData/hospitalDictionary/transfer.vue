<template>
    <div class="transfer clearfix">
        <div class="list1">
            <div class="head">
                <el-checkbox>国家标准字典</el-checkbox>
                <span>2/14</span>
            </div>
            <el-input class="queryInput">
                <i slot="prefix" class="el-input__icon icon his-search"></i>
            </el-input>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

@Component({
    name: 'transfer',
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
    private listL: any[]=[
        {basicdataId: 1,basicDataName: 'aaa'},
        {basicdataId: 2,basicDataName: 'bbb'},
    ]
    private current:number=-1
    private listR: any[]=[
        {serialNumber: 1,dataValue: '001',dataValueRemark: '名称1'},
        {serialNumber: 2,dataValue: '002',dataValueRemark: '名称2'},
    ]

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
.transfer{

}
.list1{
    float: left;
    border: 1px solid #f00;
}
</style>