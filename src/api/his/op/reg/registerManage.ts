// 挂号管理
import axios from '@/utils/request'

// 初始化挂号管理,判断票据号是否设置，判断是否排班，初始化挂号科室信息
export const aInitReg = () => {
  return axios.request({
    url: '/op-service/opghksManage/doUpdateDoctorNumbers',
    method: 'post',
    headers: {
      'Res-Type': 'special'
    }
  })
}

// 查询当日值班科室（区分门诊类别）
export const aQuerySchDept = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doQuerySchedulingDepartment',
    method: 'post',
    data,
    headers: {
      'Res-Type': 'special'
    }
  })
}

// 根据卡号查询病人信息
export const aQueryPatientInfo = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doQueryPerson',
    method: 'post',
    data,
    headers: {
      'Res-Type': 'special'
    }
  })
}

// 查询该病人是否挂过同一科室
export const aCheckSameGhks = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doCheckGhks',
    method: 'post',
    data
  })
}

// 查询专家、特需门诊是否有医生排班
export const aCheckExpertSch = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doCheckZjmzpb',
    method: 'post',
    data
  })
}

// 根据科室查询排班医生
export const aQueryDeptSchDoc = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doQuerySchedulingDoctor',
    method: 'post',
    data
  })
}

// 挂号结算查询
export const aQueryRegSettlement = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doQueryRegisteredSettlement',
    method: 'post',
    data,
    headers: {
      'Res-Type': 'special'
    }
  })
}

// 确认挂号
export const aSaveReg = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doSaveRegisteredManagement',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
      'Res-Type': 'special'
    }
  })
}

// 挂号单据查询（退号查询）
export const aQueryGhdj = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doQueryGhdj',
    method: 'post',
    data
  })
}

// 退号
export const aSaveRetireRegistered = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doSaveRetireRegistered',
    method: 'post',
    data
  })
}

// 转科查询
export const aQueryTurnDept = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doQueryTurnDept',
    method: 'post',
    data
  })
}

// 转科验证科室费用
export const aCheckKSFY = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doCheckKSFY',
    method: 'post',
    data
  })
}

// 转科
export const aCommitTurnDept = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doCommitTurnDept',
    method: 'post',
    data
  })
}

// 调入预约病人查询
export const aGetAnAppointment = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doGetAnAppointment',
    method: 'post',
    data
  })
}

// 根据病人性质查询上级性质
export const aQuerySjBrxz = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/querySjBrxz',
    method: 'post',
    data,
    headers: {
      'Res-Type': 'special'
    }
  })
}
//收费性质为离休判断校验
export const queryLxList = (data: any) => {
  return axios.request({
    url: '/op-service//opghksManage/queryLxList',
    method: 'post',
    data,
    headers: {
      'Res-Type': 'special'
    }
  })
}

// 判断是否为减免病人
export const aCheckJmbr = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doQueryJmbr',
    method: 'post',
    data,
    headers: {
      'Res-Type': 'special'
    }
  })
}

// 打印发票
export const aPrintghxx = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doPrintghxx',
    method: 'post',
    data,
    headers: {
      // 'Res-Type': 'special'
    }
  })
}

// 调用emr病程记录信息
export const aQueryBcjlByEmr = (data: any) => {
  return axios.request({
    url: '/op-service/opghmx/queryBcjlByEmr',
    method: 'post',
    data,
    headers: {
      // 'Res-Type': 'special'
    }
  })
}

// 分诊病人信息调入
export const aGetYjfzLsh = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doGetYjfzLsh',
    method: 'post',
    data,
    headers: {
      // 'Res-Type': 'special'
    }
  })
}
// 分诊病人信息调入 新入口
export const getJzYjfzList = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/doQueryYjfzbrInfo',
    method: 'post',
    data,
    headers: {
      // 'Res-Type': 'special'
    }
  })
}
// 校验工伤认定号
export const aCheckGs = (data: any) => {
  return axios.request({
    url: '/op-service/opghksManage/checkGs',
    method: 'post',
    data,
    headers: {
      // 'Res-Type': 'special'
    }
  })
}
