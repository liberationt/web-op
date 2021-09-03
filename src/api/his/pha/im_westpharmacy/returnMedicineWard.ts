/*
 * @Date: 2020-07-13 13:15:22
 * @LastEditors: 董亮
 * @LastEditTime:
 * @description: 病区退药
 */

import request from '@/utils/request'

// 退药传递的数组参数
export interface drugArray {
    brch: string,
    brxm: string,
    cdmc: string,
    czgh: string,
    fyfs: number | null,
    jlid: number | null,
    jlxh: number | null,
    lsjg: number | null,
    pfjg: number | null,
    sqrq: string,
    thbz: number | null,
    thr: string | null,
    thsj: string | null,
    tjbz: number | null,
    tyrq: string | null,
    yepb: number | null,
    yfbz: number | null,
    yfdw: string,
    ypcd: number | null,
    ypgg: string,
    ypjg: number | null,
    ypmc: string,
    ypsl: number | null,
    ypsx: number | null,
    ypxh: number | null,
    yzid: number | null,
    zfbl: number | null,
    zfpb: number | null,
    zlxz: number | null,
    zsys: string,
    zxbz: number | null,
    zyh: number | null
}

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


// 查询药房是否已经维护领药科室
export const exists = (data: any) => {
    return request({
        url: '/op-service/pharmacy/public/query/lyks/exists',
        method: 'post',
        data
    })
}

// 待退药病区查询
export const queryWard = (data: any) => {
    return request({
        url: '/op-service/ward/refund/query',
        method: 'post',
        data
    })
}

// 病区待退药病人查询
export const queryPatient = (data: any) => {
    return request({
        url: '/op-service/ward/refund/query/br',
        method: 'post',
        data
    })
}

// 退回病区
export const backWard = (data: any) => {
    return request({
        url: '/op-service/ward/refund/back/ward',
        method: 'post',
        data
    })
}

// 退药
export const backDrug = (data: any) => {
    return request({
        url: '/op-service/ward/refund/back',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 全退
export const backAll = (data: any) => {
    return request({
        url: '/op-service/ward/refund/all/back',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
