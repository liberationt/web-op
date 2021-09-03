<!--
 * @Author: 曹俊
 * @LastEditTime: 2020-04-30 09:45:24
 * @LastEditors: 曹俊
 * @Description: 
 * @FilePath: \web-op\src\views\his\medinsuinterface\pharmacyDrugsInfo\components\search.vue
 -->
<template>
  <div class="query-search">
    <div class="forms-input">
      <el-input v-model="listQuery.yptym" :placeholder="$t('pharmacyDrugsInfo.searchTips')" @change="handleQuery" clearable @clear="clear">
        <i slot="prefix" class="el-input__icon icon his-search"></i>
      </el-input>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from "vue-property-decorator"
import { queryQualitySpecPage } from '@/api/his/medinsuinterface/pharmacyDrugsInfo.ts'
import { log } from 'util';

//命名文件名称，过滤器什么的都再这里写
@Component({
  name: "",
  filters: {}
})
export default class extends Vue {
    @Prop({ required: true }) private value!: any;
    set listQuery(val: any) {
        this.$emit("input", val);
    }
    get listQuery() {
        return this.value;
    }
    private list: any = [];
    mounted() {}
    // 搜索 
    private handleQuery() {
        queryQualitySpecPage(this.listQuery).then((res: any) => {
            console.log(res)
            this.$emit("setList", res.data.list);
        });
    }
    // 清空输入框
    private clear(){
      this.handleQuery()
    }
}
</script>

<style lang="scss" >
.query-search {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin-bottom: 10px;
}
.his-btn {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 30px;
}
.ivu-input {
  width: 220px;
  height: 30px;
  background: rgba(245, 246, 248, 1);
  border-radius: 4px;
}
</style>