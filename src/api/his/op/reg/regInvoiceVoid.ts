// 发票作废
import axios from '@/utils/request'

// 发票查询
export const aQueryFphm = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doQueryFphm',
    method: 'post',
    data
  })
}

// 发票作废
export const aUpdateVoidInvoice = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doUpdateVoidInvoice',
    method: 'post',
    data,
    headers: {
      'Res-Type': 'special'
    }
  })
}

// 已作废列表
export const aQueryVoidInvoice = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doQueryVoidInvoice',
    method: 'post',
    data
  })
}

// 取消作废
export const aUpdateCanceledVoidInvoice = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doUpdateCanceledVoidInvoice',
    method: 'post',
    data
  })
}

