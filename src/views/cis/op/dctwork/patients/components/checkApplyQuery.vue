<template>
  <div class="his-module his-small check hide-scroll his-query">
    <div class="row" slot="header">
      <div class="label">
        <div class="querySearch">
          <div class="searchTitle no-warp">申请日期</div>
          <el-date-picker v-model="value" type="daterange" class="date-wrapper" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" @keydown.enter.native="changeDate" @change="changeDate"></el-date-picker>
        </div>
        <div class="btn">
          <el-divider direction="vertical"></el-divider>
          <!-- 查询 -->
          <el-button @click="getList">
            <i class="his-caozuo_search icon"></i>
            {{ $t('查询') }}
          </el-button>
          <!-- 打印 -->
          <el-button @click="handlePrint" :disabled='isClickRow'>
            <i class="his-btn-print icon"></i>
            {{ $t('common.print') }}
          </el-button>
        </div>
      </div>
    </div>
    <pagenation-list ref="pageTable" v-model="mockDatas" data-url="/op-service/cisjcsq01/queryPage" http-method="post" :searchData="searchData" :list-height="listSlotHeight - 200">
      <el-table :data="tableFormat" border :fit="true" stripe :highlight-current-row="true" slot="list" :height="listSlotHeight - 220" class="scroll-bar" tooltip-effect="light" @row-click="selectPrint" @row-dblclick="queryCheckApply">
        <el-table-column prop="webSortNumber" width="32"></el-table-column>
        <el-table-column prop="brxm" label="病人姓名" width="70" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mzhm" label="门诊号码" width="70"></el-table-column>
        <el-table-column prop="jcxm" show-overflow-tooltip label="检查项目"></el-table-column>
        <el-table-column prop="jcfy" label="检查费用" class-name="text-blue-td" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.jcfy">{{ scope.row.jcfy.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="jcbw" label="检查部位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sqsj" label="申请时间" width="140" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="yyrq" label="预约日期">
          <template slot-scope="scope">
            <span>{{ scope.row.yyrq | dateYMD }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="yysj" label="预约时间" width="140"></el-table-column>
        <el-table-column prop="jcztName" label="检查状态"></el-table-column>
      </el-table>
    </pagenation-list>
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
            <div style="display: flex; justify-content: center; text-align: center; height: 20px; margin-bottom: 5px">
              <p style="margin: 0; width: 28px; font-size: 13px">姓名</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 65px; text-align: center; font-size: 13px">{{ blPrintData.hzxm }}</p>
              <p style="margin: 0; width: 56px; font-size: 13px">出生日期</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 33px; padding-left: 1px; text-ailgn: center; font-size: 13px">{{ blPrintData.csrq_y }}</p>
              <p style="margin: 0; font-size: 13px">年</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 18px; padding-left: 1px; text-ailgn: center; font-size: 13px">{{ blPrintData.csrq_m }}</p>
              <p style="margin: 0; font-size: 13px">月</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 18px; padding-left: 1px; text-ailgn: center; font-size: 13px">{{ blPrintData.csrq_d }}</p>
              <p style="margin: 0; font-size: 13px">日</p>
              <p style="margin: 0; width: 28px; font-size: 13px; margin-left: 3px">性别</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 23px; text-ailgn: center; font-size: 13px">{{ blPrintData.xb == 1 ? '男' : '女' }}</p>
              <p style="margin: 0; width: 28px; font-size: 13px">年龄</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 33px; text-ailgn: center; font-size: 13px">{{ blPrintData.nl }}</p>
              <p style="margin: 0; width: 28px; font-size: 13px">科室</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 65px; text-ailgn: center; font-size: 13px">{{ blPrintData.ksmc }}</p>
              <p style="margin: 0; width: 28px; font-size: 13px">病区</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 65px; text-ailgn: center; font-size: 13px"></p>
              <p style="margin: 0; width: 28px; font-size: 13px">床号</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 25px; text-ailgn: center; font-size: 13px"></p>
              <p style="margin: 0; font-size: 12px; width: 96px">门诊号或住院号</p>
              <p style="margin: 0; border-bottom: 1px solid #000; width: 90px; text-ailgn: center; font-size: 13px">{{ blPrintData.mzh }}</p>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px">
              <div style="display: flex">
                <p style="font-size: 13px; margin: 0">联单号：</p>
                <p style="border-bottom: 1px solid #000; width: 120px; text-ailgn: center; font-size: 13px; margin: 0">{{ blPrintData.ldh }}</p>
              </div>
              <div style="display: flex">
                <p style="font-size: 13px; margin: 0">病理号：</p>
                <p style="border-bottom: 1px solid #000; width: 225px; text-ailgn: center; font-size: 13px; margin: 0">{{ blPrintData.blh }}</p>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px">
              <div style="display: flex">
                <p style="font-size: 13px; margin: 0">通讯地址：</p>
                <p style="font-size: 13px; border-bottom: 1px solid #000; width: 405px; text-ailgn: center; margin: 0">{{ blPrintData.txdz }}</p>
              </div>
              <div style="display: flex">
                <p style="font-size: 13px; margin: 0">联系电话：</p>
                <p style="font-size: 13px; border-bottom: 1px solid #000; width: 211px; text-ailgn: center; margin: 0">{{ blPrintData.lxdh }}</p>
              </div>
            </div>
          </div>
        </div>
        <div style="margin: 3px auto">
          <table border="1" cellpadding="0" style="border-collapse: collapse; border: 1px solid #000; width: 100%">
            <tr style="width: 100%">
              <td style="font-size: 13px; height: 160px; width: auto; border: 1px solid #000; position: relative" colspan="4">
                <p style="position: absolute; top: 3px; left: 5px; margin: 0">病史摘要（包括重要病史、临床症状、药物治疗、影像学检查、实验室检查等）：</p>
                <p style="position: absolute; top: 25px; left: 5px; margin: 0">{{ blPrintData.bszy }}</p>
                <p style="position: absolute; bottom: 20px; left: 5px; margin: 0">手术所见：</p>
                <p style="position: absolute; top: 80px; left: 5px; margin: 0">{{ blPrintData.sssj }}</p>
              </td>
            </tr>
            <tr style="width: 100%; font-size: 13px">
              <td style="font-size: 13px; border: 1px solid #000; height: 20px; padding-left: 5px" colspan="4">临床诊断：{{ blPrintData.lczd }}</td>
            </tr>
            <tr style="height: 20px; width: 100%; font-size: 13px">
              <td style="border: 1px solid #000; width: 125px; padding-left: 5px">送检标本</td>
              <td style="border: 1px solid #000; width: 200px; padding-left: 5px">采取部位</td>
              <td style="border: 1px solid #000; width: 200px; padding-left: 5px">标本名称</td>
              <td style="border: 1px solid #000; width: auto; padding-left: 5px">曾在何处做过病理检查</td>
            </tr>
            <tr style="height: 20px; width: 100%; font-size: 13px">
              <td style="border: 1px solid #000; width: 125px; padding-left: 5px">{{ blPrintData.bbList && blPrintData.bbList[0] ? blPrintData.bbList[0].sjbb : '' }}</td>
              <td style="border: 1px solid #000; width: 200px; padding-left: 5px">{{ blPrintData.bbList && blPrintData.bbList[0] ? blPrintData.bbList[0].cqbw : '' }}</td>
              <td style="border: 1px solid #000; width: 200px; padding-left: 5px">{{ blPrintData.bbList && blPrintData.bbList[0] ? blPrintData.bbList[0].bbmc : '' }}</td>
              <td style="border: 1px solid #000; width: auto; padding-left: 5px" rowspan="4">
                <div style="display: flex; height: 20px">
                  <p style="font-size: 13px; width: 60px; margin: 0">检查日期</p>
                  <p style="border-bottom: 1px solid #000; width: 100px; padding-bottom: 2px; margin: 0">{{ blPrintData.jcrq }}</p>
                  <p style="font-size: 13px; width: 50px; margin: 0">病理号</p>
                  <p style="border-bottom: 1px solid #000; width: 108px; padding-bottom: 2px; margin: 0">{{ blPrintData.jcblh }}</p>
                </div>
                <div style="display: flex; height: 20px">
                  <p style="margin: 0">检查医院</p>
                  <p style="border-bottom: 1px solid #000; width: 265px; padding-left: 5px; padding-bottom: 2px; margin: 0">{{ blPrintData.jcyy }}</p>
                </div>
                <div style="display: flex; height: 20px">
                  <p style="margin: 0">诊断</p>
                  <p style="border-bottom: 1px solid #000; width: 291px; padding-left: 5px; padding-bottom: 2px; margin: 0">{{ blPrintData.jczd }}</p>
                </div>
              </td>
            </tr>
            <tr style="height: 20px; width: 100%; font-size: 13px">
              <td style="border: 1px solid #000; padding-left: 5px">{{ blPrintData.bbList && blPrintData.bbList[1] ? blPrintData.bbList[1].sjbb : '' }}</td>
              <td style="border: 1px solid #000; padding-left: 5px">{{ blPrintData.bbList && blPrintData.bbList[1] ? blPrintData.bbList[1].cqbw : '' }}</td>
              <td style="border: 1px solid #000; padding-left: 5px">{{ blPrintData.bbList && blPrintData.bbList[1] ? blPrintData.bbList[1].bbmc : '' }}</td>
            </tr>
            <tr style="height: 20px; width: 100%; font-size: 13px">
              <td style="border: 1px solid #000; padding-left: 5px">{{ blPrintData.bbList && blPrintData.bbList[2] ? blPrintData.bbList[2].sjbb : '' }}</td>
              <td style="border: 1px solid #000; padding-left: 5px">{{ blPrintData.bbList && blPrintData.bbList[2] ? blPrintData.bbList[2].cqbw : '' }}</td>
              <td style="border: 1px solid #000; padding-left: 5px">{{ blPrintData.bbList && blPrintData.bbList[2] ? blPrintData.bbList[2].bbmc : '' }}</td>
            </tr>
            <tr style="height: 20px; width: 100%; font-size: 13px">
              <td style="border: 1px solid #000; padding-left: 5px">{{ blPrintData.bbList && blPrintData.bbList[3] ? blPrintData.bbList[3].sjbb : '' }}</td>
              <td style="border: 1px solid #000; padding-left: 5px">{{ blPrintData.bbList && blPrintData.bbList[3] ? blPrintData.bbList[3].cqbw : '' }}</td>
              <td style="border: 1px solid #000; padding-left: 5px">{{ blPrintData.bbList && blPrintData.bbList[3] ? blPrintData.bbList[3].bbmc : '' }}</td>
            </tr>
            <tr style="height: 20px; width: 100%; font-size: 13px">
              <td style="border: 1px solid #000; padding-left: 5px">{{ blPrintData.bbList && blPrintData.bbList[4] ? blPrintData.bbList[4].sjbb : '' }}</td>
              <td style="border: 1px solid #000; padding-left: 5px">{{ blPrintData.bbList && blPrintData.bbList[4] ? blPrintData.bbList[4].cqbw : '' }}</td>
              <td style="border: 1px solid #000; padding-left: 5px">{{ blPrintData.bbList && blPrintData.bbList[4] ? blPrintData.bbList[4].bbmc : '' }}</td>
              <td style="border: 1px solid #000; padding-left: 5px"></td>
            </tr>
            <tr>
              <td colspan="4" style="height: 20px; border: 1px solid #000; font-size: 13px; padding-left: 5px">检查项目</td>
            </tr>
            <tr>
              <td colspan="4" style="height: 190px; border: 1px solid #000; font-size: 13px; position: relative; padding-left: 5px; padding-top: 5px">
                <span style="height: 190px; width: 50%; border-right: 1px solid #000; display: inline-block; position: absolute; top: 0"
                  ><p v-for="(item, index) in jcxmArrl" :key="index" style="">{{ index + 1 }}、{{ item.xmmc }}</p></span
                >
                <span style="height: 190px; width: 50%; display: inline-block; position: absolute; top: 0; left: 50%; padding-left: 9px"
                  ><p v-for="(item, index) in jcxmArr2" :key="index" style="">{{ index + 7 }}、{{ item.xmmc }}</p></span
                >
              </td>
            </tr>
            <tr style="height: auto">
              <td colspan="4" style="height: 130px; padding-left: 5px; padding-top: 5px">
                <p style="font-size: 13px; margin-bottom: 5px">（若系妇科标本，请填写下来各项）：</p>
                <div style="display: flex; justify-content: left; margin-bottom: 5px; margin-left: 5px; height: 20px">
                  <p style="font-size: 13px; margin: 0">末次月经日期</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 160px; padding-left: 3px; margin: 0">{{ blPrintData.mcyjrq }}</p>
                  <p style="font-size: 13px; margin: 0">经量</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 160px; padding-left: 3px; margin: 0">{{ blPrintData.jl }}</p>
                  <p style="font-size: 13px; margin: 0">周期及持续时间</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 160px; padding-left: 3px; margin: 0">{{ blPrintData.zqjcxsj }}</p>
                </div>
                <div style="display: flex; justify-content: left; margin-bottom: 5px; margin-left: 5px; height: 20px">
                  <p style="font-size: 13px; margin: 0">有否质量（内分泌）</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 121px; margin: 0">{{ blPrintData.yfzl == 1 ? '是' : '否' }}</p>
                  <p style="font-size: 13px; margin: 0">日期</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 161px; padding-left: 3px; margin: 0">{{ blPrintData.nfmrq }}</p>
                  <p style="font-size: 13px; margin: 0">剂量及持续时间</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 160px; padding-left: 3px; margin: 0">{{ blPrintData.jljcxsj }}</p>
                </div>
                <div style="display: flex; justify-content: left; margin-bottom: 5px; margin-left: 5px; height: 20px">
                  <p style="font-size: 13px; margin: 0">刮宫日期</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px; padding-left: 3px; margin: 0">{{ blPrintData.ggrq_y }}</p>
                  <p style="font-size: 13px; margin: 0">年</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px; padding-left: 3px; margin: 0">{{ blPrintData.ggrq_m }}</p>
                  <p style="font-size: 13px; margin: 0">月</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px; padding-left: 3px; margin: 0">{{ blPrintData.ggrq_d }}</p>
                  <p style="font-size: 13px; margin: 0">日</p>
                </div>
                <div style="display: flex; justify-content: left; margin-bottom: 5px; margin-left: 5px; height: 20px">
                  <p style="font-size: 13px; margin: 0">送检日期</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px; padding-left: 3px; margin: 0">{{ blPrintData.sjrq_y }}</p>
                  <p style="font-size: 13px; margin: 0">年</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px; padding-left: 3px; margin: 0">{{ blPrintData.sjrq_m }}</p>
                  <p style="font-size: 13px; margin: 0">月</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px; padding-left: 3px; margin: 0">{{ blPrintData.sjrq_d }}</p>
                  <p style="font-size: 13px; margin: 0">日</p>
                </div>
                <div style="display: flex; justify-content: left; margin-left: 5px; margin-bottom: 5px; height: 20px">
                  <p style="font-size: 13px; margin: 0">送检医生</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px; padding-left: 3px; margin: 0">{{ blPrintData.sjys }}</p>
                  <p style="font-size: 13px; margin: 0">收到日期</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px; padding-left: 3px; margin: 0">{{ blPrintData.sdrq_y }}</p>
                  <p style="font-size: 13px; margin: 0">年</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px; padding-left: 3px; margin: 0">{{ blPrintData.sdrq_m }}</p>
                  <p style="font-size: 13px; margin: 0">月</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px; padding-left: 3px; margin: 0">{{ blPrintData.sdrq_d }}</p>
                  <p style="font-size: 13px; margin: 0">日</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px; padding-left: 3px; margin: 0">{{ blPrintData.sdrq_h }}</p>
                  <p style="font-size: 13px; margin: 0">时</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 60px; padding-left: 3px; margin: 0">{{ blPrintData.sdrq_mm }}</p>
                  <p style="font-size: 13px; margin: 0">分</p>
                  <p style="font-size: 13px; margin: 0 0 0 50px">签收人：</p>
                  <p style="font-size: 13px; border-bottom: 1px solid #000; width: 100px; margin: 0">{{ blPrintData.qsr }}</p>
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
                    <p style="border-bottom: 1px solid #000; width: 60px; padding-left: 3px; margin: 0">{{ blPrintData.hzxm }}</p>
                    <p style="margin: 0">出生日期:</p>
                    <p style="border-bottom: 1px solid #000; width: 90px; padding-left: 3px; margin: 0">{{ blPrintData.csrq }}</p>
                  </div>
                  <div style="display: flex; justify-content: left; font-size: 13px; height: 20px; margin-top: 5px; margin-left: 5px">
                    <p style="margin: 0">住院号或门诊号：</p>
                    <p style="border-bottom: 1px solid #000; width: 100px; margin: 0">{{ blPrintData.mzh }}</p>
                  </div>
                  <div style="display: flex; justify-content: left; font-size: 13px; height: 20px; margin-top: 5px; margin-left: 5px">
                    <p style="margin: 0">联单号：</p>
                    <p style="border-bottom: 1px solid #000; width: 120px; margin: 0">{{ blPrintData.ldh }}</p>
                  </div>
                </span>
                <span style="width: 33.33%; position: absolute; left: 66.66%; top: 0; font-size: 13px">
                  <div style="display: flex; justify-content: left; font-size: 13px; height: 20px; margin-top: 5px; margin-left: 5px">
                    <p style="margin: 0">姓名</p>
                    <p style="border-bottom: 1px solid #000; width: 60px; padding-left: 3px; margin: 0">{{ blPrintData.hzxm }}</p>
                    <p style="margin: 0">出生日期：</p>
                    <p style="border-bottom: 1px solid #000; width: 90px; padding-left: 3px; margin: 0">{{ blPrintData.csrq }}</p>
                  </div>
                  <div style="display: flex; justify-content: left; font-size: 13px; height: 20px; margin-top: 5px; margin-left: 5px">
                    <p style="margin: 0">住院号或门诊号：</p>
                    <p style="border-bottom: 1px solid #000; width: 100px; margin: 0">{{ blPrintData.mzh }}</p>
                  </div>
                  <div style="display: flex; justify-content: left; font-size: 13px; height: 20px; margin-top: 5px; margin-left: 5px">
                    <p style="margin: 0">联单号：</p>
                    <p style="border-bottom: 1px solid #000; width: 120px; margin: 0">{{ blPrintData.ldh }}</p>
                  </div>
                </span>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <!-- 检查申请单打印 -->
    <div id="jcsqd" style="width: 210mm; border: 1px solid  #000" v-show="false">
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

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { queryMsbrzd } from '@/api/cis/op/dctwork/patients'
import { id2Name, parseTime } from '@/utils'
import { getNow } from '@/api/his/basic'
import { getLodop } from '@/plugins/lodop/index.js'
import { queryBljcPrintData, queryJcsqPrintData, queryLogo} from '@/api/cis/op/dctwork/inspect'

@Component({
  name: 'checkApplyRepoQuery',
})
export default class extends Vue {
  @Prop({ required: true }) private pnParam!: any
  private value: Array<any> = []
  private mockDatas: Array<any> = []
  private isBljc: number = 0 // 判断是否为病理检查
  private blPrintData: any = {} // 病理申请打印数据
  private jcPrintData: Array<any> = [] // 检查申请打印 
  private jcxmArrl: Array<any> = [] // 检查项目左边数组数据
  private jcxmArr2: Array<any> = [] // 检查项目右边数组数据
  private jcxh: number = 0 // 获取打印数据接口的参数
  private loGo: any = '' // 医院logo
  private isClickRow: boolean = true // 打印按钮默认禁用
  private searchData: any = {
    pageNum: '1',
    pageSize: '20',
    sqlx: 1,
    jzxh: '',
    beginDate: '',
    endDate: '',
  }
  private listSlotHeight: number = 0
  private checkList: Array<any> = [] //检查状态
  get tableFormat() {
    const tabledata = this.mockDatas
    id2Name(tabledata, 'jczt', 'jcztName', this.checkList, 'dv', 'dn')
    return tabledata
  }

  // 获取机构信息
  get userInfo() {
    return JSON.parse(localStorage.userInfo)
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }

  mounted() {
    this.checkList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.CHECK_STATUS : this.$store.state.webSqlDict.CHECK_STATUS
    if (this.pnParam) {
      this.searchData.jzxh = this.pnParam.jzxh
    }
    this.getNow()
    this.queryPrintLogo()
  }

  // 获取当前时间
  private getNow() {
    getNow().then((res: any) => {
      if (res) {
        var date = parseTime(res.data, '{y}-{m}-{d}')
        this.value = [date, date]
        this.searchData.beginDate = this.value[0]
        this.searchData.endDate = this.value[1]
        this.getList()
      }
    })
  }

  // 获取查询列表
  private getList() {
    console.log('this.searchData', this.searchData)
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  private changeDate() {
    console.log('this.value', this.value)
    this.searchData.beginDate = parseTime(this.value[0], '{y}-{m}-{d}')
    this.searchData.endDate = parseTime(this.value[1], '{y}-{m}-{d}')
    this.getList()
  }

  /**
   * @Description: 跳转检查申请单页面
   * @author: zhml
   * @param {type}: id
   * @return: $emit
   * @date 2020/9/2
   */
  private queryCheckApply(val: any) {
    this.$emit('queryCheckApply', val)
  }

  // 选择打印项
  private selectPrint(row: any) {
    console.log('175', row)
    this.isClickRow = false // 选中行后打印按钮点亮
    this.isBljc = row.sfbljc
    this.jcxh = row.jcxh
  }

  // 打印检查申请单查询
  private handlePrint() {
    this.queryPrintLogo()
    if (this.isBljc == 1) {
      // queryBljcPrintData获取病理检查申请单打印的数据
      queryBljcPrintData(this.jcxh).then((res: any) => {
        if (res.errorCode == 'SUCCESS') {
          this.blPrintData = res.data
          console.log('1208', this.blPrintData)
          // 检查项目分左右组
          let jcxmArr0: Array<any> = this.blPrintData.jcxmList
          if (jcxmArr0.length > 6) {
            for (let i = 0; i < 6; i++) {
              this.jcxmArrl.push(jcxmArr0[i])
            }
            for (let j = 6; j < jcxmArr0.length; j++) {
              this.jcxmArr2.push(jcxmArr0[j])
            }
          } else {
            this.jcxmArrl = jcxmArr0
          }
          // 病理打印
          this.$nextTick(() => {
            this.printFn()
            this.isClickRow = true // 打印后打印按钮恢复禁用状态
          })
        }
      })
    } else {
      // alert('检查申请单待做中，病理已完成')
      queryJcsqPrintData(this.jcxh).then((ele: any)=> {
        if(ele.errorCode == "SUCCESS") {
          console.log('1487',ele)
          this.jcPrintData = ele.data
          this.$nextTick(()=> {
            this.printFn()
            this.isClickRow = true // 打印后打印按钮恢复禁用状态
          })
        }
      })
    }
  }

  // 获取医院logo
  private queryPrintLogo() {
    queryLogo(this.userInfo.hospitalId).then((res: any) => {
      this.loGo = res.data
      if(this.isBljc == 1) {
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
      LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true) //宽度超出自动缩放
      var a: any = document.getElementById('bljcd')
      var b: any = document.getElementById('jcsqd')
      var op:any = ''
      a.style.zoom=0.85 // 缩放页面，配合LODOP.SET_PRINT_MODE('FULL_WIDTH_FOR_OVERFLOW', true)使用
      if(this.isBljc == 1) {
        op = '<body>' + a.innerHTML + '</body>'
        LODOP.ADD_PRINT_HTM(0, '6mm', '180mm', '297mm', op) // 尾部
      } else {
        op = '<body>' + b.innerHTML + '</body>'
        LODOP.ADD_PRINT_HTM(0, '6mm', '210mm', '297mm', op) // 尾部
      }
      // LODOP.SET_PRINT_MODE('POS_BASEON_PAPER', true) // 以纸张边缘为基点
      LODOP.PREVIEW() // 预览
      // LODOP.PRINT() // 打印
      // LODOP.PRINT_DESIGN() // 设计
    }
  }
}
</script>

<style lang="scss" scoped>
.no-warp {
  white-space: nowrap;
}

.his-query.his-small {
  .row {
    padding-bottom: 8px;

    .no-warp {
      margin-top: 2px;
      font-family: siyuanMedium;
    }

    .btn .el-button {
      padding: 4px 5px;
    }
    .el-divider--vertical {
      margin: 0 10px;
    }
  }
  .row.label.searchTitle {
    padding-right: 10px !important;
  }
}

// 日期选择器
.row .label {
  .el-date-editor ::v-deep {
    width: 220px;
    height: 28px;
    border: none;
    background: $lightGray;

    .el-input__icon {
      line-height: 23px;
    }

    .el-range-input {
      background: none;
      width: 74px;
    }

    .el-range-separator {
      width: auto;
      line-height: 20px;
    }
  }

  .el-range-editor.el-input__inner ::v-deep {
    padding: 3px 0 3px 10px !important;
  }
}
</style>
