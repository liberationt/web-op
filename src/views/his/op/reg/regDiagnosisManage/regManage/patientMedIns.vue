<template>
  <div class="content">
    <div class="his-module his-small upper">
      <div class="row">
        <div class="label">
          <div class="title">患者医保登记查询</div>
          <el-divider direction="vertical"></el-divider>
          <div class="btn">
            <el-button type="text" @click="query">
              <i class="icon his-caozuo-Details blue"></i>登记查询
            </el-button>
            <el-button type="text" @click="cancel">
              <i class="icon his-caozuo_cexiaozhuanyuan blue"></i>撤销登记
            </el-button>
            <el-button type="text" @click="again">
              <i class="icon his-caozuo-update-information green"></i>重新登记
            </el-button>
          </div>
        </div>
      </div>
      <div class="">
        <el-form :model="formData" label-width="60px" class="form4 clearfix">

          <!-- 卡内信息 -->
          <el-form-item :label="'卡内信息'" prop="cardno">
            <el-input
              v-model="formData.cardno"
              :placeholder="'请输入卡内信息'"
            ></el-input>
          </el-form-item>

          <!-- 住院号码 -->
          <el-form-item :label="'住院号码'">
            <el-input
              v-model="formData.zyhm"
              :placeholder="'请输入住院号码'"
            ></el-input>
          </el-form-item>

          <!-- 诊断编码 -->
          <el-form-item :label="'诊断编码'">
            <el-input
              v-model="formData.zdno"
              :placeholder="'请输入诊断编码'"
            ></el-input>
          </el-form-item>

          <!-- 登记日期 -->
          <el-form-item :label="'登记日期'">
            <el-date-picker
              type="date"
              v-model="formData.djrq"
              :placeholder="'请选择日期'"
              class="date-wrapper"
            ></el-date-picker>
          </el-form-item>

          <!-- 医院代码 -->
          <el-form-item :label="'医院代码'">
            <el-input
              v-model="formData.e"
              :placeholder="'请输入医院代码'"
            ></el-input>
          </el-form-item>

          <!-- 登记类别 -->
          <el-form-item :label="'登记类别'" prop="djlb">
            <search-select
              table-name="SYS_PRIMARY_DATA"
              kid="YB0000000001"
              v-model="formData.djlb"
              :backfillValue="formData.djlb"
              :placeholder="'请选择登记类别'"
            />
          </el-form-item>

          <!-- 大病项目 -->
          <el-form-item :label="'大病项目'">
            <el-input
              v-model="formData.g"
              :placeholder="'请选择'"
            ></el-input>
          </el-form-item>

          <div class="btns" style="display: none;">
            <el-button
              type="primary"
              class="blue"
            >登记查询</el-button>
            <el-button
            >撤销登记</el-button>
            <el-button
            >重新登记</el-button>
          </div>

        </el-form>
      </div>
    </div>
    <div class="his-module his-small lower">
      <div class="row">
        <div class="label">
          <div class="searchTitle">卡内信息</div>
          <el-input
            :placeholder="'请输入卡内信息'"
            class="search"
          >
            <i slot="prefix" class="el-input__icon icon his-search"></i>
          </el-input>
        </div>
      </div>
      <div class="table-wrap">
        <table class="original-table">
          <tr>
            <th>名称</th><th>值</th><th>名称</th><th>值</th><th>名称</th><th>值</th>
          </tr>
          <tr>
            <td>卡类型</td>
            <td>{{info.cardtype}}</td>
            <td>卡号</td>
            <td>{{info.cardid}}</td>
            <td>姓名</td>
            <td>{{info.personname}}</td>
          </tr>
          <tr>
            <td>账户标志</td>
            <td>{{info.accountattr}}</td>
            <td>登记类型</td>
            <td>{{info.djlb}}</td>
            <td>登记号</td>
            <td>{{info.djxxs[0].djno}}</td>
          </tr>
          <tr>
            <td>开始日期</td>
            <td>{{info.djxxs[0].startdate}}</td>
            <td>结束日期</td>
            <td>{{info.djxxs[0].enddate}}</td>
            <td>诊断编码</td>
            <td>{{info.djxxs[0].zdno}}</td>
          </tr>
          <tr>
            <td>大病项目</td>
            <td>{{info.djxxs[0].dbtype}}</td>
            <td>登记医院标志</td>
            <td>{{info.djxxs[0].djhossame}}</td>
            <td>登记医院</td>
            <td>{{info.djxxs[0].djhosname}}</td>
          </tr>
          <tr>
            <td>当年账户</td>
            <td>{{info.curaccountamt}}</td>
            <td>历年账户</td>
            <td>{{info.hisaccountamt}}</td>
          </tr>
        </table>
      </div>
    </div>
	</div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aQuery, aCancel, aAgainReg } from '@/api/his/op/reg/patientMedIns.ts'

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
    djlb: ''
  }
  private info: any = {
    djxxs: [{}]
  }



	// 获取列表
  private getLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.getList()
  }

	

  // 条件查询
  searchLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }

  // 登记查询
  private query(){
    let params = {
      cardno: this.formData.cardno||'read',
      djlb: this.formData.djlb
    }
    aQuery(params).then((res: any) => {
      if(res.errorCode=="SUCCESS"){
        this.info = res.data
      }else{
        this.$message.error(res.message)
      }
    }).catch((err:any)=>{
    })
  }

  // 撤销
  private cancel(){
    let params = {
      cardno: this.formData.cardno,
      cxtype: this.formData.cxtype,
      dbxm: this.formData.dbxm
    }
    aCancel(params).then((res: any) => {
      if(res.errorCode == "SUCCESS"){
        this.$message.success("撤销成功！")
      }
    })
  }

  // 重新登记
  private again(){
    let params = {
      cardno: this.formData.cardno||'read',
      cxtype: this.formData.djlb,
      dbxm: this.formData.dbxm,
      zyhm: this.formData.zyhm
    }
    aAgainReg(params).then((res: any) => {
      if(res){
        
      }
    })
  }
	



  //初始化的周期函数
	created() {
  }
  mounted() {
    for(let i in this.obj){
      this.obj[i]
    }
  }
  // mounted() {
	// 	this.getLists()
	// }
}
</script>

<style lang="scss" scoped>
.content{
  display: flex;
  flex-direction: column;
}
.upper{
  height: auto;
}
.lower{
  flex-grow: 1;
  margin-top: 10px;
}
.table-wrap{
  padding-bottom: 10px;
  border-bottom: 1px solid $lightGray;
  table{
    td{
      &:nth-child(odd){
        width: 18%;
      }
      &:nth-child(even){
        // width: calc(100%/3*60%);
      }
    }
  }
}
.normal-form-wrap{
  .el-form{
    width: 30%;
    margin: 40px auto 0!important;
  }
}

//四列表单
.form4{
	margin: 0!important;
	.el-form-item{
		float: left;
		width: calc((100% - 30px*3)/4);
    margin-right: 30px;
    margin-bottom: 8px!important;
		&:nth-child(4n){
			margin-right: 0;
    }
    &:nth-last-child(-n+4){
      margin-bottom: 0!important;
    }
  }
  .search-select{
    width: 100%;
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

.row .search ::v-deep .el-input__inner{
  width: 190px!important;
}
</style>
