<template>
  <div class="content ht">
    <div class="his-small his-module">
      <div slot="header" class="row">
        <!-- <div class="title">病人去向管理</div> -->
        <!-- <el-divider direction="vertical"></el-divider> -->
        <div class="label">
          <div class="heading">来诊日期</div>
          <el-date-picker v-model="searchData.dateValue" value-format="yyyy-MM-dd" type="daterange" placeholder="选择日期" class="form-input date-wrapper" :style="{width: '240px !important'}"></el-date-picker>
        </div>
        <div class="label">
          <div class="heading">分诊级别</div>
          <el-select v-model="searchData.brpj" :placeholder="'请选择'" @change="getList" clearable>
            <el-option v-for="item in patientLevel" :key="item.dv" :value="item.dv" :label="item.dn"></el-option>
          </el-select>
        </div>
        <div class="label">
          <div class="heading">病人</div>
          <el-input v-model="searchData.xm" :placeholder="'请输入病人姓名'" ref="inputJzkh" @change="getList"></el-input>
        </div>
        <div class="label">
          <el-radio v-model="searchData.zt" label="1" @change="getList">在诊病人</el-radio>
          <el-radio v-model="searchData.zt" label="2" @change="getList">离院病人</el-radio>
        </div>
        <el-divider direction="vertical"></el-divider>
        <div class="btn">
          <el-button size="mini" type="text" @click="handleQuery">
            <i class="icon his-btn-save blue"></i>
            <span>查询</span>
          </el-button>
        </div>
      </div>
      <pagenation-list ref="pageTable" v-model="list" data-url="/op-service/erpreyjfz/queryPage" http-method="post" :list-height="listSlotHeight" :searchData="searchData">
        <el-table :data="tableFormat" stripe border class="scroll-bar" :height="listSlotHeight" slot="list" :highlight-current-row="true">
          <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
          <el-table-column prop="lzsj" width="130" align="center" label="来诊日期"></el-table-column>
          <el-table-column prop="xm" width="72" align="center" label="姓名"></el-table-column>
          <el-table-column prop="csny" width="100" align="center" label="出生日期">
                <template slot-scope="scope">
              {{ scope.row.csny | filterTime }}
            </template>
          </el-table-column>
          <el-table-column prop="xbName" width="56" align="center" label="性别"></el-table-column>
          <el-table-column prop="nl" width="72" align="center" label="年龄"></el-table-column>
          <el-table-column prop="xxzz" width="100" align="center" label="现住址">
            <!-- <template slot-scope="props">
              <span>{{ props.row.xzzsfName + props.row.xzzsName + props.row.xzzxName }}</span>
            </template> -->
          </el-table-column>
          <el-table-column prop="lxfs" width="100" align="center" label="联系方式"></el-table-column>
          <el-table-column prop="lyfsName" width="80" align="center" label="来院方式"></el-table-column>
          <el-table-column prop="zs" width="200" align="center" label="主诉" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="tw" width="60" align="center" label="体温"></el-table-column>
          <el-table-column prop="mb" width="60" align="center" label="脉搏"></el-table-column>
          <el-table-column prop="hx" width="60" align="center" label="呼吸"></el-table-column>
          <el-table-column prop="xy" width="80" align="center" label="血压">
            <template slot-scope="props">
              <span>{{ props.row.xyszy + ' / ' + props.row.xyssy }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="xybhd" width="72" align="center" label="血氧饱和度"></el-table-column>
          <el-table-column prop="ysztName" width="82" align="center" label="意识状态"></el-table-column>
          <el-table-column prop="sewspf" width="72" align="center" label="MEWS评分"></el-table-column>
          <el-table-column prop="ttpf" width="72" align="center" label="疼痛评分"></el-table-column>
          <el-table-column prop="brpjName" width="110" align="center" label="分诊级别"></el-table-column>
          <el-table-column prop="fzksdmName" width="72" align="center" label="分诊科室"></el-table-column>
          <el-table-column prop="ysdmName" width="72" align="center" label="医生"></el-table-column>
          <el-table-column prop="fzhsdmName" width="72" align="center" label="护士"></el-table-column>
          <el-table-column prop="qxName" width="72" align="center" label="患者去向"></el-table-column>
          <el-table-column prop="action" :label="$t('queueNumber.action')" width="80" fixed="right">
            <template slot-scope="props">
              <div class="aciton-button">
                <el-tooltip :content="'病人去向'" effect="light">
                  <el-button class="green" @click="trunDetail(props.row)">
                    <i :size="14" class="icon blue his-basic-info"></i>
                  </el-button>
                </el-tooltip>
                <el-tooltip :content="'取消'" effect="light">
                  <el-popconfirm
                      class="ml10"
                      hideIcon
                      title="确定取消吗？"
                      @confirm="modQueueStatusOk(props.row, 1)"
                      >
                    <el-button slot="reference" class="green" >
                      <i :size="14" class="icon his-turn"></i>
                    </el-button>
                  </el-popconfirm>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </pagenation-list>
    </div>
    <el-dialog title="病人去向" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" center destroy-on-close>
      <el-form :model="formData" ref="formValidate" label-width="80px">
        <el-form-item label="离开时间">
          <el-date-picker v-model="formData.lksj" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" class="form-input date-wrapper" @blur="getTlsj"></el-date-picker>
        </el-form-item>

        <el-form-item label="去向">
          <el-select v-model="formData.qx" :placeholder="'请选择'">
            <el-option v-for="item in toWhereList" :key="item.dv" :value="item.dv" :label="item.dn"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="停留时间">
          <!-- <el-date-picker v-model="formData.tlsj" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" class="form-input date-wrapper"></el-date-picker> -->
          <el-input v-model="formData.tlsj" disabled style="width:auto">
               <i slot="suffix">分</i>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Watch, Vue, Prop } from 'vue-property-decorator'
import { id2Name } from '@/utils'
import { chooseToW, cancleManage } from '@/api/ecis/pretriage/whereAbout'
import { AxiosResponse } from 'axios'
import { getNow } from '@/api/his/basic/index.ts'
import { parseTime,formatDate, formatBeginDay } from '@/utils'

@Component({
  name: 'WhereAbouts',
  //组件引用
  components: {},
  filters: {}
})
export default class extends Vue {
  private listSlotHeight: number = 0

  private list: any[] = []
  private searchData: any = {
    dateValue: [],
    zt: "1"
  }
  private daterange: any[] = []
  private formData: any = {}
  private dialogVisible: boolean = false
  private sexList: any[] = [] //性别字典
  private patientLevel: any[] = [] // 病人级别
  private addressList: any[] = [] // 地址字典
  private tohospital: any[] = [] // 来院方式
  private realizeList: any[] = [] // 意识状态
  private ksList: any[] = [] // 分诊科室
  private toWhereList: any = [] // 病人去向
  private ysList: any = [] //医生字典
  private fzhsList: any = [] //护士字典
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 62 - 43
  }

  mounted() {
    this.sexList =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT :this.$store.state.webSqlDict.SEX_DICT
    this.patientLevel =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.PATIENT_TYPE_DICT :this.$store.state.webSqlDict.PATIENT_TYPE_DICT
    this.tohospital =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TO_HOS_TYPE_DICT :this.$store.state.webSqlDict.TO_HOS_TYPE_DICT
    this.realizeList =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REALIZE_TYPE_DICT :this.$store.state.webSqlDict.REALIZE_TYPE_DICT
    this.ksList =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REGISTERATION_DEPARTMENT_DICT :this.$store.state.webSqlDict.REGISTERATION_DEPARTMENT_DICT
    this.toWhereList =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TOWHERE_TYPE_DICT :this.$store.state.webSqlDict.TOWHERE_TYPE_DICT
    this.ysList =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT :this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.fzhsList =  Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT :this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.searchData.lzsjStart = formatDate(1)
    this.searchData.lzsjEnd = formatDate(1)
    this.searchData.dateValue = [this.searchData.lzsjStart, this.searchData.lzsjEnd]
    this.getList()
  }

    @Watch('searchData.dateValue')
      private onDateChange(val: any) {
        if (val) {
          this.searchData.lzsjStart = val[0]
          this.searchData.lzsjEnd = val[1]
        } else {
          this.searchData.lzsjStart = ''
          this.searchData.lzsjEnd = ''
        }
      }

  get tableFormat() {
    const tabledata = this.list
    id2Name(tabledata, 'xb', 'xbName', this.sexList, 'dv', 'dn')
    id2Name(tabledata, 'lyfs', 'lyfsName', this.tohospital, 'dv', 'dn')
    id2Name(tabledata, 'yszt', 'ysztName', this.realizeList, 'dv', 'dn')
    id2Name(tabledata, 'fzksdm', 'fzksdmName', this.ksList, 'dv', 'dn')
    id2Name(tabledata, 'brpj', 'brpjName', this.patientLevel, 'dv', 'dn')
    id2Name(tabledata, 'ysdm', 'ysdmName', this.ysList, 'dv', 'dn')
    id2Name(tabledata, 'fzhsdm', 'fzhsdmName', this.fzhsList, 'dv', 'dn')
    id2Name(tabledata, 'qx', 'qxName', this.toWhereList, 'dv', 'dn')
    return tabledata
  }

  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private handleQuery() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

  // private handleChageDate(){
  //   if(this.searchData.dateValue.length>0){
  //     this.searchData.lzsjStart = this.searchData.dateValue[0]
  //     this.searchData.lzsjEnd = this.searchData.dateValue[1]
  //     this.getList()
  //   }
  // }
  private trunDetail(val: any) {
    this.dialogVisible = true
    this.formData = {...val}
  }

  private handleClose() {
    this.dialogVisible = false
  }

  private getTlsj() {
    if (this.formData.lzsj && this.formData.lksj) {
      this.$set(this.formData, 'tlsj', Math.ceil(this.getDataDiff(this.formData.lksj, this.formData.lzsj, 'minute')))
    }
  }
  private handleSubmit() {
    chooseToW(this.formData).then((res: AxiosResponse) => {
      this.$notify.success('操作成功')
      this.getList()
      this.dialogVisible = false
    })
  }

  private modQueueStatusOk(val:any) {
    cancleManage({ lsh: val.lsh }).then((res:AxiosResponse) =>{
      this.$notify.success('取消成功')
      this.getList()
    })
  }


  private getDataDiff(startTime: any, endTime: any, diffType: any) {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
    startTime = startTime.replace(/\-/g, '/')
    endTime = endTime.replace(/\-/g, '/')

    //将计算间隔类性字符转换为小写
    diffType = diffType.toLowerCase()
    let sTime = new Date(startTime) //开始时间
    let eTime = new Date(endTime) //结束时间

    //作为除数的数字
    let divNum: number = 1
    switch (diffType) {
      case 'second':
        divNum = 1000
        break
      case 'minute':
        divNum = 1000 * 60
        break
      case 'hour':
        divNum = 1000 * 3600
        break
      case 'day':
        divNum = 1000 * 3600 * 24
        break
      default:
        break
    }
    console.log('(eTime.getTime() - sTime.getTime()) / divNum', (eTime.getTime() - sTime.getTime()) / divNum)

    return (sTime.getTime() - eTime.getTime()) / divNum
  }
}
</script>
<style lang="scss" scoped>
.el-divider--vertical {
  margin: 0 10px;
}
::v-deep .row {
  justify-content: start;
  .label {
    margin-right: 0px;
    font-size: 14px;
    .heading {
      margin-right: 0px;
      width: 70px;
    }
    .el-date-editor ::v-deep {
    width: 100%;
    height: 28px;
    border: 0;
    background: $lightGray;
      .el-input__icon {
        line-height: 23px;
      }
      .el-range-input {
        width: 74px;
        background: $lightGray;

      }

    }
  }
}
</style>
