/*
 * @Date: 2020-06-03 21:05:48
 * @LastEditTime: 2020-07-07 15:28:27
 * @Description:
 * @FilePath: \web-op\src\main.ts
 */
import Vue, { DirectiveOptions } from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'

import '@/styles/element-variables.scss'
import '@/styles/index.scss'
import '@/icons/iconfont.css'
// 引入思源字体
import '@/assets/fonts/styles.css'
// 引入dayjs 时间处理库
import dayjs from "dayjs"

import App from '@/App.vue'
import store from '@/store'
import { AppModule } from '@/store/modules/app'
import router from '@/router'
import i18n from '@/lang'
import '@/icons/components'
import '@/permission'
import '@/utils/error-log'
import '@/pwa/register-service-worker'
import * as directives from '@/directives'
import * as filters from '@/filters'
import WebSql from '@/websql/index.ts'
//引入全局权限
import Authority from '@/layout/components/Navbar/authority.ts'

// 注册全局业务组件
import '@/components/global-components'

import "@/core/public-path";
import { lifeCycle, render } from "@/core/life-cycle";

// 私有组件库
import hisLib from 'his-library'
Vue.use(hisLib)

Vue.prototype.AUTHORITY = Authority

Vue.prototype.$getLodop = null
Vue.prototype.$store = null
Vue.use(WebSql)
Vue.use(ElementUI, {
  size: AppModule.size, // Set element-ui default size
  i18n: (key: string, value: string) => i18n.t(key, value)
})

Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

// Register global directives
Object.keys(directives).forEach(key => {
  Vue.directive(key, (directives as { [key: string ]: DirectiveOptions })[key])
})

// Register global filter functions
Object.keys(filters).forEach(key => {
  Vue.filter(key, (filters as { [key: string ]: Function })[key])
})

Vue.config.productionTip = false;

/**
 * @name 导出微应用生命周期
 */
const { bootstrap, mount, unmount } = lifeCycle();
export { bootstrap, mount, unmount };

/**
 * @name 单独环境直接实例化vue
 */
const __qiankun__ = window.__POWERED_BY_QIANKUN__;
Vue.prototype.$qiankun = __qiankun__

if (!__qiankun__) {
  window.ele = new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App)
  }).$mount('#app')

} else {
  __qiankun__ || render();
}
