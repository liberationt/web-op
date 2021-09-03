/*
 * @Date: 2020-06-17 13:26:41
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-17 13:27:16
 * @description:
 */


 import request from '@/utils/request'

 export const queryList = (data: any) => {
   return request({
     url: '/op-service/opyygh/loadAppointedInfo',
     method: 'post',
     data,
   })
 }
 export interface Iitem{
  brxm:string |null,
  dateFrom:string|null,
  dateTo:string|null,
  jzkh:string|null,
  kslb:number|null,
  sfzh:string|null,
  yyys:string|null,
  zblx:string|null
}

// 加载预约信息列表
export const queryInfo = (data: any) => {
  return request({
    url: '/op-service/yygl/loadAppointedInfo',
    method: 'post',
    data,
  })
}

// 判断是否能更改预约信息
export const aCheckModify = (data: any) => {
  return request({
    url: '/op-service/yygl/checkCanModifyAppointment',
    method: 'post',
    data,
  })
}

// 预约更改
export const aModifyAppointment = (data: any) => {
  return request({
    url: '/op-service/yygl/modifyAppointedInfo',
    method: 'post',
    data,
  })
}

// 删除预约
export const deleteById = (data: any) => {
  return request({
    url: '/op-service/yygl/deleteYygl',
    method: 'post',
    data,
  })
}

// 排班科室查询
export const aYyglQuery = (data: any) => {
  return request({
      url: '/op-service/yygl/yyglQuery',
      method: 'post',
      data,
  })
}

