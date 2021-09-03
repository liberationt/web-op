<template>
  <div class="expand">
    <el-row class="expand-row">
      <el-col :span="5">
        <span class="expand-key">卡号: </span>
        <span class="expand-value">{{ row.jzkh }}</span>
      </el-col>
      <el-col :span="5">
        <span class="expand-key">证件类别: </span>
        <span class="expand-value">{{ row.cardtypeName }}</span>
      </el-col>
      <el-col :span="5">
        <span class="expand-key">证件号: </span>
        <span class="expand-value">{{ row.sfzh }}</span>
      </el-col>
      <el-col :span="5">
        <span class="expand-key">联系电话: </span>
        <span class="expand-value">{{ row.lxdh }}</span>
      </el-col>
      <el-col :span="4">
        <!-- <span class="expand-key">出生日期: </span>
                <span class="expand-value">{{ row.csny }}</span> -->
        <span class="expand-key">户籍标识: </span>
        <span class="expand-value">{{ row.hjbzName }}</span>
      </el-col>
    </el-row>
    <el-row class="expand-row">
      <el-col :span="5">
        <span class="expand-key">现住址: </span>
        <span class="expand-value">{{  row.xzzSqsName + row.xzzSName + row.xzzXName }}</span>
        <!-- + row.xzzQtdz -->
      </el-col>
      <el-col :span="5">
        <!-- <span class="expand-key">籍贯: </span>
                <span class="expand-value">{{ row.jgdmSqs + row.jgdmS }}</span> -->
        <span class="expand-key">职业: </span>
        <span class="expand-value">{{ row.zydm }}</span>
      </el-col>
      <el-col :span="5">
        <span class="expand-key">国籍: </span>
        <span class="expand-value">{{ row.gjdm }}</span>
      </el-col>
      <el-col :span="5">
        <span class="expand-key">民族: </span>
        <span class="expand-value">{{ row.mzdm }}</span>
      </el-col>
      <el-col :span="4">
        <span class="expand-key">婚姻状况: </span>
        <span class="expand-value">{{ row.hyzk }}</span>
      </el-col>
    </el-row>
    <el-row class="expand-row">
      <el-col :span="5">
        <span class="expand-key">联系人姓名: </span>
        <span class="expand-value">{{ row.lxrm }}</span>
      </el-col>
      <el-col :span="5">
        <span class="expand-key">与患者关系: </span>
        <span class="expand-value">{{ row.lxgx }}</span>
      </el-col>
      <el-col :span="5">
        <span class="expand-key">联系电话: </span>
        <span class="expand-value">{{ row.lxdh }}</span>
      </el-col>
      <!-- <el-col :span="5">
                <span class="expand-key">职业: </span>
                <span class="expand-value">{{ row.occupationTypeName }}</span>
            </el-col> -->
      <el-col :span="4">
        <span class="expand-key">复诊: </span>
        <span class="expand-value">
          <el-checkbox :value="row.firstFlag == '2'" style="margin-left: 16px;" disabled>工伤</el-checkbox>
          <el-checkbox :value="row.firstFlag == '2'" style="margin-left: 16px;" disabled>大病</el-checkbox>
          <el-checkbox :value="row.firstFlag == '2'" style="margin-left: 16px;" disabled>义诊</el-checkbox>
          <el-checkbox :value="row.firstFlag == '2'" style="margin-left: 16px;" disabled>复诊</el-checkbox>
        </span>
      </el-col>
    </el-row>
    <el-row class="expand-row">
      <el-col :span="5">
        <span class="expand-key">挂号时间: </span>
        <span class="expand-value">{{ row.ghsj }}</span>
      </el-col>
      <el-col :span="5">
        <span class="expand-key">挂号科室: </span>
        <span class="expand-value">{{ row.ghks }}</span>
      </el-col>
      <el-col :span="5">
        <span class="expand-key">挂号医生: </span>
        <span class="expand-value">{{ row.ghys }}</span>
      </el-col>
      <!-- <el-col :span="5">
                <span class="expand-key">挂号类别: </span>
                <span class="expand-value">{{ row.regTypeName }}</span>
            </el-col> -->
      <el-col :span="4">
        <span class="expand-key"> </span>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
// import { dictExecuteSql } from '@/websql/functions'

@Component({
  name: 'queueNumber',
  //组件引用
  components: {},
  props: {
    row: Object,
  },
  filters: {},
})
export default class extends Vue {


//   mounted() {
//     this.sfzList = this.$store.state.webSqlDict.IDCARD_DICT
//     this.hjList = this.$store.state.webSqlDict.HJTYPE_DICT
//   }

//   getName(value: string, list: any[]) {
//           console.log('list',list)

//     if (list.length > 0) {
//       let cc: any = list.find((item: any) => item.dv == value)
//       if (cc && cc.dn) return cc.dn
//     }
//   }

//   getArea(kidList: any[]) {
//     const _that = this
//     let cc: string = ''

//     kidList.forEach((item: any) => {
//       const sql = 'select * from TB_REGION where kid=' + item
//       let name = ''
//       dictExecuteSql(
//         sql,
//         (tx: any, result: any) => {
//           name = result.rows[0].kname
//         },
//         (tx: any, err: any) => {
//           console.log(tx, err)
//         }
//       )
//       cc = cc.concat(name)
//       console.log('dd', cc)
//     })
//   }
}
</script>
<style lang="scss">
.expand {
  padding: 16px 24px;
  td .ivu-table-expanded-cell {
    padding: 20px 50px 0 50px !important;
  }
  .ivu-checkbox-wrapper .ivu-checkbox-checked .ivu-checkbox-inner {
    border-color: none !important;
    background: none !important;
  }
  .ivu-checkbox-inner::after {
    border-color: none !important;
  }
}
.expand-row {
  margin-bottom: 16px;
}
</style>
