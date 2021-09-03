/*
 * @Date: 2020-08-04 13:15:50
 * @LastEditors: 董亮
 * @LastEditTime:
 * @description: 机构收费项目维护
 */

import request from '@/utils/request'

// 机构收费项目维护全部调入
export const transferAll = (data: any) => {
    return request({
        url: '/op-service/institutionalFeeItems/allInInstitutionalDetails',
        method: 'post',
        data,
        // headers: {
        //     "Content-Type": "application/json"
        // }
    })
}

// 机构收费项目明细作废或取消作废
export const cancelDetail = (data: any) => {
    return request({
        url: '/op-service/institutionalFeeItems/logoutProject',
        method: 'post',
        data,
    })
}

// 需调入收费项目明细列表
export const transferDetailList = (data: any) => {
    return request({
        url: '/op-service/institutionalFeeItems/queryInstitutionalDetails',
        method: 'post',
        data,
    })
}

// 机构收费项目维护选择调入
export const transfer = (data: any) => {
    return request({
        url: '/op-service/institutionalFeeItems/saveInInstitutionalDetails',
        method: 'post',
        data,
    })
}

// 机构收费项目明细修改
export const editDetailProject = (data: any) => {
    return request({
        url: '/op-service/institutionalFeeItems/updateInstitutionalFeeCollection',
        method: 'post',
        data,
    })
}
