/*
 * @Author: wangyao
 * @LastEditTime: 2020-09-04 13:23:28
 * @LastEditors: wangyao
 * @Description:
 * @FilePath: \web-op\src\api\his\im\residentDoctor\tipsQuery.ts
 */
import request from '@/utils/request'

// 查询符合条件空的床位号
export const queryCwInfo = (data: any) => {
    return request({
        url: '/op-service/imzkjl/queryCwInfo',
        method: 'post',
        data
    })
}

// 提醒查询转入确定
export const savecwglZccl = (data: any) => {
    return request({
        url: '/op-service/imzkjl/savecwglZccl',
        method: 'post',
        data
    })
}
// 转入确认查询床号是否存在病人
export const queryIsExistPatient = (data: any) => {
    return request({
        url: '/op-service/imzkjl/queryIsExistPatient',
        method: 'post',
        data
    })
}

// 查询病人列表 (医嘱本打印)
export const queryMedicalBookInfo = (data: any) => {
    return request({
        url: '/op-service/cisHzyzOrderBook/queryMedicalBookInfo',
        method: 'post',
        data,
        // headers: {
        //     "Content-Type": "application/json"
        // }
    })
}
