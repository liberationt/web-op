<template>
    <div class="content">
        <div class="his-module layout-top">
            <div class="row">
                <div class="label">
                    <h1 class="title">{{$t('heaSer.title1')}}</h1>
                    <el-input
                        :placeholder="$t('heaSer.phSearch')"
                        class="input1"
                    >
                        <i slot="prefix" class="el-input__icon icon his-search"></i>
                    </el-input>
                    <span class="label1">{{$t('heaSer.type')}}:</span>
                    <el-input class="input-r1"></el-input>
                    <!-- <search-select
                        class="input-r1"
                        table-name="HSP_DATA_MAIN"
                        kid="125"
                        placeholder="请选择"
                    /> -->
                    <el-checkbox class="chk1">{{$t('heaSer.include')}}</el-checkbox>
                </div>
                <div class="operate">
                    <el-button
                        type="primary"
                        class="blue-gra"
                        icon="icon his-add"
                    >{{$t('common.add')}}</el-button>
                </div>
            </div>
            <pagenation-list
                ref="pageTable"
                v-model="tableData"
                data-url="/system-service/sys/dicgbsj02/page"
                :search-data="searchData"
                http-method="post"
            >
                <el-table
                    slot="list"
                    stripe
                    :highlight-current-row="true"
                    :data="tableData"
                    border
                    class="table-aaa"
                >
                    <el-table-column prop="a" :label="$t('heaSer.name1')"></el-table-column>
                    <el-table-column prop="b" :label="$t('heaSer.spec')"></el-table-column>
                    <el-table-column prop="c" :label="$t('heaSer.type')"></el-table-column>
                    <el-table-column prop="d" :label="$t('heaSer.unit')"></el-table-column>
                    <el-table-column
                        :label="$t('common.action')"
                        width="100"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-tooltip :content="$t('common.edit')" effect="light">
                                <el-button class="red">
                                    <i class="icon his-edit"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip :content="$t('common.disable')" effect="light" class="ml10">
                                <el-popconfirm
                                    :title="scope.row.unvalidDate == null ? $t('emp.logOffEmp') : $t('emp.restoreEmp')"
                                    :confirmButtonText="$t('common.confirm')"
                                    :cancelButtonText="$t('common.cancel')"
                                    @confirm="confirm(scope.row)"
                                    hideIcon
                                >
                                    <el-button
                                        slot="reference"
                                        :class="scope.row.unvalidDate == null ? 'red' : 'green'"
                                    >
                                        <i
                                        class="icon"
                                        :class="
                                            scope.row.unvalidDate == null ? 'his-disabled' : 'his-invocation'
                                        "
                                        ></i>
                                    </el-button>
                                </el-popconfirm>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </pagenation-list>
        </div>
        <div class="his-module layout-bot">
            <div class="row">
                <div class="label">
                    <h1 class="title">{{$t('heaSer.alias')}}</h1>
                </div>
                <div class="operate">
                    <el-button
                        type="primary"
                        class="blue-gra"
                        icon="icon his-add"
                    >{{$t('common.add')}}</el-button>
                </div>
            </div>
            <pagenation-list
                ref="pageTable"
                v-model="tableData"
                data-url="/system-service/sys/dicgbsj02/page"
                :search-data="searchData"
                http-method="post"
            >
                <el-table
                    slot="list"
                    stripe
                    :highlight-current-row="true"
                    :data="tableData"
                    border
                >
                    <el-table-column prop="a" :label="$t('common.serialNum')"></el-table-column>
                    <el-table-column prop="b" :label="$t('heaSer.name2')"></el-table-column>
                    <el-table-column
                        :label="$t('heaSer.oName')"
                        width="100"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-checkbox disabled></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('common.action')"
                        width="100"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-tooltip :content="$t('common.disable')" effect="light" class="ml10">
                                <el-popconfirm
                                    :title="scope.row.unvalidDate == null ? $t('emp.logOffEmp') : $t('emp.restoreEmp')"
                                    :confirmButtonText="$t('common.confirm')"
                                    :cancelButtonText="$t('common.cancel')"
                                    @confirm="confirm(scope.row)"
                                    hideIcon
                                >
                                    <el-button
                                        slot="reference"
                                        :class="scope.row.unvalidDate == null ? 'red' : 'green'"
                                    >
                                        <i
                                        class="icon"
                                        :class="
                                            scope.row.unvalidDate == null ? 'his-disabled' : 'his-invocation'
                                        "
                                        ></i>
                                    </el-button>
                                </el-popconfirm>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </pagenation-list>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

@Component({
    name: 'healthInstitution',
    filters: {}
})

export default class extends Vue {
    private tableData: any[] = [
        {a: '项目名称1',b: '规格1',c: '类别1',d: '单位1'},
        {a: '项目名称2',b: '规格2',c: '类别2',d: '单位2'},
        {a: '项目名称3',b: '规格3',c: '类别3',d: '单位3'},
        // {a: '项目名称1',b: '规格1',c: '类别1',d: '单位1'},
        // {a: '项目名称2',b: '规格2',c: '类别2',d: '单位2'},
        // {a: '项目名称3',b: '规格3',c: '类别3',d: '单位3'},
        // {a: '项目名称1',b: '规格1',c: '类别1',d: '单位1'},
        // {a: '项目名称2',b: '规格2',c: '类别2',d: '单位2'},
        // {a: '项目名称3',b: '规格3',c: '类别3',d: '单位3'},
        // {a: '项目名称1',b: '规格1',c: '类别1',d: '单位1'},
        // {a: '项目名称2',b: '规格2',c: '类别2',d: '单位2'},
        // {a: '项目名称3',b: '规格3',c: '类别3',d: '单位3'},
    ]
    private searchData: any = {}
    private defaultProps:any = {
        label: 'name',
        children: 'nodes'
    }
    dialogVisible: boolean = false
    private formData: any = {
        organizationCode: '',
        hospitalName: '',
        hospitalClassId: '',
        hospitalGradeId: '',
        provinceId: '',
        cityId: '',
        countyId: '',
        addressValue: '',// 省市区id，字符串
        townshipAddr: '',
        telephone: '',
        email: '',
        chargeName: '',
        chargeTelephone: '',
        chargeRecordNumber: '',
        phoneNumber: '',
        affiliatedName: '',
        secondName: '',
        setupDate: '',
        revokeDate: ''
    }
    private formValid: any = {
        organizationCode: [{
            required: true, message: '机构代码不能为空', trigger: 'blur'
        }],
        hospitalName: [{
            required: true, message: '机构名称不能为空', trigger: 'blur'
        }],
        hospitalClassId: [{
            required: true, message: '卫生机构类别不能为空', trigger: 'blur'
        }],
        hospitalGradeId: [{
            required: true, message: '医院等级不能为空', trigger: 'blur'
        }],
        affiliatedName: [{
            required: true, message: '医院简称不能为空', trigger: 'blur'
        }],
        secondName: [{
            required: true, message: '医院全称不能为空', trigger: 'blur'
        }]
    }

    private handleAdd(){}

    private confirm(){}

    // 获取机构详情
    getDetail(node: any){
        console.log(node);
    }

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
.table-aaa{
    // height: 300px;
    // ::v-deep .el-table__body-wrapper{
    //     height: calc(100% - 40px)!important;
    //     overflow: auto;
    // }
}
.layout-top{
    height: 60%;
}
.layout-bot{
    height: calc(40% - 10px);
    margin-top: 10px;
}
.input1{
    width: initial;
}
.label1{
    margin-left: 20px;
    color: #222b31;
    white-space: nowrap;
}
.input-r1{
    width: 160px;
    margin-left: 8px;
    ::v-deep .el-input__inner{
        width: 100%!important;
    }
    ::v-deep .el-input{
        margin-left: 0!important;
        .el-input__inner{
            width: 100%;
        }
    }
}
.chk1{
    margin-left: 20px;
}
</style>
