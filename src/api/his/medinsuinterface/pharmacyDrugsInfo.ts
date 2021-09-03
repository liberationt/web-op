/*
 * @Author: 曹俊
 * @LastEditTime: 2020-04-30 11:19:58
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\medinsuinterface\pharmacyDrugsInfo.ts
 */
import axios from '@/utils/request'

export interface Iobj{
    type?: number | null,
    yptym?: number | string,
    tbdm?: number | string,
    pageSize: number; // 列表条数
}

//药品品规基础信息
export const queryQualitySpecPage = (data: any) => {
    return axios.request({
        url: "/op-service/shybypjcxx/queryPage",
        data,
        method: "post"
    })
};

// 新增药品品规基础信息
export const addQualitySpec = (data: any) => {
    return axios.request({
        url: "/op-service/shybypjcxx/add",
        data,
        method: "post"
    })
};

// 编辑药品品规基础信息
export const editQualitySpec = (data: any) => {
    return axios.request({
        url: "/op-service/shybypjcxx/edit",
        data,
        method: "post"
    })
};

// 药品价格规则
export const queryPriceRulePage = (data: any) => {
    return axios.request({
        url: "/op-service/shybypjggz/queryPage",
        data,
        method: "post"
    })
};

// 新增药品价格规则
export const addPriceRule = (data: any) => {
    return axios.request({
        url: "/op-service/shybypjggz/add",
        data,
        method: "post"
    })
};

// 编辑药品价格规则
export const editPriceRule = (data: any) => {
    return axios.request({
        url: "/op-service/shybypjggz/edit",
        data,
        method: "post"
    })
};


// 药品采购规则
export const queryPurchasePage = (data: any) => {
    return axios.request({
        url: "/op-service/shybypcggz/queryPage",
        data,
        method: "post"
    })
};

// 新增药品采购规则
export const addPurchase = (data: any) => {
    return axios.request({
        url: "/op-service/shybypcggz/add",
        data,
        method: "post"
    })
};

// 编辑药品采购规则
export const editPurchase = (data: any) => {
    return axios.request({
        url: "/op-service/shybypcggz/edit",
        data,
        method: "post"
    })
};

// 药品配送企业
export const queryDeliveryPage = (data: any) => {
    return axios.request({
        url: "/op-service/shybyppsqy/queryPage",
        data,
        method: "post"
    })
};

// 新增药品配送企业
export const addDelivery = (data: any) => {
    return axios.request({
        url: "/op-service/shybyppsqy/add",
        data,
        method: "post"
    })
};

// 编辑药品配送企业
export const editDelivery = (data: any) => {
    return axios.request({
        url: "/op-service/shybyppsqy/edit",
        data,
        method: "post"
    })
};


// 药品医保可报销条件规则
export const queryDreimbursementPage = (data: any) => {
    return axios.request({
        url: "/op-service/shybybkbxgz/queryPage",
        data,
        method: "post"
    })
};

// 新增药品医保可报销条件规则
export const addReimbursement = (data: any) => {
    return axios.request({
        url: "/op-service/shybybkbxgz/add",
        data,
        method: "post"
    })
};

// 编辑药品医保可报销条件规则
export const editReimbursement = (data: any) => {
    return axios.request({
        url: "/op-service/shybybkbxgz/edit",
        data,
        method: "post"
    })
};

// 新增医保报销比例规则
export const addProportion = (data: any) => {
    return axios.request({
        url: "/op-service/shybybblgz/add",
        data,
        method: "post"
    })
};

// 编辑医保报销比例规则
export const editProportion = (data: any) => {
    return axios.request({
        url: "/op-service/shybybblgz/edit",
        data,
        method: "post"
    })
};

// 药品医保可报销条件规则
export const queryProportionPage = (data: any) => {
    return axios.request({
        url: "/op-service/shybybblgz/queryPage",
        data,
        method: "post"
    })
};

//add医保数据代码
export const addDataCode = (data: any) => {
    return axios.request({
        url: "/op-service/shybdata0202/unifiedAdd",
        data,
        method: "post"
    })
};

//edit医保数据代码
export const editDataCode = (data: any) => {
    return axios.request({
        url: "/op-service/shybdata0202/unifiedEdit",
        data,
        method: "post",
        headers: {
            "Content-Type": "application/json"
        }
    })
};

//修改医保数据代码列表状态
export const enableStatus = (data: any) => {
    return axios.request({
        url: "/op-service/shybdata0202/editStopFlag",
        data,
        method: "post"
    })
};

// 查询分页列表
export const queryPage = (data: any) => {
    return axios.request({
        url: "/op-service/shybdata0202/unifiedQueryPage",
        data,
        method: "post"
    })
};
