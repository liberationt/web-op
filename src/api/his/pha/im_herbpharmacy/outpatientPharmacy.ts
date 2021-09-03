/*
 * @Date: 2020-05-21 10:11:15
 * @LastEditors: 曹俊
 * @LastEditTime: 2020-09-03 20:29:19
 * @description:
 */
import request from '@/utils/request'

// 药房字典查询
export const queryYf = (data: any) => {
    return request({
        url: `/op-service/pharmacy/public/yf/dict?jgid=${data}`,
        method: 'post'
    })
}


// 药房列表查询
export const searchPha = (data: any) => {
    return request({
        url: '/pharmacy/install/do/query/list',
        method: 'post',
        data
    })
}

// 新增、修改、保存
export const addPha = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/do/save',
        method: 'post',
        data,
        // headers: {
        //     "Content-Type": "application/json"
        // }
    })
}

// 注销药房
export const cancellation = (data: number) => {
    return request({
        url: `/op-service/pharmacy/install/do/cancellation?yfsb=` + data,
        method: 'post'
    })
}

// 判断新增时药房名称是否重复
export const isExist = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/do/check/yfmc',
        method: 'post',
        data,
        headers: {
          "Res-Type": "special"
        }
    })
}


// 新增、保存、修改药房窗口
export const addPhaWin = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/window/save',
        method: 'post',
        data
    })
}

// 停用/启用发药窗口
export const stopDispenWin = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/window/change/status',
        method: 'post',
        data
    })
}

// 检查药房窗口编号是否重复
export const isRepetitionWin = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/window/check/repeat',
        method: 'post',
        data
    })
}

// 删除发药窗口
export const delDispenWin = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/window/delete',
        method: 'post',
        data
    })
}

// 药房窗口列表查询
export const searchWinList = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/window/list',
        method: 'post',
        data
    })
}

// 获取药房所对应的领用方式数据
export const phaReceiveStyle = (id: number) => {
    return request({
        url: `/op-service/pharmacy/install/do/yk/receive?yfsb=` + id,
        method: 'post',
    })
}

// 查询领用方式
export const receiveStyle = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/query/receive',
        method: 'post',
        data
    })
}

// 领药方式保存
export const receiveStyleSave = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/do/save/receive',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// 检查是否可选择领药方式
export const isSelectDispen = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/check/receive',
        method: 'post',
        data,
        headers: {
            'Res-Type': 'special'
        }
    })
}

// 重置药库领药方式
export const reSetGetmedicine = (data: any) => {
    return request({
        url: '/op-service/pharmacy/install/do/reset/yk/receive',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// 查询药房详情
export const getDetail = (id: number) => {
    return request({
        url: '/op-service/pharmacy/install/do/get?yfsb=' + id,
        method: 'post',
        // headers: {
        //     "Content-Type": "application/json"
        // }
    })
}
