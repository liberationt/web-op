
/*
 * @Date:
 * @LastEditors: dmj
 * @LastEditTime:
 * @description:
 */

import request from '@/utils/request'

export const orderDeliveryQuery = (data: any) => {
    return request({
        url: '/op-service/mpipsxx/queryPage',
        method: 'post',
        data,
    })
}

export const getByIdDetail = (data: any) => {
    return request({
        url: '/op-service/mpipsxx/getById',
        method: 'post',
        data,
    })
}

export const edit = (data: any) => {
    return request({
        url: '/op-service/mpipsxx/edit',
        method: 'post',
        data,
    })
}

//黑名单


export const add = (data: any) => {
    return request({
        url: '/op-service/mpblacklist/add',
        method: 'post',
        data,
    })
}

export const backEdit = (data: any) => {
    return request({
        url: '/op-service/mpblacklist/edit',
        method: 'post',
        data,
    })
}

//解禁与禁用

export const disableOrLift = (data: any) => {
    return request({
        url: '/op-service/mpeasemobuser/disableOrLift',
        method: 'post',
        data,
    })
}

//新增

export const addHX = (data: any) => {
    return request({
        url: '/op-service/mpeasemobuser/add',
        method: 'post',
        data,
    })
}


//删除
export const deleteHX = (data: any) => {
    return request({
        url: '/op-service/mpeasemobuser/delete',
        method: 'post',
        data,
    })
}