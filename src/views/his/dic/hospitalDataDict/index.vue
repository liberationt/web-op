<template>
    <div class="content">
        <el-row class="ht" :gutter="10">
            <!-- 分组 -->
            <el-col class="ht" :span="5">
                <div class="his-module">
                    <div class="row">
                        <div class="label">
                            <h1 class="title">{{$t('hospitalDataDict.titleL')}}</h1>
                        </div>
                        <div class="operate">
                            <span class="plus-ico">
                                <i class="el-input__icon icon his-add" @click="clickAddGroup"></i>
                            </span>
                        </div>
                    </div>
                    <el-input  v-model="groupSearch.name" @keydown.enter.native="getGroupList" :placeholder="$t('hospitalDataDict.phleft')" class="input1 mb10" >
                        <i slot="prefix" class="el-input__icon icon his-search"></i>
                    </el-input>
                    <ul style="margin-top:16px">
                        <li class="li_item" v-for="(group,index) in  dictGroupList" :key="group.id" :class="{'backColor':currIndexL == index}" :value="group.id" @click="getDictList(group.id,index)">
                            {{group.name}}
                            <el-popover v-if="currIndexL == index" popper-class="hos"  placement="bottom" width="140" trigger="click">
                                <span class="li_item li_btn" @click="editDictGroup(group)" >{{$t('common.modify')}}</span>
                                <span class="li_item li_btn" @click="whetherDel(group,'l')" >{{$t('common.delete')}}</span>
                                <span v-if="currIndexL == index" slot="reference" class="more_ico" style="float:right">
                                    <i class="el-input__icon icon his-caidanliebiao-more1"></i>
                                </span>
                            </el-popover>
                        </li>
                    </ul>
                </div>
            </el-col>
            <!-- 字典 -->
            <el-col class="ht" :span="5">
                <div class="his-module">
                    <div class="row">
                        <div class="label">
                            <h1 class="title">{{$t('hospitalDataDict.titleC')}}</h1>
                        </div>
                        <div class="operate">
                            <span class="plus-ico">
                                <i class="el-input__icon icon his-add"  @click="clickAddDict"></i>
                            </span>
                        </div>
                    </div>
                    <el-input v-model="dictSearch.keywords" @keydown.enter.native="getDictListRef" :placeholder="$t('hospitalDataDict.phleft')" class="input1 mb10" >
                        <i slot="prefix" class="el-input__icon icon his-search"></i>
                    </el-input>
                    <pagenation-list
                        ref="dictPage"
                        data-url="/op-service/dict/config/type/list"
                        v-model="dictList"
                        :searchData="dictSearch"
                        :pageProps='pageProps'
                        prec='30'
					    :list-height='listSlotHeight'
                        http-method="post">
                        <div slot="list" class="scroll-bar" style="margin-top:8px" :style="{height:listSlotHeight+'px'}">
                            <ul>
                                <li class="li_item" v-for="(dict,index) in  dictList" :key="dict.id" :value="dict.id"  :class="{'backColor':currIndexC == index}" @click="getAttrTable(dict,index)">
                                    <span class="more_ico" style="margin-right:8px">
                                        <i v-if="dict.enable" class="el-input__icon icon his-qiyong"></i>
                                        <i v-else class="el-input__icon icon his-tingyong"></i>
                                    </span>
                                    {{dict.cname}}
                                    <el-popover v-if="currIndexC == index" popper-class="hos"  placement="bottom" width="140" trigger="click">
                                        <span class="li_item li_btn" @click="editDict(dict)" >{{$t('common.modify')}}</span>
                                        <span class="li_item li_btn" @click="whetherDel(dict,'c')" >{{$t('common.delete')}}</span>
                                        <span v-if="dict.enable" class="li_item li_btn" @click="stopOrStar(dict)" >{{$t('common.disable')}}</span>
                                        <span v-else class="li_item li_btn" @click="stopOrStar(dict)" >{{$t('common.enable')}}</span>
                                        <span class="li_item li_btn" @click="handleMove(dict)" >{{$t('common.move')}}</span>
                                        <span v-if="currIndexC == index" slot="reference" class="more_ico" style="float:right">
                                            <i class="el-input__icon icon his-caidanliebiao-more1"></i>
                                        </span>
                                    </el-popover>
                                </li>
                            </ul>
                        </div>
                    </pagenation-list>
                </div>
            </el-col>
            <!-- 配置 -->
            <el-col class="ht" :span="14">
                <div class="his-module">
                    <div class="row">
                        <div class="label">
                            <h1 class="title">{{$t('hospitalDataDict.titleR')}}</h1>
                        </div>
                        <div class="operate">
                            <el-button type="primary" class="blue-gra" icon="icon his-add" @click="clickAddAttr">{{$t('common.add')}}</el-button>
                        </div>
                    </div>
                    <el-input v-model="attrSearch.keywords" @keydown.enter.native="getAttrTable(currItemC,currIndexC)" style="width:188px" :placeholder="$t('hospitalDataDict.phleft')" class="input1 mb10" >
                        <i slot="prefix" class="el-input__icon icon his-search"></i>
                    </el-input>
                    <el-table :data="tableData" border stripe style="width: 100%" class="scroll-bar-x" :height="listSlotHeight+40">
                        <el-table-column fixed label="序号" width="80">
                            <template slot-scope="scope">
                                <div>{{scope.$index+1}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cname" label="属性名称" width="200"> </el-table-column>
                        <el-table-column prop="dataType" label="属性类型" width="100">
                            <template slot-scope="scope">
                                <div>{{dataTypeObj[scope.row.dataType] || '未定义'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="isEdit" label="是否可修改" width="120">
                            <template slot-scope="scope">
                                <div>{{scope.row.isEdit ? $t('hospitalDataDict.isYN1') : $t('hospitalDataDict.isYN2') }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="isNull" label="是否可空" width="120">
                            <template slot-scope="scope">
                                <div>{{scope.row.isNull ? $t('hospitalDataDict.isYN1') : $t('hospitalDataDict.isYN2') }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="isShow" label="是否查询列表显示" width="90">
                            <template slot-scope="scope">
                                <div>{{scope.row.isShow ? $t('hospitalDataDict.isYN1') : $t('hospitalDataDict.isYN2') }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="isQueryCondition" label="是否作为查询条件" width="90"><template slot-scope="scope">
                                <div>{{scope.row.isQueryCondition ? $t('hospitalDataDict.isYN1') : $t('hospitalDataDict.isYN2') }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="desc" label="属性说明" width="120"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="180">
                            <template slot-scope="scope">
                                <el-tooltip :content="$t('hospitalDataDict.up')">
                                    <el-button class="green" @click="attrOffset(scope.row,'up')" :disabled="scope.$index == 0">
                                        <i class="icon his-caozuo_xiangshang"></i>
                                    </el-button>
                                </el-tooltip>
                                <el-tooltip :content="$t('hospitalDataDict.down')">
                                    <el-button class="green ml10" @click="attrOffset(scope.row,'down')" :disabled="scope.$index == tableData.length-1">
                                        <i class="icon his-caozuo_xiangxia"></i>
                                    </el-button>
                                </el-tooltip>
                                <el-tooltip :content="$t('common.detail')">
                                    <el-button class="yellow ml10" @click="attrDetil(scope.row)">
                                        <i class="icon his-detail"></i>
                                    </el-button>
                                </el-tooltip>
                                <el-tooltip :content="$t('common.edit')">
                                    <el-button class="blue ml10" @click="editAttr(scope.row)">
                                        <i class="icon his-edit"></i>
                                    </el-button>
                                </el-tooltip>
                                <el-popconfirm title="你确定要删除吗？" hideIcon :confirmButtonText="$t('common.delete')" @confirm="delAttr(scope.row)">
                                    <el-button slot="reference" class="red ml10">
                                        <i :size='14' class='icon his-del' ></i>
                                    </el-button>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
        </el-row>
        <!-- 弹窗 -->
        <!-- 左 -->
        <el-dialog :title="$t('hospitalDataDict.dialogTitleL')" :visible.sync="dialogVisibleL" >
            <el-form :model="formDataL" ref="formDataL" :rules="formValidL" class="form-dialog" label-width="90px" >
                <el-form-item :label="$t('hospitalDataDict.formLItem1')" prop="name">
                    <el-input v-model="formDataL.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleL = false">{{$t('common.close')}}</el-button>
                <el-button type="primary" @click="confirmFormL" >{{$t('common.confirm')}}</el-button>
            </span>
        </el-dialog>
        <!-- 中 -->
        <el-dialog :title="$t('hospitalDataDict.dialogTitleC')" :visible.sync="dialogVisibleC" top='9vh' width='700px' >
            <el-form :model="formDataC" ref="formDataC" :rules="formValidC" class="form-dialog" label-width="80px" >
                <el-form-item :label="$t('hospitalDataDict.formCItem1')" prop="cname">
                    <el-input v-model="formDataC.cname" @blur="getPyWbCode"></el-input>
                </el-form-item>
                <el-form-item :label="$t('hospitalDataDict.formCItem2')" prop="ename">
                    <el-input v-model="formDataC.ename"></el-input>
                </el-form-item>
                <el-form-item :label="$t('hospitalDataDict.formCItem3')" prop="pyCode">
                    <el-input v-model="formDataC.pyCode"></el-input>
                </el-form-item>
                <el-form-item :label="$t('hospitalDataDict.formCItem4')" prop="wbCode">
                    <el-input v-model="formDataC.wbCode"></el-input>
                </el-form-item>
                <el-form-item :label="$t('hospitalDataDict.formCItem5')" prop="hisTargetTable">
                    <el-input v-model="formDataC.hisTargetTable"></el-input>
                </el-form-item>
                <el-form-item :label="$t('hospitalDataDict.formCItem6')" prop="desc">
                    <el-input type="textarea" :rows="2" v-model="formDataC.desc"></el-input>
                </el-form-item>
                <el-form-item :label="$t('hospitalDataDict.formCItem7')" prop="operationsCode">
                    <!-- @change="handleCheckedCitiesChange" -->
                    <el-checkbox-group v-model="operationsCode">
                        <el-checkbox v-for="operation in baseDict.operations" :label="operation.code" :key="operation.code">{{operation.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :label="$t('hospitalDataDict.formCItem8')" prop="operationLevel">
                    <el-radio-group v-model="formDataC.operationLevel">
                        <el-radio :label="0">医院不可修改（全部属性不可修改）</el-radio>
                        <el-radio :label="1">部分修改</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('hospitalDataDict.formCItem9')" prop="enable">
                    <el-radio-group v-model="formDataC.enable">
                        <el-radio :label="true">{{$t('common.enable')}}</el-radio>
                        <el-radio :label="false">{{$t('common.disable')}}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleC = false">{{$t('common.close')}}</el-button>
                <el-button type="primary" @click="confirmFormC" >{{$t('common.confirm')}}</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="$t('hospitalDataDict.dialogTitleM')" :visible.sync="dialogVisibleM" >
            <el-form :model="formDataM" ref="formDataM" :rules="formValidM" class="form-dialog" label-width="120px" >
                <el-form-item :label="$t('hospitalDataDict.formMItem1')" prop="name">
                    <el-input v-model="formDataM.name" disabled></el-input>
                </el-form-item>
                <el-form-item :label="$t('hospitalDataDict.formMItem2')" prop="groupId">
                    <el-select v-model="formDataM.groupId" placeholder=" " style="width:100%">
                        <el-option v-for="item in dictGroupList_FB" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleM = false">{{$t('common.close')}}</el-button>
                <el-button type="primary" @click="confirmFormM" >{{$t('common.confirm')}}</el-button>
            </span>
        </el-dialog>
        <!-- 右 -->
        <el-dialog class="scroll-bar" :title="$t('hospitalDataDict.dialogTitleR')" :visible.sync="dialogVisibleR" top='8vh' width='700px' >
            <!-- <div style="max-height: 600px;overflow-y:auto;width:100%"> -->
                <el-form :model="formDataR" ref="formDataR" :rules="formValidR" class="form-dialog" label-width="80px"  >
                    <el-form-item :label="$t('hospitalDataDict.formRItem1')" prop="attrKey">
                        <el-input v-model="formDataR.attrKey" :disabled="detilFlag"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('hospitalDataDict.formRItem2')" prop="cname">
                        <el-input v-model="formDataR.cname" :disabled="detilFlag"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('hospitalDataDict.formRItem3')" prop="ename">
                        <el-input v-model="formDataR.ename" :disabled="detilFlag"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('hospitalDataDict.formRItem4')" prop="dataType">
                        <el-select v-model="formDataR.dataType" placeholder=" " style="width:100%" :disabled="detilFlag">
                            <el-option v-for="item in baseDict.dataType" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="formDataR.dataType == 'dict'" :label="$t('hospitalDataDict.formRItem5')" prop="typeValue">
                        <el-select v-model="formDataR.typeValue" placeholder=" " style="width:100%" @change="dictListChange" :disabled="detilFlag">
                            <el-option v-for="item in dictList" :key="item.id+''" :label="item.cname" :value="item.id+''"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="formDataR.dataType == 'dict'" :label="$t('hospitalDataDict.formRItem6')" prop="referenceCode">
                        <el-select v-model="formDataR.referenceCode" placeholder=" " style="width:100%" :disabled="detilFlag">
                            <el-option v-for="item in dictListDataType" :key="item.attrKey+''" :label="item.cname" :value="item.attrKey+''"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('hospitalDataDict.formRItem7')" prop="isEdit">
                        <el-radio-group v-model="formDataR.isEdit" :disabled="detilFlag">
                            <el-radio :label="true">{{$t('hospitalDataDict.isYN1')}}</el-radio>
                            <el-radio :label="false">{{$t('hospitalDataDict.isYN2')}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('hospitalDataDict.formRItem8')" prop="isNull">
                        <el-radio-group v-model="formDataR.isNull" :disabled="detilFlag">
                            <el-radio :label="true">{{$t('hospitalDataDict.isYN1')}}</el-radio>
                            <el-radio :label="false">{{$t('hospitalDataDict.isYN2')}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('hospitalDataDict.formRItem9')" prop="isShow" label-width="240px">
                        <el-radio-group v-model="formDataR.isShow" :disabled="detilFlag">
                            <el-radio :label="true">{{$t('hospitalDataDict.isYN1')}}</el-radio>
                            <el-radio :label="false">{{$t('hospitalDataDict.isYN2')}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('hospitalDataDict.formRItem10')" prop="isQueryCondition" label-width="150px">
                        <el-radio-group v-model="formDataR.isQueryCondition" :disabled="detilFlag">
                            <el-radio :label="true">{{$t('hospitalDataDict.isYN1')}}</el-radio>
                            <el-radio :label="false">{{$t('hospitalDataDict.isYN2')}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('hospitalDataDict.formRItem11')" prop="desc">
                        <el-input type="textarea" :rows="2" v-model="formDataR.desc" :disabled="detilFlag"></el-input>
                    </el-form-item>
                    <!-- <el-form-item :label="$t('hospitalDataDict.formRItem9')" prop="enable">
                        <el-radio-group v-model="formDataR.enable">
                            <el-radio :label="1">{{$t('common.enable')}}</el-radio>
                            <el-radio :label="2">{{$t('common.disable')}}</el-radio>
                        </el-radio-group>
                    </el-form-item> -->
                </el-form>
            <!-- </div> -->
            <span slot="footer" class="dialog-footer" v-if="!detilFlag">
                <el-button @click="dialogVisibleR = false">{{$t('common.close')}}</el-button>
                <el-button type="primary" @click="confirmFormR" >{{$t('common.confirm')}}</el-button>
            </span>
        </el-dialog>

        <!-- 删除 -->
        <el-dialog  :title="$t('hospitalDataDict.dialogTitleDeL')" :visible.sync="delVisible" width="400">
            <span style="display:block;margin-bottom:24px">{{$t('hospitalDataDict.dialogTipsDeL')+`【${currItem.name || currItem.cname}】？`}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">{{$t('common.cancel')}}</el-button>
                <el-button type="primary" @click="currItemDel">{{$t('common.delete')}}</el-button>
            </span>
        </el-dialog>
        <!-- 停用启用 -->
        <el-dialog  :title="$t('hospitalDataDict.dialogTitleDeL')" :visible.sync="stopVisible" width="400">
            <span v-if="currItem.enable"  style="display:block;margin-bottom:24px">{{$t('hospitalDataDict.dialogTipsStop')+`【${currItem.cname}】？`}}</span>
            <span v-else style="display:block;margin-bottom:24px">{{$t('hospitalDataDict.dialogTipsStar')+`【${currItem.cname}】？`}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stopVisible = false">{{$t('common.cancel')}}</el-button>
                <el-button v-if="currItem.enable" type="primary" @click="currItemStop">{{$t('common.disable')}}</el-button>
                <el-button v-else type="primary" @click="currItemStop">{{$t('common.enable')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { deepCopy } from '@/utils'
import {
    getBaseDict,
    addDictGroup,
    queryDictGroup,
    delDictGroup,
    editDictGroup,
    addDict,
    editDict,
    delDict,
    typeChangeStatus,
    getAttrList,
    addAttrList,
    editAttrList,
    delAttrList,
    checkAttrKey,
    attrOffset,
    moveDictGroup,
    createPyWb
} from '@/api/his/dic/hospitalDataDict'

@Component({
    name: 'hospitalDataDict',
    filters: {}
})

export default class extends Vue {
    private groupSearch: any = {
        name: ''
    }
    private dictGroupList:any = []
    private dictGroupList_FB:any = []
    private operationsCode:Array<string|number> = []
    private dictSearch: any = {
        groupId: '',
        keywords:''
    }
    private dictList:any = []
    private attrSearch: any = {
        keywords: ''
    }
    private currItem:any = {}
    private listSlotHeight:number = 0
    private pageProps: object = {"layout":"prev, pager, next"}
    dialogVisibleL: boolean = false
    dialogVisibleC: boolean = false
    dialogVisibleM: boolean = false // 移动弹窗 （ 后加 ）
    dialogVisibleR: boolean = false

    private delVisible: boolean = false
    private stopVisible: boolean = false

    // 左表单
    private formDataL: any = {}
    private formValidL: any = {
        name:[{required: true, message: window.ele.$i18n.t('hospitalDataDict.formValidLName'), trigger: 'change'}]
    }
    private isUpdL:boolean = false
    private currIndexL:number = 0

    // 中表单
    private formDataC: any = {}
    private formValidC: any = {
        cname:[{required: true, message: window.ele.$i18n.t('hospitalDataDict.formValidCName'), trigger: 'change'}],
        ename:[{required: true, message: window.ele.$i18n.t('hospitalDataDict.formValidEName'), trigger: 'change'}],
        pyCode:[{required: true, message: window.ele.$i18n.t('hospitalDataDict.formValidPyCode'), trigger: 'change'}],
        wbCode:[{required: true, message: window.ele.$i18n.t('hospitalDataDict.formValidWbCode'), trigger: 'change'}],
        hisTargetTable:[{required: true, message: window.ele.$i18n.t('hospitalDataDict.formValidTable'), trigger: 'change'}]
    }
    private formDataM: any = {}
    private formValidM: any = {
        groupId:[{required: true, message: window.ele.$i18n.t('hospitalDataDict.formValidMGroupId'), trigger: 'change'}],
    }
    private isUpdC:boolean = false
    private currItemC:any = {}
    private currIndexC:number = 0
    // 右表单
    private formDataR: any = {}
    private validateAttrKey = (rule: any, value: any, callback: any) => {
        if (value) {
            this.checkAttrKey(value,callback)
        } else {
            callback()
        }
    }
    private formValidR: any = {
        attrKey:[{required: true, message: window.ele.$i18n.t('hospitalDataDict.formValidAttrKey'), trigger: 'change'},
        { validator: this.validateAttrKey, trigger: 'blur' }],
        cname:[{required: true, message: window.ele.$i18n.t('hospitalDataDict.formValidCName'), trigger: 'change'}],
        ename:[{required: true, message: window.ele.$i18n.t('hospitalDataDict.formValidEName'), trigger: 'change'}],
        dataType:[{required: true, message: window.ele.$i18n.t('hospitalDataDict.formValidDataType'), trigger: 'change'}],
        referenceCode:[{required: true, message: window.ele.$i18n.t('hospitalDataDict.formValidDataType'), trigger: 'change'}],
        typeValue:[{required: true, message: window.ele.$i18n.t('hospitalDataDict.formValidDataType'), trigger: 'change'}],
    }
    private tableData:Array<any> = []
    private dictListDataType:Array<any> = []
    private isUpdR:boolean = false
    private detilFlag:boolean = false
    private baseDict:any = {}
    private dataTypeObj:any = {'string':'字符串','number':'数值','date':'时间','dict':'字典'}
    created() {
        this.listSlotHeight = Vue.prototype.PageHeight-164
    }

    mounted() {
        this.init()
    }

    //数据监控
    @Watch("dictList", { immediate: true })
    private onDictListChange(val: string) {
        if(this.dictList[this.currIndexC]!=undefined) this.getAttrTable(this.dictList[this.currIndexC],this.currIndexC)
        else {
            if(this.dictList.length == 0 ) this.tableData = []
            else {
                this.currIndexC = 0
                this.getAttrTable(this.dictList[this.currIndexC],this.currIndexC)
            }
        }
    }

    private async init(){
        getBaseDict().then((res:any) => {
            this.baseDict = res.data
        })
        await this.getGroupList()
        if(this.dictGroupList.length!=0) this.getDictList(this.dictGroupList[0].id,0)
    }
    // 获取分组列表
    private getGroupList (){
        return new Promise((resolve, reject)=>{
            queryDictGroup(this.groupSearch).then((res:any) => {
                this.dictGroupList = res.data
                this.currItem = {}
                resolve(res.data)
            })
        })

    }
    // 获取字典列表
    private getDictList(id:string|number,index:number){
        this.dictSearch.groupId = id
        this.currIndexL = index
        this.getDictListRef()
    }
    private getDictListRef(){
        const dictPage : any = this.$refs.dictPage
        dictPage.getList()
    }

    // 获取属性表格
    private getAttrTable(dict:any,index:number){
        this.currItemC = dict
        this.currIndexC = index
        getAttrList({typeId:dict.id,keywords:this.attrSearch.keywords}).then((res:any) => {
            this.tableData = res.data
        })
    }

    // 新增字典分组
    private clickAddGroup(){
        this.isUpdL = false
        this.formDataL = { name : ''}
        this.resetForm('formDataL')
        this.dialogVisibleL = true
    }

    // 字典分组编辑提交
    private confirmFormL(){
        (this.$refs.formDataL as Form).validate((valid:any) => {
            if(valid) {
                if(this.isUpdL){
                    editDictGroup(this.formDataL).then(async (res:any) => {
                        await this.getGroupList()
                        this.dialogVisibleL = false
                        this.succTips(this.$t('hospitalDataDict.succtipL'))
                    })
                }else{
                    addDictGroup({name:this.formDataL.name}).then(async (res:any)=> {
                        await this.getGroupList()
                        this.dialogVisibleL = false
                        this.succTips(this.$t('hospitalDataDict.succtipL'))
                    })
                }
            }
        })
    }

    // 修改字典分组
    private editDictGroup(group:any){
        this.isUpdL = true
        this.formDataL = {id:group.id,name:group.name}
        this.dialogVisibleL = true
    }

    // 删除字典分组
    private delDictGroup(group:any){
        delDictGroup(group.id).then(async (res:any) => {
            await this.getGroupList()
            this.delVisible = false
            this.succTips(this.$t('hospitalDataDict.deltipL'))
        })
    }

    // 移动字典点击
    handleMove(dict:any){
        this.formDataM = {}
        this.dictGroupList_FB = []
        const group = this.dictGroupList.filter( (item:any) => { return dict.groupId == item.id })
        this.dictGroupList.forEach((element:any) => {
            if(dict.groupId == element.id) this.formDataM.name = element.name
            else this.dictGroupList_FB.push(element)
        });
        this.resetForm('formDataM')
        this.dialogVisibleM = true
    }
    // 移动字典提交
    private confirmFormM(){
        (this.$refs.formDataM as Form).validate((valid:any) => {
            if(valid) {
                moveDictGroup({typeId:this.currItemC.id,groupId:this.formDataM.groupId}).then((res:any) => {
                    this.getDictList(this.dictSearch.groupId,this.currIndexL)
                    this.dialogVisibleM = false
                    this.succTips(this.$t('hospitalDataDict.succtipL'))
                })
            }
        })
    }

    // 新增字典
    private clickAddDict(){
        this.isUpdC = false
        this.operationsCode = []
        this.formDataC = {
            enable:true,
            operationLevel:0
        }
        // this.formDataC.enable = true
        // this.formDataC.operationLevel = 0
        this.resetForm('formDataC')
        this.dialogVisibleC = true
    }
    // 修改字典
    private editDict(group:any){
        this.isUpdC = true
        this.formDataC = deepCopy(group)
        this.operationsCode = this.formDataC.operationsCode ? this.formDataC.operationsCode.split(',') : []
        this.dialogVisibleC = true
    }
    // 获取拼音码五笔码
    private getPyWbCode(){
        if(this.formDataC.cname){
            createPyWb({name:this.formDataC.cname}).then((res:any) => {
                this.$set(this.formDataC, 'pyCode', res.data.pyCode)
                this.$set(this.formDataC, 'wbCode', res.data.wbCode)
            })
        }
    }
    // 字典类型编辑提交
    private confirmFormC(){
        (this.$refs.formDataC as Form).validate((valid:any) => {
            if(valid) {
                this.formDataC.operationsCode = this.operationsCode.join(',')
                if(this.isUpdC){
                    editDict(this.formDataC).then(async (res:any) => {
                        this.getDictList(this.dictSearch.groupId,this.currIndexL)
                        this.dialogVisibleC = false
                        this.succTips(this.$t('hospitalDataDict.succtipL'))
                    })
                }else{
                    this.formDataC.groupId = this.dictSearch.groupId
                    addDict(this.formDataC).then(async (res:any)=> {
                        this.getDictList(this.dictSearch.groupId,this.currIndexL)
                        this.dialogVisibleC = false
                        this.succTips(this.$t('hospitalDataDict.succtipL'))
                    })
                }
            }
        })
    }

    // 删除字典
    private delDict(dict:any){
        delDict(dict.id).then((res:any) => {
            this.getDictList(this.dictSearch.groupId,this.currIndexL)
            this.delVisible = false
            this.succTips(this.$t('hospitalDataDict.deltipL'))
        })
    }

    // 新增属性
    private clickAddAttr(){
        this.isUpdR = false
        this.detilFlag = false
        this.formDataR = {
            isEdit:true,
            isNull:true,
            isQueryCondition:true,
            isShow:true,
        }
        this.resetForm('formDataR')
        this.dialogVisibleR = true
    }
    // 字典类型改变 (可能会有bug)
    private dictListChange(id:number,flag:boolean = false,attrKey:string = ''){
        this.dictListDataType = []
        this.$set(this.formDataR, 'referenceCode', null)
        getAttrList({typeId:id}).then((res:any) => {
            this.dictListDataType = res.data
            if(flag) this.$set(this.formDataR, 'referenceCode', attrKey)
        })
    }

    private editAttr(attr:any){
        this.isUpdR = true
        this.detilFlag = false
        this.formDataR = deepCopy(attr)
        if(this.formDataR.dataType == 'dict'){
            this.dictListChange(this.formDataR.typeValue,true,this.formDataR.referenceCode)
        }
        this.resetForm('formDataR')
        this.dialogVisibleR = true
    }
    private attrDetil(attr:any){
        this.detilFlag = true
        this.formDataR = deepCopy(attr)
        if(this.formDataR.dataType == 'dict'){
            this.dictListChange(this.formDataR.typeValue,true,this.formDataR.referenceCode)
        }
        this.resetForm('formDataR')
        this.dialogVisibleR = true
    }
    checkAttrKey(value:string,callback:any){
        const nowData = {
            attrId:this.isUpdR ? this.formDataR.id : '',
            attrKey:value,
            typeId:this.currItemC.id
        }
        checkAttrKey(nowData).then((res: any) => {
            if (res.data.usable) {
                callback()
            } else {
                callback(new Error(window.ele.$i18n.t('hospitalDataDict.validateAttrKey')))
            }
        })
    }

    // 字典类型属性编辑提交
    private confirmFormR(){
        (this.$refs.formDataR as Form).validate((valid:any) => {
            if(valid) {
                if(this.isUpdR){
                    editAttrList(this.formDataR).then((res:any) => {
                        this.getAttrTable(this.currItemC,this.currIndexC)
                        this.dialogVisibleR = false
                        this.succTips(this.$t('hospitalDataDict.succtipL'))
                    })
                }else{
                    this.formDataR.typeId = this.currItemC.id
                    addAttrList(this.formDataR).then((res:any) => {
                        this.getAttrTable(this.currItemC,this.currIndexC)
                        this.dialogVisibleR = false
                        this.succTips(this.$t('hospitalDataDict.succtipL'))
                    })
                }
            }
        })
    }

    // 删除属性
    private delAttr(attr:any){
        delAttrList(attr.id).then(res=> {
            this.getAttrTable(this.currItemC,this.currIndexC)
            this.dialogVisibleR = false
            this.succTips(this.$t('hospitalDataDict.deltipL'))
        })
    }

    attrOffset(attr:any,offsetType:string){
        attrOffset({attrId:attr.id,offsetType}).then((res:any) => {
            this.getAttrTable(this.currItemC,this.currIndexC)
            this.succTips(this.$t('hospitalDataDict.succtipL'))
        })
    }

    // 删除提示
    private whetherDel(item:any,flag:string){
        this.currItem = item
        this.currItem.lcrFlag = flag
        this.delVisible = true
    }
    // 停用启用
    private stopOrStar(item:any){
        this.currItem = item
        this.stopVisible = true
    }
    // 删除确认
    private currItemDel(){
        switch(this.currItem.lcrFlag) {
            case 'l':
                this.delDictGroup(this.currItem)
            break;
            case 'c':
                this.delDict(this.currItem)
            break;
        }
    }

    // 停用确认
    private currItemStop(){
        typeChangeStatus(this.currItem.id).then((res:any) => {
            this.getDictList(this.dictSearch.groupId,this.currIndexL)
            this.stopVisible = false
            this.succTips(this.$t('hospitalDataDict.succtipL'))
        })
    }

    // 清除表单校验
    private resetForm(formName:string) {
        if(this.$refs[formName] != undefined) {
            (this.$refs[formName] as Form).resetFields();
        }
    }
    // 右侧提示
    private succTips(tips:any){
        this.$notify({
            title: tips +"",
            message: '',
            type: 'success'
        });
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
    .plus-ico{
        display:block;
        width:32px;
        height:32px;
        text-align:center;
        font-weight: bold;
        cursor: pointer;
    }
    .more_ico{
        display:inline-block;
        width:32px;
        height:32px;
        text-align:center;
        margin-top: -5px;
        cursor: pointer;
    }
    .his-qiyong{
        color: rgba(20,133,255,1);
        width:12px;
        height:12px;
        background:rgba(20,133,255,0.1);
        border:1px solid rgba(20,133,255,1);
        border-radius: 50%;
        padding: 2px 3px;
        font-size: 12px;
    }
    .his-tingyong{
        color:rgba(249,87,118,1);
        width:12px;
        height:12px;
        background:rgba(249,87,118,0.1);
        border:1px solid rgba(249,87,118,1);
        border-radius: 50%;
        padding: 2px 3px;
        font-size: 12px;
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
    .li_btn{
        text-align: center;
    }
    .li_item:hover{
        background:rgba(20,133,255,0.1);
        border-radius:4px;
    }
    .backColor{
        background:rgba(20,133,255,0.1);
        border-radius:4px;
    }
</style>
<style lang="scss">
    .hos{
        padding:0 8px
    }
</style>
