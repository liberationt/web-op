
import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
import i18n from '@/lang' // Internationalization
import settings from './settings'

NProgress.configure({ showSpinner: false })
//原有的 
// const whiteList = ['/login', '/auth-redirect']
//新增了一个修改密码的东西 因为里面的逻辑不明确 先增加一个解决
const whiteList = ['/login', '/auth-redirect','/changePassword']

const getPageTitle = (key: string) => {
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${settings.title}`
  }
  return `${settings.title}`
}

router.beforeEach(async(to: Route, _: Route, next: any) => {
  // Start progress bar
  NProgress.start()
  // Determine whether the user has logged in
  if (UserModule.login) {
    if (to.path === '/login') {
      // If is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // Check whether the user has obtained his permission roles
      if (UserModule.roles.length === 0) {
        try {
          // Note: roles must be a object array! such as: ['admin'] or ['developer', 'editor']
          await UserModule.GetUserInfo()
          const roles = UserModule.roles
          // Generate accessible routes map based on role
          await PermissionModule.GenerateRoutes(roles)
          await PermissionModule.GetKjMenuRoutes()
          // await PermissionModule.GetDictGroup()
          PermissionModule.getAllMenu()
          // Dynamically add accessible routes
          router.addRoutes(PermissionModule.dynamicRoutes)
          router.addRoutes(PermissionModule.kjDynamicRoutes)
          // Hack: ensure addRoutes is complete
          // Set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (err) {
          // Remove token and redirect to login page
          UserModule.ResetToken()
          Message.error(err || 'Has Error')
          next('/login')
          // next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      } else {
        next()
      }
    }
  } else {
    // Has no token
    if (whiteList.indexOf(to.path) !== -1) {
      // In the free login whitelist, go directly
      next()
    } else {
      // Other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach((to: Route) => {
  // Finish progress bar
  NProgress.done()

  // set page title
  document.title = getPageTitle(to.meta.title)
})
