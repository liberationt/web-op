<template>
  <div class="content">
		<div class="his-module his-small">
      <div class="row">
        <div class="label">
          <h1>挂号管理流程</h1>
        </div>
      </div>

      <div class="flow-wrapper clearfix">
        <ul class="left">
          <li class="area">
            <img src="@/assets/flowChart/guahaoyewu@2x.png">
            <p style="color: #1485ff">挂号业务</p>
          </li>
          <li class="area">
            <img src="@/assets/flowChart/shoufeiyewu@2x.png">
            <p style="color: #0fcaad">收费业务</p>
          </li>
          <li class="area">
            <img src="@/assets/flowChart/zhanghuguanli@2x.png">
            <p style="color: #ffbf00">账户管理</p>
          </li>
          <li class="area">
            <img src="@/assets/flowChart/xinxichaxun@2x.png">
            <p style="color: #14bdff">信息查询</p>
          </li>
        </ul>
        <ul class="center">
          <li class="area clearfix">
            <div class="flow-item">
              <img src="@/assets/flowChart/guahaochuli@2x.png">
              <span>挂号处理</span>
            </div>
            <div class="flow-arrow">
              <img src="@/assets/flowChart/jiantou1@2x.png">
            </div>
            <div class="flow-item">
              <img src="@/assets/flowChart/guahaoribao@2x.png">
              <span>挂号日报</span>
            </div>
          </li>
          <li class="area clearfix">
            <div class="flow-item">
              <img src="@/assets/flowChart/shoufeichuli@2x.png">
              <span>收费处理</span>
            </div>
            <div class="flow-arrow">
              <img src="@/assets/flowChart/jiantou1@2x.png">
            </div>
            <div class="flow-item">
              <img src="@/assets/flowChart/fapiaozuofei@2x.png">
              <span>发票作废</span>
            </div>
            <div class="flow-arrow"></div>
            <div class="flow-item">
              <img src="@/assets/flowChart/tuifeichuli@2x.png">
              <span>退费处理</span>
            </div>
            <div class="flow-arrow"></div>
            <div class="flow-item">
              <img src="@/assets/flowChart/shoufeirizhi@2x.png">
              <span>收费日志</span>
            </div>
          </li>
          <li class="area clearfix">
            <div class="flow-item">
              <img src="@/assets/flowChart/jiandangkaihu@2x.png">
              <span>建档开户</span>
            </div>
            <div class="flow-arrow">
              <img src="@/assets/flowChart/jiantou1@2x.png">
            </div>
            <div class="flow-item">
              <img src="@/assets/flowChart/zhanghuxiugai@2x.png">
              <span>账户修改</span>
            </div>
            <div class="flow-arrow">
              <img src="@/assets/flowChart/jiantou1@2x.png">
            </div>
            <div class="flow-item">
              <img src="@/assets/flowChart/zhanghujiaokuan@2x.png">
              <span>账户缴款</span>
            </div>
            <div class="flow-arrow">
              <img src="@/assets/flowChart/jiantou1@2x.png">
            </div>
            <div class="flow-item">
              <img src="@/assets/flowChart/tuifeichuli@2x.png">
              <span>账户退款</span>
            </div>
          </li>
          <li class="area clearfix">
            <div class="flow-item">
              <img src="@/assets/flowChart/guahaoxinxi@2x.png">
              <span>挂号信息</span>
            </div>
            <div class="flow-arrow"></div>
            <div class="flow-item">
              <img src="@/assets/flowChart/shoufeixinxi@2x.png">
              <span>收费信息</span>
            </div>
            <div class="flow-arrow"></div>
            <div class="flow-item">
              <img src="@/assets/flowChart/yuyuechaxun@2x.png">
              <span>预约查询</span>
            </div>
            <div class="flow-arrow"></div>
            <div class="flow-item">
              <img src="@/assets/flowChart/guahaofenleitongji@2x.png">
              <span>挂号分类统计</span>
            </div>
          </li>
        </ul>
        <ul class="right">
          <li class="area" style="height: 248px">
            <div class="flow-item">
              <img src="@/assets/flowChart/huizongribao@2x.png">
              <span>汇总日报</span>
            </div>
          </li>
          <li class="area" style="height: 116px">
            <div class="flow-item">
              <img src="@/assets/flowChart/zhanghuxinxi@2x.png">
              <span>账户信息</span>
            </div>
          </li>
          <li class="area" style="height: 116px">
            
          </li>
        </ul>

        <img src="@/assets/flowChart/jiantou6.png" id="arrow1">
        <img src="@/assets/flowChart/jiantou3@2x.png" id="arrow2">
        <img src="@/assets/flowChart/jiantou4@2x.png" id="arrow3">
        <img src="@/assets/flowChart/jiantou3@2x.png" id="arrow4">
      </div>
    </div>
	</div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

//声明接口
declare interface pageList {
  id: number
}

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: '',
  filters: {},
  components: {}
})
export default class extends Vue {
  //声明变量，方法
	private tableData: any[] = [] // 表格数据
	private searchData: any = { // 搜索参数
    jzkh: ''
  }
	private listSlotHeight: number = 0
	private loading: boolean = false
	private rightTitle: string = window.ele.$i18n.t('common.add')
	private formData: any = {} // 表单数据
  private formRule: any = {} // 表单验证
  private curRow: any = {} // 当前行数据
  private brxzList: any[] = this.$store.state.webSqlDict.TABLE_PATIENT_DICT
  private genderList: any[] = this.$store.state.webSqlDict.SEX_DICT
  private institutionList: any[] = this.$store.state.webSqlDict.SUPER_ORGAN_DICT // 医疗机构（可能不对）
  private usersList: any[] = this.$store.state.webSqlDict.USERS_DICT // 用户列表

  public setValue(value: string) {
    this.setValue(value)
  }
  public getValue() {
    return null
  }
  //监听方法
  @Watch('tableData')
	private onValueChange(value: string) {
    this.loading = false
	}





  //初始化的周期函数
	created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 104
  }
  mounted() {
    // this.getLists()
	}
}
</script>

<style lang="scss" scoped>
.flow-wrapper{
  position: relative;
  width: 1090px;
  height: 512px;
  margin: 24px auto 0;
  // border: 1px solid #ccc;
}

.left{
  float: left;
  width: 174px;
  li{
    height: 116px;
    margin-bottom: 16px;
    padding: 28px 0;
    text-align: center;
    img{
      width: 38px;
    }
    p{
        font-size: 18px;
        font-family: "siyuanMedium";
      }
  }
}
.center{
  float: left;
  width: 754px;
  margin-left: 8px;
  li{
    display: flex;
    align-items: center;
    height: 116px;
    margin-bottom: 16px;
    padding-left: 28px;
  }
}
.right{
  float: left;
  width: 146px;
  margin-left: 8px;
  li{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
    .flow-item{
      width: 120px;
    }
  }
}

.area{
  border-radius: 8px;
  background: $lightGray;
}

.flow-item{
  // float: left;
  display: flex;
  align-items: center;
  width: 140px;
  height: 44px;
  border-radius: 100px 4px 4px 100px;
  background: #fff;
  box-shadow: 0 1px 6px 0 rgba(0,0,0,.16);
  cursor: pointer;
  img{
    width: 38px;
    height: 38px;
    margin: 0 4px;
  }
  span{
    font-family: "siyuanMedium";
  }
  &:hover{
    transform: scale(1.05);
  }
}
.flow-arrow{
  width: 40px;
  img{
    width: 30px;
    margin: 0 5px;
  }
}

#arrow1{
  position: absolute;
  top: 60px;
  left: 548px;
  width: 410px;
}
#arrow2{
  position: absolute;
  top: 144px;
  left: 270px;
  width: 392px;
}
#arrow3{
  position: absolute;
  top: 218px;
  left: 270px;
  width: 560px;
}
#arrow4{
  position: absolute;
  top: 350px;
  left: 270px;
  width: 392px;
  transform: rotateX(180deg);
}
</style>
