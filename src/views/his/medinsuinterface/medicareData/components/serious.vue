<template>
  <div>
    <div class="query-search">
      <el-input
        v-model="searchData.dataName"
        :placeholder="$t('medicareData.search')"
        @keyup.enter.native="searchList"
      >
        <i slot="prefix" class="el-input__icon icon his-search"></i>
      </el-input>
    </div>
    <pagenation-list
      ref="pageTable"
      data-url="/ybapi-service/shybdata02/unifiedQueryPage"
      v-model="list"
      :searchData="searchData"
      http-method="post"
    >
      <el-table
        :data="list"
        slot="list"
        border
        highlight-row
        stripe
        highlight-current-row
        @row-click="handleRow"
        :height="listSlotHeight"
        class="scroll-bar"
      >
        <el-table-column prop="dataCode" :label="$t('medicareData.dataCode')" width="100px"></el-table-column>
        <el-table-column prop="dataName" :label="$t('medicareData.dataName')"></el-table-column>
        <el-table-column :label="$t('common.action')" align="center" width="60px">
          <template slot-scope="scope">
            <el-tooltip
              :content="scope.row.stopFlag == '0' ? $t('common.disable') : $t('common.enable')"
              effect="light"
            >
              <el-popconfirm
                hideIcon
                :confirmButtonText="scope.row.stopFlag == '0' ? $t('common.disable') : $t('common.enable')"
                :cancelButtonText="$t('common.cancel')"
                :title="scope.row.stopFlag == '0' ? $t('sysManage.confirmDisabled')
                    : $t('sysManage.confirmAutomated')"
                @confirm="stopOrStarOK(scope.row)"
              >
                <el-button slot="reference" :class="scope.row.stopFlag == '0' ? 'red' : 'green'">
                  <i
                    :class="scope.row.stopFlag == '0' ? 'icon his-disabled' : 'icon his-automated'"
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
import { enableStatus } from '@/api/his/medinsuinterface/medicareData.ts'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'serious',
  filters: {},
})
export default class extends Vue {
  private listSlotHeight: number = 0
  @Prop({ required: true }) private value!: any
  set list(val: any) {
    this.$emit('input', val)
  }
  get list() {
    return this.value
  }

  private searchData: any = {
    ybdataId: 3,
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 164 - 60
  }
  mounted() {
    // this.getList();
  }
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }
  private searchList() {
    const pageTable: any = this.$refs.pageTable
    if (this.searchData.dataName == '') {
      pageTable.getList()
    } else {
      pageTable.searchList()
    }
  }
  private handleRow(val: any) {
    this.$emit('setRow', val)
  }

  private stopOrStarOK(data: any) {
    if (data.stopFlag == '0') {
      enableStatus({ ybdatavalueId: data.ybdatavalueId }).then((res: any) => {
        console.log(res)
        this.getList()
        this.$notify({
          title: this.$t('common.disabled').toString(),
          message: '',
          type: 'success',
        })
      })
    } else {
      enableStatus({ ybdatavalueId: data.ybdatavalueId }).then((res: any) => {
        console.log(res)
        this.getList()
        this.$notify({
          title: this.$t('common.enabled').toString(),
          message: '',
          type: 'success',
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
