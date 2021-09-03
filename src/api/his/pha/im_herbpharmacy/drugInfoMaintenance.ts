/*
 * @Date: 2020-06-28 10:57:15
 * @LastEditors: 曹俊
 * @LastEditTime: 2020-08-12 16:39:29
 * @description: 药品信息维护
 */

import request from '@/utils/request'

export interface Iforms {
    cgh: number | null,
    drsj: string,
    jgid: number | null,
    qzcl: number | null,
    yfbz: number | null,
    yfdc: number | null,
    yfgc: number | null,
    yfdw: string,
    yfgg: string,
    yfsb: number | null,
    yfzf: number | null,
    ypdw: string,
    ypfb: number | null,
    ypgg: string,
    ypmc: string,
    ypxh: number | null,
    zxbz: number | null
}

// 调入
export const callIn = (data: any) => {
    return request({
        url: '/op-service/drug/info/maintenance/import',
        method: 'post',
        data
    })
}

// 查询单个药品信息
export const searchDrug = (data: any) => {
    return request({
        url: '/op-service/drug/info/maintenance/get',
        method: 'post',
        data
    })
}

// 查询药房是否初始化
export const isInitialize = (data: any) => {
    return request({
        url: '/op-service/drug/info/maintenance/query/system/init',
        method: 'post',
        data,
        headers: {
            'Res-Type': 'special'
        }
    })
}

// 修改药品信息
export const editDrugInfo = (data: any) => {
    return request({
        url: '/op-service/drug/info/maintenance/save',
        method: 'post',
        data
    })
}

// 药品作废、取消作废
export const handleStatus = (data: any) => {
    return request({
        url: '/op-service/drug/info/maintenance/update/status',
        method: 'post',
        data
    })
}
