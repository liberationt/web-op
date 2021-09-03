
/*
 * @Date: 2020-05-14 13:26:43
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-09 11:13:57
 * @description:  手术信息维护的接口
 */

import request from '@/utils/request'

export interface IOperMainObj {
  fydj: number
  fymc: string
  fyxh: number
  pydm: string
}

export interface IOperDocObj {
  id: number | null
  ssnm:  number
  ssmc:  string
  ksdm:  string
  ysdm:  string
}


/**
 * @LastEditors: zhml
 * @Description: 添加科室手术
 * @param {type} params
 * @return:
 */
export const addOperObj = (data: any) => {
  return request({
    url: '/op-service/optssfl/add',
    method: 'post',
    data,
  })
}
/**
 * @LastEditors: zhml
 * @Description: 删除科室手术
 * @param {type} params
 * @return:
 */
export const deleteOperObj = (data: any) => {
  return request({
    url: '/op-service/optssfl/delete',
    method: 'post',
    data,
  })
}


/**
 * @LastEditors: zhml
 * @Description: 查询个人收藏诊断
 * @param {type} params
 * @return:
 */
 export const queryList = (data:any) => {
   return request({
     url: '/op-service/pubcyzd/findList',
     method: 'post',
     data,
   })
 }
