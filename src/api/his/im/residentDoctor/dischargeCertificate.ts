/*
 * @Author: wangyao
 * @LastEditTime: 2020-07-07 10:33:47
 * @LastEditors: wangyao
 * @Description:
 * @FilePath: \web-op\src\api\his\im\residentDoctor\dischargeCertificate.ts
 */
import request from '@/utils/request'

// 病区病人管理出院证保存或取消
export const saveLeaveHospitalProve = (data: any) => {
    return request({
        url: '/op-service/imhzrybydctwork/saveLeaveHospitalProve',
        method: 'post',
        data
    })
}
// 病区病人管理计算住院天数
export const loadDischargeDays = (data: any) => {
    return request({
        url: '/op-service/imhzrybydctwork/loadDischargeDays',
        method: 'post',
        data
    })
}
// 查询出院证病人信息
export const loadLeaveHospitalInfo = (data: any) => {
    return request({
        url: '/op-service/imhzrybydctwork/loadLeaveHospitalInfo',
        method: 'post',
        data
    })
}
