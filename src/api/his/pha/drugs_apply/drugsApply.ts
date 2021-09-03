/*
 * @Author: 曹俊
 * @LastEditTime: 2020-08-12 19:50:22
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\pha\drugs_apply\drugsApply.ts
 */
import request from '@/utils/request'

export interface Iitem {
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

// queryStoreHouse-查询领药库房
export const queryHouse = (data: any) => {
    return request({
        url: `/op-service/pharmacy/public/query/store/house?yfsb=${data}`,
        method: 'post'
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

// removeApplyData-移除领药单
export const removeApply = (data: any) => {
    return request({
        url: '/op-service/medicines/apply/remove/apply/data',
        method: 'post',
        data
    })
}

// queryCkfs-查询领药方式
export const getCkfs = (data: any) => {
    return request({
        url: '/op-service/medicines/apply/get/ckfs',
        method: 'post',
        data
    })
}

// verificationApplyDelete-修改确认前判断领药单是否被删除和确认
export const saveVerification = (data: any) => {
    return request({
        url: '/op-service/medicines/apply/save/pre/verification',
        method: 'post',
        data
    })
}

// queryStorehouseCheckOutDetail-查询出库明细
export const queryDetail = (data: any) => {
    return request({
        url: '/op-service/medicines/apply/query/out/detail',
        method: 'post',
        data
    })
}

// queryKcslYfyk-药品申领查询药库库存
export const getYfyk = (data: any) => {
    return request({
        url: '/op-service/medicines/apply/get/kcsl/yfyk',
        method: 'post',
        data
    })
}

// 药品申领单详情查询
export const detail = (data: any) => {
    return request({
        url: '/op-service/medicines/apply/query/detail',
        method: 'post',
        data
    })
}

// updateApplyData-领药单提交
export const updateApplyData = (data: any) => {
    return request({
        url: '/op-service/medicines/apply/update/apply/data',
        method: 'post',
        data
    })
}

// saveMedicinesApply-药品领药单保存
export const saveApply = (data: any) => {
    return request({
        url: '/op-service/medicines/apply/save/medicines/apply',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// queryStorehouseLess-查询仓库低储物品
export const queryStoreLess = (data: any) => {
    return request({
        url: '/op-service/medicines/apply/query/store/less',
        method: 'post',
        data
    })
}


// saveMedicinesApplyCommit-领药单确认
export const applyCommit = (data: any) => {
    return request({
        url: '/op-service/medicines/apply/save/medicines/apply/commit',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}
