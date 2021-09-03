/*
 * @Date: 2020-05-14 13:26:43
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-09 15:56:27
 * @description:  常用诊断维护的接口
 */

import request from '@/utils/request'

export interface IDiagList {
  dmlb: number //	代码类别 | 代码类别(9:ICD9,10:ICD10)
  icdCode: string
  icd9: string
  jblb: number //疾病类别 | 疾病类别,与LC_SKBZ的BZBH相关（用于临床医生站）
  jbmc: string //疾病名称
  jbxh: number // 疾病序号
  pydm: string
  wbdm: string
  jbbs: number | null // 疾病标识
}

export interface IPerList {
  cdmzzd: number|null //肠道门诊诊断
  cflx: number //处方类型| 1:西药处方 2：中药处方 3：草药处方
  icd10: string
  jbbgk: string //疾病报告卡
  jlbh: number|null //序号
  sslb: number //所属类别 | 1.个人组套 2.科室组套 3.公用组套 4.个人常用药（诊断、项目）
  zdmc: string //诊断名称
  zdxh: number|null //诊断序号
}

/**
 * @LastEditors: zhml
 * @Description: 新增个人收藏
 * @param {type} params
 * @return:
 */
export const addZd = (data: any) => {
  return request({
    url: '/op-service/pubcyzd/add',
    method: 'post',
    data,
  })
}

/**
 * @LastEditors: zhml
 * @Description: 删除个人收藏
 * @param {type} params
 * @return:
 */
export const deleteZd = (data: any) => {
  return request({
    url: '/op-service/pubcyzd/delete',
    method: 'post',
    data,
  })
}

/**
 * @LastEditors: zhml
 * @Description: 查询个人收藏诊断
 * @param {type} params
 * @return:
 */
export const queryList = (data: any) => {
  return request({
    url: '/op-service/pubcyzd/findList',
    method: 'post',
    data,
  })
}
