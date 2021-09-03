<template>
  <el-dialog
    :title="'大病项目'"
    :visible.sync="dialogVisible"
    v-if="dialogVisible"
    width="350px"
    :show-close="false"
    :close-on-click-modal="false"
    :destroy-on-close="false"
    class=""
  >
    <div class="db-label">请选择</div>
    <el-select
      v-model="dbtype"
      placeholder=""
      :loading="selectLoading"
      popper-class="hidden-option"
    >
      <el-option
        v-for="item in zlxmListClone"
        :key="item.dv"
        :value="item.dv"
        :label="item.dn"
        :disabled="item.disabled"
      ></el-option>
    </el-select>
    

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="selectDbtype" :loading="btnLoading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aQuery } from '@/api/his/op/reg/patientMedIns.ts'

@Component({
  name: ''
})

export default class extends Vue {
  @Prop({ required: true, default: () => ({}) }) private jzkh: any // 就诊卡号

  private dialogVisible: boolean = false
  private isDisabled: boolean = false
  private listSlotHeight: number = 400
  private selectLoading: boolean = false
  private btnLoading: boolean = false
  private dbtype: string = '' // v-model大病项目
  private dbList: any[] = [] // 病人的大病列表
  private zlxmList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SERIOUSILLNESS_ZLXM : this.$store.state.webSqlDict.SERIOUSILLNESS_ZLXM // 治疗项目
  private zlxmListClone: any[] = []
  private jbzdList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SERIOUSILLNESS_JBZD : this.$store.state.webSqlDict.SERIOUSILLNESS_JBZD // 疾病诊断


  // 打开弹窗
	private openDialog(){
    this.dialogVisible = true
    this.selectLoading = true
    let params = {
      cardno: this.jzkh||'read',
      djlb: 4
    }
    aQuery(params).then((res: any) => {
      if(res.errorCode=='SUCCESS'){
        if(res.data.cardid == this.jzkh){
          this.dbList = res.data.djxxs
          this.filterDb()
        }else{
          this.$notify({
            title: '卡号错误',
            message: '',
            type: 'error'
          })
          this.cancel()
        }
      }else{
        this.$message({
          message: res.message,
          type: 'error',
        })
      }
    })
  }
  
  // 匹配该病人的大病
  private filterDb(){
    let arr: any[] = []
    this.dbList.forEach((item)=>{
      arr.push(item.dbtype)
    })
    console.log('arr', arr);
    console.log(this.zlxmListClone);
    // 过滤禁用
    this.zlxmListClone.forEach((item)=>{
      if(!arr.includes(item.dv)){
        this.$set(item, 'disabled', true)
      }
    })
    // 找第一个
    let index = this.zlxmListClone.findIndex((item)=>{
      return !('disabled' in item)
    })
    this.dbtype = this.zlxmListClone[index].dv
    this.selectLoading = false
  }

	// 关闭弹窗后
	private closeDialog(){

	}


  // 确认选择
  private selectDbtype(){
    if(!this.dbtype){
      this.$notify({
        title: '请选择大病项目',
        message: '',
        type: 'warning'
      })
      return false
    }
    this.btnLoading = true
    this.$emit('selected', this.dbtype)
    this.dialogVisible = false
    this.btnLoading = false
    this.dbtype = ''
    this.zlxmListClone = JSON.parse(JSON.stringify(this.zlxmList))
    this.dbList = []
    
  }

  private cancel(){
    this.dialogVisible = false
    this.$emit('cancel')
  }


  //初始化的周期函数
	created() {
  }
  mounted() {
    this.zlxmListClone = JSON.parse(JSON.stringify(this.zlxmList))
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper ::v-deep{
  .el-dialog__body{
    padding-bottom: 30px;
    text-align: center;
  }
}

.db-label{
  display: inline-block;
  margin-right: 16px;
}

.el-select{
  width: 200px;
}
// 隐藏禁用选项
.el-select-dropdown.hidden-option{
  .el-select-dropdown__item.is-disabled{
    display: none;
  }
}

.row{
	.el-input{
		flex-grow: 1;
		margin-right: 0!important;
		::v-deep .el-input__inner{
			width: 100%!important;
		}
	}
	.read-card{
		height: 28px;
		margin: 0 20px 0 4px;
		padding: 0 10px;
		::v-deep span{
			font-size: 13px;
		}
	}
}

.el-table ::v-deep td.is-right .cell{
  padding-right: 8px!important;
}
</style>
