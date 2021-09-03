/*
 * @Author: wangyao
 * @LastEditTime: 2020-09-09 16:49:51
 * @LastEditors: zhml
 */
import request from '@/utils/request'

// 查询资源排队列表
export const queryList = (data:any) => {
    return request({
        url: '/op-service/opzspdxx/findList',
        data,
        method: 'post'
    })
}


// 查询在线医生
export const queryDoctorList = (data:any) => {
    return request({
        url: '/op-service/opzspdxx/queryLoginDoctor',
        data,
        method: 'post'
    })
}
// 指定在线医生
export const chooseDoctor = (data:any) => {
    return request({
      url: '/op-service/opzspdxx/appointDoctor',
      data,
      method: 'post',
    })
}
// 叫号
export const callDoctor = (data:any) => {
    return request({
      url: '/op-service/opzspdxx/callNumber',
      data,
      method: 'post',
    })
}
// 查询病人档案
export const queryPatient = (data:any) => {
    return request({
      url: '/op-service/opzspdxx/getBrdaByBrid',
      data,
      method: 'post',
    })
}
