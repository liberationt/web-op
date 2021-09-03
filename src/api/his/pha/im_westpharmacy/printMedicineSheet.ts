/*
 * @Date: 2020-07-15 14:15:25
 * @LastEditors: 董亮
 * @LastEditTime:
 * @description: 摆药单打印
 */

import request from '@/utils/request'

// 查询药房是否已经维护领药科室
export const exists = (data: any) => {
    return request({
        url: '/op-service/pharmacy/public/query/lyks/exists',
        method: 'post',
        data
    })
}

// 查询摆药单
export const queryLeftList = (data: any) => {
    return request({
        url: '/op-service/dispensing/list/query',
        method: 'post',
        data
    })
}

// 查询摆药单明细
export const queryRightList = (data: any) => {
    return request({
        url: '/op-service/dispensing/list/query/detail',
        method: 'post',
        data
    })
}
