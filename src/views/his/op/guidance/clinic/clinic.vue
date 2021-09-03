<template>
  <div class="content">
    <!-- 搜索 -->
    <div class="search his-module">
      <el-row class="ht" :gutter="10" style="width: 100%">
        <el-col :span="4">
          <div class="block">
            <div class="title" style="width: 88px"> 服务台: </div>
            <el-input v-model="searchData.zsmc" :placeholder="$t('clinic.searchTips')" @keydown.enter.native="handleSearchClinic">
              <i slot="prefix" class="el-input__icon icon his-search"></i>
            </el-input>
          </div>
        </el-col>
        <el-col :span="20">
          <div class="block">
            <div class="title" style="width: 150px">服务台管理的诊室:</div>
            <el-input v-model="searchSelect.zsmc" :placeholder="$t('clinic.searchTips')" @keydown.enter.native="handleSearchZs" style="width: 200px">
              <i slot="prefix" class="el-input__icon icon his-search"></i>
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row class="ht mt10" :gutter="10">
      <el-col class="ht" :span="4">
        <div class="his-module his-small">
          <pagenation-list ref="pageTable" data-url="/opfwtxx/queryPage" v-model="list" :searchData="searchData" http-method="post" :pageProps="pageProps" :list-height="listSlotHeight">
            <div slot="header" class="row">
              <div class="label">
                <!-- 标题 -->
                <h1 class="title">{{$t('reception.title')}}</h1>
              </div>
            </div>
            <!-- :data="tableFormat" -->
            <el-table slot="list" stripe :highlight-current-row="true" :data="list" border :height="listSlotHeight" :row-class-name="tableRowClassName" class="scroll-bar" @row-click="rowClick">
              <!-- 诊室名称 -->
              <el-table-column prop="zsmc" :label="$t('clinic.clinic')" min-width="150"></el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <!-- 授权诊室 -->
      <el-col class="ht" :span="10">
        <div class="his-module">
          <div slot="header" class="row" style="height:41px">
            <div class="label">
              <el-checkbox v-model="checkedLeft"></el-checkbox>
              <h1 style="margin-left:8px" class="title">{{$t('clinic.centerTitle')}}</h1>
            </div>
          </div>
          <el-input v-model="searchLeft.queryName" class="queryInput" @keydown.enter.native="queryUserLeft" :placeholder="$t('common.placeholder')">
            <i slot="prefix" class="el-input__icon icon his-search"></i>
          </el-input>
          <!--    <pagenation-list
            ref="pageLeft"
            data-url="/sysuser/haveListByGroupIdPage"
            v-model="leftArr"
            :searchData="searchLeft"
            :pageProps="pageProps"
            prec="30"
            :list-height="listSlotHeightR"
            http-method="post"
          > -->
          <div slot="list" class="scroll-bar" style="margin-top:8px" :style="{height: listSlotHeightR+'px'}">
            <el-checkbox-group v-model="checkedCitiesLeft">
              <el-checkbox class="checkboxItem" v-for="(item,index) in leftArr" :label="item.sbxh" :key="item.sbxh">{{item.zsmc}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <!-- </pagenation-list> -->
          <!-- 穿梭按钮 -->
          <div class="left-right">
            <div style="margin-bottom:26px">
              <el-button :type="checkedCitiesRight.length!=0 ? 'primary': 'info'" :disabled="checkedCitiesRight.length==0" circle @click="toLeft">
                <i class="icon his-lt-arrow"></i>
              </el-button>
            </div>
            <div>
              <el-button :type="checkedCitiesLeft.length!=0 ? 'primary': 'info'" :disabled="checkedCitiesLeft.length==0" circle @click="toRight">
                <i class="icon his-rt-arrow"></i>
              </el-button>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="ht" :span="10">
        <div class="his-module">
          <div slot="header" class="row" style="height:41px">
            <div class="label">
              <el-checkbox v-model="checkedRight"></el-checkbox>
              <h1 style="margin-left:8px" class="title">{{$t('uAutSet.rightTitle')}}</h1>
            </div>
          </div>
          <el-input v-model="searchRight.queryName" class="queryInput" @keydown.enter.native="queryUserRight" :placeholder="$t('uAutSet.rightPlh')">
            <i slot="prefix" class="el-input__icon icon his-search"></i>
          </el-input>
          <!--  <pagenation-list
            ref="pageRight"
            data-url="/sysuser/noListByGroupIdPage"
            v-model="rightArr"
            :searchData="searchRight"
            :pageProps="pageProps"
            prec="30"
            :list-height="listSlotHeightR"
            http-method="post"
          > -->
          <div slot="list" class="scroll-bar" style="margin-top:8px" :style="{height:listSlotHeightR+'px'}">
            <el-checkbox-group v-model="checkedCitiesRight">
              <el-checkbox class="checkboxItem" v-for="(item,index) in rightArr" :label="item.sbxh" :key="item.sbxh">{{item.zsmc }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <!-- </pagenation-list> -->
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { queryChoosed, queryToChoose, editChoose, queryFwtByZsmc } from '@/api/his/op/guidance/clinic/clinic.ts'
import { id2Name } from '@/utils'
import { Form } from 'element-ui'
import { AxiosResponse } from 'axios'


@Component({
  name: 'clinic',
  filters: {},
  components: {},
})

export default class extends Vue {
  private searchData: any = {
    pageNum: 1,
    pageSize: 20,
    sfky: 0,
    zsmc: '',
  }
  private searchSelect: any = {
    zsmc: '',
  }
  private list: any = []
  private listHeight: number = 0 // 服务台列表高度
  private listSlotHeight: number = 0 //列表高度
  private listSlotHeightR: number = 0 //列表高度
  // fixme: 修改后的
  private checkedLeft: boolean = false
  private searchLeft: any = {
    groupId: '',
    queryName: '',
  }
  private searchRight: any = {
    groupId: '',
    queryName: '',
  }
  private pageProps: object = { layout: 'total, sizes, prev, next' }
  private leftArr: Array < any > = []
  private checkedCitiesLeft: Array < any > = []
  private checkedRight: boolean = false
  private checkedCitiesRight: Array < any > = []
  private rightArr: Array < any > = []
  private currRow: any = {}


  created() {
    // 计算服务台列表高度
    this.listHeight = Vue.prototype.PageHeight - 130
    // 计算表格列表高度
    this.listSlotHeight = Vue.prototype.PageHeight - 114
    this.listSlotHeightR = Vue.prototype.PageHeight - 144
  }



  mounted() {
    this.getReceptionList()
    // this.queryRecept()
  }

  private getReceptionList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }


  // 查询服务台
  private rowClick(value: any) {

    this.currRow = value
    this.checkedCitiesLeft = []
    this.checkedCitiesRight = []
    this.checkedLeft = false
    this.checkedRight = false
    this.searchLeft.fwtid = value.rid
    this.searchRight.fwtid = value.rid
    queryChoosed({ fwtid: value.rid }).then((res: AxiosResponse) => {
      this.leftArr = res.data
    })
    queryToChoose({}).then((res: AxiosResponse) => {
      this.rightArr = res.data
    })
  }

  // 查询诊室
  private handleSearchClinic() {
    this.getReceptionList()
  }

  private handleSearchZs() {

    this.list.forEach((item: any) => {
      item.webRowStatus = false
    })
    this.$nextTick(() => {
      if (this.searchSelect.zsmc == '') {
        // code...
        this.$notify.warning('请输入诊室名称查询')
        return
      }
      queryFwtByZsmc({ zsmc: this.searchSelect.zsmc }).then((res: AxiosResponse) => {
        let that = this
        let cc = that.list.findIndex((item: any) => item.rid == res.data.fwtid)
        if (cc > -1) {
          that.list[cc].webRowStatus = true
          this.rowClick(this.list[cc])
        }
      })
    })

  }

  private tableRowClassName({ row, rowIndex }: any) {
    if (row.webRowStatus) {
      return 'success-row'
    }
  }
  // 诊室输入框清除
  private clearClinic() {
    this.searchData.zsmc = ''
    // this.getList()
  }


  // 右传左
  private toLeft() {
    editChoose({
      fwtid: this.currRow.rid,
      sbxhList: this.checkedCitiesRight,
      type: 1
    }).then((res: any) => {
      this.rowClick(this.currRow)
      this.$notify({
        title: this.$t('uAutSet.succtip') + '',
        message: '',
        type: 'success',
      })
    })
  }
  // 左传右
  private toRight() {
    editChoose({
      fwtid: this.currRow.rid,
      sbxhList: this.checkedCitiesLeft,
      type: 2
    }).then((res: any) => {
      this.rowClick(this.currRow)
      this.$notify({
        title: this.$t('uAutSet.succtip') + '',
        message: '',
        type: 'success',
      })
    })
  }


  private queryUserLeft(value: string) {
    if (this.currRow.rid) {
      queryChoosed({ fwtid: this.currRow.rid, zsmc: this.searchLeft.queryName }).then((res: AxiosResponse) => {
        this.leftArr = res.data
      })
    } else {
      this.$notify.warning('请选择诊室再查询')
    }


  }

  private queryUserRight(value: string) {
    queryToChoose({ zsmc: this.searchRight.queryName }).then((res: AxiosResponse) => {
      this.rightArr = res.data
    })
  }

}

</script>
<style lang="scss" scoped>
.content {
  .search {
    height: 44px;
    display: flex;
    flex-flow: row nowrap;

    .el-col {
      .block {
        display: flex;
        flex-flow: row nowrap;

        .title {
          display: flex;
          align-items: center;
        }
      }
    }

  }
}

.menu-list {
  padding-top: 24px;

  // height: 100%;
  li {
    margin-bottom: 12px;
    padding: 0 16px;
    height: 32px;
    line-height: 32px;
    color: #222b31;
    font-size: 14px;

    &.on {
      border-radius: 4px;
      background: rgba(20, 133, 255, 0.1);
    }

    cursor: pointer;

    .icon {
      margin-right: 10px;
      color: #9ca0ab;
      font-size: 10px;
      transform: rotate(90deg);
    }
  }
}

.identification-data {
  width: 100%;
}

.checkboxItem {
  display: block;
  margin: 12px;
}

.queryInput {
  background: #f5f6f8 !important;
  border: 0 !important;
}

.left-right {
  // float: right;
  position: absolute;
  top: 30%;
  right: -24px;
  z-index: 9999;

  button {
    border: 1px solid $white;
  }

  .el-button--info.is-disabled,
  .el-button--info.is-disabled:hover,
  .el-button--info.is-disabled:focus,
  .el-button--info.is-disabled:active {
    background: $disabled;
  }

  .el-button--primary {
    background: $blue
  }

  .el-button--medium.is-circle {
    position: relative;
    padding: 0;
    width: 36px;
    height: 36px;
    line-height: 36px;
    display: flex;
    justify-content: center;

    .icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      margin: 0;
      font-size: 12px;
    }
  }
}

.form-body::-webkit-scrollbar {
  width: 6px;
  height: 4px;
  background: #fff;
}

.form-body::-webkit-scrollbar-button {
  display: none;
}

.form-body::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #d3d5e5;
}

.form-body::-webkit-scrollbar-track {
  border-radius: 10px;
  background: #fff;
}

.form-body {
  height: 600px;
  overflow-y: scroll;
  margin-top: 8px;
}

::v-deep .el-input__inner {
  width: 100%;
  height: 28px;
  background: rgba(245, 246, 248, 1);
  border-radius: 4px;
  margin-right: 6px;
  border: none;
}

::v-deep .el-table .success-row {
  background: #2dbbff;
}

</style>
