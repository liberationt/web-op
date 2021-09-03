// 医保签约查询
import axios from '@/utils/request'

// 病人医保刷卡
export const aSwipeCard = (data: any) => {
  return axios.request({
    url: '/op-service/balanceAccounts/queryPatientMedicareAccountInfo',
    method: 'post',
    data
  })
}

// 病人医保读卡
export const aReadCard = () => {
  return axios.request({
    url: '/op-service/balanceAccounts/readPatientMedicareAccountInfo',
    method: 'post'
  })
}
