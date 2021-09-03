/*
 * @Author: wangyao
 * @LastEditTime: 2020-08-19 09:29:03
 * @LastEditors: wangyao
 * @Description:备血申请
 * @FilePath: \web-op\src\api\his\im\residentDoctor\prepareBlood.ts
 */
import request from '@/utils/request'

// 新增保存备血申请
export const saveZySxSqd = (data: any) => {
    return request({
        url: '/op-service/cisbxsqd/saveZySxSqd',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// 查询备血申请
export const queryZySxSqdInfo = (data: any) => {
    return request({
        url: '/op-service/cisbxsqd/queryZySxSqdInfo',
        method: 'post',
        data
    })
}
