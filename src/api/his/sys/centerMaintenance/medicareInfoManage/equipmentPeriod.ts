/*
 * @Date: 2020-08-03 10:47:50
 * @LastEditors: 董亮
 * @LastEditTime:
 * @description:  设备时段维护
 */

import request from '@/utils/request'

// 设备时段维护新增或修改保存
export const saveInspection = (data: any) => {
    return request({
        url: '/op-service/opsssd/saveOrUpdate',
        method: 'post',
        data,
    })
}

// 设备时段维护分页查询
export const searchInspection = (data: any) => {
    return request({
        url: '/op-service/opsssd/queryPage',
        method: 'post',
        data,
    })
}
