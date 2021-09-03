<template>
  <div class="content ht his-patient-recipe">
    <el-row style="width: 100%" class="ht">
      <el-col class="pr10 ht" :span="leftCol">
        <recipeForm 
          :hasCfq="hasCfq" 
          :yfsb="searchData.yfsb" 
          v-model="mockDatas" 
          class="ht" 
          :patientFile="patientFile" 
          @setZtlb="setZtlb" 
          @setStatus="setStatus" 
          @setDataList="setDataList"
          @changeRight="changeRight" 
          @getFphm="getFphm"
          @getIndex="getIndex"
          @getMzcfid="getMzcfid"
          ref="recipeForm"
          v-bind="$attrs"
        ></recipeForm>
      </el-col>
      <el-col :span="24 - leftCol" class="ht">
        <div class="ht his-module his-small">
          <div :class="leftCol == 23 ? 'left' : 'right'" class="open action" style="width: 100%; margin-bottom: 8px">
            <span class="inlineBlock" v-if="leftCol == 23" @click="openRight">
              <i class="his-card-put icon gray"></i>
            </span>
            <span class="inlineBlock" v-if="leftCol == 19" @click="closeRight">
              <i class="his-card-open icon gray"></i>
            </span>
          </div>
          <div v-if="leftCol == 19" class="ht">
            <div class="tab-btn" style="padding: 6px, 0px">
              <div class="tab-row">
                <el-tabs v-model="btnValue" @tab-click="getList" class="tab-small underline his-patient-tab">
                  <el-tab-pane label="常用药" name="0" :style="{ height: listSlotHeight - 76 - 54 + 'px' }">
                    <div>
                      <cyy-list ref="cyy_set" @cyySet="cyySet" :searchData="searchData"></cyy-list>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="处方组套" name="1" :style="{ height: listSlotHeight - 76 - 54 + 'px' }">
                    <div>
                      <cfztList ref="cfzt" :searchData="searchData" @setDataList="setDataList" />
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="全部" name="2" :style="{ height: listSlotHeight - 76 - 54 + 'px' }">
                    <div class="header-row">
                      <div class="label">搜索</div>
                      <div class="row-input">
                        <el-input v-model="pyCode" :placeholder="$t('请输入拼音码搜索')" @keydown.native.enter="getList" clearable @input="getPyCode">
                          <i slot="prefix" class="el-input__icon icon his-search"></i>
                        </el-input>
                      </div>
                    </div>
                    <div>
                      <allMedicalList ref="all" @setObjInput="setObjInput" :searchData="searchData"></allMedicalList>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import medicalList from './model/medicalList.vue'
import suiteList from '@/views/cis/op/dctwork/examineSuiteSet/components/suiteList.vue'
import { ISvaeObj, loadPersonalSet, loadMedcineInfo, getPubParams, getPsxmByDrugs, getDoctPersimmion, isUse } from '@/api/cis/op/dctwork/recipe'
import recipeForm from './model/recipeForm.vue'
import cyyList from '@/views/cis/op/dctwork/patients/components/model/cyyList.vue'
import cfztList from '@/views/cis/op/dctwork/patients/components/model/cfztList.vue'
import allMedicalList from '@/views/cis/op/dctwork/patients/components/model/allMedicalList.vue'
import { AxiosResponse } from 'axios'
import { getFloat, id2Name, parseTime, mul } from '@/utils'
import { queryYfsb } from '@/api/cis/op/dctwork/pharmacySet'
// import { queryPage } from '@/api/cis/op/dctwork/examineSuite'

export const NSaveObj: ISvaeObj = {
  // webSortNumber: 1,
  zfyp: 0,
  bzxx: '',
  djzt: null,
  dzbl: null,
  fygb: null,
  fymc: '',
  hjje: null,
  jgid: null,
  jlsl: null,
  jb: null, // 几倍剂量
  gytj: '', // 途径
  ypyf: '', // 频次
  ypdj: '', // 药品单价
  mrcs: 1, // 每日次数
  jlxh: null,
  mzxh: null,
  opStatus: '',
  psjg: 0,
  pageNum: null,
  pageSize: null,
  sbxh: null,
  spbh: null,
  sqdh: null,
  xflsh: '',
  xmlx: null,
  yjxh: null,
  yjzh: null,
  yjzx: null,
  yldj: null,
  ylsl: null,
  ylxh: null,
  ypzh: null,
  yxms: null,
  yyts: null,
  zfbl: null,
  zfpb: null,
  zhje: null,
  zkbl: null,
  zkje: null,
  ztbh: null,
  ztbz: null,
  ztyzsbxh: null,
  zxpb: null,
}
@Component({
  name: 'recipe1',
  components: { suiteList, medicalList, recipeForm, cyyList, cfztList, allMedicalList },
})
export default class extends Vue {
  @Prop({ required: true }) private patientFile!: any
  private pyCode: string = ''
  private pnParam: any = {}
  private leftCol: number = 23
  private btnValue: string = '0'
  private mockDatas: Array<any> = []
  private YFSB: any = 0 // 药房识别
  private ysqx: boolean = false // 医生使用抗菌药权限
  private tabBlocks: Array<any> = [
    {
      name: 0,
      title: '常用药',
    },
    {
      name: 1,
      title: '处方组套',
    },
    {
      name: 2,
      title: '全部',
    },
  ]
  private searchData: any = {
    pydm: '__',
    sslb: 1,
    ztlb: 1,
    // ztbh: 2343,
    ksdm: Vue.prototype.AUTHORITY.bussinessRole,
    sfqy: 1,
    yfsb: '',
    cflx: 1,
  }
  private listSlotHeight: number = 0
  private listSlotHeightUs: number = 0
  private FPHM: any = ''
  private hasCfq: boolean = false // 是否含有处方权
  private xyfList: Array<any> = [] // 西药方数组
  private cyfList: Array<any> = [] // 草药方数组
  private mzxyzdcfs: number = 0 // 门诊西药最大处方数
  private mzcyzdcfs: number = 0 // 门诊草药最大处方数
  private mzxydzcfzdyps: number = 0 // 门诊西药方单张处方最大药品数
  private mzcydzcfzdyps: number = 0 // 门诊草药方单张处方最大药品数
  private mzCfid: any = '' // 现处方id
  private clickIndex: number = -1 // 表格点击的位置

  @Watch('mzCfid', { immediate: true, deep: true })
  private searchDataChange(val: any) {
    if (val) {
      this.searchData.cflx = val == 1 ? [1,2] : [3]
      this.searchData.ztlb = val
    }
    //  else {
    //   this.searchData.cflx = val.cflx
    //   this.searchData.ztlb = val.cflx !=3 ? 1 : 3
    // }
    this.searchData.yfsb = val == 1 ? 1 : 2
    // this.searchData.ztbh = val.ztbh
    this.searchData.sslb = 1
    this.searchData.pydm = '__'
  }

  created() {
    this.listSlotHeightUs = Vue.prototype.PageHeight - 270
  }

  mounted() {
    this.pnParam = this.$store.state.pnParam.PN_PARAM
    getPubParams({ commons: [ 'MZXYZDCFS','MZCYZDCFS','MZXYDZCFZDYPS','MZCYDZCFZDYPS','CFDYMJY','CFDYJE'] }).then((res: AxiosResponse) => {    
      // this.mzxyzdcfs = res.data.MZXYZDCFS // 门诊西药最大处方数
      // this.mzcyzdcfs = res.data.MZCYZDCFS // 门诊草药最大处方数
      this.mzxydzcfzdyps = res.data.MZXYDZCFZDYPS // 门诊西药方单张处方最大药品数
      this.mzcydzcfzdyps = res.data.MZCYDZCFZDYPS // 门诊草药方单张处方最大药品数
    })

    queryYfsb({ pkey: Vue.prototype.AUTHORITY.bussinessRole }).then((res) => {
      // this.searchData.yfsb = res.data.xy
      // this.searchData.ztlb = 1
      // console.log(202020202,res)
    }) 
    this.getDocPower()
  }

  deactivated() {}

  // 获取门诊处方id
  private getMzcfid(val: any) {
    this.mzCfid = val
  }

  /**
   * @Description: 获取个人常用药对应的处方类型的ztbh
   * @author: zhml
   * @param {type}: sslb 所属类别----4，5，6  个人，科室，全院常用，ztlb 组套类别----1，2，3  西药 中  草
   * @return: ztbh
   * @date 2020/8/14
   */
  // private getZtbhUsual(val: object) {
  //   queryPage(val).then((res: AxiosResponse) => {
  //     if (res.data.list[0] && res.data.list[0].ztbh) {
  //       this.searchData.ztbh = res.data.list[0].ztbh
  //       return this.searchData
  //     }
  //   })
  // }

  // 获取拼音码
  private getPyCode() {
    if (this.pyCode) {
      this.searchData.pydm = this.pyCode
    } else {
      this.searchData.pydm = '__'
    }
  }

  private cyySet(val: any) {
    let loadObj = {
      brxz: this.pnParam.brxz,
      clinicType: this.searchData.ztlb,
      fygb: this.searchData.ztlb == '1' ? 2 : this.searchData.ztlb == '2' ? 3 : 4,
      pharmacyId: this.searchData.yfsb,
      tabId: 'clinicAll',
      ypmc: val.ypmc,
      ypxh: val.ypxh,
      type: this.searchData.ztlb,
    }
    loadMedcineInfo(loadObj).then((res: any) => {
      if (res.errorCode == 'ERROR_DCTWORK_OP_0030') {
        this.$notify({
          type: 'warning',
          title: '暂无库存',
          message: '',
        })
        return
      } else {
        const obj = {
          fymc: res.data.ypmc,
          ypxh: res.data.ypxh,
          yfgg: res.data.yfgg,
          ycjl: res.data.ypjl,
          ypjl: res.data.ypjl,
          jldw: res.data.jldw,
          ypyf: res.data.gyff,
          yyts: 1,
          ypsl: 1,
          ypcd: res.data.ypcd,
          ypdj: res.data.ypdj,
          yfdw: res.data.yfdw,
          zfbl: res.data.zfbl,
          type: res.data.type,
          fygb: loadObj.fygb,
          yfbz: res.data.yfbz,
          jb: val.jb ? val.jb : 1,
          psjg: 0,
          pspb: val.pspb,
        }

        if (this.isUnique(obj.ypxh, this.mockDatas) == -1) {
          this.handleNewGroup(obj)
        } else {
          this.$notify({
            type: 'warning',
            title: '已有药品',
            message: '',
          })
        }
      }
    })
  }

  // 获取药房识别,刷新右侧列表
  private setZtlb(val: any) {
    this.searchData.yfsb = val.yfsb
    // this.$set(this.searchData,'yfsb',2)
    this.searchData.cflx = val.cfid
    this.searchData.ztlb = val.cfid
    this.leftCol = 23 // 切换默认关闭右侧快捷栏
  }

  private async getList() {
    let obj = {
      sslb: 4,
      ztlb: this.searchData.cflx,
    }
    // await this.getZtbhUsual(obj)
    switch (this.btnValue) {
      case '0':
        // let cc = await queryPage({ sslb: this.searchData.sslb, ztlb: this.searchData.ztlb })

        // if (cc.data.list.length>0 && cc.data.list[0].ztbh) {
        // this.$set(this.searchData,'ztbh',cc.data.list[0].ztbh)
        this.$nextTick(() => {
          let a: any = this.$refs.cyy_set as any
          a.queryPage()
        })
        // }
        return
      case '1':
        // this.searchData.ztlb = this.searchData.cflx
        let b: any = this.$refs.cfzt as any
        setTimeout(() => {
          b.getList()
        }, 100)
        return
      case '2':
        ;(this.$refs.all as any).getList()
        return
    }
  }

  /**
   * @Description: 全部药品传入的数据带入处方列表
   * @author: zhml
   * @param {type}:
   * @return:
   * @date 2020/7/16
   */
  private setObjInput(val: any) {
    let loadObj = {
      brxz: this.pnParam.brxz,
      clinicType: this.searchData.ztlb,
      fygb: this.searchData.ztlb == '1' ? 2 : this.searchData.ztlb == '2' ? 3 : 4,
      pharmacyId: this.searchData.yfsb,
      tabId: 'clinicAll',
      ypmc: val.ypmc,
      ypxh: val.ypxh,
      type: this.searchData.ztlb,
    }
    loadMedcineInfo(loadObj).then((res: any) => {
      if (res.errorCode == 'ERROR_DCTWORK_OP_0030') {
        this.$notify({
          type: 'warning',
          title: '暂无库存',
          message: '',
        })
        return
      } else {
        const obj = {
          fymc: res.data.ypmc,
          ypxh: res.data.ypxh,
          yfgg: res.data.yfgg,
          ycjl: res.data.ycjl,
          ypjl: res.data.ypjl,
          jb: 1,
          jldw: res.data.jldw,
          ypyf: '',
          yyts: 1,
          ypsl: 1,
          ypcd: res.data.ypcd,
          ypdj: res.data.ypdj,
          yfdw: res.data.yfdw,
          zfbl: res.data.zfbl,
          type: res.data.type,
          fygb: loadObj.fygb,
          yfbz: res.data.yfbz,
          gytj: res.data.gyff,
          pspb: res.data.pspb,
          psid: val.psid,
          bzxx: val.bzxx
        }

        // // 只排查同组的
        // let ypzhSelf: any = ''
        // if(this.mockDatas.length == 0) this.clickIndex = -1
        // // if(this.clickIndex == -1 && this.mockDatas.length > 0) {
        // //   return this.$message.warning('请选择插入的位置')
        // // }
        // if(this.clickIndex >=0 && this.mockDatas.length>0) {
        //   ypzhSelf = this.mockDatas[this.mockDatas.length-1].ypzh
        //   obj.ypyf = this.mockDatas[this.mockDatas.length-1].ypyf
        //   // obj.gytj = this.mockDatas[this.mockDatas.length-1].gytj
        // }
        
        // if(this.mockDatas.length>0) {
          // let mockDataArr: Array<any> = this.mockDatas.length>0 ?  this.mockDatas.filter((el: any) => {
          //   return el.ypzh == ypzhSelf
          // }) : []
          if (this.isUnique(obj.ypxh, this.mockDatas) == -1) {
            this.handleNewGroup(obj)
          } else {
            this.$notify({
              type: 'warning',
              title: '已有药品',
              message: '',
            })
          }
        } 
        // else {
        //   this.handleNewGroup(obj)
        // }
      // }
    })
  }

  /**
   * @Description: 重新排序药品组号
   * @author: zhml
   * @param {type}: fixme:
   * @return:
   * @date 2020/8/11
   */
  private reloadYpzh(list: Array<any>) {
    //把序列ypzh 从1 开始
    if (list != null && list.length > 0 && list[0].ypzh > 1) {
      let num = list[0].ypzh - 1
      list.forEach((item: any) => {
        item.ypzh = item.ypzh - num
      })
    }

    let i = 1
    for (let j = 0; j < list.length; j++) {
      let item = list[j]
      if (item.ypzh == i) {
      } else if (item.ypzh != i && item.ypzh - 1 == i) {
        i = i + 1
      } else {
        for (let k = j; k < list.length; k++) {
          list[k].ypzh = list[k].ypzh - 1
        }
        this.reloadYpzh(list)
        return
      }
    }
  }

  /**
   * @Description:  判断药品是否唯一
   * @author: zhml
   * @param {type}:  fyxh==药品序号  list查询的列表
   * @return:  cc
   * @date 2020/7/26
   */
  private isUnique(value: number | string, list: Array<any>) {
    let cc = list.findIndex((item: any) => item.ypxh == value)
    return cc
  }

  /**
   * @Description:  处方组套带入的数据
   * @author: zhml
   * @param {type}:
   * @return:
   * @date 2020/7/16
   */
  private setDataList(val: any) {
    // 导入新的组套前清除无用的数据
    this.mockDatas.forEach((solate: any,index: any) => {
      if(!solate.ypxh) {
        this.mockDatas.splice(index,1)
      }
    })
    var loadObj: any = {
      brxz: this.pnParam.brxz,
      clinicType: this.searchData.ztlb,
      pharmacyId: this.searchData.yfsb, //药房识别
      cdList: [],
      ztbh: '',
    }
    var list: any[] = []
    if (val.length == 0 && typeof val == 'object') {
      this.$notify({
        type: 'warning',
        title: '请选择要调入的组套明细',
        message: '',
      })
      return
    } else if (typeof val == 'object' && val.length > 0) {
      let psArr: Array<any> = []
      let psStr: string = ''
      let cdYp: any = {}
      val.forEach((item: any) => {
        if (item.cdList[0]) {
          if(item.cdList.length>1) {
            cdYp = item.cdList.filter((el: any)=> {
              return el.ypcd == item.cddm
            })
            this.$set(cdYp[0],'jlbh',item.jlbh)
            loadObj.cdList.push(cdYp[0])
          } else {
            this.$set(item.cdList[0],'jlbh',item.jlbh)
            loadObj.cdList.push(item.cdList[0])
          }
        } else {
          loadObj.cdList.push({ jlbh: item.jlbh , ypxh: item.ypxh})
        }
        if(item.pspb) {
          psArr.push(item.ypmc)
        }
      })
      psStr = psArr.join(',')
      if(psArr.length) {
        this.$message.info(`${psStr} 为皮试药品！`)
      }
      loadObj.ztbh = val[0].ztbh
      let cc:any = 1
      if (this.mockDatas[this.mockDatas.length - 1] && this.mockDatas[this.mockDatas.length - 1].ypzh) {
        cc = this.mockDatas[this.mockDatas.length - 1].ypzh
      }
      loadPersonalSet(loadObj).then((res: AxiosResponse) => {
        let msg: string = '' // 提示消息
        let stockArr: Array<any> = [] // 无库存数据
        let stockStr: string = '' // 无库存数据
        // 判断添加组套后总药品数是否大于系统参数
        let total = this.mockDatas.length + res.data.length
        if(total>this.mzxydzcfzdyps && this.searchData.cflx != 3) return this.$message.warning(`单张西处方不能录入超过${this.mzxydzcfzdyps}条药品`)
        if(total>this.mzcydzcfzdyps && this.searchData.cflx == 3) return this.$message.warning(`单张草处方不能录入超过${this.mzcydzcfzdyps}条药品`)
        for (const item of res.data) {
          if (item.errorCode == 'ERROR_DCTWORK_OP_0030') {
            stockArr.push(item.ypmc)
          } else {
            let param = {
              fymc: item.ypmc,
              ypxh: item.ypxh,
              yfgg: item.yfgg,
              ycjl: item.ycjl,
              ypjl: item.ypjl,
              jb: item.jb,
              jldw: item.jldw,
              ypyf: item.sypc,
              ypsl: item.ypsl,
              // ypsl: Math.ceil((1 * item.mrcs * item.yyts) / item.yfbz),
              yyts: item.yyts,
              yfdw: item.yfdw,
              ypcd: item.ypcd,
              ypdj: item.ypdj,
              gytj: item.gytj,
              fygb: item.fygb,
              yfbz: item.yfbz,
              zfbl: item.zfbl,
              zfyp: 0,
              mrcs: item.mrcs,
              xmlx: this.searchData.ztlb,
              type: this.searchData.ztlb,
              ypzh: this.searchData.cflx == 3 ? cc : cc + item.ypzh, // 草药处方不分组，西药换新组
              psjg: item.pspb == 1 ? 0 : 1,
              jf: item.jz,
              bz: item.bz
            }
            if (this.searchData.cflx == 3 && this.isUnique(param.ypxh, this.mockDatas) == -1) {
              this.mockDatas.push(param)
            } else if(this.searchData.cflx != 3) {
              this.mockDatas.push(param)
            } else {
              this.$notify({
                type: 'warning',
                title: `${param.fymc}已存在`,
                message: '',
              })
            }
          }
        }
        if(stockArr.length) {
          stockStr = stockArr.join(',')
          this.$alert(stockStr + '库存不足','提示', {
            confirmButtonText: '确定',
            callback: action => {
              console.log('库存不足！')
            }
          })
        }
        ;(this.$refs.recipeForm as any).queryPsxmDrugs(this.mockDatas)
        this.reloadYpzh(this.mockDatas)
        this.$nextTick(()=> {
          ;(this.$refs.recipeForm as any).lookBzxx(this.mockDatas)
        })
      })
    }
  }

  // 获取表格点击的位置
  private getIndex(val: number) {
    this.clickIndex = val
  }

  /**
   * @Description:  右侧列表双击插入药品  fixme: 通过药品序号回显名称，单次剂量，单位等
   * @author: zhml
   * @param {type}:
   * @return:
   * @date 2020/7/16
   */
  private async handleNewGroup(val: any) {
    let param: any = { ...NSaveObj, ...val }
    // 从recipeForm获取插入的序号
    param.ycjl = getFloat(param.jb != null ? param.jb * param.ypjl : 1 * param.ypjl, 2)
    param.webSortNumber = this.mockDatas.length + 1
    if (this.mockDatas.length == 0) {
      param.ypzh = 1
    } else {
      if (this.clickIndex >= 0) { // 选择了在某处插入数据
        param.ypzh = this.mockDatas[this.clickIndex].ypzh
      } else if(this.mockDatas.length >0){ // 未选择但是表格有数据，默认插在最后一行
        param.ypzh = this.mockDatas[this.mockDatas.length - 1].ypzh
      } else { // 未选择，且表格无数据，默认组号为1
        param.ypzh = 1
      }
    }
    // 判断添加组套后总药品数是否大于系统参数
    let total = this.mockDatas.length
    let xy = Number(this.mzxydzcfzdyps)
    let zy = Number(this.mzcydzcfzdyps)
    if(total>= xy && this.searchData.cflx != 3) return this.$message.warning(`单张西处方不能录入超过${this.mzxydzcfzdyps}条药品`)
    if(total>= zy && this.searchData.cflx == 3) return this.$message.warning(`单张草处方不能录入超过${this.mzcydzcfzdyps}条药品`)
    //删除没有数据的记录
    this.$set(param, 'jf', this.searchData.cflx == 3 ? '1' : '')
    if(!param.gytj) {
      this.$set(param, 'gytj', param.ypyf || param.gyff)
    }
    this.mockDatas.forEach((item: any, index: number) => {
      if (item.ypxh == null) {
        this.mockDatas.splice(index, 1)
      }
      // item.ycjl = getFloat(item.jb != null ? item.jb * item.ypjl : 1 * item.ypjl, 2) // 安全隐患
    })
    await this.checkDoctorPermission(param)
    if(this.ysqx) {
      return this.ysqx = false
    }

    // 皮试判别
    const recipeForm: any = this.$refs.recipeForm
    await recipeForm.queryPsxmDrugs([param])
    if(param.pspb) {
      this.$message.info('药品【' + param.fymc + '】为皮试药品！')
    }
    if (this.clickIndex >= 0) {
      this.mockDatas.splice(this.clickIndex+1, 0, param)
      this.clickIndex +=1
    } else {
      this.mockDatas.push(param)
    }
    this.$nextTick(()=> {
      ;(this.$refs.recipeForm as any).lookBzxx(this.mockDatas)
    })
    if(this.searchData.cflx == 3) {
      ;(this.$refs.recipeForm as any).uniteYpsl(2) // 录入常用药是计算数量
    }
  }

  // 判断医生是否有开精神、麻醉药权限
  private async checkDoctorPermission(data: any) {
    let cc: boolean = true
    let obj: any = await getDoctPersimmion({})
    if (data.tsyp > 0) {
      if (data.tsyp == 1) {
        if (obj.data.mzyq == '' || obj.data.mzyq == '0') {
          this.$message.warning('药品【 ' + data.ypmc + ' 】是麻醉类药品，您暂不能开麻醉类处方!')
          this.ysqx = true
          return false
        }
      }

      if (data.tsyp == 2) {
        if (obj.data.kjsy == '' || obj.data.kjsy == '0') {
          this.$message.warning('药品【 ' + data.ypmc + ' 】是精神类药品，您暂不能开精神类处方!')
          this.ysqx = true
          return false
        }
      }
    }
    let cf02List: Array<any> = [
      {
        ypxh: data.ypxh,
        fymc: data.ypmc,
        ksbz: data.ksbz,
      },
    ]
    const params: any = {
      jzxh: this.pnParam.jzxh,
      cf02List: cf02List,
    }
    await isUse(params).then((res: any) => {
      if (res.errorCode != 'SUCCESS') {
        this.ysqx = true
        this.$message({
          message: res.message,
          type: 'error',
        })
      }
    })
  }

  /**
   * @Description: 区别于newGroup  插入
   * @author: zhml
   * @param {type}:
   * @return:
   * @date 2020/7/16
   */
  private handleInsert() {
    const param = Object.assign({}, NSaveObj)
    // param.webSortNumber = this.mockDatas.length + 1
    if (this.mockDatas.length == 0) {
      param.ypzh = 1
    } else {
      param.ypzh = this.mockDatas[this.mockDatas.length - 1].ypzh
    }
    this.mockDatas.push(param)
  }

  private setStatus() {
    this.$emit('setStatus', true)
  }

  // 返回病历首页
  // private reback() {
  //   this.$emit('reHome', true)
  // }

  private getFphm(value: any) {
    this.FPHM = value
  }

  // 切换tab，右侧默认隐藏
  changeRight() {
    this.leftCol = 23
  }

  // private getCfList(val: any) {
  //   this.xyfList = val.xyfList
  //   this.cyfList = val.cyfList
  //   this.mzxyzdcfs = val.mzxyzdcfs
  //   this.mzcyzdcfs = val.mzcyzdcfs
  //   this.mzCfid = val.mzCfid
  //   console.log('690',this.mzCfid,this.xyfList,this.cyfList,this.mzxyzdcfs,this.mzcyzdcfs)
  // }

  // ui交互
  private openRight() {
    // // 先判断西药方、草药方是否达到最大值
    // if(this.xyfList.length>=this.mzxyzdcfs && this.searchData.cflx == 1) return this.$message.warning('西药方数量已达到最大')
    // if(this.cyfList.length>=this.mzcyzdcfs && this.searchData.cflx == 3) return this.$message.warning('草药方数量已达到最大')
    if (!this.FPHM) {
      this.leftCol = 19
      this.btnValue = '0'
    } else {
      this.$message.warning('已收费不可操作！')
    }
  }

  private closeRight() {
    if (!this.FPHM) {
      this.leftCol = 23
      this.btnValue = '0'
    } else {
      this.$message.warning('已收费不可操作！')
    }
  }

  
  // 获取医生管理权限
  private getDocPower() {
    getDoctPersimmion({}).then((res: any) => {
      if(res.data.kcfq == 0) {
        this.hasCfq = true // 没有开处方权时为true,否则为false
        this.$alert('对不起，您没有开处方权！', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            // this.$message({
            //   type: 'info',
            //   message: `action: ${ action }`
            // });
          }
        });
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.his-patient-recipe {
  padding: 0px;
  overflow: hidden;

  .header-row {
    display: flex;
    flex-flow: row nowrap;
    padding-bottom: 8px;

    .label {
      width: 40px;
      font-size: 13px;
      align-self: center;
      margin-right: 8px;
    }

    .row-input {
      height: 28px;
      width: 100%;
      background: rgba(245, 246, 248, 1);
      border-radius: 4px;
      margin-right: 6px;

      ::v-deep .el-input__inner {
        width: 108px;
        height: 28px;
        background: rgba(245, 246, 248, 1);
        border-radius: 4px;
        margin-right: 6px;
        border: none;
      }
    }

    .el-button--primary {
      padding: 0px;
      width: 48px;
      height: 24px;
      border-radius: 4px;
      justify-content: center;
      margin-top: 3px;
    }
  }

  .pr10 {
    padding-right: 10px;
  }

  ::v-deep .el-tabs__header {
    padding: 0 0 8px !important;
  }

  .el-table--border::after {
    display: none;
  }

  ::v-deep .his-patient-tab {
    .el-tabs__header {
      margin-bottom: 0 !important;
    }
  }
}

.content .his-module .el-table::before,
.content .his-module .el-table--group::after,
.content .his-module .el-table--border::after {
  display: none !important;
}

.el-col-1 {
  width: 24px;

  .his-small {
    padding: 8px 2px;
  }
}

.el-col-23 {
  width: calc(100% - 24px);
}

span.action.open {
  justify-content: start !important;

  .right {
    display: flex;
    align-items: center;
    justify-content: end;
  }

  .left {
    display: flex;
    align-items: center;
    justify-content: start;
  }
}

.right-btn {
  border-radius: 4px 4px 0px 0px;
  margin-right: 1px;
  background: linear-gradient(149deg, rgba(255, 255, 255, 1) 0%, rgba(244, 244, 244, 1) 100%);
  border: 1px solid #ececec;
  font-size: 14px;
  padding: 8px 10px;
  margin-left: 1px;
  color: #222b31;

  &:nth-child(1) {
    width: 65px;
    height: 30px;
  }

  &:nth-child(2) {
    width: 78px;
    height: 30px;
  }

  &:nth-child(3) {
    width: 56px;
    height: 30px;
  }
}

.nowarp {
  white-space: nowrap;
}

::v-deep .el-pagination {
  overflow: hidden;
}

::v-deep .el-input__prefix {
  left: 8px !important;
  margin: 0 px 8px 0 10px !important;
}

p {
  font-size: 13px;
}

em {
  font-size: 14px;
  color: #1485ff;
  font-weight: medium;
}

.el-input--medium .el-input__icon {
  line-height: 28px;
}
</style>
