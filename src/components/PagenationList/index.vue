<template>
	<div class="pagenation-list" v-loading="showLoading">
		<!-- 头部标题插槽 -->
		<slot name="header"></slot>
		<!-- 表格/列表插槽 -->
		<slot name="list"></slot>
		<!-- 描述内容插槽 -->
		<slot name="remark"></slot>
		<!-- 其他渲染 -->
		<slot name="render"></slot>
		<div class="page-footer">
			<el-pagination
				class="pagination"
				v-bind="pagePropsMixin"
				:pager-count="5"
				@current-change="(val) => {
					showLoading = true
					page = val
					getList(true)
				}"
				@size-change="(val) => {
					showLoading = true
					pageSize = val
					searchList()
				}"
			></el-pagination>
		</div>
	</div>
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { customPageReq,customPageReqs } from '@/api/his/basic/index.ts'
import { formatInt } from '@/utils'

@Component({
	name: 'pagenation-list',
})
export default class extends Vue {
	@Prop({ required: true }) private dataUrl!: string // 查询接口
	@Prop({ required: false, default: '' }) private dataType!: string | undefined// 类型 1 - /design 代理 （其他 - /op-service）
	@Prop({ required: false, default: 400 }) private listHeight!: string | number // 插槽"list"区域的高度, 最小400
	@Prop({ required: false, default: 40 }) private prec!: string | number // 插槽"list"区域内每条数据的高度, 默认40
	@Prop({ required: false, default: 'post' }) private httpMethod!: string // 请求方式
	@Prop({ required: false, default: () => { } }) private searchData!: Object // 搜索条件
	@Prop({ required: false, default: () => null }) private pageProps!: any //分页码选项
	@Prop({ required: false, default: () => false }) private optTrigger!: boolean //操作分页组件后触发
	@Prop({ required: false, default: 0 }) private dataNum!: number // dataNum == 1 调用headers: {"Content-Type": "application/json"}

	private total: number = 0 //列表所有条数
	private page: number = 1 //当前页码
	private pageSizeOpts: Array<any> = [] //分页选项
	private pageSize: any = null //每页条数
	private showLoading: boolean = false
	get pagePropsMixin() {
		// page组件的props混合
		return {
			// "background":true,
			layout: 'total, sizes, prev, pager, next, jumper', //默认全部功能
			...this.pageProps, //根据外部定义覆盖
			total: this.total, //当前总数，内部维护
			'page-sizes': this.pageSizeOpts, //根据情况取值
			'page-size': this.pageSize, //默认取分页码选项第一个
			'current-page': this.page, //当前分页数，内部维护
		}
	}

	@Watch('pageSize', { immediate: true })
	private onPageSizeChange(val: any) {
		this.$emit('getPageSize', this.page, this.pageSize)
	}
	@Watch('page', { immediate: true })
	private onPageChange(val: any) {
		this.$emit('getPageSize', this.page, this.pageSize)
	}

	created() {
		this.init()
		// console.log('dataType='+this.dataType)
	}

	mounted() {
	}
  	// 初始化参数
	private init() {
		// 设置pageSizeOpts,pageSize初始值
		try {
			this.pageSizeOpts = this.pageProps['page-sizes'] != undefined ? this.pageProps['page-sizes'] : [10, 20, 30, 40, 100]
			this.pageSize = this.pageProps['page-sizes'] != undefined ? this.pageSizeOpts[0] : formatInt(Number(this.listHeight) / Number(this.prec))
		} catch {
			this.pageSizeOpts = [10, 20, 30, 40, 100]
			this.pageSize = formatInt(Number(this.listHeight) / Number(this.prec))
		}
	}
	private getList() {
		this.showLoading = true
		// this.showLoading = false // 后期删掉
		// let proxy: string = this.dataType == '1' ? '/design' : '/op-service' // 改变代理
		var searchData = {
			...this.searchData,
			pageSize: this.pageSize < 10 ? 10 : this.pageSize, // 最小请求参数改为10
			pageNum: this.page,
		}
		if(this.dataNum == 1){
			customPageReqs(this.dataUrl, searchData).then((res: any) => {
				if (res.errorCode === 'SUCCESS') {
					if(res.data.list&&res.data.list.length){
						res.data.list.map((item: any, index: number) => {
							item.webSortNumber = index + 1 + (this.page - 1) * this.pageSize
							item.webRowStatus = false
						})
					}else{
						// this.handelNotify()
					}
					this.$emit('input', res.data.list)
					this.$emit('reqComplete')
					this.total = res.data.total != 0 ? res.data.total * 1 : 0
				} else {
					this.$emit('input', [])
					this.$emit('reqComplete')
					this.total = 0
				}
				this.showLoading = false
			}).catch((err:any)=>{
				this.showLoading = false
				this.$emit('input',  [])
			})
		}else{
			customPageReq(this.dataUrl, searchData, this.httpMethod).then((res: any) => {
				if (res.errorCode === 'SUCCESS') {
					if(res.data.list&&res.data.list.length){
						res.data.list.map((item: any, index: number) => {
							item.webSortNumber = index + 1 + (this.page - 1) * this.pageSize
							item.webRowStatus = false
						})
					}else{
						// this.handelNotify()
					}
					this.$emit('input', res.data.list)
					this.$emit('reqComplete')
					this.total = res.data.total != 0 ? res.data.total * 1 : 0
				} else {
					this.$emit('input', [])
					this.$emit('reqComplete')
					this.total = 0
				}
				this.showLoading = false
			}).catch((err:any)=>{
				this.showLoading = false
				this.$emit('input',  [])
			})
		}
		if(this.optTrigger){
			this.$emit('retFunc',true)
		}
	}
	private searchList() {
		this.page = 1
		this.showLoading = true
		this.getList()
	}
	private handelNotify(){
		this.$notify({
			title: '无匹配数据',
			message: '',
			type: 'error'
		})
	}
	// pageSize传0可以获取所有
	private async getAllData(){
		var searchData = {
			...this.searchData,
			pageSize: 0,
		}
		let res
		if(this.dataNum == 1){
			res = await customPageReqs(this.dataUrl, searchData)
		}else{
			res = await customPageReq(this.dataUrl, searchData, this.httpMethod)
		}
		return res.data.list
	}

}
</script>

<style scoped lang="scss">
.pagenation-list {
  .page-footer {
    text-align: right;
    margin-top: 8px;
  }
}
.pagenation-small {
  .page-footer {
    text-align: left;
    width: 100%;
  }
}
</style>
