<!-- 抗菌药物申请 -->
<template>
    <div class="conmm">
        <el-row :gutter="10" class="ht">
            <el-col :span="10" class="ht">
                <div class="his-module his-small ht">
                    <div slot="header" class="row">
                        <div class="label">
                            <div class="searchTitle no-warp">申请抗菌药物</div>
                            <el-divider direction="vertical"></el-divider>
                            <div class="btn">
                                <el-button size="mini" type="text" @click="joinIn">
                                    <i class="icon his-btn-add"></i>
                                    {{ $t('添加') }}
                                </el-button>
                                <el-button size="mini" type="text" @click="handleDelete" v-preventReClick :loading="isLoading" :disabled="!this.list.length">
                                    <i class="icon his-del red"></i>删除
                                </el-button>
                            </div>
                        </div>
                        <div class="querySearch">
                            <el-radio-group class="searchTitle" v-model="searchData.cfid" @change="getYfsb">
                                处方类型
                                <el-radio :label="1">西药/中成药</el-radio>
                                <!-- <el-radio :label="2">中成药</el-radio> -->
                                <el-radio :label="3">中草药</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <el-table 
                        :data="list" 
                        border 
                        stripe 
                        :highlight-current-row="true" 
                        slot="list" 
                        class="scroll-bar" 
                        :height="listSlotHeight"
                        :row-class-name="tableRowClassName"
                        @row-click="getRowClick"
                    >
                        <el-table-column type="index" width="32"></el-table-column>
                        <el-table-column prop="sqrq" :label="$t('申请时间')" min-width="120">
                            <template slot-scope="scope">
                                <span>{{scope.row.sqrq}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ypmc" :label="$t('药品名称')" min-width="148">
                            <template slot-scope="scope">
                                <remoteSearchBox
                                    v-model="scope.row.ypmc"
                                    name="mzys_cf"
                                    style="height: 32px;"
                                    @getData="setData"
                                    :ref="`${scope.$index}-1`"
                                    :searchData="searchSelectData"
                                    :resultTableHeader="resultTableHeader"
                                    :searchField="{
                                      yp: 'pydm',
                                      zt: 'pydm',
                                    }"
                                    :showLabel="{
                                      yp: 'ypmc',
                                      zt: 'ztmc',
                                    }"
                                    :popover-width="630"
                                    :disabled="scope.row.zt != null"
                                ></remoteSearchBox>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ts" label="天数" class-name="text-blue-td" min-width="52" label-class-name="first-red">
                            <template slot-scope="scope">
                                <div>
                                    <input-box 
                                        v-model="scope.row.ts" 
                                        :ref="`${scope.$index}-2`" 
                                        style="height: 32px;"
                                        @blur="getGkfs(scope.row)" 
                                        :disabled="scope.row.zt != null"
                                    />
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ypyf" label="用法" min-width="70" label-class-name="first-red">
                            <template slot-scope="scope">
                                <div>
                                    <selectDown 
                                        v-model="scope.row.ypyf" 
                                        :ref="`${scope.$index}-5`"
                                        style="height: 32px;"
                                        :options="ypyfList"
                                        :is-search="true"
                                        option_label_filed="dn"
                                        option_value_filed="dv"
                                        :disabled="scope.row.zt != null"
                                    ></selectDown>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="gkfs" :label="$t('管控方式')" min-width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.gkfs | filterGkfs}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="zt" :label="$t('状态')" min-width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.zt | filterType}}</span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column :label="$t('common.action')" width="52" align="center">
                            <template slot-scope="scope">
                                <el-tooltip :content="$t('common.delete')" effect="light">
                                    <el-popconfirm
                                            :title="'确认删除？'"
                                            :confirmButtonText="$t('common.confirm')"
                                            :cancelButtonText="$t('common.cancel')"
                                            @confirm="handleDelete(scope)"
                                            hideIcon
                                            class="ml10"
                                    >
                                        <el-button slot="reference" class="red">
                                            <i class="icon his-del"></i>
                                        </el-button>
                                    </el-popconfirm>
                                </el-tooltip>
                            </template>
                        </el-table-column> -->
                    </el-table>
                    <!-- <pre style="position: absolute;bottom: 0">{{list}}</pre> -->
                </div>
            </el-col>
            <el-col :span="10" class="ht scroll-bar">
                <div class="his-module his-small ht scroll-bar">
                    <div class="row">
                        <div class="label">
                            <div class="searchTitle no-warp">抗菌药物申请单</div>
                            <el-divider direction="vertical"></el-divider>
                            <div class="btn">
                                <el-button size="mini" type="text" @click="saveApplyForm" :disabled="isEnable">
                                    <i class="icon his-btn-save green"></i>
                                    {{ $t('保存') }}
                                </el-button>
                            </div>
                        </div>
                    </div>
                    <div v-if="formData.sqlx == 1" class="scroll-bar">
                        <el-form :model="formData" ref="sylyForm" style="margin-top:8px" :rules="rules"
                                 label-width="120px">
                            <el-form-item :label="formData.fymc?formData.fymc:''+'使用理由'" prop="syly" style="width:100%"
                                          label-width="100px">
                                <div style="display: flex">
                                    <el-input type="textarea" :rows="3" v-model="formData.syly" placeholder=" "></el-input>
                                    <el-button type="text" @click="sylyVisible = true">引入</el-button>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div v-if="formData.sqlx == 2" class="scroll-bar" style="margin:0 auto;">
                        <el-form :model="formData" ref="sjysForm" style="margin-top:8px" :rules="rules" label-width="90px">
                            <el-form-item label="登录名" prop="loginName">
                                <el-select
                                    ref="loginNameRef"
                                    v-model="formData.loginName" 
                                    style="width: 60%" 
                                    placeholder="请选择"
                                    filterable
                                >
                                    <el-option v-for="(item,index) in kjywList" :key="index" :value="item.loginname" :label="item.personname"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="密码" prop="passwd">
                                <el-input v-model="formData.passwd" style="width: 60%" show-password placeholder=" "></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div v-if="formData.sqlx == 3" class="scroll-bar">
                        <req-form ref="reqForm" activeOrPassive='active' reqOrExamine='req' v-model="formData"/>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-dialog append-to-body class="scroll-bar narrow-dialog" :close-on-click-modal="false" :close-on-press-escape="false" title="抗菌药物使用理由引用" :visible.sync="sylyVisible" top="10vh" width="600px">
            <useReason ref="userReason" :key="sylyKey" @resetSyly="resetSyly"/>
            <span slot="footer" class="dialog-footer">
                <el-button @click="sylyVisible = false">{{ $t('common.cancel') }}</el-button>
                <el-button type="primary" @click="handleSylyConfirm">{{ $t('common.confirm') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch, Prop} from 'vue-property-decorator'
    import outpatientPrescription from '@/views/cis/op/dctwork/patients/components/model/outpatientPrescription.vue'
    import antibioticsReq from '@/views/cis/op/dctwork/patients/components/model/antibioticsReq.vue'
    import {getNow} from '@/api/his/basic'
    import {parseTime,isEmpty} from "@/utils";
    import reqForm from '@/views/cis/op/dctwork/patients/components/model/reqForm.vue'
    import {queryYfsb} from '@/api/cis/op/dctwork/pharmacySet'
    import {queryList, deleteById, addMedical, initVariable, saveSource,queryKjyw} from '@/api/his/im/residentDoctor/orderEntry'
    import {AxiosResponse} from "axios";
    import useReason from '@/views/cis/op/dctwork/patients/components/model/useReason.vue'
    const objMedical = {
        sqrq: '',
        ypmc: '',
        gkfs: '',
        zt: null,
        ypyf: '',
    }
    @Component({
        name: 'ApplyKjMedical',
        components: {
            outpatientPrescription,
            antibioticsReq,
            reqForm,
            useReason
        },
        filters: {
            filterGkfs(val: any) {
                switch (val.toString()) {
                    case "1":
                        return '使用理由'
                    case "2":
                        return '授权'
                    case "3":
                        return '申请单'
                }
            },
            filterType(val: any) {
                switch (val) {
                    case 0:
                        return '新单'
                    case 1:
                        return '已审核'
                    case 2:
                        return '会诊中'
                    case 3:
                        return '会诊完成'

                }
            }
        }
    })

    export default class extends Vue {
        @Prop({required: true}) private patientFile!: any
        // @Prop({required: true}) private pnParam!: any
        private listSlotHeight: number = 0
        private list: Array<any> = []
        private pnParam: any = {}
        private currParam: any = {}
        private deptId: string = Vue.prototype.AUTHORITY.bussinessRole
        private KSSDJ: number = 0 // 抗生素等级
        private sqlx: number = -1
        private kjywList: Array<any> = [] // 抗菌药物医生
        private sylyVisible: boolean = false
        private sylyKey: number = 0
        private ypyfList: Array<any> = [] // 药品用法数组
        private isEnable: boolean = true // 防止重复点击保存
        private lineData: any = {} // 表格行数据
        private rowIndex: number = -1 // 表格顺序号
        private isClick: boolean = true // 判断是否选中药品
        private isLoading: boolean = false // 防重复点击
        private gkfs: any = {
            isPermit: '',
            maxDay: '',
            maxDayMethod: ''
        }
        private formData: any = {
            sqlx: -1,
            shjg: '',
            ypList: []
        }  //传入对象
        private rules: any = {}
        private searchData: any = {
            cflx: [1,2],
            pageNum: 1,
            pageSize: 20,
            pydm: '',
            yfsb: '',
            cfid: 1,
            cfts: 1,
            djybz: 1
        }
        private searchSelectData: any = {
            yp: {
                cflx: this.searchData.cfid == 1 ? [1,2] : [3],
                yfsb: this.searchData.yfsb,
                showGb: 1,
                zfyp: 0,
                ksbz: 1
            },
            // zt: {
            //     ztlb: this.searchData.cflx,
            //     ksdm: Vue.prototype.AUTHORITY.outpatientCode
            // }
        }
        private resultTableHeader: any = {
            yp: [
                {
                    prop: 'ypmc',
                    label: '药品名称',
                    width: 250
                },
                {
                    prop: 'yfgg',
                    label: '药房规格',
                    width: 80
                },
                {
                    prop: 'yfdw',
                    label: '单位',
                    width: 50
                },
                {
                    prop: 'cdmc',
                    label: '药品产地',
                    width: 80
                },
                {
                    prop: 'lsjg',
                    label: '价格',
                    width: 50
                },
                {
                    prop: 'ypsl',
                    label: '库存',
                    width: 50
                }
            ],
            zt: [
                {
                    prop: 'ztmc',
                    label: '药品名称'
                }
            ]
        }

        created() {
            this.listSlotHeight = Vue.prototype.PageHeight - 221
        }

        mounted() {
            this.pnParam = this.$store.state.pnParam.PN_PARAM
            this.ypyfList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_METHOD_DICT : this.$store.state.webSqlDict.DRUG_METHOD_DICT
            console.log(this.pnParam)
            this.formData.jzxh = this.pnParam.jzxh
            this.formData.kh = this.pnParam.jzkh
            this.getList()
            this.getYfsb()
            this.getInitVariable()
            const form = {
                mzhm: this.patientFile.mzhm,
                brxm: this.patientFile.brxm,
                brxb: this.patientFile.brxb,
                csrq: this.patientFile.csny + " 00:00:00",
                rynl: this.patientFile.nl,
                brks: this.patientFile.ghks,
                mqzd: this.patientFile.fymc,
            }
            this.formData = Object.assign(this.formData, form)
        }

        handleQuery() {
            this.getList()
        }

        getList() {
            queryList({jzxh: parseInt(this.pnParam.jzxh)}).then((res: AxiosResponse) => {
                this.list = res.data
            })
        }

        getYfsb() {
            queryYfsb({pkey: this.deptId}).then((res: any) => {
                var cfList = res.data
                switch (this.searchData.cfid) {
                    case 1:
                        this.searchData.yfsb = cfList.xy
                        this.searchSelectData.yp.yfsb = cfList.xy
                        this.searchSelectData.yp.cflx = [1,2]
                        break
                    case 2:
                        this.searchData.yfsb = cfList.zy
                        this.searchSelectData.yp.yfsb = cfList.zy
                        this.searchSelectData.yp.cflx = 2
                        break
                    case 3:
                        this.searchData.yfsb = cfList.cy
                        this.searchSelectData.yp.yfsb = cfList.cy
                        this.searchSelectData.yp.cflx = [3]
                        break
                }
            })
        }

        getInitVariable() {
            initVariable({}).then((res: AxiosResponse) => {

                this.gkfs = {
                    isPermit: res.data.mzsfyxsykjyw,
                    maxDay: res.data.mzyxsyzdts,
                    maxDayMethod: res.data.mzctssygkfs,
                }

                this.formData.sqlx = this.gkfs.maxDayMethod
            })
            console.log('this.gkfs', this.gkfs)
        }

        private getRowClick(row: any) {
            this.rowIndex = row.index
            this.isClick = false
        }

        getNowDate() {
            return getNow().then((res: any) => {
                return parseTime(res.data, '{y}-{m}-{d}')
            })
        }

        // 添加
        async joinIn() {
            let num:number = this.list.length
            // 一次只能添加一条申请药
            if(this.list.length>0 && this.list[num-1].zt == null) {
                return
            }
            if(this.gkfs.isPermit == 1) {
                this.isEnable = false // 添加数据时，将保存按钮启用
                let cc = {...objMedical}
                let aa: any = await this.getNowDate()
                cc.sqrq = aa
                this.list.push(cc)
                this.rowIndex = this.list.length - 1
                this.$nextTick(()=> {
                    console.log('12位3')
                    ;(this.$refs[`${this.list.length-1}-1`] as any).focus()
                })
            } else {
                this.$message({
                    message: '不允许使用抗菌药物！',
                    type: 'warning'
                })
            }

            
        }

        setData(obj: any) {
            console.log(obj)
            if (this.gkfs.isPermit == 1) {
                obj.gkfs = this.gkfs.maxDayMethod
                this.currParam = {
                    ypmc: obj.ypmc,
                    ypxh: obj.ypxh,
                    ypgg: obj.yfgg,
                    ycsl: obj.ycjl,
                    yfdw: obj.yfdw,
                    ypyf_text: '',
                }
                console.log(432,this.currParam)
            }
            this.list[this.rowIndex].ypyf = obj.gyff
            this.KSSDJ = obj.kssdj
            this.$nextTick(()=>{
                ;(this.$refs[`${this.rowIndex}-2`] as any).focus()
            })
            this.getKjyList()
        }

        // getYpyf(obj: any) {
        //     this.formData.ypList[0].ypyf_text = obj.ypyf
        // }

        getGkfs(obj: any) {
            console.log('446',obj)
            if (obj.ts < this.gkfs.maxDay) {
                obj.gkfs = this.gkfs.maxDayMethod
                this.formData = Object.assign(this.formData, obj)
                // this.formData.ypList[0] = this.currParam
                // this.formData.ypList[0].sysj = obj.ts
            } else {
                obj.ts = null
                this.$message({
                    message: '申请天数不能大于' + this.gkfs.maxDay + '天',
                    type: 'warning'
                })
            }
        }

        saveApplyForm() {
            console.log(this.formData)
            this.formData.csrq = this.formData.csrq
            // 共用参数
            this.formData.mzhm = this.pnParam.jzlsh
            let num = this.list.length -1
            this.$set(this.list[num],"sysj",this.list[num].ts)
            this.formData.ypList = []
            this.list[num].ypxh = this.currParam.ypxh
            this.formData.ypList.push(this.list[num])
            this.$set(this.formData,'shjg','') 
            let tsList: Array<any> = []
            if (this.formData.gkfs == 3) {
                const applyForm: any = this.$refs.reqForm
                let a: any = applyForm.handleConfirm()
                if(!a) return
                // 申请单
                this.$set(this.formData,"usereason",this.formData.syly)
                addMedical(this.formData).then((res: AxiosResponse) => {
                    console.log('res', res)
                    this.$notify.success('保存成功')
                    this.getList()
                    ;(this.$refs.reqForm as any).clearForm()
                    ;(this.$refs.reqForm as any).init()
                    this.isEnable = true // 保存完禁用按钮，防止重复点击
                })
            } else if (this.formData.gkfs == 1) {
                // 使用理由
                this.$set(this.formData,"usereason",this.formData.syly)
                addMedical(this.formData).then((res: AxiosResponse) => {
                    console.log('res', res)
                    this.$notify.success('保存成功')
                    this.getList()
                    this.formData.syly = ''
                    this.isEnable = true
                })
            } else if (this.formData.gkfs == 2) {
                //    fixme: 上级密码确认
                this.$set(this.formData,'passWord',this.formData.passwd)
                addMedical(this.formData).then((res: AxiosResponse) => {
                    this.$notify.success('保存成功')
                    this.getList()
                    this.kjywList = []
                    this.formData.passwd = ''
                    this.formData.loginName = ''
                    this.isEnable = true
                })
                    
            }
            this.isClick = true
        }

        handleDelete() {

            if(this.isClick) return this.$message.warning('请选择需要删除的药品')
            if(this.list.length > 0 && this.list[this.rowIndex].id) {
                this.isLoading = true
                deleteById({id: this.list[this.rowIndex].id}).then((res: any) => {
                    if(res.errorCode == "SUCCESS") {
                        this.getList()
                        this.isEnable = true
                        this.isClick = true
                        this.isLoading = false
                        this.$notify.success('已删除')
                    }
                }).catch(()=> {
                    this.isLoading = false
                })
            } else {
                this.list.splice(this.rowIndex,1)
                this.isEnable = true // 删除行后再次禁用保存按钮
                this.isClick = true // 删除后需要重新选择
            }
            
        }

        // 查询抗菌药物权限医生列表
        private getKjyList() {
            const params: any = {
                kjywdj: this.KSSDJ,
                jgid: this.userInfo.hospitalId
            }
            queryKjyw(params).then((res: any) => {
                if(res.errorCode == "SUCCESS") {
                    this.kjywList = res.data
                }
            })
        }

        private handleSylyConfirm() {
            ;(this.$refs.userReason as any).confirmSelectSyly()
        }

        private resetSyly(valueArr: any) {
            let newStr = this.formData.syly
            valueArr.forEach((item: any) => {
              if (isEmpty(newStr)) {
                newStr = item.syly + ';'
              } else {
                newStr = newStr + item.syly + ';'
              }
            })
            this.formData.syly = newStr
            this.sylyVisible = false
        }

        get userInfo() {
            return JSON.parse(localStorage.userInfo)
        }

        // 为表格添加index序号
        private tableRowClassName({ row, rowIndex}: any) {
            row.index = rowIndex
        }

    }
</script>

<style lang="scss" scoped>
    .conmm {
        width: 100%;
        height: 100%;

        .el-col-10 {
            width: 50%;
        }
    }
</style>
