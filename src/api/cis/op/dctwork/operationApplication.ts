import request from '@/utils/request'

// 保存前校验是否为重大手术
export const saveCheck= (data: any) => {
    return request({
        url: '/mms-service/operation/apply/check/major',
        method: 'post',
        data
    })
}

// 作废
export const abolishForm= (data: any) => {
  return request({
      url: '/mms-service/operation/apply/enable',
      method: 'post',
      data
  })
}

// 查询手术申请单明细
export const queryDetails= (data: any) => {
  return request({
      url: '/mms-service/operation/apply/get',
      method: 'post',
      data
  })
}

// 保存
export const saveApproval= (data: any) => {
  return request({
      url: '/mms-service/operation/apply/save',
      method: 'post',
      data
  })
}

// 查询拥有手术等级权限的医生
export const queryHaveDoctor = (data: any) => {
  return request({
      url: '/mms-service/operation/apply/query/operator',
      method: 'post',
      data
  })
}

// 查询拥有手术审核权限的医生
export const queryCheckDoctor = (data: any) => {
  return request({
      url: '/mms-service/operation/apply/query/check/operator',
      method: 'post',
      data
  })
}

// 查询手术医生的职称
export const queryProfessional = (data: any) => {
  return request({
      url: '/mms-service/operation/apply/query/yszc',
      method: 'post',
      data
  })
}

// 获取医院logo
export const queryLogo = (data: any) => {
    return request({
        url: `/system-service/dicyljg/logo?hospitalId=${data}`,
        method: 'post',
    })
}
