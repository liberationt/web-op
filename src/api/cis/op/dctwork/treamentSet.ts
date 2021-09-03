/*
 * @Date: 2020-06-12 11:28:22
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-15 20:03:30
 * @description:  诊疗方案维护的接口
 */

import request from '@/utils/request'

export interface IformTreat {
  blmbbh: number | null //病例模版序号
  cfztbh: number | null //处方组套序号
  jbxh: number | null //疾病序号
  jgid: number | null //机构代码
  ksdm: number | null //科室代码
  pydm: string //拼音码
  qybz: number | null //启用标志
  sslb: number | null //所属类别
  xmztbh: number | null //项目组套序号
  ygdm: number | null //员工代码
  zlmc: string //项目名称
  zlxh: number | null //序号
}

// 新增诊疗方案
export const addTreatment = (data: any) => {
  return request({
    url: '/op-service/gyzlfa/add',
    method: 'post',
    data,
  })
}

// 删除诊疗方案
export const deleteTreatment = (data: any) => {
  return request({
    url: '/op-service/gyzlfa/delete',
    method: 'post',
    data,
  })
}

// enable
export const enableTreatment = (data: any) => {
  return request({
    url: '/op-service/gyzlfa/enable',
    method: 'post',
    data,
  })
}

// disable
export const disableTreatment = (data: any) => {
  return request({
    url: '/op-service/gyzlfa/stop',
    method: 'post',
    data,
  })
}
/**
 * @LastEditors: zhml
 * @Description: 查询诊断，处方，病历模板等四个列表的数据
 * @param {type} params
 * @return:
 */
export const queryLists = (data: any) => {
  return request({
    url: '/op-service/gyzlfa/getMap',
    method: 'post',
    data,
  })
}


/**
 * @LastEditors: zhml
 * @Description: 保存明细
 * @param {type} params
 * @return:
 */
export const saveDetail = (data: any) => {
  return request({
    url: '/op-service/gyzlfa/saveDetails',
    method: 'post',
    data,
  })
}

// 患者列表调入诊疗方案
export const aJoinInTreatment = (data: any) => {
  return request({
    url: '/op-service/msbcjl/saveClinicTherapeutic',
    method: 'post',
    data,
  })
}
