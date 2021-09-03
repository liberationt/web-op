<!--
 * @Date: 
 * @LastEditTime: 
 * @Description: 静脉配置给药途径
 * @FilePath: 
-->

<template>
  <div class="content opertionIncome">
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="his-module his-small" :style="{  marginBottom: '10px' }">
          <div class="row" style="border-bottom :none;margin:0;padding:0">
            <div class="label">
              <span class="title">{{$t('静脉配置给药途径设置')}}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12" class="ht">
        <div
          class="his-module his-small ht"
          :style="{ height: listSlotHeight  - 65  + 'px', marginBottom: '10px' }"
        >
          <div class="row">
            <div class="label configuration">
              <el-checkbox :indeterminate="isChecked" v-model="isAllChecked" @change="handleCheckAll"></el-checkbox>
              <span class="title ml10">{{$t('已选择的给药途径')}}</span>
              <el-divider direction="vertical" class="mr4"></el-divider>
              <el-input v-model='yValue' placeholder="请输入给药途径名称、拼音码查询" clearable @change="handleCheckedEnter" @clear="handleCheckedClear">
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input>
            </div>
            <div class="texts">{{checkedList.length}}/{{checkedAllList.length}}</div>
          </div>
          <el-row :gutter="10">
            <el-checkbox-group class="el-check" v-model="checkedList" @change="handleChangechecked">
              <el-checkbox v-for="item in checkedAllList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-row>
          <!-- 穿梭按钮 -->
          <div class="left-right">
            <div style="margin-bottom:26px">
              <el-button
                :type="uncheckedList.length > 0 ? 'primary': 'info'"
                circle
                @click="handleAdd"
                :disabled="uncheckedList.length==0"
              >
                <i class="icon his-lt-arrow"></i>
              </el-button>
            </div>
            <div>
              <el-button
                :type="checkedList.length > 0 ? 'primary': 'info'"
                circle
                :disabled="checkedList.length==0"
                @click="handleRemove"
              >
                <i class="icon his-rt-arrow"></i>
              </el-button>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="his-module his-small" :style="{ height: listSlotHeight  - 65  + 'px', marginBottom: '10px' }">
          <div class="row">
            <div class="label configuration">
              <el-checkbox :indeterminate="isUnchecked"  v-model="isAllUnchecked" @change="handleUncheckAll"></el-checkbox>
              <span class="title ml10">{{$t('可选择的给药途径')}}</span>
              <el-divider direction="vertical" class="mr4"></el-divider>
              <el-input v-model="nValue" placeholder="请输入给药途径名称、拼音码查询" clearable @change="handleUncheckedEnter" @clear="handleUncheckedClear">
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input>
            </div>
            <div class="texts">{{uncheckedList.length}}/{{uncheckedAllList.length}}</div>
          </div>
          <el-row :gutter="10">
            <el-checkbox-group class="el-check" v-model="uncheckedList" @change="handleChangeUnchecked">
              <el-checkbox v-for="item in uncheckedAllList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang='ts' >
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { 
  queryUnchecked,
  queryChecked,
  drugUsageAdd,
  drugUsageRemove   
} from '@/api/his/inject/infusiondrugs/administrationRoute.ts'
import { Script } from 'vm'
import { log } from 'util'
@Component({
  name: 'administrationRoute',
  components: {},
})
export default class extends Vue {
  private listSlotHeight: number = 0 //列表高度
  private yfsb: number | null = null // 药房识别
  private yValue: string = '' // 可选择的给药途径检索字段
  private nValue: string = '' // 可选择的给药途径检索字段
  private isAllChecked: boolean = false //可选择的给药途径是否全选
  private isUnchecked: boolean = false // 可选择的给药途径是否选择
  private isAllUnchecked: boolean = false //可选择的给药途径是否全选
  private isChecked: boolean = false // 已选择的给药途径是否选择
  private uncheckedAllList: Array<any> = [] // 全部可选择的给药途径列表
  private uncheckedList: Array<any> = [] // 可选择的给药途径列表
  private checkedAllList: Array<any> = []  // 全部已选择的给药途径列表
  private checkedList: Array<any> = [] // 已选择的给药途径列表
  private checkedRight: boolean = false
  
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
    // 获取yfsb
    this.yfsb = Vue.prototype.AUTHORITY.bussinessRole
  }

  mounted(){
    this.queryUnchecked()
    this.queryChecked()
  }

  /*@methods: queryUnchecked
   *@description: 查询可选择的给药途径列表
   */
  private queryUnchecked(){  
    let param = {
      yfsb: this.yfsb,
      value: this.nValue
    }
    queryUnchecked(param).then((res: any) => {
      if(res.errorCode == 'SUCCESS'){
        this.uncheckedAllList = res.data
      }
    })
  }

  /*@methods: queryChecked
   *@description: 查询已选择的给药途径列表
   */
  private queryChecked(){
    let param = {
      yfsb: this.yfsb,
      value: this.yValue
    }
    queryChecked(param).then((res: any) => {
      if(res.errorCode == 'SUCCESS'){
        this.checkedAllList =  res.data
      }
    })
  }

  /*@methods: handleCheckAll
   *@description: 是否全选已选择的给药途径列表
   */
  private handleCheckAll(val: boolean){
    let list: Array<any> = []
    // 遍历已选择的给药途径列表获取全部id
    this.checkedAllList.map((v: any) => {
      list.push(v.id)
    })
    this.checkedList = val ? list : []
  }

  /*@methods: handleUncheckAll
   *@description: 是否全选可选择的给药途径列表
   */
  private handleUncheckAll(val: boolean){
    let list: Array<any> = []
    // 遍历可选择的给药途径列表获取全部id
    this.uncheckedAllList.map((v: any) => {
      list.push(v.id)
    })
    this.uncheckedList = val ? list : []
  }

  /*@methods: handleUncheckedEnter
   *@description: 查询已选择的给药途径列表
   */
  private handleCheckedEnter(){
    this.queryChecked()
  }
  
  /*@methods: handleUncheckedEnter
   *@description: 清空搜索框查询已选择的给药途径列表
   */
  private handleCheckedClear(){
    this.queryChecked()
  }

  /*@methods: handleUncheckedEnter
   *@description: 查询可选择的给药途径列表
   */
  private handleUncheckedEnter(){
    this.queryUnchecked()
  }
  
  /*@methods: handleUncheckedEnter
   *@description: 清空搜索框查询可选择的给药途径列表
   */
  private handleUncheckedClear(){
    this.queryUnchecked()
  }
  
  /*@methods: handleChangeUnchecked
   *@description: 是否单选可选择的给药途径列表
   */
  private handleChangeUnchecked(value: any){
    let length: any = value.length
    this.isAllUnchecked = length === this.uncheckedAllList.length
    this.isUnchecked = length > 0 && length < this.uncheckedAllList.length
  }
  
  /*@methods: handleChangechecked
   *@description: 是否单选已选择的给药途径列表
   */
  private handleChangechecked(value: any){
    let length: any = value.length
    this.isAllChecked = length === this.checkedAllList.length
    this.isChecked = length > 0 && length < this.checkedAllList.length
  }

  /*@methods: handleAdd
   *@description: 添加给药途径
   */
  private handleAdd(){
    let param: any = {
      ids: this.uncheckedList.join(','),
      yfsb: this.yfsb
    }
    drugUsageAdd(param).then((res: any) => {
      if(res.errorCode == 'SUCCESS'){
        this.$notify({
          title: '添加给药途径成功！',
          message: '',
          type: 'success'
        })
        this.uncheckedList = [] // 清空已选择给药途径
        this.isUnchecked = false
        this.isAllUnchecked = false
        this.queryUnchecked()
        this.queryChecked()
      }
    })
  }

  /*@methods: handleRemove
   *@description: 移除给药途径
   */
  private handleRemove(){
    let param: any = {
      ids: this.checkedList.join(','),
      yfsb: this.yfsb
    }
    drugUsageRemove(param).then((res: any) => {
      if(res.errorCode == 'SUCCESS'){
        this.$notify({
          title: '移除给药途径成功！',
          message: '',
          type: 'success'
        })
        this.checkedList = [] // 清空已选择给药途径
        this.isChecked = false
        this.isAllChecked = false
        this.queryUnchecked()
        this.queryChecked()
      }
    })
  }
}
</script>

<style scoped lang='scss'>
.el-check{
  padding: 6px 20px 16px;
  .el-checkbox{
    margin: 0;
    margin-bottom: 20px;
    width: 20%;
    display: inline-block;
    box-sizing: border-box;
  }
}
.configuration{
  .title {
    font-size: 14px !important;
  }
  ::v-deep.el-input{
    .el-input__inner{
      width: 260px !important;
    }
  }

}
.content .his-small .el-form .el-form-item .el-input--medium {
  margin-bottom: 16px;
}
.content .his-small ::v-deep .el-form .el-form-item .el-form-item__label {
  line-height: 12px !important;
}
.texts {
  height: 28px;
  font-size: 14px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: rgba(156, 160, 171, 1);
  line-height: 28px;
}
.left-right {
  // float: right;
  position: absolute;
  top: 30%;
  right: -24px;
  z-index: 9999;
  button {
    border: 1px solid $white;
  }
  .el-button--info.is-disabled,
  .el-button--info.is-disabled:hover,
  .el-button--info.is-disabled:focus,
  .el-button--info.is-disabled:active {
    background: $disabled;
  }
  .el-button--primary {
    background: $blue;
  }
  .el-button--medium.is-circle {
    position: relative;
    padding: 0;
    width: 36px;
    height: 36px;
    line-height: 36px;
    display: flex;
    justify-content: center;
    .icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      margin: 0;
      font-size: 12px;
    }
  }
}
</style>