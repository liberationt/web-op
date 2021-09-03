<template>
  <el-dialog
    :visible.sync="isVisible"
    title="其他项目-明细"
    width="60%"
    :append-to-body="true"
    class="narrow-dialog"
  >
    <div class="content his-sys-content">
      <div class="his-module his-small" style="padding: 8px 10px">
        <div class="row" style="padding: 8px 0">
          <div class="label">
            <div style="font-size: 13px; margin-right: 8px;">搜索</div>
            <el-input v-model="value" placeholder="请输入拼音码" @keyup.native.enter="getList">
              <i slot="prefix" class="el-input__icon icon his-search"></i>
            </el-input>
            <el-divider class="ml4" direction="vertical"></el-divider>
            <div class="btn">
              <el-button type="text" size="mini" @click="handleAdd">
                <i class="icon his-caozuo-fold"></i>调入
              </el-button>
              <el-button type="text" size="mini" @click="modify">
                <i class="icon his-btn-edit"></i>修改
              </el-button>
              <el-button type="text" size="mini">
                <i class="icon his-btn-print"></i>打印
              </el-button>
              <el-button type="text" size="mini">
                <i class="icon his-btn-close-copy red"></i>关闭
              </el-button>
            </div>
          </div>
        </div>
        <pagenation-list
          ref="pageTable"
          data-url
          http-method="post"
          v-model="tableData"
          :searchData="searchData"
          :list-height="listSlotHeight"
        >
          <el-table
            slot="list"
            stripe
            :data="tableData"
            border
            :height="listSlotHeight/2"
            class="scroll-bar"
            tooltip-effect="light"
          >
            <el-table-column type="index" width="32" align="center"></el-table-column>
            <el-table-column label="费用名称" prop="fymc" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="dw" width="60px" show-overflow-tooltip></el-table-column>
            <el-table-column label="拼音码" prop="pym" width="90" show-overflow-tooltip></el-table-column>
            <el-table-column label="单价" prop="dj" width="70px"></el-table-column>
            <el-table-column label="自动插入" prop="zdcr" width="70px"></el-table-column>
            <el-table-column label="限制使用" prop="xzsy" width="70px"></el-table-column>
            <el-table-column label="限制周期" prop="xzzq" width="100px"></el-table-column>
            <el-table-column label="限制次数" prop="xzcs" width="70px" show-overflow-tooltip></el-table-column>
            <el-table-column label="商保价格" prop="sbjg" width="70" show-overflow-tooltip></el-table-column>
            <el-table-column label="CPT CODE" prop="CODE" width="95px"></el-table-column>
            <el-table-column label="英文名称" prop="ywmc" width="100px"></el-table-column>
            <el-table-column label="价格标志" prop="jgbz" width="70px"></el-table-column>
            <el-table-column label="是否作废" prop="sfzf" width="70px"></el-table-column>
            <el-table-column
              label="操作"
              width="52"
              class-name="action-btns"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <!-- 作废/取消作废 -->
                <el-tooltip :content="scope.row.zfpb == '0'?'作废':'取消作废'" effect="light">
                  <el-popconfirm
                    class="ml10"
                    hideIcon
                    :confirmButtonText="
                    scope.row.zfpb == '0' ? '作废':'取消作废'"
                    :cancelButtonText="$t('common.cancel')"
                    :title="
                    scope.row.zfpb == '0'
                      ? '确认作废?'
                      : '确认取消作废?'
                  "
                    @confirm="handleEnable(scope.row)"
                  >
                    <el-button slot="reference" :class="[scope.row.zfpb == '0' ? 'red' : 'green']">
                      <i
                        class="icon"
                        :class="[
                        scope.row.zfpb == '0'
                          ? 'his-youcaozuo_zuofei'
                          : 'his-youcaozuo_huifu',
                      ]"
                      ></i>
                    </el-button>
                  </el-popconfirm>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </pagenation-list>
        <othersTransferIn ref="othersTransferIn"></othersTransferIn>
        <othersPayService ref="othersPayService"></othersPayService>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { log } from 'util'
import { rightScroll, id2Name } from '@/utils/index.ts'
import othersTransferIn from './othersTransferIn.vue'
import othersPayService from './othersPayService.vue'
// 命名文件名称，过滤器什么的都在这里写
@Component({
  name: 'medicalDialog',
  components: { othersTransferIn, othersPayService },
})
export default class extends Vue {
  private isVisible: boolean = false // 明细弹框默认隐藏
  private isCancel: boolean = false
  private listSlotHeight: number = 0
  private value: any = ''
  private tableData: Array<any> = [
    {
      fymc: '测试',
      dw: '笔',
      pym: 'CS01',
      zdcr: '否',
      xzsy: '否',
      xzzq: '',
      xzcs: '',
      sbjg: '0000',
      CODE: '',
      ywmc: '',
      jgbz: '未启用',
      sfzf: '否',
    },
    {
      fymc: '测试',
      dw: '笔',
      pym: 'CS01',
      zdcr: '否',
      xzsy: '否',
      xzzq: '',
      xzcs: '',
      sbjg: '0000',
      CODE: '',
      ywmc: '',
      jgbz: '未启用',
      sfzf: '否',
    },
    {
      fymc: '测试',
      dw: '笔',
      pym: 'CS01',
      zdcr: '否',
      xzsy: '否',
      xzzq: '',
      xzcs: '',
      sbjg: '0000',
      CODE: '',
      ywmc: '',
      jgbz: '未启用',
      sfzf: '否',
    },
  ]
  private searchData: any = {}
  private getList() {}
  private handleDelete() {}
  private open() {
    this.isVisible = true
  }
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  @Watch('tableData')
  private onValueChange(value: string) {
    rightScroll()
  }
  //调入弹框
  private handleAdd() {
    ;(this.$refs.othersTransferIn as any).open()
  }
  //修改弹框
  private modify() {
    ;(this.$refs.othersPayService as any).open()
  }
}
</script>
<style lang="scss" scoped>
.content {
  background: #fff;
  height: auto;
  border-radius: 8px;
}

.his-module.his-small {
  padding: 0 0 8px !important;
}
.row .label .el-input {
  width: 190px;
}

.el-dialog__wrapper.narrow-dialog .el-dialog__body .row {
  padding-bottom: 0;
}
// 右侧状态框悬浮
::v-deep .el-table__fixed-right {
  height: 100% !important;
}
</style>