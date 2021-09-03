<!--
 * @Date: 
 * @LastEditTime: 
 * @Description: 系统初始化
 * @FilePath: 
-->
<template>
  <div class="content">
    <div class="his-module his-small scroll-bar">
      <div class="row" style="height: 32px; margin-bottom: 16px ">
        <div class="label">
          <span class="title">{{$t('系统初始化')}}</span>
          <el-divider class="mr4" direction="vertical"></el-divider>
          <div class="btn">
            <el-button size="mini" type="text" @click="handleDialog">
              <i class="icon his-caozuo_chushihua green"></i>初始化
            </el-button>
          </div>
        </div>
      </div>
      <el-row v-for="(item,index) in treeData" :key="index">
        <el-col>
          <div class="row">
            <div class="label">
              <i class="icon blue" :class="[item.icon]" style="margin-right:8px"></i>
              <span class="title">{{item.officename}}</span>
            </div>
          </div>
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              :label="item1"
              border
              v-for="(item1,index) in item.childrenList"
              :key="index"
              :disabled="item1.init == 1 ? true : false"
              :value="item1"
            >{{item1.officename}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="提示"
      :visible.sync="initialDialog"
      width="30%"
      class="narrow-dialog"
      @close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="row" style="border: none; margin-bottom: 0; padding: 10px 16px">
        <div class="label">
          <span style="white-space: nowrap; margin-right: 8px">密码</span>
          <el-input show-password v-model="passward" placeholder="请输入密码" maxlength="20"/>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="initialDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleInitial">初始化</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang='ts' >
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { initialList, initialSystem } from '@/api/his/sys/centerMaintenance/medicareInfoManage/systemInitialization.ts'
import { Script } from 'vm'
import { log } from 'util'
import { forEach } from 'jszip'
@Component({
  name: 'systemInitialization',
  components: {}
})
export default class extends Vue {
  private listSlotHeight: number = 0 //列表高度
  private initialDialog: boolean = false // 初始化弹框默认隐藏
  private passward: any = '' // 密码
  private checkList: Array<any> = []
  private treeData: Array<any> = []
  private iconList: Array<any> = ['his-caidan_guahaoshoufei', 'his-caidan_yaoku', 'his-menu_taifang', 'his-basic-info', 'his-nurse-station', 'his-menu_inpatient_icon'] // 图标数组
  private isInit: boolean = false // 判断是否初始化
  // 获取列表数据并为childrenList为null时重新赋值
  private getInitialSys() {
    initialList({}).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.treeData = res.data
        for (let j = 0; j < this.treeData.length; j++) {
          if (this.treeData[j].childrenList == null) {
            this.treeData[j].childrenList = [
              {
                groupid: this.treeData[j].groupid,
                officeid: this.treeData[j].officeid,
                officename: this.treeData[j].officename,
                init: this.treeData[j].init
              }
            ]
          }
        }
        for(let i = 0; i<this.treeData.length; i++){
          this.$set(this.treeData[i],'icon',this.iconList[i])
          for(let j=0; j<this.treeData[i].childrenList.length; j++) {
            if(this.treeData[i].childrenList[j].init == 1) {
              this.checkList.push(this.treeData[i].childrenList[j])
            }
          }
        }
        console.log(this.treeData);
        console.log(this.checkList);
      }
    })
  }

  // 打开初始化弹框
  private handleDialog() {
    let selectArr = this.checkList.filter((item: any)=> {
      return item.init == 0
    })
    if(selectArr.length == 0) {
      this.$message({
        message: '请先选择再初始化！',
        type: 'warning'
      })
    } else {
      this.initialDialog = true
    }
  }

  // 初始化
  private handleInitial() {
    console.log(this.userInfo.userId);
    console.log(this.checkList);
    let childrenList = this.checkList.filter((item: any)=> {
      return item.init == 0
    })
    console.log(childrenList);
    const params: any = {
      childrenList: childrenList,
      password: this.passward,
      userid: this.userInfo.userId
    }
    initialSystem(params).then((res: any)=> {
      if(res.errorCode == "SUCCESS") {
        this.$notify({
          title: '初始化成功',
          message: '',
          type: 'success'
        })
        this.initialDialog = false
        this.getInitialSys()
      } 
    })
  }

  // private isInitial() {
  //   for
  // }

  // 弹窗关闭事件
  private handleClose() {
    this.passward = ''
    console.log(this.passward);
    
  }

  // 获取用户名
  get userInfo() {
    return JSON.parse(localStorage.userInfo)
  }

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  mounted() {
    this.getInitialSys()
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-checkbox.is-bordered + .el-checkbox.is-bordered {
  width: 132px;
  height: 40px;
  background: rgba(245, 246, 248, 1);
  border-radius: 2px;
  border: 1px solid rgba(240, 240, 240, 1);
}
::v-deep .el-checkbox.is-bordered.el-checkbox--medium {
  width: 132px;
  height: 40px;
  background: rgba(245, 246, 248, 1);
  border-radius: 2px;
  border: 1px solid rgba(240, 240, 240, 1);
  margin-bottom: 16px;
  margin-right: 10px;
  margin-left: 0;
}


::v-deep .el-checkbox__label {
  padding-left: 8px !important;
}
.title:not(:first-child) {
  font-size: 14px;
}

.row {
  padding-bottom: 4px;
  margin-bottom: 10px;
}

.content .his-small .row .label {
  height: 14px;
}

.el-checkbox {
  margin-right: 0;
}

pre{
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 10px;
}
</style>