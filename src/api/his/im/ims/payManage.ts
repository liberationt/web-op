import axios from '@/utils/request.ts';

// 注销缴款处理
export const logoutPayment = (data: any) =>
	axios.request({
		url: '/op-service/costManage/patientPayCancel',
		method: 'post',
		data
	});

// 住院号查询病人信息
export const searchPatientByZYH = (data: any) =>
	axios.request({
		url: '/op-service/costManage/queryCostPatientCollectByZyh',
		method: 'post',
		data
	});

// 就诊卡号查询病人信息
export const searchPatientByJZKH = (data: any) =>
	axios.request({
		url: '/op-service/costManage/queryCostPatientCollectByJzkh',
		method: 'post',
		data
	});

// 病人床号查询病人信息
export const searchPatientByBRCH = (data: any) =>
	axios.request({
		url: '/op-service/costManage/queryCostPatientCollectByBrch',
		method: 'post',
		data
	});

// 病人姓名查询病人信息
export const searchPatientByBRXM = (data: any) =>
	axios.request({
		url: '/op-service/costManage/queryCostPatientListByBrxm',
		method: 'post',
		data
	});

// 病人预交费保存
export const searchPatientSave = (data: any) =>
	axios.request({
		url: '/op-service/costManage/patientCostInsert',
		method: 'post',
		data
	});

//获取收据号码
export const getBillNo = () =>
	axios.request({
		url: '/op-service/costManage/getCurrentBill',
		method: 'post'
	});

//获取总金额
export const getAccountTotal = (data: any) =>
	axios.request({
		url: '/op-service/costManage/queryPatientCostTotal',
		method: 'post',
		data
	});

//获取当前用户的机构名称
export const getHospitalName = () =>
	axios.request({
		url: '/op-service/costManage/getHospitalName',
		method: 'post'
	});

//获取打印的数据
export const jksjPrint = (data: any) =>
	axios.request({
		url: '/op-service/zyReport/jksjPrint',
		method: 'post',
		data
	});
