/*
 * @Author: 曹俊
 * @LastEditTime: 2020-09-01 14:18:59
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\pha\im_herbpharmacy\inventoryEnter.ts
 */
import request from '@/utils/request'
import { log } from 'console'

export interface Iitem {
    PHAR_YK02_GRLR_YFSB: number | null
    PHAR_YK02_GRLR_LRRY: string | null
    PHAR_YK02_GRLR_PDDH: number | null
    PHAR_YK02_GRLR_JGID: number | null
    PHAR_YK02_GRLR_PYDM: string | null
}

export interface Iobj {
    yf_yk02_YFSB: number | null
    yf_yk02_CKBH: number | null
    yf_yk02_PDDH: number | null
    yk_typk_PYDM?: string | null
}

export interface Iform {
    jgid: number | null
    pddh: number | null
    yfsb: number | null
    yfbz: number | null
    ypxh: number | null
    ypcd: number | null
    cdmc: string | null
    ypmc: string | null
    ypgg: number | null
    ypdw: number | null
    ykdw: number | null
    lsjg: number | null
    jhjg: number | null
    ypph: string | null
    ypxq: string | null
    ykbz: number | null
    pfjg: number | null
}



// savePharmacyInventoryInitData-盘点录入初始数据增加
export const initData = (data: any) => {
    return request({
        url: `/op-service//check/entry/init/data?yfsb=${data}`,
        method: 'post',
        headers: {
            'Res-Type': 'special'
        }
    })
}

// SavePharmacyInventoryEntryAddReq-盘点录入新增
export const entryAdd = (data: number) => {
    return request({
        url: `/op-service/check/entry/add`,
        method: 'post',
        data
    })
}

// 查询合计金额
export const queryTotal = (data: any) => {
    return request({
        url: '/op-service/check/entry/query/total/money',
        method: 'post',
        data
    })
}

// removePharmacyInventoryEntry-删除盘点录入
export const entryRemove = (data: any) => {
    return request({
        url: '/op-service/check/entry/remove',
        method: 'post',
        data
    })
}

// savePharmacyInventoryEntry-保存盘点录入
export const entrySave = (data: any) => {
    return request({
        url: '/op-service/check/entry/save',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// savePharmacyInventoryEntryWc-完成/取消完成盘点录入
export const entryFinish = (data: any) => {
    return request({
        url: '/op-service/check/entry/finish',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// savePharmacyInventoryEntryCz-重置盘点录入
export const entryReset = (data: any) => {
    return request({
        url: `/op-service/check/entry/reset?yfsb=${data}`,
        method: 'post',
    })
}

// savePharmacyInventoryProcessingHz-盘点汇总(取消汇总)
export const summaryProcess = (data: any) => {
    return request({
        url: '/op-service/check/process/summary',
        method: 'post',
        data
    })
}
