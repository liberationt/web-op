<!--
 * @Date: 2020-05-14 11:05:48
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-22 19:02:21
 * @description: 常用组套维护
 -->
<template>
	<div class="content his-suite">
		<el-row class="ht" :gutter="10">
			<!-- 第一列的组套类型名称列表 -->
			<div class="top-header his-small">
				<div class="label">
					<span class="title">{{$t('常用组套维护')}}</span>
					<el-divider direction="vertical" ></el-divider>
					<el-radio-group v-model="searchData.ztlb" @change="pushTowList">
						<el-radio :label="1">西药/中成药</el-radio>
						<el-radio :label="3">草药</el-radio>
						<el-radio :label="4">项目</el-radio>
					</el-radio-group>
					<el-divider direction="vertical" class="mr10"></el-divider>
					<el-radio-group v-model="searchData.sslb" @change="pushTowListOther">
						<el-radio :label="4">常用</el-radio>
						<el-radio :label="1">组套</el-radio>
					</el-radio-group>
				</div>
			</div>
			<el-col class="ht mt10" :span="9">
				<suiteList
						ref="suiteList"
						v-model="tableDatas"
						:isShow="true"
						:is-select="isSelect"
						:search-data="searchData"
						@refresh="refreshList"
						@get="getRow"
				/>
<!--										:is-select="true"-->
			</el-col>
			<el-col class="ht mt10" :span="15">
				<detail-list
						ref="detail"
						v-model="tableList"
						:data-url="dataUrl"
						:search-data-detail="searchDataDetail"
						:is-select="isSelect"
						@delete="refreshData"
            :isEnable="isEnable"
				></detail-list>
<!--										:is-select="isSelect"-->
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import {
  ISuiteTypeList,
  ISuiteDetail,
  enable,
  disEnable,
  searchDetailList,
  queryPage,
  queryDetail,
  queryDetailXm
} from '@/api/cis/op/dctwork/examineSuite'
import detailList from './components/detailList.vue'
import suiteList from './components/suiteList.vue'
import {getData} from "@/api/his/im/ims/admissionRegistration";
import {getNow} from "@/api/his/basic";

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: 'ExaminesSuite',
  components: { detailList, suiteList }
})
export default class extends Vue {
  private tableDatas: ISuiteTypeList[] = []
  private tableList: any[] = []
  private dataUrl: string = ''
  private isSelect: boolean = false
  private isEnable: boolean = true
  private searchData: any = {
    pageNum: 1,
    pageSize: 10,
    ztlb: 1,
    sslb: 1,
    ztbh: null
  }
  private searchDataDetail: any = {
    yp: {
      ztbh: '',
      ztlb: '',
      drugType: '',
      pydm: ''
    }

  }

  created() {
  }

  mounted() {
    // this.initTableList()
  }

  // private initTableList() {
  //   if (this.tableDatas[0].ztbh) {
  //     if (this.tableDatas[0].ztbh === null || this.tableDatas[0].ztbh === undefined) {
  //       return null
  //     } else { 
  //       queryDetail({ ztbh: this.tableDatas[0].ztbh , ztlb: this.searchData.ztlb }).then((res) => {
  //         this.tableList = res.data.map((item: any, index: number) => {
  //           item.webSortNumber = index + 1
  //           return item
  //         })
  //       })
  //     }
  //   }
  // }

  // 切换药品类型
  private pushTowList(value: any) {
    this.isEnable = true
    if (value) {
      this.searchData.ztlb = value
      this.searchDataDetail.ztlb = value
      if(value == 1) this.searchDataDetail.yp.drugType = [1,2]
      else this.searchDataDetail.yp.drugType = value
    }
    const pageTable: any = (this.$refs.suiteList as any).$refs.pageTable
    pageTable.searchList()
    ;(this.$refs.suiteList as any).isAdd = true
    ;(this.$refs.detail as any).clickFlag = false
    // this.initTableList()
    this.tableList = []
  }

  private pushTowListOther(value:any) {
    console.log('value',value)
	this.searchData.sslb = value
    const pageTable: any = (this.$refs.suiteList as any).$refs.pageTable
    pageTable.searchList()
    ;(this.$refs.suiteList as any).isAdd = true
    // this.initTableList()
    this.tableList = []
  }

  /**
   * @LastEditors: zhml
   * @Description: 刷新列表,右侧列表数据置为[]
   * @param {type} params
   * @return:
   */
  private refreshList (value: any) {
    if (value.ztlb) {
      this.searchData.ztlb = value.ztlb
    }
    const pageTable: any = (this.$refs.suiteList as any).$refs.pageTable
    pageTable.searchList()

    this.tableList = []
  }

  // private initRightList() {
  //   const params: any = {
  //     ztbh: val,
  //     ztlb: this.searchData.ztlb,
  //     ksid: Vue.prototype.AUTHORITY.bussinessRole
  //   }
  //   queryDetail({ ztbh: this.tableDatas[0].ztbh , ztlb: this.searchData.ztlb}).then((res) => {
  //     this.tableList = res.data
  //   })
  // }


  // 获取右侧明细列表数据
  private refreshData(val:any) {
    const params: any = {
      ztbh: val,
      ztlb: this.searchData.ztlb,
      ksid: Vue.prototype.AUTHORITY.bussinessRole
    }
    queryDetail(params).then((res) => {
      this.tableList = res.data.map((item: any, index: number) => {
        item.webSortNumber = index + 1
        this.$set(item,'fymc',item.ypmc)
        console.log(item)
        return item
      })
    })
  }

  // 点击一行数据，把该行数据的ztbh 传给旁边的list，保存的时候需要用
  private getRow(value: ISuiteTypeList) {
    this.isEnable = false // 组套明细按钮状态
    if(value == null){
      this.tableList=[];
      return;
    }
    this.searchDataDetail.ztbh = value.ztbh
    this.searchDataDetail.ztlb = value.ztlb
    if(value.ztlb == 1) this.searchDataDetail.yp.drugType = [1,2]
    else this.searchDataDetail.yp.drugType = value.ztlb
    if (value.ztbh == null || value.ztbh === undefined) {
      return null
    } else if (value.ztlb == 4) {
      this.isSelect = true
      queryDetailXm({ ztbh: value.ztbh }).then((res) => {
        this.tableList = res.data.map((item: any, index: number) => {
          item.webSortNumber = index + 1
          return item
        })
      })
    } else if (value.ztlb != 4) {
      this.isSelect = true
      const params: any = {
        ztbh: value.ztbh,
        ztlb: value.ztlb,
        ksid: Vue.prototype.AUTHORITY.bussinessRole
      }
      queryDetail(params).then((res) => {
        this.tableList = res.data.map((item: any, index: number) => {
          item.webSortNumber = index + 1
          this.$set(item,'fymc',item.ypmc)
          console.log(item)
          return item
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.his-suite {
	.top-header {
		position: relative;
		padding: 8px 10px;
		background: #fff;
		border-radius: 8px;

		.main-header {
			padding-bottom: 10px;
			border-bottom: 1px solid #f5f6f8;
			display: flex;
			align-content: center;
			align-items: baseline;
		}
	}

	::v-deep .el-radio__label {
		font-size: 13px;
		padding-left: 4px;
	}

	.el-radio {
		margin-right: 10px;
	}

	.label {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 24px;
		.title {
			font-family: siyuanMedium;
		}
		.el-divider--vertical {
			margin: 0 10px;
		}
	}
}

</style>
