/*
 * @Author: wangyao
 * @LastEditTime: 2020-06-16 16:14:31
 * @LastEditors: wangyao
 * @Description:
 * @FilePath: \web-op\src\api\his\im\ims\billManage.ts
 */
import axios from '@/utils/request.ts'

// 新增发票号码维护信息
export const imygpjAdd = (data: any) =>
    axios.request({
        url: "/op-service/imygpj/add",
        method: "post",
        data
    });

// 编辑发票号码维护信息
export const imygpjEdit = (data: any) =>
    axios.request({
        url: "/op-service/imygpj/edit",
        method: "post",
        data
    });

// 删除发票号码维护信息
export const imygpjDel = (data: any) =>
    axios.request({
        url: "/op-service/imygpj/delete",
        method: "post",
        data
    });

// 获取当前岗位的所有用户
export const findGroupUserDic = (data: any) =>
    axios.request({
        url: "/system-service/sysuser/findGroupUserDic",
        method: "post",
        data // groupId
    });
