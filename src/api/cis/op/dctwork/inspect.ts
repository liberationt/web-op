/*
 * @Author: wangyao
 * @LastEditTime: 2020-08-31 09:49:32
 * @LastEditors: wangyao
 * @Description:
 * @FilePath: \web-op\src\api\cis\op\dctwork\inspect.ts
 */
import request from '@/utils/request';

/**
 * @Description:
 * @author: zhml
 * @param {type}: pid  null 全部数据，pid为父级节点
 * @return: list
 * @date 2020/6/28
*/
export const queryData = (data: any) => {
	return request({
		url: '/system-service/dicyjlx/loadDicData',
		method: 'post',
		data
	});
};

/**
 * @Description: 查询诊疗项目列表
 * @author: zhml
 * @param {type}: { brxz:'',yjlx:'',pageNum:'',pageSize:'' }
 * @return: list
 * @date 2020/6/29
*/
export const queryZlxmList = (data: any) => {
	return request({
		url: '/system-service/diczlxm/queryZlxmList',
		method: 'post',
		data
	});
};

/**
 * @Description: 保存门诊检查申请单
 * @author: zhml
 * @param {type}: object
 * @return:
 * @date 2020/6/29
*/
export const saveZlxmList = (data: any) => {
	return request({
		url: '/op-service/cisjcsq01/saveMzjcSqd',
		method: 'post',
		data,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

//根据id查询jclx
export const getById = (data: any) => {
	return request({
		url: '/system-service/dicyjlx/getById',
		method: 'post',
		data
	});
};
//根据id查询申请单信息
export const queryEmrZlxmInfo = (data: any) => {
	return request({
		url: '/im-service/cishzyz/queryDicZlxmInfo',
		method: 'post',
		data
	});
};
// 获取病理检查申请打印数据
export const queryBljcPrintData = (data: any) => {
	return request({
		url: `/op-service/cisjcsq01/getBljcsqPrintData?jcxh=${data}`,
		method: 'post',
	});
};
// 获取检查申请单打印数据
export const queryJcsqPrintData = (data: any) => {
	return request({
		url: `/op-service/cisjcsq01/getJcsqPrintData?jcxh=${data}`,
		method: 'post',
	});
};

// 获取医院logo
export const queryLogo = (data: any) => {
    return request({
        url: `/system-service/dicyljg/logo?hospitalId=${data}`,
        method: 'post',
    })
}