/*
 * @Author: 曹俊
 * @LastEditTime: 2020-09-08 17:31:55
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\inject\infusiondrugs\pharmacyConfiguratio.ts
 */
import request from '@/utils/request'

// 查询发药批次列表
export const queryBatch = (data: any) => {
    return request({
        url: `/op-service/batch/config/query/list`,
        method: 'post',
        data
    })
}

// 查询病区配置列表
export const queryWard = (data: any) => {
    return request({
        url: `/op-service/repeat/print/label/query/ward/list`,
        method: 'post',
        data
    })
}

// 查询病人列表
export const queryPatient = (data: any) => {
    return request({
        url: `/op-service/repeat/packing/check/query/br/list`,
        method: 'post',
        data
    })
}

// 打包
export const packing = (data: any) => {
    return request({
        url: `/op-service/repeat/packing/check/`,
        method: 'post',
        data
    })
}
