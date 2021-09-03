<template>
  <div class="content">
    <div class="his-module his-small ht">
      <div class="row">
        <div class="label">
          <div class="title">患者账户查询签约</div>
          <el-divider direction="vertical"></el-divider>
          <div class="searchTitle">卡内信息</div>
          <el-input
            v-model="carddata"
            :placeholder="'请输入卡内信息'"
            class="search"
            @keyup.enter.native="readCard(carddata)"
          >
            <i slot="prefix" class="el-input__icon icon his-search"></i>
          </el-input>
          <el-divider direction="vertical"></el-divider>

          <div class="btn">
            <el-button
              type="text"
              size="mini"
              @click="readCard('1')"
            >
              <i class="icon his-reading-card blue"></i>
              <span>读卡</span>
            </el-button>
            <el-button
              type="text"
              size="mini"
            >
              <i class="icon his-btn-print blue"></i>
              <span>打印</span>
            </el-button>
          </div>
        </div>
      </div>
      <div class="table-wrap">
        <table class="original-table">
          <tr>
            <th>名称</th><th>值</th>
          </tr>
          <tr>
            <td>卡号</td>
            <td>{{info.cardid}}</td>
          </tr>
          <tr>
            <td>姓名</td>
            <td>{{info.personname}}</td>
          </tr>
          <tr>
            <td>值退情况</td>
            <td>{{info.ztqk}}</td>
          </tr>
          <tr>
            <td>保健对象</td>
            <td>{{info.bjdx}}</td>
          </tr>
          <tr>
            <td>公务员</td>
            <td>{{info.gwy}}</td>
          </tr>
          <tr>
            <td>特殊人员标志</td>
            <td>{{info.tsrybz}}</td>
          </tr>
          <tr>
            <td>封存标志</td>
            <td>{{info.fcbz}}</td>
          </tr>
          <tr>
            <td>当年账户余额</td>
            <td>{{info.curaccountamt}}</td>
          </tr>
          <tr>
            <td>历年账户余额</td>
            <td>{{info.hisaccountamt}}</td>
          </tr>
          <tr>
            <td>门诊支付段现金支付累计数</td>
            <td>{{info.totalmzzfdpay}}</td>
          </tr>
          <tr>
            <td>住院起付线下支付累计数</td>
            <td>{{info.qfxxpay}}</td>
          </tr>
          <tr>
            <td>门诊自负段定额</td>
            <td>{{info.rationpay}}</td>
          </tr>
          <tr>
            <td>住院起付线</td>
            <td>{{info.beinqf}}</td>
          </tr>
          <tr>
            <td>统筹支付封顶线</td>
            <td>{{info.tcfdx}}</td>
          </tr>
          <tr>
            <td>起付线上封顶线下费用累计</td>
            <td>{{info.qfxsfdxxfylj}}</td>
          </tr>
          <tr>
            <td>适用医保办法标志</td>
            <td>{{info.accountattr}}</td>
          </tr>
          <tr>
            <td>可享受医保社区减免</td>
            <td>{{info.ybsqjmbz}}</td>
          </tr>
        </table>
        <!-- <div class="divider"></div> -->
        <table class="original-table" style="height:160px">
          <tr>
            <th>名称</th><th>值</th>
          </tr>
          <tr>
            <td>医保减免签约区县</td>
            <td>{{info.ybsqjmbz}}</td>
          </tr>
          <tr>
            <td>签约医疗机构代码</td>
            <td></td>
          </tr>
          <tr>
            <td>签约医疗机构名称</td>
            <td></td>
          </tr>
          <tr>
            <td>登记时间</td>
            <td></td>
          </tr>
        </table>
      </div>
    </div>
	</div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aSwipeCard, aReadCard } from '@/api/his/op/reg/accountQuery.ts'
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
  private formData: any = {}
  private carddata: any = ''
  private info: any = {}

  // 刷卡
  // private swipeCard(){
  //   aSwipeCard({carddata: this.carddata}).then((res: any) => {
  //     if(res){
  //       this.info = res.data
  //     }
  //   })
  // }

  // 读卡
	private readCard(carddata: any){
    let params = {
      cardtype: 1,
      carddata: this.carddata||' '
    }
		aReadMedAcc(params).then((res: any) => {
			if(res){
				// this.formData.jzkh = res.data.jzkh
				// this.isRead = 1
				// this.formData.cardid = res.data.cardid
				// this.formData.cardtype = res.data.cardtype
				// this.formData.accountattr = res.data.accountattr
        // this.getPatientInfo()
        this.info = res.data
			}
		})
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
	



  //初始化的周期函数
	created() {
  }
  // mounted() {
	// 	this.getLists()
	// }
}
</script>

<style lang="scss" scoped>
.label .search{
  margin-right: 0!important;
}
.table-wrap{
  display: flex;
  justify-content: space-between;
  // padding-bottom: 10px;
  // border-bottom: 1px solid $lightGray;
  table{
    // width: 40%;
    td{
      &:nth-child(odd){
        width: 60%;
      }
      &:nth-child(even){
        // width: calc(100%/3*60%);
      }
    }
  }
  .divider{
    width: 1px;
    margin: 0 10px;
    background: $lightGray;
  }
}
.normal-form-wrap{
  .el-form{
    width: 30%;
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
