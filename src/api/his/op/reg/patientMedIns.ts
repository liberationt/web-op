// 患者医保登记
import axios from '@/utils/request'

// 登记查询
export const aQuery = (data: any) => {
  return axios.request({
    url: '/im-service/imhzry/sj31',
    method: 'post',
    data,
    headers:{
			'Res-Type': 'special'
		}
  })
}

// 撤销登记
export const aCancel = (data: any) => {
  return axios.request({
    url: '/im-service/imhzry/sj21',
    method: 'post',
    data
  })
}

// 重新登记
export const aAgainReg = (data: any) => {
  return axios.request({
    url: '/im-service/imhzry/resj11',
    method: 'post',
    data
  })
}

// 打印回执单
export const aPrint = (data: any) => {
  return axios.request({
    url: '/im-service/imhzry/printsj11',
    method: 'post',
    data
  })
}
