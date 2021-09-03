// 药品限制
<template>
  <div>
    <div class="his-module his-small" style="padding: 8px 10px">
      <div class="row">
        <div class="label">
          <div style="font-size: 13px; margin-right: 8px;">搜索</div>
          <el-input
            v-model="searchData.pydm"
            placeholder="请输入拼音码"
            @keyup.native.enter="getList"
            clearable
            @clear="getList"
          >
            <i slot="prefix" class="el-input__icon icon his-search"></i>
          </el-input>
          <div class="btn">
            <el-button type="text" size="mini" @click="handleAddNews">
              <i class="icon his-btn-add green"></i>新增
            </el-button>
          </div>
        </div>
      </div>
      <pagenation-list
        ref="pageTable"
        data-url="/op-service/pubbrxz/queryYpxzList"
        http-method="post"
        v-model="costData"
        :searchData="searchData"
        :list-height="listSlotHeight-188"
      >
        <el-table
          slot="list"
          stripe
          :data="costData"
          :fit="true"
          border
          data-url
          highlight-current-row
          :height="listSlotHeight-168"
          class="scroll-bar input-table"
          tooltip-effect="light"
          :row-class-name="rowClassName"
          @row-click="getRowData"
        >
          <el-table-column type="index" width="32" align="center"></el-table-column>
          <el-table-column label="药品名称" prop="ypmc" show-overflow-tooltip>
            <template slot-scope="scope">
              <remoteSearchBox
                :required="true"
                v-model="scope.row.ypmc"
                :ref="`${scope.$index}-1`"
                style="height: 32px"
                :key="scope.row.ypxh"
                :searchData="{
                  yp:{
                    pydm: '',
                  }
                }"
                :resultTableHeader="{
                  yp:[
                    {
                      prop: 'ypmc',
                      label: '药品名称'
                    },
                    {
                      prop: 'ypgg',
                      label: '药品规格'
                    },
                    {
                      prop: 'ypdw',
                      label: '药品单位'
                    }
                  ]
                }"
                :searchField="{
                  yp: 'pydm'
                }"
                :showLabel="{
                  yp: 'fymc'
                }"
                :name="'ypxz'"
                @getData="data => getDrugTableData(data,scope.$index)"
              ></remoteSearchBox>
            </template>
          </el-table-column>
          <el-table-column label="药品规格" prop="ypgg"></el-table-column>
          <el-table-column label="药品单位" prop="ypdw" width="90" show-overflow-tooltip></el-table-column>
          <el-table-column label="自负比例%" prop="zfbl" width="90" show-overflow-tooltip>
            <template slot-scope="scope">
              <input-box
                :required="true"
                v-model="scope.row.zfbl"
                :ref="`${scope.$index}-2`"
                type="number"
                style="height: 32px"
                :key="scope.row.ypxh"
              ></input-box>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="68px" class-name="action-btns" align="center">
            <template slot-scope="scope">
              <el-tooltip :content="$t('common.delete')" effect="light" :enterable="false">
                <el-popconfirm
                  hideIcon
                  :confirmButtonText="$t('common.confirm')"
                  :cancelButtonText="$t('common.cancel')"
                  :title="$t('sysManage.confirmDeleted')"
                  @confirm="handleDelete(scope.row)"
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
                <el-button class="green" @click="handleSave(scope.row)">
                  <i class="icon his-right_caozuo_baochun" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </pagenation-list>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { addDrugLimit, getDrugLimit, editDrugLimit, delDrugLimit } from '@/api/his/sys/centerMaintenance/medicareInfoManage/patientNature.ts'
import { Form } from 'element-ui'
import { log } from 'util'
// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'drugLimit',
  components: {}
})
export default class extends Vue {
  @Prop({ required: false, default: null }) private BRXZ!: number | null
  private listSlotHeight: number = 0
  private editFlag: string = '' // 修改标志
  private delFlag: boolean = false // 删除标志
  private isAdd: boolean = true // 默认可以新增
  private isUpd: boolean = true // 新增与编辑切换
  private ZFBL: number = 0 // 自负比例
  private YPXH: number | null = null // 药品序号
  private selectRightRow: number | null = null
  private searchData: any = {
    pydm: '',
    brxz: ''
  }
  private costData: Array<any> = []

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {}
  // 获取药品限制数据
  private getList() {
    // 上个页面新增数据未保存切换页面后依旧可以新增
    this.isAdd = true
    this.delFlag = false
    this.searchData.brxz = this.BRXZ
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

  // 新增一行数据
  // private handleAddNews() {
  //   if (this.BRXZ) {
  //     console.log(this.BRXZ)
  //     if (this.isAdd) {
  //       if (this.costData.length > 0) {
  //         let oldRowData = this.costData[this.costData.length - 1]
  //         if (oldRowData.ypmc) {
  //           this.costData = [{ zfbl: 0 }, ...this.costData]
  //         }
  //       } else {
  //         this.costData = [{ zfbl: 0 }, ...this.costData]
  //       }
  //       this.$nextTick(() => {
  //         ;(this.$refs[`0-1`] as any).focus()
  //       })
  //       this.selectRightRow = this.costData.length - 1
  //     }
  //     this.isAdd = false
  //   }
  // }
  private handleAddNews() {
    if (this.BRXZ) {
      console.log(this.BRXZ)

      if (this.isAdd) {
        if (this.costData.length > 0) {
          let oldRowData = this.costData[this.costData.length - 1]
          if (oldRowData.ypmc) {
            this.costData = [{ zfbl: 0 }, ...this.costData]
          }
        } else {
          this.costData = [{ zfbl: 0 }, ...this.costData]
        }
        this.$nextTick(() => {
          // console.log('~~~~~', this.$refs[`${this.costData.length - 1}-${2}`])
          ;(this.$refs[`0-1`] as any).focus()
        })
        this.selectRightRow = this.costData.length - 1
      }
      this.isAdd = false
    }
  }

  // 获取表格行内容
  private getRowData(row: any) {
    this.delFlag = true
    console.log(row.brxz)
    this.YPXH = row.ypxh
    this.BRXZ = this.BRXZ
    this.editFlag = row.brxz
  }

  // 修改并获取自负比例
  // private getzfbl(val: any) {
  //   this.ZFBL = val
  //   if (this.editFlag) {
  //     const params: any = {
  //       brxz: this.BRXZ,
  //       ypxh: this.YPXH,
  //       zfbl: val / 100
  //     }
  //     editDrugLimit(params).then((res: any) => {
  //       if (res.errorCode === 'SUCCESS') {
  //         this.$notify({
  //           title: '已保存',
  //           message: '',
  //           type: 'success'
  //         })
  //       }
  //     })
  //   }
  // }

  // 删除一行数据
  private handleDelete(row: any) {
    if (this.isAdd) {
      if (this.delFlag) {
        const params: any = {
          brxz: row.brxz,
          ypxh: row.ypxh
        }
        delDrugLimit(params).then((res: any) => {
          if (res.errorCode) {
            this.$notify({
              title: '已删除',
              message: '',
              type: 'success'
            })
            this.getList()
          }
        })
        this.isAdd = true
        this.delFlag = false
      }
    } else {
      if (this.selectRightRow != null && this.selectRightRow >= 0) {
        this.costData.splice(0, 1)
        this.selectRightRow = this.costData.length - 1
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

  // 保存药品限制
  private handleSave(row: any) {
    if (row.brxz) {
      const params: any = {
        brxz: row.brxz,
        ypxh: row.ypxh,
        zfbl: row.zfbl / 100
      }
      editDrugLimit(params).then((res: any) => {
        if (res.errorCode === 'SUCCESS') {
          this.$notify({
            title: '已保存',
            message: '',
            type: 'success'
          })
        }
      })
    } else {
      const params: any = {
        brxz: this.BRXZ,
        ypxe: 0,
        ypxh: row.ypxh,
        zfbl: row.zfbl / 100
      }
      if (params.zfbl >= 0) {
        addDrugLimit(params).then((res: any) => {
          if (res.errorCode) {
            this.$notify({
              title: '已保存',
              message: '',
              type: 'success'
            })
            this.isAdd = true
            this.getList()
          }
        })
      }
    }
  }

  private getDrugTableData(val: any, index: number) {
    console.log(val)
    this.YPXH = val.ypxh
    this.$set(this.costData, index, { ...val, ypgg: val.ypgg, ypdw: val.ypdw, zfbl: val.zfbl })
  }

  // 输入enter切换焦点
  // private change(index: any, labelIndex: number) {
  //   console.log('改变forcs', index, labelIndex)
  //   if (this.$refs[`${index}-${labelIndex + 1}`]) {
  //     if ((this.$refs[`${index}-${labelIndex + 1}`] as any).disabled) {
  //       this.change(index, labelIndex + 1)
  //     } else {
  //       console.log('~~~~', (this.$refs[`${index}-${labelIndex + 1}`] as any).focus)
  //       ;(this.$refs[`${index}-${labelIndex}`] as any).blur()
  //       ;(this.$refs[`${index}-${labelIndex + 1}`] as any).focus()
  //     }
  //   } else {
  //     if (this.$refs[`${index + 1}-1`]) {
  //       if ((this.$refs[`${index + 1}-1`] as any).disabled) {
  //         this.change(index + 1, 1)
  //       } else {
  //         ;(this.$refs[`${index}-${labelIndex}`] as any).blur()
  //         ;(this.$refs[`${index + 1}-1`] as any).focus()
  //       }
  //     } else {
  //       this.costData = [...this.costData, {}]
  //       this.$nextTick(() => {
  //         if ((this.$refs[`${index + 1}-1`] as any).disabled) {
  //           this.change(index + 1, 1)
  //         } else {
  //           ;(this.$refs[`${index}-${labelIndex}`] as any).blur()
  //           ;(this.$refs[`${index + 1}-1`] as any).focus()
  //         }
  //       })
  //     }
  //   }
  // }

  private rowClassName({ row, rowIndex }: any) {
    //把每一行的索引放进row
    row.drugRowIndex = rowIndex
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/inputTable.scss';
.row .label .el-input {
  width: 190px;
}

.content .his-small {
  padding: 0 0 8px;
}

.his-sys-module {
  padding: 8px 10px !important;
}

.his-sys-right {
  margin-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}
</style>
