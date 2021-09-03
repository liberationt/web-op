<template>
  <div class="ht his-patient-auxiliary">
    <el-row class="ht">
      <el-col :span="leftCol" class="pr10 ht">
        <div class="his-module his-small ht">
          <div class="row" style="margin-bottom: 0">
            <div class="label">
              <div class="btn">
                <el-checkbox v-model="checked">自动新组</el-checkbox>
                <el-divider direction="vertical"></el-divider>
                <!--插入-->
                <el-button size="mini" type="text" v-preventReClick @click="handleInsert" :disabled="isHistory">
                  <i class="icon his-inserting"></i>
                  <span>插入</span>
                </el-button>
                <!--新组-->
                <el-button size="mini" type="text" v-preventReClick @click="handleNewGroup" :disabled="isHistory">
                  <i class="icon his-group"></i>
                  <span>新组</span>
                </el-button>
                <!--删除-->
                <el-button size="mini" type="text" v-preventReClick @click="handleDelete" :disabled="isHistory">
                  <i class="icon his-btn-del red"></i>
                  <span>删除</span>
                </el-button>
                <!-- 删除组 -->
                <el-button size="mini" type="text" v-preventReClick @click="handleDeleteGroup" :disabled="isHistory">
                  <i class="icon his-del-group red"></i>
                  <span>删除组</span>
                </el-button>
                <!--保存-->
                <el-button size="mini" type="text" v-preventReClick @click="handleSave" :disabled="isHistory" :loading="saveFlag">
                  <i class="icon his-btn-save green"></i>
                  <span>保存</span>
                </el-button>
                <!-- 打印 -->
                <el-button size="mini" type="text" v-preventReClick @click="printDj('all','1')" :disabled="flag_save && this.tableData.length == 0">
                  <i class="icon his-btn-print"></i>
                  <span>打印全部</span>
                </el-button>
                <!-- 同一组处置打印 -->
                <el-button size="mini" type="text" v-preventReClick @click="printDj('group','2')" :disabled="flag_save && this.tableData.length == 0">
                  <i class="icon his-btn-print"></i>
                  <span>打印同组</span>
                </el-button>
                <!--打印选中数据-->
                <el-button size="mini" type="text" v-preventReClick @click="printDj('selected','3')" :disabled="flag_save && this.tableData.length == 0">
                  <i class="icon his-btn-print"></i>
                  <span>打印选中</span>
                </el-button>
              </div>
            </div>
          </div>
          <el-table 
            :data="tableData" 
            border 
            stripe 
            :highlight-current-row="true" 
            :height="listSlotHeight - 200"
            class="scroll-bar input-table" 
            :row-class-name="tableRowClassName" 
            @row-click="handleGetIndex" 
            @cell-mouse-enter="checkDetail"
            @selection-change="handleSelectPrint"
            >
            <el-table-column width="16" class-name="color-group">
              <template slot-scope="scope">
                <div class="w100" :class="scope.row.pxh % 2 === 1 ? 'greenBack' : 'orangeBack'"></div>
              </template>
            </el-table-column>
            <el-table-column width="32" type="selection">
              <!-- <template slot-scope="scope">
                <el-checkbox v-model="scope.row.yjjk"></el-checkbox>
              </template> -->
            </el-table-column>
            <el-table-column type="index" width="32"></el-table-column>
            <el-table-column label="状态" prop="zfpb" min-width="60">
              <template slot-scope="scope">
                <span class="status" :class="scope.row.zfpb == 1 ? 'waste-fphm' : scope.row.fphm > 0 ? 'charge' : 'no-charge'">
                  {{ scope.row.zfpb == 1 ? '已作废' : scope.row.fphm > 0 ? '已收费' : '未收费' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="项目名称" min-width="160" label-class-name="first-red" prop="fymc">
              <template slot-scope="scope">
                <el-tooltip effect="light" :open-delay="0" placement="right-start" :disabled="scope.row.ztbz != 1">
                  <div slot="content" class="content check" style="height: 190px; background: white; padding: 0">
                    <div class="his-module his-small" style="padding: 0 0 1px">
                      <el-table :data="checkData" border stripe :highlight-current-row="true" :height="180" class="scroll-bar" tooltip-effect="light">
                        <el-table-column label="项目名称" min-width="130" prop="xmmc" show-overflow-tooltip></el-table-column>
                        <el-table-column label="单位" width="50" prop="fydw"></el-table-column>
                        <el-table-column class-name="text-blue-td" label="单价" width="50" prop="yldj"></el-table-column>
                        <el-table-column class-name="text-blue-td" label="数量" width="50" prop="ylsl"></el-table-column>
                        <el-table-column class-name="text-blue-td" label="划价金额" width="70" prop="hjje"></el-table-column>
                        <el-table-column class-name="text-blue-td" label="自负比例" width="70" prop="zfbl">
                          <template slot-scope="scope">
                            <span v-if="scope.row.zfbl != null">{{ useMul(scope.row.zfbl, 100) + '%' }}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                  <div>
                    <remoteSearchBox
                      v-model="scope.row.fymc"
                      name="mzys_fj"
                      :ref="`${scope.$index}-1`"
                      style="height: 32px"
                      :resultTableHeader="resultTableHeader"
                      :searchData="searchSelectData"
                      :searchField="{
                        yp: 'query',
                        zt: 'query',
                      }"
                      :showLabel="{
                        yp: 'fymc',
                        zt: 'ztmc',
                      }"
                      :popoverWidth="480"
                      :disabled="scope.row.fphm > 0 || (!scope.row.djly ? false : scope.row.djly !=11 ? true : false) || scope.row.ztbz == 1"
                      @getData="setData"
                    />
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="单位" prop="fydw" min-width="52"></el-table-column>
            <el-table-column label="医疗单价" class-name="text-blue-td" prop="yldj" min-width="86"></el-table-column>
            <el-table-column label="医疗数量" class-name="text-blue-td" prop="ylsl" width="70">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.ylsl"
                  :ref="`${scope.$index}-2`"
                  style="height: 32px"
                  :disabled="scope.row.fphm > 0 || (!scope.row.djly ? false : scope.row.djly !=11 ? true : false) || scope.row.ztbz == 1"
                  @input="countYpsl"
                  @keyup.enter.native="nextFocus(scope.$index, 2)"
                  oninput="value=value.replace(/[^\d]/g,'')"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="划价金额" prop="hjje" class-name="text-blue-td" label-class-name="first-red" min-width="85" show-overflow-tooltip></el-table-column>
            <el-table-column label="开单科室" prop="ksdm" min-width="98">
              <template slot-scope="scope">
                <span>{{ getName(scope.row.ksdm) }}</span>
                <!--                <span>{{ deptList.find((item:any)=>item.dv == scope.row.ksdm).dn }}</span>-->
                <!--                <span>{{ scope.row.ksdm }}</span>-->
              </template>
            </el-table-column>
            <el-table-column label="执行科室" min-width="110">
              <template slot-scope="scope">
                <select-box 
                  v-model="scope.row.zxks" 
                  :ref="`${scope.$index}-3`" 
                  style="height: 32px" 
                  :options="ksdmList" 
                  :disabled="scope.row.fphm > 0 || scope.row.ztbz == 1 || (!scope.row.djly ? false : scope.row.djly !=11 ? true : false)" 
                  option_label_filed="officename" 
                  option_value_filed="id" 
                  @change="getZxsk" 
                  @keyup.enter.native="nextFocus(scope.$index, 3)"
                >
                </select-box>
              </template>
            </el-table-column>
            <el-table-column label="自负比例" prop="zfbl" class-name="text-blue-td" width="70">
              <template slot-scope="scope">
                <!-- scope.row.ztbz == 0 组套不显示自负比例 -->
                <span v-if="((scope.row.zfbl != null) && scope.row.ztbz == 0)">{{ useMul(scope.row.zfbl, 100) + '%' }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="price-bar">
            <p>
              合计：
              <em>&yen; {{ summary }}</em>
            </p>
            <el-divider direction="vertical"></el-divider>
            <p>
              自负：
              <em>&yen; {{ summaryPay }}</em>
            </p>
          </div>
        </div>
      </el-col>
      <el-col class="ht" :span="24 - leftCol">
        <div class="his-module his-small ht">
          <div class="content-right ht">
            <span @click="openRight" v-if="showRight" class="action">
              <i class="icon his-card-put gray"></i>
            </span>
            <div v-if="!showRight">
              <span @click="closeRight" v-show="!showRight" class="open action">
                <i class="icon his-card-open gray"></i>
              </span>
              <div slot="header" class="tab-row">
                <el-tabs v-model="btnValue" @tab-click="getList" class="tab-small ht underline">
                  <el-tab-pane label="常用项" name="0">
                    <div class="ht">
                      <cyx-list ref="cyx" @cyxSet="cyxSet" :searchData="searchDataR"></cyx-list>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="组套" name="1">
                    <div class="zt">
                      <fjzt-list ref="zt" :searchData="searchDataZt" @setDataList="setDataList"></fjzt-list>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="全部" name="2">
                    <div class="header-row">
                      <div class="label">搜索</div>
                      <div class="row-input">
                        <el-input v-model="searchDataAll.pydm" :placeholder="$t('common.placeholder')" @keydown.native.enter="getList" clearable>
                          <i slot="prefix" class="el-input__icon icon his-search"></i>
                        </el-input>
                      </div>
                    </div>
                    <div class="ht">
                      <medicalList ref="all" :searchData="searchDataAll" @setAllData="setAllData" />
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 处置治疗单打印 -->
    <div id="czzld" style="width: 148mm; font-size: 14px;" v-show="false">
      <div style="width: 100%;position: relative;height: 50px;padding-top: 20px"> 
        <img id="imgInit" src="" style="width: 200px; height: 30px; padding-left: 13px" />
        <span style="padding: 0 2px;text-align: center; height: 23px;line-height: 23px;position: absolute;top: 20px; right:28px;border: 1px solid #000">{{"普"}}</span>
      </div>
      <div style="font-size: 24px;font-weight: 700; text-align: center;margin: 5px 0 20px">{{"治疗单"}}</div>
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
        <p style="margin: 0">临床诊断：</p><p style="border-bottom: 1px solid #000; width: 170px;margin:0 20px 0 0;text-align: center">{{printData.lczd}}{{searchData.cfid == 3 ? printData.zh : ''}}</p>
        <p style="margin: 0">开具日期：</p><p style="border-bottom: 1px solid #000; width: 173px;margin: 0;text-align: center">{{printData.kjrq_n}}-{{printData.kyrq_y}}-{{printData.kjrq_r}}</p>
      </div>
      <div style="display: flex;font-size: 14px;justify-content: center;margin-bottom: 10px;height: 20px;line-height: 20px">
        <p style="margin: 0">皮试结果：</p><p style="border-bottom: 1px solid #000; width: 433px;margin: 0;text-align: center">{{printData.psjg}}</p>
      </div>
      <!-- 处置项目排列 -->
      <div style="height: 370px;font-size: 13px;width: 85%;margin-left:25px">
        <p style="font-size: 16px;">Rp:</p>
        <div v-for="(item,index) in printCzArr" :key="index">
          <div style="display: flex;justify-content: space-between;height: 20px;line-height: 20px;">
            <div style="display: flex;justify-content: flex-start">
              <p style="margin: 0 10px 0 0">{{item.yjzh}}</p>
              <p style="margin: 0 10px 0 0">{{item.xmmc}}</p>
              <!-- <p style="margin: 0">{{item.ypmc}}</p> -->
            </div> 
            <div style="display: flex;justify-content: flex-start">
              <p style="margin: 0">共：</p><p style="margin: 0 10px 0 0">{{item.ylsl}}</p> <p style="margin: 0">{{item.xmdw}}</p>
            </div>
          </div>
          <!-- <div style="display: flex;justify-content: flex-end; height: 20px;line-height: 20px;">
            <p style="margin: 0">用法：</p> <p style="margin: 0 0 0 10px">{{item.ycjl}}</p> <p style="margin: 0 5px 0 0">{{item.jldw}}</p> <p style="margin: 0">{{item.yypc}}</p> <p style="margin: 0 0 0 10px">{{item.gytj}}</p>
          </div>
          <div style="display: flex;justify-content: flex-end; height: 20px;line-height: 20px;" v-show="item.bzxx">
            <p style="margin: 0">{{item.bzxx}}</p>
          </div> -->
        </div>
        <div style="width: 100%;">
          <div  style="text-align: center;">----------------以下空白,手写无效--------------</div>
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

    <el-dialog :visible.sync="isVisiable" width="70%" :append-to-body="true" class="narrow-dialog" @closed="closed">
      <div slot="title">
        <div>{{ $t('publicInfo.drugAttributes') }}</div>
      </div>
      <div class="content his-dialog">
        <div class="his-module his-small his-mini">
          <el-table ref="tableList" @selection-change="handleSelectionChange" :data="tableformats" border :fit="true" stripe tooltip-effect="light" :highlight-current-row="true" slot="list" class="scroll-bar">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" width="32"></el-table-column>
            <el-table-column prop="ypzh" width="32" class="table-ypzh">
              <template slot-scope="scope">
                <div class="w100" :class="scope.row.ypzh % 2 == 1 ? 'greenBack' : 'orangeBack'"></div>
              </template>
            </el-table-column>
            <el-table-column prop="xmmc" label="药品名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="xmsl" label="数量" width="60"></el-table-column>
            <el-table-column prop="ycjl" label="剂量" width="60"></el-table-column>
            <el-table-column prop="jldw" width="32"></el-table-column>
            <el-table-column prop="yyts" label="天数" width="60"></el-table-column>
            <el-table-column prop="gytjName" label="途径" width="60"></el-table-column>
            <el-table-column prop="ypyf" label="频次" width="60"></el-table-column>
            <el-table-column prop="hjje" label="单价" width="60"></el-table-column>
            <el-table-column prop="sbjg" label="商保价格" width="80"></el-table-column>
            <el-table-column prop="ypsl" label="总量" width="60"></el-table-column>
            <el-table-column prop="jz" label="脚注" width="60"></el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer foot">
        <el-button @click="isVisiable = false">{{ $t('common.close') }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
    <div class="statement-box" v-show="false">
      <statement
        ref="statement"
        :html-api="'/op-service/opyjcf01/yjPrint'"
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
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import medicalList from './model/medicalList.vue'
import suiteList from '@/views/cis/op/dctwork/examineSuiteSet/components/suiteList.vue'
import { ISaveList, saveCZ, queryListCZ, removeAuxiliary, loadPersonalSet, saveDisposalSet, insertDisposalSet, saveBeforeCheck, depTList, queryLogo, queryPrintData, queryDisposalTotalFee } from '@/api/cis/op/dctwork/auxiliary'
import { getPayProp, getPubParams, querySjBrxz } from '@/api/cis/op/dctwork/recipe'
import cyxList from '@/views/cis/op/dctwork/patients/components/model/cyxList.vue'
import fjztList from '@/views/cis/op/dctwork/patients/components/model/fjztList.vue'
import { queryPage } from '@/api/cis/op/dctwork/examineSuite'
import { getFloat, id2Name, mul } from '@/utils'
import { AxiosResponse } from 'axios'
import { queryDetailXm, queryZtDetail } from '@/api/cis/op/dctwork/examineSuite'
import { getLodop } from '@/plugins/lodop/index.js'
export const NSaveObj: ISaveList = {
  index: 0,
  bzxx: '', //  备注信息
  djzt: null, //
  dzbl: 1, // 打折比例
  fphm: '', //  发票号码
  fydw: '', //  费用单位
  fygb: null, //
  fymc: '', //  项目名称
  hjje: 0, //  划价金额
  jgid: null, //
  jlsl: null, //  记录数量
  jlxh: null, //
  ksdm: Vue.prototype.AUTHORITY.outpatientCode, //
  mzxh: null, //
  opStatus: '', //  操作类型
  pageNum: null, //
  pageSize: null, //
  sbxh: null, //
  spbh: null, //
  sqdh: null, //
  sqwh: null, //  申请文号
  xflsh: '', // xflsh
  xmlx: 0, //
  yjjk: false, //
  yjxh: null, //
  yjzh: null, //
  yjzx: 0, //
  bzjg: null, //  医疗单价
  ylsl: 1, // 医疗数量
  ylxh: null, //
  ypzh: 1, //
  yxms: null, //
  zfbl: null, //  自负比例
  zfbz: null, //
  zfpb: null, // 作废判别
  zhje: null, //  折后金额
  zkbl: null, //  折扣比例
  zkje: null, //  折扣金额
  ztbh: null, //
  ztbz: 0, // 组套标志) 0非组套标志，1组套标志
  ztyzsbxh: null, // (MS_YJ02_ZT表SBXH)
  zxks: null, //
  zxpb: null, //
  zxrq: '', // 执行时间
  pxh: 0, // 排序号
}

@Component({
  name: 'auxiliary',
  filters: {},
  components: { suiteList, medicalList, cyxList, fjztList },
})
export default class extends Vue {
  @Prop({ required: true }) private isHistory!: boolean // 历史修改标志
  // @Prop({ required: true }) private pnParam!: any
  private pnParam: any = {}
  private checked: boolean = true
  private listSlotHeight: number = 0
  private tableData: Array<any> = []
  private showRight: boolean = true
  private leftCol: number = 23
  private tabBlocks: any[] = []
  private htmlSearchData: any = {}
  private multipleSelection: Array<any> = []
  private tableList: any[] = []
  private isVisiable: boolean = false
  private tjList: Array<any> = []
  private YJZH: number = 0
  private JGID: number = 0
  private SBXH: number = 0
  private flag_save: boolean = true
  private checkData: Array<any> = [] // 组套数据详情
  private printData: any = {} // 处置项目数据
  private printCzArr: Array<any> = [] // 处置项目数据
  private selectData: Array<any> = [] // 选中项数据
  private searchData: any = {
    brxz: '',
    mzks: '',
    pageNum: 1,
    pageSize: 20,
    query: '',
    useType: 'MZSY',
    ztlb: 0,
  }

  private searchSelectData: any = {
    yp: {
      brxz: this.pnParam.brxz,
      mzks: '',
      pageNum: 1,
      pageSize: 20,
      query: '',
      useType: 'MZSY',
    },
    zt: {
      drugType: this.searchData.cflx,
    },
  }

  private resultTableHeader: any = {
    yp: [
      {
        prop: 'fymc',
        label: '项目名称',
        width: 250,
      },
      {
        prop: 'fydw',
        label: '次',
        width: 100,
      },
      {
        prop: 'fydj',
        label: '价格',
        width: 100,
      },
    ],
    zt: [
      {
        prop: 'ztmc',
        label: '组套名称',
      },
      {
        prop: 'xmlx',
        label: '项目类型',
      },
    ],
  }
  private searchDataR: any = {
    pydm: '',
    ztbh: '',
  }
  private searchDataZt: any = {
    sslb: 1,
    ztlb: 4,
    ksdm: Vue.prototype.AUTHORITY.outpatientCode,
  }
  private searchDataAll: any = {
    pageNum: 1,
    pageSize: 20,
    pydm: '',
  }
  private rowIndex: number = -1
  private ksdmList: Array<any> = [] // 执行科室
  private btnValue: string = '0'
  private deptList: Array<any> = []
  private summary: number = 0
  private summaryPay: number = 0
  private ZSDYJSFSY: Array<any> = []
  private YBXZ: string = ''
  private isSYD: boolean = false
  private zlksList: Array<any> = [] // 执行科室（来源康复治疗）
  private saveFlag: boolean = false // 保存防重复
  private HJJE: number = 0
  private ZFJE: number = 0

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
    this.tabBlocks = [
      {
        name: '0',
        title: '常用项',
      },
      {
        name: '1',
        title: '组套',
      },
      {
        name: '2',
        title: '全部',
      },
    ]
  }
  mounted() {
    this.zxksList() // 获取执行科室列表
    this.zlksList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.CRUE_DICT : this.$store.state.webSqlDict.CRUE_DICT
    this.pnParam = this.$store.state.pnParam.PN_PARAM
    
  }

  activated() {
    this.pnParam = this.$store.state.pnParam.PN_PARAM
    console.log(this.pnParam)
    this.searchSelectData.yp.brxz = this.pnParam.brxz
    this.initCZList()
    getPubParams({ commons: ['ZSDYJSFSY', 'YBXZ'] }).then((res: AxiosResponse) => {
      this.ZSDYJSFSY = res.data.ZSDYJSFSY
      this.YBXZ = res.data.YBXZ
    })
    this.tjList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_METHOD_DICT : this.$store.state.webSqlDict.DRUG_METHOD_DICT
    this.deptList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.OUTPATIENT_DEPARTMENT : this.$store.state.webSqlDict.OUTPATIENT_DEPARTMENT
    // this.ksdmList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.MZ_ZXKS_DICT : this.$store.state.webSqlDict.MZ_ZXKS_DICT
    this.searchData.brxz = this.pnParam.brxz
    this.searchData.mzks = Vue.prototype.AUTHORITY.outpatientCode
    queryPage({ sslb: 4, ztlb: 4 }).then((res: AxiosResponse) => {
      if (res.data.list && res.data.list[0] && !res.data.list[0].ztbh) {
        this.$notify({
          type: 'warning',
          title: '没有个人常用项',
          message: '',
        })
        return
      } else {
        if (res.data.list && res.data.list[0] && res.data.list[0].ztbh) {
          this.searchDataR.ztbh = res.data.list[0].ztbh
        }
      }
    })
  }

  get tableFormat() {
    const tabledata = this.tableData
    id2Name(tabledata, 'ksdm', 'ksdmName', this.deptList, 'dv', 'dn')
    return tabledata
  }

  get tableformats() {
    const tablelist = this.tableList
    id2Name(tablelist, 'gytj', 'gytjName', this.tjList, 'dv', 'dn')
    return tablelist
  }

  // 获取localStorage本地信息
  get userInfo() {
    return JSON.parse(localStorage.userInfo)
  }

  private handleSelectionChange(val: any) {
    this.multipleSelection = val
  }

  private closed() {
    this.isVisiable = false
  }

  private handleConfirm() {
    this.tableData.splice(this.rowIndex, 1)
    this.setDataList(this.multipleSelection)
    this.isVisiable = false
  }

  private getZxsk(val: any) {
    console.log('val', val)
    let cc = this.tableData.filter((item: any) => {
      if (item.yjzh == this.tableData[this.rowIndex].yjzh) {
        return item
      }
    })

    if (cc.length > 1) {
      cc.forEach((item: any) => {
        item.zxks = val
      })
    }
  }

  private getName(val: any) {
    let cc = this.deptList.find((item: any) => item.dv == val)
    if (cc == false) return val
    if (cc) return cc.dn
  }

  // 获取表格数据
  private initCZList() {
    let obj = {
      brid: this.pnParam.brid,
      jzxh: this.pnParam.clinicId,
      fjlb: 2,
    }
    queryListCZ(obj).then((res) => {
      res.data.forEach((item: any) => {
        item.yldj = getFloat(item.yldj, 4)
        item.hjje = getFloat(item.hjje, 4)
        item.zfbl = getFloat(item.zfbl, 4)
      })
      this.tableData = res.data
      this.getSummary()
    })
  }

  private isClick(value: Array<any>) {
    if (value.length == 0) {
      return true
    } else return !(value[value.length - 1].fymc == '' || value[value.length - 1].fymc === null || value[value.length - 1].fymc === undefined)
  }

  private getList() {
    switch (this.btnValue) {
      case '0':
        let a: any = this.$refs.cyx
        this.$nextTick(() => {
          a.getList()
        })
        return
      case '1':
        let b: any = this.$refs.zt
        this.$nextTick(() => {
          b.getList()
        })
        return
      case '2':
        let c: any = this.$refs.all
        this.$nextTick(() => {
          c.getList()
        })
        return
    }
  }

  // 插入
  private handleInsert() {
    if (this.isClick(this.tableData)) {
      const object = { ...NSaveObj }
      if (this.tableData.length == 0) {
        this.rowIndex = -1
        // if (this.tableData[this.rowIndex] && this.tableData[this.rowIndex].fphm && this.tableData[this.rowIndex].fphm > 0) {
        //   this.$message.info('当前处置项目已收费，不能插入同组项目')
        //   return
        // } else 
        // if (this.tableData.length == 0) {
        object.yjzh = 1
        object.pxh = 1
        object.mzxh = this.pnParam.jzxh
        this.tableData.splice(this.rowIndex, 0, object)
        // }
        //  else {
        //   object.yjzh = this.tableData[this.rowIndex - 1].yjzh
        //   // object.pxh = this.tableData[this.rowIndex - 1].pxh
        //   object.mzxh = this.pnParam.jzxh
        //   this.tableData.splice(this.rowIndex + 1, 0, object)
        // }
        this.$nextTick(() => {
          ;(this.$refs[`${this.rowIndex + 1}-` + 1] as any).focus()
          // ;(this.$refs['0-1'] as any).focus()
          this.rowIndex +=  1
        })
      } else {
        // 获取当前序号
        if(this.rowIndex == -1) {
          this.$message.warning('请点击插入项目的位置！')
          return
        } else {
          if(this.tableData[this.rowIndex].djly != 11 && (this.tableData[this.rowIndex].sbxh || this.tableData[this.rowIndex].ztyzsbxh)) {
            this.$message.warning('当前组内不允许插入项目！')
            return
          }
        }
        if (this.tableData[this.rowIndex] && this.tableData[this.rowIndex].fphm && this.tableData[this.rowIndex].fphm > 0) {
          this.$message.info('当前处置项目已收费，不能插入同组项目')
          return
        } 
        // else if (this.tableData.length == 0) {
        //   object.yjzh = 1
        //   object.pxh = 1
        //   object.mzxh = this.pnParam.jzxh
        //   this.tableData.splice(this.rowIndex, 0, object)
        // } 
        object.yjzh = this.tableData[this.rowIndex].yjzh
        object.pxh = this.tableData[this.rowIndex].pxh
        object.mzxh = this.pnParam.jzxh
        object.zxks = this.tableData[this.rowIndex].zxks
        this.tableData.splice(this.rowIndex + 1, 0, object)
        this.$nextTick(() => {
          ;(this.$refs[`${this.rowIndex + 1}-` + 1] as any).focus()
          this.rowIndex += 1
        })
      }
    } else {
      return null
    }
  }

  // 新组
  private handleNewGroup() {
    if (this.isClick(this.tableData)) {
      const object = { ...NSaveObj }
      // object.webSortNumber = this.tableData.length + 1
      if (this.tableData.length == 0) {
        object.yjzh = 1
        object.pxh = 1
      } else {
        object.yjzh = this.tableData[this.tableData.length - 1].yjzh + 1
        object.pxh = this.tableData[this.tableData.length - 1].pxh + 1
      }
      object.mzxh = this.pnParam.jzxh
      this.tableData.push(object)
      this.$nextTick(() => {
        ;(this.$refs[`${this.tableData.length - 1}-` + 1] as any).focus()
        this.rowIndex = this.tableData.length - 1
      })
      this.rowIndex = this.rowIndex + 1
    } else {
      return null
    }
  }

  /**
   * @Description: 删除
   * @author: zhml
   * @return:
   * @date 2020/7/23
   */
  private handleDelete() {
    if (this.rowIndex == -1) {
      this.$notify({
        type: 'warning',
        title: '请选择数据',
        message: '',
      })
      return
    } else if (!this.tableData[this.rowIndex].sbxh && !this.tableData[this.rowIndex].ztyzsbxh) {
      this.tableData.splice(this.rowIndex, 1)
      this.reloadYpzho(this.tableData)
      this.getSummary()
      this.rowIndex -= 1
    } else if (this.tableData[this.rowIndex].fphm && this.tableData[this.rowIndex].fphm > 0 && this.tableData[this.rowIndex].zfpb == 0) {
      this.$message.warning('已收费的项目不能删除')
      return
    } else if (this.tableData[this.rowIndex].fphm && this.tableData[this.rowIndex].fphm > 0 && this.tableData[this.rowIndex].zfpb == 1) {
      this.$message.warning('已作废的项目不能删除')
      return
    } else {
      const obj = {
        sbxh: this.tableData[this.rowIndex].sbxh,
        type: 2,
        ztsbxh: this.tableData[this.rowIndex].ztyzsbxh,
        ztbz: this.tableData[this.rowIndex].ztbz,
        yjzh: this.tableData[this.rowIndex].yjzh,
      }

      this.$confirm('确定要删除项目【' + this.tableData[this.rowIndex].fymc + '】吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
      }).then(() => {
          removeAuxiliary(obj).then((res: AxiosResponse) => {
            this.tableData.splice(this.rowIndex, 1)
            this.$notify.success('删除成功！')
            // this.rowIndex -= 1
            this.initCZList()
            // if (this.rowIndex) {
            //   // this.reloadYpzh(this.rowIndex, this.tableData)
            //   // this.handleSave()
              
            // }
          })
        })
        .catch(() => {})
    }
  }

  // 重排组号
  private reloadYpzho(list: Array<any>) {
    // 当第一行组号不为1时的状态
    // if (list != null && list.length > 0 && list[0].yjzh > 1) {
    //   let num = list[0].yjzh - 1
    //   list.forEach((item: any) => {
    //     item.yjzh = item.yjzh - num
    //   })
    // }

    // // 当第n行组号顺序出现错误时
    // let i = 1
    // for (let j = 0; j < list.length; j++) {
    //   let item = list[j]
    //   if (item.yjzh == i) {
    //   } else if (item.yjzh != i && item.yjzh - 1 == i) {
    //     i = i + 1
    //   } else {
    //     for (let k = j; k < list.length; k++) {
    //       list[k].yjzh = list[k].yjzh - 1
    //     }
    //     this.reloadYpzho(list)
    //     return
    //   }
    // }

    let xh = 1
    let yjzh = list[0].pxh
    list.forEach((item: any)=> {
      if(item.pxh!= yjzh) {
        yjzh = item.pxh
        xh++
      }
      item.pxh = xh
    })
  }

  /**
   * @Description: 删除组数据
   * @author: zhml
   * @return:
   * @date 2020/7/23
   */
  private handleDeleteGroup() {
    console.log('this.tableData', this.tableData)

    if (this.rowIndex == -1) {
      this.$notify({
        type: 'warning',
        title: '请选择数据',
        message: '',
      })
      return
    } else if (this.tableData[this.rowIndex].fphm && this.tableData[this.rowIndex].fphm > 0 && this.tableData[this.rowIndex].zfpb == 0) {
      this.$message.warning('已收费的项目不能删除')
      return
    } else if (this.tableData[this.rowIndex].fphm && this.tableData[this.rowIndex].fphm > 0 && this.tableData[this.rowIndex].zfpb == 1) {
      this.$message.warning('已作废的项目不能删除')
      return
    } else {
      const obj = {
        sbxh: this.tableData[this.rowIndex].sbxh,
        type: 1,
        ztsbxh: this.tableData[this.rowIndex].ztyzsbxh,
        ztbz: this.tableData[this.rowIndex].ztbz,
        yjzh: this.tableData[this.rowIndex].yjzh,
      }

      this.$confirm('确定要删除项目【' + this.tableData[this.rowIndex].fymc + '】这一组吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
      }).then(() => {
        // 存在识别序号 （通过识别序号判断项目是否保存）
        if(this.tableData[this.rowIndex].sbxh) {
          removeAuxiliary(obj).then((res: any) => {
            this.$notify.success('已删除！')
            this.reloadYpzh(this.rowIndex,this.tableData)
            this.rowIndex -= 1
            this.initCZList()
          })
        } else {
          // 不存在识别序号，删除组必须找同组有sbxh的项目
          // groupData里存放的是同组的数据
          let groupData = this.tableData.filter((item: any) => {
            return item.yjzh == this.tableData[this.rowIndex].yjzh
          })
          if(groupData[0].sbxh || groupData[0].ztyzsbxh) {
            obj.sbxh = groupData[0].sbxh
            removeAuxiliary(obj).then((ele: any) => {
              this.$notify.success('已删除！')
              this.reloadYpzh(this.rowIndex,this.tableData)
              this.rowIndex -= 1
              this.initCZList()
            })
          } else {
            // 同组中都没有sbxh
            const start = this.tableData.findIndex((item: any) => item.yjzh == groupData[0].yjzh)
            this.tableData.splice(start, groupData.length)
            this.rowIndex -= 1
            this.getSummary()
          }
          this.$nextTick(()=> {
            this.reloadYpzho(this.tableData)
          })
        }

          // this.tableData.forEach((item: any, index: number) => {
          //   if (item.ylxh == null) {
          //     this.tableData.splice(index, 1)
          //   }
          // })
          // let list = this.tableData.filter((item: any) => item.ypjh == this.tableData[this.rowIndex].yjzh)
          // list.forEach((ele: any) => {
          //   if (ele.sbxh) obj.sbxh = ele.sbxh
          // })
          // if (obj.sbxh) {
          //   removeAuxiliary(obj).then((res: AxiosResponse) => {
          //     // this.$notify({
          //     //   title: '已删除',
          //     //   type: 'success',
          //     //   message: '',
          //     // })
          //     this.tableData.splice(this.rowIndex, 1)
          //     this.reloadYpzh(this.rowIndex, this.tableData)
          //     console.log(this.tableData)
          //     this.handleSave()
          //   })
          // } else {
          //   let list = this.tableData.filter((item: any) => item.yjzh == this.tableData[this.rowIndex].yjzh)
          //   const start = this.tableData.findIndex((item: any) => item.yjzh == list[0].yjzh)
          //   this.tableData.splice(start, list.length)
          //   this.reloadYpzh(start, this.tableData)
          // }
      }).catch(() => {})
    }
  }

  //数据交互
  private tableRowClassName({ row, rowIndex }: any) {
    row.index = rowIndex
  }

  private handleGetIndex(val: any) {
    this.rowIndex = val.index
    this.YJZH = val.yjzh
    this.JGID = val.jgid
    console.log(val)
  }

  // @Watch('tableData', { immediate: true, deep: true })
  // private tableDataChange(value: Array<any>) {
  //   if (value) this.getSummary()
  // }

  // 判断是否添加重复项目
  private isUniqueFj(value: number | string, list: Array<any>) {
    let cc = list.findIndex((item: any) => item.ylxh == value)
    return cc
  }

  // 计算划价金额
  private countYpsl() {
    let cc = this.tableData[this.rowIndex]
    cc.hjje = cc.yldj ? getFloat(cc.yldj * cc.ylsl, 4) : 0
    this.getSummary()
  }

  // 计算合计金额和自付金额
  private async getSummary() {
    await this.getTotal()
    this.summary = 0
    this.summaryPay = 0
    let list = this.tableData.filter((obj: any) => {
      if (obj.ylxh > -1 && (obj.zfpb == 0 || obj.zfpb == null) && (obj.djly == 11 || !obj.djly)) {
        return obj
      }
    })
    list.forEach((item: any) => {
      this.summary = this.summary + Number(item.hjje)
      this.summaryPay = this.summaryPay + item.hjje * item.zfbl
    })
    this.summary = getFloat(this.summary+this.HJJE, 4)
    this.summaryPay = getFloat(this.summaryPay+this.ZFJE, 4)
  }

  // 获取合计金额与自负金额
  private async getTotal() {
    const params: any = {
      brid: this.pnParam.brid,
      jzxh: this.pnParam.clinicId,
      fjlb: 2,
    }
    await queryDisposalTotalFee(params).then((res: any) => {
      this.HJJE = res.data ? res.data.hjje : 0
      this.ZFJE = res.data ? res.data.zfje : 0
    })
  }

  /**
   * @Description: 光标聚焦下一个
   * @author: zhml
   * @return:
   * @date 2020/7/23
   */
  private nextFocus(scope: number, num: number) {
    if (num == 2 && this.checked) {
      this.countYpsl()
      this.handleNewGroup()
    } else if (num == 2 && !this.checked) {
      this.countYpsl()
      this.handleInsert()
    }
    // 8.20 需求    默认回车不聚焦到执行科室，有就带出，没有就空
    if (num < 2) {
      ;(this.$refs[`${scope}-${num}`] as any).blur()
      ;(this.$refs[`${scope}-${num + 1}`] as any).focus()
    }
  }

  /**
   * @Description: 重新排列医技组号
   * @author: zhml
   * @param {type}:
   * @return: list
   * @date 2020/8/4
   */
  private reloadYpzh(data: any, list: Array<any>) {
    list.forEach((item: any, index: number) => {
      if (index >= data) {
        item.yjzh = item.yjzh - 1
      }
      console.log(747, item.yjzh)
      return list
    })
    console.log(list)
  }

  // 判断医保性质
  private isYbXZ(data: any) {
    let flag = null
    querySjBrxz({ brxz: data }).then((res: AxiosResponse) => {
      if (res.data == this.YBXZ) {
        flag = true
      }
    })
    return flag
  }

  private handleSave() {
    this.saveFlag = true
    if (this.tableData.length == 0) return
    for (let i = 0; i < this.tableData.length; i++) {
      if (this.tableData[i].ylxh == 0) {
        this.tableData.splice(i, 1)
      }
      if (this.tableData[i].yjjk) this.tableData[i].yjjk = 1
      if (!this.tableData[i].yjjk) this.tableData[i].yjjk = 0
      if (!this.tableData[i].ylsl) {
        this.$message.warning('医疗数量不能为空') 
        this.saveFlag = false
        return
      }
      if (this.tableData[i].zfbl == null || this.tableData[i].zfbl == undefined) {
        this.$message.warning('自负比例不能为空') 
        this.saveFlag = false
        return
      }
    }

    // this.tableData.forEach((item: any, index: number) => {
    //   if (item.fygb == 6 && item.fydw == '次' && item.ylsl > 5 && this.isYbXZ(item.brxz)) {
    //     this.$message.warning('医保病人' + item.fymc + '不能超过5次')
    //   }
    //   if (item.ylxh == 2717 && item.ylsl > 2 && this.isYbXZ(item.brxz)) {
    //     this.$message.warning('医保病人' + item.fymc + '不能超过5次')
    //   }

    //   if (this.ZSDYJSFSY.includes(item.ylxh)) {
    //     this.isSYD = true
    //   }
    //   // 先清除空数据
    //   if (item.ylxh == null) {
    //     this.tableData.splice(index, 1)
    //   }
    // })

    let listed: any = this.tableData.filter((item: any) => {
      if (item.ztbz != 1 && (!item.djly || item.djly == 11)) {
        return item
      }
    })
    this.tableData[0].yjzx = 1
    let objList = {
      brid: this.pnParam.brid,
      brxm: this.pnParam.brxm,
      jzkh: this.pnParam.jzkh,
      clinicId: this.pnParam.clinicId,
      djly: 11,
      ghgl: this.pnParam.jzxh,
      ksdm: Vue.prototype.AUTHORITY.outpatientCode,
      bodys: listed,
      mzzy: 0,
      mzks: Vue.prototype.AUTHORITY.outpatientCode,
      jzlsh: this.pnParam.jzlsh,
    }
    if (listed.length == 0) {
      this.$notify.warning('没有组套外的医技项目，不需要保存')
      this.saveFlag = false
      return
    } else {
      saveBeforeCheck(objList).then((res: AxiosResponse) => {
        saveCZ(objList).then(() => {
          this.$notify({
            type: 'success',
            title: '保存成功',
            message: '',
          })
          this.saveFlag = false
          this.flag_save = false
          this.initCZList()
        }).catch(() => {
          this.saveFlag = false
        })
        this.$emit('setStatus', true)
      })
    }
  }

  private cyxSet(value: any) {
    // this.handleNewGroup()
    const loadObj: any = {
      brxz: this.pnParam.brxz,
      brid: this.pnParam.brid,
      ztbh: value.ztbh,
      zt02Jlbh: [value.jlbh],
    }
    let cc = this.tableData.length > 0 ? this.tableData[this.tableData.length - 1].yjzh : 0
    loadPersonalSet(loadObj).then((res: AxiosResponse) => {
      res.data.forEach((item: any) => {
        let obj = {
          ylxh: item.fyxh,
          fymc: item.xmmc,
          fydw: item.fydw,
          fygb: item.fygb,
          ycsl: item.ycsl,
          yldj: getFloat(item.fydj, 4),
          ylsl: 1,
          hjje: 0,
          xmlx: 0,
          yjzx: 0,
          dzbl: 1,
          yjzh: cc + item.ypzh,
          zfbl: item.zfbl,
          ksdm: Vue.prototype.AUTHORITY.outpatientCode,
          ztbz: 0,
          zxks: item.fyks,
        }
        console.log('item', item)
        obj.hjje = getFloat(obj.ylsl * obj.yldj, 4)
        let xh: number = this.tableData[this.tableData.length-1].pxh
        this.$set(obj,'pxh',xh+1)
        if (this.isUniqueFj(obj.ylxh, this.tableData) == -1) {
          this.tableData.push(obj)
        } else {
          this.$notify({
            type: 'warning',
            title: '已有项目',
            message: '',
          })
        }
      })
      this.$nextTick(()=> {
        this.getSummary()
      })
    })
  }

  private async setData(obj: any) {
    const object = {
      brxz: this.pnParam.brxz,
      fygb: obj.fygb,
      fyxh: obj.fyxh,
      type: 0,
    }
    if (obj.ztbh) {
      queryDetailXm({ ztbh: obj.ztbh }).then((res: any) => {
        if (res.data.length == 0) {
          this.$notify({
            type: 'warning',
            title: '该组套下没有项目',
            message: '',
          })
          return
        } else {
          res.data.map((item: any, index: number) => {
            // item.webSortNumber = index + 1
          })
          this.tableList = res.data
          this.isVisiable = true
        }
      })
    } else if (this.isUniqueFj(obj.fyxh, this.tableData) == -1) {
      if (obj.xzsy == 1) {
        //  TODO: 判断药品限制使用    serviceId： clinicDisposalEntryService   、serviceAction： queryIsNeedVerify
      }
      this.tableData[this.rowIndex].fymc = obj.fymc
      this.tableData[this.rowIndex].fydw = obj.fydw
      this.tableData[this.rowIndex].fygb = obj.fygb
      this.tableData[this.rowIndex].jgid = obj.jgid
      this.tableData[this.rowIndex].ycsl = obj.ycsl
      this.tableData[this.rowIndex].isZxks = obj.isZxks
      this.tableData[this.rowIndex].yldj = obj.fydj ? getFloat(obj.fydj, 4) : 0
      this.tableData[this.rowIndex].ylxh = obj.fyxh
      this.tableData[this.rowIndex].ylsl = 1
      this.tableData[this.rowIndex].xmlx = obj.xmlx
      ;(this.tableData[this.rowIndex].zxks = obj.zxks), (this.tableData[this.rowIndex].hjje = getFloat(this.tableData[this.rowIndex].ylsl * this.tableData[this.rowIndex].yldj, 4))
      ;(this.tableData[this.rowIndex].ksdm = Vue.prototype.AUTHORITY.outpatientCode),
      await getPayProp(object).then((res: any) => {
        this.tableData[this.rowIndex].zfbl = res.data
      })
      this.$nextTick(()=> {
        this.getSummary()
        this.nextFocus(this.rowIndex,1)
      })
      // if (this.tableData[this.rowIndex].zxks != null) {
      //   let list = this.tableData.forEach((ele: any) => {
      //     if (ele.yjzh == this.tableData[this.rowIndex].yjzh) {
      //       ele.zxks = this.tableData[this.rowIndex].zxks
      //     }
      //   })
      // }
    } else {
      // let cc = this.tableData[this.rowIndex].yjzh
      // this.tableData[this.rowIndex] = NSaveObj
      // this.tableData[this.rowIndex].yjzh = cc
      console.log(1010)
      this.tableData[this.rowIndex].fymc = ' '
      this.$notify({
        type: 'warning',
        title: '已有项目',
        message: '',
      })
    }
  }

  private setDataList(val: any) {
    console.log('val', val)
    // if (val.ztmc) {
    //   console.log(123)
    //   val = { ...val, ...this.pnParam }
    //   val.ksdm = Vue.prototype.AUTHORITY.outpatientCode
    //   val.sslb = 1
    //   if (this.tableData.length == 0) {
    //     val.yjzh = 1
    //     this.$set(val,'pxh',1)
    //   } else {
    //     val.yjzh = this.tableData[this.tableData.length - 1].yjzh + 1
    //     this.$set(val,'pxh',this.tableData[this.tableData.length - 1].pxh + 1)
    //   }

    //   if (this.isUniqueFj(val.ztbh, this.tableData) == -1) {
    //     // 添加的整个组套项目
    //     saveDisposalSet(val).then((response: AxiosResponse) => {
    //       // insertDisposalSet({ sbxh: response.data }).then((res: AxiosResponse) => {
    //       //   let obj = {
    //       //     ylxh: res.data.ylxh,
    //       //     fymc: res.data.fymc,
    //       //     fydw: res.data.fydw,
    //       //     fygb: res.data.fygb,
    //       //     yldj: getFloat(res.data.yldj, 4),
    //       //     ylsl: 1,
    //       //     hjje: getFloat(res.data.hjje, 4),
    //       //     xmlx: res.data.xmlx,
    //       //     yjzx: res.data.yjzx,
    //       //     yjzh: this.tableData.length == 0 ? 1 : this.tableData[this.tableData.length - 1].yjzh + 1,
    //       //     dzbl: res.data.dzbl,
    //       //     zfbl: getFloat(res.data.zfbl, 4),
    //       //     ksdm: Vue.prototype.AUTHORITY.outpatientCode,
    //       //     ztbz: 1,
    //       //     sbxh: response.data,
    //       //   }
    //       //   this.tableData.push(obj)
    //       // })
    //       this.initCZList()
    //     })
    //   } else {
    //     this.$notify({
    //       type: 'warning',
    //       title: '已有项目',
    //       message: '',
    //     })
    //   }
    // } else {
      const loadObj: any = {
        brxz: this.pnParam.brxz,
        brid: this.pnParam.brid,
        ztbh: val[0].ztbh,
        zt02Jlbh: [],
      }
      if (val.length == 0 && typeof val == 'object') {
        this.$notify({
          type: 'warning',
          title: '请选择要调入的组套明细',
          message: '',
        })
        return
      }
      let cc = this.tableData.length > 0 ? this.tableData[this.tableData.length - 1].yjzh : 0
      val.forEach((item: any) => {
        loadObj.zt02Jlbh.push(item.jlbh)
      })
      let _that = this
      // 添加组套里的项目明细
      loadPersonalSet(loadObj).then((res: AxiosResponse) => {
        let xh: number = _that.tableData.length
        if(_that.tableData.length){
          res.data.forEach((result: any)=> {
            _that.$set(result,'pxh',(result.ypzh + _that.tableData[xh-1].pxh))
          })
        }else{
          res.data.forEach((result: any)=> {
            _that.$set(result,'pxh',result.ypzh)
          })
        }
        
        res.data.forEach((item: any) => {
          let obj = {
            ylxh: item.fyxh,
            fymc: item.xmmc,
            fydw: item.fydw,
            fygb: item.fygb,
            ycsl: item.ycsl,
            yldj: getFloat(item.fydj, 4),
            ylsl: 1,
            hjje: 0,
            xmlx: 0,
            yjzx: 0,
            dzbl: 1,
            yjzh: cc + item.ypzh,
            zfbl: item.zfbl,
            ksdm: Vue.prototype.AUTHORITY.outpatientCode,
            ztbz: 0,
            zxks: item.fyks,
            pxh: item.pxh,
          }
          
          console.log('item', item)
          obj.hjje = getFloat(obj.ylsl * obj.yldj, 4)
          if (this.isUniqueFj(obj.ylxh, this.tableData) == -1) {
            this.tableData.push(obj)
          } else {
            this.$notify({
              type: 'warning',
              title: `${obj.fymc}已存在`,
              message: '',
            })
          }
        })
      this.$nextTick(()=> {
        this.getSummary()
        this.reloadYpzho(this.tableData)
      })
      console.log(1030, this.tableData)
    })
    // }
  }

  // 录入全部药品
  private async setAllData(value: any) {
    await this.handleNewGroup()
    const object = {
      brxz: this.pnParam.brxz,
      fygb: value.fygb,
      fyxh: value.fyxh,
      type: 0,
    }
    if (this.isUniqueFj(value.fyxh, this.tableData) == -1) {
      this.tableData[this.rowIndex].fydw = value.fydw
      this.tableData[this.rowIndex].fygb = value.fygb
      this.tableData[this.rowIndex].fymc = value.fymc
      this.tableData[this.rowIndex].yldj = getFloat(value.bzjg, 4)
      this.tableData[this.rowIndex].ylxh = value.fyxh
      this.tableData[this.rowIndex].zxks = value.zxks
      this.tableData[this.rowIndex].ylsl = 1
      ;(this.tableData[this.rowIndex].ksdm = Vue.prototype.AUTHORITY.outpatientCode), (this.tableData[this.rowIndex].hjje = this.tableData[this.rowIndex].yldj ? getFloat(this.tableData[this.rowIndex].ylsl * this.tableData[this.rowIndex].yldj, 4) : 0)
      getPayProp(object).then((res: any) => {
        this.tableData[this.rowIndex].zfbl = getFloat(res.data, 4)
      })
    } else {
      this.$notify({
        type: 'warning',
        title: '已有项目',
        message: '',
      })
      this.tableData.splice(this.rowIndex, 1)
    }
    this.$nextTick(()=> {
      this.getSummary()
    })
  }

  // private change() {}

  private closeRight() {
    this.showRight = true
    this.leftCol = 23
  }

  private openRight() {
    this.showRight = false
    this.leftCol = 19
  }

  private getPrintUrl(value: any) {
    if (value) {
      const cc: any = this.$refs.statement
      cc.printTable()
    }
  }

  // 鼠标悬浮查看组套详细信息
  private async checkDetail(val: any) {
    // console.log(1220,val)
    if (!val.ztyzsbxh) return
    if (val.children) {
      this.checkData = val.children
      return
    } else {
      await queryZtDetail({ sbxh: val.ztyzsbxh }).then((res: any) => {
        if (res.errorCode == 'SUCCESS') {
          this.$set(val, 'children', res.data)
          this.checkData = val.children
        }
      })
    }

    console.log(1362, this.checkData)
  }

  //获取执行科室列表
  private zxksList() {
    depTList({}).then((res: any) => {
      console.log(res)
      this.ksdmList = res.data
      this.zlksList.forEach((item: any)=> {
        this.$set(item,'id',item.dv)
        this.$set(item,'officename',item.dn)
      })
      console.log('518',this.zlksList)
      this.ksdmList = this.ksdmList.concat(this.zlksList)
      console.log('1328',this.ksdmList)
      this.ksdmList.splice(0, 0, { id: 0, officename: '全院科室', py: 'QYKS', showOrder: 0, stop: '' })
    })
  }

  // 百分制
  private useMul(a: any, b: number) {
    return mul(a, b)
  }

  // 获取打印医院的logo
  private queryPrintLogo() {
    queryLogo(this.userInfo.hospitalId).then((res: any) => {
      let logo: any = res.data
      let a:any = document.getElementById("imgInit")
      a.src = logo
    })
  }

  // 选中的打印数据
  private handleSelectPrint(val: any) {
    this.selectData = val
  }

  // 根据条件打印数据
  private async printDj(val: string,type: string) {
    if(this.flag_save && this.tableData.length == 0) return this.$message.warning('请先保存数据！')
    this.queryPrintLogo()
    let czArr: Array<any> = []
    if(val == 'all') {
      czArr = this.tableData
    } else if(val == 'group') {
      if(this.selectData.length==0) return this.$message.warning('请勾选需要打印的组！')
      czArr = this.selectData // 同组数据
    } else {
      if(this.selectData.length==0) return this.$message.warning('请勾选需要打印的项！')
      czArr = this.selectData // 选中数据
    }
    
    czArr.forEach((item: any) => {
      this.$set(item,'xmmc',item.fymc)
      this.$set(item,'ztsbxh',item.ztyzsbxh)
    })

    const params: any = {
      czPrintData: czArr,
      jzlsh: this.pnParam.jzlsh,
      type: type,
    }
    await queryPrintData(params).then((res: any)=> {
      if(res.errorCode == 'SUCCESS') {
        console.log('1344',res)
        this.printData = res.data
        this.printCzArr = res.data.czDetail
        let zh:number = 0
        let sortZh:number = 1
        for(let i=0; i<this.printCzArr.length; i++) {
          if(this.printCzArr[i].yjzh == zh) {
            this.printCzArr[i].yjzh = ''
          } else {
            zh = this.printCzArr[i].yjzh
            this.printCzArr[i].yjzh = sortZh
            sortZh++
          }
        }
      }
    })


    switch (val) {
      case 'all':
        // 先调用接口获取数据然后打印
        this.$nextTick(()=> {
          this.printFn()
        })
        return
      case 'group':
        // 先调用接口获取数据然后打印
        this.$nextTick(()=> {
          this.printFn()
        })
        return
      case 'selected':
        // 先调用接口获取数据然后打印
        this.$nextTick(()=> {
          this.printFn()
        })
        return
    }



  }

  // LOPDOP打印
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
      var a: any = document.getElementById('czzld')
      var op: any = '<body>' + a.innerHTML + '</body>'
      // a.style.zoom=0.85 // 缩放页面，配合LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true)使用
      LODOP.ADD_PRINT_HTM(0, '4mm', '140mm', '210mm', op) // 尾部
      // LODOP.ADD_PRINT_HTM('33.5mm', '4mm', '132mm', '210mm', op) // 尾部
      // LODOP.SET_PRINT_MODE('POS_BASEON_PAPER', true) // 以纸张边缘为基点
      LODOP.PREVIEW() // 预览
      // LODOP.PRINT() // 打印
      // LODOP.PRINT_DESIGN() // 设计
    } 
  }

}
</script>
<style lang="scss" scoped>
@import '@/styles/inputTable.scss';
.his-patient-auxiliary {
  .his-small {
    padding-top: 4px;

    .row {
      padding-bottom: 4px;
    }
  }

  .w100 {
    height: 32px;
    width: 100%;
  }

  .status {
    font-family: siyuanMedium !important;
  }

  .waste-fphm {
    color: red !important;
  }

  .charge {
    color: #0fcaad !important;
  }

  .no-charge {
    color: #1485ff !important;
  }

  ::v-deep .color-group .cell {
    padding: 0 !important;

    .orangeBack,
    .greenBack {
      height: 32px;
      opacity: 0.3 !important;
    }

    .greenBack {
      background: #0fcaad;
    }

    .orangeBack {
      background: #ffbf00;
    }
  }

  .header-row {
    display: flex;
    flex-flow: row nowrap;
    padding-bottom: 8px;

    .label {
      width: 40px;
      font-size: 13px;
      align-self: center;
      margin-right: 8px;
    }

    .row-input {
      height: 28px;
      width: 100%;
      background: rgba(245, 246, 248, 1);
      border-radius: 4px;
      margin-right: 6px;

      ::v-deep .el-input__inner {
        width: 108px;
        height: 28px;
        background: rgba(245, 246, 248, 1);
        border-radius: 4px;
        margin-right: 6px;
        border: none;
      }
    }

    .el-button--primary {
      padding: 0;
      width: 48px;
      height: 24px;
      border-radius: 4px;
      justify-content: center;
      margin-top: 3px;
    }
  }
}

::v-deep .el-col {
  &.el-col-1 {
    width: 2.1666666667% !important;
  }

  &.el-col-23 {
    width: 97.8333333333% !important;
  }
}

.btn .el-button::v-deep span {
  font-size: 13px;
}

::v-deep button .icon {
  font-size: 16px;
}

div.total {
  padding: 14px 12px 0;

  span {
    margin-right: 15px;
    font-size: 13px;
    /*color: #6a6d78;*/
  }

  .selfSum {
    margin-left: 2px;
  }
}

.pr10 {
  padding-right: 10px;
}

.tab-row {
  display: flex;
  justify-content: space-between;
}

.right-btn {
  border-radius: 4px;
  background: $light-blue;
  padding: 8px 10px;
  margin-left: 1px;
  color: $white;
}

::v-deep .el-pagination {
  overflow: hidden;
}

.action {
  display: flex !important;
  justify-content: center;
  padding-top: 10px;
}

span.open.action {
  justify-content: start !important;
}

.content .his-module .pagenation-list .page-footer {
  margin-bottom: 8px;
}

::v-deep .el-input--medium .el-input__icon {
  line-height: 28px;
}

div.total {
  padding: 0 12px !important;
  margin: 8px 0;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}

.price-bar {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: start;

  p {
    font-size: 13px;
  }

  em {
    font-size: 14px;
    color: #1485ff;
    font-family: siyuanMedium;
  }
}

.label {
  .title {
    width: 30px;
    font-size: 13px;
    margin-right: 4px !important;
  }

  .btn {
    .el-divider--vertical {
      margin: 0 10px;
    }

    ::v-deep .el-checkbox__label {
      padding-left: 4px;
    }
  }
}

::v-deep div.first-red::before {
  content: '*';
  color: red;
}

.right {
  display: flex;
  align-items: center;
  justify-content: end;
}

.left {
  display: flex;
  align-items: center;
  justify-content: start;
}

.his-dialog {
  padding: 0 !important;
  height: auto;

  /*::v-deep .el-table--medium td .cell {*/
  /*  padding: 0 !important;*/
  /*}*/
  .w100 {
    height: 28px;
    width: 100%;
  }

  ::v-deep .color-group .cell {
    padding: 0 !important;

    .orangeBack,
    .greenBack {
      height: 32px;
      opacity: 0.3 !important;
    }

    .greenBack {
      background: #0fcaad;
    }

    .orangeBack {
      background: #ffbf00;
    }
  }
}
</style>
