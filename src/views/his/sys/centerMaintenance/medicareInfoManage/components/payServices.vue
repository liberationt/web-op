<template>
  <el-dialog
    :visible.sync="isVisible"
    title="收费项目明细-修改"
    width="780px"
    :append-to-body="true"
    class="narrow-dialog"
    :close-on-click-modal="false"
  >
    <div class="content his-sys-content">
      <div class="his-module his-small" style="padding: 8px 10px">
        <el-form
          :model="editFormData"
          ref="infoFormRef"
          label-width="87px"
          class="retrieval"
          :rules="ruleForm"
        >
          <div class="row" style="margin-top: 5px">
            <span class="separatedRegion line">
              <i class="icon his-detail"></i>基本信息
            </span>
          </div>
          <el-row type="flex">
            <el-form-item label="费用名称" prop="fymc">
              <el-input v-model="editFormData.fymc" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="fydw" disabled>
              <el-input v-model="editFormData.fydw" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="标准价格" prop="bzjg">
              <el-input v-model="editFormData.bzjg" placeholder="请输入"></el-input>
            </el-form-item>
          </el-row>
          <el-row type="flex">
            <el-form-item label="价格标志" prop="jgbz">
              <search-select 
                v-model="editFormData.jgbz" 
                placeholder="请选择"
                table-name="SYS_FLAG_DATA"
                kid="FD000038"
                style="width: 100%"
                :backfillValue="editFormData.jgbz"
              >
              </search-select>
            </el-form-item>
            <!-- <el-form-item style="visibility: hidden">
              <el-input v-model="value" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item style="visibility: hidden">
              <el-input v-model="value" placeholder="请输入"></el-input>
            </el-form-item>-->
          </el-row>
          <div class="row">
            <span class="separatedRegion line">
              <i class="icon his-detail"></i>代码属性
            </span>
          </div>
          <el-row type="flex">
            <el-form-item label="拼音码" prop="pydm" disabled>
              <el-input v-model="editFormData.pydm" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="五笔代码" prop="wbdm" disabled>
              <el-input v-model="editFormData.wbdm" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="角形代码" prop="jxdm" disabled>
              <el-input v-model="editFormData.jxdm" placeholder="请输入" disabled></el-input>
            </el-form-item>
          </el-row>
          <el-row type="flex">
            <el-form-item label="笔画代码" prop="bhdm" disabled>
              <el-input v-model="editFormData.bhdm" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="其他代码" prop="qtdm" disabled>
              <el-input v-model="editFormData.qtdm" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item style="visibility: hidden"></el-form-item>
          </el-row>
          <div class="row">
            <span class="separatedRegion line">
              <i class="icon his-detail"></i>其他属性
            </span>
          </div>
          <el-row type="flex">
            <el-form-item label="项目类型" prop="xmlx" disabled>
              <search-select 
                v-model="editFormData.xmlx" 
                placeholder="请选择"
                table-name="SYS_FLAG_DATA"
                kid="XM000001"
                style="width: 100%"
                :backfillValue="editFormData.xmlx"
                disabled
              >
              </search-select>
            </el-form-item>
            <el-form-item label="项目编码" prop="xmbm" disabled>
              <el-input v-model="editFormData.xmbm" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="黄码编码" prop="hmbm" disabled>
              <el-input v-model="editFormData.hmbm" placeholder="请输入" disabled></el-input>
            </el-form-item>
          </el-row>
          <div class="row">
            <span class="separatedRegion line">
              <i class="icon his-detail"></i>机构属性
            </span>
          </div>
          <el-row type="flex">
            <el-form-item label="单价" prop="fydj">
              <el-input v-model="editFormData.fydj" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="费用科室" prop="fyks">
              <search-select v-model="editFormData.fyks" table-name="SYS_DICT_CONFIG" kid="41" :backfillValue="editFormData.fyks" placeholder="请输入"></search-select>
            </el-form-item>
            <el-form-item label="自动插入" prop="zdcr">
              <search-select 
                v-model="editFormData.zdcr" 
                placeholder="请选择"
                table-name="SYS_FLAG_DATA"
                kid="FD000005"
                style="width: 100%"
                :backfillValue="editFormData.zdcr"
              >
              </search-select>
            </el-form-item>
          </el-row>
          <el-row type="flex">
            <el-form-item label="限制使用" prop="xzsy">
              <search-select 
                v-model="editFormData.xzsy" 
                placeholder="请选择"
                table-name="SYS_FLAG_DATA"
                kid="FD000005"
                style="width: 100%"
                :backfillValue="editFormData.xzsy"
              >
              </search-select>
            </el-form-item>
            <el-form-item label="限制周期" prop="xzts" disabled>
              <el-input v-model="editFormData.xzts" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="限制次数" prop="xzcs" disabled>
              <el-input v-model="editFormData.xzcs" placeholder="请输入" disabled></el-input>
            </el-form-item>
          </el-row>
          <el-row type="flex">
            <el-form-item label="商保价格" prop="sbjg">
              <el-input v-model="editFormData.sbjg" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="CPT CODE" prop="cptcode">
              <el-input v-model="editFormData.cptcode" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="英文名称" prop="ywmc">
              <el-input v-model="editFormData.ywmc" placeholder="请输入"></el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleEditSave">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { log } from 'util'
import { editDetailProject } from '@/api/his/sys/centerMaintenance/medicareInfoManage/InstitutionalProjectsFees.ts'
import { rightScroll, id2Name } from '@/utils/index.ts'
// 命名文件名称，过滤器什么的都在这里写
@Component({
  name: 'payServices',
  components: {}
})
export default class extends Vue {
  @Prop({ required: true }) private editDetail!: any
  private isVisible: boolean = false // 明细弹框默认隐藏
  private isdisabled: boolean = true
  private editFormData: any = {
    fymc: '',
    fydj: null,
    bzjg: null,
    fyks: '',
    zdcr: '',
    xzsy: '',
    sbjg: '',
    cptcode: '',
    ywmc: ''

  } // 修改表单参数
  private ruleForm: any = {
    fydj: [{ required: true, message: ' ', trigger: 'blur' }]
  }

  private open() {
    console.log(12323);
    
    this.isVisible = true
    this.editFormData = JSON.parse(JSON.stringify(this.editDetail))
    console.log(this.editFormData) 
  }
  created() {}

  private handleEditSave() {
    const form: any = this.$refs.infoFormRef
    form.validate((valid: boolean) => {
      if (valid) {
        editDetailProject(this.editFormData).then((res: any) => {
          if (res.errorCode === 'SUCCESS') {
            this.$notify({
              title: '修改成功！',
              message: '',
              type: 'success'
            })
            this.isVisible = false
            this.$emit('getNewData')
            this.$emit('switchState')
          }
        })
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.content {
  background: #fff;
  height: auto;
  border-radius: 8px;
}

.his-module.his-small {
  padding: 0 0 8px !important;
}
.row .label .el-input {
  width: 190px;
}

.el-dialog__wrapper.narrow-dialog .el-dialog__body .row {
  padding-bottom: 0;
}

// 右侧表单样式分布
.content .his-small .retrieval .el-row .el-form-item {
  width: calc(33.333% - 8px);
}
.content .his-small .retrieval {
  margin: 0;
  width: 100%;
}

::v-deep .his-sys-limit.el-table::before {
  height: 0;
}
.row .line {
  height: 29px;
  line-height: 29px;
  padding-bottom: 9px;
}

// 右侧状态框悬浮
::v-deep .el-table__fixed-right {
  height: 100% !important;
}
</style>