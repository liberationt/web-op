import request from '@/utils/request';

// 获取特殊符号
export const findList = (data: any) => {
	return request({
		url: '/op-service/emrtsfh/findList',
		method: 'post',
		data
	});
};


// 获取检验单详情
export const queryInspectListDetail = (data: any) => {
	return request({
		url: '/op-service/opyjcf01/queryAuxiliaryJyDetail',
		method: 'post',
		data
	});
};

// 获取检验单列表
export const queryInspectList = (data: any) => {
	return request({
		url: '/op-service/opyjcf01/queryAuxiliaryJyReportList',
		method: 'post',
		data
	});
};


// 获取检验单列表
export const queryInspectReport = (data: any) => {
	return request({
		url: '/op-service/opyjcf01/findList',
		method: 'post',
		data
	});
};




// 获取检验单列表
export const deleteInspectReport = (data: any) => {
	return request({
		url: '/op-service/opyjcf01/auxiliaryJyDel',
		method: 'post',
		data
	});
};


// 获取检查列表
export const queryAuxiliaryList = (data: any) => {
	return request({
		url: '/op-service/cisjcsq01/queryAuxiliaryJcReportList',
		method: 'post',
		data
	});
};

// 获取检查列表
export const queryAuxiliaryDetail = (data: any) => {
	return request({
		url: '/op-service/cisjcsq01/getJcxmDetail',
		method: 'post',
		data
	});
};

// 获取检查报告
export const queryAuxiliayReport = (data: any) => {
	return request({
		url: '/op-service/cisjcsq01/findList',
		method: 'post',
		data
	});
};


// 获取检查报告
export const deleteById = (data: any) => {
	return request({
		url: '/op-service/cisjcsq01/auxiliaryJcDel',
		method: 'post',
		data
	});
};






