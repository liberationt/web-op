<template>
  <div class="content">
    <div class="his-module his-small ht">
      <el-tabs v-model="activeName" class="tab-small underline">
        <el-tab-pane label="门诊商保冲账" name="first">
          <div class="row">
            <div class="label">
              <div class="searchTitle">时间</div>
              <el-date-picker
                type="daterange"
                v-model="date"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                class="date-wrapper"
              ></el-date-picker>
              <el-divider direction="vertical"></el-divider>
              <div class="btn">
                <el-button type="text" size="mini">
                  <i class="icon his-caozuo-Details blue"></i>
                  <span>查询</span>
                </el-button>
                <el-button type="text" size="mini">
                  <i class="icon his-btn-save blue"></i>
                  <span>保存</span>
                </el-button>
              </div>
            </div>
          </div>
          <pagenation-list
            ref="pageTable"
            v-model="tableData"
            data-url="/system-service/hrpersonnel/queryPage"
            :search-data="searchData"
            http-method="post"
            :list-height="listSlotHeight"
          >
            <el-table
              slot="list"
              stripe
              ref="table"
              :highlight-current-row="true"
              :data="tableData"
              border
              v-loading="loading"
              :height="listSlotHeight"
              class="scroll-bar"
              tooltip-effect="light"
            >
              <!-- 序号 -->
              <el-table-column
                prop="webSortNumber"
                width="32"
              ></el-table-column>
              <!-- 病人姓名 -->
              <el-table-column
                prop="rybh"
                :label="'病人姓名'"
                width="80"
              ></el-table-column>
              <!-- 发票号码 -->
              <el-table-column prop="personname" :label="'发票号码'"></el-table-column>
              <!-- 收费日期 -->
              <el-table-column
                prop="genderName"
                :label="'收费日期'"
                width="70"
              ></el-table-column>
              <!-- 操作工号 -->
              <el-table-column
                prop="officeName"
                :label="'操作工号'"
              ></el-table-column>
              <!-- 总费用 -->
              <el-table-column
                prop="jobpostName"
                :label="'总费用'"
              ></el-table-column>
              <!-- 理赔金额 -->
              <el-table-column
                prop="jobpostName"
                :label="'理赔金额'"
              ></el-table-column>
              <!-- 本次冲账金额 -->
              <el-table-column
                prop="jobpostName"
                :label="'本次冲账金额'"
                width="100px"
              ></el-table-column>
              <!-- 本次坏账金额 -->
              <el-table-column
                prop="jobpostName"
                :label="'本次坏账金额'"
                width="100px"
              ></el-table-column>
              <!-- 已冲账金额 -->
              <el-table-column
                prop="jobpostName"
                :label="'已冲账金额'"
              ></el-table-column>
              <!-- 已坏账金额 -->
              <el-table-column
                prop="jobpostName"
                :label="'已坏账金额'"
              ></el-table-column>
              <!-- 汇率损益金额 -->
              <el-table-column
                prop="jobpostName"
                :label="'汇率损益金额'"
                width="100px"
              ></el-table-column>
              <!-- 超付金额 -->
              <el-table-column
                prop="jobpostName"
                :label="'超付金额'"
              ></el-table-column>
            </el-table>
          </pagenation-list>
        </el-tab-pane>
        <el-tab-pane label="住院商保冲账" name="second">
          <div class="row">
            <div class="label">
              <div class="searchTitle">时间</div>
              <el-date-picker
                type="daterange"
                v-model="date"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                class="date-wrapper"
              ></el-date-picker>
              <el-divider direction="vertical"></el-divider>
              <div class="btn">
                <el-button type="text" size="mini">
                  <i class="icon his-caozuo-Details blue"></i>
                  <span>查询</span>
                </el-button>
                <el-button type="text" size="mini">
                  <i class="icon his-btn-save blue"></i>
                  <span>保存</span>
                </el-button>
              </div>
            </div>
          </div>
          <pagenation-list
            ref="pageTable"
            v-model="tableData"
            data-url="/system-service/hrpersonnel/queryPage"
            :search-data="searchData"
            http-method="post"
            :list-height="listSlotHeight"
          >
            <el-table
              slot="list"
              stripe
              ref="table"
              :highlight-current-row="true"
              :data="tableData"
              border
              v-loading="loading"
              :height="listSlotHeight"
              class="scroll-bar"
              tooltip-effect="light"
            >
              <!-- 序号 -->
              <el-table-column
                prop="webSortNumber"
                width="32"
              ></el-table-column>
              <!-- 病人姓名 -->
              <el-table-column
                prop="rybh"
                :label="'病人姓名'"
                width="80"
              ></el-table-column>
              <!-- 发票号码 -->
              <el-table-column prop="personname" :label="'发票号码'"></el-table-column>
              <!-- 收费日期 -->
              <el-table-column
                prop="genderName"
                :label="'收费日期'"
                width="70"
              ></el-table-column>
              <!-- 操作工号 -->
              <el-table-column
                prop="officeName"
                :label="'操作工号'"
              ></el-table-column>
              <!-- 总费用 -->
              <el-table-column
                prop="jobpostName"
                :label="'总费用'"
              ></el-table-column>
              <!-- 理赔金额 -->
              <el-table-column
                prop="jobpostName"
                :label="'理赔金额'"
              ></el-table-column>
              <!-- 本次冲账金额 -->
              <el-table-column
                prop="jobpostName"
                :label="'本次冲账金额'"
                width="100px"
              ></el-table-column>
              <!-- 本次坏账金额 -->
              <el-table-column
                prop="jobpostName"
                :label="'本次坏账金额'"
                width="100px"
              ></el-table-column>
              <!-- 已冲账金额 -->
              <el-table-column
                prop="jobpostName"
                :label="'已冲账金额'"
              ></el-table-column>
              <!-- 已坏账金额 -->
              <el-table-column
                prop="jobpostName"
                :label="'已坏账金额'"
              ></el-table-column>
              <!-- 汇率损益金额 -->
              <el-table-column
                prop="jobpostName"
                :label="'汇率损益金额'"
                width="100px"
              ></el-table-column>
              <!-- 超付金额 -->
              <el-table-column
                prop="jobpostName"
                :label="'超付金额'"
              ></el-table-column>
            </el-table>
          </pagenation-list>
        </el-tab-pane>
        <el-tab-pane label="冲账明细查询" name="third">
          <div class="row">
            <div class="label">
              <div class="searchTitle">时间</div>
              <el-date-picker
                type="daterange"
                v-model="date"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                class="date-wrapper"
              ></el-date-picker>
              <div class="searchTitle ml10">发票号码</div>
              <el-input
                :placeholder="'请输入发票号码'"
              ></el-input>
              <el-divider direction="vertical"></el-divider>
              <div class="btn">
                <el-button type="text" size="mini">
                  <i class="icon his-caozuo-Details blue"></i>
                  <span>查询</span>
                </el-button>
              </div>
            </div>
          </div>
          <pagenation-list
            ref="pageTable"
            v-model="tableData"
            data-url="/system-service/hrpersonnel/queryPage"
            :search-data="searchData"
            http-method="post"
            :list-height="listSlotHeight"
          >
            <el-table
              slot="list"
              stripe
              ref="table"
              :highlight-current-row="true"
              :data="tableData"
              border
              v-loading="loading"
              :height="listSlotHeight"
              class="scroll-bar"
              tooltip-effect="light"
            >
              <!-- 序号 -->
              <el-table-column
                prop="webSortNumber"
                width="32"
              ></el-table-column>
              <!-- 门诊/住院 -->
              <el-table-column
                prop="rybh"
                :label="'门诊/住院'"
                width="80"
              ></el-table-column>
              <!-- 发票号码 -->
              <el-table-column prop="personname" :label="'发票号码'"></el-table-column>
              <!-- 冲账金额 -->
              <el-table-column
                prop="genderName"
                :label="'冲账金额'"
                width="70"
              ></el-table-column>
              <!-- 坏账金额 -->
              <el-table-column
                prop="officeName"
                :label="'坏账金额'"
              ></el-table-column>
              <!-- 操作时间 -->
              <el-table-column
                prop="jobpostName"
                :label="'操作时间'"
              ></el-table-column>
              <!-- 操作工号 -->
              <el-table-column
                prop="jobpostName"
                :label="'操作工号'"
              ></el-table-column>
            </el-table>
          </pagenation-list>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

declare interface IObj {
  [key: string]: string
}

@Component({
  name: ''
})

export default class extends Vue {
	private obj: IObj = {
    name: '',
    value: '',
  }
  private activeName: any = 'first'
  private date: any = ''
  private formData: any = {}
  private tableData: any[] = [
    {lx: '西',mc: '(甲)复方氯化钠(济民)注射液', dw: '瓶', gg: '500ml', dj: '1.2300', sl: '1.00', je: '1.23', pc: 'qd', zkbl: '', zhje: ''},
    {lx: '西',mc: '(甲)复方氯化钠(济民)注射液', dw: '瓶', gg: '500ml', dj: '1.2300', sl: '1.00', je: '1.23', pc: 'qd', zkbl: '', zhje: ''},
  ] // 表格数据
  private tableData2: any[] = []
	private searchData: any = {
    pydm: ''
  } // 搜索参数
	private listSlotHeight: number = 0
  private loading: boolean = false



	// 获取列表
  private getLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.getList()
  }



  // 条件查询
  searchLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }

  // 打开新增弹窗
	private handleAdd(){
    // this.curRow = {}
    var a: any = this.$refs['add-patient']
    a.addDialog()
  }

  // 打开修改弹窗
  private handleEdit(){
    var a: any = this.$refs['add-patient']
		a.editDialog(123)
  }


  //初始化的周期函数
	created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 144
  }
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.el-date-editor ::v-deep{
  width: 240px;
  height: 28px;
  padding: 0 10px;
  border: none;
  background: $lightGray;
  .el-input__icon {
    display: none;
  }
  .el-range-input{
    background: none;
  }
  .el-range-separator{
    width: auto;
  }
}
.row{
  .label{
    .el-input{
      width: auto;
    }
  }
}
</style>
