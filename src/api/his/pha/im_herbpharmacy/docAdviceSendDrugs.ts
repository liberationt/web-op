/*
 * @Date: 2020-07-10 09:57:32
 * @LastEditors: 曹俊
 * @LastEditTime: 2020-07-25 14:44:50
 * @description: 医嘱发药
 */

import request from '@/utils/request'

// 查询药房是否已经维护领药科室
export const lyksExists = (data: any) => {
    return request({
        url: '/op-service/pharmacy/public/query/lyks/exists',
        method: 'post',
        data
    })
}

// queryDispensingWard-病区待发药记录查询
export const queryDispensingWard = (data: any) => {
    return request({
        url: '/op-service/doctor/advice/query',
        method: 'post',
        data
    })
}

// 待发药提交单查询
export const queryTjd = (data: any) => {
    return request({
        url: '/op-service/doctor/advice/query/tjd',
        method: 'post',
        data
    })
}

// 待发药病人查询
export const queryPatient = (data: any) => {
    return request({
        url: '/op-service/doctor/advice/query/br',
        method: 'post',
        data
    })
}

// queryDispensing-发药药品明细查询
export const queryDrugDetail = (data: any) => {
    return request({
        url: '/op-service/doctor/advice/query/detail',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// saveHospitalPharmacyDispensing-医嘱发药
export const adviceDispensing = (data: any) => {
    return request({
        url: '/op-service/doctor/advice/grant/drug',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// 医嘱退回
export const saveMedicineRefund = (data: any) => {
    return request({
        url: '/op-service/doctor/advice/back',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// 医嘱发药全退
export const adviceBackFull = (data: any) => {
    return request({
        url: '/op-service/doctor/advice/back/full',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

