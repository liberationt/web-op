/*
 * @Author: wangyao
 * @LastEditTime: 2020-07-26 09:23:04
 * @LastEditors: wangyao
 * @Description:药品医嘱提交
 * @FilePath: \web-op\src\api\his\im\residentDoctor\drugOrderSubmit.ts
 */
import request from '@/utils/request'

// 病人列表获取
export const getDoctorAdviceBrQuery = (data: any) => {
    return request({
        url: '/op-service/cishzyz/getDoctorAdviceBrQuery',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}
// 药品退回确认
export const sssThqr = (data: any) => {
    return request({
        url: '/op-service/cishzyz/sssThqr',
        method: 'post',
        data
    })
}
