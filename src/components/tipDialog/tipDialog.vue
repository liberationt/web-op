<!--
 * @Date: 2020-09-11 10:40:01
 * @LastEditTime: 2020-09-11 13:30:09
 * @Description:药库未初始化弹窗
 * @FilePath: \web-op\src\components\tipDialog\tipDialog.vue
-->
<template>
  <div
    class="dialogInfo"
    :class="tipData.isShow? 'tipDialog-dialog-in':'tipDialog-dialog-out'"
    v-if="tipData.isShow"
  >
    <div class="tipDialog-dialog-container">
      <div class="his-module his-small">
        <div class="row" slot="header">
          <div class="label" style="padding:0;margin:0px">
            <h1 class="title">{{tipData.title}}</h1>
          </div>
        </div>
        <div class="tipDialog-dialog-content">
          <img src="@/assets/main-img/tip.png"/>
          <div class="label" v-html="tipData.message">
            <!-- <span class="title">{{tipData.message}}</span> -->
          </div>
          <el-button v-if="tipData.isHas" type="primary" class="blue-gra jump-btn">{{tipData.button}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

// 命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'tipDialog',
  filters: {},
})
export default class extends Vue {
  @Prop({ required: true, default: () => {} }) private tipData!: any //提示的固定字段
  // 声明变量，方法
  // 监听方法
  @Watch('')
  // 生命周期
  mounted() {}
}
</script>

<style lang='scss' scoped>
.dialogInfo {
  position: fixed;
  top: 72px;
  margin-left: 0;
  width: calc(100% - #{$sideBarWidth});
  height: calc(100% - 72px);
  z-index: 1999;
  .tipDialog-dialog-container {
    padding: 25px 25px 0;
    width: 400px;
    background: rgba(255, 255, 255, 1);
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.4);
  }
  ::v-deep .row{
    height: 30px;
    display: none;
  }
  ::v-deep .tipDialog-dialog-content{
    text-align: center;
    img{
      margin: 0 auto;
      width: 120px;
      display: block;
    }
    .label{
      margin: 30px 0 25px;
      font-size: 14px;
      em{
        color: $blue;
      }
    }
    .jump-btn{
      margin-bottom: 25px;
    }
  }
}

.tipDialog-dialog-in {
  opacity: 1;
}

.tipDialog-dialog-out {
  opacity: 0;
}
</style>
