/*
 * @Author: wangyao
 * @LastEditTime: 2020-08-31 14:40:21
 * @LastEditors: wangyao
 * @Description:
 * @FilePath: \web-op\src\api\his\im\residentDoctor\consultation.ts
 */
import request from '@/utils/request'

// 新增保存会诊申请
export const saveorupdate = (data: any) => {
    return request({
        url: '/op-service/ciszyhzsq/saveorupdate',
        method: 'post',
        data
    })
}
// 查询会诊申请详细信息
export const loadInfo = (data: any) => {
    return request({
        url: '/op-service/ciszyhzsq/loadInfo',
        method: 'post',
        data
    })
}
//  修改保存会诊申请
export const updateYsZyHzsq = (data: any) => {
    return request({
        url: '/op-service/ciszyhzsq/updateCisZyHzsq',
        method: 'post',
        data
    })
}
//  提交会诊申请
export const submitYsZyHzsq = (data: any) => {
    return request({
        url: '/op-service/ciszyhzsq/submitCisZyHzsq',
        method: 'post',
        data
    })
}
//  删除会诊申请
export const removeYsZyHzsq = (data: any) => {
    return request({
        url: '/op-service/ciszyhzsq/removeCisZyHzsq',
        method: 'post',
        data
    })
}
//  退回会诊申请
export const backYsZyHzsq = (data: any) => {
    return request({
        url: '/op-service/ciszyhzsq/backCisZyHzsq',
        method: 'post',
        data
    })
}
//  结束会诊申请
export const stopYsZyHzsq = (data: any) => {
    return request({
        url: '/op-service/ciszyhzsq/stopCisZyHzsq',
        method: 'post',
        data
    })
}
//  根据拟邀会诊科室查询拟邀会诊医生
export const queryYqysByKs = (data: any) => {
    return request({
        url: '/op-service/ciszyhzsq/queryYqysByKs',
        method: 'post',
        data
    })
}
//  会诊意见确认保存
export const commitYsZyHzyj = (data: any) => {
    return request({
        url: '/op-service/ciszyhzsq/commitCisZyHzyj',
        method: 'post',
        data
    })
}
//  查询会诊申请意见
export const queryYsZyHzyj = (data: any) => {
    return request({
        url: '/op-service/ciszyhzsq/queryCisZyHzyj',
        method: 'post',
        data
    })
}
