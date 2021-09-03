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
        slot="list"
        row-key="ybdatavalueId"
        :load="handleLoadData"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :data="tablelist"
        :height="listSlotHeight"
        class="scroll-bar"
        border
        lazy
        stripe
        highlight-current-row
        @row-click="handleRow"
      >
        <el-table-column prop="dataCode" :label="$t('medicareData.dataNum')"></el-table-column>
        <el-table-column
          prop="dataName"
          :label="$t('medicareData.departmentName')"
          min-width="150px"
        ></el-table-column>
        <el-table-column :label="$t('common.action')" align="center" width="90px">
          <template slot-scope="scope">
            <el-tooltip :content="$t('common.addSub')" effect="light">
              <el-button class="green" @click.stop="handleAddNext(scope.row)">
                <i class="icon his-append"></i>
              </el-button>
            </el-tooltip>

            <el-tooltip
              :content="
                scope.row.stopFlag == '0'
                  ? $t('common.disable')
                  : $t('common.enable')
              "
              class="ml10"
              effect="light"
            >
              <el-popconfirm
                class="ml10"
                hideIcon
                :confirmButtonText="
                  scope.row.stopFlag == '0'
                    ? $t('common.disable')
                    : $t('common.enable')
                "
                :cancelButtonText="$t('common.cancel')"
                :title="
                  scope.row.stopFlag == '0'
                    ? $t('sysManage.confirmDisabled')
                    : $t('sysManage.confirmAutomated')
                "
                @confirm="stopOrStarOK(scope.row)"
              >
                <el-button slot="reference" :class="scope.row.stopFlag == '0' ? 'red' : 'green'">
                  <i
                    :class="
                      scope.row.stopFlag == '0'
                        ? 'icon his-disabled'
                        : 'icon his-automated'
                    "
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
  enableStatus,
  queryPage,
} from '@/api/his/medinsuinterface/medicareData.ts'
import { watch } from 'fs'
import { log } from 'util'
@Component({
  name: 'areaCode',
  filters: {},
})
export default class extends Vue {
  @Prop({ required: true }) private value!: any
  set list(val: any) {
    this.$emit('input', val)
  }
  get list() {
    return this.value
  }

  @Watch('list', { deep: true })
  handleWatch() {
    this.tablelist = []
    this.list.map((element: any) => {
      if (element.childNum > 0) {
        this.tablelist.push({
          dataCode: element.dataCode,
          dataName: element.dataName,
          ybdatavalueId: element.ybdatavalueId + '',
          parentDatavalueId: element.parentDatavalueId,
          ybdataId: element.ybdataId,
          stopFlag: element.stopFlag,
          hasChildren: true,
        })
      } else {
        this.tablelist.push({
          dataCode: element.dataCode,
          dataName: element.dataName,
          ybdatavalueId: element.ybdatavalueId + '',
          parentDatavalueId: element.parentDatavalueId,
          ybdataId: element.ybdataId,
          stopFlag: element.stopFlag,
        })
      }
    })
  }

  private tree: any = {
    ybdataId: '',
  }
  private treeNode: any = null
  private resolve: any = null
  private nodeList: any = []
  private total = 0
  private tablelist: any = []
  private listSlotHeight: number = 0
  private searchData = {
    ybdataId: 2,
    dataName: '',
    parentDatavalueId: 0,
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 164 - 60
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
  }

  private handleRow(val: any) {
    this.$emit('setRow', val)
  }

  private stopOrStarOK(data: any) {
    if (data.stopFlag == '0') {
      enableStatus({ ybdatavalueId: data.ybdatavalueId }).then((res: any) => {
        this.getList()
        this.$notify({
          title: this.$t('common.disabled').toString(),
          message: '',
          type: 'success',
        })
      })
    } else {
      enableStatus({ ybdatavalueId: data.ybdatavalueId }).then((res: any) => {
        this.getList()
        this.$notify({
          title: this.$t('common.enabled').toString(),
          message: '',
          type: 'success',
        })
      })
    }
  }

  private async handleLoadData(tree: any, treeNode: any, resolve: any) {
    this.tree = tree
    this.treeNode = treeNode
    this.resolve = resolve
    this.nodeList = []
    this.nodeList.push({
      tree: this.tree,
      treeNode: this.treeNode,
      resolve: this.resolve,
    })
    let list: any[] = []
    if (this.tree.ybdatavalueId) {
      const { data } = await queryPage({
        parentDatavalueId: this.tree.ybdatavalueId,
        ybdataId: 2,
      })
      data.list.forEach((element: any, index: number) => {
        if (element.childNum > 0) {
          this.$set(element, 'hasChildren', true)
        }
      })
      resolve(data.list)
    }
  }
  private handleAddNext(val: any) {
    this.$emit('setNextForm', val)
  }
}
</script>

<style lang="less" scoped></style>
