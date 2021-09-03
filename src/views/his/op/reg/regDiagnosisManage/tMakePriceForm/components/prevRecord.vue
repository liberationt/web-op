<template>
  <div class="his-module his-small prev-info">
    <div class="row">
      <div class="label">
        <i class="icon his-patient-info"></i>
        <div>上个操作记录</div>
      </div>
    </div>
    <div class="record" v-if="Object.keys(opSettlePrevRecord).length">
      <p>
        <span>卡号：</span>
        <span>{{opSettlePrevRecord.jzkh}}</span>
      </p>
      <p v-if="0">
        <span>cardtype：</span>
        <span>{{opSettlePrevRecord.cardtype}}</span>
      </p>
      <p>
        <span>总计金额：</span>
        <span>&yen; {{opSettlePrevRecord.zjje}}</span>
      </p>
      <p>
        <span>自负金额：</span>
        <span>&yen; {{opSettlePrevRecord.zfje}}</span>
      </p>
      <p>
        <span>应收款：</span>
        <span>&yen; {{opSettlePrevRecord.ysk}}</span>
      </p>
      <p>
        <span>缴款：</span>
        <span>&yen; {{opSettlePrevRecord.jkje}}</span>
      </p>
      <p>
        <span>退找：</span>
        <span>&yen; {{opSettlePrevRecord.tzje}}</span>
      </p>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

@Component({
  name: ''
})

export default class extends Vue {

	private opSettlePrevRecord: any = localStorage.getItem('opSettlePrevRecord')



  //初始化的周期函数
	created() {
    
  }
  mounted() {
    if(this.opSettlePrevRecord!=null){
      this.opSettlePrevRecord = JSON.parse(this.opSettlePrevRecord)
    }else{
      this.opSettlePrevRecord = {}
    }
	}
}
</script>

<style lang="scss" scoped>
.prev-info{
  .label{
    .icon{
      padding: 2px 4px;
      font-size: 12px;
      color: #fff;
      border-radius: 4px;
      background: $blue;
    }
    div{
      margin-left: 4px;
      font-size: 14px;
    }
  }
  .record{
    padding: 4px 0 0 8px;
    p{
      margin-bottom: 8px;
      @include clearfix;
      span{
        float: left;
        font-size: 13px;
        &:nth-child(1){
          width: 68px;
          // text-align: right;
        }
        &:nth-child(2){
          color: $blue;
          font-family: "siyuanMedium";
        }
      }
    }
  }
}
</style>