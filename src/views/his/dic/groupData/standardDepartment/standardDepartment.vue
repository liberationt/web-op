<template>
    <div class="content">
        <el-row class="ht" :gutter="10">
            <el-col class="ht" :span="6">
                <div class="his-module">
                    <div class="row">
                        <div class="label">
                            <h1 class="title">{{$t('stdDept.title')}}</h1>
                        </div>
                        <div class="operate">
                            <el-button
                                type="primary"
                                class="blue-gra"
                                icon="icon his-add"
                                @click="clickAddIns"
                            >{{$t('common.add')}}</el-button>
                        </div>
                    </div>
                    <el-input
                        v-model="searchData.basicDataName" 
                        :placeholder="$t('stdDept.phDept')"
                        class="input1 mb10"
                    >
                        <i slot="prefix" class="el-input__icon icon his-search"></i>
                    </el-input>
                    <el-tree
                        :data="data"
                        :props="defaultProps"
                        highlight-current
                        @node-click="getDetail"
                    ></el-tree>
                </div>
            </el-col>
            
            <el-col class="ht" :span="18">
                <div class="his-module">
                    <div class="row">
                        <div class="label">
                            <h1 class="title">{{$t('common.detail')}}</h1>
                        </div>
                        <div class="operate">
                            <el-button
                                type="primary"
                                class="green-gra"
                                icon="icon his-save"
                                @click="clickAddIns"
                            >{{$t('common.save')}}</el-button>
                        </div>
                    </div>
                    <el-form
                        :model="formData"
                        ref="formData"
                        :rules="formValid"
                        label-width="120px"
                        class="form-right clearfix"
                    >
                        <el-form-item :label="$t('stdDept.deptCode')" prop="organizationCode">
                            <el-input v-model="formData.organizationCode"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('stdDept.deptName')" prop="hospitalName">
                            <el-input v-model="formData.hospitalName"></el-input>
                        </el-form-item>
                    </el-form>
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
    private data:any[] = [
        {
            name: '一级 1',
        },
        {
            name: '一级 2',
            nodes: [{
                name: '二级 2-1',
                nodes: [{
                    name: '三级 2-1-1'
                }]
            }]
        },
    ]
    private defaultProps:any = {
        label: 'name',
        children: 'nodes'
    }
    private searchData: any = {
        basicDataName: ''
    }
    dialogVisible: boolean = false
    private formData: any = {
    }
    private formValid: any = {

    }

    //新增组织按钮
    clickAddIns(){
        this.dialogVisible = true
    }

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
</style>