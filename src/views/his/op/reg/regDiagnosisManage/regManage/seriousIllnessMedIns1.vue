<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="17">
        <div class="his-module his-small">
          <div class="row header1">
            <div class="label">
              <h1 class="title">{{'大病医保登记'}}</h1>
              <el-divider direction="vertical"></el-divider>
              <div class="searchTitle">卡号</div>
              <el-input
                v-model="info.cardid"
                :placeholder="'请输入卡号'"
                class="search cardno"
                @keyup.enter.native="query()"
              >
              </el-input>
              <div class="searchTitle">姓名</div>
              <el-input
                v-model="info.personname"
                :placeholder="'姓名'"
                class="search name"
                :disabled="true"
              >
              </el-input>
              <div class="btn">
                <el-button type="text" size="mini" @click="query">
                  <i class="icon his-caozuo-Details"></i>查询
                </el-button>
              </div>
            </div>
            <div class="operate">
              <!-- <el-button
                type="primary"
                size="mini"
                class="blue-gra"
                icon="icon his-add"
                @click="handleAdd"
              >{{'登记'}}</el-button> -->
            </div>
          </div>

          <!-- <div class="row info-wrap">
            <div class="label">
              
            </div>
          </div> -->
          
          <el-table
            stripe
            :highlight-current-row="true"
            :data="info.djxxs"
            v-loading="loading"
            border
            :height="listSlotHeight"
            tooltip-effect="light"
            class="scroll-bar"
          >
            <el-table-column type="index" width="32" align="center"></el-table-column>

            <el-table-column prop="dbtype" :label="'大病项目'">
              <template slot-scope="scope">
                <div v-if="zlxmList.find(item => item.dv==scope.row.dbtype)">
                  {{zlxmList.find(item => item.dv==scope.row.dbtype).dn}}
                </div>
                <div v-else>{{scope.row.dbtype}}</div>
              </template>
            </el-table-column>

            <el-table-column prop="dbzl" :label="'大病子类'">
              <template slot-scope="scope">
                <div v-if="dbzlList.find(item => item.dv==scope.row.dbzl)" class="text-ellipsis">
                  {{dbzlList.find(item => item.dv==scope.row.dbzl).dn}}
                </div>
                <div v-else>{{scope.row.dbzl}}</div>
              </template>
            </el-table-column>

            <el-table-column prop="zdno" :label="'诊断'" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="jbzdList.find(item => item.dv==scope.row.zdno)" class="text-ellipsis">
                  {{jbzdList.find(item => item.dv==scope.row.zdno).dn}}
                </div>
                <div v-else>{{scope.row.zdno}}</div>
              </template>
            </el-table-column>

            <el-table-column prop="djhosname" :label="'登记医院名称'" min-width="120"></el-table-column>

            <el-table-column prop="djhossame" :label="'是否本院登记'" min-width="100">
              <template slot-scope="scope">
                <div v-if="scope.row.djhossame==0">是</div>
                <div v-else>否</div>
              </template>
            </el-table-column>
            <el-table-column prop="startdate" :label="'开始日期'"></el-table-column>
            <el-table-column prop="enddate" :label="'结束日期'"></el-table-column>

            <!-- 操作 -->
            <el-table-column label="操作" width="70" align="center" class-name="action-btns">
              <template slot-scope="scope">
                <el-tooltip :content="'撤销登记'" effect="light">
                  <el-popconfirm
                    :title="'确认撤销登记？'"
                    :confirmButtonText="$t('common.confirm')"
                    :cancelButtonText="$t('common.cancel')"
                    @confirm="cancel(scope.row.dbtype)"
                    hideIcon
                  >
                    <el-button
                      slot="reference"
                      class="red"
                    >
                      <i class="icon his-youcaozuo-quxiao"></i>
                    </el-button>
                  </el-popconfirm>
                </el-tooltip>

                <el-tooltip :content="'打印回执单'" effect="light">
                  <el-button class="blue" @click="printHzd(scope.row.jzdyh, scope.row.dbtype, scope.row.zdno)">
                    <i class="icon his-caozuo_shixin" />
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col class="ht" :span="7">
        <div class="his-module his-small">
          <div class="row header2">
            <div class="label">
              <h1 class="title">登记</h1>
              <el-divider direction="vertical"></el-divider>
              <div class="btn">
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
            <div class="operate">
              <el-button
                type="primary"
                size="mini"
                class="green-gra"
                icon="icon his-save"
                @click="again"
                :loading="showLoading"
              >{{$t('common.save')}}</el-button>
            </div>
          </div>
          <div class="form-wrap scroll-bar">
            <el-form :model="formData" :rules="formRule" ref="formData" label-width="90px" class="clearfix">
              <!-- 卡内信息 -->
              <el-form-item :label="'卡号'" prop="cardno">
                <el-input
                  v-model="formData.cardno"
                  :placeholder="'请输入卡号'"
                >
                  <!-- <i slot="prefix" class="el-input__icon icon his-search"></i> -->
                </el-input>
              </el-form-item>

              <!-- 大病项目 -->
              <el-form-item :label="'大病项目'" prop="dbxm">
                <search-select
                  table-name="SYS_DICT_CONFIG"
                  kid="69"
                  v-model="formData.dbxm"
                  :backfillValue="formData.dbxm"
                  :placeholder="'请选择治疗项目'"
                />
              </el-form-item>

              <!-- 大病诊断 -->
              <el-form-item :label="'大病诊断'" prop="dbzd">
                <search-select
                  table-name="SYS_DICT_CONFIG"
                  kid="70"
                  v-model="formData.dbzd"
                  :backfillValue="formData.dbzd"
                  :placeholder="'请选择疾病诊断'"
                />
              </el-form-item>

              <!-- 大病子类 -->
              <el-form-item :label="'大病子类'" prop="dbzl">
                <search-select
                  table-name="SYS_FLAG_DATA"
                  kid="DB000001"
                  v-model="formData.dbzl"
                  :backfillValue="formData.dbzl"
                  :placeholder="'请选择大病子类'" 
                />
              </el-form-item>

              <!-- 医生姓名 -->
              <el-form-item :label="'医生姓名'" prop="ysgh">
                <search-select
                  table-name="SYS_DICT_CONFIG"
                  kid="81"
                  v-model="formData.ysgh"
                  :backfillValue="formData.ysgh"
                  :placeholder="'请选择医生'" 
                />
              </el-form-item>

              <!-- 委托人名 -->
              <el-form-item :label="'委托人名'" prop="wtrxm">
                <el-input
                  v-model="formData.wtrxm"
                  :placeholder="'请输入委托人名'"
                ></el-input>
              </el-form-item>

              <!-- 委托人身份证 -->
              <el-form-item :label="'委托人身份证'" prop="wtrsfzh">
                <el-input
                  v-model="formData.wtrsfzh"
                  :placeholder="'请输入委托人身份证'"
                ></el-input>
              </el-form-item>

              <!-- 大病登记原因 -->
              <el-form-item :label="'大病登记原因'" prop="yy">
                <search-select
                  table-name="SYS_FLAG_DATA"
                  kid="DB000002"
                  v-model="formData.yy"
                  :backfillValue="formData.yy"
                  :placeholder="'请选择大病登记原因'"
                />
              </el-form-item>

              <!-- 大病登记描述 -->
              <el-form-item :label="'大病登记描述'" prop="des" hidden>
                <el-input
                  v-model="formData.des"
                  :placeholder="'请输入原因描述'"
                ></el-input>
              </el-form-item>

            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 回执单 -->
    <div class="hzd">
      <table id="hzd" border="1" width="100%" cellpadding="4" style="border-collapse:collapse;">
        <tr>
          <td width="20%">姓名</td>
          <td width="30%" colspan="2">{{printInfo.personname}}</td>
          <td width="20%">就医卡卡号</td>
          <td width="30%" colspan="2">{{printInfo.cardid}}</td>
        </tr>
        <tr>
          <td>身份证号码</td>
          <td colspan="2">{{printInfo.sfzh}}</td>
          <td>联系电话</td>
          <td colspan="2">{{printInfo.lxdh}}</td>
        </tr>
        <tr>
          <td>联系地址</td>
          <td colspan="2">{{printInfo.personname}}</td>
          <td>邮政编码</td>
          <td colspan="2">{{printInfo.lxdz}}</td>
        </tr>
        <tr>
          <td>委托人姓名</td>
          <td colspan="2">{{printInfo.wtrxm}}</td>
          <td>委托人身份证号</td>
          <td colspan="2">{{printInfo.wtrsfzh}}</td> 
        </tr>
        <tr>
          <td width="20%">人员属性</td>
          <td width="20%">{{printInfo.rysx}}</td>
          <td width="10%">工作情况</td>
          <td width="20%">{{printInfo.gzqk}}</td>
          <td width="15%">操作项目</td>
          <td width="15%">登记</td>
        </tr>
        <tr>
          <td>疾病诊断</td>
          <td colspan="5">
            <div v-if="jbzdList.find(item => item.dv==printInfo.zdno)">
              {{jbzdList.find(item => item.dv==printInfo.zdno).dn}}
            </div>
            <div v-else>{{printInfo.zdno}}</div>
          </td>
        </tr>
        <tr>
          <td>治疗项目</td>
          <td colspan="5">
            <div v-if="zlxmList.find(item => item.dv==printInfo.dbtype)">
              {{zlxmList.find(item => item.dv==printInfo.dbtype).dn}}
            </div>
            <div v-else>{{printInfo.dbtype}}</div>
          </td>
        </tr>
        <tr>
          <td>医疗机构名称</td><td colspan="5">{{jgName}}</td>
        </tr>
        <tr>
          <td>转出医疗机构名称</td><td colspan="5">{{printInfo.zcyymc}}</td>
        </tr>
        <tr>
          <td>登记有效期</td><td colspan="5">{{printInfo.djyxq}}</td>
        </tr>
      </table>
    </div>
    
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aQuery, aCancel, aAgainReg, aPrint } from '@/api/his/op/reg/patientMedIns.ts'
import { aReadMedAcc } from '@/api/his/basic'
import { getLodop } from '@/plugins/lodop/index.js'

declare interface IObj {
  [key: string]: string
}

@Component({
  name: ''
})

export default class extends Vue {
  private formData: any = {
    cardno: '',
    dbxm: '',
    dbzd: '',
    dbzl: '',
    ysgh: '',
    wtrxm: '',
    wtrsfzh: '',
    h: '',
    yy: '',
  }
  private formRule: any = {
    dbxm: [{required: true, message: '请选择大病项目', trigger: 'blur'}],
    dbzd: [{required: true, message: '请选择大病诊断', trigger: 'blur'}],
    ysgh: [{required: true, message: '请选择医生', trigger: 'blur'}],
    brxm: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
    djrq: [{required: true, message: '登记时间不能为空', trigger: 'blur'}]
  }
  private showLoading:boolean = false
  private listSlotHeight: number = 0 //列表高度
  private loading: boolean = false
  private info: any = {} // 大病信息
  private zlxmList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SERIOUSILLNESS_ZLXM : this.$store.state.webSqlDict.SERIOUSILLNESS_ZLXM // 大病项目
  private jbzdList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SERIOUSILLNESS_JBZD : this.$store.state.webSqlDict.SERIOUSILLNESS_JBZD // 大病诊断
  private dbzlList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SERIOUSILLNESS_DBZL : this.$store.state.webSqlDict.SERIOUSILLNESS_DBZL // 大病诊断
  private printInfo: any = {} // 打印内容
  private jgName: any = JSON.parse(localStorage.userInfo).hospitalName

  // 读卡
	private readCard(carddata: any){
    let params = {
      carddata: carddata,
      cardtype: 0
    }
		aReadMedAcc(params).then((res: any) => {
			if(res){
        // if(carddata!='read'){
        //   this.formData.knsj = carddata
        // }
        // this.formData.cardno = res.data.cardid
        this.formData.ybkh = res.data.cardid
        this.formData.brxm = res.data.personname
        this.formData.sfzh = res.data.sfzh
			}
		})
	}
	
  
  // 登记查询
  private query(){
    this.loading = true
    let params = {
      cardno: this.info.cardid||'read',
      djlb: 4
    }
    aQuery(params).then((res: any) => {
      if(res.errorCode=='SUCCESS'){
        this.info = res.data
      }else{
        this.info = []
        this.$message({
          message: res.message,
          type: 'error',
        })
      }
      this.loading = false
    })
  }

  // 撤销
  private cancel(dbxm: any){
    this.loading = true
    let params = {
      cardno: this.formData.cardno||'read',
      dbxm: dbxm,
      cxtype: 4,
    }
    aCancel(params).then((res: any) => {
      if(res){
        this.$notify({
          title: '撤销成功',
          message: '',
          type: 'success'
        })
        this.query()
      }
    })
  }

  // 重新登记
  private again(){
    const formData: any = this.$refs.formData
    formData.validate((valid: any)=>{
      if(valid){
        this.showLoading = true
        let params = {
          ...this.formData,
          cardno: this.formData.cardno||'read',
          cxtype: 4,
        }
        aAgainReg(params).then((res: any) => {
          this.showLoading = false
          if(res){
            this.$notify({
              title: '登记成功',
              message: '',
              type: 'success'
            })
            this.reset()
            this.query()
            this.printHzd(res.data.jzdyh, res.data.dbtype, res.data.zdno)
          }
        }).catch((err:any)=>{
          this.showLoading = false
        })

      }
    })
  }

  // 重置
  private reset(){
    const formData: any = this.$refs.formData
    formData.resetFields()
  }

  // 打印回执单
  private printHzd(jzdyh: any, dbtype: any, zdno: any){
    aPrint({jzdyh: jzdyh}).then((res: any) => {
      if(res){
        this.printInfo = res.data
        this.$set(this.printInfo, 'dbtype', dbtype)
        this.$set(this.printInfo, 'zdno', zdno)
        this.$nextTick(()=>{
          const __qiankun__ = window.__POWERED_BY_QIANKUN__
          let LODOP: any = null
          if (__qiankun__) {
            console.log('主项目')
            LODOP = Vue.prototype.$getLodop()
          } else {
            console.log('子项目')
            LODOP = getLodop()
          }
          LODOP.PRINT_INIT('打印大病登记回执单')
          LODOP.SET_PRINT_PAGESIZE(1, "210mm", "139.7mm", "")
          LODOP.ADD_PRINT_TEXT("20mm","70mm","100mm","8mm","基本医疗保险门诊大病登记回执单")
          LODOP.SET_PRINT_STYLEA(0,'FontSize',14)
          let hzd: any = document.getElementById("hzd")
          LODOP.ADD_PRINT_TABLE("30mm","10mm", "RightMargin:10mm","100%",hzd.outerHTML)
          LODOP.ADD_PRINT_TEXT("106mm","12mm","50mm","8mm",`经办机构：${this.jgName}`)
          LODOP.ADD_PRINT_TEXT("106mm","150mm","60mm","8mm",`打印时间：${this.printInfo.dqsj}`)



          LODOP.PREVIEW()
          // LODOP.PRINT()
        })
      }
    })
    
    
  }

  //初始化的周期函数
	created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 74
  }
  mounted() {
	}
}
</script>

<style lang="scss" scoped>
.header1 ::v-deep{
  .search{
    .el-input__inner{
      width: 100%!important;
      font-size: 13px;
    }
    &.cardno{
      width: 200px!important;
    }
    &.name{
      width: 120px!important;
    }
  }
  .date-wrapper{
    width: 150px;
  }
  .el-select{
    .el-input__icon{
      line-height: 28px;
    }
  }
  .el-radio-group{
    .el-radio{
      margin-right: 10px;
      .el-radio__label{
        padding-left: 4px;
      }
      &:last-child{
        margin-right: 0;
      }
    }
  }
}
.header2{
  .card{
    ::v-deep .icon{
      font-size: 16px;
    }
  }
}
span.status{
  font-size: 13px;
}
.el-form{
  padding: 0 30px!important;
  .search-select{
    margin-right: 0;
  }
  .el-form-item{
    float: none;
    width: 100%;
  }
  .el-textarea{
    ::v-deep .el-textarea__inner{
      border: none;
      background: $lightGray;
    }
  }
}
// 下拉箭头
#cascade-address{
  ::v-deep .is-focus .el-icon-arrow-up{
    transform: rotate(0);
  }
}

.hzd{
  position: absolute;
  bottom: 20px;
  z-index: -1;
  width: 90%;
}

#hzd{
  th,td{
    border: 1px solid #000;
  }
}
</style>
