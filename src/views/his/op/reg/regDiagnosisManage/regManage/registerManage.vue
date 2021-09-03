<template>
  <div class="content">
    <el-row class="upper">
      <el-col class="ht" :span="24">
        <div class="his-module his-small">
          <div class="small-header">
            <el-radio-group v-model="ghlx" class="small-radio-group" @change="changeGhlx">
              <el-radio :label="0">普通门诊</el-radio>
              <el-radio :label="1">急诊门诊</el-radio>
            </el-radio-group>
            <el-divider direction="vertical"></el-divider>
            <el-checkbox v-model="isEcQrcode" @change="checkEcQrcode" class="ec-qrcode">电子凭证</el-checkbox>
            <el-divider direction="vertical"></el-divider>
            <div class="btn">
              <el-button type="text" size="mini" @click="handleAdd()">
                <i class="icon his-caozuo-jiandang blue"></i>建档(F2)
              </el-button>
              <el-button type="text" size="mini" @click="handleEdit" :disabled="formData.brid==''">
                <i class="icon his-caozuo-jiandang blue"></i>修改
              </el-button>
              <el-button type="text" size="mini" @click="resetForm">
                <i class="icon his-btn-reset blue"></i>重置
              </el-button>
              <el-button type="text" size="mini" @click="handleRegWithdrawal">
                <i class="icon his-return red"></i>退号
              </el-button>
              <!-- <el-button type="text" size="mini" @click="handleRegTransfer">
                <i class="icon his-transfers green"></i>转科
              </el-button> -->
              <el-button type="text" size="mini" @click="handleRegJoin">
                <i class="icon his-transfer blue"></i>预约病人调入
              </el-button>
              <el-button type="text" size="mini" @click="handleRegJoin2">
                <i class="icon his-transfer blue"></i>预检分诊病人调入
              </el-button>
              <!-- <el-button type="text" size="mini">
                <i class="icon his-btn-print blue"></i>打印设置
              </el-button> -->
              <el-button type="text" size="mini" @click="checkLodop" style="display:none">
                <i class="icon his-btn-print blue"></i>lodop检测
              </el-button>
            </div>
          </div>
          <!-- <div class="form4"></div> -->
          <el-form
            ref="formData"
            :model="formData"
            :rules="formRule"
            label-width="60px"
            class="form4 clearfix"
          >
            <div class="form-area1">
              <!-- 就诊卡号 -->
              <el-form-item :label="'就诊卡号'" class="item-card" prop="jzkh">
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
            <div class="form-area1">
              <!-- 收费性质 -->
              <el-form-item :label="'收费性质'" prop="brxz">
                <el-select
                  v-model="formData.brxz"
                  placeholder="收费性质"
                  :disabled="false"
                  class="no-arrow"
                  @change="changeBrxz"
                >
                  <el-option
                    v-for="item in brxzList"
                    :key="item.brxz"
                    :label="item.xzmc"
                    :value="item.brxz"
                    :disabled="item.sfgg==0"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-area1">
              <!-- 患者姓名 -->
              <el-form-item :label="'患者姓名'" prop="brxm" disabled>
                <el-input v-model="formData.brxm" :placeholder="'患者姓名'" :disabled="true"></el-input>
              </el-form-item>
            </div>
            <div class="form-area1">
              <!-- 患者性别 -->
              <el-form-item :label="'患者性别'" prop="brxb" class="item-gender" disabled>
                <search-select
                  table-name="SYS_PRIMARY_DATA"
                  kid="PD0000000269"
                  v-model="formData.brxb"
                  :backfillValue="formData.brxb"
                  :disabled="true"
                  :placeholder="'性别'"
                  class="no-arrow"
                />
              </el-form-item>
              <el-form-item label-width="0px" prop="ages" class="item-age" disabled>
                <el-input v-model="formData.ages" :placeholder="'年龄'" class="age" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label-width="0px" prop="age" class="item-age" disabled hidden>
                <el-input v-model="formData.age" :placeholder="'年龄'" class="age" :disabled="true"></el-input>
              </el-form-item>
            </div>
            <div class="form-area1">
              <!-- 挂号日期 -->
              <el-form-item :label="'挂号日期'" prop="ghrq" class="item-date" disabled>
                <el-date-picker
                  v-model="formData.ghrq"
                  type="date"
                  placeholder="请选择日期"
                  class="date-wrapper"
                  :disabled="true"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label-width="0px" prop="ghlb" class="item-ampm" disabled>
                <search-select
                  table-name="SYS_DICT_CONFIG"
                  kid="73"
                  v-model="formData.ghlb"
                  :backfillValue="formData.ghlb"
                  :disabled="true"
                  :placeholder="'班次'"
                  class="no-arrow"
                />
              </el-form-item>
            </div>
            <div class="form-area1">
              <!-- 挂号科室 -->
              <el-form-item :label="'挂号科室'" prop="ksdm" disabled>
                <el-select
                  v-model="formData.ksdm"
                  :disabled="true"
                  class="no-arrow"
                  :placeholder="'挂号科室'"
                >
                  <el-option
                    v-for="item in tableData1"
                    :key="item.ksdm"
                    :value="item.ksdm"
                    :label="item.ksmc"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-area1">
              <!-- 医生 -->
              <el-form-item :label="'医生'" prop="ysdm" disabled>
                <el-select
                  v-model="formData.ysdm"
                  :disabled="true"
                  class="no-arrow"
                  :placeholder="'就诊医生'"
                >
                  <el-option
                    v-for="item in tableData2"
                    :key="item.ysdm"
                    :value="item.ysdm"
                    :label="item.personname"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-area1">
              <!-- 发票号码 -->
              <el-form-item :label="'发票号码'" prop="fphm" disabled>
                <el-input v-model="formData.fphm" :placeholder="'发票号码'" :disabled="true"></el-input>
              </el-form-item>
            </div>

            <div>
              <div class="form-area2">
                <!-- 挂号费 -->
                <el-form-item :label="'挂号费'" prop="ghje" disabled>
                  <el-input
                    v-model="formData.ghje"
                    class="text-blue"
                    :placeholder="'挂号费'"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="form-area2">
                <!-- 诊疗费 -->
                <el-form-item :label="'诊疗费'" prop="zlje" disabled>
                  <el-input
                    v-model="formData.zlje"
                    class="text-blue"
                    :placeholder="'诊疗费'"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="form-area2">
                <!-- 专家费 -->
                <el-form-item :label="'专家费'" prop="zjfy" disabled>
                  <el-input
                    v-model="formData.zjfy"
                    class="text-blue"
                    :placeholder="'专家费'"
                    :disabled="true"
                  ></el-input>
                </el-form-item>

                <!-- 特需费 -->
                <el-form-item :label="'特需费'" prop="txfy" disabled hidden>
                  <el-input
                    v-model="formData.txfy"
                    class="text-blue"
                    :placeholder="'特需费'"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="form-area2">
                <!-- 病历费 -->
                <el-form-item :label="'病历费'" prop="blje" disabled>
                  <el-input
                    v-model="formData.blje"
                    class="text-blue"
                    :placeholder="'病历费'"
                    type="number"
                    :disabled="true"
                    @change="changeBlje"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="form-area2">
                <!-- 磁卡费 -->
                <el-form-item :label="'磁卡费'" prop="ckje" disabled>
                  <el-input
                    v-model="formData.ckje"
                    class="text-blue"
                    :placeholder="'磁卡费'"
                    type="number"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </div>
            </div>

            <!-- 挂号时间T -->
            <el-form-item :label="'挂号时间T'" prop="ghsj" hidden>
              <el-input v-model="formData.ghsj"></el-input>
            </el-form-item>
            <!-- 科室名称 -->
            <el-form-item :label="'科室名称'" prop="ksmc" hidden>
              <el-input v-model="formData.ksmc"></el-input>
            </el-form-item>
            <!-- 病人id -->
            <el-form-item :label="'病人id'" prop="brid" hidden>
              <el-input v-model="formData.brid"></el-input>
            </el-form-item>
            <!-- 专家门诊 -->
            <el-form-item :label="'专家门诊'" prop="zjmz" hidden>
              <el-input v-model="formData.zjmz"></el-input>
            </el-form-item>
            <!-- 特需门诊 -->
            <el-form-item :label="'特需门诊'" prop="txmz" hidden>
              <el-input v-model="formData.txmz"></el-input>
            </el-form-item>
            <!-- 门诊/急诊 -->
            <el-form-item :label="'门诊/急诊'" prop="ghlx" hidden>
              <el-input v-model="formData.ghlx"></el-input>
            </el-form-item>
            <!-- 预约序号 -->
            <el-form-item :label="'预约序号'" prop="yyxh" hidden>
              <el-input v-model="formData.yyxh"></el-input>
            </el-form-item>
            <!-- 是否医保 -->
            <el-form-item :label="'是否医保'" prop="isYb" hidden>
              <el-input v-model="formData.isYb"></el-input>
            </el-form-item>
            <!-- 是否大病 -->
            <el-form-item :label="'是否大病'" prop="isDb" hidden>
              <el-input v-model="formData.isDb"></el-input>
            </el-form-item>
            <!-- 大病项目 -->
            <el-form-item :label="'大病项目'" prop="dbtype" hidden>
              <el-input v-model="formData.dbtype"></el-input>
            </el-form-item>
            <!-- 是否工伤 -->
            <el-form-item :label="'是否工伤'" prop="isGs" hidden>
              <el-input v-model="formData.isGs"></el-input>
            </el-form-item>
            <!-- 凭证号 -->
            <el-form-item :label="'凭证号'" prop="gsrdh" hidden>
              <el-input v-model="formData.gsrdh"></el-input>
            </el-form-item>
            <!-- 卡id -->
            <el-form-item :label="'卡id'" prop="cardid" hidden>
              <el-input v-model="formData.cardid"></el-input>
            </el-form-item>
            <!-- 医保卡类型 -->
            <el-form-item :label="'医保卡类型'" prop="cardtype" hidden>
              <el-input v-model="formData.cardtype"></el-input>
            </el-form-item>
            <!-- 账户标识 -->
            <el-form-item :label="'账户标识'" prop="accountattr" hidden>
              <el-input v-model="formData.accountattr"></el-input>
            </el-form-item>
            <!-- 分诊流水号 -->
            <el-form-item :label="'分诊流水号'" prop="lsh" hidden>
              <el-input v-model="formData.lsh"></el-input>
            </el-form-item>
            <!-- 医保社区减免标识 -->
            <el-form-item :label="'医保社区减免标识'" prop="ybsqjmbz" hidden>
              <el-input v-model="formData.ybsqjmbz"></el-input>
            </el-form-item>

            <el-divider content-position="left" v-if="0">账户信息</el-divider>

            <div v-if="0">
              <div class="form-area2">
                <!-- 证件号码 -->
                <el-form-item :label="'证件号码'" prop="a" disabled>
                  <el-input v-model="formData.a" :placeholder="'证件号码'" :disabled="true"></el-input>
                </el-form-item>
              </div>
              <div class="form-area2">
                <!-- 联系电话 -->
                <el-form-item :label="'联系电话'" prop="b" disabled>
                  <el-input v-model="formData.b" :placeholder="'联系电话'" :disabled="true"></el-input>
                </el-form-item>
              </div>

              <div class="form-area2">
                <!-- 联系地址 -->
                <el-form-item :label="'联系地址'" prop="c" disabled>
                  <el-input v-model="formData.c" :placeholder="'联系地址'" :disabled="true"></el-input>
                </el-form-item>
              </div>
              
              <div class="form-area2">
                <!-- 账户金额 -->
                <el-form-item :label="'账户金额'" prop="d" disabled>
                  <el-input v-model="formData.d" :placeholder="'账户金额'" :disabled="true"></el-input>
                </el-form-item>
              </div>
              <div class="form-area2">
                <!-- 累计金额 -->
                <el-form-item :label="'累计金额'" prop="e" disabled>
                  <el-input v-model="formData.e" :placeholder="'累计金额'" :disabled="true"></el-input>
                </el-form-item>
              </div>
              <div class="form-area2">
                <!-- 充值金额 -->
                <el-form-item :label="'充值金额'" prop="f" disabled>
                  <el-input v-model="formData.f" :placeholder="'充值金额'" :disabled="true"></el-input>
                </el-form-item>
              </div>
              <div class="form-area2">
                <!-- 签约信息 -->
                <el-form-item :label="'签约信息'" prop="g" disabled>
                  <el-input v-model="formData.g" :placeholder="'签约信息'" :disabled="true"></el-input>
                </el-form-item>
              </div>
              <div class="form-area2">
                <!-- 所属单位 -->
                <el-form-item :label="'所属单位'" prop="h" disabled>
                  <el-input v-model="formData.h" :placeholder="'所属单位'" :disabled="true"></el-input>
                </el-form-item>
              </div>
              <div class="form-area2">
                <!-- 病人来源 -->
                <el-form-item :label="'病人来源'" prop="i" disabled>
                  <el-input v-model="formData.i" :placeholder="'病人来源'" :disabled="true"></el-input>
                </el-form-item>
              </div>
            </div>
            
          </el-form>
        </div>
      </el-col>
    </el-row>
    <el-row class="lower" :gutter="10">
      <el-col class="ht" :span="10">
        <div class="his-module his-small dept-wrap">
          <div class="row">
            <div class="label">
              <div class="searchTitle">搜索</div>
              <el-input
                v-model="searchData1.pyDept"
                :placeholder="'拼音码查询'"
                @input="filterDept"
                @focus="focus1"
                @blur="blur1"
                class="search"
                ref="inputSearch1"
              >
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input>
              <el-divider direction="vertical"></el-divider>
              <el-checkbox v-model="isMedicalRecordFee" @change="checkMedicalRecordFee" :disabled="isDisabled">病历费</el-checkbox>
              <el-checkbox v-model="isCardFee" @change="checkCardFee" :disabled="isDisabled">磁卡费</el-checkbox>
              <!-- <el-checkbox v-model="formData.isDb" @change="changeIsDb" :true-label="1" :false-label="0">大病</el-checkbox> -->
              <!-- <el-checkbox v-model="isWorkInjury">工伤</el-checkbox> -->
              <el-checkbox v-model="freeMoney" @change="checkFree">免费</el-checkbox>
              <el-checkbox v-model="isFreeClinic" @change="checkYz">义诊</el-checkbox>
            </div>
            <div class="operate"></div>
          </div>
          <el-table
            slot="list"
            stripe
            :highlight-current-row="true"
            :data="tableData1"
            :height="listSlotHeight"
            :row-class-name="tableRowClassName1"
            border
            @row-click="getCurRow1"
            @row-dblclick="selectDept"
            class="scroll-bar"
            ref="tableData1"
          >
            <el-table-column type="index" width="32" align="center"></el-table-column>
            <el-table-column prop="ksmc" :label="'科室名称'" min-width="140"></el-table-column>
            <el-table-column :label="'挂号费'" min-width="70" class-name="text-blue-td">
              <template slot-scope="scope">{{useGetFloat(scope.row.ghf, 2)}}</template>
            </el-table-column>
            <el-table-column :label="'诊疗费'" min-width="70" class-name="text-blue-td">
              <template slot-scope="scope">{{useGetFloat(scope.row.zlf, 2)}}</template>
            </el-table-column>
            <el-table-column :label="'专家'" min-width="50">
              <template slot-scope="scope">
                <div
                  v-if="booleanList.find(item => item.dv==scope.row.zjmz)"
                >{{booleanList.find(item => item.dv==scope.row.zjmz).dn}}</div>
                <div v-else>{{scope.row.zjmz}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="txmz" :label="'特需'" min-width="50">
              <template slot-scope="scope">
                <div
                  v-if="booleanList.find(item => item.dv==scope.row.txmz)"
                >{{booleanList.find(item => item.dv==scope.row.txmz).dn}}</div>
                <div v-else>{{scope.row.txmz}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="szdm" :label="'数字代码'" min-width="80"></el-table-column>
            <el-table-column prop="pydm" :label="'拼音代码'" min-width="100"></el-table-column>
            <el-table-column prop="ghxe" :label="'限额'" min-width="60" class-name="text-blue-td"></el-table-column>
            <el-table-column prop="ygrs" :label="'已挂'" min-width="60" class-name="text-blue-td"></el-table-column>
            <el-table-column prop="yyrs" :label="'预约'" min-width="60" class-name="text-blue-td"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col class="ht" :span="9">
        <div class="his-module his-small doc-wrap">
          <div class="row">
            <div class="label">
              <div class="searchTitle">搜索</div>
              <el-input
                v-model="searchData1.pyDoc"
                :placeholder="'拼音码查询'"
                @input="filterDoc"
                @focus="focus2"
                @blur="blur2"
                class="search"
                ref="inputSearch2"
              >
                <i slot="prefix" class="el-input__icon icon his-search"></i>
              </el-input>
              <!-- <div class="no-reg-doc">无挂号医生</div> -->
            </div>
            <div class="operate"></div>
          </div>
          <el-table
            slot="list"
            stripe
            :highlight-current-row="true"
            :data="tableData2"
            :height="listSlotHeight"
            border
            :row-class-name="tableRowClassName2"
            @row-click="getCurRow2"
            @row-dblclick="selectDoc"
            v-loading="loading2"
            ref="tableData2"
          >
            <el-table-column type="index" width="32" align="center"></el-table-column>
            <el-table-column prop="personname" :label="'医生姓名'"></el-table-column>
            <el-table-column prop="isexpertText" :label="'专家'" min-width="50"></el-table-column>
            <el-table-column
              prop="expertcost"
              :label="'专家费'"
              min-width="60"
              class-name="text-blue-td"
            ></el-table-column>
            <el-table-column prop="isspecialText" :label="'特需'" min-width="50"></el-table-column>
            <el-table-column
              prop="specialcost"
              :label="'特需费'"
              min-width="60"
              class-name="text-blue-td"
            ></el-table-column>
            <el-table-column prop="hzrs" :label="'候诊'" min-width="50"></el-table-column>
            <el-table-column prop="zgrs" :label="'暂挂'" min-width="50"></el-table-column>
            <el-table-column prop="ygrs" :label="'已挂'" min-width="50" class-name="text-blue-td"></el-table-column>
            <el-table-column prop="ghxe" :label="'挂号限额'" class-name="text-blue-td"></el-table-column>
            <el-table-column prop="yyrs" :label="'预约'" min-width="50" class-name="text-blue-td"></el-table-column>
            <el-table-column prop="sftzText" :label="'停诊'" min-width="50"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col class="ht" :span="5">
        <div class="his-module his-small accInfo-wrap">
          <div class="row">
            <div class="label">
              <div class="searchTitle">账户信息</div>
            </div>
            <div class="operate"></div>
          </div>
          <div class="addnewScroll" :style="{height:listSlotHeight-22+'px'}" >
          <el-form :model="formData2" ref="formData2" label-width="68px">
            <el-form-item :label="'初诊/复诊'" prop="czfz" disabled>
              <el-input v-model="formData2.czfz" :placeholder="'初诊/复诊'" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="'证件号码'" prop="sfzh" disabled>
              <el-input v-model="formData2.sfzh" :placeholder="'证件号码'" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="'联系电话'" prop="lxrdh" disabled>
              <el-input v-model="formData2.lxrdh" :placeholder="'联系电话'" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="'联系地址'" prop="lxdz" disabled>
              <el-input v-model="formData2.lxdz" :placeholder="'联系地址'" :disabled="true"></el-input>
            </el-form-item>
            <!-- 新增 -->
            <el-form-item :label="'凭证号'" prop="pzhm" disabled>
              <el-input v-model="formData2.pzhm" :placeholder="'凭证号'" :disabled="true"></el-input>
            </el-form-item>
            <!-- 暂时取不到 -->
            <!-- <el-form-item :label="'开始时间'" prop="c" disabled>
              <el-input v-model="formData2.c" :placeholder="'开始时间'" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="'有效期至'" prop="c" disabled>
              <el-input v-model="formData2.c" :placeholder="'有效期至'" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="'医保类型'" prop="c" disabled>
              <el-input v-model="formData2.c" :placeholder="'医保类型'" :disabled="true"></el-input>
            </el-form-item> -->
           

            <el-form-item :label="'账户金额'" prop="zhje" disabled>
              <el-input v-model="formData2.zhje" :placeholder="'账户金额'" class="text-blue" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="'累计金额'" prop="ljje" disabled>
              <el-input v-model="formData2.ljje" :placeholder="'累计金额'" class="text-blue" :disabled="true"></el-input>
            </el-form-item>
            <!-- <el-form-item :label="'充值金额'" prop="f" disabled>
              <el-input v-model="formData2.f" :placeholder="'充值金额'" class="text-blue" :disabled="true"></el-input>
            </el-form-item> -->
            <!-- <el-form-item :label="'签约信息'" prop="g" disabled>
              <el-input v-model="formData2.g" :placeholder="'签约信息'" :disabled="true"></el-input>
            </el-form-item> -->
            <el-form-item :label="'所属单位'" prop="dwmc" disabled>
              <el-input v-model="formData2.dwmc" :placeholder="'所属单位'" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="'病人来源'" prop="i" disabled>
              <el-input v-model="formData2.brly" :placeholder="'病人来源'" :disabled="true"></el-input>
            </el-form-item>
          </el-form>
          </div>

        </div>
      </el-col>
      <div class="lower-right" :class="[isExpand?'is-expand':'']" v-if="0">
        <div class="his-module his-small accInfo-wrap">
          <div class="row" v-show="isExpand">
            <div class="label">
              <div class="searchTitle">账户信息</div>
            </div>
            <div class="operate"></div>
          </div>
          <el-form label-width="60px" v-show="isExpand">
            <el-form-item :label="'证件号码'" prop="a" disabled>
              <el-input v-model="formData.a" :placeholder="'证件号码'" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="'联系电话'" prop="b" disabled>
              <el-input v-model="formData.b" :placeholder="'联系电话'" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="'联系地址'" prop="c" disabled>
              <el-input v-model="formData.c" :placeholder="'联系地址'" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="'账户金额'" prop="d" disabled>
              <el-input v-model="formData.d" :placeholder="'账户金额'" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="'累计金额'" prop="e" disabled>
              <el-input v-model="formData.e" :placeholder="'累计金额'" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="'充值金额'" prop="f" disabled>
              <el-input v-model="formData.f" :placeholder="'充值金额'" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="'签约信息'" prop="g" disabled>
              <el-input v-model="formData.g" :placeholder="'签约信息'" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="'所属单位'" prop="h" disabled>
              <el-input v-model="formData.h" :placeholder="'所属单位'" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item :label="'病人来源'" prop="i" disabled>
              <el-input v-model="formData.i" :placeholder="'病人来源'" :disabled="true"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-row>

    <!-- 新建病人档案 -->
    <add-patient ref="add-patient" @getBrxzList="getBrxzList" @getPatientInfo="createdPatient" />

    <!-- 退号 -->
    <reg-withdrawal ref="reg-withdrawal" />

    <!-- 转科 -->
    <reg-transfer :deptList="tableData1Clone" :zblb="formData.ghlb" ref="reg-transfer" />

    <!-- 调入 -->
    <reg-join
      :deptList="tableData1Clone"
      :zblb="formData.ghlb"
      @queried="queriedJoinInfo"
      ref="reg-join"
    />
    <appointment 
      :tableData="tableDataList"
      :appointForm="appointForm"
      @queried="queriedJoinInfo"
      ref="appointment">
    </appointment>
    <!-- 预检分诊病人调入 -->
    <reg-join2 :date="formData.ghrq" @selected="selectedPatient" ref="reg-join2" />
    <jzappointment :tableData="tableDataList1" @selected="selectedPatient" ref="jzappointment" />
    <!-- 选择大病项目 -->
    <regDb :jzkh="formData.jzkh" @selected="selectedDbtype" @cancel="cancelDb" ref="regDb" />

    <!-- 工伤认定号 -->
    <regGs
      :jzkh="formData.jzkh"
      :cardtype="formData.cardtype"
      v-model="formData.gsrdh"
      :brid="formData.brid"
      @cancel="cancelGs"
      ref="regGs"
    />

    <!-- 结算 -->
    <reg-settlement
      :settleInfo="formData"
      :isAppointed="isAppointed"
      :isEcQrcode="isEcQrcode"
      @resetForm="resetForm"
      ref="reg-settlement"
      :isFree='freeMoney'
      :isClinic ="isFreeClinic"

    />

    <!-- <pre>{{formData}}</pre> -->
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import addPatient from '@/components/addPatient/index.vue'
import regWithdrawal from '../components/regWithdrawal.vue'
import regTransfer from './components/regTransfer.vue'
import regJoin from './components/regJoin.vue'
import appointment from './components/appointment.vue'
import regJoin2 from './components/regJoin2.vue'
import jzappointment from './components/jzappointment.vue'
import regDb from './components/regDb.vue'
import regGs from './components/regGs.vue'
import regSettlement from './components/regSettlement.vue'
import { aInitReg, aQuerySchDept, aQueryPatientInfo, aCheckSameGhks, aCheckExpertSch, aQueryDeptSchDoc, aQuerySjBrxz,aGetAnAppointment,getJzYjfzList} from '@/api/his/op/reg/registerManage.ts'
import {  searchSingle } from '@/api/his/sys/centerMaintenance/medicareInfoManage/systemParameter.ts'
import { aReadMedAcc } from '@/api/his/basic'
import { getFloat, mul } from '@/utils'
import { getLodop } from '@/plugins/lodop/index.js'
import { Alert } from 'element-ui'

//声明接口
declare interface pageList {
  id: number
}

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: '',
  filters: {},
  components: {
    addPatient,
    regWithdrawal,
    regTransfer,
    regJoin,
    appointment,
    regJoin2,
    jzappointment,
    regDb,
    regGs,
    regSettlement,
  },
})
export default class extends Vue {
  //声明变量，方法
  private tableData1: any[] = [] // 表格数据
  private tableData1Clone: any[] = []
  private tableData2: any[] = [] // 表格数据
  private tableData2Clone: any[] = []
  private tableDataList:any= [] //挂号查询预约
  private tableDataList1:any= [] //挂号查询预检
  private appointForm:any = {}
  private csz:any = ""
  private curRowIndex1: number = 0
  private curRowIndex2: number = 0
  private searchData1: any = {
    pyDept: '',
    pyDoc: '',
  } // 搜索参数
  private listSlotHeight: number = 0
  private isDisabled:boolean = false
  private loading: boolean = true
  private loading2: boolean = false
  private rightTitle: string = window.ele.$i18n.t('common.add')
  private formData: any = {
    jzkh: '',
    brxz: '', // 收费性质
    brxm: '',
    brxb: '',
    age: '', // 周岁 hidden
    ages: '', // 月日
    ghrq: '',
    ghsj: '', // 挂号时间 hidden
    ghlb: '', // 挂号类别，上下午
    ksdm: '', // 挂号科室
    ksmc: '', // 科室名称 hidden
    ysdm: '', // 医生
    fphm: '', // 发票号码
    ghje: '0.00', // 挂号金额
    zlje: '0.00', // 诊疗金额
    zjfy: '0.00', // 专家费用
    txfy: '0.00', // 特需费用
    blje: '0.00', // 病历金额
    ckje: '0.00', // 磁卡金额
    brid: '', // 病人id hidden
    zjmz: '', // 是否专家门诊 hidden
    txmz: '', // 是否特需门诊 hidden
    ghlx: 0, // 0门诊，1急诊
    yyxh: 1, // 预约序号
    isYb: 0, // 是否为医保，0否，1是 hidden
    isDb: 0, // 是否为大病，0否，1是 hidden
    dbtype: '', // 大病项目 hidden
    isGs: 0, // 是否工伤
    gsrdh: '', // 凭证号（工伤认定号）
    cardid: '', // 卡id hidden
    cardtype: '', // 医保卡类型 hidden
    accountattr: '', // hidden
    lsh: '', // 分诊流水号 hidden
    ybsqjmbz: '', // 医保社区减免标识 hidden
    ghflb:'',
    zlflb:'',
    zjflb:''
  } // 表单数据
  private formData2: any = {
    czfz:'',
    sfzh: '',
    zhje: '',
    ljje: '',
    ssdw: '',
    pzhm:'',
    lxrdh:'',
    lxdz:'',
    dwmc:'',
    brly:''
  }
  private blje: string = '' // 病历费（用于重新赋值）
  private ckje: string = '' // 磁卡费（用于重新赋值）
  private mfje: string = '' // 免费（用于重新赋值）
  private zlje:string = ''  //诊疗 （用于重新赋值）
  private yjfzcsz:string = '' //急诊预检参数值

  private formRule: any = {} // 表单验证
  private now: any = '' // 当前时间
  private brxzList: any[] = [] // 收费性质
  private isMedicalRecordFee: boolean = true // 是否需要病历费
  private isCardFee: boolean = false // 是否需要磁卡费
  private isSeriousIllness: boolean = false // 是否为大病
  private isWorkInjury: boolean = false // 是否为工伤
  private isFreeClinic: boolean = false // 是否为义诊
  private freeMoney :boolean = false //挂号是否免费
  private isAppointed: boolean = false // 是否为预约
  private appointedInfo: any = {} // 预约的科室、医生信息
  private ghlx: number = 0 // 0普通，1急诊
  // private booleanList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.Y_OR_N_DICT : this.$store.state.webSqlDict.Y_OR_N_DICT
  private booleanList: any[] = []
  private isRead: number = 0 // 是否已读卡或刷卡（只针对医保）
  private isEcQrcode: boolean = false // 是否为电子凭证

  private isExpand: boolean = false

  public setValue(value: string) {
    this.setValue(value)
  }
  public getValue() {
    return null
  }

  //监听方法
  @Watch('tableData')
  private onValueChange(value: string) {
    this.loading = false
  }

  checkLodop(){
    const __qiankun__ = window.__POWERED_BY_QIANKUN__
    let LODOP: any = null
    if (__qiankun__) {
      console.log('主项目');
      LODOP = Vue.prototype.$getLodop()
      console.log(LODOP);
    } else {
      console.log('子项目');
      LODOP = getLodop()
      console.log(LODOP);
    }
    if(!LODOP){
      alert("没有安装打印控件")
      LODOP.PRINT_INITA("0mm", "0mm", "235mm", "140mm", "");
    }else{
      alert("已安装打印控件")
      LODOP.PRINT_INITA("0mm", "0mm", "235mm", "140mm", "");
    }
  }

  // 卡号获取焦点
  private focusJzkh() {
    const inputJzkh: any = this.$refs.inputJzkh
    inputJzkh.focus()
  }

  // 保留n位小数
  private useGetFloat(num: any, n: number) {
    return getFloat(num, n)
  }

  // 从子组件获取病人性质列表
  private getBrxzList(list: any) {
    this.brxzList = list
  }

  // 初始化
  private initReg() {
    return new Promise((resolve:any) => {
      aInitReg().then((res: any) => {
        if (res.errorCode == 'SUCCESS') {
          (this.formData.ghrq = res.data.ghrq.substr(0, 10)), (this.formData.ghsj = res.data.ghrq.substr(0, 10)), (this.formData.ghlb = res.data.zblb)
          this.formData.fphm = res.data.jzhm
          this.formData.blje = getFloat(res.data.blje, 2)
          this.blje = getFloat(this.formData.blje,2)
          // this.formData.ckje = res.data.ckje
          this.ckje = getFloat(res.data.ckje, 2)
          this.mfje = getFloat(res.data.ghje, 2)
          resolve()
        }else if(res.errorCode=='ERROR_REG_0056'){
          this.$alert(res.message, '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: (action) => {
              this.$router.push({
                path: "/billNumberMaintain1?activeName=2",
              })
            },
          })
        }
      }).catch((err:any)=>{
        resolve()
      })
    })
  }

  // 切换门诊急诊
  private changeGhlx(value: number) {
    this.resetForm()
    if(value ==1 ){
      searchSingle({csmc:'JZYJFZ'}).then((res:any)=>{
        if(res.errorCode=='SUCCESS'){
          // this.querySchDept()
          this.csz = res.data.csz || ''
        }
      })
    }
    this.querySchDept()
  }

  // 查询当日值班科室
  private querySchDept() {
    let params:any = {
      ghlx: this.ghlx,
      yytag: 1, 
      dbtype: this.formData.dbtype
    }
    // if(this.isFreeClinic){
    //   params.ghlx=5
    // }
    // if(this.freeMoney){
    //   params.ghlx = 4
    // }
    aQuerySchDept(params).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.tableData1 = res.data
        this.tableData1.forEach((item: any) => {
          if (item.pydm == null) {
            item.pydm = ''
          }
          if (item.szdm == null) {
            item.szdm = ''
          }
        })
        this.tableData1Clone = [...this.tableData1]
        this.setFirstRow1()
        this.tableData2 = []
      }else{
        if (res.errorCode == 'ERROR_REG_0070') {
          this.$alert(res.message, '提示', {
            //请在当前医保线路中维护本机ip地址
            confirmButtonText: '确定',
            type: 'warning',
            callback: (action) => {
              this.$router.push({
                path: '/medicalInsuranceRoute1',
              })
            },
          })
        }else if (res.errorCode == 'ERROR_REG_0060') {
          this.$alert(res.message, '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: (action) => {
              this.$router.push({
                path: '/deptSchedule1',
              })
            },
          })
        }else if (res.errorCode == 'ERROR_REG_0094') {
          this.$alert(res.message, '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: (action) => {
              this.$router.push({
                path: '/deptSchedule1',
              })
            },
          })
        }else{
          this.$message({
            message: res.message,
            type: 'error',
          })
        }
      }
    })
  }

  // 卡号回车
  private jzkhEnter() {
    this.formData.lsh = ''
    this.formData.isDb = 0
    this.changeIsDb(0)
    if (this.isEcQrcode) {
      this.readCard('3')
    } else if (this.formData.jzkh.length == 28) {
      this.readCard('0')
    } else {
      this.isRead = 0
      this.getPatientInfo()
    }
  }

  // 建档后
  private createdPatient(patientInfo: any) {
    this.isRead = 0
    this.getPatientInfo(patientInfo)
  }

  // 根据卡号查询病人信息
  private async getPatientInfo(patientInfo?: any,curRow?:any) {
    this.tableDataList1= []
    // 清空
    // let jzkh = this.formData.jzkh
    // const formData: any = this.$refs.formData
    // formData.resetFields()
    // this.formData.jzkh = jzkh
    if (patientInfo) {
      this.formData.jzkh = patientInfo.jzkh
    }
    if (this.formData.jzkh == '') {
    } else {
      const res: any = await aQueryPatientInfo({ jzkh: this.formData.jzkh, isRead: this.isRead })
      if (res.errorCode == 'SUCCESS') {
        if (res.data == null) {
          this.handleAdd(this.formData.jzkh, this.formData.cardtype!=''?true:false) // 第二个参数：是否读卡
        } else {
          const res1: any = await aQuerySjBrxz({ brxz: res.data.brxz })
          this.formData.isYb = res1.data == '6021' ? 1 : 0
          // 医保卡
          if (res1.data == '6021' && this.isRead == 0) {
            // 走不到这一步，20-10-29
            this.$notify({
              title: '病人卡片是医保卡,不能查询!',
              message: '',
              type: 'warning',
            })
          } else {
            // status：1挂失，2注销，3失效
            if (res.data.status == 1) {
              this.$notify({
                title: '此卡已挂失',
                message: '',
                type: 'error',
              })
            } else if (res.data.status == 2) {
              this.$notify({
                title: '此卡已注销',
                message: '',
                type: 'error',
              })
            } else if (res.data.status == 3) {
              this.$notify({
                title: '此卡已失效',
                message: '',
                type: 'error',
              })
            } else {
              // 查询病人信息
              this.formData.brxz = res.data.brxz
              this.formData.brxm = res.data.brxm
              this.formData.brxb = res.data.brxb
              this.formData.age = res.data.age // 周岁
              this.formData.ages = res.data.ages // 月日
              this.formData.brid = res.data.brid
              this.formData.gsrdh = res.data.gsrdh
              this.formData2.sfzh = res.data.sfzh
              this.isAppointed = false
              //新增
              this.formData2.czfz = res.data.czfz==1?'复诊':'初诊'
              this.formData2.pzhm = res.data.pzhm
              this.formData2.lxdz = res.data.lxdz
              this.formData2.lxrdh = res.data.lxrdh
              this.formData2.dwmc = res.data.dwmc

              if(res.data.czfz==1){
                this.isCardFee = false
                this.isMedicalRecordFee = false
                this.formData.blje = '0.00'
                this.formData.ckje = '0.00'
              }else{
                this.isCardFee = true
                this.formData.ckje = this.ckje
                this.isMedicalRecordFee = true
                this.formData.blje = this.blje
              }
              this.letFocus1()
              this.changeBrxz(this.formData.brxz)
              //预检分诊或者预约病人
              if(curRow){
                this.formData.ksdm = curRow.fzksdm
                this.formData.ysdm = curRow.ysdm
                // 匹配所选科室
                for (let i of this.tableData1Clone) {
                  if (i.ksdm == curRow.fzksdm) {
                    this.isAppointed = true
                    this.selectDept(i) // 接正常挂号流程
                    break
                  }
                }
                return
              }
              //新增 查询预约病人 如果与的话 直接谈框进行挂号
              if(this.ghlx===0){
                let params ={
                  jzkh: this.formData.jzkh,
                  zblb: this.formData.ghlb
                }
                aGetAnAppointment(params).then((respon: any) => {
                  if(respon.errorCode=='SUCCESS'&&respon.data&&respon.data.length){
                    // this.handleRegJoin()
                    this.tableDataList = respon.data
                    this.appointForm = res.data
                    this.$nextTick(()=>{
                      var rj: any = this.$refs['appointment']
                      rj.openDialog()
                    })
                  }
                })
              }else{
                let params = {
                  jzkh:this.formData.jzkh,
                  fzrq:this.formData.ghrq
                }
                getJzYjfzList(params).then((respon:any)=>{
                  if(respon.errorCode=='SUCCESS'){
                    if(respon.data.list&&respon.data.list.length){
                      this.tableDataList1 = respon.data.list
                      this.$nextTick(()=>{
                        var rj: any = this.$refs['jzappointment']
                        rj.openDialog()
                      })
                    }else{
                      if(this.csz ==1){
                        this.$message.error('该病人没有急诊预检分诊')
                        this.resetForm()
                      }
                    }
                  }
                })
              }
            }
          }
        }
      }
      if (res.errorCode == 'ERROR_SHYB_0019') {
        // else{
        this.$notify({
          title: res.message,
          message: '',
          type: 'warning',
        })
        this.resetForm()
      }
    }
  }

  // 读卡
  private readCard(cardtype: any) {
    this.formData.isDb = 0
    this.changeIsDb(0)
    let params = {
      cardtype: cardtype,
      carddata: this.formData.jzkh || ' ',
    }
    aReadMedAcc(params).then((res: any) => {
      if (res) {
        this.formData.jzkh = res.data.jzkh
        this.isRead = 1
        this.formData.cardid = res.data.ecToken
        this.formData.cardtype = res.data.cardtype
        this.formData.accountattr = res.data.accountattr
        this.formData.ybsqjmbz = res.data.ybsqjmbz
        this.formData2.zhje = res.data.curaccountamt
        this.formData2.ljje = getFloat((mul(res.data.curaccountamt, 100) + mul(res.data.hisaccountamt, 100))/100  ,  2)
        this.getPatientInfo()
      }
    })
  }

  // 改变病人性质
  private changeBrxz(value: any){
    console.log('性质', value);
    aQuerySjBrxz({ brxz: value }).then((res: any) => {
      if(res){
        this.formData.isYb = res.data == '6021' ? 1 : 0
      }
    })
    // 匹配病人性质
    let curBrxz = this.brxzList.find((item)=>{
      return item.brxz == value
    })
    if(curBrxz.tsdm == 'DB'){ // 大病
      this.formData.isDb = 1
      this.changeIsDb(1)
    }else{
      this.formData.isDb = 0
      this.changeIsDb(0)
    }
    if(curBrxz.tsdm == 'GS'){ // 工伤
      this.formData.isGs = 1
      this.openGs()
    }else{
      this.formData.isGs = 0
    }
  }

  // 改变病历金额
  private changeBlje(value: string) {
    if (value != '') {
      this.formData.blje = getFloat(this.formData.blje, 2)
    } else {
      this.formData.blje = '0.00'
    }
  }

  // 左边双击（选择科室）
  private selectDept(row: any) {
    if (!this.formData.brid) {
      this.$notify({
        title: '请先录入患者信息',
        message: '',
        type: 'warning',
      })
      return false
    }
    // 挂号科室限制条件
    if (row.xbxz != null) {
      if (row.xbxz != this.formData.brxb) {
        this.$message({
          message: '该科室与患者性别不符',
          type: 'error',
        })
        return false
      }
    }
    if (row.nlxz != null) {
      if (row.nlxz < this.formData.age) {
        this.$message({
          message: '患者年龄超过该科室年龄限制',
          type: 'error',
        })
        return false
      }
    }
    //新增一个免挂号费判断
    if(this.freeMoney||this.isFreeClinic){
      this.formData.ghje = "0.00"
    }else{
      this.formData.ghje = getFloat(row.ghf, 2)
    }
    this.mfje = getFloat(row.ghf, 2)
    // 获取挂号费、诊疗费
    // this.formData.ghje = getFloat(row.ghf, 2) //新增免挂号费之前的 
    this.formData.zlje = getFloat(row.zlf, 2)
    this.zlje = getFloat(row.zlf, 2)

    if(this.freeMoney||this.isFreeClinic){
      this.formData.zlje = '0.00'
    }
    this.formData.zjfy = '0.00'
    this.formData.ksdm = row.ksdm
    this.formData.ksmc = row.ksmc
    this.formData.zjmz = row.zjmz
    this.formData.txmz = row.txmz
    this.formData.ghlx = row.jzmz
    this.formData.ysdm = ''
    this.formData.ghflb = row.ghflb
    this.formData.zlflb = row.zlflb
    this.checkSameGhks(row)
  }

  // 查询病人是否已挂过同一科室
  private checkSameGhks(row: any) {
    let params = {
      brid: this.formData.brid,
      ghsj: this.formData.ghrq,
      jzkh: this.formData.jzkh,
      ksdm: row.ksdm,
      zblb: this.formData.ghlb,
    }
    aCheckSameGhks(params).then((res: any) => {
      if (res) {
        if (res.errorCode == 'SUCCESS') {
          this.checkExpertSch(row)
        }
        // else if(res.errorCode == 'SUCCESS'){
        // 	this.$notify({

        // 	})
        // }
      }
    })
  }

  // 查询专家或特需门诊是否有排班医生
  private checkExpertSch(row: any) {
    if (row.zjmz == 1 || row.txmz == 1) {
      aCheckExpertSch({ ksdm: row.ksdm }).then((res: any) => {
        if (res) {
        }
      })
    } else {
      // this.getDocList(row)
    }
    this.getDocList(row)
  }

  // 查询排班医生
  private getDocList(row: any) {
    this.loading2 = true
    aQueryDeptSchDoc({ ksdm: row.ksdm }).then((res: any) => {
      if (res) {
        this.tableData2 = res.data
        this.loading2 = false
        // 插入空行
        if (row.zjmz == 1 || row.txmz == 1) {
          if (this.tableData2.length == 0) {
            return false
          } else {
            this.letFocus2()
            this.setFirstRow2()
          }
        } else {
          if (this.tableData2.length == 0) {
            this.handleRegSettlement()
          } else {
            this.tableData2.unshift({})
            this.letFocus2()
            this.setFirstRow2()
          }
        }

        this.tableData2.forEach((item: any) => {
          if (item.pycode == null) {
            item.pycode = ''
          }
        })
        this.tableData2Clone = [...this.tableData2]

        // 匹配预约医生
        if (this.isAppointed) {
          if (!this.appointedInfo.ysdm) {
            // 预约时未选择医生，直接结算
            this.handleRegSettlement()
          } else {
            // 预约时选择医生，选中医生后结算
            // let docIndex = this.tableData2Clone.findIndex((item: any)=>{
            // 	return item.ysdm == this.appointedInfo.ysdm
            // })
            for (let i of this.tableData2Clone) {
              if (i.ysdm == this.appointedInfo.ysdm) {
                this.selectDoc(i) // 接正常挂号流程
                break
              }
            }
          }
        }
      }
    })
  }

  // 右侧双击（选择医生）
  private selectDoc(row: any) {
    this.formData.ysdm = row.ysdm
    this.formData.zjflb = row.zjflb || ''
    this.formData.zjfy = row.expertcost||'0.00'
    if(this.freeMoney||this.isFreeClinic){
      this.formData.zjfy = '0.00'
    }
    this.formData.txfy = row.specialcost||'0.00'
    this.handleRegSettlement()
  }

  // 清空表单
  private resetForm() {
    const formData: any = this.$refs.formData
    console.log(formData)
    formData.resetFields()
    const formData2: any = this.$refs.formData2
    formData2.resetFields()
    this.initReg()
    this.querySchDept()
    // this.tableData1 = [...this.tableData1Clone]
    // this.setFirstRow1()
    this.tableData2 = []
    this.searchData1.pyDept = ''
    this.searchData1.pyDoc = ''
    this.focusJzkh()
    this.isCardFee = false
    this.isRead = 0
    this.isEcQrcode = false
  }

  // 过滤科室
  private filterDept(value: string) {
    this.tableData1 = [...this.tableData1Clone]
    this.tableData1 = this.tableData1.filter((item) => {
      return item.pydm.indexOf(value.toUpperCase()) > -1 || item.szdm.indexOf(value) > -1
    })
    this.setFirstRow1()
  }

  // 过滤医生
  private filterDoc(value: string) {
    this.tableData2 = [...this.tableData2Clone]
    this.tableData2 = this.tableData2.filter((item) => {
      return item.pycode.indexOf(value.toUpperCase()) > -1
    })
    this.setFirstRow2()
  }

  // 获取列表
  private getLists() {
    const pageTable1: any = this.$refs['pageTable1']
    pageTable1.getList()
  }

  // 获取详情
  private getDetail() {}

  // 条件查询
  searchLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }

  // 打开新增弹窗
  private handleAdd(cardno?: any, read?: boolean) { // read，弹窗后是否直接读卡
    console.log('卡号',cardno);
    // const formData: any = this.$refs.formData
    // formData.resetFields()
    var ap: any = this.$refs['add-patient']
    console.log(ap);
    ap.addDialog(cardno, read)
  }
  // 打开修改弹窗
  private handleEdit() {
    // const formData: any = this.$refs.formData
    // formData.resetFields()
    var ap: any = this.$refs['add-patient']
    console.log(ap);
    ap.addDialog(this.formData.jzkh)
  }

  // 退号弹窗
  private handleRegWithdrawal() {
    var rw: any = this.$refs['reg-withdrawal']
    rw.openDialog()
  }

  // 转科弹窗
  private handleRegTransfer() {
    var rt: any = this.$refs['reg-transfer']
    rt.openDialog()
  }

  // 调入弹窗
  private handleRegJoin() {
    var rj: any = this.$refs['reg-join']
    rj.openDialog()
  }
  // 子组件获取病人信息后触发
  private queriedJoinInfo(patientInfo: any, appointedInfo: any) {
    //（病人信息，预约的科室、医生信息）
    this.formData2.brly = appointedInfo.yyly
    // 获取病人信息
    for (let i in patientInfo) {
      this.formData[i] = patientInfo[i]
    }
    // 获取科室信息
    this.appointedInfo = appointedInfo
    this.formData.yyxh = appointedInfo.yyxh
    // this.formData.ysdm = 2

    // 匹配所选科室
    for (let i of this.tableData1Clone) {
      if (i.ksdm == appointedInfo.ksdm) {
        this.isAppointed = true
        this.selectDept(i) // 接正常挂号流程
        break
      }
    }
  }
  // 匹配所选医生
  private matchDoc(ysdm: any) {
    for (let i of this.tableData2Clone) {
      // if(){}
    }
  }
  // 分诊调入弹窗
  private handleRegJoin2() {
    var rj2: any = this.$refs['reg-join2']
    rj2.openDialog()
  }
  // 查询卡号
  private async selectedPatient(preInfo: any,curRow:any) {
    if (preInfo.jzkh) {
      // this.isRead = 0
      this.ghlx = 1
      await this.querySchDept()
      await this.getPatientInfo(preInfo,curRow)
    } else {
      const formData: any = this.$refs.formData
      formData.resetFields()
      this.initReg()
      var ap: any = this.$refs['add-patient']
      ap.addDialog2(preInfo)
    }
    this.formData.lsh = preInfo.lsh
  }

  // 结算弹窗
  private handleRegSettlement() {
    var rj: any = this.$refs['reg-settlement']
    rj.openDialog()
  }

  // 设置下部高度
  calcHeight() {
    var content: any = document.getElementsByClassName('content')[0]
    var upper: any = document.getElementsByClassName('upper')[0]
    var lower: any = document.getElementsByClassName('lower')[0]
    lower.style.height = content.offsetHeight - upper.offsetHeight - 20 + 'px'
  }

  // 是否需要病历费
  private checkMedicalRecordFee(value: boolean) {
    if (value) {
      this.formData.blje = this.blje
    } else {
      this.formData.blje = '0.00'
    }
  }

  // 是否需要磁卡费
  private checkCardFee(value: boolean) {
    if (value) {
      this.formData.ckje = this.ckje
    } else {
      this.formData.ckje = '0.00'
    }
  }
  //是否需要挂号费
  private checkFree(value: boolean) {
    if(value){
      this.formData.ghje = '0.00'
      this.formData.zlje = '0.00'
      this.formData.zjfy = '0.00'
      this.formData.blje = '0.00'
      this.formData.ckje = '0.00'
      this.isCardFee = false
      this.isMedicalRecordFee = false
      this.isFreeClinic = false
      this.isDisabled = true
    }else{
      this.formData.ghje = this.mfje
      this.formData.zlje = this.zlje
      this.isDisabled = false
    }
    
  }
  //义诊
  private checkYz(value:boolean){
    if(value){
      this.formData.ghje = '0.00'
      this.formData.zlje = '0.00'
      this.formData.zjfy = '0.00'
      this.formData.blje = '0.00'
      this.formData.ckje = '0.00'
      this.isCardFee = false
      this.isMedicalRecordFee = false
      this.freeMoney = false
    }else{
      this.formData.ghje = this.mfje
      this.formData.zlje = this.zlje
      this.isDisabled = false
    }
  }
  // 查询大病弹窗
  private changeIsDb(value: any) {
    if (value) {
      if(this.formData.jzkh == ''){
        this.$notify({
          title: '请先读卡',
          message: '',
          type: 'warning'
        })
        this.$nextTick(()=>{
          this.formData.isDb = 0
        })
        
        return false
      }
      const regDb: any = this.$refs.regDb
      regDb.openDialog()
    } else {
      this.formData.dbtype = ''
      this.querySchDept()
    }
  }
  // 选取大病项目
  private selectedDbtype(dbtype: any) {
    this.formData.dbtype = dbtype
    this.querySchDept()
  }
  // 取消大病
  private cancelDb(){
    this.formData.isDb = 0
  }

  // 工伤认定号弹窗
  private openGs(){
    const regGs: any = this.$refs.regGs
    regGs.openDialog()
  }
  // 取消工伤
  private cancelGs(){
    this.formData.isGs = 0
  }

  // 勾选电子凭证
  private checkEcQrcode(value: boolean) {
    if (value) {
    }
  }

  // 上下键选取↓↓↓↓↓↓↓↓↓↓

  // 使输入框获取焦点
  private letFocus1() {
    const inputSearch1: any = this.$refs.inputSearch1
    inputSearch1.focus()
  }
  private letFocus2() {
    const inputSearch2: any = this.$refs.inputSearch2
    inputSearch2.focus()
  }

  // 获取焦点时添加键盘监听
  private focus1() {
    console.log('获取了左侧焦点←')
    addEventListener('keydown', this.keyBoard1)
  }
  private focus2() {
    console.log('获取了右侧焦点→')
    addEventListener('keydown', this.keyBoard2)
  }

  // 失去焦点时移除键盘监听
  private blur1() {
    removeEventListener('keydown', this.keyBoard1)
  }
  private blur2() {
    removeEventListener('keydown', this.keyBoard2)
  }

  // 增加索引
  private tableRowClassName1({ row, rowIndex }: any) {
    this.$set(row, 'index', rowIndex)
  }
  private tableRowClassName2({ row, rowIndex }: any) {
    this.$set(row, 'index', rowIndex)
  }

  // 默认选中第一行
  private setFirstRow1() {
    const table1: any = this.$refs.tableData1
    table1.setCurrentRow(this.tableData1[0])
    this.curRowIndex1 = 0
  }
  private setFirstRow2() {
    const table2: any = this.$refs.tableData2
    table2.setCurrentRow(this.tableData2[0])
    this.curRowIndex2 = 0
  }

  // 点击选取当前行
  private getCurRow1(row: any) {
    this.curRowIndex1 = row.index
    this.letFocus1()
  }
  private getCurRow2(row: any) {
    this.curRowIndex2 = row.index
    this.letFocus2()
  }

  // 键盘-科室
  private keyBoard1(e: any) {
    console.log('键盘')
    const table1: any = this.$refs.tableData1
    if (e.keyCode == 38) {
      // 上
      e.preventDefault()
      if (this.curRowIndex1 != 0) {
        this.curRowIndex1--
        table1.setCurrentRow(this.tableData1[this.curRowIndex1])
      }
    }
    if (e.keyCode == 40) {
      // 下
      e.preventDefault()
      if (this.curRowIndex1 != this.tableData1.length - 1) {
        this.curRowIndex1++
        table1.setCurrentRow(this.tableData1[this.curRowIndex1])
      }
    }
    if (e.keyCode == 13) {
      this.selectDept(this.tableData1[this.curRowIndex1])
    }
  }

  // 键盘-医生
  private keyBoard2(e: any) {
    console.log('键盘')
    const table1: any = this.$refs.tableData2
    if (e.keyCode == 38) {
      // 上
      e.preventDefault()
      if (this.curRowIndex2 != 0) {
        this.curRowIndex2--
        table1.setCurrentRow(this.tableData2[this.curRowIndex2])
      }
    }
    if (e.keyCode == 40) {
      // 下
      e.preventDefault()
      if (this.curRowIndex2 != this.tableData2.length - 1) {
        this.curRowIndex2++
        table1.setCurrentRow(this.tableData2[this.curRowIndex2])
      }
    }
    if (e.keyCode == 13) {
      this.selectDoc(this.tableData2[this.curRowIndex2])
    }
  }
  // 上下键选取↑↑↑↑↑↑↑↑↑↑

  // 快捷键
  private keyBoard3(e: any) {
    //原来是f12改成F2
    // if (e.keyCode == 123) { f12
    if (e.keyCode == 113) { 
      // 建档
      e.preventDefault()
      this.handleAdd()
    }
    
  }
  private readKey(e:any){
    if (e.keyCode == 122) { 
      // 建档
      e.preventDefault()
      this.readCard('1')
    }
  }
  //初始化的周期函数
  async created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 232
    await this.initReg()
    await this.querySchDept()
  }
  mounted() {
    this.calcHeight()
    this.focusJzkh()
    this.$nextTick(() => {
      this.booleanList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.Y_OR_N_DICT : this.$store.state.webSqlDict.Y_OR_N_DICT
      console.log('y/n', this.booleanList)
    })
    addEventListener('keydown', this.keyBoard3)
    addEventListener('keydown', this.readKey)
  }
  beforeDestroy() {
    removeEventListener('keydown', this.keyBoard1)
    removeEventListener('keydown', this.keyBoard2)
    removeEventListener('keydown', this.keyBoard3)
    removeEventListener('keydown', this.readKey)
  }

  // //监听方法
  // @Watch('$store.state.webSqlDict', { deep: true })
  // private onChangeValue(value: any) {
  //   if (value?.Y_OR_N_DICT) {
  //     this.booleanList = value.Y_OR_N_DICT
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.upper {
  // height: 25%;
  margin-bottom: 10px;
}
.lower {
  // height: calc(75% - 10px);
}
.small-header {
  // height: 22px;
  padding-bottom: 8px;
  border-bottom: 1px solid $border;
}
// 单选框
.small-radio-group {
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
// element分割线
.el-divider--vertical {
  height: 12px;
  background-color: $disabled;
}
.el-divider--horizontal {
  float: left;
  margin: 10px 0 14px;
  background-color: $disabled;
}
.btn {
  display: inline-block;
}

//四列表单
.form4 {
  margin: 8px 0 -8px !important;
  .form-area1 {
    float: left;
    width: calc((70% - 18px * 3) / 3);
    margin-left: 18px;
    &:nth-child(4n + 1) {
      width: 30%;
      margin-left: 0;
    }
  }
  .form-area2 {
    float: left;
    width: calc((100% - 18px * 4) / 5);
    margin-left: 18px;
    &:nth-of-type(5n + 1) {
      margin-left: 0;
    }
  }
  .el-form-item {
    display: inline-block;
    &[hidden] {
      display: none;
    }
    width: 100%;
    margin-bottom: 8px !important;
    &.item-card,
    &.item-date {
      width: calc(100% - 80px - 8px);
      min-width: calc(60px + 140px);
      + .el-button {
        width: 80px;
        height: 28px;
        margin-left: 8px;
        padding: 0;
        justify-content: center;
        ::v-deep .icon {
          font-size: 16px;
        }
      }
    }
    &.item-gender {
      width: 70%;
      .search-select {
        width: 100%;
      }
    }
    &.item-age {
      width: calc(30% - 8px);
      margin-left: 8px;
    }
    &.item-date {
      // width: 65%;
    }
    &.item-ampm {
      width: 80px;
      margin-left: 8px;
    }
  }
}

.input-blue {
  ::v-deep .el-input__inner {
    color: $blue;
  }
}

.lower {
  display: flex;
  .lower-left{
    width: calc(100% - 24px - 10px);
  }
  .lower-right{
    width: 24px;
  }
  .lower-right{
    position: absolute;
    z-index: 1;
    right: 6px;
    width: 24px;
    height: 100%;
    margin-left: 10px;
    // transition: all .6s;
    &.is-expand{
      width: 25%;
      box-shadow: -20px 20px 20px 0px rgba(0, 0, 0, 0.1);
    }
  }
  .row {
    padding-bottom: 0;
    .el-input {
      width: auto;
      margin-right: 0 !important;
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

// 账户信息
.accInfo-wrap{
  .row{
  }
  .el-form{
    margin: 0;
  }
  .addnewScroll{
    overflow: auto;
  }
}

// 科室区域
.dept-wrap {
  .el-checkbox {
    margin-right: 6px;
    ::v-deep .el-checkbox__label {
      padding-left: 4px;
      font-size: 13px;
    }
  }
  .row{
    border-bottom: none;
    .label .search ::v-deep .el-input__inner {
      width: 120px;
    }
  }
}
// 医生区域
.doc-wrap {
  .no-reg-doc {
    font-size: 13px;
    color: $second;
    cursor: pointer;
  }
  .row{
    border-bottom: none;
    .label .search ::v-deep .el-input__inner {
      width: 120px;
    }
  }
}
// 电子凭证
.ec-qrcode {
  ::v-deep .el-checkbox__label {
    padding-left: 4px;
    font-size: 13px;
  }
}

// pre{
// 	position: absolute;
// 	right: 0;
// 	bottom: 0;
// 	font-size: 12px;
// }
</style>
