<template>
  <div class="his-check-out" style="width: 100%;">
    <el-row :gutter="8" style="width: 100%;">
      <div class="his-small his-module his-tab-check">
        <div class="row" slot="header">
          <div class="label">
            <div class="search">
              <!-- <el-radio v-model="radio" label="1" @change="getThreeData">个人</el-radio>
              <el-radio v-model="radio" label="2" @change="getThreeData">科室</el-radio>
              <el-radio v-model="radio" label="3" @change="getThreeData">全院</el-radio> -->
              <div class="btn">
                <!-- <el-divider direction="vertical"></el-divider> -->
                <el-button size="mini" type="text" @click="sureBtn">
                  <i class="icon his-btn-confirm"></i>
                  {{ $t('common.confirm') }}
                </el-button>
              </div>
              <!-- <el-divider direction="vertical"></el-divider> -->
            </div>
            <div class="sum-price">
              <p>
                合计金额:
                <em>￥{{ this.totalPrice }}</em>
              </p>
              <el-divider direction="vertical"></el-divider>
              <p>
                自负金额:
                <em>￥{{ this.getPriceData }}</em>
              </p>
            </div>
          </div>
        </div>
      </div>
      <!--   第一列|||||||||组套类型名称     -->
      <el-col :span="4" style="padding-left: 0px;">
        <div class="his-module his-small" v-loading="firstLoading">
          <el-table :data="leftDatas" tooltip-effect="light" border :fit="true" stripe :highlight-current-row="true" :height="listSlotHeight - 198" class="scroll-bar no-underline" @row-click="getCenterData">
            <el-table-column type="index" width="32"></el-table-column>
            <el-table-column prop="name" label="组套类型名称" style="height: 28px;" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </el-col>
      <!--   第二列|||||||||组套名称     -->
      <el-col :span="5">
        <div class="his-module his-small" v-loading="secondLoading">
          <div class="row">
            <div class="label">
              <el-input v-model="queryData.pydm" placeholder="请输入拼音搜索" @keyup.enter.native="getThreeData(3)"></el-input>
              <el-button type="primary" size="mini" @click="getThreeData(3)" style="width: 58px; height: 30px; padding: 10px 14px; margin-left:10px">搜索</el-button>
            </div>
          </div>
          <el-table tooltip-effect="light" :data="centerDatas" border :fit="true" ref="centerDatas" stripe :highlight-current-row="true" :height="listSlotHeight - 198" class="scroll-bar no-underline" @row-click="getRightData" @select="getData" @select-all="selectAll">
            <el-table-column type="selection" width="32"></el-table-column>
            <el-table-column type="index" width="32"></el-table-column>
            <el-table-column prop="ztmc" label="组套名称" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </el-col>
      <!--   第三列|||||||||组套项目明细     -->
      <el-col :span="7">
        <div class="his-module his-small" v-loading="thirdLoading">
          <el-table tooltip-effect="light" :data="rightDatas" ref="rightDatas" border :fit="true" stripe :highlight-current-row="true" :height="listSlotHeight - 196" class="scroll-bar no-underline" @select="checkStatus">
            <!-- <el-table-column type="selection" width="32"></el-table-column> -->
            <el-table-column type="index" width="32"></el-table-column>
            <el-table-column prop="xmmc" label="组套项目明细" show-overflow-tooltip></el-table-column>
            <el-table-column prop="xmsl" width="44" label="数量"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <!--   第四列|||||||||已选项目明细     -->
      <el-col :span="8" style="padding-right: 0px;">
        <div class="his-module his-small">
          <el-table tooltip-effect="light" :data="nextRightDatas" ref="nextRightDatas" border :fit="true" stripe :highlight-current-row="true" :height="listSlotHeight - 196" class="scroll-bar no-underline">
            <el-table-column type="index" width="32"></el-table-column>
            <el-table-column prop="xmmc" label="已选检查项目" show-overflow-tooltip></el-table-column>
            <el-table-column prop="xmsl" width="45" label="数量"></el-table-column>
            <el-table-column prop="fydj" width="45" label="单价"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { checkoutData, queryPage, queryDetailXm, sureBtn, getProportion, findData } from '@/api/cis/op/dctwork/examineSuite'
import { saveZyJySqd } from '@/api/his/im/residentDoctor/orderEntry'
//确定按钮参数

@Component({
  name: 'checkoutApply',
})
export default class extends Vue {
  @Prop({ required: true }) private checkData!: any
  @Prop({ required: false, default: 'outp' }) private outpOrInpa!: string
  private pnParam: any = {}
  private resultData: Array<any> = []
  private multipleSelection: Array<any> = []
  private queryData: any = {
    pageNum: 1,
    pageSize: 1000,
    ztlb: 5,
    sslb: 1,
    ztlx: '',
    ztlxMc: '',
    pydm: '',
  }
  private rightSearchData = {
    ztbh: '',
  }
  private getPriceData: number = 0

  private radio: string = '3'
  private centerDatas: Array<any> = [] //中间数据
  private leftDatas: Array<any> = [] //左侧数据
  private rightDatas: Array<any> = [] //右边数据
  private nextRightDatas: Array<any> = [] //最右侧
  private listSlotHeight: number = 0
  private totalList: Array<any> = []
  // private totalPrice: number = 0
  private selectData: any[] = []
  private firstLoading: boolean = false
  private secondLoading: boolean = false
  private thirdLoading: boolean = false
  private searchDatas: any = {
    brxz: '',
    fygb: '',
    fyxh: '',
    type: '',
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }

  get totalPrice() {
    let price = 0
    this.nextRightDatas.map((item: any) => {
      price += item.fydj * item.xmsl
    })
    return price
  }

  @Watch('nextRightDatas', { deep: true })
  private onNextRightDatasChange(val: any) {
    let price = 0
    this.searchDatas.brxz = this.checkData.brxz
    this.searchDatas.fygb = '5'
    this.searchDatas.type = 0
    const arr = this.nextRightDatas.map((item: any) => {
      this.searchDatas.fyxh = item.xmbh
      let data = JSON.parse(JSON.stringify(this.searchDatas))
      return new Promise((resolve: any, reject: any) => {
        getProportion(data)
          .then((res: any) => {
            price += res.data * item.xmsl * item.fydj
            resolve()
          })
          .catch((e: any) => {
            reject(e)
          })
      })
    })
    Promise.all(arr).then(() => {
      if (val.length > 0) {
        this.getPriceData = price
      } else {
        this.getPriceData = 0
      }
    })
  }

  //参数
  private querydDataList: any = {
    clinicId: 0,
    brid: '',
    brxm: '',
    djly: 1,
    ghgl: 0,
    brxz: '',
    brks: 0,
    brks_text: '',
    jzkh: '',
    sqlx: 1,
    jyzts: [],
    xmDetails: [],
  }

  private sureBtn() {
    this.querydDataList.brxz = this.checkData.brxz
    this.querydDataList.brxm = this.checkData.brxm
    if (this.outpOrInpa == 'inpa') {
      this.querydDataList.zyh = this.checkData.zyh
      this.querydDataList.brch = this.checkData.brch
      this.querydDataList.brbq = this.checkData.brbq
      this.querydDataList.brks = this.checkData.brks
      this.querydDataList.sqlx = 2
    } else {
      this.querydDataList.brid = this.checkData.brid
      this.querydDataList.clinicId = this.checkData.clinicId
      this.querydDataList.ghgl = parseInt(this.checkData.mzhm)
      this.querydDataList.jzkh = this.checkData.jzkh
      this.querydDataList.brks = Vue.prototype.AUTHORITY.outpatientCode //门诊科室
      this.querydDataList.brks_text = Vue.prototype.AUTHORITY.qxmc
    }
    let arr = this.selectData.map((item: any) => {
      return {
        ztbh: item.ztbh.toString(),
        ztmc: item.ztmc,
      }
    })
    this.querydDataList.jyzts = this.removeDuplicates(arr, 'ztbh')
    const dataList = this.querydDataList.xmDetails
    this.querydDataList.xmDetails = this.nextRightDatas.map((item: any) => {
      return {
        fydj: item.fydj,
        fysl: item.xmsl,
        jlbh: item.jlbh,
        xmbh: item.xmbh,
        yzmc: item.xmmc,
        ztbh: item.ztbh,
      }
    })
    if (this.outpOrInpa == 'inpa') {
      saveZyJySqd(this.querydDataList).then((res: any) => {
        if (res) {
          this.$notify({ title: '保存成功', message: '', type: 'success' })
          this.centerDatas = []
          this.rightDatas = []
          this.nextRightDatas = []
          this.selectData = []
        }
      })
    } else {
      if (this.nextRightDatas.length == 0) {
        this.$message.error('请选择检验项目再保存')
        return
      }
      this.querydDataList.jzlsh = this.pnParam.jzlsh
      this.querydDataList.clinicId = this.$store.state.pnParam.PN_PARAM.clinicId
      console.log(this.querydDataList.clinicId)
      sureBtn(this.querydDataList).then((res: any) => {
        if (res) {
          this.$notify({ title: '保存成功', message: '', type: 'success' })
          this.centerDatas = []
          this.rightDatas = []
          this.nextRightDatas = []
          this.selectData = []
        }
      })
    }
  }

  private removeDuplicates(arr: any[], key: string) {
    let result: any[] = []
    let obj: any = {}
    for (var i = 0; i < arr.length; i++) {
      if (!obj[arr[i][key]]) {
        result.push(arr[i])
        obj[arr[i][key]] = true
      }
    }
    return result
  }

  //获取左侧数据类型
  private leftData() {
    this.firstLoading = true
    findData({})
      .then((res: any) => {
        this.leftDatas = res.data
        this.firstLoading = false
      })
      .catch(() => {
        this.firstLoading = false
      })
  }

  //点击左侧获取中间
  private getCenterData(row: any) {
    this.secondLoading = true
    this.queryData.ztlx = row.id
    this.queryData.ztlxMc = row.name
    this.getThreeData(this.radio)
  }

  //获取第二列的数据
  private getThreeData(sslb: string) {
    if (!this.queryData.ztlxMc) return
    this.queryData.sslb = parseInt(sslb)
    // this.queryData.sfqy = 1

    queryPage(this.queryData)
      .then((res: any) => {
        this.centerDatas = res.data.list.filter((item:any) => {
          return item.sfqy == 1
        })
        this.rightDatas = []
        this.selectData.map((item: any) => {
          this.centerDatas.map((item1: any) => {
            if (item.ztbh == item1.ztbh) {
              this.$nextTick(() => {
                ;(this.$refs.centerDatas as any).toggleRowSelection(item1, true)
              })
            }
          })
        })
        this.secondLoading = false
      })
      .catch(() => {
        this.secondLoading = false
      })
  }

  mounted() {
    this.pnParam = this.$store.state.pnParam.PN_PARAM
    this.leftData()
  }

  //获取右侧数据
  private getRightData(val: any) {
    this.thirdLoading = true
    this.rightSearchData.ztbh = val.ztbh
    queryDetailXm(this.rightSearchData)
      .then((res: any) => {
        this.rightDatas = res.data
        this.nextRightDatas.map((item: any) => {
          this.rightDatas.map((item1: any) => {
            if (item1.xmbh == item.xmbh) {
              this.$nextTick(() => {
                ;(this.$refs.rightDatas as any).toggleRowSelection(item1, true)
              })
            }
          })
        })
        this.thirdLoading = false
      })
      .catch(() => {
        this.thirdLoading = false
      })
    
  }

  //二全选事件
  private selectAll(val: any) {
    if (val.length > 0) {
      val.map((item: any) => {
        this.getData(val, item)
      })
    } else {
      // this.rightDatas=[]
      // this.nextRightDatas=[]
      this.centerDatas.map((item: any) => {
        this.getData([], item)
      })
    }
  }

  // 第二列表格  checkbox 选中事件
  // selection: 表格所有选中项，row: 选中的当前项
  private getData(selection: any, row: any) {
    this.thirdLoading = true
    this.$set(this.rightSearchData,'ztbh',row.ztbh)
    queryDetailXm({ ztbh: row.ztbh })
      .then((res: any) => {
        this.rightDatas = res.data
        // let dataList=res.data
        // dataList.forEach((item:any)=>{
        //   let index01=this.rightDatas.findIndex((item:any)=>item.ztbh==row.ztbh)
        //   if(index01==-1){
        //     this.rightDatas.push(item)
        //   }else{
        //     return false
        //   }
        // })
        // this.rightDatas = res.data
        this.$nextTick(() => {
          const index = selection.findIndex((item: any) => item.ztbh == row.ztbh)
          if (index == -1) {
            // ;(this.$refs.rightDatas as any).clearSelection()
            this.allCheck([])
            const index2 = this.selectData.findIndex((item: any) => item.ztbh == row.ztbh)
            this.selectData.splice(index2, 1)
            // this.rightDatas.splice(index2,1)
            // this.nextRightDatas.splice(index2,1)
          } else {
            this.allCheck(this.rightDatas)
            // ;(this.$refs.rightDatas as any).toggleAllSelection()
            this.selectData = [...this.selectData, row]
          }
        })
        this.thirdLoading = false
      })
      .catch(() => {
        this.thirdLoading = false
      })
  }

  // 第三列的选中事件
  private checkStatus(val: any, row: any) {
    console.log('1111222333444555666',val,row)
    const index1 = val.findIndex((item: any) => item.xmbh == row.xmbh)
    if (index1 != -1) {
      const index3 = this.nextRightDatas.findIndex((item: any) => item.xmbh == row.xmbh)
      console.log(222,index3)
      if(index3 >= 0) return
      console.log(index3,111)
      this.nextRightDatas.push(row)
    } else {
      const index2 = this.nextRightDatas.findIndex((item: any) => item.xmbh == row.xmbh)
      this.nextRightDatas.splice(index2, 1)
    }
    this.invertSelection(val, row)
  }

  //第三列表格  全选事件
  private toggleSelection(rows: Array<any>) {
    if (rows) {
      rows.forEach((row: any) => {
        ;(this.$refs.rightDatas as any).toggleRowSelection(row, true)
        this.nextRightDatas.push(row)
      })
    }
  }

  private invertSelection(val: any, row: any) {
    console.log(val,row)
    if (val.length > 0) {
      val.map((item1: any) => {
        this.centerDatas.map((item: any) => {
          if (item1.ztbh == item.ztbh) {
            ;(this.$refs.centerDatas as any).toggleRowSelection(item, true)
            const data = this.selectData.find((item2: any) => item2.ztbh == item.ztbh)
            if (!data || !data.ztbh) {
              this.selectData.push(item)
            }
          }
        })
      })
    } else {
      this.centerDatas.map((item: any) => {
        if (row && row.ztbh) {
          if (row.ztbh == item.ztbh) {
            ;(this.$refs.centerDatas as any).toggleRowSelection(item, false)
            const index = this.selectData.findIndex((item1: any) => item1.ztbh == row.ztbh)
            if (index != -1) {
              this.selectData.splice(index, 1)
            }
          }
        }
      })
    }
  }

  //全选三表格
  private allCheck(val: any) {
    if (val.length == 0) {
      this.rightDatas.map((item: any) => {
        const index = this.nextRightDatas.findIndex((item1: any) => item1.xmbh == item.xmbh)
        if (index != -1) {
          this.nextRightDatas.splice(index, 1)
        }
      })
      console.log(val)
      // this.invertSelection(val, this.rightDatas[0])
    } else {
      val.map((item: any) => {
        // const index = this.nextRightDatas.findIndex((item1: any) => item1.xmbh == item.xmbh)
        // if (index == -1) {
        this.nextRightDatas.push(item)
        // }
      })
      // this.invertSelection(val, {})
    }
  }

  // 数值排重
  // private repect(arr: any) {
  //   var hash:any = {}
  //   var result = []
  //   for(let i=0;i<arr.length;i++) {
  //     if(hash[arr[i]] === undefined) {
  //       result.push(arr[i])
  //       hash[arr[i]] = 1
  //     }
  //   }
  //   return result
  // }
}
</script>
<style lang="scss" scoped>
.his-check-out {
  .his-tab-check {
    height: 36px;
    margin-bottom: 10px;
    padding-bottom: 0;
    padding-top: 4px;

    .row {
      padding-bottom: 0;
      border-bottom: none;
    }

    .label {
      width: 100%;

      .search {
        display: flex;
        align-items: center;
        flex-flow: row;
        justify-content: flex-start;

        .btn {
          display: flex;

          .el-divider--vertical {
            align-self: center;
          }
        }
      }

      .sum-price {
        display: flex;
        width: 100%;
        flex-flow: row;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }

  em {
    font-size: 16px;
    font-weight: 500;
    color: rgba(20, 133, 255, 1);
    line-height: 24px;
  }

  p {
    font-size: 13px;
    font-weight: 400;
    color: rgba(106, 109, 120, 1);
    line-height: 20px;
  }

  .btn .el-button span .icon {
    color: #0fcaad;
  }

  /*::v-deep tr.current-row {*/
  /*	background: #1485FF;*/
  /*	&:focus {*/
  /*		opacity: 0.2;*/
  /*	}*/
  /*}*/
}
</style>
