/*
 * @Author: 曹俊
 * @LastEditTime: 2020-07-09 10:29:25
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\pha\im_herbpharmacy\readingBill.ts
 */
import request from '@/utils/request'

export interface Iobj {
    brxz: number | null
    ckbh: number | null
    yfsb: number | null
    value?: string | null
}

export interface Iitem {
    ms_cf02_CFSB: number | null
}
export interface Iobject {
    cfsb: number | null
    fygh: string | null
    yfsb: number | null
    brxz?: number | null
    ckbh?: number | null
    fphm?: string | null
}
export interface Isearch {
    PHAR_JZJL_JGID: number | null
    PHAR_JZJL_YFSB: number | null

}

// queryMedicinesAccountingStatementDate-药品月终过账时间查询
export const queryDate = (data: any) => {
    return request({
        url: `/op-service/month/end/accounts/query/date?yfsb=${data}`,
        method: 'post',
    })
}

// saveMedicinesAccountingStatementDate-月结
export const monthlyBalance = (data: any) => {
    return request({
        url: '/op-service/month/end/accounts/save',
        method: 'post',
        data,
        // headers: {
        //     "Content-Type": "application/json"
        // }
    })
}
