<!--
 * @Date: 2020-06-10 09:45:20
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-10 10:46:12
 * @description: 皮试项目设置
-->

<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="12">
        <div class="his-module layout-top his-small">
          <!-- <pagenation-list
            ref="pageTable"
            v-model="tableDatas"
            data-url="/system-service/sys/sysgroup/queryPage"
            http-method="post"
            :list-height="listSlotHeight"
            :searchData="searchData"
          >-->
          <div slot="header">
            <div class="row">
              <div class="label">
                <h1 class="title">皮试项目<!-- {{curPsid}} --></h1>
                <!-- <div class="querySearch">
                  <el-divider direction="vertical"></el-divider>
                </div> -->
              </div>
              <div class="operate">
                <el-button
                  size="mini"
                  type="primary"
                  class="blue-gra"
                  icon="icon his-add"
                  @click="handleAddPsxm"
                >{{ $t('common.add') }}</el-button>
              </div>
            </div>
          </div>
          <el-table
            :data="tableData1"
            border
            :fit="true"
            stripe
            :highlight-current-row="true"
            slot="list"
            @row-click="handleRowClick"
            :height="listSlotHeight - 100"
            class="scroll-bar no-underline"
          >
            <el-table-column type="index" width="32" align="center"></el-table-column>

            <!-- 皮试项目 -->
            <el-table-column prop="psmc" :label="'皮试项目'" show-overflow-tooltip></el-table-column>

            <!-- 过敏药物类型 -->
            <el-table-column prop="gmywlx" :label="'过敏药物类型'" min-width="106">
              <template slot-scope="scope">
                <div>{{gmywList.find((item)=> scope.row.gmywlx == item.dv) && gmywList.find((item)=> scope.row.gmywlx == item.dv).dn }}</div>
              </template>
            </el-table-column>

            <!-- 皮试时间（分钟） -->
            <el-table-column prop="pssc" :label="'皮试时间(分钟)'" width="106"></el-table-column>

            <!-- 皮试有效期 -->
            <el-table-column prop="psyxq" :label="'皮试有效期(天)'" width="110"></el-table-column>

            <!-- 类型 -->
            <el-table-column prop="pslx" :label="'类型'" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="typeList.find(item => item.value==scope.row.pslx)">
                  {{typeList.find(item => item.value==scope.row.pslx).name}}
                </div>
                <div v-else>{{scope.row.zt}}</div>
              </template>
            </el-table-column>

            <!-- 状态 -->
            <el-table-column prop="zt" :label="'状态'" min-width="50">
              <template scope="scope">
                <div v-if="scope.row.zt==1" class="reds">停用</div>
                <div v-else class="blues">启用</div>
              </template>
            </el-table-column>

            <!-- 操作 -->
            <el-table-column :label="$t('common.action')" width="80" fixed="right" align="center" class-name="action-btns">
              <template slot-scope="scope">
                <!-- 启用停用 0启用 1停用-->
                <el-tooltip
                  :content="scope.row.zt == '0'?$t('common.disable'):$t('common.enable')"
                  effect="light"
                >
                  <el-popconfirm
                    class="ml10"
                    hideIcon
                    :confirmButtonText="scope.row.zt=='0'?$t('common.disable'):$t('common.enable')"
                    :cancelButtonText="$t('common.cancel')"
                    :title="scope.row.zt=='0'?$t('sysManage.confirmDisabled'):$t('sysManage.confirmAutomated')"
                    @confirm="updateZt(scope.row)"
                  >
                    <el-button
                      slot="reference"
                      :class="[scope.row.zt=='0'?'red':'green']"
                    >
                      <i
                        class="icon"
                        :class="[scope.row.zt=='0'?'his-disabled':'his-automated']"
                      ></i>
                    </el-button>
                  </el-popconfirm>
                </el-tooltip>
                <!-- // 删除-->
                <el-tooltip :content="$t('common.delete')" placement="bottom" effect="light">
                  <el-popconfirm
                    hideIcon
                    :confirmButtonText="$t('common.confirm')"
                    :cancelButtonText="$t('common.cancel')"
                    :title="$t('common.delTip')"
                    @confirm="deletePsxm(scope.row)"
                  >
                    <el-button slot="reference" class="red" :disabled="scope.row.zt==0?true:false">
                      <i class="icon his-del"></i>
                    </el-button>
                  </el-popconfirm>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!-- </pagenation-list> -->
        </div>
      </el-col>

      <el-col class="ht" :span="12">
        <div
          class="his-module his-small form-area"
          :style="{ height: listSlotHeight * .4 + 'px'}"
        >
          <div class="row">
            <div class="label">
              <!-- <h1 class="title">皮试项目</h1> -->
              <h1 class="title">{{ isAdd ? $t('common.add') : $t('common.edit') }}</h1>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                size="mini"
                class="green-gra"
                icon="icon his-save"
                @click="savePsxm"
              >{{ $t('common.save') }}</el-button>
            </div>
          </div>
          <div>
            <el-form
              ref="formData"
              :model="formData"
              :rules="formRule"
              label-width="95px"
              class="clearfix"
              style="margin:0px auto"
            >
              <div class="his_op_form">
                <el-form-item :label="'皮试项目'" prop="psmc">
                  <el-input v-model="formData.psmc" :placeholder="'请输入项目名称'" @change="getPywb"></el-input>
                </el-form-item>

                <el-form-item :label="'皮试时长'" prop="pssc">
                  <el-input v-model="formData.pssc" :placeholder="'请输入皮试时长(分钟)'" oninput="value=value.replace(/[^0-9.]/g,'')" type="number"></el-input>
                </el-form-item>
              </div>
              <div class="his_op_form">
                <el-form-item :label="'过敏药物类型'" prop="gmywlx">
                  <el-select v-model="formData.gmywlx" :placeholder="'请输入'" type="number" clearable>
                    <el-option v-for="(item,index) in gmywList" :key="index" :label="item.dn" :value="item.dv"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item :label="'皮试有效期'" prop="psyxq">
                  <el-input v-model="formData.psyxq" :placeholder="'请输入有效期天数'" type="number" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
                </el-form-item>
              </div>
              <div class="his_op_form">
                <el-form-item :label="'拼音码'" prop="pydm">
                  <el-input v-model="formData.pydm" :placeholder="'请输入拼音码'"></el-input>
                </el-form-item>

                <el-form-item :label="'五笔码'" prop="wbdm">
                  <el-input v-model="formData.wbdm" :placeholder="'请输入五笔码'"></el-input>
                </el-form-item>
              </div>
              <div class="his_op_form">
                <el-form-item :label="'类型'" prop="pslx">
                  <el-radio-group v-model="formData.pslx">
                    <el-radio
                      v-for="item in typeList"
                      :key="item.value"
                      :label="item.value"
                    >{{item.name}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item></el-form-item>
                <el-form-item></el-form-item>
              </div>
            </el-form>
          </div>
        </div>

        <div class="his-module his-small" :style="{ height: listSlotHeight * .6  - 20 +'px'}">
          <div slot="header">
            <div class="row">
              <div class="label">
                <h1 class="title">联动收费项目</h1>
                <el-divider direction="vertical"></el-divider>
                <div class="btn">
                  <el-button @click="handleAddSfxm" :disabled="curPsid?false:true">
                    <i class="icon his-btn-add-copy green"></i>新增
                  </el-button>
                </div>
              </div>
              <div class="operate">
                <el-button
                  size="mini"
                  type="primary"
                  class="green-gra"
                  icon="icon his-save"
                  @click="saveSfxm"
                >{{ $t('common.save') }}</el-button>
              </div>
            </div>
          </div>
          <el-table
            :data="tableData2"
            :row-class-name="tableRowClassName"
            @row-click="getCurRow2"
            border
            stripe
            highlight-current-row
            fit
            :height="'calc(100% - 78px)'"
            class
          >
            <el-table-column type="index" width="32" align="center"></el-table-column>

            <!-- <el-table-column label="代码" min-width="60" prop="sfxmdm"></el-table-column> -->

            <!-- 项目名称 -->
            <el-table-column label="项目名称" min-width="140" prop="ypmc">
              <template slot-scope="scope">
                <remoteSearchBox
                  v-model="scope.row.ypmc"
                  :required="true"
                  :ref="`${scope.$index}-1`"
                  style="height: 32px"
                  :popoverWidth="700"
                  :searchData="searchData"
                  :resultTableHeader="resultHeader"
                  :searchField="{yp:'pydm', zt:'pydm', xm:'pydm'}"
                  :showLabel="{yp:'ypmc', zt:'ztmc', xm: 'yzmc'}"
                  :name="searchUrlName"
                  @getData="row=>getInfo(row, scope.row)"
                  @keydown.enter.native="focusNext(scope.$index, 1)"
                />
              </template>
            </el-table-column>

            <!-- 规格 -->
            <el-table-column label="规格" min-width="80" prop="ypgg"></el-table-column>

            <!-- 数量 -->
            <el-table-column label="数量" min-width="60" prop="sl">
              <template slot-scope="scope">
                <inputBox
                  v-model="scope.row.sl"
                  :required="true"
                  @change="changeQuantity"
                  @keydown.enter.native="focusNext(scope.$index, 2)"
                  :ref="`${scope.$index}-2`"
                  style="height: 32px"
                />
              </template>
            </el-table-column>

            <!-- 单位 -->
            <el-table-column label="单位" min-width="80" prop="ypdw"></el-table-column>

            <!-- 单价 -->
            <el-table-column label="单价" min-width="80" prop="ypdj" class-name="text-blue-td" align="right">
              <template slot-scope="scope">{{useGetFloat(scope.row.ypdj, 2)}}</template>
            </el-table-column>

            <!-- 金额 -->
            <el-table-column label="金额" min-width="80" prop="xmje" class-name="text-blue-td" align="right">
              <!-- <template slot-scope="scope">{{useGetFloat(mul(scope.row.ypdj, scope.row.sl), 2)}}</template> -->
            </el-table-column>

            <!-- 操作 -->
            <el-table-column label="操作" width="60" fixed="right" align="center" class-name="action-btns">
              <template slot-scope="scope">
                <el-tooltip :content="$t('common.delete')" placement="bottom" effect="light">
                  <el-popconfirm
                    hideIcon
                    :confirmButtonText="$t('common.confirm')"
                    :cancelButtonText="$t('common.cancel')"
                    :title="$t('common.delTip')"
                    @confirm="deleteSfxm(scope.row)"
                  >
                    <el-button slot="reference" class="red" :disabled="scope.row.zt==0?true:false">
                      <i class="icon his-del"></i>
                    </el-button>
                  </el-popconfirm>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <div class="residue bottom-bar">
            <p>
              {{$t('合计')}}：
              <em style="color:#1485FF">&yen;{{amount}}</em>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  aQuerySkinTestList, aSaveSkinTest, aUpdateSkinTest, aUpdateZt, aDeleteSkinTest, aQueryLdsfxmList, aSaveLdsfxm, aDeleteLdsfxm
} from '@/api/his/inject/infusion/skinTest.ts'
import { pywb } from '@/api/his/basic/index.ts'
import { getFloat, mul } from '@/utils'
import { get } from 'http'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: '',
  components: {},
})
export default class extends Vue {
  private tableData1: any[] = []
  private tableData2: any[] = []
  private curRow1: any = {}
  private curRow2: any = {}
  private listSlotHeight: number = 0
  private gmywList: Array<any> = [] // 皮试类型数组
  private formData: any = {
    psmc: '', // 皮试项目名称
    pssc: '', // 皮试时长(分钟)
    pydm: '',
    wbdm: '',
    pslx: '1', // 类型
    psid: '', // id
    gmywlx: '', // 过敏药物类型
    psyxq: '', // 皮试有效期
  }
  private formRule: any = {
    psmc: [{ required: true, message: '请输入皮试项目', trigger: 'blur' }],
    pssc: [{ required: true, message: '请输入皮试时长', trigger: 'blur' }],
    gmywlx: [{ required: true, message: '请选择过敏药物类型', trigger: 'change' }],
    psyxq: [{ required: true, message: '请输入皮试有效期(天)', trigger: 'blur' }],
  }
  private isAdd: boolean = true // 新增/修改
  private typeList: any[] = [ //皮试类型:1:领药前皮试 2: 领药后皮试
    {name: '领药前皮试', value: '1'},
    {name: '领药后皮试', value: '2'},
  ]
  private curPsid: number|null = null // 当前行id

  private resultHeader: any = {
    yp: [
      {prop: 'ypmc', label: '药品名称', width: 200}, // v
      {prop: 'yfgg', label: '规格', width: 120}, // v
      {prop: 'yfdw', label: '单位', width: 60}, // v
      // {prop: 'fygb', label: '归并'}, // v
      {prop: 'cdmc', label: '产地名称'},
      {prop: 'lsjg', label: '单价'}, // v
      {prop: 'ypsl', label: '药品库存'},
    ],
    zt: [
      {prop: 'ztmc', label: '药品名称'}
    ],
    xm: [
      {prop:'yzmc', label: '项目名称', width: 200},
      {prop:'fydw', label: '单位'},
      {prop:'fydj', label: '单价'}
    ]
  }
  private searchUrlName: string = 'yzyp' // 搜索接口地址
  private searchData: any = {
    yp: { // 药品、检查
      cflx: '',
      pydm: '',
      yfsb: '',
      showGb: 1
    },
    zt: { // 药品组套、检查组套
      ztlb: '',
      pydm: '',
      ksdm: '',
      // yfsb: '',
      // showGb: 1
    },
    xm: {
      pydm: ''
    }
  }

  get amount(){
    // return 0
    let amount = 0
    this.tableData2.forEach((item: any) => {
      amount = (mul(amount, 100) + mul(item.xmje, 100))/100
    })
    return getFloat(amount, 2)
  }

  // 保留n位小数
	private useGetFloat(num: any, n: number){
		return getFloat(num, n)
  }
  // 乘法
	private useMul(a: number, b: number){
		return mul(a, b)
	}

  // 查询列表
  private getList1(){
    aQuerySkinTestList().then((res: any) => {
      if(res){
        this.tableData1 = res.data
      }
    })
  }

  // 查看详情
  private handleRowClick(row: any) {
    this.curPsid = row.psid
    for(let i in this.formData){
      this.formData[i] = row[i]
    }
    this.formData.gmywlx = this.formData.gmywlx ? this.formData.gmywlx.toString() : ''
    console.log(this.formData)
    this.isAdd = false
    this.getList2(row)
    // this.changTmgz(row.tmscgz)
  }

  // 新增按钮
  private handleAddPsxm() {
    const form: any = this.$refs.formData
    form.resetFields()
    this.isAdd = true
    this.curPsid = null
  }

  // 保存皮试项目
  private savePsxm() {
    const form: any = this.$refs.formData
    form.validate((valid: any)=>{
      if(valid){


        // if(this.tableData2.length==0){
        //   this.$notify({
        //     title: '请添加收费项目',
        //     message: '',
        //     type: 'warning'
        //   })
        //   return false
        // }


        let params = JSON.parse(JSON.stringify(this.formData))
        if(this.isAdd){
          aSaveSkinTest(params).then((res: any) => {
            if(res){
              this.$notify({
                title: '新增成功',
                message: '',
                type: 'success'
              })
              this.getList1()
              this.handleAddPsxm()
            }
          })
        }else{
          aUpdateSkinTest(params).then((res: any) => {
            if(res){
              this.$notify({
                title: '修改成功',
                message: '',
                type: 'success'
              })
              this.getList1()
              this.handleAddPsxm()
            }
          })
        }
      }
    })
  }

  // 停用/启用
  private updateZt(row: any){
    let params = {
      psid: row.psid,
      zt: row.zt==1?0:1
    }
    aUpdateZt(params).then((res: any) => {
      if(res){
        this.$notify({
          title: row.zt==1?'已启用':'已停用',
          message: '',
          type: 'success'
        })
        this.getList1()
      }
    })
  }

  // 删除皮试项目
  private deletePsxm(row: any){
    aDeleteSkinTest({psid: row.psid}).then((res: any) => {
      if(res){
        this.$notify({
          title: '删除成功',
          message: '',
          type: 'success'
        })
        this.getList1()
        this.handleAddPsxm()
      }
    })
  }

  // 生成拼音五笔
  private getPywb(value: any){
    pywb(value).then((res: any) => {
      if(res){
        this.formData.pydm = res.data.pinyin
        this.formData.wbdm = res.data.wubi
      }
    })
  }

  // 获取联动收费项目
  private getList2(row: any){
    aQueryLdsfxmList({psid: row.psid}).then((res: any) => {
      if(res){
        this.tableData2 = res.data
        this.tableData2.forEach((item: any)=>{
          this.$set(item, 'xmje', getFloat(mul(item.ypdj, item.sl), 2))
        })
      }
    })
  }

  // 新增按钮
  private handleAddSfxm(){
    // 是否有空行
    for(let i of this.tableData2){
      if(i.ypmc==''){
        return false
      }
    }
    this.tableData2.push({
      psid: this.curPsid,
      xmlx: '2', // 项目类型，1药品，2项目，3材料
      sfxmdm: '',
      ypmc: '',
      ypgg: '',
      sl: 1,
      ypdw: '',
      ypdj: '',
      xmje: ''
    })
  }

  // 保存收费项目
  private saveSfxm(){
    if(this.tableData2.length==0){
      this.$notify({
        title: '请添加收费项目',
        message: '',
        type: 'warning'
      })
      return false
    }
    aSaveLdsfxm(this.tableData2).then((res: any) => {
      if(res){
        this.$notify({
          title: '保存成功',
          message: '',
          type: 'success'
        })
      }
    })
  }

  // 增加索引
  private tableRowClassName({ row, rowIndex }: any) {
    this.$set(row, 'xh', rowIndex)
  }

  private getCurRow2(row: any){
    this.curRow2 = row
    console.log(row);
  }

  // 选取
  private getInfo(data: any, row: any){
    for(let i of this.tableData2){
      if(data.fyxh == i.sfxmdm){
        this.$notify({
          title: '该项目已存在',
          message: '',
          type: 'warning'
        })
        // row.ypmc = ''
        // this.curRow2.ypmc = ''
        ;(this.$refs[`${row.xh}-1`] as any).focus()
        ;(this.$refs[`${row.xh}-1`] as any).data = ''
        ;(this.$refs[`${row.xh}-1`] as any).$refs['remoteSearch'].data = ''
        return false
      }
    }
    if(data.yzmc){ // 搜项目
      row.sfxmdm = data.fyxh
      // row.yzmc = data.yzmc
      row.ypdw = data.fydw
      row.ypdj = data.fydj
    }else{ // 搜组套
    }
    this.changeQuantity(1)
  }

  // 改变数量
  private changeQuantity(value: any){
    // 计算金额
    this.curRow2.xmje = getFloat(mul(this.curRow2.ypdj, value), 2)
  }

  // 删除单项
  private deleteSfxm(row: any){
    this.tableData2.splice(this.curRow2.xh, 1)
  }

  // 回车下一项
  private focusNext(index: any, labelIndex: number) {
    console.log(1);
    if (this.$refs[`${index}-${labelIndex + 1}`]) {
      console.log(2);
      if ((this.$refs[`${index}-${labelIndex + 1}`] as any).disabled) {
        console.log(4);
        this.focusNext(index, labelIndex + 1)
      } else {
        console.log(5);
        ;(this.$refs[`${index}-${labelIndex}`] as any).blur()
        ;(this.$refs[`${index}-${labelIndex + 1}`] as any).focus()
      }
    } else {
      console.log(3);
      if (this.$refs[`${index + 1}-1`]) {
        if ((this.$refs[`${index + 1}-1`] as any).disabled) {
          this.focusNext(index + 1, 1)
        } else {
          ;(this.$refs[`${index}-${labelIndex}`] as any).blur()
          ;(this.$refs[`${index + 1}-1`] as any).focus()
        }
      } else {
        this.tableData2 = [...this.tableData2, {}]
        this.$nextTick(() => {
          if ((this.$refs[`${index + 1}-1`] as any).disabled) {
            this.focusNext(index + 1, 1)
          } else {
            ;(this.$refs[`${index}-${labelIndex}`] as any).blur()
            ;(this.$refs[`${index + 1}-1`] as any).focus()
          }
        })
      }
    }
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    this.gmywList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_ALLERGY_DICT :this.$store.state.webSqlDict.DRUG_ALLERGY_DICT
    this.getList1()
  }
}
</script>

<style lang="scss" scoped>
.form-area{
  margin-bottom: 10px;
  overflow: hidden;
}
// .el-form{
//   width: 300px!important;
//   // min-width: 300px;
// }

.el-table ::v-deep td.is-right .cell{
  padding-right: 8px!important;
}

// 底部合计
.row.bottom-bar {
  padding: 0;
  margin-top: 8px;
  margin-bottom: 0;
}
.residue {
  padding: 0 0 8px;
  height: 32px;
}

.his_op_form {
  display: flex;
  justify-content: space-around;
}
</style>
