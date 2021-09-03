<template>
  <div>
  <!-- <div> -->
  <el-dialog :title="'个人基本信息'" :visible.sync="dialogVisible" v-if="dialogVisible" width="1000px" :close-on-click-modal="false" :destroy-on-close="true" @closed="closed">
    <el-tabs v-model="activeName" v-loading="loading" @tab-click="tabClick" class="tab-small underline">
      <el-tab-pane :label="'基本信息'" name="first">
        <!-- {{formData}} -->
        <el-form :model="formData" :rules="formRule" label-width="80px" :disabled="onlyRead" ref="formData" class="form-patient">
          <div class="upper clearfix">
            <!-- 头像 -->
            <div class="head-pic">
              <img src="@/assets/patient-manage-img/menzhen-morentouxiang.png" />
            </div>
            <div class="form-area1 clearfix">
              <!-- 卡号 -->
              <el-form-item :label="'卡号'" label-width="40px" :class="['item-card', onlyRead ? 'is-disabled' : '']" prop="jzkh" :error="jzkhError">
                <el-input v-model="formData.jzkh" :placeholder="'请输入卡号'" @change="jzkhEnter"></el-input>
                <el-button type="primary" @click="readCard('1')">读卡</el-button>
              </el-form-item>

              <!-- 门诊号码 -->
              <el-form-item :label="'档案号码'" prop="mzhm" disabled>
                <el-input v-model="formData.mzhm" :disabled="true"></el-input>
              </el-form-item>

              <!-- 医疗证号 -->
              <el-form-item :label="'医疗证号'" prop="fyzh" :class="[onlyRead ? 'is-disabled' : '']">
                <el-input v-model="formData.fyzh" :placeholder="'请输入医疗证号'"></el-input>
              </el-form-item>

              <!-- 姓名 -->
              <el-form-item :label="'姓名'" label-width="40px" :class="['item-name', onlyRead ? 'is-disabled' : '']" prop="brxm">
                <el-input v-model="formData.brxm" :placeholder="'请输入姓名'" @change="nameTrim"></el-input>
              </el-form-item>

              <!-- 证件类型 -->
              <el-form-item :label="'证件类型'" :class="[onlyRead ? 'is-disabled' : '']" prop="zjlx">
                <search-select table-name="SYS_PRIMARY_DATA" kid="PD0000000260" v-model="formData.zjlx" :backfillValue="formData.zjlx" :placeholder="'请选择'" @change="zjlxChange" />
              </el-form-item>

              <!-- 证件号码 -->
              <el-form-item :label="'证件号码'" :class="['item-cert', onlyRead ? 'is-disabled' : '']" prop="sfzh">
                <el-input v-model="formData.sfzh" :placeholder="'请输入证件号码'" @change="querySfzh"></el-input>
                <el-button type="primary" @click="readIdCard">读证</el-button>
              </el-form-item>
            </div>
          </div>
          <div class="lower clearfix">
            <!-- 性别 -->
            <el-form-item :label="'性别'" prop="brxb" :class="onlyRead || isCorrectIDCard ? 'is-disabled' : ''">
              <search-select table-name="SYS_PRIMARY_DATA" kid="PD0000000269" v-model="formData.brxb" :backfillValue="formData.brxb" :disabled="formData.zjlx=='01'" @change="nameTrim"/>
            </el-form-item>

            <!-- 出生日期 -->
            <el-form-item :label="'出生日期'" class="item-date" prop="csny" :class="onlyRead || isCorrectIDCard ? 'is-disabled' : ''">
              <el-date-picker @change="nameTrim" v-model="formData.csny" type="date" value-format="yyyy-MM-dd" :placeholder="'请选择日期'" :disabled="formData.zjlx=='01'" class="date-wrapper"></el-date-picker>
            </el-form-item>

            <!-- 年龄 -->
            <el-form-item :label="'年龄'" prop="ages" :class="onlyRead || isCorrectIDCard ? 'is-disabled' : ''">
              <el-input v-model="formData.ages" :placeholder="'请输入年龄'" :disabled="formData.zjlx=='01'"></el-input>
            </el-form-item>

            <!-- 收费性质 -->
            <el-form-item :label="'收费性质'" :class="[onlyRead ? 'is-disabled' : '']" prop="brxz">
              <el-select v-model="formData.brxz" placeholder="请选择" @change="changeBrxz" clearable>
                <el-option v-for="item in brxzList" :key="item.brxz" :label="item.xzmc" :value="item.brxz"> </el-option>
              </el-select>
              <!-- <search-select
                  table-name="SYS_DICT_CONFIG"
                  kid="68"
                  v-model="formData.brxz"
                  :backfillValue="formData.brxz"
                  :placeholder="'请选择'"
                  @change="changeBrxz"
                /> -->
            </el-form-item>
            <!-- 本人电话 -->
            <el-form-item :label="'本人电话'" :class="[onlyRead ? 'is-disabled' : '']" prop="brdh">
              <el-input v-model="formData.brdh" :placeholder="'请输入本人电话'"></el-input>
            </el-form-item>
            <!-- 农合 -->
            <el-form-item :label="'农合'" :class="[onlyRead ? 'is-disabled' : '']" prop="isnh">
              <search-select table-name="SYS_FLAG_DATA" kid="FD000005" v-model="formData.isnh" :backfillValue="formData.isnh" :placeholder="'请选择'" />
            </el-form-item>
            <!-- 职业 -->
            <el-form-item :label="'职业'" :class="[onlyRead ? 'is-disabled' : '']" prop="zydm">
              <search-select table-name="SYS_PRIMARY_DATA" kid="PD0000000432" v-model="formData.zydm" :backfillValue="formData.zydm" :placeholder="'请选择'" />
            </el-form-item>

            <!-- 联系人 -->
            <el-form-item :label="'联系人'" :class="[onlyRead ? 'is-disabled' : '']" prop="lxrm">
              <el-input v-model="formData.lxrm" :placeholder="'请输入联系人姓名'"></el-input>
            </el-form-item>

            <!-- 联系人关系 -->
            <el-form-item :label="'联系人关系'" :class="[onlyRead ? 'is-disabled' : '']" prop="lxgx">
              <search-select table-name="SYS_PRIMARY_DATA" kid="PD0000000143" v-model="formData.lxgx" :backfillValue="formData.lxgx" :placeholder="'请选择'" />
            </el-form-item>

            <!-- 联系人电话 -->
            <el-form-item :label="'联系人电话'" :class="[onlyRead ? 'is-disabled' : '']" prop="lxrdh">
              <el-input v-model="formData.lxrdh" :placeholder="'请输入联系人电话'"></el-input>
            </el-form-item>

            <!-- 联系人地址 -->
            <el-form-item :label="'联系人地址'" :class="[onlyRead ? 'is-disabled' : '']" prop="lxdz">
              <el-input v-model="formData.lxdz" :placeholder="'请输入联系人地址'"></el-input>
            </el-form-item>

            <!-- 户籍标识 -->
            <el-form-item :label="'户籍标识'" :class="[onlyRead ? 'is-disabled' : '']" prop="hjbz">
              <search-select table-name="SYS_PRIMARY_DATA" kid="PD0000000125" v-model="formData.hjbz" :backfillValue="formData.hjbz" :placeholder="'请选择'" />
            </el-form-item>

            <!-- 民族 -->
            <el-form-item :label="'民族'" :class="[onlyRead ? 'is-disabled' : '']" prop="mzdm">
              <search-select table-name="SYS_PRIMARY_DATA" kid="PD0000000215" v-model="formData.mzdm" :backfillValue="formData.mzdm" />
            </el-form-item>

            <!-- 血型 -->
            <el-form-item :label="'血型'" :class="[onlyRead ? 'is-disabled' : '']" prop="xxdm">
              <search-select table-name="SYS_PRIMARY_DATA" kid="PD0000000008" v-model="formData.xxdm" :backfillValue="formData.xxdm" :placeholder="'请选择'" />
            </el-form-item>

            <!-- 婚姻状况 -->
            <el-form-item :label="'婚姻状况'" :class="[onlyRead ? 'is-disabled' : '']" prop="hyzk">
              <search-select table-name="SYS_PRIMARY_DATA" kid="PD0000000137" v-model="formData.hyzk" :backfillValue="formData.hyzk" />
            </el-form-item>

            <!-- 国籍 -->
            <el-form-item :label="'国籍'" :class="[onlyRead ? 'is-disabled' : '']" prop="gjdm">
              <search-select table-name="SYS_PRIMARY_DATA" kid="PD0000000271" v-model="formData.gjdm" :placeholder="'请选择'" :backfillValue="formData.gjdm" />
            </el-form-item>

            <!-- 联系地址 -->
            <el-form-item :label="'联系地址'" :class="[onlyRead ? 'is-disabled' : '']" class="item-cascade">
              <cascade-address :backfillObj="backfillObj" v-model="addressValue" :key="cascadeIndex" @change="ssqChange" />
            </el-form-item>

            <!-- 详细地址 -->
            <el-form-item :label="'详细地址'" :class="['item-address', onlyRead ? 'is-disabled' : '']" prop="xzzQtdz">
              <el-input v-model="formData.xzzQtdz" :placeholder="'请输入详细地址'"></el-input>
            </el-form-item>

            <!-- 保险卡号 -->
            <el-form-item :label="'保险卡号'" :class="[onlyRead ? 'is-disabled' : '']" prop="bxcabxbxcardno">
              <el-input v-model="formData.bxcabxbxcardno" :placeholder="'请输入保险卡号'"></el-input>
            </el-form-item>

            <!-- 保险有效期 -->
            <el-form-item :label="'保险有效期'" :class="[onlyRead ? 'is-disabled' : '']">
              <el-date-picker v-model="daterange" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始时间" end-placeholder="结束时间" class="date-wrapper"></el-date-picker>
            </el-form-item>

            <!-- 保险公司 -->
            <el-form-item :label="'保险公司'" :class="[onlyRead ? 'is-disabled' : '']" prop="bxcompany">
              <el-input v-model="formData.bxcompany" :placeholder="'请输入保险公司'"></el-input>
            </el-form-item>

            <!-- 工伤认定号 -->
            <el-form-item :label="'工伤认定号'" :class="[onlyRead ? 'is-disabled' : '']" prop="gsrdh">
              <el-input v-model="formData.gsrdh" :placeholder="'请输入工伤认定号'"></el-input>
            </el-form-item>

            <!-- 凭证类型 -->
            <el-form-item :label="'凭证类型'" :class="[onlyRead ? 'is-disabled' : '']" prop="pzlx">
              <search-select table-name="SYS_FLAG_DATA" kid="PZ000001" v-model="formData.pzlx" :placeholder="'请选择'" :backfillValue="formData.pzlx" />
            </el-form-item>

            <!-- 凭证号码 -->
            <el-form-item :label="'凭证号码'" :class="[onlyRead ? 'is-disabled' : '']" prop="pzhm">
              <el-input v-model="formData.pzhm" :placeholder="'离休/丧劳/帮困等'"></el-input>
            </el-form-item>

            <!-- 所属单位 -->
            <el-form-item :label="'所属单位'" :class="[onlyRead ? 'is-disabled' : '']" prop="dwmc">
              <!-- <search-select table-name="SYS_PRIMARY_DATA" kid="PD0000000271" v-model="formData.dwmc" :placeholder="'请选择'" :backfillValue="formData.dwmc" /> -->
              <el-input v-model="formData.dwmc" :placeholder="'所属单位'"></el-input>
            </el-form-item>
          </div>

          <!-- 病人id -->
          <el-form-item :label="'病人id'" prop="brid" hidden>
            <el-input v-model="formData.brid"></el-input>
          </el-form-item>

          <!-- empiid -->
          <el-form-item :label="'empiid'" prop="empiid" hidden>
            <el-input v-model="formData.empiid"></el-input>
          </el-form-item>

          <!-- 分诊流水号 -->
          <el-form-item :label="'分诊流水号'" prop="lsh" hidden>
            <el-input v-model="formData.lsh"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="'就诊卡管理'" name="second" v-if="!onlyRead">
        <div class="his-module his-small card-list">
          <div class="row">
            <div class="label">
              <div class="btn">
                <el-button type="text" size="mini" @click="addCard('', '')">
                  <i class="icon his-caozuo-jiandang blue"></i>
                  <span>新增</span>
                </el-button>
              </div>
            </div>
            <div class="operate"></div>
          </div>
          <el-table stripe :highlight-current-row="true" :data="formData.mpiCardList" border @row-click="rowClick" :height="'506'" class="input-table scroll-bar no-underline">
            <el-table-column type="index" width="32" align="center"></el-table-column>
            <el-table-column :label="'卡类型'">
              <template slot-scope="scope">
                <search-select table-name="SYS_PRIMARY_DATA" kid="PD0000000726" v-model="scope.row.cardtypecode" :backfillValue="scope.row.cardtypecode" :placeholder="'请选择'" :disabled="scope.row.cardid != null ? true : false" :ref="'input' + scope.$index" @change="(val) => {checkCard(1,val, scope.$index, scope.row)}"/>
              </template>
            </el-table-column>
            <el-table-column :label="'卡号'">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.cardno"
                  :disabled="scope.row.cardid != null ? true : false || scope.row.disabled"
                  @change="
                    (val) => {
                      checkCard(2,val, scope.$index, scope.row)
                    }
                  "
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="'性质'">
              <template slot-scope="scope">
                <el-select v-model="scope.row.brxz" placeholder="请选择" filterable remote clearable>
                  <el-option v-for="item in brxzList" :key="item.brxz" :label="item.xzmc" :value="item.brxz"> </el-option>
                </el-select>
              </template>
            </el-table-column>

            <!-- 卡状态 0=正常，1=挂失，2=注销，3=失效 -->
            <el-table-column :label="'状态'">
              <template slot-scope="scope">
                <div v-if="scope.row.cardid != null" :class="scope.row.status | filterStatusColor">{{ scope.row.status | filterStatus }}</div>
                <div v-else class="blues">{{ '0' | filterStatus }}</div>
              </template>
            </el-table-column>
            <el-table-column :label="'行政区划代码'">
              <template slot-scope="scope">
                <el-input v-model="scope.row.regioncode"></el-input>
              </template>
            </el-table-column>

            <!-- 操作 -->
            <el-table-column :label="'操作'" width="106" align="center" class-name="action-btns">
              <template slot-scope="scope">
                <el-tooltip :content="'注销'" effect="light">
                  <el-popconfirm :title="'确认注销？'" :confirmButtonText="$t('common.confirm')" :cancelButtonText="$t('common.cancel')" @confirm="logoffCard(scope.row)" hideIcon>
                    <el-button slot="reference" class="red" :disabled="scope.row | filterDisableLogoff">
                      <i class="icon his-disabled"></i>
                    </el-button>
                  </el-popconfirm>
                </el-tooltip>
                <el-tooltip :content="'挂失'" effect="light">
                  <el-popconfirm :title="'确认挂失？'" :confirmButtonText="$t('common.confirm')" :cancelButtonText="$t('common.cancel')" @confirm="lockCard(scope.row)" hideIcon>
                    <el-button slot="reference" class="red" :disabled="scope.row | filterDisableLock">
                      <i class="icon his-right_caozuo_kaguashi"></i>
                    </el-button>
                  </el-popconfirm>
                </el-tooltip>
                <el-tooltip :content="'解挂'" effect="light">
                  <el-popconfirm :title="'确认解挂？'" :confirmButtonText="$t('common.confirm')" :cancelButtonText="$t('common.cancel')" @confirm="unLockCard(scope.row)" hideIcon>
                    <el-button slot="reference" class="green" :disabled="scope.row | filterDisableUnLock">
                      <i class="icon his-jiegua-30"></i>
                    </el-button>
                  </el-popconfirm>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- <pre class="form-data scroll-bar">{{ybInfo}}</pre> -->
    <div class="tabs-side" v-if="!onlyRead">
      <el-divider direction="vertical"></el-divider>
      <div class="action" @click="resetAll">
        <i class="icon his-btn-reset green"></i>
        <span>重置</span>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="shouwLoading">确定</el-button>
    </span>
  </el-dialog>
  <div>
    <!-- 根据姓名查询列表匹配 -->
		<el-dialog
			:title="'挂号信息选择'"
			:visible.sync="dialogGhdjSelect"
			width="600px"
			:close-on-click-modal="false"
			v-elDraggableDialog
			@close="closeDialog"
			class="narrow-dialog dialog-ghdjselect"
		>
			<div class="his-module his-small">
				<el-table 
					stripe 
					:highlight-current-row="true"
					:data="nameTableData" 
					border
					class="mt10 scroll-bar"
					@row-dblclick="dblSelectName"
					ref="table"
				>
					<el-table-column type="index" width="32" align="center"></el-table-column>
					<el-table-column prop="brxm" :label="'姓名'"></el-table-column>
					<el-table-column prop="brxb" :label="'性别'">
            <template slot-scope="{row}">
              <div>
                {{row.brxb==1?'男':'女'}}
              </div>
            </template>
          </el-table-column>
					<el-table-column prop="sfzh" :label="'身份证号'" width="140"></el-table-column>
				</el-table>
			</div>
			<!-- <span slot="footer" class="dialog-footer">
				<el-button @click="dialogGhdjSelect = false">取消</el-button>
				<el-button type="primary" @click="selectGhdj">确定</el-button>
			</span> -->
		</el-dialog>

		<!-- <pre>{{formData}}</pre> -->
	</div>
  </div>
  <!-- </div> -->
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { aAddPatient, aQueryMzhm, aQuerySfzh, aQueryCard, aLogoffCard, aLockCard, aUnLockCard, aGetBrxzList, aQueryBrxz ,readeVidences,getNameCardList} from '@/api/his/op/reg/addPatient.ts'
import { aQuerySjBrxz , queryLxList} from '@/api/his/op/reg/registerManage.ts'
import { aReadMedAcc, checkCardInfo,aReadMedAccInfo } from '@/api/his/basic'
import { regInt, regLetNum, regIDCard, regPhone, regTel, regEmail,regPhoneTel } from '@/utils/validate.ts'
import axios from 'axios'


@Component({
  name: '',
  filters: {
    filterStatus(value: string) {
      var status: string = ''
      switch (value) {
        case '0': // 正常
          status = '正常'
          break
        case '1': // 挂失
          status = '挂失'
          break
        case '2': // 注销
          status = '注销'
          break
        case '3': // 失效
          status = '失效'
          break
      }
      return status
    },
    filterStatusColor(value: string) {
      var color: string = ''
      switch (value) {
        case '0': // 正常
          color = 'blues'
          break
        case '1': // 挂失
          color = 'yellow'
          break
        case '2': // 注销
          color = 'reds'
          break
        case '3': // 失效
          color = ''
          break
      }
      return color
    },
    filterDisableLogoff(row: any) {
      // 卡状态 0=正常，1=挂失，2=注销，3=失效
      if (row.cardid != null) {
        if (row.status == 0 || row.status == 1) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    filterDisableLock(row: any) {
      // 卡状态 0=正常，1=挂失，2=注销，3=失效
      if (row.cardid != null) {
        if (row.status == 0) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    filterDisableUnLock(row: any) {
      // 卡状态 0=正常，1=挂失，2=注销，3=失效
      if (row.cardid != null) {
        if (row.status == 1) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
  },
})
export default class extends Vue {
  @Prop({ required: false, default: () => ({}) }) private patientInfo: any // 表单数据
  @Prop({ required: false, default: false }) private onlyRead: any // 是否只读
  @Prop({ required: false, default: false }) private doctorFlag: any

  private dialogVisible: boolean = false
  private activeName: string = 'first'
  // private formData: any = this.patientInfo
  private formData: any = {
    mpiCardList: [
      // {
      //   cardno: '', // 卡号
      //   brxz: '', // 收费性质
      //   status: '0'
      // }
    ],
    jzkh: '', // 卡号
    mzhm: '', // 门诊号码
    fyzh: '', // 医疗证号
    brxm: '', // 姓名
    zjlx: '01', // 证件类型
    sfzh: '', // 证件号码
    brxb: '', // 性别
    csny: '', // 出生日期
    ages: '', // 年龄
    brxz: '', // 收费性质
    isnh: '0', // 农合（否）
    brdh: '', // 本人电话
    zydm: '', // 职业代码
    lxrm: '', // 联系人
    lxgx: '', // 与联系人关系
    lxrdh: '', // 联系人电话
    lxdz: '', // 联系人地址
    hjbz: 1, // 户籍标识（本地户口）
    mzdm: 1, // 民族（汉族）
    xxdm: 5, // 血型（不详）
    hyzk: 10, // 婚姻状况（未婚）
    gjdm: 156, // 国籍（中国）
    xzzSqs: '', // 省
    xzzS: '', // 市
    xzzX: '', // 区/县
    xzzQtdz: '', // 详细地址
    bxcabxbxcardno: '', // 保险卡号
    bxstart: '', // 保险有效期起
    bxend: '', // 保险有效期止
    bxcompany: '', // 保险公司
    gsrdh: '', // 工伤认定号
    pzlx: '', // 凭证类型
    pzhm: '', // 凭证号码
    dwmc: '', // 单位名称
    brid: '', // 病人id hidden
    empiid: '', // empiid hidden
    lsh: '', // 分诊流水号 hidden
  }
  private formData2: any = {}
  private addressValue: string = '' // 省市区id，字符串
  private daterange: any[] = [] // 保险有效期
  private backfillObj: any = {
    // 初始化省市区
    provinceId: 310000,
    cityId: 310100,
    areaId: 0,
  }
  private dialogGhdjSelect:boolean = false
  private nameTableData:any[] = []
  private shouwLoading:boolean = false
  // private brxzList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.BRXZ_DICT : this.$store.state.webSqlDict.BRXZ_DICT
  private brxzList: any[] = []
  private formRule: any = {
    jzkh: [
      // {message: '禁止键盘录入，请刷卡', trigger: 'blur'}
      { pattern: regLetNum, message: '请输入字母和数字', trigger: 'change' },
    ],
    mzhm: [
      // {required: true, message: '门诊号码不能为空', trigger: 'blur'}
    ],
    brxm: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
    sfzh: [
      // {required: true, message: '证件号码不能为空', trigger: 'blur'},
      { pattern: regIDCard, message: window.ele.$i18n.t('emp.vdIDCard2'), trigger: 'blur' },
    ],
    brxb: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
    csny: [{ required: true, message: '出生日期不能为空', trigger: 'blur' }],
    brxz: [{ required: true, message: '收费性质不能为空', trigger: 'blur' }],
    brdh: [
      { required: true, message: '本人电话不能为空', trigger: 'blur' },
      { pattern: regPhoneTel, message: '请输入正确的电话号码', trigger: 'blur' },
    ],
    lxrdh: [{ pattern: regPhoneTel, message: '请输入正确的电话号码', trigger: 'blur' }],
  }
  private jzkhError: string = '' // 就诊卡号的校验信息
  private cascadeIndex: number = 1
  tableData: any = [
    // 卡列表
    { cardtypecode: 1, cardno: 2, brxz: 3, status: 4, regioncode: 5 },
    { cardtypecode: 1, cardno: 2, brxz: 3, status: 4, regioncode: 5 },
  ]
  searchData: any = {}
  private isCorrectIDCard: boolean = true
  private loading: boolean = false
  private isQueriedCard: boolean = false // 是否查询过卡号
  private isQueriedSfzh: boolean = false // 是否查询过卡号
  private curCard: any = '' // 当前选中的卡
  private isAllowLogoff: boolean = false // 是否可被注销
  private isAllowLock: boolean = false // 是否可被挂失
  private isAllowUnLock: boolean = false // 是否可被解挂
  private isAllowEdit: boolean = true // 是否可修改
  private regYbk: any = /^(\d{10})|([a-zA-Z]\w{8})$/ // 医保卡
  private ybInfo: any = {} // 医保卡信息
  private preInfo: any = {} // 无卡预检病人信息
  private oldJzkh:any = ""
  // 打开新增弹窗
  private addDialog(cardno: any, read: boolean) {
    // read，是否读卡
    this.loading = false
    this.activeName = 'first'
    this.dialogVisible = true
    // this.formData = JSON.parse(JSON.stringify({}))
    // this.formData = {}
    this.resetAll()
    this.formData.jzkh = cardno
    // 先执行一次查询
    this.queryCard(cardno)
    // 是否读卡
    if (read) {
      this.readCard()
    }
  }
  private closeDialog(){

  }
  private dblSelectName(row:any){
    for (let i in this.formData) {
          // if (i != 'jzkh' && i != 'brxz') this.formData[i] = res.data[i] //暂时注销掉 逻辑不清晰
      this.formData[i] = row[i] 
    }
    this.isAllowEdit = false
    this.activeName = 'second'
    setTimeout(() => {
      this.addCard(this.formData.jzkh, this.formData.brxz)
    }, 0)
    this.dialogGhdjSelect = false
  }
  //读身份证号码
  private sfzhUrl: any = ''
  private objIp: any = {
    typeId: 1,
    interfaceName: 'IDCardRead',
    ip: '',
  }
  private readeVidence() {
    let that = this
    that.findIP(function (uerIp: any) {
      that.objIp.ip = uerIp
    })
  }
  //身份证读卡功能
  private readIdCard(){
    this.oldJzkh = this.formData.jzkh
    this.resetAll()
    readeVidences(this.objIp).then((item: any) => {
      if (item.errorCode == 'SUCCESS') {
        this.sfzhUrl = item.data
        this.$nextTick(() => {
          axios.get(this.sfzhUrl).then((res: any) => {
            this.formData.sfzh=res.data.cardno
            this.querySfzh(res.data.cardno)
            this.formData.jzkh = this.formData.jzkh?this.formData.jzkh:this.oldJzkh||""
            this.formData.brxm=res.data.name
            this.oldJzkh = ""
          })
        })
      }
    })
  }
  // 无卡预检病人调入-建档
  private addDialog2(preInfo: any) {
    this.loading = false
    this.activeName = 'first'
    this.dialogVisible = true
    this.resetAll()
    this.preInfo = preInfo
    // this.formData.brxm = this.preInfo.brxm
    // this.formData.brxb = this.preInfo.brxb
    for (let i in this.preInfo) {
      this.formData[i] = this.preInfo[i]
    }
    this.$nextTick(() => {
      this.querySfzh(this.formData.sfzh)
      this.showAddressValue()
    })
  }

  // 打开修改弹窗
  private editDialog(a: any) {
    this.dialogVisible = true
    this.formData = this.patientInfo
  }

  // 禁止键盘录入卡号
  forbidInput(e: any) {
    if (e.keyCode == 13) {
      return false
    }
    setTimeout(() => {
      this.formData.jzkh = ''
    }, 0)
    this.jzkhError = '禁止键盘录入，请刷卡'
  }

  // 禁止粘贴
  private handlePaste() {
    // 空方法
  }

  // 姓名除空格
  private nameTrim(value: string) {
    if(!value) return 
    if(!this.formData.csny) return
    if(!this.formData.brxb) return
    this.formData.brxm = this.formData.brxm.trim()
    let params = {
      name:this.formData.brxm,
      csny:this.formData.csny,
      brxb:this.formData.brxb
    }
    getNameCardList(params).then((res:any)=>{
      // if(res.data&&res.data.length==1){
      //   this.$notify({
      //     title: '该患者已有档案，请补卡',
      //     message: '',
      //     type: 'info',
      //   })
      //   for (let i in this.formData) {
      //     // if (i != 'jzkh' && i != 'brxz') this.formData[i] = res.data[i] //暂时注销掉 逻辑不清晰
      //     this.formData[i] = res.data[0][i] 
      //   }
      //   this.isAllowEdit = false
      //   this.activeName = 'second'
      //   setTimeout(() => {
      //     this.addCard(this.formData.jzkh, this.formData.brxz)
      //   }, 0)
      // }else if(res.data&&res.data.length>1){
      //   this.dialogGhdjSelect = true
      //   this.nameTableData = res.data
      // }
      if(res.data&&res.data.length){
        this.dialogGhdjSelect = true
        this.nameTableData = res.data
      }
    })
  }

  private resetAll() {
    this.reset()
    this.ybInfo = {}
    this.preInfo = {}
  }

  // 重置表单
  private reset() {
    this.formData = JSON.parse(JSON.stringify(this.formData2))
    // const formData: any = this.$refs.formData
    // formData.resetFields()
    if(this.doctorFlag != 2) {
      this.getMzhm()
    }
    this.isAllowEdit = true
    // this.formData.mpiCardList = []
    // 清空省市区
    // this.formData.xzzSqs = ''
    // this.formData.xzzS = ''
    // this.formData.xzzX = ''
    this.addressValue = ''
    this.backfillObj.provinceId = 310000
    this.backfillObj.cityId = 310100
    this.backfillObj.areaId = 0
    this.cascadeIndex++
    // 清空时间范围
    // this.formData.bxstart = ''
    // this.formData.bxend = ''
    this.daterange = []
  }
  private getCheckLx(num:Number,val: string, index: number, row: any){
    return new Promise((resolve:any,reject:any)=>{
      if(num==1){
        if(val == '05'){
          queryLxList({sfzh:this.formData.sfzh}).then((res:any)=>{
            if(res.data.list && res.data.list.length){
              this.$set(this.formData.mpiCardList[index], 'cardno', res.data.list[0].cardno)
              this.$set(this.formData.mpiCardList[index], 'disabled', true)
              resolve()
            }else{
              this.$set(this.formData.mpiCardList[index], 'cardtypecode', '')
              this.$message.error('身份证不匹配或离休证已过期')
              resolve()
            }
          })
        }else{
          this.$set(this.formData.mpiCardList[index], 'disabled', false)
          resolve()
        }
      }else{
        resolve()
      }
    })
  }
  //新增   卡片校验
  private async checkCard(num:Number,val: string, index: number, row: any) {
    await this.getCheckLx(num,val, index, row)
    if (row.cardno) {
      if(this.formData.sfzh){
        let params = {
          jzkh: row.cardno,
          sfzh: this.formData.sfzh,
        }
        checkCardInfo(params)
        .then((res: any) => {
          if (res.errorCode != 'SUCCESS') {
            this.$set(this.formData.mpiCardList[index], 'cardno', '')
          }
        })
        .catch((err: any) => {
          this.$set(this.formData.mpiCardList[index], 'cardno', '')
        })
      }
    }
  }
  // 确定按钮
  private handleSubmit() {
    // let timer=setInterval(()=>{
    //   if(this.isQueriedCard){
    this.addPatient()
    //       clearInterval(timer);
    //   }
    // },100);
  }
  //校验身份证
  private checkMessage(title:any){
    this.$notify({
      title: title,
      message: '',
      type: 'error',
    })
  }
  //校验收费性质---不同的收费性质 不同的判断
  private checkData(){
    let flag = true
    //离休
    if(this.formData.brxz=='23'){
      if(!this.formData.pzhm){
        flag =false
        this.checkMessage('医保凭证号不能为空')
        return
      }
      //帮困
    }else if(this.formData.brxz=="301"||this.formData.brxz=="308"){
      if(!this.formData.sfzh){
        flag =false
        this.checkMessage('证件号码不能为空')
        return
      }
      if(!this.formData.pzhm){
        flag =false
        this.checkMessage('医保凭证号不能为空')
        return
      }
      // 城保病人
    }else if(this.formData.brxz=='4001'){
      if(!this.formData.sfzh){
        flag =false
        this.checkMessage('证件号码不能为空')
        return
      }
      // 丧失劳动力
    }else if(this.formData.brxz=='4'){
      if(!this.formData.pzhm){
        flag =false
        this.checkMessage('凭证号码不能为空')
        return
      }
      if(!this.daterange.length){
        flag =false
        this.checkMessage('有效期限不能为空')
        return
      }
      // 工伤病人
    }else if(this.formData.brxz=='3'){
      if(!this.formData.pzhm){
        flag =false
        this.checkMessage('凭证号码不能为空')
        return
      }
    }
    return flag
  }
  // 发起新增
  private addPatient() {
    // 判断离休医保病人必须输入医保凭证号；帮困病人必须需要输入医保凭证号（帮困卡号）、身份证号；城保病人必须输入身份证号；
    // 丧失劳动力大病门诊必须输入凭证号、有效期限；工伤病人必须输入凭证号；
    if(!this.checkData()) return
    const formData: any = this.$refs.formData
    formData.validate((valid: any) => {
      if (valid) {
        // this.formData.mpiCardList = [
        //   {
        //     cardno: this.formData.jzkh,
        //     brxz: this.formData.brxz
        //   }
        // ]
        // this.formData.mpiCardList[0].cardno = this.formData.jzkh
        // this.formData.mpiCardList[0].brxz = this.formData.brxz
        if (this.formData.mpiCardList.filter((item: any) => !item.cardno).length) {
          this.checkMessage('卡号不能为空')
          this.activeName = 'second'
          return
        }
        if (this.formData.mpiCardList.filter((item: any) => !item.cardtypecode).length) {
          this.activeName = 'second'
          this.checkMessage('卡类型不能为空')
          return
        }
        this.shouwLoading = true
        if (this.addressValue != '') {
          let arr = this.addressValue.split(',')
          this.formData.xzzSqs = arr[0]
          this.formData.xzzS = arr[1]
          this.formData.xzzX = arr[2]
        }
        if (this.daterange != []) {
          this.formData.bxstart = this.daterange[0]
          this.formData.bxend = this.daterange[1]
          console.log(this.formData)
        }
        aAddPatient(this.formData).then((res: any) => {
          console.log('新增结束')
          this.shouwLoading = false
          if (res) {
            this.$notify({
              title: '保存成功',
              message: '',
              type: 'success',
            })
            // 如果由父组件查询为空后新增，则再次触发父组件的查询方法
            console.log('触发父组件', res)
            this.$emit('getPatientInfo', res.data)
            this.dialogVisible = false
          }
        }).catch((err:any)=>{
          this.shouwLoading = false
        })
      } else {
        this.activeName = 'first'
      }
    })
  }

  // 根据门诊号码获取档案号码
  private getMzhm() {
    aQueryMzhm().then((res: any) => {
      if (res.data != null) {
        this.formData.mzhm = res.data
      }else{
        this.$alert(res.message, '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: (action) => {
            this.$router.push({
              path: "/billNumberMaintain1?activeName=3",
            })
          },
        })
      }
    })
  }
  // 获取病人性质
  private getBrxzList() {
    aQueryBrxz().then((res: any) => {
      if (res) {
        this.brxzList = res.data
        this.$emit('getBrxzList', this.brxzList)
      }
    })
  }

  // 医保读卡
  private readCard() {
    let params = {
      cardtype: '1',
      carddata: this.formData.jzkh || ' ',
    }
    aReadMedAccInfo(params).then((res: any) => {
      if (res) {
        this.queryCard(res.data.jzkh)
        this.ybInfo = res.data
        this.formData.jzkh = this.ybInfo.jzkh
        this.formData.sfzh = this.ybInfo.sfzh
      }
    })
  }

  // 卡号回车
  private jzkhEnter(value: any) {
    if (value.length == 28) {
      let params = {
        cardtype: '0',
        carddata: this.formData.jzkh,
      }
      aReadMedAcc(params).then((res: any) => {
        if (res) {
          this.queryCard(res.data.jzkh)
          this.ybInfo = res.data
          this.formData.jzkh = this.ybInfo.jzkh
        }
      })
    } else {
      this.queryCard(value)
    }
  }

  // 查询此卡号
  private queryCard(value: any) {
    console.log('查询卡号', value)
    this.jzkhError = ''
    if (value == '' || value == null) {
      return false
    }
    this.loading = true
    aQueryCard({ jzkh: value }).then((res: any) => {
      if (res) {
        if (res.data != null) {
          // 已有档案
          for (let i in this.formData) {
            if (i != 'jzkh') {
              this.formData[i] = res.data[i]
            }
          }
          this.zjlxChange(this.formData.zjlx)
          this.isAllowEdit = false
          this.showAddressValue()
          this.showDateRange()
        } else {
          // 新建档
          this.reset()
          this.formData.jzkh = value

          // 医保卡信息赋值给表单
          if (this.ybInfo.jzkh) {
            for (let i in this.formData) {
              if (i != 'jzkh' && this.ybInfo[i] != null) {
                this.formData[i] = this.ybInfo[i]
                this.formData.xzzQtdz = this.ybInfo.txdz
              }
            }
            this.zjlxChange(this.formData.zjlx)
            if (this.formData.sfzh) {
              this.querySfzh(this.formData.sfzh)
            }
            this.changeBrxz(this.formData.brxz)
          }

          // 赋值给卡列表
          if (this.formData.mpiCardList.length == 0) {
            let cardType
            if (this.regYbk.test(value)) {
              cardType = '98'
            } else {
              cardType = '01'
            }
            this.formData.mpiCardList.push({ cardtypecode: cardType, status: '0' }) // 默认就诊卡
          }
          this.formData.mpiCardList[0].cardno = value

          // 无卡预检病人信息赋值
          if (Object.keys(this.preInfo).length != 0) {
            for (let i in this.preInfo) {
              this.formData[i] = this.preInfo[i]
            }
            this.formData.jzkh = value
            this.showAddressValue()
            this.querySfzh(this.formData.sfzh)
          }
        }
        this.loading = false
        this.isQueriedCard = true
        // 清空校验结果
        const formData: any = this.$refs.formData
        formData.clearValidate()
      }
    })
  }

  // 收费性质改变，赋值给卡列表
  private async changeBrxz(value: any) {
    if(value == 23){
      if(this.formData.sfzh){
        const lxInfo:any = await queryLxList({sfzh:this.formData.sfzh})
        if(lxInfo.data.list&&lxInfo.data.list.length){
          this.formData.jzkh = lxInfo.data.list[0].cardno
          this.formData.pzhm = lxInfo.data.list[0].cardno
          this.formData.pzlx = 1
          this.formData.brxm = lxInfo.data.list[0].xm
        }else{
          this.$message.error('身份证不匹配或离休证已过期')
          this.formData.brxz = ''
          this.formData.pzlx = ''
          this.formData.pzhm = ''
        }
      }
    }else{
      this.formData.pzlx = ''
      this.formData.pzhm = ''
    }

    const res: any = await aQuerySjBrxz({ brxz: value })
    let isYbk: boolean = res.data == '6021' ? true : false

    if (this.formData.mpiCardList.length == 0) {
      // 如果没有卡，则赋给第一张卡
      this.formData.mpiCardList.push({ cardtypecode: '01', status: '0' })
      this.formData.mpiCardList[0].brxz = value
      this.formData.mpiCardList[0].cardtypecode = isYbk ? '98' : '01'
    } else {
      if (this.formData.brid == '') {
        // 没有病人id，赋给第一张卡
        this.formData.mpiCardList[0].brxz = value
        this.formData.mpiCardList[0].cardtypecode = isYbk ? '98' : '01'
      } else {
        var cardIndex = this.formData.mpiCardList.findIndex((item: any) => {
          return item.cardno == this.formData.jzkh
        })
        this.formData.mpiCardList[cardIndex].brxz = value
        this.formData.mpiCardList[cardIndex].cardtypecode = isYbk ? '98' : '01'
      }
    }
  }

  // 证件类型切换
  private zjlxChange(value: any) {
    console.log('证件类型切换')
    if (value == '01') {
      // 01是身份证
      this.formRule.sfzh = [{ pattern: regIDCard, message: this.$t('emp.vdIDCard2'), trigger: 'blur' }]
      this.isCorrectIDCard = true
    } else {
      this.formRule.sfzh = []
      // 清空校验结果
      const formData: any = this.$refs.formData
      formData.clearValidate('sfzh')
      this.isCorrectIDCard = false
    }
  }

  // 查询此身份证号
  private querySfzh(value: any) {
    if (this.formData.zjlx != '01') {
      // 不是身份证则跳出
      return false
    }
    //身份证为空时 跳过
    if (value == '' || value == undefined) return
    const formData: any = this.$refs.formData
    formData.validateField('sfzh', (valid: any) => {
      if (valid == '' || valid == undefined) {
        this.loading = true
        aQuerySfzh({ idCard: value }).then((res: any) => {
          if (res) {
            if (res.data.brid == null) {
              // 新病人
              console.log(res.data)
              this.formData.brxb = res.data.brxb
              this.formData.csny = res.data.csny
              this.formData.ages = res.data.ages
            } else {
              // 已有
              this.$notify({
                title: '该患者已有档案，请补卡',
                message: '',
                type: 'info',
              })
              console.log(res,"res==",this.formData)
              for (let i in this.formData) {
                // if (i != 'jzkh' && i != 'brxz') this.formData[i] = res.data[i] //暂时注销掉 逻辑不清晰
                this.formData[i] = res.data[i] 
              }
              this.isAllowEdit = false
              this.activeName = 'second'
              setTimeout(() => {
                this.addCard(this.formData.jzkh, this.formData.brxz)
              }, 0)
            }
            this.loading = false
          }
        })
      }
    })
  }

  // 显示省市区
  private showAddressValue() {
    // this.addressValue = ''
    this.backfillObj.provinceId = this.formData.xzzSqs
    this.backfillObj.cityId = this.formData.xzzS
    this.backfillObj.areaId = this.formData.xzzX
    this.cascadeIndex++
  }

  ssqChange(value: any) {
    // console.log(value);
  }

  // 显示时间范围
  private showDateRange() {
    if (this.formData.bxstart) {
      this.daterange = [this.formData.bxstart, this.formData.bxend]
    } else {
      this.daterange = []
    }
  }

  // 新病人
  private insertCard() {}

  // 标签页切换
  private tabClick(tab: any) {
    if (tab.name == 'second') {
      // this.tableData = this.formData.mpiCardList
    }
  }

  // 增加卡
  private addCard(cardno: number, brxz: any) {
    if (this.formData.mpiCardList.filter((item: any) => !item.cardno).length) return
    this.formData.mpiCardList.push({ cardno: cardno, brxz: brxz, status: '0' })
    var tableLen = this.formData.mpiCardList.length
    this.$nextTick(() => {
      const inputIndex: any = this.$refs['input' + (tableLen - 1)]
      inputIndex.onFocus()
    })
  }

  // 点击卡列表
  private rowClick(row: any) {
    this.curCard = row
    // 卡状态 0=正常，1=挂失，2=注销，3=失效
    if (row.cardid != null) {
      if (row.status == 0) {
        this.isAllowLogoff = true
        this.isAllowLock = true
        this.isAllowUnLock = false
      }
      if (row.status == 1) {
        this.isAllowLogoff = true
        this.isAllowLock = false
        this.isAllowUnLock = true
      }
      if (row.status == 2 || row.status == 3) {
        this.isAllowLogoff = false
        this.isAllowLock = false
        this.isAllowUnLock = false
      }
    } else {
      this.isAllowLogoff = false
      this.isAllowLock = false
      this.isAllowUnLock = false
    }
  }

  // 卡注销
  private logoffCard(row: any) {
    // if(!this.isAllowLogoff){
    //   return false
    // }
    aLogoffCard({ cardno: row.cardno, brid: this.formData.brid }).then((res: any) => {
      if (res) {
        this.$notify({
          title: '已注销',
          message: '',
          type: 'success',
        })
        this.queryCard(this.formData.jzkh)
      }
    })
  }

  // 卡挂失
  private lockCard(row: any) {
    // if(!this.isAllowLock){
    //   return false
    // }
    aLockCard({ cardno: row.cardno, brid: this.formData.brid }).then((res: any) => {
      if (res) {
        this.$notify({
          title: '已挂失',
          message: '',
          type: 'success',
        })
        this.queryCard(this.formData.jzkh)
      }
    })
  }

  // 卡解挂
  private unLockCard(row: any) {
    // if(!this.isAllowUnLock){
    //   return false
    // }
    aUnLockCard({ cardno: row.cardno, brid: this.formData.brid }).then((res: any) => {
      if (res) {
        this.$notify({
          title: '已解挂',
          message: '',
          type: 'success',
        })
        this.queryCard(this.formData.jzkh)
      }
    })
  }

  // 关闭
  private closed() {
    // 清空校验结果
    const formData: any = this.$refs.formData
    formData.clearValidate()
  }

  // 初始化参数
  private init() {}

  created() {
    this.init()
    console.log('chushi')
    console.log(this.patientInfo)
    // if(this.patientInfo == {}){
    //   this.patientInfo = {
    //     name: 'a',
    //     txmz: '1'
    //   }
    // }
    console.log(this.dialogVisible)
    this.formData2 = JSON.parse(JSON.stringify(this.formData))
    this.getBrxzList()
  }
  //获取电脑ip
  private findIP(callback: any) {
    var myPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection //compatibility for firefox and chrome
    var pc = new myPeerConnection({ iceServers: [] }),
      noop = function () {},
      localIPs: any = {},
      ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
      key

    function ipIterate(ip: any) {
      if (!localIPs[ip]) callback(ip)
      localIPs[ip] = true
    }
    pc.createDataChannel('')
    pc.createOffer().then(function (sdp: any) {
      sdp.sdp.split('\n').forEach(function (line: any) {
        if (line.indexOf('candidate') < 0) return
        line.match(ipRegex).forEach(ipIterate)
      })
      pc.setLocalDescription(sdp)
    })
    pc.onicecandidate = function (ice: any) {
      if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return
      ice.candidate.candidate.match(ipRegex).forEach(ipIterate)
    }
  }

  mounted() {
    // localStorage.setItem('ipInfo','192.168.31.64')
    this.readeVidence()
    // console.log('病人性质===', this.brxzList);
    // console.log(typeof(this.brxzList[0].brxz));
  }
}
</script>

<style scoped lang="scss">
// 弹窗样式
.el-dialog__wrapper ::v-deep {
  .el-dialog {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 702px;
    margin: auto !important;
    .el-dialog__body {
      position: relative;
      padding-top: 10px;
    }
  }
}

// tab样式
.el-tabs ::v-deep {
  .el-tabs__header {
    margin-bottom: 10px;
  }
  .el-tabs__content {
    height: 538px;
  }
}

// 表单样式
.form-patient {
  .el-form-item {
    float: left;
    display: block;
    width: calc((100% - 24px * 2) / 3);
    margin: 0 24px 16px 0;
    // border: 1px solid;
    ::v-deep {
      .el-form-item__label {
        line-height: 28px;
      }
      .el-form-item__content {
        width: initial;
        margin-left: 80px !important;
        line-height: 28px;
        .el-form-item__error {
          padding-top: 2px;
        }
      }
      .el-input__inner {
        height: 28px !important;
      }
      .el-input__icon {
        line-height: 28px;
      }
    }
    .el-select {
      width: 100%;
    }
    .el-date-editor ::v-deep {
      width: 100%;
      .el-input__icon {
        display: none;
      }
      .el-range-input {
        background: none;
      }
      .el-range-separator {
        width: auto;
      }
    }
    &:nth-child(3n) {
      margin-right: 0;
    }
    &.item-card,
    &.item-name {
      ::v-deep .el-form-item__content {
        margin-left: 40px !important;
      }
    }
    &.item-cert,
    &.item-card {
      .el-input {
        width: calc(100% - 46px);
      }
      .el-button {
        width: 42px;
        height: 28px;
        margin-left: 4px;
        padding: 0;
        justify-content: center;
      }
    }
    &.item-cascade {
      width: calc((100% - 24px * 2) / 3 * 2 + 24px);
      margin-right: 0;
      .cascade-address {
        width: 100%;
      }
    }
    &.item-address {
      width: 100%;
    }
    &.gzrdh {
    }
    &[hidden] {
      display: none;
    }
  }
  .upper {
    position: relative;
    .head-pic {
      float: left;
      position: absolute;
      width: 72px;
      height: 90px;
      text-align: center;
      line-height: 90px;
      background: $lightGray;
      img {
        width: 50%;
        margin-top: 16px;
      }
    }
    .form-area1 {
      width: 100%;
      margin-left: calc(72px + 18px);
      .el-form-item {
        &:nth-child(3n + 1) {
          width: calc((100% - 24px * 2) / 3 - 72px - 18px);
        }
      }
    }
  }
  .lower {
    margin-bottom: -10px;
    .el-form-item {
      &:nth-last-child(-n + 3) {
        // margin-bottom: 0;
      }
    }
  }
}

// 表格样式
.card-list {
  padding: 0;
  .row {
    padding-bottom: 0;
    border: none;
    .label {
      height: 24px;
    }
  }
  ::v-deep .action-btns {
    .icon {
      font-size: 16px !important;
      left: calc(50% + 1px) !important;
    }
  }
}
@import '@/styles/inputTable.scss';

.tabs-side {
  position: absolute;
  top: 16px;
  left: 210px;
  .action {
    vertical-align: middle;
  }
}

// 调试
// .el-tabs{
//   display: inline-block;
//   width: 80%;
// }
// .form-data{
//   float: right;
//   width: 20%;
//   height: 450px;
//   overflow: auto;
// }
</style>
