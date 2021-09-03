<!--
 * @Author: wangyao
 * @LastEditTime: 2020-07-09 15:59:40
 * @LastEditors: wangyao
 * @Description:自定义内容表格 (暂缓开发)
 * @FilePath: \web-op\src\components\CustomContentTable\index.vue
-->
<template>
    <div class="custom-content-table">
        <!-- @cell-click='cellClick' 暂不启用单元格点击 -->
        <el-table v-bind="$attrs" v-on="$listeners" :data="tableData" stripe border highlight-current-row>
            <el-table-column type="index" width="32" align="center"></el-table-column>
            <el-table-column v-for="(item,index) in columnList" :key="index" :property="item.property"  :label="item.label" :width="item.width || ''" :align="item.align || 'left'">
                <template slot-scope="scope">
                    <div v-if="item.type && item.type == 'checkbox'">
                        <el-checkbox v-model="scope.row[item.property]" :disabled="item.disabled"></el-checkbox>
                    </div>
                    <div v-else-if="item.type && item.type == 'searchItem'">

                    </div>
                    <div v-else-if="item.type && item.type == 'searchSelect'" :style="{width:item.width+'px'}">
                        <span v-if="item.showText">{{scope.row[item.property]}}</span>
                        <search-select v-else
                            table-name="SYS_PRIMARY_DATA"
                            kid="PD0000000269"
                            placeholder=" "
                            v-model="scope.row[item.property]"
                            :backfillValue="scope.row[item.property]"
                            :disabled="item.disabled"
                        />
                    </div>
                    <div v-else> {{scope.row[item.property]}} </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
@Component({
    name: 'custom-content-table',
})
export default class extends Vue {
    @Prop({ required:true,default:() => []}) private tableData!:any // 表格数据
    @Prop({ required:true,default:() => []}) private columnList!:any // 表头数据
    private title:any = ''
    // @Watch('pageSize', { immediate: true })
    // private onPageSizeChange(val: any) {
    //     this.$emit('getPageSize', this.page, this.pageSize)
    // }
    created() {
        this.init()
    }
    private init(){}
    private cellClick(row:any, column:any, cell:any, event:any){
        console.log(row, column, cell, event)
    }
}
</script>
<style lang="scss">
</style>