<!--
 * @Date: 2020-05-26 14:58:28
 * @LastEditors: zhml
 * @LastEditTime: 2020-05-28 11:08:39
 * @description: 检查报告
-->

<template>
  <div class="ht module">
    <el-row :gutter="10" class="ht">
      <el-col :span="8" class="ht">
        <div class="right-list his-module his-small ht">
          <el-table :data="tableFormat" border stripe :highlight-current-row="true" slot="list" fit @row-click="handleRowClick" :height="listSlotHeight + 30" class="scroll-bar">
            <!-- 序号 -->
            <el-table-column type="index" width="32" align="center"></el-table-column>
            <el-table-column prop="sqsj" width="80" align="center" label="申请日期">
              <template slot-scope="scope">
                <span>{{ getDate(scope.row.sqsj) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="yjlxmc" width="80" show-overflow-tooltip align="center" label="类型">
              <!--                <template slot-scope="scope">-->
              <!--                  <span>{{scope.row.medicalTechnologyType | filterType}}</span>-->
              <!--                </template>-->
            </el-table-column>
            <el-table-column prop="jcxm" min-width="110" align="center" label="检查项目">
              <template slot-scope="scope">
                <el-tooltip effect="light" :open-delay="0" placement="right-start">
                  <div slot="content" class="content check" style="height: auto;width: 200px; background: white; padding: 0">
                    {{scope.row.jcxm}}
                  </div>
                  <div class="text-ellipsis">{{ scope.row.jcxm }}</div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="jcbw" width="80" show-overflow-tooltip align="center" label="检查部位"></el-table-column>
            <!-- <el-table-column prop="jcztName" width="52" align="center" label="状态"></el-table-column> -->
            <el-table-column prop="sqysName" width="70" label="开单医生"></el-table-column>
            <el-table-column prop="yyrq" width="80" align="center" label="预约日期"></el-table-column>
          </el-table>
          <!--          </pagenation-list>-->
        </div>
      </el-col>

      <el-col :span="4">
        <div class="right-list his-module his-small ht">
          <el-table :data="tableDatasB" border stripe :highlight-current-row="true" slot="list" fit :height="listSlotHeight + 30" class="scroll-bar no-underline">
            <el-table-column prop="xmmc" show-overflow-tooltip align="center" label="申请项目"></el-table-column>
            <!--            <el-table-column prop="ztmc" width="60" align="center" label="组套名称"></el-table-column>-->
          </el-table>
        </div>
      </el-col>

      <el-col :span="12" class="ht">
        <div class="right-list his-module his-small his-mini ht">
          <div v-if="formDetail">
            <div class="detail-title">检查结果：</div>
            <div class="detail-content detail-content1" :style="{ height: listSlotHeight - 342 + 'px' }">
              {{ formDetail.diagdesc }}
            </div>
            <div class="detail-title">临床诊断：</div>
            <div class="detail-content detail-content1" :style="{ height: listSlotHeight/2 - 162 + 'px' }">
              {{ formDetail.diagname }}
            </div>
            <div>
              <span class="detail-title">影像地址：</span>
              <a class="detail-href" :href="formDetail.imgUrl" target="_blank">{{formDetail.imgUrl}}</a>
            </div>
            <!-- <div class="detail-link" @click="imageVisible=true"></div> -->
            
            <div class="hz-buttom">
              <div class="hz-message">
                <div class="message-block">
                  <div>报告医生：</div>
                  <div>{{ formDetail.reporter }}</div>
                </div>
              </div>
              <div class="hz-message">
                <div class="message-block">
                  <div>报告日期：</div>
                  <div>{{ formDetail.writedate }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog 
      :visible.sync="imageVisible"
      title="影像报告"
      width="90%"
      class="narrow-dialog"
      :close-on-click-modal="false"
      
    >
      <div style="height:700px;width: 100%">
        
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { id2Name } from '@/utils'
import { queryAuxiliaryList, queryAuxiliaryDetail, queryAuxiliayReport, deleteById } from '@/api/cis/op/dctwork/reportList'
import { AxiosResponse } from 'axios'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'ImageReport',
  filters: {
    filterType(value: any) {
      switch (parseInt(value)) {
        case 1:
          return '放射'
        case 2:
          return '超声'
        case 3:
          return '内镜'
        case 4:
          return '心功能'
        case 5:
          return '特殊治疗'
        case 6:
          return '病理'
        case 7:
          return '特殊'
          break
      }
    },
  },
})
export default class extends Vue {
  @Prop({ required: false }) private pnParam!: any

  private tableDatas: any[] = []
  private tableDatasB: any[] = []
  private listSlotHeight: number = 0
  private searchData: any = {
    brid: this.pnParam.brid,
    jzxh: this.pnParam.jzxh,
    nowDate: '',
  }
  private statusDict: Array<any> = [] // 检查状态
  private stateDict: Array<any> = [] // 检查状态
  private imageVisible: boolean = false // 影像报告弹框
  private kdysList: Array<any> = [] // 开单医生
  private formDetail: any = {
    imgUrl: '', // 影像图片
    writedate: '', // 报告日期
    reporter: '', // 报告医生
    diagname: '', // 临床诊断
    diagdesc: '', // 检查结果
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 225
  }

  mounted() {
    this.statusDict = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.STATUS_DICT : this.$store.state.webSqlDict.STATUS_DICT
    this.stateDict = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.STATE_DICT : this.$store.state.webSqlDict.STATE_DICT
    this.kdysList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.TABLE_DOCTOR_DICT : this.$store.state.webSqlDict.TABLE_DOCTOR_DICT 

    this.getList()
  }

  getDate(value: any) {
    return value.slice(0, 10)
  }

  get tableFormat() {
    const tabledata = this.tableDatas
    id2Name(tabledata, 'jczt', 'jcztName', this.stateDict, 'dv', 'dn')
    id2Name(tabledata,'sqys','sqysName',this.kdysList,'dv','dn')
    return tabledata
  }

  private getList() {
    queryAuxiliaryList(this.searchData).then((res: AxiosResponse) => {
      this.tableDatas = res.data
    })
  }

  // 点击左侧项目名称查询右侧项目明细与报告
  private async handleRowClick(val: any) {
    console.log('val', val)
    await queryAuxiliaryDetail({jcxh: val.jcxh}).then((res: AxiosResponse) => {
      this.tableDatasB = res.data
    })
    this.handleGetDetail(val)
  }
  // 查询项目报告
  private handleGetDetail(val: any) {
    queryAuxiliayReport({reqId: val.jcxh}).then((res: AxiosResponse) => {
      if(res.data.length >0) {
        this.formDetail = res.data[0]
      } else {
        this.formDetail = {
          imgUrl: '', // 影像图片
          writedate: '', // 报告日期
          reporter: '', // 报告医生
          diagname: '', // 临床诊断
          diagdesc: '', // 检查结果
        }
      }
    })
  }

  private handleDelete(val: any) {
    deleteById({ jcxh: val.jcxh, yjxh: val.yjxh }).then(() => {
      this.$notify.success('已删除')
      this.getList()
    })
  }
}
</script>

<style lang="scss" scoped>
.label {
  background: #ffffff;
  border-radius: 8px;
}

.detail-time {
  padding: 0 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
  font-size: 14px;
  font-family: siyuanMedium;
  color: #222b31;
}

.detail-title {
  padding: 0 20px;
  margin: 24px 0 14px 0;
  font-size: 16px;
  font-family: siyuanMedium;
  color: #222b31;
}

.detail-href {
  text-decoration: underline;
  color: #0000ff
}

.detail-content1 {
  overflow: auto;
}

.detail-content {
  padding: 5px 20px;
  color: #6a6d78;
  font-size: 14px;
}
.detail-link {
  padding: 0 20px;
  color: #0431fa;
  font-size: 14px;
  cursor: pointer;
}

.hz-message {
  padding: 0 20px 10px;
  .message-block {
    display: flex;
    justify-content: flex-start;
    color: #6a6d78;
  }
}
.hz-buttom {
  position: absolute;
  bottom: 60px;
}
</style>
