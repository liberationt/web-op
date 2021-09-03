/*
 * @Author: 曹俊
 * @LastEditTime: 2020-09-08 17:31:55
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\inject\infusiondrugs\pharmacyConfiguratio.ts
 */
import request from '@/utils/request'


// 查询医嘱详情
export const queryYzDetail = (data: any) => {
    return request({
        url: `/op-service/trace/back/query/yz/detail`,
        method: 'post',
        data
    })
}

// 查询静脉配置环境详情
export const queryLog = (data: any) => {
    return request({
        url: `/op-service/trace/back/query/operator/log`,
        method: 'post',
        data
    })
}

