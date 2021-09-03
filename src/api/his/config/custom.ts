/*
 * @Author: 曹俊
 * @LastEditTime: 2020-06-14 20:27:47
 * @LastEditors: 曹俊
 * @Description: 
 * @FilePath: \web-op\src\api\his\config\custom.ts
 */ 
import axios from '@/utils/request.ts'
export interface Iitem{
    "zhName": string,  // 自定义名称(中文)
    "enName": string,  // 自定义名称（英文）
}
export interface Iobject{
   
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
    url: `/design//designquerypublish/publish?queryId=${id}`, 
    method: "post",
});
