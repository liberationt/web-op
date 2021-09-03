/*
 * @Date: 2020-08-16 11:17:50
 * @LastEditors: 董亮
 * @LastEditTime:
 * @description:  疾病编码维护
 */

import request from '@/utils/request'

// 中医疾病编码树
export const diseaseChiTree = (data: any) => {
    return request({
        url: '/op-service/dicjbbm/tcmTree',
        method: 'post',
        data,
    })
}

// 列表查询
export const queryList = (data: any) => {
    return request({
        url: '/op-service/dicjbbm/tcmQueryPage',
        method: 'post',
        data,
    })
}

// 获取中医分类下拉列表
export const queryTypeList = (data: any) => {
    return request({
        url: '/op-service/dicjbbm/tcmDropList',
        method: 'post',
        data,
    })
}

// 新增
export const addNewCode = (data: any) => {
    return request({
        url: '/op-service/dicjbbm/tcmAdd',
        method: 'post',
        data,
    })
}

// 删除
export const deleteNewCode = (data: any) => {
    return request({
        url: '/op-service/dicjbbm/tcmDelete',
        method: 'post',
        data,
    })
}

// 编辑
export const editNewCode = (data: any) => {
    return request({
        url: '/op-service/dicjbbm/tcmEdit',
        method: 'post',
        data,
    })
}

// 中医疾病-添加关联-列表
export const queryRelaList = (data: any) => {
    return request({
        url: '/op-service/dicjbbm/queryZZList',
        method: 'post',
        data,
    })
}

// 中医疾病-添加关联-新增
export const addRelateNewCode = (data: any) => {
    return request({
        url: '/op-service/dicjbbm/zzadd',
        method: 'post',
        data,
    })
}

// 中医疾病-添加关联-删除
export const delRelateNewCode = (data: any) => {
    return request({
        url: '/op-service/dicjbbm/zzdelete',
        method: 'post',
        data,
    })
}

// 中医疾病-添加关联-修改
export const editRelateNewCode = (data: any) => {
    return request({
        url: '/op-service/dicjbbm/zzedit',
        method: 'post',
        data,
    })
}

// 中医证侯编码树
export const syndromTreeData = (data: any) => {
    return request({
        url: '/op-service/dicjbbm/zhTree',
        method: 'post',
        data,
    })
}

// 中医证侯-分页列表
export const syndromPageList = (data: any) => {
    return request({
        url: '/op-service/dicjbbm/zhQueryPage',
        method: 'post',
        data,
    })
}

// 中医证侯-新增
export const addSyndrom = (data: any) => {
    return request({
        url: '/op-service/dicjbbm/zhAdd',
        method: 'post',
        data,
    })
}

// 中医证侯-删除
export const delSyndrom = (data: any) => {
    return request({
        url: '/op-service/dicjbbm/zhDelete',
        method: 'post',
        data,
    })
}

// 中医证侯-修改
export const editSyndrom = (data: any) => {
    return request({
        url: '/op-service/dicjbbm/zhEdit',
        method: 'post',
        data,
    })
}

// 中医证侯-分类列表
export const geSyndromtList = (data: any) => {
    return request({
        url: '/op-service/dicjbbm/zhDropList',
        method: 'post',
        data,
    })
}

// 西医疾病新增
export const addWestDisease = (data: any) => {
    return request({
        url: '/op-service/dicjbbm/westAdd',
        method: 'post',
        data,
        // headers: {
        //     'Content-Type': 'application/json'
        // }
    })
}

// 西医疾病删除
export const delWestDisease = (data: any) => {
    return request({
        url: '/op-service/dicjbbm/westDelete',
        method: 'post',
        data,
    })
}

// 西医疾病修改
export const editWestDisease = (data: any) => {
    return request({
        url: '/op-service/dicjbbm/westEdit',
        method: 'post',
        data,
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

