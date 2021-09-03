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
        url: `/op-service/print/label/query/ward/list`,
        method: 'post',
        data
    })
}

// 查询病人列表
export const queryPatient = (data: any) => {
    return request({
        url: `/op-service/packing/check/query/br/list`,
        method: 'post',
        data
    })
}

// 查询医嘱列表
export const queryYzList = (data: any) => {
    return request({
        url: `/op-service/packing/check/query/yz/list`,
        method: 'post',
        data
    })
}


// 打包
export const packing = (data: any) => {
    return request({
        url: `/op-service/packing/check/commit`,
        method: 'post',
        data
    })
}
