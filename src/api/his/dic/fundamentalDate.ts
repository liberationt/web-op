/*
 * @Date: 2020-04-28 20:05:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-04-29 16:41:43
 * @description:
 */
import request from '@/utils/request'

export interface Iitem{
    "dataVersion": number,  // 数据版本
    "flagDataName": string,  // 标识数据名称
    "flagDataId": number,  // 字典主记录唯一标识
    "flagDataCode": string,  // 标识数据代码
    "gmtCreate": string,  // 数据创建时间
    "gmtModify": string,  // 数据修改时间
    "hospitalId": number,  // 医疗机构ID
    "pyCode": string,  // 拼音码
    "rangeCode": string,  // 值域代码
    "wbCode": string,   // 五笔码
}
export interface Iitems{
    "sortType": string,
    "flagDataValueId": number,  // 字典从记录唯一标识
    "gmtCreate": string,  // 数据创建时间
    "gmtModify": string,  // 数据修改时间
    "hospitalId": number,  // 医疗机构ID
    "flagDataId": number,  // 字典主记录唯一标识
    "serialNumber": number,  // 序号
    "flagDataValue": string,  // 字典编码
    "flagDataValueRemark": string,  // 字典名称
    "parentFlagdatavalueId": number,
    "pyCode": string // 拼音码
    "wbCode": string //	五笔码
    "stopFlag": string // 停用标识 0：启用； 1：停用； SysFlagDataValue：11
}
export interface IParameters{
    primaryDataCode: string,   // 标准数据代码
    primaryDataName: string,  // 标准数据名称
    primarydataId: number,  // 标准数据ID
}
export interface IParameter {
    dataValue: string,  // 编码
    dataValueRemark: string,  // 名称
    datavalueId: number,  // 数据值ID
    serialNumber: number,  // 序号
}
// 新增主字典岗位
export const addzNewDic = (data: any) => {
    return request({
        url: '/system-service/sys/sysflagdata/add',
        method: 'post',
        data
    })
}

// 获取主字典数据信息
export const getzNewDic = (data: any) => {
    return request({
        url: '/system-service/sys/sysflagdata/getNewData',
        method: 'post',
        data
    })
}

// 标识数据主字典
export const getzAllDicNewDic = (data: any) => {
    return request({
        url: '/system-service/sys/sysflagdata/getAllDic',
        method: 'post',
        data
    })
}

// 字典主记录分页条件查询
export const queryzNewDic = (data: any) => {
    return request({
        url: '/system-service/sys/sysflagdata/queryPage',
        method: 'post',
        data
    })
}

// 新增字典从记录
export const addfNewDic = (data: any) => {
    return request({
        url: '/system-service/sys/sysflagdatavalue/add',
        method: 'post',
        data
    })
}

// 字典从记录修改
export const editfNewDic = (data: any) => {
    return request({
        url: '/system-service/sys/sysflagdatavalue/edit',
        method: 'post',
        data
    })
}

// 字典从记录启用/停用
export const enableMenu = (data: any) => {
    return request({
        url: '/system-service/sys/sysflagdatavalue/editEnable',
        method: 'post',
        data
    })
}

// 医院字典数据添加
export const addHospitalDic = (data: any) => {
    return request({
        url: '/system-service/sys/dicgbsj01/add',
        method: 'post',
        data
    })
}

// 医院字典数据删除
export const deleteHospitalDic = (id: number) => {
    return request({
        url: '/system-service/sys/dicgbsj01/delete/' + id,
        method: 'post',
    })
}

// 医院字典数据编辑
export const editHospitalDic = (data: any) => {
    return request({
        url: '/system-service/sys/dicgbsj01/edit',
        method: 'post',
        data
    })
}

// 获取医院字典详情内容
export const getHospitalDetail = (id: number) => {
    return request({
        url: '/system-service/sys/dicgbsj02/detail/' + id,
        method: 'post'
    })
}

// 编辑医院字典项详情内容
export const editHospitalDetail = (data: any) => {
    return request({
        url: '/system-service/sys/dicgbsj02/edit',
        method: 'post',
        data
    })
}
// 启用医院字典项
export const startHospitalDetail = (id: number) => {
    return request({
        url: '/system-service/sys/dicgbsj02/open/' + id,
        method: 'post'
    })
}
// 停用医院字典项
export const stopHospitalDetail = (id: number) => {
    return request({
        url: '/system-service/sys/dicgbsj02/stop/' + id,
        method: 'post'
    })
}

// 获取医院项的分页信息
export const getHospitalPage = (data: any) => {
    return request({
        url: '/system-service/sys/dicgbsj02/page',
        method: 'post',
        data
    })
}
// 新增医院项的子级
export const addHospitalChild = (data: any) => {
    return request({
        url: '/system-service/sys/dicgbsj02/add',
        method: 'post',
        data
    })
}
// 新增医院项的子级
export const searchHospitalById = (id: any) => {
    return request({
        url: '/system-service/sys/dicgbsj02/queryChild/' + id,
        method: 'post'
    })
}
//新增sql字典
export const addSqlDict = (data:any) => {
    return request({
        url:'/system-service/sysdictconfig/add',
        method: 'post',
        data
    })
}
//修改sql字典
export const editSqlDict = (data:any) => {
    return request({
        url: '/system-service/sysdictconfig/edit',
        method: 'post',
        data
    })
}
//启用sql字典
export const enableSqlDict = (data:any) => {
    return request({
        url:`/system-service/sysdictconfig/enable/${data.dictId}`,
        method: 'post',
    })
}
//停用sql字典
export const stopSqlDict = (data:any) => {
    return request({
        url:`/system-service/sysdictconfig/stop/${data.dictId}`,
        method: 'post',
    })
}

