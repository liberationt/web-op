<template>
    <div class="content">
        <el-row :gutter="10">
            <el-col :span="6">
                <div class="layout">
                    <div class="main-head">
                        <div class="left">
                            <div class="main-title">医疗机构</div>
                        </div>
                        <div class="right">
                            <el-button
                                @click="addOrg"
                            >新增组织机构</el-button>
                        </div>
                    </div>
                    <el-dialog :visible.sync="isAddOrg" title="新增组织机构" width="412">
                        <el-form
                            :model="orgData"
                            ref="orgData"
                            :rules="orgValid"
                            label-width="110px"
                            class="clearfix"
                        >
                            <el-form-item label="组织机构代码" prop="organizationCode">
                                <el-input v-model="orgData.organizationCode"></el-input>
                            </el-form-item>
                            <el-form-item label="组织机构名称" prop="hospitalName">
                                <el-input v-model="orgData.hospitalName"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer">
                            <el-button color="white" @click="cancel">关闭</el-button>
                            <el-button color="primary-gra" @click="addOrgSubmit">确定</el-button>
                        </div>
                    </el-dialog>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="layout">
                    <div class="main-head">
                        <div class="left">
                            <div class="main-title">详情</div>
                        </div>
                        <div class="right">
                            <el-button
                                @click="addOrg"
                            >新增医疗机构</el-button>
                            <el-button
                                @click="addOrg"
                            >保存</el-button>
                        </div>
                    </div>
                    <el-form :model="formData" ref="formData" :rules="formValid" label-width="120px" class="form-right clearfix">
                        <el-form-item label="组织机构代码" prop="organizationCode">
                            <el-input v-model="formData.organizationCode"></el-input>
                        </el-form-item>
                        <el-form-item label="医疗机构名称" prop="hospitalName">
                            <el-input v-model="formData.hospitalName"></el-input>
                        </el-form-item>
                        <el-form-item label="卫生机构类别" prop="hospitalClassId">
                            <identification-data
                                v-model="formData.hospitalClassId"
                                :querySql='"select * from  HSP_DATA_SON where pid=183"'
                                :dictFlag='2'
                                :kid='183'
                                :backfillValue='formData.hospitalClassId'
                            />
                        </el-form-item>
                        <el-form-item label="医院等级" prop="hospitalGradeId">
                            <identification-data
                                v-model="formData.hospitalGradeId"
                                :querySql='"select * from  HSP_DATA_SON where pid=184"'
                                :dictFlag='2'
                                :kid='184'
                                :backfillValue='formData.hospitalGradeId'
                            />
                        </el-form-item>
                        <el-form-item label="所在省市" prop="addressValue">
                            <!-- <el-input v-model="formData.provinceId" class="gray"/> -->
                            <cascade-address
                                :key="cascadeIndex"
                                ref="cascadeAddress"
                                class="gray"
                                :backfillObj="backfillObj"
                                v-model="formData.addressValue"
                            />
                        </el-form-item>
                        <el-form-item label="详细地址" prop="townshipAddr">
                            <el-input v-model="formData.townshipAddr"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="telephone">
                            <el-input v-model="formData.telephone"></el-input>
                        </el-form-item>
                        <el-form-item label="电子邮箱" prop="email">
                            <el-input v-model="formData.email"></el-input>
                        </el-form-item>
                        <el-form-item label="负责人（法人）" prop="chargeName">
                            <el-input v-model="formData.chargeName"></el-input>
                        </el-form-item>
                        <el-form-item label="法人联系电话" prop="chargeTelephone">
                            <el-input v-model="formData.chargeTelephone"></el-input>
                        </el-form-item>
                        <el-form-item label="法人身份证号" prop="chargeRecordNumber">
                            <el-input v-model="formData.chargeRecordNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="邮政编码" prop="phoneNumber">
                            <el-input v-model="formData.phoneNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="医院简称" prop="affiliatedName">
                            <el-input v-model="formData.affiliatedName"></el-input>
                        </el-form-item>
                        <el-form-item label="医院全称" prop="secondName">
                            <el-input v-model="formData.secondName"></el-input>
                        </el-form-item>
                        <el-form-item label="成立日期" prop="setupDate">
                            <el-date-picker type="date" v-model="formData.setupDate"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="撤销日期" prop="revokeDate">
                            <el-date-picker type="date" v-model="formData.revokeDate"></el-date-picker>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'

// 声明接口
declare interface IPageList {
    id: number,
}

// 命名文件名称，过滤器什么的都再这里写
@Component({
    name: '',
    filters: {
    }
})

export default class extends Vue {
    // 声明变量，方法
    private list: any = []
    private isAddOrg: boolean = false
    private orgData: any = {
        organizationCode:"",
        hospitalName:"",
        parentHospitalId:0,//默认上级是0
    }
    private orgValid: any = {
        organizationCode: [{
            required: true, message: '组织机构代码不能为空', trigger: 'blur'
        }],
        hospitalName: [{
            required: true, message: '组织机构名称不能为空', trigger: 'blur'
        }]
    }
    cascadeIndex: number = 1
    backfillObj: any = { // 初始化省市区
        provinceId:'',
        cityId:'',
        areaId:'',
    }
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
    };
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
    };

    // 新增组织按钮
    addOrg(){
        this.isAddOrg=true;
        console.log(123);
        // (this.$refs["orgData"] as Form).resetFields();
    }

    cancel() {
        this.isAddOrg = false;
    }

    // 提交组织新增
    addOrgSubmit() {
        // (this.$refs['orgData'] as Form).validate((valid) => {
        //     if(valid){
        //         addOrganization(this.orgData).then((res:any)=>{
        //             if(res.errorCode=="SUCCESS"){
        //                 this.$Notice.success({
        //                     title:"添加成功",
        //                 });
        //                 this.isAddOrg=false;
        //                 this.getInstitution();
        //                 this.orgData.parentHospitalId=0;//复位
        //             }
        //         })
        //     }
        // })
    }

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
        console.log('hello world')
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
.form-right{
    width: 75%;
    margin: 0 auto;
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