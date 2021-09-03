<!--
 * @Author: 曹俊
 * @LastEditTime: 2020-07-10 09:38:43
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\components\NoPagination\index.vue
-->
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
    <!-- <div class="page-footer">
      <el-pagination
        class="pagination"
        v-bind="pagePropsMixin"
        :pager-count="5"
        @current-change="
          (val) => {
            showLoading = true
            page = val
            getList(true)
          }
        "
        @size-change="
          (val) => {
            showLoading = true
            pageSize = val
            searchList()
          }
        "
      ></el-pagination>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { customPageReq, getDesign , customNoPageRequest, queryfyKc} from '@/api/his/basic/index.ts'
import { getTableData, dictExecuteSql } from '@/websql/functions'
import { formatInt, id2Name } from '@/utils'
import { log } from 'util'

@Component({
  name: 'pagenation-list',
})
export default class extends Vue {
  @Prop({ required: true }) private dataName!: string // 英文名称
  // @Prop({ required: true }) private dataUrl!: string // 查询接口
  // @Prop({ required: true }) private dataType!: string | undefined// 类型 1 - /design 代理 （其他 - /op-service）
  @Prop({ required: false, default: 400 }) private listHeight!: string | number // tableList列表区域的高度, 最小400
//   @Prop({ required: false, default: 40 }) private prec!: string | number // 插槽"list"区域内每条数据的高度, 默认40
  @Prop({ required: false, default: 'post' }) private httpMethod!: string // 请求方式
  @Prop({ required: false, default: () => {} }) private searchData!: Object // 搜索条件
//   @Prop({ required: false, default: () => null }) private pageProps!: any //分页码选项

  private showLoading: boolean = false
  private tableList: Array<any> = [] // 列表数据
  private tableColumn: Array<any> = [] // 列表字段
  private dataList: Array<any> = []
  private totalMoney: number = 0 // 总金额
  private recipeMoney: any = 0 // 处方金额

  // 监听tableList变化，向父组件传值
  // @Watch('tableList')
  @Watch('tableList', { immediate: true })
      private onTableListChange(val: any) {
      this.$emit('getTableList', this.tableList)
  }

  // 监听表格表头数据
  @Watch('tableColumn', { immediate: true })
  private onTableColumnChange(val: any) {
    this.$emit('getTableColumn', this.tableColumn)
  }

  // 监听总金额变化，向父组件传值
  @Watch('totalMoney')
      private onTotalMoneyChange(val: any) {
      this.$emit('getTotalMoney', this.totalMoney)
  }

  // 监听总金额变化，向父组件传值
  @Watch('recipeMoney')
      private onRecipeMoneyChange(val: any) {
      this.$emit('getRecipeMoney', this.recipeMoney)
  }

  created() {

  }
  mounted() {
    this.init()
    // console.log('dataName='+this.dataName)
  }

  get tableFormat() {
    let newData: Array<any> = []
    // newData = id2Name(this.tableList, 'MDC_TumourInspectionItem_startUsing', 'MDC_TumourInspectionItem_startUsing', this.dataList, 'dv', 'dn')
    // newData = id2Name(this.tableData, 'deptId', 'deptName', this.deptList, 'dv', 'dn')
    // newData = id2Name(this.tableData, 'postClassId', 'postName', this.postList, 'dv', 'dn')
    return newData
  }

  // 初始化参数
  private init() {
    let that = this
    // 获取列表表头
    getDesign(that.dataName).then((res: any) => {
      if(res.data != null){
        let selectList: Array<any> = res.data.selectList
        this.tableColumn = selectList
      }
    })
  }
  private getList() {
    let that = this
    that.showLoading = true
    that.showLoading = false // 后期删掉
    // let proxy: string = this.dataType == '1' ? '/design' : '/op-service' // 改变代理
    var param = {
      ...this.searchData,
      enName: that.dataName,
    }
    customNoPageRequest(param).then((res: any) => {
      if (res.errorCode === 'SUCCESS') {
        // console.log(res);
        that.tableList = res.data // 列表数据
        // console.log(res.data);
        if(res.data){
          // console.log(that.tableList);
          if(that.tableList.length > 0){
            that.tableList.forEach((val:any)=>{
              that.totalMoney = 0
              // 计算总金额
              that.totalMoney = (that.totalMoney + val.MS_CF02_HJJE).toFixed(2)
              // 计算处方金额（支付比例大于1，金额*支付比例，保留2位小数）
              that.recipeMoney = 0
              if(val.MS_CF02_ZFBL > 1){
                that.recipeMoney = (that.recipeMoney + val.MS_CF02_HJJE * val.MS_CF02_ZFBL).toFixed(2)
              }else{
                that.recipeMoney = (that.recipeMoney + val.MS_CF02_HJJE).toFixed(2)
              }
            })
          }
        }
      }else{
        this.$emit('input', [])
      }
    })
  }
  // 获取SYS_DICT_CONFIG字典
  // private getSysDictConfig(dicType: string, dicFid: string,fieldName: string){
  //   let that = this
  //   getTableData(
  //     `${dicType}`,
  //     // `SYS_DICT_CONFIG`,
  //     `${dicFid}`,
  //     // `12`,
  //     `select dv,dn from ${dicType}_VALUE where dk='${dicFid}'`,
  //     // `select dv,dn from SYS_DICT_CONFIG_VALUE where dk='12'`,
  //     function (data: any) {
  //       console.log("data=")
  //       console.log(data)
  //       if(data.length > 0){
  //         that.tableList = id2Name(that.tableList, fieldName, fieldName, data, 'dv', 'dn')
  //       }else{

  //       }
  //     }
  //   )
  // }
  // 获取表格第一条数据
  private getData(){
    return this.tableList[0]
  }

  private searchList() {
    this.showLoading = true
    this.getList()
  }

  // 选中当前行
  private handleSelectRow(data: any){
    let param: any = {
      data: data,
      enName: this.dataName
    }
    this.$emit('selectCurrentRow',param)
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

