import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import { asyncRoutes, constantRoutes } from '@/router'
import { getMenuInfo, getKjMenuInfo, getAllMenu, getSysGroupHome } from '@/api/users'
import { queryDictGroup } from '@/api/his/dic/hospitalDataDict'
import store from '@/store'
/* Layout */
import Layout from '@/layout/index.vue'
import Empty from '@/layout/empty.vue'
import { AppModule } from '@/store/modules/app'
import { langList } from '@/utils/dic.ts'

const hasPermission = (roles: string[], route: RouteConfig) => {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}

var language: string // 当前语言
var curMenuName: string // 当前菜单名称字段名
var curMenuPath: string = "" // 当前第一个菜单名

export const filterAsyncRoutes = (routes: any[], roles: string[]) => {
  return routes.filter((route) => {
    // Layout组件特殊处理
    route.path = '/' + route.routeName
    if (route.parentMenuId != 0 && route.modelTypeFlag == '1' && curMenuPath == "") {
      curMenuPath = route.routeName
    }
    if (route.modelTypeFlag === '2') {
      route.name = '@' + route.menuUrl
    } else {
      route.name = route.routeName
    }
    route.meta = {
      title: route[curMenuName],
      icon: route.menuIcon,
      noCache: false
    }
    if (route.modelTypeFlag === '4') {
      route.meta.hidden = true
    }
    if (route.parentMenuId === 0) {
      route.component = Layout
    } else if (
      route.childMenuList != null &&
      route.childMenuList &&
      route.childMenuList.length
    ) {
      route.component = Empty
    } else {
      if (route.modelTypeFlag != '2') {
        route.component = loadView(route.menuUrl)
      }
    }
    if (
      route.childMenuList != null &&
      route.childMenuList &&
      route.childMenuList.length
    ) {
      route.children = filterAsyncRoutes(route.childMenuList, [])
    }
    delItem(route)
    return true
  })
  // const res: RouteConfig[] = []
  // routes.forEach(route => {
  //   const r = { ...route }
  //   if (hasPermission(roles, r)) {
  //     if (r.children) {
  //       r.children = filterAsyncRoutes(r.children, roles)
  //     }
  //     res.push(r)
  //   }
  // })
  // return res
}

// 快捷菜单遍历后台传来的路由字符串，转换为组件对象
export const kjFilterAsyncRoutes = (routes: any[], roles: string[]) => {
  return routes.filter((route) => {
    // Layout组件特殊处理
    route.path = '/' + route.routeName
    route.name = route.routeName
    route.meta = {
      title: route.menuName,
      icon: route.menuIcon,
      noCache: false
    }
    route.component = Layout
    route.children = [
      {
        path: '/' + route.routeName,
        name: route.routeName,
        meta: {
          title: route.menuName,
          icon: route.menuIcon,
        },
        component: loadView(route.menuUrl),
      },
    ]
    delItem(route)
    return true
  })
}

//过滤动态国标字典
export const filterAsyncDicRoutes = (routes: any[], roles: string[]) => {
  return routes.filter((route) => {
    // Layout组件特殊处理
    route.path = '/publicPag/' + route.id
    route.meta = {
      title: route.name,
    }
    route.props = {
      groupId: route.id,
    }
    if (route.parentMenuId === 0) {
      route.component = Layout
    } else {
      route.component = dicLoadView(route.menuUrl)
    }
    if (
      route.childMenuList != null &&
      route.childMenuList &&
      route.childMenuList.length
    ) {
      route.children = filterAsyncDicRoutes(route.childMenuList, [])
    }
    // delItem(route)
    return true
  })
}

export interface IPermissionState {
  routes: RouteConfig[]
  kjRoutes: RouteConfig[]
  dynamicRoutes: RouteConfig[]
  kjDynamicRoutes: RouteConfig[]
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
  public routes: RouteConfig[] = []
  public kjRoutes: RouteConfig[] = []
  public dynamicRoutes: RouteConfig[] = []
  public kjDynamicRoutes: RouteConfig[] = []
  public curMenuPath: string = ''
  public pageHomeRoutes: string = ''

  @Mutation
  private SET_ROUTES(routes: RouteConfig[]) {
    this.routes = constantRoutes.concat(routes)
    this.dynamicRoutes = routes
  }

  @Mutation
  private SET_KLROUTES(routes: RouteConfig[]) {
    this.kjRoutes = constantRoutes.concat(routes)
    this.kjDynamicRoutes = routes
  }

  @Mutation
  private SET_CURMENUPATH() {
    this.curMenuPath = curMenuPath
  }

  @Mutation
  private SET_PAGEHOMEROUTES(page: string) {
    this.pageHomeRoutes = page
  }

  @Action
  public async GenerateRoutes(roles: string[]) {
    language = AppModule.language
    for (let i of langList) {
      if (i.value == language) {
        curMenuName = i.menuName
      }
    }
    //向后端请求路由数据
    const res = await getMenuInfo()
    if (res) {
      const accessedRoutes = filterAsyncRoutes(res.data, roles)
      // console.log('------------------------', accessedRoutes)
      this.SET_ROUTES(accessedRoutes)
      this.SET_CURMENUPATH()
    }

    // let accessedRoutes
    // if (roles.includes('admin')) {
    //   accessedRoutes = asyncRoutes
    // } else {
    //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    // }
    // this.SET_ROUTES(accessedRoutes)
  }

  @Action
  public async GetRoutesName(groupId: number) {
    const res =await getSysGroupHome({ groupId })
    if (res.data) {
      console.log(res.data.homepageUrl)
      this.SET_PAGEHOMEROUTES(res.data.homepageUrl)
    }

  }

  //获取按钮权限
  @Action
  public getAllMenu() {
    getAllMenu().then((res: any) => {
      if (res.data) {
        localStorage.setItem('BtnAuthList', JSON.stringify(res.data))
      }
    })
  }

  // 生成快捷路由
  @Action
  public async GetKjMenuRoutes() {
    // 向后端请求路由数据
    const res = await getKjMenuInfo()
    if (res) {
      const accessedRoutes = kjFilterAsyncRoutes(res.data, [])
      this.SET_KLROUTES(accessedRoutes)
    }
  }

  // 获取动态字典路由
  @Action
  public async GetDictGroup() {
    // 向后端请求路由数据
    const res = await queryDictGroup({})
    if (res) {
      let dicData = [
        {
          id: 0,
          parentMenuId: 0,
          name: '字典管理',
          childMenuList: res.data,
        },
      ]
      const accessedRoutes = filterAsyncDicRoutes(dicData, [])
      this.SET_ROUTES(accessedRoutes)
    }
  }
}

export const loadView = (view: string) => {
  // 路由懒加载
  return (resolve: any) => require([`@/views/${view}`], resolve)
  // return () =>
  //   import(/* webpackChunkName: "view-[request]" */ `@/views/${view}`)
}

export const dicLoadView = (view: string) => {
  // 路由懒加载
  return () =>
    import(
      /* webpackChunkName: "view-[request]" */ '@/views/his/dic/hospitalDataDict/components/publicPag.vue'
    )
}

function delItem(item: any) {
  delete item.modelId
  delete item.sysType
  delete item.sortType
  delete item.dataVersion
  delete item.gmtCreate
  delete item.gmtModify
  delete item.hospitalId
  delete item.menuCode
  delete item.menuName
  delete item.parentMenuId
  delete item.basicMenuFlag
  delete item.menuSort
  delete item.menuIcon
  delete item.displayFlag
  delete item.pyCode
  delete item.wbCode
  delete item.menuLevel
  delete item.menuStyle
  delete item.actionType
  delete item.routeName
  delete item.reportId
  delete item.childMenuList
  delete item.countSon
  delete item.fatherRouteName
}

export const PermissionModule = getModule(Permission)
