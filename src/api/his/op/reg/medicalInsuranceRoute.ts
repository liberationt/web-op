// 医保线路信息维护
import axios from '@/utils/request'

// 新增
export const aAddMedInsRou = (data: any) => {
  return axios.request({
    url: '/op-service/opmzlb/add',
    method: 'post',
    data,
    headers:{
			"Content-Type": "application/json"
		}
  })
}

// 修改
export const aEditMedInsRou = (data: any) => {
  return axios.request({
    url: '/op-service/opmzlb/edit',
    method: 'post',
    data,
    headers:{
			"Content-Type": "application/json"
		}
  })
}

// 删除
export const aDelMedInsRou = (data: any) => {
  return axios.request({
    url: '/op-service/opmzlb/delete',
    method: 'post',
    data
  })
}

// 查询医保IP
export const aQueryMedInsIP = (data: any) => {
  return axios.request({
    url: '/op-service/opmzlb/doQueryYbipDetatil',
    method: 'post',
    data
  })
}

// 更新医保IP
export const aSaveMedInsIP = (data: any) => {
  return axios.request({
    url: '/op-service/opmzlb/doSaveOrUpdateYbip',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 删除医保IP
export const aDelMedInsIP = (data: any) => {
  return axios.request({
    url: '/op-service/opmzlb/delIpBySbxh',
    method: 'post',
    data
  })
}
