// 业务管理
import axios from '@/utils/request'

// 业务表信息
export const aTableinfo = () => {
  return axios.request({
    url: '/system-service/dicywlb/getTableinfo',
    method: 'post'
  })
}

// 获取所有业务类型（中所有）
export const aBusinessTypeAll = () => {
  return axios.request({
    url: '/system-service/dicywlb/findList',
    method: 'post'
  })
}

// 新增业务类型
export const aBusinessTypeAdd = (data: any) => {
  return axios.request({
    url: '/system-service/dicywlb/add',
    method: 'post',
    data
  })
}

// 修改业务类型
export const aBusinessTypeEdit = (data: any) => {
  return axios.request({
    url: '/system-service/dicywlb/edit',
    method: 'post',
    data
  })
}

// 删除业务类型
export const aBusinessTypeDel = (data: any) => {
  return axios.request({
    url: '/system-service/dicywlb/delete',
    method: 'post',
    data
  })
}

// 根据人员ID取权限（中勾选）
export const aUserBusinessType = (data: any) => {
  return axios.request({
    url: '/system-service/dicywlb/findbtIdByUserId',
    method: 'post',
    data
  })
}

// btId取所有业务权限（右所有）
export const aAuthList = (data: any) => {
  return axios.request({
    url: '/system-service/dicywlb/getAuthList',
    method: 'post',
    data
  })
}

// 查询人员已有权限（右勾选）
export const aFindqx = (data: any) => {
  return axios.request({
    url: '/system-service/sysywqxkz/findqx',
    method: 'post',
    data
  })
}

// 保存人员权限
export const aAuthEdit = (data: any) => {
  return axios.request({
    url: '/system-service/sysywqxkz/edit',
    method: 'post',
    data,
    headers:{
			"Content-Type": "application/json"
		}
  })
}
