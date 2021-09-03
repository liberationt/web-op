<template>
    <div class="content">
        <el-row class="ht" :gutter="10">
            <el-col class="ht" :span="6">
                <div class="his-module">
                    <div class="row">
                        <div class="label">
                            <h1 class="title">{{$t('heaIns.title')}}</h1>
                        </div>
                        <div class="operate">
                            <el-button
                                type="primary"
                                class="blue-gra"
                                icon="icon his-add"
                                @click="clickAddIns"
                            >{{$t('heaIns.add1')}}</el-button>
                        </div>
                    </div>
                    <el-tree
                        :data="data"
                        :props="defaultProps"
                        highlight-current
                        @node-click="getDetail"
                    ></el-tree>
                </div>
            </el-col>
            <el-dialog
                :title="$t('heaIns.add1')"
                :visible.sync="dialogVisible"
            >
                <el-form
                    :model="formData1"
                    ref="formData1"
                    :rules="formValid1"
                    class="form-dialog"
                    label-width="150px"
                >
                    <el-form-item :label="$t('heaIns.orgInsCode')" prop="organizationCode">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('heaIns.orgInsName')" prop="organizationCode">
                        <el-input></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">{{$t('common.close')}}</el-button>
                    <el-button type="primary" @click="dialogVisible = false">{{$t('common.confirm')}}</el-button>
                </span>
            </el-dialog>
            <el-col class="ht" :span="18">
                <div class="his-module">
                    <div class="row">
                        <div class="label">
                            <h1 class="title">{{$t('common.detail')}}</h1>
                        </div>
                        <div class="operate">
                            <el-button
                                type="primary"
                                class="blue-gra"
                                icon="icon his-add"
                                @click="clickAddIns"
                            >{{$t('heaIns.add2')}}</el-button>
                            <el-button
                                type="primary"
                                class="green-gra"
                                icon="icon his-save"
                                @click="clickAddIns"
                            >{{$t('common.save')}}</el-button>
                        </div>
                    </div>
                    <el-form
                        :model="formData2"
                        ref="formData2"
                        :rules="formValid2"
                        label-width="120px"
                        class="form-right clearfix"
                    >
                        <el-form-item :label="$t('heaIns.orgInsCode')" prop="organizationCode">
                            <el-input v-model="formData2.organizationCode"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('heaIns.medInsIco')" prop="hospitalName">
                            <el-input v-model="formData2.hospitalName"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('heaIns.medInsName')" prop="hospitalName">
                            <el-input v-model="formData2.hospitalName"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('heaIns.medInsAbbr')" prop="hospitalName">
                            <el-input v-model="formData2.hospitalName"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('heaIns.heaInsType')" prop="hospitalClassId">
                            <el-input v-model="formData2.hospitalClassId"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('heaIns.hosGrade')" prop="hospitalGradeId">
                            <el-input v-model="formData2.hospitalGradeId"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('heaIns.province')" prop="addressValue">
                            <el-input v-model="formData2.provinceId" class="gray"/>
                            <!-- <el-input v-model="formData.cityId" class="gray"/> -->
                            <!-- <el-input v-model="formData.countyId" class="gray"/> -->
                        </el-form-item>
                        <el-form-item :label="$t('common.address')" prop="townshipAddr">
                            <el-input v-model="formData2.townshipAddr"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('common.tel')" prop="telephone">
                            <el-input v-model="formData2.telephone"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('common.email')" prop="email">
                            <el-input v-model="formData2.email"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('heaIns.legalPerson')" prop="chargeName">
                            <el-input v-model="formData2.chargeName"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('heaIns.legalPersonTel')" prop="chargeTelephone">
                            <el-input v-model="formData2.chargeTelephone"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('heaIns.legalPersonID')" prop="chargeRecordNumber">
                            <el-input v-model="formData2.chargeRecordNumber"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('heaIns.zipCode')" prop="phoneNumber">
                            <el-input v-model="formData2.phoneNumber"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('heaIns.hosAbbr')" prop="affiliatedName">
                            <el-input v-model="formData2.affiliatedName"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('heaIns.hosName')" prop="secondName">
                            <el-input v-model="formData2.secondName"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('heaIns.beginDate')" prop="setupDate">
                            <el-date-picker type="date" v-model="formData2.setupDate"></el-date-picker>
                        </el-form-item>
                        <el-form-item :label="$t('heaIns.revokeDate')" prop="revokeDate">
                            <el-date-picker type="date" v-model="formData2.revokeDate"></el-date-picker>
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
    dialogVisible: boolean = false
    private formData1: any = {

    }
    private formValid1: any = {
        organizationCode: [{
            required: true, message: window.ele.$i18n.t('heaIns.vdOrgInsCode'), trigger: 'blur'
        }],
        hospitalName: [{
            required: true, message: window.ele.$i18n.t('heaIns.vdOrgInsCode'), trigger: 'blur'
        }]
    }
    private formData2: any = {
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
    private formValid2: any = {
        organizationCode: [{
            required: true, message: window.ele.$i18n.t('heaIns.vdOrgInsCode'), trigger: 'blur'
        }],
        hospitalName: [{
            required: true, message: window.ele.$i18n.t('heaIns.vdOrgInsCode'), trigger: 'blur'
        }],
        hospitalClassId: [{
            required: true, message: window.ele.$i18n.t('heaIns.vdOrgInsCode'), trigger: 'blur'
        }],
        hospitalGradeId: [{
            required: true, message: window.ele.$i18n.t('heaIns.vdOrgInsCode'), trigger: 'blur'
        }],
        affiliatedName: [{
            required: true, message: window.ele.$i18n.t('heaIns.vdOrgInsCode'), trigger: 'blur'
        }],
        secondName: [{
            required: true, message: window.ele.$i18n.t('heaIns.vdOrgInsCode'), trigger: 'blur'
        }]
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
.form-right{
    width: 80%;
    .el-form-item{
        width: 45%;
        &:nth-child(odd){
            float: left;
        }
        &:nth-child(even){
            float: right;
        }
        .el-date-editor{
            width: 100%;
        }
    }
}
</style>