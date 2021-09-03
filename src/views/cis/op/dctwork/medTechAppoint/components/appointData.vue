<!--
 * @Date: 2020-06-04 15:29:17
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-07 09:53:27
 * @description: 预约时间弹窗
-->

<template>
  <div class="content">
    <div class="main ht">
      <el-row :gutter="10" class="ht">
        <el-col :span="5" class="mt10 ht">
          <div class="his-module his-small">
            <week v-bind="$attrs" @getList="getList" />
          </div>
        </el-col>
        <el-col :span="19" class="mt10 ht">
          <div class="his-module his-small ht" v-show="list.length > 0">
            <!-- <pagenation-list
              ref="pageTable"
              v-model="tableDatas"
              data-url="/op-service/gyblmb/queryPage"
              http-method="post"
              :list-height="listSlotHeight"
              :searchData="searchData"
              style="height: 95%;"
            >-->
            <div slot="list" class="rowLay ht scroll-bar">
              <div
                v-for="(item, index) in list"
                :key="index"
                @dblclick="selectTime(item)"
                class="blocked"
              >
                <span>{{ item.hysj }}</span>
              </div>
            </div>
            <!-- </pagenation-list> -->
          </div>
          <div class="his-module his-small ht" v-show="list.length == 0">暂无数据</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { checkHyid, unfreezeSBHH } from '@/api/cis/op/dctwork/medTechAppoint.ts'
import week from './week.vue'
//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'AppointData',
  components: { week },
})
export default class extends Vue {
  @Prop({ required: true, default: () => [] }) private timeList!: any[]
  private list: any[] = []
  private tableDatas: any[] = []
  private listSlotHeight: number = 470
  // 一行循环几条数据  该数字能被24整除
  private row: number = 8
  private searchData: any = {
    pageNum: 1,
    pageSize: 80,
  }

  created() {
    this.list = this.timeList
  }
  mounted() {

  }

  private getList(list: any) {
    this.list = list
  }

  private selectTime(item: any) {
    checkHyid({ hyid: item.hyid }).then((res: any) => {
      if (res.data) {
        unfreezeSBHH({ hyid: item.hyid }).then((res1: any) => {
          this.$emit('getTime', item)
        })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: 600px;
  .rowLay {
    grid-gap: 6px;
    .blocked {
      float: left;
      margin-left: 10px;
      margin-bottom: 10px;
      width: 64px;
      flex-flow: nowrap;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      background: rgba(20, 133, 255, 0.04);
      border-radius: 2px;
      span {
        font-size: 16px;
        font-weight: 500;
        color: rgba(20, 133, 255, 1);
        line-height: 24px;
      }
      &:hover {
        background: #1485ff;
        span {
          color: $white;
        }
      }
    }
  }
}
</style>
