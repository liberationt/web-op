/*
 * @Date: 2020-07-17 13:18:45
 * @LastEditors: 董亮
 * @LastEditTime:
 * @description: 库存管理
 */

import request from '@/utils/request'

// 对账初始化
export const reconInit = (data: any) => {
    return request({
        url: '/op-service/reconciliation/init',
        method: 'post',
        data
        // headers: {
        //     "Content-Type": "application/json"
        // }
    })
}

// 查询库存记录
export const manageQuery = (data: any) => {
    return request({
        url: '/op-service/inventory/management/query',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// 查询库存金额合计
export const queryJehj = (data: any) => {
    return request({
        url: '/op-service/inventory/management/total/je',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// 禁用或者取消禁用库存
export const switchInventory = (data: any) => {
    return request({
        url: '/op-service/inventory/management/update/enable',
        method: 'post',
        data
    })
}
