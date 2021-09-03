/*
 * @Author: 曹俊
 * @LastEditTime: 2020-09-09 15:37:24
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\pha\im_herbpharmacy\drugWithdrawalTreatment.ts
 */
import request from '@/utils/request'

export interface Isearch {
    mbyf: number| null
    sqyf: number | null
    type: string | null
    lyrqBegin?: string | null
    lyrqEnd?: string | null
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

// queryStoreHouse-查询领药库房
export const queryHouse = (data: any) => {
    return request({
        url: `/op-service/pharmacy/public/query/store/house?yfsb=${data}`,
        method: 'post'
    })
}


// queryTyCkfs-退药方式查询
export const queryTyCkfs = (data: any) => {
    return request({
        url: `/op-service/medicines/refund/query/way?yksb=${data}`,
        method: 'post',
        data
    })
}

// queryPharmacyApplySelect-退药申请单调入列表查询
export const pharmacyApply = (data: any) => {
    return request({
        url: `/op-service/medicines/refund/pharmacy/apply/select`,
        method: 'post',
        data
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
// saveMedicinesApply-退药单保存
export const save = (data: any) => {
    return request({
        url: '/op-service/medicines/refund/save/medicines/apply',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// verificationApplyDelete-修改确认前判断领药单是否被删除和确认
export const verification = (data: any) => {
    return request({
        url: '/op-service/medicines/apply/save/pre/verification',
        method: 'post',
        data
    })
}

// 退药单详情查询
export const detail= (data: any) => {
    return request({
        url: '/op-service/medicines/refund/query/detail',
        method: 'post',
        data
    })
}

// removeApplyData-移除退药单
export const remove = (data: any) => {
    return request({
        url: '/op-service/medicines/refund/remove/apply/data',
        method: 'post',
        data
    })
}

// queryMedicinesApplyRefundDetail-申领退药明细查询
export const detailList = (data: any) => {
    return request({
        url: '/op-service/medicines/refund/medicine/detail',
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

// saveMedicinesApplyRefundCommit-提交药房退药单
export const applyCommit = (data: any) => {
    return request({
        url: '/op-service/medicines/refund/apply/commit',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// queryStorehouseCheckOutDetailL-调入
export const importData = (data: any) => {
    return request({
        url: '/op-service/medicines/refund/import/history/data',
        method: 'post',
        data
    })
}
