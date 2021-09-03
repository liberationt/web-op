/*
 * @Date: 2020-06-28 13:16:45
 * @LastEditors: 曹俊
 * @LastEditTime: 2020-08-18 15:24:05
 * @description: 初始账簿
 */

import request from '@/utils/request'

// 计算
export const calc = (data: any) => {
    return request({
        url: `/op-service/pharmacy/public/calc/money`,
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// 保存账簿初始化数据
export const queryTotal = (data: any) => {
    return request({
        url: '/op-service/pharmacy/account/query/total/money',
        method: 'post',
        data
    })
}

// 保存账簿初始化数据
export const saveInventory = (data: any) => {
    return request({
        url: '/op-service/pharmacy/account/do/save/inventory',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// 初始账簿转账
export const PhaTransfer = (data: any) => {
    return request({
        url: '/op-service/pharmacy/account/do/save/transfer',
        method: 'post',
        data
    })
}

// 药房账簿初始化跳转判断
export const isInitial = (data: any) => {
    return request({
        url: '/op-service/pharmacy/account/initial',
        method: 'post',
        data,
        headers: {
            'Res-Type': 'special'
        }
    })
}

// 查询药房是否初始化
export const init = (data: any) => {
    return request({
        url: '/op-service/drug/info/maintenance/query/system/init',
        method: 'post',
        data,
        headers: {
            'Res-Type': 'special'
        }
    })
}

// 新增账簿初始化数据
export const add = (data: any) => {
    return request({
        url: `/op-service/pharmacy/account/add?kcsb=${data}`,
        method: 'post'
    })
}
