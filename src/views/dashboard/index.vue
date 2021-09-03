<!--
 * @Author: 曹俊
 * @LastEditTime: 2020-06-22 10:22:19
 * @LastEditors: 曹俊
 * @Description: 
 * @FilePath: \web-op\src\views\dashboard\index.vue
--> 
<template>
  <div class="app-container">
    <h3>欢迎你</h3>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'Dashboard',
  components: {}
})
export default class extends Vue {
  private currentRole = 'admin-dashboard'

  created() {
    // onCreated 事件
    
  }
}
</script>
