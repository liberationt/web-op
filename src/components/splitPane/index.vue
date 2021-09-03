<template>
    <div class="split-pane-wrapper" ref="outer">
        <div class="pane pane-left" :style="{ width: leftOffsetPercent, paddingRight: `${this.triggerWidth / 2}px` }">
            <slot name="left"></slot>
        </div>
        <div class="pane-trigger-con" @mousedown="handleMousedown" :style="{ left: triggerLeft, width: `${triggerWidth}px`,marginLeft:`${this.triggerWidth / 2}px` }"></div>
        <div class="pane pane-right" :style="{ left: leftOffsetPercent, paddingLeft: `${this.triggerWidth / 2}px`,marginLeft:`${this.triggerWidth}px` }">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    props: {
        value: { //右div的left比例||左div的宽度比例
            type: Number,
            default: 0.5
        },
        triggerWidth: { //风格线的宽度
            type: Number,
            default: 8
        },
        min: { //左边div的最小宽度
            type: Number,
            default: 0.1
        },
        max: { //左边div的最大宽度
            type: Number,
            default: 0.9
        }
    },
    data () {
        return {
            offset: 0.8
        }
    },
    computed: {
        leftOffsetPercent () { //左边div的宽度
            return `${this.value * 100}%`
        },
        triggerLeft () { //分割线的left值为左边div的宽度减去自己宽度的一半，即分割线叠在左右div上
            return `calc(${this.value * 100}% - ${this.triggerWidth / 2}px)`
        }
    },
    methods: {
        handleMousedown (event) {
            //为document绑定事件，因为当鼠标位于组件外时，也要可以移动，所以事件应该是绑定在document上
            document.addEventListener('mousemove', this.handleMousemove)
            //鼠标放开时停止滚动
            document.addEventListener('mouseup', this.handleMouseup)
            this.initOffset = event.pageX - event.srcElement.getBoundingClientRect().left
            this.canMove = true
        },
        handleMousemove (event) {
            if (!this.canMove) return
            const outerRect = this.$refs.outer.getBoundingClientRect()
            let offsetPercent = (event.pageX - this.initOffset + this.triggerWidth / 2 - outerRect.left) / outerRect.width
            if (offsetPercent < this.min) offsetPercent = this.min
            if (offsetPercent > this.max) offsetPercent = this.max
            this.$emit('input', offsetPercent)
        },
        handleMouseup () {
            this.canMove = false
        }
    }
}
</script>


<style lang="scss">
.split-pane-wrapper{
    height: 100%;
    width: 100%;
    position: relative;
    // background:rgb(245, 246, 248);
    .pane{
        position: absolute;
        top: 0;
        height: 100%;
        border-radius: 5px;
        &-left{
            // width: 30%;
            background: palevioletred;
        }
        &-right{
            right: 0;
            bottom: 0;
            background: paleturquoise;
        }
        &-trigger-con{
            height: 100%;
            // background: rgb(245, 246, 248);
            position: absolute;
            top: 0;
            z-index: 10;
            user-select: none;
            cursor: col-resize;
        }
    }
}
</style>