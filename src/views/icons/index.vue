<template>
  <div class="icons-container">
    <aside>
      <a
        href="https://armour.github.io/vue-typescript-admin-docs/guide/advanced/icon.html"
        target="_blank"
      >Add and use</a>
    </aside>
    <el-tabs type="border-card">
      <el-tab-pane label="Icons">
        <div class="grid">
          <div class="el-title">框架icon</div>
          <!-- 框架icon -->
          <div
            v-for="item of svgIcons"
            :key="item"
            @click="handleClipboard(generateSvgIconCode(item),$event)"
          >
            <el-tooltip placement="top">
              <div slot="content">{{ generateSvgIconCode(item) }}</div>
              <div class="icon-item">
                <svg-icon :name="item" class="disabled" />
                <span>{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
          <!-- 自定义icon -->
          <div class="el-title">自定义icon</div>
          <div class="list">
            <div class="item">
              <i class="icon his-edit"/>
              <!-- <p><i class="icon his-edit"></i> </p> -->
              <p class="icon-code">&lt;i class="icon his-edit"&gt;&lt;i&gt;</p>
            </div>
          </div>
          <!-- 自定义按钮 -->
          <div class="el-title">自定义按钮</div>
          <div class="list">
            <div class="item">
              <el-button type="primary" class="blue">主色</el-button>
              <el-button type="success" class="green">辅色</el-button>
            </div>
            <div class="code">
              &lt;el-button type="primary" class="blue"&gt;主色&lt;/el-button&gt;
              <br />&lt;el-buttontype="success" class="green"&gt;辅色&lt;/el-button&gt;
              <br />
            </div>
          </div>
          <!-- 自定义按钮 -->
          <div class="el-title">icon按钮</div>
          <div class="list">
            <div class="item">
              <el-button type="primary" class="blue-gra" icon="icon his-rsearch">搜索</el-button>
              <el-button type="success" class="green-gra" icon="icon his-import">文件导入</el-button>
            </div>
            <div class="code">
              &lt;el-button type="primary" class="blue-gra" icon="icon his-rsearch"&gt;搜索&lt;/el-button&gt;
              <br />&lt;el-button type="success" class="green-gra" icon="icon his-import"&gt;文件导入&lt;/el-button&gt;
              <br />
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Element-UI Icons">
        <div class="grid">
          <div
            v-for="item of elementIcons"
            :key="item"
            @click="handleClipboard(generateElementIconCode(item),$event)"
          >
            <el-tooltip placement="top">
              <div slot="content">{{ generateElementIconCode(item) }}</div>
              <div class="icon-item">
                <i :class="'el-icon-' + item" />
                <span>{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { handleClipboard } from '@/utils/clipboard'
import elementIcons from './element-icons'
import svgIcons from './svg-icons'

@Component({
  name: 'Icons'
})
export default class extends Vue {
  private svgIcons = svgIcons;
  private elementIcons = elementIcons;
  private handleClipboard = handleClipboard;

  private generateElementIconCode(symbol: string) {
    return `<i class="el-icon-${symbol}" />`
  }

  private generateSvgIconCode(symbol: string) {
    return `<svg-icon name="${symbol}" />`
  }
}
</script>

<style lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;
  .grid {
    position: relative;
    display: flex;
    flex-flow: wrap;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    .el-title {
      padding: 0 20px;
      width: 100%;
    }
    .list {
      display: flex;
      flex-flow: wrap;
      .item {
        margin: 20px;
        display: flex;
        flex-flow: wrap;
        justify-content: center;
        text-align: center;
        .icon-code {
          display: block;
        }
      }
    }
    .code {
      padding: 20px;
      width: 100%;
    }
  }
  .icon-item {
    margin: 0 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }
  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }
  .disabled {
    pointer-events: none;
  }
}
</style>
