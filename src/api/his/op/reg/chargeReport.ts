/*
 * @Author: your name
 * @Date: 2021-03-29 10:31:11
 * @LastEditTime: 2021-04-16 16:02:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web-op\src\api\his\op\reg\chargeReport.ts
 */
// 收费日报
import axios from '@/utils/request'

// 查询最后一次汇总时间(旧接口)
export const aGetLastHzrq = (data: any) => {
  return axios.request({
    url: '/op-service/ghrbReport/doGetLastHzrq',
    method: 'post',
    data
  })
}

// 查询最后一次汇总时间(新接口)
export const doGetLastJzrq = (data: any) => {
  return axios.request({
    url: '/op-service/ghrbReport/doGetLastJzrq',
    method: 'post',
    data
  })
}

// 收费日报产生、结账、查询确认(旧接口)
export const aCreateSfrb = (data: any) => {
  return axios.request({
    url: '/op-service/ghrbReport/doCreateSfrb',
    method: 'post',
    data,
    // headers:{
    // 	"Content-Type": "application/json"
    // }
  })
}

// 收费日报结账(新接口)
export const doSaveSfrb = (data: any) => {
  return axios.request({
    url: '/op-service/ghrbReport/doSaveSfrb',
    method: 'post',
    data
  })
}

// 收费日报结账前校验
export const aQueryVerification = (data: any) => {
  return axios.request({
    url: '/op-service/ghrbReport/doQueryVerification',
    method: 'post',
    data
  })
}

// 取消结账查询
export const aQueryCancelCommit = () => {
  return axios.request({
    url: '/op-service/ghrbReport/doQueryCancelCommit',
    method: 'post',
  })
}

// 取消结账(旧接口)
export const aCancelCommit = (data: any) => {
  return axios.request({
    url: '/op-service/ghrbReport/doCancelCommit',
    method: 'post',
    data
  })
}

// 收费日报取消结账(新接口)
export const doCancelSfrb = (data: any) => {
  return axios.request({
    url: '/op-service/ghrbReport/doCancelSfrb',
    method: 'post',
    data
  })
}

// 查询收费日报(旧接口,已停用)
export const aQuerySQL = (data: any) => {
  return axios.request({
    url: '/op-service/ghrbReport/doQuerySQL',
    method: 'post',
    data
  })
}

// 查询收费日报列表(新接口)
export const doQueSfrbList = (data: any) => {
  return axios.request({
    url: '/op-service/ghrbReport/doQueSfrbList',
    method: 'post',
    data
  })
}