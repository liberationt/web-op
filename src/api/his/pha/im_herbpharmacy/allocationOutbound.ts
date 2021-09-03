/*
 * @Author: 曹俊
 * @LastEditTime: 2020-07-31 19:04:38
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\pha\im_herbpharmacy\allocationOutbound.ts
 */
import request from '@/utils/request'

export interface Isearch {
    sqyf: number | null
    mbyf: number| null
    type: string | null
    begin?: string | null
    end?: string | null
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

// initDateQuery-页面查询条件里面的默认财务月份
export const initDateQuery = (data: any) => {
    return request({
        url: `/op-service/pharmacy/public/get/default/month?yfsb=${data}`,
        method: 'post'
    })
}

// dateQuery-入库和出库的条件中的出入库日期范围查询
export const dateQuery = (data: any) => {
    return request({
        url: `/op-service/pharmacy/public/date/query`,
        method: 'post',
        data
    })
}

// verificationDeployInventorySubmit-调拨出库确认前校验
export const checkSubmit = (data: any) => {
    return request({
        url: '/op-service/allocate/out/check/submit',
        method: 'post',
        data
    })
}

// 查询调拨单
export const detail= (data: any) => {
    return request({
        url: '/op-service/allocate/out/get',
        method: 'post',
        data
    })
}

// queryMedicinesRequisitionDetailData-调拨出库单详情查询
export const detailList = (data: any) => {
    return request({
        url: '/op-service/allocate/out/get/detail',
        method: 'post',
        data
    })
}

// saveDeployInventoryBack-调拨出库退回
export const back = (data: any) => {
    return request({
        url: '/op-service/allocate/out/back',
        method: 'post',
        data
    })
}

// saveDeployInventoryCommit-调拨出库单确认
export const applyCommit = (data: any) => {
    return request({
        url: '/op-service/allocate/out/commit',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}


