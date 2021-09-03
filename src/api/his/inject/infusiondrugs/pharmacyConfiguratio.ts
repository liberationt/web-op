/*
 * @Author: 曹俊
 * @LastEditTime: 2020-09-08 17:31:55
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\inject\infusiondrugs\pharmacyConfiguratio.ts
 */
import request from '@/utils/request'

export interface Iforms {
    id: number | null
    yfsb: string| null
    scgz: string | null
    gzqz: string | null
    lshws?: number | null
    xylsh?: number | null
    zt?: number | null
}


// 查询静配所需字典
export const queryJpDict = (data: any) => {
    return request({
        url: `/op-service/venous/config/query/jp/dict`,
        method: 'post',
        data
    })
}


// 查询药房静配配置列表
export const queryList = (data: any) => {
    return request({
        url: `/op-service/venous/config/query/list`,
        method: 'post'
    })
}

// 新增/修改药房静配规则
export const configSave = (data: any) => {
    return request({
        url: `/op-service/venous/config/save`,
        method: 'post',
        data
    })
}

// 查询药房静配规则详情
export const configGet = (data: any) => {
    return request({
        url: `/op-service/venous/config/get`,
        method: 'post',
        data
    })
}

// 停用/启用药房静配设置
export const updateStatus = (data: any) => {
    return request({
        url: `/op-service/venous/config/update/status`,
        method: 'post',
        data
    })
}
