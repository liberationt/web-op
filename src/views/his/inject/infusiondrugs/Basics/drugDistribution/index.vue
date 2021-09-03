<!--
 * @Date: 
 * @LastEditTime: 2020-09-09 11:26:22
 * @Description: 发药批次设置
 * @FilePath: \web-op\src\views\his\inject\infusiondrugs\Basics\drugDistribution\index.vue
-->

<template>
  <div class="content opertionIncome">
    <el-row :gutter="10" class="ht">
      <el-col :span="14" class="ht">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <span class="title">{{$t('发药批次设置')}}</span>
            </div>
            <div class="operate">
              <el-button size="mini" type="primary" class="blue-gra" @click="handleAdd">新增</el-button>
            </div>
          </div>
          <el-table
            :data="tableData"
            ref="table"
            :highlight-current-row="true"
            border
            stripe
            :height="listSlotHeight - 73"
            class="no-underline scroll-bar"
            @row-click="handleSelRow"
          >
            <!-- <el-table-column prop="webSortNumber" :label="$t(' ')" width="32"></el-table-column> -->
            <el-table-column prop="pcmc" :label="$t('发药批次')"></el-table-column>
            <el-table-column prop="kssj" :label="$t('治疗开始时间')"></el-table-column>
            <el-table-column prop="jssj" :label="$t('治疗结束时间')"></el-table-column>
            <el-table-column prop="zt" :label="$t('状态')" width="80">
              <template slot-scope="scope">
                <em :class="scope.row.zt == 1? 'blue':'reds'">{{scope.row.zt == 1 ? '启用':'停用'}}</em>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column :label="$t('table.actions')" width="100" align="center">
              <template slot-scope="scope">
                <!-- //删除 -->
                <el-tooltip :content="$t('common.delete')" effect="light">
                  <el-popconfirm
                    hideIcon
                    :confirmButtonText="$t('common.confirm')"
                    :cancelButtonText="$t('common.cancel')"
                    :title="$t('common.delTip')"
                    @confirm="handleDelete(scope.row)"
                  >
                    <el-button slot="reference" class="red mr10">
                      <i class="icon his-del his-cancellationicon" />
                    </el-button>
                  </el-popconfirm>
                </el-tooltip>
                <!-- 启用、停用 -->
                <el-tooltip :content="scope.row.zt == 1 ? $t('common.disabled') : $t('common.enabled')" effect="light">
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
      <el-col class="ht" :span="10">
        <div
          class="his-module his-small ht"
          :style="{ height: listSlotHeight / 2 - 10  + 'px', marginBottom: '10px' }"
        >
          <div slot="header" class="row">
            <div class="label">
              <h1 class="title">{{ isJudge ? $t('common.add') : $t('common.edit') }}</h1>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                class="green-gra"
                size="mini"
                icon="icon his-save"
                @click="handleSave"
              >{{$t('common.save')}}</el-button>
            </div>
          </div>
          <el-form :model="forms" :rules="rules" label-width="100px" ref="forms">
            <el-form-item :label="'发药批次'" prop="pcmc">
              <el-input v-model="forms.pcmc" placeholder="请输入发药批次"></el-input>
            </el-form-item>
            <el-form-item :label="'治疗开始时间'" prop="kssj">
              <el-time-select 
                placeholder="请选择治疗开始时间" 
                v-model="forms.kssj"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '24:00'
                }"
              >
              </el-time-select>
            </el-form-item>
            <el-form-item :label="'治疗结束时间'" prop="jssj">
              <el-time-select 
                placeholder="请选择治疗结束时间" 
                v-model="forms.jssj"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '24:00'
                }"
              >
              </el-time-select>
            </el-form-item>
          </el-form>
        </div>
        <div
          class="his-module his-small"
          :style="{ height: listSlotHeight/2 -10 + 'px', marginBottom: '10px' }"
        >
          <div class="row">
            <div class="label">
              <h1 class="title">药品类型</h1>
            </div>
          </div>
          <el-tree
            :data="typeList"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :show-checkbox="true"
            :default-checked-keys="defaultKey"
          ></el-tree>
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
  configGet,
  configSave,
  configRemove,
  updateStatus,
  queryDrugType
} from '@/api/his/inject/infusiondrugs/drugDistribution.ts'
import { Script } from 'vm'

@Component({
  name: 'drugDistribution',
  components: {},
})

export default class extends Vue {
  private listSlotHeight: number = 0 //列表高度
  private isJudge: boolean = true //新增还是保存
  private defaultKey: Array<any> = [2, 3]
  private forms: Iforms = {
    id: null,
    yfsb: null,
    jssj: null,
    kssj: null,
    pcmc: null,
    zt: null
  }
  private tableData: Array<any> = [] //表格数据
  private typeList: Array<any> = [] // 药品类型列表
  private treeData: Array<any> = [
    {
      label: '抗生素',
      children: [
        {
          label: '青霉素',
          children: [
            {
              label: '三级 1-1-1',
            },
          ],
        },
      ],
    },
    {
      label: '抗真菌药',
      children: [
        {
          label: '二级 2-1',
          children: [
            {
              label: '三级 2-1-1',
            },
          ],
        },
        {
          label: '二级 2-2',
          children: [
            {
              label: '三级 2-2-1',
            },
          ],
        },
      ],
    },
    {
      label: '抗病毒药',
      children: [
        {
          label: '二级 3-1',
          children: [
            {
              label: '三级 3-1-1',
            },
          ],
        },
        {
          label: '二级 3-2',
          children: [
            {
              label: '三级 3-2-1',
            },
          ],
        },
      ],
    },
  ]
  private rules: any = {
    pcmc: [{ required: true, message: '请输入发药批次', trigger: 'blur' }],
    kssj: [{ required: true, message: '请选择治疗开始时间', trigger: 'change' }],
    jssj: [{ required: true, message: '请选择治疗结束时间', trigger: 'change' }],
  }
  
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
    this.forms.yfsb = Vue.prototype.AUTHORITY.bussinessRole
  }

  mounted() {
    this.getList()
    this.queryDrugType()
  }

  /*@methods: getList
   *@description: 查询药房静配配置列表
   */
  private getList(){
      let yfsb: any = this.forms.yfsb
      queryList(yfsb).then((res: any) => {
        if(res.errorCode="SUCCESS"){
          this.tableData = res.data
          if(this.tableData.length>0){
            let data = this.tableData[0];
            this.$nextTick(() => {
              (this.$refs.table as any).setCurrentRow(data)
            })
            console.log(data);
            // this.configGet(data.id)
          }
        }
      })
  }

  /*@methods: handleDelete
   *@description: 删除
   */
  private handleDelete(data: any) {
    configRemove({id: data.id}).then((res: any) => {
      if(res.errorCode=='SUCCESS'){
        this.$notify({
          title:  '删除成功！',
          message: '',
          type: 'success',
        })
        this.getList()
      }
    })
  }

   /*@methods: handleAdd
   *@description: 新增
   */
  private handleAdd() {
    this.isJudge = true;
    (this.$refs.forms as any).resetFields()
    this.forms.id = null
    this.forms.zt = 1
  }

 /*@methods: handleSelRow
   *@description: 选择静脉配置药房设置一条数据
   */
  private handleSelRow(data: any) {
    this.isJudge = false
    this.forms = Object.assign(this.forms, data)
    // configGet({id: id}).then((res:any) => {
    // configGet({}).then((res: any) => {
    //   if(res.errorCode=='SUCCESS'){
    //     this.forms = Object.assign(this.forms, res.data)
    //   }
    // })
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

  /*@methods: handleSave
   *@description: 保存
   */
  private handleSave() {
     (this.$refs.forms as any).validate((valid: any) => {
       if(valid){
         configSave(this.forms).then((res: any) => {
           if(res.errorCode=='SUCCESS'){
             this.$notify({
                title: this.isJudge ? '新增成功！':'编辑成功！',
                message: '',
                type: 'success',
              })
              this.getList();
              (this.$refs.forms as any).resetFields()
           }
         })
       }
     })
  }

  // 查询药物类型
  private queryDrugType(){
    this.$nextTick(() => {
      queryDrugType({}).then((res: any) => {
        if(res.errorCode=="SUCCESS"){
          this.typeList = res.data
          if(this.typeList.length>0){
            this.typeList.map((val: any) =>{
              val.label = val.lxmc
              // if(val.zjbz){
              //   val.children = [{}]
              //   queryDrugType({yplx: val.yplx}).then((res: any) => {
              //     if(res.errorCode=="SUCCESS"){
              //       val.children = res.data
              //       // console.log(this.typeList);
              //       if(res.data.length>0){
              //         res.data.map((v: any) =>{
              //           v.label = v.lxmc
              //           val.children.push(v)
              //         })
              //         console.log(this.typeList);
              //       }
              //     }
              //   })
              // }
            })
          }
        }
      })
    })
  }

  private defaultProps: any = {
    children: 'children',
    label: 'label',
  }

  // 点击节点获取
  private handleNodeClick(data: any){
    console.log(data);
    if(this.typeList.length>0){
      this.typeList.map((val: any) => {
        if(val.yplx == data.yplx){
          queryDrugType({yplx: data.yplx}).then((res: any) => {
            if(res.errorCode=="SUCCESS"){
              val.children = res.data
              if(val.children.length>0){
                val.children.map((v: any) =>{
                  v.label = v.lxmc
                })
              }
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped lang='scss'>
.content .his-module .el-form {
  margin: 24px auto;
}
.content .his-small .el-form {
  width: 70% !important;
}
.el-tree {
  padding: 0px 50px !important;
  margin-top: 22px !important;
}
</style>