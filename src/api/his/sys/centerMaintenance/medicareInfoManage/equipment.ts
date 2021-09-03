/*
 * @Date: 2020-08-02 09:29:50
 * @LastEditors: 董亮
 * @LastEditTime:
 * @description:  检查检验设备维护
 */

import request from '@/utils/request'

// 检查检验设备维护新增或修改保存
export const saveInspection = (data: any) => {
    return request({
        url: '/op-service/opsbbh/saveOrUpdate',
        method: 'post',
        data,
    })
}

// 检查检验设备维护删除
export const delInspection = (data: any) => {
    return request({
        url: '/op-service/opsbbh/deleteById',
        method: 'post',
        data,
    })
}

// 检查检验设备生成未来30天号源/检查检验设备全部生成
export const generateSource = (data: any) => {
    return request({
        url: '/op-service/opsbbh/generateSbhy',
        method: 'post',
        data,
    })
}

// 查询单条设备记录
export const inquirySheet = (data: any) => {
    return request({
        url: '/op-service/opsbbh/getOneByEntity',
        method: 'post',
        data,
    })
}
