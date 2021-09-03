<!--
 * @Date: 2020-05-31 13:21:22
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-14 16:58:41
 * @description:
-->
<template>
  <div class="module ht">
    <div class="his-module his-small ht">
      <div slot="header">
        <div class="row" style="padding-top: 8px">
          <div class="label">
            <el-form
              :inline="true"
              :model="formInline"
              class="querySearch"
              style="padding-top: 8px;"
            >
              <el-form-item style="margin-right:0px" :label="'设备'">
                <el-select
                  style="width: 150px;"
                  multiple
                  collapse-tags
                  v-model="region"
                  placeholder="请选择设备"
                >
                  <el-option
                    v-for="item in kslxList"
                    :key="item.id"
                    :label="item.value"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="预约时间">
                <el-date-picker
                        class="date-wrapper"

                  type="daterange"
                  placeholder="选择日期"
                  v-model="date"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 220px;"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  clearable
                ></el-date-picker>
              </el-form-item>
              <el-form-item :label="'姓名'">
                <el-input v-model="formInline.brxm" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item style="margin: 0px 0px 0px -12px;">
                <el-divider direction="vertical"></el-divider>
              </el-form-item>

              <el-form-item class="btn" style="margin-right:10px">
                <el-button size="mini" type="text" @click="getList">
                  <i class="icon his-caozuo_search"></i>查询
                </el-button>
              </el-form-item>
              <el-form-item class="btn">
                <el-button size="mini" type="text" :disabled="!jcxh" @click="cancelYjyy">
                  <i class="icon his-caozuo_quxiaoyuyue red"></i>取消预约
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <el-table
        :data="data"
        v-loading="loading"
        element-loading-text="拼命加载中"
        stripe
        fit
        border
        style="width:100%"
        :height="listSlotHeight - 328"
        class="no-underline scroll-bar"
        :header-cell-style="{textAlign:'center',overflow: 'hidden',textOverflow: 'ellipsis'}"
      >
        <el-table-column width="100" :label="headerData[0] ? headerData[0].value : ''" prop="0_0">
          <template slot-scope="scope">
            <div class="timeCloumn">{{scope.row["0_0"] && scope.row["0_0"].value}}</div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item,index) in headerData.slice(1,headerData.length)"
          :key="index"
          :label="item.value ? item.value : '' "
        >
          <el-table-column
            v-for="(item1) in item.child"
            :key="item1.id"
            :label="item1.value ? item1.value : ''"
            :prop="item1.id"
            min-width="68"
            align="center"
            cell-class-name="appoint-table-cell"
          >
            <template slot-scope="scope">
              <div
                :title="item1 && item1.value"
                :class="currentTime == scope.row['0_0'].id && currentSbId == scope.row[item1.id].id ? 'isActived' : ''"
                @dblclick="getAppointDetail(scope,item1.id)"
              >
                <span
                  class="appoint-table-span"
                >{{scope.row[item1.id] && scope.row[item1.id].value}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { queryYjyy4Html, queryYjyyData, queryJcSqdList, cancelYjyy } from '@/api/cis/op/dctwork/medTechAppoint.ts'
import { getNow } from "@/api/his/basic";
import { parseTime, getCurWeek } from '@/utils'

export interface cc {
  value: string
}
//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'AppointList',
  filters: {},
})
export default class extends Vue {
  @Prop({ required: true }) private jcxh!: number | null
  //声明变量，方法
  private formInline: any = {}
  private tableDatas: any = []
  private headerData: Array<cc> = []
  private data: any[] = []
  private listSlotHeight: number = 0
  private kslxList: any[] = []
  private region: any[] = []
  private date: any[] = []
  private loading: boolean = false
  private currentTime: string = ''
  private currentSbId: number = 0
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
    getNow().then((res: any) => {
      this.date = [parseTime(res.data, '{y}-{m}-{d}'), parseTime(res.data, '{y}-{m}-{d}')]
    })
    this.getList()
  }

  private getList() {
    this.kslxList = []
    queryYjyy4Html().then((res: any) => {
      this.tableDatas = res.data
      let data = []
      this.tableDatas.Header.items.map((headerItem: any) => {
        let header = { ...headerItem, child: [] }
        this.tableDatas.HeaderChild.items.map((childItem: any) => {
          if (headerItem.jklx == childItem.jklx) {
            header.child.push(childItem)
          }
        })
        this.headerData = [...this.headerData, header]
      })

      this.tableDatas.HeaderChild.items.map((childItem: any) => {
        this.kslxList = [...this.kslxList, childItem]
      })

      this.tableDatas.dataList.map((dataItem: any) => {
        let data: any = {}
        dataItem.items.map((item: any) => {
          let arr = item.id.split("_")
          if (arr[2] && arr[3]) {
            data[`${arr[2]}_${arr[3]}`] = item
          } else {
            data["0_0"] = item
          }
        })
        this.data = [...this.data, data]
      })
      this.queryYjyyData()
    })
  }

  // 查询已预约数据
  private queryYjyyData() {
    this.loading = true
    this.headerData = []
    this.data = []
    if (this.region.length > 0) {
      this.tableDatas.Header.items.map((headerItem: any) => {
        let header = { ...headerItem, child: [] }
        this.region.map((childItem: any) => {
          if (headerItem.jklx == childItem.jklx) {
            header.child.push(childItem)
          }
        })
        this.headerData = [...this.headerData, header]
      })
    } else {
      
      this.tableDatas.Header.items.map((headerItem: any) => {
        let header = { ...headerItem, child: [] }
        this.tableDatas.HeaderChild.items.map((childItem: any) => {
          if (headerItem.jklx == childItem.jklx) {
            header.child.push(childItem)
          }
        })
        this.headerData = [...this.headerData, header]
      })
    }

    if (this.date && this.date.length > 0) {
      this.formInline.date = this.date[0]
      this.formInline.date1 = this.date[1]
    } else {
      this.formInline.date = ''
      this.formInline.date1 = ''
    }

    queryYjyyData(this.formInline).then((res: any) => {
      this.tableDatas.dataList.map((item: any) => {
        item.items.map((data: any) => {
          Object.keys(res.data).map((key: string) => {
            if (data.id == key) {
              data.value = res.data[key]
            }
          })
        })
      })
      this.tableDatas.dataList.map((dataItem: any) => {
        let data: any = {}
        dataItem.items.map((item: any) => {
          let arr = item.id.split("_")
          if (arr[2] && arr[3]) {
            data[`${arr[2]}_${arr[3]}`] = item
          } else {
            data["0_0"] = item
          }
        })
        this.data = [...this.data, data]
      })
      this.loading = false
      this.$emit('checkInfo', [])
      this.currentTime = ''
      this.currentSbId = 0
    }).catch(() => {
      this.loading = false
    })
  }
  mounted() {

  }

  //点击单元格
  private getAppointDetail(value: any, index: any) {
    const arr = value.row[index].id.split("_")
    const sbId = arr[3] //获取设备id
    if (value.$index < 2) return
    if (this.date && this.date.length > 0) {
      const data = {
        brxm: this.formInline.brxm,
        date: this.date[0],
        date2: this.date[1],
        sbId: sbId,
        timeId: value.row['0_0'].id.split('_')[1]
      }
      queryJcSqdList(data).then((res: any) => {
        this.$emit('checkInfo', res.data || [])
        this.currentTime = value.row['0_0'].id
        this.currentSbId = value.row[index].id
      })
    } else {
      this.$notify({
        title: '请先选择预约时间',
        message: '',
        type: 'warning'
      })
    }
  }

  private cancelYjyy() {
    if (this.jcxh) {
      cancelYjyy({ jcxh: this.jcxh }).then(() => {
        this.$emit('qxyy')
        this.getList()
      })
    } else {
      this.$notify({
        title: '请先选择医技项目',
        message: '',
        type: 'warning'
      })
    }
  }


}
</script>

<style lang="scss" scoped>
::v-deep .el-form {
  margin: 0px !important;
  display: flex;
}
::v-deep .el-form--inline .el-form-item {
  display: -webkit-inline-box;
  margin-right: 16px;
  margin-bottom: 8px !important;
  .el-form-item {
    vertical-align: none;
  }
}
::v-deep .el-input--medium {
  width: 136px;
}
::v-deep .el-input {
  .el-input__inner {
    width: 136px !important;
  }
}
.querySearch {
  display: -webkit-box !important;
  .searchTitle {
    padding-left: 15px;
    color: #222b31;
    font-size: 13px;
  }
}

.row {
  margin-bottom: 0 !important;
  padding-bottom: 8px !important;
}
.content {
  .his-small {
    padding: 0 !important ;
    .btn {
      .el-button {
        padding: 4px 0 0 0 !important;
      }
    }
  }
}

.el-select {
  .el-input__inner {
    width: 100% !important;
    font-size: 10px;
  }
  overflow: hidden;
}
::v-deep .el-select__tags {
  width: 9999px !important;
  max-width: 9999px !important;
}

.appoint-table-span {
  &:hover {
    color: orange !important;
    text-decoration: underline;
    cursor: pointer;
  }
}
.appoint-table-cell {
  &:hover {
    cursor: pointer;
  }
}
.isActived {
  background: rgba($color: $light-blue, $alpha: 0.3);
}

</style>
