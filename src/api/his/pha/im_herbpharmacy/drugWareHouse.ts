/*
 * @Date: 2020-06-28 09:19:46
 * @LastEditors: 曹俊
 * @LastEditTime: 2020-08-06 14:52:52
 * @description: 药品入库
 */

import request from '@/utils/request'

export interface Isearch {
    yfsb: number| null
    rkfs: string | null
    type: string | null
    start?: string | null
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

// initialization-检查药房账簿是否初始化
export const init = (data: number) => {
    return request({
        url: `/op-service/pharmacy/public/init/check?yfsb=${data}`,
        method: 'post'
    })
}

// 出入库方式字典查询
export const inoutWay = (data: any) => {
    return request({
        url: '/op-service/pharmacy/public/inout/way',
        method: 'post',
        data
    })
}

// saveCheckIn-药品入库单记录保存
export const save = (data: any) => {
    return request({
        url: '/op-service/drug/in/store/save',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}
// removeCheckOutData-删除出库单
export const removeApply = (data: any) => {
    return request({
        url: '/op-service/drug/out/store/remove',
        method: 'post',
        data
    })
}


// 查询入库单主数据
export const detail = (data: any) => {
    return request({
        url: '/op-service/drug/in/store/get/detail',
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



// verificationCheckInDelete-打开入库单提交页面前校验数据是否已经删除
export const exists = (data: any) => {
    return request({
        url: '/op-service/drug/in/store/verify/is/exists',
        method: 'post',
        data
    })
}

// 入库保存和提交时判断有没超过中心控制最大价格
export const price = (data: any) => {
    return request({
        url: '/op-service/drug/in/store/verify/price',
        method: 'post',
        data
    })
}

// 药品入库单详情查询
export const detailList = (data: any) => {
    return request({
        url: '/op-service/drug/in/store/query/detail/list',
        method: 'post',
        data
    })
}

// 入库单提交
export const commit = (data: any) => {
    return request({
        url: '/op-service/drug/in/store/commit',
        method: 'post',
        data
    })
}

