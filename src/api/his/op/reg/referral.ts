/*
 * @Author: your name
 * @Date: 2021-03-29 10:31:11
 * @LastEditTime: 2021-04-07 17:27:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web-op\src\api\his\op\reg\referral.ts
 */
// 转诊处理
import axios from '@/utils/request'

// 门诊转入医院更新
export const aUpdate = () => {
  return axios.request({
    url: '/ybapi-service/shybMzzy/sjh1',
    method: 'post',
  })
}

// 刷卡查询
export const aSwipeCard = (data: any) => {
  return axios.request({
    url: '/ybapi-service/shybMzzy/queryPage',
    method: 'post',
    data
  })
}

// 读卡查询
export const aReadCard = () => {
  return axios.request({
    url: '/ybapi-service/shybMzzy/queryPagebyRead',
    method: 'post',
  })
}

// 转院
export const aReferral = (data: any) => {
  return axios.request({
    url: '/ybapi-service/shybMzzy/sjf1',
    method: 'post',
    data,
  })
}

// 撤销转院
export const aCancel = (data: any) => {
  return axios.request({
    url: '/ybapi-service/shybMzzy/sjc1',
    method: 'post',
    data,
  })
}