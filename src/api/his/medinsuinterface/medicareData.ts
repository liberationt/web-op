/*
 * @Author: 张文奇
 * @Date: 2020-04-16 11:37:12
 * @LastEditTime: 2020-04-23 09:42:55
 * @Description:
 * @FilePath: \web-op\src\api\his\medinsuinterface\medicareData.ts
 */
import request from '@/utils/request'

export interface IForm {
  dataType?: string //数据类型
  dataVersion?: number //版本号
  hospitalId?: number //医疗机构ID
  parentDatavalueId?: number // 父类数据ID
  pyCode?: string // 拼音码
  serialNumber?: number // 排序号
  stopFlag?: string // 是否停用
  wbCode?: string // 五笔码
  dataCode: string // 数据代码
  dataName: string // 数据名称
  dataNum: string // 数据编号
  ybdataId: number // 医保字典ID
  ybdatavalueId?: number // 医保数据ID
}

export const queryMedPage = (data: any) => {
  return request({
    url: '/shybypjggz/queryPage',
    data,
    method: 'post',
  })
}

//药品品规基础信息
export const queryQualitySpecPage = (data: any) => {
  return request({
    url: '/shybypjcxx/queryPage',
    data,
    method: 'post',
  })
}

// 新增药品品规基础信息
export const addQualitySpec = (data: any) => {
  return request({
    url: '/shybypjcxx/add',
    data,
    method: 'post',
  })
}

// 编辑药品品规基础信息
export const editQualitySpec = (data: any) => {
  return request({
    url: '/shybypjcxx/edit',
    data,
    method: 'post',
  })
}

// 药品价格规则
export const queryPriceRulePage = (data: any) => {
  return request({
    url: '/shybypcggz/queryPage',
    data,
    method: 'post',
  })
}

// 新增药品价格规则
export const addPriceRule = (data: any) => {
  return request({
    url: '/shybypjcxx/add',
    data,
    method: 'post',
  })
}

// 编辑药品价格规则
export const editPriceRule = (data: any) => {
  return request({
    url: '/shybypjcxx/edit',
    data,
    method: 'post',
  })
}

// 药品采购规则
export const queryPurchasePage = (data: any) => {
  return request({
    url: '/shybypcggz/queryPage',
    data,
    method: 'post',
  })
}

// 新增药品采购规则
export const addPurchase = (data: any) => {
  return request({
    url: '/shybypcggz/add',
    data,
    method: 'post',
  })
}

// 编辑药品采购规则
export const editPurchase = (data: any) => {
  return request({
    url: '/shybypcggz/edit',
    data,
    method: 'post',
  })
}

// 药品配送企业
export const queryDeliveryPage = (data: any) => {
  return request({
    url: '/shybypcggz/queryPage',
    data,
    method: 'post',
  })
}

// 新增药品配送企业
export const addDelivery = (data: any) => {
  return request({
    url: '/shybyppsqy/add',
    data,
    method: 'post',
  })
}

// 编辑药品配送企业
export const editDelivery = (data: any) => {
  return request({
    url: '/shybyppsqy/edit',
    data,
    method: 'post',
  })
}

// 药品医保可报销条件规则
export const queryDreimbursementPage = (data: any) => {
  return request({
    url: '/shybybkbxgz/queryPage',
    data,
    method: 'post',
  })
}

// 新增药品医保可报销条件规则
export const addReimbursement = (data: any) => {
  return request({
    url: '/shybybkbxgz/add',
    data,
    method: 'post',
  })
}

// 编辑药品医保可报销条件规则
export const editReimbursement = (data: any) => {
  return request({
    url: '/shybybkbxgz/edit',
    data,
    method: 'post',
  })
}

// 药品医保可报销条件规则
export const queryProportionPage = (data: any) => {
  return request({
    url: '/shybybblgz/queryPage',
    data,
    method: 'post',
  })
}

//add医保数据代码
export const addDataCode = (data: any) => {
  return request({
    url: '/ybapi-service/shybdata02/unifiedAdd',
    data,
    method: 'post',
  })
}

//edit医保数据代码
export const editDataCode = (data: any) => {
  return request({
    url: '/ybapi-service/shybdata02/unifiedEdit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

//修改医保数据代码列表状态
export const enableStatus = (data: any) => {
  return request({
    url: '/ybapi-service/shybdata02/editStopFlag',
    data,
    method: 'post',
  })
}

// 查询分页列表
export const queryPage = (data: any) => {
  return request({
    url: '/shybdata02/unifiedQueryPage',
    data,
    method: 'post',
  })
}
