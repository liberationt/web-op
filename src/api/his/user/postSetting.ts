/*
 * @Date: 2020-04-15 20:19:57
 * @LastEditTime: 2020-05-14 15:24:03
 * @Description:
 * @FilePath: \web-op\src\api\his\user\postSetting.ts
 */
// import axios from '@/utils/request.ts'
import request from '@/utils/request'

export interface Iitem{
    "groupCode"?: string
    "groupId"?: number | string,
    "groupName": string
    "btId": number|string
    "groupSeq": number | string,
    "homepageUrl": string,
    "hospitalId"?: number,
    "stopFlag"?: string,
    "uploadList": any[],
    "icon":string
}

/**
 * @description: 新增
 * @param {type}
 * @return:
 */
export const addSysgroup = (data: any) =>
    {
return request({
        url: "/system-service/sys/sysgroup/add",
        method: "post",
        data
    })
}
/**
 * @description: 修改停用/启用状态
 * @param {type}
 * @return:
 */
export const editEnable = (data: any) =>
    {
return request({
        url: "/system-service/sys/sysgroup/editEnable",
        method: "post",
        data
    })
}
/**
 * @description: 编辑
 * @param {type}
 * @return:
 */
export const editSysgroup = (data: any) =>
    {
return request({
        url: "/system-service/sys/sysgroup/edit",
        method: "post",
        data
    })
}
/**
 * @description: 按条件分页查询
 * @param {type}
 * @return:
 */
export const querySysgroupList = (data: any) =>
    {
return request({
        url: "/system-service/sys/sysgroup/queryPage",
        method: "post",
        data
    })
}
/**
 * @description: 按条件查询-返回唯一值
 * @param {type}
 * @return:
 */
export const getOneSysgroup = (data: any) =>
    {
return request({
        url: "/system-service/sys/sysgroup/getOneByEntity",
        method: "post",
        data
    })
}
/**
 * @description: 岗位关联用户数量
 * @param {type}
 * @return:
 */
export const findCountSysgroupList = (data: any) =>
    {
return request({
        url: "/system-service/sysusergroup/findCont",
        method: "post",
        data
    })
}


/**
 * @description: 删除
 * @param {type}
 * @return:
 */
export const deleteSysgroupList = (data: any) =>
    {
return request({
        url: "/system-service/sys/sysgroup/delete",
        method: "post",
        data
    })
}

    // 取排序最大值
export const getMaxSort = (data: any) => {
    return request({
      url: '/system-service/sys/sysgroup/getMaxSort',
      data,
      method: 'post',
    })
  }

// 岗位代码查重
export const checkGroupCode = (data: any) => {
    return request({
        url: '/system-service/sys/sysgroup/validGroupCode',
        data,
        method: 'post',
    })
}
