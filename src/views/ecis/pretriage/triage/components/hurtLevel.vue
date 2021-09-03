<template>
<el-dialog title="NRS数字分级法评分表" :visible.sync="dialogVisibleN" width="50%">
  <div class="his-module his-small his-triage-diag" :style="{marginTop: '-20px'}">
    <div class="area">
      <div class="title">疼痛等级</div>
      <div class="exp">说明：0分：无痛；１－３分：轻度疼痛；４－６分：中度疼痛；７－１０分：重度疼痛</div>
    </div>
    <el-divider direction="horizontal"></el-divider>
    <div class="area">
      <div class="column1">无痛</div>
      <div class="column2"></div>
      <div class="block">
        <div>０分　　无痛</div>
      </div>
    </div>
    <el-divider direction="horizontal"></el-divider>
    <div class="area">
      <div class="column1">轻度疼痛</div>
      <div class="column2">翻身、咳嗽、深呼吸时疼痛</div>
      <div class="block">
        <div class="block-mb">１分：安静平卧不痛，翻身咳嗽时疼痛</div>
        <div class="block-mb">２分：咳嗽疼痛，深呼吸不痛</div>
        <div class="block-mb">３分；安静平卧不痛，咳嗽深呼吸疼痛</div>
      </div>
    </div>
    <el-divider direction="horizontal"></el-divider>
    <div class="area">
      <div class="column1">中度疼痛</div>
      <div class="column2">安静平卧时有疼痛，影响睡眠</div>
      <div class="block">
        <div class="block-mb">４分；安静平卧时，间歇疼痛</div>
        <div class="block-mb">５分：安静平卧时，持续疼痛</div>
        <div class="block-mb">６分：安静平卧时，疼痛较重</div>
      </div>
    </div>
    <el-divider direction="horizontal"></el-divider>
    <div class="area">
      <div class="column1">重度疼痛</div>
      <div class="column2">翻转不安，无法入睡，全身大汗，无法忍受</div>
      <div class="block">
        <div class="block-mb">７分：疼痛较重，翻转不安，无法入睡</div>
        <div class="block-mb">８分：持续疼痛难忍，全身大汗</div>
        <div class="block-mb">９分：剧烈疼痛，无法忍受</div>
        <div class="block-mb">１０分：最疼痛，生不如死</div>
      </div>
    </div>

    <div class="footer">
      <div class="footOne" >
        <span class="footl">评分</span>
        <el-input class="footr queryInput" v-model="ttpf" placeholder="请输入评分"></el-input></div>
    </div>
    <div class="btnList">
      <div class="footOne">
        <el-button size="mini" @click="dialogVisibleN=false">取消</el-button>
        <el-button type="primary" size="mini" @click="showBtn">确定</el-button></div>
    </div>
  </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Watch, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'SewsLevel',
  //组件引用
  components: {},
})
export default class extends Vue {
  // @Prop({ required: true }) private forms!: any
  private summary: number = 0
  private list: any[] = []
  private ttpf: any = ''
  private ttpfClass: any = ''
  private ttpfList: Array<[]> = []
  private dialogVisibleN: boolean = false
  private showBtn () {
    if (this.ttpf){
      if (this.ttpf == 0 ) {
        this.ttpfClass = 4
      } else if (this.ttpf > 0 && this.ttpf < 4) {
        this.ttpfClass = 3
      } else if (this.ttpf >= 4 && this.ttpf < 7) {
        this.ttpfClass = 2
      } else if (this.ttpf > 6 ) {
        this.ttpfClass = 1
      }
      this.ttpfList[0] = this.ttpf
      this.ttpfList[1] = this.ttpfClass
      this.$emit('refreshTtpf',this.ttpfList)
      this.dialogVisibleN = false
    } else {
      this.$notify({
        title: '请输入评分',
        message: '',
        type: 'error'
      })
    }
  }
  private open() {
    this.dialogVisibleN = true
  }
}
</script>
<style lang="scss" scoped>
.his-triage-diag {
  .area {
    width: 100%;
    display: inline-flex;
    margin-top: -5px !important;

    .column1 {
      width: 80px;
    }
    .column2 {
      width: 120px;
    }
    .block {
      width: auto;
      .block-mb {
        margin-bottom: 5px;
      }
    }
    .title {
      font-size: siyuanMedium;
    }
    .exp {
      color: red;
    }
  }
  .footer,
  .btnList {
    position: relative;
    height: 28px;
    line-height: 28px;
    margin: 10px 0;
    .footOne {
      width: 160px;
      line-height: 28px;
      position: absolute;
      display: flex;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      .footl {
        flex: 1.5;
        line-height: 28px;
      }
      .footr {
        flex: 3;
      }
    }
  }
}
</style>
