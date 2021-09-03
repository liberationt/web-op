/*
 * @Author: 曹俊
 * @LastEditTime: 2020-08-31 10:21:54
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\pha\im_herbpharmacy\cancelPills.ts
 */
import request from '@/utils/request'

export interface Iobj {
    brxz: number | null
    ckbh: number | null
    yfsb: number | null
    value?: string | null
}

export interface Iitem {
    start: string | null
    end: string | null
    value: string | null
    yfsb: number | null
}

export interface Iobject {
    cfsb: number | null
    yfsb: number | null
}
export interface Iparam {
    OP_CF02_CFSB: number | null
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

// queryPharmacyAutoRefresh-药房自动刷新参数查询
export const refresh = (data: any) => {
    return request({
        url: '/op-service/pharmacy/direct/grant/do/query/auto/refresh',
        method: 'post',
        data
    })
}

// queryBackMedicinePrescribingInformation-处方信息查询(取消发药)
export const cancelDispensing = (data: number) => {
    return request({
        url: `/op-service/cancel/dispensing/query/cf/detail?cfsb=${data}`,
        method: 'post'
    })
}

// saveBackMedicine-取消发药保存
export const saveCancelDispensing = (data: any) => {
    return request({
        url: '/op-service/cancel/dispensing/save/back/medicine',
        method: 'post',
        data
    })
}

// saveBackPartMedicine-部分退药保存
export const saveMedicine = (data: any) => {
    return request({
        url: '/op-service/cancel/dispensing/save/back/part/medicine',
        method: 'post',
        data
    })
}

// 退药处方明细数据查询
export const queryRefund = (data: any) => {
    return request({
        url: '/op-service/cancel/dispensing/query/refund/detail',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

