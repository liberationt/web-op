/*
 * @Date: 2020-04-16 09:36:18
 * @LastEditors: zhml
 * @LastEditTime: 2020-04-16 10:32:15
 * @description:岗位权限设置的相关接口
 */
import axios from '@/utils/request.ts'

/**
 * @LastEditors: zhml
 * @Description: 根据岗位ID取角色
 * @param {type} params
 * @return:
 */
export const getMenuByGroupId = (data: any) =>
  axios.request({
    url: '/system-service/sys/sysgroupmenu/getOneByEntity',
    method: 'post',
    data
  })

export const editUserGroup = (data: any) =>
  axios.request({
    url: '/system-service/sysusergroup/editUserGroup',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
// 权限与用户的批量关联
export const connectUserAuthority = (data: any) =>
  axios.request({
    url: '/system-service/sysusergroup/batchEdit',
    method: 'post',
    data
  })

/**
 * @LastEditors: zhml
 * @Description: 修改权限
 * @param {type} params
 * @return:
 */

export const editMenuGroup = (data: any) =>
  axios.request({
    url: '/system-service/sys/sysgroupmenu/edit',
    method: 'post',
    data
  })

/**
 * @LastEditors: zhml
 * @Description: 按条件分页查询所有岗位
 * @param {type}:  groupName pageNum pageSize
 * @return:
 */
export const querySysgroupList = (data: any) =>
  axios.request({
    url: '/system-service/sys/sysgroup/queryPage',
    method: 'post',
    data
  })

/**
 * @LastEditors: zhml
 * @Description: 获取所有菜单
 * @param {type} params
 * @return:
 */
export const getJobList = (data: any) =>
  axios.request({
    url: '/system-service/sys/sysgroupmenu/findList',
    method: 'post',
    data
  })
