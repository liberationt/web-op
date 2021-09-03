/*
 * @Date: 2020-04-14 15:44:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-09 11:24:28
 * @description:
 */
import request from '@/utils/request'

export interface IMenuList {
  index: string
  menuName: string
  menuName1: string
  menuName2: string
  menuName3: string
  menuName4: string
  menuIcon: string
  menuSort: number | null
  menuUrl: string
  reportId: number | string
  parentMenuId: string
  buttonKey: string
  modelTypeFlag: number | string
}

export const addMenu = (data: any) => {
  return request({
    url: '/system-service/sysmenu/add',
    method: 'post',
    data,
  })
}

export const deleteMenu = (data: any) => {
  return request({
    url: '/system-service/sysmenu/delete',
    method: 'post',
    data,
  })
}

export const editMenu = (data: any) => {
  return request({
    url: '/system-service/sysmenu/edit',
    method: 'post',
    data,
  })
}

export const queryMenuList = (data: any) => {
  return request({
    url: '/system-service/sysmenu/queryPage',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const getOneMenu = (data: any) => {
  return request({
    url: '/system-service/sysmenu/getOneByEntity',
    method: 'post',
    data,
  })
}

export const findMenuList = (data: any) => {
  return request({
    url: '/system-service/sysmenu/findList',
    method: 'post',
    data,
  })
}

export const enableMenu = (data: any) => {
  return request({
    url: '/system-service/sysmenu/upDisplayFlag',
    method: 'post',
    data,
  })
}

//设置快捷菜单
export const addKjMenu = (data: any) => {
  return request({
    url: '/system-service/sysusermenu/add',
    data,
    method: 'post',
  })
}
// 删除快捷键
export const deleteKjMenu = (data: any) => {
  return request({
    url: '/system-service/sysusermenu/delete',
    data,
    method: 'post',
  })
}
// 取排序最大值
export const getMaxSort = (data: any) => {
  return request({
    url: '/system-service/sysmenu/getMaxSort',
    data,
    method: 'post',
  })
}
