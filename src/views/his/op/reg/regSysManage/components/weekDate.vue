<template>
  <div class="dataInfo" @dblclick="getForm">
    <div v-if="showWeekDate">
      <div>
          <span>挂号:</span>
          <span>{{dataInfo.ghxe}}</span>
      </div>
      <div>
          <span>预约:</span>
          <span>{{dataInfo.yyxe}}</span>
      </div>
      <div class="btn">
          <span @click="showDataDialog(dataInfo)">复制</span>
          <span @click="deleteDataCopy(dataInfo)">删除</span>
      </div>
    </div>
    <div v-else class="nodata"></div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

//声明接口
declare interface pageList {
  id: number
}

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: '',
//   filters: {}
})
export default class extends Vue {
  //声明变量，方法
  @Prop({ required: false,default:() => {return {ghxe:'',yyxe:''}} }) private dataInfo: any // key
  @Prop({ required: false,default:false }) private showWeekDate: any // key
  @Prop({ required: false }) private rowData: any // key

  //初始化的周期函数
  private showDataDialog(row:any){
    this.$emit('showDataDialog',row)
  }
  private deleteDataCopy(row:any){
    this.$emit('deleteDataCopy',row)
  }
  private getForm(){
    this.$emit('getFormData',this.dataInfo,this.rowData)
  }
  created() {
    
  }
  mounted() {

  }
    
}
</script>
<style lang="scss" scoped>
    .dataInfo{
      cursor: pointer;
      padding-top:10px;
        .btn{
            display: flex;
            padding:5px 0 10px;
            justify-content: space-around;
            span{
                background:#169bd5;
                color:#fff !important;
                padding:0px 8px;
                border-radius: 3px;
                font-size: 10px !important;
                cursor: pointer;
            }
        }
        .nodata{
          width:100%;
          height:100px;
        }
    }
    // .content .his-module .el-table--medium td .cell span{
    //     color:#fff;
    // }
</style>