<template>
  <div class="content">
    <div class="his-module his-small ht">
      <div class="row">
        <div class="label">
          <div class="title">挂号日报表</div>
          <el-divider direction="vertical"></el-divider>
          <el-date-picker
            type="date"
            v-model="htmlSearchData.ghsj"
            :placeholder="'请选择日期'"
            value-format="yyyy-MM-dd"
            class="date-wrapper"
          ></el-date-picker>
          <el-divider direction="vertical"></el-divider>
          <div class="btn">
            <el-button
              type="text"
              size="mini"
              @click="query"
            >
              <i class="icon his-caozuo-Details blue"></i>
              <span>查询</span>
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="print"
            >
              <i class="icon his-btn-print blue"></i>
              <span>打印</span>
            </el-button>
          </div>
        </div>
      </div>

      <div class="statement-box">
        <statement
          ref="statement"
          html-api="/op-service/ghrbReport/registerDailyTableView"
          :html-search-data="htmlSearchData"
          :height="listSlotHeight"
          :print-arg="{
            top: '8%',
            left: '10%',
            width: '90%',
            height: '87%'
          }"
        />
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { getNow } from '@/api/his/basic'
import { parseTime } from '@/utils'

declare interface IObj {
  [key: string]: string
}

@Component({
  name: ''
})

export default class extends Vue {
	private obj: IObj = {
    name: '',
    value: '',
  }
  // private date: any = ''
  private formData: any = {}
  private htmlSearchData: any = {
    ghsj: ''
  }

  get listSlotHeight(){
    return Vue.prototype.PageHeight - 80
  }

  // 获取当前时间
  private getTime(){
    getNow().then((res: any) => {
      if(res){
        this.htmlSearchData.ghsj = parseTime(res.data, '{y}-{m}-{d}')
      }
    })
  }

  // 查询
  private query(){
    if(!this.htmlSearchData.ghsj){
      this.$notify({
        title: '请选择日期',
        message: '',
        type: 'error'
      })
      return
    }
    const statement: any = this.$refs.statement
    statement.getTableUrl()
  }

  // 打印
  private print(){
    const statement: any = this.$refs.statement
    statement.printTable()
  }


  //初始化的周期函数
	created() {
    this.getTime()
  }
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.el-date-editor ::v-deep{
  width: 180px;
}

.statement-box {
  width: 700px;
  // padding: 0 4rem;
}
</style>
