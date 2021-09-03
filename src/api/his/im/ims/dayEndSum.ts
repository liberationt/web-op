import axios from '@/utils/request.ts';

// 查询前的校验
export const doQueryVerification = (data: any) =>
	axios.request({
		url: '/op-service/zyReport/doQueryVerification',
		method: 'post',
		data
	});

//产生前的校验
export const doGenerateVerification = (data: any) =>
	axios.request({
		url: '/op-service/zyReport/doGenerateVerification',
		method: 'post',
		data
	});
//产生后的校验
export const doGenerateAfterVerification = (data: any) =>
	axios.request({
		url: '/op-service/zyReport/doGenerateAfterVerification',
		method: 'post',
		data
	});
//汇总前的校验
export const doCollectVerification = (data: any) =>
	axios.request({
		url: '/op-service/zyReport/doCollectVerification',
		method: 'post',
		data
	});
//汇总保存
export const doSaveCollect = (data: any) =>
	axios.request({
		url: '/op-service/zyReport/doSaveCollect',
		method: 'post',
		data
	});
//取消汇总前的查询
export const doQueryCancelCollectCommit = () =>
	axios.request({
		url: '/op-service/zyReport/doQueryCancelCollectCommit',
		method: 'post'
	});
//确定取消汇总
export const doCancelCollectCommit = (data: any) =>
	axios.request({
		url: '/op-service/zyReport/doCancelCollectCommit',
		method: 'post',
		data
	});
