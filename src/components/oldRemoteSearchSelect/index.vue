<template>
	<div>
		<el-select
				:disabled="disabled"
				ref="select"
				v-popover:popover
				v-model="values"
				filterable
				remote
				@blur="selectBlur"
				reserve-keyword
				:placeholder="placeholder"
				:remote-method="
        query => {
          remoteMethod(query)
        }
      "
				:popper-append-to-body="false"
				:clearable="true"
		>
			<div slot="empty"></div>
		</el-select>
		<el-popover
				:visible-arrow="false"
				placement="bottom"
				:width="popoverWidth"
				trigger="manual"
				v-model="visible"
				ref="popover"
				popper-class="remote-search-popper-zdm"
		>
			<div class="popover-box" @click="clickPopover">
				<pagenation-list
						ref="pageTable"
						v-model="resultOptions"
						:data-url="searchUrl"
						http-method="post"
						:list-height="400"
						:searchData="searchData"
						:key="listKey"
						:pageProps="{ layout: 'total, prev, pager, next' }"
				>
					<div slot="list" class="scroll-bar remote-search-select-zdm" style="height: 300px">
						<div @click.stop>
							<el-table
									popper-class="option"
									:data="resultOptions"
									:fit="true"
									:highlight-current-row="true"
									@row-click="row => { selectResult(row) }"
									class="no-underline"
									:show-header="false"
							>
								<el-table-column prop="webSortNumber" :label="$t('common.serialNum')" width="60"></el-table-column>
								<el-table-column
										v-for="result in resultTableHeader"
										:key="result.prop"
										:prop="result.prop"
										:label="result.label"
										:show-overflow-tooltip="true"
								></el-table-column>
							</el-table>
						</div>
					</div>
				</pagenation-list>
			</div>
		</el-popover>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
@Component({
  name: 'remoteSearchSelect'
})
export default class extends Vue {
  @Prop({ required: true, default: '' }) private values!: string //远程搜索的api
  @Prop({ required: true, default: '' }) private searchUrl!: string //远程搜索的api
  //搜索返回的结果列表表头 exp:[{label:xxx,value: xxx}]
  @Prop({ required: true, default: [] }) private resultTableHeader!: Array<any>
  @Prop({ required: true, default: '' }) private searchField!: string //搜索用到的编辑的字段
  @Prop({ required: true, default: () => { } }) private searchData!: any //搜索用到的固定的字段
  @Prop({ required: false, default: 600 }) private popoverWidth!: number //弹出框的宽度
  @Prop({ required: false, default: false }) private disabled!: boolean //是否禁用
  @Prop({ required: false, default: '' }) private placeholder!: string //占位符
  @Prop({ required: true, default: '' }) private showLabel!: string //显示哪个字段
  set value(val:string) {
    this.$emit('input',val)
  }

  get value() {
    return this.value
  }
  // private searchData: any = {} //搜索传入分页组件的搜索
  private resultOptions: Array<any> = []
  // private value: string = ''
  private visible: boolean = false
  private listKey: number = 0
  private isClickPopover: boolean = false

  private remoteMethod(query: string) {
    //远程搜索方法
    const pageTable: any = this.$refs.pageTable
    if (query.length < 2) {
      this.visible = false
    } else {
      this.searchData[`${this.searchField}`] = query
      this.$nextTick(() => {
        pageTable.searchList()
      })
      this.visible = true
    }
  }

  mounted() {
    console.log('this.showLabel',this.showLabel)
    if (this.showLabel) {
      this.value = this.showLabel
    }
  }
  private selectResult(row: any) {
    //点击选择搜索的结果，将这一行数据返回给父组件
    this.values = row[`${this.showLabel}`]
    console.log(this.values,111111111111111111111111111111111111)
    console.log(row)
    this.$emit('input', row[`${this.showLabel}`])
    this.$emit('change', row)
    this.$emit('getData', row)
    this.visible = false
  }
  private clickPopover() {
    //点击弹出框，弹出框不消失
    this.isClickPopover = true
    this.visible = true
    const select: any = this.$refs.select
    select.focus()
    setTimeout(() => {
      this.isClickPopover = false
    }, 100)
  }
  private selectBlur() {
    //选择框失去焦点时弹出框消失
    setTimeout(() => {
      if (!this.isClickPopover) {
        this.visible = false
      }
    }, 100)
  }
  private isFocus() {
    setTimeout(() => {
      ; (this.$refs.select as any).focus()
    }, 50)
  }

  private blur() {
    setTimeout(() => {
      ; (this.$refs.select as any).blur()
      this.visible = false
    }, 50)
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-select-dropdown {
	display: none;
}
</style>

<style lang="scss">
.remote-search-select-zdm td {
	padding: 3px 0 !important;
}
.remote-search-popper-zdm {
	padding: 0px;
	margin-top: 0 !important;
}
</style>
