<!--
 * @Date: 2020-05-25 19:22:07
 * @LastEditors: wangyao
 * @LastEditTime: 2020-08-31 09:59:06
 * @description:  检查申请
-->
<template>
  <div class="module">
    <el-row class="mt ht" :gutter="10" v-show="true">
      <el-col :span="12" class="ht">
        <div class="his-module layout-top his-small his-mini">
          <div slot="header">
            <div class="row">
              <div class="label">
                <div class="searchTitle no-warp">{{ title }}</div>
                <div class="btn">
                  <el-divider v-if="title" direction="vertical"></el-divider>
                  <!-- 保存 -->
                  <el-button size="mini" type="text" v-preventReClick @click="handleSave" :disabled="!this.saveStatus" style="padding-right: 10px"> <i class="icon his-btn-save green"></i>保存 </el-button>
                  <!-- 保存并打印 -->
                  <el-button size="mini" type="text" v-preventReClick :disabled="!this.saveStatus" @click="printDj"> <i class="his-btn-print icon"></i>保存并打印</el-button>
                  <el-button size="mini" style="margin-left: 12px" type="text" @click="reset"> <i class="icon his-btn-add"></i>新开</el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="scroll-bar" :style="{ height: listSlotHeight - 190 + 'px' }">
            <el-form ref="formData" :rules="rulesForm" :model="formData" label-width="70px" class="clearfix">
              <div class="row3">
                <!-- 临床诊断 -->
                <el-form-item :label="'临床诊断'" prop="mqzd">
                  <el-input :placeholder="'请输入'" v-model="formData.mqzd" disabled></el-input>
                </el-form-item>
                <!-- X线摄片号 -->
                <el-form-item :label="'X线摄片号'" prop="ghf">
                  <el-input :placeholder="'请输入'" v-model.number="formData.ghf"></el-input>
                </el-form-item>
                <!-- 检查费用 -->
                <el-form-item :label="'检查费用'" prop="jcfy">
                  <el-input :placeholder="'请输入'" class="text-blue" v-model.number="formData.jcfy" disabled></el-input>
                </el-form-item>
              </div>
              <div class="rowA">
                <!-- 病情简介 -->
                <el-form-item :label="'病情简介'" prop="tztz" style="width: 100%">
                  <el-input placeholder="" v-model="formData.tztz" type="textarea" :rows="2" :disabled="!currEditStatus"></el-input>
                </el-form-item>
                <div class="btn">
                  <el-button @click="getEmrInfo" size="mini" style="margin-left: 12px" type="text"> <i class="icon his-button_yinru"></i>引用病历</el-button>
                </div>
              </div>
              <div class="row2">
                <!-- 检查部位 -->
                <el-form-item :label="'检查部位'" prop="jcbw">
                  <el-input :placeholder="'请输入'" v-model.number="formData.jcbw" disabled></el-input>
                </el-form-item>
                <!-- 检查项目 -->
                <el-form-item :label="'检查项目'" prop="jcxm">
                  <el-input :placeholder="'请输入'" v-model.number="formData.jcxm" disabled></el-input>
                </el-form-item>
              </div>
              <div class="rowX">
                <!-- 检查目的 -->
                <el-form-item :label="'检查目的'" prop="jcmd">
                  <el-input :placeholder="'请输入'" v-model.number="formData.jcmd" :disabled="!currEditStatus"></el-input>
                </el-form-item>
                <!-- 是否加急 -->
                <el-form-item label="是否加急" prop="sfjj">
                  <el-radio-group v-model="formData.sfjj">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <!-- 过敏反应相关因素 -->
              <el-form-item :label="'过敏反应相关因素'" prop="gmfy" style="width: 100%">
                <el-input :placeholder="'请输入'" v-model.number="formData.gmfy" :disabled="!currEditStatus"></el-input>
              </el-form-item>
              <div class="row2-2-1">
                <!-- 申请医师 -->
                <el-form-item :label="'申请医师'" prop="sqys">
                  <!-- <search-select table-name="SYS_DICT_CONFIG" kid="17" v-model="formData.sqys" placeholder="请输入" :backfillValue="formData.sqys" class="search_style" :disabled="!currEditStatus" /> -->
                  <remote-search-select
                    searchUrl="/system-service/hrpersonnel/getDoctor"
                    :resultTableHeader="resultHeaderUser"
                    :popover-width="300"
                    :searchData="{
                      xm: '',
                      lb: '',
                    }"
                    searchField="xm"
                    showLabel="personName"
                    data-type="0"
                    ref="sqysName"
                    :isIndex="false"
                    v-model="formData.sqysName"
                    @getData="
                      (data) => {
                        getDataUser(data, 'sqys')
                      }
                    "
                  >
                    <el-select
                      v-model="formData.sqysName"
                      ref="select"
                      class="search-select"
                      remote
                      filterable
                      @blur="selectBlurUser('sqysName')"
                      :popper-append-to-body="false"
                      :remote-method="
                        (query) => {
                          remoteMethodUser(query, 'sqysName')
                        }
                      "
                      :clearable="true"
                    >
                    </el-select>
                  </remote-search-select>
                </el-form-item>
                <!-- 预约日期 -->
                <el-form-item :label="'预约日期'" prop="yyrq">
                  <el-date-picker class="date-wrapper" v-model="formData.yyrq" type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间" :clearable="true" @blur="(val) => checkoutDate(val.valueOnOpen, jclx)" :disabled="!currEditStatus"></el-date-picker>
                </el-form-item>
                <!-- 预约时间点 -->
                <el-form-item :label="'预约时间点'" prop="yysj" style="width: 100%" :rules="[{ required: formData.yyrq, message: '请输入预约时间点', trigger: 'blur' }]">
                  <el-input :placeholder="'请输入'" v-model="formData.yysj" @focus="openYysjDialog" :key="key" clearable :disabled="!currEditStatus"></el-input>
                </el-form-item>
              </div>
              <!-- 检查地点 -->
              <el-form-item :label="'检查地点'" prop="jcdd" style="width: 100%">
                <el-input :placeholder="'请输入'" v-model="formData.jcdd" :disabled="!currEditStatus"></el-input>
              </el-form-item>
              <!-- 选内镜时出现的 -->
              <div class="row3" v-if="showAllForm">
                <el-form-item :label="'ALT报告'" prop="alt" style="width: 100%">
                  <el-select :placeholder="'请选择'" v-model.number="formData.alt">
                    <el-option v-for="item in haveOrNoList" :key="item.dv" :value="item.dv" :label="item.dn"> </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="'HBsAg报告'" prop="alt" style="width: 100%">
                  <el-select :placeholder="'请选择'" v-model.number="formData.hbsag" :disabled="!currEditStatus">
                    <el-option v-for="item in haveOrNoList" :key="item.dv" :value="item.dv" :label="item.dn"> </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="'是否无痛选择'" prop="alt" style="width: 100%">
                  <el-select :placeholder="'请选择'" v-model.number="formData.sfwt" :disabled="!currEditStatus">
                    <el-option v-for="item in yesOrNoList" :key="item.dv" :value="item.dv" :label="item.dn"> </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="'有无糖尿病'" prop="alt" style="width: 100%">
                  <el-select :placeholder="'请选择'" v-model.number="formData.ywtnbs" :disabled="!currEditStatus">
                    <el-option v-for="item in haveOrNoList" :key="item.dv" :value="item.dv" :label="item.dn"> </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="'抗凝剂使用情况'" prop="alt" style="width: 100%">
                  <el-select :placeholder="'请选择'" v-model.number="formData.knjsy" :disabled="!currEditStatus">
                    <el-option v-for="item in yesOrNoList" :key="item.dv" :value="item.dv" :label="item.dn"> </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="'选择一次性活检钳'" prop="alt" style="width: 100%">
                  <el-select :placeholder="'请选择'" v-model.number="formData.ycxhjq" :disabled="!currEditStatus">
                    <el-option v-for="item in yesOrNoList" :key="item.dv" :value="item.dv" :label="item.dn"> </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="'胃镜/食管镜检查史'" prop="alt" style="width: 100%">
                  <el-select :placeholder="'请选择'" v-model.number="formData.wjsgj" :disabled="!currEditStatus">
                    <el-option v-for="item in haveOrNoList" :key="item.dv" :value="item.dv" :label="item.dn"> </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="'上消化道手术史'" prop="alt" style="width: 100%">
                  <el-select :placeholder="'请选择'" v-model.number="formData.sxhdsss" :disabled="!currEditStatus">
                    <el-option v-for="item in haveOrNoList" :key="item.dv" :value="item.dv" :label="item.dn"> </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <!--  病理申请单 -->
              <div class="row4" v-if="showBlsqForm">
                <el-table :data="specimenData" ref="bljcTable" border :fit="true" stripe highlight-current-row class="scroll-bar input-table" :height="listSlotHeight / 5 - 30">
                  <el-table-column label="送检标本" prop="sjbb">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.sjbb" :ref="`${scope.$index}-1`" @keyup.enter.native="nextFocus(scope.$index, 2)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="采取部位" prop="cqbw">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.cqbw" :ref="`${scope.$index}-2`" @keyup.enter.native="nextFocus(scope.$index, 3)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="标本名称" prop="bbmc">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.bbmc" :ref="`${scope.$index}-3`"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="52">
                    <template slot-scope="scope">
                      <el-tooltip :content="$t('common.delete')" effect="light">
                        <el-popconfirm hideIcon :confirmButtonText="$t('common.confirm')" :cancelButtonText="$t('common.cancel')" :title="$t('sysManage.confirmDeleted')" @confirm="handleDelete(scope)">
                          <el-button slot="reference" class="red" :disabled="scope.row.xh == '1' ? true : false">
                            <i class="icon his-del his-cancellationicon"></i>
                          </el-button>
                        </el-popconfirm>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="row">
                  <div class="label" style="font-size: 14px; margin-left: 0; margin-top: 0" @click="addSpecimen">
                    <i class="icon his-btn-add" style="margin-right: 5px"></i>
                    <div style="color: #1485ff; cursor: pointer">新增</div>
                  </div>
                </div>
                <div class="row row4-1">曾在何处做过病理检查:</div>
                <div class="row4-2">
                  <el-form-item label="检查日期" class="line-item1" prop="jcrq">
                    <el-date-picker class="date-wrapper" v-model="formData.jcrq" type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间" :clearable="true"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="病理号" class="line-item2" prop="jcblh">
                    <el-input v-model="formData.jcblh" placeholder="请输入"></el-input>
                  </el-form-item>
                </div>
                <div class="row4-2">
                  <el-form-item label="检查医院" class="line-item3" prop="jcyy">
                    <el-input v-model="formData.jcyy" placeholder="请输入"></el-input>
                  </el-form-item>
                  <el-form-item label="诊断" class="line-item4" prop="jczd">
                    <el-input v-model="formData.jczd" placeholder="请输入"></el-input>
                  </el-form-item>
                </div>
                <div class="row4-1">(若系妇科标本，请填写下来各项):</div>
                <div class="row4-3">
                  <el-form-item label="末次月经日期" class="line-item5" prop="mcyjrq">
                    <el-date-picker class="date-wrapper" v-model="formData.mcyjrq" type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间" :clearable="true"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="经量" class="line-item6" prop="jl">
                    <el-input placeholder="请输入" v-model="formData.jl"></el-input>
                  </el-form-item>
                  <el-form-item label="周期及持续时间" class="line-item7" prop="zqjcxsj">
                    <el-input placeholder="请输入" v-model="formData.zqjcxsj"></el-input>
                  </el-form-item>
                </div>
                <div class="row4-3">
                  <el-form-item label="有否质量(内分泌)" class="line-item5" prop="yfzl">
                    <el-select v-model="formData.yfzl" placeholder="请输入">
                      <el-option v-for="(item, index) in yfzlArr" :key="index" :label="item.dn" :value="item.dv"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="日期" class="line-item6" prop="yfzlrq">
                    <el-date-picker class="date-wrapper" v-model="formData.yfzlrq" type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间" :clearable="true"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="剂量及持续时间" class="line-item7" prop="jljcxsj">
                    <el-input placeholder="请输入" v-model="formData.jljcxsj"></el-input>
                  </el-form-item>
                </div>
                <div class="row4-3">
                  <el-form-item label="刮宫日期" class="line-item5" prop="ggrq">
                    <el-date-picker class="date-wrapper" v-model="formData.ggrq" type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间" :clearable="true"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="送检日期" class="line-item6" prop="sjrq">
                    <el-date-picker class="date-wrapper" v-model="formData.sjrq" type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间" :clearable="true"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="送检医生" class="line-item7" prop="sjys">
                    <el-input placeholder="请输入" v-model="formData.sjys"></el-input>
                  </el-form-item>
                </div>
                <div class="row4-4">
                  <el-form-item label="收到日期" class="line-item8" prop="sdrq">
                    <el-date-picker class="date-wrapper" v-model="formData.sdrq" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" :clearable="true"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="签收人" class="line-item9" prop="qsr">
                    <el-input placeholder="请输入" v-model="formData.qsr"></el-input>
                  </el-form-item>
                  <el-form-item class="line-item7"></el-form-item>
                </div>
              </div>
            </el-form>
          </div>
        </div>
      </el-col>
      <el-col :span="5" class="ht">
        <div class="his-module ht scroll-bar">
          <div slot="header" class="row">
            <div class="label">
              <div class="title">医技树类型</div>
            </div>
          </div>
          <el-tree :data="data" :props="defaultProps" node-key="id" :default-expanded-keys="defaultExpandedKeys" :load="loadNode" highlight-current lazy @node-click="handleNodeClick" accordion ref="tree">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <i class="icon" :class="data.children ? getClass(node) : 'his-tree-submen'"></i>
              <div class="tree-label" :title="node.label">{{ node.label }}</div>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="7" class="ht">
        <div class="his-module his-small his-mini ht" style="margin-right: 0px">
          <div slot="header" class="row">
            <div class="label">
              <div class="title">项目类型</div>
            </div>
          </div>
          <el-table :data="tableDatas" ref="multipleTable" border :fit="true" stripe :highlight-current-row="true" slot="list" @selection-change="handleSelectionChange" class="scroll-bar no-underline ht" :height="listSlotHeight - 198">
            <el-table-column type="selection" width="32"></el-table-column>
            <el-table-column type="index" width="32"></el-table-column>
            <el-table-column prop="xmmc" :label="'项目名称'" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="fydj" :label="'费用'" width="60" :show-overflow-tooltip="true" class-name="text-blue-td">
              <template slot-scope="scope">
                <span>{{ scope.row.fydj.toFixed(2) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-dialog top="5vh" :visible.sync="showDetail" :cancel-text="$t('common.close')" width="1000px" :before-close="handleCancle" v-elDraggableDialog :close-on-click-modal="false" :destroy-on-close="true" :key="key" class="scroll-bar">
      <div slot="title" class="dialog__body">
        <div class="top1">
          <div class="label">
            <div class="title">预约时间</div>
            <div class="note">(双击选择)</div>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div class="btn">
            <el-button size="mini" type="text">
              <i class="icon his-btn-refresh green"></i>
              {{ $t('common.refresh') }}
            </el-button>
          </div>
        </div>
      </div>
      <appoint-data ref="refForm" :time-list="timeList" :currentDate="formData.yyrq" :jclx="jclx" @getTime="getTime" />
    </el-dialog>
    <div class="statement-box" v-show="false">
      <statement
        ref="statement"
        :html-api="'/op-service/cisjcsq01/jcsqdPrint'"
        :html-search-data="htmlSearchData"
        :height="listSlotHeight + 26"
        @hadUrl="getPrintUrl"
        :print-arg="{
          top: '8%',
          left: '10%',
          width: '90%',
          height: '87%',
        }"
      />
    </div>

    <!-- 病理检查申请单打印 -->
    <div id="bljcd" style="width: 210mm" v-show="false">
      <div style="display: flex; width: 100%; height: auto; margin: 0 auto; justify-content: space-between; padding-left: 1mm; padding-right: 1mm; border-bottom: 1px solid #000">
        <img id="imgInit1" src="" style="width: 200px; height: 30px; margin-bottom: 4px" />
        <span style="color: #6a6d78; height: 13px; margin-top: 17px; margin-right: 40px">YW-BD-0110-002</span>
      </div>
      <div style="width: 100%; margin: 0 auto">
        <div style="fontsize: 21px; text-align: center; margin-top: 10px; margin-bottom: 5px; letter-spacing: 2px">病理检查申请单</div>
        <div style="width: auto; margin: 0 auto">
          <div>
            <div style="display: flex; justify-content: center;text-align:center; height: 20px; margin-bottom: 5px">
              <p style="margin: 0; width: 28px; font-size: 13px">姓名</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 65px; text-align: center; font-size: 13px">{{blPrintData.hzxm}}</p>
              <p style="margin: 0; width: 56px; font-size: 13px">出生日期</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 33px;padding-left: 1px; text-ailgn: center; font-size: 13px">{{blPrintData.csrq_y}}</p>
              <p style="margin: 0; font-size: 13px">年</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 18px;padding-left: 1px; text-ailgn: center; font-size: 13px">{{blPrintData.csrq_m}}</p>
              <p style="margin: 0; font-size: 13px">月</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 18px;padding-left: 1px; text-ailgn: center; font-size: 13px">{{blPrintData.csrq_d}}</p>
              <p style="margin: 0; font-size: 13px">日</p>
              <p style="margin: 0; width: 28px; font-size: 13px; margin-left: 3px">性别</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 23px; text-ailgn: center; font-size: 13px">{{blPrintData.xb == 1 ? '男' : '女'}}</p>
              <p style="margin: 0; width: 28px; font-size: 13px">年龄</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 33px; text-ailgn: center; font-size: 13px">{{blPrintData.nl}}</p>
              <p style="margin: 0; width: 28px; font-size: 13px">科室</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 65px; text-ailgn: center; font-size: 13px">{{blPrintData.ksmc}}</p>
              <p style="margin: 0; width: 28px; font-size: 13px">病区</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 65px; text-ailgn: center; font-size: 13px"></p>
              <p style="margin: 0; width: 28px; font-size: 13px">床号</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 25px; text-ailgn: center; font-size: 13px"></p>
              <p style="margin: 0; font-size: 12px; width: 96px">门诊号或住院号</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 90px; text-ailgn: center; font-size: 13px">{{blPrintData.mzh}}</p>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px">
              <div style="display: flex">
                <p style="font-size: 13px; margin: 0">联单号：</p>
                <p style="border-bottom: 1px solid #000; width: 120px; text-ailgn: center; font-size: 13px; margin: 0">{{blPrintData.ldh}}</p>
              </div>
              <div style="display: flex">
                <p style="font-size: 13px; margin: 0">病理号：</p>
                <p style="border-bottom: 1px solid #000; width: 225px; text-ailgn: center; font-size: 13px; margin: 0">{{blPrintData.blh}}</p>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px">
              <div style="display: flex">
                <p style="font-size: 13px; margin: 0">通讯地址：</p>
                <p style="font-size: 13px; border-bottom: 1px solid #000; width: 405px; text-ailgn: center; margin: 0">{{blPrintData.txdz}}</p>
              </div>
              <div style="display: flex">
                <p style="font-size: 13px; margin: 0">联系电话：</p>
                <p style="font-size: 13px; border-bottom: 1px solid #000; width: 211px; text-ailgn: center; margin: 0">{{blPrintData.lxdh}}</p>
              </div>
            </div>
          </div>
        </div>
        <div style="margin: 3px auto;">
          <table border="1" cellpadding="0" style="border-collapse: collapse; border: 1px solid #000; width: 100%">
            <tr style="width: 100%">
              <td style="font-size: 13px; height: 160px; width: auto; border: 1px solid #000; position: relative" colspan="4">
                <p style="position: absolute; top: 3px; left: 5px; margin: 0">病史摘要（包括重要病史、临床症状、药物治疗、影像学检查、实验室检查等）：</p>
                <p style="position: absolute; top: 25px; left: 5px; margin: 0">{{blPrintData.bszy}}</p>
                <p style="position: absolute; bottom: 20px; left: 5px; margin: 0">手术所见：</p>
                <p style="position: absolute; top: 80px; left: 5px; margin: 0">{{blPrintData.sssj}}</p>
              </td>
            </tr>
            <tr style="width: 100%; font-size: 13px">
              <td style="font-size: 13px; border: 1px solid #000; height: 20px; padding-left: 5px" colspan="4">临床诊断：{{blPrintData.lczd}}</td>
            </tr>
            <tr style="height: 20px; width: 100%; font-size: 13px">
              <td style="border: 1px solid #000; width: 125px; padding-left: 5px">送检标本</td>
              <td style="border: 1px solid #000; width: 200px; padding-left: 5px">采取部位</td>
              <td style="border: 1px solid #000; width: 200px; padding-left: 5px">标本名称</td>
              <td style="border: 1px solid #000; width: auto; padding-left: 5px">曾在何处做过病理检查</td>
            </tr>
            <tr style="height: 20px; width: 100%; font-size: 13px">
              <td style="border: 1px solid #000; width: 125px; padding-left: 5px">{{blPrintData.bbList && blPrintData.bbList[0] ? blPrintData.bbList[0].sjbb : ''}}</td>
              <td style="border: 1px solid #000; width: 200px; padding-left: 5px">{{blPrintData.bbList && blPrintData.bbList[0] ? blPrintData.bbList[0].cqbw : ''}}</td>
              <td style="border: 1px solid #000; width: 200px; padding-left: 5px">{{blPrintData.bbList && blPrintData.bbList[0] ? blPrintData.bbList[0].bbmc : ''}}</td>
              <td style="border: 1px solid #000; width: auto; padding-left: 5px" rowspan="4">
                <div style="display: flex; height: 20px">
                  <p style="font-size: 13px; width: 60px; margin: 0">检查日期</p>
                  <p style="border-bottom: 1px solid #000; width: 100px; padding-bottom: 2px; margin: 0">{{blPrintData.jcrq}}</p>
                  <p style="font-size: 13px; width: 50px; margin: 0">病理号</p>
                  <p style="border-bottom: 1px solid #000; width: 108px; padding-bottom: 2px; margin: 0">{{blPrintData.jcblh}}</p>
                </div>
                <div style="display: flex; height: 20px">
                  <p style="margin: 0">检查医院</p>
                  <p style="border-bottom: 1px solid #000; width: 265px;padding-left: 5px; padding-bottom: 2px; margin: 0">{{blPrintData.jcyy}}</p>
                </div>
                <div style="display: flex; height: 20px">
                  <p style="margin: 0">诊断</p>
                  <p style="border-bottom: 1px solid #000; width: 291px; padding-left: 5px; padding-bottom: 2px; margin: 0">{{blPrintData.jczd}}</p>
                </div>
              </td>
            </tr>
            <tr style="height: 20px; width: 100%; font-size: 13px">
              <td style="border: 1px solid #000; padding-left: 5px">{{blPrintData.bbList && blPrintData.bbList[1] ? blPrintData.bbList[1].sjbb : ''}}</td>
              <td style="border: 1px solid #000; padding-left: 5px">{{blPrintData.bbList && blPrintData.bbList[1] ? blPrintData.bbList[1].cqbw : ''}}</td>
              <td style="border: 1px solid #000; padding-left: 5px">{{blPrintData.bbList && blPrintData.bbList[1] ? blPrintData.bbList[1].bbmc : ''}}</td>
            </tr>
            <tr style="height: 20px; width: 100%; font-size: 13px">
              <td style="border: 1px solid #000; padding-left: 5px">{{blPrintData.bbList && blPrintData.bbList[2] ? blPrintData.bbList[2].sjbb : ''}}</td>
              <td style="border: 1px solid #000; padding-left: 5px">{{blPrintData.bbList && blPrintData.bbList[2] ? blPrintData.bbList[2].cqbw : ''}}</td>
              <td style="border: 1px solid #000; padding-left: 5px">{{blPrintData.bbList && blPrintData.bbList[2] ? blPrintData.bbList[2].bbmc : ''}}</td>
            </tr>
            <tr style="height: 20px; width: 100%; font-size: 13px">
              <td style="border: 1px solid #000; padding-left: 5px">{{blPrintData.bbList && blPrintData.bbList[3] ? blPrintData.bbList[3].sjbb : ''}}</td>
              <td style="border: 1px solid #000; padding-left: 5px">{{blPrintData.bbList && blPrintData.bbList[3] ? blPrintData.bbList[3].cqbw : ''}}</td>
              <td style="border: 1px solid #000; padding-left: 5px">{{blPrintData.bbList && blPrintData.bbList[3] ? blPrintData.bbList[3].bbmc : ''}}</td>
            </tr>
            <tr style="height: 20px; width: 100%; font-size: 13px">
              <td style="border: 1px solid #000; padding-left: 5px">{{blPrintData.bbList && blPrintData.bbList[4] ? blPrintData.bbList[4].sjbb : ''}}</td>
              <td style="border: 1px solid #000; padding-left: 5px">{{blPrintData.bbList && blPrintData.bbList[4] ? blPrintData.bbList[4].cqbw : ''}}</td>
              <td style="border: 1px solid #000; padding-left: 5px">{{blPrintData.bbList && blPrintData.bbList[4] ? blPrintData.bbList[4].bbmc : ''}}</td>
              <td style="border: 1px solid #000; padding-left: 5px"></td>
            </tr>
            <tr>
              <td colspan="4" style="height: 20px; border: 1px solid #000; font-size: 13px; padding-left: 5px">检查项目</td>
            </tr>
            <tr>
              <td colspan="4" style="height: 190px; border: 1px solid #000; font-size: 13px; position: relative; padding-left: 5px; padding-top: 5px">
                <span style="height: 190px; width: 50%; border-right: 1px solid #000; display: inline-block; position: absolute; top: 0"><p v-for="(item,index) in jcxmArrl" :key="index" style="">{{index+1}}、{{item.xmmc}}</p></span>
                <span style="height: 190px; width: 50%; display: inline-block; position: absolute; top: 0; left: 50%; padding-left: 9px"><p v-for="(item,index) in jcxmArr2" :key="index" style="">{{index+7}}、{{item.xmmc}}</p></span>
              </td>
            </tr>
            <tr style="height: auto">
              <td colspan="4" style="height: 130px; padding-left: 5px; padding-top: 5px">
                <p style="font-size: 13px; margin-bottom: 5px">（若系妇科标本，请填写下来各项）：</p>
                <div style="display: flex; justify-content: left; margin-bottom: 5px; margin-left: 5px; height: 20px">
                  <p style="font-size: 13px; margin: 0">末次月经日期</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 160px;padding-left: 3px; margin: 0">{{blPrintData.mcyjrq}}</p>
                  <p style="font-size: 13px; margin: 0">经量</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 160px;padding-left: 3px; margin: 0">{{blPrintData.jl}}</p>
                  <p style="font-size: 13px; margin: 0">周期及持续时间</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 160px;padding-left: 3px; margin: 0">{{blPrintData.zqjcxsj}}</p>
                </div>
                <div style="display: flex; justify-content: left; margin-bottom: 5px; margin-left: 5px; height: 20px">
                  <p style="font-size: 13px; margin: 0">有否质量（内分泌）</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 121px; margin: 0">{{blPrintData.yfzl == 1 ? '是' : '否'}}</p>
                  <p style="font-size: 13px; margin: 0">日期</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 161px;padding-left: 3px; margin: 0">{{blPrintData.nfmrq}}</p>
                  <p style="font-size: 13px; margin: 0">剂量及持续时间</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 160px;padding-left: 3px; margin: 0">{{blPrintData.jljcxsj}}</p>
                </div>
                <div style="display: flex; justify-content: left; margin-bottom: 5px; margin-left: 5px; height: 20px">
                  <p style="font-size: 13px; margin: 0">刮宫日期</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px;padding-left: 3px; margin: 0">{{blPrintData.ggrq_y}}</p>
                  <p style="font-size: 13px; margin: 0">年</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px;padding-left: 3px; margin: 0">{{blPrintData.ggrq_m}}</p>
                  <p style="font-size: 13px; margin: 0">月</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px;padding-left: 3px; margin: 0">{{blPrintData.ggrq_d}}</p>
                  <p style="font-size: 13px; margin: 0">日</p>
                </div>
                <div style="display: flex; justify-content: left; margin-bottom: 5px; margin-left: 5px; height: 20px">
                  <p style="font-size: 13px; margin: 0">送检日期</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px;padding-left: 3px; margin: 0">{{blPrintData.sjrq_y}}</p>
                  <p style="font-size: 13px; margin: 0">年</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px;padding-left: 3px; margin: 0">{{blPrintData.sjrq_m}}</p>
                  <p style="font-size: 13px; margin: 0">月</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px;padding-left: 3px; margin: 0">{{blPrintData.sjrq_d}}</p>
                  <p style="font-size: 13px; margin: 0">日</p>
                </div>
                <div style="display: flex; justify-content: left; margin-left: 5px; margin-bottom: 5px; height: 20px">
                  <p style="font-size: 13px; margin: 0">送检医生</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px;padding-left: 3px; margin: 0">{{blPrintData.sjys}}</p>
                  <p style="font-size: 13px; margin: 0">收到日期</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px;padding-left: 3px; margin: 0">{{blPrintData.sdrq_y}}</p>
                  <p style="font-size: 13px; margin: 0">年</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px;padding-left: 3px; margin: 0">{{blPrintData.sdrq_m}}</p>
                  <p style="font-size: 13px; margin: 0">月</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px;padding-left: 3px; margin: 0">{{blPrintData.sdrq_d}}</p>
                  <p style="font-size: 13px; margin: 0">日</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px;padding-left: 3px; margin: 0">{{blPrintData.sdrq_h}}</p>
                  <p style="font-size: 13px; margin: 0">时</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px;padding-left: 3px; margin: 0">{{blPrintData.sdrq_mm}}</p>
                  <p style="font-size: 13px; margin: 0">分</p>
                  <p style="font-size: 13px; margin: 0 0 0 50px">签收人：</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 100px; margin: 0">{{blPrintData.qsr}}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="4" style="height: auto; border: 1px solid #000; padding-left: 5px; padding-top: 5px">
                <p style="font-size: 13px; margin: 0 0 5px 0">注意事项：</p>
                <p style="font-size: 13px; margin: 0 0 5px 0">1．申请单务请以正楷详细填写，以利于诊断。</p>
                <p style="font-size: 13px; margin: 0 0 5px 0">2．患者姓名、出身日期、住院号或门诊号必须在标本瓶上注明。</p>
                <p style="font-size: 13px; margin: 0 0 5px 0">3．用手术取下标本后，须从速固定于百分之十福尔马林液内，标本瓶口宜大，以便取出。</p>
                <p style="font-size: 13px; margin: 0 0 5px 0">4．传染性标本须注意处置，并请标明。</p>
                <p style="font-size: 13px; margin: 0 0 5px 0">5．手术切除标本务请全部送检。如贵科打算留作教学标本，可待我科验证后商议处理。</p>
                <p style="font-size: 13px; margin: 0 0 5px 0">6．若发现病理报告与临床不符时，请立即与我科联系。</p>
              </td>
            </tr>
            <tr>
              <td colspan="4" style="height: 100px; border: 1px solid #000; position: relative; width: 100%">
                <span style="height: 100px; border-right: 1px solid #000; width: 33.33%; display: inline-block; position: absolute; top: 0; left: 0">
                  <p style="font-size: 13px; margin: 5px 0 7px 5px">送检时请将右联填好撕下贴在送</p>
                  <p style="font-size: 13px; margin: 0 0 0 5px">检之标本的瓶下</p>
                </span>
                <span style="height: 100px; border-right: 1px solid #000; width: 33.33%; display: inline-block; position: absolute; left: 33.33%; top: 0; font-size: 13px">
                  <div style="display: flex; justify-content: left; font-size: 13px; height: 20px; margin-top: 5px; margin-left: 5px">
                    <p style="margin: 0">姓名:</p>
                    <p style="border-bottom: 1px solid #000; width: 60px; padding-left: 3px;margin: 0">{{blPrintData.hzxm}}</p>
                    <p style="margin: 0">出生日期:</p>
                    <p style="border-bottom: 1px solid #000; width: 90px; padding-left: 3px; margin: 0">{{blPrintData.csrq}}</p>
                  </div>
                  <div style="display: flex; justify-content: left; font-size: 13px; height: 20px; margin-top: 5px; margin-left: 5px">
                    <p style="margin: 0">住院号或门诊号：</p>
                    <p style="border-bottom: 1px solid #000; width: 100px; margin: 0">{{blPrintData.mzh}}</p>
                  </div>
                  <div style="display: flex; justify-content: left; font-size: 13px; height: 20px; margin-top: 5px; margin-left: 5px">
                    <p style="margin: 0">联单号：</p>
                    <p style="border-bottom: 1px solid #000; width: 120px; margin: 0">{{blPrintData.ldh}}</p>
                  </div>
                </span>
                <span style="width: 33.33%; position: absolute; left: 66.66%; top: 0; font-size: 13px">
                  <div style="display: flex; justify-content: left; font-size: 13px; height: 20px; margin-top: 5px; margin-left: 5px">
                    <p style="margin: 0">姓名</p>
                    <p style="border-bottom: 1px solid #000; width: 60px; padding-left: 3px;  margin: 0">{{blPrintData.hzxm}}</p>
                    <p style="margin: 0">出生日期：</p>
                    <p style="border-bottom: 1px solid #000; width: 90px; padding-left: 3px;  margin: 0">{{blPrintData.csrq}}</p>
                  </div>
                  <div style="display: flex; justify-content: left; font-size: 13px; height: 20px; margin-top: 5px; margin-left: 5px">
                    <p style="margin: 0">住院号或门诊号：</p>
                    <p style="border-bottom: 1px solid #000; width: 100px; margin: 0">{{blPrintData.mzh}}</p>
                  </div>
                  <div style="display: flex; justify-content: left; font-size: 13px; height: 20px; margin-top: 5px; margin-left: 5px">
                    <p style="margin: 0">联单号：</p>
                    <p style="border-bottom: 1px solid #000; width: 120px; margin: 0">{{blPrintData.ldh}}</p>
                  </div>
                </span>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <!-- 检查申请单 -->
    <div id="jcsqd" style="width: 210mm; border: 1px solid  #000" v-show="true">
      <div style="display: flex; width: 100%; height: auto; margin: 0 auto; justify-content: space-between; padding-left: 1mm; padding-right: 1mm; border-bottom: 1px solid #000">
        <img id="imgInit2" src="" style="width: 200px; height: 30px; margin-bottom: 4px" />
        <span style="color: #6a6d78; height: 13px; margin-top: 17px; margin-right: 40px">YW-BD-0110-002</span>
      </div>
      <div style="width: 100%; margin: 0 auto">
        <div style="fontsize: 21px; text-align: center; margin-top: 10px; margin-bottom: 15px; letter-spacing: 2px">检查申请单</div>
        <div style="width: auto; margin: 0 auto">
          <div style="display: flex; justify-content: center;text-align:center; height: 20px; margin-bottom: 5px">
            <p style="margin: 0; width: 28px; font-size: 13px">姓名</p>
            <p style="margin: 0; border-bottom: 1px solid #000; width: 65px; text-align: center; font-size: 13px">{{jcPrintData.hzxm}}</p>
            <p style="margin: 0; width: 56px; font-size: 13px">出生日期</p>
            <p style="margin: 0; border-bottom: 1px solid #000; width: 33px;padding-left: 1px; text-ailgn: center; font-size: 13px">{{jcPrintData.csrq_y}}</p>
            <p style="margin: 0; font-size: 13px">年</p>
            <p style="margin: 0; border-bottom: 1px solid #000; width: 18px;padding-left: 1px; text-ailgn: center; font-size: 13px">{{jcPrintData.csrq_m}}</p>
            <p style="margin: 0; font-size: 13px">月</p>
            <p style="margin: 0; border-bottom: 1px solid #000; width: 18px;padding-left: 1px; text-ailgn: center; font-size: 13px">{{jcPrintData.csrq_d}}</p>
            <p style="margin: 0; font-size: 13px">日</p>
            <p style="margin: 0; width: 28px; font-size: 13px; margin-left: 3px">性别</p>
            <p style="margin: 0; border-bottom: 1px solid #000; width: 23px; text-ailgn: center; font-size: 13px">{{jcPrintData.xb}}</p>
            <p style="margin: 0; width: 28px; font-size: 13px">年龄</p>
            <p style="margin: 0; border-bottom: 1px solid #000; width: 33px; text-ailgn: center; font-size: 13px">{{jcPrintData.nl}}</p>
            <p style="margin: 0; width: 28px; font-size: 13px">科室</p>
            <p style="margin: 0; border-bottom: 1px solid #000; width: 65px; text-ailgn: center; font-size: 13px">{{jcPrintData.ksmc}}</p>
            <p style="margin: 0; width: 28px; font-size: 13px">病区</p>
            <p style="margin: 0; border-bottom: 1px solid #000; width: 65px; text-ailgn: center; font-size: 13px"></p>
            <p style="margin: 0; width: 28px; font-size: 13px">床号</p>
            <p style="margin: 0; border-bottom: 1px solid #000; width: 25px; text-ailgn: center; font-size: 13px"></p>
            <p style="margin: 0; font-size: 12px; width: 96px">门诊号或住院号</p>
            <p style="margin: 0; border-bottom: 1px solid #000; width: 90px; text-ailgn: center; font-size: 13px">{{jcPrintData.mzh}}</p>
          </div>
        </div>
        <div style="margin: 3px auto"> <!-- border-collapse合并重复的边框 -->
          <table border="1" cellpadding="0" style="border-collapse:collapse; border: 1px solid #000; width: 100%">
            <tr style="width: 100%">
              <td style="font-size: 13px; height: 35px;line-height: 35px; padding-left: 5px" colspan="2">申请项目：{{jcPrintData.jcxm}}</td>
            </tr>
            <tr style="width: 100%">
              <td style="font-size: 13px; height: 35px;line-height: 35px; padding-left: 5px; border: 1px solid #000" colspan="2">
                <div style="display: flex;justify-content: flex-start;height: 20px;line-height: 20px;">
                  <p style="margin: 0">是否加急：</p>
                  <p style="margin: 0 5px 0 0;">是</p><p style="border-right: 1px solid #000;height: 14px;margin: 4px 0 0"></p><p style="border: 1px solid #000; width: 12px; height: 12px;line-height: 12px;margin: 4px 5px 0 0;">{{jcPrintData.sfjj == 1 ? '✔' : ''}}</p>
                  <p style="margin: 0 5px 0 0;">否</p><p style="border-right: 1px solid #000;height: 14px;margin: 4px 0 0"></p><p style="border: 1px solid #000; width: 12px; height: 12px;line-height: 12px;margin: 4px 5px 0 0;">{{jcPrintData.sfjj == 0 ? '✔' : ''}}</p>
                </div>
              </td>
            </tr>

            <tr style="width: 100%">
              <td style="font-size: 13px; height: 35px;line-height: 35px; padding-left: 5px;border: 1px solid #000;" colspan="2">初步诊断：{{jcPrintData.cbzd}}</td>
            </tr>
            <tr style="width: 100%">
              <td style="font-size: 13px; height: 120px; padding-left: 5px;border: 1px solid #000;position: relative" colspan="2">
                <p style="position: absolute; top: 0;left: 5px;width: 780px">病情简介：{{jcPrintData.bqjj}}</p>
              </td>
            </tr>
            <tr style="width: 100%">
              <td style="font-size: 13px; height: 35px;line-height: 35px; padding-left: 5px;border: 1px solid #000;" colspan="2">检查主要目的：{{jcPrintData.jczymd}}</td>
            </tr>
            <tr style="width: 100%">
              <td style="font-size: 13px; height: 35px;line-height: 35px; padding-left: 5px;border: 1px solid #000;">申请科室：{{jcPrintData.sqks}}</td>
              <td style="font-size: 13px; height: 35px;line-height: 35px; padding-left: 5px;border: 1px solid #000;">申请医师：{{jcPrintData.sqys}}</td>
            </tr>
            <tr style="width: 100%">
              <td style="font-size: 13px; height: 35px;line-height: 35px; padding-left: 5px;border: 1px solid #000;width: 50%">
                <div style="display: flex; justify-content: flex-start;height: 20px;line-height: 20px;">
                  <p style="margin: 0">申请日期：</p>
                  <p style="border-bottom: 1px solid #000; margin: 0; width: 30px;">{{jcPrintData.sqrq_y}}</p><p style="margin: 0">年</p>
                  <p style="border-bottom: 1px solid #000; margin: 0; width: 30px;">{{jcPrintData.sqrq_m}}</p><p style="margin: 0">月</p>
                  <p style="border-bottom: 1px solid #000; margin: 0; width: 30px;">{{jcPrintData.sqrq_d}}</p><p style="margin: 0">日</p>
                  <p style="border-bottom: 1px solid #000; margin: 0; width: 30px;">{{jcPrintData.sqrq_h}}</p><p style="margin: 0">时</p>
                  <p style="border-bottom: 1px solid #000; margin: 0; width: 30px;">{{jcPrintData.sqrq_mm}}</p><p style="margin: 0">分</p>
                </div>
              </td>
              <td style="font-size: 13px; height: 20px; padding-left: 5px;border: 1px solid #000;">执行科室：{{jcPrintData.zxks}}</td>
            </tr>
            <tr style="width: 100%">
              <td style="font-size: 13px; height: 35px;line-height: 35px; padding-left: 5px;border: 1px solid #000;" colspan="2">
                注意事项：该申请如果有注意事项或特殊需求，请申请者备注说明，执行科室予以配合。
              </td>
            </tr>
          </table> 
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { queryData, queryZlxmList, saveZlxmList, getById, queryEmrZlxmInfo,queryBljcPrintData,queryJcsqPrintData,queryLogo } from '@/api/cis/op/dctwork/inspect'
import { saveZySqd } from '@/api/his/im/residentDoctor/orderEntry'
import { doubleNum, deepCopy, isEmpty } from '@/utils/index'
import { Form } from 'element-ui'
import appointData from '../../medTechAppoint/components/appointData.vue'
import { queryYysjView, queryRecentTimeByHyrq, queryRecentTime, queryBcjlByEmr } from '@/api/cis/op/dctwork/medTechAppoint'
import { userInfo } from 'os'
import { AxiosResponse } from 'axios'
import { getLodop } from '@/plugins/lodop/index.js'
import PayStyle from '@/views/his/sys/centerMaintenance/medicareInfoManage/payStyle/payStyle.vue'
//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'Inspect',
  components: {
    appointData,
    PayStyle,
  },
})
export default class extends Vue {
  @Prop({ required: true }) private patientFile!: any
  @Prop({ required: true }) private patientObj!: any
  @Prop({ required: false, default: 'outp' }) private outpOrInpa!: string
  @Prop({ required: false, default: true }) private editStatus!: any // 编辑状态
  @Prop({ required: false, default: null }) private reqObj!: any // 申请单对象
  // @Prop({ required: false, default: false }) private isExit!: any // 是否显示新开按钮
  private jcxmArrl: Array<any> = [] // 检查项目左
  private jcxmArr2: Array<any> = [] // 检查项目右
  private saveStatus: boolean = false // 保存按钮的禁用状态
  private tableDatas: Array<any> = []
  private specimenData: Array<any> = []
  private defaultExpandedKeys: Array<any> = []
  private title: string = ''
  private showDetail: boolean = false
  private timeList: any[] = []
  private jclx: number = 0
  private showAllForm: boolean = false
  private showBlsqForm: boolean = false
  private currEditStatus: boolean = true
  private jcxh: string = ''
  private htmlSearchData: any = {}
  private rowIndex: number = 0
  private blPrintData: any = {} // 病理打印数据
  private jcPrintData: any = {} // 检查申请单打印数据
  private loGo: any = '' // 医院logo
  private formData: any = {
    age: '',
    brid: '',
    brks: 0,
    brxb: 0,
    brxm: '',
    gmfy: '',
    hyid: 0,
    jcbw: '',
    jcdd: '',
    jcfy: 0,
    jch: '',
    jcmd: '',
    jcxm: '',
    jzkh: '',
    jzxh: 0,
    lxdh: '',
    lxdz: '',
    mqzd: '',
    mzhm: '',
    sqlx: 0,
    sqsj: '',
    sqys: '',
    tztz: '',
    yjlx: 0,
    yyrq: null,
    yysj: '',
    alt: 0,
    hbsag: 0,
    knjsy: 0,
    sfwt: 0,
    sxhdsss: 0,
    wjsgj: 0,
    ycxhjq: 0,
    ywtnbs: 0,
    sfjj: 0,
    jcrq: '',
    jcblh: '',
    jcyy: '',
    jczd: '',
    mcyjrq: '',
    jl: '',
    zqjcxsj: '',
    yfzl: '',
    yfzlrq: '',
    jljcxsj: '',
    ggrq: '',
    sjrq: '',
    sjys: '',
    sdrq: '',
    qsr: '',
    sfbljc: 0,
    cisJcsq03: [],
  }
  private dataSub: any = {}
  private defaultProps: any = {
    children: 'children',
    label: 'label',
    id: 'id',
    pid: 'pid',
    sort: 'sort',
    zxbz: 'zxbz',
    jclx: 'jclx',
    isLeaf: 'leaf',
  }
  private data: Array<any> = []
  private haveOrNoList: Array<any> = [
    {
      dv: 1,
      dn: '有',
    },
    {
      dv: 0,
      dn: '无',
    },
  ]
  private yesOrNoList: Array<any> = [
    {
      dv: 1,
      dn: '是',
    },
    {
      dv: 0,
      dn: '否',
    },
  ]
  private blId: number = 0 // 判断打印
  private currReqObj: any = null
  private key: number = 0
  private initLabel: string = '' //医技书类型节点名称
  private rulesForm: any = {
    // yyrq: [{ required: true, message: '请选择预约日期', trigger: 'change' }]
  }
  private isPrint: boolean = false
  private listSlotHeight: number = 0 //列表高度
  private echoTableSel: Array<any> = [
    {
      fydj: 200,
      jczqtys: null,
      xmmc: '下腔静脉',
      zlxmid: 2111,
      zxks: 1016,
      zysx: null,
    },
    {
      fydj: 300,
      jczqtys: null,
      xmmc: '双上肢动脉',
      zlxmid: 2114,
      zxks: 1016,
      zysx: null,
    },
  ]
  private yfzlArr: Array<any> = [
    { dn: '是', dv: '1' },
    { dn: '否', dv: '2' },
  ]
  private resultHeaderUser = [
    {
      prop: 'ysbh',
      label: '医生编号',
    },
    {
      width: 190,
      prop: 'personName',
      label: '姓名',
    },
  ]

  @Watch('reqObj', { immediate: true })
  private onReqObjChange(val: any) {
    this.dataEcho()
  }

  get userInfo() {
    return JSON.parse(localStorage.userInfo)
  }

  dataEcho() {
    this.currEditStatus = this.editStatus

    this.currReqObj = this.reqObj
    if (!isEmpty(this.currReqObj) && !isEmpty(this.currReqObj.sqid)) {
      queryEmrZlxmInfo({ sqid: this.currReqObj.sqid }).then((res) => {
        this.echoTableSel = res.data.cisJcsq02ZlxmRespList
        this.imitateHandleClickNode(res.data.children[0], 1)
        this.formData = Object.assign(this.formData, res.data)
      })
      // let nowData = {
      // 	id:2,
      // 	label: "超声申请单",
      // 	sort: 2,
      // 	pid: 0,
      // 	children:[
      // 		// 	{
      // 		// 	id:55,
      // 		// 	label: "胸部",
      // 		// 	sort: 7,
      // 		// 	pid: 2,
      // 		// 	children:[{
      // 		// 		children: null,
      // 		// 		id: 155,
      // 		// 		label: "测试09",
      // 		// 		leaf: true,
      // 		// 		pid: 55,
      // 		// 		sort: 22,
      // 		// 	}]
      // 		// },
      // 		{
      // 			children: null,
      // 			id: 69,
      // 			label: "血管",
      // 			leaf: true,
      // 			pid: 2,
      // 			sort: 8,
      // 		}
      // 	]
      // }
      // this.imitateHandleClickNode(nowData,1)
    }
  }

  imitateHandleClickNode(data: any, level: number) {
    let node = {
      data,
      expanded: true,
      indeterminate: false,
      isCurrent: true,
      isLeaf: data.children && data.children.length != 0 ? false : true,
      isLeafByUser: false,
      level,
      loaded: true,
      loading: false,
      visible: true,
    }
    if (!node.isLeaf) {
      this.defaultExpandedKeys.push(data.id)
      this.imitateHandleClickNode(data.children[0], ++level)
    } else {
      // 查询表格内容
      setTimeout(() => {
        let nowNode = (this.$refs.tree as any).getNode(data)
        if (nowNode) {
          ;(this.$refs.tree as any).setCurrentKey(data.id)
          this.handleNodeClick(data, nowNode)
        } else {
          this.imitateHandleClickNode(data, level)
        }
      }, 500)
    }
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }

  mounted() {
    this.$set(this.formData,'sqysName',this.userInfo.name) // 默认选择当前登录医生
    this.formData.sqys = this.userInfo.userId
    this.formData.mqzd = this.patientObj.fymc
    // if (this.outpOrInpa == 'outp') this.formData.tztz = '主诉:' + this.patientObj.zsxx + '\n 体格检查:' + (this.patientObj.tgjc || '')
    // else {
    //   this.formData.tztz = ''
    //   this.formData.mqzd = this.patientObj.mqzd
    // }
    queryData({ pid: 0 }).then((res: any) => {
      this.data = res.data.map((item: any) => {
        var param = {
          label: item.name,
          id: item.id,
          pid: item.pid,
          sort: item.sort,
          zxbz: item.zxbz,
          jclx: item.jclx,
          children: item.chileNum > 0 ? [] : null,
          leaf: item.chileNum > 0 ? false : true,
        }
        return param
      })
      this.dataEcho()
    })
    this.queryPrintLogo()
  }

  // 重置表单
  reset() {
    this.formData = {
      age: '',
      brid: '',
      brks: 0,
      brxb: 0,
      brxm: '',
      gmfy: '',
      hyid: 0,
      jcbw: '',
      jcdd: '',
      jcfy: 0,
      jch: '',
      jcmd: '',
      jcxm: '',
      jzkh: '',
      jzxh: 0,
      lxdh: '',
      lxdz: '',
      mqzd: '',
      mzhm: '',
      sqlx: 0,
      sqsj: '',
      sqys: '',
      tztz: '',
      yjlx: 0,
      yyrq: null,
      yysj: '',
      alt: 0,
      hbsag: 0,
      knjsy: 0,
      sfwt: 0,
      sxhdsss: 0,
      wjsgj: 0,
      ycxhjq: 0,
      ywtnbs: 0,
      sfjj: 0,
    }
    this.formData.mqzd = this.patientObj.fymc
    // if (this.outpOrInpa == 'outp') this.formData.tztz = '主诉:' + this.patientObj.zsxx + '\n 体格检查:' + (this.patientObj.tgjc || '')
    // else {
    //   this.formData.tztz = ''
    //   this.formData.mqzd = this.patientObj.mqzd
    // }
    this.dataSub = {
      brid: this.patientFile.brid,
      brks: this.patientFile.zsid,
      brksText: this.patientFile.zsidName,
      brxm: this.patientFile.brxm,
      brxz: this.patientFile.brxz,
      clinicId: this.patientFile.clinicId,
      djly: 1,
      ghgl: this.patientFile.mzhm,
      jzkh: this.patientFile.jzkh,
    }
    this.formData = Object.assign(this.formData, this.patientFile)
    this.echoTableSel = []
    this.currEditStatus = true
    this.currReqObj = null
    this.$set(this.formData,'sqysName',this.userInfo.name) // 默认获取当前登录医生
    this.formData.sqys = this.userInfo.userId
    this.toggleSelection([])
  }

  toggleSelection(rows: any) {
    if (rows.length != 0) {
      rows.forEach((row: any) => {
        ;(this.$refs.multipleTable as any).toggleRowSelection(row)
      })
    } else {
      ;(this.$refs.multipleTable as any).clearSelection()
    }
  }

  /**
   * @Description: 选择列表数据，计算并赋值
   * @author: zhml
   * @param {type}:
   * @return:
   * @date 2020/6/29
   */
  private handleSelectionChange(val: any) {
    // 判断保存按钮的禁用状态
    if(val.length > 0) {
      this.saveStatus = true
    } else {
      this.saveStatus = false
    }
    queryRecentTime({ jklx: this.jclx }).then((res: any) => {
      // this.formData.yyrq = res.data.hyrq.split(' ')[0]
      // this.formData.yysj = res.data.hysj
      this.formData.jcdd = res.data.sbdz
    })
    this.formData.jcfy = 0
    this.formData.jcxm = ''
    this.formData.jcmd = '协助检查'
    this.currEditStatus = true

    // this.formData.yyrq = null
    // this.formData.yysj = ''
    this.formData.sqys = JSON.parse(localStorage.getItem('userInfo') as string).userId
    // 检查费用
    val.forEach((item: any) => {
      this.formData.jcfy = this.formData.jcfy + item.fydj
      if (this.formData.jcxm == '' || !this.formData.jcxm) {
        this.formData.jcxm = item.xmmc
      } else {
        this.formData.jcxm = this.formData.jcxm.concat('/' + item.xmmc)
      }
    })
    this.formData.jcfy = doubleNum(this.formData.jcfy)
    // if (this.outpOrInpa == 'outp') this.formData.tztz = '主诉:' + this.patientObj.zsxx + '\n 体格检查:' + (this.patientObj.tgjc || '')
    // else this.formData.tztz = ''
    this.dataSub.ysJx02List = val.map((item: any) => {
      let param = {
        fydj: item.fydj,
        fymc: item.xmmc,
        jczqtys: item.jczqtys,
        zlxmid: item.zlxmid,
        zxks: item.zxks,
        zysx: item.zysx,
      }
      return param
    })
    this.formData.jcbw = (this.$refs.tree as any).getCurrentNode().label
  }

  /**
   * @Description: 点击医技书内容,申请单页面的标题
   * @author: zhml
   * @param {type}:
   * @return:
   * @date 2020/6/29
   */
  private async handleNodeClick(data: any, node: any) {
    console.log(data)
    if (data.jclx == 20) {
      this.showAllForm = true
    } else {
      this.showAllForm = false
    }
    if (data.jclx == 7) {
      this.blId = data.pid
      this.showBlsqForm = true
    } else {
      this.blId = 0
      this.showBlsqForm = false
    }
    if (data.children !== null) return null
    else {
      // 获取申请单标题
      if (node.level === 1) {
        this.title = node.label
      } else if (node.parent.level == 1) {
        this.title = node.parent.label
      } else if (node.parent.parent.level == 1) {
        this.title = node.parent.parent.label
      }

      //  医技书的点击事件
      this.dataSub = {
        brid: this.patientFile.brid,
        brks: this.patientFile.zsid,
        brksText: this.patientFile.zsidName,
        brxm: this.patientFile.brxm,
        brxz: this.patientFile.brxz,
        clinicId: this.patientFile.clinicId,
        djly: 1,
        ghgl: this.patientFile.mzhm,
        jzkh: this.patientFile.jzkh,
      }
      this.formData = Object.assign(this.formData, this.patientFile)
      // console.log('检查申请',this.formData)
      if (this.outpOrInpa == 'outp') {
        this.formData.age = this.patientFile.nl
        this.formData.brks = this.patientFile.zsid
      } else {
        this.formData.age = this.patientFile.rynl
        this.formData.brks = this.patientFile.brks
      }

      let param = {
        yjlx: data.id,
        brxz: this.patientFile.brxz,
      }
      this.initLabel = data.label

      await getById({ id: data.id }).then((res: any) => {
        this.jclx = res.data.jclx
        queryZlxmList(param).then((res: any) => {
          this.tableDatas = res.data
          var that = this
          that.$nextTick(() => {
            that.tableDatas.forEach((row) => {
              let arr = that.echoTableSel.filter((item) => row.zlxmid == item.fyxh)
              if (arr.length == 1) {
                ;(that.$refs.multipleTable as any).toggleRowSelection(row, true)
              }
            })
          })
          // 每次选择医技书类型，检查费用清0
          this.formData.jcfy = 0
          this.formData.jcxm = ''
        })
      })
    }
  }

  // 获取病历信息
  private getEmrInfo() {
    const params: any = {
      jzlsh: this.$store.state.pnParam.PN_PARAM.jzlsh,
    }
    queryBcjlByEmr(params).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        for (let i in res.data) {
          if (res.data[i] == null) {
            res.data[i] = ''
          }
        }
        // let bqjjArr0: <any> = []
        // let bqjjArr1: <any> = [
        //   {zsxx:res.data.zsxx,index:0},
        //   {xbs:res.data.xbs,index:1},
        //   {jws:res.data.jws,index:2},
        //   {tgjc:res.data.tgjc,index:3}
        // ]
        // let bqjjArr2: <any> = [
        //   '主诉：',
        //   '现病史：',
        //   '既往史：',
        //   '体格检查：'
        // ]
        // bqjjArr0 = bqjjArr1.filter((el: any) => {
        //   return el != ''
        // })
        this.formData.tztz = '主诉：' + res.data.zsxx + '\n' + '现病史：' + res.data.xbs + '\n' + '既往史：' + res.data.jws + '\n' + '体格检查：' + res.data.tgjc
      }
    })
  }

  private handleCancle() {
    this.showDetail = false
  }

  private openYysjDialog() {
    if (!this.formData.yyrq) {
      this.$notify({
        title: '请先选择预约日期',
        message: '',
        type: 'warning',
      })
      return
    }
    queryYysjView({ hyrq: this.formData.yyrq, jclx: this.jclx }).then((res: any) => {
      this.timeList = res.data
      this.showDetail = true
    })
  }

  private getTime(item: any) {
    this.formData.yysj = item.hysj
    // this.hyid = item.hyid
    // freezeSBHH({ hyid: item.hyid }).then(() => {
    // })
    this.key++
    this.showDetail = false
  }

  private checkoutDate(val: any, jklx: string) {
    if (!this.jclx) {
      this.$message({
        message: '请先选择医技项目',
        type: 'warning',
      })
      this.formData.yyrq = null
      this.formData.yysj = ''
      return
    }
    // this.unfreeeSBBHCheck()
    if (!this.formData.yyrq) {
      return
    }
    queryRecentTimeByHyrq({ hyrq: val, jklx: this.jclx })
      .then((res: any) => {
        if (res.data && res.data.length != 0) {
          this.formData.yysj = res.data[0].hysj
          // this.hyid = res.data[0].hyid
          // freezeSBHH({ hyid: res.data[0].hyid }).then(() => {
          // })
          this.key++
        } else {
          this.formData.yyrq = null
          this.formData.yysj = ''
          this.key++
          this.$message({
            message: `${val}没有预约号源`,
            type: 'warning',
          })
        }
      })
      .catch(() => {
        this.formData.yyrq = null
      })
  }

  /**
   * @Description:  医技书列表
   * @author: zhml
   * @param {type}:
   * @return:
   * @date 2020/6/29
   */
  private loadNode(node: any, resolve: any) {
    if (node.level === 0 || node.data.children === null) return node.label
    else if (node.level > 0) {
      setTimeout(() => {
        queryData({ pid: node.data.id }).then((res: any) => {
          var datas = res.data.map((item: any) => {
            var param = {
              label: item.name,
              id: item.id,
              pid: item.pid,
              sort: item.sort,
              zxbz: item.zxbz,
              jclx: item.jclx,
              children: item.chileNum > 0 ? [] : null,
              leaf: item.chileNum > 0 ? false : true,
            }
            return param
          })
          resolve(datas)
        })
      }, 500)
    }
  }

  /**
   * @Description: 保存检查申请单
   * @author: zhml
   * @param {type}:
   * @return:
   * @date 2020/6/29
   */
  private handleSave() {
    if (!this.dataSub.ysJx02List || this.formData.jcxm == '') {
      this.$notify({
        title: '请先选择检查项目',
        message: '',
        type: 'warning',
      })
      return
    }

    ;(this.$refs.formData as Form).validate((valid: any) => {
      this.formData.yjlx = (this.$refs.tree as any).getCurrentNode().id
      if (this.outpOrInpa == 'outp') this.formData.sqlx = 1
      else this.formData.sqlx = 2
      this.formData.cisJcsq03 = deepCopy(this.specimenData)
      this.dataSub.ysJx01 = deepCopy(this.formData)
      console.log('111112222222222',this.blId)
      if(this.blId == 5) {
        this.$set(this.dataSub.ysJx01,'sfbljc',1)
      } else {
        this.$set(this.dataSub.ysJx01,'sfbljc',0)
      }
      this.dataSub.yjlx = this.formData.yjlx
      // this.dataSub.ysJx01.jzxh = this.patientFile.clinicId
      this.dataSub.clinicId = this.patientFile.jzxh
      console.log(this.dataSub, this.patientFile)
      if (valid) {
        // 判断住院还是门诊
        this.saveStatus = false // 保存等待时按钮置灰
        if (this.outpOrInpa == 'outp') {
          this.dataSub.jzlsh = this.$store.state.pnParam.PN_PARAM.jzlsh
          saveZlxmList(JSON.stringify(this.dataSub)).then((res: any) => {
            if (res.errorCode == 'SUCCESS') {
              this.jcxh = res.data.jcxh
              this.$notify({
                type: 'success',
                title: '保存成功',
                message: '',
              })
              this.saveStatus = true // 保存成功后点亮按钮
              this.reset()
            }
          })
        } else {
          this.dataSub.brks = this.patientFile.brks
          this.dataSub.brch = this.patientFile.brch
          this.dataSub.brbq = this.patientFile.brbq
          this.dataSub.brxm = this.patientFile.brxm
          this.dataSub.brxz = this.patientFile.brxz
          this.dataSub.zyh = this.patientFile.zyh
          this.dataSub.mzhm = this.patientFile.mzhm
          this.dataSub.op = 'create'
          if (!isEmpty(this.currReqObj) && !isEmpty(this.currReqObj.sqid)) this.dataSub.sqid = this.currReqObj.sqid
          saveZySqd(JSON.stringify(this.dataSub)).then((res) => {
            this.$notify({ type: 'success', title: '保存成功', message: '' })
            this.saveStatus = true  // 保存成功后点亮按钮
            console.log(1363,this.saveStatus)
            this.reset()
          })
        }
      }
    })
  }

  private getClass(node: any) {
    if (node.expanded) {
      return 'his-tree-Folder'
    } else {
      return 'his-tree-Folder_unfold'
    }
  }

  // 获取医院logo
  private queryPrintLogo() {
    queryLogo(this.userInfo.hospitalId).then((res: any) => {
      this.loGo = res.data
      if(this.blId == 5) {
        let a: any = document.getElementById("imgInit1")
        a.src = this.loGo
      } else {
        let b: any = document.getElementById("imgInit2")
        b.src = this.loGo
      }
    })
  }



  // 病理申请单打印
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
      // LODOP.SET_PRINT_PAGESIZE(1, '210mm', '297mm', 'A4') // 2-打印方向及纸张类型,

      // 测试只有表格
      // LODOP.ADD_PRINT_URL('0','0', '297mm', '210mm', tableDataUrl)
      // LODOP.PREVIEW() // 预览
      // return

      LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true) //宽度超出自动缩放
      var b: any = document.getElementById('jcsqd')
      var a: any = document.getElementById('bljcd')
      var op: any = ''
      a.style.zoom=0.85 // 缩放页面，配合LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true)使用
      if(this.blId == 5) {
        op = '<body>' + a.innerHTML + '</body>'
        LODOP.ADD_PRINT_HTM(0, '6mm', '180mm', '297mm', op) // 尾部
      } else {
        op = '<body>' + b.innerHTML + '</body>'
        LODOP.ADD_PRINT_HTM(0, '6mm', '210mm', '297mm', op) // 尾部
      }
      
      // LODOP.ADD_PRINT_LINE('26mm', '3mm', '26mm', '207mm', 0, 1)
      // LODOP.ADD_PRINT_TEXT('31mm', 0, '210mm', '8mm', '病理检查申请单') // 标题名
      // LODOP.SET_PRINT_STYLEA(0, 'FontName', '宋体')
      // LODOP.SET_PRINT_STYLEA(0, 'FontSize', 20)
      // LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      // LODOP.SET_PRINT_STYLEA(0, 'Horient', 2)
      // LODOP.SET_PRINT_STYLEA(0,"Stretch",0.5)
     
      // b.style.zoom=0.85
      
      // LODOP.SET_PRINT_MODE('POS_BASEON_PAPER', true) // 以纸张边缘为基点
      LODOP.PREVIEW() // 预览
      // LODOP.PRINT() // 打印
      // LODOP.PRINT_DESIGN() // 设计
    }
  }

  // 检查打印
  private printDj() {
    this.queryPrintLogo()
    if (!this.dataSub.ysJx02List || this.formData.jcxm == '') {
      this.$notify({
        title: '请先选择检查项目',
        message: '',
        type: 'warning',
      })
      return
    }
    const cc: any = this.$refs.statement
    ;(this.$refs.formData as Form).validate((valid: any) => {
      this.formData.yjlx = (this.$refs.tree as any).getCurrentNode().id
      if (this.outpOrInpa == 'outp') this.formData.sqlx = 1
      else this.formData.sqlx = 2
      this.formData.cisJcsq03 = deepCopy(this.specimenData)
      this.dataSub.ysJx01 = deepCopy(this.formData)
      this.dataSub.yjlx = this.formData.yjlx
      // this.dataSub.ysJx01.jzxh = this.patientFile.clinicId
      this.dataSub.clinicId = this.patientFile.jzxh
      if(this.blId == 5) {
        this.$set(this.dataSub.ysJx01,'sfbljc',1)
      } else {
        this.$set(this.dataSub.ysJx01,'sfbljc',0)
      }
      if (valid) {
        // 判断门诊还是住院
        if (this.outpOrInpa == 'outp') {
          this.saveStatus = false // 保存接口调用成功前置灰
          this.dataSub.jzlsh = this.$store.state.pnParam.PN_PARAM.jzlsh
          saveZlxmList(this.dataSub).then((res: AxiosResponse) => {
            this.jcxh = res.data.jcxh
            this.$notify({
              type: 'success',
              title: '保存成功',
              message: '',
            })
            this.saveStatus = true // 保存成功后点亮按钮
            this.reset()
            this.htmlSearchData = {
              jcxh: res.data.jcxh,
              sqlx: 1,
            }

            // 病理与非病理打印判别
            if(this.blId == 5) {
              queryBljcPrintData(this.jcxh).then((el: any) => {
                if(el.errorCode == "SUCCESS") {
                  this.blPrintData = el.data  
                  console.log('1208',this.blPrintData)
                  // 检查项目分左右组
                  let jcxmArr0: Array<any> = this.blPrintData.jcxmList
                  if(jcxmArr0.length > 6) {
                    for(let i = 0; i< 6;i++) {
                      this.jcxmArrl.push(jcxmArr0[i])
                    }
                    for(let j = 6; j<jcxmArr0.length;j++) {
                      this.jcxmArr2.push(jcxmArr0[j])
                    }
                  } else {
                    this.jcxmArrl = jcxmArr0
                  }
                  // 病理打印
                  this.$nextTick(()=> {
                    this.printFn()
                  })
                }
              }) 
            } else {
              // 非病理打印
              queryJcsqPrintData(this.jcxh).then((ele: any)=> {
                if(ele.errorCode == "SUCCESS") {
                  console.log('1487',ele)
                  this.jcPrintData = ele.data
                  this.$nextTick(()=> {
                    this.printFn()
                  })
                }
              })
            }
          })
        }
      }
    })
  }

  private getPrintUrl(value: boolean) {
    if (value) {
      const cc: any = this.$refs.statement
      cc.printTable()
    }
  }

  // 新增标本
  private addSpecimen() {
    this.specimenData.push({})
    this.$nextTick(() => {
      ;(this.$refs[`${this.rowIndex}-` + 1] as any).focus()
      this.rowIndex += 1
    })
  }

  // 病理申请删除
  private handleDelete(scope: any) {
    this.specimenData.splice(scope.$index, 1)
    this.rowIndex -= 1
  }

  // 申请医师
  private getDataUser(data: any, key: string) {
    this.formData[key] = data.personId
  }
  
  private remoteMethodUser(query: string, ref: string) {
    if (query.length > 1) {
      this.$nextTick(() => {
        ;(this.$refs[ref] as any).remoteMethod(query)
      })
    } else {
      ;(this.$refs[ref] as any).closePopover()
    }
  }
  private selectBlurUser(ref: string) {
    ;(this.$refs[ref] as any).selectBlur()
  }

  // 光标汇聚下一个
  private nextFocus(scope: number, num: number) {
    console.log('123')
    if (num == 2) {
      ;(this.$refs[`${scope}-${num}`] as any).focus()
    } else if (num == 3) {
      ;(this.$refs[`${scope}-${num}`] as any).focus()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/inputTable.scss';
.module {
  width: 100%;
  overflow: hidden;
  .layout-top {
    padding-top: 8px;

    .el-divider--vertical {
      margin: 0 10px;
    }
  }
}

::v-deep .searchTitle {
  font-family: siyuanMedium;
  margin-top: 2px;
  padding-right: 0 !important;
}

.btn {
  background: none !important;
}

.btn .el-button {
  padding: 4px 0;

  span .green {
    color: #0fcaad;
  }
}

::v-deep .el-form {
  margin: 0 !important;
}

.row3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

.row2-2-1 {
  display: grid;
  grid-template-columns: 3fr 4fr 3fr;
  grid-gap: 10px;
}

.row2 {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 10px;
}

.row4 {
  .row4-1 {
    margin: 10px 0;
    font-size: 13px;
  }
  .row4-2 {
    width: 100%;
    .el-form-item {
      float: left;
      padding-right: 8px;
    }
    .el-form-item:last-child {
      padding-right: 0;
    }
    .line-item1 {
      width: calc((100%) * 0.5);
    }
    .line-item2 {
      width: calc((100%) * 0.5);
    }
    .line-item3 {
      width: calc((100%) * 0.5);
    }
    .line-item4 {
      width: calc((100%) * 0.5);
    }
  }
  .row4-3 {
    width: 100%;
    .el-form-item {
      float: left;
      padding-right: 8px;
    }
    .el-form-item:last-child {
      padding-right: 0;
    }
    .line-item5 {
      width: calc((100%) * 0.33);
    }
    .line-item6 {
      width: calc((100%) * 0.33);
    }
    .line-item7 {
      width: calc((100%) * 0.33);
    }
  }

  .row4-4 {
    width: 100%;
    .el-form-item {
      float: left;
      padding-right: 8px;
    }
    .el-form-item:last-child {
      padding-right: 0;
    }
    .line-item8 {
      width: calc((100%) * 0.45);
    }
    .line-item9 {
      width: calc((100%) * 0.4);
    }
  }
}

.rowX {
  display: grid;
  grid-template-columns: 5fr 3fr;
  grid-gap: 10px;
}
.rowA {
  display: grid;
  grid-template-columns: 5fr 1fr;
  grid-gap: 10px;
}
.title h1 {
  height: 30px;
  line-height: 30px;
}

.tab-row .btn {
  padding-bottom: 0px;
  border: none;
}

.search_style {
  width: 100% !important;
  margin-right: 0 !important;
}

.content .his-module ::v-deep .el-table--border th {
  height: 28px !important;
  line-height: 0px;
}

.content .his-small ::v-deep .el-form .el-form-item .el-form-item__label {
  line-height: 15px;
}

.el-col-12 {
  width: 55%;
}

.el-col-7 {
  width: 25.833333%;
}

.el-col-5 {
  width: 18.833333%;
}

::v-deep .el-dialog .el-dialog__header {
  padding: 0 16px;
  border-bottom: none;
}

::v-deep .el-dialog .el-dialog__body {
  padding: 0 0 10px 0;
}

::v-deep .el-dialog__body {
  padding: 0;
}

::v-deep .custom-tree-node {
  display: flex;
  .tree-label {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 120px;
    height: 14px;
    :hover {
      text-overflow: inherit;
      white-space: normal;
    }
  }
}

::v-deep .el-table__body-wrapper {
  height: 100%;
}

.content .his-module .el-form .el-form-item ::v-deep.el-date-editor .el-input__icon {
  display: inline;
}

.input-table::v-deep .el-input .el-input__inner {
  height: 26px;
}
::v-deep .el-tree {
  overflow: initial !important;
}
</style>
