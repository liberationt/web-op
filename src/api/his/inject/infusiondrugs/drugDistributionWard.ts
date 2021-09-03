/*
 * @Author: 曹俊
 * @LastEditTime: 2020-09-08 17:31:55
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\inject\infusiondrugs\pharmacyConfiguratio.ts
 */
import request from '@/utils/request'

// 查询病区配置列表
export const queryList = (data: any) => {
    return request({
        url: `/op-service/inpatient/area/query/list?yfsb=${data.yfsb}`,
        method: 'post'
    })
}

// 保存发药病区设置
export const areaSave = (data: any) => {
    return request({
        url: `/op-service/inpatient/area/save`,
        method: 'post',
        data,
        headers:{
                "Content-Type": "application/json"
            }
    })
}
