/*
 * @Author: 张文奇
 * @LastEditTime: 2020-06-04 15:55:07
 * @LastEditors: zhml
 * @Description:
 * @FilePath: \web-op\src\router\modules\sysManage.ts
 */
import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const sysManage: RouteConfig = {
  path: '/manage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'manage',
  meta: {
    title: '菜单管理',
    icon: '',
    alwaysShow: true
  },
  children: [
    {
      path: '/setMenu',
      name: 'setMenu',
      component: () => import('@/views/his/user/setMenu/setMenu1.vue'),
      meta: { title: '设置菜单' }
    },
    {
      path: '/jobAuthority',
      name: 'JobAuthority',
      component: () => import('@/views/his/user/jobAuthority/jobAuthority.vue'),
      meta: { title: '岗位权限设置' }
    },
    {
      path: '/userSetting',
      name: 'UserSetting',
      component: () => import('@/views/his/user/userSetting/userSetting.vue'),
      meta: { title: '用户设置' }
    },
    {
      path: 'postSetting',
      name: 'postSetting',
      component: () => import('@/views/his/user/postSetting/postSetting.vue'),
      meta: { title: '岗位设置' }
    },
    {
      path: 'employeeregistration',
      name: 'employeeregistration',
      component: () =>
        import(
          '@/views/his/user/employeeregistration/employeeregistration.vue'
        ),
      meta: { title: '职工登记' }
    },
    {
      path: 'userAuthoritySet',
      name: 'userAuthoritySet',
      component: () =>
        import(
          '@/views/his/user/userAuthoritySet/index.vue'
        ),
      meta: { title: '用户授权设置' }
    }
  ]
}

export default sysManage
