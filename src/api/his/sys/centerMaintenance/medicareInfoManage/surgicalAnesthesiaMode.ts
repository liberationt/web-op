/*
 * @Date: 2020-08-03 14:35:50
 * @LastEditors: 董亮
 * @LastEditTime:
 * @description:  手术麻醉方式维护
 */

import request from '@/utils/request'

// 手术麻醉方式维护新增或修改保存
export const surgicalAnesthesia = (data: any) => {
    return request({
        url: '/op-service/optmzfs/saveOrUpdate',
        method: 'post',
        data,
    })
}

// 手术麻醉方式维护删除
export const delSurgicalAnesthesia = (data: any) => {
    return request({
        url: '/op-service/optmzfs/deleteById',
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
