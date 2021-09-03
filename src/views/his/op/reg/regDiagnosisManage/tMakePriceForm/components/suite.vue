<template>
  <el-tabs v-model="activeName" class="tab-small underline">
    <el-tab-pane :label="'处方组套'" name="first" :disabled="!allowSgfCy">
      <el-radio-group class="small-radio-group" v-model="searchData1.ys_mz_zt01_SSLB" @change="getData">
        <el-radio label="2">本科室</el-radio>
        <el-radio label="3">全院</el-radio>
      </el-radio-group>
      <setting-list
        ref="table1"
        data-name="OP_MZ_ZT01_MS"
        :data-action="false"
        data-fixed="right"
        :data-width="0"
        v-model="tableData1"
        :list-height="listSlotHeight"
        :searchData="searchData1"
        :data-select="false"
        @selectDbCurrentRow="dblClick"
      ></setting-list>
    </el-tab-pane>
    <el-tab-pane :label="'处置组套'" name="second">
      <el-radio-group class="small-radio-group" v-model="searchData2.ys_mz_zt01_SSLB" @change="getData">
        <el-radio label="2">本科室</el-radio>
        <el-radio label="3">全院</el-radio>
      </el-radio-group>
      <setting-list
        ref="table2"
        data-name="OP_MZ_ZT01_CS"
        :data-action="false"
        data-fixed="right"
        :data-width="0"
        v-model="tableData2"
        :list-height="listSlotHeight"
        :searchData="searchData2"
        :data-select="false"
        @selectDbCurrentRow="dblClick"
      ></setting-list>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  aLoadMedcineSet, aLoadProjectSet
} from '@/api/his/op/reg/settlement.ts'

//声明接口
declare interface pageList {
  id: number
}

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: '',
  components: {
  },
  filters: {
  }
})
export default class extends Vue {
  //声明变量，方法
  @Prop({ required: true, default: () => ({}) }) private brxz: any // 病人性质
  @Prop({ required: true, default: () => ({}) }) private yfsbObj: any // 药房识别
  @Prop({ required: true, default: () => ({}) }) private officeCode: any // 药房识别
  @Prop({ required: true, default: () => ({}) }) private allowSgfCy: any // 是否开启手工方

  private tableData1: any[] = []
  private tableData2: any[] = []
  private curRow1: any = {} // 当前行
	private searchData1: any = { // 搜索参数
    ys_mz_zt01_JGID: JSON.parse(localStorage.getItem('userInfo')as any).hospitalId, // 机构id
    ys_mz_zt01_ZTLB: 4, // 组套类别不等于4
    ys_mz_zt01_SFQY: 1, // 是否启用
    ys_mz_zt01_SSLB: '', // 所属类别，全院3，科室2
    isExistYgdm: '', // 是否有员工代码
    isExistKsdm: '' // 是否有科室代码
  }
  private searchData2: any = { // 搜索参数
    ys_mz_zt01_JGID: JSON.parse(localStorage.getItem('userInfo')as any).hospitalId, // 机构id
    ys_mz_zt01_ZTLB: 4, // 组套类别等于4
    ys_mz_zt01_SFQY: 1, // 是否启用
    ys_mz_zt01_SSLB: '', // 所属类别，全院3，科室2
    isExistYgdm: '', // 是否有员工代码
    isExistKsdm: '' // 是否有科室代码
  }
	private listSlotHeight: number = 0
  private loading: boolean = false
  private formRule: any = {}
  private activeName: string = 'second'
	
	

  public setValue(value: string) {
    this.setValue(value)
  }
  public getValue() {
    return null
  }
  //监听方法
  @Watch('officeCode')
	private onValueChange(value: string) {
    console.log('科室变化');
    this.searchData1.ys_mz_zt01_SSLB = ''
    this.searchData2.ys_mz_zt01_SSLB = ''
    this.tableData1 = []
    this.tableData2 = []
  }

  // 获取数据
  private getData(value: any){
    if(this.officeCode){
      if(this.activeName=='first'){
        this.getData1(value)
      }
      if(this.activeName=='second'){
        this.getData2(value)
      }
    }else{
      this.$notify({
        title: '请先选择科室',
        message: '',
        type: 'error'
      })
    }
  }
  private getData1(value: any){
    const table1: any = this.$refs.table1
    if(value == 2){ // 科室
      this.searchData1.isExistYgdm = ''
      this.searchData1.isExistKsdm = this.officeCode
    }else{ // 全院
      this.searchData1.isExistYgdm = 1
      this.searchData1.isExistKsdm = ''
    }
    table1.getList()
  }

  private getData2(value: any){
    const table2: any = this.$refs.table2
    if(value == 2){ // 科室
      this.searchData2.isExistYgdm = ''
      this.searchData2.isExistKsdm = this.officeCode
    }else{ // 全院
      this.searchData2.isExistYgdm = 1
      this.searchData2.isExistKsdm = ''
    }
    table2.getList()
  }

  // 双击(当前行)
  private dblClick(data: any){
    if(!this.brxz){
      this.$notify({
        title: '请先调入患者信息',
        message: '',
        type: 'error'
      })
      return false
    }
    console.log('药房识别');
    console.log(this.yfsbObj);
    // 获取药房识别
    var yfsb: any = ''
    switch (data.data.YS_MZ_ZT01_ZTLB) {
      case 1: // 西
        yfsb = this.yfsbObj.xy
        break
      case 2: // 成
        yfsb = this.yfsbObj.zy
        break
      case 3: // 草
        yfsb = this.yfsbObj.cy
        break
      case 4: // 检
        yfsb = this.yfsbObj.ztlb
        break
    }
    console.log('组套类别：',data.data.YS_MZ_ZT01_ZTLB);
    console.log('药房id',yfsb);
    let params = {
      brxz: this.brxz,
      pharmacyId: yfsb, // 药房id
      ypxh: data.data.YS_MZ_ZT01_ZTBH, // 药品序号
      ztbh: data.data.YS_MZ_ZT01_ZTBH, // 组套编号
    }

    if(this.activeName=='first'){
      aLoadMedcineSet(params).then((res: any) => {
        if(res){
          this.$emit('loadedSuite', res.data, data.data.YS_MZ_ZT01_ZTLB)
        }
      })
    }
    if(this.activeName=='second'){
      aLoadProjectSet(params).then((res: any) => {
        if(res){
          this.$emit('loadedSuite', res.data, data.data.YS_MZ_ZT01_ZTLB)
        }
      })
    }
  }





  



  // getDetail
  private getDetail(){}

  // 条件查询
  private searchLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }



  //初始化的周期函数
	created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 126
  }
  mounted() {
    // this.getList1()
	}
}
</script>

<style lang="scss" scoped>
.small-radio-group{
  margin-bottom: 10px;
}
</style>