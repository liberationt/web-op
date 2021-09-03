<!--
 * @Author: 曹俊
 * @LastEditTime: 2020-06-22 14:12:42
 * @LastEditors: 曹俊
 * @Description: 
 * @FilePath: \web-op\src\views\his\config\configuration\deployList.vue
--> 
<template>
  <div class="content ht">
      <div class="his-module his-small">
          <pagenation-list
            ref="pageTable"
            data-url="/design/designquery/queryPage"
            data-type="1"
            v-model="list"
            :list-height="listSlotHeight"
            :searchData="searchData"
            http-method="post"
          >
            <div slot="header" class="row">
              <div class="label">
                <h1 class="title">页面配置列表</h1>
                <span class="tag">自定义英文名称</span>
                <el-input
                  v-model="searchData.enName"
                  placeholder="请输入英文名称查询..."
                  @change="handleSearch"
                  @blur="clearSearch"
                  clearable
                >
                  <i slot="prefix" class="el-input__icon icon his-search"></i>
                </el-input>
                <span class="tag">自定义中文名称</span>
                  <el-input
                  v-model="searchData.zhName"
                  placeholder="请输入中文名称查询..."
                  @change="handleSearch"
                  @blur="clearSearch"
                  clearable
                >
                  <i slot="prefix" class="el-input__icon icon his-search"></i>
                </el-input>
              </div>
              <div class="operate">
                <el-button type="primary" class="blue-gra" @click="handleAdd">
                  <i class="icon his-add"></i> 新增
                </el-button>
              </div> 
            </div>
            {{listSlotHeight}}
            <el-table 
              slot="list" 
              stripe 
              :highlight-current-row="true"
              :data="list" 
              :height="listSlotHeight"
              class="scroll-bar"
              border
            >
              <!-- @row-click="handleChange" -->
              <!-- 序号 -->
              <el-table-column prop="webSortNumber" width="32"></el-table-column>
              <!-- 中文名称 -->
              <el-table-column prop="zhName" label="中文名称"></el-table-column>
              <!-- 英文名称 -->
              <el-table-column prop="enName" label="英文名称"></el-table-column>
              <!-- 0 启用 、1 停用 -->
              <el-table-column prop="queryStop" :label="$t('common.status')" width="80">
                <template slot-scope="scope">
                  <span :class="[scope.row.queryStop== 0 ? 'blues' : 'reds']">{{ scope.row.queryStop== 0 ? '启用' : '停用' }} 
                  </span>
                </template>
              </el-table-column>
              <!-- 操作 -->
              <el-table-column
                :label="$t('common.action')" 
                width="150"
                align="center"
              >
                <template slot-scope="scope">
                  <!-- 0:启用,1:停用 start -->
                  <el-tooltip :content="scope.row.queryStop == 1 ? $t('common.disabled') : $t('common.enabled')" placement="bottom" effect="light">
                    <el-popconfirm
                      hideIcon
                      :confirmButtonText="scope.row.queryStop == 0 ? $t('common.disable') : $t('common.enable')"
                      :cancelButtonText="$t('common.cancel')"
                      :title="
                        scope.row.queryStop == 0
                          ? $t('common.disableTip')
                          : $t('common.enableTip')
                      "
                      @cancel="handleCancel"
                      @confirm="handleOk(scope.row)"
                    >
                      <el-button
                        slot="reference"
                        :class="[scope.row.queryStop == 0 ? 'green' : 'red']"
                      >
                        <i
                          class="icon"
                          :class="[
                            scope.row.queryStop == 0
                              ? 'his-automated'
                              : 'his-disabled',
                          ]"
                        ></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                  <!-- 0:启用,1:停用 end -->
                  <!-- 发布  -->
                  <el-tooltip class="ml10" :content="$t('common.publish')" effect="light">
                    <el-button class="green" :disabled="scope.row.queryStop == 1" @click="handlePublish(scope.row)">
                      <i class="icon his-publish" />
                    </el-button>
                  </el-tooltip>
                  <!-- 编辑 -->
                  <el-tooltip class="ml10" :content="$t('common.edit')" effect="light">
                    <el-button class="green" @click="handleEdit(scope.row)" :disabled="scope.row.queryStop == 0">
                      <i class="icon his-edit" />
                    </el-button>
                  </el-tooltip>
                  <!-- 删除 -->
                  <el-tooltip class="ml10" :content="$t('common.delete')" effect="light">
                    <el-popconfirm
                      hideIcon
                      :confirmButtonText="$t('common.confirm')"
                      :cancelButtonText="$t('common.cancel')"
                      :title="$t('common.delTip')"
                      @confirm="handleDelete(scope.row)"
                    >
                      <el-button slot="reference" class="red" :disabled="scope.row.queryStop == 0">
                        <i class="icon his-del his-cancellationicon" />
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </pagenation-list>
      </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { 
  Iitem, 
  Iobject, 
  getAlltabel, 
  getAllColumn, 
  getTablesColumn, 
  addDesignQuery, 
  getSql, 
  deleteSql, 
  publishSql,
  refreshSql,
  updateStart,
  updateStop
} from '@/api/his/config/index.ts'
import { log } from 'util'

@Component({
  name: 'deployList',
  components: {},
})
export default class extends Vue {
  private list: Array<any> = []
  private searchData: Iobject = {
    enName: '',
    zhName: '',
  }
  private listSlotHeight: number = 0
  
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight 
  }
  mounted() {
    console.log(this.list)
    let that = this
    that.getList()
  }

  private getList() {
    const pageTable: any = this.$refs.pageTable
    pageTable.getList()
  }

  // 按下enter键进行查询
  private handleSearch(){
    this.getList()
  }

  // 点击清空按钮清空输入框内容,重新加载接口数据
  private clearSearch(){
    this.handleSearch()
  }

  // 取消
  private handleCancel(){}

  // 	0:启用,1:停用
  private handleOk(data: any){
    console.log(data);
    if(data.queryStop == 0){ 
      // 0:启用 执行停用操作
      updateStop(data.queryId).then((res) => {
        this.$notify({
          title: this.$t('common.disabledSuc').toString(),
          message: '',
          type: 'success',
        })
        this.getList()
      })
    }else{
      // 1:停用 执行启用操作
      updateStart(data.queryId).then((res) => {
        this.$notify({
          title: this.$t('common.enabledSuc').toString(),
          message: '',
          type: 'success',
        })
        this.getList()
      })
    }
  }
  
  // 发布
  private handlePublish(data: any){
    publishSql(data.queryId).then((res) => {
      this.$notify({
        title: this.$t('common.publishSuc').toString(),
        message: '',
        type: 'success',
      })
      this.getList()
      refreshSql()
    })
  }
  // 新增
  private handleAdd(){
    // 跳转setting.vue
      this.$router.push({ name: 'setting'})
  }

  // 编辑
  private handleEdit(data: any){
      // 带id参数跳转setting.vue
      this.$router.push({ name: 'setting', query: { id: data.queryId }})
  }

  //删除
  private handleDelete(item: any) {
    deleteSql(item.queryId).then((res) => {
      this.$notify({
        title: this.$t('common.delSuc').toString(),
        message: '',
        type: 'success',
      })
      this.getList()
    })
  }

}
</script>
  
<style lang="scss" scoped></style>
<style lang="scss">
@import 'config.scss';
</style>