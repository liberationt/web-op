/*
 * @Date: 2020-05-14 13:26:43
 * @LastEditors: zhml
 * @LastEditTime: 2020-06-18 14:02:59
 * @description:  常用组套，检验组套维护的接口
 */

import request from '@/utils/request'

export interface ISuiteTypeList {
  sslb: number | null
  ztlb: number | null
  ztmc: string
  webRowStatus: boolean
  ztbh: number | undefined
  sfqy: number | null
  ksdm: number | string | null
}
export interface ISuiteDetail {
  webSortNumber: number | null,
  jlbh: number | null,
  gytj: number | string //	给药途径
  jldw: string //	剂量单位
  sypc: string // 使用频次
  mrcs: number,
  xmmc: string //  药品名称
  ycjl: number // 一次剂量
  ypzh: number // 药品组号 判断颜色
  yyts: number // 	用药天数
  ztbh: number // 组套编号
  xmsl: number // 数量
  ypsl: number 
  jz: number //脚注
  fydj: number // 单价
  sbjg: number // 商保价格
  isEdit: boolean
  xmbh: number, // 项目编号
  yfbz: number,
  jb: number, // 几倍
  // mrcs: number, // 	每日次数
}
// 启用
export const enable = (data: any) => {
  return request({
    url: '/op-service/opzt01/enable',
    method: 'post',
    data,
  })
}

// 停用
export const disEnable = (data: any) => {
  return request({
    url: '/op-service/opzt01/stop',
    method: 'post',
    data,
  })
}
/**
 * @LastEditors: zhml
 * @Description: 根据组套编号查询详情
 * @param {type} ztbh
 * @return: list
 */
export const searchDetailList = (data: any) => {
  return request({
    url: '/op-service/opzt02/BLZbdfhiinstty',
    method: 'post',
    data,
  })
}

// 新增
export const add = (data: any) => {
  return request({
    url: '/op-service/opzt01/add',
    method: 'post',
    data,
  })
}

// 编辑
export const edit = (data: any) => {
  return request({
    url: '/op-service/opzt01/edit',
    method: 'post',
    data,
  })
}

// 按条件分页查询
export const queryPage = (data: any) => {
  return request({
    url: '/op-service/opzt01/queryPage',
    method: 'post',
    data,
  })
}

/**
 * @LastEditors: zhml
 * @Description: 根据ztbh组套编号查详情
 * @param {type} params
 * @return:
 */
export const queryDetail = (data: any) => {
  return request({
    url: '/op-service/opzt02/findListByZtbh',
    method: 'post',
    data,
  })
}
/**
 * @LastEditors: zhml
 * @Description: 根据ztbh组套编号查详情
 * @param {type} params
 * @return:
 */
export const queryDetailXm = (data: any) => {
  return request({
    url: '/op-service/opzt02/findListByZtbhXm',
    method: 'post',
    data,
  })
}

// 根据识别序号查询组套详情
export const queryZtDetail = (data: any) => {
  return request({
    url: '/op-service/opyjcf01/queryZtDetail',
    method: 'post',
    data,
  })
}


/**
 * @LastEditors: zhml
 * @Description: 根据组套编号，保存组套明细
 * @param {type} list
 * @return: boolean
 */
export const saveList = (data: any) => {
  return request({
    url: '/op-service/opzt02/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}


/**
 * @LastEditors: zhml
 * @Description: 检验组套的新增组套类型名称
 * @param {type} params
 * @return:
 */

export const addExamineSuiteName = (data: any) => {
  return request({
    url: '/op-service/lisjyztlx/add',
    method: 'post',
    data,
  })
}


/**
 * @LastEditors: zhml
 * @Description: 检验组套的修改组套类型名称
 * @param {type} params
 * @return:
 */
export const editExamineSuiteName = (data: any) => {
  return request({
    url: '/op-service/lisjyztlx/edit',
    method: 'post',
    data,
  })
}
/**
 * @LastEditors: zhml
 * @Description: 检验组套的注销组套类型名称
 * @param {type} params
 * @return:
 */
export const logoutExamineSuiteName = (data: any) => {
  return request({
    url: '/op-service/lisjyztlx/saveLogoutZtlx',
    method: 'post',
    data,
  })
}


export const getPubpc = (data: any) => {
  return request({
    url: '/op-service/dicsypc/getMrcsByPcbm',
    method: 'post',
    data,
  })
}

export const deleteByJlxh = (data: any) => {
  return request({
    url: '/op-service/opzt02/delete',
    method: 'post',
    data,
  })
}
//
export const saveRight = (data: any) => {
  return request({
    url: '/op-service/opzt02/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

////
export const checkoutData = (data: any) => {
  return request({
    url: '/op-service/lisjyztlx/queryPage',
    method: 'post',
    data,
  })
}


export const findData = (data: any) => {
  return request({
    url: '/op-service/lisjyztlx/findList',
    method: 'post',
    data,
  })
}



//确定按钮
export const sureBtn = (data: any) => {
  return request({
    url: '/op-service/opyjcf01/saveMzjySqd',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//获取自负比例
export const getProportion = (data: any) => {
  return request({
    url: '/op-service/mzcf/getPayProportion',
    method: 'post',
    data,
  })
}

