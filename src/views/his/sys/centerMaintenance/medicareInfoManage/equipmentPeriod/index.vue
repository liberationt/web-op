<!--
 * @Date:
 * @LastEditors:
 * @LastEditTime: 
 * @description: 设备时段维护
 -->
 <template>
  <div class="content">
    <el-row :gutter="10" class="ht">
      <el-col :span="17">
        <div class="his-small his-module">
          <el-row class="ht" :gutter="10">
            <div class="row" style="padding: 0 6px 8px">
              <h1 class="label title">设备时段维护</h1>
              <div class="operate">
                <el-button
                  size="mini"
                  type="primary"
                  class="blue-gra"
                  icon="icon his-add"
                  @click="handleAdd"
                >{{$t('common.add')}}</el-button>
              </div>
            </div>
            <el-col :span="12">
              <el-table
                :data="tableData1"
                border
                stripe
                :highlight-current-row="true"
                empty-text=" "
                class="no-underline"
                :height="listSlotHeight - 72"
                @row-click="getRowData1"
              >
                <el-table-column type="index" width="32" align="center"></el-table-column>
                <el-table-column prop="value" :label="$t('时段值')"></el-table-column>
                <el-table-column prop="sfxs" :label="$t('是否显示')">
                  <template slot-scope="scope">
                    <span
                      :class="[scope.row.sfxs == '1' ? 'blues' : 'reds']"
                    >{{ scope.row.sfxs == '1' ? '是' : '否' }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="12">
              <el-table
                :data="tableData2"
                border
                stripe
                :highlight-current-row="true"
                empty-text=" "
                class="no-underline"
                :height="listSlotHeight - 72"
                @row-click="getRowData2"
              >
                <el-table-column type="index" :index="indexSort" width="32" align="center"></el-table-column>
                <el-table-column prop="value" :label="$t('时段值')"></el-table-column>
                <el-table-column prop="sfxs" :label="$t('是否显示')">
                  <template slot-scope="scope">
                    <span
                      :class="[scope.row.sfxs == '1' ? 'blues' : 'reds']"
                    >{{ scope.row.sfxs == '1' ? '是' : '否' }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="7" class="ht">
        <div class="his-module his-small">
          <div class="row" style="padding-bottom: 8px">
            <div class="lable">
              <h1
                class="title"
                style="color:#222B31"
              >{{ isUpd ? $t('common.add') : $t('common.edit')}}</h1>
            </div>
            <div class="operate">
              <el-button
                type="primary"
                class="green-gra"
                icon="icon his-save"
                size="mini"
                @click="handleSave"
              >{{$t('common.save')}}</el-button>
            </div>
          </div>
          <el-form
            label-width="60px"
            style="margin:16px auto"
            :model="ruleForm"
            ref="ruleForm"
            :rules="rule"
          >
            <el-form-item label="时段值" prop="value">
              <el-input v-model="ruleForm.value" placeholder="请输入..."></el-input>
            </el-form-item>
            <el-form-item label="是否显示">
              <el-checkbox v-model="ruleForm.isShow" true-label="1" false-label="0"></el-checkbox>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { flatten } from 'lodash'
import { saveInspection, searchInspection } from '@/api/his/sys/centerMaintenance/medicareInfoManage/equipmentPeriod.ts'

@Component({
  name: 'departRegist',
  filters: {},
  components: {}
})
export default class extends Vue {
  private listSlotHeight: number = 0
  private isUpd: boolean = true //新增或编辑
  private ruleForm: any = {
    value: '',
    isShow: ''
  } //表单数据
  private tableData: Array<any> = [] // 设备时段全部数据
  private tableData1: Array<any> = [] //左侧
  private tableData2: Array<any> = [] //右侧
  private sssdId: number | null = null // 所属时段id
  private rule: any = {
    value: [{ required: true, message: '时段值不能为空', trigger: 'blur' }]
  }

  // 获取设备时段全部数据
  private getList() {
    const params: any = {
      pageNum: '1',
      pageSize: '100'
    }
    searchInspection(params).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        console.log(res)
        this.tableData = res.data.list
        this.averageData(this.tableData)
      }
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

  // 左表格行点击
  private getRowData1(row: any) {
    console.log(row);
    
    this.isUpd = false
    this.sssdId = row.sssdid
    this.ruleForm.value = row.value
    this.ruleForm.isShow = row.sfxs
    if(this.ruleForm.isShow == '1'){
      this.ruleForm.isShow = true
    } else {
      this.ruleForm.isShow = false
    }
  }

  // 右表格行点击
  private getRowData2(row: any) {
    this.isUpd = false
    this.sssdId = row.sssdid
    this.ruleForm.value = row.value
    this.ruleForm.isShow = row.sfxs
    if(this.ruleForm.isShow == '1'){
      this.ruleForm.isShow = true
    } else {
      this.ruleForm.isShow = false
    }
  }

  //点击新增
  private handleAdd() {
    this.isUpd = true
    this.$nextTick(() => {
      const el: any = this.$refs.ruleForm
      el.resetFields()
    })
    this.ruleForm.isShow = null
  }

  // 保存
  private handleSave() {
    ;(this.$refs.ruleForm as Form).validate((valid: boolean) => {
      let value
      
      if (valid) {
        
        const params: any = {
          sfxs: '',
          sssdid: this.sssdId,
          value: this.ruleForm.value
        }
        if(this.ruleForm.isShow == 'true' || this.ruleForm.isShow == '1') {
          params.sfxs = '1'
        } else {
          params.sfxs = '0'
        }
        
        saveInspection(params).then((res: any) => {
          if (res.errorCode === 'SUCCESS') {
            if (this.isUpd) {
              this.$notify({
                title: this.$t('common.addSuc').toString(),
                message: '',
                type: 'success'
              })
            } else {
              this.$notify({
                title: this.$t('common.editSuc').toString(),
                message: '',
                type: 'success'
              })
            }
            this.getList()
            this.handleAdd()
            this.sssdId = null
          }
        })
      }
    })
  }

  // 计算排列顺序
  private indexSort(index: any) {
    return index + this.tableData1.length + 1
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    this.getList()
  }
  activated() {}
}
</script>