/*
 * @Author: 曹俊
 * @LastEditTime: 2020-07-27 20:51:37
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\pha\hospitalizedAccount\index.ts
 */
import request from '@/utils/request'

export interface Iitem {
    yksb: number| null
    yfsb: number | null
    type: string | null
}
export interface Iobject {
    yksb: number| null
    yfsb: number | null
    type: string | null
    lyrqBegin: string | null
    lyrqEnd: string | null
}

export interface Iform {
    lyfs: number| null
    sqsj: string | null
    ckbz: string | null
    cksj: string | null
    lysj: string | null
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


// loadZyxx-入院病人信息查询
export const bookkeepingQuery = (data: number) => {
    return request({
        url: `/op-service/hospital/bookkeeping/query/br`,
        method: 'post',
        data
    })
}

// saveHospitalPharmacyAccounting-住院记账保存
export const bookkeepingSave = (data: any) => {
    return request({
        url: '/op-service/hospital/bookkeeping/save',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}
