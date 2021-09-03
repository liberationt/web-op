<template>
  <div style="padding:16px" class="content0">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="分页表格" name="first">
        <pagenation-list
          ref="pageTable"
          data-url="/system-service/sysuser/queryPage"
          v-model="tabledata"
          :searchData="searchData"
          :list-height="listSlotHeight"
          http-method="post"
        >
          <div slot="header" style="display:flex;height:45px">
            <H3 style="flex:1">我是标题。我可以自定义样式，添加各种元素!</H3>
            <el-button type="primary" v-preventReClick @click="getTree">测试按钮</el-button>
            <el-button type="primary" v-preventReClick @click="preventReClick">防重复点击</el-button>
            <el-button type="success" @click="print">打印测试</el-button>
            <el-button type="success">成功按钮</el-button>
            <el-button type="info">信息按钮</el-button>
            <el-button type="warning">警告按钮</el-button>
            <el-button type="danger" v-preventReClick @click="deleteTable">删除所有表</el-button>
          </div>
          <el-table slot="list" :data="tabledata" style="width: 100%" :height="listSlotHeight">
            <el-table-column prop="webSortNumber" label="序号"></el-table-column>
            <el-table-column prop="userName" label="用户名"></el-table-column>
            <el-table-column prop="pyCode" label="拼音码"></el-table-column>
            <el-table-column prop="wbCode" label="五笔码"></el-table-column>
          </el-table>
          <div slot="remark" style="display:flex;height:40px">
            <H5 style="flex:1">我是备注内容。我也可以自定义样式，添加各种元素!</H5>
          </div>
        </pagenation-list>
      </el-tab-pane>
      <el-tab-pane label="搜索下拉" name="second">
        <search-select
          table-name="SYS_FLAG_DATA"
          kid="3"
          v-model="currSelectId"
          placeholder=" "
          :backfillValue="currSelectId"
        />
        <el-button style="margin-left:8px" type="warning" @click="eventClick">改变默认值</el-button>
        <cascade-address />
      </el-tab-pane>
      <el-tab-pane label="左右拉伸" name="leftRight">
        <div class="split-pane-con">
          <split-pane v-model="offset">
            <div slot="left" class="content-item">left</div>
            <div slot="right" class="content-item">right</div>
          </split-pane>
        </div>
      </el-tab-pane>
      <el-tab-pane label="点击编辑" name="clickEidt">
        <div class="his-small his-module">
          <!-- 编辑表格demo，搭配使用nextFocus方法可以实现触发事件下一个可以编辑的单元格获取焦点 -->
          <el-table
            :data="drugData"
            border
            :fit="true"
            tooltip-effect="light"
            stripe
            :highlight-current-row="true"
            slot="list"
            :height="listSlotHeight - 41 - 62"
            class="scroll-bar"
          >
            <el-table-column prop="name" label="12313" width="150">
              <template slot-scope="scope">
                <inputBox
                  :required="true"
                  v-model="scope.row.name"
                  :ref="`${scope.$index}-1`"
                  style="height: 32px"
                  @keyup.enter.native="nextFocus(scope.$index, 1)"
                  :disabled="scope.$index == 2"
                />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="12313" width="650">
              <template slot-scope="scope">
                <select-box
                  v-model="scope.row.age"
                  :required="true"
                  :ref="`${scope.$index}-2`"
                  style="height: 32px"
                  @change="nextFocus(scope.$index, 2)"
                  :options="$store.state.webSqlDict.DEP_CODE_DICT"
                  option_label_filed="dn"
                  option_value_filed="dv"
                  @getData="getData"
                  :disabled="scope.$index % 2 == 0"
                ></select-box>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="12313" width="150">
              <template slot-scope="scope">
                <datePickerBox
                  :required="true"
                  v-model="scope.row.date"
                  :ref="`${scope.$index}-3`"
                  style="height: 32px"
                  @change="nextFocus(scope.$index, 3)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="date" label="12313" width="150">
              <template slot-scope="scope">
                <dictSearchBox
                  :required="true"
                  v-model="scope.row.b"
                  :ref="`${scope.$index}-4`"
                  style="height: 32px"
                  tableName="GY_JBBM"
                  :resultHeader="resultTableHeader"
                  labelFiled="JBMC"
                  valueFiled="ICD_CODE"
                  searchField="PYDM"
                  popoverWidth="400"
                  @getData="getData"
                />
                <!-- @change="nextFocus(scope.$index, 4)" -->
              </template>
            </el-table-column>
            <el-table-column prop="date" label="12313" width="150">
              <template slot-scope="scope">
                <!--
                  用这个组件之前，先去tableRemoteSearchSelect组件中添加自己需要用到的url
                  searchData: 传一个对象 yp:{}中放直接查询的的固定参数 zt:{}中放搜索字段前要输入/的查询的的固定参数 xm:{}中放搜索字段前要输入.的查询的的固定参数
                  resultTableHeader: 传一个对象 yp:[]中放直接查询的的返回数据的表头数组 zt:[]中放参数前带/查询的的返回数据的表头数组 xm:[]中放参数前带.查询的的返回数据的表头数组
                  searchField传入一个对象 yp:''中放直接查询的搜索字段 zt:''中放搜索字段前要输入/查询的搜索字段 xm:''中放搜索字段前要输入.查询的搜索字段
                  showLabel传入一个对象 yp:''中放直接查询的显示的字段 zt:''中放搜索字段前要输入/查询的显示的字段 zt:''中放搜索字段前要输入.查询的显示的字段
                  name传入一个字符串，与在组件中添加的url的key值
                -->
                <remoteSearchBox
                  :required="true"
                  v-model="scope.row.c"
                  :ref="`${scope.$index}-5`"
                  style="height: 32px"
                  :popoverWidth="400"
                  @getData="getData"
                  :searchData="{
                      yp:{
                        bqdm:1030,
                      },
                      zt:{},
                      xm:{
                        brxz:20
                      }
                    }"
                  :resultTableHeader="{
                    yp:[
                    {
                      prop:'ypmc',
                      label: '药品名称'
                    },
                    {
                      prop:'cdmc',
                      label: '产地名称'
                    }
                    ],
                    zt:[
                    {
                      prop:'ypmc',
                      label: '项目名称'
                    }
                    ],
                    xm:[
                    {
                      prop:'yzmc',
                      label: '项目名称',
                      width:'200'
                    },
                    {
                      prop:'fydw',
                      label: '单位',
                      width:'40'
                    },{
                      prop:'fydj',
                      label:'单价',
                    }
                    ],

                  }"
                  :searchField="{
                    yp:'pydm',
                    zt:'srdm',
                    xm:'pydm'
                  }"
                  :showLabel="{
                    yp:'ypmc',
                    zt:'ypmc',
                    xm:'yzmc'
                  }"
                  :name="
                      'bqyz'
                      "
                  @change="nextFocus(scope.$index, 5)"
                />
              </template>
            </el-table-column>
          </el-table>
          <el-button @click="printTest">打印</el-button>
          {{drugData}}
          <remote-search-select
            :searchUrl="searchUrl"
            :resultTableHeader="resultHeader"
            :searchData="{
              cflx:  1,
              yfsb:  1
            }"
            searchField="pydm"
            showLabel="ypmc"
            ref="remoteSearchSelect"
            v-model="value"
            @getData="getData"
            :popoverWidth="420"
          >
            <el-select
              v-model="value"
              class="remote-search-select-input"
              ref="select"
              remote
              filterable
              :popper-append-to-body="false"
              @blur="selectBlur"
              :remote-method="
                    query => {
                      remoteMethod(query)
                    }
                "
              clearable
              @clear="clear(value)"
            >
              <div slot="empty"></div>
            </el-select>
          </remote-search-select>

          <remote-search-select-new
            v-model="testValue"
            :searchData="{
              yp:{
                bqdm:1030,
              },
              zt:{},
              xm:{
                brxz:20
              }
            }"
            :resultTableHeader="{
            yp:[
            {
              prop:'ypmc',
              label: '药品名称',
            },
            {
              prop:'cdmc',
              label: '产地名称',
            }
            ],
            zt:[
            {
              prop:'ypmc',
              label: '药品名称',
            },
            {
              prop:'yzmc',
              label: '产地名称',
            }
            ],
            xm:[
            {
              prop:'yzmc',
              label: '药品名称',
              width: '100'
            },
            {
              prop:'fydw',
              label: '产地名称',
              width: '100'
            },{
              prop:'fyxh',
              label:'',
            }
            ],

          }"
            :searchField="{
            yp:'pydm',
            zt:'srdm',
            xm:'pydm'
          }"
            :showLabel="{
            yp:'ypmc',
            zt:'ypmc',
            xm:'yzmc'
          }"
            name="bqyz"
            @getData="getData"
          ></remote-search-select-new>
        </div>
        <div id="table" v-show="false">
          <div class="test" style="color:red;">1232131</div>
          <div class="test" style="color:green">23423423</div>
        </div>
      </el-tab-pane>

    </el-tabs>
    <div>
      <div class="test" style="color:red">1232131</div>
      <div class="test" style="color:green">23423423</div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Watch, Vue } from 'vue-property-decorator'
import { clearDBtable } from '@/websql/functions'
import { getLodop } from '@/plugins/lodop/index.js'
import inlineCell from '@/views/testcomp/inlineCell.vue'

@Component({
  name: 'test',
  //组件引用
  components: {   },
  filters: {},
})
export default class extends Vue {
  //声明变量默认值（原data中数据）
  private msg: string = 'typescript'
  private activeName: string = 'first'
  private tabledata: Array<any> = []
  private treeData: Array<any> = []
  private treeObj: object = {}
  private searchData: object = {}
  private currSelectId: any = ''
  private offset: number = 0.6
  private listSlotHeight: number = 0
  private testValue: any = ''
  private resultTableHeader = [
    {
      prop: 'JBXH',
      label: '疾病序号',
      width: '100',
    },
    {
      prop: 'JBMC',
      label: '疾病名称',
      width: '',
    },
  ]

  //原computed中的方法
  get ntest() {
    return this.msg
  }

  //数据监控
  @Watch('currSelectId', { immediate: true })
  private oncurrSelectIdChange(val: any) {
    console.log('拿到值了 = ', val)
  }

  //钩子函数
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 55 - 45 - 40 - 40
  }

  //钩子函数
  mounted() {
    this.init()
  }
  getTree() {
    let obj: any = {}
    this.treeData = [
      { id: 2, name: '超声申请单', pid: 0, sort: 2, chileNum: 6 },
      { id: 3, name: '内镜申请单', pid: 0, sort: 3, chileNum: 5 },
      { id: 4, name: '心功能申请单', pid: 0, sort: 4, chileNum: 4 },
      { id: 71, name: '浅表器官', pid: 2, sort: 6, chileNum: 0 },
      { id: 55, name: '胸部', pid: 2, sort: 7, chileNum: 1 },
      { id: 69, name: '血管', pid: 2, sort: 8, chileNum: 0 },
      { id: 57, name: '心脏', pid: 2, sort: 9, chileNum: 0 },
      { id: 93, name: '超声介入', pid: 2, sort: 10, chileNum: 0 },
      { id: 104, name: '体检', pid: 2, sort: 12, chileNum: 0 },
      { id: 155, name: '测试09', pid: 55, sort: 22, chileNum: 0 },
    ]
    this.getTreeObj(155, null, this.treeObj)
    console.log(this.treeObj)
  }
  getTreeObj(id: number, node: any, obj: any) {
    console.log(id)
    let getNode = this.getById(id)
    if (getNode) {
      if (node == null) obj = getNode
      else {
        getNode.children = [node]
        obj = getNode
      }
      this.getTreeObj(getNode.pid, getNode, obj)
      console.log(obj)
    }
  }
  getById(id: number) {
    let arr = this.treeData.filter((item) => item.id == id)
    return arr.length == 1 ? arr[0] : null
  }

  //原methods中的方法
  private init() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private handleClick(tab: any, event: any) {
    // console.log(tab, event)
  }

  private preventReClick() {
    console.log('点击')
  }

  private getPageSize(page: any, size: any) {
    console.log(page, size)
  }

  private print() {}

  private eventClick() {
    console.log('事件触发')
    this.currSelectId = '2'
  }

  private deleteTable() {
    const TableArr = ['TB_REGION', 'PRIMARY_DIC_MAIN', 'SYS_PRIMARY_DATA', 'HSP_DATA_MAIN', 'HSP_DATA_SON', 'SYS_FLAG_DATA', 'SYS_FLAG_DATA', 'SYS_DICT_CONFIG', 'SYS_DICT_CONFIG']
    TableArr.forEach((element: any) => {
      clearDBtable(element)
    })
  }
  private value: string = '2313131'
  private searchUrl: string = '/ypsrf/queryDrugsTypk'
  private resultHeader = [
    {
      prop: 'ypmc', //搜索结果列表的的表头prop
      label: '药品名称', //搜索结果列表的的表头label
      width: 240,
    },
    {
      prop: 'yfgg',
      label: '药品规格',
      width: 100,
    },
    {
      prop: 'yfdw',
      label: '单位',
    },
  ]
  private remoteMethod(query: string) {
    if (query.length > 1) {
      if (query[0] == '*') {
        let queryFiled1 = query.substring(0)
        this.$nextTick(() => {
          ;(this.$refs.remoteSearchSelect as any).remoteMethod(queryFiled1)
        })
        this.searchUrl = '/drugscddz/que'
      } else {
        if (query[0] == '/') {
          let queryFiled2 = query.substring(1)
          this.searchUrl = '/opmzxx/doQueryJsZtInfo'
          this.$nextTick(() => {
            ;(this.$refs.remoteSearchSelect as any).remoteMethod(queryFiled2)
          })
        } else {
          this.searchUrl = '/ypsrf/queryDrugsTypk'
          this.$nextTick(() => {
            ;(this.$refs.remoteSearchSelect as any).remoteMethod(query)
          })
        }
      }
    } else {
      ;(this.$refs.remoteSearchSelect as any).closePopover()
    }
  }
  private getData(val: any) {
    console.log('getdata')
    console.log(val)
  }
  private drugData: Array<any> = [{ age: 989, b: 'A15.3' }, { disable: true }]
  private nextFocus(index: number, labelIndex: number) {
    if (this.$refs[`${index}-${labelIndex + 1}`]) {
      if ((this.$refs[`${index}-${labelIndex + 1}`] as any).disabled) {
        this.nextFocus(index, labelIndex + 1)
      } else {
        ;(this.$refs[`${index}-${labelIndex}`] as any).blur()
        ;(this.$refs[`${index}-${labelIndex + 1}`] as any).focus()
      }
    } else {
      if (this.$refs[`${index + 1}-1`]) {
        if ((this.$refs[`${index + 1}-1`] as any).disabled) {
          this.nextFocus(index + 1, 1)
        } else {
          ;(this.$refs[`${index}-${labelIndex}`] as any).blur()
          ;(this.$refs[`${index + 1}-1`] as any).focus()
        }
      } else {
        this.drugData = [...this.drugData, {}]
        this.$nextTick(() => {
          if ((this.$refs[`${index + 1}-1`] as any).disabled) {
            this.nextFocus(index + 1, 1)
          } else {
            ;(this.$refs[`${index}-${labelIndex}`] as any).blur()
            ;(this.$refs[`${index + 1}-1`] as any).focus()
          }
        })
      }
    }
  }
  private selectBlur() {
    ;(this.$refs.remoteSearchSelect as any).selectBlur()
  }

  private printTest() {
    const table: any = document.getElementById('table')
    console.log(table.innerHTML)
    const LODOP = getLodop()
    LODOP.PRINT_INIT('打印任务名')
    LODOP.SET_PRINT_PAGESIZE(1, '185.5mm', '265.5mm', 'A4') //A4 横向打印
    LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true) //宽度超出自动缩放
    LODOP.ADD_PRINT_HTM('20%', '10%', '90%', '100%', table.innerHTML)
    LODOP.PREVIEW() //预览
  }
}
</script>

<style lang="scss">
.split-pane-con {
  margin: 0 auto;
  margin-top: 100px;
  width: 1200px;
  height: 700px;
  .content-item {
    height: 100%;
    line-height: 100%;
    color: white;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

  .test {
    transform: translate(50%, 50%)
  }
</style>
