// 挂号管理
import axios from '@/utils/request'

// 获取发票号码
export const aGetNotesNumber = () => {
  return axios.request({
    url: '/op-service/opmzxx/doGetNotesNumber',
    method: 'post'
  })
}

// 单据查询
export const aQueryDj = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doQueryDj',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 根据病人性质改变自负比例
export const aChangeZfbl = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doChangeZfbl',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 单据明细查询
export const aQueryDjDetails = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doQueryDjDetails',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 根据医生工号查找对应的挂号科室
export const aFindKsdmByYsdm = () => {
  return axios.request({
    url: '/op-service/opmzxx/doFindKsdmByYsdm',
    method: 'post'
  })
}

// 验证病区是否开启物品计费标志 并判断是否存在二级库房
export const aVerificationWpjfbz = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doVerificationWpjfbz',
    method: 'post',
    data
  })
}

// 结算信息查询
export const aQueryPayment = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doQueryPayment',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 保存折扣信息
export const aSaveDiscountInfo = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doSaveDiscountInfo',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 门诊结算
export const aSaveOutpatientSettlement = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doSaveOutpatientSettlement',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
      'Res-Type': 'special'
    }
  })
}

// 加载信息(原方法类OutPharmacyLoad)
export const aGetYfsb = (data: any) => {
  return axios.request({
    url: '/op-service/sysxtcs/load',
    method: 'post',
    data
  })
}

// 校验库存信息
export const aCheckInventory = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doCheckInventory',
    method: 'post',
    data
  })
}

// 处方组套获取药品组套明细
export const aLoadMedcineSet = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doLoadMedcineSet',
    method: 'post',
    data
  })
}

// 处置组套获取项目组套明细
export const aLoadProjectSet = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doLoadProjectSet',
    method: 'post',
    data
  })
}

// 收费结算组套查询
export const aQueryJsZtInfo = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doQueryJsZtInfo',
    method: 'post',
    data
  })
}

// 发票复制
export const aSaveCopyFphm = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/saveCopyFphm',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 发票修改
export const aUpdateNotesNumber = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doUpdateNotesNumber',
    method: 'post',
    data
  })
}

// 预保存
export const aSaveSettle = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doSaveSettle',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 获取所有挂号科室，取门诊科室
export const aQueryOfficeCode = () => {
  return axios.request({
    url: '/op-service/opghksManage/doQueryOfficeCode',
    method: 'post'
  })
}

// 打印发票
export const aPrintMoth = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doPrintMoth',
    method: 'post',
    data
  })
}
//新增发票重打
export const aPrintMothNext = (data: any) => {
  return axios.request({
    url: '/op-service/opmzxx/doPrintMothNext',
    method: 'post',
    data
  })
}
//新增---一卡通 票据补打功能
export const printBd = (data: any) => {
  return axios.request({
    url: '/op-service/mpikpxx/doPrintFpxx',
    method: 'post',
    data
  })
}