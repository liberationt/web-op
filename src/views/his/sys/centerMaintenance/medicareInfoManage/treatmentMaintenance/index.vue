<!--
 * @Date:
 * @LastEditors:
 * @LastEditTime: 
 * @description: 诊疗项目维护
 -->
 
 <template>
  <div class="content">
    <el-row :gutter="10" class="ht">
      <el-col :span="5" class="ht">
        <div class="his-module his-small">
          <div slot="header" class="row">
            <div class="label">
              <div class="title">医技树类型</div>
            </div>
          </div>
          <el-tree :data="leftTreeData" :props="defaultProps" ref="tree" default-expand-all>
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <i class="icon" :class="data.children ? getClass(node) : 'his-tree-submen'"></i>
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="8" class="ht">
        <div class="his-small his-module">
          <pagenation-list
            ref="pageTable"
            v-model="tableDatas"
            data-url
            http-method="post"
            :list-height="listSlotHeight"
            :searchData="searchData"
          >
            <div slot="header" class="row">
              <div class="label">
                <div class="btn">
                  <el-button type="text" size="mini">
                    <i class="icon his-btn-add"></i>
                    <span>新增</span>
                  </el-button>
                  <el-divider direction="vertical" class="mr4"></el-divider>
                  <el-button type="text" size="mini">
                    <i class="icon his-btn-save-copy blue"></i>
                    <span>生成号源(未来30天)</span>
                  </el-button>
                  <el-divider direction="vertical" class="mr4"></el-divider>
                  <el-button type="text" size="mini">
                    <i class="icon his-btn-save-copy blue"></i>
                    <span>全部生成(未来30天)</span>
                  </el-button>
                </div>
              </div>
            </div>
            <el-table
              :data="tableDatas"
              border
              stripe
              :highlight-current-row="true"
              slot="list"
              :height="listSlotHeight"
              class="scroll-bar"
            >
              <!-- 序号 -->
              <el-table-column prop="webSortNumber" width="32" align="center"></el-table-column>
              <!-- 设备编号 -->
              <el-table-column prop="sbbh" :label="$t('设备编号')" width="80"></el-table-column>
              <!--设备名称 -->
              <el-table-column prop="sbmc" :label="$t('设备名称')"></el-table-column>
              <!-- 接口类型 -->
              <el-table-column :label="$t('接口类型')"></el-table-column>
              <!-- 上午开始时间 -->
              <el-table-column prop="swkssj" :label="$t('上午开始时间')" width="120"></el-table-column>
              <!-- 上午结束时间 -->
              <el-table-column prop="swjssj" :label="$t('上午结束时间')" width="120"></el-table-column>
              <!-- 上午间隔分钟 -->
              <el-table-column prop="swjgfz" :label="$t('上午间隔分钟')" width="120"></el-table-column>
              <!-- 下午开始时间 -->
              <el-table-column prop="xwkssj" :label="$t('下午开始时间')" width="120"></el-table-column>
              <!-- 下午结束时间 -->
              <el-table-column prop="xwjssj" :label="$t('下午结束时间')" width="120"></el-table-column>
              <!-- 下午间隔分钟 -->
              <el-table-column prop="xwjgfz" :label="$t('下午间隔分钟')" width="120"></el-table-column>
              <!-- 预约总数 -->
              <el-table-column prop="yyzs" :label="$t('预约总数')"></el-table-column>
              <!-- 设备地址 -->
              <el-table-column prop="sbdz" :label="$t('设备地址')"></el-table-column>
              <!-- 门诊使用 -->
              <el-table-column prop="mzsy" :label="$t('门诊使用')"></el-table-column>
              <!-- 住院使用 -->
              <el-table-column prop="zysy" :label="$t('住院使用')"></el-table-column>
              <!-- 体检使用 -->
              <el-table-column prop="tjsy" :label="$t('体检使用')"></el-table-column>
              <!-- 操作 -->
              <el-table-column :label="$t('操作')" width="60" align="center">
                <template slot-scope="scope">
                  <!-- 删除 -->
                  <el-tooltip :content="$t('common.delete')" effect="light">
                    <el-popconfirm
                      hideIcon
                      :confirmButtonText="$t('common.confirm')"
                      :cancelButtonText="$t('common.cancel')"
                      @confirm="handleDelete(scope.row)"
                    >
                      <el-button slot="reference" class="red">
                        <i class="icon his-del his-cancellationicon" />
                      </el-button>
                    </el-popconfirm>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </pagenation-list>
        </div>
      </el-col>
      <el-col :span="11" class="ht">
        <div class="his-module his-small"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
export default class extends Vue {
  private listSlotHeight: number = 0 //高度
  private searchData: any = {} //搜素参数
  private tableDatas: Array<any> = [{}]
  created() {
    this.listSlotHeight = Vue.prototype.PageHeight
  }
  private leftTreeData: Array<any> = [
    {
      label: '上海天佑医院',
      children: [
        {
          label: '门诊科',
          name: 'consultation',
        },
        {
          label: '住院部',
          name: 'antibacterials',
        },
        {
          label: 'CT室',
          name: 'operationReport',
        },
        {
          label: '生化室',
          name: '9999',
        },
        {
          label: '雾化室',
          name: 'ProofOfIllness',
        },
        {
          label: '静配室',
          name: 'outpat',
        },
      ],
    },
    {
      label: '上海天佑医院',
      children: [
        {
          label: '门诊科',
          name: 'consultation',
          children: [
            {
              id: 9,
              label: '三级 1-1-1',
            },
            {
              id: 10,
              label: '三级 1-1-2',
            },
          ],
        },
        {
          label: '住院部',
          name: 'antibacterials',
        },
        {
          label: 'CT室',
          name: 'operationReport',
        },
        {
          label: '生化室',
          name: '9999',
        },
        {
          label: '雾化室',
          name: 'ProofOfIllness',
        },
        {
          label: '静配室',
          name: 'outpat',
        },
      ],
    },
  ]
  private defaultProps: object = {
    children: 'children',
    label: 'label',
  }
  private getClass(node: any) {
    if (node.expanded) {
      return 'his-tree-Folder'
    } else {
      return 'his-tree-Folder_unfold'
    }
  }
}
</script>