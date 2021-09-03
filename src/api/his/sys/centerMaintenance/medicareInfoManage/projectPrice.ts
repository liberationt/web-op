/*
 * @Date: 2020-08-04 13:14:50
 * @LastEditors: 董亮
 * @LastEditTime:
 * @description: 机构收费项目调价
 */

import request from '@/utils/request'

// 调价单立即生效
export const effectAdjustment = (data: any) => {
    return request({
        url: '/op-service/feexmfytj01/effectAdjustment',
        method: 'post',
        data,
    })
}

// 新增或修改调价单保存
export const saveAdjustment = (data: any) => {
    return request({
        url: '/op-service/feexmfytj01/saveAdjustment',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// 执行调价单
export const updateExcuteStatus = (data: any) => {
    return request({
        url: '/op-service/feexmfytj01/updateExcuteStatus',
        method: 'post',
        data,
    })
}

// 删除调价单
export const removeAdjustment = (data: any) => {
    return request({
        url: '/op-service/feexmfytj01/removeAdjustment',
        method: 'post',
        data,
    })
}

// 查询收费项目调价明细
export const checkDetail = (data: any) => {
    return request({
        url: '/op-service/feexmfytj01/loadAdjustmentAndDetail',
        method: 'post',
        data,
    })
}
