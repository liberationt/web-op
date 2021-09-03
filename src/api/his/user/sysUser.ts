/*
 * @Date: 2020-04-16 13:30:47
 * @LastEditors: zhml
 * @LastEditTime: 2020-04-21 10:10:10
 * @description:
 */
import request from '@/utils/request'

/**
 * @LastEditors: zhml
 * @Description: 查询所有员工
 * @param {type} params
 * @return:
 */
export const queryUserList = (data: any) => {
  return request({
    url: '/system-service/sysuser/queryPage',
    method: 'post',
    data,
  })
}
/**
 * @LastEditors: zhml
 * @Description: 重置密码
 * @param {type} params
 * @return:
 */
export const resetPassword = (data: any) => {
  return request({
    url: '/system-service/sysuser/resetPassWord',
    method: 'post',
    data,
  })
}
/**
 * @LastEditors: zhml
 * @Description: 锁定用户  禁止登录
 * @param {type} params
 * @return:
 */
export const lockUserAccount = (data: any) => {
  return request({
    url: '/system-service/sysuser/lockUser',
    method: 'post',
    data,
  })
}

/**
 * @LastEditors: zhml
 * @Description: 解锁账户
 * @param {type} params
 * @return:
 */
export const unLockUserAccount = (data: any) => {
  return request({
    url: '/system-service/sysuser/unlockUser',
    method: 'post',
    data,
  })
}
export const querySysgroupList = (data: any) => {
  return request({
    url: '/system-service/sys/sysgroup/queryPage',
    method: 'post',
    data,
  })
}
// all user
export const findUserList = (data: any) => {
  return request({
    url: '/system-service/sysuser/findList',
    method: 'post',
    data,
  })
}

// ？
export const batchEdit = (data: any) => {
  return request({
    url: '/system-service/sysusergroup/batchEdit',
    method: 'post',
    data,
  })
}

// 用户设置-新增
export const addUser = (data: any) => {
  return request({
    url: '/system-service/sysuser/add',
    method: 'post',
    data,
  })
}

// 取未设置登录账号名单
export const unSetUserList = (data: any) => {
  return request({
    // url: '/op-service/ehrservicepersonal/getNologinInfo',
    url: '/system-service/hrpersonnel/getNologinInfo', // 新
    method: 'post',
    data,
  })
}

// 授权用户分页
export const findUserPage = (data: any) => {
  return request({
    url: '/system-service/sysuser/haveListByGroupIdPage',
    method: 'post',
    data,
  })
}

// 未授权用户分页
export const findUnUserPage = (data: any) => {
  return request({
    url: '/system-service/sysuser/noListByGroupIdPage',
    method: 'post',
    data,
  })
}

// 新增权限
export const addAuthority = (data: any) => {
  return request({
    url: '/system-service/sysusergroup/add',
    method: 'post',
    data,
  })
}
// 用户删除权限
export const deleteAuthority = (data: any) => {
  return request({
    url: '/system-service/sysusergroup/delete',
    method: 'post',
    data,
  })
}
// 修改密码
export const updataPassWord = (data: any) => {
  return request({
    url: '/system-service/sysuser/updataPassWord',
    method: 'post',
    data,
  })
}
