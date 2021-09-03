/*
 * @Date: 2020-08-20 16:44:50
 * @LastEditors: 董亮
 * @LastEditTime:
 * @description:  付款类别维护
 */

import request from '@/utils/request'

// 新增
export const addFklb = (data: any) => {
    return request({
        url: '/op-service/pubfklb/add',
        method: 'post',
        data,
    })
}

// 删除
export const delFklb = (data: any) => {
    return request({
        url: '/op-service/pubfklb/delete',
        method: 'post',
        data,
    })
}

// 编辑
export const editFklb = (data: any) => {
    return request({
        url: '/op-service/pubfklb/edit',
        method: 'post',
        data,
    })
}

