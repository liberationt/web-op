<template>
  <div>
    <div class="selGallery" @click="toggleClick(true)">
      <span>
        <i class="icon" :class="iconName"></i>
      </span>
      <label>{{ $t('gallery.addIcon') }}</label>
    </div>
    <el-dialog
      width="60%"
      title="icon图库"
      :visible.sync="outerVisible"
      append-to-body
      style="top: 150px;"
    >
      <div class="selAlert" v-show="outerVisible">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="HIS" name="first">
            <ul class="iconBox">
              <li
                :class="index == i ? 'active' : ''"
                v-for="(v, i) in iconList"
                :key="i"
                @click="sel(i)"
              >
                <i class="icon" :class="v"></i>
                <span>{{ i }}</span>
              </li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="CIS" name="second">
            <ul class="iconBox">
              <li
                :class="index == i ? 'active' : ''"
                v-for="(v, i) in iconCISList"
                :key="i"
                @click="selCIS(i)"
              >
                <i class="icon" :class="v"></i>
                <span>{{ i }}</span>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
        <!-- <div class="dialog-footer">
				<el-button @click="outerVisible = false">取 消</el-button>
				<el-button type="primary" @click="submit">确定</el-button>
        </div>-->
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'Gallery',
})
export default class extends Vue {
  @Prop({ required: true }) private value!: string

  set iconName(val: string) {
    this.$emit('input', val)
  }

  get iconName() {
    return this.value
  }

  private index = 0

  private outerVisible = false

  private activeName = 'first'

  // private iconName = ''

  private iconList = [
    'his-add',
    // 'his-dot',
    'his-jichushuju',
    'his-menu_bed_icon',
    'his-menu_guahao',
    'his-dongtaipeizhi',
    'his-menu_inpatient_icon',
    'his-menu_baobiao',
    'his-menu_shanghaiyibao',
    'his-menu_Registration_icon',
    'his-menu_yiyuanshuju',
    'his-menu_shoufei',
    'his-menu_taifang',
    'his-menu_yonghushouquan',
    'his-menu_yuyue',
    'his-menu_system_icon',
    'his-menu_posguanli',
    'his-dictionary',
    'his-prescription',
    'his-checkout',
    'his-disposition',
    'his-operation',
    'his-dispensing',
    'his-insurance',
    // 'his-charge', //
    // 'his-info', //
    'his-purchase',
    'his-storage',
    'his-inventory',
    'his-odo',
    'his-change-price',
    'his-candan-baobiao',
    'his-caidan_yonghuguanli',
    'his-caidan_yiliaoquanxian',
    'his-caidan_jituanzidian',
    // 'his-caidan-yemianpeizhi',  // kong
    'his-caidan_guahaoshoufei',
    'his-caidan_zhuyuanyisheng',
    'his-caidan_zhuyuanhushi',
    'his-caidan_yaoku',
    'his-caidan_zhuyuanyaofang',
    'his-menu_taifang',
    'his-caidan_menzhenshuye',
    'his-caidan_shoushu',
    'his-caidan_gaozhihaocai',
    'his-caidan_erjicaidan',
    'his-menu_Registration_icon',
    'his-menu_yuyue',
    'his-caidan_zhuyuanguanli',
  ]

  private iconCISList = [
    'his-super-admin1',
    'his-juese-yikatong',
    'his-juese_guahuashoufei',
    'his-juese-yishen',
    'his-juese_yaoku',
    'his-juese-caoyaoku',
    'his-resident-doc1',
    'his-juese_bingquhushizhan',
    'his-juese_menzhenyaofang',
    'his-juese-menzhenzhongyao',
    'his-juese-guahaoyuyue',
    'his-juese-yijiyuyue',
    'his-juese-kangfuguanli',
    'his-juese-chuangweiyuyue',
    'his-juese-menzhenshuye',
    'his-juese-shoumajifei',
    'his-juese_wuziguanli',
    'his-juese_zhuyuanyaofang',
    'his-juese_suifang1',
    'his-juese_zicanguanli',
    'his-juese_yuanzhangchaxun',
    'his-juese_zhongxinweihu',
    'his-juese-binanguanli',
    'his-juese_suifang',
    'his-juese_yuanganguanli',
    'his-juese_weijizhiguanli',
    'his-juese_binglibianji',
    'his-juese_shoushufenji',
    'his-juese_gaozhihaocai',
    'his-juese_buliangshijian',
  ]

  @Watch('index')
  private indexChange(value: any) {
    console.log(this.activeName)

    if (this.activeName == 'first') {
      this.iconName = this.iconList[value]
      console.log('-------', this.iconName, '========', this.activeName)
    } else if (this.activeName == 'second') {
      this.iconName = this.iconCISList[value]
      console.log('-------', this.iconName, '========', this.activeName)
    }
    this.index = value
    this.outerVisible = false
  }

  private toggleClick(bo: boolean) {
    this.outerVisible = bo
  }

  private handleClick(tab: any, event: any) {
    console.log(tab.name)
    this.activeName = tab.name
  }

  private sel(i: number) {
    this.index = i
  }

  private selCIS(i: number) {
    this.index = i
  }

  // private submit() {
  //   this.iconName = this.iconList[this.index]
  //   this.outerVisible = false

  //   this.$emit('input', this.iconName)
  // }
}
</script>

<style lang="scss" scoped>
.selGallery {
  position: relative;
  height: 34px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;

  span {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(245, 246, 248, 1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .his-add {
      color: #1485ff;
    }
  }

  label {
    width: 48px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(20, 133, 255, 1);
    margin-left: 8px;
  }
}

.selAlert {
  background: #fff;
  z-index: 100;
  border-radius: 8px;
  // padding: 21px 24px;
  .iconBox {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;

    li {
      width: 72px;
      height: 72px;
      display: flex;
      font-size: 12px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: rgba(106, 109, 120, 1);
      line-height: 18px;

      span {
        margin-top: 8px;
      }
    }

    .active {
      background: linear-gradient(315deg, rgba(45, 187, 255, 1) 0%, rgba(20, 133, 255, 1) 100%);
      border-radius: 4px;
      color: #fff;
      font-size: 12px;
    }
  }

  .dialog-footer {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
  }
}
</style>
