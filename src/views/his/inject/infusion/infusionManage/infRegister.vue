// 输液接药登记
<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col :span="24">
        <div class="his-module his-small" :style="{ height: listSlotHeight1 + 'px', marginBottom: '10px' }">
          <pagenation-list
            ref="pageTable"
            data-url="/op-service/syjydjzb/doQuerySyJydjList"
            v-model="tableData1"
            :list-height="listSlotHeight1 - 94"
            :searchData="searchData"
            http-method="post"
            @reqComplete="calcTimeDiff"
          >
            <div slot="header" class="row">
              <div class="label">
                <!-- 科室 -->
                <h1 class="title">输液接药登记</h1>
                <el-divider direction="vertical" class="mr4"></el-divider>
                <el-checkbox-group v-model="searchData.zt" @change="changQueryZt">
                  <el-checkbox label="0">未开始</el-checkbox>
                  <el-checkbox label="1">输液中</el-checkbox>
                  <el-checkbox label="2">输液完成</el-checkbox>
                </el-checkbox-group>
                <el-divider direction="vertical" class="mr4"></el-divider>
                <div class="btn">
                  <el-button @click="openDiolag">
                    <i class="icon his-patient-info" />登记
                  </el-button>
                  <el-button @click="printTable" style="display:none">
                    <i class="icon his-btn-print" />打印表格
                  </el-button>
                </div>
              </div>
            </div>
            <el-table
              slot="list"
              stripe
              :highlight-current-row="true"
              :data="tableData1"
              :height="listSlotHeight1 - 94"
              class="scroll-bar"
              border
              @row-click="getDetail"
              @select="tableSelect"
            >
              <!-- 复选框 -->
              <!-- <el-table-column type="selection" width="32"></el-table-column> -->

              <el-table-column type="index" width="32"></el-table-column>

              <!-- 状态，0未开始，1输液中，2输液完成 -->
              <el-table-column label="状态" min-width="60" prop="status">
                <template scope="scope">
                  <div v-if="scope.row.zt==0" class="yellow">未开始</div>
                  <div v-if="scope.row.zt==1" class="blues">输液中</div>
                  <div v-if="scope.row.zt==2" class="reds">输液完</div>
                </template>
              </el-table-column>

              <!-- 登记时间 -->
              <el-table-column prop="djsj" label="登记时间" min-width="140"></el-table-column>

              <!-- 病人姓名 -->
              <el-table-column prop="brxm" label="患者姓名" min-width="80"></el-table-column>

              <!-- 性别-->
              <el-table-column prop="brxb" label="性别" min-width="60">
                <template slot-scope="scope">
                  <div v-if="genderList.find(item => item.dv==scope.row.brxb)">
                    {{genderList.find(item => item.dv==scope.row.brxb).dn}}
                  </div>
                </template>
              </el-table-column>

              <!-- 年龄 -->
              <el-table-column prop="age" label="年龄" min-width="60"></el-table-column>

              <el-table-column prop="zwh" label="座位号" min-width="60"></el-table-column>

              <!-- 发票号 -->
              <!-- <el-table-column prop="fphm" label="发票号" min-width="80"></el-table-column> -->

              <!-- 输液日期 -->
              <!-- <el-table-column prop="syrq" label="输液日期" min-width="90"></el-table-column> -->

              <!-- 开始时间 -->
              <el-table-column prop="kssj" label="开始时间" min-width="140"></el-table-column>

              <!-- 实时时间差 -->
              <!-- <el-table-column prop="timeDiff" label="实时"></el-table-column> -->

              <!-- 完成时间 -->
              <el-table-column prop="wcsj" label="完成时间" min-width="140"></el-table-column>

              <!-- 输液时长 -->
              <el-table-column label="输液时长" min-width="90">
                <template slot-scope="scope">
                  <div v-if="scope.row.zt!=0">
                    {{useMsecToHms(scope.row.timeDiff)}}
                  </div>
                </template>
              </el-table-column>

              <!-- 登记人-->
              <el-table-column prop="djrdm" label="登记人" min-width="80">
                <template slot-scope="scope">
                  <div v-if="usersList.find(item => item.dv==scope.row.djrdm)">
                    {{usersList.find(item => item.dv==scope.row.djrdm).dn}}
                  </div>
                  <div v-else>{{scope.row.djrdm}}</div>
                </template>
              </el-table-column>

              <!-- 开始人-->
              <el-table-column prop="ksrdm" label="开始人" min-width="80">
                <template slot-scope="scope">
                  <div v-if="usersList.find(item => item.dv==scope.row.ksrdm)">
                    {{usersList.find(item => item.dv==scope.row.ksrdm).dn}}
                  </div>
                  <div v-else>{{scope.row.ksrdm}}</div>
                </template>
              </el-table-column>

              <!-- 结束人-->
              <el-table-column prop="wcczrdm" label="结束人" min-width="80">
                <template slot-scope="scope">
                  <div v-if="usersList.find(item => item.dv==scope.row.wcczrdm)">
                    {{usersList.find(item => item.dv==scope.row.wcczrdm).dn}}
                  </div>
                  <div v-else>{{scope.row.wcczrdm}}</div>
                </template>
              </el-table-column>

              <!-- 操作 -->
              <el-table-column label="操作" width="100" fixed="right" align="center" class-name="action-btns">
                <template slot-scope="scope">
                  <!-- 输液开始 -->
                  <el-tooltip :content="'输液开始'" effect="light">
                    <el-popconfirm
                      hideIcon
                      :cancelButtonText="$t('common.cancel')"
                      :confirmButtonText="$t('common.confirm')"
                      :title="'输液开始？'"
                      @confirm="confirmStart(scope.row)"
                    >
                      <el-button
                        slot="reference"
                        class="green"
                        :disabled="scope.row.zt==0?false:true"
                      >
                        <i class="icon his-tree-tuck-up" style="left:60%"></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>

                  <!-- 输液完成 -->
                  <el-tooltip :content="'输液完成'" effect="light">
                    <el-popconfirm
                      hideIcon
                      :cancelButtonText="$t('common.cancel')"
                      :confirmButtonText="$t('common.confirm')"
                      :title="'输液完成？'"
                      @confirm="confirmEnd(scope.row)"
                    >
                      <el-button
                        slot="reference"
                        class="green"
                        :disabled="scope.row.zt==1?false:true"
                      >
                        <i class="icon his-automated"></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>

                  <!-- 补打瓶签 -->
                  <el-tooltip :content="'瓶签打印'" effect="light">
                    <el-button class="blue" @click="printInfSheet(scope.row.djdh)">
                      <i class="icon his-caozuo_shixin" />
                    </el-button>
                  </el-tooltip>

                  <!-- 补打巡回单 -->
                  <!-- <el-tooltip :content="'补打巡回单'" effect="light">
                    <el-button class="blue" @click="printInfXhd(scope.row.djdh)">
                      <i class="icon his-caozuo_shixin" />
                    </el-button>
                  </el-tooltip> -->

                  <!-- 补打巡回单 -->
                  <!-- <el-tooltip :content="'补打护理评估单'" effect="light">
                    <el-button class="blue" @click="printHlpgd(scope.row.djdh)">
                      <i class="icon his-caozuo_shixin" />
                    </el-button>
                  </el-tooltip> -->

                  <!-- 打印 -->
                  <!-- <el-tooltip :content="'更多操作'" effect="light">
                    <span>
                      <el-dropdown trigger="click" placement="bottom" size="small" @command="print">
                        <el-button class="blue">
                          <i class="icon his-caidanliebiao-more1" />
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item :command="[1,scope.row.djdh]">打印瓶签</el-dropdown-item>
                          <el-dropdown-item :command="[2,scope.row.djdh]">打印巡回单</el-dropdown-item>
                          <el-dropdown-item :command="[3,scope.row.djdh]">打印护理评估单</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </span>
                  </el-tooltip> -->
                </template>
              </el-table-column>
            </el-table>
          </pagenation-list>
        </div>

        <div class="his-module his-small" :style="{ height: listSlotHeight2 + 'px' }">
          <div slot="header" class="row">
            <div class="label lables">
              <!-- 输液药品详情 -->
              <h1 class="title">输液药品详情</h1>
               <div class="btn pl200">
                  <el-button @click="printPt">
                    <i class="icon his-patient-info" />瓶贴打印
                  </el-button>
                </div>
              <!-- <el-divider direction="vertical" class="mr4"></el-divider>
              <div class="btn">
                <el-button @click="printInfSheet(curRow.djdh)">
                  <i class="icon his-btn-print" />打印瓶签
                </el-button>
                <el-button @click="printInfXhd(curRow.djdh)">
                  <i class="icon his-btn-print" />打印巡回单
                </el-button>
              </div> -->
            </div>
          </div>
          <el-table
            slot="list"
            stripe
            :highlight-current-row="true"
            :data="tableData2"
            ref="table"
            :height="listSlotHeight2 - 62"
            class="scroll-bar no-underline"
            border
            @row-click="handleChange"
            row-key="id"
            empty-text
            @selection-change="getSelectionData"
            @select="selectRow"
            :row-class-name="tableRowClassName"
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column type="selection" width="32"></el-table-column>
            <el-table-column label width="14" align="center">
              <template slot-scope="scope">
                <div class="w100" :class="scope.row.colorFlag ? 'greenBack' : 'orangeBack'"></div>
              </template>
            </el-table-column>

            <!-- 输液序号 -->
            <el-table-column prop="xh" label="序号" width="44"></el-table-column>

            <!-- 开方日期 -->
            <el-table-column prop="kfrq" label="开方日期" min-width="140"></el-table-column>min-

            <!-- 药品名称 -->
            <el-table-column prop="ypmc" label="药品名称" min-width="160" show-overflow-tooltip></el-table-column>

            <!-- 规格 -->
            <el-table-column prop="ypgg" label="规格" min-width="80" show-overflow-tooltip></el-table-column>

            <!-- 产地 -->
            <el-table-column prop="ypcd" label="产地" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="ypcdList.find(item => item.dv==scope.row.ypcd)" class="text-ellipsis">
                  {{ypcdList.find(item => item.dv==scope.row.ypcd).dn}}
                </div>
                <div v-else>{{scope.row.ypcd}}</div>
              </template>
            </el-table-column>

            <!-- 剂量 -->
            <el-table-column prop="ypjl" label="剂量" min-width="60">
              <template slot-scope="scope">
                {{scope.row.ypjl}}{{scope.row.jldw}}
              </template>
            </el-table-column>

            <!-- 频次 -->
            <el-table-column prop="sypc" label="频次" class-name="text-blue-td" min-width="60"></el-table-column>

            <!-- 途径 -->
            <el-table-column prop="gytj" label="途径" class-name="text-blue-td" min-width="60">
              <template slot-scope="scope">
                <div v-if="infusionWalyList.find(item => item.dv==scope.row.gytj)" class="text-ellipsis">
                  {{infusionWalyList.find(item => item.dv==scope.row.gytj).dn}}
                </div>
                <div v-else>{{scope.row.gytj}}</div>
              </template>
            </el-table-column>

            <!-- 天数 -->
            <el-table-column prop="yyts" label="天数" class-name="text-blue-td" min-width="60"></el-table-column>

            <!-- 医生 -->
            <el-table-column prop="ysdm" label="医生" min-width="80">
              <template slot-scope="scope">
                <div v-if="docList.find(item => item.dv==scope.row.ysdm)" class="text-ellipsis">
                  {{docList.find(item => item.dv==scope.row.ysdm).dn}}
                </div>
                <div v-else>{{scope.row.ysdm}}</div>
              </template>
            </el-table-column>

            <!-- 说明 -->
            <el-table-column prop="bzmc" label="说明"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <infRegDialog
      ref="infRegDialog"
      :ypcdList="ypcdList"
      :docList="docList"
      :deptList="deptList"
      :infusionWalyList="infusionWalyList"
      @registered="registered"
    ></infRegDialog>
    <infSheet ref="infSheet"/>

    <!-- 瓶签 -->
    <div
      v-for="(value,key,index1) in infPqInfo.maps"
      :key="key"
      :id="'infPq'+key"
      style="width:400px;height:450px;border:1px solid #f00;"
      :style="'right:' + 300*index1 + 'px'"
    >
      <div style="font-size:18px;text-align:center;">{{jgName}}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;">
        <div style="font-size:16px;">{{infPqInfo.brxm}}</div>
        <div style="font-size:14px;">{{infPqInfo.brxb==1?'男':'女'}} {{infPqInfo.ages}}</div>
        <div style="font-size:14px;">出生日期<br>{{infPqInfo.csnyStr}}</div>
        <div style="width:80px;"></div>
        <!-- <div>||||||||||||||||||||<br><span style="font-size:12px;">65160</span></div> -->
      </div>
      <table style="width:100%;margin-top:2px;border-top:3px double;border-bottom:1px solid;" cellspacing="0">
        <tr>
          <th style="font-size:13px;border-bottom:1px solid">药品名称</th>
          <th style="font-size:13px;border-bottom:1px solid">剂量</th>
        </tr>
        <tr v-for="(item, index2) in value" :key="index2">
          <td style="padding-bottom:4px;font-size:13px;" :style="index2==0?'padding-top:4px;':''">
            <div>{{item.ypmc}}</div>
            <div style="font-size:13px;">规格：{{item.ypgg}}</div>
          </td>
          <td style="font-size:13px;font-weight:bold;">{{item.ypjl}}{{item.jldw}}</td>
        </tr>
      </table>
      <div style="position:absolute;bottom:0;width:100%;">
        <div style="display:flex;justify-content:space-between;">
          <span style="font-size:12px;">审方：<span style="display:inline-block;vertical-align:bottom;width:50px;font-size:12px;border-bottom:1px solid #000;"></span></span>
          <span style="font-size:12px;">摆药：<span style="display:inline-block;vertical-align:bottom;width:50px;font-size:12px;border-bottom:1px solid #000;"></span></span>
          <span style="font-size:12px;">核对：<span style="display:inline-block;vertical-align:bottom;width:50px;font-size:12px;border-bottom:1px solid #000;"></span></span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:6px;">
          <span style="font-size:12px;">配置：<span style="display:inline-block;vertical-align:bottom;width:50px;font-size:12px;border-bottom:1px solid #000;"></span></span>
          <span style="font-size:12px;">复核：<span style="display:inline-block;vertical-align:bottom;width:50px;font-size:12px;border-bottom:1px solid #000;"></span></span>
          <span style="font-size:12px;">静滴：<span style="display:inline-block;vertical-align:bottom;width:50px;font-size:12px;border-bottom:1px solid #000;"></span></span>
        </div>
        <div style="display:flex;justify-content:space-around;margin-top:6px;">
          <div style="font-size:14px;">座位号：<span style="font-size:18px;">{{infPqInfo.zwh}}</span></div>
          <div style="font-size:14px;">
            共<span style="font-size:18px;">{{Object.keys(infPqInfo.maps).length}}</span>袋，
            第<span style="font-size:18px;">{{index1+1}}</span>袋
          </div>
        </div>
        <div style="display:flex;justify-content:space-around;margin-top:6px;">
          <div style="font-size:14px;">卡号：<span style="">{{infPqInfo.jzkh}}</span></div>
          <div style="font-size:14px;">{{infPqInfo.djsj}}</div>
        </div>
      </div>
    </div>
    <!-- 巡回单 -->
    <div id="infXhd" style="width:700px;height:700px;padding:10px;border:1px solid #ccc;">
      <table id="infXhd1" border="1" width="100%" style="border-collapse:collapse;">
        <thead style="font-size:12px;">
          <tr>
            <th rowspan="2">时间</th>
            <th rowspan="2" style="width:40%">补液名称</th>
            <th rowspan="2">毫升/小时</th>
            <th colspan="5">滴速(滴/分)</th>
            <th colspan="2">通畅</th>
            <th rowspan="2" style="width:10%">签名</th>
          </tr>
          <tr>
            <th style="font-weight:normal;">&lt;50</th>
            <th style="font-weight:normal;">50-60</th>
            <th style="font-weight:normal;">61-70</th>
            <th style="font-weight:normal;">70-80</th>
            <th style="font-weight:normal;">&gt;80</th>
            <th style="font-weight:normal;">是</th>
            <th style="font-weight:normal;">否</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value,key,index1) in infPqInfo.maps" :key="key">
            <td></td> <!-- 时间 -->
            <td>
              <table width="100%" cellpadding="4">
                <tr v-for="(item, index2) in value" :key="index2">
                  <td style="width:80%;font-size:12px;">{{item.ypmc}}</td>
                  <td style="font-size:12px;text-align:right;">{{item.ypjl}}{{item.jldw}}</td>
                </tr>
              </table>
            </td>
            <td></td> <!-- 毫升每小时 -->
            <td v-for="(item, index) in 5" :key="index"></td> <!-- 滴速 -->
            <td v-for="(item, index) in 2" :key="index+5"></td> <!-- 通畅 -->
            <td></td> <!-- 签名 -->
          </tr>
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>

    <!-- 护理评估单 -->
    <div id="hlpgd" style="width:700px;height:700px;padding:10px;border:1px solid #ccc;">
      <table id="hlpgd1" border="1" width="100%" cellpadding="4" style="border-collapse:collapse;">
        <tr>
          <td width="20%">时间</td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td>T（℃）</td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td>P（次/分）</td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td>R（次/分）</td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td>BP（mmHg）</td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td>神志</td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td>疼痛评分</td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td>跌倒评分</td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td>输液宣教</td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td>病情变化</td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td>护士签名</td><td></td><td></td><td></td><td></td><td></td>
        </tr>
      </table>
      <div id="hlpgd2" style="font-size:13px;">
        <div><span style="letter-spacing:2em;">神</span>志：A 清醒　B 嗜睡：加强看护，重点观察　C 其他</div>
        <div>疼痛评分：使用疼痛评分尺或表情量表</div>
        <div style="display:flex;">
          <div style="white-space:nowrap;">跌倒评估：</div>
          <div style="width:100%;">
            <div>1.最近3个月内有无跌倒记录：<input type="checkbox"/>无=0　<input type="checkbox"/>有=25</div>
            <div>2.超过一个医学诊断：<input type="checkbox"/>无=0　<input type="checkbox"/>有=15</div>
            <div style="display:flex;">
              <div style="white-space:nowrap;">3.行走辅助：</div>
              <div>
                <div><input type="checkbox"/>没有、卧床、坐轮椅、护士扶持=0</div>
                <div><input type="checkbox"/>拐杖、手杖、助行器、学步车=15</div>
                <div><input type="checkbox"/>扶家具行走=30</div>
              </div>
            </div>
            <div>4.静脉输液：<input type="checkbox"/>无=0　<input type="checkbox"/>有=20</div>
            <div style="display:flex;">
              <div style="white-space:nowrap;">5.<span style="letter-spacing:2em;">步</span>态：</div>
              <div>
                <div><input type="checkbox"/>正常、卧床休息、轮椅代步=0</div>
                <div><input type="checkbox"/>虚弱、乏力、体位性低血压=15</div>
                <div><input type="checkbox"/>失调及不平衡=2</div>
              </div>
            </div>
            <div style="display:flex;">
              <div style="white-space:nowrap;">6.精神状态：</div>
              <div>
                <div><input type="checkbox"/>正确的自我认知=0</div>
                <div><input type="checkbox"/>自我认知不正确/忘记（意识障碍、躁动不安、沟通障碍、睡眠障碍）=15</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <input type="checkbox"/>低风险：0-24分
          <input type="checkbox"/>中风险：25-45分
          <input type="checkbox"/>高风险：≥46分
        </div>
        <div>
          单项高危：
          <input type="checkbox"/>新生儿
          <input type="checkbox"/>≤36月龄的婴幼儿
          <input type="checkbox"/>孕妇
          <input type="checkbox"/>年龄≥80岁的老人
          <input type="checkbox"/>躁动不安
          <input type="checkbox"/>双目失明
          <input type="checkbox"/>近一个月内有跌倒史
          <input type="checkbox"/>步态不稳
        </div>
        <div>宣教：输液宣教落实打“✔”</div>
        <div>病情变化：A 无 B 有</div>
        <div>注：对患者输液前、后进行评估，输液过程中有病情变化及时告知医生，采取相应的护理措施。</div>
      </div>
    </div>

    <table id="table" style="display:none;position:absolute;bottom:0;width:100%">
      <thead>
        <tr><th>表头</th><th>表头</th></tr>
      </thead>
      <tbody>
        <tr v-for="item in 20">
          <td style="border:1px solid">{{item}}</td><td style="border:1px solid">{{item+1}}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" tindex="1">
            <span tdata="SubSum">本页合计#，</span>
            <span tdata="AllSum">总计#，</span>
            <span tdata="pageNo">第#页，</span>
            <span tdata="PageCount">共#页</span>
            
          </td>
        </tr>
      </tfoot>
    </table>
    <!-- <pre>{{timers}}</pre> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import {
  aQueryUnregistList, aQueryRegistList, aStartShuYe, aUpdateSyZt, aPrintSyptdy,doPrintSyptdyByYpxhList
} from '@/api/his/inject/infusion/infusionReg.ts'
import infRegDialog from './components/infRegDialog.vue'
import infSheet from './components/infSheet.vue'
import { groupColor } from '@/views/his/inject/untils.ts'
import { getLodop } from '@/plugins/lodop/index.js'
import { rightScroll, msecToHms } from '@/utils/index.ts'
import { getNow } from '@/api/his/basic'
import { set } from 'vue/types/umd'


@Component({
  name: 'InfusionMedication',
  filters: {},
  components: {
    infRegDialog,
    infSheet
  },
})
export default class extends Vue {
  private searchData: any = {
    ksdm: '',
    kslb: 1,
    zt: ['0','1'] // 0未开始，1输液中，2输液完成
  }
  //   登记
  private diolag: boolean = false
  private tableData1: Array<any> = []
  private tableData2: any[] = []
  private curRow: any = {}
  private listSlotHeight1: number = 0 //列表高度
  private listSlotHeight2: number = 0 //列表高度
  private forms: any = {
    roomName: '',
    roomAddr: '',
    orderNo: '',
    hospitalId: 0,
    roomId: 0,
    enable: 1,
  }
  private listQuery: any = {
    pageNum: 1,
    pageSize: 10,
    parentMenuId: 0,
  }
  private title: string = ''
  private ksdm: any = Vue.prototype.AUTHORITY.bussinessRole // 当前输液科室
  private genderList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.SEX_DICT : this.$store.state.webSqlDict.SEX_DICT // 性别
  private ypcdList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_DRUGMADEIN_DICT : this.$store.state.webSqlDict.DRUG_DRUGMADEIN_DICT // 药品产地
  private docList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT // 医生列表
  private deptList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.OUTPATIENT_DEPARTMENT : this.$store.state.webSqlDict.OUTPATIENT_DEPARTMENT // 门诊科室
  private infusionWalyList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_METHOD_DICT : this.$store.state.webSqlDict.DRUG_METHOD_DICT // 发药方式（给药途径）
  private usersList: any[] = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.USERS_DICT : this.$store.state.webSqlDict.USERS_DICT // 用户列表
  private infPqInfo: any = {} // 瓶签内容
  private jgName: any = JSON.parse(localStorage.userInfo).hospitalName
  private now: number = 0 // 当前时间戳
  private timers: any = {} // 列表内所有计时器
  private selectionData:any =[]

  @Watch('tableData1')
  private onValueChange(value: string) {
    rightScroll()
  }

  // 时间差（毫秒数）转时分秒
	private useMsecToHms(msec: number){
    return msecToHms(msec)
    // return msec+10
  }

  // 获取当前时间
  // 每次刷新列表前都先修正当前时间
  private getNow() {
    getNow().then((res: any) => {
      if (res) {
        this.now = res.data
        this.getLists()
      }
    })
  }

  // 打印表格
  printTable(){
    const __qiankun__ = window.__POWERED_BY_QIANKUN__
    let LODOP: any = null
    if (__qiankun__) {
      console.log('主项目')
      LODOP = Vue.prototype.$getLodop()
    } else {
      console.log('子项目')
      LODOP = getLodop()
    }
    LODOP.PRINT_INIT()
    LODOP.SET_PRINT_PAGESIZE(1, "100mm", "140mm", "")
    // let table: any = this.$refs['el-table']
    // console.log('表格');
    // console.log(table.$el);
    // LODOP.ADD_PRINT_TABLE(10,10,300,100,table.$el.outerHTML)
    // let tbody = document.getElementsByClassName("el-table__body")[0]
    // LODOP.ADD_PRINT_TABLE(50,10,300,"100%",tbody.outerHTML)
    let table: any = document.getElementById("table")
    LODOP.ADD_PRINT_TABLE(50,10,300,"100%",table.outerHTML)
    LODOP.PREVIEW()
  }

  // 获取表格1
  private getLists(){
    const table1: any = this.$refs.pageTable
    table1.getList()
    this.curRow = {}
    // 清空右侧表格
    this.tableData2 = []
  }

  // 计算实际时长
  private calcTimeDiff(){
    console.log('开始计算时长');
    this.tableData1.forEach((item: any)=>{
      if(item.zt == 1){ // 输液中
        this.$set(item, 'timeDiff', this.now - new Date(item.kssj).getTime())
        this.$set(this.timers, item.djdh, setInterval(()=>{
          item.timeDiff+=1000
        }, 1000))
      }
      if(item.zt == 2){ // 输液完
        this.$set(item, 'timeDiff', new Date(item.wcsj).getTime() - new Date(item.kssj).getTime())
      }
    })
  }

  // 改变搜索状态
  private changQueryZt(value: any){
    this.getNow()
    // this.getLists()
  }

  // 查看详情
  private getDetail(row: any){
    this.curRow = row
    aQueryRegistList({djdh: row.djdh, ksdm: this.ksdm}).then((res: any) => {
      if(res){
        this.tableData2 = res.data
        this.tableData2 = groupColor(this.tableData2)
      }
    })
  }

  // 点击勾选框时触发
  private tableSelect(selection: any, row: any){
    this.getDetail(row)
  }

  // 输液开始
  private confirmStart(row: any){
    aStartShuYe({djdhs: row.djdh}).then((res: any) => {
      if(res){
        this.$notify({
          title: '输液已开始',
          message: '',
          type: 'success'
        })
        this.getNow()
      }
    })
  }

  // 输液完成
  private confirmEnd(row: any){
    aUpdateSyZt({djdhs: row.djdh}).then((res: any) => {
      if(res){
        this.$notify({
          title: '输液已完成',
          message: '',
          type: 'success'
        })
        this.getNow()
        clearInterval(this.timers[row.djdh.djdh])
      }
    })
  }

  //   登记打开弹窗
  private openDiolag() {
    const rd: any = this.$refs.infRegDialog
    rd.open()
  }

  private openInfusionSheet() {
    ;(this.$refs.infSheet as any).open()
  }

  
  private handleChange(val: any) {
    console.log(val)
  }
  private printPt(){
    if(!this.selectionData.length){
      this.$notify({
        title: '请选择瓶贴信息',
        message: '',
        type: 'warning'
      })
      return false
    }
    let ypxhList:any = []
    let cfsbList:any = []
    this.selectionData.map((item:any)=>{
      ypxhList.push(item.ypxh)
      cfsbList.push(item.cfhm)
    })
    let params = {
      cfsbList:[...new Set(cfsbList)],
      djdh:this.curRow.djdh,
      ksdm:this.ksdm,
      kslb:this.curRow.kslb,
      ypxhList:ypxhList
    }
    doPrintSyptdyByYpxhList(params).then((res:any)=>{
      this.infPqInfo = res.data
        this.$nextTick(()=>{
          const __qiankun__ = window.__POWERED_BY_QIANKUN__
          let LODOP: any = null
          if (__qiankun__) {
            console.log('主项目')
            LODOP = Vue.prototype.$getLodop()
          } else {
            console.log('子项目')
            LODOP = getLodop()
          }

          let a = LODOP.PRINT_INIT('打印输液瓶签')
          console.log('开始打印输液瓶签',a);
          LODOP.SET_PRINT_PAGESIZE(1, "80mm", "90mm", "")
          // LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true)
          // LODOP.SET_PRINT_MODE('FULL_HEIGHT_FOR_OVERFLOW', true)
          for(let i in this.infPqInfo.maps){
            const infPq: any = document.getElementById('infPq'+i)
            LODOP.ADD_PRINT_HTM("4mm", "4mm", "RightMargin:4mm", "BottomMargin:4mm", infPq.innerHTML)
            LODOP.ADD_PRINT_BARCODE("11mm","54mm","26mm","7mm","128Auto",this.infPqInfo.maps[i][0].sytm)
            LODOP.SET_PRINT_STYLEA(0,"FontSize",6)
            LODOP.NEWPAGE()
          }
          // LODOP.PRINT_SETUP()
          LODOP.PREVIEW() //预览
          // LODOP.PRINT()
        })
    })  
  }
  // 设置索引
  private tableRowClassName({ row, rowIndex }: any) {
    row.index = rowIndex
  }
  // 勾选
  private selectRow(selection: any, row: any){
    // 获取当前行是否选中（点击复选框后）
    let rowIndex = selection.findIndex((item: any)=>{
      return item.index==row.index
    })
    const table: any = this.$refs.table
    this.tableData2.forEach((item)=>{
      if(item.cfhm==row.cfhm&&item.cfzh==row.cfzh){
        this.$nextTick(()=>{
          table.toggleRowSelection(item,rowIndex>-1 ? true : false )
        })
      }
    })
  }
  private getSelectionData(selection: any){
    this.selectionData = selection
  }
  private handleClose() {}

  // 登记完成后
  private registered(djdh: any){
    console.log('登记单号', djdh);
    this.getLists()
    // this.printInfSheet(djdh)
    // this.printInfXhd(djdh)
    // this.printHlpgd(djdh)
  }

  // 打印
  private print(command: any){
    console.log('command', command, typeof(command))
    if(command[0] == 1){
      this.printInfSheet(command[1])
    }
    if(command[0] == 2){
      this.printInfXhd(command[1])
    }
    if(command[0] == 3){
      this.printHlpgd(command[1])
    }
  }

  // 打印输液瓶签
  private printInfSheet(djdh: any) {
    let params = {
      djdh: djdh,
      ksdm: this.ksdm,
      kslb: 1
    }
    aPrintSyptdy(params).then((res: any) => {
      if(res){
        this.infPqInfo = res.data
        this.$nextTick(()=>{

          const __qiankun__ = window.__POWERED_BY_QIANKUN__
          let LODOP: any = null
          if (__qiankun__) {
            console.log('主项目')
            LODOP = Vue.prototype.$getLodop()
          } else {
            console.log('子项目')
            LODOP = getLodop()
          }

          let a = LODOP.PRINT_INIT('打印输液瓶签')
          console.log('开始打印输液瓶签',a);
          LODOP.SET_PRINT_PAGESIZE(1, "80mm", "90mm", "")
          // LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true)
          // LODOP.SET_PRINT_MODE('FULL_HEIGHT_FOR_OVERFLOW', true)
          for(let i in this.infPqInfo.maps){
            const infPq: any = document.getElementById('infPq'+i)
            LODOP.ADD_PRINT_HTM("4mm", "4mm", "RightMargin:4mm", "BottomMargin:4mm", infPq.innerHTML)
            LODOP.ADD_PRINT_BARCODE("11mm","54mm","26mm","7mm","128Auto",this.infPqInfo.maps[i][0].sytm)
            LODOP.SET_PRINT_STYLEA(0,"FontSize",6)
            LODOP.NEWPAGE()
          }
          // LODOP.PRINT_SETUP()
          LODOP.PREVIEW() //预览
          // LODOP.PRINT()
        })
        
      }
    })
    
  }

  // 打印巡回单
  private printInfXhd(djdh: any){
    let params = {
      djdh: djdh,
      ksdm: this.ksdm,
      kslb: 1
    }
    aPrintSyptdy(params).then((res: any) => {
      if(res){
        this.infPqInfo = res.data
        this.$nextTick(()=>{

          const __qiankun__ = window.__POWERED_BY_QIANKUN__
          let LODOP: any = null
          if (__qiankun__) {
            console.log('主项目')
            LODOP = Vue.prototype.$getLodop()
          } else {
            console.log('子项目')
            LODOP = getLodop()
          }
          
          let a = LODOP.PRINT_INIT('打印输液巡回单')
          console.log('开始打印输液巡回单',a)
          LODOP.SET_PRINT_PAGESIZE(1,0,0,"B5 (JIS)")
          // LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true)
          // LODOP.SET_PRINT_MODE('FULL_HEIGHT_FOR_OVERFLOW', true)
          // LODOP.ADD_PRINT_TEXT("12mm","16mm","70mm","8mm",this.jgName) // 机构名称
          LODOP.ADD_PRINT_IMAGE("12mm","16mm","70mm","30mm",`<img src=${require("@/assets/main-img/logo.png")} style="width:100%"/>`) // 机构logo
          LODOP.SET_PRINT_STYLEA(0,'FontSize',12)
          LODOP.ADD_PRINT_TEXT("22mm","100mm","34mm","6mm","HL-BD-0023-001")
          LODOP. ADD_PRINT_LINE('28mm','10mm','28mm','166mm',0,1)
          LODOP.ADD_PRINT_TEXT("34mm","13mm","20mm","6mm","姓名：")
          LODOP.ADD_PRINT_TEXT("34mm","40mm","20mm","6mm","性别：")
          LODOP.ADD_PRINT_TEXT("34mm","66mm","20mm","6mm","出生日期：")
          LODOP.ADD_PRINT_TEXT("34mm","104mm","20mm","6mm","年龄：")
          LODOP.ADD_PRINT_TEXT("34mm","130mm","20mm","6mm","日期：")
          LODOP.SET_PRINT_STYLE("Bold",1) // 加粗
          LODOP.ADD_PRINT_TEXT("34mm","22mm","20mm","6mm",this.infPqInfo.brxm)
          LODOP.ADD_PRINT_TEXT("34mm","50mm","20mm","6mm",this.infPqInfo.brxb==1?'男':'女')
          LODOP.ADD_PRINT_TEXT("34mm","82mm","22mm","6mm",this.infPqInfo.csnyStr)
          LODOP.ADD_PRINT_TEXT("34mm","114mm","20mm","6mm",this.infPqInfo.ages)
          LODOP.ADD_PRINT_TEXT("34mm","140mm","22mm","6mm",this.infPqInfo.djsj.substr(0,10))
          // 表格
          let xhd: any = document.getElementById("infXhd")
          let xhdTable: any = xhd.getElementsByTagName("table")[0]
          LODOP.ADD_PRINT_TABLE("42mm","6mm", "RightMargin:6mm","100%",xhdTable.outerHTML)
          LODOP.SET_PRINT_STYLE("Bold",0) // 不加粗
          // 页脚
          LODOP.ADD_PRINT_TEXT("230mm","13mm","20mm","6mm","穿刺次数：")
          LODOP.ADD_PRINT_TEXT("230mm","40mm","20mm","6mm","输液结束：")
          LODOP.ADD_PRINT_TEXT("230mm","66mm","50mm","6mm","年   月   日   时   分")
          LODOP.ADD_PRINT_TEXT("230mm","110mm","20mm","6mm","签名：")


          LODOP.PREVIEW()
          // LODOP.PRINT()
          // LODOP.PRINT_DESIGN()
        })
        
      }
    })
  }

  // 打印护理评估单
  private printHlpgd(djdh: any){
    let params = {
      djdh: djdh,
      ksdm: this.ksdm,
      kslb: 1
    }
    aPrintSyptdy(params).then((res: any) => {
      if(res){
        this.infPqInfo = res.data
        this.$nextTick(()=>{

          const __qiankun__ = window.__POWERED_BY_QIANKUN__
          let LODOP: any = null
          if (__qiankun__) {
            console.log('主项目')
            LODOP = Vue.prototype.$getLodop()
          } else {
            console.log('子项目')
            LODOP = getLodop()
          }

          LODOP.PRINT_INIT('打印护理评估单')
          LODOP.SET_PRINT_PAGESIZE(1,0,0,"ISO B5")
          // LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true)
          // LODOP.SET_PRINT_MODE('FULL_HEIGHT_FOR_OVERFLOW', true)
          // LODOP.ADD_PRINT_TEXT("12mm","16mm","70mm","8mm",this.jgName)
          LODOP.ADD_PRINT_IMAGE("12mm","16mm","70mm","30mm",`<img src=${require("@/assets/main-img/logo.png")} style="width:100%"/>`) // 机构logo
          LODOP.SET_PRINT_STYLEA(0,'FontSize',12)
          LODOP.ADD_PRINT_TEXT("22mm","100mm","34mm","6mm","HL-BD-0023-001")
          LODOP. ADD_PRINT_LINE('28mm','10mm','28mm','166mm',0,1)
          LODOP.ADD_PRINT_TEXT("30mm","52mm","70mm","8mm","门急诊治疗区护理评估单");
          LODOP.SET_PRINT_STYLEA(0,'FontSize',14)
          LODOP.SET_PRINT_STYLEA(0,"Bold",1)
          LODOP.ADD_PRINT_TEXT("39mm","13mm","20mm","6mm","姓名：")
          LODOP.ADD_PRINT_TEXT("39mm","60mm","20mm","6mm","性别：")
          LODOP.ADD_PRINT_TEXT("39mm","102mm","20mm","6mm","出生日期：")
          LODOP.ADD_PRINT_TEXT("44mm","13mm","20mm","6mm","诊断：")
          LODOP.ADD_PRINT_TEXT("44mm","60mm","20mm","6mm","卡号：")
          LODOP.ADD_PRINT_TEXT("44mm","108mm","20mm","6mm","日期：")
          LODOP.ADD_PRINT_TEXT("49mm","13mm","22mm","6mm","药物过敏史：")
          LODOP.ADD_PRINT_RECT("49mm","32mm","3mm","3mm")
          LODOP.ADD_PRINT_TEXT("49mm","36mm","10mm","6mm","无")
          LODOP.ADD_PRINT_RECT("49mm","44mm","3mm","3mm")
          LODOP.ADD_PRINT_TEXT("49mm","48mm","10mm","6mm","有：")
          LODOP.ADD_PRINT_LINE("53mm","54mm","53mm","100mm",0,1)
          LODOP.ADD_PRINT_TEXT("49mm","108mm","20mm","6mm","科室：")
          LODOP.SET_PRINT_STYLE("Bold",1)
          LODOP.ADD_PRINT_TEXT("39mm","22mm","20mm","6mm",this.infPqInfo.brxm)
          LODOP.ADD_PRINT_TEXT("39mm","69mm","20mm","6mm",this.infPqInfo.brxb==1?'男':'女')
          LODOP.ADD_PRINT_TEXT("39mm","117mm","22mm","6mm",this.infPqInfo.csnyStr)
          LODOP.ADD_PRINT_TEXT("44mm","22mm","42mm","6mm",this.infPqInfo.brzd)
          LODOP.ADD_PRINT_TEXT("44mm","69mm","22mm","6mm",this.infPqInfo.jzkh)
          LODOP.ADD_PRINT_TEXT("44mm","117mm","22mm","6mm",this.infPqInfo.djsj.substr(0,10))
          for(let i in this.infPqInfo.maps){ // 获取科室名称
            let dept = this.deptList.find(item => item.dv==this.infPqInfo.maps[i][0].ksdm)
            if(dept){
              LODOP.ADD_PRINT_TEXT("49mm","117mm","22mm","6mm",dept.dn)
            }else{
              LODOP.ADD_PRINT_TEXT("49mm","117mm","22mm","6mm",this.infPqInfo.maps[i][0].ksdm)
            }
            break
          }
          // 表格
          LODOP.ADD_PRINT_TEXT("55mm","13mm","50mm","6mm","治疗前后护理评估")
          LODOP.SET_PRINT_STYLEA(0,'FontSize',12)
          let hlpgd: any = document.getElementById("hlpgd")
          let hlpgdTable: any = hlpgd.getElementsByTagName("table")[0]
          LODOP.ADD_PRINT_TABLE("60mm","10mm", "RightMargin:10mm","100%",hlpgdTable.outerHTML)
          let hlpgdText: any = document.getElementById("hlpgd2")
          LODOP.SET_PRINT_STYLEA(0,'FontSize',10)
          LODOP.ADD_PRINT_HTM("140mm", "10mm", "RightMargin:10mm", "BottomMargin:4mm", hlpgdText.outerHTML)


          LODOP.PREVIEW()
          // LODOP.PRINT()
          // LODOP.PRINT_DESIGN()
        })
        
      }
    })
  }

  created() {
    // 计算表格列表高度
    this.listSlotHeight1 = Vue.prototype.PageHeight * .6
    this.listSlotHeight2 = Vue.prototype.PageHeight * .4 - 20
  }

  mounted() {
    // this.judge()
    this.searchData.ksdm = this.ksdm
    this.getNow()
    // this.getLists()
  }
}
</script>

<style lang="scss" scoped>
.row {
  // margin-bottom: 0px;
}
.el-checkbox-group {
  display: flex;
  margin-left: 5px;
}
.el-checkbox__label {
  font-size: 13px !important;
  color: #222b31 !important;
}
.orangeBack,
.greenBack {
  height: 32px;
  opacity: 30%;
}

.greenBack {
  background: #0fcaad;
}
.orangeBack {
  background: #ffbf00;
}
::v-deep .el-table .el-table__expand-icon {
  display: none !important;
}
::v-deep .el-table__indent {
  padding-left: 0px !important;
}
::v-deep .el-table__placeholder {
  display: inline !important;
}

::v-deep .el-checkbox {
  margin-right: 10px;
}

// 打印
[id^=infPq]{
  position: absolute;
  z-index: -1;
  right: 20px;
  bottom: 20px;
  border: 1px solid;
  background: #fff;
}
#infXhd{
  position: absolute;
  z-index: -1;
  right: 20px;
  bottom: 20px;
  border: 1px solid;
  background: #fff;
  th,td{
    border: 1px solid #000;
  }
}
#hlpgd{
  position: absolute;
  z-index: -1;
  right: 20px;
  bottom: 20px;
  border: 1px solid;
  background: #fff;
  th,td{
    border: 1px solid #000;
  }
}
pre{
  position: absolute;
  left: 0;
  bottom: 0;
  font-size: 12px;
  background: rgba($color: #fff, $alpha: .5);
}
.label{
  justify-content: space-between;
    ::v-deep.el-checkbox__label{
        padding-left: 4px;
    }
}
.lables{
  display: flex;
  width:100%;
  justify-content: space-between;
  .pl200{
    // padding-right:200px;
  }
}
</style>
