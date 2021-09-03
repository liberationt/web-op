import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { user, login, group, submit, logout,authority,changeBid,selectBusinessRole,getOneByEntity } from '@/api/users'
import { getToken, setToken, removeToken, getLogin, setLogin, removeLogin } from '@/utils/cookies'
import router, { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'
import store from '@/store'

export interface IUserState {
  token: string,
  login: string,
  name: string,
  avatar: string,
  introduction: string,
  roles: string[],
  email: string,
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = localStorage.getItem('token') || '' //getToken() || ''
  public login = getLogin() || ''
  public name = ''
  public avatar = ''
  public introduction = ''
  public roles: string[] = []
  public email = ''

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email
  }

  @Mutation
  private SET_LOGIN(login: string) {
    this.login = login
    localStorage.setItem('state', '2')
  }

  /**
   * @description: 登录 通过username获取name
   * @param {username}
   * @return:
   */
  @Action
  public async User(params: { username: string | undefined }) {
    let { username } = params
    username = (username as string).trim()
    const { data } = await user({ loginName: username })
    return data
  }

  /**
   * @description: 登录 通过username,password获取机构列表
   * @param {username,password}
   * @return:
   */
  @Action
  public async Login(userInfo: any) {
    let { username, password } = userInfo
    username = username.trim()
    const { data } = await login({ loginName: username, userPwd: password })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    this.SET_TOKEN(data.token)
    return data
  }

  /**
   * @description: 登录 通过username,password获取机构列表
   * @param {username,password}
   * @return:
   */
  @Action
  public async Group(params: { hospitalId: number }) {
    let { hospitalId } = params
    const { data } = await group({ hospitalId: hospitalId })
    return data
  }

  /**
   * @description: 登录 通过username,password获取机构列表
   * @param {username,password}
   * @return:
   */
  @Action
  public async Submit(params: any) {
    const { data } = await submit(params)
    setLogin(data.loginName)
    this.SET_LOGIN(data.loginName)
    return data
  }

   /**
   * @description:  通过groupId获取业务列表
   * @param {groupId}
   * @return:data
   */
  @Action
  public async getAuthority(params: { groupId: number }) {
    let { groupId } = params
    const { data } = await authority({ groupId: groupId })
    return data
  }

   /**
   * @description:  通过groupId获取默认选中的
   * @param {groupId}
   * @return:data
   */
  @Action
  public async getSelectJobRole(params: { groupId: number }) {
    let { groupId } = params
    const { data } = await selectBusinessRole({ groupId: groupId })
    return data
  }

  /**
   * @description: 切换业务，上传querid,showname,groupId至服务器
   * @param {querid,showname，groupId} 
   * @return: 
   */
  @Action
  public async changeBid(params: { queryid: number, showname:string, groupId:number}) {
    let { queryid,showname,groupId} = params
    const { data } = await changeBid({ ksdm: queryid,qxmg:showname,groupId:groupId})
    return data
  }

  /**
   * @description:  通过queryid获取反查代码
   * @param {queryid}
   * @return:data
   */
  @Action
  public async getOneByEntity(params: { queryid: number }) {
    let { queryid } = params
    const { data } = await getOneByEntity({ ksdm: queryid })
    return data
  }

  @Action
  public ResetToken() {
    removeToken()
    removeLogin()
    this.SET_TOKEN('')
    this.SET_ROLES([])
    this.SET_LOGIN('')
  }

  @Action
  public async GetUserInfo() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    // const { data } = await getUserInfo({ /* Your params here */ })
    const data = {
      id: 0,
      username: 'admin',
      password: 'any',
      name: 'Super Admin',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      introduction: 'I am a super administrator',
      email: '',
      phone: '',
      roles: ['admin']
    }
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    const { roles, name, avatar, introduction, email } = data
    // roles must be a non-empty array
    if (!roles || roles.length <= 0) {
      throw Error('GetUserInfo: roles must be a non-null array!')
    }
    this.SET_ROLES(roles)
    this.SET_NAME(name)
    this.SET_AVATAR(avatar)
    this.SET_INTRODUCTION(introduction)
    this.SET_EMAIL(email)
  }

  @Action
  public async ChangeRoles(role: string) {
    // Dynamically modify permissions
    const token = role + '-token'
    this.SET_TOKEN(token)
    setToken(token)
    await this.GetUserInfo()
    resetRouter()
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(this.roles)
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes)
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    await logout()
    removeToken()
    removeLogin()
    this.ResetToken()
    resetRouter()

    // Reset visited views and cached views
    TagsViewModule.delAllViews()
    this.SET_TOKEN('')
    this.SET_ROLES([])
    this.SET_LOGIN('')
  }
}

export const UserModule = getModule(User)
