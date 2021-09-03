// 自负比例
<template>
  <div>
    <div class="his-module his-small" style="padding: 8px 10px">
      <el-row class="ht">
        <el-col :span="12">
          <el-table
            stripe
            :data="tableData1"
            border
            :height="listSlotHeight-92"
            class="scroll-bar input-table"
            tooltip-effect="light"
            @row-click="getRowData"
          >
            <el-table-column type="index" width="32" align="center"></el-table-column>
            <el-table-column label="收费项目" prop="sfmc"></el-table-column>
            <el-table-column label="自负比例%" prop="zfbl">
              <template slot-scope="scope">
                <el-input v-model="scope.row.zfbl" @change="handleSave"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <el-table
            stripe
            :data="tableData2"
            border
            :height="listSlotHeight-92"
            class="scroll-bar input-table"
            tooltip-effect="light"
            @row-click="getRowData"
          >
            <el-table-column type="index" width="32" :index="indexSort" align="center"></el-table-column>
            <el-table-column label="收费项目" prop="sfmc"></el-table-column>
            <el-table-column label="自负比例%" prop="zfbl">
              <template slot-scope="scope">
                <el-input v-model="scope.row.zfbl" @change="handleSave"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { selfProportion } from '@/api/his/sys/centerMaintenance/medicareInfoManage/patientNature.ts'
import { log } from 'util'
// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'proportion',
  components: {}
})
export default class extends Vue {
  @Prop({ required: true, default: null }) private zfblListData!: Array<any>
  private listSlotHeight: number = 0
  private isUpd: boolean = true // 新增与编辑切换
  private SFXM: any = '' // 收费项目
  private ZFBL: any = '' // 自负比例
  private BRXZ: any = '' // 病人性质
  private tableData: Array<any> = []
  private tableData1: Array<any> = [] // 左侧表数据
  private tableData2: Array<any> = [] // 右侧表数据

  // 点击树节点，获取数据
  private getList() {
    this.tableData = this.zfblListData
    this.averageData(this.tableData)
  }

  // 获取表格行数据
  private getRowData(row: any) {
    console.log(row)
    this.BRXZ = row.brxz
    this.SFXM = row.sfxm
    this.ZFBL = row.zfbl
  }

  // 保存修改
  private handleSave(val:any) {
    console.log(val)
    const params: any = {
      brxz: this.BRXZ,
      sfxm: this.SFXM,
      zfbl: val/100
    }
    this.$nextTick(() => {
      selfProportion(params).then((res: any) => {
        if (res.errorCode == 'SUCCESS') {
          this.$notify({
            title: '已保存',
            message: '',
            type: 'success'
          })
        }
      })
    })
  }

  // 均分数据
  private averageData(data: any) {
    if (data.length % 2 == 1) {
      this.tableData1 = []
      this.tableData2 = []
      for (let i = 0; i < (data.length + 1) / 2; i++) {
        this.tableData1.push(data[i])
      }
      for (let j = (data.length + 1) / 2; j < data.length; j++) {
        this.tableData2.push(data[j])
      }
    } else {
      this.tableData1 = []
      this.tableData2 = []
      for (let i = 0; i < data.length / 2; i++) {
        this.tableData1.push(data[i])
      }
      for (let j = data.length / 2; j < data.length; j++) {
        this.tableData2.push(data[j])
      }
    }
  }

  // 计算排列顺序
  private indexSort(index: any) {
    return index + this.tableData1.length + 1
  }

  created() {
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {}
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