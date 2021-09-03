<!--
 * @Date: 
 * @LastEditTime: 2020-09-09 11:25:42
 * @Description: 静脉配置药房设置
 * @FilePath: \web-op\src\views\his\inject\infusiondrugs\Basics\pharmacyConfiguratio\index.vue
-->

<template>
  <div class="content opertionIncome">
    <el-row :gutter="10" class="ht">
      <el-col :span="16" class="ht">
        <div class="his-module his-small">
          <div class="row">
            <div class="title">静脉配置药房设置</div>
            <div class="operate">
              <el-button size="mini" type="primary" class="blue-gra" @click="handleAdd">新增</el-button>
            </div>
          </div>
          <el-table
            :data="tableFormat"
            ref="table"
           :highlight-current-row="true"
            border
            stripe
            :height="listSlotHeight- 73"
            class="no-underline scroll-bar"
            @row-click="handleSelRow"
          >
            <el-table-column type="index" :label="$t(' ')" width="32"></el-table-column>
            <el-table-column prop="yfmc" :label="$t('药房')"></el-table-column>
            <el-table-column prop="scgz" :label="$t('条码生成规则')"></el-table-column>
            <el-table-column prop="gzqz" :label="$t('前缀')"></el-table-column>
            <el-table-column prop="lshws" :label="$t('流水号位数')"></el-table-column>
            <el-table-column prop="xylsh" :label="$t('下一流水号')"></el-table-column>
            <el-table-column prop="zt" :label="$t('状态')" width="80">
              <template slot-scope="scope">
                <em :class="scope.row.zt == 1? 'blue':'reds'">{{scope.row.zt == 1 ? '启用':'停用'}}</em>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column :label="$t('table.actions')" width="80" align="center">
              <template slot-scope="scope">
                <!-- 启用、停用 -->
                <el-tooltip :content="scope.row.zt == 1 ? $t('common.enabled') : $t('common.disabled')" effect="light">
                  <el-popconfirm
                    hideIcon
                    :confirmButtonText="scope.row.zt == 1 ? $t('common.disable') : $t('common.enable')"
                    :cancelButtonText="$t('common.cancel')"
                    :title="scope.row.zt == 1 ? $t('common.disableTip') : $t('common.enableTip')"
                    @confirm="handleUpdateStatus(scope.row)"
                  >
                    <el-button slot="reference" class="red mr10">
                      <i :class="scope.row.zt == 1 ? 'icon his-disabled' : 'icon his-automated'" />
                    </el-button>
                  </el-popconfirm>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col class="ht" :span="8">
        <div class="his-module his-small ht">
          <div slot="header" class="row">
            <div class="label">
              <h1 class="title"> {{this.isJudge ? $t('common.add') : $t('common.edit')}} </h1>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                class="green-gra"
                size="mini"
                icon="icon his-save"
                :disabled="forms.zt == 1"
                @click="handleSave"
              >{{$t('common.save')}}</el-button>
            </div>
          </div>
          <el-form
            :model="forms"
            :rules="rules"
            label-width="100px"
            ref="yfForm"
            style="padding:0px 30px"
          >
            <el-form-item :label="'静配药房'" prop="yfsb">
              <el-select v-model="forms.yfsb" class="outbound" placeholder="请选择药房">
                <el-option v-for="item in jpyfList" :key="item.label" :label="item.name" :value="item.label"></el-option>  
              </el-select>
            </el-form-item>
            <el-form-item :label="'条码生成规则'" prop="scgz">
              <el-select v-model="forms.scgz" class="outbound" placeholder="请选择条码生成归规则">
                <el-option v-for="item in tmscgzList" :key="item.label" :label="item.name" :value="item.label"></el-option>  
                <el-option label="年+顺序号" :value="'1'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="'前缀'" prop="gzqz">
              <el-input v-model="forms.gzqz" placeholder="请输入前缀"></el-input>
            </el-form-item>
            <el-form-item :label="'流水号位数'" prop="lshws">
              <el-input v-model="forms.lshws" placeholder="请输入流水号位数"></el-input>
            </el-form-item>
            <el-form-item :label="'下一流水号'" prop="xylsh">
              <el-input v-model="forms.xylsh" placeholder="请输入下一流水号" disabled></el-input>
            </el-form-item>
            <el-form-item :label="'状态'" prop="zt">
              <el-select v-model="forms.zt" class="outbound" placeholder="请选择状态">
                <el-option v-for="item in statusList" :key='item.label' :label="item.name" :value="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang='ts' >
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { 
  Iforms,
  queryList,
  queryJpDict,
  configGet,
  configSave,
  updateStatus
} from '@/api/his/inject/infusiondrugs/pharmacyConfiguratio.ts'
import { formatInt, id2Name } from '@/utils'
import { Script } from 'vm'
import { type } from 'os'
@Component({
  name: 'pharmacyConfiguratio',
  components: {},
})
export default class extends Vue {
  private listSlotHeight: number = 0 //列表高度
  private isJudge: boolean = true //新增or编辑
  private drugStoreList: Array<any> = [] // 药房列表
  private tableData: Array<any> = [] // 药房设置列表
  private forms: Iforms = {
    id: null,
    yfsb: null,
    scgz: null,
    gzqz: null,
    lshws: null,
    xylsh: null,
    zt: null
  }
  private jpyfList: Array<any> = [] // 静配药房列表  
  private tmscgzList: Array<any> = [] // 条码生成列表  
  private statusList: Array<any> = [
    {
      label: 1,
      name: '启用'
    },
    {
      label: 0,
      name: '停用'
    }
  ] // 状态列表  

  private validLshws: any = (rule: any, value: any, callback: any) => {
    console.log((/(^[1-9]\d*$)/.test(value)));
    if((/(^[1-9]\d*$)/.test(value))){
      if(value >=4 && value <= 10){
        callback()
      }else{
        this.forms.lshws = null
        callback(new Error('流水号位数应为4-10的正整数'))
      }
    }else{
      this.forms.lshws = null
      callback(new Error('流水号位数应为4-10的正整数'))
    }
  }

  private rules: any = {
    yfsb: [{ required: true, message: '请选择静配药房', trigger: 'blur' }],
    scgz: [{ required: true, message: '请选择条码生成规则', trigger: 'blur' }],
    lshws: [
      { required: true, message: '请输入流水号位数', trigger: 'blur' },
      { validator: this.validLshws, trigger: 'blur' }
    ],
    zt: [{ required: true, message: '请选择状态', trigger: 'blur' }],
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
    // 获取药房字典 drugStoreList
    this.drugStoreList = this.$store.state.webSqlDict.SUPER_PHA_DICT
  }

  mounted() {
    this.getList()
    let param: any = {}
    this.queryJp(param)
  }

  get tableFormat() {
    id2Name(this.tableData,'yfsb','yfmc',this.drugStoreList,'dv','dn')
    return this.tableData
  }

 /*@methods: getList
   *@description: 查询药房静配配置列表
   */
  private getList(){
      queryList({}).then((res: any) => {
        if(res.errorCode="SUCCESS"){
          this.tableData = res.data
          if(this.tableData.length>0){
            let data = this.tableData[0];
            this.$nextTick(() => {
              (this.$refs.table as any).setCurrentRow(data)
            })
            let param: any = {
              yfsb: data.yfsb
            }
            this.queryJp(param)
            this.configGet(data.id)
          }
        }
      })
  }

  /*@methods: queryJp
   *@description: 查询静配所需字典
   */
  private queryJp(data: any){
    queryJpDict(data).then((res: any) => {
      if(res.errorCode=='SUCCESS'){
        this.jpyfList = []
        this.tmscgzList = []
        // 遍历静配药房转化静配药房数组
       for (let key in res.data.yfMap) {
         let obj: any = {}
         obj.label = Number(key)
        //  obj.label = key
         obj.name = res.data.yfMap[key]
         this.jpyfList.push(obj);
        }
        // 遍历条码生成规则转化条码生成规则数组
        for (let key in res.data.gzMap) {
         let obj: any = {}
         obj.label = key
         obj.name = res.data.gzMap[key]
         this.tmscgzList.push(obj);
        }
      }
    })
  }

  /*@methods: handleAdd
   *@description: 新增
   */
  private handleAdd() {
    this.isJudge = true;
    (this.$refs.yfForm as any).resetFields()
    this.forms.id = null
    this.forms.xylsh = 1
    let param: any = {}
    this.queryJp(param)
  }
  
  /*@methods: handleSelRow
   *@description: 选择静脉配置药房设置一条数据
   */
  private handleSelRow(data: any) {
    this.isJudge = false
    let param: any = {
      yfsb: data.yfsb
    }
    this.queryJp(param)
    this.configGet(data.id)
  }

  /*@methods: configGet
   *@description: 获取详情
   */
  private configGet(id: number){
    configGet({id: id}).then((res:any) => {
      if(res.errorCode=='SUCCESS'){
        (this.$refs.yfForm as any).resetFields()
        this.forms = Object.assign(this.forms, res.data)
      }
    })
  }

  /*@methods: handleSave
   *@description: 保存
   */
  private handleSave() {
     (this.$refs.yfForm as any).validate((valid: any) => {
       if(valid){
         configSave(this.forms).then((res: any) => {
           if(res.errorCode=='SUCCESS'){
             this.$notify({
                title: this.isJudge ? '新增成功！':'编辑成功！',
                message: '',
                type: 'success',
              })
              this.getList()
           }
         })
       }
     })
  }
  
  /*@methods: handleOk
   *@description: 停用、启用
   */
  private handleUpdateStatus(data: any){
    updateStatus({id: data.id}).then((res: any) => {
      if(res.errorCode=='SUCCESS'){
        if(data.zt == 1){
          this.$notify({
            title: '停用成功！',
            message: '',
            type: 'success',
          })
          this.getList()
        }else{
          this.$notify({
            title: '启用成功！',
            message: '',
            type: 'success',
          })
          this.getList()
        }
      }
    })
  }
  
}
</script>

<style lang='scss' scoped></style>