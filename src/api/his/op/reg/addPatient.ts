// 病人档案
import axios from '@/utils/request'

// 新增
export const aAddPatient = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doAddPerson',
    method: 'post',
    data,
    headers:{
			"Content-Type": "application/json"
		}
  })
}

// 获取门诊号码
export const aQueryMzhm = () => {
  return axios.request({
    url: '/op-service/opghksManage/doQueryMzhm',
    method: 'post',
    headers:{
			"Content-Type": "application/json",
      'Res-Type': 'special'
		}
  })
}

// 获取病人性质列表
export const aGetBrxzList = () => {
  return axios.request({
    url: '/op-service/opghksManage/getPubBrxzList',
    method: 'post',
  })
}

// 获取病人性质列表(包括上级病人性质)
export const aQueryBrxz = () => {
  return axios.request({
    url: '/op-service/opghksManage/queryBrxz',
    method: 'post',
  })
}

// 查询身份证号
export const aQuerySfzh = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doQueryPersonByIdcard',
    method: 'post',
    data
  })
}

// 查询身份证号
export const aQueryCard = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doQueryPersonByCardno',
    method: 'post',
    data
  })
}

// 卡注销
export const aLogoffCard = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doCancelCard',
    method: 'post',
    data
  })
}

// 卡挂失
export const aLockCard = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doLostCard',
    method: 'post',
    data
  })
}

// 卡解挂
export const aUnLockCard = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doUnlatchCard',
    method: 'post',
    data
  })
}
// 身份证读卡
export const readeVidences = (data:any) => {
  return axios.request({
    url: '/system-service/sys/device/getDeviceInvokingUrl',
    method: 'post',
    data,
  })
}

//新增 根据姓名查询
export const getNameCardList = (data:any) => {
  return axios.request({
    url: '/op-service/opghksManage/doQueryPersonByName',
    method: 'post',
    data,
  })
}
