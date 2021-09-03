<!--
 * @Date: 2020-05-26 17:12:38
 * @LastEditTime: 2020-05-26 17:18:11
 * @Description: 
 * @FilePath: \web-op\src\views\cis\op\dctwork\patients\components\outpatientConsent.vue
--> 
<template>
  <div class="module">
    <div class="his-module layout-top his-small">
      <div slot="header">
        <div class="row">
          <div class="label">
            <!-- 打印 -->
            <el-button>
              <i class="his-print icon"></i>打印
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

@Component({
  name: 'outpatientConsent',
  filters: {},
})
export default class extends Vue {
  private ruleForm: any = {}
  private rules: any = {
    // primaryDiagnosis: { required: true, message: '请输入手术医师', trigger: 'blur' },
  }
}
</script>
