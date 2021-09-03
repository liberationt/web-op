<!--
 * @Author: 张文奇
 * @LastEditTime: 2020-04-15 15:11:53
 * @LastEditors: 张文奇
 * @Description:
 * @FilePath: \web-op\src\views\his\dic\hospitalOperation\hospitalOperation.vue
 -->
<template>
  <div>医院手术编码</div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

// 声明接口
declare interface IPageList {
    id: number,
}

// 命名文件名称，过滤器什么的都再这里写
@Component({
    name: '',
    filters: {
    }
})

export default class extends Vue {
    // 声明变量，方法
    private list: any = []

    public setValue(value: string) {
        this.setValue(value)
    }

    public getValue() {
        return null
    }

    // 监听方法
    @Watch('')
    private onValueChange(value: string) {
        console.log('hello world')
    }

    // 初始化的周期函数
    created() {
        console.log('hello world')
    }

    mounted() {
        console.log('hello world')
    }
}
</script>
