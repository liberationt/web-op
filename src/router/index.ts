import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

/* Router modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'
import sysManage from './modules/sysManage'
import dicManage from './modules/dicManage'
import { guidanceData } from './modules/guidance' // 门诊导诊
import medinsuinterface from './modules/medinsuinterface'
import { groupData, hospitalData } from './modules/dic' // 新字典管理
Vue.use(Router)

/*
  Note: sub-menu only appear when children.length>=1
  Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
*/

/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
                                 detail see : https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    roles: ['admin', 'editor']   will control the page roles (allow setting multiple roles)
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    alwaysShow: true             if true, will always show the root menu (default is false)
                                 if false, hide the root menu when has less or equal than one children route
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    noCache: true                if true, the page will not be cached (default is false)
    affix: true                  if true, the tag will affix in the tags-view
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
*/

/**
  ConstantRoutes
  a base page that does not have permission requirements
  all roles can be accessed
*/
export const constantRoutes: RouteConfig[] = [
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/LoadingData',
    component: () => import(/* webpackChunkName: "LoadingData" */ '@/views/login/LoadingData.vue'),
    meta: { hidden: true },
  },
  {
    path: '/testcomp',
    component: () => import(/* webpackChunkName: "LoadingData" */ '@/views/testcomp/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/error-page/404.vue'),
    meta: { hidden: true },
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "401" */ '@/views/error-page/401.vue'),
    meta: { hidden: true },
  },
  {
    path: '/changePassword',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/login/changePassword.vue'),
    meta: {
      title: '修改密码',
      icon: 'dashboard',
      hidden: true,
    },
  },
  {
    path: '/',
    component: Layout,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: '/dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: '首页',
          icon: 'dashboard',
          affix: true,
          hidden: true,
        },
      },
    ],
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes: RouteConfig[] = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/directive',
    meta: {
      title: '权限测试页',
      icon: 'lock',
      roles: ['admin', 'editor'], // you can set roles in root nav
      alwaysShow: true, // will always show the root menu
    },
    children: [
      {
        path: 'page',
        component: () => import(/* webpackChunkName: "permission-page" */ '@/views/his/user/permission/page.vue'),
        name: 'PagePermission',
        meta: {
          title: '权限页面',
          roles: ['admin'], // or you can only set roles in sub nav
        },
      },
      {
        path: 'directive',
        component: () => import(/* webpackChunkName: "permission-directive" */ '@/views/his/user/permission/directive.vue'),
        name: 'DirectivePermission',
        meta: {
          title: '指令页面',
          // if do not set roles, means: this page does not require permission
        },
      },
      {
        path: 'role',
        component: () => import(/* webpackChunkName: "permission-role" */ '@/views/his/user/permission/role.vue'),
        name: 'RolePermission',
        meta: {
          title: '角色页面',
          roles: ['admin'],
        },
      },
    ],
  },
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "icons" */ '@/views/icons/index.vue'),
        name: 'Icons',
        meta: {
          title: '图标',
          icon: 'icon',
          noCache: true,
        },
      },
    ],
  },
  {
    path: '/testcomp',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "icons" */ '@/views/testcomp/index.vue'),
        name: 'testcomp',
        meta: {
          title: '组件测试',
          icon: 'zip',
          noCache: true,
        },
      },
    ],
  },
  /** when your routing map is too long, you can split it into small modules **/
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true },
  },
  sysManage,
  dicManage,
  guidanceData, // 门诊导诊
  medinsuinterface,
  groupData, // 字典管理-集团数据端粒
  hospitalData, // 字典管理-医院数据端粒
]

const createRouter = () =>
  new Router({
    mode: 'history', // Disabled due to Github Pages doesn't support this, enable this if you need.
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    },
    base: process.env.BASE_URL, //process.env.BASE_URL,
    routes: constantRoutes,
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  ;(router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
