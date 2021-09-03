<!--
 * @Date: 2020-05-26 14:53:04
 * @LastEditors: zhml
 * @LastEditTime: 2020-05-28 11:08:47
 * @description: 影像查看
-->

<template>
  <div class="ht module">
    <div class="right-list his-module ht" style="width:100%">
      <div class="detail-time">{{ time }}</div>
      <div class="detail-title">报告内容：</div>
      <div class="detail-content">{{ content }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'ImageWatch'
})
export default class extends Vue {
  private tableDatas: any[] = []
  private comHeight: number = 0
  private btnChildIndex: number = 0
  private time: string = '2018-05-18 15:19:59'
  private content: string = '心室率：105 心房率：心房颤动(快频率'
}
</script>

<style lang="scss" scoped>

.label {
  background: #ffffff;
  border-radius: 8px;
}
.detail-time {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
  font-size: 14px;
  font-family:siyuanMedium;
}
.detail-title {
  margin: 24px 0 14px 0;
  font-size: 14px;
  color: #222b31;
}
.detail-content {
  color: #6a6d78;
  font-size: 14px;
}
</style>
