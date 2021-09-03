<template>
  <div class="content">
    <div class="his-module his-small upper">
      <div class="row">
        <div class="label">
          <div class="title">大病医保登记</div>
          <el-divider direction="vertical"></el-divider>
          <div class="btn">
            <el-button size="mini" type="text" @click="query">
              <i class="icon his-caozuo-Details blue"></i>查询
            </el-button>
            <el-button size="mini" type="text" @click="again">
              <i class="icon his-caozuo-update-information green"></i>登记
            </el-button>
            <el-button size="mini" type="text" @click="cancel">
              <i class="icon his-caozuo_cexiaozhuanyuan blue"></i>撤销登记
            </el-button>
          </div>
        </div>
      </div>
      <div class="">
        <el-form :model="formData" label-width="84px" class="form5 clearfix">
          <!-- 卡内信息 -->
          <el-form-item :label="'卡内信息'" prop="cardno">
            <el-input
              v-model="formData.cardno"
              :placeholder="'请输入卡内信息'"
              @keyup.enter.native="readCard(formData.cardno)"
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

          <!-- 转院原因 -->
          <el-form-item :label="'转院原因'" prop="h">
            <el-select v-model="formData.h">
              <el-option :value="1">其他</el-option>
            </el-select>
          </el-form-item>

          <!-- 原因描述 -->
          <el-form-item :label="'原因描述'" prop="yy">
            <el-input
              v-model="formData.yy"
              :placeholder="'请输入原因描述'"
            ></el-input>
          </el-form-item>

        </el-form>
      </div>
    </div>
    <div class="his-module his-small lower">
      <div class="table-wrap" v-if="info.djxxs" style="display:none">
        <table class="original-table">
          <tr>
            <th>名称</th><th>值</th>
          </tr>
          <tr>
            <td>卡类型</td>
            <td>{{info.cardtype}}</td>
          </tr>
          <tr>
            <td>卡号</td>
            <td>{{info.carddata}}</td>
          </tr>
          <tr>
            <td>姓名</td>
            <td>{{info.personname}}</td>
          </tr>
          <tr>
            <td>大病项目1</td>
            <td>{{info.djxxs[0].dbtype}}</td>
          </tr>
          <tr>
            <td>大病子类1</td>
            <td></td>
          </tr>
          <tr>
            <td>诊断编码1</td>
            <td></td>
          </tr>
          <tr>
            <td>是否本院登记1</td>
            <td></td>
          </tr>
          <tr>
            <td>开始日期1</td>
            <td></td>
          </tr>
          <tr>
            <td>结束日期1</td>
            <td></td>
          </tr>
          <tr>
            <td>大病项目2</td>
            <td></td>
          </tr>
          <tr>
            <td>大病子类2</td>
            <td></td>
          </tr>
          <tr>
            <td>诊断编码2</td>
            <td></td>
          </tr>
          <tr>
            <td>是否本院登记2</td>
            <td></td>
          </tr>
          <tr>
            <td>开始日期2</td>
            <td></td>
          </tr>
          <tr>
            <td>结束日期2</td>
            <td></td>
          </tr>
        </table>
      </div>
      <el-table
        stripe
        :highlight-current-row="true"
        :data="info.djxxs"
        :height="'100%'"
        border
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
            <div v-if="dbzlList.find(item => item.dv==scope.row.dbzl)">
              {{dbzlList.find(item => item.dv==scope.row.dbzl).dn}}
            </div>
            <div v-else>{{scope.row.dbzl}}</div>
          </template>
        </el-table-column>

        <el-table-column prop="zdno" :label="'诊断'">
          <template slot-scope="scope">
            <div v-if="jbzdList.find(item => item.dv==scope.row.zdno)">
              {{jbzdList.find(item => item.dv==scope.row.zdno).dn}}
            </div>
            <div v-else>{{scope.row.zdno}}</div>
          </template>
        </el-table-column>

        <el-table-column prop="djhosname" :label="'登记医院名称'"></el-table-column>

        <el-table-column prop="djhossame" :label="'是否本院登记'">
          <template slot-scope="scope">
            <div v-if="scope.row.djhossame==0">是</div>
            <div v-else>否</div>
          </template>
        </el-table-column>
        <el-table-column prop="startdate" :label="'开始日期'"></el-table-column>
        <el-table-column prop="enddate" :label="'结束日期'"></el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" width="60" align="center" class-name="action-btns">
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
          </template>
        </el-table-column>
      </el-table>
    </div>
	</div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aQuery, aCancel, aAgainReg } from '@/api/his/op/reg/patientMedIns.ts'
import { aReadMedAcc } from '@/api/his/basic'

declare interface IObj {
  [key: string]: string
}

@Component({
  name: ''
})

export default class extends Vue {
	private obj: IObj = {
    name: '',
    value: '',
  }
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
  private info: any = {} // 大病信息
  private zlxmList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SERIOUSILLNESS_ZLXM : this.$store.state.webSqlDict.SERIOUSILLNESS_ZLXM // 大病项目
  private jbzdList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SERIOUSILLNESS_JBZD : this.$store.state.webSqlDict.SERIOUSILLNESS_JBZD // 大病诊断
  private dbzlList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SERIOUSILLNESS_DBZL : this.$store.state.webSqlDict.SERIOUSILLNESS_DBZL // 大病诊断

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
    let params = {
      cardno: this.formData.cardno||'read',
      djlb: 4
    }
    aQuery(params).then((res: any) => {
      if(res){
        this.info = res.data
      }
    })
  }

  // 撤销
  private cancel(dbxm: any){
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
      }
    })
  }

  // 重新登记
  private again(){
    let params = {
      ...this.formData,
      cardno: this.formData.cardno||'read',
      cxtype: 4,
    }
    aAgainReg(params).then((res: any) => {
      if(res){
        this.$notify({
          title: '登记成功',
          message: '',
          type: 'success'
        })
      }
    })
  }
	



  //初始化的周期函数
	created() {
  }
  mounted() {
	}
}
</script>

<style lang="scss" scoped>
.content{
  display: flex;
  flex-direction: column;
}
.upper{
  height: auto;
  padding-bottom: 0;
}
.lower{
  flex-grow: 1;
  margin-top: 10px;
}
// 五列表单
.form5{
  margin: 0!important;
  .el-form-item{
    float: left;
    width: calc((100% - 20px*4)/5);
    margin-right: 20px;
    margin-bottom: 10px!important;
    &:nth-child(5n){
      margin-right: 0;
    }
    ::v-deep .el-form-item__label{
      padding-right: 0!important;
    }
  }
}
.icon-left{
  ::v-deep .el-input__inner{
    padding-left: 22px!important;
  }
}

.table-wrap{
  display: flex;
  justify-content: space-between;
  table{
    td{
      &:nth-child(odd){
        width: 15%;
      }
      &:nth-child(even){
        width: 10%
      }
    }
  }
}
.normal-form-wrap{
  .el-form{
    width: 30%;
    margin: 10px auto 0!important;
  }
}
.btns{
  margin-top: 30px;
  text-align: center;
  .el-button{
    display: inline-block;
    width: calc((100% - 20px)/3);
    text-align: center;
  }
  .el-button--default{
    color: $second;
  }
}
</style>
