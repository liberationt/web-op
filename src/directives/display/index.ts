/*
 * @Date: 2020-04-24 11:38:24
 * @LastEditTime: 2020-07-01 19:46:41
 * @Description: 按钮权限
 * @FilePath: \web-op\src\directives\display\index.ts
 */
import { DirectiveOptions } from 'vue'

export const btnDisabled:DirectiveOptions ={
    bind(el, binding) {
    let key = binding.value
    let btnMenu = JSON.parse(localStorage.getItem('BtnAuthList') as string)
    if (btnMenu.indexOf(key) <= -1) {
      //添加dom元素
      el.classList.add("is-disabled");
      el.setAttribute('disabled','disabled');
    }
  },
}
export const btnDisplay:DirectiveOptions ={
  bind(el, binding) {
  let key = binding.value
  let btnMenu = JSON.parse(localStorage.getItem('BtnAuthList') as string)
  if (btnMenu.indexOf(key) <= -1) {
    //
    el.style.display="none";
  }
},
}