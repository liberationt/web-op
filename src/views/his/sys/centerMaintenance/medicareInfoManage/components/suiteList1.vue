<!--
 * @Date: 2020-05-27 19:02:26
 * @LastEditors: dl
 * @LastEditTime: 2020-06-22 18:58:57
 * @description:
-->
<template>
  <div class="his-module his-small" style="height: auto">
    <pagenation-list
      ref="pageTable"
      v-model="tableDatas"
      data-url="/op-service/opzt01/queryPage"
      http-method="post"
      :list-height="listSlotHeight -160"
      :searchData="searchData"
      optTrigger="true"
      @retFunc="setIsAddState"
      :pageProps="{ layout: 'total, prev, pager, next'}"
    >
      <!-- 根据isShow 是否 显示不同的header -->
      <div slot="header" class="row" v-if="isShow">
        <div class="label">
          <span class="title">{{$t('组套维护')}}</span>
          <el-divider direction="vertical" ></el-divider>
          <div class="searchTitle">搜索</div>
          <el-input
            v-model="searchData.pydm"
            :placeholder="$t('hospitalDataDict.formValidPyCode')"
            @change="searchList"
          >
            <i slot="prefix" class="el-input__icon icon his-search"></i>
          </el-input>
          <el-divider direction="vertical" class="mr4"></el-divider>
          <div class="btn">
            <el-button size="mini" type="text" :disabled="!isAdd" @click="handleAdd">
              <i class="icon his-btn-add green"></i>
              <span>{{$t('common.add')}}</span>
            </el-button>
          </div>
        </div>
      </div>
      <div slot="header" class="row" v-if="!isShow">
        <div class="label">
          <el-radio-group v-model="searchData.ztlb" @change="pushTowList">
            <el-radio :label="1">本人</el-radio>
            <el-radio :label="2">科室</el-radio>
            <el-radio :label="3">全院</el-radio>
          </el-radio-group>
        </div>
      </div>
      <el-table
        :data="tableDatas"
        border
        stripe
        :highlight-current-row="true"
        slot="list"
        fit
        @row-click="handleRowClick"
        :height="listSlotHeight"
        class="scroll-bar"
        tooltip-effect="light"
      >
        <!-- 序号 -->
        <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
        <!-- 组套名称 -->
        <el-table-column prop="groupCode" :label="$t('examineSuite.suiteName')" show-overflow-tooltip min-width="115">
          <template slot-scope="scope">
            <span v-if="!scope.row.webRowStatus">{{ scope.row.ztmc }}</span>
            <el-input
              size="mini"
              v-if="scope.row.webRowStatus === true"
              v-model="scope.row.ztmc"
              focus=" "
              @click.stop=""
            ></el-input>
          </template>
        </el-table-column>
        <!-- 组套类别 -->
        <el-table-column prop="ztlb" :label="$t('examineSuite.suiteType')" min-width="70">
          <template slot-scope="scope">
            <span>{{ scope.row.ztlb | filterSuiteType }}</span>
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column prop="sfqy" :label="$t('common.status')" min-width="60">
          <template slot-scope="scope">
            <span :class="scope.row.sfqy == 0 ? 'reds' : 'blues'">{{ scope.row.sfqy | filterStatus }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('table.actions')" width="67" align="center" v-if="isShow">
          <template slot-scope="scope">
            <!-- 修改,保存按钮 -->
            <el-tooltip :content="$t('common.edit')" effect="light" v-if="!scope.row.webRowStatus">
              <el-button class="blue" @click.stop="handleEdit(scope.row)">
                <i class="icon his-edit" />
              </el-button>
            </el-tooltip>
            <el-tooltip :content="$t('common.save')" effect="light" v-if="scope.row.webRowStatus">
              <el-button class="blue" @click.stop="handleSave(scope.row)">
                <i class="icon his-right_caozuo_baochun" />
              </el-button>
            </el-tooltip>

            <!-- 删除 -->
            <el-tooltip :content="$t('common.delete')" effect="light" v-if="scope.row.webRowStatus && !scope.row.ztbh">
              <el-popconfirm
              class="ml8"
                hideIcon
                :cancelButtonText="$t('common.cancel')"
                :confirmButtonText="$t('common.confirm')"
                :title="$t('sysManage.confirmDeleted')"
                @confirm="handleDelete(scope.row)"
              >
                <el-button slot="reference" class="red"  @click.stop="">
                  <i class="icon his-del his-cancellationicon"></i>
                </el-button>
              </el-popconfirm>
            </el-tooltip>



            <!-- 启动停用 -->
            <el-tooltip
            v-if="!scope.row.webRowStatus"
              :content="
                scope.row.sfqy == 0 ? $t('common.disable') : $t('common.enable')
              "
              effect="light"
            >
              <el-popconfirm
                class="ml8"
                hideIcon
                :confirmButtonText="
                  scope.row.sfqy == 0
                    ? $t('common.enable')
                    : $t('common.disable')
                "
                :cancelButtonText="$t('common.cancel')"
                :title="
                  scope.row.sfqy == 0
                    ? $t('sysManage.confirmAutomated')
                    : $t('sysManage.confirmDisabled')
                "
                @confirm="handleEnable(scope.row)"
              >
                <el-button
                  slot="reference"
                  :class="[scope.row.sfqy == 0 ? 'red' : 'green']"
                >
                  <i
                    class="icon"
                    :class="[
                      scope.row.sfqy == 0 ? 'his-disabled' : 'his-automated',
                    ]"
                  ></i>
                </el-button>
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </pagenation-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  ISuiteTypeList,
  enable,
  disEnable,
  add,
  edit,
} from '@/api/cis/op/dctwork/examineSuite'

const NSuiteTypeList: ISuiteTypeList = {
  ksdm: 0,
  sslb: null,
  ztlb: null,
  ztmc: '',
  webRowStatus: false,
  ztbh: undefined,
  sfqy: 0,
}

@Component({
  name: 'SuiteList1',
})
export default class extends Vue {
  //声明变量，方法
  @Prop({ required: true }) private isShow!: boolean
  // @Prop({ required: true }) private ztlb!: number
  @Prop({ required: true }) private value!: any
  @Prop({ required: true }) private searchData!: any
  @Prop({ required: true }) private isSelect!: boolean
  @Prop({ required: true }) private KSDM!: string | number
  get tableDatas() {
    return this.value
  }

  set tableDatas(val: ISuiteTypeList[]) {
    this.$emit('input', val)
  }

  private listSlotHeight: number = 0
  private isAdd: boolean = true
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 155
  }
  mounted() {
    this.getList()
  }

  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }
  private searchList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
    if(this.isAdd == false){
      this.isAdd = true;
    }
  }
  private handleAdd() {
    this.isAdd = false
    let param: ISuiteTypeList = Object.assign({}, NSuiteTypeList)
    param.ztlb = this.searchData.ztlb
    param.sslb = this.searchData.sslb
    param.webRowStatus = true
    this.tableDatas.splice(0, 0, param)
    this.$emit('get', null)
  }

  private handleEdit(value: ISuiteTypeList) {
    if(value.sfqy != null && value.sfqy == 1){
      this.$notify({
        type: 'warning',
        message: '请先停用再编辑',
        title: '',
      })
      return;
    }
    var list = this.tableDatas.filter((item) => item.webRowStatus)
    if (list.length == 0) {
      value.webRowStatus = !value.webRowStatus
    } else {
      this.$notify({
        type: 'warning',
        message: '请先保存已修改的数据',
        title: '',
      })
      return;
    }
  }
  private handleSave(value: ISuiteTypeList) {
    value.ksdm = this.KSDM
    value.ztlb = this.searchData.ztlb
    value.sslb = this.searchData.sslb
    value.webRowStatus = false

    if (value.ztbh) {
      edit(value).then((res) => {
        this.$notify({
          title: '修改成功',
          message: '',
          type: 'success',
        })
      })
    } else {
      add(value).then((res) => {
        this.$notify({
          title: '新增成功',
          message: '',
          type: 'success',
        })
      })
    }
    this.$emit('refresh', value)
    this.isAdd = true;
    // this.searchList();
  }
  private handleEnable(value: ISuiteTypeList) {
    if (value.sfqy) {
      disEnable({ ztbh: value.ztbh }).then(() => {
        this.$notify.success({
          title: '已停用',
          message: '',
        })
        value.sfqy = 0
      })
    } else {
      enable({ ztbh: value.ztbh }).then(() => {
        this.$notify.success({
          title: '已启用',
          message: '',
        })
        value.sfqy = 1
      })
    }
  }

  private handleDelete(val:any) {
    this.getList()
  }
  // 写点注释  基操，勿6
  private handleRowClick(value: ISuiteTypeList) {
    console.log(value);

    //在新增状态下不可以查询其他子项
    if(this.isAdd == false){
      return;
    }
    //选择可以操作右侧按钮
    // this.isSelect = true;
    this.$emit('get', value)
  }

  private setIsAddState(value: boolean) {
    this.isAdd = value;
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input {
  height: 28px !important;
  .el-input__prefix {
    margin: 0 8px 0 10px !important;
  }
}
.his-suite {
  height: initial;
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
::v-deep .el-radio__label {
  font-size: 13px;
  padding-left: 4px;
}
.el-radio {
  margin-right: 10px;
}
.mr4 {
  margin-right: 4px;
}


.his-small .row .label .el-input ::v-deep .el-input__inner{
  width: 120px;
}
</style>
