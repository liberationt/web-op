/*
 * @Author: 曹俊
 * @LastEditTime: 2020-04-28 14:12:18
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\medinsuinterface\physicianRegister.ts
 */
import axios from '@/utils/request'

export interface IForm {
	beginDate?: string,
    birthday: string,
    caption: string,
    cerDate?: string,
    dataVersion?: number,
    deptName1: string,
    deptName2: string,
    deptName3: string,
    doctorLevel: string,
    doctorName: string,
    doctorSex: string,
    doctorType: string,
    doctorYbCode: string,
    documentNo: string,
    documentType: string,
    empNo: string,
    endDate?: string,
    gmtCreate?: string,
    gmtModify?: string,
    highEdu?: string,
    hospitalId?: number,
    hspCode: string,
    hspName: string,
    ifDrugDoctor: string,
    ifGyzDoctor: string,
    ifSyzDoctor: string,
    ifTxDoctor: string,
    isHsp: string,
    lockFlag?: string,
    quaNo: string,
    undeter: string,
    workNo: string,
    workPlace: string,
    workRange1: string,
    workRange2: string,
    workRange3?: string,
    ybdoctordataId?: number | null
  }

//add医师注册信息
export const addData = (data: any) => {
    return axios.request({
        url: "/op-service/shybyszcxx/add",
        data,
        method: "post"
    })
};

//edit医师注册信息
export const editData = (data: any) => {
    return axios.request({
        url: "/op-service/shybyszcxx/edit",
        data,
        method: "post"
    })
};

//锁定医师注册信息
export const statusLock = (data: any) => {
    return axios.request({
        url: "/op-service/shybyszcxx/lock",
        data,
        method: "post"
    })
};

//解锁医师注册信息
export const statusUnlock = (data: any) => {
    return axios.request({
        url: "/op-service/shybyszcxx/unlock",
        data,
        method: "post"
    })
};
