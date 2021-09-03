<template>
  <div>
    <div :style="{ height: expandHeight + 'px' }" class="his-module his-mini his-patient-recipe">
      <div class="label">
        <div class="btn-child">
          <div class="middle-btn">
            <span v-for="(item, index) in blocks" :key="index" :class="{ 'actived-btn': btnChildIndex === index }" @click="changeBtn(item, index)">{{ item.title + item.cfsb }}</span>
          </div>
        </div>
        <div class="row his-recipe">
          <div class="label">
            <div class="querySearch" style="padding-left: 0">
              <span class="searchTitle" style="padding-left: 0">开方日期</span>
              <el-date-picker class="date-wrapper" size="mini" v-model="searchData.kfrq" type="datetime" placeholder="选择日期时间" style="width: 160px" prefix-icon="el-icon-date" disabled></el-date-picker>
            </div>
            <div class="querySearch">
              <el-radio-group class="searchTitle" v-model="searchData.cfid" @change="getYfsb" :disabled="this.filterArray.length > 0">
                <span class="searchTitle">处方类型</span>
                <el-radio :label="1">西药/中成药</el-radio>
                <!-- <el-radio :label="2">中药</el-radio> -->
                <el-radio :label="3">草药</el-radio>
              </el-radio-group>
            </div>
            <div class="querySearch">
              <span class="searchTitle">就诊科室</span>
              <el-select v-model="searchData.ksdmName" placeholder="请选择" disabled></el-select>
            </div>
            <div class="querySearch">
              <span class="searchTitle">开方医生</span>
              <el-select v-model="searchData.ysdmName" placeholder="请选择" disabled></el-select>
            </div>
          </div>
        </div>
        <div class="row his-recipe" v-if="searchData.cfid == 3">
          <div class="label" style="display: flex; justify-content: flex-start; width: 100%"> 
            <div style="width: 58%;display: flex;justify-content: space-between">
              <div style="display: flex;justify-content: flex-start;line-height: 28px;width: 30%">
                <span class="searchTitle" style="padding-left: 0;">草药帖数</span>
                <el-input placeholder="请输入" v-model.number="searchData.cfts" @input="getSummary" style="width: 100%"></el-input>
              </div>
              <div style="display: flex;justify-content: flex-start;line-height: 28px;width: 25%;margin-left: 10px">
                <span class="searchTitle">代煎</span>
                <el-select v-model="searchData.djybz" style="width: 100%">
                  <el-option :value="0" label="否"></el-option>
                  <el-option :value="1" label="是"></el-option>
                </el-select>
              </div>
              <div style="display: flex;justify-content: flex-start;line-height: 28px;width: 25%;margin-left: 10px">
                <span class="searchTitle">方名</span>
                <remote-search-select 
                  searchUrl="/op-service/ypsrf/cyFmJc" 
                  :resultTableHeader="resultTableHeaderCY" 
                  :popover-width="300" 
                  :searchData="searchSelectDataFM" 
                  searchField="pyCode" 
                  showLabel="dataValueRemark" 
                  ref="searchFm" 
                  v-model="searchData.fm" 
                  @getData="setDataFmOrJf"
                  style="width: 100%"
                >
                  <el-select
                    v-model="searchData.fm"
                    ref="select"
                    remote
                    filterable
                    :popper-append-to-body="false"
                    :remote-method="
                      (query) => {
                        remoteMethod(query)
                      }
                    "
                    :clearable="true"
                    placeholder="请输入"
                    style="width: 100%"
                  >
                  </el-select>
                </remote-search-select>
              </div>
              <div style="display: flex;justify-content: flex-start;line-height: 28px;width: 25%;margin-left: 10px">
                <span class="searchTitle">频次</span>
                <el-select v-model="searchData.ypyf" filterable style="width: 100%">
                  <el-option v-for="(item,index) in ypyfList" :key="index" :value="item.dv" :label="item.dn"></el-option>
                </el-select>
              </div>
            </div>
            <!-- 煎服法 -->
            <!-- <div class="querySearch">
              <span class="searchTitle">煎服法</span>
              <remote-search-select searchUrl="/op-service/ypsrf/cyFmJc" :resultTableHeader="resultTableHeaderCY" :popover-width="300" :searchData="searchSelectDataJF" searchField="pyCode" showLabel="dataValueRemark" ref="searchJff" v-model="searchData.jff" @getData="setDataFmOrJf">
                <el-select
                  v-model="searchData.jff"
                  ref="select"
                  remote
                  filterable
                  :popper-append-to-body="false"
                  :remote-method="
                    (query) => {
                      remoteMethod2(query)
                    }
                  "
                  :clearable="true"
                  placeholder="请输入"
                >
                </el-select>
              </remote-search-select>
            </div> -->
            <div style="display: flex;justify-content: flex-start;line-height: 28px;width: 42%;margin-left: 13px">
              <span class="searchTitle">特殊要求</span>
              <el-input placeholder="请输入" v-model="searchData.tsyq" style="width: 100%"></el-input>
            </div>
          </div>
        </div>
        <div class="row" style="margin-bottom: 0; padding: 4px 0">
          <div class="label" style="height: 26px">
            <div class="btn">
              <el-checkbox v-if="searchData.cfid != 3" v-model="isNewGroup" :checked="isNewGroup" text-color="#222B31" style="font-size: 13px">自动新组 </el-checkbox>
              <el-checkbox v-if="searchData.cfid == 3" v-model="isNewGroup" :checked="isNewGroup" text-color="#222B31" style="font-size: 13px" disabled>自动新组 </el-checkbox>
              <el-divider direction="vertical"></el-divider>
              <el-button size="mini" type="text" v-preventReClick @click="handleInsert" :disabled="fphm ? true : false || hasCfq || isHistory">
                <i class="icon his-inserting"></i>
                <span>插入</span>
              </el-button>
              <el-button size="mini" type="text" v-preventReClick @click="handleNewGroup" :disabled="fphm || searchData.cfid == 3 ? true : false || hasCfq || isHistory">
                <i class="icon his-group"></i>
                <span>新组</span>
              </el-button>
              <el-button size="mini" type="text" v-preventReClick @click="handleDelete" :disabled="fphm ? true : false || hasCfq || isHistory">
                <i class="icon his-btn-del red"></i>
                <span>删除</span>
              </el-button>
              <el-button size="mini" type="text" v-preventReClick @click="handleDeleteGroup" :disabled="fphm ? true : false || hasCfq || isHistory">
                <i class="icon his-del-group red"></i>
                <span>删除组</span>
              </el-button>
              <el-button size="mini" type="text" v-preventReClick @click="newCf" :disabled="hasCfq || isHistory">
                <i class="icon his-caozuo-xinchufang"></i>
                <span>新处方</span>
              </el-button>
              <el-button size="mini" type="text" v-preventReClick @click="handleDeleteCf" :disabled="fphm ? true : false || hasCfq || isHistory">
                <i class="icon his-caouo_shanchuchufang red"></i>
                <span>删除处方</span>
              </el-button>
              <el-button size="mini" type="text" v-preventReClick @click="handleCopyCf" :disabled="fphm ? true : false || hasCfq || isHistory">
                <i class="icon his-caozuo_xinzengchufang"></i>
                <span>复制处方</span>
              </el-button>
              <el-button size="mini" type="text" v-preventReClick @click="handleSave(1)" :loading="saveFlag" :disabled="isNull || fphm ? true : false || hasCfq || isHistory">
                <i class="icon his-btn-save green"></i>
                <span>保存</span>
              </el-button>
              <el-button size="mini" type="text" v-preventReClick @click="openSave" :disabled="isNull || hasCfq">
                <i class="icon his-btn-save green"></i>
                <span>另存组套</span>
              </el-button>
              <el-button size="mini" type="text" v-preventReClick @click="printCfj">
                <i class="icon his-btn-print"></i>
                <span>打印</span>
              </el-button>
            </div>
          </div>
        </div>
        <div v-if="searchData.cfid != 3">
          <el-table 
            :data="tableFormat" 
            border 
            :fit="true" 
            tooltip-effect="light" 
            stripe 
            :highlight-current-row="true" 
            :height="listSlotHeight" 
            class="scroll-bar input-table" 
            :row-class-name="tableRowClassName" 
            @row-click="handleGetIndex"
          >
            <el-table-column width="16" class-name="color-group" style="padding: 0">
              <template slot-scope="scope">
                <div class="w100" :class="scope.row.ypzh % 2 === 1 ? 'greenBack' : 'orangeBack'"></div>
              </template>
            </el-table-column>
            <el-table-column width="52">
              <template slot-scope="scope">
                <div class="w100">
                  <span class="dc">{{ scope.row.ypdc | filterDc }} </span>
                  <span class="type">{{ scope.row.type | filterType }}</span>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="zfyp" width="32" label="转">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.zfyp" @change="getSearchData(scope.row)" :true-label="1" :disabled="fphm ? true : false" :false-label="0"></el-checkbox>
              </template>
            </el-table-column> -->
            <el-table-column type="index" width="32"></el-table-column>
            <el-table-column prop="fymc" label="药品名称" min-width="200" label-class-name="first-red">
              <template slot-scope="scope">
                <div>
                  <remoteSearchBox
                    v-model="scope.row.fymc"
                    name="mzys_cf"
                    style="height: 32px"
                    @getData="setData"
                    :ref="`${scope.$index}-1`"
                    :searchData="searchSelectData"
                    :resultTableHeader="resultTableHeader"
                    :searchField="{
                      yp: 'pydm',
                      zt: 'pydm',
                    }"
                    :showLabel="{
                      yp: 'ypmc',
                      zt: 'ztmc',
                    }"
                    :popover-width="630"
                    @keyup.enter.native="nextFocus(scope.$index, 1)"
                    :disabled="fphm ? true : false"
                  ></remoteSearchBox>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="yfgg" label="规格" min-width="106" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.yfgg }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="jb" class-name="text-blue-td" label="几倍" min-width="52">
              <template slot-scope="scope">
                <el-input 
                  v-model="scope.row.jb" 
                  :ref="`${scope.$index}-2`" 
                  style="height: 32px"
                  @input="countYpsl" 
                  @keyup.enter.native="nextFocus(scope.$index, 2)" 
                  @focus="handleSelect(scope.$index,2)"
                  :disabled="fphm ? true : false"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="ycjl" class-name="text-blue-td" label="单次剂量" width="72">
              <!-- <template slot-scope="scope">
                <span>{{ scope.row.jb ? getYcjl(scope.$index) : scope.row.ycjl }}</span>
              </template> -->
            </el-table-column>
            <el-table-column prop="jldw" width="50" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.jldw }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ypyf" label="频次" width="80" label-class-name="first-red">
              <template slot-scope="scope">
                <div>
                  <selectDown 
                    v-model="scope.row.ypyf" 
                    :required="true" 
                    :ref="`${scope.$index}-3`" 
                    style="height: 32px" 
                    :options="ypyfList" 
                    option_label_filed="dn" 
                    option_value_filed="dv" 
                    :is-search="true"
                    @change="changeYpyfByZh" 
                    @keydown.enter.native="nextFocus(scope.$index,3)"
                    :disabled="fphm ? true : false"
                  ></selectDown>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="yyts" label="天数" class-name="text-blue-td" min-width="70" label-class-name="first-red">
              <template slot-scope="scope">
                <div>
                  <el-input
                    v-model="scope.row.yyts" 
                    :ref="`${scope.$index}-4`" 
                    style="height: 32px" 
                    @input="changeYytsByZh" 
                    @keydown.enter.native="nextFocus(scope.$index, 4)" 
                    :disabled="fphm ? true : false" 
                    @focus="handleSelect(scope.$index,4)"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="ypsl" label="总量" class-name="text-blue-td" width="60">
              <template slot-scope="scope">
                <div>
                  <!--						8.2开会  增加需求   总量不可编辑		-->
                  <!--								<input-box-->
                  <!--										v-model="scope.row.ypsl"-->
                  <!--										:ref="`${scope.$index}-5`"-->
                  <!--										style="height: 32px"-->
                  <!--										disabled="true"-->
                  <!--										@blur="getSummary"-->
                  <!--										@keyup.enter.native="nextFocus(scope.$index, 5)"-->
                  <!--								/>-->
                  {{ scope.row.ypsl ? scope.row.ypsl : '' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="yfdw" label="单位" width="60">
              <template slot-scope="scope">
                <span>{{ scope.row.yfdw }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="gytj" label="用法" width="70" label-class-name="first-red">
              <template slot-scope="scope">
                <div>
                  <selectDown 
                    v-model="scope.row.gytj" 
                    :required="true" 
                    :ref="`${scope.$index}-5`" 
                    style="height: 32px" 
                    :options="yfList" 
                    option_label_filed="dn" 
                    option_value_filed="dv" 
                    @change="changeGytjByZh" 
                    :disabled="fphm ? true : false" 
                    :is-search="true" 
                    @keydown.enter.native="nextFocus(scope.$index, 5)"
                  ></selectDown>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="ypcdName" label="药品产地" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.ypcdName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ypdj" label="单价" class-name="text-blue-td" min-width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.ypdj }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="psjg" label="皮试结果" width="80" label-class-name="first-red">
              <template slot-scope="scope">
                <div :class="[scope.row.psjg == 2 ? 'blues' : scope.row.psjg == 3 ? 'reds' : '']">
                  <selectDown 
                    v-model="scope.row.psjg" 
                    :ref="`${scope.$index}-6`" 
                    style="height: 32px" 
                    :options="resultList" 
                    option_label_filed="dn" 
                    option_value_filed="dv" 
                    @change="changeFjxm" 
                    :is-search="true"
                    @keydown.enter.native="nextFocus(scope.$index, 6)" 
                    :disabled="fphm ? true : false"
                  ></selectDown>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="zfbl" label="自付" class-name="text-blue-td" min-width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.zfbl">{{ useMul(scope.row.zfbl, 100) + '%' }}</span>
                <span v-else>{{ scope.row.zfbl == 0 ? scope.row.zfbl + '%' : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="bzxx" :label="$t('备注')" min-width="100">
              <template slot-scope="scope">
                <div>
                  <el-input 
                    v-model="scope.row.bzxx" 
                    :ref="`${scope.$index}-7`" 
                    style="height: 32px"
                    @keydown.enter.native="nextFocus(scope.$index, 7)" 
                    :disabled="fphm ? true : false" 
                  ></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="syyy" label="限用人群" min-width="80">
              <template slot-scope="scope">
                <div>
                  <el-input 
                    v-model="scope.row.syyy" 
                    :ref="`${scope.$index}-8`" 
                    style="height: 32px" 
                    @keydown.enter.native="nextFocus(scope.$index, 8)" 
                    :disabled="fphm ? true : false"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- <pre style="position: absolute; top: 0; right: 0">table{{tableFormat}}</pre>
          <pre style="position: absolute; top: 0; right: 200px">mockdata{{mockDatas}}</pre> -->
        </div>
        <div v-if="searchData.cfid == 3">
          <el-table 
            :data="tableFormat" 
            border 
            :fit="true" 
            tooltip-effect="light" 
            stripe 
            :highlight-current-row="true" 
            :height="listSlotHeight - 45" 
            class="scroll-bar input-table" 
            :row-class-name="tableRowClassName" 
            @row-click="handleGetIndex"
          >
            <el-table-column prop="ypzh" width="16" class-name="color-group">
              <template slot-scope="scope">
                <div class="w100" :class="scope.row.ypzh % 2 === 1 ? 'greenBack' : 'orangeBack'"></div>
              </template>
            </el-table-column>
            <el-table-column width="52">
              <template slot-scope="scope">
                <div class="w100">
                  <span class="dc">{{ scope.row.ypdc | filterDc }} </span>
                  <span class="type">{{ scope.row.type | filterType }}</span>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="zfyp" width="32" label="转">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.zfyp" @change="getSearchData(scope.row)" true-label="1" false-label="0"></el-checkbox>
              </template>
            </el-table-column> -->
            <el-table-column type="index" width="32"></el-table-column>
            <el-table-column prop="fymc" label="药品名称" min-width="140">
              <template slot-scope="scope">
                <div>
                  <remoteSearchBox
                    v-model="scope.row.fymc"
                    name="mzys_cf"
                    style="height: 32px"
                    @getData="setData"
                    :ref="`${scope.$index}-1`"
                    :searchData="searchSelectData"
                    :resultTableHeader="resultTableHeader"
                    :searchField="{
                      yp: 'pydm',
                      zt: 'pydm',
                    }"
                    :showLabel="{
                      yp: 'ypmc',
                      zt: 'ztmc',
                    }"
                    :popover-width="630"
                    @keyup.enter.native="nextFocusCy(scope.$index, 1)"
                    :disabled="fphm ? true : false"
                  ></remoteSearchBox>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="yfgg" label="规格" width="106" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.yfgg }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="jb" class-name="text-blue-td" label="几倍" width="72">
              <template slot-scope="scope">
                <el-input 
                  v-model.number="scope.row.jb" 
                  :ref="`${scope.$index}-2`" 
                  style="height: 32px"
                  @input="uniteYpsl(2)" 
                  @keydown.enter.native="handleInsert"
                  :disabled="fphm ? true : false"
                  @focus="handleSelect(scope.$index,2)" 
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="ycjl" class-name="text-blue-td" label="单次剂量" width="72">
              <!-- <template slot-scope="scope">
                <span>{{ scope.row.jb ? getYcjl(scope.$index) : scope.row.ycjl }}</span>
              </template> -->
            </el-table-column>
            <el-table-column prop="jldw" width="32">
              <template slot-scope="scope">
                <span>{{ scope.row.jldw }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ypsl" :label="'每贴数量'" width="70" class-name="text-blue-td">
              <template slot-scope="scope">
                <span>{{ scope.row.jb ? getMtsl(scope.$index) : scope.row.ycjl }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="yfdw" width="32">
              <template slot-scope="scope">
                <span>{{ scope.row.yfdw }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="gytj" label="用法" width="70">
              <template slot-scope="scope">
                <div>
                  <selectDown 
                    v-model="scope.row.gytj" 
                    :required="true" 
                    style="height: 32px" 
                    @keydown.enter.native="nextFocusCy(scope.$index, 4)" 
                    :options="yfList" 
                    option_label_filed="dn" 
                    :ref="`${scope.$index}-4`" 
                    option_value_filed="dv" 
                    :disabled="fphm ? true : false" 
                    :is-search="true" 
                    @change="changeGytjByZh"
                  ></selectDown>
                </div>
              </template>
            </el-table-column>
            <!--fixme:  -->
            <el-table-column prop="jf" label="煎法" width="70">
              <template slot-scope="scope">
                <div>
                  <selectDown 
                    v-model="scope.row.jf" 
                    :required="true" 
                    :is-search="true"
                    :ref="`${scope.$index}-5`" 
                    style="height: 32px" 
                    :options="jzList" 
                    option_label_filed="dn" 
                    option_value_filed="dv" 
                    @keydown.enter.native="nextFocusCy(scope.$index, 5)" 
                    :disabled="fphm ? true : false"
                  ></selectDown>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="ypcdName" label="药品产地" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.ypcdName }}</template>
            </el-table-column>
            <el-table-column prop="ypdj" label="单价" class-name="text-blue-td" width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.ypdj }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="zfbl" label="自付" class-name="text-blue-td" width="60">
              <template slot-scope="scope">
                <span v-if="scope.row.zfbl">{{ useMul(scope.row.zfbl, 100) + '%' }}</span>
                <span v-else>{{ scope.row.zfbl == 0 ? scope.row.zfbl + '%' : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="bzxx" :label="$t('备注')" width="60">
              <template slot-scope="scope">
                  <input-box 
                    v-model="scope.row.bzxx" 
                    :ref="`${scope.$index}-6`"
                    style="height: 32px" 
                    @keydown.enter.native="nextFocusCy(scope.$index, 6)" 
                    :disabled="fphm ? true : false"
                  ></input-box>
              </template>
            </el-table-column>
            <el-table-column prop="syyy" label="限用人群" width="80">
              <template slot-scope="scope">
                <div>
                  <el-input 
                    v-model="scope.row.syyy" 
                    :ref="`${scope.$index}-7`" 
                    style="height: 32px"
                    :disabled="fphm ? true : false"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="price-bar">
          <p>
            合计：
            <em>¥ {{ summary }}</em>
          </p>
          <el-divider direction="vertical"></el-divider>
          <p>
            自负：
            <em>¥ {{ summaryPay }}</em>
          </p>
        </div>
        <!-- 已收费标志 -->
        <div v-if="fphm && zfpb != 1" class="stamp">
          <i class="icon his-yishoufei blue"></i>
        </div>
        <!-- 已作废标志 -->
        <div v-if="fphm && zfpb == 1" class="stamp">
          <i class="icon his-yizuofei-tuzhang-19 blue"></i>
        </div>

        <!-- 处方笺打印 -->
        <div id="cfj" style="width: 148mm; font-size: 14px;" v-show="false">
          <div style="width: 100%;position: relative;height: 50px;padding-top: 20px" v-if="this.searchData.cfid == 3"> 
            <img id="imgInit1" src="" style="width: 200px; height: 30px; padding-left: 27px" />
            <span style="padding: 0 2px;text-align: center; height: 23px;line-height: 23px;position: absolute;top: 20px; right:28px;border: 1px solid #000">{{"普"}}</span>
          </div>
          <div style="width: 100%;position: relative;height: 45px;padding-top: 20px" v-else> 
            <img id="imgInit2" src="" style="width: 200px; height: 30px; padding-left: 7px" />
            <span style="padding: 0 2px;text-align: center; height: 23px;line-height: 23px;position: absolute;top: 20px; right:10px;border: 1px solid #000">{{"普"}}</span>
          </div>
          <div style="font-size: 24px;font-weight: 700; text-align: center;margin: 0px 0 20px">{{"处方笺"}}</div>
          <div style="display: flex;font-size: 14px; justify-content: center;margin: 10px 0;height: 20px;line-height: 20px">
            <p style="margin: 0">姓名：</p><p style="border-bottom: 1px solid #000; width: 135px;margin: 0;text-align: center">{{printData.hzxm}}</p>
            <p style="margin: 0 0 0 20px">性别：</p><p style="margin: 4px 0 0 0;border: 1px solid #000;width: 12px; height: 12px;line-height: 12px" id="boy">{{printData.hzxb == 1 ? '✔' : ''}}</p><p style="margin:0 7px">男</p><p style="margin: 4px 0 0 0;border: 1px solid #000;width: 12px;height: 12px;line-height: 12px;" id="girl">{{printData.hzxb == 2 ? '✔' : ''}}</p><p style="margin:0 0 0 7px">女</p>
            <p style="margin: 0 0 0 20px">年龄：</p><p style="border-bottom: 1px solid #000; width: 125px;margin: 0;text-align: center">{{printData.hznl}}</p>
          </div>
          <div style="display:flex; font-size: 14px; justify-content: center;height: 20px;line-height: 20px; margin-bottom: 10px">
            <p style="margin: 0">联系电话：</p><p style="border-bottom: 1px solid #000; width: 170px;margin: 0 20px 0 0;text-align: center">{{printData.hzlxdh}}</p>
            <p style="margin: 0">出生日期：</p><p style="border-bottom: 1px solid #000; width: 173px;margin: 0;text-align: center">{{printData.csrq}}</p>
          </div>
          <div style="display: flex; font-size: 14px; justify-content: center;height: 20px;line-height: 20px;margin-bottom: 10px">
            <p style="margin: 0">费别：</p><p style="margin: 4px 0 0 0;border: 1px solid #000;width: 12px; height: 12px;line-height: 12px">{{printData.fb == 1 ? '✔' : ''}}</p><p style="margin:0 7px">医保</p><p style="border: 1px solid #000;width: 12px; height: 12px;margin: 4px 0 0 0; line-height: 12px">{{printData.fb == 2 ? '✔' : ''}}</p><p style="margin:0 7px">非医保</p>
            <p style="margin:0 0 0 35px">医保/就诊卡号：</p><p style="border-bottom: 1px solid #000;width:200px;margin: 0;text-align: center">{{printData.jzkh}}</p>
          </div>
          <div style="display: flex; font-size: 14px; justify-content: center;margin-bottom: 10px;height: 20px;line-height: 20px;">
            <p style="margin: 0">门诊/住院病历号：</p><p style="border-bottom: 1px solid #000; width: 124px;margin:0 20px 0 0;text-align: center">{{printData.blh}}</p>
            <p style="margin: 0">科别/病区-床位号：</p><p style="border-bottom: 1px solid #000; width: 125px;margin: 0;text-align: center">{{printData.ks_bqh}}</p>
          </div>
          <div style="display: flex;font-size: 14px; justify-content: center;margin-bottom: 10px;height: 20px;line-height: 20px;">
            <p style="margin: 0">临床诊断：</p><p style="border-bottom: 1px solid #000; width: 433px;margin: 0;text-align: center">{{printData.lczd}}{{searchData.cfid == 3 ? printData.zh : ''}}</p>
          </div>
          <div style="display: flex;font-size: 14px;justify-content: center;margin-bottom: 5px;height: 20px;line-height: 20px" v-show="this.searchData.cfid == 1">
            <p style="margin: 0">开具日期：</p><p style="border-bottom: 1px solid #000; width: 173px;margin: 0;text-align: center; margin:0 20px 0 0;">{{printData.kjrq_n}}-{{printData.kyrq_y}}-{{printData.kjrq_r}}</p>
            <p style="margin: 0">皮试结果：</p><p style="border-bottom: 1px solid #000; width: 170px;margin: 0;text-align: center">{{printData.psjg}}</p>
          </div>
          <!-- 西药药品排列 -->
          <div style="height: 370px;font-size: 13px;width: 85%;margin-left:45px" v-if="this.searchData.cfid == 1">
            <p style="font-size: 16px;">Rp:</p>
            <div v-for="(item,index) in cfypList" :key="index">
              <div style="display: flex;justify-content: space-between;height: 20px;line-height: 20px;">
                <div style="display: flex;justify-content: flex-start">
                  <p style="margin: 0 10px 0 0">{{item.ypzh}}</p> <p style="margin: 0">{{item.ypmc}}</p>
                </div> 
                <div style="display: flex;justify-content: flex-start">
                  <p style="margin: 0">{{item.ypgg}}</p> <p style="margin: 0 10px">x</p> <p style="margin: 0 10px 0 0">{{item.ypzl}}</p> <p style="margin: 0">{{item.zldw}}</p>
                </div>
              </div>
              <div style="display: flex;justify-content: flex-end; height: 20px;line-height: 20px;">
                <p style="margin: 0">用法：</p> <p style="margin: 0 0 0 10px">{{item.ycjl}}</p> <p style="margin: 0 5px 0 0">{{item.jldw}}</p> <p style="margin: 0">{{item.yypc}}</p> <p style="margin: 0 0 0 10px">{{item.gytj}}</p>
              </div>
              <div style="display: flex;justify-content: flex-end; height: 20px;line-height: 20px;" v-show="item.bzxx">
                <p style="margin: 0">{{item.bzxx}}</p>
              </div>
            </div>
            <div style="width: 100%;">
              <div  style="text-align: center;">----------------以下空白--------------</div>
            </div>
          </div>
          <!-- 草药药品排列 -->
          <div style="height: 395px;font-size: 14px;width: 100%;margin-left: 10px" v-else>
            <p style="font-size: 16px;margin: 5px 0 5px 25px">Rp:</p>
            <div style="width: 100%;margin-left:10px">
              <div v-for="(item,index) in cfypList" :key="index" style="float: left;width: 181px;margin-bottom: 5px">
                <span style="margin: 0;width: 85px;display: inline-block;overflow: hidden;white-space: nowrap;">{{item.ypmc}}</span><span style="margin: 0 0 0 7px;line-height:12px">{{item.ycjl}}</span><span style="margin: 0 7px 0 0;line-height:12px">{{item.jldw}}</span>
              </div>
            </div>
            <div style="width: 100%;padding-top: 3px;float: left">
              <div style="text-align: center;">
                <span v-show="printData.djybz == 1">
                  <span style="margin-right: 10px">代煎费 {{printData.djfdj}}</span>x<span style="margin: 0 10px">{{cfypList.length>0 ? cfypList[0].cfts : 0 }} 贴</span> <span style="margin-right: 10px">总额(元): {{printData.djfzje}}</span> 
                </span>
                <span>贴数 {{cfypList.length>0 ? cfypList[0].cfts : 0 }}</span> 
              </div>
              <div  style="text-align: center;">----------------以下空白--------------</div>
            </div>
          </div>

          <div style="display: flex; justify-content: center;font-size: 14px;margin-bottom: 10px;height: 20px;line-height: 20px">
            <p style="margin: 0">审核：</p><p style="border-bottom: 1px solid #000; width: 108px;margin: 0 20px 0 0;text-align: center">{{printData.sh}}</p>
            <p style="margin: 0">调配：</p><p style="border-bottom: 1px solid #000; width: 108px;margin: 0 20px 0 0;text-align: center">{{printData.tp}}</p>
            <p style="margin: 0">医师：</p><p style="border-bottom: 1px solid #000; width: 108px;margin: 0;text-align: center">{{printData.ys}}</p>
          </div>
          <div style="display: flex; justify-content: center;font-size: 14px;height: 20px;line-height: 20px">
            <p style="margin: 0">核对：</p><p style="border-bottom: 1px solid #000; width: 108px;margin: 0 20px 0 0;text-align: center">{{printData.hd}}</p>
            <p style="margin: 0">发药：</p><p style="border-bottom: 1px solid #000; width: 108px;margin: 0 10px 0 0;text-align: center">{{printData.fy}}</p>
            <p style="margin: 0">药品金额(元)：</p><p style="border-bottom: 1px solid #000; width: 70px;margin: 0;text-align: center">{{printData.ypje}}</p>
          </div>
        </div>

        <!-- 处方精麻套打 -->
        <div id="jmcf" style="width: 132mm; font-size: 12px;border: 1px solid #000;padding-top: 75px;color:#eee;font-weight: 300" v-show="false">
          <div style="display: flex;justify-content: flex-start;height:32px;">
            <p style="margin: 0 0 0 26mm;width: 33mm; font-size: 13px">{{printData.hzxm}}</p>
            <p style="margin: 0 0 0 23mm;width: 40mm; font-size: 13px">{{printData.csrq}}</p>
          </div>
          <div style="display: flex;justify-content: flex-start;height: 32px;margin-top: 0">
            <p style="margin: 0 0 0 8mm;width: 3mm; font-size: 13px">{{printData.hzxb == 1 ? '√' : ''}}</p>
            <p style="margin: 0 0 0 8mm;width: 3mm; font-size: 13px">{{printData.hzxb == 2 ? '√' : ''}}</p>
            <p style="margin: 0 0 0 18mm;width:14mm; font-size: 13px">{{printData.hznl}}</p>
            <p style="margin: 0 0 0 25mm;width: 44mm; font-size: 13px">{{printData.hzlxdh}}</p>
          </div>
          <div style="display: flex;justify-content: flex-start;height: 32px; margin-top: 0">
            <p style="margin: 0 0 0 26mm;width: 41mm; font-size: 13px">{{printData.hzsfzmmc}}</p>
            <p style="margin: 0 0 0 12mm;width: 43mm; font-size: 13px">{{printData.hzbh}}</p>
          </div>
          <div style="display: flex;justify-content: flex-start;height: 32px;margin-top: 3px">
            <p style="margin: 0 0 0 36mm;width: 27mm; font-size: 13px">{{printData.dbrxm}}</p>
            <p style="margin: 0 0 0 19mm;width: 41mm; font-size: 13px">{{printData.dbrlxdh}}</p>
          </div>
          <div style="display: flex;justify-content: flex-start;height: 32px;margin-top: 0">
            <p style="margin: 0 0 0 27mm; width: 40mm; font-size: 13px">{{printData.sfzmmc}}</p>
            <p style="margin: 0 0 0 8mm; width: 47mm; font-size: 13px">{{printData.bh}}</p>
          </div>
          <div style="display: flex;justify-content: flex-start;height: 32px;margin-top: 2px">
            <p style="margin: 0 0 0 17mm; width: 3mm; font-size: 13px">{{printData.fb == 1 ? '√' : ''}}</p>
            <p style="margin: 0 0 0 12mm; width: 3mm; font-size: 13px">{{printData.fb == 2 ? '√' : ''}}</p>
            <p style="margin: 0 0 0 41mm; width: 45mm; font-size: 13px">{{printData.jzkh}}</p>
          </div>
          <div style="display: flex;justify-content: flex-start;height: 32px;margin-top: 0">
            <p style="margin: 0 0 0 41mm; width: 23mm; font-size: 13px">{{printData.blh}}</p>
            <p style="margin: 0 0 0 28mm; width: 31mm; font-size: 13px">{{printData.ks_bqh}}</p>
          </div>
          <div style="display: flex;justify-content: flex-start;height: 32px;margin-top:3px">
            <p style="margin: 0 0 0 26mm; width: 33mm; font-size: 13px">{{printData.lczd}}</p>
            <p style="margin: 0 0 0 20mm; width: 16mm; font-size: 13px">{{printData.kjrq_n}}</p>
            <p style="margin: 0 0 0 3mm; width: 10mm; font-size: 13px">{{printData.kyrq_y}}</p>
            <p style="margin: 0 0 0 3mm; width: 8mm; font-size: 13px">{{printData.kjrq_r}}</p>
          </div>
          <div style="font-size: 13px;width: 82%;margin-left:15px;height: 205px;padding-top:27px">
            <div v-for="(item,index) in cfypList" :key="index">
              <div style="display: flex;justify-content: space-between;height: 20px;line-height: 20px;font-size: 13px">
                <div style="display: flex;justify-content: flex-start; font-size: 13px">
                  <p style="margin: 0 10px 0 0">{{item.ypzh}}</p> <p style="margin: 0">{{item.ypmc}}</p>
                </div> 
                <div style="display: flex;justify-content: flex-start;font-size: 13px">
                  <p style="margin: 0">{{item.ypgg}}</p> <p style="margin: 0 10px">x</p> <p style="margin: 0 10px 0 0">{{item.ypzl}}</p> <p style="margin: 0">{{item.zldw}}</p>
                </div>
              </div>
              <div style="display: flex;justify-content: flex-end; height: 20px;line-height: 20px;font-size: 13px">
                <p style="margin: 0">用法：</p> <p style="margin: 0 0 0 10px">{{item.ycjl}}</p> <p style="margin: 0 5px 0 0">{{item.jldw}}</p> <p style="margin: 0">{{item.yypc}}</p> <p style="margin: 0 0 0 10px">{{item.gytj}}</p>
              </div>
              <!-- <div style="display: flex;justify-content: flex-end; height: 20px;line-height: 20px;" v-show="item.bzxx">
                <p style="margin: 0">{{item.bzxx}}</p>
              </div> -->
            </div>
            <div style="width: 100%;">
              <div  style="text-align: center;font-size: 13px">----------------以下空白--------------</div>
            </div>
          </div>
          <div style="display: flex;justify-content: flex-start;height:32px;font-size: 13px">
            <p style="width: 26.5mm;margin: 0 0 0 21mm;font-size: 13px">{{printData.sh}}</p>
            <p style="width:18mm;margin: 0 0 0 12.5mm;font-size: 13px">{{printData.tp}}</p>
            <p style="width: 31mm;margin: 0 0 0 13mm;font-size: 13px">{{printData.ys}}</p>
          </div>
          <div style="display: flex;justify-content: flex-start;height: 32px;font-size: 13px;margin-top: 1mm">
            <p style="margin: 0 0 0 30mm;width:39mm;font-size: 13px">{{printData.hd}}</p>
            <p style="margin: 0 0 0 26mm;width: 27mm;font-size: 13px">{{printData.ypje}}</p>
          </div>
        </div>


        <!-- 处方复制 -->
        <el-dialog title="处方复制" :visible.sync="dialogVisible" append-to-body :before-close="handleClose" width="90%" v-if="dialogVisible">
          <outpatientPrescription :cfLength="tableFormat" v-if="dialogVisible" :pnParam="pnParam" @setList="setList" :yfsb="searchData.yfsb"></outpatientPrescription>
        </el-dialog>

        <!-- 麻精一弹窗身份证明弹窗 -->
        <el-dialog title="代办信息" :visible.sync="mjVisible" width="37%" class="narrow-dialog mjcf-dialog" :close-on-click-modal="false" @close="changeModel">
          <div style="margin: 5px 0 10px">
            <el-radio v-model="isBr" label="1" @change="changeModel">本人</el-radio>
            <el-radio v-model="isBr" label="2" @change="changeModel">代办人</el-radio>
          </div>
          <el-form :model="mjcfData" label-width="105px" :rules="this.isBr==1 ? null : mjcfRule" ref="mjcfRef">
            <el-row style="display: flex;justify-content: center">
              <el-form-item label="代办人姓名" prop="dbrxm" style="margin-right: 10px" :disabled="this.isBr==1">
                <el-input v-model="mjcfData.dbrxm" placeholder="请输入" :disabled="this.isBr==1"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="dbrlxdh" :disabled="this.isBr==1">
                <el-input v-model="mjcfData.dbrlxdh" placeholder="请输入" :disabled="this.isBr==1"></el-input>
              </el-form-item>
            </el-row>
            <el-row style="display: flex;justify-content: center">
              <el-form-item label="身份证明" prop="sfzm" style="margin-right: 10px" :disabled="this.isBr==1">
                <el-select v-model="mjcfData.sfzm" placeholder="请选择" :disabled="this.isBr==1">
                  <el-option v-for="item in idList" :key="item.dv" :value="item.dv" :label="item.dn"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="编号" prop="bh" :disabled="this.isBr==1">
                <el-input v-model="mjcfData.bh" placeholder="请输入" :disabled="this.isBr==1"></el-input>
              </el-form-item>
            </el-row>
            
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="mjVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSave(7)">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog :visible.sync="isVisiable" width="70%" :append-to-body="true" class="narrow-dialog" @closed="closed">
          <div slot="title">
            <div>{{ $t('publicInfo.drugAttributes') }}</div>
          </div>
          <div class="content his-dialog">
            <div class="his-module his-small his-mini">
              <el-table ref="tableList" @selection-change="handleSelectionChange" :data="tableformats" border :fit="true" stripe tooltip-effect="light" :highlight-current-row="true" slot="list" class="scroll-bar">
                <el-table-column type="selection" width="26"></el-table-column>
                <el-table-column prop="webSortNumber" width="26"></el-table-column>
                <el-table-column prop="ypzh" width="26" class="table-ypzh" class-name="color-group">
                  <template slot-scope="scope">
                    <div class="w100" :class="scope.row.ypzh % 2 === 1 ? 'greenBack' : 'orangeBack'"></div>
                  </template>
                </el-table-column>
                <el-table-column prop="xmmc" label="药品名称" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column prop="xmsl" label="数量" width="50"></el-table-column>
                <el-table-column prop="ypgg" label="规格" width="100"></el-table-column>
                <el-table-column prop="ypgg" label="产地" width="100">
                  <template slot-scope="scope">
                    <div>
                      <selectDown v-model="scope.row.cdmc" :required="true" :ref="`${scope.$index}-6`" style="height: 32px" :options="scope.row.cdList" option_label_filed="cdmc" option_value_filed="cdmc" label1="lsjg" label2="cdmc" @getData="getLsjg"></selectDown>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="ycjl" label="剂量" width="50"></el-table-column>
                <el-table-column prop="jldw" width="32"></el-table-column>
                <el-table-column prop="yyts" label="天数" width="50"></el-table-column>
                <el-table-column prop="gytjName" label="途径" width="60"></el-table-column>
                <el-table-column prop="sypc" label="频次" width="60"></el-table-column>
                <el-table-column prop="fydj" label="单价" width="80"></el-table-column>
              </el-table>
            </div>
          </div>
          <div slot="footer" class="dialog-footer foot">
            <el-button @click="isVisiable = false">{{ $t('common.close') }}</el-button>
            <el-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</el-button>
          </div>
        </el-dialog>
        <el-dialog class="scroll-bar kjyw" :close-on-click-modal="false" :close-on-press-escape="false" title="抗菌药物使用申请单" :visible.sync="antibioticsVisible" top="2vh" width="1000px">
          <antibioticsReq ref="antibioticsReq" :resData="currResData" @close="antibioticsVisible = false" :patientFile="patientFile" :key="antibioticsKey" />
          <span slot="footer" class="dialog-footer">
            <el-button @click="antibioticsVisible = false">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" @click="handleDetermine">{{ $t('common.confirm') }}</el-button>
          </span>
        </el-dialog>

        <!-- 另存为弹窗 -->
        <el-dialog :close-on-click-modal="false" title="另存为组套" :visible.sync="saveasVisiable" width="70%" style="height: auto;padding: 0" @close="clearData">
          <div class="row">
            <div class="label">
              <span class="tag">组套类型:</span>
              <el-radio-group v-model="ztData.sslb" style="width: 158px">
                <el-radio :label="1">个人</el-radio>
                <el-radio :label="2">科室</el-radio>
                <el-radio :label="3">全院</el-radio>
              </el-radio-group>
              <el-divider direction="vertical"></el-divider>
              <span class="tag">组套名称:</span>
              <el-input v-model="ztData.ztmc" style="width: 168px" placeholder="请输入组套名称"></el-input>
            </div>
          </div>
          <el-table 
            ref="selectAllData" 
            :data="tableLcformat" 
            border 
            :fit="true" 
            tooltip-effect="light" 
            stripe 
            highlight-current-row 
            :height="listSlotHeight + 20" 
            @selection-change="handleSelectSave"
          >
            <el-table-column prop="ypzh" width="16" class-name="color-group">
              <template slot-scope="scope">
                <div class="w100" :class="scope.row.ypzh % 2 === 1 ? 'greenBack' : 'orangeBack'"></div>
              </template>
            </el-table-column>
            <el-table-column type="selection" width="32" :reserve-selection="true"></el-table-column>
            <el-table-column type="index" width="32"></el-table-column>
            <el-table-column label="药品名称" prop="fymc" show-overflow-tooltip min-width="130"></el-table-column>
            <el-table-column label="规格" prop="yfgg" show-overflow-tooltip min-width="100"></el-table-column>
            <el-table-column label="几倍" prop="jb" width="50" v-show="this.searchData.cfid == 1"></el-table-column>
            <el-table-column label="单次剂量" prop="ycjl" width="70"></el-table-column>
            <el-table-column prop="jldw" show-overflow-tooltip width="50"></el-table-column>
            <el-table-column label="频次" prop="ypyf" min-width="60"></el-table-column>
            <el-table-column label="天数" prop="yyts" width="60" v-if="false"></el-table-column>
            <el-table-column label="总量" prop="ypsl" width="60"></el-table-column>
            <el-table-column prop="yfdw" width="60"></el-table-column>
            <el-table-column label="用法" prop="gytj" width="70" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{ yfList.find((item) => item.dv == scope.row.gytj) && yfList.find((item) => item.dv == scope.row.gytj).dn }}</div>
              </template>
            </el-table-column>
            <el-table-column label="煎法" prop="jf" width="70" show-overflow-tooltip v-if="this.searchData.cfid == 3">
              <template slot-scope="scope">
                <div>{{ jzList.find((item) => item.dv == scope.row.jf) && jzList.find((item) => item.dv == scope.row.jf).dn }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="ypcdName" label="药品产地" min-width="140" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.ypcdName }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="单价" prop="ypdj" width="80"></el-table-column> -->
            
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button @click="saveasVisiable = false">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" @click="saveStack">{{ $t('common.confirm') }}</el-button>
          </span>
        </el-dialog>

        <!--	关于打印	-->
        <div class="statement-box" v-show="false">
          <statement
            ref="statement"
            :html-api="'/op-service/mzcf/cfPrint'"
            :html-search-data="htmlSearchData"
            :height="listSlotHeight + 26"
            :print-arg="{
              top: '8%',
              left: '10%',
              width: '90%',
              height: '87%',
            }"
            @hadUrl="getPrintUrl"
          />
        </div>
      </div>
    </div>
    <div>
      <!-- 往上展开 -->
      <div v-if="!isShowFj" @click="expandFj" :style="{ height: '24px' }" class="his-module his-small mt10 action his-unexpand">
        <i class="his-shang_zhankai icon gray"></i>
      </div>
      <div v-else class="his-module his-small mt10" style="height: auto">
        <div class="row his-expand" style="margin-bottom: 0; padding: 4px 0">
          <div class="label" style="height: 26px">
            <div class="btn" v-show="false">
              <el-button size="mini" type="text" @click="handleInsertFj">
                <i class="icon his-inserting"></i>
                <span>插入</span>
              </el-button>
              <el-button size="mini" type="text" @click="handleDeteleFj">
                <i class="icon his-btn-del red"></i>
                <span>删除</span>
              </el-button>
            </div>
          </div>
          <!-- 下-收起 -->
          <div @click="expandFj">
            <i class="his-xia_shouqi icon gray"></i>
          </div>
        </div>
        <el-table :data="mockDatasFj" border :fit="true" stripe :highlight-current-row="true" slot="list" class="scroll-bar no-underline" :height="listSlotHeight" :row-class-name="tableRowClassNameFj" @row-click="handleGetIndexFj">
          <el-table-column type="index" width="32"></el-table-column>
          <el-table-column prop="psmc" label="附加项目名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="pssl" label="附加项目数量" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="psje" label="附加项目金额"></el-table-column>
          <el-table-column prop="dw" label="附加项目单位"></el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 药品备注信息展示 -->
    <div class="his-drugBzxx clearFix" v-show="ishasBzxx">
      <div class="row">
        <div class="his-label">
          <p class="title">提示</p>
          <el-button type="text" size="mini" @click="closeBzxx">
            <i class="icon his-close his-iconClose"></i>
          </el-button>
        </div>
      </div>
      <div class="his-bzxx scroll-bar">
        <p v-for="(item,index) in this.bzxxList" :key="index">{{item.ypmc}}：{{item.bzxx}}</p>
      </div>
    </div>

    <!-- 皮试结果信息 -->
    <div class="his-drugBzxx clearFix" v-show="ishasPsxx">
      <div class="row">
        <div class="his-label">
          <p class="title">提示</p>
          <el-button size="mini" type="text" @click="closePsxx">
            <i class="icon his-close his-iconClose"></i>
          </el-button>
        </div>
      </div>
      <div class="his-bzxx scroll-bar">
        <p v-for="(item,index) in this.psxxList" :key="index" :class="[item.psjg == 2 ? 'blues' : 'reds']">{{item.message}}</p>
      </div>
    </div>

    <!-- 新处方未保存时的提示 -->
    <el-dialog :close-on-click-modal="false" title="提示" :visible.sync="newCfInfo" width="420px" class="narrow-dialog newCfDialog" style="height: auto">
      <div class="row" style="border-bottom: none">
        <div class="label">
          <i class="icon his-jinggaowenan yellow"></i>
          <span style="margin-left: 6px">处方录入模块数据已经修改，是否保存?</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newCfInfo = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="saveNewCfInfo">{{ $t('common.confirm') }}</el-button>
      </span>
    </el-dialog>

    <!-- CA验证 -->
    <div class="outDoor" v-if="certificateVisible" :height="listSlotHeight + 320">
      <div class="certificateClass">
        <div class="textCode"><span style="display: block" class="outdoorText">二维码展示</span> <span class="refreshText" @click="refreshBtn">刷新</span></div>
        <img :src="imgURL" width="280px" height="280px" alt="" />
        <span style="text-align: center; display: block" class="outdoorTextTwo">{{ bizsntext == '' ? '请扫码' : bizsntext }}</span>
      </div>
    </div>
    <div class="outDoorCopy" v-if="certificateVisible" :height="listSlotHeight + 320"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { ISvaeObj, getPayProp, saveCf01, findDetails, findList, removeMedcineInfo, findAddition, getDoctPersimmion, getSkinTest, getPubParams, checkDetailInfo, queryFjxm, getPsxmByDrugs, isUse, addzt, getCfPrintData, queryLogo, smartRemind, getPsxmList} from '@/api/cis/op/dctwork/recipe'
import { initManage, initVariable } from '@/api/his/im/residentDoctor/orderEntry'
import { queryYfsb } from '@/api/cis/op/dctwork/pharmacySet'
import { AxiosResponse } from 'axios'
import outpatientPrescription from '@/views/cis/op/dctwork/patients/components/model/outpatientPrescription.vue'
import { getNow } from '@/api/his/basic'
import { getFloat, id2Name, parseTime, mul } from '@/utils'
import { queryDetail } from '@/api/cis/op/dctwork/examineSuite'
import antibioticsReq from './antibioticsReq.vue'
import { getCfTwoCode, watchCode } from '@/api/users'
import { getLodop } from '@/plugins/lodop/index.js'
import { log } from 'util'
import { regIDCard, regPhone} from '@/utils/validate'
import { emit } from 'cluster'

export const NSaveObj: ISvaeObj = {
  // webSortNumber: 1,
  zfyp: 0,
  bzxx: '',
  djzt: null,
  dzbl: null,
  fygb: null,
  fymc: '',
  hjje: null,
  jgid: null,
  jlsl: null,
  jb: null, // 几倍剂量
  gytj: '', // 途径
  ypyf: '', // 频次
  ypdj: '', // 药品单价
  mrcs: 1, // 每日次数
  jlxh: null,
  mzxh: null,
  opStatus: '',
  psjg: null,
  pageNum: null,
  pageSize: null,
  sbxh: null,
  spbh: null,
  sqdh: null,
  xflsh: '',
  xmlx: null,
  yjxh: null,
  yjzh: null,
  yjzx: null,
  yldj: null,
  ylsl: null,
  ylxh: null,
  ypzh: null,
  yxms: null,
  yyts: null,
  zfbl: null,
  zfpb: null,
  zhje: null,
  zkbl: null,
  zkje: null,
  ztbh: null,
  ztbz: null,
  ztyzsbxh: null,
  zxpb: null,
}
@Component({
  name: 'RecipeForm',
  components: {
    outpatientPrescription,
    antibioticsReq,
  },
  filters: {
    filterDc(value: number) {
      switch (value) {
        case 1:
          return '国'
        case 2:
          return '合'
        case 3:
          return '进'
        default:
          return '非'
          break
      }
    },
    filterType(value: number) {
      switch (value) {
        case 1:
          return '西'
        case 2:
          return '中'
        case 3:
          return '草'
      }
    },
  },
})
export default class extends Vue {
  // @Prop({ required: true }) private pnParam!: any
  @Prop({ required: true }) private patientFile!: any
  @Prop({ required: true }) private value!: any
  @Prop({ required: true }) private hasCfq!: boolean
  @Prop({ required: true }) private isHistory!: boolean
  // @Prop({ required: true }) private FPHM!: any
  private pnParam: any = {}
  private isVisiable: boolean = false
  private tableList: Array<any> = []
  private antibioticsVisible: boolean = false
  private tjList: Array<any> = [] // 给药途径
  private multipleSelection: Array<any> = []
  private step = 1
  private MZYP: string = ''
  private JSYP: string = ''
  private QYKJYWGL: string = ''
  private htmlSearchData: any = {
    brxz: '',
    cfsb: '',
    jzkh: '',
    silentPrint: 1,
  }
  private currResData: any = {}
  private antibioticsKey: number = 0
  private cfypList: Array<any> = [] // 存储处方药品
  private printData: any = {} // 存放普通西药方打印的数据
  private yfList: Array<any> = [] // 用法
  private ysqx: boolean = false // 医生使用抗菌药权限
  private KSLB: any = Vue.prototype.AUTHORITY.kslb // 判断科室是否为中医科室
  private newXcf: boolean = false // 在未保存处方时，去开新处方的标志
  private saveasVisiable: boolean = false // 另存为弹窗
  private saveasData: Array<any> = [] // 另存组套表格数据
  private saveArr: Array<any> = [] // 需要另存组套的数据
  private ztlxData: any = '个人'
  private value1: any = ''
  private newCfInfo: boolean = false // 新处方前保存的提示
  private loGo: any = '' // logo
  private mjVisible: boolean = false // 麻精一弹窗默认隐藏
  private mzxyzdcfs: number = 0 // 门诊西药最大处方数
  private mzcyzdcfs: number = 0 // 门诊草药最大处方数
  private mzxydzcfzdyps: number = 0 // 门诊西药方单张处方最大药品数
  private mzcydzcfzdyps: number = 0 // 门诊草药方单张处方最大药品数
  private dzcfzdzcysl: number = 0 // 单张处方最大中成药数量
  private xylx: string = '' // 西药房类型（系统参数）
  private cylx: string = '' // 草药房类型（系统参数）
  private bzxxVisible: boolean = false // 备注信息弹窗
  private idList: any = [] //证件类别
  private isBr: string = '1' // 是否为本人
  private mjcfData:any = {
    dbrxm: '',
    dbrlxdh: '',
    sfzm: '',
    bh: '',
  }
  private mjcfRule:any = {
    dbrxm: [ { required: true, message: '请填写信息', trigger: 'blur' } ],
    dbrlxdh: [{ required: true, pattern: regPhone, message: window.ele.$i18n.t('emp.vdPhone'), trigger: 'blur' }],
    sfzm: [ { required: true, message: '请填写信息', trigger: 'change' } ],
    bh: [{ required: true, pattern: regIDCard, message: window.ele.$i18n.t('emp.vdIDCard2'), trigger: 'blur' }],
  }
  get mockDatas() {
    if (this.value.length == 0) {
      this.isNull = true
    } else {
      this.isNull = false
    }
    return this.value
  }

  set mockDatas(value: any) {
    this.$emit('input', value)
  }
  private saveFlag: boolean = false // 保存防重复点击
  private isShowFj: boolean = false
  private summary: number = 0
  private summaryPay: number = 0
  private mockDatasFj: Array<any> = []
  private dialogVisible: boolean = false
  private rowIndex: number = -1
  private rowIndexFj: number = -1
  private isNewGroup: boolean = false
  private isSave: boolean = true //判断数据是否保存
  private cfsb: string = ''
  private btnChildIndex: number = 0
  private CFSB: string = '' // 处方识别
  private ishasBzxx: boolean = false // 备注信息弹窗
  private sameGroup: Array<any> = []
  private bzxxList: Array<any> = [] // 备注信息数组
  private searchData: any = {
    cflx: '1',
    pageNum: 1,
    pageSize: 20,
    pydm: '',
    yfsb: '',
    cfid: 1,
    cfts: 1,
    djybz: 0,
    fm: '',
    jff: '',
    tsyq: '',
    ypyf: 'qd',
  }
  private searchSelectData: any = {
    yp: {
      cflx: this.searchData.cfid,
      yfsb: this.searchData.yfsb,
      showGb: 1,
      zfyp: 0,
    },
    zt: {
      ztlb: this.searchData.cflx,
      ksdm: Vue.prototype.AUTHORITY.outpatientCode,
    },
  }

  private searchSelectDataFM: any = {
    primarydataId: '824',
    pageNum: 1,
    pageSize: 10,
  }
  private searchSelectDataJF: any = {
    primarydataId: '825',
    pageNum: 1,
    pageSize: 10,
  }
  private resultTableHeaderCY = [
    {
      prop: 'dataValueRemark',
      label: '方名',
      width: 250,
    },
  ]
  private resultTableHeader: any = {
    yp: [
      {
        prop: 'ypmc',
        label: '药品名称',
        width: 250,
      },
      {
        prop: 'yfgg',
        label: '药房规格',
        width: 80,
      },
      {
        prop: 'yfdw',
        label: '单位',
        width: 50,
      },
      {
        prop: 'cdmc',
        label: '药品产地',
        width: 80,
      },
      {
        prop: 'lsjg',
        label: '价格',
        width: 50,
      },
      {
        prop: 'ypsl',
        label: '库存',
        width: 50,
      },
    ],
    zt: [
      {
        prop: 'ztmc',
        label: '药品名称',
      },
    ],
  }

  private resultTableHeaderFj: any = {
    yp: [
      {
        prop: 'fymc',
        label: '药品名称',
        width: 270,
      },
    ],
    zt: [
      {
        prop: 'fymc',
        label: '药品名称',
        width: 150,
      },
    ],
  }

  private listSlotHeight: number = 0
  private listSlotHeightCY: number = 0
  private expandHeight: number = Vue.prototype.PageHeight
  private deptId: string = Vue.prototype.AUTHORITY.bussinessRole
  private fphm: string = ''
  private zfpb: string = ''
  private ZTMC: string = '' //  组套名称
  private pyCode: string = '' // 拼音代码
  private ZTLB: number = 0 // 组套类别
  private cfList: any = {}
  private cdList: Array<any> = []
  private resultList: Array<any> = []
  private ypyfList: Array<any> = [] // 药品用法
  private jzList: Array<any> = [] // 煎法字典
  private ghksList: Array<any> = [] // 挂号科室列表字典
  private ysList: Array<any> = [] // 医生
  private mrpcList: Array<any> = [] // 频次-每日次数字典
  private isPermit: number = 0 // 门诊是否允许使用抗菌药物
  private maxDay: number = 0 // 门诊允许使用抗菌药物的最大天数
  private maxDayMethod: number = 0 // 门诊抗菌药物使用超最大天数的管控方式
  private isNull: boolean = true // 判断是否为空数据，空数据不允许保存
  private MJYP: string = '' // 麻精药品（系统参数）
  private mjypArr: Array<any> = [] // 麻精药品数组
  private xyfList: Array<any> = [] // 西药方数组
  private cyfList: Array<any> = [] // 草药方数组
  private psxxList: Array<any> = [] //所有皮试结果信息
  private ishasPsxx: boolean = false // 是否存在皮试信息
  private ztData: any = {
    jzlsh: '', // 就诊流水号
    ksdm: Vue.prototype.AUTHORITY.outpatientCode, // 科室代码
    opZt02AddReq: [],
    sslb: 1, // 所属类别 1.个人组套 2.科室组套 3.公用组套
    ztlb: 1, // 组套类别 1.西药 2.中药 3.草药 4.项目
    ztlx: '',
    ztmc: '', // 组套名称
  } // 另存组套字段

  private blocks: Array<any> = [
    {
      name: 0,
      title: '新处方',
      cfsb: '',
      kfrq: '',
      fphm: '',
      zfpb: '',
      cflx: ''
    },
  ]
  //新加
  private certificateVisible: boolean = false
  private bizsn: any = ''
  private imgURL: any = ''
  private bizsnList: any = []
  private bizsntext: any = ''
  private timeId: any = ''
  private timeNumber: number = 0
  private qrCodeId: any = ''

  // 计算单次剂量
  getYcjl(num: number) {
    let cc = this.mockDatas[num]
    let aa = this.searchData.cfid == 3 ? getFloat(cc.ycjl ? cc.jb * 1 : 1, 2) : getFloat(cc.ycjl ? cc.ypjl * cc.jb : 1, 2)
    return aa
  }
  getMtsl(num: number) {
    let cc = this.mockDatas[num]
    let aa = this.searchData.cfid == 3 ? getFloat(cc.ycjl ? cc.jb * 1 : 1, 2) : getFloat(cc.ycjl ? cc.ypjl * cc.jb : 1, 2)
    return aa
  }

  // 通过监听处方id实时更新右侧组套的cfsb
  @Watch('searchData.cfid', { immediate: true, deep: true })
  private getMzcfid(val: any) {
    this.$emit('getMzcfid', this.searchData.cfid)
  }

  @Watch('timeNumber')
  private onTimeNumber(val: any) {
    if (val > 120) {
      clearInterval(this.timeId)
      this.timeId = null
      this.timeNumber = 0
      this.bizsntext = '扫码已超时，请刷新二维码'
    }
  }
  beforeDestroy() {
    clearInterval(this.timeId)
    this.timeId = null
    this.timeNumber = 0
    this.certificateVisible = false
  }
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 320
    this.listSlotHeightCY = Vue.prototype.PageHeight - 360
    this.expandHeight = Vue.prototype.PageHeight - 164
  }

  mounted() { 
    this.pnParam = this.$store.state.pnParam.PN_PARAM
    this.idList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.IDCARD_DICT :this.$store.state.webSqlDict.IDCARD_DICT
    this.htmlSearchData.brxz = this.$store.state.pnParam.PN_PARAM.brxz
    this.htmlSearchData.jzkh = this.$store.state.pnParam.PN_PARAM.jzkh
    this.resultList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.PS_RESULT_DICT : this.$store.state.webSqlDict.PS_RESULT_DICT
    this.ypyfList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.FREQUENCY_DICT : this.$store.state.webSqlDict.FREQUENCY_DICT
    this.jzList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.JZ_DICT : this.$store.state.webSqlDict.JZ_DICT
    this.ghksList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REGISTERATION_DEPARTMENT_DICT : this.$store.state.webSqlDict.REGISTERATION_DEPARTMENT_DICT
    this.ysList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT
    this.mrpcList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.FREQUENCY_DAY_DICT : this.$store.state.webSqlDict.FREQUENCY_DAY_DICT
    // this.resultList = [{ dn: ' ', dv: '0' }, ...list]
    this.yfList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_METHOD_DICT : this.$store.state.webSqlDict.DRUG_METHOD_DICT
    // 调用公共参数，获得   [ 门诊药品   精神药品	启用抗菌药物管理,是否代煎，门诊西药最大处方数，门诊草药最大处方数，门诊西药方单张处方最大药品数，门诊草药方单张处方最大药品数，处方打印麻、精一，处方打印精二 ]
    getPubParams({ commons: ['MZYP', 'JSYP', 'QYKJYWGL', 'SFDJ','MZXYZDCFS','MZCYZDCFS','MZXYDZCFZDYPS','MZCYDZCFZDYPS','CFDYMJY','CFDYJE','DZCFZDZCYSL'] }).then((res: AxiosResponse) => {
      this.MZYP = res.data.MZYP
      this.JSYP = res.data.JSYP
      this.QYKJYWGL = res.data.QYKJYWGL
      this.MJYP = res.data.CFDYMJY
      // this.searchData.djybz = parseInt(res.data.SFDJ)
      this.mjypArr = this.MJYP.split(',')
      this.mzxyzdcfs = res.data.MZXYZDCFS // 门诊西药最大处方数
      this.mzcyzdcfs = res.data.MZCYZDCFS // 门诊草药最大处方数
      this.mzxydzcfzdyps = res.data.MZXYDZCFZDYPS // 门诊西药方单张处方最大药品数
      this.mzcydzcfzdyps = res.data.MZCYDZCFZDYPS // 门诊草药方单张处方最大药品数
      this.dzcfzdzcysl = res.data.DZCFZDZCYSL ? Number(res.data.DZCFZDZCYSL) : 5// 单张处方最大中成药数量
    })
    this.getInitVariable()
    this.tjList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_METHOD_DICT : this.$store.state.webSqlDict.DRUG_METHOD_DICT
    this.getNowDate() // 获取当前时间

    // this.queryPrintLogo() // 获取打印的医院logo
    this.searchData.ksdm = Vue.prototype.AUTHORITY.bussinessRole // 挂号科室
    this.searchData.ysdm = JSON.parse(localStorage.getItem('userInfo') as string).userId // 医生id
    this.cdList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_DRUGMADEIN_DICT : this.$store.state.webSqlDict.DRUG_DRUGMADEIN_DICT

    // 获取处方列表
    findList({ jzxh: this.pnParam.jzxh }).then((res: any) => {
      if (res.data.length > 0) {
        this.searchData.cfid = res.data[0].cflx
        this.searchData.djybz = res.data[0].djybz
        this.CFSB = res.data[0].cfsb
        this.htmlSearchData.cfsb = res.data[0].cfsb
        this.$emit('getFphm', res.data[0].fphm)
        this.blocks.length = res.data.length
        res.data.forEach((item: any, index: number) => {
          if (item.cflx == 1) {
            // this.searchData.cfid = 1
            return (this.blocks[index] = {
              title: '西药方',
              name: index,
              cfsb: item.cfsb,
              kfrq: item.kfrq,
              fphm: item.fphm,
              zfpb: item.zfpb,
              cflx: item.cflx,
            })
          } else if (item.cflx == 2) {
            // this.searchData.cfid = 2
            return (this.blocks[index] = {
              title: '中药方',
              name: index,
              cfsb: item.cfsb,
              kfrq: item.kfrq,
              fphm: item.fphm,
              zfpb: item.zfpb,
              cflx: item.cflx,
            })
          } else if (item.cflx == 3) {
            // this.searchData.cfid = 3
            if (index == 0) {
              this.searchData.fm = item.fm
              this.searchData.jff = item.jff
              this.searchData.tsyq = item.tsyq
            }
            return (this.blocks[index] = {
              title: '草药方',
              name: index,
              cfsb: item.cfsb,
              kfrq: item.kfrq,
              fphm: item.fphm,
              zfpb: item.zfpb,
              cflx: item.cflx,
            })
          }
        })
        this.cfsb = this.blocks[0].cfsb
        this.fphm = this.blocks[0].fphm
        this.zfpb = this.blocks[0].zfpb
        this.btnChildIndex = this.btnChildIndex ? 0 : this.btnChildIndex

        // this.$emit('getSfbz',this.fphm)
      } else {
        this.blocks.length = res.data.length
        this.newRecipel() // 新处方
      }
      if (res.data[0] && res.data[0].cfsb && res.data[0].cfsb != '') {
        this.cfsb = res.data[0].cfsb
        this.$set(this.searchData, 'kfrq', res.data[0].kfrq)
        findDetails({ cfsb: this.cfsb }).then((response: any) => {
          if (res.errorCode == 'SUCCESS') {
            this.mockDatas = response.data
            // this.queryPsxmDrugs(response.data)
            this.getPsxmList(this.cfsb) // 处方页面刚进来时获取皮试数据
            if (response.data[0].cfts) {
              this.searchData.cfts = response.data[0].cfts
            } else {
              this.searchData.cfts = 1
            }
            // 初始化药品用法为数组第一条的ypyf，若无则默认qd
            if(this.searchData.cfid == 3 && response.data[0].ypyf) {
              this.searchData.ypyf = response.data[0].ypyf
            }else {
              this.searchData.ypyf = 'qd'
            }
            
          }
        })
      } else {
        this.mockDatas = []
        // 当第一次打开处方时，默认插入一列
        this.$nextTick(()=> {
          if(this.tableFormat.length==0) {
            this.handleInsert()
          }
        })
      }

      // 获取药房识别
      queryYfsb({ pkey: this.deptId }).then((res: any) => {
        // 定义系统参数
        this.xylx = res.data.xy // 西药房识别
        this.cylx = res.data.cy // 草药房识别

        this.cfList = res.data
        switch (this.searchData.cfid) {
          case 1:
            this.searchData.yfsb = this.cfList.xy
            this.searchSelectData.yp.yfsb = this.cfList.xy
            this.searchSelectData.yp.cflx = [1,2]
            break
          case 2:
            this.searchData.yfsb = this.cfList.zy
            this.searchSelectData.yp.yfsb = this.cfList.zy
            this.searchSelectData.yp.cflx = 2
            break
          case 3:
            this.searchData.yfsb = this.cfList.cy
            this.searchSelectData.yp.yfsb = this.cfList.cy
            this.searchSelectData.yp.cflx = [3]
            break
        }
        this.$emit('setZtlb',this.searchData)
      })
    })
    this.searchData.ksdmName = this.ghksList.length>0 ? this.ghksList.find((item: any) => item.dv == this.searchData.ksdm).dn : ''
    this.searchData.ysdmName = this.ghksList.length>0 ? this.ysList.find((item: any) => item.dv == this.searchData.ysdm).dn : ''
  }

  get tableFormat() {
    const tabledata = this.mockDatas
    id2Name(tabledata, 'ypcd', 'ypcdName', this.cdList, 'dv', 'dn')
    id2Name(tabledata, 'ypyf', 'ypyfName', this.ypyfList, 'dv', 'dn')
    id2Name(tabledata, 'gytj', 'gytjName', this.tjList, 'dv', 'dn')
    return tabledata
  }

  get tableformats() {
    const tablelist = this.tableList
    id2Name(tablelist, 'gytj', 'gytjName', this.tjList, 'dv', 'dn')
    return tablelist
  }
  get tableLcformat() {
    const tabledata = this.saveasData
    id2Name(tabledata, 'ypcd', 'ypcdName', this.cdList, 'dv', 'dn')
    return tabledata
  }

  get filterArray() {
    const arrData: Array <any> = this.mockDatas
    let arrDatas: Array <any> = arrData.filter((item: any) => {
      return item.ypxh
    })
    return arrDatas
  }

  @Watch('mockDatas', { immediate: true, deep: true })
  private mockDatasChange(value: Array<any>) {
    if (value) {
      this.getSummary()
    }
  }

  // 获取当前时间
  private getNowDate() {
    getNow().then((res: any) => {
      this.searchData.kfrq = parseTime(res.data)
    })
  }

  private getCfts(value: any) {
    value.cfts = this.searchData.cfts
    return value.cfts
  }

  getInitVariable() {
    initVariable({}).then((res: AxiosResponse) => {
      ;[this.isPermit, this.maxDay, this.maxDayMethod] = [res.data.mzsfyxsykjyw, res.data.mzyxsyzdts, res.data.mzctssygkfs]
    })
  }

  // 根据处方识别查询处方皮试
  private getMockDatasFj() {
    // findAddition({ jzxh: this.pnParam.jzxh }).then((res: AxiosResponse) => {
    //   this.mockDatasFj = res.data.list
    // })
    if (this.cfsb) {
      queryFjxm({ cfsb: this.cfsb }).then((res: any) => {
        if (res.errorCode == 'SUCCESS') {
          if (res.data) {
            this.mockDatasFj = res.data
          }
        }
      })
    }
  }

  /**
   * @Description: 更改同组的频次数据(西药用法)
   * @author: zhml
   * @param {type}:
   * @return: obj
   * @date 2020/8/19
   */
  private changeYpyfByZh(val: any) {
    let cc = this.mockDatas[this.rowIndex]
    
    // 同组数据拥有相同用法
    this.mockDatas.forEach((item: any) => {
      if (item.ypzh == cc.ypzh) {
        item.ypyf = val
        this.countYpsl()
      }
    })
  }

  // 更改同组的频次数据(草药用法)
  private changeYpyfByCy(val: any) {
    let cc = this.mockDatas[this.rowIndex]
    // 同组数据拥有相同用法
    this.mockDatas.forEach((item: any) => {
      if (item.ypzh == cc.ypzh) {
        item.ypyf = val
      }
    })
    this.$nextTick(()=> {
      if(this.mockDatas[this.rowIndex].jldw && this.mockDatas[this.rowIndex].ycjl && this.mockDatas[this.rowIndex].ypsl && this.mockDatas[this.rowIndex].yfdw && this.mockDatas[this.rowIndex].ypdj && this.mockDatas[this.rowIndex].fymc && this.mockDatas[this.rowIndex].ypxh && this.mockDatas[this.rowIndex].ypyf && this.mockDatas[this.rowIndex].gytj && this.mockDatas[this.rowIndex].yyts && this.mockDatas[this.rowIndex].gytjName) {
        // 医保智能提醒
        this.ybSmartRemind(cc)
      }
    })
  }

  /**
   * @Description: 更改同组的用药天数数据
   * @author: zhml
   * @param {type}:
   * @return: obj
   * @date 2020/8/19
   */
  private changeYytsByZh(val: any) {
    let cc = this.mockDatas[this.rowIndex]
    // 同组的天数都一样
    this.mockDatas.forEach((item: any) => {
      if (item.ypzh == cc.ypzh) {
        item.yyts = val
      }
    })
    this.$nextTick(()=> {
      this.countYpsl()
      if(this.mockDatas[this.rowIndex].jldw && this.mockDatas[this.rowIndex].ycjl && this.mockDatas[this.rowIndex].ypsl && this.mockDatas[this.rowIndex].yfdw && this.mockDatas[this.rowIndex].ypdj && this.mockDatas[this.rowIndex].fymc && this.mockDatas[this.rowIndex].ypxh && this.mockDatas[this.rowIndex].ypyf && this.mockDatas[this.rowIndex].gytj && this.mockDatas[this.rowIndex].yyts && this.mockDatas[this.rowIndex].gytjName) {
        // 医保智能提醒
        this.ybSmartRemind(cc)
      }
    })
    
  }

  /**
   * @Description: 更改同组的给药途径数据
   * @author: zhml
   * @param {type}:
   * @return: obj
   * @date 2020/8/19
   */
  private changeGytjByZh(val: any) {
    let cc = this.mockDatas[this.rowIndex]
    this.mockDatas.forEach((item: any) => {
      if (item.ypzh == cc.ypzh) {
        item.gytj = val
      }
    })
    this.$nextTick(()=> {
      if(this.mockDatas[this.rowIndex].jldw && this.mockDatas[this.rowIndex].ycjl && this.mockDatas[this.rowIndex].ypsl && this.mockDatas[this.rowIndex].yfdw && this.mockDatas[this.rowIndex].ypdj && this.mockDatas[this.rowIndex].fymc && this.mockDatas[this.rowIndex].ypxh && this.mockDatas[this.rowIndex].ypyf && this.mockDatas[this.rowIndex].gytj && this.mockDatas[this.rowIndex].yyts && this.mockDatas[this.rowIndex].gytjName) {
        // 医保智能提醒
        this.ybSmartRemind(cc)
      }
    })    
  }

  /**
   * @Description: 西药计算总量
   * @author: zhml
   * @return:
   * @date 2020/7/22
   */
  private countYpsl() {
    
    let cc = this.mockDatas[this.rowIndex]
    let list: any = this.mockDatas.filter((item: any) => {
      if (item.ypzh == cc.ypzh) {
        return item
      }
    })
    this.mockDatas.forEach((ele: any) => {
      ele.ycjl = getFloat(Number(ele.jb) * Number(ele.ypjl),2)
      if (this.searchData.cfid != 3 && ele.ypyf != '') {
        ele.mrcs = this.mrpcList.find((item: any) => item.dv == ele.ypyf).dn
        ele.ypsl = Math.ceil(((ele.jb ? Number(ele.jb) : 1) * ele.mrcs * ele.yyts) / ele.yfbz) // 中、西医处理
      } else {
        ele.ypsl = ele.jb // 草药处理
      }
    })
    this.getSummary()
    this.$nextTick(()=> {
      if(this.mockDatas[this.rowIndex].jldw && this.mockDatas[this.rowIndex].ycjl && this.mockDatas[this.rowIndex].ypsl && this.mockDatas[this.rowIndex].yfdw && this.mockDatas[this.rowIndex].ypdj && this.mockDatas[this.rowIndex].fymc && this.mockDatas[this.rowIndex].ypxh && this.mockDatas[this.rowIndex].ypyf && this.mockDatas[this.rowIndex].gytj && this.mockDatas[this.rowIndex].yyts && this.mockDatas[this.rowIndex].gytjName) {
        // 医保智能提醒
        this.ybSmartRemind(cc)
      }
    })
  }

  // 草药计算数量
  private uniteYpsl(num: number) {
    let cc = this.mockDatas[this.rowIndex]
    let list: any = this.mockDatas.filter((item: any) => {
      if (item.ypzh == this.mockDatas[this.rowIndex].ypzh) {
        return item
      }
    })

    list.forEach((ele: any) => {
      ele.ypsl = ele.jb
      ele.ycjl = ele.jb
    })
    this.getSummary()
    this.$nextTick(()=> {
      if(this.mockDatas[this.rowIndex].jldw && this.mockDatas[this.rowIndex].ycjl && this.mockDatas[this.rowIndex].ypsl && this.mockDatas[this.rowIndex].yfdw && this.mockDatas[this.rowIndex].ypdj && this.mockDatas[this.rowIndex].fymc && this.mockDatas[this.rowIndex].ypxh && this.mockDatas[this.rowIndex].ypyf && this.mockDatas[this.rowIndex].gytj && this.mockDatas[this.rowIndex].yyts && this.mockDatas[this.rowIndex].gytjName&& this.mockDatas[this.rowIndex].ypyfName) {
        // 医保智能提醒
        this.ybSmartRemind(cc)
      }
    })
  }

  // 西药与中药计算数量
  private countYpslCy(num: number, value: any) {
    this.summary = 0
    this.summaryPay = 0
    value.ypsl = value.ycjl
    let list = this.mockDatas.filter((obj: any) => {
      if (obj.ypxh > -1) {
        return obj
      }
    })
    this.getSummary()
    this.summary = getFloat(this.summary, 4)
    this.summaryPay = getFloat(this.summaryPay, 4)
  }

  // private countYpslO() {
  //   let cc = this.mockDatas[this.rowIndex]
  //   if (cc.ypyf != '') {
  //     cc.mrcs = this.mrpcList.find((item: any) => item.dv == cc.ypyf).dn
  //     cc.ypsl = this.searchData.cfid == 3 ? Math.ceil((1 * cc.mrcs * cc.yyts) / cc.yfbz) : Math.ceil(cc.jb ? cc.jb : (1 * cc.mrcs * cc.yyts) / cc.yfbz)
  //     this.getSummary()
  //   }
  // }

  /**
   * @Description:  计算mockDatas的合计金额
   * @author: zhml
   * @return:
   * @date 2020/7/22
   */
  private getSummary() {
    this.summary = 0
    this.summaryPay = 0

    let list = this.mockDatas.filter((obj: any) => {
      if (obj.ypxh > -1 && obj.zfyp == 0) {
        return obj
      }
    })
    // 判断草药还是中西药
    if (this.searchData.cfid != 3) {
      list.forEach((item: any) => {
        this.summary = this.summary + item.ypsl * item.ypdj
        this.summaryPay = this.summaryPay + item.ypsl * item.ypdj * item.zfbl
      })
    } else {
      list.forEach((item: any) => {
        this.summary = this.summary + item.ypdj * item.ypsl * this.searchData.cfts
        this.summaryPay = this.summaryPay + item.ypdj * item.ypsl * this.searchData.cfts * item.zfbl
      })
    }
    this.summary = getFloat(this.summary, 4)
    this.summaryPay = getFloat(this.summaryPay, 4)
  }

  /**
   * @Description: 切换tab页
   * @author: zhml
   * @return:
   * @date 2020/7/9
   */
  private changeBtn(item: any, index: number) {
    this.isSave = true // 切换tab页后不保存当前处方的数据
    this.ishasBzxx = false // 切换tab页关闭备注信息提示
    this.bzxxList = [] // 切换tab页重新获取当页的药品备注信息
    this.$emit('changeRight')
    this.$emit('getFphm', item.fphm)
    this.CFSB = item.cfsb
    this.htmlSearchData.cfsb = item.cfsb
    this.btnChildIndex = index
    this.$set(this.searchData, 'kfrq', item.kfrq)
    this.fphm = item.fphm
    this.zfpb = item.zfpb
    if (this.CFSB) {
      findList({ jzxh: this.pnParam.jzxh }).then((res: any) => {
        if (res.data.length > 0) {
          res.data.forEach((it: any) => {
            if (it.cfsb == this.CFSB) {
              this.fphm = it.fphm
              this.searchData.fm = it.fm
              this.searchData.jff = it.jff
              this.searchData.tsyq = it.tsyq
              this.$emit('getFphm', it.fphm)
              this.searchData.djybz = it.djybz
              this.searchData.kfrq = it.kfrq
            }
          })
        }
      })
    } else { // 每次切换到新处方时重新获取开方日期
      this.getNowDate() 
    }
    if (item.cfsb == '' || item.cfsb == null) {
      this.mockDatas = []
      this.mockDatasFj = []
      this.isShowFj = false
      // 新处方的处方类型跟随科室类别
      this.handleInsert()
    } else {
      this.cfsb = item.cfsb
      findDetails({ cfsb: item.cfsb }).then((response: any) => { // 异步操作，优先走下面的语句
        if (response.errorCode == 'SUCCESS') {
          this.mockDatas = response.data
          // this.queryPsxmDrugs(response.data) // 处方页面刚进来时获取附加项目数据
          this.getPsxmList(item.cfsb)
          if (response.data[0].cfts) {
            this.searchData.cfts = response.data[0].cfts
          } else {
            this.searchData.cfts = 1
          }
          // 切换处方回显药品用法
          if(this.searchData.cfid == 3 && response.data[0].ypyf) {
              this.searchData.ypyf = response.data[0].ypyf
          }else {
            this.searchData.ypyf = 'qd'
          }
        }
      })
      this.getMockDatasFj()
    }
    switch (item.title) {
      case '西药方':
        this.searchData.cfid = 1
        this.searchSelectData.yp.cflx = [1,2]
        this.searchSelectData.yp.yfsb = this.cfList.xy
        this.searchData.yfsb = this.cfList.xy
        this.$emit('setZtlb', this.searchData)
        return this.searchData
      case '中药方':
        this.searchData.cfid = 2
        this.searchSelectData.yp.cflx = 2
        this.searchSelectData.yp.yfsb = this.cfList.zy
        this.searchData.yfsb = this.cfList.zy
        this.$emit('setZtlb', this.searchData)
        return this.searchData
      case '草药方':
        this.searchData.cfid = 3
        this.searchSelectData.yp.cflx = [3]
        this.searchSelectData.yp.yfsb = this.cfList.cy
        this.searchData.yfsb = this.cfList.cy
        this.isNewGroup = false
        this.$emit('setZtlb', this.searchData)
        return this.searchData
        // 可以追加一个新处方的选项
    }
  }

  private newCfTab() {
    const obj = this.blocks[this.blocks.length - 1]
    this.blocks.push({
      name: obj.name + 1,
      title: '新处方',
      cfsb: '',
    })
    this.cfsb = ''
    this.btnChildIndex = obj.name + 1
    this.mockDatas = []
    this.mockDatasFj = []
    this.ishasBzxx = false // 关闭备注信息提示
    this.bzxxList = [] // 清空备注信息
  }

  private getSearchData(val: any) {
    if (!val.zfyp && val.ypdc == 3) {
      this.$message.warning('自备药药品无法转成非自备药')
      val.zfyp = !val.zfyp
    } else if (val.zfyp) {
      this.searchSelectData.yp.zfyp = 1
      this.isSave = false
    } else {
      this.searchSelectData.yp.zfyp = 0
      this.isSave = false
    }
  }

  // 新处方前的未保存跳转
  private async saveNewCfInfo() {
    this.newCfInfo = false
    await this.handleSave(0)
    this.$nextTick(()=> {
      this.CFSB = ''
      this.$emit('getFphm', '') // 清空新处方的发票号码
      const obj = this.blocks[this.blocks.length - 1]
      this.blocks.push({
        name: obj.name + 1,
        title: '新处方',
        cfsb: '',
        kfrq: '',
        fphm: '',
        zfpb: '',
        cflx: ''
      })
      // 新处方的处方类型跟随科室类别
      this.monitorData() // 监听cfid,yfsb和cflx的变化

      this.fphm = ''
      this.cfsb = ''
      this.searchData.cfts = 1
      this.searchData.fm = ''
      this.searchData.jff = ''
      this.searchData.tsyq = ''
      this.searchData.djybz = 0
      this.btnChildIndex = obj.name + 1
      this.mockDatas = []
      this.mockDatasFj = []
      this.$emit('setZtlb', this.searchData)
      this.queryPsxmDrugs([]) // 新处方时关闭展开列
      this.$nextTick(()=> {
        this.insertNewData() // 新处方时默认插入一行数据
      })
      // 先判断西药方、草药方是否达到最大值
      
    })
    this.ishasBzxx = false // 关闭备注信息提示
    this.bzxxList = [] // 清空备注信息
  }

  /**
   * @Description: 新处方  添加处方前判断是否已保存现在列表已有的处方
   * @author: zhml
   * @return:
   * @date 2020/7/16
   */
  private async newCf() {
    let isMj: boolean = false // 麻精标志
    this.tableFormat.forEach((item: any) => {
      if(item.tsyp == this.mjypArr[0] || item.tsyp == this.mjypArr[1] || item.tsyp == this.mjypArr[2]) {
        isMj = true
      }
    }) 
    if(!this.isSave && isMj) return this.$message.warning('请先保存麻精药品再开新处方！')
    if (!this.isSave) {
      this.newCfInfo = true
    } else if (this.blocks[this.blocks.length - 1].cfsb == '') {
      return null
    } else {
      this.CFSB = ''
      this.$emit('getFphm', '')
      const obj = this.blocks[this.blocks.length - 1]
      this.xyfList = this.blocks.filter((item: any)=> {
        return item.cflx == 1 && item.zfpb == 0
      })
      this.cyfList = this.blocks.filter((item: any)=> {
        return item.cflx == 3 && item.zfpb == 0
      })
      if(this.mzcyzdcfs >0 && this.mzxyzdcfs>0 && this.xyfList.length>=this.mzxyzdcfs && this.cyfList.length>=this.mzcyzdcfs) return this.$message.warning('患者处方数已达到最大值！')
      this.blocks.push({
        name: obj.name + 1,
        title: '新处方',
        cfsb: '',
      })
      // 新处方的处方类型跟随科室类别
      this.monitorData()
      this.fphm = ''
      this.cfsb = ''
      this.searchData.cfts = 1
      this.searchData.fm = ''
      this.searchData.jff = ''
      this.searchData.tsyq = ''
      this.searchData.djybz = 0
      this.btnChildIndex = obj.name + 1
      this.mockDatas = []
      this.mockDatasFj = []
      this.getNowDate() // 重新为开方日期赋值
      
      
      this.$emit('setZtlb', this.searchData)
      this.queryPsxmDrugs([]) // 新处方时关闭展开列
      this.handleInsert() // 新处方时默认插入一行数据
    }
  }

  /**
   * @Description: 复制处方
   * @author: zhml
   * @return:
   * @date 2020/7/20
   */
  private handleCopyCf() {
    this.mockDatas.forEach((item: any, index: number) => {
      if (item.ypxh == null) {
        this.mockDatas.splice(index, 1)
      }
    })
    if(this.mockDatas.length > 0) {
      this.$confirm('复制处方后将清除现有的药品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 先判断西药方、草药方是否达到最大值
        if(this.mzxyzdcfs > 0 && this.xyfList.length>=this.mzxyzdcfs && this.searchData.cfid == 1) return this.$message.warning('西药方数量已达到最大，不可以开西药方')
        if(this.mzcyzdcfs > 0 && this.cyfList.length>=this.mzcyzdcfs && this.searchData.cfid == 3) return this.$message.warning('草药方数量已达到最大，不可以开中药方')
        if(this.mzxydzcfzdyps > 0 && this.tableFormat.length>=this.mzxydzcfzdyps && this.searchData.cfid == 1) return this.$message.warning(`单张西药处方只能录入${this.mzxydzcfzdyps}条药品`)
        if(this.mzcydzcfzdyps > 0 && this.tableFormat.length>=this.mzcydzcfzdyps && this.searchData.cfid == 3) return this.$message.warning(`单张草药处方只能录入${this.mzcydzcfzdyps}条药品`)
        this.dialogVisible = true
      })
    } else {
      // 先判断西药方、草药方是否达到最大值 代码重复，有时间整理放置公用地方处理
      if(this.mzxyzdcfs > 0 && this.xyfList.length>=this.mzxyzdcfs && this.searchData.cfid == 1) return this.$message.warning('西药方数量已达到最大，不可以开西药方')
      if(this.mzcyzdcfs > 0 && this.cyfList.length>=this.mzcyzdcfs && this.searchData.cfid == 3) return this.$message.warning('草药方数量已达到最大，不可以开中药方')
      if(this.mzxydzcfzdyps > 0 && this.tableFormat.length>=this.mzxydzcfzdyps && this.searchData.cfid == 1) return this.$message.warning(`单张西药处方只能录入${this.mzxydzcfzdyps}条药品`)
      if(this.mzcydzcfzdyps > 0 && this.tableFormat.length>=this.mzcydzcfzdyps && this.searchData.cfid == 3) return this.$message.warning(`单张草药处方只能录入${this.mzcydzcfzdyps}条药品`)
      this.dialogVisible = true
    }
  }

  // 另存组套关闭
  private clearData() {
    const selectDataAll: any = this.$refs.selectAllData
    this.saveasData.forEach((item: any)=> {
      selectDataAll.toggleRowSelection(item,false) // 默认选中全部
    })
  }

  // 打开另存组套弹窗
  private openSave() {
    if(!this.CFSB) return this.$message.warning('请先保存处方！')
    this.saveasVisiable = true
    findDetails({ cfsb: this.CFSB }).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.saveasData = res.data
        this.$nextTick(()=> {
          const selectDataAll: any = this.$refs.selectAllData
          // selectDataAll.toggleAllSelection()
          this.saveasData.forEach((item: any)=> {
            selectDataAll.toggleRowSelection(item,true) // 默认选中全部
          })
        })
      }
    })
  }
  // 另存组套勾选
  private handleSelectSave(val: any) {
    this.saveArr = val
  }
  // 保存另存组套
  private saveStack() {
    this.ztData.jzlsh = this.pnParam.jzlsh
    this.ztData.opZt02AddReq = this.saveArr
    this.ztData.ztlb = Number(this.searchData.cfid)
    if (this.ztData.sslb == 1) {
      this.ztData.ksdm = ''
    } else if (this.ztData.sslb == 3) {
      this.ztData.ksdm = 0
    } else {
      this.ztData.ksdm = Vue.prototype.AUTHORITY.outpatientCode
    }
    this.ztData.opZt02AddReq.forEach((el: any) => {
      this.$set(el, 'sypc', el.ypyf)
      this.$set(el, 'xmmc', el.ypmc)
      this.$set(el, 'xmbh', el.ypxh)
      this.$set(el, 'xmsl', el.ypsl)
      this.$set(el, 'jz', el.jf)
      this.$set(el,'fydj',el.ypdj)
      el.ztbh = 1
    })
    if(!this.ztData.ztmc) return this.$message.warning('请先输入组套名称')
    if(this.ztData.opZt02AddReq.length==0) return this.$message.warning('请先勾选需要另存组套的数据！')
    addzt(this.ztData).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.$notify.success('已保存')
        this.ztData.sslb = 1
        this.ztData.ztmc = ''
        this.saveasVisiable = false
      }
    })
  }

  //关闭弹窗
  private handleClose() {
    this.dialogVisible = false
  }

  /**
   * @Description: 切换处方类型，获取药房识别
   * @author: zhml
   * @return:
   * @date 2020/7/17
   */
  private getYfsb(val: any) {
    this.$emit('changeRight')
    if (val == 1) {
      this.searchData.yfsb = this.cfList.xy
      this.searchSelectData.yp.yfsb = this.cfList.xy
      this.searchData.cfid = 1
      this.searchSelectData.yp.cflx = [1,2]
      this.$emit('setZtlb', this.searchData)
    } else if (val == 2) {
      this.searchData.yfsb = this.cfList.zy
      this.searchSelectData.yp.yfsb = this.cfList.zy
      this.searchData.cfid = 2
      this.searchSelectData.yp.cflx = 2
      this.$emit('setZtlb', this.searchData)
    } else if (val == 3) {
      if (Vue.prototype.AUTHORITY.kslb != 1) {
        this.$notify({
          type: 'warning',
          title: '该科室没有草药方权限',
          message: '',
        })
        this.searchData.cfid = 1
        this.searchData.yfsb = this.cfList.xy
        this.searchSelectData.yfsb = this.cfList.xy
        this.searchSelectData.yp.cflx = [1,2]
        this.$emit('setZtlb', this.searchData)
      } else {
        this.searchData.yfsb = this.cfList.cy
        this.searchSelectData.yp.yfsb = this.cfList.cy
        this.searchData.cfid = 3
        this.searchSelectData.yp.cflx = [3]
        this.isNewGroup = false
        // this.listSlotHeight = this.listSlotHeight + 40
        this.$emit('setZtlb', this.searchData)
      }
    }
    this.$nextTick(()=> {
      this.mockDatas = []
      this.handleInsert()
    })
  }

  private closed() {
    this.isVisiable = false
  }

  // 处方复制勾选
  private handleSelectionChange(val: any) {
    this.multipleSelection = val
  }

  private handleConfirm() {
    this.mockDatas.splice(this.rowIndex, 1)
    if (this.multipleSelection.length == this.tableList.length) {
      this.$emit('setDataList', this.multipleSelection[0].ztbh)
    } else {
      this.$emit('setDataList', this.multipleSelection)
    }
    this.isVisiable = false
  }

  //数据交互
  private tableRowClassName({ row, rowIndex }: any) {
    row.index = rowIndex
  }

  // 行点击事件
  private handleGetIndex(val: any) {
    this.rowIndex = val.index
    this.searchSelectData.yp.zfyp = val.zfyp
    this.$emit('getIndex',val.index)
  }

  // 为父组件右侧常用项插入提供位置
  private emitIndex() {
    return this.rowIndex
  }

  private tableRowClassNameFj({ row, rowIndex }: any) {
    row.index = rowIndex
  }

  private handleGetIndexFj(val: any) {
    this.rowIndexFj = val.index
  }

  // 交替显隐处方皮试
  private expandFj() {
    if (this.isShowFj) {
      this.isShowFj = false
    } else {
      this.isShowFj = true
    }
  }

  // mockDatasFj有数据显示，无数据隐藏
  @Watch('isShowFj')
  private expandPs() {
    if (this.searchData.cfid != 3) {
      if (!this.isShowFj) {
        // this.isShowFj = true
        // this.getMockDatasFj()
        this.expandHeight = this.expandHeight + 140
        this.listSlotHeight = this.listSlotHeight + 140
      } else {
        // this.isShowFj = false
        this.expandHeight = this.expandHeight - 140
        this.listSlotHeight = this.listSlotHeight - 140
      }
    } else {
      if (!this.isShowFj) {
        // this.isShowFj = false
        this.expandHeight = this.expandHeight + 140
        this.listSlotHeight = this.listSlotHeight + 140
      } else {
        // this.isShowFj = true
        // this.getMockDatasFj()
        this.expandHeight = this.expandHeight - 140
        this.listSlotHeight = this.listSlotHeight - 140
      }
    }
  }

  private setDataFmOrJf(obj: any) {
    if (obj.dataversionId == 824) {
      this.searchData.fm = obj.dataValueRemark
      // this.searchData.fmValue = obj.dataValueRemark
    }
    if (obj.dataversionId == 825) {
      this.searchData.jff = obj.dataValueRemark
      // this.searchData.jffValue = obj.dataValueRemark
    }
  }

  /**
   * @Description: 获取自付比例 输入法赋值
   * @author: zhml
   * @return:
   * @date 2020/7/9
   */
  private async setData(obj: any) {
    let cc = this.mockDatas[this.rowIndex]
    if (obj.ztbh) {
      queryDetail({ ztbh: obj.ztbh }).then((res: any) => {
        if (res.data.length == 0) {
          this.$notify({
            type: 'warning',
            title: '该组套下没有药品',
            message: '',
          })
          this.mockDatas[this.rowIndex].fymc = ''
          ;(this.$refs[`${this.rowIndex}-` + 1] as any).data = ''
          ;(this.$refs[`${this.rowIndex}-` + 1] as any).$refs['remoteSearch'].data = ''
          return
        } else {
          queryDetail({ ztbh: obj.ztbh }).then((res: any) => {
            if (res.data.length == 0) {
              this.$notify({
                type: 'warning',
                title: '该组套下没有药品',
                message: '',
              })
              return
            } else {
              this.tableList = res.data
              this.isVisiable = true
            }
          })
        }
      })
    } else {
      // isUnque防止重复
      if (this.isUnique(obj.ypxh, this.sameGroup) == -1) {
        // checkMedical判断中成药数量
        if (this.checkMedical(obj, this.mockDatas) > -1) {
          this.mockDatas.splice(this.rowIndex,1)
          this.rowIndex -= 1
          // this.mockDatas[this.rowIndex] = NSaveObj
          // this.mockDatas[this.rowIndex].fymc = ''
          // ;(this.$refs[`${this.rowIndex}-` + 1] as any).data = ''
          // ;(this.$refs[`${this.rowIndex}-` + 1] as any).$refs['remoteSearch'].data = ''
          return
        }
        const object = {
          brxz: this.pnParam.brxz,
          fygb: obj.fygb,
          fyxh: obj.ypxh,
          type: this.searchData.cfid,
        }
        // 判断麻醉与精神类使用权限
        await this.checkDoctorPermission(obj)
        if (this.ysqx) {
          this.$nextTick(() => {
            this.mockDatas.splice(this.rowIndex,1)
            this.rowIndex -= 1
            this.$forceUpdate()
          })
          this.ysqx = false
          return
        } else {
          Object.keys(obj).forEach((key: any) => {
            // Object.keys(obj)返回obj数组key值的顺序数组
            this.$set(this.mockDatas[this.rowIndex], key, obj[key])
          })
          this.mockDatas[this.rowIndex].fymc = obj.ypmc
          this.mockDatas[this.rowIndex].ypdj = obj.lsjg
          this.mockDatas[this.rowIndex].zfyp = this.searchSelectData.yp.zfyp != null ? this.searchSelectData.yp.zfyp : 0
          this.searchSelectData.yp.zfyp = 0
          this.mockDatas[this.rowIndex].jb = 1
          this.mockDatas[this.rowIndex].yyts = cc.yyts ? cc.yyts : 1
          this.mockDatas[this.rowIndex].ypyf = cc.ypyf ? cc.ypyf : ''
          this.$set(this.mockDatas[this.rowIndex], 'jf', this.searchData.cfid == 3 ? '1' : '')
          this.$set(this.mockDatas[this.rowIndex], 'gytj', this.searchData.cfid == 3 ? (obj.gyff ? obj.gyff : '1') : (cc.gytj != '' ? cc.gytj : obj.gyff))
          this.isSave = false // 更改数据后，isSave变为false
          getPayProp(object).then((res: any) => { // 获取药品的自负比例
            this.mockDatas[this.rowIndex].zfbl = res.data
          })
          this.step = 1
          if(obj.pspb) {
            this.$message.info('药品【' + this.mockDatas[this.rowIndex].fymc + '】为皮试药品！')
          }
          this.nextFocus(this.rowIndex, 1)
        }
        // this.$nextTick(()=> {
        this.countYpsl()
        // })
      } else {
        // let cc = this.mockDatas[this.rowIndex].ypzh
        // this.mockDatas[this.rowIndex] = Object.assign({}, NSaveObj)
        this.mockDatas[this.rowIndex].fymc = ''
        this.$notify({
          type: 'warning',
          title: '已有药品',
          message: '',
        })
        // ;(this.$refs[`${this.rowIndex}-` + 1] as any).focus()
        ;(this.$refs[`${this.rowIndex}-` + 1] as any).data = ''
        ;(this.$refs[`${this.rowIndex}-` + 1] as any).$refs['remoteSearch'].data = ''
        // this.mockDatas[this.rowIndex].ypzh = cc
        return
      }
    }
    if (obj.pspb == 0) {
      this.mockDatas[this.rowIndex].psjg = '1'
    } else {
      this.mockDatas[this.rowIndex].psjg = '0'
    }
    // this.mockDatas[this.rowIndex].ypsl = 0
    this.queryPsxmDrugs(this.mockDatas)
    this.$nextTick(()=> {
      this.lookBzxx(this.mockDatas)
    })
  }

  /**
   * @Description: 附加项目回显值
   * @author: zhml
   * @return:
   * @date 2020/7/22
   */
  private setDataFj(obj: any) {
    const object = {
      brxz: this.pnParam.brxz,
      fygb: obj.fygb,
      fyxh: obj.fyxh,
      type: 0,
    }
    this.mockDatasFj[this.rowIndexFj].fydw = obj.fydw
    this.mockDatasFj[this.rowIndexFj].fygb = obj.fygb
    this.mockDatasFj[this.rowIndexFj].fymc = obj.fymc
    this.mockDatasFj[this.rowIndexFj].hjje = obj.hjje
    this.mockDatasFj[this.rowIndexFj].jgid = obj.jgid
    this.mockDatasFj[this.rowIndexFj].ycsl = obj.ycsl
    this.mockDatasFj[this.rowIndexFj].yldj = obj.bzjg
    this.mockDatasFj[this.rowIndexFj].ylsl = obj.ylsl
    this.mockDatasFj[this.rowIndexFj].ylxh = obj.fyxh
    this.mockDatasFj[this.rowIndexFj].ylsl = 1
    this.mockDatasFj[this.rowIndexFj].hjje = this.mockDatasFj[this.rowIndexFj].ylsl * this.mockDatasFj[this.rowIndexFj].yldj

    this.isSave = false
    getPayProp(object).then((res: any) => {
      this.mockDatasFj[this.rowIndexFj].zfbl = res.data
    })
  }

  /**
   * @LastEditors: zhml
   * @Description: 新增的数据是否已有药品名称,判断是否可以再次新增组或新增药品
   * @return:
   */
  private isClick(value: Array<any>) {
    if (value.length == 0) {
      return true
    } else return !(value[value.length - 1].fymc == '' || value[value.length - 1].fymc === null || value[value.length - 1].fymc === undefined)
  }

  // 新处方保存未保存数据弹出弹窗
  private insertNewData() {
    // 先判断西药方、草药方是否达到最大值
    if(this.mzxyzdcfs > 0 && this.xyfList.length>=this.mzxyzdcfs && this.searchData.cfid == 1) return this.$message.warning('西药方数量已达到最大，不可以开西药方')
    if(this.mzcyzdcfs > 0 && this.cyfList.length>=this.mzcyzdcfs && this.searchData.cfid == 3) return this.$message.warning('草药方数量已达到最大，不可以开中药方')
    const param = Object.assign({},NSaveObj)
    // if(this.searchData.cfid == 3) {
    //   this.$set(param,'jf','1')
    //   this.$set(param,'gytj','1')
    // }
    param.ypzh = 1
    this.$nextTick(() => {
      this.mockDatas.push(param) // 这行代码放在外层，内部数据会被清空
      this.rowIndex = this.mockDatas.length - 1
      this.$nextTick(()=> {
        ;(this.$refs[`${this.rowIndex}-1`] as any).focus() // 等到新增的那一行数据渲染到页面上时再获取焦点
      })
    })
    this.sameGroup = []
  }

  /**
   * @Description: 插入同组的数据
   * @author: zhml
   * @return:
   * @date 2020/7/1
   */
  private async handleInsert() {
    // 先判断西药方、草药方是否达到最大值
    if(this.mzxyzdcfs > 0 && this.xyfList.length>=this.mzxyzdcfs && this.searchData.cfid == 1) return this.$message.warning('西药方数量已达到最大，不可以开西药方')
    if(this.mzcyzdcfs > 0 && this.cyfList.length>=this.mzcyzdcfs && this.searchData.cfid == 3) return this.$message.warning('草药方数量已达到最大，不可以开中药方')
   
    // 判断单张处方录入最大药品数
    if(this.mzxyzdcfs > 0 && this.searchData.cfid == 1 && this.mockDatas.length>= this.mzxydzcfzdyps) return this.$message.warning(`单张西药处方只能录入${this.mzxydzcfzdyps}条药品`)
    if(this.mzcyzdcfs > 0 && this.searchData.cfid == 3 && this.mockDatas.length>= this.mzcydzcfzdyps) return this.$message.warning(`单张草药处方只能录入${this.mzcydzcfzdyps}条药品`)
    let fphmData: any = await findList({ jzxh: this.pnParam.jzxh })
    if (fphmData.data.length > 0) {
      fphmData.data.forEach((item: any) => {
        if (item.cfsb == this.CFSB) {
          this.fphm = item.fphm
        }
      })
    }
    if (this.fphm) {
      this.$message.error('已收费的处方不能操作')
      this.isSave = true
      return
    }
    if (this.isClick(this.mockDatas)) {
      const param = Object.assign({}, NSaveObj)
      this.searchSelectData.yp.zfyp = 0
      // param.webSortNumber = this.mockDatas.length + 1
      // this.rowIndex = this.mockDatas.length
      if (this.mockDatas.length == 0) {
        // if(this.searchData.cfid == 3) {
        //   this.$set(param,'jf','1')
        //   this.$set(param,'gytj','1')
        // } else {
        //   this.$set(param,'jf','')
        // }
        param.ypzh = 1
        this.mockDatas.push(param)
        this.rowIndex = this.mockDatas.length - 1
        this.$nextTick(() => {
          ;(this.$refs[`${this.mockDatas.length - 1}-` + 1] as any).focus()
        })
        this.sameGroup = []
      } else if (this.rowIndex == -1 && this.mockDatas.length > 0) {
        param.ypzh = this.mockDatas[this.mockDatas.length - 1].ypzh
        param.ypyf = this.mockDatas[this.mockDatas.length - 1].ypyf
        param.yyts = this.mockDatas[this.mockDatas.length - 1].yyts
        param.gytj = this.mockDatas[this.mockDatas.length - 1].gytj
        // if(this.searchData.cfid == 3) {
        //   this.$set(param,'jf','1')
        //   this.$set(param,'gytj','1')
        // } else {
        //   this.$set(param,'jf','')
        // }
        this.mockDatas.push(param)
        this.rowIndex = this.mockDatas.length - 1
        this.$nextTick(() => {
          ;(this.$refs[`${this.mockDatas.length - 1}-` + 1] as any).focus()
        })
        this.getSameGroup()
      } else if (this.rowIndex > -1 && this.mockDatas.length > 0) {
        param.ypzh = this.mockDatas[this.rowIndex].ypzh
        param.ypyf = this.mockDatas[this.rowIndex].ypyf
        param.yyts = this.mockDatas[this.rowIndex].yyts
        param.gytj = this.mockDatas[this.rowIndex].gytj
        // if(this.searchData.cfid == 3) {
        //   this.$set(param,'jf','1')
        //   this.$set(param,'gytj','1')
        // } else {
        //   this.$set(param,'jf','')
        // }
        this.mockDatas.splice(this.rowIndex+1, 0, param)
        this.getSameGroup()
        this.$nextTick(() => {
          ;(this.$refs[`${this.rowIndex+1}-` + 1] as any).focus()
          this.rowIndex = this.rowIndex + 1
        })
      }
    } else {
      ;(this.$refs[`${this.mockDatas.length-1}-1`] as any).focus()
      return null
    }
    this.isSave = false
  }

  /**
   * @Description: 插入新组的数据
   * @author: zhml
   * @return:
   * @date 2020/7/5
   */
  private async handleNewGroup() {
    // 先判断西药方、草药方是否达到最大值
    if(this.mzxyzdcfs > 0 && this.xyfList.length>=this.mzxyzdcfs && this.searchData.cfid == 1) return this.$message.warning('西药方数量已达到最大，不可以开西药方')
    if(this.mzcyzdcfs > 0 && this.cyfList.length>=this.mzcyzdcfs && this.searchData.cfid == 3) return this.$message.warning('草药方数量已达到最大，不可以开西药方')
    
    // 判断单张处方录入最大药品数
    if(this.mzxyzdcfs > 0 && this.searchData.cfid == 1 && this.mockDatas.length>= this.mzxydzcfzdyps) return this.$message.warning(`单张西药处方只能录入${this.mzxydzcfzdyps}条药品`)
    if(this.mzcyzdcfs > 0 && this.searchData.cfid == 3 && this.mockDatas.length>= this.mzcydzcfzdyps) return this.$message.warning(`单张草药处方只能录入${this.mzcydzcfzdyps}条药品`)
    let fphmData: any = await findList({ jzxh: this.pnParam.jzxh })
    if (fphmData.data.length > 0) {
      fphmData.data.forEach((item: any) => {
        if (item.cfsb == this.CFSB) {
          this.fphm = item.fphm
        }
      })
    }
    if (this.fphm) {
      this.$message.error('已收费的处方不能操作')
      this.isSave = true
      return
    }
    if (this.isClick(this.mockDatas)) {
      const param = Object.assign({}, NSaveObj)
      this.searchSelectData.yp.zfyp = 0
      // param.webSortNumber = this.mockDatas.length + 1
      this.rowIndex = this.mockDatas.length
      if (this.mockDatas.length == 0) {
        param.ypzh = 1
      } else {
        param.ypzh = this.mockDatas[this.mockDatas.length - 1].ypzh + 1
      }
      this.mockDatas.push(param)
      this.rowIndex = this.mockDatas.length - 1
      this.getSameGroup()
      this.$nextTick(() => {
        ;(this.$refs[`${this.mockDatas.length - 1}-` + 1] as any).focus()
      })
    } else {
      return null
    }
    this.isSave = false
  }

  /**
   * @Description: 删除数据
   * @author: zhml
   * @return:
   * @date 2020/7/17
   */
  private async handleDelete() {
    if (this.rowIndex == -1) {
      this.$notify({
        type: 'warning',
        title: '请选择数据',
        message: '',
      })
      return
    } else {
      let list = this.mockDatas.filter((item: any) => item.ypzh == this.mockDatas[this.rowIndex].ypzh)
      // if (list[0].ypzh == 1) {
      //   this.$message.warning('一条处方不明细不能删除')
      //   return ;
      // }
      let fphmData: any = await findList({ jzxh: this.pnParam.jzxh })
      if (fphmData.data.length > 0) {
        fphmData.data.forEach((item: any) => {
          if (item.cfsb == this.CFSB) {
            this.fphm = item.fphm
          }
        })
      }
      if (list.length > 0) {
        if (this.mockDatas[this.rowIndex].ypxh > 0) {
          if (this.fphm) {
            this.$message.error('已收费的处方不能操作')
            this.isSave = true
            return
          }
          if (!this.mockDatas[0].fymc) return // 当处方第一条无数据时，不允许保存
          this.mockDatas.splice(this.rowIndex, 1)
          this.rowIndex -= 1
          this.reloadYpzho(this.mockDatas) // 重新为组号排序
          this.queryPsxmDrugs(this.mockDatas) //
          if (!this.CFSB) return
          this.handleSave(0)
        } else {
          this.mockDatas.splice(this.rowIndex, 1)
          this.rowIndex -= 1
          this.reloadYpzho(this.mockDatas)
        }
      }
      // this.queryPsxmDrugs(this.mockDatas)
      //   else {
      //   this.handleDeleteGroup()
      // }
      this.isSave = false
    }
  }

  //
  // @Watch('isShowFj',{deep:true,immediate:true})
  // private isShowFjChange() {
  //
  //   if (this.isShowFj && this.pnParam.jzxh) {
  //     findAddition({ jzxh: this.pnParam.jzxh }).then((res: AxiosResponse) => {
  //       this.mockDatasFj = res.data.list
  //     })
  //   }
  // }

  /**
   * @Description: 删除组数据
   * @author: zhml
   * @return:
   * @date 2020/7/19
   */
  private async handleDeleteGroup() {
    if (this.rowIndex == -1) {
      this.$notify({
        type: 'warning',
        title: '请选择数据',
        message: '',
      })
      return
    } else {
      let fphmData: any = await findList({ jzxh: this.pnParam.jzxh })
      if (fphmData.data.length > 0) {
        fphmData.data.forEach((item: any) => {
          if (item.cfsb == this.CFSB) {
            this.fphm = item.fphm
          }
        })
      }
      if (this.fphm) {
        this.$message.error('已收费的处方不能操作')
        this.isSave = true
        return
      }
      let list = this.mockDatas.filter((item: any) => item.ypzh == this.mockDatas[this.rowIndex].ypzh)
      const start = this.mockDatas.findIndex((item: any) => item.ypxh == list[0].ypxh)
      this.mockDatas.splice(start, list.length)
      this.reloadYpzh(start, this.mockDatas)
      // this.queryPsxmDrugs(this.mockDatas)
      // this.mockDatasFj = []
      this.isSave = false
      await this.queryPsxmDrugs(this.mockDatas)
      if (!this.CFSB) return
      this.handleSave(0)
    }
  }

  /**
   * @Description: 删除数据的时候，重新排下药品组号
   * @author: zhml
   * @param {type}: data,list //当前行数据   所在列表
   * @return: list
   * @date 2020/7/30
   */
  private reloadYpzh(data: any, list: Array<any>) {
    list.forEach((item: any, index: number) => {
      if (index >= data) {
        item.ypzh = item.ypzh - 1
      }
      return list
    })
  }

  private reloadYpzho(list: Array<any>) {
    //把序列ypzh 从1 开始
    if (list != null && list.length > 0 && list[0].ypzh > 1) {
      let num = list[0].ypzh - 1
      list.forEach((item: any) => {
        item.ypzh = item.ypzh - num
      })
    }

    let i = 1
    for (let j = 0; j < list.length; j++) {
      let item = list[j]
      if (item.ypzh == i) {
      } else if (item.ypzh != i && item.ypzh - 1 == i) {
        i = i + 1
      } else {
        for (let k = j; k < list.length; k++) {
          list[k].ypzh = list[k].ypzh - 1
        }
        this.reloadYpzho(list)
        return
      }
    }
  }

  /**
   * @Description:  刪除處方
   * @author: zhml
   * @return:
   * @date 2020/7/19
   */
  private async handleDeleteCf() {
    let fphmData: any = await findList({ jzxh: this.pnParam.jzxh }) // 查询处方列表数据
    if (fphmData.data.length > 0) {
      fphmData.data.forEach((item: any) => {
        if (item.cfsb == this.CFSB) {
          this.fphm = item.fphm
        }
      })
    }
    if (this.fphm) {
      this.$message.error('已收费的处方不能操作')
      this.isSave = true
      return
    }
    if (this.blocks.length > 0) {
      this.$confirm(`删除操作将无法恢复，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
      })
        .then(() => {
          this.handleDeleteCf1()
        })
        .catch(() => {})
    }
  }

  // 删除处方
  async handleDeleteCf1() {
    if (this.CFSB) {
      let cfsbData: any = await removeMedcineInfo({ cfsb: this.blocks[this.btnChildIndex].cfsb })
      if (cfsbData.errorCode == 'SUCCESS') {
        this.mockDatasFj = []
        this.mockDatas = []
        this.$notify({
          type: 'success',
          title: '已删除',
          message: '',
        })
        this.blocks.splice(this.btnChildIndex, 1)
        // 删除一条处方后默认展示最后一条处方
        if (this.blocks.length > 0) {
          if(this.btnChildIndex == 0) {
            this.changeBtn(this.blocks[this.btnChildIndex], this.btnChildIndex)
          } else {
            this.changeBtn(this.blocks[this.btnChildIndex-1], this.btnChildIndex-1)
          }
        } else {
          this.blocks.length = 0
          this.newRecipel() // 新处方
        }
      }
    } else {
      this.mockDatasFj = []
      this.mockDatas = []
      this.$notify({
        type: 'success',
        title: '已删除',
        message: '',
      })
      this.blocks.splice(this.btnChildIndex, 1)
      // 删除一条处方后，默认展示最后一条处方
      if (this.blocks.length > 0) {
        this.changeBtn(this.blocks[this.btnChildIndex-1], this.btnChildIndex-1)
      } else {
        this.blocks.length = 0
        this.newRecipel() // 新处方
      }
    }
    // if (this.blocks[this.btnChildIndex].cfsb) {
    //       removeMedcineInfo({ cfsb: this.blocks[this.btnChildIndex].cfsb }).then(() => {
    //         this.mockDatasFj = []
    //           this.mockDatas = []
    //           this.$notify({
    //             type: 'success',
    //             title: '已删除',
    //             message: ''
    //           })
    //           this.blocks.splice(this.btnChildIndex, 1)

    //           if (this.blocks.length > 1) this.changeBtn(this.blocks[this.btnChildIndex], this.btnChildIndex)
    //         })
    //       } else {
    //         this.blocks.splice(this.btnChildIndex, 1)
    //       }
  }

  // 改变皮试结果触发
  private async changeFjxm(data: any) {
    await this.queryPsxmDrugs(this.mockDatas)
  }

  private nextFocus(scope: number, num: number) {
    if (num == 5 && this.isShowFj) {
      this.mockDatasFj = []
      ;(this.$refs[`${scope}-${num + 1}`] as any).focus() // 这条语句重复，可以删除
    } else if (num == 6) {
      this.changeFjxm(this.mockDatas[scope])
    }
    if (this.mockDatas[scope].fymc == '' || this.mockDatas[scope].fymc == null || this.mockDatas[scope].fymc == undefined) return
    ;(this.$refs[`${scope}-${num}`] as any).blur()
    this.$nextTick(() => {
      if (num == 4 && this.isNewGroup) {
        this.handleNewGroup()
        return
      } else if (num == 4 && !this.isNewGroup) {
        this.handleInsert()
        return
      }
      ;(this.$refs[`${scope}-${num + 1}`] as any).focus()
    })
  }

  // 获取焦点选中输入框内容
  private handleSelect(scope:any,num:any) {
    ;(this.$refs[`${scope}-${num}`] as any).select()
  }

  // 草药方的回车事件
  private nextFocusCy(scope: number, num: number) {
    if (num == 2) {
      ;(this.$refs[`${scope}-4`] as any).focus()
    }
    if (num == 4 && this.isShowFj) this.mockDatasFj = []
    if (num == 3 && this.isNewGroup) {
      ;(this.$refs[`${this.rowIndex}-` + 4] as any).focus()
    }
    if (num == 5) {
      // this.handleNewGroup()
      // return
      ;(this.$refs[`${this.rowIndex}-` + 6] as any).focus()
    }
    // else if (num == 6 && !this.isNewGroup) {
    //   this.handleInsert()
    //   return
    // }
    if (num == 6) {
      ;(this.$refs[`${this.rowIndex}-` + 7] as any).focus()
      // return
    }

    if (this.mockDatas[scope].fymc == '' || this.mockDatas[scope].fymc == null || this.mockDatas[scope].fymc == undefined) return
    ;(this.$refs[`${scope}-${num}`] as any).blur()
    this.$nextTick(() => {
      ;(this.$refs[`${scope}-${num + 1}`] as any).focus()
    })
  }

  /**
   * @Description: 复制处方带入的数据
   * @author: zhml
   * @return:
   * @date 2020/7/21
   */
  private async setList(value: any) {  // value是outpatientPrescription.vue中选择的数组
    if (this.searchData.cfid == 1 && value[0].type == 3) {
      this.$message.warning('西药方不能复制草药！')
      return
    } else if (this.searchData.cfid == 3 && value[0].type == 1) {
      this.$message.warning('草药方不能复制中/西药！')
      return
    } else if (this.searchData.cfid == 3 && value[0].type == 2) {
      this.$message.warning('草药方不能复制中/西药！')
      return
    }
    // 复制处方时，删除处方所有数据
    if(this.mockDatas.length>=0) {
      this.mockDatas = []
    }

    let stockArr:Array<any> = [] // 存储库存不足的药品
    let diffStock:Array<any> = [] // 存储因库存不足的切换其他厂家的药品 
    let stockStr: string = '' // 显示库存不足的拼接药品
    let diffStockStr: string = '' // 与复制处方中药品厂家不同的药品
    let hasStock: Array<any> = [] // 有库存的数据
    value.forEach((el:any)=> { 
      if(el.kcpb == -1) {
        stockArr.push(el.ypmc)
      } else if(el.kcpb == 0) {
        diffStock.push(el.ypmc)
      }   
      if(el.kcpb == 0 || el.kcpb == 1) hasStock.push(el)
      this.$set(el,'fymc',el.ypmc)
      this.$set(el,'xmlx',el.type)
    })
    stockStr = stockArr.join(',')
    diffStockStr = diffStock.join(',')
    // 库存不足提示框
    if(stockArr.length > 0 || diffStock.length > 0) {
      let arr1 = stockArr.length > 0 ? stockStr + '库存不足'  : ''
      let arr2 = diffStock.length > 0 ? diffStockStr + '与上次产地不同' : ''
      const h: any = this.$createElement;
      this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('p', null, arr1),
            h('p', null, arr2)
          ]),
          confirmButtonText: '确定',
        }).then(()=> {})
    }
    
    this.$nextTick(()=> {
      this.mockDatas = hasStock
    })
    this.dialogVisible = false
    this.$nextTick(() => {
      this.queryPsxmDrugs(value)
      this.lookBzxx(value)
    })
    this.isSave = false
  }

  // 添加附加项目 行
  private handleInsertFj() {
    if (this.rowIndex == -1) return null
    const param = {
      fydw: '',
      fygb: 6,
      fymc: '',
      hjje: 0,
      jgid: '',
      ycsl: 0,
      yldj: 0,
      ylsl: 1,
      ylxh: '',
      zfbl: 0,
      ypzh: this.mockDatas[this.rowIndex].ypzh,
    }
    this.mockDatasFj.push(param)
    this.isSave = false
  }

  // 删除处置数据
  private handleDeteleFj() {
    if (this.rowIndexFj == -1) return
    this.mockDatasFj.splice(this.rowIndexFj, 1)
  }

  // 计算金额
  private countHjje() {
    let cc = this.mockDatasFj[this.rowIndexFj]
    cc.hjje = cc.ylsl * cc.yldj
  }

  /**
   * @Description:  判断药品是否唯一
   * @author: zhml
   * @param {type}:  fyxh==药品序号  list查询的列表
   * @return:  cc
   * @date 2020/7/22
   */
  private isUnique(value: number | string, list: Array<any>) {
    let cc = list.findIndex((item: any) => item.ypxh == value)
    return cc
  }

  /**
   * @Description: 处方保存
   * @author: zhml
   * @return:
   * @date 2020/7/3
   */
  private async handleSave(result: any) {
    if(result == 1) this.saveFlag = true // 仅仅点击保存按钮时才会出现，防重复点击
    // 先判断西药方、草药方是否达到最大值
    if(this.mzxyzdcfs > 0 && this.xyfList.length>=this.mzxyzdcfs && this.searchData.cfid == 1) return this.$message.warning('西药方数量已达到最大，不可以开西药方')
    if(this.mzcyzdcfs > 0 && this.cyfList.length>=this.mzcyzdcfs && this.searchData.cfid == 3) return this.$message.warning('草药方数量已达到最大，不可以开中药方')
    if(result != 7) {
      let isMj: boolean = false // 麻精标志
      this.tableFormat.forEach((item: any) => {
        if(item.tsyp == this.mjypArr[0] || item.tsyp == this.mjypArr[1] || item.tsyp == this.mjypArr[2]) {
          isMj = true
        }
      })
      if(isMj) {
        let nowArr: Array<any> = [] // 获取当前页面处方
        await findList({jzxh: this.pnParam.jzxh}).then((el: any)=> {
          if(el.data.length > 0) {
            nowArr = el.data.filter((res: any)=> {
              return res.cfsb == this.CFSB
            })
          }
        })
        if(nowArr.length>0){
          this.mjcfData.dbrxm = nowArr[0].dbrxm
          this.mjcfData.dbrlxdh = nowArr[0].dbrlxdh
          this.mjcfData.sfzm = nowArr[0].sfzm
          this.mjcfData.bh = nowArr[0].bh
          if(this.mjcfData.dbrxm) this.isBr = '2'
        }
        this.mjVisible = true
        return 
      }
    }
    
    if (this.CFSB) {
      let fphmData = await findList({ jzxh: this.pnParam.jzxh })
      if (fphmData.data.length > 0) {
        fphmData.data.forEach((item: any) => {
          if (item.cfsb == this.CFSB) {
            this.fphm = item.fphm
          }
        })
      }
      this.newXcf = true
    }

    let cc = this.mockDatas.findIndex((item: any) => item.ypyf == '')
    if (cc > -1 && result == 1 && this.mockDatas[cc].ypxh <= 0) {
      this.$message.warning('请先选择药品！')
      this.saveFlag = false
      return
    }
    if (cc > -1 && this.mockDatas[cc].ypxh > 0 && this.searchData.cfid == 1) {
      this.$notify.error('请在第' + parseInt(cc + 1) + '行选择频次,')
      this.saveFlag = false
      return
    }
    //进入清楚缓存
    this.bizsn = ''
    this.imgURL = ''
    clearInterval(this.timeId)
    this.timeId = null
    this.qrCodeId = ''
    //删除没有用数据的记录
    let zfblList: Array<any> = [] // 自负比例未加载出来的数据
    let newarr: Array <any> = []
    let newarr1: Array <any> = []
    this.mockDatas.forEach((item: any, index: number) => {
      if (item.ypxh) {
        newarr1.push(item)
      }
      item.psjg = Number(item.psjg)
      if(item.ypxh && item.zfbl == null) {
        zfblList.push(item.fymc) // 存储自负比例为空的数据
      }
      item.ycjl = getFloat(item.jb != null ? item.ypjl * item.jb : item.ypjl, 2) // 安全隐患
    })
    this.mockDatas = newarr1
    // 自负比例未成功获取捕获
    if(zfblList.length>0) {
      let zfblStr: string = zfblList.join(',')
      this.$alert(zfblStr + '获取自负比例失败，请重新录入', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.mockDatas.forEach((item: any, index: any) => {
            if(item.zfbl || item.zfbl == 0) {
              newarr.push(item)
            }
          })
          this.mockDatas = newarr
        }
      });
      this.saveFlag = false
      return
    }
    
    if(this.mockDatas.length == 0) return this.$message.warning('请先添加药品！')
    let cfObj: any = {
      brid: this.pnParam.brid,
      brxm: this.pnParam.brxm,
      brxz: this.pnParam.brxz,
      cf02List: newarr1,
      yfsb: this.searchData.yfsb,
      cflx: this.searchData.cfid,
      jzxh: this.pnParam.jzxh,
      jzlsh: this.pnParam.jzlsh,
      jzkh: this.pnParam.jzkh,
      ksdm: Vue.prototype.AUTHORITY.outpatientCode,
      cfts: this.searchData.cfts,
      djly: '1',
      oldCfsb: this.CFSB,
      djybz: this.searchData.djybz,
      cfpsList: this.mockDatasFj,
      jff: this.searchData.jff,
      fm: this.searchData.fm,
      tsyq: this.searchData.tsyq,
      dbrxm: this.mjcfData.dbrxm,
      dbrlxdh: this.mjcfData.dbrlxdh,
      sfzm: this.mjcfData.sfzm,
      bh: this.mjcfData.bh,
    }
    if((!cfObj.dbrxm || !cfObj.dbrlxdh || !cfObj.sfzm || !cfObj.bh) && this.isBr == '2' && this.mjVisible) return this.$message.warning('请将信息填写完整！')
    // 西药方代煎标志默认为0
    if(cfObj.cflx == 1) cfObj.djybz = 0
    if(cfObj.cflx == 3) {
      this.mockDatas.forEach((item: any) => {
        item.ypyf = this.searchData.ypyf
      })
    }
    let cfsbData: any = await saveCf01(cfObj).catch(()=> {
      this.saveFlag = false // 仅仅点击保存按钮时才会触发
    })
    if (cfsbData.errorCode == 'SUCCESS') {
      this.saveFlag = false // 仅仅点击保存按钮时才会触发
      this.$notify({
        type: 'success',
        title: '保存成功',
        message: '',
      })
      this.mjVisible = false // 关闭代办人信息弹窗
      this.cfsb = cfsbData.data
      this.CFSB = cfsbData.data
      this.qrCodeId = cfsbData.data
      this.rowIndex = -1
      if (this.searchData.cfid == 1) this.blocks[this.btnChildIndex].title = '西药方'
      if (this.searchData.cfid == 2) this.blocks[this.btnChildIndex].title = '中药方'
      if (this.searchData.cfid == 3) this.blocks[this.btnChildIndex].title = '草药方'
      this.blocks[this.btnChildIndex].cfsb = cfsbData.data
      this.isSave = true
      // 互联网科室判断
      if (Vue.prototype.AUTHORITY.hlwks == '1') {
        this.certificateVisible = true
        // getEasemobUser({}).then((res: any) => {})
        getCfTwoCode({ dataId: this.qrCodeId, type: 2 }).then((res: any) => {
          this.imgURL = 'data:image/png;base64,' + res.data.qrcode
          this.bizsn = res.data.bizSn
          this.bizsnList = []
          this.bizsntext = '请扫码'
          if (this.certificateVisible) {
            // window.setInterval(() => {
            //   this.bizsnCallBack()
            // },1000)
            this.timeId = window.setInterval(() => {
              this.timeNumber++
              this.bizsnCallBack()
            }, 1000)
          } else {
            console.log('打印其他')
          }
        })
      } else {
        this.certificateVisible = false
      }
      this.htmlSearchData = {
        brxz: this.pnParam.brxz,
        cfsb: this.cfsb,
        jzkh: this.pnParam.jzkh,
        silentPrint: 1,
      }
      this.$emit('setStatus', true)
      await this.getList(this.cfsb)
      await findDetails({ cfsb: this.cfsb }).then((response: any) => {
        if (response.errorCode == 'SUCCESS') {
          this.mockDatas = response.data
          if (response.data[0].cfts) {
            this.searchData.cfts = response.data[0].cfts
          } else {
            this.searchData.cfts = 1
          }
        }
      })
      // await this.queryPsxmDrugs(this.mockDatas) // 处方页面刚进来时获取皮试数据
      this.getPsxmList(this.cfsb)
    }
  }

  private getList(val: any) {
    findList({ jzxh: this.pnParam.jzxh }).then((res: any) => {
      if (res.data.length > 0) {
        this.blocks.length = res.data.length
        res.data.forEach((item: any, index: number) => {
          if (item.cflx == 1) {
            return (this.blocks[index] = {
              title: '西药方',
              name: index,
              cfsb: item.cfsb,
            })
          } else if (item.cflx == 2) {
            return (this.blocks[index] = {
              title: '中药方',
              name: index,
              cfsb: item.cfsb,
            })
          } else if (item.cflx == 3) {
            return (this.blocks[index] = {
              title: '草药方',
              name: index,
              cfsb: item.cfsb,
            })
          }
        })
      }
      // findDetails({ cfsb: val }).then((response: any) => {
      //   this.mockDatas = response.data
      //   // this.fphm = response.data[0].fphm
      //   // console.log('this.fphm ', this.fphm)
      // })
    })

    // findAddition({ jzxh: this.pnParam.jzxh }).then((res: AxiosResponse) => {
    //   this.mockDatasFj = res.data.list
    // })
    this.getMockDatasFj()
  }

  private checkMedical(data: any, list: Array<any>) {
    let rowIndex = -1
    if (!data.fygb)
      this.$message({
        message: '查询药品账簿类别失败，请正确维护药品账簿类别信息!',
        type: 'error',
      })
    // this.checkDoctorPermission(data)
    let cc = list.filter((item) => item.type == 2)
    if (cc.length > this.dzcfzdzcysl-1 && data.type == 2) {
      this.$message({
        message: `单张处方不能录入超过${this.dzcfzdzcysl}条中成药!`,
        type: 'error',
      })
      rowIndex = data.ypxh
      ;(this.$refs[`${this.rowIndex}-` + 1] as any).data = ''
      ;(this.$refs[`${this.rowIndex}-` + 1] as any).$refs['remoteSearch'].data = ''
    }
    return rowIndex
  }

  private async loopMedicalTech(data: any) {
    switch (this.step) {
      case 1:
        this.step++
        // this.getSkinTest(data)
        break
      case 2:
        this.step++
        // this.limitMedical(data)
        break
      case 3:
        this.step++
      // this.checkDoctorPermission(data)
    }
  }

  limitMedical(data: any) {
    if (this.isPermit == 1) {
      this.currResData.currTable = data.filter((item: any) => {
        if (item.ksbz == 1 && item.yyts > this.maxDay) {
          switch (this.maxDayMethod) {
            case 1:
              this.currResData.sqlx = 1
              return item
            case 2:
              this.currResData.sqlx = 2
              return item
            case 3:
              this.currResData.sqlx = 3
              return item
          }
        }
      })
      this.antibioticsVisible = true
    } else {
      this.antibioticsVisible = false
    }
  }

  get userInfo() {
    return JSON.parse(localStorage.userInfo)
  }

  // 皮试药品判别(老接口)
  // private getSkinTest(data: any) {
  //   let cc = true
  //   if (data.pspb != 1 && data.pspb != 2) {
  //     this.loopMedicalTech(data)
  //     return
  //   }
  //   let obj = {
  //     brid: this.pnParam.brid,
  //     ypxh: data.ypxh,
  //     psid: data.psid,
  //   }

  //   getSkinTest(obj).then((response: AxiosResponse) => {
  //     let message = '药品【' + (data.ypmc || data.fymc) + '】为皮试药品！'
  //     this.$message.info(message)
  //     response.data.forEach((item: any) => {
  //       if (this.mockDatasFj.length > 0) {
  //         let arr: Array<any> = [] // 暂存皮试id
  //         for (let i = 0; i < this.mockDatasFj.length; i++) {
  //           if (!arr.includes(this.mockDatasFj[i].psid)) {
  //             arr.push(this.mockDatasFj[i].psid)
  //           }
  //         }
  //         let flag = arr.indexOf(item.psid)
  //         if (flag == -1) {
  //           this.mockDatasFj.push({
  //             psmc: item.psmc,
  //             pssl: item.sl,
  //             psje: item.je,
  //             psid: obj.psid,
  //             dw: item.dw,
  //           })
  //         }
  //       } else {
  //         this.mockDatasFj.push({
  //           psmc: item.psmc,
  //           pssl: item.sl,
  //           psje: item.je,
  //           psid: obj.psid,
  //           dw: item.dw,
  //         })
  //       }
  //     })
  //   })
  //   return cc
  // }

  // 新处方
  private newRecipel() {
    this.blocks[0] = {
      title: '新处方',
      name: 0,
      cfsb: '',
      kfrq: '',
      fphm: '',
      zfpb: '',
    }
    // 页面初始化处方类型跟随科室类别
    this.monitorData()
  }

  // 判断医生是否有开精神、麻醉药权限
  private async checkDoctorPermission(data: any) {
    let cc: boolean = true
    let obj: any = await getDoctPersimmion({})
    if (data.tsyp > 0) {
      if (data.tsyp == 1) {
        if (obj.data.mzyq == '' || obj.data.mzyq == '0') {
          this.$message.warning('药品【 ' + data.ypmc + ' 】是麻醉类药品，您暂不能开麻醉类处方!')
          this.ysqx = true
          return false
        }
      }

      if (data.tsyp == 2) {
        if (obj.data.kjsy == '' || obj.data.kjsy == '0') {
          this.$message.warning('药品【 ' + data.ypmc + ' 】是精神类药品，您暂不能开精神类处方!')
          this.ysqx = true
          return false
        }
      }
    }
    // 增加抗生素管理功能 add by yangl
    // 1、判断是否抗生素（具体规则待需求完善）QYSJYSSQ
    // if (this.QYKJYWGL == '1' && data.ksbz > 0) {
    //   if (!data.kssdj || !obj.data.kssqx || obj.data.kssqx.indexOf(data.kssdj + '') < 0) {
    //     // 医生没有权限
    //     // 判断药物提醒方式
    //     if (!data.yqsyfs || data.yqsyfs == '2') {
    //       this.$message.warning('您没有抗菌药物【' + data.ypmc + '】的使用权限！')

    //       return false
    //     }
    //   }
    // }
    let cf02List: Array<any> = [
      {
        ypxh: data.ypxh,
        fymc: data.ypmc,
        ksbz: data.ksbz,
      },
    ]
    const params: any = {
      jzxh: this.pnParam.jzxh,
      cf02List: cf02List,
    }
    await isUse(params).then((res: any) => {
      if (res.errorCode != 'SUCCESS') {
        this.ysqx = true
        this.$message({
          message: res.message,
          type: 'error',
        })
      }
    })
  }

  private getLsjg(val: any) {
    let cc = this.tableList.find((item: any) => item.ypxh == val.ypxh)
    cc.fydj = val.lsjg
  }

  private handleDetermine() {
    const antibioticsReq: any = this.$refs.antibioticsReq
    antibioticsReq.handleDetermine()
  }

  // 处方打印(暂不使用)
  private printRecipe() {
    const cc: any = this.$refs.statement
    if (!this.CFSB) {
      this.$notify.error('没有可以打印的处方数据')
      return
    }

    // console.log(' cc.getTableUrl()', cc.getTableUrl())
    // cc.printTable()
    cc.getTableUrl()
  }

  // 获取打印数据并打印
  private async printCfj() {
    this.queryPrintLogo()
    if(!this.CFSB) return 
    await getCfPrintData(this.CFSB).then((res: any) => {
      this.printData = res.data
      this.cfypList = res.data.cfList
      if(this.cfypList.length<1) return
      // 去除重复组号
      let zh = 0
      for(let i=0; i<this.cfypList.length; i++) {
        if(this.cfypList[i].ypzh == zh) {
          this.cfypList[i].ypzh = ''
        } else {
          zh = this.cfypList[i].ypzh
        }
      }
      
    })

    let isMj: boolean = false // 麻精标志
    this.tableFormat.forEach((item: any) => {
      if(item.tsyp == 1 || item.tsyp == 2 || item.tsyp == 7) {
        isMj = true
      }
    })
    if(isMj) {
      this.printMj()
    } else {
      this.printFn()
    }
  }

  // 麻精处方单打印
  private printMj() {
    const __qiankun__ = window.__POWERED_BY_QIANKUN__
    var LODOP: any = null
    if (__qiankun__) {
      LODOP = Vue.prototype.$getLodop()
    } else {
      LODOP = getLodop()
    }
    if (LODOP) {
      LODOP.PRINT_INIT()
      LODOP.SET_PRINT_PAGESIZE(1, '148mm', '210mm', 'A5') // 2-打印方向及纸张类型,
      var a: any = document.getElementById('jmcf')
      var op: any = '<body>' + a.innerHTML + '</body>'
      LODOP.ADD_PRINT_HTM('28mm', '0mm', '140mm', '210mm', op) // 打印麻精一套打
      LODOP.PREVIEW() // 预览
      // LODOP.PRINT() // 打印
    }
  }

  // 处方笺打印
  private printFn() {
    const __qiankun__ = window.__POWERED_BY_QIANKUN__
    var LODOP: any = null
    if (__qiankun__) {
      LODOP = Vue.prototype.$getLodop()
    } else {
      LODOP = getLodop()
    }
    if (LODOP) {
      LODOP.PRINT_INIT()
      LODOP.SET_PRINT_PAGESIZE(1, '148mm', '210mm', 'A5') // 2-打印方向及纸张类型,
      // LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true) //宽度超出自动缩放
      var a: any = document.getElementById('cfj')
      var op: any = '<body>' + a.innerHTML + '</body>'
      // a.style.zoom=0.85 // 缩放页面，配合LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true)使用
      if(this.searchData.cfid == 1) {
        LODOP.ADD_PRINT_HTM(0, '4mm', '140mm', '210mm', op) // 打印西医方
      } else {
        LODOP.ADD_PRINT_HTM(0, '0mm', '140mm', '210mm', op) // 打印草药方
      }
      // LODOP.ADD_PRINT_HTM('33.5mm', '4mm', '132mm', '210mm', op) // 尾部
      // LODOP.SET_PRINT_MODE('POS_BASEON_PAPER', true) // 以纸张边缘为基点
      LODOP.PREVIEW() // 预览
      // LODOP.PRINT() // 打印
      // LODOP.PRINT_DESIGN() // 设计
    }
  }

  // 获取医院打印的logo
  private queryPrintLogo() {
    queryLogo(this.userInfo.hospitalId).then((res: any) => {
      this.loGo = res.data
      if(this.searchData.cfid == 3) {
        let a: any = document.getElementById("imgInit1")
        a.src = this.loGo
      } else {
        let b: any = document.getElementById("imgInit2")
        b.src = this.loGo
      }
    })
  }



  private getPrintUrl() {
    const cc: any = this.$refs.statement
    cc.printTable()
  }

  // 通过处方药品列表获取皮试数据列表
  private async queryPsxmDrugs(data: any) {
    let params: any = {
      brid: this.pnParam.brid,
      drugs: []
    }
    data.forEach((item: any)=> {
      let drug: any = {
        psjg: item.psjg,
        ypxh: item.ypxh
      }
      params.drugs.push(drug)
    })
    await getPsxmByDrugs(params).then((res: any) => {
      if (res.errorCode == 'SUCCESS' && res.data) {
        if ((!res.data.skinXmList || res.data.skinXmList.length == 0) && (!res.data.psjgMessages || res.data.psjgMessages.length == 0)) {
          this.mockDatasFj = []
          this.psxxList = []
          this.ishasPsxx = false
          this.isShowFj = false
        } else {
          res.data.skinXmList.forEach((item: any) => {
            this.$set(item, 'psje', item.je)
            this.$set(item, 'pssl', item.sl)
            item.dw = '次'
          })
          this.psxxList = res.data.psjgMessages ? JSON.parse(JSON.stringify(res.data.psjgMessages)) : []
          if(this.psxxList.length) {
            this.ishasPsxx = true
          } else {
            this.ishasPsxx = false
          }
          this.mockDatasFj = res.data.skinXmList
          if(this.mockDatasFj.length) this.isShowFj = true
          else this.isShowFj = false
        }
      } else {
        this.mockDatasFj = []
        this.isShowFj = false
      }
    })
  }

  // 保存后的处方获取其附加项目
  private getPsxmList(val: any) {
    getPsxmList({cfsb: val}).then((res: any)=> {
      if (!res.data || res.data.length == 0) {
          this.mockDatasFj = []
          this.isShowFj = false
        } else {
          res.data.forEach((item: any) => {
            this.$set(item, 'psje', item.je)
            this.$set(item, 'pssl', 1)
            item.dw = '次'
          })
          this.mockDatasFj = res.data
          this.isShowFj = true
        }
    })
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
  // 煎服法
  private remoteMethod2(query: string) {
    if (query.length > 1) {
      this.$nextTick(() => {
        ;(this.$refs.searchJff as any).remoteMethod(query)
      })
    } else {
      ;(this.$refs.searchJff as any).closePopover()
    }
  }

  // 获取同组数据
  private getSameGroup() {
    this.sameGroup = []
    this.mockDatas.forEach((item: any) => {
      if (item.ypzh == this.mockDatas[this.rowIndex].ypzh) {
        this.sameGroup.push(item)
      }
    })
  }

  // 百分制
  private useMul(a: any, b: number) {
    return mul(a, b)
  }

  private handleCloseBtn() {
    this.certificateVisible = false
  }
  private bizsnCallBack() {
    if (!this.bizsn) {
      return
    }
    watchCode({ bizSn: this.bizsn }).then((res: any) => {
      if (res.data.mkeyCode == 200) {
        setTimeout(() => {
          this.certificateVisible = false
          this.bizsnList = []
          this.bizsntext = '请扫码'
          this.qrCodeId = ''
        }, 1000)
        clearInterval(this.timeId)
        this.timeNumber = 0
      }
      if (this.bizsnList.indexOf(res.data.mkeyMsg) == -1) {
        this.bizsntext = res.data.mkeyMsg
      }
      this.bizsnList.push(res.data.mkeyMsg)
    })
  }
  // refreshBtn刷新二维码
  private refreshBtn() {
    this.bizsn = ''
    this.imgURL = ''
    clearInterval(this.timeId)
    this.timeId = null
    this.timeNumber = 0
    getCfTwoCode({ dataId: this.qrCodeId, type: 2 }).then((res: any) => {
      this.imgURL = 'data:image/png;base64,' + res.data.qrcode
      this.bizsn = res.data.bizSn
      this.bizsnList = []
      this.bizsntext = '请扫码'
      this.$message({
        message: '刷新成功',
        type: 'success',
      })
      if (this.certificateVisible) {
        this.timeId = window.setInterval(() => {
          this.timeNumber++
          this.bizsnCallBack()
        }, 1000)
      } else {
        console.log('打印其他')
      }
    })
  }

  // 初始化代办人信息
  private changeModel() {
    this.$nextTick(()=>{
      const mjcfRef: any = this.$refs.mjcfRef
      mjcfRef.resetFields()
      this.mjcfData = {
        dbrxm: '',
        dbrlxdh: '',
        sfzm: '',
        bh: '',
      }
    })
  }

  // 医保智能提醒(录入处方)
  private ybSmartRemind(row:any) {
    
    const params:any = {
      dcypdw: row.jldw,
      dcypsl: row.ycjl,
      fysl: row.ypsl,
      fysldw: row.yfdw,
      jzlsh: this.pnParam.jzlsh,
      ypcd: row.ypcd,
      ypdj: row.ypdj,
      ypgg: row.yfgg,
      ypmc: row.fymc,
      ypxh: row.ypxh,
      yypc: row.ypyfName, // 药品频次
      yypcdm: row.ypyf,
      yytj: row.gytjName, // 给药途径
      yytjdm: row.gytj,
      yyts: row.yyts
    }
    smartRemind(params).then((res:any)=> {
      console.log(3297,res)
    })
  }

  // 监听cfid,yfsb与cflx的实时变化
  private monitorData() {
    if(Vue.prototype.AUTHORITY.kslb == 1) {
      this.searchData.cfid = 3
      this.searchData.yfsb = this.cfList.cy
      this.searchSelectData.yp.yfsb = this.cfList.cy 
      this.searchSelectData.yp.cflx = [3]
    } else {
      this.searchData.cfid = 1
      this.searchData.yfsb = this.cfList.xy
      this.searchSelectData.yp.yfsb = this.cfList.xy 
      this.searchSelectData.yp.cflx = [1,2]
    }
  }

  // 关闭药品备注信息 
  private closeBzxx() {
    this.ishasBzxx = false
  }

  // 关闭皮试信息
  private closePsxx() {
    this.ishasPsxx = false
  }

  // 查看录入整个表格的备注信息数据
  private lookBzxx(val: any) {
    let _that = this
    this.bzxxList = []
    val.forEach((item: any)=> {
      if(item.bzxx || item.bz) {
        let bzxxStr:any = {
          ypmc: item.ypmc || item.fymc,
          bzxx: item.bzxx || item.bz
        }
        _that.bzxxList.push(bzxxStr)
      }
      if(_that.bzxxList.length) {
        _that.ishasBzxx = true
      } else {
        _that.ishasBzxx = false
      }
    }) 
  }

}
</script>
<style lang="scss" scoped>
@import '@/styles/inputTable.scss';
.his-patient-recipe {
  width: 100%;
  padding: 4px 10px !important;

  .row {
    padding-bottom: 4px;

    .label {
      height: 30px;
      padding: 5px 0 !important;

      .el-input {
        height: 28px !important;

        .el-input__inner {
          height: 100%;
        }
      }
    }
  }

  .label {
    .stamp {
      position: absolute;
      right: 0;
      bottom: 40px;

      .icon {
        font-size: 100px;
        color: #ff7643;
      }
    }
  }

  &.ht {
    height: 100%;
  }

  .row {
    .querySearch {
      padding: 0 8px;

      .searchTitle {
        white-space: nowrap;
        padding-left: 8px;
      }

      .el-radio {
        margin-right: 0;

        ::v-deep .el-radio__label {
          font-size: 13px !important;
          padding-left: 4px;
        }

        & + .el-radio {
          margin-left: 8px;
        }
      }
    }
  }

  .his-recipe {
    padding: 8px 0 !important;
    margin-bottom: 0 !important;
    border-bottom: 1px solid #f0f0f0;
  }

  .btn-child {
    display: flex;
    flex-flow: row nowrap;
    border-bottom: 1px solid #f0f0f0;

    .middle-btn {
      display: flex;
      flex-flow: row nowrap;

      span {
        padding: 0 12px 0 2px;
        margin-top: 8px;

        &.actived-btn {
          cursor: pointer;
          color: #1485ff;
          border-bottom: 2px solid #1485ff;
          padding-bottom: 8px;
          font-family: siyuanMedium;
        }
      }
    }
  }

  ::v-deep .color-group .cell {
    padding: 0 !important;

    .greenBack {
      height: 32px;
      opacity: 0.3 !important;
      background: #0fcaad;
    }

    .orangeBack {
      height: 32px;
      opacity: 0.3 !important;
      background: #ffbf00;
    }
  }

  .price-bar {
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: start;
    color: #6a6d78;
    font-size: 13px;

    em {
      color: #1485ff;
      font-size: 16px;
      font-family: siyuanMedium;
    }
  }
}

::v-deep .content .his-module .el-table--medium td .cell {
  padding: 0;
}

::v-deep .w100 {
  height: 30;
  width: 100%;

  .dc {
    color: #1485ff !important;
  }

  .type {
    color: #e80f0f !important;
  }
}



::v-deep div.first-red::before {
  content: '*';
  color: red;
}

::v-deep.el-dialog__wrapper {
  overflow: hidden !important;
}

::v-deep .el-dialog {
  margin-top: 3vh !important;

  .el-dialog__body {
    padding: 0 !important;

    .his-module {
      height: 100%;
    }
  }

  .el-dialog__header {
    padding: 0 16px;
  }
}

.his-unexpand {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
}

.cy_fm_jf {
  height: 32px;
  width: 200px;
  background: #f5f6f8;
  border-radius: 4px;
  padding-left: 8px;
  font-size: 14px;
}

.narrow-dialog {
  height: 50%;

}

.statement-box {
  width: 700px;
  // padding: 0 4rem;
}

.kjyw {
  .el-dialog .el-dialog__body {
    padding: 0 !important;
  }
}
.cerAClass {
  margin-top: 200px;
}
::v-deep .el-dialog .el-dialog__body {
  padding: 10px 16px !important;
}

.certificateClass {
  height: 340px;
}
pre {
  height: 500px;
  overflow: auto;
  font-size: 12px;
}
.outDoorCopy {
  position: fixed;
  margin-top: 34px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #323232;
  opacity: 0.8;
  z-index: 98;
}
.outDoor {
  position: fixed;
  margin-top: 34px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // background-color: #323232;
  // opacity: 0.8;
  z-index: 99;
  .certificateClass {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 100;
    transform: translate(-50%, -80%);
    background-color: #fff;
    opacity: 1;
    .textCode {
      position: relative;
      width: 100%;
      height: 30px;
      padding-top: 5px;
      .outdoorText {
        line-height: 25px;
        text-indent: 10px;
        color: #000;
      }
      .refreshText {
        margin: 5px 10px 0 0;
        padding: 0 20px;
        position: absolute;
        top: 0;
        right: 0;
        line-height: 25px;
        color: #23a5ff;
        font-weight: 500;
        background-color: #e7f3ff;
        border-radius: 2px;
        cursor: pointer;
      }
    }
    .outdoorTextTwo {
      line-height: 25px;
      height: 25px;
      margin-bottom: 5px;
    }
  }
}
.newCfDialog {
  margin-top: 300px;
}

::v-deep .remote-select-select-box {
  width: 100%
}

.el-dialog .el-dialog__body .el-form-item {
  margin-bottom: 16px;
}

.mjcf-dialog::v-deep .el-dialog {
  margin-top: 10vh!important;
}

::v-deep .el-notification {
  top: 0!important;
}

.his-drugBzxx {
  position: fixed;
  bottom: 48px;
  right: 40px;
  width: 350px;
  max-height: 300px;
  background: #FAFDFF;
  z-index: 99;
  padding-left: 10px;
  box-shadow: 0px 16px 40px 0px rgba(0, 0, 0, 0.12);
  border-radius: 0px 0px 8px 8px;
  .his-bzxx {
    font-size: 14px;
    // max-height: 250px;
    color: #222b31;
    p {
      margin-bottom: 10px;
    }
  }
  .his-label {
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 35px;
    .title {
      line-height: 35px;
    }
  }
}

.his-iconClose {
  font-size: 25px;
}

.reds {
  color: #f95776;
}
.blues {
  color: #1485ff;
}
</style>
