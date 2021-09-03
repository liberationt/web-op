import request from '@/utils/request'
// 未确定入库的搜索字段
export interface Isearch {
    yfsb: number| null
    ckfs: string | null
    type: string | null
    start?: string | null
    end?: string | null
}
export interface Iobject {
    yksb: number| null
    yfsb: number | null
    type: string | null
    lyrqBegin: string | null
    lyrqEnd: string | null
}

export interface Iform {
    ckfs: string| null
    cksj: string | null
    ckbz: string | null
    czgh: number | null
    ckks: string | null
}

// 计算
export const calc = (data: any) => {
    return request({
        url: `/op-service/pharmacy/public/calc/money`,
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// initDateQuery-页面查询条件里面的默认财务月份
export const initDateQuery = (data: any) => {
    return request({
        url: `/op-service/pharmacy/public/get/default/month?yfsb=${data}`,
        method: 'post'
    })
}

// dateQuery-入库和出库的条件中的出入库日期范围查询
export const dateQuery = (data: any) => {
    return request({
        url: `/op-service/pharmacy/public/date/query`,
        method: 'post',
        data
    })
}

// 出入库方式字典查询
export const inoutWay = (data: any) => {
    return request({
        url: '/op-service/pharmacy/public/inout/way',
        method: 'post',
        data
    })
}

// removeCheckOutData-删除出库单
export const removeApply = (data: any) => {
    return request({
        url: '/op-service/drug/out/store/remove',
        method: 'post',
        data
    })
}

// verificationCheckOutDelete-校验出库单是否存在
export const verifyIsExists = (data: any) => {
    return request({
        url: '/op-service/drug/out/store/verify/is/exists',
        method: 'post',
        data
    })
}

// queryKcslYfyk-药品申领查询药库库存
export const getYfyk = (data: any) => {
    return request({
        url: '/op-service/medicines/apply/get/kcsl/yfyk',
        method: 'post',
        data
    })
}

// updateApplyData-领药单提交
export const updateApplyData = (data: any) => {
    return request({
        url: '/op-service/medicines/apply/update/apply/data',
        method: 'post',
        data
    })
}

// saveCheckOut-保存出库记录
export const saveApply = (data: any) => {
    return request({
        url: '/op-service/drug/out/store/save',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// 出库单查询
export const queryDetail= (data: any) => {
    return request({
        url: '/op-service/drug/out/store/query/detail',
        method: 'post',
        data
    })
}

// queryCheckOutToInventory-药品出库明细数据查询
export const queryDrug= (data: any) => {
    return request({
        url: '/op-service/drug/out/store/query/drug/detail',
        method: 'post',
        data
    })
}

// saveCheckOutToInventory-出库单提交
export const applyCommit = (data: any) => {
    return request({
        url: '/op-service/drug/out/store/commit',
        method: 'post',
        data,
        headers: {
            "Res-Type": "special"
        }
    })
}
