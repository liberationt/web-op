<template>
    <div class="his-module his-small">
        <el-form :model="reqForm"
                 ref="reqForm"
                 :rules="rules"
                 label-width="90px"
                 class="complexForm">
            <el-row type="flex"
                    justify="start"
                    :gutter="10"
                    v-if="!patientFile && activeOrPassive == 'active'">
                <el-col :span="12"
                        v-if="inpaOrOutpa == 'inpa'">
                    <el-form-item :label="'住院号'"
                                  prop="zyhm"
                                  style="width: 100%;"
                                  label-width="100px">
                        <el-input v-model="reqForm.zyhm"
                                  :disabled="reqOrExamine != 'req'"
                                  placeholder=" "></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12"
                        v-else>
                    <el-form-item :label="'门诊号/卡号'"
                                  prop="mzhm"
                                  style="width: 100%;"
                                  label-width="100px">
                        <el-input v-model="reqForm.mzhm"
                                  :disabled="reqOrExamine != 'req'"
                                  placeholder=" "></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="'姓名'"
                                  prop="brxm"
                                  style="width: 100%;">
                        <el-input disabled
                                  v-model="reqForm.brxm"
                                  placeholder=" "></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex"
                    justify="start"
                    :gutter="10"
                    v-if="!patientFile && activeOrPassive == 'active'">
                <el-col :span="6">
                    <el-form-item :label="'性别'"
                                  prop="brxb"
                                  style="width: 100%;"
                                  label-width="130px">
                        <el-input disabled
                                  v-model="reqForm.brxb"
                                  placeholder=" "></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="'出生日期'"
                                  prop="csrq"
                                  style="width: 100%;">
                        <el-input disabled
                                  v-model="reqForm.csrq"
                                  placeholder=" "></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="'年龄'"
                                  prop="rynl"
                                  style="width: 100%;">
                        <el-input disabled
                                  v-model="reqForm.rynl"
                                  placeholder=" "></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item :label="'科室'"
                                  prop="brks"
                                  style="width: 100%;">
                        <el-input disabled
                                  v-model="reqForm.brks"
                                  placeholder=" "></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex"
                    justify="start"
                    :gutter="10">
                <el-col :span="24">
                    <el-form-item :label="'诊断'"
                                  prop="mqzd"
                                  style="width: 100%;">
                        <el-input disabled
                                  v-model="reqForm.mqzd"
                                  placeholder=" "></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex"
                    justify="start"
                    :gutter="10">
                <el-col :span="8">
                    <el-form-item :label="'用药目的'"
                                  prop="yymd"
                                  style="width: 100%;"
                                  label-width="120px">
                        <el-radio v-model="reqForm.yymd"
                                  :disabled="reqOrExamine != 'req'"
                                  :label="1">治疗</el-radio>
                        <el-radio v-model="reqForm.yymd"
                                  :disabled="reqOrExamine != 'req'"
                                  :label="2">预防</el-radio>
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item :label="'过敏史'"
                                  prop="gms"
                                  style="width: 100%;">
                        <el-input disabled
                                  v-model="reqForm.gms"
                                  placeholder=" "></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex"
                    justify="start"
                    :gutter="10">
                <el-col :span="24">
                    <el-form-item :label="'症状'"
                                  prop="zz"
                                  style="width: 100%;">
                        <el-input type="textarea"
                                  :disabled="reqOrExamine != 'req'"
                                  :rows="3"
                                  v-model="reqForm.zz"
                                  placeholder=" "></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex"
                    justify="start"
                    :gutter="10">
                <el-col :span="24">
                    <el-form-item :label="'体征'"
                                  prop="tz"
                                  style="width: 100%;">
                        <el-input type="textarea"
                                  :disabled="reqOrExamine != 'req'"
                                  :rows="3"
                                  v-model="reqForm.tz"
                                  placeholder=" "></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex"
                    justify="start"
                    :gutter="10">
                <el-col :span="12">
                    <el-form-item :label="'感染情况'"
                                  prop="tw"
                                  style="width: 100%; display: flex;"
                                  label-width="100px">
                        <el-input v-model="reqForm.tw"
                                  :disabled="reqOrExamine != 'req'"
                                  type="number"><template slot="prepend">T:</template><template slot="append">℃</template></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="'WBC'"
                                  prop="wbc"
                                  style="width: 100%;">
                        <el-input v-model="reqForm.wbc"
                                  :disabled="reqOrExamine != 'req'"
                                  type="number"><template slot="append">×10^9/L</template></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex"
                    justify="start"
                    :gutter="10">
                <el-col :span="8">
                    <el-form-item :label="'病原学检查'"
                                  prop="byxjc"
                                  style="width: 100%;"
                                  label-width="120px">
                        <el-radio v-model="reqForm.byxjc"
                                  :disabled="reqOrExamine != 'req'"
                                  label="1">未做</el-radio>
                        <el-radio v-model="reqForm.byxjc"
                                  :disabled="reqOrExamine != 'req'"
                                  label="2">已做</el-radio>
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item :label="'结果'"
                                  prop="jg"
                                  style="width: 100%;">
                        <el-input :disabled="reqOrExamine != 'req'"
                                  v-model="reqForm.jg"
                                  placeholder=" "></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex"
                    justify="start"
                    :gutter="10">
                <el-col :span="8">
                    <el-form-item :label="'要使用的特殊级抗菌药物'"
                                  prop="lhsy"
                                  style="width: 100%;"
                                  label-width="300px">
                        <el-checkbox v-model="reqForm.lhsy"
                                     :disabled="reqOrExamine != 'req'">联合使用</el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item :label="' '"
                                  style="width: 100%; text-align: right;">
                        <el-button v-if="activeOrPassive == 'active' && reqOrExamine == 'req'"
                                   type="primary"
                                   class="blue-gra"
                                   size="mini"
                                   icon="icon his-add"
                                   @click="handleAdd">{{ $t('common.add') }}</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- 抗菌药表格表格 -->
            <el-table stripe
                      highlight-current-row
                      border
                      :data="reqForm.ypList"
                      height="135"
                      class="scroll-bar"
                      style="margin-bottom: 10px;">
                <el-table-column type="index"
                                 width="32"></el-table-column>
                <el-table-column prop="ypmc"
                                 label="抗菌药物名称"
                                 min-width="180"></el-table-column>
                <el-table-column prop="ypgg"
                                 label="规格"
                                 width="100"></el-table-column>
                <el-table-column prop="ycsl"
                                 label="当日用量"
                                 width="80">
                    <!-- <template slot-scope="scope">
						{{ scope.row.dj ? scope.row.dj.toFixed(4) : 0 }}
					</template> -->
                </el-table-column>
                <el-table-column prop="yfdw"
                                 label="药品单位"
                                 width="80"></el-table-column>
                <el-table-column prop="ypyf_text"
                                 label="途径"
                                 width="80"></el-table-column>
                <el-table-column prop="sysj"
                                 label="使用时间"
                                 width="80">
                    <template slot-scope="scope">
                        <inputBoxOther :disabled="reqOrExamine != 'req'"
                                       type="number"
                                       min="0"
                                       :max="scope.row.kjywzdts"
                                       style="height: 32px;"
                                       v-model="scope.row.sysj"
                                       :ref="`${scope.$index}-3`"
                                       :value="scope.row.sysj" />
                        <!-- @keyup.enter.native="editChange(scope, 3)"
						@input='(val)=> {numberCount(scope.row)}'
						@blur='(val)=> {numberCount(scope.row)}' -->
                    </template>
                </el-table-column>
                <el-table-column prop="action"
                                 label="操作"
                                 width="60"
                                 align="center"
                                 v-if="reqOrExamine == 'req'">
                    <template slot-scope="scope">
                        <!-- 删除 -->
                        <el-tooltip content="删除"
                                    effect="light">
                            <el-button @click="handleDelDrug(scope)">
                                <i class="red icon his-btn-del-copy" />
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-row type="flex"
                    justify="start"
                    :gutter="10">
                <el-col :span="24">
                    <el-form-item :label="'药物品种选择理由'"
                                  prop="syly"
                                  style="width: 100%;">
                        <div style="display: flex;">
                            <el-input style="margin-right: 10px;"
                                      type="textarea"
                                      :rows="3"
                                      :disabled="reqOrExamine != 'req'"
                                      v-model="reqForm.syly"
                                      placeholder=" "></el-input>
                            <el-button type="text"
                                       @click="sylyVisible = true"
                                       :disabled="reqOrExamine != 'req'">引入</el-button>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex"
                    justify="start"
                    :gutter="10">
                <el-col :span="8">
                    <el-form-item :label="'科主任'"
                                  prop="kzrdm"
                                  style="width: 100%;"
                                  label-width="110px">
                        <search-select :disabled="reqOrExamine != 'req'"
                                       class="w100"
                                       table-name="SYS_DICT_CONFIG"
                                       kid="17"
                                       v-model.number="reqForm.kzrdm"
                                       placeholder="请选择科主任"
                                       :backfillValue="reqForm.kzrdm" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="'申请时间'"
                                  prop="sqsj"
                                  style="width: 100%;">
                        <el-input v-model="reqForm.sqsj"
                                  disabled
                                  placeholder=" "></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="'申请医生'"
                                  prop="sqysdm"
                                  style="width: 100%;">
                        <search-select disabled
                                       class="w100"
                                       table-name="SYS_DICT_CONFIG"
                                       kid="17"
                                       v-model.number="reqForm.sqysdm"
                                       placeholder="请选择医生"
                                       :backfillValue="reqForm.sqysdm" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex"
                    justify="start"
                    :gutter="10">
                <el-col :span="24">
                    <el-form-item :label="'邀请会诊专家'"
                                  prop="yqhzzj"
                                  style="width: 100%;">
                        <el-select :disabled="reqOrExamine != 'req'"
                                   v-model="reqForm.yqhzzj"
                                   placeholder="请选择"
                                   popper-class="optionsContent"
                                   multiple
                                   @change="changeYQHZZJ">
                            <el-option v-for="item in userList"
                                       :key="item.jlxh"
                                       :label="item.personname"
                                       :value="item.ysdm"
                                       :disabled="item.disabled">
                                <span style="float: left;">{{ item.personname }}</span>
                                <span style="float: left;">{{ item.officename }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex"
                    justify="start"
                    :gutter="10"
                    v-if="checkOrquery == 'check'">
                <el-col :span="8">
                    <el-form-item :label="'会诊结果'"
                                  prop="hzjg"
                                  style="width: 100%;"
                                  label-width="120px">
                        <el-radio v-if="checkOrquery == 'check'"
                                  v-model="reqForm.hzjg"
                                  label="1">同意</el-radio>
                        <el-radio v-if="checkOrquery == 'check'"
                                  v-model="reqForm.hzjg"
                                  label="0">不同意</el-radio>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex"
                    justify="start"
                    :gutter="10"
                    v-if="reqForm.hzyjList && reqForm.hzyjList.length > 0">
                <el-col :span="24">
                    <el-form-item :label="'历史会诊意见'"
                                  label-width="100px">
                        <div v-for="(item, index) in reqForm.hzyjList"
                             :key="index">
                            {{ item.hzysmc + '-' + item.yqhzksmc + ':' + item.hzyj }}
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex"
                    prop="hzyj"
                    justify="start"
                    :gutter="10"
                    v-if="checkOrquery == 'check'">
                <el-col :span="24">
                    <el-form-item :label="'专家会诊意见'"
                                  prop="hzyj"
                                  style="width: 100%;">
                        <el-input type="textarea"
                                  :rows="3"
                                  v-model="reqForm.hzyj"
                                  placeholder=" "></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-dialog append-to-body
                   class="scroll-bar narrow-dialog"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   title="抗菌药物使用理由引用"
                   :visible.sync="sylyVisible"
                   top="10vh"
                   width="1000px">
            <useReason ref="userReason"
                       :key="sylyKey"
                       @resetSyly="resetSyly" />
            <span slot="footer"
                  class="dialog-footer">
                <el-button @click="sylyVisible = false">{{ $t('common.cancel') }}</el-button>
                <el-button type="primary"
                           @click="handleSylyConfirm">{{ $t('common.confirm') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
  import { deepCopy, isEmpty } from '@/utils'
  import dayjs from 'dayjs'
  import { getNow } from '@/api/his/basic'
  import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
  import { queryAmqctsjkjywhzzj } from '@/api/his/im/antibioticsManage/useApproval'
  import { queryReasonPage } from '@/api/his/im/antibioticsManage/reasonSet'
  import useReason from './useReason.vue'
  @Component({
    name: 'reqFormTS',
    components: {
      useReason,
    },
  })
  export default class extends Vue {
    @Prop({ required: false }) private patientFile!: any
    @Prop({ required: false }) private formData!: any
    @Prop({ required: false, default: 'req' }) private reqOrExamine!: string // 申请 或 审核
    @Prop({ required: false, default: 'inpa' }) private inpaOrOutpa!: string // 住院 或 门诊
    @Prop({ required: false, default: 'active' }) private activeOrPassive!: string // 主动 或 被动
    @Prop({ required: false, default: 'query' }) private checkOrquery!: string // 审核 或 查看

    private reqForm: any = {}
    private rules: any = {
      syly: [{ required: true, message: '请输入药物品种选择理由！', trigger: 'blur' }],
      hzyj: [{ required: true, message: '请输入会诊意见！', trigger: 'blur' }],
      yqhzzj: [{ required: true, message: '请邀请会诊专家！', trigger: 'blur' }],
    }
    private userList: any[] = []
    private reasonList: any[] = []
    private sylyVisible: boolean = false
    private sylyKey: number = 0
    private ysList: Array<any> = [] // 医生
    private yljlList: Array<any> = [] // 护理记录类型
    get userInfo() {
      return JSON.parse(localStorage.userInfo)
    }
    created() {}
    mounted() {
      this.ysList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
      this.yljlList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DEP_CODE_DICT : this.$store.state.webSqlDict.DEP_CODE_DICT
      this.init()
    }
    async init() {
      // console.log('特殊药会诊内容展示！', this.formData)
      if (!isEmpty(this.formData)) {
        this.reqForm = deepCopy(this.formData)
      }
      const nowDoc = this.userInfo.userId
      const nowDate = dayjs(((await getNow()) as any).data).format('YYYY-MM-DD HH:mm:ss')
      this.reqForm.hzjg = String(this.reqForm.hzjg)
      if (this.reqOrExamine == 'req') {
        this.$set(this.reqForm, 'sqysdm', nowDoc)
        this.$set(this.reqForm, 'sqsj', nowDate)
      } else {
        this.$set(this.reqForm, 'shrdm', nowDoc)
        this.$set(this.reqForm, 'shsj', nowDate)
      }
      if (!isEmpty(this.reqForm.hzList)) {
        let yqhzzjArr = <any>[]
        this.reqForm.hzList.forEach((item: any, index: any) => {
          yqhzzjArr.push(Number(item.yqhzysdm))
        })
        this.reqForm.yqhzzj = yqhzzjArr
      }
      if (!isEmpty(this.reqForm.hzList)) {
        let hzyjList = <any>[]
        this.reqForm.hzList.forEach((item: any, index: any) => {
          if (item.hzyj) {
            item.hzysmc = this.ysList.find((obj: any) => obj.dv == item.yqhzysdm).dn
            item.yqhzksmc = this.yljlList.find((obj: any) => obj.dv == item.yqhzksdm).dn
            hzyjList.push(item)
          }
        })
        this.reqForm.hzyjList = hzyjList
      }

      if (!isEmpty(this.reqForm.ypList)) {
        this.reqForm.ypList.forEach((item: any, index: number) => {
          if (this.reqForm.ypList[index].yzmc) {
            this.$set(this.reqForm.ypList[index], 'ypmc', item.yzmc)
            this.$set(this.reqForm.ypList[index], 'ypgg', item.yfgg)
          }
        })
      }
      //获取会诊医生列表
      queryAmqctsjkjywhzzj({ pageSize: 99 }).then((res: any) => {
        if (res.errorCode == 'SUCCESS') {
          this.userList = res.data.list
        }
      })

      //获取使用理由列表
      queryReasonPage({ pageSize: 99, lx: 1 }).then((res: any) => {
        if (res.errorCode == 'SUCCESS') {
          this.reasonList = res.data.list
        }
      })
      console.log('特殊药会诊表单数据展示！', this.reqForm)
    }
    handleAdd() {
      let nowArr = this.reqForm.ypList ? this.reqForm.ypList : []
      nowArr.push({
        kjywmc: '洛美沙星',
        gg: '10ml/支',
        ycjl: '10ml',
        tj: 'Gtt',
        sysj: '48h',
      })
      this.$set(this.reqForm, 'ypList', nowArr)
    }
    handleDelDrug(scope: any) {
      this.reqForm.ypList.splice(scope.$index, 1)
    }
    private handleConfirm() {
      if (isEmpty(this.reqForm.ypList)) {
        this.$message({ message: '抗菌药列表不能为空！', type: 'warning' })
        return
      }
      let isValid: boolean = false
      ;(this.$refs.reqForm as any).validate((valid: boolean) => {
        isValid = valid
      })
      this.reqForm.ypList.map((req: any) => {
        if (!req.sysj || Number(req.sysj) > this.reqForm.kjywzdts) {
          this.$message({ message: '抗菌药使用时间不能为空且不能超过最大使用天数！', type: 'warning' })
          isValid = false
        }
      })
      let nowParam = deepCopy(this.reqForm)
      nowParam.lhsy = this.reqForm.lhsy ? 1 : 0
      return isValid ? nowParam : isValid
    }

    private changeYQHZZJ(value: any) {
      this.reqForm.hzList = []
      value.forEach((userId: any) => {
        this.userList.forEach((userItem: any) => {
          if (userId == userItem.ysdm) {
            let newItem = {
              yqhzysdm: userItem.ysdm,
              yqhzksdm: userItem.id,
            }
            if (this.reqForm.hzList.length < 0) {
              this.reqForm.hzList.push(newItem)
            } else if (JSON.stringify(this.reqForm.hzList).indexOf(JSON.stringify(newItem)) == -1) {
              this.reqForm.hzList.push(newItem) // 进行动态的操作
            } else {
            }
          }
        })
      })
      // console.log('输出的值', this.reqForm.hzList)
    }

    private handleSylyConfirm() {
      ;(this.$refs.userReason as any).confirmSelectSyly()
    }
    private resetSyly(valueArr: any) {
      let newStr = this.reqForm.syly
      valueArr.forEach((item: any) => {
        if (isEmpty(newStr)) {
          newStr = item.syly + ';'
        } else {
          newStr = newStr + item.syly + ';'
        }
      })
      this.reqForm.syly = newStr
      this.sylyVisible = false
    }
  }
</script>
<style lang="scss">
</style>
<style lang='scss' scoped>
  .content .his-small ::v-deep .el-form .el-form-item .el-form-item__label {
    line-height: 15px;
  }
  .optionsContent {
    .el-select-dropdown__item span {
      width: 100px;
      text-align: center;
    }
  }
  .tableHeader {
    background: rgb(64, 158, 255);
    color: #fff;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    font-family: HiraginoSansGB-W3;
    font-weight: 600;
    padding: 0 20px;
  }
  .tableHeader span {
    width: 100px;
    text-align: center;
  }
</style>
