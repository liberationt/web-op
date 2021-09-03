/*
 * @Author: 曹俊
 * @LastEditTime: 2020-09-08 17:31:55
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\inject\infusiondrugs\pharmacyConfiguratio.ts
 */
import request from '@/utils/request'

// 查询待审方病人列表
export const queryWard = (data: any) => {
    return request({
        url: `/op-service/check/prescription/query/ward?yfsb=${data.yfsb}`,
        method: 'post'
    })
}

// 查询待审方病人列表
export const queryDsList = (data: any) => {
    return request({
        url: `/op-service/check/prescription/query/br/list?yfsb=${data.yfsb}&bqdm=${data.bqdm}`,
        method: 'post',
        headers: {
            'Res-Type': 'special'
        }
    })
}

// 待审方病人列表
export const checkList = (data: any) => {
    return request({
        url: `/op-service/check/prescription/query/yz/list?yfsb=${data.yfsb}&zyh=${data.zyh}`,
        method: 'post'
    })
}

// 审方通过
export const approvedYz = (data: any) => {
    return request({
        url: `/op-service/check/prescription/approved/yz?yfsb=${data.yfsb}&yzxh=${data.yzxh}`,
        method: 'post'
    })
}

// 查询已审医嘱列表
export const queryYsList = (data: any) => {
    return request({
        url: `/op-service/check/prescription/query/approved/yz`,
        method: 'post',
        data,
        headers: {
            'Res-Type': 'special'
        }
    })
}
