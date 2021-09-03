<!--
 * @Date:
 * @LastEditors:
 * @LastEditTime:
 * @description: 检查检验设备维护
 -->

<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="18">
        <div class="his-module his-small">
          <pagenation-list
            ref="pageTable"
            v-model="tableDatas"
            data-url="/op-service/opsbbh/queryPage"
            http-method="post"
            :list-height="listSlotHeight"
            :searchData="searchData"
          >
            <div slot="header" class="row">
              <div class="label">
                <div class="btn">
                  <el-button type="text" size="mini" @click="generateSource">
                    <i class="icon his-create"></i>
                    <span>生成号源(未来30天)</span>
                  </el-button>
                  <el-divider direction="vertical" class="mr4"></el-divider>
                  <el-button type="text" size="mini" @click="generateAllSource">
                    <i class="icon his-create"></i>
                    <span>全部生成(未来30天)</span>
                  </el-button>
                </div>
              </div>
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
            <el-table
              :data="tableDatas"
              border
              stripe
              :highlight-current-row="true"
              slot="list"
              :height="listSlotHeight"
              class="scroll-bar"
              @row-click="getRowData"
              tooltip-effect="light"
            >
              <!-- 序号 -->
              <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
              <!-- 设备编号 -->
              <el-table-column prop="sbbh" :label="$t('设备编号')" width="80"></el-table-column>
              <!--设备名称 -->
              <el-table-column prop="sbmc" :label="$t('设备名称')"></el-table-column>
              <!-- 接口类型 -->
              <el-table-column :label="$t('接口类型')" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    {{$store.state.webSqlDict.INTERFACE_TYPE_DICT.find(item => item.dv == scope.row.jklx) &&
                    $store.state.webSqlDict.INTERFACE_TYPE_DICT.find(item => item.dv == scope.row.jklx).dn}}
                  </div>
                </template>
              </el-table-column>
              <!-- 上午开始时间 -->
              <el-table-column prop="swkssj" :label="$t('上午开始时间')" width="97"></el-table-column>
              <!-- 上午结束时间 -->
              <el-table-column prop="swjssj" :label="$t('上午结束时间')" width="97"></el-table-column>
              <!-- 上午间隔分钟 -->
              <el-table-column prop="swjgfz" :label="$t('上午间隔分钟')" width="97"></el-table-column>
              <!-- 下午开始时间 -->
              <el-table-column prop="xwkssj" :label="$t('下午开始时间')" width="97"></el-table-column>
              <!-- 下午结束时间 -->
              <el-table-column prop="xwjssj" :label="$t('下午结束时间')" width="97"></el-table-column>
              <!-- 下午间隔分钟 -->
              <el-table-column prop="xwjgfz" :label="$t('下午间隔分钟')" width="97"></el-table-column>
              <!-- 预约总数 -->
              <el-table-column prop="yyzs" :label="$t('预约总数')" width="70"></el-table-column>
              <!-- 设备地址 -->
              <el-table-column prop="sbdz" :label="$t('设备地址')" width="115" show-overflow-tooltip></el-table-column>
              <!-- 门诊使用 -->
              <el-table-column prop="mzsy" :label="$t('门诊使用')">
                <template slot-scope="scope">
                  <span
                    :class="[scope.row.mzsy == '1' ? 'blues' : 'reds']"
                  >{{scope.row.mzsy == '1' ? '是' : '否'}}</span>
                </template>
              </el-table-column>
              <!-- 住院使用 -->
              <el-table-column prop="zysy" :label="$t('住院使用')">
                <template slot-scope="scope">
                  <span
                    :class="[scope.row.zysy == '1' ? 'blues' : 'reds']"
                  >{{scope.row.zysy == '1' ? '是' : '否'}}</span>
                </template>
              </el-table-column>
              <!-- 体检使用 -->
              <el-table-column prop="tjsy" :label="$t('体检使用')">
                <template slot-scope="scope">
                  <span
                    :class="[scope.row.tjsy == '1' ? 'blues' : 'reds']"
                  >{{scope.row.tjsy == '1' ? '是' : '否'}}</span>
                </template>
              </el-table-column>
              <!-- 操作 -->
              <el-table-column :label="$t('操作')" width="52" align="center" fixed="right">
                <template slot-scope="scope">
                  <!-- 删除 -->
                  <el-tooltip :content="$t('common.delete')" effect="light">
                    <el-popconfirm
                      hideIcon
                      :confirmButtonText="$t('common.confirm')"
                      :cancelButtonText="$t('common.cancel')"
                      :title="$t('common.delTip')"
                      @confirm="handleDelete(scope.row)"
                    >
                      <el-button slot="reference" class="red">
                        <i class="icon his-del his-cancellationicon" />
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col class="ht" :span="6">
        <div class="his-module his-small">
          <div slot="header" class="row">
            <div class="label">
              <!-- 新增/编辑 -->
              <h1 class="title">{{ isCreateNewJob ? $t('common.add') : $t('common.edit') }}</h1>
            </div>
            <div class="operate">
              <el-button
                size="mini"
                type="primary"
                class="green-gra"
                icon="icon his-save"
                @click="handleSave"
              >{{ $t('common.save') }}</el-button>
            </div>
          </div>
          <el-form label-width="93px" :model="ruleForm" ref="ruleForm" :rules="rule">
            <el-form-item label="设备编号" prop="sbbh">
              <el-input v-model="ruleForm.sbbh" placeholder="请输入设备编号"></el-input>
            </el-form-item>
            <el-form-item label="设备名称" prop="sbmc">
              <el-input v-model="ruleForm.sbmc" placeholder="请输入设备名称"></el-input>
            </el-form-item>
            <el-form-item label="接口类型" prop="jklx">
              <search-select
                v-model="ruleForm.jklx"
                placeholder="请输入接口类型"
                table-name="SYS_FLAG_DATA"
                kid="JK000001"
                :backfillValue="ruleForm.jklx"
              ></search-select>
            </el-form-item>
            <el-form-item label="上午开始时间" prop="swkssj">
              <el-input v-model="ruleForm.swkssj" placeholder="请输入上午开始时间"></el-input>
            </el-form-item>
            <el-form-item label="上午结束时间" prop="swjssj">
              <el-input v-model="ruleForm.swjssj" placeholder="请输入上午结束时间"></el-input>
            </el-form-item>
            <el-form-item label="上午间隔分钟" prop="swjgfz">
              <el-input v-model="ruleForm.swjgfz" placeholder="请输入上午间隔分钟"></el-input>
            </el-form-item>
            <el-form-item label="下午开始时间" prop="xwkssj">
              <el-input v-model="ruleForm.xwkssj" placeholder="请输入下午开始时间"></el-input>
            </el-form-item>
            <el-form-item label="下午结束时间" prop="xwjssj">
              <el-input v-model="ruleForm.xwjssj" placeholder="请输入下午结束时间"></el-input>
            </el-form-item>
            <el-form-item label="下午间隔分钟" prop="xwjgfz">
              <el-input v-model="ruleForm.xwjgfz" placeholder="请输入下午间隔分钟"></el-input>
            </el-form-item>
            <el-form-item label="预约总数" prop="yyzs">
              <el-input v-model="ruleForm.yyzs" placeholder="请输入预约总数" type="number"></el-input>
            </el-form-item>
            <el-form-item label="设备地址" prop="sbdz">
              <el-input v-model="ruleForm.sbdz" placeholder="请输入设备地址"></el-input>
            </el-form-item>
            <el-row type="flex" justify="space-around">
              <el-form-item label-width="65px" label="门诊使用">
                <el-checkbox v-model="ruleForm.mzsy" true-label="1" false-label="0"></el-checkbox>
              </el-form-item>
              <el-form-item label-width="65px" label="住院使用">
                <el-checkbox v-model="ruleForm.zysy" true-label="1" false-label="0"></el-checkbox>
              </el-form-item>
              <el-form-item label-width="65px" label="体检使用">
                <el-checkbox v-model="ruleForm.tjsy" true-label="1" false-label="0"></el-checkbox>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { id2Name, rightScroll } from '@/utils'
import { Form } from 'element-ui'
import { saveInspection, delInspection, generateSource, inquirySheet } from '@/api/his/sys/centerMaintenance/medicareInfoManage/equipment.ts'
//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'equipment'
})
export default class extends Vue {

  @Watch('tableData')
  private onValueChange(vslue: string) {
    rightScroll()
  }
  //声明变量，方法
  private tableDatas: Array<any> = [] //表格数据
  private tipTitle: string = ''
  private isCreateNewJob: boolean = true //新增还是保存
  private listSlotHeight: number = 0 //高度
  private bhId: number | null = null // 编号ID
  private searchData: any = {
    bz: '',
    csmc: '',
    sslb: ''
  } //搜索参数
  private checked: boolean = false //选中/未选中
  private ruleForm: any = {
    sbbh: '',
    sbmc: '',
    jklx: '',
    swkssj: '',
    swjssj: '',
    swjgfz: '',
    xwkssj: '',
    xwjssj: '',
    xwjgfz: '',
    yyzs: null,
    sbdz: '',
    mzsy: '',
    zysy: '',
    tjsy: '',
    bhid: '',
  } //右侧表单
  private rule: object = {
    sbbh: [{ required: true, message: '设备编号不能为空', trigger: 'blur' }],
    sbmc: [{ required: true, message: '设备名称不能为空', trigger: 'blur' }],
    jklx: [{ required: true, message: '接口类型不能为空', trigger: 'blur' }],
    swkssj: [{ required: true, message: '上午开始时间不能为空', trigger: 'blur' }],
    swjssj: [{ required: true, message: '上午结束时间不能为空', trigger: 'blur' }],
    swjgfz: [{ required: true, message: '上午间隔分钟不能为空', trigger: 'blur' }],
    xwkssj: [{ required: true, message: '下午开始时间不能为空', trigger: 'blur' }],
    xwjssj: [{ required: true, message: '下午结束时间不能为空', trigger: 'blur' }],
    xwjgfz: [{ required: true, message: '下午间隔分钟不能为空', trigger: 'blur' }]
  }
  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 条件查询
  private searchLists() {
    const pageTable: any = this.$refs.pageTable
    pageTable.searchList()
  }

  //新增
  private handleAdd() {
    this.isCreateNewJob = true
    this.$nextTick(() => {
      const el: any = this.$refs.ruleForm
      el.resetFields()
    })
    this.ruleForm.mzsy = null
    this.ruleForm.zysy = null
    this.ruleForm.tjsy = null
    this.ruleForm.bhid = null
  }
  // 保存
  private handleSave() {
    ;(this.$refs.ruleForm as Form).validate((valid: boolean) => {
      if (valid) {
        if (this.ruleForm.mzsy == true) {
          this.ruleForm.mzsy = '1'
        } else {
          this.ruleForm.mzsy = '0'
        }
        if (this.ruleForm.zysy == true) {
          this.ruleForm.zysy = '1'
        } else {
          this.ruleForm.zysy = '0'
        }
        if (this.ruleForm.tjsy == true) {
          this.ruleForm.tjsy = '1'
        } else {
          this.ruleForm.tjsy = '0'
        }
        saveInspection(this.ruleForm).then((res: any) => {
          if (res.errorCode === 'SUCCESS') {
            console.log(res)
            if (this.isCreateNewJob) {
              this.$notify({
                title: this.$t('common.addSuc').toString(),
                message: '',
                type: 'success'
              })
              this.handleAdd()
              this.searchLists()
            } else {
              this.$notify({
                title: this.$t('common.editSuc').toString(),
                message: '',
                type: 'success'
              })
              this.handleAdd()
              this.searchLists()
            }
          }

        })
      }
    })
  }

  // 获取行数据
  private getRowData(row: any) {
    this.isCreateNewJob = false
    console.log(row)
    this.bhId = row.bhid
    inquirySheet({ bhId: row.bhid }).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        this.ruleForm = res.data
        if (this.ruleForm.mzsy == '1') {
          this.ruleForm.mzsy = true
        } else {
          this.ruleForm.mzsy = false
        }
        if (this.ruleForm.zysy == '1') {
          this.ruleForm.zysy = true
        } else {
          this.ruleForm.zysy = false
        }
        if (this.ruleForm.tjsy == '1') {
          this.ruleForm.tjsy = true
        } else {
          this.ruleForm.tjsy = false
        }
      }
    })
  }

  // 删除
  private handleDelete(row: any) {
    delInspection({ bhId: row.bhid }).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        this.getList()
        this.handleAdd()
        this.$notify({
          title: this.$t('common.delSuc').toString(),
          message: '',
          type: 'success'
        })
      }
    })
  }

  // 生成号源（未来30天）
  private generateSource() {
    if (this.bhId == null) {
      this.$message({
        message: '请先选择设备',
        type: 'warning'
      })
    } else {
      generateSource({ bhId: this.bhId }).then((res: any) => {
        if (res.errorCode === 'SUCCESS') {
          this.$notify({
            title: '已生成',
            message: '',
            type: 'success'
          })
        }
      })
    }
  }

  // 全部生成 （未来30天）
  private generateAllSource() {
    generateSource({}).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        this.$notify({
          title: '已生成',
          message: '',
          type: 'success'
        })
      }
    })
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 105
  }
  mounted() {
    this.getList()
    console.log(this.$store.state.webSqlDict.INTERFACE_TYPE_DICT)
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
.content .his-module .el-form {
  margin: 0px auto;
}
// 右侧表单样式
.content .his-module .el-form {
  margin: 16px auto;
}
</style>
