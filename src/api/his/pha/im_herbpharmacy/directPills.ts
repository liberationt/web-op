/*
 * @Author: 曹俊
 * @LastEditTime: 2020-08-21 11:11:44
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\pha\im_herbpharmacy\directPills.ts
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

// 获取当前发药窗口
export const getWindow = (data: any) => {
    return request({
        url: '/op-service/pharmacy/direct/grant/get/grant/window?yfsb='+ data,
        method: 'post',
    })
}

// queryDispensing-待发药记录查询
export const queryDispensing = (data: any) => {
    return request({
        url: '/op-service/pharmacy/direct/grant/do/query/dispensing',
        method: 'post',
        data,
        // headers: {
        //     "Content-Type": "application/json"
        // }
    })
}

// queryPrescribingInformation-处方信息查询(发药)
export const getQueryPrescribingInformation = (data: number) => {
    return request({
        url: `/op-service/pharmacy/direct/grant/do/prescribing/information?cfsb=${data}`,
        method: 'post'
    })
}

// saveDispensing-发药
export const saveDispensing = (data: any) => {
    return request({
        url: '/op-service/pharmacy/direct/grant/do/save/dispensing',
        method: 'post',
        data
    })
}

// initialization-检查药房账簿是否初始化
export const checkInit = (data: any) => {
    return request({
        url: `/op-service/pharmacy/public/init/check?yfsb=${data}`,
        method: 'post',
        data
    })
}

// 查询发药药品明细
export const queryDrug = (data: any) => {
    return request({
        url: `/op-service/pharmacy/direct/grant/query/drug/detail`,
        method: 'post',
        data
    })
}

// 判断新增时药房名称是否重复
export const isExist = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/do/check/yfmc',
        method: 'post',
        data
    })
}


// 新增、保存、修改药房窗口
export const addPhaWin = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/window/save',
        method: 'post',
        data
    })
}

// 停用/启用发药窗口
export const stopDispenWin = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/window/change/status',
        method: 'post',
        data
    })
}

// 检查药房窗口编号是否重复
export const isRepetitionWin = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/window/check/repeat',
        method: 'post',
        data
    })
}

// 删除发药窗口
export const delDispenWin = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/window/delete',
        method: 'post',
        data
    })
}

// 药房窗口列表查询
export const searchWinList = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/window/list',
        method: 'post',
        data
    })
}

// 获取药房所对应的领用方式数据
export const phaReceiveStyle = (id: number) => {
    return request({
        url: `/op-service/pharmacy/install/do/yk/receive?yfsb=` + id,
        method: 'post',
    })
}

// 查询领用方式
export const receiveStyle = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/query/receive',
        method: 'post',
        data
    })
}

// 领药方式保存
export const receiveStyleSave = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/do/save/receive',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// 检查是否可选择领药方式
export const isSelectDispen = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/check/receive',
        method: 'post',
        data
    })
}

// 重置药库领药方式
export const reSetGetmedicine = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/do/reset/yk/receive',
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
