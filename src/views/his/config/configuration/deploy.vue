<!--
 * @Author: 曹俊
 * @LastEditTime: 2020-06-22 19:55:21
 * @LastEditors: 曹俊
 * @Description: 
 * @FilePath: \web-op\src\views\his\config\configuration\deploy.vue
--> 
<template>
  <div class="content">
    <div class="his-module his-small his-header">
      <div class="row no-space no-border">
        <div class="label">
          <span class="tag pl0">业务名称</span>
          <el-input v-model="form.businessName"></el-input>
          <span class="tag">表名称</span>
          <el-select v-model="form.tableName" placeholder="类名称" @change="selectTableName">
            <el-option
              v-for="item in tableList"
              :key="item.tableId"
              :label="item.tableName"
              :value="item.tableName"
              placeholder="请选择"
            ></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <!-- {{tableDatas}} -->
    <el-row :style="{height: listHeight - 58 + 'px'}">
      <el-col class="ht" :span="6">
        <div class="his-module his-small">
          <el-table
            class="scroll-bar no-underline"
            :data="tableDatas"
            border
            :fit="true"
            stripe
            :highlight-current-row="true"
            slot="list"
            :height="listHeight - 68"
            @row-click="handleSelectRow"
          >
            <!-- 序号 -->
            <el-table-column type="index" width="32"></el-table-column>
            <!-- 字段名称 -->
            <el-table-column
              prop="columnName"
              :label="$t('configuration.name')"
              :show-overflow-tooltip="true"
              width="100"
            ></el-table-column>
            <!-- 字段标题 -->
            <el-table-column
              prop="alias"
              :label="$t('configuration.title')"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作" align="center" width="80">
              <el-tooltip :content="$t('common.moveUp')" placement="bottom" effect="light">
                <el-button class="blue" type="text" @click="handleUp(scope.$index, scope.row)">
                  <i class="icon his-move-up"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip :content="$t('common.moveDown')" effect="light" placement="bottom">
                <el-button class="blue" type="text" @click="handleDown(scope.$index, scope.row)">
                  <i class="icon his-move-down"></i>
                </el-button>
              </el-tooltip>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col class="ht pl10" :span="18">
        <div class="his-module his-small">
            <div class="row">
                <div class="label">
                    <div class="title">参数设置</div>
                </div>
            </div>
            <div class="form">
                <el-form label-width="74px">
                    <!-- 中文名	 -->
                    <el-form-item label="中文名">
                        <el-input type="number" v-model="form.alias" clearable></el-input> 
                    </el-form-item>
                    <!-- 英文名	 -->
                    <el-form-item label="英文名">
                        <el-input type="number" v-model="form.enName" clearable></el-input> 
                    </el-form-item>
                    <!-- 数据类型 -->
                    <el-form-item label="数据类型">
                        <el-select v-model="form.columnType" clearable filterable>
                            <el-option
                            v-for="item in dataType"
                            :key="item.type"
                            :label="item.name"
                            :value="item.type"
                            placeholder="请选择" 
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 显示方式 -->
                    <el-form-item label="显示方式">
                        <el-select v-model="form.display" clearable filterable>
                            <el-option
                                v-for="item in vissableList" 
                                :key="item.display"
                                :label="item.style"
                                :value="item.display"
                                placeholder="请选择" 
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 最大值 -->
                    <el-form-item label="最大值">
                        <el-input type="number" v-model="form.maxValuec" clearable></el-input> 
                    </el-form-item>
                    <!-- 最小值 -->
                    <el-form-item label="最小值">
                        <el-input type="number" v-model="form.minValuec" clearable></el-input>
                    </el-form-item>
                    <!-- 跨几行 -->
                    <el-form-item label="跨几行">
                        <el-input type="number" v-model="form.rowspan" clearable></el-input> 
                    </el-form-item>
                    <!-- 跨几列 -->
                    <el-form-item label="跨几列">
                        <el-input type="number" v-model="form.colspan" clearable></el-input> 
                    </el-form-item>
                    <!-- 字段验证（可选） -->
                    <el-form-item label="字段验证（可选）"  label-width="124px" clearable filterable style="width: 100%">
                        <el-select v-model="form.checkRule" multiple placeholder="请选择">
                            <el-option
                                v-for="item in validateList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 表单高度 -->
                    <el-form-item label="表单高度">
                        <el-input type="number" v-model="form.height" clearable></el-input> 
                    </el-form-item>
                    <!-- 列表列宽 -->
                    <el-form-item label="列表列宽">
                        <el-input type="number" v-model="form.width" clearable></el-input> 
                    </el-form-item>
                    <!-- 数字精度 -->
                    <el-form-item label="数字精度">
                        <el-input type="number" v-model="form.numPrecision" clearable></el-input> 
                    </el-form-item>
                    <!-- 显示顺序 -->
                    <el-form-item label="显示顺序">
                        <el-input type="number" v-model="form.showOrder" clearable></el-input> 
                    </el-form-item>
                    <!-- 是否显示 -->
                    <el-form-item label="是否隐藏">
                        <el-select v-model="form.hidden" clearable filterable>
                            <el-option
                            v-for="item in isInArray"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                            placeholder="请选择" 
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 是否插入 -->
                     <el-form-item label="是否插入">
                        <el-select v-model="form.insertEnable" clearable filterable>
                            <el-option
                            v-for="item in isInArray"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                            placeholder="请选择" 
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 最大长度 -->
                    <el-form-item label="最大长度">
                        <el-input type="number" v-model="form.maxLength" clearable></el-input> 
                    </el-form-item>
                    <!-- 是否可编辑 -->
                    <el-form-item label="是否可编辑" label-width="94px">
                         <el-select v-model="form.fixed" clearable filterable>
                            <el-option
                            v-for="item in isInArray"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                            placeholder="请选择" 
                            ></el-option>
                        </el-select> 
                    </el-form-item>
                    <!-- 排序列名 -->
                    <el-form-item label="排序列名">
                         <el-select v-model="form.orderColumn" clearable filterable>
                            <el-option
                            v-for="item in tableDatas"
                            :key="item.columnName"
                            :label="item.columnName"
                            :value="item.columnName"
                            placeholder="请选择" 
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 排序方式 -->
                    <el-form-item label="排序方式" label-width="94px">
                         <el-select v-model="form.ascDesc" clearable filterable>
                            <el-option
                            v-for="item in sortList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            placeholder="请选择" 
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 排序方式 -->
                    <el-form-item label="排序列名">
                         <el-select v-model="form.orderColumn" clearable filterable>
                            <el-option
                            v-for="item in sortList"
                            :key="item.sortList"
                            :label="item.label"
                            :value="item.sortList"
                            placeholder="请选择" 
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 是否为主键 -->
                    <el-form-item label="是否为主键" label-width="94px">
                         <el-select v-model="form.pkey" clearable filterable>
                            <el-option
                            v-for="item in isInArray"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                            placeholder="请选择" 
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { getAlltabel, getAllColumn } from '@/api/his/config/index.ts'
import { log } from 'util'

@Component({
  name: 'deploy',
})
export default class extends Vue {
  private tableList: Array<any> = []
  private tableDatas: Array<any> = []
  // 数据类型
  private dataType: Array<any> = [
    {
      type: 1,
      name: 'INT',
    },
    {
      type: 2,
      name: 'VARCHAR',
    },
    {
      type: 3,
      name: 'STRING',
    },
    {
      type: 4,
      name: 'LONG',
    },
    {
      type: 5,
      name: 'FLOAT',
    },
    {
      type: 6,
      name: 'DOUBLE',
    },
    {
      type: 7,
      name: 'BOOLEAN',
    },
    {
      type: 8,
      name: 'CHAR',
    },
  ]
  // 显示方式
  private vissableList: Array<any> = [
    {
      display: 0,
      style: '在列表,表单都不显示',
    },
    {
      display: 1,
      style: '只在列表显示',
    },
    {
      display: 2,
      style: '只在表单显示',
    },
    {
      display: 3,
      style: '在列表,表单都显示',
    },
  ]
  // 验证类型
  private validateList: Array<any> = [
    {
      value: 0,
      name: '数字',
    },
    {
      value: 1,
      name: '必填',
    },
    {
      value: 2,
      name: '邮箱',
    },
  ]
  // 是否显示、是否插入
  private isInArray: Array<any> = [
    {
      value: 0,
      name: '是',
    },
    {
      value: 1,
      name: '否',
    }
  ]
  // 排序方式
  private sortList: Array<any> = [
    {
      value: 'asc',
      label: '升序',
    },
    {
      value: 'desc',
      label: '降序',
    }
  ]
  private operatorList: Array<any>  = [
    {
      index: 0,
      label: '='
    },
    {
      index: 2,
      label: '<>'
    },
    {
      index: 2,
      label: '<='
    },
    {
      index: 3,
      label: '<'
    },
    {
      index: 4,
      label: '>'
    },
    {
      index: 5,
      label: '>='
    },
    {
      index: 6,
      label: 'like'
    },
  ] // 比较运算符列表 
  private form = {
    businessName: '',
    tableName: '',
    alias: '', // 中文名	
    enName: '', // 英文名	
    columnType: '', // 数据类型	
    display: '', // 显示方式
    maxValuec: null, // 最大值
    minValuec: null, // 最小值
    rowspan: null, // 跨几行
    colspan: null, // 跨几列
    checkRule: '', // 字段验证（可选）
    height: null, // 表单高度
    width: null, // 列表列宽
    numPrecision: null, // 数字精度
    showOrder: null, // 显示顺序
    hidden: null, // 是否隐藏
    insertEnable: null, // 是否插入
    maxLength: null, // 最大长度
    fixed: null, // 是否可编辑
    orderColumn: null, // orderby 列名	
    ascDesc: '', // 排序方式
    pkey: null, // 是否为主键

  }
  private listHeight: number = 0
  created() {
    this.listHeight = Vue.prototype.PageHeight - 10
  }
  mounted() {
    this.getAlltabel()
  }
  // 向上
  private handleUp(index: number, row: any) {
    if (index <= 0) {
      console.log('已经是第一条了')
    } else {
      const upData = this.tableList[index - 1]
      this.tableList.splice(index - 1, 1)
      this.tableList.splice(index, 0, upData)
    }
  }
  // 向下
  private handleDown(index: number, row: any) {
    if (index == this.tableList.length - 1) {
      console.log('已经是最后一条了')
    } else {
      const downData = this.tableList[index + 1]
      this.tableList.splice(index + 1, 1)
      this.tableList.splice(index, 0, downData)
    }
  }

  // 获取所有表
  private getAlltabel() {
    getAlltabel({}).then((res: any) => {
      if (res.errorCode == 'SUCCESS') {
        this.tableList = res.data
        this.form.tableName = this.tableList[0].tableName
        //  获取表字段信息
        this.getAllColumn()
      }
    })
  }
  // 选择表名称
  private selectTableName() {
    console.log(this.form)
    this.getAllColumn()
  }
  // 获取表名
  private getAllColumn() {
    getAllColumn(this.form).then((res: any) => {
      this.tableDatas = res.data
    })
  }
  //   获取行数据
  private handleSelectRow(data: any) {
      console.log(data);
  }
}
</script>

<style lang="scss">
@import 'deploy.scss';
</style>
<style lang="scss" scoped>
// select下拉框
.el-select-dropdown {
  .el-scrollbar {
    .el-scrollbar__wrap {
      .el-scrollbar__view {
        .el-select-dropdown__item {
          height: 30px;
          line-height: 30px;
          padding: 0 10px;
        }
      }
    }
  }
}
</style>