// 医院职工登记-新
import axios from '@/utils/request.ts'

// 新增
export const aEmpAdd = (data: any) => {
  return axios.request({
    url: '/system-service/hrpersonnel/add',
    method: 'post',
    data,
    // headers:{
		// 	"Content-Type": "application/json"
		// }
  })
}

// 修改
export const aEmpEdit = (data: any) => {
  return axios.request({
    url: '/system-service/hrpersonnel/edit',
    method: 'post',
    data
  })
}

// 注销
export const aEmpLock = (data: any) => {
  return axios.request({
    url: '/system-service/hrpersonnel/lock',
    method: 'post',
    data
  })
}

// 复原
export const aEmpUnLock = (data: any) => {
  return axios.request({
    url: '/system-service/hrpersonnel/unlock',
    method: 'post',
    data
  })
}

// 检查工号
export const aEmpNoCheck = (data: any) => {
  return axios.request({
    url: '/system-service/hrpersonnel/check',
    method: 'post',
    data
  })
}

// 检查证件
export const aCardCheck = (data: any) => {
  return axios.request({
    url: '/system-service/hrpersonnel/validCret',
    method: 'post',
    data
  })
}

// 生成拼音五笔
export const aPyWb = (data: any) => {
  return axios.request({
    url: '/system-service/sysuser/pywbTool',
    method: 'post',
    data
  })
}
