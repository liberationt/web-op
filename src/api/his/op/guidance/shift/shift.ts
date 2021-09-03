/*
 * @Author: 曹俊
 * @LastEditTime: 2020-09-09 13:33:47
 * @LastEditors: zhml
 * @Description:
 * @FilePath: \web-op\src\api\his\op\guidance\shift\shift.ts
 */
import axios from '@/utils/request.ts'

// 编辑班次上下班时间
export const editTime = (data: any) =>
    axios.request({
        url: "/op-service/opbcsj/edit",
        method: "post",
        data
    });


    // 班次列表
export const queryBcList = (data: any) =>
         axios.request({
           url: '/op-service/opbcsj/findList',
           method: 'post',
           data,
         })
