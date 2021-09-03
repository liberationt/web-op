/*
 * @Author: 曹俊
 * @LastEditTime: 2020-09-09 11:20:25
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\inject\infusiondrugs\drugDistribution.ts
 */
import request from '@/utils/request'

export interface Iforms {
    id: number | null
    yfsb: number | null
    pcmc?: string | null
    jssj: string | null
    kssj: string | null
    zt?: number | null
}

// 查询发药批次列表
export const queryList = (data: any) => {
    return request({
        url: `/op-service/batch/config/query/list?yfsb=${data}`,
        method: 'post'
    })
}

// 新增/修改发药批次设置
export const configSave = (data: any) => {
    return request({
        url: `/op-service/batch/config/save`,
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

// 删除静脉配置批次
export const configRemove = (data: any) => {
    return request({
        url: `/op-service/batch/config/remove`,
        method: 'post',
        data
    })
}

// 停用/启用药房静配设置
export const updateStatus = (data: any) => {
    return request({
        url: `/op-service/batch/config/update/status`,
        method: 'post',
        data
    })
}

// 查询药物类型
export const queryDrugType = (data: any) => {
    return request({
        url: `/op-service/batch/config/query/drug/type`,
        method: 'post',
        data
    })
}
