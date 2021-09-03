/*
 * @Date: 2020-07-17 13:18:45
 * @LastEditors: 董亮
 * @LastEditTime:
 * @description: 药房对账
 */

import request from '@/utils/request'

// 对账初始化
export const reconInit = (data: any) => {
    return request({
        url: '/op-service/reconciliation/init',
        method: 'post',
        data
    })
}

// 获取药房药品对账汇总信息
export const saveInventory = (data: any) => {
    return request({
        url: '/op-service/reconciliation/query',
        method: 'post',
        data
    })
}

// 获取对账的起止时间范围
export const queryDate = (data: any) => {
    return request({
        url: '/op-service/reconciliation/query/date',
        method: 'post',
        data
    })
}

// 查询对账明细中药品信息
export const queryDetail = (data: any) => {
    return request({
        url: '/op-service/reconciliation/query/detail',
        method: 'post',
        data
    })
}

// 查询对账明细中账目列表
export const detailList = (data: any) => {
    return request({
        url: '/op-service/reconciliation/query/detail/list',
        method: 'post',
        data
    })
}
