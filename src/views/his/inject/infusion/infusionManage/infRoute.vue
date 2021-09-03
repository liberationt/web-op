<!--
 * @Date: 
 * @LastEditTime: 
 * @Description: 输液给药途径设置
 * @FilePath: 
-->

<template>
  <div class="content opertionIncome">
    <el-row :gutter="10">
      <el-col :span="24" style="display: none">
        <div class="his-module his-small" :style="{  marginBottom: '10px' }">
          <div
            slot="header"
            class="row"
            style="border-bottom :none;margin-bottom:0px;padding-bottom:0px"
          >
            <div class="label">
              <span class="title ml10">{{$t('输液给药途径设置')}}</span>
              <!-- <el-divider direction="vertical" class="mr4"></el-divider>
              <div class="searchTitle">科室</div>
              <el-select v-model="value" placeholder="请选择">
                <el-option label="注射科" :value="1"></el-option>
                <el-option label="门诊科" :value="2"></el-option>
              </el-select> -->
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12" class="ht">
        <!-- <div class="" -->
        <div
          class="his-module his-small ht transfer-wrapper"
          :style="{ height: listSlotHeight  - 10  + 'px', marginBottom: '10px' }"
        >
          <div slot="header" class="row">
            <div class="label">
              <!-- 左侧 -->
              <el-checkbox v-model="list1All" @change="changeList1All"></el-checkbox>
              <span class="title ml10">{{$t('已选择的给药途径')}}</span>
              <el-divider direction="vertical" class="mr4"></el-divider>
              <el-input
                v-model="searchLeft"
                placeholder="请输入名称、拼音码查询"
                @input="filterLeft"
              >
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input>
            </div>
            <div class="texts">{{checkList1.length}}/{{list1.length}}</div>
          </div>
          <el-checkbox-group
            v-model="checkList1"
            class="scroll-bar"
            style="height: calc(100% - 46px)"
          >
            <div>
              <el-checkbox
                v-for="item in list1"
                :key="item.gytjdm"
                :label="item.gytjdm"
              >{{item.xmmc}}</el-checkbox>
            </div>
          </el-checkbox-group>
          <!-- {{checkList1}} -->

          <!-- 穿梭按钮 -->
          <div class="left-right">
            <div style="margin-bottom:26px">
              <el-button
                :type="checkList2.length!=0 ? 'primary': 'info'"
                :disabled="checkList2.length==0"
                circle
                @click="toLeft"
              >
                <i class="icon his-lt-arrow"></i>
              </el-button>
            </div>
            <div>
              <el-button
                :type="checkList1.length!=0 ? 'primary': 'info'"
                :disabled="checkList1.length==0"
                circle
                @click="toRight"
              >
                <i class="icon his-rt-arrow"></i>
              </el-button>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="12">
        <div
          class="his-module his-small transfer-wrapper"
          :style="{ height: listSlotHeight  - 10  + 'px', marginBottom: '10px' }"
        >
          <div slot="header" class="row">
            <div class="label">
              <!-- 右侧 -->
              <el-checkbox v-model="list2All" @change="changeList2All"></el-checkbox>
              <span class="title ml10">{{$t('可选择的给药途径')}}</span>
              <el-divider direction="vertical" class="mr4"></el-divider>
              <el-input
                v-model="searchRight"
                placeholder="请输入名称、拼音码查询"
                @input="filterRight"
              >
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input>
            </div>
            <div class="texts">{{checkList2.length}}/{{list2.length}}</div>
          </div>

          <el-checkbox-group
            v-model="checkList2"
            class="scroll-bar"
            style="height: calc(100% - 46px)"
          >
            <div>
              <el-checkbox
                v-for="item in list2"
                :key="item.dv"
                :label="item.dv"
              >{{item.dn}}</el-checkbox>
            </div>
          </el-checkbox-group>
          <!-- {{checkList2}} -->
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang='ts' >
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aQueryGytjSelectedList, aSaveGytj, aDeleteGytj } from '@/api/his/inject/infusion/infusionWay.ts'

@Component({
    name: '',
    components: {},
})
export default class extends Vue {
  private listSlotHeight: number = 0 //列表高度
  private currRow: any = {}
  private pageProps: object = { layout: 'total, sizes, prev, next' }
  private searchLeft: string = '' // 搜索字段
  private searchRight: string = ''
  private list1All: boolean = false // 是否全选
  private list2All: boolean = false
  private checkList1: any[] = [] // 选中的项
  private checkList2: any[] = []
  private list1: any[] = [] // 所有选项
  private list2: any[] = []
  private list1Clone: any[] = [] // 所有选项clone
  private list2Clone: any[] = []
  private ksdm: any = Vue.prototype.AUTHORITY.bussinessRole // 当前输液科室
  private infusionWalyList: any[] = []

  // 查询已选（左侧选项）
  private getLeftList(){
    let params = {
      ksdm: this.ksdm,
      kslb: 1
    }
    aQueryGytjSelectedList(params).then((res: any) => {
      if(res){
        this.list1 = res.data
        this.list1.forEach((item: any)=>{
					if(item.pydm == null){
						item.pydm = ''
					}
				})
        this.list1Clone = JSON.parse(JSON.stringify(this.list1))
        this.getRightList()
      }
    })
  }

  // 查询可选（右侧选项）
  private getRightList(){
    let arrList1Value: any[] = []
    this.list1.forEach((item: any)=>{
      arrList1Value.push(item.gytjdm)
    })
    this.list2 = this.infusionWalyList.filter((item: any)=>{
      return !arrList1Value.includes(item.dv.toString())
    })
    this.list2.forEach((item: any)=>{
      if(item.py == null){
        item.py = ''
      }
    })
    this.list2Clone = JSON.parse(JSON.stringify(this.list2))
    console.log(this.list2)
  }

  // 全选
  changeList1All(value: boolean){
    if(value){
      this.checkList1 = []
      this.list1.forEach((item: any)=>{
        this.checkList1.push(item.gytjdm)
      })
    }else{
      this.checkList1 = []
    }
  }

  changeList2All(value: boolean){
    if(value){
      this.checkList2 = []
      this.list2.forEach((item: any)=>{
        this.checkList2.push(item.dv)
      })
    }else{
      this.checkList2 = []
    }
  }

  // 左搜索
  private filterLeft() {
    this.list1 = JSON.parse(JSON.stringify(this.list1Clone))
    this.list1 = this.list1.filter((item: any)=>{
      return (item.pydm.indexOf(this.searchLeft.toUpperCase())>-1)||(item.xmmc.indexOf(this.searchLeft)>-1)
    })
  }
  // 右搜索
  private filterRight() {
    this.list2 = JSON.parse(JSON.stringify(this.list2Clone))
    this.list2 = this.list2.filter((item: any)=>{
      return (item.py.indexOf(this.searchRight.toUpperCase())>-1)||(item.dn.indexOf(this.searchRight)>-1)
    })
  }

  // 新增（向左）
  private toLeft(){
    let params = {
      ksdm: this.ksdm,
      kslb: 1,
      gytjdm: this.checkList2
    }
    aSaveGytj(params).then((res: any) => {
      if(res){
        this.$notify({
          title: '新增成功',
          message: '',
          type: 'success'
        })
        this.getLeftList()
        this.checkList2 = []
        this.list2All = false
      }
    })
  }

  // 删除（向右）
  private toRight(){
    let params = {
      ksdm: this.ksdm,
      kslb: 1,
      gytjdm: this.checkList1
    }
    aDeleteGytj(params).then((res: any) => {
      if(res){
        this.$notify({
          title: '删除成功',
          message: '',
          type: 'success'
        })
        this.getLeftList()
        this.checkList1 = []
        this.list1All = false
      }
    })
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
    this.getLeftList()
  }
  mounted() {
    this.infusionWalyList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_METHOD_DICT : this.$store.state.webSqlDict.DRUG_METHOD_DICT // 发药方式（给药途径）
  }
}
</script>

<style scoped lang='scss'>
// .title {
  // font-size: 14px !important;
  // margin-right: 10px !important;
// }
.content .his-small .el-form .el-form-item .el-input--medium {
  margin-bottom: 16px;
}
.content .his-small ::v-deep .el-form .el-form-item .el-form-item__label {
  line-height: 12px !important;
}
.texts {
  width: 29px;
  height: 14px;
  font-size: 14px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: rgba(156, 160, 171, 1);
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

.transfer-wrapper{
  padding: 10px 20px;
}
.el-checkbox-group{
  overflow: auto;
  .el-checkbox{
    display: block;
    line-height: 30px;
  }
}

</style>