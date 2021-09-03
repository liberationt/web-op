<template>
  <el-dialog
    title="输液接药登记"
    :visible.sync="dialogVisible"
    width="1000px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    v-elDraggableDialog
    class="narrow-dialog"
    @closed="reset"
  >
    <div class="row narrow-padding" >
      <div class="btn">
        <el-button
          type="text"
          size="mini"
          @click="queryUnregistList"
        >
          <i class="icon his-caozuo_search blue"></i>
          <span>查询</span>
        </el-button>

        <el-button
          type="text"
          size="mini"
          @click="reset"
        >
          <i class="icon his-btn-reset blue"></i>
          <span>重置</span>
        </el-button>
      </div>
    </div>

    <div class="his-small his-module">
      <el-form
        ref="formData"
        :model="formData"
        label-width="60px"
        class="clearfix"
      > 
      <div style="display:flex">
        <div class="form-area1" style="margin-left: 0">
          <el-form-item :label="'卡号'" prop="jzkh" class="item-card">
            <el-input
              v-model="formData.jzkh"
              :placeholder="'请输入卡号'"
              @keyup.native.enter="queryUnregistList"
            ></el-input>
          </el-form-item>
          <el-button
            type="primary"
            class="blue-btn"
          >读卡</el-button>
        </div>

        <div class="form-area1">
          <el-form-item :label="'发票号'" prop="fphm">
            <el-input
              v-model="formData.fphm"
              :placeholder="'请输入发票号'"
              @keyup.native.enter="queryUnregistList"
            ></el-input>
          </el-form-item>
        </div>

        <div class="form-area1 item-date">
          <el-form-item :label="'输液日期'" prop="daterange">
            <el-date-picker
              type="daterange"
              v-model="formData.daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              class="date-wrapper"
            ></el-date-picker>
          </el-form-item>
        </div>
        </div>
        <div class="form-area1" style="margin-left: 0">
          <el-form-item :label="'患者姓名'" prop="brxm" disabled>
            <el-input
              v-model="formData.brxm"
              :placeholder="'患者姓名'"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </div>

        <div class="form-area1">
          <el-form-item :label="'患者性别'" prop="brxb" disabled>
            <search-select
              table-name="SYS_PRIMARY_DATA"
              kid="PD0000000269"
              v-model="formData.brxb"
              :backfillValue="formData.brxb"
              :disabled="true"
              :placeholder="'性别'"
              class="no-arrow"
            />
          </el-form-item>
        </div>

        <div class="form-area1">
          <el-form-item :label="'患者年龄'" prop="age" disabled>
            <el-input
              v-model="formData.age"
              :placeholder="'患者年龄'"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </div>
        <div class="form-area1" style="margin-left: 0" >
          <el-form-item :label="'座位号'" prop="zwh" class="item-date">
            <el-input
              v-model="formData.zwh"
              :placeholder="'座位号'"
            ></el-input>
          </el-form-item>
        </div>
        <div class="form-area1 hidden">
          <el-form-item :label="'病人id'" prop="brid">
            <el-input
              v-model="formData.brid"
              :placeholder="'病人id'"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <el-table
        slot="list"
        stripe
        :highlight-current-row="true"
        :data="tableData"
        :height="400"
        :row-class-name="tableRowClassName"
        class="scroll-bar mt10"
        border
        :close-on-press-escape="false"
        tooltip-effect="light"
        @row-click="handleChange"
        @selection-change="getSelectionData"
        @select="selectRow"
        ref="table"
      >
        <el-table-column type="selection" width="32"></el-table-column>
        <el-table-column label width="14" align="center">
          <template slot-scope="scope">
            <div class="w100" :class="scope.row.colorFlag ? 'greenBack' : 'orangeBack'"></div>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="colorFlag" width="20">
          <template slot-scope="scope">
            {{scope.row.colorFlag?0:1}}
          </template>
        </el-table-column> -->

        <!-- 开方日期 -->
        <el-table-column prop="kfrq" label="开方日期" min-width="140"></el-table-column>

        <!-- 药品名称 -->
        <el-table-column prop="ypmc" label="药品名称" min-width="160" show-overflow-tooltip></el-table-column>

        <!-- 规格-->
        <el-table-column prop="ypgg" label="规格" min-width="80" show-overflow-tooltip></el-table-column>

        <!-- 产地 -->
        <el-table-column prop="ypcd" label="产地" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="ypcdList.find(item => item.dv==scope.row.ypcd)" class="text-ellipsis">
              {{ypcdList.find(item => item.dv==scope.row.ypcd).dn}}
            </div>
            <div v-else>{{scope.row.ypcd}}</div>
          </template>
        </el-table-column>

        <!-- 剂量 -->
        <el-table-column prop="ypjl" label="剂量" min-width="60">
          <template slot-scope="scope">
            {{scope.row.ypjl}}{{scope.row.jldw}}
          </template>
        </el-table-column>

        <!-- 频次 -->
        <el-table-column prop="sypc" label="频次" min-width="60" class-name="text-blue-td"></el-table-column>

        <!-- 途径 -->
        <el-table-column prop="gytj" label="途径" min-width="60" class-name="text-blue-td">
          <template slot-scope="scope">
            <div v-if="infusionWalyList.find(item => item.dv==scope.row.gytj)" class="text-ellipsis">
              {{infusionWalyList.find(item => item.dv==scope.row.gytj).dn}}
            </div>
            <div v-else>{{scope.row.gytj}}</div>
          </template>
        </el-table-column>

        <!-- 天数 -->
        <el-table-column prop="yyts" label="天数" min-width="60" class-name="text-blue-td"></el-table-column>

        <!-- 总量 -->
        <el-table-column prop="ypsl" label="总量" min-width="60" class-name="text-blue-td"></el-table-column>

        <!-- 皮试结果 -->
        <el-table-column prop="psig" label="皮试结果" min-width="72" class-name="text-blue-td">
          <template slot-scope="scope">
            <div v-if="skintestResults.find(item => item.value==scope.row.psjg)">
              <div :class="scope.row.psjg==2?'blues':'reds'">
                {{skintestResults.find(item => item.value==scope.row.psjg).name}}
              </div>
            </div>
            <div v-else>{{scope.row.psjg}}</div>
          </template>
        </el-table-column>

        <!-- 说明 -->
        <el-table-column prop="bzmc" label="说明" min-width="60"></el-table-column>

        <!-- 科室 -->
        <el-table-column prop="ksdm" label="科室" min-width="60">
          <template slot-scope="scope">
            <div v-if="deptList.find(item => item.dv==scope.row.ksdm)" class="text-ellipsis">
              {{deptList.find(item => item.dv==scope.row.ksdm).dn}}
            </div>
            <div v-else>{{scope.row.ksdm}}</div>
          </template>
        </el-table-column>

        <!-- 医生 -->
        <el-table-column prop="ysdm" label="医生" min-width="80">
          <template slot-scope="scope">
            <div v-if="docList.find(item => item.dv==scope.row.ysdm)" class="text-ellipsis">
              {{docList.find(item => item.dv==scope.row.ysdm).dn}}
            </div>
            <div v-else>{{scope.row.ysdm}}</div>
          </template>
        </el-table-column>

        <!-- 已输液次数 -->
        <el-table-column
          prop="yzxcs"
          label="已输液次数"
          min-width="100"
          class-name="text-blue-td"
        ></el-table-column>
      </el-table>
      <!-- <pre>{{selectionData}}</pre> -->
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="beforeRegister">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  aQueryUnregistList, aSySaveRegist
} from '@/api/his/inject/infusion/infusionReg.ts'
import { getNow } from '@/api/his/basic'
import { parseTime } from '@/utils'
import { groupColor } from '@/views/his/inject/untils.ts'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'registerDiolag',
  components: {},
})
export default class extends Vue {
  @Prop({ required: false, default: () => ({}) }) private ypcdList: any // 药品产地
  @Prop({ required: false, default: () => ({}) }) private docList: any // 医生列表
  @Prop({ required: false, default: () => ({}) }) private deptList: any // 门诊科室列表
  @Prop({ required: false, default: () => ({}) }) private infusionWalyList: any // 给药途径

  private dialogVisible = false
  private listSlotHeight: number = 0 //列表高度
  private formData: any = {
    jzkh: '',
    fphm: '',
    daterange: [],
    brxm: '',
    brxb: '',
    age: '',
    zwh:'',
    brid: '', // hidden
  }
  private tableData: any[] = []
  private selectionData: any[] = [] // 选中的行
  private genderList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT // 性别列表
  private ksdm: any = Vue.prototype.AUTHORITY.bussinessRole // 当前输液科室
  private skintestResults: any[] = [
    {value: 0, name: '未皮试'},
    {value: 1, name: ''},
    {value: 2, name: '阴性'},
    {value: 3, name: '阳性'},
  ]

  // 打开弹窗
  private open(){
    this.dialogVisible = true
  }

  // 获取当前时间
  private getTime(){
    getNow().then((res: any) => {
      if(res){
        let date = parseTime(res.data, '{y}-{m}-{d}')
        this.formData.daterange = [date, date]
      }
    })
  }

  // 关闭时
  private handleClose() {
    this.dialogVisible = false
  }
  private handleChange(val: any) {
    console.log(val)
  }

  // 查询未登记的输液处方
  private queryUnregistList(){
    if(this.formData.jzkh==''&&this.formData.fphm==''){
      this.$notify({
        title: '请输入卡号或发票号',
        message: '',
        type: 'warning'
      })
      return false
    }
    let params = {
      jzkh: this.formData.jzkh,
      fphm: this.formData.fphm,
      beginDay: this.formData.daterange[0],
      endDay: this.formData.daterange[1],
      ksdm: this.ksdm,
      kslb: 1,
    }
    aQueryUnregistList(params).then((res: any) => {
      if(res){
        if(res.data.syJydjUser){
          this.formData.brxm = res.data.syJydjUser.brxm
          this.formData.brxb = res.data.syJydjUser.brxb
          this.formData.age = res.data.syJydjUser.age
          this.formData.brid = res.data.syJydjUser.brid
          this.tableData = res.data.resultList
          this.tableData = groupColor(this.tableData)
        }else{
          this.$notify({
            title: '没有查到输液信息',
            message: '',
            type: 'error'
          })
          this.formData.brxm = ''
          this.formData.brxb = ''
          this.formData.age = ''
          this.formData.brid = ''
          this.tableData = []
        }
        
      }
    })
  }

  // 设置索引
  private tableRowClassName({ row, rowIndex }: any) {
    row.index = rowIndex
  }

  // 处理分组
  private groupColor(){
    this.tableData.forEach((item)=>{
      this.$set(item, 'group', `${item.cfhm}-${item.cfzh}`)
    })

    this.tableData.forEach((item, index)=>{
      if(index == 0){
        this.$set(item, 'colorFlag', true)
      }else{

        if(item.group == this.tableData[index-1].group){
          this.$set(item, 'colorFlag', this.tableData[index-1].colorFlag)
        }else{
          this.$set(item, 'colorFlag', !this.tableData[index-1].colorFlag)
        }

      }
    })
  }

  // 勾选
  private selectRow(selection: any, row: any){
    // 获取当前行是否选中（点击复选框后）
    let rowIndex = selection.findIndex((item: any)=>{
      return item.index==row.index
    })
    const table: any = this.$refs.table
    this.tableData.forEach((item)=>{
      //原来的
      // if(item.group==row.group){
      //   this.$nextTick(()=>{
      //     table.toggleRowSelection(item, rowIndex>-1 ? true : false)
      //   })
      // }
      if(item.cfhm==row.cfhm){
        this.$nextTick(()=>{
          table.toggleRowSelection(item, rowIndex>-1 ? true : false)
        })
      }
    })
  }

  // 重置
  private reset(){
    const formData: any = this.$refs.formData
    formData.resetFields()
    this.getTime()
    this.tableData = []
  }

  // 获取选中的行，选择项改变时触发
  private getSelectionData(selection: any){
    this.selectionData = selection
  }

  // 登记前
  private beforeRegister(){
    if(this.formData.brid==''){
      this.$notify({
        title: '请先调入患者输液信息',
        message: '',
        type: 'warning'
      })
      return false
    }
    if(this.formData.zwh==''){
      this.$notify({
        title: '请先输入患者座位号',
        message: '',
        type: 'warning'
      })
      return false
    }
    if(this.selectionData.length==0){
      this.$notify({
        title: '请选择输液处方',
        message: '',
        type: 'warning'
      })
      return false
    }

    // 检查皮试结果
    let arrPsjg: any = [] // 皮试结果（只存两项）
    // 0未皮试，3阳性
    for(let i of this.selectionData){
      console.log(i.kfrq)
      if(i.psjg==0){
        arrPsjg.push(0)
      }
      if(i.psjg==3){
        arrPsjg.push(3)
      }
    }

    if(arrPsjg.length){
      if(arrPsjg[0]==0){
        this.$confirm("有需要皮试的药品还<span style='color:#f95776'>未皮试</span>，是否仍然进行登记？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
          dangerouslyUseHTMLString: true
        }).then(() => {
          if(arrPsjg.includes(3)){
            console.log('皮试3检测')
            this.$confirm("有皮试结果呈<span style='color:#f95776'>阳性</span>，是否仍然进行登记？", '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal: false,
              dangerouslyUseHTMLString: true
            }).then(() => {
              this.register()
            }).catch(() => {
            })
          }else{
            this.register()
          }
        }).catch(() => {
        })
      }else{
        this.$confirm("有皮试结果呈<span style='color:#f95776'>阳性</span>，是否仍然进行登记？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
          dangerouslyUseHTMLString: true
        }).then(() => {
          if(arrPsjg.includes(0)){
            console.log('皮试0检测')
            this.$confirm("有需要皮试的药品还<span style='color:#f95776'>未皮试</span>，是否仍然进行登记？", '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal: false,
              dangerouslyUseHTMLString: true
            }).then(() => {
              this.register()
            }).catch(() => {
            })
          }else{
            this.register()
          }
        }).catch(() => {
        })
      }
    }else{
      this.register()
    }
    
    console.log('检查皮试完成')
  }

  // 登记
  private register(){
    console.log('开始登记')
    let params = {
      brid: this.formData.brid,
      jzkh: this.formData.jzkh,
      kslb: 1,
      ksdm: this.ksdm,
      djrdm: JSON.parse(localStorage.userInfo).userId,
      cfList: this.selectionData,
      zwh:this.formData.zwh
    }
    aSySaveRegist(params).then((res: any) => {
      if(res){
        this.$notify({
          title: '登记成功',
          message: '',
          type: 'success'
        })
        this.dialogVisible = false
        this.$emit('registered', res.data.djdh)
      }
    })
  }

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight - 120 - 120 - 120
    // this.listSlotHeight = 300
    this.getTime()
  }

  mounted() {}
}
</script>

<style lang="scss" scoped>
.lable {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .redCar {
    margin-left: 10px;
  }
}

.row{
  margin-bottom: 0;
}

.el-form {
  .form-area1{
    float: left;
    width: calc((100% - 16px*2)/3);
    margin: 8px 0 0 16px;
    &.item-date{
      // width: calc((100% - 8px*1)/2);
      margin-bottom: 1px;
    }
    &.hidden{
      display: none;
    }
  }
  .el-form-item{
    display: inline-block;
    margin-bottom: 0!important;
    ::v-deep .el-form-item__content{
      width: auto;
      margin-left: 60px!important;
    }
    ::v-deep .el-input__inner{
      height: 28px!important;
    }
    &.item-card{
      width: calc(100% - 60px - 4px);
      // min-width: calc(60px + 140px);
      +.el-button{
				width: 60px;
				height: 28px;
				margin-left: 4px;
				padding: 0;
				justify-content: center;
				::v-deep .icon{
          font-size: 16px;
        }
			}
    }
  }
}
::v-deep .el-dialog .el-dialog__footer {
  border: none;
}

.orangeBack,
.greenBack {
  height: 32px;
  opacity: 30%;
}

.greenBack {
  background: #0fcaad;
}
.orangeBack {
  background: #ffbf00;
}
</style>
