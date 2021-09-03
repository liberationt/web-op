import axios from '@/utils/request.ts'
// 医院数据字典

// 获取基本字典
export const getBaseDict = () => {
	return axios.request({
		url: "/dict/config/base",
		method: "post",
	})
}


// 医院数据字典分组新增
export const addDictGroup = (data:any) => {
	return axios.request({
		url: "/dict/config/group",
        method: "post",
		data,
	})
}

// 医院数据字典分组查询
export const queryDictGroup = (data:any) => {
	return axios.request({
		url: "/dict/config/group/list",
        method: "post",
        data
	})
}

// 医院数据字典分组编辑
export const editDictGroup = (data:any) => {
	return axios.request({
		url: `/dict/config/group/update/${data.id}`,
        method: "post",
		data,
	})
}

// 医院数据字典分组删除
export const delDictGroup = (id:any) => {
	return axios.request({
		url: `/dict/config/group/delete/${id}`,
		method: "post"
	})
}


// 获取拼音码五笔码
export const createPyWb = (data:any) => {
	return axios.request({
		url: `/dict/config/base/create`,
		data,
		method: "post"
	})
}

// 新增字典类型
export const addDict = (data:any) => {
	return axios.request({
		url: `/dict/config/type`,
		data,
		method: "post"
	})
}

// 移动字典分组
export const moveDictGroup = (data:any) => {
	return axios.request({
		url: `/dict/config/type/${data.typeId}/${data.groupId}`,
		data,
		method: "post"
	})
}



// 编辑字典类型
export const editDict = (data: any) => {
	return axios.request({
		url: `/dict/config/type/update/${data.id}`,
		data,
		method: "post"
	})
}

// 医院数据字典删除
export const delDict = (id: any) => {
	return axios.request({
		url: `/dict/config/type/delete/${id}`,
		method: "post"
	})
}

// 医院数据字典状态改变
export const typeChangeStatus = (id: any) => {
	return axios.request({
		url: `/dict/config/type/status/${id}`,
		method: "post"
	})
}


// 医院数据字典属性获取
export const getAttrList = (data: any) => {
	return axios.request({
		url: `/dict/config/attr/list/${data.typeId}`,
		data,
		method: "post"
	})
}

// 医院数据字典属性新增
export const addAttrList = (data: any) => {
	return axios.request({
		url: `/dict/config/attr`,
		data,
		method: "post"
	})
}
// 医院数据字典属性编辑
export const editAttrList = (data: any) => {
	return axios.request({
		url: `/dict/config/attr/update/${data.id}`,
		data,
		method: "post"
	})
}

// 医院数据字典属性删除
export const delAttrList = (id: any) => {
	return axios.request({
		url: `/dict/config/attr/delete/${id}`,
		method: "post"
	})
}

// 查询字典类型属性key是否可用
export const checkAttrKey = (data: any) => {
	return axios.request({
		url: `/dict/config/attr/check/${data.typeId}`,
		data,
		method: "post"
	})
}

// 上移/下移字典属性
export const attrOffset = (data: any) => {
	return axios.request({
		url: `/dict/config/attr/${data.offsetType}/${data.attrId}`,
		data,
		method: "post"
	})
}



// 查询字典类型全部属性
export const useType_condition = (data: any) => {
	return axios.request({
		url: `/dict/config/attr/list/${data.typeId}/${data.useType}`,
		data,
		method: "post"
	})
}

// 查询字典数据列表
export const getDictDataList = (data: any) => {
	return axios.request({
		url: `/dict/data/${data.typeId}/list`,
		data,
		method: "post"
	})
}

// 查询字典数据列表
export const getDictDataChildList = (data: any) => {
	return axios.request({
		url: `/dict/data/${data.dataId}/child/list`,
		data,
		method: "post"
	})
}

// 查询字典全部属性数据
export const getDictAttrData = (data: any) => {
	return axios.request({
		url: `/dict/data/get/${data.dataId}`,
		data,
		method: "post"
	})
}

// 新增字典数据
export const addDictData = (data: any) => {
	return axios.request({
		url: `/dict/data/${data.typeId}`,
		data,
		method: "post",
        headers: {
			"Content-Type": "application/json"
		}
	})
}

// 字典操作接口
export const operationsType = (data: any) => {
	return axios.request({
		url: `/dict/data/${data.dataId}/${data.operationsType}`,
		data,
		method: "post",
        headers: {
			"Content-Type": "application/json"
		}
	})
}

// 数据上下移
export const dataOffset = (data: any) => {
	return axios.request({
		url: `/dict/data/data/${data.offsetType}/${data.dataId}`,
		data,
		method: "post",
        headers: {
			"Content-Type": "application/json"
		}
	})
}

// 数据启用停用
export const statusChange = (data: any) => {
	return axios.request({
		url: `/dict/data/data/status/${data.id}`,
		data,
		method: "post",
        headers: {
			"Content-Type": "application/json"
		}
	})
}




