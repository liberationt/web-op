<!--
 * @Date:
 * @LastEditors:
 * @LastEditTime:
 * @description: 附加项目维护
 -->

 <template>
  <div class="content">
    <el-row :gutter="10" class="ht">
      <el-col :span="11" class="ht">
        <div class="his-small his-module">
          <pagenation-list
            ref="pageTable1"
            v-model="tableDatas"
            data-url="/op-service/addItems/queryChargeList"
            http-method="post"
            :list-height="listSlotHeight"
            :searchData="searchData1"
          >
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">{{$t('医疗项目')}}</h1>
                <el-divider class="ml4" direction="vertical"></el-divider>
                <div class="searchTitle">搜索</div>
                <el-input
                  placeholder="请输入拼音码"
                  v-model="searchData1.pydm"
                  @keyup.enter.native="searchList"
                  @clear="searchList"
                  clearable
                >
                  <i slot="prefix" class="el-input__icon icon his-search"></i>
                </el-input>
              </div>
            </div>
            <el-table
              :data="tableDatas"
              border
              stripe
              :highlight-current-row="true"
              slot="list"
              :height="listSlotHeight-105"
              class="scroll-bar"
              @row-click="getDatas"
            >
              <!-- 序号 -->
              <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
              <!-- 费用名称 -->
              <el-table-column prop="fymc" :label="$t('费用名称')"></el-table-column>
              <el-table-column prop="fydw" :label="$t('单位')" width="80"></el-table-column>
              <el-table-column prop="pydm" :label="$t('拼音码')" width="100"></el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col :span="13">
        <div class="his-small his-module">
          <div slot="header" class="row">
            <div class="label">
              <h1 class="title">{{$t('附加项目')}}</h1>
              <el-divider class="ml4" direction="vertical"></el-divider>
              <div class="searchTitle">项目名称</div>
              <el-input
                placeholder="请输入..."
                clearable
                v-model="searchRightList.pydm"
                @keyup.enter.native="getRightatas"
                @clear="getRightatas"
              >
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input>
              <el-divider class="ml4" direction="vertical"></el-divider>
              <div class="btn" style="display:flex ;justify-content:center;align-items:center">
                <el-button type="text" size="mini" @click="handRightAddData">
                  <i class="icon his-btn-add green"></i>
                  <span>新增</span>
                </el-button>
              </div>
            </div>
          </div>

          <el-table
            :data="tableData1"
            border
            :fit="true"
            stripe
            slot="list"
            :highlight-current-row="true"
            tooltip-effect="light"
            :height="listSlotHeight - 75"
            class="scroll-bar no-underline input-table"
            @row-click="handleChange"
            @cell-click="edited"
          >
            <el-table-column type="index" width="32" align="center"></el-table-column>
            <el-table-column label="项目名称" label-class-name="first-red" prop="fymc">
              <template slot-scope="scope">
                <remoteSearchBox
                  :required="true"
                  v-model="scope.row.fymc"
                  :ref="`${scope.$index}-3`"
                  style="height: 32px"
                  :popoverWidth="350"
                  :searchData="{
                    yp:{
                      pydm:''
                    }
                  }"
                  :resultTableHeader="{
                    yp:[
                    {
                      prop:'fymc',
                      label: '费用名称'
                    },
                     {
                      prop:'fyks',
                      label: '费用科室'
                    },
                    {
                      prop:'fyxh',
                      label: '关联序号'
                    }
                    ]
                  }"
                  :searchField="{
                    yp:'pydm',
                  }"
                  :showLabel="{
                    yp:'fymc',

                  }"
                  :name="'fj'"
                  @keyup.enter.native="change(scope.$index,2)"
                  @getData="data => getDrugTableData(data,scope.$index)"
                />
              </template>
            </el-table-column>
            <el-table-column label="使用科室" prop="ksdm">
              <template slot-scope="scope">
                <!-- <search-select
                  style="width:100%"
                  table-name="SYS_DICT_CONFIG"
                  kid="4"
                  v-model="scope.row.ksdm"
                  :backfillValue="scope.row.ksdm"
                  placeholder=" "
                /> -->
                <el-select v-model="scope.row.ksdm">
                  <el-option v-for="item in ksdmList" :key="item.dv" :value="item.dv" :label="item.dn">{{item.dn}}</el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="fysl">
              <template slot-scope="scope">
                <input-box
                  v-model="scope.row.fysl"
                  :ref="`${scope.$index}-1`"
                  style="height: 32px"
                />
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('table.actions')"
              width="68"
              align="center"
              class-name="action-btns"
            >
              <template slot-scope="scope">
                <el-tooltip :content="$t('common.delete')" effect="light">
                  <el-popconfirm
                    hideIcon
                    :confirmButtonText="$t('common.confirm')"
                    :cancelButtonText="$t('common.cancel')"
                    :title="$t('common.delTip')"
                    @confirm="confirmDelete(scope.row)"
                  >
                    <el-button slot="reference" class="red">
                      <i class="icon his-del his-cancellationicon" />
                    </el-button>
                  </el-popconfirm>
                </el-tooltip>
                <el-tooltip
                  slot="reference"
                  :content="$t('common.save')"
                  effect="light"
                  :enterable="false"
                >
                  <el-button class="green" @click="handSave(scope.row)">
                    <i class="icon his-right_caozuo_baochun" />
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import Form from 'element-ui'
import { getMedicalData, getMedicalDataAdd, getMedicalDataDelete, getMedicalDataEdit } from '@/api/his/sys/centerMaintenance/medicareInfoManage/additionalItems.ts'
import { values } from 'lodash'
@Component({
  name: 'additionItems',
  filters: {},
  components: {}
})
export default class extends Vue {
  private listSlotHeight: number = 0 //列表高度
  private searchData: object = {} //搜索参数
  private searchData1: any = { pydm: '' }
  private tableDatas: Array<any> = [] //左侧表格
  private tableData1: Array<any> = [] //右侧表格
  private resData: Array<any> = []
  private xmxh: number | null = null // 项目序号
  private FYMC: string = '' // 费用名称
  private fymc: string = '' //费用名称
  private isAdd: boolean = true
  private delFlag: boolean = true // 删除标志
  private selectRightRow: number | null = null
  private ksdmList: Array<any> = [] //使用科室的数组
  private FYXH: number = 0
  private searchRightList: any = {
    xmxh: '',
    pydm: ''
  }
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  //获取医疗项目列表
  private getLists() {
    this.isAdd = true
    this.delFlag = false
    const pageTable: any = this.$refs.pageTable1
    pageTable.getList()
  }
  //右侧字典搜索
  private resultHeader = {
    yp: [
      {
        prop: 'fymc', //搜索结果列表的的表头prop
        label: '费用名称' //搜索结果列表的的表头label
      },
      {
        prop: 'fyks',
        label: '费用科室'
      },
      {
        prop: 'fysl',
        label: '费用数量'
      }
    ]
  }
  //左侧
  private getDatas(val: any) {
    console.log(val)
    this.xmxh = val.fyxh
    this.getRightatas()
  }

  //获取右侧列表
  private getRightatas() {
    this.searchRightList.xmxh = this.xmxh
    getMedicalData(this.searchRightList).then((res: any) => {
      console.log(res)
      this.tableData1 = res.data
      this.resData = res.data
    })
  }
  //新增
  private handRightAddData() {
    if (this.isAdd) {
      if (this.tableData1.length > 0) {
        let oldRowData = this.tableData1[this.tableData1.length - 1]
        if (oldRowData.fymc) {
          this.tableData1 = [{ fysl: 0 }, ...this.tableData1]
        }
      } else {
        this.tableData1 = [{ fysl: 0 }, ...this.tableData1]
      }
      this.$nextTick(() => {
        ;(this.$refs[`0-1`] as any).focus()
      })
      this.selectRightRow = this.tableData1.length - 1
    }
    this.isAdd = false
  }

  //编辑表格
  private params: object = {}
  private handleChange(val: any) {
    this.delFlag = true
    console.log(val)
    this.fymc = val.fymc
    this.params = JSON.parse(JSON.stringify(val))
  }

  //保存
  private handSave(row: any) {
    if (row.jlxh) {
      getMedicalDataEdit(row).then((res: any) => {
        if (res.errorCode == 'SUCCESS') {
          this.$notify({
            title: '修改成功',
            message: '',
            type: 'success'
          })
          this.getRightatas()
        }
      })
    } else {
      const data = {
        ksdm: row.ksdm,
        glxh: row.fyxh,
        xmxh: this.xmxh,
        sylb: 2,
        fysl: row.fysl
      }
      getMedicalDataAdd(data).then((res: any) => {
        if (res) {
          this.$notify({
            title: '新增成功',
            message: '',
            type: 'success'
          })
          this.isAdd = true
          this.getRightatas()
        }
      })
    }
  }

  mounted() {
    this.getLists()
    this.ksdmList = JSON.parse(JSON.stringify(this.$store.state.webSqlDict.DEPT_DICT))
    this.ksdmList.splice(0,0,{ dv: 0,dn: '全院科室',py: "QYKS", showOrder: 0, stop: ""})
  }

  //编辑
  private edited(event: any) {
    const datas = {
      jlxh: event.jlxh,
      fysl: event.fysl,
      glxh: event.glxh,
      jgid: event.jgid,
      ksdm: event.ksdm,
      sylb: 2,
      xmxh: event.xmxh
    }
  }
  //删除数据
  private confirmDelete(val: any) {
    if (this.isAdd) {
      if (this.delFlag) {
        getMedicalDataDelete({ jlxh: val.jlxh }).then((res: any) => {
          console.log(res)
          if (res) {
            this.$notify({
              title: '删除成功',
              message: '',
              type: 'success'
            })
            this.getRightatas()
          }
        })
        this.isAdd = true
        this.delFlag = false
      }
    } else {
      if (this.selectRightRow != null && this.selectRightRow >= 0) {
        this.tableData1.splice(0, 1)
        this.selectRightRow = this.tableData1.length - 1
        this.$notify({
          title: '已删除',
          message: '',
          type: 'success'
        })
        this.isAdd = true
        this.delFlag = false
      }
    }
  }
  //查询字典获取数据
  // private paramsData: any = {
  //   glxh: '',
  //   ksdm: Vue.prototype.AUTHORITY.outpatientCode,
  //   sylb: 2,
  //   xmxh: '',
  //   fysl: '',
  // }
  private getData(val: any, index: number) {
    // console.log(value, data)
    // data.fymc = value.fymc
    // data.fyks = value.fyks
    // data.fysl = value.fysl
    // data.xmxh = value.fyxh
    // this.paramsData.glxh = value.fyxh
    // this.paramsData.xmxh = this.xmxh
    // this.paramsData.fysl = value.fysl
    this.$set(this.tableData1, index, { ...val, fyks: val.fyks, fysl: val.fysl })
    // console.log(this.tableData1)
  }
  private getDrugTableData(val: any, index: number) {
    console.log(val)
    this.FYXH = val.fyxh
    this.$set(this.tableData1, index, { ...val, fyxh: val.fyxh, fymc: val.fymc })
  }
  //查询
  private searchList() {
    const pageTable: any = this.$refs.pageTable1
    if (this.searchData1.pydm == '') {
      pageTable.getList()
    } else {
      pageTable.searchList()
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/styles/inputTable.scss';
</style>
