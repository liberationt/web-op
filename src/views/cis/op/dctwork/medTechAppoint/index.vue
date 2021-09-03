<!--
 * @Date: 2020-05-31 10:35:00
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-14 15:12:35
 * @description:  医技预约
-->
<template>
  <div class="content">
    <el-row :gutter="10" class="ht">
      <el-col :span="18" class="ht">
        <!-- 医技预约的主模块 -->
        <div class="his-module his-small his-mini his-main" style="height: 70%; ">
          <appoint-list :jcxh="jcxh" ref="appointList" @qxyy="qxyy" @checkInfo="getCheckInfo" />
        </div>
        <!-- 列表 -->
        <div class="his-module his-small mt10 his-mini" style="height: calc(30% - 20px);">
          <patient-list ref="patientList" @getJCXH="getJcxh" :list="checkInfo" />
        </div>
      </el-col>
      <el-col :span="6" class="ht">
        <!-- 预约的form表单  新增/修改 -->
        <div class="his-module his-small his-mini" style="height: 70%;">
          <project-appoint @getDetailInfo="getDetailInfo" @getAppointList="getAppointList" />
          <!-- <el-divider></el-divider> -->
          <!-- <project-list /> -->
        </div>
        <div class="his-module his-small mt10 his-mini" style="height: calc(30% - 20px);">
          <fee-list :detailInfo="detailInfo" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import patientList from './components/patientList.vue'
import projectAppoint from './components/projectAppoint.vue'
import projectList from './components/projectList.vue'
import feeList from './components/feeList.vue'
import appointList from './components/appointList.vue'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'MedTechAppoint',
  components: {
    patientList,
    projectAppoint,
    projectList,
    feeList,
    appointList,
  },
})
export default class extends Vue {
  private tableDatas: any = []
  private list: any = []
  private detailInfo: any[] = []
  private checkInfo: any[] = []
  private jcxh: number | null = null

  private getDetailInfo(val: any) {
    this.detailInfo = val
  }

  private getCheckInfo(data: any) {
    this.checkInfo = data
    // 处理时间格式
    this.checkInfo.forEach((item: any) => {
      item.yyrq = item.yyrq ? item.yyrq.substring(0,10)	: ''
    })
  }

  private getAppointList() {
    (this.$refs.appointList as any).queryYjyyData()
  }

  private getJcxh(jcxh: any) {
    this.jcxh = jcxh
  }

  private qxyy() {
    this.jcxh = null
  }
}
</script>

<style lang="scss" scoped>
.his-main {
  padding-top: 8px;
}
.el-divider--horizontal {
  margin: 0 0 8px 0 !important;
}
.el-divider {
  background-color: #f0f0f0;
}

.el-table__header {
  th {
    height: 28px !important;
  }
}
</style>
