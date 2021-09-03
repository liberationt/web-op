/*
 * @Author: 曹俊
 * @LastEditTime: 2021-02-24 15:07:30
 * @LastEditors: Please set LastEditors
 * @Description:
 * @FilePath: \web-op\src\api\users.ts
 */
import request from '@/utils/request'
export interface Iobj {
  username?: string;
  name?: string;
  password?: string;
  hospitalId?: number | null;
  groupId?: number | null;
  isRemember?: boolean | null
  userId?: number | null
}

export const getUsers = (params: any) =>
  request({
    url: '/users',
    method: 'get',
    params
  })

export const getUserInfo = (data: any) =>
  request({
    url: '/users/info',
    method: 'post',
    data
  })

export const getUserByName = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'get'
  })

export const updateUser = (username: string, data: any) =>
  request({
    url: `/users/${username}`,
    method: 'put',
    data
  })

export const deleteUser = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'delete'
  })

/**
 * @description: 获取用户姓名
 * @param {data}
 * @return:
 */
export const user = (data: any) =>
  request({
    url: '/system-service/ex/loginGetUser',
    method: 'post',
    data
  })

/**
 * @description: 获取机构列表
 * @param {data}
 * @return:
 */
export const login = (data: any) =>
  request({
    url: '/system-service/ex/login',
    method: 'post',
    data
  })

/**
 * @description: 获取身份列表
 * @param {data}
 * @return:
 */
export const group = (data: any) =>
  request({
    url: '/system-service/sysusergroup/loginGroup',
    method: 'post',
    data
  })
/**
 * @description: 获取权限列表
 * @param {groupid}
 * @return: data
 */
export const authority = (data: any) =>
  request({
    url: '/system-service/dicywlb/getAuthority',
    method: 'post',
    data
  })

/**
    * @description: 获取选中的业务权限
    * @param {groupid}
    * @return: data
    */
export const selectBusinessRole = (data: any) =>
  request({
    url: '/system-service/dicywlb/getmorenAuthority',
    method: 'post',
    data
  })

/**
 * @description: 切换业务权限
 * @param {querid,showname,groupId}
 * @return: data
 */
export const changeBid = (data: any) =>
  request({
    url: '/system-service/sysuser/changeBid',
    method: 'post',
    data
  })

/**
  * @description: 获取选中的业务权限
  * @param {groupid}
  * @return: data
  */
export const getOneByEntity = (data: any) =>
  request({
    url: '/op-service/opghks/getOneByEntity',
    method: 'post',
    data
  })
/**
 * @description: 登录
 * @param {data}
 * @return:
 */
export const submit = (data: any) =>
  request({
    url: '/system-service/sysuser/submitUser',
    method: 'post',
    data
  })
/**
 * @description: 登出
 * @param {data}
 * @return:
 */
export const logout = () =>
  request({
    url: '/system-service/ex/loginOut',
    method: 'post'
  })

export const register = (data: any) =>
  request({
    url: '/users/register',
    method: 'post',
    data
  })

//获取左侧菜单
export const getMenuInfo = () =>
  request({
    url: '/system-service/sysmenu/getMenuListByGId',
    method: 'post'
  })

//获取左侧菜单
export const getKjMenuInfo = () =>
  request({
    url: '/system-service/sysusermenu/findList',
    method: 'post'
  })

//获取可见按钮列表
//获取左侧菜单
export const getAllMenu = () =>
  request({
    url: '/system-service/sysmenu/getAllMenu',
    method: 'post'
  })

// 获取首页地址
export const getSysGroupHome = (data: any) =>
  request({
    url: '/system-service/sys/sysgroup/getOneByEntity',
    method: 'post',
    data
  })

// 获取首页地址
export const getEasemobUser = (data: any) =>
  request({
    url: '/op-service/mpeasemobuser/getEasemobUser',
    method: 'post',
    data
  })

// 获取登录二维码
  export const getTwoCode = (data: any) =>
  request({
    url: '/op-service/qrcode/login/create',
    method: 'get',
    data
  })

// 获取登录二维码
export const getCfTwoCode = (data: any) =>
request({
  url: '/op-service/qrcode/sign/create',
  method: 'post',
  data,
  headers: {
    'Content-Type': 'application/json'
  }
})

 // 监听接口
 export const watchCode = (data: any) =>
  request({
    url: '/op-service/qrcode/getCallBackStatus',
    method: 'post',
    data
  })

 //判断是否需要修改密码
 export const checkLogin = () =>
  request({
    url: '/system-service/ex/checkChangePwdTime',
    method: 'post',
  })
  // 是否重置密码
export const isResetPassword = (data: any) =>
request({
  url: '/system-service/ex/checkChangePwdTime',
  method: 'post',
  data
})