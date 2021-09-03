/*
 * @Author: 董亮
 * @LastEditTime: 2020-09-27 10:20:50
 * @LastEditors: 董亮
 * @Description:
 * @FilePath:
 */
import request from '@/utils/request'


// 检索
export const retrieval = (data: any) => {
    return request({
        url: '/op-service/shybdz/czdbsbb',
        method: 'post',
        data
    })
}

// 上报
export const reporting = (data: any) => {
    return request({
        url: '/op-service/shybdz/czdbsbbdc',
        method: 'post',
        data
    })
}
