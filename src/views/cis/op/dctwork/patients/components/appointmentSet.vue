<!--
 * @Date: 2020-05-25 14:07:21
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-15 10:43:18
 * @description: 预约管理
-->
<template>
  <div class="module">
    <div>
      <div class="his-module his-small">
        <el-form :model="searchData" label-width="60px" class="form3 clearfix">
          <el-form-item :label="'预约时间'">
            <el-date-picker
              v-model="searchData.value"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              class="date-wrapper"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item :label="'值班类别'">
            <el-select v-model="searchData.value1" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="'预约科室'">
            <el-select v-model="searchData.value2u" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="text" class="action">
              <i class="icon his-rsearch blue" />查询
            </el-button>
            <el-button size="mini" type="text" class="action">
              <i class="icon his-reading-card blue" />医保读卡
            </el-button>
            <el-button size="mini" type="text" class="action">
              <i class="icon his-btn-del red" />清空
            </el-button>
          </el-form-item>
        </el-form>

        <el-form
          :model="searchData"
          label-width="60px"
          class="form5 clearfix"
          style="border-bottom: none;"
        >
          <el-form-item :label="'患者卡号'">
            <el-input v-model="form"></el-input>
          </el-form-item>

          <el-form-item :label="'患者性质'">
            <el-select v-model="searchData.value1" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="'患者姓名'">
            <el-input v-model="form"></el-input>
          </el-form-item>
          <el-form-item :label="'患者性别'">
            <el-select v-model="searchData.value1" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="'年龄'">
            <el-input v-model="form"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 下方两个列表 -->
      <div class="two-list">
        <div class="left-list">
          <div class="his-module layout-top his-small">
            <div slot="header">
              <div class="row">
                <div class="label">
                  <div class="searchTitle">搜索码</div>
                  <el-input
                    v-model="input"
                    placeholder="请输入内容"
                    @keyup.enter.native="searchList"
                  ></el-input>
                </div>
              </div>
            </div>
            <el-table
              :data="tableDataLeft"
              border
              :fit="true"
              stripe
              :highlight-current-row="true"
              slot="list"
              @row-click="handleRowClick"
              class="scroll-bar"
              :height="listSlotHeight"
            >
              <el-table-column
                prop="webSortNumber"
                width="32"
              ></el-table-column>
              <el-table-column
                prop="inputStoreOrderNum"
                :label="'科室名称'"
                :show-overflow-tooltip="true"
                width="80"
              ></el-table-column>
              <el-table-column
                :label="'挂号费'"
                width="80"

                align="center"
              />
              <el-table-column
                :label="'诊疗费'"
                width="80"
                align="center"
              />
              <el-table-column
                :label="'挂号费'"
                width="80"
                align="center"
              />
              <el-table-column
                :label="'预约限额'"
                width="80"
                align="center"
              />
              <el-table-column
                :label="'预约'"
                width="80"

                align="center"
              />
              <el-table-column
                prop="enterDate"
                :label="'拼音代码'"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="organizationName"
                :label="'五笔代码'"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="remark"
                :label="'数字代码'"
              ></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="right-list">
          <div class="his-module layout-top his-small">
            <div slot="header">
              <div class="row">
                <div class="label">
                  <div class="searchTitle">拼音代码</div>
                  <el-input
                    v-model="input"
                    placeholder="请输入内容"
                    @keyup.enter.native="searchList"
                  ></el-input>
                </div>
              </div>
            </div>
            <el-table
              :data="tableDataRight"
              border
              :fit="true"
              stripe
              :highlight-current-row="true"
              slot="list"
              @row-click="handleRowClick"
              class="scroll-bar"
              :height="listSlotHeight"
            >
              <el-table-column
                prop="webSortNumber"
                width="32"
              ></el-table-column>
              <el-table-column
                prop="inputStoreOrderNum"
                :label="'医生姓名'"
                :show-overflow-tooltip="true"
                width="80"
              ></el-table-column>
              <el-table-column
                prop="enterDate"
                :label="'专家'"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="organizationName"
                :label="'专家费'"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="remark"
                :label="'挂号限额'"
              ></el-table-column>
              <el-table-column
                :label="'已挂人数'"
                width="80"

                align="center"
              />
              <el-table-column
                :label="'预约人数'"
                width="80"

                align="center"
              />
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'ReportList',
})
export default class extends Vue {
  private tableDataLeft: any[] = []
  private tableDataRight: any[] = []

  private formData: any = {}
  private form: any = ''
  private input: string = ''
  private searchDataUC: any = {
    groupName: '',
  }
  private comHeight: number = 0

  private searchData: any = {
    value: '',
    value1: '',
  }
  private options: any = [
    {
      value: '1',
      label: '上午',
    },
    {
      value: '2',
      label: '下午',
    },
  ]
  private listSlotHeight: number = 0

  created() {
    this.comHeight = Vue.prototype.PageHeight - 76 - 16 - 44 - 10 - 31
    this.listSlotHeight = Vue.prototype.PageHeight - 300
  }
  private pickerOptions: any = Date.now()
  private handleRowClick() {}
  // 切换心电图报告
}
</script>

<style lang="scss" scoped>
.content .his-module {
  height: none !important;
  .label {
    display: flex;
    flex-flow: row nowrap;
  }
}
.search {
  display: flex;
  flex-flow: row nowrap;
  .patient,
  .block {
    display: flex;
    margin-left: 10px;
  }
  ::v-deep .el-input__inner {
    height: 28px;
  }
  .btn {
    background: none !important;
    padding-top: 10px;
  }
}
.searchTitle {
  width: 100px;
}

.form3 {
  margin: 0 !important;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
  .el-form-item {
    float: left;
    width: calc((100% - 20px * 4) / 4);
    margin-right: 20px;
    margin-bottom: 10px !important;

    &:nth-child(4n) {
      margin-right: 0;
    }
  }
}
.form5 {
  margin: 0 !important;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
  padding-top: 10px !important;
  .el-form-item {
    float: left;
    width: calc((100% - 20px * 4) / 5);
    margin-right: 10px;
    margin-bottom: 10px !important;

    &:nth-child(5n) {
      margin-right: 0;
    }
  }
}
.content .his-small ::v-deep .el-form .el-form-item .el-form-item__content{
  display: flex;
  margin-left: 0px !important;
}
</style>
