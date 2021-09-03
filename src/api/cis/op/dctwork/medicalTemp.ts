/*
 * @Date: 2020-05-17 13:37:41
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-10 19:53:20
 * @description:
 */

import request from '@/utils/request'

export interface IMedicalMBList {
  diagnoseid: string //疾病序号
  diagnosename: string //诊断名称
  diagnosenamepy: string
  healthteach: string //健康处方内容
  icd10: string //icd10
  id: string //记录序号
  inputdate: string //录入日期
  inputunit: string //录入单位
  inputuser: string //录入员工
  jlxh: string //模版主键
  lastmodifydate: string //最后修改日期
  lastmodifyunit: string //最后修改机构
  lastmodifyuser: string //最后修改人
  ordernum: number //ordernum
  recipename: string //recipename
  recipenamepy: string //recipenamepy
  recordid: string //记录序号
}

export interface IMedicalForm {
  fzjc: string //辅助检查
  jlxh: number //	记录序号 | 主键
  jws: string //既往史
  mbList: any[] // 健康教育集合
  //   mbList: IMedicalMBList[] //健康教育集合
  tgjc: string //体格检查
  xbs: string //现病史
  zsxx: string //主诉信息
  webRowStatus: boolean
}

/**
 * @LastEditors: zhml
 * @Description: 新增模板
 * @param {type} params
 * @return:
 */
export const addTemp = (data: any) => {
  return request({
    url: '/op-service/gyblmb/add',
    method: 'post',
    data,
  })
}

/**
 * @LastEditors: zhml
 * @Description: 删除病历模板
 * @param {type} params
 * @return:
 */
export const deleteTemp = (data: any) => {
  return request({
    url: '/op-service/gyblmb/delete',
    method: 'post',
    data,
  })
}

/**
 * @LastEditors: zhml
 * @Description: 启用
 * @param {type} params
 * @return:
 */
export const enable = (data: any) => {
  return request({
    url: '/op-service/gyblmb/enable',
    method: 'post',
    data,
  })
}
/**
 * @LastEditors: zhml
 * @Description: 停用
 * @param {type} params
 * @return:
 */
export const disable = (data: any) => {
  return request({
    url: '/op-service/gyblmb/unenable',
    method: 'post',
    data,
  })
}

/**
 * @LastEditors: zhml
 * @Description: 根据记录号查询模板
 * @param {type} params
 * @return:
 */
export const queryDetail = (data: any) => {
  return request({
    url: '/op-service/gyblmb/getOneByEntity',
    method: 'post',
    data,
  })
}
/**
 * @LastEditors: zhml
 * @Description: 保存模板
 * @param {type} params
 * @return:
 */
export const saveTemp = (data: any) => {
  return request({
    url: '/op-service/gyblmb/save',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
/**
 * @LastEditors: dmj
 * @Description: 病历模板调入
 * @param {type} params
 * @return:
 */
export const tranferIn = (data: any) => {
  return request({
    url: '/op-service/msbcjl/templateImport',
    method: 'post',
    data,
  })
}
