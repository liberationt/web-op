/*
 * @Date: 2020-09-01 18:25:50
 * @LastEditors: 董亮
 * @LastEditTime:
 * @description:  系统初始化
 */

import request from '@/utils/request'

// 系统初始化列表
export const initialList = (data: any) => {
    return request({
        url: '/op-service/systeminit/queryList',
        method: 'post',
        data,
    })
}

// 系统初始化-初始化
export const initialSystem = (data: any) => {
    return request({
        url: '/op-service/systeminit/doInit',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
