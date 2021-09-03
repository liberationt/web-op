<template>
  <el-dialog
    :title="'工伤'"
    :visible.sync="dialogVisible"
    v-if="dialogVisible"
    width="350px"
    :show-close="false"
    :close-on-click-modal="false"
    :destroy-on-close="false"
    class=""
  >
    <div class="db-label">工伤认定号</div>
    <el-input v-model="gsrdh"></el-input>
    

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="checkGs" :loading="btnLoading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aCheckGs } from '@/api/his/op/reg/registerManage.ts'

@Component({
  name: ''
})

export default class extends Vue {
  @Prop({ required: true, default: () => ({}) }) private jzkh: any // 就诊卡号
  @Prop({ required: true, default: () => ({}) }) private cardtype: any // 就诊卡号
  @Prop({ required: true, default: () => ({}) }) private value: any // 工伤认定号
  @Prop({ required: true, default: () => ({}) }) private brid: any // 工伤认定号

  private dialogVisible: boolean = false
  private isDisabled: boolean = false
  private listSlotHeight: number = 400
  private selectLoading: boolean = false
  private btnLoading: boolean = false

  get gsrdh() {
    return this.value
  }

  set gsrdh(value: any) {
    this.$emit('input', value)
  }


  // 打开弹窗
	private openDialog(){
    this.dialogVisible = true
  }
  


	// 关闭弹窗后
	private closeDialog(){

	}


  private cancel(){
    this.dialogVisible = false
    this.$emit('cancel')
  }

  private checkGs(){
    if(this.cardtype == ''){
      this.$notify({
        title: '请先读卡',
        message: '',
        type: 'warning'
      })
      return false
    }
    let params = {
      carddata: this.jzkh,
      cardtype: this.cardtype,
      gsrdh: this.gsrdh,
      brid: this.brid
    }
    aCheckGs(params).then((res: any) => {
      if(res){
        this.dialogVisible = false
      }
    })
  }


  //初始化的周期函数
	created() {
  }
  mounted() {
    // this.zlxmListClone = JSON.parse(JSON.stringify(this.zlxmList))
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

.el-input{
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
