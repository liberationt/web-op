/*
 * @Date: 2020-07-30 14:14:50
 * @LastEditors: 董亮
 * @LastEditTime:
 * @description:  手术信息维护
 */

import request from '@/utils/request'

// 新增科室手术名称
export const addOperation = (data: any) => {
    return request({
        url: '/op-service/optssfl/add',
        method: 'post',
        data,
    })
}

// 删除科室手术名称
export const delOperation = (data: any) => {
    return request({
        url: '/op-service/optssfl/delete',
        method: 'post',
        data,
    })
}
