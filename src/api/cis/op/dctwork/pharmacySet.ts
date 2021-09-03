/*
 * @Date: 2020-05-31 16:19:57
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-01 09:21:22
 * @description:  发药药房设置的接口
 */


 import request from '@/utils/request'

 // 声明接口
export interface IformInline {
  xy: string
  zy: string
  cy: string
  pkey: string
}



 // 发药药房维护
export const save = (data: any) => {
  return request({
    url: '/op-service/sysxtcs/save',
    method: 'post',
    data,
  })
}

export const queryYfsb = (data:any) => {
  return request({
    url: '/op-service/sysxtcs/load',
    method: 'post',
    data,
  })
}
