import axios from '@/utils/request.ts';

// 查询结算列表数据
export const getSettlementData = (data: any) =>
	axios.request({
		url: '/op-service/balanceAccounts/queryBalanceAccountsList',
		method: 'post',
		data
	});

// //查询结算详情的病人信息
// export const getSettlementPatientInfo = (data: any) =>
//   axios.request({
//     url: '/op-service/balanceAccounts/queryPatientBalanceAccountsBaseInfo',
//     method: 'post',
//     data
//   })

// 查询病人缴款项目明细
export const getSettlementPatientProject = (data: any) =>
	axios.request({
		url: '/op-service/patientManage/queryCardPatientCostInfoList',
		method: 'post',
		data
	});

// 查询结算详情的病人信息
export const getSettlementPatientInfo = (data: any) =>
	axios.request({
		url: '/op-service/patientManage/queryCardPatientInfo',
		method: 'post',
		data,
		headers: {
			'Res-Type': 'special'
		}
	});

//查询交款记录
export const getCostRecord = (data: any) =>
	axios.request({
		url: '/op-service/patientManage/queryCardPatientCostRecord',
		method: 'post',
		data
	});

//获取费用清单的病人费用信息
export const getCostBaseInfo = (data: any) =>
	axios.request({
		url: '/op-service/patientManage/queryCardPatientCostBaseInfo',
		method: 'post',
		data
	});

//结算处理页面的结算金额和补退金额汇总
export const getAccountsSettle = (data: any) =>
	axios.request({
		url: '/op-service/balanceAccounts/queryBalanceAccountsSettle',
		method: 'post',
		data
	});

// 获取发票号码
export const getInvoice = () =>
	axios.request({
		url: '/op-service/costManage/getCurrentInvoice',
		method: 'post'
	});

// 获取发票号码
export const saveSettleAccounts = (data: any) =>
	axios.request({
		url: '/op-service/balanceAccounts/saveSettleAccounts',
		method: 'post',
		data,
		headers: {
			'Content-Type': 'application/json'
		}
	});

// 普通作废
export const accountCancel = (data: any) =>
	axios.request({
		url: '/op-service/balanceAccounts/patientBalanceAccountsCancel',
		method: 'post',
		data,
		headers: {
			'Content-Type': 'application/json'
		}
	});

//发票打印信息查询
export const doQueryZyfpdy = (data: any) =>
	axios.request({
		url: '/op-service/balanceAccounts/doQueryZyfpdy',
		method: 'post',
		data
	});
