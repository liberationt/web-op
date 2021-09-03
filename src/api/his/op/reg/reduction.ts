// 减免相关
import axios from '@/utils/request'

// 新增/修改减免政策
export const aSaveFydw = (data: any) => {
  return axios.request({
    url: '/op-service/pubjmlx/doSaveFydw',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 删除减免政策
export const aDeleteFydw = (data: any) => {
  return axios.request({
    url: '/op-service/pubjmlx/doDeleteFydw',
    method: 'post',
    data
  })
}

// 新增/修改减免患者
export const aSaveFybr = (data: any) => {
  return axios.request({
    url: '/op-service/pubjmbr/doSaveFybr',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 删除减免患者
export const aDeleteFybr = (data: any) => {
  return axios.request({
    url: '/op-service/pubjmbr/doDeleteFybr',
    method: 'post',
    data
  })
}
