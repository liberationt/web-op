// 收费汇总
import axios from '@/utils/request'

// 收费汇总产生前验证
export const aChargesSummaryBefVerification = (data: any) => {
  return axios.request({
    url: '/op-service/ghrbReport/doChargesSummaryBefVerification',
    method: 'post',
    data
  })
}

// 收费汇总报表产生
export const aChargesFsbSummaryCs = (data: any) => {
  return axios.request({
    url: '/op-service/ghrbReport/chargesFsbSummaryCs',
    method: 'post',
    data
  })
}

// 收费汇总-汇总前验证
export const aChargesSummaryCheckOutBefVerification = (data: any) => {
  return axios.request({
    url: '/op-service/ghrbReport/doChargesSummaryCheckOutBefVerification',
    method: 'post',
    data
  })
}

// 收费汇总-取消汇总查询
export const aQueryCancelHzCommit = (data: any) => {
  return axios.request({
    url: '/op-service/ghrbReport/doQueryCancelHzCommit',
    method: 'post',
    data
  })
}

// 收费汇总-取消汇总
export const aCancelCommit = (data: any) => {
  return axios.request({
    url: '/op-service/ghrbReport/cancelCommit',
    method: 'post',
    data
  })
}

// 收费汇总-时间
export const getNow = (data:any) => {
  return axios.request({
    url: '/op-service/ghrbReport/doGetLastHzJzrq',
    method: 'post',
    data,
    
  })
}
//收费汇总--产生校验
export const getCreatSummary = (data:any) => {
  return axios.request({
    url: '/op-service/ghrbReport/doQueryHzVerification',
    method: 'post',
    data,
   
  })
}
//收费汇总--汇总产生
export const doSaveSfrbhz = (data:any) => {
  return axios.request({
    url: '/op-service/ghrbReport/doSaveSfrbhz',
    method: 'post',
    data,
   
  })
}
//收费汇总--取消汇总
export const doCancelSfhzrb = (data:any) => {
  return axios.request({
    url: '/op-service/ghrbReport/doCancelSfhzrb',
    method: 'post',
    data
  })
}
//收费汇总--查询列表接口
export const doQueSfhzrbList = (data:any) => {
  return axios.request({
    url: '/op-service/ghrbReport/doQueSfhzrbList',
    method: 'post',
    data
  })
}

