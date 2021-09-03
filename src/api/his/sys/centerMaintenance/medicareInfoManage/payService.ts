/*
 * @Date: 2020-08-04 09:30:50
 * @LastEditors: 董亮
 * @LastEditTime:
 * @description: 收费项目维护
 */

import request from '@/utils/request'

// 项目新增修改前校验
export const verify = (data: any) => {
    return request({
        url: '/op-service/dicsfxmlb/chargingProjectsVerification',
        method: 'post',
        data,
    })
}

// 项目归并
export const mergerProject = (data: any) => {
    return request({
        url: '/op-service/dicsfxmlb/consolidationProjects',
        method: 'post',
        data,
    })
}

// 项目明细作废或取消作废
export const cancelDetail = (data: any) => {
    return request({
        url: '/op-service/dicsfxmlb/logoutMedicalItems',
        method: 'post',
        data,
    })
}

// 项目费用限制列表
export const costLimit = (data: any) => {
    return request({
        url: '/op-service/dicsfxmlb/queryCostLimit',
        method: 'post',
        data,
    })
}

// 费用别名列表-分页
export const costAliasList = (data: any) => {
    return request({
        url: '/op-service/dicsfxmlb/queryPubFybm',
        method: 'post',
        data,
    })
}

// 收费项目明细列表-分页
export const chargeProjectDetail = (data: any) => {
    return request({
        url: '/op-service/dicsfxmlb/queryGyYlsfDetail',
        method: 'post',
        data,
    })
}

// 项目分页查询
export const searchProject = (data: any) => {
    return request({
        url: '/op-service/dicsfxmlb/queryMedicalProject',
        method: 'post',
        data,
    })
}

// 项目新增或修改保存
export const saveProject = (data: any) => {
    return request({
        url: '/op-service/dicsfxmlb/saveChargingProjects',
        method: 'post',
        data,
    })
}

// 项目明细新增修改保存
export const saveDetailProject = (data: any) => {
    return request({
        url: '/op-service/dicsfxmlb/saveCostDetail',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json'
        }
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
