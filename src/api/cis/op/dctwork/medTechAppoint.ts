/*
 * @Date:
 * @LastEditors: dmj
 * @LastEditTime:
 * @description:  医技预约
 */

import request from '@/utils/request';

// export const appointSave = (data: any) => {
// 	return request({
// 		url: '/op-service/opbrzd/save',
// 		method: 'post',
// 		data,
// 		headers: {
// 			'Content-Type': 'application/json'
// 		}
// 	});
// };
//医技预约html
export const queryYjyy4Html = () => {
	return request({
		url: '/system-service/diczlxm/queryYjyy4Html',
		method: 'post'
	});
};

//医技预约html查询
export const queryYjyyData = (data: any) => {
	return request({
		url: '/op-service/diczlxm/queryYjyyData',
		method: 'post',
		data
	});
};

//查询诊间医技预病人信息
export const loadPatientInfo = (data: any) => {
	return request({
		url: '/op-service/yygl/loadPatientInfo',
		method: 'post',
		data
	});
};

//查询医技预病人申请单详细信息
export const loadSqdDetailInfo = (data: any) => {
	return request({
		url: '/op-service/yygl/loadSqdDetailInfo',
		method: 'post',
		data
	});
};

//查询设备指定日期最近的号源
export const queryRecentTimeByHyrq = (data: any) => {
	return request({
		url: '/op-service/yygl/queryRecentTimeByHyrq',
		method: 'post',
		data
	});
};

//查询设备最近的号源
export const queryRecentTime = (data: any) => {
	return request({
		url: '/system-service/diczlxm/queryRecentTime',
		method: 'post',
		data
	});
};

//查询诊间医技预约时间View数据
export const queryYysjView = (data: any) => {
	return request({
		url: '/op-service/diczlxm/queryYysjView',
		method: 'post',
		data
	});
};

//门诊或住院医技预约保存
export const saveSqdFromMZorZY = (data: any) => {
	return request({
		url: '/op-service/diczlxm/saveSqdFromMZorZY',
		method: 'post',
		data
	});
};

//查询医技检查申请单列表
export const queryJcSqdList = (data: any) => {
	return request({
		url: '/op-service/yygl/queryJcSqdList',
		method: 'post',
		data
	});
};

//判断号源是否已经被占用
export const checkHyid = (data: any) => {
	return request({
		url: '/op-service/yygl/checkHyid',
		method: 'post',
		data
	});
};

//解冻设备号源
export const unfreezeSBHH = (data: any) => {
	return request({
		url: '/op-service/yygl/unfreezeSBHH',
		method: 'post',
		data
	});
};

//冻结设备号源
export const freezeSBHH = (data: any) => {
	return request({
		url: '/op-service/yygl/freezeSBHH',
		method: 'post',
		data
	});
};

//医技取消;
export const cancelYjyy = (data: any) => {
	return request({
		url: '/op-service/diczlxm/cancelYjyy',
		method: 'post',
		data
	});
};

// 调用emr病程记录信息
export const queryBcjlByEmr = (data: any) => {
	return request({
		url: '/op-service/msbcjl/queryBcjlByEmr',
		method: 'post',
		data
	});
};