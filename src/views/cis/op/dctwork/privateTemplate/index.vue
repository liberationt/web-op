<template>
  <div class="content">
    <!-- <div class="row" slot="header" style="padding: 0px">
      <div class="his-module his-small" style="width: 100%">
        <div class="btn">
          <el-button type="text">
            <i class="icon his-caozuo_zhuxiao red"></i>
            <span>{{ $t('common.logOff') }}</span>
          </el-button>
          <el-button type="text">
            <i class="icon his-caozuo_huifu"></i>
            <span>恢复</span>
          </el-button>
          <el-button type="text">
            <i class="icon his-btn-save green"></i>
            <span>{{ $t('common.save') }}</span>
          </el-button>
          <el-button type="text">
            <i class="icon his-btn-edit"></i>
            <span>{{ $t('residentDoctor.xgmb') }}</span>
          </el-button>
          <el-button type="text">
            <i class="icon his-caozuo-Details"></i>
            <span>预览</span>
          </el-button>
        </div>
      </div>
    </div>-->
    <el-row :gutter="10" :style="{ height: listSlotHeight - 10 + 'px' }">
      <el-col :span="4" style="height: 100%">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <h1 class="title">个人模板目录</h1>
            </div>
          </div>
          <!-- <el-tree
            :data="data"
            :props="defaultProps"
            @node-click="handleNodeClick"
            node-key="id"
            :default-expanded-keys="[1]"
            class="scroll-bar"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <i class="icon" :class="data.children ? getClass(node) : 'his-tree-submen'"></i>
              <span>{{ node.label }}</span>
            </span>
          </el-tree>-->
          <el-tree
            :data="data"
            :props="defaultProps"
            accordion
            @node-click="handleNodeClick"
            v-show="!folderSide"
            node-key="id"
            :default-expanded-keys="[1]"
            class="scroll-bar"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <i class="icon" :class="data.children ? getClass(node) : 'his-tree-submen'"></i>
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="20" style="height: 100%">
        <div class="his-module his-small">
          <div class="row">
            <div class="label">
              <h1 class="title">个人模板详情</h1>
              <div class="querySearch">
                <el-divider direction="vertical"></el-divider>
                <el-select v-model="value" class="w50"></el-select>
                <el-select v-model="value"></el-select>
              </div>
              <el-divider direction="vertical" class="mr4"></el-divider>
              <div class="btn">
                <el-button type="text">
                  <i class="icon his-caozuo_huifu"></i>
                  <span>恢复</span>
                </el-button>
                <el-button type="text">
                  <i class="icon his-btn-save green"></i>
                  <span>{{ $t('common.save') }}</span>
                </el-button>
              </div>
            </div>
          </div>
          <el-table
            :data="tableDatas"
            border
            :fit="true"
            stripe
            :highlight-current-row="true"
            :height="listSlotHeight - 70"
            class="scroll-bar"
          >
            <el-table-column prop="webSortNumber" width="32"></el-table-column>
            <el-table-column prop="mbmc" :label="$t('medicalTemp.mbmc')"></el-table-column>
            <el-table-column prop="mblx" :label="$t('residentDoctor.mblx')"></el-table-column>
            <el-table-column prop="sslx" :label="$t('residentDoctor.sslx')"></el-table-column>
            <el-table-column prop="mblx" :label="$t('residentDoctor.mblx')"></el-table-column>
            <el-table-column prop="bllb" :label="$t('residentDoctor.bllb')"></el-table-column>
            <el-table-column prop="jbmc" :label="$t('diagnosis.jbmc')"></el-table-column>
            <el-table-column prop="zt" width="50" :label="$t('common.status')"></el-table-column>
            <el-table-column
              :label="$t('table.actions')"
              width="80"
              align="center"
              class-name="action-btns"
            >
              <template slot-scope="scope">
                <el-tooltip
                  :content="$t('common.edit')"
                  v-if="!scope.row.webRowStatus"
                  effect="light"
                >
                  <el-button @click.stop="handleEditMid(scope.row)">
                    <i class="icon his-edit his-cancellationicon" />
                  </el-button>
                </el-tooltip>

                <el-tooltip :content="'注销'" effect="light" v-if="scope.row.webRowStatus">
                  <el-button class="blue" @click.stop="handleSaveMid(scope.row)">
                    <i class="icon his-caozuo_zhuxiao" />
                  </el-button>
                </el-tooltip>
                <!-- 启用停用 -->
                <el-tooltip :content="'注销'" effect="light">
                  <el-popconfirm
                    class="ml10"
                    hideIcon
                    :confirmButtonText="
                        scope.row.sfqy == 0
                          ? $t('common.enable')
                          : $t('common.disable')
                      "
                    :cancelButtonText="$t('common.cancel')"
                    :title="
                        scope.row.sfqy == 0
                          ? $t('sysManage.confirmAutomated')
                          : $t('sysManage.confirmDisabled')
                      "
                    @confirm="handleEnable(scope.row)"
                  >
                    <el-button
                      slot="reference"
                      :class="[scope.row.sfqy == 0 ? 'red' : 'green']"
                      @click.stop
                    >
                      <i class="icon" :class="'his-disabled'"></i>
                    </el-button>
                  </el-popconfirm>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
@Component({
  name: 'personalTemplate'
})
export default class extends Vue {
  private tableDatas: Array<any> = [{}]
  private value: string = 'cs'
  private data: Array<any> = [
    {
      label: '一级 1',
      children: [
        {
          label: '二级 1-1',
          children: [
            {
              label: '三级 1-1-1'
            }
          ]
        }
      ]
    },
    {
      label: '一级 2',
      children: [
        {
          label: '二级 2-1',
          children: [
            {
              label: '三级 2-1-1'
            }
          ]
        },
        {
          label: '二级 2-2',
          children: [
            {
              label: '三级 2-2-1'
            }
          ]
        }
      ]
    },
    {
      label: '一级 3',
      children: [
        {
          label: '二级 3-1',
          children: [
            {
              label: '三级 3-1-1'
            }
          ]
        },
        {
          label: '二级 3-2',
          children: [
            {
              label: '三级 3-2-1'
            }
          ]
        }
      ]
    }
  ]

  private defaultProps: any = {
    children: 'children',
    label: 'label'
  }

  private listSlotHeight: number = 0
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  private handleNodeClick() { }
  private getClass(node: any) {
    if (node.expanded) {
      return 'his-tree-Folder'
    } else {
      return 'his-tree-Folder_unfold'
    }
  }
  private logOff() { }
}
</script>

<style lang="scss" scoped>
.inline-block {
  display: inline-block;
  width: 72px;
}
.right {
  text-align: right;
}
.el-main {
  margin: 0;
  padding: 0;
}
::v-deep .el-dialog .el-dialog__body {
  padding: 6px !important;
}
.el-button + .el-button {
  margin-left: 0px;
}
.icon {
  font-size: 14px !important;
}
.mr4 {
  margin-right: 4px;
}
.el-tree .icon {
  color: #6a6d78;
}
.w50 {
  width: 100px !important;
  margin-right: 8px;
}

::v-deep .el-tree-node__expand-icon {
  padding: 0 2px 0 0 !important ;
  color: #6a6d78;
}
::v-deep .el-tree {
  margin-top: 6px !important;
  overflow: auto;
  height: 100%;
  span {
    font-size: 13px;
  }
  .icon {
    margin: 0 2px 0 2px;
    font-size: 14px;
    color: #6a6d78;
  }
  .el-tree-node__content {
    margin-bottom: 0;
    height: 22px;
  }
  .el-tree-node__content:hover {
    background-color: rgba($color: $blue, $alpha: 0.1);
    border-radius: 4px;
  }
  .el-tree-node:focus > .el-tree-node__content {
    background-color: rgba($color: $blue, $alpha: 0.1);
  }
  .custom-tree-node {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover {
      text-overflow: inherit;
      white-space: normal;
    }
  }
}
</style>
