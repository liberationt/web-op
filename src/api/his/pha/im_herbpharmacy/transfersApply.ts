/*
 * @Author: 曹俊
 * @LastEditTime: 2020-07-30 20:31:44
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\pha\im_herbpharmacy\transfersApply.ts
 */
import request from '@/utils/request'

export interface Isearch {
    mbyf: number| null
    sqyf: number | null
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

// queryTarHouseStore-查询目标药房药品库存
export const queryKcsl = (data: any) => {
    return request({
        url: `/op-service/allocate/apply/query/target/kcsl`,
        method: 'post',
        data
    })
}
// saveMedicinesRequisition-调拨申请单保存
export const save = (data: any) => {
    return request({
        url: '/op-service/allocate/apply/save',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}
// removeMedicinesRequisition-删除调拨申请单
export const removeApply = (data: any) => {
    return request({
        url: '/op-service/allocate/apply/remove',
        method: 'post',
        data
    })
}

// verificationMedicinesRequisitionDelete-检查调拨申请单是否被删除
export const exists = (data: any) => {
    return request({
        url: '/op-service/allocate/apply/check/is/exists',
        method: 'post',
        data
    })
}

// 查询调拨单
export const detail= (data: any) => {
    return request({
        url: '/op-service/allocate/apply/get',
        method: 'post',
        data
    })
}

// 入库单删除
export const remove = (data: any) => {
    return request({
        url: '/op-service/drug/in/store/remove',
        method: 'post',
        data
    })
}

// 调拨单明细列表查询
export const detailList = (data: any) => {
    return request({
        url: '/op-service/allocate/apply/query/detail',
        method: 'post',
        data
    })
}

// saveMedicinesRequisitionSubmit-调拨申请单提交
export const commit = (data: any) => {
    return request({
        url: '/op-service/allocate/apply/submit',
        method: 'post',
        data
    })
}

// saveRequisitionCommit-调拨申请确认
export const applyCommit = (data: any) => {
    return request({
        url: '/op-service/allocate/apply/commit',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

