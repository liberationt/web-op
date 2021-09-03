/*
 * @Date: 2020-08-20 20:01:50
 * @LastEditors: 董亮
 * @LastEditTime:
 * @description:  付款方式维护
 */

import request from '@/utils/request'

// 新增
export const addFkfs = (data: any) => {
    return request({
        url: '/op-service/pubfkfs/add',
        method: 'post',
        data,
    })
}

// 作废/取消作废
export const delFkfs = (data: any) => {
    return request({
        url: '/op-service/pubfkfs/delete',
        method: 'post',
        data,
    })
}

// 编辑
export const editFkfs = (data: any) => {
    return request({
        url: '/op-service/pubfkfs/edit',
        method: 'post',
        data,
    })
}

// 设置货币误差
export const setHbwc = (data: any) => {
    return request({
        url: '/op-service/pubfkfs/setHbwc',
        method: 'post',
        data,
    })
}

// 设置默认标志
export const setMrbz = (data: any) => {
    return request({
        url: '/op-service/pubfkfs/setMrbz',
        method: 'post',
        data,
    })
}

// 获取付款类别数据
export const getFklb = (data: any) => {
    return request({
        url: '/op-service/pubfklb/queryPage',
        method: 'post',
        data,
    })
}
