/*
 * @Date: 2020-08-16 17:17:50
 * @LastEditors: 董亮
 * @LastEditTime:
 * @description:  给药途径维护
 */

import request from '@/utils/request'

// 新增
export const addChannel = (data: any) => {
    return request({
        url: '/op-service/imdicypyf/add',
        method: 'post',
        data,
    })
}

// 删除
export const delChannel = (data: any) => {
    return request({
        url: '/op-service/imdicypyf/delete',
        method: 'post',
        data,
    })
}

// 修改
export const editChannel = (data: any) => {
    return request({
        url: '/op-service/imdicypyf/edit',
        method: 'post',
        data,
    })
}

// 获取附加项目数据
export const getfyxhData = (data: any) => {
    return request({
        url: '/op-service/addItems/queryChargeList',
        method: 'post',
        data,
    })
}

// 获取拼音码
export const getMnemonic = (data: any) => {
    return request({
        url: '/system-service/system/public/get/mnemonic',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}
