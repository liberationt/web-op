
/*
 * @Date:
 * @LastEditors: dmj
 * @LastEditTime:
 * @description:  机构注册维护
 */

import request from '@/utils/request'

//查询机构医技分类树集合
export const getTreeData = (data: any) => {
    return request({
        url: '/op-service/dicyljg/queryList',
        method: 'post',
        data,
    })
}
//查询科室医技分类树集合
export const getDepartMentData = (data: any) => {
    return request({
        url: '/op-service/dickszd/queryList',
        method: 'post',
        data,
    })
}
// 机构维护新增
export const saveAddData = (data: any) => {
    return request({
        url: '/op-service/dicyljg/add',
        method: 'post',
        data,
    })
}
// 机构维护修改
export const saveEdit = (data: any) => {
    return request({
        url: '/op-service/dicyljg/edit',
        method: 'post',
        data,
    })
}

//机构维护停用
export const mechanismMentStop = (data: any) => {
    return request({
        url: '/op-service/dicyljg/stop',
        method: 'post',
        data,
    })
}

//科室维护编辑
export const departMentEdit = (data: any) => {
    return request({
        url: '/op-service/dickszd/edit',
        method: 'post',
        data,
        // headers:{
        //     "Content-type": "application/json"
        // }
    })
}
//科室维护新增
export const departMentAdd = (data: any) => {
    return request({
        url: '/op-service/dickszd/add',
        method: 'post',
        data,
        // headers:{
        //     "Content-type": "application/json"
        // }
    })
}
//科室维护停用
export const departMentStop = (data: any) => {
    return request({
        url: '/op-service/dickszd/stop',
        method: 'post',
        data,
    })
}

// 获取线下医保科室
export const queryYbks = (data: any) => {
    return request({
        url: '/op-service/dickszd/queryYbks',
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

