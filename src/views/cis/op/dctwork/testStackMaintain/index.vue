<template>
  <div class="content">
    <el-row :gutter="10" class="ht">
      <el-col :span="6">
        <div class="his-module his-small his-mini his-check-suite">
          <pagenation-list ref="pageTableA" v-model="tableDatasA" data-url="/op-service/lisjyztlx/queryPage" http-method="post" :list-height="listSlotHeight" :pageProps="{ layout: 'total, prev, pager, next, jumper' }">
            <div class="row" slot="header">
              <div class="label">
                <h1 class="title">组套类型</h1>
                <el-divider direction="vertical"></el-divider>
                <div class="btn">
                  <el-button size="mini" type="text" :disabled="!isAdd" @click="addA">
                    <i class="icon his-btn-add green"></i>
                    <span>{{ $t('common.add') }}</span>
                  </el-button>
                </div>
              </div>
            </div>
            <el-table slot="list" :data="tableDatasA" border :fit="true" stripe :highlight-current-row="true" :height="listSlotHeight - 103" class="scroll-bar" @row-click="getMiddleList">
              <el-table-column prop="webSortNumber" width="32"></el-table-column>
              <el-table-column prop="name" :label="'组套类型名称'" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="!scope.row.webRowStatus">
                    {{ scope.row.name }}
                  </span>
                  <el-input v-if="scope.row.webRowStatus === true" v-model="scope.row.name" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column :label="$t('table.actions')" width="60" align="center" class-name="action-btns">
                <template slot-scope="scope">
                  <el-tooltip :content="$t('common.edit')" v-if="!scope.row.webRowStatus" effect="light">
                    <el-button @click.stop="handleEdit(scope.row)">
                      <i class="icon his-edit his-cancellationicon" />
                    </el-button>
                  </el-tooltip>
                  <el-tooltip :content="$t('common.save')" effect="light" v-if="scope.row.webRowStatus">
                    <el-button class="blue" @click.stop="handleSave(scope.row)">
                      <i class="icon his-right_caozuo_baochun" />
                    </el-button>
                  </el-tooltip>
                  <el-tooltip :content="$t('common.logOff')" effect="light">
                    <el-popconfirm hideIcon :confirmButtonText="$t('common.confirm')" :cancelButtonText="$t('common.cancel')" :title="$t('common.logOffTip')" @confirm="delectRowLeft(scope.row)">
                      <el-button slot="reference" class="red">
                        <i class="icon his-del his-cancellationicon" />
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <!-- 中间列表 -->
      <el-col :span="7">
        <div class="his-module his-small his-mini his-check-suite">
          <pagenation-list ref="pageTableB" v-model="tableDatasB" data-url="/op-service/opzt01/queryPage" http-method="post" :list-height="listSlotHeight" :searchData="searchData" :pageProps="{ layout: 'total, prev, pager, next, jumper' }">
            <div class="row" slot="header">
              <div class="label">
                <h1 class="title">组套名称</h1>
                <div class="btn">
                  <el-divider direction="vertical"></el-divider>
                  <el-button size="mini" type="text" :disabled="!isAddMid || searchData.ztlx == ''" @click="addB()">
                    <i class="icon his-btn-add green"></i>
                    <span>{{ $t('common.add') }}</span>
                  </el-button>
                </div>
              </div>
            </div>
            <el-table slot="list" :data="tableDatasB" border :fit="true" stripe :highlight-current-row="true" :height="listSlotHeight - 103" class="scroll-bar" @row-click="getRightList">
              <el-table-column prop="webSortNumber" width="32"></el-table-column>
              <el-table-column prop="ztlxMc" :label="'组套类型'" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="!scope.row.webRowStatus">
                    {{ scope.row.ztlxMc }}
                  </span>
                  <el-input v-if="scope.row.webRowStatus === true" disabled size="mini" v-model="scope.row.ztlxMc"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="ztmc" :label="'组套名称'" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="!scope.row.webRowStatus">{{ scope.row.ztmc }}</span>
                  <el-input size="mini" v-if="scope.row.webRowStatus === true" v-model="scope.row.ztmc" maxlength="20"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="sfqy" :label="'状态'" width="50">
                <template slot-scope="scope">
                  <span :class="scope.row.sfqy == 0 ? 'reds' : 'blues'">
                    {{ scope.row.sfqy == 0 ? '停用' : '启用' }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('table.actions')" width="67" align="center" class-name="action-btns">
                <template slot-scope="scope">
                  <el-tooltip :content="$t('common.edit')" v-if="!scope.row.webRowStatus" effect="light">
                    <el-button @click.stop="handleEditMid(scope.row)">
                      <i class="icon his-edit his-cancellationicon" />
                    </el-button>
                  </el-tooltip>

                  <el-tooltip :content="$t('common.save')" effect="light" v-if="scope.row.webRowStatus">
                    <el-button class="blue" @click.stop="handleSaveMid(scope.row)">
                      <i class="icon his-right_caozuo_baochun" />
                    </el-button>
                  </el-tooltip>
                  <!-- 停用 启用-->
                  <el-tooltip :content="scope.row.sfqy == 0 ? $t('common.disable') : $t('common.enable')" effect="light">
                    <el-popconfirm class="ml8" hideIcon :confirmButtonText="scope.row.sfqy == 0 ? $t('common.enable') : $t('common.disable')" :cancelButtonText="$t('common.cancel')" :title="scope.row.sfqy == 0 ? $t('sysManage.confirmAutomated') : $t('sysManage.confirmDisabled')" @confirm="handleEnable(scope.row)">
                      <el-button slot="reference" :class="[scope.row.sfqy == 0 ? 'red' : 'green']" @click.stop>
                        <i class="icon" :class="[scope.row.sfqy == 0 ? 'his-disabled' : 'his-automated']"></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <!-- 右侧组套详细 -->
      <el-col :span="11">
        <div class="his-module his-small his-mini his-check-suite">
          <div class="row" slot="header">
            <div class="label">
              <h1 class="title">组套详细</h1>
              <el-divider direction="vertical"></el-divider>
              <div class="btn">
                <el-button size="mini" type="text" class="mr10" @click="addCInsert">
                  <i class="icon his-inserting"></i>
                  <span>插入</span>
                </el-button>
                <!-- 新租 -->
                <el-button size="mini" type="text" class="mr10" @click="addCGroup">
                  <i class="icon his-group"></i>
                  <span>新组</span>
                </el-button>
                <!-- 保存 -->
                <el-button @click="saveRight">
                  <i class="his-btn-save icon green"></i>
                  <span>{{ $t('common.save') }}</span>
                </el-button>
              </div>
            </div>
          </div>
          <!--					<edit-table-->
          <!--							v-model="tableDatas"-->
          <!--							slot="list"-->
          <!--							:height="listSlotHeight - 113"-->
          <!--							:headerArray="headerArrayC"-->
          <!--							:showFooter="false"-->
          <!--							ref="editTableC"-->
          <!--							:showDelBtn="true"-->
          <!--					>-->
          <!--						&lt;!&ndash; 用插槽的方式写操作按钮列 &ndash;&gt;-->
          <!--						<div slot="button" slot-scope="data">-->
          <!--							<el-button @click="handleDelete(data.scope)">-->
          <!--								<i class="icon his-del his-cancellationicon"/>-->
          <!--							</el-button>-->
          <!--						</div>-->
          <!--					</edit-table>-->

          <el-table :data="tableDatas" border stripe :highlight-current-row="true" :height="listSlotHeight - 103" class="scroll-bar" :row-class-name="tableRowClassName" @row-click="handleGetIndex">
            <el-table-column width="16" class-name="color-group">
              <template slot-scope="scope">
                <div class="w100" :class="scope.row.ypzh % 2 === 1 ? 'greenBack' : 'orangeBack'"></div>
              </template>
            </el-table-column>
            <el-table-column type="index" width="32"></el-table-column>
            <el-table-column label="项目名称" min-width="120" label-class-name="first-red" show-overflow-tooltip>
              <template slot-scope="scope">
                <remoteSearchBox
                  v-model="scope.row.xmmc"
                  name="jyxm"
                  :ref="`${scope.$index}-1`"
                  style="height: 32px;"
                  @getData="setData"
                  :resultTableHeader="resultTableHeader"
                  :searchData="searchSelectData"
                  :searchField="{
                    yp: 'pydm',
                  }"
                  :showLabel="{
                    yp: 'fymc',
                  }"
                />
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="xmsl" width="60">
              <template slot-scope="scope">
                <input-box v-model="scope.row.xmsl" :ref="`${scope.$index}-1`" style="height: 32px;" />
              </template>
            </el-table-column>
            <el-table-column label="单价" class-name="text-blue-td" prop="fydj" width="80"></el-table-column>
            <el-table-column label="商保价格" class-name="text-blue-td" prop="sbjg" width="80"></el-table-column>
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
          <div class="row bottom-bar">
            <p>
              明细条数:
              <em>{{ tableDatas.length }}</em>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { addExamineSuiteName, queryDetailXm, editExamineSuiteName, logoutExamineSuiteName, deleteByJlxh, add, edit, enable, disEnable, saveRight } from '@/api/cis/op/dctwork/examineSuite'
import { isNullOrUndefined } from 'util'
import { checkStrIsNull } from '@/utils'
import { doc } from 'prettier'
import debug = doc.debug

export const NTableInfo = {
  index: 0,
  gytj: 0,
  jlbh: 0,
  jldw: '',
  jylx: 0,
  jz: 0,
  mrcs: 0,
  pageNum: 0,
  pageSize: 0,
  sypc: '',
  xmbh: 0,
  xmmc: '',
  xmsl: 0,
  ycjl: 0,
  ypsl: 0,
  ypzh: 0,
  yyts: 0,
  ztbh: 0,
}

@Component({
  name: 'testStackMaintain',
  components: {},
})
export default class extends Vue {
  private tableDatas: Array<any> = []
  private tableDatasA: Array<any> = []
  private tableDatasB: Array<any> = []
  private searchData: any = {
    pageNum: 1,
    pageSize: 10,
    ztlb: 5,
    sslb: 1,
    ztlx: '',
    ztlxMc: '',
  }
  private clickFlag: boolean = false // 点击插入判断
  private YPZH:number = 0 // 获取当前行药品组号

  // private headerArrayC: Array<any> = [
  //   {
  //     prop: 'ypzh',
  //     type: 'backColor',
  //     width: 14
  //   },
  //   {
  //     prop: 'xmmc',
  //     label: '项目名称',
  //     width: '',
  //     type: 'select-search', //点击后单元格变成远程搜索下拉框
  //     url: '/ypsrf/queryFeeYlsfxmdj', //远程搜索的api
  //     queryData: 'pydm', //远程搜索的搜索字段
  //     showLabel: 'fymc',
  //     searchData: {},
  //     resultHeader: [
  //       {
  //         prop: 'fymc',
  //         label: '费用名称'
  //       },
  //       {
  //         prop: 'fydw',
  //         label: '费用单位'
  //       },
  //       {
  //         prop: 'fydj',
  //         label: '费用单价'
  //       },
  //       {
  //         prop: 'bzjg',
  //         label: '标准价格'
  //       }
  //     ],
  //     selectResult: {
  //       xmmc: 'fymc',
  //       fydj: 'fydj',
  //       sbjg: 'bzjg',
  //       xmbh: 'fyxh'
  //     }
  //   },
  //
  //   {
  //     prop: 'xmsl',
  //     label: '数量',
  //     type: 'input',
  //     width: '45'
  //   },
  //   {
  //     prop: 'fydj',
  //     label: '单价',
  //     type: 'text',
  //     width: '45'
  //   },
  //   {
  //     prop: 'sbjg',
  //     label: '商保价格',
  //     type: 'text',
  //     width: '80'
  //   }
  // ]
  private resultTableHeader: any = {
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
  private searchSelectData: any = {
    yp: {
      pydm: '',
      xmlx: 4,
    },
  }
  private isAdd: boolean = true
  private isAddMid: boolean = true
  private isAddRight: boolean = true
  private isSelectCenter: boolean = false
  private searchDataRight: any = {
    ztbh: '',
  }
  private listSlotHeight: number = 0
  private rowIndex: number = -1

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }

  mounted() {
    this.getList()
  }

  private getList() {
    const pageTableA: any = this.$refs.pageTableA
    pageTableA.getList()
    this.isAdd = true
  }

  private addA() {
    this.isAdd = false
    let param = {
      webRowStatus: false,
      name: '',
    }
    param.webRowStatus = true
    this.tableDatasA.splice(0, 0, param)
  }

  /**
   * @LastEditors: zhml
   * @Description: 修改和新增按钮的交互
   * @param {type} params
   * @return:
   */
  private handleEdit(val: any) {
    const list = this.tableDatasA.filter((item) => item.webRowStatus)
    this.isAdd = !this.isAdd
    if (list.length == 0) {
      val.webRowStatus = !val.webRowStatus
    } else {
      this.$notify({
        type: 'warning',
        message: '请先保存已修改的数据',
        title: '',
      })
    }
  }

  //数据交互
  private tableRowClassName({ row, rowIndex }: any) {
    row.index = rowIndex
  }

  // 获取表格当前行
  private handleGetIndex(val: any) {
    console.log('val',val.ypzh)
    this.rowIndex = val.index
    this.YPZH = val.ypzh
    this.clickFlag = true
  }

  private setData(obj: any) {
    if (this.checkUnique(obj.fyxh, this.tableDatas)) {
      this.tableDatas[this.rowIndex].xmmc = obj.fymc
      this.tableDatas[this.rowIndex].fydj = obj.fydj
      this.tableDatas[this.rowIndex].sbjg = obj.bzjg
      this.tableDatas[this.rowIndex].xmbh = obj.fyxh
      this.tableDatas[this.rowIndex].xmsl = 1
    } else {
      this.$notify.warning('已有药品')
      obj = {}
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
    let cc = list.findIndex((item: any) => item.xmbh == value)
    if (cc == -1) return true
    else return false
  }

  /**
   * @LastEditors: zhml
   * @Description: 保存组套类型名称
   * @param {type} params
   * @return:
   */
  private handleSave(val: any) {
    // console.log('ooooo', val)
    if (checkStrIsNull(val.name)) {
      this.$notify({
        type: 'warning',
        title: '请输入组套类型名称',
        message: '',
      })
    } else if (val.id && !checkStrIsNull(val.name)) {
      editExamineSuiteName(val).then(() => {
        this.$notify({
          type: 'success',
          title: '修改成功',
          message: '',
        })
        this.getList()
      })
      this.isAdd = true
    } else {
      addExamineSuiteName({ name: val.name }).then(() => {
        this.$notify({
          type: 'success',
          title: '新增成功',
          message: '',
        })
        this.getList()
      })
      this.isAdd = true
    }
  }

  private delectRowLeft(val: any) {
    if (!val.id) {
      this.tableDatasA.splice(0, 1)
      this.isAdd = true
      return
    }
    const list = this.tableDatasA.filter((item) => item.webRowStatus)
    this.isAdd = !this.isAdd
    if (list.length != 0) {
      this.$notify.warning('请先保存已修改的数据')
      return
    }
    logoutExamineSuiteName({ id: val.id }).then(() => {
      this.$notify({
        type: 'success',
        title: '注销成功',
        message: '',
      })
      this.getList()
    }).catch((cc)=>{
      this.getList()
    })
  }

  // 获取中间列表的数据
  private getMiddleList(val: any) {
    this.isAddMid = true
    if (val.id == null) {
      return
    }
    this.searchData.ztlx = val.id
    this.searchData.ztlxMc = val.name
    this.getListMid()
    this.tableDatas = []
    if (this.isSelectCenter == false) {
      this.isSelectCenter = true
    }
  }

  private getListMid() {
    const pageTableB: any = this.$refs.pageTableB
    pageTableB.searchList()
  }

  private addB() {
    this.isAddMid = false
    let param = {
      webRowStatus: false,
      ztmc: '',
      ztlxMc: this.searchData.ztlxMc,
    }
    param.webRowStatus = true
    this.tableDatasB.splice(0, 0, param)
  }

  private handleEditMid(val: any) {
    var list = this.tableDatasA.filter((item) => item.webRowStatus)
    this.isAddMid = !this.isAddMid
    if (list.length == 0) {
      val.webRowStatus = !val.webRowStatus
    } else {
      this.$notify({
        type: 'warning',
        message: '请先保存已修改的数据',
        title: '',
      })
    }
  }

  private handleSaveMid(val: any) {
    if (isNullOrUndefined(val.ztmc)) {
      this.$notify({
        type: 'warning',
        title: '请输入组套类型名称',
        message: '',
      })
    } else if (val.ztbh && !isNullOrUndefined(val.ztmc)) {
      edit(val).then(() => {
        this.$notify({
          type: 'success',
          title: '修改成功',
          message: '',
        })
        this.isAddMid = true
        this.getListMid()
      })
    } else {
      let param = {
        sslb: 1,
        ztlb: 5,
        ztlx: this.searchData.ztlx,
        ztmc: val.ztmc,
      }
      add(param).then(() => {
        this.$notify({
          type: 'success',
          title: '新增成功',
          message: '',
        })
        this.isAddMid = true
        this.getListMid()
      })
    }
  }

  private handleEnable(val: any) {
    if (!val.ztbh) return
    if (val.sfqy) {
      disEnable({ ztbh: val.ztbh }).then(() => {
        this.$notify.success({
          title: '已停用',
          message: '',
        })
        val.sfqy = 0
      })
    } else {
      enable({ ztbh: val.ztbh }).then(() => {
        this.$notify.success({
          title: '已启用',
          message: '',
        })
        val.sfqy = 1
      })
    }
  }

  /**
   * @LastEditors: zhml
   * @Description: 新增的数据是否已有药品名称,判断是否可以再次新增组或新增药品
   * @param {type} params
   * @return:
   */
  private isClick(value: Array<any>) {
    if (value.length == 0) {
      return true
    } else if (value[value.length - 1].xmmc == '' || value[value.length - 1].xmmc === null || value[value.length - 1].xmmc === undefined) {
      return false
    } else {
      return true
    }
  }

  private addCInsert() {
    this.rowIndex += 1
    if (this.isSelectCenter == false) {
      return
    }

    if (this.isClick(this.tableDatas)) {
      const param = { ...NTableInfo }
      param.index = this.tableDatas.length + 1
      param.ztbh = this.searchDataRight.ztbh
      if (this.tableDatas.length == 0) {
        param.ypzh = 1
      } else {
        if(this.clickFlag) {
          param.ypzh = this.YPZH
        } else {
          param.ypzh = this.tableDatas[this.tableDatas.length - 1].ypzh
        }
      }

      if(this.tableDatas.length == 0) {
        this.tableDatas.push(param)
      } else if(this.clickFlag) {
        this.tableDatas.splice(this.rowIndex,0,param)
      } else {
        this.tableDatas.splice(this.tableDatas.length,0,param)
      }
    } else {
      return null
    }
  }

  private addCGroup() {
    if (this.isSelectCenter == false) {
      return
    }
    if (this.isClick(this.tableDatas)) {
      const param = { ...NTableInfo }
      param.index = this.tableDatas.length + 1
      param.ztbh = this.searchDataRight.ztbh
      if (this.tableDatas.length == 0) {
        param.ypzh = 1
      } else {
        param.ypzh = this.tableDatas[this.tableDatas.length - 1].ypzh + 1
      }
      this.tableDatas.push(param)
    } else {
      return null
    }
  }

  // 删除
  private handleDelete(val: any) {
    if (!val.row.jlbh) {
      this.tableDatas.splice(val.$index, 1)
      this.reloadYpzho(this.tableDatas)
    } else {
      deleteByJlxh({ jlbh: val.row.jlbh }).then(() => {
        this.$notify({
          type: 'success',
          title: '删除成功',
          message: '',
        })
        this.reloadYpzho(this.tableDatas)
        this.getRightList(val.row)
      })
    }
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

  private getRightList(value: any) {
    this.isSelectCenter = true
    if (!value.ztbh) {
      return
    }
    this.searchDataRight.ztbh = value.ztbh
    queryDetailXm({ ztbh: value.ztbh }).then((res) => {
      this.tableDatas = res.data.map((item: any, index: number) => {
        item.webSortNumber = index + 1
        return item
      })
    })
  }

  /*
   *@Description: 没有选中组套名称或者组套编号，校验不允许保存
   *@param: list
   *@response: success
   *@Author: zhml
   *@Date: 2020-09-27 13:32:05
   */
  private saveRight() {
    if (this.isSelectCenter == false) {
      return
    }
    let list = this.tableDatas.filter((item: any) => {
      if (item.ztbh != '') {
        return item
      }
    })
    if (list.length == 0) {
      this.$notify.warning('请选择组套名称添加对应的组套详情')
    } else {
      saveRight(list).then((res: any) => {
        this.$notify({
          type: 'success',
          title: '保存成功',
          message: '',
        })

        queryDetailXm({ ztbh: list[0].ztbh }).then((res) => {
          this.tableDatas = res.data.map((item: any, index: number) => {
            item.webSortNumber = index + 1
            return item
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.his-check-suite {
  padding-top: 8px;

  .row {
    padding-bottom: 0;

    .label {
      .el-divider--vertical {
        margin: 0 10px;
      }

      .btn {
        .el-button {
          padding: 4px 0;
        }
      }
    }
  }
}

.w100 {
  width: 100%;
  height: 32px;
}

.no-underline {
  ::v-deep .el-table::before {
    background: #ffffff;
  }
}

.bottom-bar {
  height: 24px;
  padding: 0;
  margin: 8px 0 0;
}

.bottom-bar p em {
  color: #1485ff;
  font-size: 16px;
  font-weight: bold;
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
</style>
