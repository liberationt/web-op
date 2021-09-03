<!--
 * @Date: 2020-05-15 10:16:45
 * @LastEditors: dl
 * @LastEditTime: 2020-06-19 15:03:37
 * @description:
 -->
<template>
  <div class="his-module his-small his-suite">
    <div slot="header" class="row">
      <div class="label">
        <span class="title">{{ $t('组套详细') }}</span>
        <el-divider direction="vertical"></el-divider>
        <div class="btn">
          <!-- 插入 -->
          <el-button size="mini" type="text" @click="handleInsert" :disabled="isEnable">
            <i class="icon his-inserting blue"></i>
            <span>{{ $t('examineSuite.insert') }}</span>
          </el-button>
          <!-- 新组 -->
          <el-button size="mini" type="text" @click="handleNewGroup" :disabled="isEnable || searchDataDetail.ztlb == 3">
            <i class="icon his-group blue"></i>
            <span>{{ $t('examineSuite.newGroup') }}</span>
          </el-button>
          <!-- 保存 -->
          <el-button size="mini" type="text" @click="handleSaveAll" :disabled="isEnable">
            <i class="icon his-btn-save green"></i>
            <span>{{ $t('common.save') }}</span>
          </el-button>
        </div>
      </div>
    </div>
    <div v-if="searchDataDetail.ztlb != 4">
      <el-table 
        :data="tableDatas" 
        border 
        fit 
        tooltip-effect="light"
        stripe 
        highlight-current-row 
        :height="listSlotHeight + 20"
        class="input-table"
        @row-click="handleGetIndex"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="ypzh" width="16" class-name="color-group">
          <template slot-scope="scope">
            <div class="w100" :class="scope.row.ypzh % 2 === 1 ? 'greenBack' : 'orangeBack'"></div>
          </template>
        </el-table-column>
        <el-table-column type="index" width="32"></el-table-column>
        <el-table-column label="药品名称" prop="fymc" show-overflow-tooltip min-width="130">
          <template slot-scope="scope">
            <div>
              <remoteSearchBox
                v-model="scope.row.fymc"
                name='ypzt'
                :ref="`${scope.$index}-1`"
                style="height: 32px"
                @getData='setData'
                :resultTableHeader="resultTableHeader"
                :searchData="searchDataDetail"
                :searchField="{
                  yp: 'pydm',
                  zt: 'pydm',
                }"
                :showLabel="{
                  yp: 'fymc',
                  zt: 'ztmc',
                }"
                @keyup.enter.native="nextFocus(scope.$index,1)"
              >
              </remoteSearchBox>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="规格" prop="ypgg" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column label="几倍" prop="jb" min-width="70">
          <template slot-scope="scope">
            <el-input 
              v-model="scope.row.jb"
              :ref="`${scope.$index}-2`"
              @input="getYcjl"
              oninput="value=value.replace(/[^\d]/g,'')"
              @keyup.enter.native="nextFocus(scope.$index, 2)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单次剂量" prop="ycjl" min-width="70"></el-table-column>
        <el-table-column prop="jldw" show-overflow-tooltip width="40"></el-table-column>
        <el-table-column label="频次" prop="sypc" width="60" show-overflow-tooltip>
          <template slot-scope="scope">
            <selectDown 
              v-model="scope.row.sypc" 
              :ref="`${scope.$index}-3`" 
              style="height: 32px" 
              :options="gytjList" 
              option_label_filed="dn" 
              option_value_filed="dv" 
              @change="changeYpyfByZh" 
              :is-search="true" 
              @keyup.enter.native="nextFocus(scope.$index, 3)"
            ></selectDown>
          </template>
        </el-table-column>
        <el-table-column label="用药天数" prop="yyts" show-overflow-tooltip width="70">
          <template slot-scope="scope">
            <el-input 
              :disabled="searchDataDetail.ztlb == 3"
              v-model="scope.row.yyts" 
              @input="getYyts"
              oninput="value=value.replace(/[^\d]/g,'')"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="总量" prop="xmsl" show-overflow-tooltip min-width="70"></el-table-column>
        <el-table-column prop="yfdw" show-overflow-tooltip min-width="32"></el-table-column>
        <el-table-column label="用法" prop="gytj" show-overflow-tooltip width="60">
          <template slot-scope="scope">
            <selectDown
              :required="true" 
              v-model="scope.row.gytj" 
              :ref="`${scope.$index}-4`" 
              style="height: 32px" 
              @change="changeGytjByZh" 
              :options="yfList"
              :is-search="true" 
              option_label_filed="dn" 
              option_value_filed="dv" 
              @keyup.enter.native="nextFocus(scope.$index, 4)"
            ></selectDown>
          </template>
        </el-table-column>
        <el-table-column label="煎法" prop="jz" show-overflow-tooltip v-if="searchDataDetail.ztlb == 3" width="60">
          <template slot-scope="scope">
            <div>{{ jzList.find((item) => item.dv == scope.row.jz) && jzList.find((item) => item.dv == scope.row.jz).dn }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.actions')" width="52" align="center">
          <template slot-scope="scope">
            <div class="w100">
              <el-button @click="handleDelete(scope)">
                <i class="icon his-del his-cancellationicon" />
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="action" style="margin-top: 3px">
        <span class="bottom-label">
          明细条数:
          <em style="color: #1485ff; font-family: siyuanMedium">{{ tableDatas.length }}</em>
        </span>
      </div>
    </div>

    <div v-if="searchDataDetail.ztlb == 4">
      <el-table :data="tableDatas" border stripe :highlight-current-row="true" :height="listSlotHeight" class="scroll-bar" :row-class-name="tableRowClassName" @row-click="handleGetIndex">
        <el-table-column width="16" class-name="color-group">
          <template slot-scope="scope">
            <div class="w100" :class="scope.row.ypzh % 2 === 1 ? 'greenBack' : 'orangeBack'"></div>
          </template>
        </el-table-column>
        <el-table-column type="index" width="32"></el-table-column>

        <el-table-column label="项目名称" min-width="180" label-class-name="first-red">
          <template slot-scope="scope">
            <remoteSearchBox
              v-model="scope.row.xmmc"
              name="mzys_fj"
              :ref="`${scope.$index}-1`"
              style="height: 32px"
              @getData="setData4"
              :resultTableHeader="resultTableHeader4"
              :searchData="searchSelectData4"
              :searchField="{
                yp: 'pydm',
              }"
              :showLabel="{
                yp: 'fymc',
              }"
            />
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="ycjl" width="80">
          <template slot-scope="scope">
            <input-box v-model="scope.row.xmsl" :ref="`${scope.$index}-2`" style="height: 32px" />
          </template>
        </el-table-column>
        <el-table-column label="频次" prop="sypc" min-width="80">
          <template slot-scope="scope">
            <select-box v-model="scope.row.sypc" :ref="`${scope.$index}-3`" style="height: 32px;" :options="gytjList" option_label_filed="dn" option_value_filed="dv" :is-search="true" @change="changeYpyfByZh" @keyup.enter.native="nextFocus(scope.$index, 4)"></select-box>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="fydj" width="80">
          <template slot-scope="scope">
            <div>{{ scope.row.fydj }}</div>
          </template>
        </el-table-column>
        <el-table-column label="商保价格" prop="sbjg" min-width="80"></el-table-column>
        <el-table-column prop="xmsl" label="总量" width="80">
          <template slot-scope="scope">
            <input-box v-model="scope.row.xmsl" :ref="`${scope.$index}-4`" style="height: 32px" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.actions')" width="80" align="center">
          <template slot-scope="scope">
            <div class="w100">
              <el-button @click="handleDelete(scope)">
                <i class="icon his-del his-cancellationicon" />
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="action" style="margin-top: 3px">
        <span class="bottom-label">
          明细条数:
          <em style="color: #1485ff; font-family: siyuanMedium">{{ tableDatas.length }}</em>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { ISuiteDetail, saveList, getPubpc, deleteByJlxh } from '@/api/cis/op/dctwork/examineSuite'
import { getPayProp } from '@/api/cis/op/dctwork/recipe'
import { getData } from '@/api/his/im/ims/admissionRegistration'
import { getFloat } from '@/utils'

const Nparam: ISuiteDetail = {
  webSortNumber: null,
  jlbh: null,
  gytj: '1', //	给药途径
  jldw: '', //	剂量单位
  sypc: 'qd', // 使用频次
  mrcs: 2,
  xmmc: '', //  药品名称
  ycjl: 1, // 一次剂量
  ypzh: 0, // 药品组号 判断颜色
  yyts: 1, // 	用药天数
  ztbh: 0, // 组套编号
  ypsl: 1, // 数量
  jz: 1, //脚注
  xmsl: 1, // 总量
  fydj: 0, // 单价
  sbjg: 0, // 商保价格
  yfbz: 0,
  xmbh: 0,
  jb: 1, // 几倍剂量
  isEdit: true,
}
@Component({
  name: 'DetailList',
  filters: {
    switchColor: (value: number) => {
      if (value % 2 == 1) {
        return 'greenBack'
      } else {
        return 'orangeBack'
      }
    },
  },
})
export default class extends Vue {
  @Prop({ required: true }) private dataUrl!: string
  @Prop({ required: true }) private value!: any
  @Prop({ required: true }) private searchDataDetail!: any
  @Prop({ required: true }) private isSelect!: boolean
  @Prop({ required: true }) private isEnable!: boolean // 新增組套的按钮判断,默认不可点击

  private listSlotHeight: number = 0
  private colLabel: string | null = null
  private rowIndex: number = -1
  private yfList: Array<any> = [] //药品用法字典
  private jzList: Array<any> = [] // 脚注字典
  private pcList: Array<any> = [] //频次字典
  private gytjList: Array<any> = [] //给药途径字典
  private mrpcList: Array<any> = [] //每日频次字典
  private clickFlag: boolean = false // 判断点击插入的位置
  private YPZH: number = 0
  private cdList: Array<any> = [] // 药品产地数组

  mounted() {
    this.yfList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_METHOD_DICT : this.$store.state.webSqlDict.DRUG_METHOD_DICT
    this.pcList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.FREQUENCY_DICT : this.$store.state.webSqlDict.FREQUENCY_DICT
    this.jzList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.JZ_DICT : this.$store.state.webSqlDict.JZ_DICT
    this.gytjList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.FREQUENCY_DICT : this.$store.state.webSqlDict.FREQUENCY_DICT
    this.mrpcList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.FREQUENCY_DAY_DICT : this.$store.state.webSqlDict.FREQUENCY_DAY_DICT
    this.cdList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_DRUGMADEIN_DICT : this.$store.state.webSqlDict.DRUG_DRUGMADEIN_DICT
  }

  // private headerArray3: Array<any> = [
  //   {
  //     prop: 'ypzh',
  //     type: 'backColor',
  //     width: 14,
  //   },
  //   {
  //     prop: 'xmmc',
  //     label: '项目名称',
  //     type: 'select-search', //点击后单元格变成远程搜索下拉框
  //     url: '/ypsrf/queryFeeYlsfxmdj', //远程搜索的api
  //     queryData: 'pydm', //远程搜索的搜索字段
  //     showLabel: 'fymc',
  //     searchData: this.searchDataDetail,
  //     resultHeader: [
  //       {
  //         prop: 'fymc',
  //         label: '费用名称',
  //       },
  //       {
  //         prop: 'fydw',
  //         label: '规格',
  //       },
  //       {
  //         prop: 'fydj',
  //         label: '价格',
  //       },
  //     ],
  //     selectResult: {
  //       xmmc: 'fymc',
  //       xmbh: 'ypxh',
  //       sbjg: 'bzjg',
  //       fydj: 'fydj',
  //     },
  //   },
  //   {
  //     prop: 'xmsl',
  //     label: '数量',
  //     type: 'input',
  //     width: 60,
  //   },
  //   {
  //     prop: 'sypc',
  //     type: 'select',
  //     label: '频次',
  //     width: 60,
  //     option: this.pcList,
  //     label_filed: 'dn', //在传入option中作为label的字段
  //     value_filed: 'dv', //在传入option中作为value的字段
  //   },
  //   {
  //     prop: 'fydj',
  //     label: '单价',
  //     type: 'text',
  //     width: 60,
  //   },
  //   {
  //     prop: 'sbjg',
  //     label: '商保价格',
  //     type: 'text',
  //     width: 60,
  //   },
  //   {
  //     prop: 'xmsl',
  //     label: '总量',
  //     type: 'input',
  //     width: 60,
  //   },
  // ]

  private resultTableHeader: any = {
    yp: [
      {
        prop: 'ypmc',
        label: '药品名称',
      },
      {
        prop: 'ypgg',
        label: '规格',
      },
      {
        prop: 'yfdw',
        label: '药房单位',
      },
    ],
  }

  private resultTableHeader4: any = {
    yp: [
      {
        prop: 'fymc',
        label: '药品名称',
      },
      {
        prop: 'fydw',
        label: '次',
      },
      {
        prop: 'fydj',
        label: '费用单价',
      },
      {
        prop: 'bzjg',
        label: '标准价格',
      },
    ],
  }
  private searchSelectData4: any = {
    yp: {
      xmlx: 5,
      pydm: '',
      useType: 'MZSY',
    },
  }

  //数据交互
  private tableRowClassName({ row, rowIndex }: any) {
    row.index = rowIndex
  }

  private setData(obj: any) {
    if (this.checkUnique(obj.ypxh, this.tableDatas)) {
      console.log(this.tableDatas) 
      this.tableDatas[this.rowIndex].fymc = obj.ypmc
      this.tableDatas[this.rowIndex].ycjl = obj.ycjl
      this.tableDatas[this.rowIndex].jldw = obj.jldw
      this.tableDatas[this.rowIndex].xmbh = obj.ypxh
      this.tableDatas[this.rowIndex].sbjg = obj.bzjg
      this.tableDatas[this.rowIndex].fydj = obj.fydj
      this.tableDatas[this.rowIndex].gytj = obj.gyff
      this.tableDatas[this.rowIndex].yfbz = obj.yfbz
      this.tableDatas[this.rowIndex].ypgg = obj.ypgg
      this.tableDatas[this.rowIndex].yfdw = obj.yfdw
      this.tableDatas[this.rowIndex].ypjl = obj.ypjl
      // this.nextFocus(this.rowIndex,1)
    } else {
      this.tableDatas.splice(this.rowIndex,1)
      this.$notify.warning('已有药品')
    }
  }

  // 设置健康项目
  private setData4(obj: any) {
    if (this.checkUnique(obj.fyxh, this.tableDatas)) {
      this.tableDatas[this.rowIndex].xmmc = obj.fymc
      this.tableDatas[this.rowIndex].fydj = obj.fydj
      this.tableDatas[this.rowIndex].sbjg = obj.bzjg
      this.tableDatas[this.rowIndex].xmbh = obj.fyxh
      this.tableDatas[this.rowIndex].xmsl = 1
      this.$nextTick(()=> {
        this.handleNewGroup()
      })
    } else {
      obj = {}
      this.$notify.warning('已有项目')
    }
  }

  /*
   *@Description: 校验重复药品
   *@param: ypxh, list
   *@response: boolean
   *@Author: zhml
   *@Date: 2020-09-27 13:56:13
   */
  private checkUnique(value: string, list: any) {
    console.log(415,list)
    let cc = list.findIndex((item: any) => item.xmbh == value)
    if (cc == -1) return true
    else return false
  }

  get tableDatas() {
    return this.value
  }

  set tableDatas(val: any[]) {
    this.$emit('input', val)
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 155
  }

  /**
   * @LastEditors: zhml
   * @Description: 保存全部数据
   * @param {type} list
   * @return: sucess
   */
  private handleSaveAll() {
    console.log('213')
    if (this.tableDatas.length == 0 || this.tableDatas[0].xmbh == null || this.tableDatas[0].xmbh == 0) {
      this.$notify({
        type: 'warning',
        title: '无数据，不可保存',
        message: '',
      })
      return
    }
    let tableData: Array<any> = []
    tableData = this.tableDatas.filter((el)=> {
      return el.xmbh != 0
    })
    let emptyList: Array<any> = []
    tableData.forEach((item) => {
      this.$set(item,'ypsl',item.xmsl)
      if(!item.gytj) {
        emptyList.push(item)
      }
    })
    if(emptyList.length) return this.$message.warning('存在用法未维护！')
    saveList(tableData).then((res) => {
      this.$notify({
        type: 'success',
        title: '保存成功',
        message: '',
      })
      this.$emit('delete',tableData[tableData.length-1].ztbh)
    })
  }

  /**
   * @LastEditors: zhml
   * @Description: 新增的数据是否已有药品名称,判断是否可以再次新增组或新增药品
   * @param {type} params
   * @return:
   */
  private isClick(value: any[]) {
    if (value.length == 0) {
      return true
    } else if (value[value.length - 1].xmbh == '' || value[value.length - 1].xmbh === null || value[value.length - 1].xmbh === undefined) {
      return false
    } else {
      return true
    }
  }

  /**
   * @Description: 更改同组的频次数据
   * @author: zhml
   * @param {type}:
   * @return: obj
   * @date 2020/8/26
   */
  private changeYpyfByZh(val: any) {
    let cc = this.tableDatas[this.rowIndex]
    this.tableDatas.forEach((item: any) => {
      if (item.ypzh == cc.ypzh) {
        item.sypc = val
        // this.countYpsl(3)
      }
    })
    this.$nextTick(() => {
      this.getYpzl()
    })
  }

  /**
   * @Description: 更改同组的用药天数数据
   * @author: zhml
   * @param {type}:
   * @return: obj
   * @date 2020/8/26
   */
  private changeYytsByZh(val: any) {
    console.log('val', val)
    let cc = this.tableDatas[this.rowIndex]
    this.tableDatas.forEach((item: any) => {
      if (item.ypzh == cc.ypzh) {
        item.yyts = val
      }
    })
  }

  /**
   * @Description: 更改同组的给药途径数据
   * @author: zhml
   * @param {type}:
   * @return: obj
   * @date 2020/8/26
   */
  private changeGytjByZh(val: any) {
    let cc = this.tableDatas[this.rowIndex]
    this.tableDatas.forEach((item: any) => {
      if (item.ypzh == cc.ypzh) {
        item.gytj = val
      }
    })
  }

  // 新组
  private handleNewGroup() {
    this.rowIndex = this.tableDatas.length-1
    if (this.isSelect == false) {
      return
    }
    if (this.isClick(this.tableDatas)) {
      const param = Object.assign({}, Nparam)
      param.ztbh = this.searchDataDetail.ztbh
      // param.webSortNumber = this.tableDatas.length + 1
      if (this.tableDatas.length == 0) {
        param.ypzh = 1
      } else {
        param.ypzh = this.tableDatas[this.tableDatas.length - 1].ypzh + 1
      }
      this.tableDatas.push(param)
      this.rowIndex ++
      this.$nextTick(()=> {
        ;(this.$refs[`${this.tableDatas.length - 1}-1`] as any).focus()
      })
    } else {
      return null
    }
  }

  // 插入
  private handleInsert() {
    if(!this.clickFlag) {
      this.rowIndex = this.tableDatas.length
    }
   
    if (this.isSelect == false) {
      return
    }
    // 先判断药品是否已存在
    if (this.isClick(this.tableDatas)) {
      const param = Object.assign({}, Nparam)
      param.ztbh = this.searchDataDetail.ztbh
      // param.webSortNumber = this.tableDatas.length + 1
      if (this.tableDatas.length == 0) {
        param.ypzh = 1
        this.tableDatas.push(param)
        this.$nextTick(()=> {
          ;(this.$refs[`${this.tableDatas.length-1}-1`] as any).focus()
        })
      } else if (this.clickFlag) {
        param.ypzh = this.YPZH
        // param.yyts = this.tableDatas[this.rowIndex].yyts
        param.gytj = this.tableDatas[this.rowIndex].gytj
        param.sypc = this.tableDatas[this.rowIndex].sypc
        this.tableDatas.splice(this.rowIndex+1, 0, param)
        this.$nextTick(()=> {
          ;(this.$refs[`${this.rowIndex+1}-1`] as any).focus()
          this.rowIndex++
        })
      }else {
        param.ypzh = this.tableDatas[this.tableDatas.length - 1].ypzh
        // param.yyts = this.tableDatas[this.tableDatas.length - 1].yyts
        param.gytj = this.tableDatas[this.tableDatas.length - 1].gytj
        param.sypc = this.tableDatas[this.tableDatas.length - 1].sypc
        this.tableDatas.push(param)
        this.$nextTick(()=> {
          ;(this.$refs[`${this.tableDatas.length-1}-1`] as any).focus()
        })
        // this.rowIndex ++
      }
    } else {
      return null
    }
  }

  // 回车事件
  private nextFocus(row:number,num:number) {
    if(num == 2) {
      this.handleInsert()
      return
    }
    console.log(row,num)
    ;(this.$refs[`${row}-${num+1}`] as any).focus()
  }

  // 通过几倍设置一次剂量
  private getYcjl(val: any) {
    if(this.searchDataDetail.ztlb == 3) {
      this.tableDatas[this.rowIndex].ycjl = val
      this.tableDatas[this.rowIndex].xmsl = val
    } else{
      this.tableDatas[this.rowIndex].ycjl = getFloat(Number(this.tableDatas[this.rowIndex].jb) * Number(this.tableDatas[this.rowIndex].ypjl),2)
      let mrcs = this.mrpcList.find((item: any) => item.dv == this.tableDatas[this.rowIndex].sypc).dn
      console.log(mrcs)
      this.tableDatas[this.rowIndex].xmsl = Math.ceil(((val ? Number(val) : 1) * mrcs * this.tableDatas[this.rowIndex].yyts) / this.tableDatas[this.rowIndex].yfbz)
    }
  } 

  private getYyts(val: any) {
    this.tableDatas.forEach((item: any) => {
      if (item.ypzh == this.tableDatas[this.rowIndex].ypzh) {
        item.yyts = val
      }
    })
    this.getYpzl()
  }

  // 计算药品总量
  private getYpzl() {
    let list: any = this.tableDatas.filter((item: any) => {
      if(item.ypzh == this.tableDatas[this.rowIndex].ypzh) {
        return item
      }
    })
    list.forEach((ele: any) => {
      if(ele.sypc && this.searchDataDetail.ztlb != 3 && ele.jb && ele.sypc && ele.yyts && ele.xmbh) {
        ele.mrcs = this.mrpcList.find((item: any) => item.dv == ele.sypc).dn
        ele.xmsl = Math.ceil(((ele.jb ? Number(ele.jb) : 1) * ele.mrcs * ele.yyts) / ele.yfbz)
      } else {
        ele.xmsl = Number(ele.jb)
      }
    })
  }

  // 获取表格行数据
  private handleGetIndex(val: any) {
    console.log(val)
    this.rowIndex = val.index
    this.YPZH = val.ypzh
    this.clickFlag = true
  }

  // 删除
  private handleDelete(val: any) {
    debugger
    if (!val.row.jlbh) {
      this.tableDatas.splice(val.$index, 1)
      this.reloadYpzho(this.tableDatas)
    } else {
      deleteByJlxh({ jlbh: val.row.jlbh }).then(() => {
        this.$notify({
          type: 'success',
          title: '已删除',
          message: '',
        })
        this.reloadYpzho(this.tableDatas)
        this.$emit('delete', val.row.ztbh)
      })
    }
    this.rowIndex--
    console.log(this.rowIndex)
  }



  // 删除数据重新为列表组号排序
  private reloadYpzho(list: Array<any>) {
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
        this.reloadYpzho(list)
        return
      }
    }
  }

  private getPcData(value: any) {
    getPubpc({ pcbm: value.row.sypc }).then((res) => {
      value.row.mrcs = res.data
    })
    this.colLabel = null
    this.rowIndex = -1
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/inputTable.scss';
.his-suite {
  height: initial !important;
  .row {
    .label {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 24px;
      .title {
        font-family: siyuanMedium;
      }
      .el-divider--vertical {
        margin: 0 10px;
      }
    }
  }
}

::v-deep .el-table--medium td .cell {
  padding: 0px !important;
}

::v-deep .color-group .cell {
  padding: 0 !important;
  .orangeBack,
  .greenBack {
    height: 32px;
    opacity: 0.3 !important;
  }

  .greenBack {
    background: #0fcaad;
  }

  .orangeBack {
    background: #ffbf00;
  }
}

// .greenBack{
//   border: 1px solid #f00;
// }

.action {
  height: 28px;
}

.bottom-label {
  margin-left: 0px;
  margin-top: 5px;
  font-size: 13px;
  color: #222b31;
}

::v-deep .w100 {
  height: 30px;
  width: 100%;
}

::v-deep .el-input__inner {
  height: 28px;
}
</style>
