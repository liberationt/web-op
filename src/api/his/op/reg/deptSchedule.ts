// 挂号科室排班维护
import axios from '@/utils/request'

// 获取列表
export const aDeptSchList = (data: any) => {
  return axios.request({
    url: '/op-service/opkspb/doGetModelDataOperation',
    method: 'post',
    data
  })
}

// 保存排班
export const aSaveDeptSch = (data: any) => {
  return axios.request({
    url: '/op-service/opkspb/doSaveDepartmentScheduling',
    method: 'post',
    data,
    headers:{
			"Content-Type": "application/json"
		}
  })
}

// 复制排班
export const aSaveCopy = (data: any) => {
  return axios.request({
    url: '/op-service/opkspb/doSaveCopy',
    method: 'post',
    data,
    headers:{
			// "Content-Type": "application/json"
		}
  })
}
// 复制排班
export const getTimerInfor = () => {
  return axios.request({
    url: '/mtdms-service/opbcsj/findList',
    method: 'post',
  })
}
// 判断是否可选
export const getIsTrue = (data: any) => {
  return axios.request({
    url: '/op-service/opkspb/doModifyCheck',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
			'Res-Type': 'special'
		}
  })
}
// 判断是否复制下一天
export const getIsNext = (data: any) => {
  return axios.request({
    url: '/op-service/opkspb/doCopyCheck',
    method: 'post',
    data,
    headers: {
			'Res-Type': 'special'
		}
  })
}
//获取值班项目
export const getProjectList = () => {
  return axios.request({
    url: '/op-service/opghks/projectList',
    method: 'post'
  })
}
// 获取挂号科室列表
export const getGhksList = () => {
  return axios.request({
    url: '/op-service/opghks/queryPage',
    method: 'post'
  })
}
//新增模板
export const saveTemplate = (data:any) => {
  return axios.request({
    url: '/op-service/oppbmb/saveOrUpdate',
    method: 'post',
    data
  })
}
//按天复制
export const cloneDataCove = (data:any) => {
  return axios.request({
    url: '/op-service/oppbmb/copyWithDay',
    method: 'post',
    data
  })
}
//删除当天
export const deleteDate = (data:any) => {
  return axios.request({
    url: '/op-service/oppbmb/delete',
    method: 'post',
    data
  })
}
//校验模板
export const doCheckData = (data:any) => {
  return axios.request({
    url: '/op-service/oppbmb/doCheck',
    method: 'post',
    data
  })
}
//按科室复制
export const cloneWithKsYs = (data:any) => {
  return axios.request({
    url: '/op-service/oppbmb/copyWithKsYs',
    method: 'post',
    data
  })
}
// 获取所有医生」
export const getDocList = () => {
  return axios.request({
    url: '/system-service/hrpersonnel/getMzDoctor',
    method: 'post'
  })
}
//删除整个模板
export const deleteKsInfo = (data:any) => {
  return axios.request({
    url: '/op-service/oppbmb/deleteByGhksAndYsdm',
    method: 'post',
    data
  })
}



