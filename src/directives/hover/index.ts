/*
 * @Date: 2020-05-19 18:34:45
 * @LastEditors: zhml
 * @LastEditTime: 2020-05-22 15:59:51
 * @description:
 */

import { DirectiveOptions } from 'vue'

export const hover: DirectiveOptions = {
  update (el, binding) {  
    el.onmouseover = () => { 
      if (typeof binding.value.ms != 'undefined') {
        binding.value.ms()
      }
      if (typeof binding.value.class != 'undefined') {
        el.classList.add(binding.value.class)
      }
    }
    // el.onmouseout = () => { 
    //   if (typeof binding.value.mo != 'undefined') {
    //     binding.value.mo()
    //   }
    //   if (typeof binding.value.class != 'undefined') {
    //     el.classList.remove(binding.value.class)
    //   }
    // }
  },
}
