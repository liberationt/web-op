<template>
  <div class="content">
    <div class="left" :class="[isExpand?'is-shrink':'']">
      <div class="upper area">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <div class="btn">
                <el-checkbox v-model="isEcQrcode" class="ec-qrcode">电子凭证</el-checkbox>
                <el-divider direction="vertical"></el-divider>
                <el-button
                  type="text"
                  size="mini"
                  @click="handleAdd()"
                >
                  <i class="icon his-caozuo-jiandang blue"></i>建档
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="preSave"
                  v-if="0"
                >
                  <i class="icon his-btn-save blue"></i>预保存
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="handleOpenSettlement"
                >
                  <i class="icon his-btn-charge green"></i>结算(F8)
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="resetForm"
                >
                  <i class="icon his-btn-del red"></i>清空
                </el-button>
              </div>
              <el-divider direction="vertical"></el-divider>
              <div class="btn">
                <el-button
                  type="text"
                  size="mini"
                  @click="openVoidInputDialog"
                >
                  <i class="icon his-caozuo-fapiao red"></i>发票作废
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="handleCopyInvoice"
                  style="display:none"
                >
                  <i class="icon his-caozuo-fapiao green"></i>发票复制
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="handleEditInvoice"
                  style="display:none"
                >
                  <i class="icon his-caozuo-fapiao blue"></i>发票修改
                </el-button>
                <!-- <el-button
                  type="text"
                  size="mini"
                >
                  <i class="icon his-btn-print blue"></i>发票设置
                </el-button> -->
              </div>
              <!-- <el-divider direction="vertical"></el-divider>
              <div class="action">
                <i class="icon his-caozuo-return-premium blue"></i>
                <span>隔日退费</span>
              </div>
              <div class="action">
                <i class="icon his-inserting blue"></i>
                <span>自动插入</span>
              </div> -->
            </div>
            <!-- 读卡：{{isRead}} 多个：{{isMultiple}} -->
          </div>

          <el-form
						ref="formData"
						:model="formData"
						:rules="formRule"
						label-width="60px"
						class="form4 clearfix"
					>
						<div class="form-area">
							<!-- 就诊卡号 -->
							<el-form-item :label="'就诊卡号'" prop="jzkh" class="item-card">
								<el-input
                  v-model="formData.jzkh"
                  :placeholder="'请输入卡号'"
                  @keyup.enter.native="jzkhEnter"
                  ref="inputJzkh"
                ></el-input>
							</el-form-item>
							<el-button
								type="primary"
								class="blue-btn"
								icon="icon his-reading-card"
                @click="readCard('1')"
							>读卡</el-button>
						</div>
            <div class="form-area">
							<!-- 患者姓名 -->
							<el-form-item :label="'患者姓名'" prop="brxm" disabled>
								<el-input
                  v-model="formData.brxm"
                  :placeholder="'患者姓名'"
                  :disabled="true"
                ></el-input>
							</el-form-item>
						</div>
						<div class="form-area">
							<!-- 收费性质 -->
							<el-form-item :label="'收费性质'" prop="brxz" disabled>
                <el-select
                  v-model="formData.brxz"
                  placeholder="收费性质"
									:disabled="true"
                  class="no-arrow"
                  @change="changeBrxz"
                >
                  <el-option
                    v-for="item in brxzList"
                    :key="item.brxz"
                    :label="item.xzmc"
                    :value="item.brxz">
                  </el-option>
                </el-select>
							</el-form-item>
						</div>
						<div class="form-area">
							<!-- 发票号码 -->
							<el-form-item :label="'发票号码'" prop="fphm" class="is-disabled">
								<el-input
                  v-model="formData.fphm"
                  :placeholder="'发票号码'"
                  :disabled="true"
                ></el-input>
							</el-form-item>
						</div>
						<div class="form-area">
							<!-- 就诊流水号 -->
              <!-- 病人可能挂过相同的科室，formData.ghks由patientGhks转换 -->
							<el-form-item :label="'挂号科室'" prop="jzlsh">
								<el-select v-model="formData.jzlsh" @change="changeGhks()" @focus="ksPatientDept" ref="ghks" :filter-method="searchKsdm"  filterable popper-class="hidden-option"> <!-- change不传参 -->
									<!-- <el-option
                    v-for="item in deptListToday"
                    :key="item.ghks"
                    :value="Number(item.ghks)"
                    :label="item.ksmc"
                  ></el-option> -->
                  <el-option
                    v-for="item in patientDeptList1"
                    :key="item.jzlsh"
                    :value="item.jzlsh"
                    :label="item.ksmc"
                  >
                    <span>{{item.ksmc}} ({{item.ghsj}})</span>
                  </el-option>
								</el-select>
							</el-form-item>

              <!-- 挂号科室 -->
							<el-form-item :label="'挂号科室'" prop="ghks" disabled hidden>
								<el-input
                  v-model="formData.ghks"
                  :placeholder="'挂号科室'"
                  :disabled="true"
                ></el-input>
							</el-form-item>
						</div>
						<div class="form-area">
							<!-- 医生姓名 -->
							<el-form-item :label="'医生姓名'" prop="ysdm">
								<el-select v-model="formData.ysdm" @change="changeDoc" ref="ysxm" :filter-method="searchDoc" @focus="ysDocList" filterable>
									<el-option
                    v-for="item in docList1"
                    :key="item.ysdm"
                    :value="Number(item.ysdm)"
                    :label="item.ysmc"
                  ></el-option>
								</el-select>
							</el-form-item>
						</div>
            <div class="form-area">
							<!-- 医生姓名 -->
							<el-form-item :label="'诊断类别'" prop="zdlb">
								<el-select v-model="formData.zdlb">
									<el-option
                    v-for="item in zdlbList"
                    :key="item.value"
                    :value="Number(item.value)"
                    :label="item.label"
                    :disabled='item.disabled'
                  ></el-option>
								</el-select>
							</el-form-item>
						</div>
						<div class="form-area">
							<!-- 诊断 -->
							<el-form-item :label="'诊断名称'" prop="zdxh">
								<!-- <dict-search-select
                  v-model="formData.zdxh"
                  :backFillValue="formData.zdxh"
                  :resultTableHeader="[{prop:'JBMC',label:'疾病名称',width:'200'},{prop:'ICD_CODE',label:'ICD10',width:'90'},{prop:'JBXH',label:'院内序号',width:'80'}]"
                  :popoverWidth="400"
                  labelFiled="JBMC"
                  valueFiled="JBXH"
                  queryFiled="JBMC"
                  :disabled="true"
                  :placeholder="'请录入诊断'"
                /> -->
                <remote-search-select
                :searchUrl="searchUrl"
                :resultTableHeader="[
                  {
                    prop: 'jbmc',
                    label: '诊断名称'
                  },
                  {
                    prop: 'jbdm',
                    label: '疾病编码'
                  }
                ]"
                :popover-width="235"
                :searchData="{
                  pydm:''
                }"
                ref="searchFm"
                searchField="pydm"
                showLabel="jbmc"
                data-type="0"
                @getData="setDataFmOrJf"
                v-model="formData.jbmc"
              >
                <el-select 
                  @blur="closePop"
                  v-model="formData.jbmc"
                  class="search-select"
                  remote
                  filterable
                  :popper-append-to-body="false"
                  :remote-method="
                    query => {
                      remoteMethod(query)
                    }
                  "
                  :clearable="true"
                >
                  <!-- <> -->
                </el-select> 
              </remote-search-select>
							</el-form-item>
						</div>
            <div class="form-area" v-if="curRow1.cflx==3">
							<!-- 草药帖数 -->
							<el-form-item :label="'草药帖数'" prop="cyts">
								<el-input
                  v-model="curRow1.cfts"
                  :placeholder="'草药帖数'"
                ></el-input>
							</el-form-item>
						</div>
            <el-form-item :label="'病人id'" prop="brid" hidden>
              <el-input v-model="formData.brid"></el-input>
            </el-form-item>
            <el-form-item :label="'挂号关联'" prop="ghgl" hidden>
              <el-input v-model="formData.ghgl"></el-input>
            </el-form-item>
            <el-form-item :label="'门诊科室'" prop="officeCode" hidden>
              <el-input v-model="formData.officeCode"></el-input>
            </el-form-item>
            <el-form-item :label="'是否为医保'" prop="isYb" hidden>
              <el-input v-model="formData.isYb"></el-input>
            </el-form-item>
            <el-form-item :label="'医保卡id'" prop="cardid" hidden>
              <el-input v-model="formData.cardid"></el-input>
            </el-form-item>
            <el-form-item :label="'医保卡类型'" prop="cardtype" hidden>
              <el-input v-model="formData.cardtype"></el-input>
            </el-form-item>
            <el-form-item :label="'账户标识'" prop="accountattr" hidden>
              <el-input v-model="formData.accountattr"></el-input>
            </el-form-item>
					</el-form>
        </div>
      </div>
      <div class="middle area">
        <div class="btn">
          <el-button
            type="text"
            size="mini"
            @click="addCf(1)"
            :disabled="!allowSgfXy||existDocCf"
          >
            <i class="icon his-caozuo-fayao blue"></i>
            <span>西药</span>
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="addCf(2)"
            :disabled="!allowSgfZy||existDocCf"
          >
            <i class="icon his-tcm blue"></i>
            <span>中成药</span>
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="addCf(3)"
            :disabled="!allowSgfCy||existDocCf"
          >
            <i class="icon his-herbs blue"></i>
            <span>草药</span>
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="addCf(0)"
          >
            <i class="icon his-caozuo-fuzhibingli blue"></i>
            <span>检查</span>
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button
            type="text"
            size="mini"
            @click="insert"
            :disabled="existDocCf&&(!!curRow1.cflx&&curRow1.cflx!=0)"
          >
            <i class="icon his-inserting blue"></i>
            <span>插入</span>
          </el-button>

          <el-button
            type="text"
            size="mini"
            @click="createNewGroup"
            :disabled="existDocCf&&(!!curRow1.cflx&&curRow1.cflx!=0)"
          >
            <i class="icon his-group blue"></i>
            <span>新组</span>
          </el-button>
          
          <el-button
            type="text"
            size="mini"
            @click="deleteSingle"
            :disabled="existDocCf&&(!!curRow1.cflx&&curRow1.cflx!=0)"
          >
            <i class="icon his-btn-del red"></i>
            <span>删除</span>
          </el-button>
          
          <el-button
            type="text"
            size="mini"
            @click="deleteGroup"
            :disabled="existDocCf&&(!!curRow1.cflx&&curRow1.cflx!=0)"
          >
            <i class="icon his-del-group red"></i>
            <span>删除组</span>
          </el-button>
          <!-- 组数：{{lastYpzhSort}} -->
          <!-- {{existDocCf}} -->
        </div>
      </div>
      <div class="lower">
        <div class="lower-left area">
          <div class="his-module his-small">
            <el-table
              stripe
              ref="table"
              :highlight-current-row="true"
              :data="tableData1"
              :row-class-name="tableRowClassName"
              @row-click="getCurRow"
              border
              v-loading="loading"
              class="scroll-bar"
              tooltip-effect="light"
              :height="'100%'"
            >
              <!-- 色块 -->
              <el-table-column
                width="16"
                class-name="color-group"
              >
                <template slot-scope="scope">
                  <div :class="scope.row.ypzhSort % 2 === 1 ? 'greenBack' : 'orangeBack'"></div>
                </template>
              </el-table-column>

              <!-- 组号 -->
              <!-- <el-table-column
                width="100"
                label="分组"
              >
                <template slot-scope="scope">
                  {{scope.row.ypzhSort}}（{{scope.row.cfsb}}-{{scope.row.ypzh}}）
                </template>
              </el-table-column> -->

              <!-- 类型 -->
              <el-table-column width="30">
                <template slot-scope="scope" v-if="scope.row.cfFirst">
                  {{scope.row.cflx|filterCflx}}
                </template>
              </el-table-column>

              <!-- 序号 -->
              <el-table-column
                type="index"
                width="32"
                align="center"
              ></el-table-column>

              <!-- 名称 -->
              <el-table-column
                :label="'名称'"
                prop="ypmc"
                min-width="200"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <!-- <remote-search-select
                    :backfillValue="scope.row.ypmc"
                    :key="keyIndex"
                    :search-url="searchUrl"
                    :resultTableHeader="resultHeader"
                    :searchData="searchData"
                    searchField="pydm"
                    showLabel="ypmc"
                    @focus="getCurRow(scope.row)"
                    @getData="row=>getInfo(row, scope.row)"
                    @keyup.enter.native="nextFocus"
                  /> -->
                  <remoteSearchBox
                    :required="true"
                    v-model="scope.row.ypmc"
                    :ref="`${scope.$index}-1`"
                    style="height: 32px"
                    :popoverWidth="700"
                    :searchData="searchData"
                    :resultTableHeader="resultHeader1"
                    :searchField="{yp:'query', zt:'pydm'}"
                    :showLabel="{yp:'query', zt:'ztmc'}"
                    :name="searchUrlName"
                    @getData="row=>getInfo(row, scope.row)"
                    @keyup.enter.native="focusNext(scope.$index, 1)"
                    :disabled="scope.row.djly==6?false:true"
                  />
                </template>
              </el-table-column>

              <!-- 单位 -->
              <el-table-column
                :label="'单位'"
                prop="yfdw"
                min-width="50"
              ></el-table-column>

              <!-- 归并 -->
              <!-- <el-table-column
                :label="'归并'"
                prop="fygb"
                width="50"
              ></el-table-column> -->

              <!-- 规格 -->
              <el-table-column
                :label="'规格'"
                prop="yfgg"
                min-width="90"
              ></el-table-column>

              <!-- 单价 -->
              <el-table-column
                :label="'单价'"
                min-width="84"
                align="right"
                class-name="text-blue-td"
              >
                <template slot-scope="scope">{{useGetFloat(scope.row.ypdj, 4)}}</template>
              </el-table-column>

              <!-- 数量 -->
              <el-table-column
                :label="'数量'"
                width="60"
              >
                <template slot-scope="scope">
                  <inputBox
                    v-model="scope.row.ypsl"
                    :required="true"
                    @change="changeQuantity"
                    @keydown.enter.native="focusNext(scope.$index, 2)"
                    :ref="`${scope.$index}-2`"
                    style="height: 32px"
                    :disabled="scope.row.djly==6?false:true"
                  />
                </template>
              </el-table-column>

              <!-- 划价金额 -->
              <el-table-column
                :label="'金额'"
                prop="hjje"
                width="80"
                align="right"
                class-name="text-blue-td"
              >
                <template slot-scope="scope">{{scope.row.hjje}}<!-- ({{scope.row.zfbl}}) --></template>
              </el-table-column>

              <!-- 频次 -->
              <el-table-column
                :label="'频次'"
                prop="ypyf"
                width="80"
              >
                <template slot-scope="scope">
                  <select-box
										v-model="scope.row.ypyf"
										:required="true"
										style="height: 32px"
										:options="$store.state.webSqlDict.FREQUENCY_DICT"
										option_label_filed="dn"
										option_value_filed="dv"
                    :ref="`${scope.$index}-3`"
                    @change="focusNext(scope.$index, 3)"
                    :disabled="scope.row.djly!=6||scope.row.djly==6&&scope.row.cflx=='0'"
								  ></select-box>
                </template>
              </el-table-column>

              <!-- 折扣比例 -->
              <el-table-column
                :label="'折扣比例'"
                width="80"
              >
                <template slot-scope="scope">
                  <inputBox
                    :disabled="formData.isYb==1"
                    v-model="scope.row.zkbl"
                    :required="true"
                    @change="((val)=>{calcZhje(val, scope.$index)})"
                    @keydown.enter.native="focusNext(scope.$index, 4)"
                    :ref="`${scope.$index}-4`"
                    style="height: 32px"
                  />
                </template>
              </el-table-column>

              <!-- 折后金额 -->
              <el-table-column
                :label="'折后金额'"
                prop="zhje"
                width="80"
                align="right"
                class-name="text-blue-td"
              >
                <!-- <span>{{getFloatNum(scope.row.zhje)}}</span> -->
                <template slot-scope="scope">
                  <inputBox
                    :disabled="formData.isYb==1"
                    v-model="scope.row.zhje"
                    :required="true"
                    @change="((val)=>{calcZkbl(val, scope.$index)})"
                    @keydown.enter.native="focusNext(scope.$index, 5)"
                    :ref="`${scope.$index}-5`"
                    style="height: 32px"
                  />
              </template>
            </el-table-column>

            </el-table>
          </div>
        </div>
        <div class="lower-right">
          <div class="lower-right-upper area">
            <div class="his-module his-small">
              <el-table
                stripe
                ref="table"
                :highlight-current-row="true"
                :data="tableData2"
                @row-click="getDetail"
                border
                v-loading="loading"
                class="scroll-bar"
                tooltip-effect="light"
                :height="'calc(100% - 26px)'"
              >

                <!-- 项目名称 -->
                <el-table-column
                  :label="'项目名称'"
                  prop="xmmc"
                ></el-table-column>

                <!-- 金额 -->
                <el-table-column
                  :label="'金额'"
                  prop="je"
                  min-width="70"
                  class-name="text-blue-td"
                ></el-table-column>

                <!-- 自负金额 -->
                <el-table-column
                  :label="'自负金额'"
                  prop="zfje"
                  class-name="text-blue-td"
                >
                
                  <template slot-scope="scope">
                    <div>{{getFloatNum(scope.row.zfje)}}</div>
                  </template>
                </el-table-column>

                <!-- 费用归并 -->
                <el-table-column
                  :label="'费用归并'"
                  prop="fygb"
                >
                  <template slot-scope="scope">
                    <div v-if="fygbList.find(item => item.dv==scope.row.fygb)">
                      {{fygbList.find(item => item.dv==scope.row.fygb).dn}}
                    </div>
                    <div v-else>{{scope.row.fygb}}</div>
                  </template>
                </el-table-column>

                <!-- 折扣比例 -->
                <!-- <el-table-column
                  :label="'折扣比例'"
                  prop="gg"
                ></el-table-column> -->

              </el-table>
              <div class="total">
                <div>合计：</div>
                <span>{{amount}}</span>
                <el-divider direction="vertical"></el-divider>
                <div>自负：</div>
                <span>{{zfAmount}}</span>

              </div>
            </div>
          </div>
          <div class="lower-right-lower area">
            <prevRecord :key="keyPrev"/>
          </div>
        </div>
      </div>
    </div>

    <!-- 侧边 -->
    <!-- 逻辑不通 暂时关闭掉 -->
    <!-- <div class="right area" :class="[isExpand?'is-expand':'']">
      <i
        class="icon expand-toggle"
        :class="[isExpand?'his-card-open':'his-card-put']"
        @click="toggle"
      ></i>
      <div class="his-module his-small" v-show="isExpand">
        <suite
          :brxz="formData.brxz"
          :yfsbObj="yfsbObj"
          :officeCode="formData.officeCode"
          :allowSgfCy="allowSgfCy"
          @loadedSuite="pushSuite"
        />
      </div>
    </div> -->

    <!-- 新建病人档案 -->
		<add-patient ref="add-patient" @getBrxzList="getBrxzList" @getPatientInfo="getPatientInfo"/>

    <!-- 单据选择 -->
    <bill-select
      ref="bill-select"
      :formData="formData"
      :tableData3="tableData3"
      :now="now"
      :defaultDay="defaultDay"
      @selectedGh="selectGh"
      @queryDj="queryDj"
      @getTableData1="getTableData1"
      @updateMultiple="updateMultiple"
    />

    <!--  结算窗口 -->
    <op-settlement
      ref="op-settlement"
      :settleInfo="formData"
      :djInfo="tableData1"
      :opBrzd="opBrzd"
      :isEcQrcode="isEcQrcode"
      :mxsave="mxsave"
      :defaultDay="defaultDay"
      @resetForm="resetForm"
      @settled="reloadPrev"
      @checkMultiple="checkMultiple"
    />

    <invoice-void
      :fphm1="fphm1"
      :patientInfo="fphmInfo"
      :djDetails="djDetails"
      :isVoid="true"
      :key="ivKeyIndex"
      @closed="closeVoidDialog"
      ref="invoice-void"
    />
    <invoiceVoidInput @queriedFphm="queryDjDetails" ref="invoiceVoidInput" />
    <invoice-copy :patientInfo="formData" @copied="pushInvoiceCopy" ref="invoice-copy"/>
    <invoice-edit :fphm="formData.fphm" @edited="getNotesNumber" ref="invoice-edit"/>

    <!-- <pre class="t2">{{patientGhksInfo}}<br>{{formData}}</pre> -->
    <!-- <pre class="t1">{{tableData1}}</pre> -->
    <!-- <pre class="t2">{{tableData1Clone}}</pre> -->
    <!-- <pre class="t2">{{tableData2}}</pre> -->
    <!-- <pre class="t2">{{curRow1}}</pre> -->
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  aGetNotesNumber, aQueryDj, aFindKsdmByYsdm, aVerificationWpjfbz, aGetYfsb, aCheckInventory, aQueryJsZtInfo, aSaveSettle, aQueryOfficeCode
} from '@/api/his/op/reg/settlement.ts'
import {
	aQueryPatientInfo, aQuerySjBrxz
} from '@/api/his/op/reg/registerManage.ts'
import {
  aDocSchList, aDeptList, aDeptDocList,getDcoList
} from '@/api/his/op/reg/docSchedule.ts'
import {
  aLoadMedcineSet, aLoadProjectSet
} from '@/api/his/op/reg/settlement.ts'
import { getPubpc } from '@/api/cis/op/dctwork/examineSuite'
import { getPayProp } from '@/api/cis/op/dctwork/recipe'
import { getNow, getParams } from '@/api/his/basic'
import { parseTime } from '@/utils'
import { aQueryDjDetails } from '@/api/his/op/reg/settlement.ts'
import { aReadMedAcc } from '@/api/his/basic'

import suite from './components/suite.vue'
import addPatient from '@/components/addPatient/index.vue'
import billSelect from './components/billSelect.vue'
import opSettlement from './components/opSettlement.vue'
import invoiceVoid from './components/invoiceVoid.vue'
import invoiceVoidInput from './components/invoiceVoidInput.vue'
import invoiceCopy from './components/invoiceCopy.vue'
import invoiceEdit from './components/invoiceEdit.vue'
import prevRecord from './components/prevRecord.vue'
import { getFloat, mul } from '@/utils'

//声明接口
declare interface pageList {
  id: number
}

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'chargeSettlement1-1',
  components: {
    suite,
    addPatient,
    billSelect,
    opSettlement,
    invoiceVoid,
    invoiceVoidInput,
    invoiceCopy,
    invoiceEdit,
    prevRecord
  },
  filters: {
    filterCflx(cflx: number) {
      var cflxText: string = ''
      switch (cflx) {
        case 1: // 西
          cflxText = '西'
          break
        case 2: // 成
          cflxText = '成'
          break
        case 3: // 草
          cflxText = '草'
          break
        case 0: // 检
          cflxText = '检'
          break
      }
      return cflxText
    },
  }
})
export default class extends Vue {
  //声明变量，方法
  private isExpand: boolean = false // 侧边是否展开
  private tableData1: any[] = [] // 处方、检查表格
  private tableData1Clone: any[] = [] // 用于和原数据对比
  private tableData2: any[] = [] // 费用表格
  private tableData3: any[] = [] // 单据表格（弹窗）
  private curRow1: any = {} // 当前行
  private searchUrl: string = '' // 药品、检查搜索的接口地址
  private searchUrlName: string = '' // 搜索接口地址
  private searchData: any = { // 处方、检查搜索参数
    yp: { // 药品、检查
      cflx: '',
      pydm: '',
      yfsb: '',
      showGb: 1
    },
    zt: { // 药品组套、检查组套
      ztlb: '',
      pydm: '',
      ksdm: '',
      // yfsb: '',
      // showGb: 1
    }
  }
  private zdlbList = [
    {
      value:1,
      label:'西医',
      disabled:false
    },
    {
      value:2,
      label:'中医',
      disabled:false
    }
  ]
  private keyIndex: number = 0 // 用key值更新子组件
  private yfsbObj: any = {} // 药房识别
	private listSlotHeight: number = 0
  private loading: boolean = false
  private formData: any = {
    jzkh: '',
    brxm: '',
    zdlb:'',
    brxz: '',
    fphm: '',
    jzlsh: '',
    ghks: '',
    ysdm: '',
    zdxh: '',
    jbmc:'',
    brid: '', // hidden
    ghgl: '', // 挂号关联 hidden
    officeCode: '', // 门诊科室 hidden
    isYb: 0, // 是否为医保，0是，1否 hidden
    cardid: '', // 医保卡id
    cardtype: '', // 医保卡类型
    accountattr: '', // 账户标识
  }
  private jzlsh: string = '' // 就诊流水号（科室选择其实是选择某一次就诊）
  private patientGhksInfo: any = {} // 选中的科室信息
  private formRule: any = {}
  private brxzList: any[] = [] // 收费性质
  private deptListToday: any[] = [] // 当天排班的挂号科室
  private patientDeptList: any[] = [] // 当前病人所挂科室列表（科室下拉选项）
  private patientDeptList1: any[] = [] // 当前病人所挂科室列表（科室下拉选项）
  // private deptListAll: any[] = this.$store.state.webSqlDict.REGISTERATION_DEPARTMENT_DICT // 所有挂号科室
  private deptListAll: any[] = [] // 所有挂号科室（带门诊科室）
  private docList: any[] = [] // 医生列表
  private docList1: any[] = [] // 医生列表
  private opBrzd :any = {}
  private opBrzd1 :any = {}
  private docListLoading: boolean = false
  // private docList1: any[] = this.$store.state.webSqlDict.TABLE_DOCTOR_DICT // 医生列表
  private now: any = '' // 当前时间字符串
  private curAmpm: number = 1 // 上下午
  private resultHeader: any[] = [
    {prop: 'ypmc', label: '药品名称'}, // v
    {prop: 'yfgg', label: '规格'}, // v
    {prop: 'yfdw', label: '单位'}, // v
    // {prop: 'fygb', label: '归并'}, // v
    {prop: 'cdmc', label: '产地名称'},
    {prop: 'lsjg', label: '单价'}, // v
    {prop: 'ypsl', label: '药品库存'},
  ]
  private resultHeader1: any = {
    yp: [
      {prop: 'fymc', label: '项目名称'}, // v
      {prop: 'fydw', label: '次'}, // v
      {prop: 'fydj', label: '价格'}, // v
      // {prop: 'fygb', label: '归并'}, // v
      // {prop: 'cdmc', label: '产地名称'},
      // {prop: 'lsjg', label: '单价'}, // v
      // {prop: 'ypsl', label: '药品库存'},
    ],
    zt: [
      {prop: 'ztmc', label: '药品名称'}
    ]
  }
  private mxsave: boolean = false // 保存标识(处方列表是否有改动)
  private removeCfsb: any[] = [] // 从预保存里删除的处方识别（字符串）
  private removeData: any[] = [] // 从预保存里删除的处方（对象）
  private lastYpzhSort: number = 0 // 最后的药品组号
  private existDocCf: boolean = false // 是否存在医生开的处方/医技

  // 发票作废子组件
  private fphm1: string = ''
  private fphmInfo: any = {}
  private djDetails: any = []
  private ivKeyIndex: number = 1

  // 默认天数
  private defaultDay: any = ''
  private fygbList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.COST_CONSOLIDATION : this.$store.state.webSqlDict.COST_CONSOLIDATION

  // 上一条记录
  private keyPrev: number = 0

  private prevJzkh: string = '' // 上一次查询的卡号

  // 是否可以录入手工方
  private allowSgfXy: boolean = false
  private allowSgfZy: boolean = false
  private allowSgfCy: boolean = false

  private isRead: number = 0 // 是否已读卡
  private isEcQrcode: boolean = false // 是否为电子凭证

  private isMultiple: boolean = false // 是否有多个单据

  public setValue(value: string) {
    this.setValue(value)
  }
  public getValue() {
    return null
  }
  //监听方法
  @Watch('tableData1',{deep:true})
	private onValueChange(value: any[]) {
    // this.loading = false
    this.createTable2()
    
  }
  @Watch('formData.zdlb',{deep:true})
  private zdlbChange(value:any){
    if(value===1){
      this.searchUrl = '/system-service/dicjbbm/westQueryPage'
    }else if(value===2){
      this.searchUrl = '/system-service/diczyjb/zyPage'
    }
  }
  get amount(){
    let amount = 0
    this.tableData2.forEach((item: any) => {
      amount = getFloat((mul(amount, 100) + mul(item.je, 100))/100  ,  2)
    })
    return amount
  }
  //自负
  get zfAmount(){
    let zfAmount = 0
    this.tableData2.forEach((item: any) => {
      zfAmount = getFloat((mul(zfAmount, 100) + mul(item.zfje, 100))/100  ,  2)
    })
    return zfAmount
  }
  private closePop(){
    ;(this.$refs.searchFm as any).selectBlur()
  }
  // 方名
  private remoteMethod(query: string) {
    if (query.length > 1) {
      this.$nextTick(() => {
        ;(this.$refs.searchFm as any).remoteMethod(query)
      })
    } else {
      ;(this.$refs.searchFm as any).closePopover()
    }
  }
  private setDataFmOrJf(row:any){
    this.formData.zdmc = row.jbmc
    this.opBrzd1 = {
      zdxh:row.jbxh,
      zdmc:row.jbmc,
      fyks:row.fyks,
      // cflx:1:西医 2中医,
      icd10:row.icd10,
    }
    console.log(this.opBrzd1,99987)
    // this.formData.icd10 = row.icdCode
  }
  // 卡号获取焦点
	private focusJzkh(){
		const inputJzkh: any = this.$refs.inputJzkh
		inputJzkh.focus()
	}

  // 保留n位小数
	private useGetFloat(num: any, n: number){
		return getFloat(num, n)
	}
  // private getFloatNum(num:any){
  //   return getFloat(mul(num, 100),  2)
  // }
  private getFloatNum(num:any) {
     var result = parseFloat(num);
     if (isNaN(result)) {
      return '';
     }
     result = Math.round(num * 100) / 100;
     var s_x = result.toString();
     var pos_decimal = s_x.indexOf('.');
     if (pos_decimal < 0) {
       pos_decimal = s_x.length;
       s_x += '.';
     }
     while (s_x.length <= pos_decimal + 2) {
      s_x += '0';
     }
     return s_x;
  }
  // 获取当前时间
  private getTime(){
    getNow().then((res: any) => {
      if(res){
        this.now = parseTime(res.data, '{y}-{m}-{d}')
        var curHour = parseTime(res.data, '{h}')
        if(Number(curHour) < 12){
          this.curAmpm = 1
        }else{
          this.curAmpm = 2
        }
        // this.getDeptListToday() // 不需要，只查询该病人一段时间内所挂科室
      }
    })
  }

  // 获取系统参数
  private getDefaultDay(){
    getParams({commons: ['CFXQ']}).then((res: any) => {
      if(res){
        this.defaultDay = res.data.CFXQ
      }
    })
    getParams({commons: ['XYSGF','ZCYSGF','CYSGF']}).then((res: any) => {
      if(res){
        // 0关闭，1开启
        this.allowSgfXy = res.data.XYSGF==1?true:false
        this.allowSgfZy = res.data.ZCYSGF==1?true:false
        this.allowSgfCy = res.data.CYSGF==1?true:false

        // this.allowSgfXy = true
        // this.allowSgfZy = true
        // this.allowSgfCy = true
      }
    })
  }

  // 获取所有挂号科室
  private getDeptListAll(){
    aQueryOfficeCode().then((res: any) => {
      if(res){
        this.deptListAll = res.data
      }
    })
  }

  // 获取发票号码
  private getNotesNumber(){
    aGetNotesNumber().then((res: any) => {
      if(res){
        this.formData.fphm = res.data
      }
    })
  }

  // 卡号回车
  private jzkhEnter(){
    if(this.isEcQrcode){
      this.readCard('3')
    }else if(this.formData.jzkh.length == 28){
      this.readCard('0')
    }else{
      this.isRead = 0
			this.getPatientInfo()
    }
    const inputJzkh: any = this.$refs.inputJzkh
		inputJzkh.blur()
  }

  // 读卡
	private readCard(cardtype: any){
    let params = {
      cardtype: cardtype,
      carddata: this.formData.jzkh||' '
    }
		aReadMedAcc(params).then((res: any) => {
			if(res){
				this.formData.jzkh = res.data.jzkh
				this.isRead = 1
				this.formData.cardid = res.data.ecToken
				this.formData.cardtype = res.data.cardtype
				this.formData.accountattr = res.data.accountattr
				this.getPatientInfo()
			}
		})
  }
  
  // 改变病人性质
  private changeBrxz(value: any){
    aQuerySjBrxz({ brxz: value }).then((res: any) => {
      if(res){
        this.formData.isYb = res.data == '6021' ? 1 : 0
      }
    })
  }
  private resetQuery(){
    this.formData.brxm = ''
    this.formData.brxz = ''
    this.formData.jzlsh = ''
    this.formData.ysdm = ''
    this.formData.zdlb = ''
    this.formData.jbmc = ''
  }
  // 根据卡号查询病人信息
	private async getPatientInfo(){
		if(this.formData.jzkh==''){}else{
      let params = {
        jzkh: this.formData.jzkh,
        useBy: 'charges',
        isRead: this.isRead
      }
      const res: any = await aQueryPatientInfo(params)
      if(res.errorCode=='SUCCESS'){
        if(res.data == null){
          this.$notify({
            title: '该卡号不存在',
            message: '',
            type: 'error'
          })
          this.resetQuery()
        }else{

          // 清空其他数据↓↓↓↓↓
          this.tableData1 = []
          this.tableData1Clone = []
          this.tableData2 = []
          this.tableData3 = []
          this.curRow1 = {}
          this.opBrzd = {}
          this.opBrzd1 = {}
          this.removeCfsb = []
          this.removeData = []
          this.lastYpzhSort = 0
          this.existDocCf = false
          this.resetQuery()
          // 清空其他数据↑↑↑↑↑
          const res1: any = await aQuerySjBrxz({brxz: res.data.brxz})
          this.formData.isYb = res1.data=='6021'?1:0
					// 医保卡
					if(res1.data == '6021' && this.isRead == 0){
						this.$notify({
							title: '病人卡片是医保卡,不能查询!',
							message: '',
							type: 'warning'
						})
					}else{
            
            // status：1挂失，2注销，3失效
						if(res.data.status == 1){
							this.$notify({
								title: '此卡已挂失',
								message: '',
								type: 'error',
							})
						}else if(res.data.status == 2){
							this.$notify({
								title: '此卡已注销',
								message: '',
								type: 'error',
							})
						}else if(res.data.status == 3){
							this.$notify({
								title: '此卡已失效',
								message: '',
								type: 'error',
							})
            }else{ // 查询病人信息
              if(res.data.ghgl){
                this.formData.brxz = res.data.brxz
                this.formData.brxm = res.data.brxm
                this.formData.brxb = res.data.brxb
                this.formData.age = res.data.age
                this.formData.brid = res.data.brid
                // this.formData.ghks = res.data.ghks
                // this.formData.ghgl = res.data.ghgl

                this.patientDeptList = res.data.msGhInfo
                this.patientDeptList1 = [...this.patientDeptList]
                this.patientGhksInfo = this.patientDeptList[0] // 默认第一条
                this.formData.jzlsh = this.patientGhksInfo.jzlsh
                this.formData.ghks = this.patientGhksInfo.ksdm
                this.formData.zdlb = this.patientGhksInfo.zdlx
                this.formData.ysdm = this.patientGhksInfo.ysdm
                this.formData.ghgl = this.patientGhksInfo.ghgl

                this.prevJzkh = res.data.jzkh

                // this.deptList() // 处理科室下拉框
                this.matchOfficeCode() // 匹配门诊科室
                this.queryDj(this.defaultDay) // 查询处方单据
                // this.getYfsb()
                //原来逻辑
                this.changeGhks()
              }else{
                this.$notify({
                  title: '未挂号病人不能收费，请先挂号',
                  message: '',
                  type: 'error'
                })
              }
            }

          }

        }
      }
      
      if(res.errorCode=='ERROR_SHYB_0019'){
			// else{
				this.$notify({
					title: res.message,
					message: '',
					type: 'warning'
				})
				this.resetForm()
			}


		}
  }

  // 获取当日排班科室
  private getDeptListToday(){
    let params = {
      ghrq: this.now,
      zblb: this.curAmpm
    }
    aDeptList(params).then((res: any) => {
      if(res){
        this.deptListToday = res.data
        // 过滤科室下拉框
        let deptListTodayId: any = []
        this.deptListToday.forEach((item: any)=>{
          deptListTodayId.push(Number(item.ghks))
        })
        this.deptListAll.forEach((item: any)=>{
          if(!deptListTodayId.includes(item.ghks)){
            this.$set(item, 'disabled', true)
          }
        })
        this.getDocList() // 此时获取到所有排班医生
      }
    })
  }

  // 获取该病人所挂科室
  private getPatientDept(){
    // this.patientDept = 
  }

  // 获取科室医生列表
  private getDocList(){
    this.docListLoading = true
    let params = {
      ksdm: this.formData.ghks
    }
    getDcoList(params).then((res: any) => {
      if(res){
        this.docList = res.data
        this.docList1 = [...this.docList]
        this.docListLoading = false
      }
    })
  }

  // 选择完单据，使父组件切换科室
  private selectGh(cfFirst: any, cfAll: any){
    this.formData.jzlsh = cfFirst.jzlsh
    // this.formData.ysdm = cfFirst.kdys // 此时医生字段取开单医生（可能异步）

    // 判断是否存在医生开的处方
    for(let i of cfAll){
      if(i==null){
        console.log('意外的错误，请检查就诊流水号是否正常');
      }
      if(i.djly == 1){
        this.existDocCf = true
        break
      }
    }

    this.changeGhks(cfFirst.kdys,cfFirst) // 可能报错 'jzlsh' of undefined
  }
  //科室失去焦点
  private ksPatientDept(){
    this.patientDeptList1 = this.patientDeptList
  }
  //失去焦点还原
  private ysDocList(){
    this.docList1 = this.docList
  }
  private changeDoc(){
    (this.$refs.ysxm as any).focus() 
  }
  //过滤医生
  private searchDoc(value: any){
    this.docList1 = this.docList.filter((item: any) => {
      return item.pydm.indexOf(value.toUpperCase()) > -1
    })
  }
  // 过滤科室
  private searchKsdm(value: any) {
    // 总是从原数组中过滤
    this.patientDeptList1 = this.patientDeptList.filter((item: any) => {
      return item.pyCode.indexOf(value.toUpperCase()) > -1
    })
  }
  // 切换科室
  private changeGhks(ysdm?: any,changeGhks?:any){
    // 给formData.ghks等赋值
    // 根据选择的就诊流水号匹配挂号信息
    let index = this.patientDeptList.findIndex((item: any)=>{
      return item.jzlsh == this.formData.jzlsh
    })
    // 选择收费单据时可以选择n天前的，而挂号信息只显示1天的（24小时，默认系统参数）
    // 所以index有可能是-1
    this.patientGhksInfo = this.patientDeptList[index]
    this.formData.brxz = this.patientGhksInfo.brxz
    this.formData.jzlsh = this.patientGhksInfo.jzlsh
    this.formData.ghks = this.patientGhksInfo.ksdm
    this.formData.zdlb = this.patientGhksInfo.zdlx
    this.formData.jbmc = this.patientGhksInfo.zdmc
    // this.formData.ysdm = this.patientGhksInfo.ysdm
    this.formData.ghgl = this.patientGhksInfo.ghgl
    this.formData.zdxh = this.patientGhksInfo.zdxh
    if(ysdm!=null){
      this.formData.ysdm = ysdm
    }else{
      this.formData.ysdm = this.patientGhksInfo.ysdm
    }
    if(this.patientGhksInfo.kslb == 0){
      this.$set(this.zdlbList[1],'disabled',true)
    }else{
      this.$set(this.zdlbList[1],'disabled',false)
    }
    
    this.getYfsb()
    this.getDocList()
    this.matchOfficeCode()
    this.changeBrxz(this.formData.brxz) // 切换病人性质后查询上级病人性质，改变isYb

    this.searchData.zt.ksdm = this.formData.ghks
    this.$nextTick(()=>{
       (this.$refs.ghks as any).blur() 
    })
  }

  // 根据挂号科室获取对应的门诊科室
  private matchOfficeCode(){
    for(let i of this.deptListAll){
      if(i.ghks == this.formData.ghks){
        this.formData.officeCode = i.officeCode
        break
      }
    }
  }

  // 单据查询
  private queryDj(day: any,num?:any){
    let params = {
      brid: this.formData.brid,
      jzkh: this.formData.jzkh,
      cnds: day
    }
    aQueryDj(params).then((res: any) => {
      if(res){
        this.tableData3 = res.data.listDj
        this.tableData3.forEach((item: any, index: number)=>{
          this.$set(item, 'index', index)
        })
        // this.selectBill()
        //新逻辑
        if(this.tableData3.length){ // 如果存在单据，打开单据选择弹窗
          this.selectBill()
        }else{
          this.$notify({
            title: '该病人暂无收费项目',
            message: '',
            type: 'warning'
          })
          this.closeSelectBill()
          if(num){
            this.resetForm()
          }
          // this.resetForm()
          return 
        }
        // tableData3是否有数据，都执行数组转换
        const bs: any = this.$refs['bill-select']
        this.$nextTick(()=>{
          bs.transformDj()
        })
        // this.formData.zdxh = res.data.zdxh
      }
    })
  }

  // 打开单据选择
  private selectBill(){
    const bs: any = this.$refs['bill-select']
    bs.openDialog()
  }
  //关闭单据
  private closeSelectBill(){
    const bs: any = this.$refs['bill-select']
    bs.cancelDialog()
  }
  // 获取处方表格
  private getTableData1(data: any){
    this.tableData1 = data
    let arrCfsb: any = [] // 处方识别组成的数组

    if(data.length){
      this.tableData1.forEach((item: any)=>{
        // 计算划价金额
        if(item.cflx!=3){
          item.hjje = getFloat(mul(item.ypdj, item.ypsl), 2)
        }else{
          item.hjje = getFloat( mul(mul(item.ypdj, item.ypsl), item.cfts)  , 2)
        }

        // 归类相同的处方识别，设置处方内头条标记
        if(!arrCfsb.includes(item.cfsb)){
          arrCfsb.push(item.cfsb)
          this.$set(item, 'cfFirst', true)
        }else{
          
        }
      })
      this.lastYpzhSort = this.tableData1[this.tableData1.length-1].ypzhSort
    }else{
      this.lastYpzhSort = 0
    }

    this.tableData1Clone = JSON.parse(JSON.stringify(this.tableData1))
    
    this.keyIndex++
    this.curRow1 = {} // 清空当前行
    // aFindKsdmByYsdm().then((res: any) => {
    //   if(res){
        
    //   }
    // })
  }

  // bs更新连续结算
  private updateMultiple(isMultiple: boolean){
    this.isMultiple = isMultiple
  }

  // os结算完是否继续结算
  private checkMultiple(jzkh: any, cardtype: any){
    if(this.isMultiple && jzkh){
      this.formData.jzkh = jzkh
      if(cardtype != ''){
        this.readCard(cardtype)
      }else{
        this.getPatientInfo()
      }
      
    }
  }

  // 增加索引
  private tableRowClassName({ row, rowIndex }: any) {
    this.$set(row, 'index', rowIndex)
  }

  // 增加处方空行（新增处方）
  private addCf(cflx: number){
    if(!this.formData.brid){
      this.$notify({
        title: '请先调入患者信息',
        message: '',
        type: 'warning'
      })
      return false
    }
    if(this.formData.ysdm==null){
      this.$notify({
        title: '请选择开单医生',
        message: '',
        type: 'warning'
      })
      return false
    }
    if(!this.formData.jbmc){
      this.$notify({
        title: '请选择诊断名称',
        message: '',
        type: 'warning'
      })
      return false
    }
    // 是否有空行
    if(this.tableData1.length && !this.tableData1[this.tableData1.length-1].ypxh){
      return false
    }
    var cflxText
    switch (cflx) {
      case 1: // 西
        cflxText = '西'
        break
      case 2: // 成
        cflxText = '成'
        break
      case 3: // 草
        cflxText = '草'
        break
      case 0: // 检
        cflxText = '检'
        break
    }
    var cfts
    if(cflx == 3){
      cfts = ''
    }else{
      cfts = 1
    }
    this.lastYpzhSort++
    this.tableData1.push({
      cflx: cflx,
      cfNew: cflxText,
      cfts: cfts, // 处方贴数
      djly: 6,
      ypmc: '', // 名称 v
      yfdw: '', // 单位 v
      fygb: '', // 归并 v
      yfgg: '', // 规格 v
      ypdj: '', // 单价 v
      yfbz: '', // 药房包装
      ypcd: '', // 药品产地
      ypxh: '', // 药品序号
      ypsl: 1, // 所需数量
      hjje: '', // 
      ypyf: '', // 频次
      zkbl: '', // 折扣比例
      zhje: '', // 折后金额
      zfbl: '', // 自负比例
      yfsb: '', // 药房识别
      xmlx:'',
      fyks:'',
      mrcs: 1, // 每日次数
      ksdm: this.formData.officeCode,
      ysdm: this.formData.ysdm,
      ypzhSort: this.lastYpzhSort,
      cfFirst: true,
      opStatus: 'create'
    })
  }

  // 获取挂号科室对应的药房
  private getYfsb(){
    aGetYfsb({pkey: this.formData.ghks}).then((res: any) => {
      if(res){
        this.yfsbObj = res.data
      }
    })
  }

  // 获取当前行
  private getCurRow(row: any){
    this.curRow1 = row
    // 获取处方类型
    this.searchData.yp.cflx = this.curRow1.cflx
    this.searchData.zt.ztlb = this.curRow1.cflx
    if(this.curRow1.cflx == 0){
      this.searchUrlName = 'mzys_fj' // 检查、检查组套
    }else{ 
      this.searchUrlName = 'mzys_cf' // 药品、药品组套
    }

    // 根据处方类型获取药房识别
    var yfsb: any = ''
    switch (this.curRow1.cflx) {
      case 1: // 西
        yfsb = this.yfsbObj.xy
        break
      case 2: // 成
        yfsb = this.yfsbObj.zy
        break
      case 3: // 草
        yfsb = this.yfsbObj.cy
        break
      case 0: // 检
        yfsb = this.yfsbObj.ztlb
        break
      default:
        yfsb = this.yfsbObj.xy
        break
    }
    this.searchData.yp.yfsb = yfsb
    this.searchData.zt.yfsb = yfsb
    this.curRow1.yfsb = yfsb
  }

  // 选取
  private getInfo(data: any, row: any){
   if(!data.cfsb){
    row.jzxh = this.formData.ghgl
    row.zxks = data.fyks
    row.xmlx = data.xmlx
    row.fygb = data.fygb
   }
    if(data.fymc){ // 搜单品
      row.ypmc = data.fymc
      row.ypxh = data.fyxh
      // row.ypcd = data.ypcd
      row.ypcd = ''
      row.yfdw = data.fydw
      row.fygb = data.fygb
      // row.gbmc = data.mcsx
      // row.yfgg = data.yfgg
      row.yfgg = ''
      row.ypdj = data.fydj
      // row.yfbz = data.yfbz
      row.yfbz = ''
      row.xmlx = data.xmlx
      row.fyks = data.fyks
      let params = {
        brxz: this.formData.brxz,
        fygb: row.fygb,
        // fyxh: data.ypxh,
        fyxh: data.fyxh,
        type: row.cflx
      }
      // 获取自负比例
      getPayProp(params).then((res: any) => {
        if(res){
          row.zfbl = res.data
          // if(row.cflx != 0){
          //   this.checkInventory(row)
          // }
          this.changeQuantity(1) // 默认数量1，计算划价金额
        }
      })
    }else{ // 搜组套
      let params = {
        brxz: this.formData.brxz,
        pharmacyId: this.curRow1.yfsb, // 药房id
        ypxh: data.ztbh, // 药品序号
        ztbh: data.ztbh, // 组套编号
      }
      aLoadMedcineSet(params).then((res: any) => {
        if(res){
          // this.$emit('loadedSuite', res.data, data.data.YS_MZ_ZT01_ZTLB)
          this.pushSuite(res.data, this.curRow1.cflx)
        }
      })
    }
    
  }

  // 校验库存信息
  private checkInventory(row: any){
    let params = {
      lsjg: row.ypdj, // 零售价格
      medId: row.ypxh, // 药品id
      medsource: row.ypcd, // 药品产地
      pharmId: row.yfsb, // 药房识别
      quantity: row.ypsl, // 所需数量
      ypmc: row.ypmc // 药品名称
    }
    aCheckInventory(params).then((res: any) => {
      if(res){
        if(res.data.sign == -1){
          this.$notify({
            title: params.ypmc+'药品库存不足',
            message: `${params.ypmc}库存不足，库存数量：${res.data.kczl}，所需数量：${params.quantity}`,
            type: 'error'
          })
        }
      }
    })
  }

  // 每日次数
  private a(value: any){
    getPubpc({pcbm: value}).then((res: any) => {
      if(res){
        
      }
    })
  }

  // 更改所需数量
  private changeQuantity(value: any){
    if(this.curRow1.cflx != 0){
      this.checkInventory(this.curRow1)
    }
    // 计算划价金额
    if(this.curRow1.cflx!=3){
      this.curRow1.hjje = getFloat(mul(this.curRow1.ypdj, value), 2)
    }else{
      this.curRow1.hjje = getFloat(  mul(mul(this.curRow1.ypdj, value), this.curRow1.cfts), 2)
    }
    this.calcZhje1()
  }

  // 计算折后金额
  private calcZhje1(){
    if(this.curRow1.zkbl){
      if(this.curRow1.zfbl > 1){
        // this.curRow1.zhje = this.curRow1.hjje * this.curRow1.zfbl * this.curRow1.zkbl
        this.curRow1.zhje = mul(mul(this.curRow1.hjje, this.curRow1.zfbl), this.curRow1.zkbl)
      }else{
        this.curRow1.zhje = mul(this.curRow1.hjje, this.curRow1.zkbl)
      }
    }
  }
  //计算折扣比列
  private calcZkbl(val:any,index:any){
    console.log(val,66,this.tableData1[index])
    let tabIndex = this.tableData1[index]
    if(Number(val)>=Number(tabIndex.hjje)){
      this.tableData1[index].zhje = tabIndex.hjje
      this.tableData1[index].zkbl = 1
    }else{
      this.tableData1[index].zkbl = (Number(val)/Number(tabIndex.hjje)).toFixed(4)
    }

  }
  // 计算折后金额
  private calcZhje(val:any,index:any){
    // console.log(val,index)
    var reg = /(^[0-9]*(.[0-9]+)?)$/;
    if(!reg.test(val)){
      this.tableData1[index].zkbl = ''
    }
    if(val>1){
      this.tableData1[index].zkbl = 1
    }
    if(this.curRow1.zkbl){
      if(this.curRow1.zfbl > 1){
        // this.curRow1.zhje = this.curRow1.hjje * this.curRow1.zfbl * this.curRow1.zkbl
        this.curRow1.zhje = mul(mul(this.curRow1.hjje, this.curRow1.zfbl), this.curRow1.zkbl)
      }else{
        this.curRow1.zhje = mul(this.curRow1.hjje, this.curRow1.zkbl)
      }
    }else{
      this.curRow1.zhje = ''
    }
  }
  // 插入组套
  private pushSuite(suiteDetail: any, ztlb: number){
    suiteDetail.forEach((item: any)=>{
      this.$set(item, 'cflx', ztlb==4?0:ztlb)
      this.$set(item, 'cfNew', '检')
      this.$set(item, 'cfts', 1) // 处方帖数，先给1
      this.$set(item, 'djly', 6)
      this.$set(item, 'mrpc', 1)
      this.$set(item, 'ksdm', this.formData.officeCode)
      this.$set(item, 'ysdm', this.formData.ysdm)
    })
    this.tableData1.push(...suiteDetail)
  }

  // 插入单个
  private insert(){
    if(this.tableData1.filter(item=>!item.ypmc).length) return
    if(Object.keys(this.curRow1).length){
      var cfts
      if(this.curRow1.cflx == 3){
        cfts = ''
      }else{
        cfts = 1
      }
      let obj = {
        cflx: this.curRow1.cflx,
        cfts: cfts, // 处方贴数
        djly: 6,
        ypmc: '', // 名称 v
        yfdw: '', // 单位 v
        fygb: '', // 归并 v
        yfgg: '', // 规格 v
        ypdj: '', // 单价 v
        yfbz: '', // 药房包装
        ypcd: '', // 药品产地
        ypxh: '', // 药品序号
        ypsl: 1, // 所需数量
        hjje: '', // 
        ypyf: '', // 频次
        zkbl: '', // 折扣比例
        zhje: '', // 折后金额
        zfbl: '', // 自负比例
        yfsb: '', // 药房识别
        xmlx:'',
        fyks:'',
        mrcs: 1,
        ksdm: this.formData.officeCode,
        ysdm: this.formData.ysdm,
        ypzhSort: this.curRow1.ypzhSort,
        // cfFirst: true,
        opStatus: 'create'
        }
        this.tableData1.splice(this.curRow1.index+1, 0, obj)
    }
  }

  // 新组
  private createNewGroup(){
    if(this.tableData1.filter(item=>!item.ypmc).length) return
    if(Object.keys(this.curRow1).length){

      // 获取当前组
      let groupList = this.tableData1.filter((item: any) => item.ypzhSort == this.curRow1.ypzhSort)

      // 组内头条整表索引
      const startIndex = this.tableData1.findIndex((item: any) => item.ypzhSort == this.curRow1.ypzhSort)

      var cfts
      if(this.curRow1.cflx == 3){
        cfts = ''
      }else{
        cfts = 1
      }

      let obj = {
        cflx: this.curRow1.cflx,
        cfts: cfts, // 处方贴数
        djly: 6,
        ypmc: '', // 名称 v
        yfdw: '', // 单位 v
        fygb: '', // 归并 v
        yfgg: '', // 规格 v
        ypdj: '', // 单价 v
        yfbz: '', // 药房包装
        ypcd: '', // 药品产地
        ypxh: '', // 药品序号
        ypsl: 1, // 所需数量
        hjje: '', // 
        ypyf: '', // 频次
        zkbl: '', // 折扣比例
        zhje: '', // 折后金额
        zfbl: '', // 自负比例
        yfsb: '', // 药房识别
        mrcs: 1,
        ksdm: this.formData.officeCode,
        ysdm: this.formData.ysdm,
        ypzhSort: this.curRow1.ypzhSort+1,
        // cfFirst: true,
        opStatus: 'create'
        }
      this.tableData1.splice(startIndex+groupList.length, 0, obj)

      // 重新生成组号
      this.tableData1.forEach((item: any, index: number) => {
        if(index > startIndex+groupList.length){
          item.ypzhSort++
        }
      })

      this.lastYpzhSort++
    }
  }

  // 删除单个
  private deleteSingle(){
    if(Object.keys(this.curRow1).length){
      // 获取当前组
      let groupList = this.tableData1.filter((item: any) => item.ypzhSort == this.curRow1.ypzhSort)

      if(groupList.length > 1){ // 删除单个
        this.removeData.push(this.tableData1[this.curRow1.index])
        // let cfsb = {
        //   cfsb: this.tableData1[index].cfsb,
        //   cflx: this.tableData1[index].cflx,
        //   sbxh: this.tableData1[index].sbxh
        // }
        this.removeCfsb.push({cfsb: this.tableData1[this.curRow1.index].cfsb})
        this.tableData1.splice(this.curRow1.index, 1)
        this.curRow1 = {}
      }else{ // 删除整组
        this.deleteGroup()
      }
      
    }else{
      this.$notify({
        title: '没有可以删除的处方或检查',
        message: '',
        type: 'warning'
      })
    }
  }

  // 删除组
  private deleteGroup() {
    if(Object.keys(this.curRow1).length){
      // 获取组
      let groupList = this.tableData1.filter((item: any) => item.ypzhSort == this.curRow1.ypzhSort)
      // 组内头条整表索引
      const startIndex = this.tableData1.findIndex((item: any) => item.ypzhSort == this.curRow1.ypzhSort)
      // 删除组
      this.tableData1.splice(startIndex, groupList.length)
      // 重新生成组号
      this.tableData1.forEach((item: any, index: number) => {
        if(index >= startIndex){
          item.ypzhSort--
        }
      })

      this.lastYpzhSort--
      this.curRow1 = {}
      // this.removeData.push(this.tableData1[this.curRow1.index])
      // this.removeCfsb.push({cfsb: this.tableData1[this.curRow1.index].cfsb})
      
    }else{
      this.$notify({
        title: '没有可以删除的处方或检查',
        message: '',
        type: 'warning'
      })
    }
  }

  // 生成费用表格，根据相同的“费用归并”分组
  private createTable2(){
    this.tableData2 = []
    var fygb: any = [] // 归并类型
    for(let i of this.tableData1){
      if(fygb.includes(i.fygb)){
        let index = this.tableData2.findIndex((item)=>{
          return item.fygb == i.fygb
        })
        // 总金额 = 原总金额 + 当前划价金额
        // this.tableData2[index].je = parseFloat(this.tableData2[index].je) + parseFloat(i.hjje)
        this.tableData2[index].je = getFloat((mul(this.tableData2[index].je, 100) + mul(i.hjje, 100)) / 100, 2)

        // 总自负金额 = 原总自负金额 + 当前划价金额 * 自负比例
        // this.tableData2[index].zfje = this.tableData2[index].zfje + i.hjje * i.zfbl
        // this.tableData2[index].zfje = getFloat((mul(this.tableData2[index].zfje, 10000) + mul(mul(i.hjje, i.zfbl), 10000)) / 10000, 4)
        
        //上面是原有逻辑 现在增加折扣比例  单价
        this.tableData2[index].zfje = getFloat((mul(this.tableData2[index].zfje, 10000) + mul(mul(mul(i.hjje, i.zfbl), i.zkbl ? i.zkbl : 1), 10000)) / 10000, 4)
      }else{
        fygb.push(i.fygb)
        this.tableData2.push({
          xmmc: i.gbmc,
          je: i.hjje,
          zfje: getFloat(mul(mul(i.hjje, i.zfbl),i.zkbl ? i.zkbl : 1), 4),
          fygb: i.fygb
        })
      }
    }
  }

  // 打开建档弹窗
	private handleAdd(cardno: number){
		var ap: any = this.$refs['add-patient']
		ap.addDialog(cardno)
	}
  
  // 从子组件获取病人性质列表
	private getBrxzList(list: any){
    this.brxzList = list
	}

  // 展开/收起
  private toggle(){
    this.isExpand = !this.isExpand
  }

  // 打开结算窗口
  private handleOpenSettlement(){
    var reg = /(^[0-9]*(.[0-9]+)?)$/;
    if(this.formData.brid != ''){
      if(this.tableData1.length){
        for(let i of this.tableData1){
          if(i.ypmc==''){
            this.$notify({
              title: '请输入药品名称',
              message: '',
              type: 'warning'
            })
            return false
          }
          if(!reg.test(i.zkbl)){
            i.zkbl=''
          }
        }
        if(JSON.stringify(this.tableData1) != JSON.stringify(this.tableData1Clone)){
          this.mxsave = true
        }else{
          this.mxsave = false
        }
        for(let i of this.tableData1){
          this.$set(i, 'ypzhShow', i.ypzhSort)
          // 草药帖数
          if(i.cflx == 3 && i.cfts == ''){
            this.$notify({
              title: '第'+(i.index+1)+'行请输入草药帖数',
              message: '',
              type: 'warning'
            })
            return false
          }
          //新增 2021-08-02
          this.patientDeptList.map((item:any)=>{
            if(item.jzlsh==this.formData.jzlsh){
              if(!item.zdxh){
                this.opBrzd = {
                  zdxh:this.opBrzd1.zdxh,
                  zdmc:this.opBrzd1.zdmc,
                  jzxh:item.ghgl,
                  cflx:item.zdlx || this.formData.zdlb,
                  icd10:this.opBrzd1.icd10
                }
              }
            }
          })
        }
        const os: any = this.$refs['op-settlement']
        os.openDialog()
      }else{
        this.$notify({
          title: '没有可以结算的信息',
          message: '',
          type: 'warning'
        })
      }
      
    }else{
      this.$notify({
        title: '请先调入患者信息',
        message: '',
        type: 'warning'
      })
    }
    
  }

  // 结算成功后刷新上一条记录
  private reloadPrev(){
    this.keyPrev++
  }

  // getDetail
  private getDetail(){}

  // 条件查询
  private searchLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }

  // 发票复制弹窗
  private async handleCopyInvoice(){
    if(this.formData.jzkh==''||this.formData.brid==''){
      this.$notify({
        title: '请先调入患者信息',
        message: '',
        type: 'warning'
      })
      return false
    }

    if(this.formData.jzkh == this.prevJzkh){
      // 打开弹窗
      const ic: any = this.$refs['invoice-copy']
      ic.openDialog()
    }else{
      this.$notify({
        title: '就诊卡号发生变化，请重新调入患者信息',
        message: '',
        type: 'error'
      })
    }
  }

  // 加入发票复制的单据
  private pushInvoiceCopy(djDetails: any){
    this.tableData1 = djDetails
    this.keyIndex++
  }

  // 发票修改
  private handleEditInvoice(){
    const ie: any = this.$refs['invoice-edit']
		ie.openDialog()
  }

  // 预保存
  private preSave(){
    if(this.tableData1.length){
      for(let i of this.tableData1){
        if(i.ypmc==''){
          this.$notify({
            title: '请输入药品名称',
            message: '',
            type: 'warning'
          })
          return false
        }
      }
      if(JSON.stringify(this.tableData1) != JSON.stringify(this.tableData1Clone)){
        this.mxsave = true
      }else{
        this.mxsave = false
      }

      for(let i of this.tableData1){
        this.$set(i, 'ypzhShow', i.ypzhSort)
        // 草药帖数
        if(i.cflx == 3 && i.cfts == ''){
          this.$notify({
            title: '第'+(i.index+1)+'行请输入草药帖数',
            message: '',
            type: 'warning'
          })
          return false
        }
      }
      let params = {
        cardno: this.formData.jzkh, // 卡号
        fkhm: '', // 付款号码
        // fffs: this.formData.fkfs, //付费方式
        // issmk: '', // 结算类型，0窗口结算，1医生站结算，2自助机结算
        list: this.tableData1,
        mzxxReq: { // 门诊信息
          ...this.formData,
          // fkfs: this.formData.fkfs,
          fpzs: 0,
          jjzf: 0, // 统筹支出（赋给“其他应收”）
          mxsave: this.mxsave, // 是否录入手工方
          removeCfsb: this.removeCfsb, // 删除处方识别
          removeData: this.removeData // 删除的处方信息
        },
        pos: {},
        zzjQtysFlag: '', // 自助机其他应收标识
        zzjQtys: '', // 自助机其他应收
        zzjZfje: '', // 自助机自负金额
        zzjHbwc: '', //自助机货币误差

        ckbh: '', // 出库编号
        jsData: null,
      }
      aSaveSettle(params).then((res: any) => {
        if(res){
          this.$notify({
            title: '预保存成功',
            message: '',
            type: 'success'
          })
          this.resetForm()
        }
      })
    }else{
      this.$notify({
        title: '没有可以保存的信息',
        message: '',
        type: 'warning'
      })
    }
    
  }

  // 清空
	private resetForm(){
    this.getNotesNumber()
		const formData: any = this.$refs.formData
    formData.resetFields()
    this.patientGhksInfo = {}
    // this.initReg()
    this.tableData1 = []
    this.tableData1Clone = []
    this.tableData2 = []
    this.tableData3 = []
    this.curRow1 = {}

    this.removeCfsb = []
    this.removeData = []
    this.lastYpzhSort = 0
    this.existDocCf = false

    this.focusJzkh()
    this.isRead = 0
    this.isEcQrcode = false
  }

  // 输入enter切换焦点
  private focusNext(index: any, labelIndex: number) {
    if(this.existDocCf&&(!!this.curRow1.cflx&&this.curRow1.cflx!=0)) return
    if (this.$refs[`${index}-${labelIndex + 1}`]) {
      if ((this.$refs[`${index}-${labelIndex + 1}`] as any).disabled) {
        this.focusNext(index, labelIndex + 1)
      } else {
        ;(this.$refs[`${index}-${labelIndex}`] as any).blur()
        ;(this.$refs[`${index}-${labelIndex + 1}`] as any).focus()
      }
    } else {
      if (this.$refs[`${index + 1}-1`]) {
        if ((this.$refs[`${index + 1}-1`] as any).disabled) {
          this.focusNext(index + 1, 1)
        } else {
          ;(this.$refs[`${index}-${labelIndex}`] as any).blur()
          ;(this.$refs[`${index + 1}-1`] as any).focus()
        }
      } else {
        // this.tableData1 = [...this.tableData1, {}]
        this.addCf(this.curRow1.cflx)
        this.$nextTick(() => {
          if ((this.$refs[`${index + 1}-1`] as any).disabled) {
            this.focusNext(index + 1, 1)
          } else {
            ;(this.$refs[`${index}-${labelIndex}`] as any).blur()
            ;(this.$refs[`${index + 1}-1`] as any).focus()
          }
        })
      }
    }
  }
  
  // 发票作废子组件================
  // 打开发票号输入框弹窗
  private openVoidInputDialog(){
    const ivi: any = this.$refs.invoiceVoidInput
    ivi.openDialog()
  }

  // 关闭弹窗时触发
  private closeVoidDialog(){
    this.ivKeyIndex++
  }
  //f8快捷键 结算
  private handelKje(e: any){
    if (e.keyCode == 119) { 
      // 建档
      e.preventDefault()
      this.handleOpenSettlement()
    }
  }
  private readKey(e:any){
    if (e.keyCode == 122) { 
      // 建档
      e.preventDefault()
      this.readCard('1')
    }
  }
  // 查询明细
  private queryDjDetails(fphm: string, fphmInfo: any){
    this.fphm1 = fphm

    const iv: any = this.$refs['invoice-void']
    iv.openDialog()

    this.fphmInfo = fphmInfo.fpzfBrdaResp // 获取病人信息
    let params = {
      brxz: this.fphmInfo.brxz,
      fpcx: 0,
      zfblList: fphmInfo.resultList
    }
    aQueryDjDetails(params).then((res: any) => {
      if(res){
        this.djDetails = res.data
        this.$nextTick(()=>{
          const ivc: any = this.$refs['invoice-void']
          ivc.transform()
        })
        
      }
    })
  }
  // 发票作废子组件================

  //初始化的周期函数
	created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 134
    this.getNotesNumber()
    this.getTime()
    this.getDeptListAll()
    this.getDefaultDay()
  }
  mounted() {
    this.focusJzkh()
    // this.selectBill()
    // this.getLists()
    // aCurTime().then((res: any) => {
    //   if(res){
    //     console.log('当前时间');
    //     console.log(res.data);
    //   }
    // })
    addEventListener('keydown',this.handelKje)
    addEventListener('keydown',this.readKey)
	}
  beforeDestroy() {
    removeEventListener('keydown', this.handelKje)
    removeEventListener('keydown', this.readKey)
  }
}
</script>

<style lang="scss" scoped>
// 布局样式
.content{
  position: relative;
  display: flex;
}
.area{
  padding: 8px 10px;
  border-radius: 8px;
  background: #fff;
}
.left{
  width: calc(100% - 24px - 10px);
  display: flex;
  flex-direction: column;
  // transition: all .6s;
  &.is-shrink{
    // width: calc(75% - 10px);
  }
}
.right{
  position: absolute;
  z-index: 1;
  right: 10px;
  width: 24px;
  height: calc(100% - 10px);
  margin-left: 10px;
  // transition: all .6s;
  &.is-expand{
    width: 25%;
    box-shadow: -20px 20px 20px 0px rgba(0, 0, 0, 0.1);
  }
}
.upper{
  &.area{
    padding-bottom: 2px;
  }
}
.middle{
  margin-top: 10px;
}
.lower{
  flex-grow: 1;
  display: flex;
  margin-top: 10px;
  .lower-left{
    width: calc(70% - 10px);
    padding-bottom: 2px;
  }
  .lower-right{
    width: 30%;
    margin-left: 10px;
    .lower-right-upper{
      height: calc(65% - 10px);
    }
    .lower-right-lower{
      height: 35%;
      margin-top: 10px;
    }
  }
}

// 展开按钮
.expand-toggle{
  position: absolute;
  z-index: 1;
  top: 18px;
  left: 6px;
  font-size: 12px;
  color: $third;
  cursor: pointer;
}

// 重置his-module、his-small
.his-small{
  padding: 0;
}
.row{
  margin-bottom: 8px;
}

//四列表单
.form4{
	margin: 0!important;
  // 第一列30%，剩余三列均分70%
	.form-area{
		float: left;
    width: calc((70% - 18px*3)/3);
		margin-left: 18px;
		&:nth-child(4n+1){
      width: 30%;
			margin-left: 0;
    }
    &:nth-last-child(-n+3){
      .el-form-item{
        margin-bottom: 0!important;
      }
    }
    &.item-diagnose{
      width: calc((70% - 18px*3)/3*2 + 18px);
    }
	}
	.el-form-item{
		display: inline-block;
		width: 100%;
		margin-bottom: 8px!important;
		&.item-card{
			width: calc(100% - 80px - 8px);
      min-width: calc(60px + 140px);
			+.el-button{
        width: 80px;
				height: 28px;
				margin-left: 8px;
				padding: 0;
				justify-content: center;
        ::v-deep .icon{
          font-size: 16px;
        }
			}
		}
    &[hidden]{
			display: none;
		}
	}
}

// 隐藏禁用选项
.el-select-dropdown.hidden-option{
  .el-select-dropdown__item.is-disabled{
    display: none;
  }
}

.middle.area{
  padding: 10px;
}

.total{
  display: flex;
  align-items: center;
  margin-top: 8px;
  div{
    font-size: 13px;
    color: $first;
  }
  span{
    font-size: 16px;
    color: $blue;
    font-family: "siyuanMedium";
  }
}

// 侧边
.right.area{
  // position: relative;
  .small-radio-group{
    margin-bottom: 10px;
    .el-radio {
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
      ::v-deep .el-radio__label {
        padding-left: 4px;
        font-size: 13px;
      }
    }
  }
  .el-tabs{
    ::v-deep .el-tabs__header{
      margin-left: 30px;
    }
    ::v-deep .el-tabs__item{
      height: 32px;
      line-height: 32px;
    }
  }
}

// 色块
::v-deep .color-group .cell{
  padding: 0!important;
}
.orangeBack,
.greenBack {
	height: 32px;
	opacity: .3!important;
}

.greenBack {
	background: $green;
}

.orangeBack {
	background: $yellow;
}

.el-table ::v-deep td.is-right .cell{
  padding-right: 8px!important;
}

// 调试
pre{
  position: absolute;
  bottom: 0;
  height: 800px;
  font-size: 12px;
  overflow: auto;
  background: rgba($color: #fff, $alpha: .8);
  &.t1{
    right: 30px;
  }
  &.t2{
    right: 300px;
  }
}
::v-deep .remote-select-select-box{
  width:100% !important;
}
</style>