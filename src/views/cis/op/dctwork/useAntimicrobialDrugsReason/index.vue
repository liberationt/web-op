<template>
  <div class="content">
    <el-row class="ht" :gutter="10">
      <el-col class="ht" :span="15">
        <div class="his-module his-small">
          <pagenation-list
            ref="pageTable"
            v-model="tableDatas"
            data-url="/op-service/drugsyklb/queryPage"
            http-method="post"
            :list-height="listSlotHeight"
          >
            <div slot="header">
              <div class="row">
                <div class="label">
                  <h1 class="title">抗菌药品使用原因维护</h1>
                </div>
                <div class="operate right">
                  <el-button
                    type="primary"
                    size="mini"
                    class="blue-gra"
                    icon="icon his-add"
                  >{{$t('common.add')}}</el-button>
                </div>
              </div>
            </div>
            <el-table
              :data="tableDatas"
              border
              stripe
              :highlight-current-row="true"
              slot="list"
              :height="listSlotHeight -105"
              class="scroll-bar"
            >
              <el-table-column prop="webSortNumber" width="32"></el-table-column>
              <el-table-column prop="mc" label="名称" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="syyp" label="适用药品" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="pydm" label="拼音代码" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="wbdm" label="五笔代码" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="qtdm" label="其他代码" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="zxbz" label="注销标志" width="80px"></el-table-column>
              <el-table-column
                prop="webSortNumber"
                :label="$t('table.actions')"
                width="60"
                align="center"
              >
                <template slot-scope="scope">
                  <el-tooltip :content="$t('common.delete')" effect="light">
                    <el-popconfirm
                      hideIcon
                      :cancelButtonText="$t('common.cancel')"
                      :confirmButtonText="$t('common.confirm')"
                      :title="$t('sysManage.confirmDeleted')"
                      @confirm="handleDelete(scope.row)"
                    >
                      <el-button slot="reference" class="red" @click.stop>
                        <i class="icon his-del his-cancellationicon"></i>
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col class="ht" :span="9">
        <div class="his-module his-small">
          <div slot="header" class="row">
            <div class="label">
              <h1 class="title">
                {{true
                ? $t('common.add')
                : $t('common.edit')}}
              </h1>
            </div>
            <div class="operate">
              <el-button
                size="mini"
                type="primary"
                class="green-gra"
                icon="icon his-save"
              >{{$t('common.save')}}</el-button>
            </div>
          </div>
          <el-form :model="data" ref="drugForm" label-width="68px">
            <el-form-item label="名称">
              <el-input ref="drugStoreName" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item label="适用药品">
              <el-select :placeholder="$t('common.placeholder')" ref="yklb"></el-select>
            </el-form-item>
            <el-form-item label="拼音代码">
              <el-input ref="drugStoreName" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item label="五笔代码">
              <el-input ref="drugStoreName" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item label="其他代码">
              <el-input ref="drugStoreName" :placeholder="$t('common.placeholder')"></el-input>
            </el-form-item>
            <el-form-item label="注销标志">
              <el-select :placeholder="$t('common.placeholder')" ref="sybz"></el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
@Component({
  name: 'useAntimicrobialDrugsReason',
})
export default class extends Vue {
  private value: any = {}
  private data: any = {}
  private tableDatas: Array<any> = []
  private listSlotHeight: number = 0
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
}
</script>

<style lang="scss" scoped>
.content .his-module .el-form {
  margin: 16px auto !important;
  width: 288px !important;
  .el-input,
  .el-select--medium {
    width: 220px !important;
  }
}
</style>
