// 基础设置----主诉设置
<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="6">
        <div class="his-module his-small">
          <div slot="header" class="row">
            <h1>主诉类别 </h1>
            <div class="btn">
              <el-button size="mini" type="text" @click="addNode(0)">
                <i class="icon his-btn-add green"></i>
                <span>{{ $t('common.add') }}</span>
              </el-button>
            </div>
          </div>
          <div slot="list" class="tree">
            <el-tree ref="tree" :data="treeData" :props="defaultProps" node-key="id" accordion @node-click="handleNodeClick" class="scroll-bar" :expand-on-click-node="true" highlight-current default-expand-all>
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <div>
                  <i class="icon" :class="data.children ? getClass(node) : 'his-tree-submen'"></i>
                  <span>{{ node.label }}</span>
                </div>
                <div>
                  <span>
                    <el-button type="text" size="mini" @click="() => addNode(data)">
                      添加
                    </el-button>
                    <el-button type="text" size="mini" @click="() => remove(node, data)">
                      删除
                    </el-button>
                  </span>
                </div>
              </span>
            </el-tree>
          </div>
        </div>
      </el-col>
      <!-- 主诉 -->
      <el-col class="ht" :span="9">
        <div class="his-module his-small">
          <div slot="header" class="row">
            <h1>主诉</h1>
            <div class="btn">
              <el-button size="mini" type="text" @click="addZs">
                <i class="icon his-btn-add green"></i>
                <span>{{ $t('common.add') }}</span>
              </el-button>
            </div>
          </div>
          <el-table :data="tableFormat" border stripe :highlight-current-row="true" slot="list" @row-click="handleClick" :height="listSlotHeight" class="scroll-bar no-underline">
            <el-table-column type="index" width="32"></el-table-column>
            <el-table-column prop="zsms" :label="'描述'" width="140" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="bqfjName" :label="'分级'" min-width="60"> </el-table-column>

            <el-table-column :label="$t('common.action')" align="center" min-width="60" class-name="fixed-width">
              <template slot-scope="scope">
                <!-- 删除 -->
                <el-popconfirm hideIcon :cancelButtonText="$t('common.cancel')" :confirmButtonText="$t('common.confirm')" :title="$t('sysManage.confirmDeleted') + '[' + scope.row.zsms + ']'" @confirm="handleDelete(scope.row)">
                  <el-button slot="reference" class="red">
                    <i class="icon his-del his-cancellationicon"></i>
                  </el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col class="ht" :span="9">
        <div class="his-module his-small">
          <div slot="header" class="row">
            <div class="label">
              <h1 class="title">{{ isEdit ? '编辑' : '新增' }}</h1>
            </div>
            <div class="operate">
              <el-button :disabled="zslbid==0" type="primary" class="green-gra" icon="icon his-save" size="mini" @click="handleSave">{{ $t('common.save') }} </el-button>
            </div>
          </div>
            <el-form :model="forms" ref="formValidate" :rules="rules" label-width="80px" class="his-form">
              <el-form-item :label="'描述'" prop="zsms">
                <el-input type="textarea" v-model="forms.zsms" :placeholder="'请输入内容'"></el-input>
              </el-form-item>
              <el-form-item :label="'病情分级'" prop="bqfj">
                <el-select v-model="forms.bqfj" :placeholder="'请输入内容'">
                  <el-option v-for="item in sourceData" :key="item.dv" :value="item.dv" :label="item.dn"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { id2Name } from '@/utils'
import { Form } from 'element-ui'
import { AxiosResponse } from 'axios'
import { queryTreeData, addTreeNode, deleteTreeNode, findListById,addZs, editZs,deleteZs } from '@/api/ecis/pretriage/basic'

@Component({
  name: 'basic',
  filters: {},
  components: {},
})
export default class extends Vue {
  private treeData: any[] = [] //门诊病历的列表
  private listSlotHeight: number = 0
  private list: any[] = []
  private defaultProps: any = {
    children: 'children',
    label: 'zslb',
    id: 'zslbid',
  }
  private forms: any = {
    zslbid: 0
  }
  private rules: any = {
    zsms: [{required: true, message: '请输入描述', trigger: blur}],
    bqfj: [{required: true, message: '请选择病情分级', trigger: blur}],
  }
  private sourceData: any[] = []
  private isEdit: boolean = false
  private zslbid: number =  0

  created() {
    this.listSlotHeight = Vue.prototype.PageHeight - 62 - 43

  }

  mounted() {
    this.sourceData = Vue.prototype.$qiankun ? Vue.prototype.$store.webSqlDict.PATIENT_TYPE_DICT :this.$store.state.webSqlDict.PATIENT_TYPE_DICT
    this.getTreeList()
  }

  get tableFormat() {
    const tabledata = this.list
    id2Name(tabledata, 'bqfj', 'bqfjName', this.sourceData, 'dv', 'dn')
    return tabledata
  }

  private getTreeList() {
    queryTreeData({}).then((res: AxiosResponse) => {
      this.treeData = res.data
    })
  }

  private handleNodeClick(val: any) {
    if (val.children == null) {
      findListById({ zslbid: val.zslbid }).then((res: AxiosResponse) => {
        this.list = res.data
        this.zslbid = val.zslbid
        this.forms.zslbid = val.zslbid
      })
    }
  }

  private queryZsList(val?:string) {
     findListById({ zslbid: val }).then((res: AxiosResponse) => {
        this.list = res.data
      })
  }

  private addNode(fid?: any) {
    this.$prompt('当前节点名称', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
      .then(({ value }: any) => {
        const treeNode = {
          zslb: value,
          fid: typeof fid == 'number' ? fid : fid.zslbid,
          children: [],
        }
        addTreeNode(treeNode).then((res: AxiosResponse) => {
          this.$notify.success('已添加')
          this.getTreeList()
        })
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入',
        })
      })
  }

  private remove(node: any, data: any) {
    if (data.children && data.children.length > 0) {
      this.$notify.warning('该节点下有数据，请先删除节点数据')
      return
    }
    deleteTreeNode({ zslbid: data.zslbid }).then((res: AxiosResponse) => {
      this.$notify.success('已删除')
      this.getTreeList()
    })
  }

  private handleClick(val:any) {
    console.log('val',val);

    this.forms = {...val}
  }

  private addZs() {
    this.forms = {
      zslbid: this.zslbid
    }
  }

  private handleSave() {
    (this.$refs.formValidate as Form).validate((valid:any) => {
      if (valid) {
        if (this.forms.zsmsid) {
          editZs(this.forms).then((res:AxiosResponse) => {
            this.queryZsList(this.forms.zslbid)
            this.forms = {}
            this.$notify.success('修改成功')
          })
        }else {
          addZs(this.forms).then((res:AxiosResponse)=>{
            this.queryZsList(this.forms.zslbid)
            this.forms = {}
            this.$notify.success('新增成功')
          })
        }
      }
    })
  }

  private handleDelete(val: any) {
    if (val.zslbid && val.zsmsid) {
      deleteZs({zsmsid:val.zsmsid}).then((res:AxiosResponse)=>{
        this.$notify.success('已删除')
        this.queryZsList(val.zslbid)
      })
    }
  }
  // 切换el-tree 样式
  private getClass(node: any) {
    if (node.expanded) {
      return 'his-tree-Folder'
    } else {
      return 'his-tree-Folder_unfold'
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-tree-node {
  //   flex: 1;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  width: 100%;
}

::v-deep .his-form {
  margin: 10px !important;
  padding: 0 60px !important;
  display: flex;
  flex-direction: column;
  width: auto;
  // align-items: center;

}
</style>
