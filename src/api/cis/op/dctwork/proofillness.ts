/*
 * @Date:
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-21 09:51:44
 * @description:
 */


import request from '@/utils/request'

export interface Iobject {
    bqid: number | null,
    brxb: number | null,
    brxm: string | null,
    brzd: string | null,
    bz: string | null,
    cardno: string | null,
    jssj: string | null,
    jssxw: number | null,
    jzks: number | null,
    jzrq: string | null,
    jzys: string | null,
    kssj: string | null,
    kssxw: number | null,
    lx: number | null,
    mzhm: string | null,
    sfzh: string | null,
    xxts: string | null,
    zyhm: string | null,
    pageNum: 1,
    pageSize: 20
}
// 保存病情证明
export const saveDiseaseProof = (data: any) => {
    return request({
        url: '/op-service/opbqzm/saveDiseaseProof',
        method: 'post',
        data,
    })
}
// 删除病情证明
export const deleteById = (data: any) => {
    return request({
        url: '/op-service/opbqzm/deleteByBqid',
        method: 'post',
        data,
    })
}

// 病情证明单打印
export const getBqzmPrintData = (data: any) => {
    return request({
        url: '/op-service/opbqzm/getBqzmPrintData',
        method: 'post',
        data,
    })
}

// 删除疾病证明
export const deleteDisease = (data: any) => {
    return request({
        url: '/op-service/cisjbzm/deleteByBqid',
        method: 'post',
        data,
    })
}

// 保存疾病证明
export const saveDisease = (data: any) => {
    return request({
        url: '/op-service/cisjbzm/addOrUpdateOpJbzm',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
// 疾病证明单打印 
export const getJbzmPrintData = (data: any) => {
    return request({
        url: '/op-service/cisjbzm/getJbzmPrintData',
        method: 'post',
        data,
    })
}
// 查询打印logo
export const queryLogo = (data: any) => {
    return request({
        url: '/system-service/dicyljg/logo',
        method: 'post',
        data,
    })
}
// 测试打印logo
export const testReport = (data: any) => {
    return request({
        url: '/op-service/opyjcf01/testReport',
        method: 'post',
        data,
    })
}