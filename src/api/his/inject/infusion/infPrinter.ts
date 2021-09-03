// 输液打印机设置
import axios from '@/utils/request'

// 输液瓶贴打印机列表
export const aQuerySyptdyj = (data: any) => {
  return axios.request({
    url: '/op-service/sydyj/doQuerySyptdyj',
    method: 'post',
    data
  })
}

// 输液巡回单打印机列表
export const aQuerySyxhddyj = (data: any) => {
  return axios.request({
    url: '/op-service/sydyj/doQuerySyxhddyj',
    method: 'post',
    data
  })
}

// 打印机保存
export const aSaveSydyj = (data: any) => {
  return axios.request({
    url: '/op-service/sydyj/doSaveSydyj',
    method: 'post',
    data,
    headers:{
			"Content-Type": "application/json"
		}
  })
}
