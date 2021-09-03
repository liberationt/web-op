<template>
    <div class="his-module">
        <div class="row">
            <div class="label">
                <h1 class="title">{{$t('hospitalDataDict.titleR2')}}</h1>
            </div>
            <div class="operate">
                <span class="plus-ico"></span>
            </div>
        </div>
        <div class='mt10 edit_dict_data scroll-bar' :style="{maxHeight:listSlotHeight+'px'}">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item v-for="item in columnData" :key="item.attrKey"  :label="item.cname" :prop="item.attrKey" >
                    <el-input v-if="item.dataType == 'string'" v-model="ruleForm[item.attrKey]" :disabled="editFlag == 'detil'"></el-input>
                    <el-input v-if="item.dataType == 'number'" type="number" v-model="ruleForm[item.attrKey]" :disabled="editFlag == 'detil' || item.attrKey == 'id'"></el-input>
                    <el-date-picker v-if="item.dataType == 'date'" value-format='yyyy-MM-dd HH:mm:ss' v-model="ruleForm[item.attrKey]" :disabled="editFlag == 'detil'" type="datetime" placeholder=" "> </el-date-picker>
                    <div  v-if="item.dataType == 'dict'" style="display:flex">
                        <div style="flex:1;padding-right:8px" ><el-input disabled  v-model="ruleForm[item.attrKey]"></el-input></div>
                        <div class="nomrbtn">
                            <el-button type="primary"  class="blue-gra" icon="icon his-caidanliebiao-more1" :disabled="editFlag == 'detil'" @click="handleOpenDictMod(item)"></el-button>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item  label=" " >
                    <div v-if="editFlag != 'detil'" class="form-footer">
                        <el-button style="height:34px;width:49%;display: inline;" @click="handleCancel">{{$t('common.cancel')}}</el-button>
                        <el-button type="primary" style="display: inline;width:49%" class="blue-gra" @click="handleConfirm">{{$t('common.confirm')}}</el-button>
                    </div>
                    <div v-else class="form-footer">
                        <el-button style="height:34px;width:100%;display: inline;" @click="handleCancel">{{$t('common.back')}}</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog :title="currItem.cname + $t('hospitalDataDict.choice')" :visible.sync="dialogVisible" width="800px" >
            <query-table
                ref="queryTable"
                listSlotHeight='400'
                :currItemL='currItemL'
                :typeValue='typeId'
                actionFlag='mod'
                :columnData='columnData'
                style="margin-bottom:25px"
                @selectRow='selectRow'
            />
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{$t('common.close')}}</el-button>
                <el-button type="primary" @click="dialogVisible = false" >{{$t('common.confirm')}}</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { deepCopy } from '@/utils'
import { useType_condition,addDictData,operationsType } from '@/api/his/dic/hospitalDataDict'
import queryTable from './queryTtable.vue'

@Component({
    name: 'edit',
    filters: {},
    components: {
        queryTable,
    },
})
export default class extends Vue {
	@Prop({ required: true }) private currItemL!: any // 左侧字典属性
	@Prop({ required: true }) private columnData!: any // 当前字典的属性列表
	@Prop({ required: true }) private editFlag!: string // 编辑标记
	@Prop({ required: false }) private rowData!: any // 当前行数据
    private currItem:any={} // 当前表单项（主要用作字典类内容）
    private listSlotHeight:number = 0
    private ruleForm:any = {} // 表单数据
    private rules:any = {}
    private typeId:string | number = ''
    private dialogVisible:boolean= false
    private attrKeyArr:Array<any> = []
    private currRow:any = {} // 弹窗表格勾选行数据

    created() {
        this.listSlotHeight = Vue.prototype.PageHeight-90
    }
    mounted() {
        this.init()
    }

    //数据监控
    @Watch("editFlag", { immediate: true })
    private onEditFlagChange(val: string) {
        console.log(val)
    }
    private init(){
        this.attrKeyArr = []
        this.columnData.forEach((element:any) => {
            this.attrKeyArr.push(element.attrKey)
        });
        this.columnData.forEach((element:any) => {
            this.$set(this.ruleForm,element.attrKey,null)
            if(!element.isNull){
                this.$set(
                    this.rules,
                    element.attrKey,
                    [{required: true, message: element.cname + window.ele.$i18n.t('hospitalDataDict.notNull'), trigger: 'change'}]
                )
            }
            // if(this.rowData.id == element.id) this.currRow = deepCopy(element)
        });
        this.resetForm('ruleForm')
        if(this.editFlag != 'add' && this.editFlag != 'addChild') {
            this.ruleForm = deepCopy(this.rowData)
        }
    }

    // 编辑完成事件    确定/取消   true/false
    private handleCancel(){
        this.$emit('editOk',false)
    }
    private handleConfirm(){
        (this.$refs.ruleForm as Form).validate((valid:any) => {
            if(valid) {
                const param = deepCopy(this.ruleForm)
                if(this.editFlag == 'add') {
                    if(param[this.currItem.attrKey] != '') this.$set(param,this.currItem.attrKey,this.currItem.referenceCode)
                    this.$set(param,'typeId',this.currItemL.id)
                    addDictData(param).then((res:any) => {
                        this.$emit('editOk',true)
                    })
                } else if (this.editFlag == 'edit') {
                    this.$set(param,'operationsType','update')
                    this.$set(param,'dataId',param.id)
                    operationsType(param).then((res:any) => {
                        this.$emit('editOk',true)
                    })
                } else if (this.editFlag == 'addChild') {
                    if(param[this.currItem.attrKey] != '') this.$set(param,this.currItem.attrKey,this.currItem.referenceCode)
                    this.$set(param,'typeId',this.currItemL.id)
                    this.$set(param,'operationsType','add_child')
                    this.$set(param,'dataId',this.rowData.id)
                    operationsType(param).then((res:any) => {
                        this.$emit('editOk',true)
                    })
                }
            }
        })
    }

    private handleOpenDictMod(item:any){
        this.typeId = item.typeValue
        this.currItem = item
        this.dialogVisible = true
    }
    // 单选行数据
    private selectRow(row:any){
        this.currRow = row
        var nowStr:string = ''
        if(row) {
            for(const k in row) {
                if(this.attrKeyArr.indexOf(k) != -1) {
                    console.log(row[k])
                    nowStr += row[k] + ','
                }
            }
            nowStr = nowStr.substr(0,nowStr.length-1)
        }
        this.$set(this.ruleForm,this.currItem.attrKey,nowStr)
    }
    // 清除表单校验
    private resetForm(formName:string) {
        if(this.$refs[formName] != undefined) {
            (this.$refs[formName] as Form).resetFields();
        }
    }
}
</script>
<style lang="scss" scoped>
    .form-dialog{
        width: 80%;
        margin: 0 auto;
    }
    .nomrbtn ::v-deep button .icon{
        margin-right: 0px;
    }
    .form-footer{
        margin-top:50px;
        display: flex;
    }
    .input1 ::v-deep{
        .el-input__inner{
            @include normal-input;
        }
    }
    .plus-ico{
        display:block;
        width:32px;
        height:32px;
        text-align:center;
        font-weight: bold;
        cursor: pointer;
    }
    .form-right{
        width: 60%;
    }
    .li_item{
        margin: 6px 0;
        display: block;
        width: 100%;
        height: 30px;
        font-size: 14px;
        cursor: pointer;
        line-height: 30px;
        padding:0 10px;
        .his-caidanliebiao-more1{
            color: #1485FF;
        }
    }
    .edit_dict_data{
        width: 50%;
        margin: auto;
        // border: 1px  solid red;
    }
</style>