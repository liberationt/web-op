/*
 * @Author: 曹俊
 * @LastEditTime: 2020-09-08 17:31:55
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\inject\infusiondrugs\pharmacyConfiguratio.ts
 */
import request from '@/utils/request'

// 查询未选择的给药途径列表
export const queryUnchecked = (data: any) => {
    return request({
        url: `/op-service/drug/usage/query/unchecked?yfsb=${data.yfsb}&value=${data.value}`,
        method: 'post',
    })
}

// 查询已选择的给药途径列表
export const queryChecked = (data: any) => {
    return request({
        url: `/op-service/drug/usage/query/checked?yfsb=${data.yfsb}&value=${data.value}`,
        method: 'post'
    })
}


// 添加给药途径
export const drugUsageAdd = (data: any) => {
    return request({
        url: `/op-service/drug/usage/add?yfsb=${data.yfsb}&ids=${data.ids}`,
        method: 'post'
    })
}


// 移除给药途径
export const drugUsageRemove = (data: any) => {
    return request({
        url: `/op-service/drug/usage/remove?yfsb=${data.yfsb}&ids=${data.ids}`,
        method: 'post'
    })
}
