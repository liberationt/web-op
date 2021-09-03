// 医生排班维护
import axios from '@/utils/request'

// 获取当日所有医生列表
export const aDocSchList = (data: any) => {
  return axios.request({
    url: '/op-service/opyspb/queryPage',
    method: 'post',
    data
  })
}

// 获取当日科室列表（不区分门诊类别）
export const aDeptList = (data: any) => {
  return axios.request({
    url: '/op-service/opyspb/findDeptList',
    method: 'post',
    data
  })
}

// // 获取挂号科室医生列表
export const aDeptDocListjz = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doQuerySchedulingDoctor',
    method: 'post',
    data
  })
}

// 获取挂号科室医生列表
export const aDeptDocList = (data: any) => {
  return axios.request({
    url: '/op-service/opyspb/findList',
    method: 'post',
    data
  })
}

// 获取挂号科室列表
export const DepartmentList = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doQuerySchedulingDepartment',
    method: 'post',
    data
  })
}

// 保存排班
export const aSaveDocSch = (data: any) => {
  return axios.request({
    url: '/op-service/opyspb/add',
    method: 'post',
    data,
    headers:{
			"Content-Type": "application/json"
		}
  })
}

// 删除排班
export const aDelDocSch = (data: any) => {
  return axios.request({
    url: '/op-service/opyspb/delete',
    method: 'post',
    data
  })
}

// 复制一条
export const aCopyDoc = (data: any) => {
  return axios.request({
    url: '/op-service/opyspb/addCopy',
    method: 'post',
    data
  })
}

// 复制一周
export const aCopyWeek = (data: any) => {
  return axios.request({
    url: '/op-service/opyspb/addCopyWeeks',
    method: 'post',
    data
  })
}

// 医生排班时校验医生的值班类别
export const aVaildYspbByZblb = (data: any) => {
  return axios.request({
    url: '/op-service/opyspb/doVaildYspbByZblb',
    method: 'post',
    data
  })
}
export const getDcoList = (data: any) => {
  return axios.request({
    url: '/system-service/hrpersonnel/getMzDoctor',
    method: 'post',
    data
  })
}
//校验
export const handelCheck = (data: any) => {
  return axios.request({
    url: '/op-service//oppbjl/doCheck',
    method: 'post',
    data
  })
}
//新增或者修改
export const saveDoc = (data: any) => {
  return axios.request({
    url: '/op-service/oppbjl/saveOrUpdate',
    method: 'post',
    data
  })
}
// 接停诊断
export const changeDocStatus = (data: any) => {
  return axios.request({
    url: '/op-service/oppbjl/updateState',
    method: 'post',
    data
  })
}
//模板列表
export const templateList = () => {
  return axios.request({
    url: '/op-service/oppbmb/templateList',
    method: 'post',
  })
}
// 生成排班
export const saveGenerateRecord = (data:any) => {
  return axios.request({
    url: '/op-service/oppbjl/generateRecord',
    method: 'post',
    data
  })
}
//日志
export const optionList = (data:any) => {
  return axios.request({
    url: '/op-service/oppbjlerror/findList',
    method: 'post',
    data
  })
}
//日志详情
export const optionListDetails = (data:any) => {
  return axios.request({
    url: '/op-service/oppbjlerror/listByUuid',
    method: 'post',
    data
  })
}
//操作员列表
export const getOperatorList = (data:any) => {
  return axios.request({
    url: '/op-service/oppbjlerror/getOperatorList',
    method: 'post',
    data
  })
}



