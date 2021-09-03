<template>
  <el-dropdown
    trigger="click"
    class="international"
    @command="handleSetLanguage"
  >
    <div>
      <img
        class="pic-guojihua"
        src="@/assets/main-img/guojihua@2x.png"
        alt="guojihua"
      />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language === 'zh'" command="zh">
        中文
      </el-dropdown-item>
      <el-dropdown-item :disabled="language === 'en'" command="en">
        English
      </el-dropdown-item>
      <el-dropdown-item :disabled="language === 'es'" command="es">
        Español
      </el-dropdown-item>
      <el-dropdown-item :disabled="language === 'ja'" command="ja">
        日本語
      </el-dropdown-item>
      <el-dropdown-item :disabled="language === 'ko'" command="ko">
        한국어
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'Login',
})
export default class extends Vue {
  get language() {
    return AppModule.language
  }

  private handleSetLanguage(lang: string) {
    this.$i18n.locale = lang
    AppModule.SetLanguage(lang)
    this.$message({
      message: 'Switch Language Success',
      type: 'success',
    })
  }
}
</script>

<style lang="scss" scoped>
.pic-guojihua {
  widows: 30px;
  height: 30px;
}
</style>
