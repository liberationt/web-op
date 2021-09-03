<template>
  <!-- <div class="content ht"> -->
  <div class="his-module his-small">
    <el-table :data="list" stripe border>
      <el-table-column prop="project" min-width="110" :label="'项目'"></el-table-column>
      <el-table-column prop="act" min-width="60" :label="'实测值'"></el-table-column>
      <el-table-column prop="score" min-width="60" :label="'得分'">
        <template slot-scope="props">
          <span>{{ getScore(props.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="score3" min-width="60" :label="'评分3'"></el-table-column>
      <el-table-column prop="score2" min-width="60" :label="'评分2'"></el-table-column>
      <el-table-column prop="score1" min-width="60" :label="'评分1'"></el-table-column>
      <el-table-column prop="score0" min-width="90" :label="'评分0'"></el-table-column>
      <el-table-column prop="score1d" min-width="90" :label="'评分1'"></el-table-column>
      <el-table-column prop="score2d" min-width="90" :label="'评分2'"></el-table-column>
      <el-table-column prop="score3d" min-width="60" :label="'评分3'"></el-table-column>
    </el-table>
    <div class="mt10">
      <span>得分合计:</span>
      <span :style="{marginLeft:'80px', fontWeight: '600'}">{{ summary }}</span>
    </div>
    <div class="mt10">
        备注：MEWS评分5分是鉴别病情严重程度的最佳临界点，当患者MEWS＞5分时病情恶化的可能性较大，当患者MEWS＞ 9分时，

          死亡的危险性明显增加，病人外出时必须有医生和责护陪同，并备齐急救用物。
    </div>
  </div>
  <!-- </div> -->
</template>
<script lang="ts">
import { Component, Watch, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'SewsLevel',
  //组件引用
  components: {},
})
export default class extends Vue {
  @Prop({ required: true }) private forms!: any
  private summary: number = 0
  private mewsClass: number = 0
  private list: any[] = [
    {
      project: '心率(次/每分)',
      projectName: 1,
      act: this.forms.xl,
      score: 0,
      score3: '',
      score2: '<=40',
      score1: '41-50',
      score0: '51-100',
      score1d: '101-110',
      score2d: '111-129',
      score3d: '>=130',
    },
    {
      project: '收缩压(mmHg)',
      projectName: 2,
      act: this.forms.xyssy,
      score: 0,
      score3: '<=70',
      score2: '71-80',
      score1: '81-100',
      score0: '101-199',
      score1d: '',
      score2d: '>=200',
      score3d: '',
    },
    {
      project: '呼吸频率(次/每分)',
      projectName: 3,
      act: this.forms.hx,
      score: 0,
      score3: '',
      score2: '<=8',
      score1: '',
      score0: '9-14',
      score1d: '15-20',
      score2d: '21-29',
      score3d: '>=30',
    },
    {
      project: '体温(℃)',
      projectName: 4,
      act: this.forms.tw,
      score: 0,
      score3: '',
      score2: '<=35',
      score1: '35.1-36.0',
      score0: '36.1-38.0',
      score1d: '38.1-38.5',
      score2d: '>=38.6',
      score3d: '',
    },
    {
      project: '意识',
      projectName: 5,
      act: this.forms.yszt,
      score: 0,
      score3: '',
      score2: '',
      score1: '',
      score0: '完全清楚',
      score1d: '对声音有反应',
      score2d: '对疼痛有反应',
      score3d: '无反应',
    },
  ]

  @Watch('list', { immediate: true, deep: true })
  private listChange(val: any) {
    val.forEach((element: any) => {
      this.summary = this.summary + parseInt(element.score)
    })

    if (this.summary == 0) {
      this.mewsClass = 4
    } else if (this.summary > 0 && this.summary <= 5){
      this.mewsClass = 3
    } else if (this.summary > 5 && this.summary <= 9){
      this.mewsClass = 2
    } else if (this.summary > 9) {
      this.mewsClass = 1
    }
      this.$emit('getSummary',this.summary)
      this.$emit('getMewsClass',this.mewsClass)
  }

  // 计算得分
  getScore(val: any) {
    switch (val.projectName) {
      case 1:
        if (val.act <= 40 || (val.act > 110 && val.act < 130)) {
          val.score = 2
        } else if ((val.act >= 41 && val.act <= 50) || (val.act >= 101 && val.act <= 110)) {
          val.score = 1
        } else if (val.act > 50 && val.act <= 100) {
          val.score = 0
        } else if (val.act >= 130) {
          val.score = 3
        }
        return val.score
      case 2:
        if (val.act <= 70) {
          val.score = 3
        } else if ((val.act > 70 && val.act <= 80) || val.act >= 200) {
          val.score = 2
        } else if (val.act >= 80 && val.act <= 100) {
          val.score = 1
        } else if (val.act > 100 && val.act < 200) {
          val.score = 0
        }
        return val.score
      case 3:
        if (val.act >= 30) {
          val.score = 3
        } else if (val.act < 9 || (val.act > 20 && val.act < 30)) {
          val.score = 2
        } else if (val.act >= 15 && val.act <= 20) {
          val.score = 1
        } else if (val.act >= 9 && val.act < 15) {
          val.score = 0
        }
        return val.score
      case 4:
        if (val.act <= 35 || val.act >= 38.6) {
          val.score = 2
        } else if ((val.act > 35 && val.act <= 36) || (val.act > 38 && val.act <= 38.5)) {
          val.score = 1
        } else if (val.act > 36 && val.act <= 38) {
          val.score = 0
        }
        return val.score
      case 5:
        if (val.act == 1) {
          val.score = 0
        } else if (val.act == 2) {
          val.score = 1
        } else if (val.act == 3) {
          val.score = 2
        } else if (val.act == 4) {
          val.score = 3
        }
        return val.score
    }
  }
}
</script>
<style lang="scss" scoped></style>
