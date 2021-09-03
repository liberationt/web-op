/*
 * @Author: 曹俊
 * @LastEditTime: 2020-09-07 10:50:44
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\op\guidance\reception\reception.ts
 */
import axios from '@/utils/request.ts'
// 服务台设置
export interface Iitem {
  zsmc?: number | string
  dz?: number | string
  orderNo?: number | string
  hospitalId: number | null
  jgid?: number
  roomId: number
  sfky?: number | string
}
export interface Iobj {
  zsmc?: string
  hospitalId: number
}
export interface Iobject {
  zsmc: null
  roomName?: string,
  pageNum: number
}
// 服务台列表
export const queryRecept = (data: any) =>
  axios.request({
    url: '/op-service/hspmn/receptandconsultdict/queryRecept',
    method: 'post',
    data,
  })

// 新增服务台
export const addRecept = (data: any) =>
  axios.request({
    url: '/op-service/opfwtxx/add',
    method: 'post',
    data,
  })

// 编辑(停用、启用)服务台 0 可用 1 停用
export const editRecept = (data: any) =>
  axios.request({
    url: '/op-service/opfwtxx/editState',
    method: 'post',
    data,
  })

// 详情
export const receptDetail = (data: any) =>
  axios.request({
    url: '/op-service/opfwtxx/edit',
    method: 'post',
    data
  })

// 查询
export const queryList = (data: any) =>
  axios.request({
    url: '/op-service/hspmn/receptandconsultdict/queryRecept',
    method: 'post',
    data,
  })
// 删除
export const deleteById = (data: any) =>
  axios.request({
    url: '/op-service/opfwtxx/deleteById',
    method: 'post',
    data,
  })

// 服务台新增获取最大排序号
export const getMaxOrderNo = (data: any) =>
  axios.request({
    url: '/op-service/hspmn/receptandconsultdict/getMaxOrderNo',
    method: 'post',
    data,
  })

