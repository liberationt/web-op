// 诊室信息维护
import axios from '@/utils/request'

// 新增
export const aAddNumber = (data: any) => {
  return axios.request({
    url: '/op-service/opygpj/add',
    method: 'post',
    data,
    headers:{
			"Content-Type": "application/json"
		}
  })
}

// 修改
export const aEditNumber = (data: any) => {
  return axios.request({
    url: '/op-service/opygpj/edit',
    method: 'post',
    data,
    headers:{
			"Content-Type": "application/json"
		}
  })
}

// 删除
export const aDelNumber = (data: any) => {
  return axios.request({
    url: '/op-service/opygpj/delete',
    method: 'post',
    data
  })
}
// 更新
export const toUpDateNumber = (data: any) => {
  return axios.request({
    url: '/op-service/opygpj/updateStatus',
    method: 'post',
    data
  })
}
// 截取
export const toInterceptNumber = (data: any) => {
  return axios.request({
    url: '/op-service/opygpj/jqhm',
    method: 'post',
    data
  })
}

