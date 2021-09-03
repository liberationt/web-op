<template>
  <div class="content">
    <div class="his-module">
      <pagenation-list
        ref="pageTable"
        data-url="/system-service/sysmenu/queryPage"
        v-model="tablelist"
        :searchData="searchData"
        :list-height="listSlotHeight"
        http-method="post"
      >
        <div slot="header" class="row">
          <div class="label">
            <h1 class="title" style="flex: 1;">
              <!-- 菜单列表 -->
              {{ $t('sysManage.menuTitle') }}
            </h1>
          </div>
          <div class="operate">
            <el-button type="primary" class="blue-gra" icon="icon his-add" @click="handleAdd">
              <!-- 新增 -->
              {{ $t('common.add') }}
            </el-button>
          </div>
        </div>
        <el-table
          stripe
          slot="list"
          row-key="menuId"
          :indent="8"
          :load="loadData"
          :tree-props="{ children: 'children', hasChildren: 'countSon' }"
          :data="tablelist"
          :height="listSlotHeight"
          class="scroll-bar"
          border
          lazy
          highlight-current-row
          ref="table"
          @row-click="getRow"
          v-loading="loading"
          tooltip-effect="light"
        >
          <!-- label="菜单名称" -->
          <el-table-column :label="$t('sysManage.menuName')" prop="menuName"></el-table-column>
          <!-- 排序号 -->
          <el-table-column :label="$t('sysManage.menuSort')" prop="menuSort" width="100"></el-table-column>
          <!-- 图标 -->
          <el-table-column
            :label="$t('sysManage.menuIcon')"
            header-align="left"
            width="60"
            prop="menuIcon"
          >
            <template slot-scope="scope">
              <i :class="'icon ' + scope.row.menuIcon"></i>
            </template>
          </el-table-column>
          <!-- 类型 -->
          <el-table-column :label="$t('sysManage.modelTypeFlag')" prop="modelTypeFlag" width="100">
            <template slot-scope="scope">
              <!-- 菜单类型 -->
              <span>{{scope.row.modelTypeFlag|filterType}}</span>
              <!-- <span>
                {{
                  scope.row.modelTypeFlag == 1
                    ? $t('sysManage.page')
                    : $t('sysManage.report')
              }}</span>-->
            </template>
          </el-table-column>
          <!-- 路由地址 -->
          <el-table-column :label="$t('sysManage.routeName')" prop="routeName" width="200"></el-table-column>
          <!-- URL地址 -->
          <el-table-column
            :label="$t('sysManage.menuUrl')"
            prop="menuUrl"
            show-overflow-tooltip
          ></el-table-column>
          <!-- 报表 -->
          <!-- <el-table-column :label="$t('sysManage.reportId')" prop="reportId"></el-table-column> -->
          <!-- 状态 -->
          <el-table-column :label="$t('sysManage.displayFlag')" prop="displayFlag" width="80">
            <template slot-scope="scope">
              <!-- 停用or 启用 -->
              <span :class="[scope.row.displayFlag == '1' ? 'reds' : 'blues']">
                {{
                scope.row.displayFlag == '1'
                ? $t('common.disable')
                : $t('common.enable')
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('common.action')"
            align="center"
            width="160"
            class-name="fixed-width"
          >
            <template slot-scope="scope">
              <el-tooltip :content="$t('common.edit')" effect="light">
                <!-- 编辑 -->
                <span class="mr10">
                  <el-button
                    class="blue"
                    @click="handleEdit(scope.row)"
                    :disabled="scope.row.displayFlag == '0'"
                  >
                    <i class="icon his-edit" />
                  </el-button>
                </span>
                <!-- 0启用，1停用 -->
              </el-tooltip>

              <el-tooltip :content="$t('common.addSub')" effect="light">
                <el-button class="green" @click="handleAdd(scope.row)">
                  <i class="icon his-append"></i>
                </el-button>
              </el-tooltip>

              <!-- 启用/停用 -->
              <el-tooltip
                :content="scope.row.displayFlag == '0'?$t('common.disable'):$t('common.enable')"
                effect="light"
              >
                <el-popconfirm
                  class="ml10"
                  hideIcon
                  :confirmButtonText="
                    scope.row.displayFlag == '0'
                      ? $t('common.disable')
                      : $t('common.enable')
                  "
                  :cancelButtonText="$t('common.cancel')"
                  :title="
                    scope.row.displayFlag == '0'
                      ? $t('sysManage.confirmDisabled')
                      : $t('sysManage.confirmAutomated')
                  "
                  @confirm="handleEnable(scope.row)"
                >
                  <el-button
                    slot="reference"
                    :class="[scope.row.displayFlag == '0' ? 'red' : 'green']"
                  >
                    <i
                      class="icon"
                      :class="[
                        scope.row.displayFlag == '0'
                          ? 'his-disabled'
                          : 'his-automated',
                      ]"
                    ></i>
                  </el-button>
                </el-popconfirm>
              </el-tooltip>
              <!-- 删除 -->
              <el-tooltip :content="$t('common.delete')" effect="light">
                <el-popconfirm
                  class="ml10"
                  hideIcon
                  :cancelButtonText="$t('common.cancel')"
                  :confirmButtonText="$t('common.confirm')"
                  :title="$t('sysManage.confirmDeleted')"
                  @confirm="handleDelete(scope.row)"
                >
                  <el-button slot="reference" class="red" :disabled="scope.row.displayFlag == '0'">
                    <i class="icon his-del his-cancellationicon"></i>
                  </el-button>
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </pagenation-list>
    </div>
    <el-dialog
      :visible.sync="showDetail"
      :title="title"
      :cancel-text="$t('common.close')"
      width="410"
      :before-close="handleCancle"
      v-elDraggableDialog
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <detail
        ref="refForm"
        v-model="formValidate"
        :notAllowBtn="notAllowBtn"
        @closeDialog="handleCancle"
        @submit="handleGet"
      />
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import {Component, Vue, Watch,Prop} from 'vue-property-decorator'
import detail from './components/detail.vue'
import {
  queryMenuList,
  findMenuList,
  IMenuList,
  addMenu,
  editMenu,
  enableMenu,
  getOneMenu,
  deleteMenu,
  getMaxSort
} from '@/api/his/user/setMenu.ts'
import { getLanguage } from '@/utils/cookies'

// 声明接口
declare interface pageList {
  id:number
}

//命名文件名称，过滤器，组件
@Component({
	name: '',
	filters: {
		filterType(value: string) {
      var type: string = ''
      switch (value) {
        case '1': // 菜单
          type = window.ele.$i18n.t('sysManage.menu')
          break
        case '2': // 报表
          type = window.ele.$i18n.t('sysManage.reportId')
          break
        case '3': // 按钮
          type = window.ele.$i18n.t('sysManage.btn')
          break
        case '4': // 页面
          type = window.ele.$i18n.t('sysManage.page')
          break
      }
      return type
    }
	},
	components: {
    detail
  }
})

export default class extends Vue {
	// 声明变量
	private tablelist: any = []
	private searchData: any = {}
  private listSlotHeight: number = 0
  private curRow: any = '' // 当前行
  private loading = true
	// 子组件
	private showDetail: boolean = false
	private title = ''
	private notAllowBtn: boolean = true //默认不可以是按钮
	private formValidate: IMenuList = {
		index: '',
    menuName: '',
    menuName1: '',
    menuName2: '',
    menuName3: '',
    menuName4: '',
		menuIcon: 'his-add',
		menuUrl: '',
		reportId: '',
		menuSort: null,
		parentMenuId: '',
		buttonKey: '',
		modelTypeFlag: '1'
	}

	public setValue(value: string) {
		this.setValue(value)
	}
	public getValue() {
		return null
	}
	// 监听方法
	@Watch('tablelist')
	private onValueChange(value: string) {
    this.loading = false
  }

  // @Watch('tablelist')
	// private onValueChange(value: string) {
  //   this.loading = false
  // }

	// 方法
	// 获取列表
	private getList() {
    const pageTable: any = this.$refs.pageTable
		pageTable.getList()
	}

	// 点击获取子节点
	private loadData(row: any, treeNode: any, resolve: any){
		findMenuList({ parentMenuId: row.menuId }).then((res:any)=>{
			resolve(res.data)
		});

		// const { data } = await findMenuList({ parentMenuId: row.menuId })
		// resolve(data)
	}

	// 新增按钮
	private handleAdd(item: any){
    console.log("item");
    console.log(item);
		this.showDetail = true
    this.title = this.$t('common.add').toString()
    this.notAllowBtn = true // 不允许是按钮
    // 取最大值
    getMaxSort({}).then(res => {
      this.formValidate.menuSort = res.data
    })
    // 新增下级
    if (item.menuId) {
      console.log(item)
      this.formValidate.parentMenuId = item.menuId
      // 菜单和页面下可以加按钮
      if (item.modelTypeFlag == '1' || item.modelTypeFlag == '4') {
        this.notAllowBtn = false
      } else {
        this.notAllowBtn = true
      }
    }
	}

	// 关闭弹窗
	private handleCancle(){
    this.showDetail = false
    this.resetForm()
	}

	//确认弹窗
	private handleGet(val: any) {
    this.formValidate = val
    this.handleSubmit()
  }

  // 提交
  private handleSubmit() {
    if (this.title == this.$t('common.add').toString()) { // 新增
      addMenu(this.formValidate).then((res: any) => {
        this.$notify({
          title: this.$t('common.addSuc').toString(),
          type: 'success',
          message: ''
        })
        this.refreshChildren(this.curRow.menuId) // 更新子节点
        this.showDetail = false
        this.getList()
        this.resetForm()
      })
    } else { // 编辑
      editMenu(this.formValidate).then((res: any) => {
        this.$notify({
          title: this.$t('common.editSuc').toString(),
          type: 'success',
          message: ''
        })
        this.refreshChildren(this.curRow.parentMenuId) // 更新子节点
        this.showDetail = false
        this.getList()
        this.resetForm()
      })
    }
  }

  // 停用/启用
  private handleEnable(item: any) {
    if (item.displayFlag == 1) {
      enableMenu({ menuId: item.menuId, displayFlag: '0' }).then((res: any) => {
        item.displayFlag = '0'
        this.$notify({
          title: this.$t('common.enabled').toString(),
          message: '',
          type: 'success'
        })
        // this.getList()
      })
    } else {
      enableMenu({ menuId: item.menuId, displayFlag: '1' }).then((res: any) => {
        item.displayFlag = '1'
        this.$notify({
          title: this.$t('common.disabled').toString(),
          message: '',
          type: 'success'
        })
        // this.getList()
      })
    }
  }

  // 编辑按钮,根据menuId查询详情并返回form
  private handleEdit(item: any) {
    getOneMenu({ menuId: item.menuId }).then((res: any) => {
      this.formValidate = Object.assign({}, res.data)
      this.title = this.$t('common.edit').toString()
      this.showDetail = true
    })
  }

  // 删除
  private handleDelete(val: any) { //val，当前行数据
    console.log('val', val)
    deleteMenu({ menuId: val.menuId }).then(() => {
      this.$notify({
        title: this.$t('common.delSuc').toString(),
        type: 'success',
        message: ''
      })

      this.getList()
      // 存在子节点，调用load函数的刷新子节点数据
      if (val.parentMenuId) {
        // this.loadData(val,treeNode: any, resolve: any)
        this.refreshChildren(val.parentMenuId)
      } else {
        // this.refresh(val, '')
      }
    })
  }

  // 更新子节点
  refreshChildren(pId: number){
    console.log("pId",pId);
    const table: any = this.$refs.table
    findMenuList({ parentMenuId: pId }).then((res:any)=>{
      this.$set(table.store.states.lazyTreeNodeMap, pId, res.data)
    });
  }

  // 重置表单
  private resetForm(){
		this.formValidate = {
      index: '',
      menuName: '',
      menuName1: '',
      menuName2: '',
      menuName3: '',
      menuName4: '',
      menuIcon: 'his-add',
      menuUrl: '',
      reportId: '',
      menuSort: null,
      parentMenuId: '',
      buttonKey: '',
      modelTypeFlag: '1'
    }
  }

  //当前行
  getRow(row: any){
    console.log('当前行');
    console.log(row);
    this.curRow = row
  }

	//初始化的周期函数
	created (){
    this.listSlotHeight = Vue.prototype.PageHeight - 114
	}
	mounted(){
		this.getList()
	}
}
</script>
