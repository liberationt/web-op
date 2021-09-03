/*
 * @Date: 2020-07-31 14:39:50
 * @LastEditors: 董亮
 * @LastEditTime:
 * @description:  客户端系统参数配置
 */

import request from '@/utils/request'

// 删除客户端系统参数配置
export const delClientSystem = (data: any) => {
    return request({
        url: '/system-service/clientSystemParameter/delete',
        method: 'post',
        data,
    })
}

// 查询单条客户端系统参数配置
export const searchClientSystem = (data: any) => {
    return request({
        url: '/system-service/clientSystemParameter/getOneByEntity',
        method: 'post',
        data,
    })
}

// 新增修改客户端系统参数配置
export const saveClientSystem = (data: any) => {
    return request({
        url: '/system-service/clientSystemParameter/jqdcsSaveOrUpdate',
        method: 'post',
        data,
    })
}
