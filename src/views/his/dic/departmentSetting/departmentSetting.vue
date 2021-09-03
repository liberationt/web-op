<template>
    <div class="content">
        <el-row :gutter="10">
            <el-col :span="6">
                <div class="layout">
                    <div class="main-head">
                        <div class="left">
                            <div class="main-title">科室列表</div>
                        </div>
                        <div class="right">
                            <el-button>新增</el-button>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="layout">
                    <div class="main-head">
                        <div class="left">
                            <div class="main-title">详情</div>
                        </div>
                        <div class="right">
                            <el-button>保存</el-button>
                        </div>
                    </div>
                    <el-form :model="formData" ref="formData" :rules="formValid" label-width="120px" class="form-right clearfix">
                        <el-form-item label="科室代码" prop="organizationCode">
                            <el-input v-model="formData.organizationCode"></el-input>
                        </el-form-item>
                        <el-form-item label="科室名称" prop="hospitalName">
                            <el-input v-model="formData.hospitalName"></el-input>
                        </el-form-item>
                        <el-form-item label="医保科室" prop="townshipAddr">
                            <el-input v-model="formData.townshipAddr"></el-input>
                        </el-form-item>
                        <el-form-item label="科室类型" prop="telephone">
                            <el-input v-model="formData.telephone"></el-input>
                        </el-form-item>
                        <el-form-item label="科室地点" prop="email">
                            <el-input v-model="formData.email"></el-input>
                        </el-form-item>
                        <el-form-item label="序号" prop="chargeName">
                            <el-input v-model="formData.chargeName"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

// 命名文件名称，过滤器什么的都再这里写
@Component({
    name: '',
    filters: {
    }
})

export default class extends Vue {
    // 声明变量，方法
    private list: any = []
    private formData: any = {
        deptId:'',
        deptCode:'',
        deptName:'',
        medicalInsurance:'',
        deptType:'',
        deptPosition:'',
        deptSort:'',
    }
    private formValid: any = {
        deptCode:[{
            required: true, message: '科室代码不能为空', trigger: 'blur'
        }],
        deptName:[{
            required: true, message: '科室名称不能为空', trigger: 'blur'
        }],
    }
    public setValue(value: string) {
        this.setValue(value)
    }

    public getValue() {
        return null
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
</style>