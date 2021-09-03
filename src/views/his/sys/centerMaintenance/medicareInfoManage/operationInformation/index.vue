<!--
 * @Date:
 * @LastEditors:
 * @LastEditTime:
 * @description: 手术信息维护
 -->
<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="12">
        <div class="his-module his-small">
          <pagenation-list
            ref="pageTable1"
            v-model="tableDatas"
            data-url="/op-service/optmzfs/querySurgicalItems"
            http-method="post"
            :list-height="listSlotHeight"
            :searchData="searchData1"
          >
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">{{ $t('手术信息维护') }}</h1>
                <el-divider direction="vertical" class="mr4"></el-divider>

                <div class="searchTitle">科室选择</div>
                <search-select
                  style="width:100%"
                  table-name="SYS_DICT_CONFIG"
                  kid="37"
                  v-model="ruleForm.ksdm"
                  placeholder="请选择科室"
                  :backfillValue="ruleForm.ksdm"
                  @change="changeDepartment"
                  :clearable="false"
                />
                <el-divider direction="vertical" class="mr4"></el-divider>
                <div class="searchTitle">搜索</div>
                <el-input
                  placeholder="请输入拼音代码"
                  v-model="searchData1.pydm"
                  @keyup.enter.native="searchLists"
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
              @row-dblclick="addOperation"
              tooltip-effect="light"
            >
              <!-- 序号 -->
              <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
              <!-- 费用序号 -->
              <el-table-column prop="fyxh" label="费用序号" width="70"></el-table-column>
              <!--手术名称 -->
              <el-table-column prop="fymc" label="手术名称" show-overflow-tooltip></el-table-column>
              <!-- 费用单价 -->
              <el-table-column prop="fydj" label="费用单价" width="70"></el-table-column>
              <!-- 拼音码 -->
              <el-table-column prop="pydm" label="拼音码" show-overflow-tooltip></el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col class="ht" :span="12">
        <div class="his-module his-small">
          <div slot="header" class="row">
            <div class="label">
              <div class="title">科室手术信息</div>
            </div>
          </div>
          <pagenation-list
            ref="pageTable2"
            v-model="tableDatas1"
            data-url="/op-service/optssfl/userInfo"
            http-method="post"
            :list-height="listSlotHeight"
            :searchData="searchData2"
          >
            <el-table
              :data="tableDatas1"
              border
              stripe
              :highlight-current-row="true"
              slot="list"
              :height="listSlotHeight-105"
              class="scroll-bar"
              @row-dblclick="delOperation"
            >
              <!-- 序号 -->
              <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
              <!-- 手术名称 -->
              <el-table-column prop="ssmc" :label="$t('手术名称')"></el-table-column>
              <!--科室 -->
              <el-table-column prop="ksdm" :label="$t('科室')">
                <template slot-scope="scope">
                  <div>{{$store.state.webSqlDict.OUTPATIENT_DEPARTMENT.find(item => item.dv == scope.row.ksdm) && $store.state.webSqlDict.OUTPATIENT_DEPARTMENT.find(item => item.dv == scope.row.ksdm).dn}}</div>
                </template>
              </el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { addOperation, delOperation } from '@/api/his/sys/centerMaintenance/medicareInfoManage/operationInformation.ts'
//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'operationInformation'
})
export default class extends Vue {
  //声明变量，方法
  private tableDatas: Array<any> = [] //表格数据
  private tableDatas1: Array<any> = []
  private tipTitle: string = ''
  private listSlotHeight: number = 0 //高度
  private searchData1: any = {
    fygb: '',
    fymc: '',
    pydm: '',
    ybbm: '',
    zfpb: ''
  } //搜索手术名称参数

  private searchData2: any = {
    ksdm: ''
  } // 搜索科室手术信息参数

  private ruleForm: any = {
    ksdm: ''
  }
  private rules: object = {
    pydm: [{ required: true, message: '请输入拼音代码', trigger: 'blur' }],
    mzdm: [{ required: true, message: '请输入麻醉代码', trigger: 'blur' }],
    mzmc: [{ required: true, message: '请输入麻醉名称', trigger: 'blur' }]
  }
  //行点击切换新增/编辑
  private getChange() {}

  // 左侧行双击添加科室手术信息
  private addOperation(row: any) {
    console.log(row)
    if (this.ruleForm.ksdm) {
      const params: any = {
        ksdm: this.ruleForm.ksdm,
        ssmc: row.fymc,
        ssnm: row.fyxh
      }
      addOperation(params).then((res: any) => {
        if (res.errorCode == 'SUCCESS') {
          this.getRightList()
        }
      })
    } else {
      this.$message({
        message: '请先选择科室',
        type: 'warning'
      })
    }
  }

  // 右侧行内双击删除科室手术信息
  private delOperation(row: any) {
    delOperation({ id: row.id }).then((res: any) => {
      console.log(res)
      this.getRightList()
    })
  }
  // 切换科室获取右侧表格数据
  private changeDepartment() {
    this.searchData2.ksdm = this.ruleForm.ksdm
    this.getRightList()
  }

  // 获取左侧表格数据
  private getLeftList() {
    const pageTable: any = this.$refs.pageTable1
    pageTable.getList()
  }

  // 获取右侧表格数据
  private getRightList() {
    const pageTable: any = this.$refs.pageTable2
    pageTable.getList()
  }

  // 左侧表格条件查询
  searchLists() {
    const pageTable: any = this.$refs['pageTable1']
    pageTable.searchList()
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    this.getLeftList()
  }
}
</script>

<style lang="scss" scoped>
.title {
  height: 28px;
  display: flex;
  align-content: center;
  flex-direction: row;
  align-items: center;
}

.his-small .row .label::v-deep .el-input .el-input__inner {
  width: 148px;
}
</style>
