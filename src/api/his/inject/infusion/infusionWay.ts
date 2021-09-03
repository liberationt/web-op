// 输液给药途径
import axios from '@/utils/request'

// 查询已选
export const aQueryGytjSelectedList = (data: any) => {
  return axios.request({
    url: '/op-service/sygytj/doQueryGytjList',
    method: 'post',
    data
  })
}

// 新增
export const aSaveGytj = (data: any) => {
  return axios.request({
    url: '/op-service/sygytj/doSaveGytj',
    method: 'post',
    data
  })
}

// 删除
export const aDeleteGytj = (data: any) => {
  return axios.request({
    url: '/op-service/sygytj/doDeleteGytj',
    method: 'post',
    data
  })
}
