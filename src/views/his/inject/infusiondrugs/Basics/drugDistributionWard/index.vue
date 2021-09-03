<!--
 * @Date: 
 * @LastEditTime: 
 * @Description: 静脉配置发药病区设置
 * @FilePath: 
-->
<template>
  <div class="content">
    <div class="his-module his-small">
      <div slot="header" class="row">
        <div class="label">
          <span class="title">{{$t('静脉配置发药病区设置')}}</span>
        </div>
        <div class="operate">
          <el-button
            type="primary"
            class="green-gra"
            size="mini"
            icon="icon his-save"
            @click="handleSave"
          >{{$t('common.save')}}</el-button>
        </div>
      </div>
      <el-row :gutter="10">
        <el-checkbox-group v-model="selectList">
          <el-checkbox v-for='item in wardList' :key='item.id' :label="item.id" border>{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-row>
    </div>
  </div>
</template>
<script lang='ts' >
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { queryList, areaSave } from '@/api/his/inject/infusiondrugs/drugDistributionWard.ts'
import { Script } from 'vm'
@Component({
  name: 'drugDistributionWard',
  components: {},
})
export default class extends Vue {
  private listSlotHeight: number = 0 //列表高度
  private yfsb: number | null = null // 药房识别
  private wardList: Array<any> = [] // 病区列表
  private selectList: Array<any> = [] // 选择的病区列表
  
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
    // 获取yfsb
    this.yfsb = Vue.prototype.AUTHORITY.bussinessRole
  }

  mounted(){
    this.queryList()
  }
  
  /*@methods: queryList
   *@description: 查询病区配置列表
   */
  private queryList(){  
    let param = {
      yfsb: this.yfsb
    }
    queryList(param).then((res: any) => {
      if(res.errorCode == 'SUCCESS'){
        this.wardList = res.data
        if(this.wardList.length>0){
          this.wardList.map((val: any) => {
            if(val.checked){
              this.selectList.push(val.id)
            }
          })
        }
      }
    })
  }

  /*@methods: handleSave
   *@description: 保存
   */
  private handleSave(){
    if(this.selectList.length > 0){
      let param = {
        ids: this.selectList,
        yfsb: this.yfsb
      }
      areaSave(param).then((res: any) => {
        if(res.errorCode == 'SUCCESS'){
          this.$notify({
            title: '发药病区设置保存成功!',
            message: '',
            type: 'success',
          })
          this.queryList()
          this.selectList = []
        }
      })
    }else{
      this.$message({
        message: '请勾选需设置的发药病区',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-col .el-col-24 {
  padding-left: 0px !important;
  padding-right: 0px !important;
}
::v-deep .el-checkbox.is-bordered + .el-checkbox.is-bordered {
  width: 11%;
  height: 40px;
  background: rgba(245, 246, 248, 1);
  border-radius: 2px;
  border: 1px solid rgba(240, 240, 240, 1);
  margin: 8px 8px;
  text-align: center;
}
::v-deep .el-checkbox.is-bordered.el-checkbox--medium {
  width: 11%;
  height: 40px;
  background: rgba(245, 246, 248, 1);
  border-radius: 2px;
  border: 1px solid rgba(240, 240, 240, 1);
  margin: 8px 8px;
  text-align: center;
}
::v-deep .el-checkbox__label {
  padding-left: 8px !important;
}
</style>