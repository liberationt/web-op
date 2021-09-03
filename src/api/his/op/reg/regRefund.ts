// 退费处理
import axios from '@/utils/request'

// 发票查询
export const aQueryMzxxFpxx = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doQueryMzxxFpxx',
    method: 'post',
    data
  })
}

// 退费处理 主表查询 右上信息
export const aQueryTF01 = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doQueryTF01',
    method: 'post',
    data
  })
}

// 退费处理 根据卡号或者发票号码查询退费信息
export const aQueryTFFphm = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doQueryTFFphm',
    method: 'post',
    data,
    // headers: {
    //   'Content-Type': 'application/json'
    // }
  })
}

// 退费结算计算
export const aQueryTFPayment = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doQueryTFPayment',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 退费结算处理
export const aSaveRefundSettle = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doSaveRefundSettle',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
      'Res-Type': 'special'
    }
  })
}
