<template>
  <!-- 预约更改 -->
  <el-dialog
    :title="'预约更改'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="600px"
    class="narrow-dialog"
    @closed="reset"
  >
    <div class="his-module his-small">
      <el-form :model="formData" ref="formData" label-width="60px" class="clearfix">
        <!-- 姓名 -->
        <el-form-item :label="'姓名'" prop="brxm" disabled>
          <el-input
            v-model="formData.brxm"
            :placeholder="'姓名'"
          ></el-input>
        </el-form-item>

        <!-- 性别 -->
        <el-form-item :label="'性别'" prop="brxb" disabled>
          <search-select
            table-name="SYS_PRIMARY_DATA"
            kid="PD0000000269"
            v-model="formData.brxb"
            :backfillValue="formData.brxb"
            :disabled="true"
            :placeholder="'性别'"
            class="no-arrow"
          />
        </el-form-item>

        <!-- 预约科室 -->
        <el-form-item :label="'预约科室'" prop="ksdm">
          <el-select
            v-model="formData.ksdm"
            :placeholder="'请选择预约科室'"
            @change="changeGhks"
          >
            <el-option
              v-for="item in deptList"
              :key="item.dv"
              :value="item.dv"
              :label="item.dn"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 预约医生 -->
        <el-form-item :label="'预约医生'" prop="ysdm">
          <el-select
            v-model="formData.ysdm"
            :placeholder="'请选择预约医生'"
            clearable
            @clear="formData.ysdm=''"
          >
            <el-option
              v-for="item in docList"
              :key="item.ysdm"
              :value="Number(item.ysdm)"
              :label="item.personName"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 预约日期 -->
        <el-form-item :label="'预约日期'" prop="yyrq">
          <el-date-picker
            v-model="formData.yyrq"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :picker-options="pickerOptions"
            class="date-wrapper"
          ></el-date-picker>
        </el-form-item>

        <!-- 类别 -->
        <el-form-item :label="'类别'" prop="zblb">
          <search-select
            class="w100"
            table-name="SYS_DICT_CONFIG"
            kid="77"
            v-model="formData.zblb"
            :placeholder="$t('请选择班次')"
            :backfillValue="formData.zblb"
          />
        </el-form-item>

        <!-- 预约序号 -->
        <el-form-item :label="'预约序号'" prop="yyxh" hidden>
          <el-input
            v-model="formData.yyxh"
            :placeholder="'预约序号'"
          ></el-input>
        </el-form-item>

        <!-- 性别限制 -->
        <el-form-item :label="'性别限制'" prop="xbxz" hidden>
          <el-input
            v-model="formData.xbxz"
            :placeholder="'性别限制'"
          ></el-input>
        </el-form-item>

        <!-- 年龄限制 -->
        <el-form-item :label="'年龄限制'" prop="nlxz" hidden>
          <el-input
            v-model="formData.nlxz"
            :placeholder="'年龄限制'"
          ></el-input>
        </el-form-item>

      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { aDeptDocList } from '@/api/his/op/reg/docSchedule'
import { aCheckModify, aModifyAppointment, aYyglQuery } from '@/api/cis/op/dctwork/appointmentQuery'
import { aDocSchList } from '@/api/his/op/reg/docSchedule'
import { getNow } from '@/api/his/basic'
import { parseTime } from '@/utils'

@Component({
  name: ''
})

export default class extends Vue {
  @Prop({ required: true, default: () => ({}) }) private deptList: any // 科室列表

	private dialogVisible: boolean = false
  private formData: any = {
    brxm: '',
    brxb: '',
    ksdm: '',
    ysdm: '',
    yyrq: '',
    zblb: '',
    yyxh: '', // 预约序号 hidden
    xbxz: '', // 性别限制
    nlxz: '', // 年龄限制
  }
  private docList: any[] = []
  private ampm: string|null = ''
  //当天日期以前的日期禁用
  private pickerOptions: any = {
    disabledDate(time: any) {
      return time.getTime() < Date.now()  //如果没有后面的-8.64e6是不可以选择当天的
    },
  }

  // 更改前校验
  private checkModify(appointmentInfo: any){
    if(!appointmentInfo.brid){
      this.$notify({
        title: '请先选择预约患者',
        message: '',
        type: 'warning'
      })
      return false
    }
    // 0预约，1履约，2失约，3收费，4退约
    // if(appointmentInfo.sfqh){
    //   this.$notify({
    //     title: '预约已取号，无法更改',
    //     message: '',
    //     type: 'error'
    //   })
    //   return false
    // }
    if(appointmentInfo.ghbz == 1){
      this.$notify({
        title: '已履约，无法更改',
        message: '',
        type: 'error'
      })
      return false
    }
    if(appointmentInfo.ghbz == 2){
      this.$notify({
        title: '预约已过期，无法更改',
        message: '',
        type: 'error'
      })
      return false
    }
    if(appointmentInfo.ghbz == 4){
      this.$notify({
        title: '已退约，无法更改',
        message: '',
        type: 'error'
      })
      return false
    }
    let params = {
      brid: appointmentInfo.brid,
      yyxh: appointmentInfo.yyxh
    }
    aCheckModify(params).then((res: any) => {
      if(res.errorCode == "SUCCESS"){
        if(res.data){
          this.openDialog(appointmentInfo)
        } else {
          this.$message.error('抱歉，您的预约更改次数已达上限或爽约次数过多')
        }
      }
    })
  }

  // 打开弹窗
  private openDialog(appointmentInfo: any){
    this.dialogVisible = true
    // getNow().then((res: any) => {
    //   if(res){
    //     this.ampm = parseTime(res.data, '{b}')
    //   }
    // })
    for(let i in this.formData){
      this.formData[i] = appointmentInfo[i]
    }
    this.getDocList()
  }

  // 关闭时
  private reset(){
    const formData: any = this.$refs.formData
    formData.resetFields()
  }

  // 选择科室
  private changeGhks(){
    this.formData.ysdm = ''
    this.getDocList()

    // 查询限制条件
    for(let i of this.deptList){
      if(i.dv == this.formData.ksdm){
        this.formData.xbxz = i.xbxz
        this.formData.nlxz = i.nlxz
        break
      }
    }
  }

  // 获取科室医生列表
  private getDocList(){
    let params = {
      zblb: this.formData.zblb,
      ksdm: this.formData.ksdm,
      gzrq: this.formData.yyrq
    }
    aDocSchList(params).then((res: any) => {
      if(res.errorCode == "SUCCESS"){
        this.docList = res.data.filter((el: any)=> {
          return el.ksdm == this.formData.ksdm 
        })
      }
    })
  }

  // 确认按钮
  private async handleConfirm(){
    // 挂号科室限制条件
    if(this.formData.xbxz != null){
      if(this.formData.xbxz != this.formData.brxb){
        this.$message({
          message: '该科室与患者性别不符',
          type: 'error'
        })
        return false
      }
    }
    if(this.formData.nlxz != null){
      if(this.formData.nlxz < this.formData.age){
        this.$message({
          message: '患者年龄超过该科室年龄限制',
          type: 'error'
        })
        return false
      }
    }


    // 查询科室是否排班
    let params = {
      ghrq: this.formData.yyrq,
      kslb: this.formData.ksdm,
      zblb: this.formData.zblb
    }
    let res: any = await aYyglQuery(params)
    if(res){
      if(res.data.list.length==0){
        this.$notify({
          title: '该科室未查询到排班信息',
          message: '',
          type: 'error'
        })
        return false
      }
    }

    // 查询医生是否排班
    // if(this.formData.ysdm!==''){

    //   let params2 = {
    //     gzrq: this.formData.yyrq,
    //     zblb: this.formData.zblb
    //   }
    //   let res2: any = await aDocSchList(params2) // 当天所有排班医生
    //   if(res2){
    //     // let docAllDept
    //     // res.data.forEach((item: any)=>{
    //     //   docAllDept.push(item.)
    //     // })
    //     let existPb // 存在排班信息
    //     for(let i of res2.data){
    //       if(i.ysdm == this.formData.ysdm && i.ksdm == this.formData.ksdm){
    //         existPb = true
    //         break
    //       }
    //     }
    //     if(!existPb){
    //       this.$notify({
    //         title: '该医生未查询到排班信息',
    //         message: '',
    //         type: 'error'
    //       })
    //       return false
    //     }
    //   }

    // }

    aModifyAppointment(this.formData).then((res: any) => {
      if(res){
        this.$notify({
          title: '预约更改成功',
          message: '',
          type: 'success'
        })
        this.dialogVisible = false
        this.$emit('succeeded')
      }
    })
  }



	created() {
  }
  mounted() {
    // this.getLists()
	}
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper{
	::v-deep .el-dialog__body{
		padding-top: 8px;
	}
}

.el-form{
	.el-form-item{
		display: block;
		float: left;
    width: calc((100% - 20px*1)/2);
    margin-left: 20px;
    &:nth-child(2n+1){
      margin-left: 0;
    }
		margin-bottom: 8px!important;
		::v-deep .el-form-item__content{
			width: auto;
			margin-left: 60px!important;
		}
    &[hidden]{
      display: none;
    }
  }
}

</style>