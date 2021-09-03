<template>
  <div class="his-module his-small his-mini order-manage" v-loading="isSave">
    <div class="row" >
      <div class="label">
        <div class="searchTitle">预约管理</div>
        <div class="btn">
          <el-divider direction="vertical"></el-divider>
          <!-- 保存 -->
          <el-button size="mini" type="text" @click="handleSave" v-preventReClick>
            <i class="icon his-btn-save-copy green"></i>
            <span>保存</span>
          </el-button>
        </div>
      </div>
    </div>

    <el-form label-width="60px" :model="patientData" class="clearfix">

      <div class="item-wrapper">
        <!-- 患者姓名 -->
        <el-form-item :label="'患者姓名'" disabled>
          <el-input
            v-model="patientData.brxm"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </div>

      <div class="item-wrapper">
        <!-- 收费性质 -->
        <el-form-item :label="'收费性质'" disabled>
          <el-input
            v-model="patientData.brxzName"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </div>

      <div class="item-wrapper">
        <!-- 性别 -->
        <el-form-item :label="'性别'" class="item-gender" disabled>
          <el-input
            v-model="patientData.brxbName"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <!-- 年龄 -->
        <el-form-item label-width="0" class="item-age" disabled>
          <el-input
            v-model="patientData.nl"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </div>

      <div class="item-wrapper">
        <!-- 预约时间 -->
        <el-form-item :label="'预约时间'" class="item-date">
          <el-date-picker
            v-model="formData.yyrq"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            class="date-wrapper"
          ></el-date-picker>
        </el-form-item>
        <!-- 值班类别 -->
        <el-form-item label-width="0" class="item-ampm">
          <!-- <el-select
            v-model="formData.zblb"
            placeholder="值班类别"
          >
            <el-option label="上午" :value="1"></el-option>
            <el-option label="下午" :value="2"></el-option>
          </el-select> -->
          <!-- <search-select
            table-name="SYS_DICT_CONFIG"
            kid="77"
            v-model="formData.zblb"
            :placeholder="$t('班次')"
            :backfillValue="formData.zblb"
          /> -->
          <el-select v-model="formData.zblb" placeholder="班次">
            <el-option v-for="(item,index) in bcList" :key="index" :label="item.dn" :value="item.dv"></el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="item-wrapper">
        <!-- 预约科室 -->
        <el-form-item :label="'预约科室'" class="item-dept" disabled>
          <el-select v-model="patientData.ghks" placeholder="请选择" disabled>
            <el-option
              v-for="(item,index) in yyksList"
              :key="index"
              :label="item.dn"
              :value="item.dv"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="item-wrapper">
        <!-- 预约医生 -->
        <el-form-item :label="'预约医生'" disabled>
          <el-input
            v-model="patientData.ysdmName"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </div>

      <div class="item-wrapper">
        <!-- 预约类型 -->
        <el-form-item :label="'预约类型'" disabled>
          <search-select
            table-name="SYS_FLAG_DATA"
            kid="YY000001"
            v-model="formData.yylx"
            :placeholder="'预约类型'"
            :backfillValue="formData.yylx"
            :disabled="true"
          />
        </el-form-item>
      </div>

      <div class="item-wrapper">
        <!-- 预约备注 -->
        <el-form-item :label="'预约备注'">
          <el-input
            v-model="formData.yybz"
            :placeholder="'请填写备注'"
          ></el-input>
        </el-form-item>
      </div>


    </el-form>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { saveDialo, aCheckAppointedToday } from '@/api/cis/op/dctwork/orderManger.ts'
import { getNow } from '@/api/his/basic/index.ts'
import { parseTime } from '@/utils'

@Component({
  name: 'appointmentQuery',
  components: {
  },
})
export default class extends Vue {
  @Prop({ required: true }) private patientData!: any

  private dateTime: string|null = '' // 当前时间
  private yyksList: Array<any> = [] // 预约科室数组
  private bcList: Array<any> = [] // 班次数组
  private formData: any = {
    yyrq: '', // 挂号日期
    zblb: '', // 值班类别
    yylx: 4, // 预约类型（诊间预约）
    yybz: '', // 预约备注
  }
  private isSave: boolean = false // 防止重复保存


  // 获取当前时间
  private getNow() {
    getNow().then((res: any) => {
      res.data += 86400000
      this.dateTime = parseTime(res.data, '{y}-{m}-{d}')
      this.formData.yyrq = this.dateTime
      // this.formData.zblb = Number(parseTime(res.data, '{b}'))
    })
  }

  // 保存按钮
  private async handleSave(){
    if(this.formData.zblb==''){
      this.$message.warning('请选择班次！')
      return false
    }
    // 验证当天是否预约过
    let params = {
      brid: this.patientData.brid,
      ghsj: '',
      ksdm: this.patientData.ghks,
      yyrq: this.formData.yyrq
    }
    await aCheckAppointedToday(params).then((res: any) => {
      if(res){
        this.saveAppointment()
      }
    })
    this.formData.yyrq = this.dateTime
    this.formData.zblb = ''
    this.formData.yybz = ''
  }

  // 保存预约
  private saveAppointment(){
    this.isSave = true
    let params = {
      brid: this.patientData.brid, //病人id
      cardno: this.patientData.jzkh, //卡号
      ghbz: 0, //挂号标志
      ghsj: this.dateTime+' 00:00:00', //挂号时间（当前时间，时分秒，后端会重新赋值）
      ksdm: this.patientData.ghks, //科室代码
      ysdm: this.patientData.ysdm, //医生代码
      yybz: this.formData.yybz, // 预约备注
      yylx: this.formData.yylx, // 预约类型
      yyrq: this.formData.yyrq, //预约日期
      zblb: this.formData.zblb, //值班类别
      zsid: '', //诊室id
    }
    saveDialo(params).then((res: any) => {
      this.$notify({
        type: 'success',
        title: '预约成功',
        message: '',
      })
      this.isSave = false
    })
  }

  created() {

  }

  mounted() {
    this.getNow()
    this.yyksList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REGISTERATION_DEPARTMENT_DICT : this.$store.state.webSqlDict.REGISTERATION_DEPARTMENT_DICT
    this.bcList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.REG_YYZBLB : this.$store.state.webSqlDict.REG_YYZBLB
  }









}
</script>

<style lang="scss" scoped>
.his-module.order-manage{
  margin-right: 0;
  padding: 4px 10px 8px 10px;
  .row {
    padding-bottom: 4px;
    .label {
      .search-title {
        padding-right: 0;
        font-family: siyuanMedium;
      }
      .el-divider--vertical {
        margin: 0 10px;
      }
    }
  }
  .el-form{
    margin: 0 !important;
    .item-wrapper{
      float: left;
      width: calc((100% - 20px*2)/3);
      margin-left: 10px;
      &:nth-child(3n+1){
        margin-left: 0;
      }
      &:nth-last-child(1){
        // width: calc(  (100% - 20px*2)/3*2 + 20px  );
        width: calc((200% - 20px)/3);
      }
      .el-form-item{
        ::v-deep .el-form-item__label{
          padding: 0;
        }
        &.item-gender,&.item-date{
          float: left;
          width: 70%;
        }
        &.item-age,&.item-ampm{
          float: left;
          width: calc(30% - 6px);
          margin-left: 6px;
        }
        .search-select{
          width: 100%;
        }
      }
    }
  }
}
</style>
