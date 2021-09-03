/*
 * @Author: 张文奇
 * @LastEditTime: 2020-04-15 15:55:23
 * @LastEditors: 张文奇
 * @Description:
 * @FilePath: \web-op\src\api\his\user\workerManager.ts
 */
import axios from '@/utils/request.ts'
export interface  IItemWorker {
    academicDegreeId:number | string//	最高学位代码
    addrNumber?:number | string//地址-门牌号码
    birthday?:string	//出生日期
    cityId?:number | string	//现住址-市	integer(int32)
    countryId?:number | string//	国籍代码	integer(int32)
    countyId?:number | string//	现住址-县	integer(int32)
    degreeId?:number | string//	学历代码	integer(int32)
    deptId?:number | string //所在科室
    doctorYbCode?:number | string // 医师标识码
    email?:string//	电子邮件地址	string
    empNo?:number | string//	工作证号	string
    entryDate?:string//	到本单位日期	string
    hospitalId?:number//	医疗机构ID	integer(int32)
    marriageTypeId?:number| string//	婚姻状况类别代码	integer(int32)
    mobileNumber?:number | string//	职工手机	string
    nationId?:number | string//	民族代码	integer(int32)
    officeTelephone?:string//	办公室电话	string
    personName?:string//姓名
    personClassId?:number | string//	职工分类标志	string
    personId?:number | string//	唯一ID	integer(int32)
    postClassId?:number | string//	职务等级	integer(int32)
    provinceId?:number | string//	现住址-省	integer(int32)
    recordNumber?:string//	身份证号码	string
    searchPharm?:string//		string
    sexId?:number | string//	性别代码	integer(int32)
    telephone?:string//	联系电话号码	string
    titleClassId?:number | string//	职称等级	integer(int32)
    townshipAddr?:number | string//	地址-乡（镇、街道办事处）	string
    unvalidDate?:string//锁定时间
    villageAddr?:number | string//	地址-村（街、路、弄等	string
    deptIdName:string;
    postClassIdName:string;
    addressValue:string,//自定义省市区字符串
}

// 新增
export const addEhrservicepersonal= (data: any) =>
    axios.request({
        url: "/op-service/ehrservicepersonal/add",
        method: "post",
        data
    });

// 注销
export const lock = (data: any) =>
    axios.request({
        url: "/op-service/ehrservicepersonal/lock",
        method: "post",
        data
    });

// 复原
export const unlock = (data: any) =>
    axios.request({
        url: "/op-service/ehrservicepersonal/unlock",
        method: "post",
        data
    });

export const editEhrservicepersonal = (data: any) =>
    axios.request({
        url: "/op-service/ehrservicepersonal/edit",
        method: "post",
        data
    });

export const querySysgroupList = (data: any) =>
    axios.request({
        url: "/op-service/ehrservicepersonal/queryPage",
        method: "post",
        data
    });


export const getOneSysgroup = (data: any) =>
    axios.request({
        url: "/system-service/sys/sysgroup/getOneByEntity",
        method: "post",
        data
    });

export const findSysgroupList = (data: any) =>
    axios.request({
        url: "/system-service/sys/sysgroup/findList",
        method: "post",
        data
    });

// 工号查重
export const checkEmpNo = (data: any) =>
    axios.request({
        url: "/op-service/ehrservicepersonal/check",
        method: "post",
        data
    });

// 证件查重
export const checkCert = (data: any) =>
    axios.request({
        url: "/op-service/ehrservicepersonal/validCret",
        method: "post",
        data
    });

