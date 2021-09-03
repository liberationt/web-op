<template>
    <div class="his-module his-small">
        <div v-if="resData.sqlx == 1"
             class="scroll-bar">
            <el-form :model="formData"
                     ref="sylyForm"
                     style="margin-top:8px"
                     :rules="rules"
                     label-width="120px">
                <el-row type="flex"
                        justify="start"
                        v-for="item in drugList"
                        :key="item.jlxh">
                    <el-col :span="24">
                        <el-form-item :label="item.fymc"
                                      prop="syly"
                                      style="width:100%"
                                      label-width="100px">
                            <el-input type="textarea"
                                      :rows="3"
                                      v-model="item.syly"
                                      placeholder=" "></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div v-if="resData.sqlx == 2"
             class="scroll-bar"
             style="margin:0 auto;width:500px">
            <el-form :model="formData"
                     ref="sjysForm"
                     style="margin-top:8px"
                     :rules="rules"
                     label-width="90px">
                <el-row type="flex"
                        justify="start">
                    <el-col :span="24">
                        <el-form-item label="登录名"
                                      prop="loginName"
                                      style="width:100%"
                                      label-width="100px">
                            <el-input v-model="formData.loginName"
                                      placeholder=" "></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex"
                        justify="start">
                    <el-col :span="24">
                        <el-form-item label="密码"
                                      prop="passwd"
                                      style="width:100%"
                                      label-width="100px">
                            <el-input v-model="formData.passwd"
                                      type="passwd"
                                      placeholder=" "></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div v-if="resData.sqlx == 3">
            <el-tabs class="tab-basic"
                     v-model="tabsName">
                <el-tab-pane :label="'申请单' + (index+1)"
                             :name="reqItem.name"
                             v-for="(reqItem,index) in reqItemList"
                             :key="index">
                    <div class="scroll-bar"
                         :style="{height:(listSlotHeight - 80) + 'px'}">
                        <req-form v-if="reqItem.sfwtsjsyhz == 0"
                                  ref="reqForm"
                                  activeOrPassive='Passive'
                                  reqOrExamine='req'
                                  :formData="reqItem" />
                        <reqFormTS v-else
                                   ref="reqForm"
                                   @close='handleSuccess'
                                   reqOrExamine='req'
                                   activeOrPassive='Passive'
                                   :formData="reqItem" />
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script lang="ts">
  import { deepCopy } from '@/utils'
  import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
  import reqForm from '@/views/cis/op/dctwork/patients/components/model/reqForm.vue'
  import reqFormTS from '@/views/cis/op/dctwork/patients/components/model/reqFormTS.vue'
  import { initManage,updateAntibioticsStatus,checkAntimicrobialRights,saveAntibiotics } from '@/api/his/im/residentDoctor/orderEntry'

  @Component({
    name: 'antibioticsReq',
    components:{
      reqForm,
      reqFormTS
    }
  })
  export default class extends Vue {
    @Prop({ required: true }) private resData!: any
    @Prop({ required: true }) private patientFile!: any
    private searchData:any = {
      zt:'1'
    }
    private drugList:Array<any> = []
    private reqForm:any = {
      "sqys": "",
      "sqsj": "",
      "ypList": [],
      "hzzjList": [],
      "zyhm": "",
      "brxm":"",
      "brxb":"",
      "brch":"",
      "csrq":"",
      "rynl":"",
      "brks":"",
      "yymd": 1,
      "zz": "",
      "tz": "",
      "tw": "",
      "wbc": "",
      "jg": "",
      "byxjc": "1",
      "lhsy": true,
      "syly": "",
      "sqysdm":''
    }
    private listSlotHeight: number = 0 //列表高度
    private reqFormVisible:boolean = false
    private reqFormKey:number = 0
    private maxkssdj:number = 0
    private currRowItem:any = null
    private formData:any = {}
    private rules:any = {
      loginName:[ { required: true, message: '请输入登录名', trigger: 'blur' },],
      passwd:[ { required: true, message: '请输入密码', trigger: 'blur' },]
    }
    private reqItemList:Array<any> = []
    private ypyfList: Array<any> = [] // 药品用法字典
    private tabsName:string = ''
    created() {
      this.listSlotHeight = Vue.prototype.PageHeight - 51 - 40 - 20
    }
    mounted() {
      this.ypyfList = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.DRUG_METHOD_DICT : this.$store.state.webSqlDict.DRUG_METHOD_DICT
      this.init()
    }
    get userInfo() {
      return JSON.parse(localStorage.userInfo)
    }
    private init() {
      debugger
      switch(this.resData.sqlx) {
        case 1:
          this.drugList = []
          this.resData.currTable.forEach((item:any) =>{
            this.drugList.push(item)
          })

          break;
        case 2:
          this.resData.currTable.map((item:any,index:number) => {
            item.sqlx = this.resData.sqlx
            if(index == 0) this.maxkssdj = item.kssdj
            else {
              if(item.kssdj > this.maxkssdj) this.maxkssdj = item.kssdj
            }
          })
          break;
        case 3:
          console.log(this.patientFile)
          this.reqItemList = []
          this.reqForm.zyhm = this.patientFile.zyhm
          this.reqForm.zyh = this.patientFile.zyh
          this.reqForm.brxm = this.patientFile.brxm
          this.reqForm.zyhm = this.patientFile.zyhm
          this.reqForm.zyhm = this.patientFile.zyhm
          this.reqForm.brxb = this.patientFile.brxb == 1 ? '男' : '女'
          this.reqForm.csrq = this.patientFile.csrq
          this.reqForm.rynl = this.patientFile.rynl
          this.reqForm.mqzd = this.patientFile.mqzd
          this.reqForm.gms = this.patientFile.gmyw
          this.reqForm.brks = this.patientFile.brksName
          this.reqForm.sqys = this.userInfo.name
          this.reqForm.sqysdm = this.userInfo.userId
          for(var i=0; i < this.resData.currTable.length; i++){
            let item = this.resData.currTable[i]
            let newReqForm = deepCopy(this.reqForm)
            newReqForm.refs = 'refs'+i
            newReqForm.name = 'name'+i
            let nowDrug:any = this.resData.currTable.filter((drug:any) => { return drug.jlxh == item.jlxh }) // 医嘱内找到本条药品
            if(nowDrug.length != 1) continue
            let ypyf = this.ypyfList.filter((drug:any) => nowDrug[0].ypyf == drug.dv)
            if(ypyf.length == 1) nowDrug[0].ypyf_text = ypyf[0].dn
            nowDrug[0].kjywzdts = this.resData.kjywzdts
            newReqForm.sfwtsjsyhz = item.kssdj == 3 ? 1 : 0 //  1 会诊申请  0 普通申请
            newReqForm.yzzh = item.yzzh
            if(i==0){
              newReqForm.ypList.push(nowDrug[0])
              this.reqItemList.push(newReqForm)
            }else {
              if(item.yzzh == this.resData.currTable[i-1].yzzh) { // 同组
                if(newReqForm.sfwtsjsyhz == 1) {
                  newReqForm.ypList.push(nowDrug[0])
                  this.reqItemList.push(newReqForm)
                }else{
                  let indexOf = this.reqItemList.findIndex((io:any) => io.yzzh == item.yzzh && io.sfwtsjsyhz  == newReqForm.sfwtsjsyhz)
                  this.reqItemList[indexOf].ypList.push(nowDrug[0])
                }
              }else {
                newReqForm.ypList.push(nowDrug[0])
                this.reqItemList.push(newReqForm)
              }
            }
          }
          this.tabsName = 'name0'
          // console.log(this.reqItemList)
          break;
      }
    }
    handleDetermine(){
      switch(this.resData.sqlx) {
        case 1:
          console.log(this.drugList)
          updateAntibioticsStatus(JSON.stringify(this.drugList)).then(res => {
            this.$notify({message:'',type:'success',title:'保存成功！'})
            this.$emit('close')
          })
          break;
        case 2:
          (this.$refs.sjysForm as any).validate((valid:boolean) => {
            if (valid) {
              checkAntimicrobialRights({...this.formData,kssdj:this.maxkssdj}).then(res => {
                if(res.data == 0) {
                  this.$message({message:'用户名与密码不匹配或该医生无权限，请重新输入！'})
                }else {
                  updateAntibioticsStatus(JSON.stringify(this.resData.currTable)).then(res => {
                    this.$notify({message:'',type:'success',title:'保存成功！'})
                    this.$emit('close')
                  })
                }
              })
            } else {
              return false;
            }
          });
          break;
        case 3:
          let nowArr:Array<any> = []
          const reqItemRef:any = this.$refs.reqForm
          reqItemRef.map((reqItem:any) => {
            let formData:any = reqItem.handleConfirm()
            console.log(formData)
            if(formData) nowArr.push(formData)
          })
          console.log(nowArr)
          if(nowArr.length == this.reqItemList.length) {
            saveAntibiotics(JSON.stringify(nowArr)).then((res:any) => {
              this.$notify({message:'',type:'success',title:'保存成功！'})
              this.$emit('close')
            })
          } else {
            return false
          }
          break;
      }
    }
    private handleConfirm(){
      const reqForm:any = this.$refs.reqForm
      reqForm.handleConfirm()
    }
    private handleSuccess() {

    }
  }
</script>
<style lang="scss">

</style>
<style lang='scss' scoped>
  .his-small ::v-deep .el-form .el-form-item .el-form-item__label {
    line-height: 15px;
  }
</style>
