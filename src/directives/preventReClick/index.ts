import { DirectiveOptions } from 'vue'

export const preventReClick: DirectiveOptions = {
    // 防重复点击(指令实现)
    inserted(el: any, binding: any) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                setTimeout(() => {
                    el.disabled = false
                }, binding.value || 3000)
            }
        })
    }
}
