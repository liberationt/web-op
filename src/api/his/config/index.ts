/*
 * @Author: 曹俊
 * @LastEditTime: 2020-06-22 19:00:29
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\config\index.ts
 */
import axios from '@/utils/request.ts'
export interface Iitem{
    "zhName": string,  // 自定义名称(中文)
    "enName": string,  // 自定义名称（英文）
}
export interface Iobject {
    enName?: string,  // 自定义名称（英文）
    zhName?: string  // 自定义名称（英文）
}
// 所有表信息
export const getAlltabel = (data: any) =>
    axios.request({
        url: "/design/tabledef/getAlltabel",
        method: "post",
        data
    });

// 单表获取表所有列
export const getAllColumn = (data: any) =>
    axios.request({
        url: "/design/columndef/getAllColumn",
        method: "post",
        data
    });

// 多表获取表所有列
export const getTablesColumn = (data: any) =>
    axios.request({
        url: `/design/columndef/getTablesColumn`,
        method: "post",
        data,
        headers: {
			"Content-Type": "application/json"
		}
    });
// 新增
export const addDesignQuery = (data: any) =>
    axios.request({
        url: `/design/designquery/add`,
        method: "post",
        data,
        headers: {
            "Content-Type": "application/json"
        }
    });
// 编辑
export const editDesignQuery = (data: any) =>
    axios.request({
        url: `/design/designquery/edit`,
        method: "post",
        data,
        headers: {
            "Content-Type": "application/json"
        }
    });
// 得到sql
export const getSql = (data: any) =>
    axios.request({
        url: `/design/designquery/getsql`,
        method: "post",
        data,
        headers: {
            "Content-Type": "application/json"
        }
    });
// 删除sql配置
export const deleteSql = (id: any) =>
    axios.request({
        url: `/design/designquery/delete?queryId=${id}`,
        method: "post",
    });

// 发布
export const publishSql = (id: any) =>
axios.request({
    url: `/design/designquerypublish/publish?queryId=${id}`,
    method: "post",
});

// 刷新sc缓存
export const refreshSql = () =>
axios.request({
    url: `/op-service/sql/refresh`,
    method: "post",
});
// 启用
export const updateStart = (id: any) =>
axios.request({
    url: `/design/designquery/updateStart?queryId=${id}`,
    method: "post",
});

// 停用
export const updateStop = (id: any) =>
axios.request({
    url: `/design/designquery/updateStop?queryId=${id}`,
    method: "post",
});

// 根据queryId获取setting.vue数据
export const getOneById = (id: any) =>
axios.request({
    url: `/design/designquery/getOneById?queryId=${id}`,
    method: "post",
});


