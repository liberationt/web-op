/*
 * @Date: 2020-07-30 13:17:50
 * @LastEditors: 董亮
 * @LastEditTime:
 * @description:  系统参数配置
 */

import request from '@/utils/request'

// 删除系统参数
export const delSystem = (data: any) => {
    return request({
        url: '/system-service/systemParameter/delete',
        method: 'post',
        data,
    })
}

// 查询单条系统参数
export const searchSingle = (data: any) => {
    return request({
        url: '/system-service/systemParameter/getOneByEntity',
        method: 'post',
        data,
    })
}

// 系统参数新增修改
export const saveSystem = (data: any) => {
    return request({
        url: '/system-service/systemParameter/xtcsSaveOrUpdate',
        method: 'post',
        data,
    })
}
