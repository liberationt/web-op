/*
 * @Date: 2020-06-28 09:19:46
 * @LastEditors: Please set LastEditors
 * @LastEditTime:
 * @description: 药品养护
 */

import request from '@/utils/request'

// 养护单确认
export const conservationCommit = (data: any) => {
    return request({
        url: '/op-service/drug/maintain/commit',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// 药品养护-养护明细查询
export const queryDetail = (data: any) => {
    return request({
        url: '/op-service/drug/maintain/query/detail',
        method: 'post',
        data
    })
}

// 删除养护单
export const removeConservation = (data: any) => {
    return request({
        url: '/op-service/drug/maintain/remove',
        method: 'post',
        data
    })
}

// 养护单保存
export const saveConservation = (data: any) => {
    return request({
        url: '/op-service/drug/maintain/save',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}
