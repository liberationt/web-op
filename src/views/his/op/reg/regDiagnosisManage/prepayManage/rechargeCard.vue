<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col :span="17" class="ht">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <div class="searchTitle">搜索</div>
              <el-input
                v-model="searchData.cardno"
                :placeholder="'搜索卡号/姓名/身份证'"
                class="search"
                @change="searchLists"
              >
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input>
              <el-divider direction="vertical"></el-divider>
              <div class="btn">
                <el-button type="text" size="mini">
                  <i class="icon his-reading-card blue"></i>
                  <span>读卡</span>
                </el-button>
              </div>
            </div>
          </div>
          <pagenation-list
            ref="pageTable"
            v-model="tableData"
            data-url="/op-service/mpikpxx/doQueryCzkList"
            :search-data="searchData"
            http-method="post"
            :list-height="listSlotHeight"
          >
            <el-table
              slot="list"
              stripe
              ref="table"
              :highlight-current-row="true"
              :data="tableData"
              @row-click="getDetail"
              border
              v-loading="loading"
              :height="listSlotHeight"
              class="scroll-bar"
              tooltip-effect="light"
            >
              <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>

              <!-- 卡号 -->
              <el-table-column
                prop="cardno"
                :label="'卡号'"
                min-width="100"
              ></el-table-column>

              <!-- 卡类别 -->
              <el-table-column
                prop="cardtypecode"
                :label="'卡类别'"
                min-width="80"
              >
                <template slot-scope="scope">
                  <div v-if="cardTypeList.find(item => item.dv==scope.row.cardtypecode)">
                    {{cardTypeList.find(item => item.dv==scope.row.cardtypecode).dn}}
                  </div>
                  <div v-else>{{scope.row.cardtypecode}}</div>
                </template>
              </el-table-column>

              <!-- 姓名 -->
              <el-table-column
                prop="brxm"
                :label="$t('common.name')"
                min-width="70"
              ></el-table-column>

              <!-- 身份证 -->
              <!-- <el-table-column
                prop="idcard"
                :label="'身份证'"
                min-width="150"
              ></el-table-column> -->

              <!-- 登记时间 -->
              <el-table-column
                prop="fksj"
                :label="'登记时间'"
                min-width="140"
              ></el-table-column>

              <!-- 卡内余额 -->
              <el-table-column
                prop="knye"
                :label="'卡内余额'"
                width="80"
                class-name="text-blue-td"
                align="right"
              >
                <template slot-scope="scope">{{useGetFloat(scope.row.knye, 2)}}</template>
              </el-table-column>

              <!-- 卡状态 -->
              <el-table-column
                prop="status"
                :label="'卡状态'"
                min-width="60"
              >
                <template slot-scope="scope">
                  <div :class="scope.row.status|filterStatusColor">
                    {{scope.row.status|filterStatus}}
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('common.action')"
                width="120"
                align="center"
                fixed="right"
                class-name="action-btns"
              >
                <template slot-scope="scope">
                  <el-tooltip
                    :content="'挂失'"
                    effect="light"
                  >
                    <el-popconfirm
											:title="'确认挂失？'"
											:confirmButtonText="$t('common.confirm')"
											:cancelButtonText="$t('common.cancel')"
                      @confirm="saveRegloss(scope.row)"
											hideIcon
                    >
                      <el-button
                        slot="reference"
                        class="yellow"
                        :disabled="scope.row|filterDisableLock"
                      >
                        <i class="icon his-caozuo_guashi"></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                  <el-tooltip
                    :content="'解挂'"
                    effect="light"
                    class="ml10"
                  >
                    <el-popconfirm
											:title="'确认解挂？'"
											:confirmButtonText="$t('common.confirm')"
											:cancelButtonText="$t('common.cancel')"
                      @confirm="saveUnregloss(scope.row)"
											hideIcon
                    >
                      <el-button
                        slot="reference"
                        class="green"
                        :disabled="scope.row|filterDisableUnLock"
                      >
                        <i class="icon his-automated"></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                  <el-tooltip
                    :content="'注销'"
                    effect="light"
                    class="ml10"
                  >
                    <el-popconfirm
											:title="'确认注销？'"
											:confirmButtonText="$t('common.confirm')"
											:cancelButtonText="$t('common.cancel')"
                      @confirm="saveLogout(scope.row)"
											hideIcon
                    >
                      <el-button
                        slot="reference"
                        class="red"
                        :disabled="scope.row|filterDisableLogoff"
                      >
                        <i class="icon his-disabled"></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                  <!-- 操作记录 -->
                  <el-tooltip :content="'操作记录'" effect="light">
                    <span class="ml10">
                      <el-button
                        class="blue"
                        @click="getRecord(scope.row)"
                      >
                        <i class="icon his-detail"></i>
                      </el-button>
                    </span>
                    <!-- 0启用，1停用 -->
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col :span="7" class="ht">
        <div class="his-module his-small">
          <el-tabs v-model="activeName" class="tab-small underline">
            <!-- 登记 -->
            <el-tab-pane :label="'登记'" name="first">
              <div class="row">
                <div class="label">
                  <div class="btn">
                    <el-button
                      size="mini"
                      type="text"
                      @click="issuing"
                      :disabled="!formData1.brid||formData1.status!=0"
                    >
                      <i class="icon his-btn-save green"></i>保存
                    </el-button>
                    <el-button size="mini" type="text" @click="reset1">
                      <i class="icon his-btn-close red"></i>清空
                    </el-button>
                  </div>
                </div>
              </div>
              <el-form :model="formData1" :rules="formRule1" ref="formData1" label-width="76px" class="scroll-bar" :style="`height:${listSlotHeight2}px`">
                <!-- 卡号 -->
                <el-form-item :label="'卡号'" prop="cardno" class="after-btn">
                  <el-input
                    v-model="formData1.cardno"
                    :placeholder="'请输入卡号'"
                    @keyup.enter.native="queryDetail"
                  ></el-input>
                  <el-button
                    type="primary"
                    icon="icon his-reading-card"
                    class="blue-btn"
                  >读卡</el-button>
                </el-form-item>

                <!-- 卡类别 -->
                <el-form-item :label="'卡类别'" prop="cardtypecode" disabled>
                  <search-select
                    table-name="SYS_PRIMARY_DATA"
                    kid="PD0000000726"
                    v-model="formData1.cardtypecode"
                    :backfillValue="formData1.cardtypecode"
                    :placeholder="'卡类别'"
                    :disabled="true"
                    class="no-arrow"
                  />
                </el-form-item>

                <!-- 姓名 -->
                <el-form-item :label="'姓名'" prop="brxm"  disabled>
                  <el-input
                    v-model="formData1.brxm"
                    :placeholder="'姓名'"
                    :disabled="true"
                  ></el-input>
                </el-form-item>

                <!-- 身份证 -->
                <el-form-item :label="'身份证'" prop="idcard" disabled>
                  <el-input
                    v-model="formData1.idcard"
                    :placeholder="'身份证号'"
                    :disabled="true"
                  ></el-input>
                </el-form-item>

                <!--登记时间 -->
                <!-- <el-form-item :label="'登记时间'" prop="fksj">
                  <el-date-picker
                    v-model="formData1.fksj"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :placeholder="$t('emp.phDate')"
                    :disabled="false"
                  ></el-date-picker>
                </el-form-item> -->

                <!-- 卡状态 -->
                <el-form-item :label="'卡状态'" prop="status" disabled>
                  <el-select
                    v-model="formData1.status"
                    :placeholder="'卡状态'"
                    :disabled="true"
                    class="no-arrow"
                  >
                    <el-option
                      v-for="(item, value) in statusList"
                      :key="value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <!-- 病人id -->
                <el-form-item :label="'病人id'" prop="brid" hidden>
                  <el-input v-model="formData1.brid"></el-input>
                </el-form-item>

              </el-form>
            </el-tab-pane>

            <!-- 充值 -->
            <el-tab-pane :label="'充值'" name="second">
              <div class="row">
                <div class="label">
                  <div class="btn">
                    <!-- <el-button size="mini" type="text" @click="queryCard">
                      <i class="icon his-reading-card blue"></i>读卡
                    </el-button> -->
                    <el-button
                      size="mini"
                      type="text"
                      @click="saveRecharge"
                      :disabled="!formData2.brid||formData2.status!=0"
                    >
                      <i class="icon his-btn-charge green"></i>充值
                    </el-button>
                    <el-button size="mini" type="text" @click="reset2">
                      <i class="icon his-btn-close red"></i>清空
                    </el-button>
                  </div>
                </div>
              </div>
              <el-form :model="formData2" :rules="formRule2" ref="formData2" label-width="76px" class="scroll-bar" :style="`height:${listSlotHeight2}px`">
                <!-- 卡号 -->
                <el-form-item :label="'卡号'" prop="cardno" disabled>
                  <el-input
                    v-model="formData2.cardno"
                    :placeholder="'卡号'"
                    :disabled="true"
                  ></el-input>
                </el-form-item>

                <!-- 卡类别 -->
                <el-form-item :label="'卡类别'" prop="cardtypecode" disabled>
                  <search-select
                    table-name="SYS_PRIMARY_DATA"
                    kid="PD0000000726"
                    v-model="formData2.cardtypecode"
                    :backfillValue="formData2.cardtypecode"
                    :placeholder="'卡类别'"
                    :disabled="true"
                    class="no-arrow"
                  />
                </el-form-item>

                <!-- 姓名 -->
                <el-form-item :label="'姓名'" prop="brxm" disabled>
                  <el-input
                    v-model="formData2.brxm"
                    :placeholder="'姓名'"
                    :disabled="true"
                  ></el-input>
                </el-form-item>

                <!-- 身份证 -->
                <el-form-item :label="'身份证'" prop="idcard" disabled>
                  <el-input
                    v-model="formData2.idcard"
                    :placeholder="'身份证号'"
                    :disabled="true"
                  ></el-input>
                </el-form-item>

                <!--登记时间 -->
                <el-form-item :label="'登记时间'" prop="fksj" disabled>
                  <el-date-picker
                    v-model="formData2.fksj"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :placeholder="$t('emp.phDate')"
                    :disabled="true"
                    class="date-wrapper"
                  ></el-date-picker>
                </el-form-item>

                <!-- 卡状态 -->
                <el-form-item :label="'卡状态'" prop="status" disabled>
                  <el-select
                    v-model="formData2.status"
                    :placeholder="'卡状态'"
                    :disabled="true"
                    class="no-arrow"
                  >
                    <el-option
                      v-for="(item, value) in statusList"
                      :key="value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <!-- 卡内余额 -->
                <el-form-item :label="'卡内余额'" prop="knye" disabled>
                  <el-input
                    v-model="formData2.knye"
                    :placeholder="'卡内余额'"
                    :disabled="true"
                    class="text-blue"
                  ></el-input>
                </el-form-item>

                <!-- 充值金额 -->
                <el-form-item :label="'充值金额'" prop="czje">
                  <el-input
                    v-model="formData2.czje"
                    :placeholder="'充值金额'"
                    @change="calcCzhye"
                    class="text-blue"
                    oninput ="value=value.replace(/[^0-9.]/g,'')"
                  ></el-input>
                </el-form-item>

                <!-- 充值方式 -->
                <el-form-item :label="'充值方式'" prop="czfs">
                  <search-select
                    table-name="SYS_DICT_CONFIG"
                    kid="21"
                    v-model="formData2.czfs"
                    :backfillValue="formData2.czfs"
                    :placeholder="'付款方式'"
                    :clearable="false"
                  />
                </el-form-item>
                <!-- 充值收据号 -->
                <el-form-item :label="'充值收据号'" prop="pjhm" disabled>
                  <el-input
                    v-model="pjhm"
                    :placeholder="'充值收据号'"
                    :disabled="true"
                    class="text-blue"
                  ></el-input>
                </el-form-item>
                <!-- 充值后余额 -->
                <el-form-item :label="'充值后余额'" prop="czhye" disabled>
                  <el-input
                    v-model="formData2.czhye"
                    :placeholder="'充值后余额'"
                    :disabled="true"
                    class="text-blue"
                  ></el-input>
                </el-form-item>
                <!-- 病人id -->
                <el-form-item :label="'病人id'" prop="brid" hidden>
                  <el-input v-model="formData2.brid"></el-input>
                </el-form-item>

                <!-- 卡id -->
                <el-form-item :label="'卡id'" prop="cardid" hidden>
                  <el-input v-model="formData2.cardid"></el-input>
                </el-form-item>

              </el-form>
            </el-tab-pane>

            <!-- 余额转出 -->
            <el-tab-pane :label="'余额转出'" name="third">
              <div class="row">
                <div class="label">
                  <div class="btn">
                    <!-- <el-button size="mini" type="text">
                      <i class="icon his-reading-card blue"></i>读卡
                    </el-button> -->
                    <el-button
                      size="mini"
                      type="text"
                      @click="saveTransfer"
                      :disabled="!formData3.brid||!formData3.bridIn||formData3.statusIn!=0"
                    >
                      <i class="icon his-caozuo_yuezhuanchu green"></i>转出
                    </el-button>
                    <el-button size="mini" type="text" @click="reset3">
                      <i class="icon his-btn-close red"></i>清空
                    </el-button>
                  </div>
                </div>
              </div>
              <el-form :model="formData3" :rules="formRule3" ref="formData3" label-width="76px" class="scroll-bar" :style="`height:${listSlotHeight2}px`">
                <!-- 转出卡号 -->
                <el-form-item :label="'转出卡号'" prop="cardno" disabled>
                  <el-input
                    v-model="formData3.cardno"
                    :placeholder="'转出卡号'"
                    :disabled="true"
                  ></el-input>
                </el-form-item>

                <!-- 转出卡类别 -->
                <el-form-item :label="'转出卡类别'" prop="cardtypecode" disabled>
                  <search-select
                    table-name="SYS_PRIMARY_DATA"
                    kid="PD0000000726"
                    v-model="formData3.cardtypecode"
                    :backfillValue="formData3.cardtypecode"
                    :placeholder="'卡类别'"
                    :disabled="true"
                    class="no-arrow"
                  />
                </el-form-item>

                <!-- 转出姓名 -->
                <el-form-item :label="'转出姓名'" prop="brxm" disabled>
                  <el-input
                    v-model="formData3.brxm"
                    :placeholder="'转出姓名'"
                    :disabled="true"
                  ></el-input>
                </el-form-item>

                <!-- 转出身份证 -->
                <el-form-item :label="'转出身份证'" prop="idcard" disabled>
                  <el-input
                    v-model="formData3.idcard"
                    :placeholder="'转出身份证号'"
                    :disabled="true"
                  ></el-input>
                </el-form-item>

                <!-- 卡内余额 -->
                <el-form-item :label="'卡内余额'" prop="knye1" disabled hidden>
                  <el-input
                    v-model="formData3.knye1"
                    type="number"
                    :placeholder="'卡内余额'"
                    :disabled="true"
                    class="text-blue"
                  ></el-input>
                </el-form-item>

                <!-- 转出金额 -->
                <el-form-item :label="'转出金额'" prop="knyeOut">
                  <el-input
                    v-model="formData3.knyeOut"
                    type="number"
                    :placeholder="'请输入转出金额'"
                    @change="calcKnyeIn"
                    class="text-blue"
                  ></el-input>
                </el-form-item>

                <!-- 转出后余额 -->
                <el-form-item :label="'转出后余额'" prop="knyeOutTransfered" disabled>
                  <el-input
                    v-model="formData3.knyeOutTransfered"
                    :placeholder="'转出后余额'"
                    :disabled="true"
                    class="text-blue"
                  ></el-input>
                </el-form-item>

                <!-- 转出病人id -->
                <el-form-item :label="'转出病人id'" prop="brid" disabled hidden>
                  <el-input
                    v-model="formData3.brid"
                    :placeholder="'转出病人id'"
                  ></el-input>
                </el-form-item>

                <!-- 转出卡id -->
                <el-form-item :label="'转出卡id'" prop="cardid" disabled hidden>
                  <el-input
                    v-model="formData3.cardid"
                    :placeholder="'转出卡id'"
                  ></el-input>
                </el-form-item>

                <el-divider></el-divider>

                <!-- 转入卡号 -->
                <el-form-item :label="'转入卡号'" prop="cardNoIn" class="after-btn">
                  <el-input
                    v-model="formData3.cardNoIn"
                    :placeholder="'请输入转入卡号'"
                    @keyup.enter.native="queryCardIn"
                  ></el-input>
                  <el-button
                    type="primary"
                    icon="icon his-reading-card"
                    class="blue-btn"
                  >读卡</el-button>
                </el-form-item>

                <!-- 转入卡类别 -->
                <el-form-item :label="'转入卡类别'" prop="cardTypeCodeIn" disabled>
                  <search-select
                    table-name="SYS_PRIMARY_DATA"
                    kid="PD0000000726"
                    v-model="formData3.cardTypeCodeIn"
                    :backfillValue="formData3.cardTypeCodeIn"
                    :placeholder="'卡类别'"
                    :disabled="true"
                    class="no-arrow"
                  />
                </el-form-item>

                <!-- 转入姓名 -->
                <el-form-item :label="'转入姓名'" prop="brxmIn" disabled>
                  <el-input
                    v-model="formData3.brxmIn"
                    :placeholder="'转入姓名'"
                    :disabled="true"
                  ></el-input>
                </el-form-item>

                <!-- 转入身份证 -->
                <el-form-item :label="'转入身份证'" prop="idcardIn" disabled>
                  <el-input
                    v-model="formData3.idcardIn"
                    :placeholder="'转入身份证号'"
                    :disabled="true"
                  ></el-input>
                </el-form-item>

                <!-- 卡内余额 -->
                <el-form-item :label="'卡内余额'" prop="knye2" disabled hidden>
                  <el-input
                    v-model="formData3.knye2"
                    type="number"
                    :placeholder="'卡内余额'"
                    :disabled="true"
                    class="text-blue"
                  ></el-input>
                </el-form-item>

                <!-- 转入金额 -->
                <el-form-item :label="'转入金额'" prop="knyeIn" disabled>
                  <el-input
                    v-model="formData3.knyeIn"
                    :placeholder="'转入金额'"
                    :disabled="true"
                    class="text-blue"
                  ></el-input>
                </el-form-item>

                <!-- 转入后余额 -->
                <el-form-item :label="'转入后余额'" prop="knyeInTransfered" disabled>
                  <el-input
                    v-model="formData3.knyeInTransfered"
                    :placeholder="'转入后余额'"
                    :disabled="true"
                    class="text-blue"
                  ></el-input>
                </el-form-item>

                <!-- 转入病人id -->
                <el-form-item :label="'转入病人id'" prop="bridIn" disabled hidden>
                  <el-input
                    v-model="formData3.bridIn"
                    :placeholder="'转入病人id'"
                    :disabled="true"
                  ></el-input>
                </el-form-item>

                <!-- 转入卡id -->
                <el-form-item :label="'转入卡id'" prop="cardIdIn" disabled hidden>
                  <el-input
                    v-model="formData3.cardIdIn"
                    :placeholder="'转入卡id'"
                    :disabled="true"
                  ></el-input>
                </el-form-item>

                <!-- 转入卡状态 -->
                <el-form-item :label="'转入卡状态'" prop="statusIn" disabled hidden>
                  <el-input
                    v-model="formData3.statusIn"
                    :placeholder="'转入卡状态'"
                    :disabled="true"
                  ></el-input>
                </el-form-item>

              </el-form>
            </el-tab-pane>

            <!-- 退费 -->
            <el-tab-pane :label="'退费'" name="fourth">
              <div class="row">
                <div class="label">
                  <div class="btn">
                    <!-- <el-button size="mini" type="text">
                      <i class="icon his-reading-card blue"></i>读卡
                    </el-button> -->
                    <el-button
                      size="mini"
                      type="text"
                      @click="saveRefund"
                      :disabled="!formData4.brid"
                    >
                      <i class="icon his-caozuo-return-premium green"></i>退费
                    </el-button>
                    <el-button size="mini" type="text" @click="reset4">
                      <i class="icon his-btn-close red"></i>清空
                    </el-button>
                  </div>
                </div>
              </div>
              <el-form :model="formData4" :rules="formRule4" ref="formData4" label-width="76px" class="scroll-bar" :style="`height:${listSlotHeight2}px`">
                <!-- 卡号 -->
                <el-form-item :label="'卡号'" prop="cardno" disabled>
                  <el-input
                    v-model="formData4.cardno"
                    :placeholder="'卡号'"
                    @keyup.enter.native="queryCard"
                    :disabled="true"
                  ></el-input>
                </el-form-item>

                <!-- 卡类别 -->
                <el-form-item :label="'卡类别'" prop="cardtypecode" disabled>
                  <search-select
                    table-name="SYS_PRIMARY_DATA"
                    kid="PD0000000726"
                    v-model="formData4.cardtypecode"
                    :backfillValue="formData4.cardtypecode"
                    :placeholder="'卡类别'"
                    :disabled="true"
                    class="no-arrow"
                  />
                </el-form-item>

                <!-- 姓名 -->
                <el-form-item :label="'姓名'" prop="brxm" disabled>
                  <el-input
                    v-model="formData4.brxm"
                    :placeholder="'姓名'"
                    :disabled="true"
                  ></el-input>
                </el-form-item>

                <!-- 身份证 -->
                <el-form-item :label="'身份证'" prop="idcard" disabled>
                  <el-input
                    v-model="formData4.idcard"
                    :placeholder="'身份证号'"
                    :disabled="true"
                  ></el-input>
                </el-form-item>

                <!--登记时间 -->
                <el-form-item :label="'登记时间'" prop="fksj" disabled>
                  <el-date-picker
                    v-model="formData4.fksj"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :placeholder="$t('emp.phDate')"
                    :disabled="true"
                    class="date-wrapper"
                  ></el-date-picker>
                </el-form-item>

                <!-- 卡状态 -->
                <el-form-item :label="'卡状态'" prop="status" disabled>
                  <el-select
                    v-model="formData4.status"
                    :placeholder="'卡状态'"
                    :disabled="true"
                    class="no-arrow"
                  >
                    <el-option
                      v-for="(item, value) in statusList"
                      :key="value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <!-- 卡内余额 -->
                <el-form-item :label="'卡内余额'" prop="knye" disabled>
                  <el-input
                    v-model="formData4.knye"
                    :placeholder="'卡内余额'"
                    :disabled="true"
                    class="text-blue"
                  ></el-input>
                </el-form-item>

                <!-- 退费金额 -->
                <el-form-item :label="'退费金额'" prop="tfje">
                  <el-input
                    v-model="formData4.tfje"
                    type="number"
                    :placeholder="'退费金额'"
                    @change="calcTfhye"
                    class="text-blue"
                  ></el-input>
                </el-form-item>

                <!-- 退费方式 -->
                <el-form-item :label="'退费方式'" prop="tffs">
                  <search-select
                    table-name="SYS_DICT_CONFIG"
                    kid="21"
                    v-model="formData4.tffs"
                    :backfillValue="formData4.tffs"
                    :placeholder="'付款方式'"
                    :clearable="false"
                  />
                </el-form-item>

                <!-- 退费后余额 -->
                <el-form-item :label="'退费后余额'" prop="tfhye" disabled>
                  <el-input
                    v-model="formData4.tfhye"
                    :placeholder="'退费后余额'"
                    :disabled="true"
                    class="text-blue"
                  ></el-input>
                </el-form-item>

                <!-- 病人id -->
                <el-form-item :label="'病人id'" prop="brid" hidden>
                  <el-input v-model="formData4.brid"></el-input>
                </el-form-item>

                <!-- 卡id -->
                <el-form-item :label="'卡id'" prop="cardid" hidden>
                  <el-input v-model="formData4.cardid"></el-input>
                </el-form-item>

              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>

    <!-- 操作记录 -->
    <operationRecord ref="operationRecord"/>

  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  aQueryMPICard, aSaveIssuingCards, aQueryKpxx, aSaveRecharge, aSaveTransfer, aSaveRefund, aSaveRegloss, aSaveUnregloss, aSaveLogout ,getReceipt
} from '@/api/his/op/reg/rechargeCard.ts'
import operationRecord from './components/operationRecord.vue'
import { regPos } from '@/utils/validate.ts'
import { getFloat, mul } from '@/utils'

declare interface IObj {
  [key: string]: string
}

@Component({
  name: '',
  components: {
    operationRecord
  },
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
    filterStatusColor(value: string){
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
    filterDisableLogoff(row: any){
      // 卡状态 0=正常，1=挂失，2=注销，3=失效
      if(row.cardid != null){
        if(row.status == 0 || row.status == 1){
          return false
        }else{
          return true
        }
      }else{
        return true
      }
    },
    filterDisableLock(row: any){
      // 卡状态 0=正常，1=挂失，2=注销，3=失效
      if(row.cardid != null){
        if(row.status == 0){
          return false
        }else{
          return true
        }
      }else{
        return true
      }
    },
    filterDisableUnLock(row: any){
      // 卡状态 0=正常，1=挂失，2=注销，3=失效
      if(row.cardid != null){
        if(row.status == 1){
          return false
        }else{
          return true
        }
      }else{
        return true
      }
    }
	},
})

export default class extends Vue {
	private obj: IObj = {
    name: '',
    value: '',
  }
  private searchData: any = {
    cardno: ''
  }
  private pjhm: Number = 0
  private tableData: any[] = []
  private listSlotHeight: number = 0
  private loading: boolean = false

  private activeName: string = 'first'
  private formData1: any = {
    cardno: '',
    cardtypecode: '',
    brxm: '',
    idcard: '', // 身份证号
    // fksj: '', // 登记时间
    status: '',
    brid: '' // hidden
  }
  private formData2: any = {
    cardno: '',
    cardtypecode: '',
    brxm: '',
    idcard: '', // 身份证号
    fksj: '', // 登记时间
    status: '',
    knye: '', // 卡内余额
    czje: '', // 充值金额
    czfs: 1, // 充值方式
    czhye: '', // 充值后余额
    brid: '', // hidden
    cardid: '', // hidden
  }
  private formData3: any = {
    cardno: '', // 转出卡号
    cardtypecode: '', // 转出卡类别
    brxm: '', // 转出姓名
    idcard: '', // 转出身份证
    knye1: '', // 卡内余额 hidden
    knyeOut: '', // 转出金额
    knyeOutTransfered: '', // 转出后余额
    brid: '', // 转出病人id hidden
    cardid: '', // 转出卡id hidden

    cardNoIn: '', // 转入卡号
    cardTypeCodeIn: '', //转入卡类别
    brxmIn: '', // 转入姓名
    idcardIn: '', // 转入身份证
    knye2: '', // 卡内余额 hidden
    knyeIn: '', // 转入金额
    knyeInTransfered: '', // 转入后余额
    bridIn: '', // 转入病人id hidden
    cardIdIn: '', // 转入卡id hidden
    statusIn: '', // 转入卡状态 hidden
  }
  private formData4: any = {
    cardno: '',
    cardtypecode: '',
    brxm: '',
    idcard: '', // 身份证号
    fksj: '', // 登记时间
    status: '',
    knye: '', // 卡内余额
    tfje: '', // 退费金额
    tffs: 1, // 退费方式
    tfhye: '', // 退费后余额
    brid: '', // hidden
    cardid: '', // hidden
  }
  private formRule1: any = {
    cardno: [{required: true, message: '卡号不能为空', trigger: 'blur'}],
  }
  private validateCzje = (rule: any, value: any, callback: any) => {
    this.checkCzje(value, callback)
  }
  private formRule2: any = {
    czje: [
      {required: true, message: '充值金额不能为空', trigger: 'blur'},
      {pattern: regPos, message: '请输入正确的金额', trigger: 'blur'},
      {validator: this.validateCzje, trigger: 'blur'},
    ],
  }
  private validateKnyeOut = (rule: any, value: any, callback: any) => {
    this.checkKnyeOut(value, callback)
  }
  private formRule3: any = {
    knyeOut: [
      {required: true, message: '转出金额不能为空', trigger: 'blur'},
      {validator: this.validateKnyeOut, trigger: 'blur'},
    ],
    cardNoIn: [
      {required: true, message: '转入卡号不能为空', trigger: 'blur'}
    ],
    knyeIn: [
      {required: true, message: '转入金额不能为空', trigger: 'blur'},
    ]
  }
  private validateTfje = (rule: any, value: any, callback: any) => {
    this.checkTfje(value, callback)
  }
  private formRule4: any = {
    tfje: [
      {required: true, message: '退费金额不能为空', trigger: 'blur'},
      {validator: this.validateTfje, trigger: 'blur'}
    ],
  }
  private statusList: any = [
    {name: '正常', value: '0'},
    {name: '挂失', value: '1'},
    {name: '注销', value: '2'},
    {name: '失效', value: '3'},
  ]
  private cardTypeList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.CARDTYPE_DICT : this.$store.state.webSqlDict.CARDTYPE_DICT

  private listSlotHeight2: number = 0

  // 保留n位小数
	private useGetFloat(num: any, n: number){
		return getFloat(num, n)
	}

	// 获取列表
  private getLists() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 条件查询
  searchLists() {
    if(this.searchData.cardno===''){
      return false
    }
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }

  // 获取详情
  getDetail(row: any){
    for(let i in row){
      this.formData2[i] = row[i]
      this.formData3[i] = row[i]
      this.formData4[i] = row[i]
      // if(i == 'knye'){
      //   this.formData2[i] = getFloat(row[i], 2)
      //   this.formData3[i] = getFloat(row[i], 2)
      //   this.formData4[i] = getFloat(row[i], 2)
      // }
    }

    this.formData2.knye = getFloat(this.formData2.knye, 2)
    this.formData2.czje = ''
    this.formData2.czhye = ''

    this.formData3.knye1 = getFloat(row.knye, 2)
    this.formData3.knyeOutTransfered = 0
    this.formData3.knyeIn = ''

    this.formData4.knye = getFloat(this.formData4.knye, 2)


    //点击是的是 获取票据号
    this.getReceiptInfor()
  }

  //获取充值票据号
  private getReceiptInfor(){
    const params:any = {
      pjlx:4
    }
    getReceipt(params).then((res:any)=>{
      this.pjhm = res.data
    })
  }
  // 登记前查询
  private queryDetail(){
    if(this.formData1.cardno==''){
      this.$notify({
        title: '请输入卡号',
        message: '',
        type: 'warning'
      })
      return false
    }

    let cardno = this.formData1.cardno
    aQueryMPICard({cardno: this.formData1.cardno}).then((res: any) => {
      if(res){
        if(!res.data.cardid){
          this.$notify({
            title: '未查询到相应的病人信息',
            message: '',
            type: 'error'
          })
          this.reset1()
          this.formData1.cardno = cardno
          return false
        }
        for(let i in this.formData1){
          this.formData1[i] = res.data[i]
        }
      }
    })
  }

  // 登记
  private issuing(){
    aSaveIssuingCards(this.formData1).then((res: any) => {
      if(res){
        this.$notify({
          title: '登记成功',
          message: '',
          type: 'success'
        })
        this.reset1()
        this.searchLists()
      }
    })
  }

  // 查询充值卡详情
  private queryCard(){
    aQueryKpxx({cardno: this.formData2.cardno}).then((res: any) => {
      if(res){
        if(!res.data.cardid){
          this.$notify({
            title: '未查询到相应的病人信息',
            message: '',
            type: 'error'
          })
          return false
        }
        for(let i in this.formData2){
          if(i != 'czfs'){
            this.formData2[i] = res.data[i]
          }
        }
        if(this.formData2.status != 0){
          this.$notify({
            title: '该卡已挂失或已注销，不能充值',
            message: '',
            type: 'error'
          })
        }
      }
    })
  }

  // 计算充值后余额
  private calcCzhye(value: any){
    if(value !=''){
      this.formData2.czje = getFloat(value, 2)
      this.formData2.czhye = getFloat((mul(this.formData2.knye, 100) + mul(value, 100)) / 100, 2)
    }
  }

  // 充值金额校验
  private checkCzje(value: any, callback: any){
    if(parseFloat(value) <= 0){
      callback(new Error('充值金额须大于0'))
    }else{
      callback()
    }
  }

  // 充值
  private saveRecharge(){
    const form2: any = this.$refs.formData2
    form2.validate((valid: any)=>{
      if(valid){
        aSaveRecharge(this.formData2).then((res: any) => {
          if(res){
            this.$notify({
              title: '充值成功',
              message: '',
              type: 'success'
            })
            this.searchLists()
            this.resetAll()
          }
        })
      }
    })
  }

  // 计算转出后余额、转入金额、转入后余额
  private calcKnyeIn(value: any){
    if(value !='' && parseFloat(value) <= parseFloat(this.formData3.knye1) && parseFloat(value) >= 0){
      this.formData3.knyeOut = getFloat(value, 2)
      this.formData3.knyeOutTransfered = getFloat((mul(this.formData3.knye1, 100) - mul(value, 100)) / 100, 2)
      this.formData3.knyeIn = this.formData3.knyeOut
      this.formData3.knyeInTransfered = getFloat((mul(this.formData3.knye2, 100) + mul(this.formData3.knyeIn, 100)) / 100, 2)
    }
  }

  // 转出金额校验
  private checkKnyeOut(value: any, callback: any){
    if(parseFloat(value) > parseFloat(this.formData3.knye1)){
      callback(new Error('转出金额不能大于卡内余额'))
    }else if(parseFloat(value) < 0){
      callback(new Error('转出金额不能小于0'))
    }else{
      callback()
    }
  }

  // 转入卡查询
  private queryCardIn(){
    if(this.formData3.cardNoIn==''){
      this.$notify({
        title: '请输入转入卡号',
        message: '',
        type: 'warning'
      })
      return false
    }

    aQueryKpxx({cardno: this.formData3.cardNoIn}).then((res: any) => {
      if(res){
        if(!res.data.cardid){
          this.$notify({
            title: '未查询到相应的病人信息', // 挂失状态查不到
            message: '',
            type: 'error'
          })
          this.formData3.cardTypeCodeIn = ''
          this.formData3.brxmIn = ''
          this.formData3.idcardIn = ''
          this.formData3.knye2 = ''
          this.formData3.bridIn = ''
          this.formData3.cardidIn = ''
          this.formData3.statusIn = ''
        }else{
          this.formData3.cardTypeCodeIn = res.data.cardtypecode
          this.formData3.brxmIn = res.data.brxm
          this.formData3.idcardIn = res.data.idcard
          this.formData3.knye2 = res.data.knye
          this.formData3.knyeInTransfered = getFloat((mul(this.formData3.knye2, 100) + mul(this.formData3.knyeIn, 100)) / 100, 2)
          this.formData3.bridIn = res.data.brid
          this.formData3.cardidIn = res.data.cardid
          this.formData3.statusIn = res.data.status
          if(this.formData3.statusIn != 0){
            this.$notify({
              title: '该卡已挂失或已注销，不能转入',
              message: '',
              type: 'error'
            })
          }
        }
      }
    })
  }

  // 确认转出
  private saveTransfer(){
    if(this.formData3.cardidIn==this.formData3.cardid){
      this.$notify({
        title: '转出卡与转入卡不能是同一张卡',
        message: '',
        type: 'error'
      })
      return false
    }

    const form3: any = this.$refs.formData3
    form3.validate((valid: any)=>{
      if(valid){
        let params: any = {
          bridOut: this.formData3.brid,
          cardIdOut: this.formData3.cardid,
          cardNoOut: this.formData3.cardno,
          knyeOut: this.formData3.knyeOut,
          bridIn: this.formData3.bridIn,
          cardIdIn: this.formData3.cardidIn,
          knyeIn: this.formData3.knyeIn,
          cardNoIn: this.formData3.cardNoIn,
        }
        aSaveTransfer(params).then((res: any) => {
          if(res){
            this.$notify({
              title: '转出成功',
              message: '',
              type: 'success'
            })
            this.searchLists()
            this.resetAll()
          }
        })
      }
    })
  }

  // 计算退费后余额
  private calcTfhye(value: any){
    if(value !=''){
      this.formData4.tfje = getFloat(value, 2)
      this.formData4.tfhye = getFloat((mul(this.formData4.knye, 100) - mul(value, 100)) / 100, 2)
    }
  }

  // 退费金额校验
  private checkTfje(value: any, callback: any){
    if(parseFloat(value) > parseFloat(this.formData4.knye)){
      callback(new Error('退费金额不能大于卡内余额'))
    }else if(parseFloat(value) < 0){
      callback(new Error('退费金额不能小于0'))
    }else{
      callback()
    }
  }

  // 确认退费
  private saveRefund(){
    const form4: any = this.$refs.formData4
    form4.validate((valid: any)=>{
      if(valid){
        aSaveRefund(this.formData4).then((res: any) => {
          if(res){
            this.$notify({
              title: '退费成功',
              message: '',
              type: 'success'
            })
            this.searchLists()
            this.resetAll()
          }
        })
      }
    })
  }

  // 重置1
  private reset1(){
    const formData1: any = this.$refs.formData1
    formData1.resetFields()
  }

  // 重置2
  private reset2(){
    const formData2: any = this.$refs.formData2
    formData2.resetFields()
  }

  // 重置3
  private reset3(){
    const formData3: any = this.$refs.formData3
    formData3.resetFields()
  }

  // 重置4
  private reset4(){
    const formData4: any = this.$refs.formData4
    formData4.resetFields()
  }

  private resetAll(){
    this.reset1()
    this.reset2()
    this.reset3()
    this.reset4()
  }

  // 挂失
  private saveRegloss(row: any){
    aSaveRegloss({cardid: row.cardid, cardno: row.cardno}).then((res: any) => {
      if(res){
        this.$notify({
          title: '已挂失',
          message: '',
          type: 'success'
        })
        this.searchLists()
      }
    })
  }

  // 解挂
  private saveUnregloss(row: any){
    aSaveUnregloss({cardid: row.cardid, cardno: row.cardno}).then((res: any) => {
      if(res){
        this.$notify({
          title: '已解挂',
          message: '',
          type: 'success'
        })
        this.searchLists()
      }
    })
  }

  // 注销
  private saveLogout(row: any){
    if(row.knye > 0 ){
      this.$notify({
        title: '卡内有余额，不能注销',
        message: '',
        type: 'warning'
      })
      return false
    }
    aSaveLogout({cardid: row.cardid, cardno: row.cardno}).then((res: any) => {
      if(res){
        this.$notify({
          title: '已注销',
          message: '',
          type: 'success'
        })
        this.searchLists()
      }
    })
  }

  // 操作记录弹窗
  private getRecord(row: any){
    const operationRecord: any = this.$refs.operationRecord
    operationRecord.openDialog(row.cardno)
  }


  private handleSubmit(){}
   
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 106
    this.listSlotHeight2 = Vue.prototype.PageHeight - 130
  }
  mounted() {
    // this.getLists()
  }
}
</script>

<style lang="scss" scoped>
.row{
  .search ::v-deep .el-input__inner{
    width: 200px!important;
  }
}
.el-form{
  overflow: auto;
  margin: 0!important;
  padding: 0 20px!important;
  .search-select{
    width: 100%;
  }
}

.el-tabs{
  margin-top: 6px;
  ::v-deep .el-tabs__header{
    margin-bottom: 8px;
  }
}
.el-tab-pane{
  .row{
    margin-bottom: 16px;
    .label{
      height: 24px;
    }
  }
}

.el-dialog__wrapper ::v-deep{
  .el-dialog__body{
    padding-top: 10px;
  }
}

.el-table ::v-deep td.is-right .cell{
  padding-right: 8px!important;
}

.after-btn ::v-deep .el-form-item__content{
  .el-input{
    width: calc(100% - 80px - 8px);
  }
  .el-button{
    width: 80px;
    height: 28px;
    margin-left: 8px;
    padding: 0;
    justify-content: center;
  }
}

</style>
