/*
 * @Date: 2020-08-12 15:16:50
 * @LastEditors: 董亮
 * @LastEditTime:
 * @description:  患者性质维护
 */

import request from '@/utils/request'

// 患者性质树
export const patientNatureTree = (data: any) => {
    return request({
        url: '/op-service/pubbrxz/queryTree',
        method: 'post',
        data,
    })
}

// 患者性质树的新增
export const addPatientNatureTree = (data: any) => {
    return request({
        url: '/op-service/pubbrxz/add',
        method: 'post',
        data,
    })
}

// 患者性质树的编辑
export const editPatientNatureTree = (data: any) => {
    return request({
        url: '/op-service/pubbrxz/edit',
        method: 'post',
        data,
    })
}

// 患者性质树的删除
export const delPatientNatureTree = (data: any) => {
    return request({
        url: '/op-service/pubbrxz/delete',
        method: 'post',
        data,
    })
}

// 患者性质详情
export const getPatientDetail = (data: any) => {
    return request({
        url: '/op-service/pubbrxz/queryDetail',
        method: 'post',
        data,
    })
}

// 费用限制列表详情
export const getCostDetail = (data: any) => {
    return request({
        url: '/op-service/pubbrxz/queryFyxzList',
        method: 'post',
        data,
    })
}

// 费用限制的新增
export const addCostLimit = (data: any) => {
    return request({
        url: '/op-service/pubbrxz/fyxzAdd',
        method: 'post',
        data,
    })
}

// 费用限制的编辑
export const editCostLimit = (data: any) => {
    return request({
        url: '/op-service/pubbrxz/fyxzEdit',
        method: 'post',
        data,
    })
}

// 费用限制的删除
export const delCostLimit = (data: any) => {
    return request({
        url: '/op-service/pubbrxz/fyxzDelete',
        method: 'post',
        data,
    })
}

// 药品限制列表
export const getDrugLimit = (data: any) => {
    return request({
        url: '/op-service/pubbrxz/queryYpxzList',
        method: 'post',
        data,
    })
}

// 药品限制的新增
export const addDrugLimit = (data: any) => {
    return request({
        url: '/op-service/pubbrxz/ypxzAdd',
        method: 'post',
        data,
    })
}

// 药品限制的编辑
export const editDrugLimit = (data: any) => {
    return request({
        url: '/op-service/pubbrxz/ypxzEdit',
        method: 'post',
        data,
    })
}

// 药品限制的删除
export const delDrugLimit = (data: any) => {
    return request({
        url: '/op-service/pubbrxz/ypxzDelete',
        method: 'post',
        data,
    })
}

// 自负比例的列表查询
export const getSelfProportion = (data: any) => {
    return request({
        url: '/op-service/pubbrxz/queryBrxzZfbl',
        method: 'post',
        data,
    })
}

// 自负比例的编辑
export const selfProportion = (data: any) => {
    return request({
        url: '/op-service/pubbrxz/zfblEdit',
        method: 'post',
        data,
    })
}

// 获取拼音码
export const getMnemonic = (data: any) => {
    return request({
        url: '/system-service/system/public/get/mnemonic',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}
