// 皮试
import axios from '@/utils/request'

// 皮试项目列表查询
export const aQuerySkinTestList = () => {
  return axios.request({
    url: '/op-service/skinxm/doQuerySkinTestList',
    method: 'post',
  })
}

// 皮试项目新增
export const aSaveSkinTest = (data: any) => {
  return axios.request({
    url: '/op-service/skinxm/doSaveSkinTest',
    method: 'post',
    data
  })
}

// 皮试项目修改
export const aUpdateSkinTest = (data: any) => {
  return axios.request({
    url: '/op-service/skinxm/doUpdateSkinTest',
    method: 'post',
    data
  })
}

// 皮试项目停用/启用
export const aUpdateZt = (data: any) => {
  return axios.request({
    url: '/op-service/skinxm/doUpdateZt',
    method: 'post',
    data
  })
}

// 皮试项目删除
export const aDeleteSkinTest = (data: any) => {
  return axios.request({
    url: '/op-service/skinxm/doDeleteSkinTest',
    method: 'post',
    data
  })
}

// 查询联动收费项目
export const aQueryLdsfxmList = (data: any) => {
  return axios.request({
    url: '/op-service/skinxmldsfxm/doQueryLdsfxmList',
    method: 'post',
    data
  })
}

// 新增/修改联动收费项目
export const aSaveLdsfxm = (data: any) => {
  return axios.request({
    url: '/op-service/skinxmldsfxm/doSaveLdsfxm',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 删除联动收费项目
export const aDeleteLdsfxm = (data: any) => {
  return axios.request({
    url: '/op-service/skinxmldsfxm/doDeleteLdsfxm',
    method: 'post',
    data
  })
}

// 查询病人已收费、未执行的皮试项目
export const aQueryUnSkinTest = (data: any) => {
  return axios.request({
    url: '/op-service/skindjzb/doQueryUnSkinTest',
    method: 'post',
    data
  })
}

// 登记
export const aPsSaveRegister = (data: any) => {
  return axios.request({
    url: '/op-service/skindjzb/doPsSaveRegist',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 开始皮试
export const aDoPsProcess = (data: any) => {
  return axios.request({
    url: '/op-service/skindjzb/doPsProcess',
    method: 'post',
    data
  })
}

// 结束皮试
export const aPsFinish = (data: any) => {
  return axios.request({
    url: '/op-service/skindjzb/doPsFinish',
    method: 'post',
    data
  })
}

// 取消皮试
export const aPsCancel = (data: any) => {
  return axios.request({
    url: '/op-service/skindjzb/doPsCancel',
    method: 'post',
    data
  })
}

// 查询需要皮试的处方
export const aQueryDjmx = (data: any) => {
  return axios.request({
    url: '/op-service/skindjzb/doQueryDjmx',
    method: 'post',
    data
  })
}




// 皮试工作量统计人次
export const aQueryAllDjCount = (data: any) => {
  return axios.request({
    url: '/op-service/skindjzb/doQueryAllDjCount',
    method: 'post',
    data
  })
}

// 皮试阳性率统计人次
export const aQueryPsAllergy = (data: any) => {
  return axios.request({
    url: '/op-service/skindjzb/doQueryPsAllergy',
    method: 'post',
    data
  })
}
