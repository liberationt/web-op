/*
 * @Date: 2020-06-22 20:50:15
 * @LastEditors: 曹俊
 * @LastEditTime: 2020-08-31 09:17:17
 * @description: 出入库方式维护
 */

import request from '@/utils/request'

// 新增、修改入库方式
export const saveInPha = (data: any) => {
    return request({
        url: '/op-service/inout/management/in/save',
        method: 'post',
        data
    })
}

// 新增、修改出库方式
export const saveOutPha = (data: any) => {
    return request({
        url: '/op-service/inout/management/out/save',
        method: 'post',
        data
    })
}

// 删除入库方式
export const deleteInStyle = (data: any) => {
    return request({
        url: '/op-service/inout/management/in/delete',
        method: 'post',
        data
    })
}

// 删除出库方式
export const deleteOutStyle = (data: any) => {
    return request({
        url: '/op-service/inout/management/out/delete',
        method: 'post',
        data
    })
}


// 检查出入库方式是否重复
export const isRepet = (data: any) => {
    return request({
        url: '/op-service/inout/management/check/repeat/inspection',
        method: 'post',
        data,
        headers: {
          'Res-Type': 'special'
        }
    })
}

// 删除前验证（出入库方式）是否被使用
export const isUsing = (data: any) => {
    return request({
        url: '/op-service/inout/management/do/verified/using',
        method: 'post',
        data
    })
}

// 获取拼音码
export const getMnemonic = (data: any) => {
    return request({
        url: '/system-service/system/public/get/mnemonic',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// 通过simpleLoad获取修改数据
export const getDatas = (data: any) => {
    return request({
        url: '/op-service/quecxfb/getByOneEntity',
        method: 'post',
        data,
        // headers: {
        //     "Content-Type": "application/json"
        // }
    })
}

// 查询出库、入库方式排序号
export const getPxh = (data: any) => {
    return request({
        url: `/op-service/inout/management/get/next/pxh?type=${data.type}&yfsb=${data.yfsb}`,
        method: 'post'
    })
}
