/*
 * @Author: wangyao
 * @LastEditTime: 2020-08-27 20:32:04
 * @LastEditors: wangyao
 * @Description:
 * @FilePath: \web-op\src\api\his\im\residentDoctor\drugItemHelper.ts
 */
import request from '@/utils/request'

// 查询药品医嘱组套
export const queryMedicalStack = (data: any) => {
    return request({
        url: '/op-service/opzt01/queryMedicalStack',
        method: 'post',
        data
    })
}

// 药品助手调入全部或常用药
export const loadMedicineInfo = (data: any) => {
    return request({
        url: '/op-service/cishzyz/loadMedicineInfo',
        method: 'post',
        data
    })
}
// 药品医嘱组套调入
export const loadAdviceSet = (data: any) => {
    return request({
        url: '/op-service/cishzyz/loadAdviceSet',
        method: 'post',
        data
    })
}
// 常用项目调入
export const loadClinicInfo = (data: any) => {
    return request({
        url: '/op-service/cishzyz/loadClinicInfo',
        method: 'post',
        data
    })
}

// 查询过敏药物
export const loadDetailsInfo = (data: any) => {
    return request({
        url: '/op-service/imhzrybydctwork/loadDetailsInfo',
        method: 'post',
        data
    })
}
// 项目组套调入
export const findPageByZtbhXm = (data: any) => {
    return request({
        url: '/op-service/opzt02/findListByZtbhXm',
        method: 'post',
        data
    })
}

// 项目组套调入保存
export const saveWarDisposalSet = (data: any) => {
    return request({
        url: '/op-service/cishzyz/saveWarDisposalSet',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}
// 项目组套全部调入查询
export const loadFromPersonalSet = (data: any) => {
    return request({
        url: '/op-service/cishzyz/loadFromPersonalSet',
        method: 'post',
        data
    })
}
// 项目组套多条调入后查询
export const loadFromUSLTPersonalSet = (data: any) => {
    return request({
        url: '/op-service/cishzyz/loadFromUSLTPersonalSet',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}
// 药品组套校验库存
export const checkYpZtKc = (data: any) => {
    return request({
        url: '/op-service/cishzyz/checkYpZtKc',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}
// 按组套编号-返回列表(项目)
export const findListByZtbhXm = (data: any) => {
    return request({
        url: '/op-service/opzt02/findListByZtbhXm',
        method: 'post',
        data
    })
}
// 按条件分页查询
export const queryPage = (data: any) => {
    return request({
        url: '/op-service/opzt01/queryPage',
        method: 'post',
        data
    })
}